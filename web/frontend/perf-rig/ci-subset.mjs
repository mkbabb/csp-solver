#!/usr/bin/env node
/**
 * ci-subset.mjs — the CI-runnable slice of the P1 perf rig: idle fps + long-frame(>33.4ms)
 * census on the BUILT DIST, in headless chromium AND webkit, against the thresholds committed
 * in the P1 patch's own gates.json. Exits nonzero on breach.
 *
 * WHY THIS EXISTS. `patches/p1-safari-ios-performance/gates.json` has been a committed
 * threshold file with no executor since the patch sealed: a regression to 79 fps idle passed
 * every CI lane. This is the executor for the four rows that survive a headless runner —
 * idle3s's two, plus undoBurst and boot TBT, which T7-W6 priced. The sim, GPU-attribution and
 * remaining interaction rows (deal/solveCelebration/themeToggle/galleryGlide) stay a MANUAL
 * lane — see README.md; they need real Safari, a real simulator, and `ps`-level process
 * attribution that no ubuntu runner can give.
 *
 * ── THE GATE RULE, pre-registered ─────────────────────────────────────────────────────────
 * Four assertions, every one of them read out of gates.json at run time. Nothing here is a
 * literal (A/B from the P1 patch's own rows; C/D added by T7-W6 for two surfaces the file
 * measured and never priced).
 *
 *   GATE A — long-frame census: median(long33) <= desktop.idle3s.maxLong33.
 *     Engine-portable and unit-free: a frame over 33.4ms is a dropped frame on a 60Hz runner
 *     exactly as it is on a 100Hz panel. This is the P1 defect's own signature — the beat
 *     train read 23 long frames per 3s idle window at base (r1 §1), 0 after the cure.
 *
 *   GATE B — idle fps as a fraction of the MEASURED harness ceiling:
 *     median(idleFps) >= (desktop.idle3s.minFps / desktop.ceilingFps) * measuredCeilingFps.
 *     The absolute 97 fps in gates.json is anchored to real Safari 26.4 on a ~100Hz panel
 *     (ceiling 98.4). A headless runner's rAF ceiling is its own number and is typically 60.
 *     Comparing 97 against it would be a category error, so the threshold is transposed into
 *     the unit the rig itself declares portable: r1-rig-baseline.md §8 — "the %-of-ceiling
 *     column is the portable one". The ceiling is re-measured per engine, per run, by the
 *     rig's own app-free /__ceiling page (the same sampler shape, empty page).
 *
 *   GATE C — undoBurst as a fraction of the measured ceiling:
 *     median(undoBurstFps) >= desktop.undoBurst.ciMinPctOfCeiling * measuredCeilingFps.
 *     T7-W6, CH-53: the scenario has been measured every manual run since P1 and priced
 *     nowhere — a committed instrument with no threshold is the same defect as a committed
 *     threshold with no executor, read from the other end.
 *
 *     TWO NUMBERS, because there are two surfaces, and this is where the transposition GATE B
 *     leans on runs out. `desktop.undoBurst.minFps` (52) is the REAL-SAFARI floor, sibling to
 *     deal/themeToggle/galleryGlide, enforced by the manual matrix: real Safari reads ~55 fps
 *     with ~15 long frames on this window (T5-W1 perf-rig-run-manifest.txt:53-55). Headless
 *     WebKit reads its ceiling on the same window — transposing 52/98.4 would hand CI a floor
 *     ~47% under live, which is the very slack W6 exists to remove. So the CI arm declares its
 *     own %-of-ceiling directly. Same shape as GATE B (a fraction of the measured ceiling),
 *     one derived from an anchored pair, one declared from this harness's own measurement.
 *
 *   GATE D — boot TBT: median(tbtMs over the boot window) <= boot.tbt.maxTbtMs, measured
 *     under `boot.tbt.cpuThrottleRate`× CPU throttling. Every other row here watches STEADY
 *     STATE; the boot burst happens once, before the first idle window opens, and had nothing
 *     to trip. Graded only on engines whose PerformanceObserver ships the `longtask` entry
 *     type — WebKit's does not. An engine without it is reported NOT MEASURED, never PASS,
 *     and a run in which NO engine could measure it is a setup error (exit 2), because a
 *     green from an instrument that ran nowhere is the vacuity this gate was added to remove.
 *     Throttling that is requested and cannot be applied is likewise exit 2: an unthrottled
 *     number read against a throttled floor is not a lenient measurement, it is a different one.
 *
 *     ALONE AMONG THE FOUR, GATE D IS AN ABSOLUTE — A/B/C all divide by a ceiling this harness
 *     measures per host, and boot TBT has no such denominator, so its number is a fact about
 *     the HOST CLASS as much as about the bundle. W6 set 1200 from darwin without ever having
 *     seen the runner; the runner's first reading of a clean tree was 1276/1333 (T7-W3
 *     restamp, 2026-08-03 — gates.json carries the arithmetic). The denominator is now
 *     MEASURED and printed as `tbt/anchor` below the verdict, diagnostic and gating nothing,
 *     so WGATE can transpose GATE D or refute the transposition on evidence rather than repeat
 *     the guess. It is comparable only WITHIN one engine at one cpuThrottleRate: TBT subtracts
 *     a flat 50 ms per task, which is not scale-invariant (darwin read 2.21 at 4x, 0.58 at 1x).
 *
 *   The absolute fps against the absolute 97 is printed as ADVISORY and does NOT gate. It is
 *   labelled with the measured ceiling so it cannot be misread as a real-Safari number.
 *
 *   GRADING ORDER, and it is load-bearing (T7-W6). Every measured result is graded BEFORE any
 *   exit is taken. The old shape graded after the engine loop, so a later engine's early
 *   return — an instrument failure, an unknown engine name — discarded a chromium breach that
 *   had already been measured, and `ci.yml` maps exit 3 to CODE=0: a real breach shipped green.
 *   Per-engine outcomes accumulate; the exit code is then the WORST fact in this order:
 *     1 (a threshold breached, anywhere)  >  2 (setup)  >  3 (instrument)  >  0.
 *   A breach outranks an instrument failure because a breach is a fact about the BUNDLE and an
 *   instrument failure is a fact about the HOST — a bad host cannot un-measure a bad bundle.
 *
 *   CONTROL VALIDITY — the app-free control page must itself hold the long-frame threshold,
 *     or no verdict is issued (exit 3, not exit 1). A host that drops frames with nothing on
 *     the page is not measuring the surface. Control and window are INTERLEAVED, per P-W4's
 *     instrument law, so host drift lands on both rather than on the windows alone.
 *
 * ── WHAT THIS IS NOT ──────────────────────────────────────────────────────────────────────
 * Playwright WebKit is not Safari (no Core Animation compositing path, different raster and
 * tiling) — the whole reason the P1 rig was built was that this harness read 80–98 fps on a
 * surface the owner called a rendered mess. Read this gate as a REGRESSION TRIPWIRE on the
 * cured mechanism, never as a source of Safari numbers. The manual lane owns those.
 *
 * ── USAGE ─────────────────────────────────────────────────────────────────────────────────
 *   node perf-rig/ci-subset.mjs [options]
 *     --port <n>          server port (default 4390, or $PERF_RIG_PORT). NOT 3000/3001/4288/4188.
 *     --engines a,b       chromium,webkit (default both)
 *     --runs <n>          idle windows per engine (default 3 — gates.json discipline says
 *                         "median of >=3 clean windows")
 *     --dist <path>       dist to serve (default ../dist)
 *     --build             force a `vite build` even when a dist is present
 *     --gates <path>      gates.json (default: the P1 patch's own)
 *     --out <file>        tee the report to a file
 *     --idle-fps-min <n>  CANARY ONLY — override gates.json's minFps
 *     --max-long33 <n>    CANARY ONLY — override gates.json's maxLong33
 *     --canary-fail <e>   CANARY ONLY — inject a synthetic instrument failure for engine <e>
 *                         at the control-validity site, without measuring it. The ablation
 *                         hook for the grading-order fix above: it makes "chromium breaches,
 *                         webkit's instrument dies" reproducible in one command instead of
 *                         waiting for a contended runner. Banked at
 *                         docs/tranches/2026-08-tranche-7/evidence/w6/ci-subset-ablation.txt.
 *
 * Exit: 0 pass · 1 threshold breach · 2 setup/usage error · 3 instrument failure
 */
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadavg, cpus } from "node:os";
import process from "node:process";

