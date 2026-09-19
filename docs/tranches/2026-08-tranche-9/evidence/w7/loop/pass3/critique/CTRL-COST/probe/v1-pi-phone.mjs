#!/usr/bin/env node
// CTRL-COST pass-3 critic (re-run) — π on the PHONE with the sheet SHUT, both trees.
// The prototype's own census ran at 1280x800 only. Usage: node v1-pi-phone.mjs <base> <engine> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const base = process.argv[2], engine = process.argv[3] ?? "webkit", out = process.argv[4];
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
// shut the sheet if it is up
const up = await page.evaluate(() => !document.documentElement.classList.contains("drawer-closed"));
if (up) { await page.keyboard.press("Escape").catch(() => {}); await page.waitForTimeout(1000); }
const r = await page.evaluate(() => {
  const r2 = (n) => +n.toFixed(2);
  const box = (sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return { x: r2(b.x), y: r2(b.y), w: r2(b.width), h: r2(b.height) }; };
  return {
    drawerClosed: document.documentElement.classList.contains("drawer-closed"),
    masthead: box(".masthead") ?? box("header") ?? box("[class*=masthead]"),
    boardWrapper: box(".board-wrapper"),
    foldTools: box("#fold-tools"),
    playControls: box(".play-controls"),
    foldToolsMinH: (() => { const el = document.querySelector("#fold-tools"); return el ? getComputedStyle(el).minHeight : null; })(),
    foldToolsVar: getComputedStyle(document.documentElement).getPropertyValue("--fold-tools-h") || (document.querySelector("#fold-tools") ? getComputedStyle(document.querySelector("#fold-tools")).getPropertyValue("--fold-tools-h") : null),
    bodyH: r2(document.body.getBoundingClientRect().height),
  };
});
writeFileSync(out, JSON.stringify({ base, engine, ...r }, null, 1));
console.log(engine, JSON.stringify(r));
await browser.close();
