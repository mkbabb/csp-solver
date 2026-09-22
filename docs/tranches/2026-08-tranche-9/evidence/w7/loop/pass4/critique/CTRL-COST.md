# CTRL-COST — pass 4 ADVERSARIAL CRITIQUE (the cost face, §10)

Critic wrote neither the charter nor the prototype. Every row below was re-measured on this
lane's own servers unless it says **[theirs]**.

- **Subject.** Work tree
  `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29`,
  verified at `74a2b5d9`, uncommitted, 21 files +2,196/−1,557 plus untracked
  `web/frontend/scripts/check-cost-face.mjs`. The pass-4 ADVANCE over pass 3 is **8 files / 675
  diff lines**, reconstructed here by `git archive 74a2b5d9` + `git apply pass3.diff` into the
  scratchpad and diffed against the work tree (see gap 14 — the banked patch does not apply whole).
- **This lane's servers.** Prototype BUILT preview `127.0.0.1:4236`, built in the work tree with a
  private `cacheDir` — identity **`index-BUIDrd-OiOrV.js`, 43 files**, which REPRODUCES the
  prototype's claimed dist hash exactly. Shared HEAD control `127.0.0.1:4237` from
  `.claude/worktrees/w7-control`, verified by asset hash **`index-CubiZsMVSwTc.js`**, never by a
  200. Both killed by recorded PID (80451, 79779); 4236/4237 read clear. 4239–4244 belonged to
  sibling lanes and were left alone; `pkill` was never used.
- **Hygiene at return.** `.critcost/`, `dist-crit/`, `.vite-cache-critcost/`, `test-results/` and
  `playwright-report/` deleted; the work tree's `git status --untracked-files=all` = the 21
  product files + `check-cost-face.mjs`. The control tree was served and never edited, built or
  `git`-touched. Nothing under `r0/`, `pass1/`, `pass2/`, `pass3/` was written (checked by
  `find -newermt`).

---

## 1 · WHAT IS TRUE — re-measured here

