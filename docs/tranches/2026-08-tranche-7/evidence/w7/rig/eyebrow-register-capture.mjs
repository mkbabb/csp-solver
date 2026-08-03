/**
 * W7 · CH-59 / T7-R15 — the eyebrow's two registers, rendered for the chair.
 *
 * The card runs TWO naming registers today (the `.section-heading` display eyebrow over the
 * staged inputs; the `SheetWashiLabel anchor="tag"` tape over the four wells). The read the row
 * is owed is what ONE register looks like, each way, on the real surface. This rig renders both
 * and the shipped mix, same board, same session, three shots per cell.
 *
 * THE MOCK IS CSS, NOT A SOURCE EDIT — deliberately. W7 runs several executors inside
 * `GameControlPanel.vue` at once (the sticky-bar row, the invite glyph, the kenken receipt);
 * a temporary template edit + revert in a shared dirty tree races a sibling's write and can
 * silently eat it. The register question is a TYPE question — face, rung, weight, paper — so an
 * injected stylesheet renders it exactly, on the real running app, and touches nothing on disk.
 * Both mock sheets are printed verbatim into eyebrow-read.md.
 *
 * Usage: node eyebrow-register-capture.mjs            (BASE defaults to :4238)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const BASE = process.env.BASE || "http://localhost:4238";
const OUT = new URL("../", import.meta.url).pathname;
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
// ESM resolves bare specifiers against THIS file's directory, and this file lives in docs/;
// the driver is the frontend's own pinned copy, reached by path.
const { chromium } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);

// ── REGISTER A — one register: the display eyebrow ────────────────────────────────
// The four wells' names leave the tape and take `.section-heading`'s own declarations
// (typography.css §.section-heading): display face, √φ subheading rung / φ at ≥768, weight 800,
// lowercase, wide tracking, centred then left. Size/Difficulty are already there and untouched.
const REGISTER_A = `
.tray-well .washi-tag {
  position: static !important;
  transform: none !important;
  clip-path: none !important;
  background: transparent !important;
  padding: 0 0 0.1rem 0 !important;
  font-family: var(--font-display) !important;
  font-size: var(--type-subheading) !important;
  line-height: var(--type-leading-heading) !important;
  font-weight: 800 !important;
  letter-spacing: var(--type-tracking-wide) !important;
  text-transform: lowercase !important;
  text-align: center !important;
  color: var(--color-foreground) !important;
}
@media (min-width: 768px) {
  .tray-well .washi-tag {
    font-size: var(--type-heading) !important;
    text-align: left !important;
    padding-left: 0.75rem !important;
  }
}
`;

// ── REGISTER B — one register: the washi tape ─────────────────────────────────────
// Size/Difficulty leave the eyebrow and take `.washi-tag`'s own declarations
// (SheetWashiLabel.vue §.washi-tag): hand face, caption rung, weight 500, lowercase, wide
// tracking, laid on tinted paper with torn ends and a tilt. The wells are untouched. The tilt
// and tear are fixed here rather than seeded — the component seeds them per label; a stylesheet
// has one polygon to give.
const REGISTER_B = `
.section-heading {
  font-family: var(--font-hand) !important;
  font-size: var(--type-caption) !important;
  font-weight: 500 !important;
  line-height: 1.35 !important;
  letter-spacing: var(--type-tracking-wide) !important;
  text-transform: lowercase !important;
  background: var(--sheet-washi-neutral) !important;
  padding: 0.02rem 0.4rem !important;
  display: inline-block !important;
  align-self: center;
  text-align: center !important;
  clip-path: polygon(2.4% 0%, 98.1% 6.2%, 100% 50%, 96.4% 93.8%, 4.1% 100%, 0% 50%);
  transform: rotate(-0.9deg);
}
@media (min-width: 768px) {
  .section-heading {
    align-self: flex-start;
    margin-left: 0.85rem;
    text-align: left !important;
  }
}
`;

// ── UNROLL — applied to ALL three shots, so the compare is fair ───────────────────
// `.controls-card` is a scrollport at both cells (scene.css: `max-height` + `overflow-y:auto`
// at ≥1024, and again inside the portrait sheet), so a viewport crop shows the staged eyebrows
// and ONE tape, with the other three wells below the card's own fold. A register read needs the
// whole naming set in one frame, so the crop unrolls the scrollport and un-sticks the bar that
// rides its bottom edge. This changes NO type — it is the camera, not the subject.
// The page is a fixed-height, centered box (`.page-root` is `h-screen`, `main.main-content` is
// `justify-center`), so an unrolled card grows UPWARD as well as down: measured, the card's top
// went to y = −58.8 and `new game` + `size` — the first two names the read is about — sat above
// the document origin where no clip can reach them. Top-aligning the page and letting it grow
// downward is part of the camera, not the subject; no type declaration is touched.
const UNROLL = `
.controls-card { max-height: none !important; overflow: visible !important; }
.action-bar { position: static !important; }
.page-root { height: auto !important; min-height: 100vh !important; }
.main-content { justify-content: flex-start !important; }
.app-layout { align-items: flex-start !important; }
/* The portrait sheet is \`position: fixed\` with its own \`max-height: calc(100dvh - 12rem)\`
   (scene.css), so it neither grows the document nor lets the unrolled card past 652px — the
   register-A card is 774. Pinned to the viewport's top edge, unrolled, the whole card is in
   frame at 390×844 and the crop needs no second frame. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .scene-controls {
    top: 0 !important;
    translate: none !important;
    max-height: none !important;
  }
}
`;

const CELLS = [
  { vp: "1440x900", width: 1440, height: 900, mobile: false },
  { vp: "390x844", width: 390, height: 844, mobile: true },
];
const THEMES = ["light", "dark"];
const REGISTERS = [
  ["shipped", null],
  ["A", REGISTER_A],
  ["B", REGISTER_B],
];

const md5 = (p) => execSync(`md5 -q ${ROOT}/${p}`).toString().trim();
const WATCHED = [
  "web/frontend/src/games/shared/GameControlPanel.vue",
  "web/frontend/src/pencil/sheet/SheetWashiLabel.vue",
  "web/frontend/src/assets/typography.css",
];

// The dev-only FilterTuner floats over the sheet. Dev chrome, not product surface.
const HIDE_DEV = `.tuner-toggle { display: none !important; }`;

async function settle(page, mobile) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 20000 },
  );
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 20000,
  });
  if (mobile) {
    const open = await page.locator("#controls-drawer .drawer-case").isVisible();
    if (!open) {
      await page.locator(".drawer-tab").tap();
      await page.waitForSelector("#controls-drawer .drawer-case", {
        state: "visible",
        timeout: 10000,
      });
      await page.waitForTimeout(900); // the Band-D glide's own clock, then settle
    }
  }
  await page.evaluate(() => document.fonts.ready);
}

/**
 * THE SHARED-TREE HAZARD, INSTRUMENTED. W7's other executors are saving files in `src/` while
 * this runs, and any save the dev server can't hot-patch full-reloads the page — which silently
 * strips every injected stylesheet. The first pass of this rig lost the dev-chrome hide exactly
 * that way and banked a shot with the `fx` toggle in it.
 *
 * So: one stylesheet per shot, injected immediately before it, and the shot only counts if the
 * page can prove the sheet is live. `stamp` is a marker property read back off a real element.
 */
