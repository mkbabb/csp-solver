/**
 * PLR-COUNT G16's NEGATIVE CONTROL. The floor `ink(6) >= ink(1)` is only a claim about the
 * heading rung if the SAME instrument reads the subheading rung failing it. The rung is put
 * back to `--type-subheading` by a page-level override (the source is untouched), the same
 * crop is taken, and `ink-weight.mjs` reads both.
 */
import { test, expect, type Page } from "@playwright/test";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-COUNT/frames";

const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 3,
});

test("the written count at both rungs, and N=2 and N=4 for the runs census", async ({
  page,
}) => {
  const room = `rung-${Date.now()}`;
  await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);

  const arrive = async (k: number) => {
    await page.evaluate(
      ({ room, k }) => {
        const w = window as unknown as { __ch?: BroadcastChannel };
        w.__ch ??= new BroadcastChannel(`board:${room}`);
        for (let i = 0; i < k; i++)
          w.__ch.postMessage({ kind: "hi", data: {}, from: `rung-${i}-${Math.random()}` });
      },
      { room, k },
    );
    await page.waitForTimeout(900);
  };

  // N = 2 and N = 4, the two the strip did not carry
  await arrive(1);
  await mark(page).screenshot({ path: `${OUT}/strip-N2.png` });
  await arrive(2);
  await mark(page).screenshot({ path: `${OUT}/strip-N4.png` });

  // N = 6 at the shipped (heading) rung, then the same frame at the subheading rung
  await arrive(2);
  expect(await mark(page).getAttribute("aria-label")).toBe("6 players");
  await mark(page).screenshot({ path: `${OUT}/strip-N6-heading.png` });
  await page.addStyleTag({
    content: ".pt-count { font-size: var(--type-subheading) !important; }",
  });
  await page.waitForTimeout(200);
  const px = await page.evaluate(
    () => getComputedStyle(document.querySelector(".pt-count")!).fontSize,
  );
  console.log("ABLATED RUNG", px);
  await mark(page).screenshot({ path: `${OUT}/strip-N6-subheading.png` });
});
