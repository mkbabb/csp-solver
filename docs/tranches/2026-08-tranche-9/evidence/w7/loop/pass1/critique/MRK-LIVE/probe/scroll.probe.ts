import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });
test("B · the ring's geometry while the page scrolls under a held focus", async ({ page, browserName }) => {
  await page.goto("/?game=sudoku&size=9");
  await page.waitForSelector(".logo-trigger", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const res = await page.evaluate(async () => {
    const btn = document.querySelector<HTMLElement>(".logo-trigger");
    btn?.focus();
    await new Promise((r) => setTimeout(r, 900));
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!ring) return { ring: false };
    let dWrites = 0, styleWrites = 0;
    const mo = new MutationObserver((recs) => {
      for (const r of recs) {
        if (r.attributeName === "d") dWrites++;
        if (r.attributeName === "style" && r.target === ring) styleWrites++;
      }
    });
    mo.observe(ring, { attributes: true, subtree: true });
    const first = ring.querySelector("path")?.getAttribute("d") ?? "";
    let events = 0;
    const count = () => events++;
    window.addEventListener("scroll", count, true);
    for (let i = 0; i < 24; i++) {
      window.scrollBy(0, 10);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    await new Promise((r) => setTimeout(r, 400));
    window.removeEventListener("scroll", count, true);
    mo.disconnect();
    const last = ring.querySelector("path")?.getAttribute("d") ?? "";
    return { ring: true, scrollEvents: events, dWrites, styleWrites, geometryChanged: first !== last, scrollY: window.scrollY, docScrollable: document.documentElement.scrollHeight > innerHeight };
  });
  writeFileSync(`${OUT}/B-scroll-${browserName}.json`, JSON.stringify(res, null, 2));
  console.log("B", browserName, JSON.stringify(res));
});
