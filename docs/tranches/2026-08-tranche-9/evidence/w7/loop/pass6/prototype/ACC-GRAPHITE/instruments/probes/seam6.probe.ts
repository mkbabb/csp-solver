/** ACC-GRAPHITE pass-6 COPY (arms re-pointed: at RETRACE_INSET 8 a second pass of 8 u overlaps, so the in-run seam control is a 2 u / 1 u second pass, a 1-1.5 u gap) — THE SEAM between the two passes (the 8.75 u arm's price): one payload
 *  mintBoard(3, 30), the mid interior cell focused by a real key, per column across the middle
 *  40 % of the cell, the coverage profile across each band side; seam dip = 1 - the lowest
 *  coverage strictly between the band's first and last >= 0.9 pixel (0 when the band is solid).
 *  NEGATIVE CONTROL in the same run: second-8 (pass 4's measured seam arm). */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const T = process.env.TREE_URL ?? "http://127.0.0.1:4237";
const FV = ".game-cell:has(input:focus-visible)";
const ARMS: [string, string][] = [["shipped", ""], ["second-2", `${FV} .cell-ghost-retrace{stroke-width:2 !important}`], ["second-1", `${FV} .cell-ghost-retrace{stroke-width:1 !important}`]];
for (const rig of ["desk", "phone"] as const) test(`seam-${rig}`, async ({ browser }, info) => {
  test.setTimeout(170_000);
  const phone = rig === "phone", k = phone ? 3 : 1;
  const ctx = await browser.newContext({ viewport: phone ? { width: 393, height: 699 } : { width: 1280, height: 800 }, deviceScaleFactor: k, hasTouch: phone, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${T}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  const interior = given.map((g, i) => (!g && Math.floor(i / 9) > 0 && Math.floor(i / 9) < 8 && i % 9 > 0 && i % 9 < 8 ? i : -1)).filter((i) => i >= 0);
  const mid = interior.reduce((b, i) => (Math.abs(i - 40) < Math.abs(b - 40) ? i : b), interior[0]);
  await page.locator(".game-cell input").nth(mid).focus(); await page.keyboard.press("Shift"); await page.waitForTimeout(600);
  const c = (await page.locator(".game-cell").nth(mid).boundingBox())!;
  const clip = { x: c.x - 6, y: c.y - 6, width: c.width + 12, height: c.height + 12 };
  const out: any = { engine: info.project.name, rig, payload: mintBoard(3, 30).slice(0, 18) + "…", mid, arms: {} };
  for (const [name, css] of ARMS) {
    await page.evaluate((s) => { document.getElementById("arm")?.remove(); const e = document.createElement("style"); e.id = "arm"; e.textContent = s; document.head.append(e); }, css);
    await page.waitForTimeout(300);
    const { data, info: im } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
    const L = (x: number, y: number) => { const i = (y * im.width + x) * im.channels; return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]; };
    const paper = 253, ink = 37, cov = (x: number, y: number) => Math.max(0, Math.min(1, (paper - L(x, y)) / (paper - ink)));
    const dips: number[] = [];
    const H = im.height, Wd = im.width, half = Math.round(H / 2);
    for (let x = Math.round(Wd * 0.3); x < Math.round(Wd * 0.7); x++) for (const [y0, dir] of [[0, 1], [H - 1, -1]] as const) {
      const prof: number[] = []; for (let t = 0; t < half; t++) prof.push(cov(x, y0 + dir * t));
      // the band = the LAST run reaching >= 0.9 before the clear window (skips the grid line)
      let b = -1; for (let t = half - 1; t >= 0; t--) if (prof[t] >= 0.9) { b = t; break; }
      if (b < 0) continue; let a = b; while (a > 0 && prof[a - 1] >= 0.2) a--;
      let first = -1; for (let t = a; t <= b; t++) if (prof[t] >= 0.9) { first = t; break; }
      let lo = 1; for (let t = first; t <= b; t++) lo = Math.min(lo, prof[t]);
      dips.push(1 - lo);
    }
    dips.sort((p, q) => p - q);
    const q = (p: number) => +dips[Math.min(dips.length - 1, Math.floor(p * dips.length))].toFixed(3);
    out.arms[name] = { n: dips.length, med: q(0.5), p95: q(0.95), max: q(1 - 1e-9), fracOver10: +(dips.filter((d) => d > 0.1).length / dips.length).toFixed(3) };
  }
  writeFileSync(`${S}/seam-${info.project.name}-${rig}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});
