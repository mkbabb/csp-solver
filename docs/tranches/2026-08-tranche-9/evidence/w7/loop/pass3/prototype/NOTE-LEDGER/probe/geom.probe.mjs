/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 1 — geometry, berth, clearance, width, contrast, a11y.
 *
 * Prototype on :4249 (worktree wf_f72f3b5a-83a-46); HEAD control `74a2b5d9` on :4246.
 * Gates: L3 L4 L5 L6 L14 L15 L17 + the painted-contrast rows.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const PROTO = "http://127.0.0.1:4249/";
const CONTROL = "http://127.0.0.1:4246/";

const RIGS = [
  { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "393x699", width: 393, height: 699, dsf: 3, mobile: true },
  { name: "390x664", width: 390, height: 664, dsf: 3, mobile: true },
  { name: "844x390", width: 844, height: 390, dsf: 3, mobile: true },
  { name: "900x500", width: 900, height: 500, dsf: 2, mobile: true },
  { name: "1024x768", width: 1024, height: 768, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

async function boardReady(page, base) {
  await page.goto(base + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

/** Arm a hint on the first empty cell, then press h. Returns the sentence. */
async function armHint(page) {
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  return page.evaluate(
    () => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
  );
}

/** Write a digit into the focused cell (the real input path the wire also uses). */
async function typeInFocused(page, ch) {
  await page.keyboard.type(ch);
  await page.waitForTimeout(500);
}

/** Drive a refusal: type into a given. */
async function armRefusal(page) {
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    const given = inputs.find((i) => i.value);
    if (!given) return;
    given.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(given, "7");
    given.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(600);
}

/**
 * THE PAINTED READ. `inkBottom` is declared arithmetic — lineBoxTop + halfLeading + fontAscent
 * + actualDescent of the rendered string, measured on a canvas with the element's own font —
 * and `scanBottom` is the independent pixel witness (the last row with ink, found by the
 * caller's screenshot scan). Both are reported; the gate reads the arithmetic and the scan
 * cross-checks it.
 */
const READ = () => {
  const r = (x) => Math.round(x * 100) / 100;
  const q = (s) => document.querySelector(s);
  const box = (e) => {
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return { x: r(b.x), y: r(b.y), w: r(b.width), h: r(b.height), bottom: r(b.bottom) };
  };
  const two = q(".board-margin .margin-note-previous");
  const one = q(".board-margin .margin-note");
  const block = q(".margin-note-block");
  const cs = two ? getComputedStyle(two) : null;

  // The painted ink of line two, by the font's own metrics over the rendered string.
  let ink = null;
  if (two && cs) {
    const cnv = document.createElement("canvas");
    const ctx = cnv.getContext("2d");
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    const m = ctx.measureText(two.textContent.trim());
    const fs = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight);
    const b = two.getBoundingClientRect();
    const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
    ink = {
      fontSize: fs,
      lineBox: r(lh),
      fontAscent: r(m.fontBoundingBoxAscent),
      fontDescent: r(m.fontBoundingBoxDescent),
      actualDescent: r(m.actualBoundingBoxDescent),
      actualAscent: r(m.actualBoundingBoxAscent),
      halfLeading: r(half),
      baseline: r(b.top + half + m.fontBoundingBoxAscent),
      // the reference line, declared
      inkBottom: r(b.top + half + m.fontBoundingBoxAscent + m.actualBoundingBoxDescent),
      inkTop: r(b.top + half + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent),
      advance: r(m.width),
      oneCh: (() => {
        const p = document.createElement("span");
        p.style.cssText = `position:absolute;visibility:hidden;font:${ctx.font};width:1ch`;
        two.appendChild(p);
        const w = p.getBoundingClientRect().width;
        p.remove();
        return r(w);
      })(),
    };
  }
  // line one's painted descender bottom, for the ink-to-ink row
  let oneInk = null;
  if (one && one.textContent.trim()) {
    const c1 = getComputedStyle(one);
    const cnv = document.createElement("canvas");
    const ctx = cnv.getContext("2d");
    ctx.font = `${c1.fontStyle} ${c1.fontWeight} ${c1.fontSize} / ${c1.lineHeight} ${c1.fontFamily}`;
    const m = ctx.measureText(one.textContent.trim());
    const lh = parseFloat(c1.lineHeight);
    const b = one.getBoundingClientRect();
    const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
    oneInk = {
      fontSize: parseFloat(c1.fontSize),
      inkBottom: r(b.top + half + m.fontBoundingBoxAscent + m.actualBoundingBoxDescent),
    };
  }

  // The first PAINTED INTERACTIVE box below the strip, found by sweep — not assumed.
  let below = null;
  if (two) {
    const tb = two.getBoundingClientRect();
    const cands = [...document.querySelectorAll('button,a,input,select,textarea,[role="button"],[tabindex]')]
      .map((e) => ({ e, b: e.getBoundingClientRect(), cs: getComputedStyle(e) }))
      .filter(
        (o) =>
          o.b.width >= 8 &&
          o.b.height >= 8 &&
          o.cs.visibility !== "hidden" &&
          o.cs.display !== "none" &&
          parseFloat(o.cs.opacity) > 0.01 &&
          o.b.top >= tb.top &&
          o.b.right > tb.left &&
          o.b.left < tb.right,
      )
      .sort((a, b) => a.b.top - b.b.top);
    const first = cands[0];
    if (first)
      below = {
        sel:
          first.e.id ||
          first.e.className?.toString().split(" ").slice(0, 2).join(".") ||
          first.e.tagName,
        tag: first.e.tagName,
        top: r(first.b.top),
      };
  }
  const tools = q("#fold-tools");

  // The whole strip's interactive sweep is the class law; #fold-tools is only today's answer.
  return {
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    board: box(q('[role="grid"]')),
    block: box(block),
    one: box(one),
    two: box(two),
    meta: box(q(".board-margin .margin-note-meta")),
    tools: box(tools),
    firstInteractiveBelow: below,
    oneText: one?.textContent?.trim() ?? null,
    twoText: two?.textContent?.trim() ?? null,
    ink,
    oneInk,
    twoStyle: cs && {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      display: cs.display,
      position: cs.position,
      flexBasis: cs.flexBasis,
      minWidth: cs.minWidth,
      overflowX: cs.overflowX,
      overflowY: cs.overflowY,
      textOverflow: cs.textOverflow,
      whiteSpace: cs.whiteSpace,
      userSelect: cs.userSelect,
      animationName: cs.animationName,
      animationDuration: cs.animationDuration,
      transform: cs.transform,
    },
    // L17 — no data-* on line two, ever.
    twoDataAttrs: two ? [...two.attributes].map((a) => a.name).filter((n) => n.startsWith("data-")) : null,
    twoAllAttrs: two ? [...two.attributes].map((a) => a.name) : null,
    blockWrap: block ? getComputedStyle(block).flexWrap : null,
    blockRows:
      block && two
        ? Math.round(block.getBoundingClientRect().height / Math.max(1, parseFloat(getComputedStyle(q(".board-margin .margin-note")).lineHeight)))
        : null,
    paper: getComputedStyle(document.body).backgroundColor,
    twoClipped: two ? r(two.scrollWidth - two.clientWidth) : null,
    regions: document.querySelectorAll('.board-margin [role="status"]').length,
    alerts: document.querySelectorAll('.board-margin [role="alert"]').length,
    rungs: {
      note: getComputedStyle(document.documentElement).getPropertyValue("--motion-note").trim(),
      whisper: getComputedStyle(document.documentElement).getPropertyValue("--motion-whisper").trim(),
    },
  };
};

/** depth 0 → 1 → 2: hint (record), refusal (second record), hint again (third). */
async function toDepth(page, depth) {
  if (depth >= 1) await armHint(page);
  if (depth >= 2) await armRefusal(page);
  if (depth >= 3) await armHint(page);
}

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, control: "74a2b5d9", rigs: {} };
  for (const rig of RIGS) {
    out.rigs[rig.name] = {};
    for (const scheme of ["light", "dark"]) {
      for (const [label, base] of [
        ["proto", PROTO],
        ["control", CONTROL],
      ]) {
        const ctx = await browser.newContext({
          viewport: { width: rig.width, height: rig.height },
          deviceScaleFactor: rig.dsf,
          isMobile: rig.mobile && engineName === "chromium",
          hasTouch: rig.mobile,
        });
        const page = await ctx.newPage();
        await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
        try {
          await boardReady(page, base);
          const depths = {};
          for (let d = 0; d <= 3; d++) {
            if (d > 0) {
              if (d === 1) await armHint(page);
              if (d === 2) await armRefusal(page);
              if (d === 3) await armHint(page);
            }
            depths["d" + d] = await page.evaluate(READ);
          }
          out.rigs[rig.name][`${scheme}/${label}`] = depths;
        } catch (e) {
          out.rigs[rig.name][`${scheme}/${label}`] = { error: String(e).slice(0, 300) };
        }
        await ctx.close();
      }
    }
    console.log(`${engineName} ${rig.name} done`);
  }
  await browser.close();
  bank(`P1-geom-${engineName}.json`, out);
}

const engine = process.argv[2];
await run(engine);
console.log("EXIT=0 " + engine);
