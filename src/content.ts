/* ═══════════════════════════════════════════════════════════
   All copy, tuning numbers and links in one place.
   <PLACEHOLDER> values must be filled before going live.
   ═══════════════════════════════════════════════════════════ */

export const BRAND = {
  name: "SWOLDIERS",
  tagline: "Chosen by the blade, not the crowd.",
  logo: "/mini-logo.jpg",
};

export const X_URL = "";                      // no account yet — header icon hides while empty
export const PINNED_TWEET_URL = "";

/* Supabase tables — created by supabase/schema.sql */
export const RUNS_TABLE = "game_runs";    // x_id, handle, score, qualified, civilians, seconds
export const TASKS_TABLE = "social_tasks"; // x_id, task_id, completed_at

/* ── Scoring ──────────────────────────────────────────────
   We never settled on exact numbers, so these are a starting
   point tuned so a decent run lands around 2,500–4,000.
   Play it and move them; nothing else needs changing.        */
export const SCORING = {
  enemyHit: 100,
  comboStep: 25,        // added per consecutive enemy
  comboCap: 200,        // max combo bonus per hit
  civilianHit: -150,
  maxCivilians: 5,      // this many and the run ends
  qualifyingScore: 2500,
};

/* Points awarded for social tasks. */
export const TASK_POINTS = 250;

export const TASKS = [
  { id: "follow", label: "Follow on X", desc: "Follow the account to stay in the loop.", url: X_URL },
  { id: "like", label: "Like the pinned post", desc: "Show the announcement some love.", url: PINNED_TWEET_URL },
  { id: "repost", label: "Repost the pinned post", desc: "Put it in front of your followers.", url: PINNED_TWEET_URL },
  { id: "tag", label: "Tag 2 friends", desc: "Drop two mutuals in the replies.", url: PINNED_TWEET_URL },
];

export const SPOTS = {
  total: 1500,          // hard cap on guaranteed spots
};
