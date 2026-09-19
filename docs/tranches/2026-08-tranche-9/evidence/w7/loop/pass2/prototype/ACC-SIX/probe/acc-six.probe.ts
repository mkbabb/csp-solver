/**
 * acc-six.probe.ts — T9-W7 ACC-SIX, pass 2. The family's own gates on the REAL surface.
 *
 * Read-only on the product; writes JSON under this family's pass-2 evidence dir only.
 * Runs against the lane's own dev server (127.0.0.1:4237) through the scratch config
 * beside it — never the estate's default, which boots :3000.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, hueDist, parseCss, over, ratio } from "./oklch";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-SIX/readings";
mkdirSync(OUT, { recursive: true });

const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
}

async function resolve(page: Page, names: string[]): Promise<Record<string, string>> {
  return page.evaluate((ns: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const n of ns) {
      probe.style.setProperty("color", `var(${n})`);
      out[n] = getComputedStyle(probe).color;
    }
    probe.remove();
    return out;
  }, names);
}

/** Blank (writable) cells, in DOM order. */
const blanks = (page: Page) =>
  page.locator(".sudoku-cell input:not([readonly]):not([disabled])");

/** Write `n` digits into the first n blank cells. Returns how many landed. */
async function write(page: Page, n: number): Promise<number> {
  const inputs = blanks(page);
  const total = await inputs.count();
  let done = 0;
  for (let i = 0; i < total && done < n; i++) {
    const el = inputs.nth(i);
    if ((await el.inputValue()) !== "") continue;
    await el.click();
    await page.keyboard.press("1");
    done++;
  }
  await page.waitForTimeout(120);
  return done;
}

// ── 1 · THE ONE RATIO LEDGER, painted ────────────────────────────────────────────────
for (const scheme of ["light", "dark"] as const) {
  test(`ratios — the ledger's rows, resolved by the engine (${scheme})`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    const v = await resolve(page, [
      "--color-card",
      "--color-background",
      "--color-accent",
      "--grid-line-color",
      "--color-progress-ink",
      "--color-solver-ink-2",
      "--color-user-ink",
      "--color-red-ink",
      "--color-focus-sketch",
      "--color-crayon-blue",
      "--color-foreground",
      "--color-answer-pale",
      "--color-answer-mid",
      "--color-answer-deep",
    ]);
    const p = (n: string) => parseCss(v[n])!;
    const card = p("--color-card");
    const bg = p("--color-background");
    const accent = p("--color-accent");
    const line = p("--grid-line-color");
    const at = (c: ReturnType<typeof p>, a: number, g: typeof card) =>
      +ratio(over({ ...c, a }, g), g).toFixed(2);
    const neutral = (pct: number) =>
      over({ ...p("--color-foreground"), a: pct }, card);

    const rows = {
      engine: browserName,
      scheme,
      traceOverLine: at(p("--color-progress-ink"), 0.95, line),
      traceOverCard: at(p("--color-progress-ink"), 0.95, card),
      solverInk2OnCard: +ratio(p("--color-solver-ink-2"), card).toFixed(2),
      userInkOnCard: +ratio(p("--color-user-ink"), card).toFixed(2),
      userInkOnBackground: +ratio(p("--color-user-ink"), bg).toFixed(2),
      redInkOnCard: +ratio(p("--color-red-ink"), card).toFixed(2),
      redInkOnAccent: +ratio(p("--color-red-ink"), accent).toFixed(2),
      redInkOn5pct: +ratio(p("--color-red-ink"), neutral(0.05)).toFixed(2),
      redInkOn8pct: +ratio(p("--color-red-ink"), neutral(0.08)).toFixed(2),
      ringHead: at(p("--color-focus-sketch"), 0.9, card),
      ringCrayon: at(p("--color-crayon-blue"), 0.9, card),
      tokens: {
        progressInk: v["--color-progress-ink"],
        solverInk2: v["--color-solver-ink-2"],
        userInk: v["--color-user-ink"],
        answerPale: v["--color-answer-pale"],
        answerMid: v["--color-answer-mid"],
        answerDeep: v["--color-answer-deep"],
      },
    };
    bank(`ratios-${browserName}-${scheme}.json`, rows);

    expect(rows.traceOverLine, "trace over the grid line @.95").toBeGreaterThanOrEqual(3);
    expect(rows.traceOverCard, "trace over the card @.95").toBeGreaterThanOrEqual(3);
    expect(rows.userInkOnCard, "your digit on the card").toBeGreaterThanOrEqual(4.5);
    expect(rows.userInkOnBackground, "your digit on the paper").toBeGreaterThanOrEqual(4.5);
    expect(rows.solverInk2OnCard, "the revealed digit").toBeGreaterThanOrEqual(4.5);
  });
}

