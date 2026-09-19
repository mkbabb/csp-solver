/**
 * T9-W7 pass 2 · MRK-LIVE PROTOTYPE — the mobile stops, the armed band, and the four crops.
 *
 * The desktop walk (`p2proto.probe.ts`) cannot reach `.drawer-tab` (display: none at 1280) or
 * the armed ribbon's own frame, so both are measured here where they exist.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const FRAMES = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

/** The ring's painted band against the host's drawn frame, both outward from the button box. */
const bandOf = ([sel, frameOutset, frameStroke]: readonly [string, number, number]) => {
  const btn = document.querySelector<HTMLElement>(sel);
  if (!btn) return { sel, absent: true };
  const o =
    parseFloat(getComputedStyle(btn).getPropertyValue("--focus-ring-outset")) || 3;
  const b = btn.getBoundingClientRect();
  const ring = document.querySelector<SVGElement>(".focus-ring");
  const rb = ring?.getBoundingClientRect();
  const frameBand = [frameOutset - frameStroke / 2, frameOutset + frameStroke / 2];
  const ringBand = [o - 1.25, o + 1.25];
  return {
    sel,
    outset: o,
    frameBand,
    ringBand,
    gapPx: Math.round((ringBand[0] - frameBand[1]) * 100) / 100,
    box: { w: Math.round(b.width), h: Math.round(b.height) },
    ringOnIt:
      rb && b
        ? Math.round(
            Math.max(Math.abs(rb.left + o - b.left), Math.abs(rb.top + o - b.top)) * 100,
          ) / 100
        : null,
    rings: document.querySelectorAll(".focus-ring").length,
    zRing: ring ? getComputedStyle(ring).zIndex : null,
  };
};

// ── M · the mobile stops: the tongue, the dock sheet's clipper, the bottom bar ───────────
test("M · mobile stops at 393x699", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page);
  const shut = await page.evaluate(() => {
    const tab = document.querySelector<HTMLElement>(".drawer-tab");
    tab?.focus();
    return {
      present: !!tab,
      display: tab ? getComputedStyle(tab).display : null,
      fv: tab?.matches(":focus-visible") ?? null,
    };
  });
  await page.waitForTimeout(800);
  const tongue = await page.evaluate(bandOf, [".drawer-tab", 3, 2.5] as const);
  // Open the dock. The sheet SLIDES — settle before measuring.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.click(),
  );
  await page.waitForTimeout(1100);
  const open = await page.evaluate(() => {
    const card = document.querySelector<HTMLElement>(".controls-card");
    const chips = Array.from(document.querySelectorAll<HTMLElement>(".ctrl-btn"));
    const inBar = chips.filter((c) => c.offsetParent);
    inBar[0]?.focus();
    return {
      card: !!card,
      cardOverflow: card ? getComputedStyle(card).overflow : null,
      chips: inBar.length,
    };
  });
  await page.waitForTimeout(800);
  const chipStop = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    const card = document.querySelector<HTMLElement>(".controls-card");
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!a || !card) return null;
    const ab = a.getBoundingClientRect();
    const cb = card.getBoundingClientRect();
    const rb = ring?.getBoundingClientRect();
    const o = parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
    const reach = o + 1.25;
    const clearance = Math.min(
      ab.left - cb.left,
      cb.right - ab.right,
      ab.top - cb.top,
      cb.bottom - ab.bottom,
    );
    return {
      active: a.className.toString().slice(0, 48),
      rings: document.querySelectorAll(".focus-ring").length,
      reachPx: reach,
      clipperClearancePx: Math.round(clearance * 100) / 100,
      whole: clearance >= reach,
      zRing: ring ? getComputedStyle(ring).zIndex : null,
      errPx:
        rb && ab
          ? Math.round(
              Math.max(Math.abs(rb.left + o - ab.left), Math.abs(rb.top + o - ab.top)) *
                100,
            ) / 100
          : null,
    };
  });
  const bar = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(".mobile-action-bar, .bottom-tab, nav");
    return el ? { cls: el.className.toString().slice(0, 40), z: getComputedStyle(el).zIndex } : null;
  });
  bank(`M-mobile-${browserName}.json`, {
    engine: browserName,
    shut,
    tongue,
    open,
    chipStop,
    bar,
  });
  console.log("M " + JSON.stringify({ tongue, chipStop, bar }));
  expect(shut.present).toBe(true);
});

