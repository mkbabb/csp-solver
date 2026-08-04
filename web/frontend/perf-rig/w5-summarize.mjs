#!/usr/bin/env node
/**
 * w5-summarize.mjs — T8-W5's run JSONL into the two families' tables.
 *
 * `summarize.mjs` folds the P1 scenario roster; this folds the two rows P1 never had — the
 * `liveWindow` census (game × state × engine) and the `solveCell` matrix (game × size × tier).
 * Kept apart from its sibling rather than bolted onto it: the P1 summarizer backs a gates.json
 * verdict and its shape is load-bearing for that lane.
 *
 * EVERY ROW CARRIES ITS LOAD. `w5-bench.sh` appends a `hostLoad` line per run, and a table
 * printed without it is a table nobody can adjudicate — the rig's own banked case is a WebKit
 * RED at load 13.83 that went green at 2.99 on the same dist. A run whose load ROSE past the
 * gate mid-burst is printed with a `!` and must not be quoted.
 *
 * Usage: node w5-summarize.mjs --family boil|solve [--engine safari] [--glob <substr>]
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const RIG = fileURLToPath(new URL(".", import.meta.url));
const RUNS = join(RIG, "runs");
const argv = process.argv.slice(2);
const flag = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const FAMILY = flag("--family", "boil");
const MATCH = flag("--glob", "w5-");

const num = (a) => a.filter((x) => typeof x === "number" && isFinite(x)).sort((x, y) => x - y);
const median = (a) => {
  const s = num(a);
  if (!s.length) return null;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
const spread = (a) => {
  const s = num(a);
  return s.length ? `${r2(s[0])}–${r2(s[s.length - 1])}` : "—";
};

const files = (await readdir(RUNS)).filter((f) => f.endsWith(".jsonl") && f.includes(MATCH));
const runs = new Map();
for (const f of files) {
  const id = f.replace(/\.jsonl$/, "");
  const lines = (await readFile(join(RUNS, f), "utf8")).trim().split("\n").filter(Boolean);
  const rows = [];
  for (const l of lines) {
    try {
      rows.push(JSON.parse(l));
    } catch {
      /* a truncated tail is a partial run, not a parse crisis */
    }
  }
  runs.set(id, rows);
}

/**
 * runId → the load the burst opened and closed under, plus the driver's exit and the TRUE engine.
 *
 * THE ENGINE LABEL IS NOT GUESSED FROM THE UA. Playwright's WebKit reports a Safari-shaped user
 * agent — `Version/x Safari/605.x`, no `Chrome` — so a UA sniff calls it "safari" and a headless
 * WebKit number gets quoted as a real-Safari fact. That is precisely the substitution this whole
 * lane exists to refuse. The lane is stamped by the DRIVER into the runId and corroborated by
 * the UA; when the two disagree the row says so rather than picking the flattering one.
 */