| row | this lane's reading | verdict |
|---|---|---|
| **charter 1 · π at 390×844** (pass 3's blocking regression) | My own census, 11 paint properties + tag + rect per node, everything outside `.controls-card/#controls-drawer/.drawer-case`, prototype dist vs control dist. **chromium light sheet-shut**: masthead `[58.14,143.52,273.72,78.22]` = `[58.14,143.52,273.72,78.22]`; board `[12,219.73,366,366]` = same; `#fold-tools` **61.58 = 61.58**. **webkit light shut**: masthead `[58.73,143.8,272.53,77.63]` both arms; board `[12,219.42,366,366]` both arms; `#fold-tools` 61.58 = 61.58. **Both engines dark sheet-UP**: the same three boxes identical. `--fold-tools-h` publishes **61.58px** (ck) / **61.580002px** (wk). **CHROME repainted 0 in all four cells.** | **CONFIRMED — the 2.21–2.22 px lift is dead** |
| **charter 2/3 · the berth reaches a coarse pointer** | My own arm probe, real `tap()` in a witnessed regime (`coarse:true, hover:false`), board dirtied at the first EMPTY input: **chromium 390×844 touch, webkit 390×844 touch, webkit 844×390 dark touch** all read berth `"a new board replaces this one"`, **opacity 1, visibility visible, armed true**; at rest `""` / opacity 0. Desk mouse cell (chromium 1280×800) the same. Pass 3 read `text: ""` in the touch cells. | **CONFIRMED, four cells** |
| **the critic's §2.5 (double-speak)** | `aria-label` = `Deal a new board` and the `aria-describedby` target = `Press again to deal a new board`; **`nameEqualsDesc: false` in all four cells**, both engines. | **CONFIRMED CLOSED** |
| **the critic's §2.7 (the floor's width half)** | `.act-answer` computes **`min-width: 44px`, `min-height: 44px`** (`--tap-floor` 2.75rem); painted **56×44** at 390×844 both engines, **44×44** at 1280×800. | **CONFIRMED** |
| **charter 10 · the node witness** | Ran bare: **11 checks GREEN, 11 plants each RED on its own check only**, exit 0. Then I copied the two subject files to a scratch tree and broke them for real, five ways, on clauses the plants do NOT cover: `min-height: var(--fold-tools-h, 3.5rem)` → RED 10; delete the whole `@property --fold-tools-h` block → RED 10; delete `contain: inline-size` → RED 9; plant a SECOND `contain: inline-size` → RED 9; delete `.icon-btn:has(> .act-face){padding:0}` → RED 11. **I could not make any new check pass on a broken tree.** | **HONEST GATE — nothing struck** |
| **charter 11 · W2 §2.2 reachability** | **[theirs]**, read off `readings/reach-*.json`: 4/4 bands reachable at 844×390 and 812×375, both engines, `coarse:true`, opened through the tab, card `clientHeight` 302 / 287, and the sabotage arm reds in every cell. The readings carry the regime, the hit element and the negative control. | accepted as theirs |
| **registry §2.10's struck gate** (COST's occlusion headline without the exempt count) | RE-CUT: one predicate, both trees, exempt printed beside covered. The struck gate counts again. | **RE-CUT** |
| **vitest** | `npx vitest run` bare: **68 files / 836 tests, all pass**, exit 0. Exactly as returned. | **CONFIRMED** |
| **the dist** | `npx vite build` in the work tree, own cacheDir → **`index-BUIDrd-OiOrV.js`, 43 files**, exit 0 — the prototype's own hash. `@property --fold-tools-h{syntax:"<length>";inherits:true;initial-value:0}` and `--ring-ink:var(--color-focus-sketch)` both ship in `index-CWXMZpFeJfr-.css`. | **CONFIRMED** |
| **`--ring-ink` provenance** | MRK-LIVE's `index.css` on `wf_f72f3b5a-83a-35` carries the identical four lines. Copied verbatim, cited, consumed bare ×2 (`, currentColor` struck). Control tree: 0 references. | **CONFIRMED** |
| **gates, bare** | `lint:copy` 0 · `lint:motion` 0 · `lint:theme-selectors` 0 · `lint:theme-tokens` 0 · `lint:ink` 0 · `lint:live-regions` 0 · `lint:cost-face` 0 · `lint:catch` 0 · `lint:sleep` 0 · `lint:tdz` 0 · `test:font-coverage` 0 · `prettier --check` 0 · `vue-tsc -p tsconfig.json` 0 · `vue-tsc -p tsconfig.e2e.json` 0. | **CONFIRMED** |
| **the two gates the prototype declared NOT RUN — I ran them** | **filter census: 12 passed / 0 failed, both engines, against the BUILT prototype dist on 4236** (`filter-census.spec.ts` G3.1/G3.2/G3.3/G3.5, "built dist" rows). **Goldens: 4 passed / 0 failed** off the same dist, `git status e2e/goldens` clean afterwards — **no re-mint, no golden move**. | **THEIR GAP 6 IS CLOSED — by the critic, not the lane** |

The pass's engineering finding is real and I reproduced it: **the face is the button's air.** A drawn
face padding `0.32rem 0.9rem` inside a button padding `0.3rem 0.5rem` is 9.6 px of doubled padding;
the ribbon's row grew 55.98 → 65.58, its published reserve grew 61.58 → 66, and on a centred column
half of that landed on the phone's masthead and board. `padding: 0` on the button that holds a face
returns all three numbers to the control's, byte for byte, in four cells.

---

## 2 · WHAT IS NOT CONVERGED

### 2.1 TWO CI LANES ARE RED ON THIS TREE AND GREEN ON THE CONTROL — neither is in the gate table

Run bare, in one script, with the control tree as the negative control in the same run:

| gate | this tree | control `74a2b5d9` |
|---|---|---|
| `npm run lint:lanes` | **EXIT 1** | EXIT 0 |
| `npx eslint .` | **EXIT 1** | EXIT 0 |

`lint:lanes` reds on exactly one thing, and it is this family's own centrepiece:

> `[1 UNCLAIMED SCRIPT] web/frontend/scripts/check-cost-face.mjs` — NO CI LANE names it and it
> declares nothing. It runs nowhere, so its green means nothing and its red would never be seen.

Charter row 10 asks for **the ruler law's CI witness** and the return marks it **CLOSED**. The
witness is eleven honest declarations that run in **zero CI lanes**: the diff adds `lint:cost-face`
to `package.json` (+1 line) and adds nothing to `.github/workflows/ci.yml`, whose 97 `run:` steps
name it nowhere. The estate's own lane-membership gate says so, and that gate self-tests.

