# Pass 9 · batch 0 · the chair's instruments — HOMES v2

| Bank | sha1 | bytes | `--shortstat` | `git apply --check` |
|---|---|---|---|---|
| `homes.diff` (vs `74a2b5d9`) | `1f70cfda9b672bb600378c00b4a7fa4900ec91d0` | 437,922 | 13 files changed, 9808 insertions(+), 1 deletion(-) | 0 on a fresh `git archive 74a2b5d9` (13 paths) · 0 on a fresh `git archive 1d0dc4fd` (13 paths) |
| `homes.on-WAVE.diff` (vs the WAVE union, tree `acb9c08e`) | `a0f8e6f3cf2c77a62c8f85eea9c3b10df4c2cbef` | 174,269 | 11 files changed, 2484 insertions(+), 239 deletions(-) | 0 on `74a2b5d9` + `pass8/integrate/WAVE.diff` (11 paths) |

- Both are `--binary`, cut through a temporary index, product paths only. Applied for real, every landed path equals the work tree byte for byte (13/13 and 11/11). Index trees: `homes.diff` → `d17813ba`; on the WAVE → `acde977b`.
- `homes.on-WAVE.diff` lands the same library on the union: `shape-census.mjs` and `shape-census.d.mts` are MODIFY there, and `knip.json` keeps the union's entry (not in the diff). `paint-lib.mjs` is byte-identical on the union, so it is absent.
- At open, the work tree (detached `74a2b5d9`) cut through a temporary index equalled homes v1 (`a1d8adeb`): no difference to declare.
- Grep of both banks and this README for the session scratch and temp paths, the durable scratch and any dot-directory: 0 hits.
- No commit, no push, no stash, no deploy, no npm install. No git ran on main or in the control tree beyond the incident below.

## Numbers first

- **shape-census:** 136/136 self-test rows, 83/83 clauses planted and each red when deleted; the same rows on homes v1 read 91/136 (45 fail) — the born-RED. `--tree` on the control: 14 FAIL, exit 2 (the anchor is absent at `74a2b5d9`; v1 reads the same); on the WAVE union: exit 0.
- **Browser libraries:** every self-test exit 0 in chromium AND webkit, DPR 1 and 2, light and dark; sabotage batteries glyph 4/4, edge 8/8, postpaint 5/5, rest 2/2 in both engines.
- **The RAF-mover false red:** cured; 32/32 clean reads GREEN per engine under `--reps 16`.
- **Served rows:** control `:4256` and tree `:4233` exits identical on every row, both engines.
- **Served CSS:** 7/7 files byte-identical to the control after the last edit (T9-R6).
- **The WAVE union:** 7 consumers byte-identical in output on the union's library and on homes v2; `typecheck:e2e` needs RULE's three-line spec cure.
- **π and AA:** this lane moved no product byte (`src/` untouched), so π vs `74a2b5d9` is nil by construction; the served rows' paint reads (AA) are above, equal on control and tree. filterBudget untouched (9).

## 1 · `web/frontend/scripts/shape-census.mjs` (+ `shape-census.d.mts`)

