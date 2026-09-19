// CRITIC probe r2: CSSStyleRule now implements CSSGroupingRule (nesting), so `"cssRules" in rule`
// is TRUE for every style rule. The spec's walk tests that branch BEFORE `instanceof CSSStyleRule`,
// so a style rule is recursed into and never examined. Order the branches the other way.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = "http://127.0.0.1:4246";
const out = {};
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  out[name] = await p.evaluate(() => {
    const styleRuleHasCssRules = (() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const r of sheet.cssRules) if (r instanceof CSSStyleRule) return "cssRules" in r;
        } catch {}
      }
      return null;
    })();
    const found = [];
    const walk = (list, media) => {
      for (const rule of list) {
        if (rule instanceof CSSStyleRule) {
          // own declarations only — strip nested children from the text test
          const own = rule.style.cssText || "";
          if (own.includes("--sheet-chrome") || rule.cssText.includes("--sheet-chrome"))
            found.push({ selector: rule.selectorText, media, own: own.slice(0, 90) });
          if (rule.cssRules) walk(rule.cssRules, media);
        } else if (rule instanceof CSSMediaRule) {
          walk(rule.cssRules, media ? media + " AND " + rule.conditionText : rule.conditionText);
        } else if (rule.cssRules) walk(rule.cssRules, media);
      }
    };
    for (const sheet of document.styleSheets) {
      try { walk(sheet.cssRules, ""); } catch (e) { found.push({ error: e.name }); }
    }
    return { styleRuleHasCssRules, count: found.length, found };
  });
  await b.close();
}
console.log(JSON.stringify(out, null, 2));
