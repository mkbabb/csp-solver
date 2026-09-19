// CTRL-TABS · probe 8 — THE GOLDENS' CONDITION. Does either desk arm walk the board?
//   node board-walk.probe.mjs
// Kill condition 3: "tabs on the rail's left flank widen the row and walk the board 3px into
// cell-light / grid-corner-light (two committed goldens; the iPad coarse seal had 0.23px of
// headroom)." Measured at 1280×800 and 1440×900, both engines, before and after each arm.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4232/";
const SRC = readFileSync(join(HERE, "..", "proto", "overlay.mjs"), "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD = SRC.slice(SRC.indexOf("export function build")).replace("export function build","function build").trim();
const GREEN = (px) => `.proto-tab-word,.zone-row-label,.proto-row-label{font-family:var(--font-hand)!important;font-size:${px}px!important;font-weight:500!important;text-transform:lowercase!important;letter-spacing:normal!important;line-height:1.05!important}.proto-tab-word{white-space:normal!important;text-align:center}`;
const RAIL = `.control-panel-wrap{display:flex!important;flex-direction:row!important;align-items:stretch;gap:.25rem}.control-panel-wrap>:not(.proto-tablist){flex:1 1 auto;min-width:0}.proto-tablist{flex:0 0 3rem!important;flex-direction:column!important;width:3rem!important;align-items:stretch!important;margin:0!important}.proto-tab{writing-mode:vertical-rl;flex:0 0 auto}`;
// THE STRIP MAY NOT WIDEN THE RAIL: the top arm's tabs get `min-width:0` and share the card's
// own width, so the wrap's max-content contribution cannot grow past the card.
const TOP_FENCE = `.proto-tablist{width:100%!important;max-width:100%!important}.proto-tab{min-width:0!important;flex:1 1 0!important;overflow:hidden}`;
const geom = () => {
  const b = (s) => { const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2)}; };
  const card = document.querySelector(".controls-card");
  return { board: b(".board-paper")||b(".board-wrapper"), cells: b(".board-cells"), card: b(".controls-card"),
    rail: b(".controls-rail")||b(".scene-controls"), wrapScrollW: document.querySelector(".control-panel-wrap")?.scrollWidth,
    cardScrollW: card?.scrollWidth, cardClientW: card?.clientWidth };
};
const out={};
for (const engine of ["chromium","webkit"]) for (const [w,h] of [[1280,800],[1440,900]]) {
  for (const arm of ["top","top-fenced","rail"]) {
    const br = await (engine==="webkit"?webkit:chromium).launch();
    const ctx = await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
    await ctx.addInitScript(()=>{try{localStorage.clear()}catch{}});
    const p = await ctx.newPage();
    await p.goto(BASE+"?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
    await p.waitForSelector(".controls-card",{state:"attached",timeout:30000});
    await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
    await p.waitForTimeout(1600);
    const before = await p.evaluate(geom);
    await p.addStyleTag({content:CSS});
    await p.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
    const px = await p.evaluate(()=>+(parseFloat(getComputedStyle(document.querySelector(".ctrl-btn")).fontSize)*1.23).toFixed(2));
    await p.addStyleTag({content:GREEN(px)});
    if (arm==="rail") await p.addStyleTag({content:RAIL});
    if (arm==="top-fenced") await p.addStyleTag({content:TOP_FENCE});
    await p.waitForTimeout(400);
    const after = await p.evaluate(geom);
    const k=`${w}x${h}-${engine}-${arm}`;
    out[k]={before,after,
      boardDx:+(after.board.x-before.board.x).toFixed(2), boardDw:+(after.board.w-before.board.w).toFixed(2),
      cardDw:+(after.card.w-before.card.w).toFixed(2), cellsDx:+((after.cells?.x??0)-(before.cells?.x??0)).toFixed(2)};
    console.log(`[${k}] board Δx ${out[k].boardDx} Δw ${out[k].boardDw} | card Δw ${out[k].cardDw} (${before.card.w}→${after.card.w}) | cells Δx ${out[k].cellsDx} | cardScrollW ${after.cardScrollW}/${after.cardClientW}`);
    await br.close();
  }
}
writeFileSync(join(HERE,"board-walk.json"),JSON.stringify(out,null,1));
