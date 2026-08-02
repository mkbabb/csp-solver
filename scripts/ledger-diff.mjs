#!/usr/bin/env node
// ledger-diff — the close that can't lie about itself.
//
// U-11's finding: nine chronic rows were dropped, not decided, at the T4 close, while the record
// claimed 100%. Second occurrence, so the ceremony is the defect. This instrument machine-diffs the
// audit's row-id sets against the tranche's own disposition corpus. A row that reaches no
// disposition is an orphan, and an orphan is a nonzero exit.
//
// Built at T5-W0 (dry-run), wielded at T5-W5 and W-GATE. Node-only, ESM, zero dependencies.
//
// ── INPUTS (the audited row-id sets) ────────────────────────────────────────────────────────────
//
//   A. evidence/audit/r1/chronic-ledger.md — CH-nn.
//      Rows are the tables of §1a–§1g and §2a–§2c: a line whose first cell is the id. §2 re-tables
//      rows already tabled in §1, so first occurrence wins and the id set dedupes. A combined cell
//      (`CH-47/48/49`) expands to its members — each is a named row carrying that line's state.
//      §1a–§1f tables run 8 columns (ID · First booked · Row · Own · Rode · Current state · Rides ·
//      Status); §2's run 4 (ID · Row · Rides · Why). Both shapes are read.
//
//   B. evidence/audit/r2/prompt-recap-matrix.md — PR-nnn (§1–§6, 137 ask-identities), U-nn (§8,
//      the unaddressed eleven), S-nn (§9, the superseded eleven).
//      §1–§6 tables run 4 columns (# · The ask · Prov. · Disposition), so the LAST cell is the
//      row's own disposition. §8 runs 5 (ID · ask · Provenance · Why it is open · Proposed owning
//      wave) — a proposal is not a disposition, so §8 rows carry NONE. §9 runs 4 (ID · original ask
//      · Superseded by · The quote) with the section itself as the disposition.
//      Cells are split on unescaped pipes: the matrix embeds `\|` inside shell one-liners.
//
// ── THE DISPOSITION CORPUS (where a row may reach terminality) ──────────────────────────────────
//
//   docs/tranches/2026-08-tranche-5/waves/*.md + that tranche's README.md, plus
//   docs/tranches/LEDGER.md when it exists. `--require-ledger` makes its absence fatal (W-GATE
//   mode: by the close, the living ledger has to be there).
//
// ── THE RULE (what satisfies a row) ─────────────────────────────────────────────────────────────
//
//   R1 CORPUS — the id appears literally in the corpus. Present-or-cited: a bare citation counts,
//      since naming a row in a wave file is what keeps it from being dropped.
//      Range expressions (`CH-01…CH-61`, `CH-01…61`) are scope references, not citations. They're
//      stripped before extraction, endpoints included — else one rhetorical sweep would green the
//      whole ledger. Slash lists (`CH-47/48/49`, `CH-41/42`) DO expand: each id is named.
//
//   R2 SELF — matrix rows only, and only on their own disposition column. The disposition is the
//      cell's LEAD vocabulary token, which is the matrix's own grammar: `**ADDRESSED** — evidence…`.
//      Terminal leads (§0's vocabulary): ADDRESSED, SUPERSEDED. Open leads: UNADDRESSED · LEDGERED
//      · IN-FLIGHT · IN PROGRESS · PARTIAL · HELD · UNKNOWN · SPLIT. A trailing clause pointing at a
//      successor (`**Successor ask open** … **IN-FLIGHT** at PR-124`) or a residue (`residue
//      **LEDGERED CH-31**`) doesn't reopen the row — those successors are input rows in their own
//      right and get gated as such. A stray UNADDRESSED anywhere in the cell still forces open.
//      §9's rows are terminal by construction when their "Superseded by" cell names a superseder.
//      Chronic rows never self-satisfy. The ledger is the input under audit; letting its own Status
//      column discharge it is precisely the record verifying the record.
//
//   R3 DELEGATED — a matrix row whose disposition cell names another input row id (LEDGERED CH-xx,
//      "→ T5 candidate U-xx", "SUPERSEDED — see §5 S-xx") is satisfied iff that target is itself
//      R1-satisfied. Delegation to an uncited row disposes nothing, so a broken chain orphans both
//      ends. Only R1 targets absorb a delegation, so no row launders itself through a chain of
//      self-terminal ancestors, and one pass settles the set.
//
//   Anything else is an ORPHAN, reported with its input, its section, its line, and why.
//
// ── STRUCTURAL GUARDS ───────────────────────────────────────────────────────────────────────────
//
//   An input that parses to zero rows is fatal, not green: format drift must fail loud. A
//   `--canary-exclude` that matches no corpus file is fatal too — a canary that excludes nothing
//   proves nothing.
//
// ── USAGE ───────────────────────────────────────────────────────────────────────────────────────
//
//   node scripts/ledger-diff.mjs [--tranche <dir>] [--require-ledger]
//                                [--canary-exclude <file>]... [--verbose]
//
//   exit 0  zero orphans
//   exit 1  orphans, every one printed with its provenance
//   exit 2  fatal — bad usage, missing input, format drift, inert canary

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_TRANCHE = "docs/tranches/2026-08-tranche-5";
const LEDGER = "docs/tranches/LEDGER.md";

