(() => {
  const {e,icon}=window.UI;
  const {t,content}=window.I18N;
  function details(){
    const company=content().company;
    const number=window.PosTools.whatsappNumber(company.whatsapp);
    if(!number)return null;
    return {url:"https://wa.me/"+number,label:t("whatsappLabel",{company:company.name})};
  }
  function card(){
    const wa=details();if(!wa)return "";
    return '<div class="whatsapp-card"><div class="whatsapp-card-main"><span class="whatsapp-card-icon">'+icon("whatsapp")+'</span><h3>'+t("whatsappDirect")+'</h3><a class="whatsapp-chat-link" href="'+wa.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(wa.label)+'">'+t("openWhatsapp")+' '+icon("arrowup")+'</a><p>'+t("whatsappHint")+'</p></div></div>';
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
