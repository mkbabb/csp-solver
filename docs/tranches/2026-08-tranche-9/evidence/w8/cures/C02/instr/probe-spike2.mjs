// RUN: cd <worktree>/web/frontend && node <C02>/instr/probe-spike2.mjs --port 4252 --engine chromium
//
// T9-W8 §8.2 cure C02 — SPIKE 2, the direction spike 1 REFUTED. A probe wrapper carrying
// `class="dark"` yields the dark theme from a light page (proved). The reverse does NOT work by
// omission: under `<html class="dark">` an unclassed wrapper INHERITS the dark tokens, so
// "no class" is not "light" — it is "whatever my ancestors are". The cost is symmetric
// (the charter: dark→light 1,202.4), so the light direction has to be built, not assumed.
//
// THE FIX UNDER TEST: the light wrapper re-declares, inline, every custom property any
// `:root` / `:host` / `html` rule in the document's own stylesheets declares — the light
// ladder, copied off the cascade rather than enumerated by hand — so the wrapper's inline
// declarations (the highest-specificity origin) out-rank the inherited dark ones and every
// `var()` chain under it resolves light. Verified against the values a REAL flip produces.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const PORT = arg("port", "4252");
const ENGINE = arg("engine", "chromium");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const HELPERS = `
window.__c02 = (() => {
  const OFFSCREEN = "position:absolute;left:-99999px;top:0;width:0;height:0;overflow:hidden;";
  let rootDecl = null;
  const ROOTISH = /^(:root|:host)$/;
  function rootLadder() {
    if (rootDecl !== null) return rootDecl;
    const out = [];
    const walk = (rules) => {
      for (const r of rules) {
        const sel = r.selectorText;
        if (sel) {
          if (!sel.split(",").some((p) => ROOTISH.test(p.trim()))) continue;
          const st = r.style;
          for (let i = 0; i < st.length; i++) {
            const name = st[i];
            if (name.startsWith("--")) out.push(name + ":" + st.getPropertyValue(name) + ";");
          }
          continue;
        }
        const kids = r.cssRules;
        if (!kids) continue;
        // A conditional group counts only while its condition HOLDS: @media print declares
        // --grid-line-color black for ":root, .dark" at once, and a collector blind to the
        // condition reads the printed board's ink as the light theme's (measured: #000).
        if (r.media) { try { if (!window.matchMedia(r.media.mediaText).matches) continue; } catch {} }
        else if (r.conditionText !== undefined) { try { if (window.CSS && CSS.supports && !CSS.supports(r.conditionText)) continue; } catch {} }
        try { walk(kids); } catch {}
      }
    };
    for (const ss of document.styleSheets) { try { walk(ss.cssRules); } catch {} }
    rootDecl = out.join("");
    return rootDecl;
  }
  function probe(el, dark, props) {
    if (!el) return null;
    const wrap = document.createElement("div");
    wrap.setAttribute("style", OFFSCREEN + (dark ? "" : rootLadder()));
    if (dark) wrap.className = "dark";
    const clone = el.cloneNode(false);
    clone.removeAttribute("id");
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
    try {
      const cs = getComputedStyle(clone);
      const o = {};
      for (const p of props) o[p] = cs.getPropertyValue(p).trim() || null;
      return o;
    } finally { wrap.remove(); }
  }
  return { probe, ladderLen: () => rootLadder().length, ladderCount: () => (rootLadder().match(/;/g) || []).length };
})();
`;

const READ = () => {
  const gridSvg = document.querySelector("svg.hand-drawn-grid") || document.querySelector(".board-group svg");
  const logoSvg = document.querySelector("svg.handwritten-logo");
  const live = (el, prop) => (el ? getComputedStyle(el).getPropertyValue(prop).trim() : null);
  const defs = (id) => { const e = document.getElementById(id); return e ? new XMLSerializer().serializeToString(e) : null; };
  const h = (s) => { if (s == null) return null; let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return x; };
  const poseIds = [...document.querySelectorAll("filter[id^='logo-pose'],filter[id*='pose']")].map((e) => e.id);
  return {
    isDark: document.documentElement.classList.contains("dark"),
    gridClass: gridSvg ? gridSvg.getAttribute("class") : null,
    liveGrid: live(gridSvg, "--grid-line-color"),
    liveLogo: live(logoSvg, "color"),
    probeDark: {
      grid: window.__c02.probe(gridSvg, true, ["--grid-line-color"]),
      logo: window.__c02.probe(logoSvg, true, ["color"]),
    },
    probeLight: {
      grid: window.__c02.probe(gridSvg, false, ["--grid-line-color"]),
      logo: window.__c02.probe(logoSvg, false, ["color"]),
    },
    ladder: { len: window.__c02.ladderLen(), decls: window.__c02.ladderCount() },
    poseIds,
    defsHashes: { grain: h(defs("grain-static")), ...Object.fromEntries(poseIds.map((id) => [id, h(defs(id))])) },
  };
};

const run = async (startDark) => {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "light" });
  if (startDark) await ctx.addInitScript("try{localStorage.setItem('sudoku-color-scheme','dark')}catch{}");
  await ctx.addInitScript(HELPERS);
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(6000);
  const before = await page.evaluate(READ);
  await page.evaluate(() => document.querySelector(".sun-moon-toggle").click());
  await page.waitForTimeout(2500);
  const after = await page.evaluate(READ);
  await ctx.close();
  await browser.close();
  return { before, after };
};

for (const startDark of [false, true]) {
  const { before, after } = await run(startDark);
  const dir = startDark ? "BOOTED DARK → light" : "BOOTED LIGHT → dark";
  console.log(`\n================ ${dir} ================`);
  console.log(`ladder: ${before.ladder.decls} custom-property declarations, ${before.ladder.len} B`);
  console.log(`grid class: ${before.gridClass}`);
  console.log(`live before: grid ${before.liveGrid} · logo ${before.liveLogo}   (isDark ${before.isDark})`);
  console.log(`live after : grid ${after.liveGrid} · logo ${after.liveLogo}   (isDark ${after.isDark})`);
  const otherGrid = startDark ? before.probeLight.grid["--grid-line-color"] : before.probeDark.grid["--grid-line-color"];
  const otherLogo = startDark ? before.probeLight.logo.color : before.probeDark.logo.color;
  console.log(`probe(other) BEFORE the flip: grid ${otherGrid} · logo ${otherLogo}`);
  console.log(`  grid probe == live-after → ${otherGrid === after.liveGrid}`);
  console.log(`  logo probe == live-after → ${otherLogo === after.liveLogo}`);
  const backGrid = startDark ? after.probeDark.grid["--grid-line-color"] : after.probeLight.grid["--grid-line-color"];
  const backLogo = startDark ? after.probeDark.logo.color : after.probeLight.logo.color;
  console.log(`probe(other) AFTER the flip (the way back): grid ${backGrid} · logo ${backLogo}`);
  console.log(`  grid probe == live-before → ${backGrid === before.liveGrid}`);
  console.log(`  logo probe == live-before → ${backLogo === before.liveLogo}`);
  const dsame = JSON.stringify(before.defsHashes) === JSON.stringify(after.defsHashes);
  console.log(`filter defs identical across the flip: ${dsame}  (${JSON.stringify(before.defsHashes)})`);
}