const USAGE = `usage: node scripts/ledger-diff.mjs [--tranche <dir>] [--require-ledger]
                                   [--canary-exclude <file>]... [--verbose]`;

// ── argv ────────────────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    tranche: DEFAULT_TRANCHE,
    requireLedger: false,
    verbose: false,
    excludes: [],
  };
  const takesValue = new Set(["--tranche", "--canary-exclude"]);

  for (let i = 0; i < argv.length; i++) {
    const [flag, inlineValue] = argv[i].includes("=")
      ? [
          argv[i].slice(0, argv[i].indexOf("=")),
          argv[i].slice(argv[i].indexOf("=") + 1),
        ]
      : [argv[i], null];

    let value = inlineValue;
    if (takesValue.has(flag) && value === null) value = argv[++i] ?? null;
    if (takesValue.has(flag) && !value) fatal(`${flag} wants a value\n${USAGE}`);

    switch (flag) {
      case "--tranche":
        opts.tranche = value;
        break;
      case "--canary-exclude":
        opts.excludes.push(value);
        break;
      case "--require-ledger":
        opts.requireLedger = true;
        break;
      case "--verbose":
      case "-v":
        opts.verbose = true;
        break;
      case "--help":
      case "-h":
        process.stdout.write(`${USAGE}\n`);
        process.exit(0);
        break;
      default:
        fatal(`unknown flag ${flag}\n${USAGE}`);
    }
  }
  return opts;
}

function fatal(message) {
  process.stdout.write(`\nFATAL — ${message}\n`);
  process.exit(2);
}

// ── markdown table reading ──────────────────────────────────────────────────────────────────────

const PIPE = /(?<!\\)\|/;

function cellsOf(line) {
  const parts = line.trim().split(PIPE);
  return parts.slice(1, parts.length - 1).map((c) => c.trim());
}

const ID_IN_CELL = /^\s*\*{0,2}(CH-\d+(?:\/\d+)*|PR-\d{3}|U-\d{2}|S-\d{2})\*{0,2}\s*$/;

// `CH-47/48/49` → CH-47, CH-48, CH-49
function expandSlashes(token) {
  const [head, ...tail] = token.split("/");
  const prefix = head.slice(0, head.indexOf("-") + 1);
  const width = head.length - prefix.length;
  return [head, ...tail.map((n) => prefix + n.padStart(width, "0"))];
}

