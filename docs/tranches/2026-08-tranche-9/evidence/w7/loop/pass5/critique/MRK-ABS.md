# T9-W7 pass 5 · CRITIQUE · MRK-ABS (the absolute wobble, §5 §6)

Adversarial, non-author. I wrote neither the charter, the prototype nor any earlier artefact of this
family. Base and π control `74a2b5d9`. Work tree read in place: `.claude/worktrees/wf_f72f3b5a-83a-39`
(13 tracked files +193/−62 plus the untracked 518-line `e2e/focus-ring.spec.ts`). The pass-5 delta
against `pass4/prototype/MRK-ABS/pass4.diff` (rebuilt on a `git archive` of `74a2b5d9`) is 203 diff
lines: the ledger comment cut to its six rows, the forced-colours block moved out of `@layer base`,
four comments re-cut, one `SPEC_MANIFEST` line, and the new spec.

I built the returned tree myself to scratch (private cacheDir): **`index-vRwXgZxlV82x.js`, 37 assets —
the identity the README names**. So the measured tree is the returned tree, which closes pass-4 gap 5.
Lane dist served on `127.0.0.1:4233`. The chair's control dist was served on `:4234` and verified by
`index-CubiZsMVSwTc.js`. Both servers were killed by recorded PID (43252/43281, 43253/43307); both ports
are free. Probes and summarised logs are in `critique/MRK-ABS/`. I banked no crops. I wrote nothing
under `r0/` or `pass1/`–`pass4/`. Nothing was committed, stashed, installed or deployed. The control
tree and the work tree were never edited: `index.css` sha1 `1a78d770…` before and after, and every
break ran on a scratch copy.

**CONVERGENCE: 76 %. VERDICT: ADVANCE** (pass 4: 74).

Pass 4's structural reds are closed:
- the third arm is built;
- G-ABS-3/4/5/7/8 are landed in `e2e/` and assert, each with an in-run control;
- the measured tree is the returned tree;
- the chrome and search figures are out of the comment;
- the forced block reaches its four hosts.

What holds it at 76:
- the ledger's figure clause passes on a broken tree;
- the frame cell regresses against HEAD on the fraction under the floor, which the lane doesn't declare;
- WebKit regresses on the ledger's own statistic;
- the sensitivity row drops exactly the failing stations;
- the deck card's ring is left 20 % visible, with two product comments selling that as a gain;
- the landed spec never visits the three hosts the forced-colours cure was written for;
- `pencilConfig.ts` carries px figures labelled for a viewport they weren't read at.

---

## 0 · Gaps first (each closable, numbers attached)

1. **G-ABS-5's figure clause passes on a broken tree (a gate that cannot fail on its own claim).**
   - The spec says "every figure in that comment must be a ledger row". `FIGURE =
     /(?<!\d\.)(?<!\d)\d+\.\d{2,}…/` only sees figures with ≥ 2 decimals.
   - I planted "The deck card reads 1.8 dark." in a scratch copy of `index.css` and ran the LANDED
     row bare (chromium): **`1 passed`, exit 0** (`logs/break-onedecimal-figure-G-ABS-5.log`).
   - Browserless on the same parser (`logs/figure-clause-plants.txt`): a one-decimal figure (3.9), a
     ratio (2.4:1), a percent (35 %), an integer px (4) and a comma decimal (2,40) are all unguarded
     and pass. The lane's own 4.15 control reds.
   - A second defect: `unguarded.splice(unguarded.indexOf(g), 1)` with `indexOf = -1` deletes the
     LAST figure. A ledger restated at a one-decimal opacity ("stroke-opacity 1.0", arm C's, or LIVE's
     0.9) therefore eats one stray figure: opacity 0.9 plus the stray 4.15 reads `unguarded []`.
     `law-probe.R1-moved.mjs` guards `k >= 0`; the landed spec doesn't.
   - Close: match every numeral token in the comment (or name an allowlist such as 1.4.11, 3:1 and
     16×16), guard `indexOf ≥ 0`, and ship the 1.8 plant and the 1.0-opacity plant as in-run
     controls.
