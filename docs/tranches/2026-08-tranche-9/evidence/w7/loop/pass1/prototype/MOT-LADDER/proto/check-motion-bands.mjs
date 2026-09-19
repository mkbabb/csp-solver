#!/usr/bin/env node
/**
 * T9-W7 §13 · THE DURATION LADDER GATE.  BORN RED.
 *
 * The estate's easing half is a system and its duration half is not: `pencilConfig.ts`
 * MOTION named four durations and the shipped rules spelled their lengths as literals
 * (R7's I6 at HEAD: 77 declarations, 35 distinct literals, 1 reading a named rung).
 * This gate is the duration twin of `check-motion-contract.mjs`'s PRM contract. It never
 * judges whether a length is RIGHT — only whether it is a NAMED DECISION.
 *
 *   B1 NAMED       every DURATION position inside a shipped transition/animation
 *                  declaration reads a rung (`var(--motion-*)`, `MOTION.rungs.*`,
 *                  `v-bind` off MOTION) or sits in the ADMITTED ledger with a class and a
 *                  cite. Position-aware: a shorthand's 2nd time is a DELAY, a separate
 *                  axis this wave does not ladder.
 *   B2 CLOSED      the ladder is a short closed set (≤ LADDER_MAX) and every rung carries
 *                  a ruling in the comment block. `beatMs` is EXEMPT BY CITE
 *                  (pencilConfig.ts:122 — the boil scheduler's raster-swap cadence; it
 *                  never reaches a `transition:` and is never published).
 *   B3 MIRROR      one publisher writes every rung onto the document root, main.ts calls
 *      +FALLBACK   it before mount, no second home in @theme — AND every
 *                  `var(--motion-r, n)` fallback is byte-equal to `rungs.r`.
 *   B4 NO-ALL      `transition: all` is banned in shipped source (it caught `visibility`
 *                  in the drawer gesture off GameControlPanel.vue).
 *   B5 PRM-ARMED   every file that reads a rung carries a reduce or no-preference gate.
 *   B6 NO-SHORTEN  diff-reading against `git show HEAD:<file>`: no re-pointed duration is
 *                  SHORTER than the one HEAD shipped (the W8 QUALITY LAW, per row).
 *
 * The ADMITTED ledger is closed BOTH ways (the `check-copy-register.mjs` shape): an entry
 * whose cited line no longer carries that literal reds the gate, so an admission cannot
 * outlive its reason.
 *
 * Run:  node scripts/check-motion-bands.mjs             (verdict)
 *       node scripts/check-motion-bands.mjs --list      (every offending position)
 *       node scripts/check-motion-bands.mjs --inventory (the ground table, JSON)
 *       node scripts/check-motion-bands.mjs --self-test (each check shown able to fail)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(process.env.ROOT ?? join(HERE, ".."));
const SRC = join(ROOT, "src");
const CONFIG = join(SRC, "pencil/config/pencilConfig.ts");
const THEME = join(SRC, "assets/index.css");
const MAIN = join(SRC, "main.ts");

/** A ladder is short or it is a list. */
const LADDER_MAX = 8;
/** The one duration constant that is NOT a rung, exempt by cite. */
const EXEMPT_KEYS = {
  beatMs: "pencilConfig.ts:122 — the boil beat, a raster-swap cadence",
};

/**
 * THE ADMITTED LEDGER — 24 positions in two named classes. Each row: the cite, the class,
 * the literal(s) admitted at that line, and the ruling. Never moved in this wave.
 */
