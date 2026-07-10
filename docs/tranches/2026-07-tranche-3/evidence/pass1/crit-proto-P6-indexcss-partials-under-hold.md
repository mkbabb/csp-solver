# Critique — `proto-P6-indexcss-partials-under-hold`

**Lane:** `crit-proto-P6-indexcss-partials-under-hold` · **Posture:** REFUTE-BY-DEFAULT
**Target report:** `…/pass1/proto-P6-indexcss-partials-under-hold.md`
**Verdict in one line:** The prototype is unusually rigorous — I **independently re-derived its
strongest claims and they hold**. The refutation is therefore not on *correctness* (nearly every
material technical claim CONFIRMED) but on **wave-readiness**: two unresolved governance/shape
gates (owner sign-off Q9 + the KISS include-or-drop ruling) and one unbuilt companion guard cap
convergence well below "author verbatim."

---

## Independent re-derivation (I did not take the report on faith)

Every check below was run against the live tree and the prototype's own artifact directory
(`…/pass1/p6/`) + its worktree (`.claude/worktrees/wf_8f3bd831-d64-15/`).

| # | Claim | My re-derivation | Class |
|---|---|---|---|
| 1 | Compiled CSS byte-identical, sha `ce4c09…` baseline vs split | `shasum -a256 p6/before/index.css p6/afterB2/index.css` → **both `ce4c092b50a271e8472e1dfa82d6467e4f01a745a58a05f3d08eef21986d0fa7`**, matches the report's stated hash exactly | **CONFIRMED** |
| 2 | `url()` rebase gotcha is real (first split broke fonts) | `p6/afterB/index.css` (pre-fix) hashes **`42c6c83f…` — DIFFERENT**; `afterB2` (post-`../fonts/` fix) matches baseline. Two distinct hashes = a genuine build/debug cycle, not a fabricated pass | **CONFIRMED** |
| 3 | Split theme.css rewrites `./fonts/`→`../fonts/` | worktree `css/theme.css:42,51,60` all `url('../fonts/…woff2')` | **CONFIRMED** |
| 4 | Runtime `getComputedStyle`/styleSheets probe zero-diff | `shasum` of `probe_baseline.json` == `probe_split.json` → **both `fac05b99…`** (byte-identical, 13,269 B each) | **CONFIRMED** |
| 5 | 5-line `@import` manifest, `@font-face` moved into a partial | worktree `src/assets/index.css` is exactly the 5-line manifest (136 B); `css/theme.css:36,46,55` hold the 3 `@font-face` blocks | **CONFIRMED** |
| 6 | C1/C2 rules stay in `@layer utilities` | worktree `css/utilities.css`: `@layer utilities`@10, `.sheet-laminate`@51, PRT arm@62, contrast arm@70, `.sudoku-cell:focus-within`@132 | **CONFIRMED** |
| 7 | Animation rules are *interleaved* (can't extract a contiguous `animations.css`) | HEAD `index.css`: `.solve-failure`@318 → `@keyframes shake`@331 → `@keyframes cell-reveal`@338 → `.cell-reveal-animated`@345 → `.sudoku-cell:focus-within`@352 → `.fira-code`@360 → reduced-motion `@media`@374. Animations sit **between** non-animation utilities; reduced-motion is last. Contiguous extraction would reorder | **CONFIRMED** |
| 8 | `@font-face` must leave index.css (CSS `@import`-first rule) | CSS spec: `@import` must precede all rules except `@charset`/`@layer` statements; `@font-face` then `@import` is invalid. Correction to the charter sketch is sound | **CONFIRMED** |
| 9 | e2e "33 passed" | `9 + 4 + 6 + 7 + 7 = 33` `test(` blocks across the 5 `.spec.ts` files — count matches exactly | **CONFIRMED (count)**; the *run* itself taken on report's word |
| 10 | Pixel arm confounded; screenshots gitignored | `git ls-files e2e/` returns no `screenshots/` entries; round9 uses capture-only `page.screenshot`. Non-determinism claim (pencil-boil geometry + randomized generation) is credible | **CONFIRMED-by-design** |
| 11 | Hold + lifting condition (`C-deferred-foldin.md:108`) | Read the row: *"a cascade-layer proof or a visual-diff pass lifts the hold — HELD at W8 (`c14995eb`)… an SFC `<style>` extraction changes their cascade layer."* The report's quotation and its key insight — the hold was against an **SFC `<style>` extraction**, and an `@import` split is a *weaker, layer-preserving* move — are accurate | **CONFIRMED** |

**The core gate is sound.** Claim: "identical compiled bytes ⇒ identical `document.styleSheets`,
`@layer` order, rule order, every `getComputedStyle`." This is valid — if the sole rendering input
(the stylesheet) is bit-for-bit identical, everything downstream is identical. And the byte-identity
is not asserted, it is **re-derived** (row 1). This is a genuinely stronger artifact than the
"visual-diff pass" the hold names as the alternative.

---

## Corrections & the one mechanism the wave must NOT carry verbatim

**CORRECTED — "byte-identical *by construction*" overstates the mechanism.** The report frames
identity as "placing the `@import`s in source order makes the inlined stream reproduce the original
byte-for-byte." That is not literally what happens: the split **drops 3 blank separator lines**
(original lines 3, 220, 381 fall between partials, in neither), and `@import` inlining + esbuild
minification re-serialize and normalize whitespace. Identity holds because the **minified output**
collapses those differences, not because the concatenation equals the source. The *result*
(re-derived sha match) is correct; the *a-priori certitude* ("there is no rendering input left that
could differ") must be softened to "empirically byte-identical minified output" before it enters a
wave. Line counts corroborate: theme 216 + utilities 160 + print 73 = **449** partial lines +
5 manifest = 454, but the original 454 *includes* the dropped blanks — the arithmetic only closes
under whitespace normalization.

**Minor doc nits (non-material):** print.css range cited `382,455` but the file is 73 lines (455 is
EOF/blank) — off-by-one. The manifest annotation (report line 41) attributes `@layer base{*,body}`
to `theme.css`, but that block actually lives in `utilities.css:1-9` (original 221-228). Neither
touches byte-identity.

---

## What genuinely blocks authoring (the real refutation — readiness, not correctness)

1. **Q9 owner sign-off is UNRATIFIED and is a hard gate.** The hold's lifting condition
   (`C-deferred-foldin.md:108`) is owned by the **FE maintainer** and names *"a cascade-layer proof
   or a visual-diff pass."* The prototype offers a **compiled-byte-identity proof** and argues it is
   *stronger than* the "cascade-layer proof" wording — plausibly true, but it is a **proof-substitution
   the hold owner has not accepted**. The prototype itself lists this as its top open ask. Until the
   FE maintainer ratifies that byte-identity satisfies the hold, the row cannot be authored. This is
   governance, not code, and it is unresolved.

2. **KISS bar: net-zero benefit — the include-or-drop decision is contested.** The prototype
   *concedes* (report §"Is the split even worth it?") that the compiled output is identical ⇒ **no
   runtime, size, or cascade benefit — pure file hygiene** (454 ln → 5-line manifest + 3 partials),
   and that it *introduces* a `url()`-rebase silent-404 footgun. The owner's mandate targets *"long
   dirs always broken into encapsulated modules."* A **single, densely-sectioned 454-line CSS file
   is not a long-*directory* crisis** — it's one well-commented file. Whether P6 is authored at all
   (vs dropped as below-threshold) is a live shape doubt; the prototype ranks it **LAST** in the FE
   priority list precisely for this reason. A REFUTE-posture reading: the default should be **drop**,
   not author.

3. **The `url()`-rebase guard is specified but UNBUILT.** The report correctly flags that W-F must
   land the `../fonts/` rewrite *"with a build-output font-URL assertion or a smoke check, not on
   faith"* — a silent-404 that builds clean and only fails at runtime font-fetch. That guard is a
   TODO, not a prototype. Safe landing requires designing it; it is not yet part of the settled
   artifact.

4. **Minor open items** (each small): content-hash `index-Bykbkkbm.css` and the "33 passed" *run*
   were not re-executed by me (source-sha and test-count were re-derived; the build/test invocations
   stand on the report's word — expensive to rebuild, main tree has no `node_modules`). HMR/watch-
   rebuild `@import`-ordering parity is flagged-but-unconfirmed by the report.

---

## Convergence

**52%.** The technical prototype is essentially bulletproof and I confirmed it by re-derivation — but
convergence measures *settled-and-ready to author into a wave verbatim*, and that is dominated by two
unresolved decisions about **whether and how** to author, plus an unbuilt guard.

Deductions from 100:
- **−18 — Q9 owner sign-off unratified.** The hold owner (FE maintainer) has not accepted
  byte-identity as satisfying the hold's "cascade-layer proof" wording; a governance gate, open.
- **−15 — KISS include-or-drop unresolved.** Net-zero runtime/size/cascade benefit + a new footgun;
  a 454-line well-sectioned file is arguably below the "long module" threshold. The prototype ranks
  it last and openly questions its worth. Default-drop is defensible.
- **−8 — `url()`-rebase guard specified but unbuilt.** Safe landing requires the build-output
  font-URL assertion/smoke check; not prototyped.
- **−4 — "byte-identical by construction" mechanism mis-stated** (identity is a minified-output
  property, not source-concatenation equality); correct result, imprecise reasoning to carry into a
  wave.
- **−3 — content-hash + "33 passed" build/test runs not independently re-executed** (source-sha and
  test-count were re-derived; the runs themselves taken on report's word).

= 52.

---

## Kill list (claims that must die before any authoring)

1. **"Verdict: GO."** Downgrade to *GO-conditional* on (a) FE-maintainer ratification that
   byte-identity satisfies the hold (Q9), and (b) a KISS include-or-drop ruling. It is not
   unconditionally ready.
2. **"identical compiled bytes … by construction … there is no rendering input left that could
   differ."** Keep the empirical sha proof; strike the a-priori "by construction" certitude — the
   identity is a *minified-output* property (whitespace normalization + `@import` inlining drop 3
   blank lines), not a concatenation identity.
3. **Any implication the pixel/visual-diff arm "should be retired."** That is the hold owner's call
   under Q9, not the prototype's to declare. The prototype may *offer* byte-identity as the stronger
   substitute; it may not *retire* the alternative the hold explicitly names.
