import { test, expect, type Page } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FILL_ALLOWLIST,
  FILTER_BUDGET,
  FILTER_BUDGET_AREA_TOLERANCE,
  FILTER_BUDGET_CEILING,
  FILTER_BUDGET_TOTAL,
  FILTER_BUDGET_UNION_AREA,
  PER_CELL_SCOPE,
} from "../src/pencil/config/filterBudget";

/**
 * P1 G3.1 / G3.2 — THE LIVE-FILTER CENSUS, against the BUILT dist.
 *
 * The enforcing half of `src/pencil/config/filterBudget.ts`. Two censuses:
 *
 *  G3.1 — every RENDERED element carrying a non-`none` computed `filter` must match exactly one
 *         budget row, and each row's population must equal its declared count. Exact match in
 *         both directions: a new filter surface reds even when an old one retires. Born RED on
 *         the base build at 98 (dealt) / 118 (solved) against a budget of 14.
 *
 *  G3.2 — no animation whose RETAINED fill supplies a computed transform (the `cell-reveal`
 *         mechanism: `scale(1)` computes to a matrix, not to `none`, so 35–81 cells carried an
 *         effect-sourced transform indefinitely — r3 §3.1, the best "iOS especially" mechanism
 *         source can point at). Plus the SOURCE census: the set of `forwards`/`both` fill sites
 *         in `src/` must equal `FILL_ALLOWLIST` exactly.
 *
 * THE COUNTING RULE, stated once because the number depends on it: an element counts when its
 * OWN computed `filter` is not `none` and its OWN computed `display` is not `none`.
 *
 *  · Opacity-0 and visibility-hidden surfaces DO count — a pose sibling at opacity 0 rasters,
 *    which is the entire mechanism this budget exists to bound.
 *  · A surface that turned its own filter off structurally does NOT — HandDrawnGrid's four
 *    live-fallback poses go `display: none` the moment the bitmaps land, and if a bake ever
 *    fails they come back and red this gate, which is the behaviour you want.
 *  · Ancestor display is deliberately NOT consulted — a hidden ancestor does not stop a
 *    descendant filter from rastering. That used to make the census viewport-stable by
 *    accident: both control-panel twins were always mounted, so the unpainted one's filters
 *    counted at every width. Since the P1-W4 panel-twin `v-if` only the regime's own card is
 *    in the DOM, and `filterBudget.ts` states the ROW-regime population — the regime this
 *    config runs at (1280×800), and the same size population as the mobile one.
 *
 * `Element.checkVisibility()` was tried first and is NOT usable here: it returns `true` for a
 * `display: none` SVG `<g>` in Chromium 141, which would have quietly counted the retired grid
 * fallback as live.
 *
 * WHAT THE COUNTING RULE COSTS, named so the two instruments can be read against each other:
 * the perf-rig device probe censuses the same scene WITHOUT the display clause, and therefore
 * counts HandDrawnGrid's four `.baked-hidden` fallback poses as well — 9 here, 13 there, the
 * delta being exactly those four and nothing else (measured in both engines, both regimes,
 * both themes; T4-P1 pass 4).
 *
 * THE ORDERED CENSUS IS THREE THINGS, and all three are here (pass-2 registry §4): the
 * population count, its union RASTER AREA, and an INJECTED-NODE control that must fire. The
 * area is the half a count cannot give — one surface growing tenfold is the same count and a
 * tenfold bill — and the control is what stops the whole gate from passing vacuously if the
 * census ever stops seeing the document. Both regimes run: ≥1024 in `G3.1`, and the mobile arm
 * in `G3.3`, which is the width this campaign is about.
 */

const SCENE = "./?size=3&difficulty=EASY";

interface CensusHit {
  /** Index into FILTER_BUDGET, or -1 for an element no row claims. */
  row: number;
  /** A short DOM path, for a legible failure. */
  path: string;
  filter: string;
  html: boolean;
}