const RIG_DIR = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = resolve(RIG_DIR, "..");
const REPO_ROOT = resolve(FRONTEND_DIR, "..", "..");
const DEFAULT_GATES = join(
  REPO_ROOT,
  "docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/gates.json",
);

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
}

const PORT = Number(arg("--port", process.env.PERF_RIG_PORT || "4390"));
const ENGINES = arg("--engines", "chromium,webkit")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const RUNS = Number(arg("--runs", "3"));
const DIST = resolve(arg("--dist", join(FRONTEND_DIR, "dist")));
const GATES_PATH = resolve(arg("--gates", DEFAULT_GATES));
const OUT = arg("--out", "");
const FORCE_BUILD = flag("--build");
const OVERRIDE_FPS = flag("--idle-fps-min") ? Number(arg("--idle-fps-min")) : null;
const OVERRIDE_LONG33 = flag("--max-long33") ? Number(arg("--max-long33")) : null;
const CANARY_FAIL = arg("--canary-fail", "");

// Ports the owner's dev servers and the throttle-e2e rig already hold. Refuse rather than
// collide: a stolen port would either fail to bind or, worse, serve someone else's bundle.
const RESERVED = new Set([3000, 3001, 4188, 4288]);

const lines = [];
function say(s = "") {
  lines.push(s);
  process.stdout.write(`${s}\n`);
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const r2 = (n) => Math.round(n * 100) / 100;

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((ok, fail) => {
    const c = spawn(cmd, args, { stdio: "inherit", ...opts });
    c.on("error", fail);
    c.on("exit", (code) =>
      code === 0 ? ok() : fail(new Error(`${cmd} exited ${code}`)),
    );
  });
}

