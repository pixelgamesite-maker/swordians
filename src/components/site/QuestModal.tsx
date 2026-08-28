import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { PINNED_TWEET_URL } from "../../content";

const isEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());
const isUrl = (u: string) => {
  try {
    const { protocol } = new URL(u.trim());
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

/* ── One mission, one card ── */
function Card({
  icon,
  title,
  step,
  done,
  locked,
  onOpen,
  children,
}: {
  icon: string;
  title: string;
  step: string;
  done: boolean;
  locked: boolean;
  onOpen?: () => void;
  children: ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (done) setFlipped(true);
  }, [done]);

  return (
    <div className="hm-card" data-flip={flipped} data-lock={locked} data-done={done}>
      <div>
        <div
          className="hm-face hm-front"
          role="button"
          tabIndex={locked ? -1 : 0}
          onClick={() => {
            if (locked || flipped) return;
            setFlipped(true);
            onOpen?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !locked && !flipped) {
              setFlipped(true);
              onOpen?.();
            }
          }}
        >
          <i>{locked ? "🔒" : icon}</i>
          <b>{title}</b>
          <small>{locked ? "Locked" : "Open"}</small>
        </div>

        <div className="hm-face hm-back">
          {done && <span className="hm-tick">✔</span>}
          <h4>{title}</h4>
          <em>{step}</em>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function QuestModal({ onClose }: { onClose: () => void }) {
  const [handle, setHandle] = useState("");
  const [wallet, setWallet] = useState("");
  const [quote, setQuote] = useState("");
  const [liked, setLiked] = useState(false);
  const [okHandle, setOkHandle] = useState(false);
  const [okQuote, setOkQuote] = useState(false);
  const [okWallet, setOkWallet] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState("");

  /* Restore a half-finished application */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mn_v3");
      if (raw) {
        const p = JSON.parse(raw);
        setHandle(p.twitter ?? "");
        setWallet(p.wallet ?? "");
        setQuote(p.quoteUrl ?? "");
        setLiked(!!p.liked);
      }
      if (localStorage.getItem("mn_submitted") === "true") setAlready(true);
    } catch {
      /* storage unavailable — the form still works, it just won't remember */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "mn_v3",
        JSON.stringify({ twitter: handle, wallet, quoteUrl: quote, liked })
      );
    } catch {
      /* ignore */
    }
  }, [handle, wallet, quote, liked]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const m1 = okHandle && handle.trim().length > 1;
  const m2 = liked;
  const m3 = okQuote && isUrl(quote);
  const m4 = okWallet && isEvm(wallet);
  const cleared = [m1, m2, m3, m4].filter(Boolean).length;
  const allDone = cleared === 4;

  async function submit() {
    if (!allDone || already) return;
    setErr("");
    setSending(true);
    const { error } = await supabase.from("minions").insert([
      {
        wallet: wallet.trim(),
        twitter: handle.trim(),
        quote_url: quote.trim(),
      },
    ]);
    setSending(false);
    if (error) {
      setErr("The scroll didn't send. Check your connection and try again.");
      return;
    }
    setSent(true);
    setAlready(true);
    try {
      localStorage.setItem("mn_submitted", "true");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="hm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hm-modal" role="dialog" aria-modal="true" aria-label="MinoList application">
        <button className="hm-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {already || sent ? (
          <div className="hm-done">
            <div className="hm-seal">✔</div>
            <h2>{sent ? "APPLICATION SENT" : "ALREADY APPLIED"}</h2>
            <p className="hm-p" style={{ margin: "0 0 22px" }}>
              Your wallet is on the scroll. Selected wallets are added before mint.
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
              MINOLIST APPLICATION
            </em>
            <h2 style={{ marginTop: 10 }}>CLAIM YOUR SPOT</h2>
            <p style={{ margin: 0, color: "rgba(239,230,210,.65)", fontSize: "1.15rem" }}>
              Clear four missions, then submit your wallet for review.
            </p>

            <div className="hm-bar">
              <i style={{ width: `${(cleared / 4) * 100}%` }} />
            </div>
            <p className="hm-count">{cleared} of 4 missions cleared</p>

            <div className="hm-cards">
              {/* 01 — identity */}
              <Card icon="𝕏" title="WHO ARE YOU" step="Mission 01" done={m1} locked={false}>
                <p>Your X handle.</p>
                <input
                  className="hm-in"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setOkHandle(true)}
                />
                {m1 ? (
                  <p className="hm-ok">Identity confirmed</p>
                ) : (
                  handle.trim().length > 1 && (
                    <button className="hm-mini" onClick={() => setOkHandle(true)}>
                      CONFIRM
                    </button>
                  )
                )}
              </Card>

              {/* 02 — like + tag */}
              <Card
                icon="♥"
                title="LIKE & TAG 2"
                step="Mission 02"
                done={m2}
                locked={!m1}
                onOpen={() => {
                  window.open(PINNED_TWEET_URL, "_blank", "noopener");
                  window.setTimeout(() => setLiked(true), 900);
                }}
              >
                <p>
                  {m2
                    ? "Like and tags confirmed."
                    : "Like the pinned post and tag 2 friends in the comments."}
                </p>
                {m2 && <p className="hm-ok">Mission cleared</p>}
              </Card>

              {/* 03 — quote */}
              <Card
                icon="↗"
                title="QUOTE THE POST"
                step="Mission 03"
                done={m3}
                locked={!m2}
                onOpen={() => window.open(PINNED_TWEET_URL, "_blank", "noopener")}
              >
                {m3 ? (
                  <p className="hm-ok">Quote verified</p>
                ) : (
                  <>
                    <p>Quote the pinned post with "MINIONS", tag 2 friends, paste the link.</p>
                    <input
                      className="hm-in"
                      placeholder="https://x.com/..."
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && isUrl(quote) && setOkQuote(true)}
                    />
                    {quote && !isUrl(quote) && (
                      <p className="hm-err">That link needs to start with https://</p>
                    )}
                    {isUrl(quote) && (
                      <button className="hm-mini" onClick={() => setOkQuote(true)}>
                        VERIFY LINK
                      </button>
                    )}
                  </>
                )}
              </Card>

              {/* 04 — wallet */}
              <Card icon="◈" title="CLAIM WALLET" step="Mission 04" done={m4} locked={!m3}>
                <p>Your EVM address.</p>
                <input
                  className="hm-in"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && isEvm(wallet) && setOkWallet(true)}
                />
                {wallet && !isEvm(wallet) && (
                  <p className="hm-err">An EVM address is 0x followed by 40 characters.</p>
                )}
                {m4 ? (
                  <p className="hm-ok">Wallet confirmed</p>
                ) : (
                  isEvm(wallet) && (
                    <button className="hm-mini" onClick={() => setOkWallet(true)}>
                      CONFIRM WALLET
                    </button>
                  )
                )}
                <p className="hm-note">Never share private keys or seed phrases.</p>
              </Card>
            </div>

            {err && <p className="hm-err">{err}</p>}

            <button className="hm-btn hm-submit" onClick={submit} disabled={!allDone || sending}>
              {sending ? "SENDING..." : allDone ? "JOIN THE MINOLIST" : "CLEAR ALL 4 MISSIONS"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
