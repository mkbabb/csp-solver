/**
 * PLR-COUNT pass 6 — the ballot crops, ONE payload and FIXED ids for every arm of a pair.
 * PAYLOAD (minted once from the control dist's deal, passed to every arm by env), the page's own
 * id pinned through its tab binding (`session-identity-v1`), the peers `b1-0…b1-15`. ARM names the
 * source state (the const flips are scripted, restored, sha1-checked). Reduced motion: every
 * stroke inked, the boil parked. The given-set is read back through the aria-label corpus.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.PROTO_DEV!;
const PAYLOAD = process.env.PAYLOAD!;
const ARM = process.env.ARM!;
const CROPS = process.env.CROPS!;
const ROOM = "b1-room";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol("unread");
  await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [200], timeout: 10000 }).toBe(true);
}
const givens = (page: Page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0").join(""));
const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();
const countOf = (l: string | null) => (l ?? "").match(/\d+/g)?.reduce((a, d) => a + Number(d), 0) ?? 0;
async function to(page: Page, N: number) {
  await page.evaluate(({ N }) => {
    const ch = new BroadcastChannel("board:b1-room");
    for (let i = 0; i < N - 1; i++) ch.postMessage({ kind: "hi", data: {}, from: `b1-${i}` });
    setTimeout(() => ch.close(), 0);
  }, { N });
  await expect.poll(async () => countOf(await mark(page).getAttribute("aria-label", { timeout: 5000 }))).toBe(N);
}
const box = (page: Page) => mark(page).evaluate((m) => { const b = m.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
const pin = (page: Page) => page.addInitScript(() => sessionStorage.setItem("session-identity-v1", JSON.stringify({ "b1-room": "b1-self" })));

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3, contextOptions: { reducedMotion: "reduce" }, colorScheme: "light" });
  test("strip", async ({ page, browserName }) => {
    await pin(page);
    await page.goto(`${BASE}/?size=3&board=${PAYLOAD}&wire=local&s=${ROOM}`);
    await settled(page);
    const dir = `${CROPS}/${ARM}/${browserName}`;
    mkdirSync(dir, { recursive: true });
    const meta: Record<string, unknown> = { payload: PAYLOAD.slice(0, 24) + "…", givens: await givens(page), regime: await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dpr: devicePixelRatio, dark: document.documentElement.classList.contains("dark") })) };
    const x0 = (await box(page)).x;
    for (const N of [5, 6]) {
      await to(page, N);
      await stable(() => box(page));
      const b = await box(page);
      meta[`N${N}`] = { ...b, label: await mark(page).getAttribute("aria-label") };
      await page.screenshot({ path: `${dir}/N${N}.png`, clip: { x: x0 - 4, y: b.y - 4, width: 128, height: b.h + 8 }, animations: "disabled" });
    }
    writeFileSync(`${dir}/strip.json`, JSON.stringify(meta, null, 1));
  });
});

test.describe("desk", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, contextOptions: { reducedMotion: "reduce" }, colorScheme: "light" });
  test("solo desk", async ({ page, browserName }) => {
    await page.goto(`${BASE}/?size=3&board=${PAYLOAD}`);
    await settled(page);
    await page.mouse.move(640, 790);
    const corner = await page.locator(".corner-left").first().evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    const dir = `${CROPS}/${ARM}/${browserName}`;
    mkdirSync(dir, { recursive: true });
    const marks = await page.locator("[data-player-mark]:visible").count();
    await page.screenshot({ path: `${dir}/solo-desk.png`, clip: { x: 0, y: 0, width: 260, height: corner.y + corner.h + 12 }, animations: "disabled" });
    writeFileSync(`${dir}/solo-desk.json`, JSON.stringify({ payload: PAYLOAD.slice(0, 24) + "…", givens: await givens(page), corner, marks, label: marks ? await mark(page).getAttribute("aria-label", { timeout: 3000 }) : null }));
  });
});
