#!/usr/bin/env node
/**
 * THE INK WITNESS — ship 4's six re-pitched surfaces, RENDERED, in BOTH engines (pass 5, Lane D).
 *
 * Pass 4 witnessed these surfaces with twelve chromium crops from a rig that never entered the
 * repo; the pass-4 registry booked four minors against it and three of them are about this run:
 * chromium-only on a WebKit campaign, no BEFORE arm, and no log banked (the rig swallowed a
 * failed crop into stderr nobody kept). This rig answers all three on its own terms.
 *
 * WHAT IT IS, AND THE DISCLAIMER PASS 4 OWED — READ THIS BEFORE READING THE CROPS.
 * These are witnesses of a STATE, not of a MOVEMENT. There is no BEFORE arm here and there is
 * not going to be one: the pre-ship-4 values were open-coded percentages that no longer exist in
 * any tree the loop can build without reverting five files, and a reverted-tree crop would
 * witness a fabrication rather than a history. What the rig prints instead is the AFTER reading
 * measured — computed ink, computed paper, and the WCAG contrast between them — beside the
 * pre-ship-4 ratio the dossier recorded, so the movement is legible as two numbers on one line
 * without either of them pretending to be a photograph of the past. The gate that actually stops
 * a regression is `check-ink-pressure.mjs` closure 4 (in the repo, in CI); this rig is the eye.
 *
 *   node ink-witness.mjs [--base http://127.0.0.1:4253] [--out ../shots]
 *
 * Exit 1 if any surface is unreachable in any engine — a swallowed crop is the defect pass 4
 * shipped, so an unreachable surface is a RED here and it is printed to stderr by name.
 */
import { chromium, webkit } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : d;
};
const BASE = arg("--base", "http://127.0.0.1:4253");
const OUT = resolve(HERE, arg("--out", "../shots"));
const SCENE = "/?size=3&difficulty=EASY";

/** The six, with the ratio ship 4 moved them off — the dossier's number, cited not re-measured. */
const SURFACES = {
  1: { sel: ".keyboard-legend", was: "55% · 3.53:1 light / 4.36:1 dark", scene: "legend" },
  2: { sel: ".legend-row kbd", was: "40% · 2.36:1 light / 2.87:1 dark", scene: "legend", prop: "borderTopColor" },
  3: { sel: ".legend-sep", was: "opacity 0.7 · 2.877:1", scene: "legend" },
  4: { sel: ".margin-note-meta", was: "62% · 4.34:1 light", scene: "solved" },
  5: { sel: ".icon-sublabel.is-armed", was: "crayon-rose · sub-AA in light", scene: "armed" },
  6: { sel: ".vignette-meta", was: "62% · 4.34:1 light", scene: "solved" },
};

const lum = ([r, g, b]) => {
  const f = (v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Parse the two notations the engines actually return and keep the ALPHA.
 *  Chromium/WebKit both serialise a `color-mix(… N%, transparent)` as
 *  `color(srgb r g b / a)` with r,g,b in 0..1 — reading the first three numbers as 0..255
 *  (the obvious spelling) produces a contrast figure that is off by two orders of magnitude.
 *  This is the same class of defect the lane is here to correct, so it is parsed, not eyeballed. */
function parse(str) {
  const s = String(str);
  const n = (s.match(/-?[\d.]+(?:e-?\d+)?/g) ?? []).map(Number);
  if (s.startsWith("color(")) {
    const [r, g, b, a = 1] = n;
    return { rgb: [r * 255, g * 255, b * 255], a };
  }
  const [r, g, b, a = 1] = n;
  return { rgb: [r, g, b], a };
}
/** ink over paper at the ink's own alpha — the rendered pixel, which is what a witness is for */
const overPaper = (ink, paper) =>
  parse(ink).rgb.map((c, i) => parse(ink).a * c + (1 - parse(ink).a) * parse(paper).rgb[i]);

/** computed ink + the paper it lands on, walking up for the first non-transparent background */
async function read(page, sel, prop = "color") {
  return page.evaluate(
    ([sel, prop]) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      let paper = null;
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba?\([^)]*,\s*0\)/.test(bg) && bg !== "transparent") {
          paper = bg;
          break;
        }
      }
      const r = el.getBoundingClientRect();
      return {
        ink: cs[prop],
        opacity: cs.opacity,
        paper: paper ?? getComputedStyle(document.body).backgroundColor,
        box: { x: r.x, y: r.y, w: r.width, h: r.height },
        visible: r.width > 0 && r.height > 0,
      };
    },
    [sel, prop],
  );
}

async function settle(page) {
  await page.goto(BASE + SCENE, { waitUntil: "load" });
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await page.waitForTimeout(1200);
}

/** Crop, CLAMPED to the viewport. An unclamped clip throws "Clipped area is either empty or
 *  outside the resulting image" — which is precisely the class of failure the pass-4 rig
 *  swallowed into an unbanked stderr. Here it is caught, named, and counted as a miss. */
async function crop(page, name, box) {
  const pad = 8;
  const vp = page.viewportSize() ?? { width: 1280, height: 800 };
  const x = Math.min(Math.max(0, box.x - pad), vp.width - 4);
  const y = Math.min(Math.max(0, box.y - pad), vp.height - 4);
  const clip = {
    x,
    y,
    width: Math.max(4, Math.min(box.w + pad * 2, vp.width - x)),
    height: Math.max(4, Math.min(box.h + pad * 2, vp.height - y)),
  };
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file, clip });
  return file;
}

