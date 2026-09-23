/**
 * PLR-COUNT pass 5 — THE STRIP and the ballot crops, on dev (a room needs `?wire=local`).
 * ARM names the source state the run was made on (the const flips are scripted and restored).
 * Every crop is made on ONE payload minted from the dev control's own deal, reduced motion on so
 * every stroke is inked, the regime witnessed. Crops only; plrc-strip.mjs reads them.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.PROTO_DEV!;
const CTRL = process.env.CONTROL_DEV!;
const ARM = process.env.ARM!;
const CROPS = process.env.CROPS!;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol("unread");
  await expect
    .poll(
      async () => {
        const v = JSON.stringify(await read());
        const same = v === last;
        last = v;
        return same;
      },
      { intervals: [200], timeout: 10000 },
    )
    .toBe(true);
}
async function mint(page: Page): Promise<string> {
  await page.goto(`${CTRL}/?size=3&difficulty=EASY`);
  await settled(page);
  const cells = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0")
      .join(""),
  );
  return Buffer.from("\x01" + "3." + cells, "binary")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  const was = parseInt((await mark(page).getAttribute("aria-label")) ?? "1", 10);
  await page.evaluate(
    ({ room, k, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `strip-${from + i}` });
      setTimeout(() => ch.close(), 0);
    },
    { room, k, from },
  );
  await expect
    .poll(async () => parseInt((await mark(page).getAttribute("aria-label"))!, 10))
    .toBe(was + k);
}
const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();
async function toDark(page: Page) {
  await page.getByRole("button", { name: "Switch to dark mode" }).first().click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
    .toBe(true);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(200, 830);
  await stable(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor));
}
const box = (page: Page) =>
  mark(page).evaluate((m) => {
    const b = m.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });

for (const theme of ["light", "dark"] as const)
  test.describe(`strip ${theme}`, () => {
    test.use({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 3,
      reducedMotion: "reduce",
    });
    test(`strip ${theme}`, async ({ page, browserName }) => {
      const payload = await mint(page);
      const room = `strip-${ARM}-${theme}-${Date.now()}`;
      await page.goto(`${BASE}/?size=3&board=${payload}&wire=local&s=${room}`);
      await settled(page);
      if (theme === "dark") await toDark(page);
      const dir = `${CROPS}/${ARM}/${browserName}-${theme}`;
      mkdirSync(dir, { recursive: true });
      const meta: Record<string, unknown> = {
        payload: payload.slice(0, 24) + "…",
        regime: await page.evaluate(() => ({
          coarse: matchMedia("(pointer: coarse)").matches,
          dpr: devicePixelRatio,
          dark: document.documentElement.classList.contains("dark"),
        })),
      };
      const first = await box(page);
      let at = 1;
      for (const N of [1, 2, 3, 4, 5, 6]) {
        await peers(page, room, N - at);
        at = N;
        await stable(() => box(page));
        const b = await box(page);
        meta[`N${N}`] = { ...b, label: await mark(page).getAttribute("aria-label") };
        await page.screenshot({
          path: `${dir}/N${N}.png`,
          clip: { x: first.x - 4, y: b.y - 4, width: 112, height: b.h + 8 },
        });
        if (N === 3 && theme === "light")
          await page.screenshot({ path: `${dir}/head-N3.png`, clip: { x: 0, y: 0, width: 390, height: b.y + b.h + 14 } });
      }
      if (ARM === "shipped") {
        await page.addStyleTag({ content: ".pt-count { font-size: var(--type-heading) !important; }" });
        await stable(() => box(page));
        const b = await box(page);
        await page.screenshot({
          path: `${dir}/N6-heading.png`,
          clip: { x: first.x - 4, y: b.y - 4, width: 112, height: b.h + 8 },
        });
      }
      writeFileSync(`${dir}/meta.json`, JSON.stringify(meta, null, 1));
    });
  });

test.describe("rows", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
  for (const theme of ["light", "dark"] as const)
    test(`rows ${theme}`, async ({ page, browserName }) => {
      const payload = await mint(page);
      const room = `rows-${ARM}-${theme}-${Date.now()}`;
      await page.goto(`${BASE}/?size=3&board=${payload}&wire=local&s=${room}`);
      await settled(page);
      if (theme === "dark") await toDark(page);
      await peers(page, room, 3);
      await mark(page).click();
      const lobby = page.locator("[data-lobby]:visible").first();
      await stable(() => lobby.evaluate((e) => [e.getBoundingClientRect().height, getComputedStyle(e).opacity]));
      const stubs = await lobby.evaluate((s) =>
        [...s.querySelectorAll(".pl-stub")].map((r) => {
          const b = r.getBoundingClientRect();
          return { x: b.x, y: b.y, w: b.width, h: b.height };
        }),
      );
      const dir = `${CROPS}/${ARM}/${browserName}-${theme}`;
      mkdirSync(dir, { recursive: true });
      for (let i = 0; i < stubs.length; i++)
        await page.screenshot({
          path: `${dir}/row${i}.png`,
          clip: { x: stubs[i].x - 5, y: stubs[i].y - 2, width: stubs[i].w + 10, height: stubs[i].h + 4 },
        });
    });
});

test.describe("solo desk", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  test("solo desk", async ({ page, browserName }) => {
    const payload = await mint(page);
    await page.goto(`${BASE}/?size=3&board=${payload}`);
    await settled(page);
    await page.mouse.move(640, 790);
    const corner = await page.locator(".corner-left").first().evaluate((e) => {
      const b = e.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const dir = `${CROPS}/${ARM}/${browserName}-light`;
    mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: `${dir}/solo-desk.png`, clip: { x: 0, y: 0, width: 260, height: corner.y + corner.h + 12 } });
    writeFileSync(`${dir}/solo-desk.json`, JSON.stringify({ corner, marks: await page.locator("[data-player-mark]:visible").count(), label: (await page.locator("[data-player-mark]:visible").count()) ? await page.locator("[data-player-mark]:visible").first().getAttribute("aria-label", { timeout: 3000 }) : null }));
  });
});
