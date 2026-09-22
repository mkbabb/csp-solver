// PAL-TIN pass-4 SCRATCH — the four cited crops, each a replacement for a pass-3 one.
// Not a product file; deleted before the lane returns. PRM: frozen — emulateMedia in `boot`.
import { test, expect, type Page } from "@playwright/test";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PAL-TIN";
const SOLO = "./?size=3&difficulty=EASY";
const LOCAL = SOLO + "&wire=local";

async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const roster = (page: Page) => page.locator(".controls-card .players-roster .player-row");
async function room(browser: import("@playwright/test").Browser, n: number, extra = "") {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL + extra);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await boot(p, link);
    pages.push(p);
  }
  for (const p of pages) await expect(roster(p)).toHaveCount(n, { timeout: 60000 });
  return { ctx, pages, link };
}
const setTheme = (page: Page, mode: "light" | "dark") =>
  page.evaluate(
    (m) => (
      document.documentElement.classList.toggle("dark", m === "dark"),
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    ),
    mode,
  );

test("i · the roster at seven, light — the two laps carrying their tallies", async ({ browser }) => {
  test.slow();
  const { ctx, pages } = await room(browser, 7);
  const a = pages[0];
  await setTheme(a, "light");
  // the roster is a scroller with a fade — pass 3's crop cut the two rows that carry the mark.
  await a.setViewportSize({ width: 1280, height: 1600 });
  await a.evaluate(() => {
    const r = document.querySelector(".players-roster")!;
    r.scrollTop = r.scrollHeight;
  });
  await a.waitForTimeout(4000);
  const n = await a.locator(".roster-tick").count();
  console.log(`FRAME i: rows 7 · roster ticks ${n}`);
  await a.locator(".controls-card .players-roster").screenshot({
    path: `${OUT}/roster-seven-tallies-light.png`,
  });
  await ctx.close();
});

test("ii · the tape over a shared stick, dark — the tick inside the tape", async ({ browser }) => {
  test.slow();
  const { ctx, pages } = await room(browser, 7);
  const a = pages[0];
  await setTheme(a, "dark");
  const empties = await a.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i, k) => ((i as HTMLInputElement).value ? -1 : k))
      .filter((k) => k >= 0),
  );
  const at = empties.find((k) => k > 20)!;
  const c = pages[6].locator(".sudoku-cell input").nth(at);
  await c.click();
  await c.fill("7");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(at).inputValue()).toBe("7");
  await a.locator(".sudoku-cell").nth(at).hover();
  await expect(a.locator(".attribution-tape")).toHaveCount(1, { timeout: 15000 });
  await a.waitForTimeout(600);
  const tape = (await a.locator(".attribution-tape").boundingBox())!;
  console.log(
    `FRAME ii: tape "${await a.locator(".attribution-tape").innerText()}" ticks ${await a
      .locator(".attribution-tape .roster-tick")
      .count()}`,
  );
  await a.screenshot({
    path: `${OUT}/tape-tick-dark.png`,
    clip: {
      x: Math.max(0, tape.x - 100),
      y: Math.max(0, tape.y - 40),
      width: 360,
      height: 190,
    },
  });
  await ctx.close();
});

test("iii + iv · F1's two arms, light — the board with and without your own stick", async ({
  browser,
}) => {
  test.slow();
  for (const [arm, file, extra] of [
    ["YES (default)", "f1-yes-self-takes-a-stick-light.png", ""],
    ["NO (?selfink=0)", "f1-no-self-in-house-ink-light.png", "&selfink=0"],
  ] as const) {
    const { ctx, pages } = await room(browser, 3, extra);
    const a = pages[0];
    await setTheme(a, "light");
    const empties = await a.evaluate(() =>
      [...document.querySelectorAll(".sudoku-cell input")]
        .map((i, k) => ((i as HTMLInputElement).value ? -1 : k))
        .filter((k) => k >= 0),
    );
    // three hands on one board: you, and two peers
    const write = async (p: Page, at: number, d: string) => {
      const c = p.locator(".sudoku-cell input").nth(at);
      await c.click();
      await c.fill(d);
      await expect.poll(() => a.locator(".sudoku-cell input").nth(at).inputValue()).toBe(d);
    };
    await write(a, empties[0], "1");
    await write(pages[1], empties[1], "2");
    await write(pages[2], empties[2], "3");
    await a.mouse.move(0, 0);
    await a.waitForTimeout(800);
    const mine = await a.evaluate((k) => {
      const cell = document.querySelectorAll(".sudoku-cell")[k] as HTMLElement;
      const g = cell.querySelector(".glyph-svg path");
      return g ? getComputedStyle(g).stroke : "none";
    }, empties[0]);
    console.log(`FRAME F1 ${arm}: your own digit strokes ${mine}`);
    const board = (await a.locator(".board-wrapper").boundingBox())!;
    await a.screenshot({
      path: `${OUT}/${file}`,
      clip: { x: board.x, y: board.y, width: board.width, height: Math.min(300, board.height) },
    });
    await ctx.close();
  }
});
