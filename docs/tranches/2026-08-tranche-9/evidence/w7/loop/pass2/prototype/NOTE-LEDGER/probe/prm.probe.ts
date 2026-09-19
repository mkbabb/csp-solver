/**
 * NOTE-LEDGER · pass-2 — L13's PRM half, counted in frames rather than asserted.
 * How many animation frames does the leaving node survive under `prefers-reduced-motion`?
 */
import { test, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

for (const reduced of ["reduce", "no-preference"] as const) {
  test(`L13 frames to removal — PRM ${reduced}`, async ({ browser }, info) => {
    const ctx = await (browser as Browser).newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: info.project.name === "chromium",
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: reduced, colorScheme: "light" });
    await boardReady(page);
    // Two records, so a third pushes one OFF and the leave actually runs.
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const given = inputs.find((i) => i.value);
      if (!given) return;
      given.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(given, "7");
      given.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(600);
    const row = await page.evaluate(async () => {
      const count = () => document.querySelectorAll(".margin-note-previous").length;
      const before = count();
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        /clear/i.test(b.textContent ?? ""),
      ) as HTMLButtonElement | undefined;
      const t0 = performance.now();
      btn?.click();
      const frames: { n: number; count: number; ms: number }[] = [];
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        frames.push({ n: i + 1, count: count(), ms: Math.round(performance.now() - t0) });
        // Settled when only the new line two remains (or none).
        if (i > 2 && frames.at(-1)!.count <= 1 && frames.at(-2)!.count <= 1) break;
      }
      const leaveGone = frames.findIndex((f) => f.count <= 1) + 1;
      return { before, leaveGone, frames };
    });
    writeFileSync(
      `${OUT}/L13-frames-${reduced}-${info.project.name}.json`,
      JSON.stringify(row, null, 2),
    );
    console.log(
      `[L13 ${reduced} ${info.project.name}] leaving node gone after frame ${row.leaveGone}` +
        ` (${row.frames.find((f) => f.count <= 1)?.ms ?? "?"}ms)`,
    );
    await ctx.close();
  });
}
