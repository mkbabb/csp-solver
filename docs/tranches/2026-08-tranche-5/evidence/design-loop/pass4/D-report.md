# LANE D — INK/CONTRAST ESTATE · pass 4 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`5873a920` (F3's stage close), clean before and after. **Six commits, nothing pushed, nothing
deployed.** Evidence: `pass4/logs/D/` (every gate banked — an unbanked gate does not exist),
`pass4/shots-D/` (12 crops), `pass4/goldens-logo-light/` (the before/after pair + the 3948px
diff), `pass4/rig/` (the three instruments). Device: `perf-rig-iphone16`, booted for the R3b
session and **shut down at its close**. `:4894` / `:4895` alive and never addressed; `:3000`
(foreign palette-api), `:3001`, `:4288` never addressed. Lane ports: `:4197` (built dist),
`:5321` (dev), `:4899` (the R3b probe host) — all three killed at the close.

| commit | row |
|---|---|
| `469f248d` | 4 — union area, the injected control, the coarse regime |
| `beed5b5f` | 3 — Deal's durability bound, rewritten so it can fail |
| `49341832` | 6 + 7 — THEMES derived, the third scope, the tape gated |
| `8fcafd7b` | 9 — `lint:ink` into CI |
| `64fa37a4` | 8 — the `logo-light` darwin re-baseline |
| `daca28ee` | 1 + 4 — R3b closed on glass, the 9-vs-17 row reconciled |

---

## 1 · R3b — the `d4e8e41e` boot hazard · **CLOSED, on the engine**

The pass-3 blocker (D1/D2) was that eleven commits sat on a 419-LOC deletion whose cited
failure mode is *the app does not boot* (`ReferenceError: Cannot access 'sudokuGame' before
initialization`, cyclic ESM/TDZ), never exercised on the shipped engine — and that the row was
held open on "the rig session is still locked" while the pass's own artifacts booted the device.

**The attribution from the pass-3 evidence, runs named.** Every one of these requires the app to
have evaluated its module graph on JavaScriptCore, on a dist containing `d4e8e41e`:

| run | what it proves |
|---|---|
| `pass3/measure/RESULTS.md` §0 | `perf-rig-iphone16` **BOOTED** for the sim block, shut down at its close |
| `pass3/stall/runs/m3-covis-head.jsonl` (§6.2) | the **head** dist measured on real MobileSafari — document height 1133, in-flow band 21, board-bottom→Deal 229.56, a 7.19px chip gap. Live DOM, live layout |
| `perf-rig/runs/m3-*` (§7) | a five-scenario battery, three rounds, on a **live 81-cell sudoku board**, including a `deal` |
| `pass3/measure/gates-e2e-builtdist.log` | the same bundle boots headless WebKit 14/14, incl. `wordmark-webkit` ×6 and `theme-bake-webkit` ×2 |

That was already two independent closures. Doubt remaining: the pass-4 tree has moved six
commits, and single-tree discipline says the number you report is the one you took. **So the
targeted check was run**, on the pass-4 dist, `pass4/logs/D/r3b.jsonl`:

```
perf-rig-iphone16 · iOS 19 · AppleWebKit/605.1.15 · Version/19.0 Mobile
393×699 dpr3 · pointer:coarse · hover:none · index-DTLxUr3ZTp-8.js
booted true · cells 81 · headings ["Size","Difficulty"] · ctrlBtns 14
dealFound true · boardChanged true · errors [] · 2015 ms
```

The error trap is installed in `<head>` **ahead of the app's module script**
(`pass4/rig/r3b-server.mjs`), so an evaluation-time TDZ throw would have been *caught*, not
inferred from a blank page. `errors: []` is therefore a measurement, not an absence of
observation. `headings ["Size","Difficulty"]` and `ctrlBtns 14` are the hand copy `d4e8e41e`
created, rendered; `boardChanged true` is one Deal through the panel's own wiring. Board
fingerprint is the readonly-input given set — the glyphs paint as SVG paths, so a `textContent`
fingerprint compares equal to itself forever (caught in the headless dry run,
`r3b-headless-webkit.jsonl`).

