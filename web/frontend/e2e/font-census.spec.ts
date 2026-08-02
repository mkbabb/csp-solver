import { test, expect, type Page } from "@playwright/test";

/**
 * THE MIXED-FACE CENSUS (T4-P1, stage BC) — every visible string against the unicode-range of
 * the face it asks for.
 *
 * `scripts/check-font-coverage.mjs` reads ONE face (Fraunces) against a corpus written by hand.
 * It is a good gate and it is structurally blind twice over: it cannot see a face it was not
 * told about, and it cannot see a string nobody remembered to add. The zone grammar walked four
 * names into `--font-hand` and minted `board changed · Ask again` at the caption rank, whose
 * `·` and `A` are outside the Patrick Hand cut — so two of four states rendered part subset,
 * part system cursive, invisibly to all thirteen gates.
 *
 * The mechanism is the quiet one: a codepoint outside a declared `unicode-range` does not fail
 * to paint. The browser drops to the next family in the stack and the line comes out in two
 * faces, correctly, forever.
 *
 * This row reads the RENDERED page: it resolves each visible text node's first family against
 * that face's declared range (parsed from the live stylesheet, not from a source file), applies
 * the element's own `text-transform`, and compares the population of mixed-face strings to an
 * EXACT-MATCH LEDGER — the `filterBudget.ts` pattern. Never a ceiling: a new mixed string reds
 * even when an old one retires, and every row in the ledger carries the reason it is allowed.
 *
 * The ledger is the estate as MEASURED, not as hoped. Re-cutting two subset woff2 files is a
 * font job with an owner-declined byte cost attached (P1-W3); what this row buys is that the
 * population cannot grow silently again, and that the one instance this loop minted is gone.
 *
 * T5-W4b — WHAT THAT SENTENCE WAS WORTH WHEN IT WAS WRITTEN, and what it is worth now.
 * "The population cannot grow silently again" was written over a census of ONE game, ONE
 * viewport, ONE regime, checked in ONE direction (pass-4 BC-M2). Both halves are paid below.
 *   · SCOPE — `CELLS` is two games × two regimes and it is printed on the gate, so the claim
 *     travels exactly as far as the cells do and no further. Widening cost four page loads and
 *     found two real rows on the first run: KenKen's cage operators `+` (U+002B) and `÷`
 *     (U+00F7) are outside the Patrick Hand cut while the digits, `-` and `×` are inside it, so
 *     half the operators have always rendered in the system face mid-label — on every KenKen
 *     board and on the gallery's KenKen poster still. Thirteen gates and four passes of a
 *     sudoku-only census never saw them.
 *   · DIRECTION — the ledger is checked BOTH ways. A row no cell can produce is STALE and reds,
 *     unless it names its condition in `CONDITIONAL`. Before this, a coarse-only string could
 *     sit here forever without ever being rendered and nothing would say so.
 */

/** Strings that render in a second face today, with the reason each is tolerated. Keys are
 *  `face|shown`. Anything rendered and mixed that is NOT here fails the row. */
