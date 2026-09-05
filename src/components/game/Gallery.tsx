import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { SCORING, PICKUPS, ENVIRONMENTS } from "../../content";

/* ─────────────────────────────────────────────────────────────
   TUNING — everything that decides how the game feels.
   ───────────────────────────────────────────────────────────── */
const GRAVITY = 1650;
const APEX_RATIO = 0.62;
const APEX_JITTER = 0.16;
const HIT_LINGER = 420;
const FLASH_MS = 90;

function difficulty(t: number) {
  const p = Math.min(1, t / 75);
  return {
    spawnEvery: 1250 - 780 * p,
    maxAlive: Math.round(2 + 4 * p),
    civilianChance: 0.22 + 0.16 * p,
    speed: 1 + 0.28 * p,
  };
}

type Kind = "enemyA" | "enemyB" | "civilian" | "health" | "freeze" | "grenade";
type Target = {
  id: number;
  kind: Kind;
  sprite: string;
  x: number; y: number;
  vx: number; vy: number;
  rot: number; spin: number;
  size: number;
  hit: boolean;
  hitAt: number;
};

type Phase = "ready" | "playing" | "over";

const ENEMY_A_SPRITE = "/enemy-1.png";  // 20 pts
const ENEMY_B_SPRITE = "/enemy-2.png";  // 10 pts
const CIV_SPRITES = ["/civilian-1.png", "/civilian-2.png"];
const PICKUP_SPRITE: Record<"health" | "freeze" | "grenade", string> = {
  health: "/health-pack.png",
  freeze: "/freez.png",
  grenade: "/grenade.png",
};

/** Weighted pick across everything that can spawn this frame. */
function pickKind(t: number): Kind {
  const d = difficulty(t);
  const roll = Math.random();
  let acc = 0;

  acc += d.civilianChance;
  if (roll < acc) return "civilian";

  acc += PICKUPS.healthChance;
  if (roll < acc) return "health";

  acc += PICKUPS.freezeChance;
  if (roll < acc) return "freeze";

  acc += PICKUPS.grenadeChance;
  if (roll < acc) return "grenade";

  // Remainder splits between the two enemy tiers, weighted toward
  // the cheaper one so 20-pt hits feel earned rather than routine.
  const remainder = Math.max(0, 1 - acc);
  const enemyARatio = 0.4;
  return roll < acc + remainder * enemyARatio ? "enemyA" : "enemyB";
}

function spriteFor(kind: Kind): string {
  switch (kind) {
    case "enemyA": return ENEMY_A_SPRITE;
    case "enemyB": return ENEMY_B_SPRITE;
    case "civilian": return CIV_SPRITES[Math.floor(Math.random() * CIV_SPRITES.length)];
    case "health": return PICKUP_SPRITE.health;
    case "freeze": return PICKUP_SPRITE.freeze;
    case "grenade": return PICKUP_SPRITE.grenade;
  }
}

function currentEnvIndex(score: number) {
  let idx = 0;
  for (let i = 0; i < ENVIRONMENTS.length; i++) {
    if (score >= ENVIRONMENTS[i].threshold) idx = i;
  }
  return idx;
}

