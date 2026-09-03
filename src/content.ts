/* ═══════════════════════════════════════════════════════════
   Every word on the site lives here.

   This is a PRE-ANNOUNCE pitch page — no supply, price, chain,
   or mint date are confirmed yet, so none are invented here.
   What you see is either true today ("in development") or a
   stated intention ("planned"), never a fabricated stat.
   ═══════════════════════════════════════════════════════════ */

export const BRAND = {
  name: "SWOLDIERS",
  tagline: "An order of blades, chosen one quest at a time.",
  logo: "/mini-logo.jpg", // only logo asset in /public right now — rename the file whenever there's a proper one
};

/* Not live yet — client hasn't created the account. Leave as "" to hide the header icon. */
export const X_URL = "";

/** Supabase table the waitlist form writes to.
 *  Needs columns: email (text), handle (text, nullable). */
export const WAITLIST_TABLE = "<SUPABASE_TABLE_NAME>";

/* Honest status strip for the hero — no numbers we don't have yet. */
export const STATUS: [string, string][] = [
  ["In development", "Status"],
  ["Pixel, hand-drawn", "Art style"],
  ["TBA", "Chain"],
];

export const LORE = {
  eyebrow: "Before the mint",
  title: "The order is forming",
  body: [
    "Every Swoldier starts the same way: chosen, not applied for. The blade picks its bearer, and the bearer answers.",
    "The collection is still being drawn — every character, every class, every scar earned in the field. What's here is the world they're being built for.",
  ],
};

export const VISION = [
  { name: "The Forge", desc: "Upgrade and customize your Swoldier after mint." },
  { name: "The Arena", desc: "Battles, leaderboards, and rewards for holders." },
  { name: "The Camp", desc: "Holder games, raffles, and community missions." },
  { name: "The War Chest", desc: "A token-powered layer for drops and rewards, once it's ready to announce." },
];

/* Honest build stages, not a marketing countdown. */
export const PATH = [
  { stage: "Now", title: "Lore & world", desc: "The Order, the setting, and the tone are locked." },
  { stage: "In progress", title: "Collection art", desc: "Characters, traits, and classes are being illustrated." },
  { stage: "Next", title: "Roster opens", desc: "Early access list opens once the art is ready to show." },
  { stage: "Later", title: "Mint details", desc: "Supply, price, and chain are announced closer to launch." },
  { stage: "After mint", title: "Systems go live", desc: "The Forge, Arena, Camp, and War Chest open to holders." },
];

export const FAQS = [
  { q: `What is ${BRAND.name}?`, a: "A pixel-art character collection, still in development." },
  { q: "When does it mint?", a: "Not yet announced — join the list to hear first." },
  { q: "What do I get for joining the list?", a: "Early word when the roster and mint details open. Nothing else is promised yet." },
  { q: "Is this financial advice?", a: "No. This will be a digital collectible. Do your own research." },
];
