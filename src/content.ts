/* ═══════════════════════════════════════════════════════════
   Every word on the site lives here. Renaming the collection
   is a one-file edit — nothing below is hardcoded in the JSX.
   ═══════════════════════════════════════════════════════════ */

export const BRAND = {
  name: "MINIONS",          // ← flip to "SWORDIANS" and the whole site follows
  token: "$MINO",
  list: "The MinoList",
  tagline: "Cute. Bold. Mainly for the cool ones.",
  supply: "10,000",
  price: "0.001 ETH",
  chain: "Ethereum",
  venue: "OpenSea",
  logo: "/mini-logo.jpg",
};

export const X_URL = "https://x.com/theminionxyz";
export const PINNED_TWEET_URL =
  "https://x.com/theminionxyz/status/2067230883841544438";
export const OPENSEA_URL = "https://opensea.io/collection/minionsplay/overview";

export const HUD: [string, string][] = [
  [BRAND.supply, "Supply"],
  [BRAND.price, "Mint price"],
  [BRAND.chain, "Chain"],
  [BRAND.venue, "Launchpad"],
];

export const GALLERY = [
  "/Mini-1.jpg", "/Mini-2.jpg", "/Mini-3.jpg", "/Mini-4.jpg",
  "/Mini-10.jpg", "/Mini-11.jpg", "/Mini-12.jpg", "/Mini-13.jpg",
  "/Mini-14.jpg", "/Mini-15.jpg", "/Mini-16.jpg", "/Mini-17.jpg",
  "/Mini-18.jpg", "/Mini-19.jpg", "/Mini-20.jpg", "/Mini-21.jpg",
  "/Mini-22.jpg", "/Mini-23.jpg", "/Mini-24.jpg", "/Mini-25.jpg",
  "/Mini-26.jpg", "/Mini-27.jpg",
];

export const CLASSES = [
  { name: "Regulars", desc: "Clean, simple, and easy to love.", art: "/Mini-10.jpg" },
  { name: "Cool Ones", desc: "Extra style, stronger attitude, cleaner presence.", art: "/Mini-11.jpg" },
  { name: "Wild Ones", desc: "Loud traits and chaotic combinations.", art: "/Mini-12.jpg" },
  { name: "Bosses", desc: "Harder to find. Easier to notice.", art: "/Mini-13.jpg" },
  { name: "Originals", desc: `The rarest, with the deepest link to ${BRAND.token}.`, art: "/Mini-14.jpg" },
];

export const TRAITS = [
  "Hair", "Outfits", "Accessories", "Moods",
  "Colors", "Body details", "Backgrounds", "Special features",
];

export const SYSTEMS = [
  { name: "The Lab", desc: "Upgrade and experiment with your characters." },
  { name: "The Arena", desc: "Games, battles, leaderboards, and rewards." },
  { name: "The Playground", desc: "Holder games, raffles, missions, and events." },
  { name: "The Mino Machine", desc: `Spend ${BRAND.token} on spins, rerolls, and mystery outcomes.` },
];

export const ROADMAP = [
  { phase: "Phase I", title: "MinoList opens", desc: "Applications, collabs, and early access review begin." },
  { phase: "Phase II", title: "Mint opens", desc: "Selected wallets mint on OpenSea." },
  { phase: "Phase III", title: "Reveal", desc: "Traits, classes, and rarity go live." },
  { phase: "Phase IV", title: `${BRAND.token} details`, desc: "Tokenomics, supply, and claim mechanics are shared." },
  { phase: "Phase V", title: "The systems begin", desc: "The Lab, Arena, Playground, and Mino Machine open." },
];

export const FAQS = [
  { q: `What is ${BRAND.name}?`, a: `A ${BRAND.supply} supply pixel character collection on Ethereum.` },
  { q: "What is the mint price?", a: BRAND.price },
  { q: "Where is the mint?", a: "OpenSea." },
  { q: `What is ${BRAND.list}?`, a: "The only mint access phase." },
  { q: "Is there a public mint?", a: "Only if wallets are left over after the MinoList." },
  { q: `What is ${BRAND.token}?`, a: "The token planned to power the systems after mint." },
  { q: `When do ${BRAND.token} details drop?`, a: "After mint." },
  { q: "Is this financial advice?", a: "No. This is a digital collectible. Do your own research." },
];
