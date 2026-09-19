// T9-W7 pass 1 · CTRL-TAPE — the ring re-read (painted bytes) + the pin-line lever at BOTH
// regimes. The ring is a DIFFERENCE of two paints of the same clip, focused and blurred, with
// keyboard modality set first: the changed pixels are the ring's own and the ground is what
// those same pixels were.
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
const sharp = (await import(`${ROOT}/web/frontend/node_modules/sharp/dist/index.cjs`)).default;
import { writeFileSync } from "node:fs";
const BASE = "http://127.0.0.1:4244/";
const engines = { chromium, webkit };
const out = { at: new Date().toISOString() };

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

async function ringFromBytes(page, selector, label) {
  await page.keyboard.press("Tab");
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, color: getComputedStyle(el).color, vw: innerWidth, vh: innerHeight };
  }, selector);
  if (!box || box.w < 2) return { label, skipped: "not painted" };
  const pad = 12;
  const x0 = Math.max(0, Math.floor(box.x - pad)), y0 = Math.max(0, Math.floor(box.y - pad));
  const clip = { x: x0, y: y0, width: Math.min(Math.ceil(box.w + pad * 2), box.vw - x0), height: Math.min(Math.ceil(box.h + pad * 2), box.vh - y0) };
  if (clip.width < 6 || clip.height < 6 || box.y < 0 || box.y + box.h > box.vh)
    return { label, skipped: "outside the viewport at this pose" };
  await page.evaluate((sel) => document.querySelector(sel).blur(), selector);
  await page.waitForTimeout(80);
  const off = await page.screenshot({ clip });
  const fv = await page.evaluate((sel) => { const el = document.querySelector(sel); el.focus(); return el.matches(":focus-visible"); }, selector);
  await page.waitForTimeout(80);
  const on = await page.screenshot({ clip });
  const A = await sharp(off).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(on).raw().toBuffer({ resolveWithObject: true });
  const ch = A.info.channels;
  let n = 0, worst = 1;
  for (let i = 0; i < A.data.length; i += ch) {
    const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d < 24) continue;
    n++;
    const lb = lum(B.data[i], B.data[i + 1], B.data[i + 2]), la = lum(A.data[i], A.data[i + 1], A.data[i + 2]);
    const [hi, lo] = [lb, la].sort((x, y) => y - x);
    const r = (hi + 0.05) / (lo + 0.05);
    if (r > worst) worst = r;
  }
  return { label, focusVisible: fv, changedPx: n, ratio: +worst.toFixed(2) };
}

const GROUNDS = [
  [".controls-card .ctrl-btn", "option chip · the well's paper (quiet rung)"],
  [".controls-card .icon-btn.deal-btn", "the primary act · the well's paper"],
  [".controls-card .action-bar .icon-btn", "a bar verb · the bar's own plane"],
  [".controls-card .mobile-heading-btn", "a tab tape · the well's paper"],
  [".drawer-tab", "the tongue · the page"],
];

out.ring = {};
for (const engine of ["chromium", "webkit"])
  for (const dark of [false, true]) {
    const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true, dark });
    const rows = [];
    for (const [sel, label] of GROUNDS) rows.push(await ringFromBytes(page, sel, label));
    out.ring[`${engine}-${dark ? "dark" : "light"}`] = rows;
    // computed, so the authored rule is witnessed as well as painted
    out.ring[`${engine}-${dark ? "dark" : "light"}-computed`] = await page.evaluate(() => {
      const read = (s) => { const e = document.querySelector(s); if (!e) return null; e.focus(); const c = getComputedStyle(e); return `${c.outlineWidth} ${c.outlineStyle} ${c.outlineColor} / offset ${c.outlineOffset}`; };
      return { chip: read(".controls-card .ctrl-btn"), barVerb: read(".controls-card .action-bar .icon-btn"), tab: read(".controls-card .mobile-heading-btn") };
    });
    await browser.close();
  }

/* THE PIN LINE — the only lever that moves the first tape's clearance, priced at BOTH regimes.
   The floor is `max(0.25rem, …)`: 4px on the dock (card padding 6), and on the RAIL (padding 20)
   it replaces −17.6px, which is the rung W2 §2.5 set so the first tape straddles its stroke at
   rest. Both consequences measured here rather than argued. */
const FLOOR = `.controls-card .tray-well{--washi-tag-top:max(0.25rem, calc(0.15rem - var(--card-pad-t, 0px)))!important}`;
out.pinLine = {};
for (const [name, cell] of [["dock-390x844", { w: 390, h: 844, mobile: true, sheet: true }], ["rail-1440x900", { w: 1440, h: 900 }]])
  for (const engine of ["chromium", "webkit"]) {
    const { browser, page } = await open(engine, cell);
    const READ = () => {
      const c = document.querySelector(".controls-card");
      const tapes = [...c.querySelectorAll(".tray-well > .washi-tag")];
      const cb = c.getBoundingClientRect();
      return {
        firstClearance: +(tapes[0].getBoundingClientRect().top - cb.top).toFixed(2),
        firstIntoItsWell: +(tapes[0].getBoundingClientRect().top - tapes[0].parentElement.getBoundingClientRect().top).toFixed(2),
        panelH: +document.querySelector(".control-panel-wrap").getBoundingClientRect().height.toFixed(2),
      };
    };
    const base = await page.evaluate(READ);
    const tag = await page.addStyleTag({ content: FLOOR });
    await page.waitForTimeout(250);
    const floored = await page.evaluate(READ);
    await page.evaluate((el) => el.remove(), tag);
    out.pinLine[`${name}-${engine}`] = { base, floored };
    await browser.close();
  }

writeFileSync(process.argv[2] || "/tmp/ring2.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
