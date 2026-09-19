/** Shared helpers for the ACC-FIVE pass-2 prototype probes. */
import sharp from "sharp";
import { rgbToOklch, srgbToLinear } from "./oklch.mjs";

export const BASE = process.env.BASE || "http://127.0.0.1:4236";
export const OUT = process.env.ACC_FIVE_OUT;
if (!OUT) throw new Error("set ACC_FIVE_OUT — a probe must never default into a frozen record");

export const GOLD = { light: 83.7, dark: 95.2 };
export const CRAYON_BLUE = { light: 251.4, dark: 249.4 };

export const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

/** Raw bytes of a PNG buffer. */
export async function raw(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, info, ch: info.channels };
}

/** Every pixel as {rgb,L,C,h}. */
export async function pixels(buf) {
  const { data, info, ch } = await raw(buf);
  const out = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * ch;
    const rgb = [data[o], data[o + 1], data[o + 2]];
    out.push({ rgb, ...rgbToOklch(rgb[0], rgb[1], rgb[2]) });
  }
  return { px: out, w: info.width, h: info.height };
}

export const hueDelta = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return +Math.min(d, 360 - d).toFixed(2);
};

/** Reach a fresh 9x9 easy board, past the deal and the draw-in. */
export async function board(page, { dpr } = {}) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
  await page.waitForTimeout(900);
  return page.locator("svg.hand-drawn-grid").first();
}

/** One digit — the gauge's v-for is gated on progress > 0. */
export async function writeOne(page) {
  await page.evaluate(() => {
    const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
      (i) => !i.readOnly && !i.value,
    );
    if (ins[0]) ins[0].focus();
  });
  await page.keyboard.type("1");
  await page.waitForTimeout(600);
}

/** Drive the dash front to fraction p using the element's OWN dasharray — the same
 *  quantity the component computes, now in real user units. */
export async function setFront(page, sel, p) {
  await page.evaluate(
    ({ sel, p }) => {
      for (const el of document.querySelectorAll(sel)) {
        const da = getComputedStyle(el).strokeDasharray;
        const L = parseFloat(da);
        el.style.strokeDashoffset = String(L * (1 - p));
      }
    },
    { sel, p },
  );
  await page.waitForTimeout(400);
}

/** Painted samples along the active trace, mapped to viewport coords. */
export async function ringSamples(page, sel, n) {
  return page.evaluate(
    ({ sel, n }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const total = el.getTotalLength();
      const m = el.getScreenCTM();
      const svg = el.ownerSVGElement;
      const o = [];
      for (let i = 0; i < n; i++) {
        const q = el.getPointAtLength((i / n) * total);
        const sp = svg.createSVGPoint();
        sp.x = q.x;
        sp.y = q.y;
        const r = sp.matrixTransform(m);
        o.push([r.x, r.y]);
      }
      return o;
    },
    { sel, n },
  );
}

/** Circular run count + inked share for a boolean ring. */
export function runsAndShare(inked) {
  const n = inked.length;
  if (inked.every(Boolean)) return { runs: 1, share: 1, lens: [n] };
  if (!inked.some(Boolean)) return { runs: 0, share: 0, lens: [] };
  let runs = 0;
  for (let i = 0; i < n; i++) if (inked[i] && !inked[(i - 1 + n) % n]) runs++;
  const lens = [];
  let start = 0;
  for (let i = 0; i < n; i++)
    if (inked[i] && !inked[(i - 1 + n) % n]) {
      start = i;
      break;
    }
  let cur = 0;
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n;
    if (inked[i]) cur++;
    else if (cur) {
      lens.push(cur);
      cur = 0;
    }
  }
  if (cur) lens.push(cur);
  return { runs, share: +(inked.filter(Boolean).length / n).toFixed(3), lens };
}
