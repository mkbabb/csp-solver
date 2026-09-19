#!/usr/bin/env node
/**
 * P2 — THE ASSIGNMENT TABLE, AS DATA.  (MOT-VERB pass 1)
 *
 * Every declaration P1 found gets ONE verb here, with the tuple it would inherit and the
 * DELTA from what ships. Two laws are priced side by side, because the answer to "how many
 * verbs" depends on which one the set is written under:
 *
 *   STRICT  — a verb owns exactly ONE duration. Assigning a row to a verb RETIMES it to that
 *             verb's ms. The delta column is what the owner would see move.
 *   LADDER  — a verb owns its curve, fill, properties and PRM arm absolutely, and a CLOSED
 *             set of duration rungs named by TRAVEL (page / sheet / step / mark / breath).
 *             A row keeps its shipped ms when that ms IS a rung; otherwise it snaps to the
 *             nearest rung and the delta is printed.
 *
 * The verb set under test is SIX. `--four` collapses TURN+SLIDE into LAY DOWN and RUB OUT
 * into LIFT and re-prices, which is the fork's other arm.
 *
 * Run: node p2-assignment.mjs [--four] [--rows] [--resist]
 */
import { execFileSync } from "node:child_process";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const census = JSON.parse(
  execFileSync("node", [join(HERE, "p1-declaration-census.mjs"), "--json"], {
    encoding: "utf8",
    maxBuffer: 64e6,
  }),
);
const FOUR = process.argv.includes("--four");

// ── THE RUNGS — duration names, by TRAVEL, taken from what already has a home ──────────
// page  520  MOTION.boardFoldMs  (a full sheet or the whole board turns)
// sheet 280  the laminate's lay-down, the owner's one arrival ruling
// step  440  MOTION.cardStepMs   (one slot of travel)
// mark  250  the note/vignette write-in, the estate's most-used arrival
// breath 200 MOTION.chromeLeaveMs (a thing stops being there)
// beat  125  MOTION.beatMs
const RUNGS = { page: 520, step: 440, sheet: 280, mark: 250, breath: 200, touch: 150, beat: 125 };

// ── THE SET ───────────────────────────────────────────────────────────────────────────
const SIX = {
  "LAY DOWN": {
    gloss: "a hand puts something on the page and it stays",
    curve: "--ease-glassGlide",
    strictMs: RUNGS.sheet,
    rungs: ["page", "sheet", "mark", "touch"],
    props: "opacity, transform",
    fill: "backwards",
    prm: "same-frame swap, no tween",
  },
  LIFT: {
    gloss: "a hand takes something off the page",
    curve: "--verb-lift-ease (= --ease-fadeOut control points; --ease-accelIn retires INTO it)",
    strictMs: RUNGS.breath,
    rungs: ["breath", "mark", "touch"],
    props: "opacity, transform",
    fill: "none",
    prm: "same-frame cut",
  },
  TURN: {
    gloss: "the page itself turns over; what was here is now there",
    curve: "--ease-glassGlide",
    strictMs: RUNGS.page,
    rungs: ["page"],
    props: "transform",
    fill: "none (WAAPI, composite replace)",
    prm: "same-frame swap of the two layout states",
  },
  SLIDE: {
    gloss: "a thing travels along its rail without becoming anything else",
    curve: "--ease-glassGlide",
    strictMs: RUNGS.step,
    rungs: ["page", "step", "sheet", "touch"],
    props: "transform",
    fill: "none",
    prm: "instant jump",
  },
  "WRITE IN": {
    gloss: "ink appears the way a hand writes it",
    curve: "--ease-noteWrite",
    strictMs: RUNGS.mark,
    rungs: ["mark", "breath", "touch"],
    props: "clip-path, stroke-dashoffset, opacity",
    fill: "backwards",
    prm: "the finished mark, at once",
  },
  "RUB OUT": {
    gloss: "ink leaves the way a hand erases it",
    curve: "--verb-lift-ease",
    strictMs: RUNGS.breath,
    rungs: ["breath", "mark"],
    props: "clip-path, opacity",
    fill: "none",
    prm: "gone at once",
  },
};
const FOURSET = { ...SIX };
delete FOURSET.TURN;
delete FOURSET.SLIDE;
delete FOURSET["RUB OUT"];
FOURSET["LAY DOWN"] = { ...SIX["LAY DOWN"], rungs: ["page", "step", "sheet", "mark"] };
FOURSET.LIFT = { ...SIX.LIFT, rungs: ["breath", "mark"] };
FOURSET.WRITE = { ...SIX["WRITE IN"] };
delete FOURSET["WRITE IN"];
const VERBS = FOUR ? FOURSET : SIX;
const has = (v) => Object.prototype.hasOwnProperty.call(VERBS, v);
const vmap = (v) =>
  has(v) ? v : { TURN: "LAY DOWN", SLIDE: "LAY DOWN", "RUB OUT": "LIFT", "WRITE IN": "WRITE" }[v] ?? v;

