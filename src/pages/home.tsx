import { useEffect, useRef, useState, type ReactNode } from "react";
import QuestModal from "../components/site/QuestModal";
import { FONT_LINK, HOME_CSS } from "../components/retro/theme";
import {
  BRAND, CLASSES, FAQS, GALLERY, HUD, OPENSEA_URL,
  ROADMAP, SYSTEMS, TRAITS, X_URL,
} from "../content";

/* ── Reveal a panel once it scrolls into view ── */
function Panel({
  tab, children, id,
}: { tab: string; children: ReactNode; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), obs.disconnect()),
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className="hm-sec" data-in={seen}>
      <div className="hm-wrap">
        <span className="hm-tab">{tab}</span>
        {children}
      </div>
    </section>
  );
}

/* ── Auto-advancing portrait frame ── */
function Gallery() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setFade(true);
      window.setTimeout(() => {
        setI((n) => (n + 1) % GALLERY.length);
        setFade(false);
      }, 240);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [i]);

  return (
    <div className="hm-gal">
      <div className="hm-frame">
        <img src={GALLERY[i]} alt="" style={{ opacity: fade ? 0 : 1 }} />
      </div>
      <div className="hm-dots">
        {GALLERY.map((_, n) => (
          <button
            key={n}
            data-on={n === i}
            aria-label={`Show character ${n + 1}`}
            onClick={() => setI(n)}
          />
        ))}
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hm-faq">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <i>{open ? "−" : "+"}</i>
      </button>
      {open && <p>{a}</p>}
    </div>
  );
}

const Rule = () => <div className="hm-divider" />;

/* ══════════════════════════════ PAGE ══════════════════════════════ */

