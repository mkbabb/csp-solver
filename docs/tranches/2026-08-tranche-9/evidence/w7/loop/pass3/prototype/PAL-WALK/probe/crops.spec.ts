// PRM: live, because the crops are of static poses — the boil is parked before each shot and no
// asserted number comes out of this file (it is the owner's U-10 picture, four frames).
import { test, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PAL-WALK/frames";

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.waitForTimeout(2600);
}

/** Write `hands` digits into the first cells the board leaves empty, each in its own walk ink. */
async function writeHands(page: Page, n: number): Promise<void> {
  await page.evaluate(async (count) => {
    const served = "/src/games/shared/playerIdentity.ts";
    const m = (await import(/* @vite-ignore */ served)) as {
      inkFor: (i: number) => Record<string, string>;
    };
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const empty = cells.filter((c) => !c.querySelector(".glyph-svg path"));
    // the first `count` empty cells take one hand each; the walk's own indices, in order
    const chosen = empty.slice(0, count);
    chosen.forEach((cell, i) => {
      const idx = [0, 38, 1, 2, 3, 4, 5, 6][i] ?? i;
      cell.style.setProperty("--color-user-ink", m.inkFor(idx)["--color-user-ink"]);
      const input = cell.querySelector("input");
      if (input) {
        input.value = String((i % 9) + 1);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    (window as unknown as { __hands: HTMLElement[] }).__hands = chosen;
  }, n);
  await page.waitForTimeout(900);
  // the write re-renders; re-assert the inks the same way the seat does
  await page.evaluate(async (count) => {
    const served = "/src/games/shared/playerIdentity.ts";
    const m = (await import(/* @vite-ignore */ served)) as {
      inkFor: (i: number) => Record<string, string>;
    };
    const chosen = (window as unknown as { __hands: HTMLElement[] }).__hands ?? [];
    chosen.slice(0, count).forEach((cell, i) => {
      const idx = [0, 38, 1, 2, 3, 4, 5, 6][i] ?? i;
      cell.style.setProperty("--color-user-ink", m.inkFor(idx)["--color-user-ink"]);
    });
  }, n);
  await page.waitForTimeout(400);
}

async function boardClip(page: Page) {
  const b = await page.locator(".board-wrapper").first().boundingBox();
  if (!b) throw new Error("no board box");
  return {
    x: Math.max(0, b.x),
    y: Math.max(0, b.y),
    width: Math.min(b.width, 700),
    height: Math.min(b.height, 700),
  };
}

for (const arm of ["light", "dark"] as const) {
  test(`four hands, ${arm}`, async ({ page }) => {
    await page.goto(SOLO);
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, arm);
    await settled(page);
    await writeHands(page, 4);
    await page.screenshot({ path: `${OUT}/four-hands-${arm}.png`, clip: await boardClip(page), scale: "css" });
  });
}

test("eight hands, light", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await writeHands(page, 8);
  await page.screenshot({ path: `${OUT}/eight-hands-light.png`, clip: await boardClip(page), scale: "css" });
});

test("the ring, dark: the shipped band beside HEAD's", async ({ page }) => {
  await page.goto(SOLO);
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await settled(page);
  await page.evaluate(async () => {
    const served = "/src/games/shared/playerIdentity.ts";
    const m = (await import(/* @vite-ignore */ served)) as {
      inkFor: (i: number) => Record<string, string>;
    };
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const seat = (cell: HTMLElement, ink: string): void => {
      const set = (): void => {
        cell.style.setProperty("--color-peer-cursor-ink", ink);
        cell.classList.add("is-peer-cursor");
      };
      set();
      new MutationObserver(() => {
        if (!cell.classList.contains("is-peer-cursor")) set();
      }).observe(cell, { attributes: true, attributeFilter: ["class", "style"] });
    };
    // left: the shipped ring band. right: HEAD's, which is the DIGIT's band — the regression.
    seat(cells[38], m.inkFor(5)["--color-peer-cursor-ink"]);
    seat(cells[42], m.inkFor(5)["--color-user-ink"]);
  });
  await page.waitForTimeout(600);
  const a = await page.locator(".game-cell").nth(38).boundingBox();
  const b = await page.locator(".game-cell").nth(42).boundingBox();
  if (!a || !b) throw new Error("no cells");
  await page.screenshot({
    path: `${OUT}/ring-dark-shipped-vs-head.png`,
    scale: "css",
    clip: {
      x: a.x - 8,
      y: a.y - 8,
      width: b.x + b.width - a.x + 16,
      height: a.height + 16,
    },
  });
});
