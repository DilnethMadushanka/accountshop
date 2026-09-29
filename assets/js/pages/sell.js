(function () {
  "use strict";
  const { shop, $, esc, money, whatsappForm } = window.Site;

  $("#f-login").insertAdjacentHTML("beforeend", (shop.loginTypes || []).map((t) => `<option>${esc(t)}</option>`).join(""));

  whatsappForm($("#sell-form"), {
    draftKey: "sell-draft",
    build: (d) =>
      [
        `Hi ${shop.name}! I want to sell my Free Fire account.`,
        "",
        `Name: ${d.name}`,
        `WhatsApp: ${d.phone}`,
        `Level: ${d.level}`,
        `Login: ${d.login}`,
        d.rank ? `Highest rank: ${d.rank}` : null,
        d.evo ? `Evo guns: ${d.evo}` : null,
        `Best items: ${d.items}`,
        `Asking price: ${d.price ? money(d.price) : "open to offers"}`,
        `Ban history: ${d.banned}`,
        "I'm the original owner.",
        "",
        "I'll send screenshots here.",
      ]
        .filter((line) => line !== null)
        .join("\n"),
  });
})();