// ── THE ASSIGNMENT — one row per declaration site, keyed file:line ────────────────────
// verb | note. `RESIST` marks a row the set cannot take cleanly; the note says why.
const A = {
  // ─ the gallery ─
  "src/games/shared/scene.css:617": ["LIFT", "chrome leave, the declared twin"],
  "src/games/shared/scene.css:629": ["LIFT", "chrome leave, gallery arm of the same twin"],
  "src/App.vue:1142": ["LIFT", "deck leave-only dissolve, the OTHER declared twin"],
  "src/games/shared/scene.css:606": ["LAY DOWN", "controls fade-in; 250+150 delay"],
  "src/pencil/chrome/GameGallery/GameCard.vue:410": ["SLIDE", "the three cards' pose, one slot"],
  "src/pencil/chrome/GameGallery/GameGallery.vue:1473": ["SLIDE", "guard ribbon arm/retire"],
  "src/pencil/chrome/GameGallery/GameGallery.vue:1320": ["LAY DOWN", "gallery chrome"],
  "src/pencil/chrome/GameGallery/GameGallery.vue:1420": ["LAY DOWN", "gallery chrome"],
  "src/pencil/chrome/GameGallery/GameCard.vue:593": ["LAY DOWN", "card chrome"],
  // ─ the drawer ─
  "src/games/shared/DrawerTab.vue:144": ["SLIDE", "tongue tilt straightens; hover"],
  "src/games/shared/GameControlPanel.vue:2082": ["RESIST", "`transition: all 200ms`, no property set a verb can own"],
  "src/games/shared/GameControlPanel.vue:2132": ["LAY DOWN", "fold hint"],
  "src/games/shared/GameControlPanel.vue:2284": ["RESIST", "grid-template-rows: the one LAYOUT animation; no verb's property set"],
  "src/games/shared/GameControlPanel.vue:1724": ["LAY DOWN", "player row arrives"],
  "src/games/shared/GameControlPanel.vue:1728": ["WRITE IN", "player name draws on"],
  "src/games/shared/GameControlPanel.vue:1735": ["LIFT", "player row leaves"],
  "src/games/shared/GameControlPanel.vue:1739": ["WRITE IN", "player name draws on"],
  "src/games/shared/GameControlPanel.vue:1744": ["LIFT", "player row leaves"],
  "src/games/shared/GameControlPanel.vue:1749": ["LAY DOWN", "player row settle"],
  "src/games/shared/GameControlPanel.vue:1810": ["LAY DOWN", "control chrome"],
  "src/games/shared/GameControlPanel.vue:1956": ["LAY DOWN", "chip ground"],
  "src/games/shared/GameControlPanel.vue:2452": ["LAY DOWN", "panel keyframe"],
  "src/games/shared/GameControlPanel.vue:2473": ["LAY DOWN", "panel keyframe"],
  "src/games/shared/scene.css:378": ["LAY DOWN", "scene chrome fade"],
  // ─ the dark toggle ─
  "src/assets/index.css:667": ["DUSK?", "THE DUSK — the closed-set test"],
  "src/pencil/celestial/DarkModeToggle.vue:769": ["LIFT", "outgoing icon leaves"],
  "src/pencil/celestial/DarkModeToggle.vue:780": ["LAY DOWN", "incoming icon arrives"],
  "src/pencil/celestial/DarkModeToggle.vue:795": ["LIFT", "wring-down: the icon is taken off"],
  "src/pencil/celestial/DarkModeToggle.vue:810": ["LAY DOWN", "the bloom: the icon is put down"],
  "src/pencil/celestial/DarkModeToggle.vue:822": ["RESIST", "toggle-squash: a SHAPE verb (T6 vocabulary), not a timing verb"],
  "src/pencil/celestial/DarkModeToggle.vue:843": ["RESIST", "plush-land: a SHAPE verb (T6 vocabulary)"],
  "src/pencil/celestial/DarkModeToggle.vue:873": ["LIFT", "star tucks in"],
  "src/pencil/celestial/DarkModeToggle.vue:882": ["LAY DOWN", "star pops out"],
  "src/pencil/celestial/DarkModeToggle.vue:888": ["LAY DOWN", "star pop delay rung"],
  "src/pencil/celestial/DarkModeToggle.vue:891": ["LAY DOWN", "star pop delay rung"],
  "src/pencil/celestial/DarkModeToggle.vue:717": ["SLIDE", "hover tilt"],
  "src/pencil/celestial/DarkModeToggle.vue:976": ["LAY DOWN", "rest-stack swap"],
  // ─ the margin furniture ─
  "src/pencil/chrome/MarginNote.vue:149": ["WRITE IN", "the note's arrival"],
  "src/pencil/chrome/MarginNote.vue:180": ["WRITE IN", "the tally's arrival"],
  "MarginNote.vue:(missing)": ["RUB OUT", "THE HOLE — §7's exit, a verb with no implementation"],
  "src/games/shared/SolverErrorNote.vue:63": ["WRITE IN", "error note arrives"],
  "src/games/shared/SolverErrorNote.vue:97": ["LAY DOWN", "hover ground"],
  "src/pencil/chrome/CompletionVignette.vue:133": ["WRITE IN", "vignette voice arrives"],
  "src/pencil/sheet/SheetWashiLabel.vue:109": ["LAY DOWN", "the tape is laid on"],
  "src/pencil/chrome/AttributionCard/CrayonHeart.vue:329": ["LAY DOWN", "the heart is laid on"],
  "src/pencil/chrome/AttributionCard/AttributionCard.vue:183": ["LAY DOWN", "card chrome"],
  "src/pencil/chrome/AttributionCard/AttributionCard.vue:205": ["LAY DOWN", "card chrome"],
  "src/pencil/sheet/AnswerKeyLaminate.vue:236": ["LAY DOWN", "the laminate is laid down (the ruling)"],
  "src/pencil/sheet/AnswerKeyLaminate.vue:224": ["LIFT", "the laminate is lifted away (the asymmetry)"],
  "src/pencil/sheet/AnswerKeyLaminate.vue:271": ["WRITE IN", "the key's copy"],
  "src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:588": ["WRITE IN", "the grid draws on"],
  "src/assets/index.css:590": ["WRITE IN", "solve-success stroke"],
  "src/assets/index.css:607": ["LAY DOWN", "solve-success frame shadow"],
  "src/assets/index.css:679": ["RESIST", "refuse-shake: a SHAPE verb (T6 ERROR family)"],
  "src/assets/index.css:721": ["RESIST", "cell-reveal: a SHAPE verb (T6 incumbent)"],
  "src/assets/index.css:722": ["RESIST", "cell-reveal's delay token"],
  "src/assets/index.css:746": ["RESIST", "the global PRM duration kill, not a gesture"],
  "src/assets/index.css:768": ["WRITE IN", "pencil-draw-on, THE primitive; --draw-dur is the publisher precedent"],
  "src/assets/index.css:990": ["RESIST", "celebration crest window, bound from CELEBRATION"],
  // ─ the board and the rest ─
  "src/games/futoshiki/CaretOverlay.vue:64": ["LIFT", "caret leaves"],
  "src/games/shared/GameBoard.vue:1265": ["LIFT", "board chrome leaves"],
  "src/games/thermo/ThermoTube.vue:114": ["LIFT", "tube chrome leaves"],
  "src/games/shared/gameCell.css:35": ["LAY DOWN", "cell mark arrives"],
  "src/games/shared/gameCell.css:154": ["LAY DOWN", "cell mark arrives"],
  "src/games/shared/gameCell.css:239": ["WRITE IN", "ghost draw"],
  "src/games/shared/gameCell.css:257": ["WRITE IN", "ghost draw"],
  "src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:560": ["WRITE IN", "the wordmark's 1.2s clip wipe"],
  "src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:647": ["WRITE IN", "the caret"],
  "src/pencil/chrome/ScribbleLoader.vue:81": ["RESIST", "a LOOP, not a gesture: 1000ms linear, perpetual"],
  "src/pencil/chrome/icons/DiceIcon.vue:113": ["RESIST", "icon SHAPE keyframe"],
  "src/pencil/chrome/icons/DiceIcon.vue:134": ["RESIST", "icon SHAPE keyframe"],
  "src/pencil/chrome/icons/FillForcedIcon.vue:72": ["RESIST", "icon SHAPE keyframe"],
  "src/pencil/chrome/icons/SolveIcon.vue:55": ["RESIST", "icon SHAPE keyframe"],
  "src/pencil/chrome/icons/SolveIcon.vue:70": ["RESIST", "icon SHAPE keyframe"],
  // ─ the WAAPI movers, which spell no duration in CSS and so are invisible to I6 ─
  "src/games/shared/useFlipGlide.ts:164": ["TURN", "the board/card fold + the drawer's four movers"],
  "src/pencil/chrome/GameGallery/useCarouselGlide.ts:328": ["SLIDE", "the card step's track"],
  "src/App.vue:447": ["TURN", "the exit fold's DEAD mover — plays TURN once the restore ordering is cured"],
  // ─ the dev rig (declared out of scope, counted so the total is honest) ─
  "src/pencil/dev/FilterTuner.vue:434": ["OUT", "dev rig"],
  "src/pencil/dev/FilterTuner.vue:606": ["OUT", "dev rig"],
  "src/pencil/dev/FilterTuner.vue:624": ["OUT", "dev rig"],
  "src/pencil/dev/FilterTuner.vue:627": ["OUT", "dev rig"],
};

