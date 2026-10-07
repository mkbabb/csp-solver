# PAL-WALK · pass 8 critique (§11c, the hue walk)

Critic, not the author. Every number marked **re-derived** was measured by this critique on the tree, on
`127.0.0.1:4244` (my dev server, listener PID 56565 under wrapper 56512, cwd = the tree, killed by PID at the
end). The control port `:4252` was not bound: every control reading this critique needs is HEAD's
same-index ink painted in-run, the control's pre-built dist read from disk, or the pass-7 bank's own gate.

## Verdict

**85 · ADVANCE.** Pass 7 stood at 87. Pass 8 lands real closures: L6's pair half as a product gate, the CI
pin, the per-read G3 bound, hand 0 as a second subject, and the B-TAPE cost written and framed. Three
things take points off:

- Deleting check 4's fork **regressed** its coverage. Three shapes the pass-7 fork reds now pass (row 1).
- Gate 2's "room of 2" is not a room the product can hold. Under index churn the walk's names separate
  worse than HEAD's on every count, and no ballot row prices that (row 10).
- The CI pin holds the band's number but not the painted cure: the consumer, the paper and the label's
  opacity each pass CI (row 3).

The idea does not die on any number read here. Each gap has a known cure.

## Gaps first (exact)

1. **Row 1 REGRESSED: the fork's deletion lost three shapes.** Planted on fresh copies of the tree, each
   read bare by the pass-8 gate and by the pass-7 fork (`git show 22b09667:…/check-peer-arcs.mjs`).
   `readings/attacks.tsv`, `readings/fork-parity-N3-N4-N5-N12.txt`:

   | plant | the shape | pass 8 | pass-7 fork |
   |---|---|---|---|
   | N4 | `document.styleSheets[0].insertRule(".dark { --peer-name-l: 0.5 }")` | **0** | 1 |
   | N5 | a `<style>` whose `textContent` is `.dark .washi-label { --color-peer-name-ink: #777 }` | **0** | 1 |
   | N12 | `new CSSStyleSheet().replaceSync(".dark { --peer-name-l: 0.5 }")` + `adoptedStyleSheets` | **0** | 1 |
   | N3 | `el.attributeStyleMap.set("--color-peer-name-ink", "red")` (Typed OM) | 0 | 0 |

   - **Why.** The library's `tokenSites` string arm (`scripts/shape-census.mjs:1691–1701`) runs `decls()`
     over a string that holds a whole RULE. `.dark { --peer-name-l` never parses as the property. A
     library probe (`instruments/probe-ts.mjs`) finds 0 sites in the planted files for both tokens.
   - The prototype's attack battery replayed only the pass-7 critic's plants, where the fork read 0. It
     never ran a **fork-parity** battery (every shape the fork reds must red through the library) before
     the fork was deleted.
   - N3 is a new shape: the class is still enumerated, on its fifth pass.
   - The cure is a PROPOSED library diff, with its plants, that reads a rule held in a string.

2. **Row 10 OPEN, and the "room of 2" that gate 2 gates is not a room.**
   - `check2Separation` reads `nearestOf(…, SEP_ROOM)`: the first two hands, 0 and 1.
   - The product never reassigns an index (`useSession.ts:374–379`; `inkIndex[id] ?? inkCursor++` at
     :575). After one churn, a two-player room holds any pair `{i, j}`.
   - Re-derived name ΔE at the painted 8-bit bytes (`readings/churned-rooms-of-two.txt`):

     | hands | walk pairs < 0.10 | walk's worst pair | HEAD pairs < 0.10 | HEAD's worst pair |
     |---|---|---|---|---|
     | 0..7 | **11/28** | 2–7 at **0.0144** by day, 0.0139 at night | 8/28 | 0.0602 / 0.0593 |
     | 0..15 | **51/120** | **0.0073** / 0.0057 | 35/120 | 0.0234 / 0.0239 |

   - The walk's "capacity 2" is the capacity of a room nobody has ever left. On any churned room its
     names are LESS separable than HEAD's one string. That is a design cost of the walk that sits in no
     ballot row; B-TAPE prices legibility against HEAD and never separability.
   - Watch 2 stays **HALF MET** by gate-2 sha `55f2b88b`, as the prototype says. The gate that marks it
     half met is keyed on the wrong statistic.

