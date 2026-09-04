import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { FONT_LINK, display } from "../../components/retro/theme";

/** How long to wait for supabase-js to parse the tokens out of the URL
 *  before assuming something went wrong. This is generous on purpose —
 *  slower phones/networks can take a beat. */
const TIMEOUT_MS = 8000;

export default function Callback() {
  const [, go] = useLocation();
  const { session, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

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
    if (!loading && session) {
      go("/hub");
      return;
    }
    const t = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [loading, session, oauthError, go]);

  const failed = Boolean(oauthError) || timedOut;

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes cb-blink { 0%,55% { opacity: 1 } 56%,100% { opacity: .25 } }
      `}</style>

      {!failed ? (
        <>
          <p style={styles.line}>OPENING THE GATE...</p>
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
