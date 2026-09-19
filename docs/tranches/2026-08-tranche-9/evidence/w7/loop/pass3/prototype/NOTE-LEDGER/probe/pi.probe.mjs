/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 5 — π identity and the filter census.
 *
 * Every painted box on the page, prototype vs the `74a2b5d9` control, matched by a stable key
 * (tag + class + document order within that key). The margin strip is the wave's own claim and
 * is reported SEPARATELY, never netted into the identity number. Filters: the budget census the
 * charter pins at 9, plus the broader "any computed filter" count the pass-2 critic used.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const RIGS = [
  { name: "390x844", w: 390, h: 844, dsf: 3, mobile: true },
  { name: "1280x800", w: 1280, h: 800, dsf: 2, mobile: false },
];

const SWEEP = () => {
  const r = (x) => Math.round(x * 100) / 100;
  const seen = new Map();
  const out = [];
  let filters = 0;
  let budget = 0;
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.filter && cs.filter !== "none") {
      filters++;
      if (/url\(/.test(cs.filter)) budget++;
    }
    const b = el.getBoundingClientRect();
    if (b.width < 1 || b.height < 1) continue;
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const cls =
      typeof el.className === "string"
        ? el.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    const base = `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    out.push({
      k: `${base}#${n}`,
      x: r(b.x),
      y: r(b.y),
      w: r(b.width),
      h: r(b.height),
      margin: !!el.closest(".board-margin"),
    });
  }
  return { rects: out, filters, budget, scrollHeight: document.documentElement.scrollHeight };
};

async function ready(page, base) {
  await page.goto(base + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}
async function depth(page, d) {
  if (d >= 1) {
    await page.evaluate(() => {
      const i = [...document.querySelectorAll(".board-cells input")].filter(
        (x) => !x.value && !x.readOnly && !x.disabled,
      );
      i[0]?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(700);
  }
  if (d >= 2) {
    await page.evaluate(() => {
      const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
      g?.focus();
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(g, "7");
      g.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(700);
  }
}

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, control: "74a2b5d9", rigs: {} };
  for (const rig of RIGS) {
    const reads = {};
    for (const [label, base] of [
      ["proto", "http://127.0.0.1:4249/"],
      ["control", "http://127.0.0.1:4246/"],
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: rig.w, height: rig.h },
        deviceScaleFactor: rig.dsf,
        isMobile: rig.mobile && engineName === "chromium",
        hasTouch: rig.mobile,
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
      await ready(page, base);
      const d0 = await page.evaluate(SWEEP);
      await depth(page, 2);
      const d2 = await page.evaluate(SWEEP);
      reads[label] = { d0, d2 };
      await ctx.close();
    }
    // Compare at BOTH depths. Depth 0 is the honest π row (no record armed on either tree);
    // depth 2 is the wave's own pose and the control simply has no line two there.
    const cmp = {};
    for (const d of ["d0", "d2"]) {
      const P = new Map(reads.proto[d].rects.map((r) => [r.k, r]));
      const C = new Map(reads.control[d].rects.map((r) => [r.k, r]));
      let maxOff = 0,
        maxKey = null,
        moved = 0,
        checked = 0;
      const marginKeys = [];
      const offenders = [];
      for (const [k, p] of P) {
        if (p.margin) {
          marginKeys.push(k);
          continue;
        }
        const c = C.get(k);
        if (!c) continue;
        checked++;
        const off = Math.max(
          Math.abs(p.x - c.x),
          Math.abs(p.y - c.y),
          Math.abs(p.w - c.w),
          Math.abs(p.h - c.h),
        );
        if (off > maxOff) {
          maxOff = off;
          maxKey = k;
        }
        if (off > 0.01) {
          moved++;
          if (offenders.length < 8) offenders.push({ k, off, p, c });
        }
      }
      cmp[d] = {
        checkedRects: checked,
        movedRects: moved,
        maxDelta: Math.round(maxOff * 1000) / 1000,
        maxKey,
        offenders,
        marginRectsProto: marginKeys.length,
        marginRectsControl: [...C.keys()].filter((k) => C.get(k).margin).length,
        onlyInProto: [...P.keys()].filter((k) => !C.has(k)),
        onlyInControl: [...C.keys()].filter((k) => !P.has(k)),
        filters: { proto: reads.proto[d].filters, control: reads.control[d].filters },
        budgetUrlFilters: { proto: reads.proto[d].budget, control: reads.control[d].budget },
        scrollHeight: {
          proto: reads.proto[d].scrollHeight,
          control: reads.control[d].scrollHeight,
        },
      };
    }
    out.rigs[rig.name] = cmp;
    console.log(engineName, rig.name, "done");
  }
  await browser.close();
  bank(`P5-pi-${engineName}.json`, out);
}
await run(process.argv[2]);
