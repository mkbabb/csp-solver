/**
 * T9-W7 pass 2 · RESEARCH · CTRL-TAPE — the ATTRIBUTION probe.
 *
 * One question: WHY does the deck's staging band lose 24.02px and its first card gain 12.00px
 * under a patch that edits no gallery file? The candidate mechanism is that the tape's parent
 * is a flex container in the card and is NOT one in the band, so the `<span>` → `<h2>` swap
 * turns the tape's vertical margins ON for the first time on that one surface.
 *
 * Reads the parent's `display`, the tape's own `display`, and the heading population of the
 * deck's a11y tree, HEAD vs proto, both engines.
 *
 * usage: node r2-attrib.mjs <out.json>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const SERVERS = { head: "http://127.0.0.1:4230", proto: "http://127.0.0.1:4232" };

const READ = () => {
  const one = (tape) => {
    if (!tape) return null;
    const p = tape.parentElement;
    const ts = getComputedStyle(tape);
    const ps = p ? getComputedStyle(p) : null;
    return {
      tagName: tape.tagName,
      tapeDisplay: ts.display,
      marginTop: ts.marginTop,
      marginBottom: ts.marginBottom,
      /** the whole of it: vertical margins are INERT on a non-replaced inline box. */
      marginsApply: ts.display !== "inline",
      parent: p ? String(p.className).slice(0, 40) : null,
      parentDisplay: ps ? ps.display : null,
      alignSelfHonoured: ps ? ps.display.includes("flex") || ps.display.includes("grid") : false,
      width: +tape.getBoundingClientRect().width.toFixed(2),
      clipPath: ts.clipPath.slice(0, 60),
    };
  };
  const root = getComputedStyle(document.documentElement);
  return {
    deckTape: one(document.querySelector(".staging-band .washi-tag")),
    tokens: {
      typeTag: root.getPropertyValue("--type-tag").trim(),
      typeName: root.getPropertyValue("--type-name").trim(),
      typeGroupTitle: root.getPropertyValue("--type-group-title").trim(),
      typeOption: root.getPropertyValue("--type-option").trim(),
    },
    /** every heading the deck speaks, in document order. */
    deckHeadings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      tag: h.tagName,
      cls: String(h.className).slice(0, 34),
      text: (h.textContent || "").trim().slice(0, 28),
    })),
    washiTagCount: document.querySelectorAll(".washi-tag").length,
  };
};

const CARD = () => {
  const tape = document.querySelector(".controls-card .washi-tag");
  if (!tape) return null;
  const p = tape.parentElement;
  const ts = getComputedStyle(tape);
  return {
    tagName: tape.tagName,
    tapeDisplay: ts.display,
    parent: p ? String(p.className).slice(0, 40) : null,
    parentDisplay: p ? getComputedStyle(p).display : null,
    width: +tape.getBoundingClientRect().width.toFixed(2),
  };
};

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const [srv, base] of Object.entries(SERVERS)) {
    const browser = await eng.launch();
    const ctx = await browser.newContext({
      baseURL: base,
      viewport: { width: 390, height: 844 },
    });
    const page = await ctx.newPage();
    await page.goto("/?view=gallery&size=3&difficulty=EASY");
    await page.waitForSelector(".staging-band", { timeout: 30000 });
    await page.waitForTimeout(700);
    out[`${engName}|${srv}|deck`] = await page.evaluate(READ);
    await page.goto("/?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    await page.locator(".drawer-tab").click();
    await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
    await page.waitForTimeout(900);
    out[`${engName}|${srv}|card`] = await page.evaluate(CARD);
    await ctx.close();
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
