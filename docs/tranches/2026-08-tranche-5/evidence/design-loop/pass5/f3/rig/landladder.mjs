/**
 * PASS-5 F3 · landladder.mjs — the landscape ladder, re-derived at citation, with the number
 * pass 4 got wrong: the FOLD OVERFLOW.
 *
 * Pass 4 banked `88.58` in a shipped source comment; the pass-4 registry read `90.58 / 89.98`
 * off the md5-identical artifact (F3-G4). This rig re-measures it on THIS pass's build so the
 * correction is derived, not copied — and it measures every rung, so the adjudicator sees what
 * each cap costs in the one dimension the renamed gate (`height ≤ innerHeight`) cannot see.
 *
 * Candidate caps are injected as `!important` on `.board-shell`: same build, one variable.
 * Shots are written per rung so the decision row carries both arms' glass.
 *
 * Usage: node landladder.mjs <baseURL> <engine> <outfile> <shotdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const RUNGS = [
  { key: "none-pre-p3", cap: null, note: "no height bound — the pre-pass-3 tree below 1024" },
  { key: "100dvh-10rem", cap: "calc(100dvh - 10rem)", note: "PASS 3's rung" },
  { key: "100dvh-4rem", cap: "calc(100dvh - 4rem)", note: "intermediate rung A — unadjudicated" },
  { key: "100dvh-1.5rem", cap: "calc(100dvh - 1.5rem)", note: "SHIPPED — the page's own gutter" },
  { key: "100dvh", cap: "100dvh", note: "intermediate rung B — the whole short edge" },
];

const measure = () => {
  const round = (n) => (n == null ? null : Math.round(n * 100) / 100);
  const doc = document.documentElement;
  const shell = document.querySelector(".board-shell");
  const cells = document.querySelector(".board-cells") ?? shell;
  const chip = document.querySelector(".control-panel-wrap .ctrl-btn");
  const host = document.querySelector(".board-peek-host");
  const masthead =
    document.querySelector("header") ??
    document.querySelector(".app-masthead") ??
    document.querySelector(".masthead");
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const sq = r(cells);
  const vh = window.innerHeight;
  const n = document.querySelectorAll(".sudoku-cell").length;
  const side = Math.round(Math.sqrt(n));
  return {
    vh,
    board: round(sq?.height),
    cell: side ? round(sq.height / side) : null,
    boardFitsViewport: sq ? sq.height <= vh : null,
    boardBottomAbs: round(sq ? sq.bottom + window.scrollY : null),
    // THE BOUND THE RENAMED GATE CANNOT SEE: how much of the board is below the fold at rest.
    foldOverflow: round(sq ? Math.max(0, sq.bottom + window.scrollY - vh) : null),
    boardWholeAboveFold: sq ? sq.bottom + window.scrollY <= vh : null,
    docScrollH: doc.scrollHeight,
    pageVh: Math.round((doc.scrollHeight / vh) * 1000) / 1000,
    chromeAboveBoard: round(host ? r(host).top + window.scrollY : null),
    mastheadH: round(masthead ? r(masthead).height : null),
    boardTopToFirstChip: round(chip ? r(chip).bottom + window.scrollY : null),
  };
};

const [, , baseURL, engineName, outfile, shotdir] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const browser = await engine.launch();
const out = {};
for (const rung of RUNGS) {
  const ctx = await browser.newContext({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: engineName !== "webkit",
    deviceScaleFactor: 1, // evidence policy: shots <=150KB — dsf 2 put the webkit arm at 145-169KB
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  if (rung.cap)
    await page.addStyleTag({ content: `.board-shell{max-width:${rung.cap} !important}` });
  else await page.addStyleTag({ content: `.board-shell{max-width:none !important}` });
  await page.waitForTimeout(500);
  out[rung.key] = { ...(await page.evaluate(measure)), note: rung.note };
  if (shotdir)
    await page.screenshot({
      path: `${shotdir}/land-844x390-${rung.key}-${engineName}.png`,
      // the FOLD is what the row is about — capture exactly one viewport, at rest
      clip: { x: 0, y: 0, width: 844, height: 390 },
    });
  await ctx.close();
}
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(
  Object.entries(out)
    .map(
      ([k, v]) =>
        `${k}\tboard=${v.board}\tcell=${v.cell}\tfits=${v.boardFitsViewport}\tfoldOverflow=${v.foldOverflow}\twholeAboveFold=${v.boardWholeAboveFold}\tpageVh=${v.pageVh}\tchip=${v.boardTopToFirstChip}`,
    )
    .join("\n"),
);
