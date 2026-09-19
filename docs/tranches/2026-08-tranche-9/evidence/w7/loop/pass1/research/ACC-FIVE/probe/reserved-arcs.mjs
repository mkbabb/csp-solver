/**
 * reserved-arcs.mjs — §8 of the charter: the arcs a per-player palette must CLEAR under
 * this family, stated as degrees, not as advice. This lane does not design that palette
 * (PLR-* owns it); it hands over the hole it has to fit in.
 *
 * An arc is reserved when a NON-player job owns a hue there and the family's own kin rule
 * (KIN_DEG 5°, R2's re-derivation of the house's loosest shipped lock) would read a player
 * ink at that hue as that job. The union is taken over BOTH themes, because a player keeps
 * one identity across the theme switch and the anchors move when the paper does.
 *
 * The solver rainbow is listed separately: R6 law 21 already forbids assigning a player a
 * rainbow stop, so its arcs are reserved by a standing ruling rather than by this family.
 */
import { readFileSync, writeFileSync } from "node:fs";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const G = JSON.parse(readFileSync(`${HERE}/readings/grounds.json`, "utf8")).chromium;
const KIN = 5;

// the family's OWN hues, after the cure (the two it mints are the searched values)
const CURED = {
  light: { "--color-blue-ink (pen)": 251.2, "--color-progress-ink (trace)": 83.6 },
  dark: { "--color-blue-ink (pen)": 249.4, "--color-progress-ink (trace)": 95.8 },
};

const jobs = {
  danger: ["--color-crayon-rose", "--color-red-ink"],
  "difficulty medium": ["--color-crayon-orange", "--color-orange-ink"],
  "celebration + progress": ["--color-crayon-gold", "--color-gold-ink"],
  "difficulty easy": ["--color-crayon-green", "--color-green-ink"],
  "selection + focus + authorship (yours)": ["--color-crayon-blue", "--color-focus-sketch"],
};

const rows = [];
for (const [job, toks] of Object.entries(jobs)) {
  const hues = [];
  for (const th of ["light", "dark"]) {
    for (const t of toks) if (G[th][t]?.h != null) hues.push({ th, t, h: G[th][t].h });
    for (const [k, h] of Object.entries(CURED[th]))
      if (
        (job.includes("authorship") && k.includes("blue-ink")) ||
        (job.includes("progress") && k.includes("progress-ink"))
      )
        hues.push({ th, t: k, h });
  }
  const lo = Math.min(...hues.map((x) => x.h)) - KIN;
  const hi = Math.max(...hues.map((x) => x.h)) + KIN;
  rows.push({
    job,
    hues: hues.map((x) => `${x.t} ${x.th} ${x.h}`),
    reservedArc: [+lo.toFixed(1), +hi.toFixed(1)],
    widthDeg: +(hi - lo).toFixed(1),
  });
}

// the rainbow's hues come from this lane's own re-run of R2's kinship rows (the census
// `grounds.json` carries only the grounds and anchors this family prices against).
const rainbow = [];
for (const th of ["light", "dark"]) {
  const k = JSON.parse(
    readFileSync(`${HERE}/readings/control/kinship-chromium-${th}.json`, "utf8"),
  );
  for (const r of k.rows)
    if (r.token.startsWith("--color-solver-ink-")) rainbow.push({ th, token: r.token, h: r.h });
}

const reservedDeg = rows.reduce((a, r) => a + r.widthDeg, 0);
const out = {
  KIN_DEG: KIN,
  rows,
  totalReservedDeg: +reservedDeg.toFixed(1),
  sharePctOfWheel: +((100 * reservedDeg) / 360).toFixed(1),
  freeDeg: +(360 - reservedDeg).toFixed(1),
  rainbowStops: rainbow,
  standingRuling:
    "R6 law 21 — no player is ever assigned wax or a rainbow stop; the three ink families never compete",
  peerToday: {
    formula: "oklch(var(--peer-ink-l) 0.11 (i*137.5deg))  — playerIdentity.ts:69",
    chroma: 0.11,
    meanCrayonChroma: 0.166,
    note: "peers run 34% under house saturation; the walk lands 3.8-46.7 deg from the nearest anchor over 12 indices (R2 §7)",
  },
};
writeFileSync(`${HERE}/readings/reserved-arcs.json`, JSON.stringify(out, null, 2));
for (const r of out.rows)
  console.log(r.job.padEnd(40), `${r.reservedArc[0]}° - ${r.reservedArc[1]}°`.padEnd(18), `${r.widthDeg}°`);
console.log("reserved total", out.totalReservedDeg, "deg =", out.sharePctOfWheel, "% of the wheel; free", out.freeDeg, "deg");
