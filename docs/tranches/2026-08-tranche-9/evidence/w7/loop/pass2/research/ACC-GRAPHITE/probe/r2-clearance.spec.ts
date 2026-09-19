/**
 * ACC-GRAPHITE pass-2 RESEARCH, part 4 — RECONCILE the tick-to-rule clearance.
 * Part 2's ROW profile (crop from the board's left corner) read the ticks contiguous with the
 * rule, matching the pass-1 critique. Part 3's COLUMN profile (crop 20 px in from the corner)
 * read 12-13 px of paper. One of the two is an artefact; this settles it by walking the
 * clearance as a function of distance from the corner, and by ablating the trace itself.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const OUT = new URL("../readings/", import.meta.url).pathname;
const FRM = new URL("../frames/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
mkdirSync(FRM, { recursive: true });

interface Raw {
  data: Buffer;
  width: number;
  height: number;
  ch: number;
}
async function shot(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ type: "png", clip });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { raw: { data, width: info.width, height: info.height, ch: info.channels } as Raw, buf };
}
const lumAt = (p: Raw, x: number, y: number) => {
  const i = (p.width * y + x) * p.ch;
  return 0.2126 * p.data[i] + 0.7152 * p.data[i + 1] + 0.0722 * p.data[i + 2];
};
function bands(p: Raw, x: number, t = 165) {
  const out: { i0: number; w: number }[] = [];
  let s = -1;
  for (let y = 0; y < p.height; y++) {
    const ink = lumAt(p, x, y) < t;
    if (ink && s < 0) s = y;
    if (!ink && s >= 0) {
      out.push({ i0: s, w: y - s });
      s = -1;
    }
  }
  if (s >= 0) out.push({ i0: s, w: p.height - s });
  return out;
}

test("clearance vs distance from the corner", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  // write 20 cells
  const idx = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"))
      .map((c, i) => ({ i, v: c.querySelector<HTMLInputElement>("input")?.value }))
      .filter((c) => !c.v)
      .slice(0, 20)
      .map((c) => c.i),
  );
  for (const i of idx) {
    await page.evaluate((k: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [k].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, i);
    await page.keyboard.type("1");
    await page.waitForTimeout(30);
  }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(900);

  const b = await page.evaluate(() => {
    const g = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
    const r = g.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const clip = {
    x: Math.round(b.x),
    y: Math.round(b.y - 12),
    width: Math.min(380, Math.round(b.w)),
    height: 48,
  };
  const style = async (css: string) => {
    await page.evaluate((t: string) => {
      let el = document.getElementById("r2diag") as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = "r2diag";
        document.head.appendChild(el);
      }
      el.textContent = t;
    }, css);
    await page.waitForTimeout(250);
  };

  const readCols = async () => {
    const { raw } = await shot(page, clip);
    return Array.from({ length: raw.width }, (_, x) => ({ x, b: bands(raw, x) }));
  };

  const withTrace = await readCols();
  await style(".progress-pose { display: none !important }");
  const without = await readCols();
  await style("");

  // the trace's own band is the one `without` does not have
  const rows = withTrace.map((c, i) => {
    const base = without[i].b;
    const extra = c.b.filter(
      (band) => !base.some((q) => Math.abs(q.i0 - band.i0) <= 1 && Math.abs(q.w - band.w) <= 1),
    );
    const rule = base[0] ?? null;
    const tick = extra[0] ?? null;
    return {
      x: c.x,
      bandsWith: c.b.length,
      bandsWithout: base.length,
      ruleY: rule ? rule.i0 : null,
      ruleW: rule ? rule.w : null,
      tickY: tick ? tick.i0 : null,
      tickW: tick ? tick.w : null,
      clearance: rule && tick ? tick.i0 - (rule.i0 + rule.w) : null,
    };
  });
  const withTick = rows.filter((r) => r.clearance !== null);
  const med = (v: number[]) => (v.length ? [...v].sort((a, c) => a - c)[v.length >> 1] : null);
  const zones = [
    { name: "0-24 px from corner", f: (r: { x: number }) => r.x < 24 },
    { name: "24-80", f: (r: { x: number }) => r.x >= 24 && r.x < 80 },
    { name: "80-200", f: (r: { x: number }) => r.x >= 80 && r.x < 200 },
    { name: "200+", f: (r: { x: number }) => r.x >= 200 },
  ].map((z) => {
    const s = withTick.filter(z.f);
    return {
      zone: z.name,
      cols: s.length,
      clearanceMedian: med(s.map((r) => r.clearance as number)),
      clearanceMin: s.length ? Math.min(...s.map((r) => r.clearance as number)) : null,
      tickWMedian: med(s.map((r) => r.tickW as number)),
      ruleWMedian: med(s.map((r) => r.ruleW as number)),
    };
  });
  const out = {
    engine: browserName,
    clip,
    colsTotal: rows.length,
    colsWithTick: withTick.length,
    clearanceMedianAll: med(withTick.map((r) => r.clearance as number)),
    clearanceMinAll: withTick.length
      ? Math.min(...withTick.map((r) => r.clearance as number))
      : null,
    zones,
    sample: rows.filter((r) => r.x % 20 === 0).slice(0, 20),
  };
  writeFileSync(OUT + `clearance-${browserName}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  if (browserName === "chromium") {
    const { buf } = await shot(page, clip);
    writeFileSync(FRM + "tally-top-strip-light-chromium.png", buf);
  }
  expect(rows.length).toBeGreaterThan(0);
});
