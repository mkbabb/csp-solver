// T9-W7 pass 5 · CTRL-RULE — THE FOOT ON THE INSET, PAINTED (charter rows 10/16, INTAKE rows 20/28).
//  · the foot's LOWEST INK above the viewport bottom (css px), read from painted bytes: the
//    lowest device row in the foot's box holding a pixel ≥ 1.5:1 against the card ground, at
//    DPR 2 and 3, 390×844 + 430×932 hasTouch, the sheet settled (polled).
//  · the DISCRIMINATING computed arm (chromium only): CDP `Emulation.setSafeAreaInsetsOverride`
//    { bottom: 34 } → the foot's computed padding-bottom must read 34px; the same page with the
//    override { bottom: 0 } reads the pad. On a tree without `env()` in the foot, both read the pad.
// node p5-foot-ink.mjs <chromium|webkit> <BASE> <arm>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4231/", ARM = "proto"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const out = { engine: ENGINE, arm: ARM, base: BASE, rows: [] };
for (const theme of ["light", "dark"]) for (const [w, h] of [[390, 844], [430, 932]]) for (const dpr of [2, 3]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true, isMobile: ENGINE === "chromium", colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().tap();
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().bottom); if (Math.abs(t - last) < 0.01) break; last = t; }
  const g = await p.evaluate(() => { const f = document.getElementById("card-foot") || document.querySelector(".action-bar"); const b = f.getBoundingClientRect(); const card = document.querySelector(".controls-card");
    return { top: b.top, bottom: b.bottom, left: b.left, width: b.width, padB: getComputedStyle(f).paddingBottom, bg: getComputedStyle(card).backgroundColor, caseBottom: document.querySelector(".drawer-case").getBoundingClientRect().bottom }; });
  const clip = { x: Math.max(0, Math.floor(g.left)), y: Math.floor(g.top), width: Math.floor(Math.min(g.width, w - g.left)), height: Math.max(1, Math.floor(Math.min(g.bottom, h) - g.top)) };
  const buf = await p.screenshot({ clip });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = g.bg.match(/[\d.]+/g).slice(0, 3).map(Number); const Lb = L(...bg);
  let lowest = -1;
  for (let y = info.height - 1; y >= 0 && lowest < 0; y--) for (let x = 0; x < info.width; x++) { const i = (y * info.width + x) * 3; const l = L(data[i], data[i + 1], data[i + 2]); const cr = (Math.max(l, Lb) + 0.05) / (Math.min(l, Lb) + 0.05); if (cr >= 1.5) { lowest = y; break; } }
  const inkBottomCss = clip.y + (lowest + 1) / dpr;
  out.rows.push({ theme, cell: `${w}x${h}`, dpr, padB: g.padB, footBottom: +g.bottom.toFixed(2), caseBottom: +g.caseBottom.toFixed(2), lowestInkAboveViewport: +(h - inkBottomCss).toFixed(2) });
  await ctx.close();
}
if (ENGINE === "chromium") {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  const read = async (bottom) => {
    let ok = true; try { await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 0, left: 0, right: 0, bottom } }); } catch (e) { ok = String(e.message || e).slice(0, 120); }
    await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" }); await p.waitForSelector(".sudoku-cell", { timeout: 45000 }); await p.waitForTimeout(1500);
    return { override: ok, padB: await p.evaluate(() => getComputedStyle(document.getElementById("card-foot") || document.querySelector(".action-bar")).paddingBottom),
      envProbe: await p.evaluate(() => { const d = document.createElement("div"); d.style.paddingBottom = "env(safe-area-inset-bottom)"; document.body.appendChild(d); const v = getComputedStyle(d).paddingBottom; d.remove(); return v; }) };
  };
  out.cdp = { inset34: await read(34), inset0: await read(0) };
  await ctx.close();
}
writeFileSync(join(OUT, `p5-foot-ink-${ARM}-${ENGINE}.json`), JSON.stringify(out, null, 1));
for (const r of out.rows) console.log(JSON.stringify(r));
console.log(JSON.stringify(out.cdp || {}));
await browser.close();
console.log("EXIT OK");
