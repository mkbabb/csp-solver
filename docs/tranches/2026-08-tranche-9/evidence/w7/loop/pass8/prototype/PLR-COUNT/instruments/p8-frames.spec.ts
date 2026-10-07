// SCRATCH (PLR-COUNT pass 8): B-FORK's arms at N = 6 and N = 16, ONE payload, every id pinned.
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const PAYLOAD = process.env.PAYLOAD!;
const ARM = process.env.ARM!;
const OUT = process.env.CROPS!;
const ROOM = "p8-fork";
const ID = "p-0000000b0b0b";
const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();
const countOf = (l: string | null) => Number((l ?? "").match(/\d+/)?.[0] ?? 0);
async function to(page: Page, N: number) {
  const was = countOf(await mark(page).getAttribute("aria-label"));
  await page.evaluate(({ from, k }) => {
    const ch = new BroadcastChannel("board:p8-fork");
    for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `tally-${from + i}` });
  }, { from: was - 1, k: N - was });
  await expect.poll(async () => countOf(await mark(page).getAttribute("aria-label"))).toBe(N);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol();
  await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [200], timeout: 10000 }).toBe(true);
}
const box = (page: Page) => mark(page).evaluate((m) => { const b = m.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, contextOptions: { reducedMotion: "reduce" }, colorScheme: "light" });
test("fork", async ({ page, browserName }) => {
  await page.addInitScript(([r, i]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: i })), [ROOM, ID]);
  await page.goto(`/?size=3&board=${PAYLOAD}&wire=local&s=${ROOM}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  const bound = await page.evaluate((r) => JSON.parse(sessionStorage.getItem("session-identity-v1") ?? "{}")[r], ROOM);
  const givens = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].filter((i) => /given clue/.test(i.getAttribute("aria-label") ?? "")).length);
  await page.addStyleTag({ content: ".pt-marks > g.pt-pose { opacity: 0 !important; } .pt-marks > g.pt-pose:nth-of-type(1) { opacity: 1 !important; }" });
  const dir = `${OUT}/${ARM}/${browserName}`;
  mkdirSync(dir, { recursive: true });
  const meta: Record<string, unknown> = { arm: ARM, bound, givens };
  const x0 = (await box(page)).x;
  for (const N of [5, 6, 16]) {
    console.log("TO", N, await mark(page).getAttribute("aria-label"));
    await to(page, N);
    console.log("AT", N);
    await stable(() => box(page));
    const b = await box(page);
    meta[`N${N}`] = { ...b, label: await mark(page).getAttribute("aria-label"), written: await mark(page).evaluate((m) => m.querySelector(".pt-count")?.textContent ?? null) };
    await page.screenshot({ path: `${dir}/N${N}.png`, clip: { x: x0 - 4, y: b.y, width: 118, height: b.h }, animations: "disabled" });
  }
  writeFileSync(`${dir}/meta.json`, JSON.stringify(meta));
});
