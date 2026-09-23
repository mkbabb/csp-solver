/**
 * NOTE-ERASE pass 6 · the GLYPH-TEXT statistic (registry-v5 §2.11, LAWS P5) on the note's line:
 * photograph the ink twice, then the SAME box with the ink transparent twice (PAL-WALK's
 * painted-text instrument, both photographs doubled so a transient ground pixel is dropped, not
 * read). A pixel's glyph COVERAGE is its change over the change a fully-inked pixel would make on
 * that same ground (the computed colour composited over it) — keyed on coverage, never on the
 * crop's own maximum. Reported: core median over pixels at coverage ≥ 0.5 (the gate, ≥ 4.5), the
 * fraction of those under 4.5, and the sensitivity row at coverage ≥ 0.5/0.7/0.9. Arms: the tree's
 * fresh line, the tree's SETTLED line, the control's (HEAD) line — one payload, one cell (1280x800
 * fine), DPR 1/2/3, light and dark.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { bank, say, boardReady, PROTO, CONTROL, PAYLOAD } from "./lib";

type Raw = { data: Buffer; w: number; h: number; ch: number };
const raw = async (b: Buffer): Promise<Raw> => {
  const { data, info } = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
};
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (r: number, g: number, b: number) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function glyphText(page: Page) {
  const ink = page.locator(".margin-note-ink").first();
  const box = await ink.evaluate((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const b = r.getBoundingClientRect();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
  const clip = { x: Math.floor(box.x) - 1, y: Math.floor(box.y) - 1, width: Math.ceil(box.width) + 3, height: Math.ceil(box.height) + 3 };
  const spec = await ink.evaluate((el) => getComputedStyle(el).color);
  const age = await ink.evaluate((el) => el.getAttribute("data-note-age"));
  const A = await raw(await page.screenshot({ clip }));
  const A2 = await raw(await page.screenshot({ clip }));
  await ink.evaluate((el) => {
    (el as HTMLElement).style.setProperty("transition", "none", "important");
    (el as HTMLElement).style.setProperty("color", "transparent", "important");
  });
  await expect.poll(() => ink.evaluate((el) => getComputedStyle(el).color)).toBe("rgba(0, 0, 0, 0)");
  const B = await raw(await page.screenshot({ clip }));
  const B2 = await raw(await page.screenshot({ clip }));
  await ink.evaluate((el) => (el as HTMLElement).style.removeProperty("color"));
  await expect.poll(() => ink.evaluate((el) => getComputedStyle(el).color)).toBe(spec);
  await ink.evaluate((el) => (el as HTMLElement).style.removeProperty("transition"));
  const rgba = await page.evaluate((css) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.fillStyle = css;
    g.fillRect(0, 0, 1, 1);
    return Array.from(g.getImageData(0, 0, 1, 1).data);
  }, spec);
  const a = rgba[3] / 255;
  let noise = 0;
  const pop: { cov: number; r: number }[] = [];
  for (let k = 0; k < A.data.length; k += A.ch) {
    const n1 = Math.abs(A.data[k] - A2.data[k]) + Math.abs(A.data[k + 1] - A2.data[k + 1]) + Math.abs(A.data[k + 2] - A2.data[k + 2]);
    const n2 = Math.abs(B.data[k] - B2.data[k]) + Math.abs(B.data[k + 1] - B2.data[k + 1]) + Math.abs(B.data[k + 2] - B2.data[k + 2]);
    if (n1 > 8 || n2 > 8) { noise++; continue; }
    const g = [B.data[k], B.data[k + 1], B.data[k + 2]];
    const full = [0, 1, 2].map((i) => a * rgba[i] + (1 - a) * g[i]);
    const dFull = Math.abs(full[0] - g[0]) + Math.abs(full[1] - g[1]) + Math.abs(full[2] - g[2]);
    const d = Math.abs(A.data[k] - g[0]) + Math.abs(A.data[k + 1] - g[1]) + Math.abs(A.data[k + 2] - g[2]);
    if (dFull < 12 || d < 6) continue;
    pop.push({ cov: Math.min(1, d / dFull), r: ratio(lum(A.data[k], A.data[k + 1], A.data[k + 2]), lum(g[0], g[1], g[2])) });
  }
  const at = (f: number) => {
    const r = pop.filter((p) => p.cov >= f).map((p) => p.r).sort((u, v) => u - v);
    return { n: r.length, median: r.length ? +r[r.length >> 1].toFixed(3) : null, under45: r.filter((v) => v < 4.5).length, fraction: r.length ? +(r.filter((v) => v < 4.5).length / r.length).toFixed(3) : null, min: r.length ? +r[0].toFixed(3) : null };
  };
  return { age, spec, devicePx: [A.w, A.h], glyphPx: pop.length, noise, gate: at(0.5), sens: { "0.5": at(0.5), "0.7": at(0.7), "0.9": at(0.9) } };
}

async function settle(page: Page) {
  await expect.poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 }).toBe("settled");
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const c = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
    if (c === prev) break;
    prev = c;
    await page.waitForTimeout(100);
  }
}

for (const dpr of [1, 2, 3])
  test(`glyph-text AA dpr ${dpr}`, async ({ browser }, info) => {
    test.setTimeout(300000);
    const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, cell: "1280x800 fine", dpr, tree: "index-B5bclKNTuHnj.js", control: "74a2b5d9 index-CubiZsMVSwTc.js" };
    for (const scheme of ["light", "dark"] as const) {
      for (const [arm, base] of [["tree", PROTO], ["control", CONTROL]] as const) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, deviceScaleFactor: dpr });
        const page = await ctx.newPage();
        await boardReady(page, base);
        // A short arm: the write-in is the note rung (250 ms); the settle timer fires at 1000 ms.
        await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
        await page.keyboard.press("h");
        await page.waitForTimeout(320);
        rows[`${scheme}.${arm}.text`] = await page.evaluate(() => (document.querySelector(".margin-note")?.textContent || "").trim());
        // The fresh line is read BEFORE the settle timer (1000 ms from arrival) can fire; the age
        // is read again after the read, and a read the settle overtook is marked, not used.
        const fresh = await glyphText(page);
        const after = await page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age"));
        rows[`${scheme}.${arm}.fresh`] = { ...fresh, ageAfterRead: after ?? null };
        if (arm === "tree") {
          await settle(page);
          rows[`${scheme}.${arm}.settled`] = await glyphText(page);
        }
        await ctx.close();
      }
    }
    bank(`aa-glyph-dpr${dpr}-${info.project.name}.json`, rows);
    const brief = Object.fromEntries(Object.entries(rows).filter(([, v]) => v && typeof v === "object").map(([k, v]) => {
      const r = v as { age: string; gate: { median: number; fraction: number; n: number } };
      return [k, `${r.age} med ${r.gate.median} frac<4.5 ${r.gate.fraction} n ${r.gate.n}`];
    }));
    say(`aa.dpr${dpr}`, brief);
  });
