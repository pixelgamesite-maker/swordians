import { useCallback, useEffect, useRef, useState } from "react";
import CRTFrame from "../components/retro/CRTFrame";
import DialogueBox, { type Choice } from "../components/retro/DialogueBox";
import { FONT_LINK, RETRO_CSS } from "../components/retro/theme";

/* ── Assets in /public ── */
const PLATE = "/landing.png";
const THEME = "/intro.mp3";

const SPEAKER = "The Swordian Order";
const OPENING = "YOU HAVE BEEN CHOSEN. ACCEPT QUEST?";

/* The Order does not take no for an answer. */
const REFUSALS = [
  "THE BLADE HAS ALREADY NAMED YOU. ACCEPT QUEST?",
  "REFUSE AGAIN AND THE REALM BURNS WITHOUT YOU. ACCEPT QUEST?",
  "NO IS NO LONGER ON THE TABLE, WANDERER.",
];

type Phase = "boot" | "quest" | "accepted";

export default function Landing({ onAccept }: { onAccept?: () => void }) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [refusals, setRefusals] = useState(0);
  const [shake, setShake] = useState(false);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const fadeId = useRef<number | undefined>(undefined);

  /* Fonts + stylesheet */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_LINK;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  /* Volume ramp, so the theme swells in instead of slapping you */
  const ramp = useCallback((to: number, ms: number) => {
    const el = audio.current;
    if (!el) return;
    window.clearInterval(fadeId.current);
    const from = el.volume;
    const started = performance.now();
    fadeId.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t === 1) window.clearInterval(fadeId.current);
    }, 40);
  }, []);

  const start = useCallback(() => {
    if (phase !== "boot") return;
    setPhase("quest");
    const el = audio.current;
    if (el) {
      el.volume = 0;
      el.play()
        .then(() => ramp(0.55, 1600))
        .catch((e) => console.warn("Intro audio blocked:", e));
    }
  }, [phase, ramp]);

  /* Press any key or tap to start — the only correct way to open a game.
     "click" (not "pointerdown"/"touchstart") is what iOS Safari actually
     honors as a valid gesture for starting audio playback. */
  useEffect(() => {
    if (phase !== "boot") return;
    window.addEventListener("keydown", start);
    window.addEventListener("click", start);
    return () => {
      window.removeEventListener("keydown", start);
      window.removeEventListener("click", start);
    };
  }, [phase, start]);

  useEffect(() => () => window.clearInterval(fadeId.current), []);

  function choose(kind: Choice["kind"]) {
    if (kind === "no") {
      setRefusals((n) => Math.min(n + 1, REFUSALS.length));
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }
    setPhase("accepted");
    ramp(0, 900);
    window.setTimeout(
      () => (onAccept ? onAccept() : window.location.assign("/home")),
      1150
    );
  }

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (audio.current) audio.current.muted = next;
  }

  const line = refusals === 0 ? OPENING : REFUSALS[refusals - 1];
  const choices: Choice[] = [
    { label: "YES", kind: "yes" },
    { label: "NO", kind: "no", disabled: refusals >= REFUSALS.length },
  ];

  return (
    <>
      <style>{RETRO_CSS}</style>

      <CRTFrame image={PLATE}>
        <audio ref={audio} src={THEME} loop preload="auto" />

        {phase !== "boot" && (
          <button className="sw-sound" onClick={toggleSound}>
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
        )}

        {/* Boot curtain */}
        <div className="sw-curtain" data-open={phase === "boot"}>
          <p className="sw-kicker">A quest begins</p>
          <h1 className="sw-title">
            SWORD<b>IANS</b>
          </h1>
          <div className="sw-blade" />
          <button className="sw-start" onClick={start}>
            ▶ PRESS START
          </button>
          <p className="sw-legal">Headphones recommended</p>
        </div>

        {/* Quest prompt */}
        {phase !== "boot" && (
          <DialogueBox
            speaker={SPEAKER}
            line={line}
            choices={choices}
            active={phase === "quest"}
            shake={shake}
            onChoose={choose}
          />
        )}

        {/* Accepted: one clean sword stroke, then black */}
        {phase === "accepted" && (
          <>
            <div className="sw-slash" />
            <div className="sw-fade" />
          </>
        )}
      </CRTFrame>
    </>
  );
}
