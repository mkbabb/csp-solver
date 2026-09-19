/**
 * THE RING-BAND INSTRUMENT — banked for every family that gates a focus ring on painted bytes
 * (T9-W7 pass 2, MRK-ABS). It replaces "the pixel that moved furthest inside the annulus",
 * which on this product returns a TOOLTIP.
 *
 * MEASURED, both engines, `.info-btn` at HEAD (logs/infobtn-*.json):
 *   annulus max-change   chromium 18.10  webkit 17.61   <- the washi label, 32px right of the box
 *   this instrument      chromium  3.72  webkit  2.15   <- the ring; 2.15 is r0's own WebKit UA figure
 *
 * THE WINDOW. Four strips, one per side, on the outline's own painted band mid-line
 * (`outline-offset + outline-width/2` outward from the border box), 11 points along the middle
 * 60% of each side. Keep only samples whose dRGB > 12 between the unfocused and focused frames;
 * the ink is the MEDIAN of those, the ground the median of the same pixels before. Report
 * changed/sampled as the confidence.
 *
 * TWO THINGS THAT MUST NOT BE DROPPED, both learned by getting them wrong first:
 *   1  ALPHA. A `color-mix(fg 45%)` ring computes `color(srgb .039 .039 .039 / .45)` and paints
 *      [144,144,143]. Compare the sampled ink against the computed colour COMPOSITED over the
 *      measured ground at its own alpha, or the identity check fails by dRGB 401.
 *   2  CLIPPING. A ring inside a scrollport is clipped on some sides (the deck card returned
 *      1.04 when the median ran over ALL samples). Median over CHANGED samples only.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import process from "node:process";
import sharp from "sharp";

const OUT = process.env.PROBE_OUT ?? ".";
mkdirSync(OUT, { recursive: true });

type RGB = [number, number, number];
const lum = ([r, g, b]: RGB) => {
  const f = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: RGB, b: RGB) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};
const med = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const at = (I: { data: Buffer; w: number; ch: number }, x: number, y: number): RGB => {
  const i = (y * I.w + x) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};
/** rgb(), rgba() and color(srgb …) with an optional alpha. */
function parseColour(c: string): { rgb: RGB; a: number } | null {
  let m = c.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
  if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?:\s*\/\s*([\d.]+))?/);
  if (m)
    return {
      rgb: [+m[1] * 255, +m[2] * 255, +m[3] * 255].map(Math.round) as RGB,
      a: m[4] === undefined ? 1 : +m[4],
    };
  return null;
}

/** THE READING. `sel` is the node the ring paints on; `focusSel` is the node that takes focus. */
export async function ringBand(page: any, sel: string, focusSel = sel) {
  const el = page.locator(sel).first();
  // The subject must be IN the viewport: every sample is taken from a clipped screenshot, and a
  // box below the fold yields a zero-height clip and a silent 0/0 reading.
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(150);
  const box = await el.boundingBox().catch(() => null);
  if (!box) return { sel, found: 0 };
  const M = 40;
  const vp = page.viewportSize()!;
  const clip = {
    x: Math.max(0, Math.floor(box.x - M)),
    y: Math.max(0, Math.floor(box.y - M)),
    width: Math.min(vp.width - Math.max(0, Math.floor(box.x - M)), Math.ceil(box.width + M * 2)),
    height: Math.min(vp.height - Math.max(0, Math.floor(box.y - M)), Math.ceil(box.height + M * 2)),
  };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(250);
  const before = await page.screenshot({ clip });
  await page.locator(focusSel).first().evaluate((n: HTMLElement) => n.focus());
  await page.waitForTimeout(450); // past every 150-250ms outline-colour carrier
  const after = await page.screenshot({ clip });
  const st = await el.evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      colour: cs.outlineColor,
      off: parseFloat(cs.outlineOffset) || 0,
      w: parseFloat(cs.outlineWidth) || 0,
      radius: cs.borderRadius,
    };
  });
  const A = await raw(before);
  const B = await raw(after);
  const bx = box.x - clip.x;
  const by = box.y - clip.y;
  const d = st.off + st.w / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const t = box.width * 0.2 + box.width * 0.6 * (i / 10);
    pts.push([bx + t, by - d], [bx + t, by + box.height + d]);
  }
  for (let i = 0; i <= 10; i++) {
    const t = box.height * 0.2 + box.height * 0.6 * (i / 10);
    pts.push([bx - d, by + t], [bx + box.width + d, by + t]);
  }
  const changed: { ink: RGB; ground: RGB }[] = [];
  let sampled = 0;
  for (const [fx, fy] of pts) {
    const x = Math.round(fx);
    const y = Math.round(fy);
    if (x < 0 || y < 0 || x >= A.w || y >= A.h) continue;
    sampled++;
    const a = at(A, x, y);
    const b = at(B, x, y);
    if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 12)
      changed.push({ ink: b, ground: a });
  }
  if (!changed.length) return { sel, found: 1, ...st, sampled, changed: 0, isTheRing: false };
  const ink = [0, 1, 2].map((c) => med(changed.map((p) => p.ink[c]))) as RGB;
  const ground = [0, 1, 2].map((c) => med(changed.map((p) => p.ground[c]))) as RGB;
  const want = parseColour(st.colour);
  const expected = want
    ? (want.rgb.map((c, i) => Math.round(want.a * c + (1 - want.a) * ground[i])) as RGB)
    : null;
  const dev = expected
    ? Math.abs(ink[0] - expected[0]) + Math.abs(ink[1] - expected[1]) + Math.abs(ink[2] - expected[2])
    : null;
  return {
    sel,
    found: 1,
    ...st,
    sampled,
    changed: changed.length,
    ink,
    ground,
    expected,
    deltaToComputed: dev,
    isTheRing: dev === null ? null : dev <= 24,
    ratio: ratio(ink, ground),
  };
}

test("ring-band", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForSelector(".info-btn", { timeout: 20000 });
  await page.waitForTimeout(600);
  const rows = [];
  for (const sel of [".info-btn", ".icon-btn", ".ctrl-btn", ".drawer-tab", ".logo-trigger"]) {
    if (await page.locator(sel).count()) rows.push(await ringBand(page, sel));
  }
  writeFileSync(`${OUT}/ring-band-${browserName}.json`, JSON.stringify({ engine: browserName, rows }, null, 2));
  for (const r of rows as any[])
    console.log(
      `[ring-band ${browserName}] ${String(r.sel).padEnd(16)} ${r.ratio ?? "-"}  ${r.changed}/${r.sampled} samples  isTheRing=${r.isTheRing}`,
    );
});
