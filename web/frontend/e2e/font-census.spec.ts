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
  "Patrick Hand|Ctrl": "keycap; C is in the cut, t/r/l are not",
  "Patrick Hand|⌘": "keycap glyph U+2318",
  "Patrick Hand|⇧": "keycap glyph U+21E7",
  "Patrick Hand|/": "legend separator U+002F",
};

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
      const fam = face.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
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

test("no string renders in two faces except the ones this estate has ledgered", async ({
  page,
}) => {
  await loadSudoku(page);
  const { faces, mixed } = await page.evaluate(MIXED_FACE);

  // The census must actually have faces to read, or it passes by finding nothing.
  expect(faces, "declared subset faces").toEqual(
    expect.arrayContaining(["Fira Code", "Fraunces", "Patrick Hand"]),
  );

  const unledgered = mixed.filter((m) => !(`${m.face}|${m.shown}` in LEDGER));
  expect(
    unledgered.map((m) => `${m.face} · "${m.shown}" (${m.sel}) misses ${m.missing.join(" ")}`),
    "unledgered mixed-face strings",
  ).toEqual([]);

  // The status line is the instance this loop minted and cured; it is named here so a
  // regression cannot hide inside the ledger's tolerance for the pre-existing set.
  const status = (await page.locator(".check-status span[aria-hidden]").innerText()).trim();
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
  expect(seen, "negative control: the planted second-face string must be seen").toBeTruthy();
  expect(seen!.face).toBe("Patrick Hand");
  expect(seen!.missing).toContain("U+0058");
});
