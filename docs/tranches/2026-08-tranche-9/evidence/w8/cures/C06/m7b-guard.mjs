#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --engine chromium --viewport desk --port 4256 --out <out.jsonl>
// T9-W8 §8.2 cure C06 — T8-M7b's OWN PROOF, re-run against both arms.
// M7b's defect: the Teleport that carries the board into the gallery face (and home again)
// re-invented every written cell's `cell-reveal`, so the ink erased and re-dealt itself across
// the fold. Its cure is the snapshot/restore pair C06 edits, so C06 owes this number: the fold
// must still invent ZERO reveals. `animationstart` carries the name and the element, so the
// count is the event itself — no window, no sleep, no residue class to snapshot.
// C06 changes WHICH animations the restore custodies (it skips `useFlipGlide`'s tagged movers);
// a reveal is a CSS animation named `cell-reveal` and is never tagged, so the guard must read
// the same on both arms. Reads a FIXED dist. Never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const VIEW = arg("viewport", "desk");
const PORT = arg("port", "4256");
const OUT = arg("out", "/dev/stdout");
const CYCLES = Number(arg("cycles", "3"));
// `settled` folds a board whose wave has expired (the residue arm is gone — T8-W6's half of the
// cure carries that case). `inwave` folds while the boot deal's reveal wave is STILL RUNNING,
// which is the case M7b's snapshot/restore pair actually exists for: the restore has genuine
// phases to put back, and a move that re-invents shows as a burst of starts at the press.
const MODE = arg("mode", "settled");
const INWAVE_AT_MS = Number(arg("at", "700"));

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  },
};

const PROBE = () => {
  const W = (window.__M7B = { reveals: [], t0: 0 });
  document.addEventListener(
    "animationstart",
    (e) => {
      if (e.animationName !== "cell-reveal") return;
      W.reveals.push(+(performance.now() - W.t0).toFixed(1));
    },
    true,
  );
  W.mark = () => {
    W.reveals = [];
    W.t0 = performance.now();
    return W.t0;
  };
};

const run = async () => {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  await page.goto(url, { waitUntil: "load" });
  const rows = [];
  if (MODE === "inwave") {
    // Fold INTO the live wave. Everything the probe recorded before the press is the deal's
    // own; everything after is the move's, and M7b's guard says that number is zero.
    await page.waitForTimeout(INWAVE_AT_MS);
    await page.evaluate(() => document.body.focus());
    const before = await page.evaluate(() => window.__M7B.reveals.length);
    const armedBefore = await page.locator(".cell-reveal-animated").count();
    const pressAt = await page.evaluate(() => performance.now() - window.__M7B.t0);
    await page.keyboard.press("g");
    await page.waitForTimeout(2400);
    const all = await page.evaluate(() => window.__M7B.reveals);
    const afterPress = all.filter((t) => t > pressAt + 4).length;
    rows.push({
      cycle: 0,
      dir: "entry-in-wave",
      engine: ENGINE,
      viewport: VIEW,
      reveals: afterPress,
      at: all.filter((t) => t > pressAt + 4).slice(0, 6),
      armedBefore,
      dealReveals: before,
      pressAt: +pressAt.toFixed(1),
      armedAfter: await page.locator(".cell-reveal-animated").count(),
    });
    writeFileSync(
      OUT,
      JSON.stringify({ kind: "C06-m7b-guard", mode: MODE, engine: ENGINE, viewport: VIEW, port: PORT, at: new Date().toISOString() }) + "\n",
    );
    for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
    await browser.close();
    for (const r of rows)
      console.log(
        `${ENGINE} ${VIEW} IN-WAVE press@${r.pressAt}ms (deal had started ${r.dealReveals}, ${r.armedBefore} cells armed): cell-reveal runs AFTER the move=${r.reveals} armedAfter=${r.armedAfter}`,
      );
    return;
  }
  // The BOOT deal's own reveal wave is not the fold's: its longest delay is 1.2s plus a 0.3s
  // run, so wait it out before arming, then mark per direction.
  await page.waitForTimeout(3600);
  await page.evaluate(() => document.body.focus());
  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      await page.evaluate(() => window.__M7B.mark());
      await page.keyboard.press(dir === "entry" ? "g" : "Enter");
      await page.waitForTimeout(1800);
      const reveals = await page.evaluate(() => window.__M7B.reveals);
      const armed = await page.locator(".cell-reveal-animated").count();
      rows.push({ cycle: c, dir, engine: ENGINE, viewport: VIEW, reveals: reveals.length, at: reveals.slice(0, 6), armedAfter: armed });
      await page.waitForTimeout(400);
    }
  }
  writeFileSync(
    OUT,
    JSON.stringify({ kind: "C06-m7b-guard", engine: ENGINE, viewport: VIEW, port: PORT, at: new Date().toISOString() }) + "\n",
  );
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  await browser.close();
  for (const r of rows)
    console.log(`${ENGINE} ${VIEW} c${r.cycle} ${r.dir}: cell-reveal runs=${r.reveals} armedAfter=${r.armedAfter}`);
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});
