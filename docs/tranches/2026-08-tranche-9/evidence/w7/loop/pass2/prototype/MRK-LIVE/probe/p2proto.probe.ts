/**
 * T9-W7 pass 2 · MRK-LIVE PROTOTYPE — the gates, measured on the pass-2 build.
 *
 * Worktree `wf_8630d340-e56-36` (uncommitted), served on 127.0.0.1:4238. Nothing here injects
 * a cure: every number is the shipped build's own behaviour, both engines.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

async function galleryReady(page: Page) {
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
}

async function focusCell(page: Page, idx = 40) {
  await page.evaluate((i) => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[i]?.focus();
  }, idx);
  await page.waitForTimeout(900);
}

/** sRGB relative luminance → WCAG contrast ratio. */
const lum = (c: readonly number[]) => {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a: readonly number[], b: readonly number[]) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
/** CIE L* of an sRGB triple (the laminate's ground reading). */
const lstar = (c: readonly number[]) => {
  const y = lum(c);
  const l = y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
  return Math.round(l * 100) / 100;
};

function readTiers(poses: number[]) {
  const grid = document.querySelector("[data-mark-pose]");
  if (!grid) return [{ error: "no [data-mark-pose] on the page" }];
  const cells = Array.from(document.querySelectorAll(".game-cell"));
  const inputs = Array.from(document.querySelectorAll(".game-cell input"));
  const focusedIdx = inputs.findIndex((i) => i === document.activeElement);
  const others = cells.filter((_, i) => i !== focusedIdx);
  const conflict = others[0];
  const peer = others[1];
  const hover = others[2];
  conflict.classList.add("is-invalid");
  peer.classList.add("is-peer-cursor");
  hover.querySelector(".cell-ghost")?.classList.add("is-active");
  const paths = (el: Element) => Array.from(el.querySelectorAll(".cell-ghost-path"));
  const op = (el: Element | null) => (el ? getComputedStyle(el).opacity : null);
  const rows: unknown[] = [];
  for (const p of poses) {
    grid.setAttribute("data-mark-pose", String(p));
    const living = cells[focusedIdx];
    const one = (el: Element) => ({
      path: op(paths(el)[0]),
      stroke: getComputedStyle(paths(el)[0]).stroke,
    });
    rows.push({
      pose: String(p),
      livingPaths: paths(living).map(op),
      conflict: one(conflict),
      peer: one(peer),
      hover: one(hover),
    });
  }
  grid.setAttribute("data-mark-pose", "0");
  return rows;
}

// ── A · G-LIVE-8 · the living mark turns off nothing else ────────────────────────────────
test("A · G-LIVE-8 cascade reach at four poses", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await focusCell(page);
  const rows = (await page.evaluate(readTiers, [0, 1, 2, 3])) as Array<{
    pose: string;
    livingPaths: string[];
    conflict: { path: string };
    peer: { path: string };
    hover: { path: string };
  }>;
  const stillAllOne = rows.every(
    (r) => r.conflict.path === "1" && r.peer.path === "1" && r.hover.path === "1",
  );
  const livingSeq = rows.map((r) => r.livingPaths.join(","));
  bank(`A-cascade-${browserName}.json`, {
    engine: browserName,
    rows,
    stillAllOne,
    livingSeq,
  });
  console.log("A " + JSON.stringify({ stillAllOne, livingSeq }));
  expect(stillAllOne).toBe(true);
});

