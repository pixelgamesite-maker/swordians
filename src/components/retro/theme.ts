/* ═══════════════════════════════════════════════════════════
   SWOLDIERS — retro design tokens
   Palette pulled straight from the pixel art:
   the beret-green field, the navy card background, the gold pin.
   ═══════════════════════════════════════════════════════════ */

export const C = {
  ink:    "#070a0e", // deepest black, CRT off-state
  navy:   "#1e2f3d", // portrait background
  steel:  "#7fa6bd", // cold highlight
  moss:   "#2f5c4a", // beret green
  gold:   "#f0b429", // the pin
  bone:   "#efe6d2", // body text
  blood:  "#8e2b24", // refusal
};

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";

export const display = "'Press Start 2P', 'Courier New', monospace";
export const body = "'VT323', 'Courier New', monospace";

/* One stylesheet for the whole intro. Class-based so hover,
   focus-visible and reduced-motion actually work. */
export const RETRO_CSS = `
.sw-root{
  --ink:${C.ink}; --navy:${C.navy}; --steel:${C.steel};
  --moss:${C.moss}; --gold:${C.gold}; --bone:${C.bone}; --blood:${C.blood};
  position:fixed; inset:0; overflow:hidden;
  background:var(--ink); color:var(--bone);
  font-family:${body};
  -webkit-font-smoothing:none;
  user-select:none;
}
.sw-root *{box-sizing:border-box;}

/* ── Background plate ───────────────────────────────────── */
.sw-plate{
  position:absolute; inset:-2%;
  background-image:var(--plate);
  background-size:cover; background-position:center;
  image-rendering:pixelated;
  transform:scale(1.04);
  animation:sw-drift 42s ease-in-out infinite alternate;
}
.sw-vignette{
  position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 78% 68% at 50% 46%, transparent 0%, rgba(7,10,14,.62) 62%, rgba(7,10,14,.96) 100%),
    linear-gradient(180deg, rgba(7,10,14,.85) 0%, transparent 26%, transparent 52%, rgba(7,10,14,.92) 100%);
}
.sw-scanlines{
  position:absolute; inset:0; pointer-events:none; opacity:.5;
  background:repeating-linear-gradient(180deg,
    rgba(0,0,0,.42) 0px, rgba(0,0,0,.42) 1px, transparent 1px, transparent 3px);
}
.sw-flicker{
  position:absolute; inset:0; pointer-events:none;
  background:var(--steel); mix-blend-mode:overlay; opacity:0;
  animation:sw-flicker 7s steps(1) infinite;
}

/* ── Boot curtain ───────────────────────────────────────── */
.sw-curtain{
  position:absolute; inset:0; z-index:20;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:clamp(18px,4vh,34px); text-align:center; padding:24px;
  background:rgba(7,10,14,.93);
  transition:opacity .9s ease, visibility .9s;
}
.sw-curtain[data-open="false"]{opacity:0; visibility:hidden; pointer-events:none;}

.sw-title{
  font-family:${display};
  font-size:clamp(1.5rem,7.4vw,3.4rem);
  line-height:1.1; margin:0; color:var(--bone);
  letter-spacing:.06em;
  text-shadow:3px 3px 0 var(--ink), 0 0 26px rgba(240,180,41,.28);
}
.sw-title b{color:var(--gold); font-weight:400;}
.sw-blade{
  height:3px; width:min(74vw,460px); background:linear-gradient(90deg,transparent,var(--steel),var(--gold),var(--steel),transparent);
  transform-origin:center; animation:sw-unsheathe 1s cubic-bezier(.2,.9,.2,1) .15s both;
}
.sw-kicker{
  font-size:clamp(1rem,3.4vw,1.35rem); letter-spacing:.42em; text-transform:uppercase;
  color:var(--steel); margin:0;
}
.sw-start{
  font-family:${display}; font-size:clamp(.62rem,2.5vw,.86rem);
  color:var(--gold); background:none; border:none; cursor:pointer;
  letter-spacing:.18em; padding:14px 10px;
  animation:sw-blink 1.15s steps(1) infinite;
}
.sw-legal{font-size:1rem; letter-spacing:.28em; color:rgba(239,230,210,.3); margin:0;}

/* ── Dialogue box ───────────────────────────────────────── */
.sw-stage{
  position:absolute; inset:0; z-index:10;
  display:flex; align-items:flex-end; justify-content:center;
  padding:clamp(18px,5vw,52px);
}
.sw-box{
  width:min(100%,720px);
  background:linear-gradient(180deg, rgba(12,20,28,.95), rgba(7,10,14,.97));
  border:4px solid var(--bone);
  outline:4px solid var(--ink);
  box-shadow:0 0 0 1px rgba(127,166,189,.5), 0 18px 60px rgba(0,0,0,.85);
  padding:clamp(20px,4vw,30px) clamp(18px,4vw,32px);
  animation:sw-boxin .45s cubic-bezier(.2,.9,.2,1) both;
}
.sw-box[data-shake="true"]{animation:sw-shake .38s steps(2) 2;}
.sw-speaker{
  font-family:${display}; font-size:.6rem; letter-spacing:.24em;
  color:var(--gold); margin:0 0 14px; text-transform:uppercase;
}
.sw-line{
  font-size:clamp(1.35rem,5.2vw,2.1rem); line-height:1.35;
  margin:0; color:var(--bone); min-height:2.7em;
}
.sw-caret{color:var(--gold); animation:sw-blink .9s steps(1) infinite;}

/* ── Choices ────────────────────────────────────────────── */
.sw-choices{display:flex; gap:clamp(10px,3vw,20px); margin-top:22px; flex-wrap:wrap;}
.sw-choice{
  flex:1 1 140px; position:relative;
  font-family:${display}; font-size:clamp(.7rem,2.6vw,.95rem);
  padding:16px 12px 16px 34px; text-align:left;
  color:var(--bone); background:rgba(30,47,61,.55);
  border:3px solid rgba(127,166,189,.35);
  cursor:pointer; transition:transform .12s steps(2), background .15s, border-color .15s;
}
.sw-choice:hover:not(:disabled),
.sw-choice[data-sel="true"]{
  background:rgba(47,92,74,.55); border-color:var(--gold); transform:translateY(-3px);
}
.sw-choice[data-sel="true"]::before{
  content:"▶"; position:absolute; left:12px; color:var(--gold);
  animation:sw-nudge .6s steps(2) infinite alternate;
}
.sw-choice:focus-visible{outline:3px solid var(--gold); outline-offset:3px;}
.sw-choice:disabled{opacity:.3; cursor:not-allowed; text-decoration:line-through;}
.sw-choice[data-kind="no"]:hover:not(:disabled){background:rgba(142,43,36,.5); border-color:var(--blood);}
.sw-hint{
  font-size:1.05rem; letter-spacing:.2em; color:rgba(127,166,189,.65);
  margin:16px 0 0; text-transform:uppercase;
}

/* ── Sound toggle ───────────────────────────────────────── */
.sw-sound{
  position:absolute; top:16px; right:16px; z-index:30;
  font-family:${display}; font-size:.55rem; letter-spacing:.14em;
  color:var(--steel); background:rgba(7,10,14,.7);
  border:2px solid rgba(127,166,189,.35); padding:9px 11px; cursor:pointer;
}
.sw-sound:hover{color:var(--gold); border-color:var(--gold);}
.sw-sound:focus-visible{outline:3px solid var(--gold); outline-offset:2px;}

/* ── Accept transition: one clean sword stroke ──────────── */
.sw-slash{
  position:absolute; inset:0; z-index:40; pointer-events:none;
  background:linear-gradient(105deg, transparent 44%, #fff 49%, #fff 51%, transparent 56%);
  transform:translateX(-110%); animation:sw-slash .5s ease-in forwards;
}
.sw-fade{
  position:absolute; inset:0; z-index:41; pointer-events:none;
  background:var(--ink); opacity:0; animation:sw-fade .75s ease-in .32s forwards;
}

/* ── Connecting to X ─────────────────────────────────────── */
.sw-connect{
  position:absolute; inset:0; z-index:45; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; text-align:center;
  background:rgba(7,10,14,.94);
}
.sw-connect p{
  font-family:${display}; font-size:clamp(.7rem,3.4vw,1rem); color:var(--gold);
  margin:0; animation:sw-blink 1s steps(1) infinite;
}
.sw-connect small{ font-size:1.1rem; letter-spacing:.26em; color:var(--steel); }

/* ── Keyframes ──────────────────────────────────────────── */
@keyframes sw-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes sw-drift{from{transform:scale(1.04) translate3d(0,0,0)}to{transform:scale(1.11) translate3d(-1.5%,-1%,0)}}
@keyframes sw-flicker{0%,96%{opacity:0}97%{opacity:.05}98%{opacity:0}99%{opacity:.04}}
@keyframes sw-unsheathe{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes sw-boxin{from{opacity:0; transform:translateY(22px)}to{opacity:1; transform:translateY(0)}}
@keyframes sw-shake{0%{transform:translateX(-7px)}50%{transform:translateX(7px)}100%{transform:translateX(0)}}
@keyframes sw-nudge{from{transform:translateX(0)}to{transform:translateX(3px)}}
@keyframes sw-slash{to{transform:translateX(110%)}}
@keyframes sw-fade{to{opacity:1}}

@media (prefers-reduced-motion: reduce){
  .sw-plate,.sw-flicker,.sw-blade,.sw-box,.sw-choice[data-sel="true"]::before{animation:none !important;}
  .sw-choice{transition:none;}
}
`;

