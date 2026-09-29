(function () {
  "use strict";

  const shop = window.SHOP;
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const money = (n) => `${shop.currency} ${Number(n).toLocaleString("en-US")}`;

  const STATUS_LABEL = { available: "Available", reserved: "Reserved", sold: "Sold" };

  // ── Contact links ──────────────────────────────────────────
  const c = shop.contact || {};
  const waLink = (text) =>
    c.whatsapp ? `https://wa.me/${c.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "#contact";
  const tgLink = c.telegram ? `https://t.me/${c.telegram}` : null;

  const enquiry = (item) =>
    `Hi ${shop.name}! I'm interested in ${item.id} — ${item.game}: ${item.title}. Is it still available?`;

  // ── Cover art (used when a listing has no image) ───────────
  function hue(str) {
    let h = 0;
    for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return h;
  }
  function initials(game) {
    return game
      .split(/\s+/)
      .filter((w) => /^[A-Za-z0-9]/.test(w) && !/^(of|the)$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
  function cover(item) {
    if (item.image) {
      return `<div class="cover"><img src="${esc(item.image)}" alt="" loading="lazy" /></div>`;
    }
    const h = hue(item.id + item.game);
    return `<div class="cover cover-art" style="--h:${h}">
      <span class="cover-initials">${esc(initials(item.game))}</span>
    </div>`;
  }

  // ── Static text ────────────────────────────────────────────
  document.querySelectorAll("[data-shop]").forEach((el) => {
    const v = shop[el.dataset.shop];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-contact]").forEach((el) => {
    const v = c[el.dataset.contact];
    if (v) el.textContent = v;
    else el.remove();
  });
  document.querySelectorAll('[data-link="whatsapp"]').forEach((el) => {
    if (!c.whatsapp) return;
    el.href = waLink(`Hi ${shop.name}! I have a question.`);
    el.target = "_blank";
    el.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();

  // ── Hero ───────────────────────────────────────────────────
  const hero = shop.hero || {};
  document.querySelectorAll("[data-hero]").forEach((el) => {
    const v = hero[el.dataset.hero];
    if (v) el.textContent = v;
  });
  // [words] in the subtitle are highlighted.
  $("#hero-sub").innerHTML = esc(hero.subtitle || "").replace(/\[(.+?)\]/g, '<span class="hl-green">$1</span>');
  $("#hero-trust").innerHTML = (hero.trust || []).map((t) => `<li>${esc(t)}</li>`).join("");

  const reviews = $("#reviews-link");
  if (c.reviews) {
    reviews.href = c.reviews;
    reviews.target = "_blank";
    reviews.rel = "noopener";
  }

  // Use the owner's images when they exist, otherwise keep the drawn fallback.
  const EMBLEM = `
    <div class="emblem">
      <span class="ring ring-1"></span><span class="ring ring-2"></span>
      <svg class="bolt" viewBox="0 0 200 200">
        <path d="M112 18 58 112h38l-12 70 58-100h-40l10-64z" />
      </svg>
      <span class="emblem-label">${esc(hero.highlight || "")}</span>
    </div>`;
  const figure = $("#hero-figure");
  figure.innerHTML = EMBLEM;
  if (hero.character) {
    const img = new Image();
    img.alt = "";
    img.className = "hero-character";
    img.onload = () => {
      figure.innerHTML = "";
      figure.append(img);
      figure.classList.add("has-character");
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

  // Drifting sparks, like the reference banner.
  const sparks = $("#hero-particles");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${6 + Math.random() * 8}s;--delay:${-Math.random() * 10}s;--s:${2 + Math.random() * 4}px`;
    sparks.append(s);
  }

  // ── Listings + filters ─────────────────────────────────────
  const games = [...new Set(shop.listings.map((l) => l.game))];
  const state = { game: "All", showSold: false };

  const chipRoot = $("#game-filter");
  chipRoot.hidden = games.length < 2; // one-game shop: no need to filter
  chipRoot.innerHTML = ["All", ...games]
    .map((g) => `<button type="button" class="chip" data-game="${esc(g)}" aria-pressed="${g === "All"}">${esc(g)}</button>`)
    .join("");
  chipRoot.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.game = btn.dataset.game;
    chipRoot.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    render();
  });
  $("#show-sold").addEventListener("change", (e) => {
    state.showSold = e.target.checked;
    render();
  });

  const ORDER = { available: 0, reserved: 1, sold: 2 };

  function render() {
    const items = shop.listings
      .filter((l) => state.game === "All" || l.game === state.game)
      .filter((l) => state.showSold || l.status !== "sold")
      .sort((a, b) => ORDER[a.status] - ORDER[b.status]);

    $("#grid").innerHTML = items
      .map(
        (item) => `
      <li>
        <button type="button" class="card is-${esc(item.status)}" data-id="${esc(item.id)}" aria-label="${esc(`${item.game}, ${item.title}. ${STATUS_LABEL[item.status]}. View details`)}">
          ${cover(item)}
          <span class="badge badge-${esc(item.status)}">${STATUS_LABEL[item.status]}</span>
          <span class="card-body">
            <span class="card-top">
              <span class="mono muted">${esc(item.id)}</span>
              <span class="mono muted">${esc(item.level || "")}</span>
            </span>
            <span class="card-game">${esc(item.game)}</span>
            <span class="card-title">${esc(item.title)}</span>
            <span class="card-tags">${(item.highlights || [])
              .slice(0, 3)
              .map((h) => `<span class="tag">${esc(h)}</span>`)
              .join("")}</span>
            <span class="card-foot">
              <span class="price">${money(item.price)}</span>
              <span class="card-cta">Details <span aria-hidden="true">→</span></span>
            </span>
          </span>
        </button>
      </li>`
      )
      .join("");
    $("#empty").hidden = items.length > 0;
  }
  render();

  // ── Detail sheet ───────────────────────────────────────────
  const sheet = $("#sheet");
  $("#grid").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    open(shop.listings.find((l) => l.id === card.dataset.id));
  });
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) sheet.close(); // click on backdrop
  });

  function open(item) {
    if (!item) return;
    const sold = item.status === "sold";
    const rows = [
      ["Listing", item.id],
      ["Level", item.level],
      ["Server", item.server],
      ["Login type", item.login],
    ].filter(([, v]) => v);

    $("#sheet-body").innerHTML = `
      ${cover(item)}
      <div class="sheet-content">
        <span class="badge badge-${esc(item.status)}">${STATUS_LABEL[item.status]}</span>
        <p class="card-game">${esc(item.game)}</p>
        <h3 id="sheet-title">${esc(item.title)}</h3>
        <p class="sheet-price">${money(item.price)}</p>

        <dl class="specs">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>

        ${
          item.highlights?.length
            ? `<h4>What's included</h4><ul class="ticks">${item.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
            : ""
        }
        ${item.notes ? `<p class="sheet-notes">${esc(item.notes)}</p>` : ""}

        <div class="sheet-actions">
          ${
            sold
              ? `<a class="btn" href="${waLink(`Hi ${shop.name}! I saw ${item.id} was sold. Do you have something similar in ${item.game}?`)}" target="_blank" rel="noopener">Ask for something similar</a>`
              : `<a class="btn" href="${waLink(enquiry(item))}" target="_blank" rel="noopener">Enquire on WhatsApp</a>`
          }
          ${tgLink ? `<a class="btn btn-ghost" href="${tgLink}" target="_blank" rel="noopener">Telegram</a>` : ""}
        </div>
        <p class="fineprint">No payment happens on this site. Everything is agreed with me directly in chat.</p>
      </div>`;
    sheet.showModal();
  }

  // ── FAQ ────────────────────────────────────────────────────
  $("#faq-list").innerHTML = (shop.faq || [])
    .map(
      (f) => `
      <details>
        <summary>${esc(f.q)}<span class="plus" aria-hidden="true"></span></summary>
        <p>${esc(f.a)}</p>
      </details>`
    )
    .join("");

  // ── Contact cards ──────────────────────────────────────────
  const channels = [
    c.whatsapp && {
      name: "WhatsApp",
      detail: `+${c.whatsapp}`,
      href: waLink(`Hi ${shop.name}! I have a question.`),
      hint: "Fastest reply",
      icon: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    },
    tgLink && {
      name: "Telegram",
      detail: `@${c.telegram}`,
      href: tgLink,
      icon: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    },
    c.facebook && {
      name: "Facebook",
      detail: c.facebook.replace(/^https?:\/\/(www\.)?/, ""),
      href: c.facebook,
      icon: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    },
    c.email && {
      name: "Email",
      detail: c.email,
      href: `mailto:${c.email}`,
      icon: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    },
  ].filter(Boolean);

  $("#contact-grid").innerHTML = channels
    .map(
      (ch) => `
      <a class="contact-card" href="${esc(ch.href)}" ${ch.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">${ch.icon}</svg>
        <span class="contact-name">${esc(ch.name)}${ch.hint ? `<span class="hint">${esc(ch.hint)}</span>` : ""}</span>
        <span class="contact-detail">${esc(ch.detail)}</span>
        <span class="arrow" aria-hidden="true">↗</span>
      </a>`
    )
    .join("");
})();
