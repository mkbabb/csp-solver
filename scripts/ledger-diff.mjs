#!/usr/bin/env node
// ledger-diff — the close that can't lie about itself.
//
// U-11's finding: nine chronic rows were dropped, not decided, at the T4 close, while the record
// claimed 100%. Second occurrence, so the ceremony is the defect. This instrument machine-diffs the
// audit's row-id sets against the tranche's own disposition corpus, and holds the living ledger
// against the tree that is supposed to make it true.
//
// Built at T5-W0 as a dry-run. It stayed inert for a whole campaign — pinned to one tranche's
// corpus, invoked by nothing, and checking id-PRESENCE where the question is id-CURRENCY, so it
// printed GREEN over four in-tree falsifications. T7-W0 0.2 rebuilds it: a per-tranche corpus, a
// state-currency arm, a terminality arm, a cite arm, a derived owner block, and a self-test.
// Node-only, ESM, zero dependencies.
//
// ── THE ARMS ────────────────────────────────────────────────────────────────────────────────────
//
//   ORPHAN        (always) the original completeness diff: every audited row id reaches a
//                 disposition in the tranche's corpus, or it is an orphan.
//   TERMINALITY   (--assert-state) a LEDGER §1 row whose STATE names a wave of a SEALED tranche
//                 has outlived its landing. A wave that seals without its row moving is exactly
//                 the ledger-accretion disease (T7-R04).
//   PROBE         (--assert-state) a LEDGER §1 row whose claim a registered one-line probe
//                 refutes. The probes read the TREE, never the record.
//   DUPLICATE     (--assert-state) an id living in the open section and a terminal section at once.
//   CITES         (--verify-cites) every `file:line` cite in a scoped row resolves, and an
//                 adjacent backticked anchor actually appears there (N-03, N-12).
//
//   --owner-block  emits the owner block a close record embeds, derived from the ledger rather
//                  than hand-copied into it (T7-R14). Emission only; no verdict.
//   --self-test    every arm is shown able to RED on a synthetic violation before the real audit
//                  runs. A gate that can't be shown failing is not a gate (check-pw-projects.mjs's
//                  idiom, and the reason this script's own vacuity survived a campaign).
//
// ── STRUCTURE, NOT ROW TEXT ─────────────────────────────────────────────────────────────────────
//
//   Nothing here is keyed to a tranche number, a row's wording, or a line number. The corpus is
//   whichever tranche is newest (or `--tranche`); "sealed" is the existence of a close record in
//   one of its known shapes; "open" is the ledger's FIRST numbered section and "terminal" is every
//   later one. Restamp a row, move it, or renumber the table and the arms follow.
//
// ── INPUTS (the audited row-id sets) ────────────────────────────────────────────────────────────
//
//   Discovered per tranche, by shape, from INPUT_SHAPES: the r1 chronic ledger, the r2 prompt-recap
//   matrix, and a formation DISPOSITIONS table. Whichever exist are read; at least one must.
//   Rows are table lines whose first cell OPENS with an id of a family in ROW_FAMILIES — bare, or
//   carrying the row's own title, which is how a DISPOSITIONS section writes it (`| EL-1 restore
//   the literal trie | … |`). A combined cell (`CH-47/48/49`) expands to its members. §2-style
//   re-tabling dedupes, first occurrence winning. An input that exists and parses to zero rows is
//   fatal — format drift must fail loud.
//
// ── THE RULE (what satisfies a row) ─────────────────────────────────────────────────────────────
//
//   R1 CORPUS — the id appears literally in the corpus. Present-or-cited: naming a row in a wave
//      file is what keeps it from being dropped. Range expressions (`CH-01…CH-61`) are scope, not
//      citation, and are stripped before extraction — else one rhetorical sweep greens everything.
//      Slash lists DO expand: each id is named.
//   R2 SELF — matrix rows only, on their own disposition column's LEAD vocabulary token. Chronic
//      rows never self-satisfy: letting the audited ledger's own Status column discharge it is
//      precisely the record verifying the record.
//   R3 DELEGATED — a disposition naming another input row is satisfied iff that target is itself
//      R1-satisfied. Only R1 targets absorb a delegation, so one pass settles the set.
//
// ── USAGE ───────────────────────────────────────────────────────────────────────────────────────
//
//   node scripts/ledger-diff.mjs [--tranche <dir>] [--require-ledger] [--assert-state]
//                                [--verify-cites] [--owner-block] [--self-test]
//                                [--canary-exclude <file>]... [--verbose]
//
//   exit 0  clean
//   exit 1  findings, every one printed with its provenance
//   exit 2  fatal — bad usage, missing input, format drift, inert canary

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TRANCHES = "docs/tranches";
const LEDGER = "docs/tranches/LEDGER.md";

/** A tranche is SEALED when a close record exists in it. Three shapes are on record; a fourth
 *  goes here, and the arms that depend on sealing pick it up without further edits. */
const CLOSE_RECORD_SHAPES = [
  "WGATE-record.md",
  "evidence/wgate/close-record.md",
  "CLOSE.md",
];

/** Where a tranche keeps its audited row-id sets. Existence-tested, never assumed. */
const INPUT_SHAPES = [
  "evidence/audit/r1/chronic-ledger.md",
  "evidence/audit/r2/prompt-recap-matrix.md",
  "DISPOSITIONS.md",
];

/** The row families the ORPHAN arm audits, derived from the id population actually tabled in the
 *  living ledger and in a tranche's DISPOSITIONS — chronics, the recap's `PR-nnn`, the audit's U/S,
 *  the T5-carried O/B, pre-T5 P, T6-born EL/Q/D, the formation-defect N, the ballot sheet's BAL,
 *  and the tranche-scoped recap family `T<n>-R`. A family missing here is a row outside every arm,
 *  so widening this widens the input set — do it on purpose, and from the data. */
const ROW_FAMILIES = [
  "CH",
  "PR",
  "U",
  "S",
  "O",
  "P",
  "N",
  "B",
  "D",
  "Q",
  "EL",
  "BAL",
  String.raw`T\d+`,
];

