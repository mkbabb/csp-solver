// T9-W7 pass1 · CTRL-RULE — the corrected I2 coverage (clipped to the scrollport's client
// box, since a group scrolled out of view is not a group the bar covers), the board's free
// bottom edge for the quick set, the mode chip's width, and the two crops.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const PROTO = readFileSync(join(HERE, "..", "proto", "ruled-page.js"), "utf8");
const FRAMES = join(HERE, "..", "frames");
const out = {};

async function board(engine, cell, dark = false, open = true) {
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
  if (open && (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}
const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 15000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(400);
  return r;
};
const footPatch = async (page) =>
  page.evaluate(async () => {
    const card = document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    const caseEl = card.parentElement;
    const barH = Math.ceil(bar.getBoundingClientRect().height);
    const caseH = caseEl.getBoundingClientRect().height;
    caseEl.style.setProperty("padding-bottom", `${barH}px`, "important");
    caseEl.style.setProperty("box-sizing", "border-box", "important");
    card.style.setProperty("max-height", `${Math.round(caseH - barH)}px`, "important");
    card.style.setProperty("height", `${Math.round(caseH - barH)}px`, "important");
    await new Promise((r) => setTimeout(r, 200));
    return { barH, caseH };
  });

/* I2, CORRECTED: a group is covered only where it is VISIBLE (clipped to the scrollport). */
const COVER = async (page) =>
  page.evaluate(async () => {
    const card = document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    const inter = (a, b) =>
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) *
      Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const states = [];
    const max = Math.max(0, card.scrollHeight - card.clientHeight);
    for (const st of [0, Math.round(max / 3), Math.round((2 * max) / 3), max]) {
      card.scrollTop = st;
      await new Promise((r) => setTimeout(r, 200));
      const cb = card.getBoundingClientRect();
      const bb = bar.getBoundingClientRect();
      let worst = 0, who = null;
      for (const g of document.querySelectorAll(".rp-group")) {
        const gb = g.getBoundingClientRect();
        const visible = inter(gb, cb);
        if (visible < 400) continue; // not on screen at all
        const covered = Math.max(
          0, Math.min(gb.bottom, bb.bottom, cb.bottom) - Math.max(gb.top, bb.top, cb.top)
        ) * Math.max(0, Math.min(gb.right, bb.right, cb.right) - Math.max(gb.left, bb.left, cb.left));
        const f = covered / visible;
        if (f > worst) { worst = f; who = g.dataset.group; }
      }
      states.push({ at: card.scrollTop, worst: +worst.toFixed(4), who });
    }
    card.scrollTop = 0;
    return states;
  });

for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "land-900x500", w: 900, h: 500, mobile: true },
    { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  ]) {
    // (i) the bar sticky INSIDE the scrollport (the charter's "sticky in all three")
    {
      const { browser, page } = await board(engine, cell);
      await apply(page, { arm: "above", release: true });
      out[`cover-sticky-${cell.name}-${engine}`] = await COVER(page);
      console.log(`cover STICKY ${cell.name} ${engine}: ${out[`cover-sticky-${cell.name}-${engine}`].map((s) => `${s.at}:${(s.worst * 100).toFixed(1)}%(${s.who})`).join(" ")}`);
      await browser.close();
    }
    // (ii) the bar as the CASE'S FOOT, outside the scrollport
    {
      const { browser, page } = await board(engine, cell);
      await apply(page, { arm: "above", release: true, barOut: true });
      await footPatch(page);
      out[`cover-foot-${cell.name}-${engine}`] = await COVER(page);
      console.log(`cover FOOT   ${cell.name} ${engine}: ${out[`cover-foot-${cell.name}-${engine}`].map((s) => `${s.at}:${(s.worst * 100).toFixed(1)}%(${s.who})`).join(" ")}`);
      await browser.close();
    }
  }
}

/* the board's free bottom edge and the quick-set arithmetic */
{
  const { browser, page } = await board("chromium", { w: 390, h: 844, mobile: true }, false, false);
  const r = await page.evaluate(() => {
    const tab = document.querySelector(".drawer-tab");
    const tb = tab?.getBoundingClientRect();
    const paper =
      document.querySelector(".board-paper") ||
      document.querySelector(".sudoku-grid") ||
      document.querySelector("[class*=board]");
    const pb = paper?.getBoundingClientRect();
    const tools = document.querySelector("#fold-tools");
    const fb = tools?.getBoundingClientRect();
    const btns = [...(tools?.querySelectorAll("button") || [])].map((b) => {
      const x = b.getBoundingClientRect();
      return { t: (b.textContent || "").trim().slice(0, 10), w: +x.width.toFixed(1), h: +x.height.toFixed(1) };
    });
    return {
      tongue: tb ? [+tb.x.toFixed(1), +tb.y.toFixed(1), +tb.width.toFixed(1), +tb.height.toFixed(1)] : null,
      paperCls: paper?.className?.slice?.(0, 40),
      paper: pb ? [+pb.x.toFixed(1), +pb.width.toFixed(1), +pb.bottom.toFixed(1)] : null,
      freeEdge: pb && tb ? +(pb.width - tb.width).toFixed(1) : null,
      foldTools: fb ? [+fb.width.toFixed(1), +fb.height.toFixed(1)] : null,
      foldButtons: btns,
    };
  });
  out.quickset = r;
  console.log("quickset:", JSON.stringify(r));
  await browser.close();
}

/* the crops */
{
  const { browser, page } = await board("chromium", { w: 390, h: 844, mobile: true });
  await apply(page, { arm: "above", release: true, barOut: true });
  await footPatch(page);
  await page.waitForTimeout(600);
  const clip = await page.evaluate(() => {
    const g = document.querySelector('.rp-group[data-group="marks"]');
    const b = g.getBoundingClientRect();
    return { x: Math.max(0, b.x - 4), y: Math.max(0, b.y - 46), width: Math.min(390, b.width + 8), height: 180 };
  });
  await page.screenshot({ path: join(FRAMES, "rule-vs-hairline-390-above.png"), clip });
  await browser.close();
}
{
  const { browser, page } = await board("chromium", { w: 1280, h: 800, mobile: false });
  await apply(page, { arm: "beside" });
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => {
    const c = document.querySelector(".controls-card").getBoundingClientRect();
    return { x: c.x, y: c.y, width: c.width, height: Math.min(360, c.height) };
  });
  await page.screenshot({ path: join(FRAMES, "armb-margin-column-1280.png"), clip });
  await browser.close();
}

writeFileSync(join(HERE, "..", "fix5.json"), JSON.stringify(out, null, 1));
console.log("banked fix5.json");
