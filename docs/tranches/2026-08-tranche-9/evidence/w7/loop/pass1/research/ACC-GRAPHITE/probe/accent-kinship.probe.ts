/**
 * accent-kinship.probe.ts — T9-W7 §3, THE ACCENT FAMILY, as a born-RED instrument.
 *
 * ── THE LAW THIS ASSERTS ────────────────────────────────────────────────────────
 * Every accent this product paints on an INTERACTIVE surface is kin to the house
 * family, or it is a DECLARED exception that pays for itself in a11y.
 *
 * KIN, defined so it can be measured and never argued:
 *   the accent's OKLCH hue sits within KIN_DEG of one of the five crayon anchors.
 *
 * KIN_DEG is NOT a taste number. It is re-derived from the house's own hue-lock
 * practice, which index.css states in prose at four sites ("crayon-green #2DC653
 * hue-locked (135°), darkened to AA") and ships at these distances:
 *     green-ink 0.2°  ·  red-ink 0.6°  ·  gold-ink 1.3°  ·  focus-sketch 1.9°
 *     ·  orange-ink 4.5°   ← the widest hue-lock the estate ships
 * So the house's own loosest lock is 4.5°, and KIN_DEG = 5° is that practice
 * written down. Raising it is a design ruling; it may not be raised to make a
 * failing row pass.
 *
 * ── THE EXCEPTIONS, and what each one must pay ──────────────────────────────────
 * Two jobs genuinely cannot be kin, because their job is TELLING THINGS APART:
 *
 *   · SOLVER RAINBOW (`--color-solver-ink-1..5`) — board content that must never be
 *     mistaken for your hand or a peer's. A five-hue ramp cannot fit a five-point
 *     wheel without colliding with the wax that already owns those hues.
 *   · PEER INK (`playerIdentity.ts`, a 137.5° golden-angle walk) — N unique inks
 *     with no cap. Any bounded palette either runs out or repeats.
 *
 * An exception is not a pass. Each must pay its a11y toll, and the rows below
 * collect it: the rainbow at the AA text floor on the papers it writes on, the peer
 * walk at its declared LIGHTNESS BAND over every index a room can deal.
 *
 * ── WHAT IS NOT AN EXCEPTION ────────────────────────────────────────────────────
 * Contrast-bearing is not the same as family-breaking. `--color-focus-sketch` exists
 * because raw crayon-blue measures 2.86:1 over `--color-card`, under WCAG 1.4.11's
 * 3:1 non-text floor — and it pays that toll while staying 1.9° from the wax. Four
 * ink tiers do the same. A contrast floor moves LIGHTNESS. It never needs a new hue.
 *
 * ── READING AT HEAD (2026-09-17, post W1–W6) ────────────────────────────────────
 * RED. Four rows fail:
 *   1. `--color-user-ink` — the digit YOU write, 11.5° off crayon-blue (light) /
 *      5.3° (dark), and byte-verbatim Tailwind `blue-600` / `blue-400`.
 *   2. `--color-progress-ink` — the fill meter, 41.3° / 43.7° off every anchor,
 *      verbatim Tailwind `violet-500` / `violet-600`, sitting in the 122.8° hole
 *      between crayon-blue and crayon-rose that no house colour occupies.
 *   3. the CONTROL focus ring is not authored at all — ten consecutive tab stops
 *      render `outline-style: auto`, the user agent's own ring, while the board's
 *      cells wear a hand-drawn crayon-blue ghost. Two focus idioms, one of them the
 *      browser's.
 *   4. the sparkle glow is a hardcoded `rgba(196,181,253,…)` — Tailwind `violet-300`
 *      spelled inline, reachable by no token and by no theme.
 *
 * Rows 5 and 6 (the rainbow's AA, the peer band) are GREEN and stay green: the
 * instrument must be able to pass where the estate already holds, or it measures
 * nothing.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { rgbToOklch, hueDist, parseCss, over, ratio } from "./oklch";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

/** The house's own loosest hue-lock, re-derived above. */
const KIN_DEG = 5;

const ANCHORS = [
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
];

