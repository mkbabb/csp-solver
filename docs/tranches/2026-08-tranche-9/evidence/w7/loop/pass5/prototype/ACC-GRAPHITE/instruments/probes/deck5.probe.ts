/** ACC-GRAPHITE pass 5 — G4 RE-DERIVED (charter row 11): ink px (Y < 0.2) of every poster face in
 *  the gallery deck, the pass-4 family.probe.ts `deck` row COPIED, plus the arms that decompose
 *  the delta ONE variable at a time on the tree dist: `given5` (the printed weight back to 5),
 *  `blueink` (your ink back to HEAD's #2563eb / #60a5fa), and control2 (control-vs-control). */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const T = process.env.TREE_URL ?? "http://127.0.0.1:4237", C = process.env.CTRL_URL ?? "http://127.0.0.1:4236";
const ARMS: [string, string, string][] = [
  ["tree", T, ""], ["control", C, ""], ["control2", C, ""],
  ["given5", T, '.poster-board path[stroke-width="6"]{stroke-width:5 !important}'],
  ["blueink", T, ":root{--color-user-ink:#2563eb !important}"],
  ["given5+blueink", T, '.poster-board path[stroke-width="6"]{stroke-width:5 !important}:root{--color-user-ink:#2563eb !important}'],
];
const lin = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Yl = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
test("deck", async ({ browser }, info) => {
  test.setTimeout(170_000);
  const out: any = { engine: info.project.name, payload: mintBoard(3, 30).slice(0, 18) + "…" };
  for (const [arm, base, css] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
    await page.locator("button.logo-trigger").click({ timeout: 8000 });
    await page.waitForSelector(".gallery-viewport", { timeout: 8000 }); await page.waitForTimeout(2500);
    if (css) { await page.addStyleTag({ content: css }); await page.waitForTimeout(400); }
    const boxes = await page.evaluate(() => Array.from(document.querySelectorAll(".poster-board")).map((p) => { const r = p.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }).filter((r) => r.width > 20 && r.x > -r.width && r.x < innerWidth));
    const sw = await page.evaluate(() => { const m: Record<string, number> = {}; for (const p of Array.from(document.querySelectorAll(".poster-board path"))) { const k = getComputedStyle(p).strokeWidth; m[k] = (m[k] ?? 0) + 1; } return m; });
    let total = 0; const faces: number[] = [];
    for (const b of boxes) { const { data, info: im } = await sharp(await page.screenshot({ clip: b })).raw().toBuffer({ resolveWithObject: true }); let n = 0; for (let k = 0; k < im.width * im.height; k++) if (Yl(data[k * im.channels], data[k * im.channels + 1], data[k * im.channels + 2]) < 0.2) n++; faces.push(n); total += n; }
    out[arm] = { faces, total, posterStrokeWidths: sw };
    await ctx.close();
  }
  const d = (a: string) => +(100 * (out[a].total / out.control.total - 1)).toFixed(2);
  out.delta = { tree: d("tree"), noise: d("control2"), given5: d("given5"), blueink: d("blueink"), both: d("given5+blueink") };
  writeFileSync(`${S}/deck-${info.project.name}.json`, JSON.stringify(out, null, 1));
});
