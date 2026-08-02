/**
 * g4-encode.mjs — BC5-G4's instrument: does `HTMLCanvasElement.toBlob` forfeit an
 * off-main-thread PNG encode that `OffscreenCanvas.convertToBlob` would have kept?
 *
 * THE QUESTION, stated exactly. pencil-boil 0.11.0 moved the pose encode from
 * `OffscreenCanvas.convertToBlob` (on a second surface, reached through a
 * `createImageBitmap` copy) to `HTMLCanvasElement.toBlob` on the capture canvas itself.
 * That deleted a copy AND an encode — measured, banked, not in dispute. What was never
 * measured is whether the encode that REMAINS runs on a different thread in the two shapes.
 * Pass 5 recorded the fact that raised it: in the same WebKit session the eight surviving
 * `toBlob` calls ran ~63–287 ms apiece and the ablation arm's eight `convertToBlob` calls
 * ran ~9–18 ms apiece. That is a hint, not an answer — the two arms differed in more than
 * the API. This rig differs in NOTHING but the API.
 *
 * THE ISOLATION. All arms encode the SAME EIGHT canvases, painted once before any window
 * opens, at the real bake's real geometry, calibrated to the real bake's real PNG bytes
 * (pass-5 `p5-shipped-dpr2.jsonl` rep 1: 4 × 794×234 → 24,171–24,448 B and
 * 4 × 1320×1320 → 197,395–198,692 B). Nothing is drawn, serialized, copied or awaited
 * inside a measurement window; the window contains encodes and nothing else.
 *
 *   toBlob        — 8 × `HTMLCanvasElement.toBlob`, back to back. 0.11's shipped shape.
 *   convertToBlob — 8 × `OffscreenCanvas.convertToBlob`, back to back, on offscreen
 *                   surfaces populated BEFORE the window. 0.10's encode leg, its copy leg
 *                   deliberately excluded — this arm prices the encode, not the round trip.
 *   worker        — 8 encodes inside a `Worker`: an `ImageBitmap` per canvas, transferred
 *                   before the window, drawn and `convertToBlob`-ed off the main thread.
 *                   The ceiling: what a genuinely off-main-thread encode costs the gesture.
 *   idle          — the negative control. Same page, same sampler, same window, NO encode.
 *                   Whatever this arm reads is the harness's own floor and every other
 *                   arm's number is only meaningful above it.
 *
 * THE MEASUREMENT. A continuous rAF sampler runs for the life of the page. `blockedMs` is
 * the sum of rAF gaps >= 50 ms inside the window, `worstGapMs` the largest — the same two
 * statistics pass 5's `stall5.mjs` defined, kept verbatim so the numbers sit beside each
 * other. `wallMs` is call-to-last-blob. A main-thread encode shows as blockedMs ~ wallMs;
 * an off-thread encode shows as wallMs high with blockedMs at the idle arm's floor.
 *
 * THE IDENTITY GUARD. Every arm hashes all eight blobs (FNV-1a over the bytes) and the
 * runner asserts the three encode arms produce the SAME hashes: if they did not, the arms
 * would be encoding different pixels and the comparison would be void.
 *
 * HARNESS LIMIT, STATED FIRST BECAUSE IT IS LOAD-BEARING. This drives Playwright's WebKit,
 * not real Safari — pass 5's own limit, unchanged and not weakened here. It bounds what may
 * be concluded: absolute milliseconds do not transfer to Safari 26.4. What DOES transfer is
 * the threading fact, because "did the sampler stop" is a structural property of where the
 * encoder runs, and it is read here against an in-session negative control rather than
 * against a remembered number.
 *
 * usage: node g4-encode.mjs <engine> <arm> <runId> [--port=N] [--repeats=N]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = resolve(HERE, "..", "runs");
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);

const engineName = process.argv[2] ?? "webkit";
const arm = process.argv[3] ?? "toBlob";
const runId = process.argv[4] ?? `g4-${engineName}-${arm}`;
const port = +(process.argv.find((a) => a.startsWith("--port="))?.slice(7) ?? 4243);
const repeats = +(process.argv.find((a) => a.startsWith("--repeats="))?.slice(10) ?? 3);

const engine = PW[engineName] ?? PW.default?.[engineName];
if (!engine) throw new Error(`no such playwright engine: ${engineName}`);

const main = async () => {
  mkdirSync(RUNS, { recursive: true });
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 810 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") console.error("PAGE ERROR:", m.text());
  });
  await page.goto(`http://localhost:${port}/g4.html`);
  await page.waitForFunction(() => window.__g4ready === true, { timeout: 60000 });

  const env = await page.evaluate(() => ({
    ua: navigator.userAgent,
    dpr: devicePixelRatio,
    hasOffscreen: typeof OffscreenCanvas !== "undefined",
    hasConvertToBlob:
      typeof OffscreenCanvas !== "undefined" &&
      typeof OffscreenCanvas.prototype.convertToBlob === "function",
    hasCreateImageBitmap: typeof createImageBitmap === "function",
    hw: navigator.hardwareConcurrency ?? null,
  }));

  const reps = [];
  for (let i = 1; i <= repeats; i++) {
    reps.push({ rep: i, ...(await page.evaluate((a) => window.__g4run(a), arm)) });
  }

  const out = { kind: "run", runId, engine: engineName, arm, env, reps, ts: new Date().toISOString() };
  const lines = [JSON.stringify({ kind: "env", runId, engine: engineName, arm, ...env })];
  for (const r of reps) lines.push(JSON.stringify({ kind: "rep", runId, engine: engineName, arm, ...r }));
  writeFileSync(resolve(RUNS, `${runId}.jsonl`), lines.join("\n") + "\n");
  for (const r of reps)
    console.log(
      `${runId}#${r.rep}  wall ${String(r.wallMs).padStart(7)}  blocked ${String(
        r.blockedMs,
      ).padStart(7)}  worst ${String(r.worstGapMs).padStart(6)}  long100 ${r.longGaps100}` +
        `  frames ${String(r.framesInWindow).padStart(3)}  bytes ${r.totalBytes}  hash ${r.hash}`,
    );
  await browser.close();
  return out;
};

main().catch((e) => {
  console.error("RIG FAILED:", e.message);
  process.exit(1);
});