const ms = (s) => (s.endsWith("ms") ? +s.slice(0, -2) : +s.slice(0, -1) * 1000);
const nearestRung = (v, n) => {
  const cand = (VERBS[v]?.rungs ?? Object.keys(RUNGS)).map((r) => [r, RUNGS[r]]);
  return cand.reduce((b, c) => (Math.abs(c[1] - n) < Math.abs(b[1] - n) ? c : b));
};

const rows = [];
for (const r of census.i6) {
  const key = `${r.file}:${r.line}`;
  const [rawVerb, note] = A[key] ?? ["UNASSIGNED", ""];
  const verb = rawVerb === "RESIST" || rawVerb === "OUT" || rawVerb === "DUSK?" || rawVerb === "UNASSIGNED" ? rawVerb : vmap(rawVerb);
  const shipped = ms(r.durations[0]);
  const t = VERBS[verb];
  const strictDelta = t ? t.strictMs - shipped : null;
  const [rungName, rungMs] = t ? nearestRung(verb, shipped) : [null, null];
  const ladderDelta = t ? rungMs - shipped : null;
  rows.push({ key, verb, note, shipped, curveShipped: [...r.houseCurves, ...r.keywordCurves].join(" ") || "(none)", strictDelta, rungName, ladderDelta, curveVerb: t?.curve ?? null });
}
// the three JS/hole rows P1 cannot see
for (const key of ["src/games/shared/useFlipGlide.ts:164", "src/pencil/chrome/GameGallery/useCarouselGlide.ts:328", "src/App.vue:447", "MarginNote.vue:(missing)"]) {
  const [rawVerb, note] = A[key];
  rows.push({ key, verb: vmap(rawVerb), note, shipped: null, curveShipped: "MOTION.curves.drawerGlide", strictDelta: null, rungName: null, ladderDelta: null, curveVerb: VERBS[vmap(rawVerb)]?.curve ?? null });
}