// ── P · the dock sheet's clipper, measured over EVERY control it holds ───────────────────
test("P · the tightest control in the open sheet", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.click(),
  );
  // THE SHEET SLIDES. Settle before measuring anything about where it is.
  await page.waitForTimeout(1100);
  const rows = await page.evaluate(() => {
    const card = document.querySelector<HTMLElement>(".controls-card");
    if (!card) return null;
    const cb = card.getBoundingClientRect();
    const focusables = Array.from(
      card.querySelectorAll<HTMLElement>(
        "button, a[href], input, select, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((el) => el.offsetParent && el.getBoundingClientRect().width > 0);
    return {
      cardOverflow: getComputedStyle(card).overflow,
      n: focusables.length,
      rows: focusables.map((el) => {
        const b = el.getBoundingClientRect();
        const o =
          parseFloat(getComputedStyle(el).getPropertyValue("--focus-ring-outset")) || 3;
        const clearance = Math.min(
          b.left - cb.left,
          cb.right - b.right,
          b.top - cb.top,
          cb.bottom - b.bottom,
        );
        return {
          cls: el.className.toString().slice(0, 34),
          reachPx: o + 1.25,
          clearancePx: Math.round(clearance * 100) / 100,
          whole: clearance >= o + 1.25,
        };
      }),
    };
  });
  const ordinary = (rows?.rows ?? []).filter((r) => !/icon-btn/.test(r.cls));
  const sticky = (rows?.rows ?? []).filter((r) => /icon-btn/.test(r.cls));
  const tightest = ordinary.length
    ? ordinary.reduce((a, b) => (b.clearancePx < a.clearancePx ? b : a))
    : null;
  bank(`P-clipper-${browserName}.json`, {
    engine: browserName,
    ...rows,
    tightestOrdinary: tightest,
    stickyOverrun: sticky,
  });
  console.log("P " + JSON.stringify({ tightest, sticky, n: rows?.n }));
  expect(rows?.n ?? 0).toBeGreaterThan(0);
});

// ── N · the armed ribbon's own band (the verb's frame, at the stop that exists only armed) ─
test("N · armed guard band + the U-10 frame", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
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
  // Watch the destructive verb's poses THROUGH the arming — the revolution is 500ms long, so
  // the sampler starts at the click, not after it.
  const armed = await page.evaluate(async () => {
    const btn = Array.from(document.querySelectorAll<HTMLElement>(".staging-btn")).find(
      (b) => /deal|new/i.test(b.textContent ?? ""),
    );
    const steps: { t: number; keep: number; leave: number }[] = [];
    const t0 = performance.now();
    btn?.click();
    const at = (sel: string) => {
      const gs = Array.from(document.querySelectorAll(`${sel} .boil-pose`));
      return gs.findIndex((g) => g.classList.contains("is-active"));
    };
    for (let i = 0; i < 90; i++) {
      const k = at(".guard-keep");
      const l = at(".guard-leave");
      const last = steps[steps.length - 1];
      if (!last || last.keep !== k || last.leave !== l)
        steps.push({ t: Math.round(performance.now() - t0), keep: k, leave: l });
      await new Promise((r) => setTimeout(r, 20));
    }
    (window as unknown as { __steps: unknown }).__steps = steps;
    const leave = document.querySelector<HTMLElement>(".guard-leave");
    const keep = document.querySelector<HTMLElement>(".guard-keep");
    // The pose stack is `<g class="boil-pose">`, one per frame; `.is-active` carries the
    // opacity and a PRUNED instance `v-show`s only its own frame (display: none elsewhere).
    const poses = (el: Element | null) =>
      el
        ? Array.from(el.querySelectorAll(".boil-pose")).map((g) => ({
            active: g.classList.contains("is-active"),
            opacity: getComputedStyle(g).opacity,
            display: getComputedStyle(g).display,
          }))
        : null;
    return {
      keepPoses: poses(keep),
      leavePoses: poses(leave),
      activeIsKeep: document.activeElement === keep,
      steps,
    };
  });
  const revolution = armed.steps;
  const band = await page.evaluate(bandOf, [".guard-keep", 2, 2] as const);
  const bandLeave = await page.evaluate(() => {
    document.querySelector<HTMLElement>(".guard-leave")?.focus();
    return null;
  });
  await page.waitForTimeout(700);
  const leaveBand = await page.evaluate(bandOf, [".guard-leave", 2, 2.5] as const);
  bank(`N-armed-${browserName}.json`, {
    engine: browserName,
    armed,
    revolution,
    band,
    bandLeave,
    leaveBand,
  });
  console.log("N " + JSON.stringify({ armed, revolution, band, leaveBand }));
  expect(band).toBeTruthy();
});

