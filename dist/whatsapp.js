(() => {
  const {e,icon}=window.UI;
  const {t,content}=window.I18N;
  let cachedUrl="",cachedQr="";
  function details(){
    const company=content().company;
    const number=window.PosTools.whatsappNumber(company.whatsapp);
    if(!number)return null;
    const display=/^201[0125]\d{8}$/.test(number)?"0"+number.slice(2):"+"+number;
    return {number,display,url:"https://wa.me/"+number,label:t("whatsappQrLabel",{company:company.name,number:display})};
  }
  function qr(url){
    if(url!==cachedUrl){
      const code=window.qrcode(0,"M");
      code.addData(url);code.make();
      cachedQr=code.createSvgTag({cellSize:4,margin:16,scalable:true})
        .replace("<svg ","<svg aria-hidden=\"true\" focusable=\"false\" shape-rendering=\"crispEdges\" ");
      cachedUrl=url;
    }
    return cachedQr;
  }
  function card(){
    const wa=details();if(!wa)return "";
    return '<div class="whatsapp-card"><div class="whatsapp-card-main"><span class="whatsapp-card-icon">'+icon("whatsapp")+'</span><h3>'+t("whatsappDirect")+'</h3><a class="whatsapp-chat-link" href="'+wa.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(wa.label)+'">'+t("openWhatsapp")+' '+icon("arrowup")+'</a><p>'+t("whatsappScan")+'</p></div><a class="whatsapp-qr" href="'+wa.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(wa.label)+'">'+qr(wa.url)+'</a></div>';
  }
  function quickLink(){
    const wa=details();if(!wa)return "";
    return '<a class="whatsapp-float" href="'+wa.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(wa.label)+'" title="'+e(t("whatsapp"))+'">'+icon("whatsapp")+'</a>';
  }
  function footerLink(){
    const wa=details();if(!wa)return "";
    return '<a class="footer-whatsapp" href="'+wa.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(wa.label)+'">'+icon("whatsapp")+'</a>';
  }
  window.WhatsApp={card,quickLink,footerLink};
})();
