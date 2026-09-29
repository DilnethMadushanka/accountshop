# Mads Account Store

A one-page showcase website for buying and selling Free Fire accounts. It lists the accounts you have, explains how buying works, and sends visitors to WhatsApp, Telegram, Facebook or email. **There are no payments on the site** — it is a catalogue only.

## Editing the shop

Everything you will want to change lives in one file: [`assets/js/config.js`](assets/js/config.js).

- `name` — the shop name in the header and footer.
- `hero` — the big banner: title, the Sinhala subtitle (words in `[brackets]` turn green) and the trust line.
- `contact` — your WhatsApp number (digits only, with country code, e.g. `94771234567`), Telegram username, Facebook link, email, opening hours and location. Leave one empty (`""`) to hide it.
- `contact.reviews` — where the Reviews button goes, such as your Facebook reviews page.
- `listings` — one entry per account. Set `status` to `"available"`, `"reserved"` or `"sold"`. Add `image: "assets/img/your-photo.jpg"` to use a screenshot instead of the generated cover.
- `faq` — questions and answers.

Every "Enquire" button opens WhatsApp with a message that already names the listing (for example *"I'm interested in AS-101 — PUBG Mobile…"*), so you always know which account the buyer means.

## Hero images

The banner reads two images (change the paths in `config.js` if you use other names):

- `assets/img/hero-character.webp` — a Free Fire character on a **transparent** background (PNG or WebP). It stands on the bottom edge of the banner with animated lightning crawling around its outline (colours set in `hero.electric`; set it to `false` to turn it off). The lightning follows the image's transparent edge, so any cut-out character works.
- `assets/img/hero-bg.jpg` — a wide scene. It is dimmed and blurred behind the text.

Until they exist, the banner shows a glowing lightning emblem on a dark backdrop. Use art you have the right to use, such as your own edits or official press kit images.

## Previewing

Open `index.html` in a browser. No build step, no install.

## Publishing for free with GitHub Pages

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick the branch and the `/ (root)` folder, and save.
3. After a minute the site is live at `https://<your-username>.github.io/accountshop/`.
