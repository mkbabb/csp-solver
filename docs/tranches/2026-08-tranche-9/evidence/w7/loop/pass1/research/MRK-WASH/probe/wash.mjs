/**
 * MRK-WASH pass-1 · W1 — THE WASH'S CONTRAST, on composited pixels.
 *
 * The family's first research variable: can a FILL carry 1.4.11's 3:1 as the selection mark?
 * Three subjects on screen at the same time, always:
 *
 *   SELECTED   the keyboard-focused cell (the wash)
 *   UNIT       an empty cell carrying `.cell-peer` — the 7% crayon-blue unit wash
 *   NEUTRAL    an empty cell in neither
 *
 * and two ratios per arm: SELECTED vs NEUTRAL (the mark against the page) and SELECTED vs
 * UNIT (the mark against the other wash — "separable at a glance"). A third row reads the
 * digit's own 4.5:1 through whatever the arm put under it.
 *
 * ARMS. A0 is the charter's literal first prototype (fill the ghost path, drop its stroke,
 * keep the tier-2 alpha). A08…A80 sweep the body's alpha to find where 3:1 lands, if it
 * lands. B* add the wax rim under `paint-order: stroke`. CONTROL is HEAD.
 */
import { chromium, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, decode, sampleRect, ratio, r2, boardReady, cellCensus, focusCell } from "./lib.mjs";

const WASH_CSS = readFileSync(join(HERE, "..", "proto", "wash-board.css"), "utf8");

const ARMS = [
  { name: "A0-charter", a: 0.08, rimW: 0, rimO: 0 },
  { name: "A14", a: 0.14, rimW: 0, rimO: 0 },
  { name: "A20", a: 0.2, rimW: 0, rimO: 0 },
  { name: "A28", a: 0.28, rimW: 0, rimO: 0 },
  { name: "A40", a: 0.4, rimW: 0, rimO: 0 },
  { name: "A55", a: 0.55, rimW: 0, rimO: 0 },
  { name: "A70", a: 0.7, rimW: 0, rimO: 0 },
  { name: "A80", a: 0.8, rimW: 0, rimO: 0 },
  { name: "B18-rim3", a: 0.18, rimW: 3, rimO: 0.85 },
  { name: "B18-rim5", a: 0.18, rimW: 5, rimO: 0.85 },
  { name: "B28-rim5", a: 0.28, rimW: 5, rimO: 0.9 },
  { name: "B14-rim7", a: 0.14, rimW: 7, rimO: 0.9 },
];

async function setArm(page, arm) {
  await page.evaluate((a) => {
    const s = document.documentElement.style;
    s.setProperty("--wash-a", String(a.a));
    s.setProperty("--wash-rim-w", String(a.rimW));
    s.setProperty("--wash-rim-o", String(a.rimO));
  }, arm);
  await page.waitForTimeout(280);
}

async function measure(page, subjects, label) {
  const img = await decode(await page.screenshot({ type: "png" }));
  const out = { arm: label };
  for (const [k, s] of Object.entries(subjects)) out[k] = sampleRect(img, s.rect, 1);
  out.ratios = {
    selectedVsNeutral: ratio(out.selected.median, out.neutral.median),
    selectedVsUnit: ratio(out.selected.median, out.unit.median),
    unitVsNeutral: ratio(out.unit.median, out.neutral.median),
  };
  out.paint = await page.evaluate(() => {
    const p = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path");
    if (!p) return null;
    const cs = getComputedStyle(p);
    return {
      fill: cs.fill,
      fillOpacity: cs.fillOpacity,
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
      strokeOpacity: cs.strokeOpacity,
      filter: cs.filter,
      paintOrder: cs.paintOrder,
      animation: cs.animationName + " " + cs.animationDuration,
    };
  });
  return out;
}

/** Put a legal digit in the focused cell so the arm can be read with ink on it. */
async function inkTheCell(page) {
  for (const d of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
    await page.keyboard.press(d);
    await page.waitForTimeout(200);
    const bad = await page.evaluate(
      () => !!document.querySelector(".game-cell.is-invalid:has(input:focus-visible)"),
    );
    if (!bad) return d;
  }
  return null;
}

