// A1 → A2 experiment: re-express the proto's masked rects in page and screenshot the grid.
// node exp.mjs <engine> <variant> <out.png> [scheme]
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [engine, variant, out, scheme = "light"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[engine].launch({ args: engine === "chromium" ? ["--force-color-profile=srgb"] : [] });
const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: "reduce" });
const p = await c.newPage(); await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto(`http://127.0.0.1:4253/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(4500);
const info = await p.evaluate((v) => {
  const rects = [...document.querySelectorAll(".hand-drawn-grid rect.boil-frame-bitmap")];
  for (const r of rects) {
    const id = r.getAttribute("mask").match(/#([^)]+)/)[1];
    const img = document.getElementById(id).querySelector("image");
    const href = img.getAttribute("href");
    if (v === "cssmask") {
      r.removeAttribute("mask");
      r.style.maskImage = `url(${href})`; r.style.webkitMaskImage = `url(${href})`;
      r.style.maskSize = "100% 100%"; r.style.webkitMaskSize = "100% 100%";
      r.style.maskRepeat = "no-repeat"; r.style.webkitMaskRepeat = "no-repeat";
      r.style.maskMode = "alpha";
    } else if (v === "scaled") {

      img.setAttribute("width", String(1000 * 2)); img.setAttribute("height", String(1000 * 2)); img.setAttribute("transform", "scale(0.5)");
    } else if (v === "userspace") {
      const m = document.getElementById(id); m.setAttribute("maskUnits", "userSpaceOnUse"); m.setAttribute("x", "0"); m.setAttribute("y", "0"); m.setAttribute("width", "1000"); m.setAttribute("height", "1000");
    } else if (v === "htmlmask") {
      // A2: an HTML layer over the svg box, mask-image = the pose, background = the ink
      const svg = r.ownerSVGElement; const host = svg.parentElement; r.style.display = "none";
      if (r.classList.contains("is-active")) {
        const d = document.createElement("div");
        const box = svg.getBoundingClientRect(), hb = host.getBoundingClientRect();
        const side = Math.min(box.width, box.height);
        Object.assign(d.style, { position: "absolute", left: `${box.left - hb.left + (box.width - side) / 2}px`, top: `${box.top - hb.top + (box.height - side) / 2}px`, width: `${side}px`, height: `${side}px`, background: "var(--grid-line-color)", maskImage: `url(${href})`, webkitMaskImage: `url(${href})`, maskSize: "100% 100%", webkitMaskSize: "100% 100%", zIndex: 1, pointerEvents: "none" });
        host.appendChild(d);
      }
    }
  }
  return { n: rects.length, ua: navigator.userAgent.slice(0, 40) };
}, variant);
await p.waitForTimeout(800);
const box = await p.evaluate(() => { const r = document.querySelector(".hand-drawn-grid").getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
await p.screenshot({ path: out, clip: box });
console.log(JSON.stringify(info));
await b.close();
