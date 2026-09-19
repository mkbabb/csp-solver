// T9-W7 pass 3 · CTRL-RULE — THE CRITIC'S OWN READ. Not the lane's instrument re-run: the
// numbers are re-derived, and three of the lane's are re-derived WITHOUT the filter the lane
// applied to them.
//
//  1 · THE PIN'S TOP, UNFILTERED. The lane reports "worst |Δ| 0.000 over every held read",
//      where `held` is itself |top − inset| ≤ 0.75. The population is the predicate. Here every
//      name's offset is reported at every state and the spread is the number.
//  2 · THE FIRST-BASELINE RELATION. `RuledGroup`'s prose names `align-items: first baseline`
//      as one of four things separating the page from a settings form. `align-self: start` on
//      the item outranks it. Measured: the name's own baseline against the first chip's.
//  3 · NAME ∩ CONTROL, clipped (the lane's third instrument defect, kept — it is right).
//  4 · THE FILTER CENSUS on the live card (`filterBudget` 9).
//  5 · R1 ROW 3, the name/chip rank, at every cell.
//
// node critic-scan.mjs <chromium|webkit> <tag> <BASE>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });

const ENGINE = process.argv[2] || "chromium";
const TAG = process.argv[3] || "proto";
const BASE = process.argv[4] || "http://127.0.0.1:4233/";

const CELLS = [
  { w: 1280, h: 800, touch: false },
  { w: 900, h: 500, touch: false },
  { w: 390, h: 844, touch: true },
  { w: 320, h: 568, touch: true },
];

const SCAN = ({ top }) => {
  const card = document.querySelector(".controls-card");
  if (!card) return { missing: true };
  card.scrollTop = top;
  void card.offsetHeight;
  const port = card.getBoundingClientRect();
  const padT = parseFloat(getComputedStyle(card).paddingTop) || 0;
  const rows = [];
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    if (!name || !field) continue;
    const rg = document.createRange();
    rg.selectNodeContents(name);
    const ink = rg.getBoundingClientRect();
    const bb = name.getBoundingClientRect();
    const fb = field.getBoundingClientRect();
    const gb = g.getBoundingClientRect();
    const nb = ink.height > 0.5 ? ink : bb;
    const vis = (b) =>
      Math.max(0, Math.min(b.bottom, port.bottom) - Math.max(b.top, port.top)) / (b.height || 1);
    rows.push({
      name: name.textContent.trim(),
      offset: +(bb.top - port.top).toFixed(2), // against the BORDER box
      insetOffset: +padT.toFixed(2), // what a `top:0` sticky should hold at
      fieldVis: +vis(fb).toFixed(3),
      nameVis: +vis(nb).toFixed(3),
      groupTopOffset: +(gb.top - port.top).toFixed(2),
      inGroup:
        vis(nb) <= 0 ||
        (Math.max(nb.top, port.top) >= gb.top - 0.5 &&
          Math.min(nb.bottom, port.bottom) <= gb.bottom + 0.5),
    });
  }
  return { scrollTop: card.scrollTop, padT: +padT.toFixed(2), rows };
};

// THE BASELINE RELATION — the name's last text-line baseline against the field's FIRST
// focusable face's baseline. Measured by a zero-width probe span appended to each, because a
// baseline is not a rect: a text range's bottom is a line box's bottom, which differs from the
// baseline by the font's descent and differs BETWEEN the two faces (Fraunces 800 vs the chip).
const BASELINES = () => {
  const card = document.querySelector(".controls-card");
  const out = [];
  const probe = (el) => {
    const s = document.createElement("span");
    s.textContent = "x";
    s.style.cssText =
      "display:inline-block;width:0;overflow:hidden;font-size:inherit;line-height:inherit;vertical-align:baseline;";
    el.appendChild(s);
    const r = s.getBoundingClientRect();
    const b = r.bottom; // an inline-block's baseline is its margin-box bottom when empty…
    s.remove();
    return b;
  };
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    if (!name || !field) continue;
    // the field's first chip that carries a word
    const chip = [...field.querySelectorAll("button,[role='button'],label,span")].find((e) => {
      const r = e.getBoundingClientRect();
      return r.height > 4 && (e.textContent || "").trim().length > 0;
    });
    if (!chip) continue;
    const nb = probe(name);
    const cb = probe(chip);
    out.push({
      name: name.textContent.trim(),
      nameBaseline: +nb.toFixed(2),
      chip: (chip.textContent || "").trim().slice(0, 14),
      chipBaseline: +cb.toFixed(2),
      delta: +(nb - cb).toFixed(2),
      nameFont: getComputedStyle(name).fontSize,
      chipFont: getComputedStyle(chip).fontSize,
    });
  }
  return out;
};

