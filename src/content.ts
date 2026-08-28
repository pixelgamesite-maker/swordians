/* ═══════════════════════════════════════════════════════════
   Every word on the site lives here. This is the only file
   you should need to touch to change copy, numbers, or links.

   ⚠️ Anything wrapped in <> below is a placeholder — swap in
   the real number/link before shipping. Nothing here should
   guess at facts about your actual collection.
   ═══════════════════════════════════════════════════════════ */

export const BRAND = {
  name: "SWORDIANS",
  token: "$SWORD",              // ← set to null if there's no token yet
  list: "The Roster",           // whitelist / access-list phase name
  tagline: "Chosen by the blade, not the crowd.",
  supply: "<SUPPLY>",           // e.g. "10,000"
  price: "<MINT PRICE>",        // e.g. "0.01 ETH"
  chain: "<CHAIN>",             // e.g. "Ethereum"
  venue: "<LAUNCHPAD>",         // e.g. "OpenSea"
  logo: "/logo.jpg",
};

export const X_URL = "<X_URL>";                 // e.g. https://x.com/swordians
export const PINNED_TWEET_URL = "<PINNED_TWEET_URL>";
export const MINT_URL = "<MINT_URL>";            // OpenSea / mint page link

export const HUD: [string, string][] = [
  [BRAND.supply, "Supply"],
  [BRAND.price, "Mint price"],
  [BRAND.chain, "Chain"],
  [BRAND.venue, "Launchpad"],
];

export const GALLERY = [
  // Add the character art you want cycling through the hero gallery.
  "/Character-1.jpg",
  "/Character-2.jpg",
  "/Character-3.jpg",
];

export const CLASSES = [
  { name: "Recruits", desc: "Fresh to the order. Simple gear, clear eyes.", art: "/Character-1.jpg" },
  { name: "Veterans", desc: "Scarred, sharper, and impossible to miss.", art: "/Character-2.jpg" },
  { name: "Elites", desc: "Loud loadouts and battlefield rarity.", art: "/Character-3.jpg" },
  { name: "Commanders", desc: "Harder to find. Easier to notice.", art: "/Character-1.jpg" },
  { name: "Originals", desc: "The founding blades. Deepest tie to the order.", art: "/Character-2.jpg" },
];

export const TRAITS = [
  "Headgear", "Armor", "Weapons", "Expressions",
  "Colors", "Scars & marks", "Backgrounds", "Rare details",
];

export const SYSTEMS = [
  { name: "The Forge", desc: "Upgrade and customize your Swordian." },
  { name: "The Arena", desc: "Battles, leaderboards, and rewards." },
  { name: "The Camp", desc: "Holder games, raffles, and community missions." },
  { name: "The War Chest", desc: `Spend ${BRAND.token ?? "the token"} on drops, rerolls, and rewards.` },
];

export const ROADMAP = [
  { phase: "Phase I", title: `${BRAND.list} opens`, desc: "Applications and early access review begin." },
  { phase: "Phase II", title: "Mint opens", desc: `Selected wallets mint on ${BRAND.venue}.` },
  { phase: "Phase III", title: "Reveal", desc: "Traits, classes, and rarity go live." },
  { phase: "Phase IV", title: `${BRAND.token ?? "Token"} details`, desc: "Full mechanics shared after mint." },
  { phase: "Phase V", title: "The systems begin", desc: "The Forge, Arena, Camp, and War Chest open." },
];

export const FAQS = [
  { q: `What is ${BRAND.name}?`, a: `A ${BRAND.supply} supply pixel character collection on ${BRAND.chain}.` },
  { q: "What is the mint price?", a: BRAND.price },
  { q: "Where is the mint?", a: BRAND.venue },
  { q: `What is ${BRAND.list}?`, a: "The access phase before mint." },
  { q: "Is there a public mint?", a: "Only if wallets are left over after the Roster." },
  ...(BRAND.token
    ? [
        { q: `What is ${BRAND.token}?`, a: "The token planned to power the systems after mint." },
        { q: `When do ${BRAND.token} details drop?`, a: "After mint." },
      ]
    : []),
  { q: "Is this financial advice?", a: "No. This is a digital collectible. Do your own research." },
];
