/**
 * census-delta.mjs — the pixel census, control arm vs overlay arm, in the ONE number the
 * census exists to report: the share of chromatic content that sits OUTSIDE the house's
 * warm band, at rest / focused / mid-board, both themes, both engines.
 *
 * THE BAND IS THE CENSUS'S OWN, unchanged: OKLCH hue 40–115°, chroma floor 0.012 (R2 §1).
 * Stated once and loudly, because it decides how this family's result must be read:
 * the warm band contains crayon-orange (68.7°) and crayon-gold (83.7°) and NOTHING ELSE
 * the house owns — crayon-blue 251.4°, crayon-green 147.0° and crayon-rose 14.2° are all
 * off-band. So "off-family" in this instrument means "not warm", not "not kin", and a
 * blue that becomes kin does not move this number by one pixel. Only the violet does.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const arms = ["control", "overlay"];
const out = { band: "OKLCH 40-115 deg, C >= 0.012", rows: [] };

for (const engine of ["chromium", "webkit"]) {
  for (const scheme of ["light", "dark"]) {
    const read = (arm) => {
      const f = `${HERE}/readings/${arm}/census-${engine}-${scheme}.json`;
      return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
    };
    const c = read("control");
    const o = read("overlay");
    if (!c || !o) continue;
    for (const state of ["rest", "focused", "mid"]) {
      const a = c.pixels[state];
      const b = o.pixels[state];
      if (!a || !b) continue;
      const share = (p) => (p.inFamily ?? p.familyShare ?? null);
      out.rows.push({
        engine,
        scheme,
        state,
        controlChromatic: a.chromatic ?? a.chromaticPixels ?? null,
        overlayChromatic: b.chromatic ?? b.chromaticPixels ?? null,
        controlOffFamilyPct: a.offFamilyPct ?? (share(a) != null ? +(100 - share(a)).toFixed(2) : null),
        overlayOffFamilyPct: b.offFamilyPct ?? (share(b) != null ? +(100 - share(b)).toFixed(2) : null),
        rawControl: a,
        rawOverlay: b,
      });
    }
  }
}
writeFileSync(`${HERE}/readings/census-delta.json`, JSON.stringify(out, null, 2));
// print whatever shape the census actually used, once, so the keys are never guessed at
if (out.rows.length) console.log("KEYS:", Object.keys(out.rows[0].rawControl).join(", "));
for (const r of out.rows)
  console.log(
    `${r.engine.padEnd(9)} ${r.scheme.padEnd(5)} ${r.state.padEnd(7)}`,
    "control", JSON.stringify(r.rawControl).slice(0, 220),
  );
