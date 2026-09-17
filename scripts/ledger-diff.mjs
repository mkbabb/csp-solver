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
//   FREEZE        (always) that same diff re-run over every SEALED tranche, each against its OWN
//                 tranche-time corpus. A lawful restamp of the living ledger can orphan a sealed
//                 tranche's row, and nothing re-reads a sealed tranche — BAL-03 sat RED, unseen,
//                 for two closes (PRECEPTS §2, the freeze law).
//   TERMINALITY   (--assert-state) a LEDGER §1 row whose STATE names a wave of a SEALED tranche
//                 has outlived its landing. A wave that seals without its row moving is exactly
//                 the ledger-accretion disease (T7-R04).
//   FOLD-TARGET   (--assert-state) every wave any row names resolves to a wave record in the
//                 tranche it names. A fold into a wave that never existed discharged nothing.
//   PROBE         (--assert-state) a LEDGER row — open or terminal — whose claim a registered
//                 one-line probe refutes. The probes read the TREE, never the record.
//   DUPLICATE     (--assert-state) an id tabled twice anywhere in the ledger. A row has one home.
//   ONE-HOME      (--assert-state) a row that is not a registered class's home, does not name that
//                 home, and carries the class's own subject: a sibling mint (PRECEPTS §2).
//   LIVE-REGION   (--assert-state) an `aria-live` region born under `v-if` with non-empty initial
//                 content never speaks. A static scan of web/frontend/src; W3's rider.
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
//   whichever tranche is newest and TRACKED (or `--tranche`); "sealed" is the existence of a close
//   record in one of its known shapes; "open" is the ledger's FIRST numbered section and "terminal"
//   is every later one. Restamp a row, move it, or renumber the table and the arms follow.
//
//   Three registries are the deliberate exception, because each names a subject no structure can
//   infer: PROBES (row id → a one-line tree read), CLASS_HOMES (a chronic class's one home and its
//   subject), LIVE_REGION_ADMITTED (the live-region sites that violate today, with their cure).
//   Every one of them is an exact-match census that reds in BOTH directions — an entry that stops
//   matching is a finding, not a silent no-op.
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

/** Every TRACKED `*tranche-<n>` directory, ordered by its own number so `tranche-10` sorts
 *  after `-9`.
 *  Sealing is inherited forward: the early tranches closed inside their READMEs and left no
 *  record in any of the shapes above, but a tranche whose successor sealed cannot still be open,
 *  so a later seal seals it. The rule needs no filename and maintains itself.
 *
 *  TRACKED is the whole corpus law (T9-W5 §5.1, V5-C6). The estate was read off the DISK, so
 *  the newest tranche was whatever directory existed — and a scaffold nobody had committed yet
 *  became the corpus the moment it was created. An empty one made this script exit 2 FATAL
 *  ("contributes no corpus files"), which `scripts/deploy-gated.sh` reads as a stale record and
 *  refuses the deploy on: a `mkdir` in docs/ could stop a release. It is not hypothetical —
 *  T9's own formation scaffold did exactly that on 2026-08-10 (recap-matrix.md:124, lane note
 *  e). `git ls-files` is the arbiter: a tranche joins the estate when its record is committed,
 *  which is also when anyone else can see it. */
