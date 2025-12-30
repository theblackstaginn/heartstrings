(() => {
  "use strict";

  // --- CONTENT DATA (edit freely) ---
  // Keep it minimal on day one. Add inventory later.
  const SECTIONS = [
    {
      title: "Tarot & Oracles",
      note: "Decks, spreads, and paper relics.",
      items: [
        { name: "Lost in Arcadia Tarot (pre-launch)", desc: "A quiet, ruin-lit deck in development.", price: "", badge: "Coming Soon" },
        { name: "Utility Frames & Templates", desc: "Infrastructure for creators. Clean. Honest.", price: "", badge: "Seasonal" }
      ]
    },
    {
      title: "Ritual Tools",
      note: "Practical magic, not theater.",
      items: [
        { name: "Candles & Holders", desc: "For focus, offerings, and steady light.", price: "", badge: "" },
        { name: "Incense & Resins", desc: "Smoke as signal: cleanse, call, settle.", price: "", badge: "" },
        { name: "Altar Goods", desc: "Bowls, cloths, vessels—quiet fundamentals.", price: "", badge: "" }
      ]
    },
    {
      title: "Remedies & Comfort",
      note: "Body-honoring, calm-first.",
      items: [
        { name: "Tea Blends", desc: "Evening, grounding, and hearth-warm cups.", price: "", badge: "" },
        { name: "Bath Rituals", desc: "Salts, oils, and slow restoration.", price: "", badge: "" }
      ]
    },
    {
      title: "Curiosities",
      note: "Objects with a past—or the illusion of one.",
      items: [
        { name: "Books & Field Notes", desc: "Folklore, craft, and the long memory.", price: "", badge: "" },
        { name: "Seals, Papers, & Wax", desc: "Marks that make the moment real.", price: "", badge: "" }
      ]
    }
  ];

  // --- Render ---
  const content = document.getElementById("content");
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  function el(tag, cls, text){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render(){
    content.innerHTML = "";
    for (const sec of SECTIONS){
      const card = el("section", "section");
      const head = el("div", "sectionHead");
      head.appendChild(el("h2", "sectionTitle", sec.title));
      head.appendChild(el("div", "sectionNote", sec.note || ""));
      card.appendChild(head);

      const items = el("div", "items");
      for (const it of sec.items){
        const row = el("div", "item");
        const left = el("div", "left");
        left.appendChild(el("p", "name", it.name));
        if (it.desc) left.appendChild(el("p", "desc", it.desc));

        const right = el("div", "right");
        if (it.badge) right.appendChild(el("span", "badge", it.badge));
        if (it.price) right.appendChild(el("span", "price", it.price));

        row.appendChild(left);
        row.appendChild(right);
        items.appendChild(row);
      }
      card.appendChild(items);
      content.appendChild(card);
    }
  }

  render();

  // --- Embers (quiet, slow, non-intrusive) ---
  // No hard colors set; we derive ember tint from copper tone indirectly via alpha and blending.
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("embers");
  const ctx = canvas?.getContext?.("2d");

  if (canvas && ctx && !prefersReduced){
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let particles = [];
    let lastT = performance.now();

    function resize(){
      W = Math.floor(window.innerWidth);
      H = Math.floor(window.innerHeight);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function rand(a,b){ return a + Math.random()*(b-a); }

    function seed(){
      // Fewer particles than the menu version: calm, not spectacle
      const count = Math.round(Math.min(90, Math.max(45, (W*H)/22000)));
      particles = [];
      for (let i=0;i<count;i++){
        particles.push({
          x: rand(0,W),
          y: rand(H*0.45, H),
          r: rand(0.8, 2.2),
          vy: rand(10, 26),         // slow rise
          vx: rand(-6, 6),
          life: rand(2.8, 6.2),
          age: rand(0, 6),
          glow: rand(0.08, 0.22)
        });
      }
    }

    function step(t){
      const dt = Math.min(0.033, (t - lastT)/1000);
      lastT = t;

      ctx.clearRect(0,0,W,H);

      // Gentle vignette-like dim at edges (subtle)
      ctx.save();
      ctx.globalAlpha = 0.12;
      const g = ctx.createRadialGradient(W/2, H*0.35, Math.min(W,H)*0.10, W/2, H*0.35, Math.min(W,H)*0.75);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles){
        p.age += dt;
        p.x += p.vx * dt;
        p.y -= p.vy * dt;

        // Keep embers away from the border edges: soft containment
        const inset = 34;
        if (p.x < inset) p.x = inset;
        if (p.x > W - inset) p.x = W - inset;

        // Drift gently
        p.vx += rand(-2,2) * dt;
        p.vx *= 0.985;

        // Fade in/out
        const k = Math.min(1, Math.max(0, p.age / 0.9)) * Math.min(1, Math.max(0, (p.life - p.age) / 1.2));
        const a = k * (0.55 * p.glow);

        // Ember “spark” (warm-ish via blending; no hard hue)
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,200,150,1)"; // slight warmth; blended and low alpha
        ctx.fill();

        // Reset particle when dead or too high
        if (p.age > p.life || p.y < H*0.12){
          p.x = rand(inset, W - inset);
          p.y = rand(H*0.60, H);
          p.r = rand(0.8, 2.2);
          p.vy = rand(10, 26);
          p.vx = rand(-6, 6);
          p.life = rand(2.8, 6.2);
          p.age = 0;
          p.glow = rand(0.08, 0.22);
        }
      }

      ctx.restore();
      requestAnimationFrame(step);
    }

    window.addEventListener("resize", () => {
      resize();
      seed();
    }, { passive:true });

    resize();
    seed();
    requestAnimationFrame(step);
  }

  // --- PWA offline caching ---
  if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();