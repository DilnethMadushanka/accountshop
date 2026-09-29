# AccountShop

A one-page showcase website for selling game accounts. It lists the accounts you have, explains how buying works, and sends visitors to WhatsApp, Telegram, Facebook or email. **There are no payments on the site** — it is a catalogue only.

## Editing the shop

Everything you will want to change lives in one file: [`assets/js/config.js`](assets/js/config.js).

- `name`, `tagline`, `intro` — the text at the top of the page.
- `contact` — your WhatsApp number (digits only, with country code, e.g. `94771234567`), Telegram username, Facebook link, email, opening hours and location. Leave one empty (`""`) to hide it.
- `stats` — the three numbers under the intro.
- `listings` — one entry per account. Set `status` to `"available"`, `"reserved"` or `"sold"`. Add `image: "assets/img/your-photo.jpg"` to use a screenshot instead of the generated cover.
- `faq` — questions and answers.

Every "Enquire" button opens WhatsApp with a message that already names the listing (for example *"I'm interested in AS-101 — PUBG Mobile…"*), so you always know which account the buyer means.

## Previewing

Open `index.html` in a browser. No build step, no install.

## Publishing for free with GitHub Pages

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick the branch and the `/ (root)` folder, and save.
3. After a minute the site is live at `https://<your-username>.github.io/accountshop/`.
