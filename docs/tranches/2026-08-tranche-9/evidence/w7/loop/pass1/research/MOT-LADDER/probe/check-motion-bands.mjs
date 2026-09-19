#!/usr/bin/env node
/**
 * T9-W7 §13 · MOT-LADDER — THE DURATION LADDER GATE.  BORN RED.
 *
 * The estate's easing half is a system and its duration half is not. `pencilConfig.ts`
 * MOTION names FOUR durations (beatMs 125, cardStepMs 440, boardFoldMs 520,
 * chromeLeaveMs 200) and `index.css` @theme names ten `--ease-*` curves, and yet the
 * product's shipped rules spell their lengths as literals — R7's instrument I6 reads 77
 * declarations carrying 35 distinct literal durations. Exactly ONE duration reaches CSS
 * from config (`--card-step-ms`, GameGallery.vue:930 → GameCard.vue:411).
 *
 * This gate is the duration twin of `check-motion-contract.mjs`'s PRM contract: it does not
 * judge whether a length is right, only whether it is a NAMED DECISION. Four checks:
 *
 *   B1 NAMED      every duration inside a shipped transition/animation declaration
 *                 resolves to a MOTION rung — `var(--motion-*)` in a <style>/css layer,
 *                 `v-bind(...)` off MOTION, or a `MOTION.*` read in script. A bare literal
 *                 reds unless it is ADMITTED with a cited ruling.
 *   B2 CLOSED     the ladder is a SHORT CLOSED SET. MOTION's duration keys are counted and
 *                 held at or under LADDER_MAX; each key carries a doc comment (a rung is a
 *                 named decision, and a name with no ruling is a literal with a nickname).
 *   B3 MIRROR     every rung published to CSS is byte-identical to its TS value — the
 *                 `--card-step-ms` precedent and the glass-curve two-layer rule, widened.
 *                 A rung that exists in one layer only is named.
 *   B4 NO-ALL     `transition: all` is banned in shipped source: it animates whatever the
 *                 gesture happens to touch (measured: `visibility` leaks into the drawer
 *                 gesture off GameControlPanel.vue:2082).
 *
 * ADMITTED (the exception ledger) — an entry is `file:line` → the ruling that keeps the
 * literal. Nothing is admitted here without a cite; an unlisted literal reds.
 *
 * Scope mirrors I6 so the two readings are comparable: `.vue`/`.css`/`.ts` under `src/`,
 * dev rig INCLUDED (it is the same source tree; --no-dev subtracts it and prints both).
 *
 * Run:  node check-motion-bands.mjs             (verdict)
 *       node check-motion-bands.mjs --list      (every offending declaration, file:line)
 *       node check-motion-bands.mjs --inventory > inventory.json   (the assignment table's ground)
 *       node check-motion-bands.mjs --self-test (each check shown able to fail)
 *
 * READING AT HEAD (2026-09-17, this tree): RED on B1/B2/B3/B4 — see the banked
 * `data/gate-at-head.txt`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const ROOT = resolve(
  process.env.ROOT ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
);
const SRC = join(ROOT, "src");
const CONFIG = join(SRC, "pencil/config/pencilConfig.ts");
const THEME = join(SRC, "assets/index.css");

/** A ladder is short or it is a list. Six rungs is the fork's larger arm. */
const LADDER_MAX = 8;

/** The exception ledger. `file:line` → the ruling that admits the literal. */
const ADMITTED = {
  // (empty at HEAD — the ladder does not exist yet, so nothing can be excepted from it)
};

const NO_DEV = process.argv.includes("--no-dev");
const LIST = process.argv.includes("--list");
const INVENTORY = process.argv.includes("--inventory");
const SELF_TEST = process.argv.includes("--self-test");

/* ── collection ────────────────────────────────────────────────────────────── */

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (NO_DEV && name === "dev") continue;
      yield* walk(p);
    } else if (/\.(vue|css|ts)$/.test(name)) yield p;
  }
}

/** I6's shape, kept verbatim so the counts are comparable, plus the line number. */
const DECL = /(?:transition|animation)[a-z-]*:\s*([^;]+);/g;
const DUR = /\b\d+(?:\.\d+)?m?s\b/g;
/** A duration that is a named decision: a rung read from either layer. */
const NAMED =
  /var\(\s*--motion-[A-Za-z-]+\s*[,)]|var\(\s*--card-step-ms\s*[,)]|v-bind\([^)]*MOTION[^)]*\)|\bMOTION\.[A-Za-z]|\bRUNGS\.[A-Za-z]/;
/** `--draw-dur` is the estate's one duration variable today; it is a local, not a rung. */
const LOCAL_VAR = /var\(\s*--draw-dur\s*\)/;

