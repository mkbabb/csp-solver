/**
 * PLR-SELF pass-2 RESEARCH probe, part 6 — the headline, nailed down. The quiet rung's GLYPH
 * CORE (darkest painted pixel, not a percentile) inside the sheet, over two different wordmarks.
 * `--ink-press-quiet` composites to rgb(107) over the paper (252) and to rgb(91) over the
 * wordmark's bleed (204); this reads which one the glyphs actually land on. Read-only.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

const DESK = { width: 1280, height: 800 };
const say = (o: unknown) => console.log(`R2GND|${JSON.stringify(o)}`);
const url = (g: string) => `./?game=${g}&size=3&difficulty=EASY&wire=local`;
const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const cr = (a: number, b: number) =>
  +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .sudoku-cell .glyph-svg").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
}

test("N · the glyph core, two wordmarks", async ({ browser }, ti) => {
  for (const game of ["sudoku", "futoshiki", "kenken"]) {
    const ctx = await browser.newContext({ viewport: DESK });
    const page = await ctx.newPage();
    await page.goto(url(game));
    await settled(page);
    const verb = page.locator(
      '.controls-card button[aria-label="Play together on this board"]',
    );
    await expect(verb).toBeEnabled();
    await verb.click();
    await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
    for (let i = 0; i < 5; i++) {
      const p = await ctx.newPage();
      await p.goto(page.url());
      await settled(p);
    }
    await page.bringToFront();
    await page.waitForTimeout(1000);
    await page.locator("[data-player-mark]:visible").click();
    await page.waitForTimeout(800);
    await page.mouse.move(640, 740);
    await page.waitForTimeout(700);

    const boxes = await page.evaluate(() => {
      const vis = (s: string) =>
        [...document.querySelectorAll(s)].find(
          (e) => (e as HTMLElement).getClientRects().length > 0,
        ) as HTMLElement | undefined;
      const r = (el?: HTMLElement) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height, right: b.right, bottom: b.bottom };
      };
      return {
        wordmark: r(vis("svg.handwritten-logo")),
        sheet: r(vis("[data-lobby]")),
        quiet: [...document.querySelectorAll("[data-lobby] .lobby-state, [data-lobby] .lobby-qualifier, [data-lobby] .lobby-overflow")]
          .filter((e) => e.getClientRects().length)
          .map((e) => {
            const b = e.getBoundingClientRect();
            return {
              cls: (e.className as string).split(" ")[0],
              text: (e.textContent ?? "").trim().slice(0, 20),
              x: b.x, y: b.y, w: b.width, h: b.height,
            };
          }),
      };
    });

    const rows: unknown[] = [];
    for (const q of boxes.quiet) {
      const clip = {
        x: Math.max(0, Math.round(q.x)),
        y: Math.max(0, Math.round(q.y)),
        width: Math.max(1, Math.round(q.w)),
        height: Math.max(1, Math.round(q.h)),
      };
      const buf = await page.screenshot({ clip });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      let min = 255,
        minRgb = "";
      const hist = new Map<number, number>();
      for (let i = 0; i < data.length; i += info.channels) {
        const v = data[i];
        hist.set(v, (hist.get(v) ?? 0) + 1);
        if (v < min) {
          min = v;
          minRgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        }
      }
      // the paper this row actually sits on: the brightest mode in its own box
      const modes = [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
      const paper = Math.max(...modes.map((m) => m[0]));
      const core = min;
      rows.push({
        cls: q.cls,
        text: q.text,
        core: minRgb,
        paper,
        coreVsPaper: cr(lum(core, core, core), lum(paper, paper, paper)),
        darkerThan100: [...hist.entries()].filter(([v]) => v < 100).reduce((s, [, n]) => s + n, 0),
        band91to110: [...hist.entries()].filter(([v]) => v >= 88 && v <= 112).reduce((s, [, n]) => s + n, 0),
        modes,
      });
    }
    say({
      t: "N",
      engine: ti.project.name,
      game,
      wordmarkW: boxes.wordmark ? +boxes.wordmark.w.toFixed(1) : null,
      wordmarkBox: boxes.wordmark
        ? { x: +boxes.wordmark.x.toFixed(1), bottom: +boxes.wordmark.bottom.toFixed(1), right: +boxes.wordmark.right.toFixed(1) }
        : null,
      sheetBottom: boxes.sheet ? +boxes.sheet.bottom.toFixed(1) : null,
      rows,
    });
    await ctx.close();
  }
});
