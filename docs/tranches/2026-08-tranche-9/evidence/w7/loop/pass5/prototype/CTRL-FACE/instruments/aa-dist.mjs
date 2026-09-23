// CTRL-FACE pass 5 — painted AA with its DISTRIBUTION and the SENSITIVITY row (registry-v4 §2.12,
// LAWS P4). Per target: paper = median luminance of a 3-px ring OUTSIDE the text's line box (the
// ground the word abuts); per column of the glyph band, ink = the pixel furthest from paper. Columns
// count as INK at k% of the median column ink mass (k = 50/70/90/100); for each k: worst column,
// p30, median, and the fraction of ink columns under 4.5:1. One encoded board, both themes,
// both engines, dpr 2, reduced motion, the zone scrolled clear of the bar's fade.
// usage: node aa-dist.mjs <out.log>   (ARMS env name=url,...)
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright"); const sharp = require("sharp");
const PAYLOAD = "?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const ARMS = Object.fromEntries((process.env.ARMS || "proto=http://127.0.0.1:4236,control=http://127.0.0.1:4235").split(",").map((a) => a.split("=")));
const TARGETS = {
  unselectedChip: ".new-game-zone .ctrl-btn[aria-pressed='false'] .ctrl-word",
  selectedLevel: ".new-game-zone .staged-section:last-of-type .ctrl-btn[aria-pressed='true'] .ctrl-word",
  levelH2: ".new-game-zone .staged-section:last-of-type h2",
  dealt: ".new-game-zone .dt-label",
  dealSublabel: ".new-game-zone .deal-btn .icon-sublabel",
  keysSublabel: ".action-bar .info-btn .icon-sublabel",
};
const L = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const q = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; };
const lines = [];
for (const eng of ["chromium", "webkit"]) {
  const b = await pw[eng].launch();
  for (const theme of ["light", "dark"]) for (const [arm, base] of Object.entries(ARMS)) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(base + "/" + PAYLOAD); await p.waitForSelector("svg.handwritten-logo"); await p.waitForTimeout(900);
    await p.evaluate(() => { const c = document.querySelector(".controls-card"); const d = document.querySelector(".new-game-zone .deal-row"); const bar = document.querySelector(".action-bar"); const over = d.getBoundingClientRect().bottom - (bar.getBoundingClientRect().top - 40); if (over > 0) c.scrollTop += over; });
    await p.waitForTimeout(400);
    const shot = await p.screenshot({ scale: "device" });
    const img = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => { const i = (y * img.info.width + x) * 3; return [img.data[i], img.data[i + 1], img.data[i + 2]]; };
    const rects = await p.evaluate((T) => Object.fromEntries(Object.entries(T).map(([k, s]) => { const e = document.querySelector(s); if (!e || !e.getClientRects().length) return [k, null]; const rg = document.createRange(); rg.selectNodeContents(e); const qs = [...rg.getClientRects()].filter((r) => r.width > 0); if (!qs.length) return [k, null]; return [k, { x: Math.min(...qs.map((r) => r.x)), y: Math.min(...qs.map((r) => r.y)), r: Math.max(...qs.map((r) => r.right)), b: Math.max(...qs.map((r) => r.bottom)) }]; })), TARGETS);
    for (const [k, r] of Object.entries(rects)) {
      if (!r) { lines.push(`${eng} ${theme} ${arm.padEnd(8)} ${k.padEnd(15)} ABSENT`); continue; }
      const X0 = Math.floor(r.x * 2), X1 = Math.ceil(r.r * 2), Y0 = Math.floor(r.y * 2), YB = Math.ceil(r.b * 2), Y1 = Math.ceil((r.y + 0.72 * (r.b - r.y)) * 2);
      const ring = []; for (let x = X0 - 3; x < X1 + 3; x++) for (const y of [Y0 - 3, Y0 - 2, YB + 1, YB + 2]) if (x >= 0 && y >= 0 && x < img.info.width && y < img.info.height) ring.push(L(px(x, y)));
      const paper = q(ring, 0.5);
      const cols = []; for (let x = X0; x < X1; x++) { let best = paper; for (let y = Y0; y < Y1; y++) { const l = L(px(x, y)); if (Math.abs(l - paper) > Math.abs(best - paper)) best = l; } cols.push({ mass: Math.abs(best - paper), cr: CR(best, paper) }); }
      const med = q(cols.map((c) => c.mass).filter((m) => m > 0.02), 0.5);
      const row = [50, 70, 90, 100].map((kk) => { const ink = cols.filter((c) => c.mass >= (kk / 100) * med); const crs = ink.map((c) => c.cr); return `${kk}%:worst ${q(crs, 0).toFixed(2)} p30 ${q(crs, 0.3).toFixed(2)} med ${q(crs, 0.5).toFixed(2)} <4.5 ${(crs.filter((c) => c < 4.5).length / (crs.length || 1)).toFixed(2)} n${crs.length}`; });
      lines.push(`${eng} ${theme} ${arm.padEnd(8)} ${k.padEnd(15)} paper L${paper.toFixed(3)} · max ${q(cols.map((c) => c.cr), 1).toFixed(2)} · ${row.join(" | ")}`);
    }
    await ctx.close();
  }
  await b.close();
}
writeFileSync(process.argv[2], lines.join("\n") + "\n");
console.log(lines.join("\n"));
