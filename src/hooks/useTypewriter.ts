import { useCallback, useEffect, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Types `text` out one character at a time while `active` is true. */
export function useTypewriter(text: string, active: boolean, speed = 38) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(reduced() ? text.length : 0);
  }, [text]);

  useEffect(() => {
    if (!active || count >= text.length) return;
    const id = window.setTimeout(() => setCount((n) => n + 1), speed);
    return () => window.clearTimeout(id);
  }, [active, count, text, speed]);

  const skip = useCallback(() => setCount(text.length), [text]);

  return { shown: text.slice(0, count), done: count >= text.length, skip };
}
