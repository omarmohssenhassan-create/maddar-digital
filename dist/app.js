(() => {
  const {e,icon,art,money}=window.UI;
  const {PosEngine,normalizeDigits,normalizePhone,validPhone,whatsappNumber}=window.PosTools;
  const {t,content,productName}=window.I18N;
  let config=content(),query="",category="الكل",selectedActivity="shop",toastTimer,requestData=null,contactObserver;
  const pos=new PosEngine(window.SITE_CONFIG.demoProducts.map(p=>({...p,nameEn:productName(p,"en")})));
  const app=document.getElementById("app");
  const counts=value=>Number(value).toLocaleString(window.I18N.locale);
  function errorText(error){
    if(error.code==="stock")return t("stockError",{name:productName(error.productId),count:counts(error.stock)});
    return error.code?t({quantity:"quantityError",product:"productError",empty:"emptyError"}[error.code]||"productError"):error.message;
  }
  function toast(message){
    const node=document.getElementById("toast");node.textContent=message;node.classList.add("visible");
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("visible"),4000);
  }
  function activity(id){
    const a=config.activities.find(a=>a.id===id)||config.activities[0];selectedActivity=a.id;
    document.querySelectorAll("[data-activity]").forEach(tab=>{
      const active=tab.dataset.activity===a.id;tab.classList.toggle("selected",active);
      tab.setAttribute("aria-selected",active);tab.tabIndex=active?0:-1;
    });
    const target=document.getElementById("activity-result");
    target.setAttribute("aria-labelledby","tab-"+a.id);
    target.innerHTML='<div><span class="activity-result-label">'+e(t("suitableFor",{activity:a.title}))+'</span><h3>'+e(a.description)+'</h3></div><div class="activity-service-links">'+a.services.map(id=>{
      const s=config.services.find(s=>s.id===id);return '<a href="#/services/'+s.id+'">'+icon(s.icon)+e(s.title)+icon("chevron")+'</a>';
    }).join("")+'</div><a class="button button-orange activity-request" href="#/contact?activity='+a.id+'&service='+a.services[0]+'">'+t("requestActivity")+' '+icon("arrow")+'</a>';
  }
  function renderProducts(){
    const products=pos.search(query,category);
    document.getElementById("products").innerHTML=products.length?products.map(p=>{
      const reserved=pos.cart.get(p.id)||0,name=productName(p);
      return '<article class="product-card '+(p.stock===0?'out-of-stock':'')+'"><div class="product-image" style="--product-color:'+p.color+'">'+art(p.art,p.color)+'<span class="stock-pill '+(p.stock<=3?'low-stock':'')+'">'+(p.stock===0?t("outOfStock"):t("available",{count:counts(p.stock)}))+'</span></div><div class="product-details"><small>'+t("code")+' <bdi>'+e(p.code)+'</bdi></small><h3>'+e(name)+'</h3><div><b>'+money(p.price)+'</b><button class="add-product" data-add="'+p.id+'" aria-label="'+e(t("addProduct",{name}))+'" '+(reserved>=p.stock?'disabled':'')+'>'+icon("plus")+'</button></div></div></article>';
    }).join(""):'<div class="no-products">'+icon("search")+'<h3>'+t("noResults")+'</h3><p>'+t("noResultsDesc")+'</p><button class="button button-outline button-small" id="clear-search">'+t("allProducts")+'</button></div>';
  }
  function renderCart(){
    const lines=pos.lines;
    document.getElementById("cart-count").textContent=counts(lines.length);
    document.getElementById("item-count").textContent=counts(pos.count);
    document.getElementById("cart-total").innerHTML=money(pos.total);
    document.getElementById("cart-total").setAttribute("aria-live","polite");
    document.getElementById("checkout").disabled=!lines.length;
    document.getElementById("cart-lines").innerHTML=lines.length?'<div class="cart-lines-list">'+lines.map(line=>{
      const name=productName(line);
      return '<article class="cart-line" data-cart-id="'+line.id+'"><div class="cart-line-heading"><div><h3>'+e(name)+'</h3><small>'+money(line.price)+' '+t("perItem")+'</small></div><button class="remove-line" data-remove="'+line.id+'" aria-label="'+e(t("removeProduct",{name}))+'">'+icon("trash")+'</button></div><div class="cart-line-bottom"><div class="quantity-control"><button data-increment="'+line.id+'" aria-label="'+e(t("increase",{name}))+'" '+(line.quantity>=line.stock?'disabled':'')+'>'+icon("plus")+'</button><input type="number" inputmode="numeric" min="1" step="1" max="'+line.stock+'" value="'+line.quantity+'" data-quantity="'+line.id+'" aria-label="'+e(t("quantity",{name}))+'"><button data-decrement="'+line.id+'" aria-label="'+e(t("decrease",{name}))+'" '+(line.quantity<=1?'disabled':'')+'>'+icon("minus")+'</button></div><b>'+money(line.total)+'</b></div></article>';
    }).join("")+'</div>':'<div class="empty-cart"><span>'+icon("cart")+'</span><h3>'+t("emptyInvoice")+'</h3><p>'+t("emptyInvoiceDesc")+'</p></div>';
    document.getElementById("last-receipt").hidden=!pos.receipt;
  }
  function updatePos(){renderProducts();renderCart();}
  function receipt(){
    const r=pos.receipt;if(!r)return;
    const d=document.getElementById("receipt-dialog");
    d.innerHTML='<button class="dialog-close" aria-label="'+e(t("closeReceipt"))+'">'+icon("close")+'</button><div class="receipt-success">'+icon("check")+'</div><span class="eyebrow">'+t("saleSuccess")+'</span><h2 id="receipt-title">'+t("receiptTitle")+'</h2><p class="receipt-subtitle">'+t("receiptSubtitle",{number:counts(r.number)})+'</p><div class="receipt-lines">'+r.lines.map(l=>'<div><span>'+e(productName(l))+' <small>× '+counts(l.quantity)+'</small></span><b>'+money(l.total)+'</b></div>').join("")+'</div><div class="receipt-total"><span>'+t("total")+'</span><b>'+money(r.total)+'</b></div><p class="receipt-note">'+icon("box")+' '+t("receiptNote")+'</p><button class="button button-orange continue-sale">'+t("newInvoice")+' '+icon("arrow")+'</button>';
    if(!d.open)d.showModal();
  }
  function showRequest(data,openWhatsapp=false){
    const selectedService=config.services.find(s=>s.id===data.service),selectedActivity=config.activities.find(a=>a.id===data.activity);
    const message=[t("requestHello",{company:config.company.name}),"",t("name")+": "+data.name.trim(),t("phone")+": "+normalizePhone(data.phone),t("businessType")+": "+(selectedActivity?.title||t("otherBusiness")),t("requestedService")+": "+selectedService.title,...(data.message.trim()?[t("messageField")+": "+data.message.trim()]:[])].join("\n");
    const wa=whatsappNumber(config.company.whatsapp),url=wa?"https://wa.me/"+wa+"?text="+encodeURIComponent(message):"";
    const result=document.getElementById("request-result");result.hidden=false;
    result.innerHTML='<b>'+icon(wa?"whatsapp":"check")+t(wa?"requestReadyWhatsapp":"requestReadyCopy")+'</b><p>'+t(wa?"requestWhatsappInfo":"requestNotSent")+'</p><pre id="request-text">'+e(message)+'</pre><div class="request-actions"><button type="button" class="button button-outline button-small" id="copy-request">'+icon("copy")+' '+t("copyRequest")+'</button>'+(wa?'<a class="button button-navy button-small" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">'+t("openWhatsapp")+' '+icon("arrow")+'</a>':'')+'</div>';
    document.getElementById("copy-request").addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(message);toast(t("copied"));}
      catch{
        const range=document.createRange();range.selectNodeContents(document.getElementById("request-text"));
        const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
        toast(t(document.execCommand("copy")?"copied":"copyManually"));
      }
    });
    if(openWhatsapp&&wa)window.open(url,"_blank","noopener,noreferrer");
  }
  function bindContact(){
    const form=document.getElementById("contact-form");if(!form)return;
    const updateServiceHint=()=>{
      const selected=config.services.find(s=>s.id===form.elements.service.value),hint=document.getElementById("service-hint");
      hint.hidden=!selected;
      if(selected)hint.innerHTML='<b>'+e(selected.title)+'</b><span>'+selected.features.slice(0,3).map(f=>e(f[0])).join(' · ')+'</span>';
    };
    updateServiceHint();form.elements.service.addEventListener("change",updateServiceHint);
    form.querySelectorAll('[data-brief]').forEach(button=>button.addEventListener('click',()=>{
      const message=form.elements.message,prompt=t(button.dataset.brief);if(!message.value.includes(prompt))message.value=(message.value.trim()?message.value.trim()+'\n':'')+prompt;message.dispatchEvent(new Event('input'));message.focus();
    }));
    function validField(name){
      const input=form.elements[name],value=input.value.trim();
      const valid=name==="name"?value.length>=2&&value.length<=80:name==="phone"?validPhone(value):name==="activity"?[...config.activities.map(a=>a.id),"other"].includes(value):config.services.some(s=>s.id===value);
      input.setAttribute("aria-invalid",!valid);
      document.getElementById(name+"-error").textContent=valid?"":t({name:"nameError",phone:"phoneError",activity:"activityError",service:"serviceError"}[name]);
      return valid;
    }
    for(const name of ["name","phone","activity","service"]){
      form.elements[name].addEventListener("blur",()=>validField(name));
      form.elements[name].addEventListener("input",()=>{
        if(form.elements[name].getAttribute("aria-invalid")==="true")validField(name);
        requestData=null;document.getElementById("request-result").hidden=true;
      });
    }
    form.elements.message.addEventListener("input",()=>{requestData=null;document.getElementById("request-result").hidden=true;});
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const invalid=["name","phone","activity","service"].filter(name=>!validField(name));
      if(invalid.length){form.elements[invalid[0]].focus();return;}
      requestData=Object.fromEntries(new FormData(form));showRequest(requestData,true);
      document.getElementById("request-result").scrollIntoView({behavior:"smooth",block:"nearest"});
    });
  }
  function bindDemo(){
    const search=document.getElementById("product-search");search.value=query;
    search.addEventListener("input",ev=>{query=ev.target.value;renderProducts();});
    document.querySelectorAll("[data-category]").forEach(button=>{
      const active=button.dataset.category===category;button.classList.toggle("selected",active);button.setAttribute("aria-pressed",active);
      button.addEventListener("click",()=>{
        category=button.dataset.category;
        document.querySelectorAll("[data-category]").forEach(b=>{b.classList.toggle("selected",b===button);b.setAttribute("aria-pressed",b===button);});renderProducts();
      });
    });
    document.getElementById("products").addEventListener("click",ev=>{
      const add=ev.target.closest("[data-add]");
      if(add)try{pos.add(add.dataset.add);updatePos();document.querySelector('[data-add="'+add.dataset.add+'"]')?.focus();}catch(error){toast(errorText(error));}
      if(ev.target.closest("#clear-search")){
        query="";category="الكل";search.value="";document.querySelector('[data-category="الكل"]').click();search.focus();
      }
    });
    document.getElementById("cart-lines").addEventListener("click",ev=>{
      const button=ev.target.closest("button");if(!button)return;
      const {remove,increment,decrement}=button.dataset;
      try{
        if(remove)pos.remove(remove);if(increment)pos.add(increment);
        if(decrement)pos.setQuantity(decrement,(pos.cart.get(decrement)||1)-1);updatePos();
      }catch(error){toast(errorText(error));}
    });
    document.getElementById("cart-lines").addEventListener("change",ev=>{
      const id=ev.target.dataset.quantity;if(!id)return;
      try{pos.setQuantity(id,normalizeDigits(ev.target.value));updatePos();}
      catch(error){toast(errorText(error));ev.target.value=pos.cart.get(id);ev.target.focus();}
    });
    document.getElementById("checkout").addEventListener("click",()=>{try{pos.checkout();updatePos();receipt();}catch(error){toast(errorText(error));}});
    document.querySelector(".reset-demo").addEventListener("click",()=>{
      pos.reset();query="";category="الكل";search.value="";document.querySelector('[data-category="الكل"]').click();updatePos();toast(t("resetSuccess"));
    });
    document.getElementById("last-receipt").addEventListener("click",receipt);updatePos();
  }
  function switchLanguage(next){
    const form=document.getElementById("contact-form");
    const formData=form?Object.fromEntries(new FormData(form)):null;
    const invalidFields=form?[...form.querySelectorAll('[aria-invalid="true"]')].map(el=>el.name):[];
    const request=requestData,previousScroll=window.scrollY;
    window.I18N.setLanguage(next);render({languageChange:true,formData,invalidFields,request,scrollY:previousScroll});
    document.querySelector(".language-switch")?.focus({preventScroll:true});
  }
  function render(options={}){
    config=content();requestData=options.languageChange?options.request:null;
    clearTimeout(toastTimer);document.getElementById("toast").classList.remove("visible");
    const raw=location.hash.slice(1)||"/";
    const url=new URL(raw.startsWith("/")?raw:"/"+raw,location.href.startsWith("file:")?"https://local.test":location.origin);
    const path=url.pathname.replace(/\/$/,"")||"/";
    const serviceId=path.startsWith("/services/")?path.split("/")[2]:"";
    let route="home",html="",title="";
    for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
    if(path==="/"){html=window.Views.home();title=t("metaHome");}
    else if(path==="/about"){route="about";html=window.Views.aboutPage();title=t("about");}
    else if(path==="/demos"){route="demos";html=window.Experiences.hub();title=t("demoHub");}
    else if(path==="/demos/menu"){route="menuDemo";html=window.Experiences.menuPage();title=t("menuDemoTitle");}
    else if(path==="/demos/inventory"){route="inventoryDemo";html=window.Experiences.inventoryPage();title=t("inventoryDemoTitle");}
    else if(path==="/privacy"){route="privacy";html=window.Experiences.privacy();title=t("privacyLink");}
    else if(path==="/demo"){
      route="demo";if(!options.languageChange){query="";category="الكل";}html=window.Views.demo();title=t("demoTitle");
    }else if(path==="/contact"){route="contact";html=window.Views.contact(url.searchParams.get("service"),url.searchParams.get("activity"));title=t("discuss");}
    else if(serviceId&&config.services.some(s=>s.id===serviceId)){
      route="service";const s=config.services.find(s=>s.id===serviceId);html=window.Views.service(s);title=s.title;
    }else{route="missing";html=window.Views.missing();title=t("notFoundTitle");}
    contactObserver?.disconnect();
    app.innerHTML=window.Views.header(route)+html+window.Views.footer()+window.WhatsApp.quickLink();window.I18N.updateMeta(title);
    window.Studio.bind();
    document.querySelectorAll('.site-header nav .active').forEach(link=>link.setAttribute('aria-current','page'));
    const contactArea=document.getElementById("contact"),quickContact=document.querySelector(".whatsapp-float");
    if(contactArea&&quickContact&&"IntersectionObserver" in window){
      contactObserver=new IntersectionObserver(([entry])=>{quickContact.hidden=entry.isIntersecting;});
      contactObserver.observe(contactArea);
    }
    document.getElementById("main").tabIndex=-1;
    document.querySelector(".language-switch").addEventListener("click",ev=>switchLanguage(ev.currentTarget.dataset.language));
    document.querySelector(".menu-toggle").addEventListener("click",ev=>{
      const b=ev.currentTarget,expanded=b.getAttribute("aria-expanded")==="true";
      b.setAttribute("aria-expanded",!expanded);b.setAttribute("aria-label",t(expanded?"openMenu":"closeMenu"));
      document.getElementById("main-nav").classList.toggle("open",!expanded);b.innerHTML=icon(expanded?"menu":"close");
    });
    if(route==="home"){
      activity(options.languageChange?selectedActivity:"shop");
      document.querySelectorAll("[data-activity]").forEach(button=>{
        button.addEventListener("click",()=>activity(button.dataset.activity));
        button.addEventListener("keydown",ev=>{
          const tabs=[...document.querySelectorAll("[data-activity]")],i=tabs.indexOf(button),rtl=window.I18N.language==="ar";let next=null;
          if(ev.key==="ArrowLeft")next=(i+(rtl?1:-1)+tabs.length)%tabs.length;
          if(ev.key==="ArrowRight")next=(i+(rtl?-1:1)+tabs.length)%tabs.length;
          if(ev.key==="Home")next=0;if(ev.key==="End")next=tabs.length-1;
          if(next!==null){ev.preventDefault();tabs[next].click();tabs[next].focus();}
        });
      });
    }
    if(route==="demo")bindDemo();
    window.Experiences.bind(route,toast);
    const form=document.getElementById("contact-form");
    if(form&&options.formData)for(const [name,value]of Object.entries(options.formData))if(form.elements[name])form.elements[name].value=value;
    bindContact();
    document.querySelectorAll('.faq-list details').forEach(details=>details.addEventListener('toggle',()=>{
      if(details.open)document.querySelectorAll('.faq-list details[open]').forEach(other=>{if(other!==details)other.open=false;});
    }));
    document.querySelector('.menu-toggle').addEventListener('keydown',ev=>{if(ev.key==='Escape'){ev.currentTarget.setAttribute('aria-expanded','false');document.getElementById('main-nav').classList.remove('open');}});
    if(form&&options.invalidFields)for(const name of options.invalidFields)form.elements[name]?.dispatchEvent(new Event("blur"));
    if(form&&requestData)showRequest(requestData,false);
    requestAnimationFrame(()=>{
      document.querySelector('.demo-switcher [aria-current]')?.scrollIntoView({block:'nearest',inline:'nearest'});
      if(options.languageChange){window.scrollTo(0,options.scrollY||0);return;}
      if(options.navigation)document.getElementById('main').focus({preventScroll:true});
      const section=route==="home"?url.searchParams.get("section"):null;
      if(section&&["about","services","activities","examples","contact","process","faq"].includes(section))document.getElementById(section)?.scrollIntoView();
      else window.scrollTo(0,0);
    });
  }
  document.getElementById("receipt-dialog").addEventListener("click",ev=>{
    if(ev.target.closest(".dialog-close,.continue-sale")||ev.target===document.getElementById("receipt-dialog"))document.getElementById("receipt-dialog").close();
  });
  document.querySelector(".skip-link").addEventListener("click",ev=>{ev.preventDefault();document.getElementById("main").focus();});
  document.addEventListener('keydown',ev=>{
    if(ev.key==='Escape'&&document.querySelector('.menu-toggle')?.getAttribute('aria-expanded')==='true'){
      const toggle=document.querySelector('.menu-toggle');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',t('openMenu'));document.getElementById('main-nav').classList.remove('open');toggle.focus();
    }
  });
  window.addEventListener("hashchange",()=>render({navigation:true}));render();
})();
