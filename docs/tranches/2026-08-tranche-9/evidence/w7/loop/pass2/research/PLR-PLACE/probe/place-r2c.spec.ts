/** PLR-PLACE pass-2 research, probe 3 — THE PREVENTDEFAULT AUDITION, isolated.
 *  A2 measured that a pointerdown preventDefault keeps the grid's focus in both engines. This
 *  asks the other half on a control with no hover-open to confound it: does the CLICK still
 *  fire, does the button still activate by Enter and by Space, and does `aria-expanded` still
 *  move? The subject is a bare button this probe injects — a control, not the product.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-PLACE/logs";
const out: Record<string, unknown> = {};

test("I · pointerdown preventDefault: click, keyboard, focus", async ({ page }) => {
  await page.goto("/?game=sudoku");
  await page.waitForSelector('[role="grid"]');
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    const w = window as unknown as { __n: number };
    w.__n = 0;
    const b = document.createElement("button");
    b.id = "probe-sign";
    b.type = "button";
    b.textContent = "3";
    b.setAttribute("aria-expanded", "false");
    b.style.cssText = "position:fixed;top:4px;left:200px;z-index:9999;width:44px;height:44px";
    b.addEventListener("pointerdown", (e) => e.preventDefault());
    b.addEventListener("click", () => {
      w.__n++;
      b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") === "true" ? "false" : "true");
    });
    document.body.appendChild(b);
  });

  const cell = page.locator('[role="grid"] input').first();
  await cell.click();
  await page.waitForTimeout(120);

  await page.locator("#probe-sign").click();
  await page.waitForTimeout(150);
  const mouse = await page.evaluate(() => ({
    clicks: (window as unknown as { __n: number }).__n,
    expanded: document.getElementById("probe-sign")!.getAttribute("aria-expanded"),
    activeIsCell: document.activeElement?.classList.contains("cell-native-input") ?? false,
    activeTag: document.activeElement?.tagName,
  }));

  // the keyboard path is untouched by a pointer default
  await page.locator("#probe-sign").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);
  const enter = await page.evaluate(() => ({
    clicks: (window as unknown as { __n: number }).__n,
    expanded: document.getElementById("probe-sign")!.getAttribute("aria-expanded"),
  }));
  await page.keyboard.press(" ");
  await page.waitForTimeout(120);
  const space = await page.evaluate(() => ({
    clicks: (window as unknown as { __n: number }).__n,
    expanded: document.getElementById("probe-sign")!.getAttribute("aria-expanded"),
  }));

  // and the same button WITHOUT the preventDefault, as the control
  await page.evaluate(() => {
    const old = document.getElementById("probe-sign");
    old?.remove();
    const w = window as unknown as { __m: number };
    w.__m = 0;
    const b = document.createElement("button");
    b.id = "probe-sign2";
    b.type = "button";
    b.style.cssText = "position:fixed;top:4px;left:200px;z-index:9999;width:44px;height:44px";
    b.addEventListener("click", () => w.__m++);
    document.body.appendChild(b);
  });
  await cell.click();
  await page.waitForTimeout(120);
  await page.locator("#probe-sign2").click();
  await page.waitForTimeout(150);
  const control = await page.evaluate(() => ({
    clicks: (window as unknown as { __m: number }).__m,
    activeIsCell: document.activeElement?.classList.contains("cell-native-input") ?? false,
    activeTag: document.activeElement?.tagName,
  }));

  out.I = { mouse, enter, space, control };
  expect(true).toBe(true);
});

test.afterAll(async ({}, ti) => {
  writeFileSync(`${OUT}/r2c-${ti.project.name}.json`, JSON.stringify(out, null, 2));
});
