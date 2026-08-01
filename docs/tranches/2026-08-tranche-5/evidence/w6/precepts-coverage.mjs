/**
 * precepts-coverage.mjs — T5-W6.1 coverage gate.
 *
 * Every row of the §10 friction ledger (r2/prompt-recap-matrix.md) must map to a
 * precept row in docs/tranches/PRECEPTS.md. The map is explicit: each §10 edict
 * carries a set of key phrases; the gate asserts every phrase appears in the
 * precepts file's §1 table. Missing any phrase = RED.
 *
 *   node precepts-coverage.mjs <path-to-PRECEPTS.md>
 *
 * Exit 0 = every §10 row covered. Exit 1 = orphans printed.
 */
import { readFileSync, existsSync } from "node:fs";
import process from "node:process";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const MATRIX = `${ROOT}/docs/tranches/2026-08-tranche-5/evidence/audit/r2/prompt-recap-matrix.md`;
const target = process.argv[2] ?? `${ROOT}/docs/tranches/PRECEPTS.md`;

// ── the §10 rows, read from the matrix itself (never transcribed) ────────────
const md = readFileSync(MATRIX, "utf8").split("\n");
const s = md.findIndex((l) => l.startsWith("## 10."));
const e = md.findIndex((l) => l.startsWith("## 11."));
const rows = md
    .slice(s, e)
    .filter((l) => l.startsWith("|") && !/^\|\s*-+/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .slice(1) // drop the header
    .map(([edict, born, reuttered, enforced]) => ({ edict, born, reuttered, enforced }));

// ── the map: §10 edict (by its own index) → phrases the precept row must carry ─
const NEEDS = [
    ["No quick solutions, no workarounds", "idiomatic, gestalt"],
    ["No legacy code", "no aliases, shims, dual paths"],
    ["Recap ALL prompts", "silent drops forbidden"],
    ["Fold every deferred and chronic row", "re-booking forbidden"],
    ["Batches of 5–6 agents"],
    ["editorializing, or comparison sentiments"],
    ["Recursive colocation, all directories"],
    ["frontend-design plugin, actually invoked"],
    ["Core model orchestrates", "every spawn declares its model"],
    ["No god modules over 500 lines"],
    ["Tranche development only"],
    ["Concrete deliverables: file:line"],
    ["Withhold the favored success narrative"],
    ["Born-RED gates; π and DELTA"],
    ["Never push bbnf-lang origin"],
    ["The java branch stays"],
    [":3001 stays alive"],
    ["SOTA dep currency", "no 2021 cargos"],
    ["Session durability"],
    ["Continue indefatigably"],
    ["thrice design protocol"],
    ["Extreme parsimony"],
    ["Convergence is earned"],
    ["Full shadcn abrogation"],
    ["Background-only browser and simulator sessions"],
];

// U-10 rides §10's shoulder (r2 names it a T5 row, not a §10 row) and is gated too.
const EXTRA = [["A design mark closes only on an owner-side re-look", "U-10"]];

const text = existsSync(target) ? readFileSync(target, "utf8") : null;
const out = [];
const stamp = new Date().toISOString().slice(0, 10);

out.push("T5-W6.1 — PRECEPTS COVERAGE GATE");
out.push(`target : ${target}${text === null ? "  (ABSENT)" : ""}`);
out.push(`source : ${MATRIX} §10 — ${rows.length} friction rows read at run time`);
out.push("rule   : every §10 row maps to one precept row in PRECEPTS.md §1, keyed on its own phrases");
out.push("");
out.push("| # | §10 edict (verbatim) | count | precept-row key phrase | covered |");
out.push("|---|---|---|---|---|");

let missing = 0;
rows.forEach((r, i) => {
    const keys = NEEDS[i] ?? [];
    const hit = keys.length > 0 && text !== null && keys.every((k) => text.includes(k));
    if (!hit) missing++;
    const edict = r.edict.replace(/\*\*/g, "").slice(0, 78);
    const cnt = r.reuttered.replace(/\*\*/g, "");
    out.push(`| ${i + 1} | ${edict} | ${cnt} | ${keys.join(" + ") || "—"} | ${hit ? "YES" : "**NO**"} |`);
});
EXTRA.forEach(([...keys], i) => {
    const hit = text !== null && keys.every((k) => text.includes(k));
    if (!hit) missing++;
    out.push(`| U-10 | Marks close on an owner re-look (r2 §8, T5-W0.10) | 1× | ${keys.join(" + ")} | ${hit ? "YES" : "**NO**"} |`);
});

out.push("");
out.push(`rows read   : ${rows.length} §10 + ${EXTRA.length} U-row = ${rows.length + EXTRA.length}`);
out.push(`covered     : ${rows.length + EXTRA.length - missing}`);
out.push(`uncovered   : ${missing}`);
out.push(`VERDICT     : ${missing === 0 ? "GREEN — every §10 row has a precept row" : `RED — ${missing} uncovered`}`);
out.push(`run at      : ${stamp}`);
console.log(out.join("\n"));
process.exit(missing === 0 ? 0 : 1);