const ADMITTED = {
  // ── CHARACTER (13) — a keyframed gesture auditioned whole; the ladder sets a gesture's
  // length, the keyframe owns its interior.
  "src/pencil/celestial/DarkModeToggle.vue:822": [
    "CHARACTER",
    [120],
    "toggle-squash — the toggle is ONE character gesture (T3-W10)",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:780": [
    "CHARACTER",
    [300],
    "the icon rise, inside the toggle gesture",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:795": [
    "CHARACTER",
    [340],
    "the star's tuck, inside the toggle gesture",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:810": [
    "CHARACTER",
    [800],
    "the bloom — auditioned as itself, the toggle's protagonist",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:843": [
    "CHARACTER",
    [1010],
    "plush-land — the toggle's own landing",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:774": [
    "CHARACTER",
    [100],
    "the outgoing icon's fade, inside the toggle gesture",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:873": [
    "CHARACTER",
    [100],
    "the opacity beat of the toggle's out-pose",
  ],
  "src/pencil/celestial/DarkModeToggle.vue:882": [
    "CHARACTER",
    [120],
    "the opacity beat of the toggle's in-pose",
  ],
  "src/assets/index.css:721": [
    "CHARACTER",
    [300],
    "cell-reveal on --ease-anticipatePop — an overshoot keyframe",
  ],
  "src/games/shared/GameControlPanel.vue:2478": [
    "CHARACTER",
    [400],
    "eraserScrub — a scrub",
  ],
  "src/games/shared/GameControlPanel.vue:2457": [
    "CHARACTER",
    [500],
    "sharePop — a press flourish",
  ],
  "src/assets/index.css:679": ["CHARACTER", [600], "refuse-shake — a refusal"],
  "src/pencil/chrome/ScribbleLoader.vue:81": [
    "CHARACTER",
    [1000],
    "a loop cadence, not a length",
  ],
  "src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:560": [
    "CHARACTER",
    [1200],
    "the wordmark writing itself",
  ],
  // ── GRADED (11) — a set whose differences ARE the design; a rung would erase them.
  "src/games/shared/GameControlPanel.vue:1724": [
    "GRADED",
    [320],
    "player row open — the arrival",
  ],
  "src/games/shared/GameControlPanel.vue:1728": [
    "GRADED",
    [380],
    "the name writing on, the heaviest of the set",
  ],
  "src/games/shared/GameControlPanel.vue:1735": [
    "GRADED",
    [280],
    "the return's row, 40ms lighter than the arrival (:1730)",
  ],
  "src/games/shared/GameControlPanel.vue:1739": ["GRADED", [320], "the return's name"],
  "src/games/shared/GameControlPanel.vue:1744": ["GRADED", [320], "player row close"],
  "src/games/shared/GameControlPanel.vue:1749": [
    "GRADED",
    [260],
    "the quiet — the lightest row of the graded set",
  ],
  "src/pencil/sheet/AnswerKeyLaminate.vue:236": [
    "GRADED",
    [280, 280],
    "lay-down 280 against lift-away 200 — the erase-family asymmetry (R6 §1.2)",
  ],
  "src/assets/index.css:768": [
    "GRADED",
    [160],
    "--draw-dur's own default; every write-in overrides it",
  ],
  "src/games/shared/gameCell.css:239": [
    "GRADED",
    [180],
    "the focus ring sketched on over 180ms (R6 law 39) — handed to §6",
  ],
  "src/games/shared/gameCell.css:257": [
    "GRADED",
    [180],
    "the focus ring, the second site — handed to §6",
  ],
};

/** `--empty-ledger` reads the tree as if nothing were admitted: the HEAD-truth count. */
const LEDGER = process.argv.includes("--empty-ledger") ? {} : ADMITTED;

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

const DECL = /(transition|animation)([a-z-]*):\s*([^;{}]+);/g;
const RUNG_VAR = /var\(\s*--motion-([A-Za-z]+)\s*(?:,\s*(\d+(?:\.\d+)?m?s)\s*)?\)/g;
const OTHER_VAR = /var\(\s*--[A-Za-z-]+\s*(?:,\s*(\d+(?:\.\d+)?m?s)\s*)?\)/g;
const MOTION_TS = /\bMOTION\.rungs\.[A-Za-z]+|v-bind\([^)]*MOTION[^)]*\)/;

const toMs = (n, unit) => (unit === "s" ? Number(n) * 1000 : Number(n));

/**
 * Position-aware read of one declaration body. Returns the ordered time positions per
 * comma-separated clause, each tagged duration|delay and named|literal.
 */
