#!/usr/bin/env node
// CTRL-COST pass-3 CRITIC — T7-W2 A2's row, re-read. HEAD marks `.play-controls` `inert` while
// the risen sheet covers the ribbon; this prototype deletes the attribute and disables the
// Teleport instead, so the verbs ride into the card. The question this probe answers is the
// one the cure existed for: WITH THE SHEET UP, can a tab reach a control the sheet is painting
// over? Reads where `.play-controls` lives, what `#fold-tools` still holds, whether anything
// inside the ribbon is tabbable, and the ribbon's reserved height in both states.
// Usage: node c4-inert.mjs <base> <engine> <WxH> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const base = process.argv[2];
const engine = process.argv[3] ?? "webkit";
const [w, h] = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5] ?? "/tmp/c4.json";

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: true,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);

const read = () =>
  page.evaluate(() => {
    const tools = document.querySelector(".play-controls");
    const fold = document.querySelector("#fold-tools, .fold-tools");
    const card = document.querySelector(".controls-card");
    const focusables = (root) =>
      root
        ? [...root.querySelectorAll("button, [href], input, select, [tabindex]")].filter(
            (e) => !e.hasAttribute("disabled") && e.tabIndex >= 0 && !e.closest("[inert]"),
          ).length
        : null;
    const r = fold?.getBoundingClientRect();
    const tr = tools?.getBoundingClientRect();
    return {
      drawerClosed: document.documentElement.classList.contains("drawer-closed"),
      toolsInCard: !!tools && !!card && card.contains(tools),
      toolsInFold: !!tools && !!fold && fold.contains(tools),
      toolsInert: !!tools?.closest("[inert]"),
      toolsHasInertAttr: tools?.hasAttribute("inert") ?? null,
      foldHeight: r ? +r.height.toFixed(2) : null,
      foldMinHeight: fold ? getComputedStyle(fold).minHeight : null,
      foldToolsH: fold ? getComputedStyle(fold).getPropertyValue("--fold-tools-h").trim() : null,
      foldFocusables: focusables(fold),
      toolsRect: tr ? [+tr.x.toFixed(2), +tr.y.toFixed(2), +tr.width.toFixed(2), +tr.height.toFixed(2)] : null,
      boardY: (() => {
        const b = document.querySelector(".board-wrapper");
        return b ? +b.getBoundingClientRect().y.toFixed(2) : null;
      })(),
      mastheadY: (() => {
        const m = document.querySelector(".masthead, header, .app-masthead");
        return m ? +m.getBoundingClientRect().y.toFixed(2) : null;
      })(),
    };
  });

const R = { engine, vp: `${w}x${h}` };
R.sheetUp = await read();

// shut the sheet
await page.keyboard.press("Escape").catch(() => {});
await page.waitForTimeout(1000);
R.sheetDown = await read();

// re-open it and read again after the slide settles
const tab = await page.$(".drawer-tab, [aria-controls='controls-drawer']");
if (tab) await tab.click({ force: true }).catch(() => {});
await page.waitForTimeout(1000);
R.sheetUpAgain = await read();

// the transitional read: 120 ms into the close, mid-slide
await page.keyboard.press("Escape").catch(() => {});
await page.waitForTimeout(120);
R.midSlide = await read();
await page.waitForTimeout(1200);

writeFileSync(out, JSON.stringify(R, null, 2));
console.log("DONE", out);
await browser.close();
