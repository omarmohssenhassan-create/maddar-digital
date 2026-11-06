import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf'};
const port=Number(process.env.PORT||4173);
export const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const decoded=decodeURIComponent(url.pathname);
    const target=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
    if(!target.startsWith(root+path.sep)&&target!==path.join(root,'index.html')) {res.writeHead(403);return res.end();}
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('الصفحة غير موجودة');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