/** read + crop as one witness; a failure of either half is a named miss, never a silent gap */
async function witness(page, n, s, misses, engine, theme, tag) {
  try {
    await page
      .locator(s.sel)
      .first()
      .scrollIntoViewIfNeeded({ timeout: 4000 })
      .catch(() => {});
    const r = await read(page, s.sel, s.prop);
    if (!r?.visible) {
      misses.push(`${engine}/${theme}: surface ${n} ${s.sel} unreachable (${tag})`);
      return null;
    }
    const shot = await crop(page, `${n}-${s.sel.replace(/[^\w]+/g, "-")}-${theme}-${engine}`, r.box);
    return {
      engine,
      theme,
      n,
      sel: s.sel,
      was: s.was,
      ...r,
      cr: Number(contrast(overPaper(r.ink, r.paper), parse(r.paper).rgb).toFixed(2)),
      shot,
    };
  } catch (e) {
    misses.push(`${engine}/${theme}: surface ${n} ${s.sel} witness threw (${tag}) — ${e.message.split("\n")[0]}`);
    return null;
  }
}

const results = [];
const misses = [];

for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();

  // ── the desktop arm: the three legend surfaces need (hover: hover) and (pointer: fine),
  //    and `.vignette-meta` is display:none at every docked rung, so 1700×1000 is not a
  //    flourish — a 1280 crop shows none of the ink ship 4 moved (pass-4 §5's own finding).
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1700, height: 1000 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await settle(page);

    for (const n of [1, 2, 3]) {
      const w = await witness(page, n, SURFACES[n], misses, name, theme, "legend scene");
      if (w) results.push(w);
    }

    // Solve → the completion surfaces. `meta` is v-if'd, so the vignette and the margin note
    // do not exist until a board completes; this is the state, driven through the app's own
    // button, not a fixture.
    await page.click('button[aria-label="Solve puzzle"]');
    await page
      .waitForSelector(".vignette-meta, .margin-note-meta", { timeout: 25000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
    for (const n of [6]) {
      const w = await witness(page, n, SURFACES[n], misses, name, theme, "after Solve @1700");
      if (w) results.push(w);
    }
    await ctx.close();

    // Surface 4 lives at the OTHER end of the same ruling. `.vignette-meta` is docked-hidden
    // below 1280 and the strip below the board keeps the tally there, so the margin note's
    // meta is v-if'd away at 1700 and only exists at a narrower fine-pointer width. One
    // width cannot witness both; pass 4 cropped 4 and 6 from one context and this is why the
    // pair reads oddly there.
    const narrow = await browser.newContext({
      viewport: { width: 1100, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    const np = await narrow.newPage();
    await settle(np);
    await np.click('button[aria-label="Solve puzzle"]');
    await np.waitForSelector(".margin-note-meta", { timeout: 25000 }).catch(() => {});
    await np.waitForTimeout(1500);
    const w4 = await witness(np, 4, SURFACES[4], misses, name, theme, "after Solve @1100");
    if (w4) results.push(w4);
    await narrow.close();
  }

  // ── the coarse arm: `.icon-sublabel.is-armed` gates on `isCoarse && isDirty`, so it does not
  //    exist on a desktop pointer at all. Its witness takes a touch context, dirties one cell
  //    and taps Clear once (pass-4 §5's second forced fact).
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: name === "chromium",
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await settle(page);
    // `clearArmed` gates on `isCoarse && props.isDirty` AND re-disarms after a 2.5 s lapse, so
    // the witness has to dirty the board FIRST and then read inside the window. Three attempts,
    // each verified through the button's own aria-label rather than through a sleep.
    let w = null;
    for (let attempt = 1; attempt <= 3 && !w; attempt++) {
      const empty = page.locator(".sudoku-cell:not(.is-given)").nth(attempt - 1);
      await empty.tap().catch(async () => empty.click().catch(() => {}));
      await page.keyboard.press(String(attempt)).catch(() => {});
      await page.waitForTimeout(500);
      const clear = page.locator('button[aria-label="Clear board"]');
      if (!(await clear.count())) continue; // already armed from a previous attempt
      await clear.tap().catch(async () => clear.click().catch(() => {}));
      await page
        .waitForSelector(".icon-sublabel.is-armed", { timeout: 2000 })
        .catch(() => {});
      w = await witness(page, 5, SURFACES[5], attempt === 3 ? misses : [], name, theme, `coarse + dirty + one tap (attempt ${attempt})`);
    }
    if (w) results.push(w);
    await ctx.close();
  }

  await browser.close();
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "witness.json"), JSON.stringify({ base: BASE, results, misses }, null, 2));

console.log(
  `INK WITNESS — ship 4's six surfaces, rendered, both engines. STATE, not movement (see header).\n`,
);
console.log(" # engine    theme  surface                   computed ink                 paper                       AFTER    ship-4 moved it off");
for (const r of results.sort((a, b) => a.n - b.n || a.engine.localeCompare(b.engine) || a.theme.localeCompare(b.theme))) {
  console.log(
    ` ${r.n} ${r.engine.padEnd(9)} ${r.theme.padEnd(6)} ${r.sel.padEnd(24)} ${String(r.ink).padEnd(28)} ${String(r.paper).padEnd(26)} ${String(r.cr).padStart(6)}   ${r.was}`,
  );
}
console.log(`\n${results.length} witnesses · ${misses.length} unreachable`);
if (misses.length) {
  for (const m of misses) console.error(`  ✗ ${m}`);
  process.exit(1);
}
