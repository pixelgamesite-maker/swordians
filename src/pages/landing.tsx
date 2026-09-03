import { useCallback, useEffect, useRef, useState } from "react";
import CRTFrame from "../components/retro/CRTFrame";
import DialogueBox, { type Choice } from "../components/retro/DialogueBox";
import { FONT_LINK, RETRO_CSS } from "../components/retro/theme";
import { useAudio } from "../audio/AudioProvider";
import { signInWithX } from "../hooks/useSession";

/* ── Assets in /public ── */
const PLATE = "/landing.png";

const SPEAKER = "The Swoldier Order";
const OPENING = "YOU HAVE BEEN CHOSEN. ACCEPT QUEST?";

/* The Order does not take no for an answer. */
const REFUSALS = [
  "THE BLADE HAS ALREADY NAMED YOU. ACCEPT QUEST?",
  "REFUSE AGAIN AND THE REALM BURNS WITHOUT YOU. ACCEPT QUEST?",
  "NO IS NO LONGER ON THE TABLE, WANDERER.",
];

type Phase = "boot" | "quest" | "accepted" | "connecting";

export default function Landing() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [refusals, setRefusals] = useState(0);
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState("");
  const { muted, start: startMusic, toggleMute } = useAudio();
  const acted = useRef(false);

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

  const start = useCallback(() => {
    if (phase !== "boot") return;
    setPhase("quest");
    startMusic();
  }, [phase, startMusic]);

  /* Press any key or tap to start. "click" is what iOS honours for audio. */
  useEffect(() => {
    if (phase !== "boot") return;
    window.addEventListener("keydown", start);
    window.addEventListener("click", start);
    return () => {
      window.removeEventListener("keydown", start);
      window.removeEventListener("click", start);
    };
  }, [phase, start]);

  async function choose(kind: Choice["kind"]) {
    if (kind === "no") {
      setRefusals((n) => Math.min(n + 1, REFUSALS.length));
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }
    if (acted.current) return;
    acted.current = true;
    setPhase("accepted");

    /* Let the sword stroke play, then hand off to X for auth. */
    window.setTimeout(async () => {
      setPhase("connecting");
      try {
        await signInWithX("/hub");
      } catch (e) {
        console.error(e);
        setErr("COULD NOT REACH X. TAP TO RETRY.");
        acted.current = false;
        setPhase("quest");
      }
    }, 1000);
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
        {phase !== "boot" && (
          <button className="sw-sound" onClick={toggleMute}>
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
        )}

        {/* Boot curtain */}
        <div className="sw-curtain" data-open={phase === "boot"}>
          <p className="sw-kicker">A quest begins</p>
          <h1 className="sw-title">
            SWOL<b>DIERS</b>
          </h1>
          <div className="sw-blade" />
          <button className="sw-start" onClick={start}>
            ▶ PRESS START
          </button>
          <p className="sw-legal">Headphones recommended</p>
          {err && <p className="sw-legal" style={{ color: "#e0776e" }}>{err}</p>}
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

        {phase === "connecting" && (
          <div className="sw-connect">
            <p>OPENING THE GATE...</p>
            <small>REDIRECTING TO X</small>
          </div>
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
