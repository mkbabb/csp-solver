// T9-W7 pass 1 · CTRL-TAPE PROTOTYPE — the ablation + painted-byte half.
//   node ctrltape-ablate.mjs
// Every reading here is one the before/after sweep could not take: an in-page ABLATION (what a
// single declaration costs, measured by removing it and re-reading the same box), a painted
// byte (opacity and color-mix are invisible to a composited-colour walk), and the estate's own
// filter census rather than a DOM count.
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
const sharp = (await import(`${ROOT}/web/frontend/node_modules/sharp/dist/index.cjs`)).default;
import { writeFileSync } from "node:fs";
const BASE = "http://127.0.0.1:4244/";
const engines = { chromium, webkit };
const out = { at: new Date().toISOString(), base: BASE };

async function open(engine, { w, h, mobile = false, dark = false, sheet = false }) {
  const browser = await engines[engine].launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1,
    hasTouch: mobile, isMobile: mobile && engine === "chromium",
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (sheet && (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}

const lum = (r, g, b) => {
  const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/* ── 1 · THE FOCUS RING, computed AND painted ─────────────────────────────────────────── */
out.ring = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true });
  await page.keyboard.press("Tab");
  out.ring[engine] = await page.evaluate(() => {
    const read = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.focus();
      const cs = getComputedStyle(el);
      return { outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, offset: cs.outlineOffset, fv: el.matches(":focus-visible") };
    };
    return {
      chip: read(".controls-card .ctrl-btn"),
      barVerb: read(".controls-card .action-bar .icon-btn"),
      deal: read(".controls-card .deal-btn"),
      tongue: read(".drawer-tab"),
      leave: read(".controls-card .players-leave"),
    };
  });
  await browser.close();
}

/* ── 2 · THE LIFTED TAB'S WORD, FROM PAINTED BYTES (the one-dimming gate) ──────────────
   Opacity is invisible to a composited-colour walk, so the lifted tape's word is read off the
   engine's own pixels: crop the tab, split the crop's luminance histogram into INK (the darkest
   decile in light mode / lightest in dark) and GROUND (the modal value), and take the ratio.
   The negative control is the DOUBLE dim the spec refuses: opacity 0.68 over a muted rung. */
async function wordContrast(page, sel, dark) {
  const box = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight };
  }, sel);
  if (!box || box.w < 4 || box.y < 0 || box.y + box.h > box.vh) return { skipped: "not on screen", box };
  const clip = { x: Math.floor(box.x), y: Math.floor(box.y), width: Math.ceil(box.w), height: Math.ceil(box.h) };
  const png = await page.screenshot({ clip });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += info.channels) ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const ink = dark ? ls[Math.floor(ls.length * 0.98)] : ls[Math.floor(ls.length * 0.02)];
  const ground = ls[Math.floor(ls.length * (dark ? 0.35 : 0.65))];
  const [hi, lo] = [ink, ground].sort((a, b) => b - a);
  return { ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2), inkLum: +ink.toFixed(4), groundLum: +ground.toFixed(4), px: ls.length };
}

out.oneDimming = {};
for (const engine of ["chromium", "webkit"])
  for (const dark of [false, true]) {
    const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true, dark });
    const tabs = ".controls-card .mobile-heading-btn";
    const key = `${engine}-${dark ? "dark" : "light"}`;
    out.oneDimming[key] = {
      pressed: await wordContrast(page, `${tabs}:nth-of-type(1) .section-heading`, dark),
      lifted: await wordContrast(page, `${tabs}:nth-of-type(2) .section-heading`, dark),
    };
    // NEGATIVE CONTROL: the double dim the spec refuses — 0.68 opacity over the quiet rung.
    await page.addStyleTag({
      content: `.controls-card .mobile-heading-btn:not(:has(.is-active)) .section-heading{color:var(--ink-press-quiet)!important;opacity:.68!important}`,
    });
    await page.waitForTimeout(200);
    out.oneDimming[key].doubleDimControl = await wordContrast(page, `${tabs}:nth-of-type(2) .section-heading`, dark);
    // the armed sublabel's ink, both themes
    out.oneDimming[key].armed = await page.evaluate(() => {
      const s = document.querySelector(".controls-card .icon-sublabel");
      if (!s) return null;
      s.classList.add("is-armed");
      const cs = getComputedStyle(s);
      return { color: cs.color, weight: cs.fontWeight };
    });
    await browser.close();
  }

