(function () {
  "use strict";
  const { shop, $, $$, card, faqList, levelOf, waLink, openSheet } = window.Site;

  const params = new URLSearchParams(location.search);
  const state = { q: params.get("q") || "", status: "open", budget: 0, sort: "status" };
  const ORDER = { available: 0, reserved: 1, sold: 2 };
  const STATUS = {
    open: (l) => l.status !== "sold",
    available: (l) => l.status === "available",
    sold: (l) => l.status === "sold",
    all: () => true,
  };
  const SORT = {
    status: (a, b) => ORDER[a.status] - ORDER[b.status],
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "level-desc": (a, b) => levelOf(b) - levelOf(a),
  };

  const q = $("#q");
  q.value = state.q;

  function matches(l, text) {
    if (!text) return true;
    const hay = [l.id, l.title, l.level, l.login, l.notes, ...(l.highlights || [])].join(" ").toLowerCase();
    return text
      .toLowerCase()
      .split(/\s+/)
      .every((w) => hay.includes(w));
  }

  function render() {
    const items = shop.listings
      .filter(STATUS[state.status])
      .filter((l) => !state.budget || l.price < state.budget)
      .filter((l) => matches(l, state.q.trim()))
      .sort(SORT[state.sort]);
    $("#grid").innerHTML = items.map(card).join("");
    $("#count").textContent = `${items.length} account${items.length === 1 ? "" : "s"}`;
    $("#empty").hidden = items.length > 0;
    $("#request-link").href = waLink(
      `Hi ${shop.name}! I'm looking for a Free Fire account${state.q ? ` with ${state.q}` : ""}${state.budget ? ` under ${shop.currency} ${state.budget.toLocaleString("en-US")}` : ""}. Do you have one?`
    );
  }

  let t;
  q.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.q = q.value;
      render();
    }, 120);
  });
  $("#status").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.status = b.dataset.status;
    $$("#status button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    render();
  });
  $("#budget").addEventListener("change", (e) => {
    state.budget = +e.target.value;
    render();
  });
  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  render();
  $("#faq-list").innerHTML = faqList(shop.faq);

  // Shared links like buy.html?id=MA-101 open that account straight away.
  const id = params.get("id");
  if (id) openSheet(shop.listings.find((l) => l.id.toLowerCase() === id.toLowerCase()));
})();