async function settleBoard(page: Page) {
  await page.goto(SCENE);
  await page.waitForSelector(".sudoku-cell", { timeout: 20000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  // The grid's baked pose stack must have landed before the census: while UNBAKED the four
  // live-fallback `<g filter>` poses are rendered (pinned to pose 0), and counting them would
  // read a cold-load transient as a budget breach. Once baked they are `display: none`.
  await expect
    .poll(
      () => page.locator("svg.hand-drawn-grid g.boil-frame-layer.baked-hidden").count(),
      {
        timeout: 20000,
      },
    )
    .toBeGreaterThan(0);
  // SETTLED, not slept: the reveal wave is a real running animation and a running animation
  // legitimately supplies a transform, so the fill census must not read one mid-flight.
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            document.getAnimations().filter((a) => a.playState === "running").length,
        ),
      {
        timeout: 20000,
      },
    )
    .toBe(0);
  // One settled beat window past the bake, so no pose swap is mid-flight either.
  await page.waitForTimeout(600);
}

async function census(page: Page, selectors: readonly string[]): Promise<CensusHit[]> {
  return page.evaluate((sels: readonly string[]) => {
    const shortPath = (el: Element) => {
      const parts: string[] = [];
      let n: Element | null = el;
      for (let d = 0; d < 3 && n; d++) {
        const raw =
          typeof n.className === "string"
            ? n.className
            : ((n as unknown as { className?: { baseVal?: string } }).className
                ?.baseVal ?? "");
        const cls = raw.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
        parts.unshift(
          cls ? `${n.tagName.toLowerCase()}.${cls}` : n.tagName.toLowerCase(),
        );
        n = n.parentElement;
      }
      return parts.join(" > ");
    };
    const out: CensusHit[] = [];
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      const f = cs.filter;
      if (!f || f === "none") continue;
      // The counting rule (see the header): own display, never the ancestor chain.
      if (cs.display === "none") continue;
      out.push({
        row: sels.findIndex((s) => el.matches(s)),
        path: shortPath(el),
        filter: f,
        html: !(el instanceof SVGElement),
      });
    }
    return out;
  }, selectors) as Promise<CensusHit[]>;
}

/**
 * The union raster area of the counted population, CSS px², by scanline over the same counting
 * rule. Overlapping boxes are counted ONCE — the four divider poses stack on one another and a
 * rasteriser pays for that region once, so a sum would price a pose stack four times over (the
 * exact overstatement the pass-3 rig shipped).
 */
async function unionArea(page: Page): Promise<number> {
  return page.evaluate(() => {
    const rects: DOMRect[] = [];
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      if (!cs.filter || cs.filter === "none" || cs.display === "none") continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push(r);
    }
    const xs = new Set<number>();
    for (const r of rects) {
      xs.add(Math.floor(r.left));
      xs.add(Math.ceil(r.right));
    }
    const cuts = [...xs].sort((a, b) => a - b);
    let area = 0;
    for (let i = 0; i + 1 < cuts.length; i++) {
      const [x0, x1] = [cuts[i], cuts[i + 1]];
      const spans = rects
        .filter((r) => r.left < x1 && r.right > x0)
        .map((r) => [r.top, r.bottom] as [number, number])
        .sort((a, b) => a[0] - b[0]);
      let covered = 0;
      let cur: [number, number] | null = null;
      for (const [t, b] of spans) {
        if (!cur) cur = [t, b];
        else if (t <= cur[1]) cur[1] = Math.max(cur[1], b);
        else {
          covered += cur[1] - cur[0];
          cur = [t, b];
        }
      }
      if (cur) covered += cur[1] - cur[0];
      area += covered * (x1 - x0);
    }
    return Math.round(area);
  });
}

