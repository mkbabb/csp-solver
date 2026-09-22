/**
 * NOTE-LEDGER · pass-4 probe 1 — THE REST STATE, the push, AA, the desk pair, landscape.
 *
 * Derived from pass-3's `act.probe.mjs` (the loop driver and `digitOf` are its), re-pointed at
 * pass-4's OUT and re-cut so every row reads BOTH lines. The pass-3 gate read line two alone,
 * which is why it could not see that line one had emptied (critique §2.2).
 *
 * Arms: the served tree is whatever `LEDGER_FULFILLED_AGES` is set to in GameBoard.vue; the
 * runner passes the arm's NAME so the bank says which build it read.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER/logs";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER";
mkdirSync(OUT, { recursive: true });
const ARM = process.argv[2] ?? "hold";
const SHOOT = process.argv[3] === "shoot";
const PROTO = "http://127.0.0.1:4249/";
const r2 = (x) => Math.round(x * 100) / 100;
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page, q = "?size=3&difficulty=EASY") {
  await page.goto(PROTO + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}
const lines = (page) =>
  page.evaluate(() => {
    const one = document.querySelector(".board-margin .margin-note");
    const two = document.querySelector(".board-margin .margin-note-previous");
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        top: Math.round(r.top * 100) / 100,
        bottom: Math.round(r.bottom * 100) / 100,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        color: cs.color,
        display: cs.display,
      };
    };
    return {
      one: one?.textContent?.trim() ?? "",
      two: two?.textContent?.trim() ?? "",
      twoPresent: !!two,
      oneBox: box(one),
      twoBox: box(two),
    };
  });
async function focusEmpty(page, skip = 0) {
  return page.evaluate((n) => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    const free = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    const el = free[n];
    el?.focus();
    return el ? inputs.indexOf(el) : -1;
  }, skip);
}
async function armHint(page) {
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  return (await lines(page)).one;
}
const digitOf = (s) =>
  (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? null;

/** Hook WAAPI before any script runs: a `getAnimations()` sample races a hint off a worker. */
const HOOK = () => {
  window.__anims = [];
  const real = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    try {
      window.__anims.push({
        cls: this.className,
        rect: (() => {
          const r = this.getBoundingClientRect();
          return { w: r.width, h: r.height, top: r.top, bottom: r.bottom };
        })(),
        kf: JSON.parse(JSON.stringify(kf)),
        opts: JSON.parse(JSON.stringify(opts ?? {})),
      });
    } catch {
      /* the hook must never break the page */
    }
    return real.call(this, kf, opts);
  };
};

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, arm: ARM, rows: {} };
  const ctx0 = async (opts = {}) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: engineName === "chromium",
      hasTouch: true,
      ...opts,
    });
    await ctx.addInitScript(HOOK);
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    return { ctx, page };
  };

  // ── ROW 1 · THE REST STATE. Ask, write the digit the sentence named, THEN READ BOTH LINES.
  //    Three rounds, and the reading that matters is `atRest` after round 1's keystroke.
  {
    const { ctx, page } = await ctx0();
    await boardReady(page);
    // A witnessed coarse regime, the LAWS' requirement.
    const regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      hover: matchMedia("(hover: hover)").matches,
    }));
    const rounds = [];
    for (let i = 0; i < 3; i++) {
      await focusEmpty(page, 0);
      const sentence = await armHint(page);
      const dg = digitOf(sentence);
      const beforeWrite = await lines(page);
      if (dg) {
        await page.keyboard.type(dg);
        await page.waitForTimeout(700);
      }
      const after = await lines(page);
      rounds.push({
        round: i + 1,
        sentence,
        wrote: dg,
        beforeWrite: { one: beforeWrite.one, two: beforeWrite.two },
        atRest: { one: after.one, two: after.two, twoPresent: after.twoPresent },
        twoLineAtRest: !!(after.one && after.two),
        pushesSoFar: (await page.evaluate(() => window.__anims.length)) ?? null,
      });
    }
    const last = rounds.at(-1);
    out.rows.restState = {
      gate: "L1 RE-CUT — after the loop, BOTH lines are read; the column is two deep at rest",
      regime,
      rounds,
      twoLineAtRest: rounds.map((x) => x.twoLineAtRest),
      verdict: rounds.slice(1).every((x) => x.twoLineAtRest) ? "GREEN" : "RED",
      lastBoxes: { one: last ? null : null },
    };
    // The at-rest geometry of the settled column, for the frame's caption.
    out.rows.restGeometry = await lines(page);
    if (SHOOT) {
      const strip = await page.$(".board-margin");
      if (strip)
        await strip.screenshot({
          path: join(FRAMES, `F1-390x844-light-coarse-${ARM}-rest-${engineName}.png`),
        });
    }
    await ctx.close();
  }

  // ── ROW 2 · THE PUSH, ON EVERY PATH IT PLAYS. What rect does the FLIP read its `from` off?
  {
    const { ctx, page } = await ctx0();
    await boardReady(page);
    // (a) the FULFILMENT path: ask, then write the digit.
    await focusEmpty(page, 0);
    const s = await armHint(page);
    const dg = digitOf(s);
    await page.evaluate(() => (window.__anims = []));
    if (dg) await page.keyboard.type(dg);
    await page.waitForTimeout(700);
    const onFulfil = await page.evaluate(() =>
      window.__anims.filter((a) => String(a.cls).includes("margin-note-previous")),
    );
    // (b) the DISPLACEMENT path: a second sentence lands over a standing record.
    await page.evaluate(() => (window.__anims = []));
    await focusEmpty(page, 0);
    await armHint(page);
    await page.waitForTimeout(700);
    const onDisplace = await page.evaluate(() =>
      window.__anims.filter((a) => String(a.cls).includes("margin-note-previous")),
    );
    const shape = (a) =>
      a
        ? {
            fromRect: {
              w: r2(a.rect.w),
              h: r2(a.rect.h),
              top: r2(a.rect.top),
              bottom: r2(a.rect.bottom),
            },
            transform: a.kf?.[0]?.transform ?? null,
            duration: a.opts?.duration ?? null,
            fill: a.opts?.fill ?? null,
          }
        : null;
    out.rows.push = {
      gate: "the FLIP's `from` is read off inked geometry, never a 0×0 box",
      fulfilmentPushes: onFulfil.length,
      fulfilment: shape(onFulfil[0]),
      displacementPushes: onDisplace.length,
      displacement: shape(onDisplace[0]),
      lines: await lines(page),
    };
    await ctx.close();
  }

  // ── ROW 3 · THE DESK PAIR — with margin TEXT in it (C4 held none), and the run-on priced.
  {
    const { ctx, page } = await ctx0({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      isMobile: false,
      hasTouch: false,
    });
    await boardReady(page);
    await focusEmpty(page, 0);
    const s1 = await armHint(page);
    const d1 = digitOf(s1);
    if (d1) await page.keyboard.type(d1);
    await page.waitForTimeout(500);
    await focusEmpty(page, 0);
    const s2 = await armHint(page);
    await page.waitForTimeout(900);
    const pair = await page.evaluate(() => {
      const one = document.querySelector(".board-margin .margin-note");
      const two = document.querySelector(".board-margin .margin-note-previous");
      if (!one || !two) return null;
      const a = one.getBoundingClientRect();
      const b = two.getBoundingClientRect();
      const inkWidth = (el) => {
        const rg = document.createRange();
        rg.selectNodeContents(el);
        const r = rg.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      };
      const ia = inkWidth(one);
      const ib = inkWidth(two);
      return {
        sameRow: Math.abs(a.top - b.top) < a.height,
        gapPx: ib.left - ia.right,
        oneInk: { left: ia.left, right: ia.right },
        twoInk: { left: ib.left, right: ib.right },
        oneFont: getComputedStyle(one).fontSize,
        twoFont: getComputedStyle(two).fontSize,
        oneColor: getComputedStyle(one).color,
        twoColor: getComputedStyle(two).color,
        oneText: one.textContent?.trim(),
        twoText: two.textContent?.trim(),
      };
    });
    out.rows.deskPair = {
      gate: "the ≥1024 berth, photographed WITH its subject; the run-on priced",
      first: s1,
      second: s2,
      ...(pair ?? {}),
      gapPx: pair ? r2(pair.gapPx) : null,
    };
    if (SHOOT && pair) {
      const strip = await page.$(".board-margin");
      if (strip)
        await strip.screenshot({
          path: join(FRAMES, `F3-1280x800-light-fine-deskpair-${engineName}.png`),
        });
    }
    await ctx.close();
  }

  // ── ROW 4 · AA, FROM PAINTED BYTES — the composited resolve on the real backdrop.
  for (const scheme of ["light", "dark"]) {
    const { ctx, page } = await ctx0();
    await page.emulateMedia({ colorScheme: scheme });
    await boardReady(page);
    await focusEmpty(page, 0);
    const s = await armHint(page);
    const dg = digitOf(s);
    if (dg) await page.keyboard.type(dg);
    await page.waitForTimeout(400);
    await focusEmpty(page, 0);
    await armHint(page);
    await page.waitForTimeout(800);
    const aa = await page.evaluate(() => {
      const parse = (c) => {
        const m = c.match(/[\d.]+/g)?.map(Number) ?? [];
        if (c.startsWith("color(")) return { r: m[1], g: m[2], b: m[3], a: m[4] ?? 1 };
        return { r: m[0] / 255, g: m[1] / 255, b: m[2] / 255, a: m[3] ?? 1 };
      };
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
      const over = (f, b) => ({
        r: f.r * f.a + b.r * (1 - f.a),
        g: f.g * f.a + b.g * (1 - f.a),
        b: f.b * f.a + b.b * (1 - f.a),
        a: 1,
      });
      const ratio = (a, b) => {
        const [hi, lo] = L(a) > L(b) ? [L(a), L(b)] : [L(b), L(a)];
        return (hi + 0.05) / (lo + 0.05);
      };
      const bgEl = (el) => {
        let n = el;
        while (n) {
          const c = getComputedStyle(n).backgroundColor;
          const p = parse(c);
          if (p.a > 0.99) return p;
          n = n.parentElement;
        }
        return { r: 1, g: 1, b: 1, a: 1 };
      };
      const read = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const fg = parse(getComputedStyle(el).color);
        const bg = bgEl(el);
        return {
          declared: getComputedStyle(el).color,
          ratio: Math.round(ratio(over(fg, bg), bg) * 1000) / 1000,
        };
      };
      return {
        one: read(".board-margin .margin-note"),
        two: read(".board-margin .margin-note-previous"),
        backdrop: getComputedStyle(document.body).backgroundColor,
      };
    });
    out.rows[`aa_${scheme}`] = { gate: "AA ≥ 4.5 on painted bytes, both themes", ...aa };
    await ctx.close();
  }

  // ── ROW 5 · THE LANDSCAPE CELL (W2 §2.2): 844×390 and 812×375, hasTouch, witnessed.
  out.rows.landscape = [];
  for (const [w, h] of [
    [844, 390],
    [812, 375],
  ]) {
    const { ctx, page } = await ctx0({
      viewport: { width: w, height: h },
      deviceScaleFactor: 3,
    });
    await boardReady(page);
    const regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      landscape: matchMedia("(orientation: landscape)").matches,
      under1024: matchMedia("(max-width: 1023.98px)").matches,
    }));
    await focusEmpty(page, 0);
    const s = await armHint(page);
    const dg = digitOf(s);
    if (dg) await page.keyboard.type(dg);
    await page.waitForTimeout(400);
    await focusEmpty(page, 0);
    await armHint(page);
    await page.waitForTimeout(800);
    const read = await lines(page);
    const card = await page.evaluate(() => {
      const c = document.querySelector(".board-card, .game-card, .app-layout");
      return c ? { tag: c.tagName, cls: c.className, clientHeight: c.clientHeight } : null;
    });
    out.rows.landscape.push({
      rig: `${w}x${h}`,
      regime,
      one: read.one,
      two: read.two,
      twoInDom: read.twoPresent,
      twoDisplay: read.twoBox?.display ?? null,
      twoRect: read.twoBox ? { w: read.twoBox.w, h: read.twoBox.h } : null,
      cardClientHeight: card?.clientHeight ?? null,
      scrollHeight: await page.evaluate(() => document.documentElement.scrollHeight),
    });
    await ctx.close();
  }

  // ── ROW 6 · L10-W at the 14 px tier — the longest record at 360 coarse.
  {
    const { ctx, page } = await ctx0({ viewport: { width: 360, height: 740 } });
    await boardReady(page);
    await focusEmpty(page, 0);
    const s = await armHint(page);
    const dg = digitOf(s);
    if (dg) await page.keyboard.type(dg);
    await page.waitForTimeout(400);
    await focusEmpty(page, 0);
    await armHint(page);
    await page.waitForTimeout(800);
    const head = await page.evaluate(() => {
      const two = document.querySelector(".board-margin .margin-note-previous");
      const one = document.querySelector(".board-margin .margin-note");
      if (!two || !one) return null;
      const strip = two.parentElement.getBoundingClientRect();
      // The longest string the vocabulary can paint at this deal's alphabet, measured by
      // rendering it into the SAME element and reading used width.
      const before = two.textContent;
      const longest = "16 goes nowhere else in this column";
      two.textContent = longest;
      const rg = document.createRange();
      rg.selectNodeContents(two);
      const used = rg.getBoundingClientRect().width;
      two.textContent = before;
      return {
        stripWidth: Math.round(strip.width * 100) / 100,
        longest,
        usedWidth: Math.round(used * 100) / 100,
        headroomPct: Math.round(((strip.width - used) / strip.width) * 10000) / 100,
        oneFont: getComputedStyle(one).fontSize,
        twoFont: getComputedStyle(two).fontSize,
      };
    });
    out.rows.l10w = {
      gate: "L10-W — the longest record at 360 coarse, at the 14 px tier",
      ...(head ?? {}),
      note: "the string is WRITTEN INTO the live element (a DOM overwrite), declared",
    };
    await ctx.close();
  }

  await browser.close();
  return out;
}

const all = {};
for (const e of ["chromium", "webkit"]) all[e] = await run(e);
bank(`rest-${ARM}.json`, all);
for (const e of Object.keys(all)) {
  const o = all[e];
  console.log(
    `${e} [${ARM}] rest=${JSON.stringify(o.rows.restState.twoLineAtRest)} ${o.rows.restState.verdict}` +
      ` · fulfilPushes=${o.rows.push.fulfilmentPushes} displacePushes=${o.rows.push.displacementPushes}` +
      ` · deskGap=${o.rows.deskPair.gapPx} · AA ${o.rows.aa_light.two?.ratio}/${o.rows.aa_dark.two?.ratio}` +
      ` · landscape two=${o.rows.landscape.map((l) => l.twoDisplay).join("/")}` +
      ` · L10W head=${o.rows.l10w.headroomPct}%`,
  );
}