export default function Home() {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_LINK;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <div className="hm-root">
      <style>{HOME_CSS}</style>

      {/* ── Header ── */}
      <header className="hm-head">
        <a className="hm-brand" href="#top">
          <img src={BRAND.logo} alt="" />
          <span>{BRAND.name}</span>
        </a>
        <nav className="hm-nav">
          <a href="#minolist">LIST</a>
          <a href="#mint">MINT</a>
          <a className="hm-x" href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow on X">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="hm-hero" id="top">
        <span className="hm-badge">{BRAND.supply} ON {BRAND.chain.toUpperCase()}</span>
        <h1 className="hm-title">
          {BRAND.name.slice(0, 5)}
          <b>{BRAND.name.slice(5)}</b>
        </h1>
        <div className="hm-rule" />
        <p className="hm-tag">{BRAND.tagline}</p>

        <div className="hm-cta">
          <button className="hm-btn" onClick={() => setModal(true)}>
            JOIN {BRAND.list.toUpperCase()}
          </button>
          <a className="hm-btn hm-btn--ghost" href="#mint">
            VIEW MINT
          </a>
        </div>

        <div className="hm-hud">
          {HUD.map(([v, l]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Collection ── */}
      <Panel tab="THE COLLECTION">
        <h2 className="hm-h2">MEET THE ROSTER</h2>
        <p className="hm-p">
          {BRAND.supply} pixel characters built on simple art and traits you can read
          at a glance.
        </p>
        <Gallery />
      </Panel>

      <Rule />

      {/* ── Traits ── */}
      <Panel tab="TRAITS">
        <h2 className="hm-h2">BUILT DIFFERENT</h2>
        <p className="hm-p">
          Every character is mixed from outfits, hair, moods, colors, accessories,
          and rare details.
        </p>
        <div className="hm-grid2">
          {TRAITS.map((t) => (
            <div className="hm-cell" key={t}>
              <i />
              <span>{t}</span>
            </div>
          ))}
        </div>
        <p className="hm-p" style={{ margin: "26px 0 0" }}>
          Some traits are simple. Some are rare. Some make a character land the
          second you see it.
        </p>
      </Panel>

      <Rule />

      {/* ── Classes ── */}
      <Panel tab="CLASSES">
        <h2 className="hm-h2">EVERY ONE HAS A CLASS</h2>
        <div className="hm-roster">
          {CLASSES.map((c, i) => (
            <div className="hm-unit" key={c.name}>
              <img src={c.art} alt="" />
              <div style={{ flex: 1 }}>
                <h3>{c.name.toUpperCase()}</h3>
                <p>{c.desc}</p>
              </div>
              <span className="hm-rank">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Rule />

      {/* ── List CTA ── */}
      <section id="minolist" className="hm-band">
        <div className="hm-wrap">
          <span className="hm-tab">ACCESS</span>
          <h2 className="hm-h2">JOIN {BRAND.list.toUpperCase()}</h2>
          <p className="hm-p">
            This is the only mint access phase. Clear the missions, submit your
            wallet, and wait for selection. Selected wallets mint on {BRAND.venue}.
          </p>
          <button className="hm-btn" onClick={() => setModal(true)}>
            CLAIM YOUR SPOT
          </button>
        </div>
      </section>

      <Rule />

      {/* ── Mint ── */}
      <Panel tab="THE MINT" id="mint">
        <h2 className="hm-h2">ONE PHASE. ONE MINT.</h2>
        <p className="hm-p">{BRAND.list} is the mint.</p>
        <div className="hm-hud" style={{ margin: "0 0 24px", width: "100%" }}>
          {HUD.map(([v, l]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <a className="hm-btn" href={OPENSEA_URL} target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
          <img src="/OpenSea-Emblem.png" alt="" />
          VIEW ON OPENSEA
        </a>
      </Panel>

      <Rule />

      {/* ── Reserve ── */}
      <Panel tab="RESERVE">
        <h2 className="hm-h2">THE MINO RESERVE</h2>
        <p className="hm-p" style={{ margin: 0 }}>
          A small allocation held back for collabs, rewards, partnerships, and
          community support. Not a public mint phase.
        </p>
      </Panel>

      <Rule />

      {/* ── Token ── */}
      <Panel tab="TOKEN">
        <h2 className="hm-h2" style={{ fontSize: "clamp(1.6rem,8vw,3rem)" }}>
          {BRAND.token}
        </h2>
        <p className="hm-p" style={{ margin: 0 }}>
          The energy behind the world. Planned to power holder systems, games,
          upgrades, raffles, burns, and events. Full details after mint.
        </p>
      </Panel>

      <Rule />

      {/* ── Systems ── */}
      <Panel tab="SYSTEMS">
        <h2 className="hm-h2">THE SYSTEMS</h2>
        <div className="hm-roster">
          {SYSTEMS.map((s) => (
            <div className="hm-unit" key={s.name}>
              <div style={{ flex: 1 }}>
                <h3>{s.name.toUpperCase()}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Rule />

      {/* ── Roadmap: the only real sequence on the page ── */}
      <Panel tab="QUEST LOG">
        <h2 className="hm-h2">WHAT COMES AFTER MINT</h2>
        <div className="hm-log">
          {ROADMAP.map((r) => (
            <div className="hm-step" key={r.phase}>
              <div className="hm-node" />
              <div>
                <em>{r.phase.toUpperCase()}</em>
                <h3>{r.title.toUpperCase()}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Rule />

      {/* ── FAQ ── */}
      <Panel tab="FAQ">
        <h2 className="hm-h2">QUESTIONS</h2>
        <div>
          {FAQS.map((f) => (
            <Faq key={f.q} {...f} />
          ))}
        </div>
      </Panel>

      {/* ── Footer ── */}
      <footer className="hm-foot">
        <img src={BRAND.logo} alt="" />
        <h3>{BRAND.name}</h3>
        <p>
          {BRAND.tagline}
          <br />
          {BRAND.supply} on {BRAND.chain}. Powered by {BRAND.token}.
        </p>
        <div className="hm-links">
          <a href={X_URL} target="_blank" rel="noopener noreferrer">X</a>
          <a href={OPENSEA_URL} target="_blank" rel="noopener noreferrer">OPENSEA</a>
          <a href="#minolist">LIST</a>
          <a href="#mint">MINT</a>
        </div>
        <p className="hm-sign">THE MINOVERSE OPENS SOON</p>
      </footer>

      {modal && <QuestModal onClose={() => setModal(false)} />}
    </div>
  );
}
