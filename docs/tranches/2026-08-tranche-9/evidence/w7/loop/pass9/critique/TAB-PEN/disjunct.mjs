// TAB-PEN pass-9 critic: the DISJUNCT-sabotage battery (LAWS P8 §F) on the bank's final gate. Each row
// deletes ONE disjunct of a guard/box predicate in a copy of the gate (beside copies of its two imports)
// and runs `--self-test --root <tree>`; a disjunct is pinned only if the copy exits non-zero. A row whose
// edit does not apply exactly once is FAILED (a void plant), never a bite. No delete of any file.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const [D, FE] = process.argv.slice(2);
const SRC = fs.readFileSync(path.join(FE, "scripts/check-favicon.mjs"), "utf8");
const rows = [
  ["d.arm path disjunct", "if (d !== arm.d || sw !== arm.width)", "if (sw !== arm.width)"],
  ["d.arm width disjunct", "if (d !== arm.d || sw !== arm.width)", "if (d !== arm.d)"],
  ["d.pin sha disjunct", "if (sha256(arm.d) !== ARM_PIN[arm.name] || !ARM_PIN.widths.includes(arm.width))", "if (!ARM_PIN.widths.includes(arm.width))"],
  ["d.pin width disjunct", "if (sha256(arm.d) !== ARM_PIN[arm.name] || !ARM_PIN.widths.includes(arm.width))", "if (sha256(arm.d) !== ARM_PIN[arm.name])"],
  ["e.link-icon ok disjunct", 'if (!icon.ok || icon.links[0].href !== "/icon.svg")', 'if (icon.links[0]?.href !== "/icon.svg")'],
  ["e.link-icon href disjunct", 'if (!icon.ok || icon.links[0].href !== "/icon.svg")', "if (!icon.ok)"],
  ["e.link-touch ok disjunct", 'if (!touch.ok || touch.links[0].href !== "/apple-touch-icon.png")', 'if (touch.links[0]?.href !== "/apple-touch-icon.png")'],
  ["e.link-touch href disjunct", 'if (!touch.ok || touch.links[0].href !== "/apple-touch-icon.png")', "if (!touch.ok)"],
  ["e.png-size w disjunct", "if (!img || img.w !== 180 || img.h !== 180)", "if (!img || img.h !== 180)"],
  ["e.png-size h disjunct", "if (!img || img.w !== 180 || img.h !== 180)", "if (!img || img.w !== 180)"],
  ["tie union: got disjunct", "if (got >= 0.5 || want >= 0.5) union++;", "if (want >= 0.5) union++;"],
  ["tie union: want disjunct", "if (got >= 0.5 || want >= 0.5) union++;", "if (got >= 0.5) union++;"],
  ["tie blob: |delta| threshold 0.5 -> 0.95 (the off-pixel cut)", "off[i] = Math.abs(got - want) > 0.5 ? 1 : 0;", "off[i] = Math.abs(got - want) > 0.95 ? 1 : 0;"],
  ["paper read: pixel 0 -> pixel 1 (one-pixel read moved)", "deltaE(col(img.rgba[0]), paper)", "deltaE(col(img.rgba[1]), paper)"],
  ["unmodified copy (control)", null, null],
];
const out = [];
for (const [name, from, to] of rows) {
  const dir = path.join(D, name.replace(/[^A-Za-z0-9]+/g, "_"), "scripts");
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ["icons.mjs", "shape-census.mjs"]) fs.copyFileSync(path.join(FE, "scripts", f), path.join(dir, f));
  const n = from ? SRC.split(from).length - 1 : 0;
  if (from && n !== 1) {
    out.push(`FAILED (edit matched ${n}x) | ${name}`);
    continue;
  }
  fs.writeFileSync(path.join(dir, "check-favicon.mjs"), from ? SRC.replace(from, to) : SRC);
  const r = spawnSync("node", [path.join(dir, "check-favicon.mjs"), "--root", FE, "--self-test"], { encoding: "utf8" });
  const why = (r.stdout + r.stderr).split("\n").filter((l) => /FAILED|NOT RED|went GREEN|did not red|^\s+(RED|GREEN)\s+as|EDGE.*(GREEN|RED)/.test(l)).slice(0, 4).map((l) => l.trim());
  const bite = from ? r.status !== 0 : r.status === 0;
  out.push(`${from ? (bite ? "BITE" : "HOLE") : bite ? "CTRL OK" : "CTRL BAD"} exit ${r.status} | ${name}${why.length ? `\n      ${why.join("\n      ")}` : ""}`);
}
fs.writeFileSync(path.join(D, "disjunct.txt"), `${out.join("\n")}\n`);
console.log(out.join("\n"));
