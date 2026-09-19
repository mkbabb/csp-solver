/**
 * T9-W7 pass 2 · MRK-ABS research — THE TWO UNMEASURED FACES, THE SHEET'S REAL CLIPPER, and
 * a ring instrument that cannot be fooled by revealed art. HEAD tree, :4238, read-only.
 *
 * THE INSTRUMENT (the charter's row 14). Pass 1 scored a focus ring as "the pixel that moved
 * furthest inside the element's annulus". On `.info-btn` the washi tooltip
 * (`SheetWashiLabel.vue:107` — opacity 0 -> 1 over 150ms) lands INSIDE that annulus, so the
 * row returned 17.78 and described a tooltip. This adds a second reading on the same bytes:
 *
 *   RING BAND — the ring's own geometry, not a search. Four strips, one per side, each on the
 *   mid-line of the outline's painted band (offset + width/2 outward from the border box),
 *   sampled along the middle 60% of that side. The ink is the MEDIAN of those samples, the
 *   ground is the same pixels before focus, and the row is only a ring if the ink matches the
 *   computed `outline-color` within dRGB <= 24. A tooltip cannot move the median of the band's
 *   own mid-line, and a row that is not the ring says so instead of returning a number.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import process from "node:process";
import sharp from "sharp";

const OUT = process.env.PROBE_OUT!;
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 2));

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
async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const px = (I: { data: Buffer; w: number; ch: number }, x: number, y: number): RGB => {
  const i = (y * I.w + x) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};
const median = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];

/** Pass-1's window: max change anywhere in the annulus. */
function annulusMax(A: any, B: any, box: number[], reach: number) {
  const [bx, by, bw, bh] = box;
  let best = -1;
  let ink: RGB = [0, 0, 0];
  let ground: RGB = [0, 0, 0];
  for (let y = Math.max(0, Math.floor(by - reach)); y < Math.min(A.h, by + bh + reach); y++) {
    for (let x = Math.max(0, Math.floor(bx - reach)); x < Math.min(A.w, bx + bw + reach); x++) {
      const inInner = x > bx + 1 && x < bx + bw - 1 && y > by + 1 && y < by + bh - 1;
      if (inInner) continue;
      const a = px(A, x, y);
      const b = px(B, x, y);
      const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (d > best) {
        best = d;
        ink = b;
        ground = a;
      }
    }
  }
  return { ink, ground, ratio: ratio(ink, ground), delta: best };
}

/** The proposed window: the outline's own painted band, four mid-line strips, median ink. */
function ringBand(A: any, B: any, box: number[], offset: number, width: number, want: RGB | null) {
  const [bx, by, bw, bh] = box;
  const d = offset + width / 2; // the band's mid-line, outward from the border box
  const inks: RGB[] = [];
  const grounds: RGB[] = [];
  const along = (n: number) => {
    const out: number[] = [];
    for (let i = 0; i < 9; i++) out.push(n * 0.2 + (n * 0.6 * i) / 8);
    return out;
  };
  const pts: [number, number][] = [
    ...along(bw).map((t) => [bx + t, by - d] as [number, number]),
    ...along(bw).map((t) => [bx + t, by + bh + d] as [number, number]),
    ...along(bh).map((t) => [bx - d, by + t] as [number, number]),
    ...along(bh).map((t) => [bx + bw + d, by + t] as [number, number]),
  ];
  for (const [fx, fy] of pts) {
    const x = Math.round(fx);
    const y = Math.round(fy);
    if (x < 0 || y < 0 || x >= A.w || y >= A.h) continue;
    inks.push(px(B, x, y));
    grounds.push(px(A, x, y));
  }
  if (!inks.length) return { found: 0 };
  const ink: RGB = [0, 1, 2].map((c) => median(inks.map((p) => p[c]))) as RGB;
  const ground: RGB = [0, 1, 2].map((c) => median(grounds.map((p) => p[c]))) as RGB;
  const dev = want
    ? Math.abs(ink[0] - want[0]) + Math.abs(ink[1] - want[1]) + Math.abs(ink[2] - want[2])
    : null;
  return {
    found: inks.length,
    ink,
    ground,
    ratio: ratio(ink, ground),
    deltaToComputed: dev,
    isTheRing: dev === null ? null : dev <= 24,
  };
}

function parseColour(c: string): RGB | null {
  let m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [+m[1], +m[2], +m[3]];
  m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
  if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255].map(Math.round) as RGB;
  return null;
}

async function readRing(page: Page, sel: string, focusSel = sel) {
  const el = page.locator(sel).first();
  const box = await el.boundingBox().catch(() => null);
  if (!box) return { sel, found: 0 };
  const M = 24;
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
  await page.waitForTimeout(400); // past every 150-250ms colour transition
  const after = await page.screenshot({ clip });
  const style = await el.evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      colour: cs.outlineColor,
      offsetPx: parseFloat(cs.outlineOffset) || 0,
      widthPx: parseFloat(cs.outlineWidth) || 0,
      radius: cs.borderRadius,
    };
  });
  const A = await raw(before);
  const B = await raw(after);
  const lbox = [box.x - clip.x, box.y - clip.y, box.width, box.height];
  const want = parseColour(style.colour);
  return {
    sel,
    found: 1,
    ...style,
    annulusMax: annulusMax(A, B, lbox, style.offsetPx + style.widthPx + 2),
    ringBand: ringBand(A, B, lbox, style.offsetPx, style.widthPx, want),
  };
}

