/**
 * NOTE-LEDGER · pass-4 probe 3 — AA FROM PAINTED BYTES, and the push's `from` element.
 *
 * `rest.probe.mjs`'s AA row parsed `color(srgb r g b / a)` with the same regex it used for
 * `rgba()` and silently read the ALPHA as the blue channel (10.224 / 11.308, which is why the
 * numbers did not match pass 3's 5.19 / 6.12). The self-declared incident; this file is the
 * corrected read, and it carries its own negative control — the same string at α 1.0 must
 * report a HIGHER ratio than at α 0.68, or the compositor is not being exercised at all.
 *
 * It also reads the FLIP's `from` element directly (`.margin-note` at the instant the push is
 * called), because the critique's 0×0 finding was about line ONE's rect, not the mover's.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4249/";

const HOOK = () => {
  window.__anims = [];
  const real = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    const live = document.querySelector(".board-margin .margin-note");
    const lr = live?.getBoundingClientRect();
    try {
      window.__anims.push({
        cls: String(this.className),
        moverRect: (() => {
          const r = this.getBoundingClientRect();
          return { w: r.width, h: r.height, top: r.top, bottom: r.bottom };
        })(),
        lineOneRect: lr
          ? { w: lr.width, h: lr.height, top: lr.top, bottom: lr.bottom }
          : null,
        lineOneText: live?.textContent?.trim() ?? "",
        kf: JSON.parse(JSON.stringify(kf)),
        opts: JSON.parse(JSON.stringify(opts ?? {})),
      });
    } catch {
      /* the hook must never break the page */
    }
    return real.call(this, kf, opts);
  };
};

const AA = () => {
  const parse = (c) => {
    if (c.startsWith("color(")) {
      const m = /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/.exec(c);
      return m
        ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
        : { r: 0, g: 0, b: 0, a: 1 };
    }
    const n = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
    return { r: n[0] / 255, g: n[1] / 255, b: n[2] / 255, a: n[3] ?? 1 };
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
  const solidBg = (el) => {
    let n = el;
    while (n) {
      const p = parse(getComputedStyle(n).backgroundColor);
      if (p.a > 0.99) return p;
      n = n.parentElement;
    }
    return { r: 1, g: 1, b: 1, a: 1 };
  };
  const read = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const declared = getComputedStyle(el).color;
    const fg = parse(declared);
    const bg = solidBg(el);
    return {
      declared,
      alpha: fg.a,
      ratio: Math.round(ratio(over(fg, bg), bg) * 1000) / 1000,
      // NEGATIVE CONTROL: the same ink at full pressure. If this does not exceed the composited
      // reading, the compositing step is not being exercised and the number is not a number.
      opaqueRatio:
        Math.round(ratio(over({ ...fg, a: 1 }, bg), bg) * 1000) / 1000,
      bg: getComputedStyle(el).backgroundColor,
    };
  };
  return {
    one: read(".board-margin .margin-note"),
    two: read(".board-margin .margin-note-previous"),
    backdrop: getComputedStyle(document.body).backgroundColor,
  };
};

async function boardReady(page) {
  await page.goto(PROTO + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}
async function focusEmpty(page) {
  return page.evaluate(() => {
    const free = [...document.querySelectorAll(".board-cells input")].filter(
      (i) => !i.value && !i.readOnly && !i.disabled,
    );
    free[0]?.focus();
    return !!free[0];
  });
}
const digitOf = (s) =>
  (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? null;

const out = {};
for (const engine of ["chromium", "webkit"]) {
  const browser = await pw[engine].launch();
  out[engine] = {};
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: engine === "chromium",
    });
    await ctx.addInitScript(HOOK);
    const page = await ctx.newPage();
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
    await boardReady(page);
    // Two records, so line two exists.
    await focusEmpty(page);
    await page.keyboard.press("h");
    await page.waitForTimeout(700);
    const s1 = await page.evaluate(
      () => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    );
    const d1 = digitOf(s1);
    if (d1) await page.keyboard.type(d1);
    await page.waitForTimeout(500);
    await page.evaluate(() => (window.__anims = []));
    await focusEmpty(page);
    await page.keyboard.press("h");
    await page.waitForTimeout(900);
    out[engine][scheme] = await page.evaluate(AA);
    out[engine][scheme].push = await page.evaluate(
      () => window.__anims.filter((a) => a.cls.includes("margin-note-previous"))[0] ?? null,
    );
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(join(OUT, "aa.json"), JSON.stringify(out, null, 2));
for (const e of Object.keys(out))
  for (const s of Object.keys(out[e])) {
    const o = out[e][s];
    console.log(
      `${e} ${s}: one ${o.one?.ratio} (α${o.one?.alpha}, opaque ${o.one?.opaqueRatio}) · ` +
        `two ${o.two?.ratio} (α${o.two?.alpha}, opaque ${o.two?.opaqueRatio}) · bg ${o.backdrop} · ` +
        `push from lineOne ${JSON.stringify(o.push?.lineOneRect)} text="${o.push?.lineOneText}" ` +
        `tf=${o.push?.kf?.[0]?.transform}`,
    );
  }
