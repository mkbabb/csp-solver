# PASS-4 PROTOTYPE · MRK-LIVE · The live ring

It RUNS, in place, in the pass-3 worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35`
(base `74a2b5d9`, uncommitted). Served on `127.0.0.1:4238`; the HEAD control — the shared
read-only tree `.claude/worktrees/w7-control`, detached at `74a2b5d9` — served as a DEV server on
`127.0.0.1:4239` with its own cacheDir. Both killed at return; the 4230–4249 band reads empty.

**Every number below was taken on those two servers, in BOTH engines, this pass.** The pass-4
number is the critic's, not mine.

---

## 0 · READ THIS FIRST — the tree I inherited is AHEAD of the pass-3 README

`git diff` on the work tree is **byte-identical** to the chair's banked
`pass3/prototype/MRK-LIVE/pass3.diff` (verified: the tracked portion diffs to zero lines). But
that banked patch is **newer than `pass3/prototype/MRK-LIVE/README.md`**, and the charter's rows
1–7 were written from the critique, which is older still. Three of the charter's fourteen rows
arrived already closed in the tree, by a post-critique round the pass-3 README never describes:

| charter row | state on arrival | evidence |
|---|---|---|
| 1 `settle()` double-schedules | **already cured** — the `Promise.allSettled` chain is gone, a generation token retires older loops. Re-measured in pass 3's own round 2: **73 sweeps total, max 1 sweep per frame** (was 191 total / 66 in one frame) | `pass3/.../logs/R2-A-settle-cost-*.json` |
| 4 ten `--color-teacher-red` fallbacks | **already struck** — 0 remain; HEAD carries 8 | `grep` on both trees |
| 5 `@property --motion-note` at `0ms` | **already re-cut** — the registration now holds `250ms` and there is no `:root` copy, so deleting the block makes every `var(--motion-note)` invalid | `index.css:489` |

The README's own `git diff --stat` line (`18 files, +450/−135`) disagrees with the tree
(`+463/−143` on arrival); the 13/8-line difference is exactly those cures. **Declared before I
touched a file**, as instructed. Nothing below claims them as pass-4 work.

My pass-4 delta over that banked patch is **63 changed lines across 3 tracked files + 1 new
untracked file**; `git diff --stat` at return reads **18 files, +478/−146**, plus three untracked
product files (`FocusRing.vue`, `gridPaths.test.ts`, and the new `e2e/focus-ring.spec.ts`).

**Replay route: NONE — I advanced IN PLACE.** No `git apply`, no `diff3 -m`, no line-count check
needed. The pass-3 record is safe in the chair's banked patch.

---

## 1 · Numbers first

### 1.1 The gates, run BARE (exit code unpiped)

| gate | prototype | HEAD control `74a2b5d9` | what it proves |
|---|---|---|---|
| `e2e/focus-ring.spec.ts` (NEW, estate) | **10 passed / 0 failed**, both engines | **6 failed / 4 passed**, both engines | G-LIVE-4, G-LIVE-14, G-LIVE-19 are **born-RED against the named control in both engines**; G-LIVE-15 and G-LIVE-16 pass on HEAD too and are therefore **GUARDS, not born-RED rows** — said plainly rather than counted as cures |
| `vue-tsc --noEmit` | exit 0 | — | |
| `npm run lint:copy` | exit 0 — 0 em/en dashes, **0 unadmitted**, 0 admitted, lexicon 25, 138 files | — | M16 |
| `npm run lint:motion` | exit 0 — **35 specs, 35 declaring, 0 silent** (34 at pass 3: the new spec is the 35th) | — | no longer vacuous for this family |
| `npm run lint:knip` | exit 0 | — | |
| `vitest run` | **69 files / 835 tests, all pass** — BANKED (`logs/vitest-69-835.log`) | — | charter row 11, half |
| estate e2e, 6 suites | **88 passed / 0 failed** both engines — BANKED (`logs/estate-e2e-88-0.log`) | — | charter row 11, other half: 78 (pass 3's five) + 10 (the new spec) |
| π vs the control | **17 nodes × 11 computed PAINT properties + tag name + rect, 0 paint deltas, maxRectDelta 0.00 px**, both engines, re-run after the cure | | reads `color/fill/stroke/fill-opacity/stroke-opacity/stroke-width/font/line-height/background/opacity` and tag names, not rects alone |

### 1.2 `--ring-ink` consumed BARE, and the born-RED that now fires (charter row 3)

`FocusRing.vue` painted `var(--ring-ink, currentColor)` on arrival. Registry v3 §2.9 supersedes
that form: the consumer writes the token **bare**. Struck, and the ablation re-measured through a
RECURSIVE CSSOM walk (Tailwind v4 wraps the sheet in `@layer`; a flat walk deletes nothing — see
incident 1):

| | chromium | webkit |
|---|---|---|
| before | `stroke: rgb(58, 123, 196)`, alias `#3a7bc4` | same |
| declaration deleted (found at `:root, :host`, 1 rule) | **`stroke: none` — the ring is INVISIBLE** | **`stroke: none`** |
| restored | `rgb(58, 123, 196)` | `rgb(58, 123, 196)` |

