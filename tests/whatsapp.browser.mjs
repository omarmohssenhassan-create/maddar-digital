import {chromium} from '../.tools/qa/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const base='http://127.0.0.1:4173',target='https://wa.me/201212213033';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.open=url=>{window.openedWhatsapp=url;window.openCount=(window.openCount||0)+1;return null;};});
 for(const lang of ['ar','en']){
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of ['/','/contact']){
    await page.goto(base+'/?lang='+lang+'#'+route);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.whatsapp-float').textContent(),'');
    assert.equal(await page.locator('.footer-whatsapp').textContent(),'');
    assert.equal(await page.locator('#app').innerText().then(text=>text.includes('01212213033')),false);
    assert.equal(await page.locator('.whatsapp-float').getAttribute('href'),target);
    assert.equal(await page.locator('.footer-whatsapp').getAttribute('href'),target);
    assert.equal(await page.locator('.whatsapp-chat-link').getAttribute('href'),target);
    assert.equal(await page.locator('.whatsapp-qr,script[src*="qrcode"]').count(),0);
    assert.equal(await page.evaluate(()=>typeof window.qrcode),'undefined');
    assert.doesNotMatch(await page.locator('.whatsapp-card').innerText(),/scan|camera|امسح|كاميرا/i);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+lang+' '+width+' '+route);
    assert.deepEqual(await page.evaluate(()=>[...window.I18N.missing]),[]);
    if(route==='/contact'&&[390,1440].includes(width))await page.screenshot({path:'.qa/whatsapp-'+lang+'-'+width+'.png',fullPage:true});
   }
  }
 }
 checks.push('16 Arabic/English mobile, tablet and desktop views: no contact QR code or scan instructions; direct WhatsApp links match and no horizontal scrolling');
 await page.goto(base+'/?lang=en#/contact?service=menu');
 await page.locator('.whatsapp-chat-link').focus();
 await page.waitForFunction(()=>document.querySelector('.whatsapp-float').hidden);
 assert.equal(await page.locator('.whatsapp-float').isVisible(),false,'Contact card replaces floating shortcut near form');
 assert.equal(await page.locator('.whatsapp-chat-link').evaluate(a=>a===document.activeElement),true);
 await page.locator('.form-submit').click();
 assert.equal(await page.evaluate(()=>window.openCount||0),0);
 await page.locator('#name').fill('QA client');await page.locator('#phone').fill('01012345678');await page.locator('#activity').selectOption('restaurant');await page.locator('#message').fill('A menu & website');
 await page.locator('.form-submit').click();
 const url=new URL(await page.evaluate(()=>window.openedWhatsapp));
 assert.equal(url.origin+url.pathname,target);
 assert.match(url.searchParams.get('text'),/Digital Menus/);
 assert.match(url.searchParams.get('text'),/A menu & website/);
 await page.locator('.language-switch').click();
 assert.equal(await page.evaluate(()=>window.openCount),1);
 assert.equal(await page.locator('#name').inputValue(),'QA client');
 assert.equal(await page.locator('.whatsapp-chat-link').getAttribute('href'),target);
 checks.push('Keyboard-accessible WhatsApp button; required fields block submission; correct encoded form destination; language switch keeps data without reopening WhatsApp');
 await page.evaluate(()=>{window.SITE_CONFIG.company.whatsapp='201012345678';window.dispatchEvent(new HashChangeEvent('hashchange'));});
 assert.equal(await page.locator('.whatsapp-chat-link').getAttribute('href'),'https://wa.me/201012345678');
 for(const number of ['', 'invalid']){
  await page.evaluate(number=>{window.SITE_CONFIG.company.whatsapp=number;window.dispatchEvent(new HashChangeEvent('hashchange'));},number);
  assert.equal(await page.locator('a[href*="wa.me"],.whatsapp-card,.whatsapp-float').count(),0);
 }
 await page.locator('#name').fill('عميل تجريبي');await page.locator('#phone').fill('01012345678');await page.locator('#activity').selectOption('restaurant');
 await page.locator('.form-submit').click();
 assert.match(await page.locator('#request-result').textContent(),/لم يُرسل/);
 assert.equal(await page.evaluate(()=>window.openCount),1);
 checks.push('Changing the configured number updates the contact link; empty/invalid settings hide all links and preserve truthful draft-only form');
 assert.deepEqual(errors,[]);
 await writeFile('.qa/whatsapp-report.json',JSON.stringify({status:'passed',checks,errors},null,2));
 console.log(JSON.stringify({status:'passed',checks,errors},null,2));
}finally{await browser.close();}
