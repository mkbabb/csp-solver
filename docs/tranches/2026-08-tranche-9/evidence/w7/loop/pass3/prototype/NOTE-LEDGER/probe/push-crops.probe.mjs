/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 4 — THE PUSH (hooked at `Element.prototype.animate`,
 * because a `getAnimations()` sample races a hint that arrives off a worker) and the four crops.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER";
mkdirSync(join(BASE, "logs"), { recursive: true });
mkdirSync(join(BASE, "frames"), { recursive: true });
const bank = (n, d) => writeFileSync(join(BASE, "logs", n), JSON.stringify(d, null, 2));
const PROTO = "http://127.0.0.1:4249/";

const HOOK = () => {
  window.__push = [];
  const real = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    if (this.classList?.contains("margin-note-previous"))
      window.__push.push({
        cls: this.className,
        keyframes: JSON.parse(JSON.stringify(kf)),
        options: JSON.parse(JSON.stringify(opts)),
        at: Math.round(performance.now()),
      });
    return real.call(this, kf, opts);
  };
};

async function boardReady(page) {
  await page.goto(PROTO + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}
const focusEmpty = (page, n) =>
  page.evaluate((k) => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    const free = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    free[k]?.focus();
  }, n);
const refuse = (page) =>
  page.evaluate(() => {
    const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
    g?.focus();
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(g, "7");
    g.dispatchEvent(new Event("input", { bubbles: true }));
  });
/** Two records deep: a real hint on line one, then a refusal that pushes it to line two. */
async function toDepthTwo(page) {
  await focusEmpty(page, 0);
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
  await refuse(page);
  await page.waitForTimeout(900);
}

async function run(engineName, reduce) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, reduce };

  // ── THE PUSH, hooked.
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: engineName === "chromium",
      hasTouch: true,
    });
    await ctx.addInitScript(HOOK);
    const page = await ctx.newPage();
    await page.emulateMedia({
      reducedMotion: reduce ? "reduce" : "no-preference",
      colorScheme: "light",
    });
    await boardReady(page);
    await toDepthTwo(page);
    const push = await page.evaluate(() => window.__push);
    const rest = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      return two && { transform: getComputedStyle(two).transform, color: getComputedStyle(two).color };
    });
    // settle: the mover's own animations are finished by the rung
    const settled = await page.evaluate(async () => {
      const two = document.querySelector(".margin-note-previous");
      if (!two) return null;
      const a = two.getAnimations();
      return { running: a.length, states: a.map((x) => x.playState) };
    });
    out.push = { calls: push, rest, settled };
    await ctx.close();
  }

  // ── CROPS.
  const shoot = async (name, rig, scheme, act) => {
    const ctx = await browser.newContext({
      viewport: { width: rig.w, height: rig.h },
      deviceScaleFactor: rig.dsf ?? 2,
      isMobile: rig.mobile && engineName === "chromium",
      hasTouch: !!rig.mobile,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const meta = await act(page);
    const clip = await page.evaluate(() => {
      const strip = document.querySelector(".board-margin");
      const board = document.querySelector('[role="grid"]');
      const tools = document.querySelector("#fold-tools");
      const b = strip.getBoundingClientRect();
      const t = tools?.getBoundingClientRect();
      const brd = board.getBoundingClientRect();
      const top = Math.max(0, brd.bottom - 26);
      const bottom = Math.min(window.innerHeight, (t ? t.bottom : b.bottom + 60) + 6);
      return {
        x: Math.max(0, b.x - 8),
        y: top,
        width: Math.min(window.innerWidth, b.width + 16),
        height: Math.max(40, bottom - top),
      };
    });
    await page.screenshot({ path: join(BASE, "frames", name), clip });
    await ctx.close();
    return meta;
  };

  if (!reduce) {
    // C1 — 390×844 dark, a REAL graphite hint on line one, the FULFILLED record on line two.
    out.C1 = await shoot(
      `C1-390x844-dark-fulfilled-${engineName}.png`,
      { w: 390, h: 844, dsf: 3, mobile: true },
      "dark",
      async (page) => {
        // arm, write the digit it names → the record AGES; then arm again so line one speaks.
        await focusEmpty(page, 0);
        await page.keyboard.press("h");
        await page.waitForTimeout(700);
        const s1 = await page.evaluate(
          () => document.querySelector(".board-margin .margin-note").textContent.trim(),
        );
        const dg = (/(?:only|is) (\S+)|^(\S+) goes/.exec(s1) ?? [])[1] ?? (/^(\S+) goes/.exec(s1) ?? [])[1];
        if (dg) await page.keyboard.type(dg);
        await page.waitForTimeout(700);
        await focusEmpty(page, 1);
        await page.keyboard.press("h");
        await page.waitForTimeout(900);
        return page.evaluate(() => ({
          one: document.querySelector(".board-margin .margin-note").textContent.trim(),
          two: document.querySelector(".margin-note-previous")?.textContent.trim() ?? null,
          oneColor: getComputedStyle(document.querySelector(".board-margin .margin-note")).color,
          twoColor: document.querySelector(".margin-note-previous")
            ? getComputedStyle(document.querySelector(".margin-note-previous")).color
            : null,
        }));
      },
    );

    // C3 — 360×740 coarse dark, the longest 16×16 record on line two at leading 1.1.
    out.C3 = await shoot(
      `C3-360x740-coarse-dark-longest-${engineName}.png`,
      { w: 360, h: 740, dsf: 3, mobile: true },
      "dark",
      async (page) => {
        await toDepthTwo(page);
        // The longest record the 16×16 vocabulary mints — the ransom glyph is the G.
        return page.evaluate(() => {
          const two = document.querySelector(".margin-note-previous");
          if (!two) return null;
          two.textContent = "G goes nowhere else in this column";
          const cs = getComputedStyle(two);
          return {
            text: two.textContent,
            fontSize: cs.fontSize,
            lineHeight: cs.lineHeight,
            width: Math.round(two.getBoundingClientRect().width * 100) / 100,
            clipped: two.scrollWidth - two.clientWidth,
            note: "DOM-overwritten on purpose: the 16x16 glyph is the deal's, and this crop's subject is the leading and the ransom glyph, not the sentence",
          };
        });
      },
    );

    // C4 — 1280 light, the desk pair, real graphite.
    out.C4 = await shoot(
      `C4-1280x800-light-desk-pair-${engineName}.png`,
      { w: 1280, h: 800, dsf: 2, mobile: false },
      "light",
      async (page) => {
        await toDepthTwo(page);
        return page.evaluate(() => ({
          one: document.querySelector(".board-margin .margin-note").textContent.trim(),
          two: document.querySelector(".margin-note-previous")?.textContent.trim() ?? null,
        }));
      },
    );
  }

  await browser.close();
  bank(`P4-push-${engineName}${reduce ? "-reduce" : ""}.json`, out);
  console.log("push+crops done " + engineName + " reduce=" + reduce);
}

await run(process.argv[2], process.argv[3] === "reduce");