// ── B · G-LIVE-2 · one revolution, exact (+ the PRM arm) ─────────────────────────────────
test("B · G-LIVE-2 settle timeline", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const live = await page.evaluate(async () => {
    const grid = document.querySelector<HTMLElement>("[data-mark-pose]")!;
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const swaps: { t: number; pose: string | null }[] = [];
    let t0 = 0;
    const mo = new MutationObserver(() =>
      swaps.push({
        t: Math.round(performance.now() - t0),
        pose: grid.getAttribute("data-mark-pose"),
      }),
    );
    mo.observe(grid, { attributes: true, attributeFilter: ["data-mark-pose"] });
    t0 = performance.now();
    inputs[40]?.focus();
    await new Promise((r) => setTimeout(r, 3800));
    mo.disconnect();
    return {
      swaps,
      sequence: swaps.map((s) => s.pose).join(","),
      first: swaps[0]?.t ?? null,
      last: swaps[swaps.length - 1]?.t ?? null,
      after800: swaps.filter((s) => s.t > 800).length,
      final: grid.getAttribute("data-mark-pose"),
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await boardReady(page);
  const prm = await page.evaluate(async () => {
    const grid = document.querySelector<HTMLElement>("[data-mark-pose]")!;
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    let n = 0;
    const mo = new MutationObserver(() => n++);
    mo.observe(grid, { attributes: true, attributeFilter: ["data-mark-pose"] });
    inputs[40]?.focus();
    await new Promise((r) => setTimeout(r, 2000));
    mo.disconnect();
    return { swaps: n, final: grid.getAttribute("data-mark-pose") };
  });
  bank(`B-settle-${browserName}.json`, { engine: browserName, live, prm });
  console.log("B " + JSON.stringify({ live: { ...live, swaps: undefined }, prm }));
  expect(live.swaps.length).toBe(4);
});

// ── C · G-LIVE-5 · the board stop's painted ring at 0.95, both themes ────────────────────
test("C · G-LIVE-5 board ring painted bytes", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const pick = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const idx = inputs.findIndex((i) => !i.value);
      const cell = inputs[idx]?.closest(".game-cell") as HTMLElement | null;
      if (!cell) return null;
      const r = cell.getBoundingClientRect();
      return {
        idx,
        clip: {
          x: Math.max(0, Math.round(r.x - 6)),
          y: Math.max(0, Math.round(r.y - 6)),
          width: Math.round(r.width + 12),
          height: Math.round(r.height + 12),
        },
      };
    });
    if (!pick) {
      rows.push({ scheme, skipped: "no empty cell" });
      continue;
    }
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.waitForTimeout(300);
    const off = await page.screenshot({ clip: pick.clip });
    await focusCell(page, pick.idx);
    await page.waitForTimeout(1200);
    const on = await page.screenshot({ clip: pick.clip });
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
    const cx = Math.floor(ra.info.width / 2);
    const cy = Math.floor(ra.info.height / 2);
    const ci = (cy * ra.info.width + cx) * ch;
    const rgb = (buf: Buffer, i: number) => [buf[i], buf[i + 1], buf[i + 2]] as const;
    const ringPx = rgb(rb.data as Buffer, bi);
    const groundAtRing = rgb(ra.data as Buffer, bi);
    const interiorFocused = rgb(rb.data as Buffer, ci);
    rows.push({
      scheme,
      cellIdx: pick.idx,
      ringPx,
      groundAtRing,
      interiorFocused,
      ringVsCell: ratio(ringPx, groundAtRing),
      ringVsOwnFill: ratio(ringPx, interiorFocused),
    });
  }
  bank(`C-boardring-${browserName}.json`, { engine: browserName, rows });
  console.log("C " + JSON.stringify(rows));
  expect(rows.length).toBe(2);
});

// ── D · G-LIVE-3 · one ring owner, clearance, and the band disjointness ──────────────────
const STOP_SELECTORS = [
  "button.logo-trigger",
  ".sun-moon-toggle",
  ".drawer-tab",
  ".staging-btn",
  ".guard-btn",
];

