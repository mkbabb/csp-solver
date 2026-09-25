/** ACC-GRAPHITE pass 7 — B-TALLY-16, the lawful pair framed WHERE THE CHOICE LIVES (LAWS P6 §C): one
 *  encoded payload (mintBoard(4, 76), 77 written by real keys), ONE variable (`TALLY_OUTSIDE`, two built
 *  dists: INSIDE = the tree :4235, OUTSIDE = the one-line copy :4240), light, PRM, DPR 1. Per engine ONE
 *  composite: top row desk 1280x800 fine, bottom row phone 393x699 COARSE (hasTouch, pointer: coarse
 *  witnessed); left = INSIDE (shipped), right = OUTSIDE. Each cell is the board's top-right quarter with
 *  24 px of margin (the pass-6 crop), so the ticks over the card's edge are in frame. */
import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const RIGS = [{ n: "desk", vp: { width: 1280, height: 800 }, touch: false }, { n: "phone", vp: { width: 393, height: 699 }, touch: true }];
test("tally16-desk-phone", async ({ browser }, info) => {
  test.setTimeout(400_000);
  const rows: any[][] = [];
  for (const R of RIGS) {
    const row: any[] = [];
    for (const [arm, base] of [["inside", "http://127.0.0.1:4235"], ["outside", "http://127.0.0.1:4240"]]) {
      const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: 1, hasTouch: R.touch, reducedMotion: "reduce", colorScheme: "light" });
      const page = await ctx.newPage();
      await page.goto(`${base}/?board=${mintBoard(4, 76)}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
      expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(R.touch);
      const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
      let w = 0;
      for (let i = 0; i < given.length && w < 77; i++) { if (given[i]) continue; const v = solution(4, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); w++; }
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
      const givens = given.filter(Boolean).length;
      const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const cx = Math.round(b.x + b.w * 0.62);
      const clip = { x: cx, y: Math.max(0, Math.round(b.y - 24)), width: Math.min(Math.round(b.w * 0.38 + 24), R.vp.width - cx), height: Math.round(b.h * 0.34 + 24) };
      const { data, info: im } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
      console.log(`TALLY16 ${info.project.name} ${R.n} ${arm} givens ${givens} written ${w} index ${await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop())} cls ${await page.evaluate(() => document.querySelector(".progress-pose.is-active")?.getAttribute("class"))} clip ${JSON.stringify(clip)}`);
      row.push({ data, w: im.width, h: im.height, ch: im.channels }); await ctx.close();
    }
    rows.push(row);
  }
  const gap = 12, W = Math.max(...rows.map((r) => r.reduce((a, p) => a + p.w, 0) + gap)), H = rows.reduce((a, r) => a + Math.max(...r.map((p) => p.h)), 0) + gap;
  const comp: any[] = []; let top = 0;
  for (const r of rows) { let left = 0; for (const p of r) { comp.push({ input: p.data, raw: { width: p.w, height: p.h, channels: p.ch }, left, top }); left += p.w + gap; } top += Math.max(...r.map((p) => p.h)) + gap; }
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite(comp).png().toFile(`${S}/tally16-desk-phone-${info.project.name}.png`);
});
