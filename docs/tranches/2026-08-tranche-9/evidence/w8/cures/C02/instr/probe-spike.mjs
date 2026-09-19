// RUN: cd <worktree>/web/frontend && node <C02>/instr/probe-spike.mjs --port 4252 --engine chromium
//
// T9-W8 §8.2 cure C02 — THE SPIKE, before a line of the cure is written. The charter's seam
// says a detached probe carrying the other theme's class yields that theme's custom
// properties. This asks the built dist whether that is TRUE, for the two values the two
// theme-keyed surfaces actually bake with:
//   grid : --grid-line-color, read off the board <svg>
//   logo : color,             read off the wordmark <svg> (a rule on the element itself,
//                             `.handwritten-logo { color: var(--color-foreground) }`)
// and for the pose SVG STRINGS the two surfaces would hand the rasterizer.
//
// Method: read the live values; read the PROBE's values (a shallow clone of the real element
// inside an off-screen wrapper carrying `class="dark"` or no class); then TOGGLE the theme for
// real and read the live values again. The probe is right only if probe(other) == live(after).
// Nothing is written to src; the page is left as it was.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const PORT = arg("port", "4252");
const ENGINE = arg("engine", "chromium");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const READ = () => {
  // The probe, exactly as the cure would build it: an off-screen wrapper carrying the other
  // theme's class, a SHALLOW clone of the real element inside it (so a rule matching the
  // element's own selector still matches), read synchronously and torn down in the same task
  // — no await, so no query from outside can ever see it in the document.
  const probeValue = (el, dark, prop) => {
    if (!el) return null;
    const wrap = document.createElement("div");
    wrap.setAttribute("style", "position:absolute;left:-99999px;top:0;width:0;height:0;overflow:hidden;");
    if (dark) wrap.className = "dark";
    const clone = el.cloneNode(false);
    clone.removeAttribute("id");
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
    try {
      return getComputedStyle(clone).getPropertyValue(prop).trim() || null;
    } finally {
      wrap.remove();
    }
  };
  const gridSvg = document.querySelector(".board-group svg") || document.querySelector("svg.hand-drawn-grid");
  const logoSvg = document.querySelector("svg.handwritten-logo");
  const live = (el, prop) => (el ? getComputedStyle(el).getPropertyValue(prop).trim() : null);
  const isDark = document.documentElement.classList.contains("dark");
  return {
    isDark,
    gridSel: gridSvg ? gridSvg.getAttribute("class") : null,
    logoSel: logoSvg ? logoSvg.getAttribute("class") : null,
    liveGrid: live(gridSvg, "--grid-line-color"),
    liveLogo: live(logoSvg, "color"),
    probeDarkGrid: probeValue(gridSvg, true, "--grid-line-color"),
    probeLightGrid: probeValue(gridSvg, false, "--grid-line-color"),
    probeDarkLogo: probeValue(logoSvg, true, "color"),
    probeLightLogo: probeValue(logoSvg, false, "color"),
    // The filter defs the poses inline — theme-dependent or not is the other π question.
    grainDefs: (() => { const e = document.getElementById("grain-static"); return e ? new XMLSerializer().serializeToString(e).length : null; })(),
    grainDefsHash: (() => {
      const e = document.getElementById("grain-static");
      if (!e) return null;
      const s = new XMLSerializer().serializeToString(e);
      let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
      return h;
    })(),
  };
};

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "light" });
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(6000);
const before = await page.evaluate(READ);
await page.evaluate(() => document.querySelector(".sun-moon-toggle").click());
await page.waitForTimeout(2500);
const after = await page.evaluate(READ);
await ctx.close();
await browser.close();

const line = (o) => JSON.stringify(o, null, 1);
console.log("BEFORE (booted light):\n" + line(before));
console.log("AFTER  (toggled dark):\n" + line(after));
console.log("\nVERDICTS");
console.log(`  grid: probe(dark) "${before.probeDarkGrid}" == live(after) "${after.liveGrid}"  → ${before.probeDarkGrid === after.liveGrid}`);
console.log(`  grid: probe(light) "${after.probeLightGrid}" == live(before) "${before.liveGrid}" → ${after.probeLightGrid === before.liveGrid}`);
console.log(`  logo: probe(dark) "${before.probeDarkLogo}" == live(after) "${after.liveLogo}"  → ${before.probeDarkLogo === after.liveLogo}`);
console.log(`  logo: probe(light) "${after.probeLightLogo}" == live(before) "${before.liveLogo}" → ${after.probeLightLogo === before.liveLogo}`);
console.log(`  grain defs identical across the flip: ${before.grainDefsHash === after.grainDefsHash} (len ${before.grainDefs} → ${after.grainDefs})`);