/* ═══════════════════════════════════════════════════════════
   HOME PAGE — an SNES menu screen, not a web page.
   Panels have tabs, stats sit in a HUD, classes are a roster.
   ═══════════════════════════════════════════════════════════ */
export const HOME_CSS = `
.hm-root{
  --ink:${C.ink}; --navy:${C.navy}; --steel:${C.steel};
  --moss:${C.moss}; --gold:${C.gold}; --bone:${C.bone}; --blood:${C.blood};
  background:var(--ink); color:var(--bone); min-height:100vh;
  font-family:${body}; font-size:1.25rem; line-height:1.5;
  overflow-x:hidden; -webkit-font-smoothing:none;
}
.hm-root *{box-sizing:border-box;}
.hm-root img{image-rendering:pixelated;}
.hm-root a{color:inherit; text-decoration:none;}
.hm-wrap{max-width:860px; margin:0 auto; padding:0 20px;}
.hm-mono{font-family:${display};}

/* ── Header ─────────────────────────────────────────────── */
.hm-head{
  position:fixed; top:0; left:0; right:0; z-index:60; height:64px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 18px; background:rgba(7,10,14,.92);
  border-bottom:3px solid rgba(127,166,189,.28);
  backdrop-filter:blur(8px);
}
.hm-brand{display:flex; align-items:center; gap:10px;}
.hm-brand img{width:34px; height:34px; border:2px solid var(--steel);}
.hm-brand span{font-family:${display}; font-size:.78rem; letter-spacing:.12em;}
.hm-nav{display:flex; align-items:center; gap:6px;}
.hm-nav a{
  font-family:${display}; font-size:.55rem; letter-spacing:.14em;
  padding:11px 12px; color:rgba(239,230,210,.6); border:2px solid transparent;
}
.hm-nav a:hover{color:var(--gold); border-color:rgba(240,180,41,.5);}
.hm-x{display:flex; align-items:center; justify-content:center; width:38px; height:38px; border:2px solid rgba(127,166,189,.3); color:var(--steel);}
.hm-x:hover{color:var(--gold); border-color:var(--gold);}

/* ── Hero ───────────────────────────────────────────────── */
.hm-hero{
  position:relative; min-height:100svh; padding:104px 20px 56px;
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
  background:
    radial-gradient(ellipse 70% 60% at 50% 40%, rgba(47,92,74,.28), transparent 70%),
    linear-gradient(180deg, var(--navy), var(--ink) 78%);
}
.hm-hero::after{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.35;
  background:repeating-linear-gradient(180deg, rgba(0,0,0,.5) 0 1px, transparent 1px 3px);
}
.hm-hero > *{position:relative; z-index:1;}
.hm-badge{
  font-family:${display}; font-size:.55rem; letter-spacing:.2em; color:var(--gold);
  border:2px solid rgba(240,180,41,.5); padding:9px 14px; margin-bottom:26px;
}
.hm-title{
  font-family:${display}; font-size:clamp(1.7rem,8.4vw,4rem); line-height:1.08;
  margin:0; letter-spacing:.04em; text-shadow:4px 4px 0 var(--ink), 0 0 30px rgba(240,180,41,.2);
}
.hm-title b{color:var(--gold); font-weight:400;}
.hm-rule{height:3px; width:min(70vw,320px); margin:22px 0; background:linear-gradient(90deg,transparent,var(--steel),var(--gold),var(--steel),transparent);}
.hm-tag{font-size:clamp(1.2rem,4vw,1.6rem); color:rgba(239,230,210,.72); max-width:30ch; margin:0 0 30px;}

/* ── Buttons ────────────────────────────────────────────── */
.hm-btn{
  font-family:${display}; font-size:.72rem; letter-spacing:.14em;
  padding:17px 26px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:10px;
  color:var(--ink); background:var(--gold); border:3px solid var(--ink);
  box-shadow:0 5px 0 #a87a12, 0 0 26px rgba(240,180,41,.22);
  transition:transform .1s steps(2), box-shadow .1s;
}
.hm-btn:hover{transform:translateY(-2px); box-shadow:0 7px 0 #a87a12, 0 0 34px rgba(240,180,41,.35);}
.hm-btn:active{transform:translateY(3px); box-shadow:0 2px 0 #a87a12;}
.hm-btn:disabled{background:rgba(127,166,189,.15); color:rgba(239,230,210,.3); box-shadow:none; cursor:not-allowed; transform:none;}
.hm-btn--ghost{background:transparent; color:var(--bone); border-color:rgba(127,166,189,.4); box-shadow:none;}
.hm-btn--ghost:hover{border-color:var(--gold); color:var(--gold); box-shadow:none;}
.hm-btn img{width:20px; height:20px;}
.hm-cta{display:flex; flex-direction:column; gap:12px; width:min(100%,320px);}
.hm-root :focus-visible{outline:3px solid var(--gold); outline-offset:3px;}

/* ── HUD stats ──────────────────────────────────────────── */
.hm-hud{
  margin-top:44px; display:grid; grid-template-columns:repeat(4,1fr);
  border:3px solid rgba(127,166,189,.35); background:rgba(7,10,14,.6); width:min(100%,720px);
}
.hm-hud div{padding:16px 10px; border-left:2px solid rgba(127,166,189,.2);}
.hm-hud div:first-child{border-left:none;}
.hm-hud b{display:block; font-family:${display}; font-size:.66rem; color:var(--bone); font-weight:400; letter-spacing:.02em;}
.hm-hud span{display:block; margin-top:8px; font-size:.95rem; letter-spacing:.16em; text-transform:uppercase; color:rgba(127,166,189,.8);}
@media(max-width:560px){
  .hm-hud{grid-template-columns:repeat(2,1fr);}
  .hm-hud div:nth-child(3){border-left:none;}
  .hm-hud div:nth-child(n+3){border-top:2px solid rgba(127,166,189,.2);}
}

/* ── Panels ─────────────────────────────────────────────── */
.hm-sec{padding:76px 0; opacity:0; transform:translateY(26px); transition:opacity .6s ease, transform .6s ease;}
.hm-sec[data-in="true"]{opacity:1; transform:none;}
.hm-tab{
  display:inline-block; font-family:${display}; font-size:.55rem; letter-spacing:.2em;
  color:var(--ink); background:var(--steel); padding:8px 12px; margin-bottom:14px;
}
.hm-h2{font-family:${display}; font-size:clamp(1.05rem,4.4vw,1.7rem); line-height:1.35; margin:0 0 16px; letter-spacing:.02em;}
.hm-p{font-size:clamp(1.2rem,3.6vw,1.45rem); color:rgba(239,230,210,.68); margin:0 0 28px;}
.hm-band{background:linear-gradient(180deg, var(--ink), rgba(47,92,74,.22) 50%, var(--ink)); text-align:center; padding:88px 0;}
.hm-band .hm-p{margin-left:auto; margin-right:auto; max-width:44ch;}
.hm-divider{height:3px; background:repeating-linear-gradient(90deg, rgba(127,166,189,.35) 0 6px, transparent 6px 12px);}

/* ── Gallery ────────────────────────────────────────────── */
.hm-gal{display:flex; flex-direction:column; align-items:center; gap:16px;}
.hm-frame{
  width:min(100%,360px); aspect-ratio:1/1; border:4px solid var(--bone); outline:4px solid var(--ink);
  background:var(--navy); overflow:hidden; box-shadow:0 0 0 1px rgba(127,166,189,.5), 0 14px 40px rgba(0,0,0,.7);
}
.hm-frame img{width:100%; height:100%; object-fit:cover; display:block; transition:opacity .25s;}
.hm-dots{display:flex; flex-wrap:wrap; gap:5px; justify-content:center; max-width:340px;}
.hm-dots button{width:9px; height:9px; padding:0; border:none; background:rgba(127,166,189,.3); cursor:pointer;}
.hm-dots button[data-on="true"]{width:26px; background:var(--gold);}

/* ── Traits / grids ─────────────────────────────────────── */
.hm-grid2{display:grid; grid-template-columns:repeat(2,1fr); gap:10px;}
.hm-cell{display:flex; align-items:center; gap:10px; padding:13px 14px; border:2px solid rgba(127,166,189,.25); background:rgba(30,47,61,.4);}
.hm-cell i{width:7px; height:7px; background:var(--gold); flex:0 0 auto;}
.hm-cell span{font-size:1.15rem; color:rgba(239,230,210,.8);}

/* ── Roster ─────────────────────────────────────────────── */
.hm-roster{display:flex; flex-direction:column; gap:10px;}
.hm-unit{display:flex; align-items:center; gap:16px; padding:14px; border:2px solid rgba(127,166,189,.25); background:rgba(30,47,61,.35); transition:border-color .15s, background .15s;}
.hm-unit:hover{border-color:var(--gold); background:rgba(47,92,74,.35);}
.hm-unit img{width:76px; height:76px; flex:0 0 auto; border:3px solid var(--ink); outline:2px solid rgba(127,166,189,.4); object-fit:cover;}
.hm-unit h3{font-family:${display}; font-size:.72rem; margin:0 0 8px; letter-spacing:.04em;}
.hm-unit p{margin:0; font-size:1.15rem; color:rgba(239,230,210,.6);}
.hm-rank{font-family:${display}; font-size:.6rem; color:var(--gold); align-self:flex-start;}

/* ── Quest log ──────────────────────────────────────────── */
.hm-log{display:flex; flex-direction:column;}
.hm-step{display:grid; grid-template-columns:auto 1fr; gap:18px; padding-bottom:26px; position:relative;}
.hm-step:not(:last-child)::before{content:""; position:absolute; left:9px; top:22px; bottom:0; width:3px; background:repeating-linear-gradient(180deg, rgba(240,180,41,.5) 0 4px, transparent 4px 8px);}
.hm-node{width:21px; height:21px; border:3px solid var(--gold); background:var(--ink);}
.hm-step h3{font-family:${display}; font-size:.7rem; margin:0 0 8px;}
.hm-step em{display:block; font-style:normal; font-family:${display}; font-size:.52rem; letter-spacing:.18em; color:var(--steel); margin-bottom:8px;}
.hm-step p{margin:0; font-size:1.15rem; color:rgba(239,230,210,.6);}

/* ── FAQ ────────────────────────────────────────────────── */
.hm-faq{border:2px solid rgba(127,166,189,.25); background:rgba(30,47,61,.3);}
.hm-faq + .hm-faq{border-top:none;}
.hm-faq button{width:100%; display:flex; gap:14px; align-items:center; justify-content:space-between; background:none; border:none; cursor:pointer; padding:16px; text-align:left; color:var(--bone); font-family:${display}; font-size:.68rem; line-height:1.6;}
.hm-faq button:hover{color:var(--gold);}
.hm-faq i{color:var(--gold); font-style:normal;}
.hm-faq p{margin:0; padding:0 16px 18px; font-size:1.2rem; color:rgba(239,230,210,.62);}

/* ── Footer ─────────────────────────────────────────────── */
.hm-foot{text-align:center; padding:60px 20px 44px; border-top:3px solid rgba(127,166,189,.2);}
.hm-foot img{width:52px; height:52px; border:3px solid var(--steel); margin-bottom:16px;}
.hm-foot h3{font-family:${display}; font-size:.9rem; margin:0 0 12px; letter-spacing:.1em;}
.hm-foot p{color:rgba(239,230,210,.5); margin:0 0 26px;}
.hm-links{display:flex; gap:20px; justify-content:center; flex-wrap:wrap; margin-bottom:26px;}
.hm-links a{font-family:${display}; font-size:.55rem; letter-spacing:.14em; color:rgba(127,166,189,.8);}
.hm-links a:hover{color:var(--gold);}
.hm-sign{font-family:${display}; font-size:.52rem; letter-spacing:.22em; color:rgba(240,180,41,.55);}

/* ── Modal ──────────────────────────────────────────────── */
.hm-overlay{position:fixed; inset:0; z-index:200; background:rgba(7,10,14,.92); display:flex; align-items:center; justify-content:center; padding:14px;}
.hm-modal{
  width:100%; max-width:520px; max-height:94svh; overflow-y:auto;
  background:var(--navy); border:4px solid var(--bone); outline:4px solid var(--ink);
  box-shadow:0 0 0 1px rgba(127,166,189,.5), 0 24px 70px rgba(0,0,0,.9);
  padding:26px 20px 22px; position:relative;
}
.hm-close{position:absolute; top:12px; right:12px; background:none; border:none; color:var(--steel); font-size:1.4rem; cursor:pointer; line-height:1;}
.hm-close:hover{color:var(--gold);}
.hm-modal h2{font-family:${display}; font-size:.95rem; margin:0 0 10px;}
.hm-bar{height:12px; border:2px solid rgba(127,166,189,.4); background:var(--ink); padding:2px; margin:14px 0 6px;}
.hm-bar i{display:block; height:100%; background:var(--gold); transition:width .35s steps(4);}
.hm-count{font-size:1.05rem; letter-spacing:.14em; color:var(--steel); margin:0 0 16px; text-transform:uppercase;}

.hm-cards{display:grid; grid-template-columns:1fr 1fr; gap:9px;}
@media(max-width:420px){.hm-cards{grid-template-columns:1fr;}}
.hm-card{perspective:1000px;}
.hm-card > div{position:relative; transform-style:preserve-3d; transition:transform .55s cubic-bezier(.2,.9,.2,1);}
.hm-card[data-flip="true"] > div{transform:rotateY(180deg);}
.hm-face{
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  border:3px solid rgba(127,166,189,.3); background:rgba(7,10,14,.65); padding:14px; min-height:132px;
}
.hm-front{display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; text-align:center; cursor:pointer;}
.hm-card[data-lock="true"] .hm-front{opacity:.35; cursor:not-allowed;}
.hm-front b{font-family:${display}; font-size:.6rem; font-weight:400; line-height:1.5;}
.hm-front small{font-size:.95rem; letter-spacing:.14em; text-transform:uppercase; color:var(--steel);}
.hm-front i{font-style:normal; font-size:1.5rem;}
.hm-back{position:absolute; inset:0; transform:rotateY(180deg); overflow:auto;}
.hm-card[data-done="true"] .hm-back{border-color:var(--gold); background:rgba(47,92,74,.35);}
.hm-back h4{font-family:${display}; font-size:.58rem; margin:0 0 2px;}
.hm-back em{font-style:normal; font-size:.9rem; letter-spacing:.14em; text-transform:uppercase; color:var(--steel);}
.hm-back p{margin:9px 0 0; font-size:1.05rem; color:rgba(239,230,210,.7); line-height:1.4;}
.hm-tick{position:absolute; top:12px; right:12px; color:var(--gold); font-size:1.1rem;}
.hm-in{width:100%; background:var(--ink); border:2px solid rgba(127,166,189,.35); color:var(--bone); font-family:${body}; font-size:1.15rem; padding:8px 10px; margin-top:8px;}
.hm-in:focus{outline:none; border-color:var(--gold);}
.hm-mini{width:100%; margin-top:8px; font-family:${display}; font-size:.52rem; letter-spacing:.1em; padding:9px; cursor:pointer; color:var(--ink); background:var(--gold); border:2px solid var(--ink);}
.hm-mini:hover{background:#ffcb4a;}
.hm-ok{color:var(--gold); font-size:1.05rem; margin:8px 0 0;}
.hm-err{color:#e0776e; font-size:1.05rem; margin:6px 0 0;}
.hm-note{color:rgba(239,230,210,.4); font-size:.95rem; margin:8px 0 0; line-height:1.35;}
.hm-submit{width:100%; margin-top:16px;}
.hm-done{text-align:center; padding:30px 0;}
.hm-seal{width:66px; height:66px; margin:0 auto 18px; border:4px solid var(--gold); display:flex; align-items:center; justify-content:center; color:var(--gold); font-size:1.9rem; animation:hm-stamp .45s cubic-bezier(.2,1.4,.4,1) both;}
@keyframes hm-stamp{from{transform:scale(0) rotate(-14deg); opacity:0} to{transform:none; opacity:1}}

@media (prefers-reduced-motion: reduce){
  .hm-sec{opacity:1 !important; transform:none !important; transition:none;}
  .hm-card > div, .hm-seal, .hm-bar i{transition:none; animation:none;}
}
`;