test("D · G-LIVE-3 stop walk + ring/frame bands", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  const stops: unknown[] = [];
  const read = async (label: string) => {
    await page.waitForTimeout(700);
    stops.push({
      label,
      ...(await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        const ring = document.querySelector<SVGElement>(".focus-ring");
        const rb = ring?.getBoundingClientRect();
        const ab = a?.getBoundingClientRect();
        const o = a
          ? parseFloat(
              getComputedStyle(a).getPropertyValue("--focus-ring-outset"),
            ) || 3
          : 3;
        return {
          active: a?.className?.toString().slice(0, 60) ?? null,
          matchesFV: a?.matches(":focus-visible") ?? null,
          outline: a ? getComputedStyle(a).outlineStyle : null,
          rings: document.querySelectorAll(".focus-ring").length,
          outset: o,
          errPx:
            rb && ab
              ? Math.round(
                  Math.max(
                    Math.abs(rb.left + o - ab.left),
                    Math.abs(rb.top + o - ab.top),
                  ) * 100,
                ) / 100
              : null,
        };
      })),
    });
  };
  // The keyboard walk itself, from the deck's scrollport.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await read("gallery-viewport (EXEMPT)");
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    await read(`tab+${i + 1}`);
  }
  // The named stops, plus the framed ones' band geometry.
  const bands: unknown[] = [];
  for (const sel of [".staging-btn", ".guard-btn", ".drawer-tab"]) {
    const n = await page.evaluate((s) => document.querySelectorAll(s).length, sel);
    if (!n) {
      bands.push({ sel, absent: true });
      continue;
    }
    await page.evaluate((s) => document.querySelector<HTMLElement>(s)?.focus(), sel);
    await read(`${sel} (named)`);
    bands.push(
      await page.evaluate((s) => {
        const btn = document.querySelector<HTMLElement>(s)!;
        const face = btn.querySelector<HTMLElement>("svg, .staging-face, .guard-face");
        const b = btn.getBoundingClientRect();
        const ring = document.querySelector<SVGElement>(".focus-ring");
        const o =
          parseFloat(getComputedStyle(btn).getPropertyValue("--focus-ring-outset")) ||
          3;
        const frameOutset = s === ".drawer-tab" ? 3 : 2;
        const frameStroke = s === ".guard-btn" ? 2 : s === ".drawer-tab" ? 2.5 : 2;
        // Frame band, outward from the button box: [outset - stroke/2, outset + stroke/2].
        const frameBand = [
          frameOutset - frameStroke / 2,
          frameOutset + frameStroke / 2,
        ];
        const ringBand = [o - 2.5 / 2, o + 2.5 / 2];
        return {
          sel: s,
          outset: o,
          frameBand,
          ringBand,
          gapPx: Math.round((ringBand[0] - frameBand[1]) * 100) / 100,
          hasRing: !!ring,
          hasFace: !!face,
          box: { w: Math.round(b.width), h: Math.round(b.height) },
        };
      }, sel),
    );
  }
  bank(`D-stops-${browserName}.json`, { engine: browserName, stops, bands });
  console.log("D " + JSON.stringify({ bands }));
  expect(stops.length).toBeGreaterThan(9);
});

// ── E · G-LIVE-9 · no stop is unmarked ───────────────────────────────────────────────────
test("E · G-LIVE-9 deck fallback", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  const stripped = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    (document.activeElement as HTMLElement)?.blur?.();
    vp?.removeAttribute("aria-activedescendant");
    vp?.focus();
    return { matchesFV: vp?.matches(":focus-visible") ?? null };
  });
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const first = document.querySelector<HTMLElement>(
      '[role="option"], .game-card.is-center',
    );
    const rb = ring?.getBoundingClientRect();
    const fb = first?.getBoundingClientRect();
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      firstOptionId: first?.id ?? null,
      framesFirst:
        rb && fb
          ? Math.round(
              Math.max(Math.abs(rb.left + 3 - fb.left), Math.abs(rb.top + 3 - fb.top)) *
                100,
            ) / 100
          : null,
    };
  });
  bank(`E-fallback-${browserName}.json`, { engine: browserName, stripped, after });
  console.log("E " + JSON.stringify(after));
  expect(after.rings).toBe(1);
});

// ── F · G-LIVE-10 · the ring rings a verb ────────────────────────────────────────────────
test("F · G-LIVE-10 armed ribbon owner + area", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("1");
  await page.waitForTimeout(700);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  const armed = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll<HTMLElement>(".staging-btn")).find(
      (b) => /deal|new/i.test(b.textContent ?? ""),
    );
    btn?.click();
    return !!btn;
  });
  await page.waitForTimeout(1400);
  const row = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    const keep = document.querySelector<HTMLElement>(".guard-keep");
    const ribbon = document.querySelector<HTMLElement>(".gallery-guard");
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const area = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return Math.round(b.width * b.height);
    };
    return {
      active: a?.className?.toString() ?? null,
      isKeep: a === keep,
      keepArea: area(keep),
      ribbonArea: area(ribbon),
      ringArea: area(ring),
      rings: document.querySelectorAll(".focus-ring").length,
    };
  });
  bank(`F-armed-${browserName}.json`, { engine: browserName, armed, ...row });
  console.log("F " + JSON.stringify(row));
  expect(row.isKeep).toBe(true);
});

