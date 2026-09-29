/*
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to update your shop.
 *  Everything on the website (name, hero, contact links, listings)
 *  is read from here. No other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */
window.SHOP = {
  name: "Mads Account Store",

  hero: {
    // The big title: before + highlighted word(s) + second line.
    before: "Mads",
    highlight: "Free Fire",
    after: "Account Store",

    // Words inside [square brackets] are shown in green.
    subtitle: "FF Account [Buy & Sell] කරන්න හොඳම තැන",

    // Small trust line under the buttons.
    trust: ["Trusted FF Accounts", "5+ Years Experience"],

    /*
     * Your images. Put the files in assets/img/ with these names
     * (or change the paths). Until they exist, a glowing emblem and
     * a dark backdrop are shown instead.
     *   character:  a Free Fire character with a transparent background (PNG or WebP)
     *   background: a wide scene that sits dimmed and blurred behind everything
     */
    character: "assets/img/hero-character.webp",
    background: "", // e.g. "assets/img/hero-bg.jpg"

    // Lightning around the character. Set to false to turn it off.
    electric: { glow: "#ffd23f", core: "#ffffff" },
  },

  // Shown as prices only. This site never takes payments.
  currency: "LKR",

  contact: {
    // WhatsApp number in international format, digits only (e.g. 94771234567).
    whatsapp: "94770000000",
    telegram: "madsaccountstore", // username without @
    facebook: "https://facebook.com/madsaccountstore",
    email: "hello@madsaccountstore.lk",
    // Your Facebook reviews page, linked from the Reviews page.
    reviews: "https://facebook.com/madsaccountstore/reviews",
    hours: "Every day, 9:00 AM – 10:00 PM (Sri Lanka time)",
    // Opening hours in Sri Lanka time (24h clock). Drives the "Online now" dot.
    open: { from: 9, to: 22 },
    location: "Sri Lanka",
  },

  /*
   * Listings.
   * status: "available" | "reserved" | "sold"
   * image:  optional path or URL (e.g. "assets/img/ff-101.jpg").
   *         Leave it out and a clean cover is drawn automatically.
   */
  listings: [
    {
      id: "MA-101",
      game: "Free Fire",
      title: "Old season elite pass collection",
      level: "Lv. 74",
      price: 28500,
      status: "available",
      login: "Google",
      highlights: ["Elite Pass S1–S10", "Cobra MP40 max", "Hip Hop bundle", "3 evo guns max"],
      notes: "Original owner. Only Google is linked, changed to your account during the handover.",
    },
    {
      id: "MA-102",
      game: "Free Fire",
      title: "Evo gun collector · 7 maxed",
      level: "Lv. 68",
      price: 42000,
      status: "available",
      login: "Facebook + Google",
      highlights: ["Evo M1887 max", "Evo AK max", "Evo Woodpecker max", "Blue Flame Draco AK"],
      notes: "Facebook bind can be removed so only your Google account stays linked.",
    },
    {
      id: "MA-103",
      game: "Free Fire",
      title: "Grandmaster rank · rare bundles",
      level: "Lv. 80",
      price: 35000,
      status: "reserved",
      login: "Google",
      highlights: ["Grandmaster BR", "Sakura bundle", "Criminal bundle (red)", "20+ emotes"],
      notes: "Reserved until a buyer confirms. Message me to be next in line.",
    },
    {
      id: "MA-104",
      game: "Free Fire",
      title: "Budget starter with elite passes",
      level: "Lv. 55",
      price: 9500,
      status: "available",
      login: "Google",
      highlights: ["Elite Pass S20–S30", "2 evo guns", "Diamond-rank skins"],
      notes: "Good first account. Clean history, never banned.",
    },
    {
      id: "MA-105",
      game: "Free Fire",
      title: "Top-up veteran · 60k diamonds spent",
      level: "Lv. 82",
      price: 60000,
      status: "sold",
      login: "Facebook",
      highlights: ["All evo guns", "Every incubator since 2020", "Rare pets max"],
      notes: "Sold — kept here so you can see past handovers.",
    },
    {
      id: "MA-106",
      game: "Free Fire",
      title: "Clean mid account · likes 12k",
      level: "Lv. 62",
      price: 16000,
      status: "available",
      login: "Google",
      highlights: ["12k profile likes", "Evo MP40 lv. 4", "Old ramadan bundle"],
      notes: "Email changeable. Original owner, never shared.",
    },
  ],

  // Admin (middleman) service: you hold the account between a buyer and
  // a seller who found each other elsewhere. The fee is only an estimate
  // shown on the Admin Service page.
  adminService: {
    feePercent: 5,
    feeMin: 500,
  },

  // Login types offered on the Sell page form.
  loginTypes: ["Google", "Facebook", "VK", "X (Twitter)", "Huawei", "Guest", "Other"],

  /*
   * Reviews from real customers. Only add reviews people actually gave
   * you (for example, copied from WhatsApp or Facebook with permission).
   * Format:
   *   { name: "Kasun", stars: 5, text: "Smooth handover, very patient.", date: "2026-09-12", account: "MA-104" },
   */
  reviews: [],

  /*
   * Proof of handovers: screenshots you took. Put images in assets/img/proof/.
   * type: "sold" (you sold it) | "bought" (you bought it) | "admin" (middleman deal)
   *   { image: "assets/img/proof/ma-105.jpg", caption: "MA-105 handed over", date: "2026-09-20", type: "sold" },
   */
  proof: [],

  faq: [
    {
      q: "Can I pay on this website?",
      a: "No. This site is a catalogue only. Message me on WhatsApp, we agree on the details together, and payment is arranged directly between us.",
    },
    {
      q: "How do I know the account is real?",
      a: "Before anything else, I show the account live over a video call or screen-share, including the login screen and linked accounts.",
    },
    {
      q: "How is the account handed over?",
      a: "Step by step, together on chat. I move the Google or Facebook link to yours, then remove my own access while you watch.",
    },
    {
      q: "Can I sell my Free Fire account to you?",
      a: "Yes. Send me your level, the best items and a few screenshots on WhatsApp and I'll reply with an honest price.",
    },
    {
      q: "Can I reserve an account?",
      a: "Yes. Message me with the listing number (like MA-101) and I'll mark it as reserved for you for a short time.",
    },
  ],
};