const inSet = rows.filter((r) => VERBS[r.verb]);
const resist = rows.filter((r) => r.verb === "RESIST");
const dusk = rows.filter((r) => r.verb === "DUSK?");
const out = rows.filter((r) => r.verb === "OUT");
const unass = rows.filter((r) => r.verb === "UNASSIGNED");

console.log(`SET: ${Object.keys(VERBS).length} verbs — ${Object.keys(VERBS).join(" · ")}`);
console.log(`rows total ${rows.length} | in-set ${inSet.length} | RESIST ${resist.length} | DUSK? ${dusk.length} | dev-rig OUT ${out.length} | UNASSIGNED ${unass.length}`);

const timed = inSet.filter((r) => r.shipped != null);
const strictMoved = timed.filter((r) => r.strictDelta !== 0);
const ladderMoved = timed.filter((r) => r.ladderDelta !== 0);
const curveMoved = inSet.filter((r) => r.curveVerb && !r.curveShipped.includes(r.curveVerb));
console.log(`\nSTRICT (one duration per verb): ${strictMoved.length}/${timed.length} timed rows RETIMED`);
console.log(`  worst: ${strictMoved.map((r) => Math.abs(r.strictDelta)).sort((a, b) => b - a).slice(0, 5).join("ms, ")}ms`);
console.log(`LADDER (verb owns curve+fill+PRM; duration is a named rung): ${ladderMoved.length}/${timed.length} timed rows RETIMED`);
console.log(`  worst: ${ladderMoved.map((r) => Math.abs(r.ladderDelta)).sort((a, b) => b - a).slice(0, 5).join("ms, ")}ms`);
console.log(`CURVE CHANGES either way: ${curveMoved.length}/${inSet.length}`);
const bucket = (d) => (Math.abs(d) === 0 ? "exact" : Math.abs(d) <= 17 ? "<=1 frame (invisible)" : Math.abs(d) <= 50 ? "<=50ms (marginal)" : "VISIBLE");
const buckets = {};
for (const r of timed) (buckets[bucket(r.ladderDelta)] ??= []).push(r);
console.log("\nLADDER DELTA, bucketed by what an eye can see (60Hz frame = 16.7ms)");
for (const k of ["exact", "<=1 frame (invisible)", "<=50ms (marginal)", "VISIBLE"])
  console.log(`  ${k.padEnd(24)} ${String((buckets[k] ?? []).length).padStart(2)}/${timed.length}`);
