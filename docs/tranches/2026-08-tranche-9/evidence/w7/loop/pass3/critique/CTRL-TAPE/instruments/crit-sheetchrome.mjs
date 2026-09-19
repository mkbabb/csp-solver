// CRITIC probe: why does the pass-3 `no desk rung spends --sheet-chrome` row find 0 spenders?
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = "http://127.0.0.1:4246";
const out = {};
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  out[name] = await p.evaluate(() => {
    const r = { sheets: 0, iterableOK: 0, throwers: [], hits: 0, hitsByIndex: 0, sample: [] };
    for (const sheet of document.styleSheets) {
      r.sheets++;
      let rules;
      try { rules = sheet.cssRules; } catch (e) { r.throwers.push("cssRules:" + e.name); continue; }
      // (a) the row's own idiom: for..of over a CSSRuleList
      try { for (const _ of rules) { break; } r.iterableOK++; } catch (e) { r.throwers.push("forof:" + e.name + ":" + e.message.slice(0, 60)); }
      // (b) indexed walk, which cannot depend on an iterator
      const walk = (list, media) => {
        for (let i = 0; i < list.length; i++) {
          const rule = list[i];
          if (rule.cssRules) walk(rule.cssRules, rule.conditionText ? (media ? media + " AND " + rule.conditionText : rule.conditionText) : media);
          else if (rule.selectorText && rule.cssText.includes("--sheet-chrome")) {
            r.hitsByIndex++;
            if (r.sample.length < 4) r.sample.push({ selector: rule.selectorText, media, text: rule.cssText.slice(0, 80) });
          }
        }
      };
      try { walk(rules, ""); } catch (e) { r.throwers.push("walk:" + e.name); }
    }
    // (c) does the text exist in the served CSS at all?
    r.textPresent = [...document.querySelectorAll("style")].some((s) => (s.textContent || "").includes("--sheet-chrome"));
    r.linkSheets = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href);
    return r;
  });
  await b.close();
}
console.log(JSON.stringify(out, null, 2));
