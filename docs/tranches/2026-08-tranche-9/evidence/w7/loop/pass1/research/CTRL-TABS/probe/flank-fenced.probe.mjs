// CTRL-TABS · probe 9 — THE FENCED FLANK. A strip that contributes NO intrinsic width.
//   node flank-fenced.probe.mjs
// Probe 8 showed both in-flow desk arms widen the shrink-to-fit rail (card +48…+410px, board
// walked 24…205px — kill condition 3, met by two orders of magnitude over the goldens' 3px).
// The only desk shape left is a strip taken OUT of the width cascade: `position: absolute`
// down the card's own left edge, paid for with `padding-left` on the wrap. The card's outer
// width must not move by one pixel; the content column narrows by the flank's depth instead.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4232/";
const SRC = readFileSync(join(HERE, "..", "proto", "overlay.mjs"), "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD = SRC.slice(SRC.indexOf("export function build")).replace("export function build","function build").trim();
const GREEN = (px) => `.proto-tab-word,.zone-row-label,.proto-row-label{font-family:var(--font-hand)!important;font-size:${px}px!important;font-weight:500!important;text-transform:lowercase!important;letter-spacing:normal!important;line-height:1.05!important}`;
const FLANK = `
.controls-card{position:relative}
.control-panel-wrap{padding-left:3.25rem!important}
.proto-tablist{position:absolute!important;left:0;top:var(--card-pad-t,20px);width:3rem!important;
  flex-direction:column!important;align-items:stretch!important;gap:.25rem;margin:0!important}
.proto-tab{writing-mode:vertical-rl;flex:0 0 auto;white-space:nowrap}
.proto-arm-tongue .proto-tab{border-radius:.75rem 0 0 .75rem;border-right:none;border-bottom:1.5px solid var(--ink-press-rule)}
`;
const geom = () => {
  const b=(s)=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2)}};
  const card=document.querySelector(".controls-card");
  return {board:b(".board-paper")||b(".board-wrapper"),cells:b(".board-cells"),card:b(".controls-card"),
    cardScrollW:card?.scrollWidth,cardClientW:card?.clientWidth};
};
const fit = () => {
  const card=document.querySelector(".controls-card");
  const tabs=Array.from(document.querySelectorAll(".proto-tab"));
  const per=[];
  for(let i=0;i<tabs.length;i++){window.__protoSelect(i);void card.offsetHeight;
    const tr=document.querySelector(".tray-well:not([data-proto-off])");
    per.push({tab:tabs[i].innerText.replace(/\s+/g," ").trim(),trayH:tr?+tr.getBoundingClientRect().height.toFixed(2):null,
      sh:card.scrollHeight,ch:card.clientHeight,fits:card.scrollHeight<=card.clientHeight,over:card.scrollHeight-card.clientHeight,
      hScroll:card.scrollWidth>card.clientWidth});}
  window.__protoSelect(0);
  const st=document.querySelector(".proto-tablist").getBoundingClientRect();
  return {per,strip:{w:+st.w?.toFixed?.(2)??+st.width.toFixed(2),h:+st.height.toFixed(2)},
    tabs:tabs.map(t=>{const r=t.getBoundingClientRect();return{t:t.innerText.replace(/\s+/g," ").trim(),w:+r.width.toFixed(2),h:+r.height.toFixed(2),ok:r.width>=44&&r.height>=44}}),
    stripBottom:+(st.bottom).toFixed(2), cardBottom:+(document.querySelector(".controls-card").getBoundingClientRect().bottom).toFixed(2)};
};
const out={};
for (const engine of ["chromium","webkit"]) for (const [w,h] of [[1280,800],[1440,900]]) {
  const br=await (engine==="webkit"?webkit:chromium).launch();
  const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  await ctx.addInitScript(()=>{try{localStorage.clear()}catch{}});
  const p=await ctx.newPage();
  await p.goto(BASE+"?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector(".controls-card",{state:"attached",timeout:30000});
  await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
  await p.waitForTimeout(1600);
  const before=await p.evaluate(geom);
  await p.addStyleTag({content:CSS});
  await p.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
  const px=await p.evaluate(()=>+(parseFloat(getComputedStyle(document.querySelector(".ctrl-btn")).fontSize)*1.23).toFixed(2));
  await p.addStyleTag({content:GREEN(px)});
  await p.addStyleTag({content:FLANK});
  await p.waitForTimeout(400);
  const after=await p.evaluate(geom);
  const f=await p.evaluate(fit);
  const k=`${w}x${h}-${engine}`;
  out[k]={px,before,after,f,boardDx:+(after.board.x-before.board.x).toFixed(2),cardDw:+(after.card.w-before.card.w).toFixed(2)};
  console.log(`[${k}] floor ${px}px | board Δx ${out[k].boardDx} | card Δw ${out[k].cardDw} (${before.card.w}→${after.card.w}) | hScroll ${after.cardScrollW}/${after.cardClientW} | tabs ${f.tabs.map(t=>`${t.w}x${t.h}`).join(",")} | strip bottom ${f.stripBottom} vs card ${f.cardBottom} | ${f.per.map(x=>`${x.tab}:${x.trayH}=>${x.fits?"FIT":"OVER "+x.over}${x.hScroll?"+HSCROLL":""}`).join("  ")}`);
  await br.close();
}
writeFileSync(join(HERE,"flank-fenced.json"),JSON.stringify(out,null,1));
