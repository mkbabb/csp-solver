// CTRL-TAPE pass-10 π: every element OUTSIDE the drawer case, tags + rects + computed paint, lane vs control,
// one payload (pinned board), reduced motion, light and dark. usage: A=<control> B=<lane> node pi10.mjs <engine>
// One browser per run, a context per cell, all closed in finally. A=B gives the control-vs-control floor.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const engine = process.argv[2] || "chromium";
const A = process.env.A, B = process.env.B;
const Q = "/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = [
  { name: "rail1440", w: 1440, h: 900, touch: false },
  { name: "dock390shut", w: 390, h: 844, touch: true },
  { name: "coarse1280", w: 1280, h: 800, touch: true },
];
const snap = () => {
  const r2 = (n) => Math.round(n * 100) / 100;
  const caseEl = document.querySelector(".drawer-case");
  const out = [];
  for (const e of document.querySelectorAll("body *")) {
    if (caseEl && (caseEl === e || caseEl.contains(e))) continue;
    if (e.closest("script,style,noscript")) continue;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    const path = [];
    for (let p = e; p && p !== document.body; p = p.parentElement) path.unshift(p.tagName.toLowerCase() + (p.id ? "#" + p.id : ""));
    out.push({
      k: path.join(">"),
      x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height),
      p: [s.color, s.backgroundColor, s.fontSize, s.fontFamily.split(",")[0], s.opacity, s.transform, s.filter, s.visibility, s.display].join("|"),
    });
  }
  return out;
};
async function read(browser, base, cell, theme) {
  const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, isMobile: cell.touch && cell.w < 1024, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: "reduce" });
  try {
    const p = await ctx.newPage();
    await p.goto(base + Q, { waitUntil: "load" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await p.waitForTimeout(1500); // the boil settles under reduce; both sides wait the same
    const id = await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s))?.split("/").pop());
    const givens = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i, k) => (i.value ? k + ":" + i.value : "")).filter(Boolean).slice(0, 5).join(","));
    return { id, givens, els: await p.evaluate(snap) };
  } finally {
    await ctx.close();
  }
}
const browser = await pw[engine].launch();
try {
  for (const cell of CELLS)
    for (const theme of ["light", "dark"]) {
      const a = await read(browser, A, cell, theme);
      const b = await read(browser, B, cell, theme);
      const keyed = (els) => {
        const seen = new Map(), m = new Map();
        for (const e of els) { const c = seen.get(e.k) ?? 0; seen.set(e.k, c + 1); m.set(e.k + "@" + c, e); }
        return m;
      };
      const ma = keyed(a.els), mb = keyed(b.els);
      let rect = 0, paint = 0, tag = 0;
      const ex = [];
      for (const [k, x] of ma) {
        const y = mb.get(k);
        if (!y) { tag++; if (ex.length < 4) ex.push("missing in lane " + k); continue; }
        if (Math.abs(x.x - y.x) > 0.5 || Math.abs(x.y - y.y) > 0.5 || Math.abs(x.w - y.w) > 0.5 || Math.abs(x.h - y.h) > 0.5) { rect++; if (ex.length < 4) ex.push("rect " + k); }
        if (x.p !== y.p) { paint++; if (ex.length < 4) ex.push("paint " + k); }
      }
      for (const k of mb.keys()) if (!ma.has(k)) { tag++; if (ex.length < 4) ex.push("extra in lane " + k); }
      console.log(JSON.stringify({ en: engine, cell: cell.name, theme, ctl: a.id, lane: b.id, givensEq: a.givens === b.givens, nA: a.els.length, nB: b.els.length, tag, rect, paint, ex }));
    }
} finally {
  await browser.close();
}
