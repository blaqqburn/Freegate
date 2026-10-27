(() => {
  'use strict';
  if (document.getElementById('fgw-guide')) return;
  const copy = {
    en: {label:'Your FREEGATEWEAR guide',intro:'Welcome to FREEGATEWEAR. Streetwear rooted in freedom, culture and self-expression. Explore graphic hoodies, tees and embroidered headwear. Find your next fit in our official shop.',shop:'Shop now ↗',listen:'Hear the intro',stop:'Stop audio',close:'Close introduction',open:'Open FREEGATEWEAR introduction',region:'FREEGATEWEAR brand guide',unavailable:'Voice is unavailable on this device. You can still read the introduction.',error:'Audio could not start. You can read the introduction here.',voice:'Uses a voice on your device. No microphone needed.'},
    de: {label:'Dein FREEGATEWEAR Guide',intro:'Willkommen bei FREEGATEWEAR. Streetwear für Freiheit, Kultur und deinen eigenen Ausdruck. Entdecke Hoodies mit markanten Motiven, T-Shirts und bestickte Caps und Mützen. Finde deinen nächsten Look in unserem offiziellen Shop.',shop:'Zum Shop ↗',listen:'Intro anhören',stop:'Audio stoppen',close:'Einführung schließen',open:'FREEGATEWEAR Einführung öffnen',region:'FREEGATEWEAR Marken-Guide',unavailable:'Auf diesem Gerät ist keine Stimme verfügbar. Du kannst die Einführung weiterhin lesen.',error:'Audio konnte nicht starten. Du kannst die Einführung hier lesen.',voice:'Nutzt eine Stimme auf deinem Gerät. Kein Mikrofon nötig.'}
  };
  const key='freegatewear-guide-dismissed';
  const root=document.createElement('aside');root.id='fgw-guide';root.className='fgw-guide';root.hidden=true;
  root.innerHTML='<section class="fgw-guide-panel" id="fgw-guide-panel"><button class="fgw-guide-close" type="button">×</button><p class="fgw-guide-label"></p><p class="fgw-guide-copy"></p><div class="fgw-guide-actions"><a class="fgw-guide-shop" href="https://freegate.storenvy.com/" target="_blank" rel="noopener noreferrer"></a><button class="fgw-guide-listen" type="button"></button></div><small class="fgw-guide-status" role="status"></small></section><button class="fgw-guide-character" type="button" aria-controls="fgw-guide-panel"><img src="images/freegatewear-guide.webp" alt="" width="94" height="168" decoding="async"></button>';
  document.body.append(root);
  const panel=root.querySelector('.fgw-guide-panel'),character=root.querySelector('.fgw-guide-character'),listen=root.querySelector('.fgw-guide-listen'),status=root.querySelector('.fgw-guide-status');
  const synth=window.speechSynthesis;let speaking=false,utterance=null,collapsed=false;
  try{collapsed=sessionStorage.getItem(key)==='1';}catch(_){}
  const language=()=>document.documentElement.lang==='de'?'de':'en';
  const text=()=>copy[language()];
  const localVoice=()=>synth&&synth.getVoices().find(v=>v.localService&&v.lang.toLowerCase().split('-')[0]===language());
  function stop(){if(speaking&&synth)synth.cancel();speaking=false;utterance=null;root.dataset.speaking='false';listen.textContent=text().listen;listen.setAttribute('aria-pressed','false');}
  function refreshVoice(){listen.disabled=!localVoice();status.textContent=listen.disabled?text().unavailable:text().voice;}
  function setCollapsed(value,remember){collapsed=value;panel.hidden=value;root.dataset.collapsed=String(value);character.setAttribute('aria-expanded',String(!value));character.setAttribute('aria-label',value?text().open:text().close);if(value)stop();if(remember)try{if(value)sessionStorage.setItem(key,'1');else sessionStorage.removeItem(key);}catch(_){} }
  function render(){stop();root.setAttribute('aria-label',text().region);root.querySelector('.fgw-guide-label').textContent=text().label;root.querySelector('.fgw-guide-copy').textContent=text().intro;root.querySelector('.fgw-guide-shop').textContent=text().shop;root.querySelector('.fgw-guide-close').setAttribute('aria-label',text().close);setCollapsed(collapsed,false);refreshVoice();}
  character.addEventListener('click',()=>setCollapsed(!collapsed,true));
  root.querySelector('.fgw-guide-close').addEventListener('click',()=>{setCollapsed(true,true);character.focus();});
  root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!collapsed){setCollapsed(true,true);character.focus();}});
  listen.addEventListener('click',()=>{
    if(speaking){stop();return;}const voice=localVoice();if(!voice){refreshVoice();return;}
    utterance=new SpeechSynthesisUtterance(text().intro);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.95;
    utterance.onend=()=>{stop();refreshVoice();};utterance.onerror=()=>{stop();status.textContent=text().error;};
    speaking=true;root.dataset.speaking='true';listen.textContent=text().stop;listen.setAttribute('aria-pressed','true');
    try{synth.speak(utterance);}catch(_){stop();status.textContent=text().error;}
  });
  if(synth)synth.addEventListener('voiceschanged',refreshVoice);
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
  root.querySelector('img').addEventListener('error',()=>{root.hidden=true;});
  render();setTimeout(()=>{root.hidden=false;root.dataset.ready='true';},700);
})();
