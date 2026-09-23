// quick look: node sanity.mjs <port> <engine> <vw>x<vh> <scheme> <outprefix>
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, vp, scheme, out] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[engine].launch();
const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, colorScheme: scheme });
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`);
await p.waitForSelector(".game-cell"); await p.waitForTimeout(4000);
const info = await p.evaluate(() => ({
  gridRects: document.querySelectorAll(".hand-drawn-grid rect.boil-frame-bitmap").length,
  gridImgs: document.querySelectorAll(".hand-drawn-grid image").length,
  logoRects: document.querySelectorAll(".handwritten-logo rect.logo-pose-bmp").length,
  gridFill: (() => { const r = document.querySelector(".hand-drawn-grid rect.boil-frame-bitmap"); return r ? getComputedStyle(r).fill : null; })(),
  board: (() => { const r = document.querySelector(".board-peek-host").getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; })(),
}));
console.log(JSON.stringify(info));
await p.screenshot({ path: `${out}-playing.png` });
await p.keyboard.press("g");
await p.waitForTimeout(330);
await p.screenshot({ path: `${out}-fold330.png` });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}-gallery.png` });
const g = await p.evaluate(() => { const q = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); }; return { vp: q(".gallery-viewport"), card: q(".game-card.is-center"), face: q(".game-card.is-center .game-card-face"), board: q(".board-peek-host"), fit: document.querySelector(".live-face-fit")?.style.getPropertyValue("--live-fit") }; });
console.log(JSON.stringify(g));
console.log("errors", errs.slice(0, 5));
await b.close();
