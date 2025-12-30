(() => {
  "use strict";

  /* ===========================
     HEARTSTRINGS OFFERINGS DATA
     =========================== */

  const OFFERINGS = [
    {
      title: "Tarot & Oracles",
      items: [
        { name: "Lost in Arcadia Tarot (pre-launch)", price: "Coming Soon", desc: "A quiet, ruin-lit deck in development." },
        { name: "Utility Frames & Templates", price: "Seasonal", desc: "Infrastructure for creators. Clean. Honest." }
      ]
    },
    {
      title: "Ritual Tools",
      items: [
        { name: "Candles & Holders", price: "", desc: "For focus, offerings, and steady light." },
        { name: "Incense & Resins", price: "", desc: "Smoke as signal: cleanse, call, settle." }
      ]
    },
    {
      title: "Signature Teas & Infusions",
      items: [
        { name: "Loose-Leaf Tea Tin (2 oz)", price: "$14", desc: "Rotating: calming herbs, bright mints, or seasonal botanicals." },
        { name: "Loose-Leaf Tea Tin (4 oz)", price: "$24", desc: "Same blends—bigger tin for regulars." },
        { name: "Tea Sachet Pack (10)", price: "$12", desc: "Convenient sachets for travel, gifts, and quick mornings." },
        { name: "Infusion Sampler (4 mini tins)", price: "$28", desc: "A curated flight: calm • bright • grounding • seasonal." },
        { name: "Tea Infuser (stainless)", price: "$10", desc: "A simple tool that makes loose-leaf feel effortless." }
      ]
    },
    {
      title: "Candles & Incense",
      items: [
        { name: "Small-Batch Candle (8 oz)", price: "$18", desc: "Core scents + seasonal pours." },
        { name: "Ritual Taper Set (2)", price: "$12", desc: "Classic tapers for altars, dinners, and mood-setting." },
        { name: "Incense Sticks (bundle)", price: "$8", desc: "Aromatic staples: resinous, herbal, or smoky woods." },
        { name: "Resin Incense (jar)", price: "$14", desc: "For deeper burn + old-world atmosphere." },
        { name: "Charcoal Discs (pack)", price: "$6", desc: "For resin incense—simple and essential." },
        { name: "Ritual Matches", price: "$7", desc: "Because tiny details matter." }
      ]
    },
    {
      title: "Tinctures & Bitters",
      items: [
        { name: "Botanical Tincture (1 oz)", price: "$22", desc: "Rotating focus: calm • clarity • comfort." },
        { name: "Botanical Tincture (2 oz)", price: "$38", desc: "Same rotation—larger bottle for frequent use." },
        { name: "Cocktail Bitters (4 oz)", price: "$16", desc: "Citrus • spice • aromatic profiles." },
        { name: "Digestive Bitters (2 oz)", price: "$14", desc: "Old-world bitter botanicals—traditional, bold, useful." }
      ]
    },
    {
      title: "Charms & Keepsakes",
      items: [
        { name: "Pocket Charm (stone / token)", price: "$8", desc: "Small, weighted, meant to travel." },
        { name: "Protection Sachet (herbal pouch)", price: "$12", desc: "Herbs + botanicals in a simple cloth pouch." },
        { name: "Amulet Necklace", price: "$22", desc: "Symbolic pieces—quiet, wearable, and intentional." },
        { name: "Keepsake Token", price: "$10", desc: "A tiny story object—meant to be held and remembered." },
        { name: "Mini Altar Dish (small)", price: "$14", desc: "For offerings, rings, crystals, or ritual salt." }
      ]
    }
  ];

  /* ===========================
     RENDER
     =========================== */

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render() {
    const menuEl = document.getElementById("menu");
    if (!menuEl) return;

    menuEl.innerHTML = OFFERINGS.map(section => {
      const items = (section.items || []).map(it => `
        <div class="item">
          <div class="left">
            <div class="name">${escapeHtml(it.name)}</div>
            ${it.desc ? `<div class="desc">${escapeHtml(it.desc)}</div>` : ``}
          </div>
          ${it.price ? `<div class="price">${escapeHtml(it.price)}</div>` : `<div class="price"></div>`}
        </div>
      `).join("");

      return `
        <div class="section">
          <div class="sectionTitle">${escapeHtml(section.title)}</div>
          ${items}
        </div>
      `;
    }).join("");
  }

  /* ===========================
     EMBERS (MOBILE VISIBLE)
     - time-based movement
     - iOS visualViewport sizing
     - minimum pixel radius so embers show on phones
     =========================== */

  function startEmbers() {
    const c = document.getElementById("embers");
    if (!c) return;

    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;

    const TARGET_COUNT = 80;
    const SPEED_MIN = 0.018;
    const SPEED_MAX = 0.055;
    const ALPHA_MIN = 0.14;
    const ALPHA_MAX = 0.38;
    const WOBBLE_SPEED = 0.65;     // radians/sec
    const DRIFT_STRENGTH = 0.008;  // normalized units/sec

    const MIN_RADIUS_PX = 1.2;
    const MAX_RADIUS_PX = 3.6;

    const parts = [];

    function makeParticle() {
      return {
        x: Math.random(),
        y: Math.random(),
        r: 0.9 + Math.random() * 2.2,
        v: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
        a: ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN),
        wob: Math.random() * Math.PI * 2
      };
    }

    function getViewport() {
      const vw = window.visualViewport?.width ?? document.documentElement.clientWidth ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? document.documentElement.clientHeight ?? window.innerHeight;
      return {
        w: Math.max(1, Math.floor(vw)),
        h: Math.max(1, Math.floor(vh))
      };
    }

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const vp = getViewport();
      W = vp.w;
      H = vp.h;

      c.width = Math.floor(W * dpr);
      c.height = Math.floor(H * dpr);
      c.style.width = "100%";
      c.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      parts.length = 0;
      for (let i = 0; i < TARGET_COUNT; i++) parts.push(makeParticle());
    }

    let lastT = performance.now();

    function tick(now) {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const p of parts) {
        p.y -= p.v * dt;

        p.wob += WOBBLE_SPEED * dt;
        p.x += Math.sin(p.wob + p.y * 3.2) * (DRIFT_STRENGTH * dt);

        if (p.y < -0.08) {
          p.y = 1.08;
          p.x = Math.random();
          p.v = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
          p.a = ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN);
          p.r = 0.9 + Math.random() * 2.2;
          p.wob = Math.random() * Math.PI * 2;
        }

        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const x = p.x * W;
        const y = p.y * H;

        ctx.globalAlpha = p.a;

        const widthScale = Math.max(0.6, Math.min(1.15, W / 900));
        const rPx = Math.max(MIN_RADIUS_PX, Math.min(MAX_RADIUS_PX, p.r * widthScale));

        // halo
        ctx.beginPath();
        ctx.arc(x, y, rPx * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,140,70,0.55)";
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(x, y, rPx, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,175,95,1)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.visualViewport?.addEventListener("resize", resize, { passive: true });
    window.visualViewport?.addEventListener("scroll", resize, { passive: true });

    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    startEmbers();
  });
})();