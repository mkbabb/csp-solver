import { test, expect, devices, type Page } from "@playwright/test";

/**
 * T4-P1 · THE ZONE GRAMMAR — the gates for the control card's naming, in both pointer regimes.
 *
 * The claim under test is "six eyebrows become two", and pass 2 gated it on the count of
 * `.section-heading` — a metric that cannot see a name which merely changed register, and which
 * therefore reported a win while the card carried MORE names than before. The successor is a
 * RENDERED-NAME CENSUS: enumerate every visible name on the card and assert its RANK. The
 * design is a ranking, so the gate reads ranks.
 *
 * Every coarse assertion is fenced by a REGIME WITNESS first (three independent observables),
 * because pass 1's family died on a mobile gate that ran at `pointer: fine` and reported a
 * number from the wrong layout without ever saying so.
 */

const NAME_SELECTOR = ".section-heading, .washi-tag, .zone-row-label";

async function loadSudoku(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

/** Visible names on the mounted card, with the rank each one is written at. */
async function census(page: Page, panelSel: string) {
  return page.locator(panelSel).evaluate((panel, sel) => {
    const rank = (el: Element) =>
      el.classList.contains("section-heading")
        ? "eyebrow"
        : el.classList.contains("washi-tag")
          ? "tape"
          : "caption";
    return [...panel.querySelectorAll(sel)]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map((el) => ({ text: el.textContent!.trim(), rank: rank(el) }));
  }, NAME_SELECTOR);
}

const countAt = (names: { rank: string }[], rank: string) =>
  names.filter((n) => n.rank === rank).length;

// ── The rail (fine pointer, row regime) ─────────────────────────────────────────

test("rendered-name census, rail: two eyebrows, three tapes, two captions — and the counter can see an injected one", async ({
  page,
}) => {
  await loadSudoku(page);
  const names = await census(page, ".controls-card .control-panel-wrap");

  // The eyebrow rank is the one the owner called contrived — six co-equal display caps. It
  // now holds exactly the two that caption the STAGED inputs, and nothing else.
  expect(countAt(names, "eyebrow")).toBe(2);
  expect(names.filter((n) => n.rank === "eyebrow").map((n) => n.text)).toEqual([
    "Size",
    "Difficulty",
  ]);
  // The compartments name themselves in the hand, one rank down.
  expect(names.filter((n) => n.rank === "tape").map((n) => n.text)).toEqual([
    "new game",
    "pencils",
    "teacher's",
  ]);
  // Two controls share the `pencils` compartment, so each gets a quiet caption; `teacher's`
  // holds one idea and needs none — which is the taxonomy paying for itself.
  expect(names.filter((n) => n.rank === "caption").map((n) => n.text)).toEqual([
    "marks",
    "candidates",
  ]);

  // NEGATIVE CONTROL — a census that cannot fail is not a census. Plant an eyebrow inside a
  // well and the count must move; the gate above would have gone red on it.
  const planted = await page.evaluate((sel) => {
    const well = document.querySelector(".controls-card .tray-well");
    const h = document.createElement("h2");
    h.className = "section-heading";
    h.textContent = "planted";
    well!.appendChild(h);
    return [
      ...document.querySelectorAll(`.controls-card .control-panel-wrap ${sel}`),
    ].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length;
  }, NAME_SELECTOR);
  expect(planted).toBe(names.length + 1);
});

/** The zone-naming coupling, as DATA rather than as a chain of assertions — so the same
 *  reading can be taken again after the coupling is deliberately broken. Per well:
 *  does its `aria-labelledby` resolve, to the visible tape, carrying no role, with the
 *  accessible name EQUAL to the drawn one. */
const ZONE_NAMING = () =>
  [...document.querySelectorAll(".controls-card .tray-well")].map((well) => {
    const id = well.getAttribute("aria-labelledby");
    const label = id ? document.getElementById(id) : null;
    const drawn = [...well.querySelectorAll(".washi-tag")]
      .filter((t) => t.getBoundingClientRect().width > 0)
      .map((t) => t.textContent!.trim());
    return {
      role: well.getAttribute("role"),
      resolves: !!label,
      isTape: !!label?.classList.contains("washi-tag"),
      labelRole: label?.getAttribute("role") ?? null,
      accessible: label?.textContent?.trim() ?? null,
      drawn: drawn[0] ?? null,
      agree: !!label && label.textContent!.trim() === (drawn[0] ?? null),
    };
  });

test("every zone is named by its own VISIBLE tape — the accessible name and the drawn one are one string", async ({
  page,
}) => {
  await loadSudoku(page);
  const wells = page.locator(".controls-card .tray-well");
  await expect(wells).toHaveCount(3);

  const named = await page.evaluate(ZONE_NAMING);
  expect(named.map((n) => n.drawn)).toEqual(["new game", "pencils", "teacher's"]);
  for (const n of named) {
    // Resolves, is the visible tape, is NOT a tooltip (a tooltip role is not a legal
    // `aria-labelledby` target and was what pass 1 fought from the outside), and the two
    // names are ONE string.
    expect(n).toMatchObject({
      role: "group",
      resolves: true,
      isTape: true,
      labelRole: null,
      agree: true,
    });
  }

  // NEGATIVE CONTROL — G12 shipped without one. Drive the accessible name away from the drawn
  // one and the same probe must report the disagreement; a coupling gate that cannot see a
  // decoupling asserts nothing. (The tape's text node is what both readings share, so moving
  // ONE of them is the only way to prove they were ever separately observed: the injected
  // sibling below becomes the accessible name while the drawn tape keeps its word.)
  const broken = await page.evaluate((probe) => {
    const label = document.querySelector(
      ".controls-card .tray-well .washi-tag",
    ) as HTMLElement;
    const id = label.id;
    label.removeAttribute("id");
    const decoy = document.createElement("span");
    decoy.id = id;
    decoy.textContent = "decoy";
    label.parentElement!.appendChild(decoy);
    return new Function(`return (${probe})()`)() as ReturnType<typeof ZONE_NAMING>;
  }, ZONE_NAMING.toString());
  expect(broken[0].agree, "negative control: the decoupled name must be seen").toBe(
    false,
  );
  expect(broken[0].isTape).toBe(false);
  expect(broken[0].accessible).toBe("decoy");
  expect(broken[0].drawn).toBe("new game");
});

test("the permanent tape is a LABEL, not a tooltip — and the surface it names has a name", async ({
  page,
}) => {
  await loadSudoku(page);
  // `role="tooltip"` describes a transient hover/focus popup. `.washi-persistent` pins
  // `opacity: 1` under `(pointer: coarse)`, so on every phone and every iPad the "hold to
  // peek" tape never hides — a tooltip with no hover, no focus and no dismissal. The role is
  // gone; nothing in the repo would have reddened if it came back, which is this row.
  const permanent = page.locator(
    ".controls-card .washi-tag, .controls-card .washi-persistent",
  );
  const n = await permanent.count();
  expect(n).toBe(4); // three compartment names + the peek tape
  for (let i = 0; i < n; i++)
    expect(
      await permanent.nth(i).getAttribute("role"),
      `permanent tape ${await permanent.nth(i).innerText()}`,
    ).toBeNull();
  // The hover washi on the icon buttons is DECORATIVE — and this clause is re-cut, not
  // relaxed (T5-W3 row 3.6, a11y r1 L11). It read `role === "tooltip"` on the ground that the
  // role "is true of" a transient hover/focus description. The live AX probe at `71456713`
  // read five of them sitting in the tree (`tooltip: 5`) with `aria-describedby` at ZERO hits
  // estate-wide: an ARIA tooltip is a description a control POINTS AT, and one nothing points
  // at is furniture. Wiring the five references was the alternative and it is worse on the
  // only measure that matters here — each tape's text is its own button's `aria-label`
  // re-spelled ("Deal" under "Deal a new board"), so five references buy five second
  // recitations. The distinction this row exists to protect is UNCHANGED and now states more,
  // not less: the permanent tapes above are LABELS (role null, in the tree, naming their
  // surface); the transient tape is DECORATION (role null AND out of the tree). Neither is a
  // tooltip, and a `role="tooltip"` coming back to either arm still reddens here.
  const transient = page.locator(
    ".controls-card .washi-label:not(.washi-tag):not(.washi-persistent)",
  );
  expect(await transient.count()).toBeGreaterThan(0);
  expect(await transient.first().getAttribute("role")).toBeNull();
  expect(await transient.first().getAttribute("aria-hidden")).toBe("true");

  // The surface the permanent tape names was a bare <div> with pointer handlers and NO
  // accessible name at all — diagnosed in pass 3, cured here. It is the zone separator, and
  // the gesture it carries has a keyboard twin (K), so the name says both.
  const peek = page.locator(".controls-card .peek-hold-surface");
  await expect(peek).toHaveAttribute("role", "separator");
  const name = await peek.getAttribute("aria-label");
  expect(name).toBeTruthy();
  expect(name!.toLowerCase()).toContain("answer key");
  expect(name!).toMatch(/\bK\b/);
});

test("the staged headings are HEADINGS for assistive tech — decided one way, not both", async ({
  page,
}) => {
  await loadSudoku(page);
  // F1's order asked this be settled honestly: headings for AT, or a real removal — never a
  // heading that is also hidden from the tree. The estate's answer is HEADINGS: every
  // `.section-heading` is an <h2> with a non-empty accessible name and none is `aria-hidden`.
  // The row exists so a later `aria-hidden` cannot land here silently.
  const headings = await page
    .locator(".controls-card .section-heading")
    .evaluateAll((els) =>
      els.map((el) => ({
        tag: el.tagName.toLowerCase(),
        hidden: el.getAttribute("aria-hidden"),
        inHidden: !!el.closest("[aria-hidden='true']"),
        name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim(),
      })),
    );
  expect(headings.length).toBe(2);
  for (const h of headings) {
    expect(h.tag).toBe("h2");
    expect(h.hidden).toBeNull();
    expect(h.inHidden).toBe(false);
    expect(h.name.length).toBeGreaterThan(0);
  }
  // The `aria-hidden="true"` this card DOES carry is decorative text whose control speaks for
  // itself — an icon sublabel, a tally's drawn parts. Stated as the property rather than as a
  // class allowlist: no hidden subtree may contain a heading, which is the "both" the order
  // forbade.
  const hidden = await page
    .locator(".controls-card [aria-hidden='true']")
    .evaluateAll((els) =>
      els.map((el) => ({
        cls: el.className.toString(),
        heading:
          el.tagName.toLowerCase().startsWith("h") || !!el.querySelector("h1,h2,h3"),
      })),
    );
  expect(hidden.length).toBeGreaterThan(0);
  for (const h of hidden)
    expect(h, `aria-hidden ${h.cls}`).toMatchObject({ heading: false });
});

test("selection is announced: every option chip carries aria-pressed, exactly one per group", async ({
  page,
}) => {
  await loadSudoku(page);
  const chips = page.locator(".controls-card .ctrl-btn");
  const n = await chips.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++)
    expect(await chips.nth(i).getAttribute("aria-pressed")).toMatch(/^(true|false)$/);

  // One pressed chip per selector, and it is the one drawn as selected — the sighted marking
  // and the announced state cannot disagree.
  // `.ctrl-options` is the group hook itself — the branch classes (`options-row`,
  // `options-pair`, the stacked column) are layout, and a probe pinned to one of them goes
  // blind the moment a group changes axis.
  const rows = page.locator(".controls-card .ctrl-options");
  const perGroup = await page.evaluate(() => {
    const groups = new Map<Element, { pressed: number; selected: number }>();
    for (const b of document.querySelectorAll(".controls-card .ctrl-btn")) {
      const g = b.parentElement!;
      const e = groups.get(g) ?? { pressed: 0, selected: 0 };
      if (b.getAttribute("aria-pressed") === "true") e.pressed++;
      if (b.classList.contains("selected-item")) e.selected++;
      groups.set(g, e);
    }
    return [...groups.values()];
  });
  expect(perGroup.length).toBeGreaterThanOrEqual(4);
  for (const g of perGroup) expect(g.pressed).toBe(g.selected);
  await expect(rows.first()).toBeVisible();
});

