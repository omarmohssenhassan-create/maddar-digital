import {spawn} from 'node:child_process';
import {access, mkdir, open} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);

async function probe(url) {
  try {
    const response = await fetch(url, {signal: AbortSignal.timeout(1500)});
    const html = await response.text();
    return response.ok && /<title>Maddar Digital\s*\|/.test(html) ? 'site' : 'occupied';
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') return 'available';
    throw new Error(`Cannot check ${url}: ${error.message}`);
  }
}

async function openBrowser(url) {
  const command = process.platform === 'win32' ? 'powershell.exe'
    : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32'
    ? ['-NoProfile', '-NonInteractive', '-Command', 'Start-Process -FilePath $env:MADDAR_PREVIEW_URL -ErrorAction Stop']
    : [url];
  await new Promise((resolve, reject) => {
    const browser = spawn(command, args, {
      windowsHide: true,
      stdio: 'ignore',
      env: {...process.env, MADDAR_PREVIEW_URL: url}
    });
    browser.once('error', reject);
    browser.once('exit', code => code === 0 ? resolve() : reject(new Error(`Browser launcher exited with code ${code}`)));
  });
}

async function main() {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a whole number from 1 to 65535.');
  }
  await access(path.join(root, 'dist', 'index.html'));
  const url = `http://127.0.0.1:${port}`;
  const status = await probe(url);
  if (status === 'occupied') {
    throw new Error(`Port ${port} is used by another application. Set PORT to a free port and try again.`);
  }
  if (status === 'site') {
    console.log('Maddar Digital is already running. Reusing the existing preview.');
  } else {
    const logDirectory = path.join(root, '.qa');
    await mkdir(logDirectory, {recursive: true});
    const output = await open(path.join(logDirectory, 'local-server.out.log'), 'a');
    const errors = await open(path.join(logDirectory, 'local-server.err.log'), 'a');
    let server;
    try {
      server = spawn(process.execPath, [path.join(root, 'server.mjs')], {
        cwd: root,
        env: {...process.env, PORT: String(port)},
        detached: true,
        windowsHide: true,
        stdio: ['ignore', output.fd, errors.fd]
      });
      await new Promise((resolve, reject) => {
        server.once('spawn', resolve);
        server.once('error', reject);
      });
    } finally {
      await Promise.all([output.close(), errors.close()]);
    }
    server.unref();
    let ready = false;
    try {
      for (let attempt = 0; attempt < 50; attempt++) {
        if (server.exitCode !== null) break;
        if (await probe(url) === 'site') { ready = true; break; }
        await delay(100);
      }
      if (!ready) throw new Error(`The preview did not start. See ${path.join(logDirectory, 'local-server.err.log')}`);
    } catch (error) {
      if (server.exitCode === null) server.kill();
      throw error;
    }
    console.log(`Started Maddar Digital (PID ${server.pid}).`);
  }
  console.log(`Local: ${url}`);
  if (!process.argv.includes('--no-open')) {
    try { await openBrowser(url); }
    catch { console.error(`The browser could not open automatically. Open ${url} in your browser.`); }
  }
}

main().catch(error => {
  console.error(`Cannot start Maddar Digital: ${error.message}`);
  process.exitCode = 1;
});
