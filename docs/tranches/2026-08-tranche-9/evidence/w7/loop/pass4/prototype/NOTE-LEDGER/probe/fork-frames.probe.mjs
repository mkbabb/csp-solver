/**
 * NOTE-LEDGER · pass-4 probe 4 — THE FORK'S TWO FRAMES (T9-B-LEDGER, the owner's).
 *
 * One frame per arm, the SAME pose in both: the canonical loop run twice (ask, write the digit,
 * ask again, write THAT digit) and then read at rest — no hint armed, no animation pending.
 * That is the pose the reader is in most of the time and the one pass 3 never photographed.
 *
 * The crop is a CLIP, not an element shot: line two is `position: absolute; top: 100%` below
 * 1024, so it is outside `.board-margin`'s own painted box and an element screenshot of the
 * strip leaves it out (which is how pass 4's first F1 pair came back holding one line).
 *
 * The arm is whatever `LEDGER_FULFILLED_AGES` is in the served tree; the runner names it.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DIR =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER";
mkdirSync(join(DIR, "logs"), { recursive: true });
const ARM = process.argv[2] ?? "hold";
const PROTO = "http://127.0.0.1:4249/";
const digitOf = (s) =>
  (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? null;

const out = {};
for (const engine of ["chromium", "webkit"]) {
  const browser = await pw[engine].launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: engine === "chromium",
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await page.goto(PROTO + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
  const sentences = [];
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => {
      const free = [...document.querySelectorAll(".board-cells input")].filter(
        (x) => !x.value && !x.readOnly && !x.disabled,
      );
      free[0]?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(700);
    const s = await page.evaluate(
      () => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    );
    const d = digitOf(s);
    if (d) await page.keyboard.type(d);
    await page.waitForTimeout(800);
    sentences.push({ asked: s, wrote: d });
  }
  // Settled: nothing running, nothing armed.
  await page.waitForTimeout(900);
  const read = await page.evaluate(() => {
    const one = document.querySelector(".board-margin .margin-note");
    const two = document.querySelector(".board-margin .margin-note-previous");
    const a = one.getBoundingClientRect();
    const b = two?.getBoundingClientRect();
    return {
      one: one.textContent.trim(),
      two: two?.textContent?.trim() ?? "",
      clip: {
        x: Math.max(0, Math.floor(a.left - 6)),
        y: Math.max(0, Math.floor(a.top - 4)),
        width: Math.min(378, 360),
        height: Math.ceil((b ? b.bottom : a.bottom) - a.top + 8),
      },
      running: document.getAnimations().filter((x) => x.playState === "running").length,
    };
  });
  const path = join(DIR, `F2-390x844-light-coarse-${ARM}-at-rest-${engine}.png`);
  await page.screenshot({ path, clip: read.clip });
  out[engine] = { arm: ARM, sentences, ...read, frame: path };
  console.log(
    `${engine} [${ARM}] one="${read.one}" two="${read.two}" clip=${JSON.stringify(read.clip)} running=${read.running}`,
  );
  await ctx.close();
  await browser.close();
}
writeFileSync(join(DIR, "logs", `fork-${ARM}.json`), JSON.stringify(out, null, 2));