test("A-faces", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    await page.goto("/?view=gallery");
    await page.waitForSelector(".staging-btn", { timeout: 20000 });
    await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
    await page.waitForTimeout(700);
    const safe = await readRing(page, ".staging-safe .staging-face", ".staging-safe");
    const deal = await readRing(page, ".staging-deal .staging-face", ".staging-deal");
    const card = await readRing(page, ".game-card.is-center", ".gallery-viewport");
    report[theme] = { safe, deal, card };
  }
  bank(`faces-${browserName}`, report);
  console.log(`[faces ${browserName}] ${JSON.stringify(report, null, 1)}`);
});

test("B-guard", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    await page.goto("/");
    await page.waitForSelector(".game-cell input", { timeout: 20000 });
    await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
    await page.waitForTimeout(400);
    // DIRTY THE BOARD: the first EMPTY, writable cell takes a digit.
    const wrote = await page.evaluate(() => {
      const ins = Array.from(
        document.querySelectorAll<HTMLInputElement>(".game-cell input"),
      ).filter((i) => !i.readOnly && !i.disabled && i.value === "");
      if (!ins.length) return { ok: false, reason: "no empty writable cell" };
      ins[0].focus();
      return { ok: true, id: ins[0].id || null };
    });
    for (const k of ["1", "2", "3", "4"]) {
      await page.keyboard.press(k);
      await page.waitForTimeout(160);
      const v = await page.evaluate(
        () => (document.activeElement as HTMLInputElement | null)?.value ?? "",
      );
      if (v !== "") break;
    }
    await page.waitForTimeout(400);
    const dirty = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLInputElement>(".game-cell input")).some(
        (i) => !i.readOnly && i.value !== "",
      ),
    );
    // OPEN the deck in place (no reload — a reload would lose the dirty board).
    const opened = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll("button, [role='button']")).find((b) =>
        /switch|game|picker|gallery/i.test(b.getAttribute("aria-label") || b.textContent || ""),
      ) as HTMLElement | undefined;
      el?.click();
      return !!el;
    });
    await page.waitForTimeout(900);
    let armed = false;
    if (await page.locator(".gallery-viewport").count()) {
      await page.evaluate(() =>
        (document.querySelector(".gallery-viewport") as HTMLElement | null)?.focus(),
      );
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(800);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(1000);
      armed = (await page.locator(".guard-btn").count()) > 0;
    }
    let ring: unknown = null;
    if (armed) {
      ring = {
        keep: await readRing(page, ".guard-keep .guard-face", ".guard-keep"),
        leave: await readRing(page, ".guard-leave .guard-face", ".guard-leave"),
        note: await page.evaluate(() => {
          const n = document.querySelector(".guard-note") as HTMLElement | null;
          if (!n) return null;
          const r = n.getBoundingClientRect();
          const cs = getComputedStyle(n);
          return {
            rect: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100),
            ground: cs.backgroundColor,
            overflow: cs.overflow,
          };
        }),
      };
    }
    report[theme] = { wrote, dirty, opened, armed, ring };
  }
  bank(`guard-${browserName}`, report);
  console.log(`[guard ${browserName}] ${JSON.stringify(report, null, 1).slice(0, 2500)}`);
  expect(true).toBe(true);
});

test("C-sheet-clipper", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  await page.goto("/");
  await page.waitForSelector(".game-cell", { timeout: 20000 });
  await page.waitForTimeout(500);
  await page.locator(".drawer-tab").first().click();
  await page.waitForTimeout(900);
  const out = await page.evaluate(() => {
    const cas = document.querySelector(".drawer-case") as HTMLElement | null;
    if (!cas) return { found: false };
    const stops = Array.from(
      cas.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];
    const clipperOf = (n: HTMLElement) => {
      let p: HTMLElement | null = n.parentElement;
      while (p && p !== document.documentElement) {
        const cs = getComputedStyle(p);
        if (
          /auto|scroll|hidden|clip/.test(cs.overflow + cs.overflowX + cs.overflowY) ||
          cs.contain.includes("paint")
        )
          return p;
        p = p.parentElement;
      }
      return null;
    };
    const rows = stops.map((n) => {
      const r = n.getBoundingClientRect();
      const c = clipperOf(n);
      const cr = c ? c.getBoundingClientRect() : null;
      const m = cr
        ? Math.min(r.left - cr.left, cr.right - r.right, r.top - cr.top, cr.bottom - r.bottom)
        : null;
      return {
        cls: (n.className || "").toString().split(" ")[0],
        rect: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100),
        clipper: c ? (c.className || "").toString().split(" ")[0] + "|" + c.tagName : null,
        clipperOverflow: c ? getComputedStyle(c).overflow : null,
        marginToClipper: m === null ? null : Math.round(m * 100) / 100,
        tokenFits: m === null ? true : m >= 5,
        viewportMargin: Math.round(Math.min(r.left, innerWidth - r.right) * 100) / 100,
      };
    });
    const cr = cas.getBoundingClientRect();
    return {
      found: true,
      caseRect: [cr.x, cr.y, cr.width, cr.height].map((v) => Math.round(v * 100) / 100),
      caseOverflow: getComputedStyle(cas).overflow,
      stops: rows.length,
      tightest: rows
        .slice()
        .sort((a, b) => (a.marginToClipper ?? 999) - (b.marginToClipper ?? 999))
        .slice(0, 8),
      clippedByAncestor: rows.filter((r) => !r.tokenFits).length,
      atViewportEdge: rows.filter((r) => r.viewportMargin < 5).length,
      rows,
    };
  });
  bank(`sheet-clipper-${browserName}`, out);
  console.log(`[sheet ${browserName}] ${JSON.stringify(out, null, 1).slice(0, 2600)}`);
});
