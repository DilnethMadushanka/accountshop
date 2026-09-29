(function () {
  "use strict";
  const { shop, $, esc, card, sparks } = window.Site;
  const hero = shop.hero || {};

  // ── Hero text ──────────────────────────────────────────────
  document.querySelectorAll("[data-hero]").forEach((el) => {
    const v = hero[el.dataset.hero];
    if (v) el.textContent = v;
  });
  // [words] in the subtitle are highlighted.
  $("#hero-sub").innerHTML = esc(hero.subtitle || "").replace(/\[(.+?)\]/g, '<span class="hl-green">$1</span>');
  $("#hero-trust").innerHTML = (hero.trust || []).map((t) => `<li>${esc(t)}</li>`).join("");

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
      figure.innerHTML = "";
      figure.append(wrap);
      figure.classList.add("has-character");
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
