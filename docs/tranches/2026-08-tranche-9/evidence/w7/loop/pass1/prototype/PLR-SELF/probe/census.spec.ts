/** R6's heading census, re-run against the prototype (the picks and the reader, verbatim). */
import { test, type Page } from "@playwright/test";

async function load(page: Page) {
  await page.goto("./?size=3&difficulty=EASY&wire=local");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(1200);
}

test("the heading census — the controls card's group voices", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await load(page);
  const tab = page.locator("button.drawer-tab");
  if (await tab.isVisible().catch(() => false)) {
    await tab.click();
    await page.waitForTimeout(900);
  }
  const census = await page.evaluate(() => {
    const read = (el: Element) => {
      const c = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        text: (el.textContent ?? "").trim().slice(0, 40),
        family: c.fontFamily.split(",")[0].replace(/["']/g, ""),
        size: c.fontSize,
        weight: c.fontWeight,
        transform: c.textTransform,
        tracking: c.letterSpacing,
        color: c.color,
        opacity: c.opacity,
        w: +b.width.toFixed(1),
        h: +b.height.toFixed(1),
      };
    };
    const pick = (sel: string) => [...document.querySelectorAll(sel)].map(read);
    return {
      washiTag: pick(".washi-tag"),
      zoneRowLabel: pick(".zone-row-label"),
      sectionHeading: pick(".section-heading"),
      h2: pick("h2"),
      groupTitleToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-group-title")
        .trim(),
      tagToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-tag")
        .trim(),
    };
  });
  console.log("HEADING-CENSUS " + JSON.stringify(census, null, 1));
});
