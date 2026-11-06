// crit-NOTE-ERASE pass 10: the registration row (check-theme-tokens.mjs) against the six + the critic's new siblings, a fresh copy per plant.
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
const C = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-NOTE-ERASE/plants";
const SRC = process.argv[2]; const TAG = process.argv[3] ?? "t";
const JS = `{ name: "--motion-whisper", syntax: "<time>", inherits: false, initialValue: "0ms" }`;
const add = (f, s) => (d) => fs.appendFileSync(path.join(d, f), s);
const P = [
  ["clean", () => {}],
  ["SIX-1 .call", add("src/main.ts", `\nCSS.registerProperty.call(CSS, ${JS});\n`)],
  ["SIX-2 ?.()", add("src/main.ts", `\nCSS.registerProperty?.(${JS});\n`)],
  ["SIX-3 Reflect.apply", add("src/main.ts", `\nReflect.apply(CSS.registerProperty, CSS, [${JS}]);\n`)],
  ["SIX-4 (0, f)()", add("src/main.ts", `\n(0, CSS.registerProperty)(${JS});\n`)],
  ["SIX-5 const-keyed CSS[k]()", add("src/main.ts", `\nconst k9 = "registerProperty";\nCSS[k9](${JS});\n`)],
  ["SIX-6 let .bind alias", add("src/main.ts", `\nlet r9: (d: PropertyDefinition) => void;\nr9 = CSS.registerProperty.bind(CSS);\nr9(${JS});\n`)],
  ["CRIT-A Reflect.get(CSS, joined key).call", add("src/main.ts", `\nconst rk = ["register", "Property"].join("");\n(Reflect.get(CSS, rk) as (d: PropertyDefinition) => void).call(CSS, ${JS});\n`)],
  ["CRIT-B destructured computed key", add("src/main.ts", `\nconst { ["register" + "Property"]: rp10 } = CSS as unknown as Record<string, (d: PropertyDefinition) => void>;\nrp10.call(CSS, ${JS});\n`)],
  ["CRIT-C plain call in a JS module outside src/", (d) => { fs.mkdirSync(path.join(d, "vendor"), { recursive: true }); fs.writeFileSync(path.join(d, "vendor/crit-reg.js"), `CSS.registerProperty(${JS});\n`); add("src/main.ts", `\nimport "../vendor/crit-reg.js";\n`)(d); }],
  ["CRIT-D globalThis.CSS.registerProperty", add("src/main.ts", `\nglobalThis.CSS.registerProperty(${JS});\n`)],
  ["CRIT-E window['CSS']['registerProperty']", add("src/main.ts", `\n(window as any)["CSS"]["registerProperty"](${JS});\n`)],
  ["CRIT-F Object.getOwnPropertyDescriptor(CSS, k).value", add("src/main.ts", `\nconst gk = "register" + "Property";\nObject.getOwnPropertyDescriptor(CSS, gk)!.value.call(CSS, ${JS});\n`)],
  ["NEG typeof probe (must stay 0)", add("src/main.ts", `\nif (typeof CSS.registerProperty !== "function") console.info("no");\n`)],
];
const ONLY = process.env.PLANT_ONLY ? new RegExp(process.env.PLANT_ONLY) : null;
const out = [];
for (const [name, plant] of P) {
  if (ONLY && !ONLY.test(name)) continue;
  const d = `${C}/plant-${TAG}`;
  if (fs.existsSync(d)) fs.renameSync(d, `${C}/trash/plant-${TAG}-${Date.now()}`);
  fs.cpSync(SRC, d, { recursive: true, filter: (s) => !/node_modules|\/dist$|\/\.git$/.test(s) });
  plant(d);
  const r = spawnSync("node", ["scripts/check-theme-tokens.mjs"], { cwd: d, encoding: "utf8" });
  const lines = (r.stdout + r.stderr).split("\n");
  const row = lines.find((l) => /^ladder registration:/.test(l)) ?? "(no registration line) " + lines.slice(-3).join(" / ");
  out.push(`exit ${r.status} | ${name} | ${row}`);
}
console.log(out.join("\n"));
