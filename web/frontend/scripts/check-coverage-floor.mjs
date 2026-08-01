#!/usr/bin/env node
// T5-W1.14 — the coverage floor gate (completeness GAP-6).
//
// The audit found no coverage instrument anywhere in the repo: rust 208/0/0, py 27/0,
// FE 332 blocks / 31 files, e2e 206 — and no figure at all for what fraction of the undo
// spine, the technique engine, the wire codecs or the five URL codecs those numbers touch.
// W2 then collapses ~4,150 raw LOC across a five-game estate and W2's SPLIT halves two Rust
// god modules. Collapsing a majority of an estate against an unmeasured test surface is the
// exact shape that ships a silent regression, so the instrument lands FIRST and the measured
// baseline becomes the floor W2 must clear.
//
// What this gate reads:  coverage/coverage-summary.json  (vitest v8 `json-summary` reporter)
// What it enforces:      coverage-floor.json             (the banked baseline, committed)
//
// Per-SCOPE, not one flat number. A flat total lets a well-covered scope subsidize a scope
// the distill just gutted; the scopes partition `src/**` so every module answers for itself.
// Percentages are RE-DERIVED here from each file's covered/total counts — the summary's own
// `total` block is never trusted as the citation (numbers re-derived at citation).
//
// Two structural guards, because the interesting failures are not "the number dipped":
//   * A gated scope that matches ZERO files is RED, not a vacuous pass. Deleting the module
//     is how a collapse would otherwise satisfy its own floor. Retiring a scope is explicit:
//     `"retired": "<reason>"` in the floor file.
//   * `--write-floor` REFUSES to lower any gated figure without `--allow-lower "<reason>"`.
//     A re-bake that quietly ratchets down is a re-baseline, and the house does not
//     re-baseline on a red.
//
// Usage:
//   node scripts/check-coverage-floor.mjs                  # enforce (CI)
//   node scripts/check-coverage-floor.mjs --self-test      # prove the gate can fail, then enforce
//   node scripts/check-coverage-floor.mjs --write-floor    # re-bake the floor from the summary
//   node scripts/check-coverage-floor.mjs --print          # table only, exit 0 (reporting)
//
// Zero dependencies, node-only — it belongs beside check-golden-bytes.mjs in the frontend lane.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const FRONTEND_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_SUMMARY = join(FRONTEND_ROOT, 'coverage', 'coverage-summary.json');
const DEFAULT_FLOOR = join(FRONTEND_ROOT, 'coverage-floor.json');
const METRICS = ['statements', 'branches', 'functions', 'lines'];

// ---------------------------------------------------------------- argv

