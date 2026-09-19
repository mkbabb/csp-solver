/**
 * acc-six.kinship.probe.ts — ACC-SIX pass 1. R2's born-RED kinship instrument, RE-RUN
 * (not re-written) under this family's overlay, with the anchor ruling recorded HERE, in
 * the probe's own file, as the charter requires.
 *
 * ── THE RULING THIS LANE RECORDS (and it is a widening of the ANCHOR SET, not a third
 *    exception) ──────────────────────────────────────────────────────────────────────
 * R2's law: an accent is kin when its OKLCH hue is within KIN_DEG = 5° of one of FIVE
 * crayon anchors; two jobs (the solver rainbow, the peer walk) are declared exceptions
 * that pay an a11y toll.
 *
 * ACC-SIX does not touch KIN_DEG (still 5°) and does not add an exception. It adds a
 * SIXTH ANCHOR at OKLCH hue 293.0°, the centre of the wheel's one hole (122.8° between
 * crayon-blue 251.4° and crayon-rose 14.2°, R2 §2). The anchor is not invented: 293.0° is
 * the hue of `--color-solver-ink-2` light AND `--color-progress-ink` dark, which are the
 * SAME hex (#7c3aed) — the colour is already in the tree twice under two names.
 *
 * The two arms differ in WHAT KIND of anchor it is, and that is the whole fork:
 *   arm (a) — a sixth WAX (a crayon), so the anchor carries a wax tier + an ink tier and
 *             is subject to the crayon dark law (index.css:164-169).
 *   arm (b) — an INK-ONLY anchor (the answer's material): no wax tier, no dark law, a
 *             three-rung lightness ladder whose rung is chosen by the GROUND.
 *
 * Under BOTH arms the exception list stays at TWO and the rainbow's exception SHRINKS:
 * stop 2 is now kin BY NAME (0.0–0.6° from the sixth anchor), so four stops are excepted
 * where five were. That is the law afterwards, stated: *an accent is kin when its hue is
 * within 5° of one of SIX house anchors — five crayons and one answer-hue; the declared
 * exceptions remain the peer walk and the four rainbow stops that are not the sixth.*
 *
 * Rows: 1 kin(light) · 2 kin(dark) · 3 control ring (NOT this family's row — it belongs to
 * §6's focus idiom and stays RED under every arm; its subject-count vacuity guard stands)
 * · 4 off-token literals · 5 the exceptions' toll (green, and must stay green).
 *
 *   ACC_SIX_ARM=HEAD|a|b npx playwright test --config .../acc-six.config.ts
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { rgbToOklch, hueDist, parseCss, over, ratio } from "./oklch";
import { overlayFor, type Arm } from "../proto/overlay";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-SIX/census";
mkdirSync(OUT, { recursive: true });

const ARM = (process.env.ACC_SIX_ARM ?? "HEAD") as Arm;

/** UNCHANGED from R2. A constraint on cures, never a dial. */
const KIN_DEG = 5;

const FIVE = [
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
];
/** The sixth anchor, resolved live: arm (a) reads the wax token, arm (b) reads the
 *  ladder's DEEP rung, which is the hue the whole ladder shares. */