2. **The frame cell regresses against HEAD on the fraction under 3:1, undeclared.**
   - My whole-ring read uses the ledger's own method on all four sides of cell 0: 16×16, 240
     stations, `mint(4)`, default regime (`logs/ring-and-deck-summary.txt`).
   - Lane: **78/240 under 3 (32.5 %) in every engine × theme. The LEFT side is 60/60 under 3.**
   - HEAD: chromium 45/240 (18.8 %) light and 51/240 (21.3 %) dark; webkit **24/240 (10 %)**, left
     side **0/60** (worst 3.124 / 3.197).
   - The lane's own density table says the same at desk (frac < 3: A 0.333–0.35 vs HEAD
     0.133–0.167).
   - The README quotes HEAD's whole-ring WORST (1.03–2.31), which flatters the tree. It never quotes
     HEAD's fraction, which doesn't.
   - Close: print the fraction beside the worst for both arms in the ledger's row and in the ballot,
     and call it a regression.
3. **WebKit regresses on the ledger's own statistic.**
   - G-ABS-5 against the control, my run: webkit frame **3.05 light / 2.851 dark**. The lane's run
     read 2.911 / 2.992; my probe reads the left side at 3.124 / 3.197.
   - The lane is 2.85 / **2.404**. WebKit dark falls **0.45–0.79** under the tree; chromium improves
     by 0.08–0.12.
   - HEAD's figure moves ≈ 0.35 across runs (boil live) and the lane's doesn't. Even so, every HEAD
     reading sits above the lane's webkit dark.
   - The README table carries both columns without saying so. Close: declare it as the row's
     regression, with HEAD's spread.
4. **The sensitivity row is survivor-biased on the frame.**
   - `abs-lib.ts` counts a station at f % mass only if its scan has a pixel with d ≥ f·M. On the frame
     the one-value ring changes too few bytes to pass the bar, so arm A's 90 % row reads **0/39 and
     0/40, and 0/43 coarse**: 17–21 of 60 stations are silently dropped.
   - Those are the stations under 3 (frac 0.35 = 21/60). Arms B and C count 60/60.
   - The README's "Arm A, frame: 90 % worst 3.362–3.501 (0 under 3)" prints no denominator, and the
     sentence "the two values move contrast from the paper to the frame" compares a 39-station row
     with a 60-station row.
   - Close: count a dropped station as under the floor, or print n/60, and re-state the comparison.
5. **The deck card's ring is 20 % visible, and two product comments call that a gain.**
   - My read uses `?view=gallery&size=3&board=mint(3)`, PRM, light, 1280×800 fine. A perimeter pixel
     counts when its colour matches the computed outline ink composite and it changed. The lane's
     ring shows on **296/1466 positions (20.2 %), worst 3.93, median 4.188, 0 under 3**, both engines.
   - HEAD's shows on **918/1466 (62.6 %), worst 1.08, median 2.38, every position under 3**.
   - The lane trades HEAD's visible but sub-floor grey ring for a floor-clearing sliver under the
     card's own sketched edge (GameCard.vue offset 4 → 3, `border-radius: 0.5rem` struck). This
     reproduces the lane's G3 (4–13 vs 18–23 stations).
   - Yet `GameCard.vue` says "the one hand spends LESS air than the rule it replaces" and `index.css`
     says the offset "spends a pixel LESS air". Both advertise the change that hides the ring.
   - Neither regime is an indicator. The cure is one declaration (a deck offset that clears the
     sketch's outset, still inside the 9.59 px scrollport air) and it wasn't built.
   - Close: build it, read it both engines, strike the two sentences.
6. **The landed spec never reaches the three hosts the forced-colours cure was written for.**
   - `HOSTS` maps `.gallery-viewport`, `.staging-btn` and `.guard-btn`. G-ABS-3 walks a 9×9 board
     route and G-ABS-4 walks `/?game=X`, and neither visits `?view=gallery` or arms the guard.
   - The walk's stop set on every arm is 8 stops and none is a host (`logs/ring-and-deck-summary.txt`).
     The mapping is dead code in the landed file.
   - So none of these has a landed row: the unlayered forced block (Highlight 11.31 claimed), the deck
     ring (gaps 5 and G2), the staging face and the guard (4.227 / 4.346).
   - Close: add the gallery route and the armed guard to G-ABS-3/4 with a forced-colours project row.
7. **`pencilConfig.ts` carries px figures that no row backs, at a viewport it names but didn't read.**
   - My G9 reconciliation: G-ABS-7's DOM px equals the offline u × **0.636 px/u** at all four
     readings, to ±0.002 px:
     - 2.577 u → 1.639 px
     - −0.788 u → −0.501 px
     - 3.731 u → 2.373 px
     - 0.366 u → 0.232 px

     The 16×16 DOM cell is 39.75 px per 62.5 u. The ghost's own svg runs at 0.489 px/u (viewBox
     −9.375 … 81.25), which is the scale the lane multiplied by. So **G9 is the lane's unit slip, not
     an open physics question**.
   - The product comment still reads "0.788 u = 0.44 px" and "2.577 u = 1.43 px". That is 0.556 px/u,
     from `ma-n.txt`'s pass-3 desk column, not 1280×800.
   - The pass-5 edit ADDED the label "σ in the reader's px **at 1280×800**: 0.76 / 1.02 / 1.03 px".
     `k-window-086.txt` derives those figures at **0.428 px/u** (16×16). At the DOM's 0.636 px/u the
     same 2.4148 u reads ≈ 1.54 px, if σ's board units are MA-N's.
   - This is the class pass 4 struck (a product figure with no row), moved to a file G-ABS-5 doesn't
     parse. Close: restate at 0.636 px/u (0.50 / 1.64 px), or name the board px, and read σ in the
     DOM once.
