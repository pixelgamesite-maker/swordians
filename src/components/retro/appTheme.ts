import { display, body } from "../retro/theme";

export const APP_CSS = `
.ap-root{
  min-height:100svh; background:#070a0e; color:#efe6d2;
  font-family:${body}; font-size:1.2rem;
  display:flex; flex-direction:column;
}
.ap-root *{ box-sizing:border-box; }
.ap-root img{ image-rendering:pixelated; }

.ap-bar{
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 16px; border-bottom:2px solid rgba(127,166,189,.25);
  background:rgba(7,10,14,.9); position:sticky; top:0; z-index:20;
}
.ap-who{ display:flex; align-items:center; gap:9px; }
.ap-who img{ width:28px; height:28px; border:2px solid rgba(127,166,189,.4); border-radius:50%; }
.ap-who b{ font-family:${display}; font-size:.55rem; font-weight:400; letter-spacing:.06em; }
.ap-icons{ display:flex; gap:8px; }
.ap-icon{
  font-family:${display}; font-size:.45rem; letter-spacing:.1em;
  color:#7fa6bd; background:none; border:2px solid rgba(127,166,189,.3);
  padding:8px 10px; cursor:pointer;
}
.ap-icon:hover{ color:#f0b429; border-color:#f0b429; }

.ap-body{ flex:1; width:100%; max-width:640px; margin:0 auto; padding:28px 18px 40px; }
.ap-eyebrow{ font-family:${display}; font-size:.5rem; letter-spacing:.22em; color:#7fa6bd; margin:0 0 12px; }
.ap-h1{ font-family:${display}; font-size:clamp(1rem,5vw,1.5rem); margin:0 0 10px; line-height:1.4; }
.ap-lede{ color:rgba(239,230,210,.6); margin:0 0 26px; line-height:1.6; }

/* ── Points banner ── */
.ap-points{
  border:3px solid #f0b429; background:rgba(240,180,41,.08);
  padding:16px; text-align:center; margin-bottom:26px;
}
.ap-points span{ display:block; font-family:${display}; font-size:.45rem; letter-spacing:.2em; color:#7fa6bd; margin-bottom:9px; }
.ap-points b{ font-family:${display}; font-size:1.6rem; color:#f0b429; font-weight:400; }
.ap-points small{ display:block; margin-top:9px; font-size:1.05rem; color:rgba(239,230,210,.5); }

/* ── Big menu tiles ── */
.ap-tiles{ display:grid; gap:12px; }
.ap-tile{
  display:block; width:100%; text-align:left; cursor:pointer;
  border:3px solid rgba(127,166,189,.35); background:rgba(30,47,61,.45);
  padding:22px 20px; transition:border-color .15s, background .15s, transform .1s steps(2);
}
.ap-tile:hover{ border-color:#f0b429; background:rgba(47,92,74,.4); transform:translateY(-2px); }
.ap-tile h3{ font-family:${display}; font-size:.8rem; margin:0 0 10px; color:#efe6d2; }
.ap-tile p{ margin:0; color:rgba(239,230,210,.6); font-size:1.15rem; line-height:1.5; }
.ap-tile[data-primary="true"]{ border-color:#f0b429; background:rgba(240,180,41,.1); }

/* ── Task rows ── */
.ap-task{
  display:flex; align-items:center; gap:14px;
  border:2px solid rgba(127,166,189,.3); background:rgba(30,47,61,.35);
  padding:16px; margin-bottom:10px;
}
.ap-task[data-done="true"]{ border-color:#f0b429; background:rgba(47,92,74,.3); }
.ap-task-txt{ flex:1; }
.ap-task-txt h4{ font-family:${display}; font-size:.58rem; margin:0 0 7px; }
.ap-task-txt p{ margin:0; font-size:1.05rem; color:rgba(239,230,210,.55); }
.ap-go{
  font-family:${display}; font-size:.5rem; letter-spacing:.08em; padding:11px 14px;
  color:#070a0e; background:#f0b429; border:2px solid #070a0e; cursor:pointer; flex-shrink:0;
}
.ap-go:disabled{ background:rgba(127,166,189,.2); color:rgba(239,230,210,.4); cursor:default; }
.ap-tick{ color:#f0b429; font-size:1.4rem; flex-shrink:0; }

.ap-note{
  margin-top:22px; padding:14px; border:2px dashed rgba(127,166,189,.3);
  font-size:1.05rem; color:rgba(239,230,210,.45); line-height:1.6;
}

/* ── Game screen ── */
.ap-game{ position:fixed; inset:0; display:flex; flex-direction:column; background:#070a0e; }
.ap-game-top{
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px; border-bottom:2px solid rgba(127,166,189,.25); flex-shrink:0;
}
.ap-back{
  font-family:${display}; font-size:.5rem; letter-spacing:.1em; color:#7fa6bd;
  background:none; border:2px solid rgba(127,166,189,.3); padding:9px 12px; cursor:pointer;
}
.ap-back:hover{ color:#f0b429; border-color:#f0b429; }
.ap-game-wrap{ flex:1; min-height:0; }

.ap-center{ display:flex; align-items:center; justify-content:center; min-height:100svh; }
.ap-spinner{ font-family:${display}; font-size:.6rem; color:#7fa6bd; animation:ap-blink 1s steps(1) infinite; }
@keyframes ap-blink{ 0%,55%{opacity:1} 56%,100%{opacity:.25} }
`;