for (const r of buckets["VISIBLE"] ?? []) console.log(`     ! ${r.key.padEnd(52)} ${r.verb.padEnd(9)} ${r.shipped} -> ${RUNGS[r.rungName]} (${r.ladderDelta > 0 ? "+" : ""}${r.ladderDelta})`);

const byVerb = {};
for (const r of inSet) (byVerb[r.verb] ??= []).push(r);
console.log("\nPER VERB");
for (const [v, rs] of Object.entries(byVerb)) {
  const t = VERBS[v];
  console.log(`  ${v.padEnd(9)} ${String(rs.length).padStart(2)} rows | ${t.curve} | strict ${t.strictMs}ms | rungs ${t.rungs.join("/")} | fill ${t.fill}`);
}

if (process.argv.includes("--resist") || process.argv.includes("--rows")) {
  console.log("\nROWS THAT RESIST");
  for (const r of resist) console.log(`  ${r.key.padEnd(56)} ${r.note}`);
  console.log("\nTHE CLOSED-SET TEST");
  for (const r of dusk) console.log(`  ${r.key.padEnd(56)} ${r.note} (shipped ${r.shipped}ms, ${r.curveShipped})`);
}
if (process.argv.includes("--rows")) {
  console.log("\nEVERY IN-SET ROW: key | verb | shipped -> strict / rung(ladder) | curve shipped -> verb curve");
  for (const r of inSet)
    console.log(
      `  ${r.key.padEnd(56)} ${r.verb.padEnd(9)} ${String(r.shipped ?? "—").padStart(5)} -> ${String(VERBS[r.verb].strictMs).padStart(4)} / ${String(RUNGS[r.rungName] ?? "—").padStart(4)}(${r.rungName ?? "—"})  ${r.curveShipped} -> ${r.curveVerb}`,
    );
}
