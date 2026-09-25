/** ACC-GRAPHITE pass-7 CRITIC: the unit wash read from PAINTED bytes (the gate reads arithmetic).
 *  Per engine × theme × rig × arm: click an empty cell, read the mean sRGB of the inner 40% of an
 *  EMPTY peer cell and an EMPTY non-peer cell, WCAG contrast between them. PLANTS (tree only, injected
 *  CSS): P-opacity `.cell-peer{opacity:.2}`, P-prop `@property --ground-wash-unit{inherits:false…}`,
 *  P-last `.cell-peer{background:transparent}` — each must move the painted step (the probe can fail). */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./band-lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS: [string, string, string][] = [["tree", process.env.TREE_URL!, ""], ["control", process.env.CONTROL_URL!, ""],
  ["tree+P-opacity", process.env.TREE_URL!, ".cell-peer{opacity:.2 !important}"],
  ["tree+P-prop", process.env.TREE_URL!, "@property --ground-wash-unit{syntax:'<color>';inherits:false;initial-value:transparent}"],
  ["tree+P-last", process.env.TREE_URL!, ".cell-peer{background:transparent}"]];
const RIGS = [{ n: "desk", vp: { width: 1280, height: 800 }, touch: false }, { n: "phone", vp: { width: 393, height: 699 }, touch: true }];
const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
for (const scheme of ["light", "dark"] as const) for (const R of RIGS)
  test(`wash-${scheme}-${R.n}`, async ({ browser }, info) => {
    const rows: any[] = [];
    for (const [arm, base, css] of ARMS) {
      const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: 1, hasTouch: R.touch, reducedMotion: "reduce", colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
      await page.waitForTimeout(2500);
      const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      if (css) await page.addStyleTag({ content: css });
      const index = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
      const empt = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i: any) => !/given/i.test(i.getAttribute("aria-label") ?? "") && !(i.value ?? "")));
      const pick = [40, 30, 50, 20].find((i) => empt[i])!;
      if (R.touch) await page.locator(".game-cell").nth(pick).tap(); else await page.locator(".game-cell").nth(pick).click();
      await page.waitForTimeout(600);
      const cls = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell")).map((c) => c.classList.contains("cell-peer") || !!c.querySelector(".cell-peer")));
      const r0 = Math.floor(pick / 9), c0 = pick % 9;
      const peer = [...Array(81).keys()].find((i) => i !== pick && cls[i] && empt[i] && Math.floor(i / 9) === r0);
      const non = [...Array(81).keys()].find((i) => !cls[i] && empt[i] && Math.floor(i / 9) !== r0 && i % 9 !== c0 && Math.floor(Math.floor(i / 9) / 3) !== Math.floor(r0 / 3));
      const peerCount = cls.filter(Boolean).length;
      const mean = async (i: number) => { const b = (await page.locator(".game-cell").nth(i).boundingBox())!; const clip = { x: Math.round(b.x + b.width * 0.3), y: Math.round(b.y + b.height * 0.3), width: Math.max(2, Math.round(b.width * 0.4)), height: Math.max(2, Math.round(b.height * 0.4)) };
        const { data, info: m } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); const s = [0, 0, 0]; const n = m.width * m.height; for (let k = 0; k < n; k++) for (let j = 0; j < 3; j++) s[j] += data[k * m.channels + j]; return s.map((v) => v / n); };
      const bg = await page.evaluate((i) => { const c = document.querySelectorAll(".game-cell")[i]; const e = c.classList.contains("cell-peer") ? c : c.querySelector(".cell-peer"); return e ? getComputedStyle(e).backgroundColor + " op " + getComputedStyle(e).opacity : "none"; }, peer ?? -1);
      const a = peer != null ? await mean(peer) : null, b = non != null ? await mean(non) : null;
      await ctx.close();
      const la = a ? L(a[0], a[1], a[2]) : NaN, lb = b ? L(b[0], b[1], b[2]) : NaN;
      const step = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      const row = { engine: info.project.name, scheme, dark, rig: R.n, arm, index, pick, peer, non, peerCount, peerRGB: a?.map((v) => +v.toFixed(1)), paperRGB: b?.map((v) => +v.toFixed(1)), computed: bg, step: +step.toFixed(3) };
      rows.push(row);
      console.log(`WASH ${info.project.name} ${scheme} ${R.n} ${arm} ${index} dark=${dark} peers=${peerCount} cell ${pick} peer ${peer} non ${non}: peer ${row.peerRGB} paper ${row.paperRGB} step ${row.step} · computed ${bg}`);
    }
    writeFileSync(`${S}/wash-${info.project.name}-${scheme}-${R.n}.json`, JSON.stringify(rows, null, 1));
    expect(rows[0].peer, "a peer cell exists").not.toBeUndefined();
  });
