import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { APP_CSS, LEADERBOARD_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";
import { LEADERBOARD_TABLE, LEADERBOARD_SIZE } from "../content";

type Row = { x_id: string; handle: string | null; avatar_url: string | null; total_points: number };

export default function Leaderboard() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  useEffect(() => {
    if (!loading && !session) go("/");
  }, [loading, session, go]);

  useEffect(() => {
    supabase
      .from(LEADERBOARD_TABLE)
      .select("x_id, handle, avatar_url, total_points")
      .order("total_points", { ascending: false })
      .limit(LEADERBOARD_SIZE)
      .then(({ data }) => setRows(data ?? []))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="ap-root">
      <style>{APP_CSS}{LEADERBOARD_CSS}</style>

      <div className="ap-bar">
        <button className="ap-back" onClick={() => go("/hub")}>◀ BACK</button>
        <div className="ap-icons"><span className="ap-icon">TOP {LEADERBOARD_SIZE}</span></div>
      </div>

      <div className="ap-body">
        <p className="ap-eyebrow">RANKINGS</p>
        <h1 className="ap-h1">LEADERBOARD</h1>
        <p className="ap-lede">Every point from runs and tasks, added together. Ranked live.</p>

        {rows === null ? (
          <p className="ap-lede">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="ap-lede">Nobody's on the board yet — be first.</p>
        ) : (
          <div>
            {rows.map((r, i) => {
              const mine = session?.user.id === r.x_id;
              return (
                <div className="lb-row" key={r.x_id} data-me={mine}>
                  <span className="lb-rank">#{i + 1}</span>
                  {r.avatar_url
                    ? <img className="lb-avatar" src={r.avatar_url} alt="" />
                    : <div className="lb-avatar-fallback" />}
                  <span className="lb-handle">{r.handle ? `@${r.handle}` : "Soldier"}</span>
                  <span className="lb-pts">{r.total_points.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}

        <p className="ap-note">
          Shown here: the top {LEADERBOARD_SIZE} accounts by total points. Everyone can
          still play beyond that — this is a display cap, not a lock on who's allowed in.
        </p>
      </div>
    </div>
  );
}