const USAGE = `usage: node scripts/ledger-diff.mjs [--tranche <dir>] [--require-ledger] [--assert-state]
                                   [--verify-cites] [--owner-block] [--self-test]
                                   [--canary-exclude <file>]... [--verbose]`;

// ── argv ────────────────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    tranche: null, // null → the newest tranche on disk
    requireLedger: false,
    assertState: false,
    verifyCites: false,
    ownerBlock: false,
    selfTest: false,
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
      case "--assert-state":
        opts.assertState = true;
        break;
      case "--verify-cites":
        opts.verifyCites = true;
        break;
      case "--owner-block":
        opts.ownerBlock = true;
        break;
      case "--self-test":
        opts.selfTest = true;
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

// ── the tranche estate ──────────────────────────────────────────────────────────────────────────

/** Every `*tranche-<n>` directory, ordered by its own number so `tranche-10` sorts after `-9`.
 *  Sealing is inherited forward: the early tranches closed inside their READMEs and left no
 *  record in any of the shapes above, but a tranche whose successor sealed cannot still be open,
 *  so a later seal seals it. The rule needs no filename and maintains itself. */
function trancheEstate() {
  const root = resolve(REPO, TRANCHES);
  if (!existsSync(root)) fatal(`no tranche root: ${TRANCHES}`);
  const found = readdirSync(root)
    .map((name) => ({ name, num: /tranche-(\d+)$/.exec(name)?.[1] }))
    .filter((t) => t.num !== undefined && statSync(join(root, t.name)).isDirectory())
    .map((t) => {
      const rel = `${TRANCHES}/${t.name}`;
      const seal = CLOSE_RECORD_SHAPES.find((shape) =>
        existsSync(resolve(REPO, rel, shape)),
      );
      return {
        name: t.name,
        num: Number(t.num),
        rel,
        sealed: Boolean(seal),
        seal: seal ?? null,
      };
    })
    .sort((a, b) => a.num - b.num);
  if (found.length === 0) fatal(`no ${TRANCHES}/*tranche-<n> directories`);
  for (let i = found.length - 2; i >= 0; i--)
    if (!found[i].sealed && found[i + 1].sealed) {
      found[i].sealed = true;
      found[i].seal = `superseded by ${found[i + 1].name}`;
    }
  return found;
}

// ── markdown table reading ──────────────────────────────────────────────────────────────────────

const PIPE = /(?<!\\)\|/;

function cellsOf(line) {
  const parts = line.trim().split(PIPE);
  return parts.slice(1, parts.length - 1).map((c) => c.trim());
}

/** The ordinal half of an id, read off the population the estate actually writes: a number that
 *  may carry the recap families' `R` (`T7-R13`) and a lettered sub-row (`EL-3a`, `P-5e`). A
 *  grammar narrower than the data is rows outside every arm — a bare `-\d+` held 30 of the
 *  ledger's §6 rows out of the very count the report printed for it. */
const ORDINAL = String.raw`R?\d+[a-z]?`;
const idToken = (families) => `(?:${families.join("|")})-${ORDINAL}(?:/${ORDINAL})*`;

/** An input table's first cell: the id alone, or the id ahead of the row's own title. */
const idCellPattern = (families) =>
  new RegExp(`^\\s*\\*{0,2}(${idToken(families)})\\*{0,2}(?:\\s+\\S.*)?$`);

/** Any `XX-nn` id, for the ledger's own rows: the ledger carries ballots and elections too. */
const ANY_ID_CELL = new RegExp(
  `^\\s*\\*{0,2}([A-Z][A-Za-z0-9]*-${ORDINAL}(?:/${ORDINAL})*)\\*{0,2}\\s*$`,
);

/** `CH-47/48/49` → CH-47, CH-48, CH-49 */
function expandSlashes(token) {
  const [head, ...tail] = token.split("/");
  const prefix = head.slice(0, head.indexOf("-") + 1);
  const width = head.length - prefix.length;
  return [head, ...tail.map((n) => prefix + n.padStart(width, "0"))];
}

function readRows(absPath, relPath, pattern) {
  const lines = readFileSync(absPath, "utf8").split("\n");
  const rows = [];
  let section = "(preamble)";

  lines.forEach((line, index) => {
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) section = heading[1].trim();
    if (!line.startsWith("|")) return;

    const cells = cellsOf(line);
    if (cells.length < 2) return;
    const id = pattern.exec(cells[0]);
    if (!id) return;

    for (const one of expandSlashes(id[1]))
      rows.push({
        id: one,
        file: relPath,
        line: index + 1,
        section,
        cells,
        text: line,
      });
  });
  return rows;
}

// first occurrence wins — a later section re-tables an earlier one's rows
function dedupe(rows) {
  const seen = new Map();
  for (const row of rows) if (!seen.has(row.id)) seen.set(row.id, row);
  return [...seen.values()];
}

// ── id extraction from prose ────────────────────────────────────────────────────────────────────

const rangePattern = (families) =>
  new RegExp(
    `\\b(?:${families.join("|")})-${ORDINAL}\\s*(?:…|\\.{2,3}|–|—|-{1,2})\\s*(?:(?:${families.join("|")})-)?${ORDINAL}\\b`,
    "g",
  );
const tokenPattern = (families) => new RegExp(`\\b(${idToken(families)})\\b`, "g");

function idsInText(text, families) {
  const found = [];
  const ranges = [];
  const RANGE = rangePattern(families);
  const TOKEN = tokenPattern(families);
  text.split("\n").forEach((line, index) => {
    const scrubbed = line.replace(RANGE, (match) => {
      ranges.push({ text: match, line: index + 1 });
      return " ".repeat(match.length);
    });
    for (const match of scrubbed.matchAll(TOKEN))
      for (const one of expandSlashes(match[1]))
        found.push({ id: one, line: index + 1 });
  });
  return { found, ranges };
}

