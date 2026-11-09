(() => {
  const base=window.SITE_CONFIG;
  let stored;
  try { stored=localStorage.getItem("madar-language"); } catch {}
  const requested=new URLSearchParams(location.search).get("lang");
  let language=["ar","en"].includes(requested)?requested:(["ar","en"].includes(stored)?stored:"ar");
  const missing=new Set();
  function t(key,values={}) {
    const pair=window.MADAR_MESSAGES[key];
    if(!pair)missing.add(key);
    return String(pair?.[language==="en"?1:0]??key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??""));
  }
  function content() {
    if(language==="ar")return base;
    const locale=window.MADAR_EN;
    return {...base,company:{...base.company,tagline:base.company.taglineEn||locale.tagline},hero:locale.hero,about:locale.about,
      services:base.services.map(s=>({...s,...locale.services[s.id]})),
      activities:base.activities.map(a=>({...a,...locale.activities[a.id]})),
      demoProducts:base.demoProducts.map(p=>({...p,name:locale.products[p.id]||p.name}))};
  }
  function setLanguage(next,updateUrl=true) {
    if(!["ar","en"].includes(next))return;
    language=next;
    document.documentElement.lang=next;
    document.documentElement.dir=next==="ar"?"rtl":"ltr";
    try {localStorage.setItem("madar-language",next);} catch {}
    if(updateUrl)try {
      const url=new URL(location.href);url.searchParams.set("lang",next);
      history.replaceState(null,"",url);
    }catch{}
  }
  function productName(product,locale=language) {
    const id=typeof product==="string"?product:product.id;
    return locale==="en"?(window.MADAR_EN.products[id]||base.demoProducts.find(p=>p.id===id)?.name||id):(base.demoProducts.find(p=>p.id===id)?.name||id);
  }
  function updateMeta(title) {
    document.title=title+" | "+base.company.name;
    const description=language==="en"?window.MADAR_EN.metaDescription:base.company.description;
    document.querySelector('meta[name="description"]')?.setAttribute("content",description);
    for(const [property,value] of [["og:title",document.title],["og:description",description],["og:locale",language==="ar"?"ar_EG":"en_US"]]){
      let node=document.querySelector('meta[property="'+property+'"]');
      if(!node){node=document.createElement("meta");node.setAttribute("property",property);document.head.append(node);}
      node.content=value;
    }
    const canonical=new URL(base.company.siteUrl||'https://maddardigital.com/');
    if(language==='en')canonical.searchParams.set('lang','en');
    document.querySelector('link[rel="canonical"]').href=canonical.href;
    for(const [property,value] of [['og:url',canonical.href],['og:image',new URL(base.company.heroArtwork,canonical).href]]){
      let node=document.querySelector('meta[property="'+property+'"]');
      if(!node){node=document.createElement('meta');node.setAttribute('property',property);document.head.append(node);}node.content=value;
    }
    document.querySelector('meta[name="twitter:title"]').content=document.title;
    document.querySelector('meta[name="twitter:description"]').content=description;
    for(const lang of ["ar","en"]){
      let node=document.querySelector('link[rel="alternate"][hreflang="'+lang+'"]');
      if(!node){node=document.createElement("link");node.rel="alternate";node.hreflang=lang;document.head.append(node);}
      const url=new URL(location.href);url.searchParams.set("lang",lang);node.href=url.href;
    }
    document.querySelector(".skip-link").textContent=t("skip");
  }
  setLanguage(language,false);
  window.I18N={t,content,setLanguage,productName,updateMeta,missing,get language(){return language;},get locale(){return language==="ar"?"ar-EG":"en-EG";}};
})();
