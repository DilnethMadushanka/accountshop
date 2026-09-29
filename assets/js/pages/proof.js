(function () {
  "use strict";
  const { shop, $, $$, esc, card, waLink } = window.Site;
  const items = (shop.proof || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const TYPES = { sold: "Sold", bought: "Bought", admin: "Admin deal" };
  let shown = items;

  const filter = $("#proof-filter");
  const types = ["all", ...Object.keys(TYPES).filter((t) => items.some((p) => p.type === t))];
  filter.hidden = types.length < 3;
  filter.innerHTML = types
    .map((t) => `<button type="button" class="chip" data-type="${t}" aria-pressed="${t === "all"}">${t === "all" ? "All" : TYPES[t]}</button>`)
    .join("");

  function render(type) {
    shown = type === "all" ? items : items.filter((p) => p.type === type);
    $("#gallery").innerHTML = shown
      .map(
        (p, i) => `
        <li>
          <button type="button" class="shot" data-i="${i}" aria-label="Open ${esc(p.caption || "screenshot")}">
            <img src="${esc(p.image)}" alt="" loading="lazy" />
            <span class="shot-meta">
              ${p.type ? `<span class="shot-type">${esc(TYPES[p.type] || p.type)}</span>` : ""}
              <span class="shot-cap">${esc(p.caption || "")}</span>
              ${p.date ? `<time>${esc(p.date)}</time>` : ""}
            </span>
          </button>
        </li>`
      )
      .join("");
    $("#proof-count").textContent = items.length ? `${shown.length} screenshot${shown.length === 1 ? "" : "s"}` : "";
    $("#proof-empty").hidden = items.length > 0;
  }
  filter.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", filter).forEach((x) => x.setAttribute("aria-pressed", x === b));
    render(b.dataset.type);
  });
  render("all");
  $("#proof-ask").href = waLink(`Hi ${shop.name}! Could you send me some proof of past handovers?`);

  // ── Lightbox ───────────────────────────────────────────────
  const lb = $("#lightbox");
  let at = 0;
  function show(i) {
    at = (i + shown.length) % shown.length;
    const p = shown[at];
    $("#lb-img").src = p.image;
    $("#lb-img").alt = p.caption || "Proof screenshot";
    $("#lb-cap").textContent = [p.caption, p.date].filter(Boolean).join(" · ");
    $$(".lb-prev, .lb-next", lb).forEach((b) => (b.hidden = shown.length < 2));
  }
  $("#gallery").addEventListener("click", (e) => {
    const b = e.target.closest(".shot");
    if (!b) return;
    show(+b.dataset.i);
    lb.showModal();
  });
  lb.addEventListener("click", (e) => {
    const act = e.target.closest("[data-lb]")?.dataset.lb;
    if (act === "close" || e.target === lb) lb.close();
    if (act === "prev") show(at - 1);
    if (act === "next") show(at + 1);
  });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "ArrowRight") show(at + 1);
  });

  // ── Sold accounts from the shop ────────────────────────────
  const sold = shop.listings.filter((l) => l.status === "sold");
  $("#sold-grid").innerHTML = sold.map(card).join("");
  $("#handed-over").hidden = !sold.length;
})();
