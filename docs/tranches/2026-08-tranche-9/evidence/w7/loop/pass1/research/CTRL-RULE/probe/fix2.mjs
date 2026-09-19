// T9-W7 pass1 · CTRL-RULE — the four readings the first detail run got wrong or left open:
//   (a) the card's ancestry (where a bar outside the scrollport actually lands)
//   (b) arm (b)'s margin sweep at 390 — the widest margin the chips survive
//   (c) the rule's painted contrast in DARK (max-|Δlum| pixel, not the darkest)
//   (d) the 390-class masthead seam at 375 / 390 / 430, painted band vs wordmark box
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const PROTO = readFileSync(join(HERE, "..", "proto", "ruled-page.js"), "utf8");
const out = {};

async function board(engine, cell, dark = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}
const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 10000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(400);
  return r;
};
const lum = (r, g, b) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};

/* (a) the card's ancestry, and the bar's true containing block */
{
  const { browser, page } = await board("chromium", { w: 390, h: 844, mobile: true });
  const r = await page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const chain = [];
    let e = card;
    while (e && chain.length < 7) {
      const cs = getComputedStyle(e);
      const b = e.getBoundingClientRect();
      chain.push({
        tag: e.tagName, cls: (e.getAttribute("class") || "").slice(0, 48),
        pos: cs.position, box: [+b.y.toFixed(1), +b.height.toFixed(1)],
        overflowY: cs.overflowY, display: cs.display, maxH: cs.maxHeight,
      });
      e = e.parentElement;
    }
    return chain;
  });
  out.ancestry = r;
  r.forEach((x) => console.log("ancestry", JSON.stringify(x)));
  await browser.close();
}

/* (b) arm (b)'s margin sweep at 390 — where does the field stop squeezing its chips? */
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
  await apply(page, { arm: "beside" });
  const r = await page.evaluate(async () => {
    const rows = [];
    const wrap = document.querySelector(".control-panel-wrap");
    const st = document.createElement("style");
    document.head.appendChild(st);
    for (const m of [132, 120, 110, 100, 96, 92, 88, 80, 72, 64, 56, 48, 40, 0]) {
      st.textContent = `.rp-beside .rp-group { grid-template-columns: ${m}px 1fr !important; }`;
      await new Promise((r2) => requestAnimationFrame(() => requestAnimationFrame(r2)));
      const g = document.querySelector('.rp-group[data-group="marks"]');
      const field = g.querySelector(".rp-field").getBoundingClientRect();
      const name = g.querySelector(".rp-name");
      const nameBox = name.getBoundingClientRect();
      const rg = document.createRange();
      rg.selectNodeContents(name);
      const nameInk = rg.getBoundingClientRect();
      const chips = [...g.querySelectorAll(".ctrl-btn")].map((c) => {
        const b = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        const r2 = document.createRange();
        r2.selectNodeContents(c);
        const t = r2.getBoundingClientRect();
        return {
          w: +b.width.toFixed(2), h: +b.height.toFixed(2), top: Math.round(b.top),
          squeeze: +(t.width - (b.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))).toFixed(2),
        };
      });
      rows.push({
        margin: m, field: +field.width.toFixed(2),
        lines: new Set(chips.map((c) => c.top)).size,
        maxSqueeze: +Math.max(...chips.map((c) => c.squeeze)).toFixed(2),
        minChipW: +Math.min(...chips.map((c) => c.w)).toFixed(2),
        nameClipped: +(nameInk.width - nameBox.width).toFixed(2),
        nameInkW: +nameInk.width.toFixed(2),
      });
    }
    st.remove();
    return rows;
  });
  out[`sweep-390-${engine}`] = r;
  console.log(`sweep 390 ${engine}:`);
  r.forEach((x) =>
    console.log(
      `   margin ${String(x.margin).padStart(3)} → field ${x.field} · lines ${x.lines} · maxSqueeze ${x.maxSqueeze} · minChip ${x.minChipW} · "candidates" ink ${x.nameInkW} over its column by ${x.nameClipped}`,
    ),
  );
  await browser.close();
}

/* (c) and (d) MOVED to fix3.mjs (corrected pickers) — see fix3.json. */

writeFileSync(join(HERE, "..", "fix2.json"), JSON.stringify(out, null, 1));
console.log("banked fix2.json");
