import {chromium} from '../.tools/qa/node_modules/playwright/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',headless:true});
const report=[],errors=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const csp=(await readFile('dist/_headers','utf8')).match(/Content-Security-Policy: (.+)/)[1];
 await page.route('**/*',async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});});
 for(const lang of ['ar','en']){
  await page.goto('http://127.0.0.1:4173/?lang='+lang);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.studio-service').count(),6);assert.equal(await page.locator('.studio-process-grid article').count(),4);
  const video=page.locator('#brand-film');assert.equal(await video.getAttribute('src'),null);await video.scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert.equal(await video.evaluate(v=>v.paused),true);assert.equal(await video.getAttribute('src'),null,'Reduced motion should avoid automatic video downloads');
  await page.locator('#film-toggle').click();await page.waitForFunction(()=>document.getElementById('brand-film').readyState>=2);
  await page.waitForFunction(()=>document.getElementById('brand-film').duration>17);
  const metadata=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,src:v.currentSrc,muted:v.muted}));
  assert.ok(metadata.duration>17&&metadata.duration<20);assert.equal(metadata.width,1280);assert.equal(metadata.height,720);assert.equal(metadata.muted,true);assert.match(metadata.src,new RegExp('maddar-film-'+lang+'\\.mp4'));
  await page.waitForFunction(()=>document.getElementById('brand-film').currentTime>.1);await page.locator('#film-toggle').click();assert.equal(await video.evaluate(v=>v.paused),true);
  await video.evaluate(v=>{v.currentTime=6.8;});await page.waitForTimeout(150);await video.screenshot({path:'.qa/studio-film-'+lang+'.png'});
  await page.locator('#services').scrollIntoViewIfNeeded();await page.locator('#services').screenshot({path:'.qa/studio-services-'+lang+'.png'});
  report.push({language:lang,metadata,manualControls:'passed',reducedMotion:'passed',csp:'passed'});
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/?lang=ar');await page.locator('.menu-toggle').click();await page.locator('#main-nav a[href="#/?section=process"]').click();await page.waitForURL(/section=process/);await page.waitForFunction(()=>{const r=document.getElementById('process').getBoundingClientRect();return r.top<180;});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 assert.ok(await page.locator('a[href="https://wa.me/201212213033"]').count()>0);
 assert.equal(await page.locator('a[href*="201299990913"]').count(),0);assert.equal((await page.locator('#app').innerText()).includes('01212213033'),false);
 const response=await page.request.get('http://127.0.0.1:4173/assets/maddar-film-ar.mp4',{headers:{Range:'bytes=0-63'}});assert.equal(response.status(),206);assert.equal(response.headers()['content-type'],'video/mp4');assert.equal((await response.body()).length,64);
 assert.deepEqual(errors,[]);await writeFile('.qa/studio-report.json',JSON.stringify({status:'passed',checks:report,newWhatsApp:'passed',videoRangeRequests:'passed',errors},null,2));console.log('Passed: original Arabic/English MP4 playback, duration, seek, controls, reduced motion, CSP, service visuals, process navigation, mobile layout and new WhatsApp destination.');
}finally{await browser.close();}
