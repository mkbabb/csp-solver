/**
 * THE SIX-LINE BOUND UNDER A COARSE POINTER — where the type rungs step up.
 *
 * The phone geometry read in `proto.spec.ts` is a FINE pointer at 390 (`--type-small` 14,
 * `--type-tag` 12.179). A real phone is coarse, where the rungs step to 16 / 14 and the sheet
 * is taller for the same six lines. This is the arm the synthesis's budget was written about.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("the six-line bound under a COARSE pointer", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: info.project.name === "chromium",
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  if (!(await verb.isVisible())) {
    await a.locator(".drawer-tab").first().click();
    await a.waitForTimeout(700); // the sheet SLIDES
  }
  await verb.click();
  await a.waitForTimeout(600);
  const room = new URL(a.url()).searchParams.get("s")!;

  const peers = async (from: number, to: number) => {
    await a.evaluate(
      ({ r, from, to }) => {
        const ch = new BroadcastChannel("board:" + r);
        for (let i = from; i < to; i++)
          ch.postMessage({ kind: "hi", data: {}, from: "coarse-" + i });
        ch.close();
      },
      { r: room, from, to },
    );
    await a.waitForTimeout(400);
  };

  const read = async (label: string) => {
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(280);
    const m = await a.evaluate(() => {
      const mark = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const lobby = mark.parentElement!.querySelector("[data-lobby]") as HTMLElement;
      const r = lobby.getBoundingClientRect();
      const cells = [...document.querySelectorAll(".sudoku-cell")].map(
        (c) => c.getBoundingClientRect().top,
      );
      const row = lobby.querySelector(".lobby-row") as HTMLElement | null;
      const state = lobby.querySelector(".lobby-state") as HTMLElement;
      return {
        y: +r.y.toFixed(1),
        h: +r.height.toFixed(1),
        bottom: +(r.y + r.height).toFixed(1),
        right: +(r.x + r.width).toFixed(1),
        rows: lobby.querySelectorAll(".lobby-row").length,
        overflow: lobby.querySelector(".lobby-overflow")?.textContent ?? "",
        rowSize: row ? getComputedStyle(row).fontSize : null,
        rowH: row ? +row.getBoundingClientRect().height.toFixed(1) : null,
        stateSize: getComputedStyle(state).fontSize,
        markBox: [
          +mark.getBoundingClientRect().width.toFixed(1),
          +mark.getBoundingClientRect().height.toFixed(1),
        ],
        boardTop: +Math.min(...cells).toFixed(1),
        scroll: [lobby.scrollHeight, lobby.clientHeight],
      };
    });
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(200);
    console.log(`COARSE|${JSON.stringify({ engine: info.project.name, label, ...m })}`);
    return m;
  };

  await read("solo");
  await peers(0, 4);
  const five = await read("state + 5 rows");
  await peers(4, 15);
  const sixteen = await read("state + 4 rows + and N more");
  expect(five.bottom, "five rows clear the board at coarse").toBeLessThanOrEqual(
    five.boardTop,
  );
  expect(
    sixteen.bottom,
    "the compressed sheet clears the board at coarse",
  ).toBeLessThanOrEqual(sixteen.boardTop);
  expect(sixteen.right).toBeLessThanOrEqual(256);
  expect(sixteen.scroll[0], "the sheet never scrolls").toBeLessThanOrEqual(
    sixteen.scroll[1],
  );
  await ctx.close();
});
