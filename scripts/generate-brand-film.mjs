import {chromium} from '../.tools/qa/node_modules/playwright/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 for(const language of ['ar','en']){
  await page.goto('http://127.0.0.1:4173/');await page.addScriptTag({content:await readFile('scripts/brand-film-canvas.js','utf8')});
  const result=await page.evaluate(lang=>window.createMaddarFilm(lang),language);
  const video=Buffer.from(result.video,'base64');if(video.length>5*1024*1024)throw Error('Video exceeds direct upload limit');
  await writeFile('dist/assets/maddar-film-'+language+'.mp4',video);await writeFile('dist/assets/maddar-film-'+language+'-poster.jpg',Buffer.from(result.poster,'base64'));
  console.log(JSON.stringify({language,duration:result.duration,width:result.width,height:result.height,bytes:video.length}));
 }
}finally{await browser.close();}
