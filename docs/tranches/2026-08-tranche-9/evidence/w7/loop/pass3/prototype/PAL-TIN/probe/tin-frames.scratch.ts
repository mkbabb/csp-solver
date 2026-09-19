import { test, expect, type Page } from "@playwright/test";

// SCRATCH — the lane's frame + census rig, not a product file. Removed before the lane returns;
// a copy is banked under the evidence dir's probe/.

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PAL-TIN/frames";

const SOLO = "./?size=3&difficulty=EASY";
const LOCAL = SOLO + "&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function boot(page: Page, url: string) {
  await page.goto(url);
  await settled(page);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
const roster = (page: Page) =>
  page.locator(".controls-card .players-roster .player-row");

async function room(browser: import("@playwright/test").Browser, n: number) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await boot(p, link);
    pages.push(p);
  }
  for (const p of pages) await expect(roster(p)).toHaveCount(n, { timeout: 60000 });
  return { ctx, pages };
}
async function setDark(page: Page, on: boolean) {
  await page.evaluate((v) => {
    document.documentElement.classList.toggle("dark", v);
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, on);
}

test("frames + the filter census at sixteen", async ({ browser }) => {
  test.slow();
  const { ctx, pages } = await room(browser, 7);
  const a = pages[0];

  // (i) the roster at seven, light — two ticks against their words, the pill where it was
  await a.locator(".players-roster").screenshot({ path: `${OUT}/roster-seven-light.png` });

  // a peer past the fifth pencil writes, so the tape has a shared stick to name
  const idx = await a.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !(i as HTMLInputElement).value,
    ),
  );
  const sixth = pages[5];
  const c = sixth.locator(".sudoku-cell input").nth(idx);
  await c.click();
  await c.fill("7");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(idx).inputValue()).toBe("7");

  // (ii) the tape over a shared-stick digit, DARK
  await setDark(a, true);
  await a.locator(".sudoku-cell").nth(idx).hover();
  await a.waitForTimeout(400);
  const tape = a.locator(".attribution-tape");
  const tapeText = await tape.innerText().catch(() => "");
  const tapeTick = await a.locator(".attribution-tape .roster-tick").count();
  console.log(`TAPE dark: text=${JSON.stringify(tapeText)} ticks=${tapeTick}`);
  const board = a.locator(".board-wrapper, .sudoku-board").first();
  await board.screenshot({ path: `${OUT}/tape-shared-stick-dark.png` });

  // (iii) a dark board with two sticks and a peer ring at the ring arm
  const other = await sixth.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !(i as HTMLInputElement).value,
    ),
  );
  await sixth.locator(".sudoku-cell input").nth(other).click();
  await a.waitForTimeout(600);
  const ring = await a.evaluate(() => {
    const el = document.querySelector(".game-cell.is-peer-cursor .cell-ghost-path");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { stroke: cs.stroke, opacity: cs.strokeOpacity, width: cs.strokeWidth, fill: cs.fill, fillOpacity: cs.fillOpacity };
  });
  console.log(`RING PAINTED (cascade): ${JSON.stringify(ring)}`);
  await board.screenshot({ path: `${OUT}/ring-dark.png` });

  // (iv) the amber-beside-amber pair, light, tape open
  await setDark(a, false);
  await a.locator(".sudoku-cell").nth(idx).hover();
  await a.waitForTimeout(400);
  await a.locator(".players-roster").screenshot({ path: `${OUT}/amber-beside-amber-light.png` });

  await ctx.close();
});

test("the live-filter census with a sixteen-player roster", async ({ browser }) => {
  test.slow();
  const { ctx, pages } = await room(browser, 8);
  const a = pages[0];
  await expect(roster(a)).toHaveCount(8);
  await a.waitForTimeout(1200);
  const hits = await a.evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      if (!cs.filter || cs.filter === "none") continue;
      if (cs.display === "none") continue;
      const raw =
        typeof el.className === "string"
          ? el.className
          : ((el as unknown as { className?: { baseVal?: string } }).className?.baseVal ?? "");
      out.push(`${el.tagName.toLowerCase()}.${raw.trim().split(/\s+/).slice(0, 2).join(".")}`);
    }
    return out;
  });
  const ticks = await a.locator(".roster-tick").count();
  console.log(`FILTER CENSUS at 8: ${hits.length} — ${JSON.stringify(hits)}`);
  console.log(`ROSTER TICKS at 8: ${ticks} (rows 5..7 share a stick)`);
  expect(hits.length).toBe(9);
  await ctx.close();
});

test("the room of one, and the solo fingerprint", async ({ page }) => {
  await boot(page, SOLO);
  expect(await page.locator(".roster-tick").count()).toBe(0);
  expect(await page.locator(".glyph-tick").count()).toBe(0);
  // THE FINGERPRINT IS THE INK BINDING, not any inline style: the cells carry a `--ghost-path`
  // and their own geometry on a solo board too, and counting those would be measuring the
  // estate rather than the tin.
  const styled = await page.evaluate(
    () => document.querySelectorAll('.sudoku-cell[style*="--color-user-ink"]').length,
  );
  const anyStyle = await page.evaluate(
    () => document.querySelectorAll(".sudoku-cell[style]").length,
  );
  console.log(`SOLO: cells with an INK binding ${styled} · cells with any style attribute ${anyStyle}`);
  const devStyle = await page.evaluate(
    () => document.querySelectorAll('style[data-vite-dev-id*="PlayerTick"]').length,
  );
  console.log(`SOLO: cells carrying a style attribute ${styled} · dev PlayerTick style tags ${devStyle}`);
  expect(styled).toBe(0);
});