const LEDGER: Record<string, string> = {
  // ── Fira Code: the cut covers the SIZE and DIFFICULTY chips (4×4 · 9×9 · 16×16 · Easy ·
  // Medium · Hard) and nothing else. The live-zone chips joined the same component later and
  // were never in the corpus. Pre-existing, estate-wide, unledgered until now.
  "Fira Code|Normal": "live-zone chip; o/l/N outside the size+difficulty cut",
  "Fira Code|Corner": "live-zone chip; C/o/n outside the cut",
  "Fira Code|Center": "live-zone chip; C/n/t outside the cut",
  "Fira Code|Off": "live-zone chip; O/f outside the cut",
  "Fira Code|On": "live-zone chip; O/n outside the cut",
  "Fira Code|Ask": "live-zone chip; A/k outside the cut",
  "Fira Code|Live": "live-zone chip; L/v outside the cut",
  // ── Patrick Hand: the cut declares C/R/S as its only capitals. Every other capital in the
  // hand register falls through. Pre-existing.
  "Patrick Hand|Deal": "icon sublabel + washi; D outside the cut",
  "Patrick Hand|Fill": "icon sublabel; F outside the cut",
  "Patrick Hand|Undo": "icon sublabel; U outside the cut",
  "Patrick Hand|Hint": "icon sublabel; H outside the cut",
  "Patrick Hand|Easy": "closed-tab value (UI-12); E outside the cut",
  "Patrick Hand|Medium": "closed-tab value (UI-12); M outside the cut",
  "Patrick Hand|Hard": "closed-tab value (UI-12); H outside the cut",
  // ── the keyboard legend is literally a set of capital keycaps, and a keycap that renders in
  // the system face still reads as the key it names.
  "Patrick Hand|K": "keycap",
  "Patrick Hand|H": "keycap",
  "Patrick Hand|P": "keycap",
  "Patrick Hand|Z": "keycap",
  // T5-W3 row 3.6 (a11y r1 L10): the crib grew the two bare keys it never named — G (games)
  // and D (deal) — so the keycap class gains its 5th and 6th members under the identical,
  // already-adjudicated reason. Same class, same fallback, no new class: the exact-match rule
  // is intact and a genuinely new mixed string still reds. Neither letter is in the Patrick
  // Hand cut ("Deal" at :44 has been ledgered for D since T4-P1), and re-cutting the woff2 is
  // the owner-declined byte cost this ledger exists to stand in for.
  "Patrick Hand|G": "keycap",
  "Patrick Hand|D": "keycap",
  "Patrick Hand|Ctrl": "keycap; C is in the cut, t/r/l are not",
  "Patrick Hand|⌘": "keycap glyph U+2318",
  "Patrick Hand|⇧": "keycap glyph U+21E7",
  "Patrick Hand|/": "legend separator U+002F",
  // ── T5-W4b (pass-4 BC-M2): the rows the ONE-GAME census could not see. Widening to a second
  // game found them on the first run. KenKen inks its cage target in the hand face and the cut
  // holds the DIGITS and holds `-` (U+002D) and `×` (U+00D7) — but not `+` and not `÷`. So two
  // of the four operators fall through mid-label on every KenKen board and on the gallery's
  // KenKen poster still: the target reads in Patrick Hand and its operator in the system face.
  // Pre-existing, estate-wide, and the same owner-declined woff2 re-cut as every row above.
  "Patrick Hand|cage-op U+002B": "kenken cage operator '+'; the digits ARE in the cut",
  "Patrick Hand|cage-op U+00F7": "kenken cage operator '÷'; same class as '+'",
};

/** Ledger rows the CELL SET below cannot produce, each with the condition that would produce
 *  it. The backward check exempts exactly these, by key — a row that stops rendering for any
 *  OTHER reason still reds as stale, which is the direction the row was missing. */
const CONDITIONAL: Record<string, string> = {
  "Patrick Hand|Medium": "closed-tab value; every cell below deals EASY",
  "Patrick Hand|Hard": "closed-tab value; every cell below deals EASY",
  "Patrick Hand|Ctrl": "keycap; the legend draws ⌘ on Apple platforms and Ctrl elsewhere",
};

/** Rows the cells produce on SOME deals. KenKen mints its cages per deal, so a given board may
 *  carry no `+` or no `÷` at all — the backward arm redded once per engine on exactly these two
 *  keys (CH-63 roster), on a puzzle, not a regression. Exempt from the backward check like
 *  CONDITIONAL, but CONDITIONAL's absence assertion cannot hold for them: present is the
 *  forward arm's business, absent is the deal's. */
const PER_DEAL = new Set(["Patrick Hand|cage-op U+002B", "Patrick Hand|cage-op U+00F7"]);

/** KenKen cage targets are GENERATED per deal — `3+`, `7+`, `6÷` — so an exact-match row over
 *  the whole label is unstable by construction: a different deal mints a different string and
 *  the gate would red on a puzzle, not on a regression. The row is keyed on the codepoint that
 *  actually falls out of the cut instead. This is the ONE normalized key class; everything else
 *  stays exact-match, and the row below proves the pattern cannot swallow a fixed string. */
const CAGE_LABEL = /^\d+\s*[+\-×÷]$/u;

const ledgerKey = (m: { face: string; shown: string; missing: string[] }) =>
  CAGE_LABEL.test(m.shown)
    ? `${m.face}|cage-op ${m.missing.join(" ")}`
    : `${m.face}|${m.shown}`;

/** THE SCOPE, PRINTED ON THE GATE. Two games × two regimes — the census is no longer "one
 *  game, one viewport, one regime" and it no longer has to be believed about the estate on the
 *  strength of sudoku's rail. Widening cost four page loads and bought two real rows. */
const CELLS = [
  { id: "sudoku · fine rail 1280×800", game: "sudoku", w: 1280, h: 800, coarse: false },
  { id: "sudoku · coarse card 390×844", game: "sudoku", w: 390, h: 844, coarse: true },
  { id: "kenken · fine rail 1280×800", game: "kenken", w: 1280, h: 800, coarse: false },
  { id: "kenken · coarse card 390×844", game: "kenken", w: 390, h: 844, coarse: true },
] as const;

/** Visible text nodes whose face is a declared subset, and the codepoints that fall out of it.
 *  Screen-reader-only text is excluded on purpose: it is never painted, so it has no face. */
