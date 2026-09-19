/**
 * T9-W7 pass 2 · MRK-LIVE RESEARCH — the rows the charter opens, measured on the pass-1
 * prototype worktree (`wf_e58b4764-0fc-44`, uncommitted) served on 127.0.0.1:4238.
 *
 * READ-ONLY on product files. Every cure below is injected as a stylesheet at runtime, so what
 * is measured is the SELECTOR's behaviour in each engine, never an edit to the estate.
 *
 *  A · cascade reach at four poses, three still tiers + the living cell, AT HEAD and under the
 *      two candidate scopes (`:has` gate on the living cell; pose written on the cell).
 *  B · the four-ground x two-theme focus-ink table: grounds sampled from painted bytes, six
 *      candidate inks (the five families' rulings + `--ring-ink`) scored opaque and at 0.9.
 *  C · the BOARD stop's painted ring, both themes (G-LIVE-5's missing row).
 *  D · the deck fallback with `aria-activedescendant` removed.
 *  E · the two deleted rings (`.staging-face`, `.guard-face`) in a gallery + armed walk.
 *  F · the settle arithmetic: swap sequence, phase, window; and the PRM arm.
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

/** CURE A — re-scope the living swap to the cell that is actually living. Two blocks: the
 *  first neutralises the shipped rule at equal specificity + later source order, the second
 *  re-applies it gated behind the cell's own focus state at (0,5,1). */
const CURE_A = `
[data-mark-pose="1"] .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="2"] .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="3"] .cell-ghost-path.cell-ghost-path:nth-of-type(1) { opacity: 1 }
[data-mark-pose="1"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="2"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="3"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(1) { opacity: 0 }
[data-mark-pose="1"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(2),
[data-mark-pose="2"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(3),
[data-mark-pose="3"] .game-cell:has(input:focus-visible) .cell-ghost-path.cell-ghost-path:nth-of-type(4) { opacity: 1 }
`;

/** CURE B — the structural scope: the extra poses carry their own class, so the swap never
 *  needs to name pose 0 at all on a cell that has no extra poses. Emulated here by selecting
 *  a pose-0 path only when it HAS a later sibling (which only the living cell does). */
const CURE_B = `
[data-mark-pose="1"] .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="2"] .cell-ghost-path.cell-ghost-path:nth-of-type(1),
[data-mark-pose="3"] .cell-ghost-path.cell-ghost-path:nth-of-type(1) { opacity: 1 }
[data-mark-pose="1"] .cell-ghost-path.cell-ghost-path:nth-of-type(1):has(~ .cell-ghost-path),
[data-mark-pose="2"] .cell-ghost-path.cell-ghost-path:nth-of-type(1):has(~ .cell-ghost-path),
[data-mark-pose="3"] .cell-ghost-path.cell-ghost-path:nth-of-type(1):has(~ .cell-ghost-path) { opacity: 0 }
`;

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
      ghost: op(el.querySelector(".cell-ghost")),
      stroke: getComputedStyle(paths(el)[0]).stroke,
    });
    rows.push({
      pose: String(p),
      focusedIdx,
      livingPaths: paths(living).map(op),
      conflict: one(conflict),
      peer: one(peer),
      hover: one(hover),
    });
  }
  grid.setAttribute("data-mark-pose", "0");
  return rows;
}

/** The deck is not the entry route: the board boots, and the wordmark opens the gallery. */
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

test("A · cascade reach at four poses: HEAD, cure A, cure B", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await focusCell(page);
  const head = await page.evaluate(readTiers, [0, 1, 2, 3]);
  await page.evaluate((css) => {
    const s = document.createElement("style");
    s.id = "cure";
    s.textContent = css;
    document.head.append(s);
  }, CURE_A);
  const cureA = await page.evaluate(readTiers, [0, 1, 2, 3]);
  await page.evaluate((css) => {
    document.getElementById("cure")!.textContent = css;
  }, CURE_B);
  const cureB = await page.evaluate(readTiers, [0, 1, 2, 3]);
  const row = { engine: browserName, head, cureA, cureB };
  bank(`A-cascade-${browserName}.json`, row);
  console.log("A " + JSON.stringify(row, null, 1));
  expect(Array.isArray(head)).toBe(true);
});