async function waitForPing(deadlineMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < deadlineMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/__ping`);
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

/** Drive one page load to completion, then hand back its posted JSONL lines.
 *
 *  `opts.cpuThrottle` applies CDP `Emulation.setCPUThrottlingRate` BEFORE the navigation, so
 *  the boot burst itself is throttled rather than whatever happens after it. CDP is chromium
 *  only; a caller that asks for throttling on an engine that cannot deliver it gets a THROWN
 *  error, never a quietly unthrottled window — a number taken at 1× and read against a floor
 *  derived at 4× is not a lenient reading, it is a different measurement wearing the same name.
 */
async function drive(browserType, url, runId, timeoutMs, opts = {}) {
  const page = await browserType.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
  if (opts.cpuThrottle) {
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setCPUThrottlingRate", { rate: opts.cpuThrottle });
  }
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  const t0 = Date.now();
  let done = false;
  while (Date.now() - t0 < timeoutMs) {
    const title = await page.title().catch(() => "");
    if (title.startsWith("PROBE DONE")) {
      done = true;
      break;
    }
    await page.waitForTimeout(500);
  }
  await page.close();
  const raw = await (await fetch(`http://127.0.0.1:${PORT}/__runs/${runId}`)).text();
  const posted = raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  return { done, posted, pageErrors };
}

