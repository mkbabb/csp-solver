// shape-plants.mjs — the SHAPE law's plant battery (T9-W7 pass 7, chair's instruments; registry-v6 §2.10,
// LAWS P6 §F). Every escape the pass-6 critics named against a re-cut source gate, planted IN MEMORY (an
// overlay: no tree file is written) on the reserve law's subject, read by BOTH the seed
// (`pass6/critique/NOTE-LEDGER/instruments/reserve-law.PROPOSED.mjs`, run on the planted SFC in a scratch
// file) and the library law (`reserve-law.mjs`). Plus the library's own self-test (colour parser, var-led
// shorthand, stems, compound keys, the string-aware strippers).
//   node shape-plants.mjs <web/frontend of a tree carrying the merged note's reserve> <scratch dir> [--seed <path>]
// Exit 0: clean GREEN, every plant RED under the library, the negative-negative GREEN, self-test passes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { reserveLaw } from "./reserve-law.mjs";
import * as SC from "./shape-census.mjs";

const fe = process.argv[2]; const scratch = process.argv[3];
const seed = process.argv.includes("--seed") ? process.argv[process.argv.indexOf("--seed") + 1] : null;
mkdirSync(scratch, { recursive: true });
const MN = join(fe, "src/pencil/chrome/MarginNote.vue"), CSS = join(fe, "src/assets/index.css"), HTML = join(fe, "index.html");
const base = readFileSync(MN, "utf8");
const seat = /(@media \(max-width: 1023\.98px\) \{[\s\S]*?\.margin-note \{\s*)min-height: inherit;/;
const tplTag = /(<p\s+ref="liveEl"\s+class="margin-note")/;
const must = (s, re) => { if (!re.test(s)) throw new Error(`plant anchor missing: ${re}`); return s; };
// name → { files: {path: text}, extra: [paths], note }
const P = {
  // the seed's five (LEDGER's critic, pass6/critique/NOTE-LEDGER.md §2.1)
  E1_shadowed: { [MN]: must(base, seat).replace(seat, "$1min-height: inherit;\n    min-height: 0;") },
  E2_second_style_block: { [MN]: base + "\n<style scoped>\n.margin-note-block > .margin-note { min-height: 0; }\n</style>\n" },
  E2b_compound_override: { [MN]: must(base, /(  min-height: 1\.3em;\n\}\n)/).replace(/(  min-height: 1\.3em;\n\}\n)/, "$1\n.margin-note-block > .margin-note {\n  min-height: 0;\n}\n") },
  E3_block_1px: { [MN]: base.replace(/(\.margin-note-block \{[^}]*?min-height: )[^;]+;/, "$11px;") },
  E4_landscape_important: { [MN]: must(base, /(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/).replace(/(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/, "$1  .margin-note-block .margin-note {\n    min-height: 0 !important;\n  }\n") },
  // the six SHAPE siblings (FACE: var-led shorthand + style=; VERB: :style objects/strings, script writes, :not() tails)
  S6_var_led_token: { [MN]: base.replace(seat, "$1min-height: var(--note-reserve);"), [CSS]: readFileSync(CSS, "utf8") + "\n:root { --note-reserve: 0px; }\n" },
  S7_template_style_attr: { [MN]: must(base, tplTag).replace(tplTag, '$1\n      style="min-height: 0"') },
  S8_style_object: { [MN]: base.replace(tplTag, "$1\n      :style=\"{ minHeight: '0px' }\"") },
  S8b_style_object_quoted_key: { [MN]: base.replace(tplTag, "$1\n      :style=\"{ 'min-height': 0 }\"") },
  S9_style_string: { [MN]: base.replace(tplTag, "$1\n      :style=\"'min-height: 0'\"") },
  S10_script_write: { [MN]: base.replace(/<script setup lang="ts">\n/, '<script setup lang="ts">\nqueueMicrotask(() => { const el = document.querySelector<HTMLElement>(".margin-note"); if (el) el.style.minHeight = "0px"; });\n') },
  S10b_setProperty_concatenated: { [MN]: base.replace(/<script setup lang="ts">\n/, '<script setup lang="ts">\nqueueMicrotask(() => document.querySelector<HTMLElement>(".margin-note")?.style.setProperty("min-" + "height", "0"));\n') },
  S10c_computed_key: { [MN]: base.replace(/<script setup lang="ts">\n/, '<script setup lang="ts">\nconst k = "minHeight" as const;\nqueueMicrotask(() => { const el = document.querySelector<HTMLElement>(".margin-note"); if (el) el.style[k] = "0"; });\n') },
  S11_not_tail: { [MN]: base.replace(/(  min-height: 1\.3em;\n\}\n)/, "$1\n.margin-note:not(.is-spent) {\n  min-height: 0;\n}\n") },
  // the estate siblings (WALK/TIN: public/ and index.html; WALK: Tailwind candidates; SIX: a comment stripper that
  // is not string-aware; TIN: .tsx)
  X_public_css: { __extra: [join(fe, "public/plant-shape.css")], [join(fe, "public/plant-shape.css")]: ".margin-note { min-height: 0; }\n" },
  X_index_html_style: { [HTML]: readFileSync(HTML, "utf8").replace("</head>", "<style>.margin-note{min-height:0}</style></head>") },
  X_tailwind_candidate: { [MN]: base.replace(tplTag, '<p\n      ref="liveEl"\n      class="margin-note min-h-0"') },
  X_string_comment_opener: { [MN]: base.replace(/(  min-height: 1\.3em;\n\}\n)/, '$1\n.margin-note-meta::before { content: "/*"; }\n.margin-note { min-height: 0; }\n.margin-note-meta::after { content: "*/"; }\n') },
  X_tsx_write: { __extra: [join(fe, "src/plant-shape.tsx")], [join(fe, "src/plant-shape.tsx")]: 'export const f = (el: HTMLElement) => { el.style.minHeight = "0"; };\n' },
};
// the negative-negative: `.margin-note` NEGATED in a sibling's compound is NOT the subject — must stay GREEN
const NN = { NN_not_decoy: { [MN]: base.replace(/(  min-height: 1\.3em;\n\}\n)/, "$1\n.margin-note-previous:not(.margin-note) {\n  min-height: 0;\n}\n") } };