function readRows(absPath, relPath) {
  if (!existsSync(absPath)) fatal(`input missing: ${relPath}`);
  const lines = readFileSync(absPath, "utf8").split("\n");
  const rows = [];
  let section = "(preamble)";

  lines.forEach((line, index) => {
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) section = heading[1].trim();
    if (!line.startsWith("|")) return;

    const cells = cellsOf(line);
    if (cells.length < 2) return;
    const id = ID_IN_CELL.exec(cells[0]);
    if (!id) return;

    for (const one of expandSlashes(id[1])) {
      rows.push({ id: one, file: relPath, line: index + 1, section, cells });
    }
  });
  return rows;
}

// first occurrence wins — §2 re-tables §1's rows
function dedupe(rows) {
  const seen = new Map();
  for (const row of rows) if (!seen.has(row.id)) seen.set(row.id, row);
  return [...seen.values()];
}

// ── id extraction from prose ────────────────────────────────────────────────────────────────────

const RANGE =
  /\b(?:CH|PR|U|S)-\d+\s*(?:…|\.{2,3}|–|—|-{1,2})\s*(?:(?:CH|PR|U|S)-)?\d+\b/g;
const TOKEN = /\b(CH-\d+(?:\/\d+)*|PR-\d{3}|U-\d{2}|S-\d{2})\b/g;

function idsInText(text) {
  const found = [];
  const ranges = [];
  text.split("\n").forEach((line, index) => {
    const scrubbed = line.replace(RANGE, (match) => {
      ranges.push({ text: match, line: index + 1 });
      return " ".repeat(match.length);
    });
    for (const match of scrubbed.matchAll(TOKEN)) {
      for (const one of expandSlashes(match[1]))
        found.push({ id: one, line: index + 1 });
    }
  });
  return { found, ranges };
}

// ── the disposition vocabulary (matrix §0, plus the open tokens it uses in fact) ─────────────────

const VOCABULARY =
  /\b(UNADDRESSED|ADDRESSED|SUPERSEDED|LEDGERED|IN-FLIGHT|IN PROGRESS|PARTIAL|HELD|UNKNOWN|SPLIT)\b/;
const TERMINAL_LEADS = new Set(["ADDRESSED", "SUPERSEDED"]);

function leadToken(cell) {
  const plain = cell.replace(/\*/g, "");
  const match = VOCABULARY.exec(plain);
  return match ? match[1] : plain.slice(0, 24).trim() || "(empty)";
}

