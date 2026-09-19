/**
 * acc-five.probe.ts — the rows ACC-FIVE adds BESIDE R2's `accent-kinship.probe.ts`.
 * R2's five rows are re-run unchanged (two env hooks only, `proto/*.diff`); these are
 * the six the family's own claims need, and each one says whether it is born-RED at
 * HEAD or GREEN-by-construction.
 *
 * Run both arms:
 *   ACC_FIVE_OUT=<dir>/readings/control  npx playwright test --config probe/pw.config.ts -g "ACC-FIVE"
 *   ACC_FIVE_OUT=<dir>/readings/overlay ACC_FIVE_OVERLAY=<dir>/proto/five-crayons.css  … same …
 *
 * ── ROW 6 · THE GLOW NAMES A TOKEN (born RED; and R2's row 4 is UNSATISFIABLE) ──────
 * R2's row 4 asserts "no interactive surface paints a colour no token names" but TESTS
 * `/drop-shadow\([^)]*(rgb|rgba|color)\(/` — a proxy that matches ANY colour, including
 * one resolved out of `--color-crayon-gold`. Measured: under this family's overlay the
 * glow computes to `color(srgb 0.788235 0.603922 0.180392 / 0.3)`, which IS the gold
 * token at 0.3, and row 4 still fails. The row can only go green by DELETING the glow.
 * This row asserts the CLAIM instead: the painted glow must equal a resolved token, to
 * the byte, at its own alpha.
 *
 * ── ROW 7 · THE FOUR 1.4.11 RATIOS (born RED in dark on the focus arm; the trace's dark
 * card ratio ships with 0.07 of headroom) ──────────────────────────────────────────
 * The ring at its own `stroke-opacity 0.9` over `--color-card`, and the trace at its own
 * `stroke-opacity 0.95` over `--grid-line-color` AND over `--color-card`, light and dark.
 * Composited in a 1×1 canvas and read back as device pixels — the same technique R2's
 * peer-walk row uses, and the same gamut mapping the stroke itself receives.
 *
 * ── ROW 8 · PRINT AND FORCED COLORS SURVIVE THE ALIAS (GREEN by construction) ───────
 * `--color-user-ink` becomes `var(--color-blue-ink)`. index.css:934-936 re-points
 * `--color-user-ink` to #000 under `@media print`, unlayered and LAST, so the alias must
 * still print black; `@media (forced-colors: active)` forces `.glyph-svg path` to
 * `CanvasText` in `@layer base`, which no token can reach. Both emulated, not argued.
 *
 * ── ROW 9 · THE CONFIRM'S DESTRUCTIVE FACE (born RED — it has no accent at all) ─────
 * The armed guard's `leave` verb, measured whole: its ink must clear AA 4.5:1 against the
 * ground it actually sits on (its own 8% wash over the popover), not against the paper.
 *
 * ── ROW 10 · THE DIGIT'S WEIGHT (GREEN by construction; the kill the charter names) ─
 * The pen's contrast on both papers, before and after. The family's claim is that the hue
 * moves 11.5° and the WEIGHT does not; the row prices the delta.
 *
 * ── ROW 11 · CHROME IS ACHROMATIC (born RED) ───────────────────────────────────────
 * The active section heading carries the difficulty crayon; the selected chip carries it
 * too. One decision, two tinted surfaces. The row asserts the heading is achromatic and
 * the chip is not.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { rgbToOklch, hueDist, parseCss, over, ratio } from "./oklch";

const OUT =
  process.env.ACC_FIVE_OUT ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE/readings/control";
mkdirSync(OUT, { recursive: true });

const OVERLAY = process.env.ACC_FIVE_OVERLAY;
const ARM = OVERLAY ? "overlay" : "control";
const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  if (OVERLAY) await page.addStyleTag({ path: OVERLAY });
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
}

async function resolve(page: Page, names: string[]): Promise<Record<string, string>> {
  return page.evaluate((ns: string[]) => {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = "-9999px";
    document.body.appendChild(p);
    const o: Record<string, string> = {};
    for (const n of ns) {
      p.style.color = "";
      p.style.setProperty("color", `var(${n})`);
      o[n] = getComputedStyle(p).color;
    }
    p.remove();
    return o;
  }, names);
}

/** Composite `css` at `alpha` over `ground` in a 1×1 canvas and read the DEVICE pixel
 *  back — R2's peer-walk technique, so a `color-mix()` or an `oklch()` is priced through
 *  the same gamut mapping the stroke itself receives, never through hex arithmetic. */