function parseArgs(argv) {
  const args = {
    summary: DEFAULT_SUMMARY,
    floor: DEFAULT_FLOOR,
    selfTest: false,
    writeFloor: false,
    allowLower: null,
    print: false,
    json: false,
    samples: null,
    singleRunOk: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--self-test') args.selfTest = true;
    else if (a === '--write-floor') args.writeFloor = true;
    else if (a === '--print') args.print = true;
    else if (a === '--json') args.json = true;
    else if (a === '--single-run-ok') args.singleRunOk = true;
    else if (a === '--samples') args.samples = argv[++i];
    else if (a === '--allow-lower') args.allowLower = argv[++i] ?? '(no reason given)';
    else if (a === '--summary') args.summary = argv[++i];
    else if (a === '--floor') args.floor = argv[++i];
    else if (a === '--help' || a === '-h') {
      console.log(
        'check-coverage-floor.mjs [--summary p] [--floor p] [--json] [--print] [--self-test]\n' +
          '                        [--write-floor (--samples <dir> | --single-run-ok) [--allow-lower "reason"]]',
      );
      process.exit(0);
    } else {
      console.error(`[coverage-floor] unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

// ---------------------------------------------------------------- pure core

/** Floor to 2dp. Banked figures round DOWN so a byte-identical re-run can never miss by float dust. */
const floor2 = (n) => Math.floor(n * 100) / 100;

/**
 * Normalize a coverage-summary key to a repo-relative posix path.
 * v8 writes absolute paths; `total` is the aggregate row and is dropped by the caller.
 */
function toRelPath(key) {
  const rel = key.startsWith(sep) || /^[A-Za-z]:[\\/]/.test(key) ? relative(FRONTEND_ROOT, key) : key;
  return rel.split(sep).join('/');
}

/**
 * Aggregate a summary into per-scope {metric: {covered, total, pct}}.
 * Scopes are longest-prefix-wins so `src/games/shared` claims its files before `src/games`.
 * Every file must land in exactly one scope; unclaimed files are returned for the caller to red on.
 */
function aggregate(summary, scopeDefs) {
  const prefixes = Object.entries(scopeDefs)
    .filter(([, def]) => typeof def.prefix === 'string')
    .sort((a, b) => b[1].prefix.length - a[1].prefix.length);

  const acc = {};
  for (const name of Object.keys(scopeDefs)) {
    acc[name] = { files: 0, metrics: {} };
    for (const m of METRICS) acc[name].metrics[m] = { covered: 0, total: 0 };
  }
  const unclaimed = [];

  for (const [key, entry] of Object.entries(summary)) {
    if (key === 'total') continue;
    const rel = toRelPath(key);
    const hit = prefixes.find(([, def]) => rel === def.prefix || rel.startsWith(def.prefix + '/'));
    if (!hit) {
      unclaimed.push(rel);
      continue;
    }
    const name = hit[0];
    acc[name].files++;
    for (const m of METRICS) {
      const e = entry[m];
      if (!e) continue;
      acc[name].metrics[m].covered += e.covered;
      acc[name].metrics[m].total += e.total;
    }
  }

  // TOTAL is the sum over every file, computed the same way (never copied from summary.total).
  const total = { files: 0, metrics: {} };
  for (const m of METRICS) total.metrics[m] = { covered: 0, total: 0 };
  for (const [key, entry] of Object.entries(summary)) {
    if (key === 'total') continue;
    total.files++;
    for (const m of METRICS) {
      const e = entry[m];
      if (!e) continue;
      total.metrics[m].covered += e.covered;
      total.metrics[m].total += e.total;
    }
  }
  acc.TOTAL = total;

  for (const s of Object.values(acc)) {
    for (const m of METRICS) {
      const { covered, total: t } = s.metrics[m];
      // total === 0 means the metric does not exist in this scope (e.g. no branches at all).
      // v8/istanbul call that 100; it is reported as such and a floor of 0 is what gets banked.
      s.metrics[m].pct = t === 0 ? 100 : (covered / t) * 100;
    }
  }
  return { scopes: acc, unclaimed };
}

/** Compare derived scopes against banked floors. Returns {breaches, structural, rows}. */
function compare(derived, floorDoc) {
  const breaches = [];
  const structural = [];
  const rows = [];
  for (const [name, def] of Object.entries(floorDoc.scopes)) {
    const got = derived[name];
    if (!got) {
      structural.push(`scope "${name}" is banked but produced no aggregate (summary shape changed)`);
      continue;
    }
    if (got.files === 0 && name !== 'TOTAL') {
      if (def.retired) {
        rows.push({ name, files: 0, retired: def.retired });
        continue;
      }
      structural.push(
        `scope "${name}" matched ZERO files — a gated scope cannot vanish silently. ` +
          `If W2 collapsed it, bank \`"retired": "<where its code went>"\` on the scope.`,
      );
      continue;
    }
    const row = { name, files: got.files, metrics: {} };
    for (const m of METRICS) {
      const have = got.metrics[m].pct;
      const want = def[m];
      if (typeof want !== 'number') {
        structural.push(`scope "${name}" has no banked floor for ${m}`);
        continue;
      }
      row.metrics[m] = { have, want, delta: have - want };
      // floor2 both sides: the bank is already floored, so this only guards float dust.
      if (floor2(have) + 1e-9 < want) {
        breaches.push({ scope: name, metric: m, have, want, delta: have - want });
      }
    }
    rows.push(row);
  }
  return { breaches, structural, rows };
}

// ---------------------------------------------------------------- rendering

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
// Displayed TRUNCATED, matching both istanbul's own rounding and the banked floor, so the
// table, the bank and the vitest text reporter never show three spellings of one figure.
const pct = (n) => `${floor2(n).toFixed(2)}%`;

