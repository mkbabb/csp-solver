#!/usr/bin/env node
/** CTRL-COST critic c4 — three rows the prototype's record does not hold.
 *  A  THE ARM'S SCROLL, on a real tap: does the card move under the thumb between tap 1 and
 *     tap 2, and what does a second tap at the SAME screen point hit?
 *  B  THE HOVER GROUND UNDER THE ASKED WORD: every contrast row in the record is on BARE card,
 *     but `.act-face:has(> .act-verb:hover)` paints `--color-accent` under the armed `sure?`
 *     on every fine pointer. Composited ratio, both themes.
 *  C  THE WINDOW'S LAPSE: focus sits on `no`; 2500ms later `disarm()` moves it back to the
 *     verb with no announcement. Where is focus, and what does the next Enter do?
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c4.json";

const SIG = () =>
  Array.from(document.querySelectorAll(".game-cell input"))
    .map((i) => i.value || ".")
    .join("");

const RECTS = () => {
  const r = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
  };
  const c = document.querySelector(".controls-card");
  return {
    face: r(".deal-face"),
    verb: r(".deal-face .act-verb"),
    answer: r(".deal-face .act-answer"),
    scrollTop: c ? +c.scrollTop.toFixed(2) : null,
    armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
  };
};

const lum = (c) => {
  const f = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

async function open(engine, vp, touch) {
  const br = await engine.launch();
  const ctx = await br.newContext({
    viewport: vp,
    hasTouch: touch,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { br, ctx, page };
}

async function rowA(engine, name) {
  const { br, ctx, page } = await open(engine, { width: 390, height: 844 }, true);
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  const sig0 = await page.evaluate(SIG);
  // bring the verb into view the way a reader would: scroll the card to its foot.
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = c.scrollHeight;
  });
  await page.waitForTimeout(600);
  const before = await page.evaluate(RECTS);
  const pt = {
    x: +(before.verb[0] + before.verb[2] / 2).toFixed(1),
    y: +(before.verb[1] + before.verb[3] / 2).toFixed(1),
  };
  await page.touchscreen.tap(pt.x, pt.y);
  await page.waitForTimeout(700);
  const after = await page.evaluate(RECTS);
  const under = await page.evaluate(
    ([x, y]) => {
      const e = document.elementFromPoint(x, y);
      if (!e) return null;
      const btn = e.closest("button");
      return {
        tag: e.tagName,
        cls: (e.className && e.className.baseVal) || String(e.className || ""),
        btn: btn ? btn.getAttribute("aria-label") || btn.className : null,
        txt: (e.textContent || "").trim().slice(0, 30),
      };
    },
    [pt.x, pt.y],
  );
  // SECOND TAP AT THE SAME SCREEN POINT — the owner-passed two-tap, as a thumb performs it.
  await page.touchscreen.tap(pt.x, pt.y);
  await page.waitForTimeout(1400);
  const sig1 = await page.evaluate(SIG);
  const end = await page.evaluate(RECTS);
  await ctx.close();
  await br.close();
  return {
    engine: name,
    pt,
    before,
    after,
    armScrollDelta: +(after.scrollTop - before.scrollTop).toFixed(2),
    faceMovedPx: +(after.face[1] - before.face[1]).toFixed(2),
    underOldPointAfterArm: under,
    secondTapDealt: sig0 !== sig1,
    stillArmedAfterSecondTap: end.armed,
  };
}

async function rowB(engine, name) {
  const out = { engine: name };
  for (const dark of [false, true]) {
    const { br, ctx, page } = await open(engine, { width: 1280, height: 800 }, false);
    if (dark) {
      await page.evaluate(() => document.documentElement.classList.add("dark"));
      await page.waitForTimeout(500);
    }
    await page.locator('button[aria-label^="Fill in every cell"]').click();
    await page.waitForTimeout(900);
    await page.locator(".deal-btn").click(); // arms
    await page.waitForTimeout(700);
    await page.locator(".deal-btn").hover();
    await page.waitForTimeout(500);
    const read = await page.evaluate(() => {
      const paint = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          const m = bg.match(/[\d.]+/g);
          if (m && (m.length < 4 || +m[3] > 0.95))
            return { color: bg, from: n.className?.toString?.().slice(0, 40) || n.tagName };
          n = n.parentElement;
        }
        return null;
      };
      const word = document.querySelector(".deal-face .act-word.is-armed");
      const no = document.querySelector(".deal-face .act-answer");
      const face = document.querySelector(".deal-face");
      return {
        faceBg: face ? getComputedStyle(face).backgroundColor : null,
        accent: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent")
          .trim(),
        word: word
          ? { ink: getComputedStyle(word).color, vis: getComputedStyle(word).visibility }
          : null,
        no: no
          ? { ink: getComputedStyle(no).color, vis: getComputedStyle(no).visibility }
          : null,
        under: paint(word || document.body),
      };
    });
    // composite: face bg may be semi-transparent over card; read the painted pixel instead.
    const px = await page.evaluate(() => {
      const f = document.querySelector(".deal-face");
      if (!f) return null;
      const b = f.getBoundingClientRect();
      return [b.x + 3, b.y + b.height / 2];
    });
    const shot = await page.screenshot({
      clip: { x: px[0], y: px[1], width: 2, height: 2 },
    });
    read.paintedCorner = shot ? Buffer.from(shot).length : null;
    const rgb = (s) => (s || "").match(/[\d.]+/g)?.slice(0, 3).map(Number);
    const groundStr = read.faceBg && !/, ?0\)$/.test(read.faceBg) ? read.faceBg : read.under?.color;
    const ground = rgb(groundStr);
    read.ground = groundStr;
    if (ground && read.word) read.wordRatio = ratio(rgb(read.word.ink), ground);
    if (ground && read.no) read.noRatio = ratio(rgb(read.no.ink), ground);
    out[dark ? "dark" : "light"] = read;
    await ctx.close();
    await br.close();
  }
  return out;
}

async function rowC(engine, name) {
  const { br, ctx, page } = await open(engine, { width: 1280, height: 800 }, false);
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  const sig0 = await page.evaluate(SIG);
  await page.locator(".deal-btn").focus();
  await page.waitForTimeout(400);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const armedFocus = await page.evaluate(() => ({
    cls: document.activeElement?.className || document.activeElement?.tagName,
    armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
  }));
  await page.waitForTimeout(2800); // the window lapses at 2500
  const lapsed = await page.evaluate(() => ({
    cls: document.activeElement?.className || document.activeElement?.tagName,
    armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
  }));
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1200);
  const afterEnter = await page.evaluate(() => ({
    cls: document.activeElement?.className || document.activeElement?.tagName,
    armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
  }));
  const sig1 = await page.evaluate(SIG);
  await ctx.close();
  await br.close();
  return { engine: name, armedFocus, lapsed, afterEnter, dealtOnLapsedEnter: sig0 !== sig1 };
}

const out = { A: [], B: [], C: [] };
for (const [e, n] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  for (const [k, fn] of [
    ["A", rowA],
    ["B", rowB],
    ["C", rowC],
  ]) {
    try {
      out[k].push(await fn(e, n));
    } catch (err) {
      out[k].push({ engine: n, error: String(err).slice(0, 500) });
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }
}
console.log("DONE", OUT);
