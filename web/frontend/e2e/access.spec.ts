import { test, expect, devices, type Page } from "@playwright/test";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
//
/**
 * T7-W2 — THE ACCESS WAVE, as gates.
 *
 * Three rows, all three born RED at the uncured tree (`docs/tranches/2026-08-tranche-7/
 * evidence/w2/gates-born-red.txt`). They live in a NEW file rather than in `a11y.spec.ts`
 * because that one is T5-W3's record and W3 owns it this tranche; nothing here restates a
 * row it already holds.
 *
 * DEFAULT CONFIG, both engines. Nothing below reads a baked bitmap or a bundle census, so the
 * dev-server suite is the right home — and gate 2.2 is precisely an `inert` claim, which is
 * where `a11y.spec.ts`'s own header books WebKit and Chromium as liable to disagree.
 *
 * THE INSTRUMENT, once, for two of the three rows: PAINTED OCCLUSION, sampled as the audit
 * sampled it — a 5×5 grid over the control's border box, each point put to
 * `document.elementFromPoint`, and a point counts as BURIED when what answers is neither the
 * control nor a descendant of it. Twenty-five points, because that is the idiom the figures of
 * record were measured with (25/25 on the desktop "Normal", 10/25 on "Corner", 15/25 on the
 * invite verb) and a gate that re-derives them has to be able to reproduce them.
 *
 * WHY OCCLUSION AND NOT VISIBILITY: every control below answers `toBeVisible()`, has a box, is
 * not `inert`, is not `aria-hidden`, and takes focus. The defect is that something else paints
 * over the top of it. No visibility predicate in either engine models that, so it is measured.
 */

// ── Helpers ─────────────────────────────────────────────────────────

/** The dev-only FilterTuner toggle (env-gated OUT of prod builds) floats over the panel and
 *  answers `elementFromPoint` where it overlaps — dev chrome, not product surface, and the
 *  estate's own mobile suite hides it for the same reason (mobile-affordances.spec.ts:26). */
async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
}

/** Load a board and wait for it to SETTLE — cells, then the grid's draw-in→boil handoff
 *  (`g.boil-frame-layer.is-active`, the suite's board-settle idiom). */
async function loadBoard(page: Page, query = "size=3&difficulty=EASY") {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./?" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 20000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 20000,
  });
  await hideDevChrome(page);
}

/**
 * THE CENSUS, run wholly in page: focus each tabbable under `roots`, let the focus-scroll
 * settle, then measure painted occlusion. One round trip rather than three per control —
 * focusing scrolls the card, so measuring from outside would race the scroll it just caused.
 *
 * SKIPPED, and each for a reason that is not "it was inconvenient":
 *   · zero-box controls — the coarse-only play verbs are `display: none` on a fine desktop, so
 *     they are not in anyone's tab order and `elementFromPoint` has no point to ask about;
 *   · `inert` / `aria-hidden` subtrees — an untabbable control is exactly what the A2 cure
 *     produces, so counting them would keep gate 2.2 red through its own cure.
 */
type Row = {
  ident: string;
  cls: string;
  covered: number;
  total: number;
  blockers: string[];
  allowed: string | null;
};