const runLaw = (over) => {
  const files = over.__extra ?? [];
  const read = (f) => (f in over ? over[f] : readFileSync(f, "utf8"));
  return reserveLaw(fe, { read, extra: files });
};
const runSeed = (over) => {
  if (!seed) return "n/a";
  const text = over[MN] ?? base; const f = join(scratch, "MarginNote.planted.vue"); writeFileSync(f, text);
  try { execFileSync("node", [seed, f], { stdio: "pipe" }); return "GREEN"; } catch { return "RED"; }
};
let bad = 0;
const clean = runLaw({});
console.log(`CLEAN library ${clean.fails.length ? "RED " + clean.fails.join(" / ") : "GREEN"} · seed ${runSeed({})}`);
if (clean.fails.length) bad = 1;
for (const [k, over] of Object.entries(P)) {
  if (over[MN] === base && !over.__extra && !over[CSS] && !over[HTML]) { console.log(`${k}: PLANT DID NOT MOVE THE SOURCE`); bad = 1; continue; }
  const r = runLaw(over); const red = r.fails.length > 0;
  const sd = over[MN] || over[CSS] ? runSeed(over) : "cannot see (not the SFC)";
  console.log(`${k}: library ${red ? "RED" : "GREEN (HOLE)"} · seed ${sd}${red ? "  ← " + r.fails[0].split("\n")[0].slice(0, 150) : ""}`);
  if (!red) bad = 1;
}
for (const [k, over] of Object.entries(NN)) { const r = runLaw(over); console.log(`${k}: library ${r.fails.length ? "RED (FALSE)" : "GREEN (correct: .margin-note negated is not the subject)"} · seed ${runSeed(over)}`); if (r.fails.length) bad = 1; }