/** The whole census, run against one settled regime. Shared by G3.1 (row) and G3.3 (coarse). */
async function assertCensus(page: Page, regime: "row" | "coarse") {
  const selectors = FILTER_BUDGET.map((r) => r.selector);
  const hits = await census(page, selectors);

  // (a) nothing unclaimed — the exact-match half a ceiling cannot give.
  expect(
    hits.filter((h) => h.row < 0).map((h) => `${h.path}  ⟨${h.filter}⟩`),
    `[${regime}] live filters no filterBudget.ts row claims`,
  ).toEqual([]);

  // (b) every row's population is exact, in both directions.
  expect(
    FILTER_BUDGET.map((r, i) => ({
      selector: r.selector,
      count: hits.filter((h) => h.row === i).length,
    })),
    `[${regime}] per-row population`,
  ).toEqual(FILTER_BUDGET.map((r) => ({ selector: r.selector, count: r.count })));

  // (c) the charter's own numbers: perCell 0, htmlBoxes 0, total ≤ 14.
  const perCell = await page.evaluate(
    (scope) =>
      Array.from(document.querySelectorAll(`${scope} *`)).filter(
        (el) => getComputedStyle(el).filter !== "none",
      ).length,
    PER_CELL_SCOPE,
  );
  expect(perCell, `[${regime}] live filters inside ${PER_CELL_SCOPE}`).toBe(0);
  expect(
    hits.filter((h) => h.html).map((h) => h.path),
    `[${regime}] reference filters on HTML boxes (WebKit software filter path)`,
  ).toEqual([]);
  expect(hits.length, `[${regime}] total`).toBe(FILTER_BUDGET_TOTAL);
  expect(hits.length).toBeLessThanOrEqual(FILTER_BUDGET_CEILING);

  // (d) the union RASTER AREA — the half the count cannot see.
  const area = await unionArea(page);
  const budget = FILTER_BUDGET_UNION_AREA[regime];
  const slack = Math.ceil(budget * FILTER_BUDGET_AREA_TOLERANCE);
  expect(
    Math.abs(area - budget),
    `[${regime}] union raster area ${area} vs budget ${budget} ±${slack} CSS px²`,
  ).toBeLessThanOrEqual(slack);

  // (e) THE INJECTED-NODE CONTROL. A census that has stopped seeing the document passes every
  // assertion above; this is the one row that reds when the instrument dies. A filtered box is
  // inserted, the census must catch it as unclaimed AND the area must grow past the tolerance,
  // then it is removed and the population must return. Run every time — a control that only
  // runs when someone remembers is a control that never runs.
  const injected = await page.evaluate(() => {
    const n = document.createElement("div");
    n.id = "census-injected-control";
    n.setAttribute(
      "style",
      "position:fixed;left:0;top:0;width:400px;height:300px;filter:blur(2px);background:#000;opacity:0.01;pointer-events:none;z-index:-1",
    );
    document.body.appendChild(n);
    return true;
  });
  expect(injected).toBe(true);
  const withControl = await census(page, selectors);
  expect(
    withControl.filter((h) => h.row < 0).map((h) => h.path),
    `[${regime}] the injected filtered node must be censused as unclaimed`,
  ).toHaveLength(1);
  expect(withControl.length, `[${regime}] control raises the total by exactly one`).toBe(
    FILTER_BUDGET_TOTAL + 1,
  );
  expect(
    await unionArea(page),
    `[${regime}] control must grow the union past the tolerance`,
  ).toBeGreaterThan(area + slack);
  await page.evaluate(() =>
    document.getElementById("census-injected-control")?.remove(),
  );
  expect(
    (await census(page, selectors)).length,
    `[${regime}] population returns once the control is removed`,
  ).toBe(FILTER_BUDGET_TOTAL);
}

test("G3.1 · live-filter census equals filterBudget.ts exactly, area and all (built dist)", async ({
  page,
}) => {
  await settleBoard(page);
  await assertCensus(page, "row");
});

// ── G3.3 — the SAME census below 1024 ────────────────────────────────────────────────────────
// `filterBudget.ts` asserted in prose that "below 1024 the population is the same size", and
// nothing checked it — while every gate in this repo runs at 1280×800 and the whole campaign is
// about the phone. The claim is true (9 / 9, both engines) and it is now a gate rather than a
// header sentence: the mobile arm of the one mounted card, at the device's own dpr.
test.describe("G3.3 · the coarse regime", () => {
  test.use({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  });

  test("G3.3 · live-filter census holds below 1024 (built dist)", async ({ page }) => {
    await settleBoard(page);
    await assertCensus(page, "coarse");
  });
});