`eslint .` reds on three `no-regex-spaces` errors in `scripts/check-cost-face.mjs:357, 398, 408`.
The prototype's gate table lists twelve gates and opens neither of these two.

### 2.2 THE RING'S AA IS TOKEN ARITHMETIC UNDER A PAINTED LABEL — and painted is a point lower

`probe/p4-ink.mjs` reads `getComputedStyle(...).outlineColor` and composites it over a computed
ground in JavaScript. No pixel is sampled. The LAWS are explicit: *AA on both themes from PAINTED
bytes for any hairline or stroke (token arithmetic over-reports)*. A 2 px outline is a stroke.

I read the bytes. Keyboard focus genuinely on (`:focus-visible` asserted `true`), element
screenshot of `.deal-face` off the built dist, ring pixels matched to the token and the ground
sampled 4 px either side of the ring's own edge at its mid-row:

| cell | painted ring | ground it ABUTS (the face's drawn stroke) | ratio | ground inside (the face's paper) | ratio |
|---|---|---|---|---|---|
| chromium light | `rgb(58,123,196)` | `rgb(29,29,29)` | **3.861** | `rgb(238,238,237)` | 3.760 |
| chromium dark | `rgb(58,123,196)` | `rgb(219,218,215)` | **3.123** | `rgb(36,34,33)` | 3.628 |
| webkit light | `rgb(58,123,196)` | `rgb(23,23,23)` | **4.106** | `rgb(232,232,231)` | 3.561 |
| webkit dark | `rgb(58,123,196)` | `rgb(226,225,222)` | **3.338** | `rgb(41,40,38)` | 3.374 |

The return says **4.289 light / 4.286 dark**. Painted, the worst column is **3.123** — the ring
still clears the WCAG 1.4.11 non-text floor of 3.0, and its **headroom is 0.123, not 1.29**. The
arithmetic over-read by up to 1.17 points because it composited against the card's paper, which is
not the surface the ring touches: the ring is drawn at `outline-offset: -2` INSIDE a face whose own
edge is a 2.5-stroke `HandDrawnOutline`. The token is right; the number that was reported is not
the number the reader sees.

### 2.3 `ringOnFace` AND `ringOnCard` ARE ONE MEASUREMENT PRINTED TWICE

In every one of the eight `readings/ink-*.json`, `ring.faceGround` computes `rgba(0, 0, 0, 0)` and
the probe's `over(...) ?? cardGround` therefore substitutes the card. So `ringOnFace === ringOnCard`
identically (4.289 = 4.289 light, 4.286 = 4.286 dark). The sentence *"against both the face's
ground and the card's paper"* names two grounds and measures one. This is the printed-count
tautology class registry §2.10 already struck once for CTRL-FACE.

### 2.4 BALLOT T9-B9's CENTRAL NUMBER NAMES THE WRONG OCCLUDER — the row that reaches the owner

The new ballot asks the owner to retire owner mark **T9-M03**'s mechanism, and its whole measured
case is the comparison in its own table:

> **0 of 25/26 controls covered at every scroll offset** … against **HEAD's own sticky heading
> covering 1–3 of 21** at the desk and **1 of 19** on the phone

I tallied the occluder field in the lane's own readings. Every covered hit on the control names
the same one:

| reading | covered hits across all offsets | occluder |
|---|---|---|
| `occl-head-chromium-1280x800.json` | 14 | **`action-bar` × 14** |
| `occl-head-webkit-1280x800.json` | 14 | **`action-bar` × 14** |
| `occl-head-chromium-390x844.json` | 1 | **`action-bar` × 1** |
| `occl-head-webkit-390x844.json` | 1 | **`action-bar` × 1** |

Not one hit is occluded by the sticky washi tag. The thing covering controls at HEAD is the
`.action-bar` — **T9-B8's subject**, which this lane's own arm A deletes. Under this predicate
HEAD's sticky tag covers **0**, so the ballot proposing to retire the tag carries no measured case
against the tag at all. Either re-cut B9's number against the tag itself (the chair's §6.3(a)
orphan-field readings, 4/14 and 4/13, are the live defect), or withdraw the comparison. As written,
a fork going to the owner attributes one mark's defect to another mark.

### 2.5 THE π HEADLINE IS FALSE IN ONE OF ITS FOUR CELLS