export default function Gallery({
  onFinish,
}: {
  onFinish?: (r: { score: number; civilians: number; seconds: number }) => void;
}) {
  const { playShot } = useAudio();

  const arena = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const nextSpawn = useRef(0);
  const elapsed = useRef(0);
  const nextId = useRef(1);
  const targets = useRef<Target[]>([]);
  const frozenUntil = useRef(0);

  const [, force] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [civilians, setCivilians] = useState(0);
  const [hearts, setHearts] = useState(SCORING.healthMax);
  const [recoil, setRecoil] = useState(false);
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [envIdx, setEnvIdx] = useState(0);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; text: string; bad: boolean }[]>([]);

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const civRef = useRef(0);
  const heartsRef = useRef(SCORING.healthMax);
  const phaseRef = useRef<Phase>("ready");
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  /* Arena background swaps as the live score crosses a threshold. */
  useEffect(() => {
    const idx = currentEnvIndex(score);
    if (idx !== envIdx) setEnvIdx(idx);
  }, [score, envIdx]);

  const spawn = useCallback(() => {
    const el = arena.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const d = difficulty(elapsed.current);

    const kind = pickKind(elapsed.current);
    const size = Math.max(64, Math.min(104, W * 0.17));
    const apex = H * (APEX_RATIO + (Math.random() - 0.5) * APEX_JITTER);
    const vy = -Math.sqrt(2 * GRAVITY * apex) * d.speed;
    const x = W * (0.12 + Math.random() * 0.76);
    const vx = ((W / 2 - x) / 1.6) * (0.5 + Math.random() * 0.7);

    targets.current.push({
      id: nextId.current++,
      kind,
      sprite: spriteFor(kind),
      x, y: H + size,
      vx, vy,
      rot: 0,
      spin: (Math.random() - 0.5) * 90,
      size,
      hit: false,
      hitAt: 0,
    });
  }, []);

  const endGame = useCallback(() => {
    if (phaseRef.current === "over") return;
    setPhase("over");
    cancelAnimationFrame(raf.current);
    onFinish?.({
      score: scoreRef.current,
      civilians: civRef.current,
      seconds: Math.round(elapsed.current),
    });
  }, [onFinish]);

  /* ── Main loop ── */
  useEffect(() => {
    if (phase !== "playing") return;
    last.current = performance.now();

    function tick(now: number) {
      const isFrozen = now < frozenUntil.current;
      if (isFrozen !== frozen) setFrozen(isFrozen);

      const dt = isFrozen ? 0 : Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      if (!isFrozen) elapsed.current += dt;

      const el = arena.current;
      if (!el) { raf.current = requestAnimationFrame(tick); return; }
      const H = el.clientHeight;
      const d = difficulty(elapsed.current);

      if (!isFrozen) {
        nextSpawn.current -= dt * 1000;
        const alive = targets.current.filter((t) => !t.hit).length;
        if (nextSpawn.current <= 0 && alive < d.maxAlive) {
          spawn();
          nextSpawn.current = d.spawnEvery * (0.75 + Math.random() * 0.5);
        }
      }

      const keep: Target[] = [];
      for (const t of targets.current) {
        if (t.hit) {
          if (now - t.hitAt < HIT_LINGER) {
            t.y += 340 * dt;
            t.rot += t.spin * 0.4 * dt;
            keep.push(t);
          }
          continue;
        }
        if (!isFrozen) {
          t.vy += GRAVITY * dt;
          t.x += t.vx * dt;
          t.y += t.vy * dt;
          t.rot += t.spin * dt;
        }
        if (t.y < H + t.size * 2) keep.push(t);
      }
      targets.current = keep;

      force((n) => n + 1);
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, spawn]);

  function addPopup(x: number, y: number, text: string, bad: boolean) {
    const id = nextId.current++;
    setPopups((p) => [...p, { id, x, y, text, bad }]);
    window.setTimeout(() => setPopups((p) => p.filter((q) => q.id !== id)), 700);
  }

  function fire() {
    playShot();
    setRecoil(true);
    setFlash(true);
    window.setTimeout(() => setRecoil(false), 110);
    window.setTimeout(() => setFlash(false), FLASH_MS);
  }

  function loseHeart() {
    const next = Math.max(0, heartsRef.current - SCORING.civilianHeartCost);
    heartsRef.current = next;
    setHearts(next);
    if (next <= 0) endGame();
  }

  function gainHeart() {
    const next = Math.min(SCORING.healthMax, heartsRef.current + 1);
    heartsRef.current = next;
    setHearts(next);
  }

  function addScore(n: number) {
    scoreRef.current = Math.max(0, scoreRef.current + n);
    setScore(scoreRef.current);
  }

  function shootTarget(t: Target, e: React.PointerEvent) {
    e.stopPropagation();
    if (phaseRef.current !== "playing" || t.hit) return;
    fire();
    t.hit = true;
    t.hitAt = performance.now();

    if (t.kind === "enemyA" || t.kind === "enemyB") {
      const base = t.kind === "enemyA" ? SCORING.enemyA : SCORING.enemyB;
      const c = comboRef.current + 1;
      comboRef.current = c;
      setCombo(c);
      const bonus = Math.min(SCORING.comboCap, (c - 1) * SCORING.comboStep);
      const gained = base + bonus;
      addScore(gained);
      addPopup(t.x, t.y, `+${gained}`, false);
    } else if (t.kind === "civilian") {
      comboRef.current = 0;
      setCombo(0);
      addScore(SCORING.civilianHit);
      civRef.current += 1;
      setCivilians(civRef.current);
      addPopup(t.x, t.y, "CIVILIAN", true);
      setShake(true);
      window.setTimeout(() => setShake(false), 260);
      loseHeart();
    } else if (t.kind === "health") {
      gainHeart();
      addPopup(t.x, t.y, "+1 HP", false);
    } else if (t.kind === "freeze") {
      frozenUntil.current = performance.now() + PICKUPS.freezeMs;
      addPopup(t.x, t.y, "FROZEN", false);
    } else if (t.kind === "grenade") {
      addPopup(t.x, t.y, "BOOM", false);
      setShake(true);
      window.setTimeout(() => setShake(false), 300);
      // Clears every live enemy/civilian on screen. Enemies still pay
      // out, civilians still cost — see the note in the reply about
      // this assumption.
      let civHitThisBlast = 0;
      for (const other of targets.current) {
        if (other.hit || other.id === t.id) continue;
        if (other.kind === "enemyA" || other.kind === "enemyB") {
          other.hit = true;
          other.hitAt = performance.now();
          addScore(other.kind === "enemyA" ? SCORING.enemyA : SCORING.enemyB);
        } else if (other.kind === "civilian") {
          other.hit = true;
          other.hitAt = performance.now();
          addScore(SCORING.civilianHit);
          civHitThisBlast += 1;
        }
      }
      if (civHitThisBlast > 0) {
        civRef.current += civHitThisBlast;
        setCivilians(civRef.current);
        for (let i = 0; i < civHitThisBlast; i++) loseHeart();
      }
    }
  }

  function shootAir() {
    if (phaseRef.current !== "playing") return;
    fire();
    comboRef.current = 0;
    setCombo(0);
  }

  function begin() {
    targets.current = [];
    elapsed.current = 0;
    nextSpawn.current = 250;
    frozenUntil.current = 0;
    scoreRef.current = 0;
    comboRef.current = 0;
    civRef.current = 0;
    heartsRef.current = SCORING.healthMax;
    setScore(0); setCombo(0); setCivilians(0); setHearts(SCORING.healthMax);
    setPopups([]); setEnvIdx(0); setFrozen(false);
    setPhase("playing");
  }

  return (
    <div className="gm-root" data-shake={shake}>
      <style>{GAME_CSS}</style>

      {/* Environment layers, crossfaded by score threshold */}
      {ENVIRONMENTS.map((env, i) => (
        <img
          key={env.src}
          src={env.src}
          alt=""
          className="gm-env"
          style={{ opacity: i === envIdx ? 1 : 0 }}
        />
      ))}
      <div className="gm-env-shade" />

      <div className="gm-hud">
        <div className="gm-score">
          <span>SCORE</span>
          <b>{score}</b>
        </div>
        <div className="gm-hearts">
          {Array.from({ length: SCORING.healthMax }).map((_, i) => (
            <i key={i} data-lost={i >= hearts} />
          ))}
        </div>
      </div>

      {combo >= 3 && phase === "playing" && <div className="gm-combo">{combo}× CHAIN</div>}
      {frozen && phase === "playing" && <div className="gm-frozen-tag">FROZEN</div>}

      <div ref={arena} className="gm-arena" onPointerDown={shootAir} style={{ touchAction: "manipulation" }} data-frozen={frozen}>
        {targets.current.map((t) => (
          <img
            key={t.id}
            src={t.sprite}
            alt=""
            draggable={false}
            className="gm-target"
            data-hit={t.hit}
            data-kind={t.kind}
            onPointerDown={(e) => shootTarget(t, e)}
            style={{
              width: t.size,
              transform: `translate3d(${t.x - t.size / 2}px, ${t.y - t.size}px, 0) rotate(${t.rot}deg)`,
            }}
          />
        ))}

        {popups.map((p) => (
          <span key={p.id} className="gm-pop" data-bad={p.bad} style={{ transform: `translate3d(${p.x}px, ${p.y}px, 0)` }}>
            {p.text}
          </span>
        ))}

        {flash && <div className="gm-muzzle" />}

        <img src="/hand.png" alt="" draggable={false} className="gm-gun" data-recoil={recoil} />

        {phase === "ready" && (
          <div className="gm-overlay" onPointerDown={(e) => { e.stopPropagation(); begin(); }}>
            <p className="gm-big">TAP TO START</p>
            <p className="gm-sub">
              20 PTS / 10 PTS ENEMIES · SPARE CIVILIANS<br />
              {SCORING.healthMax} HEARTS · GRAB HEALTH, FREEZE &amp; GRENADE DROPS
            </p>
          </div>
        )}

        {phase === "over" && (
          <div className="gm-overlay" onPointerDown={(e) => e.stopPropagation()}>
            <p className="gm-big">RUN OVER</p>
            <p className="gm-final">{score}</p>
            <p className="gm-sub">ADDED TO YOUR TOTAL</p>
            <button className="gm-again" onPointerDown={(e) => { e.stopPropagation(); begin(); }}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const GAME_CSS = `
.gm-root{ position:relative; width:100%; height:100%; display:flex; flex-direction:column; overflow:hidden; }
.gm-root[data-shake="true"]{ animation:gm-shake .26s steps(2) 2; }
@keyframes gm-shake{ 0%{transform:translate(-5px,2px)} 50%{transform:translate(5px,-2px)} 100%{transform:none} }

.gm-env{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:opacity .8s ease; z-index:0; }
.gm-env-shade{
  position:absolute; inset:0; z-index:1; pointer-events:none;
  background:
    radial-gradient(ellipse 74% 64% at 50% 46%, transparent 0%, rgba(7,10,14,.5) 70%, rgba(7,10,14,.92) 100%),
    repeating-linear-gradient(180deg, rgba(0,0,0,.28) 0 1px, transparent 1px 3px);
}

.gm-hud{
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px; border-bottom:2px solid rgba(127,166,189,.3);
  background:rgba(7,10,14,.75); position:relative; z-index:5;
}
.gm-score span{ font-family:'Press Start 2P',monospace; font-size:.45rem; letter-spacing:.16em; color:#7fa6bd; display:block; margin-bottom:5px; }
.gm-score b{ font-family:'Press Start 2P',monospace; font-size:.95rem; color:#f0b429; font-weight:400; }
.gm-hearts{ display:flex; gap:6px; }
.gm-hearts i{ font-style:normal; width:16px; height:16px; }
.gm-hearts i::before{ content:"♥"; color:#8e2b24; font-size:1.1rem; line-height:1; }
.gm-hearts i[data-lost="true"]::before{ color:rgba(142,43,36,.25); }

.gm-combo{
  position:absolute; top:64px; left:50%; transform:translateX(-50%); z-index:6;
  font-family:'Press Start 2P',monospace; font-size:.6rem; color:#f0b429;
  text-shadow:2px 2px 0 #070a0e; animation:gm-pulse .5s ease-in-out infinite alternate;
}
@keyframes gm-pulse{ from{opacity:.7} to{opacity:1; transform:translateX(-50%) scale(1.06)} }

.gm-frozen-tag{
  position:absolute; top:64px; right:14px; z-index:6;
  font-family:'Press Start 2P',monospace; font-size:.5rem; letter-spacing:.1em;
  color:#7fa6bd; background:rgba(7,10,14,.7); border:2px solid #7fa6bd; padding:6px 9px;
  animation:gm-blink 1s steps(1) infinite;
}

.gm-arena{ position:relative; flex:1; overflow:hidden; cursor:crosshair; }
.gm-arena[data-frozen="true"]{ filter:saturate(.5) brightness(.9); }

.gm-target{
  position:absolute; top:0; left:0; will-change:transform; z-index:2;
  image-rendering:pixelated; user-select:none; cursor:crosshair;
  filter:drop-shadow(0 6px 10px rgba(0,0,0,.6));
}
.gm-target[data-hit="true"]{ opacity:.85; animation:gm-hit ${FLASH_MS * 2}ms steps(2); pointer-events:none; }
@keyframes gm-hit{ 0%{filter:brightness(0) invert(1)} 100%{filter:none} }

.gm-pop{
  position:absolute; top:0; left:0; z-index:7; pointer-events:none;
  font-family:'Press Start 2P',monospace; font-size:.55rem; color:#f0b429;
  text-shadow:2px 2px 0 #070a0e; animation:gm-rise .7s ease-out forwards;
}
.gm-pop[data-bad="true"]{ color:#e0776e; }
@keyframes gm-rise{ from{opacity:1} to{opacity:0; margin-top:-42px} }

.gm-gun{
  position:absolute; bottom:-6%; left:50%; width:min(58%,300px);
  transform:translateX(-50%); transform-origin:50% 100%;
  image-rendering:pixelated; pointer-events:none; z-index:4;
  filter:drop-shadow(0 -4px 14px rgba(0,0,0,.7));
  transition:transform .11s cubic-bezier(.2,.9,.2,1);
}
.gm-gun[data-recoil="true"]{ transform:translateX(-50%) translateY(16px) scale(1.04); }

.gm-muzzle{
  position:absolute; bottom:32%; left:50%; width:130px; height:130px; z-index:5;
  transform:translate(-50%,50%); pointer-events:none;
  background:radial-gradient(circle, rgba(255,240,190,.95) 0%, rgba(240,180,41,.6) 32%, transparent 68%);
}

.gm-overlay{
  position:absolute; inset:0; z-index:9; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; text-align:center; padding:24px;
  background:rgba(7,10,14,.88); cursor:pointer;
}
.gm-big{ font-family:'Press Start 2P',monospace; font-size:clamp(.9rem,4.6vw,1.5rem); color:#efe6d2; margin:0; animation:gm-blink 1.15s steps(1) infinite; }
@keyframes gm-blink{ 0%,55%{opacity:1} 56%,100%{opacity:.25} }
.gm-final{ font-family:'Press Start 2P',monospace; font-size:2rem; color:#f0b429; margin:0; }
.gm-sub{ font-family:'VT323',monospace; font-size:1.2rem; letter-spacing:.1em; color:rgba(239,230,210,.6); margin:0; line-height:1.7; }
.gm-again{
  margin-top:8px; font-family:'Press Start 2P',monospace; font-size:.62rem; letter-spacing:.1em;
  color:#070a0e; background:#f0b429; border:3px solid #070a0e; box-shadow:0 5px 0 #a87a12;
  padding:14px 24px; cursor:pointer;
}
`;