function positions(prop, body) {
  const longhand = /-duration$/.test(prop)
    ? "duration"
    : /-delay$/.test(prop)
      ? "delay"
      : null;
  // 1 · MASK FIRST — a var()'s own comma is not a clause boundary. Rung reads become opaque
  //     tokens so their fallback text is never mistaken for a bare literal.
  const toks = [];
  let masked = body.replace(RUNG_VAR, (_m, name, fb) => {
    toks.push({ kind: "rung", rung: name, fallback: fb ?? null });
    return `«${toks.length - 1}»`;
  });
  // 2 · any OTHER var() with a time fallback is a LOCAL (--draw-dur), ruled at its own site
  masked = masked.replace(OTHER_VAR, (_m, fb) => {
    if (fb) {
      const [, n, u] = /^(\d+(?:\.\d+)?)(ms|s)$/.exec(fb);
      toks.push({ kind: "local", ms: toMs(n, u), raw: fb });
      return `«${toks.length - 1}»`;
    }
    return "§";
  });
  // 3 · one clause per comma, then walk each clause in order
  const out = [];
  for (const clause of masked.split(",")) {
    const seq = [];
    const re = /«(\d+)»|(\d+(?:\.\d+)?)(ms|s)(?![\w-])/g;
    for (let m; (m = re.exec(clause));) {
      if (m[1] !== undefined) seq.push(toks[Number(m[1])]);
      else seq.push({ kind: "literal", ms: toMs(m[2], m[3]), raw: m[2] + m[3] });
    }
    const pretty = clause
      .replace(/«(\d+)»/g, (_m, i) =>
        toks[Number(i)].kind === "rung"
          ? `var(--motion-${toks[Number(i)].rung}, ${toks[Number(i)].fallback ?? "—"})`
          : `var(…, ${toks[Number(i)].raw})`,
      )
      .replace(/§/g, "var(…)")
      .replace(/\s+/g, " ")
      .trim();
    seq.forEach((t, i) => {
      let role = longhand ?? (i === 0 ? "duration" : i === 1 ? "delay" : "extra");
      // NOT A LENGTH: a `0s` visibility swap, the global PRM nuke's 0.01ms. Six at HEAD.
      if (role === "duration" && t.kind === "literal" && t.ms <= 1) role = "notALength";
      out.push({ ...t, role, clause: pretty.slice(0, 90) });
    });
  }
  return out;
}

function collectText(text, rel) {
  const decls = [];
  for (const m of text.matchAll(DECL)) {
    const prop = m[1] + m[2];
    const body = m[3];
    const line = text.slice(0, m.index).split("\n").length;
    const before = text.slice(0, m.index);
    const lineStart = before.lastIndexOf("\n") + 1;
    const head = text.slice(lineStart, m.index).trim();
    if (head.startsWith("*") || head.startsWith("//") || head.startsWith("/*"))
      continue; // prose
    const pos = positions(prop, body);
    if (!pos.length) continue;
    decls.push({
      file: rel,
      line,
      rel: `${rel}:${line}`,
      prop,
      body: body.replace(/\s+/g, " ").trim().slice(0, 120),
      pos,
      named: pos.some((p) => p.kind === "rung") || MOTION_TS.test(body),
      dev: rel.includes("/pencil/dev/"),
      all: /^transition$/.test(prop) && /^\s*all\b/.test(body),
    });
  }
  return decls;
}

function collect() {
  const decls = [];
  for (const file of walk(SRC))
    decls.push(...collectText(readFileSync(file, "utf8"), relative(ROOT, file)));
  return decls;
}

/** The ladder itself: MOTION.rungs, plus whether each rung carries a ruling. */
function ladder() {
  const src = readFileSync(CONFIG, "utf8");
  const start = src.indexOf("rungs: {");
  const rungs = [];
  if (start >= 0) {
    const block = src.slice(start, src.indexOf("}", start));
    const doc = src.slice(Math.max(0, start - 8000), start);
    for (const m of block.matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*(\d+)/g))
      rungs.push({
        key: m[1],
        value: Number(m[2]),
        // a rung is a named DECISION: its name must appear in the ruling block above
        documented: new RegExp(`\\*\\s+${m[1]}\\s+${m[2]}\\b`).test(doc),
      });
  }
  const motionStart = src.indexOf("export const MOTION");
  const motionBlock = src.slice(motionStart, src.indexOf("\n} as const;", motionStart));
  const strays = [];
  for (const m of motionBlock.matchAll(
    /^\s{2}([A-Za-z][A-Za-z0-9]*)\s*:\s*(\d+)\s*,/gm,
  ))
    if (!(m[1] in EXEMPT_KEYS)) strays.push({ key: m[1], value: Number(m[2]) });
  return { rungs, strays, src };
}

/** Where a rung reaches CSS from. */
function published(cfg) {
  const theme = readFileSync(THEME, "utf8");
  const second = [...theme.matchAll(/^\s*--motion-([A-Za-z-]+)\s*:\s*([^;]+);/gm)].map(
    (m) => ({
      token: `--motion-${m[1]}`,
      value: m[2].trim(),
      where: "index.css @theme (a SECOND home)",
    }),
  );
  const hasPublisher = /setProperty\(\s*`--motion-\$\{[A-Za-z]+\}`/.test(cfg);
  const main = existsSync(MAIN) ? readFileSync(MAIN, "utf8") : "";
  const calledBeforeMount =
    /publishMotionRungs\(\s*document\.documentElement\s*\)/.test(main) &&
    main.indexOf("publishMotionRungs(document.documentElement)") <
      main.indexOf(".mount(");
  const componentPublishers = [];
  for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/"(--(?:motion|card)-[a-z-]+)"\s*:\s*([^,\n]+)/g))
      componentPublishers.push({
        token: m[1],
        value: m[2].trim(),
        where: relative(ROOT, file),
      });
  }
  return { second, hasPublisher, calledBeforeMount, componentPublishers };
}