/* ── 3 · THE FILTER CENSUS — the estate's own budget, not a DOM count ──────────────────── */
out.filters = {};
for (const engine of ["chromium", "webkit"])
  for (const cell of [[390, 844, true, true], [1280, 800, false, false], [1440, 900, false, false]]) {
    const { browser, page } = await open(engine, { w: cell[0], h: cell[1], mobile: cell[2], sheet: cell[3] });
    await page.waitForTimeout(600);
    const k = `${engine}-${cell[0]}x${cell[1]}`;
    out.filters[k] = await page.evaluate(() => {
      const live = [...document.querySelectorAll("*")].filter((e) => {
        const f = getComputedStyle(e).filter;
        return f && f !== "none" && f.includes("url(");
      });
      const byId = {};
      for (const e of live) {
        const m = /url\(["']?#([^"')]+)/.exec(getComputedStyle(e).filter);
        const id = m ? m[1] : "?";
        byId[id] = (byId[id] || 0) + 1;
      }
      return { total: live.length, byId, area: +live.reduce((a, e) => { const r = e.getBoundingClientRect(); return a + r.width * r.height; }, 0).toFixed(0) };
    });
    await browser.close();
  }

/* ── 4 · THE ABLATIONS — what each declaration costs, at the seal's own cell ───────────── */
const ABLATIONS = {
  "line-height 1.2 -> 1.5 on the tapes": `.controls-card :is(.washi-tag,.zone-row-label,.section-heading){line-height:1.5!important}`,
  "well top padding 0.35rem -> 0.7rem": `.controls-card .tray-well{padding-top:.7rem!important}`,
  "the name rung back to its two old rungs": `.controls-card :is(.washi-tag,.zone-row-label){font-size:var(--type-caption)!important} .controls-card .section-heading{font-size:var(--type-subheading)!important}`,
  "the row captions back beside their chips": `.controls-card .zone-row{flex-direction:row!important;align-items:center!important;gap:.5rem!important} .controls-card .zone-row-label{flex:0 0 3.75rem!important;width:auto!important}`,
  "the bar's drawn frame removed": `.controls-card .bar-frame{display:none!important}`,
  "the deal box removed": `.controls-card .deal-box>svg{display:none!important}`,
};
out.ablate = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, { w: 1280, h: 800, mobile: true });
  const H = () => +document.querySelector(".controls-card .control-panel-wrap").getBoundingClientRect().height.toFixed(2);
  const base = await page.evaluate(H);
  const rows = { base, seal: 1227.5 };
  for (const [name, css] of Object.entries(ABLATIONS)) {
    const tag = await page.addStyleTag({ content: css });
    await page.waitForTimeout(250);
    rows[name] = +((await page.evaluate(H)) - base).toFixed(2);
    await page.evaluate((el) => el.remove(), tag);
    await page.waitForTimeout(150);
  }
  out.ablate[engine] = rows;
  await browser.close();
}

/* ── 5 · THE FIRST TAPE'S CLEARANCE — which lever actually moves it ────────────────────── */
out.clearance = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true });
  const C = () => {
    const c = document.querySelector(".controls-card");
    const t = c.querySelector(".tray-well .washi-tag");
    const cb = c.getBoundingClientRect(), tb = t.getBoundingClientRect();
    const cs = getComputedStyle(t);
    return {
      clearance: +(tb.top - cb.top).toFixed(2),
      insidePadBox: +(tb.top - (cb.top + c.clientTop)).toFixed(2),
      position: cs.position,
      top: cs.top,
      tilt: cs.transform,
      padT: getComputedStyle(c).paddingTop,
    };
  };
  const rows = { base: await page.evaluate(C) };
  for (const [name, css] of Object.entries({
    "leading 1.5": `.controls-card :deep(.washi-tag){line-height:1.5!important}`,
    "no tilt": `.controls-card .tray-well .washi-tag{transform:none!important}`,
    "pin line +4px": `.controls-card .tray-well{--washi-tag-top:4px!important}`,
    "static (unpinned)": `.controls-card .tray-well .washi-tag{position:static!important}`,
  })) {
    const tag = await page.addStyleTag({ content: css });
    await page.waitForTimeout(200);
    rows[name] = await page.evaluate(C);
    await page.evaluate((el) => el.remove(), tag);
    await page.waitForTimeout(150);
  }
  out.clearance[engine] = rows;
  await browser.close();
}

/* ── 6 · THE SEAM'S OVER-SPEND — where the case's stroke sits against the sheet's own top ── */
out.seamOffset = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true });
  out.seamOffset[engine] = await page.evaluate(() => {
    const sc = document.querySelector(".scene-controls");
    const caseEl = document.querySelector(".drawer-case");
    const out2 = caseEl && caseEl.querySelector(":scope > svg.outline-svg");
    const mast = document.querySelector("svg.handwritten-logo");
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--sheet-chrome)";
    sc.appendChild(probe);
    const chrome = probe.getBoundingClientRect().height;
    probe.remove();
    const scb = sc.getBoundingClientRect();
    return {
      sheetChromePx: +chrome.toFixed(2),
      sheetTop: +scb.top.toFixed(2),
      caseTop: +caseEl.getBoundingClientRect().top.toFixed(2),
      caseStrokeTop: +out2.getBoundingClientRect().top.toFixed(2),
      wordmarkFoot: +mast.getBoundingClientRect().bottom.toFixed(2),
      clearance: +(out2.getBoundingClientRect().top - mast.getBoundingClientRect().bottom).toFixed(2),
      strokeMinusSheetTop: +(out2.getBoundingClientRect().top - scb.top).toFixed(2),
      cardClientH: document.querySelector(".controls-card").clientHeight,
    };
  });
  await browser.close();
}

writeFileSync(process.argv[2] || "/tmp/ctrltape-ablate.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
