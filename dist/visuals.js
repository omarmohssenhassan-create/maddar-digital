(() => {
  const e=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const paths={
    qr:'<path d="M3 3h6v6H3Zm12 0h6v6h-6ZM3 15h6v6H3Zm12 0h2v2h-2Zm4 4h2v2h-2Zm-4 0h2v2h-2ZM11 3h1v4m0 4h4m-4 4v6m7-10h2v4M3 12h4m10 0v1"/>',
    arrow:'<path d="M19 12H5m6-6-6 6 6 6"/>',
    chevron:'<path d="m14 6-6 6 6 6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    pos:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5M7 7h5M7 11h3m6-4h1m-1 4h1"/>',
    building:'<path d="M4 21V5a2 2 0 0 1 2-2h9v18M15 9h5v12M2 21h20M8 7h3M8 11h3M8 15h3m6-2h1m-1 4h1"/>',
    code:'<rect x="2" y="3" width="20" height="18" rx="3"/><path d="M2 8h20m-13 4-3 3 3 3m6-6 3 3-3 3M6 5.5h.01M9 5.5h.01"/>',
    megaphone:'<path d="m3 10 16-6v16L3 14v-4Zm4 6 1 5h4l-2-4M22 9v6"/>',
    store:'<path d="M3 10V7l2-4h14l2 4v3M4 11v10h16V11M8 21v-7h5v7"/><path d="M3 8h18M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
    utensils:'<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18m11 0V3c-5 3-5 10 0 10"/>',
    box:'<path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5m-9 5v9M7 5.5l9 5"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    zap:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
    monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    mobile:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
    cart:'<path d="M2 3h3l3 13h11l3-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>',
    refresh:'<path d="M20 7a9 9 0 1 0 1 8M20 2v6h-6"/>',
    trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    receipt:'<path d="M5 3h14v19l-3-2-4 2-4-2-3 2V3ZM8 7h8M8 11h8m-8 4h4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    whatsapp:'<path d="M20 11.5a8.5 8.5 0 0 1-12.5 7.6L3 21l1.7-4.7A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 7c-3 3 3 9 6 8l2-2-3-2-1 1-2-2 1-1-3-2Z"/>',
    star:'<path d="m12 2 2.6 6.6L22 9l-5.7 4.8L18 21l-6-4-6 4 1.7-7.2L2 9l7.4-.4L12 2Z"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    chart:'<path d="M3 3v18h18M7 16v-4m5 4V7m5 9v-6"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    facebook:'<path d="M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v8"/>',
    arrowup:'<path d="m6 16 12-8M9 8h9v9"/>'
  };
  const icon=(name,cls="")=>'<svg class="icon '+cls+'" data-icon="'+name+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.box)+'</svg>';
  function art(kind,color="#98b2a2"){
    let shape="";
    if(kind==="milk")shape='<path d="m35 20 12-11h28l11 11v80H35Z" fill="#f9fbfc"/><path d="M35 32h51v52H35Z" fill="'+color+'"/><path d="m47 9 9 12h30M56 21v11" fill="none" stroke="#ced9e4" stroke-width="2"/><ellipse cx="61" cy="55" rx="13" ry="16" fill="#fff" opacity=".8"/><path d="M61 42c-10 12-11 19 0 22 11-3 10-10 0-22" fill="#fff"/><path d="M40 91h16m10 0h15" stroke="#dce2e8" stroke-width="3"/>';
    else if(kind==="water")shape='<path d="M51 9h18v15l8 12v59q0 7-7 7H50q-7 0-7-7V36l8-12Z" fill="#e9f4f6" stroke="#b7d6df" stroke-width="2"/><path d="M43 49h34v32H43Z" fill="'+color+'"/><path d="M52 7h16v10H52Z" fill="#365e77"/><path d="M48 39h24m-24 50h24" stroke="#c9e2e9" stroke-width="3"/><path d="M60 54c-11 12-10 17 0 20 10-3 11-8 0-20" fill="#fff" opacity=".8"/>';
    else if(kind==="tea")shape='<rect x="27" y="23" width="68" height="74" rx="3" fill="'+color+'"/><path d="m27 23 11-11h49l8 11" fill="#f4d4b9"/><path d="M38 12v11m49-11v11" stroke="#ad7353" stroke-width="2"/><rect x="36" y="34" width="50" height="48" rx="2" fill="#fff7e9"/><path d="M45 53h26v13a10 10 0 0 1-20 0v-13m20 2h7c8 0 5 13-6 13" fill="none" stroke="#92674e" stroke-width="2"/><path d="m56 41-2 5m8-5-2 5" stroke="#b8a080" stroke-width="2"/><path d="M44 76h34" stroke="#b8a080" stroke-width="2"/>';
    else {
      shape='<path d="M36 12h48l-3 12 10 69q1 9-9 9H38q-10 0-9-9l10-69Z" fill="'+color+'"/><path d="M36 12h48v8H36Z" fill="#fff" opacity=".22"/><rect x="37" y="37" width="46" height="43" rx="2" fill="#fff7e9"/>';
      if(kind==="coffee")shape+='<ellipse cx="60" cy="58" rx="10" ry="14" transform="rotate(30 60 58)" fill="#795141"/><path d="M66 47q-12 10-11 22" fill="none" stroke="#ead5b8" stroke-width="2"/>';
      else shape+='<path d="M60 43v29m0-5-9-7m9-2 9-7m-9 2-8-6m8 20 9-6" stroke="'+(kind==="rice"?"#709c81":"#b99962")+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
      shape+='<path d="M46 87h28m-24 5h20" stroke="#fff" opacity=".5" stroke-width="2"/>';
    }
    return '<svg class="product-art" viewBox="0 0 120 115" aria-hidden="true"><ellipse cx="60" cy="104" rx="34" ry="5" fill="#172944" opacity=".08"/>'+shape+'</svg>';
  }
  const money=cents=>'<bdi>'+(cents/100).toLocaleString(window.I18N.locale,{maximumFractionDigits:2})+'</bdi> <span class="currency">'+(window.I18N.language==="ar"?"ج.م":"EGP")+'</span>';
  function dashboard(){
    const p=window.SITE_CONFIG.demoProducts;
    return '<div class="hero-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="visual-dot"></div><div class="dashboard-window" aria-hidden="true"><div class="window-bar"><div class="window-brand"><span class="tiny-logo"></span> كاشيرك</div><span class="demo-chip">بيانات تجريبية</span><div class="window-dots"><i></i><i></i><i></i></div></div><div class="dashboard-body"><div class="mock-sidebar">'+icon("grid")+icon("cart","current")+icon("box")+icon("chart")+'<span class="sidebar-bottom"></span></div><div class="mock-main"><div class="mock-heading"><div><small>كل حاجة تحت السيطرة</small><h3>نقطة البيع</h3></div><span class="mock-day">بيع جديد '+icon("plus")+'</span></div><div class="mock-search">'+icon("search")+' ابحث عن صنف أو باركود<span>⌘ K</span></div><div class="mock-products">'+p.slice(0,3).map(item=>'<div class="mock-product"><div class="mock-product-art" style="--art-color:'+item.color+'">'+art(item.art,item.color)+'</div><b>'+e(item.name)+'</b><div>'+money(item.price)+'<span class="mini-plus">+</span></div></div>').join("")+'</div><div class="mock-bottom"><div class="mini-chart"><div><b>حركة المبيعات</b><span>توضيحي</span></div><div class="bars">'+[35,53,45,72,60,87,74,96,80].map((h,i)=>'<i style="height:'+h+'%;--n:'+i+'"></i>').join("")+'</div><div class="chart-labels"><span>السبت</span><span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span></div></div><div class="mini-inventory">'+icon("box")+'<b>مخزونك قدامك</b><small>تابع المتاح من كل صنف</small><div class="inventory-lines"><i></i><i></i><i></i></div></div></div></div></div></div><div class="floating-note">'+icon("check")+'<div><b>بيعك ومخزونك.. متصلين</b><small>خطوة واحدة، وصورة أوضح</small></div></div><div class="visual-caption"><span></span> جرّب بنفسك، من غير تسجيل</div></div>';
  }
  function serviceCard(s,index){
    return '<a class="service-card service-'+s.id+'" href="#/services/'+s.id+'"><span class="service-icon">'+icon(s.icon)+'</span><h3>'+e(s.title)+'</h3><p>'+e(s.short)+'</p><span class="card-link">'+window.I18N.t("learnMore")+' '+icon("arrow")+'</span></a>';
  }
  window.UI={e,icon,art,money,dashboard,serviceCard};
})();
