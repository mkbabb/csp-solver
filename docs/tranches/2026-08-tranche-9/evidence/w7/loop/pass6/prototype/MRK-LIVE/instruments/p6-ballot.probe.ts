/** T9-W7 pass 6 · MRK-LIVE · the ring-token ballot as ONE lawful frame per theme (three arms, one
 *  payload, one variable: the ring's ink × opacity), labels burned in; and the toggle pair re-read
 *  as NUMBERS with the sun parked (its pass-5 crops were an unlawful pair: the sun's phase). */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/MRK-LIVE";
const log = (s: string) => fs.appendFileSync(`${OUT}/logs/P6-ballot.log`, s + "\n");
function mintSudoku(sub: number): string {
  const n = sub * sub;
  let cells = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
      cells += (i > 1 && (r * 7 + c * 3) % 5 < 2 ? v : 0).toString(36);
    }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const P9 = mintSudoku(3);
const P16 = mintSudoku(4);
async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.evaluate(() => document.querySelector<HTMLElement>(".sun-moon-toggle")?.click());
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(1500);
}

test("P6-BALLOT · the ring token, three arms, one payload (16×16, cells 0–1), per theme", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "one engine frames the ballot; both engines are in the numbers");
  test.setTimeout(240000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`./?size=4&board=${P16}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  await page.waitForTimeout(1200);
  const ARMS = {
    light: [["A alias #3a7bc4", "#3a7bc4", 0.95], ["B #4589d2", "#4589d2", 0.95], ["C #4589d2", "#4589d2", 1]],
    dark: [["A alias #3a7bc4", "#3a7bc4", 0.95], ["B #2f68aa", "#2f68aa", 0.95], ["C #2f68aa", "#2f68aa", 1]],
  } as const;
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    const tiles: Buffer[] = [];
    let W = 0, H = 0;
    for (const [label, hex, op] of ARMS[theme]) {
      await page.evaluate(({ hex, op }) => {
        document.getElementById("p6-arm")?.remove();
        const s = document.createElement("style");
        s.id = "p6-arm";
        s.textContent = `:root,.dark{--color-focus-sketch:${hex}!important} .game-cell:has(input:focus-visible) .cell-ghost-path{stroke-opacity:${op}!important}`;
        document.head.appendChild(s);
      }, { hex, op });
      await page.evaluate(() => document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[0]?.focus());
      await page.keyboard.press("Shift");
      await page.waitForTimeout(700);
      const read = await page.evaluate(() => {
        const p = document.querySelector(".board-shell .game-cell .cell-ghost-path")!;
        const c = document.querySelector(".board-shell .game-cell")!.getBoundingClientRect();
        const g = getComputedStyle(p);
        return { stroke: g.stroke, op: g.strokeOpacity, x: c.x, y: c.y, w: c.width, h: c.height, given: [...document.querySelectorAll(".board-shell .game-cell [aria-label]")].length };
      });
      const clip = { x: Math.max(0, Math.floor(read.x - 14)), y: Math.max(0, Math.floor(read.y - 14)), width: Math.ceil(read.w * 2 + 28), height: Math.ceil(read.h + 28) };
      const shot = await page.screenshot({ clip });
      const big = await sharp(shot).resize({ width: clip.width * 3, height: clip.height * 3, kernel: "nearest" }).png().toBuffer();
      W = clip.width * 3;
      H = clip.height * 3;
      const band = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="34"><rect width="100%" height="100%" fill="#ffffff"/><text x="8" y="23" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="#111">${label} (computed @${read.op})</text></svg>`);
      tiles.push(await sharp({ create: { width: W, height: H + 34, channels: 3, background: "#ffffff" } }).composite([{ input: band, top: 0, left: 0 }, { input: big, top: 34, left: 0 }]).png().toBuffer());
      log(`${theme} ${label}: stroke ${read.stroke} op ${read.op} cell ${read.w.toFixed(2)}px clip ${JSON.stringify(clip)} payload ${P16}`);
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    }
    await page.evaluate(() => document.getElementById("p6-arm")?.remove());
    const gap = 8;
    const out = `${OUT}/ballot-ring-token-3arms-16x16-cells0-1-${theme}-chromium-1280x800-fine-prm.png`;
    await sharp({ create: { width: W * 3 + gap * 2, height: H + 34, channels: 3, background: "#888888" } })
      .composite(tiles.map((t, i) => ({ input: t, top: 0, left: i * (W + gap) })))
      .png({ palette: true, quality: 80 })
      .toFile(out);
    log(`${theme} triptych → ${out} ${fs.statSync(out).size} B`);
  }
});

test("P6-TOGGLE · the keyboard/mouse pair as numbers, the sun PARKED (reduce), theme held light", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const state = () =>
    page.evaluate(() => ({
      dark: document.documentElement.classList.contains("dark"),
      active: (document.activeElement?.className?.toString() || document.activeElement?.tagName || "").split(" ")[0],
      fv: !!document.activeElement?.matches(":focus-visible"),
      rings: document.querySelectorAll(".focus-ring").length,
    }));
  const sunInk = async () => {
    const b = (await page.locator(".sun-moon-toggle").boundingBox())!;
    const clip = { x: Math.max(0, b.x - 70), y: Math.max(0, b.y - 70), width: b.width + 140, height: b.height + 140 };
    const { data, info: i } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
    let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < i.height; y++)
      for (let x = 0; x < i.width; x++) {
        const o = (y * i.width + x) * i.channels;
        const [r, g, bb] = [data[o], data[o + 1], data[o + 2]];
        if (r > 180 && g > 90 && g < 200 && bb < 110 && r - bb > 90) {
          n++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        }
      }
    return { ink: n, bbox: n ? `${x1 - x0 + 1}x${y1 - y0 + 1}` : "0" };
  };
  const boot = async () => {
    await page.goto(`./?size=3&board=${P9}`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1500);
    await setTheme(page, "dark");
  };
  await boot();
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus());
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
  await page.waitForTimeout(2600);
  const k = { ...(await state()), ...(await sunInk()) };
  await boot();
  const b = (await page.locator(".sun-moon-toggle").boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
  await page.mouse.move(5, 790);
  await page.waitForTimeout(2600);
  const m = { ...(await state()), ...(await sunInk()) };
  log(`TOGGLE ${info.project.name} keyboard ${JSON.stringify(k)} | mouse ${JSON.stringify(m)} | payload ${P9}`);
  expect(k.dark).toBe(false);
  expect(m.dark).toBe(false);
});
