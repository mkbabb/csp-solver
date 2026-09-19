// T9-W7 pass 3 · RESEARCH · CTRL-RULE — I3's LAW, TRANSPLANTED ONTO THE MARGIN.
//
// r7's instrument I3 (`r0/r7-owners-eye/instruments/owners-eye.instruments.mjs:119`) reads:
// "a pinned compartment tape names a group at least half on screen, at every scroll state."
// It is **RED at HEAD** — 3 violating states at 1440×900 webkit, `new game` at 0.401 / 0.058 /
// 0.050 (`readings-at-head.json`, `r7-owners-eye.md` §M03 b′), because HEAD's tape pins and
// never releases: at four of five states the groups under the eye carry no pinned title at all.
// W2's own prove record defers the cure to this wave: "§2.6 asserts a tag stays while its group
// is in view; it does not assert a tag LEAVES when its group does. Not a row — a question for
// W7's voice" (`evidence/w2/prove/prove-record.md:47-49`).
//
// A sticky grid item is constrained by its GRID AREA, so a name pinned in the margin RELEASES
// at its own group's bottom by construction. This probe asserts I3's own predicate against the
// margin arms, and adds the two rows the transplant needs:
//   · does a pinned name ever cover a CONTROL (the class invariant)
//   · does a pinned name ever cover another group's RULE (the legibility question, since the
//     name rides z 31 over the fold sentinel's z 30 band)
//
// READ-ONLY on product files; every arm is a `page.addStyleTag`.
//
//   node pinned-name-i3.mjs   [BASE=http://127.0.0.1:4231/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const ARMS = {
  base: "",
  stickyTop0: ".rp-name{position:sticky;top:0;z-index:31}",
  stickyBand: ".rp-name{position:sticky;top:2rem;z-index:31}",
};

// I3's own cell (1440×900 webkit) plus the cell the orphan census lives at.
const CELLS = [
  { name: "1440x900", w: 1440, h: 900, touch: false },
  { name: "1280x800", w: 1280, h: 800, touch: false },
];

const I3 = async (states) => {
  const sc = document.querySelector(".controls-card");
  const out = [];
  for (const st of states) {
    sc.scrollTop = st;
    await new Promise((r) => setTimeout(r, 260)); // I3's own settle
    const scb = sc.getBoundingClientRect();
    const frac = (a, b) => {
      const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return b.width && b.height ? (w * h) / (b.width * b.height) : 0;
    };
    const ctls = [
      ...sc.querySelectorAll('button, [tabindex="0"], input, select, a[href]'),
    ].filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    });
    const rules = [...sc.querySelectorAll(".rp-rule")];
    const pinned = [];
    let ctlWorst = 0;
    let ctlWho = null;
    let ruleWorst = 0;
    for (const g of sc.querySelectorAll("[data-ruled-group]")) {
      const nameEl = g.querySelector(".rp-name");
      if (!nameEl) continue;
      const nb = nameEl.getBoundingClientRect();
      if (nb.bottom < scb.top || nb.top > scb.bottom) continue; // not on screen at all
      const gb = g.getBoundingClientRect();
      const own =
        Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top)) /
        Math.max(1, gb.height);
      // "pinned" by I3's own test: the name's top sits within 30px of the port's top edge
      if (nb.top <= scb.top + 30)
        pinned.push({ name: nameEl.textContent.trim(), own: +own.toFixed(3) });
      for (const c of ctls) {
        const f = frac(nb, c.getBoundingClientRect());
        if (f > ctlWorst) {
          ctlWorst = f;
          ctlWho = `${nameEl.textContent.trim()} over ${(c.textContent || "").trim().slice(0, 16)}`;
        }
      }
      for (const r of rules) {
        if (g.contains(r)) continue; // its own rule sits in row 2, never under the name
        const f = frac(nb, r.getBoundingClientRect());
        if (f > ruleWorst) ruleWorst = f;
      }
    }
    out.push({
      at: sc.scrollTop,
      pinned,
      violating: pinned.filter((p) => p.own < 0.5),
      ctlWorst: +ctlWorst.toFixed(3),
      ctlWho,
      ruleWorst: +ruleWorst.toFixed(3),
    });
  }
  return out;
};

const res = { base: BASE, generated: new Date().toISOString(), cells: {} };
for (const engine of ["webkit", "chromium"]) {
  for (const cell of CELLS) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    for (const [arm, css] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        colorScheme: "light",
      });
      await ctx.addInitScript(() => {
        try {
          localStorage.clear();
          localStorage.setItem("sudoku-color-scheme", "light");
        } catch {}
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(1200);
      if (css) await page.addStyleTag({ content: css });
      await page.waitForTimeout(250);
      const max = await page.evaluate(() => {
        const c = document.querySelector(".controls-card");
        return c.scrollHeight - c.clientHeight;
      });
      const states = [0, Math.round(max * 0.32), Math.round(max * 0.65), max, max];
      const rows = await page.evaluate(I3, states);
      const key = `${engine}/${cell.name}/${arm}`;
      const violating = rows.flatMap((r) =>
        r.violating.map((v) => ({ at: r.at, tag: v.name, frac: v.own })),
      );
      res.cells[key] = {
        maxScroll: max,
        states: rows.length,
        i3Violations: violating.length,
        violating,
        statesWithNoPinnedName: rows.filter((r) => r.pinned.length === 0).length,
        ctlWorst: Math.max(...rows.map((r) => r.ctlWorst)),
        ctlWho: rows.find((r) => r.ctlWorst === Math.max(...rows.map((x) => x.ctlWorst)))?.ctlWho,
        ruleWorst: Math.max(...rows.map((r) => r.ruleWorst)),
        rows,
      };
      console.log(
        key,
        "| I3 violations",
        violating.length,
        "| states with NO pinned name",
        res.cells[key].statesWithNoPinnedName + "/" + rows.length,
        "| name-over-control",
        res.cells[key].ctlWorst,
        "| name-over-rule",
        res.cells[key].ruleWorst,
      );
      await ctx.close();
    }
    await browser.close();
  }
}
writeFileSync(join(OUT, "pinned-name-i3.json"), JSON.stringify(res, null, 2));
console.log("EXIT OK");