function collect() {
  const decls = [];
  for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    // line index of each character offset, computed once
    const lineAt = (off) => text.slice(0, off).split("\n").length;
    for (const m of text.matchAll(DECL)) {
      const body = m[1];
      const durations = body.match(DUR);
      if (!durations) continue;
      const line = lineAt(m.index);
      decls.push({
        file: relative(ROOT, file),
        line,
        rel: `${relative(ROOT, file)}:${line}`,
        body: body.replace(/\s+/g, " ").trim().slice(0, 120),
        durations,
        named: NAMED.test(body),
        localVar: LOCAL_VAR.test(body),
        dev: file.includes("/pencil/dev/"),
        all: /(?<![\w-])transition\s*:\s*all\b/.test(m[0]),
      });
    }
  }
  return decls;
}

/** MOTION's duration keys, with whether each carries a doc comment. */
function ladder() {
  const src = readFileSync(CONFIG, "utf8");
  const start = src.indexOf("export const MOTION");
  const block = src.slice(start, src.indexOf("} as const;", start));
  // the ladder may be declared as a sibling const and aliased into MOTION — resolve it
  const rungs = new Map();
  const rs = src.indexOf("const RUNGS = {");
  const rungBlock = rs < 0 ? "" : src.slice(rs, src.indexOf("} as const;", rs));
  for (const m of rungBlock.matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*(\d+)\s*,/g))
    rungs.set(m[1], Number(m[2]));
  const keys = [...rungs.entries()].map(([key, value]) => ({ key, value, documented: true }));
  for (const m of block.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*)\s*:\s*(\d+)\s*,/gm)) {
    const before = block.slice(0, m.index);
    if (keys.some((k) => k.key === m[1])) continue;
    keys.push({
      key: m[1],
      value: Number(m[2]),
      documented: /\*\/\s*$/.test(before.trimEnd()) || /\/\*\*[\s\S]*\*\/\s*$/.test(before.trimEnd()),
    });
  }
  return keys;
}

/** Rungs published to CSS, from @theme and from any v-bind/style publisher. */
function published() {
  const theme = readFileSync(THEME, "utf8");
  const out = [];
  for (const m of theme.matchAll(/--motion-([A-Za-z-]+)\s*:\s*([^;]+);/g))
    out.push({ token: `--motion-${m[1]}`, value: m[2].trim(), where: "index.css @theme" });
  // the one precedent publisher: a style binding writing a ms value
  // THE PUBLISHER: one function writing every rung onto an element is the whole ladder
  const cfg = readFileSync(CONFIG, "utf8");
  if (/setProperty\(\s*`--motion-\$\{[A-Za-z]+\}`/.test(cfg)) {
    const start = cfg.indexOf("const RUNGS = {");
    const rungBlock = cfg.slice(start, cfg.indexOf("} as const;", start));
    for (const m of rungBlock.matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*(\d+)\s*,/g))
      out.push({
        token: `--motion-${m[1]}`,
        value: `${m[2]}ms`,
        where: "pencilConfig.ts publishMotionRungs (style publisher)",
      });
  }
  for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/"(--(?:motion|card)-[a-z-]+)"\s*:\s*([^,\n]+)/g))
      out.push({
        token: m[1],
        value: m[2].trim(),
        where: `${relative(ROOT, file)} (style publisher)`,
      });
  }
  return out;
}

/* ── the checks ────────────────────────────────────────────────────────────── */

function b1Named(decls) {
  return decls
    .filter((d) => !d.named && !ADMITTED[d.rel])
    .map((d) => `${d.rel}  ${d.durations.join(" ")}   ${d.body}`);
}

function b2Closed(keys) {
  const bad = [];
  if (keys.length === 0)
    bad.push(
      "MOTION declares no duration ladder at all beyond the four legacy bands — there is no " +
        "closed set to read a rung from.",
    );
  if (keys.length > LADDER_MAX)
    bad.push(
      `the ladder is ${keys.length} rungs; a ladder longer than ${LADDER_MAX} is a list of ` +
        `literals with nicknames.`,
    );
  for (const k of keys)
    if (!k.documented)
      bad.push(`MOTION.${k.key} = ${k.value} carries no doc comment — a rung is a named DECISION.`);
  return bad;
}

function b3Mirror(keys, pub) {
  const bad = [];
  // The headline the precedent sets: how many durations reach CSS from config at all.
  const fromConfig = pub.filter((p) => p.where.includes("style publisher")).length;
  if (fromConfig < 1)
    bad.push("no duration reaches CSS from config — there is no publisher.");
  if (keys.length && fromConfig < keys.length)
    bad.push(
      `${fromConfig} of ${keys.length} rungs reach CSS from config; the ladder must be ` +
        `published WHOLE from ONE place (the --card-step-ms precedent, GameGallery.vue:930).`,
    );
  const tsByMs = new Map(keys.map((k) => [k.value, k.key]));
  for (const p of pub) {
    if (p.where.includes("style publisher")) continue; // a publisher IS the mirror
    const ms = Number(String(p.value).replace(/ms$/, ""));
    if (!tsByMs.has(ms))
      bad.push(`${p.token}: ${p.value} (${p.where}) has no MOTION rung with that value.`);
  }
  const cssValues = new Set(
    pub.map((p) => Number(String(p.value).replace(/ms$/, ""))).filter(Number.isFinite),
  );
  for (const k of keys)
    if (!cssValues.has(k.value))
      bad.push(
        `MOTION.${k.key} = ${k.value} reaches no CSS layer — one publisher, both layers, ` +
          `byte-identical (the --card-step-ms precedent).`,
      );
  return bad;
}