// ── the disposition vocabulary (the matrix's §0, plus the open tokens it uses in fact) ──────────

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

// ── the living ledger, parsed by structure ──────────────────────────────────────────────────────
//
// `## <n>. <title>` opens a numbered section. The FIRST one is the open section; every later one
// is terminal. A row is a table line whose first cell is a bare id. Column roles are positional
// and shape-tolerant: the state is the second cell where there is one, the body is the last.

function parseLedger(text, relPath) {
  const sections = [];
  let current = null;
  text.split("\n").forEach((line, index) => {
    const heading = /^##\s+(\d+)\.\s*(.*)$/.exec(line);
    if (heading) {
      current = { num: Number(heading[1]), title: heading[2].trim(), rows: [] };
      sections.push(current);
      return;
    }
    if (!current || !line.startsWith("|")) return;
    const cells = cellsOf(line);
    if (cells.length < 2) return;
    const id = ANY_ID_CELL.exec(cells[0]);
    if (!id) return;
    for (const one of expandSlashes(id[1]))
      current.rows.push({
        id: one,
        file: relPath,
        line: index + 1,
        section: current.num,
        sectionTitle: current.title,
        state: cells.length >= 3 ? cells[1] : "",
        body: cells.at(-1) ?? "",
        text: line,
      });
  });
  const openNum = sections.length ? Math.min(...sections.map((s) => s.num)) : null;
  const rows = sections.flatMap((s) => s.rows);
  return {
    file: relPath,
    sections,
    rows,
    openNum,
    open: rows.filter((r) => r.section === openNum),
    terminal: rows.filter((r) => r.section !== openNum),
  };
}

// ── wave references ─────────────────────────────────────────────────────────────────────────────
//
// `T<n>-W<m>` names tranche n's wave. A bare `W<m>` names the CURRENT tranche's — which is how a row
// folded into the tranche now running is written, and why it stays green until that tranche seals.

const QUALIFIED_WAVE = /\bT(\d+)[-.]?W([\w.]*\d)/g;
const BARE_WAVE = /(?<![\w-])W(\d+(?:\.\d+)?)\b/g;

function waveRefs(state, currentNum) {
  const refs = [];
  const seen = new Set();
  const push = (num, label) => {
    const key = `${num}·${label}`;
    if (!seen.has(key)) (seen.add(key), refs.push({ tranche: num, label }));
  };
  let scrubbed = state;
  for (const m of state.matchAll(QUALIFIED_WAVE))
    push(Number(m[1]), `T${m[1]}-W${m[2]}`);
  scrubbed = state.replace(QUALIFIED_WAVE, (m) => " ".repeat(m.length));
  for (const m of scrubbed.matchAll(BARE_WAVE)) push(currentNum, `W${m[1]}`);
  return refs;
}

// ── the probe registry ──────────────────────────────────────────────────────────────────────────
//
// Keyed by row id. A probe reads the TREE and answers one question: does the tree refute what this
// row asserts? A refuted row that is still open is a false record, and false records red. Probes
// are one-liners on purpose — a probe with a branch is a second implementation of the claim.

const PROBES = {
  "CH-16": {
    claim: "the `?board=` permalink half is UNWIRED",
    run(io) {
      const dir = "web/frontend/src/games";
      const specs = io
        .list(dir)
        .map((g) => `${dir}/${g}/spec.ts`)
        .filter((p) => io.read(p) !== null);
      const wired = specs.filter((p) => io.read(p).includes("urlCodec"));
      return {
        refuted: specs.length > 0 && wired.length === specs.length,
        note: `urlCodec present in ${wired.length}/${specs.length} of ${dir}/*/spec.ts`,
      };
    },
  },
};

// ── the arms ────────────────────────────────────────────────────────────────────────────────────
//
// Each is a pure function of a model, which is what makes --self-test possible: the fixtures hand
// each arm a synthetic model carrying the violation it names.

/** T7-R04 — a §1 row whose landing wave belongs to a sealed tranche has outlived its home. */
function armTerminality({ ledger, tranches, currentNum }) {
  const sealedBy = new Map(tranches.filter((t) => t.sealed).map((t) => [t.num, t]));
  const found = [];
  for (const row of ledger.open)
    for (const ref of waveRefs(row.state, currentNum)) {
      const tranche = sealedBy.get(ref.tranche);
      if (!tranche) continue;
      found.push({
        id: row.id,
        where: `${row.file}:${row.line}`,
        why:
          `state "${row.state.slice(0, 44)}" lands at ${ref.label}, and ${tranche.name} SEALED ` +
          `(${tranche.seal}). A wave that seals without its row moving is the accretion disease — ` +
          `restamp the row terminal in §${ledger.openNum + 1}+, or re-fold it into an open tranche.`,
      });
    }
  return found;
}

/** A registered one-line probe refutes an open row's claim. */
function armProbes({ ledger, probes, io }) {
  const found = [];
  for (const row of ledger.open) {
    const probe = probes[row.id];
    if (!probe) continue;
    const verdict = probe.run(io);
    if (!verdict.refuted) continue;
    found.push({
      id: row.id,
      where: `${row.file}:${row.line}`,
      why:
        `open row asserts ${probe.claim}; the tree refutes it — ${verdict.note}. The record ` +
        `cannot verify the record: close the row or correct the claim.`,
    });
  }
  return found;
}

/** One id, two homes: open and terminal at once. */
function armDuplicateHomes({ ledger }) {
  const terminal = new Map(ledger.terminal.map((r) => [r.id, r]));
  return ledger.open
    .filter((r) => terminal.has(r.id))
    .map((r) => ({
      id: r.id,
      where: `${r.file}:${r.line}`,
      why: `also tabled terminal at §${terminal.get(r.id).section} (${r.file}:${terminal.get(r.id).line}). A row has one home.`,
    }));
}

