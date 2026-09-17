/**
 * T9-W6 lane 6D-R15 — the live-edge probe for the armed guard's re-anchor.
 *
 * Arms the deal ribbon on card 0 (sudoku, the deck's default pose) at a desk viewport, measures
 * the note's centre against its card's, then ROTATES the frame to a phone and measures again
 * WITHOUT touching the ribbon. The miss after the resize is the R15 residue.
 *
 * Run: node r15-resize-probe.mjs <label>   (writes <label>-<engine>.json + PNGs)
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4237";
const OUT = process.argv[3] ?? ".";
const LABEL = process.argv[2] ?? "probe";
const GUARD_EDGE_PX = 12;

const DESK = { width: 1440, height: 900 };
const PHONE = process.env.PHONE_W
  ? { width: Number(process.env.PHONE_W), height: Number(process.env.PHONE_H ?? 844) }
  : { width: 640, height: 900 };

async function measure(page) {
  return page.evaluate(() => {
    const note = document.querySelector(".gallery-guard");
    const slot = document.querySelectorAll(".gallery-card-slot")[0];
    const root = document.querySelector(".game-gallery");
    if (!note || !slot || !root)
      return {
        missing: { note: !note, slot: !slot, root: !root },
        deckOpen: !!document.querySelector(".gallery-viewport"),
        activeDescendant:
          document
            .querySelector(".gallery-viewport")
            ?.getAttribute("aria-activedescendant") ?? null,
      };
    const n = note.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    return {
      noteCentre: n.left + n.width / 2,
      noteWidth: n.width,
      cardCentre: s.left + s.width / 2,
      rootLeft: r.left,
      innerWidth: window.innerWidth,
      guardXVar: note.style.getPropertyValue("--guard-x"),
    };
  });
}

/** What the deck OUGHT to read at this pose: the card's centre, clamped to keep the note whole. */
function expected(m) {
  if (!m || m.missing) return null;
  const half = m.noteWidth / 2;
  const c = Math.min(
    Math.max(m.cardCentre, GUARD_EDGE_PX + half),
    m.innerWidth - GUARD_EDGE_PX - half,
  );
  return c;
}

async function run(name, launcher) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: DESK });
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );

  // Dirty the board — a recorded edit, so the deal ribbon has something to speak about.
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++)
      if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await page.locator(".sudoku-cell").nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(400);

  // Open the deck (committed press — the wordmark tears out its pose stack on the bake, and
  // stays an inert <span> until the bake lands, so wait for the BUTTON).
  for (let i = 0; i < 20; i++) {
    const hit = await page.evaluate(() => {
      const b = document.querySelector("button.logo-trigger");
      if (!b) return false;
      b.click();
      return true;
    });
    if (await page.locator(".gallery-viewport").isVisible().catch(() => false)) break;
    await page.waitForTimeout(hit ? 400 : 800);
  }
  await page.waitForSelector(".gallery-viewport", { timeout: 15000 });
  await page.waitForTimeout(900); // the deal + fold settle

  // Arm the DEAL ribbon on the centred card (index 0 = sudoku, the default pose).
  await page.locator(".gallery-viewport").press("d");
  await page.waitForSelector(".gallery-guard", { timeout: 10000 });
  await page.waitForTimeout(800); // the ribbon SLIDES — poll to the settled pose

  const before = await measure(page);
  await page.screenshot({ path: `${OUT}/${LABEL}-${name}-1-desk.png` });

  // THE ROTATION. Nothing touches the ribbon; only the frame changes.
  await page.setViewportSize(PHONE);
  await page.waitForTimeout(900);
  const after = await measure(page);
  await page.screenshot({ path: `${OUT}/${LABEL}-${name}-2-phone.png` });

  const miss = (m) => {
    const e = expected(m);
    return e == null ? null : Math.round(Math.abs(m.noteCentre - e) * 100) / 100;
  };
  const row = {
    engine: name,
    label: LABEL,
    desk: { ...before, expected: expected(before), miss: miss(before) },
    phone: { ...after, expected: expected(after), miss: miss(after) },
    ribbonStillUp: !after?.missing,
  };
  writeFileSync(`${OUT}/${LABEL}-${name}.json`, JSON.stringify(row, null, 2));
  console.log(JSON.stringify(row, null, 2));
  await browser.close();
}

const only = process.env.ENGINE;
const reps = Number(process.env.REPS ?? 1);
for (let r = 0; r < reps; r++) {
  const tag = reps > 1 ? `-r${r + 1}` : "";
  if (!only || only === "chromium") await run(`chromium${tag}`, chromium);
  if (!only || only === "webkit") await run(`webkit${tag}`, webkit);
}
