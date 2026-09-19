#!/usr/bin/env node
/**
 * P3 — WHICH CURVE IS LIFT'S?  `--ease-fadeOut` vs `--ease-accelIn`, measured.
 *
 * The two declared twins ride two curves (`scene.css:617/:629` fadeOut, `App.vue:1142`
 * glassGlide) and the laminate's lift-away rides a third (`--ease-accelIn`,
 * `AnswerKeyLaminate.vue:224`, the "erase-family asymmetry"). LIFT can own exactly one.
 * This samples each house curve's progress so the choice is a reading, not a preference:
 * for a LEAVE, what matters is HOW LONG the thing stays legible — the t at which opacity
 * has fallen to 0.5, and the area under the curve (the mean visible fraction over the window).
 *
 * Run: node p3-curve-shape.mjs
 */
const CURVES = {
  "--ease-standard": [0.4, 0, 0.2, 1],
  "--ease-noteWrite": [0.22, 1, 0.36, 1],
  "--ease-springPop": [0.34, 1.56, 0.64, 1],
  "--ease-accelIn": [0.55, 0.055, 0.675, 0.19],
  "--ease-fadeOut": [0.32, 0, 0.67, 0],
  "--ease-ghostDraw": [0.215, 0.61, 0.355, 1],
  "--ease-drawOn": [0.33, 1, 0.68, 1],
  "--ease-loaderScrub": [0.645, 0.045, 0.355, 1],
  "--ease-anticipatePop": [0.68, -0.55, 0.265, 1.55],
  "--ease-glassGlide": [0.32, 0.72, 0, 1],
  "(UA default `ease`)": [0.25, 0.1, 0.25, 1],
  "(UA `ease-out`)": [0, 0, 0.58, 1],
  "(UA `ease-in`)": [0.42, 0, 1, 1],
  "(UA `linear`)": [0, 0, 1, 1],
};
const bez = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
function yAt(c, x) {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (bez(c[0], c[2], m) < x) lo = m;
    else hi = m;
  }
  return bez(c[1], c[3], (lo + hi) / 2);
}
console.log("curve".padEnd(22), "p@25%  p@50%  p@75%   AUC   t(p=0.5)  shape");
for (const [name, c] of Object.entries(CURVES)) {
  const p = (x) => yAt(c, x);
  let auc = 0;
  for (let i = 0; i < 1000; i++) auc += p((i + 0.5) / 1000) / 1000;
  let t50 = 0;
  for (let i = 0; i <= 1000; i++)
    if (p(i / 1000) >= 0.5) {
      t50 = i / 1000;
      break;
    }
  const shape = auc > 0.55 ? "front-loaded (moves early)" : auc < 0.45 ? "back-loaded (holds, then goes)" : "even";
  console.log(
    name.padEnd(22),
    p(0.25).toFixed(3).padStart(5),
    p(0.5).toFixed(3).padStart(6),
    p(0.75).toFixed(3).padStart(6),
    auc.toFixed(3).padStart(6),
    t50.toFixed(3).padStart(8),
    " " + shape,
  );
}
console.log(`
READING FOR LIFT. A leave animates opacity 1 -> 0, so "progress" is how much of the fade is
SPENT. AUC is the mean progress over the window; the thing's mean VISIBILITY is 1 - AUC.
A high t(p=0.5) means the thing stays legible for most of the window and then goes.`);