The return's π row 2 says: *"1280x800 and 390x844-dark-sheet-up = CHROME moved 0, CHROME repainted
0 …, CHROME unmatched 0, both engines."* My census of that exact cell:

| cell | CHROME moved | CHROME repainted | CHROME unmatched (head-only / proto-only) |
|---|---|---|---|
| chromium 390×844 dark sheet-UP | 0 | 0 | **22 / 0** |
| webkit 390×844 dark sheet-UP | 0 | 0 | **22 / 0** |

The 22 are the entire `#fold-tools > .play-controls` subtree — `icon-btn#0/#1/#2` with their svgs,
paths and sublabels, plus `icon-btn.peek-chip#3` and its word — present at HEAD with the sheet up
and absent on the prototype, because the Teleport is disabled and the verbs ride into the card.
That mechanism is declared and measured in charter row 4. The π sentence covering it is not: by
the instrument's own scope (it excludes only `.controls-card`, `#controls-drawer`, `.drawer-case`)
the ribbon is an unclaimed surface, and 22 nodes leave it. "Unmatched 0" is the one word to fix.

### 2.6 THE π CHROME COLUMNS ARE IN NO BANKED LOG, AND THE RAW IS DELETED

`grep -c CHROME` over all eleven banked logs returns **0**. `logs/cost-p4-pi.log` was written by a
differ that printed only `MOVED n / REPAINTED n / unmatched head-only n / proto-only n` — its six
headlines read `head 925 / proto 827`, `head 855 / proto 903`, and so on, with no CHROME split.
`probe/p4-pi-diff.mjs` as banked does print the split, so the tool and the log are from different
moments; and `readings/` holds a summary, the 5.7 MB of raw rects having been deleted. **The
headline numbers of the family's headline row cannot be re-derived from the bank.** I reproduced
them independently, which is why this is a record gap and not a fabrication — but the record is
what survives the pass.

### 2.7 THE @PROPERTY LAW'S FOURTH CLAUSE IS UNRUN FOR `--fold-tools-h`

The registration is in `scene.css`, `inherits: true`, `initial-value: 0px`, it ships in the dist,
and check 10 holds four of its clauses from source (I broke two of them myself and both redded).
What is missing is the clause the LAWS spell out: *the born-RED ablation runs on a host that
DECLARES the token*. No reading deletes the publisher and reads the collapsed band, on either
engine. Row 7 is closed at the declaration; it is not closed at the behaviour, and the whole
argument for `0px` over the struck `3.5rem` is a behavioural one.

### 2.8 THIRTY ESTATE ROWS ARE RED, AND THE MARK-BASED EXEMPTION COVERS ABOUT HALF OF THEM

**[theirs, verified from the banked log]** `zone-grammar` + `viewport-law` + `board-covisibility`
+ `join-language`: **48 passed / 30 failed**, both engines — 15 distinct rows × 2. The lane's
reason for leaving all thirty red is that re-aiming them *"would be re-wording a gate to pass over
a subject two owner marks still own."* That reason reaches six of the fifteen:

- §2.5 no washi tape covers an interactive element · §2.6 the tag stays pinned (rail) · §2.6 the
  tag stays pinned (drawer) · the tape is a LABEL not a tooltip · every zone is named by its own
  VISIBLE tape · the action bar rides the card's scrollport.

It does not reach the other nine, none of which carries a mark:

- *the tally files with the deal* — fails on `#controls-drawer .deal-row .difficulty-tally` count
  0; the tally is alive on this design at another address, visibly so in frame f1 (`dealt ‖‖‖‖`).