async function proveApplied(page, register) {
  return page.evaluate((reg) => {
    const tuner = document.querySelector(".tuner-toggle");
    const tag = document.querySelector(".controls-card .washi-tag");
    const head = document.querySelector(".controls-card .section-heading");
    const card = document.querySelector(".controls-card");
    if (!tag || !head || !card) return { ok: false, why: "card not mounted" };
    const cs = (el) => getComputedStyle(el);
    const devHidden = !tuner || cs(tuner).display === "none";
    const unrolled = cs(card).overflow === "visible";
    const tagFace = cs(tag).fontFamily;
    const headFace = cs(head).fontFamily;
    const headPaper = cs(head).backgroundColor;
    const stamp =
      reg === "A"
        ? tagFace.includes("Fraunces")
        : reg === "B"
          ? headFace.includes("Patrick Hand") && headPaper !== "rgba(0, 0, 0, 0)"
          : tagFace.includes("Patrick Hand") && headFace.includes("Fraunces");
    return {
      ok: devHidden && unrolled && stamp,
      devHidden,
      unrolled,
      stamp,
      tagFace,
      headFace,
      headPaper,
    };
  }, register);
}

/**
 * The card's own box in PAGE coordinates, padded.
 *
 * `locator.screenshot()` was tried first and is wrong here: the unrolled card is taller than
 * either viewport, Playwright scrolls it into view to shoot it, and the card's top slides under
 * the masthead — which then paints over `new game` and `size`, the two names the read is about.
 * A page-coordinate clip off a `fullPage` shot has no such seam.
 */
async function cardClip(page, sel, pad = 10) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  const bb = await page.locator(sel).first().boundingBox();
  if (!bb) throw new Error(`no box for ${sel}`);
  const doc = await page.evaluate(() => ({
    x: window.scrollX,
    y: window.scrollY,
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));
  const x = Math.max(0, bb.x + doc.x - pad);
  const y = Math.max(0, bb.y + doc.y - pad);
  // Clamp to the page — a clip wider than the document bands the shot with black.
  return {
    x,
    y,
    width: Math.min(bb.width + pad * 2, doc.w - x),
    height: Math.min(bb.height + pad * 2, doc.h - y),
  };
}

