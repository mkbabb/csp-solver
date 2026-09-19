// T9-W7 pass 3 · CTRL-RULE — R1 (the heading voice), the ring, the tap floor, and the gallery's
// rect census for π. One page load per cell; five cells; both engines by argument.
//
// R1 ROW 1: how many VOICES name a group (family × weight × transform × size). HEAD reads 3.
// R1 ROW 2: how many of the seven names are in that one voice. 7/7 or the row is red.
// R1 ROW 3: the RANK — the name's size over the chip's. The floor is 1.23; the spec claims
//           1.2945 at every width, and 900×500 is the cell that caught pass 2's 1.0175.
//
// node face-census.mjs <chromium|webkit> <tag> <BASE>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });

const ENGINE = process.argv[2] || "chromium";
const TAG = process.argv[3] || "proto";
const BASE = process.argv[4] || "http://127.0.0.1:4231/";

const CELLS = [
  { w: 1280, h: 800, touch: false },
  { w: 900, h: 500, touch: false },
  { w: 390, h: 844, touch: true },
  { w: 375, h: 812, touch: true },
  { w: 320, h: 568, touch: true },
];

const VOICES = () => {
  const card = document.querySelector(".controls-card");
  const scene = document.querySelector(".scene-controls") || document.body;
  // every node that NAMES a group on this card: the ruled names plus any surviving heading
  const namers = [
    ...card.querySelectorAll(
      ".rp-name, .section-heading, .zone-row-label, .washi-tag, .heading-value, .mobile-heading-btn",
    ),
  ];
  const voice = (e) => {
    const cs = getComputedStyle(e);
    return [
      cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      cs.fontWeight,
      cs.textTransform,
      cs.fontSize,
    ].join(" · ");
  };
  const names = namers.map((e) => ({
    cls: String(e.className).split(" ")[0],
    text: e.textContent.trim().slice(0, 18),
    voice: voice(e),
    size: parseFloat(getComputedStyle(e).fontSize),
  }));
  const chips = [...scene.querySelectorAll(".ctrl-btn, .option-btn, .opt-btn")]
    .filter((e) => e.getBoundingClientRect().width > 0)
    .map((e) => parseFloat(getComputedStyle(e).fontSize));
  const ruled = names.filter((n) => n.cls === "rp-name");
  const chipSize = chips.length ? Math.max(...chips) : null;
  return {
    namerCount: names.length,
    voices: [...new Set(names.map((n) => n.voice))],
    ruledNames: ruled.length,
    ruledVoices: [...new Set(ruled.map((n) => n.voice))],
    ruledTexts: ruled.map((n) => n.text),
    nameSize: ruled.length ? ruled[0].size : null,
    chipSize,
    chipCount: chips.length,
    ratio: ruled.length && chipSize ? +(ruled[0].size / chipSize).toFixed(4) : null,
    // the tap floor, per dimension, on every verb a coarse reader presses
    coarseVerbs: [...scene.querySelectorAll(".act-face, .confirm-face, .guard-btn, .ctrl-btn")]
      .map((e) => {
        const r = e.getBoundingClientRect();
        return { t: e.textContent.trim().slice(0, 12), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
      })
      .filter((v) => v.w > 0)
      .filter((v) => v.w < 44 || v.h < 44),
    // the ring: how many focusable controls author one
    ringCensus: (() => {
      const f = [...scene.querySelectorAll("button, [tabindex='0'], a[href], input")].filter(
        (e) => e.getBoundingClientRect().width > 0,
      );
      return { focusables: f.length };
    })(),
  };
};

// π: a rect census of the GALLERY, the surface this wave does not claim.
const GALLERY_RECTS = () =>
  [...document.querySelectorAll(".game-card, .card-wordmark, .gallery-track, .guard-btn, .deck-card")]
    .map((e) => {
      const r = e.getBoundingClientRect();
      return [
        String(e.className).slice(0, 30),
        +r.x.toFixed(2),
        +r.y.toFixed(2),
        +r.width.toFixed(2),
        +r.height.toFixed(2),
      ].join("|");
    })
    .sort();

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const out = { engine: ENGINE, tag: TAG, base: BASE, cells: {}, gallery: {} };
for (const cell of CELLS) {
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
  await page.waitForTimeout(1300);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(250);
  out.cells[`${cell.w}x${cell.h}`] = await page.evaluate(VOICES);
  console.log(
    ENGINE,
    TAG,
    `${cell.w}x${cell.h}`,
    "voices",
    out.cells[`${cell.w}x${cell.h}`].voices.length,
    "ruled",
    out.cells[`${cell.w}x${cell.h}`].ruledNames,
    "ruledVoices",
    out.cells[`${cell.w}x${cell.h}`].ruledVoices.length,
    "ratio",
    out.cells[`${cell.w}x${cell.h}`].ratio,
    "underFloorVerbs",
    out.cells[`${cell.w}x${cell.h}`].coarseVerbs.length,
  );

  // the gallery, at the two cells the guard names
  if (cell.w === 1280 || cell.w === 390) {
    // `g` is the gallery's own key (App.vue §ENTRY) — a click target for it does not exist on
    // every cell, and the first pass's selector guess returned an empty census, which is the
    // silent-zero this file's own discipline refuses.
    await page.keyboard.press("g");
    await page.waitForTimeout(1500);
    out.gallery[`${cell.w}`] = await page.evaluate(GALLERY_RECTS);
    console.log("  gallery rects", out.gallery[`${cell.w}`].length);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, `face-census-${TAG}-${ENGINE}.json`), JSON.stringify(out, null, 2));
console.log("EXIT OK");
