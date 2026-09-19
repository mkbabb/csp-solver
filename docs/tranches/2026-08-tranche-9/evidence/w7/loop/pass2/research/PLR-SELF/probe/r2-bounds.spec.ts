/**
 * PLR-SELF pass-2 RESEARCH probe, part 3 — G8's successor bounds, measured at the two viewports
 * that matter, INCLUDING the coarse phone, and against every neighbour the sheet can lap:
 * the sun (`.corner-right`), the board, and the WORDMARK, which pass 1 never bounded.
 * Read-only on product files.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const say = (o: unknown) => console.log(`R2BOUND|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page) {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}

test("H · the sheet's neighbours, fine and coarse", async ({ browser }, ti) => {
  for (const arm of [
    { name: "desk-fine", vp: DESK, touch: false, dsf: 1 },
    { name: "phone-fine", vp: PHONE, touch: false, dsf: 1 },
    { name: "phone-coarse", vp: PHONE, touch: true, dsf: 3 },
  ]) {
    const ctx = await browser.newContext({
      viewport: arm.vp,
      hasTouch: arm.touch,
      isMobile: arm.touch && ti.project.name === "chromium",
      deviceScaleFactor: arm.dsf,
    });
    const page = await ctx.newPage();
    await page.goto(SOLO);
    await settled(page);
    await invite(page);

    // Real peers: the local arm is a BroadcastChannel, so extra tabs are extra players.
    const room = page.url();
    for (let i = 0; i < 5; i++) {
      const p = await ctx.newPage();
      await p.goto(room);
      await settled(p);
    }
    await page.bringToFront();
    await page.waitForTimeout(1000);

    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    await page.locator("[data-player-mark]:visible").click();
    await page.waitForTimeout(800);

    const geo = await page.evaluate(() => {
      const vis = (s: string) =>
        [...document.querySelectorAll(s)].find(
          (e) => (e as HTMLElement).getClientRects().length > 0,
        ) as HTMLElement | undefined;
      const r = (s: string) => {
        const el = vis(s);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: +b.x.toFixed(1),
          y: +b.y.toFixed(1),
          w: +b.width.toFixed(1),
          h: +b.height.toFixed(1),
          top: +b.top.toFixed(1),
          bottom: +b.bottom.toFixed(1),
          right: +b.right.toFixed(1),
        };
      };
      const sheet = vis("[data-lobby]");
      return {
        sheet: r("[data-lobby]"),
        mark: r("[data-player-mark]"),
        wordmark: r("svg.handwritten-logo"),
        sun: r(".corner-right"),
        board: r(".board-frame") ?? r(".game-board") ?? r(".sudoku-grid"),
        controls: r(".controls-card"),
        rowCount: document.querySelectorAll("[data-lobby] .lobby-name").length,
        overflow: (
          vis("[data-lobby] .lobby-overflow")?.textContent ?? ""
        ).trim(),
        scroll: sheet ? { sh: sheet.scrollHeight, ch: sheet.clientHeight } : null,
        rung: sheet
          ? {
              state: getComputedStyle(vis("[data-lobby] .lobby-state")!).fontSize,
              name: getComputedStyle(vis("[data-lobby] .lobby-name")!).fontSize,
            }
          : null,
      };
    });
    say({ t: "H", engine: ti.project.name, arm: arm.name, coarse, geo });
    await ctx.close();
  }
});
