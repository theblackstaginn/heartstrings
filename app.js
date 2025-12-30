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
          ${it.price ? `<div class="price copper">${escapeHtml(it.price)}</div>` : `<div class="price"></div>`}
        </div>
      `).join("");

      return `
        <div class="section">
          <div class="sectionTitle copper">${escapeHtml(section.title)}</div>
          ${items}
        </div>
      `;
    }).join("");

    // optional: wire “Browse Offerings” to scroll top
    const orderBtn = document.getElementById("orderBtn");
    if (orderBtn) {
      orderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        menuEl.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ===========================
     MINIMAL EMBERS (safe)
     =========================== */

  function startEmbers() {
    const c = document.getElementById("embers");
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0;
    const parts = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      v: 0.03 + Math.random() * 0.10,
      a: 0.15 + Math.random() * 0.35
    }));

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      W = Math.floor(window.innerWidth * dpr);
      H = Math.floor(window.innerHeight * dpr);
      c.width = W; c.height = H;
      c.style.width = "100%";
      c.style.height = "100%";
      ctx.setTransform(1,0,0,1,0,0);
    }

    function tick() {
      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = "lighter";

      for (const p of parts) {
        p.y -= p.v * 0.6;
        p.x += Math.sin((p.y * 6.0) + p.r) * 0.0008;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }

        const x = p.x * W;
        const y = p.y * H;

        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(x, y, p.r * (W/1400), 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,170,90,1)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    startEmbers();
  });
})();