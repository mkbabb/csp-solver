// NOTE-LEDGER pass 6 — row 11: the MarginNote stubs vs the SFC's template, parsed by Vue's own
// compiler. Every element that wears a static `margin-*` class is keyed by that class; its tag,
// static attributes and bound directives (arg + normalised expression) are compared. `ref`,
// `:key`, `<Transition>` and the decorative star are the component's machinery, not bindings a
// stub row reads, and are listed apart. Usage: node stub-iso.mjs <web/frontend>. Exit 1 on drift.
import { readFileSync } from "node:fs";
const FE = process.argv[2];
const { parse } = await import(`${FE}/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js`);
const MACHINERY = new Set(["ref", "key"]);
function skeleton(tpl) {
  const out = {}, machinery = [];
  const walk = (n) => {
    if (n.type === 1) {
      const cls = n.props.find((p) => p.type === 6 && p.name === "class")?.value?.content ?? "";
      const key = cls.split(/\s+/).find((c) => c.startsWith("margin-note"));
      if (key) {
        const attrs = [];
        for (const p of n.props) {
          if (p.type === 6 && p.name !== "class") (MACHINERY.has(p.name) ? machinery : attrs).push(`${key} ${p.name}="${p.value?.content ?? ""}"`);
          if (p.type === 7) {
            const arg = p.arg?.content ?? "";
            const s = `${key} v-${p.name}${arg ? ":" + arg : ""}=${(p.exp?.content ?? "").replace(/\s+/g, " ").trim()}`;
            (MACHINERY.has(arg) ? machinery : attrs).push(s);
          }
        }
        out[key] = { tag: n.tag, attrs: attrs.map((a) => a.slice(key.length + 1)).sort() };
      }
    }
    (n.children ?? []).forEach(walk);
  };
  walk(parse(tpl));
  return { out, machinery };
}
const sfc = readFileSync(`${FE}/src/pencil/chrome/MarginNote.vue`, "utf8");
const real = skeleton(/<template>([\s\S]*)<\/template>/.exec(sfc)[1]);
let drift = 0;
for (const f of ["src/games/shared/GameBoard.receipt.test.ts", "src/games/shared/GameBoard.notes.test.ts"]) {
  const src = readFileSync(`${FE}/${f}`, "utf8");
  const tpl = /MarginNote: \{[\s\S]*?template: `([^`]*)`/.exec(src)[1];
  const stub = skeleton(tpl).out;
  const keys = new Set([...Object.keys(real.out), ...Object.keys(stub)]);
  for (const k of keys) {
    const a = real.out[k], b = stub[k];
    if (!a || !b) { drift++; console.log(`${f} ${k}: ${a ? "MISSING in stub" : "EXTRA in stub"}`); continue; }
    if (a.tag !== b.tag) { drift++; console.log(`${f} ${k}: tag ${a.tag} vs stub ${b.tag}`); }
    for (const x of a.attrs.filter((x) => !b.attrs.includes(x))) { drift++; console.log(`${f} ${k}: stub lacks ${x}`); }
    for (const x of b.attrs.filter((x) => !a.attrs.includes(x))) { drift++; console.log(`${f} ${k}: stub adds ${x}`); }
  }
  console.log(`${f}: ${Object.keys(stub).length} keyed elements compared`);
}
console.log(`machinery (not compared): ${real.machinery.join(" · ")}`);
console.log(`stub-iso: ${drift} drift row(s)`);
process.exit(drift ? 1 : 0);
