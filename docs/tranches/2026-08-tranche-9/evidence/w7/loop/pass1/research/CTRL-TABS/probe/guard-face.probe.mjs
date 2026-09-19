// CTRL-TABS · probe 11 — §15's FACE. Can the house's guard ribbon replace a 44px tab-strip row?
//   node guard-face.probe.mjs
// The ribbon is the gallery's (`GameGallery.vue:1003-1065`). Measured where it lives, at 390 and
// on the desk, so the spec knows what a 44px band would have to hold.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs"; import { dirname, join } from "node:path"; import { fileURLToPath } from "node:url";
const HERE=dirname(fileURLToPath(import.meta.url)); const out={};
for (const engine of ["chromium","webkit"]) for (const [w,h,mob] of [[390,844,true],[1280,800,false]]) {
  const b=await (engine==="webkit"?webkit:chromium).launch();
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:mob&&engine==="chromium",hasTouch:mob});
  await ctx.addInitScript(()=>{try{localStorage.clear()}catch{}});
  const p=await ctx.newPage();
  await p.goto("http://127.0.0.1:4232/?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector(".controls-card",{state:"attached",timeout:30000});
  await p.waitForTimeout(1500);
  // type a digit so the board is dirty, then go to the gallery and arm a card
  await p.locator('[role="gridcell"] .cell-native-input').first().click({force:true}).catch(()=>{});
  await p.keyboard.type("5").catch(()=>{});
  await p.waitForTimeout(400);
  const r=await p.evaluate(async ()=>{
    const trig=document.querySelector(".wordmark-trigger,.masthead button,[aria-label*='games' i]");
    trig?.click(); await new Promise(r=>setTimeout(r,900));
    const card=document.querySelector(".game-card button, .game-card");
    card?.click(); await new Promise(r=>setTimeout(r,700));
    const note=document.querySelector(".guard-note");
    const frame=document.querySelector(".guard-note-frame");
    const faces=Array.from(document.querySelectorAll(".guard-face")).map(f=>{const x=f.getBoundingClientRect();return{t:f.innerText.trim(),w:+x.width.toFixed(2),h:+x.height.toFixed(2)}});
    const btns=Array.from(document.querySelectorAll(".guard-btn")).map(f=>{const x=f.getBoundingClientRect();return{t:f.innerText.replace(/\s+/g," ").trim(),w:+x.width.toFixed(2),h:+x.height.toFixed(2)}});
    const b=(e)=>{if(!e)return null;const x=e.getBoundingClientRect();return{w:+x.width.toFixed(2),h:+x.height.toFixed(2)}};
    return {note:b(note),frame:b(frame),faces,btns,
      title:document.querySelector(".guard-note-title")?.innerText.trim(),
      sub:document.querySelector(".guard-note-sub")?.innerText.trim(),
      titlePx:note?getComputedStyle(document.querySelector(".guard-note-title")).fontSize:null};
  });
  out[`${w}x${h}-${engine}`]=r;
  console.log(`[${w}x${h}-${engine}] note ${JSON.stringify(r.note)} frame ${JSON.stringify(r.frame)} title "${r.title}" / "${r.sub}" @${r.titlePx} | btns ${JSON.stringify(r.btns)}`);
  await b.close();
}
writeFileSync(join(HERE,"guard-face.json"),JSON.stringify(out,null,1));
