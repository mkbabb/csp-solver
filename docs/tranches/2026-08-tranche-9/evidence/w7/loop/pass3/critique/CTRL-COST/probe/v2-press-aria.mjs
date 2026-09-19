#!/usr/bin/env node
// CTRL-COST pass-3 critic (re-run) — the blocking row re-pressed, plus the ARMED VERB'S SPOKEN
// SHAPE (accessible name vs description) and the painted asked word in four states.
// Usage: node v2-press-aria.mjs <base> <engine> <WxH> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const base = process.argv[2], engine = process.argv[3] ?? "webkit";
const [w, h] = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5];
const touch = w < 1024;
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);

// dirty the board with the sheet DOWN on the phone
const shut = async () => { const up = await page.evaluate(() => !document.documentElement.classList.contains("drawer-closed")); if (touch && up) { await page.keyboard.press("Escape").catch(()=>{}); await page.waitForTimeout(950);} };
await shut();
await page.evaluate(() => { const i=[...document.querySelectorAll("input.cell-native-input")].find(x=>!x.readOnly&&!x.disabled&&!x.value); if(i) i.focus(); });
await page.keyboard.press("5");
await page.waitForTimeout(350);
if (touch) { const tab = await page.$(".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']"); if (tab) await tab.click({ force: true }).catch(()=>{}); await page.waitForTimeout(950); }

const sig = () => page.evaluate(() => [...document.querySelectorAll("input.cell-native-input")].map(i=>`${i.value||"."}${i.readOnly?"G":""}`).join(""));
const state = () => page.evaluate(() => {
  const r2=(n)=>+n.toFixed(2);
  const face=document.querySelector(".deal-face"); const verb=document.querySelector(".deal-face .act-verb"); const ans=document.querySelector(".deal-face .act-answer");
  const card=document.querySelector(".controls-card");
  const b=(e)=>e?(()=>{const r=e.getBoundingClientRect();return [r2(r.x),r2(r.y),r2(r.width),r2(r.height)];})():null;
  const desc=(e)=>{const id=e?.getAttribute("aria-describedby");return id?(document.getElementById(id)?.textContent||"").trim():null;};
  return { armed: !!document.querySelector(".deal-face[data-armed]"), face:b(face), verb:b(verb), ans:b(ans),
    verbName: verb?.getAttribute("aria-label"), verbDesc: desc(verb), ansName: (ans?.textContent||"").trim(), ansDesc: desc(ans),
    ansVis: ans?getComputedStyle(ans).visibility:null, scrollTop: r2(card?.scrollTop ?? 0), focus: document.activeElement?.className||document.activeElement?.tagName };
});
// scroll the face into view first so the harness's own scroll is not counted
await page.evaluate(() => document.querySelector(".deal-face")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(300);
let focusouts = 0;
await page.evaluate(() => { window.__fo = 0; document.addEventListener("focusout", (e)=>{ if (e.target instanceof Element && e.target.closest(".act-face")) window.__fo++; }, true); });

const before = await sig();
const rest = await state();
const dealBtn = await page.$(".deal-face .act-verb");
if (touch) await dealBtn.tap(); else await dealBtn.click();
await page.waitForTimeout(400);
const armed = await state();
focusouts = await page.evaluate(() => window.__fo);
const midSig = await sig();
// the note berth on this pointer class
const berth = await page.evaluate(() => { const n=document.querySelector(".band-note, .note-berth .washi-label, .note-berth"); return n?{text:(n.textContent||"").trim(), opacity:getComputedStyle(n).opacity}:null; });
if (touch) await dealBtn.tap(); else await dealBtn.click();
await page.waitForTimeout(700);
const after = await sig();
const post = await state();

// painted contrast on the asked word: armed, then armed+hovered
const lum=(c)=>{const [r,g,b]=c;const f=(v)=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
const parse=(s)=>s.match(/[\d.]+/g).slice(0,3).map(Number);
const ratio=(a,b)=>{const L1=lum(a),L2=lum(b);return +(((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(3));};
// re-arm for the contrast read
await page.evaluate(()=>{const a=document.querySelector(".deal-face .act-verb"); a?.click();});
await page.waitForTimeout(300);
const paint = async (hover) => {
  if (hover) { await page.hover(".deal-face .act-verb"); await page.waitForTimeout(250); }
  return page.evaluate(() => {
    const word=[...document.querySelectorAll(".deal-face .act-word")].find(e=>getComputedStyle(e).visibility!=="hidden" && e.classList.contains("is-armed")) || document.querySelector(".deal-face .act-word.is-armed");
    const groundOf=(el)=>{let n=el;while(n){const bg=getComputedStyle(n).backgroundColor;if(bg&&!/rgba\(0, 0, 0, 0\)|transparent/.test(bg))return bg;n=n.parentElement;}return "rgb(255,255,255)";};
    return word?{fg:getComputedStyle(word).color, bg:groundOf(word), txt:word.textContent.trim(), vis:getComputedStyle(word).visibility}:null;
  });
};
const armedPaint = await paint(false);
const hoverPaint = await paint(true);
const res = { base, engine, vp:`${w}x${h}`,
  press1Arms: armed.armed, focusoutsOnFace: focusouts, scrollDelta: +(armed.scrollTop-rest.scrollTop).toFixed(2),
  press2Fires: after !== before, sigChangedOnArm: midSig !== before, faceReflow: [0,1,2,3].map(i=>+(armed.face[i]-rest.face[i]).toFixed(2)),
  ansBoxArmed: armed.ans, ansVisRest: rest.ansVis, ansVisArmed: armed.ansVis,
  verbNameArmed: armed.verbName, verbDescArmed: armed.verbDesc, nameEqualsDesc: armed.verbName === armed.verbDesc,
  ansName: armed.ansName, ansDesc: armed.ansDesc, focusAfterArm: armed.focus,
  berthOnThisPointer: berth,
  armedWord: armedPaint && { ...armedPaint, ratio: ratio(parse(armedPaint.fg), parse(armedPaint.bg)) },
  armedHoveredWord: hoverPaint && { ...hoverPaint, ratio: ratio(parse(hoverPaint.fg), parse(hoverPaint.bg)) },
};
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(engine, w+"x"+h, JSON.stringify(res));
await browser.close();