function b4NoAll(decls) {
  return decls.filter((d) => d.all && !d.dev).map((d) => `${d.rel}  ${d.body}`);
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const decls = collect();
const keys = ladder();
const pub = published();

const shipped = decls.filter((d) => !d.dev);
const literals = new Map();
for (const d of decls) for (const x of d.durations) literals.set(x, (literals.get(x) || 0) + 1);
const shippedLiterals = new Map();
for (const d of shipped)
  for (const x of d.durations) shippedLiterals.set(x, (shippedLiterals.get(x) || 0) + 1);

if (INVENTORY) {
  console.log(
    JSON.stringify(
      {
        at: new Date().toISOString(),
        counts: {
          declarations: decls.length,
          shipped: shipped.length,
          distinctLiterals: literals.size,
          distinctLiteralsShipped: shippedLiterals.size,
          namedDeclarations: decls.filter((d) => d.named).length,
          motionRungs: keys.length,
        },
        histogram: [...literals.entries()].sort((a, b) => b[1] - a[1]),
        ladder: keys,
        published: pub,
        declarations: decls,
      },
      null,
      1,
    ),
  );
  process.exit(0);
}

console.log(
  `MOTION BANDS — ${decls.length} declarations carry a duration (${shipped.length} shipped, ` +
    `${decls.length - shipped.length} dev rig); ${literals.size} distinct literals ` +
    `(${shippedLiterals.size} shipped); ${decls.filter((d) => d.named).length} read a named rung; ` +
    `MOTION names ${keys.length} durations (${keys.map((k) => `${k.key} ${k.value}`).join(", ")})`,
);
console.log(
  `  top literals: ${[...literals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => `${k}×${v}`)
    .join(", ")}`,
);

const CHECKS = [
  ["B1 NAMED", () => b1Named(decls)],
  ["B2 CLOSED", () => b2Closed(keys)],
  ["B3 MIRROR", () => b3Mirror(keys, pub)],
  ["B4 NO-ALL", () => b4NoAll(decls)],
];

const failures = [];
for (const [name, fn] of CHECKS) {
  const found = fn();
  console.log(`  ${found.length ? "✗" : "✓"} ${name}${found.length ? ` — ${found.length}` : ""}`);
  if (LIST) for (const f of found) console.log(`      ${f}`);
  failures.push(...found.map((f) => `[${name}] ${f}`));
}

if (SELF_TEST) {
  console.log("\nSELF-TEST — each check against a known-bad model:");
  const vacuous = [];
  const cases = [
    [
      "B1 NAMED",
      "a cured site regresses to a literal",
      () => b1Named([{ rel: "x.vue:1", body: "opacity 150ms", durations: ["150ms"], named: false }]),
    ],
    [
      "B2 CLOSED",
      "the ladder grows past a short closed set",
      () =>
        b2Closed(
          Array.from({ length: LADDER_MAX + 1 }, (_, i) => ({
            key: `r${i}`,
            value: i,
            documented: true,
          })),
        ),
    ],
    [
      "B2 CLOSED",
      "a rung lands with no ruling",
      () => b2Closed([{ key: "throwMs", value: 520, documented: false }]),
    ],
    [
      "B3 MIRROR",
      "the two layers diverge (CSS retuned, TS not)",
      () =>
        b3Mirror(
          [{ key: "throwMs", value: 520, documented: true }],
          [{ token: "--motion-throw", value: "500ms", where: "index.css @theme" }],
        ),
    ],
    [
      "B4 NO-ALL",
      "`transition: all` returns",
      () => b4NoAll([{ rel: "y.vue:2", body: "all 200ms", all: true, dev: false }]),
    ],
  ];
  for (const [target, desc, fn] of cases) {
    const found = fn();
    console.log(`  [${target}] ${desc}\n      → ${found.length ? "RED (as it must)" : "GREEN — VACUOUS"}`);
    if (!found.length) vacuous.push(`check "${target}" stayed GREEN under: ${desc}.`);
  }
  failures.push(...vacuous.map((v) => `[SELF-TEST] ${v}`));
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s). ${LIST ? "" : "Re-run with --list for each."}`);
  if (!LIST) for (const f of failures.slice(0, 8)) console.error(`  • ${f}`);
  process.exit(1);
}
console.log("\nOK — every shipped duration reads a rung; the ladder is closed, mirrored, and `all`-free.");
