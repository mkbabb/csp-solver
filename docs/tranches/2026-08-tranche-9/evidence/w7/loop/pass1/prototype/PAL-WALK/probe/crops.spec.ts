/**
 * PAL-WALK · PASS-1 PROTOTYPE — three frames.
 *
 *   A  the closest pair among the FIRST EIGHT (indices 2 and 7, 12.38° apart), two digits in
 *      adjacent cells, dpr3, light
 *   B  the same cells at SIXTEEN (indices 2 and 15, 4.99° apart) — the yield case, shown
 *   C  the roster of a real two-page room, light: your row inside the system
 *
 * A and B are STAGED POSES, and say so: the two cells are handed `inkFor(2)` / `inkFor(7)` on
 * the same `--color-user-ink` property `authorInk` binds, because a two-page room only ever
 * deals indices 0 and 1 and the pair worth looking at is the closest one. The BYTES are the
 * module's own; the arrangement is the photographer's. C is not staged at all.
 */
import { test, expect, type Page } from "@playwright/test";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PAL-WALK/frames";
const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}

test("A/B — the closest pair at eight and at sixteen, dpr3, light", async ({ browser }) => {
  const ctx = await browser.newContext({ deviceScaleFactor: 3, viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto(SOLO);
  await settled(page);

  // two ADJACENT empty cells in one row, filled by hand
  const pair = await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
    for (let i = 0; i + 1 < cells.length; i++) {
      const a = cells[i].querySelector<HTMLInputElement>("input");
      const b = cells[i + 1].querySelector<HTMLInputElement>("input");
      if (a && b && !a.readOnly && !b.readOnly && !a.value && !b.value && (i % 9) + 1 < 9)
        return [i, i + 1];
    }
    return null;
  });
  expect(pair, "two adjacent writable cells").not.toBeNull();
  const inputs = page.locator(".sudoku-cell input");
  await inputs.nth(pair![0]).click();
  await page.keyboard.type("4");
  await inputs.nth(pair![1]).click();
  await page.keyboard.type("6");
  // and hand the focus back, or the crayon-blue focus ring photographs as if it were the ink
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(600);

  const shoot = async (which: [number, number], name: string): Promise<void> => {
    const box = await page.evaluate(
      async ({ pair, which }) => {
        const m = (await import("/src/games/shared/playerIdentity.ts")) as {
          inkFor: (i: number) => Record<string, string>;
        };
        const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
        cells[pair[0]].style.setProperty("--color-user-ink", m.inkFor(which[0])["--color-user-ink"]);
        cells[pair[1]].style.setProperty("--color-user-ink", m.inkFor(which[1])["--color-user-ink"]);
        const a = cells[pair[0]].getBoundingClientRect();
        const b = cells[pair[1]].getBoundingClientRect();
        return {
          x: Math.floor(a.left) - 4,
          y: Math.floor(a.top) - 4,
          width: Math.ceil(b.right - a.left) + 8,
          height: Math.ceil(a.height) + 8,
          inks: [
            m.inkFor(which[0])["--color-user-ink"],
            m.inkFor(which[1])["--color-user-ink"],
          ],
        };
      },
      { pair: pair!, which },
    );
    console.log(`FRAME ${name} · inks ${box.inks.join("  ")}`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${name}.png`, clip: box, scale: "device" });
  };

  await shoot([2, 7], "pair-at-eight-dpr3-light");
  await shoot([2, 15], "pair-at-sixteen-dpr3-light");
  await ctx.close();
});

test("C — the roster of a real room, light", async ({ browser }) => {
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await a.bringToFront();
  await a.waitForTimeout(900);
  await a.locator(".controls-card .players-roster").screenshot({
    path: `${OUT}/roster-your-row-light.png`,
    scale: "device",
  });
  await ctx.close();
});
