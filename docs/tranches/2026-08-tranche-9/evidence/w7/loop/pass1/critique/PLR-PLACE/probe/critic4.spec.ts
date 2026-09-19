/**
 * PLR-PLACE pass-1 CRITIQUE probe 4 — the arms the prototype left open.
 *
 * π · the rect census in WEBKIT (the prototype ran chromium only): HEAD on :4243 against the
 *     prototype on :4248, twelve selectors, two viewports. The :4243 tree is fingerprinted
 *     first (`player-swatch` present, `data-player-mark` absent) so the control is named.
 * L · the phone lap, re-measured by this lane at both heights.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(__dirname, "..", "logs");
const HEAD = "http://127.0.0.1:4243";
const PROTO = "http://127.0.0.1:4248";
const Q = "/?size=3&difficulty=EASY&wire=local";
const MARK = "[data-player-mark]";
const SELECTORS = [
  ".attribution-trigger",
  ".corner-right",
  ".toggle-icon",
  "h1",
  ".board-group",
  '[role="grid"]',
  ".controls-card",
  ".play-controls",
  ".action-bar",
  ".tray-well",
  ".drawer-tab",
  ".sudoku-cell",
];
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT4|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const rects = (p: Page, sels: string[]) =>
  p.evaluate((list) => {
    const out: Record<string, { x: number; y: number; w: number; h: number } | null> = {};
    for (const s of list) {
      const el = [...document.querySelectorAll(s)].find(
        (e) =>
          (e as HTMLElement).offsetParent !== null ||
          getComputedStyle(e).position === "fixed",
      ) as HTMLElement | undefined;
      if (!el) {
        out[s] = null;
        continue;
      }
      const r = el.getBoundingClientRect();
      out[s] = {
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      };
    }
    return out;
  }, sels);

test("CRITIC 4 — the webkit π arm and the lap", async ({ browser }, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });

  for (const vp of [
    { w: 1280, h: 800, name: "desk" },
    { w: 390, h: 844, name: "phone844" },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      ...(vp.name === "desk" ? {} : { hasTouch: true, isMobile: eng === "chromium", deviceScaleFactor: 3 }),
    });
    const head = await ctx.newPage();
    await head.goto(HEAD + Q);
    await settled(head);
    const proto = await ctx.newPage();
    await proto.goto(PROTO + Q);
    await settled(proto);
    await head.waitForTimeout(600);
    const rh = await rects(head, SELECTORS);
    const rp = await rects(proto, SELECTORS);
    const deltas: Record<string, string> = {};
    for (const s of SELECTORS) {
      const A = rh[s];
      const B = rp[s];
      if (!A || !B) {
        deltas[s] = `${A ? "" : "HEAD missing "}${B ? "" : "PROTO missing"}`.trim() || "missing";
        continue;
      }
      const d = (["x", "y", "w", "h"] as const)
        .map((k) => `${k}:${(B[k] - A[k]).toFixed(2)}`)
        .filter((t) => !t.endsWith(":0.00") && !t.endsWith(":-0.00"))
        .join(" ");
      deltas[s] = d || "0.00";
    }
    rec(`pi.${vp.name}`, deltas);
    await ctx.close();
  }

  // ── L · the lap, this lane's own reading ────────────────────────────────────────────
  for (const h of [844, 664]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: h },
      hasTouch: true,
      isMobile: eng === "chromium",
      deviceScaleFactor: 3,
    });
    const p = await ctx.newPage();
    await p.goto(PROTO + Q);
    await settled(p);
    const marks = p.locator(MARK);
    const n = await marks.count();
    let mark = marks.first();
    for (let i = 0; i < n; i++) if (await marks.nth(i).isVisible()) mark = marks.nth(i);
    await mark.click();
    await p.waitForTimeout(900);
    const geo = await p.evaluate(() => {
      const q = (s: string) => {
        const el = [...document.querySelectorAll(s)].find(
          (e) =>
            (e as HTMLElement).offsetParent !== null ||
            getComputedStyle(e).position === "fixed",
        ) as HTMLElement | undefined;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), h: +r.height.toFixed(1), w: +r.width.toFixed(1) };
      };
      return {
        sheet: q("[data-lobby]"),
        board: q(".board-group") ?? q('[role="grid"]'),
        grid: q('[role="grid"]'),
        scrollY: window.scrollY,
        rows: document.querySelectorAll("[data-lobby] .lobby-row").length,
      };
    });
    const lap =
      geo.sheet && geo.board ? +(geo.sheet.bottom - geo.board.top).toFixed(1) : null;
    rec(`lap.${h}`, { ...geo, lap });
    await ctx.close();
  }

  writeFileSync(join(OUT, `critic4-${eng}.json`), JSON.stringify(bank, null, 2));
});
