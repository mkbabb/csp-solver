/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 2 — the acts, the motion, the a11y, the clip.
 *
 * Gates: L1 (the canonical loop, LIVED), L6, L11, L11b, L12, L13 (exit + rung + the
 * publisher-delete negative control), L14 with the debug tally, L15, L17, and the push.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const PROTO = "http://127.0.0.1:4249/";

const r2 = (x) => Math.round(x * 100) / 100;

async function boardReady(page, q = "?size=3&difficulty=EASY") {
  await page.goto(PROTO + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}
const lines = (page) =>
  page.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    two:
      document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ?? "",
  }));
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
/** The digit the sentence names — the ONLY thing the loop reads off the copy. */
const digitOf = (s) => (/(?:only|is)\s+(\S+)\s|^(\S+)\s+goes/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? null;

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, rows: {} };
  const ctx0 = async (opts = {}) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: engineName === "chromium",
      hasTouch: true,
      ...opts,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    return { ctx, page };
  };

  // ── L1 · THE CANONICAL LOOP, LIVED. Ask, write the digit the sentence named. Three rounds.
  {
    const { ctx, page } = await ctx0();
    await boardReady(page);
    const rounds = [];
    for (let i = 0; i < 3; i++) {
      const pos = await focusEmpty(page, 0);
      const sentence = await armHint(page);
      const dg = digitOf(sentence);
      if (dg) {
        await page.keyboard.type(dg);
        await page.waitForTimeout(700);
      }
      rounds.push({ round: i + 1, pos, sentence, wrote: dg, after: await lines(page) });
    }
    out.rows.L1 = {
      gate: "the canonical loop three rounds deep leaves a two-line column",
      rounds,
      verdict:
        rounds.every((x) => x.after.two) && rounds.at(-1).after.two
          ? "GREEN"
          : "RED",
    };
    await ctx.close();
  }

  // ── L11 / L11b · THE STRIKE, SPLIT. Real surface, real keystrokes.
  {
    const { ctx, page } = await ctx0();
    await boardReady(page);
    const rows = [];
    // (a) FULFIL: the digit the sentence named, where it said.
    await focusEmpty(page, 0);
    let s = await armHint(page);
    let dg = digitOf(s);
    await page.keyboard.type(dg ?? "1");
    await page.waitForTimeout(700);
    rows.push({ row: "fulfil", sentence: s, wrote: dg, after: await lines(page) });
    await ctx.close();

    // (b) FALSIFY ON CELL: a different digit on the very square.
    const b = await ctx0();
    await boardReady(b.page);
    await focusEmpty(b.page, 0);
    s = await armHint(b.page);
    dg = digitOf(s);
    const other = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].find((d) => d !== dg);
    await b.page.keyboard.type(other);
    await b.page.waitForTimeout(700);
    rows.push({ row: "falsify-on-cell", sentence: s, wrote: other, after: await lines(b.page) });
    await b.ctx.close();

    // (c)/(d) THE HOUSE. Hunt a hidden-single sentence, then write (c) the SAME digit
    //         elsewhere in the row and (d) ANOTHER digit elsewhere in the row.
    for (const [row, same] of [
      ["house-same-digit", true],
      ["house-other-digit", false],
    ]) {
      const h = await ctx0();
      await boardReady(h.page);
      let sentence = "",
        armedPos = -1,
        found = false;
      for (let k = 0; k < 24 && !found; k++) {
        armedPos = await focusEmpty(h.page, k);
        if (armedPos < 0) break;
        sentence = await armHint(h.page);
        if (/goes nowhere else in this row/.test(sentence)) found = true;
      }
      if (!found) {
        rows.push({ row, skipped: "no hidden-single-on-row hint on this deal" });
        await h.ctx.close();
        continue;
      }
      const d0 = digitOf(sentence);
      const wrote = await h.page.evaluate(
        ({ armedPos, d0, same }) => {
          const inputs = [...document.querySelectorAll(".board-cells input")];
          const rowOf = (i) => Math.floor(i / 9);
          const target = inputs.findIndex(
            (el, i) => i !== armedPos && rowOf(i) === rowOf(armedPos) && !el.value && !el.readOnly,
          );
          if (target < 0) return null;
          const taken = new Set(
            inputs.filter((e, i) => rowOf(i) === rowOf(armedPos) && e.value).map((e) => e.value),
          );
          const pick = same
            ? d0
            : "123456789".split("").find((c) => c !== d0 && !taken.has(c));
          inputs[target].focus();
          return { target, pick };
        },
        { armedPos, d0, same },
      );
      if (wrote?.pick) {
        await h.page.keyboard.type(wrote.pick);
        await h.page.waitForTimeout(700);
      }
      rows.push({ row, sentence, armedPos, wrote, after: await lines(h.page) });
      await h.ctx.close();
    }
    out.rows.L11 = rows;
  }

  // ── L13 · THE EXIT AND THE RUNG + the push. PRM off.
  {
    const { ctx, page } = await ctx0();
    await boardReady(page);
    const rungs = await page.evaluate(() => ({
      note: getComputedStyle(document.documentElement).getPropertyValue("--motion-note").trim(),
      whisper: getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-whisper")
        .trim(),
      publisher: !!document.querySelector("style[data-motion-rungs]"),
    }));
    // depth 2, then a THIRD record so line two leaves through the rub-out.
    await focusEmpty(page, 0);
    await armHint(page);
    await page.evaluate(() => {
      const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
      g?.focus();
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(g, "7");
      g.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(700);
    const atDepth2 = await lines(page);
    // The push's own reading, sampled on the frame after a new record lands.
    const push = await page.evaluate(async () => {
      const two = document.querySelector(".margin-note-previous");
      const one = document.querySelector(".board-margin .margin-note");
      return {
        bodySize: one && parseFloat(getComputedStyle(one).fontSize),
        tagSize: two && parseFloat(getComputedStyle(two).fontSize),
        ratio:
          one && two
            ? parseFloat(getComputedStyle(one).fontSize) /
              parseFloat(getComputedStyle(two).fontSize)
            : null,
        restTransform: two && getComputedStyle(two).transform,
        anims: two
          ? two.getAnimations().map((a) => ({
              fill: a.effect?.getComputedTiming?.().fill,
              duration: a.effect?.getComputedTiming?.().duration,
              easing: a.effect?.getComputedTiming?.().easing,
            }))
          : [],
      };
    });
    // Now trigger the LEAVE: a third record pushes line two off.
    const during = await page.evaluate(async () => {
      const block = document.querySelector(".margin-note-block");
      const seen = [];
      const stop = performance.now() + 400;
      // fire the third record by arming another hint
      const free = [...document.querySelectorAll(".board-cells input")].filter(
        (i) => !i.value && !i.readOnly,
      );
      free[1]?.focus();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
      free[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
      return new Promise((res) => {
        const tick = () => {
          const els = [...block.querySelectorAll(".margin-note-previous")];
          for (const el of els) {
            const cs = getComputedStyle(el);
            if (cs.animationName !== "none")
              seen.push({
                t: Math.round(performance.now()),
                animationName: cs.animationName,
                animationDuration: cs.animationDuration,
                transitionDuration: cs.transitionDuration,
                cls: el.className,
              });
          }
          if (performance.now() < stop) requestAnimationFrame(tick);
          else res(seen.slice(0, 12));
        };
        requestAnimationFrame(tick);
      });
    });
    out.rows.L13 = { rungs, atDepth2, push, duringLeave: during };
    await ctx.close();
  }

  // ── PRM: the site arm.
  {
    const { ctx, page } = await ctx0();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await boardReady(page);
    const rungs = await page.evaluate(() => ({
      note: getComputedStyle(document.documentElement).getPropertyValue("--motion-note").trim(),
      whisper: getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-whisper")
        .trim(),
    }));
    await focusEmpty(page, 0);
    await armHint(page);
    const prm = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      const probe = document.createElement("p");
      probe.className = "margin-note-previous note-previous-leave-active";
      (two?.parentElement ?? document.body).appendChild(probe);
      const cs = getComputedStyle(probe);
      const out = {
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
      };
      probe.remove();
      return out;
    });
    out.rows.PRM = { rungs, leaveClassUnderReduce: prm };
    await ctx.close();
  }

  // ── L6 a11y + L15 the descender & the ellipsis + L17 the attribute audit.
  {
    const { ctx, page } = await ctx0({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, deviceScaleFactor: 2 });
    await boardReady(page);
    await focusEmpty(page, 0);
    await armHint(page);
    await page.evaluate(() => {
      const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
      g?.focus();
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(g, "7");
      g.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(700);
    const a11y = await page.evaluate(() => {
      const strip = document.querySelector(".board-margin");
      const two = document.querySelector(".margin-note-previous");
      return {
        statusCount: strip.querySelectorAll('[role="status"]').length,
        twoRole: two?.getAttribute("role"),
        twoAriaHidden: two?.getAttribute("aria-hidden"),
        twoTag: two?.tagName,
        twoAttrs: two ? [...two.attributes].map((a) => a.name) : null,
        stateDataAttrs: two
          ? [...two.attributes]
              .map((a) => a.name)
              .filter((n) => n.startsWith("data-") && !/^data-v-[0-9a-f]+$/.test(n))
          : null,
        userSelect: two && getComputedStyle(two).userSelect,
      };
    });
    const snap = await page.locator(".board-margin").ariaSnapshot().catch((e) => String(e));
    // L15 — the descender, and a planted 400px string under the clip.
    const desc = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      const cs = getComputedStyle(two);
      const before = two.textContent;
      two.textContent = "the g of goes";
      const b = two.getBoundingClientRect();
      const cnv = document.createElement("canvas");
      const ctx = cnv.getContext("2d");
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
      const m = ctx.measureText("the g of goes");
      const lh = parseFloat(cs.lineHeight);
      const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
      const inkBottom = b.top + half + m.fontBoundingBoxAscent + m.actualBoundingBoxDescent;
      const boxBottom = b.bottom;
      // the planted long string
      two.textContent = "x".repeat(400);
      const long = {
        clientWidth: Math.round(two.clientWidth),
        scrollWidth: Math.round(two.scrollWidth),
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        textOverflow: cs.textOverflow,
      };
      two.textContent = before;
      return {
        boxBottom: Math.round(boxBottom * 100) / 100,
        inkBottom: Math.round(inkBottom * 100) / 100,
        belowBox: Math.round((inkBottom - boxBottom) * 100) / 100,
        long,
      };
    });
    out.rows.a11y = a11y;
    out.rows.ariaSnapshot = typeof snap === "string" ? snap.slice(0, 900) : snap;
    out.rows.L15 = desc;
    await ctx.close();
  }

  // ── L14 with the DEBUG TALLY staged (the tally is localStorage-gated).
  for (const w of [1024, 1280]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 800 },
      deviceScaleFactor: 2,
    });
    await ctx.addInitScript(() => localStorage.setItem("sudoku-debug", "true"));
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    try {
      await boardReady(page);
      await focusEmpty(page, 0);
      await armHint(page);
      await page.evaluate(() => {
        const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
        g?.focus();
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        set.call(g, "7");
        g.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await page.waitForTimeout(700);
      // stage the LONGEST aged record + a verdict on line one
      const read = await page.evaluate(() => {
        const two = document.querySelector(".margin-note-previous");
        const meta = document.querySelector(".margin-note-meta");
        const block = document.querySelector(".margin-note-block");
        const one = document.querySelector(".board-margin .margin-note");
        if (two) two.textContent = "16 goes nowhere else in this column";
        const cs = two && getComputedStyle(two);
        const probe = document.createElement("span");
        if (two) {
          probe.style.cssText = `position:absolute;visibility:hidden;font:${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily};width:1ch`;
          two.appendChild(probe);
        }
        const oneCh = two ? probe.getBoundingClientRect().width : null;
        probe.remove();
        const bb = (e) => (e ? e.getBoundingClientRect() : null);
        const tb = bb(two);
        // Does anything paint inside a ctrl-btn?
        const btns = [...document.querySelectorAll("button.ctrl-btn")].map((b) => b.getBoundingClientRect());
        const inside = tb
          ? btns.filter((b) => tb.bottom > b.top && tb.top < b.bottom && tb.right > b.left && tb.left < b.right).length
          : 0;
        return {
          metaText: meta?.textContent?.trim() ?? null,
          metaWidth: meta ? Math.round(bb(meta).width * 100) / 100 : null,
          twoWidth: tb ? Math.round(tb.width * 100) / 100 : null,
          oneCh: oneCh ? Math.round(oneCh * 100) / 100 : null,
          floor12ch: oneCh ? Math.round(oneCh * 12 * 100) / 100 : null,
          blockHeight: Math.round(bb(block).height * 100) / 100,
          oneLineHeight: parseFloat(getComputedStyle(one).lineHeight),
          oneRowTall: Math.round(bb(block).height) <= Math.ceil(parseFloat(getComputedStyle(one).lineHeight)) + 1,
          insideCtrlBtn: inside,
          clipped: tb ? Math.round((two.scrollWidth - two.clientWidth) * 100) / 100 : null,
        };
      });
      out.rows["L14-tally-" + w] = read;
    } catch (e) {
      out.rows["L14-tally-" + w] = { error: String(e).slice(0, 200) };
    }
    await ctx.close();
  }

  await browser.close();
  bank(`P2-act-${engineName}.json`, out);
  console.log("acts done " + engineName);
}

await run(process.argv[2]);
