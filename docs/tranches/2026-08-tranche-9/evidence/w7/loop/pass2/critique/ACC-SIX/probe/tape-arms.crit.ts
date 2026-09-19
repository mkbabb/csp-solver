/**
 * The four tape arms the prototype's bank does not carry (T9-W7 ACC-SIX critique, pass 2).
 * Read-only on the product; run against the prototype worktree on 127.0.0.1:4238, both
 * engines, desk 1280x800 light + reduce unless a test says otherwise.
 *
 *   1 · the 4x4 board  — writable 4, so ONE write is 25% of the board and the clockwise
 *       front is already past the top-right corner. Violet under the tape: chromium
 *       209 / 259 / 258 and webkit 220 / 264 / 266 device px at fills 1 / 2 / 3.
 *       The charter's "occlusion is 0 for its whole life by arithmetic" is false on a
 *       shipped board size, at the desk, in both engines, from the first fill.
 *   2 · the stall     — a board left at TWO fills keeps the tape: still on the board
 *       4.2 s after the second write in both engines (the lift window is 2.6 s). The rest
 *       timer is only armed at `filled >= TAPE_FILLS`.
 *   3 · the re-lay    — write 1, clear it, write again: `1 of 20 on the board` is taught a
 *       SECOND time on the same deal, both engines. `taught` is set at the rest, not at
 *       the lay-down, so the prototype's own "taught once per deal" only holds for a deal
 *       that reaches three fills.
 *   4 · print / forced / the board under the tape — the tape still renders under
 *       `media: print` in both engines (its own diff adds a print arm for the trace and
 *       none for the tape); under forced-colors chromium it becomes rgba(255,255,255,0.83)
 *       with black text; and its box sits on 2,719 px2 of two live cells and 464 px2 of one
 *       glyph's box at the desk — π the family measured neither way.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = "<this dir>/../readings";
mkdirSync(OUT, { recursive: true });
const isViolet = (r: number, g: number, b: number) => b - g >= 60 && r > g && b > r;

async function violetScan(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
) {
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels)
    if (isViolet(data[i]!, data[i + 1]!, data[i + 2]!)) n++;
  return n;
}

const boot = async (page: Page, url: string) => {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
};

const firstBlank = async (page: Page) => {
  const inputs = page.locator(".sudoku-cell input:not([readonly]):not([disabled])");
  const total = await inputs.count();
  for (let i = 0; i < total; i++) {
    const el = inputs.nth(i);
    if ((await el.inputValue()) === "") return el;
  }
  throw new Error("no blank cell");
};

const tapeText = (page: Page) =>
  page.evaluate(() => document.querySelector(".count-tape")?.textContent?.trim() ?? null);

// 1 · the 4x4 board
test("the tape on a 4x4 board", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page, "./?size=2&difficulty=EASY");
  const rows: unknown[] = [];
  for (let f = 1; f <= 3; f++) {
    const el = await firstBlank(page);
    await el.click();
    await page.keyboard.press("1");
    await page.waitForTimeout(400);
    const t = await page.evaluate(() => {
      const el2 = document.querySelector(".count-tape") as HTMLElement | null;
      const b = document.querySelector(".board-wrapper") as HTMLElement | null;
      if (!el2 || !b) return null;
      const r = el2.getBoundingClientRect();
      return {
        tape: { x: r.x, y: r.y, w: r.width, h: r.height },
        boardW: b.clientWidth,
        text: el2.textContent?.trim(),
      };
    });
    const occ = t
      ? await violetScan(page, {
          x: Math.max(0, Math.floor(t.tape.x)),
          y: Math.max(0, Math.floor(t.tape.y)),
          width: Math.ceil(t.tape.w) + 2,
          height: Math.ceil(t.tape.h) + 2,
        })
      : null;
    rows.push({ fill: f, ...t, violetUnderTape: occ });
  }
  writeFileSync(
    join(OUT, `small-4x4-${browserName}.json`),
    JSON.stringify({ engine: browserName, rows }, null, 2),
  );
});

// 2 · the stall
test("a board left at two fills keeps the tape", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page, "./?size=3&difficulty=EASY");
  for (let i = 0; i < 2; i++) {
    const el = await firstBlank(page);
    await el.click();
    await page.keyboard.press("1");
    await page.waitForTimeout(200);
  }
  const at2 = await tapeText(page);
  await page.waitForTimeout(4200);
  const after = await tapeText(page);
  writeFileSync(
    join(OUT, `life-stall-${browserName}.json`),
    JSON.stringify({ engine: browserName, at2, afterRestWindow: after }, null, 2),
  );
});

// 3 · the re-lay
test("an undo to empty before the lesson ends re-lays the tape", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page, "./?size=3&difficulty=EASY");
  const a = await firstBlank(page);
  await a.click();
  await page.keyboard.press("1");
  await page.waitForTimeout(200);
  const first = await tapeText(page);
  await a.click();
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(300);
  const cleared = await tapeText(page);
  const c = await firstBlank(page);
  await c.click();
  await page.keyboard.press("2");
  await page.waitForTimeout(300);
  const second = await tapeText(page);
  writeFileSync(
    join(OUT, `life-relay-${browserName}.json`),
    JSON.stringify({ engine: browserName, first, cleared, second }, null, 2),
  );
});

// 4 · print, forced-colors, and the board surface under the tape
test("the tape under print, forced-colors, and on the board's own cells", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page, "./?size=3&difficulty=EASY");
  const el = await firstBlank(page);
  await el.click();
  await page.keyboard.press("1");
  await page.waitForTimeout(400);
  const read = () =>
    page.evaluate(() => {
      const t = document.querySelector(".count-tape") as HTMLElement | null;
      if (!t) return null;
      const cs = getComputedStyle(t);
      const r = t.getBoundingClientRect();
      const area = (list: Element[]) =>
        list
          .map((c) => {
            const b = c.getBoundingClientRect();
            const w = Math.max(0, Math.min(r.right, b.right) - Math.max(r.x, b.x));
            const h = Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.y, b.y));
            return w * h;
          })
          .filter((a) => a > 0);
      const cells = area([...document.querySelectorAll(".sudoku-cell")]);
      const glyphs = area([...document.querySelectorAll(".sudoku-cell .glyph-svg")]);
      return {
        color: cs.color,
        background: cs.backgroundColor,
        box: { x: r.x, y: r.y, w: r.width, h: r.height },
        cellsOverlapped: cells.length,
        cellOverlapPx2: +cells.reduce((a, b) => a + b, 0).toFixed(1),
        glyphsOverlapped: glyphs.length,
        glyphOverlapPx2: +glyphs.reduce((a, b) => a + b, 0).toFixed(1),
      };
    });
  const screen = await read();
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  await page.waitForTimeout(150);
  const print = await read();
  await page.emulateMedia({
    media: "screen",
    forcedColors: "active",
    reducedMotion: "reduce",
  });
  await page.waitForTimeout(150);
  const forced = await read();
  writeFileSync(
    join(OUT, `arms-${browserName}.json`),
    JSON.stringify({ engine: browserName, screen, print, forced }, null, 2),
  );
});
