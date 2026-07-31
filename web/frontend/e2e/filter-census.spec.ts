import { test, expect, type Page } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FILL_ALLOWLIST,
  FILTER_BUDGET,
  FILTER_BUDGET_CEILING,
  FILTER_BUDGET_TOTAL,
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

test("G3.1 · live-filter census equals filterBudget.ts exactly (built dist)", async ({
  page,
}) => {
  await settleBoard(page);
  const hits = await census(
    page,
    FILTER_BUDGET.map((r) => r.selector),
  );

  // (a) nothing unclaimed — the exact-match half a ceiling cannot give.
  const unclaimed = hits.filter((h) => h.row < 0);
  expect(
    unclaimed.map((h) => `${h.path}  ⟨${h.filter}⟩`),
    "live filters no filterBudget.ts row claims",
  ).toEqual([]);

  // (b) every row's population is exact, in both directions.
  const actual = FILTER_BUDGET.map((r, i) => ({
    selector: r.selector,
    count: hits.filter((h) => h.row === i).length,
  }));
  expect(actual).toEqual(
    FILTER_BUDGET.map((r) => ({ selector: r.selector, count: r.count })),
  );

  // (c) the charter's own numbers: perCell 0, htmlBoxes 0, total ≤ 14.
  const perCell = await page.evaluate(
    (scope) =>
      Array.from(document.querySelectorAll(`${scope} *`)).filter(
        (el) => getComputedStyle(el).filter !== "none",
      ).length,
    PER_CELL_SCOPE,
  );
  expect(perCell, `live filters inside ${PER_CELL_SCOPE}`).toBe(0);
  expect(
    hits.filter((h) => h.html).map((h) => h.path),
    "reference filters on HTML boxes (WebKit software filter path)",
  ).toEqual([]);
  expect(hits.length).toBe(FILTER_BUDGET_TOTAL);
  expect(hits.length).toBeLessThanOrEqual(FILTER_BUDGET_CEILING);
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
