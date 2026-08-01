#!/usr/bin/env node
/**
 * ci-subset.mjs — the CI-runnable slice of the P1 perf rig: idle fps + long-frame(>33.4ms)
 * census on the BUILT DIST, in headless chromium AND webkit, against the thresholds committed
 * in the P1 patch's own gates.json. Exits nonzero on breach.
 *
 * WHY THIS EXISTS. `patches/p1-safari-ios-performance/gates.json` has been a committed
 * threshold file with no executor since the patch sealed: a regression to 79 fps idle passed
 * every CI lane. This is the executor for the two rows that survive a headless runner. The
 * sim, GPU-attribution and interaction rows (deal/solveCelebration/themeToggle/galleryGlide)
 * stay a MANUAL lane — see README.md; they need real Safari, a real simulator, and `ps`-level
 * process attribution that no ubuntu runner can give.
 *
 * ── THE GATE RULE, pre-registered ─────────────────────────────────────────────────────────
 * Two assertions, both derived from gates.json at run time. Nothing here is a literal.
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
 *   The absolute fps against the absolute 97 is printed as ADVISORY and does NOT gate. It is
 *   labelled with the measured ceiling so it cannot be misread as a real-Safari number.
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

/** Drive one page load to completion, then hand back its posted JSONL lines. */
async function drive(browserType, url, runId, timeoutMs) {
  const page = await browserType.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
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
  for (const [k, v] of [
    ["desktop.ceilingFps", ceilingFps],
    ["desktop.idle3s.minFps", minFpsSpec],
    ["desktop.idle3s.maxLong33", maxLong33Spec],
  ]) {
    if (typeof v !== "number") {
      say(`SETUP ERROR: ${GATES_PATH} is missing a numeric ${k}`);
      return 2;
    }
  }
  const minFps = OVERRIDE_FPS ?? minFpsSpec;
  const maxLong33 = OVERRIDE_LONG33 ?? maxLong33Spec;
  const ratio = minFps / ceilingFps;

  say("# perf-rig CI subset — idle fps + long-frame census on the built dist");
  say("");
  say(`gates.json        ${GATES_PATH}`);
  say(`  desktop.ceilingFps         ${ceilingFps}`);
  say(`  desktop.idle3s.minFps      ${minFpsSpec}`);
  say(`  desktop.idle3s.maxLong33   ${maxLong33Spec}`);
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
    const results = [];

    for (const name of ENGINES) {
      const type = TYPES[name];
      if (!type) {
        say(`SETUP ERROR: unknown engine "${name}" (chromium|webkit)`);
        return 2;
      }
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
        let envLine = null;
        const pageErrors = [];
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
            say(`INSTRUMENT FAILURE [${name}]: no rafCeiling line (done=${ceil.done})`);
            return 3;
          }
          ceilRuns.push(line);

          const idleId = `ci-${name}-idle-${process.pid}-${i}`;
          const idle = await drive(
            browser,
            `http://127.0.0.1:${PORT}/?__run=${idleId}&__scenarios=idle3s`,
            idleId,
            90000,
          );
          windows.push(...idle.posted.filter((l) => l.scenario === "idle3s"));
          envLine ??= idle.posted.find((l) => l.kind === "env");
          pageErrors.push(...idle.pageErrors);
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
        if (pageErrors.length) say(`  page errors: ${pageErrors.join(" | ")}`);

        // A median wants a majority of clean windows behind it. Fewer means the instrument
        // failed, which is a different fact from the surface being slow — never conflate them.
        const needed = Math.ceil(RUNS / 2);
        if (clean.length < needed) {
          say(
            `  INSTRUMENT FAILURE: ${clean.length}/${RUNS} clean windows (need ${needed}); ${errored.length} errored, ${windows.filter((w) => w.tainted).length} tainted`,
          );
          say("");
          return 3;
        }

        // CONTROL VALIDITY. The ceiling page has no app on it: nothing to style, nothing to
        // raster, one rAF counter. If THAT breaches the long-frame threshold, the host — not
        // the surface — is dropping frames, and no verdict may be issued from it. This is the
        // one thing standing between a contended runner and a fabricated RED (or, via a
        // depressed denominator, a fabricated GREEN). Never relax it into the app's favour.
        // Judged against the COMMITTED spec, never a canary override: whether the harness is
        // fit to measure is a fact about the harness, and a canary must not be able to switch
        // the fitness check off.
        if (ceilLong33 > maxLong33Spec) {
          say(
            `  INSTRUMENT FAILURE: the app-free control dropped ${ceilLong33} frames >33.4ms (gates.json allows ${maxLong33Spec}).`,
          );
          say(
            `  The harness cannot hold its own frame budget on this host, so neither a GREEN nor a RED is`,
          );
          say(
            `  admissible for ${name}. Re-run on a quiescent machine. (r1-rig-baseline.md §2: both real`,
          );
          say(`  surfaces hold their ceiling with zero long frames.)`);
          say("");
          return 3;
        }

        results.push({
          name,
          ceilingFps: ceilFps,
          ceilingLong33: ceilLong33,
          medFps: median(clean.map((w) => w.fps)),
          medLong33: median(clean.map((w) => w.long33)),
          clean: clean.length,
          windows: windows.length,
        });
        say("");
      } finally {
        await browser.close();
      }
    }

    // ── verdict ────────────────────────────────────────────────────────────────────────
    say("## verdict");
    say("");
    say(
      "| engine | control fps | control long33 | median idle fps | required (ratio×ceiling) | GATE B | median long33 | max | GATE A |",
    );
    say("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    let breached = false;
    for (const r of results) {
      const required = ratio * r.ceilingFps;
      const bOk = r.medFps >= required;
      const aOk = r.medLong33 <= maxLong33;
      if (!bOk || !aOk) breached = true;
      say(
        `| ${r.name} | ${r2(r.ceilingFps)} | ${r.ceilingLong33} | ${r2(r.medFps)} | ${r2(required)} | ${bOk ? "PASS" : "**FAIL**"} | ${r.medLong33} | ${maxLong33} | ${aOk ? "PASS" : "**FAIL**"} |`,
      );
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
    }
    say("");
    say(
      `host at finish    load ${loadavg()
        .map((n) => n.toFixed(2))
        .join(" / ")} (1/5/15m) · ${new Date().toISOString()}`,
    );
    if (breached) {
      say("");
      say("RESULT: RED — at least one gates.json threshold breached.");
      code = 1;
    } else {
      say("RESULT: GREEN — every gates.json idle threshold held on every engine.");
      code = 0;
    }
  } finally {
    killServer();
    if (OUT) await writeFile(resolve(OUT), `${lines.join("\n")}\n`, "utf8");
  }
  return code;
}

process.exit(await main());
