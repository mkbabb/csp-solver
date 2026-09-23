// mid-fold rect read at flip-glide currentTime 60 (instrument only)
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const port = process.argv[2] ?? "4253";
const t = Number(process.argv[3] ?? 60);
const shot = process.argv[4];
const b = await pw[process.argv[5] ?? "chromium"].launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(3000);
await p.keyboard.press("g");
await p.waitForFunction(() => document.getAnimations().some((a) => a.id === "flip-glide"));
const r = await p.evaluate((t) => {
  for (const a of document.getAnimations()) { a.pause(); if (a.id === "flip-glide") a.currentTime = t; }
  const R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
  return {
    cards: [...document.querySelectorAll(".game-card")].map((c) => [String(c.className).replace("game-card ", ""), R(c), getComputedStyle(c).zIndex]),
    board: R(document.querySelector(".board-peek-host")),
    band: R(document.querySelector(".staging-band")),
    zed: [...document.querySelectorAll(".staging-band *, .game-card.is-center *")].filter((e) => getComputedStyle(e).zIndex !== "auto").map((e) => [String(e.className?.baseVal ?? e.className).split(" ")[0], getComputedStyle(e).zIndex, getComputedStyle(e).position]),
  };
}, t);
console.log(JSON.stringify(r));
if (shot) { await p.waitForTimeout(100); await p.screenshot({ path: shot }); }
await b.close();
