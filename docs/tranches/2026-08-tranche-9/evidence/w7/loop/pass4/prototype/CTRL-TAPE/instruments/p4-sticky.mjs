/**
 * T9-W7 pass 4 · CTRL-TAPE — §2.6's RED, and whether it is LATENCY or the POSE.
 *
 * W2's §2.6 row (`viewport-law.spec.ts`) sets `card.scrollTop` and reads `getComputedStyle` in
 * the SAME synchronous block. `data-released` is published by an `IntersectionObserver`, which
 * cannot have run yet. So the row reads the pose the tape held at scrollTop 0. This probe reads
 * the same census TWICE — synchronously, exactly as the row does, and again after two frames
 * plus 350 ms — and prints both. If the settled read is `sticky`, the row's red is latency; if
 * it is still `static`, the design leaves a well 80% in view without its name.
 *
 *   node p4-sticky.mjs <baseURL>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = process.argv[2] || "http://127.0.0.1:4230";

const CENSUS = () => {
  const card = document.querySelector(".controls-card");
  const max = card.scrollHeight - card.clientHeight;
  const rows = [];
  for (const well of card.querySelectorAll(".tray-well")) {
    const tag = well.querySelector(".washi-tag");
    if (!tag) continue;
    const name = (tag.textContent || "").trim();
    card.scrollTop = 0;
    const c0 = card.getBoundingClientRect();
    const w0 = well.getBoundingClientRect();
    const want = w0.top - c0.top + 40;
    if (w0.height < 120) { rows.push({ tag: name, unreachable: `well ${w0.height.toFixed(1)}px` }); continue; }
    if (want <= 0 || want > max) { rows.push({ tag: name, unreachable: `needs ${want.toFixed(1)} of ${max}` }); continue; }
    card.scrollTop = want;
    const c = card.getBoundingClientRect();
    const w = well.getBoundingClientRect();
    const t = tag.getBoundingClientRect();
    const visFrac = (() => {
      const vw = Math.max(0, Math.min(t.right, c.right) - Math.max(t.left, c.left));
      const vh = Math.max(0, Math.min(t.bottom, c.bottom) - Math.max(t.top, c.top));
      return t.width * t.height > 0 ? (vw * vh) / (t.width * t.height) : 0;
    })();
    rows.push({
      tag: name,
      position: getComputedStyle(tag).position,
      released: tag.hasAttribute("data-released"),
      wellInView: +((Math.min(w.bottom, c.bottom) - Math.max(w.top, c.top)) / w.height).toFixed(3),
      tagVisFrac: +visFrac.toFixed(4),
      want: +want.toFixed(1),
    });
  }
  return { max, rows };
};

/** The SETTLED read: scroll, let the observer run, then census each well one at a time. */
const SETTLED = async (page) => {
  const wells = await page.evaluate(() => document.querySelectorAll(".controls-card .tray-well").length);
  const out = [];
  for (let i = 0; i < wells; i++) {
    const want = await page.evaluate((i) => {
      const card = document.querySelector(".controls-card");
      card.scrollTop = 0;
      const c0 = card.getBoundingClientRect();
      const w0 = card.querySelectorAll(".tray-well")[i].getBoundingClientRect();
      return { want: w0.top - c0.top + 40, max: card.scrollHeight - card.clientHeight, h: w0.height };
    }, i);
    if (want.h < 120 || want.want <= 0 || want.want > want.max) { out.push({ i, unreachable: JSON.stringify(want) }); continue; }
    await page.evaluate(([i, y]) => { document.querySelector(".controls-card").scrollTop = y; }, [i, Math.round(want.want)]);
    await page.waitForTimeout(400);
    out.push(await page.evaluate((i) => {
      const card = document.querySelector(".controls-card");
      const well = card.querySelectorAll(".tray-well")[i];
      const tag = well.querySelector(".washi-tag");
      const c = card.getBoundingClientRect(), w = well.getBoundingClientRect(), t = tag.getBoundingClientRect();
      const vw = Math.max(0, Math.min(t.right, c.right) - Math.max(t.left, c.left));
      const vh = Math.max(0, Math.min(t.bottom, c.bottom) - Math.max(t.top, c.top));
      return {
        tag: (tag.textContent || "").trim(),
        position: getComputedStyle(tag).position,
        released: tag.hasAttribute("data-released"),
        wellInView: +((Math.min(w.bottom, c.bottom) - Math.max(w.top, c.top)) / w.height).toFixed(3),
        tagVisFrac: +(t.width * t.height > 0 ? (vw * vh) / (t.width * t.height) : 0).toFixed(4),
      };
    }, i));
  }
  return out;
};

for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const cell of [{ n: "rail-1440x900", w: 1440, h: 900, dock: false }, { n: "drawer-375x667", w: 375, h: 667, dock: true }]) {
    const ctx = await br.newContext({ baseURL: BASE, viewport: { width: cell.w, height: cell.h }, hasTouch: cell.dock });
    const page = await ctx.newPage();
    await page.goto("/?size=3&difficulty=EASY&board=sticky");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    if (cell.dock) {
      await page.locator(".drawer-tab").click();
      await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
      await page.waitForTimeout(900);
    }
    await page.waitForTimeout(500);
    console.log(`\n== ${eng} ${cell.n}`);
    console.log("   SYNC (W2's own reading):", JSON.stringify(await page.evaluate(CENSUS)));
    console.log("   SETTLED (observer allowed to run):", JSON.stringify(await SETTLED(page)));
    await ctx.close();
  }
  await br.close();
}
