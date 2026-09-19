// T9-W7 pass 3 · CTRL-RULE — I3'S SUCCESSOR, RUN.
//
// I3 is MOVED (pass-2 critique §1.1 / the chair's §7): its ≥50% coverage proxy convicts a
// TRUTHFUL margin pin — a pinned name whose own group owns 0.282 of the port at scrollTop 125
// is the instrument naming the field, not an occlusion. Two rows replace it, and neither is a
// proxy:
//
//   ROW A · NO ORPHANED FIELD.  fieldVis >= 0.33  =>  nameVis > 0.
//   ROW B · NO STALE NAME.      an on-screen name's box is inside its own group's box.
//
// Plus the three rows the pin itself owes:
//   · the NAME-OVER-CONTROL predicate, over every sticky/fixed surface INCLUDING
//     ::before/::after (pass 2's `card.querySelectorAll("*")` could not see W2's fold
//     sentinel, which is a pseudo-element with a ground — `pins 0` was a property of the
//     instrument);
//   · the PINNED NAME'S TOP == the resting inset (`--card-pad-t`) ± 0.5px;
//   · the TRAVEL ABLATION — inject `align-items: stretch` and ROW A must go RED, because a
//     stretched grid item has no room and `position: sticky` on it is a silent no-op.
//
// node name-truth.mjs <chromium|webkit> <tag> [BASE] [ablate]
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
const BASE = process.argv[4] || "http://127.0.0.1:4231/";
// THE ABLATION ARMS. `items` is the spec's (`align-items: stretch` on the row) and it is
// VACUOUS — `.rp-name` carries its own `align-self: start`, which outranks the container's
// `align-items`, so the injected rule never reaches the item and ROW A stays green on a pin
// that still works. `self` is the TRUE travel ablation. `static` is arm (b) as built: the pin
// deleted, which is the control the orphan count is against.
const ABLATE = process.argv[5] || "";
const ABLATION = {
  items: ".ruled-group{align-items:stretch!important}",
  self: ".rp-name{align-self:stretch!important}",
  static: ".rp-name{position:static!important}",
}[ABLATE];

const CELLS = [
  { w: 1280, h: 800, touch: false },
  { w: 390, h: 844, touch: true },
  { w: 320, h: 568, touch: true },
];

// ── ROW A + ROW B + the pin's top, at one scroll state ─────────────────────────────────────
const SCAN = ({ top, padT }) => {
  const card = document.querySelector(".controls-card");
  card.scrollTop = top;
  void card.offsetHeight;
  const port = card.getBoundingClientRect();
  const rows = [];
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    if (!name || !field) continue;
    // THE NAME IS ITS INK, NOT ITS BOX. A border box tells you where a name COULD paint; the
    // orphan question is whether a reader can SEE one. The two differ the moment the item is
    // stretched (the `self` ablation): a stretched `<h2>` has a box as tall as its field and
    // ink only at the top of it, so a box-based `nameVis` reports a name on screen that is
    // scrolled away. The text range is the line box the glyphs occupy.
    const rg = document.createRange();
    rg.selectNodeContents(name);
    const inkb = rg.getBoundingClientRect();
    rg.detach?.();
    const bb = name.getBoundingClientRect(); // the BORDER box — what `sticky` positions
    const nb = inkb.height > 0.5 ? inkb : bb; // the INK box — what a reader can see
    const fb = field.getBoundingClientRect();
    const gb = g.getBoundingClientRect();
    const vis = (b) =>
      Math.max(0, Math.min(b.bottom, port.bottom) - Math.max(b.top, port.top)) /
      (b.height || 1);
    const onScreen = vis(nb) > 0;
    // ROW B: the visible part of the name must lie inside its own group's box.
    const vTop = Math.max(nb.top, port.top);
    const vBot = Math.min(nb.bottom, port.bottom);
    const inGroup = !onScreen || (vTop >= gb.top - 0.5 && vBot <= gb.bottom + 0.5);
    // THE PIN'S TOP is read against the scrollport's PADDING BOX, because that is what a
    // sticky offset resolves against — measuring it against the border box was this
    // instrument's own first defect and it reported `pinnedReads 0` on a working pin.
    const held = Math.abs(bb.top - (port.top + padT)) <= 0.75;
    rows.push({
      name: name.textContent.trim(),
      fieldVis: +vis(fb).toFixed(3),
      nameVis: +vis(nb).toFixed(3),
      inGroup,
      held,
      nameTopOffset: +(bb.top - port.top).toFixed(2),
    });
  }
  return {
    scrollTop: card.scrollTop,
    orphans: rows.filter((r) => r.fieldVis >= 0.33 && r.nameVis <= 0).map((r) => r.name),
    stale: rows.filter((r) => !r.inGroup).map((r) => r.name),
    pinnedTops: rows.filter((r) => r.held).map((r) => r.nameTopOffset),
    // every name whose top is NOT its resting flow position and NOT the inset: a pin that
    // landed somewhere else. Reported, never swallowed.
    rows,
  };
};

