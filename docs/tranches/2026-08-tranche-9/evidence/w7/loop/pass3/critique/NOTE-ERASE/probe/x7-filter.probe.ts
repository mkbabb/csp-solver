/**
 * X7 — the LIVE filter census, the population the estate's own gate counts: every element in
 * the document whose COMPUTED `filter` is not `none`, at 4x4 / 9x9 / 16x16. The prototype's
 * `d-rects` probe banked 25 at all three sizes, but it counted SVG `filter` ATTRIBUTES
 * (`url(#wobble-…)`), which is a different population from `FILTER_BUDGET`'s 9.
 */
import { test } from "@playwright/test";
import { bank, boardReady, say } from "./lib";

test("X7 the live filter census, three sizes", async ({ page }, info) => {
  const out: Record<string, unknown> = {};
  for (const q of [
    "?size=2&difficulty=EASY",
    "?size=3&difficulty=EASY",
    "?size=4&difficulty=EASY",
  ]) {
    await boardReady(page, q);
    out[q] = await page.evaluate(() => {
      const hits: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
        const f = getComputedStyle(el).filter;
        if (f && f !== "none") {
          const cls =
            typeof el.className === "string"
              ? el.className
              : (el.getAttribute("class") ?? "");
          hits.push(`${el.tagName.toLowerCase()}${cls ? "." + cls.trim().split(/\s+/).join(".") : ""} :: ${f}`);
        }
      }
      return { count: hits.length, hits };
    });
  }
  say(`X7-${info.project.name}`, {
    counts: Object.fromEntries(
      Object.entries(out).map(([k, v]) => [k, (v as { count: number }).count]),
    ),
  });
  bank(`x7-filter-${info.project.name}.json`, out);
});
