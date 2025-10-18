/* ========= CONFIG ========= */
// Your projects — no images needed (logos auto-fetch from site favicons).
/* ========= CONFIG ========= */
// Your projects — no images needed (logos auto-fetch from site favicons).
const PROJECTS = [
  { 
    name: "Nazneen Akbari", 
    url: "https://nazneenakbari.com", 
    desc: "E-commerce fashion site — full design, development, and management.", 
    tags: ["Shopify","SEO","Speed"], 
    badge: "Fashion" 
  },
  { 
    name: "Malik Heating & Cooling", 
    url: "https://malikheatingcooling.com", 
    desc: "Technical fixes & performance tuning.", 
    tags: ["Fixes","Speed"] 
  },
  { 
    name: "Daraz Store", 
    url: "https://www.daraz.pk/shop/pzg6b52d", 
    desc: "E-commerce operations & optimization on Daraz.", 
    tags: ["E-commerce","Ops"], 
    badge: "Marketplace" 
  },
  { 
    name: "Video Editing", 
    url: "https://www.youtube.com/shorts/cr0SNEhqN1M", 
    desc: "Movie clip edit as a short for YouTube.", 
    tags: ["Video Editing","Filmora"], 
    badge: "Video" 
  }
];


// EmailJS keys — PUBLIC ONLY. Do NOT expose private key on the web.
const EMAILJS_PUBLIC_KEY  = "uyOn7ZH2LPUeSQkJw";
const EMAILJS_SERVICE_ID  = "service_y88e7ph";
// Either rename your EmailJS template to 'template_contact' OR replace with your actual template id (e.g., 'template_abc123')
const EMAILJS_TEMPLATE_ID = "template_lzlo1bg";

/* ======== HELPERS ======== */
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function faviconURL(siteURL){
  try{ const u = new URL(siteURL); return `https://www.google.com/s2/favicons?sz=128&domain=${u.hostname}`; }
  catch{ return `https://www.google.com/s2/favicons?sz=128&domain=${siteURL}`; }
}

function svgFallback(){
  return `<div class="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-width="1.6" d="M12 2l3 7h7l-5.7 4.1L18 21l-6-4-6 4 1.7-7.9L2 9h7z"/>
            </svg>
          </div>`;
}

function projectCard(p){
  const icon = faviconURL(p.url);
  const badge = p.badge ? `<span class="absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full bg-cyan-500/90">${p.badge}</span>` : "";
  const tags  = (p.tags||[]).map(t=>`<span class="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px]">${t}</span>`).join("");
  return `
    <a href="${p.url}" target="_blank" rel="noopener" class="glass rounded-xl p-6 h3d reveal neon-hover project-card">
      <div class="relative overflow-hidden rounded-lg flex justify-center items-center h-52 bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30">
        ${badge}
        <img src="${icon}" alt="${p.name} logo" class="w-16 h-16"
             onerror="this.style.display='none'; this.previousElementSibling?.remove(); this.parentElement.insertAdjacentHTML('beforeend', '${svgFallback()}');" />
      </div>
      <h3 class="mt-6 text-xl font-bold text-cyan-300">${p.name}</h3>
      <p class="mt-3 text-slate-400">${p.desc}</p>
      <div class="mt-4 flex flex-wrap gap-2">${tags}</div>
    </a>
  `;
}

function renderProjects(){
  const grid = $("#projectsGrid");
  grid.innerHTML = PROJECTS.map(projectCard).join("");
  $$(".reveal", grid).forEach(el=>io.observe(el));
}

function toast(msg, ok=true){
  const t = $("#toast");
  t.textContent = msg;
  t.style.display = "block";
  t.className = ok ? "glass rounded-lg px-6 py-4 text-lg border border-emerald-400/50" : "glass rounded-lg px-6 py-4 text-lg border border-rose-400/50";
  setTimeout(()=> t.style.display="none", 3500);
}

/* ======== INIT ======== */
// Year
 $("#year").textContent = new Date().getFullYear();

// Mobile nav
 $("#navToggle").addEventListener("click", ()=>{
  $("#mobile").classList.toggle("hidden");
  $("#nav").classList.toggle("hidden");
});

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("revealed"); io.unobserve(e.target); }
  });
}, {threshold:.12});
 $$(".reveal").forEach(el=>io.observe(el));

// Counters
const co = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target; const target = +el.dataset.counter; let cur = 0;
      const step = Math.max(1, Math.ceil(target/42));
      const t = setInterval(()=>{ cur += step; if(cur>=target){ cur=target; clearInterval(t); } el.textContent = cur; }, 24);
      co.unobserve(el);
    }
  });
}, {threshold:.6});
 $$("[data-counter]").forEach(el=>co.observe(el));

// Render projects
renderProjects();

// Hide CV button if file doesn't exist
(async ()=>{
  try{ const res = await fetch("gr%20cv.pdf", {method:"HEAD"}); if(!res.ok) throw new Error(); }
  catch{ $("#cvBtn")?.parentElement?.remove(); }
})();

// Back to top button
const topBtn = $("#totop");
window.addEventListener("scroll", ()=>{
  if(window.scrollY > 600){ topBtn.style.display = "block"; } else { topBtn.style.display = "none"; }
});
topBtn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));

// Keyboard shortcuts: g p → projects, g c → contact
let gPressed = false;
window.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase() === "g"){ gPressed = true; setTimeout(()=>gPressed=false, 800); }
  else if(gPressed && e.key.toLowerCase() === "p"){ location.hash = "#projects"; }
  else if(gPressed && e.key.toLowerCase() === "c"){ location.hash = "#contact"; }
});

// EmailJS init
try{
  if(window.emailjs && EMAILJS_PUBLIC_KEY){ emailjs.init(EMAILJS_PUBLIC_KEY); }
}catch{}

// Contact form submit
 $("#contactForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const hp = e.target.querySelector('[name="_hp"]');
  if(hp && hp.value){ return; } // honeypot: silently ignore bots

  const btn = $("#sendBtn"), spin = $("#spinner");
  btn.setAttribute("disabled","disabled"); spin.classList.remove("hidden");

  const formData = new FormData(e.target);
  const params = Object.fromEntries(formData.entries());

  try{
    if(!window.emailjs) throw new Error("EmailJS not loaded.");
    if(!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID){
      throw new Error("EmailJS config missing.");
    }
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    toast("Message sent! I'll get back to you shortly.");
    e.target.reset();
  }catch(err){
    console.error(err);
    toast("Sending failed. Please email me directly.", false);
  }finally{
    btn.removeAttribute("disabled"); spin.classList.add("hidden");
  }
});

