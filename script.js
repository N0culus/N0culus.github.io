/* Menu mobile */
const burger=document.querySelector('.burger'),links=document.querySelector('.links');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
links.addEventListener('click',()=>links.classList.remove('open'));
document.getElementById('y').textContent=new Date().getFullYear();

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Typewriter */
const roles=["Étudiant Manager en Ingénierie Informatique","Futur Expert Cybersécurité","Alternant Systèmes & Réseaux"];
const el=document.getElementById('role');
if(!el){}else if(reduce){el.textContent=roles[0]}else{
  let r=0,c=0,del=false;
  (function tick(){
    const w=roles[r];
    el.textContent=w.slice(0,c);
    if(!del&&c===w.length){del=true;return setTimeout(tick,1600)}
    if(del&&c===0){del=false;r=(r+1)%roles.length}
    c+=del?-1:1;
    setTimeout(tick,del?28:60);
  })();
}

/* Réseau de nœuds */
(function(){
  const cv=document.getElementById('net');if(!cv)return;const ctx=cv.getContext('2d');
  let W,H,pts=[],mouse={x:-999,y:-999};
  function size(){
    const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;
    cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
    const n=Math.min(90,Math.floor(W*H/14000));
    pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const p of pts){
      if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
      ctx.fillStyle='rgba(14,165,233,.7)';ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,6.283);ctx.fill();
    }
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
        if(d<130){ctx.strokeStyle=`rgba(14,165,233,${.28*(1-d/130)})`;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}
      }
      const m=Math.hypot(pts[i].x-mouse.x,pts[i].y-mouse.y);
      if(m<160){ctx.strokeStyle=`rgba(241,245,249,${.35*(1-m/160)})`;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
    }
    if(!reduce)requestAnimationFrame(draw);
  }
  addEventListener('resize',()=>{size();if(reduce)draw()});
  document.getElementById('hero').addEventListener('mousemove',e=>{const b=cv.getBoundingClientRect();mouse.x=e.clientX-b.left;mouse.y=e.clientY-b.top});
  size();draw();
})();

/* Projets : chaque card renvoie vers la page de formation concernée */
const projects=[
 {t:"CTF « Une nuit pour hacker »",d:"2026",s:"Co-organisation d'un CTF de plus de 150 participants et 130+ challenges : Active Directory, WiFi et Web.",
  tags:["Proxmox","Fortigate","Active Directory","WiFi","Web"],link:"formation-manager.html"},
 {t:"Mémoire technique",d:"2025 – 2026",s:"Dans quelle mesure les entreprises peuvent-elles reprendre le contrôle de leurs données ?",
  tags:["Souveraineté numérique","RGPD","Cloud souverain"],link:"formation-manager.html"},
 {t:"Projet ITWay",d:"2025",s:"Infrastructure entièrement dockerisée avec pare-feu, VLANs, DNS et messagerie, menée en SCRUM.",
  tags:["Docker","Stormshield","Bind9","Postfix/Dovecot","Ansible","GNS3"],link:"formation-bachelor.html"},
 {t:"Infrastructure BTS multi-sites",d:"2024",s:"Infrastructure multi-sites redondante : VPN, annuaire, supervision, sauvegarde et DMZ.",
  tags:["Proxmox","pfSense","Active Directory","GLPI","Zabbix","HAProxy","Veeam","FOG"],link:"formation-bts.html"}
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