/** The six candidate inks: the five families' pass-1 rulings plus the §10 control token. */
const INKS: Record<string, { light: string; dark: string }> = {
  "A MRK-LIVE one value": { light: "#3a7bc4", dark: "#3a7bc4" },
  "B MRK-ABS dark alias": { light: "#3a7bc4", dark: "#6aabeb" },
  "C ACC-FIVE dark arm": { light: "#3a7bc4", dark: "#6aabeb" },
  "D ACC-SIX blue-ink": { light: "#2f76bd", dark: "#6aabeb" },
  "E ACC-GRAPHITE (graphite)": { light: "#404040", dark: "#a3a3a3" },
  "F --ring-ink fg 50%": { light: "fg50", dark: "fg50" },
};

test("B · four grounds x two themes, six candidate inks", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const ground = await page.evaluate(() => {
      const px = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).backgroundColor : null;
      };
      const rootVar = (n: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      const probe = document.createElement("div");
      probe.style.color = "color-mix(in srgb, var(--color-foreground) 50%, transparent)";
      document.body.append(probe);
      const ringInk = getComputedStyle(probe).color;
      probe.remove();
      const cell = document.querySelector(".game-cell");
      return {
        body: getComputedStyle(document.body).backgroundColor,
        card: px(".controls-card") ?? px("[class*='card']"),
        cellBg: cell ? getComputedStyle(cell).backgroundColor : null,
        boardBg: px(".board-cells") ?? px("[role='grid']"),
        tokens: {
          background: rootVar("--color-background"),
          card: rootVar("--color-card"),
          foreground: rootVar("--color-foreground"),
          focusSketch: rootVar("--color-focus-sketch"),
          crayonBlue: rootVar("--color-crayon-blue"),
        },
        ringInk,
      };
    });
    rows.push({ scheme, ground });
  }
  const row = { engine: browserName, rows, inks: INKS };
  bank(`B-grounds-${browserName}.json`, row);
  console.log("B " + JSON.stringify(row, null, 1));
  expect(rows.length).toBe(2);
});

test("C · the board stop's painted ring, both themes", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    // An EMPTY cell, so the ring is sampled over the cell's own ground and not over a glyph.
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
    await page.waitForTimeout(900);
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
    // The interior: the centre pixel, which under focus carries the 0.08 fill.
    const cx = Math.floor(ra.info.width / 2);
    const cy = Math.floor(ra.info.height / 2);
    const ci = (cy * ra.info.width + cx) * ch;
    const rgb = (buf: Buffer, i: number) => [buf[i], buf[i + 1], buf[i + 2]] as const;
    rows.push({
      scheme,
      cellIdx: pick.idx,
      clip: pick.clip,
      ringPx: rgb(rb.data as Buffer, bi),
      groundAtRing: rgb(ra.data as Buffer, bi),
      interiorFocused: rgb(rb.data as Buffer, ci),
      interiorResting: rgb(ra.data as Buffer, ci),
      maxChannelDelta: best,
    });
  }
  const row = { engine: browserName, rows };
  bank(`C-boardring-${browserName}.json`, row);
  console.log("C " + JSON.stringify(row, null, 1));
  expect(rows.length).toBe(2);
});