function renderTable(rows) {
  const nameW = Math.max(12, ...rows.map((r) => r.name.length));
  const head =
    `${pad('scope', nameW)} | ${padL('files', 5)} | ${padL('stmts', 8)} | ${padL('branch', 8)} | ` +
    `${padL('funcs', 8)} | ${padL('lines', 8)}`;
  const out = [head, '-'.repeat(head.length)];
  for (const r of rows) {
    if (r.retired) {
      out.push(`${pad(r.name, nameW)} | ${padL(0, 5)} | retired: ${r.retired}`);
      continue;
    }
    out.push(
      `${pad(r.name, nameW)} | ${padL(r.files, 5)} | ` +
        METRICS.map((m) => padL(pct(r.metrics[m].have), 8)).join(' | '),
    );
  }
  return out.join('\n');
}

// ---------------------------------------------------------------- self-test
//
// The gate proves it can FAIL before CI trusts its green (the `lint:ink --self-test` pattern).
// Three synthetic summaries drive the pure core; no disk, no network, no vitest run.

function selfTest() {
  const F = (p) => join(FRONTEND_ROOT, p);
  const mk = (covered, total) => ({
    lines: { covered, total },
    statements: { covered, total },
    functions: { covered, total },
    branches: { covered, total },
  });
  const scopeDefs = { alpha: { prefix: 'src/alpha' }, beta: { prefix: 'src/beta' } };
  const floorDoc = {
    scopes: {
      alpha: { statements: 50, branches: 50, functions: 50, lines: 50 },
      beta: { statements: 50, branches: 50, functions: 50, lines: 50 },
      TOTAL: { statements: 50, branches: 50, functions: 50, lines: 50 },
    },
  };

  const cases = [];

  // 1. AT the floor → green (the floor is inclusive: `>=`).
  {
    const s = { [F('src/alpha/a.ts')]: mk(5, 10), [F('src/beta/b.ts')]: mk(5, 10) };
    const { scopes } = aggregate(s, scopeDefs);
    const r = compare(scopes, floorDoc);
    cases.push({ name: 'at-floor is green', pass: r.breaches.length === 0 && r.structural.length === 0 });
  }
  // 2. One scope dips 10% → RED, and it names that scope (not just the total).
  {
    const s = { [F('src/alpha/a.ts')]: mk(4, 10), [F('src/beta/b.ts')]: mk(9, 10) };
    const { scopes } = aggregate(s, scopeDefs);
    const r = compare(scopes, floorDoc);
    const namesAlpha = r.breaches.some((b) => b.scope === 'alpha');
    const totalStaysGreen = !r.breaches.some((b) => b.scope === 'TOTAL'); // 13/20 = 65% > 50
    cases.push({
      name: 'a single dipping scope reds even while TOTAL rises',
      pass: r.breaches.length > 0 && namesAlpha && totalStaysGreen,
    });
  }
  // 3. A gated scope's files all vanish → RED (structural), never a vacuous pass.
  {
    const s = { [F('src/beta/b.ts')]: mk(10, 10) };
    const { scopes } = aggregate(s, scopeDefs);
    const r = compare(scopes, floorDoc);
    cases.push({
      name: 'a vanished scope is structurally RED',
      pass: r.structural.some((m) => m.includes('"alpha"')) && r.breaches.length === 0,
    });
  }
  // 4. …unless it is explicitly retired with a reason.
  {
    const s = { [F('src/beta/b.ts')]: mk(10, 10) };
    const { scopes } = aggregate(s, scopeDefs);
    const doc = JSON.parse(JSON.stringify(floorDoc));
    doc.scopes.alpha.retired = 'folded into GameShell at W2';
    const r = compare(scopes, doc);
    cases.push({
      name: 'an explicitly retired scope passes',
      pass: r.structural.length === 0 && r.breaches.length === 0,
    });
  }
  // 5. A file matching no scope is surfaced (a new dir cannot slip in ungated).
  {
    const s = { [F('src/gamma/g.ts')]: mk(0, 10), [F('src/alpha/a.ts')]: mk(5, 10), [F('src/beta/b.ts')]: mk(5, 10) };
    const { unclaimed } = aggregate(s, scopeDefs);
    cases.push({ name: 'an unscoped file is surfaced', pass: unclaimed.length === 1 && unclaimed[0] === 'src/gamma/g.ts' });
  }
  // 6. Percentages are re-derived, NOT read from summary.total (a lying total is ignored).
  {
    const s = {
      total: { ...mk(999, 1000), lines: { covered: 999, total: 1000 } },
      [F('src/alpha/a.ts')]: mk(1, 10),
      [F('src/beta/b.ts')]: mk(1, 10),
    };
    const { scopes } = aggregate(s, scopeDefs);
    cases.push({ name: 'summary.total is not trusted', pass: Math.round(scopes.TOTAL.metrics.lines.pct) === 10 });
  }

  const failed = cases.filter((c) => !c.pass);
  console.log('[coverage-floor] self-test');
  for (const c of cases) console.log(`  ${c.pass ? 'ok  ' : 'FAIL'} ${c.name}`);
  if (failed.length) {
    console.error(`[coverage-floor] SELF-TEST FAILED (${failed.length}/${cases.length}) — the gate cannot be trusted.`);
    process.exit(1);
  }
  console.log(`[coverage-floor] self-test ${cases.length}/${cases.length} — the gate can fail on a known-bad input.`);
}