async function occlusionCensus(
  page: Page,
  roots: string[],
  allowlist: { selector: string; reason: string }[] = [],
): Promise<Row[]> {
  return page.evaluate(
    async ({ roots, allowlist }) => {
      const TABBABLE =
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),summary';
      const stripped = (el: Element): boolean => {
        for (let n: Element | null = el; n; n = n.parentElement) {
          if (n.hasAttribute("inert")) return true;
          if (n.getAttribute("aria-hidden") === "true") return true;
        }
        return false;
      };
      const els = [
        ...new Set(
          roots.flatMap((r) => [...document.querySelectorAll(r)]).flatMap((root) => [
            ...root.querySelectorAll(TABBABLE),
          ]),
        ),
      ].filter((el) => {
        const e = el as HTMLElement;
        if (e.hasAttribute("disabled") || e.tabIndex < 0) return false;
        if (stripped(e)) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }) as HTMLElement[];

      const out: Row[] = [];
      for (const el of els) {
        el.focus();
        // The focus-scroll, settled. `scroll-padding-*` and `scroll-margin-*` both land on this
        // frame; a measurement taken before it is a measurement of the pre-scroll box.
        await new Promise((r) => setTimeout(r, 120));

        const rect = el.getBoundingClientRect();
        let covered = 0;
        let total = 0;
        const blockers = new Set<string>();
        for (let a = 0; a < 5; a++)
          for (let b = 0; b < 5; b++) {
            const x = rect.left + (rect.width * (a + 0.5)) / 5;
            const y = rect.top + (rect.height * (b + 0.5)) / 5;
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
            total++;
            const top = document.elementFromPoint(x, y);
            if (!(top && (top === el || el.contains(top)))) {
              covered++;
              if (top)
                blockers.add(
                  // `getAttribute`, not `.className`: on an SVG node the property is an
                  // `SVGAnimatedString` and stringifies to `[object SVGAnimatedString]`, which
                  // names nothing in a red.
                  top.tagName.toLowerCase() +
                    (top.getAttribute("class") || "")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((c) => "." + c)
                      .join(""),
                );
            }
          }

        const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24);
        out.push({
          ident: el.getAttribute("aria-label") || text || el.tagName,
          cls: (el.getAttribute("class") || "").split(" ")[0] || el.tagName.toLowerCase(),
          covered,
          total,
          blockers: [...blockers],
          allowed: allowlist.find((a) => el.matches(a.selector))?.reason ?? null,
        });
      }
      return out;
    },
    { roots, allowlist },
  );
}

const pct = (r: Row) => (r.total === 0 ? 0 : r.covered / r.total);
const line = (r: Row) =>
  `${r.covered}/${r.total} (${Math.round(pct(r) * 100)}%) ${r.ident} [.${r.cls}]` +
  (r.blockers.length ? ` ← ${r.blockers.join(", ")}` : "") +
  (r.allowed ? ` ALLOWED: ${r.allowed}` : "");

// ═══ 2.1 — focus-occlusion census, desktop (born RED) ═══════════════
//
// HEAD 1440×900: tab into the controls card and the marks-mode "Normal" `.ctrl-btn` lands
// 25/25 buried under the sticky `.action-verbs` bar. `:focus-visible` is true and the card's
// `scrollTop` stays 0 — the browser isn't wrong about that, the button's box (751–789) is
// already inside the scrollport's client box (189–829), so nothing scrolls; the bar (744–809)
// simply paints over it where it sits. The focus ring is drawn where nobody can see it, and
// the cure is `scroll-padding-bottom` on the scrollport rather than anything about scrolling.
//
// THE FLOOR IS "NO FULLY-BURIED CONTROL", not a per-button percentage. The same bar leaves
// "Corner" at 10/25 and the invite verb at 15/25; those are the same defect measured at the
// edges of the same bar, and A1's `scroll-padding-bottom` clears the whole class in one stroke.
// So the gate holds the floor and ANNOTATES the partials — a percentage gate would need
// re-baselining every time the bar changes height, which is the magic-total trap.

const CARD = ".controls-card";
/** 24 of 25 sample points. A hairline of the control peeking out is not reachability. */
const FULLY_BURIED = 0.96;