// ── THE NAME-OVER-CONTROL PREDICATE, pseudo-elements included ───────────────────────────────
const PINS = () => {
  const card = document.querySelector(".controls-card");
  const scene = document.querySelector(".scene-controls") || document.body;
  const inter = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return w * h;
  };
  // live controls: anything a reader can press, inside the case
  const controls = [...scene.querySelectorAll('button, [role="button"], input, select, a[href], [tabindex="0"]')]
    .filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
    })
    .map((e) => ({
      el: e,
      label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 24),
      r: e.getBoundingClientRect(),
    }));

  // EVERY SURFACE IS CLIPPED TO ITS SCROLLPORT before it is intersected with anything. An
  // unclipped `getBoundingClientRect` on a box inside `overflow: auto` reports ink that is
  // not painted: `players`'s name read 0.473 of `Clear the board` at 1280 purely because its
  // box extends 67px past a scrollport that clips it and the bar lives below in `#card-foot`.
  // A predicate about OCCLUSION has to measure what paints.
  const clipTo = card.getBoundingClientRect();
  const surfaces = [];
  const push = (label, r, kind, z) => {
    if (!r) return;
    const c = {
      top: Math.max(r.top, clipTo.top),
      bottom: Math.min(r.bottom, clipTo.bottom),
      left: Math.max(r.left, clipTo.left),
      right: Math.min(r.right, clipTo.right),
    };
    c.width = c.right - c.left;
    c.height = c.bottom - c.top;
    if (c.width > 0.01 && c.height > 0.01)
      surfaces.push({ label, kind, z, r: c, unclipped: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) } });
  };
  for (const el of card.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.position === "sticky" || cs.position === "fixed")
      push(
        (el.className && String(el.className).slice(0, 40)) || el.tagName,
        el.getBoundingClientRect(),
        cs.position,
        cs.zIndex,
      );
    // ::before / ::after — a DOM query can never return these, and W2's fold sentinel is one
    for (const pe of ["::before", "::after"]) {
      const ps = getComputedStyle(el, pe);
      if (ps.position !== "sticky" && ps.position !== "fixed") continue;
      if (ps.content === "none") continue;
      const host = el.getBoundingClientRect();
      const px = (v) => parseFloat(v) || 0;
      // the sentinel's geometry: host box offset by the pseudo's own top/height
      const top = host.top + px(ps.top);
      const h = px(ps.height);
      const r = {
        top,
        bottom: top + h,
        left: host.left,
        right: host.right,
        width: host.width,
        height: h,
      };
      push(
        ((el.className && String(el.className).slice(0, 30)) || el.tagName) + pe,
        r,
        ps.position + "/pseudo",
        ps.zIndex,
      );
    }
  }
  const worst = [];
  for (const s of surfaces) {
    let w = { cov: 0, label: null };
    for (const c of controls) {
      const cov = inter(s.r, c.r) / ((c.r.width * c.r.height) || 1);
      if (cov > w.cov) w = { cov: +cov.toFixed(3), label: c.label };
    }
    worst.push({ surface: s.label, kind: s.kind, z: s.z, worstControl: w.label, cov: w.cov, painted: { w: +s.r.width.toFixed(2), h: +s.r.height.toFixed(2) } });
  }
  return { surfaces: surfaces.length, controls: controls.length, worst };
};

