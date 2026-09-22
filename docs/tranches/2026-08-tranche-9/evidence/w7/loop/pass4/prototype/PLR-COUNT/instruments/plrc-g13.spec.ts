/** G13 — the extraction moved no DifficultyTally byte: every `.dt-pose .dt-stroke` `d`, this
 *  tree (4242) against the HEAD control (4230, 74a2b5d9), one encoded board, desk. */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD =
  "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
test("G13", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const out: Record<string, string[]> = {};
  for (const [arm, base] of [["control", "http://127.0.0.1:4230"], ["proto", "http://127.0.0.1:4242"]]) {
    const page = await ctx.newPage();
    // the tally renders only under a DEALT difficulty; its `d` values depend on no cell, so the
    // board param (a share has no difficulty) is dropped for this row and said so here
    await page.goto(`${base}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await expect.poll(() => page.locator(".dt-pose .dt-stroke").count(), { timeout: 60000 }).toBeGreaterThan(0);
    out[arm] = await page.evaluate(() =>
      [...document.querySelectorAll(".dt-pose .dt-stroke")].map((p) => p.getAttribute("d") ?? ""),
    );
  }
  await ctx.close();
  const same = out.control.length === out.proto.length && out.control.every((d, i) => d === out.proto[i]);
  writeFileSync(`${process.env.PLRC_OUT}/g13-${browserName}.json`, JSON.stringify({ n: [out.control.length, out.proto.length], same }));
  console.log("G13", browserName, out.control.length, out.proto.length, same);
  expect(same).toBe(true);
});