// ── L · the landing burst under a REAL key press (the deck glides 352px under the ring) ──
test("L · the landing burst, real ArrowRight", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.waitForTimeout(900);
  const before = await page.evaluate(() => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    (window as unknown as { __w: number[] }).__w = [];
    (window as unknown as { __t0: number }).__t0 = performance.now();
    const mo = new MutationObserver((m) => {
      for (let i = 0; i < m.length; i++)
        (window as unknown as { __w: number[] }).__w.push(
          Math.round(performance.now() - (window as unknown as { __t0: number }).__t0),
        );
    });
    if (ring) mo.observe(ring, { attributes: true });
    (window as unknown as { __mo: MutationObserver }).__mo = mo;
    const card = document.querySelector<HTMLElement>(".game-card.is-center");
    return { left: card?.getBoundingClientRect().left ?? null, ring: !!ring };
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1800);
  const after = await page.evaluate(() => {
    (window as unknown as { __mo: MutationObserver }).__mo.disconnect();
    const w = (window as unknown as { __w: number[] }).__w;
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const card = document.querySelector<HTMLElement>(".game-card.is-center");
    const rb = ring?.getBoundingClientRect();
    const cb = card?.getBoundingClientRect();
    return {
      writes: w.length,
      firstWriteMs: w[0] ?? null,
      lastWriteMs: w.length ? w[w.length - 1] : null,
      cardLeft: cb?.left ?? null,
      landedErrPx:
        rb && cb
          ? Math.round(
              Math.max(Math.abs(rb.left + 3 - cb.left), Math.abs(rb.top + 3 - cb.top)) *
                100,
            ) / 100
          : null,
    };
  });
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
  const travelled =
    before.left != null && after.cardLeft != null
      ? Math.round(Math.abs(after.cardLeft - before.left) * 100) / 100
      : null;
  bank(`L-landing-${browserName}.json`, {
    engine: browserName,
    before,
    after,
    travelledPx: travelled,
    idleWrites: idle,
  });
  console.log("L " + JSON.stringify({ ...after, travelled, idle }));
  expect(after.writes).toBeGreaterThan(0);
});

// ── CROPS (≤4, ≤150KB, dpr3) ─────────────────────────────────────────────────────────────
test.describe("crops at dpr3", () => {
  test.use({ deviceScaleFactor: 3 });
  test("crop 1 · the living cell at pose 2 beside a conflict and a peer cursor", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "crop 1 is the chromium light frame");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const clip = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const idx = 40;
    inputs[idx]?.focus();
    cells[idx + 1]?.classList.add("is-invalid");
    cells[idx - 1]?.classList.add("is-peer-cursor");
    const grid = document.querySelector("[data-mark-pose]");
    grid?.setAttribute("data-mark-pose", "2");
    const a = cells[idx - 1]!.getBoundingClientRect();
    const b = cells[idx + 1]!.getBoundingClientRect();
    return {
      x: Math.round(a.x - 10),
      y: Math.round(a.y - 10),
      width: Math.round(b.right - a.left + 20),
      height: Math.round(a.height + 20),
    };
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    clip,
    path: join(FRAMES, "1-living-pose2-conflict-peer-light-chromium.png"),
    scale: "device",
  });
  expect(clip.width).toBeGreaterThan(0);
});