test("D · the deck fallback with aria-activedescendant removed", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  const withAttr = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    vp?.focus();
    return {
      hasAttr: !!vp?.getAttribute("aria-activedescendant"),
      value: vp?.getAttribute("aria-activedescendant") ?? null,
      tabIndex: vp?.tabIndex ?? null,
      outline: vp ? getComputedStyle(vp).outlineStyle : null,
    };
  });
  await page.waitForTimeout(800);
  const ringWith = await page.evaluate(() => document.querySelectorAll(".focus-ring").length);
  const stripped = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    (document.activeElement as HTMLElement)?.blur?.();
    vp?.removeAttribute("aria-activedescendant");
    vp?.focus();
    return {
      matchesFocusVisible: vp?.matches(":focus-visible") ?? null,
      outlineStyle: vp ? getComputedStyle(vp).outlineStyle : null,
      outlineWidth: vp ? getComputedStyle(vp).outlineWidth : null,
    };
  });
  await page.waitForTimeout(900);
  const ringWithout = await page.evaluate(() => ({
    rings: document.querySelectorAll(".focus-ring").length,
    activeTag: document.activeElement?.className ?? null,
  }));
  const row = { engine: browserName, withAttr, ringWith, stripped, ringWithout };
  bank(`D-deckfallback-${browserName}.json`, row);
  console.log("D " + JSON.stringify(row, null, 1));
  expect(typeof ringWithout.rings).toBe("number");
});

test("E · the two deleted rings: staging + armed ribbon walk", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  const present = await page.evaluate(() => ({
    stagingBtns: document.querySelectorAll(".staging-btn").length,
    stagingFaces: document.querySelectorAll(".staging-face").length,
    guardBtns: document.querySelectorAll(".guard-btn").length,
    guardFaces: document.querySelectorAll(".guard-face").length,
    cards: document.querySelectorAll(".game-card").length,
  }));
  const stops: unknown[] = [];
  const readStop = async (label: string) =>
    stops.push({
      label,
      ...(await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        const ring = document.querySelector<SVGElement>(".focus-ring");
        const rb = ring?.getBoundingClientRect();
        const ab = a?.getBoundingClientRect();
        return {
          active: a?.className?.toString().slice(0, 60) ?? null,
          matchesFV: a?.matches(":focus-visible") ?? null,
          outline: a ? getComputedStyle(a).outlineStyle : null,
          rings: document.querySelectorAll(".focus-ring").length,
          errPx:
            rb && ab
              ? Math.round(
                  Math.max(
                    Math.abs(rb.left + 3 - ab.left),
                    Math.abs(rb.top + 3 - ab.top),
                  ) * 100,
                ) / 100
              : null,
        };
      })),
    });
  for (const sel of [".staging-btn", ".guard-btn"]) {
    const n = await page.evaluate((s) => document.querySelectorAll(s).length, sel);
    if (n > 0) {
      await page.evaluate(
        (s) => document.querySelector<HTMLElement>(s)?.focus(),
        sel,
      );
      await page.waitForTimeout(800);
      await readStop(sel);
    } else {
      stops.push({ label: sel, absent: true });
    }
  }
  // Arm the ribbon: the deck's destructive verb.
  const armed = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll<HTMLElement>(".staging-btn")).find(
      (b) => /deal|new/i.test(b.textContent ?? ""),
    );
    btn?.click();
    return !!btn;
  });
  await page.waitForTimeout(1000);
  const afterArm = await page.evaluate(() => ({
    guardBtns: document.querySelectorAll(".guard-btn").length,
    guardFaces: document.querySelectorAll(".guard-face").length,
    guard: !!document.querySelector(".gallery-guard"),
  }));
  if (afterArm.guardBtns > 0) {
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".guard-btn")?.focus(),
    );
    await page.waitForTimeout(800);
    await readStop(".guard-btn (armed)");
  }
  const row = { engine: browserName, present, armed, afterArm, stops };
  bank(`E-deletedrings-${browserName}.json`, row);
  console.log("E " + JSON.stringify(row, null, 1));
  expect(present.cards).toBeGreaterThan(0);
});