// ---------------------------------------------------------------- sample minima
//
// v8 coverage is NOT run-to-run identical on this estate: an n=10 sample at the W1.14
// baseline moved by up to 0.82 pts (src/games/sudoku.functions, 43↔44 of 122 — timer and
// microtask callbacks that may or may not land before a test file's environment tears down).
// Banking a lucky run as the floor manufactures a flaky gate, so the floor is the observed
// MINIMUM over a sample, per scope per metric. `--samples <dir>` reads that sample: one
// `--json` aggregate per run. `--single-run-ok` is the deliberate opt-out, and it is loud.

function sampleMinima(dir) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  if (files.length === 0) throw new Error(`no *.json run aggregates under ${dir}`);
  const mins = {};
  for (const f of files) {
    const run = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    for (const [name, s] of Object.entries(run)) {
      mins[name] ??= { files: s.files, metrics: {} };
      for (const m of METRICS) {
        const pct = s[m].pct;
        const cur = mins[name].metrics[m];
        if (cur === undefined || pct < cur.pct) mins[name].metrics[m] = { pct, covered: s[m].covered, total: s[m].total };
      }
    }
  }
  return { mins, n: files.length, files };
}

// ---------------------------------------------------------------- main

const args = parseArgs(process.argv.slice(2));
// --self-test is self-test ONLY: it must not fall through into the real gate,
// which reads a summary the CI step order hasn't produced yet (run 30720212628's
// red — the second bite of the same trap after 30719165442's --print half).
if (args.selfTest) {
  selfTest();
  process.exit(0);
}

if (!existsSync(args.floor)) {
  console.error(
    `[coverage-floor] no floor bank at ${relative(FRONTEND_ROOT, args.floor)}.\n` +
      `  Mint it once from a green coverage run: npm run test:unit:coverage && node scripts/check-coverage-floor.mjs --write-floor`,
  );
  process.exit(1);
}
const floorDoc = JSON.parse(readFileSync(args.floor, 'utf8'));

if (!existsSync(args.summary)) {
  console.error(
    `[coverage-floor] no coverage summary at ${relative(FRONTEND_ROOT, args.summary)}.\n` +
      `  The gate reads the json-summary reporter's output — run: npm run test:unit:coverage`,
  );
  process.exit(1);
}
const summary = JSON.parse(readFileSync(args.summary, 'utf8'));

const { scopes: derived, unclaimed } = aggregate(summary, floorDoc.scopes);

// `--json` emits the derived aggregates and nothing else — the sampler that measures the
// instrument's own run-to-run jitter (evidence/w1/coverage-baseline.md §3) reads this, so the
// band and the gate agree on how a scope is computed instead of each doing its own arithmetic.
if (args.json) {
  const out = {};
  for (const [name, s] of Object.entries(derived)) {
    out[name] = { files: s.files };
    for (const m of METRICS) {
      out[name][m] = { covered: s.metrics[m].covered, total: s.metrics[m].total, pct: s.metrics[m].pct };
    }
  }
  process.stdout.write(JSON.stringify(out) + '\n');
  process.exit(0);
}

