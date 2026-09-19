/**
 * PLR-SELF pass-2 RESEARCH probe, part 5 —
 *   L · the KEY CONTRACT reached the only way WebKit's rig allows (programmatic focus, then
 *       real key presses). Pass 1 claimed "both engines" for the Enter defect off a Tab route
 *       WebKit does not have.
 *   M · the sheet's ground under a LONGER wordmark (`futoshiki`), which is the same sheet over
 *       a different set of strokes.
 * Read-only on product files.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

const DESK = { width: 1280, height: 800 };
const say = (o: unknown) => console.log(`R2KEY|${JSON.stringify(o)}`);
const url = (game: string) =>
  `./?game=${game}&size=3&difficulty=EASY&wire=local`;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .sudoku-cell .glyph-svg").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
}
async function invite(page: Page) {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

test("L · the key contract, off a programmatic focus", async ({ browser }, ti) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(url("sudoku"));
  await settled(page);
  await invite(page);
  const p2 = await ctx.newPage();
  await p2.goto(page.url());
  await settled(p2);
  await page.bringToFront();
  await page.waitForTimeout(900);

  const m = page.locator("[data-player-mark]:visible");
  await m.evaluate((el) => (el as HTMLElement).focus());
  await page.waitForTimeout(200);
  const read = async (c: string) => ({
    case: c,
    expanded: await m.getAttribute("aria-expanded"),
    lobby: await page.locator("[data-lobby]:visible").count(),
    stillFocused: await m.evaluate((el) => el === document.activeElement),
  });
  const rows = [await read("focused")];
  for (const [label, key] of [
    ["enter-1", "Enter"],
    ["enter-2", "Enter"],
    ["space-1", "Space"],
    ["escape", "Escape"],
    ["space-2", "Space"],
  ] as const) {
    await page.keyboard.press(key);
    await page.waitForTimeout(220);
    rows.push(await read(label));
  }
  say({ t: "L", engine: ti.project.name, rows });
  await ctx.close();
});

test("M · the same sheet, a different wordmark", async ({ browser }, ti) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(url("futoshiki"));
  await settled(page);
  await invite(page);
  for (let i = 0; i < 5; i++) {
    const p = await ctx.newPage();
    await p.goto(page.url());
    await settled(p);
  }
  await page.bringToFront();
  await page.waitForTimeout(1000);
  await page.locator("[data-player-mark]:visible").click();
  await page.waitForTimeout(800);
  await page.mouse.move(640, 740);
  await page.waitForTimeout(700);

  const boxes = await page.evaluate(() => {
    const vis = (s: string) =>
      [...document.querySelectorAll(s)].find(
        (e) => (e as HTMLElement).getClientRects().length > 0,
      ) as HTMLElement | undefined;
    const r = (el?: HTMLElement) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), bottom: +b.bottom.toFixed(1), right: +b.right.toFixed(1) };
    };
    return {
      sheet: r(vis("[data-lobby]")),
      wordmark: r(vis("svg.handwritten-logo")),
      rows: [...document.querySelectorAll("[data-lobby] .lobby-name, [data-lobby] .lobby-qualifier, [data-lobby] .lobby-state, [data-lobby] .lobby-overflow")]
        .filter((e) => e.getClientRects().length)
        .map((e) => {
          const b = e.getBoundingClientRect();
          return { cls: e.className as string, text: (e.textContent ?? "").trim().slice(0, 24), x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
        }),
    };
  });

  // Every quiet-rung row, read against its own local ground.
  const out: unknown[] = [];
  for (const row of boxes.rows) {
    const clip = {
      x: Math.max(0, Math.round(row.x)),
      y: Math.max(0, Math.round(row.y)),
      width: Math.max(1, Math.round(row.w)),
      height: Math.max(1, Math.round(row.h)),
    };
    const buf = await page.screenshot({ clip });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const L: number[] = [];
    const rgb: string[] = [];
    for (let i = 0; i < data.length; i += info.channels) {
      L.push(lum(data[i], data[i + 1], data[i + 2]));
      rgb.push(`${data[i]},${data[i + 1]},${data[i + 2]}`);
    }
    const idx = L.map((v, i) => i).sort((a, b) => L[a] - L[b]);
    const ink = idx[Math.floor(idx.length * 0.02)];
    const ground = idx[Math.floor(idx.length * 0.9)];
    out.push({
      cls: row.cls,
      text: row.text,
      ink: rgb[ink],
      ground: rgb[ground],
      ratio: +(((Math.max(L[ink], L[ground]) + 0.05) / (Math.min(L[ink], L[ground]) + 0.05))).toFixed(2),
    });
  }
  say({ t: "M", engine: ti.project.name, sheet: boxes.sheet, wordmark: boxes.wordmark, rows: out });
  await ctx.close();
});