// ── cites ───────────────────────────────────────────────────────────────────────────────────────
//
// Scope: the open section, plus terminal rows still under WATCH — the rows a close actually reads.
// A cite is a backticked path, optionally `:line` or `:line-line`. Two rules:
//   C1 RESOLVES  a cite carrying a line resolves to a tracked file with at least that many lines.
//   C2 ANCHORS   a backticked non-path token within ANCHOR_WINDOW characters before the cite must
//                actually appear in the file — at the cited line ±ANCHOR_SLACK when a line is
//                given, anywhere in the file when one is not. This is N-03's shape (`lint:ink` at
//                `ci.yml:553` while the recipe lives elsewhere) and N-12's ("the LEDGER W1.15 line").

const ANCHOR_WINDOW = 60;
const ANCHOR_SLACK = 5;

const BACKTICKED = /`([^`]+)`/g;
// The extension must START with a letter, or a row token like `W1.15` reads as a file and the
// N-12 shape ("the LEDGER W1.15 line") is silently reclassified out of the arm that catches it.
const PATH_SPAN =
  /^(?:…\/)?([A-Za-z0-9_.\-/]+\.[A-Za-z][A-Za-z0-9]{0,4})(?::(\d+)(?:-(\d+))?)?$/;
const ANCHOR_TOKEN = /^[A-Za-z_][\w.:-]*$/;
const HEXISH = /^[0-9a-f]{6,40}$/i;

function citesInRow(text) {
  const spans = [];
  for (const m of text.matchAll(BACKTICKED))
    spans.push({ raw: m[1], at: m.index ?? 0, end: (m.index ?? 0) + m[0].length });

  const anchors = spans.filter(
    (s) => !PATH_SPAN.test(s.raw) && ANCHOR_TOKEN.test(s.raw) && !HEXISH.test(s.raw),
  );

  const cites = [];
  for (const span of spans) {
    const m = PATH_SPAN.exec(span.raw);
    if (!m) continue;
    const anchor = anchors
      .filter((a) => a.end <= span.at && span.at - a.end <= ANCHOR_WINDOW)
      .at(-1);
    cites.push({
      path: m[1],
      line: m[2] ? Number(m[2]) : null,
      lineEnd: m[3] ? Number(m[3]) : m[2] ? Number(m[2]) : null,
      anchor: anchor?.raw ?? null,
      raw: span.raw,
    });
  }
  return cites;
}

function armCites({ ledger, io }) {
  const scoped = [
    ...ledger.open,
    ...ledger.terminal.filter((r) => /\bWATCH\b/.test(r.state)),
  ];
  const found = [];
  for (const row of scoped)
    for (const cite of citesInRow(row.text)) {
      const hit = io.resolve(cite.path);
      if (cite.line !== null) {
        if (hit.matches.length === 0) {
          found.push({
            id: row.id,
            where: `${row.file}:${row.line}`,
            why: `cite \`${cite.raw}\` names no tracked file — dead path.`,
          });
          continue;
        }
        if (hit.matches.length > 1) {
          found.push({
            id: row.id,
            where: `${row.file}:${row.line}`,
            why: `cite \`${cite.raw}\` is ambiguous — ${hit.matches.join(", ")}. Cite the full path.`,
          });
          continue;
        }
        const lines = io.read(hit.path).split("\n");
        if (cite.lineEnd > lines.length) {
          found.push({
            id: row.id,
            where: `${row.file}:${row.line}`,
            why: `cite \`${cite.raw}\` runs past ${hit.path}, which has ${lines.length} lines.`,
          });
          continue;
        }
      }
      if (!cite.anchor || hit.matches.length !== 1) continue;
      const lines = io.read(hit.path).split("\n");
      const at = lines
        .map((l, i) => (l.includes(cite.anchor) ? i + 1 : 0))
        .filter(Boolean);
      if (at.length === 0)
        found.push({
          id: row.id,
          where: `${row.file}:${row.line}`,
          why: `\`${cite.anchor}\` is cited at \`${cite.raw}\` and appears nowhere in ${hit.path}.`,
        });
      else if (
        cite.line !== null &&
        !at.some(
          (n) => n >= cite.line - ANCHOR_SLACK && n <= cite.lineEnd + ANCHOR_SLACK,
        )
      )
        found.push({
          id: row.id,
          where: `${row.file}:${row.line}`,
          why:
            `\`${cite.anchor}\` is cited at \`${cite.raw}\` but lives at ${hit.path}:` +
            `${at.join(",:")} — the line moved and the cite did not (N-03).`,
        });
    }
  return found;
}

// ── the owner block (T7-R14) ────────────────────────────────────────────────────────────────────
//
// A close record's owner block is a DIFF against the ledger, never a paragraph typed beside it —
// a hand-copy is how T5's block failed to survive into T6's close. Rows that carry an owner or a
// trigger are the ones a human has to act on; the block is exactly those, verbatim from the table.

const OWNER_STATES = /\b(WATCH|BALLOT|BANKED|HELD|KEEP-PARK|PARK|DECLARED)\b/;
const OWNER_OF = /\bowner\s*[:=]\s*([^.;|]+?)(?=[.;|]|$)/i;
// A trigger runs to the clause end, not to the first period — the evaluable ones are full of
// version numbers and file names, and stopping at `.` amputates exactly the part that is testable.
const TRIGGER_OF = /\btriggers?\s*[:=]\s*([^;|]+)/i;
// A balloted row carries no trigger; it carries a firing default, and printing "(unstated)" over
// one is the block lying about the row it derives from. `**Firing default (dated):**` is the
// ledger's own idiom, so the label may hold a parenthetical ahead of its colon.
const DEFAULT_OF = /\b(?:firing\s+)?defaults?\b[^:=|]{0,20}[:=]\s*([^;|]+)/i;