for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    const themeOk = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    if (themeOk !== (theme === "dark")) throw new Error(`theme not armed: ${theme}`);

    // Subjects. Focus an EMPTY cell in the middle third so its unit reaches both ways.
    let census = await cellCensus(page);
    const emptyMid = census.filter((c) => c.empty && c.i > 20 && c.i < 60);
    const sel = emptyMid[Math.floor(emptyMid.length / 2)];
    await focusCell(page, sel.i);
    census = await cellCensus(page);
    const unit = census.find((c) => c.peer && c.empty && !c.focused);
    const neutral = census.find((c) => !c.peer && c.empty && !c.focused);
    const subjects = {
      selected: census[sel.i],
      unit,
      neutral,
    };
    if (!unit || !neutral) throw new Error("no clean unit/neutral subject on this deal");

    const report = {
      engine: engineName,
      theme,
      at: new Date().toISOString(),
      subjectIdx: { selected: sel.i, unit: unit.i, neutral: neutral.i },
      focusedCells: census.filter((c) => c.focused).length,
      unitWashCount: census.filter((c) => c.peer).length,
      arms: [],
    };

    report.arms.push(await measure(page, subjects, "CONTROL-head"));

    await page.addStyleTag({ content: WASH_CSS });
    for (const arm of ARMS) {
      await setArm(page, arm);
      report.arms.push(await measure(page, subjects, arm.name));
    }

    // ── THE DIGIT THROUGH THE STACK ──
    // One legal digit in the selected cell, then the same sweep read as ink-vs-ground.
    const digit = await inkTheCell(page);
    report.digit = { wrote: digit, rows: [] };
    if (digit) {
      for (const arm of [
        { name: "CONTROL-head", a: 0.08, rimW: 7, rimO: 0.9 },
        ...ARMS,
      ]) {
        await setArm(page, arm);
        const img = await decode(await page.screenshot({ type: "png" }));
        // The glyph lives in the middle of the cell; a 0.34 inset is inside the digit's own
        // bounding box, so `darkest` is the stroke and `lightest` the ground beside it.
        const s = sampleRect(img, subjects.selected.rect, 1, 0.34);
        report.digit.rows.push({
          arm: arm.name,
          ink: s.p05,
          ground: s.lightest,
          inkVsGround: ratio(s.p05, s.lightest),
        });
      }
    }

    // ── THE π-GUARD UNDER THE OVERLAY ──
    await setArm(page, ARMS[0]);
    report.budget = await page.evaluate(() => {
      const live = [];
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.filter !== "none" && cs.display !== "none")
          live.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/)[0]}`);
      }
      return {
        liveFilterTotal: live.length,
        ghostPaths: document.querySelectorAll(".cell-ghost-path").length,
        ghostSvgs: document.querySelectorAll(".cell-ghost svg").length,
        cells: document.querySelectorAll(".game-cell").length,
        ghostFilter: getComputedStyle(document.querySelector(".cell-ghost-path")).filter,
      };
    });

    // ── FORCED COLORS ──
    await page.emulateMedia({ forcedColors: "active" });
    await page.waitForTimeout(300);
    report.forcedColors = await page.evaluate(() => {
      const cell = document.querySelector(".game-cell:has(input:focus-visible)");
      if (!cell) return null;
      const cs = getComputedStyle(cell);
      return { outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, offset: cs.outlineOffset };
    });
    await page.emulateMedia({ forcedColors: "none" });

    bank(`wash-${engineName}-${theme}.json`, report);
    const best = report.arms
      .map((a) => `${a.arm}=${a.ratios.selectedVsNeutral}/${a.ratios.selectedVsUnit}`)
      .join(" ");
    console.log(`WASH ${engineName} ${theme} :: ${best}`);
    console.log(`  budget=${JSON.stringify(report.budget)} fc=${JSON.stringify(report.forcedColors)}`);
    if (report.digit.rows.length)
      console.log("  digit " + report.digit.rows.map((d) => `${d.arm}=${d.inkVsGround}`).join(" "));
    await ctx.close();
  }
  await browser.close();
}