// ── 2 · G2 the glow, G3 print / forced, G10 no stock hex ─────────────────────────────
test("G2 — the sparkle's glow byte-matches a resolved token at its alpha, 5/5", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const runs: { filter: string; token: string; match: boolean }[] = [];
  for (let i = 0; i < 5; i++) {
    const r = await page.evaluate(() => {
      const el = document.querySelector(".sparkle-icon");
      const probe = document.createElement("div");
      probe.style.position = "fixed";
      probe.style.left = "-9999px";
      probe.style.setProperty("color", "var(--sparkle-glow-soft)");
      document.body.appendChild(probe);
      const token = getComputedStyle(probe).color;
      probe.remove();
      return { filter: el ? getComputedStyle(el).filter : "", token };
    });
    runs.push({ ...r, match: r.filter.includes(r.token) });
    await page.reload();
    await page.waitForSelector(".sparkle-icon", { timeout: 20000 });
  }
  bank(`glow-${browserName}.json`, runs);
  expect(runs.filter((r) => r.match).length, "the painted glow IS the token").toBe(5);
});

for (const media of ["print", "forced"] as const) {
  test(`G3 — the fill trace yields to ${media}`, async ({ page, browserName }) => {
    await page.emulateMedia(
      media === "print"
        ? { media: "print", reducedMotion: "reduce" }
        : { forcedColors: "active", reducedMotion: "reduce" },
    );
    await boot(page);
    await write(page, 3);
    const stroke = await page.evaluate(() => {
      const el = document.querySelector(".progress-trace");
      return el ? getComputedStyle(el).stroke : "";
    });
    bank(`forced-${media}-${browserName}.json`, { stroke });
    const o = parseCss(stroke);
    if (o) {
      const { C } = rgbToOklch(o.r, o.g, o.b);
      expect(C, `${media}: the trace is system ink, not violet`).toBeLessThan(0.02);
    }
  });
}

// ── 3 · G5 the count tape, on the real board ─────────────────────────────────────────
// THE BOARD BOX IS THE PAPER, NOT THE CARD'S DRAWN EDGE. `.board-wrapper` carries a 2 px
// border, so its border box is 640 px at the desk while the paper the pencils are drawn on
// — the padding box, which is also the absolute tape's containing block — is 636. The board
// figures the spec quotes (636 desk / 365 phone) are the PADDING box, and the first cut of
// this instrument measured against the border box and read a 1.22 px lift that is the
// border minus the tilt's bounding-box bleed. Declared, and corrected here rather than in
// the design.
const tapeBox = (page: Page) =>
  page.evaluate(() => {
    const t = document.querySelector(".count-tape") as HTMLElement | null;
    const b = document.querySelector(".board-wrapper") as HTMLElement | null;
    const mast = document.querySelector("svg.handwritten-logo") as SVGElement | null;
    const r = (e: Element | null) => {
      if (!e) return null;
      const x = e.getBoundingClientRect();
      return { x: x.x, y: x.y, w: x.width, h: x.height, right: x.right, bottom: x.bottom };
    };
    const paper = (() => {
      if (!b) return null;
      const x = b.getBoundingClientRect();
      const px = x.x + b.clientLeft;
      const py = x.y + b.clientTop;
      return {
        x: px,
        y: py,
        w: b.clientWidth,
        h: b.clientHeight,
        right: px + b.clientWidth,
        bottom: py + b.clientHeight,
      };
    })();
    const cs = t ? getComputedStyle(t) : null;
    return {
      tape: r(t),
      board: paper,
      cardBox: r(b),
      offsetTop: t?.offsetTop ?? null,
      masthead: r(mast),
      mastInk: (() => {
        // The masthead's INK, not its box: the logo svg's own painted bbox.
        if (!mast) return null;
        try {
          const bb = (mast as SVGGraphicsElement).getBBox();
          const m = mast.getBoundingClientRect();
          const vb = mast.getAttribute("viewBox")?.split(/\s+/).map(Number);
          if (!vb || vb.length < 4) return null;
          const sx = m.width / vb[2];
          const sy = m.height / vb[3];
          return {
            x: m.x + (bb.x - vb[0]) * sx,
            y: m.y + (bb.y - vb[1]) * sy,
            right: m.x + (bb.x - vb[0] + bb.width) * sx,
            bottom: m.y + (bb.y - vb[1] + bb.height) * sy,
          };
        } catch {
          return null;
        }
      })(),
      text: t?.textContent ?? null,
      clip: cs?.clipPath ?? null,
      tilt: cs?.getPropertyValue("--washi-tilt").trim() ?? null,
      z: cs?.zIndex ?? null,
      pointer: cs?.pointerEvents ?? null,
      hidden: t?.getAttribute("aria-hidden") ?? null,
      valuetext:
        document.querySelector(".progress-trace-a11y")?.getAttribute("aria-valuetext") ??
        null,
      valuenow:
        document.querySelector(".progress-trace-a11y")?.getAttribute("aria-valuenow") ??
        null,
      valuemax:
        document.querySelector(".progress-trace-a11y")?.getAttribute("aria-valuemax") ??
        null,
    };
  });