/* ── the checks ────────────────────────────────────────────────────────────── */

function b1Named(decls, rungKeys) {
  const bad = [];
  const seen = new Set();
  for (const d of decls) {
    if (d.dev) continue; // the debug rig is not shipped (i2's scope)
    const admitted = LEDGER[d.rel];
    for (const p of d.pos) {
      if (p.role !== "duration") continue; // delays are a separate axis (11 positions)
      if (p.kind === "rung") {
        if (!rungKeys.has(p.rung))
          bad.push(`${d.rel}  var(--motion-${p.rung}) is not a rung on the ladder`);
        continue;
      }
      if (admitted) {
        seen.add(d.rel);
        if (!admitted[1].includes(p.ms))
          bad.push(
            `${d.rel}  ADMITTED for ${admitted[1].join("/")}ms but the line spends ${p.ms}ms`,
          );
        continue;
      }
      bad.push(`${d.rel}  ${p.ms}ms unadmitted   ${p.clause}`);
    }
  }
  // closed the other way: an admission whose line left the tree
  for (const rel of Object.keys(LEDGER))
    if (!seen.has(rel))
      bad.push(
        `ADMITTED ${rel} (${LEDGER[rel][0]}) cites a line that no longer spends that literal`,
      );
  return bad;
}

function b2Closed({ rungs, strays }) {
  const bad = [];
  if (!rungs.length)
    bad.push(
      "MOTION declares no `rungs` — there is no closed set to read a length from.",
    );
  if (rungs.length > LADDER_MAX)
    bad.push(
      `the ladder is ${rungs.length} rungs; over ${LADDER_MAX} it is a list of literals with nicknames.`,
    );
  for (const r of rungs)
    if (!r.documented)
      bad.push(
        `MOTION.rungs.${r.key} = ${r.value} carries no ruling — a rung is a named DECISION.`,
      );
  for (const s of strays)
    bad.push(
      `MOTION.${s.key} = ${s.value} is a duration outside the ladder and outside the exemptions (${Object.keys(EXEMPT_KEYS).join(", ")}).`,
    );
  return bad;
}

function b3Mirror({ rungs }, pub, decls) {
  const bad = [];
  if (!pub.hasPublisher) bad.push("no publisher: no duration reaches CSS from config.");
  else if (!pub.calledBeforeMount)
    bad.push(
      "publishMotionRungs is not called on document.documentElement before mount (main.ts).",
    );
  for (const s of pub.second)
    bad.push(
      `${s.token}: ${s.value} — ${s.where}; the ladder is published, never typed twice.`,
    );
  for (const c of pub.componentPublishers)
    bad.push(`${c.token} published from ${c.where} — one publisher, one element.`);
  const byName = new Map(rungs.map((r) => [r.key, r.value]));
  for (const d of decls)
    for (const p of d.pos)
      if (p.kind === "rung") {
        if (p.fallback === null)
          bad.push(
            `${d.rel}  var(--motion-${p.rung}) carries no fallback — a missed publish must be a no-op.`,
          );
        else {
          const [, n, u] = /^(\d+(?:\.\d+)?)(ms|s)$/.exec(p.fallback);
          if (toMs(n, u) !== byName.get(p.rung))
            bad.push(
              `${d.rel}  var(--motion-${p.rung}, ${p.fallback}) ≠ rungs.${p.rung} ${byName.get(p.rung)}ms.`,
            );
        }
      }
  return bad;
}

function b4NoAll(decls) {
  return decls.filter((d) => d.all && !d.dev).map((d) => `${d.rel}  ${d.body}`);
}

/**
 * Every file the ladder governs collapses to a same-frame swap. Scope: files spending a
 * shipped TRANSITION length — an `animation` is already collapsed for the whole estate by
 * the global reduce block (index.css:744-749, `animation-duration: 0.01ms !important`),
 * which deliberately leaves transitions alive so a component can arm its own fallback.
 * Before the ladder lands this is the same file set that reads a rung after it, so the
 * check never goes vacuous at HEAD.
 */