const MIXED_FACE = () => {
  const ranges: Record<string, Set<number>> = {};
  for (const sheet of [...document.styleSheets]) {
    let rules: CSSRule[];
    try {
      rules = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const r of rules) {
      const face = r as CSSFontFaceRule;
      if (!face.style || !face.style.getPropertyValue("unicode-range")) continue;
      const fam = face.style
        .getPropertyValue("font-family")
        .replace(/["']/g, "")
        .trim();
      const set = new Set<number>();
      for (const m of face.style
        .getPropertyValue("unicode-range")
        .matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)) {
        const a = parseInt(m[1], 16);
        const b = m[2] ? parseInt(m[2], 16) : a;
        for (let c = a; c <= b; c++) set.add(c);
      }
      if (set.size) ranges[fam] = set;
    }
  }

  const out: { face: string; shown: string; missing: string[]; sel: string }[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const text = n.nodeValue;
    if (!text || !text.trim()) continue;
    const el = n.parentElement;
    if (!el) continue;
    // DEV-ONLY CHROME IS NOT THE ESTATE. `FilterTuner` mounts behind `import.meta.env.DEV` and
    // is absent from every artifact that deploys, but this spec runs on the dev server, so its
    // `fx` badge was censused as a Fira Code string missing U+0066/U+0078 — a red at HEAD that
    // no shipped surface can produce (3/3 on the base tree, T4-P1 pass 4 Lane A). It is an
    // async component, which is why it raced its way past the run that landed the spec.
    if (el.closest(".tuner-toggle, .tuner-panel")) continue;
    const box = el.getBoundingClientRect();
    // sr-only is a 1px clip: painted text has a box a reader could see.
    if (box.width < 3 || box.height < 3) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    const set = ranges[fam];
    if (!set) continue;
    let shown = text;
    if (cs.textTransform === "lowercase") shown = text.toLowerCase();
    if (cs.textTransform === "uppercase") shown = text.toUpperCase();
    const missing = [...new Set([...shown.trim()])].filter(
      (ch) => ch !== " " && !set.has(ch.codePointAt(0)!),
    );
    if (missing.length)
      out.push({
        face: fam,
        shown: shown.trim(),
        missing: missing.map(
          (c) => "U+" + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0"),
        ),
        sel:
          el.tagName.toLowerCase() +
          (typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
      });
  }
  return { faces: Object.keys(ranges).sort(), mixed: out };
};

async function loadSudoku(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

test("the ledger holds BOTH directions across two games and two regimes", async ({
  browser,
}) => {
  // BC-M2: "the population cannot grow silently again" was written over a census of one game,
  // one viewport, one regime, checked in one direction — so a coarse-only string could sit in
  // the ledger forever without ever being rendered, and a whole second game's chrome was
  // invisible to it. Both halves are paid here.
  const seen = new Map<string, string[]>();
  const unledgered: string[] = [];
  const facesPerCell: string[][] = [];

  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      isMobile: cell.coarse,
      hasTouch: cell.coarse,
      baseURL: test.info().project.use.baseURL,
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`./?game=${cell.game}&difficulty=EASY`);
      await p.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
      await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      // The regime is witnessed, not assumed — a coarse cell measured at `pointer: fine`
      // censuses a layout no phone shows (the standing rule in zone-grammar).
      expect(
        await p.evaluate(() => matchMedia("(pointer: coarse)").matches),
        `${cell.id}: regime witness`,
      ).toBe(cell.coarse);
      // T5-W4 pass 6 — THE PHONE ARM OPENS THE DRAWER, and it must. On the portrait dock the
      // card's strings are behind the door: unopened, this census would read the fold alone
      // and the BACKWARD direction would then retire every ledger row the card owns as
      // "stale". A census that cannot see a surface cannot gate it either way.
      if (cell.coarse) {
        const tab = p.locator(".drawer-tab");
        if (await tab.isVisible()) {
          await tab.click();
          await expect(p.locator("#controls-drawer .drawer-case")).toBeVisible();
        }
      }
      // Settle is POLLED, never slept (the §2 law; CH-63 trigger-1 order for THIS row —
      // run 30749219061 webkit: 900ms of sleep under runner contention left a producing
      // cell unread and the BACKWARD direction called a live ledger row stale). Fonts
      // resolve first, then the census is its own settle condition: two consecutive
      // identical reads, 250ms apart. A genuinely stale row still never appears in any
      // settled census, so the gate's teeth are untouched — only the sleep is gone.
      await p.evaluate(() => document.fonts.ready);
      let census = await p.evaluate(MIXED_FACE);
      await expect
        .poll(
          async () => {
            const next = await p.evaluate(MIXED_FACE);
            const settled = JSON.stringify(next) === JSON.stringify(census);
            census = next;
            return settled;
          },
          { timeout: 15000, intervals: [250, 250, 250, 500] },
        )
        .toBe(true);
      const { faces, mixed } = census;
      facesPerCell.push(faces);
      for (const m of mixed) {
        const k = ledgerKey(m);
        seen.set(k, [...(seen.get(k) ?? []), cell.id]);
        if (!(k in LEDGER))
          unledgered.push(`${cell.id} — ${k} (${m.sel}) misses ${m.missing.join(" ")}`);
      }
    } finally {
      await ctx.close();
    }
  }

  // The census must actually have faces to read in EVERY cell, or a cell passes by finding
  // nothing and the widening is decoration.
  for (const [i, faces] of facesPerCell.entries())
    expect(faces, `${CELLS[i].id}: declared subset faces`).toEqual(
      expect.arrayContaining(["Fira Code", "Fraunces", "Patrick Hand"]),
    );

  // ── FORWARD: nothing renders mixed that the ledger has not accounted for.
  expect(unledgered, "unledgered mixed-face strings").toEqual([]);

  // ── BACKWARD: nothing sits in the ledger that no cell can produce. A ledger that can only
  // grow is a list, not a gate; this is the direction pass 4 named and pass 3's C11 predicted.
  const stale = Object.keys(LEDGER).filter(
    (k) => !seen.has(k) && !(k in CONDITIONAL) && !PER_DEAL.has(k),
  );
  expect(stale, "ledger rows no cell produced — retire them or state the condition").toEqual(
    [],
  );

  // The exemptions are exemptions, not blanket cover: each conditional row must still be
  // ABSENT here, so a row that starts rendering unconditionally loses its excuse.
  for (const k of Object.keys(CONDITIONAL))
    expect(seen.has(k), `${k} is exempt because: ${CONDITIONAL[k]}`).toBe(false);

  // NEGATIVE CONTROL for the backward half — the check must be able to name a stale row.
  const withDecoy = { ...LEDGER, "Patrick Hand|Nonesuch": "control" };
  expect(
    Object.keys(withDecoy).filter(
      (k) => !seen.has(k) && !(k in CONDITIONAL) && !PER_DEAL.has(k),
    ),
    "negative control: an unproducible ledger row must be reported",
  ).toEqual(["Patrick Hand|Nonesuch"]);

  // NEGATIVE CONTROL for the ONE normalized key class — the cage pattern must not swallow a
  // fixed string. `9×9` and `16×16` are size chips and stay exact-match forever.
  for (const fixed of ["9×9", "16×16", "Off", "Deal", "3"])
    expect(CAGE_LABEL.test(fixed), `cage pattern must not match "${fixed}"`).toBe(false);
  for (const cage of ["3+", "12×", "6÷", "2-"])
    expect(CAGE_LABEL.test(cage), `cage pattern must match "${cage}"`).toBe(true);
});

