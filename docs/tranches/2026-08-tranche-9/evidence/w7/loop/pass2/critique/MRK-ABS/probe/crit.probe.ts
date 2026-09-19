/**
 * T9-W7 pass 2 · MRK-ABS CRITIQUE — the critic's own readings, independent of the
 * prototype's instruments.
 *
 *  A  the board at 16x16, both themes: boundary B re-measured from PAINTED BYTES at the
 *     ring's own extremum PER SCANLINE (min over rows of ringMinX - ruleMaxX - 1), which is
 *     neither the closed form nor the prototype's single mid-cell scanline; plus ring ink vs
 *     rule ink from the same raster.
 *  B  the tab walk: every :focus-visible stop's computed outline, both themes, both engines.
 *  C  the deck at ?view=gallery: the centre card's ring, WHOLE against the scrollport, and
 *     .live-face-slot's computed radius focused vs blurred.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
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
const medRGB = (v: RGB[]): RGB => [0, 1, 2].map((c) => med(v.map((p) => p[c]))) as RGB;
const setTheme = async (page: Page, dark: boolean) => {
  await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
  await page.waitForTimeout(300);
};
const write = (name: string, o: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(o, null, 2));

test("A · board boundary B from painted bytes, per-scanline extremum", async ({
  page,
  browserName,
}) => {
  test.setTimeout(240000);
  const out: Record<string, unknown> = { engine: browserName };
  await page.goto("/?size=4&difficulty=EASY");
  await page.waitForSelector(".game-cell", { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll(".game-cell").length === 256, {
    timeout: 120000,
  });
  for (const dark of [false, true]) {
    await setTheme(page, dark);
    const pick = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      for (let i = 0; i < cells.length; i++) {
        const r = Math.floor(i / 16),
          c = i % 16;
        if (r < 3 || r > 12 || c < 3 || c > 12) continue;
        const inp = cells[i].querySelector("input") as HTMLInputElement | null;
        if (!inp || inp.value || inp.readOnly || inp.disabled) continue;
        inp.focus();
        return i;
      }
      return -1;
    });
    await page.waitForTimeout(600);
    const geo = await page.evaluate((i) => {
      const cell = document.querySelectorAll(".game-cell")[i] as HTMLElement;
      const r = cell.getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      const path = cell.querySelector(".cell-ghost-path") as SVGPathElement | null;
      const svg = cell.querySelector(".cell-ghost svg") as SVGSVGElement | null;
      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        gridLine: cs.getPropertyValue("--grid-line-color").trim(),
        d: path?.getAttribute("d") ?? "",
        viewBox: svg?.getAttribute("viewBox") ?? "",
        strokeWidth: path ? getComputedStyle(path).strokeWidth : "",
        strokeOpacity: path ? getComputedStyle(path).strokeOpacity : "",
        stroke: path ? getComputedStyle(path).stroke : "",
      };
    }, pick);
    const pad = Math.round(geo.rect.w * 0.9);
    const clip = {
      x: Math.max(0, Math.round(geo.rect.x - pad)),
      y: Math.max(0, Math.round(geo.rect.y - pad)),
      width: Math.round(geo.rect.w + 2 * pad),
      height: Math.round(geo.rect.h + 2 * pad),
    };
    const buf = await page.screenshot({ clip });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const W = info.width,
      H = info.height,
      CH = info.channels;
    const dsf = W / clip.width;
    const at = (x: number, y: number): RGB => {
      const i = (y * W + x) * CH;
      return [data[i], data[i + 1], data[i + 2]];
    };
    // the ring ink: strongly blue-dominant
    const isRing = (p: RGB) => p[2] > p[0] + 35 && p[2] > 80 && p[2] > p[1] + 12;
    const ringPx: RGB[] = [];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = at(x, y);
        if (isRing(p)) ringPx.push(p);
      }
    // the cell's own paper: a quadrant the ring cannot reach (inside the ring is fill 0.08,
    // so take the corner between the rule and the ring: 6% in from the cell's own corner)
    const cx0 = (geo.rect.x - clip.x) * dsf,
      cy0 = (geo.rect.y - clip.y) * dsf;
    const cw = geo.rect.w * dsf,
      chh = geo.rect.h * dsf;
    const paper = medRGB(
      [0.06, 0.08, 0.1].flatMap((f) =>
        [0.06, 0.08, 0.1].map(
          (g) => at(Math.round(cx0 + f * cw), Math.round(cy0 + g * chh)) as RGB,
        ),
      ),
    );
    // the rule ink: sample the vertical rule at the cell's left boundary, well above/below
    const ruleSamples: RGB[] = [];
    for (let dy = -Math.round(chh * 0.4); dy <= Math.round(chh * 0.4); dy += 3) {
      const y = Math.round(cy0 + chh / 2 + dy);
      let best: RGB | null = null;
      let bestD = 0;
      for (let x = Math.round(cx0 - cw * 0.12); x <= Math.round(cx0 + cw * 0.12); x++) {
        const p = at(x, y);
        const d = Math.abs(lum(p) - lum(paper));
        if (!isRing(p) && d > bestD) {
          bestD = d;
          best = p;
        }
      }
      if (best && bestD > 0.02) ruleSamples.push(best);
    }
    const ruleInk = ruleSamples.length ? medRGB(ruleSamples) : ([0, 0, 0] as RGB);
    const ringInk = ringPx.length ? medRGB(ringPx) : ([0, 0, 0] as RGB);
    // per-scanline worst-case clearance on the LEFT side, over the cell's middle 80%
    const y0 = Math.round(cy0 + 0.1 * chh),
      y1 = Math.round(cy0 + 0.9 * chh);
    const isRule = (p: RGB) => !isRing(p) && Math.abs(lum(p) - lum(paper)) > 0.015;
    let worst = Infinity,
      worstY = -1;
    const gaps: number[] = [];
    for (let y = y0; y <= y1; y++) {
      let ringMinX = -1;
      for (let x = Math.round(cx0 - 0.05 * cw); x < Math.round(cx0 + 0.5 * cw); x++) {
        if (isRing(at(x, y))) {
          ringMinX = x;
          break;
        }
      }
      if (ringMinX < 0) continue;
      let ruleMaxX = -1;
      for (let x = ringMinX - 1; x > Math.round(cx0 - 0.25 * cw); x--) {
        if (isRule(at(x, y))) {
          ruleMaxX = x;
          break;
        }
      }
      if (ruleMaxX < 0) continue;
      const g = (ringMinX - ruleMaxX - 1) / dsf;
      gaps.push(g);
      if (g < worst) {
        worst = g;
        worstY = y;
      }
    }
    out[dark ? "dark" : "light"] = {
      cellPx: Math.round(geo.rect.w * 100) / 100,
      dsf,
      d_prefix: geo.d.slice(0, 60),
      viewBox: geo.viewBox,
      strokeWidth: geo.strokeWidth,
      strokeOpacity: geo.strokeOpacity,
      stroke: geo.stroke,
      gridLineToken: geo.gridLine,
      ringInk,
      ruleInk,
      paper,
      ringPixels: ringPx.length,
      ringVsPaper: ratio(ringInk, paper),
      ringVsRule: ratio(ringInk, ruleInk),
      scanlines: gaps.length,
      B_worst_css_px: Math.round(worst * 1000) / 1000,
      B_median_css_px: Math.round(med(gaps) * 1000) / 1000,
      worstY,
    };
  }
  write(`crit-board-${browserName}.json`, out);
  expect(true).toBe(true);
});

test("B · tab walk, computed outline census, both themes", async ({ page, browserName }) => {
  test.setTimeout(180000);
  const out: Record<string, unknown> = { engine: browserName };
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector(".game-cell", { timeout: 60000 });
  await page.waitForTimeout(800);
  for (const dark of [false, true]) {
    await setTheme(page, dark);
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    const seen: Record<string, unknown>[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().split(/\s+/).filter(Boolean).slice(0, 3),
          fv: el.matches(":focus-visible"),
          color: cs.outlineColor,
          style: cs.outlineStyle,
          width: cs.outlineWidth,
          offset: cs.outlineOffset,
          radius: cs.borderRadius,
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
      if (!info) break;
      const key = info.tag + "." + info.cls.join(".");
      if (seen.some((s) => s.key === key)) continue;
      seen.push({ key, ...info });
    }
    out[dark ? "dark" : "light"] = seen;
  }
  write(`crit-tabwalk-${browserName}.json`, out);
  expect(true).toBe(true);
});

test("C · the deck's centre card", async ({ page, browserName }) => {
  test.setTimeout(180000);
  const out: Record<string, unknown> = { engine: browserName };
  await page.goto("/?view=gallery");
  await page.waitForSelector(".gallery-viewport", { timeout: 60000 });
  await page.waitForTimeout(1200);
  for (const dark of [false, true]) {
    await setTheme(page, dark);
    const blurred = await page.evaluate(() => {
      const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
      return slot ? getComputedStyle(slot).borderRadius : null;
    });
    await page.evaluate(() =>
      (document.querySelector(".gallery-viewport") as HTMLElement)?.focus(),
    );
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const vp = document.querySelector(".gallery-viewport") as HTMLElement;
      const card = document.querySelector(".game-card.is-center") as HTMLElement | null;
      const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
      if (!card) return null;
      const cs = getComputedStyle(card);
      const vcs = getComputedStyle(vp);
      const cr = card.getBoundingClientRect();
      const vr = vp.getBoundingClientRect();
      const reach =
        parseFloat(cs.outlineWidth || "0") + parseFloat(cs.outlineOffset || "0");
      return {
        vpFocusVisible: vp.matches(":focus-visible"),
        vpOutlineStyle: vcs.outlineStyle,
        card: {
          color: cs.outlineColor,
          style: cs.outlineStyle,
          width: cs.outlineWidth,
          offset: cs.outlineOffset,
          radius: cs.borderRadius,
        },
        reach,
        air: {
          left: cr.left - vr.left,
          right: vr.right - cr.right,
          top: cr.top - vr.top,
          bottom: vr.bottom - cr.bottom,
        },
        slotRadiusFocused: slot ? getComputedStyle(slot).borderRadius : null,
        owners: Array.from(document.querySelectorAll("*")).filter((e) => {
          const s = getComputedStyle(e as Element);
          return (
            s.outlineStyle !== "none" &&
            parseFloat(s.outlineWidth) > 0 &&
            (e as HTMLElement).offsetParent !== null
          );
        }).length,
      };
    });
    out[dark ? "dark" : "light"] = { slotRadiusBlurred: blurred, ...r };
  }
  write(`crit-deck-${browserName}.json`, out);
  expect(true).toBe(true);
});