async function paintedBytes(
  page: Page,
  jobs: { name: string; css: string; alpha: number; groundCss: string }[],
) {
  return page.evaluate((js) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d")!;
    const read = () => {
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    };
    return js.map((j) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = j.groundCss;
      ctx.fillRect(0, 0, 1, 1);
      const ground = read();
      ctx.globalAlpha = j.alpha;
      ctx.fillStyle = j.css;
      ctx.fillRect(0, 0, 1, 1);
      ctx.globalAlpha = 1;
      return { name: j.name, ink: read(), ground };
    });
  }, jobs);
}

const rel = (c: [number, number, number]) => ({ r: c[0], g: c[1], b: c[2] });

/* ── ROW 6 ────────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 6 — every painted glow IS a resolved token, to the byte", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  // `.sparkle-icon` carries `transition: all 200ms` (GameControlPanel.vue:2082). A
  // same-frame read returns a TWEEN frame — measured once as
  // `drop-shadow(rgba(12, 10, 14, 0.3) …)`, a colour that is in neither the before nor
  // the after. Any gate on this surface must kill the transition first or it reports a
  // colour nothing declared.
  const glow = await page.evaluate(async () => {
    const el = document.querySelector<HTMLElement>(".sparkle-icon")!;
    el.style.setProperty("transition", "none", "important");
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const f = getComputedStyle(el).filter;
    el.style.removeProperty("transition");
    return f;
  });

  const TOKENS = [
    "--color-crayon-gold",
    "--color-crayon-blue",
    "--color-crayon-rose",
    "--color-crayon-green",
    "--color-crayon-orange",
    "--color-user-ink",
    "--color-progress-ink",
    "--color-focus-sketch",
  ];
  const vals = await resolve(page, TOKENS);

  // The declared colour inside `drop-shadow(...)`, whatever the engine serialised it as,
  // resolved back to device bytes through the same canvas.
  const m = /drop-shadow\((.+?)\s+[-\d.]+px/.exec(glow);
  const declared = m ? m[1] : "";
  const painted = declared
    ? (
        await paintedBytes(page, [
          { name: "glow", css: declared, alpha: 1, groundCss: "rgb(255,255,255)" },
        ])
      )[0]
    : null;

  // The same colour at the same alpha, spelled from each token: a match means the glow
  // is REACHABLE by a theme.
  const alphaM = /[/,]\s*([\d.]+)\s*\)/.exec(declared);
  const alpha = alphaM ? parseFloat(alphaM[1]) : 1;
  const candidates = await paintedBytes(
    page,
    TOKENS.map((t) => ({ name: t, css: vals[t], alpha, groundCss: "rgb(255,255,255)" })),
  );
  const matches = candidates.filter(
    (c) => painted && c.ink.every((v, i) => Math.abs(v - painted.ink[i]) <= 1),
  );

  writeFileSync(
    join(OUT, `row6-glow-${browserName}.json`),
    JSON.stringify({ arm: ARM, glow, declared, alpha, painted, candidates, matches }, null, 2),
  );
  expect(
    matches.map((m2) => m2.name),
    `the sparkle's glow must be a colour some token names (painted ${JSON.stringify(painted?.ink)})`,
  ).not.toEqual([]);
});

/* ── ROW 7 ────────────────────────────────────────────────────────────────────── */
for (const scheme of ["light", "dark"] as const) {
  test(`ACC-FIVE row 7 — the four 1.4.11 ratios on painted bytes (${scheme})`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    const v = await resolve(page, [
      "--color-card",
      "--color-background",
      "--grid-line-color",
      "--color-focus-sketch",
      "--color-progress-ink",
      "--color-crayon-blue",
      "--color-crayon-gold",
    ]);
    const jobs = [
      // the board's focus ring — the ghost path's own stroke-opacity (gameCell.css:250)
      { name: "ring @0.9 over card", css: v["--color-focus-sketch"], alpha: 0.9, groundCss: v["--color-card"] },
      // the fill meter's trace — HandDrawnGrid.vue:471, stroke-opacity 0.95
      { name: "trace @0.95 over grid-line", css: v["--color-progress-ink"], alpha: 0.95, groundCss: v["--grid-line-color"] },
      { name: "trace @0.95 over card", css: v["--color-progress-ink"], alpha: 0.95, groundCss: v["--color-card"] },
      // and the same trace against the paper the board is actually laid on
      { name: "trace @0.95 over background", css: v["--color-progress-ink"], alpha: 0.95, groundCss: v["--color-background"] },
      // the celebration the trace hands off to: --color-gold-star floods the frame
      { name: "solved frame (gold wax) over card", css: v["--color-crayon-gold"], alpha: 1, groundCss: v["--color-card"] },
    ];
    const painted = await paintedBytes(page, jobs);
    const rows = painted.map((p) => ({
      name: p.name,
      ink: p.ink,
      ground: p.ground,
      ratio: +ratio(rel(p.ink), rel(p.ground)).toFixed(2),
    }));
    writeFileSync(
      join(OUT, `row7-ratios-${browserName}-${scheme}.json`),
      JSON.stringify({ arm: ARM, scheme, tokens: v, rows }, null, 2),
    );
    for (const r of rows.filter((x) => x.name !== "solved frame (gold wax) over card"))
      expect(r.ratio, `${r.name} (${scheme}, ${browserName})`).toBeGreaterThanOrEqual(3);
  });
}

