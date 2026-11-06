import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/engine.js';
const {PosEngine,normalizeSearch,validPhone,whatsappNumber,safeUrl}=globalThis.PosTools;
const sample=[{id:'coffee',name:'قهوة',code:'1001',price:8500,stock:3,category:'مشروبات'},{id:'rice',name:'أرز مصري',code:'1002',price:3500,stock:2,category:'أغذية'}];
test('sale atomically deducts stock and preserves independent receipt lines',()=>{
  const p=new PosEngine(sample);p.add('coffee');p.setQuantity('coffee',2);p.add('rice');
  assert.equal(p.total,20500);assert.equal(p.product('coffee').stock,3);
  const r=p.checkout();assert.equal(r.total,20500);assert.equal(p.product('coffee').stock,1);assert.equal(p.product('rice').stock,1);assert.equal(p.count,0);
  p.add('coffee');p.checkout();assert.equal(r.lines[0].quantity,2);assert.equal(r.total,20500);assert.equal(p.receipt.number,2);
});
test('rejects overselling and invalid quantities without altering the cart',()=>{
  const p=new PosEngine(sample);p.add('coffee');
  for(const q of [4,0,-1,1.5,NaN,'','no',Infinity])assert.throws(()=>p.setQuantity('coffee',q));
  assert.equal(p.cart.get('coffee'),1);assert.equal(p.product('coffee').stock,3);
  p.setQuantity('coffee','٣');assert.equal(p.cart.get('coffee'),3);
});
test('out-of-stock products cannot be sold and checkout cannot be empty',()=>{
  const p=new PosEngine(sample);assert.throws(()=>p.checkout());p.setQuantity('rice',2);p.checkout();assert.throws(()=>p.add('rice'));
});
test('checkout preflight prevents partial deductions if stock changed',()=>{
  const p=new PosEngine(sample);p.add('coffee');p.setQuantity('rice',2);p.product('rice').stock=1;
  assert.throws(()=>p.checkout());assert.equal(p.product('coffee').stock,3);assert.equal(p.count,3);
});
test('remove and reset restore all initial data without mutating config',()=>{
  const p=new PosEngine(sample);p.add('rice');p.remove('rice');assert.equal(p.total,0);
  p.add('coffee');p.checkout();p.add('rice');p.reset();assert.deepEqual(p.inventory,sample);assert.equal(p.count,0);assert.equal(p.receipt,null);assert.equal(sample[0].stock,3);
});
test('search supports Arabic names, normalized letters, Arabic codes and category',()=>{
  const p=new PosEngine(sample);
  assert.equal(p.search('ارز')[0].id,'rice');assert.equal(p.search('١٠٠١')[0].id,'coffee');assert.equal(p.search('قهوه')[0].id,'coffee');assert.equal(p.search('','أغذية').length,1);assert.equal(p.search('not here').length,0);
  assert.equal(normalizeSearch(' أَرْز '),'ارز');
});
test('mobile validation accepts Egyptian local and international forms only',()=>{
  for(const n of ['01012345678','01112345678','01212345678','01512345678','+201012345678','201012345678','٠١٠١٢٣٤٥٦٧٨'])assert.equal(validPhone(n),true,n);
  for(const n of ['123','01412345678','0101234567','010123456789','+101012345678','<script>'])assert.equal(validPhone(n),false,n);
});
test('unconfigured or unsafe contact and login links stay unavailable',()=>{
  assert.equal(whatsappNumber(''),'');assert.equal(whatsappNumber('0123456789'),'');assert.equal(whatsappNumber('+20 1012345678'),'201012345678');
  assert.equal(safeUrl('javascript:alert(1)'),'');assert.equal(safeUrl('http://example.com'),'');assert.equal(safeUrl('https://example.com/login'),'https://example.com/login');
});