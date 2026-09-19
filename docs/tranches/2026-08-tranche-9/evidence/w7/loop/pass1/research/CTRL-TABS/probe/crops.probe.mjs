// CTRL-TABS · crops — three, each cited in the record. Card region only, ≤150 KB each.
import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE=dirname(fileURLToPath(import.meta.url));
const FR=join(HERE,"..","frames");
const SRC=readFileSync(join(HERE,"..","proto","overlay.mjs"),"utf8");
const CSS=/export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD=SRC.slice(SRC.indexOf("export function build")).replace("export function build","function build").trim();
const GREEN=(px)=>`.proto-tab-word,.zone-row-label,.proto-row-label{font-family:var(--font-hand)!important;font-size:${px}px!important;font-weight:500!important;text-transform:lowercase!important;letter-spacing:normal!important;line-height:1.05!important}`;
const FLANK=`.controls-card{position:relative}.control-panel-wrap{padding-left:3.25rem!important}.proto-tablist{position:absolute!important;left:0;top:20px;width:3rem!important;flex-direction:column!important;align-items:stretch!important;gap:.25rem;margin:0!important}.proto-tab{writing-mode:vertical-rl;flex:0 0 auto;white-space:nowrap}.proto-arm-tongue .proto-tab{border-radius:.75rem 0 0 .75rem;border-right:none;border-bottom:1.5px solid var(--ink-press-rule)}`;
const cases=[
 {file:"c1-strip-and-tray-390x844-chromium-dark.png",w:390,h:844,sheet:true,dark:true,flank:false,tab:1},
 {file:"c2-strip-900x500-chromium-light.png",w:900,h:500,sheet:true,dark:false,flank:false,tab:0},
 {file:"c3-rail-flank-1280x800-chromium-light.png",w:1280,h:800,sheet:false,dark:false,flank:true,tab:0},
];
for (const c of cases) {
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:c.w,height:c.h},deviceScaleFactor:1,isMobile:c.sheet,hasTouch:c.sheet,colorScheme:c.dark?"dark":"light"});
  await ctx.addInitScript((d)=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme",d?"dark":"light")}catch{}},c.dark);
  const p=await ctx.newPage();
  await p.goto("http://127.0.0.1:4232/?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector(".controls-card",{state:"attached",timeout:30000});
  await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
  await p.waitForTimeout(1600);
  if(c.sheet){await p.locator(".drawer-tab").click({force:true});await p.waitForTimeout(950);}
  await p.addStyleTag({content:CSS});
  await p.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
  const px=await p.evaluate(()=>+(parseFloat(getComputedStyle(document.querySelector(".ctrl-btn")).fontSize)*1.23).toFixed(2));
  await p.addStyleTag({content:GREEN(px)});
  await p.evaluate(()=>{for(const x of document.querySelectorAll(".proto-tab")){if(x.parentElement?.classList.contains("proto-tab-head"))continue;const h=document.createElement("h2");h.className="proto-tab-head";h.style.display="contents";x.parentElement.insertBefore(h,x);h.appendChild(x);}});
  if(c.flank) await p.addStyleTag({content:FLANK});
  await p.waitForTimeout(400);
  await p.evaluate((i)=>window.__protoSelect(i), c.tab);
  await p.waitForTimeout(250);
  const box=await p.locator(".controls-card").boundingBox();
  await p.screenshot({path:join(FR,c.file),clip:{x:Math.max(0,box.x-4),y:Math.max(0,box.y-4),width:Math.min(c.w,box.width+8),height:Math.min(c.h-Math.max(0,box.y-4),box.height+8)}});
  console.log(c.file, (statSync(join(FR,c.file)).size/1024).toFixed(1)+" KB", JSON.stringify(box));
  await b.close();
}
