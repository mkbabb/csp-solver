# LANE B — STAGE B · F1's TICKET LANDS · pass-3 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`573317aa` (Lane C's stage-C close). **Two commits, nothing pushed:**

| commit | what |
|---|---|
| `a2865f29` | the chip seam — adjacent options get 7.19px, and a gate that goes red without it |
| `18f92c26` | a tape that never hides is a label — `role="tooltip"` off the permanent washi |

Rig `…/pass3/rigB/` · shots `…/pass3/shots/B-*.png` · dists `…/pass3/dist-{base,B0,B1,Bfinal}`
(`dist-B1` and `dist-Bfinal` are the **same bundle**, `index-CGMd2oKuWv7P.js` — every number and
every shot below is single-tree with the committed HEAD). `frontend-design` invoked before the
visual work; its calibration here was **restraint** — the deliverable is *air*, not a look.

---

## 0 · THE HEADLINE, AND WHY THIS TICKET IS SMALLER THAN ITS ORDER

F1's pass-3 order was written against F1's own pass-2 build. Stages D and C landed first, and
**Lane C's zone grammar carried the ticket's grammar as content** (wells, washi tags, the
heading collapse, the two deleted shells, the pose prune). So this stage is the residue, and
the residue splits three ways, all of it re-derived against HEAD rather than replayed:

| order | disposition |
|---|---|
| 1 · separation ≥6px + an ADDED e2e assertion + the ≥19 floor | **LANDED.** And the defect was bigger than pass 2 knew — see §1. |
| 2 · the idle regression cured at the primitive | **VERIFIED + MEASURED** (C landed it). Zero new promoted layers, zero long-frames. §2 |
| 3 · Deal keypad clearance +8.9px | **DISCHARGED BY THE BASE TREE — no edit made.** G4 re-run with a negative control: +109.66px. §3 |
| 4 · orphan purge (`.section-heading` rung, `.mobile-heading-btn`) | **NOT ORPHANS — purge REFUSED on the rendered evidence.** The washi `role` half of the order was real and is cured. §4 |
| 5 · ledger recut · washi rung in the dominance table | **RECUT — and the recut REFUTES F1's own dominance claim.** §5, §6 |
| mark 6 · DifficultyTally | **Nothing to receive** — F3's stage has not run. Seam named in §7. |

---

## 1 · THE SEAM — the defect was the shipped estate, not the pass-2 diff