const tidy = (s) => s.replace(/\*|`/g, "").replace(/\s+/g, " ").trim();

// Nothing here truncates. A close record embeds this block verbatim, and a cell cut at a column
// width is a state, an owner or a trigger amputated mid-phrase — the record made unreadable by
// the instrument that derives it.
function ownerBlock(ledger) {
  const scoped = [
    ...ledger.open,
    ...ledger.terminal.filter((r) => /\bWATCH\b/.test(r.state)),
  ].filter((r) => OWNER_STATES.test(r.state));
  return scoped.map((row) => {
    const trigger = tidy(TRIGGER_OF.exec(row.body)?.[1] ?? "");
    const fired = trigger || tidy(DEFAULT_OF.exec(row.body)?.[1] ?? "");
    return {
      id: row.id,
      state: tidy(row.state),
      owner: tidy(OWNER_OF.exec(row.body)?.[1] ?? "") || "(unstated)",
      trigger: trigger || (fired && `default: ${fired}`) || "(unstated)",
      cite: `${row.file}:${row.line}`,
    };
  });
}

// ── io: the arms touch the tree only through this, so a fixture can hand them another one ───────

function realIo(trackedFiles) {
  const cache = new Map();
  const bySuffix = new Map();
  for (const f of trackedFiles) {
    const key = `/${f}`;
    for (let i = 0; i < f.length; i++)
      if (i === 0 || f[i - 1] === "/") {
        const suffix = `/${f.slice(i)}`;
        if (!bySuffix.has(suffix)) bySuffix.set(suffix, []);
        bySuffix.get(suffix).push(f);
      }
    void key;
  }
  return {
    read(rel) {
      if (!cache.has(rel)) {
        const abs = resolve(REPO, rel);
        cache.set(
          rel,
          existsSync(abs) && statSync(abs).isFile() ? readFileSync(abs, "utf8") : null,
        );
      }
      return cache.get(rel);
    },
    list(rel) {
      const abs = resolve(REPO, rel);
      return existsSync(abs) && statSync(abs).isDirectory()
        ? readdirSync(abs).sort()
        : [];
    },
    resolve(path) {
      if (trackedFiles.includes(path)) return { path, matches: [path] };
      const matches = bySuffix.get(`/${path}`) ?? [];
      return { path: matches[0] ?? null, matches };
    },
  };
}

function trackedFiles() {
  try {
    return execFileSync("git", ["-C", REPO, "ls-files"], {
      encoding: "utf8",
      maxBuffer: 64 << 20,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
  } catch {
    fatal("git ls-files failed — the cite arm resolves against the tracked set");
  }
}

// ── self-test: every arm shown able to red ──────────────────────────────────────────────────────

const fixtureLedger = (openRows, terminalRows = []) => ({
  file: "FIXTURE.md",
  openNum: 1,
  sections: [],
  rows: [],
  open: openRows.map((r, i) => ({
    file: "FIXTURE.md",
    line: i + 1,
    section: 1,
    state: "",
    body: "",
    text: "",
    ...r,
  })),
  terminal: terminalRows.map((r, i) => ({
    file: "FIXTURE.md",
    line: 100 + i,
    section: 2,
    state: "",
    body: "",
    text: "",
    ...r,
  })),
});

const fixtureIo = (files) => ({
  read: (p) => files[p] ?? null,
  list: (p) =>
    [
      ...new Set(
        Object.keys(files)
          .filter((f) => f.startsWith(`${p}/`))
          .map((f) => f.slice(p.length + 1).split("/")[0]),
      ),
    ].sort(),
  resolve: (p) => {
    const matches = Object.keys(files).filter((f) => f === p || f.endsWith(`/${p}`));
    return { path: matches[0] ?? null, matches };
  },
});

const FIXTURE_TRANCHES = [
  {
    name: "fixture-tranche-1",
    num: 1,
    rel: "x/fixture-tranche-1",
    sealed: true,
    seal: "CLOSE.md",
  },
  {
    name: "fixture-tranche-2",
    num: 2,
    rel: "x/fixture-tranche-2",
    sealed: false,
    seal: null,
  },
];

/** One first cell of every shape the estate writes, lifted from LEDGER.md and DISPOSITIONS.md —
 *  the grammar is pinned to the population, not to a guess about it. */
const ID_CELL_POPULATION = [
  "CH-01",
  "PR-034",
  "U-11",
  "S-04",
  "O-10",
  "P-5e",
  "N-12",
  "B-1",
  "D-3",
  "Q-6",
  "EL-3a",
  "BAL-01",
  "T7-R13a",
  "**CH-62**",
  "CH-47/48/49",
  "EL-1 restore the literal trie",
];

/** Cells that are prose, a header, or a verdict — none of them a row. */
const NON_ID_CELLS = [
  "Row",
  "id",
  "TERMINAL-CLOSED",
  "**total**",
  "---",
  "the S-series extensions",
  "D-M3 re-baseline authority overstep",
  "OD-4's dangling CNAME",
];

const unreadIdCells = ({ pattern, cells }) =>
  cells
    .filter((cell) => !pattern.test(cell))
    .map((cell) => ({ id: cell, where: "FIXTURE", why: "id the grammar can't read" }));

const overreadIdCells = ({ pattern, cells }) =>
  cells
    .filter((cell) => pattern.test(cell))
    .map((cell) => ({ id: cell, where: "FIXTURE", why: "prose read as a row" }));

/** The owner block is emission, not verdict — but a scoped row printing "(unstated)" over a
 *  firing default, or a state cut at a column width, is the block lying about the row it derives
 *  from, and a close record embeds it verbatim. */
const ownerBlockFaults = ({ ledger }) => {
  const stated = new Map(ledger.open.map((r) => [r.id, tidy(r.state)]));
  return ownerBlock(ledger)
    .filter((r) => r.trigger === "(unstated)" || r.state !== stated.get(r.id))
    .map((r) => ({
      id: r.id,
      where: r.cite,
      why: `owner block prints state "${r.state}" · trigger "${r.trigger}"`,
    }));
};

/** [arm, what the fixture violates, the model, the control that must stay green] */
const FIXTURES = [
  [
    "GRAMMAR/reads",
    "a lettered, recap-prefixed or titled id cell falls outside the grammar",
    unreadIdCells,
    {
      pattern: /^\s*\*{0,2}((?:CH|PR|U|S)-\d+(?:\/\d+)*)\*{0,2}\s*$/,
      cells: ID_CELL_POPULATION,
    },
    { pattern: idCellPattern(ROW_FAMILIES), cells: ID_CELL_POPULATION },
  ],
  [
    "GRAMMAR/refuses",
    "prose, a header or a verdict is read as a row id",
    overreadIdCells,
    { pattern: /^\s*\*{0,2}([A-Za-z][\w-]*)\*{0,2}/, cells: NON_ID_CELLS },
    { pattern: idCellPattern(ROW_FAMILIES), cells: NON_ID_CELLS },
  ],
  [
    "OWNER-BLOCK",
    "a balloted row prints no trigger and no default, or a state cut mid-phrase",
    ownerBlockFaults,
    {
      ledger: fixtureLedger([
        {
          id: "FX-08",
          state: "BALLOT → BAL-99, dispatched 2026-08-03, default fires at WGATE",
          body: "Owner = the owner. The row names no trigger and no default",
        },
      ]),
    },
    {
      ledger: fixtureLedger([
        {
          id: "FX-08",
          state: "BALLOT → BAL-99, dispatched 2026-08-03, default fires at WGATE",
          body: "Owner = the owner. Default = the claim retires to sim-scope at T8 formation",
        },
      ]),
    },
  ],
  [
    "TERMINALITY",
    "an open row lands at a wave of a sealed tranche",
    armTerminality,
    {
      ledger: fixtureLedger([{ id: "FX-01", state: "BUILD → T1-W2" }]),
      tranches: FIXTURE_TRANCHES,
      currentNum: 2,
    },
    {
      ledger: fixtureLedger([{ id: "FX-01", state: "FOLDED → W2" }]),
      tranches: FIXTURE_TRANCHES,
      currentNum: 2,
    },
  ],
  [
    "PROBE",
    "an open row's claim is refuted by the tree",
    armProbes,
    {
      ledger: fixtureLedger([{ id: "FX-02", state: "SPLIT — half open" }]),
      probes: {
        "FX-02": {
          claim: "the fixture claim",
          run: () => ({ refuted: true, note: "the tree says otherwise" }),
        },
      },
      io: fixtureIo({}),
    },
    {
      ledger: fixtureLedger([{ id: "FX-02", state: "SPLIT — half open" }]),
      probes: {
        "FX-02": {
          claim: "the fixture claim",
          run: () => ({ refuted: false, note: "unfired" }),
        },
      },
      io: fixtureIo({}),
    },
  ],
  [
    "PROBE/CH-16",
    "the registered CH-16 probe fires when every game spec carries urlCodec",
    armProbes,
    {
      ledger: fixtureLedger([{ id: "CH-16", state: "SPLIT — half open" }]),
      probes: PROBES,
      io: fixtureIo({
        "web/frontend/src/games/a/spec.ts": "export const urlCodec = 1",
        "web/frontend/src/games/b/spec.ts": "export const urlCodec = 2",
      }),
    },
    {
      ledger: fixtureLedger([{ id: "CH-16", state: "SPLIT — half open" }]),
      probes: PROBES,
      io: fixtureIo({
        "web/frontend/src/games/a/spec.ts": "export const urlCodec = 1",
        "web/frontend/src/games/b/spec.ts": "no codec here",
      }),
    },
  ],
  [
    "DUPLICATE",
    "one id is tabled open and terminal at once",
    armDuplicateHomes,
    { ledger: fixtureLedger([{ id: "FX-03" }], [{ id: "FX-03" }]) },
    { ledger: fixtureLedger([{ id: "FX-03" }], [{ id: "FX-04" }]) },
  ],
  [
    "CITES/resolve",
    "a cite runs past the end of the file it names",
    armCites,
    {
      ledger: fixtureLedger([
        { id: "FX-05", text: "| FX-05 | WATCH | see `fixture.ts:99` |" },
      ]),
      io: fixtureIo({ "src/fixture.ts": "one\ntwo\n" }),
    },
    {
      ledger: fixtureLedger([
        { id: "FX-05", text: "| FX-05 | WATCH | see `fixture.ts:2` |" },
      ]),
      io: fixtureIo({ "src/fixture.ts": "one\ntwo\n" }),
    },
  ],
  [
    "CITES/anchor",
    "the anchor moved and the line-cite did not",
    armCites,
    {
      ledger: fixtureLedger([
        {
          id: "FX-06",
          text: "| FX-06 | WATCH | `lint:fixture` wired at `fixture.yml:1` |",
        },
      ]),
      io: fixtureIo({
        ".github/fixture.yml": "a\nb\nc\nd\ne\nf\ng\nh\nlint:fixture\n",
      }),
    },
    {
      ledger: fixtureLedger([
        {
          id: "FX-06",
          text: "| FX-06 | WATCH | `lint:fixture` wired at `fixture.yml:9` |",
        },
      ]),
      io: fixtureIo({
        ".github/fixture.yml": "a\nb\nc\nd\ne\nf\ng\nh\nlint:fixture\n",
      }),
    },
  ],
  [
    "CITES/row-token",
    "a file-plus-row-token cite that greps to nothing",
    armCites,
    {
      ledger: fixtureLedger([
        { id: "FX-07", text: "| FX-07 | WATCH | the `W1.15` line of `fixture.md` |" },
      ]),
      io: fixtureIo({ "docs/fixture.md": "no such row here\n" }),
    },
    {
      ledger: fixtureLedger([
        { id: "FX-07", text: "| FX-07 | WATCH | the `W1.15` line of `fixture.md` |" },
      ]),
      io: fixtureIo({ "docs/fixture.md": "W1.15 is right here\n" }),
    },
  ],
  [
    "ORPHAN",
    "an audited id reaches no disposition in the corpus",
    ({ rows, citations }) =>
      rows
        .filter((r) => !citations.has(r.id))
        .map((r) => ({ id: r.id, where: "FIXTURE", why: "orphan" })),
    { rows: [{ id: "CH-99" }], citations: new Map() },
    { rows: [{ id: "CH-99" }], citations: new Map([["CH-99", []]]) },
  ],
];

function selfTest(say) {
  const vacuous = [];
  for (const [arm, description, fn, wounded, control] of FIXTURES) {
    const red = fn(wounded);
    const green = fn(control);
    say(`  [${arm}] ${description}`);
    say(`      violation → ${red.length ? "RED (as it must)" : "GREEN — VACUOUS"}`);
    say(
      `      control   → ${green.length ? `RED — OVER-FIRES (${green.length})` : "GREEN (as it must)"}`,
    );
    if (red.length === 0)
      vacuous.push(
        `arm "${arm}" stayed GREEN under: ${description}. It cannot fail for the defect it names.`,
      );
    if (green.length > 0)
      vacuous.push(
        `arm "${arm}" RED on its conformant control — it fires on the honest case too.`,
      );
  }
  return vacuous;
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────

const opts = parseArgs(process.argv.slice(2));
const out = [];
const say = (line = "") => out.push(line);

const estate = trancheEstate();
const tranche = opts.tranche
  ? (estate.find((t) => t.rel === opts.tranche.replace(/^\.\/|\/$/g, "")) ?? {
      name: basename(opts.tranche.replace(/\/$/, "")),
      num: Number(/tranche-(\d+)$/.exec(opts.tranche.replace(/\/$/, ""))?.[1] ?? NaN),
      rel: opts.tranche.replace(/^\.\//, "").replace(/\/$/, ""),
      sealed: false,
      seal: null,
    })
  : estate.at(-1);

const trancheAbs = resolve(REPO, tranche.rel);
if (!existsSync(trancheAbs)) fatal(`tranche folder missing: ${tranche.rel}`);

// Inputs are located BEFORE the corpus is assembled — they are excluded from it, since a row set
// that cites itself discharges nothing. Nothing is read yet: the structural guards below have to be
// reachable in the order the header advertises, which is why the old `waves/` guard was dead code.
const inputRels = INPUT_SHAPES.map((shape) => join(tranche.rel, shape)).filter((rel) =>
  existsSync(resolve(REPO, rel)),
);
if (inputRels.length === 0)
  fatal(
    `${tranche.rel} carries none of the audited row-set shapes:\n  ` +
      INPUT_SHAPES.join("\n  ") +
      `\nA tranche with no row set has nothing to diff.`,
  );

// corpus — the tranche's waves and its root records, plus the living ledger
const wavesDir = join(trancheAbs, "waves");
const trancheMd = [
  ...(existsSync(wavesDir)
    ? readdirSync(wavesDir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => join(wavesDir, f))
    : []),
  ...readdirSync(trancheAbs)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => join(trancheAbs, f)),
].filter((abs) => !inputRels.includes(relative(REPO, abs)));

if (trancheMd.length === 0)
  fatal(
    `${tranche.rel} contributes no corpus files (no waves/*.md, no root *.md outside its row sets).` +
      ` A corpus of the ledger alone would let the record discharge itself.`,
  );

let corpusAbs = [...trancheMd];
const ledgerAbs = resolve(REPO, LEDGER);
if (existsSync(ledgerAbs)) corpusAbs.push(ledgerAbs);
else if (opts.requireLedger || opts.assertState || opts.verifyCites || opts.ownerBlock)
  fatal(`${LEDGER} is absent, and the arms requested read it`);

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

// inputs, parsed
const ID_CELL = idCellPattern(ROW_FAMILIES);
const inputs = [];
for (const rel of inputRels) {
  const rows = dedupe(readRows(resolve(REPO, rel), rel, ID_CELL));
  if (rows.length === 0)
    fatal(`${rel} parsed to zero rows of ${ROW_FAMILIES.join("/")} — format drift`);
  inputs.push({ file: rel, rows });
}

const allInputRows = dedupe(inputs.flatMap((i) => i.rows));
const chronicRows = allInputRows.filter((r) => r.id.startsWith("CH-"));
const matrixRows = allInputRows.filter((r) => !r.id.startsWith("CH-"));

// each matrix row's own disposition cell — the LAST cell where the table carries one
for (const row of matrixRows) {
  if (row.id.startsWith("PR-")) {
    row.disposition = row.cells.at(-1) ?? "";
    row.selfTerminal = isTerminalCell(row.disposition);
  } else if (row.id.startsWith("S-")) {
    row.disposition = row.cells[2] ?? "";
    row.selfTerminal = row.disposition.replace(/\*/g, "").trim().length > 0;
  } else {
    row.disposition = "";
    row.selfTerminal = false; // a proposed owning wave is not a disposition
  }
  const RANGE = rangePattern(ROW_FAMILIES);
  const TOKEN = tokenPattern(ROW_FAMILIES);
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

