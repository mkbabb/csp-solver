#!/usr/bin/env node
/** CTRL-COST critic c6 — two follow-ups to c5.
 *  A  IS THE WEBKIT BREAK A TOUCH ARTEFACT? Same two presses with a MOUSE at the desk, webkit
 *     and chromium, plus the focusout's `relatedTarget` as the engine reports it.
 *  B  WHERE IS FOCUS AFTER THE DEAL FIRES, and does Escape still reach the drawer? The family
 *     cured exactly this for the DISARM leg; the FIRE leg is unmeasured in its record.
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c6.json";
const SIG = () =>
  Array.from(document.querySelectorAll(".game-cell input"))
    .map((i) => i.value || ".")
    .join("");

async function run(engine, name) {
  const br = await engine.launch();
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    window.__t = [];
    document.querySelector(".deal-face").addEventListener(
      "focusout",
      (e) =>
        window.__t.push({
          related: e.relatedTarget === null ? "NULL" : String(e.relatedTarget.className || e.relatedTarget.tagName),
          armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
        }),
      true,
    );
  });
  const sig0 = await page.evaluate(SIG);
  await page.locator(".deal-btn").click();
  await page.waitForTimeout(700);
  const armed1 = await page.evaluate(
    () => !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
  );
  await page.locator(".deal-btn").click();
  await page.waitForTimeout(3000);
  const sig1 = await page.evaluate(SIG);
  const state = await page.evaluate(() => ({
    armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
    focus: String(document.activeElement?.className || document.activeElement?.tagName),
    sheetTop: document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? null,
    trace: window.__t,
  }));
  // B — Escape after the deal fired.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  const afterEsc = await page.evaluate(() => ({
    sheetTop: document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? null,
    focus: String(document.activeElement?.className || document.activeElement?.tagName),
  }));
  await ctx.close();
  await br.close();
  return {
    engine: name,
    armedAfterFirstClick: armed1,
    secondClickDealt: sig0 !== sig1,
    afterSecondClick: state,
    escapeAfterDeal: afterEsc,
  };
}

const out = [];
for (const [e, n] of [
  [webkit, "webkit"],
  [chromium, "chromium"],
]) {
  try {
    out.push(await run(e, n));
  } catch (err) {
    out.push({ engine: n, error: String(err).slice(0, 500) });
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
}
console.log("DONE", OUT);
