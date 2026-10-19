# PLR-COUNT · pass 9 (PROTOTYPE, attempt 4): G14 anchored to the control, every row re-read on 2026-10-18

Worktree `wf_f72f3b5a-83a-52` (HEAD `74a2b5d9`, never committed). Lane `:4242` (Vite dev on the tree,
private cacheDir), control `:4260` (`w7-control`'s pre-built dist, `index-CubiZsMVSwTc.js`, served identity read back).
Both servers ran under `guarded --timeout 90`, PIDs recorded, cwd-checked, cycled before any battery that would outlive
them. Every chromium battery ran in its own `guarded` call; every WebKit battery in its own `guarded --exclusive webkit`
call; `--workers=1`; nothing opened above a 1-minute load of 120. Three earlier attempts died (a session end 10-08, the
host crash 10-09, the WindowServer abort 10-14 13:24). **Nothing below is cited from them: every number was re-read
in this attempt.** Their evidence (`readings/g14-clean.txt`, the partial README) was moved to the lane's trash.

## 0 · The tree at open (declared before any file was touched)

- The tree's product diff through a temporary index: **40 files, +14,552/−514, 725,892 B, sha1 `9fd4b582`, write-tree
  `d7b5584f`**, `cmp`-identical to the dead attempt-3 bank in the lane scratch (so no edit landed after that bank).
- It DISAGREES with the pass-8 BANKED.txt (`de3b278d`, 34 files, sha1 `f3335bf5`) on 18 paths, each classified by blob
  against homes v2's tree `d17813ba` and PLR-SELF's pass-9 bank tree `04c8b7dc`:
  - **13 home paths = `homes.diff` (sha1 `1f70cfda`) byte for byte** (`knip.json` included). No residual home edit.
  - **SELF's pass-9 cures by sha:** `useSession.ts`, `rowBudget.ts`, `rowBudget.test.ts` equal SELF's blobs;
    `player-mark.spec.ts` and `PlayerMark.vue` carry COUNT's own pass-8 edits under SELF's, and their pass-8 → now
    change lines hash identical to SELF's `959454c2 → 04c8b7dc` change lines (`464c4b92`, `104ee19e`).
  - **`e2e/player-tally.spec.ts`**: the dead attempt's G14 re-cut onto homes v2's control-anchored mode, the `plus`
    twin, the payload beat (536 diff lines). Every hunk read; **kept**. One edit this attempt: the G4 board-ink comment
    block had been split from its test by the inserted `plus` block; moved back above its test (446 B, no code byte).
- The dead attempt's `proposed/glyph-pop.g5tol.diff` is kept as filed; its status is in §5.

## Gaps first (each with the number that holds it)

1. **Row 6 is open: B-FORK arm (a)'s loss at N = 7 is not framed.** Registry v8 §2.16 caps pass 9's headroom to four named
   frames "and nothing else", and the chair's pass-9 rulings do not rule on B-FORK. The number, re-read: N = 7 inks
   **×1.21–1.25** of one stroke's poses in light (chromium 74.40 against 59.61–61.65; WebKit 73.56 against 59.20–61.40),
   ×1.67–1.80 in dark. Pass 8's "×1.16–1.19" does not reproduce under that definition (N = 7's ink over one's heaviest and
   lightest pose). The chair rules numeric-only, or grants a fifth crop.
2. **G5's isolated bite is asserted in the dark cells only.** Light DPR 1: chromium's control fails G5 on all three lines
   (printed, T9-R8); WebKit's fails it on `.pl-state` only, and there two glyphs of the foot are G5-alone but not asserted.
   Light DPR 2: the gated G2 sees every one-glyph fade first (G5-alone 0 in both engines; the clean median 4.66/4.73 sits
   within 0.23 of 4.5). C5 reds 2/4 per engine.
3. **The isolation rows are slack-coupled.** At slack +0.005 the clean verdict holds 4/4 × 2, but the row reds 3/4 × 2 on
   the G5-alone and G2-alone rows: G3 then sees every isolating plant. The smallest isolating margin is 0.005 (G2, light-2
   `.pl-more`, chromium) and 0.007 (G5, WebKit dark-1). The 0.05 slack is the probe's stated default, not fitted here, but
   the C2/C5 bites hold only above those margins: a knob for the critic (LAWS P8 §E).
4. **C3 has no in-run plant of its own in three cells of four.** It reds only at dark-1, in both engines. G3's pin is the
   in-run edge pair (each line's own fraction −0.005 reds G3, +0.005 holds, every line, every cell, both engines) and the
   FILE plants (OPA80F and FADE80F red G3 on every line), so the clause is not unpinned. But the clause-sabotage law asks for
   a plant that reds ONLY it, and three cells have none.
5. **On the union, the difficulty tally does not take COUNT's `useTallyStrokes` refactor** (§6): six conflict hunks against
   the union's §1/§5 one-gate re-cut, and CHAIR-RULINGS §6 forbids a by-sha ride of `frontGate`/`frontTween` before FIVE's
   row 1. On the union the head mark's tally strokes draw on `useTallyStrokes`'s own clock, outside the section's one gate.
   A coupling row for the fold.
6. **SELF's B3 drawn-roster row SKIPS in both engines** (`player-mark.spec.ts:1116`, SELF's declared skip until the chair
   folds `DRAWN_FRAMES`). The rest of SELF's sheet is GREEN on this tree.
