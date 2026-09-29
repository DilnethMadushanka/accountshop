/*
 * Shared by every page: helpers, the nav bar, the footer, the account
 * details sheet and the contact cards. Page scripts in assets/js/pages/
 * use these through window.Site.
 */
(function () {
  "use strict";

  const shop = window.SHOP;
  const c = shop.contact || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const money = (n) => `${shop.currency} ${Math.round(Number(n)).toLocaleString("en-US")}`;
  const waLink = (text) =>
    c.whatsapp ? `https://wa.me/${c.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "contact.html";
  const tgLink = c.telegram ? `https://t.me/${c.telegram}` : null;
  const STATUS_LABEL = { available: "Available", reserved: "Reserved", sold: "Sold" };
  const levelOf = (item) => parseInt(String(item.level || "").replace(/\D+/g, ""), 10) || 0;

  const store = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* private mode: drafts just aren't remembered */
      }
    },
  };

  const PAGES = [
    { href: "index.html", id: "home", label: "Home" },
    { href: "reviews.html", id: "reviews", label: "Reviews" },
    { href: "sell.html", id: "sell", label: "Sell Account" },
    { href: "buy.html", id: "buy", label: "Buy Account" },
    { href: "admin.html", id: "admin", label: "Admin Service" },
    { href: "proof.html", id: "proof", label: "Proof" },
    { href: "contact.html", id: "contact", label: "Contact" },
  ];
  const current = document.body.dataset.page;

  const ICON = {
    wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/>',
    tg: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3z"/>',
  };
  const icon = (name, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICON[name]}</svg>`;

  // ── Open hours (Sri Lanka time, UTC+5:30) ─────────────────
  function openState() {
    const o = c.open;
    if (!o) return null;
    const now = new Date();
    const lk = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 330 * 60000);
    const h = lk.getHours() + lk.getMinutes() / 60;
    const fmt = (x) => `${((x + 11) % 12) + 1}:00 ${x < 12 || x === 24 ? "AM" : "PM"}`;
    const isOpen = h >= o.from && h < o.to;
    return { isOpen, label: isOpen ? `Open now · until ${fmt(o.to)}` : `Closed · opens ${fmt(o.from)}` };
  }

  // ── Nav ────────────────────────────────────────────────────
  function renderNav() {
    const [first, ...rest] = shop.name.split(" ");
    const state = openState();
    const links = PAGES.map(
      (p) => `<a href="${p.href}"${p.id === current ? ' class="is-active" aria-current="page"' : ""}>${esc(p.label)}</a>`
    ).join("");
    const menuLinks = PAGES.map(
      (p, i) =>
        `<a href="${p.href}"${p.id === current ? ' aria-current="page"' : ""}><span>${String(i + 1).padStart(2, "0")}</span>${esc(p.label)}</a>`
    ).join("");

    $("#site-nav").outerHTML = `
    <header class="nav-shell${document.body.dataset.solidNav ? " is-solid" : ""}" id="nav">
      <div class="nav-bar">
        <a class="brand" href="index.html" aria-label="${esc(shop.name)}, home">
          <span class="logo" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <rect width="40" height="40" rx="12" class="logo-bg" />
              <path d="M9 29V12l7 9 4-5" class="logo-m" />
              <path d="M24 9l-4 10h6l-3 12 9-15h-6l3-7z" class="logo-bolt" />
            </svg>
          </span>
          <span class="brand-text"><strong>${esc(first)}</strong><small>${esc(rest.join(" "))}</small></span>
        </a>
        <nav class="nav-links" aria-label="Main"><span class="nav-pill" aria-hidden="true"></span>${links}</nav>
        <div class="nav-actions">
          ${state ? `<span class="nav-status${state.isOpen ? "" : " is-closed"}" title="${esc(state.label)}"><i aria-hidden="true"></i>${state.isOpen ? "Online now" : "Offline"}</span>` : ""}
          <a class="nav-cta" href="${waLink(`Hi ${shop.name}! I have a question.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
            ${icon("wa", 17)}<span>Chat now</span>
          </a>
          <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
        </div>
      </div>
      <div class="menu" id="menu" hidden>
        <nav aria-label="Menu">${menuLinks}</nav>
        <a class="btn menu-cta" href="${waLink(`Hi ${shop.name}! I have a question.`)}" target="_blank" rel="noopener">Chat on WhatsApp</a>
      </div>
    </header>`;

    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $(".burger", nav);
    const menu = $("#menu");
    const setMenu = (open) => {
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      nav.classList.toggle("is-open", open);
    };
    burger.addEventListener("click", () => setMenu(menu.hidden));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        burger.focus();
      }
    });
    document.addEventListener("click", (e) => !menu.hidden && !nav.contains(e.target) && setMenu(false));

    // Highlight pill: rests on the current page, follows the pointer.
    const pill = $(".nav-pill", nav);
    const active = $(".nav-links a.is-active", nav);
    const moveTo = (a) => {
      if (!a) {
        pill.style.opacity = 0;
        return;
      }
      pill.style.opacity = 1;
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    const navLinks = $$(".nav-links a", nav);
    navLinks.forEach((a) => a.addEventListener("mouseenter", () => moveTo(a)));
    $(".nav-links", nav).addEventListener("mouseleave", () => moveTo(active));
    requestAnimationFrame(() => {
      pill.style.transition = "none";
      moveTo(active);
      requestAnimationFrame(() => (pill.style.transition = ""));
    });
    window.addEventListener("resize", () => moveTo(active));
  }

  // ── Footer ─────────────────────────────────────────────────
  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const state = openState();
    el.outerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <strong>${esc(shop.name)}</strong>
          <p>Free Fire accounts, bought and sold one-to-one in chat. Catalogue only: no payments are taken on this site.</p>
          ${state ? `<p class="footer-open${state.isOpen ? "" : " is-closed"}"><i aria-hidden="true"></i>${esc(state.label)}</p>` : ""}
        </div>
        <nav aria-label="Footer">
          <h2>Pages</h2>
          ${PAGES.map((p) => `<a href="${p.href}">${esc(p.label)}</a>`).join("")}
        </nav>
        <div>
          <h2>Contact</h2>
          ${c.whatsapp ? `<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp +${esc(c.whatsapp)}</a>` : ""}
          ${tgLink ? `<a href="${tgLink}" target="_blank" rel="noopener">Telegram @${esc(c.telegram)}</a>` : ""}
          ${c.facebook ? `<a href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook</a>` : ""}
          ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}
        </div>
      </div>
      <div class="wrap footer-base">
        <p>© ${new Date().getFullYear()} ${esc(shop.name)}</p>
        <p>Game names and trademarks belong to their owners. Not affiliated with any game publisher.</p>
      </div>
    </footer>`;
  }

  // ── Account cards + details sheet ──────────────────────────
  function hue(str) {
    let h = 0;
    for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return h;
  }
  function cover(item) {
    if (item.image) return `<div class="cover"><img src="${esc(item.image)}" alt="" loading="lazy" /></div>`;
    const initials = item.game
      .split(/\s+/)
      .filter((w) => /^[A-Za-z0-9]/.test(w) && !/^(of|the)$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
    return `<div class="cover cover-art" style="--h:${hue(item.id + item.game)}"><span class="cover-initials">${esc(initials)}</span></div>`;
  }
  function card(item) {
    return `
      <li>
        <button type="button" class="card is-${esc(item.status)}" data-id="${esc(item.id)}" aria-label="${esc(`${item.title}. ${STATUS_LABEL[item.status]}, ${money(item.price)}. View details`)}">
          ${cover(item)}
          <span class="badge badge-${esc(item.status)}">${STATUS_LABEL[item.status]}</span>
          <span class="card-body">
            <span class="card-top"><span class="mono muted">${esc(item.id)}</span><span class="mono muted">${esc(item.level || "")}</span></span>
            <span class="card-game">${esc(item.game)}</span>
            <span class="card-title">${esc(item.title)}</span>
            <span class="card-tags">${(item.highlights || []).slice(0, 3).map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</span>
            <span class="card-foot"><span class="price">${money(item.price)}</span><span class="card-cta">Details <span aria-hidden="true">→</span></span></span>
          </span>
        </button>
      </li>`;
  }

  let sheet;
  function ensureSheet() {
    if (sheet) return sheet;
    document.body.insertAdjacentHTML(
      "beforeend",
      `<dialog class="sheet" id="sheet" aria-labelledby="sheet-title">
        <form method="dialog" class="sheet-close-form">
          <button class="icon-btn" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg></button>
        </form>
        <div id="sheet-body"></div>
      </dialog>`
    );
    sheet = $("#sheet");
    sheet.addEventListener("click", (e) => e.target === sheet && sheet.close());
    return sheet;
  }
  function openSheet(item) {
    if (!item) return;
    ensureSheet();
    const sold = item.status === "sold";
    const rows = [["Listing", item.id], ["Level", item.level], ["Server", item.server], ["Login type", item.login]].filter(([, v]) => v);
    const share = new URL(`buy.html?id=${encodeURIComponent(item.id)}`, location.href).href;
    $("#sheet-body").innerHTML = `
      ${cover(item)}
      <div class="sheet-content">
        <span class="badge badge-${esc(item.status)}">${STATUS_LABEL[item.status]}</span>
        <p class="card-game">${esc(item.game)}</p>
        <h3 id="sheet-title">${esc(item.title)}</h3>
        <p class="sheet-price">${money(item.price)}</p>
        <dl class="specs">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${item.highlights?.length ? `<h4>What's included</h4><ul class="ticks">${item.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        ${item.notes ? `<p class="sheet-notes">${esc(item.notes)}</p>` : ""}
        <div class="sheet-actions">
          ${
            sold
              ? `<a class="btn" href="${waLink(`Hi ${shop.name}! I saw ${item.id} was sold. Do you have something similar?`)}" target="_blank" rel="noopener">Ask for something similar</a>`
              : `<a class="btn" href="${waLink(`Hi ${shop.name}! I'm interested in ${item.id} (${item.title}, ${money(item.price)}). Is it still available?`)}" target="_blank" rel="noopener">${icon("wa")} Enquire on WhatsApp</a>`
          }
          <button type="button" class="btn btn-ghost" data-copy="${esc(share)}">Copy link</button>
        </div>
        <p class="fineprint">No payment happens on this site. Everything is agreed with me directly in chat.</p>
      </div>`;
    $("[data-copy]", sheet).addEventListener("click", (e) => copy(e.currentTarget.dataset.copy, "Link copied"));
    sheet.showModal();
  }
  // Any grid of cards opens the sheet.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".card[data-id]");
    if (btn) openSheet(shop.listings.find((l) => l.id === btn.dataset.id));
  });

  // ── Contact cards ──────────────────────────────────────────
  function contactCards() {
    return [
      c.whatsapp && { name: "WhatsApp", detail: `+${c.whatsapp}`, href: waLink(`Hi ${shop.name}! I have a question.`), hint: "Fastest reply", icon: "wa" },
      tgLink && { name: "Telegram", detail: `@${c.telegram}`, href: tgLink, icon: "tg" },
      c.facebook && { name: "Facebook", detail: c.facebook.replace(/^https?:\/\/(www\.)?/, ""), href: c.facebook, icon: "fb" },
      c.email && { name: "Email", detail: c.email, href: `mailto:${c.email}`, icon: "mail" },
    ]
      .filter(Boolean)
      .map(
        (ch) => `
        <a class="contact-card" href="${esc(ch.href)}" ${ch.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'}>
          ${icon(ch.icon, 26)}
          <span class="contact-name">${esc(ch.name)}${ch.hint ? `<span class="hint">${esc(ch.hint)}</span>` : ""}</span>
          <span class="contact-detail">${esc(ch.detail)}</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>`
      )
      .join("");
  }

  function faqList(items) {
    return (items || [])
      .map((f) => `<details><summary>${esc(f.q)}<span class="plus" aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`)
      .join("");
  }

  // ── Small UI bits ──────────────────────────────────────────
  function toast(text) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.append(t);
    }
    t.textContent = text;
    t.classList.add("is-on");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("is-on"), 2200);
  }
  async function copy(text, done = "Copied") {
    try {
      await navigator.clipboard.writeText(text);
      toast(done);
    } catch (e) {
      window.prompt("Copy this:", text);
    }
  }

  // Page headers get drifting sparks, like the home banner.
  function sparks(root, n = 22) {
    if (!root) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${6 + Math.random() * 8}s;--delay:${-Math.random() * 10}s;--s:${2 + Math.random() * 4}px`;
      root.append(s);
    }
  }

  /*
   * Forms that end in a WhatsApp message. `build(data)` returns the text.
   * Required fields are checked here; errors show under each field.
   */
  function whatsappForm(form, { build, draftKey, onChange } = {}) {
    const fields = () => $$("input, select, textarea", form).filter((f) => f.name);
    const data = () => {
      const d = {};
      fields().forEach((f) => {
        if (f.type === "checkbox") d[f.name] = f.checked;
        else if (f.type === "radio") f.checked && (d[f.name] = f.value);
        else d[f.name] = f.value.trim();
      });
      return d;
    };
    if (draftKey) {
      const saved = store.get(draftKey);
      if (saved)
        fields().forEach((f) => {
          if (!(f.name in saved)) return;
          if (f.type === "checkbox") f.checked = !!saved[f.name];
          else if (f.type === "radio") f.checked = saved[f.name] === f.value;
          else f.value = saved[f.name];
        });
    }
    const refresh = () => {
      draftKey && store.set(draftKey, data());
      onChange && onChange(data());
    };
    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    refresh();

    function validate() {
      let first = null;
      fields().forEach((f) => {
        const wrap = f.closest(".field");
        if (!wrap) return;
        const msg = !f.checkValidity() ? f.dataset.error || f.validationMessage : "";
        wrap.classList.toggle("has-error", !!msg);
        let err = $(".field-error", wrap);
        if (!err) {
          err = document.createElement("p");
          err.className = "field-error";
          wrap.append(err);
        }
        err.textContent = msg;
        if (msg && !first) first = f;
      });
      if (first) first.focus();
      return !first;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;
      const text = build(data());
      window.open(waLink(text), "_blank", "noopener");
      toast("Opening WhatsApp…");
    });
    const copyBtn = $("[data-copy-message]", form);
    copyBtn &&
      copyBtn.addEventListener("click", () => {
        if (validate()) copy(build(data()), "Message copied");
      });
    const clearBtn = $("[data-clear]", form);
    clearBtn &&
      clearBtn.addEventListener("click", () => {
        form.reset();
        $$(".field", form).forEach((f) => f.classList.remove("has-error"));
        refresh();
      });
    return { data };
  }

  renderNav();
  renderFooter();
  $$("[data-contact]").forEach((el) => (c[el.dataset.contact] ? (el.textContent = c[el.dataset.contact]) : el.remove()));
  $$('[data-link="whatsapp"]').forEach((el) => {
    el.href = waLink(`Hi ${shop.name}! I have a question.`);
    el.target = "_blank";
    el.rel = "noopener";
  });
  const grid = $("#contact-grid");
  if (grid) grid.innerHTML = contactCards();
  sparks($("#page-sparks"));

  window.Site = {
    shop, c, $, $$, esc, money, waLink, tgLink, STATUS_LABEL, levelOf, store, icon,
    card, cover, openSheet, contactCards, faqList, toast, copy, sparks, whatsappForm, openState,
  };
})();