const out = { engine: ENGINE, tag: TAG, base: BASE, ablate: ABLATE || null, ablation: ABLATION || null, cells: {} };
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
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // THE SHEET SLIDES — settle before measuring
  }
  await page.waitForTimeout(300);
  if (ABLATION) await page.addStyleTag({ content: ABLATION });
  await page.waitForTimeout(150);

  const padT = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    return parseFloat(getComputedStyle(c).getPropertyValue("--card-pad-t")) || 0;
  });
  const max = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    return c.scrollHeight - c.clientHeight;
  });
  const states = [];
  for (let t = 0; t <= max; t += Math.max(20, Math.round(max / 12)))
    states.push(await page.evaluate(SCAN, { top: t, padT }));
  states.push(await page.evaluate(SCAN, { top: max, padT }));

  // the predicate at five states, evenly spread
  const pins = [];
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate(
      ({ t }) => {
        document.querySelector(".controls-card").scrollTop = t;
      },
      { t: Math.round(max * f) },
    );
    await page.waitForTimeout(80);
    pins.push({ at: Math.round(max * f), ...(await page.evaluate(PINS)) });
  }

  const withOrphans = states.filter((s) => s.orphans.length);
  const withStale = states.filter((s) => s.stale.length);
  const tops = states.flatMap((s) => s.pinnedTops);
  out.cells[`${cell.w}x${cell.h}`] = {
    padT,
    maxScroll: max,
    cardClientHeight: await page.evaluate(
      () => document.querySelector(".controls-card").clientHeight,
    ),
    cardScrollHeight: await page.evaluate(
      () => document.querySelector(".controls-card").scrollHeight,
    ),
    states: states.length,
    ROW_A_orphanStates: withOrphans.length,
    ROW_A_sample: withOrphans.slice(0, 4).map((s) => ({ t: s.scrollTop, o: s.orphans })),
    ROW_B_staleStates: withStale.length,
    ROW_B_sample: withStale.slice(0, 4).map((s) => ({ t: s.scrollTop, o: s.stale })),
    pinnedReads: tops.length,
    pinnedTopWorstDelta: tops.length
      ? +Math.max(...tops.map((t) => Math.abs(t - padT))).toFixed(3)
      : null,
    predicate: pins.map((p) => ({
      at: p.at,
      surfaces: p.surfaces,
      controls: p.controls,
      worstCov: p.worst.length ? Math.max(...p.worst.map((w) => w.cov)) : 0,
      rows: p.worst,
    })),
  };
  console.log(
    ENGINE,
    TAG,
    `${cell.w}x${cell.h}`,
    "ROW A orphan states",
    withOrphans.length,
    "/",
    states.length,
    "| ROW B stale",
    withStale.length,
    "| worst pin-top Δ",
    out.cells[`${cell.w}x${cell.h}`].pinnedTopWorstDelta,
    "| worst name∩control",
    Math.max(...out.cells[`${cell.w}x${cell.h}`].predicate.map((p) => p.worstCov)),
  );
  await ctx.close();
}
await browser.close();
writeFileSync(
  join(OUT, `name-truth-${TAG}-${ENGINE}${ABLATE ? "-ablate-" + ABLATE : ""}.json`),
  JSON.stringify(out, null, 2),
);
console.log("EXIT OK");