3. **The CI pin holds the number, not the cure (LAWS P7 §F).** Planted on copies; "CI" means
   `check-peer-arcs` plus `useSession.test.ts`.

   | plant | the change | CI | local paint gate |
   |---|---|---|---|
   | N1 | the consumer swapped to the digit ink, `GameBoard.vue:1245` `color: var(--color-user-ink)` | **0**, 46/46 | DIGIT reads 3.19 (chromium DPR 2, dark), a G2 red |
   | N16 | `opacity: 0.55` on the tape label | **0** | — |
   | N2 | the paper reverted to `var(--sheet-washi-neutral)` | **0** | **also green** (gap 4) |
   | N14 | a coordinated move of module and sheet to 0.83 | **1** | — |
   | N15 | a coordinated move of module and sheet to 0.84 | 0 | — |

   - N14 and N15 put the pin exactly at 0.84.
   - **The pin's cited basis is a deleted instrument's number.** `useSession.test.ts:358–361` and the
     `NAME_FLOOR` docstring say "0.82 reads 4.369 on chromium DPR 1's top-row cell, 0.84 clears 4.5".
     On the ONE probe the shipped 0.86 reads **3.077** there (whole population, re-derived at 3.077 in
     the prototype's own table), so "clears 4.5" is false.
   - The critic's night sweep through the ONE probe (B `…0b0b` on A's page, cell 8,
     `readings/night-sweep-one-probe.txt`), whole-population median:

     | config | 0.86 (shipped) | 0.84 | 0.82 | 0.80 | 0.79 (the ring) | HEAD same-index |
     |---|---|---|---|---|---|---|
     | chromium DPR 2 | 6.610 | 6.214 | 5.830 | 5.424 | 5.248 | 5.542 |
     | WebKit DPR 2 | 7.192 | 6.723 | 6.318 | 5.876 | 5.691 | 5.991 |
     | WebKit DPR 1 | 6.947 | 6.465 | 6.071 | 5.640 | 5.460 | 5.756 |

   - G1–G5 pass down to 0.79 (pass 6's ring string) in chromium DPR 2 and WebKit DPR 2.
   - WebKit DPR 1's G3 reds 0.82 by 0.002 (0.326 against 0.324), but only because the bound is read off
     the shipped 0.86. After a true coordinated move the bound re-reads and goes green.
   - The only clause that separates the cure from its revert is B-TAPE's relative comparison. That puts
     the least passing value in **(0.80, 0.82]**. The number 0.84 is conservative, but it was not
     re-derived.

4. **The paper cure has no gate.** The card-laid paper (`GameBoard.vue:1253–1255`) is a claimed π move.
   - Reverted, it reads GREEN on every read in both engines (medians ×0.88–0.99; chromium DPR 2 dark
     5.782 against 6.610).
   - PAPER is only PRINTED in §C, never required.
   - The comment's "4.374:1 through the line" does not reproduce on the ONE probe.

5. **FADE65 in WebKit DPR 2 is required, and its margin is 0.001.** The spec plants only payload 0
   (`planted = n === 0`), at `cells[0]` and `cells[last]`. `002e` is never planted.
   - At every cell of both payloads (`readings/fade-at-every-cell.txt`), FADE65 reds 16/16 per variant.
   - The minimum margin is at `002e` cell 12: bound 0.273 against 0.274 (dark), 0.274 against 0.276
     (light).
   - FADE70v is **GREEN, a hole, 2/16**, at the same cells.
   - At DPR 1 the minimum margins are 0.034 (FADE65) and 0.022 (FADE70).
   - The cause: G3's slack of 0.05 is about WebKit's whole FADE65 effect (+0.050–0.066). Plant every cell
     of every payload, or bound G3 with a margin FADE65 can clear.

6. **§C is RED at chromium DPR 1.** Re-derived: exit 1, 6/24 clean rows. Cells 11, 12 and 14 by day
   (the given above), for both B payloads. Plants read 88/88 RED with 0 holes. Row 11 is not closed. The
   chair rules whether the `i` crossing the grid line is the rung's physics.

7. **§B, the ring gate, cannot fail in-run.**
   - It has no plant: no FAINT, no 1 px, no TAIL.
   - It has no per-band THICKNESS clause (LAWS P7 §E (ii)).
   - It reads through a hand-rolled PNG decoder and WCAG luminance (`rawOf` at `peer-walk.spec.ts:33–49`,
     luminance at :253 and :658). That is a carried fork of `paint-lib` / `edge-bands` after batch 0
     (§I). It is outside the charter's eleven rows, but it is §11c's own ring gate.

8. **The clause-sabotage battery covers only the 17 new clauses (plus 7 library clauses).** These carry
   no switch:
   - check 1, ARCS AGREE;
   - check 3's module = sheet agreement and its table binding;
   - check 2's two preconditions (the open complement, no repeated hue).

   The gate was re-cut whole (§F (ii)).

9. **A masked fallback in the product gate.** `safeLiterals` blanks every colour call the library
   throws on. The count is printed (5 on the tree) but has no ceiling, so a sixth blanked call reds
   nothing. It dies when `shape-census.literal-nothrow.PROPOSED.diff` folds; until then the count needs
   a pin.

10. **Declared by the prototype and confirmed.**
    - Row 5: no arm clears the whole-population floor at chromium DPR 1 cell 8 by day (T9-B-PW7-1 goes
      unframed, the chair to book).
    - The census row is APPLIED in an evidence copy only. Re-derived: 0 bare var() on the tree; the exit
      is 1 on the pre-existing STALE `--refuse-dur`.
    - The inert ride of `--color-peer-name-ink` is named, not cured.
    - DPR 3 is unread.
    - The runtime filter census is unread.

## What reproduces (re-derived, both engines)

- **The bank.**
  - The tree through a temporary index is `be10b47db1f4732d32478f50b20103c93a395af6`, both at open and
    at close.
  - `74a2b5d9 + pass7.diff (45543f8b) + homes.diff (a1d8adeb)` applies (exit 0) to tree `22b09667`.
  - `git diff --binary 22b09667 be10b47d` is **byte-identical** to `pass8-delta.diff` (151,636 B).
  - The advance is 4 files, +1466/−1369, with **no `src/` product file**: `ci.yml`, `peer-walk.spec.ts`,
    `check-peer-arcs.mjs`, and the unit pin in `useSession.test.ts`.
  - The sha1 values of `pass8.diff`, `homes.diff` and `pass7.diff` match `BANKED.txt`.
- **The homes.**
  - `shape-census.mjs` (sha1 `5b8739d5`) and `e2e/lib/glyph-pop.mjs` (sha1 `07bca94b`) equal the
    homes' bytes.
  - The imports are `./lib/glyph-pop.mjs` and `./shape-census.mjs`.
  - Nothing under `e2e/` or `scripts/` imports from `docs/`.
- **§C at DPR 2** (`readings/section-c-dpr2-rederived.txt`). Every figure equals the prototype's to the
  third decimal. Each cell reads name median / fraction under 4.5 / HEAD same-index median.

  | cell | chromium DPR 2 | WebKit DPR 2 |
  |---|---|---|
  | B `…0b0b` c8, light | 6.154 / 0.443 / 3.853 | — |
  | B `…0b0b` c8, dark | 6.610 / 0.374 / 5.542 | 7.192 / 0.210 / 5.991 |
  | A0 c16, light | 6.472 | — |
  | A0 c16, dark | 5.990 / HEAD 4.813 | 6.866 / HEAD 5.475 |

  - The B-TAPE minimum margin is +0.989 in chromium and +1.201 in WebKit.
  - Plants: chromium 88/88 RED, WebKit 72/72 RED, 0 holes. Both exit 0.
  - At WebKit DPR 2 by day, FADE65 on `…0b0b` reads 0.268 against 0.252.
- **The pass-7 plants, run first.**
  - A2, A3, A4 and A5: pass 8 exits 1, the fork exits 0.
  - A7, A8, A9 and A9b: 1 on both.
  - A10: 1 against 0, and the unit reds with 1 failed of 46.
  - The clean copy exits 0/0, and the unit passes 46/46.
- **check-peer-arcs on the tree.** Bare exit 0. The ΔE table matches the prototype's: N=2 0.1253/0.1255,
  N=3 0.0528/0.0513, N=4 0.0274/0.0271, N=5 0.0182/0.0194. `--self-test` exits 0, with 1 KNOWN HOLE
  printed. `--sabotage-battery`: see below.
- **The dist**, rebuilt out of tree from a `git archive` of `be10b47d` with a private cacheDir.
  - Its identity reproduces: `index-D6SsYDEtLYEn.js` / `index-DuyUzrAizsPb.css`, 37 assets against the
    control's 37.
  - `filter:` 9 = 9; `@property` 42 = 42; `antialiased` 0 = 0. The contamination cure holds.
- **π (served CSS, declaration multiset, scope hashes folded, against `w7-control`'s dist).** Exactly
  the prototype's list: the label's `color` and paper, plus the three band tokens in both arms. Nothing
  unclaimed.
- **The frame** (13,427 B, 354×388, four rows). One payload, one variable, 0 px outside the label. Its
  caption holds against the pixels: the ring-chroma rows are visibly redder, the shipped rows browner.
- **M16.** Unchanged in pass 8; pass 7's `cursors?` jargon row stands.

## The sabotage battery (this critique's run)

`node scripts/check-peer-arcs.mjs --sabotage-battery` on the tree exits **0**, with **24/24 clauses
biting** (17 gate, 7 library). Every bite blinds at least one self-test row (1–29 rows), so none of them
bites by crash alone (`readings/sabotage-battery.txt`, 17:56–18:19). `--self-test` exits 0 with 1 KNOWN
HOLE (S3b) printed. What the battery does not switch is gap 8.

## Box load

1-minute load was 37–61 during the browser rows (17:44–18:00) and 38–60 during the node rows. No row
cited here is a timing row.

## Incidents (the critic's own)

- I ran one read-only `git status --porcelain` in the prototype's worktree (LAWS P7 §A counts that as a
  touch). The tree sha re-read through a temporary index afterwards is still `be10b47d`, with no
  untracked entries.
- My first attack launch died with its parent shell. The second exited 126 (no exec bit). Both were
  relaunched through `bash`; no reading came from either.
- My first critic Playwright batch failed to load: the scratch dir had no `"type": "module"`, and 0 tests
  ran. Fixed and re-run; only the re-run is cited.
- One of my waits on the sabotage battery ran in the FOREGROUND for 600 s, a breach of the stall law.
  The harness moved it to the background. It only polled a log, so no reading came from it.
- Every scratch file is under `scratchpad/walkcrit8/`. The attack copies sit there with `node_modules`
  symlinked. There was no `rm`, no git in `w7-control`, and no write to the tree.

## Replay

- The attacks: `instruments/atk.sh`, run on copies (it needs `check-peer-arcs.p7.mjs` =
  `git show 22b09667:web/frontend/scripts/check-peer-arcs.mjs`).
- The ΔE rooms: `instruments/pairs.mjs` and `pairs2.mjs <frontend>`.
- The library probe: `instruments/probe-ts.mjs <copy>`.
- The browser rows: `instruments/pw.crit.mts` with `CRIT_MATCH=critnight|critfade` and `WALK_DPR`,
  against a dev server on the tree at :4244 (`?wire=local` is DEV-only).
- The spec's own §C: the prototype's `pw.palwalk8.mts` with its testDir pointed at the tree.
