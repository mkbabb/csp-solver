#!/usr/bin/env node
// CTRL-COST pass-3 CRITIC — the two rows the prototype left open, measured.
//  (a) THE RING ON `no` WHILE IT IS FOCUSED: the declared 2px solid at offset −2 against the
//      drawn 1.5 box the same pass put around it (the prototype's own gap 7).
//  (b) THE NOTE ON A COARSE POINTER: band 3's new consequence sentence is summoned by
//      `pointerover` / `focusin:focus-visible`. A thumb has neither in the ordinary case —
//      does the sentence ever reach a phone?
// Usage: node c3-ring-note.mjs <base> <engine> <WxH> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const base = process.argv[2];
const engine = process.argv[3] ?? "webkit";
const [w, h] = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5] ?? "/tmp/c3.json";
const touch = w < 1024;

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: touch,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);

const R = { engine, vp: `${w}x${h}` };

const wasUp = await page.evaluate(
  () => !document.documentElement.classList.contains("drawer-closed"),
);
if (touch && wasUp) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(900);
}
R.dirtied = await page.evaluate(() => {
  const free = [...document.querySelectorAll("input.cell-native-input")].find(
    (i) => !i.readOnly && !i.disabled && !i.value,
  );
  if (!free) return false;
  free.focus();
  return true;
});
if (R.dirtied) {
  await page.keyboard.press("5");
  await page.waitForTimeout(350);
}
if (touch) {
  const tab = await page.$(".drawer-tab, [aria-controls='controls-drawer']");
  if (tab) await tab.click({ force: true }).catch(() => {});
  await page.waitForTimeout(900);
}
await page.evaluate(() =>
  document.querySelector(".deal-face")?.scrollIntoView({ block: "center" }),
);
await page.waitForTimeout(400);

// ── (b) the note on a coarse pointer: TAP the verb, then read the berth ──────
R.noteBeforeTap = await page.evaluate(() => {
  const l = document.querySelector(".cost-band:nth-of-type(3) .band-note, .deal-face")
    ? document.querySelectorAll(".cost-band-head .band-note")[2]
    : null;
  return l ? { text: l.textContent?.trim(), shown: l.className.includes("is-shown") } : null;
});
const vb = await (await page.$(".deal-face .act-verb")).boundingBox();
if (touch) await page.touchscreen.tap(vb.x + vb.width / 2, vb.y + vb.height / 2);
else await page.mouse.click(vb.x + vb.width / 2, vb.y + vb.height / 2);
await page.waitForTimeout(500);
R.noteAfterTap = await page.evaluate(() => {
  const l = document.querySelectorAll(".cost-band-head .band-note")[2];
  const painted = l ? getComputedStyle(l).opacity : null;
  return l
    ? { text: l.textContent?.trim(), shown: l.className.includes("is-shown"), opacity: painted }
    : null;
});
R.armedAfterTap = await page.evaluate(
  () => document.querySelector(".deal-face")?.hasAttribute("data-armed") ?? false,
);

// ── (a) the ring on `no`, read WHILE the keyboard has it ─────────────────────
await page.evaluate(() => {
  document.querySelector(".clear-face .act-verb")?.focus();
});
await page.keyboard.press("Enter");
await page.waitForTimeout(350);
R.ring = await page.evaluate(() => {
  const a = document.querySelector(".clear-face .act-answer");
  if (!a) return null;
  const cs = getComputedStyle(a);
  const box = document.querySelector(".clear-face .act-answer-box");
  const ar = a.getBoundingClientRect();
  const br = box?.getBoundingClientRect();
  return {
    focused: document.activeElement === a,
    matchesFocusVisible: a.matches(":focus-visible"),
    outlineWidth: cs.outlineWidth,
    outlineStyle: cs.outlineStyle,
    outlineColor: cs.outlineColor,
    outlineOffset: cs.outlineOffset,
    answerBox: [+ar.width.toFixed(2), +ar.height.toFixed(2)],
    drawnBox: br ? [+br.width.toFixed(2), +br.height.toFixed(2)] : null,
    // the drawn stroke's own box vs the ring's box: a ring at −2 lands INSIDE the answer,
    // the drawn outline sits at outset 1 around it — the two edges' separation, in px
    ringToStroke: br ? +(((ar.x - br.x) + 2)).toFixed(2) : null,
  };
});

writeFileSync(out, JSON.stringify(R, null, 2));
console.log("DONE", out);
await browser.close();