function isTerminalCell(cell) {
  const plain = cell.replace(/\*/g, "");
  return TERMINAL_LEADS.has(leadToken(cell)) && !/\bUNADDRESSED\b/.test(plain);
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────

const opts = parseArgs(process.argv.slice(2));
const out = [];
const say = (line = "") => out.push(line);

const trancheAbs = resolve(REPO, opts.tranche);
if (!existsSync(trancheAbs)) fatal(`tranche folder missing: ${opts.tranche}`);

// inputs
const chronicRel = join(opts.tranche, "evidence/audit/r1/chronic-ledger.md");
const matrixRel = join(opts.tranche, "evidence/audit/r2/prompt-recap-matrix.md");
const chronicRaw = readRows(resolve(REPO, chronicRel), chronicRel);
const matrixRaw = readRows(resolve(REPO, matrixRel), matrixRel);

const chronic = dedupe(chronicRaw.filter((r) => r.id.startsWith("CH-")));
const matrix = dedupe(matrixRaw.filter((r) => !r.id.startsWith("CH-")));

if (chronic.length === 0) fatal(`${chronicRel} parsed to zero CH rows — format drift`);
for (const prefix of ["PR-", "U-", "S-"]) {
  if (!matrix.some((r) => r.id.startsWith(prefix)))
    fatal(`${matrixRel} parsed to zero ${prefix}rows — format drift`);
}

// each matrix row's own disposition cell: §1–§6 carry one, §8 doesn't, §9 is terminal by section
for (const row of matrix) {
  if (row.id.startsWith("PR-")) {
    row.disposition = row.cells.at(-1) ?? "";
    row.selfTerminal = isTerminalCell(row.disposition);
  } else if (row.id.startsWith("S-")) {
    row.disposition = row.cells[2] ?? "";
    row.selfTerminal = row.disposition.replace(/\*/g, "").trim().length > 0;
  } else {
    row.disposition = "";
    row.selfTerminal = false; // §8 is the unaddressed set; a proposed wave is not a disposition
  }
  row.delegates = row.disposition
    ? [
        ...new Set(
          [...row.disposition.replace(RANGE, " ").matchAll(TOKEN)].flatMap((m) =>
            expandSlashes(m[1]),
          ),
        ),
      ].filter((id) => id !== row.id)
    : [];
}

const inputs = [
  { name: "chronic-ledger.md CH rows", file: chronicRel, rows: chronic },
  { name: "prompt-recap-matrix.md PR/U/S rows", file: matrixRel, rows: matrix },
];

// corpus
const wavesDir = join(trancheAbs, "waves");
if (!existsSync(wavesDir))
  fatal(`corpus folder missing: ${join(opts.tranche, "waves")}`);

let corpusAbs = [
  ...readdirSync(wavesDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => join(wavesDir, f)),
  join(trancheAbs, "README.md"),
].filter(existsSync);

const ledgerAbs = resolve(REPO, LEDGER);
if (existsSync(ledgerAbs)) corpusAbs.push(ledgerAbs);
else if (opts.requireLedger) fatal(`--require-ledger and ${LEDGER} is absent`);

const excluded = [];
for (const wanted of opts.excludes) {
  const hits = corpusAbs.filter(
    (p) =>
      basename(p) === basename(wanted) ||
      relative(REPO, p) === wanted.replace(/^\.\//, ""),
  );
  if (hits.length === 0)
    fatal(`--canary-exclude ${wanted} matched no corpus file — inert canary`);
  excluded.push(...hits);
  corpusAbs = corpusAbs.filter((p) => !hits.includes(p));
}
if (corpusAbs.length === 0) fatal("the corpus is empty after exclusions");

// scan
const citations = new Map(); // id → [{file, line}]
const scopeRefs = [];
for (const abs of corpusAbs) {
  const rel = relative(REPO, abs);
  const { found, ranges } = idsInText(readFileSync(abs, "utf8"));
  for (const hit of found) {
    if (!citations.has(hit.id)) citations.set(hit.id, []);
    citations.get(hit.id).push({ file: rel, line: hit.line });
  }
  for (const range of ranges) scopeRefs.push({ ...range, file: rel });
}

// resolve: R1 corpus, R2 self, R3 delegated (fixpoint over R1 targets)
const verdicts = new Map();
const allRows = [...chronic, ...matrix];

for (const row of allRows) {
  if (citations.has(row.id))
    verdicts.set(row.id, { route: "CORPUS", note: siteOf(row.id), row });
  else if (row.selfTerminal)
    verdicts.set(row.id, { route: "SELF", note: leadToken(row.disposition), row });
}
for (const row of allRows) {
  if (verdicts.has(row.id)) continue;
  const target = (row.delegates ?? []).find(
    (id) => verdicts.get(id)?.route === "CORPUS",
  );
  if (target) verdicts.set(row.id, { route: "DELEGATED", note: `→ ${target}`, row });
}

function siteOf(id) {
  const first = citations.get(id)?.[0];
  return first ? `${first.file}:${first.line}` : "";
}

const orphans = allRows.filter((row) => !verdicts.has(row.id));

// ── report ──────────────────────────────────────────────────────────────────────────────────────

let head = "(git unavailable)";
try {
  head = execFileSync("git", ["-C", REPO, "log", "-1", "--format=%h %ci %s"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  /* git-less checkouts still gate */
}

say("ledger-diff — T5 disposition completeness");
say("=".repeat(78));
say(`generated   ${new Date().toISOString()}`);
say(`node        ${process.version}`);
say(`repo HEAD   ${head}`);
say(`tranche     ${opts.tranche}`);
say(
  `mode        ${opts.requireLedger ? "require-ledger (W-GATE)" : "dry-run"}${
    excluded.length ? " · CANARY" : ""
  }`,
);
say();

say(`CORPUS (${corpusAbs.length} files)`);
for (const abs of corpusAbs) say(`  ${relative(REPO, abs)}  ${statSync(abs).size} B`);
if (excluded.length) {
  say(`EXCLUDED by --canary-exclude (${excluded.length})`);
  for (const abs of excluded) say(`  ${relative(REPO, abs)}`);
}
if (!existsSync(ledgerAbs)) say(`  (${LEDGER} absent — optional in dry-run mode)`);
say();

say("INPUTS");
for (const input of inputs) {
  const byPrefix = new Map();
  for (const row of input.rows) {
    const prefix = row.id.slice(0, row.id.indexOf("-") + 1);
    byPrefix.set(prefix, (byPrefix.get(prefix) ?? 0) + 1);
  }
  const tally = [...byPrefix].map(([p, n]) => `${n} ${p}nn`).join(" + ");
  say(`  ${input.file}`);
  say(`    ${input.rows.length} row ids  (${tally})`);
}
say(
  `  ${scopeRefs.length} range expressions in the corpus, read as scope, not citation:`,
);
for (const range of [
  ...new Set(scopeRefs.map((r) => `${r.file}:${r.line}  ${r.text}`)),
])
  say(`    ${range}`);
say();

const routes = ["CORPUS", "SELF", "DELEGATED"];
say("SATISFACTION");
for (const route of routes)
  say(
    `  ${route.padEnd(10)} ${[...verdicts.values()].filter((v) => v.route === route).length}`,
  );
say(`  ${"ORPHAN".padEnd(10)} ${orphans.length}`);
say(`  ${"total".padEnd(10)} ${allRows.length}`);
say();

if (opts.verbose) {
  say("SATISFIED (id · route · evidence)");
  for (const row of allRows) {
    const verdict = verdicts.get(row.id);
    if (verdict)
      say(`  ${row.id.padEnd(7)} ${verdict.route.padEnd(10)} ${verdict.note}`);
  }
  say();
}

if (orphans.length) {
  say(`ORPHANS (${orphans.length}) — no disposition, no citation, no delegation`);
  for (const row of orphans) {
    const label = (row.cells[row.cells.length >= 8 ? 2 : 1] ?? "")
      .replace(/\*|`/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 72);
    const why = row.id.startsWith("CH-")
      ? `ledger says: ${(row.cells.at(-1) ?? "").replace(/\*/g, "").slice(0, 28)}`
      : `disposition: ${leadToken(row.disposition)}${
          row.delegates?.length
            ? ` (delegates → ${row.delegates.join(", ")}, uncited)`
            : ""
        }`;
    say(
      `  ${row.id.padEnd(7)} ${row.file}:${String(row.line).padEnd(4)} ${row.section.slice(0, 30)}`,
    );
    say(`          ${label}`);
    say(`          ${why}`);
  }
  say();
}

if (orphans.length) {
  say("ORPHANS BY SET");
  const bySet = new Map();
  for (const row of orphans) {
    const key = row.id.slice(0, row.id.indexOf("-"));
    if (!bySet.has(key)) bySet.set(key, []);
    bySet.get(key).push(row.id);
  }
  for (const [key, ids] of bySet)
    say(`  ${key.padEnd(3)} ${ids.length}  ${ids.join(" ")}`);
  say();
}

say("VERDICT");
say(
  orphans.length
    ? `  RED — ${orphans.length} of ${allRows.length} audited rows reach no disposition in the corpus. exit 1`
    : `  GREEN — all ${allRows.length} audited rows are present-or-cited. exit 0`,
);

process.stdout.write(`${out.join("\n")}\n`);
process.exit(orphans.length ? 1 : 0);
