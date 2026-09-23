/**
 * T9-W7 pass 5 · CTRL-TAPE — shared instrument helpers (read-only on the product).
 *
 * THE PAYLOAD (LAWS P4, `?board=` is a codec payload): the golden spec's PINNED_GIVENS
 * `{0:5, 2:8, 11:3, 18:6, 20:9}` encoded with the app's own grammar (`e2e/wire.ts`
 * `encodeSudoku`, `CODEC_VERSION` byte 1). Every arm loads it and `givens()` reads the set back so
 * both arms are asserted to deal the same board.
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";

export { chromium, webkit, sharp };
export const ENGINES = [
  ["chromium", chromium],
  ["webkit", webkit],
];
export const PAYLOAD =
  "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
export const GIVENS = "0:5,2:8,11:3,18:6,20:9";
export const URL = `/?board=${PAYLOAD}`;

export const CELLS = {
  rail1280: { width: 1280, height: 800, touch: false },
  rail1440: { width: 1440, height: 900, touch: false },
  rail1024: { width: 1024, height: 768, touch: false },
  coarse1280: { width: 1280, height: 800, touch: true },
  dock390: { width: 390, height: 844, touch: true, dock: true },
  dock430: { width: 430, height: 932, touch: true, dock: true },
  land844: { width: 844, height: 390, touch: true, dock: true },
  land812: { width: 812, height: 375, touch: true, dock: true },
};

export async function open(browser, base, cell, { theme = "light", dpr = 2, prm = "no-preference" } = {}) {
  const ctx = await browser.newContext({
    baseURL: base,
    viewport: { width: cell.width, height: cell.height },
    hasTouch: !!cell.touch,
    colorScheme: theme,
    deviceScaleFactor: dpr,
    reducedMotion: prm,
  });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 45000 });
  await page.waitForTimeout(700);
  const regime = await page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    row: matchMedia("(min-width: 1024px)").matches,
  }));
  if (cell.dock) await openDock(page);
  return { ctx, page, regime };
}

/** The dock sheet SLIDES (~700 ms): open it, then poll the sheet's own top to rest. */
export async function openDock(page) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) await tab.first().click();
  let last = null;
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(80);
    const t = await page.evaluate(
      () => document.querySelector("#controls-drawer")?.getBoundingClientRect().top ?? null,
    );
    if (t !== null && last !== null && Math.abs(t - last) < 0.05) return t;
    last = t;
  }
  return last;
}

export async function givens(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll(".board-wrapper input")]
      .map((e, i) => (/given/.test(e.getAttribute("aria-label") || "") ? `${i}:${e.value}` : null))
      .filter(Boolean)
      .join(","),
  );
}

/** RGBA raw of a css-px clip at the page's DPR. */
export async function shot(page, clip) {
  const buf = await page.screenshot({ clip, animations: "allow", caret: "hide" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
export const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const ratio = (la, lb) => (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);

/** A differential: the pixels that change when `hideCss` is applied, inside `clip`. Returns
 *  per-pixel change mask plus the ON (painted) and OFF (ground) frames. */
export async function differential(page, clip, hideCss, { thresh = 24 } = {}) {
  const on = await shot(page, clip);
  const tag = await page.addStyleTag({ content: hideCss });
  await page.waitForTimeout(120);
  const off = await shot(page, clip);
  await tag.evaluate((n) => n.remove());
  await page.waitForTimeout(80);
  const { w, h } = on;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const d = Math.max(
      Math.abs(on.data[o] - off.data[o]),
      Math.abs(on.data[o + 1] - off.data[o + 1]),
      Math.abs(on.data[o + 2] - off.data[o + 2]),
    );
    if (d > thresh) mask[i] = 1;
  }
  return { on, off, mask, w, h };
}

/** Core-median contrast of the changed pixels vs their own ground pixel, with the sensitivity
 *  row: per-column max ratio at thresholds 50/70/90/100% of the max luminance move. */
export function coreContrast(diff, floor = 3.0) {
  const { on, off, mask, w, h } = diff;
  const moves = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue;
    const o = i * 4;
    const lo = lum(on.data[o], on.data[o + 1], on.data[o + 2]);
    const lg = lum(off.data[o], off.data[o + 1], off.data[o + 2]);
    moves.push({ i, move: Math.abs(lo - lg), r: ratio(lo, lg) });
  }
  if (!moves.length) return null;
  // the reference is the 98th-percentile move, not the max: one outlier pixel (a caret, an
  // antialiasing flip) must not shrink the core to five pixels.
  const sortedMoves = moves.map((m) => m.move).sort((a, b) => a - b);
  const maxMove = sortedMoves[Math.floor(0.98 * (sortedMoves.length - 1))];
  const q = (arr, p) => {
    const s = [...arr].sort((a, b) => a - b);
    return +s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))].toFixed(3);
  };
  const sens = {};
  for (const pct of [0.5, 0.7, 0.9, 1.0]) {
    const core = moves.filter((m) => m.move >= pct * maxMove * 0.999);
    const cols = new Map();
    for (const m of core) {
      const x = m.i % w;
      cols.set(x, Math.max(cols.get(x) ?? 0, m.r));
    }
    const cv = [...cols.values()];
    sens[`${pct * 100}%`] = {
      n: core.length,
      median: q(core.map((m) => m.r), 0.5),
      worstCol: cv.length ? +Math.min(...cv).toFixed(3) : null,
      fracColsUnder: cv.length ? +(cv.filter((v) => v < floor).length / cv.length).toFixed(3) : null,
    };
  }
  const core = moves.filter((m) => m.move >= 0.5 * maxMove);
  const rs = core.map((m) => m.r);
  return {
    changed: moves.length,
    coreN: core.length,
    max: q(rs, 1),
    p30: q(rs, 0.3),
    median: q(rs, 0.5),
    fracUnder: +(rs.filter((v) => v < floor).length / rs.length).toFixed(3),
    sens,
  };
}
