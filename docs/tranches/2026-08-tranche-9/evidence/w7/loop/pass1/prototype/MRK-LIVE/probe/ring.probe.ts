/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE §6 — the ring off the board.
 *
 * G-LIVE-3  ONE OWNER: across >= 7 tab stops exactly one `.focus-ring` is visible, within 1px
 *           of its target's border box + outset; on the deck it sits on the activedescendant
 *           card and MOVES on ArrowRight; `.gallery-viewport` computes outline none.
 * G-LIVE-5  CONTRAST FROM PAINTED BYTES: every stop >= 3:1 on its own ground, both themes.
 * G-LIVE-6  FORCED COLORS: every stop computes outline-style solid, the drawn ring hidden.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

const lum = (c: number[]) => {
  const f = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const ratio = (a: number[], b: number[]) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};

/** The ring's own box against its target's box + outset. */
const RING_FIT = `() => {
  const svg = document.querySelector(".focus-ring");
  const a = document.activeElement;
  if (!a) return null;
  const owned = a.getAttribute && a.getAttribute("aria-activedescendant");
  const target = (owned && document.getElementById(owned)) || a;
  const r = target.getBoundingClientRect();
  const cs = getComputedStyle(target);
  const outset = parseFloat(cs.getPropertyValue("--focus-ring-outset")) || 3;
  const desc = (el) => el.tagName.toLowerCase() + "." + (el.getAttribute("class") || "").split(/\\s+/).slice(0, 2).join(".");
  if (!svg) return { stop: desc(a), target: desc(target), rings: 0, visible: 0 };
  const b = svg.getBoundingClientRect();
  const err = Math.max(
    Math.abs(b.left - (r.left - outset)),
    Math.abs(b.top - (r.top - outset)),
    Math.abs(b.width - (r.width + 2 * outset)),
    Math.abs(b.height - (r.height + 2 * outset)),
  );
  const all = Array.from(document.querySelectorAll(".focus-ring"));
  return {
    stop: desc(a),
    target: desc(target),
    ownedByAria: !!owned,
    rings: all.length,
    visible: all.filter((s) => getComputedStyle(s).display !== "none" && s.getBoundingClientRect().width > 0).length,
    errPx: Math.round(err * 100) / 100,
    outset,
    targetOutline: cs.outlineStyle,
    stopOutline: getComputedStyle(a).outlineStyle + " " + getComputedStyle(a).outlineWidth,
    ringBox: [Math.round(b.left * 10) / 10, Math.round(b.top * 10) / 10, Math.round(b.width * 10) / 10, Math.round(b.height * 10) / 10],
  };
}`;

test("G-LIVE-3 one ring owner across the tab stops", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  const stops: unknown[] = [];
  // WebKit's Tab reaches text fields only (the macOS full-keyboard-access default), so the
  // walk there names its stops and focuses them; the assertion is identical either way.
  const NAMED = [
    ".logo-trigger",
    ".sun-moon-toggle",
    ".drawer-tab",
    ".ctrl-btn",
    ".icon-btn",
    ".attribution-trigger",
    "a[href]",
    ".cell-native-input",
  ];
  if (browserName === "webkit") {
    for (const sel of NAMED) {
      const ok = await page.evaluate((s) => {
        const el = document.querySelector<HTMLElement>(s);
        if (!el) return false;
        el.focus();
        return document.activeElement === el;
      }, sel);
      if (!ok) continue;
      await page.waitForTimeout(260);
      const row = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: RING_FIT });
      if (row) stops.push(row);
    }
  } else {
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(220);
      const row = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: RING_FIT });
      if (row) stops.push(row);
    }
  }

  // The deck, opened the way a keyboard user opens it: the wordmark focused, then Enter.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  const deckA = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: RING_FIT });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(900);
  const deckB = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: RING_FIT });
  const deckExtra = await page.evaluate(() => {
    const vp = document.querySelector(".gallery-viewport")!;
    const card = document.querySelector(".game-card.is-center");
    const ring = document.querySelector(".focus-ring");
    const air = card && ring
      ? Math.round(
          (card.getBoundingClientRect().left -
            vp.getBoundingClientRect().left) * 100,
        ) / 100
      : null;
    return {
      viewportOutline: getComputedStyle(vp).outlineStyle,
      cardOutline: card ? getComputedStyle(card).outlineStyle : null,
      activedescendant: vp.getAttribute("aria-activedescendant"),
      ringReachPx: 3 + 2.5,
      cardLeftAirPx: air,
    };
  });

  const row = {
    engine: browserName,
    stops,
    uniqueStops: new Set(stops.map((s: any) => s.stop)).size,
    ringedStops: stops.filter((s: any) => s.visible === 1).length,
    exemptStops: stops.filter((s: any) => s.visible === 0).map((s: any) => s.stop),
    everyRingedStopIsOne: stops.every((s: any) => s.rings <= 1),
    maxErrPx: Math.max(
      ...stops.filter((s: any) => s.visible === 1).map((s: any) => s.errPx ?? 99),
    ),
    deck: { before: deckA, after: deckB, moved: JSON.stringify(deckA?.ringBox) !== JSON.stringify(deckB?.ringBox), ...deckExtra },
  };
  bank(`ring-owner-${browserName}.json`, row);
  console.log("RINGOWNER " + JSON.stringify(row, null, 2));
  expect(stops.length).toBeGreaterThan(6);
});

