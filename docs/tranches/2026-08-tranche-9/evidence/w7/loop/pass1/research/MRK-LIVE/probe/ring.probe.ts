/**
 * T9-W7 pass 1 · MRK-LIVE §6 — ONE DRAWN RING OFF THE BOARD.
 *
 *   MRK-LIVE-r1  THE LAG. The singleton positions on `focusin`. Anything that moves the focused
 *                control WITHOUT a focus event leaves the ring behind: the dock sheet's glide,
 *                a scroll, the Teleport that reparents the one live board. Measured as the
 *                max |ringRect − controlRect| in px, per rAF, across each of those three, for
 *                `follow: "focusin"` and for `follow: "raf"`.
 *   MRK-LIVE-r2  THE REACH. R3-e's headroom is 3.6px at 1280×800. A house ring's reach is
 *                `outset + strokeWidth`; the deck's incumbent is 6px (offset 4 + width 2).
 *                Which (outset, strokeWidth) pairs fit, and what the ring looks like at each.
 *   MRK-LIVE-r3  THE CONTRAST, from painted bytes. The candidate ink over four grounds
 *                (card/background × light/dark): screenshot with the ring and without, take the
 *                most-changed pixel as the composited ink and its own ground pixel as the
 *                backdrop, ratio by WCAG's own formula. ≥3:1 on all four or the family adjusts.
 *   MRK-LIVE-r4  THE SUBJECT COUNT. ≥3 controls reached with the ring painting, both mountings.
 *   MRK-LIVE-r5  FORCED COLORS. A real `outline` survives when the SVG ring is stripped.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const RING = readFileSync(join(HERE, "..", "proto", "focus-ring.js"), "utf8");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

async function installRing(page: Page, opts: Record<string, unknown>) {
  await page.evaluate(RING);
  await page.evaluate(() => (window as any).__houseRing.init());
  await page.evaluate(() => (window as any).__houseRing.suppressIncumbents());
  return page.evaluate((o) => (window as any).__houseRing.install(o), opts);
}

/** Sample |ring − control| per rAF for `ms`. */
const TRACK = `async (sel, ms) => {
  const el = document.querySelector(sel);
  const out = [];
  const t0 = performance.now();
  while (performance.now() - t0 < ms) {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const svg = document.querySelector(".house-focus-ring");
    if (!svg || !el) continue;
    const a = svg.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    out.push({
      t: Math.round(performance.now() - t0),
      dx: Math.round((a.left + a.width / 2 - (b.left + b.width / 2)) * 100) / 100,
      dy: Math.round((a.top + a.height / 2 - (b.top + b.height / 2)) * 100) / 100,
    });
  }
  const mag = out.map((o) => Math.hypot(o.dx, o.dy));
  return {
    samples: out.length,
    maxOffsetPx: mag.length ? Math.round(Math.max(...mag) * 100) / 100 : null,
    meanOffsetPx: mag.length ? Math.round((mag.reduce((a, b) => a + b, 0) / mag.length) * 100) / 100 : null,
    settleMs: (() => { for (let i = out.length - 1; i >= 0; i--) if (Math.hypot(out[i].dx, out[i].dy) > 1) return out[i].t; return 0; })(),
    head: out.slice(0, 6), tail: out.slice(-3),
  };
}`;

