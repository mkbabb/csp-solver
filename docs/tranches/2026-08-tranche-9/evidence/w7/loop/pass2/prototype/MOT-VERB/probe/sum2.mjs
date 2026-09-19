import { readFileSync } from "node:fs";
const R = JSON.parse(readFileSync("/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/readings/p2b-readings.json", "utf8"));
for (const row of R) {
  if (row.section === "well") {
    const L = row.data.live;
    console.log(`\n== ${row.label}/${row.engine} WELL  scope=${row.data.scope}`);
    for (const [k, v] of Object.entries(L))
      console.log(`   ${k}: row ${v.row.duration}@${v.row.delay} (${v.row.name}) · name ${v.playerName.duration}@${v.playerName.delay} (${v.playerName.name})`);
    const a = L["is-arriving"], r = L["is-returning"];
    console.log(`   arriving − returning: row ${a.row.duration - r.row.duration}ms · name duration ${a.playerName.duration - r.playerName.duration}ms · name LANDS ${(a.playerName.duration + a.playerName.delay) - (r.playerName.duration + r.playerName.delay)}ms later`);
  } else if (row.section === "rubout" && !row.reduce) {
    const d = row.data;
    console.log(`== ${row.label}/${row.engine} RUBOUT dark=${row.dark}: ${JSON.stringify(d.shorthand)} frames ${d.frameCount} boxes ${JSON.stringify(d.boxes)}`);
    console.log(`   first ${JSON.stringify(d.first)}\n   mid   ${JSON.stringify(d.mid)}\n   last  ${JSON.stringify(d.last)}`);
  } else if (row.section === "rubout" && row.reduce) {
    console.log(`== ${row.label}/${row.engine} RUBOUT reduce dark=${row.dark}: ${JSON.stringify(row.data.shorthand)} first ${JSON.stringify(row.data.first)}`);
  }
}
