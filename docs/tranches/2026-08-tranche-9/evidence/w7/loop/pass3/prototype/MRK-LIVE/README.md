# PASS-3 PROTOTYPE · MRK-LIVE · The living mark

It RUNS. The §3 delta is source in a fresh worktree off `74a2b5d9`, served on `127.0.0.1:4238`;
the HEAD control (`74a2b5d9`, the main tree, read-only) served on `127.0.0.1:4239`. Every number
below was taken off those two servers in BOTH engines unless the row says otherwise. Nothing was
measured from an injected overlay, with one named exception (the registration ablation, which IS
the deletion the gate asks for).

- Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35`
  (branch `worktree-wf_f72f3b5a-83a-35`, base `74a2b5d9`). Uncommitted, by instruction.
- Probes `probe/` · logs `logs/` · frames `frames/` · re-pointed instruments `instruments/`.
- Configs: `probe/vite.lane.mts` (worktree + private `cacheDir`), `probe/vite.head.mts` (main
  tree + its own `cacheDir`), `probe/pw.config.ts` (the lane's), `probe/pw.estate.config.ts`
  (the estate's default minus webServer/globalSetup, testDir = the WORKTREE's `e2e/`).
- Both servers killed at return; the 4230–4249 band reads empty.

## 0 · The replay

`git -C` into the pass-2 worktree is refused by this session's isolation, so the pass-2 delta was
RECONSTRUCTED rather than copied blind: `git archive a8fee1f5 web/frontend` into a scratch tree,
`diff -rq` against `wf_8630d340-e56-36/web/frontend`, then a unified patch of the 18 differing
files applied here with `git apply --3way`. **Zero conflicts** — the fold's own files
(`GameBoard.vue`, `useGameCell.ts`, `check-copy-register.mjs`) took no pass-2 hunk that the fold
had moved, so nothing had to be resolved toward the fold; the fold's markers are intact at the
replayed tree (`cellAuthors` at `GameBoard.vue:130`, `onGridFocusout` at `:1087`, the 3C-4b
comment at `:474`). The two untracked files were copied whole: `FocusRing.vue` (243 lines) and
`gridPaths.test.ts`. `vue-tsc --noEmit` exit 0 on the replay before any pass-3 edit, and again
after the delta.

Carried: 18 modified files + 2 untracked. The staged/unstaged split of the apply was reset so the
whole thing reads as ONE working-tree diff — `git diff --stat` = **18 files, +450/−135**, plus
the two untracked files.

## 1 · The gates

| gate | law | RED where | pass 3 |
|---|---|---|---|
| **G-LIVE-4** | the ring travels with what it rings | pass-2 build: 190.11 / 194.16 px | **GREEN at the defect's own viewport.** 1280×800, tab focused then PRESSED, settle by the animation set: framing error **0.00 px** both engines (chromium and webkit, `dLeft`/`dTop` both 0.00), after a **mid-glide reversal 0.00 px** both engines, **0** ring writes per 900 ms idle. Deck landing **0.00 px** at rate 1 and at rate 0.5 both engines. Phone row re-cut — see §3 gap 1 |
| **G-LIVE-14** | the rank is an ORDER in both arms | HEAD: tier 2 = tier 1 = 0.9 in the contrast arm | **GREEN both engines.** normal `1 > 0.95 > 0.65 > 0.55`; `prefers-contrast: more` `1 > 0.95 > 0.9 > 0.8`. PW-WebKit DOES emulate `prefers-contrast` (the spec expected chromium-only; both engines returned `matchMedia` true and are read) |
| **G-LIVE-15** | no focus stop rests on a running animation | new | **GREEN both engines.** At rest `button.logo-trigger` / `.sun-moon-toggle` / `.drawer-tab` / `.staging-btn` each read **0** finite animations on their own ancestor path (document-wide read 0 here, 1 in r0's bank); during the tab press the path peaks at **2**. Negative control: an injected INFINITE animation on `body` enters the raw set (`all: 1`) and **not** the filtered one (`finite: 0`) |
| **G-LIVE-16** | ring ⇔ `:focus-visible` (and not EXEMPT) | HEAD: no ring node anywhere | **GREEN 6/6 both engines.** button `.drawer-tab` × {cold+programmatic, Tab-arrived, pointer-then-programmatic} and link `a[href^='https://']` × the same three. The law is stated as the equivalence INCLUDING the exemption (the board draws its own hand), which is what pass 2's wording missed — see §3 gap 3 |
| **G-LIVE-17** | the label and the ring never share a pixel | unmeasured by anyone | **GREEN, booked as a GUARD.** Driven through the product's own invite path on a coarse-pointer context (`?wire=local`, two pages, the peer writes, the phone taps). Air, ring ink to label edge: 9×9 **11.82 / 11.81 px** chromium, **11.26 / 11.11** webkit; 16×16 **10.08 / 10.07** chromium, **9.15 / 9.12** webkit (row-0 flip-below and interior, each ≥ 4 px). Your own digit raises no tape (0 in every run). The spec's ≈6.3 px arithmetic was pessimistic: the ghost rect is INSET 4.5 px inside the cell, so the air is larger than predicted |
| **G-LIVE-18** | the registration is load-bearing | pass-2 build (the JS `OUTSET` masked it) | **GREEN both engines.** Deleting the `@property --focus-ring-outset` rule from the live CSSOM makes the declared value `""`, and `.focus-ring` count goes **1 → 0** (ring width 431.58 px chromium / 429.72 webkit → no node) |
| **G-LIVE-19** | three `, 0px` are gone | HEAD: 3 sites | **GREEN.** `grep 'var(--toggle-bleed,' src/` = **0**; the toggle's ring paints 212×212 around a 104×104 button at 1280 (bleed −52 px, outset 54) and 68×68 around 44×44 at 393 (bleed −10 px, outset 12), `z-index: 70`, both engines |
| PRM arm | pose 0, no stepping | — | **GREEN both engines**: 1 ring, poses `[0]`, **0** swaps |

Guards, all green: filter budget **9 / 9 / 9** at 4×4/9×9/16×16 both engines, ghost paths
**19 / 84 / 259** against r0's 16 / 81 / 256 (exactly **+3**), every ghost `filter: none`;
σ-over-space **0.138 / 0.092 / 0.077** — **byte-identical to r0** in σ, maxDev, chord, scale and
`d0`, the only moved field being `found: 1 → 4` (the living cell's three sibling poses), once
the probe copy is pinned at r0's own 1280×800 (see §3 gap 5); hue census **byte-identical** to
the HEAD control (`diff` exit 0); `check-copy-register` **0 dashes / 0 jargon / 0 unadmitted,
lexicon 25, exit 0**; `lint:motion` exit 0; `lint:knip` exit 0.

Suites: `vue-tsc --noEmit` exit 0 · vitest **69 files / 835 tests, all pass** · the estate's own
e2e against this server, both engines: `spoken-gallery`, `gallery-guard`, `a11y`, `access`,
`join-language-prm` — **78 passed, 0 failed** (`join-language-prm:153` green at peer 0.55).

## 2 · What the pass-3 delta is, over the replay

Six product files; everything else is pass 2's, unchanged.

1. **`FocusRing.vue`** — `chain()` / `running()` / `settle()` on the ANIMATION SET: frames while
   anything finite runs on the target's own ancestor path, `Promise.allSettled(finished)` (never
   `all` — a reversed glide rejects), then three still frames, then the loop does not exist. The
   first read is one frame late on purpose. `take()` now settles on a RESIDENT target too (the
   same-target early-out is gone; the ref is still written only for a NEW target, so the
   revolution answers a landing alone), plus one capture-phase `click` listener that covers
   Enter, Space and pointer. `MOTION` import and `const OUTSET` both die; the outset is read with
   no JS fallback and a non-finite geometry bakes NO frames, which is what makes G-LIVE-18 able
   to fail. The "never null" sentence is replaced by the fallthrough's own truth.
2. **`index.css`** — `--ring-ink: var(--color-focus-sketch)` minted with one comment (name and
   value); `:219`'s comment now carries the dark board's 3.690-at-0.9 reading the shipped
   "5.3:1" lied about; `@property --toggle-bleed` (`<length>`, inherits, `0px`) registered beside
   `--focus-ring-outset`; `@property --motion-note` + one `:root` value landed as a declared
   STAND-IN for MOT-LADDER's publisher (cited as theirs; that family owns the reduce arm and the
   fold keeps ONE publisher).
3. **`gameCell.css`** — tier 2's two `var(--color-focus-sketch, var(--color-crayon-blue))`
   fallbacks struck (the property is declared at `:root`, so the fallback provably cannot fire);
   both `marks-fade-in 250ms` literals → `var(--motion-note)` with no fallback; the two modality
   sentences rewritten to the measured truth; the dead `.game-cell:focus-within` neutraliser
   DELETED with the index.css rule it neutralised. The peer's rows are untouched (0.55 / 0.80).
4. **`DigitCell.vue`** — the prose that certified the deleted `:focus-within` ring, corrected.
5. **`DarkModeToggle.vue`** — three `var(--toggle-bleed, 0px)` → `var(--toggle-bleed)`.
6. **`boilBeat.ts`** — the floor comment now says what the floor IS (the wordmark's and the
   toggle's, for the app's life, `HandwrittenLogo.vue:127` + `DarkModeToggle.vue:378`); nothing
   claims a restored floor.

**The marginal subscriber, PRICED** (§1.5). Same page, same idle window, both servers — the
prototype mounts `FocusRing.vue` (one more `useMarkPose` watch per 125 ms beat), HEAD has no such
component at all. DOM writes per 900 ms over three windows: chromium **92 / 108 / 96** on BOTH
trees; webkit **92 / 82 / 78** prototype against **80 / 82 / 78** HEAD. The ring's enrolment is
free at the DOM to within one window's noise, and the idle ring itself writes **0**.

## 3 · The R6 rows, MOVED

`instruments/law-probe.COPY.mjs` is r0's probe copied, re-pointed (the tree under test is
`argv[2]`) and carrying the three hunks of `synthesize/MRK-LIVE/instruments/R6-rebase.diff`.
r0 is not written. Against the HEAD control and against this tree:

| row | HEAD `74a2b5d9` | prototype |
|---|---|---|
| **R1** the token's comment tells the truth about its themes | **RED** (declared only in `:root`; the comment does not say so) | **GREEN** (says so, with its measured reading) |
| **L3** no em dash, no unadmitted jargon | GREEN (exit 0; 0 / 0 / 0) — the incumbent's `since: "` count was a proxy and reads RED at this base | GREEN (exit 0; 0 dashes, 0 jargon, 0 unadmitted) |
| **R2** the register reads every rendered string | **GREEN** at HEAD (the fold's own cure) | GREEN |

Six standing laws GREEN on both trees; R3 (the action bar's drawn edge, M04) stays RED — another
family's row, reported not touched.

## 4 · The frames (4 crops, 140 KB total, cited)

| file | what | KB |
|---|---|---|
| `1-ring-on-travelled-tab-dock-open-1280-chromium.png` | THE DEFECT'S OWN FRAME, CURED: the dock open and settled, the ring on the tab it travelled 190.11 px with, framing error 0.00 px | 6.9 |
| `2-toggle-ring-212-light-webkit.png` | the toggle's 212×212 ring around its 104×104 button — the one geometry the seam exists for, with no `, 0px` behind it | 51.2 |
| `3-coarse-tape-over-ring-9x9-light-chromium.png` | the fold's collision, measured: the peer's digit under tier 2's ring, `curved-rooster` in the author's ink, 11.8 px of air, row-0 flip-below | 27.3 |
| `4-deck-first-option-fallthrough-chromium.png` | the scrollport focused with its `aria-activedescendant` removed: the ring lands on the first option, not on nothing | 48.5 |

Crop 3 rides the tape instrument's own light context at dpr 2 (the brief asked for dark; the
copied instrument sets no colour scheme and re-running it themed was not worth a fifth frame —
named rather than silently substituted).

## 5 · Gaps, honestly

1. **The phone arm of G-LIVE-4 is not the same gesture, and the spec's phone row cannot be read
   as written.** At 393×699 pressing `.drawer-tab` does not keep focus: `document.activeElement`
   goes to `body` mid-glide and the estate lands it on `button.mobile-heading-btn` inside the
   opened sheet (measured, both engines, `logs/PHONE-dock-*.json`). So the tab is not a RESIDENT
   target there. What IS measured: before the press the ring frames the tab at 0.00 px (outset
   6.5); after the press and the sheet's settle the ring frames the NEW owner at **0.00 px** both
   engines; after a reversal webkit reads 0.00 px and chromium shows **no ring at all** because
   focus has gone to `body` (correct by the modality law, but the row does not prove it — the
   probe does not capture `activeElement` at that instant). The desk arm carries the gate.
2. **60 / 120 Hz was not emulated.** Playwright exposes no display refresh rate in either engine.
   The rate arm is read as its MECHANISM instead — `playbackRate 0.5` doubles the frames per unit
   of animation, which is exactly what a frame-count or duration bound cannot survive; both rates
   land the deck at 0.00 px. That is a surrogate, and it is named as one.
3. **G-LIVE-16 as the spec words it would be false, and the row is re-worded here.** A focused
   cell input matches `:focus-visible` and carries NO drawn ring by design (`EXEMPT`, the board
   has its own hand), so the equivalence has to carry the exemption. It does, 6/6. Two sub-rows
   are trivially satisfied rather than exercised: WebKit's Tab walk did not reach either target
   in 40 presses, and a masthead `<a>` takes no programmatic focus in WebKit (`activeElement`
   stays `body`), so the link's three modalities read fv=false / 0 rings there.
4. **`.guard-btn` was not reached.** G-LIVE-15's stop list includes the armed guard ribbon, which
   needs the deck armed; the route this probe takes reaches `.staging-btn` (0 finite at rest,
   1 ring) but not `.guard-btn`. Four of five named stops read.
5. **σ-space is byte-identical only after the probe copy was pinned to r0's viewport.** The first
   run, at the lane config's 1280×720, read 0.138 / 0.080 / 0.067 — every σ scaled by the board's
   own `scale` (0.428 vs r0's 0.489), grid σ included, which no cure of mine can touch. Pinned to
   r0's 1280×800 the whole bank matches r0 to the character. Both runs are banked.
6. **The hint laminate was NOT re-measured.** `.cell-because` exists only after a hint is asked
   for (a solver round-trip); on the routes this lane drives there is no such node, so G-LIVE-11's
   rim and ΔL* rows stand as pass 2's (0.70 rim, ΔL* 0.00 both themes both engines). The one
   change my diff makes to that rule is its fade-in's rung.
7. **The six dist-bound suites did not run.** They need a built dist and `vite preview`; W8 §8.1
   holds `dist` FIXED on the main tree and this lane did not build one. Sequenced, not skipped.
   **No π claim is made for them.**
8. **`--ring-ink` adds no row to the hue census.** The census reads hex-valued tokens; an alias
   whose value is `var(--color-focus-sketch)` carries no hex, so the census is byte-identical to
   HEAD rather than "HEAD + one alias row". The alias is declared here instead of measured there.
9. **`@property --motion-note` is a stand-in, not MOT-LADDER's publisher**, and it carries no
   reduce arm (HEAD's `.pencil-marks` has none either, so the tree's PRM behaviour is unchanged).
   If MOT-LADDER's node lands first, this hunk is deleted, not merged.
10. **The WebKit 16×16 phone trace was not taken** — its precondition is a quiet box and this one
    ran two dev servers and up to two playwright processes throughout. Pass 1's reading stands as
    the last word.
11. **`ringWhole()` is not proposed as a diff this pass.** `spoken-gallery` 16/16 is green against
    this build as it stands, so the replacement was left where the synthesis banked it (W3 owns
    the spec) rather than cut twice.