test("crop 2 · the staging verb focused, ring outside its drawn frame", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "crop 2 is the webkit dark frame");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  const clip = await page.evaluate(() => {
    const btn = document.querySelector<HTMLElement>(".staging-btn");
    btn?.focus();
    const b = btn!.getBoundingClientRect();
    return {
      x: Math.round(b.x - 16),
      y: Math.round(b.y - 16),
      width: Math.round(b.width + 32),
      height: Math.round(b.height + 32),
    };
  });
  await page.waitForTimeout(900);
  await page.screenshot({
    clip,
    path: join(FRAMES, "2-staging-ring-outset55-dark-webkit.png"),
    scale: "device",
  });
  expect(clip.width).toBeGreaterThan(0);
});

test("crop 3 · the armed ribbon, ring on keep, leave at pose 2 (U-10)", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "crop 3 is the chromium light frame");
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
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
  await page.evaluate(() => {
    Array.from(document.querySelectorAll<HTMLElement>(".staging-btn"))
      .find((b) => /deal|new/i.test(b.textContent ?? ""))
      ?.click();
  });
  await page.waitForTimeout(1500);
  // Pin the destructive verb at pose 2 (the poses are siblings; one rule names which paints).
  const clip = await page.evaluate(() => {
    // Pin the destructive verb at pose 2 by naming which sibling is active — the same class
    // the beat toggles, on the same nodes, so no geometry is touched by the pinning.
    const gs = Array.from(
      document.querySelectorAll<SVGGElement>(".guard-leave .boil-pose"),
    );
    gs.forEach((g, i) => g.classList.toggle("is-active", i === 2));
    const g = document.querySelector<HTMLElement>(".guard-note");
    const b = g!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(b.x - 14)),
      y: Math.max(0, Math.round(b.y - 14)),
      width: Math.round(b.width + 28),
      height: Math.round(b.height + 28),
    };
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    clip,
    path: join(FRAMES, "3-armed-ring-on-keep-leave-pose2-light-chromium.png"),
    scale: "device",
  });
  expect(clip.width).toBeGreaterThan(0);
  });
});

// Crop 4 rides dpr2, not dpr3: at dpr3 the sheet's own crop passes the 150 KB cap on its own,
// and this is the OPTIONAL frame. Named rather than silently shrunk.
test.describe("crop 4 at dpr2", () => {
  test.use({ deviceScaleFactor: 2 });
  test("crop 4 · the dock sheet open with a chip focused, 393x699", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "crop 4 is the webkit phone frame");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.click(),
  );
  await page.waitForTimeout(1100);
  const clip = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll<HTMLElement>(".ctrl-btn")).filter(
      (c) => c.offsetParent,
    );
    chips[0]?.focus();
    const card = document.querySelector<HTMLElement>(".controls-card");
    const b = card!.getBoundingClientRect();
    // The sheet runs past the fold at 699px tall; the crop is clamped to what is on screen.
    const x = Math.max(0, Math.round(b.x));
    const y = Math.max(0, Math.round(b.y));
    return {
      x,
      y,
      width: Math.min(Math.round(b.width), innerWidth - x),
      height: Math.min(240, innerHeight - y),
    };
  });
  await page.waitForTimeout(900);
  await page.screenshot({
    clip,
    path: join(FRAMES, "4-dock-open-chip-focused-393-webkit.png"),
    scale: "device",
  });
  expect(clip.width).toBeGreaterThan(0);
  });
});
