/**
 * PLR-COUNT pass-4 — the two owner forks, driven. ARM names the source state this run was
 * taken on (the lane flips one const between runs and says so in its README):
 *   SOLO_ARM  keep | gate-on-a-room   (PlayerMark.vue)
 *   F1        true | false            (useSession.ts SELF_TAKES_ROOM_INK)
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const PROTO = "http://127.0.0.1:4242";
const BOARD =
  "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const OUT = process.env.PLRC_OUT!;
const CROPS = process.env.PLRC_CROPS!;
const ARM = process.env.PLRC_ARM!;
mkdirSync(OUT, { recursive: true });

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}
let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `arm-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(1600);
}
const head = (page: Page) =>
  page.evaluate(() => {
    const marks = [...document.querySelectorAll("[data-player-mark]")].filter(
      (e) => e.getBoundingClientRect().width > 0,
    );
    const cl = document.querySelector(".corner-left")!.getBoundingClientRect();
    return {
      marks: marks.length,
      label: marks[0]?.getAttribute("aria-label") ?? null,
      corner: [cl.width, cl.height].map((v) => +v.toFixed(2)),
    };
  });

test.describe("solo arm, desk", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  test("solo then two", async ({ page, browserName }) => {
    const room = `arm-solo-${Date.now()}`;
    // SOLO = a board with NO room (no `?s=`): the most-seen board, the one the fork is about.
    await page.goto(`${PROTO}/?size=3&board=${BOARD}`);
    await settled(page);
    const dir = `${CROPS}/${browserName}-arms`;
    mkdirSync(dir, { recursive: true });
    const solo = await head(page);
    await page.screenshot({ path: `${dir}/${ARM}-solo.png`, clip: { x: 0, y: 4, width: 200, height: 56 } });
    await page.goto(`${PROTO}/?size=3&board=${BOARD}&wire=local&s=${room}`);
    await settled(page);
    const alone = await head(page);
    await peers(page, room, 1);
    const two = await head(page);
    await page.screenshot({ path: `${dir}/${ARM}-two.png`, clip: { x: 0, y: 4, width: 200, height: 56 } });
    writeFileSync(`${OUT}/arm-${ARM}-${browserName}.json`, JSON.stringify({ solo, alone, two }));
  });
});

test.describe("hue, 390 coarse", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 });
  test("N = 3 and 5", async ({ page, browserName }) => {
    const room = `arm-hue-${Date.now()}`;
    await page.goto(`${PROTO}/?size=3&board=${BOARD}&wire=local&s=${room}`);
    await settled(page);
    const dir = `${CROPS}/${browserName}-arms`;
    mkdirSync(dir, { recursive: true });
    const m = () =>
      page.evaluate(() => {
        const e = [...document.querySelectorAll("[data-player-mark]")].find(
          (x) => x.getBoundingClientRect().width > 0,
        )!;
        const b = e.getBoundingClientRect();
        return { x: b.x, y: b.y, h: b.height, self: getComputedStyle(e).color };
      });
    await peers(page, room, 2);
    const b3 = await m();
    await page.screenshot({ path: `${dir}/${ARM}-N3.png`, clip: { x: b3.x - 4, y: b3.y - 4, width: 82, height: b3.h + 8 } });
    await peers(page, room, 2);
    const b5 = await m();
    await page.screenshot({ path: `${dir}/${ARM}-N5.png`, clip: { x: b5.x - 4, y: b5.y - 4, width: 82, height: b5.h + 8 } });
    writeFileSync(`${OUT}/hue-${ARM}-${browserName}.json`, JSON.stringify({ b3, b5 }));
  });
});
