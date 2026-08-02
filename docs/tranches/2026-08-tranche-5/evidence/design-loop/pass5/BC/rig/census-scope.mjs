/**
 * census-scope.mjs — MEASURE FIRST, then gate (pass-4 BC-M2).
 *
 * The mixed-face ledger is checked one direction only and the census is one game, one
 * viewport, one regime. Before widening the gate, find out which cells actually PRODUCE which
 * ledger rows — a both-directions check whose cell set cannot cover the ledger would red on
 * arrival and teach nothing.
 *
 * Runs the spec's own MIXED_FACE probe verbatim against the built dist, cell by cell, and
 * prints the union + the per-cell attribution + the ledger rows nobody produced.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "logs");
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);
const webkit = PW.webkit ?? PW.default?.webkit;
const chromium = PW.chromium ?? PW.default?.chromium;

const SPEC = readFileSync(resolve(FE, "..", "e2e", "font-census.spec.ts"), "utf8");
// Lift the LEDGER keys straight out of the spec so the probe cannot drift from the gate.
const LEDGER_KEYS = [...SPEC.matchAll(/^\s{2}"([^"]+)":/gm)].map((m) => m[1]);
// Lift MIXED_FACE's body out of the spec and evaluate it in the page — same code, no copy.
const body = SPEC.slice(SPEC.indexOf("const MIXED_FACE = () => {"));
const MIXED_SRC = body.slice(0, body.indexOf("\n};") + 3);
// Strip the TS with the app's own esbuild — a hand-rolled type stripper is exactly the kind of
// instrument that quietly changes the code it claims to reuse.
const esbuild = (await import(pathToFileURL(createRequire(FE).resolve("esbuild")).href)).default;
const JS = (await esbuild.transform(MIXED_SRC, { loader: "ts" })).code;
const MIXED_FN = `(() => { ${JS} ; return MIXED_FACE(); })()`;

const port = +(process.argv.find((a) => a.startsWith("--port="))?.slice(7) ?? 4241);
const engine = process.argv.includes("--chromium") ? chromium : webkit;

const CELLS = [
  { id: "sudoku-fine-1280-open", game: "sudoku", vp: [1280, 800], mob: false, closeDrawer: false },
  { id: "sudoku-fine-1280-closed", game: "sudoku", vp: [1280, 800], mob: false, closeDrawer: true },
  { id: "sudoku-coarse-390", game: "sudoku", vp: [390, 844], mob: true, closeDrawer: false },
  { id: "kenken-fine-1280-open", game: "kenken", vp: [1280, 800], mob: false, closeDrawer: false },
  { id: "kenken-coarse-390", game: "kenken", vp: [390, 844], mob: true, closeDrawer: false },
  { id: "futoshiki-coarse-390", game: "futoshiki", vp: [390, 844], mob: true, closeDrawer: false },
];

const browser = await engine.launch();
const seen = new Map(); // key -> [cellIds]
const lines = [];
for (const c of CELLS) {
  const ctx = await browser.newContext({
    viewport: { width: c.vp[0], height: c.vp[1] },
    isMobile: c.mob,
    hasTouch: c.mob,
  });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${port}/?game=${c.game}&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForTimeout(1500);
  if (c.closeDrawer)
    await page.evaluate(() => {
      const t = document.querySelector(".drawer-tab");
      if (t && !document.documentElement.classList.contains("drawer-closed")) t.click();
    });
  await page.waitForTimeout(900);
  const { faces, mixed } = await page.evaluate(MIXED_FN);
  const keys = mixed.map((m) => `${m.face}|${m.shown}`);
  for (const k of keys) seen.set(k, [...(seen.get(k) ?? []), c.id]);
  lines.push(
    `${c.id.padEnd(28)} faces=${faces.length}  mixed=${mixed.length}  ${[...new Set(keys)].join(" · ")}`,
  );
  await ctx.close();
}
await browser.close();

const unproduced = LEDGER_KEYS.filter((k) => !seen.has(k));
const unledgered = [...seen.keys()].filter((k) => !LEDGER_KEYS.includes(k));
lines.push("");
lines.push(`LEDGER rows: ${LEDGER_KEYS.length}   observed across the cell set: ${LEDGER_KEYS.length - unproduced.length}`);
lines.push(`NOT produced by any cell (a both-directions check would red on these):`);
for (const k of unproduced) lines.push(`  ${k}`);
lines.push(`Observed but NOT in the ledger (a forward-direction red):`);
for (const k of unledgered) lines.push(`  ${k}  [${seen.get(k).join(",")}]`);
lines.push("");
lines.push("per-row attribution:");
for (const k of LEDGER_KEYS)
  lines.push(`  ${k.padEnd(28)} ${(seen.get(k) ?? ["—"]).join(", ")}`);

mkdirSync(OUT, { recursive: true });
const txt = lines.join("\n") + "\n";
writeFileSync(resolve(OUT, "census-scope.txt"), txt);
console.log(txt);
