// NOTE-ERASE pass-8 critic: plants against the registration row (check-theme-tokens.mjs), each on a fresh copy.
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
const C = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-erase8";
const SRC = process.argv[2] ?? `${C}/tree/web/frontend`; const TAG = process.argv[3] ?? "tree";
const REG = 'syntax: "<time>"; inherits: false; initial-value: 0ms;';
const JS = (name) => `{ name: ${name}, syntax: "<time>", inherits: false, initialValue: "0ms" }`;
const add = (f, s) => (d) => fs.appendFileSync(path.join(d, f), s);
const P = [
  ["clean", () => {}],
  ["p7 .pcss inherits:false imported from main.ts", (d) => { fs.writeFileSync(path.join(d, "src/assets/crit.pcss"), `@property --motion-whisper { ${REG} }\n`); add("src/main.ts", '\nimport "./assets/crit.pcss";\n')(d); }],
  ["p7 split name {name: W}", add("src/main.ts", `\nconst W = "--motion-" + "whisper";\nCSS.registerProperty(${JS("W")});\n`)],
  ["p7 joined name [..].join('')", add("src/main.ts", `\nCSS.registerProperty(${JS('["--mo","tion-whisper"].join("")')});\n`)],
  ["p7 uppercase @PROPERTY", (d) => { fs.writeFileSync(path.join(d, "src/assets/crit.css"), `@PROPERTY --motion-whisper { ${REG} }\n`); add("src/main.ts", '\nimport "./assets/crit.css";\n')(d); }],
  ["p7 escaped tail --motion-whisp\\65r", (d) => { fs.writeFileSync(path.join(d, "src/assets/crit.css"), `@property --motion-whisp\\65r { ${REG} }\n`); add("src/main.ts", '\nimport "./assets/crit.css";\n')(d); }],
  ["NEW escaped head --\\6d otion-whisper", (d) => { fs.writeFileSync(path.join(d, "src/assets/crit.css"), `@property --\\6d otion-whisper { ${REG} }\n`); add("src/main.ts", '\nimport "./assets/crit.css";\n')(d); }],
  ["NEW registerProperty(def) non-literal arg", add("src/main.ts", `\nconst def = ${JS('"--motion-whisper"')};\nCSS.registerProperty(def);\n`)],
  ["NEW CSS['registerProperty'](...) bracket call", add("src/main.ts", `\nCSS["registerProperty"](${JS('"--motion-whisper"')});\n`)],
  ["NEW alias const r = CSS.registerProperty.bind(CSS); r(...)", add("src/main.ts", `\nconst reg = CSS.registerProperty.bind(CSS);\nreg(${JS('"--motion-whisper"')});\n`)],
  ["NEW concatenated @prop+erty text in a style element", add("src/main.ts", `\ndocument.head.append(Object.assign(document.createElement("style"), { textContent: "@prop" + "erty --motion-whisper { ${REG} }" }));\n`)],
  ["NEW <style lang=postcss> in a .vue", (d) => { const f = path.join(d, "src/pencil/chrome/MarginNote.vue"); fs.appendFileSync(f, `\n<style lang="postcss">\n@property --motion-whisper { ${REG} }\n</style>\n`); }],
  ["NEW sheet OUTSIDE src (../extra/x.css) imported from main.ts", (d) => { fs.mkdirSync(path.join(d, "extra"), { recursive: true }); fs.writeFileSync(path.join(d, "extra/x.css"), `@property --motion-whisper { ${REG} }\n`); add("src/main.ts", '\nimport "../extra/x.css";\n')(d); }],
  ["NEW @property inside @layer in index.css (depth)", add("src/assets/index.css", `\n@layer crit { @property --motion-note { syntax: "<time>"; inherits: true; initial-value: 0ms; } }\n`)],
];
const out = [];
for (const [name, plant] of P) {
  const d = `${C}/plant-${TAG}`;
  if (fs.existsSync(d)) fs.renameSync(d, `${C}/trash-critE8/plant-${TAG}-${Date.now()}`);
  fs.mkdirSync(`${C}/trash-critE8`, { recursive: true });
  fs.cpSync(SRC, d, { recursive: true, filter: (s) => !/node_modules|\/dist$/.test(s) });
  plant(d);
  const r = spawnSync("node", ["scripts/check-theme-tokens.mjs"], { cwd: d, encoding: "utf8" });
  const first = (r.stdout + r.stderr).split("\n").find((l) => /registers|registered|inherits|FAIL|breach|red|Error/i.test(l)) ?? "";
  out.push(`${r.status === 0 ? "GREEN(0)" : `RED(${r.status})`} | ${name} | ${first.trim().slice(0, 160)}`);
}
console.log(out.join("\n"));