test("F · settle arithmetic and the PRM arm", async ({ page, browserName }) => {
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
      final: grid.getAttribute("data-mark-pose"),
      within700: swaps.filter((s) => s.t <= 700).length,
      after700: swaps.filter((s) => s.t > 700).length,
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
  const row = { engine: browserName, live, prm };
  bank(`F-settle-${browserName}.json`, row);
  console.log("F " + JSON.stringify(row, null, 1));
  expect(live.swaps.length).toBeGreaterThan(0);
});

test("E2 · the armed ribbon's stop, and the ring-inside-the-frame geometry", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  // Dirty the board: the ribbon arms on `dirty`, never on a pristine one.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const empty = inputs.find((i) => !i.value && !i.disabled && !i.readOnly);
    empty?.focus();
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

  /** The face-riding ring HEAD deleted existed because the button is a zero-padding hit
   *  target SMALLER than the drawn frame around it. Measure whether the drawn ring now sits
   *  inside that frame. */
  const geom = async (btnSel: string, faceSel: string) =>
    page.evaluate(
      ([b, f]) => {
        const btn = document.querySelector<HTMLElement>(b);
        const face = document.querySelector<HTMLElement>(f);
        const ring = document.querySelector<SVGElement>(".focus-ring");
        const box = (el: Element | null) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.x * 100) / 100,
            y: Math.round(r.y * 100) / 100,
            w: Math.round(r.width * 100) / 100,
            h: Math.round(r.height * 100) / 100,
          };
        };
        // The drawn frame is the HandDrawnOutline svg the face carries.
        const frame = face?.closest("button")?.querySelector("svg:not(.focus-ring)");
        return {
          btn: box(btn ?? null),
          face: box(face ?? null),
          frame: box(frame ?? null),
          ring: box(ring),
          rings: document.querySelectorAll(".focus-ring").length,
          outlineOnBtn: btn ? getComputedStyle(btn).outlineStyle : null,
          outlineOnFace: face ? getComputedStyle(face).outlineStyle : null,
        };
      },
      [btnSel, faceSel],
    );

  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn")?.focus(),
  );
  await page.waitForTimeout(800);
  const staging = await geom(".staging-btn", ".staging-face");

  // Arm the ribbon: choose a card that is not the current game.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(700);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1200);
  const armed = await page.evaluate(() => ({
    guard: !!document.querySelector(".gallery-guard"),
    guardBtns: document.querySelectorAll(".guard-btn").length,
    active: document.activeElement?.className?.toString().slice(0, 50) ?? null,
  }));
  let guard: unknown = { skipped: "ribbon did not arm" };
  if (armed.guardBtns > 0) {
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".guard-btn.guard-leave")?.focus(),
    );
    await page.waitForTimeout(800);
    guard = await geom(".guard-btn.guard-leave", ".guard-btn.guard-leave .guard-face");
  }
  const row = { engine: browserName, staging, armed, guard };
  bank(`E2-armed-${browserName}.json`, row);
  console.log("E2 " + JSON.stringify(row, null, 1));
  expect(typeof armed.guardBtns).toBe("number");
});

