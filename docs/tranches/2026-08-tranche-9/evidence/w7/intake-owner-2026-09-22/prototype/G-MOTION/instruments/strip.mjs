// node strip.mjs <file.jsonl>... — drop per-frame series (any array longer than 40) in place, keep the summaries
import { readFileSync, writeFileSync } from "node:fs";
const strip = (o) => {
  if (Array.isArray(o)) return o.length > 40 ? `[${o.length} samples, not banked]` : o.map(strip);
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).filter(([k]) => k !== "paintedSeries").map(([k, v]) => [k, strip(v)]));
  return o;
};
for (const f of process.argv.slice(2)) {
  const out = readFileSync(f, "utf8").trim().split("\n").filter((l) => l.startsWith("{")).map((l) => JSON.stringify(strip(JSON.parse(l))));
  writeFileSync(f, out.join("\n") + "\n");
  console.log(f.split("/").pop(), out.length, "rows", readFileSync(f).length, "B");
}
