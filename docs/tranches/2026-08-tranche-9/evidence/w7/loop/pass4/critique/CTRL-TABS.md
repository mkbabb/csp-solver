# T9-W7 · pass 4 · CRITIQUE · CTRL-TABS: the unblock rows

This is an adversarial, non-author critique. The prototype's work tree is
`.claude/worktrees/wf_f72f3b5a-83a-34`, in place at `74a2b5d9` with pass3.diff applied plus the
pass-4 delta.

- **Tree:** I rebuilt it myself with a private cacheDir. `vite build` exited 0 and produced
  `index-D8OwVfe4bGG9.js` with 43 files, which **reproduces the prototype's dist identity**. I
  served it with `vite preview` on `127.0.0.1:4235`.
- **Control:** the chair's `w7-control` dist, `index-CubiZsMVSwTc.js` = `74a2b5d9`, served on
  `127.0.0.1:4236`.
- **Port checks:** both ports were verified by asset hash, and every row reads the hash from
  the page.
- **Board:** one board on every arm, the codec payload `?board=ATMuNTMw…MDc5`.
- **Pointer:** coarse rows ran with `hasTouch: true`, and `matchMedia('(pointer: coarse)')`
  read true on every page.
- **Cleanup:** both servers were killed by recorded PID and both ports read empty afterwards.
  The scratch configs, cacheDirs and dist were deleted. The work tree's `git status` matches
  what the prototype returned: 15 M plus the untracked `gridPaths.cuts.test.ts`.
- **Evidence:** instruments are in `critique/CTRL-TABS/instruments/`. Readings are summarised
  in `critique/CTRL-TABS/readings/census-summary.txt`. I added no crops, because the family's
  four are the prototype's.

**Convergence: 57%. Verdict: BANK.**

The chair's unblock asks are met on paper: the fallback is built, W2 §2.2 is green, the ballot
is written with frames, L5 is restored, and L1 is proposed with a firing control. The family
has earned its exit from BLOCKED. But the default arm it hands the owner has four problems:

- It is worse than HEAD on every phone: the board sits 20 px further off-centre.
- Its "restored" tags run none of T9-M03's mechanics.
- At the shortest desk rung the card's acts and its tabs are mutually exclusive.
- The pass-3 thesis tests are still red.

The landscape flank is a real win, and the primitives are sound. Bank those with the §10
leader.

---

## 1. What I re-measured (both engines, my own instruments, not the prototype's)

