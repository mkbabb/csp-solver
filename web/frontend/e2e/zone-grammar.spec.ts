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
  // The hover washi on the icon buttons KEEPS `role="tooltip"` — it is a transient
  // hover/focus description and the role is true of it. The distinction is the point.
  const transient = page.locator(
    ".controls-card .washi-label:not(.washi-tag):not(.washi-persistent)",
  );
  expect(await transient.count()).toBeGreaterThan(0);
  expect(await transient.first().getAttribute("role")).toBe("tooltip");

  // The surface the permanent tape names was a bare <div> with pointer handlers and NO
  // accessible name at all — diagnosed in pass 3, cured here. It is the zone separator, and
  // the gesture it carries has a keyboard twin (K), so the name says both.
  const peek = page.locator(".controls-card .peek-hold-surface");
  await expect(peek).toHaveAttribute("role", "separator");
  const name = await peek.getAttribute("aria-label");
  expect(name).toBeTruthy();
  expect(name!.toLowerCase()).toContain("peek");
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

// ── The card (coarse pointer) ───────────────────────────────────────────────────

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
    const panelSel = ".mobile-board-width .control-panel-wrap";

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

  test("the teacher's well names the check state the card has never shown", async ({
    page,
  }) => {
    await loadSudoku(page);
    const status = page.locator(".mobile-board-width .check-status");
    await expect(status).toHaveAttribute("role", "status");
    // Default mode is on-demand with the snapshot armed by nothing yet — the stale sentence,
    // which is precisely the state `checkArmed` decays into and no control could report.
    await expect(status).toContainText("ask again");

    // Live: the sentence changes AND the pressure rung with it (the class the ink ladder keys).
    // Scoped to the well — `Off` is a label in two compartments, which is exactly why each
    // control group carries its own name.
    const well = page.locator('.mobile-board-width .tray-well:has-text("teacher\'s")');
    await well.locator('.ctrl-btn:text-is("Live")').tap();
    await expect(status).toContainText("marking as you go");
    await expect(status).toHaveClass(/is-marking/);

    await well.locator('.ctrl-btn:text-is("Off")').tap();
    await expect(status).toContainText("not marking");
    await expect(status).not.toHaveClass(/is-marking/);
  });
});