const { breaches, structural, rows } = compare(derived, floorDoc);

console.log(renderTable(rows));
console.log('');

if (unclaimed.length) {
  console.error(
    `[coverage-floor] ${unclaimed.length} covered file(s) match NO banked scope — every source file must answer to a floor:`,
  );
  for (const u of unclaimed.slice(0, 20)) console.error(`  - ${u}`);
  if (unclaimed.length > 20) console.error(`  … and ${unclaimed.length - 20} more`);
}

if (args.writeFloor) {
  if (!args.samples && !args.singleRunOk) {
    console.error(
      `[coverage-floor] --write-floor needs a SAMPLE, not one run. This instrument's own jitter was\n` +
        `  measured at up to 0.82 pts (see the W1.14 bank); a floor baked from a lucky run flakes.\n` +
        `  Sample it:  for i in $(seq 1 10); do rm -rf coverage && npm run test:unit:coverage \\\n` +
        `                && node scripts/check-coverage-floor.mjs --json > /tmp/cov/run-$i.json; done\n` +
        `              node scripts/check-coverage-floor.mjs --write-floor --samples /tmp/cov\n` +
        `  Or say so out loud with --single-run-ok.`,
    );
    process.exit(2);
  }
  let source = derived;
  let sampleMeta = { method: 'single-run', n: 1 };
  if (args.samples) {
    const { mins, n, files } = sampleMinima(args.samples);
    source = mins;
    sampleMeta = { method: 'min-over-samples', n, runs: files };
  }
  const next = JSON.parse(JSON.stringify(floorDoc));
  const lowered = [];
  for (const [name, def] of Object.entries(next.scopes)) {
    const got = source[name];
    if (!got || (got.files === 0 && name !== 'TOTAL')) continue;
    for (const m of METRICS) {
      const was = def[m];
      const now = floor2(got.metrics[m].pct);
      if (typeof was === 'number' && now < was) lowered.push(`${name}.${m}: ${was} -> ${now}`);
      def[m] = now;
    }
    def.files = got.files;
  }
  next.sample = sampleMeta;
  if (lowered.length && !args.allowLower) {
    console.error(`[coverage-floor] --write-floor REFUSED: ${lowered.length} figure(s) would drop:`);
    for (const l of lowered) console.error(`  - ${l}`);
    console.error(`  Lowering a floor is a re-baseline. Pass --allow-lower "<reason>" and record it in the wave.`);
    process.exit(1);
  }
  if (lowered.length) next.loweredAt = { reason: args.allowLower, figures: lowered };
  writeFileSync(args.floor, JSON.stringify(next, null, 2) + '\n');
  console.log(`[coverage-floor] floor re-baked -> ${relative(FRONTEND_ROOT, args.floor)}`);
  process.exit(0);
}

if (args.print) process.exit(0);

if (structural.length) {
  console.error(`[coverage-floor] STRUCTURAL FAILURE (${structural.length}):`);
  for (const m of structural) console.error(`  - ${m}`);
}
if (breaches.length) {
  console.error(`[coverage-floor] FLOOR BREACH (${breaches.length}):`);
  for (const b of breaches) {
    console.error(
      `  - ${b.scope}.${b.metric}: ${pct(b.have)} < floor ${pct(b.want)} (${b.delta >= 0 ? '+' : ''}${b.delta.toFixed(2)} pts)`,
    );
  }
}
if (structural.length || breaches.length || unclaimed.length) {
  console.error(
    `\n[coverage-floor] RED. The floor is the T5-W1.14 baseline (${floorDoc.derivedFrom?.head ?? 'unpinned'}); ` +
      `W2's collapse must clear it, not re-cut it.`,
  );
  process.exit(1);
}

console.log(
  `[coverage-floor] GREEN — ${rows.length} scopes at or above the W1.14 baseline ` +
    `(bank: ${floorDoc.derivedFrom?.head ?? 'unpinned'}, ${floorDoc.derivedFrom?.date ?? 'undated'}).`,
);
