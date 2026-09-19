/** PASS-3 CRITIQUE · PLR-COUNT — an independent re-run of the prototype's own numbers.
 *  Programmatic playwright (no PW config: a config outside web/frontend cannot resolve
 *  @playwright/test, and this lane writes nothing into the prototype's tree). */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/package.json",
);
const { chromium, webkit } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:4238";

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const parse = (s) => { const m = String(s).match(/[\d.]+/g).map(Number); return { rgb: m.slice(0, 3), a: m.length > 3 ? m[3] : 1 }; };
const over = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));

async function drivePeers(page, room, k, from) {
  await page.evaluate(({ room, k, from }) => {
    const w = window; w.__ch ??= new BroadcastChannel(`board:${room}`);
    for (let i = 0; i < k; i++) w.__ch.postMessage({ kind: "hi", data: {}, from: `crit-${from + i}` });
  }, { room, k, from });
  await page.waitForTimeout(700);
}
const headState = (page) => page.evaluate(() => {
  const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0);
  if (!m) return null;
  const pose = m.querySelector(".pt-pose");
  const b = m.getBoundingClientRect();
  const cnt = m.querySelector(".pt-count");
  return {
    label: m.getAttribute("aria-label"), width: +b.width.toFixed(2), height: +b.height.toFixed(2),
    strokes: pose ? pose.querySelectorAll("path").length : 0,
    written: cnt?.textContent ?? null, writtenPx: cnt ? getComputedStyle(cnt).fontSize : null,
    strokeColor: pose?.querySelector("path") ? getComputedStyle(pose.querySelector("path")).stroke : null,
    strokeOpacity: pose?.querySelector("path") ? getComputedStyle(pose.querySelector("path")).strokeOpacity : null,
  };
});

async function run(name, browserType) {
  const out = { engine: name };
  const browser = await browserType.launch();

  // ── A · width table + one-base label, desk 1280x900 light
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
    const page = await ctx.newPage();
    const room = `crit-w-${Date.now()}`;
    await page.goto(`${BASE}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    const table = {}; let at = 1, from = 0;
    for (const N of [1, 2, 3, 4, 5, 6, 7]) {
      if (N > at) { await drivePeers(page, room, N - at, from); from += N - at; at = N; }
      const h = await headState(page);
      table[N] = h && { w: h.width, hgt: h.height, label: h.label, strokes: h.strokes, written: h.written, px: h.writtenPx };
    }
    out.widthTable = table;
    // page ground + stroke contrast at N=3
    out.strokeAA = await page.evaluate(() => {
      const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0);
      const paths = [...(m?.querySelectorAll(".pt-pose path") ?? [])];
      const bg = getComputedStyle(document.body).backgroundColor;
      return { bg, strokes: paths.map((p) => ({ s: getComputedStyle(p).stroke, o: getComputedStyle(p).strokeOpacity })) };
    });
    await ctx.close();
  }

  // ── B · the sheet: AA on both themes, ground opacity, row/foot regimes
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const room = `crit-s-${scheme}-${Date.now()}`;
    await page.goto(`${BASE}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    await drivePeers(page, room, 2, 500);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    out[`sheet_${scheme}`] = await page.evaluate(() => {
      const el = document.querySelector(".player-lobby");
      if (!el) return null;
      const cs = getComputedStyle(el);
      const read = (sel) => { const n = el.querySelector(sel); return n ? { text: n.textContent.trim(), color: getComputedStyle(n).color, size: getComputedStyle(n).fontSize } : null; };
      return {
        bg: cs.backgroundColor, opacity: cs.opacity, visibility: cs.visibility,
        box: (({ width, height, x, y }) => ({ width: +width.toFixed(2), height: +height.toFixed(2), x: +x.toFixed(2), y: +y.toFixed(2) }))(el.getBoundingClientRect()),
        state: read(".pl-state"), name: read(".pl-name"), qual: read(".pl-qualifier"), more: read(".pl-more"),
        rows: el.querySelectorAll(".pl-row").length, moreCount: el.querySelectorAll(".pl-more").length,
        rowStroke: (() => { const p = el.querySelector(".pl-row-mark path"); return p ? { s: getComputedStyle(p).stroke, o: getComputedStyle(p).strokeOpacity } : null; })(),
      };
    });
    await ctx.close();
  }

  // ── C · the SHORT regime on a DESK window (the gap the prototype found by accident)
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, colorScheme: "light" });
    const page = await ctx.newPage();
    const room = `crit-short-${Date.now()}`;
    await page.goto(`${BASE}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    await drivePeers(page, room, 3, 900); // N = 4
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    out.shortDesk = await page.evaluate(() => {
      const el = document.querySelector(".player-lobby");
      return el && { rows: el.querySelectorAll(".pl-row").length, more: el.querySelectorAll(".pl-more").length,
        state: el.querySelector(".pl-state")?.textContent, h: +el.getBoundingClientRect().height.toFixed(2),
        names: [...el.querySelectorAll(".pl-name")].map((n) => n.textContent) };
    });
    await ctx.close();
  }

  // ── D · no mark in the deck; and the mark's press does not steal the caret
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?view=gallery`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1200);
    out.galleryMarks = await page.locator("[data-player-mark]").count();
    await ctx.close();
  }
  await browser.close();
  return out;
}

const res = {};
for (const [n, t] of [["chromium", chromium], ["webkit", webkit]]) {
  try { res[n] = await run(n, t); } catch (e) { res[n] = { error: String(e).slice(0, 400) }; }
}
// post-hoc AA
for (const eng of Object.keys(res)) {
  const r = res[eng]; if (r.error) continue;
  r.aa = {};
  for (const scheme of ["light", "dark"]) {
    const s = r[`sheet_${scheme}`]; if (!s) continue;
    const bgp = parse(s.bg); const bg = bgp.a === 1 ? bgp.rgb : null;
    const rows = {};
    for (const k of ["state", "name", "qual", "more"]) {
      const v = s[k]; if (!v) { rows[k] = null; continue; }
      const f = parse(v.color);
      rows[k] = { text: v.text, size: v.size, groundAlpha: bgp.a, ratio: bg ? +ratio(over(f.rgb, bg, f.a), bg).toFixed(3) : "GROUND NOT OPAQUE" };
    }
    if (s.rowStroke) { const f = parse(s.rowStroke.s); rows.rowStroke = { ratio: bg ? +ratio(over(f.rgb, bg, f.a * Number(s.rowStroke.o)), bg).toFixed(3) : "?" }; }
    r.aa[scheme] = { ground: s.bg, groundAlpha: bgp.a, rows };
  }
  if (r.strokeAA) {
    const bg = parse(r.strokeAA.bg).rgb;
    r.aa.pageStrokes = r.strokeAA.strokes.map((st) => { const f = parse(st.s); return +ratio(over(f.rgb, bg, Number(st.o)), bg).toFixed(3); });
    r.aa.pageGround = r.strokeAA.bg;
  }
}
writeFileSync(process.env.OUT, JSON.stringify(res, null, 1));
console.log("DONE");
