/**
 * summarize.mjs <runId…> — fold run JSONL into a markdown table (per-scenario × run),
 * plus the engine-identity and census blocks. Zero deps.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const RIG = dirname(fileURLToPath(import.meta.url));
const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("usage: node summarize.mjs <runId> [runId…]");
  process.exit(2);
}

const runs = new Map();
for (const id of ids) {
  const f = join(RIG, "runs", `${id}.jsonl`);
  if (!existsSync(f)) {
    console.error(`missing ${f}`);
    continue;
  }
  const lines = readFileSync(f, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  runs.set(id, lines);
}

const scenarioOrder = [];
for (const lines of runs.values())
  for (const l of lines)
    if (l.scenario && !scenarioOrder.includes(l.scenario)) scenarioOrder.push(l.scenario);

const cell = (l) =>
  l
    ? l.error
      ? `ERROR: ${String(l.error).split("\n")[0].slice(0, 60)}`
      : `${l.fps} / ${l.long50} / ${l.worstMs}${l.tainted ? " (tainted)" : ""}`
    : "—";

console.log(`### fps mean / long>50ms / worst ms\n`);
console.log(`| scenario | ${[...runs.keys()].join(" | ")} |`);
console.log(`| --- | ${[...runs.keys()].map(() => "---").join(" | ")} |`);
for (const s of scenarioOrder) {
  const cells = [...runs.values()].map((lines) => cell(lines.find((l) => l.scenario === s)));
  console.log(`| ${s} | ${cells.join(" | ")} |`);
}

console.log(`\n### detail (frames · wall · p50 · p95 · long>33 · jank ms)\n`);
for (const [id, lines] of runs) {
  console.log(`**${id}**\n`);
  console.log(`| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |`);
  console.log(`| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const s of scenarioOrder) {
    const l = lines.find((x) => x.scenario === s);
    if (!l) {
      console.log(`| ${s} | — | | | | | | | | | not run |`);
      continue;
    }
    if (l.error) {
      console.log(`| ${s} | — | | | | | | | | | ERROR ${String(l.error).split("\n")[0].slice(0, 70)} |`);
      continue;
    }
    const note = [
      l.actionError ? `action: ${l.actionError}` : "",
      l.teardownError ? `teardown: ${l.teardownError}` : "",
      l.displayHzEst ? `~${l.displayHzEst}Hz` : "",
      l.runningAnimations != null ? `anims running ${l.runningAnimations}` : "",
      l.focusEvents ? `**focus churn ${l.focusEvents}**` : "",
      l.hadFocus === false ? "**unfocused**" : "",
      l.tainted ? "**TAINTED**" : "",
      l.attempt > 1 ? `attempt ${l.attempt}` : "",
    ]
      .filter(Boolean)
      .join("; ");
    console.log(
      `| ${s} | ${l.fps} | ${l.frames} | ${l.wallMs} | ${l.p50} | ${l.p95} | ${l.long33} | ${l.long50} | ${l.worstMs} | ${l.jankMs} | ${note} |`,
    );
  }
  const w = lines.filter((l) => l.worst3 && l.worst3.length);
  if (w.length) {
    console.log(`\nworst-3 frames per scenario (ms @ offset ms):`);
    for (const l of w)
      console.log(
        `- ${l.scenario}: ${l.worst3.map((x) => `${x.ms}@${Math.round(x.atMs)}`).join(", ")}`,
      );
  }
  const env = lines.find((l) => l.kind === "env");
  if (env)
    console.log(
      `\nengine: ${env.ua}\nvendor=${env.vendor} dpr=${env.dpr} viewport=${env.innerWidth}x${env.innerHeight} screen=${env.screenW}x${env.screenH} hc=${env.hardwareConcurrency} touch=${env.maxTouchPoints} coarse=${env.coarsePointer} prm=${env.prefersReducedMotion} dark=${env.prefersDark} themePinned=${env.themePinned ?? "—"} htmlDark=${env.htmlDark ?? "—"} ablated=${env.ablated}`,
    );
  const c = lines.find((l) => l.kind === "census");
  if (c)
    console.log(
      `census: nodes=${c.nodes} filtered=${c.filteredElements} (html ${c.filteredHtmlElements}) willChange=${c.willChangeElements} transitionAll+dur=${c.transitionAllElements} poses=${JSON.stringify(c.posePairs)} anims=${JSON.stringify(c.animStates)}`,
    );
  const errs = lines.filter((l) => l.kind === "pageError" || l.kind === "pageRejection");
  if (errs.length)
    console.log(`page errors: ${errs.map((e) => `${e.kind}: ${e.error}`).join(" | ")}`);
  console.log("");
}
