import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import Gallery from "../components/game/Gallery";
import { APP_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";

export default function Play() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  useEffect(() => {
    if (!loading && !session) go("/");
  }, [loading, session, go]);

  /* Writes go through record_run() in Postgres, not a direct table
     insert — the function ignores whatever we claim for "qualified"
     and recomputes it server-side, so there's nothing to fake here. */
  async function record(r: { score: number; qualified: boolean; civilians: number; seconds: number }) {
    if (!session) return;
    const { error } = await supabase.rpc("record_run", {
      p_score: r.score,
      p_civilians: r.civilians,
      p_seconds: r.seconds,
      p_handle: session.user.user_metadata?.user_name ?? null,
    });
    if (error) console.error("record_run failed:", error.message);
  }

  return (
    <div className="ap-game">
      <style>{APP_CSS}</style>
      <div className="ap-game-top">
        <button className="ap-back" onClick={() => go("/hub")}>◀ BACK</button>
      </div>
      <div className="ap-game-wrap">
        <Gallery onFinish={record} />
      </div>
    </div>
  );
}