test("E3 · the armed guard's stop (deal on a dirty board)", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  const typed = await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const empty = inputs.find((i) => !i.value && !i.disabled && !i.readOnly);
    empty?.focus();
    return { found: !!empty, total: inputs.length };
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(900);
  const dirty = await page.evaluate(() => {
    const filled = Array.from(
      document.querySelectorAll(".game-cell input"),
    ).filter((i) => (i as HTMLInputElement).value).length;
    return { filled };
  });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1400);
  const armed = await page.evaluate(() => ({
    guard: !!document.querySelector(".gallery-guard"),
    guardBtns: document.querySelectorAll(".guard-btn").length,
    active: document.activeElement?.className?.toString().slice(0, 50) ?? null,
  }));
  let guard: unknown = { skipped: "ribbon did not arm" };
  if (armed.guardBtns > 0) {
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".guard-btn.guard-leave")?.focus(),
    );
    await page.waitForTimeout(900);
    guard = await page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>(".guard-btn.guard-leave");
      const face = btn?.querySelector<HTMLElement>(".guard-face");
      const frame = btn?.querySelector("svg:not(.focus-ring)");
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const box = (el: Element | null | undefined) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x * 100) / 100,
          y: Math.round(r.y * 100) / 100,
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
        };
      };
      return {
        btn: box(btn),
        face: box(face),
        frame: box(frame),
        ring: box(ring),
        rings: document.querySelectorAll(".focus-ring").length,
        matchesFV: btn?.matches(":focus-visible") ?? null,
        outlineOnBtn: btn ? getComputedStyle(btn).outlineStyle : null,
        outlineOnFace: face ? getComputedStyle(face).outlineStyle : null,
        guardFacePaths: face?.querySelectorAll("path").length ?? 0,
        willChange: face
          ? Array.from(face.querySelectorAll("path")).map(
              (p) => getComputedStyle(p).willChange,
            )
          : [],
      };
    });
  }
  const row = { engine: browserName, typed, dirty, armed, guard };
  bank(`E3-guardstop-${browserName}.json`, row);
  console.log("E3 " + JSON.stringify(row, null, 1));
  expect(typeof armed.guardBtns).toBe("number");
});

test("G · the armed face's promoted layers, and the landing's rAF burst", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);

  // The ring's reposition burst across ONE deck landing: every style write on the ring node,
  // timestamped, so "bounded by stillness" can be read as a number.
  const burst = await page.evaluate(async () => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    vp?.focus();
    await new Promise((r) => setTimeout(r, 400));
    const writes: number[] = [];
    let t0 = 0;
    const seen = new WeakSet<Node>();
    const mo = new MutationObserver((recs) => {
      for (const rec of recs) {
        const t = rec.target as Element;
        if (t.classList?.contains("focus-ring")) writes.push(performance.now() - t0);
        void seen;
      }
    });
    mo.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "viewBox", "width", "height", "d"],
    });
    t0 = performance.now();
    vp?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await new Promise((r) => setTimeout(r, 2500));
    const idleFrom = performance.now() - t0;
    mo.disconnect();
    // A second window with nothing happening at all: the idle floor.
    const idle: number[] = [];
    const mo2 = new MutationObserver((recs) => {
      for (const rec of recs)
        if ((rec.target as Element).classList?.contains("focus-ring")) idle.push(1);
    });
    mo2.observe(document.body, { subtree: true, attributes: true });
    await new Promise((r) => setTimeout(r, 900));
    mo2.disconnect();
    return {
      writes: writes.length,
      firstMs: writes.length ? Math.round(writes[0]) : null,
      lastMs: writes.length ? Math.round(writes[writes.length - 1]) : null,
      idleFrom: Math.round(idleFrom),
      idleWritesPer900ms: idle.length,
    };
  });

  // The armed face's four poses: `will-change` lives on `.boil-pose` (a <g>), not on <path>.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1600);
  const promoted = await page.evaluate(() => {
    const face = document.querySelector(".guard-face");
    const scan = (root: Element | null) =>
      root
        ? Array.from(root.querySelectorAll(".boil-pose")).map(
            (g) => getComputedStyle(g).willChange,
          )
        : [];
    return {
      armed: !!document.querySelector(".gallery-guard"),
      guardFacePoses: scan(face),
      prunedClass: face?.classList.contains("is-pruned") ?? null,
      svgPruned:
        face?.closest("button")?.querySelector(".outline-svg")?.classList.contains(
          "is-pruned",
        ) ?? null,
      allOutlinePoses: Array.from(document.querySelectorAll(".boil-pose")).length,
      promotedCount: Array.from(document.querySelectorAll(".boil-pose")).filter(
        (g) => getComputedStyle(g).willChange === "opacity",
      ).length,
    };
  });
  const row = { engine: browserName, burst, promoted };
  bank(`G-burst-${browserName}.json`, row);
  console.log("G " + JSON.stringify(row, null, 1));
  expect(typeof burst.writes).toBe("number");
});