/** job → the token that paints it. `EXCEPT` names the two discriminability jobs. */
const ACCENTS: { job: string; token: string; except?: string }[] = [
  { job: "authorship — the digit you write", token: "--color-user-ink" },
  { job: "focus — the keyboard ring", token: "--color-focus-sketch" },
  { job: "progress — the fill meter", token: "--color-progress-ink" },
  { job: "danger — conflicts, refusals", token: "--color-teacher-red" },
  { job: "danger — the verdict's words", token: "--color-red-ink" },
  { job: "celebration — the solved frame", token: "--color-gold-star" },
  { job: "celebration — the verdict's words", token: "--color-gold-ink" },
  { job: "difficulty — easy", token: "--color-green-ink" },
  { job: "difficulty — medium", token: "--color-orange-ink" },
  { job: "selection — the unit wash", token: "--color-crayon-blue" },
  { job: "answer — solver stop 1", token: "--color-solver-ink-1", except: "discriminability" },
  { job: "answer — solver stop 2", token: "--color-solver-ink-2", except: "discriminability" },
  { job: "answer — solver stop 3", token: "--color-solver-ink-3", except: "discriminability" },
  { job: "answer — solver stop 4", token: "--color-solver-ink-4", except: "discriminability" },
  { job: "answer — solver stop 5", token: "--color-solver-ink-5", except: "discriminability" },
];

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page) {
  await page.goto(SOLO);
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

const findings: unknown[] = [];

for (const scheme of ["light", "dark"] as const) {
  test(`§3 kinship — every interactive accent is kin to the house wheel (${scheme})`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    const vals = await resolve(page, [...ANCHORS, ...ACCENTS.map((a) => a.token)]);
    const anchors = ANCHORS.map((a) => {
      const p = parseCss(vals[a])!;
      return { name: a.replace("--color-", ""), ...rgbToOklch(p.r, p.g, p.b) };
    });

    const rows = ACCENTS.map((a) => {
      const p = parseCss(vals[a.token])!;
      const o = rgbToOklch(p.r, p.g, p.b);
      let best = "";
      let bd = 999;
      for (const an of anchors) {
        const d = hueDist(o.h, an.h);
        if (d < bd) {
          bd = d;
          best = an.name;
        }
      }
      return {
        engine: browserName,
        scheme,
        ...a,
        rgb: vals[a.token],
        h: +o.h.toFixed(1),
        C: +o.C.toFixed(3),
        nearest: best,
        hueDist: +bd.toFixed(1),
        kin: bd <= KIN_DEG,
      };
    });
    findings.push(...rows);
    writeFileSync(
      join(OUT, `kinship-${browserName}-${scheme}.json`),
      JSON.stringify({ KIN_DEG, anchors, rows }, null, 2),
    );

    const offFamily = rows.filter((r) => !r.kin && !r.except);
    expect(
      offFamily.map((r) => `${r.token} (${r.job}) h=${r.h} is ${r.hueDist}° from ${r.nearest}`),
      `every non-excepted interactive accent must sit within ${KIN_DEG}° of a crayon anchor`,
    ).toEqual([]);
  });
}

test("§3 kinship — a control's focus ring is drawn in the house's focus ink", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  const sketch = parseCss((await resolve(page, ["--color-focus-sketch"]))["--color-focus-sketch"])!;
  const sketchO = rgbToOklch(sketch.r, sketch.g, sketch.b);

  // Walk real tab stops (`:focus-visible` is the subject, and `el.focus()` does not arm it
  // in either engine), keeping only the CONTROLS — the board's cells wear the drawn ghost
  // and legitimately render `outline: none`.
  const stops: {
    label: string | null;
    outlineStyle: string;
    outlineColor: string;
    boxShadow: string;
    inControls: boolean;
  }[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body) return null;
      const cs = getComputedStyle(a);
      return {
        label: a.getAttribute("aria-label") ?? a.className?.toString().slice(0, 40) ?? null,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        boxShadow: cs.boxShadow === "none" ? "" : cs.boxShadow,
        inControls: !!a.closest(".controls-card") && a.tagName === "BUTTON",
      };
    });
    if (r) stops.push(r);
  }
  writeFileSync(join(OUT, `focus-ring-${browserName}.json`), JSON.stringify(stops, null, 2));

  // VACUITY GUARD, and it is load-bearing rather than ceremony (F1's whole family): PW-WebKit
  // inherits macOS's Full-Keyboard-Access default, so `Tab` walks text fields and board cells
  // and reaches ZERO buttons — 20 stops, 0 controls, measured. A focus-ring gate written the
  // obvious way therefore PASSES in the second engine by having no subject at all. The row
  // refuses that pass and says which engine it could not reach.
  const subjects = stops.filter((s) => s.inControls).length;
  expect(
    subjects,
    `no control was reached by Tab in ${browserName} — the row has no subject, it is not green`,
  ).toBeGreaterThanOrEqual(3);

  // THE CLAIM: the one focus ink this house declares is `--color-focus-sketch`, and the
  // board's cells already wear it. A control's ring must be the same ink, or focus means
  // two different things on one screen.
  const offInk = stops
    .filter((s) => s.inControls)
    .filter((s) => {
      const p = parseCss(s.outlineColor);
      if (!p) return true;
      const o = rgbToOklch(p.r, p.g, p.b);
      return o.C < 0.02 || hueDist(o.h, sketchO.h) > KIN_DEG;
    })
    .map((s) => `${s.label} → ${s.outlineStyle} ${s.outlineColor}`);
  expect(
    Array.from(new Set(offInk)),
    "a focused control's ring must be drawn in --color-focus-sketch",
  ).toEqual([]);
});

