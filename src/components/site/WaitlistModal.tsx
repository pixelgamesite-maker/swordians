import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { BRAND, WAITLIST_TABLE } from "../../content";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem("sw_waitlist_submitted") === "true") setAlready(true);
    } catch {
      /* storage unavailable — form still works */
    }
  }, []);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  async function submit() {
    if (!isEmail(email) || already) return;
    setErr("");
    setSending(true);
    const { error } = await supabase.from(WAITLIST_TABLE).insert([
      { email: email.trim(), handle: handle.trim() || null },
    ]);
    setSending(false);
    if (error) {
      setErr("That didn't go through. Check your connection and try again.");
      return;
    }
    setSent(true);
    try {
      localStorage.setItem("sw_waitlist_submitted", "true");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="hm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hm-modal" role="dialog" aria-modal="true" aria-label="Join the waitlist">
        <button className="hm-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {already || sent ? (
          <div className="hm-done">
            <div className="hm-seal">✔</div>
            <h2>{sent ? "YOU'RE ON THE LIST" : "ALREADY ON THE LIST"}</h2>
            <p className="hm-p" style={{ margin: "0 0 22px" }}>
              First word goes to the list when the roster and mint details open.
            </p>
            <button className="hm-btn" onClick={onClose}>
              BACK TO CAMP
            </button>
          </div>
        ) : (
          <>
            <em
              className="hm-mono"
              style={{ fontSize: ".52rem", letterSpacing: ".2em", color: "#7fa6bd", fontStyle: "normal" }}
            >
              EARLY ACCESS
            </em>
            <h2 style={{ marginTop: 10 }}>JOIN THE LIST</h2>
            <p style={{ margin: 0, color: "rgba(239,230,210,.65)", fontSize: "1.15rem" }}>
              Be first to hear when {BRAND.name} opens its roster.
            </p>

            <p className="hm-count" style={{ marginTop: 20 }}>Your email</p>
            <input
              className="hm-in"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isEmail(email) && submit()}
            />
            {email && !isEmail(email) && <p className="hm-err">Needs a valid email address.</p>}

            <p className="hm-count" style={{ marginTop: 14 }}>X handle (optional)</p>
            <input
              className="hm-in"
              type="text"
              placeholder="@yourhandle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isEmail(email) && submit()}
            />

            {err && <p className="hm-err">{err}</p>}

            <button className="hm-btn hm-submit" onClick={submit} disabled={!isEmail(email) || sending}>
              {sending ? "SENDING..." : "JOIN THE LIST"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