// ── G3.5 — THE HOVERED PASS, in both regimes ────────────────────────────────────────────────
// The census above samples the document AT REST, and pass 2's actual mark-4 breach was
// `@media (hover:hover) .ctrl-btn:hover { filter: url(#wobble-heart) }` — a filter that computes
// to `none` until a pointer is over the control, and is therefore invisible to every assertion
// in this file. The grep that used to catch that class was retired as sole witness (pass-2
// registry §4) and its replacement inherited the blindness: a rendered census taken at rest
// cannot red on a rendered state it never enters.
//
// So the pointer is moved. Not `locator.hover()` — that runs actionability checks and SCROLLS,
// which would move the population it is measuring — but a raw mouse move to each candidate's
// own centre, in place, skipping anything off-screen or zero-sized. The assertion is the one a
// count can carry: a hover may not RAISE the filtered population. `url(#wobble-heart)` is
// already resident (the attribution hearts), so a value comparison would have missed the exact
// defect this exists for; the count does not.
//
// Its own negative control runs in the same test, because a hover pass that has stopped finding
// its candidates passes vacuously and looks identical to a clean estate.

const HOVER_CANDIDATES =
  'button, [role="option"], [role="group"], a[href], .ctrl-btn, .staging-btn, .game-card, .icon-btn, .washi-tag, label, summary';

/** The counting rule of this file, as a bare population count (the hovered pass compares
 *  totals, not rows — the gallery regime has no allowlist and does not need one for this). */
async function filteredCount(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      Array.from(document.querySelectorAll("*")).filter((el) => {
        const cs = getComputedStyle(el);
        return cs.filter !== "none" && cs.display !== "none";
      }).length,
  );
}

/** Hover every on-screen candidate in turn; return the ones that minted a filtered surface. */
async function hoverOffenders(page: Page): Promise<string[]> {
  const rest = await filteredCount(page);
  const spots = await page.evaluate((sel: string) => {
    const seen = new Set<string>();
    const out: { x: number; y: number; path: string }[] = [];
    for (const el of Array.from(document.querySelectorAll(sel))) {
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2;
      const y = r.y + r.height / 2;
      if (r.width <= 0 || r.height <= 0) continue;
      if (x <= 0 || y <= 0 || x >= innerWidth || y >= innerHeight) continue;
      const cls =
        (typeof el.className === "string" ? el.className : "").trim().split(/\s+/)[0] ??
        "";
      const path = `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`;
      // One sample per distinct surface class — the estate's controls come in families and
      // hovering sixteen identical `.icon-btn`s measures the same CSS rule sixteen times.
      if (seen.has(path)) continue;
      seen.add(path);
      out.push({ x, y, path });
    }
    return out;
  }, HOVER_CANDIDATES);

  const offenders: string[] = [];
  for (const s of spots) {
    await page.mouse.move(s.x, s.y);
    const after = await filteredCount(page);
    if (after > rest) offenders.push(`${s.path} → +${after - rest}`);
  }
  await page.mouse.move(0, 0);
  return offenders;
}

/** The whole hovered pass for one settled regime, control included. */
async function assertNoHoverFilters(page: Page, regime: string) {
  // Precondition: the population is STILL. A drifting count would make every delta below noise.
  const a = await filteredCount(page);
  await page.waitForTimeout(400);
  expect(await filteredCount(page), `[${regime}] population is stable before hovering`).toBe(
    a,
  );

  expect(
    await hoverOffenders(page),
    `[${regime}] surfaces that mint a live filter on :hover`,
  ).toEqual([]);

  // THE CONTROL — the pass-2 defect, re-authored. If this does not fire, the pass above found
  // no candidates and its clean result meant nothing.
  await page.evaluate(() => {
    const s = document.createElement("style");
    s.id = "hover-census-control";
    s.textContent =
      ".ctrl-btn:hover, .staging-btn:hover, .icon-btn:hover, [role='option']:hover { filter: blur(1px) }";
    document.head.appendChild(s);
  });
  expect(
    (await hoverOffenders(page)).length,
    `[${regime}] the injected :hover filter must be caught`,
  ).toBeGreaterThan(0);
  await page.evaluate(() => document.getElementById("hover-census-control")?.remove());
  expect(
    await hoverOffenders(page),
    `[${regime}] population returns once the control is removed`,
  ).toEqual([]);
}