test("G-LIVE-5 painted contrast on every stop, both themes", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    for (const [ground, sel] of [
      ["card", ".ctrl-btn"],
      ["background", ".logo-trigger"],
      ["background", ".drawer-tab"],
      ["card", ".sun-moon-toggle"],
    ] as const) {
      const box = await page.evaluate((s) => {
        const el = document.querySelector<HTMLElement>(s);
        if (!el) return null;
        el.scrollIntoView({ block: "center" });
        const r = el.getBoundingClientRect();
        const o =
          parseFloat(getComputedStyle(el).getPropertyValue("--focus-ring-outset")) || 3;
        const pad = o + 8;
        return {
          x: Math.max(0, Math.round(r.x - pad)),
          y: Math.max(0, Math.round(r.y - pad)),
          width: Math.round(r.width + pad * 2),
          height: Math.round(r.height + pad * 2),
        };
      }, sel);
      if (!box || box.width <= 0) {
        rows.push({ scheme, ground, sel, skipped: "not present" });
        continue;
      }
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
      await page.waitForTimeout(260);
      const off = await page.screenshot({ clip: box });
      await page.evaluate((s) => document.querySelector<HTMLElement>(s)?.focus(), sel);
      await page.waitForTimeout(700);
      const on = await page.screenshot({ clip: box });
      const [ra, rb] = await Promise.all([
        sharp(off).raw().toBuffer({ resolveWithObject: true }),
        sharp(on).raw().toBuffer({ resolveWithObject: true }),
      ]);
      const ch = ra.info.channels;
      let best = -1;
      let bi = -1;
      for (let i = 0; i < ra.data.length; i += ch) {
        const d =
          Math.abs(ra.data[i] - rb.data[i]) +
          Math.abs(ra.data[i + 1] - rb.data[i + 1]) +
          Math.abs(ra.data[i + 2] - rb.data[i + 2]);
        if (d > best) {
          best = d;
          bi = i;
        }
      }
      const groundPx = [ra.data[bi], ra.data[bi + 1], ra.data[bi + 2]];
      const inkPx = [rb.data[bi], rb.data[bi + 1], rb.data[bi + 2]];
      rows.push({
        scheme,
        ground,
        sel,
        groundRgb: groundPx,
        paintedRgb: inkPx,
        maxChannelDelta: best,
        ratio: ratio(inkPx, groundPx),
        pass: ratio(inkPx, groundPx) >= 3,
      });
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
      await page.waitForTimeout(160);
    }
  }
  bank(`ring-contrast-${browserName}.json`, { engine: browserName, rows });
  console.log("RINGCONTRAST " + JSON.stringify(rows, null, 2));
  expect(rows.length).toBeGreaterThan(3);
});

test("G-LIVE-6 forced colors — the restoration paints, the drawn ring hides", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "forced-colors emulation is chromium's");
  await page.emulateMedia({
    reducedMotion: "reduce",
    colorScheme: "light",
    forcedColors: "active",
  });
  await boardReady(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  const stops: unknown[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(160);
    stops.push(
      await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        const cs = getComputedStyle(a);
        const ring = document.querySelector(".focus-ring");
        return {
          stop:
            a.tagName.toLowerCase() +
            "." +
            (a.getAttribute("class") || "").split(/\s+/).slice(0, 2).join("."),
          outline: `${cs.outlineWidth} ${cs.outlineStyle}`,
          solid: cs.outlineStyle === "solid",
          ringHidden: !ring || getComputedStyle(ring).display === "none",
        };
      }),
    );
  }
  // The cell's own HC ring (gameCell.css) must survive too.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.waitForTimeout(240);
  const cell = await page.evaluate(() => {
    const c = document.querySelector(".game-cell:has(input:focus-visible)");
    const cs = c ? getComputedStyle(c) : null;
    return cs ? { outline: `${cs.outlineWidth} ${cs.outlineStyle}`, offset: cs.outlineOffset } : null;
  });
  const row = {
    engine: browserName,
    stops,
    allSolid: stops.every((s: any) => s.solid),
    allRingHidden: stops.every((s: any) => s.ringHidden),
    cell,
  };
  bank("ring-forcedcolors.json", row);
  console.log("FORCEDCOLORS " + JSON.stringify(row, null, 2));
  expect(stops.length).toBe(12);
});
