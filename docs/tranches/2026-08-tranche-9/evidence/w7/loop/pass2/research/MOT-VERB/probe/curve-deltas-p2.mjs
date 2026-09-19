/**
 * THE CURVE SUBSTITUTIONS, RE-DERIVED AND WIDENED (T9-W7 pass 2, MOT-VERB research).
 * Pass 1's critic banked nine pairs; the sweep makes fourteen. The five added here are
 * substitutions no one costed: the twinkle star's ARRIVAL opacity (ease-out → an exit
 * curve), the deck-leave and player-row-close (glass → lift), the toggle's outgoing fade
 * (standard → lift) and the progress trace's dashoffset (UA ease → writeIn).
 * Newton-solved bezier, 1001 samples; max |Δprogress| and ΔAUC over the run.
 */
const bez = (x1, y1, x2, y2) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 24; i++) {
      const e = X(t) - x;
      if (Math.abs(e) < 1e-7) break;
      const d = dX(t);
      if (Math.abs(d) < 1e-7) break;
      t -= e / d;
    }
    return Y(t);
  };
};
const C = {
  accelIn: [0.55, 0.055, 0.675, 0.19], lift: [0.32, 0, 0.67, 0],
  glass: [0.32, 0.72, 0, 1], standard: [0.4, 0, 0.2, 1],
  anticipatePop: [0.68, -0.55, 0.265, 1.55], drawOn: [0.33, 1, 0.68, 1],
  writeIn: [0.22, 1, 0.36, 1], ghostDraw: [0.215, 0.61, 0.355, 1],
  easeOut: [0, 0, 0.58, 1], easeIn: [0.42, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1],
  noteWrite: [0.22, 1, 0.36, 1],
};
const f = Object.fromEntries(Object.entries(C).map(([k, v]) => [k, bez(...v)]));
const pairs = [
  ["easeOut", "lift", "NEW · twinkle star ARRIVAL opacity, DarkModeToggle:883"],
  ["anticipatePop", "lift", "twinkle star ARRIVAL scale, DarkModeToggle:882"],
  ["standard", "lift", "NEW · toggle outgoing icon fade, DarkModeToggle:774"],
  ["glass", "lift", "NEW · deck leave App.vue:1149 + player-row-close GCP:1746"],
  ["accelIn", "lift", "laminate lift-away + toggle wring-down"],
  ["easeIn", "lift", "twinkle star tuck-out, DarkModeToggle:873"],
  ["ease", "glass", "solve-success stroke+shadow, sharePop, eraserScrub, CrayonHeart, trace opacity"],
  ["standard", "glass", "AttributionCard x4, GameCard, gallery pip, guard ribbon, toggle rise"],
  ["easeOut", "glass", "DrawerTab tongue, marks-fade-in x2"],
  ["drawOn", "writeIn", "controls fade-in, both player-name write-ins"],
  ["ghostDraw", "writeIn", "focus ghost draw-on x2"],
  ["ease", "writeIn", "NEW · progress trace stroke-dashoffset, HandDrawnGrid:588"],
  ["noteWrite", "writeIn", "logo caret, margin note, vignette (rename only)"],
];
for (const [a, b, where] of pairs) {
  let max = 0, at = 0, auc = 0;
  for (let i = 0; i <= 1000; i++) {
    const x = i / 1000;
    const d = f[b](x) - f[a](x);
    auc += d / 1001;
    if (Math.abs(d) > Math.abs(max)) { max = d; at = x; }
  }
  console.log(`${a.padEnd(15)}->${b.padEnd(9)} max|dProgress| ${max.toFixed(4).padStart(8)} at t=${at.toFixed(2)}  dAUC ${auc.toFixed(4).padStart(8)}   ${where}`);
}
// The midpoint reading each curve gives, which is what a single frame shows.
console.log("\nprogress at t=0.5 (what one mid-gesture frame paints)");
for (const k of Object.keys(C)) console.log(`  ${k.padEnd(15)} ${f[k](0.5).toFixed(4)}`);
