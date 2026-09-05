import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useAuth, handleFrom, signOut } from "../hooks/useAuth";
import { useAudio } from "../audio/AudioProvider";
import { APP_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";
import { BRAND, LEADERBOARD_TABLE } from "../content";

export default function Hub() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();
  const { muted, toggleMute } = useAudio();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  useEffect(() => {
    if (!loading && !session) go("/");
  }, [loading, session, go]);

  /* The leaderboard row IS the running total — every run and every
     task's points land on it via record_run()/claim_task(), so this
     is a single read instead of summing two tables client-side. */
  useEffect(() => {
    if (!session) return;
    supabase.from(LEADERBOARD_TABLE).select("total_points").eq("x_id", session.user.id).maybeSingle()
      .then(({ data }) => setTotal(data?.total_points ?? 0))
      .catch(() => { /* table may not exist yet */ });
  }, [session]);

  if (loading) {
    return <div className="ap-root"><style>{APP_CSS}</style>
      <div className="ap-center"><span className="ap-spinner">LOADING...</span></div>
    </div>;
  }

  const handle = handleFrom(session);
  const avatar = session?.user.user_metadata?.avatar_url;

  return (
    <div className="ap-root">
      <style>{APP_CSS}</style>

      <div className="ap-bar">
        <div className="ap-who">
          {avatar && <img src={avatar} alt="" />}
          <b>{handle ? `@${handle}` : "SOLDIER"}</b>
        </div>
        <div className="ap-icons">
          <button className="ap-icon" onClick={toggleMute}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
          <button className="ap-icon" onClick={() => signOut().then(() => go("/"))}>EXIT</button>
        </div>
      </div>

      <div className="ap-body">
        <p className="ap-eyebrow">{BRAND.name} — BASE CAMP</p>
        <h1 className="ap-h1">CHOOSE YOUR ORDERS</h1>
        <p className="ap-lede">Every run and every task adds to one running total. Highest totals take the guaranteed spots.</p>

        <div className="ap-points">
          <span>TOTAL POINTS</span>
          <b>{(total ?? 0).toLocaleString()}</b>
          <small>{total === null ? "No points yet — go earn some" : "Across every run and task"}</small>
        </div>

        <div className="ap-tiles">
          <button className="ap-tile" data-primary="true" onClick={() => go("/play")}>
            <h3>▶ PLAY</h3>
            <p>Take the range. Shoot hostiles, spare civilians, and add to your total.</p>
          </button>
          <button className="ap-tile" onClick={() => go("/tasks")}>
            <h3>★ EARN POINTS</h3>
            <p>Complete social missions for a flat point bonus each.</p>
          </button>
          <button className="ap-tile" onClick={() => go("/leaderboard")}>
            <h3>☰ LEADERBOARD</h3>
            <p>See where you rank against everyone else.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