8. **The ballot as returned omits three rows the owner needs.** The one-line ballot gives each arm's
   left-side worst only. It must also carry:
   - the fraction under 3 (A 32.5 % whole ring vs C 0–1.7 %, HEAD 10–21 %);
   - C's bottom-left station on a [143,143,143] ground at 1.13–2.10 (README G4), which means C does
     not "clear the frame" on the whole ring;
   - B's and C's dark-paper shoulder at 90 % mass (C 2.873–2.95 with 1–9/60 under 3; B 2.728–2.861)
     against A's 3.40–3.70, 0/60.

   The pixel data does settle one thing: **no arm clears the whole ring**. The ballot is about which
   failure the owner prefers, and it should say so.
9. **The p5-1 ballot crop carries no in-frame label.** The three columns (A | B | C) read
   near-identical at this zoom, and the arm identity lives only in the README caption. Pass 4's critic
   raised the same point. Close: burn a label into each column, or state that the caption binds.
10. **The record law: raw census JSON banked whole.** `prototype/MRK-ABS/logs/` holds ≈ 25 raw JSON
    files (census, density, board-arms, pi, spread; 64–136 KB each, ≈ 1.8 MB for the directory). It
    also keeps `census-run1-parser-blind/`, a run the README calls blind. LAWS: "Raw census JSON is
    summarised, never banked whole." Close: keep the `*-summary.txt` files, delete the raw JSON and
    the blind run (the chair's sweep, or the lane's own).
11. **The lane's own open rows** (G2, G5, G7, G8, G10, G11), reproduced where I read them:
    - `.info-btn` right side: **2.608 / 2.418 chromium, 3.600 / 3.004 webkit**, admitted at 0.068.
    - Law 39's tab, parked: **1.043 / 1.655 chromium, 3.606 / 2.903 webkit**, admitted; the chair's
      row.
    - The deck's forced ring at 45 % under 3.
    - WebKit forced-colours emulation at 1.46, emulation-only.
    - Unrun: G-ABS-9–13, `visual-golden`, the phone perf trace, real Safari.
    - π reads the board UNFOCUSED only (`p5-pi.spec.ts`: "unfocused"). The focus-state paint of the
      struck `.sudoku-cell:focus-within` / `.game-cell:focus-within` pair and the deck's struck 8 px
      clip radius is unπ'd (LAWS P4: π drives the surface).
12. **Minor.**
    - "one ink cannot clear both" (index.css) is a universal claim with no single-value search banked
      behind it. Pass 4 read one value, #3a7bc4 @ 1.0, at 2.528 / 2.980. Cite that search or soften the
      claim.
    - `var(--toggle-bleed, 0px)` still sits in the rule this family rewrote (MRK-LIVE's clause 3 row;
      carried).

---

## 1 · What I re-ran myself (the returned tree's dist `vRwXgZxlV82x` vs control `CubiZsMVSwTc`, both engines)

