/**
 * MOT-VERB pass 5 — T9-M15/T9-B22/T9-B23 frame: the COLD light→dark flip, painted frames from
 * the CDP screencast (the compositor's own output, not a rAF read), chromium · light→dark ·
 * 1280×800 · fine · DPR 1 · one payload. Row 1: main-HEAD 1e6cfbbf (the product the owner
 * audited; the census's c1 arm). Row 2: this tree (arm A, grid half). Columns: the painted frame
 * nearest +90 / +180 / +300 / +500 ms after the click. Each tile = the toggle and the board's
 * top-right quarter (the grid's ink turning). One variable: the arm.
 */
import { test, type Page } from "@playwright/test";
import sharp from "sharp";
import { PAYLOAD, ARMS } from "./board";
const CROPS = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB";
const AT = [90, 180, 300, 500];

async function cold(page: Page, url: string) {
  await page.goto(`${url}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "load" });
  await page.waitForSelector(".sun-moon-toggle");
  await page.waitForTimeout(4000);
  const t = await page.locator(".sun-moon-toggle").boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const shots: { ts: number; data: string }[] = [];
  cdp.on("Page.screencastFrame", async (f: any) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
  await page.waitForTimeout(300);
  const t0 = Date.now();
  await page.click(".sun-moon-toggle", { force: true });
  await page.waitForTimeout(1200);
  await cdp.send("Page.stopScreencast");
  const pick = AT.map((ms) => { const want = t0 + ms; let best = shots[0]; for (const s of shots) if (s.ts <= want + 8) best = s; return best; });
  return { t, pick: pick.map((s) => ({ dt: Math.round(s.ts - t0), buf: Buffer.from(s.data, "base64") })), n: shots.length };
}
test("M15 cold flip, painted frames, HEAD vs arm A", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium", "screencast is chromium's; the webkit read is the rAF table");
  const rows = [];
  for (const arm of ["main", "after"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light" });
    const page = await ctx.newPage();
    const r = await cold(page, ARMS[arm]);
    console.log(`M15CROP ${arm} frames=${r.n} picked dt=${r.pick.map((p) => p.dt).join(",")} toggle=${JSON.stringify(r.t)}`);
    rows.push(r);
    await ctx.close();
  }
  const W = 300, H = 170;
  const tiles: any[] = [];
  for (const [ri, r] of rows.entries()) for (const [ci, p] of r.pick.entries()) {
    const meta = await sharp(p.buf).metadata();
    const x = Math.max(0, Math.min((meta.width ?? 1280) - W, Math.round(r.t!.x + r.t!.width - W + 20)));
    const tile = await sharp(p.buf).extract({ left: x, top: 0, width: W, height: H }).toBuffer();
    tiles.push({ input: tile, left: ci * (W + 4), top: ri * (H + 4) });
  }
  await sharp({ create: { width: 4 * W + 12, height: 2 * H + 4, channels: 3, background: "#888" } })
    .composite(tiles).png({ palette: true, quality: 70, compressionLevel: 9 })
    .toFile(`${CROPS}/t9-m15-coldflip-head-top-armA-bottom-chromium-light2dark-1280x800-fine.png`);
});
