import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.zip':'application/zip','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4'};
const port=Number(process.env.PORT||4173);
export const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const decoded=decodeURIComponent(url.pathname);
    const target=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
    if(!target.startsWith(root+path.sep)&&target!==path.join(root,'index.html')) {res.writeHead(403);return res.end();}
    const data=await readFile(target);
    const headers={'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if(range){
      const start=range[1]?Number(range[1]):Math.max(0,data.length-Number(range[2]));
      const end=range[1]&&range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=data.length){res.writeHead(416,{'Content-Range':'bytes */'+data.length});return res.end();}
      res.writeHead(206,{...headers,'Content-Range':'bytes '+start+'-'+end+'/'+data.length,'Content-Length':end-start+1});return res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));
    }
    res.writeHead(200,{...headers,'Content-Length':data.length});
    res.end(req.method==='HEAD'?undefined:data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('الصفحة غير موجودة');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