const VIEWPORTS = [
  { name: "desk", width: 1280, height: 800, dpr: 1 },
  { name: "phone", width: 393, height: 699, dpr: 3 },
  { name: "short", width: 900, height: 450, dpr: 1 },
];

for (const vp of VIEWPORTS) {
  test(`G5 — the tape at ${vp.name} ${vp.width}x${vp.height}`, async ({
    browser,
    browserName,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      hasTouch: vp.dpr > 1,
      isMobile: vp.dpr > 1 && browserName === "chromium",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await boot(page);

    const before = await tapeBox(page);
    const n = await write(page, 1);
    const at1 = await tapeBox(page);

    // OCCLUSION, measured on the painted surface: violet pixels under the tape's own box,
    // at each of the three fills the tape is alive for. The claim the top-right corner was
    // chosen on is that this is 0 for the tape's whole life.
    const violetUnderTape = async () => {
      const t = await tapeBox(page);
      if (!t.tape) return null;
      const clip = {
        x: Math.max(0, Math.floor(t.tape.x)),
        y: Math.max(0, Math.floor(t.tape.y)),
        width: Math.ceil(t.tape.w) + 2,
        height: Math.ceil(t.tape.h) + 2,
      };
      const buf = await page.screenshot({ clip });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      let v = 0;
      for (let i = 0; i < data.length; i += info.channels) {
        const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
        if (o.C > 0.06 && hueDist(o.h, 293) < 18) v++;
      }
      return v;
    };
    const occ1 = await violetUnderTape();
    await write(page, 1);
    const at2 = await tapeBox(page);
    const occ2 = await violetUnderTape();
    await write(page, 1);
    const occ3 = await violetUnderTape();

    const out = {
      engine: browserName,
      viewport: vp,
      wroteFirst: n,
      noTapeBeforeAnyWrite: before.tape === null,
      at1,
      at2,
      // The box law: inside [board.right - w - inset, board.right - inset] x [board.top, +h]
      inset:
        at1.board && at1.tape ? +(at1.board.right - at1.tape.right).toFixed(2) : null,
      topFlush: at1.board && at1.tape ? +(at1.tape.y - at1.board.y).toFixed(2) : null,
      insetPctOfBoard:
        at1.board && at1.tape
          ? +(((at1.board.right - at1.tape.right) / at1.board.w) * 100).toFixed(3)
          : null,
      mastheadOverlapPx2:
        at1.tape && at1.masthead
          ? +(
              Math.max(
                0,
                Math.min(at1.tape.right, at1.masthead.right) -
                  Math.max(at1.tape.x, at1.masthead.x),
              ) *
              Math.max(
                0,
                Math.min(at1.tape.bottom, at1.masthead.bottom) -
                  Math.max(at1.tape.y, at1.masthead.y),
              )
            ).toFixed(2)
          : null,
      mastheadInkOverlapPx2:
        at1.tape && at1.mastInk
          ? +(
              Math.max(
                0,
                Math.min(at1.tape.right, at1.mastInk.right) -
                  Math.max(at1.tape.x, at1.mastInk.x),
              ) *
              Math.max(
                0,
                Math.min(at1.tape.bottom, at1.mastInk.bottom) -
                  Math.max(at1.tape.y, at1.mastInk.y),
              )
            ).toFixed(2)
          : null,
      traceOcclusionPx: { fill1: occ1, fill2: occ2, fill3: occ3 },
      // G6 on the live surface: the geometry is the seed's, not the words'.
      clipStable: at1.clip === at2.clip,
      tiltStable: at1.tilt === at2.tilt,
      literalEqualsValuetext: at1.text === at1.valuetext,
    };
    bank(`tape-${browserName}-${vp.name}.json`, out);

    expect(out.noTapeBeforeAnyWrite, "no tape before the first write").toBe(true);
    expect(at1.tape, "the tape is laid at fill 1").not.toBeNull();
    expect(at1.text, "the literal").toMatch(/^\d+ of \d+ on the board$/);
    expect(out.literalEqualsValuetext, "one literal, two carriers").toBe(true);
    expect(at1.hidden, "the drawn tape is decoration").toBe("true");
    expect(at1.offsetTop, "top: 0 — flush with the paper's top edge").toBe(0);
    expect(out.insetPctOfBoard!, "the right inset IS FRAME_X_PAD, 12 u of 1000").toBeCloseTo(
      1.2,
      1,
    );
    expect(at1.tape!.x, "the whole tape sits inside the board box").toBeGreaterThanOrEqual(
      at1.board!.x - 0.5,
    );
    expect(at1.tape!.right, "and does not pass its right edge").toBeLessThanOrEqual(
      at1.board!.right + 0.5,
    );
    expect(out.mastheadOverlapPx2, "masthead box overlap").toBe(0);
    expect(out.mastheadInkOverlapPx2, "masthead ink overlap").toBe(0);
    expect(occ1, "the trace is not occluded at fill 1").toBe(0);
    expect(occ2, "nor at fill 2").toBe(0);
    expect(occ3, "nor at fill 3").toBe(0);
    expect(out.clipStable, "the tear does not re-roll on a count change").toBe(true);
    expect(out.tiltStable, "nor does the tilt").toBe(true);
    await ctx.close();
  });
}

test("G5 — the tape rests, lifts, and never resurrects", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await boot(page);
  await write(page, 2);
  await write(page, 1);
  const t0 = Date.now(); // the THIRD fill's own clock — the rest window starts here
  const upAt3 = (await tapeBox(page)).tape !== null;
  // A fourth write inside the rest window must not extend it.
  await page.waitForTimeout(1200);
  await write(page, 1);
  const shownAt4 = await tapeBox(page);
  await expect
    .poll(async () => ((await tapeBox(page)).tape === null ? "gone" : "up"), {
      timeout: 6000,
      intervals: [50],
    })
    .toBe("gone");
  const goneAfterMs = Date.now() - t0;

  // Undo to empty, then write again: the lesson is not repeated on the same deal.
  await page.keyboard.press("Control+z");
  await page.waitForTimeout(200);
  await write(page, 1);
  const resurrected = (await tapeBox(page)).tape !== null;

  const out = { engine: browserName, upAt3, shownAt4: shownAt4.text, goneAfterMs, resurrected };
  bank(`tape-life-${browserName}.json`, out);
  expect(upAt3).toBe(true);
  expect(shownAt4.text, "the fourth write is shown").toMatch(/^4 of \d+ on the board$/);
  expect(resurrected, "no resurrection on the same deal").toBe(false);
});