function trancheEstate() {
  const root = resolve(REPO, TRANCHES);
  if (!existsSync(root)) fatal(`no tranche root: ${TRANCHES}`);
  const tracked = trackedFiles();
  const isTracked = (name) => tracked.some((f) => f.startsWith(`${TRANCHES}/${name}/`));
  const found = readdirSync(root)
    .map((name) => ({ name, num: /tranche-(\d+)$/.exec(name)?.[1] }))
    .filter(
      (t) =>
        t.num !== undefined &&
        statSync(join(root, t.name)).isDirectory() &&
        isTracked(t.name),
    )
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
//
// "Current" is the newest tranche in the estate, never `--tranche`'s argument. `--tranche` chooses
// the CORPUS a completeness diff runs against; it does not move the living ledger into another era,
// and reading it that way made a `--tranche <sealed>` run resolve today's bare `W8` against a
// tranche that closed two campaigns ago.

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
// row asserts? A refuted row is a false record, and false records red. Probes are one-liners on
// purpose — a probe with a branch is a second implementation of the claim.
//
// THE VACANCY, named because V5-C9 adjusted the arm to "stands, populates on registration": at
// T9-W5 the registry held exactly one entry, CH-16, and CH-16 had CLOSED at T7-W0 — so the arm ran
// over §1's four open rows, matched none of them, and returned clean without ever reading the tree.
// Structurally sound, vacuous by population. Two registrations cure it, and the arm's scope widens
// from §1 to EVERY row so a registration outlives its row's closure (below).
//
// THE VACANCY THAT REMAINS, named rather than papered — §1's other three rows carry no probe
// because no tree read answers them:
//   CH-65   PRM emulation void under a Playwright runner. The claim is about what an option does
//           to a live page; the tree cannot say. Its trigger is a golden mint, not a grep.
//   T8-R05  desktop-Safari generation latency. A timing claim wants a run on a device this estate
//           does not have (M19/M06); W8's owner pass is its evaluator.
//   T8-R08  bounded multiplayer leaks. The claim is about a session's runtime credit ledger — a
//           repro, not a file.
// A probe registered for any of these would be a grep pretending to be a measurement.

const PROBES = {
  // CH-16 closed on the claim that BOTH halves landed. A closed row whose cure was reverted is the
  // same disease pointing the other way (T8-R13/R15 were exactly that), so the probe is re-polarised
  // to guard the closure rather than to refute the old UNWIRED claim: every game spec carries the
  // shared codec, or the row's "wired in all five game specs" is no longer true.
  "CH-16": {
    claim: "the `?board=` permalink half is wired in EVERY game spec (`78448760`)",
    run(io) {
      const dir = "web/frontend/src/games";
      const specs = io
        .list(dir)
        .map((g) => `${dir}/${g}/spec.ts`)
        .filter((p) => io.read(p) !== null);
      const wired = specs.filter((p) => io.read(p).includes("urlCodec"));
      return {
        refuted: specs.length === 0 || wired.length !== specs.length,
        note: `urlCodec present in ${wired.length}/${specs.length} of ${dir}/*/spec.ts`,
      };
    },
  },
  // CH-69's trigger FIRED and the registration was re-aimed at the cure (T9-W6, 2026-08-28).
  //
  // It used to mechanise the trigger — "T9-W6 takes the root-cause, or any Hard-tier uniqueness test
  // lands first" — by reading the exposure, that `dealt_killer_boards_are_unique_by_construction`
  // swept Easy/Medium only. W6 landed both arms at once, so that claim is spent: a probe held to it
  // is a permanent RED that says nothing, the vacuity this arm exists to refuse. What is still
  // falsifiable is the GUARD. The unsound over-prune was invisible for four tranches because no
  // value-slack scope was under test, and it becomes invisible again the moment either test leaves:
  // Hard is the tier that digs to 17 givens where the bogus UNSAT bit, and the zero-solutions
  // regression is the only row that asserts a provably-completable board never solves to zero.
  // Deleting either is how this row comes back, so deleting either is what turns it red.
  "CH-69": {
    claim:
      "the killer soundness cure is GUARDED in csp-solver/tests/killer.rs — Hard rides the " +
      "uniqueness sweep and the zero-solutions regression stands",
    run(io) {
      const sweep = "fn dealt_killer_boards_are_unique_by_construction";
      const regression = "fn a_satisfiable_killer_board_never_solves_to_zero";
      const src = io.read("csp-solver/tests/killer.rs") ?? "";
      const chunk = src.split("\n#[test]").find((part) => part.includes(sweep)) ?? "";
      const hard = chunk.includes("Difficulty::Hard");
      const guarded = src.includes(regression);
      const gone = [
        chunk
          ? hard
            ? null
            : "the uniqueness sweep no longer names Difficulty::Hard"
          : `csp-solver/tests/killer.rs carries no ${sweep}`,
        guarded ? null : `csp-solver/tests/killer.rs carries no ${regression}`,
      ].filter(Boolean);
      return {
        refuted: gone.length > 0,
        note: gone.length
          ? `${gone.join("; ")} — the cure is unguarded and the over-prune returns unseen`
          : "both guards stand (csp-solver/tests/killer.rs)",
      };
    },
  },
};

// ── the class registry (the one-home law) ───────────────────────────────────────────────────────
//
// PRECEPTS §2: "a fired class adds evidence to its OWN row and never mints a sibling." CH-64 is the
// worked example and the reason the law exists — it fired three times and produced three new rows,
// and by the third nobody could say what the class still asserted. Its deciding ceremony (T9-W0)
// retired it to one home and preserved the detector in-row, in the row's own words: "a multi-red
// burst in any local full-suite run re-opens ON THIS ROW — never a sibling."
//
// The arm reads the ledger for the class's SUBJECT and asks who is carrying it. A row that names
// the home is a pointer ("a pointer at CH-16, CH-53 or CH-59 is a pointer, not a second row", §6's
// own preamble). A row that carries the subject and names no home is a mint, whatever id it wears —
// which is the half PRECEPTS §2 records as having "no arm yet; it is T9-W5's".
//
// `pointers` is the exact-match escape for a row that must discuss the class without naming it. It
// is EMPTY at HEAD and that is a measurement: `burst` occurs on exactly one line of LEDGER.md.

const CLASS_HOMES = {
  "CH-64": {
    label: "the runner-side multi-red burst class",
    subject:
      /\b(multi-red|red burst|burst class)\b|\bburst\b[^|]{0,80}\breds?\b|\breds?\b[^|]{0,80}\bburst\b/i,
    pointers: [],
  },
};

// ── the live-region police (W3's rider) ─────────────────────────────────────────────────────────
//
// A live region announces MUTATIONS to itself. Born under `v-if` with its content already inside,
// it enters the document complete — there is no mutation to announce, and the region's whole office
// goes unperformed while the markup reads correct. `players-status` is the estate's own worked
// example: the T7-W2 comment at its own site says the region "is `v-if`'d OUT the moment the room
// comes up — the live region left the DOM exactly when people started arriving."
//
// The rule, exactly: an element whose OWN tag carries `aria-live` (or role status/alert/log) AND a
// birth condition (`v-if`/`v-else-if`/`v-else`/`v-show`) AND non-empty initial content — literal
// text, after interpolations and conditional children are stripped, since neither is present at
// birth. A region that lives unconditionally with conditional content inside is the CORRECT idiom
// and stays green (`MarginNote.vue`, `gallery-live`).
//
// ADMITTED: EMPTY, and it is empty the way this arm was designed to make it empty. W5 booked two
// sites here — `players-status` and `players-alone`, both born under `v-if` holding their own
// sentences — because the cure was W3's to write and web/frontend/src was outside the lane that
// wrote the detector. The admission was a ratchet, not a shrug: printed in full on every run, an
// unadmitted site REDs on contact, and an admission whose site stops violating REDs as SPENT.
// T9-W3 §3.4 cured all three well regions onto `useLiveRegion` (the roster included — its 0→1
// case was never admissible, it just wasn't statically visible), the SPENT arm went red on the
// same tree, and these entries came out with it: the cure and the deletion of its admission in
// one commit, which is this estate's same-commit law. The list stays here, empty, because the
// next occurrence must have to be WRITTEN DOWN by whoever admits it.
//
// The frontend now carries the same rule as its own gate (`web/frontend/scripts/check-live-
// regions.mjs`), which is where a src defect belongs; this arm stays because the record
// instrument must be able to see a src defect that a frontend lane could be skipped over.

const LIVE_REGION_ROOT = "web/frontend/src";
const LIVE_REGION_ADMITTED = [];

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

/** Every wave any row names resolves to a wave record in the tranche it names.
 *
 *  Scope is the whole row line, not the state cell: the ledger's 2-column tables (§4, §5) carry
 *  their disposition in the only cell they have, so a state-scoped arm cannot see U-11's fold at
 *  all. The subject is the citation, wherever the row writes it.
 *
 *  This is the arm that makes the dead-state FOLDED rows visible. Eighteen of them wear a bare
 *  landing promise into a tranche that has since sealed, they live in terminal sections where the
 *  §1-scoped currency arms never looked, and the estate's own restamp passes have already caught
 *  two folds that sealed with nothing landed (P-5e's SSIM probe, CH-53's sampler). A fold naming a
 *  wave that never existed discharged nothing at all, and that is what this reds on. */
function armFoldTargets({ ledger, tranches, currentNum, io }) {
  const byNum = new Map(tranches.map((t) => [t.num, t]));
  const waves = new Map();
  const listOf = (t) => {
    if (!waves.has(t.num)) waves.set(t.num, io.list(`${t.rel}/waves`));
    return waves.get(t.num);
  };
  const found = [];
  for (const row of ledger.rows)
    for (const ref of waveRefs(row.text, currentNum)) {
      const tranche = byNum.get(ref.tranche);
      const key = `W${/^W(GATE|\d+)/.exec(ref.label.replace(/^T\d+-/, ""))?.[1] ?? ""}`;
      const files = tranche ? listOf(tranche) : [];
      const hit = files.find(
        (f) =>
          f.startsWith(`T${ref.tranche}-${key}-`) ||
          f.startsWith(`${key}-`) ||
          f === `T${ref.tranche}-${key}.md` ||
          f === `${key}.md`,
      );
      if (hit) continue;
      found.push({
        id: row.id,
        where: `${row.file}:${row.line}`,
        why: !tranche
          ? `names ${ref.label}, and no docs/tranches/*tranche-${ref.tranche} is in the estate — the fold has no home.`
          : files.length === 0
            ? `names ${ref.label}, and ${tranche.rel} keeps no waves/ directory — the target cannot be shown to exist.`
            : `names ${ref.label}, and ${tranche.rel}/waves holds no ${key} record (${files.length} waves). A fold into a wave that never was discharged nothing.`,
      });
    }
  return found;
}

/** A registered one-line probe refutes a row's claim.
 *
 *  Scope is EVERY row, not §1. A probe keyed to a row that later closes would otherwise fall silent
 *  at the exact moment it becomes a regression detector — and a closed row whose cure was reverted
 *  is the same record-cannot-verify-record disease pointing the other way (T8-R13 and T8-R15 were
 *  both closed rows whose subject came back). The probe's own claim carries the polarity. */
function armProbes({ ledger, probes, io }) {
  const found = [];
  const homed = new Set();
  for (const row of ledger.rows) {
    const probe = probes[row.id];
    if (!probe) continue;
    homed.add(row.id);
    const verdict = probe.run(io);
    if (!verdict.refuted) continue;
    found.push({
      id: row.id,
      where: `${row.file}:${row.line}`,
      why:
        `§${row.section} row asserts ${probe.claim}; the tree refutes it — ${verdict.note}. The ` +
        `record cannot verify the record: move the row or correct the claim.`,
    });
  }
  // A registration keyed to a row that no longer exists is the vacuity V5-C9 named, wearing a
  // registry entry: the arm reads clean because it read nothing.
  for (const id of Object.keys(probes))
    if (!homed.has(id))
      found.push({
        id,
        where: "PROBES registry",
        why: `a probe is registered for ${id}, and ${ledger.file} tables no such row — the registration reads nothing and cannot fail.`,
      });
  return found;
}

/** One id, two homes — anywhere in the ledger, not open-versus-terminal alone. A row re-tabled
 *  into a second terminal section is the same defect wearing a quieter costume: two states, two
 *  cites, and no way to say which one a close reads. */
function armDuplicateHomes({ ledger }) {
  const homes = new Map();
  for (const row of ledger.rows) {
    if (!homes.has(row.id)) homes.set(row.id, []);
    homes.get(row.id).push(row);
  }
  const found = [];
  for (const rows of homes.values()) {
    if (rows.length < 2) continue;
    const [first, ...rest] = rows;
    found.push({
      id: first.id,
      where: `${first.file}:${first.line}`,
      why:
        `also tabled at ${rest.map((r) => `§${r.section} (${r.file}:${r.line})`).join(", ")}. ` +
        `A row has one home.`,
    });
  }
  return found;
}

/** The one-home law's sibling-mint half: a row carrying a registered class's subject that is
 *  neither the class's home nor a pointer at it. */
function armOneHome({ ledger, classes }) {
  const found = [];
  for (const [home, klass] of Object.entries(classes)) {
    if (!ledger.rows.some((r) => r.id === home))
      found.push({
        id: home,
        where: "CLASS_HOMES registry",
        why: `a class home is registered for ${home}, and ${ledger.file} tables no such row — the law has nothing to bind to.`,
      });
    for (const row of ledger.rows) {
      if (row.id === home || klass.pointers.includes(row.id)) continue;
      if (!klass.subject.test(row.text)) continue;
      if (row.text.includes(home)) continue;
      found.push({
        id: row.id,
        where: `${row.file}:${row.line}`,
        why:
          `carries the subject of ${klass.label}, whose one home is ${home}, and names neither ` +
          `${home} nor a registered pointer. A fired class appends to its own row under a dated ` +
          `stamp; a new id for the same class is re-booking wearing a fresh number (PRECEPTS §2).`,
      });
    }
  }
  return found;
}

// ── the live-region police ──────────────────────────────────────────────────────────────────────

const LIVE_ATTR = /\baria-live\s*=/;
const LIVE_ROLE = /\brole\s*=\s*(["'])(?:status|alert|log)\1/;
const BIRTH_COND = /\bv-(?:if|else-if|else|show)\b/;
// A FACTORY, never a shared instance: `initialContent` runs inside `liveRegionSites`'s own scan,
// and one `g`-flagged regex driving two nested walks resets the outer `lastIndex` forever.
const openTags = () => /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;

/** From `from` (just past `<tag …>`), that tag's inner slice and the index after its close. */
function blockFrom(src, tag, from) {
  const scan = new RegExp(`<${tag}\\b[^>]*?(/?)>|</${tag}\\s*>`, "g");
  scan.lastIndex = from;
  for (let depth = 1, m; (m = scan.exec(src));) {
    if (m[0].startsWith("</")) {
      if (--depth === 0)
        return { inner: src.slice(from, m.index), end: scan.lastIndex };
    } else if (m[1] !== "/") depth++;
  }
  return { inner: src.slice(from), end: src.length };
}

/** What is inside a region AT BIRTH: literal text only. Interpolations resolve after mount and
 *  conditional children are not there yet, so both come out before the question is asked. */
function initialContent(inner) {
  let html = inner.replace(/<!--[\s\S]*?-->/g, " ").replace(/\{\{[\s\S]*?\}\}/g, " ");
  for (let guard = 0; guard < 64; guard++) {
    const tag = openTags();
    let hit = null;
    for (let m; (m = tag.exec(html));)
      if (BIRTH_COND.test(m[2])) {
        hit = m;
        break;
      }
    if (!hit) break;
    const past = hit.index + hit[0].length;
    const end = hit[3] === "/" ? past : blockFrom(html, hit[1], past).end;
    html = html.slice(0, hit.index) + html.slice(end);
  }
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every `aria-live` region in the scanned tree that is born under a condition WITH its content
 *  already inside. Returns the census; the arm grades it against the admissions. */
function liveRegionSites(io) {
  const sites = [];
  for (const file of io.files(LIVE_REGION_ROOT, ".vue")) {
    const src = io.read(file) ?? "";
    const from = src.indexOf("<template");
    const last = src.lastIndexOf("</template>");
    if (from < 0 || last <= from) continue;
    const tpl = src.slice(from, last);
    const tag = openTags();
    for (let m; (m = tag.exec(tpl));) {
      const attrs = m[2];
      if (m[3] === "/") continue;
      if (!LIVE_ATTR.test(attrs) && !LIVE_ROLE.test(attrs)) continue;
      if (!BIRTH_COND.test(attrs)) continue;
      const content = initialContent(blockFrom(tpl, m[1], m.index + m[0].length).inner);
      if (!content) continue;
      sites.push({
        file,
        line: src.slice(0, from + m.index).split("\n").length,
        attrs: attrs.replace(/\s+/g, " ").trim(),
        content: content.slice(0, 64),
      });
    }
  }
  return sites;
}

function armLiveRegions({ io, admitted }) {
  const sites = liveRegionSites(io);
  const spent = new Set(admitted.map((_, i) => i));
  const found = [];
  for (const site of sites) {
    const at = admitted.findIndex(
      (a) => a.file === site.file && site.attrs.includes(a.anchor),
    );
    if (at >= 0) {
      spent.delete(at);
      continue;
    }
    found.push({
      id: "LIVE-REGION",
      where: `${site.file}:${site.line}`,
      why:
        `\`aria-live\` born under a condition with "${site.content}" already inside — the region ` +
        `enters the document complete, so there is no mutation to announce and it never speaks. ` +
        `Let the region live unconditionally and make its CONTENT the conditional half.`,
    });
  }
  for (const i of spent)
    found.push({
      id: "ADMISSION",
      where: `${admitted[i].file}  ${admitted[i].anchor}`,
      why:
        `admission SPENT — the site no longer violates, so the admission is a carve-out over ` +
        `nothing. Delete it in the commit that cured the site (${admitted[i].cure}).`,
    });
  return found;
}

/** The freeze law's findings, as a pure function of the sweep so the fixture can hand it one. */
function armFreeze({ sweep }) {
  return sweep
    .filter((r) => !r.skipped)
    .flatMap((r) =>
      r.orphans.map((row) => ({
        id: row.id,
        where: `${row.file}:${row.line}`,
        why:
          `${r.tranche.rel} is SEALED (${r.tranche.seal}) and this row of its own audited set now ` +
          `reaches no disposition in its tranche-time corpus. A later restamp took the token with ` +
          `it — BAL-03's class. Correct it in ${LEDGER} with a link, never by editing the sealed ` +
          `record (PRECEPTS §2, the freeze law).`,
      })),
    );
}

// ── cites ───────────────────────────────────────────────────────────────────────────────────────
//
// Scope: the open section, plus terminal rows still under WATCH — the rows a close actually reads.
//
// SCOPE HELD at T9-W5, and the decision is a measurement rather than a preference. Widened to all
// 171 rows the arm produces four findings and three of them are artifacts of the terminal register:
// CH-12 QUOTES the dead cite `error.rs:63-64` as the very defect its restamp names, and reds for
// documenting its own correction; its `CspError::aborted` cite resolves to the constructor while
// the literal token lives on the doc line five above; CH-53's `desktop.undoBurst.ciMinPctOfCeiling`
// is a JSON path, not a token that appears anywhere as written. An arm that punishes the freeze
// law's dated-block idiom is an arm that teaches people to stop writing the correction down. The
// currency widening lands on FOLD-TARGET, DUPLICATE, ONE-HOME and PROBE, which have no such register
// problem; this one keeps the rows a close actually reads.
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
    /** The TRACKED files under a prefix — the live-region police scans what is shipped, never a
     *  stray working copy or a build artifact that happens to sit under src/. */
    files(prefix, ext) {
      return trackedFiles.filter((f) => f.startsWith(`${prefix}/`) && f.endsWith(ext));
    },
    resolve(path) {
      if (trackedFiles.includes(path)) return { path, matches: [path] };
      const matches = bySuffix.get(`/${path}`) ?? [];
      return { path: matches[0] ?? null, matches };
    },
  };
}

let TRACKED = null;
/** `git ls-files`, read once and shared: the cite arm resolves against it, and so does the
 *  corpus law in `trancheEstate` (T9-W5 V5-C6). */
function trackedFiles() {
  if (TRACKED) return TRACKED;
  try {
    TRACKED = execFileSync("git", ["-C", REPO, "ls-files"], {
      encoding: "utf8",
      maxBuffer: 64 << 20,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
    return TRACKED;
  } catch {
    fatal("git ls-files failed — the cite arm resolves against the tracked set");
  }
}

// ── self-test: every arm shown able to red ──────────────────────────────────────────────────────

const fixtureLedger = (openRows, terminalRows = []) => {
  const open = openRows.map((r, i) => ({
    file: "FIXTURE.md",
    line: i + 1,
    section: 1,
    state: "",
    body: "",
    text: "",
    ...r,
  }));
  const terminal = terminalRows.map((r, i) => ({
    file: "FIXTURE.md",
    line: 100 + i,
    section: 2,
    state: "",
    body: "",
    text: "",
    ...r,
  }));
  // `rows` is the union, not an empty stub: the widened arms read it, and a fixture that hands them
  // nothing would grade every one of them GREEN for the wrong reason.
  return {
    file: "FIXTURE.md",
    openNum: 1,
    sections: [],
    rows: [...open, ...terminal],
    open,
    terminal,
  };
};

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
  files: (prefix, ext) =>
    Object.keys(files)
      .filter((f) => f.startsWith(`${prefix}/`) && f.endsWith(ext))
      .sort(),
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

/** A synthetic estate that keeps wave records, for FOLD-TARGET's fixture. */
const FIXTURE_WAVE_IO = fixtureIo({
  "x/fixture-tranche-1/waves/T1-W2-a-real-wave.md": "#",
  "x/fixture-tranche-2/waves/W3-another.md": "#",
});

/** The two shapes the live-region police grades: the defect, and the correct idiom it must not
 *  fire on — an unconditional region whose CONTENT is the conditional half. */
const FIXTURE_LIVE_BAD = fixtureIo({
  "web/frontend/src/Fixture.vue":
    '<template>\n  <p v-if="pending" aria-live="polite">connecting…</p>\n</template>\n',
});
const FIXTURE_LIVE_GOOD = fixtureIo({
  "web/frontend/src/Fixture.vue":
    '<template>\n  <p aria-live="polite" role="status">\n    <span v-if="text">{{ text }}</span>\n  </p>\n  <div v-if="open" class="not-a-region">connecting…</div>\n</template>\n',
});

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
    "the registered CH-16 probe fires when a game spec loses the shared codec its closure claims",
    armProbes,
    {
      ledger: fixtureLedger([], [{ id: "CH-16", state: "CLOSED-landed" }]),
      probes: { "CH-16": PROBES["CH-16"] },
      io: fixtureIo({
        "web/frontend/src/games/a/spec.ts": "export const urlCodec = 1",
        "web/frontend/src/games/b/spec.ts": "no codec here",
      }),
    },
    {
      ledger: fixtureLedger([], [{ id: "CH-16", state: "CLOSED-landed" }]),
      probes: { "CH-16": PROBES["CH-16"] },
      io: fixtureIo({
        "web/frontend/src/games/a/spec.ts": "export const urlCodec = 1",
        "web/frontend/src/games/b/spec.ts": "export const urlCodec = 2",
      }),
    },
  ],
  [
    "PROBE/registration",
    "a probe is registered for a row the ledger no longer tables",
    armProbes,
    {
      ledger: fixtureLedger([{ id: "FX-10" }]),
      probes: { "CH-99": { claim: "…", run: () => ({ refuted: false, note: "" }) } },
      io: fixtureIo({}),
    },
    {
      ledger: fixtureLedger([{ id: "CH-99" }]),
      probes: { "CH-99": { claim: "…", run: () => ({ refuted: false, note: "" }) } },
      io: fixtureIo({}),
    },
  ],
  [
    "PROBE/CH-69",
    "the registered CH-69 probe fires when either guard leaves csp-solver/tests/killer.rs",
    armProbes,
    {
      // The sweep drops back to Easy/Medium and the regression is gone with it — Hard named in
      // some other test does not guard the tier, which is the discrimination the arm has to make.
      ledger: fixtureLedger([{ id: "CH-69", state: "CURED" }]),
      probes: { "CH-69": PROBES["CH-69"] },
      io: fixtureIo({
        "csp-solver/tests/killer.rs":
          "#[test]\nfn dealt_killer_boards_are_unique_by_construction() {\n  for &d in &[Difficulty::Easy, Difficulty::Medium] {}\n}\n" +
          "#[test]\nfn something_else_entirely() { Difficulty::Hard; }\n",
      }),
    },
    {
      ledger: fixtureLedger([{ id: "CH-69", state: "CURED" }]),
      probes: { "CH-69": PROBES["CH-69"] },
      io: fixtureIo({
        "csp-solver/tests/killer.rs":
          "#[test]\nfn dealt_killer_boards_are_unique_by_construction() {\n  for &d in &[Difficulty::Easy, Difficulty::Medium, Difficulty::Hard] {}\n}\n" +
          "#[test]\nfn a_satisfiable_killer_board_never_solves_to_zero() {}\n",
      }),
    },
  ],
  [
    "FOLD-TARGET",
    "a row folds into a wave its tranche never had",
    armFoldTargets,
    {
      ledger: fixtureLedger(
        [],
        [{ id: "FX-09", text: "| FX-09 | FOLDED → T1-W9 | … |" }],
      ),
      tranches: FIXTURE_TRANCHES,
      currentNum: 2,
      io: FIXTURE_WAVE_IO,
    },
    {
      ledger: fixtureLedger(
        [],
        [{ id: "FX-09", text: "| FX-09 | FOLDED → T1-W2 | … |" }],
      ),
      tranches: FIXTURE_TRANCHES,
      currentNum: 2,
      io: FIXTURE_WAVE_IO,
    },
  ],
  [
    "DUPLICATE",
    "one id is tabled twice — open and terminal, or twice terminal",
    armDuplicateHomes,
    { ledger: fixtureLedger([{ id: "FX-03" }], [{ id: "FX-03" }, { id: "FX-04" }]) },
    { ledger: fixtureLedger([{ id: "FX-03" }], [{ id: "FX-04" }, { id: "FX-05" }]) },
  ],
  [
    "ONE-HOME",
    "a new id carries a registered class's subject and names no home",
    armOneHome,
    {
      ledger: fixtureLedger(
        [
          {
            id: "CH-68",
            text: "| CH-68 | OPEN | a multi-red burst on the runner, 3 reds in one settled-head run |",
          },
        ],
        [{ id: "CH-64", text: "| CH-64 | RETIRED | the burst class, one home |" }],
      ),
      classes: CLASS_HOMES,
    },
    {
      ledger: fixtureLedger(
        [
          {
            id: "CH-68",
            text: "| CH-68 | OPEN | a multi-red burst on the runner — appended to CH-64, which owns it |",
          },
        ],
        [{ id: "CH-64", text: "| CH-64 | RETIRED | the burst class, one home |" }],
      ),
      classes: CLASS_HOMES,
    },
  ],
  [
    "ONE-HOME/registration",
    "a class home is registered for a row the ledger no longer tables",
    armOneHome,
    {
      ledger: fixtureLedger([{ id: "FX-11" }]),
      classes: CLASS_HOMES,
    },
    {
      ledger: fixtureLedger(
        [{ id: "FX-11" }],
        [{ id: "CH-64", text: "| CH-64 | RETIRED | … |" }],
      ),
      classes: CLASS_HOMES,
    },
  ],
  [
    "LIVE-REGION",
    "an aria-live region is born under v-if with its content already inside",
    armLiveRegions,
    { io: FIXTURE_LIVE_BAD, admitted: [] },
    { io: FIXTURE_LIVE_GOOD, admitted: [] },
  ],
  [
    "LIVE-REGION/admission",
    "an admission outlives the site it admits",
    armLiveRegions,
    {
      io: FIXTURE_LIVE_GOOD,
      admitted: [
        {
          file: "web/frontend/src/Fixture.vue",
          anchor: 'aria-live="polite"',
          cure: "-",
          dated: "-",
        },
      ],
    },
    {
      io: FIXTURE_LIVE_BAD,
      admitted: [
        {
          file: "web/frontend/src/Fixture.vue",
          anchor: 'aria-live="polite"',
          cure: "-",
          dated: "-",
        },
      ],
    },
  ],
  [
    "FREEZE",
    "a sealed tranche's own audited row reaches no disposition in its tranche-time corpus",
    armFreeze,
    {
      sweep: [
        {
          tranche: FIXTURE_TRANCHES[0],
          skipped: null,
          orphans: [{ id: "BAL-03", file: "FIXTURE.md", line: 7 }],
        },
      ],
    },
    {
      sweep: [
        { tranche: FIXTURE_TRANCHES[0], skipped: null, orphans: [] },
        { tranche: FIXTURE_TRANCHES[1], skipped: "no audited row set", orphans: [] },
      ],
    },
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

const ledgerAbs = resolve(REPO, LEDGER);
const ID_CELL = idCellPattern(ROW_FAMILIES);

// ── one tranche's completeness diff ─────────────────────────────────────────────────────────────
//
// Extracted so the FREEZE sweep can run the same diff over a sealed tranche against that tranche's
// OWN corpus. STRICT is the primary run: a missing row set, an empty corpus, a row set that parses
// to zero rows are all format drift and must fail loud. The sweep is not strict — the pre-T5 estate
// closed inside its READMEs and never wrote a row set at all, and a tranche with nothing to diff is
// skipped BY NAME rather than turned into a FATAL that takes the whole gate down with it.
function trancheDiff(t, { excludes = [], strict = false } = {}) {
  const trancheAbs = resolve(REPO, t.rel);
  const skip = (reason) => ({ tranche: t, skipped: reason });
  if (!existsSync(trancheAbs))
    return strict ? fatal(`tranche folder missing: ${t.rel}`) : skip("no such folder");

  // Inputs are located BEFORE the corpus is assembled — they are excluded from it, since a row set
  // that cites itself discharges nothing. Nothing is read yet: the structural guards below have to
  // be reachable in the order the header advertises (the old `waves/` guard was dead code).
  const inputRels = INPUT_SHAPES.map((shape) => join(t.rel, shape)).filter((rel) =>
    existsSync(resolve(REPO, rel)),
  );
  if (inputRels.length === 0)
    return strict
      ? fatal(
          `${t.rel} carries none of the audited row-set shapes:\n  ` +
            INPUT_SHAPES.join("\n  ") +
            `\nA tranche with no row set has nothing to diff.`,
        )
      : skip("no audited row set (closed inside its own records)");

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
    return strict
      ? fatal(
          `${t.rel} contributes no corpus files (no waves/*.md, no root *.md outside its row sets).` +
            ` A corpus of the ledger alone would let the record discharge itself.`,
        )
      : skip("no corpus files outside its row sets");

  let corpusAbs = [...trancheMd];
  if (existsSync(ledgerAbs)) corpusAbs.push(ledgerAbs);
  else if (
    strict &&
    (opts.requireLedger || opts.assertState || opts.verifyCites || opts.ownerBlock)
  )
    fatal(`${LEDGER} is absent, and the arms requested read it`);

  const excluded = [];
  for (const wanted of excludes) {
    const hits = corpusAbs.filter(
      (p) =>
        basename(p) === basename(wanted) ||
        relative(REPO, p) === wanted.replace(/^\.\//, ""),
    );
    if (hits.length === 0) {
      if (strict)
        fatal(`--canary-exclude ${wanted} matched no corpus file — inert canary`);
      continue;
    }
    excluded.push(...hits);
    corpusAbs = corpusAbs.filter((p) => !hits.includes(p));
  }
  if (corpusAbs.length === 0)
    return strict
      ? fatal("the corpus is empty after exclusions")
      : skip("corpus empty after exclusions");

  // inputs, parsed
  const inputs = [];
  for (const rel of inputRels) {
    const rows = dedupe(readRows(resolve(REPO, rel), rel, ID_CELL));
    if (rows.length === 0)
      return strict
        ? fatal(
            `${rel} parsed to zero rows of ${ROW_FAMILIES.join("/")} — format drift`,
          )
        : skip(`${rel} parsed to zero rows — format drift`);
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
  const siteOf = (id) => {
    const first = citations.get(id)?.[0];
    return first ? `${first.file}:${first.line}` : "";
  };

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
  return {
    tranche: t,
    skipped: null,
    inputs,
    corpusAbs,
    excluded,
    allRows,
    verdicts,
    citations,
    scopeRefs,
    orphans: allRows.filter((row) => !verdicts.has(row.id)),
  };
}

const primary = trancheDiff(tranche, { excludes: opts.excludes, strict: true });
const { inputs, corpusAbs, excluded, allRows, verdicts, orphans, scopeRefs } = primary;

// ── the freeze law's sweep ──────────────────────────────────────────────────────────────────────
//
// Every SEALED tranche re-diffed against its own tranche-time corpus, on every run. BAL-03 is the
// case: T8 lawfully restamped CH-45's line, the only `BAL-03` token in the living ledger went with
// it, and T7's gate turned RED at a commit nobody would ever run it at — where it stayed, unseen,
// for two closes, because nothing re-reads a sealed tranche. Now something does.
const freezeSweep = tranche.sealed
  ? []
  : estate
      .filter((t) => t.sealed)
      .map((t) => trancheDiff(t, { excludes: opts.excludes, strict: false }));
const freezeFindings = armFreeze({ sweep: freezeSweep });

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
if (freezeSweep.length) {
  armRuns.push(["FREEZE", freezeFindings]);
  findings.push(...freezeFindings.map((h) => ({ ...h, arm: "FREEZE" })));
}
if (opts.assertState) {
  const model = {
    ledger,
    tranches: estate,
    currentNum: estate.at(-1).num,
    probes: PROBES,
    classes: CLASS_HOMES,
    admitted: LIVE_REGION_ADMITTED,
    io,
  };
  for (const [name, fn] of [
    ["TERMINALITY", armTerminality],
    ["FOLD-TARGET", armFoldTargets],
    ["PROBE", armProbes],
    ["DUPLICATE", armDuplicateHomes],
    ["ONE-HOME", armOneHome],
    ["LIVE-REGION", armLiveRegions],
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
  ...(freezeSweep.length ? ["FREEZE"] : []),
  ...(opts.assertState
    ? ["TERMINALITY", "FOLD-TARGET", "PROBE", "DUPLICATE", "ONE-HOME", "LIVE-REGION"]
    : []),
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

if (freezeSweep.length) {
  say(
    "FREEZE SWEEP (every sealed tranche re-diffed against its OWN tranche-time corpus)",
  );
  for (const run of freezeSweep)
    say(
      run.skipped
        ? `  ${run.tranche.rel.padEnd(34)} SKIPPED — ${run.skipped}`
        : `  ${run.tranche.rel.padEnd(34)} ${String(run.allRows.length).padStart(3)} audited rows · ` +
            `${run.corpusAbs.length} corpus files · ${run.orphans.length} orphan`,
    );
  say();
}

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

// The currency arms' reach, printed rather than claimed. Before T9-W5 the whole of it was §1 plus
// the terminal rows still under WATCH — the rows CITES scopes to — and everything else in the
// ledger was outside every arm, which is how eighteen FOLDED rows came to wear a landing promise
// into a sealed tranche where nothing ever looked at them.
if (ledger && opts.assertState) {
  const pct = (n) => `${((100 * n) / ledger.rows.length).toFixed(1)}%`;
  const citeScope = new Set([
    ...ledger.open.map((r) => r.id),
    ...ledger.terminal.filter((r) => /\bWATCH\b/.test(r.state)).map((r) => r.id),
  ]);
  const waveScope = ledger.rows.filter(
    (r) => waveRefs(r.text, estate.at(-1).num).length > 0,
  );
  const probeScope = ledger.rows.filter((r) => PROBES[r.id]);
  // The disposition cell is the state where a table has three columns and the ONLY cell where it
  // has two (§4, §5) — U-11 writes its fold there, which is why a state-scoped count reads 17.
  const folded = ledger.rows
    .map((r) => ({ r, cell: r.state || r.body }))
    .filter(
      ({ cell }) =>
        /^\*{0,2}FOLDE?D?\b/.test(cell.trimStart()) &&
        !/\b(LANDED|CLOSED|RETIRED?|SUPERSEDED|EXECUTED|CURED)\b/.test(cell),
    )
    .map(({ r }) => r);
  const covered = new Set([
    ...ledger.rows.map((r) => r.id), // DUPLICATE and ONE-HOME read every row
  ]);
  say(`CURRENCY COVERAGE  (${ledger.rows.length} ledger rows)`);
  say(
    `  TERMINALITY  ${String(ledger.open.length).padStart(3)}  ${pct(ledger.open.length)}  §1 only — the accretion disease is an OPEN-row disease`,
  );
  say(
    `  FOLD-TARGET  ${String(waveScope.length).padStart(3)}  ${pct(waveScope.length)}  every row naming a wave, in any section`,
  );
  say(
    `  PROBE        ${String(probeScope.length).padStart(3)}  ${pct(probeScope.length)}  rows carrying a registration (${Object.keys(PROBES).join(", ")})`,
  );
  say(
    `  DUPLICATE    ${String(ledger.rows.length).padStart(3)}  ${pct(ledger.rows.length)}  every row, against every other`,
  );
  say(
    `  ONE-HOME     ${String(ledger.rows.length).padStart(3)}  ${pct(ledger.rows.length)}  every row, against ${Object.keys(CLASS_HOMES).length} registered class home(s)`,
  );
  say(
    `  CITES        ${String(citeScope.size).padStart(3)}  ${pct(citeScope.size)}  §1 + terminal-under-WATCH — scope HELD, see the header`,
  );
  say(
    `  ─ union      ${String(covered.size).padStart(3)}  ${pct(covered.size)}  (was ${citeScope.size} · ${pct(citeScope.size)} before T9-W5)`,
  );
  say(
    `  of which ${folded.length} dead-state FOLDED rows, 0 under any arm before, ${folded.filter((r) => waveRefs(r.text, estate.at(-1).num).length > 0).length} under FOLD-TARGET now`,
  );
  say();
}

if (opts.assertState && LIVE_REGION_ADMITTED.length) {
  say(
    `LIVE-REGION ADMISSIONS (${LIVE_REGION_ADMITTED.length}) — sites that violate TODAY, printed in full`,
  );
  for (const a of LIVE_REGION_ADMITTED) {
    say(`  ${a.file}  ${a.anchor}`);
    say(`      admitted ${a.dated} · cure: ${a.cure}`);
  }
  say(
    `  An unadmitted site REDs on contact; an admission whose site stops violating REDs as SPENT.`,
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