/** Every visible name on the card, with the rank it is written at and what that rank costs. */
async function census(page) {
  return page.evaluate(() => {
    const sel =
      ".controls-card .section-heading, .controls-card .washi-tag, .controls-card .zone-row-label";
    const rank = (el) =>
      el.classList.contains("section-heading")
        ? "eyebrow"
        : el.classList.contains("washi-tag")
          ? "tape"
          : "caption";
    const names = [...document.querySelectorAll(sel)]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(el).opacity !== "0";
      })
      .map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: el.textContent.trim(),
          rank: rank(el),
          face: cs.fontFamily.split(",")[0].replace(/"/g, ""),
          size: cs.fontSize,
          weight: cs.fontWeight,
          paper: cs.backgroundColor,
          h: +el.getBoundingClientRect().height.toFixed(2),
        };
      });
    // THE SUBSET ARM, scoped to the card's names. Same mechanism as `e2e/font-census.spec.ts`:
    // resolve each name's first family against that face's DECLARED unicode-range, read off the
    // live stylesheet, after the element's own text-transform. A codepoint outside the range
    // doesn't fail to paint — it drops to the next family, and the string comes out in two
    // faces. Both subset faces here are cut from the strings they render TODAY, so moving a
    // name between registers is also a question about the cut.
    const ranges = {};
    for (const sheet of [...document.styleSheets]) {
      let rules;
      try {
        rules = [...sheet.cssRules];
      } catch {
        continue;
      }
      for (const r of rules) {
        if (!r.style || !r.style.getPropertyValue("unicode-range")) continue;
        const fam = r.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
        const set = new Set();
        for (const m of r.style
          .getPropertyValue("unicode-range")
          .matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)) {
          const a = parseInt(m[1], 16);
          const b = m[2] ? parseInt(m[2], 16) : a;
          for (let c = a; c <= b; c++) set.add(c);
        }
        if (set.size) ranges[fam] = set;
      }
    }
    const mixed = [];
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      const set = ranges[fam];
      if (!set) continue;
      let shown = el.textContent.trim();
      if (cs.textTransform === "lowercase") shown = shown.toLowerCase();
      if (cs.textTransform === "uppercase") shown = shown.toUpperCase();
      const missing = [...new Set([...shown])].filter(
        (ch) => ch !== " " && !set.has(ch.codePointAt(0)),
      );
      if (missing.length) mixed.push({ face: fam, shown, missing });
    }

    const card = document.querySelector(".controls-card");
    return { cardH: +card.getBoundingClientRect().height.toFixed(2), names, mixed };
  });
}

const manifest = { base: BASE, at: new Date().toISOString(), shots: [], tree: {} };
manifest.tree.before = Object.fromEntries(WATCHED.map((f) => [f, md5(f)]));
manifest.tree.head = execSync(`git -C ${ROOT} rev-parse --short HEAD`).toString().trim();

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const cell of CELLS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({
      viewport: { width: cell.width, height: cell.height },
      deviceScaleFactor: 2,
      colorScheme: theme,
      isMobile: cell.mobile,
      hasTouch: cell.mobile,
    });
    const page = await ctx.newPage();
    let loads = 0;
    page.on("load", () => loads++);
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await settle(page, cell.mobile);

    for (const [name, css] of REGISTERS) {
      let proof = null;
      let handle = null;
      for (let attempt = 1; attempt <= 3 && !(proof && proof.ok); attempt++) {
        if (handle) await handle.evaluate((el) => el.remove()).catch(() => {});
        await settle(page, cell.mobile); // a reload closes the sheet; re-open it
        handle = await page.addStyleTag({
          content: HIDE_DEV + UNROLL + (css || ""),
        });
        await page.waitForTimeout(300);
        await page.evaluate(() => document.fonts.ready);
        proof = await proveApplied(page, name);
      }
      if (!proof.ok) throw new Error(`${name}/${cell.vp}/${theme}: ${JSON.stringify(proof)}`);
      const seen = await census(page);
      const clip = await cardClip(page, ".controls-card");
      const file = `${OUT}eyebrow-register-${name}-${cell.vp}-${theme}.png`;
      await page.screenshot({ path: file, fullPage: true, clip });

      // The detail: the `pencils` well's own name, big enough to read the FACE off it. One cell
      // is enough — the subset arm is width-independent.
      if (!cell.mobile) {
        const box = await page.evaluate(() => {
          const well = document.querySelectorAll(".controls-card .tray-well")[1];
          const b = well.getBoundingClientRect();
          return { x: b.x + window.scrollX, y: b.y + window.scrollY, w: b.width };
        });
        await page.screenshot({
          path: `${OUT}eyebrow-register-${name}-detail-${cell.vp}-${theme}.png`,
          fullPage: true,
          clip: { x: box.x - 6, y: box.y - 22, width: box.w + 12, height: 128 },
        });
      }
      const after = await proveApplied(page, name); // the sheet survived the shot
      manifest.shots.push({
        register: name,
        vp: cell.vp,
        theme,
        clip,
        proof,
        proofAfterShot: after.ok,
        loads,
        census: seen,
        file: file.split("/").pop(),
      });
      if (handle) await handle.evaluate((el) => el.remove());
    }
    await ctx.close();
  }
}

await browser.close();
manifest.tree.after = Object.fromEntries(WATCHED.map((f) => [f, md5(f)]));
manifest.tree.stable = WATCHED.every(
  (f) => manifest.tree.before[f] === manifest.tree.after[f],
);
writeFileSync(`${OUT}eyebrow-register.json`, JSON.stringify(manifest, null, 2));
console.log(
  `${manifest.shots.length} shots · tree stable across the run: ${manifest.tree.stable}`,
);