// ── 4 · G0 the dash bound: the live gauge, both engines, at three fills ──────────────
test("G0 — the painted fill front agrees between engines", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  // The WRITABLE count is the gauge's own denominator (`aria-valuemax`), not the input
  // count: every cell is an `input`, givens included, so counting inputs over-reports by the
  // givens and every target fraction lands at full fill.
  const writable = Number(
    await page
      .locator(".progress-trace-a11y")
      .getAttribute("aria-valuemax"),
  );
  const box = await page.evaluate(() => {
    const b = document.querySelector(".board-wrapper")!.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
  });
  const violetShare = async () => {
    const buf = await page.screenshot({ clip: box });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    let v = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
      if (o.C > 0.06 && hueDist(o.h, 293) < 18) v++;
    }
    return v;
  };
  const marks: Record<string, number> = {};
  let written = 0;
  const targets = [0.05, 0.25, 0.5];
  for (const p of targets) {
    const want = Math.max(1, Math.round(writable * p));
    written += await write(page, want - written);
    await page.waitForTimeout(500);
    marks[`p${p}`] = await violetShare();
  }
  // full ink: the denominator
  written += await write(page, writable - written);
  await page.waitForTimeout(700);
  const full = await violetShare();
  const out = {
    engine: browserName,
    writable,
    full,
    shares: Object.fromEntries(
      Object.entries(marks).map(([k, v]) => [k, +((v / full) * 100).toFixed(2)]),
    ),
  };
  bank(`dash-${browserName}.json`, out);
  expect(full, "the ring paints at full fill").toBeGreaterThan(500);
});

