(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // banner dismiss
  $('.banner-x').addEventListener('click',function(){$('#banner').classList.add('gone')});

  // sticky nav border
  var nav=$('.nav');
  var onSc=function(){nav.classList.toggle('sc',window.scrollY>8)};
  window.addEventListener('scroll',onSc,{passive:true});onSc();

  // mobile menu + dropdown toggles (click works for touch)
  var burger=$('.burger'),menu=$('#menu');
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  $$('.dd-b').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var o=b.getAttribute('aria-expanded')==='true';
      $$('.dd-b').forEach(function(x){x.setAttribute('aria-expanded','false')});
      b.setAttribute('aria-expanded',o?'false':'true');
    });
  });
  document.addEventListener('click',function(){$$('.dd-b').forEach(function(x){x.setAttribute('aria-expanded','false')})});
  $$('.dd-m a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')})});

  // typed prompt in hero
  var prompts=['Summarize the risky clauses in the Acme renewal','Draft a reply that confirms the delivery dates','Which policy covers supplier onboarding?','Extract the fields from this month\u2019s invoices','Summarize three candidates for the ops lead role'];
  var el=$('#typedTxt'),pi=0,ci=prompts[0].length,dir=-1,wait=0;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    wait=50;
    setInterval(function(){
      if(wait>0){wait--;return}
      var p=prompts[pi];
      if(dir===1){ci++;if(ci>=p.length){ci=p.length;dir=-1;wait=40}}
      else{ci-=2;if(ci<=0){ci=0;dir=1;pi=(pi+1)%prompts.length}}
      el.textContent=prompts[pi].slice(0,ci);
    },45);
  }

  // industry tabs
  var tabs=$$('.ind-tabs button'),panes=$$('.ind-p');
  tabs.forEach(function(t,i){t.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});
    panes.forEach(function(p){p.classList.remove('on')});
    t.classList.add('on');t.setAttribute('aria-selected','true');panes[i].classList.add('on');
  })});

  // site search over section headings
  var idx=[
    ['Platform overview','#platform'],['Assistant, search and agents','#products'],['Enterprise-grade security','#security'],['Model intelligence and routing','#intelligence'],
    ['Workspace assistant','#industry'],['Knowledge-base Q&A','#industry'],['Email summarization and drafting','#industry'],['Contract review','#industry'],['Recruitment assistance','#industry'],['Finance document processing','#industry'],
    ['Architecture on AWS','#architecture'],['Deployment options','#deployment'],['FAQ','#faq'],['About LinkValue','#about'],['Contact and demo','#contact']
  ];
  var inp=$('#siteSearch'),res=$('#srchRes');
  inp.addEventListener('input',function(){
    var q=inp.value.trim().toLowerCase();
    if(!q){res.classList.remove('on');res.innerHTML='';return}
    var hits=idx.filter(function(x){return x[0].toLowerCase().indexOf(q)>-1}).slice(0,6);
    res.innerHTML=hits.length?hits.map(function(h){return '<a href="'+h[1]+'">'+h[0]+'</a>'}).join(''):'<em>No results</em>';
    res.classList.add('on');
  });
  res.addEventListener('click',function(){res.classList.remove('on');inp.value=''});
  document.addEventListener('click',function(e){if(!e.target.closest('.srch'))res.classList.remove('on')});

  // reveal (translate only)
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
    $$('.why-l,.metric,.why2-art,.bfe-l article,.bfe-r,.stat-g div,.story,.q-g blockquote,.prods-g article,.dep-g article,.wai-g article,.lane').forEach(function(x){x.classList.add('rv');io.observe(x)});
  }

  $('#yr').textContent=new Date().getFullYear();

  // contact form: fake send animation (static site, no backend)
  var f=$('#contactForm'),note=$('#formNote'),btn=f.querySelector('button[type="submit"]'),label=btn.innerHTML;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(f.classList.contains('sending')||f.classList.contains('sent'))return;
    var ok=true;
    ['name','email'].forEach(function(n){var el=f.elements[n],v=el.value.trim();
      var bad=!v||(n==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));el.classList.toggle('bad',bad);if(bad)ok=false});
    if(!ok){note.className='form-note err';note.textContent='Please enter your name and a valid work email.';return}
    note.className='form-note';note.textContent='';
    var who=f.elements.name.value.trim().split(/\s+/)[0];
    f.classList.add('sending');btn.disabled=true;btn.innerHTML='<span class="spin"></span>Sending\u2026';
    setTimeout(function(){
      f.classList.remove('sending');f.classList.add('sent');
      $('#doneName').textContent=who||'there';
      btn.disabled=false;btn.innerHTML=label;
    },1500);
  });
  $('#sendAnother').addEventListener('click',function(){
    f.classList.remove('sent');f.reset();note.textContent='';
    $$('.form input').forEach(function(i){i.classList.remove('bad')});
  });

  // email scenario: fake summarize -> draft typewriter
  var sumEl=$('#maSum'),drEl=$('#maDraft');
  if(sumEl&&!reduce){
    var summary='Supplier confirms 12 March delivery. Two invoices remain outstanding and need review before payment.';
    var draft='Dear Wei, thanks \u2013 noted the 12 March delivery. We\u2019ll reconcile the two outstanding invoices this week and confirm once posted.';
    var phase=0,i1=0,i2=0,tick=0;
    setInterval(function(){
      tick++;
      if(phase===0){
        i1=Math.min(summary.length,i1+1);sumEl.textContent=summary.slice(0,i1);
        if(i1===summary.length){phase=1;tick=0}
      }else if(phase===1){
        if(tick>18){phase=2;tick=0}
      }else if(phase===2){
        i2=Math.min(draft.length,i2+1);drEl.textContent=draft.slice(0,i2);
        if(i2===draft.length){phase=3;tick=0}
      }else{
        if(tick>90){phase=0;i1=0;i2=0;sumEl.textContent='';drEl.textContent='';tick=0}
      }
    },32);
  }else if(sumEl){
    sumEl.textContent='Supplier confirms 12 March delivery. Two invoices remain outstanding.';
    drEl.textContent='Draft reply ready for review.';
  }
})();