// scan the corpus
const citations = new Map(); // id → [{file, line}]
const scopeRefs = [];
for (const abs of corpusAbs) {
  const rel = relative(REPO, abs);
  const { found, ranges } = idsInText(readFileSync(abs, "utf8"), ROW_FAMILIES);
  for (const hit of found) {
    if (!citations.has(hit.id)) citations.set(hit.id, []);
    citations.get(hit.id).push({ file: rel, line: hit.line });
  }
  for (const range of ranges) scopeRefs.push({ ...range, file: rel });
}

function siteOf(id) {
  const first = citations.get(id)?.[0];
  return first ? `${first.file}:${first.line}` : "";
}

// resolve: R1 corpus, R2 self, R3 delegated
const verdicts = new Map();
const allRows = [...chronicRows, ...matrixRows];
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
const orphans = allRows.filter((row) => !verdicts.has(row.id));

// the ledger and its arms
const io = realIo(trackedFiles());
const ledger = existsSync(ledgerAbs)
  ? parseLedger(readFileSync(ledgerAbs, "utf8"), LEDGER)
  : null;
if (ledger && ledger.rows.length === 0)
  fatal(`${LEDGER} parsed to zero rows — format drift in the living ledger`);

// --owner-block emits and leaves; a generator that exits nonzero cannot be piped into a record
if (opts.ownerBlock) {
  const block = ownerBlock(ledger);
  const lines = [
    `<!-- derived: node scripts/ledger-diff.mjs --owner-block · ${LEDGER} · ${new Date().toISOString()} -->`,
    "",
    "| Row | State | Owner | Trigger | Cite |",
    "|---|---|---|---|---|",
    ...block.map(
      (r) => `| ${r.id} | ${r.state} | ${r.owner} | ${r.trigger} | \`${r.cite}\` |`,
    ),
  ];
  process.stdout.write(`${lines.join("\n")}\n`);
  process.exit(0);
}