- *the roster row: the name lands in their ink* (§11's) · *the checking well says one thing* · *a
  frozen well mints ONE pose node* · *rendered-name census, rail* · **and four a11y-law rows**:
  *the staged headings are HEADINGS for assistive tech*, *the heading lock holds on the CARD too*,
  *the coarse card … a 44px floor in BOTH dimensions*, *the pair branch keeps a 44px floor in BOTH
  dimensions*.

Nine lawful address re-aims are being carried under an exemption that belongs to six others. The
last two in that list are the same floor law this pass was praised for closing on `.act-answer`.

### 2.9 SMALLER, EACH CLOSABLE

- **`--tap-floor`'s fallback grew this pass.** `var(--tap-floor,` counts **10 in this tree against
  the control's 6**, and one of the four the design added is the pass-4 line
  `.act-answer { min-width: var(--tap-floor, 2.75rem) }`. The return names "four consumers" and
  frames the row as HEAD's idiom and the leader's to close; the tree's number is 10 and the design
  minted one more this pass. Check 8's regex (`/min-width:\s*var\(--tap-floor/`) accepts the
  fallback by construction.
- **A touch-armer who reaches for the keyboard has no focused answer.** Reproduced here:
  `focusAfter` = `BUTTON.icon-btn act-btn act-verb deal-btn` on chromium, **`BODY`** on WebKit, in
  every touch cell and at the desk. Named by the lane, still open.
- **The unmatched-π description undercounts.** The return says the unmatched CHROME set is *"that
  face's own `div.outline-container.act-face` + 4 outline `g > path`"*. Measured in the light
  sheet-shut cell: **18 proto-only CHROME nodes and 8 head-only**, both engines — the hint button's
  whole subtree swapped for the face's. Same substance, wrong count.
- **`font-census.spec.ts:231` red both engines** (`Patrick Hand|Easy`, comment "closed-tab value
  (UI-12)"). Named by the lane; a ledger retirement is a copy-corpus act and stays open.
- **The chair's banked `pass3/prototype/CTRL-COST/pass3.diff` does not apply.**
  `git apply --check` refuses: *"cannot apply binary patch to
  `web/frontend/src/assets/fonts/fraunces-subset.woff2` without full index line"* — the patch was
  cut without `--binary` and carries only `Binary files … differ`. It replays 20 of 21 files
  (`--exclude` on the woff2 applies cleanly, which is how this critique reconstructed the pass-3
  tree). The prototype's replay route cites that patch as "the record"; it is the chair's row, and
  it is named here rather than fixed.
- **`web/frontend/dist-throttle/` (a pass-3 build, 2026-09-18 21:58) is still in the work tree.**
  It is gitignored, so the hygiene sentence is literally true; the statement "the dist was deleted
  at return" is true of `dist/` only.

---

## 3 · CHECKLIST HITS

- **the constraint it forgot** — AA from PAINTED bytes on a stroke (§2.2); the `@property` law's
  fourth clause (§2.7); two CI lanes the gate table never opened (§2.1); §6.5's fallback idiom
  grown by one line this pass (§2.9).
- **gates that cannot fail** — NOT hit on the node witness: I broke the tree five ways on clauses
  the plants do not cover and every one redded. Hit once, softly, on `check-cost-face` itself,
  which **runs in no CI lane at all** (§2.1) — a gate that never runs cannot fail either.
- **the pixel it moves that it did not declare (π)** — 22 CHROME nodes leave the ribbon in the
  dark sheet-UP cell under a headline that says 0 (§2.5).
- **printed-count tautology / a headline computed under a predicate** — one ring ratio printed as
  two grounds (§2.3); the occlusion exempt count is now printed in §1 and is still absent from the
  ballot table that reaches the owner (§2.4).
- **unverified gestalt** — NOT hit. The four crops are real: f1/f2/f3 are `hasTouch` contexts armed
  by `tap()` and each shows the berth's sentence painted at the band head; f4 shows the focus ring
  on the real surface. I looked at all four.
- **the elegant-reduction trap** — still half-hit: 30 estate rows red, nine of them lawfully
  re-aimable (§2.8).
- **spec-cites-itself** — NOT hit; the lane corrected itself against interest six times in §8.
- **legacy aliases · consumer-less substrate · masked fallbacks · vacuous convergence · the generic
  default** — NOT hit. `--ring-ink` now has a declaration and two bare consumers; the
  `currentColor` masks are struck; the idiom is drawn boxes and lowercase words, not cream-and-
  terracotta.

---

## 4 · STRENGTHS

1. **The pass-3 blocking π row is genuinely dead, and it reproduces under a stranger's census.**
   Masthead, board and `#fold-tools` are identical to the control to the hundredth in four cells,
   both engines, both sheet states, with CHROME repainted 0. The cure is one declaration and the
   mechanism generalises.
2. **The consequence sentence now reaches a thumb.** A real `tap()` arms and berths the note at
   opacity 1 in three touch cells including 844×390 WebKit; at rest it reads `""`. The family's own
   thesis is finally true on the pointer class it was written for.
3. **The browserless witness is honest beyond its plants.** Eleven checks, eleven plants, and five
   independent real breaks on a copied tree that I could not make pass.
4. **The two gates the lane declared NOT RUN are green.** I ran them: filter census 12/12 both
   engines at budget 9 off the built dist, goldens 4/4 with no re-mint. The lane under-claimed.
5. **A2 has a real estate row with a real negative control**, in `access.spec.ts`, with the
   covering surface excluded by a predicate the spec states and a planted button proving the census
   can see into the region — the incident §8.3 that produced it is the right kind of self-report.
6. **The merge-watch statement is answered with a number on both trees**, and the answer costs the
   lane its own claim to being a family. That is the pass's most expensive honest sentence.

---

## 5 · CONVERGENCE — 78%, EARNED

Up from 70/72. A running prototype on the real surface in both engines; the blocking π regression
cured and reproduced by an outsider; the consequence copy reaching a coarse pointer in three touch
cells; the double-speak and the width floor closed and re-measured; a node gate that survives five
real breaks; and two declared-open gates that turn out green when someone runs them.

Held below that by: an AA row that is arithmetic under a painted label, whose painted worst column
is **3.123** against a claimed 4.286 (§2.2); a ballot going to the owner whose central number names
the wrong occluder, so that a case against one mark is built out of another mark's defect (§2.4);
two CI lanes red on this tree and green on the control, one of them redding on the very file the
CI-witness row rests on (§2.1); a π headline false in one of its four cells and unreproducible from
the bank in all four (§2.5, §2.6); the `@property` law's ablation clause unrun (§2.7); and thirty
estate rows red of which nine carry no mark and no exemption (§2.8). Fifteen open gaps, four of
them constraint-class, one of them owner-facing and wrong.

**VERDICT: ADVANCE.** No missing primitive — every gap above is a sentence with a number attached
and a person who can close it, and nothing here is a rewording or a constraint the design cannot
meet. The centre folds as the graft list its own merge statement describes; the two policy rows
(the ask is pointer-agnostic; the answer is a real control with a floor in both dimensions) ride to
W1 §1.5 / U-10 intact. The number is the critic's, and it is not a clean pass.

---

## 6 · CROSS-POLLINATION

1. **THE FACE IS THE BUTTON'S AIR.** A drawn face that pads inside a button that pads is doubled
   padding, and on a centred column half of any such growth lands on the board. Every §10 lane that
   puts a drawn box inside a button inherits `padding: 0` on the host — the gallery's `.guard-btn`
   has done it since the face was minted. Verified here as an identity, not an argument.
2. **A painted-contrast row samples BYTES, and it samples the ground the stroke ABUTS.** This
   lane's arithmetic over-read its own ring by up to 1.17 points and turned 0.12 of headroom into
   1.29, because it composited against the card's paper while the ring is drawn at offset −2 inside
   a 2.5-stroke drawn edge. Any lane claiming AA on a hairline runs the pixel read against the
   neighbouring pixel.
3. **An occlusion headline names the OCCLUDER, not only the count.** Printing `exempt` beside
   `covered` was pass 3's lesson and it was taken; the next one is `by`. Without it a foot's defect
   was tallied against a tag, in a ballot.
4. **A new script is not a CI witness until a lane names it**, and the estate already checks this
   for free: `npm run lint:lanes` reds on any `.mjs` in `scripts/` that no workflow step runs. Every
   lane minting a browserless gate runs it before claiming a CI row.
5. **A source gate with N clauses needs N plants — or a critic who breaks a copy.** Checks 9 and 10
   carry three and four clauses on one plant each; copying the two subject files to a scratch tree
   and breaking them for real proved the other five in a single command. Cheap, and it is what
   "a gate a critic proved cannot fail" actually costs to test.
6. **ARMED as a third summoning path.** A berth summoned only by `pointerover` and
   `focusin:focus-visible` is a desk-only berth: a tap supplies neither and a click is not
   `:focus-visible`. Letting the standing question own the one berth slot, outranking the hovered
   note, makes consequence copy pointer-agnostic. Any lane grafting the berth-in-the-head takes
   this with it.
7. **A differ that classifies its output must bank the classified output.** A log from an older
   version of the tool plus deleted raw JSON leaves the headline unreproducible even when the
   headline is true.
