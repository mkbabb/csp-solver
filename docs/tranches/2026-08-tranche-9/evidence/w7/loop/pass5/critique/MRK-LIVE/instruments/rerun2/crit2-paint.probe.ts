/** Critic pass 5 · MRK-LIVE · is the indicator PAINTED? ring-ON vs ring-hidden, focus vs blur, plus a no-change noise arm. */
import { test, type Page } from "@playwright/test";
async function diff(page: Page, a: Buffer, b: Buffer) {
  return page.evaluate(async ([a, b]) => {
    const load = (s: string) => new Promise<HTMLImageElement>((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const px = (i: HTMLImageElement) => { const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const x = c.getContext("2d")!; x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data; };
    const da = px(ia), db = px(ib); let n = 0;
    for (let k = 0; k < da.length; k += 4) if (Math.max(Math.abs(da[k] - db[k]), Math.abs(da[k + 1] - db[k + 1]), Math.abs(da[k + 2] - db[k + 2])) > 8) n++;
    return n;
  }, [a.toString("base64"), b.toString("base64")] as const);
}
const raf2 = (p: Page) => p.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
test("CRIT-PAINT", async ({ page }, info) => {
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1500);
  // RING: the logo trigger
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }));
  await page.waitForTimeout(700); await raf2(page);
  const bb = (await page.locator("button.logo-trigger").boundingBox())!;
  const clip = { x: Math.max(0, bb.x - 16), y: Math.max(0, bb.y - 16), width: bb.width + 32, height: bb.height + 32 };
  const ringInfo = await page.evaluate(() => { const r = document.querySelector(".focus-ring path, .focus-ring"); return r ? getComputedStyle(r as Element).stroke : "no-ring"; });
  const a1 = await page.screenshot({ clip }); await raf2(page);
  const a2 = await page.screenshot({ clip });
  const h = await page.addStyleTag({ content: ".focus-ring{visibility:hidden !important}" }); await raf2(page);
  const b1 = await page.screenshot({ clip });
  await h.evaluate((n) => n.remove()); await raf2(page);
  const ringNoise = await diff(page, a1, a2), ringOn = await diff(page, a1, b1);
  // CELL: an empty cell
  const idx = await page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".game-cell input")].findIndex((i) => !i.value));
  const cell = page.locator(".game-cell").nth(idx);
  await page.evaluate((i) => document.querySelectorAll<HTMLInputElement>(".game-cell input")[i].focus({ preventScroll: true }), idx);
  await page.waitForTimeout(500); await raf2(page);
  const cb = (await cell.boundingBox())!;
  const cclip = { x: cb.x - 6, y: cb.y - 6, width: cb.width + 12, height: cb.height + 12 };
  const cellInfo = await page.evaluate((i) => { const c = document.querySelectorAll(".game-cell")[i]; const g = c.querySelector(".cell-ghost")!; const p = c.querySelector(".cell-ghost-path")!; const gs = getComputedStyle(p); return { wrapOpacity: getComputedStyle(g).opacity, stroke: gs.stroke, so: gs.strokeOpacity }; }, idx);
  const c1 = await page.screenshot({ clip: cclip }); await raf2(page);
  const c2 = await page.screenshot({ clip: cclip });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur()); await page.waitForTimeout(300); await raf2(page);
  const c3 = await page.screenshot({ clip: cclip });
  const cellNoise = await diff(page, c1, c2), cellOn = await diff(page, c1, c3);
  console.log(`CRIT-PAINT ${process.env.TAG ?? "as-is"} ${info.project.name} ${JSON.stringify({ ringStroke: ringInfo, ringNoise, ringOn, cellIdx: idx, cellInfo, cellNoise, cellOn })}`);
});
