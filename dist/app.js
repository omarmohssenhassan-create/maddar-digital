(() => {
  const {e,icon,art,money}=window.UI;
  const {PosEngine,normalizeDigits,normalizePhone,validPhone,whatsappNumber}=window.PosTools;
  const config=window.SITE_CONFIG;
  const pos=new PosEngine(config.demoProducts);
  const app=document.getElementById("app");
  let query="",category="الكل",toastTimer;
  const counts=value=>Number(value).toLocaleString("ar-EG");
  function toast(message) {
    const node=document.getElementById("toast");
    node.textContent=message;node.classList.add("visible");
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("visible"),4000);
  }
  function activity(id){
    const a=config.activities.find(a=>a.id===id)||config.activities[0];
    document.querySelectorAll("[data-activity]").forEach(tab=>{
      const selected=tab.dataset.activity===a.id;
      tab.classList.toggle("selected",selected);
      tab.setAttribute("aria-selected",selected);
      tab.tabIndex=selected?0:-1;
    });
    const target=document.getElementById("activity-result");
    target.setAttribute("aria-labelledby","tab-"+a.id);
    target.innerHTML='<div><span class="activity-result-label">مناسب لـ '+e(a.title)+'</span><h3>'+e(a.description)+'</h3></div><div class="activity-service-links">'+a.services.map(id=>{
      const s=config.services.find(s=>s.id===id);
      return '<a href="#/services/'+s.id+'">'+icon(s.icon)+e(s.title)+icon("chevron")+'</a>';
    }).join("")+'</div>';
  }
  function renderProducts(){
    const products=pos.search(query,category);
    const node=document.getElementById("products");
    node.innerHTML=products.length?products.map(p=>{
      const reserved=pos.cart.get(p.id)||0;
      const unavailable=reserved>=p.stock;
      return '<article class="product-card '+(p.stock===0?'out-of-stock':'')+'"><div class="product-image" style="--product-color:'+p.color+'">'+art(p.art,p.color)+'<span class="stock-pill '+(p.stock<=3?'low-stock':'')+'">'+(p.stock===0?'نفد المخزون':counts(p.stock)+' متاح')+'</span></div><div class="product-details"><small>كود <bdi>'+e(p.code)+'</bdi></small><h3>'+e(p.name)+'</h3><div><b>'+money(p.price)+'</b><button class="add-product" data-add="'+p.id+'" aria-label="إضافة '+e(p.name)+' للفاتورة" '+(unavailable?'disabled':'')+'>'+icon("plus")+'</button></div></div></article>';
    }).join(""):'<div class="no-products">'+icon("search")+'<h3>مفيش صنف بالبحث ده</h3><p>جرّب اسم تاني أو كود من 1001 لحد 1006.</p><button class="button button-outline button-small" id="clear-search">اعرض كل الأصناف</button></div>';
  }
  function renderCart(){
    const lines=pos.lines;
    document.getElementById("cart-count").textContent=counts(lines.length);
    document.getElementById("item-count").textContent=counts(pos.count);
    document.getElementById("cart-total").innerHTML=money(pos.total);
    document.getElementById("cart-total").setAttribute("aria-live","polite");
    document.getElementById("checkout").disabled=!lines.length;
    document.getElementById("cart-lines").innerHTML=lines.length?'<div class="cart-lines-list">'+lines.map(line=>'<article class="cart-line" data-cart-id="'+line.id+'"><div class="cart-line-heading"><div><h3>'+e(line.name)+'</h3><small>'+money(line.price)+' / قطعة</small></div><button class="remove-line" data-remove="'+line.id+'" aria-label="حذف '+e(line.name)+'">'+icon("trash")+'</button></div><div class="cart-line-bottom"><div class="quantity-control"><button data-increment="'+line.id+'" aria-label="زيادة كمية '+e(line.name)+'" '+(line.quantity>=line.stock?'disabled':'')+'>'+icon("plus")+'</button><input type="number" inputmode="numeric" min="1" step="1" max="'+line.stock+'" value="'+line.quantity+'" data-quantity="'+line.id+'" aria-label="كمية '+e(line.name)+'"><button data-decrement="'+line.id+'" aria-label="تقليل كمية '+e(line.name)+'" '+(line.quantity<=1?'disabled':'')+'>'+icon("minus")+'</button></div><b>'+money(line.total)+'</b></div></article>').join("")+'</div>':'<div class="empty-cart"><span>'+icon("cart")+'</span><h3>الفاتورة لسه فاضية</h3><p>اضغط + جنب أي صنف<br>عشان تبدأ أول عملية بيع.</p></div>';
    const last=document.getElementById("last-receipt");last.hidden=!pos.receipt;
  }
  function updatePos(){renderProducts();renderCart();}
  function receipt(){
    const r=pos.receipt;if(!r)return;
    const d=document.getElementById("receipt-dialog");
    d.innerHTML='<button class="dialog-close" aria-label="إغلاق الفاتورة">'+icon("close")+'</button><div class="receipt-success">'+icon("check")+'</div><span class="eyebrow">عملية تجريبية ناجحة</span><h2 id="receipt-title">تم البيع وتحديث المخزون</h2><p class="receipt-subtitle">فاتورة تجريبية رقم '+counts(r.number)+' · بدون أي دفع</p><div class="receipt-lines">'+r.lines.map(l=>'<div><span>'+e(l.name)+' <small>× '+counts(l.quantity)+'</small></span><b>'+money(l.total)+'</b></div>').join("")+'</div><div class="receipt-total"><span>الإجمالي</span><b>'+money(r.total)+'</b></div><p class="receipt-note">'+icon("box")+' الكميات اتخصمت من المخزون التجريبي.</p><button class="button button-orange continue-sale">ابدأ فاتورة جديدة '+icon("arrow")+'</button>';
    if(!d.open)d.showModal();
  }
  function bindContact(){
    const form=document.getElementById("contact-form");if(!form)return;
    const errors={name:"اكتب اسمك من حرفين على الأقل.",phone:"اكتب رقم موبايل مصري صحيح، مثل 01012345678.",activity:"اختار نوع نشاطك.",service:"اختار الخدمة المطلوبة."};
    function validField(name){
      const input=form.elements[name],value=input.value.trim();
      const valid=name==="name"?value.length>=2&&value.length<=80:name==="phone"?validPhone(value):name==="activity"?[...config.activities.map(a=>a.id),"other"].includes(value):config.services.some(s=>s.id===value);
      input.setAttribute("aria-invalid",!valid);
      document.getElementById(name+"-error").textContent=valid?"":errors[name];
      return valid;
    }
    ["name","phone","activity","service"].forEach(name=>{
      form.elements[name].addEventListener("blur",()=>validField(name));
      form.elements[name].addEventListener("input",()=>{
        if(form.elements[name].getAttribute("aria-invalid")==="true")validField(name);
        document.getElementById("request-result").hidden=true;
      });
    });
    form.elements.message.addEventListener("input",()=>document.getElementById("request-result").hidden=true);
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const fields=["name","phone","activity","service"];
      const invalid=fields.filter(name=>!validField(name));
      if(invalid.length){form.elements[invalid[0]].focus();return;}
      const data=Object.fromEntries(new FormData(form));
      const selectedService=config.services.find(s=>s.id===data.service);
      const selectedActivity=config.activities.find(a=>a.id===data.activity);
      const text="أهلًا "+config.company.name+"، حابب أطلب عرض أو ديمو مخصص.\n\nالاسم: "+data.name.trim()+"\nالموبايل: "+normalizePhone(data.phone)+"\nنوع النشاط: "+(selectedActivity?.title||"نشاط آخر")+"\nالخدمة المطلوبة: "+selectedService.title+(data.message.trim()?"\nالرسالة: "+data.message.trim():"");
      const wa=whatsappNumber(config.company.whatsapp);
      const result=document.getElementById("request-result");
      const url=wa?"https://wa.me/"+wa+"?text="+encodeURIComponent(text):"";
      result.hidden=false;
      result.innerHTML='<b>'+icon(wa?"whatsapp":"check")+(wa?'رسالتك جاهزة على واتساب':'طلبك جاهز للنسخ')+'</b><p>'+(wa?'راجع الرسالة واضغط إرسال بنفسك داخل واتساب. لو المحادثة مافتحتش، استخدم الرابط تحت.':'لم يُرسل الطلب. التواصل المباشر لم يتفعّل بعد، وتقدر تحتفظ بالملخص دلوقتي.')+'</p><pre id="request-text">'+e(text)+'</pre><div class="request-actions"><button type="button" class="button button-outline button-small" id="copy-request">'+icon("copy")+' نسخ الطلب</button>'+(wa?'<a class="button button-navy button-small" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">افتح واتساب '+icon("arrow")+'</a>':'')+'</div>';
      document.getElementById("copy-request").addEventListener("click",async()=>{
        try { await navigator.clipboard.writeText(text);toast("تم نسخ الطلب.");}
        catch {
          const range=document.createRange();range.selectNodeContents(document.getElementById("request-text"));
          const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
          const copied=document.execCommand("copy");toast(copied?"تم نسخ الطلب.":"حدد النص وانسخه للاحتفاظ بطلبك.");
        }
      });
      if(wa)window.open(url,"_blank","noopener,noreferrer");
      result.scrollIntoView({behavior:"smooth",block:"nearest"});
    });
  }
  function bindDemo(){
    document.getElementById("product-search").addEventListener("input",ev=>{query=ev.target.value;renderProducts();});
    document.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>{
      category=button.dataset.category;
      document.querySelectorAll("[data-category]").forEach(b=>{b.classList.toggle("selected",b===button);b.setAttribute("aria-pressed",b===button);});
      renderProducts();
    }));
    document.getElementById("products").addEventListener("click",ev=>{
      const add=ev.target.closest("[data-add]");
      if(add){try {pos.add(add.dataset.add);updatePos();document.querySelector('[data-add="'+add.dataset.add+'"]')?.focus();}catch(error){toast(error.message);}}
      if(ev.target.closest("#clear-search")){
        query="";category="الكل";document.getElementById("product-search").value="";
        document.querySelector('[data-category="الكل"]').click();
        document.getElementById("product-search").focus();
      }
    });
    document.getElementById("cart-lines").addEventListener("click",ev=>{
      const button=ev.target.closest("button");if(!button)return;
      const {remove,increment,decrement}=button.dataset;
      try {
        if(remove)pos.remove(remove);
        if(increment)pos.add(increment);
        if(decrement)pos.setQuantity(decrement,(pos.cart.get(decrement)||1)-1);
        updatePos();
      }catch(error){toast(error.message);}
    });
    document.getElementById("cart-lines").addEventListener("change",ev=>{
      const id=ev.target.dataset.quantity;if(!id)return;
      try {pos.setQuantity(id,normalizeDigits(ev.target.value));updatePos();}
      catch(error){toast(error.message);ev.target.value=pos.cart.get(id);ev.target.focus();}
    });
    document.getElementById("checkout").addEventListener("click",()=>{
      try{pos.checkout();updatePos();receipt();}catch(error){toast(error.message);}
    });
    document.querySelector(".reset-demo").addEventListener("click",()=>{
      pos.reset();query="";category="الكل";
      document.getElementById("product-search").value="";
      document.querySelector('[data-category="الكل"]').click();
      updatePos();toast("رجّعنا الأصناف والكميات لبداية التجربة.");
    });
    document.getElementById("last-receipt").addEventListener("click",receipt);
    updatePos();
  }
  function render(){
    const raw=location.hash.slice(1)||"/";
    const url=new URL(raw.startsWith("/")?raw:"/"+raw,location.href.startsWith("file:")?"https://local.test":location.origin);
    const path=url.pathname.replace(/\/$/,"")||"/";
    const serviceId=path.startsWith("/services/")?path.split("/")[2]:"";
    let route="home",html="",title="";
    const dialog=document.getElementById("receipt-dialog");if(dialog.open)dialog.close();
    if(path==="/"){html=window.Views.home();title="حلول رقمية للأعمال";}
    else if(path==="/demo"){route="demo";query="";category="الكل";html=window.Views.demo();title="جرّب الكاشير";}
    else if(path==="/contact"){route="contact";html=window.Views.contact(url.searchParams.get("service"),url.searchParams.get("activity"));title="اطلب ديمو";}
    else if(serviceId&&config.services.some(s=>s.id===serviceId)){
      route="service";const s=config.services.find(s=>s.id===serviceId);html=window.Views.service(s);title=s.title;
    }else{route="missing";html=window.Views.missing();title="الصفحة غير موجودة";}
    document.title=title+" | "+config.company.name;
    app.innerHTML=window.Views.header(route)+html+window.Views.footer();
    document.getElementById("main").tabIndex=-1;
    document.querySelector(".menu-toggle").addEventListener("click",ev=>{
      const b=ev.currentTarget,expanded=b.getAttribute("aria-expanded")==="true";
      b.setAttribute("aria-expanded",!expanded);b.setAttribute("aria-label",expanded?"فتح القائمة":"إغلاق القائمة");
      document.getElementById("main-nav").classList.toggle("open",!expanded);
      b.innerHTML=icon(expanded?"menu":"close");
    });
    if(route==="home"){
      activity("shop");
      document.querySelectorAll("[data-activity]").forEach(button=>{
        button.addEventListener("click",()=>activity(button.dataset.activity));
        button.addEventListener("keydown",ev=>{
          const tabs=[...document.querySelectorAll("[data-activity]")],i=tabs.indexOf(button);
          let next=null;
          if(ev.key==="ArrowLeft")next=(i+1)%tabs.length;
          if(ev.key==="ArrowRight")next=(i-1+tabs.length)%tabs.length;
          if(ev.key==="Home")next=0;if(ev.key==="End")next=tabs.length-1;
          if(next!==null){ev.preventDefault();tabs[next].click();tabs[next].focus();}
        });
      });
    }
    if(route==="demo")bindDemo();
    bindContact();
    requestAnimationFrame(()=>{
      const section=route==="home"?url.searchParams.get("section"):null;
      if(section&&["services","activities","examples","contact"].includes(section))document.getElementById(section)?.scrollIntoView();
      else window.scrollTo(0,0);
    });
  }
  document.getElementById("receipt-dialog").addEventListener("click",ev=>{
    if(ev.target.closest(".dialog-close,.continue-sale")||ev.target===document.getElementById("receipt-dialog"))document.getElementById("receipt-dialog").close();
  });
  document.querySelector(".skip-link").addEventListener("click",ev=>{ev.preventDefault();document.getElementById("main").focus();});
  window.addEventListener("hashchange",render);
  render();
})();