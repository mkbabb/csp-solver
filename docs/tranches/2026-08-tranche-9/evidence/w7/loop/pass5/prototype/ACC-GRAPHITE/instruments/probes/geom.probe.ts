import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const BASE = process.env.BASE ?? "http://127.0.0.1:4235";
for (const B of [{ s: 3, g: 30, w: 20 }, { s: 4, g: 76, w: 77 }]) test(`geom-${B.s}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${mintBoard(B.s, B.g)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let written = 0;
  for (let i = 0; i < cells.length && written < B.w; i++) { if (cells[i]) continue; const v = solution(B.s, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.waitForTimeout(1200);
  const g = await page.evaluate((n) => {
    const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement; const r = svg.getBoundingClientRect();
    const p = document.querySelector(".progress-pose.is-active path") as SVGPathElement | null;
    const pr = p?.getBoundingClientRect();
    const cells = Array.from(document.querySelectorAll(".game-cell")).slice(0, n);
    const glyphTops = cells.map((c) => { const gp = c.querySelector(".glyph-svg path, svg path"); const gr = c.querySelector(".glyph-svg")?.getBoundingClientRect(); const pb = (c.querySelector(".glyph-svg path") as SVGPathElement | null)?.getBoundingClientRect(); const cr = c.getBoundingClientRect(); return { cellTop: cr.y - r.y, cellH: cr.height, glyphBoxTop: gr ? gr.y - r.y : null, glyphInkTop: pb ? pb.y - r.y : null, glyphInkH: pb?.height ?? null }; });
    return { board: { w: r.width, h: r.height }, unit: r.width / 1000, tickActiveTop: pr ? pr.y - r.y : null, sw: p ? getComputedStyle(p).strokeWidth : null, tf: p ? getComputedStyle(p.parentElement!).transform : null, glyphTops };
  }, B.s * B.s);
  writeFileSync(`${S}/geom-${info.project.name}-${B.s}.json`, JSON.stringify({ written, ...g }));
  await ctx.close();
});
