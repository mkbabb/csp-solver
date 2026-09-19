/**
 * T9-W7 pass 3 · CTRL-TAPE — THE CONFIRM'S FACE and THE ARM'S FOCUS CONTRACT (gates 5 and 6).
 *
 * Built on the driver that demonstrably arms. The first cut of this probe read "the arm did not
 * arm" on every cell while a standalone driver armed on the same tap — so the harness, not the
 * design, was the subject. What differed was how the board was dirtied: this one writes into
 * TWELVE cells and does not stop at the first enabled undo button, because a single write can
 * enable undo through a selection entry while `props.isDirty` still reads a clean board.
 *
 *   node p3-face.mjs <out.json> <base> [engine]
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

async function dirty(page) {
  for (let i = 0; i < 12; i++) {
    await page.locator(".sudoku-cell").nth(i).click();
    await page.keyboard.press("5");
  }
  await page.waitForTimeout(150);
}

async function openSheet(page) {
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950); // the sheet SLIDES — settle before any read
}

const FACE = () => {
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return { present: false };
  const r = rib.getBoundingClientRect();
  const rowBox = rib.parentElement.getBoundingClientRect();
  const answers = [...rib.querySelectorAll(".confirm-answer")].map((a) => {
    const b = a.getBoundingClientRect();
    const word = [...a.querySelectorAll("span")].find((s) => !s.hasAttribute("aria-hidden"));
    const path = a.querySelector("svg path");
    const ps = path ? getComputedStyle(path) : null;
    return {
      cls: a.className,
      text: (a.textContent || "").trim(),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      strokeWidth: ps ? ps.strokeWidth : null,
      pathLen: path ? +path.getTotalLength().toFixed(1) : null,
      // The painted ink a frame lays down: its stroke width times the length it is drawn along.
      ink: path && ps ? +(path.getTotalLength() * parseFloat(ps.strokeWidth)).toFixed(1) : null,
      wordColor: word ? getComputedStyle(word).color : getComputedStyle(a).color,
      bg: getComputedStyle(a).backgroundColor,
      fontSize: getComputedStyle(a).fontSize,
    };
  });
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
    askColor: getComputedStyle(rib.querySelector(".confirm-ask")).color,
    role: rib.getAttribute("role"),
    ariaLabel: rib.getAttribute("aria-label"),
    ribbonW: +r.width.toFixed(2),
    rowW: +rowBox.width.toFixed(2),
    widthDelta: +(r.width - rowBox.width).toFixed(2),
    answers,
    coversLive: +worst.toFixed(2),
    coversWho: who,
    cardBg: (() => {
      const c = document.querySelector(".controls-card");
      return c ? getComputedStyle(c).backgroundColor : null;
    })(),
    activeEl: (() => {
      const a = document.activeElement;
      if (!a || a === document.body) return "BODY";
      return String(a.className || a.tagName).slice(0, 40);
    })(),
  };
};

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
    const row = {};
    try {
      // ════ THE POINTER ARM ════
      await loadBoard(page);
      await dirty(page);
      row.coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      await openSheet(page);
      await page.evaluate(() => {
        window.__fo = 0;
        window.__fi = 0;
        document.addEventListener("focusout", () => (window.__fo += 1), true);
        document.addEventListener("focusin", () => (window.__fi += 1), true);
      });
      const scroll0 = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? 0,
      );
      await page.locator('.action-bar button[aria-label="Clear the board"]').tap();
      await page.waitForTimeout(420);
      row.armed = await page.evaluate(FACE);
      row.focus = await page.evaluate(() => ({ focusouts: window.__fo, focusins: window.__fi }));
      row.scrollDelta = +(
        (await page.evaluate(() => document.querySelector(".controls-card")?.scrollTop ?? 0)) -
        scroll0
      ).toFixed(2);

      // ════ PRESS 2 — it must FIRE, and this is the row WebKit failed at HEAD ════
      if (row.armed.present) {
        const glyphsBefore = await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        );
        await page.locator(".confirm-go").tap();
        await page.waitForTimeout(700);
        row.press2 = {
          glyphsBefore,
          glyphsAfter: await page.evaluate(
            () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
          ),
          ribbonGone: await page.evaluate(() => !document.querySelector(".confirm-ribbon")),
          verbsBack: await page.evaluate(() => !!document.querySelector(".action-verbs")),
        };
        row.press2.fired = row.press2.glyphsAfter < row.press2.glyphsBefore;
      }

      // ════ THE KEYBOARD ARM ════
      await page.reload();
      await loadBoard(page);
      await dirty(page);
      await openSheet(page);
      await page.locator('.action-bar button[aria-label="Clear the board"]').focus();
      const ks0 = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? 0,
      );
      await page.keyboard.press("Enter");
      await page.waitForTimeout(400);
      const kArmed = await page.evaluate(FACE);
      row.keyboard = {
        present: kArmed.present,
        activeEl: kArmed.activeEl,
        focusOnKeep: /confirm-keep/.test(kArmed.activeEl || ""),
        scrollDelta: +(
          (await page.evaluate(() => document.querySelector(".controls-card")?.scrollTop ?? 0)) -
          ks0
        ).toFixed(2),
      };
      const glyphsK = await page.evaluate(
        () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
      );
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
      row.keyboard.secondEnter = {
        ribbon: await page.evaluate(() => !!document.querySelector(".confirm-ribbon")),
        glyphs: await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        ),
        glyphsBefore: glyphsK,
      };
      row.keyboard.secondEnterCancelled =
        !row.keyboard.secondEnter.ribbon &&
        row.keyboard.secondEnter.glyphs === row.keyboard.secondEnter.glyphsBefore;

      // ════ ESCAPE disarms, the SHEET STAYS ════
      await page.reload();
      await loadBoard(page);
      await dirty(page);
      await openSheet(page);
      await page.locator('.action-bar button[aria-label="Clear the board"]').focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(400);
      const escBefore = await page.evaluate(() => !!document.querySelector(".confirm-ribbon"));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      row.escape = {
        armedBefore: escBefore,
        ribbonAfter: await page.evaluate(() => !!document.querySelector(".confirm-ribbon")),
        sheetUp: await page.evaluate(
          () => !document.documentElement.classList.contains("drawer-closed"),
        ),
      };
      out[key] = row;
    } catch (e) {
      out[key] = { ...row, error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
