/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE — the frames the brief names, poses PINNED.
 *
 * The board's pose is the grid's own `data-mark-pose`, so a crop pins it by writing that
 * attribute; the chrome ring's and the armed verb's poses are pinned by a one-rule stylesheet
 * that says which sibling paints. Nothing here changes geometry — only which pose is opaque.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });

test.use({ deviceScaleFactor: 3 });

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

/** Pin the board's pose, and stop the beat so the crop cannot land mid-swap. */
async function pinBoard(page: Page, pose: number) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate((p) => {
    document.querySelector(".board-cells")?.setAttribute("data-mark-pose", String(p));
  }, pose);
  await page.waitForTimeout(260);
}

/** Pin a drawn pose stack (the chrome ring, or an outline's `.boil-pose` siblings). */
async function pinDrawn(page: Page, pose: number) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate((p) => {
    document.getElementById("mrk-pin")?.remove();
    const st = document.createElement("style");
    st.id = "mrk-pin";
    st.textContent = `
      .focus-ring path { opacity: 0 !important; }
      .focus-ring path:nth-of-type(${p + 1}) { opacity: 1 !important; }
      .guard-face .boil-pose { opacity: 0 !important; display: none !important; }
      .guard-face .boil-pose:nth-of-type(${p + 1}) { opacity: 1 !important; display: inline !important; }`;
    document.head.appendChild(st);
  }, pose);
  await page.waitForTimeout(240);
}

/** A CORNER of a target's ring — a whole deck card at dpr3 is 415 KB, over the 150 KB cap. */
async function cropCorner(page: Page, sel: string, pad: number, side: number, name: string) {
  const box = await page.evaluate(
    ({ s, p, n }) => {
      const el = document.querySelector<HTMLElement>(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.round(r.x - p)),
        y: Math.max(0, Math.round(r.y - p)),
        width: n,
        height: n,
      };
    },
    { s: sel, p: pad, n: side },
  );
  if (!box) return false;
  writeFileSync(join(OUT, name), await page.screenshot({ clip: box }));
  return true;
}

async function crop(page: Page, sel: string, pad: number, name: string) {
  const box = await page.evaluate(
    ({ s, p }) => {
      const el = document.querySelector<HTMLElement>(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.round(r.x - p)),
        y: Math.max(0, Math.round(r.y - p)),
        width: Math.round(r.width + p * 2),
        height: Math.round(r.height + p * 2),
      };
    },
    { s: sel, p: pad },
  );
  if (!box || box.width <= 0) return false;
  const buf = await page.screenshot({ clip: box });
  writeFileSync(join(OUT, name), buf);
  return true;
}

test("frames — the living cell, the chrome ring, the armed verb", async ({
  page,
  browserName,
}) => {
  // (a) the focused cell at 9x9, 1280x800, light — pose 0 and pose 2
  if (browserName === "chromium") {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
    await boardReady(page, "?size=3&difficulty=EASY");
    await page.evaluate(() => {
      const i = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      i[40]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(700);
    await pinBoard(page, 0);
    await crop(page, ".game-cell:has(input:focus-visible)", 6, "a-cell-9x9-pose0-light.png");
    await pinBoard(page, 2);
    await crop(page, ".game-cell:has(input:focus-visible)", 6, "a-cell-9x9-pose2-light.png");

    // (c) the chrome ring on the toggle (its 54px ornament outset) — pose 0 and 2, light
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus(),
    );
    await page.waitForTimeout(700);
    await pinDrawn(page, 0);
    await crop(page, ".sun-moon-toggle", 60, "c-ring-toggle-pose0-light.png");
    await pinDrawn(page, 2);
    await crop(page, ".sun-moon-toggle", 60, "c-ring-toggle-pose2-light.png");

    // (d) the armed destructive verb — pose 0 and 2, light. The ribbon arms only over a board
    // with marks on it, so write a digit first, then choose a different game.
    await page.evaluate(() => {
      const i = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const empty = i.find((el) => !el.value && !el.readOnly && !el.disabled);
      empty?.focus();
    });
    await page.keyboard.press("1");
    await page.waitForTimeout(700);
    await page.evaluate(() =>
      document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
    );
    await page.keyboard.press("Enter");
    await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
      timeout: 60000,
    });
    await page.waitForTimeout(1400);
    // `d` is the DEAL verb, and a deal over a board with marks on it is what still arms the
    // ribbon solo (the select arm is session-only since 2026-08-04).
    await page.keyboard.press("d");
    await page.waitForTimeout(1400);
    const armed = await page.locator(".guard-leave").count();
    if (armed) {
      await pinDrawn(page, 0);
      await crop(page, ".guard-leave", 10, "d-verb-armed-pose0-light.png");
      await pinDrawn(page, 2);
      await crop(page, ".guard-leave", 10, "d-verb-armed-pose2-light.png");
    } else {
      writeFileSync(join(OUT, "d-verb-armed-MISSING.txt"), "the ribbon did not arm\n");
    }
    return;
  }

  // (b) the focused cell at 16x16, 393x699, DARK — pose 0 and pose 2, webkit
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page, "?size=4&difficulty=EASY");
  await page.evaluate(() => {
    const i = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    i[Math.floor(i.length / 2)]?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(700);
  await pinBoard(page, 0);
  await crop(page, ".game-cell:has(input:focus-visible)", 5, "b-cell-16x16-pose0-dark.png");
  await pinBoard(page, 2);
  await crop(page, ".game-cell:has(input:focus-visible)", 5, "b-cell-16x16-pose2-dark.png");

  // (c) the chrome ring on the deck's centre card, dark — pose 0 and pose 2
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1600);
  await pinDrawn(page, 0);
  await cropCorner(page, ".game-card.is-center", 10, 150, "c-ring-deckcard-pose0-dark.png");
  await pinDrawn(page, 2);
  await cropCorner(page, ".game-card.is-center", 10, 150, "c-ring-deckcard-pose2-dark.png");
});
