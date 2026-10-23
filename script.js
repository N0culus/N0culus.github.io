/* Menu mobile */
const burger=document.querySelector('.burger'),links=document.querySelector('.links');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
links.addEventListener('click',()=>links.classList.remove('open'));
document.getElementById('y').textContent=new Date().getFullYear();

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Projets : chaque card renvoie vers la page de formation concernée */
const projects=[
 {t:"CTF « Une nuit pour hacker »",d:"2026",s:"Co-organisation d'un CTF de plus de 150 participants et 130+ challenges : Active Directory, WiFi et Web.",
  tags:["Proxmox","Fortigate","Active Directory","WiFi","Web"],link:"formation-manager.html"},
 {t:"Mémoire technique",d:"2025 – 2026",s:"Dans quelle mesure les entreprises peuvent-elles reprendre le contrôle de leurs données ?",
  tags:["Souveraineté numérique","RGPD","Cloud souverain"],link:"formation-manager.html"},
 {t:"Projet ITWay",d:"2025",s:"Infrastructure entièrement dockerisée avec pare-feu, VLANs, DNS et messagerie, menée en SCRUM.",
  tags:["Docker","Stormshield","Bind9","Postfix/Dovecot","Ansible","GNS3"],link:"formation-bachelor.html"},
 {t:"Infrastructure BTS multi-sites",d:"2024",s:"Infrastructure multi-sites redondante : VPN, annuaire, supervision, sauvegarde et DMZ.",
  tags:["Proxmox","pfSense","Active Directory","GLPI","Zabbix","HAProxy","Veeam"],link:"formation-bts.html"}
];
const tag=a=>a.map(x=>`<span>${x}</span>`).join('');
const grid=document.getElementById('grid');
if(grid)projects.forEach(p=>{
  const a=document.createElement('a');a.className='card';a.href=p.link;
  a.innerHTML=`<span class="date">${p.d}</span><h3>${p.t}</h3><p>${p.s}</p><div class="chips">${tag(p.tags)}</div><span class="more">En savoir plus →</span>`;
  grid.appendChild(a);
});

/* Nav active */
const secs=[...document.querySelectorAll('header[id],section[id]')],navA=[...document.querySelectorAll('.links a')];
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)navA.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
if(document.body.dataset.page==='home')secs.forEach(s=>so.observe(s));

/* Timeline reveal */
const tl=document.getElementById('tl');
if(tl){
  const fill=document.createElement('div');fill.className='tl-fill';tl.prepend(fill);
  const items=[...tl.querySelectorAll('li')];
  if(reduce){
    items.forEach(li=>li.classList.add('in'));
    fill.style.height='100%';
  }else{
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
      let max=0;
      items.forEach(li=>{if(li.classList.contains('in'))max=Math.max(max,li.offsetTop+li.offsetHeight/2)});
      fill.style.height=max+'px';
    },{threshold:.35});
    items.forEach(li=>io.observe(li));
  }
}

/* Compteurs */
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;co.unobserve(e.target);
  const t=+e.target.dataset.n,s=e.target.dataset.suffix||'';
  if(reduce){e.target.textContent=t+s;return}
  let st=null;(function f(ts){st=st||ts;const p=Math.min((ts-st)/1200,1);e.target.textContent=Math.round(t*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(performance.now());
}),{threshold:.6});
document.querySelectorAll('.stat b').forEach(b=>co.observe(b));

/* Formulaire de contact (Formspree) */
const f=document.getElementById('form');
if(f)f.addEventListener('submit',async e=>{
  e.preventDefault();
  const st=document.getElementById('status');
  if(f.action.includes('VOTRE_ID')){st.className='status err';st.textContent="Formulaire non configuré : remplacer VOTRE_ID par l'identifiant Formspree.";return}
  st.className='status';st.textContent='Envoi en cours…';
  try{
    const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
    if(!r.ok)throw 0;
    f.reset();st.className='status ok';st.textContent='Message envoyé, merci. Je vous répondrai rapidement.';
  }catch{st.className='status err';st.textContent="L'envoi a échoué. Écrivez-moi directement par email."}
});

/* Zoom sur les captures (.shot) : clic pour agrandir, clic pour réduire */
(function(){
  const shots=[...document.querySelectorAll('.shot img')];
  if(!shots.length)return;
  const dlg=document.createElement('dialog');dlg.className='zoom';
  const big=document.createElement('img');big.alt='';
  dlg.appendChild(big);document.body.appendChild(dlg);
  shots.forEach(img=>{
    img.closest('.shot').addEventListener('click',()=>{big.src=img.currentSrc||img.src;dlg.showModal()});
  });
  dlg.addEventListener('click',()=>dlg.close());
})();