| reading | prototype | critic | verdict |
|---|---|---|---|
| portrait coarse offCentre, 390×844 · 360×640 · 390×664 (tree / HEAD) | 39.27/39.58 vs 19.27/19.58 (43.69/43.98 vs 23.69/23.98) | **39.27 / 39.58 vs 19.27 / 19.58; 43.69 / 43.98 vs 23.69 / 23.98; 39.27 / 39.58 at 390×664** | reproduced |
| paper.y tree − HEAD | −20.00 | **−20.00** at all three cells, both engines | reproduced |
| tuck · berth.h · `#fold-tools` · play tools in view (portrait coarse) | −6.00 · 40 · present · 4/4 | **−6.00 · 40.00 (HEAD 0) · present, fold.y +20.00 · 4/4** | reproduced |
| landscape coarse undo/redo/hint in view (844×390 · 812×375 · 900×500) | 3/3 vs HEAD 0/3 | **3/3 vs 0/3** (HEAD y 1070.6 / 1055.6 / 1180.6), each button 44 × 49.58, both engines | reproduced |
| landscape card clientHeight / scrollHeight | 295/295 · 287/295 · 284/295 (HEAD …/743) | **295/295 · 287/295 · 284/295; HEAD 302/743 · 287/743 · 284/743** | reproduced |
| `controls` tongue hit share (63-point grid) | 54 · 48 · 42 (HEAD 54) | **54 · 48 · 42 vs 54 · 54 · 54**, both engines | reproduced |
| §2.4 toggle theft at 1024×768 | RED, `pencils` under the toggle | **RED: `pencils` tab ∩ toggle box 737.8 px² (chromium) / 768.6 (webkit), and a click at the overlap centre lands on `button.sun-moon-toggle`. HEAD: 0 overlaps.** | reproduced |
| dist identity | `index-D8OwVfe4bGG9.js` | **the same hash, rebuilt from the tree** | reproduced (the dist is the tree) |
| r0 law probe (a COPY with FE re-pointed; the chair's L3 is landed) | L1 RED (5), R3 GREEN | **tree exit 1: L1 RED "sum to 5", R3 GREEN. Control exit 0: L1 GREEN, R3 RED.** | reproduced |
| unit | 14 carried reds | **14 failed / 35 passed** over `GameControlPanel.test` + `liveRegions.test` + `gridPaths.cuts.test` (8 are `emitsOptions`, 6 are GCP) | reproduced |
| `check-copy-register` / `check-font-coverage`, bare | exit 0 / exit 0 | **exit 0 / exit 0. PLANT (an em dash plus `ẞquad` in the `players` tag): exit 1 / exit 1.** Restored and cmp-verified. | both gates bite on this tree |
| live `url(` filter population, built dist, 1280 fine + 390 coarse | census 12/12 | **tree 4 vs HEAD 8** at both cells and in both engines (element count, not the census spec) | the budget never grows |
| painted contrast of the face-up tag (element-screenshot bytes, 1280 fine) | not run | **light 17.36:1 / dark 9.12:1, identical to HEAD** in both engines | π holds on the tag's INK |

The prototype's numbers are honest. Every figure I re-ran reproduced to the hundredth. Its
self-reported gap list (15 rows) is also accurate. The findings below are the ones it did not
report.

---

## 2. What the prototype did not find

### 2.1 The "restored" tags are HEAD's component, not HEAD's mark (π on the surface the ballot claims to keep)

Ballot Arm A claims that the four section tags stay "as HEAD has it (T9-M03)". Here is what the
computed styles read at 390×844 coarse, in both engines:

| tag property | HEAD `74a2b5d9` | tree (Arm A) |
|---|---|---|
| parent | `.outline-container` (the well) | `.tray` (the well is deleted) |
| `top` (the pin line) | **−3.6px** (`0.15rem − --card-pad-t`, pinned at the case edge) | **4.8px** (the `0.3rem` masked fallback in `SheetWashiLabel.vue:166`) |
| `margin-top` (the straddle pull) | **−24.64px** | **0px** (it pays a line box, which is the tray's +22–23) |
| `z-index` | **35** (the ladder: sentinel 30 < pinned tag 35 < hover tape 50 < bar 60) | **50** (the hover-tape rung) |
| names its compartment (`aria-labelledby` → the tag's id) | **true** (the tape IS the well's accessible name) | **false**: `tagId()` is minted and referenced by nothing, so the tape is orphan text beside the tab's name |

The undefined-token census (`instruments/undef-token-census.py`) makes this mechanical. The
tree adds **four referenced-but-undeclared tokens** that the control does not have:
`--washi-tag-top`, `--washi-tag-lift`, `--washi-tag-gap` and `--washi-tag-inset`. Their only
declarer was `.tray-well`, which the tree deletes. The tags therefore run entirely on
`SheetWashiLabel`'s fallbacks.

The tree also retired `data-under-bar`, the tape's dissolve at the bar (`GameControlPanel.vue:755`),
together with the tapes, and did not bring it back when the tapes came back. It is gone.

On the desk the sticky state cannot be reached. The tree's tag starts at y 128.2 in the card
and scrolls to 63.2 (1280×800) or 96.2 (1440×900) at the end of the card's scroll range, and it
never pins. That matches the prototype's own finding that e2e viewport-law:575/:610 cannot reach
§2.6's sticky state.

What the ballot actually offers is a tape with the right word and seed laid in flow on a pin
line that nobody declared. That is a legacy alias (the old name, new mechanics), not the mark,
and frame f3 shows the alias. The painted ink is identical to HEAD (17.36 / 9.12), so the only
moves are pose, rank and name binding, and none of them is declared.

### 2.2 The shortest desk rung: the card's acts and its tabs are mutually exclusive (the charter's row 9 re-derivation, now done)

The tree drops the sticky bar and the fold cue (row 19), and the card scrolls on the desk. At
scrollTop 0 on the tree (fine pointer, both engines):

| cell | card sh/ch | floor rows | 2nd floor row below the card's bottom edge | act centres hittable | tabs hittable after scrolling to the acts |
|---|---|---|---|---|---|
| 1024×768 | 671/576 | 2 | **+36.78 / +36.72 px** | **1/5** (only `deal`) | **0/5** (the raised `new game` at yRel −75) |
| 1280×800 | 673/608 | 2 | **+6.75 / +6.72 px** (the chrome straddles its case edge) | 5/5 | **2/5 chromium, 3/5 webkit** (the raised tab lost) |
| 1440×900 | 674/640 | 2 | −23.98 / −24.06 | 5/5 | 5/5 |

The control, at 1024×768 and 1280×800 in both engines, reads `.action-bar` `position: sticky`,
5/5 acts inside the card, and `data-fold-below` present.

So at 1024×768, `clear`, `fill`, `solve` and `share` sit 36.7 px below the card with no fade
cue, and scrolling down to reach them scrolls all five tabs out of the card. The pass-3 comment
at `GameControlPanel.vue:2093` reads "a card that cannot scroll has no fold to dissolve". That
is the elegant-reduction trap: the design assumes a card that fits, and at the desk's shortest
rung it does not. The prototype's gap 4 names the scroll. It does not name the lost acts or the
lost navigation, and it did not measure 1024×768 at all.

### 2.3 The family's own thesis tests are among the 14 carried reds

These two are not inherited HEAD tests. They are the pass-3 re-aims, written in the family's own
voice:

- *"six co-equal eyebrows become four tab words, and the rows are named one rank down"*:
  `expected ['Size','Level','marks', …] to deeply equal ['marks','what fits']`.
- *"the desk's index tabs: drawn === announced, per tab"*: `expected 5 to be 4`.

A third, *"the checking well says one thing: its chips"*, collects the pencils tray's modes
(`['Normal','Corner','Center',…]` against `['Off','Ask','Live']`). The inert-tray scoping in the
test does not isolate the face.

"0 added" is true. "Carried" understates it: the family's central unit claims are red on its
own tree.

### 2.4 New masked fallbacks in the lane's own diff

The diff adds **6 × `var(--tap-floor, 2.75rem)`**. `--tap-floor` is W2's static token
(`App.vue:961`). Registry §2.9's logic says a static declared token needs no fallback, and
PLR-SELF carries the same form as a gap. It also adds **2 × `var(--tongue-tuck, 0.5rem)`** (in
`DrawerTab.vue` and `GameControlPanel.vue`) on the lane's own token.

That token is declared only inside `GameBoard.vue`'s portrait block on `.board-edge`, so the
"tongue and berth read the same two numbers" claim is false as written: the 0.5rem literal is
spelled three times. `--strip-len` is clean. It is consumed bare and registered once in
`index.css`, the first static stylesheet (`main.ts:11`), with `inherits: true`. Its `0px` initial
fails visibly (5 tabs over the tray), and the ablation runs on the declaring host
(`.controls-card`). All four clauses of the @property law hold.

### 2.5 R3's GREEN is bought with an L5 RED, and r0's R3 regex cannot tell them apart

The prototype is right that `.action-bar { border-top: 2.5px solid … }` is a CSS border on
chrome. Chair §1.3 counts that as an L5 RED row. Worse, the r0 probe's R3 test is
`/border|HandDrawnOutline/.test(bar)`, which also passes on `border: none`. **R3 is a gate that
cannot fail on the word "border".** It is r0's instrument, so it goes to the chair's row, not this
lane's. Until it is re-cut, R3 GREEN counts for nothing on any tree.

### 2.6 The L1 proposal's premise is a HEAD surface this family deletes in BOTH arms

L1 moves 9 → 5 because `BoilDivider`'s four poses leave. The divider is HEAD's peek
`role=separator` surface. In the "fallback", which is presented as the conservative arm, it is
still deleted: mobile-affordances:339 is red in Arm A. The ceiling form (≤ 9, a plant at 10
reds, exit 1) is a sound gate. But the ballot's framing ("A keeps HEAD's estate except the edge
berth") omits that A also retires the divider and re-cuts the whole card into tabs. That is the
family's thesis, and it is stated nowhere in the ballot's A column.

---

## 3. Gaps that hold the number (each closable, numbers attached)

1. The Arm A tags are not T9-M03. There are four undeclared `--washi-tag-*` tokens, the pin sits
   at 4.8px against HEAD's −3.6px, the margin is 0 against −24.64, z is 50 against 35, and they
   name nothing (`aria-labelledby` 0/4 against 4/4). `data-under-bar` is gone. Re-seat the
   tray's lane terms and the name binding, or declare every delta in the ballot's A column.
2. At 1024×768 on the desk, 4/5 floor acts sit 36.7 px below the card with no cue, and
   scrolling to them leaves 0/5 tabs hittable (both engines). At 1280×800 the floor's second
   row straddles the case edge by 6.7 px and 2–3/5 tabs are lost at the end of the scroll range.
   HEAD is sticky at 5/5.
3. Arm A de-centres every phone board. offCentre is 39.27/39.58 against HEAD's 19.27/19.58
   (43.69/43.98 against 23.69/23.98 at 360×640), because 40 px of berth holds only the tongue in
   portrait.
4. §2.4 toggle theft is RED at 1024×768: the `pencils` tab ∩ toggle is 737.8 / 768.6 px², and a
   click at the centre flips the theme (both arms, both engines).
5. The landscape strip takes the cued entry's hit area: the tongue keeps 48/63 at 812×375 and
   42/63 at 900×500, against HEAD's 54/63 (both arms, both engines).
6. There are 14 unit reds, the family's two thesis tests among them ('expected 5 to be 4', the
   eyebrows row), and none was re-aimed.
7. There are 7 e2e reds in Arm A (board-covisibility:70/:397, viewport-law:287/:575/:610,
   mobile-affordances:339/:435) and 11 in Arm B, none re-aimed.
8. Row 19: the fold chrome (`publishFold`, sentinel, `scroll-padding`, `data-fold-*`) is retired
   against a card that scrolls, 63–95 px on the desk and +8/+11 in landscape. It is neither
   restored nor declared against W2 §2.3.
9. Rows 8/9: the raised tab is in row 0 of a two-row strip at every desk rung, and the berth
   costs 101 px of content box.
10. Row 7: the desk band moves the board, masthead and wordmark by 0/−2.16/−2.37/−2.58/−3.14
    px. This is the chair's §6.4 fork and remains open.
11. R3 GREEN rests on a CSS `border-top` (an L5 RED per chair §1.3), and r0's R3 regex passes on
    `border: none`, so it cannot fail.
12. The lane's diff adds eight masked fallbacks: 6 × `var(--tap-floor, 2.75rem)` and
    2 × `var(--tongue-tuck, 0.5rem)`.
13. Row 11: the browser half (open feet within 2.5 px of the lid) is unmeasured, and SILENCE 4's
    negative control is not demonstrated.
14. Row 12: `inkLiftMs` is a literal 150ms, not the rung, and the undefined-token census for
    timing slots was not run by the lane.
15. The scroll gate still has no ablated negative control. It only fails by accident at
    812×375 and 900×500.
16. Row 16: the confirm contrast, LAPSE and press-count rows were not run. Row 17: the armed
    confirm and the tab-swap glide were not framed. Row 18: the hue census, accent kinship,
    TAPE's rows and R7 I2/I3/I4 were not run.
17. The fallback's tag repeats the tab word, and AT hears the tab name plus orphan tape text.
18. The two confirms disagree (bare `keep` in the card, boxed in the gallery) until the L5
    PROPOSED diff is ruled, and the diff's own comment promises gallery goldens that are not
    priced.
19. The ballot's A column omits that A also deletes `BoilDivider` and re-cuts the card into tabs
    (mobile-affordances:339, L1 9 → 5).
20. The charter's "duplicating" fallback was not built. The partition by regime is declared but
    is not the charter's form.

## 4. Checklist hits

- **Legacy aliases:** the Arm A tags (§2.1).
- **Masked fallbacks:** the tags ride `var(--washi-tag-top, 0.3rem)` with the token undeclared,
  and there are 8 new fallbacks in the lane's diff (§2.4).
- **The elegant-reduction trap:** "a card that cannot scroll has no fold" at 1024×768, where 4/5
  acts are clipped and 0/5 tabs remain after the scroll (§2.2).
- **Gates that cannot fail:** r0's R3 regex (§2.5); the scroll gate without an ablation (gap 15).
- **The pixel it moves that it did not declare:** tag pose, rank and name binding (§2.1); floor
  clipping at 1024/1280 (§2.2); the divider deleted in the "fallback" (§2.6).
- **The constraint it forgot:** W2 §2.3 (the card's chrome straddles its case edge by 6.7 px at
  1280; the fold cue is gone); the undefined-token census (+4 tokens); L5 (the CSS border);
  T9-M03's pin and name, which U-10 says only the owner retires.
- **Spec-cites-itself circularity:** the family's thesis tests are re-aimed to the family's own
  claims, and they are red.
- **Unverified gestalt:** the armed confirm and the glide are still unframed.

Clear:

- **Vacuous convergence:** the thesis falsified itself on numbers.
- **Consumer-less substrate:** `--edge-strip-h`, `--strip-len`, `omit`/`gap` and `--ring-ink` are
  all consumed.
- **The generic default:** the strip is the estate's tongue idiom.
- **M16:** 0, and the gate bites.
- **filterBudget:** 4 ≤ 8 live on the built dist; L1's ceiling bites at 10.
- **AA:** the tag is painted at 17.36/9.12, identical to HEAD.
- **The @property law:** all four clauses hold on `--strip-len`.

## 5. Strengths

1. **Honest, reproducible numbers.** Every figure I re-ran matched to the hundredth, in both
   engines, and the dist hash rebuilds identically.
2. **Pass 3's centring win is exposed as a fine-pointer artefact**, and the spec's 19.27 is
   restored as the coarse truth. The lane self-refuted its own family's headline.
3. **The pass-3 fallback's hidden defect was found and cured**: the play tools sat at y −6.41,
   off-screen, and the fix scopes the edge pose to `#board-edge-tools`.
4. **Peek on the flank cost the cued entry two thirds of its hit area.** The lane found this
   with an occlusion grid that the §2.2 presence row cannot see, then cured it (24/18/12 → 54/48/42).
5. **Sound gates.** The `--strip-len` publisher born-RED was re-cut after its first draft could
   not fail. The L1 ceiling has a firing plant.
6. **The landscape flank is the one unambiguous product win**: undo/redo/hint go from 0/3 to 3/3
   in view at three coarse cells in both engines, at 44 × 49.58.
7. **The incident list declares the tree/README mismatch before touching a file.**

## 6. Verdict: BANK at 57

The block is lifted. The ballot exists with both frames on one encoded board, and §2.2 is green.
But the owner would be choosing between two arms that each carry these costs:

- **Arm A:** worse phone centring than HEAD by 20 px, and tags that are the mark in name only.
- **Arm B:** retires two owner-marked surfaces.
- **Both:** at the desk's shortest rung, the card's acts and its navigation cannot be on screen
  together.

Curing the desk needs design, which this charter forbids. Pass 5 is the earliest 100, and it
cannot close 20 gaps, two of them design-level. Bank the yields with the §10 leader (CTRL-FACE)
and carry T9-B-TABS to the owner only after gap 1 (the tag's mechanics) is declared in the A
column. As written, f3 frames an alias.

## 7. Cross-pollination

- **Landscape flank tools** (§10 leader): the three play tools on the board's flank, 44 × 49.58,
  0/3 → 3/3 at 844×390, 812×375 and 900×500. Take them without `peek` and with the flank ending
  above the tongue, so the tongue keeps its 54/63.
- **The occlusion grid** (63-point `elementFromPoint` over a cued entry) belongs beside every W2
  §2.2 presence row. Presence is not reachability.
- **The two-floor-row desk census** (`critic-floor3.mjs`): every §10 tree that un-sticks the bar
  should read act centres against the card's bottom edge at 1024×768.
- **The undefined-token census diff (tree minus control)** catches a component restored without
  its declarer. MOT-VERB's census should diff against the control, not just list.
- **r0's R3 regex passes on `border: none`**: the chair's row. Re-cut it to `HandDrawnOutline`
  present and no CSS `border` longhand with width > 0.
- **`openRing`, berth = protrusion, and `contain: inline-size`** stand as banked in registry §3.5.
