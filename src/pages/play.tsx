import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import Gallery from "../components/game/Gallery";
import { APP_CSS } from "../components/retro/appTheme";
import { FONT_LINK } from "../components/retro/theme";
import { RUNS_TABLE } from "../content";

export default function Play() {
  const [, go] = useLocation();
  const { session, loading } = useSession();

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  useEffect(() => {
    if (!loading && !session) go("/");
  }, [loading, session, go]);

  async function record(r: { score: number; qualified: boolean; civilians: number; seconds: number }) {
    if (!session) return;
    await supabase.from(RUNS_TABLE).insert([{
      x_id: session.user.id,
      handle: session.user.user_metadata?.user_name ?? null,
      score: r.score,
      qualified: r.qualified,
      civilians: r.civilians,
      seconds: r.seconds,
    }]).then(undefined, () => { /* table may not exist yet */ });
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