**R3b closes. D1's hold violation stands as a process finding for the team lead** — the commits
are attributed now, which is what the order asked for instead of a revert; whether a hold that
can be committed through is a hold at all is §7 of the pass-3 critique's question, not mine.
The attribution rides at the TDZ rule's own site (`SudokuGame.vue:44-51`), where the next person
to touch that import reads it.

---

## 2 · The goldens disposition, corrected to the logs · **CLOSED** (and one row is worse than reported)

Pass 3's dossier said `logo-light` **and** `toggle-crest-dark` both red, both deterministic,
3/3 on two trees. The six banked logs say otherwise, and so do fourteen runs here.

| subject | pass-3 banked (6 logs, 2 trees) | pass 4, pre-remint | pass 4, post-remint | verdict |
|---|---|---|---|---|
| `logo-light` | ✘ 6/6, **3948 px ratio 0.03 every run** | ✘ 3948 px | **✓ 11/11** | deterministic red on the seal → **re-baselined** |
| `toggle-crest-dark` | ✓ 6/6 | — | **✓ 7/11, ✘ 4/11 at 1028 px** | **FLAKY**, not off its baseline |
| `cell-light` · `grid-corner-light` | ✓ 6/6 | ✓ | ✓ | untouched |

Two corrections, both against my own lane's pass-3 text:

1. **`toggle-crest-dark` was never deterministic and is not off its baseline.** The 1028 px
   figure the pass-3 report quoted is *real* — it reproduces here four times in eleven runs —
   but it is an intermittent against a LIVE baseline, which is the opposite of what
   "deterministic red, re-baseline candidate" means. It was not re-baselined and must not be:
   re-minting a flaky subject relocates the flake, it does not close it.
2. **The pair named in the pass-3 report is verbatim the sun-crest clause's own pair.** The
   critique called that spec-cites-itself and was right about the mechanism even though the
   pixel count was genuine.

**NEW ROW, opened honestly (team lead):** `toggle-crest-dark` reds ~36% of runs on this darwin
host today against 0/6 in pass 3's isolated runs. The subject is the clause's named
non-convergent one (feTurbulence sparkles relocating a few px run-to-run); the question is
whether the darwin soul floor 0.017 is simply too tight for it, or the crop needs tightening
onto the disc core the way the clause already describes. Not a lane row — it predates every
pass-3 and pass-4 commit and moves with host load, not with the tree. Logs:
`gates-golden-AFTER-r1r2r3.log`, `gates-golden-AFTER-r4r8.log`, `gates-FINAL-e2e.log`.

---

## 3 · Ship 1's durability gate · **CLOSED, `beed5b5f`**

The charge was exact: `expect(btn.h).toBeGreaterThanOrEqual(die.h + labelH)` cannot fail under
a column flex box, because pinning the height makes the items shrink until they fit. At the
broken pose `44 ≥ 17.62 + 14.38` passed with 12 px to spare. It was asserted as "the general
form" in three places.

The bound is now written against the die's **width** — the dimension the defect leaves intact —
with the box's own padding and gap **read** rather than hardcoded, so changing either re-prices
the bound instead of widening it:

```
btn.h ≥ die.w + labelH + padY + gap − 0.5     54.38 demanded, 54.38 delivered
```

All three geometry rows are now `expect.soft`. That is the structural half of the repair: a hard
first assertion means a negative control only ever proves the row it stops at, which is exactly
why nobody noticed this row could not fail — the squareness assertion fires first and the run
ends there. **GATE-1 control, run** (`gate1-dealbox-control.log`): `.icon-btn.deal-btn` →
`.deal-btn` at `GameControlPanel.vue:1054` and all three rows red **by name**, the new one
reading *"Deal's box is 44.00px for content demanding 54.05px (die 28.00 square + label 14.05 +
padding 9.60 + gap 2.40)"*. Green on the fix, tree restored.

---

## 4 · The census — its other two thirds, and the 9-vs-17 row · **CLOSED, `469f248d` + `daca28ee`**

