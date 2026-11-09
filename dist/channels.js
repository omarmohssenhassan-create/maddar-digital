(() => {
  const {e,icon}=window.UI;
  const {t,content}=window.I18N;
  function links(mode="contact"){
    const company=content().company,footer=mode==="footer",items=[];
    const email=/^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(company.email||"")?company.email:"";
    const facebook=window.PosTools.safeUrl(company.facebookUrl);
    if(email){
      items.push(footer
        ?'<a class="footer-email" href="mailto:'+e(email)+'" aria-label="'+e(t("emailCompany",{company:company.name}))+'">'+icon("mail")+'<bdi dir="ltr">'+e(email)+'</bdi></a>'
        :'<a class="contact-channel contact-email" href="mailto:'+e(email)+'"><span class="channel-symbol">'+icon("mail")+'</span><span class="channel-copy"><small>'+t("emailTitle")+'</small><bdi dir="ltr">'+e(email)+'</bdi></span></a>');
    }
    if(facebook){
      items.push(footer
        ?'<a class="footer-facebook" href="'+e(facebook)+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(t("facebookCompany",{company:company.name}))+'" title="'+e(t("facebookTitle"))+'">'+icon("facebook")+'</a>'
        :'<a class="contact-channel contact-facebook" href="'+e(facebook)+'" target="_blank" rel="noopener noreferrer"><span class="channel-symbol">'+icon("facebook")+'</span><span class="channel-copy"><small>'+t("facebookTitle")+'</small><b dir="ltr">'+e(company.name)+'</b></span>'+icon("arrowup")+'</a>');
    }
    if(footer)items.push(window.WhatsApp.footerLink());
    return items.filter(Boolean).length?'<div class="'+(footer?'container footer-contact-row':'contact-channels')+'">'+items.join("")+'</div>':"";
  }
  window.CompanyChannels={links};
})();