test("G2 · the landing's real rAF burst, and the armed face's promoted poses", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1700);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    (window as unknown as { __w: number[] }).__w = [];
    const w = (window as unknown as { __w: number[] }).__w;
    const t0 = performance.now();
    (window as unknown as { __t0: number }).__t0 = t0;
    const mo = new MutationObserver((recs) => {
      for (const rec of recs)
        if ((rec.target as Element).classList?.contains("focus-ring"))
          w.push(performance.now() - t0);
    });
    mo.observe(document.body, { subtree: true, attributes: true });
    (window as unknown as { __mo: MutationObserver }).__mo = mo;
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(2600);
  const burst = await page.evaluate(() => {
    const w = (window as unknown as { __w: number[] }).__w;
    (window as unknown as { __mo: MutationObserver }).__mo.disconnect();
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const owner = document
      .querySelector(".gallery-viewport")
      ?.getAttribute("aria-activedescendant");
    const card = owner ? document.getElementById(owner) : null;
    const rb = ring?.getBoundingClientRect();
    const cb = card?.getBoundingClientRect();
    return {
      writes: w.length,
      firstMs: w.length ? Math.round(w[0]) : null,
      lastMs: w.length ? Math.round(w[w.length - 1]) : null,
      spanMs: w.length ? Math.round(w[w.length - 1] - w[0]) : null,
      owner,
      errPx:
        rb && cb
          ? Math.round(Math.max(Math.abs(rb.left + 3 - cb.left), Math.abs(rb.top + 3 - cb.top)) * 100) / 100
          : null,
    };
  });
  // Idle floor, after everything has settled.
  const idle = await page.evaluate(async () => {
    let n = 0;
    const mo = new MutationObserver((recs) => {
      for (const rec of recs)
        if ((rec.target as Element).classList?.contains("focus-ring")) n++;
    });
    mo.observe(document.body, { subtree: true, attributes: true });
    await new Promise((r) => setTimeout(r, 900));
    mo.disconnect();
    return n;
  });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1700);
  const promoted = await page.evaluate(() => {
    const face = document.querySelector(".guard-face");
    return {
      armed: !!document.querySelector(".gallery-guard"),
      guardFacePoses: face
        ? Array.from(face.querySelectorAll(".boil-pose")).map(
            (g) => getComputedStyle(g).willChange,
          )
        : [],
      guardFaceSiblings: face ? face.querySelectorAll(".boil-pose").length : 0,
      promotedTotal: Array.from(document.querySelectorAll(".boil-pose")).filter(
        (g) => getComputedStyle(g).willChange === "opacity",
      ).length,
      poseTotal: document.querySelectorAll(".boil-pose").length,
    };
  });
  const row = { engine: browserName, burst, idleWritesPer900ms: idle, promoted };
  bank(`G2-landing-${browserName}.json`, row);
  console.log("G2 " + JSON.stringify(row, null, 1));
  expect(typeof burst.writes).toBe("number");
});