Registry §4 ordered three things; the shipped spec delivered one (the count, exact in both
directions — genuinely the strong half). Now shipped **into `e2e/filter-census.spec.ts`**, not a
throwaway rig:

- **Union raster area, per regime**, by scanline so a pose stack is priced ONCE. (Lane A's rig
  summed rects, which prices the four stacked divider poses four times.) Measured on the built
  dist: **45,315 CSS px² row / 6,488 coarse** — identical chromium and webkit, light and dark,
  run to run, so the ±2% tolerance is for sub-pixel rect edges and not for growth.
- **The injected-node control, run every time.** A census that has stopped seeing the document
  passes every other assertion in the file. A filtered box goes in, must be censused as
  unclaimed, must raise the total by exactly one and the union past its own tolerance; then it
  comes out and the population must return.
- **G3.3 — the same census at 393×699 coarse dpr3.** `filterBudget.ts` claimed in prose that
  "below 1024 the population is the same size" while every config in this repo ran at 1280×800
  and the whole campaign is about the phone. The claim is true — **9 / 9** — and is now a gate.

**GATE-1 controls, both run** (`gate-filter-census-controls.log`): the injected node patched to
`filter:none` reds *both* regimes on the control row; the row area budget moved 45,315 → 41,000
reds naming the delta. Built-dist lane **14 → 15**.

**The 9-vs-17 row, reconciled on the device** — four numbers, one dist, one session
(`r3b.jsonl`, board arm and gallery arm):

| scene | rule | total | the delta's members |
|---|---|---|---|
| board | own `display` ≠ none (this budget) | **9** | — |
| board | `display` not consulted (perf-rig `probe.js`) | **13** | +4 `g.boil-frame-layer[.is-active].baked-hidden` |
| gallery | own `display` ≠ none | **17** | +4 `g.logo-pose[.is-active]`, +4 crayon-heart `g` |
| gallery | `display` not consulted | **21** | both deltas at once |

So the pass-3 device figure of **17 is the GALLERY's population** — the battery's `galleryGlide`
scenario navigates there — and it agrees to the unit with Lane A's independent gallery census
(`pass3/measure/out/A-census.json`, 17 in both engines on both arms). **The board budget was
never breached, and the budget file's header claim was never false.** The table rides in
`filterBudget.ts`. The gallery's own 17 is named **measured, not gated**, and left as Lane A's
census row rather than quietly claimed here.

---

## 5 · Ship 4's six surfaces — one rendered witness each · **CLOSED**

Six surfaces changed rendered contrast with 0 goldens, 0 e2e, 0 shots; the sole witness was a
node script. Twelve dpr-2 crops against the **built dist**, light and dark, in
`pass4/shots-D/` (`pass4/rig/ink-witness.mjs`):

| # | surface | what ship 4 moved | crop |
|---|---|---|---|
| 1 | `.keyboard-legend` text | 55% → 68% graphite (`--ink-press-quiet`) | `1-legend-text-{light,dark}.png` |
| 2 | `.legend-row kbd` borders | 40% → 55% (`--ink-press-rule`) | `2-legend-kbd-{light,dark}.png` |
| 3 | `.legend-sep` | `opacity: 0.7` **deleted** (was 2.877:1) | `3-legend-sep-{light,dark}.png` |
| 4 | `.margin-note` | 62% → 68% | `4-margin-note-{light,dark}.png` |
| 5 | `.icon-sublabel.is-armed` | crayon-rose → `--color-red-ink` | `5-armed-clear-{light,dark}.png` |
| 6 | `.vignette-meta` | 62% → 68% | `6-vignette-{light,dark}.png` |

Two facts the shots forced out that no document in three passes had stated:

- **The armed sublabel is COARSE-ONLY and DIRTY-ONLY.** `clearArmed` gates on
  `isCoarse && isDirty` (`GameControlPanel.vue:364`), so the surface ship 4 re-tokenised does
  not exist on a desktop pointer at all. Its witness takes its own 393×699 touch context, a
  filled cell and one tap. Ship 4's report described it as though it were a chrome surface.