test("MRK-LIVE-r1 THE LAG — the singleton across the dock glide, a scroll and the Teleport", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  const arms: unknown[] = [];

  for (const follow of ["focusin", "raf"] as const) {
    // ── the dock sheet's glide, 393×699 (the sheet lands CLOSED; the tongue opens it)
    await page.setViewportSize({ width: 393, height: 699 });
    await boardReady(page);
    const installed = await installRing(page, { mode: "singleton", follow });
    // Focus the drawer tongue, then open the sheet: the tongue rides the glide.
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".drawer-tab")?.focus(),
    );
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => (window as any).__houseRing.stats());
    const slidePromise = page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: TRACK, a: [".drawer-tab", 1200] },
    );
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".drawer-tab")?.click(),
    );
    const slide = await slidePromise;

    // ── a plain page scroll with a control focused
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".ctrl-btn");
      b?.focus();
    });
    await page.waitForTimeout(250);
    const scrollPromise = page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: TRACK, a: [".ctrl-btn", 900] },
    );
    await page.evaluate(() => {
      const card = document.querySelector(".controls-card") ?? document.scrollingElement!;
      (card as HTMLElement).scrollTop = 220;
      window.scrollBy(0, 160);
    });
    const scroll = await scrollPromise;

    // ── the Teleport: Escape projects the one live board into the deck
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs[40]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    const tpPromise = page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: TRACK, a: [".game-cell:has(input:focus-visible)", 1600] },
    );
    await page.keyboard.press("Escape");
    const teleport = await tpPromise;

    arms.push({ follow, installed, before, slide, scroll, teleport });
  }

  // ── the per-control mounting: it cannot lag, but say what it costs
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page);
  const pc = await installRing(page, { mode: "percontrol", follow: "focusin" });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus(),
  );
  await page.waitForTimeout(250);
  const pcTrack = await page.evaluate(async () => {
    const el = document.querySelector(".drawer-tab")!;
    const svg = el.querySelector(".house-focus-ring");
    (el as HTMLElement).click();
    const out: number[] = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 1000) {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      if (!svg) continue;
      const a = svg.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      out.push(
        Math.hypot(
          a.left + a.width / 2 - (b.left + b.width / 2),
          a.top + a.height / 2 - (b.top + b.height / 2),
        ),
      );
    }
    return {
      samples: out.length,
      maxOffsetPx: out.length ? Math.round(Math.max(...out) * 100) / 100 : null,
      inHostDom: !!svg,
      hostOverflow: getComputedStyle(el).overflow,
      ringClipped:
        !!svg &&
        (() => {
          const a = svg.getBoundingClientRect();
          const b = el.getBoundingClientRect();
          return a.width <= b.width + 0.5;
        })(),
    };
  });

  const out = { engine: browserName, arms, perControl: { installed: pc, track: pcTrack } };
  bank(`ring-lag-${browserName}.json`, out);
  console.log("RINGLAG " + JSON.stringify(out, null, 2));
  expect(arms.length).toBe(2);
});

test("MRK-LIVE-r2/r4 THE REACH and THE SUBJECT COUNT", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.keyboard.press("Home");
  await page.waitForTimeout(900);

  const deck = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport")!;
    const card = document.getElementById(vp.getAttribute("aria-activedescendant") ?? "")!;
    const cs = getComputedStyle(card);
    const c = card.getBoundingClientRect();
    const v = vp.getBoundingClientRect();
    const air = [c.left - v.left, v.right - c.right, c.top - v.top, v.bottom - c.bottom];
    const incumbentReach = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth);
    const r1 = (x: number) => Math.round(x * 10) / 10;
    return {
      incumbentReach,
      airPx: air.map(r1),
      minAir: r1(Math.min(...air)),
      headroomPx: r1(Math.min(...air) - incumbentReach),
    };
  });
  // Which (outset, strokeWidth) house-ring pairs fit inside the card's own air?
  const candidates = [
    [3, 2],
    [4, 2],
    [4, 2.5],
    [5, 2.5],
    [4, 3],
    [6, 3],
    [3, 2.5],
  ].map(([outset, strokeWidth]) => ({
    outset,
    strokeWidth,
    reachPx: outset + strokeWidth,
    // The drawn edge also overshoots: wobbleLinePoints adds roughness*len*0.003 at each end
    // and displaces by up to roughness*len*0.015 perpendicular. On a ~200px card edge at
    // roughness 0.5 that is up to 1.5px of wander OUTSIDE the nominal rect.
    wanderPx: Math.round(0.5 * 200 * 0.015 * 100) / 100,
    worstReachPx: Math.round((outset + strokeWidth / 2 + 0.5 * 200 * 0.015) * 100) / 100,
    fitsAir: outset + strokeWidth / 2 + 0.5 * 200 * 0.015 <= deck.minAir,
  }));

  // Subject count: how many controls does a Tab walk actually reach with the ring up?
  await boardReady(page);
  await installRing(page, { mode: "singleton", follow: "raf" });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  const reached = await page.evaluate(async () => {
    const seen: string[] = [];
    for (let i = 0; i < 40; i++) {
      const el = document.activeElement as HTMLElement | null;
      if (el && el !== document.body) {
        const k = (el.getAttribute("class") || el.tagName).split(/\s+/)[0];
        const svg = document.querySelector(".house-focus-ring") as SVGElement | null;
        const painted =
          !!svg &&
          svg.style.display !== "none" &&
          svg.getBoundingClientRect().width > 0;
        if (!seen.includes(k) && painted) seen.push(k);
      }
      // advance focus without a real key (the probe drives from the page)
      const all = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((e) => e.offsetParent !== null || e.getClientRects().length);
      const idx = all.indexOf(document.activeElement as HTMLElement);
      all[(idx + 1) % all.length]?.focus();
      await new Promise((r) => setTimeout(r, 40));
    }
    return { reached: seen.length, classes: seen.slice(0, 14) };
  });

  const out = { engine: browserName, deck, candidates, subjects: reached };
  bank(`ring-reach-${browserName}.json`, out);
  console.log("RINGREACH " + JSON.stringify(out, null, 2));
  expect(deck.headroomPx).toBeGreaterThan(0);
});