test.describe("2.1 focus-occlusion census — the desktop card", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("no control in the controls card focuses into a full burial", async ({ page }) => {
    await loadBoard(page);
    await expect(page.locator(CARD)).toBeVisible();

    const rows = await occlusionCensus(page, [CARD]);

    // Not vacuous: the card really is a card full of controls.
    expect(rows.length, "the controls card must publish tabbables to census").toBeGreaterThan(10);
    test.info().annotations.push({
      type: "occlusion-census",
      description: rows.map(line).join("\n"),
    });

    const buried = rows.filter((r) => pct(r) >= FULLY_BURIED);
    expect(
      buried.map(line),
      "controls that take focus while fully painted over — a focus ring nobody can see",
    ).toEqual([]);
  });

  test('the marks-mode "Normal" button is reachable, found by identity', async ({ page }) => {
    await loadBoard(page);

    // BY IDENTITY, NEVER BY TAB ORDINAL. The attribution hover-card injects three tabbables on
    // the first Tab, so the ordinal is entry-state dependent and a fixed press count would be
    // asserting over whichever control happened to be nth today.
    const normal = page
      .locator(CARD)
      .locator(".zone-row", { has: page.locator(".zone-row-label", { hasText: /^marks$/ }) })
      .locator(".ctrl-btn", { hasText: /^Normal$/ });
    await expect(normal, 'the marks row publishes exactly one "Normal"').toHaveCount(1);

    // CONTROL: it is a real, focusable, published control — the defect is the paint over it,
    // not an absence. (`inert` and `aria-hidden` are both false here at HEAD.)
    await normal.focus();
    expect(
      await page.evaluate(() => document.activeElement?.textContent?.trim()),
      "the button takes focus",
    ).toBe("Normal");

    const rows = await occlusionCensus(page, [CARD]);
    const row = rows.find((r) => r.ident === "Normal");
    expect(row, "the census reached the marks-mode Normal button").toBeTruthy();
    test.info().annotations.push({
      type: "normal-button",
      description: line(row!),
    });
    expect(
      pct(row!) < FULLY_BURIED,
      `the marks-mode "Normal" button focuses into a full burial: ${line(row!)}`,
    ).toBe(true);
  });
});

// ═══ 2.2 — drawer-open inert census, 390×844 (born RED) ═════════════
//
// HEAD: the drawer opens over the fold and its own option row paints across all four play
// verbs — Undo, Redo, "Reveal a hint in the selected cell" and peek, 25/25 each, in BOTH
// engines — and not one of them is `inert` or `aria-hidden`. They stay in the tab order and in
// the AX tree while entirely hidden. The cure is the mechanism the estate already owns
// (`GameCard.vue`'s `:inert="!isActive"`), and an inert control leaves this census by
// construction: that is what makes the gate green exactly when A2 lands.
//
// SCOPE IS LOAD-BEARING. Rooted at the drawer and at the action row the drawer covers —
// nothing wider. An unscoped census at this viewport also catches the attribution card's three
// links (25/25 under `.main-content` — a separate defect, W1's) and would therefore stay red
// through A2's cure, which is a gate that has stopped saying anything about A2.

const DRAWER_ROOTS = ["#controls-drawer", ".play-controls"];

/** ≥99%, as the wave writes it. At 25 sample points that band is exactly 25/25 — the four
 *  born-RED verbs sit there, and the annotation carries every partial besides. */
const DRAWER_BURIED = 0.99;

const DRAWER_ALLOWLIST = [
  {
    selector: ".cell-native-input",
    reason:
      "opacity:0 BY DESIGN — the per-cell native input is the sole entry surface on every " +
      "pointer (T4-WM §1, the pad abrogation). It is deliberately invisible and deliberately " +
      "tabbable; occlusion is not its failure mode.",
  },
];

// The descriptor MINUS `defaultBrowserType`: Playwright refuses that key inside a describe
// (it forces a new worker), and it would be inert here anyway — each project overrides
// `browserName` outright, so both engines claim this file (T5-W1 1.10 / CH-56, the same
// reasoning `mobile-affordances.spec.ts` carries at its own `test.use`).
const { defaultBrowserType: _phoneEngine, ...IPHONE } = devices["iPhone 13"];

