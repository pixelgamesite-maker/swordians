import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { FONT_LINK, display } from "../../components/retro/theme";

/** How long to wait for supabase-js to parse the tokens out of the URL
 *  before assuming something went wrong. This is generous on purpose —
 *  slower phones/networks can take a beat. */
const TIMEOUT_MS = 8000;

export default function Callback() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
    return () => l.remove();
  }, []);

  /* X/Supabase puts an error back in the URL if the user cancels or
     the provider itself rejects the request. */
  const params = new URLSearchParams(window.location.search || window.location.hash.replace("#", "?"));
  const oauthError = params.get("error_description") || params.get("error");

  useEffect(() => {
    if (oauthError) return;
    if (loading || !session) {
      const t = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS);
      return () => window.clearTimeout(t);
    }

    /* Session exists — create the profile (so a ref code exists from
       the very first visit) and redeem any stored referral before
       handing off. Both calls are safe to fail silently: a broken
       ensure_profile just means the profile menu builds itself later
       from record_run/claim_task instead, and record_referral is a
       one-shot best-effort that only ever succeeds once anyway. */
    let cancelled = false;
    (async () => {
      setSettingUp(true);
      const meta = session.user.user_metadata ?? {};
      await supabase
        .rpc("ensure_profile", {
          p_handle: meta.user_name ?? meta.preferred_username ?? null,
          p_avatar_url: meta.avatar_url ?? null,
        })
        .then(undefined, (e) => console.warn("ensure_profile failed:", e));

      let refCode: string | null = null;
      try {
        refCode = localStorage.getItem("sw_ref_code");
      } catch {
        /* ignore */
      }
      if (refCode) {
        await supabase.rpc("record_referral", { p_ref_code: refCode })
          .then(undefined, (e) => console.warn("record_referral failed:", e));
        try {
          localStorage.removeItem("sw_ref_code");
        } catch {
          /* ignore */
        }
      }

      if (!cancelled) go("/hub");
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, session, oauthError, go]);

  const failed = Boolean(oauthError) || timedOut;

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes cb-blink { 0%,55% { opacity: 1 } 56%,100% { opacity: .25 } }
      `}</style>

      {!failed ? (
        <>
          <p style={styles.line}>{settingUp ? "SETTING UP YOUR PROFILE..." : "OPENING THE GATE..."}</p>
          <small style={styles.small}>VERIFYING WITH X</small>
        </>
      ) : (
        <>
          <p style={{ ...styles.line, color: "#e0776e", animation: "none" }}>
            THE GATE DID NOT OPEN
          </p>
          <small style={styles.small}>
            {oauthError || "Sign-in timed out."}
          </small>
          <button style={styles.btn} onClick={() => go("/")}>
            ◀ BACK TO THE START
          </button>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100svh",
    background: "#070a0e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    textAlign: "center",
    padding: 24,
  },
  line: {
    fontFamily: display,
    fontSize: "clamp(.7rem,3.4vw,1rem)",
    color: "#f0b429",
    margin: 0,
    animation: "cb-blink 1s steps(1) infinite",
  },
  small: {
    fontFamily: "'VT323', monospace",
    fontSize: "1.15rem",
    letterSpacing: ".14em",
    color: "#7fa6bd",
  },
  btn: {
    marginTop: 10,
    fontFamily: display,
    fontSize: ".62rem",
    letterSpacing: ".1em",
    padding: "14px 22px",
    color: "#070a0e",
    background: "#f0b429",
    border: "3px solid #070a0e",
    boxShadow: "0 5px 0 #a87a12",
    cursor: "pointer",
  },
};