// PROVENANCE, NOT JUST ENGINE. `-r1` and `-r2` were taken by the driver T8-W5 abrogated — the
// one that forced Safari frontmost and re-asserted the front every 2 s. Those readings are real
// desktop Safari at a full-size viewport, and they are the only real-Safari frame numbers this
// wave has; but they were bought by seizing the owner's screen and they cannot be reproduced by
// the quiet driver, so they are labelled for what they are rather than folded in silently.
const LEGACY_TAG = /-r[12]$/;
const LANES = [
  [/^w5-safari-/, "safari-automation", /Version\/[\d.]+ Safari/],
  [/^w5-pwwk-/, "playwright-webkit-headless", /Version\/[\d.]+ Safari/],
  [/^w5-chromium-/, "chromium-headless", /Chrome\//],
  [/^w5-sim-/, "ios-simulator", /iPhone|iPad/],
];
function host(rows, id = "") {
  const h = rows.find((r) => r.kind === "hostLoad");
  const env = rows.find((r) => r.ua);
  const ua = env?.ua || "";
  let engine = "unlabelled";
  let mismatch = "";
  for (const [re, name, uaRe] of LANES) {
    if (re.test(id)) {
      engine = name;
      if (name === "safari-automation" && LEGACY_TAG.test(id)) engine = "safari-desktop (legacy frontmost driver)";
      if (ua && !uaRe.test(ua)) mismatch = ` !UA(${ua.slice(0, 40)})`;
      break;
    }
  }
  return {
    l0: h?.load1Start ?? null,
    l1: h?.load1End ?? null,
    max: h?.maxLoad ?? null,
    suspect: h && h.load1End > h.maxLoad,
    engine: engine + mismatch,
    gateFamily: engine === "ios-simulator" ? "sim" : "desktop",
    dpr: env?.dpr ?? null,
    viewport: env ? `${env.innerWidth}×${env.innerHeight}` : "—",
  };
}

/** Rows the paint gate refused — printed, never silently dropped. The durable tell in the run
 *  file is the driver's exit 5 (the gate's own verdict lines go to the driver's stdout, which
 *  the probe server never sees); an in-page refusal posts `occluded` and is caught too. */
function occlusion(rows) {
  const h = rows.find((r) => r.kind === "hostLoad");
  const bad = rows.find(
    (r) => r.verdict === "OCCLUDED-INVALID" || r.occluded === true,
  );
  return bad || h?.driverExit === 5 ? "OCCLUDED-INVALID" : "";
}

/** A run that timed out (exit 3) but banked SOME scenarios is partial, not void — and a table
 *  that shows one window where its neighbours show two owes the reader that word. The usual
 *  cause here is the window going dark between scenarios: the sampler that already closed is a
 *  clean reading, the one that never got its frames is simply absent. */
function partial(rows) {
  const h = rows.find((r) => r.kind === "hostLoad");
  return h?.driverExit === 3 && rows.some((r) => r.scenario) ? " ·PARTIAL" : "";
}

/**
 * THE GATES, READ RATHER THAN REMEMBERED. `gates.json` is the only place a threshold lives, and
 * the desktop absolutes in it are anchored to a 98.4 fps ceiling — so the portable comparison
 * is the ratio the file itself implies (`minFps / ceilingFps`), applied to whatever ceiling THIS
 * session measured. `long33` needs no transposition: a frame over 33.4 ms is a dropped frame at
 * any refresh rate, which is why it is the row that actually adjudicates here.
 */
const GATES = JSON.parse(
  await readFile(
    join(RIG, "../../../docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/gates.json"),
    "utf8",
  ).catch(() => "{}"),
);
function idleVerdict(family, fps, long33, ceil) {
  const g = family === "sim" ? GATES.sim : GATES.desktop;
  if (!g?.idle3s || !ceil || fps == null) return "—";
  const wantPct = g.idle3s.minFps / g.ceilingFps;
  const got = fps / ceil;
  const fpsOk = got >= wantPct;
  const longOk = g.idle3s.maxLong33 == null || long33 <= g.idle3s.maxLong33;
  return `${fpsOk ? "PASS" : "FAIL"} ${r2(got * 100)}% vs ${r2(wantPct * 100)}%${longOk ? "" : ` · long33 ${long33}>${g.idle3s.maxLong33}`}`;
}

if (FAMILY === "boil") {
  // game/state come off the runId: w5-<engine>-<game>-<state>-<tag>
  console.log(
    "| run | engine | game | state | window | fps | %ceil | long33 | worst ms | busy % | busy worst | players | ink Δ | gate (idle3s) | load 1m |",
  );
  console.log("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  // THE DENOMINATOR IS CHOSEN, NOT STUMBLED INTO. An engine can have several ceiling runs, and
  // taking whichever `readdir` yielded last made the denominator an accident of the filesystem —
  // r10's ceiling is load-suspect (load ROSE to 8.46, one long33) and would otherwise have graded
  // all fifteen real-Safari rows. Two rules, both conservative:
  //   1. A load-suspect ceiling is dropped whenever a clean one exists for the same engine.
  //   2. Among the survivors, take the MAX. A ceiling is the best the display did; a contended
  //      sample understates it, and understating the denominator flatters %ceil. Max is the
  //      denominator that makes the gate harder to pass, which is the direction to err in.
  const ceilCands = new Map();
  for (const [id, rows] of runs) {
    if (!id.includes("ceiling")) continue;
    const c = rows.find((r) => r.scenario === "rafCeiling");
    if (!c) continue;
    const h = host(rows, id);
    const list = ceilCands.get(h.engine) || [];
    list.push({ id, fps: c.fps, suspect: !!h.suspect });
    ceilCands.set(h.engine, list);
  }
  const ceilings = new Map();
  const ceilFrom = new Map();
  for (const [engine, list] of ceilCands) {
    const clean = list.filter((c) => !c.suspect);
    const pool = clean.length ? clean : list;
    const best = pool.reduce((a, b) => (b.fps > a.fps ? b : a));
    ceilings.set(engine, best.fps);
    ceilFrom.set(
      engine,
      `${best.id} ${best.fps} fps${clean.length ? "" : " (ALL candidates load-suspect)"}` +
        (list.length > 1 ? ` · of ${list.length}: ${list.map((c) => `${c.id}=${c.fps}${c.suspect ? "!" : ""}`).join(", ")}` : ""),
    );
  }
  for (const [engine, prov] of ceilFrom) console.log(`<!-- ceiling · ${engine} · ${prov} -->`);
  const ids = [...runs.keys()].filter((i) => !i.includes("ceiling")).sort();
  for (const id of ids) {
    const rows = runs.get(id);
    const h = host(rows, id);
    const m = /^w5-(?:safari|sim|pwwk|chromium)-([a-z]+)-(solo|present|traffic)-/.exec(id);
    if (!m) continue;
    const ceil = ceilings.get(h.engine);
    const occ = occlusion(rows);
    if (occ) {
      console.log(
        `| ${id} | ${h.engine} | ${m[1]} | ${m[2]} | — | — | — | — | — | — | — | — | — | **${occ}** | ${h.l0}→${h.l1} |`,
      );
      continue;
    }
    for (const w of ["idle3s", "liveWindow"]) {
      const s = rows.find((r) => r.scenario === w);
      if (!s) continue;
      const pct = ceil && s.fps ? `${r2((s.fps / ceil) * 100)}%` : "—";
      const sess = s.session || {};
      // A multiplayer state that never had a second player at the table is a mislabelled solo
      // row. Say so in the row rather than letting the runId's word stand.
      // Only `liveWindow` takes a census, so only `liveWindow` can be convicted of it. Flagging
      // an `idle3s` row for `players: undefined` would indict every row of a missing instrument.
      const claim =
        w === "liveWindow" && m[2] !== "solo" && (sess.players ?? 0) < 2
          ? " **MISLABELLED-SOLO**"
          : "";
      console.log(
        `| ${id}${partial(rows)} | ${h.engine} | ${m[1]} | ${m[2]} | ${w} | ${s.fps ?? "—"} | ${pct} | ${s.long33 ?? "—"} | ${r2(s.worstMs) ?? "—"} | ${s.busyPct ?? "—"} | ${s.busyWorstGapMs ?? "—"} | ${sess.players ?? "—"}${claim} | ${s.inkDelta ?? "—"} | ${w === "idle3s" ? idleVerdict(h.gateFamily, s.fps, s.long33, ceil) : "—"} | ${h.l0}→${h.l1}${h.suspect ? " !" : ""} |`,
      );
    }
  }
} else {
  console.log(
    "| engine | game | board | tier | boards | solve n | solve med ms | solve spread | wasm med ms | wasm spread | gen med ms | gen spread | nodes med | load 1m |",
  );
  console.log("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  const TIER = ["EASY", "MEDIUM", "HARD"];
  const side = (g, d) => (["sudoku", "thermo", "killer"].includes(g) ? d * d : d);
  for (const [id, rows] of [...runs.entries()].sort()) {
    const h = host(rows, id);
    for (const c of rows.filter((r) => r.kind === "solveCell")) {
      const n = side(c.game, c.dim);
      const label = `${n}×${n}`;
      if (c.error && !c.solveMs.length) {
        console.log(
          `| ${h.engine} | ${c.game} | ${label} | ${TIER[c.difficulty]} | ${c.generateMs.length} | 0 | — | — | — | — | — | — | — | ${h.l0}→${h.l1} |  ${c.error}`,
        );
        continue;
      }
      console.log(
        `| ${h.engine} | ${c.game} | ${label} | ${TIER[c.difficulty]} | ${c.generateMs.length} | ${c.solveMs.length} | ${r2(median(c.solveMs))} | ${spread(c.solveMs)} | ${r2(median(c.wasmMs))} | ${spread(c.wasmMs)} | ${r2(median(c.generateMs))} | ${spread(c.generateMs)} | ${median(c.nodes) ?? "—"} | ${h.l0}→${h.l1}${h.suspect ? " !" : ""} |${c.error ? "  " + c.error : ""}${c.budgetExceeded ? "  BUDGET_EXCEEDED×" + c.budgetExceeded : ""}`,
      );
    }
    const cold = rows.filter((r) => r.kind === "solveCell" && r.coldArm && r.initMs != null);
    if (cold.length) {
      console.log(
        `| ${h.engine} | — | — | COLD INIT | — | ${cold.length} | ${r2(median(cold.map((c) => c.initMs)))} | ${spread(cold.map((c) => c.initMs))} | — | — | — | — | — | ${h.l0}→${h.l1} |  worker construct → wasm instantiated (ping pong)`,
      );
    }
  }
}
