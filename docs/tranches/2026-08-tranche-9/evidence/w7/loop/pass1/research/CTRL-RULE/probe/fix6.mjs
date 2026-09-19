// T9-W7 pass1 · CTRL-RULE — the closing arithmetic: every name's ink width at the phi rung
// (the margin column's true floor), and the focus ring's painted contrast on four grounds.
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
const lum = (r, g, b) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};

async function board(engine, cell, dark) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h }, deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile, colorScheme: dark ? "dark" : "light",
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

/* 1 · every name's ink width at the phi rung, at 390 and 1280 */
for (const cell of [{ name: "390x844", w: 390, h: 844, mobile: true }, { name: "1280x800", w: 1280, h: 800, mobile: false }]) {
  const { browser, page } = await board("chromium", cell, false);
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp);
  await page.evaluate(() => window.__rp({ arm: "above" }));
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const rows = [];
    for (const n of document.querySelectorAll(".rp-name")) {
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const ink = rg.getBoundingClientRect();
      const cs = getComputedStyle(n);
      rows.push({ t: n.textContent, inkW: +ink.width.toFixed(2), inkH: +ink.height.toFixed(2),
                  lines: Math.round(ink.height / (parseFloat(cs.fontSize) * 1.2)),
                  fs: +parseFloat(cs.fontSize).toFixed(2) });
    }
    const chip = document.querySelector(".ctrl-btn");
    return { rows, optionPx: +parseFloat(getComputedStyle(chip).fontSize).toFixed(2),
             wrapW: +document.querySelector(".control-panel-wrap").getBoundingClientRect().width.toFixed(2) };
  });
  out[`names-${cell.name}`] = r;
  console.log(`names @${cell.name}: option ${r.optionPx}px, wrap ${r.wrapW} · ` +
    r.rows.map((x) => `${x.t} ${x.inkW}px/${x.lines}L`).join(" · ") +
    ` · widest ${Math.max(...r.rows.map((x) => x.inkW)).toFixed(2)}`);
  await browser.close();
}

/* 2 · the focus ring, painted: 2px solid color-mix(foreground 45%) offset 4 (the ribbon's own)
       against the card AND the background, light AND dark */
for (const theme of ["light", "dark"]) {
  const { browser, page } = await board("chromium", { w: 1280, h: 800, mobile: false }, theme === "dark");
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp);
  await page.evaluate(() => window.__rp({ arm: "above" }));
  await page.addStyleTag({
    content:
      ".rp-focus-demo { outline: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent); outline-offset: 4px; }",
  });
  await page.evaluate(() => {
    const b = document.querySelector(".ctrl-btn");
    b.classList.add("rp-focus-demo");
    b.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(350);
  const shot = await page.screenshot({ type: "png" });
  const r = await page.evaluate(async ([b64]) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
    const px = (x, y) => { const d = g.getImageData(Math.round(x), Math.round(y), 1, 1).data; return [d[0], d[1], d[2]]; };
    const b = document.querySelector(".rp-focus-demo").getBoundingClientRect();
    const band = [];
    for (let dy = 3; dy <= 8; dy++) band.push(px(b.left + b.width / 2, b.top - dy));
    return { band, ground: px(b.left + b.width / 2, b.top - 14),
             cardBg: getComputedStyle(document.querySelector(".controls-card")).backgroundColor,
             bodyBg: getComputedStyle(document.body).backgroundColor };
  }, [shot.toString("base64")]);
  const gl = lum(...r.ground);
  const best = r.band.reduce((a, b) => (Math.abs(lum(...b) - gl) > Math.abs(lum(...a) - gl) ? b : a), r.band[0]);
  out[`focus-${theme}`] = { ring: best, ground: r.ground, ratio: ratio(best, r.ground), cardBg: r.cardBg, bodyBg: r.bodyBg };
  console.log(`focus ring ${theme}: ${ratio(best, r.ground)}:1 (ring ${JSON.stringify(best)} on card ${r.cardBg})`);
  await browser.close();
}

writeFileSync(join(HERE, "..", "fix6.json"), JSON.stringify(out, null, 1));
console.log("banked fix6.json");