test("H · does the armed verb breathe, and what does it leave behind", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1700);
  const trace = await page.evaluate(async () => {
    const samples: unknown[] = [];
    const read = (t: number) => {
      // The LEAVE verb is the destructive one and the only face the diff posed; the KEEP
      // face stays `:pose="0"` and is pruned forever, by design.
      const face = document.querySelector(".guard-leave .guard-face");
      const keep = document.querySelector(".guard-keep .guard-face");
      const svg = face?.querySelector(".outline-svg");
      const poses = face ? Array.from(face.querySelectorAll(".boil-pose")) : [];
      samples.push({
        t,
        armed: !!document.querySelector(".gallery-guard"),
        faces: document.querySelectorAll(".guard-face").length,
        keepPruned:
          keep?.querySelector(".outline-svg")?.classList.contains("is-pruned") ?? null,
        svgPruned: svg?.classList.contains("is-pruned") ?? null,
        activePose: poses.findIndex((g) => g.classList.contains("is-active")),
        willChange: poses.map((g) => getComputedStyle(g).willChange),
        display: poses.map((g) => getComputedStyle(g).display),
      });
    };
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click();
    for (const t of [60, 180, 320, 460, 620, 900, 1600]) {
      await new Promise((r) => setTimeout(r, t === 60 ? 60 : 0));
      if (t > 60) await new Promise((r) => setTimeout(r, 0));
      read(t);
      if (t !== 1600)
        await new Promise((r) =>
          setTimeout(r, [180, 320, 460, 620, 900, 1600][[60, 180, 320, 460, 620, 900].indexOf(t)] - t),
        );
    }
    return samples;
  });
  const row = { engine: browserName, trace };
  bank(`H-armedverb-${browserName}.json`, row);
  console.log("H " + JSON.stringify(row, null, 1));
  expect(Array.isArray(trace)).toBe(true);
});

test("I · the two surviving suppressions, censused on the real surface", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await focusCell(page, 40);
  const board = await page.evaluate(() => {
    const cell = document.querySelectorAll(".game-cell")[40] as HTMLElement;
    const cs = getComputedStyle(cell);
    return {
      // index.css:727 `.sudoku-cell:focus-within { outline: 1px solid … }` — the seventh
      // focus-on-outline rule nobody named. `.game-cell` and `.sudoku-cell` are THE SAME
      // element (DigitCell.vue:203-205), and gameCell.css is an UNLAYERED scoped sheet, so
      // `.game-cell:focus-within { outline: none }` (gameCell.css:300) wins over an
      // `@layer`-ed rule at any specificity. Read the computed truth.
      classes: cell.className,
      focusWithin: cell.matches(":focus-within"),
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
      outlineColor: cs.outlineColor,
      background: cs.backgroundColor,
    };
  });
  // The gallery guard container: `tabindex="-1"`, programmatic focus, `outline: none`.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1200);
  const guardContainer = await page.evaluate(() => {
    const g = document.querySelector<HTMLElement>(".gallery-guard");
    if (!g) return { absent: true };
    g.focus();
    const cs = getComputedStyle(g);
    return {
      tabIndex: g.tabIndex,
      isActive: document.activeElement === g,
      matchesFocus: g.matches(":focus"),
      matchesFocusVisible: g.matches(":focus-visible"),
      outlineStyle: cs.outlineStyle,
      rings: document.querySelectorAll(".focus-ring").length,
    };
  });
  const row = { engine: browserName, board, guardContainer };
  bank(`I-suppressions-${browserName}.json`, row);
  console.log("I " + JSON.stringify(row, null, 1));
  expect(typeof board.outlineStyle).toBe("string");
});

test("J · what the ring frames the moment the ribbon arms", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1500);
  const framed = await page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100);
    };
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const guard = document.querySelector(".gallery-guard");
    const verb = document.querySelector(".guard-btn.guard-leave");
    return {
      active: document.activeElement?.className?.toString().slice(0, 40) ?? null,
      rings: document.querySelectorAll(".focus-ring").length,
      ring: box(ring),
      guard: box(guard),
      verb: box(verb),
      guardArea: guard
        ? Math.round(
            guard.getBoundingClientRect().width * guard.getBoundingClientRect().height,
          )
        : null,
      verbArea: verb
        ? Math.round(
            verb.getBoundingClientRect().width * verb.getBoundingClientRect().height,
          )
        : null,
    };
  });
  const row = { engine: browserName, framed };
  bank(`J-armframe-${browserName}.json`, row);
  console.log("J " + JSON.stringify(row, null, 1));
  expect(typeof framed.rings).toBe("number");
});
