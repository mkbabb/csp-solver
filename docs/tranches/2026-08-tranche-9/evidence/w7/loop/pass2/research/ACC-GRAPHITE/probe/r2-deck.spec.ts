/** ACC-GRAPHITE pass-2 RESEARCH — the deck's clue (row 9) and the guard (row 11), measured. */
import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const OUT = new URL("../readings/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

test("deck clue + guard", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("./");
  await page.waitForTimeout(3000);
  const deck = await page.evaluate(() => {
    const posters = Array.from(document.querySelectorAll<HTMLElement>(".poster-board"));
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".poster-cell"));
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".poster-cell svg path"));
    const rows = paths.slice(0, 400).map((p) => {
      const cs = getComputedStyle(p);
      const svg = p.ownerSVGElement;
      const r = svg?.getBoundingClientRect();
      return {
        swAttr: p.getAttribute("stroke-width"),
        sw: cs.strokeWidth,
        stroke: cs.stroke,
        svgW: r ? +r.width.toFixed(2) : null,
        vb: svg?.getAttribute("viewBox") ?? null,
      };
    });
    const tally: Record<string, number> = {};
    for (const r of rows) tally[`${r.swAttr}|${r.sw}|${r.svgW}`] = (tally[`${r.swAttr}|${r.sw}|${r.svgW}`] ?? 0) + 1;
    return { posters: posters.length, cells: cells.length, glyphPaths: paths.length, tally, first: rows[0] ?? null };
  });
  // the guard: arm Clear, then arm Deal, and report what it takes
  const guard = await page.evaluate(async () => {
    const find = (re: RegExp) =>
      Array.from(document.querySelectorAll<HTMLElement>("button")).find((b) =>
        re.test((b.textContent ?? "").trim()),
      );
    const clear = find(/clear/i);
    const deal = find(/deal/i);
    const snap = (b?: HTMLElement) =>
      b
        ? {
            text: (b.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
            armed: b.className.includes("is-armed") || !!b.querySelector(".is-armed"),
            sublabel: b.querySelector(".icon-sublabel")?.textContent?.trim() ?? null,
          }
        : null;
    const before = { clear: snap(clear), deal: snap(deal) };
    clear?.click();
    await new Promise((r) => setTimeout(r, 400));
    const afterOne = { clear: snap(clear), deal: snap(deal) };
    return { before, afterOne, foundClear: !!clear, foundDeal: !!deal };
  });
  const out = { engine: browserName, deck, guard };
  writeFileSync(OUT + `deck-guard-${browserName}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  expect(true).toBe(true);
});
