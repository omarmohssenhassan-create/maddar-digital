(() => {
  const fail = (code, details={}) => Object.assign(new Error(code), {code, ...details});
  const quantity = value => {
    const n=Number(globalThis.PosTools.normalizeDigits(value));
    if(!Number.isSafeInteger(n)||n<1||n>9999)throw fail('quantity');
    return n;
  };
  class InventoryEngine {
    constructor(products){this.initial=products.map(p=>({...p}));this.reset();}
    reset(){this.products=this.initial.map(p=>({...p}));this.movements=[];}
    move(id,type,value,note=''){
      const product=this.products.find(p=>p.id===id);
      if(!product)throw fail('product');
      if(!['in','out'].includes(type))throw fail('movement');
      const amount=quantity(value);
      if(type==='out'&&amount>product.stock)throw fail('stock',{stock:product.stock});
      if(type==='in'&&product.stock+amount>99999)throw fail('quantity');
      product.stock+=type==='in'?amount:-amount;
      const movement={id:this.movements.length+1,productId:id,type,quantity:amount,balance:product.stock,note:String(note).trim().slice(0,120),time:Date.now()};
      this.movements.unshift(movement);return movement;
    }
  }
  class MenuEngine {
    constructor(items){this.items=items.map(p=>({...p}));this.reset();}
    reset(){this.cart=new Map();}
    set(id,value){
      const item=this.items.find(p=>p.id===id);
      if(!item||!item.available)throw fail('unavailable');
      const n=quantity(value);if(n>20)throw fail('menuLimit');
      this.cart.set(id,n);
    }
    add(id){this.set(id,(this.cart.get(id)||0)+1);}
    remove(id){this.cart.delete(id);}
    get lines(){return [...this.cart].map(([id,quantity])=>({...this.items.find(p=>p.id===id),quantity,total:this.items.find(p=>p.id===id).price*quantity}));}
    get total(){return this.lines.reduce((sum,item)=>sum+item.total,0);}
    get count(){return [...this.cart.values()].reduce((sum,n)=>sum+n,0);}
  }
  globalThis.DemoTools={InventoryEngine,MenuEngine};
})();
