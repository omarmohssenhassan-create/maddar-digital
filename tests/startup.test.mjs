import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import http from 'node:http';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';

const execute = promisify(execFile);
const launcher = fileURLToPath(new URL('../scripts/start-local.mjs', import.meta.url));
const run = port => execute(process.execPath, [launcher, '--no-open'], {
  // Launch from outside the checkout to catch relative-path startup failures.
  cwd: fileURLToPath(new URL('../../', import.meta.url)),
  env: {...process.env, PORT: String(port)},
  timeout: 15000,
  windowsHide: true
});
const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const close = server => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));

test('the launcher starts a usable preview and safely reuses it on the next launch', async () => {
  const reservation = http.createServer();
  await listen(reservation);
  const port = reservation.address().port;
  await close(reservation);
  const {stdout} = await run(port);
  const pid = Number(stdout.match(/PID (\d+)/)?.[1]);
  assert.ok(pid, stdout);
  try {
    const base = `http://127.0.0.1:${port}`;
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<title>Maddar Digital/);
    const app = await fetch(base + '/app.js');
    assert.equal(app.status, 200);
    assert.match(app.headers.get('content-type'), /javascript/);
    const second = await run(port);
    assert.match(second.stdout, /already running/);
    assert.doesNotMatch(second.stdout, /Started Maddar Digital/);
    assert.equal((await fetch(base)).status, 200);
  } finally {
    process.kill(pid);
  }
});

test('the launcher reports an unrelated application occupying the port', async () => {
  const other = http.createServer((request, response) => response.end('Another application'));
  await listen(other);
  try {
    await assert.rejects(run(other.address().port), error => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /used by another application/);
      assert.doesNotMatch(error.stdout, /Local:/);
      return true;
    });
  } finally {
    await close(other);
  }
});

test('the launcher rejects an invalid port with an actionable error', async () => {
  await assert.rejects(run('invalid'), error => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /PORT must be a whole number/);
    return true;
  });
});
