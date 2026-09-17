// T9-W7 r0 · lane R7 — probe 4. M12 re-run with a text-INDEPENDENT locator (probe 3's
// `:text-is("Clear")` stops matching the instant the verb arms, which is the state under
// test) and a long enough settle for Solve's worker round-trip.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4247/";
const out = {};

async function fresh(engine) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "dark");
    } catch {
      /* private */
    }
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(1800);
  return { browser, page };
}

async function verb(engine, name, settleMs) {
  const { browser, page } = await fresh(engine);
  const r = { verb: name, engine };
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (x) => !x.readOnly && !x.disabled && !x.value,
    )[0];
    i?.focus();
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(600);
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950); // the sheet SLIDES

  r.result = await page.evaluate(
    async ([v, settle]) => {
      const idx = { Clear: 0, Fill: 1, Solve: 2, Share: 3 };
      const btn =
        v === "Deal"
          ? document.querySelector(".deal-row button")
          : document.querySelectorAll(".action-bar .action-verbs button")[idx[v]];
      if (!btn) return { found: false };
      const before = [...document.querySelectorAll(".sudoku-cell input")]
        .map((i) => i.value)
        .join("");
      const aria0 = btn.getAttribute("aria-label");
      const sub0 = (btn.querySelector(".icon-sublabel")?.textContent || "").trim();
      btn.click();
      await new Promise((res) => setTimeout(res, settle));
      const after = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
      const sub1 = (btn.querySelector(".icon-sublabel")?.textContent || "").trim();
      return {
        found: true,
        ariaBefore: aria0,
        ariaAfter: btn.getAttribute("aria-label"),
        subBefore: sub0,
        subAfter: sub1,
        armedClass: !!btn.querySelector(".icon-sublabel.is-armed"),
        boardChanged: before !== after,
        cellsChanged: [...before].filter((c, i) => c !== after[i]).length,
        anyDialog: !!document.querySelector("[role=alertdialog],[role=dialog],.gallery-guard"),
      };
    },
    [name, settleMs],
  );
  r.guarded =
    r.result.found && !r.result.boardChanged && (r.result.armedClass || r.result.anyDialog);
  await browser.close();
  return r;
}

for (const v of ["Clear", "Fill", "Solve", "Deal"])
  out[v] = await verb("webkit", v, v === "Solve" ? 4000 : 900);
writeFileSync(resolve(HERE, "probe-r7d.json"), JSON.stringify(out, null, 2));
for (const [k, x] of Object.entries(out))
  console.log(
    k.padEnd(6),
    "sub:",
    String(x.result.subBefore).padEnd(6),
    "→",
    String(x.result.subAfter).padEnd(6),
    "| armed",
    x.result.armedClass,
    "| boardChanged",
    x.result.boardChanged,
    "| cells",
    x.result.cellsChanged,
    "| GUARDED",
    x.guarded,
  );