const SIXTH = ARM === "a" ? "--color-crayon-violet" : ARM === "b" ? "--color-answer-deep" : null;
const ANCHORS = SIXTH ? [...FIVE, SIXTH] : FIVE;

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
  // stop 2 is NOT excepted under an arm: the ruling above makes it kin by name, and an
  // instrument that keeps excepting it cannot see whether the cure worked.
  { job: "answer — solver stop 2", token: "--color-solver-ink-2", ...(ARM === "HEAD" ? { except: "discriminability" } : {}) },
  { job: "answer — solver stop 3", token: "--color-solver-ink-3", except: "discriminability" },
  { job: "answer — solver stop 4", token: "--color-solver-ink-4", except: "discriminability" },
  { job: "answer — solver stop 5", token: "--color-solver-ink-5", except: "discriminability" },
];

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page) {
  const css = overlayFor(ARM);
  if (css) await page.addInitScript((c: string) => {
    const add = () => {
      const s = document.createElement("style");
      s.id = "acc-six-overlay";
      s.textContent = c;
      document.head.appendChild(s);
    };
    if (document.head) add();
    else document.addEventListener("DOMContentLoaded", add);
  }, css);
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  // The overlay is appended LAST in <head>, after the app's own stylesheet, so its
  // `:root` / `.dark` blocks win by source order at equal specificity. Assert it landed
  // rather than trusting it — a silent no-op overlay is the loudest vacuous green there is.
  if (css) {
    const ok = await page.evaluate(() => !!document.getElementById("acc-six-overlay"));
    expect(ok, "the arm's overlay must be present in the document").toBe(true);
  }
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

for (const scheme of ["light", "dark"] as const) {
  test(`§3 kinship [${ARM}] — every interactive accent is kin to the house wheel (${scheme})`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    const vals = await resolve(page, [...ANCHORS, ...ACCENTS.map((a) => a.token)]);
    const anchors = ANCHORS.map((a) => {
      const p = parseCss(vals[a])!;
      return { name: a.replace("--color-", ""), hex: vals[a], ...rgbToOklch(p.r, p.g, p.b) };
    });

    const rows = ACCENTS.map((a) => {
      const p = parseCss(vals[a.token])!;
      const o = rgbToOklch(p.r, p.g, p.b);
      let best = "";
      let bd = 999;
      for (const an of anchors) {
        const d = hueDist(o.h, an.h);
        if (d < bd) { bd = d; best = an.name; }
      }
      return {
        engine: browserName, scheme, arm: ARM, ...a, rgb: vals[a.token],
        L: +o.L.toFixed(4), h: +o.h.toFixed(1), C: +o.C.toFixed(3),
        nearest: best, hueDist: +bd.toFixed(1), kin: bd <= KIN_DEG,
      };
    });

    writeFileSync(
      join(OUT, `kinship-${ARM}-${browserName}-${scheme}.json`),
      JSON.stringify(
        {
          arm: ARM, KIN_DEG, anchorCount: anchors.length,
          ruling:
            ARM === "HEAD"
              ? "none — this is the control run, R2's five anchors verbatim"
              : `SIXTH ANCHOR at OKLCH h≈293.0 (${SIXTH}); KIN_DEG unchanged at 5°; the EXCEPTED set is NOT grown — solver stop 2 leaves it and is kin by name, so four rainbow stops are excepted where five were`,
          anchors, rows,
        },
        null, 2,
      ),
    );

    const offFamily = rows.filter((r) => !r.kin && !r.except);
    expect(
      offFamily.map((r) => `${r.token} (${r.job}) h=${r.h} is ${r.hueDist}° from ${r.nearest}`),
      `every non-excepted interactive accent must sit within ${KIN_DEG}° of an anchor (${anchors.length} anchors, arm ${ARM})`,
    ).toEqual([]);
  });
}

test(`§3 kinship [${ARM}] — no chromatic accent is spelled outside the token estate`, async ({
  page, browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const glow = await page.evaluate(() => {
    const el = document.querySelector(".sparkle-icon");
    return el ? getComputedStyle(el).filter : "";
  });
  writeFileSync(join(OUT, `literals-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, glow }, null, 2));
  // The row's subject must exist, or it passes by having nothing to look at.
  expect(glow, "the sparkle icon must be on the page for this row to mean anything").not.toBe("");
  // A token-resolved drop-shadow still prints as rgba() in `filter`, so the row cannot be
  // "is there an rgb() in the string" any more. What it asserts is the DECLARED value:
  // the rule that paints it must reference a custom property.
  // A CSSOM rule walk is NOT the subject: it reads "" in PW-WebKit on this tree (0 matching
  // rules, measured), which would pass the row by having nothing to look at — the same
  // vacuity R2's §4.1 guard exists to refuse. The subject is the PAINTED colour: pull the
  // colour out of the computed `filter`, resolve both it and the token through the engine's
  // own canvas, and assert they are the SAME DEVICE BYTES. At HEAD no such token exists, so
  // the row is red by definition; under an arm it is green iff a token now names the paint.
  //
  // An `addStyleTag` overlay can only ADD a rule, never DELETE the SFC's own, so green here
  // means "the paint now comes from a token", NOT "the literal is gone". The real cure
  // deletes GameControlPanel.vue:2081 and :2087.
  const read = await page.evaluate(() => {
    const el = document.querySelector(".sparkle-icon");
    const filter = el ? getComputedStyle(el).filter : "";
    const m = /drop-shadow\((.*?)\s+[-\d.]+px/.exec(filter);
    const painted = m ? m[1] : "";
    const p = document.createElement("div");
    p.style.position = "fixed"; p.style.left = "-9999px";
    document.body.appendChild(p);
    p.style.setProperty("color", "var(--color-sparkle-glow)");
    const tokenColor = getComputedStyle(p).color;
    const hasToken = !!getComputedStyle(document.documentElement).getPropertyValue("--color-sparkle-glow").trim();
    const cv = document.createElement("canvas"); cv.width = cv.height = 1;
    const ctx = cv.getContext("2d")!;
    const dev = (s: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "rgb(255,255,255)"; ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = s; ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return `${d[0]},${d[1]},${d[2]}`;
    };
    // the token at the SAME 30% over white, so the two are comparable byte for byte.
    // `ctx.fillStyle` does NOT resolve `var()`, so the token is resolved through
    // getComputedStyle FIRST and handed to the canvas as literal channels — the trap that
    // made this row read 255,255,255 (pure white, i.e. fillStyle rejected the string and
    // kept the previous paint) on its first pass.
    const tm = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(tokenColor);
    const tokenAt30 = hasToken && tm ? dev(`rgba(${tm[1]}, ${tm[2]}, ${tm[3]}, 0.3)`) : null;
    const out = { filter, painted, paintedDev: painted ? dev(painted) : null, tokenColor, hasToken, tokenAt30 };
    p.remove();
    return out;
  });
  writeFileSync(join(OUT, `literals-declared-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, ...read }, null, 2));
  expect(read.filter, "the sparkle glow must be painted for this row to have a subject").not.toBe("");
  expect(read.paintedDev, "the painted glow must decode").not.toBeNull();
  const named = read.hasToken && read.paintedDev === read.tokenAt30;
  expect(
    named ? [] : [`${read.painted} — token present: ${read.hasToken}; token@30%: ${read.tokenAt30}; painted: ${read.paintedDev}`],
    "no interactive surface may paint a colour no token names",
  ).toEqual([]);
});