/* ── ROW 8 ────────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 8 — print and forced-colors survive the alias", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  await page.emulateMedia({ media: "print" });
  const printed = await page.evaluate(() => {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = "-9999px";
    document.body.appendChild(p);
    p.style.setProperty("color", "var(--color-user-ink)");
    const ink = getComputedStyle(p).color;
    p.style.setProperty("color", "var(--grid-line-color)");
    const grid = getComputedStyle(p).color;
    p.remove();
    const glyph = document.querySelector(".sudoku-cell .glyph-svg path");
    return { ink, grid, glyphStroke: glyph ? getComputedStyle(glyph).stroke : null };
  });

  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  const forced = await page.evaluate(() => {
    const glyph = document.querySelector(".sudoku-cell .glyph-svg path");
    // What the SYSTEM ink resolves to in this emulation, so the row compares the stroke
    // against `CanvasText` itself rather than against a guess about what black means.
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = "-9999px";
    p.style.color = "CanvasText";
    document.body.appendChild(p);
    const canvasText = getComputedStyle(p).color;
    p.style.setProperty("color", "var(--color-user-ink)");
    const userInk = getComputedStyle(p).color;
    p.remove();
    return {
      glyphStroke: glyph ? getComputedStyle(glyph).stroke : null,
      canvasText,
      userInk,
    };
  });
  await page.emulateMedia({ forcedColors: "none" });

  writeFileSync(
    join(OUT, `row8-print-forced-${browserName}.json`),
    JSON.stringify({ arm: ARM, printed, forced }, null, 2),
  );
  expect(printed.ink, "print re-points --color-user-ink to true black").toBe("rgb(0, 0, 0)");
  expect(printed.glyphStroke, "the printed digit is true black").toBe("rgb(0, 0, 0)");
  expect(
    forced.glyphStroke,
    "forced-colors hands the digit to the SYSTEM ink (index.css:948-952), not to the token",
  ).toBe(forced.canvasText);
});

/* ── ROW 9 ────────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 9 — the confirm's destructive verb wears the house's danger ink", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  // dirty the board, then ask the picker to deal — the guard ribbon's own subject (M12).
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("5");
  await page.waitForTimeout(250);
  // `g` opens the gallery from the playing view, `d` deals — App.vue:764 / GameGallery
  // `attemptDeal`. R2's click path (`[aria-label*="gallery"]`) reached the ribbon in
  // chromium only; the keyboard entry reaches it in both engines, which is why this row
  // uses it. The board input must lose focus first or `g`/`d` land in the cell.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(200);
  // `g` opens the gallery, then the staging band's own deal verb arms the ribbon. Both the
  // shortcut and the click route through the same `attemptDeal` (GameGallery.vue:649-660),
  // but neither is reliable on its own in both engines — the shortcut missed in chromium
  // and the gallery was sometimes not yet mounted for the click in webkit — so the row
  // POLLS for each stage instead of sleeping at it.
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page.keyboard.press("g").catch(() => {});
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .waitFor({ state: "visible", timeout: 6000 })
      .catch(() => {});
    await page.keyboard.press("d").catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 2500 })
      .catch(() => {});
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 3000 })
      .catch(() => {});
  }
  await page.waitForTimeout(400);

  const guard = await page.evaluate(() => {
    const leave = document.querySelector<HTMLElement>(".guard-leave .guard-face");
    const keep = document.querySelector<HTMLElement>(".guard-keep .guard-face");
    const note = document.querySelector<HTMLElement>(".guard-note");
    if (!leave) return null;
    const cs = getComputedStyle(leave);
    return {
      leaveColor: cs.color,
      leaveBg: cs.backgroundColor,
      keepColor: keep ? getComputedStyle(keep).color : null,
      noteBg: note ? getComputedStyle(note).backgroundColor : null,
      text: leave.textContent?.trim() ?? "",
    };
  });

  let row: Record<string, unknown> = { arm: ARM, reached: !!guard, guard };
  if (guard) {
    // the ground the verb actually sits on: its own wash over the note's paper.
    const painted = await paintedBytes(page, [
      { name: "leave ground", css: guard.leaveBg, alpha: 1, groundCss: guard.noteBg ?? "rgb(255,255,255)" },
      { name: "leave ink", css: guard.leaveColor, alpha: 1, groundCss: "rgb(255,255,255)" },
    ]);
    const ground = painted[0].ink;
    const ink = painted[1].ink;
    const o = rgbToOklch(ink[0], ink[1], ink[2]);
    row = {
      ...row,
      inkOklch: { L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1) },
      ratioOnOwnGround: +ratio(rel(ink), rel(ground)).toFixed(2),
      chromatic: o.C >= 0.02,
    };
  }
  writeFileSync(join(OUT, `row9-guard-${browserName}.json`), JSON.stringify(row, null, 2));
  expect(guard, `the guard ribbon was not reached in ${browserName}`).not.toBeNull();
  expect(row.chromatic, "the destructive verb carries the house's danger ink, not a caption grey").toBe(true);
  expect(row.ratioOnOwnGround as number, "the destructive verb at AA on its own ground").toBeGreaterThanOrEqual(4.5);
});

/* ── ROW 10 ───────────────────────────────────────────────────────────────────── */
for (const scheme of ["light", "dark"] as const) {
  test(`ACC-FIVE row 10 — the digit's weight, priced (${scheme})`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    const v = await resolve(page, [
      "--color-card",
      "--color-background",
      "--color-user-ink",
      "--color-crayon-blue",
      "--color-focus-sketch",
    ]);
    const painted = await paintedBytes(page, [
      { name: "pen over card", css: v["--color-user-ink"], alpha: 1, groundCss: v["--color-card"] },
      { name: "pen over background", css: v["--color-user-ink"], alpha: 1, groundCss: v["--color-background"] },
      { name: "ring composite", css: v["--color-focus-sketch"], alpha: 0.9, groundCss: v["--color-card"] },
      { name: "unit wash", css: v["--color-crayon-blue"], alpha: 0.07, groundCss: v["--color-card"] },
    ]);
    const pen = painted[0].ink;
    const penO = rgbToOklch(pen[0], pen[1], pen[2]);
    const blueRaw = parseCss(v["--color-crayon-blue"])!;
    const anchorO = rgbToOklch(blueRaw.r, blueRaw.g, blueRaw.b);
    const ringC = painted[2].ink;
    const ringO = rgbToOklch(ringC[0], ringC[1], ringC[2]);
    const row = {
      arm: ARM,
      scheme,
      pen: v["--color-user-ink"],
      penOklch: { L: +penO.L.toFixed(4), C: +penO.C.toFixed(4), h: +penO.h.toFixed(1) },
      dHueToCrayonBlue: +hueDist(penO.h, anchorO.h).toFixed(2),
      onCard: +ratio(rel(pen), rel(painted[0].ground)).toFixed(3),
      onBackground: +ratio(rel(painted[1].ink), rel(painted[1].ground)).toFixed(3),
      penVsRingComposite: +ratio(rel(pen), rel(ringC)).toFixed(2),
      penVsUnitWash: +ratio(rel(pen), rel(painted[3].ink)).toFixed(2),
      dLPenRing: +(penO.L - ringO.L).toFixed(4),
      dCPenRing: +(penO.C - ringO.C).toFixed(4),
    };
    writeFileSync(
      join(OUT, `row10-weight-${browserName}-${scheme}.json`),
      JSON.stringify(row, null, 2),
    );
    expect(row.onCard, "the pen at AA on --color-card").toBeGreaterThanOrEqual(4.5);
    expect(row.onBackground, "the pen at AA on --color-background").toBeGreaterThanOrEqual(4.5);
    expect(row.dHueToCrayonBlue, "the pen is crayon-blue's own hue").toBeLessThanOrEqual(5);
  });
}