Pass 2 charged itself with 1.6px of chip separation from its own `px-1.5` + `0.1rem`. That diff
never landed. The measurement on HEAD says the estate was failing the same threshold anyway, on
**both axes at once**, in both engines (`rigB/measureB.mjs`, every cell carrying `regimeOk` from
three independent observables — Lane C's witness, adopted whole):

| cell | HEAD `573317aa` | committed `18f92c26` |
|---|---|---|
| 390×844 coarse (row) | **4.00** | **7.19** |
| 375×812 coarse (row) | **4.00** | **7.19** |
| 1280×800 coarse (column, iPad) | **0.00** | **7.19** |
| 1440×900 fine (column, rail) | **0.00** | **7.19** |
| 1024×768 fine (column, rail) | **0.00** | **7.19** |

chromium and webkit agree to 0.00px on every row. The column cells are the bad ones: two **44px
coarse tap targets sharing an edge**, with nothing an eye or a thumb can find between them.

**The cure is one declaration for both axes.** `.ctrl-options { gap: 0.45rem }` — the row branch
gives up its own `gap: 0.25rem`, the column branch had none to give. The chip's own
`padding-bottom: 6px` is not and never was separation: it is the scribble underline's room,
*inside* the box.

**The price, booked not hidden.** The row is horizontal, so the phone card is byte-identical
(`panelH` 558, card 582/586, Deal's headroom 109.66 — all unchanged). The column pays
**+65px of rail scrollHeight** (971 → 1036 at 1440 fine; 1070 → 1135 at 1280 coarse) into a card
that is a clipped scroller by design. Scroll, not clipping; no layout moves; `overflow` was
already 371–502px. There is no slack to reclaim inside the chip — computed padding at the rail
is `2px` top / `6px` bottom, and the 6px is the underline's.

### The gate pass 2 owed, with two controls

`e2e/visual-regression.spec.ts` — *"option chips keep their separation: ≥6px between neighbours,
both axes"*. It measures the neighbour gap **per group, along that group's own axis**, on the
rail column and on a coarse phone context, asserts `(pointer: coarse)` before banking a coarse
number, and refuses to pass vacuously (≥3 paired groups required).

- **Control inside the run:** the seam is collapsed in-page (`gap: 0 !important`) and the probe
  must see it fall under the floor. The gate proves it can see what it counts.
- **GATE-1, at the source:** a build patched back to the exact prior defect (`gap: 0` +
  `.options-row { gap: 0.25rem }`) → **RED**, naming `rail column: column group "4×4" (n=3)`;
  restored → **GREEN**. Both runs banked.

**The ≥19 font floor is at its authored 19 and passes at 20.** It was never loosened on this
tree — pass 2's 19→17 rode the diff that never landed. Not touched, not re-argued.

---

## 2 · THE IDLE REGRESSION — cured at the primitive, and now measured in time

Lane C landed the pose prune (`043b94c0`). This stage supplies the temporal witness the order
asked for. `rigB/idle.mjs`: 10s of **untouched** page after settle, rAF-interval sampling, three
runs per build interleaved A-B-A-B to split drift, 390×844 coarse.

| | long frames (>50ms) | fps | painted poses | **promoted layers** |
|---|---|---|---|---|
| base `2335282c` | **0 / 0 / 0** | 133.12 | 8 | **8** |
| committed HEAD | **0 / 0 / 0** | 133.01 | 11 | **8** |

**Three new posed wells cost three painted nodes and ZERO new promoted layers** — 16 pose nodes
live in the panel and 3 paint. Δfps −0.11, inside noise. The mechanism pass 2 traced ("no
painter" being false — `frameCount` siblings carrying `will-change: opacity`) is gone at the
primitive, and B, C and A all inherit it (blast C9).

*Honest limit:* headless chromium at 133fps is not a device. The number that carries is the
**delta**, and the delta is zero on both the temporal and the structural metric. Pass 2's 2× was
taken on the rig; a device re-run is a rig row, not a code row.

---

## 3 · G4 RE-RUN — the +8.9px cure is UNMOTIVATED on this tree

`rigB/deal-keypad.mjs`. Band **296px, measured** (registry §2), headroom taken at the page's
maximum scroll, coarse cells only (a soft keypad is a coarse-pointer fact).

| cell | SHIPPED headroom (chromium · webkit) | NEGATIVE CONTROL |
|---|---|---|
| 390×844 | **+109.66 ✓ · +110.25 ✓** | −187.55 ✗ · −186.95 ✗ |
| 375×812 | **+130.69 ✓ · +131.28 ✓** | −204.52 ✗ · −203.92 ✗ |
| 430×739 | **+110.56 ✓ · +110.17 ✓** | −272.64 ✗ · −272.03 ✗ |
| 844×390 landscape | **+116.06 ✓ · +115.67 ✓** | −272.84 ✗ · −272.23 ✗ |

The control is GATE-1: everything below the staged zone stripped in-page so **Deal ends the
page** — pass 2's own shape. It reds by 187–273px at every cell in both engines, so the probe
measures something.

**No padding is added.** Deal sits above the peek divider, the play tools and the legend on this
tree; the order's premise was pass 2's in-flow card where Deal was last. Machinery for a defect
that is not there is still machinery. The order's cell is re-run and green, which is what the
order actually asked for.

---

## 4 · THE ORPHAN PURGE — two of the three targets are ALIVE, and the audit says so

Rendered audit on the built dist, three regimes (`rigB/orphan.mjs`) — because a grep cannot tell
a dead rule from a live one:

| target | rail fine | iPad coarse | phone coarse | verdict |
|---|---|---|---|---|
| `.mobile-heading-btn` | 0 in DOM | 0 in DOM | **2 painted, 44×—, `min-height: 44px` LIVE** | **NOT an orphan.** Deleting it from the shared coarse list drops two live tap targets off the floor. Blast C11 confirmed on the rendered tree. |
| `.section-heading` (typography.css rung) | **2 painted** | **2 painted** | **2 painted** | **NOT an orphan.** C's zone grammar keeps the eyebrow rank: `Size`, `Difficulty`, `text-transform: lowercase` (the moved P1-W3 rule). Load-bearing. |
| the stale `AssistSettings` comment | — | — | — | **Already gone.** The only surviving mention (`GameControlPanel.vue:267`) is Lane C's accurate absorption note. |

The purge is REFUSED on all three, on evidence. F1's §2 "no legacy aliases" claim was true of
F1's own build, not of this tree — the wells landed with the tab machinery intact underneath.

### The one real cure in order 4: the permanent washi's role

`anchor="tag"` had already dropped `role="tooltip"` (Lane C). The **`persistent`** arm had not —
and it is the one that literally never hides: `.washi-persistent` pins `opacity: 1` under
`(pointer: coarse)`, so on every phone and every iPad the *"hold to peek"* tape was a permanent
`role="tooltip"`: a transient hover/focus description with no hover, no focus, no dismissal, and
no `aria-describedby` pointing at it. The surface it names is a bare `<div>` with **no accessible
name at all**, so the honest reading is the visible one.

Rendered after: every `.washi-tag` **and** the persistent peek tape report `role: null` in all
three regimes — `opacity: 1` at coarse, still hover-revealed at fine. `share-truth`,
`mobile-affordances` and `drawer` assert this tape's TEXT and its 44px target; all green.

---

## 5 · THE DOMINANCE TABLE, RECUT WITH THE WASHI RUNG — and it REFUTES F1's claim

Lane C's inkmass instrument taken whole (DPR2 element clips, tight-bbox denominator, references
pinned by rendered text, tape suppression proven non-reflowing — `rectStable: true` on every row).
`rigB/dominance.mjs`, 1280×900, light, both engines. Ordered by MASS, the order's own metric:

| rung | mass (chromium · webkit) | density (tight) | vs Deal |
|---|---|---|---|
| `difficulty` eyebrow | **682.85 · 693.76** | 0.2005 · 0.2045 | **3.56× LOUDER** |
| selected difficulty chip | 426.72 · 418.08 | 0.3444 · 0.3839 | **2.23× louder** |
| selected size chip `9×9` | 294.97 · 273.60 | 0.3029 · 0.3379 | **1.54× louder** |
| **`teacher's` tape** | **286.07 · 271.94** | 0.2018 · 0.2008 | **1.49× louder** |
| selected check chip | 265.48 · 294.26 | (clip-contaminated, §5a) | 1.39× louder |
| `size` eyebrow | 242.61 · 240.52 | 0.2402 · 0.2358 | 1.27× louder |
| **`new game` tape** | **224.33 · 226.41** | 0.1569 · 0.1620 | **1.17× louder** |
| **Deal (whole button)** | **191.62 · 194.41** | 0.1679 · 0.1653 | 1.00× |
| **`pencils` tape** | **177.76 · 179.18** | 0.1519 · 0.1566 | 0.93× |
| Deal's die alone | 138.14 · 138.53 | **0.2210 · 0.2217** | 0.72× |
| `candidates` caption | 114.27 · 112.71 | (clip-contaminated) | 0.60× |
| `marks` caption | 59.55 · 60.65 | 0.1641 · 0.1671 | 0.31× |
| Deal's verb alone | 53.48 · 55.88 | 0.1768 · 0.1814 | 0.28× |

**Deal ranks 8th of 13 by mass.** F1's pass-2 table claimed Deal dominant at 1.52–1.54× over its
loudest rival; **that does not reproduce on the shipped tree in either metric**, and the reason is
plain: pass 2's dominance was bought by a 34×34 die and a √φ-rung verb inside a ticket that also
shrank every rival — Lane C explicitly did **not** port the stroke bump (its §4, argued openly),
and the eyebrows survive at 2 ranks.

The washi rung, which pass 2 omitted, is **not** "380.0 above every selected option" either: the
three tapes measure 177.76–286.07 against selected options of 265.48–426.72, so a tape sits both
above and below the option rank depending on which tape and which option. **Both halves of pass
2's prediction fail once all the rungs are in the table** — which is exactly G6's lesson,
recommitted a third time this pass and this time against its own author.

By **density** C's finding holds unchanged: the die (0.2210) out-inks the eyebrow it commits
(0.2005) and every tape, with zero change from this lane. Mass and density disagree and the
disagreement is printed, not resolved.

**§5a — disclosed contamination.** `sel_check` and `caption_candidates` report tight-bbox areas
that diverge 5–7× between engines (6327 vs 880; 2997 vs 610.5), i.e. one engine's clip caught a
stray stroke from the well frame and inflated the box. Their **mass** rows are comparable and are
banked; their **density** rows are not, and are marked so rather than quietly averaged.

---

## 6 · LOC LEDGER, RECUT ON THE FINAL TREE

Code-only, same stripper both sides (comments and blanks stripped), against `573317aa`:

| file | + | − | net |
|---|---|---|---|
| `OptionSelector.vue` | 7 | 2 | **+5** |
| `SheetWashiLabel.vue` | 1 | 1 | **0** |
| **product total** | | | **+5** |
| `e2e/visual-regression.spec.ts` (the separation row + its two controls) | 85 | 1 | +84 |
| **total** | **93** | **4** | **+89** |

**Pass 2's `−202` (and the registry's corrected `−192`) are VOID, not corrected**: they priced a
diff that was never landed. The deletions that ledger claimed were real, and they landed in Lane
C's stage instead — `AssistSettings.vue` + `PencilModeToggle.vue` **−99**, the pen branch **−42**.
The honest F1 stage-B number is **+5 product lines and +84 gate lines**, and the pass's product
diff belongs to C.

---

## 7 · GATES — one run, on the committed tree, after the last edit

vue-tsc **0** · vitest **313 / 30 files** · eslint · knip · prettier(`src/`) ·
`test:font-coverage` 28 codepoints / 13,788 B · `lint:ink` exit 0 · **default e2e 85 / 85**
(was 84 — one added row) · **built-dist lane 13 / 13** (filter-census 3 — **9 live filtered
surfaces, zero new**, theme-bake ×2, wordmark-webkit 6) · `test:golden:bytes` PASS ·
`npm run build` green.

### The goldens — a trap, characterised, and NOTHING re-baselined

`playwright-golden.config.ts` against the built dists on darwin does not converge on the two
**pose-stack** subjects. The evidence is a bisect that came out non-monotone across a linear
history, which is what proves it is not a source change:

| dist | `toggle-crest-dark` |
|---|---|
| base `2335282c` | ✓ |
| `043b94c0` (C, pose prune) | ✓ |
| `127fde0d` (C, aria-pressed) | ✘ 1028px |
| `e982a403` (C, zone grammar) | ✓ then **✘ ✘ ✘ ✘** on the *same unchanged dist* |
| HEAD `573317aa` (no B diff) | ✘ 1028px |
| committed B tree | ✘ then ✓ (4/4) then ✘ ×4 |

`logo-light` behaves the same way and reds on the **base** dist too (1–2 reds per run). The diff
image is a sub-pixel drift of the crescent edge plus two twinkles — a **different pose of the
celestial stack**, i.e. capture-timing, not ink. The spec's own comment already grants this class
for linux ("flaked three times across unchanged trees"); **the same is true on darwin and the
clause understates it.** My diff moves nothing in the golden radius (blast §0: no golden clips a
control panel), and **nothing was re-baselined**. Routed to the standing traps ledger and to the
team-lead row that owns the sun-crest clause.

---

## 8 · MARK 6 — the tally seam, named and left ready

F3's stage has not run, so there is nothing to receive. The seam, for when it asks:
`DifficultyTally` renders at `GameBoard.vue:753` from `gradeTally`, and `gradeTally` is already
derived in the shared composable (`useGameState.ts:217`). Moving the tally into the ticket's
solve-status band is therefore **a prop move, not a lift** — the well can consume the descriptor
without any board being touched. Six boards forward the same prop today
(`SudokuBoard`, `FutoshikiBoard`, `ThermoBoard`, `KillerBoard`, `KenKenBoard`, `GameBoard`).

---

## 9 · WHAT IS OPEN, PLAINLY

1. **The rail column costs +65px of scroll** for the seam (§1). Booked. The card was already a
   clipped scroller; nobody has argued the rail's total height down, and Lane C's own §8.3 ("the
   rail's `new game` well is tall and airy") is the same row seen from the other side. The named
   closure is still C's uncashed T′ collapse (~half of `GameControlPanel`'s +178 is the well
   markup written twice).
2. **Deal is not dominant on this tree, by mass** (§5). F1's central pass-2 number is refuted.
   Whether that matters is a design ruling for the adjudicator — C already argued the metric
   openly and declined to buy dominance with a bigger die the coarse regime forbids.
3. **The two pose-stack goldens do not converge on darwin** (§7). Not mine, not re-baselined,
   ledgered.
4. **Mark 3 remains conceded by this family.** Nothing in this stage moves mobile wholesale;
   the phone card is byte-identical but for the chip seam. F3's re-entry trigger (b) stands.
5. **No on-device cell in this lane.** Two headless engines agreeing to 0.00px is not evidence
   about Safari — M5 stands as the standing reminder. The idle delta and the separation are
   geometry and DOM, which is the class headless can carry; the fps figure is not.
6. **The `.ctrl-options` class is a second hook on the same element** as the branch class. It is
   one line and it buys the one-declaration cure; if the branches ever unify, it folds away.