test(`§3 kinship [${ARM}] — the EXCEPTIONS pay their a11y toll (green, and stays green)`, async ({
  page, browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const vals = await resolve(page, [
    "--color-card", "--color-background",
    "--color-solver-ink-1", "--color-solver-ink-2", "--color-solver-ink-3",
    "--color-solver-ink-4", "--color-solver-ink-5",
  ]);
  const card = parseCss(vals["--color-card"])!;
  const rainbow = [1, 2, 3, 4, 5].map((i) => {
    const p = parseCss(vals[`--color-solver-ink-${i}`])!;
    return { stop: i, hex: vals[`--color-solver-ink-${i}`], ratio: +ratio(p, card).toFixed(2) };
  });
  for (const r of rainbow)
    expect(r.ratio, `solver stop ${r.stop} on --color-card`).toBeGreaterThanOrEqual(4.5);

  const walk = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.position = "fixed"; probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const cv = document.createElement("canvas"); cv.width = cv.height = 1;
    const ctx = cv.getContext("2d")!;
    const out: { i: number; hue: number; px: [number, number, number] }[] = [];
    for (let i = 0; i < 40; i++) {
      const hue = +((i * 137.5) % 360).toFixed(1);
      probe.style.setProperty("color", `oklch(var(--peer-ink-l) 0.11 ${hue}deg)`);
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = getComputedStyle(probe).color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out.push({ i, hue, px: [d[0], d[1], d[2]] });
    }
    probe.remove();
    return out;
  });
  const ratios = walk.map((w) => ratio({ r: w.px[0], g: w.px[1], b: w.px[2] }, card));
  const min = Math.min(...ratios);

  // ── A ROW ADDED BESIDE R2's, BORN-RED BY MEASUREMENT, NOT BY CONSTRUCTION ────────
  // The walk declares chroma 0.110 at every hue. sRGB does not have 0.110 at every hue at
  // `--peer-ink-l` 0.5: the ceiling at the gold/orange arc is ~0.102 (probe/sixth-window.mjs
  // §3). So SOME indices are gamut-CLIPPED and the ink a player receives is not the ink the
  // formula names — which is a fact §12's palette has to own. Measured, not asserted:
  const clipped = walk
    .map((w) => {
      const o = rgbToOklch(w.px[0], w.px[1], w.px[2]);
      return { i: w.i, hue: w.hue, paintedC: +o.C.toFixed(4), paintedH: +o.h.toFixed(1), deltaC: +(0.11 - o.C).toFixed(4) };
    })
    .filter((x) => x.deltaC > 0.004);

  writeFileSync(
    join(OUT, `exception-toll-${ARM}-${browserName}.json`),
    JSON.stringify({ arm: ARM, rainbow, peerWorst: +min.toFixed(2), peerCount: ratios.length, clippedIndices: clipped }, null, 2),
  );
  expect(min, "the peer-ink lightness band over 40 indices on --color-card").toBeGreaterThanOrEqual(4.5);
});