Under the old `, currentColor` form the same ablation painted `rgb(10, 10, 10)` — a ring nobody
named, in a colour the design never chose. **This is the one line every §10/§11 lane copies:**

```css
/* FocusRing.vue */
stroke: var(--ring-ink);
```

and its declaration, `index.css:233`, is the one home.

### 1.3 G-LIVE-18 RE-CUT (charter row 2) — and the defect in its own instrument

The critic was right that the row is false as worded. It is worse than that: the pass-3
instrument ablated and then read **the ring that was already on screen**. Nothing in the component
re-reads the token until something forces a re-measure, so that read proves nothing either way.
With a blur-and-refocus after the ablation, both engines agree exactly:

| arm | host | declares | ring before | ring after | died |
|---|---|---|---|---|---|
| delete registration | `button.logo-trigger` | nothing | 1 @ 431.58 (ck) / 429.72 (wk) | **0** | ✅ |
| delete registration | `.sun-moon-toggle` | `calc(2px - -52px)` | 1 @ 212 | **0** | ✅ |
| delete registration | `.drawer-tab` | `6.5px` plain | 1 @ 61 | 1 @ 61 | ❌ survives |
| re-register `<angle>` | `.drawer-tab` | `6.5px` → computes `0deg` | 1 @ 61 | 1 @ **48** | value dies (−2×6.5) |
| re-register `<angle>` | `button.logo-trigger` | `3px` → `0deg` | 431.58 / 429.72 | **425.58 / 423.72** | value dies (−2×3) |
| re-register `<angle>` | `.sun-moon-toggle` | `54px` → `0deg` | 212 | **104** (wk) | value dies (−2×54) |
| negative control | `.drawer-tab` | — | 61 | ablate → 61 → restore → **61** | the restore returns |

**The row's honest sentence, re-worded:** *the registration is load-bearing in two distinct ways —
it supplies the initial value to a host that declares nothing, and it TYPES the value for a host
that does. Delete it and the first class of host loses its ring entirely; re-type it and every
declared value dies at computed-value time, including a plain length.* Each half now has a host
where it can fail, and the negative control runs in the same run. Round A's version of this row is
banked RED beside it as the instrument's own failure.

### 1.4 The mouse click, framed (charter row 7)

The spec's §2.5 premise is **confirmed**, not contradicted. A real `mouse.down()/up()` on the
target itself:

| host | chromium | webkit |
|---|---|---|
| `.drawer-tab` | focus lands on the button, `fv=false`, **0 rings** | focus stays on `body`, `fv=false`, **0 rings** |
| `.sun-moon-toggle` | focus on the button, `fv=false`, **0 rings** | `body`, `fv=false`, **0 rings** |
| `.sun-moon-toggle`, KEYBOARD | `fv=true`, 1 ring, **212 × 212** | `fv=true`, 1 ring, **212 × 212** |

So no: a mouse user never sees the 212 px hand-drawn ring. Crops 2 and 3 are that pair, same
engine, same theme, same viewport, same pointer class.

### 1.5 PAINTED contrast behind the token comment (charter row 9)

MRK-ABS's critic's recipe taken whole — focus, screenshot, BLUR, screenshot, ink = the 3×3
max-changed pixel, ground = that same pixel in the blurred frame, ratio = WCAG 1.4.11:

| theme | engine | ink RGB | own fill RGB | **vs own fill** | vs unfocused cell |
|---|---|---|---|---|---|
| light | chromium | 68,130,199 | 238,243,247 | **3.571** | 3.920 |
| light | webkit | 67,129,199 | 238,243,248 | **3.615** | 3.965 |
| dark | chromium | 56,118,187 | 23,27,31 | **3.691** | 3.989 |
| dark | webkit | 56,118,188 | 23,27,32 | **3.695** | 3.997 |