/* ── ROW 11 ───────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 11 — chrome is achromatic; the tint lives on the chip", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  // THE TWEEN TRAP, third occurrence in this lane: the heading carries Tailwind's
  // `transition-colors duration-250` (GameControlPanel.vue:190) and `.sparkle-icon` carries
  // `transition: all 200ms`. A colour read taken before those settle returns a frame of the
  // TWEEN — measured once as rgb(95,118,101), a green-grey that is in neither the before nor
  // the after. Every colour gate on this estate must settle or it reports a colour nothing
  // declared.
  await page.waitForTimeout(600);
  const found = await page.evaluate(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>(".controls-card h2.section-heading"),
    ).map((h) => ({ text: h.textContent?.trim() ?? "", color: getComputedStyle(h).color, cls: h.className }));
    const chips = Array.from(
      document.querySelectorAll<HTMLElement>(".controls-card .selected-item"),
    ).map((c) => ({ text: c.textContent?.trim() ?? "", color: getComputedStyle(c).color, cls: c.className }));
    return { heads, chips };
  });
  const chroma = (css: string) => {
    const p = parseCss(css);
    if (!p) return 0;
    return rgbToOklch(p.r, p.g, p.b).C;
  };
  const tintedHeads = found.heads.filter((h) => chroma(h.color) >= 0.02);
  const tintedChips = found.chips.filter((c) => chroma(c.color) >= 0.02);
  writeFileSync(
    join(OUT, `row11-chrome-${browserName}.json`),
    JSON.stringify(
      {
        arm: ARM,
        heads: found.heads.map((h) => ({ ...h, C: +chroma(h.color).toFixed(4) })),
        chips: found.chips.map((c) => ({ ...c, C: +chroma(c.color).toFixed(4) })),
      },
      null,
      2,
    ),
  );
  expect(found.chips.length, "the row needs a chip to have a subject").toBeGreaterThan(0);
  expect(
    tintedHeads.map((h) => `${h.text} → ${h.color}`),
    "a section heading is chrome; the decision's colour belongs to the chip",
  ).toEqual([]);
  expect(tintedChips.length, "the selected chip still carries the difficulty crayon").toBeGreaterThan(0);
});
