// mid-fold stacking read: which boxes paint over the folding board (instrument only)
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw.chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })).newPage();
await p.goto(`http://127.0.0.1:4253/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(3000);
await p.keyboard.press("g");
await p.waitForFunction(() => document.getAnimations().some((a) => a.id === "flip-glide"));
const r = await p.evaluate(() => {
  for (const a of document.getAnimations()) a.pause();
  const chain = (sel) => { const out = []; for (let e = document.querySelector(sel); e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.position !== "static" || cs.zIndex !== "auto" || cs.transform !== "none" || cs.isolation !== "auto" || cs.clipPath !== "none" || cs.willChange !== "auto" || cs.opacity !== "1") out.push(`${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).split(" ")[0]} pos=${cs.position} z=${cs.zIndex} tf=${cs.transform === "none" ? "-" : "T"} wc=${cs.willChange} op=${cs.opacity}`); } return out; };
  const pt = (x, y) => { const e = document.elementFromPoint(x, y); return e ? `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).split(" ")[0]}` : null; };
  return { band: chain(".staging-band"), board: chain(".board-peek-host"), frame: chain(".game-card.is-center .game-card-frame"), hitBottom: pt(400, 700) };
});
console.log(JSON.stringify(r, null, 1));
await p.evaluate(() => { for (const a of document.getAnimations()) if (a.id === "flip-glide") a.currentTime = 60; });
await p.waitForTimeout(100);
await p.screenshot({ path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion/shots/z-paused-60.png", scale: "css" });
await b.close();