test("no string renders in two faces except the ones this estate has ledgered", async ({
  page,
}) => {
  await loadSudoku(page);
  const { faces, mixed } = await page.evaluate(MIXED_FACE);

  // The census must actually have faces to read, or it passes by finding nothing.
  expect(faces, "declared subset faces").toEqual(
    expect.arrayContaining(["Fira Code", "Fraunces", "Patrick Hand"]),
  );

  const unledgered = mixed.filter((m) => !(ledgerKey(m) in LEDGER));
  expect(
    unledgered.map(
      (m) => `${m.face} · "${m.shown}" (${m.sel}) misses ${m.missing.join(" ")}`,
    ),
    "unledgered mixed-face strings",
  ).toEqual([]);

  // The status line is the instance this loop minted and cured; it is named here so a
  // regression cannot hide inside the ledger's tolerance for the pre-existing set.
  const status = (
    await page.locator(".check-status span[aria-hidden]").innerText()
  ).trim();
  expect(status.length).toBeGreaterThan(0);
  expect(mixed.some((m) => m.shown === status)).toBe(false);

  // NEGATIVE CONTROL: plant a string with a codepoint outside the hand cut and the census
  // must see it. Without this the row passes on any page with no text at all.
  const planted = await page.evaluate(() => {
    const host = document.querySelector(".check-status") as HTMLElement;
    const p = document.createElement("span");
    p.textContent = "Xylophone";
    p.style.fontFamily = "var(--font-hand)";
    p.style.fontSize = "16px";
    host.appendChild(p);
    return true;
  });
  expect(planted).toBe(true);
  const after = await page.evaluate(MIXED_FACE);
  const seen = after.mixed.find((m) => m.shown === "Xylophone");
  expect(
    seen,
    "negative control: the planted second-face string must be seen",
  ).toBeTruthy();
  expect(seen!.face).toBe("Patrick Hand");
  expect(seen!.missing).toContain("U+0058");
});