test.describe("2.2 drawer-open inert census — the phone", () => {
  test.use({ ...IPHONE, viewport: { width: 390, height: 844 } });

  test("no covered control in the drawer subtree stays tabbable", async ({ page }) => {
    await loadBoard(page);

    // The drawer is CLOSED at rest on the portrait dock, so the state under test is entered
    // deliberately rather than assumed.
    await page.locator(".drawer-tab").tap();
    await expect(page.locator(".drawer-tab")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#controls-drawer .controls-card")).toBeVisible();
    await page.waitForTimeout(900); // the Band-D glide's own clock, then settle

    // CONTROL, and it is deliberately not "the four verbs are in the census": after A2 they
    // are inert, hence out of it. What must hold in both worlds is that they EXIST — a cure
    // that deletes the play verbs is not a cure.
    await expect(page.locator(".play-controls button")).toHaveCount(4);

    const rows = await occlusionCensus(page, DRAWER_ROOTS, DRAWER_ALLOWLIST);
    expect(rows.length, "the open drawer must publish tabbables to census").toBeGreaterThan(5);
    test.info().annotations.push({
      type: "drawer-census",
      description: rows.map(line).join("\n"),
    });

    const buried = rows.filter((r) => pct(r) >= DRAWER_BURIED && !r.allowed);
    expect(
      buried.map(line),
      "controls painted over end to end and still in the tab order — a covered control must " +
        "be inert",
    ).toEqual([]);
  });
});

// ═══ 2.3 — roster mutation announcement + the contrast floor ════════

/** The live regions, as one string. A join or a leave must move it. */
const liveText = (page: Page): Promise<string> =>
  page.evaluate(() =>
    [...document.querySelectorAll('[aria-live],[role="status"],[role="alert"],[role="log"]')]
      .map((r) => (r.textContent || "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" | "),
  );

const rosterRows = (page: Page) => page.locator(".controls-card .players-roster .player-row");

// ONE BROWSER CONTEXT, and that is mechanism rather than convenience: `?wire=local` is a
// `BroadcastChannel`, scoped to an origin WITHIN a context (multiplayer.spec.ts:4).
test.describe("2.3 the roster announces", () => {
  test("a join and a leave each move a live region", async ({ browser }) => {
    const ctx = await browser.newContext();
    const a = await ctx.newPage();
    await a.emulateMedia({ reducedMotion: "reduce" });
    await a.goto("./?size=3&difficulty=EASY&wire=local");
    await a.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await a
      .locator('.controls-card button[aria-label="Play together on this board"]')
      .click();
    await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
    const link = a.url();
    await expect(rosterRows(a)).toHaveCount(1);

    // ── THE JOIN ──
    const beforeJoin = await liveText(a);
    const b = await ctx.newPage();
    await b.emulateMedia({ reducedMotion: "reduce" });
    await b.goto(link);
    await b.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    // CONTROL: the room really did take somebody in. Without this the row could green on a
    // live region that changed for reasons of its own.
    await expect(rosterRows(a)).toHaveCount(2);
    await a.waitForTimeout(1200); // the announcement's own frame, generously

    // SOFT, so the leave arm still runs. The two arms are separate claims about separate
    // events; a hard stop at the join would leave the leave untested on every red, which is
    // exactly how half a defect gets cured and nobody notices.
    const afterJoin = await liveText(a);
    expect
      .soft(
        afterJoin,
        `the roster went 1 → 2 and nothing was announced; live regions still read ` +
          `${JSON.stringify(beforeJoin)}`,
      )
      .not.toBe(beforeJoin);

    // ── THE LEAVE ──
    await b.close();
    await expect(rosterRows(a)).toHaveCount(1);
    await a.waitForTimeout(1200);

    const afterLeave = await liveText(a);
    expect
      .soft(
        afterLeave,
        `the roster went 2 → 1 and nothing was announced; live regions still read ` +
          `${JSON.stringify(afterJoin)}`,
      )
      .not.toBe(afterJoin);

    await ctx.close();
  });
});

// ── The contrast floor (A10) ────────────────────────────────────────
//
// `.icon-sublabel` and `.ctrl-btn` measure 4.66:1 light against a 4.5 floor — 0.16 of headroom.
// NOT A FAILURE, and this row is honest about that: it is GREEN at HEAD and exists so a future
// token nudge cannot cross 4.5 in silence. The one thing it needed to be built for is the
// resolver: `color-mix(… , transparent)` computes to `color(srgb r g b / a)` in both engines,
// and a naive `rgb()`-only parser reads that as black and reports a fictional ratio.

type Sample = { sel: string; text: string; ratio: number; fg: string; bg: string };

const CONTRAST_TARGETS = [`${CARD} .icon-sublabel`, `${CARD} .ctrl-btn`];

async function contrastSamples(page: Page, selectors: string[]): Promise<Sample[]> {
  return page.evaluate((selectors) => {
    /** rgb() / rgba() / color(srgb …) / #hex / transparent → [r,g,b,a], channels 0..255. */
    const parse = (c: string): [number, number, number, number] => {
      const s = c.trim();
      if (!s || s === "transparent") return [0, 0, 0, 0];
      let m = /^color\(\s*srgb\s+([^)]+)\)$/i.exec(s);
      if (m) {
        const parts = m[1].split("/");
        const rgb = parts[0].trim().split(/\s+/).map(Number);
        const a = parts[1] === undefined ? 1 : Number(parts[1].trim().replace("%", "")) / (parts[1].includes("%") ? 100 : 1);
        return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a];
      }
      m = /^rgba?\(([^)]+)\)$/i.exec(s);
      if (m) {
        const p = m[1].split(/[,/]/).map((x) => x.trim());
        const n = p.map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)));
        return [n[0], n[1], n[2], p[3] === undefined ? 1 : n[3]];
      }
      m = /^#([0-9a-f]{3,8})$/i.exec(s);
      if (m) {
        const h = m[1].length <= 4 ? [...m[1]].map((x) => x + x).join("") : m[1];
        const v = (i: number) => parseInt(h.slice(i * 2, i * 2 + 2), 16);
        return [v(0), v(1), v(2), h.length === 8 ? v(3) / 255 : 1];
      }
      return [0, 0, 0, 0];
    };
    const over = (
      fg: [number, number, number, number],
      bg: [number, number, number, number],
    ): [number, number, number, number] => {
      const a = fg[3] + bg[3] * (1 - fg[3]);
      if (a === 0) return [0, 0, 0, 0];
      const ch = (i: number) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
      return [ch(0), ch(1), ch(2), a];
    };
    const lum = (c: [number, number, number, number]) => {
      const f = (x: number) => {
        const v = x / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };

    const out: Sample[] = [];
    for (const sel of selectors)
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue; // not painted at this width; nothing to read
        // The backdrop, composited bottom-up: every ancestor layer down to the first opaque one.
        const layers: [number, number, number, number][] = [];
        for (let n: Element | null = el; n; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c[3] > 0) layers.push(c);
          if (c[3] >= 1) break;
        }
        let bg: [number, number, number, number] = [255, 255, 255, 1];
        for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
        const fg = over(parse(getComputedStyle(el).color), bg);
        const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        out.push({
          sel,
          text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 16),
          ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
          fg: getComputedStyle(el).color,
          bg: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
        });
      }
    return out;
  }, selectors);
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`2.3 contrast floor — ${scheme}`, () => {
    test(`.icon-sublabel and .ctrl-btn clear 4.5:1 (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
      await page.goto("./?size=3&difficulty=EASY");
      await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 20000 });
      await page.waitForSelector("g.boil-frame-layer.is-active", {
        state: "attached",
        timeout: 20000,
      });
      // The scheme is asserted, not assumed: `useDark` reads `prefers-color-scheme` only while
      // the storage key is unset, and a row that measured the wrong theme would be measuring
      // the other row's numbers.
      await expect
        .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
        .toBe(scheme === "dark");

      const samples = await contrastSamples(page, CONTRAST_TARGETS);
      expect(samples.length, "both families must be on screen to be measured").toBeGreaterThan(8);
      const worst = samples.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
      test.info().annotations.push({
        type: `contrast-${scheme}`,
        description:
          `worst ${worst.ratio}:1 — "${worst.text}" ${worst.sel} (${worst.fg} on ${worst.bg}); ` +
          `n=${samples.length}`,
      });

      // Both families are NORMAL text at every width they paint (sublabels 14.4–16.4px regular,
      // chips 20px regular — under 18.66px bold / 24px regular), so one floor covers them.
      const thin = samples.filter((s) => s.ratio < 4.5);
      expect(
        thin.map((s) => `${s.ratio}:1 "${s.text}" ${s.sel} (${s.fg} on ${s.bg})`),
        "control text below the 4.5:1 floor",
      ).toEqual([]);
    });
  });
}
