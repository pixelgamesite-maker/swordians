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

/* Supabase tables. Created by supabase/schema.sql. */
export const RUNS_TABLE = "game_runs";         // history log — x_id, handle, score, civilians, seconds
export const TASKS_TABLE = "social_tasks";     // x_id, task_id, completed_at
export const LEADERBOARD_TABLE = "leaderboard"; // x_id, handle, avatar_url, total_points — the single running total

/* Display cap for the leaderboard page. Everyone can still play —
   this is how many rows the leaderboard page shows/ranks, not a
   limit on who's allowed to play. */
export const LEADERBOARD_SIZE = 1000;

/* ── Scoring ──────────────────────────────────────────────
   Two enemy tiers now, worth different points. Civilians cost
   both points AND a heart — losing all hearts ends the run.   */
export const SCORING = {
  enemyA: 20,          // enemy-1.png
  enemyB: 10,          // enemy-2.png
  civilianHit: -20,
  civilianHeartCost: 1,
  healthMax: 3,         // ⚠️ not specified — starting hearts, tune freely

  /* Combo bonus for consecutive enemy hits without a civilian in between. */
  comboStep: 5,
  comboCap: 40,
};

/* ── Pickups ──────────────────────────────────────────────
   Spawn chance is checked independently of the enemy/civilian
   roll, so these are rare interruptions rather than replacing
   normal targets. ⚠️ Weights below are a starting guess — tune
   once the game is actually being played.                     */
export const PICKUPS = {
  healthChance: 0.05,   // heals 1 heart, capped at healthMax
  freezeChance: 0.04,   // pauses spawning + movement for freezeMs
  grenadeChance: 0.03,  // clears every enemy/civilian on screen
  freezeMs: 3000,
};

/* ── Environments ─────────────────────────────────────────
   The arena background changes as the player's LIVE SCORE in
   the current run crosses each threshold — a visual sense of
   progress, not tied to lifetime leaderboard points.
   ⚠️ Thresholds are placeholders — spread them across whatever
   a realistic run scores once the game is tuned.               */
export const ENVIRONMENTS = [
  { threshold: 0,    src: "/environment.png" },
  { threshold: 600,  src: "/environment2.jpg" },
  { threshold: 1400, src: "/environment3.jpg" },
  { threshold: 2400, src: "/environment4.jpg" },
  { threshold: 3600, src: "/environment5.jpg" },
];

/* Points awarded for social tasks — added to the SAME leaderboard
   total as game points, not tracked separately. */
export const TASK_POINTS = 250;

export const TASKS = [
  { id: "follow", label: "Follow on X", desc: "Follow the account to stay in the loop.", url: X_URL },
  { id: "like", label: "Like the pinned post", desc: "Show the announcement some love.", url: PINNED_TWEET_URL },
  { id: "repost", label: "Repost the pinned post", desc: "Put it in front of your followers.", url: PINNED_TWEET_URL },
  { id: "tag", label: "Tag 2 friends", desc: "Drop two mutuals in the replies.", url: PINNED_TWEET_URL },
];
