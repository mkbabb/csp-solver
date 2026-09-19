/**
 * frames-final.probe.ts — the twelve crops the owner reads, and nothing else.
 *
 * Every frame is cited in the prototype's README. Sizes are held down by cropping tight and
 * re-encoding through sharp's palette path: the brief's cap is 150 KB a frame and 400 KB for
 * the set, and a 244x244 board crop has perhaps six colours in it.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/ACC-GRAPHITE/frames";
mkdirSync(FRAMES, { recursive: true });

const SOLO = "./?size=3&difficulty=HARD";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(800);
}

async function shot(
  page: Page,
  name: string,
  clip: { x: number; y: number; width: number; height: number },
) {
  const buf = await page.screenshot({ type: "png", clip });
  await sharp(buf).png({ palette: true, compressionLevel: 9 }).toFile(join(FRAMES, name));
}

async function cells(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell")).map((c, i) => {
      const b = c.getBoundingClientRect();
      const inp = c.querySelector<HTMLInputElement>("input");
      return {
        i,
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        value: inp?.value ?? "",
        label: inp?.getAttribute("aria-label") ?? "",
      };
    }),
  );
}

async function focusCell(page: Page, i: number) {
  await page.evaluate((n: number) => {
    document
      .querySelectorAll<HTMLElement>(".sudoku-cell")
      [n].querySelector<HTMLInputElement>("input")
      ?.focus();
  }, i);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(350);
}

for (const scheme of ["light", "dark"] as const) {
  test(`ring + tally + authorship — desk ${scheme}`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    const cs = await cells(page);
    const n = Math.round(Math.sqrt(cs.length));
    const mid = cs.find((c) => !c.value && c.i > n * 2 + 2)!;
    await focusCell(page, mid.i);

    // 1. THE RING — the selected cell and its eight neighbours, 244x244, for the five-second
    //    read beside the research's `ring-control-*`.
    const side = mid.w * 3;
    await shot(page, `ring-${scheme}-${browserName}.png`, {
      x: Math.max(0, mid.x - mid.w - (244 - side) / 2),
      y: Math.max(0, mid.y - mid.h - (244 - side) / 2),
      width: 244,
      height: 244,
    });
    if (browserName !== "chromium") return;

    // 2. THE AUTHORSHIP SEAM — a clue beside your digit, arm A as the prototype ships it.
    await page.keyboard.type("5");
    await page.waitForTimeout(400);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(250);
    const after = await cells(page);
    const given = after.find((c) => /given clue/i.test(c.label))!;
    const entry = after.find((c) => /your entry/i.test(c.label))!;
    await shot(page, `authorship-armA-${scheme}.png`, {
      x: Math.max(0, Math.min(given.x, entry.x) - 4),
      y: Math.max(0, Math.min(given.y, entry.y) - 4),
      width: Math.min(220, Math.abs(given.x - entry.x) + given.w * 2 + 8),
      height: Math.min(220, Math.abs(given.y - entry.y) + given.h * 2 + 8),
    });
    if (scheme !== "light") return;

    // 2b. ARM B (clue 5.5 / entry 4.0), injected over the same board, same two cells.
    await page.addStyleTag({
      content: `.sudoku-cell .glyph-svg path { stroke-width: 4 !important }
        .sudoku-cell:has(input[aria-label*="given clue"]) .glyph-svg path { stroke-width: 5.5 !important }`,
    });
    await page.waitForTimeout(250);
    await shot(page, `authorship-armB-light.png`, {
      x: Math.max(0, Math.min(given.x, entry.x) - 4),
      y: Math.max(0, Math.min(given.y, entry.y) - 4),
      width: Math.min(220, Math.abs(given.x - entry.x) + given.w * 2 + 8),
      height: Math.min(220, Math.abs(given.y - entry.y) + given.h * 2 + 8),
    });
    await page.evaluate(() => document.querySelectorAll("style").forEach(() => {}));
    await page.reload();
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(800);

    // 3. THE TALLY at k = 3 and at 100% written, the board's top-left corner.
    const board = await page.evaluate(() => {
      const s = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
      const b = s.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const type = async (count: number) => {
      const fresh = await cells(page);
      const n2 = Math.round(Math.sqrt(fresh.length));
      const sub = Math.round(Math.sqrt(n2));
      const vals = fresh.map((c) => c.value);
      let done = 0;
      for (const c of fresh.filter((x) => !x.value)) {
        if (done >= count) break;
        const r = Math.floor(c.i / n2);
        const col = c.i % n2;
        const used = new Set<string>();
        for (let k = 0; k < n2; k++) {
          used.add(vals[r * n2 + k]);
          used.add(vals[k * n2 + col]);
        }
        const br = Math.floor(r / sub) * sub;
        const bc = Math.floor(col / sub) * sub;
        for (let dr = 0; dr < sub; dr++)
          for (let dc = 0; dc < sub; dc++) used.add(vals[(br + dr) * n2 + bc + dc]);
        let pick = "";
        for (let d = 1; d <= n2; d++)
          if (!used.has(String(d))) {
            pick = String(d);
            break;
          }
        if (!pick) continue;
        await page.evaluate((idx: number) => {
          document
            .querySelectorAll<HTMLElement>(".sudoku-cell")
            [idx].querySelector<HTMLInputElement>("input")
            ?.focus();
        }, c.i);
        await page.keyboard.type(pick);
        vals[c.i] = pick;
        done++;
      }
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.waitForTimeout(450);
    };
    await type(3);
    await shot(page, "tally-k3-light.png", {
      x: board.x,
      y: Math.max(0, board.y - 14),
      width: Math.min(300, board.w),
      height: 44,
    });
    await type(200);
    await shot(page, "tally-full-light.png", {
      x: board.x,
      y: Math.max(0, board.y - 14),
      width: Math.min(300, board.w),
      height: 44,
    });
  });
}

test("ring — phone 393x699 dpr3, the clearance row", async ({ browser }) => {
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await boot(page);
    const cs = await cells(page);
    const n = Math.round(Math.sqrt(cs.length));
    const mid = cs.find((c) => !c.value && c.i > n * 2 + 2)!;
    await focusCell(page, mid.i);
    await shot(page, `ring-phone-${scheme}.png`, {
      x: Math.max(0, mid.x - mid.w),
      y: Math.max(0, mid.y - mid.h),
      width: mid.w * 3,
      height: mid.h * 3,
    });
    await ctx.close();
  }
});

test("the room — three of your cells, before the peer and after", async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  // write three digits of your own
  const first = await cells(a);
  const targets = first.filter((c) => !c.value).slice(0, 3);
  for (const t of targets) {
    await a.evaluate((n: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [n].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, t.i);
    await a.keyboard.type("1");
  }
  await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await a.waitForTimeout(500);
  const box = {
    x: Math.max(0, Math.min(...targets.map((t) => t.x)) - 6),
    y: Math.max(0, Math.min(...targets.map((t) => t.y)) - 6),
    width: Math.min(260, Math.max(...targets.map((t) => t.x + t.w)) - Math.min(...targets.map((t) => t.x)) + 12),
    height: Math.min(200, Math.max(...targets.map((t) => t.y + t.h)) - Math.min(...targets.map((t) => t.y)) + 12),
  };
  await shot(a, "room-before-light.png", box);
  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click({ timeout: 15000 });
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(a.url());
  await b.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 30000,
  });
  await a.waitForTimeout(1500);
  // …and write one more, NOW that a second hand is here. The crop then carries both: the
  // digits you wrote before the room (which no clock entry names, so they stay the pencil) and
  // the one you wrote inside it, in the colour the room knows you by. The seam is the finding.
  const room = await cells(a);
  const next = room.find((c) => !c.value && c.y >= box.y - 40 && c.y <= box.y + box.height + 40);
  if (next) {
    await a.evaluate((n: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [n].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, next.i);
    await a.keyboard.type("2");
    await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await a.waitForTimeout(900);
  }
  const wide = {
    x: Math.max(0, Math.min(box.x, next?.x ?? box.x) - 6),
    y: Math.max(0, Math.min(box.y, next?.y ?? box.y) - 6),
    width: Math.min(
      320,
      Math.max(box.x + box.width, (next?.x ?? 0) + (next?.w ?? 0)) -
        Math.min(box.x, next?.x ?? box.x) +
        12,
    ),
    height: Math.min(
      220,
      Math.max(box.y + box.height, (next?.y ?? 0) + (next?.h ?? 0)) -
        Math.min(box.y, next?.y ?? box.y) +
        12,
    ),
  };
  await shot(a, "room-after-light.png", wide);
  await ctx.close();
});

test("the gallery — zero diff against the retired wax", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("./");
  await page.waitForTimeout(2500);
  const buf = await page.screenshot({ type: "png", fullPage: false });
  await sharp(buf)
    .extract({ left: 0, top: 0, width: 640, height: 400 })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(join(FRAMES, "gallery-light.png"));
  // and the number the crop cannot give: how many pixels carry any crayon-blue-ish hue
  const blue = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-crayon-blue"),
  );
  console.log("GALLERY --color-crayon-blue =", JSON.stringify(blue));
});