- **Source families.** ERASE, SIX, FACE, TAPE, RULE, WAVE, TIN, WALK, LEDGER, LIVE, TAB-PEN, GRAPHITE and the chair (registry-v8 §2.4 and §8.1); LADDER's three pass-8 home edits, found on the WAVE union (below).
- **Clauses.** 83, up from v1's 40; 136 self-test rows. Every clause has a plant in the ONE self-test (`--self-test`) and a row under `SHAPE_SABOTAGE=<id>` (`--sabotage-battery`).
- **The 43 new clauses, by family.**
  - ERASE: `register-any`, `prop-escape` (property names and `@property` preludes decoded), `module-graph` (the walker follows JS, TS and Vue relative imports, `?query` included, to CSS and code outside `src/`), `register-script` (folded text, bracket call, `.bind` alias, destructured alias, `@property` text in a string).
  - SIX: `alias` (with the object-argument spread).
  - FACE: `script-shorthand`, `script-style-object`, `svg-presentation`, `tw-var-shorthand`; check 7's `setprop-shorthand` and `font-binding` (`fontFaces`).
  - TAPE: `closed-context`, `class-ternary` (RULE's plant grafted on), `self-close`, `ws-combinator`, `param-carried`, `class-writes` (`classWrites`).
  - WAVE: `tok-param-carried`.
  - TIN: `fold-hole`, `fold-int`, `fold-text` (`foldText`), `tw-palette` (`twPalette`), `channel-arity`.
  - WALK: `style-cast`, `literal-nothrow` (with a `color-mix(in srgb, …)` one-arm plant only it sees), `tok-string-rule` (the string arm reads whole rules), `typed-om` (`attributeStyleMap.set/append`).
  - LEDGER: `css-wide-var`, `supports-container` (`evalSupports`; sites carry `sure` beside `regimes`), `seat-element`, `r4-element`.
  - LIVE: `masked-const` (`maskedDefaults` reads a const binding; a bare hole prints UNRESOLVED).
  - TAB-PEN: `html-inert` (`htmlLinks` drops template, noscript, script and style), `link-allow` (`LINK_ALLOW` per rel), `base-red`.
  - GRAPHITE: `publisher-split` (`publishers` / `unresolvedSites`: a computed-key site is resolved or printed UNRESOLVED, never counted as a publisher).
  - LADDER (not in §2.4's list; carried INTO the home inside LADDER's delta and live on the WAVE union, where `check-motion-bands.mjs` reads them): `custom-case` (a custom property's name is never kebab-cased), `value-parens` (a `setProperty` value keeps its own parentheses), `clock-alias` (`clockReads(text, alias, {bare: true})`), and `clockReads` returns `op` with a logical `||`/`&&` read as a fallback, never arithmetic. Without them the union's `lint:bands` reds 15 rows.
  - Chair: `class-sure` (found the same way once `hole-boundary` landed: the S11 plant `.margin-note:not(.is-spent)` read as never reaching `<p class="margin-note" :class="[tone, { 'is-spent': spent }]">`, because a bound class counted as certain under `:not()`; `templateElements` now returns `sure`, the static `class=` only); `hole-boundary` (found by `--tree` on the union: HandwrittenLogo's pose sheet `${FONT_FACE.value}text{…}` read as the selector `<hole>text`, which may match any element, so R4's element-keyed max took the logo's 52 px × 1.3 = 67.6 px as the voice's line); `u-escape4` (TIN's `unescapeJs` re-cut: one pass, `\uXXXX` takes exactly four hex digits, `\u{…}` one to six), `color-spaces` (xyz, xyz-d65, xyz-d50, a98-rgb, rec2020, prophoto-rgb).
- **`sources()` is the ONE walker.** `componentSites` now reads `files ? followImports(files) : sources(fe)`; no reader keeps a private walk.
- **Types.** `shape-census.d.mts` types every export with its option names; there is no `[k: string]: unknown`. CTRL-FACE's narrow `followImports` copy is folded in.

## 2 · `web/frontend/e2e/lib/glyph-pop.mjs` (+ `glyph-pop.d.mts`)

- **Source families.** SIX (`runClip`), COUNT (the FILE plants, gap 1), the chair (§8.1: the low-quantile core, the clamp, the control-anchored bound, the control's G4 tolerance).
- **Clauses.** `GLYPH_CLAUSES` = `G5core`, `G3clamp`, `anchor`, `g4tol`; `GLYPH_SABOTAGE=<id>` switches one off; `--sabotage-battery` spawns `--self-test` per clause.
  - `G5core`: each glyph's core is the low quantile (`g5Q`, default 0.5) of its 4-neighbour-eroded interior, so a 1-px comb at 25 % reds G5 alone (`#g-long` G0COMB_a25).
  - `G3clamp`: `boundOf` never puts G3 above 1 (a reference ≥ 0.95 bounds at `min(frac + slack, frac + (1 − frac)/2)`).
  - `anchor`: `glyphGate({control})` cuts the G3 bound from the CONTROL's read. The FILE plants OPA80F and COMB are the product's own CSS; the row is pinned on G3 itself, since an own bound sits above its own fraction and never can red G3.
  - `g4tol`: G4 tolerates only the control's own low columns (`tolerate`, printed as `g4Tolerated`).

## 3 · `web/frontend/e2e/lib/edge-bands.mjs` (+ `edge-bands.d.mts`)

- **Source families.** FACE (the relative-band clause), RULE and SELF (the own-fill exclusion), the chair.
- **Clauses.** `EDGE_CLAUSES` += `B6` and `ownfill`.
  - `B6`: every band's painted depth ≥ `relBand` (0.5) × the deepest band's; `#f-uneven` (5/5/5/2 px) reds B6 alone.
  - `ownfill`: B3's depth skips pixels within the subject's own fill tint (alpha ≤ 0.25); `#f-fill` (1 px outline over a 14 % tint) reads 2.13 px deep without it (GREEN at the 2.1 px floor, the hole) and reds B3 with it.
- **Not folded here.** SELF's `authoredStroke` (the drawn-frame roster) — SELF's own.

## 4 · `web/frontend/e2e/lib/postpaint.mjs` (+ `postpaint.d.mts`)

- **Source families.** FIVE (`len:`), SIX (`range:`), the chair (the RAF-mover false-red cure and ct-at-frame-1).
- **Clauses.** `PP_CLAUSES` = `F1`, `F1ct`, `CI`, `key-inraf`, `stale`; `POSTPAINT_SABOTAGE=<id>`.
  - The mechanism of the ~1-in-8 false red: Chromium's IntersectionObserver entry can stamp a frame late, keying frame 1 after the mover's first painted frame; WebKit's post-rAF read can be stale (one frame behind). Both read a clean RAF-mover as SKIP.
  - The cure: `kPaintOf` = the earlier of the IO stamp and the first in-rAF frame that holds the animation (`key-inraf`); a stale post read is replaced by its in-rAF twin and counted (`stale`); F1 splits into position (`F1`) and current time at frame 1 (`F1ct`, tolerance 4 ms).
  - Plants: SKIP (150 ms), FROM40, F2, the eased mover `e` (200 px, `cubic-bezier(0.7,0,1,1)`) with skip16 (ct only), the TASK-mover born-RED. Unit rows U1–U4 pin each clause without a browser.
- **Not folded.** VERB's `kPaint` as cut (its critic read 1/1 RED on a non-deterministic HEAVY plant); the cure above replaces it.

## 5 · `web/frontend/e2e/lib/rest-probes.mjs` (+ `rest-probes.d.mts`)

- **Source family.** FACE (the hand-rolled `PANEL_H_AT_REST`), the chair (the height-stable at-rest clause).
- **Clauses.** `REST_CLAUSES` = `confirm`, `anim`; `REST_SABOTAGE=<id>`.
  - `heightAtRest(page, {sel, root, frames, confirmMs, timeout})` returns `{h, rested, frames, restarts}`: the height holds for `frames` frames with no running animation under `root`, then a read `confirmMs` later agrees, or the window restarts.
  - Rows: CLEAN, LATE (a height change after the first quiet window: `confirm`), ANIM (an animation under the root: `anim`).

## 6 · `web/frontend/e2e/lib/paint-lib.mjs` (+ `paint-lib.d.mts`)

- Unchanged in behaviour; it gains its typed declaration.

## Proof — every battery, both engines, exits read bare from files

Box load is the 1-min / 5-min / 15-min average at the row's start; no row opened above 120 (each waited behind a 60-s poll). One row ENDED above 120 (glyph sabotage, chromium, re-run: 68.6 at start, 133.8 at end); it is a pixel fixture with no timing clause.

### Browserless (`scripts/shape-census.mjs`)

| Row | This tree (homes v2) | The control (`w7-control` carries no library; v1 = homes.diff `a1d8adeb`) | Load at start |
|---|---|---|---|
| `--self-test` | 136/136, clauses planted 83/83, exit 0 | — | see the f2 rows |
| `--sabotage-battery` | 83/83 clauses red when deleted, exit 0 | v1: 40/40, exit 0 | |
| born-RED: the same 136 rows on the v1 library (`--lib`) | 91/136, 45 fail, exit 1 | — | |
| `--tree` (anchor ABSENT at `74a2b5d9`) | 14 FAIL, exit 2 | 14 FAIL, exit 2 (v1 lib: 14 FAIL, exit 2) | |
| `--tree` on the WAVE union (anchor PRESENT) | 0 FAIL, exit 0 | the union's own lib: exit 0 | |

### Browser libraries (fixtures; DPR 1 and 2, light and dark)

| Library | chromium self-test | webkit self-test | sabotage chromium | sabotage webkit |
|---|---|---|---|---|
| `glyph-pop.mjs` | exit 0 (182 rows; FILE anchor RED by G3 8/8) | exit 0 (182 rows; 8/8) | 4/4, exit 0 | 4/4, exit 0 |
| `edge-bands.mjs` | exit 0 | exit 0 | 8/8 BITE, exit 0 | 8/8 BITE, exit 0 |
| `postpaint.mjs` | exit 0 (U1–U4; sampler r1–r3; recorder) | exit 0 | 5/5, exit 0 | 5/5, exit 0 |
| `rest-probes.mjs` | exit 0 (CLEAN/LATE/ANIM as the law) | exit 0 | 2/2, exit 0 | 2/2, exit 0 |

- **The RAF-mover false red, stressed.** `--sampler-only --reps 16`: the clean RAF and eased movers read GREEN 32/32 in chromium and 32/32 in webkit (exit 0 each); every plant RED in every rep (64/64 per engine); the TASK-mover born-RED 16/16 per engine.
- **The first glyph sabotage run** (chromium) read `anchor` GREEN: OPA80F also reds G2 at DPR 1, so the row did not pin the clause. The row now pins G3 itself (an own bound sits above its own fraction and never reds G3); re-run 4/4 in both engines.

### Served rows — control `:4256` and this tree `:4233`, 1280×800 DPR 1 light unless named

| Row | chromium control / tree | webkit control / tree |
|---|---|---|
| glyph `.section-heading`, payload `default-deal-desk` | exit 1 / 1: median 4.659, G4 column 4 at 2.63 | exit 0 / 0: median 4.659 |
| edge `.drawer-case` | exit 1 / 1: B4 top 16 stations in one run (0.061 > 0.02), median 17.359 | exit 1 / 1: the same notch |
| rest `.drawer-tab` tap, 390×844 touch | exit 0 / 0: one toggle | exit 0 / 0 |
| GA1 `.board-peek-host` on `g`, `/?game=sudoku`, desk + phone, 2 reps | exit 1 / 1: F1 RED 4/4; ct 7.4–9.1 ms, centre 21–93 px | exit 1 / 1: F1 RED 4/4; ct 68–122 ms, centre 37–133 px, stale 4–12 |

- Every exit is identical on control and tree. The values match pass 8's to the thousandth where pass 8 read them (4.659, 17.359, the 16-station notch). GA1 is the known control defect.
- **Incident.** The first served postpaint rows named `.drawer-case`, which never moves on `g`: EMPTY on both sides, both engines, exit 1. A setup error; GA1 was re-run on `.board-peek-host`, the fold spec's own subject.

### The WAVE union (`74a2b5d9` + `pass8/integrate/WAVE.diff` = tree `acb9c08e`)

Every consumer run on the union's own library and on homes v2 landed over it; outputs compared line for line (timings stripped).

| Consumer | union lib | homes v2 | output diff |
|---|---|---|---|
| `lint:ink` | 0 | 0 | none |
| `lint:theme-tokens` | 1 | 1 | none (the union's own 2 bare `var()`) |
| `lint:tape-foot` | 0 | 0 | none |
| `lint:bands` (history via the work tree's gitdir) | 0 | 0 (15 FAIL before LADDER's fold) | none |
| `test:font-coverage` | 0 | 0 | none |
| `lint:motion` | 0 | 0 | none |
| `lint:knip` | 0 | 0 | none |
| `typecheck:e2e` | 0 | 2 uncured; 0 with the consumer cure below | — |

- **The one consumer cost.** `e2e/zone-grammar.spec.ts` (RULE, on the union) imports the library under `@ts-expect-error` because the union's declaration typed only `followImports`. Under the full declaration the directive is unused and two callbacks are loose: 9 errors. The cure is three lines in the spec (drop the directive, `pick: (el) => …`, `.filter((x) => x !== null)`); it typechecks 0. It is RULE's line to land on re-apply, not a home edit, so it rides in neither diff.

## Refused

- **CTRL-FACE `union-property-block`.** A product `src/assets/index.css` change cut on the union; it is not an instrument. The §10 fold owns it.
- **ACC-GRAPHITE `gridPaths.tally.test` 56 → 55.** A `src/` unit test keyed on VERB's un-clipped frame. It does not apply at `74a2b5d9`; it is the lane's on-WAVE delta. GRAPHITE's library half (computed-key sites) is folded as `publisher-split`.
- **MOT-VERB `postpaint` `kPaint` as cut.** Its critic read 1/1 RED on a HEAVY plant that is not deterministic, so the self-test does not reproduce. Replaced by `key-inraf` + `stale` + `F1ct` (§4).
- **PAL-TIN `unescapeJs` as cut.** A second pass re-decoded an escaped backslash, and `\uXXXXX` took five hex digits. Re-cut as `u-escape4`.
- **CTRL-RULE `class-ternary` code.** A duplicate of TAPE's clause; RULE's plant is grafted onto TAPE's row instead.
- **Hand-rolled `.d.mts` copies (FACE, SELF, COUNT, ERASE, VERB, TAPE).** Superseded by the typed declarations beside each home. Their names (`BandsRead`, `EdgePlant`, `FourBands`, `FourBandsOptions`, `GlyphRead`, `GlyphPlant`, `followImports`) are kept as exports or aliases.

## Gaps

- **`authoredStroke`** (the drawn-frame B3 floor at authored width × 0.9) is SELF's roster, not folded here.
- **ADMITTED sites keyed file + line** is FACE's consumer-side row; the library prints `file` and `line` on every site, and the key lives in the consumer.
- **LADDER K1, K3, K11, K15, K16** are not folded; R4 is folded only as `r4-bound` and `r4-element`.
- **`@supports` and `@ container`** are evaluated only for the forms `evalSupports` knows. An unknown condition is dead only under `must` (`sure`), live otherwise.
- **The link law** has no behavioural twin row here; that is TAB-PEN's product row.
- **Dist identity.** The tree's served CSS equals the control's byte for byte (7 files). The JS vendor chunks differ, because main's `node_modules` moved at `4131e427` (vue 3.5.43 and the audit bumps) after the control's dist was built.
- **A `:class` array holding a bare identifier** (`[tone, { … }]`) still reads as a closed list (`dynClass` false), so a positive class the identifier may carry (`.margin-note.warn`) reads no-match. Found beside `class-sure`; no reading reds on it today. Not folded.
- **RULE's `zone-grammar.spec.ts`** on the union needs its three-line typing cure (§ the WAVE union) when it re-applies the homes; it is a consumer line, not a home edit.
- **LADDER's three clauses** were folded from the union's copy, not from a §2.4 PROPOSED diff; LADDER's critic has not read them in homes v2.

## Incidents (self-declared)

1. **Implicit git discovery on main, twice.** A `git apply` run inside an extracted archive found main's repository by walking up and SKIPPED every path (exit 0, nothing applied): once at open (the WAVE tree, caught by its tree id) and once in the bank's first `--check` (0 paths checked, caught by the path count). Both were read-only on main: skipped patches write nothing. Cured with a ceiling above the archive; every check now prints its path count.
2. **The bank's third cut ran from a subdirectory**, so its pathspecs missed and it cut two empty diffs (sha `da39a3ee`). Caught by the 0-byte size; the script now `cd`s to the work tree's root. The banked files are the later cut.
3. **Load.** Rows ran on a box shared with other projects (1-min load 37–228 across the session). Every browser row waited for a 1-min load under 120 before it opened; one ended above it (above). No timing row is cited from a run that opened above 120.
4. **Stall law.** One shape-census command ran in the foreground past 120 s and was moved to the background by the harness; one response carried two tool calls (the two servers), and one shell `&` started the first chromium sampler run. All before the battery.
5. **The served postpaint rows' first subject was wrong** (`.drawer-case`, EMPTY on both sides); re-run on `.board-peek-host`.
6. **Three folds landed after the first battery,** each found by a reading, each with its plant and born-RED: LADDER's union edits (the union's `lint:bands` red 15 under the first overlay), `hole-boundary` and `class-sure` (the first two `--tree` readings of the union under v2, R4 then S11). The browser libraries did not change after their battery except `glyph-pop`'s anchor row, re-run in chromium; webkit's battery already ran the pinned row.
7. **Tailwind (T9-R6).** The first build of v2 minted 16 tree-only utilities from the library's prose and plants (`@container`, `flow-root`, the `inline-*`/`table-*` display words, `px-5`); re-spelled and assembled at run time. Served CSS is now byte-identical to the control. The JS chunks differ: main's `node_modules` moved at `4131e427` (vue 3.5.43 and the audit bumps) after the control's dist was built.

## Replay

- Shape-census: `node web/frontend/scripts/shape-census.mjs --self-test | --sabotage-battery | --tree <fe>`; born-RED: `--self-test --lib <homes v1's shape-census.mjs>`.
- Browser libraries: `node web/frontend/e2e/lib/<lib>.mjs --self-test --engine chromium|webkit [--dprs 1,2]` and `--sabotage-battery --engine …`; postpaint stress `--self-test --sampler-only --reps 16`.
- Served rows: `glyph-pop.mjs --url <u> --subject .section-heading --payload default-deal-desk`; `edge-bands.mjs --url <u> --subject .drawer-case --edge .drawer-case`; `rest-probes.mjs --url <u> --preset touch --target .drawer-tab --state "…aria-expanded" --touch 1`; `postpaint.mjs --url <u>?game=sudoku --sel .board-peek-host --key g --cells desk,phone --reps 2`.
- Servers: control `:4256` and tree `:4233`, killed by recorded PID after a cwd check.
