/**
 * ACC-GRAPHITE pass 4 — the family rows off PAINTED bytes (charter rows 9, 10, 12).
 *
 *   wash      G-WASH re-cut: the unit wash's painted step against the unwashed paper beside it
 *             (contrast ratio from painted RGB, OKLab ΔE×100, the wash's own OKLCH hue), both
 *             themes × contrast no-preference/more. Run on the prototype AND the HEAD control:
 *             the byte-identity clause is struck (it compared the token with itself).
 *   author    §5: a given's and your digit's painted ink — the value seam from painted pixels.
 *   print     G9: glyph / ring / tally strokes under `media: print`.
 *   forced    G9: forced-colors, keyboard focus (a REAL key press, so :focus-visible rises).
 *   guard     G10: the gallery's armed deal ribbon, chromatic px (OKLCH C ≥ 0.012) in its box,
 *             at 393×699 dpr3 hasTouch and at 1280 fine; plus the Clear arm's sublabel ink.
 *   deck      G4: ink px of every poster face in the gallery deck (proto ÷ control − 1).
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { BOARD9, SCRATCH, median, r3 } from "./lib";
import { rgbToOklch } from "./oklch";

const ARM = process.env.ARM ?? "proto";
const OUT = `${SCRATCH}/family`;
mkdirSync(OUT, { recursive: true });

const lin = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (p: number[]) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
const CR = (a: number[], b: number[]) => { const x = Y(a), y = Y(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const oklab = (p: number[]) => { const o = rgbToOklch(p[0], p[1], p[2]); const h = (o.h * Math.PI) / 180; return [o.L, o.C * Math.cos(h), o.C * Math.sin(h)]; };
const dE = (a: number[], b: number[]) => { const A = oklab(a), B = oklab(b); return 100 * Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };

async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
/** median RGB over the central `f` of a box (device px) */
async function patch(page: Page, box: { x: number; y: number; width: number; height: number }, f = 0.3) {
  const c = { x: box.x + box.width * (0.5 - f / 2), y: box.y + box.height * (0.5 - f / 2), width: box.width * f, height: box.height * f };
  const im = await raw(await page.screenshot({ clip: c }));
  const R: number[] = [], G: number[] = [], B: number[] = [];
  for (let i = 0; i < im.w * im.h; i++) { R.push(im.data[i * im.ch]); G.push(im.data[i * im.ch + 1]); B.push(im.data[i * im.ch + 2]); }
  return [median(R), median(G), median(B)];
}