// ── G · G-LIVE-11 · the laminate yields ──────────────────────────────────────────────────
test("G · G-LIVE-11 laminate ground + rim", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    // Force the laminate on the cell we are about to select: `.cell-because` is a v-if on the
    // cell, and the hint route is a whole technique run. The CLASS is what the gate reads.
    const pick = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const idx = inputs.findIndex((i) => !i.value);
      const cell = inputs[idx]?.closest(".game-cell") as HTMLElement | null;
      if (!cell) return null;
      const lam = document.createElement("div");
      lam.className = "cell-because pointer-events-none absolute";
      // The scoped attribute is what makes the sheet's rules apply.
      for (const a of Array.from(cell.attributes))
        if (a.name.startsWith("data-v-")) lam.setAttribute(a.name, "");
      cell.append(lam);
      const r = cell.getBoundingClientRect();
      return {
        idx,
        clip: {
          x: Math.round(r.x + r.width * 0.3),
          y: Math.round(r.y + r.height * 0.3),
          width: Math.max(4, Math.round(r.width * 0.4)),
          height: Math.max(4, Math.round(r.height * 0.4)),
        },
      };
    });
    if (!pick) {
      rows.push({ scheme, skipped: "no empty cell" });
      continue;
    }
    await page.waitForTimeout(400);
    const laminateOnly = await page.screenshot({ clip: pick.clip });
    await focusCell(page, pick.idx);
    await page.waitForTimeout(1200);
    const selected = await page.screenshot({ clip: pick.clip });
    const computed = await page.evaluate(() => {
      const lam = document.querySelector<HTMLElement>(".cell-because");
      return lam
        ? {
            background: getComputedStyle(lam).backgroundColor,
            boxShadow: getComputedStyle(lam).boxShadow,
          }
        : null;
    });
    // A clean selected cell, for the ±0.5 L* comparison.
    const clean = await page.evaluate(() => {
      document.querySelector(".cell-because")?.remove();
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const idx = inputs.findIndex((i) => !i.value);
      return idx;
    });
    await focusCell(page, clean);
    await page.waitForTimeout(900);
    const cleanShot = await page.screenshot({ clip: pick.clip });
    const mid = async (b: Buffer) => {
      const r = await sharp(b).raw().toBuffer({ resolveWithObject: true });
      const ch = r.info.channels;
      const cx = Math.floor(r.info.width / 2);
      const cy = Math.floor(r.info.height / 2);
      const i = (cy * r.info.width + cx) * ch;
      return [r.data[i], r.data[i + 1], r.data[i + 2]] as const;
    };
    const [lamPx, selPx, cleanPx] = await Promise.all([
      mid(laminateOnly),
      mid(selected),
      mid(cleanShot),
    ]);
    rows.push({
      scheme,
      computed,
      laminateAloneL: lstar(lamPx),
      selectedBecauseL: lstar(selPx),
      cleanSelectedL: lstar(cleanPx),
      dL: Math.round((lstar(selPx) - lstar(cleanPx)) * 100) / 100,
    });
  }
  bank(`G-laminate-${browserName}.json`, { engine: browserName, rows });
  console.log("G " + JSON.stringify(rows));
  expect(rows.length).toBe(2);
});