- **`.vignette-meta` is `display: none` at every DOCKED rung** (`CompletionVignette.vue:114`,
  "now every width below 1280"). The changed pixels only exist in the full left-margin vignette,
  so its witness runs at 1700×1000. A crop at 1280 shows a star and a gold verdict and **none of
  the ink this ship moved** — which is how six surfaces got re-pitched with nobody looking at
  them.

`frontend-design`'s calibration for this lane is unchanged and was applied: **restraint** — real
rendered pixels at native geometry, tight crops on one asserted surface each, no annotation
layer competing with the drawing. Evidence crops, not compositions.

---

## 6 · `gateFloors` derived from `index.css`, third scope covered · **CLOSED, `49341832`**

`gateFloors`/`gateMonotone` computed against a hardcoded `THEMES` literal while the report
claimed drift-immunity by resolver — the resolver existed, and it was wired to `gateArmed`, the
one gate that needed it least. `themesOf(css)` now takes the stylesheet **as a parameter**,
which is what makes the derivation itself falsifiable rather than merely derived. The digits
come out unchanged to the hundredth: 3.53/4.36 · 5.23/6.06 · 5.95/6.66 — the derivation is
faithful, which is the only way to know the literal was right *today*.

**THE THIRD SCOPE IS `@media print`, NOT `prefers-contrast: more`.** The critique's minor (a)
cited `index.css:829-832` as a `prefers-contrast` block; those lines are inside `@media print`
(opened at `:794`, closed at `:834`). The actual `prefers-contrast: more` block is at `:557` and
sets only `.sheet-laminate`'s background and border — it touches no ramp input, and there is no
third `--grid-line-color` scope there. The scope that *does* re-pitch the ink is print, which
drives it to pure black for `:root` and `.dark` at once over a paper the same block forces
white. It is now evaluated as a third theme, ink and paper both read out of the print block:
**4.76 / 7.86 / 9.23**, strictly increasing, green.

Two probes on the SHIPPED path, banked (`lint-ink-drift-probe.log`):

```
A · --color-card light 99% → 40%     ✗ rule 1.825  ✗ quiet 2.107  ✗ firm 2.201  ✗ red-ink 1.017
B · @media print ink #000 → 78% grey ✗ rule 1.318  ✗ quiet 1.414  ✗ firm 1.445
```

`--self-test` grows 4 cases → 6, all six shown able to fail.

---

## 7 · `--sheet-washi-neutral` dark · **SHIPPED (by Lane C) — and now GATED, `49341832`**

Correction of record: the token's dark arm **already landed at `e982a403`** (Lane C's zone
grammar commit), α 0.83 → 0.92 over `hsl(24 5% 21%)`, confirmed on Apple glass by RESULTS §6.2.
It was not Lane D's to ship this pass and the pass-3 registry's D9 row is stale on that point.

What *was* still true is blast §2.7's actual charge — **zero assertions and zero goldens read
the token's value**, a free edit in test terms and a wide one in rendered terms. That is closed
now. The bound is not a ratio against the paper: the broken arm measured **8.96:1** there and was
still wrong, which is the difference between a contrast ratio and a perception. It is the **word
on the tape** — `SheetWashiLabel` writes in `--color-foreground` on a `--sheet-washi-neutral`
ground — composited over the card the tape lies on, at the AA text floor:

```
washi tape   17.36 light / 9.06 dark   ≥4.5   (--color-foreground on --sheet-washi-neutral)
```

**Sabotage probe on the shipped path** (`lint-ink-tape-probe.log`): the dark arm reverted to the
light arm's white base reds at **1.231:1** — the highlighter strike the pass-2 dark shot
recorded, finally as a number. `color-mix` is evaluated **premultiplied**, because the alpha on
the second colour is the design and an un-premultiplied lerp models a different tape than the
browser paints.

---

## 8 · The `logo-light` darwin re-baseline · **DONE, `64fa37a4`**

