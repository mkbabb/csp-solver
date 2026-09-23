// MOT-LADDER pass 6 · π AT REST, three pages per pose (AFTER · CONTROL · CONTROL-b, the noise arm),
// both engines, on ONE encoded payload whose given-set is READ BACK through the aria-label corpus
// (count > 0 asserted — the digits are SVG glyphs, so innerText is empty; pass 5's vacuity).
// Whole-DOM census keyed by structural ancestry (tag:nth path), computed PAINT properties + tag
// names, plus a PAINTED-BYTES diff of the viewport (sharp raw RGBA). Reduce emulated: a rest pose.
// Usage: node pi6.mjs <after url> <control url> <out json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
const [AFTER, CONTROL, OUT] = process.argv.slice(2);
const PAYLOAD = process.env.PAYLOAD ?? "ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw"; // encodeSudoku(3, the 71 givens, 81) — the pass-4/5 payload
const POSES = [
  { name: "play-1440-light-fine", w: 1440, h: 900, dark: false, touch: false, gallery: false },
  { name: "play-1440-dark-fine", w: 1440, h: 900, dark: true, touch: false, gallery: false },
  { name: "play-390x844-light-coarse", w: 390, h: 844, dark: false, touch: true, gallery: false },
  { name: "gallery-1440-light-fine", w: 1440, h: 900, dark: false, touch: false, gallery: true },
  { name: "gallery-390x844-dark-coarse", w: 390, h: 844, dark: true, touch: true, gallery: true },
];
const PROPS = ["color","backgroundColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","boxShadow","outlineStyle","outlineColor","outlineWidth","fill","stroke","strokeWidth","fillOpacity","strokeOpacity","opacity","fontFamily","fontSize","fontWeight","lineHeight","transform","filter","visibility","clipPath","transitionDuration","animationDuration"];
async function shoot(browser, base, pose) {
  const ctx = await browser.newContext({ viewport: { width: pose.w, height: pose.h }, hasTouch: pose.touch, reducedMotion: "reduce", colorScheme: pose.dark ? "dark" : "light" });
  const p = await ctx.newPage();
  await p.goto(`${base}/?game=sudoku&board=${PAYLOAD}`);
  await p.locator(".board-cells").first().waitFor();
  const givens = await p.evaluate(() => Array.from(document.querySelectorAll('.board-cells [aria-label]')).map((e) => e.getAttribute("aria-label")).join("|"));
  if (pose.dark && !(await p.evaluate(() => document.documentElement.classList.contains("dark")))) {
    await p.locator("button.sun-moon-toggle, button[aria-label*='dark mode']").first().click();
  }
  if (pose.gallery) { await p.locator("button.logo-trigger").first().click(); await p.locator('[aria-label="Choose a puzzle"]').first().waitFor(); }
  let prev = "", snap = null;
  for (let i = 0; i < 40; i++) {
    snap = await p.evaluate((PROPS) => {
      const out = {};
      const key = (el) => { const parts = []; for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const sib = e.parentElement ? Array.from(e.parentElement.children).filter((c) => c.tagName === e.tagName) : [e]; parts.unshift(`${e.tagName.toLowerCase()}:${sib.indexOf(e)}`); } return parts.join(">"); };
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        out[key(el)] = { tag: el.tagName, rect: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100), ...Object.fromEntries(PROPS.map((k) => [k, cs[k]])) };
      }
      return out;
    }, PROPS);
    const sig = JSON.stringify(snap);
    if (sig === prev) break;
    prev = sig; await p.waitForTimeout(150);
  }
  const png = await p.screenshot();
  const raw = await sharp(png).raw().ensureAlpha().toBuffer();
  await ctx.close();
  return { givens, snap, raw };
}
function diff(a, b) {
  const ka = Object.keys(a.snap), kb = Object.keys(b.snap);
  const oneSided = ka.filter((k) => !(k in b.snap)).length + kb.filter((k) => !(k in a.snap)).length;
  let moved = 0, maxd = 0; const paint = {};
  for (const k of ka) { if (!(k in b.snap)) continue; const x = a.snap[k], y = b.snap[k];
    const d = Math.max(...x.rect.map((v, i) => Math.abs(v - y.rect[i]))); if (d > 0.5) moved++; maxd = Math.max(maxd, d);
    if (x.tag !== y.tag) paint.tag = (paint.tag ?? 0) + 1;
    for (const p of Object.keys(x)) if (p !== "rect" && p !== "tag" && x[p] !== y[p]) paint[p] = (paint[p] ?? 0) + 1; }
  let px = 0; for (let i = 0; i < a.raw.length; i += 4) if (a.raw[i] !== b.raw[i] || a.raw[i+1] !== b.raw[i+1] || a.raw[i+2] !== b.raw[i+2]) px++;
  return { keys: ka.length, oneSided, moved, maxd: +maxd.toFixed(2), paint, px };
}
const rows = [];
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await eng.launch();
  for (const pose of POSES) {
    const A = await shoot(browser, AFTER, pose), C = await shoot(browser, CONTROL, pose), Cb = await shoot(browser, CONTROL, pose);
    const n = (A.givens.match(/given clue/g) ?? []).length;
    const sha = [A, C, Cb].map((x) => createHash("sha1").update(x.givens).digest("hex").slice(0, 12));
    if (!(n > 0) || new Set(sha).size !== 1) throw new Error(`payload read-back failed ${name} ${pose.name}: n=${n} ${sha}`);
    const row = { engine: name, pose: pose.name, givens: n, givensSha1: sha[0], afterVsControl: diff(A, C), noise: diff(C, Cb) };
    rows.push(row);
    console.log(`${name} ${pose.name}: givens ${n} sha1 ${sha[0]} ×3 · A−C keys ${row.afterVsControl.keys} one-sided ${row.afterVsControl.oneSided} moved ${row.afterVsControl.moved} maxΔ ${row.afterVsControl.maxd} paint ${JSON.stringify(row.afterVsControl.paint)} px ${row.afterVsControl.px} | noise one-sided ${row.noise.oneSided} moved ${row.noise.moved} paint ${JSON.stringify(row.noise.paint)} px ${row.noise.px}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: PAYLOAD, after: AFTER, control: CONTROL, rows }, null, 1) + "\n");
