// ACC-SIX pass-7 CRITIC: the COUNT LINE's glyph-text AA (registry-v5 §2.11 statistic; LAWS P6 §E), unread by the lane
// in pass 6 and pass 7. The chair's glyph-pop reads the subject's BOX, and the yielding meta's box is 0 px tall (its text
// overflows a zero box), so the clip here is the TEXT RUN's Range rect; the population, clauses G1-G3 and the plants
// are the chair's (pass7/instruments/glyph-pop.mjs + paint-lib.mjs, imported, not re-implemented). The in-run plants
// FAINT30 (keeps `color`) and EMPTY must RED. P1 payload (9x9), one legal write (the count reads "1 of 51 on the
// board"), 1280x800 fine, PRM, DPR 2, both themes, both engines. usage: BASE=http://127.0.0.1:4232 node c7-count-aa.mjs
import { onOff, lum, ratio, median, maxDelta } from "../../../instruments/paint-lib.mjs";
import { TEXT_PLANTS } from "../../../instruments/glyph-pop.mjs";
import { chromium, webkit, BOARD, writeLegal } from "./p7-common.mjs";
const S = ".margin-note-meta";
async function pop(page) {
  const clip = await page.evaluate((s) => { const m = document.querySelector(s); if (!m) return null; const r = document.createRange(); r.selectNodeContents(m); const t = r.getBoundingClientRect(); return { x: Math.floor(t.x) - 2, y: Math.floor(t.y) - 2, width: Math.ceil(t.width) + 4, height: Math.ceil(t.height) + 4 }; }, S);
  if (!clip) return { why: "G0 absent" };
  const off = `${S}, ${S} * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`;
  const A = await onOff(page, clip, off);
  const p = [];
  for (let i = 0; i < A.on.data.length; i += 3) if (maxDelta(A.on.data, A.off.data, i) >= 6) p.push(ratio(lum(A.on.data, i), lum(A.off.data, i)));
  const med = median(p), frac = p.length ? p.filter((v) => v < 4.5).length / p.length : 1;
  return { n: p.length, med: +med.toFixed(3), frac: +frac.toFixed(3), red: p.length < 40 || med < 4.5 };
}
for (const [e, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage(); await page.goto(process.env.BASE + "/" + BOARD); await page.waitForSelector(".sudoku-cell input", { timeout: 90000 }); await page.waitForTimeout(1500);
    await writeLegal(page, 900);
    const text = await page.evaluate((s) => document.querySelector(s)?.textContent?.trim(), S);
    const color = await page.evaluate((s) => { const m = document.querySelector(s); return m ? getComputedStyle(m).color : null; }, S);
    const clean = await pop(page);
    const planted = {};
    for (const [k, css] of Object.entries(TEXT_PLANTS(S))) {
      if (typeof css !== "string") continue;
      const h = await page.addStyleTag({ content: css }); await page.waitForTimeout(60);
      planted[k] = await pop(page); await h.evaluate((n) => n.remove());
    }
    console.log(`COUNT-AA ${e} ${scheme} "${text}" color ${color} · clean pop ${clean.n} median ${clean.med} <4.5 ${clean.frac} ${clean.red ? "RED" : "GREEN"} · ` + Object.entries(planted).map(([k, v]) => `${k} ${v.n}/${v.med}/${v.frac} ${v.red ? "RED" : "GREEN"}`).join(" · "));
    await ctx.close();
  }
  await br.close();
}
