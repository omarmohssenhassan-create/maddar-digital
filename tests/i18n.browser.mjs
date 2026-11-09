import {chromium} from '../.tools/qa/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
await mkdir('.qa',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 await page.addInitScript(()=>{window.open=url=>{window.testOpenedUrl=url;return null;};});
 page.setDefaultTimeout(10000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const navigate=async(lang,route='/')=>{await page.goto(base+'/?lang='+lang+'#'+route);await page.evaluate(()=>document.fonts.ready);};
 const assertLocale=async lang=>{
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  assert.deepEqual(await page.evaluate(()=>[...window.I18N.missing]),[]);
  assert.match(await page.title(),/Maddar Digital/);
  if(lang==='en'){
   const text=await page.locator('#app').evaluate(el=>{const c=el.cloneNode(true);c.querySelectorAll('.language-switch').forEach(n=>n.remove());return c.textContent;});
   assert.equal(/[\u0600-\u06ff]/.test(text),false,'Arabic copy remains in English page: '+text.match(/[\u0600-\u06ff][^<]*/)?.[0]?.slice(0,100));
  }
 };
 await navigate('ar');await assertLocale('ar');
 assert.match(await page.locator('.brand').first().getAttribute('aria-label'),/^Maddar Digital/);
 assert.equal(await page.locator('#about').count(),1);
 assert.equal(await page.locator('.about-values article').count(),3);
 assert.equal(await page.locator('.brand-logo').first().evaluate(img=>img.complete&&img.naturalWidth>0),true);
 await page.screenshot({path:'.qa/madar-ar-desktop.png'});
 await page.locator('.about-section').screenshot({path:'.qa/madar-about-ar.png'});
 await page.locator('#main-nav a[href="#/about"]').click();
 assert.equal(await page.locator('.about-page h1').count(),1);
 await assertLocale('ar');
 checks.push('Maddar Digital logo, home About section, dedicated About page and Arabic brand content');
 await navigate('ar','/contact?service=apps');
 await page.locator('#name').fill('عميل تجريبي');await page.locator('#phone').fill('01012345678');await page.locator('#activity').selectOption('company');await page.locator('#message').fill('A project brief stays unchanged.');
 await page.locator('.language-switch').click();
 await assertLocale('en');
 assert.equal(await page.locator('#name').inputValue(),'عميل تجريبي');
 assert.equal(await page.locator('#message').inputValue(),'A project brief stays unchanged.');
 assert.equal(await page.locator('#service').inputValue(),'apps');
 assert.equal(await page.locator('#service option:checked').textContent(),'Mobile Apps');
 await page.locator('#name').fill('Test client');await page.locator('#phone').fill('123');
 await page.locator('.form-submit').click();
 assert.match(await page.locator('#phone-error').textContent(),/valid Egyptian mobile/);
 await page.locator('#phone').fill('01012345678');await page.locator('.form-submit').click();
 assert.match(await page.locator('#request-text').textContent(),/Hello Maddar Digital/);
 assert.match(await page.locator('#request-result').textContent(),/send the message yourself/);
 await page.locator('.language-switch').click();
 assert.match(await page.locator('#request-text').textContent(),/تطبيقات الموبايل/);
 assert.equal(await page.locator('#name').inputValue(),'Test client');
 await page.locator('.language-switch').click();await page.screenshot({path:'.qa/madar-contact-en.png',fullPage:true});
 checks.push('Form values and generated request survive language changes; validation, summaries and status messages are translated');
 for(const lang of ['ar','en']){
  await navigate(lang);
  if(lang==='en')await page.screenshot({path:'.qa/madar-en-desktop.png'});
  for(const route of ['/about','/services/web','/services/apps','/services/erp','/services/pos','/services/menu','/services/marketing','/contact','/demo','/missing']){
   await navigate(lang,route);await assertLocale(lang);
   if(route==='/about'&&lang==='en')await page.screenshot({path:'.qa/madar-about-en.png',fullPage:true});
   assert.ok(await page.locator('h1').count()||route==='/contact');
  }
 }
 checks.push('All six service pages, About, contact, POS and missing-page routes translated in both languages; no missing message keys');
 await navigate('en','/demo');
 await page.locator('#product-search').fill('coffee');
 assert.equal(await page.locator('.product-card').count(),1);
 assert.match(await page.locator('.product-card h3').textContent(),/Ground coffee/);
 await page.locator('[data-add="coffee"]').click();await page.locator('[data-quantity="coffee"]').fill('2');await page.locator('[data-quantity="coffee"]').press('Tab');
 await page.locator('.language-switch').click();
 assert.equal(await page.locator('[data-quantity="coffee"]').inputValue(),'2');
 assert.equal(await page.locator('#product-search').inputValue(),'coffee');
 await page.locator('.language-switch').click();
 assert.equal(await page.locator('[data-quantity="coffee"]').inputValue(),'2');
 assert.match(await page.locator('#cart-total').textContent(),/170.*EGP/);
 await page.locator('[data-quantity="coffee"]').fill('13');await page.locator('[data-quantity="coffee"]').press('Tab');
 assert.match(await page.locator('#toast').textContent(),/Not enough stock/);
 await page.locator('#checkout').click();assert.match(await page.locator('#receipt-title').textContent(),/Inventory updated/);
 assert.match(await page.locator('.receipt-lines').textContent(),/Ground coffee/);
 await page.locator('.continue-sale').click();
 await page.locator('.language-switch').click();
 await page.locator('#last-receipt').click();assert.match(await page.locator('.receipt-lines').textContent(),/قهوة/);await page.locator('.dialog-close').click();
 await page.locator('.language-switch').click();
 await page.locator('.reset-demo').click();assert.equal(await page.locator('.empty-cart').count(),1);
 await page.locator('#product-search').fill('قهوه');assert.equal(await page.locator('.product-card').count(),1);
 checks.push('Arabic and English product search; cart and search survive language changes; translated stock limits, receipts and reset');
 await navigate('en');
 await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');
 assert.equal(await page.evaluate(()=>localStorage.getItem('madar-language')),'en');
 await navigate('ar');assert.equal(await page.locator('html').getAttribute('lang'),'ar');
 checks.push('Shareable ?lang links, persistent preference and explicit URL language override');
 let responsiveChecks=0;
 for(const lang of ['ar','en']){
  for(const width of [320,390,650,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/','/about','/services/pos','/services/menu','/contact','/demo']){
    await navigate(lang,route);await assertLocale(lang);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Horizontal overflow '+lang+' '+width+' '+route);
    const collisions=await page.locator('.header-inner').evaluate(el=>{
     const nodes=[el.querySelector('.brand'),el.querySelector('#main-nav'),el.querySelector('.header-actions')].filter(n=>n&&getComputedStyle(n).display!=='none').map(n=>n.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0);
     return nodes.some((a,i)=>nodes.some((b,j)=>i<j&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>1));
    });
    assert.equal(collisions,false,'Header overlap '+lang+' '+width+' '+route);
    if(width===390&&route==='/')await page.screenshot({path:'.qa/madar-'+lang+'-mobile.png'});
    responsiveChecks++;
   }
  }
 }
 checks.push(responsiveChecks+' responsive route checks across both languages and six widths; no header overlaps or horizontal scrolling');
 await page.setViewportSize({width:390,height:844});await navigate('en');
 await page.locator('.menu-toggle').click();await page.locator('#main-nav a[href="#/about"]').click();
 assert.equal(await page.locator('.about-page h1').textContent(),await page.evaluate(()=>window.MADAR_EN.about.title+window.MADAR_EN.about.accent));
 await navigate('en','/contact?service=menu');
 await page.evaluate(()=>{window.SITE_CONFIG.company.whatsapp='201012345678';window.open=url=>{window.testOpenedUrl=url;return null;};window.dispatchEvent(new HashChangeEvent('hashchange'));});
 await page.locator('#name').fill('English client');await page.locator('#phone').fill('01012345678');await page.locator('#activity').selectOption('restaurant');await page.locator('.form-submit').click();
 const opened=await page.evaluate(()=>window.testOpenedUrl);assert.match(decodeURIComponent(opened),/Hello Maddar Digital/);assert.match(decodeURIComponent(opened),/Digital Menus/);
 checks.push('English mobile navigation and English WhatsApp payload; opening intercepted and no message sent');
 assert.deepEqual(errors,[]);
 await writeFile('.qa/i18n-report.json',JSON.stringify({status:'passed',checks,consoleErrors:errors},null,2));
 console.log(JSON.stringify({status:'passed',checks,consoleErrors:errors},null,2));
} finally {await browser.close();}
