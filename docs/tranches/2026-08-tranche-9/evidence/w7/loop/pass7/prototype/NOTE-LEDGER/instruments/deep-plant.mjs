import { readFileSync } from "node:fs";
import { join } from "node:path";
const fe = process.argv[2];
const { reserveLaw } = await import(join(fe, "scripts/shape/reserve-law.mjs"));
const GB = join(fe, "src/games/shared/GameBoard.vue");
const t = readFileSync(GB, "utf8");
const plants = {
  "deep from GameBoard": t.replace(/<style scoped>\n/, "<style scoped>\n.board-margin :deep(.margin-note) { min-height: 0; }\n"),
  "deep !important from GameBoard": t.replace(/<style scoped>\n/, "<style scoped>\n:deep(.margin-note) { min-height: 0 !important; }\n"),
};
for (const [k, planted] of Object.entries(plants)) {
  if (planted === t) { console.log(k, "ANCHOR MISSING"); continue; }
  const r = reserveLaw(fe, { read: (f) => (f === GB ? planted : readFileSync(f, "utf8")) }).fails;
  console.log(`${k}: ${r.length ? "RED " + r[0].split("\n")[0] : "GREEN (HOLE)"}`);
}
