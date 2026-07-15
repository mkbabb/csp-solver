# T4-W14 — Lane D3 record (pencil-boil + the estate declarations)

Executed at live HEAD `826f16e3` (repo) / `3f72d17f` (pencil-boil sibling), 2026-07-15,
Fable register lane. Work order: `evidence/w14/c-census.md`. No commits, no pushes — the
team lead seals both repos. Every source edit is comment-only; the frontend battery proves
zero behavior.

## Estate (exclusive)

1. `/Users/mkbabb/Programming/pencil-boil/README.md` — em-dash thin.
2. `/Users/mkbabb/Programming/pencil-boil/CHANGELOG.md` — campaign-code scrub + em-dash density.
3. The OFL license texts beside the bundled fonts under `web/frontend`.
4. The Nintendo/Yoshi sweep in `web/frontend/src/**` source comments + pencil-boil.

## 1. Nintendo sweep — branded prose to unbranded craft language

Six branded-prose comment occurrences rewritten; the design precision kept, the mark
dropped. Each is a comment (HTML `<!-- -->`, `//`, `/* */`, `/** */`); `git diff` shows
seven insertions / seven deletions, all comment lines, zero code.

| File:line | Before | After |
|---|---|---|
| `pencil/config/pencilConfig.ts:15` | `Yoshi's Story color palette` | `Felt-craft mascot color palette` |
| `pencil/chrome/CelebrationHeart.vue:49` | `the entire Yoshi bounce` | `the entire plush bounce` |
| `pencil/chrome/AttributionCard/CrayonHeart.vue:5` | `Yoshi's Story in OUR pencil grammar` | `Plush-felt craft in OUR pencil grammar` |
| `pencil/celestial/DarkModeToggle.vue:56` | `Yoshi's Story style` | `felt-craft mascot style` |
| `pencil/celestial/DarkModeToggle.vue:599` | `the two Yoshi accents (T3-W13 §2 re-cut)` | `the two plush accents` (co-located process code also dropped) |
| `pencil/celestial/DarkModeToggle.vue:767` | `The Yoshi beats (T3-W13 §2 re-cut)` | `The plush accent beats` (co-located process code dropped) |

The two DarkModeToggle rewrites shed a co-located `(T3-W13 §2 re-cut)` process reference
in the same clause I was already retyping for the mark — comment-only, in the wave's
remit, tightening the line rather than leaving a half-scrubbed comment.

pencil-boil (README + CHANGELOG) carries no `yoshi`/`nintendo` at all — confirmed clean
before and after.

### Deferred (team-lead flag, census §7.1): the `YOSHI_COLORS` symbol

`grep -rniE 'yoshi|nintendo' web/frontend/src` returns 11 lines after the scrub, all of
them the exported const `YOSHI_COLORS` (`pencilConfig.ts:17`), its four imports/usages
(`CelebrationStar.vue`, `CrayonHeart.vue`, `DarkModeToggle.vue`), and three comments that
name that identifier verbatim. Renaming the symbol is a cross-file source-symbol change,
outside this docs/comments/config wave's scope. The three comments that name it
(`CelebrationStar.vue:24`, `CrayonHeart.vue:23`, `heartPaths.ts:25`) must keep the name
until the symbol changes — a comment naming a renamed symbol would be false. Per census
recommendation (c): branded prose scrubbed now, the `YOSHI_COLORS` → (e.g.) `PALETTE`
rename ledgered as a deferred source change for the team lead. The gate as written cannot
reach literal zero over `web/frontend/src` without that rename; the branded-prose grep
(`grep … | grep -viE 'YOSHI_COLORS'`) is empty, which is the reachable target this wave.

## 2. OFL font licenses shipped (FAM-14 close)

Three bundled woff2 subsets ship under SIL OFL 1.1 with no license text in-tree today — a
license violation. Each font's upstream OFL is now placed verbatim beside the assets, its
copyright line intact, fetched from the font's official source:

| Font | Subset | OFL text | Copyright line (verbatim) | Source |
|---|---|---|---|---|
| Patrick Hand | `patrickhand-subset.woff2` (4,312 B) | `OFL-PatrickHand.txt` | `Copyright (c) 2010-2012 Patrick Wagesreiter (mail@patrickwagesreiter.at)` | google/fonts `ofl/patrickhand/OFL.txt` |
| Fraunces | `fraunces-subset.woff2` (9,772 B) | `OFL-Fraunces.txt` | `Copyright 2018 The Fraunces Project Authors (…/undercasetype/Fraunces)` | undercasetype/Fraunces `OFL.txt` |
| Fira Code | `firacode-subset.woff2` (3,624 B) | `OFL-FiraCode.txt` | `Copyright (c) 2014, The Fira Code Project Authors (…/tonsky/FiraCode)` | tonsky/FiraCode `LICENSE` |

