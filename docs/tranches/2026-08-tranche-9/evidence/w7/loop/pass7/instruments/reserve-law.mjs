// reserve-law.mjs — the §7 reserve law re-cut ON the shape-census library (T9-W7 pass 7, chair's
// instruments; registry-v6 §2.10 names LEDGER's `reserve-law.PROPOSED.mjs` as the seed). The seed read ONE
// SFC and keyed its seat on the prelude's SPELLING (`.margin-note` exactly, `@media (max-width: 1023.98px)`
// exactly). This reads EVERY site in the tree (shape-census.mjs `census`) and keys on the SUBJECT COMPOUND.
// Law (unchanged in substance from the seed; LEDGER/ERASE's merged note):
//   R1  exactly ONE site sets the voice's (`.margin-note`) min-height anywhere in the tree — a second
//       <style>, a compound override, a shadowing declaration, a template style=/:style, a Tailwind
//       candidate, a script write or a public/ stylesheet are each a second site; an UNRESOLVED script
//       write (computed key) is a site too (never dropped)
//   R2  that site's value, RESOLVED (var() with fallbacks at the consumer), is `inherit`
//   R3  it sits under a max-width media condition (< 1024) and carries no `!important`
//   R4  the block (`.margin-note-block`) reserves ≥ 1 line at top level (em/lh/rem ≥ 1) — exactly one site
// Usage: node reserve-law.mjs <web/frontend>   Exit 0 GREEN · 1 RED (every breach printed with file:line).
import { census, tokens, resolve } from "./shape-census.mjs";

export function reserveLaw(fe, opts = {}) {
  const fails = [];
  const voice = census(fe, "margin-note", "min-height", opts); // subject-compound keyed: .margin-note-block is another class
  const { map } = tokens(fe, opts);
  const where = (s) => `${s.file}:${s.line} [${s.kind}] ${s.ctx ? s.ctx + " " : ""}${s.prelude}: ${s.prop} ${s.value}${s.important ? " !important" : ""}`;
  if (voice.length !== 1) fails.push(`R1 the voice's min-height is set at ${voice.length} sites (want exactly 1):\n      ${voice.map(where).join("\n      ") || "none"}`);
  for (const s of voice) {
    const v = resolve(s.value, map).trim();
    if (v !== "inherit") fails.push(`R2 ${where(s)} resolves to '${v}', not inherit`);
    if (s.important) fails.push(`R3 ${where(s)} carries !important`);
    if (!/max-width:\s*(1023\.98|1023)px/.test(s.ctx ?? "")) fails.push(`R3 ${where(s)} is not seated under the <1024 media condition`);
  }
  const block = census(fe, "margin-note-block", "min-height", opts);
  const top = block.filter((s) => !s.ctx);
  const em = (v) => { const m = /^([\d.]+)(em|lh|rem)$/.exec(resolve(v, map).trim()); return m ? +m[1] : 0; };
  if (top.length !== 1 || em(top[0].value) < 1) fails.push(`R4 the block's top-level reserve is not one line: ${top.map(where).join(" | ") || "none"}`);
  return { fails, voice: voice.map(where), block: block.map(where) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = reserveLaw(process.argv[2]);
  console.log(r.fails.length ? `RED\n  ${r.fails.join("\n  ")}` : `GREEN · voice ${r.voice.join(" ; ")} · block ${r.block.join(" ; ")}`);
  process.exit(r.fails.length ? 1 : 0);
}
