/**
 * PLR-PLACE · CRITIC · the retire trigger and the budget, re-run by a second hand.
 * Desk, both engines, a REAL mouse press on a cell then a REAL mouse press on the sign.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-PLACE/logs";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT|${k}|${JSON.stringify(v)}`);
};
const census = (p: Page) =>
  p.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.filter === "none" || cs.display === "none") continue;
      n++;
    }
    return n;
  });

test("the seam and the budget", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    hasTouch: false,
    isMobile: false,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => a.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await expect.poll(() => census(a), { timeout: 40000 }).toBe(9);
  rec("shut.filters", await census(a));

  await a.locator(".sudoku-cell").nth(40).click();
  await a.waitForTimeout(250);
  const before = await a.evaluate(
    () => (document.activeElement as HTMLElement)?.tagName + "/" + (document.activeElement as HTMLInputElement)?.getAttribute("aria-label"),
  );
  rec("focus.before", before);

  await a.locator("[data-player-mark]").locator("visible=true").first().click();
  await a.waitForTimeout(800);
  const after = await a.evaluate(
    () => (document.activeElement as HTMLElement)?.tagName + "/" + (document.activeElement as HTMLInputElement)?.getAttribute("aria-label"),
  );
  rec("focus.after", after);
  rec("focus.kept", before === after);
  rec("sheet.visible", await a.locator("[data-lobby]:visible").count());
  rec("selfRings", await a.locator(".chart-self").count());
  rec("open.filters", await census(a));
  rec(
    "chart.box",
    await a.evaluate(() => {
      const s = document.querySelector(".place-chart") as SVGElement | null;
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    }),
  );
  // the ring's own painted ink vs the sheet's own opaque ground
  rec(
    "ring.aa",
    await a.evaluate(() => {
      const ring = document.querySelector(".chart-self") as SVGElement | null;
      const sheet = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement;
      if (!ring || !sheet) return null;
      const rgb = (s: string) => {
        const m = (s.match(/[\d.]+/g) || []).map(Number);
        return m.length >= 3 && s.startsWith("color(") ? m.slice(0, 3).map((v) => v * 255) : m.slice(0, 3);
      };
      const lum = (c: number[]) =>
        c
          .map((v) => v / 255)
          .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((a2, v, i) => a2 + v * [0.2126, 0.7152, 0.0722][i], 0);
      const f = lum(rgb(getComputedStyle(ring).stroke));
      const b = lum(rgb(getComputedStyle(sheet).backgroundColor));
      const [hi, lo] = f > b ? [f, b] : [b, f];
      return {
        stroke: getComputedStyle(ring).stroke,
        width: getComputedStyle(ring).strokeWidth,
        ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2),
      };
    }),
  );
  // Escape closes a mouse-opened sheet
  await a.keyboard.press("Escape");
  await a.waitForTimeout(400);
  rec("escape.closed", (await a.locator("[data-lobby]:visible").count()) === 0);
  await ctx.close();
  writeFileSync(join(OUT, `crit-seam-${info.project.name}.json`), JSON.stringify(bank, null, 1));
});
