#!/usr/bin/env node
// CTRL-COST pass-3 critic (re-run) — G15' on the SECOND face. The return's `no` figures are the
// DEAL face's; the clear face measures 61.59 x 104.38 against deal's 73.59 x 123.97, so its
// answer is measured here in both dimensions, armed, with the control that fires.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const base = process.argv[2], engine = process.argv[3] ?? "webkit";
const [w,h] = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5];
const touch = w < 1024;
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport:{width:w,height:h}, hasTouch:touch, deviceScaleFactor:2 });
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card",{timeout:25000,state:"attached"});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(700);
const up = await page.evaluate(()=>!document.documentElement.classList.contains("drawer-closed"));
if (touch && up) { await page.keyboard.press("Escape").catch(()=>{}); await page.waitForTimeout(950); }
await page.evaluate(()=>{const i=[...document.querySelectorAll("input.cell-native-input")].find(x=>!x.readOnly&&!x.disabled&&!x.value); if(i) i.focus();});
await page.keyboard.press("5"); await page.waitForTimeout(300);
if (touch) { const tab = await page.$(".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']"); if (tab) await tab.click({force:true}).catch(()=>{}); await page.waitForTimeout(950); }
await page.evaluate(()=>document.querySelector(".clear-face")?.scrollIntoView({block:"center"}));
await page.waitForTimeout(250);
const btn = await page.$(".clear-face .act-verb");
if (touch) await btn.tap(); else await btn.click();
await page.waitForTimeout(400);
const r = await page.evaluate(()=>{
  const r2=(n)=>+n.toFixed(2);
  const b=(sel)=>{const e=document.querySelector(sel); if(!e) return null; const x=e.getBoundingClientRect(); return {w:r2(x.width),h:r2(x.height),x:r2(x.x),y:r2(x.y)};};
  const cs=(sel,p)=>{const e=document.querySelector(sel); return e?getComputedStyle(e)[p]:null;};
  return { clearArmed: !!document.querySelector(".clear-face[data-armed]"),
    clearAnswer: b(".clear-face .act-answer"), clearAnswerBox: b(".clear-face .act-answer-box"),
    dealAnswer: b(".deal-face .act-answer"), clearFace: b(".clear-face"), dealFace: b(".deal-face"),
    minH: cs(".clear-face .act-answer","minHeight"), minW: cs(".clear-face .act-answer","minWidth"),
    overflowsFace: (()=>{const a=document.querySelector(".clear-face .act-answer"), f=document.querySelector(".clear-face"); if(!a||!f) return null; const ar=a.getBoundingClientRect(), fr=f.getBoundingClientRect(); return { left:+(fr.x-ar.x).toFixed(2), right:+(ar.right-fr.right).toFixed(2), bottom:+(ar.bottom-fr.bottom).toFixed(2) };})() };
});
writeFileSync(out, JSON.stringify({engine,vp:`${w}x${h}`,...r},null,1));
console.log(engine,`${w}x${h}`,JSON.stringify(r));
await browser.close();
