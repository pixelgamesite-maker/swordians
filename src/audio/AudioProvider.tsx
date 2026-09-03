import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from "react";

const MUSIC_SRC = "/intro.mp3";
const SHOT_SRC = "/gun.mp3";
const SHOT_POOL = 8;      // overlapping gunshots without cutting each other off
const MUSIC_VOL = 0.45;
const SHOT_VOL = 0.55;

type AudioCtx = {
  started: boolean;
  muted: boolean;
  start: () => void;
  toggleMute: () => void;
  playShot: () => void;
  duckMusic: (to: number, ms: number) => void;
};

const Ctx = createContext<AudioCtx | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/** Lives at the App root, so navigating between pages never unmounts the music. */
export function AudioProvider({ children }: { children: ReactNode }) {
  const music = useRef<HTMLAudioElement | null>(null);
  const shots = useRef<HTMLAudioElement[]>([]);
  const shotIdx = useRef(0);
  const fade = useRef<number | undefined>(undefined);

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem("sw_muted") === "true";
    } catch {
      return false;
    }
  });

  /* Build the elements once */
  useEffect(() => {
    const m = new Audio(MUSIC_SRC);
    m.loop = true;
    m.volume = 0;
    m.preload = "auto";
    music.current = m;

    shots.current = Array.from({ length: SHOT_POOL }, () => {
      const a = new Audio(SHOT_SRC);
      a.preload = "auto";
      a.volume = SHOT_VOL;
      return a;
    });

    return () => {
      m.pause();
      window.clearInterval(fade.current);
    };
  }, []);

  useEffect(() => {
    if (music.current) music.current.muted = muted;
    shots.current.forEach((s) => (s.muted = muted));
    try {
      localStorage.setItem("sw_muted", String(muted));
    } catch {
      /* ignore */
    }
  }, [muted]);

  const ramp = useCallback((to: number, ms: number) => {
    const el = music.current;
    if (!el) return;
    window.clearInterval(fade.current);
    const from = el.volume;
    const t0 = performance.now();
    fade.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t === 1) window.clearInterval(fade.current);
    }, 40);
  }, []);

  const start = useCallback(() => {
    const el = music.current;
    if (!el || started) return;
    el.volume = 0;
    el.play()
      .then(() => {
        setStarted(true);
        ramp(MUSIC_VOL, 1600);
      })
      .catch((e) => console.warn("Music blocked:", e));
  }, [started, ramp]);

  /* After an OAuth redirect the page reloads and autoplay is usually blocked.
     Retry on the very first interaction so music resumes without a extra click. */
  useEffect(() => {
    if (started) return;
    const resume = () => start();
    window.addEventListener("click", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [started, start]);

  const playShot = useCallback(() => {
    const pool = shots.current;
    if (!pool.length) return;
    const a = pool[shotIdx.current % pool.length];
    shotIdx.current++;
    try {
      a.currentTime = 0;
      void a.play();
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Ctx.Provider
      value={{
        started,
        muted,
        start,
        toggleMute: () => setMuted((m) => !m),
        playShot,
        duckMusic: ramp,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