test("G3.5 · no :hover state mints a live filter — board regime (built dist)", async ({
  page,
}) => {
  await settleBoard(page);
  await assertNoHoverFilters(page, "board");
});

test("G3.5 · no :hover state mints a live filter — PICKER regime (built dist)", async ({
  page,
}) => {
  // The regime the staging band lives in, and the one the shipped census has never visited:
  // `filterBudget.ts` states the board population and says so. The band's chips are the shared
  // `OptionSelector`'s `.ctrl-btn` — the very class that carried the pass-2 hover wobble — so
  // the picker is where a re-introduction would land first.
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 20000 });
  await page.waitForSelector(".staging-band", { timeout: 20000 });
  await page.waitForTimeout(1200); // the deck's entry beats, settled
  await assertNoHoverFilters(page, "picker");
});

test("G3.2 · no retained fill supplies a computed transform (built dist)", async ({
  page,
}) => {
  await settleBoard(page);
  const offenders = await page.evaluate(() =>
    document
      .getAnimations()
      .map((a) => {
        // A RETAINED fill is the defect: the animation is over, and its effect is still
        // supplying a value. A running animation supplying a transform is just an animation.
        if (a.playState === "running" || a.playState === "paused") return null;
        const fill = a.effect?.getComputedTiming().fill;
        const target = (a.effect as KeyframeEffect | undefined)?.target as
          Element | undefined;
        if (fill !== "forwards" && fill !== "both") return null;
        if (!target) return null;
        const t = getComputedStyle(target).transform;
        if (t === "none") return null;
        const name = (a as unknown as { animationName?: string }).animationName ?? "?";
        return `${name} → transform: ${t}`;
      })
      .filter((x): x is string => x !== null),
  );
  expect(
    offenders,
    "animations whose retained fill supplies a computed transform",
  ).toEqual([]);
});

// ── The SOURCE census (same gate, second instrument) ────────────────────────────────────────
// A rendered census can only see the scene it loads; the fill defect is authored in CSS and can
// be introduced on a surface no scene visits. So the sites themselves are counted, out of source.

const FILL_RE = /animation(?:-fill-mode)?\s*:\s*([^;}]*?)\b(forwards|both)\b/g;
const ANIM_NAME_RE = /animation\s*:\s*([A-Za-z_-][\w-]*)/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(css|vue)$/.test(name)) out.push(p);
  }
  return out;
}

test("G3.2 · source `forwards|both` fill sites equal FILL_ALLOWLIST exactly", () => {
  // ESM spec: no `__dirname`. Resolve web/frontend/ from this file's own URL.
  const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
  const found = new Map<string, number>();
  for (const abs of walk(join(root, "src"))) {
    // Comments out first: this estate documents its fill discipline IN prose next to the rules
    // (`scene.css` §"`backwards` fill, NOT `both`"), and a census that counts its own docs lies.
    const text = readFileSync(abs, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const file = relative(root, abs).split("\\").join("/");
    for (const m of text.matchAll(FILL_RE)) {
      // `animation: <name> …ms …ease both` names its animation inline; a bare
      // `animation-fill-mode:` declaration must resolve its name from the same rule block.
      const decl = m[0];
      let name = ANIM_NAME_RE.exec(decl)?.[1];
      if (!name) {
        const before = text.slice(0, m.index ?? 0);
        const block = before.lastIndexOf("{");
        name = ANIM_NAME_RE.exec(text.slice(block, (m.index ?? 0) + decl.length))?.[1];
      }
      const key = `${file}::${name ?? "?"}`;
      found.set(key, (found.get(key) ?? 0) + 1);
    }
  }
  const actual = [...found.entries()].map(([k, count]) => `${k} ×${count}`).sort();
  const expected = FILL_ALLOWLIST.map(
    (r) => `${r.file}::${r.animation} ×${r.count}`,
  ).sort();
  expect(actual, "authored forwards/both fill sites vs FILL_ALLOWLIST").toEqual(
    expected,
  );
});
