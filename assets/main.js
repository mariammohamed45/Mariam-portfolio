// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    navLinks.classList.toggle('open-mobile');
    if(navLinks.classList.contains('open-mobile')){
      navLinks.style.display='flex';
      navLinks.style.position='fixed';
      navLinks.style.top='64px'; navLinks.style.left='0'; navLinks.style.right='0';
      navLinks.style.flexDirection='column';
      navLinks.style.background='rgba(9,12,20,0.97)';
      navLinks.style.padding='24px 28px';
      navLinks.style.borderBottom='1px solid var(--border)';
      navLinks.style.gap='18px';
    } else {
      navLinks.style.display='none';
    }
  });
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

// ===== Typing animation (hero) =====
const typingEl = document.getElementById('typing');
if(typingEl){
  const phrases = JSON.parse(typingEl.dataset.phrases || '[]');
  let pI=0, cI=0, deleting=false;
  function tick(){
    const phrase = phrases[pI];
    if(!deleting){
      cI++;
      typingEl.textContent = phrase.slice(0,cI);
      if(cI === phrase.length){ deleting = true; setTimeout(tick, 1400); return; }
    } else {
      cI--;
      typingEl.textContent = phrase.slice(0,cI);
      if(cI === 0){ deleting = false; pI = (pI+1)%phrases.length; }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }
  tick();
}

// ===== Node network canvas (hero background) =====
const canvas = document.getElementById('nodeCanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W,H,nodes=[];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function init(){
    resize();
    const count = Math.min(60, Math.floor((W*H)/22000));
    nodes = Array.from({length:count}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25
    }));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const n of nodes){
      if(!reduceMotion){ n.x+=n.vx; n.y+=n.vy; }
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d<130){
          ctx.strokeStyle = `rgba(124,108,255,${0.14*(1-d/130)})`;
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.fillStyle='rgba(38,217,232,0.55)';
      ctx.beginPath(); ctx.arc(n.x,n.y,1.8,0,Math.PI*2); ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  init();
  draw();
  window.addEventListener('resize', init);
}

// ===== Animated stat counters =====
document.querySelectorAll('.stat .num[data-target]').forEach(el=>{
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        let cur=0; const step = target/40;
        const t = setInterval(()=>{
          cur += step;
          if(cur>=target){ cur=target; clearInterval(t); }
          el.textContent = (Number.isInteger(target) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
        },25);
        obs.unobserve(el);
      }
    });
  },{threshold:0.5});
  obs.observe(el);
});

// ===== Certificate lightbox =====
const lightbox = document.getElementById('lightbox');
if(lightbox){
  const lbImg = lightbox.querySelector('img');
  document.querySelectorAll('.cert-card img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lbImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', ()=> lightbox.classList.remove('open'));
}

// ===== Nav shadow on scroll =====
const headerNav = document.querySelector('header.nav');
if(headerNav){
  window.addEventListener('scroll', ()=>{
    headerNav.style.boxShadow = window.scrollY>10 ? '0 8px 30px rgba(0,0,0,0.3)' : 'none';
  });
}
