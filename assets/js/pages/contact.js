(function () {
  "use strict";
  const { shop, c, $, faqList, whatsappForm, openState } = window.Site;

  const state = openState();
  if (state) {
    const b = $("#open-badge");
    b.hidden = false;
    b.className = `open-badge${state.isOpen ? "" : " is-closed"}`;
    b.innerHTML = `<i aria-hidden="true"></i>${state.label}`;
  }

  const build = (d) => `Hi ${shop.name}! [${d.topic}]\n\n${d.message}\n\n— ${d.name}`;
  const form = whatsappForm($("#contact-form"), { draftKey: "contact-draft", build });

  const email = $("#send-email");
  if (!c.email) email.remove();
  else
    email.addEventListener("click", () => {
      const d = form.data();
      if (!$("#contact-form").reportValidity()) return;
      location.href = `mailto:${c.email}?subject=${encodeURIComponent(`${d.topic} — ${shop.name}`)}&body=${encodeURIComponent(`${d.message}\n\n— ${d.name}`)}`;
    });

  $("#faq-list").innerHTML = faqList(shop.faq);
})();
