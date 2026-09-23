// GC1 ablation: strip the inline --live-fit off the declaring host; the registered initial (0) must show an empty face.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const engine of ["chromium", "webkit"]) for (const port of [4253, 4254]) {
  const b = await pw[engine].launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(2500);
  await p.keyboard.press("g"); await p.waitForTimeout(2000);
  const r = await p.evaluate(() => { const m = document.querySelector(".live-face-fit"); const q = () => { const r = document.querySelector(".board-peek-host").getBoundingClientRect(); return { tf: getComputedStyle(m).transform.slice(0, 40), boardW: +r.width.toFixed(1) }; }; const before = q(); m.style.removeProperty("--live-fit"); const after = q(); const reg = (() => { try { CSS.registerProperty({ name: "--live-fit", syntax: "<number>", inherits: true, initialValue: "0" }); return "unregistered (register succeeded)"; } catch (e) { return "registered (" + e.name + ")"; } })(); return { before, after, reg }; });
  console.log(engine, port === 4253 ? "proto" : "base", JSON.stringify(r));
  await b.close();
}
