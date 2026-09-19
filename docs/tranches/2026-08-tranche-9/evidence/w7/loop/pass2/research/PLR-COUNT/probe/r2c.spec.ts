/**
 * L' · G4's re-aim, diagnosed to the binding rather than to the pixel.
 *
 * `authorInk` (`useSession.ts:402`) is the only thing that puts `--color-user-ink` on a cell,
 * and it is keyed off `ledger.clock[pos][1]`. This reads the ledger, `known`, `authorInk` and
 * the DOM at the same instant, so the gate's shape is chosen against what the session actually
 * holds rather than against a screenshot.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
const bank = (name: string, engine: string, data: unknown) => {
  fs.writeFileSync(path.join(OUT, `${name}-${engine}.json`), JSON.stringify(data, null, 1));
  console.log(`${name}|${engine}|${JSON.stringify(data)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

const state = (p: Page) =>
  p.evaluate(async () => {
    const m = (await import("/src/games/shared/useSession.ts")) as unknown as {
      session: { players: { value: { id: string; slug: string; self: boolean; ink: Record<string, string> }[] } };
      authorInk: { value: Record<string, Record<string, string>> };
      cellAuthors: { value: Record<string, { slug: string; self: boolean }> };
    };
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    return {
      players: m.session.players.value.map((p) => ({
        id: p.id.slice(0, 8),
        slug: p.slug,
        self: p.self,
        ink: p.ink,
      })),
      authorInk: m.authorInk.value,
      authorInkCount: Object.keys(m.authorInk.value).length,
      cellAuthors: m.cellAuthors.value,
      cellAuthorCount: Object.keys(m.cellAuthors.value).length,
      domBound: cells.filter((c) => (c.getAttribute("style") ?? "").includes("--color-user-ink"))
        .length,
      filled: [...document.querySelectorAll(".sudoku-cell input")].filter(
        (i) => (i as HTMLInputElement).value,
      ).length,
    };
  });

test("L' the binding, diagnosed", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await a.waitForTimeout(900);

  const write = async (p: Page, digit: string) => {
    const idx = await p.evaluate(() =>
      [...document.querySelectorAll(".sudoku-cell input")].findIndex(
        (i) => !(i as HTMLInputElement).value,
      ),
    );
    if (idx < 0) return -1;
    const cell = p.locator(".sudoku-cell input").nth(idx);
    await cell.click();
    await cell.fill(digit);
    await p.waitForTimeout(800);
    return idx;
  };

  const s0 = await state(a);
  const aIdx = await write(a, "5");
  await a.waitForTimeout(700);
  const s1 = await state(a);
  const bIdx = await write(b, "6");
  await a.waitForTimeout(1500);
  const s2 = await state(a);
  const s2b = await state(b);

  bank("lprime-binding", info.project.name, {
    aIdx,
    bIdx,
    s0: { players: s0.players, authorInkCount: s0.authorInkCount, cellAuthorCount: s0.cellAuthorCount, domBound: s0.domBound, filled: s0.filled },
    s1: { authorInkCount: s1.authorInkCount, cellAuthorCount: s1.cellAuthorCount, domBound: s1.domBound, filled: s1.filled, cellAuthors: s1.cellAuthors },
    s2: { authorInkCount: s2.authorInkCount, authorInk: s2.authorInk, cellAuthorCount: s2.cellAuthorCount, cellAuthors: s2.cellAuthors, domBound: s2.domBound, filled: s2.filled, players: s2.players },
    s2onB: { authorInkCount: s2b.authorInkCount, authorInk: s2b.authorInk, domBound: s2b.domBound, players: s2b.players },
  });
  await ctx.close();
});
