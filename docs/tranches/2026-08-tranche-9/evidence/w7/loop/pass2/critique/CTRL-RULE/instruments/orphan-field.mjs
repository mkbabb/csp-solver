// T9-W7 pass 2 · CRITIQUE · CTRL-RULE — THE GATE THE FAMILY DELETED WITHOUT REPLACING.
//
// W2 §2.6 pinned the section tag so that a reader scrolled into the middle of a group still had
// the group's NAME on screen. Arm (b) retires the pin and answers the class invariant with
// "nothing pins". The question the pin existed to answer — *what am I looking at?* — is not
// answered by the margin alone: a margin name scrolls off with its own row while the field it
// names is still under the eye. The lane's own frame 2 shows exactly that (`Medium` and `Hard`
// on screen, `level` gone) while its caption reads "each name beside its own field".
//
// This is the missing row: at every scroll state, how many groups have a field IN the port and
// a name OUT of it. An ORPHANED FIELD. HEAD's pinned tag is the control the family owes.
//
// node orphan-field.mjs   [BASE=http://127.0.0.1:4234/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4234/";

const SCAN = (top) => {
  const card = document.querySelector(".controls-card");
  card.scrollTop = top;
  void card.offsetHeight;
  const port = card.getBoundingClientRect();
  const rows = [];
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    if (!name || !field) continue;
    const nb = name.getBoundingClientRect();
    const fb = field.getBoundingClientRect();
    const fieldVis =
      Math.max(0, Math.min(fb.bottom, port.bottom) - Math.max(fb.top, port.top)) /
      (fb.height || 1);
    const nameVis =
      Math.max(0, Math.min(nb.bottom, port.bottom) - Math.max(nb.top, port.top)) /
      (nb.height || 1);
    rows.push({
      name: name.textContent.trim(),
      fieldVis: +fieldVis.toFixed(3),
      nameVis: +nameVis.toFixed(3),
    });
  }
  // an ORPHAN: at least a third of the field readable, and no part of its name on screen
  const orphans = rows.filter((r) => r.fieldVis >= 0.33 && r.nameVis <= 0);
  return {
    scrollTop: card.scrollTop,
    maxScroll: card.scrollHeight - card.clientHeight,
    orphans: orphans.map((o) => o.name),
    rows,
  };
};

const out = { base: BASE, cells: {} };
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { w: 390, h: 844, touch: true },
    { w: 1280, h: 800, touch: false },
  ]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      deviceScaleFactor: 1,
      hasTouch: cell.touch,
      colorScheme: "light",
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.clear();
        localStorage.setItem("sudoku-color-scheme", "light");
      } catch {}
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForTimeout(1200);
    if (
      await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
    ) {
      await page.locator(".drawer-tab").first().click({ force: true });
      await page.waitForTimeout(950); // THE SHEET SLIDES
    }
    await page.waitForTimeout(300);
    const max = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      return c.scrollHeight - c.clientHeight;
    });
    const states = [];
    for (let t = 0; t <= max; t += Math.max(20, Math.round(max / 12))) {
      states.push(await page.evaluate(SCAN, t));
    }
    states.push(await page.evaluate(SCAN, max));
    const withOrphans = states.filter((s) => s.orphans.length);
    out.cells[`${engine}/${cell.w}x${cell.h}`] = {
      maxScroll: max,
      states: states.length,
      statesWithOrphan: withOrphans.length,
      worst: withOrphans.reduce(
        (a, s) => (s.orphans.length > (a?.orphans.length || 0) ? s : a),
        null,
      ),
      sample: withOrphans.slice(0, 4).map((s) => ({ t: s.scrollTop, o: s.orphans })),
    };
    await browser.close();
    console.log(
      engine,
      cell.w,
      "orphan states",
      withOrphans.length,
      "/",
      states.length,
      JSON.stringify(out.cells[`${engine}/${cell.w}x${cell.h}`].sample),
    );
  }
}
writeFileSync(join(OUT, "orphan-field.json"), JSON.stringify(out, null, 2));
console.log("EXIT OK");
