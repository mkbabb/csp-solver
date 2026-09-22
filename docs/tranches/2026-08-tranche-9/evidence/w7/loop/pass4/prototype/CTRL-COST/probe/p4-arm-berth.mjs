#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — THE CONSEQUENCE SENTENCE, ON THE POINTER CLASS IT WAS WRITTEN FOR.
//
// The critic's §2.6 and the charter's row 2/3: band 3's two NOTES rows are this family's own
// thesis and pass 3's berth was summoned by `pointerover` / `focusin:focus-visible` only — a tap
// supplies neither and a click is not `:focus-visible`, so the sentence painted under a mouse and
// nowhere else. This probe ARMS the face the way a reader does on each pointer class and reads
// the berth's TEXT and painted opacity right after.
//
// It also reads, in the same visit: the two act faces' boxes (charter row 15), the focus ring's
// painted colour on both themes (row 8), and the resting verb word's ratio on its own hover
// ground (row 12).
//
// Usage: node p4-arm-berth.mjs <base> <engine> <WxH> <theme> <pointer:touch|mouse> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [base, engine, vp, theme, pointer, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const touch = pointer === "touch";
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: touch,
  isMobile: false,
  deviceScaleFactor: 2,
  colorScheme: theme,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
await page.goto(`${base}/sudoku?board=1&size=3&difficulty=EASY`);
await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);

// THE REGIME IS WITNESSED, not assumed (LAWS: a coarse row runs with hasTouch in a witnessed
// regime). Both media queries are asserted on the page that takes the reading.
const regime = await page.evaluate(() => ({
  coarse: matchMedia("(pointer: coarse)").matches,
  hover: matchMedia("(hover: hover)").matches,
  maxTouchPoints: navigator.maxTouchPoints,
}));

// DIRTY THE BOARD FIRST, WITH THE SHEET SHUT — the ask is dirty-gated, and on the dock the
// sheet covers the board, so this is the order a reader has to use.
// A BLANK cell, not the first one: a given already holds a digit and typing into it writes
// nothing, so the board stays pristine and the verb DEALS instead of asking — which is the
// correct behaviour and the wrong reading.
const blankIdx = await page.evaluate(() =>
  [...document.querySelectorAll('[role="gridcell"] input')].findIndex(
    (i) => !i.value && !i.readOnly && !i.disabled,
  ),
);
const cell = page.locator('[role="gridcell"] input').nth(blankIdx);
if (blankIdx >= 0) {
  if (touch) await cell.tap();
  else await cell.click();
  await page.keyboard.type("5");
  await page.waitForTimeout(400);
}
const dirty = blankIdx >= 0 ? await cell.inputValue() : "";

// Reach the card: on the portrait dock it lives behind the drawer's tab. The sheet SLIDES
// (~700 ms) — the settled pose is polled, never assumed.
const dock = await page.evaluate(() => innerWidth < 1024);
if (dock) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    await (touch ? tab.tap() : tab.click());
    await page.waitForTimeout(1000);
  }
}
await page.locator(".deal-face").scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(250);

const read = async (label) =>
  page.evaluate((label) => {
    const r2 = (n) => +Number(n).toFixed(2);
    // THE STARTING BAND'S berth, by its own head — there are four and the first is `looking`'s.
    const head = [...document.querySelectorAll(".cost-band-head")].find((h) =>
      /starting over/i.test(h.textContent || ""),
    );
    const berth = head?.querySelector(".note-berth .washi-label") ?? null;
    const b = berth?.getBoundingClientRect();
    const face = document.querySelector(".deal-face");
    const clear = document.querySelector(".clear-face");
    const box = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { w: r2(r.width), h: r2(r.height), y: r2(r.y) };
    };
    return {
      label,
      berthText: (berth?.textContent || "").replace(/\s+/g, " ").trim(),
      berthOpacity: berth ? getComputedStyle(berth).opacity : null,
      berthShown: !!berth?.classList.contains("is-shown"),
      berthBox: b ? { w: r2(b.width), h: r2(b.height) } : null,
      armed: !!document.querySelector(".deal-face[data-armed]"),
      dealFace: box(face),
      clearFace: box(clear),
      dealIcon: box(face?.querySelector("svg")),
      clearIcon: box(clear?.querySelector("svg")),
      focusAfter: document.activeElement?.tagName,
    };
  }, label);

const states = { rest: await read("rest") };

const verb = page.locator(".deal-face .act-verb");
await verb.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
if (touch) await verb.tap();
else await verb.click();
await page.waitForTimeout(500);
states.armed = await read(`armed-by-${pointer}`);

// The ring: focus the verb from the keyboard and read the painted outline on this theme.
await page.keyboard.press("Shift+Tab").catch(() => {});
await page.evaluate(() => document.querySelector(".deal-face .act-verb")?.focus());
await page.keyboard.press("Tab");
await page.keyboard.press("Shift+Tab");
const ring = await page.evaluate(() => {
  const v = document.querySelector(".deal-face .act-verb");
  v?.focus();
  const cs = v ? getComputedStyle(v) : null;
  const face = document.querySelector(".deal-face");
  const fs = face ? getComputedStyle(face) : null;
  const tokenAt = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
  return {
    outline: cs?.outlineColor,
    outlineWidth: cs?.outlineWidth,
    outlineStyle: cs?.outlineStyle,
    faceBg: fs?.backgroundColor,
    cardBg: getComputedStyle(document.querySelector(".controls-card") ?? document.body)
      .backgroundColor,
    ringInk: tokenAt(document.documentElement, "--ring-ink"),
    focusSketch: tokenAt(document.documentElement, "--color-focus-sketch"),
  };
});

// The resting verb word on its own hover ground (row 12) — read on this tree AND expressible on
// the control, since the pair is `.icon-btn:hover`'s at HEAD.
const hoverWord = await page.evaluate(async () => {
  document.querySelector(".deal-face .act-answer")?.dispatchEvent(new Event("blur"));
  const solve = document.querySelector('[data-note="solve"] .act-face') ??
    document.querySelector(".band-acts .act-face");
  if (!solve) return null;
  const word = solve.querySelector(".icon-sublabel");
  solve.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 200));
  const cs = word ? getComputedStyle(word) : null;
  return {
    color: cs?.color,
    ground: getComputedStyle(solve).backgroundColor,
    btnGround: getComputedStyle(solve.closest("button") ?? solve).backgroundColor,
    fontSize: cs?.fontSize,
    weight: cs?.fontWeight,
  };
});

const res = { engine, viewport: vp, theme, pointer, regime, dock, dirty, states, ring, hoverWord, base };
writeFileSync(out, JSON.stringify(res, null, 2));
console.log(
  `${engine} ${vp} ${theme} ${pointer}  coarse=${regime.coarse} hover=${regime.hover} dirty="${dirty}"  ` +
    `armed=${states.armed.armed}  berth="${states.armed.berthText}" op=${states.armed.berthOpacity}  ` +
    `deal ${states.armed.dealFace?.w}x${states.armed.dealFace?.h} clear ${states.armed.clearFace?.w}x${states.armed.clearFace?.h}  ` +
    `ring ${ring.outline} (--ring-ink "${ring.ringInk}")  word ${hoverWord?.color} on ${hoverWord?.ground}`,
);
await browser.close();
