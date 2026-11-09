import {test} from 'node:test';
import assert from 'node:assert/strict';
import '../dist/engine.js';
import '../dist/demo-engine.js';
const {InventoryEngine,MenuEngine}=globalThis.DemoTools;
test('stock movements update balances, preserve history and reject invalid operations atomically',()=>{
 const initial=[{id:'one',stock:3,minimum:2}],engine=new InventoryEngine(initial);
 engine.move('one','in','٢','delivery');assert.equal(engine.products[0].stock,5);
 engine.move('one','out',5);assert.equal(engine.products[0].stock,0);assert.equal(engine.movements.length,2);
 assert.equal(engine.movements[1].balance,5);
 for(const value of [1,-2,0,1.5,'',NaN,Infinity,10000]){
  const before=JSON.stringify(engine);assert.throws(()=>engine.move('one','out',value));assert.equal(JSON.stringify(engine),before);
 }
 assert.throws(()=>engine.move('one','unsupported',2));assert.throws(()=>engine.move('missing','in',2));
 engine.reset();assert.equal(engine.products[0].stock,3);assert.equal(engine.movements.length,0);assert.equal(initial[0].stock,3);
});
test('menu totals, unavailable dishes, sample limits and reset are consistent',()=>{
 const engine=new MenuEngine([{id:'a',available:true,price:14500},{id:'b',available:true,price:7500},{id:'c',available:false,price:8500}]);
 engine.add('a');engine.add('a');engine.add('b');assert.equal(engine.count,3);assert.equal(engine.total,36500);
 engine.set('a','٣');assert.equal(engine.total,51000);
 for(const value of [0,-1,1.1,'',21,Infinity])assert.throws(()=>engine.set('a',value));
 assert.equal(engine.cart.get('a'),3);assert.throws(()=>engine.add('c'));assert.throws(()=>engine.add('missing'));
 engine.remove('b');assert.equal(engine.total,43500);engine.reset();assert.equal(engine.total,0);assert.equal(engine.count,0);
});
