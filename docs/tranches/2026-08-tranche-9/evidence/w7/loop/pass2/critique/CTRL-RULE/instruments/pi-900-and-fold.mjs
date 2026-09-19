// T9-W7 pass 2 · CRITIQUE · CTRL-RULE — two rows the lane's own censuses could not reach.
//
// 1 · PI AT THE BAND THE DIFF ACTUALLY MOVED. `typography.css`'s `--type-option` arm that this
//     family re-cut is `@media (max-width: 1023.98px)` sitting above the `767.98` arm — i.e. it
//     is live at 768–1023.98 and NOWHERE ELSE. The lane's gallery pi census ran at 390 and 1280,
//     both outside that band. `--type-option` is read by `OptionSelector.vue:106`, and
//     `StagingBand.vue` / `GameCard.vue` mount `OptionSelector` in the GALLERY — a surface this
//     wave does not claim. This reads the gallery chip at 900×500, inside the band.
//
// 2 · WHAT THE FOLD BAND ACTUALLY PAINTS. `.controls-card::before` is `position: sticky`,
//     `z-index: 30`, a `--color-card` gradient, opacity 1 under `[data-fold-above]` — and it is
//     a PSEUDO-ELEMENT, so the lane's `card.querySelectorAll("*")` predicate cannot return it.
//     This screenshots one chip at the top of the port with the band armed and again with the
//     band forced to `opacity: 0`, and reports the mean per-pixel delta: paint, not geometry.
//
// node pi-900-and-fold.mjs   [BASE=http://127.0.0.1:4234/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4234/";

async function open(engine, w, h, query, touch = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: touch,
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + query, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}

const out = { base: BASE, pi900: {}, fold: {} };

// ── 1 · the gallery chip inside 768–1023.98 ──────────────────────────────────────────────
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { w: 900, h: 500 },
    { w: 844, h: 390 },
    { w: 1280, h: 800 },
  ]) {
    const { browser, page } = await open(engine, cell.w, cell.h, "?view=gallery");
    await page.waitForTimeout(500);
    out.pi900[`${engine}/${cell.w}x${cell.h}`] = await page.evaluate(() => {
      const chips = [...document.querySelectorAll(".ctrl-btn")].filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && !e.closest(".controls-card");
      });
      const cs = getComputedStyle(document.documentElement);
      return {
        typeOption: cs.getPropertyValue("--type-option").trim(),
        nGalleryChips: chips.length,
        chipFont: chips[0] ? getComputedStyle(chips[0]).fontSize : null,
        chipPadInline: chips[0] ? getComputedStyle(chips[0]).paddingInline : null,
        chipWidth: chips[0] ? +chips[0].getBoundingClientRect().width.toFixed(2) : null,
        chipText: chips[0] ? chips[0].textContent.trim().slice(0, 12) : null,
      };
    });
    await browser.close();
  }
}

// ── 2 · what the fold band paints, at the desk ───────────────────────────────────────────
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, 1280, 800, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = 200;
  });
  await page.waitForTimeout(600);
  const geom = await page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const cs = getComputedStyle(card, "::before");
    const r = card.getBoundingClientRect();
    const ctls = [...card.querySelectorAll("button")].filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.top >= r.top - 1 && b.top < r.top + (parseFloat(cs.height) || 0);
    });
    const worst = ctls[0];
    const b = worst ? worst.getBoundingClientRect() : null;
    return {
      foldAbove: card.hasAttribute("data-fold-above"),
      bandTop: +r.top.toFixed(2),
      bandH: +(parseFloat(cs.height) || 0).toFixed(2),
      cardPadT: getComputedStyle(card).getPropertyValue("--card-pad-t").trim(),
      bgImage: cs.backgroundImage.slice(0, 120),
      label: worst ? worst.textContent.trim().slice(0, 16) : null,
      clip: b
        ? {
            x: Math.floor(b.x),
            y: Math.floor(b.y),
            width: Math.ceil(b.width),
            height: Math.ceil(b.height),
          }
        : null,
    };
  });
  let delta = null;
  if (geom.clip && geom.clip.height > 2) {
    const armed = await page.screenshot({ clip: geom.clip });
    const tag = await page.addStyleTag({
      content: ".controls-card::before{opacity:0!important}",
    });
    await page.waitForTimeout(300);
    const bare = await page.screenshot({ clip: geom.clip });
    await page.evaluate((h) => h.remove(), tag);
    const a = await sharp(armed).raw().toBuffer({ resolveWithObject: true });
    const b2 = await sharp(bare).raw().toBuffer({ resolveWithObject: true });
    let sum = 0,
      max = 0,
      n = 0;
    const len = Math.min(a.data.length, b2.data.length);
    for (let i = 0; i < len; i += a.info.channels) {
      const d =
        Math.abs(a.data[i] - b2.data[i]) +
        Math.abs(a.data[i + 1] - b2.data[i + 1]) +
        Math.abs(a.data[i + 2] - b2.data[i + 2]);
      sum += d / 3;
      max = Math.max(max, d / 3);
      n++;
    }
    delta = { meanAbsDelta: +(sum / n).toFixed(2), maxAbsDelta: +max.toFixed(2), pixels: n };
  }
  out.fold[engine] = { ...geom, delta };
  await browser.close();
  console.log("fold done", engine, JSON.stringify(out.fold[engine].delta));
}

writeFileSync(join(OUT, "pi-900-and-fold.json"), JSON.stringify(out, null, 2));
console.log("EXIT OK");
console.log(JSON.stringify(out.pi900, null, 1));
