(() => {
  const normalizeDigits = value => String(value).replace(/[٠-٩]/g,d=>String(d.charCodeAt(0)-1632)).replace(/[۰-۹]/g,d=>String(d.charCodeAt(0)-1776));
  const normalizeSearch = value => normalizeDigits(value).toLowerCase().trim().replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[ًٌٍَُِّْ]/g,"");
  class PosEngine {
    constructor(products) {
      this.initial=products.map(p=>({...p}));
      this.reset();
    }
    reset() { this.inventory=this.initial.map(p=>({...p})); this.cart=new Map(); this.receipt=null; this.sequence=0; }
    product(id) { const p=this.inventory.find(p=>p.id===id); if(!p) throw new Error("الصنف غير موجود."); return p; }
    add(id) { return this.setQuantity(id,(this.cart.get(id)||0)+1); }
    setQuantity(id,quantity) {
      const p=this.product(id);
      const q=Number(normalizeDigits(quantity));
      if(!Number.isSafeInteger(q)||q<1) throw new Error("اكتب كمية صحيحة تبدأ من ١.");
      if(q>p.stock) throw new Error("الكمية أكبر من المتاح. المتاح من "+p.name+": "+p.stock);
      this.cart.set(id,q); return q;
    }
    remove(id) { this.cart.delete(id); }
    get lines() { return [...this.cart].map(([id,quantity])=>({...this.product(id),quantity,total:this.product(id).price*quantity})); }
    get total() { return this.lines.reduce((sum,line)=>sum+line.total,0); }
    get count() { return this.lines.reduce((sum,line)=>sum+line.quantity,0); }
    search(query,category="الكل") { const q=normalizeSearch(query); return this.inventory.filter(p=>(category==="الكل"||p.category===category)&&(normalizeSearch(p.name).includes(q)||p.code.includes(q))); }
    checkout() {
      if(!this.cart.size) throw new Error("أضف صنفًا للفاتورة الأول.");
      const lines=this.lines;
      for(const line of lines) if(line.quantity>this.product(line.id).stock) throw new Error("راجع الكمية المتاحة من "+line.name);
      const total=this.total;
      for(const line of lines) this.product(line.id).stock-=line.quantity;
      this.receipt={number:++this.sequence,lines:lines.map(l=>({...l})),total};
      this.cart.clear(); return this.receipt;
    }
  }
  const safeUrl=value=>{try { const u=new URL(value); return u.protocol==="https:"?u.href:""; } catch { return ""; }};
  const whatsappNumber=value=>{const n=normalizeDigits(value||"").replace(/[+\s()-]/g,"");return /^[1-9]\d{7,14}$/.test(n)?n:"";};
  const normalizePhone=value=>normalizeDigits(value).replace(/[\s()-]/g,"");
  const validPhone=value=>/^(?:\+?20|0)1[0125]\d{8}$/.test(normalizePhone(value));
  globalThis.PosTools={PosEngine,normalizeSearch,normalizeDigits,safeUrl,whatsappNumber,normalizePhone,validPhone};
})();