// ── H · G-LIVE-4 · position bounded in time ──────────────────────────────────────────────
test("H · G-LIVE-4 position, burst, idle", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn")?.focus(),
  );
  await page.waitForTimeout(800);
  const err = async () =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      const ring = document.querySelector<SVGElement>(".focus-ring");
      if (!a || !ring) return null;
      const o =
        parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
      const rb = ring.getBoundingClientRect();
      const ab = a.getBoundingClientRect();
      return (
        Math.round(
          Math.max(Math.abs(rb.left + o - ab.left), Math.abs(rb.top + o - ab.top)) * 100,
        ) / 100
      );
    });
  const atRest = await err();
  await page.evaluate(() => window.scrollBy(0, 240));
  await page.waitForTimeout(400);
  const afterScroll = await err();
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(700);
  const afterResize = await err();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(700);
  // Idle writes: the ring's own style attribute, watched for 900ms with nothing happening.
  const idle = await page.evaluate(async () => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!ring) return null;
    let n = 0;
    const mo = new MutationObserver((m) => (n += m.length));
    mo.observe(ring, { attributes: true });
    await new Promise((r) => setTimeout(r, 900));
    mo.disconnect();
    return n;
  });
  // The landing burst: a deck step moves the card under the ring via a WAAPI transform.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.waitForTimeout(800);
  const landing = await page.evaluate(async () => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!ring) return null;
    const writes: number[] = [];
    const t0 = performance.now();
    const mo = new MutationObserver((m) => {
      for (let i = 0; i < m.length; i++) writes.push(Math.round(performance.now() - t0));
    });
    mo.observe(ring, { attributes: true });
    document.querySelector<HTMLElement>(".gallery-viewport")?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await new Promise((r) => setTimeout(r, 1800));
    mo.disconnect();
    const card = document.querySelector<HTMLElement>(".game-card.is-center");
    const rb = ring.getBoundingClientRect();
    const cb = card?.getBoundingClientRect();
    return {
      writes: writes.length,
      lastWriteMs: writes.length ? writes[writes.length - 1] : null,
      landedErrPx:
        cb && rb
          ? Math.round(
              Math.max(Math.abs(rb.left + 3 - cb.left), Math.abs(rb.top + 3 - cb.top)) *
                100,
            ) / 100
          : null,
    };
  });
  const row = { atRest, afterScroll, afterResize, idleWrites: idle, landing };
  bank(`H-position-${browserName}.json`, { engine: browserName, ...row });
  console.log("H " + JSON.stringify(row));
  expect(typeof atRest === "number").toBe(true);
});

// ── I · G-LIVE-12 · the seventh rule is gone (computed half) ─────────────────────────────
test("I · G-LIVE-12 focused cell computes clean", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await focusCell(page, 40);
  const row = await page.evaluate(() => {
    const cell = (document.activeElement as HTMLElement)?.closest(
      ".game-cell",
    ) as HTMLElement | null;
    if (!cell) return null;
    const cs = getComputedStyle(cell);
    return {
      cls: cell.className.toString().slice(0, 60),
      outlineStyle: cs.outlineStyle,
      background: cs.backgroundColor,
      borderRadius: cs.borderRadius,
    };
  });
  bank(`I-seventh-${browserName}.json`, { engine: browserName, ...row });
  console.log("I " + JSON.stringify(row));
  expect(row?.outlineStyle).toBe("none");
});

// ── J · G-LIVE-6 · forced colors, with its negative control ──────────────────────────────
test("J · G-LIVE-6 forced colors + negative control", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "WebKit does not emulate forced-colors");
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await galleryReady(page);
  const walk = async () => {
    const out: unknown[] = [];
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
    );
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);
      out.push(
        await page.evaluate(() => {
          const a = document.activeElement as HTMLElement | null;
          const cs = a ? getComputedStyle(a) : null;
          return {
            active: a?.className?.toString().slice(0, 48) ?? null,
            outlineStyle: cs?.outlineStyle ?? null,
            outlineWidth: cs?.outlineWidth ?? null,
            drawnRingDisplay: (() => {
              const r = document.querySelector<SVGElement>(".focus-ring");
              return r ? getComputedStyle(r).display : "absent";
            })(),
          };
        }),
      );
    }
    return out;
  };
  const restored = await walk();
  // THE NEGATIVE CONTROL: raise a (0,4,0) suppression and prove the arm CAN go to zero.
  await page.evaluate(() => {
    const s = document.createElement("style");
    s.id = "neg-control";
    s.textContent = `html body div button:focus-visible, html body div a:focus-visible, html body div *:focus-visible { outline-style: none }`;
    document.head.append(s);
  });
  const suppressed = await walk();
  bank(`J-forcedcolors-${browserName}.json`, {
    engine: browserName,
    restored,
    suppressed,
  });
  console.log(
    "J " +
      JSON.stringify({
        restoredSolid: restored.filter(
          (r) => (r as { outlineStyle: string }).outlineStyle === "solid",
        ).length,
        suppressedSolid: suppressed.filter(
          (r) => (r as { outlineStyle: string }).outlineStyle === "solid",
        ).length,
        n: restored.length,
      }),
  );
  expect(restored.length).toBe(8);
});