| row | my reading (chromium / webkit) | the lane's |
|---|---|---|
| **Landed `e2e/focus-ring.spec.ts`, whole file, bare** (`logs/landed-lane-*.log`) | lane **8 passed, exit 0** (2.3 min) | 8 passed |
| same, control | **8 failed, exit 1**. G-ABS-5 computed 0.9 ≠ 0.95; G-ABS-8 identity; G-ABS-4 `auto` ×4 + two inks; G-ABS-3 chromium logo-trigger, webkit "walk bands the home stops" | 8 failed by verdict |
| **Board ledger (G-ABS-5's painted rows)** | 16×16 paper 3.972 / 3.965 light, 3.989 / 3.997 dark · 16×16 frame **2.812 / 2.85** light, **2.404 / 2.404** dark · 9×9 paper 3.92 / 3.965, 3.989 / 3.989 · opacity ledger = source = computed 0.95; ablated 0.9 reds | identical to the third decimal |
| control, same statistic | frame **2.69 / 3.05** light, **2.32 / 2.851** dark; paper 3.679 / 3.685, 3.763 / 3.755; 9×9 2.693 / 2.693, 2.309 / 2.316 | 2.693 / 2.911, 2.32 / 2.992 (HEAD moves ≈ 0.35 run to run) |
| **MA-N from the DOM (G-ABS-7/8)** | stroke 10: product **+1.639 px**, witness f=1.00 **−0.501 px**; stroke 7: +2.373 / +0.232; identity 256/256; scale 0.489 px/u — **both engines identical** | identical |
| **NEW: whole ring, cell 0, 4 sides × 60** | lane 78/240 under 3 every cell; left 60/60; worst = the ledger's · HEAD chromium 45–51/240, webkit 24/240, webkit left 0/60 | "33–35 % under 3"; HEAD fraction unstated |
| **NEW: G9 box** | ghost square 30.577 px inside a 39.75 px DOM cell (4.586 px margin), every cell, both engines; offline u × 0.636 = DOM px at 4/4 readings | "unreconciled" |
| **NEW: deck centre card, PRM light** | lane ring-ink 20.2 % of the perimeter, worst 3.93 / 3.925 · HEAD 62.6 / 62.1 %, worst 1.08 / 1.088, 100 % under 3 · the viewport is `:focus-visible` AT LOAD on both arms | 4–13 vs 18–23 stations |
| **Break: a one-decimal figure planted in the ledger** | landed G-ABS-5 **passes** (chromium, exit 0) | not tried |
| **R1-moved probe, bare** | lane GREEN (exit 0); control RED (unguarded 2.86 / 3.60, no ledger) | same |
| **filter census, light + dark, built dists** | lane **20 passed / 4 failed**; control **20 / 4, the same four** (dark G3.1 / G3.3 both engines, `svg.crayon-heart.idle ⟨saturate(0.85)⟩`, inherited); light 12/12 → filterBudget 9 holds | same |
| **Battery, bare, lane \| control** (`logs/battery-lane-vs-control.txt`) | check-copy-register (M16) 0 \| 0 · lint:copy 0 \| 0 · lint:lanes 0 \| 0 · lint:theme-tokens 0 \| 0 · lint:theme-selectors 0 \| 0 · lint:sleep 0 \| 0 · lint:motion 0 \| 0 · lint:ink 0 \| 0 · test:e2e:projects 0 \| 0 · check-pw-projects 0 \| 0 · `eslint .` 0 \| 0 · prettier (`npm run lint`) 0 \| 0 | same |
| **@property / undefined tokens** | the diff adds 0 `@property`; every added `var()` resolves (`--ring-ink` ×5, `--focus-offset` ×4, `--color-focus-sketch` ×2, one in a comment); no filter added | — |

---

## 2 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | CLEAR on G-ABS-3/4/7/8, which assert and red on the control |
| spec-cites-itself | **HIT (minor)**: R1-moved GREENs the 9.99 tree and defers truth to G-ABS-5 by checking that the spec file exists and contains the word `paintClause` |
| gates that cannot fail | **HIT**: G-ABS-5's figure clause passes the 1.8 plant; the splice(−1) tail-eat (§0.1) |
| elegant-reduction trap | **HIT**: "the two values move contrast from the paper to the frame" rests on a survivor-biased row (§0.4); the ballot's worst-only rows (§0.8) |
| legacy aliases | CLEAR |
| masked fallbacks | **HIT**: the dead `HOSTS` mapping reads as coverage of the forced cure's hosts (§0.6) |
| unverified gestalt | **HIT (minor)**: unlabelled p5-1 columns (§0.9); p5-3/p5-4 are honest |
| consumer-less substrate | CLEAR (`--ring-ink` 5 consumers, `--focus-offset` 4) |
| the generic default | CLEAR |
| π it moved and did not declare | **HIT**: the frame-cell fraction and the webkit left-side regression (§0.2–3); the deck ring's visibility is declared but sold as a gain in two comments (§0.5); π never drives focus (§0.11) |
| the constraint it forgot | **HIT**: the record law, raw JSON (§0.10); px figures labelled for 1280×800 without a row (§0.7). Clear, verified by me: M16, filterBudget (built, both engines, both themes), AA from painted bytes, W2's mechanics, the @property law, the undefined-token census, the decided history (law 39 NOT moved and carried PROPOSED; R3-a unchanged) |

---

## 3 · Strengths

1. **The reproducibility is unmatched in the wave.** Every lane figure I re-ran matched to the third
   decimal in both engines, on a dist I built whose identity is the one the README names. The lane's
   own statistic is deterministic where HEAD's moves ≈ 0.35.
2. **The gates are real now.** Each of G-ABS-3/4/5/7/8 has an in-run negative control. Control
   `74a2b5d9` reds 8/8, each for its named reason. MA-N is proved from the DOM with a byte identity
   and the f=1.00 witness, which settles MRK-LIVE's decline.
3. **Honest self-report.** The deck regression (G3), the whole-ring blind spot (G4), the method
   disagreement (G6) and the WebKit forced emulation were all found and declared by the lane itself.
4. **The ledger comment shrank to what a gate can hold.** The chrome and search figures, 1.78, 2.70
   and 4.6 are gone.
5. **The forced-colours cure reaches its hosts** in chromium (Highlight at 11.31, per the lane).

## 4 · Ballot rows (U-10), as the owner should receive them

- **The ring token** (§2.6), three arms, one payload, whole ring AND left side:

  | arm | left-side frame | whole ring under 3 | dark paper at 90 % mass | other |
  |---|---|---|---|---|
  | A, one value | 2.40–2.85 | 32.5 % (HEAD 10–21 %) | 3.40–3.70, 0/60 | — |
  | B, two values @ 0.95 | 3.08–3.39 | 0–1.7 % | 2.73–2.86 | — |
  | C, two values @ 1.0 | 3.20–3.58 | 0–1.7 %, bottom-left station 1.13–2.10 | 2.87–2.95, 1–9/60 | chrome −0.7 to −1.0; `.icon-btn` dark 2.81/2.85; ties the invalid rung |

  No arm clears the whole ring. Default A per the chair.
- **Inset 0.86 vs 0.90**: DOM +1.639 vs +1.027 px (stroke 10). At 1280×800 these are u × 0.636.
  Frame p5-2.
- **The deck card ring** (new, the lane's G3): offset 3 = 20 % visible at ≥ 3.9, vs HEAD's 62 % at
  ≤ 2.4, vs an unbuilt offset that clears the sketch. The third arm has to be BUILT before this is a
  ballot.
- **Law 39**: the chair's row, and now decision-grade (parked spread 0).

## 5 · Cross-pollination

- **Every painted-contrast lane (§6, §11c, §10)**: the survivor-bias trap in the sensitivity row (a
  station that fails the mass bar is the station under the floor, so count it, don't drop it); read
  the whole ring and print the fraction beside the worst.
- **MRK-LIVE**: take G-ABS-7/8 and the f=1.00 witness as the RING_GEOMETRY graft (the DOM refutes the
  decline). Fold G-ABS-5's figure-clause fix before adopting it. LIVE's rank ruling at 1.0 must restate
  the ledger with a one-decimal-safe parser.
- **§10 (T9-B8 / M18)**: `.info-btn` re-reads against the new drawn edge. The admitted 0.068 ceiling
  goes STALE by design when the ground moves.
- **The deck's owners (§3/§4, spoken-gallery)**: the viewport is `:focus-visible` at load on both
  arms, so the deck ring paints at first paint. Any deck ring decision is a first-impression pixel.

## 6 · Incidents (mine)

- My first two scratch Playwright runs failed to load: the config sat outside `node_modules`'
  resolution, and the break copy had no `"type": "module"`. Both were fixed and re-run. Neither
  produced a reading.
- My first deck probe read 0 changed pixels on BOTH arms. The gallery viewport is `:focus-visible` at
  load, so ring-off equalled ring-on. It was re-cut to blur first and add an ink-match metric. The
  first run's numbers are discarded, not banked.
- The shared scratchpad is the one the lane used (its vanished `logs/` incident is consistent with
  that). My work lived in a private `crit-abs/` subdirectory, which is deleted at return.