// ── 5 · G8 the off-anchor share over the painted board ──────────────────────────────
const ANCHOR_HUES = [14.2, 68.7, 83.7, 147.0, 251.4, 293.0];

for (const scheme of ["light", "dark"] as const) {
  test(`G8 — off-anchor share on the board (${scheme})`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    await write(page, 4);
    await page.waitForTimeout(400);
    const box = await page.evaluate(() => {
      const b = document.querySelector(".board-wrapper")!.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
    });
    const buf = await page.screenshot({ clip: box });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    let chromatic = 0;
    let off = 0;
    const hist: Record<string, number> = {};
    for (let i = 0; i < data.length; i += info.channels) {
      const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
      if (o.C < 0.012) continue;
      chromatic++;
      const d = Math.min(...ANCHOR_HUES.map((a) => hueDist(o.h, a)));
      if (d > 15) {
        off++;
        const k = String(Math.round(o.h / 10) * 10);
        hist[k] = (hist[k] ?? 0) + 1;
      }
    }
    const out = {
      engine: browserName,
      scheme,
      chromatic,
      off,
      offShare: +((off / Math.max(1, chromatic)) * 100).toFixed(2),
      topOffHues: Object.entries(hist)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    };
    bank(`offanchor-${browserName}-${scheme}.json`, out);
  });
}

// ── 6 · G4 the verb: red at rest AND hovered, and the drawn box with it ─────────────
for (const scheme of ["light", "dark"] as const) {
  test(`G4 — the armed confirm's verb (${scheme})`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    await write(page, 1);
    await page.locator("svg.handwritten-logo").click();
    await page.waitForSelector(".gallery-viewport", { timeout: 20000 });
    await page.locator(".gallery-viewport").press("ArrowRight");
    await page.locator(".gallery-viewport").press("d");
    await page.waitForSelector(".gallery-guard", { timeout: 20000 });

    const read = async () =>
      page.evaluate(() => {
        const face = document.querySelector(".guard-leave .guard-face") as HTMLElement;
        const keep = document.querySelector(".guard-keep .guard-face") as HTMLElement;
        const path = face?.querySelector("svg path") as SVGElement | null;
        const cs = getComputedStyle(face);
        return {
          color: cs.color,
          background: cs.backgroundColor,
          boxStroke: path ? getComputedStyle(path).stroke : null,
          keep: keep ? getComputedStyle(keep).color : null,
          ground: keep ? getComputedStyle(keep).backgroundColor : null,
        };
      });
    const rest = await read();
    await page.locator(".guard-leave").hover();
    await page.waitForTimeout(250);
    const hovered = await read();
    const v = await resolve(page, ["--color-card", "--color-accent"]);
    const card = parseCss(v["--color-card"])!;
    const accent = parseCss(v["--color-accent"])!;
    const chroma = (c: string) => {
      const p = parseCss(c);
      return p ? +rgbToOklch(p.r, p.g, p.b).C.toFixed(3) : null;
    };
    const out = {
      engine: browserName,
      scheme,
      rest,
      hovered,
      restRatio: +ratio(parseCss(rest.color)!, card).toFixed(2),
      hoverRatio: +ratio(parseCss(hovered.color)!, accent).toFixed(2),
      restChroma: chroma(rest.color),
      hoverChroma: chroma(hovered.color),
      boxRestRatio: rest.boxStroke
        ? +ratio(parseCss(rest.boxStroke)!, card).toFixed(2)
        : null,
      groundDeleted: rest.background === "rgba(0, 0, 0, 0)",
    };
    bank(`verb-${browserName}-${scheme}.json`, out);
    expect(out.restChroma!, "the verb is not achromatic").toBeGreaterThan(0);
    expect(out.hoverChroma!, "the hover ground does not erase the red").toBeGreaterThan(0);
    expect(out.restRatio, "the verb at rest on the bare card").toBeGreaterThanOrEqual(4.5);
    expect(out.hoverRatio, "the verb over the hover ground").toBeGreaterThanOrEqual(4.5);
    expect(out.boxRestRatio!, "the drawn box reddens with the word").toBeGreaterThanOrEqual(3);
    expect(out.groundDeleted, "the 8% ground is gone").toBe(true);
  });
}
