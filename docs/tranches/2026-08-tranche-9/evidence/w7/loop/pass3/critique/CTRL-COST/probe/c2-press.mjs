#!/usr/bin/env node
// CTRL-COST pass-3 CRITIC — the press-count row re-run independently, plus the controlled
// reflow read (scroll the band into view FIRST so the harness's own scrollIntoView cannot be
// mistaken for the app's), the rest word's type rank, and the scrollport's Δ on a pointer arm.
// Usage: node c2-press.mjs <base> <engine> <WxH> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const base = process.argv[2];
const engine = process.argv[3] ?? "webkit";
const [w, h] = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5] ?? "/tmp/c2.json";
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

// dirty the board with the sheet DOWN on a phone
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
  await page.waitForTimeout(400);
}
if (touch) {
  const tab = await page.$(".drawer-tab, [aria-controls='controls-drawer']");
  if (tab) await tab.click({ force: true }).catch(() => {});
  await page.waitForTimeout(900);
}

// the board's signature: every cell's rendered digit, joined
const sig = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("input.cell-native-input")]
      .map((i) => i.value || ".")
      .join(""),
  );

// bring the band into view WITHOUT touching the verb, then settle
await page.evaluate(() => {
  const face = document.querySelector(".deal-face");
  face?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(500);

const boxes = () =>
  page.evaluate(() => {
    const g = (s) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
    };
    const card = document.querySelector(".controls-card");
    return {
      deal: g(".deal-face"),
      clear: g(".clear-face"),
      band: g(".band-acts"),
      scrollTop: +(card?.scrollTop ?? -1).toFixed(2),
      scrollHeight: card?.scrollHeight,
    };
  });

R.before = await boxes();
R.sigBefore = await sig();

// the rest word's type rank on its own hover ground
R.restWord = await page.evaluate(() => {
  const el = document.querySelector(".deal-face .act-word:not(.is-armed)");
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    color: cs.color,
    family: cs.fontFamily.split(",")[0],
  };
});

// focusout tape on the faces
await page.evaluate(() => {
  window.__fo = [];
  for (const f of document.querySelectorAll(".act-face"))
    f.addEventListener("focusout", (e) =>
      window.__fo.push({
        face: f.className.includes("deal") ? "deal" : "clear",
        to: e.relatedTarget ? e.relatedTarget.className || e.relatedTarget.tagName : null,
      }),
    );
});

// PRESS 1 — a real pointer press on the verb, no harness scroll (already in view)
const verb = await page.$(".deal-face .act-verb");
const vb = await verb.boundingBox();
if (touch) {
  await page.touchscreen.tap(vb.x + vb.width / 2, vb.y + vb.height / 2);
} else {
  await page.mouse.click(vb.x + vb.width / 2, vb.y + vb.height / 2);
}
await page.waitForTimeout(350);

R.afterPress1 = {
  armed: await page.evaluate(
    () => document.querySelector(".deal-face")?.hasAttribute("data-armed") ?? false,
  ),
  boxes: await boxes(),
  focusouts: await page.evaluate(() => window.__fo.length),
  focusoutDetail: await page.evaluate(() => window.__fo),
  activeElement: await page.evaluate(
    () => document.activeElement?.className || document.activeElement?.tagName,
  ),
  answer: await page.evaluate(() => {
    const a = document.querySelector(".deal-face .act-answer");
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }),
};
R.reflowDelta = R.before.deal?.map((v, i) => +(R.afterPress1.boxes.deal[i] - v).toFixed(2));
R.clearDelta = R.before.clear?.map((v, i) => +(R.afterPress1.boxes.clear[i] - v).toFixed(2));
R.scrollDelta = +(R.afterPress1.boxes.scrollTop - R.before.scrollTop).toFixed(2);

// PRESS 2 — the blocking row: does it FIRE?
const vb2 = await (await page.$(".deal-face .act-verb")).boundingBox();
if (touch) {
  await page.touchscreen.tap(vb2.x + vb2.width / 2, vb2.y + vb2.height / 2);
} else {
  await page.mouse.click(vb2.x + vb2.width / 2, vb2.y + vb2.height / 2);
}
await page.waitForTimeout(1400);
R.sigAfter = await sig();
R.press2Fires = R.sigBefore !== R.sigAfter;
R.armedAfterPress2 = await page.evaluate(
  () => document.querySelector(".deal-face")?.hasAttribute("data-armed") ?? false,
);

// ── the keyboard half on the CLEAR face: Enter arms, focus lands on `no`
await page.waitForTimeout(600);
const okClear = await page.evaluate(() => {
  const b = document.querySelector(".clear-face .act-verb");
  if (!b) return false;
  b.focus();
  return document.activeElement === b;
});
R.keyboard = { focusedVerb: okClear };
if (okClear) {
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  R.keyboard.armed = await page.evaluate(
    () => document.querySelector(".clear-face")?.hasAttribute("data-armed") ?? false,
  );
  R.keyboard.focusAfterArm = await page.evaluate(
    () => document.activeElement?.className || document.activeElement?.tagName,
  );
  R.keyboard.scrollTopAfterArm = await page.evaluate(
    () => +(document.querySelector(".controls-card")?.scrollTop ?? -1).toFixed(2),
  );
  const sigK = await sig();
  await page.keyboard.press("Enter"); // the second Enter lands on `no` → disarms
  await page.waitForTimeout(500);
  R.keyboard.armedAfterSecondEnter = await page.evaluate(
    () => document.querySelector(".clear-face")?.hasAttribute("data-armed") ?? false,
  );
  R.keyboard.boardUnchanged = (await sig()) === sigK;
  // focus-visible ring on `no`, and the drawn box around it
  R.keyboard.ringOnAnswer = await page.evaluate(() => {
    const a = document.querySelector(".clear-face .act-answer");
    if (!a) return null;
    const cs = getComputedStyle(a);
    return { outline: cs.outline, offset: cs.outlineOffset };
  });
}

writeFileSync(out, JSON.stringify(R, null, 2));
console.log("DONE", out);
await browser.close();
