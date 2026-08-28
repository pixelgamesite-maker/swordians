import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Path to the background plate, e.g. "/landing.png" */
  image: string;
  children: ReactNode;
};

/** Full-bleed pixel plate with darkened edges, scanlines and a slow CRT flicker. */
export default function CRTFrame({ image, children }: Props) {
  return (
    <div className="sw-root">
      <div
        className="sw-plate"
        style={{ "--plate": `url(${image})` } as CSSProperties}
        aria-hidden
      />
      <div className="sw-vignette" aria-hidden />
      <div className="sw-scanlines" aria-hidden />
      <div className="sw-flicker" aria-hidden />
      {children}
    </div>
  );
}
