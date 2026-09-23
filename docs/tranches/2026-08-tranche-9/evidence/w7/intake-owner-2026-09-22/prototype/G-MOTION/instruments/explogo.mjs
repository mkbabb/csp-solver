// logo mask experiment: node explogo.mjs <engine> <variant> <out.png>
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [engine, variant, out] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[engine].launch({ args: engine === "chromium" ? ["--force-color-profile=srgb"] : [] });
const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const p = await c.newPage(); await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto(`http://127.0.0.1:4253/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(4500);
const info = await p.evaluate((v) => {
  const svg = document.querySelector(".masthead .handwritten-logo");
  const vb = svg.viewBox.baseVal; const r = svg.getBoundingClientRect();
  for (const img of svg.querySelectorAll("mask image")) {
    if (v === "quality") img.setAttribute("image-rendering", "optimizeQuality");
    if (v === "pixelated") img.style.imageRendering = "pixelated";
  }
  const bmp = svg.querySelector("mask image"); const im = new Image(); im.src = bmp.getAttribute("href");
  return { vb: [vb.width, vb.height], css: [r.width, r.height], dpr: devicePixelRatio };
}, variant);
await p.waitForTimeout(600);
const nat = await p.evaluate(async () => { const src = document.querySelector(".masthead .handwritten-logo mask image").getAttribute("href"); const im = new Image(); im.src = src; await im.decode(); return [im.naturalWidth, im.naturalHeight]; });
const box = await p.evaluate(() => { const r = document.querySelector(".masthead .handwritten-logo").getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
await p.screenshot({ path: out, clip: box });
console.log(JSON.stringify({ ...info, bitmap: nat }));
await b.close();