Not a single-red re-baseline, and the election is cited in the commit: **six banked isolated
runs across TWO trees** — three on pass-3 HEAD, three on the base dist built from the sealed
`6800af04` — plus one more at the pass-4 open, every one **3948 px, ratio 0.03**, byte-identical.
The subject is off its darwin baseline **on the seal itself**, so no lane put it there and no
lane can take it off. Golden discipline's letter (never re-baseline on a single red) is honored
by the 6/6 record; its spirit is honored by reviewing the diff rather than trusting the count.

**Reviewed.** `pass4/goldens-logo-light/logo-light-diff.png` is a one-pixel outline around every
glyph contour and nothing else: same wordmark, same weight, same grain field, same theme, same
pose. Sub-pixel raster drift at the stroke edges — verbatim the class the sun-crest clause names
non-convergent. Before/after/expected/actual/diff all banked.

Scoped re-mint (`-g "logo wordmark"`), so the other three subjects are untouched bytes
(`git status` showed exactly one modified PNG). After: **`logo-light` GREEN 11/11**.
`test:golden:bytes` PASS at 23.5 KB.

---

## 9 · `lint:ink` into CI · **DONE, `8fcafd7b`**

Standing team-lead row since pass 2, correctly attributed every pass and closed by none. It
lands in the `frontend` job beside `test:font-coverage` — static, zero-dependency, no browser —
and it runs **with `--self-test`**, so CI re-proves each of the six gates able to FAIL on a
known-bad input before it trusts the green. Step list verified by parsing the workflow.

---

## 10 · GATES — one sweep, on the committed tree, after the last edit

`gates-FINAL-static.log` · `gates-FINAL-e2e.log`, HEAD `daca28ee`, `index-DTLxUr3ZTp-8.js`
(byte-hash identical to MEASURE's `dist-head`, so this dist and the pass-3 evidence dist are the
same artifact):

```
vue-tsc --noEmit           0
vitest                     332 passed / 31 files
eslint · knip · prettier   clean
lint:ink --self-test       exit 0 — 3 ladder rungs × 3 scopes, red-ink, tape; 6 gates self-proved
test:font-coverage         28 codepoints, 13,788 B
e2e default                101 / 101      PLAYWRIGHT_BASE_URL=http://127.0.0.1:5321
built-dist lane            15 / 15        PLAYWRIGHT_BASE_URL=http://127.0.0.1:4197
  filter-census 4 (was 3) · wordmark-webkit 6 · theme-bake ×2 engines ×2 directions · void 1
test:golden:bytes          PASS
npm run build              green
goldens                    logo-light ✓ 11/11 · cell ✓ · grid-corner ✓ · toggle-crest-dark ✘ 4/11
```

Every gate banked under `pass4/logs/D/`. The one non-green row is §2's toggle-crest flake, which
predates every commit in this pass and is routed, not owned.

---

## 11 · RESIDUALS + ROWS I OPEN

1. **`toggle-crest-dark` flakes ~36% on this host** — new team-lead row, §2. Deterministically
   green in pass 3's isolated runs, so it is load-sensitive; the clause already describes the
   mechanism, the tolerance is the open question. **Do not re-baseline it.**
2. **The gallery filter census is measured and ungated** — 17 spec-rule surfaces, members named
   in `filterBudget.ts`. Lane A's row; I declined to gate another lane's scene.
3. **The armed-sublabel and vignette-meta regimes** (§5) are design facts nobody had written
   down. `.vignette-meta` renders nowhere below 1280, which is the same deletion class F3's F4
   row names for the tally line — worth one adjudicator look at whether two independent
   surfaces going dark below 1280 is a pattern or a coincidence.
4. **`--color-muted-foreground`'s cross-theme inversion** stays booked, not gated (a design
   ruling, not an AA repair). Printed on every `lint:ink` run in both themes.
5. **D1's hold violation** is discharged on evidence rather than reverted, per the order. The
   process question — whether a hold that can be committed through is a hold — is the team
   lead's, and it is the pass-3 critique's §7.
6. Not touched, not mine: the 2 dependabot highs, E8 device smoke, the M4/M2 blind reads, the
   keypad rig row.