/** The bar against the card's VISIBLE frame, plus the reading that says the frame is real.
 *  Returned as data so the same probe can be taken again after the sticky is struck. */
const BAR_IN_FRAME = () => {
  const card = document.querySelector(".controls-card") as HTMLElement | null;
  const bar = document.querySelector(".controls-card .action-bar");
  if (!card || !bar) return null;
  const c = card.getBoundingClientRect();
  const b = bar.getBoundingClientRect();
  return {
    scrollTop: card.scrollTop,
    scrollable: card.scrollHeight - card.clientHeight,
    belowFold: +(b.top - c.bottom).toFixed(2),
    overhang: +(b.bottom - c.bottom).toFixed(2),
    position: getComputedStyle(bar).position,
  };
};

test("the action bar rides the card's own scrollport — at the TOP of a 1039px card, not only at its end", async ({
  page,
}) => {
  await loadSudoku(page);

  // T6 mark 5. The read is taken at `scrollTop 0` ON PURPOSE, and the audit rider is why: at
  // the scroll END a static last child also sits at the card's bottom edge, so a scroll-end
  // assertion greens on the incumbent and proves nothing. The discriminating state is the
  // TOP of a card whose content is 400px taller than its frame — sticky puts the four verbs
  // in view there and static leaves them a screenful below the fold.
  await page.locator(".controls-card").evaluate((el) => {
    el.scrollTop = 0;
  });
  const at = await page.evaluate(BAR_IN_FRAME);
  expect(at, "the rail card and its action bar must both be mounted").not.toBeNull();

  // The frame has to be a real scrollport or the row asserts nothing: a card that fits its
  // content puts the bar in view whatever its `position` is.
  expect(at!.scrollable, "the card must overflow its frame at this viewport").toBeGreaterThan(
    40,
  );
  expect(at!.scrollTop).toBe(0);
  expect(at!.position).toBe("sticky");
  // In frame: the bar's bottom sits at or above the card's visible bottom edge.
  expect(at!.overhang, "the bar hangs below the card's visible bottom").toBeLessThanOrEqual(1);
  expect(at!.belowFold, "the bar's top is inside the frame").toBeLessThan(0);

  // NEGATIVE CONTROL — strike the one declaration that does the work. The same probe must
  // report the bar below the fold by roughly the card's whole unscrolled overflow.
  await page.addStyleTag({
    content: ".controls-card .action-bar { position: static !important; }",
  });
  const struck = await page.evaluate(BAR_IN_FRAME);
  expect(struck!.position).toBe("static");
  expect(
    struck!.belowFold,
    "negative control: a static bar must fall out of the card's frame",
  ).toBeGreaterThan(0);
});

