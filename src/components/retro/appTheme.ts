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

export const LEADERBOARD_CSS = `
.lb-row{
  display:grid; grid-template-columns:38px 32px 1fr auto; align-items:center; gap:12px;
  padding:12px 10px; border-bottom:2px solid rgba(127,166,189,.18);
}
.lb-row[data-me="true"]{ background:rgba(240,180,41,.1); border-color:#f0b429; }
.lb-rank{ font-family:'Press Start 2P',monospace; font-size:.6rem; color:#7fa6bd; }
.lb-row[data-me="true"] .lb-rank{ color:#f0b429; }
.lb-avatar{ width:32px; height:32px; border-radius:50%; border:2px solid rgba(127,166,189,.4); object-fit:cover; }
.lb-avatar-fallback{ width:32px; height:32px; border-radius:50%; background:rgba(127,166,189,.2); }
.lb-handle{ font-size:1.1rem; color:#efe6d2; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lb-pts{ font-family:'Press Start 2P',monospace; font-size:.62rem; color:#f0b429; }
`;

export const PROFILE_CSS = `
.pm-trigger{
  display:flex; align-items:center; gap:9px; background:none; border:none; cursor:pointer;
  padding:4px 8px 4px 4px; border-radius:4px; transition:background .15s;
}
.pm-trigger:hover{ background:rgba(127,166,189,.12); }
.pm-trigger img{ width:28px; height:28px; border:2px solid rgba(127,166,189,.4); border-radius:50%; }
.pm-trigger b{ font-family:'Press Start 2P',monospace; font-size:.55rem; font-weight:400; letter-spacing:.06em; color:#efe6d2; }
.pm-caret{ color:#7fa6bd; font-size:.6rem; transition:transform .15s; }
.pm-trigger[data-open="true"] .pm-caret{ transform:rotate(180deg); }

.pm-panel{
  position:absolute; top:100%; right:12px; z-index:40; margin-top:6px;
  width:min(92vw,340px); max-height:80vh; overflow-y:auto;
  background:#0d1118; border:3px solid rgba(127,166,189,.35);
  box-shadow:0 20px 50px rgba(0,0,0,.7); animation:pm-in .18s ease both;
}
@keyframes pm-in{ from{opacity:0; transform:translateY(-6px)} to{opacity:1; transform:none} }

.pm-section{ padding:16px; border-bottom:2px solid rgba(127,166,189,.18); }
.pm-section:last-child{ border-bottom:none; }
.pm-label{ font-family:'Press Start 2P',monospace; font-size:.48rem; letter-spacing:.16em; color:#7fa6bd; margin:0 0 10px; }

.pm-stats{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.pm-stat{ text-align:center; border:2px solid rgba(127,166,189,.25); padding:10px 4px; }
.pm-stat b{ display:block; font-family:'Press Start 2P',monospace; font-size:.72rem; color:#f0b429; font-weight:400; }
.pm-stat span{ display:block; margin-top:6px; font-size:.85rem; letter-spacing:.06em; color:rgba(239,230,210,.5); text-transform:uppercase; }

.pm-ref-row{ display:flex; gap:6px; }
.pm-ref-row input{
  flex:1; background:#070a0e; border:2px solid rgba(127,166,189,.3); color:#efe6d2;
  font-family:'VT323',monospace; font-size:1.05rem; padding:9px 10px; min-width:0;
}
.pm-copy{
  font-family:'Press Start 2P',monospace; font-size:.5rem; letter-spacing:.06em; padding:0 12px;
  color:#070a0e; background:#f0b429; border:2px solid #070a0e; cursor:pointer; flex-shrink:0;
}
.pm-copy[data-copied="true"]{ background:#7fa6bd; }

.pm-wallet-bound{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  border:2px solid rgba(127,166,189,.25); padding:10px; font-size:1.05rem; color:rgba(239,230,210,.7);
}
.pm-wallet-bound b{ color:#f0b429; font-family:'VT323',monospace; font-size:1.05rem; font-weight:400; }
.pm-locked{ font-family:'Press Start 2P',monospace; font-size:.42rem; color:#7fa6bd; letter-spacing:.08em; flex-shrink:0; }

.pm-in{
  width:100%; background:#070a0e; border:2px solid rgba(127,166,189,.3); color:#efe6d2;
  font-family:'VT323',monospace; font-size:1.05rem; padding:9px 10px; margin-bottom:8px;
}
.pm-in:focus{ outline:none; border-color:#f0b429; }
.pm-bind{
  width:100%; font-family:'Press Start 2P',monospace; font-size:.55rem; letter-spacing:.08em; padding:11px;
  color:#070a0e; background:#f0b429; border:2px solid #070a0e; cursor:pointer;
}
.pm-bind:disabled{ background:rgba(127,166,189,.2); color:rgba(239,230,210,.4); cursor:default; }
.pm-warn{ font-size:.95rem; color:#e0776e; margin:6px 0 0; }
.pm-hint{ font-size:.9rem; color:rgba(239,230,210,.35); margin:8px 0 0; line-height:1.4; }

.pm-guide-item{ border-bottom:1px solid rgba(127,166,189,.15); }
.pm-guide-item:last-child{ border-bottom:none; }
.pm-guide-item button{
  width:100%; display:flex; justify-content:space-between; gap:10px; background:none; border:none;
  cursor:pointer; padding:9px 0; text-align:left; color:#efe6d2; font-size:1.05rem;
}
.pm-guide-item i{ color:#f0b429; font-style:normal; flex-shrink:0; }
.pm-guide-item p{ margin:0 0 10px; font-size:.98rem; color:rgba(239,230,210,.55); line-height:1.5; }

.pm-signout{
  width:100%; font-family:'Press Start 2P',monospace; font-size:.5rem; letter-spacing:.08em; padding:11px;
  color:#e0776e; background:none; border:2px solid rgba(224,119,110,.4); cursor:pointer;
}
`;
