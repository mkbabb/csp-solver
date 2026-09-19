// CTRL-TABS · probe 10 — I2 UNDER THE OVERLAY, and what the strip SAYS.
//   node i2-spoken.probe.mjs
// I2's law: "the mobile floating bar carries chrome of its own and covers no option group."
// Under this family the bar IS the tray's floor. Measured the way I2 measures it, at the
// owner's own pose (390×844 dark, sheet settled), plus the AX names the tablist publishes.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE=dirname(fileURLToPath(import.meta.url));
const SRC=readFileSync(join(HERE,"..","proto","overlay.mjs"),"utf8");
const CSS=/export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD=SRC.slice(SRC.indexOf("export function build")).replace("export function build","function build").trim();
const GREEN=(px)=>`.proto-tab-word,.zone-row-label,.proto-row-label{font-family:var(--font-hand)!important;font-size:${px}px!important;font-weight:500!important;text-transform:lowercase!important;letter-spacing:normal!important;line-height:1.05!important}`;
const i2 = () => {
  const bar=document.querySelector(".action-bar");
  const cs=getComputedStyle(bar);
  const br=bar.getBoundingClientRect();
  const ov=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  const groups=Array.from(document.querySelectorAll(".tray-well")).filter(t=>t.getClientRects().length>0).map(t=>{
    const r=t.getBoundingClientRect();
    return {name:(t.querySelector(".washi-tag")?.textContent||document.getElementById(t.getAttribute("aria-labelledby"))?.innerText||"?").trim(),
      area:+(r.width*r.height).toFixed(0), covered:+ov(br,r).toFixed(0), frac:+(ov(br,r)/(r.width*r.height)).toFixed(4)};
  });
  return {ownChrome: cs.borderTopWidth!=="0px"||cs.borderTopStyle!=="none"||cs.boxShadow!=="none"||!!bar.querySelector(":scope > svg.outline-svg"),
    borderTop:cs.borderTopWidth+" "+cs.borderTopStyle, shadow:cs.boxShadow, position:cs.position, z:cs.zIndex,
    box:{x:+br.x.toFixed(2),y:+br.y.toFixed(2),w:+br.width.toFixed(2),h:+br.height.toFixed(2)},
    groups, worst: groups.length?Math.max(...groups.map(g=>g.frac)):0};
};
const out={};
for (const engine of ["chromium","webkit"]) {
  const br=await (engine==="webkit"?webkit:chromium).launch();
  const ctx=await br.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:engine==="chromium",hasTouch:true,colorScheme:"dark"});
  await ctx.addInitScript(()=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","dark")}catch{}});
  const p=await ctx.newPage();
  await p.goto("http://127.0.0.1:4232/?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector(".controls-card",{state:"attached",timeout:30000});
  await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
  await p.waitForTimeout(1500);
  const beforeI2=await p.evaluate(i2);
  await p.locator(".drawer-tab").click({force:true}); await p.waitForTimeout(950);
  const atHead=await p.evaluate(i2);
  await p.addStyleTag({content:CSS});
  await p.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
  const px=await p.evaluate(()=>+(parseFloat(getComputedStyle(document.querySelector(".ctrl-btn")).fontSize)*1.23).toFixed(2));
  await p.addStyleTag({content:GREEN(px)});
  await p.evaluate(()=>{for(const b of document.querySelectorAll(".proto-tab")){if(b.parentElement?.classList.contains("proto-tab-head"))continue;const h=document.createElement("h2");h.className="proto-tab-head";h.style.display="contents";b.parentElement.insertBefore(h,b);h.appendChild(b);}});
  await p.waitForTimeout(350);
  const under=await p.evaluate(i2);
  const ax=await p.locator(".proto-tablist").ariaSnapshot();
  // the family ORPHANS these W2 surfaces — count them where they live
  const orphans=await p.evaluate(()=>({
    foldToolsPresent: !!document.querySelector("#fold-tools"),
    foldToolsBox: (()=>{const e=document.querySelector("#fold-tools");if(!e)return null;const r=e.getBoundingClientRect();return {w:+r.width.toFixed(2),h:+r.height.toFixed(2)}})(),
    playControlsButtons: document.querySelectorAll(".play-controls button").length,
    playControlsVisible: document.querySelectorAll(".play-controls button").length && document.querySelector(".play-controls").getClientRects().length>0,
    stickyTags: Array.from(document.querySelectorAll(".washi-tag")).filter(t=>getComputedStyle(t).position==="sticky").length,
    boilDividers: document.querySelectorAll(".boil-divider-wrap").length,
    boilDividerPoses: document.querySelectorAll(".boil-divider-wrap g.boil-pose").length,
    liveFilters: Array.from(document.querySelectorAll("*")).filter(e=>{const f=getComputedStyle(e).filter;return f&&f!=="none"&&f.includes("url(")}).length,
  }));
  out[engine]={beforeI2,atHead,under,ax,orphans};
  console.log(`[${engine}] I2 at HEAD ownChrome=${atHead.ownChrome} worst=${atHead.worst} | UNDER OVERLAY ownChrome=${under.ownChrome} (${under.borderTop}) worst=${under.worst} groups=${JSON.stringify(under.groups)}`);
  console.log(`[${engine}] orphans ${JSON.stringify(orphans)}`);
  console.log(`[${engine}] AX ${JSON.stringify(ax).slice(0,700)}`);
  await br.close();
}
writeFileSync(join(HERE,"i2-spoken.json"),JSON.stringify(out,null,1));
