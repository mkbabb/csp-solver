// ACC-SIX pass 7 · T9-B-ACC6-2's replacement frame (charter row 6): the crayon heart WITH and WITHOUT the dark
// `saturate(0.85)` on ONE page (the integrated dist, s13-s7-s3, where the deletion ships), one theme (dark), one
// variable: arm "with" injects the control's exact rule (`filter: saturate(0.85)` on `svg.crayon-heart.idle`, the
// 0.75 opacity untouched in both). The attribution card is opened (its heart is visibility:hidden at rest). Prints the
// painted delta over the heart's box (px with ΔRGB > 3, mean |Δ| per channel) and writes the stacked crop.
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { chromium, webkit, BOARD } from "./p7-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4241", OUT = process.argv[2], ENG = process.env.ENGINE || "chromium";
const L = { chromium, webkit }[ENG]; const br = await L.launch();
const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "dark", deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto(BASE + "/" + BOARD); await page.waitForSelector(".sudoku-cell"); await page.waitForTimeout(3000);
await page.evaluate(() => document.querySelector('.corner-left button[aria-label="Show attribution card"]')?.focus()); await page.waitForTimeout(1200);
const st = await page.evaluate(() => { const h = document.querySelector(".corner-left svg.crayon-heart"); const cs = getComputedStyle(h); const r = h.getBoundingClientRect(); return { vis: cs.visibility, op: cs.opacity, filter: cs.filter, r: [r.x, r.y, r.width, r.height], asset: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop(), dark: document.documentElement.classList.contains("dark") }; });
const clip = { x: Math.floor(st.r[0]) - 24, y: Math.floor(st.r[1]) - 12, width: Math.ceil(st.r[2]) + 48, height: Math.ceil(st.r[3]) + 24 };
const A = await page.screenshot({ clip });
await page.addStyleTag({ content: "svg.crayon-heart.idle { filter: saturate(0.85) !important; }" }); await page.waitForTimeout(400);
const fB = await page.evaluate(() => getComputedStyle(document.querySelector(".corner-left svg.crayon-heart")).filter);
const B = await page.screenshot({ clip });
const a = await sharp(A).raw().toBuffer({ resolveWithObject: true }), b = await sharp(B).raw().toBuffer();
let n = 0, s = [0, 0, 0]; for (let i = 0; i < a.data.length; i += a.info.channels) { const d = [0, 1, 2].map((c) => Math.abs(a.data[i + c] - b[i + c])); if (Math.max(...d) > 3) n++; d.forEach((v, c) => (s[c] += v)); }
const px = a.data.length / a.info.channels;
console.log(JSON.stringify({ engine: ENG, state: st, filterWith: fB, clip, changedPx: n, ofPx: px, meanAbsDelta: s.map((v) => +(v / px).toFixed(3)) }));
if (OUT) { const w = a.info.width, h = a.info.height; await sharp({ create: { width: w, height: h * 2 + 6, channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite([{ input: A, top: 0, left: 0 }, { input: B, top: h + 6, left: 0 }]).png().toFile(OUT); }
await br.close();