// ---- the library's self-test (the SHAPE law's clauses that the reserve law does not exercise)
const T = [];
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); T.push(ok); console.log(`SELF ${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : " want " + JSON.stringify(want)}`); };
const near = (name, a, b, tol = 1.0) => { const ca = SC.parseColor(a), cb = SC.parseColor(b); const d = ca && cb ? SC.deltaE(ca, cb) : Infinity; const ok = d <= tol; T.push(ok); console.log(`SELF ${ok ? "ok  " : "FAIL"} colour ${a} ≈ ${b}: ΔE ${d.toFixed(3)}`); };
for (const [a, b] of [["#3a7bc4", "rgb(58 123 196)"], ["#3a7bc4", "rgba(58,123,196,1)"], ["#3a7bc4", "hsl(212.2 54.5% 49.8%)"], ["#3a7bc4", "hsl(0.5895turn 54.5% 49.8%)"], ["#3a7bc4", "oklch(0.5703 0.1285 253.6)"], ["#3a7bc4", "oklab(0.5703 -0.0363 -0.1233)"], ["#3a7bc4", "color(srgb 0.2275 0.4824 0.7686)"], ["#3a7bc4", "lab(50.08 -2.44 -44.99)"], ["#3a7bc4", "lch(50.08 45.06 266.9)"], ["#3a7bc4", "hwb(212.2 22.7% 23.1%)"], ["rebeccapurple", "#663399"], ["#abc", "#aabbcc"], ["#aabbccff", "#abc"], ["color-mix(in srgb, #ff0000 50%, #0000ff)", "rgb(127.5 0 127.5)"]]) near(`${a} vs ${b}`, a, b, 1.2);
eq("var-led shorthand sets font-family", SC.sets({ prop: "font", value: "var(--x)" }, "font-family"), true);
eq("subject compound: .a .b:not(.c) → b", [...SC.compoundClasses(SC.subjectCompound(".a .b:not(.c)")).pos], ["b"]);
eq(".b:not(.a) is not subject a", SC.subjectHas(".b:not(.a)", "a"), false);
eq(":is(.a,.x) arm is subject a", SC.subjectHas(".p :is(.a, .x)", "a"), true);
eq("descendant .a .b is not subject a", SC.subjectHas(".a .b", "a"), false);
eq("stem var(--stem-${x}) → every stem token", SC.resolve("var(--rung-${n})", new Map([["--rung-a", "1ms"], ["--rung-b", "2ms"]])), "{1ms|2ms}");
eq("var() fallback evaluated", SC.resolve("var(--missing, 3px)", new Map()), "3px");
eq("CSS stripper keeps a string with /*", SC.cssRules('.a::before{content:"/*"} .b{min-height:0} .c::after{content:"*/"}').map((r) => r.prelude), [".a::before", ".b", ".c::after"]);
eq("JS stripper keeps accept=\"image/*\" in a string", SC.stripJs('const t = `<input accept="image/*">`; el.style.minHeight = "0"; // x */').includes('el.style.minHeight = "0"'), true);
eq("colour literals in any syntax", SC.colorLiterals("0 0 0 2px oklch(0.6 0.1 250), 1px hsl(10turn 50% 50%) red").map((c) => c.text), ["oklch(0.6 0.1 250)", "hsl(10turn 50% 50%)", "red"]);
if (T.includes(false)) bad = 1;
console.log(`RESULT ${bad ? "FAIL" : "PASS"} (plants ${Object.keys(P).length}, negative-negatives ${Object.keys(NN).length}, self-test ${T.filter(Boolean).length}/${T.length})`);
process.exit(bad);