None of the three declares a Reserved Font Name, so the subsets keep the upstream family
name. Each `OFL-*.txt` carries the full OFL 1.1 body (PREAMBLE → DISCLAIMER, dated
26 February 2007). A `LICENSES.md` manifest sits beside them keying family → subset →
copyright → license file, and notes each subset is a Modified Version redistributed under
the same license (clause 5). Files live at `web/frontend/src/assets/fonts/`. The root
README's font-line OFL note is the README lane's move (census §6 `:59`), not D3's.

## 3. pencil-boil README — em-dash thin

Stage 3 already describes the beat-parked model (setTimeout aimed at the beat boundary →
one rAF → sleep; sequence supersede-and-fall-back), matching the module-map row and the
CHANGELOG. The spec's "fold the 0.8.0 park model in" is nine waves stale — nothing to fold
(census §5). README work was em-dash thinning: **6 → 1**. Five prose em-dashes rewritten to
real clause boundaries (colon/comma/period), including one that carried a `not just X`
correctio (`honors prefers-reduced-motion reactively … tears an active subscriber down,
not just gates new enrolment` → `… tears an active subscriber down and gates new
enrolment`). The one surviving em-dash is the terminal license gloss (`[Unlicense](./LICENSE) — public domain.`), an idiomatic single touch. The `:44`-era lilt
(`motion reads as re-tracing with analog touch`) is untouched — on-idiom, within budget.
Meta-leak: 0 (clean before and after). CONTRIBUTING link kept (resolves in that repo).

## 4. pencil-boil CHANGELOG — campaign-code scrub + em-dash density (pure-technical)

Twelve meta-leak lines taken to zero. Ten headings re-cut to de-processed descriptors
(version + date + the file's em-dash convention kept; campaign code dropped):

- `0.9.2` `(tranche-4 WM mobile recut — the residency seam)` → `(mobile recut: the residency seam)`
- `0.9.1` `(tranche-4 W5 currency)` → `(currency bump)`
- `0.9.0` `(tranche-4 W1 release)` → `(raster surface)`
- `0.8.0` `(tranche-3 W13 §1-P1 release)` → `(scheduler park)`
- `0.7.0` `(tranche-2 W5 release)` → `(prebake + draw-in surface)`
- `0.6.0` `(grand-uplift W12 release train)` → `(celestial generator proofs)`
- `0.5.1` `(grand-uplift W12 release train)` → `(frame-set cache)`
- `0.5.0` `(grand-uplift W12 release train)` → `(unified boil scheduler)`
- `0.4.0` `(tranche-C handmark cohort)` → `(ellipse primitive)`
- `0.3.0` `(G.W5 cohort)` → `(initial changelog seed)`

Two body leaks scrubbed: the `0.8.0` measurement clause (`measured in the T3-W13 audit`
dropped; the number is the measurement) and the `0.3.0` seed sentence (`muster tranche G
release-engineering wave (G.W5 sub-wave D)` removed; the now-false `The current published
version` corrected to `the published baseline when this file began`, since npm is at
0.9.2). The park engineering narrative ("one clock for the beat") is preserved intact.

Em-dash density: every paragraph in the long `0.8.0`/`0.9.x` entries now sits at ≤ 2
(`0.9.2` para 2 went 4 → 0; `0.8.1` 3 → 2). The one over-budget survivor found on scan —
the `0.5.0` "Reactive prefers-reduced-motion" paragraph (3) — was also thinned to 0
(semicolon + parens), so no paragraph in the file exceeds 2. File total 52 → 44.

## Gate results (D3 scope)

| Gate | Probe | Result |
|---|---|---|
| Nintendo mark (branded prose) | `grep -rniE 'yoshi\|nintendo' web/frontend/src \| grep -viE 'YOSHI_COLORS'` | empty (PASS) |
| Nintendo mark (pencil-boil) | `grep -rniE 'yoshi\|nintendo'` README + CHANGELOG | empty (PASS) |
| OFL | three `OFL-*.txt` + `LICENSES.md` beside the woff2 | present, verbatim, copyright lines intact (PASS) |
| pencil-boil CHANGELOG meta-leak | `grep -niE 'tranche\|WGATE\|T[0-9]-W\|\bW[0-9]+\b\|campaign\|muster\|grand-uplift\|G\.W[0-9]'` | empty (PASS) |
| pencil-boil §Probes (spec) | `grep -niE 'tranche\|T3-W\|muster'` CHANGELOG | empty (PASS) |
| pencil-boil README Stage 3 | park model present, matches CHANGELOG | PASS (already folded) |
| em-dash density | ≤ 2/paragraph, long entries | PASS (max 2) |
| comment-only proof | `vue-tsc -b` + `prettier --check` on 4 touched files | vue-tsc exit 0, prettier clean; diff is comment-only (PASS) |

## Flag for the team lead

`YOSHI_COLORS` symbol rename is deferred (census §7.1 option c). The `web/frontend/src`
Nintendo gate cannot reach literal zero until the exported const and its four
imports/usages are renamed — a source-symbol change out of this wave's scope. Branded
prose is at zero. Recommend the rename ride a source lane (e.g. `PALETTE` / `HEART_COLORS`)
with the three symbol-naming comments updated in the same change.
