// CTRL-FACE pass-1 — R7's I1 and I2, RE-RUN (not re-written).
//
// `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` hardcodes `BASE =
// "http://127.0.0.1:4247/"`, and 4247 is held by another lane on this machine, so the file
// itself cannot be pointed at this lane's arm. The two bodies this family owes readings for —
// I1 (one typographic voice at 1440x900) and I2's chrome half — are copied BYTE-FOR-BYTE
// below. The only edits are (a) `BASE` reads an env var, (b) I3..I7 are not run, and (c) the
// writeFileSync target. Nothing in an assertion, a viewport, a selector or a threshold moved.
//
//   BASE=http://127.0.0.1:4235 OUT=readings/i1-i2-armB.json node probe/i1-i2.mjs
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "readings/i1-i2.json";
const results = [];
const record = (id, mark, law, pass, reading) =>
  results.push({ id, mark, law, verdict: pass ? "GREEN" : "RED", reading });

async function board(engine, { w = 390, h = 844, mobile = true, dark = true } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile || undefined,
    hasTouch: mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {
      /* private mode */
    }
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(1500);
  return { browser, page };
}
const openSheet = async (page) => {
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950); // the sheet SLIDES
};

// ── I1 · M03/M05 — ONE HEADING VOICE ──────────────────────────────────────────
{
  const { browser, page } = await board("webkit", { w: 1440, h: 900, mobile: false, dark: false });
  const voices = await page.evaluate(() => {
    const sel = [
      ...document.querySelectorAll(".section-heading, .tray-well .washi-tag, .zone-row-label"),
    ];
    const v = new Set();
    for (const e of sel) {
      const cs = getComputedStyle(e);
      v.add(`${cs.fontSize}|${cs.fontFamily.split(",")[0].replace(/["']/g, "")}|${cs.fontWeight}`);
    }
    return [...v];
  });
  await browser.close();
  record(
    "I1",
    "T9-M03 / T9-M05",
    "the controls card titles its option groups in ONE typographic voice",
    voices.length === 1,
    `${voices.length} voices at 1440×900: ${voices.join(" · ")}`,
  );
}

// ── I2 · M04 — THE BAR HAS ITS OWN CHROME AND BURIES NOTHING ─────────────────
{
  const { browser, page } = await board("webkit");
  await openSheet(page);
  const r = await page.evaluate(() => {
    const bar = document.querySelector(".action-bar");
    const cs = getComputedStyle(bar);
    const bb = bar.getBoundingClientRect();
    const own =
      parseFloat(cs.borderTopWidth) > 0 ||
      cs.outlineStyle !== "none" ||
      cs.boxShadow !== "none" ||
      !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
    let worst = 0;
    let who = null;
    for (const w of document.querySelectorAll(".tray-well")) {
      const wb = w.getBoundingClientRect();
      const ov =
        Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
        Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
      const frac = ov / Math.max(1, wb.width * wb.height);
      if (frac > worst) {
        worst = frac;
        who = (w.querySelector(".washi-tag")?.textContent || "?").trim();
      }
    }
    return { own, worst: +worst.toFixed(3), who, border: cs.borderTopWidth, shadow: cs.boxShadow };
  });
  await browser.close();
  record(
    "I2",
    "T9-M04",
    "the mobile floating bar carries chrome of its own and covers no option group",
    r.own && r.worst < 0.05,
    `ownChrome=${r.own} (border ${r.border}, shadow ${r.shadow}) · worst group coverage ${(r.worst * 100).toFixed(1)}% (${r.who})`,
  );
}

writeFileSync(resolve(OUT), JSON.stringify(results, null, 2));
for (const r of results) console.log(`${r.verdict.padEnd(5)} ${r.id} — ${r.reading}`);
