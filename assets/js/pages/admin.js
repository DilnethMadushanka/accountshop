(function () {
  "use strict";
  const { shop, $, money, whatsappForm, faqList } = window.Site;
  const svc = shop.adminService || { feePercent: 5, feeMin: 0 };
  const fee = (price) => Math.max(svc.feeMin || 0, Math.round((price * svc.feePercent) / 100));

  $("#fee-text").textContent = `${svc.feePercent}% of the agreed price${svc.feeMin ? `, at least ${money(svc.feeMin)}` : ""}. Agreed before we start.`;

  whatsappForm($("#admin-form"), {
    draftKey: "admin-draft",
    onChange: (d) => {
      const price = +d.price;
      const ok = price > 0;
      $("#fee-amount").textContent = ok ? money(fee(price)) : "—";
      $("#fee-price").textContent = ok ? money(price) : "—";
      $("#fee-fee").textContent = ok ? `${svc.feePercent}%${fee(price) === svc.feeMin ? " (minimum)" : ""}` : "—";
      $("#fee-note").textContent = ok ? `Estimated fee for a ${money(price)} deal.` : "Enter the agreed price to see the fee.";
    },
    build: (d) =>
      [
        `Hi ${shop.name}! I'd like to use the admin (middleman) service.`,
        "",
        `I'm the ${d.role.toLowerCase()}.`,
        `Name: ${d.name}`,
        `My WhatsApp: ${d.phone}`,
        d.other ? `Other person's WhatsApp: ${d.other}` : null,
        `Account level: ${d.level}`,
        `Agreed price: ${money(d.price)}`,
        `Estimated fee: ${money(fee(+d.price))}`,
        d.notes ? `Notes: ${d.notes}` : null,
      ]
        .filter((line) => line !== null)
        .join("\n"),
  });

  $("#faq-list").innerHTML = faqList([
    { q: "Who pays the fee?", a: "Buyer and seller decide between themselves. Usually it's split or paid by the buyer. We agree before starting." },
    { q: "Do you hold the money?", a: "No. The buyer pays the seller directly. I only hold the account login until the seller confirms payment." },
    { q: "What if the account isn't as promised?", a: "I check it before any payment happens. If it doesn't match, the deal stops and the login goes back to the seller." },
    { q: "Can I use it for other games?", a: "Message me first. Free Fire is what I know best, so that's where I can protect you properly." },
  ]);
})();
