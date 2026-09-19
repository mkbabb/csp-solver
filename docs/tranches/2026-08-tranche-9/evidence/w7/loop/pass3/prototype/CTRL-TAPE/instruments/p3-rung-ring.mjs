/**
 * T9-W7 pass 3 · CTRL-TAPE — TWO NUMBERS THE RETURN CANNOT STATE WITHOUT.
 *
 *  (1) THE `--washi-tag-rung` ABLATION. The spec's §1.1 block registered the name at
 *      `initial-value: 14px`. It is declared on `.controls-card` and READ by every washi tape
 *      in the estate; the ones outside the card (the deck's staging tape, the board's
 *      attribution tape) take `SheetWashiLabel`'s `var(--washi-tag-rung, var(--type-tag))`
 *      fallback, and `--type-tag` is a viewport-dependent clamp. Registering the name makes the
 *      fallback unreachable. This measures the tapes outside the card before and after.
 *
 *  (2) THE RING'S VALUE AS READ. `--ring-ink` is struck in this lane (registry §2.4 gives the
 *      mint to §6), so the consumer reads `var(--ring-ink, currentColor)`. Focus is driven by a
 *      real Tab press, because `:focus-visible` does not match a programmatic `focus()` and a
 *      probe that focuses by script reads the UNRINGED pose and calls it the ring.
 *
 *   node p3-rung-ring.mjs <out.json> <base> [engine]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4];

/** Every washi tape OUTSIDE the controls card — the population the registration would move. */
const OUTSIDE_TAPES = () =>
  [...document.querySelectorAll(".washi-tag, .washi-label, .sheet-washi-label")]
    .filter((e) => !e.closest(".controls-card"))
    .map((e) => {
      const b = e.getBoundingClientRect();
      return {
        text: (e.textContent || "").trim().slice(0, 18),
        host: e.closest("[class]")?.className?.toString().slice(0, 28) ?? null,
        font: getComputedStyle(e).fontSize,
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
      };
    });

const REGISTER = () => {
  try {
    CSS.registerProperty({
      name: "--washi-tag-rung",
      syntax: "<length>",
      inherits: true,
      initialValue: "14px",
    });
    return "registered";
  } catch (e) {
    return `threw: ${String(e).slice(0, 90)}`;
  }
};

const RING = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { focused: null };
  const cs = getComputedStyle(el);
  return {
    focused: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28),
    cls: String(el.className || "").slice(0, 40),
    matchesFocusVisible: el.matches(":focus-visible"),
    outlineStyle: cs.outlineStyle,
    outlineWidth: cs.outlineWidth,
    outlineColor: cs.outlineColor,
    outlineOffset: cs.outlineOffset,
    color: cs.color,
    ringInkToken: getComputedStyle(document.documentElement)
      .getPropertyValue("--ring-ink")
      .trim(),
    ground: (() => {
      // The ground the ring lands on, as painted: walk up for the first opaque background.
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
        n = n.parentElement;
      }
      return null;
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
    const key = `${engName}|${theme}`;
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    try {
      // ── (1) THE DECK.
      await page.goto("/?view=gallery");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForTimeout(1500);
      const deckBefore = await page.evaluate(OUTSIDE_TAPES);
      const registered = await page.evaluate(REGISTER);
      await page.waitForTimeout(300);
      const deckAfter = await page.evaluate(OUTSIDE_TAPES);

      // ── (2) THE RING, with a real keyboard walk into the card.
      await page.goto("/?size=3&difficulty=EASY");
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await page.waitForTimeout(600);
      const rings = [];
      for (let i = 0; i < 26; i++) {
        await page.keyboard.press("Tab");
        const r = await page.evaluate(RING);
        if (r.focused && r.cls && !/sudoku-cell/.test(r.cls)) {
          const inCard = await page.evaluate(
            () => !!document.activeElement?.closest(".controls-card"),
          );
          if (inCard) rings.push(r);
        }
        if (rings.length >= 4) break;
      }
      out[key] = { registered, deckBefore, deckAfter, rings };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
