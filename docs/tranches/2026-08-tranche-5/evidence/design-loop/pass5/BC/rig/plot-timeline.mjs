/**
 * plot-timeline.mjs — the DELTA timeline crops for the drawer-open stall row.
 *
 * Reads the rig's own jsonl reps and draws the rAF frame curve across the 900ms window after
 * the drawer-open click, with the bake-path events marked on the same axis. One PNG per arm,
 * same scales, so the crops are comparable by eye and not only by table.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = resolve(HERE, "..", "runs");
const SHOTS = resolve(HERE, "..", "shots");
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);
const webkit = PW.webkit ?? PW.default?.webkit;

const W = 900,
  H = 300,
  PAD = 46,
  YMAX = 320;

const svgFor = (title, sub, rep) => {
  const { clickAt, sampleT0, frames, events } = rep.raw;
  let t = sampleT0;
  const pts = [];
  for (const d of frames) {
    t += d;
    const x = t - clickAt;
    if (x >= -20 && x <= 900) pts.push([x, d]);
  }
  const px = (x) => PAD + (x / 900) * (W - PAD - 12);
  const py = (y) => H - 40 - (Math.min(y, YMAX) / YMAX) * (H - 40 - 20);
  const bars = pts
    .map(
      ([x, y]) =>
        `<rect x="${px(x).toFixed(1)}" y="${py(y).toFixed(1)}" width="2.2" height="${(
          H -
          40 -
          py(y)
        ).toFixed(1)}" fill="${y >= 100 ? "#c0392b" : y >= 50 ? "#e08a1e" : "#4a6fa5"}"/>`,
    )
    .join("");
  const marks = events
    .filter((e) => ["svgBlob", "drawImage", "toBlob", "convertToBlob", "createImageBitmap"].includes(e.n))
    .map((e) => {
      const x = px(e.at - clickAt);
      const c = { svgBlob: "#888", drawImage: "#2e8b57", toBlob: "#8e44ad", convertToBlob: "#8e44ad", createImageBitmap: "#d35400" }[e.n];
      return `<circle cx="${x.toFixed(1)}" cy="${H - 26}" r="3" fill="${c}" opacity="0.85"/>`;
    })
    .join("");
  const grid = [0, 50, 100, 200, 300]
    .map(
      (v) =>
        `<line x1="${PAD}" y1="${py(v)}" x2="${W - 12}" y2="${py(
          v,
        )}" stroke="#ddd" stroke-width="1"/><text x="6" y="${(py(v) + 4).toFixed(
          1,
        )}" font-size="11" fill="#666" font-family="monospace">${v}ms</text>`,
    )
    .join("");
  const ticks = [0, 200, 400, 600, 800]
    .map(
      (v) =>
        `<text x="${px(v).toFixed(1)}" y="${H - 6}" font-size="11" fill="#666" text-anchor="middle" font-family="monospace">+${v}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#fff"/>
${grid}
<line x1="${px(0)}" y1="14" x2="${px(0)}" y2="${H - 40}" stroke="#111" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="${px(0) + 5}" y="24" font-size="11" fill="#111" font-family="monospace">drawer-open click</text>
${bars}${marks}${ticks}
<text x="${PAD}" y="${H - 44}" font-size="0" fill="none"></text>
<text x="6" y="14" font-size="13" font-weight="bold" fill="#111" font-family="monospace">${title}</text>
<text x="${W - 12}" y="14" font-size="11" fill="#444" text-anchor="end" font-family="monospace">${sub}</text>
</svg>`;
};

const load = (id) =>
  readFileSync(resolve(RUNS, `${id}.jsonl`), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((x) => x.kind === "rep");

const CELLS = [
  ["p5-shipped-dpr2", "AFTER — pencil-boil 0.11.0 adopted (HEAD dist)", "timeline-AFTER-shipped"],
  ["p5-ablate-dpr2", "ABLATION — the deleted round trip put back", "timeline-BEFORE-ablate"],
  ["p5-pin-dpr2", "CONTROL — board + wordmark pinned (0 bakes)", "timeline-CONTROL-pin"],
  ["p5-pinlogo-dpr2", "APPORTION — grid bake only (wordmark pinned)", "timeline-APPORTION-gridonly"],
  ["p5-pinboard-dpr2", "APPORTION — wordmark bake only (grid pinned)", "timeline-APPORTION-logoonly"],
];

mkdirSync(SHOTS, { recursive: true });
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
for (const [id, title, out] of CELLS) {
  const reps = load(id);
  // The MEDIAN rep by worst gap — not the friendliest, not the worst.
  const rep = [...reps].sort((a, b) => a.worstGapMs - b.worstGapMs)[Math.floor(reps.length / 2)];
  const sub = `worst ${rep.worstGapMs}ms · blocked600 ${rep.blocked600}ms · bakes ${rep.bakes} · rep #${rep.rep} of ${reps.length}`;
  const svg = svgFor(title, sub, rep);
  writeFileSync(resolve(SHOTS, `${out}.svg`), svg);
  await page.setContent(svg);
  await page.screenshot({ path: resolve(SHOTS, `${out}.png`) });
  console.log(`${out}.png  ${sub}`);
}
await browser.close();