const findings = [];
const armRuns = [];
if (opts.assertState) {
  const model = {
    ledger,
    tranches: estate,
    currentNum: tranche.num,
    probes: PROBES,
    io,
  };
  for (const [name, fn] of [
    ["TERMINALITY", armTerminality],
    ["PROBE", armProbes],
    ["DUPLICATE", armDuplicateHomes],
  ]) {
    const hits = fn(model);
    armRuns.push([name, hits]);
    findings.push(...hits.map((h) => ({ ...h, arm: name })));
  }
}
if (opts.verifyCites) {
  const hits = armCites({ ledger, io });
  armRuns.push(["CITES", hits]);
  findings.push(...hits.map((h) => ({ ...h, arm: "CITES" })));
}

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

const armNames = [
  "ORPHAN",
  ...(opts.assertState ? ["TERMINALITY", "PROBE", "DUPLICATE"] : []),
  ...(opts.verifyCites ? ["CITES"] : []),
];

say(`ledger-diff — ${tranche.name} disposition completeness + ledger currency`);
say("=".repeat(78));
say(`generated   ${new Date().toISOString()}`);
say(`node        ${process.version}`);
say(`repo HEAD   ${head}`);
say(
  `tranche     ${tranche.rel}  (${tranche.sealed ? `SEALED · ${tranche.seal}` : "open"})`,
);
say(`arms        ${armNames.join(" · ")}`);
say(
  `mode        ${opts.requireLedger ? "require-ledger (W-GATE)" : "dry-run"}${
    excluded.length ? " · CANARY" : ""
  }${opts.selfTest ? " · SELF-TEST" : ""}`,
);
say();