test("a frozen well mints ONE pose node and promotes nothing (the HandDrawnOutline prune)", async ({
  page,
}) => {
  await loadSudoku(page);
  const wells = await page.locator(".controls-card .tray-well").evaluateAll((els) =>
    els.map((el) => {
      const poses = [...el.querySelectorAll(":scope > svg.outline-svg > g.boil-pose")];
      const painted = poses.filter((p) => getComputedStyle(p).display !== "none");
      return {
        painted: painted.length,
        promoted: painted.filter((p) => getComputedStyle(p).willChange !== "auto")
          .length,
      };
    }),
  );
  expect(wells).toHaveLength(3);
  // A `:pose` outline never swaps, so the resident sibling stack bought nothing and cost a
  // permanently promoted layer each. One node, zero layers.
  for (const w of wells) {
    expect(w.painted).toBe(1);
    expect(w.promoted).toBe(0);
  }

  // NEGATIVE CONTROL. This row is the SUCCESSOR to G9 ("`useRasterStack` consumers = 3"),
  // which is struck: a count of a symbol's import sites cannot fail for the property anyone
  // cares about, and the property anyone cares about is this one — a frozen outline mints one
  // node and promotes nothing. Un-prune the stack in-page and the same probe must count the
  // siblings and the layers back.
  const unpruned = await page.evaluate(() => {
    const svg = document.querySelector(
      ".controls-card .tray-well > svg.outline-svg",
    ) as SVGElement;
    const g = svg.querySelector("g.boil-pose") as SVGElement;
    for (let i = 0; i < 3; i++) {
      const clone = g.cloneNode(true) as SVGElement;
      clone.style.willChange = "opacity";
      svg.appendChild(clone);
    }
    const poses = [...svg.querySelectorAll("g.boil-pose")];
    const painted = poses.filter((p) => getComputedStyle(p).display !== "none");
    return {
      painted: painted.length,
      promoted: painted.filter((p) => getComputedStyle(p).willChange !== "auto").length,
    };
  });
  expect(unpruned.painted).toBe(4);
  expect(unpruned.promoted).toBe(3);
});

