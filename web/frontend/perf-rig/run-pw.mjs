#!/usr/bin/env node
/**
 * run-pw.mjs — the same probe URL, driven by a Playwright engine. `run-safari.sh`'s contract
 * (runId, scenarios, $EXTRA), one headed browser, no AppleScript.
 *
 * WHAT THIS LANE IS FOR, and the limit is the point: chromium here is a FOOTNOTE engine. It
 * exists so a solver number has a second reading to sit beside and so a probe change can be
 * smoke-tested in ten seconds instead of by taking the desktop over. A platform claim closes on
 * that platform's real engine — Playwright WebKit is not Safari, which is the whole reason
 * `run-safari.sh` and `run-sim.sh` exist, and nothing measured here may be quoted as a Safari
 * or an iOS fact.
 *
 * Headed, not headless: an offscreen page gets a software rasteriser and a synthetic vsync, and
 * the frame curve that comes out is an artefact. `--headless` is available anyway for the
 * selector smoke, where no number is being taken.
 *
 * Usage: node run-pw.mjs <runId> [scenarios] [--engine chromium|webkit] [--headless]
 *        EXTRA='game=sudoku&size=3' PORT=4244 node run-pw.mjs …
 */
import process from "node:process";

const argv = process.argv.slice(2);
const flag = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));

const RUN = positional[0];
const SCENARIOS = positional[1] || "idle3s,liveWindow";
const ENGINE = flag("--engine", "chromium");
const HEADLESS = argv.includes("--headless");
const PORT = Number(process.env.PORT || 4244);
const TIMEOUT = Number(process.env.TIMEOUT || 180) * 1000;

if (!RUN) {
  process.stderr.write("usage: run-pw.mjs <runId> [scenarios] [--engine chromium|webkit]\n");
  process.exit(2);
}

const ping = await fetch(`http://localhost:${PORT}/__ping`).catch(() => null);
if (!ping?.ok) {
  process.stderr.write(`probe-server not answering on :${PORT}\n`);
  process.exit(2);
}

let url = `http://localhost:${PORT}/?__run=${RUN}&__scenarios=${SCENARIOS}`;
if (SCENARIOS === "rafCeiling") url = `http://localhost:${PORT}/__ceiling?__run=${RUN}`;
else if (process.env.EXTRA) url += `&${process.env.EXTRA}`;

const pw = await import("playwright");
const browser = await pw[ENGINE].launch({ headless: HEADLESS });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error") process.stdout.write(`  [page error] ${m.text().slice(0, 200)}\n`);
});

process.stdout.write(`run ${RUN} → ${SCENARIOS} · ${ENGINE}${HEADLESS ? " headless" : ""}\n`);
await page.goto(url, { waitUntil: "domcontentloaded" });

const deadline = Date.now() + TIMEOUT;
let status = 3;
while (Date.now() < deadline) {
  const body = await fetch(`http://localhost:${PORT}/__runs/${RUN}`).then((r) => r.text());
  if (body.includes('"done":true')) {
    status = 0;
    break;
  }
  await new Promise((r) => setTimeout(r, 1500));
}
process.stdout.write(
  status === 0 ? `run ${RUN} complete\n` : `run ${RUN} TIMED OUT after ${TIMEOUT / 1000}s\n`,
);
await browser.close();
process.exit(status);
