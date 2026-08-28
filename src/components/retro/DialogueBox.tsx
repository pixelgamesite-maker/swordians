import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../../hooks/useTypewriter";

export type Choice = { label: string; kind: "yes" | "no"; disabled?: boolean };

type Props = {
  speaker: string;
  line: string;
  choices: Choice[];
  active: boolean;
  shake?: boolean;
  onChoose: (kind: Choice["kind"]) => void;
};

export default function DialogueBox({
  speaker,
  line,
  choices,
  active,
  shake = false,
  onChoose,
}: Props) {
  const { shown, done, skip } = useTypewriter(line, active);
  const [sel, setSel] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const firstOpen = Math.max(0, choices.findIndex((c) => !c.disabled));

  useEffect(() => setSel(firstOpen), [line, firstOpen]);

  useEffect(() => {
    if (done) btns.current[sel]?.focus({ preventScroll: true });
  }, [done, sel]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (!done) {
        if (["Enter", " ", "Escape"].includes(e.key)) {
          e.preventDefault();
          skip();
        }
        return;
      }
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Tab"].includes(e.key)) {
        e.preventDefault();
        const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
        setSel((i) => {
          for (let n = 1; n <= choices.length; n++) {
            const next = (i + step * n + choices.length * n) % choices.length;
            if (!choices[next].disabled) return next;
          }
          return i;
        });
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const c = choices[sel];
        if (c && !c.disabled) onChoose(c.kind);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, done, sel, choices, skip, onChoose]);

  return (
    <div className="sw-stage">
      <div className="sw-box" data-shake={shake} onClick={() => !done && skip()}>
        <p className="sw-speaker">{speaker}</p>
        <p className="sw-line" aria-live="polite">
          {shown}
          {!done && <span className="sw-caret">█</span>}
        </p>

        {done && (
          <>
            <div className="sw-choices" role="group" aria-label="Accept the quest">
              {choices.map((c, i) => (
                <button
                  key={c.label}
                  ref={(el) => {
                    btns.current[i] = el;
                  }}
                  className="sw-choice"
                  data-kind={c.kind}
                  data-sel={i === sel}
                  disabled={c.disabled}
                  onMouseEnter={() => !c.disabled && setSel(i)}
                  onClick={() => onChoose(c.kind)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="sw-hint">← → to choose · Enter to confirm</p>
          </>
        )}
      </div>
    </div>
  );
}
