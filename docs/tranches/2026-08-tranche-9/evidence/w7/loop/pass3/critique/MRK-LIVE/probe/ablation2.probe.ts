/**
 * T9-W7 pass 3 · MRK-LIVE CRITIC · G-LIVE-18's generality.
 *
 * The prototype ran its ablation on `button.logo-trigger`, a host that DECLARES no
 * `--focus-ring-outset`. This row runs the same ablation on `.drawer-tab`, which declares
 * `6.5px` (DrawerTab.vue:79). Motion declared: static read after an 800ms settle; PRM off.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });

test("ablation on a DECLARING host", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => {
    const r = document.querySelector<SVGElement>(".focus-ring");
    const b = r?.getBoundingClientRect();
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      w: b ? +b.width.toFixed(2) : null,
      declared: getComputedStyle(
        document.querySelector("button.drawer-tab")!,
      ).getPropertyValue("--focus-ring-outset"),
    };
  });
  const ablation = await page.evaluate(() => {
    let deleted = 0;
    for (const sheet of [...document.styleSheets]) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i] as CSSRule & { name?: string };
        if (r.constructor.name === "CSSPropertyRule" && r.name === "--focus-ring-outset") {
          sheet.deleteRule(i);
          deleted++;
        }
      }
    }
    return { deleted };
  });
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(300);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => {
    const r = document.querySelector<SVGElement>(".focus-ring");
    const b = r?.getBoundingClientRect();
    const t = document.querySelector("button.drawer-tab")!;
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      w: b ? +b.width.toFixed(2) : null,
      declared: getComputedStyle(t).getPropertyValue("--focus-ring-outset"),
      parsed: parseFloat(getComputedStyle(t).getPropertyValue("--focus-ring-outset")),
    };
  });
  writeFileSync(
    join(OUT, `CRITIC-4-ablation-declaring-${info.project.name}.json`),
    JSON.stringify({ before, ablation, after }, null, 2),
  );
  console.log(JSON.stringify({ before, ablation, after }));
});
