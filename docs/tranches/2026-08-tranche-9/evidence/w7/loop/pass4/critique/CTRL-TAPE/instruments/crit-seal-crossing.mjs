/**
 * CRITIC re-measure · CTRL-TAPE pass 4 — THE SEAL and THE CROSSING, my own reading.
 *   node crit-seal-crossing.mjs <baseURL>
 * Independent of the lane's p4-seal.mjs: same subjects (the row's own PANEL_H and the
 * declared reference line), written here so the number is not the lane's code's.
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://127.0.0.1:4243";

const READ = () => {
  const panel = document.querySelector(".controls-card .control-panel-wrap");
  const card = document.querySelector(".controls-card");
  const cs = card ? getComputedStyle(card) : null;
  const wells = [];
  for (const well of document.querySelectorAll(".controls-card .tray-well")) {
    const tape = well.querySelector(":scope > .washi-tag");
    if (!tape) continue;
    const pose = [...well.querySelectorAll(":scope > svg.outline-svg > g.boil-pose")].find(
      (p) => getComputedStyle(p).display !== "none",
    );
    const path = pose && pose.querySelector("path");
    if (!path) continue;
    const t = tape.getBoundingClientRect();
    const l = path.getBoundingClientRect();
    const w = well.getBoundingClientRect();
    wells.push({
      name: (tape.textContent || "").trim(),
      above: +(l.top - t.top).toFixed(2),
      below: +(t.bottom - l.top).toFixed(2),
      containerOver: +(w.top - l.top).toFixed(2),
    });
  }
  return {
    panelH: panel ? +panel.getBoundingClientRect().height.toFixed(2) : null,
    cardH: card ? +card.getBoundingClientRect().height.toFixed(2) : null,
    cardPadTop: cs ? cs.paddingTop : null,
    pinBand: cs ? cs.getPropertyValue("--pin-band").trim() : null,
    cardPadT: cs ? cs.getPropertyValue("--card-pad-t").trim() : null,
    wells,
  };
};

const out = {};
for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  const ctx = await b.newContext({
    baseURL: BASE,
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY&board=critseal");
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  await p.waitForTimeout(900);
  const regime = await p.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    row: matchMedia("(min-width: 1024px)").matches,
    rail: !!document.querySelector(".controls-card .control-panel-wrap"),
  }));
  const base = await p.evaluate(READ);

  // Does the seal's measured quantity contain the pin band at all?
  await p.addStyleTag({ content: `.controls-card { padding-top: 20px !important }` });
  await p.waitForTimeout(200);
  const pinAblated = await p.evaluate(READ);

  out[name] = { regime, base, pinAblatedPanelH: pinAblated.panelH, pinAblatedCardH: pinAblated.cardH };
  console.log(`== ${name} ${JSON.stringify(regime)}`);
  console.log(`   panelH=${base.panelH}  cardH=${base.cardH}  padTop=${base.cardPadTop}  --pin-band=${base.pinBand}  --card-pad-t="${base.cardPadT}"`);
  for (const w of base.wells)
    console.log(`   ${w.name.padEnd(10)} above=${w.above}  below=${w.below}  containerOver=${w.containerOver}`);
  console.log(`   pin band -> 20px: panelH=${pinAblated.panelH} (delta ${(pinAblated.panelH - base.panelH).toFixed(2)})  cardH=${pinAblated.cardH} (delta ${(pinAblated.cardH - base.cardH).toFixed(2)})`);
  await ctx.close();
  await b.close();
}
console.log("JSON " + JSON.stringify(out));
