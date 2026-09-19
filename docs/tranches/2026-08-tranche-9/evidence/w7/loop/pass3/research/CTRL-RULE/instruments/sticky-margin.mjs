// T9-W7 pass 3 · RESEARCH · CTRL-RULE — CAN THE MARGIN COLUMN CARRY W2 §2.6's PIN?
//
// The chair REFUSED arm (b)'s retirement of §2.6 (`pass3/CHAIR-RULINGS.md` §6.3a): the sticky
// section tag is owner mark T9-M03 and only the owner retires a mark. The 4/14 chromium and
// 4/13 webkit orphaned-field readings are then a DEFECT OF THE PIN TO CURE, and arm (b) must
// "re-cut to keep the pin".
//
// THE HYPOTHESIS THIS PROBE TESTS. A pinned name in a MARGIN COLUMN cannot occlude a control,
// because the controls live in column 3 and the name lives in column 1. `.ruled-group` is
// `grid-template-columns: var(--rp-margin) 0.5rem minmax(0,1fr)` (RuledGroup.vue:70) with the
// name at 1/1 and the field at 1/3. `position: sticky` on a grid item is constrained by its
// GRID AREA, so the name rides down its own group and releases at the group's end — which is
// exactly W2 §2.6's read ("a section tag stays visible while its group is in view",
// `e2e/viewport-law.spec.ts:572`) with occlusion zero BY COLUMN rather than by absence.
//
// Three arms, measured rather than argued:
//   base        — the pass-2 prototype as built (no pin)
//   stickyTop0  — `.rp-name { position: sticky; top: 0; z-index: 31 }`
//   stickyBand  — the same at `top: 2rem`, which parks the name BELOW the fold sentinel's band
//                 (`scene.css:356`, height `2rem + --card-pad-t`, z 30, card-coloured ground)
//
// Per arm: the orphan census (the critic's own predicate, ≥33% of the field readable with no
// part of the name on screen), the worst fraction of any CONTROL covered by any `.rp-name`
// rect, and the same for the fold band by the critic's method (`pin-census.mjs` §FOLD_OVERLAP,
// band top = the card's client top, band height = the computed `::before` height).
//
// READ-ONLY on product files: every arm is a `page.addStyleTag`, nothing under `src/` moves.
//
//   node sticky-margin.mjs   [BASE=http://127.0.0.1:4231/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const ARMS = {
  base: "",
  stickyTop0: ".rp-name{position:sticky;top:0;z-index:31}",
  stickyBand: ".rp-name{position:sticky;top:2rem;z-index:31}",
};

const CELLS = [
  { name: "1280x800", w: 1280, h: 800, touch: false },
  { name: "390x844", w: 390, h: 844, touch: true },
];

