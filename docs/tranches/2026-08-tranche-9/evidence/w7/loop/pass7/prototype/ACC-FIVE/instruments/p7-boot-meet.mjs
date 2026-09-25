/**
 * ACC-FIVE pass 7 · INTAKE-23 row 20's second clause: where the boot clock MEETS the fronts, read POST-PAINT
 * with the chair's ONE painted-frame recorder (pass7/instruments/painted-frames.mjs `record`, imported). On
 * three trees — the lane's (74a2b5d9 + FIVE), the control 74a2b5d9, and main-HEAD c31a92b9 (the owner's
 * product, a `git archive` scratch tree) — the boot is recorded from navigation twice per run: once with the
 * grid's ruling as the subject (`path.frame-line` stroke-dashoffset, the draw-in M20 names) and once with the
 * tally's first inked stroke (the lane's tree: its geometric front, read as the path's painted rect; the
 * control and main: HEAD's dash, `stroke-dashoffset`). Each subject's window [onset, onset + motion] is on the
 * post-paint timeline; the MEETING is their overlap. Held intervals (≥ 50 ms) inside each window are printed.
 * `?size=3&difficulty=HARD` (the tally inks the dealt board's measured grade; HARD inks 3–5 strokes).
 *
 *   node p7-boot-meet.mjs <tree> <control> <main> [runs=3]
 */
import { record, load } from "../../../instruments/painted-frames.mjs";
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [TREE, CTRL, MAIN, RUNS = "3"] = process.argv.slice(2);
const Q = "/?size=3&difficulty=HARD";
const SUBJ = {
  grid: () => "css:path.frame-line:stroke-dashoffset",
  tally: (arm) => (arm === "tree" ? ".dt-pose .dt-stroke.inked" : "css:.dt-stroke.inked:stroke-dashoffset"),
};
const rows = [];
for (const engine of ["chromium", "webkit"]) {
  const browser = await pw[engine].launch();
  for (const [arm, base] of [["tree", TREE], ["control", CTRL], ["main", MAIN]]) {
    for (let r = 0; r < Number(RUNS); r++) {
      const w = {};
      for (const s of ["grid", "tally"]) {
        const o = await record(browser, engine, { url: base + Q, viewport: { width: 1280, height: 800 }, trigger: "load", subject: SUBJ[s](arm), roi: ".board-wrapper", windowMs: 5000, ready: ".sudoku-cell" });
        w[s] = { on: o.latencyMs, end: +(o.latencyMs + o.motionMs).toFixed(1), moved: o.subjectMovedFrames, heldSubj: o.held.subject, heldPhoto: o.held.photo, maxSubj: o.subjectMaxMs };
      }
      const meet = Math.max(0, Math.min(w.grid.end, w.tally.end) - Math.max(w.grid.on, w.tally.on));
      rows.push({ engine, arm, r, ...w, meetMs: +meet.toFixed(1) });
      const f = (x) => `${x.on}→${x.end} ms (${x.moved} moved, max subj ${x.maxSubj}, held subj ${JSON.stringify(x.heldSubj)} photo ${JSON.stringify(x.heldPhoto).slice(0, 60)})`;
      console.log(`${engine} ${arm} r${r} · ruling ${f(w.grid)} · tally ${f(w.tally)} · MEET ${meet.toFixed(1)} ms · load ${load()}`);
    }
  }
  await browser.close();
}
console.log("ALLDONE");
