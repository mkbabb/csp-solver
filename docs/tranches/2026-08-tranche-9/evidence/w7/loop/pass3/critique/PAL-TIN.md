# PAL-TIN · pass-3 CRITIQUE — the tin measured out, three CI lanes did not run, and the word "painted" is doing work no pixel did

Adversarial critic, non-author. Read the spec (`../synthesize/PAL-TIN.md`), the chair's rulings
(`../CHAIR-RULINGS.md`), the prototype's README and its return, the worktree diff
(`.claude/worktrees/wf_308fa864-c94-2`, 18 M + 3 untracked off `74a2b5d9`), and the four frames.
Then served the worktree on `127.0.0.1:4238` and the HEAD control `74a2b5d9` on `:4239`
(private cacheDirs, `--strictPort`), ran my own probe on chromium AND webkit, built the dist,
served it on `:4240`, and ran the visual goldens. All three servers killed; the band reads only
`:4244`/`:4247`, which belong to the sibling worktree `wf_308fa864-c94-1`.

Instruments and logs: `critique/PAL-TIN/probe/critic-tin.scratch.ts`, `.../pw.critic.config.ts`,
`critique/PAL-TIN/logs/` (`critic-pw.log`, `critic-aa.log`, `critic-pi-head.log`, `goldens.log`,
`eslint.log`, `motion.log`, `knip.log`).

**VERDICT: ADVANCE at 74%.** The centre held and the family did the rarest thing in this loop —
it killed its own memorable mark on a number it re-derived against itself. But three CI lanes
are RED and nobody ran them, the tape home is built through the one import the estate's own
ESLint forbids, and "PAINTED on engine bytes" names an arithmetic, not a pixel.

---

## 1 · What I re-ran, and what it says

### 1.1 Confirmed, independently, both engines

| row | the lane's number | mine | verdict |
|---|---|---|---|
| AA, five sticks × bg/card/popover, LIGHT | worst 7.151 | **7.151** | CONFIRMED |
| AA, same, DARK | worst 5.178 | **5.178** | CONFIRMED |
| seven players: rows / swatch colours / `.roster-tick` / inside `.player-name` | 7 / 5 / 2 / 2 | **7 / 5 / 2 / 2** | CONFIRMED |
| `.glyph-tick` on a seven-player board | 0 | **0** | CONFIRMED |
| `you` pill x, chromium / webkit | 1104.891 / 1104.922 | **1104.891 / 1104.922** | CONFIRMED |
| `node scripts/check-peer-tin.mjs` bare | exit 0, 1a 13.57° · 1b 0.082/0.103 score 0.80 · 2 0.116 · 3b 0.879° | **exit 0, same six rows verbatim** | CONFIRMED |
| the gate against `74a2b5d9`'s `index.css` | exit 2 | not re-run (the lane's log reads `INSTRUMENT BROKEN: 0 light sticks and 0 dark`) | ACCEPTED |
| `knip` | clean | **clean** (only my own scratch file) | CONFIRMED |
| `check-copy-register --self-test` | exit 0 | **exit 0** | CONFIRMED |
| chromium ≡ webkit on every colour row | identical to 3 dp | **identical to 3 dp** | CONFIRMED — and see §2.4 for why that is worth less than it sounds |