async function boot(browser: Browser, baseURL: string, o: { theme: "light" | "dark"; contrast?: "more" | "no-preference"; w?: number; h?: number; dpr?: number; touch?: boolean; url?: string }) {
  const ctx = await browser.newContext({
    viewport: { width: o.w ?? 1280, height: o.h ?? 800 }, deviceScaleFactor: o.dpr ?? 1, hasTouch: o.touch ?? false,
    colorScheme: o.theme, reducedMotion: "reduce", contrast: o.contrast ?? "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/${o.url ?? `?board=${BOARD9.enc}`}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
  await page.waitForTimeout(2500);
  const regime = await page.evaluate(() => ({
    dark: matchMedia("(prefers-color-scheme: dark)").matches, more: matchMedia("(prefers-contrast: more)").matches,
    coarse: matchMedia("(pointer: coarse)").matches, prm: matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));
  return { ctx, page, regime };
}

const cellBox = (page: Page, i: number) => page.locator(".game-cell").nth(i).boundingBox();
const isGiven = (page: Page) => page.evaluate(() => Array.from(document.querySelectorAll(".game-cell")).map((c) => /given/i.test(c.querySelector("input")?.getAttribute("aria-label") ?? "")));

async function keyFocus(page: Page, idx: number) {
  await page.locator(".game-cell input").nth(idx - 1).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
}

test("wash", async ({ browser, baseURL }, info) => {
  test.setTimeout(170_000);
  const rows: unknown[] = [];
  for (const theme of ["light", "dark"] as const)
    for (const contrast of ["no-preference", "more"] as const) {
      const { ctx, page, regime } = await boot(browser, baseURL!, { theme, contrast });
      const given = await isGiven(page);
      // focus cell 40 (r4 c4); a peer = same row, empty; a non-peer = outside row/col/box, empty
      const f = 40;
      await keyFocus(page, f);
      const peer = [36, 37, 38, 42, 43, 44].find((i) => !given[i])!;
      const non = [0, 1, 2, 9, 10, 11, 18, 19, 20, 60, 61, 62, 69, 70, 71, 78, 79, 80].find((i) => !given[i])!;
      const cls = await page.evaluate(([p, n]) => [document.querySelectorAll(".game-cell")[p].className, document.querySelectorAll(".game-cell")[n].className], [peer, non]);
      const pp = await patch(page, (await cellBox(page, peer))!);
      const np = await patch(page, (await cellBox(page, non))!);
      const o = rgbToOklch(pp[0], pp[1], pp[2]);
      rows.push({ theme, contrast, regime, peer, non, peerHasCellPeer: /cell-peer/.test(cls[0]), nonHasCellPeer: /cell-peer/.test(cls[1]), peerRGB: pp, paperRGB: np, contrastRatio: r3(CR(pp, np)), dE100: r3(dE(pp, np)), washOklch: { L: r3(o.L), C: r3(o.C), h: r3(o.h) } });
      await ctx.close();
    }
  writeFileSync(`${OUT}/wash-${ARM}-${info.project.name}.json`, JSON.stringify(rows, null, 1));
});

test("author+print+forced", async ({ browser, baseURL }, info) => {
  test.setTimeout(170_000);
  const out: Record<string, unknown> = {};
  for (const theme of ["light", "dark"] as const) {
    const { ctx, page } = await boot(browser, baseURL!, { theme });
    const given = await isGiven(page);
    const gi = given.findIndex((g) => g);
    const wi = given.findIndex((g, i) => !g && i > 30);
    await page.locator(".game-cell input").nth(wi).focus();
    await page.keyboard.type("5");
    await page.waitForTimeout(600);
    const read = await page.evaluate(([gi, wi]) => {
      const gl = (i: number) => document.querySelectorAll(".game-cell")[i].querySelector(".glyph-svg path") as SVGGraphicsElement | null;
      const s = (el: Element | null) => (el ? { stroke: getComputedStyle(el).stroke, sw: getComputedStyle(el).strokeWidth, op: getComputedStyle(el).strokeOpacity } : null);
      return { given: s(gl(gi)), yours: s(gl(wi)), userInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(), graphite: getComputedStyle(document.documentElement).getPropertyValue("--color-pencil-graphite").trim(), fg: getComputedStyle(document.documentElement).getPropertyValue("--color-foreground").trim() };
    }, [gi, wi]);
    // painted: the darkest (light) / brightest (dark) 2 % of each glyph cell's pixels
    const ink = async (i: number) => {
      const b = (await cellBox(page, i))!;
      const im = await raw(await page.screenshot({ clip: { x: b.x + b.width * 0.2, y: b.y + b.height * 0.15, width: b.width * 0.6, height: b.height * 0.7 } }));
      const px: number[][] = [];
      for (let k = 0; k < im.w * im.h; k++) px.push([im.data[k * im.ch], im.data[k * im.ch + 1], im.data[k * im.ch + 2]]);
      px.sort((a, c) => (theme === "light" ? Y(a) - Y(c) : Y(c) - Y(a)));
      const top = px.slice(0, Math.max(3, Math.floor(px.length * 0.02)));
      return [0, 1, 2].map((j) => median(top.map((p) => p[j])));
    };
    const ig = await ink(gi), iy = await ink(wi);
    out[`author-${theme}`] = { ...read, paintedGiven: ig, paintedYours: iy, paintedValueRatio: r3(CR(ig, iy)), declaredWeightRatio: r3(parseFloat(read.given!.sw) / parseFloat(read.yours!.sw)) };
    if (theme === "light") {
      // print — a focused cell and a written tally, then the print media
      await keyFocus(page, 40);
      await page.emulateMedia({ media: "print" });
      await page.waitForTimeout(300);
      out.print = await page.evaluate(([gi, wi]) => {
        const q = (sel: string) => document.querySelector(sel);
        const s = (el: Element | null) => (el ? { stroke: getComputedStyle(el).stroke, display: getComputedStyle(el).display, vis: getComputedStyle(el).visibility } : null);
        const cells = document.querySelectorAll(".game-cell");
        return {
          givenGlyph: s(cells[gi].querySelector(".glyph-svg path")), yourGlyph: s(cells[wi].querySelector(".glyph-svg path")),
          ringOuter: s(q(".game-cell:has(input:focus-visible) .cell-ghost-path")), ringInner: s(q(".game-cell:has(input:focus-visible) .cell-ghost-retrace")),
          tally: s(q(".progress-pose.is-active .progress-trace") ?? q(".progress-trace")), gridLine: s(q(".grid-line")),
          tape: s(q(".attribution-tape")),
        };
      }, [gi, wi]);
      await page.emulateMedia({ media: "screen", forcedColors: "active" });
      await keyFocus(page, 41);
      out.forced = await page.evaluate(() => {
        const c = document.querySelector(".game-cell:has(input:focus-visible)");
        const cs = c ? getComputedStyle(c) : null;
        const r = c?.querySelector(".cell-ghost-retrace");
        return { focusVisible: !!c, outlineStyle: cs?.outlineStyle, outlineColor: cs?.outlineColor, outlineWidth: cs?.outlineWidth, forced: matchMedia("(forced-colors: active)").matches, retraceStroke: r ? getComputedStyle(r).stroke : null, retraceOutline: r ? getComputedStyle(r).outlineStyle : null };
      });
    }
    await ctx.close();
  }
  writeFileSync(`${OUT}/author-print-forced-${ARM}-${info.project.name}.json`, JSON.stringify(out, null, 1));
});

test("guard", async ({ browser, baseURL }, info) => {
  test.setTimeout(170_000);
  const rows: unknown[] = [];
  for (const rig of [{ n: "phone", w: 393, h: 699, dpr: 3, touch: true }, { n: "desk", w: 1280, h: 800, dpr: 1, touch: false }])
    for (const theme of ["light", "dark"] as const) {
      const { ctx, page, regime } = await boot(browser, baseURL!, { theme, w: rig.w, h: rig.h, dpr: rig.dpr, touch: rig.touch, url: "?size=3&difficulty=EASY" });
      const given = await isGiven(page);
      const wi = given.findIndex((g) => !g);
      await page.evaluate((idx) => {
        const input = document.querySelectorAll(".game-cell input")[idx] as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        setter.call(input, "1");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, wi);
      await page.waitForTimeout(400);
      // the Clear arm's sublabel (coarse + dirty arms; fine pointer clears at once — not pressed there)
      let clearArm: unknown = null;
      if (rig.touch) {
        const clr = page.locator('button[aria-label="Clear the board"]').first();
        if (await clr.count()) {
          await clr.evaluate((b: HTMLElement) => b.click());
          await page.waitForTimeout(250);
          clearArm = await page.evaluate(() => {
            const s = document.querySelector(".icon-sublabel.is-armed");
            return s ? { text: s.textContent, color: getComputedStyle(s).color } : null;
          });
          await page.waitForTimeout(2700); // lapse disarms
        }
      }
      await page.locator("button.logo-trigger").click({ timeout: 8000 }).catch(() => {});
      await page.waitForSelector(".gallery-viewport", { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(700);
      await page.locator(".gallery-viewport").press("ArrowRight").catch(() => {});
      await page.waitForTimeout(500);
      await page.locator(".gallery-viewport").press("d").catch(() => {});
      await page.waitForTimeout(1200);
      const box = await page.locator(".gallery-guard").boundingBox().catch(() => null);
      let chrom: unknown = null;
      if (box) {
        const im = await raw(await page.screenshot({ clip: box }));
        let n = 0, cmax = 0;
        const hues: Record<number, number> = {};
        for (let k = 0; k < im.w * im.h; k++) {
          const o = rgbToOklch(im.data[k * im.ch], im.data[k * im.ch + 1], im.data[k * im.ch + 2]);
          cmax = Math.max(cmax, o.C);
          if (o.C >= 0.012) { n++; const b = Math.floor(o.h / 10) * 10; hues[b] = (hues[b] ?? 0) + 1; }
        }
        chrom = { devicePx: im.w * im.h, chromaticPx: n, maxC: r3(cmax), hueBins: hues };
        if (rig.n === "phone" && theme === "light") await page.screenshot({ clip: box, path: `${SCRATCH}/frames/guard-${ARM}-${info.project.name}.png` });
      }
      rows.push({ rig: rig.n, theme, regime, clearArm, guardVisible: !!box, guardBox: box, chrom });
      await ctx.close();
    }
  writeFileSync(`${OUT}/guard-${ARM}-${info.project.name}.json`, JSON.stringify(rows, null, 1));
});

test("deck", async ({ browser, baseURL }, info) => {
  test.setTimeout(170_000);
  const { ctx, page } = await boot(browser, baseURL!, { theme: "light", url: "?size=3&difficulty=EASY" });
  await page.locator("button.logo-trigger").click({ timeout: 8000 });
  await page.waitForSelector(".gallery-viewport", { timeout: 8000 });
  await page.waitForTimeout(2500);
  const boxes = await page.evaluate(() => Array.from(document.querySelectorAll(".poster-board")).map((p) => { const r = p.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }).filter((r) => r.width > 20 && r.x > -r.width && r.x < innerWidth));
  const faces: unknown[] = [];
  let total = 0;
  for (const b of boxes) {
    const im = await raw(await page.screenshot({ clip: b }));
    let n = 0;
    for (let k = 0; k < im.w * im.h; k++) if (Y([im.data[k * im.ch], im.data[k * im.ch + 1], im.data[k * im.ch + 2]]) < 0.2) n++;
    faces.push({ box: b, inkPx: n });
    total += n;
  }
  writeFileSync(`${OUT}/deck-${ARM}-${info.project.name}.json`, JSON.stringify({ faces, total }, null, 1));
  await ctx.close();
});