async function main() {
  if (RESERVED.has(PORT)) {
    say(
      `SETUP ERROR: port ${PORT} is reserved (dev servers / throttle e2e). Pick another.`,
    );
    return 2;
  }
  if (!Number.isFinite(RUNS) || RUNS < 1) {
    say(`SETUP ERROR: --runs must be >= 1 (got ${arg("--runs")})`);
    return 2;
  }

  // ── thresholds ───────────────────────────────────────────────────────────────────────
  if (!(await isFile(GATES_PATH))) {
    say(`SETUP ERROR: gates.json not found at ${GATES_PATH}`);
    say(
      "This gate has no built-in thresholds by design — it enforces the committed file or nothing.",
    );
    return 2;
  }
  const gates = JSON.parse(await readFile(GATES_PATH, "utf8"));
  const ceilingFps = gates?.desktop?.ceilingFps;
  const minFpsSpec = gates?.desktop?.idle3s?.minFps;
  const maxLong33Spec = gates?.desktop?.idle3s?.maxLong33;
  const undoMinFpsSpec = gates?.desktop?.undoBurst?.minFps;
  const undoPct = gates?.desktop?.undoBurst?.ciMinPctOfCeiling;
  const bootMaxTbtMs = gates?.boot?.tbt?.maxTbtMs;
  const bootThrottle = gates?.boot?.tbt?.cpuThrottleRate;
  const bootWindowMs = gates?.boot?.tbt?.windowMs;
  for (const [k, v] of [
    ["desktop.ceilingFps", ceilingFps],
    ["desktop.idle3s.minFps", minFpsSpec],
    ["desktop.idle3s.maxLong33", maxLong33Spec],
    ["desktop.undoBurst.minFps", undoMinFpsSpec],
    ["desktop.undoBurst.ciMinPctOfCeiling", undoPct],
    ["boot.tbt.maxTbtMs", bootMaxTbtMs],
    ["boot.tbt.cpuThrottleRate", bootThrottle],
    ["boot.tbt.windowMs", bootWindowMs],
  ]) {
    if (typeof v !== "number") {
      say(`SETUP ERROR: ${GATES_PATH} is missing a numeric ${k}`);
      return 2;
    }
  }
  const minFps = OVERRIDE_FPS ?? minFpsSpec;
  const maxLong33 = OVERRIDE_LONG33 ?? maxLong33Spec;
  const ratio = minFps / ceilingFps;
  const undoRatio = undoPct;

  say("# perf-rig CI subset — idle fps + long-frame census on the built dist");
  say("");
  say(`gates.json        ${GATES_PATH}`);
  say(`  desktop.ceilingFps         ${ceilingFps}`);
  say(`  desktop.idle3s.minFps      ${minFpsSpec}`);
  say(`  desktop.idle3s.maxLong33   ${maxLong33Spec}`);
  say(
    `  desktop.undoBurst          minFps ${undoMinFpsSpec} (real Safari, manual lane) · ciMinPctOfCeiling ${undoPct} (this lane)`,
  );
  say(
    `  boot.tbt                   maxTbtMs ${bootMaxTbtMs} over a ${bootWindowMs}ms window at ${bootThrottle}× CPU`,
  );
  if (OVERRIDE_FPS !== null)
    say(
      `  !! CANARY OVERRIDE  --idle-fps-min ${OVERRIDE_FPS}  (gates.json says ${minFpsSpec})`,
    );
  if (OVERRIDE_LONG33 !== null)
    say(
      `  !! CANARY OVERRIDE  --max-long33 ${OVERRIDE_LONG33}  (gates.json says ${maxLong33Spec})`,
    );
  say(
    `derived ratio     minFps/ceilingFps = ${minFps}/${ceilingFps} = ${ratio.toFixed(5)}`,
  );
  say(
    `declared fraction undoBurst.ciMinPctOfCeiling = ${undoRatio.toFixed(5)} (× this harness's own measured ceiling)`,
  );
  if (CANARY_FAIL)
    say(
      `  !! CANARY OVERRIDE  --canary-fail ${CANARY_FAIL}  (a synthetic instrument failure is injected for this engine)`,
    );
  say(
    `engines           ${ENGINES.join(", ")}   windows/engine ${RUNS}   port ${PORT}`,
  );
  say("");

  // ── dist ─────────────────────────────────────────────────────────────────────────────
  const haveDist = await isFile(join(DIST, "index.html"));
  if (FORCE_BUILD || !haveDist) {
    say(
      `building dist (${FORCE_BUILD ? "--build forced" : "no dist/index.html present"})…`,
    );
    // `npx vite build`, not `npm run build` — the same call playwright-throttle.config.ts
    // makes, for the same two reasons written there: it skips vue-tsc (the probes need a
    // bundled artifact, not a typecheck — that gate lives in the `frontend` lane), and it
    // skips the `prebuild` hook, which would re-run `make -C csp-solver/wasm wasm` and
    // rebuild the wasm this lane deliberately downloads as an artifact. Same bundler,
    // same config, same bytes.
    try {
      await run("npx", ["vite", "build", "--outDir", DIST, "--logLevel", "warn"], {
        cwd: FRONTEND_DIR,
      });
    } catch (e) {
      say(`SETUP ERROR: build failed — ${e.message}`);
      return 2;
    }
  }
  if (!(await isFile(join(DIST, "index.html")))) {
    say(`SETUP ERROR: no dist at ${DIST}`);
    return 2;
  }
  const indexHtml = await readFile(join(DIST, "index.html"), "utf8");
  const entry = (indexHtml.match(/assets\/index-[A-Za-z0-9_-]+\.js/) || [
    "(entry not found)",
  ])[0];
  say(`dist              ${DIST}`);
  say(`entry             ${entry}`);
  // Banked with every run: a frame-timing number read off a loaded host is not a fact about
  // the surface, and the reader must be able to see that without asking.
  say(
    `host              ${cpus().length} cpus, load ${loadavg()
      .map((n) => n.toFixed(2))
      .join(" / ")} (1/5/15m) at start`,
  );
  say(`started           ${new Date().toISOString()}`);
  say("");

  // ── server ───────────────────────────────────────────────────────────────────────────
  await mkdir(join(RIG_DIR, "runs"), { recursive: true });
  const server = spawn(
    process.execPath,
    [join(RIG_DIR, "probe-server.mjs"), "--port", String(PORT), "--dist", DIST],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let serverLog = "";
  server.stdout.on("data", (d) => (serverLog += d));
  server.stderr.on("data", (d) => (serverLog += d));
  const killServer = () => {
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("exit", killServer);
  process.on("SIGINT", () => {
    killServer();
    process.exit(130);
  });

  let code;
  try {
    if (!(await waitForPing(15000))) {
      say(`INSTRUMENT FAILURE: probe-server never answered on :${PORT}`);
      say(serverLog.slice(0, 2000));
      return 3;
    }
    say(`probe-server up on :${PORT}`);
    say("");

    const { chromium, webkit } = await import("playwright");
    const TYPES = { chromium, webkit };
    // Every measured result, plus every engine that failed to produce one. Nothing here
    // returns mid-loop: the whole point of the T7-W6 fix is that a measured breach on engine 1
    // survives whatever engine 2 does. Grading happens once, after the loop, over `results`.
    const results = [];
    const setupErrors = [];
    const instrumentFails = [];

    // Engine names are validated BEFORE anything is measured, so a typo can never be the
    // early return that eats a verdict. It stays a setup error either way — this just moves
    // it to the only place where nothing has been measured yet.
    const unknown = ENGINES.filter((n) => !TYPES[n]);
    if (unknown.length) {
      say(`SETUP ERROR: unknown engine(s) ${unknown.join(", ")} (chromium|webkit)`);
      return 2;
    }

    for (const name of ENGINES) {
      const type = TYPES[name];
      const browser = await type.launch();
      try {
        // (0) warm the engine. A browser's FIRST page pays compositor spin-up and JIT
        //     warm-up; measured cold, WebKit's own control page read 74.67 fps with 10 long
        //     frames, then 98.2 fps with 0 once warm. A cold denominator is a false-green
        //     machine (a low ceiling makes the ratio gate trivial), so it is never measured.
        const warm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await warm.goto(`http://127.0.0.1:${PORT}/`, {
          waitUntil: "load",
          timeout: 60000,
        });
        await warm.waitForTimeout(2500);
        await warm.close();

        // (1) CONTROL and WINDOW, INTERLEAVED — control₁, window₁, control₂, window₂, …
        //
        //     P-W4's instrument law, learned the hard way: an identical bundle slid
        //     galleryGlide 85.16 → 81.33 over 23 minutes of monotone drift, so those cells
        //     "adjudicate interleaved-or-quiesced only" (p-w4-validate-deploy.md:46-54). A
        //     block design — every control, then every window — maps any drift in host load
        //     onto the windows alone and reads it as a regression. Interleaved, a load spike
        //     lands on the control too, where the validity check below can see it.
        //
        //     The control is the app-free /__ceiling page (r1-rig-baseline.md §2: "the
        //     denominator every app number is read against"); on both real surfaces it holds
        //     its ceiling with ZERO long frames.
        const ceilRuns = [];
        const windows = [];
        const undoWindows = [];
        const bootLines = [];
        let envLine = null;
        const pageErrors = [];
        let ceilingMissing = null;
        let throttleError = null;
        for (let i = 1; i <= RUNS; i++) {
          const ceilId = `ci-${name}-ceiling-${process.pid}-${i}`;
          const ceil = await drive(
            browser,
            `http://127.0.0.1:${PORT}/__ceiling?__run=${ceilId}&__ms=3000`,
            ceilId,
            30000,
          );
          const line = ceil.posted.find((l) => l.scenario === "rafCeiling");
          if (!line || typeof line.fps !== "number") {
            ceilingMissing = `no rafCeiling line on window ${i} (done=${ceil.done})`;
            break;
          }
          ceilRuns.push(line);

          // idle3s then undoBurst, in the drivers' own state-safe order and in ONE page load:
          // undoBurst's prepare deals a board, which is exactly why it never runs first.
          const idleId = `ci-${name}-idle-${process.pid}-${i}`;
          const idle = await drive(
            browser,
            `http://127.0.0.1:${PORT}/?__run=${idleId}&__scenarios=idle3s,undoBurst`,
            idleId,
            120000,
          );
          windows.push(...idle.posted.filter((l) => l.scenario === "idle3s"));
          undoWindows.push(...idle.posted.filter((l) => l.scenario === "undoBurst"));
          envLine ??= idle.posted.find((l) => l.kind === "env");
          pageErrors.push(...idle.pageErrors);

          // BOOT TBT gets its OWN load. It is a fact about a page coming up, so it cannot
          // share a load with a scenario that has already driven the app, and it is measured
          // under gates.json's own CPU throttle rate — the condition its floor was derived at.
          const bootId = `ci-${name}-boot-${process.pid}-${i}`;
          const throttled = name === "chromium" ? { cpuThrottle: bootThrottle } : {};
          let boot;
          try {
            boot = await drive(
              browser,
              `http://127.0.0.1:${PORT}/?__run=${bootId}&__scenarios=bootTbt&__bootMs=${bootWindowMs}`,
              bootId,
              120000,
              throttled,
            );
          } catch (e) {
            throttleError = `boot window ${i}: ${e.message}`;
            break;
          }
          const bl = boot.posted.find((l) => l.scenario === "bootTbt");
          if (bl) bootLines.push(bl);
          pageErrors.push(...boot.pageErrors);
        }
        if (ceilingMissing) {
          say(`## ${name}`);
          say(`  INSTRUMENT FAILURE: ${ceilingMissing}`);
          say("");
          instrumentFails.push({ name, why: ceilingMissing });
          continue;
        }
        if (throttleError) {
          say(`## ${name}`);
          say(
            `  SETUP ERROR: ${bootThrottle}× CPU throttling could not be applied — ${throttleError}`,
          );
          say(
            `  gates.json's boot.tbt floor is derived AT that rate; an unthrottled window read against it`,
          );
          say(`  is a different measurement, not a lenient one. Refusing to grade it.`);
          say("");
          setupErrors.push({ name, why: `cpu throttling unavailable: ${throttleError}` });
          continue;
        }
        const ceilFps = median(ceilRuns.map((l) => l.fps));
        const ceilLong33 = median(ceilRuns.map((l) => l.long33));
        const errored = windows.filter((l) => l.error);
        const clean = windows.filter(
          (l) => !l.error && !l.tainted && typeof l.fps === "number",
        );

        say(`## ${name}`);
        say(`  UA        ${(envLine || {}).ua || "?"}`);
        for (const [i, c] of ceilRuns.entries()) {
          say(
            `  control ${i + 1}  fps ${r2(c.fps)}  p50 ${r2(c.p50)}  p95 ${r2(c.p95)}  long33 ${c.long33}  long50 ${c.long50}  worst ${r2(c.worstMs)}ms  ~${c.displayHzEst}Hz`,
          );
          const w = windows[i];
          say(
            !w
              ? `  window ${i + 1}   (missing)`
              : w.error
                ? `  window ${i + 1}   ERROR ${String(w.error).split("\n")[0].slice(0, 90)}`
                : `  window ${i + 1}   fps ${r2(w.fps)}  p50 ${r2(w.p50)}  p95 ${r2(w.p95)}  long33 ${w.long33}  long50 ${w.long50}  worst ${r2(w.worstMs)}ms  frames ${w.frames}  wall ${w.wallMs}ms  attempt ${w.attempt}${w.tainted ? "  TAINTED" : ""}`,
          );
        }
        say(`  control median ${r2(ceilFps)} fps / long33 ${ceilLong33}`);
        for (const [i, u] of undoWindows.entries())
          say(
            u.error
              ? `  undoBurst ${i + 1} ERROR ${String(u.error).split("\n")[0].slice(0, 90)}`
              : `  undoBurst ${i + 1} fps ${r2(u.fps)}  p50 ${r2(u.p50)}  p95 ${r2(u.p95)}  long33 ${u.long33}  worst ${r2(u.worstMs)}ms  attempt ${u.attempt}${u.tainted ? "  TAINTED" : ""}`,
          );
        for (const [i, b] of bootLines.entries())
          say(
            b.error
              ? `  bootTbt ${i + 1}   ERROR ${String(b.error).split("\n")[0].slice(0, 90)}`
              : `  bootTbt ${i + 1}   longtask ${b.longtaskSupported ? "yes" : "NO"}  tbt ${b.tbtMs === null ? "—" : `${b.tbtMs}ms`}  tasks ${b.tasks ?? "—"}  longest ${b.longestTaskMs ?? "—"}ms  anchor ${b.cpuAnchorMs ?? "—"}ms  window ${b.bootWindowMs}ms  painted ${b.boardPainted}`,
          );
        if (pageErrors.length) say(`  page errors: ${pageErrors.join(" | ")}`);

        // A median wants a majority of clean windows behind it. Fewer means the instrument
        // failed, which is a different fact from the surface being slow — never conflate them.
        const needed = Math.ceil(RUNS / 2);
        if (clean.length < needed) {
          const why = `${clean.length}/${RUNS} clean idle windows (need ${needed}); ${errored.length} errored, ${windows.filter((w) => w.tainted).length} tainted`;
          say(`  INSTRUMENT FAILURE: ${why}`);
          say("");
          instrumentFails.push({ name, why });
          continue;
        }

        // CONTROL VALIDITY. The ceiling page has no app on it: nothing to style, nothing to
        // raster, one rAF counter. If THAT breaches the long-frame threshold, the host — not
        // the surface — is dropping frames, and no verdict may be issued from it. This is the
        // one thing standing between a contended runner and a fabricated RED (or, via a
        // depressed denominator, a fabricated GREEN). Never relax it into the app's favour.
        // Judged against the COMMITTED spec, never a canary override: whether the harness is
        // fit to measure is a fact about the harness, and a canary must not be able to switch
        // the fitness check off.
        // `--canary-fail` injects the failure right here, at the real site, so the ablation
        // exercises the production path rather than a bypass around it.
        if (ceilLong33 > maxLong33Spec || CANARY_FAIL === name) {
          const synthetic = CANARY_FAIL === name && ceilLong33 <= maxLong33Spec;
          say(
            synthetic
              ? `  INSTRUMENT FAILURE: SYNTHETIC (--canary-fail ${name}) — the control held (${ceilLong33} long frames), the failure is injected.`
              : `  INSTRUMENT FAILURE: the app-free control dropped ${ceilLong33} frames >33.4ms (gates.json allows ${maxLong33Spec}).`,
          );
          say(
            `  The harness cannot hold its own frame budget on this host, so neither a GREEN nor a RED is`,
          );
          say(
            `  admissible for ${name}. Re-run on a quiescent machine. (r1-rig-baseline.md §2: both real`,
          );
          say(`  surfaces hold their ceiling with zero long frames.)`);
          say("");
          instrumentFails.push({
            name,
            why: synthetic
              ? `synthetic (--canary-fail ${name})`
              : `control dropped ${ceilLong33} long frames`,
          });
          continue;
        }

        const cleanUndo = undoWindows.filter(
          (w) => !w.error && !w.tainted && typeof w.fps === "number",
        );
        results.push({
          name,
          ceilingFps: ceilFps,
          ceilingLong33: ceilLong33,
          medFps: median(clean.map((w) => w.fps)),
          medLong33: median(clean.map((w) => w.long33)),
          clean: clean.length,
          windows: windows.length,
          // GATE C. Too few clean undoBurst windows is an instrument fact about THAT row and
          // is carried as such — the idle verdict for this engine still stands on its own.
          undoMedFps: cleanUndo.length >= needed ? median(cleanUndo.map((w) => w.fps)) : null,
          undoClean: cleanUndo.length,
          // GATE D. `longtaskSupported` is read, never inferred: an engine that reports no
          // tasks because it cannot see them must not be confused with one that had none.
          boot: bootLines,
        });
        say("");
      } finally {
        await browser.close();
      }
    }

    // ── verdict ────────────────────────────────────────────────────────────────────────
    // EVERY MEASURED RESULT IS GRADED, unconditionally, before any exit is chosen. This block
    // used to be reachable only when no engine took an early return; the engines that DID
    // measure had their verdicts thrown away by the ones that didn't.
    say("## verdict");
    say("");
    say(
      "| engine | control fps | control long33 | median idle fps | required (ratio×ceiling) | GATE B | median long33 | max | GATE A | undoBurst fps | required | GATE C |",
    );
    say("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    let breached = false;
    for (const r of results) {
      const required = ratio * r.ceilingFps;
      const undoRequired = undoRatio * r.ceilingFps;
      const bOk = r.medFps >= required;
      const aOk = r.medLong33 <= maxLong33;
      const cOk = r.undoMedFps === null ? null : r.undoMedFps >= undoRequired;
      if (!bOk || !aOk || cOk === false) breached = true;
      // An unmeasurable GATE C must not ride out as a green on the strength of GATE A/B. The
      // engine's idle verdict stands (it was measured); the undoBurst row is booked as the
      // instrument failure it is, and the run can no longer exit 0.
      if (cOk === null)
        instrumentFails.push({
          name: r.name,
          why: `undoBurst: ${r.undoClean}/${RUNS} clean windows — GATE C unmeasured, never assumed passed`,
        });
      say(
        `| ${r.name} | ${r2(r.ceilingFps)} | ${r.ceilingLong33} | ${r2(r.medFps)} | ${r2(required)} | ${bOk ? "PASS" : "**FAIL**"} | ${r.medLong33} | ${maxLong33} | ${aOk ? "PASS" : "**FAIL**"} | ${r.undoMedFps === null ? "—" : r2(r.undoMedFps)} | ${r2(undoRequired)} | ${cOk === null ? "NOT MEASURED" : cOk ? "PASS" : "**FAIL**"} |`,
      );
    }
    say("");

    // ── GATE D, boot TBT ───────────────────────────────────────────────────────────────
    // Support is asserted, not assumed, and the three outcomes are kept apart: MEASURED (a
    // verdict), NOT MEASURED (an engine with no `longtask` entry type — WebKit), and MISSING
    // (a probe that reported nothing at all, which is a setup fact about this rig, not a pass).
    say(
      `| engine | longtask | median boot TBT | max (${bootThrottle}× CPU, ${bootWindowMs}ms window) | GATE D |`,
    );
    say("| --- | --- | --- | --- | --- |");
    const bootMeasured = [];
    let bootUnsupported = 0;
    for (const r of results) {
      const lines2 = (r.boot || []).filter((b) => !b.error);
      const supportBits = lines2.map((b) => b.longtaskSupported);
      if (!lines2.length || supportBits.some((s) => typeof s !== "boolean")) {
        say(`| ${r.name} | ? | — | ${bootMaxTbtMs} | **MISSING** |`);
        setupErrors.push({
          name: r.name,
          why: "the bootTbt probe reported no usable longtask-support bit — support may never be inferred from an empty task list",
        });
        continue;
      }
      if (!supportBits.every(Boolean)) {
        say(`| ${r.name} | NO | — | ${bootMaxTbtMs} | NOT MEASURED |`);
        bootUnsupported++;
        continue;
      }
      const med = median(lines2.map((b) => b.tbtMs));
      const dOk = med <= bootMaxTbtMs;
      if (!dOk) breached = true;
      bootMeasured.push({ name: r.name, med });
      say(
        `| ${r.name} | yes | ${r2(med)}ms | ${bootMaxTbtMs} | ${dOk ? "PASS" : "**FAIL**"} |`,
      );
    }
    // GATE D's MISSING DENOMINATOR, measured and reported — DIAGNOSTIC, gates nothing (T7-W3,
    // 2026-08-03). GATE B is portable because it divides by a ceiling this harness measures
    // per host; GATE D is an absolute in ms and is therefore a fact about the HOST CLASS as
    // much as about the bundle — head 6d612ec5 read 373 ms here and 1276/1333 ms on the
    // runner, same task census, no regression between them. The fps ceiling cannot serve as
    // the denominator (it is a frame-scheduler cap: the runner reports p50 = p95 = 16.7 ms),
    // so probe.js measures one directly, under the same throttle, after the window closes.
    // `tbt/anchor` is the candidate portable column: if it holds across host classes at n>=3,
    // WGATE transposes GATE D onto it the way GATE B is transposed and the absolute retires;
    // if it does not, the transposition is refuted BY MEASUREMENT and the runner-derived
    // absolute stands. Either way WGATE reads a number instead of guessing one.
    const anchored = results
      .map((r) => {
        const bl = (r.boot || []).filter((b) => !b.error && typeof b.cpuAnchorMs === "number");
        if (!bl.length) return null;
        const tbts = bl.filter((b) => typeof b.tbtMs === "number").map((b) => b.tbtMs);
        return {
          name: r.name,
          // Only chromium's boot load is throttled — CDP is chromium-only, and an anchor read
          // at 1× against one read at 4× is a different measurement, so the rate is printed.
          rate: r.name === "chromium" ? bootThrottle : 1,
          anchorMs: median(bl.map((b) => b.cpuAnchorMs)),
          n: bl[0].cpuAnchorN,
          tbt: tbts.length ? median(tbts) : null,
        };
      })
      .filter(Boolean);
    if (anchored.length) {
      say("");
      say(
        `host CPU anchor — DIAGNOSTIC, gates nothing; the portable column GATE D would need (see the block comment):`,
      );
      say("| engine | throttle | anchor ms (fixed work, min of 3) | median boot TBT | tbt/anchor |");
      say("| --- | --- | --- | --- | --- |");
      for (const a of anchored)
        say(
          `| ${a.name} | ${a.rate}× | ${r2(a.anchorMs)} (${a.n} iter) | ${a.tbt === null ? "—" : `${r2(a.tbt)}ms`} | ${a.tbt === null ? "—" : r2(a.tbt / a.anchorMs)} |`,
        );
    }
    if (results.length && !bootMeasured.length && bootUnsupported === results.length) {
      say("");
      say(
        `SETUP ERROR: no engine in this run could measure boot TBT — none of ${ENGINES.join(", ")} ships the`,
      );
      say(
        `  \`longtask\` entry type. A GATE D green from an instrument that ran nowhere is vacuous, so the`,
      );
      say(
        `  run refuses one. Include chromium, or drop the row from gates.json and say why.`,
      );
      setupErrors.push({
        name: ENGINES.join("+"),
        why: "boot TBT measured on no engine (no longtask entry type anywhere in this run)",
      });
    }
    say("");
    say(
      "advisory (NOT gating) — absolute fps against gates.json's real-Safari anchor:",
    );
    for (const r of results)
      say(
        `  ${r.name}: ${r2(r.medFps)} fps vs ${minFps} — the anchor assumes a ${ceilingFps} fps ceiling; this harness measured ${r2(r.ceilingFps)}. Absolute comparison is a category error and is reported only for the record.`,
      );
    say("");
    for (const r of results) {
      const required = ratio * r.ceilingFps;
      if (r.medFps < required)
        say(
          `BREACH [${r.name}] idle fps: measured ${r2(r.medFps)} < required ${r2(required)} (${(ratio * 100).toFixed(3)}% of the ${r2(r.ceilingFps)} fps harness ceiling, derived from gates.json ${minFps}/${ceilingFps})`,
        );
      if (r.medLong33 > maxLong33)
        say(
          `BREACH [${r.name}] long-frame census: measured ${r.medLong33} frames >33.4ms > allowed ${maxLong33} (gates.json desktop.idle3s.maxLong33)`,
        );
      const undoRequired = undoRatio * r.ceilingFps;
      if (r.undoMedFps !== null && r.undoMedFps < undoRequired)
        say(
          `BREACH [${r.name}] undoBurst fps: measured ${r2(r.undoMedFps)} < required ${r2(undoRequired)} (${(undoRatio * 100).toFixed(3)}% of the ${r2(r.ceilingFps)} fps harness ceiling, gates.json desktop.undoBurst.ciMinPctOfCeiling)`,
        );
    }
    for (const b of bootMeasured)
      if (b.med > bootMaxTbtMs)
        say(
          `BREACH [${b.name}] boot TBT: measured ${r2(b.med)}ms > allowed ${bootMaxTbtMs}ms over the first ${bootWindowMs}ms at ${bootThrottle}× CPU (gates.json boot.tbt.maxTbtMs)`,
        );
    for (const f of instrumentFails) say(`NOT MEASURED [${f.name}] — ${f.why}`);
    for (const f of setupErrors) say(`SETUP ERROR [${f.name}] — ${f.why}`);
    say("");
    say(
      `host at finish    load ${loadavg()
        .map((n) => n.toFixed(2))
        .join(" / ")} (1/5/15m) · ${new Date().toISOString()}`,
    );
    // THE EXIT CODE, chosen from every fact this run collected rather than from the first one
    // that wanted to leave. A breach outranks everything: it is a fact about the bundle, and a
    // host that later failed to measure a SECOND engine cannot un-measure the first.
    say("");
    if (breached) {
      say(
        `RESULT: RED — at least one gates.json threshold breached${
          instrumentFails.length || setupErrors.length
            ? ` (and ${instrumentFails.length + setupErrors.length} engine-row(s) did not measure — listed above; the breach stands regardless)`
            : ""
        }.`,
      );
      code = 1;
    } else if (setupErrors.length) {
      say(
        `RESULT: SETUP ERROR — no threshold breached on what was measured, but ${setupErrors.length} row(s) could not be graded.`,
      );
      code = 2;
    } else if (instrumentFails.length) {
      say(
        `RESULT: INADMISSIBLE — no threshold breached on what was measured, but ${instrumentFails.length} engine(s) never produced an admissible window. No verdict.`,
      );
      code = 3;
    } else {
      say("RESULT: GREEN — every gates.json threshold held on every engine.");
      code = 0;
    }
  } finally {
    killServer();
    if (OUT) await writeFile(resolve(OUT), `${lines.join("\n")}\n`, "utf8");
  }
  return code;
}

process.exit(await main());
