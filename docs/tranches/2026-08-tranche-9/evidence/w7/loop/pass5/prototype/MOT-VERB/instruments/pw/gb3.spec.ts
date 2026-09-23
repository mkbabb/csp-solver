/**
 * MOT-VERB pass 5 — GB3, THE GRID'S REST IDENTITY FROM PAINTED BYTES (INTAKE row 36): arm A's
 * coverage-mask grid against the control's theme-keyed <image> stack, both themes, both engines,
 * DPR 2, 1280×800 fine, the boil PARKED (reduce: the stack pins one pose) so a beat cannot
 * masquerade as a delta. The board's element screenshot, byte for byte; a CONTROL-vs-CONTROL
 * read in the same run is the instrument's own floor.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { PAYLOAD, ARMS, OUT } from "./board";

async function shot(page: Page, url: string) {
  await page.goto(`${url}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => ({
    ink: document.querySelectorAll(".grid-ink .boil-frame-bitmap").length,
    img: document.querySelectorAll("image.boil-frame-bitmap").length,
    active: [...document.querySelectorAll(".boil-frame-bitmap")].findIndex((e) => e.classList.contains("is-active")),
  }));
  const buf = await page.locator(".board-peek-host .hand-drawn-grid").first().screenshot();
  const { data, info: im } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: im.width, h: im.height, info };
}
function cmp(a: any, b: any, dark: boolean) {
  if (a.w !== b.w || a.h !== b.h) return { sizeMismatch: `${a.w}x${a.h} vs ${b.w}x${b.h}` };
  let max = 0, n1 = 0, n4 = 0, n16 = 0, inkA = 0, inkB = 0;
  for (let i = 0; i < a.data.length; i += 3) {
    let m = 0;
    for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(a.data[i + c] - b.data[i + c]));
    max = Math.max(max, m); if (m > 1) n1++; if (m > 4) n4++; if (m > 16) n16++;
    const la = (a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3, lb = (b.data[i] + b.data[i + 1] + b.data[i + 2]) / 3;
    inkA += dark ? la : 255 - la; inkB += dark ? lb : 255 - lb;
  }
  return { maxDelta: max, px1: n1, px4: n4, px16: n16, px: a.data.length / 3, inkMassDeltaPct: +((inkA - inkB) / inkB * 100).toFixed(3) };
}
for (const dark of [false, true]) {
  test(`GB3 grid rest identity · ${dark ? "dark" : "light"}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: dark ? "dark" : "light", reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const A = await shot(page, ARMS.after), C1 = await shot(page, ARMS.control), C2 = await shot(page, ARMS.control), M = await shot(page, ARMS.main);
    const r = { afterVsControl: cmp(A, C1, dark), controlVsControl: cmp(C1, C2, dark), afterVsMain: cmp(A, M, dark), layers: { after: A.info, control: C1.info, main: M.info } };
    console.log(`GB3[${info.project.name}·${dark ? "dark" : "light"}] ${JSON.stringify(r)}`);
    writeFileSync(`${OUT}/gb3-${info.project.name}-${dark ? "dark" : "light"}.json`, JSON.stringify(r, null, 1));
    await ctx.close();
  });
}