The shipped comment said 3.61 / 3.73 over the fill and 3.97 / 4.00 over the cell. **The critic's
token recompute (3.57 / 3.71) was right and the comment read ~0.04 high in both themes.** The
comment is replaced with the painted numbers and their recipe; the four chrome-ring figures are
still arithmetic and the comment now SAYS they are. Every ground clears the 3:1 floor in both
themes, worst column **3.571**.

### 1.6 The coarse tape against the cells it is NOT on (charter row 6)

Driven through the product's own invite path (`?wire=local`, one context, two pages, the peer
writes, the phone taps) at 390×844, `hasTouch`, `(pointer: coarse)` asserted — the pass-3
instrument COPIED and re-pointed (`instruments/coarse-tape-neighbours.P4COPY.mjs`):

| | chromium | webkit |
|---|---|---|
| painted label bbox (the tape's own `<path>`) | **131.63 × 34.35** | **134.56 × 34.15** |
| cell | 40.22 × 40.22 | 40.22 × 40.22 |
| **cells wide / rows tall** | **3.27 / 0.85** | **3.35 / 0.85** |
| **other gridcells covered** | **10** | **6** |
| **area covered** | **4521.72 px²** (2.80 cells) | 2985.27 px² (1.85 cells) |
| `pointer-events` (tape · label) | none · none | none · none |
| `elementFromPoint` at the label's own centre | **`input.cell-native-input`** | **`input.cell-native-input`** |
| air to the ring on its own cell (row-0 flip-below) | **11.33 px** | **11.54 px** |

**Read plainly: the tape DOES cover interactive boxes — ten of them — and intercepts none.** W2
§2.5 as chair §6.1 restated it is a class law about COVERING, measured against the painted path
bbox, so this is **a row for the chair, not a green I may claim.** The count is slug-length
dependent (a shorter slug read 85.63 wide / 6 cells in pass 3's round 2), which is itself the
point: nothing bounds it.

### 1.7 The phone arm, in a WITNESSED coarse regime — AND A DEFECT I FOUND AND CURED

Round A ran 393×699 on a Desktop Chrome descriptor: a mouse at a phone viewport, which is not a
phone row. Re-run with `hasTouch: true`, `(pointer: coarse)` and `(hover: none)` both asserted
true, dpr 2:

| instant | chromium | webkit BEFORE my cure | webkit AFTER |
|---|---|---|---|
| before the press | tab focused, `fv=true`, 1 ring, outset 6.5, **err 0.00** | same | same |
| mid-glide | `body`, 0 rings | `body`, **1 ring, err 341.50 px** | `body`, **0 rings** |
| at the reversal instant | `body`, 0 rings | `body`, **1 ring, err 341.50 px** | `body`, **0 rings** |
| settled | `body`, 0 rings | `body`, **1 ring, err 504.92 px** | `body`, **0 rings** |

**The defect:** on a phone WebKit opens the dock sheet over the tab and focus falls to
`document.body` with **no `focusout` on the path the component listens to**. Nothing then re-reads
the document, and a ring sat **504.92 px** from anything at settle — the family's own defect class,
alive on the one surface nobody had measured in a witnessed coarse regime. Chromium blanks
correctly, which is exactly why the check could not live in a listener.

**The cure, 9 lines in `measure()`** — the one function every path (event, observer, settle frame)
runs through: a target that has left the document, or whose document has no live focus, drops the
ring. Post-cure both engines read 0 rings at every instant, `vue-tsc` 0, vitest 835/835, estate
e2e 88/0, π 0 paint deltas / 0.00 px.

Also measured: `button.mobile-heading-btn` EXISTS at this viewport but the estate does **not**
move focus into the sheet — the pass-3 README's sentence to the contrary is not what this tree
does. The desk arm carries G-LIVE-4.

### 1.8 G-LIVE-16, exercised rather than assumed (charter row 8)

| target | chromium | webkit |
|---|---|---|
| `.drawer-tab` | reached at Tab press **9**, `fv=true`, 1 ring | **never reached in 60 presses** |
| `a[href^='https://']` | press **3**, `fv=true`, 1 ring | **never reached in 60 presses** |
| `button.logo-trigger` | press **7**, `fv=true`, 1 ring | **never reached in 60 presses** |

The four `0 == 0` rows were not a short walk: **PW-WebKit's Tab key never moves focus off `body`
at all** on this surface. The row is therefore re-cut off Tab entirely — the estate spec walks by
programmatic focus after one key press for modality, judges only stops that actually take focus
AND match `:focus-visible`, and **asserts the count of stops judged (> 4)** so an engine where
nothing is judged REDs instead of greening on an empty list.

### 1.9 §6's rank, ruled (leader duty)

Read live off the paint, not the sheet: tier 1 `stroke-opacity` **0.65** (π census, unfocused
`.cell-ghost-path`, both engines, identical to the control), tier 2 **0.95** (painted, §1.5).
Of the three §6 candidates, **only 0.55 survives the order**: 0.65 TIES tier 1 and 0.80 INVERTS
it, and a ladder that ties is not a ladder. `join-language-prm:153` stays 0.55 and is green in
the 88/0 run. The palettes still owe their PAINTED numbers at 0.32/0.79 vs 0.295/0.775 (registry
§2.4); that half is theirs, not mine, and I do not claim it.

### 1.10 R6 rows

- **R1** — the chair books my wording as the token's accepted value (pass4 §1.3). **The wording,
  for MRK-ABS to re-point under:** *`--color-focus-sketch` is declared once, at `:root`, with no
  theme arm; its comment states the painted reading it was chosen on and names which figures are
  arithmetic.* The tree now carries a consumer (`stroke: var(--ring-ink)` → `#3a7bc4`), so the
  chair's "booked MOVED once LIVE's pass-4 tree carries a consumer" condition is met.
- **Law 39** — the three focus-ring forms STAND. §6's leader rules the ring rank and names the
  opacity: **0.95**, the value every MRK-ABS comment must read at (chair §1.3). G-ABS-5's comment
  names it or the gate is struck.
- **L3, law 27, L19/L21, L17, ruling 1's 520 ms, law 25, law 23 vs a two-value ring token** — all
  the chair's, none touched here, carried as the chair's §1.3 books them.
- **R3** (the action bar's drawn edge, T9-M04) stays **RED** on this tree — another family's row,
  reported not touched.

---

## 2 · What the pass-4 delta IS (63 lines, 4 files)

1. **`FocusRing.vue`** — `stroke: var(--ring-ink, currentColor)` → **`var(--ring-ink)`** with the
   comment re-cut as the line §10/§11 copies (registry §2.9); and the 9-line departure check in
   `measure()` that kills the 504.92 px WebKit phone ring (§1.7).
2. **`gameCell.css`** — three `var(--color-pencil-graphite, var(--grid-line-color))` fallbacks
   struck by the same proof that struck the focus-sketch pair (the property is declared at
   `:root`, `index.css:237`), and a 6-line head note that states the proof ONCE and names the one
   fallback that STAYS: `--color-peer-cursor-ink` is declared per cell, inline, by
   `BoardHost.vue:78`, so a cell with no peer on it has no declaration and `--color-user-ink` is
   the value that actually paints. **That is where the proof stops, and why.**
3. **`index.css`** — the `--color-focus-sketch` comment's board-ring figures replaced by the
   PAINTED reads of §1.5 with their recipe; the stale "3.690 at the shipped 0.9" corrected to
   HEAD's 3.44 arithmetic; the four chrome-ring figures now declare themselves arithmetic.
4. **`e2e/focus-ring.spec.ts` (NEW, 340 lines)** — G-LIVE-4/14/15/16/19 as ESTATE specs with a
   `PRM: live, because …` head declaration. `lint:motion` reads 35 specs where it read 34.

---

## 3 · Gaps, honestly — every one still open

1. **G-LIVE-17 is a ROW FOR THE CHAIR, not a green.** The tape covers ten gridcells and 4521.72
   px² of them (§1.6). It intercepts nothing, but §2.5 is a covering law. I measured it; I did
   not dispose of it.
2. **G-LIVE-17 is still not an estate spec.** It needs the invite path, so as an estate spec it is
   a multiplayer spec. It runs as a copied node instrument and that is all it does. The
   charter's row 13 is therefore **partly** closed: five gates landed, the sixth did not.
3. **The `<angle>` re-type arm is a SURROGATE for "the registration is gone".** It proves the
   typing is load-bearing; it does not prove a host declaring a plain length loses its ring when
   the registration is merely absent. It provably does not (§1.3, row 3). Named, not papered over.
4. **My own G-LIVE-14 passed VACUOUSLY until I tightened it.** The first cut scraped `cssText` and
   read `null`; the not-null clause caught it and the row was rewritten to read live computed
   paint. Banked RED in `logs/born-red-estate-spec-proto-vs-control.log`. Registry §2.10's trap,
   in my own instrument, twice in one pass (see incidents).
5. **G-LIVE-15 and G-LIVE-16 are GUARDS, not cures.** They pass on the HEAD control too. Counting
   them as born-RED would inflate the number; they are listed separately in §1.1.
6. **The hint laminate (G-LIVE-11) was NOT re-measured**, again. `.cell-because` exists only after
   a solver round-trip and no route this lane drives raises one. Pass 2's rim 0.70 / ΔL* 0.00
   stands as the last word. Charter row 14, first half: OPEN.
7. **The six dist-bound suites did not run and no dist was built.** Charter row 14, second half:
   OPEN. **No π claim is made for them**; the π row above is dev-server against dev-server.
8. **MRK-ABS's `RING_GEOMETRY` graft (wander + inset, roughness solved back out) was NOT taken.**
   The charter names it on the BOARD stop with its ablation witness; I ran out of pass before it.
   `paintedExtent()` (CTRL-FACE) and `isTheRing` (PAL-WALK) likewise **not** grafted. Three named
   grafts, zero taken — the largest single hole in this return.
9. **The leader's inbound `gameCell.css` rows are UNCARRIED.** MOT-LADDER's two `marks-fade-in`
   rows, PAL-TIN's fallback strikes, ACC-GRAPHITE's tier-2/2×3 `fill: none` hunks and its
   `--color-focus-sketch` deletion, MRK-ABS's 0.95 cite — none of those lanes has a pass-4 diff
   yet (batch order), so there was nothing to carry. Stated so the agglomerator does not read
   silence as done.
10. **The control is a DEV server, not the chair's `vite preview` of the pre-built dist.** The
    chair permits a dev-mode control with a lane-named cacheDir, and dev-vs-dev is the fairer π
    arm, but it means **the `index-CubiZsMVSwTc.js` asset-hash verification was not the identity
    check I used.** I verified instead by `git -C w7-control rev-parse HEAD` = `74a2b5d9` and by
    the served bytes differing from the lane's (`index.css` sha1 `dbab4b77cc31` control vs
    `7318b7bd59ac` lane; `FocusRing.vue` 200s to the SPA fallback on the control because that
    tree has no such file). Named as a deviation.
11. **The filterBudget census was NOT re-run this pass.** Pass 3's 9/9/9 stands unre-measured; my
    delta adds no filter and no element, but that is an argument, not a reading.
12. **Crop 1 was taken BEFORE the §1.7 cure.** Its pose ("the ring on the tab before the press")
    is upstream of the cure and unaffected, but it is not a post-cure frame and I say so.
13. **60/120 Hz was not emulated** — Playwright exposes no refresh rate. Pass 3's `playbackRate`
    surrogate stands, unre-run.
14. **`.guard-btn` still not reached** (G-LIVE-15's fifth stop needs the deck armed). Four of five.

---

## 4 · The four crops (124 KB, each a REPLACEMENT)

| file | KB | engine · theme · viewport · POINTER CLASS | retires |
|---|---|---|---|
| `1-phone-393x699-dark-coarse-ring-on-tab-chromium.png` | 13.8 | chromium · **dark** · **393×699** · **coarse** (`hasTouch`, `(pointer: coarse)` true, dpr 2) | pass3 `1-ring-on-travelled-tab-dock-open-1280-chromium.png` |
| `2-toggle-ring-212-keyboard-dark-webkit.png` | 36.2 | webkit · **dark** · 1280×800 · fine (mouse, `hasTouch` false) — `fv=true`, 1 ring, 212×212 | pass3 `2-toggle-ring-212-light-webkit.png` |
| `3-toggle-mouse-landing-no-ring-dark-webkit.png` | 63.9 | webkit · dark · 1280×800 · fine — the same button after a REAL mouse landing: `fv=false`, **0 rings** | pass3 `3-coarse-tape-over-ring-9x9-light-chromium.png` |
| `4-board-tier2-ink-095-light-chromium.png` | 3.0 | chromium · light · 1280×800 · fine — tier 2 at 0.95, the subject of the 3.571 painted read | pass3 `4-deck-first-option-fallthrough-chromium.png` |

Crops 1 and 2 close the charter's row 10 (a 393×699 frame and a dark frame; principle 3 is now
photographed in both). Crops 2 and 3 are the pair the charter's row 7 asked for.

---

## 5 · Incidents, self-declared

1. **My first CSSOM ablation was a FLAT walk** and deleted 0 rules while reporting "the stroke did
   not move" — Tailwind v4 wraps the sheet in `@layer` and the declaration sits in `:root, :host`
   inside it. Round A's `N1` is banked RED; round B's `B1` is the recursive re-cut. A flat
   `document.styleSheets` walk is a trap for every lane that ablates a token.
2. **My first G-LIVE-18 read the ring that was already on screen.** Deleting a registration does
   not re-run the component's `measure()`. Round A reported "nothing dies on any host, both
   engines"; round B, with a blur-and-refocus, reports the table in §1.3. **Pass 3's G-LIVE-18
   green has the same defect in the opposite direction.**
3. **My first G-LIVE-14 could not fail** (§3 row 4). Caught by my own not-null clause, rewritten
   to read paint.
4. **My first phone row ran a mouse at a phone viewport** (Desktop Chrome descriptor at 393×699).
   Re-cut with `hasTouch` and the regime asserted — and only then did the WebKit defect of §1.7
   appear at all. A pointer-class shortcut hid a real bug for a whole pass.
5. `vitest --reporter=basic` no longer exists at 4.1.11; one run died on it and was re-run bare.
6. `sharp`'s entry is `dist/index.cjs`, not `lib/index.js`; one run died on the import.
7. Three playwright batteries and two dev servers ran on this box at once during §1.7's
   re-measure. No stall, but it is over my own discipline and it is recorded.
8. **THIS EVIDENCE DIR ALREADY HELD ANOTHER RUN'S WORK WHEN I ARRIVED.** A prior pass-4 MRK-LIVE
   attempt wrote here between 05:37 and 05:48 and never returned a README. **Not mine, not
   deleted, and not cited by anything above:** `logs/A1–A4-*`, `logs/B1-mouse-*`,
   `logs/B2-walk-*`, `logs/B3-phone-*`, `logs/C1–C3-*`, `logs/vue-tsc.log`,
   `logs/vitest-69x835.log`, `logs/estate-focus-ring-RUN1-rank-RED.log`,
   `logs/estate-focus-ring-RUN2-16of16.log`, and **the whole `frames/` directory (3 PNGs, 83 KB)**.
   My own run begins at 05:58 (`logs/N*`, `logs/B1-ring-ink-bare-*`, `logs/B2-glive18-remeasured-*`,
   `logs/B3-painted-contrast-*`, `logs/B4-phone-coarse-*`) and my four cited crops are the PNGs at
   this directory's ROOT, not the three in `frames/`. That prior run's spec never reached this
   work tree (`git status` at my start carried no `e2e/focus-ring.spec.ts`), which fits the
   chair's note that the harness's fresh worktree is not the work tree. **Recommendation to the
   chair: sweep `frames/` and the A/B-mouse/C logs**, since the wave is already over its 2 MB crop
   cap and 83 KB of uncited duplicates of my own crops 1–3 sit there. I did not delete another
   run's record myself.

---

## 6 · Fork / ballot rows for the owner

- **U-10 · the tape over ten cells (§1.6).** Arm A: the tape stays as it is — `pointer-events:
  none`, nothing intercepted, the name spoken through the cell's own accessible name; covering ten
  gridcells is cosmetic. Arm B: the tape is bounded (clipped to its own cell's column, or the slug
  truncated) so that covering is bounded by construction. **Both arms are buildable; neither is
  built** — I measured, I did not choose, and I state that as a gap rather than a frame. Default
  leans Arm A on the evidence (nothing is unreachable at any tap).
- **Law 23 vs a two-value ring token** (MRK-ABS's critic's window) remains the owner's. My tree
  adds no hex: `--ring-ink` is an alias into the crayon system, consumed bare, and its born-RED
  now fires (§1.2). The alias form is buildable and framed; the two-value form is ABS's to frame.

---

## 7 · Where the idea would die

Not here. The one thing that could have killed it — a stray ring surviving on the surface the
family exists to protect — **was found on the phone in WebKit at 504.92 px, and it is cured, in
both engines, with the battery re-run after the cure.** What is still missing is not the idea but
the reach: three named grafts untaken, the tape's covering undisposed, and the dist half of the
evidence unbuilt.