// One scan at one scroll state: the orphan rows, the name's occlusion of any control, and the
// fold band's.
const SCAN = (top) => {
  const card = document.querySelector(".controls-card");
  card.scrollTop = top;
  void card.offsetHeight;
  const port = card.getBoundingClientRect();
  const frac = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return b.width && b.height ? (w * h) / (b.width * b.height) : 0;
  };
  const ctls = [
    ...card.querySelectorAll('button, [tabindex="0"], input, select, a[href]'),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });

  const rows = [];
  let nameWorst = { frac: 0, name: null, control: null };
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const nameEl = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    if (!nameEl || !field) continue;
    const nb = nameEl.getBoundingClientRect();
    const fb = field.getBoundingClientRect();
    const vis = (r) =>
      Math.max(0, Math.min(r.bottom, port.bottom) - Math.max(r.top, port.top)) /
      (r.height || 1);
    rows.push({
      name: nameEl.textContent.trim(),
      fieldVis: +vis(fb).toFixed(3),
      nameVis: +vis(nb).toFixed(3),
      nameLeft: +nb.left.toFixed(2),
      nameRight: +nb.right.toFixed(2),
      nameTop: +nb.top.toFixed(2),
      fieldLeft: +fb.left.toFixed(2),
    });
    // the pinned name's own occlusion cost: does the name's box cover any control?
    for (const c of ctls) {
      const f = frac(nb, c.getBoundingClientRect());
      if (f > nameWorst.frac)
        nameWorst = {
          frac: +f.toFixed(3),
          name: nameEl.textContent.trim(),
          control: (c.textContent || "").trim().slice(0, 18),
        };
    }
  }

  // the fold sentinel, by pin-census.mjs's own method
  const cs = getComputedStyle(card, "::before");
  const bandH = parseFloat(cs.height) || 0;
  const band = {
    top: port.top,
    bottom: port.top + bandH,
    left: port.left,
    right: port.right,
    width: port.width,
    height: bandH,
  };
  let bandWorst = { frac: 0, control: null };
  if (card.hasAttribute("data-fold-above") && +cs.opacity > 0) {
    for (const c of ctls) {
      const f = frac(band, c.getBoundingClientRect());
      if (f > bandWorst.frac)
        bandWorst = { frac: +f.toFixed(3), control: (c.textContent || "").trim().slice(0, 18) };
    }
  }

  const orphans = rows.filter((r) => r.fieldVis >= 0.33 && r.nameVis <= 0);
  return {
    scrollTop: card.scrollTop,
    maxScroll: card.scrollHeight - card.clientHeight,
    orphans: orphans.map((o) => o.name),
    nameWorst,
    bandWorst,
    bandH: +bandH.toFixed(2),
    foldAbove: card.hasAttribute("data-fold-above"),
    rows,
  };
};

const out = { base: BASE, generated: new Date().toISOString(), cells: {} };

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    for (const [arm, css] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        hasTouch: cell.touch,
        colorScheme: "light",
      });
      await ctx.addInitScript(() => {
        try {
          localStorage.clear();
          localStorage.setItem("sudoku-color-scheme", "light");
        } catch {}
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(1200);
      if (
        await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
      ) {
        await page.locator(".drawer-tab").first().click({ force: true });
        await page.waitForTimeout(950); // THE SHEET SLIDES
      }
      if (css) await page.addStyleTag({ content: css });
      await page.waitForTimeout(300);

      const max = await page.evaluate(() => {
        const c = document.querySelector(".controls-card");
        return c.scrollHeight - c.clientHeight;
      });
      const states = [];
      for (let t = 0; t <= max; t += Math.max(20, Math.round(max / 12)))
        states.push(await page.evaluate(SCAN, t));
      states.push(await page.evaluate(SCAN, max));

      const withOrphans = states.filter((s) => s.orphans.length);
      const nameWorst = states.reduce(
        (a, s) => (s.nameWorst.frac > a.frac ? { ...s.nameWorst, at: s.scrollTop } : a),
        { frac: 0 },
      );
      const bandWorst = states.reduce(
        (a, s) => (s.bandWorst.frac > a.frac ? { ...s.bandWorst, at: s.scrollTop } : a),
        { frac: 0 },
      );
      const key = `${engine}/${cell.name}/${arm}`;
      out.cells[key] = {
        maxScroll: max,
        states: states.length,
        statesWithOrphan: withOrphans.length,
        orphanSample: withOrphans.slice(0, 5).map((s) => ({ t: s.scrollTop, o: s.orphans })),
        nameOcclusionWorst: nameWorst,
        foldBandWorst: bandWorst,
        bandH: states.find((s) => s.foldAbove)?.bandH ?? null,
        marginBox: states[0].rows[0]
          ? {
              nameLeft: states[0].rows[0].nameLeft,
              nameRight: states[0].rows[0].nameRight,
              fieldLeft: states[0].rows[0].fieldLeft,
            }
          : null,
      };
      console.log(
        key,
        "orphan",
        withOrphans.length + "/" + states.length,
        "| nameOccl",
        nameWorst.frac,
        "| bandOccl",
        bandWorst.frac,
      );
      await ctx.close();
    }
    await browser.close();
  }
}

writeFileSync(join(OUT, "sticky-margin.json"), JSON.stringify(out, null, 2));
console.log("EXIT OK");
