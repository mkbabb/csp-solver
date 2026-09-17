/**
 * T9-W6 PROVE lane — an INDEPENDENT live refutation attempt for R15.
 *
 * The authoring lane measured 1440x900 -> 640x900 and 1440x900 -> 390x844. This probe takes the
 * pose the PROVE fence names and the lane never ran: arm at 900x500 (a SHORT LANDSCAPE, which is
 * under M10's 1024 dock threshold at arm time, so the ribbon is armed in the dock regime rather
 * than the desk one) and rotate to 500x900. If the re-anchor only holds for a desk->phone
 * transition it will miss here.
 *
 * |D| = note centre minus the clamped card centre. 0 = anchored on its card.
 *
 * Run: node r15-refute-probe.mjs <label> <outdir>
 */
// Resolved by PATH, not by name: this file lives under docs/, and ESM resolves bare specifiers
// from the FILE's location, which never reaches web/frontend/node_modules.
import { chromium, webkit } from "../../../../../../web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4253";
const LABEL = process.argv[2] ?? "refute";
const OUT = process.argv[3] ?? ".";
const GUARD_EDGE_PX = 12;

const ARM = { width: 900, height: 500 };
const ROT = { width: 500, height: 900 };

async function measure(page) {
  return page.evaluate(() => {
    const note = document.querySelector(".gallery-guard");
    const root = document.querySelector(".game-gallery");
    const vp = document.querySelector(".gallery-viewport");
    const slots = document.querySelectorAll(".gallery-card-slot");
    const active = vp?.getAttribute("aria-activedescendant") ?? null;
    if (!note || !root || !slots.length)
      return { missing: { note: !note, root: !root, slots: slots.length }, active };
    // The ARMED card is the one the ribbon names. Read it off the deck rather than assuming 0.
    let idx = 0;
    for (let i = 0; i < slots.length; i++)
      if (slots[i].querySelector(".gallery-card")?.id === active) idx = i;
    const n = note.getBoundingClientRect();
    const s = slots[idx].getBoundingClientRect();
    const r = root.getBoundingClientRect();
    return {
      armedIndex: idx,
      active,
      noteCentre: n.left + n.width / 2,
      noteWidth: n.width,
      noteLeft: n.left,
      noteRight: n.right,
      cardCentre: s.left + s.width / 2,
      rootLeft: r.left,
      innerWidth: window.innerWidth,
      guardXVar: note.style.getPropertyValue("--guard-x"),
    };
  });
}

function expected(m) {
  if (!m || m.missing) return null;
  const half = m.noteWidth / 2;
  return Math.min(
    Math.max(m.cardCentre, GUARD_EDGE_PX + half),
    m.innerWidth - GUARD_EDGE_PX - half,
  );
}
const miss = (m) => {
  const e = expected(m);
  return e == null ? null : Math.round(Math.abs(m.noteCentre - e) * 100) / 100;
};

async function run(name, launcher) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: ARM });
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );

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

  for (let i = 0; i < 20; i++) {
    const hit = await page.evaluate(() => {
      const b = document.querySelector("button.logo-trigger");
      if (!b) return false;
      b.click();
      return true;
    });
    if (
      await page
        .locator(".gallery-viewport")
        .isVisible()
        .catch(() => false)
    )
      break;
    await page.waitForTimeout(hit ? 400 : 800);
  }
  await page.waitForSelector(".gallery-viewport", { timeout: 15000 });
  await page.waitForTimeout(900);

  await page.locator(".gallery-viewport").press("d");
  await page.waitForSelector(".gallery-guard", { timeout: 10000 });
  await page.waitForTimeout(800); // the ribbon SLIDES

  const before = await measure(page);
  await page.screenshot({ path: `${OUT}/${LABEL}-${name}-1-arm-900x500.png` });

  await page.setViewportSize(ROT);
  await page.waitForTimeout(900);
  const after = await measure(page);
  await page.screenshot({ path: `${OUT}/${LABEL}-${name}-2-rot-500x900.png` });

  const row = {
    engine: name,
    label: LABEL,
    armPose: ARM,
    rotPose: ROT,
    arm: { ...before, expected: expected(before), miss: miss(before) },
    rot: { ...after, expected: expected(after), miss: miss(after) },
    ribbonStillUp: !after?.missing,
    noteWhollyOnScreen: after?.missing
      ? null
      : after.noteLeft >= 0 && after.noteRight <= after.innerWidth,
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
