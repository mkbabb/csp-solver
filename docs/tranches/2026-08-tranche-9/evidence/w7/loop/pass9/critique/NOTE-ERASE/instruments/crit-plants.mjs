// pass-9 critic of NOTE-ERASE: the registration row (check-theme-tokens.mjs) against shape siblings, a fresh copy per plant.
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
const C = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-ERASE/plants";
const SRC = process.argv[2]; const TAG = process.argv[3] ?? "t";
const REG = "syntax: '<time>'; inherits: false; initial-value: 0ms;";
const JS = (name) => `{ name: ${name}, syntax: "<time>", inherits: false, initialValue: "0ms" }`;
const add = (f, s) => (d) => fs.appendFileSync(path.join(d, f), s);
const css = (body) => (d) => { fs.writeFileSync(path.join(d, "src/assets/crit.css"), body); add("src/main.ts", '\nimport "./assets/crit.css";\n')(d); };
const P = [
  ["clean", () => {}],
  ["RE-DERIVE lane: escaped head --\\6d otion-whisper", css(`@property --\\6d otion-whisper { ${REG} }\n`)],
  ["RE-DERIVE lane: registerProperty(def)", add("src/main.ts", `\nconst def = ${JS('"--motion-whisper"')};\nCSS.registerProperty(def);\n`)],
  ["CRIT .call: CSS.registerProperty.call(CSS, {...})", add("src/main.ts", `\nCSS.registerProperty.call(CSS, ${JS('"--motion-whisper"')});\n`)],
  ["CRIT optional call: CSS.registerProperty?.({...})", add("src/main.ts", `\nCSS.registerProperty?.(${JS('"--motion-whisper"')});\n`)],
  ["CRIT Reflect.apply(CSS.registerProperty, CSS, [{...}])", add("src/main.ts", `\nReflect.apply(CSS.registerProperty, CSS, [${JS('"--motion-whisper"')}]);\n`)],
  ["CRIT comma call (0, CSS.registerProperty)({...})", add("src/main.ts", `\n(0, CSS.registerProperty)(${JS('"--motion-whisper"')});\n`)],
  ["CRIT computed key const k = 'registerProperty'; CSS[k]({...})", add("src/main.ts", `\nconst k9 = "registerProperty";\nCSS[k9](${JS('"--motion-whisper"')});\n`)],
  ["CRIT assigned alias let r; r = CSS.registerProperty.bind(CSS); r({...})", add("src/main.ts", `\nlet r9: (d: PropertyDefinition) => void;\nr9 = CSS.registerProperty.bind(CSS);\nr9(${JS('"--motion-whisper"')});\n`)],
  ["CRIT CSS comment between at-keyword and name @property/**/--motion-whisper", css(`@property/**/--motion-whisper { ${REG} }\n`)],
  ["CRIT escaped hyphen in name --motion\\-whisper", css(`@property --motion\\-whisper { ${REG} }\n`)],
  ["CRIT @import chain to a sheet outside src", (d) => { fs.mkdirSync(path.join(d, "extra"), { recursive: true }); fs.writeFileSync(path.join(d, "extra/y.css"), `@property --motion-whisper { ${REG} }\n`); css(`@import "../../extra/y.css";\n`)(d); }],
  ["CRIT replaceSync with a template literal", add("src/main.ts", "\nconst s8 = new CSSStyleSheet();\ns8.replaceSync(`@property --motion-whisper { " + REG + " }`);\ndocument.adoptedStyleSheets = [...document.adoptedStyleSheets, s8];\n")],
];
const ONLY = process.env.PLANT_ONLY ? new RegExp(process.env.PLANT_ONLY) : null;
const out = [];
for (const [name, plant] of P) {
  if (ONLY && !ONLY.test(name)) continue;
  const d = `${C}/plant-${TAG}`;
  if (fs.existsSync(d)) fs.renameSync(d, `${C}/trash/plant-${TAG}-${Date.now()}`);
  fs.cpSync(SRC, d, { recursive: true, filter: (s) => !/node_modules|\/dist$/.test(s) });
  plant(d);
  if (process.env.PLANT_KEEP) fs.cpSync(d, `${C}/kept-${TAG}-${out.length}`, { recursive: true });
  const r = spawnSync("node", ["scripts/check-theme-tokens.mjs"], { cwd: d, encoding: "utf8" });
  const lines = (r.stdout + r.stderr).split("\n");
  const row = lines.find((l) => /^ladder registration:/.test(l)) ?? "(no registration line)";
  out.push(`exit ${r.status} | ${name} | ${row}`);
}
console.log(out.join("\n"));