7. **Carried, not bent:** check 8's FLOOR BAND (tree live 289/286 against floor 214/212; union 443/440 against 351/350, the
   WGATE's restamp); `--tap-floor` ×2 (T9-R10); the union's own reds (`typecheck:e2e`, `lint:sleep`); `lint:bands`' B2
   `presenceInkMs` (SELF's seam, B-SEAM).
8. **T9-R6's trap, sixth pass, found by this lane's dist read: e2e selector strings mint utilities into the shipped CSS.**
   The tree's built CSS carries 24 classes the control's does not; 22 have a `src/` consumer (§11's own classes and
   `md:flex`); **2 have none**: `[data-player-mark]:visible` and `[data-lobby]:visible`, 4 rules, 278 B (Tailwind's source
   scan reads `e2e/`). The strings sit in `player-tally.spec.ts` ×9 (this lane's), `player-mark.spec.ts` ×2 and
   `multiplayer.spec.ts` ×1 (SELF's, by sha). Curing this lane's spec alone moves no shipped byte, so it is not cured here.
   The estate's cure is one line in `src/assets/index.css` (`@source not "../../e2e";`), a §-wide CSS change for the chair,
   not a lane's (`instruments/r5cls-orphans.py`: the tree's served CSS against the control's, each added class grepped in `src/`).

## 1 · The charter's rows (numbers first; every one re-read 2026-10-18, box load 8–53 at every open)

| # | row | reading (chromium · WebKit) | state |
|---|---|---|---|
| 1 | control-anchored G14 bound; FILE plants red the shipped surface | The π control (`index-CubiZsMVSwTc.js`, read back each run) paints each quiet line's own text in the sheet's tag rung (`TAG_RUNG`, every value a `var()` the control resolves), and its read is the reference. **Clean: the tree's fraction under 4.5 EQUALS the control's on every line of every cell, both engines** (ch light-1 0.817/0.774/0.790, light-2 0.486/0.515/0.496, dark-1 0.530/0.537/0.514, dark-2 0.366/0.359/0.334 · wk 0.814/0.816/0.814, 0.488/0.524/0.497, 0.617/0.615/0.622, 0.416/0.395/0.402); bound = control + 0.05, margin 0.050 printed; control style = line style 12/12 per engine. **OPA80F RED 4/4 × 2, FADE80F RED 4/4 × 2, each on the CLEAN verdict** (G3 on every line) | **closed** |
| 2 | G5 on a low quantile of the glyph's inked core (homes v2 `G5core`, `g5Q` 0.5) | **COMB RED 4/4 × 2** (G5 among the clauses wherever G5 is gated); **HEAD12F RED 4/4 × 2** | **closed** |
| 3 | a G5-only in-run plant; C1–C5 re-run whole | `G5one_*` (each glyph striped in turn): the G5-alone set is ch dark-1 **8**, dark-2 **2** · wk dark-1 **4**, dark-2 **6**, light-1 2 (printed). **C5 RED 2/4 × 2** (pass 8: GREEN 8/8). C1 4/4 × 2, C2 1/4 × 2, C3 1/4 × 2, C4 4/4 · 3/4 (§2) | closed in the dark cells; **gaps 2–4** |
| 4 | G3 clamped | homes v2 `G3clamp` (`min(frac + slack, frac + (1 − frac)/2)` at a reference ≥ 0.95; its self-test row 182/182 both engines, re-read §5). Every bound on this sheet ≤ 0.867 ch · 0.866 wk; the in-run edge pair holds on every line, every cell, both engines (own fraction −0.005 reds G3, +0.005 holds) | **closed** (the chair's fold), read on the product |
| 5 | the G4 tolerance rule out of the lane's reader | `lowsOf` deleted; G4 tolerates only the control's low columns inside the ONE probe (`tolerate: ctl.g4Lows`, homes v2 `g4tol`); the verdict is the probe's `why` minus only the whole clauses the control fails on the same payload (`printedBy`: G2 or G5) | **closed** |
| 6 | B-FORK arm (a)'s loss at N = 7 | not framed (registry v8 §2.16's cap); re-read: ×1.21–1.25 light (ch 74.40 vs 59.61–61.65; wk 73.56 vs 59.20–61.40), ×1.67–1.80 dark | **OPEN** (gap 1) |
| 7 | LOBBY_ARIA_ONLY's behavioural pair | the `plus` twin: at 6 and 16 people no text outside an accessible name holds a plus line (text nodes, `title`, `::before/::after`), the in-run plant SEEN (`5 plus 11`), both engines; **PLUSF2 RED × 2** (`no shown text holds a plus line at 6`, received `5 plus 1`) | **closed** |
| 8 | SELF's pass-9 cures by sha; SELF's `:610`-class cell on this sheet | `player-mark.spec.ts` whole: **22 passed, 1 skipped, exit 0, both engines** (the skip is SELF's B3 drawn-roster row, gap 6); the 1024 → 1056 × 768 coarse sweep GREEN on this sheet, both engines | **closed** (bar SELF's skip) |
| 9 | carried | check 8 (§3); T9-R8: the clauses the control fails on the same payload are printed (ch light-1 G2+G5 on all three lines, light-2 `.pl-qual` G2, dark-1 G2 on all three; wk light-1 G2 on all three + G5 on `.pl-state`, light-2 `.pl-qual` G2, dark-1 G2 on all three); `--tap-floor` ×2 = T9-R10; π and the filter census re-read once (§4) | carried, cited |

`player-tally.spec.ts` whole: **chromium 29 passed, exit 0; WebKit 28 passed, 1 skipped (the Tab row, declared in the
spec: PW-WebKit does not move focus on Tab), exit 0.** The widest board 5/5 per engine, its planted lap SEEN.


## 2 · The born-RED transcript and the sabotage batteries (G14, the four T9-R8 cells × both engines)

`r5breaks.py`: one edit per job, the file restored by copy and sha1-checked (`restored=OK` on every job), the plant's bytes
read back from `od -c` (`r5od.py`: present in every dump, zero `\u` escapes). Each engine is its own guarded call.
The row asserts the CLEAN verdict first, so a FILE plant must red the shipped surface itself; an unseen in-run plant can
no longer be what reds it (pass 8's FADE80F hole).

- **FILE plants** (product CSS written into `PlayerLobby.vue`'s own `<style>`, quiet lines `.pl-state, .pl-qual, .pl-more`):
  `OPA80F` `opacity: 0.8`; `COMB` 1 px stripes at 25 % α (`repeating-linear-gradient … #000 0 1px, rgba(0,0,0,.25) 1px 2px`
  as a mask); `FADE80F` `-webkit-text-fill-color: color-mix(… currentColor 80%, transparent)`; `HEAD12F` (pass 7's) the
  first 6 px (2 px on `you`) at 25 %. `PLUSF2` writes `{{ LOBBY_COPY.plus(TALLY_MAX, count - TALLY_MAX) }}` beside the
  count the mark renders (`PlayerMark.vue`), read by the `plus` twin.
- **Clause sabotage** (`G14_DROP=Gk`: clause k deleted from the verdict, LAWS P7 §F(ii)): C1–C5. Each must red, on the
  plant only that clause sees in the run: C1 on `EMPTY_hidden` (only G1 sees an empty line), C2 on the `G2win_*` hair
  fades (light DPR 2, the one cell whose bound leaves a window past 0.5), C3/C4 on the in-run TEXT_PLANTS, C5 on the
  `G5one_*` single-glyph sweep (dark cells).
- **Threshold sabotage** (LAWS P8 §F): `G14_SLACK` ±0.005 around the stated 0.05 (the clean fraction equals the
  control's, so −ε puts the bound under the line's own fraction and must red; +ε must hold), beside the in-run edge rows
  (each line's own fraction −0.005 reds G3, +0.005 holds) printed with the margin.

| job | engine | exit | cells red | clean verdict's clauses per cell (– = clean holds) | the first assertion each red cell threw |
|---|---|---|---|---|---|
| OPA80F (FILE: opacity 0.8) | chromium | 1 | 4/4 | light-1 G3+G4 · light-2 G2+G3+G4 · dark-1 G3+G4+G5 · dark-2 G2+G3 | .pl-state |
| OPA80F (FILE: opacity 0.8) | webkit | 1 | 4/4 | light-1 G3+G4+G5 · light-2 G2+G3+G4 · dark-1 G3+G4 · dark-2 G2+G3 | .pl-state |
| COMB (FILE: 1 px comb 25 %) | chromium | 1 | 4/4 | light-1 G3+G4 · light-2 G2+G3+G4+G5 · dark-1 G3+G4+G5 · dark-2 G2+G3+G4+G5 | .pl-state |
| COMB (FILE: 1 px comb 25 %) | webkit | 1 | 4/4 | light-1 G3+G4+G5 · light-2 G2+G3+G4+G5 · dark-1 G3+G4+G5 · dark-2 G2+G3+G4+G5 | .pl-state |
| FADE80F (FILE: fill 80 %) | chromium | 1 | 4/4 | light-1 G3+G4 · light-2 G2+G3+G4 · dark-1 G3+G5 · dark-2 G2+G3 | .pl-state |
| FADE80F (FILE: fill 80 %) | webkit | 1 | 4/4 | light-1 G3+G4+G5 · light-2 G2+G3+G4 · dark-1 G3+G4 · dark-2 G2+G3 | .pl-state |
| HEAD12F (FILE: head 6 px / 2 px at 25 %) | chromium | 1 | 4/4 | light-1 G4 · light-2 G2+G3+G4+G5 · dark-1 G4+G5 · dark-2 G3+G4+G5 | .pl-state |
| HEAD12F (FILE: head 6 px / 2 px at 25 %) | webkit | 1 | 4/4 | light-1 G4+G5 · light-2 G2+G3+G4+G5 · dark-1 G4+G5 · dark-2 G3+G4+G5 | .pl-state |
| C1 (clause: G1 deleted) | chromium | 1 | 4/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | EMPTY_hidden on .pl-state is seen |
| C1 (clause: G1 deleted) | webkit | 1 | 4/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | EMPTY_hidden on .pl-state is seen |
| C2 (clause: G2 deleted) | chromium | 1 | 1/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G2 sees a fade no other gated clause sees |
| C2 (clause: G2 deleted) | webkit | 1 | 1/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G2 sees a fade no other gated clause sees |
| C3 (clause: G3 deleted) | chromium | 1 | 1/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | FADE80_fill on .pl-qual is seen |
| C3 (clause: G3 deleted) | webkit | 1 | 1/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | FADE65_fill on .pl-state is seen |
| C4 (clause: G4 deleted) | chromium | 1 | 4/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | HEAD12_a25 on .pl-qual is seen; TAIL12_a25 on .pl-state is seen |
| C4 (clause: G4 deleted) | webkit | 1 | 3/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | HEAD12_a25 on .pl-qual is seen; TAIL12_a25 on .pl-state is seen |
| C5 (clause: G5 deleted) | chromium | 1 | 2/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G5 sees a glyph no other gated clause sees |
| C5 (clause: G5 deleted) | webkit | 1 | 2/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G5 sees a glyph no other gated clause sees |
| SLACK-eps (threshold: slack −0.005) | chromium | 1 | 4/4 | light-1 G3 · light-2 G3 · dark-1 G3 · dark-2 G3 | .pl-state |
| SLACK-eps (threshold: slack −0.005) | webkit | 1 | 4/4 | light-1 G3 · light-2 G3 · dark-1 G3 · dark-2 G3 | .pl-state |
| SLACK+eps (threshold: slack +0.005) | chromium | 1 | 3/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G2 sees a fade no other gated clause sees; G5 sees a glyph no other gated clause sees |
| SLACK+eps (threshold: slack +0.005) | webkit | 1 | 3/4 | light-1 – · light-2 – · dark-1 – · dark-2 – | G2 sees a fade no other gated clause sees; G5 sees a glyph no other gated clause sees |
| PLUSF2 (FILE: a shown `plus` line in `PlayerMark.vue`) | chromium | 1 | the `plus` twin | – | no shown text holds a plus line at 6 (received `5 plus 1`) |
| PLUSF2 (FILE: a shown `plus` line in `PlayerMark.vue`) | webkit | 1 | the `plus` twin | – | no shown text holds a plus line at 6 (received `5 plus 1`) |
| LAPX (the widest board's `lap()`: x-overlap conjunct deleted) | chromium | 1 | 1/5 boards | – | 812×375: laps no cell (received 32) |
| LAPX (the widest board's `lap()`: x-overlap conjunct deleted) | webkit | 1 | 1/5 boards | – | 812×375: laps no cell (received 32) |
| LAPY (the widest board's `lap()`: y-overlap conjunct deleted) | chromium | 1 | 2/5 boards | – | 390×664, 390×844: laps no cell (received 48) |
| LAPY (the widest board's `lap()`: y-overlap conjunct deleted) | webkit | 1 | 2/5 boards | – | 390×664, 390×844: laps no cell (received 48) |

`.pl-state` in the last column: the CLEAN verdict reds, and `.pl-state` is the first line it asserts.


What the battery says, clause by clause (both engines agree on every verdict below):
- **The FILE plants red the shipped surface itself, 4/4 cells × 2 engines each** (OPA80F, COMB, FADE80F, HEAD12F): the
  CLEAN verdict is the first assertion thrown in every red cell. OPA80F and FADE80F red G3 on every line of every cell
  (pass 8: OPA80F GREEN in all four light cells, FADE80F's clean verdict GREEN 6/8). COMB reds G5 wherever G5 is gated
  (pass 8: GREEN 4/8). PLUSF2 reds the `plus` twin in both engines (`no shown text holds a plus line at 6`).
- **C1** reds 4/4 × 2 (`EMPTY_hidden` unseen); **C4** reds 4/4 chromium, 3/4 WebKit (`HEAD12_a25` / `TAIL12_a25` unseen;
  WebKit dark-2 has no G4-only plant); **C2** reds 1/4 × 2 (light-2, the one cell whose bound leaves a window past 0.5: the
  `G2win_*` hair fades, the G2-alone set 18 chromium / 15 WebKit); **C3** reds 1/4 × 2 (dark-1: `FADE80_fill` on `.pl-qual`
  chromium, `FADE65_fill` on `.pl-state` WebKit; elsewhere every in-run plant G3 sees, G2 or G4 also sees: G3's own pin is
  the in-run edge pair and the FILE plants, not C3); **C5** reds 2/4 × 2 (the dark cells, where it is asserted; pass 8: C5
  GREEN 8/8). The G5-alone sets on the clean read: chromium dark-1 8, dark-2 2; WebKit dark-1 4, dark-2 6, light-1 2 (WebKit's
  control passes G5 on `you` and the foot at light DPR 1, so G5 is gated there; it is printed, not asserted).
- **Threshold.** Slack −0.005: the clean verdict reds G3 on every line, 4/4 × 2. Slack +0.005: **the clean verdict holds
  4/4 × 2 (passes by ε)**, and the row still reds 3/4 × 2 — on the isolation rows, not on the verdict: at that slack G3 sees
  every single-glyph and hair fade too, so no plant is G5- or G2-alone. **The isolation is slack-coupled** (`r5iso.py` on the
  clean reads): the smallest G5-seen single-glyph plant sits 0.011 (chromium dark-1) / 0.033 (chromium dark-2) / 0.007 and
  0.032 (WebKit dark-1, dark-2) above the control's fraction, and the smallest G2-alone hair fade 0.005 / 0.008 (light-2
  `.pl-more`). At the stated 0.05 every asserted set is non-empty; under 0.033 chromium dark-2's empties. Gap 3.
- **PLACE's graft, the lap predicate's two conjuncts** (`LAPX`/`LAPY`, the x- or y-overlap clause deleted from the widest
  board's `lap()`): LAPX reds at 812×375 (32 cells "lapped"), LAPY at 390×664 and 390×844 (48), identical in both engines (each job exit 1; LAPX 1 red / 4 green, LAPY 2 red / 3 green).
  Each conjunct deleted reds the row: neither is unpinned.


## 3 · The gates, BARE (each exit written by its runner to its own file, `r5light.sh`; read 13:35–13:50, load 8–53)

Three trees: this lane's tree; the union `74a2b5d9 + WAVE.diff + homes.on-WAVE.diff (= acde977b) + SELF's pass-9 on-WAVE
delta + this lane's on-WAVE delta` (the lane scratch `r5w/w2`, frontend tree in §8); the bare union `acde977b` (a fresh
`git archive 74a2b5d9` + the two diffs). Every row `guarded --light`.

| gate | tree | union + delta | bare union | the delta's own |
|---|---|---|---|---|
| `vue-tsc -b` | 0 | 0 | 0 | — |
| `typecheck:e2e` | 0 | 2 | 2 | none: the union's `zone-grammar.spec.ts` (9 errors, lines 7, 1716, 1729–1730) |
| `lint` (prettier) · `eslint --max-warnings 0 .` | 0 · 0 | 0 · 0 | 0 · — | — |
| `check-copy-register` (M16) · `lint:copy` | 0 · 0 | 0 · 0 | — · 0 | — |
| `test:font-coverage` | 0 | 0 | 0 | — |
| `lint:sleep` | 0 | 1 | 1 | none: the union's `keys-crib.spec.ts:333/337` |
| `lint:theme-tokens` | 0 | 1 | 1 | none: `--tap-floor` ×2 (`ConfirmRibbon.vue:140/141`), ledger T9-R10 (the bare union also reads 2 masked defaults; the delta's 0 is SELF's `--head-rule` fallback strike) |
| `lint:bands` | absent at `74a2b5d9` | 1 | 0 | **SELF's, by sha**: B2 `MOTION.presenceInkMs = 400` (SELF's declared seam, ballot B-SEAM) |
| `lint:verbs` · `lint:tape-foot` | absent | 0 · 0 | 0 · 0 | — |
| `test:e2e:projects` (check 8) | 1 (live 289/286 vs floor 214/212) | 1 (live 443/440 vs floor 351/350, band 377/374) | 0 (live 391/389) | **check 8 FLOOR BAND, carried (row 9)**: §11's two specs add 52 rows per engine to the union; the restamp is the WGATE's, never a lane's |
| `lint:knip` · `boundary` · `lanes` · `motion` · `ink` · `catch` · `tdz` · `live-regions` · `theme-selectors` | 0 each | 0 each | knip 0 | — |

The union's three admissions for §11's new constants and sites are the dead attempt's, read hunk by hunk this attempt and
kept as PROVISIONAL for §13's fold (a gate is never re-worded to pass; these ADD rows, each naming §11): `check-motion-bands.mjs`
`tallyStaggerMs` 90 (a DELAY) plus the `useTallyStrokes` `pos * MOTION.tallyStaggerMs` arithmetic row; `check-pencil-verbs.mjs`
the tally stroke's `stroke var(--presence-ink-dur)` colour turn; `check-font-coverage.mjs` the `PlayerMark :rows` roster.
Each admission's born-RED, re-read this attempt (`r5admit.sh`: the file swapped for its pre-admission form on the union,
the gate re-read, the file restored and sha1-checked, 13:50–13:51): `lint:bands` **1** with `B2 MOTION.tallyStaggerMs = 90`
and `B13 useTallyStrokes.ts:159 pos * MOTION.tallyStaggerMs` beside SELF's one red (`38e05cdb → 3e133498`, restored OK);
`lint:verbs` **1** at `PlayerMark.vue:573 stroke var(--presence-ink-dur) var(--ease-standard)` (restored OK);
`test:font-coverage` **1** at `App.vue <PlayerMark :rows="markRows">`, unpinned (restored OK). Restored, each reads as tabled.

## 4 · π and the filter census, once this pass, on BUILT dists (`r5pi2.sh` chromium, `r5piwk.sh` WebKit)

The tree built out of tree (`vite build`, private cacheDir, exit 0) and served as a dist on `:4242` (`index-hxS-Vg-9VUB2.js`)
beside the control's dist on `:4260` (`index-CubiZsMVSwTc.js`), each identity read back from the served HTML. One context
per read, closed in a `finally`; chromium each spec its own `guarded` call, WebKit all four inside ONE `guarded
--exclusive webkit` call.

| read | chromium | WebKit |
|---|---|---|
| π noise (control against itself) | 0 rows, 4/4 cells | 0 rows, 4/4 cells |
| π delta (tree against control) | 156 (1280×800) · 155 (390×844), both themes | 156 · 155, both themes (the same rows) |
| delta rows outside the head | 0 (see below) | 0 |
| filter census, `filt9` (shut / open, both themes) | tree = control: css 25 light / 27 dark, url 24, visible 5, filter elements 15 | tree = control, shut and open: css 25 / 27, url 24, visible 5, filter elements 15 |
| `e2e/filter-census.spec.ts` (G3.1 against `filterBudget.ts`) | 6/6 passed on `:4242` and on `:4260` | 6/6 passed on `:4242` and on `:4260` |

- **Every delta row is the head's**: the desktop corner (`corner-left`: `display: block → flex`, 76 → 120 px wide, its
  card re-parented under `div.attribution-disclosure`), the mark, the lobby. The one row the classifier first called
  "elsewhere" (`+ div>div.bg-background.flex>div.flex.items-center#1`, one per cell) is the mobile attribution card's root,
  re-keyed by its new `flex items-center` classes (its child is `div.attribution-disclosure`): a head row too. WebKit's
  printed values say so: `display: none` at 1280×800 (`md:hidden`), `display: flex` at 390×844.
- Spec exits: chromium `pi9` 0, `filt9` 0, census 0 · 0 (16:54–16:57, load 26); WebKit 0, 0, 0 · 0 (18:31–18:33, one lock, load 14–17).
- `filterBudget.ts` is byte-identical to `74a2b5d9`'s; filterBudget does not grow. No board, gallery or drawer row moves.


## 5 · Instruments (relative product paths only), and the PROPOSED diff

- `e2e/player-tally.spec.ts` imports `./lib/glyph-pop.mjs` (homes v2 by sha, `homes.diff` sha1 `1f70cfda`, tree
  `d17813ba`; no fork, no residual edit). G14 uses the library's four folded clauses: `glyphGate({ control })`
  (`anchor`: the G3 bound cut from the CONTROL's read of the same payload), `boundOf`'s clamp (`G3clamp`), the control's
  `g4Lows` as `tolerate` (`g4tol`) and `glyphPopulation`'s `g5Q` low-quantile core (`G5core`). Charter rows 1, 2, 4 and 5
  are the chair's folds of COUNT's pass-8 PROPOSED diffs (homes v2 §2, its self-test 182 rows both engines, FILE anchor
  RED by G3 8/8); this lane consumes them and re-reads them on the product (§2). The pass-8 `lowsOf` reader, which
  parsed the probe's `why` strings, is gone. No import from `docs/` (grep: 0 in `e2e/`, `scripts/`, `src/`).
- `e2e/player-mark.spec.ts` (SELF's, by sha) imports `./lib/edge-bands.mjs` (homes v2).
- The π census and the filter census (§4) ran from lane-scratch specs (`r5pi/pi9.spec.ts`, `r5pi/filt9.spec.ts`; they
  open a context per read and close it in a `finally`) and the product's own `e2e/filter-census.spec.ts`.
- Lane drivers (scratch, copied to `instruments/` for the replay): `r5srv.sh` (servers), `r5run.sh` (one project per
  guarded call), `r5breaks.py` (FILE plants and clause/threshold jobs, one edit per job, restored by copy and sha1-checked,
  `od -c` per plant; `r5od.py`), `r5breaks3.py` (the same jobs as direct playwright calls, run inside ONE
  `guarded --exclusive webkit` call by `r5wk.sh`: the per-job lock re-queued behind other repos' runs, incident 3),
  `r5sum.py`, `r5cls.py`, `r5table.py`, `r5iso.py` (the G14 summaries, the §2 table, the isolation margins),
  `r5light.sh` + `r5admit.sh` (gates, admission born-REDs), `r5pi2.sh` + `r5pic.py` (π), `r5unit.sh`, `r5g5tol.sh`,
  `r5bank.sh` + `cut.sh`, `r4wave.sh` + `onwave2.py` (the union), `r5cls-orphans.py` (gap 8).
- **PROPOSED, not banked: `proposed/glyph-pop.g5tol.diff`** (9,433 B, filed 10-08 by this lane's first attempt), now
  re-read this attempt on a scratch copy of homes v2's `glyph-pop.mjs` + `.d.mts` (`git apply` 0): its `--self-test`
  reads **186 rows, exit 0, both engines** (homes v2 itself: 182 rows, exit 0, both engines); with
  `GLYPH_SABOTAGE=g5tol` the four `#g-long g5tol HEAD12` rows read `same plant, tolerated → G5 RED ← a hole` and the
  self-test exits **3** in both engines (the born-RED). The clause: glyph k under the floor is tolerated only where the
  CONTROL's glyph k is under it too and this read is no worse by more than 0.05 (a deeper 8 % fade still reds). It would let
  G5 gate a regression on the lines where the control fails G5 whole (gap 2). The chair folds or strikes; this bank does
  not depend on it, and this lane is its author (a non-author run is the fold's condition, CHAIR-RULINGS §9).


## 6 · The union (pass 9's WAVE lands §11 for the first time)

- **The on-WAVE delta is cut against `acde977b`** (= `74a2b5d9` + `WAVE.diff` + `homes.on-WAVE.diff`, reproduced from a
  fresh `git archive`), with SELF's pass-9 on-WAVE delta (`33e41544`) taken by sha first; this lane's files overlaid file
  by file (`onwave2.py`, a 3-way per file: base = SELF's pass-9 tree where SELF touches it, else `74a2b5d9`).
- **Four files conflicted, each resolved to the union's side (read this attempt):** `knip.json`, `src/assets/index.css`
  (both SELF's / homes' content, already on the union), `pencilConfig.ts` (hand-merged: the union's bands plus §11's
  `tallyStaggerMs` and `tallyBoil`), and **`DifficultyTally.vue` (6 hunks): COUNT's refactor of the difficulty tally onto the shared
  `useTallyStrokes` does NOT ride the union.** The union's DifficultyTally carries the §1/§5 re-cut (`poseFronts`,
  `frontGate`, `frontTween`: one clock and one gate for its five strokes). Porting the refactor would make
  `useTallyStrokes` take `frontGate`/`frontTween` by sha, which CHAIR-RULINGS pass 9 §6 forbids until FIVE's pass-9 row 1
  lands. So on the union the difficulty tally keeps its own strokes and the head mark's strokes draw on `useTallyStrokes`'s
  own clock (§1/§5's one-gate law does not yet reach the mark: a coupling row for the fold, gap 5).
- The union's own reds (`typecheck:e2e`, `lint:sleep`, `lint:theme-tokens`) read the same on the bare union (§3).
- **Unit battery** (`r5unit.sh`: ten chunks by directory, each its own `guarded` call, `--maxWorkers=2`, every exit read
  from its file): the tree **69 files / 838 tests, all ten exits 0** (17:39–17:41); the union **78 files / 963 tests, all
  ten exits 0** (17:41–17:42). No test file sits outside the ten chunks on either tree (`find src -name '*.test.ts'`).


## 7 · Incidents (self-declared)

1. **A provisional bank cut caught a live plant.** `r5bank.sh` ran once (13:44) while the battery held OPA80F in
   `PlayerLobby.vue`; its `pass9.diff` (scratch only, sha1 `a5baf95a`) carried `opacity: 0.8`. It never left the scratch:
   moved to the lane's trash, and the bank in §8 was cut after the battery with the tree read back at `d7b5584f`+edits.
2. **One `git apply --check` discovered the main repo.** Staging the g5tol scratch copy, the first `git apply --check`
   ran without `GIT_CEILING_DIRECTORIES` and resolved the enclosing repository (read-only; both paths "Skipped", no write).
   Re-run with the ceiling set. No other git ran near main; none in the control tree.
3. **My WebKit waiter, stopped.** The first WebKit run queued on the `webkit` lock (held by another session's
   `stage main`); I stopped my own waiter by PID (`r5run.sh` 14875 / `guarded` 14925, both mine) so that no chromium
   battery would overlap it, and re-queued the WebKit column behind the chromium chain.
4. **Foreign load.** The guard held every heavy run for headroom at loads 38–70 (13:42–13:46; CrowdStrike 454 % CPU,
   a VS Code plugin host, another repo's eslint). No timing row is cited from this pass.
5. **The WebKit column re-sequenced under ONE lock.** Per-job `guarded --exclusive webkit` calls re-queued on the lock
   between jobs (the lock passed to PLR-PLACE's 90-min session and a glass-ui run after my OPA80F job; COMB waited 30+ min).
   At 15:36 I stopped my own WebKit chain (`r5chainW.sh` 45082, `r5breaks.py` 40706, `r5run.sh` 56300, its waiting guard
   56351) and its two waiters (85275, 99026), all mine. **COMB was planted at that instant**: Python died without its
   `finally`, so I restored `PlayerLobby.vue` from the job's backup (sha1 `e84317d3` → `2660643c`, the pre-plant blob) and
   re-cut the tree: write-tree `3d5f368a` = the open tree plus the one comment move, nothing else. The remaining WebKit jobs
   then ran inside ONE `guarded --exclusive webkit` call (`r5wk.sh` → `r5breaks2.py`, playwright direct inside it; a nested
   guard would deadlock on the flock). The COMB WebKit row in §2 is from that run.
6. **The ensure that held a pipe.** `r5breaks2.py` called `r5srv.sh ensure` with a captured stdout; the servers' subshells
   inherit it, so when the ensure cycled the servers (15:51, age > 70 min) the battery waited on that pipe for 7 minutes
   holding the WebKit lock. Killing the subshells killed both servers (`guarded`: "caller died"), so FADE80F's WebKit read
   ran without its control: it was moved to trash and re-run. I restarted the servers, stopped the hung battery at HEAD12F
   (plant restored from its backup, sha1 back to `2660643c`), appended the rest of the battery to the running `r5wk.sh` on
   `r5breaks3.py` (the ensure writes to a file), and every WebKit row in §2 is from that run (16:01–16:25). The servers
   started inside the outer WebKit guard ended with it at 16:25; the next job's ensure restarted them outside it.
7. **One `rmdir`.** Clearing the dead attempt's evidence, I removed the then-empty `readings/` directory with `rmdir`
   (17:17) instead of moving it to trash. Nothing was in it; the rule is no `rm` in any form, and this was one.
8. **The π spec changed between engines (output only).** After the chromium π run I made `r5pi/pi9.spec.ts` print an added
   row's values (`+ key :: values`); the comparison is unchanged. The WebKit π rows carry the values; chromium's do not.
9. **The instrument copies carried the lane's absolute paths.** The two diffs grepped clean from the cut, but the replay
   copies in `instruments/` named the checkout, the worktrees, the lane scratch and the guard by absolute path (15 files).
   At 17:31 each root was replaced by a placeholder (§9 step 6); the grep over `instruments/` and `proposed/` now reads one
   hit, `r5bank.sh`'s own pattern. The copies are for reading and replay; no row in this README ran from them.
10. **The WebKit π, re-queued twice.** It waited 42 minutes on the `webkit` lock behind other repos' runs (16:57–17:39). I
    stopped my own waiting guard by PID (no child, it never held the lock) so the unit battery could run first, then
    re-queued the WebKit π as `r5piwk.sh`. Its first run got the lock at 17:55 and read nothing: launched from another cwd,
    `npx` resolved a `playwright` with no `test` command (`unknown command 'test'`, 7 s, no browser opened). Those logs went
    to the lane's trash; the run in §4 is the second, launched from the frontend. The control was cycled once, 17:25, by its
    recorded PID after the cwd check, so no read met its 90-minute guard.

## 8 · Bank

`pass9.diff` sha1 `f78f9cf1` (725,892 B, 40 files +14,552/−514, `--binary` on `74a2b5d9`, product paths only; tree
`3d5f368a`, frontend `d4a6103a`) · `pass9.delta.on-WAVE.diff` sha1 `de566d09` (290,758 B, 28 files +4,822/−453, on
`acde977b` + SELF's `33e41544`; result frontend `2237e3d2`, no home path) · `apply --check`: base **0**; s10, s13-s7-s3,
bare WAVE `acb9c08e`, `acde977b` **1** each (every error "already exists": the homes); the delta on `acde977b` **0**, on
the bare WAVE **0**. Each diff applied for real on a scratch archive and read back to its tree. Every exit, sha and tree is
in `BANKED.txt`. Both diffs grep 0 for the law's scratch, tmp and dot-dir strings.


## 9 · Replay route

1. Apply `pass9.diff` to a fresh `git archive 74a2b5d9` (it carries homes v2 and SELF's pass-9 by sha); for the union,
   apply `pass8/integrate/WAVE.diff`, `pass9/instruments/homes.on-WAVE.diff`, `pass9/prototype/PLR-SELF/pass9.delta.on-WAVE.diff`
   and then `pass9.delta.on-WAVE.diff` (each `apply --check` 0, §8).
2. Serve the tree on `:4242` (`instruments/r5srv.sh ensure`: Vite dev with a private cacheDir) beside the control on `:4260`
   (`w7-control`'s dist).
3. `G14_CONTROL=http://127.0.0.1:4260 npx playwright test -c <lane pw.config> player-tally.spec.ts --project <engine>
   --workers=1` (each engine its own `guarded` call; WebKit `--exclusive webkit`); then `player-mark.spec.ts` the same way.
4. The battery: `B13_PROJS=<engine> python3 instruments/r5breaks.py OPA80F COMB FADE80F HEAD12F PLUSF2 C1 C2 C3 C4 C5
   SLACK-eps SLACK+eps LAPX LAPY` for chromium; for WebKit, `instruments/r5wk.sh` runs the same jobs through `r5breaks3.py`
   inside ONE `guarded --exclusive webkit` call. Classify with `instruments/r5table.py <logdir>` and `instruments/r5cls.py <log>`.
5. Gates: `instruments/r5light.sh <label> <cmd>` per row on the tree, the union and the bare union; `r5admit.sh` for the
   union's admissions; π with `instruments/r5pi2.sh` then `r5piwk.sh` for WebKit (r5pi2 builds the tree out of tree and serves the dist on `:4242`).
6. The instrument copies name their roots as placeholders, never as paths: `$REPO` (the checkout), `$TREE` (the lane's
   worktree), `$CONTROL` (`w7-control`), `$WORKTREES`, `$LANE` (the lane's own scratch: rig, logs, plants' backups) and
   `$GUARDED` (the machine's guard). Set them before a replay; the one literal left is `r5bank.sh`'s own grep pattern.
