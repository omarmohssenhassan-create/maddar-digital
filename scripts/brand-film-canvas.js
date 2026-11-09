// Original Maddar Digital motion design, drawn and recorded locally. No third-party footage.
window.createMaddarFilm=async function(language='ar'){
  await document.fonts.ready;await document.fonts.load('600 50px Alexandria');
  const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;document.body.replaceChildren(canvas);
  const ctx=canvas.getContext('2d',{alpha:false}),ar=language==='ar',duration=18;
  const logo=new Image();logo.src='/assets/maddar-logo-original.jpeg';await logo.decode();
  const white='#f0eef3',muted='#9aa5bb',red='#ff4156';
  const pair=(a,b)=>ar?a:b;
  function box(x,y,w,h,fill,r=15,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
  function text(value,x,y,size=30,color=white,align='center',weight=600){ctx.font=weight+' '+size+'px Alexandria';ctx.fillStyle=color;ctx.textAlign=align;ctx.direction=/^[\x00-\x7F]*$/.test(value)?'ltr':ar?'rtl':'ltr';ctx.fillText(value,x,y);}
  function line(x1,y1,x2,y2,color,width=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function browser(x,y,w,h,offset=0){
    box(x+12,y+18,w,h,'#03050b',17);box(x,y,w,h,'#111827',17,'#465166');
    line(x,y+32,x+w,y+32,'#394257');for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+18+i*13,y+16,3,0,Math.PI*2);ctx.fillStyle=i===0?red:'#68758c';ctx.fill();}
    box(x+22,y+52,w-44,h-74,'#e8e5e1',9);text('MADDAR',x+42,y+78,11,'#232632','left');
    box(x+42,y+101,w*.42,11,'#c9c0c1',4);box(x+42,y+127,w*.33,24,'#222737',4);box(x+42,y+163,w*.37,7,'#aaa3a5',3);box(x+42,y+180,w*.3,7,'#aaa3a5',3);box(x+42,y+209,80,24,red,6);
    box(x+w*.56,y+104,w*.29,129,'#202b41',9);ctx.fillStyle=red;ctx.beginPath();ctx.arc(x+w*.7,y+170,30+Math.sin(offset)*3,0,Math.PI*2);ctx.fill();
    for(let i=0;i<3;i++)box(x+42+i*(w-90)/3,y+h-75,(w-120)/3,34,['#d9cbcd','#d0d6db','#dcd2c3'][i],5);
  }
  function phone(x,y,w,h,offset=0,menu=false){
    box(x+10,y+13,w,h,'#02030a',29);box(x,y,w,h,'#131722',29,'#6c6d76');box(x+9,y+10,w-18,h-20,menu?'#e8d7bd':'#182136',22);box(x+w*.3,y+14,w*.4,10,'#080b13',6);
    text(menu?'HEKAYA':'MADDAR',x+w/2,y+65,14,menu?'#76493d':white);
    box(x+22,y+89,w-44,83,menu?'#bd9172':'#8e3b52',8);text(menu?'MENU':'YOUR APP',x+w/2,y+138,16,white);
    for(let i=0;i<3;i++){box(x+22,y+191+i*51,36,35,menu?'#ab7358':'#3c4d69',6);box(x+69,y+195+i*51,w-91,6,menu?'#a18569':'#7c879a',3);box(x+69,y+208+i*51,(w-91)*.7,5,menu?'#b99a7c':'#56647d',3);}
    box(x+24,y+h-52,w-48,22,red,6);
  }
  function dashboard(x,y,w,h,p){
    box(x,y,w,h,'#131d30',16,'#465169');box(x+15,y+20,44,h-37,'#0c1220',7);
    for(let i=0;i<5;i++)box(x+27,y+46+i*44,18,18,i===1?red:'#354057',5);
    for(let i=0;i<3;i++){box(x+79+i*(w-98)/3,y+26,(w-127)/3,62,'#232b41',8);box(x+95+i*(w-98)/3,y+40,30,5,'#6a7290',2);text(['24','57','02'][i],x+98+i*(w-98)/3,y+72,19,white,'left');}
    box(x+79,y+109,w-100,h-133,'#1b2437',8);for(let i=0;i<9;i++){const height=(32+(i*19)%91)*(0.85+Math.sin(p+i)*.07);box(x+98+i*(w-140)/9,y+h-45-height,(w-170)/12,height,i===6?red:'#566683',3);}
  }
  function qr(x,y,size){
    box(x-10,y-10,size+20,size+20,'#ede8e0',10);
    const step=size/17;for(let r=0;r<17;r++)for(let c=0;c<17;c++)if((r*13+c*7)%5<2)box(x+c*step,y+r*step,step+.5,step+.5,'#151c28',0);
    for(const [a,b]of [[0,0],[10,0],[0,10]]){box(x+a*step,y+b*step,7*step,7*step,'#151c28',0);box(x+(a+1)*step,y+(b+1)*step,5*step,5*step,'#ede8e0',0);box(x+(a+2)*step,y+(b+2)*step,3*step,3*step,'#151c28',0);}
  }
  function background(seconds){
    ctx.fillStyle='#090d17';ctx.fillRect(0,0,1280,720);
    const glow=ctx.createRadialGradient(790+Math.sin(seconds/3)*140,330,30,640,360,640);glow.addColorStop(0,'#25314c');glow.addColorStop(.5,'#142035');glow.addColorStop(1,'#090d17');ctx.fillStyle=glow;ctx.fillRect(0,0,1280,720);
    const warm=ctx.createRadialGradient(160,560,10,160,560,460);warm.addColorStop(0,'#77324755');warm.addColorStop(1,'#77324700');ctx.fillStyle=warm;ctx.fillRect(0,0,1280,720);
    ctx.save();ctx.globalAlpha=.16;for(let x=0;x<1280;x+=64)line(x,0,x,720,'#64758b',.6);for(let y=0;y<720;y+=64)line(0,y,1280,y,'#64758b',.6);ctx.restore();
    text('MADDAR DIGITAL',65,49,12,'#a1acc0','left',500);text('SOFTWARE / BUSINESS / DIGITAL',1210,49,10,'#7b879c','right',400);
    line(65,670,1210,670,'#344054');box(65,670,1145*(seconds/duration),2,red,0);
    text(pair('تصوّر بصري لخدماتنا','A visual introduction to our services'),65,701,10,'#7d8ba1','left',400);text('0'+(Math.floor(seconds/3)+1)+' / 06',1210,701,10,'#a8b3c5','right',500);
  }
  function frame(seconds){
    background(seconds);const scene=Math.min(5,Math.floor(seconds/3)),p=seconds%3,alpha=Math.min(1,p/.4,(3-p)/.35);ctx.save();ctx.globalAlpha=Math.max(0,alpha);
    const float=Math.sin(seconds*1.8)*7;
    if(scene===0){
      ctx.strokeStyle='#6c4158';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(640,340,170+i*55,110+i*37,-.35,0,Math.PI*2);ctx.stroke();}
      for(let i=0;i<6;i++){const a=seconds*.5+i*Math.PI/3,x=640+Math.cos(a)*280,y=340+Math.sin(a)*150;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=i%2?red:'#e1c1c7';ctx.fill();}
      box(598,210,84,42,'#bc304b',21);text('01',640,238,15);
      text(pair('فكرتك، نقطة البداية.','Your idea. Our starting point.'),640,359,ar?50:43);
      text(pair('وبعدها، نرسم لها طريق.','Then we give it a direction.'),640,422,24,muted);
    }else if(scene===1){
      ctx.save();ctx.translate(655,201+float);ctx.transform(1,-.08,.18,1,0,0);browser(0,0,438,330,seconds);ctx.restore();
      text(pair('حضور يشبهك.','A presence that feels like you.'),ar?570:85,320,ar?41:32,white,ar?'right':'left');
      text(pair('مواقع شركات ومتاجر إلكترونية.','Websites and online stores.'),ar?570:85,378,21,muted,ar?'right':'left');
      text('WEB / E-COMMERCE',ar?570:85,433,12,red,ar?'right':'left');
    }else if(scene===2){
      ctx.save();ctx.translate(690,182+float);ctx.rotate(.08);phone(0,0,173,355,seconds);ctx.restore();ctx.save();ctx.translate(846,271-float);ctx.rotate(-.08);dashboard(0,0,300,237,seconds);ctx.restore();
      text(pair('تطبيقات تربط التفاصيل.','Apps that connect the details.'),ar?580:85,303,ar?37:30,white,ar?'right':'left');text(pair('وأنظمة تمشي مع طريقة شغلك.','Business systems around your workflow.'),ar?580:85,366,22,muted,ar?'right':'left');text('MOBILE APPS / BUSINESS SYSTEMS',ar?580:85,427,11,red,ar?'right':'left');
    }else if(scene===3){
      dashboard(690,220+float,425,284,seconds);for(let i=0;i<3;i++){box(744+i*95,528-float-i*8,67,52,['#5d526b','#873b51','#ad7d65'][i],6);line(777+i*95,529-float-i*8,777+i*95,576-float-i*8,'#e3cad377',2);}
      text(pair('بيعك ومخزونك. أوضح.','Sales and stock. In focus.'),ar?580:85,309,ar?38:32,white,ar?'right':'left');text(pair('كاشير وحركة أصناف وتقارير.','POS, stock movements and reporting.'),ar?580:85,371,22,muted,ar?'right':'left');text('POS / INVENTORY',ar?580:85,427,12,red,ar?'right':'left');
    }else if(scene===4){
      ctx.save();ctx.translate(692,170+float);ctx.rotate(-.07);phone(0,0,170,350,seconds,true);ctx.restore();qr(949,253-float,137);text('CONCEPT QR',1017,433-float,11,muted);line(905,510,1120,455,red,6);line(1120,455,1102,453,red,6);line(1120,455,1114,476,red,6);
      text(pair('منيو يتشاف. ورسالة توصل.','A menu to explore. A story to tell.'),ar?595:85,306,ar?33:27,white,ar?'right':'left');text(pair('منيو إلكتروني وتسويق رقمي.','Digital menus and digital marketing.'),ar?595:85,367,22,muted,ar?'right':'left');text('QR MENUS / MARKETING',ar?595:85,425,12,red,ar?'right':'left');
    }else{
      ctx.drawImage(logo,205,400,840,470,405,166,470,263);
      text(pair('نطوّر فكرتك. خطوة بخطوة.','Build your next chapter.'),640,500,ar?40:43,white);text('maddardigital.com',640,562,22,'#ff8290', 'center',500);
    }
    ctx.restore();
  }
  frame(.8);const poster=canvas.toDataURL('image/jpeg',.88).split(',')[1];
  const mime='video/mp4;codecs=avc1.42E01E';if(!MediaRecorder.isTypeSupported(mime))throw Error('MP4 recording is unavailable');
  const stream=canvas.captureStream(24),recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1050000}),chunks=[];
  recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
  const done=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=reject;});recorder.start();
  const started=performance.now();await new Promise(resolve=>{function tick(){const seconds=(performance.now()-started)/1000;frame(Math.min(seconds,duration-.01));if(seconds<duration)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});
  recorder.stop();await done;stream.getTracks().forEach(track=>track.stop());
  const video=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:'video/mp4'}));});
  return {video,poster,duration,width:1280,height:720};
};
