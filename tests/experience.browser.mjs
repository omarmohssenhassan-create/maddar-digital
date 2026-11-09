import {chromium} from '../.tools/qa/node_modules/playwright/index.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];await mkdir('.qa',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{window.open=url=>{window.testOpenedUrl=url;};});
 const go=async(route,lang='ar')=>{await page.goto('http://127.0.0.1:4173/?lang='+lang+'#'+route);await page.evaluate(()=>document.fonts.ready);};
 await go('/demos/menu');assert.equal(await page.locator('.menu-dish').count(),6);
 await page.locator('#menu-search').fill('لاتيه');assert.equal(await page.locator('.menu-dish').count(),1);
 await page.locator('#menu-search').fill('');await page.locator('[data-menu-category="desserts"]').click();assert.equal(await page.locator('.menu-dish').count(),2);assert.equal(await page.locator('[data-menu-add="m6"]').isDisabled(),true);
 await page.locator('[data-menu-category="all"]').click();
 await page.locator('#menu-items [data-menu-add="m1"]').click();await page.locator('#menu-items [data-menu-add="m1"]').click();await page.locator('#menu-items [data-menu-add="m3"]').click();
 assert.equal(await page.locator('.menu-order-line').count(),2);assert.match(await page.locator('.menu-grand-total').innerText(),/٣٦٥/);
 await page.locator('[data-menu-quantity="m1"]').fill('3');await page.locator('[data-menu-quantity="m1"]').dispatchEvent('change');
 await page.locator('[data-menu-remove="m3"]').click();await page.locator('.language-switch').click();
 assert.equal(await page.locator('[data-menu-quantity="m1"]').inputValue(),'3');assert.match(await page.locator('.menu-grand-total').innerText(),/435/);
 await page.locator('[data-menu-summary]').click();assert.equal(await page.locator('#sample-dialog').evaluate(el=>el.open),true);assert.match(await page.locator('#sample-dialog').innerText(),/No order was sent/);
 await page.keyboard.press('Escape');await page.locator('[data-sample-reset]').click();assert.equal(await page.locator('.menu-order-line').count(),0);assert.equal(await page.locator('[data-menu-summary]').isDisabled(),true);checks.push('menu search, filtering, quantities, removal, totals, unavailable items, summary, language state and reset');
 await go('/demos/inventory');assert.equal(await page.locator('#stock-stats > div').nth(1).locator('b').innerText(),'٥٧');
 await page.locator('#stock-direction').selectOption('out');await page.locator('#stock-amount').fill('25');await page.locator('#stock-movement button').click();assert.notEqual(await page.locator('#stock-error').innerText(),'');assert.equal(await page.locator('[data-stock-id="SKU-101"] .stock-number').innerText(),'٢٤');
 await page.locator('#stock-amount').fill('5');await page.locator('#stock-note').fill('<img src=x onerror=alert(1)>');await page.locator('#stock-movement button').click();assert.equal(await page.locator('[data-stock-id="SKU-101"] .stock-number').innerText(),'١٩');assert.equal(await page.locator('#stock-history img').count(),0);assert.match(await page.locator('#stock-history').innerText(),/<img/);
 await page.locator('[data-stock-low]').click();assert.equal(await page.locator('#stock-rows tr').count(),2);
 await page.locator('#stock-product').selectOption('SKU-104');await page.locator('#stock-direction').selectOption('in');await page.locator('#stock-amount').fill('7');await page.locator('.language-switch').click();assert.equal(await page.locator('#stock-product').inputValue(),'SKU-104');assert.equal(await page.locator('#stock-amount').inputValue(),'7');
 await page.locator('#stock-movement button').click();assert.equal(await page.locator('#stock-rows tr').count(),1);assert.equal(await page.locator('#stock-history li').count(),2);
 const download=page.waitForEvent('download');await page.locator('[data-stock-export]').click();assert.equal((await download).suggestedFilename(),'maddar-sample-inventory.csv');
 await page.locator('[data-sample-reset]').click();assert.equal(await page.locator('#stock-rows tr').count(),5);assert.equal(await page.locator('#stock-stats > div').nth(1).locator('b').innerText(),'57');assert.equal(await page.locator('#stock-stats > div').nth(2).locator('b').innerText(),'2');checks.push('stock in/out, overselling prevention, escaped notes, low-stock alerts, language state, CSV export and reset');
 await go('/');await page.locator('[data-activity="restaurant"]').click();await page.locator('.activity-request').click();await page.waitForURL(/#\/contact/);await page.locator('.standalone-contact').waitFor();assert.equal(await page.locator('#activity').inputValue(),'restaurant');assert.notEqual(await page.locator('#service').inputValue(),'');assert.equal(await page.locator('#service-hint').isVisible(),true);
 await page.locator('#message').fill('My details.');await page.locator('[data-brief="briefMenu"]').click();assert.match(await page.locator('#message').inputValue(),/^My details\./);
 await page.locator('#contact-form button[type="submit"]').click();assert.equal(await page.locator('[aria-invalid="true"]').count(),2);
 await page.locator('#name').fill('Omar Mohssen');await page.locator('#phone').fill('01212213033');await page.locator('#contact-form button[type="submit"]').click();
 const wa=await page.evaluate(()=>window.testOpenedUrl);assert.match(wa,/^https:\/\/wa.me\/201212213033\?text=/);assert.match(decodeURIComponent(wa),/My details\./);assert.match(decodeURIComponent(wa),/مطعم/);checks.push('activity prefill, service hint, non-destructive brief prompts, form validation and prepared WhatsApp request');
 await go('/');await page.locator('.faq-list summary').nth(0).click();await page.locator('.faq-list summary').nth(1).click();await page.waitForTimeout(50);assert.equal(await page.locator('.faq-list details[open]').count(),1);
 assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'),/maddardigital.com\/assets/);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://maddardigital.com/');
 for(const lang of ['ar','en'])for(const width of [360,768,1440])for(const route of ['/','/about','/demos','/demos/menu','/demos/inventory','/privacy','/contact','/services/menu']){
  await page.setViewportSize({width,height:960});await go(route,lang);
  assert.equal(await page.locator('main').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,lang+' '+width+' '+route);
  assert.deepEqual(await page.evaluate(()=>[...window.I18N.missing]),[]);
  assert.equal((await page.locator('#app').innerText()).includes('01212213033'),false);
  assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);
  if(lang==='en'){const text=await page.locator('#app').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.language-switch').forEach(n=>n.remove());return copy.textContent;});assert.equal(/[\u0600-\u06ff]/.test(text),false,'Untranslated copy on '+route);}
 }
 await page.setViewportSize({width:390,height:844});await go('/');await page.locator('.menu-toggle').click();await page.locator('#main-nav a').first().focus();await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.hero-copy').evaluate(el=>getComputedStyle(el).animationName),'none');
 checks.push('48 responsive route/language combinations, FAQ, sharing metadata, keyboard navigation and reduced motion');
 assert.deepEqual(errors,[]);await writeFile('.qa/experience-report.json',JSON.stringify({status:'passed',checks,errors},null,2));console.log('Passed: '+checks.join('; '));
}finally{await browser.close();}