test("§3 kinship — no chromatic accent is spelled outside the token estate", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  // The sparkle's glow is the census's one INLINE chromatic literal on an interactive
  // surface (GameControlPanel.vue:2081 / :2087). A theme cannot reach it and a re-cut
  // cannot find it by grepping the token names.
  const glow = await page.evaluate(() => {
    const el = document.querySelector(".sparkle-icon");
    return el ? getComputedStyle(el).filter : "";
  });
  writeFileSync(join(OUT, `inline-literals-${browserName}.json`), JSON.stringify({ glow }, null, 2));
  const literals = /drop-shadow\([^)]*(rgb|rgba|color)\(/.test(glow) ? [glow] : [];
  expect(literals, "no interactive surface may paint a colour no token names").toEqual([]);
});

test("§3 kinship — the EXCEPTIONS pay their a11y toll (this row is green and stays green)", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const vals = await resolve(page, [
    "--color-card",
    "--color-background",
    "--color-solver-ink-1",
    "--color-solver-ink-2",
    "--color-solver-ink-3",
    "--color-solver-ink-4",
    "--color-solver-ink-5",
  ]);
  const card = parseCss(vals["--color-card"])!;

  // THE RAINBOW pays at the AA TEXT floor: it writes digits, at body size, on the papers.
  const rainbow = [1, 2, 3, 4, 5].map((i) => {
    const p = parseCss(vals[`--color-solver-ink-${i}`])!;
    return { stop: i, ratio: +ratio(p, card).toFixed(2) };
  });
  for (const r of rainbow) expect(r.ratio, `solver stop ${r.stop} on --color-card`).toBeGreaterThanOrEqual(4.5);

  // THE PEER WALK pays at its declared LIGHTNESS BAND, over every index a room can deal.
  // `--peer-ink-l` light = 0.5, chroma 0.11, hue = i × 137.5°: the walk is the whole point,
  // so what is asserted is the BAND, which is what makes the claim structural.
  // A computed `oklch()` comes back AS `oklch(…)` in both engines, so the ratio is taken
  // off the DEVICE pixel the browser would actually paint — a 1×1 canvas fill, which is
  // the same gamut mapping the glyph's stroke receives.
  const worst = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d")!;
    const out: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      probe.style.setProperty(
        "color",
        `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`,
      );
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = getComputedStyle(probe).color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out.push([d[0], d[1], d[2]]);
    }
    probe.remove();
    return out;
  });
  const ratios = worst.map(([r, g, b]) => ratio({ r, g, b }, card));
  const min = Math.min(...ratios);
  writeFileSync(
    join(OUT, "exception-toll.json"),
    JSON.stringify({ rainbow, peerWorst: +min.toFixed(2), peerCount: ratios.length }, null, 2),
  );
  expect(min, "the peer-ink lightness band over 40 indices on --color-card").toBeGreaterThanOrEqual(4.5);

  // And the wash a selection paints must still clear the 1.4.11 non-text floor against the
  // paper under it — the 7% crayon-blue that marks your unit.
  const blue = parseCss((await resolve(page, ["--color-crayon-blue"]))["--color-crayon-blue"])!;
  const wash = over({ ...blue, a: 0.07 }, card);
  const washRatio = ratio(wash, card);
  expect(washRatio, "the 7% unit wash is a WASH, not a boundary — it is not asked to clear 3:1").toBeLessThan(3);
});
