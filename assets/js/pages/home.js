(function () {
  "use strict";
  const { shop, $, $$, esc, card, sparks, money, openSheet } = window.Site;
  const hero = shop.hero || {};

  // ── Hero text ──────────────────────────────────────────────
  document.querySelectorAll("[data-hero]").forEach((el) => {
    const v = hero[el.dataset.hero];
    if (v) el.textContent = v;
  });
  // [words] in the subtitle are highlighted.
  $("#hero-sub").innerHTML = esc(hero.subtitle || "").replace(/\[(.+?)\]/g, '<span class="hl-yellow">$1</span>');
  if (hero.eyebrow) $("#hero-eyebrow").textContent = hero.eyebrow;
  const liveCount = shop.listings.filter((l) => l.status === "available").length;
  $("#hero-stats").innerHTML = (hero.stats || [])
    .map((st) => {
      const v = String(st.value).replace("{available}", liveCount);
      return `<div><dd data-count="${esc(v)}">${esc(v)}</dd><dt>${esc(st.label)}</dt></div>`;
    })
    .join("");
  // Count the numbers up when the hero appears ("5+" counts to 5, then gets its "+").
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$("#hero-stats dd").forEach((dd, i) => {
      const m = dd.dataset.count.match(/^(\D*)(\d+)(.*)$/);
      if (!m) return;
      const [, pre, num, post] = m;
      const end = +num;
      const t0 = performance.now() + 500 + i * 120;
      dd.textContent = `${pre}0${post}`;
      const step = (t) => {
        const k = Math.min(1, Math.max(0, (t - t0) / 900));
        dd.textContent = `${pre}${Math.round(end * (1 - Math.pow(1 - k, 3)))}${post}`;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // ── Character (with lightning) or the fallback emblem ──────
  const figure = $("#hero-figure");
  figure.innerHTML = `
    <div class="emblem">
      <span class="ring ring-1"></span><span class="ring ring-2"></span>
      <svg class="bolt" viewBox="0 0 200 200"><path d="M112 18 58 112h38l-12 70 58-100h-40l10-64z" /></svg>
      <span class="emblem-label">${esc(hero.highlight || "")}</span>
    </div>`;
  if (hero.character) {
    const img = new Image();
    img.alt = "";
    img.className = "hero-character";
    img.onload = () => {
      const wrap = document.createElement("div");
      wrap.className = "char-wrap";
      wrap.append(img);
      const pick = shop.listings.find((l) => l.status === "available");
      figure.innerHTML = `
        <div class="hud" aria-hidden="true">
          <span class="hud-ring r1"></span><span class="hud-ring r2"></span><span class="hud-ring r3"></span>
          <span class="hud-sweep"></span>
        </div>`;
      wrap.insertAdjacentHTML("beforeend", '<span class="char-ground" aria-hidden="true"><i></i><i></i></span>');
      figure.append(wrap);
      if (pick) {
        figure.insertAdjacentHTML(
          "beforeend",
          `<button type="button" class="hud-chip chip-a" data-depth="16">
            <span class="chip-kicker"><i></i>Just listed · ${esc(pick.id)}</span>
            <strong>${esc(pick.title)}</strong>
            <span>${esc(pick.level || "")} · ${money(pick.price)}</span>
          </button>`
        );
        $(".chip-a", figure).addEventListener("click", () => openSheet(pick));
      }
      if ((hero.trust || [])[0]) {
        figure.insertAdjacentHTML(
          "beforeend",
          `<div class="hud-chip chip-b" data-depth="24" aria-hidden="true">
            <span class="chip-check">✓</span><span><strong>${esc(hero.trust[0])}</strong><span>Shown live before you pay</span></span>
          </div>`
        );
      }
      figure.insertAdjacentHTML("beforeend", '<span class="booyah" data-depth="30" aria-hidden="true">BOOYAH!</span>');
      figure.classList.add("has-character");
      layers = $$("[data-depth]", heroEl);
      if (hero.electric !== false && window.electrify) requestAnimationFrame(() => window.electrify(img, hero.electric || {}));
    };
    img.src = hero.character;
  }
  if (hero.background) {
    const bg = new Image();
    bg.onload = () => {
      $("#hero-bg").style.setProperty("--hero-img", `url("${hero.background}")`);
      $("#hero-bg").classList.add("has-image");
    };
    bg.src = hero.background;
  }
  sparks($("#hero-particles"), 28);

  // ── Scrolling title band behind everything ─────────────────
  const words = [hero.highlight, shop.name, "Buy", "Sell", "Admin service"].filter(Boolean);
  const run = words.map((w) => `<span>${esc(w)}</span><b aria-hidden="true">✦</b>`).join("");
  $("#marquee").innerHTML = `<div aria-hidden="true">${run}</div><div aria-hidden="true">${run}</div>`;

  // ── Entrance + pointer parallax ────────────────────────────
  const heroEl = $(".hero");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let layers = $$("[data-depth]", heroEl);
  requestAnimationFrame(() => heroEl.classList.add("is-in"));

  if (!still && window.matchMedia("(pointer: fine)").matches) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      layers.forEach((el) => {
        const d = +el.dataset.depth;
        el.style.translate = `${(x * d).toFixed(2)}px ${(y * d).toFixed(2)}px`;
      });
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    heroEl.addEventListener("pointermove", (e) => {
      const r = heroEl.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    heroEl.addEventListener("pointerleave", () => {
      tx = ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  // ── Featured: first three accounts for sale ────────────────
  const forSale = shop.listings.filter((l) => l.status === "available");
  $("#featured-grid").innerHTML = forSale.slice(0, 3).map(card).join("");

  // ── Trust tiles ────────────────────────────────────────────
  const reviews = shop.reviews || [];
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.stars, 0) / reviews.length : 0;
  const handovers = shop.listings.filter((l) => l.status === "sold").length + (shop.proof || []).length;
  $("#trust-grid").innerHTML = [
    { value: forSale.length, label: "Accounts for sale now", href: "buy.html", cta: "Browse" },
    {
      value: reviews.length ? `${avg.toFixed(1)}★` : "Reviews",
      label: reviews.length ? `Average from ${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "Read or leave a review",
      href: "reviews.html",
      cta: "Read reviews",
    },
    { value: handovers, label: "Handovers on record", href: "proof.html", cta: "See proof" },
  ]
    .map(
      (t) => `
      <a class="trust-tile" href="${t.href}">
        <span class="trust-value">${esc(t.value)}</span>
        <span class="trust-label">${esc(t.label)}</span>
        <span class="service-link">${esc(t.cta)} <span aria-hidden="true">→</span></span>
      </a>`
    )
    .join("");
})();