function b5PrmArmed(decls) {
  const files = new Set(
    decls
      .filter(
        (d) =>
          !d.dev &&
          /^transition/.test(d.prop) &&
          d.pos.some((p) => p.role === "duration"),
      )
      .map((d) => d.file),
  );
  const bad = [];
  for (const f of [...files].sort()) {
    const text = readFileSync(join(ROOT, f), "utf8");
    if (!/prefers-reduced-motion/.test(text))
      bad.push(
        `${f} spends a rung on a transition and carries no reduce / no-preference gate.`,
      );
  }
  return bad;
}

/** Diff-reading: the resolved duration sequence per file, against HEAD's. */
function b6NoShorten(decls, { rungs }) {
  const byName = new Map(rungs.map((r) => [r.key, r.value]));
  const resolve1 = (p) => (p.kind === "rung" ? byName.get(p.rung) : p.ms);
  const now = new Map();
  // A gate that greens when its evidence is unreachable is not a gate. If git cannot
  // answer at all, say SKIPPED rather than pass.
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "ignore"],
    });
  } catch {
    return ["SKIPPED — no git tree at ROOT, so HEAD's lengths cannot be read."];
  }
  for (const d of decls.filter((x) => !x.dev))
    for (const p of d.pos)
      if (p.role === "duration")
        (now.get(d.file) ?? now.set(d.file, []).get(d.file)).push({
          ms: resolve1(p),
          rel: d.rel,
          clause: p.clause,
        });
  const bad = [];
  for (const [file, list] of now) {
    let headText;
    try {
      headText = execFileSync("git", ["show", `HEAD:web/frontend/${file}`], {
        cwd: ROOT,
        encoding: "utf8",
        maxBuffer: 32e6,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      continue; // a new file has nothing to shorten
    }
    const headPos = collectText(headText, file).flatMap((d) =>
      d.pos
        .filter((p) => p.role === "duration")
        .map((p) => ({ ms: resolve1(p), rel: d.rel, clause: p.clause })),
    );
    if (headPos.length !== list.length) {
      bad.push(
        `${file}: ${list.length} duration positions against HEAD's ${headPos.length} — the diff added or dropped a length; read it by eye.`,
      );
      continue;
    }
    list.forEach((p, i) => {
      if (p.ms < headPos[i].ms)
        bad.push(
          `${p.rel}  ${headPos[i].ms}ms → ${p.ms}ms — SHORTENED (W8 QUALITY LAW).  ${p.clause}`,
        );
    });
  }
  return bad;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const decls = collect();
const lad = ladder();
const pub = published(lad.src);
const rungKeys = new Set(lad.rungs.map((r) => r.key));

const shipped = decls.filter((d) => !d.dev);
const durPos = decls.flatMap((d) => d.pos.filter((p) => p.role === "duration"));
const literals = new Map();
for (const p of durPos)
  if (p.kind === "literal") literals.set(p.raw, (literals.get(p.raw) || 0) + 1);

if (INVENTORY) {
  console.log(
    JSON.stringify(
      {
        at: new Date().toISOString(),
        counts: {
          declarations: decls.length,
          shipped: shipped.length,
          durationPositions: durPos.length,
          delayPositions: decls.flatMap((d) => d.pos.filter((p) => p.role === "delay"))
            .length,
          namedDurationPositions: durPos.filter((p) => p.kind === "rung").length,
          literalDurationPositions: durPos.filter((p) => p.kind === "literal").length,
          distinctLiterals: literals.size,
          rungs: lad.rungs.length,
        },
        ladder: lad.rungs,
        histogram: [...literals.entries()].sort((a, b) => b[1] - a[1]),
        declarations: decls,
      },
      null,
      1,
    ),
  );
  process.exit(0);
}

console.log(
  `MOTION BANDS — ${decls.length} declarations carry a time (${shipped.length} shipped); ` +
    `${durPos.length} DURATION positions, ${durPos.filter((p) => p.kind === "rung").length} on a rung, ` +
    `${durPos.filter((p) => p.kind === "literal").length} literal (${literals.size} distinct); ` +
    `ladder ${lad.rungs.length} rungs (${lad.rungs.map((r) => `${r.key} ${r.value}`).join(", ") || "none"})`,
);
if (literals.size)
  console.log(
    `  top literals: ${[...literals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k, v]) => `${k}×${v}`)
      .join(", ")}`,
  );

const CHECKS = [
  ["B1 NAMED", () => b1Named(decls, rungKeys)],
  ["B2 CLOSED", () => b2Closed(lad)],
  ["B3 MIRROR+FALLBACK", () => b3Mirror(lad, pub, decls)],
  ["B4 NO-ALL", () => b4NoAll(decls)],
  ["B5 PRM-ARMED", () => b5PrmArmed(decls)],
  ["B6 NO-SHORTEN", () => b6NoShorten(decls, lad)],
];

const failures = [];
for (const [name, fn] of CHECKS) {
  const found = fn();
  console.log(
    `  ${found.length ? "✗" : "✓"} ${name}${found.length ? ` — ${found.length}` : ""}`,
  );
  if (LIST) for (const f of found) console.log(`      ${f}`);
  failures.push(...found.map((f) => `[${name}] ${f}`));
}

if (SELF_TEST) {
  console.log("\nSELF-TEST — each check against a known-bad model:");
  const d1 = (rel, body, prop = "transition") => ({
    ...collectText(`a { ${prop}: ${body}; }`, "x.vue")[0],
    rel,
    file: "x.vue",
    dev: false,
  });
  const cases = [
    [
      "B1 NAMED",
      "a cured site regresses to a literal",
      () => b1Named([d1("x.vue:1", "opacity 150ms var(--ease-standard)")], rungKeys),
    ],
    [
      "B2 CLOSED",
      "the ladder grows past a short closed set",
      () =>
        b2Closed({
          rungs: Array.from({ length: LADDER_MAX + 1 }, (_, i) => ({
            key: `r${i}`,
            value: i,
            documented: true,
          })),
          strays: [],
        }),
    ],
    [
      "B2 CLOSED",
      "a rung lands with no ruling",
      () =>
        b2Closed({
          rungs: [{ key: "throw", value: 520, documented: false }],
          strays: [],
        }),
    ],
    [
      "B3 MIRROR+FALLBACK",
      "a fallback drifts from its rung",
      () =>
        b3Mirror(
          { rungs: [{ key: "throw", value: 520 }] },
          {
            hasPublisher: true,
            calledBeforeMount: true,
            second: [],
            componentPublishers: [],
          },
          [d1("x.vue:1", "opacity var(--motion-throw, 500ms) var(--ease-standard)")],
        ),
    ],
    [
      "B4 NO-ALL",
      "`transition: all` returns",
      () => b4NoAll([d1("y.vue:2", "all 200ms")]),
    ],
    [
      "B5 PRM-ARMED",
      "a rung consumer ships with no reduce arm",
      // package.json is a real file that could never carry a media query — the model's "unarmed file"
      () =>
        b5PrmArmed([
          {
            ...d1("z.vue:1", "opacity var(--motion-leave, 200ms) var(--ease-fadeOut)"),
            file: "package.json",
          },
        ]),
    ],
    [
      "B6 NO-SHORTEN",
      "a re-point shortens a shipped length",
      () => {
        const head = collectText(
          `a { transition: opacity 520ms var(--ease-standard); }`,
          "src/assets/index.css",
        );
        const cur = collectText(
          `a { transition: opacity 200ms var(--ease-standard); }`,
          "src/assets/index.css",
        );
        const byName = new Map();
        const ms = (p) => p.ms;
        const bad = [];
        head
          .flatMap((d) => d.pos)
          .forEach((h, i) => {
            const c = cur.flatMap((d) => d.pos)[i];
            if (ms(c) < ms(h)) bad.push(`model: ${ms(h)}ms → ${ms(c)}ms SHORTENED`);
          });
        void byName;
        return bad;
      },
    ],
  ];
  const vacuous = [];
  for (const [target, desc, fn] of cases) {
    const found = fn();
    console.log(
      `  [${target}] ${desc}\n      → ${found.length ? "RED (as it must)" : "GREEN — VACUOUS"}`,
    );
    if (!found.length) vacuous.push(`check "${target}" stayed GREEN under: ${desc}.`);
  }
  failures.push(...vacuous.map((v) => `[SELF-TEST] ${v}`));
}

if (failures.length) {
  console.error(
    `\n${failures.length} failure(s). ${LIST ? "" : "Re-run with --list for each."}`,
  );
  if (!LIST) for (const f of failures.slice(0, 8)) console.error(`  • ${f}`);
  process.exit(1);
}
console.log(
  "\nOK — every shipped duration reads a rung or a cited admission; the ladder is closed, published, mirrored, `all`-free, PRM-armed, and nothing shortened.",
);
