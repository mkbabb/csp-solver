// T9-W7 pass 4 · CTRL-RULE — rows 13 and 14 of the charter, read rather than argued.
//  13 · THE TWO-RULE BAND: per consecutive pair of groups, the gap between rule k's painted
//       bottom and the next group's name top, and between the two rules (each rule read off its
//       `<path>`'s painted box), at 320×568 and 390×844 (coarse, hasTouch) and 1280×800.
//  14 · THE BASELINE: a zero-size inline-block dropped at the baseline of the name's text and of
//       the first chip's text; Δ = chip baseline − name baseline per group (0 = one baseline).
// node page-geometry.mjs <chromium|webkit> <BASE>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [E = "chromium", BASE = "http://127.0.0.1:4231/"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await (E === "webkit" ? webkit : chromium).launch();
const out = { engine: E, base: BASE, cells: {} };
for (const [w, h, touch] of [[1280, 800, false], [390, 844, true], [320, 568, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && E === "chromium", deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1600);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) { await p.locator(".drawer-tab").first().click({ force: true }); await p.waitForTimeout(1100); }
  out.cells[`${w}x${h}`] = await p.evaluate(() => {
    const card = document.querySelector(".controls-card"); card.scrollTop = 0;
    const groups = [...card.querySelectorAll("[data-ruled-group]")];
    const mark = (host) => {
      const m = document.createElement("span");
      m.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      host.append(m); const y = m.getBoundingClientRect().top; m.remove(); return y;
    };
    const rows = groups.map((g) => {
      const name = g.querySelector(".rp-name");
      const chip = g.querySelector(".rp-field button, .rp-field [role='radio'], .rp-field label");
      const chipText = chip ? [...chip.querySelectorAll("*")].find((n) => n.childNodes.length && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) || chip : null;
      const path = g.querySelector(".rp-rule path");
      const pr = path ? path.getBoundingClientRect() : null;
      return { name: name.textContent.trim(), nameTop: name.getBoundingClientRect().top,
               nameBase: mark(name), chipBase: chipText ? mark(chipText) : null,
               ruleTop: pr?.top ?? null, ruleBottom: pr?.bottom ?? null };
    });
    const pairs = [];
    for (let i = 0; i + 1 < rows.length; i++) pairs.push({
      between: `${rows[i].name} → ${rows[i + 1].name}`,
      ruleToNextName: +(rows[i + 1].nameTop - rows[i].ruleBottom).toFixed(2),
      ruleToRule: +(rows[i + 1].ruleTop - rows[i].ruleTop).toFixed(2),
    });
    return {
      baseline: rows.map((r) => ({ name: r.name, dChipMinusName: r.chipBase == null ? null : +(r.chipBase - r.nameBase).toFixed(2) })),
      pairs,
      minRuleToNextName: Math.min(...pairs.map((q) => q.ruleToNextName)),
      minRuleToRule: Math.min(...pairs.map((q) => q.ruleToRule)),
    };
  });
  console.log(E, `${w}x${h}`, JSON.stringify(out.cells[`${w}x${h}`].baseline.map((r) => r.dChipMinusName)), "minRule→name", out.cells[`${w}x${h}`].minRuleToNextName, "minRule→rule", out.cells[`${w}x${h}`].minRuleToRule);
  await ctx.close();
}
writeFileSync(join(OUT, `page-geometry-${E}.json`), JSON.stringify(out, null, 1));
await b.close();
console.log("EXIT OK");
