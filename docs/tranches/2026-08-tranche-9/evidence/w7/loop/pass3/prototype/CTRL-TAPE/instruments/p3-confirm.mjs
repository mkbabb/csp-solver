/**
 * T9-W7 pass 3 · CTRL-TAPE — THE CONFIRM'S FACE and THE ARM'S FOCUS CONTRACT (§2.5, gates 5-6).
 *
 * Every row here is a number the section's rule is measured by, and the two that matter most are
 * the ones pass 2 could not take: how many focus moves a POINTER arm costs, and whether press 2
 * FIRES on WebKit.
 *
 *   node p3-confirm.mjs <out.json> <base> [chromium|webkit]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4];

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}

/** Make the board DIRTY — the arm is gated on `props.isDirty`, so a pristine board never asks.
 *  FIRST CUT WROTE ONE CELL AND CHECKED NOTHING, and it was wrong on both counts: the first
 *  `.sudoku-cell` is often a GIVEN, which takes no digit, so the board stayed pristine, the
 *  verb acted on press 1 and the row read "the arm did not arm". The board's own undo button
 *  is the honest witness — it is disabled exactly while the board is clean. */
async function dirty(page) {
  for (let i = 0; i < 16; i++) {
    await page.locator(".sudoku-cell").nth(i).click();
    await page.keyboard.press("5");
    const clean = await page.evaluate(() => {
      const b = document.querySelector('button[aria-label*="Undo" i]');
      return b ? b.disabled : true;
    });
    if (!clean) return true;
  }
  return false;
}

/** THE FACE — the two answers' geometry, weight, ink, and what they intersect. */
const FACE = () => {
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return { present: false };
  const r = rib.getBoundingClientRect();
  const row = rib.parentElement;
  const rowBox = row.getBoundingClientRect();
  const answers = [...rib.querySelectorAll(".confirm-answer")].map((a) => {
    const b = a.getBoundingClientRect();
    const word = a.querySelector("span:not([aria-hidden])") ?? a.querySelector("span");
    const path = a.querySelector("svg path");
    const ps = path ? getComputedStyle(path) : null;
    return {
      cls: a.className,
      text: (a.textContent || "").trim(),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      strokeWidth: ps ? ps.strokeWidth : (path?.getAttribute("stroke-width") ?? null),
      strokeAttr: path?.getAttribute("stroke-width") ?? null,
      pathLen: path ? +path.getTotalLength().toFixed(1) : null,
      color: word ? getComputedStyle(word).color : getComputedStyle(a).color,
      bg: getComputedStyle(a).backgroundColor,
    };
  });
  // The ribbon against every LIVE control still on the page.
  let worst = 0;
  let who = null;
  for (const el of document.querySelectorAll(
    'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
  )) {
    if (rib.contains(el)) continue;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    const w = Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, r.left));
    const h = Math.max(0, Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top));
    if (w * h > worst) {
      worst = w * h;
      who = el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24);
    }
  }
  return {
    present: true,
    ask: (rib.querySelector(".confirm-ask")?.textContent || "").trim(),
    role: rib.getAttribute("role"),
    ariaLabel: rib.getAttribute("aria-label"),
    ribbonW: +r.width.toFixed(2),
    rowW: +rowBox.width.toFixed(2),
    fullWidth: +(r.width - rowBox.width).toFixed(2),
    answers,
    coversLive: +worst.toFixed(2),
    coversWho: who,
    activeEl:
      document.activeElement === document.body
        ? "BODY"
        : String(document.activeElement?.className || document.activeElement?.tagName),
    cardScrollTop: document.querySelector(".controls-card")?.scrollTop ?? null,
  };
};

const COUNTERS = () => {
  window.__fo = 0;
  window.__fi = 0;
  document.addEventListener("focusout", () => (window.__fo += 1), true);
  document.addEventListener("focusin", () => (window.__fi += 1), true);
};
const READ_COUNTERS = () => ({ focusouts: window.__fo, focusins: window.__fi });

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== engName) continue;
  const browser = await eng.launch();

  for (const theme of ["light", "dark"]) {
    const key = `${engName}|dock-390x844|${theme}`;
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: engName === "chromium",
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    try {
      await loadBoard(page);
      const dirtyOK = await dirty(page);
      // The two preconditions the arm is gated on, recorded rather than assumed: a COARSE
      // pointer and a DIRTY board. A row that reads "the arm did not arm" while one of these
      // is false is measuring the emulation, not the design.
      const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      await page.locator(".drawer-tab").click();
      await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
      await page.waitForTimeout(900);

      const before = await page.evaluate(() => ({
        scrollTop: document.querySelector(".controls-card")?.scrollTop ?? null,
        active: String(document.activeElement?.className || document.activeElement?.tagName),
      }));
      await page.evaluate(COUNTERS);

      // ── PRESS 1, BY POINTER. The arm must move no focus and scroll nothing.
      const clearBtn = page.locator('.action-bar button[aria-label="Clear the board"]');
      await clearBtn.tap();
      await page.waitForTimeout(260);
      const armed = await page.evaluate(FACE);
      const afterArm = await page.evaluate(READ_COUNTERS);
      const scrollAfterArm = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? null,
      );

      // The ink density of the two frames, read from the painted bytes' own path geometry:
      // stroke-width × path length is the ink a frame lays down.
      const density = armed.present
        ? armed.answers.map((a) => ({
            cls: a.cls,
            ink: a.pathLen && a.strokeWidth ? +(a.pathLen * parseFloat(a.strokeWidth)).toFixed(1) : null,
          }))
        : null;

      // ── PRESS 2 — the destructive answer. It must FIRE on both engines.
      let fired = null;
      if (armed.present) {
        const filled = await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg.user-ink, .sudoku-cell [data-user]").length,
        );
        await page.locator(".confirm-go").tap();
        await page.waitForTimeout(500);
        fired = {
          ribbonGone: await page.evaluate(() => !document.querySelector(".confirm-ribbon")),
          verbsBack: await page.evaluate(() => !!document.querySelector(".action-verbs")),
          filledBefore: filled,
        };
      }

      // ── THE KEYBOARD ARM — focus must land on `keep`, and a second Enter must CANCEL.
      await page.reload();
      await loadBoard(page);
      await dirty(page);
      await page.locator(".drawer-tab").click();
      await page.waitForTimeout(900);
      await page.locator('.action-bar button[aria-label="Clear the board"]').focus();
      const scrollBeforeKeys = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? null,
      );
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const keyArmed = await page.evaluate(FACE);
      const scrollAfterKeys = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? null,
      );
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const afterSecondEnter = await page.evaluate(FACE);

      // ── ESCAPE disarms, and the SHEET STAYS.
      await page.locator('.action-bar button[aria-label="Clear the board"]').focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
      const beforeEsc = await page.evaluate(FACE);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const afterEsc = await page.evaluate(() => ({
        ribbon: !!document.querySelector(".confirm-ribbon"),
        sheetUp: !document.documentElement.classList.contains("drawer-closed"),
      }));

      out[key] = {
        dirtyOK,
        coarse,
        before,
        armed,
        density,
        focusOnArm: afterArm,
        scrollDelta: +((scrollAfterArm ?? 0) - (before.scrollTop ?? 0)).toFixed(2),
        fired,
        keyArmed: {
          present: keyArmed.present,
          activeEl: keyArmed.activeEl,
          scrollDelta: +((scrollAfterKeys ?? 0) - (scrollBeforeKeys ?? 0)).toFixed(2),
        },
        secondEnterCancels: afterSecondEnter.present === false,
        escape: { armedBefore: beforeEsc.present, ...afterEsc },
      };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
