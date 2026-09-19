import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const DIR =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/readings";
const rows = [];
for (const f of readdirSync(DIR).filter((f) => f.startsWith("pi-proto-"))) {
  const head = f.replace("pi-proto-", "pi-head-");
  let a, b;
  try {
    a = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
    b = JSON.parse(readFileSync(`${DIR}/${head}`, "utf8"));
  } catch {
    continue;
  }
  const B = new Map(b.rects.map((r) => [r.k, r]));
  let max = 0;
  let moved = 0;
  let worst = null;
  for (const r of a.rects) {
    const o = B.get(r.k);
    if (!o) continue;
    const d = Math.max(
      Math.abs(r.x - o.x),
      Math.abs(r.y - o.y),
      Math.abs(r.w - o.w),
      Math.abs(r.h - o.h),
    );
    if (d > 0.005) moved += 1;
    if (d > max) {
      max = d;
      worst = r.k;
    }
  }
  rows.push({
    surface: `${a.engine} ${a.route}`,
    compared: Math.min(a.n, b.n),
    protoN: a.n,
    headN: b.n,
    moved,
    maxDelta: +max.toFixed(2),
    worst,
  });
}
writeFileSync(`${DIR}/pi-summary.json`, JSON.stringify(rows, null, 2));
for (const r of rows)
  console.log(
    `π  ${r.surface.padEnd(22)} compared ${String(r.compared).padStart(4)}  moved ${r.moved}  maxΔ ${r.maxDelta}  ${r.moved ? r.worst : ""}`,
  );