// ── The rail, at coarse (≥1024) — the ONE cell where the pair branch exists ──────

test.describe("coarse row regime (≥1024)", () => {
  // THE BRANCH AND THE FLOOR HAVE NEVER MET (pass-4 BC-M1). `.options-pair` renders only on
  // the RAIL — `OptionSelector` takes `.options-row` whenever `mobile` is passed, and the
  // phone's card always passes it — so the branch is a ≥1024 fact. The 44px floor, meanwhile,
  // runs only in the coarse-iPhone describe below, where the branch cannot appear. The pair
  // was therefore gated as a CEILING alone (`panelH ≤ 1098.25`, visual-regression test 10),
  // under which a COLLAPSED pair reads greener than a healthy one: halving each half's width
  // shortens the card. The safety property the cure was sold on — each half 78.96 × 44 — was
  // measured, banked, and never gated. 1280×800 at `pointer: coarse` is the cell that owns it:
  // the branch renders AND a thumb is the instrument.
  test.use({
    viewport: { width: 1280, height: 800 },
    isMobile: true,
    hasTouch: true,
  });

  test("the pair branch keeps a 44px floor in BOTH dimensions, where the branch exists", async ({
    page,
  }) => {
    await loadSudoku(page);

    // WITNESS — the regime, before any number. A pair measured at `pointer: fine` is a
    // different box, and a pair measured on the phone's card does not exist at all.
    const regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      row: matchMedia("(min-width: 1024px)").matches,
      rail: !!document.querySelector(".controls-card .control-panel-wrap"),
    }));
    expect(regime, "the rail's own coarse cell").toEqual({
      coarse: true,
      row: true,
      rail: true,
    });

    /** Each half of every rendered pair, with the box a thumb actually gets. */
    const halves = () =>
      page.locator(".controls-card .ctrl-options.options-pair > .ctrl-btn").evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { text: el.textContent!.trim(), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
        }),
      );

    // VACUITY GUARD. `options.length === 2` is the DATA's rule, so the branch's population is
    // whatever the estate's option sets happen to be — exactly one group today (candidates
    // Off/On). If a future edit takes it to zero this row would pass by measuring nothing, and
    // that silence is the failure mode BC-M1 is about.
    const shipped = await halves();
    expect(shipped.length, "the pair branch must actually render here").toBeGreaterThanOrEqual(2);

    for (const c of shipped) {
      expect(c.w, `pair half "${c.text}" width`).toBeGreaterThanOrEqual(44);
      expect(c.h, `pair half "${c.text}" height`).toBeGreaterThanOrEqual(44);
    }

    // NEGATIVE CONTROL, both dimensions, in the same run. The floor is two-dimensional
    // because the collapse is: splitting a stacked chip into two halves spends WIDTH to buy
    // height, so a probe that only reads height can never see the cure fail in the direction
    // the cure moves. One control per dimension, each reverted before the next.
    const collapse = async (css: string, dim: "w" | "h") => {
      const tag = await page.addStyleTag({ content: css });
      await page.waitForTimeout(80);
      const broken = await halves();
      expect(
        Math.min(...broken.map((c) => c[dim])),
        `negative control (${dim}): the collapsed pair must fall under the floor`,
      ).toBeLessThan(44);
      await tag.evaluate((el) => el.remove());
      await page.waitForTimeout(80);
    };
    // Both controls strip `min-width`/`min-height` first ON PURPOSE. The 44px floor is not the
    // pair's own rule — it is `index.css`'s shared `(pointer: coarse)` block
    // (`.ctrl-btn { min-width: 2.75rem; min-height: 2.75rem }`, T4-P1's two-dimensional cure),
    // and a control that leaves it standing cannot push a half under the bar in either
    // dimension. Measured, not assumed: the first RED here read `Received: 44` with the basis
    // set to 40px, which IS the shared rule holding the line.
    await collapse(
      ".ctrl-options.options-pair > .ctrl-btn { min-width: 0 !important; flex: 0 0 40px !important;" +
        " padding-left: 0 !important; padding-right: 0 !important }",
      "w",
    );
    await collapse(
      ".ctrl-options.options-pair > .ctrl-btn { min-height: 0 !important; height: 40px !important;" +
        " padding-top: 0 !important; padding-bottom: 0 !important; line-height: 1 !important }",
      "h",
    );

    // and the shipped box is back after both controls — a control that leaks is a re-baseline.
    const after = await halves();
    expect(Math.min(...after.map((c) => c.w))).toBeGreaterThanOrEqual(44);
    expect(Math.min(...after.map((c) => c.h))).toBeGreaterThanOrEqual(44);
  });
});

