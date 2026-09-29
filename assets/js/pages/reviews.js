(function () {
  "use strict";
  const { shop, c, $, $$, esc, whatsappForm, icon } = window.Site;
  const reviews = (shop.reviews || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const stars = (n) => `<span class="stars" aria-label="${n} out of 5 stars">${[1, 2, 3, 4, 5].map((i) => `<span class="${i <= n ? "on" : ""}">${icon("star", 16)}</span>`).join("")}</span>`;

  // ── Summary ────────────────────────────────────────────────
  const count = reviews.length;
  const avg = count ? reviews.reduce((a, r) => a + r.stars, 0) / count : 0;
  const bars = [5, 4, 3, 2, 1].map((n) => {
    const k = reviews.filter((r) => r.stars === n).length;
    return `<div class="bar-row"><span>${n}★</span><span class="bar"><i style="width:${count ? (k / count) * 100 : 0}%"></i></span><span>${k}</span></div>`;
  });
  $("#rating-card").innerHTML = `
    <div class="rating-score">
      <strong>${count ? avg.toFixed(1) : "–"}</strong>
      ${stars(Math.round(avg))}
      <span>${count ? `${count} review${count === 1 ? "" : "s"}` : "No reviews yet"}</span>
    </div>
    <div class="rating-bars">${bars.join("")}</div>
    <a class="btn" href="#write">Leave a review</a>`;

  // ── List + filter ──────────────────────────────────────────
  const filter = $("#star-filter");
  filter.hidden = !count;
  filter.innerHTML = ["All", 5, 4, 3, 2, 1]
    .map((n) => `<button type="button" class="chip" data-stars="${n}" aria-pressed="${n === "All"}">${n === "All" ? "All" : `${n}★`}</button>`)
    .join("");
  function render(n) {
    const list = n === "All" ? reviews : reviews.filter((r) => r.stars === +n);
    $("#review-list").innerHTML = list
      .map(
        (r) => `
        <li class="review">
          <div class="review-head">
            <span class="avatar" aria-hidden="true">${esc((r.name || "?")[0].toUpperCase())}</span>
            <div><strong>${esc(r.name)}</strong>${r.date ? `<time datetime="${esc(r.date)}">${esc(new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }))}</time>` : ""}</div>
            ${stars(r.stars)}
          </div>
          <p>${esc(r.text)}</p>
          ${r.account ? `<a class="review-account" href="buy.html?id=${encodeURIComponent(r.account)}">${esc(r.account)}</a>` : ""}
        </li>`
      )
      .join("");
    $("#review-empty").hidden = list.length > 0;
  }
  filter.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", filter).forEach((x) => x.setAttribute("aria-pressed", x === b));
    render(b.dataset.stars);
  });
  render("All");

  if (c.reviews) {
    $("#fb-reviews").href = c.reviews;
    $("#fb-reviews").hidden = false;
  }

  whatsappForm($("#review-form"), {
    draftKey: "review-draft",
    build: (d) =>
      [
        `Hi ${shop.name}! Here's my review:`,
        "",
        `${"★".repeat(+d.stars)}${"☆".repeat(5 - d.stars)} (${d.stars}/5)`,
        `"${d.text}"`,
        `— ${d.name}${d.account ? `, ${d.account}` : ""}`,
        "",
        "You can post it on your website.",
      ].join("\n"),
  });
})();
