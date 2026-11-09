(() => {
  const {e,icon}=window.UI,{t,content}=window.I18N;
  Object.assign(window.MADAR_MESSAGES,{
    newHeroTitle:['شغلك يستحق','Your business.'],newHeroAccent:['خطوة رقمية أقوى.','Ready for what’s next.'],
    studioIntro:['نبني حضورك على الإنترنت، ونطوّر الأدوات اللي تنظّم شغلك. من المواقع والتطبيقات لأنظمة الإدارة والمخزون والمنيو، نبدأ من احتياجك ونوصل لحل واضح.','We build your online presence and the tools that keep your business moving. Websites, apps, business systems, inventory and digital menus, shaped around what you need.'],
    studioKicker:['فكرة واضحة. تصميم مدروس. تطوير له هدف.','Clear ideas. Thoughtful design. Purposeful development.'],
    studioFilm:['لمحة عن عالم Maddar','A glimpse into Maddar'],studioFilmNote:['فيلم أصلي صامت · ١٨ ثانية','Original silent film · 18 seconds'],
    filmPlay:['شغّل الفيلم','Play the film'],filmPause:['إيقاف الفيلم مؤقتًا','Pause the film'],filmError:['تعذّر تشغيل الفيديو. تقدر تكمل استكشاف الخدمات تحت.','The film could not play. You can still explore our services below.'],
    studioServicesTitle:['حلول مختلفة،','Different solutions.'],studioServicesAccent:['بنفس الاهتمام بالتفاصيل.','The same attention to detail.'],
    studioServicesIntro:['كل خدمة لها دور. نساعدك تختار اللي يفيد نشاطك، ونحدد تفاصيل التنفيذ معاك.','Every service has a purpose. We help you choose what fits, then define the details together.'],
    studioProcessTitle:['من أول كلام،','From our first conversation'],studioProcessAccent:['لأول خطوة على أرض الواقع.','to something you can use.'],
    studioStep1:['نفهم الفكرة','Understand the idea'],studioStep1Desc:['نعرف نشاطك والمشكلة اللي محتاج تحلّها، ونرتّب الأولويات.','We learn about your business, the problem and what matters first.'],
    studioStep2:['نرسم التجربة','Shape the experience'],studioStep2Desc:['نحدد الوظائف والصفحات، ونراجع معاك اتجاه التصميم قبل التطوير.','We define features and screens, then review the design direction together.'],
    studioStep3:['نطوّر ونختبر','Build and test'],studioStep3Desc:['نحوّل المتفق عليه لحل قابل للتجربة، ونراجع الاستخدام والتفاصيل.','We turn the agreed scope into something testable and review how it works.'],
    studioStep4:['نسلّم ونخطّط للخطوة الجاية','Launch and plan ahead'],studioStep4Desc:['نراجع التسليم وطريقة الاستخدام، ونناقش احتياجات التطوير اللاحقة.','We review handover and everyday use, then discuss future needs.'],
    studioVisualNote:['تصوّر توضيحي','Illustrative concept'],
    studioAboutTitle:['مشروعك له تفاصيله.','Your business has its own story.'],studioAboutAccent:['وحلّه لازم يفهمها.','Your solution should reflect it.']
  });
  function scene(id){
    const top='<div class="scene-top"><i></i><i></i><i></i><span>MADDAR / CONCEPT</span></div>';
    if(id==='web')return '<div class="scene-browser">'+top+'<div class="scene-web-body"><b>M.</b><div class="scene-web-copy"><i></i><i></i><i></i><span></span></div><div class="scene-web-orbit"><i></i></div><div class="scene-web-tiles"><i></i><i></i><i></i></div></div></div>';
    if(id==='apps')return '<div class="scene-phone rear"><i></i><b>M.</b><div class="scene-app-grid"><span></span><span></span><span></span><span></span></div></div><div class="scene-phone front"><i></i><b>YOUR NEXT<br>APP.</b><span class="scene-app-card">'+icon('mobile')+'</span><div class="scene-app-lines"><i></i><i></i><i></i></div><em></em></div>';
    if(id==='erp')return '<div class="scene-system back">'+top+'<div class="scene-system-lines"><i></i><i></i><i></i></div></div><div class="scene-system front">'+top+'<div class="scene-system-body"><aside>'+icon('grid')+icon('chart')+icon('box')+'</aside><div><div class="scene-stats"><i>24</i><i>57</i><i>02</i></div><div class="scene-chart">'+[30,52,39,72,58,91,75].map(h=>'<i style="height:'+h+'%"></i>').join('')+'</div></div></div></div>';
    if(id==='pos')return '<div class="scene-terminal"><div class="scene-pos-screen">'+top+'<div>'+icon('cart')+'<span>NEW SALE</span><b>EGP 175.00</b><i></i></div></div><div class="scene-pos-stand"></div><div class="scene-pos-base"></div></div><div class="scene-receipt"><b>DEMO RECEIPT</b><i></i><i></i><i></i><span>175.00</span><em></em></div>';
    if(id==='menu')return '<div class="scene-menu-disc"></div><div class="scene-phone scene-menu-phone"><i></i><b>HEKAYA<br><small>DEMO MENU</small></b><div class="scene-menu-dish">'+icon('utensils')+'</div><div class="scene-menu-rows"><i></i><i></i><i></i></div><em></em></div><div class="scene-qr-concept">'+icon('qr')+'<small>MENU / QR</small></div>';
    return '<div class="scene-content-grid"><div>M.<small>DIGITAL<br>STORIES.</small></div><div>'+icon('megaphone')+'</div><div><i></i><i></i><i></i><i></i></div></div><div class="scene-marketing-note">CONTENT / ADS / DESIGN</div>';
  }
  function graphic(id){return '<div class="service-scene scene-'+id+'" aria-hidden="true">'+scene(id)+'</div>';}
  function serviceCard(s,index){return '<a class="service-card studio-service service-'+s.id+'" href="#/services/'+s.id+'"><div class="studio-card-heading"><span class="studio-card-number">0'+(index+1)+'</span><h3>'+e(s.title)+'</h3><span class="studio-card-arrow">'+icon('arrowup')+'</span></div>'+graphic(s.id)+'<div class="studio-card-bottom"><p>'+e(s.short)+'</p><span class="card-link">'+t('learnMore')+' '+icon('arrow')+'</span></div><small class="studio-card-concept">'+t('studioVisualNote')+'</small></a>';}
  function hero(){
    const c=content().company,language=window.I18N.language;
    return '<section class="hero studio-hero"><div class="container"><div class="hero-copy studio-hero-copy"><span class="hero-eyebrow"><i></i>MADDAR DIGITAL — SOFTWARE SOLUTIONS</span><h1>'+t('newHeroTitle')+'<br><span>'+t('newHeroAccent')+'</span></h1><p>'+t('studioIntro')+'</p><div class="hero-actions"><a class="button button-orange" href="#/contact">'+t('discuss')+' '+icon('arrow')+'</a><a class="button button-outline" href="#/demos">'+t('work')+' '+icon('monitor')+'</a></div><span class="studio-hero-foot">'+t('studioKicker')+'</span></div><div class="brand-film"><video id="brand-film" muted loop playsinline controls preload="none" width="1280" height="720" poster="'+e(c.filmPoster[language])+'" data-film-src="'+e(c.film[language])+'" aria-label="'+e(t('studioFilm'))+'"></video><div class="film-edge" aria-hidden="true"><span>MADDAR / DIGITAL</span><span>BRAND FILM — 2026</span></div></div><div class="film-caption"><div><span class="film-dot"></span><b>'+t('studioFilm')+'</b><small>'+t('studioFilmNote')+'</small></div><button type="button" id="film-toggle" aria-controls="brand-film">'+icon('plus')+'<span>'+t('filmPlay')+'</span></button></div></div><div class="service-ribbon"><div class="container">'+content().services.map(s=>'<a href="#/services/'+s.id+'">'+icon(s.icon)+e(s.title)+'</a>').join('')+'</div></div></section>';
  }
  function process(){return '<section class="process-section section studio-process" id="process"><div class="container"><div class="section-heading"><div><span class="eyebrow">04 / '+t('process')+'</span><h2>'+t('studioProcessTitle')+'<br><span class="muted">'+t('studioProcessAccent')+'</span></h2></div><p>'+t('processIntro')+'</p></div><div class="studio-process-grid">'+[1,2,3,4].map(i=>'<article><span>0'+i+'</span><h3>'+t('studioStep'+i)+'</h3><p>'+t('studioStep'+i+'Desc')+'</p></article>').join('')+'</div></div></section>';}
  let dispose=()=>{};
  function bind(){
    dispose();dispose=()=>{};const video=document.getElementById('brand-film'),button=document.getElementById('film-toggle');if(!video)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),saveData=navigator.connection?.saveData;
    let visible=false,userPaused=false,internalPause=false;
    video.muted=true;
    const label=()=>{button.innerHTML=(video.paused?'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 4 12 8-12 8Z" fill="currentColor"/></svg>':'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7Zm7 0h3v14h-3Z" fill="currentColor"/></svg>')+'<span>'+t(video.paused?'filmPlay':'filmPause')+'</span>';};
    const load=()=>{if(!video.getAttribute('src'))video.src=video.dataset.filmSrc;};
    const pause=()=>{if(!video.paused){internalPause=true;video.pause();}};
    const play=()=>{load();video.play().catch(()=>{label();});};
    button.addEventListener('click',()=>{if(video.paused){userPaused=false;play();}else{userPaused=true;pause();}});
    video.addEventListener('play',label);video.addEventListener('pause',()=>{if(internalPause)internalPause=false;else userPaused=true;label();});
    video.addEventListener('error',()=>{button.textContent=t('filmError');button.disabled=true;});
    const observer='IntersectionObserver'in window?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!reduced.matches&&!saveData&&!userPaused&&document.visibilityState==='visible')play();else if(!visible)pause();},{threshold:.2}):null;
    observer?.observe(video);
    const onVisibility=()=>{if(document.hidden)pause();else if(visible&&!userPaused&&!reduced.matches&&!saveData)play();};
    const onMotion=()=>{if(reduced.matches)pause();};document.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onMotion);label();
    dispose=()=>{observer?.disconnect();document.removeEventListener('visibilitychange',onVisibility);reduced.removeEventListener('change',onMotion);pause();};
  }
  window.UI.serviceCard=serviceCard;window.Studio={hero,graphic,process,bind};
})();