// ── The card (coarse pointer) ───────────────────────────────────────────────────

/**
 * T5-W4 pass 6 — the coarse card moved BEHIND A DOOR on the portrait dock, and the selector
 * moved with it: `.mobile-board-width` was the deleted stacked twin's name for the same box,
 * and there is one card now (`#controls-drawer`'s own case). Every row below reads the CARD, so
 * every row below opens it first. It is a named call rather than a `beforeEach` because the
 * fold's rows — the ones that must hold with the sheet SHUT — live in other files and must
 * never inherit this.
 */
async function openCard(page: Page) {
  await page.locator(".drawer-tab").tap();
  await expect(page.locator("#controls-drawer .drawer-case")).toBeVisible();
  await page.waitForTimeout(700); // the Band-D glide's own clock, then settle
}

test.describe("coarse regime", () => {
  // The phone descriptor's TRAITS only — `browserName`/`defaultBrowserType` cannot be set in a
  // describe group (it would force a new worker), and the iPhone descriptor defaults to webkit,
  // which this chromium-only lane does not install. `(pointer: coarse)` is driven by
  // isMobile/hasTouch, not by the engine, which is the whole reason the swap is legitimate.
  const iphone = devices["iPhone 13"];
  test.use({
    viewport: iphone.viewport,
    deviceScaleFactor: iphone.deviceScaleFactor,
    isMobile: iphone.isMobile,
    hasTouch: iphone.hasTouch,
  });

  test("the coarse card: regime witnessed first, then two eyebrows and a 44px floor in BOTH dimensions", async ({
    page,
  }) => {
    await loadSudoku(page);
    await openCard(page);
    const panelSel = "#controls-drawer .control-panel-wrap";

    // WITNESS — three independent observables, asserted before any number is read. Without
    // this the whole test can pass at `pointer: fine` against a layout no phone ever shows.
    const regime = await page.locator(panelSel).evaluate((panel) => {
      const sub = panel.querySelector(".icon-btn:not(.deal-btn) .icon-sublabel");
      return {
        mqCoarse: matchMedia("(pointer: coarse)").matches,
        mqHover: matchMedia("(hover: hover)").matches,
        sublabelBlock: sub ? getComputedStyle(sub).display !== "none" : null,
      };
    });
    expect(regime).toEqual({ mqCoarse: true, mqHover: false, sublabelBlock: true });

    const names = await census(page, panelSel);
    expect(countAt(names, "eyebrow")).toBe(2);
    expect(countAt(names, "tape")).toBe(3);
    expect(countAt(names, "caption")).toBe(2);

    // The tap floor is two-dimensional. The candidates "On" chip was 43.2px WIDE — under the
    // floor in the one dimension a height-only rule can never reach.
    // Only the chips a thumb can reach: the closed tab's selector is `v-show`n away, so its
    // options measure 0×0 and a floor asserted over them would assert nothing.
    const chips = await page.locator(`${panelSel} .ctrl-btn`).evaluateAll((els) =>
      els
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: el.textContent!.trim(), w: r.width, h: r.height };
        })
        .filter((c) => c.w > 0 && c.h > 0),
    );
    expect(chips.length).toBeGreaterThan(0);
    for (const c of chips) {
      expect(c.w, `chip "${c.text}" width`).toBeGreaterThanOrEqual(44);
      expect(c.h, `chip "${c.text}" height`).toBeGreaterThanOrEqual(44);
    }
  });

  test("the heading lock holds on the CARD too — the regime its rail arm never visits", async ({
    page,
  }) => {
    await loadSudoku(page);
    await openCard(page);
    // B-5's lock (":212") runs at the default 1280 fine project and scopes itself to
    // `.controls-card`, so it only ever sees the RAIL's two h2s — the second arm was one
    // `test.use` away (pass-4 BC-m5). It does NOT travel by copying its selector, and that is
    // the finding this arm carries: `.section-heading` marks DIFFERENT ELEMENTS in the two
    // regimes. On the rail it is the `<h2>` itself; on the card the heading is
    // `<h2 class="mobile-heading-head">` WRAPPING the section tab (W3's APG disclosure shape —
    // heading wraps button, so an H-key walk lands on the heading and not inside a control),
    // and `.section-heading` is the ink-bearing `<span>` inside that button. Read with the
    // rail's selector this arm reports `span`, which is a probe defect, not an estate one.
    // The PROPERTY is what carries across the seam, so the property is what is asserted.
    const headings = await page
      .locator("#controls-drawer .section-heading")
      .evaluateAll((els) =>
        els.map((el) => {
          const h = el.closest("h1,h2,h3");
          return {
            headingTag: h?.tagName.toLowerCase() ?? null,
            hidden: h?.getAttribute("aria-hidden") ?? null,
            inHidden: !!el.closest("[aria-hidden='true']"),
            name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim(),
            // Recorded, not asserted away: the tab `<button>` inside the heading is a11y r1's
            // M9 row and belongs to that wave, not to this lock.
            inButton: !!el.closest("button"),
          };
        }),
      );
    expect(headings.length).toBe(2);
    for (const h of headings) {
      expect(h.headingTag).toBe("h2");
      expect(h.hidden).toBeNull();
      expect(h.inHidden).toBe(false);
      expect(h.name.length).toBeGreaterThan(0);
    }
    // The card's shape, pinned so a later flattening of the disclosure cannot pass this row by
    // reverting to the rail's markup unnoticed.
    expect(headings.every((h) => h.inButton)).toBe(true);
    // No hidden subtree on the card may contain a heading — the "both" the order forbade,
    // asserted where the card's own decorative `aria-hidden` population actually lives.
    const hidden = await page
      .locator("#controls-drawer [aria-hidden='true']")
      .evaluateAll((els) =>
        els.map((el) => ({
          cls: el.className.toString(),
          heading:
            el.tagName.toLowerCase().startsWith("h") || !!el.querySelector("h1,h2,h3"),
        })),
      );
    expect(hidden.length).toBeGreaterThan(0);
    for (const h of hidden)
      expect(h, `aria-hidden ${h.cls}`).toMatchObject({ heading: false });

    // NEGATIVE CONTROL — the lock passes on any tree that has no headings at all, and it
    // passed on both builds when it landed. Hide one heading's subtree in-page and the same
    // probe must report the violation it exists to catch.
    const broken = await page.evaluate(() => {
      const h = document.querySelector("#controls-drawer .section-heading")!;
      h.closest("h1,h2,h3")!.setAttribute("aria-hidden", "true");
      return [...document.querySelectorAll("#controls-drawer [aria-hidden='true']")].some(
        (el) => el.tagName.toLowerCase().startsWith("h") || !!el.querySelector("h1,h2,h3"),
      );
    });
    expect(broken, "negative control: a heading inside a hidden subtree must be seen").toBe(
      true,
    );
  });

  test("the teacher's well names the check state the card has never shown", async ({
    page,
  }) => {
    await loadSudoku(page);
    await openCard(page);
    const status = page.locator("#controls-drawer .check-status");
    await expect(status).toHaveAttribute("role", "status");
    // Default mode is on-demand with the snapshot armed by nothing yet — the stale sentence,
    // which is precisely the state `checkArmed` decays into and no control could report.
    await expect(status).toContainText("ask again");

    // Live: the sentence changes AND the pressure rung with it (the class the ink ladder keys).
    // Scoped to the well — `Off` is a label in two compartments, which is exactly why each
    // control group carries its own name.
    const well = page.locator('#controls-drawer .tray-well:has-text("teacher\'s")');
    await well.locator('.ctrl-btn:text-is("Live")').tap();
    await expect(status).toContainText("checking as you go");
    await expect(status).toHaveClass(/is-marking/);

    await well.locator('.ctrl-btn:text-is("Off")').tap();
    await expect(status).toContainText("not checking");
    await expect(status).not.toHaveClass(/is-marking/);
  });
});
