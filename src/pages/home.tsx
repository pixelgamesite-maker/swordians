import { useEffect, useRef, useState, type ReactNode } from "react";
import WaitlistModal from "./components/site/WaitlistModal";
import { FONT_LINK, HOME_CSS } from "./components/retro/theme";
import { BRAND, FAQS, LORE, PATH, STATUS, VISION, X_URL } from "./content";

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
          <a href="#vision">VISION</a>
          <a href="#path">PATH</a>
          {X_URL && (
            <a className="hm-x" href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow on X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
            </a>
          )}
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="hm-hero" id="top">
        <span className="hm-badge">UNANNOUNCED · PRE-MINT</span>
        <h1 className="hm-title">
          {BRAND.name.slice(0, 5)}
          <b>{BRAND.name.slice(5)}</b>
        </h1>
        <div className="hm-rule" />
        <p className="hm-tag">{BRAND.tagline}</p>

        <div className="hm-cta">
          <button className="hm-btn" onClick={() => setModal(true)}>
            JOIN THE LIST
          </button>
          <a className="hm-btn hm-btn--ghost" href="#vision">
            SEE THE VISION
          </a>
        </div>

        <div className="hm-hud">
          {STATUS.map(([v, l]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* ── Lore ── */}
      <Panel tab={LORE.eyebrow.toUpperCase()}>
        <h2 className="hm-h2">{LORE.title.toUpperCase()}</h2>
        {LORE.body.map((p, i) => (
          <p className="hm-p" key={i} style={{ margin: i === LORE.body.length - 1 ? 0 : "0 0 18px" }}>
            {p}
          </p>
        ))}
      </Panel>

      <Rule />

      {/* ── Vision ── */}
      <Panel tab="THE VISION" id="vision">
        <h2 className="hm-h2">WHAT WE'RE BUILDING TOWARD</h2>
        <p className="hm-p">
          None of this is live yet — this is the world the collection is being
          built for.
        </p>
        <div className="hm-roster">
          {VISION.map((s) => (
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

      {/* ── Path: an honest build status, not a hype countdown ── */}
      <Panel tab="THE PATH" id="path">
        <h2 className="hm-h2">WHERE THINGS STAND</h2>
        <div className="hm-log">
          {PATH.map((p) => (
            <div className="hm-step" key={p.title}>
              <div className="hm-node" />
              <div>
                <em>{p.stage.toUpperCase()}</em>
                <h3>{p.title.toUpperCase()}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Rule />

      {/* ── Join CTA ── */}
      <section className="hm-band">
        <div className="hm-wrap">
          <span className="hm-tab">EARLY ACCESS</span>
          <h2 className="hm-h2">HEAR IT FIRST</h2>
          <p className="hm-p">
            No mint date yet, no supply, no price — just the first word when
            the roster opens.
          </p>
          <button className="hm-btn" onClick={() => setModal(true)}>
            JOIN THE LIST
          </button>
        </div>
      </section>

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
        <p>{BRAND.tagline}</p>
        <div className="hm-links">
          {X_URL && (
            <a href={X_URL} target="_blank" rel="noopener noreferrer">X</a>
          )}
          <a href="#vision">VISION</a>
          <a href="#path">PATH</a>
        </div>
        <p className="hm-sign">MORE SOON</p>
      </footer>

      {modal && <WaitlistModal onClose={() => setModal(false)} />}
    </div>
  );
}
