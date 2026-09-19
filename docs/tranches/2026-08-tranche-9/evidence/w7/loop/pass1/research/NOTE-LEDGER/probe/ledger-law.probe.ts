/**
 * NOTE-LEDGER pass 1 — THE FAMILY'S OWN LAWS, WRITTEN BEFORE ANY CURE AND RED AT HEAD.
 *
 * Three rows. The first two are the family's promise and they are RED at HEAD because the
 * product does the opposite (five null sites retract the note). The third is the family's
 * KILL, and it is RED under the family's OWN construction — which is why it is here: a lane
 * that only writes instruments its idea passes is not measuring anything.
 *
 *   L1  ACCUMULATION  — a digit lands; the note it displaced must still be readable.
 *                       RED at HEAD (`useGameState.ts:487` nulls the hint; the strip empties).
 *   L2  THE PEER ROW  — a peer's digit may ADD a line, never remove yours.
 *                       RED at HEAD (measured on `?wire=local`, both pages live).
 *   L3  THE BOARD     — the column may grow to two notes at 390×844 without the board moving.
 *                       RED under the family's own two-line column: the board jumps 13.59px.
 *
 * Read-only on the product. L3 mounts its column by cloning the live `.margin-note-block`.
 */
import { test, expect, type Page } from "@playwright/test";

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(800);
}

/** Every line currently readable in the strip, newest first. */
const column = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".board-margin .margin-note"))
      .map((n) => (n.textContent || "").trim())
      .filter(Boolean),
  );

test("L1 ACCUMULATION — a digit displaces the note, it does not erase it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  const before = await column(page);
  expect(before.length, "a hint note must be standing before the act").toBe(1);
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const after = await column(page);
  // THE FAMILY'S LAW: the hint line survives the digit, one rung quieter.
  expect(after, "the displaced note must still be readable").toContain(before[0]);
});

test("L2 THE PEER ROW — someone else's digit adds a line, it never takes yours", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await a.waitForTimeout(1200);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 20000 });
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await b.waitForTimeout(1200);

  await armHint(a);
  const mine = await column(a);
  expect(mine.length).toBe(1);

  await b.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value);
    empty[empty.length - 1]?.focus();
  });
  await b.keyboard.press("5");
  await b.waitForTimeout(1500);

  const after = await column(a);
  expect(after, "a peer's digit may not remove your line").toContain(mine[0]);
  await ctx.close();
});

test("L3 THE BOARD — a second note may not move the board at 390x844", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  const boardY = () =>
    page.evaluate(
      () =>
        Math.round(
          (document.querySelector(".board-wrapper") as HTMLElement).getBoundingClientRect().y *
            100,
        ) / 100,
    );
  const before = await boardY();
  // The family's own column, at its own honest depth: two notes, full ink and quiet.
  await page.evaluate(() => {
    const strip = document.querySelector(".board-margin") as HTMLElement;
    const live = strip.querySelector(".margin-note-block") as HTMLElement;
    const clone = live.cloneNode(true) as HTMLElement;
    const p = clone.querySelector(".margin-note") as HTMLElement;
    const ink = clone.querySelector(".margin-note-ink") as HTMLElement;
    ink.textContent = "that's a given clue";
    ink.style.animation = "none";
    p.removeAttribute("role");
    p.removeAttribute("aria-live");
    p.style.color = "var(--ink-press-quiet)";
    strip.appendChild(clone);
  });
  await page.waitForTimeout(250);
  const after = await boardY();
  expect(
    Math.abs(after - before),
    `the board moved ${Math.abs(after - before)}px when the column took a second line`,
  ).toBeLessThanOrEqual(0.5);
  await ctx.close();
});
