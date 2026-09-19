import { readFileSync } from "node:fs";
const R = JSON.parse(
  readFileSync(
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/readings/p2-readings.json",
    "utf8",
  ),
);
const b = (x) => (x ? `${x.duration}@${x.delay}` : "—");
for (const x of R) {
  console.log(`\n== ${x.label} / ${x.engine}`);
  if (x.beats)
    console.log(
      `  beats desk : out ${b(x.beats.out)} rise ${b(x.beats.rise)} wring ${b(x.beats.wring)} bloom ${b(x.beats.bloom)} tuck ${b(x.beats.tuck)} star1 ${b(x.beats.star1)} star2 ${b(x.beats.star2)} star3 ${b(x.beats.star3)} (icons ${x.beats.icons})`,
    );
  if (x.beatsPhone)
    console.log(`  beats phone: out ${b(x.beatsPhone.out)} rise ${b(x.beatsPhone.rise)} wring ${b(x.beatsPhone.wring)} star1 ${b(x.beatsPhone.star1)}`);
  if (x.beatsDark) console.log(`  beats dark : out ${b(x.beatsDark.out)} rise ${b(x.beatsDark.rise)} wring ${b(x.beatsDark.wring)} star1 ${b(x.beatsDark.star1)}`);
  if (x.well) {
    console.log(`  well scope ${x.well.scope} · rules ${x.well.rules.length}`);
    for (const [k, v] of Object.entries(x.well.live))
      console.log(`    ${k}: row ${v.row.name} ${v.row.duration}@${v.row.delay} · name ${v.playerName.name} ${v.playerName.duration}@${v.playerName.delay}`);
  }
  if (x.twins)
    console.log(
      `  twins: deck ${x.twins.deck ? x.twins.deck.duration + "ms " + x.twins.deck.timing : "—"} | chrome ${x.twins.chrome ? x.twins.chrome.duration + "ms " + x.twins.chrome.timing : "—"} | ratio ${x.twins.ratio}`,
    );
  if (x.prm) console.log(`  prm rungs ${JSON.stringify(x.prm.rungs)}\n      sites ${JSON.stringify(x.prm.sites)}\n      fallbacks ${JSON.stringify(x.prm.fallbacks)}`);
  if (x.rubout) console.log(`  rubout ${JSON.stringify(x.rubout.shorthand ?? x.rubout)} frames ${x.rubout.frameCount} boxes ${JSON.stringify(x.rubout.boxes)} first ${JSON.stringify(x.rubout.first)} last ${JSON.stringify(x.rubout.last)}`);
  if (x.rubOutDark) console.log(`  rubout dark ${JSON.stringify(x.rubOutDark.shorthand ?? x.rubOutDark)} boxes ${JSON.stringify(x.rubOutDark.boxes)}`);
  if (x.filters) console.log(`  filters ${x.filters.count}: ${x.filters.ids.join(" ")}`);
  if (x.filtersPhone) console.log(`  filters phone ${x.filtersPhone.count}`);
  if (x.frames) console.log(`  frame trace: ${x.frames.count} frames >33ms, worst ${x.frames.worst} — ${JSON.stringify(x.frames.longFrames)}`);
  if (x.dusk) console.log(`  dusk ${x.dusk.duskMs} seq ${JSON.stringify(x.dusk.sequence)} long ${JSON.stringify(x.dusk.longFrames)}`);
}
