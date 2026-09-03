import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import { APP_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";
import { TASKS, TASKS_TABLE, TASK_POINTS } from "../content";

export default function Tasks() {
  const [, go] = useLocation();
  const { session, loading } = useSession();
  const [done, setDone] = useState<Set<string>>(new Set());

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
    if (!session) return;
    supabase.from(TASKS_TABLE).select("task_id").eq("x_id", session.user.id)
      .then(({ data }) => { if (data) setDone(new Set(data.map((r) => r.task_id))); })
      .catch(() => { /* table may not exist yet */ });
  }, [session]);

  async function claim(id: string, url: string) {
    if (!session || done.has(id)) return;
    if (url) window.open(url, "_blank", "noopener");
    setDone((s) => new Set(s).add(id));
    await supabase.from(TASKS_TABLE)
      .insert([{ x_id: session.user.id, task_id: id }])
      .then(undefined, () => { /* ignore duplicate/missing table */ });
  }

  const earned = done.size * TASK_POINTS;

  return (
    <div className="ap-root">
      <style>{APP_CSS}</style>

      <div className="ap-bar">
        <button className="ap-back" onClick={() => go("/hub")}>◀ BACK</button>
        <div className="ap-icons"><span className="ap-icon">{earned.toLocaleString()} PTS</span></div>
      </div>

      <div className="ap-body">
        <p className="ap-eyebrow">MISSIONS</p>
        <h1 className="ap-h1">EARN POINTS</h1>
        <p className="ap-lede">{TASK_POINTS} points each. Tap to open, then it marks itself complete.</p>

        {TASKS.map((t) => {
          const isDone = done.has(t.id);
          const ready = Boolean(t.url);
          return (
            <div className="ap-task" key={t.id} data-done={isDone}>
              <div className="ap-task-txt">
                <h4>{t.label.toUpperCase()}</h4>
                <p>{ready ? t.desc : "Link not set yet — coming soon."}</p>
              </div>
              {isDone
                ? <span className="ap-tick">✔</span>
                : <button className="ap-go" disabled={!ready} onClick={() => claim(t.id, t.url)}>GO</button>}
            </div>
          );
        })}

        <p className="ap-note">
          Tasks unlock once the X account is live and the pinned post exists. Fill in
          X_URL and PINNED_TWEET_URL in content.ts to switch them on.
        </p>
      </div>
    </div>
  );
}
