import path from 'node:path';
import {mkdir,readdir,readFile,writeFile,copyFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {deflateRawSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=path.join(root,'dist'),output=path.join(root,'release','maddar-digital-upload');
const files=(await readdir(dist,{withFileTypes:true})).filter(f=>f.isFile()&&(/\.(html|js|css|xml|txt)$/.test(f.name)||f.name==='_headers')).map(f=>f.name);
files.push('assets/arabic.ttf','assets/FONT-LICENSE.txt','assets/maddar-logo-original.jpeg','assets/maddar-brand-banner.jpeg');
files.push('assets/maddar-film-ar.mp4','assets/maddar-film-en.mp4','assets/maddar-film-ar-poster.jpg','assets/maddar-film-en-poster.jpg');
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=data=>{let crc=0xffffffff;for(const value of data)crc=crcTable[(crc^value)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;};
const local=[],central=[],manifest=[];let offset=0;
for(const file of files){
 const source=path.join(dist,file),target=path.join(output,file);await mkdir(path.dirname(target),{recursive:true});await copyFile(source,target);
 const data=await readFile(source);if(data.length>5*1024*1024)throw Error('Asset exceeds dashboard upload limit: '+file);
 const name=Buffer.from(file),compressed=deflateRawSync(data),crc=crc32(data),header=Buffer.alloc(30),entry=Buffer.alloc(46);
 header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(name.length,26);
 entry.writeUInt32LE(0x02014b50,0);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(8,10);entry.writeUInt32LE(crc,16);entry.writeUInt32LE(compressed.length,20);entry.writeUInt32LE(data.length,24);entry.writeUInt16LE(name.length,28);entry.writeUInt32LE(offset,42);
 local.push(header,name,compressed);central.push(entry,name);offset+=header.length+name.length+compressed.length;
 manifest.push({file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
const html=await readFile(path.join(output,'index.html'),'utf8');
for(const [,file]of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(file))await access(path.join(output,file));
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
const archive=path.join(root,'release','maddar-digital-upload.zip');await writeFile(archive,Buffer.concat([...local,directory,end]));
await writeFile(path.join(root,'release','deployment-manifest.json'),JSON.stringify({createdAt:new Date().toISOString(),files:manifest},null,2));
console.log(JSON.stringify({folder:output,archive,fileCount:files.length,totalBytes:manifest.reduce((n,f)=>n+f.bytes,0),indexAtRoot:true}));
