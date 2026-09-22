// f3/f4 — the INK GATE's subject: `checking`'s paper over `what fits`'s ink. A single element
// crop cannot show it (the two live in different wells), so the clip is computed from the two
// boxes the gate measures: the caption's text range and the tape below it.
import { chromium, webkit } from "playwright";
const OUT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/CTRL-FACE/frames";
for (const [name,L] of [["chromium",chromium],["webkit",webkit]]) {
  const b=await L.launch();
  const p=await (await b.newContext({viewport:{width:390,height:844},baseURL:"http://127.0.0.1:4234",hasTouch:true,isMobile:name==="chromium",deviceScaleFactor:2})).newPage();
  await p.emulateMedia({reducedMotion:"reduce",colorScheme:"light"});
  await p.goto("/?size=3&difficulty=EASY",{waitUntil:"networkidle"});
  await p.waitForSelector("svg.handwritten-logo",{timeout:20000});
  await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
  const card=p.locator(".controls-card:visible").first();
  if(!(await card.isVisible().catch(()=>false))){await p.locator(".drawer-tab").tap();await p.waitForTimeout(900);}
  await p.waitForTimeout(400);
  const clip=await p.evaluate(()=>{
    const root=[...document.querySelectorAll(".controls-card")].find(c=>c.getClientRects().length);
    const cap=[...root.querySelectorAll(".zone-row-label")].find(e=>e.textContent.trim()==="what fits");
    const tape=[...root.querySelectorAll(".washi-tag")].find(e=>e.textContent.trim()==="checking");
    const a=cap.getBoundingClientRect(), t=tape.getBoundingClientRect();
    return {x:Math.max(0,Math.min(a.left,t.left)-10), y:Math.max(0,a.top-8),
            width:Math.min(390,Math.max(a.right,t.right)+10)-Math.max(0,Math.min(a.left,t.left)-10),
            height:(t.bottom+10)-(a.top-8)};
  });
  await p.screenshot({path:`${OUT}/f${name==="chromium"?3:4}-p4-390x844-light-coarse-${name}-checking-over-what-fits.png`,clip});
  console.log("wrote",name,JSON.stringify(clip));
  await b.close();
}