say("THE ESTATE (sealed = a close record on disk)");
for (const t of estate)
  say(
    `  ${t.rel.padEnd(34)} ${t.sealed ? `SEALED  ${t.seal}` : "open"}${t.num === tranche.num ? "   ← this tranche" : ""}`,
  );
say();

say(`CORPUS (${corpusAbs.length} files)`);
for (const abs of corpusAbs) say(`  ${relative(REPO, abs)}  ${statSync(abs).size} B`);
if (excluded.length) {
  say(`EXCLUDED by --canary-exclude (${excluded.length})`);
  for (const abs of excluded) say(`  ${relative(REPO, abs)}`);
}
say();

say("INPUTS (excluded from the corpus — a row set cannot cite itself terminal)");
for (const input of inputs) {
  const byPrefix = new Map();
  for (const row of input.rows) {
    const prefix = row.id.slice(0, row.id.indexOf("-") + 1);
    byPrefix.set(prefix, (byPrefix.get(prefix) ?? 0) + 1);
  }
  say(`  ${input.file}`);
  say(
    `    ${input.rows.length} row ids  (${[...byPrefix].map(([p, n]) => `${n} ${p}nn`).join(" + ")})`,
  );
}
say(
  `  ${scopeRefs.length} range expressions in the corpus, read as scope, not citation`,
);
if (opts.verbose)
  for (const range of [
    ...new Set(scopeRefs.map((r) => `${r.file}:${r.line}  ${r.text}`)),
  ])
    say(`    ${range}`);
say();

if (ledger) {
  say(`LIVING LEDGER  ${LEDGER}`);
  for (const s of ledger.sections)
    say(
      `  §${s.num} ${s.title.slice(0, 46).padEnd(48)} ${String(s.rows.length).padStart(3)} rows${
        s.num === ledger.openNum ? "   ← open" : ""
      }`,
    );
  say();
}

say("SATISFACTION (ORPHAN arm)");
for (const route of ["CORPUS", "SELF", "DELEGATED"])
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

for (const [name, hits] of armRuns) {
  say(`${name} — ${hits.length ? `${hits.length} finding(s)` : "clean"}`);
  for (const hit of hits) {
    say(`  ${hit.id.padEnd(7)} ${hit.where}`);
    say(`          ${hit.why}`);
  }
  say();
}

let vacuous = [];
if (opts.selfTest) {
  say("SELF-TEST — each arm against a synthetic violation and its conformant control");
  vacuous = selfTest(say);
  say();
}

const total = orphans.length + findings.length + vacuous.length;

if (vacuous.length) {
  say(`VACUOUS ARMS (${vacuous.length})`);
  for (const v of vacuous) say(`  ${v}`);
  say();
}

say("VERDICT");
if (total === 0)
  say(
    `  GREEN — ${allRows.length} audited rows present-or-cited; ${ledger ? ledger.open.length : 0} ` +
      `open ledger rows current under ${armNames.join(" · ")}. exit 0`,
  );
else {
  const parts = [];
  if (orphans.length) parts.push(`${orphans.length} orphan`);
  for (const [name, hits] of armRuns)
    if (hits.length) parts.push(`${hits.length} ${name}`);
  if (vacuous.length) parts.push(`${vacuous.length} VACUOUS`);
  say(`  RED — ${parts.join(" · ")}. exit 1`);
}

process.stdout.write(`${out.join("\n")}\n`);
process.exit(total ? 1 : 0);
