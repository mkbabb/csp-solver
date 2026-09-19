import { test, expect, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

/**
 * THE SHEET'S PARTS, MEASURED IN ONE EVALUATE (G8′, pass 3).
 *
 * The regime is DECLARED at the context and WITNESSED by `matchMedia` before any row is
 * counted — pass 2's two censuses disagreed by 9.19 px because one read a coarse surface with
 * a fine context (typography.css raises `--type-small`/`--type-caption` under `pointer:
 * coarse`). A number without its regime is not a number.
 */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/logs";

const LOCAL = "./?size=3&difficulty=EASY&wire=local";

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}

async function arm(browser: Browser, opts: {
  width: number;
  height: number;
  coarse: boolean;
  peers: number;
}) {
  const ctx = await browser.newContext({
    viewport: { width: opts.width, height: opts.height },
    hasTouch: opts.coarse,
    isMobile: opts.coarse,
    deviceScaleFactor: 1,
  });
  const room = `plc-${Date.now()}`;
  const url = `./?size=3&difficulty=EASY&wire=local&s=${room}`;
  const a = await ctx.newPage();
  await boot(a, url);
  // WITNESS THE REGIME FIRST.
  const witness = await a.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hoverNone: matchMedia("(hover: none)").matches,
    tall: matchMedia("(min-height: 800px)").matches,
    vh: innerHeight,
    vw: innerWidth,
  }));
  const others: Page[] = [];
  for (let i = 0; i < opts.peers; i++) {
    const p = await ctx.newPage();
    await boot(p, url);
    others.push(p);
  }
  await a.bringToFront();
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(800); // the sheet's 150ms fade plus a settle margin
  const parts = await a.evaluate(() => {
    const box = document.querySelector("[data-lobby].is-open") as HTMLElement;
    const cs = getComputedStyle(box);
    const r = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
    };
    const grid = document.querySelector(".board-wrapper .grid, .grid");
    const rows = [...box.querySelectorAll(".pl-row")].map((e) => ({
      cls: e.className,
      h: +e.getBoundingClientRect().height.toFixed(2),
    }));
    return {
      sheet: r(box),
      pad: cs.paddingTop,
      border: cs.borderTopWidth,
      gap: cs.rowGap,
      lineHeight: cs.lineHeight,
      state: r(box.querySelector(".lobby-state")),
      chart: r(box.querySelector(".place-chart")),
      list: r(box.querySelector(".lobby-rows")),
      rows,
      more: r(box.querySelector(".pl-more")),
      grid: r(grid),
      sign: (() => {
        for (const el of document.querySelectorAll("[data-player-mark]")) {
          const b = el.getBoundingClientRect();
          if (b.width > 0) return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
        }
        return null;
      })(),
      chartAttrs: (() => {
        const s = box.querySelector(".place-chart") as SVGSVGElement | null;
        if (!s) return null;
        const d = s.querySelector(".chart-dot, .chart-self") as SVGCircleElement | null;
        const vb = s.viewBox.baseVal.width;
        const w = s.getBoundingClientRect().width;
        return {
          side: +w.toFixed(2),
          dotPx: d ? +((Number(d.getAttribute("r")) * w * 2) / vb).toFixed(3) : null,
          dots: s.querySelectorAll(".chart-dot").length,
          self: s.querySelectorAll(".chart-self").length,
        };
      })(),
      stateText: box.querySelector(".lobby-state")?.textContent?.trim(),
    };
  });
  const lap = parts.grid && parts.sheet ? +(parts.sheet.y + parts.sheet.h - parts.grid.y).toFixed(2) : null;
  await ctx.close();
  return { witness, parts, lap: lap !== null ? Math.max(0, lap) : null };
}

test("sheet parts and lap, every arm", async ({ browser }) => {
  test.setTimeout(600000);
  const arms = [
    { width: 390, height: 844, coarse: true, peers: 1, tag: "390x844 coarse (2,0)" },
    { width: 390, height: 844, coarse: true, peers: 4, tag: "390x844 coarse (5,0)" },
    { width: 390, height: 844, coarse: true, peers: 5, tag: "390x844 coarse (4,1)" },
    { width: 390, height: 664, coarse: true, peers: 1, tag: "390x664 coarse (2,0)" },
    { width: 1280, height: 800, coarse: false, peers: 1, tag: "1280x800 fine (2,0)" },
    { width: 1280, height: 800, coarse: false, peers: 4, tag: "1280x800 fine (5,0)" },
    { width: 1280, height: 800, coarse: false, peers: 5, tag: "1280x800 fine (4,1)" },
  ];
  const out: Record<string, unknown> = {};
  for (const a of arms) {
    out[a.tag] = await arm(browser, a);
    // eslint-disable-next-line no-console
    console.log(a.tag, JSON.stringify(out[a.tag]));
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/lap-parts.json`, JSON.stringify(out, null, 2));
});