The ring, re-composited by my own arithmetic (stroke α 0.55 over the 4 % fill over the paper —
a different model from the lane's, which lays both over the paper):

```
light  RING 1:3.438 2:3.293 3:3.331 4:3.917 5:3.765   worst 3.293   (lane: worst 3.134)
dark   RING 1:3.408 2:3.627 3:3.622 4:3.483 5:3.284   worst 3.284   (lane: worst 3.146)
light  DIGIT-in-the-same-ring 1:2.692 2:2.527 3:2.581 4:2.795 5:3.153
dark   DIGIT-in-the-same-ring 1:2.433 2:2.634 3:2.625 4:2.474 5:2.360   (lane: 2.436 / 2.281)
```

Two independent composite models put every ring arm over 3.0 on both arms and put the digit ink
under it — **the row asserts in both directions and survives a second hand.** One correction the
lane should carry: in the LIGHT arm my model reads peer-5 (pink) at **3.153**, i.e. above the
floor, so "the digit ink is RED by construction" is true of the worst stick, not of all five.

### 1.2 Three of the lane's own open gaps — CLOSED BY ME

**(a) THE GOLDENS, the lane's self-declared single largest open risk.** I built the worktree
(`npm run build`, exit 0), served the dist on `:4240`, and ran
`playwright test --config playwright-golden.config.ts` against it.

```
✓ golden · logo wordmark (light) — W13 soul
✓ golden · toggle crest (dark, moon) — W13 soul
✓ golden · single cell with given glyph (light)
✓ golden · grid top-left corner (light) — W13 soul: grain-static steady layer
4 passed · GOLDEN_EXIT=0
```

**4/4 green off the built dist, darwin, no re-mint, chair §6.4 satisfied.** Twenty moved
declarations and an inline SVG in a roster row move no golden. The STOP does not fire.

**(b) π AGAINST THE HEAD CONTROL.** The lane admitted "no rect-delta number is claimed". I ran
the same five-player room against `:4238` (prototype) and `:4239` (`74a2b5d9`) and read every
child rect of every roster row:

```
chromium  HEAD  row1  cells 853.89,566.69,268.22,18.95 · swatch 853.89,570.56,11.19,11.19 · name 871.47,566.69,227.03,18.95 · self 1104.89,567.39,17.22,17.55
chromium  PROTO row1  cells 853.89,566.69,268.22,18.95 · swatch 853.89,570.56,11.19,11.19 · name 871.47,566.69,227.03,18.95 · self 1104.89,567.39,17.22,17.55
webkit    HEAD  row1  cells 853.84,566.36,268.31,18.95 · … · self 1104.92,567.06,17.23,17.55
webkit    PROTO row1  cells 853.84,566.36,268.31,18.95 · … · self 1104.92,567.06,17.23,17.55
```

Rows 1–4 are identical to the hundredth of a pixel on both engines; row 5 differs only in the
join-fold's in-flight height (chromium 1.05 vs 0.56, webkit 18.73 vs 18.52), a capture-instant
artefact of an animation both trees run. **Δ = 0.00 px over every settled child, both engines,
at 1280.** The no-move guard is now a measured row and not an assertion of faith.

**(c) THE DEV-STYLE PROBE'S OTHER HALF.** `grep -rc data-vite-dev-id dist/` returns nothing —
**0 in the built preview.** With the lane's 1-in-dev reading, `domNodes 1234 → 1235` is fully
closed as a dev-wire artefact (T9-R1's species).

---

## 2 · What is NOT converged

### 2.1 THREE CI LANES ARE RED, and the lane ran none of them

The return lists vitest, vue-tsc, knip and check-copy-register. It never names `lint`,
`lint:eslint` or `lint:motion`. All three fail on this tree.

**(i) `lint:eslint` — EXIT 1. An architectural boundary, and it is under the second home.**

```
src/pencil/sheet/SheetWashiLabel.vue
  13:1  error  '@games/shared/PlayerTick.vue' import is restricted from being used by a pattern.
               src/pencil/** must not import from src/games/** (the domain layer).
               Pencil components take generic, already-erased data via props   no-restricted-imports
```

`eslint.config.js`'s `pencilMayNotImportGames` is an ERROR-level rule with its own paragraph of
reasoning, and `SheetWashiLabel.vue`'s own header says the same thing in the same words. Half
the design's thesis — "ONE MODE, TWO HOMES" — is landed through the one import the estate
forbids. The cure is cheap and the lane should take it rather than argue: `PlayerTick.vue`
imports exactly one thing, `@pencil/grid/gridPaths`, and has no games-layer dependency at all,
so it is a pencil component filed in the wrong folder. Move it to `src/pencil/` (or hand the
tape its paths through a slot) and the row goes green with no design change.

**(ii) `lint:motion` — EXIT 1, and the SPEC minted the defect.**

```
• [2 GRAMMAR] peer-tin.spec.ts: unparseable declaration `PRM: declared — nothing in this file
  watches a tween. …` — mode read as "declared". Exactly two are lawful:
  `frozen — <cite>` or `live, because <reason>`.
```

The synthesis wrote "`e2e/peer-tin.spec.ts` (`PRM:` declared)" and the prototype copied the
word. `declared` is not a mode. The file's own prose says the right thing one clause later
("the tally is a frozen pose"), so the cure is `PRM: frozen — the tally is frame [0] of
generateLineBoilFrames; the ring's row is join-language-prm.spec.ts:153`.

**(iii) `lint` (prettier --check) — 3 files.** `src/games/shared/useSession.ts`,
`src/games/shared/useSession.test.ts`, `scripts/check-peer-tin.mjs`. Mechanical, but it is a CI
lane and it is red, and the memory's standing trap says the local seal battery is a SUBSET of CI.

### 2.2 "PAINTED on engine bytes" is an overclaim — no pixel was sampled

`peer-tin.spec.ts`'s ring row and AA row do this: create a `<div>`, set
`style.color = "var(--color-peer-N-ring)"`, read `getComputedStyle().color`, then composite and
ratio the result **with the spec's own `CONTRAST`/`OVER` functions, passed into `page.evaluate`
as strings and `eval`'d**. That is the same arithmetic `check-peer-tin.mjs` already runs in node,
executed a second time inside a browser. It proves the tokens resolve through the cascade and
the theme class — real, and worth a row — but it does not read a rendered pixel, and no ring is
ever put on screen and sampled.

Which makes the return's headline claim, "CHROMIUM AND WEBKIT IDENTICAL to 3 decimals", vacuous
rather than impressive: two engines parsing the same authored hex string and running the same
JavaScript will always agree to three decimals. My own re-derivation (§1.1) has the same
limitation and I name it: *neither of us measured paint.* The honest wording is "the resolved
token values, composited by the row's own arithmetic". A real painted row samples the ring's
stroke pixel and its interior pixel out of a dpr-2 screenshot of a live peer cursor and ratios
those two RGBs — and that is the row the gate table promised.

The same applies to the AA row: ten arms × four grounds, all from `getComputedStyle` of tokens,
none from a rendered digit.

### 2.3 The masked fallback the chair struck is still there, and the lane names it

`gameCell.css:230/232`:

```css
fill:   var(--color-peer-cursor-ink, var(--color-user-ink));
stroke: var(--color-peer-cursor-ink, var(--color-user-ink));
```

Chair §6.5 is wave-wide: consumers write `var(--x)` with **no fallback**, so an absent publisher
fails at computed-value time and a born-RED row catches it. `playerIdentity.ts`'s new header
names the exact failure this fallback hides — "a missing ring arm inherits the digit ink … and
the ring quietly reads 2.28 again" — and then the spec lists "`gameCell.css` entire" under DOES
NOT DIE and treats leaving it shut as a virtue. Gate 3 covers a token deleted from `index.css`;
it cannot see a runtime path that binds only `--color-user-ink`, which is precisely the case the
fallback exists to swallow. BoardHost reading the second key by name with no fallback is right
and is the half the lane did do; the CSS half is unfinished.

### 2.4 Two gate rows the wave asked for are not built, and one cannot fail

- **The tape has no assertion anywhere in `peer-tin.spec.ts`.** Sixteen `expect(` calls, and not
  one touches the attribution tape: not "slug + tick when the stick is shared", not "slug only
  when it is not", not "byte-identical to HEAD at ≤5". Two of the family's own gate rows —
  including the one that guards its second home — exist only as prose and one frame.
- **The row-children π at ≤5 is captured and thrown away.** `rowsFive` is built, `console.log`ged
  and never asserted (the lane admits this). I have now measured the delta (§1.2b); the assertion
  is still unwritten.
- **`.glyph-tick` count 0 cannot fail in the tree it ships to.** `DigitCell.vue` is byte-identical
  to `74a2b5d9`, so the class name exists nowhere in the estate — the assertion is `0 === 0`
  unconditionally, forever, unless a future hand re-mints that exact class name. Its born-RED
  control is the pass-2 worktree, which CI never sees. It is a tripwire, not a gate, and the
  table should say so rather than claim "a revert reds".
- **Forced colours and the un-widened control are printed, not asserted.** Only
  `expect(printed).toBe("rgb(0, 0, 0)")` survives; `CanvasText` is logged. And the "un-widened
  control" the return offers is `.player-swatch` reading `#853900` — a *different element* that
  was never in the widened selector. That is not a control for the rule; it is a colour reading.

### 2.5 The frames do not show the thing

Four crops banked, under the cap, ≤150 KB each. But:

- `amber-beside-amber-light.png` and `roster-seven-light.png` are **the same 270×121 region of
  the same roster**, differing by a handful of bytes. The fourth crop the brief asked for —
  "the amber-beside-amber pair with the tape open, light" — was not taken: no tape is open in it
  and no amber pair is distinguishable.
- In that crop the two rows that carry the tally (`loyal-roadrunner` and the seventh) are at the
  bottom edge, **clipped and mid-fade**, so the one tick visible is a faint stroke on a fading
  row and the seventh row is cut off entirely. The family's memorable mark is not legible in any
  banked roster frame.
- `ring-dark.png` and `tape-shared-stick-dark.png` are near-duplicates of one 641×641 board
  capture, differing in the board frame's colour; the "beside HEAD's ring" half of crop (iii) is
  not in the frame.

So the unverified-gestalt item is live: I confirmed the *numbers* on the surface, and the *look*
of the family's centre is still asserted rather than shown.

### 2.6 The tape grows and the crossing is unpriced (W2 §2.5, a CLASS law with a second bite)

The chair's §6.1 keeps W2 §2.5 — a tape never covers an interactive element — as a class law and
requires the crossing measured against the painted path's own bounding box. In both banked dark
frames the attribution tape lies across board cells (the "5" and "4" of the second row are behind
it). That surface is the fold's, not the tin's — but **the tin widens it**, by `0.35em` plus the
tick's width, from the sixth player on. No number is offered for how much more of the board the
tape covers once it carries a tally. My own hover probe found the label but never reached a
peer-authored cell, so I cannot close it either; it stays open.

### 2.7 F1's second arm is not buildable, and the section ships two ring scalars

- **F1.** Chair §6.8: "Lanes keep both arms buildable and frame both." `withSelfInk` binds self
  unconditionally whenever a second id is known; there is no flag, no prop, no query arm, and no
  frame of the NO arm. Reverting is an edit, not a switch. The owner cannot be shown the fork.
- **`--peer-ring-l` diverges from PAL-WALK's.** The walk pins 0.32/0.79; the tin pins 0.295/0.775
  on a "≥0.10 headroom" rule of its own making (the walk's own light scalar reads exactly 3.000
  here). The §6.6 mechanism is supposed to be one graft; at the fold the section would carry two
  different ring scalars with no reconciliation row. The tin's reasoning is better; it should say
  so as a MOVED row against the walk, not silently diverge.

### 2.8 Smaller, but each is a sentence someone will have to write

- **"byte-identical to HEAD at ≤5" is false as stated at the DOM level.** `v-if` leaves a comment
  placeholder node inside `.player-name` and inside the tape's `<span>`. Layout π holds — I
  measured it to 0.00 px — but the claim should read *layout-identical*, which is what is proven.
- **`HandDrawnGrid.vue` is touched and the plan does not list it.** Comment-only (the retrace
  audition's reasoning re-cut from the walk's index-2 to the tin's violet), so no pixel moves,
  but it is a file in `filesTouched` that no plan step names.
- **Gate 1b's dark peer-4 reads ΔE 0.100 to `--color-user-ink`** — the estate's own dark blue is
  the nearest neighbour of the violet stick, at exactly the round number the ring table also
  quotes. Above the 0.075 floor, but it is the pair a reader is most likely to confuse and it
  deserves naming in the header rather than sitting in the gate's report line.
- **The 16-player filter census and the phone-width π arm are unrun** (the lane's own gaps 4 and
  the "both widths" half of the pill row). My census at seven reads the same shape the lane read.
- **The r0 hue-census tail still prints the golden-angle walk** (the lane's own gap 10) — the
  banked census output describes an estate this design deleted.
- **The killing number was never re-read on the surface** (the lane's own gap 1). Nothing is drawn
  in a cell, so no pixel depends on it — but the number is now load-bearing prose in three files
  (`playerIdentity.ts`, `PlayerTick.vue`, `useSession.ts`) and in a retired capacity claim, and it
  is still research arithmetic.
- **The relay arm and a real device are untested** (lane's gap 8) — W8 §8.3's, correctly deferred.
- **L3 red on both trees** while `check-copy-register` itself exits 0: reported by the lane, not
  this family's, and the right thing to hand the chair.
- **A near-miss on the frozen tree** (`ci.yml` momentarily edited on MAIN, reverted, verified
  byte-for-byte, verified again at return). Disclosed unprompted, which is how it should be. I
  re-verified at my own return: main tree `git status -- web/frontend` is empty and `lint:tin`
  greps 0 on main, 1 in the worktree.

---

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT (soft)** — `.glyph-tick count 0` cannot fail in this tree; "chromium ≡ webkit to 3 dp" on a JS-arithmetic row is a tautology |
| spec-cites-itself circularity | **HIT** — the e2e contrast rows re-run `check-peer-tin.mjs`'s arithmetic in a browser and are cited as independent surface proof |
| gates that cannot fail | **HIT** — as above; plus the tape's two gate rows exist only as prose |
| the elegant-reduction trap | clear — the reduction (cut the cell mark) is the whole act and it is finished, not deferred |
| legacy aliases | clear — `--peer-ink-l` is retired to zero references; the walk is gone, not renamed |
| masked fallbacks | **HIT** — `gameCell.css:230/232` keeps `var(--color-peer-cursor-ink, var(--color-user-ink))` against chair §6.5, and the lane's own comment names what it hides |
| unverified gestalt | **HIT** — numbers verified on the surface, the look is not: crop (iv) is a duplicate of (i), the tally rows are clipped and fading, and no pixel of a ring was ever sampled |
| consumer-less substrate | clear — `knip` clean; `lapFor`/`seedFor`/`tallyFor` all consumed; `DRAW_IN_PRESETS.tally` has two readers |
| the generic default | clear — five named pencils cut against the reserved inks, a gate-five tally in the deal counter's own hand, no avatar/initial/dot/eyebrow/arrow |
| the pixel it moves that it did not declare | **HIT (minor)** — `HandDrawnGrid.vue` is touched and unlisted (comment-only); the tape's width grows at ≥6 players with no number |
| the constraint it forgot | **HIT** — `lint:eslint`'s pencil↔games boundary, `lint:motion`'s PRM grammar, `lint`'s prettier; chair §6.5's no-fallback law; W2 §2.5's crossing on a tape this design widens |
| AA both themes | **CLEAR, re-measured**: 7.151 light / 5.178 dark, both engines, ≥4.5 |
| filterBudget 9 | clear at the shape (the tally mounts no filter); the stated 16-player width unproven |
| M16 | clear — `check-copy-register` exit 0, no copy minted |
| π on unclaimed surfaces | **CLEAR, and I closed it**: 0.00 px over every settled roster child vs `74a2b5d9`, both engines |
| goldens | **CLEAR, and I closed it**: 4/4 off the built dist, exit 0 |
| decided history (r0 R6) | L6 handled as a proposed re-point (correct); the census tail still prints the walk |
| W2's landed mechanics | respected — no new mechanic; the tally rides two existing line boxes |

---

## 4 · Strengths worth carrying whatever happens to the family

1. **It deleted its own best idea on a number.** The in-cell tally was pass 2's memorable mark;
   pass 3 counted the four tenants of a cell, found 2.67 px at the best 9×9 desk cell and
   negative at every 16×16 arm, discovered every prior clearance figure was `getBBox` and
   therefore optimistic by half a stroke, and cut the mark with the number in the commit.
   `DigitCell.vue` is byte-identical to HEAD. No other pass-3 family audited its own instrument
   against itself and lost.
2. **The capacity claim was corrected rather than defended.** "30 board-distinguishable players"
   is retired with its number; the board now claims five and the roster claims thirty, and the
   unit says which is which.
3. **Two defects that only a surface could teach.** Tailwind preflight's `svg { display: block }`
   put the tally on its own line 61 px left of its word; pass 2's authored stroke painted
   2.019 px against a 1.5 ± 0.2 brief. Both found by measuring, both cured
   (`display: inline-block`, `vector-effect: non-scaling-stroke`), both banked with the reading.
4. **The gate is a real gate.** Six negative controls (two more than asked), TIN parsed as source
   text so an export reds `knip`, born-RED at HEAD with a distinguishable message
   (`INSTRUMENT BROKEN`), and it prints the gamut ceilings and the 8-bit round trip as REPORT
   rows rather than hiding them. It reproduces exactly on a second hand.
5. **The ring row asserts in both directions** — the arm clears and the digit ink in the same
   ring does not — which is the shape that makes ten extra declarations honest rather than
   decorative.
6. **The replay was rebuilt as a true three-way merge** from the pass-2 branch's own object store
   when `git -C` was refused, 18 files at zero conflicts including the three the chair flagged,
   with `vue-tsc` clean the moment it landed. The route is stated.

---

## 5 · What closing the gaps costs

Everything in §2.1 is under an hour: move `PlayerTick.vue` into `src/pencil/`, reword one `PRM:`
line, run prettier. §2.2 is one new test that screenshots a live peer cursor at dpr 2 and ratios
two sampled pixels. §2.4 is four assertions on a test that already boots the rooms. §2.3 is a
two-line CSS edit plus the born-RED row that deletes the publisher. §2.5 is four re-taken crops.
None of it is a missing primitive; none of it is as hard as the problem. That is why this is
ADVANCE and not BLOCK — but 74 is what a family earns when three of the estate's own lanes are
red on its tree and the word "painted" is carrying an arithmetic.
