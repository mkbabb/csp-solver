// T4-WM lane B — coarse-device evidence + end-to-end verification.
// Serves off the vite-preview build on 127.0.0.1:5288 (ephemeral, :3000/:3001 untouched).
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:5288";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/wm/impl-b-crops";
mkdirSync(OUT, { recursive: true });

const iphone = devices["iPhone 13"];
const results = {};

function ok(name, cond, extra) {
  results[name] = { pass: !!cond, ...(extra ? { extra } : {}) };
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  " + JSON.stringify(extra) : ""}`);
}

const browser = await chromium.launch();
// Coarse pointer is driven by hasTouch/isMobile, not DPR — drop to DSF 2 for lean crops.
const ctx = await browser.newContext({ ...iphone, deviceScaleFactor: 2 });
const page = await ctx.newPage();

async function loadSudoku(query = "?size=3&difficulty=EASY") {
  await page.goto(BASE + "/" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important;}" });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    { timeout: 20000 },
  );
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 20000 });
}

await loadSudoku();
ok("coarse-media", await page.evaluate(() => matchMedia("(pointer: coarse)").matches));

const panel = page.locator(".mobile-control-panel");
const undo = panel.locator('button[aria-label="Undo last move"]');
const redo = panel.locator('button[aria-label="Redo move"]');
const hint = panel.locator('button[aria-label="Reveal a hint in the selected cell"]');

// ── AFTER crop: the coarse control card with the play-tools row present ──
await panel.scrollIntoViewIfNeeded();
await panel.screenshot({ path: `${OUT}/control-card-after-390.png` });

// ── BEFORE crop: same card, the play row hidden (the state at HEAD-of-lane-B) ──
await page.addStyleTag({ content: ".play-controls{display:none !important;}" });
await panel.screenshot({ path: `${OUT}/control-card-before-390.png` });
await page.evaluate(() => {
  for (const s of document.querySelectorAll("style")) {
    if (s.textContent.includes(".play-controls{display:none")) s.remove();
  }
});

// ── 44px floor on all three play buttons ──
for (const [name, loc] of [["undo", undo], ["redo", redo], ["hint", hint]]) {
  const box = await loc.boundingBox();
  ok(`44px-${name}`, box && box.height >= 44 && box.width >= 44, box && { w: Math.round(box.width), h: Math.round(box.height) });
  ok(`sublabel-${name}`, await loc.locator(".icon-sublabel").isVisible());
}

// ── Sticky-hover gate: tap an icon-btn, then read its computed bg — must stay transparent
//    (the accent paint is fenced behind @media(hover:hover), so a coarse tap leaves no residue) ──
await undo.tap();
const bgAfterTap = await undo.evaluate((el) => getComputedStyle(el).backgroundColor);
ok("hover-not-sticky", bgAfterTap === "rgba(0, 0, 0, 0)" || bgAfterTap === "transparent", { bg: bgAfterTap });

// ── End-to-end wiring: type into a blank cell, then Undo → Redo round-trips the value ──
async function firstBlank() {
  return page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
}
let bi = await firstBlank();
const input = page.locator(".board-cells input").nth(bi);
await input.tap();
await page.keyboard.type("5");
await page.waitForFunction((i) => {
  const c = document.querySelectorAll(".sudoku-cell")[i];
  return c && c.querySelector(".glyph-svg");
}, bi, { timeout: 5000 }).catch(() => {});
const filledAfterType = await input.inputValue();
ok("entry-commits", filledAfterType === "5", { value: filledAfterType });

await undo.tap();
await page.waitForTimeout(300);
const afterUndo = await input.inputValue();
ok("undo-button-reverts", afterUndo === "", { value: afterUndo });

await redo.tap();
await page.waitForTimeout(300);
const afterRedo = await input.inputValue();
ok("redo-button-restores", afterRedo === "5", { value: afterRedo });

// ── Hint: tap a fresh blank cell, tap Hint → the solver fills it (solver-ink). ──
// Clear the typed cell first so a new blank is targeted, then let the solver settle.
await undo.tap();
await page.waitForTimeout(200);
bi = await firstBlank();
const hintInput = page.locator(".board-cells input").nth(bi);
await hintInput.tap();
await hint.tap();
const hintFilled = await page
  .waitForFunction((i) => {
    const c = document.querySelectorAll(".sudoku-cell")[i];
    return c && c.querySelector(".glyph-svg") ? true : false;
  }, bi, { timeout: 12000 })
  .then(() => true)
  .catch(() => false);
ok("hint-button-fills-focused-cell", hintFilled);

// ── Attribution tap opens on a single tap (the r2 §3 bug: nets closed at HEAD) ──
const attrib = page.locator(".mobile-attribution");
const trigger = attrib.locator(".attribution-trigger");
await trigger.scrollIntoViewIfNeeded();
await trigger.tap();
await page.waitForTimeout(250);
const expanded = await trigger.getAttribute("aria-expanded");
ok("attribution-opens-on-tap", expanded === "true", { ariaExpanded: expanded });
await attrib.screenshot({ path: `${OUT}/attribution-open-390.png` }).catch(() => {});

const allPass = Object.values(results).every((r) => r.pass);
console.log("\n=== SUMMARY ===");
console.log(JSON.stringify(results, null, 2));
console.log(allPass ? "\nALL PASS" : "\nSOME FAILED");

await browser.close();
process.exit(allPass ? 0 : 1);
