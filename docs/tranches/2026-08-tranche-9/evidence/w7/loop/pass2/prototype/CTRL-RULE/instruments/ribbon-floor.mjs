// T9-W7 pass 2 · CTRL-RULE §15 — THE RIBBON'S FLOOR, WITH A CONTROL THAT ACTUALLY FIRES.
//
// Census 2 read the ribbon's boxes (keep 51.73 × 44, clear 54.39 × 44) but its negative control
// was the GALLERY's guard verbs, which are not on the game view — so it returned
// `present: false` and proved nothing. A gate whose control cannot fire is not a gate. Two
// controls here, and both are read on the surface the claim is about:
//   (1) THE PER-DIMENSION ABLATION (zone-grammar :495-507's shape): strip `min-inline-size` and
//       `min-height` from `.confirm-face` and re-measure. If the boxes stay ≥44 with the floor
//       gone, the floor is not what is holding them and the row is vacuous.
//   (2) THE ESTATE'S OWN RED: the gallery's `.guard-face` in the GALLERY view, which wears
//       `min-height` alone and is expected to read under 44 in width.
// It also takes crop 3 (the ribbon in the foot's row), which the frames run missed by raising
// the sheet BEFORE dirtying the board — the sheet covers the cells.
//
// node ribbon-floor.mjs   [BASE=http://127.0.0.1:4231/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
const FRAMES = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const BOXES = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const r = document.querySelector(".confirm-ribbon");
  if (!r) return { present: false };
  const rows = [...r.querySelectorAll(".confirm-btn")].map((b) => {
    const f = b.querySelector(".confirm-face") || b;
    const fb = f.getBoundingClientRect();
    const c = getComputedStyle(f);
    return {
      text: (b.innerText || "").replace(/\s+/g, " ").trim(),
      w: n2(fb.width),
      h: n2(fb.height),
      color: c.color,
      bg: c.backgroundColor,
      drawn: !!b.querySelector("svg"),
    };
  });
  return {
    present: true,
    line: (r.querySelector(".confirm-line")?.innerText || "").trim(),
    role: r.getAttribute("role"),
    rows,
    floorOk: rows.every((x) => x.w >= 44 && x.h >= 44),
  };
};

async function open(engine, w, h, gallery = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: engine === "chromium",
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + (gallery ? "?view=gallery" : "?size=3&difficulty=EASY"), {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, 390, 844);
  // DIRTY FIRST, THEN RAISE — the risen sheet covers the cells. AND KEEP TRYING UNTIL A DIGIT
  // ACTUALLY LANDS: the deal is random, `:not([readonly])` is not the whole of W1's law (a given
  // refuses the write at the model), and a probe that types once into whatever cell it found
  // reads `present: false` on some deals and `true` on others. That flake is what made the first
  // run arm and the next two not.
  let dirty = false;
  const cells = page.locator(".game-cell input:not([readonly]):not([disabled])");
  const n = Math.min(await cells.count(), 12);
  for (let i = 0; i < n && !dirty; i++) {
    await cells
      .nth(i)
      .click({ force: true })
      .catch(() => {});
    await page.keyboard.type("1");
    await page.waitForTimeout(220);
    dirty = await cells.nth(i).inputValue().then((v) => v.trim() === "1").catch(() => false);
  }
  if (!dirty) console.log("  [warn] no digit landed — the arm's predicate cannot be true");
  await page.waitForTimeout(300);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  await page
    .locator('button[aria-label="Clear the board"]')
    .first()
    .click({ force: true })
    .catch(() => {});
  await page.waitForTimeout(600);
  const armed = await page.evaluate(BOXES);
  // (1) the per-dimension ablation
  const tag = await page.addStyleTag({
    content: ".confirm-face{min-inline-size:0!important;min-height:0!important}",
  });
  await page.waitForTimeout(200);
  const ablated = await page.evaluate(BOXES);
  await page.evaluate((h) => h.remove(), tag);
  await page.waitForTimeout(200);
  if (engine === "chromium" && armed.present) {
    const clip = await page.evaluate(() => {
      const r = document.querySelector(".confirm-ribbon").getBoundingClientRect();
      const f = document.querySelector("#card-foot").getBoundingClientRect();
      const x = Math.max(0, Math.floor(Math.min(r.x, f.x)) - 4);
      const y = Math.max(0, Math.floor(r.y) - 6);
      const vh = document.documentElement.clientHeight;
      const vw = document.documentElement.clientWidth;
      return {
        x,
        y,
        width: Math.min(Math.ceil(Math.max(r.right, f.right)) + 4 - x, vw - x),
        height: Math.min(Math.ceil(f.bottom) + 4 - y, vh - y),
      };
    });
    await page.screenshot({ path: join(FRAMES, "3-ribbon-390.png"), clip });
  }
  await browser.close();

  // (2) the estate's own red, in the view it lives in
  const g = await open(engine, 390, 844, true);
  const gallery = await g.page.evaluate(() => {
    const n2 = (v) => +(+v).toFixed(2);
    const el = document.querySelector(".guard-face");
    if (!el) return { present: false, note: "no guard armed at rest" };
    const b = el.getBoundingClientRect();
    return { present: true, w: n2(b.width), h: n2(b.height) };
  });
  await g.browser.close();

  out[engine] = { dirty, armed, ablated, galleryControl: gallery };
  console.log(
    engine,
    "| armed",
    JSON.stringify(armed.rows || armed),
    "| floorOk",
    armed.floorOk,
    "| ABLATED",
    JSON.stringify((ablated.rows || []).map((r) => [r.text, r.w, r.h])),
    "| ablationFires",
    ablated.present ? !ablated.floorOk : null,
  );
}
writeFileSync(join(OUT, "ribbon-floor.json"), JSON.stringify(out, null, 1));
console.log("banked readings/ribbon-floor.json");
