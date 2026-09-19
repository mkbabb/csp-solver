# PAL-TIN pass 2 — the PROTOTYPE, on the real surface, both engines

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-58`
(branch `agent/wf_8630d340-e56-58`, off `a8fee1f5`). Uncommitted, as the pass requires:
`git -C <worktree> diff --stat HEAD` = 18 files, +450/−81, plus two untracked
(`scripts/check-peer-tin.mjs`, `src/games/shared/PlayerTick.vue`).

Server: 127.0.0.1:**4245** `--strictPort`, a two-line scratch vite config with a private
`cacheDir` (`probe/vite.scratch.mjs` is banked in the research lane's form; this lane's copy
lived in the scratchpad). KILLED before this file was written; the port is free.

## 0 · What the replay carried

`git apply --3way` of `pass1/prototype/PAL-TIN/proto/PAL-TIN-tracked.diff` applied **cleanly to
all sixteen files** (HEAD moved by docs only). Both untracked files copied across
(`PlayerTick.vue`, `check-peer-tin.mjs`). `vue-tsc --noEmit` then RED with two errors — the
`ident` type in `useSession.ts` names its imports one by one and pass 2 swaps `lapFor` for
`tallyFor` — which is the replay working: the type is a contract and it noticed.

## 1 · The wire (spec §1.1) — RED where it had to be

`src/games/shared/wire.red.test.ts` (banked at `probe/wire.red.test.ts`) is U1/U2/U3 alone, so
the same three rows run against three source states. Logs: `logs/wire-rows-{head,rider,proto}.txt`.

| row | HEAD | pass-1 rider | prototype |
|---|---|---|---|
| U1 an agreed index survives a non-author's rival `st` | **RED** (last heard wins: peer-9 ends on 7) | GREEN | GREEN |
| U2 a joiner's own publish agrees nothing | **RED** — *and not for the spec's reason* | **RED** (frozen at `peer-1`, index 0) | GREEN |
| U3 no two known ids share an ink across two epochs | **RED** | **RED** (2 distinct inks over 3 rows) | GREEN |

**Correction to the spec's booking.** §4 books U2 "GREEN at HEAD". It is RED at HEAD, because
HEAD binds NOTHING on your own hand in a room at all (`ink: {}` for self) — so the row reads
`{}` where it wants a stick. The row still does its work: it is RED at the pass-1 rider for
exactly the over-reach the rule names, and the rider's failure message is the evidence
(`--color-peer-1` held where `--color-peer-4` was published).

In-repo the same three rows live in `useSession.test.ts` (U3 asserts ink strings only, per the
spec's wording). Full unit battery: **55 files / 725 tests, all pass** (`logs/units-all.txt`).
`vue-tsc --noEmit` exit 0 (`logs/vue-tsc.txt`). `npx knip` clean. eslint clean on every changed
file. `lint:motion` OK (34 specs). `check-copy-register` exit 0, no string minted.

Three pages on the real surface (T10, both engines): A/B/C each see 3 rows, **duplicateInks 0**.

## 2 · The gate, re-cut and run bare

`scripts/check-peer-tin.mjs` — 19 reserved inks RESOLVED PER ARM through `var()` and `hsl()`,
of which 9 paint in a cell. Four gates, four negative controls, two reported rows.

| run | exit | what it says |
|---|---|---|
| HEAD's `index.css` (`probe/head/`) | **2** | `INSTRUMENT BROKEN: 0 light sticks and 0 dark` |
| pass-1 tokens (`probe/p1/`) | **1** | gate 1b RED, four findings, worst **ΔE 0.046** (dark violet vs `--color-solver-ink-2`); that band's own ceiling 0.058, score 0.79 |
| the prototype | **0** | 1a GREEN nearest anchor **13.57°** · 1b GREEN worst **ΔE 0.082**, ceiling **0.103**, score **0.80** · 2 GREEN worst pair **0.116** · 3 GREEN |
| `--self-test` | **0** | all four controls RED, one per gate |

Reported, never failing: six of the ten arms sit ON `chromaAt(L,h)` (light peer-4 0.216/0.273,
dark peer-5 0.216/0.293 are the two that do not); the 8-bit round trip is **0.000°** on every
stick, printed with the reason.

**The ceiling moved, and it is the pass's one arithmetic surprise.** The synthesis quoted the
research's 0.058/0.100 pair. Re-derived in the same run at the tin's OWN bands and chroma cap
(L 0.440/0.650, cap 0.216), this paper's five-stick ceiling is **0.103**, not 0.100 — so the
tin scores 0.80, not 0.90. It clears `RATIO_FLOOR` 0.75 with 0.05 to spare, and that is the
honest margin. (The packing search had to be fixed first: a greedy walk that wraps can return
five berths that are three distinct hues. With the wrap closed, the ceiling fell 0.114 → 0.103
and the pass-1 band's ceiling re-derived to 0.058, which is the research's own number.)

## 3 · The surface, both engines (`logs/run-battery-*.txt`, readings in `readings/`)

| row | chromium | webkit |
|---|---|---|
| **T1** AA, ten arms × two grounds, declared = painted | worst **5.178**, disagreed **0** | worst **5.178**, disagreed **0** |
| **T2** ring at its drawn 0.80 vs its OWN 4% fill | worst **3.617** (light 4.263 / dark 3.617); HEAD's 0.55 = **2.316** | worst **3.614** (light 4.263 / dark 3.614); 0.55 = **2.342** |
| **T3** solo: ticks 0/0, styled cells 0; leave path | empty-room cycle 0.52px, tin's cycle **0.52px** | 0.17px / **0.17px** |
| **T4** corner tick under 1 / 4 / 7 | overlap **0**; centre gap **33.92 / 34.55 / 38.61** cell-% | **0**; **33.92 / 34.49 / 38.55** |
| **T5** painted stroke = boardWidth/300 | 2.120 / 1.207 / 1.207 px (expected 2.133 / 1.220 / 1.220) | same to 3 dp |
| **T6** sixteen at the table, 1280 and 390 | 16 rows · **5** swatch colours · **11** ticks · worst gap **0.399rem** · rows 18.95 / 16.42px | identical |
| **T7** one-person room | alone both `rgb(37,99,235)`; peer arrives → both `rgb(133,57,0)`, both styled | identical |
| **T8** print / forced colours | tick, digit and roster tick all `rgb(0,0,0)` in both; on screen the tick is the peer's own ink | identical |
| **T9** census with 16 players, 11 ticks mounted | live filters solo 24 → full **24**, defs 15 → **15**, `added=none`, tick filters **0** | identical |
| **T10** three pages | 3/3/3 rows, duplicateInks **0** | same |

Every T1 AA figure matches `synthesize/PAL-TIN/tokens.txt` to three decimals: the arithmetic and
the engines agree byte-for-byte.

**T2's margin is the design's, not the model's.** The composite is canvas arithmetic over the
ring's own fill; a painted-pixel cross-check off a dpr-3 screenshot of the cursored cell reads
6.31 (chromium) / 17.99 (webkit) darkest-band-to-modal-pixel, which is a different and looser
question (it includes the digit). The gate quoted is the composite.

**T5's absolute numbers correct the spec.** The board measures 640px at 1280 and 366px at 390 in
this estate, not 556/390/362 — so the painted widths are 2.12 / 1.21 / 1.21, not 1.85 / 1.30 /
1.21. The LAW (`boardWidth / 300`) holds at every size to ±0.02px. The 16×16-phone tick is
1.207 CSS px, 3.6 device px at dpr 3, and the roster-only fallback stays stated.

## 4 · The r0 rows, re-run

- **π (unclaimed surfaces).** `probe/pi.spec.ts` copied and its `OUT` re-pointed to pass 2.
  Against pass 1's banked HEAD census: **every surface rect delta 0.00px** on both engines
  (board, card, logo, action bar, tally, first/last cell, roster), cellRects identical strings,
  `liveFilters` **9 = 9**, `glyphStroke` `rgb(10,10,10)` = same, tokens identical.
  One movement: `domNodes` 1234 → **1235**. It is pass 1's (pass 1's own proto census reads
  1235 too) and is carried, not caused, here — and it is still unattributed to an element.
- **r6 hue census** (`instruments/hue-census.mjs`, copied, argv-pointed at this tree, writes
  nothing): the five print with L/C/h — light L 0.440–0.441, dark L 0.649–0.650, against the
  solver's dark pastels at L 0.809–0.924. That gap is the design's whole claim, measured.
- **filterBudget 9** is confirmed on the solo board by the π census (PRM frozen, settled).
  T9's 24 is the dock-and-roster regime on a live page; what T9 proves is the **delta**: zero.

## 5 · Gaps, every one of them

1. **`.cell-because` and the invalid ring were never armed.** T4 banks the ghost's own bottom
   edge (88.53 cell-%) against the tick's top (84.97) and left (11.88), but with
   `invalid: false, because: false` — neither state was reached on the real surface, so the
   "clear of the rim" row is UNPROVEN. It wants a real hint press and a real duplicate.
2. **The ratio floor is pinned at 0.75 and the tin scores 0.80.** Five hundredths. If §6's
   leader moves `--color-user-ink` or a solver ink, this gate can go red on somebody else's
   change — which is what it is for, and it is also a coupling worth saying out loud.
3. **No golden run.** `goldens 4/4 against the built dist` was not executed: a build plus the
   golden battery did not fit the batch, and the tin moves `index.css`, so the goldens are the
   row most likely to need a re-mint. UNRUN, not green.
4. **r2 accent-kinship was not re-run.** The toll row over the five sticks (≥4.5) is
   unmeasured this pass; T1's AA (worst 5.178) is adjacent evidence, not that instrument.
5. **The wobble probe's ring σ** was not re-run.
6. **The un-widened negative control** for print/forced colours (a tick that reads the ink
   through the un-widened selector) was not built; T8 proves the widened pair works, not that
   the widening is what makes it work.
7. **The draw-in was not re-timed.** `DRAW_IN_PRESETS.tally` and the 90ms stagger are pass 1's
   measurement; this pass only moved the geometry under them.
8. **The relay arm is untested** — every rig is `?wire=local` (risk 5, carried).
9. **No real device.** The 16×16 phone tick at 1.21 CSS px is W8 §8.3's row.
10. **`domNodes` +1** (see §4) is inherited and unexplained.
11. **The clock stamp reads `source.snapshot()`** rather than a named accessor: it parses
    `{b:{values, origGiven, solved}}`, which is `useGameState`'s shape and not a declared part
    of `SessionSource`. It works and it is honest about what it is doing, but risk 3 stands —
    the seam wants one look before it lands.

## 6 · Crops (3 of the 4 allowed, ≤150 KB each)

- `frames/tick-corner-under-1-light.png` (3.7 KB) — amber `1` beside amber `1`, one tick in the
  lower-left corner, light, 1280.
- `frames/tick-16x16-phone-dark.png` (13 KB) — the 16×16 phone board, dark, two sticks and a
  tick at dpr 3.
- `frames/roster-sixteen-light.png` (44 KB) — sixteen at the table, five inks, eleven ticks,
  each against its word. The legend claim.
