#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — TWO PAINTED CONTRAST ROWS AND ONE PROVENANCE ROW.
//
//  (a) THE RESTING VERB WORD ON ITS OWN HOVER GROUND (charter row 12). Pass 3 read 4.382 and
//      the row is inherited from HEAD's `.icon-btn:hover` — so it is read HERE AND ON THE
//      CONTROL, with a real mouse hover (a dispatched `pointerover` does not match `:hover`),
//      and the provenance decides whether it is this family's or the estate's.
//  (b) THE RING'S NON-TEXT CONTRAST (charter row 8) — the painted outline colour against the
//      two surfaces it is drawn between: the face's ground and the card's paper, both themes.
//  Ratios are computed from the PAINTED rgb the engine reports, composited over the ground.
//
// Usage: node p4-ink.mjs <base> <label> <engine> <theme> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [base, label, engine, theme, out] = process.argv.slice(2);
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  colorScheme: theme,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
await page.goto(`${base}/sudoku?board=1&size=3&difficulty=EASY`);
await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);

// The verb whose word this row is about: `solve` on both trees — a boxed act here, a bare
// `.icon-btn` on the control, and in both cases the ground under the word is the button's hover.
// The SAME control on both trees: this tree addresses it by `data-note`, the control by its
// accessible name. One verb, two addresses — the provenance row needs the control's number.
const verb = page
  .locator('[data-note="solve"], button[aria-label="Solve puzzle"]')
  .first();
const has = (await verb.count()) > 0;
if (has) {
  await verb.scrollIntoViewIfNeeded();
  await verb.hover();
  await page.waitForTimeout(350);
}

const read = await page.evaluate(() => {
  const el =
    document.querySelector('[data-note="solve"]') ??
    document.querySelector('button[aria-label="Solve puzzle"]');
  if (!el) return null;
  const word = el.querySelector(".icon-sublabel");
  const face = el.querySelector(".act-face") ?? el;
  const card = document.querySelector(".controls-card") ?? document.body;
  const cs = word ? getComputedStyle(word) : null;
  return {
    word: cs?.color,
    fontSize: cs?.fontSize,
    weight: cs?.fontWeight,
    faceGround: getComputedStyle(face).backgroundColor,
    btnGround: getComputedStyle(el.closest("button") ?? el).backgroundColor,
    cardGround: getComputedStyle(card).backgroundColor,
    hovered: el.matches(":hover") || face.matches(":hover"),
  };
});

// The ring, keyboard-focused so `:focus-visible` is genuinely on.
await page.keyboard.press("Tab");
const ring = await page.evaluate(() => {
  const target =
    document.querySelector(".deal-face .act-verb") ??
    document.querySelector(".controls-card button");
  target?.focus();
  const cs = target ? getComputedStyle(target) : null;
  const face = target?.closest(".act-face") ?? target;
  return {
    outlineColor: cs?.outlineColor,
    outlineWidth: cs?.outlineWidth,
    faceGround: face ? getComputedStyle(face).backgroundColor : null,
    cardGround: getComputedStyle(
      document.querySelector(".controls-card") ?? document.body,
    ).backgroundColor,
    token: getComputedStyle(document.documentElement).getPropertyValue("--ring-ink").trim(),
  };
});

const parse = (c) => {
  const m = /rgba?\(([^)]+)\)/.exec(c || "");
  if (!m) return null;
  const p = m[1].split(",").map((v) => parseFloat(v));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const over = (fg, bg) =>
  !fg || !bg
    ? null
    : { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };
const lum = (c) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (a, b) => {
  if (!a || !b) return null;
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

const card = parse(read?.cardGround);
const ground = over(parse(read?.faceGround), over(parse(read?.btnGround), card)) ?? card;
const wordRatio = ratio(over(parse(read?.word), ground), ground);
const ringOnFace = ratio(
  over(parse(ring.outlineColor), over(parse(ring.faceGround), parse(ring.cardGround)) ?? parse(ring.cardGround)),
  over(parse(ring.faceGround), parse(ring.cardGround)) ?? parse(ring.cardGround),
);
const ringOnCard = ratio(over(parse(ring.outlineColor), parse(ring.cardGround)), parse(ring.cardGround));

const res = { label, engine, theme, base, read, ring, wordRatio, ringOnFace, ringOnCard };
writeFileSync(out, JSON.stringify(res, null, 2));
console.log(
  `${label} ${engine} ${theme}  verb word ${read?.word} on ${read?.faceGround}/${read?.btnGround} (hovered ${read?.hovered}) = ${wordRatio}  ` +
    `ring ${ring.outlineColor} @${ring.outlineWidth} on face ${ringOnFace} / on card ${ringOnCard}  token "${ring.token}"`,
);
await browser.close();
