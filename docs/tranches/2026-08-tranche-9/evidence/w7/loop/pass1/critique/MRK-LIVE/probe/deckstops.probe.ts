import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });
test("D · the GALLERY view's tab stops, including the staging band", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForTimeout(2500);
  const stops: unknown[] = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(260);
    const row = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return null;
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const rb = ring?.getBoundingClientRect();
      const ab = a.getBoundingClientRect();
      const o = parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
      return {
        stop: a.tagName.toLowerCase() + (a.className && typeof a.className === "string" ? "." + a.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
        focusVisible: a.matches(":focus-visible"),
        outline: getComputedStyle(a).outlineStyle,
        ring: !!ring,
        errPx: ring && rb ? +Math.max(Math.abs(rb.left - (ab.left - o)), Math.abs(rb.top - (ab.top - o))).toFixed(2) : null,
      };
    });
    if (row) stops.push(row);
  }
  const present = await page.evaluate(() => ({
    stagingBtns: document.querySelectorAll(".staging-btn").length,
    guardBtns: document.querySelectorAll(".guard-btn").length,
    cards: document.querySelectorAll(".game-card").length,
  }));
  writeFileSync(`${OUT}/D-deckstops-${browserName}.json`, JSON.stringify({ present, stops }, null, 2));
  console.log("D", browserName, JSON.stringify({ present, stops }));
});
