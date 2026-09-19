// The PASS-3 CRITIC's own re-measurement of PAL-WALK. Read-only on product files: it reads the
// running product's own module and the live cascade, and every value it writes to the page it
// removes again.
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function theme(page: Page, t: "light" | "dark"): Promise<void> {
  await page.evaluate((x) => {
    document.documentElement.classList.toggle("dark", x === "dark");
  }, t);
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
}

/** Everything measured inside the page, so the bytes are the engine's. `override` is written to
 *  the root and removed before the call returns. */
async function read(page: Page, override: string | null) {
  return page.evaluate(async (ov) => {
    const served = "/src/games/shared/playerIdentity.ts";
    const m = (await import(/* @vite-ignore */ served)) as {
      inkFor: (i: number) => Record<string, string>;
    };
    const root = document.documentElement;
    if (ov) root.style.setProperty("--peer-ring-l", ov);
    const cs = getComputedStyle(root);
    const band = cs.getPropertyValue("--peer-ink-l").trim();
    const ringBand = cs.getPropertyValue("--peer-ring-l").trim();

    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    const paint = (ground: string, css: string, alpha: number): number[] => {
      g.globalAlpha = 1;
      g.globalCompositeOperation = "copy";
      g.fillStyle = ground;
      g.fillRect(0, 0, 1, 1);
      g.globalCompositeOperation = "source-over";
      g.globalAlpha = alpha;
      g.fillStyle = css;
      g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lin = (v: number): number => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const oklab = ([R, G, B]: number[]): number[] => {
      const [r, gg, b] = [R, G, B].map((v) => lin(v / 255));
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b);
      const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b);
      return [
        0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s,
      ];
    };
    const hueOf = (rgb: number[]): number => {
      const [, A, B] = oklab(rgb);
      const h = (Math.atan2(B, A) * 180) / Math.PI;
      return h < 0 ? h + 360 : h;
    };
    const chromaOf = (rgb: number[]): number => {
      const [, A, B] = oklab(rgb);
      return Math.hypot(A, B);
    };
    const lum = ([r, gg, b]: number[]): number =>
      0.2126 * lin(r / 255) + 0.7152 * lin(gg / 255) + 0.0722 * lin(b / 255);
    const ratio = (a: number[], b: number[]): number => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };

    const raw = Array.from({ length: 144 }, (_, i) => m.inkFor(i));
    const sub = (s: string): string =>
      s.replace("var(--peer-ink-l)", band).replace("var(--peer-ring-l)", ringBand);
    const digits = raw.map((r) => sub(r["--color-user-ink"]));
    const rings = raw.map((r) => sub(r["--color-peer-cursor-ink"]));
    /** the hue the MODULE asked for, straight off its own string */
    const asked = raw.map((r) => {
      const mm = /oklch\(var\(--peer-ring-l\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(
        r["--color-peer-cursor-ink"],
      )!;
      return { C: Number(mm[1]), h: Number(mm[2]) };
    });

    // the ring's geometry off the cascade if a ring is seated, else the sheet's own rule
    const path = document.querySelector(".game-cell.is-peer-cursor .cell-ghost-path");
    let geom = { alpha: 0.55, fill: 0.04, width: 4, from: "default" };
    if (path) {
      const ps = getComputedStyle(path);
      geom = {
        alpha: Number(ps.strokeOpacity),
        fill: Number(ps.fillOpacity),
        width: parseFloat(ps.strokeWidth),
        from: "cascade",
      };
    }

    const card = cs.getPropertyValue("--color-card").trim();
    const bg = cs.getPropertyValue("--color-background").trim();
    const popover = cs.getPropertyValue("--color-popover").trim();
    const tape = cs.getPropertyValue("--sheet-washi-neutral").trim();
    const rgbOf = (v: number[]): string => `rgb(${v[0]},${v[1]},${v[2]})`;

    // RING vs its own 4% fill, worst of 144, on the card
    let ringWorst = { r: Infinity, i: -1 };
    let ringPop = Infinity;
    let minRingC = Infinity;
    let maxHueDrift = { d: 0, i: -1 };
    for (let i = 0; i < 144; i++) {
      const painted = paint("#808080", rings[i], 1);
      minRingC = Math.min(minRingC, chromaOf(painted));
      const d = Math.abs(((hueOf(painted) - asked[i].h + 540) % 360) - 180);
      if (d > maxHueDrift.d) maxHueDrift = { d, i };
      const fill = paint(card, rings[i], geom.fill);
      const stroke = paint(rgbOf(fill), rings[i], geom.alpha);
      const r = ratio(stroke, fill);
      if (r < ringWorst.r) ringWorst = { r, i };
      const pf = paint(popover, rings[i], geom.fill);
      ringPop = Math.min(ringPop, ratio(paint(rgbOf(pf), rings[i], geom.alpha), pf));
    }

    // AA, digits, worst of 144
    const aa: Record<string, { r: number; i: number }> = {};
    for (const [name, ground] of Object.entries({ background: bg, card, popover, tape })) {
      if (!ground) continue;
      const base = paint(ground, "rgba(0,0,0,0)", 0);
      let worst = { r: Infinity, i: -1 };
      for (let i = 0; i < 144; i++) {
        const r = ratio(paint(ground, digits[i], 1), base);
        if (r < worst.r) worst = { r, i };
      }
      aa[name] = worst;
    }

    // the DIGIT inside the ring, against the ring's own stroke — the one adjacency the family
    // ships and does not price: same hue, two bands.
    let digitVsRing = { r: Infinity, i: -1 };
    for (let i = 0; i < 144; i++) {
      const fill = paint(card, rings[i], geom.fill);
      const stroke = paint(rgbOf(fill), rings[i], geom.alpha);
      const digit = paint(rgbOf(fill), digits[i], 1);
      const r = ratio(digit, stroke);
      if (r < digitVsRing.r) digitVsRing = { r, i };
    }

    if (ov) root.style.removeProperty("--peer-ring-l");
    return {
      band,
      ringBand,
      geom,
      ringWorst,
      ringPop,
      minRingC,
      maxHueDrift,
      aa,
      digitVsRing,
      askedC0: asked[0],
    };
  }, override);
}

for (const arm of ["light", "dark"] as const) {
  test(`critic ${arm}`, async ({ page }, info) => {
    await page.goto(SOLO);
    await settled(page);
    await theme(page, arm);
    const shipped = await read(page, null);
    // THE ABLATION: move the sheet's band and leave the module's literal where it is.
    const moved = await read(page, arm === "light" ? "0.20" : "0.92");
    console.log(
      `[${info.project.name}/${arm}] ` + JSON.stringify({ shipped, moved }, null, 1),
    );
  });
}

test("the ring's words", async ({ page }, info) => {
  await page.goto(SOLO);
  await settled(page);
  const before = await page
    .locator(".game-cell")
    .nth(40)
    .getAttribute("aria-label");
  console.log(`[${info.project.name}] name without a cursor: ${before}`);
});