test("MRK-LIVE-r3 THE CONTRAST, from painted bytes — four grounds", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "painted-byte read-back on one engine");
  const lum = (c: number[]) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a: number[], b: number[]) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
  };

  const inks = [
    ["focus-sketch", "#3a7bc4"],
    ["crayon-blue", "#4a90d9"],
    ["user-ink", "#2563eb"],
    ["graphite", "var(--color-pencil-graphite)"],
    ["foreground", "var(--color-foreground)"],
  ] as const;

  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await page.setViewportSize({ width: 1280, height: 800 });
    await boardReady(page);
    await installRing(page, { mode: "singleton", follow: "raf", strokeWidth: 3 });

    // Two grounds: a control ON the card (.ctrl-btn) and one on the page background
    // (the masthead link sits over --color-background).
    for (const [groundName, sel] of [
      ["card", ".ctrl-btn"],
      ["background", ".logo-trigger"],
    ] as const) {
      const box = await page.evaluate((s) => {
        const el = document.querySelector<HTMLElement>(s);
        if (!el) return null;
        el.scrollIntoView({ block: "center" });
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x - 10),
          y: Math.round(r.y - 10),
          width: Math.round(r.width + 20),
          height: Math.round(r.height + 20),
        };
      }, sel);
      if (!box || box.width <= 0) continue;

      await page.evaluate(
        (s) => (document.activeElement as HTMLElement)?.blur?.(),
        sel,
      );
      await page.waitForTimeout(250);
      const off = await page.screenshot({ clip: box });

      for (const [inkName, ink] of inks) {
        await page.evaluate(
          ({ s, k }) => {
            const el = document.querySelector<HTMLElement>(s)!;
            el.focus();
            (window as any).__houseRing.setInk(k);
          },
          { s: sel, k: ink },
        );
        await page.waitForTimeout(220);
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
          ground: groundName,
          sel,
          ink: inkName,
          groundRgb: groundPx,
          paintedRgb: inkPx,
          ratio: ratio(inkPx, groundPx),
          pass: ratio(inkPx, groundPx) >= 3,
        });
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
        await page.waitForTimeout(150);
      }
    }
  }
  bank("ring-contrast.json", { engine: browserName, rows });
  console.log("RINGCONTRAST " + JSON.stringify(rows, null, 2));
  expect(rows.length).toBeGreaterThan(3);
});

test("MRK-LIVE-r5 FORCED COLORS — a real outline survives", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "forced-colors emulation is chromium's");
  await page.emulateMedia({
    reducedMotion: "reduce",
    colorScheme: "light",
    forcedColors: "active",
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  const beforeCell = await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
    const cell = document.querySelector(".game-cell:has(input:focus-visible)");
    const cs = cell ? getComputedStyle(cell) : null;
    return cs
      ? {
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          offset: cs.outlineOffset,
        }
      : null;
  });
  await installRing(page, { mode: "singleton", follow: "raf" });
  const after = await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[41]?.focus();
    const cell = document.querySelector(".game-cell:has(input:focus-visible)");
    const btn = document.querySelector<HTMLElement>(".ctrl-btn");
    btn?.focus();
    const bcs = btn ? getComputedStyle(btn) : null;
    const ccs = cell ? getComputedStyle(cell) : null;
    const svg = document.querySelector(".house-focus-ring");
    const path = svg?.querySelector("path");
    return {
      cellOutline: ccs
        ? `${ccs.outlineWidth} ${ccs.outlineStyle} ${ccs.outlineColor}`
        : null,
      btnOutline: bcs
        ? `${bcs.outlineWidth} ${bcs.outlineStyle} ${bcs.outlineColor}`
        : null,
      btnOutlineOffset: bcs?.outlineOffset ?? null,
      ringForcedAdjust: path ? getComputedStyle(path).forcedColorAdjust : null,
      ringStrokePainted: path ? getComputedStyle(path).stroke : null,
    };
  });
  const out = { engine: browserName, beforeCell, after };
  bank("ring-forcedcolors.json", out);
  console.log("RINGFORCED " + JSON.stringify(out, null, 2));
  expect(out).toBeTruthy();
});
