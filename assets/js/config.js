/*
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to update your shop.
 *  Everything on the website (name, contact links, listings)
 *  is read from here. No other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */
window.SHOP = {
  name: "AccountShop",
  tagline: "Verified game accounts, handed over properly.",
  intro:
    "I sell hand-checked game accounts. Every listing is real, every detail is shown up front, and every handover is done one-to-one with you over chat. No checkout, no bots — just message me.",

  // Shown as prices only. This site never takes payments.
  currency: "LKR",

  // Numbers shown in the hero. Remove a line to hide it.
  stats: [
    { value: "120+", label: "Accounts handed over" },
    { value: "3 yrs", label: "Selling since 2023" },
    { value: "< 1 hr", label: "Typical reply time" },
  ],

  contact: {
    // WhatsApp number in international format, digits only (e.g. 94771234567).
    whatsapp: "94770000000",
    telegram: "accountshop", // username without @
    facebook: "https://facebook.com/accountshop",
    email: "hello@accountshop.lk",
    hours: "Every day, 9:00 AM – 10:00 PM (Sri Lanka time)",
    location: "Colombo, Sri Lanka",
  },

  /*
   * Listings.
   * status: "available" | "reserved" | "sold"
   * image:  optional path or URL (e.g. "assets/img/pubg-01.jpg").
   *         Leave it out and a clean cover is drawn automatically.
   */
  listings: [
    {
      id: "AS-101",
      game: "PUBG Mobile",
      title: "Conqueror S3 · 42 mythics",
      level: "Lv. 78",
      price: 48000,
      status: "available",
      server: "Asia",
      login: "Email + Twitter bind",
      highlights: ["Glacier M416 (max)", "Pharaoh X-Suit", "42 mythic outfits", "8 upgradable guns"],
      notes: "Original owner. Email and Twitter both transferable. Screen-share available before handover.",
    },
    {
      id: "AS-102",
      game: "Free Fire",
      title: "Old season elite pass collection",
      level: "Lv. 71",
      price: 22500,
      status: "available",
      server: "SEA",
      login: "Google + Facebook",
      highlights: ["S1–S8 elite passes", "Cobra MP40", "3 evo guns max", "Rare hip-hop bundle"],
      notes: "Facebook bind can be removed so only your Google account stays linked.",
    },
    {
      id: "AS-103",
      game: "Mobile Legends",
      title: "Mythical Glory · 118 heroes",
      level: "Lv. 90",
      price: 35000,
      status: "reserved",
      server: "SEA",
      login: "Moonton + Google",
      highlights: ["All heroes but 2", "412 skins", "6 collector skins", "Legend skin: Alucard"],
      notes: "Reserved until a buyer confirms. Message me to be next in line.",
    },
    {
      id: "AS-104",
      game: "Clash of Clans",
      title: "TH16 max · builder base 10",
      level: "XP 241",
      price: 30000,
      status: "available",
      server: "Global",
      login: "Supercell ID",
      highlights: ["Max heroes", "All sceneries since 2021", "Gold pass skins", "Clan capital hall 9"],
      notes: "Supercell ID changed to your email during a live call.",
    },
    {
      id: "AS-105",
      game: "Call of Duty Mobile",
      title: "Legendary rank · 19 mythics",
      level: "Lv. 150",
      price: 41000,
      status: "sold",
      server: "Global",
      login: "Activision",
      highlights: ["Mythic DL Q33", "Mythic Krig 6", "Legendary Ghost", "Every battle pass since S4"],
      notes: "Sold — kept here so you can see past handovers.",
    },
    {
      id: "AS-106",
      game: "Genshin Impact",
      title: "AR 60 · 14 five-star characters",
      level: "AR 60",
      price: 55000,
      status: "available",
      server: "Asia",
      login: "HoYoverse email",
      highlights: ["Raiden C2", "Nahida C1", "Full Inazuma & Sumeru explored", "Staff of Homa"],
      notes: "Email is changeable. Original owner, never shared.",
    },
  ],

  faq: [
    {
      q: "Can I pay on this website?",
      a: "No. This site is a catalogue only. Message me, we agree on the details together, and payment is arranged directly between us.",
    },
    {
      q: "How do I know the account is real?",
      a: "Before anything else, I show the account live over a video call or screen-share, including the login screen and bound accounts.",
    },
    {
      q: "How is the account handed over?",
      a: "Step by step, together on chat. I change the email and binds to yours, then remove my own recovery options while you watch.",
    },
    {
      q: "Can I reserve an account?",
      a: "Yes. Message me with the listing number (like AS-101) and I'll mark it as reserved for you for a short time.",
    },
    {
      q: "Do you buy accounts too?",
      a: "Sometimes. Send me the game, level and a few screenshots and I'll reply with an honest answer.",
    },
  ],
};
