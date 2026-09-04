import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useAuth, handleFrom, signOut } from "../hooks/useAuth";
import { useAudio } from "../audio/AudioProvider";
import { APP_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";
import { BRAND, RUNS_TABLE, TASKS_TABLE, TASK_POINTS } from "../content";

export default function Hub() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();
  const { muted, toggleMute } = useAudio();
  const [best, setBest] = useState<number | null>(null);
  const [taskPoints, setTaskPoints] = useState(0);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  /* Not signed in? Back to the gate. */
  useEffect(() => {
    if (!loading && !session) go("/");
  }, [loading, session, go]);

  /* Pull the player's best run + completed tasks */
  useEffect(() => {
    if (!session) return;
    const uid = session.user.id;
    (async () => {
      const [{ data: runs }, { data: tasks }] = await Promise.all([
        supabase.from(RUNS_TABLE).select("score").eq("x_id", uid).order("score", { ascending: false }).limit(1),
        supabase.from(TASKS_TABLE).select("task_id").eq("x_id", uid),
      ]);
      if (runs?.length) setBest(runs[0].score);
      if (tasks) setTaskPoints(tasks.length * TASK_POINTS);
    })().catch(() => { /* tables may not exist yet */ });
  }, [session]);

  if (loading) {
    return <div className="ap-root"><style>{APP_CSS}</style>
      <div className="ap-center"><span className="ap-spinner">LOADING...</span></div>
    </div>;
  }

  const handle = handleFrom(session);
  const avatar = session?.user.user_metadata?.avatar_url;
  const total = (best ?? 0) + taskPoints;

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
        <p className="ap-lede">Earn points two ways. The highest scores take the guaranteed spots.</p>

        <div className="ap-points">
          <span>TOTAL POINTS</span>
          <b>{total.toLocaleString()}</b>
          <small>
            {best === null ? "No run logged yet" : `Best run ${best.toLocaleString()}`}
            {taskPoints > 0 && ` · ${taskPoints.toLocaleString()} from tasks`}
          </small>
        </div>

        <div className="ap-tiles">
          <button className="ap-tile" data-primary="true" onClick={() => go("/play")}>
            <h3>▶ PLAY</h3>
            <p>Take the range. Shoot hostiles, spare civilians, and set your score.</p>
          </button>
          <button className="ap-tile" onClick={() => go("/tasks")}>
            <h3>★ EARN POINTS</h3>
            <p>Complete social missions for a flat point bonus each.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
