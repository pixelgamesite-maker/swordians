import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { signOut } from "../../hooks/useAuth";
import { GUIDE, LEADERBOARD_TABLE, RUNS_TABLE, WALLETS_TABLE, referralLink } from "../../content";

const isEvm = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v.trim());
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

type Profile = { total_points: number; ref_code: string | null; ref_count: number };

function GuideItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pm-guide-item">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <i>{open ? "−" : "+"}</i>
      </button>
      {open && <p>{a}</p>}
    </div>
  );
}

export default function ProfileMenu({ session, onSignedOut }: { session: Session; onSignedOut: () => void }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletInput, setWalletInput] = useState("");
  const [binding, setBinding] = useState(false);
  const [bindErr, setBindErr] = useState("");
  const [copied, setCopied] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const handle = session.user.user_metadata?.user_name ?? session.user.user_metadata?.preferred_username ?? null;
  const avatar = session.user.user_metadata?.avatar_url;

  /* Close on outside click or Escape — standard dropdown behavior. */
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Fetch everything once the panel first opens, not on every render. */
  useEffect(() => {
    if (!open || profile) return;
    const uid = session.user.id;

    supabase.from(LEADERBOARD_TABLE).select("total_points, ref_code, ref_count").eq("x_id", uid).maybeSingle()
      .then(({ data }) => setProfile(data ?? { total_points: 0, ref_code: null, ref_count: 0 }))
      .catch(() => setProfile({ total_points: 0, ref_code: null, ref_count: 0 }));

    supabase.from(RUNS_TABLE).select("score").eq("x_id", uid).order("score", { ascending: false }).limit(1)
      .then(({ data }) => setBest(data?.[0]?.score ?? 0))
      .catch(() => setBest(0));

    supabase.from(WALLETS_TABLE).select("wallet").eq("x_id", uid).maybeSingle()
      .then(({ data }) => setWallet(data?.wallet ?? null))
      .catch(() => setWallet(null));
  }, [open, profile, session.user.id]);

  async function copyLink() {
    if (!profile?.ref_code) return;
    try {
      await navigator.clipboard.writeText(referralLink(profile.ref_code));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the input itself is still selectable */
    }
  }

  async function bind() {
    if (!isEvm(walletInput) || binding) return;
    setBindErr("");
    setBinding(true);
    const { error } = await supabase.rpc("bind_wallet", { p_wallet: walletInput.trim() });
    setBinding(false);
    if (error) {
      setBindErr(error.message.includes("already bound") ? "Already bound — can't be changed here." : "That didn't go through. Try again.");
      return;
    }
    setWallet(walletInput.trim().toLowerCase());
  }

  return (
    <div style={{ position: "relative" }} ref={panelRef}>
      <button className="pm-trigger" data-open={open} onClick={() => setOpen((o) => !o)}>
        {avatar && <img src={avatar} alt="" />}
        <b>{handle ? `@${handle}` : "SOLDIER"}</b>
        <span className="pm-caret">▾</span>
      </button>

      {open && (
        <div className="pm-panel">
          {/* Stats */}
          <div className="pm-section">
            <p className="pm-label">STATS</p>
            <div className="pm-stats">
              <div className="pm-stat">
                <b>{(best ?? 0).toLocaleString()}</b>
                <span>Best</span>
              </div>
              <div className="pm-stat">
                <b>{(profile?.total_points ?? 0).toLocaleString()}</b>
                <span>Total</span>
              </div>
              <div className="pm-stat">
                <b>{profile?.ref_count ?? 0}</b>
                <span>Referred</span>
              </div>
            </div>
          </div>

          {/* Referral link */}
          <div className="pm-section">
            <p className="pm-label">YOUR REFERRAL LINK</p>
            {profile?.ref_code ? (
              <div className="pm-ref-row">
                <input readOnly value={referralLink(profile.ref_code)} onFocus={(e) => e.target.select()} />
                <button className="pm-copy" data-copied={copied} onClick={copyLink}>
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            ) : (
              <p className="pm-hint">Loading your link...</p>
            )}
          </div>

          {/* Wallet */}
          <div className="pm-section">
            <p className="pm-label">WALLET</p>
            {wallet ? (
              <div className="pm-wallet-bound">
                <b>{short(wallet)}</b>
                <span className="pm-locked">BOUND</span>
              </div>
            ) : (
              <>
                <input
                  className="pm-in"
                  placeholder="0x..."
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && isEvm(walletInput) && bind()}
                />
                <button className="pm-bind" disabled={!isEvm(walletInput) || binding} onClick={bind}>
                  {binding ? "BINDING..." : "BIND WALLET"}
                </button>
                {bindErr && <p className="pm-warn">{bindErr}</p>}
                <p className="pm-hint">This can only be set once — double-check it before binding.</p>
              </>
            )}
          </div>

          {/* Guide */}
          <div className="pm-section">
            <p className="pm-label">HOW THIS WORKS</p>
            {GUIDE.map((g) => (
              <GuideItem key={g.q} {...g} />
            ))}
          </div>

          <div className="pm-section">
            <button className="pm-signout" onClick={() => signOut().then(onSignedOut)}>
              EXIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