// NAME ∩ CONTROL, every sticky/fixed surface incl. pseudo-elements, clipped to the scrollport.
const PINS = () => {
  const card = document.querySelector(".controls-card");
  const scene = document.querySelector(".scene-controls") || document.body;
  const inter = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return w * h;
  };
  const controls = [
    ...scene.querySelectorAll("button,[role='button'],input,select,a[href],[tabindex='0']"),
  ]
    .map((e) => ({ label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 20), r: e.getBoundingClientRect() }))
    .filter((c) => c.r.width > 0 && c.r.height > 0);
  const clip = card.getBoundingClientRect();
  const surfaces = [];
  const push = (label, r, kind, z) => {
    const c = {
      top: Math.max(r.top, clip.top),
      bottom: Math.min(r.bottom, clip.bottom),
      left: Math.max(r.left, clip.left),
      right: Math.min(r.right, clip.right),
    };
    if (c.right - c.left > 0.01 && c.bottom - c.top > 0.01)
      surfaces.push({ label, kind, z, r: c });
  };
  for (const el of card.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.position === "sticky" || cs.position === "fixed")
      push(String(el.className || el.tagName).slice(0, 34), el.getBoundingClientRect(), cs.position, cs.zIndex);
    for (const pe of ["::before", "::after"]) {
      const ps = getComputedStyle(el, pe);
      if ((ps.position !== "sticky" && ps.position !== "fixed") || ps.content === "none") continue;
      const host = el.getBoundingClientRect();
      const top = host.top + (parseFloat(ps.top) || 0);
      const h = parseFloat(ps.height) || 0;
      push(String(el.className || el.tagName).slice(0, 28) + pe, { top, bottom: top + h, left: host.left, right: host.right }, ps.position + "/pseudo", ps.zIndex);
    }
  }
  let worst = { cov: 0, surface: null, control: null };
  for (const s of surfaces)
    for (const c of controls) {
      const cov = inter(s.r, c.r) / (c.r.width * c.r.height || 1);
      if (cov > worst.cov) worst = { cov: +cov.toFixed(3), surface: s.label, control: c.label };
    }
  return { surfaces: surfaces.length, controls: controls.length, worst };
};

const FILTERS = () => {
  const ids = new Set();
  const used = new Set();
  for (const f of document.querySelectorAll("filter[id]")) ids.add(f.id);
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    for (const v of [cs.filter, cs.backdropFilter])
      if (v && v !== "none") {
        const m = /url\(["']?#([^"')]+)/.exec(v);
        if (m) used.add(m[1]);
        else used.add(v.slice(0, 24));
      }
    const a = el.getAttribute && el.getAttribute("filter");
    if (a) {
      const m = /#([^"')]+)/.exec(a);
      if (m) used.add(m[1]);
    }
  }
  return { definedFilters: ids.size, usedRefs: [...used].sort() };
};

const out = { engine: ENGINE, tag: TAG, base: BASE, cells: {} };
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
for (const cell of CELLS) {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.touch,
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
  await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(350);

  const max = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    return c ? c.scrollHeight - c.clientHeight : 0;
  });
  const states = [];
  const step = Math.max(20, Math.round(max / 10) || 20);
  for (let t = 0; t <= max; t += step) states.push(await page.evaluate(SCAN, { top: t }));
  if (max > 0) states.push(await page.evaluate(SCAN, { top: max }));

  const pins = [];
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((t) => {
      const c = document.querySelector(".controls-card");
      if (c) c.scrollTop = t;
    }, Math.round(max * f));
    await page.waitForTimeout(90);
    pins.push({ at: Math.round(max * f), ...(await page.evaluate(PINS)) });
  }
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = 0;
  });
  await page.waitForTimeout(120);

  const allRows = states.flatMap((s) => s.rows || []);
  // THE PIN, UNFILTERED: every name that is on screen and NOT at its group's own top is a
  // pinned read. Its offset is reported whatever it is.
  const pinnedReads = allRows.filter(
    (r) => r.nameVis > 0 && Math.abs(r.offset - r.groupTopOffset) > 0.5,
  );
  out.cells[`${cell.w}x${cell.h}`] = {
    maxScroll: max,
    states: states.length,
    padT: states[0] && states[0].padT,
    groups: (states[0] && states[0].rows.length) || 0,
    cardClientHeight: await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      return c ? c.clientHeight : null;
    }),
    cardScrollHeight: await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      return c ? c.scrollHeight : null;
    }),
    ROW_A_orphanStates: states.filter((s) =>
      (s.rows || []).some((r) => r.fieldVis >= 0.33 && r.nameVis <= 0),
    ).length,
    ROW_B_staleStates: states.filter((s) => (s.rows || []).some((r) => !r.inGroup)).length,
    pinnedReads: pinnedReads.length,
    pinnedOffsets: [...new Set(pinnedReads.map((r) => r.offset))].sort((a, b) => a - b),
    pinnedWorstDeltaVsInset: pinnedReads.length
      ? +Math.max(...pinnedReads.map((r) => Math.abs(r.offset - r.insetOffset))).toFixed(3)
      : null,
    baselines: await page.evaluate(BASELINES),
    predicateWorst: Math.max(...pins.map((p) => p.worst.cov)),
    predicate: pins,
    filters: await page.evaluate(FILTERS),
  };
  const c = out.cells[`${cell.w}x${cell.h}`];
  console.log(
    ENGINE,
    TAG,
    `${cell.w}x${cell.h}`,
    "groups", c.groups,
    "| ROW A", c.ROW_A_orphanStates, "/", c.states,
    "| ROW B", c.ROW_B_staleStates,
    "| pinnedReads", c.pinnedReads,
    "| offsets", JSON.stringify(c.pinnedOffsets.slice(0, 6)),
    "| Δ vs inset", c.pinnedWorstDeltaVsInset,
    "| name∩ctrl", c.predicateWorst,
    "| filters", c.filters.usedRefs.length,
    "| baselineΔ", JSON.stringify(c.baselines.map((b) => b.delta)),
  );
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, `critic-scan-${TAG}-${ENGINE}.json`), JSON.stringify(out, null, 2));
console.log("EXIT OK");
