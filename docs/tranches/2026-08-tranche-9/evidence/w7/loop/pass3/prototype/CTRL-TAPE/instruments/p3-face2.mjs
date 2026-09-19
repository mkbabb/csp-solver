/**
 * T9-W7 pass 3 · CTRL-TAPE — THE CONFIRM'S FACE, tight. One page per engine/theme, explicit
 * short timeouts on every locator, no reloads (the first cut hung on a locator that waited for
 * a control the shut sheet does not mount, and a hung probe banks nothing).
 *
 *   node p3-face2.mjs <out.json> <base> [engine]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4];
const T = { timeout: 8000 };

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
      ink: path && ps ? +(path.getTotalLength() * parseFloat(ps.strokeWidth)).toFixed(1) : null,
      wordColor: word ? getComputedStyle(word).color : getComputedStyle(a).color,
      bg: getComputedStyle(a).backgroundColor,
    };
  });
  // THE INTERSECTION IS AGAINST WHAT THE READER CAN SEE, and the first cut of this probe got
  // that wrong: it measured every control's raw rect, so a row scrolled OUT of the card — which
  // still has a rect down where the foot is — reported a 2,048.97px² burial of a chip nobody
  // could see. The card's own scrollport is the clip, exactly as `zone-grammar.spec.ts`'s bar
  // row already does it. A control clipped to nothing is not covered.
  const card = document.querySelector(".controls-card");
  const clipTop = card ? card.getBoundingClientRect().top + card.clientTop : -Infinity;
  const clipBottom = card ? clipTop + card.clientHeight : Infinity;
  let worst = 0;
  let who = null;
  for (const el of document.querySelectorAll(
    'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
  )) {
    if (rib.contains(el)) continue;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    const inPort = card?.contains(el);
    const vt = inPort ? Math.max(b.top, clipTop) : b.top;
    const vb = inPort ? Math.min(b.bottom, clipBottom) : b.bottom;
    if (vb - vt <= 0) continue;
    const w = Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, r.left));
    const h = Math.max(0, Math.min(vb, r.bottom) - Math.max(vt, r.top));
    if (w * h > worst) {
      worst = +(w * h).toFixed(2);
      who = el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24);
    }
  }
  return {
    present: true,
    ask: (rib.querySelector(".confirm-ask")?.textContent || "").trim(),
    ariaLabel: rib.getAttribute("aria-label"),
    role: rib.getAttribute("role"),
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
      return !a || a === document.body ? "BODY" : String(a.className || a.tagName).slice(0, 40);
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
    ctx.setDefaultTimeout(8000);
    const page = await ctx.newPage();
    const row = {};
    try {
      await page.goto("/?size=3&difficulty=EASY");
      await page.waitForSelector("svg.handwritten-logo", T);
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 25000 });
      await page.waitForSelector("g.boil-frame-layer.is-active", {
        state: "attached",
        timeout: 25000,
      });
      for (let i = 0; i < 12; i++) {
        await page.locator(".sudoku-cell").nth(i).click(T);
        await page.keyboard.press("5");
      }
      row.coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      await page.locator(".drawer-tab").click(T);
      await page.waitForTimeout(950);
      await page.evaluate(() => {
        window.__fo = 0;
        window.__fi = 0;
        document.addEventListener("focusout", () => (window.__fo += 1), true);
        document.addEventListener("focusin", () => (window.__fi += 1), true);
      });
      const s0 = await page.evaluate(
        () => document.querySelector(".controls-card")?.scrollTop ?? 0,
      );
      await page.locator('.action-bar button[aria-label="Clear the board"]').tap(T);
      await page.waitForTimeout(420);
      row.armed = await page.evaluate(FACE);
      row.focus = await page.evaluate(() => ({ focusouts: window.__fo, focusins: window.__fi }));
      row.scrollDelta = +(
        (await page.evaluate(() => document.querySelector(".controls-card")?.scrollTop ?? 0)) - s0
      ).toFixed(2);

      // ESCAPE first (non-destructive), then press 2 — one page, no reload.
      if (row.armed.present) {
        await page.keyboard.press("Escape");
        await page.waitForTimeout(350);
        row.escape = {
          ribbonAfter: await page.evaluate(() => !!document.querySelector(".confirm-ribbon")),
          sheetUp: await page.evaluate(
            () => !document.documentElement.classList.contains("drawer-closed"),
          ),
        };
        // KEYBOARD ARM.
        await page.locator('.action-bar button[aria-label="Clear the board"]').focus(T);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(400);
        const k = await page.evaluate(FACE);
        row.keyboard = {
          present: k.present,
          activeEl: k.activeEl,
          focusOnKeep: /confirm-keep/.test(k.activeEl || ""),
        };
        const gBefore = await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        );
        await page.keyboard.press("Enter");
        await page.waitForTimeout(450);
        row.keyboard.secondEnter = {
          ribbon: await page.evaluate(() => !!document.querySelector(".confirm-ribbon")),
          glyphsBefore: gBefore,
          glyphsAfter: await page.evaluate(
            () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
          ),
        };
        // PRESS 2 BY POINTER — arm again, then tap the destructive answer.
        await page.locator('.action-bar button[aria-label="Clear the board"]').tap(T);
        await page.waitForTimeout(400);
        const armedAgain = await page.evaluate(() => !!document.querySelector(".confirm-ribbon"));
        const g2 = await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        );
        if (armedAgain) {
          await page.locator(".confirm-go").tap(T);
          await page.waitForTimeout(700);
        }
        row.press2 = {
          armedAgain,
          glyphsBefore: g2,
          glyphsAfter: await page.evaluate(
            () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
          ),
          ribbonGone: await page.evaluate(() => !document.querySelector(".confirm-ribbon")),
          verbsBack: await page.evaluate(() => !!document.querySelector(".action-verbs")),
        };
        row.press2.fired = row.press2.glyphsAfter < row.press2.glyphsBefore;
      }
      out[key] = row;
    } catch (e) {
      out[key] = { ...row, error: String(e).slice(0, 220) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
