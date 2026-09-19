// T9-W7 pass 3 · CTRL-RULE §15 — THE CONFIRM'S ROW.
//
// Pass 2 measured the note 142.13 × 87.19 at 0.364 of the foot, and the critique's frame 3
// showed what the other 0.636 held: `Off` at 0.395 on the note's flank, sharing a baseline
// with the note's own two answers. This row is the cure's arithmetic —
//   · width == #card-foot's width,
//   · intersection with EVERY live control == 0,
//   · the weight rank: computed stroke 1.5 on `keep`, 2.5 on the destructive verb,
//   · both verbs >= 44 in BOTH dimensions, with the firing control named,
//   · THE PRESS COUNT, stated rather than assumed: the research's two probes disagreed
//     (1 vs 2 in chromium under different boots), so the row presses and reports what
//     each press did, and the lapse is measured only on a surface this row proved armed.
//
// node ribbon-row.mjs <chromium|webkit> <tag> [BASE]
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

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: ENGINE === "chromium",
  colorScheme: "light",
});
await ctx.addInitScript(() => {
  try {
    localStorage.clear();
    localStorage.setItem("sudoku-color-scheme", "light");
  } catch {}
});
const page = await ctx.newPage();
const out = { engine: ENGINE, tag: TAG, base: BASE };
await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(1500);

// DIRTY THE BOARD — the guard only arms on a board with something to lose.
// DIRTY is read off the BOARD, never off a button's disabled state — reading the button made
// the first run report a clean board as dirty and then measure an unarmed surface.
const DIRTY = () =>
  [...document.querySelectorAll('[role="gridcell"] input')].some((i) => i.value) ||
  [...document.querySelectorAll('[role="gridcell"]')].some((c) =>
    /\d/.test(c.getAttribute("aria-label") || ""),
  );
// The board's own cell is `role="gridcell"` with a transparent native input over it
// (`DigitCell.vue`); the first pass guessed class names, dirtied nothing, and `isDirty`
// stayed false — `armGuard` returned false and the press fell straight through to the act.
const cell = page.locator('[role="gridcell"] input.cell-native-input').first();
try {
  await cell.click({ force: true, timeout: 8000 });
  await cell.fill("5");
  await page.keyboard.press("5");
} catch (e) {
  console.log("no cell target —", String(e).slice(0, 110));
}
await page.waitForTimeout(600);
out.dirty = await page.evaluate(DIRTY);

// open the sheet if it is closed — the dock SLIDES
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}
await page.waitForTimeout(300);

const GEOM = () => {
  const foot = document.getElementById("card-foot");
  const bar = document.querySelector(".action-bar");
  const rib = document.querySelector(".confirm-ribbon");
  const scene = document.querySelector(".scene-controls") || document.body;
  const inter = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return w * h;
  };
  const controls = [...scene.querySelectorAll('button, [role="button"], input, a[href]')]
    .filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !e.closest(".confirm-ribbon");
    })
    .map((e) => ({
      label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 20),
      r: e.getBoundingClientRect().toJSON(),
    }));
  const rr = rib?.getBoundingClientRect().toJSON() ?? null;
  const worst = rr
    ? controls
        .map((c) => ({ label: c.label, cov: +(inter(rr, c.r) / (c.r.width * c.r.height || 1)).toFixed(4) }))
        .sort((a, b) => b.cov - a.cov)[0]
    : null;
  const faces = rib
    ? [...rib.querySelectorAll(".confirm-face")].map((f) => {
        const svg = f.querySelector("svg path, path");
        const r = f.getBoundingClientRect();
        return {
          text: f.textContent.trim(),
          w: +r.width.toFixed(2),
          h: +r.height.toFixed(2),
          stroke: svg ? getComputedStyle(svg).strokeWidth || svg.getAttribute("stroke-width") : null,
          attrStroke: svg ? svg.getAttribute("stroke-width") : null,
          color: getComputedStyle(f).color,
          minInline: getComputedStyle(f).minInlineSize,
          minH: getComputedStyle(f).minHeight,
        };
      })
    : [];
  return {
    foot: foot?.getBoundingClientRect().toJSON() ?? null,
    bar: bar?.getBoundingClientRect().toJSON() ?? null,
    ribbon: rr,
    ribbonWidth: rr?.width ?? null,
    footWidth: foot?.getBoundingClientRect().width ?? null,
    worstControlCov: worst,
    faces,
    tapFloor: getComputedStyle(document.documentElement).getPropertyValue("--tap-floor"),
  };
};

// ── THE PRESS COUNT, stated ────────────────────────────────────────────────────────────────
const clearBtn = page.locator('.action-bar button[aria-label="Clear the board"]').first();
const clearCount = await page.locator(".action-bar button").count();
out.barButtons = clearCount;
out.barLabels = await page.locator(".action-bar button").allTextContents();

await clearBtn.click({ force: true });
await page.waitForTimeout(500);
out.press1 = {
  ribbonPresent: await page.locator(".confirm-ribbon").count(),
  boardStillDirty: await page.evaluate(DIRTY),
};
out.armed = await page.evaluate(GEOM);

// press 2 — the ribbon's own destructive answer
if (out.press1.ribbonPresent) {
  const verb = page.locator(".confirm-ribbon button").nth(1);
  out.press2Label = (await verb.textContent())?.trim();
  await verb.click({ force: true });
  await page.waitForTimeout(700);
  out.press2 = {
    ribbonPresent: await page.locator(".confirm-ribbon").count(),
    boardStillDirty: await page.evaluate(DIRTY),
  };
}

// ── THE LAPSE, on a surface this row proved armed ──────────────────────────────────────────
if (out.press1.ribbonPresent) {
  try {
    await cell.click({ force: true, timeout: 4000 });
    await page.keyboard.press("7");
  } catch {}
  await page.waitForTimeout(600);
  await clearBtn.click({ force: true });
  await page.waitForTimeout(400);
  const armedAgain = await page.locator(".confirm-ribbon").count();
  const t0 = Date.now();
  let gone = 0;
  while (Date.now() - t0 < 6000) {
    if ((await page.locator(".confirm-ribbon").count()) === 0) {
      gone = Date.now() - t0;
      break;
    }
    await page.waitForTimeout(100);
  }
  out.lapse = {
    armedAgain,
    lapsedAfterMs: gone,
    boardStillDirty: await page.evaluate(DIRTY),
    focusBackOnVerb: await page.evaluate(
      () => !!document.activeElement?.closest?.(".action-bar"),
    ),
  };
}

console.log(JSON.stringify(out, null, 1));
writeFileSync(join(OUT, `ribbon-row-${TAG}-${ENGINE}.json`), JSON.stringify(out, null, 2));
await browser.close();
console.log("EXIT OK");
