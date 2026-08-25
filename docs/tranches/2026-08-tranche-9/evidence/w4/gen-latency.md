# The generation-latency gate — measurements, ceilings, and the P0 priced three ways

T9-W4 §"Gate spine", registry family **F14**. The lane: a new CI job (`gen-latency`,
lane 19) over `web/frontend/scripts/check-gen-latency.mjs`, which prices the SHIPPED
wasm artifact's five generate verbs and fails on a per-cell ceiling table kept in the
script with its derivation date.

Every figure below was measured on this tree, on one instrument; §7 has the commands.
Nothing here is copied from a rig README, and nothing here is a projection.

## 1 · The verdict

**10 of 10 cells under ceiling. `gen-latency` exits 0.**

It is green because the wave's cures landed, not because the ceilings were chosen to let
it be. The same harness read the same cell RED twice on the way here — §3 has both
readings, taken hours apart against artifacts built from the tree as it stood — and the
ceiling that would have failed it is still the ceiling in the file, unchanged.

The one number a reader should carry out of this document: **thermo 16×16 HARD went from
a 90.8-second worst deal to a 0.0 ms one**, on one machine, one harness, one seed set.

## 2 · The table, at the wave's head

Measured against `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` at **122,541 B** (crate +
wasm 0.7.0; the attempt-stop, the budget-exhaustion law and thermo's 16×16 bank all
landed), node 26.0.0, darwin/arm64 18 cores. N=3 at seeds `[1, 2, 3]`.

| cell | median | max | ceiling | headroom (ceiling ÷ max) | path | verdict |
|---|---:|---:|---:|---:|---|---|
| `sudoku/16x16/MEDIUM` | 0.0 ms | 0.5 ms | 50 ms | 100× | bank | ok |
| `sudoku/16x16/HARD` | 0.0 ms | 0.0 ms | 50 ms | — | bank | ok |
| `thermo/16x16/MEDIUM` | 0.0 ms | 0.2 ms | 50 ms | 250× | bank | ok |
| `thermo/16x16/HARD` | 0.0 ms | 0.0 ms | 50 ms | — | bank | ok |
| `killer/16x16/MEDIUM` | 138 ms | 167 ms | 1,200 ms | 7.2× | live dig | ok |
| `killer/16x16/HARD` | 261 ms | 454 ms | 2,100 ms | 4.6× | live dig | ok |
| `futoshiki/7x7/MEDIUM` | 0.9 ms | 1.4 ms | 50 ms | 36× | live dig | ok |
| `futoshiki/7x7/HARD` | 1.9 ms | 2.3 ms | 50 ms | 22× | live dig | ok |
| `kenken/6x6/MEDIUM` | 2.0 ms | 2.7 ms | 50 ms | 19× | live dig | ok |
| `kenken/6x6/HARD` | 1.6 ms | 2.0 ms | 50 ms | 25× | live dig | ok |

`killer/16x16/HARD` is now the estate's slowest deal, at a quarter of a second.

Given-counts dealt at these seeds: sudoku 16×16 MEDIUM 110 / HARD 95; thermo MEDIUM 110 /
HARD 83; killer MEDIUM 110 / HARD 93; futoshiki 7×7 22/15; kenken 6×6 3/3. The 16×16
MEDIUM≈HARD compression F14 opened is still visible (110 vs 95, 110 vs 83, 110 vs 93) and
stays W4 §4.3's business, not this gate's — but see §3's rider, because the attempt-stop
moved one of those numbers a long way.

### The four 50 ms floors are bank-presence alarms

Four cells deal from a bank and are graded against an absolute 50 ms floor rather than a
multiple of a sub-millisecond median. That floor is load-bearing in a second way nobody
has to remember to maintain: **both banks pick live-gen versus bank by DECLARATION**
(`tierSource`, `thermoTierSource`), so a tier quietly re-declared `livegen`, or a bank
deleted with its table left stale, returns that cell to its dig. §3 measures what the digs
cost — thermo 16×16 HARD would come back at a ~1.9 s median against a 50 ms ceiling and
red the lane by ~38× (widened from this file's first ~1.7 s/34× figure: MF's independent
instrument pass read 1,924.0 ms median / 15,097.9 ms max, 10.5% above the six-pass range
banked here — two instruments, the wider bound stands). The 16×16 banks are load-bearing
now, and this is the line that says so.

### Why futoshiki and kenken are not priced at 16×16

They cannot be dealt there. `games/shared/selectors.ts` offers sudoku/thermo/killer a
sub-grid band of {2,3,4} (4 ⇒ a 16×16 board), futoshiki a Latin band of {4..7} and
kenken {4..6}; the wasm contract agrees — `generateFutoshiki` throws `INVALID_INPUT`
outside `4..=7` and `generateKenKen` outside `3..=9`. A futoshiki 16×16 cell would not
measure a slow deal, it would measure a thrown error. Both families are priced at the TOP
OF THEIR OWN BAND, which is the same question the wave is asking: what does the largest
board this family can actually be dealt cost?

## 3 · The P0, priced three ways on one instrument

F14 and V2's pre figures (a 19.9 s median, a 473 s max) were read in a browser on another
host, and `class.rs`'s leash table is native. Neither is this gate's instrument, so the
whole ladder was re-derived here — including a wasm built from git HEAD `f48c43f1`, the
uncured tree, exported read-only to a scratch directory and built with the CI recipe.
Same cells, same seeds, same arithmetic, same box.

| stage | what was in the tree | thermo 16×16 HARD median | max | artifact |
|---|---|---:|---:|---:|
| **1. unleashed** | HEAD `f48c43f1` — no attempt-stop, no exhaustion law, no bank | **8,347 ms** | **90,849 ms** | 121,137 B |
| **2. leashed dig** | the crate's attempt-stop (`DEFAULT_REJECTION_LEASH = 8`) | 1,605–1,741 ms | 14,090–16,952 ms | 122,541 B |
| **3. banked** | §4.1.3's thermo 16×16 bank | **0.0 ms** | **0.0 ms** | 122,541 B |

Stage 2 is quoted as a range because it was measured six times over the session; every
pass agreed within 10% on the median, and the busting third deal read 14,090 / 14,174 /
14,967 / 15,867 / 15,939 / 16,952 ms. **The gate was RED at both readings.** The ceiling
that failed it was the same UI-honest 3,000 ms clamp the file's arithmetic still produces
for any cell whose honest margin runs past it. Stage 3 is what moved the cell under a
50 ms floor; nothing about the rule was relaxed to get there.

On this instrument the uncured tree produced **a single 90.8-second deal** — one seed, one
deal, a minute and a half of dead board — which corroborates F14's 473 s max in kind, on a
machine the wave can re-run.

### The whole estate, stage 1 against stage 3

| cell | unleashed median | unleashed max | now median | now max |
|---|---:|---:|---:|---:|
| `sudoku/16x16/MEDIUM` | 0.5 ms | 0.5 ms | 0.0 ms | 0.5 ms |
| `sudoku/16x16/HARD` | 0.5 ms | 0.5 ms | 0.0 ms | 0.0 ms |
| `thermo/16x16/MEDIUM` | 197.4 ms | 220.0 ms | 0.0 ms | 0.2 ms |
| **`thermo/16x16/HARD`** | **8,347 ms** | **90,849 ms** | **0.0 ms** | **0.0 ms** |
| `killer/16x16/MEDIUM` | 179.2 ms | 197.3 ms | 138 ms | 167 ms |
| `killer/16x16/HARD` | 857.4 ms | 861.6 ms | 261 ms | 454 ms |
| `futoshiki/7x7/MEDIUM` | 5.2 ms | 5.4 ms | 0.9 ms | 1.4 ms |
| `futoshiki/7x7/HARD` | 7.6 ms | 8.2 ms | 1.9 ms | 2.3 ms |
| `kenken/6x6/MEDIUM` | 7.2 ms | 7.2 ms | 2.0 ms | 2.7 ms |
| `kenken/6x6/HARD` | 6.7 ms | 7.4 ms | 1.6 ms | 2.0 ms |

Every cell improved. The skeleton hoist reads cleanly on the four families that used to
rebuild their CSP per attempt — 3.3–5.8× on the boards small enough for the rebuild to
dominate, 1.3× where the dig dominates instead.

### The attempt-stop's cost, measured (a rider for W4 §4.3, not for this gate)

A leash that truncates a dig makes puzzles EASIER, and the trade belongs in the same table
as the speedup that bought it. Given-counts at the same seeds:

| cell | unleashed givens | now |
|---|---:|---:|
| `thermo/16x16/HARD` | 79 | 83 |
| **`killer/16x16/HARD`** | **54** | **93** |
| `killer/16x16/MEDIUM` | 110 | 110 |
| `futoshiki/7x7/HARD` | 15 | 15 |
| `kenken/6x6/HARD` | 3 | 3 |

Killer 16×16 HARD is the row to read. F14's P2 credited it as the one family that
genuinely reaches the declared 52-given HARD target — 11 of 25 seeds, V2 — and at seed 1
the unleashed tree deals **54 givens**. The leashed tree deals **93**, against MEDIUM's
110. `class.rs` pins the leash at 8 with the claim that it "moves no ladder under 16×16",
which is true as written and leaves 16×16 unclaimed; this is what the unclaimed case
costs. It is a §4.3 tier-honesty question, not a latency one, and nothing here proposes a
different constant — but the HARD≈MEDIUM compression F14 opened got measurably worse for
killer in exchange for that family's 3.3×, and a wave that hid the trade would be doing
the thing this tranche is named for.

## 4 · The ceilings, and how they were derived

```
ceiling = clamp( max(FLOOR_MS, median × SEED_MARGIN × HOST_MARGIN), UI_CAP_MS )
          FLOOR_MS 50 · SEED_MARGIN 3 · HOST_MARGIN 2.5 · UI_CAP_MS 3,000
```

- **× 3, the seed/derivation margin.** The wave's own suggested figure, and measured
  rather than assumed: across cells the max/median ratio at these seeds runs 1.0–1.8,
  killer HARD the widest. Three clears the observed spread with room.
- **× 2.5, the host margin.** The table is derived on darwin/arm64 and enforced on
  `ubuntu-latest` (4 vCPU). This one is a guard, not a measurement, and it is named as
  such. Under it the tightest cell in the table still clears its worst observed deal by
  4.6×, so nothing here sits near its edge.
- **The 50 ms floor.** Three times zero is zero. Cells that deal in microseconds get an
  absolute floor instead of a multiplicative margin — which still catches a 100×
  regression on a bank path, and which is what turns those four rows into bank-presence
  alarms (§2).
- **The 3,000 ms UI cap.** A deal disables its family's controls for its whole duration;
  past about three seconds a dead DEAL control reads as broken rather than busy. A cell
  whose honest margin lands above the cap does not get the margin — it gets the cap, and
  it reds. **That clamp is what made this gate red on the leashed dig at stage 2**, when
  the honest arithmetic would have handed thermo 16×16 HARD a 12,188 ms ceiling and a
  green light. It is still in the file, unchanged, for the next cell that needs it.

**Derivation discipline.** Three `--derive` passes were taken THROUGH THE ENFORCING PATH
(the same walled child the gate grades, so derivation and enforcement never differ by
instrument), and the figure banked per cell is the **slowest** median of the three, not
the best. Loads at derivation are stated, because T8-R05 is in this wave's docket
precisely for pricing a bench box at load 10.75 on 8 cores while its README recorded no
row as suspect. A conservative median under a stated load is a derivation; a
best-of-three under an unstated one is the defect being repeated.

| cell | pass 1 | pass 2 | pass 3 | banked (slowest) | → ceiling |
|---|---:|---:|---:|---:|---:|
| `sudoku/16x16/MEDIUM` | 0.0 | 0.0 | 0.0 | 0.0 | 50 (floor) |
| `sudoku/16x16/HARD` | 0.0 | 0.0 | 0.0 | 0.0 | 50 (floor) |
| `thermo/16x16/MEDIUM` | 0.0 | 0.0 | 0.0 | 0.0 | 50 (floor) |
| `thermo/16x16/HARD` | 0.0 | 0.0 | 0.0 | 0.0 | 50 (floor) |
| `killer/16x16/MEDIUM` | 144.3 | 139.0 | 147.3 | 147.3 | 1,200 |
| `killer/16x16/HARD` | 267.3 | 274.4 | 268.5 | 274.4 | 2,100 |
| `futoshiki/7x7/MEDIUM` | 1.0 | 1.1 | 1.0 | 1.1 | 50 (floor) |
| `futoshiki/7x7/HARD` | 2.1 | 2.1 | 2.1 | 2.1 | 50 (floor) |
| `kenken/6x6/MEDIUM` | 2.1 | 2.1 | 2.2 | 2.2 | 50 (floor) |
| `kenken/6x6/HARD` | 1.6 | 1.7 | 1.7 | 1.7 | 50 (floor) |

Those three passes ran at a 1-minute load average of 11.6 on 18 cores. Three earlier
passes against the pre-bank tree, at load 7.6–9.9, are the stage-2 rows in §3; the two
live-dig cells that survive into this table (killer MEDIUM and HARD) moved 1.4% and 1.7%
between the two derivations, which is the honest size of this instrument's run-to-run
noise.

Re-deriving is a REVIEWED act, on the iai gate's precedent: `--derive` prints the table the
block would become and writes nothing. A real speedup should move these numbers in a
commit somebody read; a regression must never move them at all.

## 5 · Red-capability

Two proofs, because they answer different questions.

**a. Fixture arms, run before every graded pass (`--self-test`).** Off invented numbers
rather than off the tree — a self-test that measures is a self-test whose colour depends
on how loaded the runner is that morning. Five arms:

```
  ok   an under-ceiling cell greens — PASS (want PASS)
  ok   a planted 1 ms ceiling reds — FAIL (want FAIL)
  ok   median clears, max busts → reds — FAIL (want FAIL)
  ok   a cell that never dealt reds — MISSING (want MISSING)
  ok   every ceiling obeys the stated arithmetic (10 cells) — clean (want clean)
self-test ok — the comparison bites both colours.
```

Two of those arms earn their place by name. The third is the **max rule** — every deal is
graded, not just the median — and stage 2 of §3 is exactly the shape it exists for: a
1,605 ms median beside a 16,952 ms third deal, which a median-only rule would have printed
green. The fifth re-checks that every shipped ceiling still equals the arithmetic that
claims to produce it, which is what stops a ceiling from being quietly raised while its
derived median stays put.

**b. The whole table planted at 1 ms, against real deals.**

```
$ node scripts/check-gen-latency.mjs --plant-ceiling=1
!! every ceiling PLANTED at 1 ms — the red-capability lever, not the gate
…
6 of 10 cells BUST.
EXIT=1
```

Six and not ten: the four banked cells deal in **under 1 ms**, so they green even against a
1 ms ceiling. That is not a hole in the proof, it is the measurement — and it is the
cleanest statement available of what T8-R05 got wrong, since its 684 ms figure priced an
empty-bank path production never takes.

## 6 · The gate as it stands

```
GATE_EXIT=0   10/10 cells under ceiling.
PLANT_EXIT=1  6 of 10 cells BUST (ceilings planted at 1 ms).
```

## 7 · Commands

```bash
# the gate, as CI runs it
cd web/frontend && npm run test:gen-latency        # → self-test, then grade; exit = verdict

# the red-capability lever, by hand
node scripts/check-gen-latency.mjs --plant-ceiling=1

# re-derive the ceiling table (prints; writes nothing)
node scripts/check-gen-latency.mjs --derive

# the unleashed artifact of §3 stage 1 (read-only; nothing in the worktree is touched)
git archive HEAD | tar -x -C <scratch>
cd <scratch> && wasm-pack build csp-solver/wasm --scope mkbabb --target web \
    --profile wasm-release --no-default-features
```

## 8 · Scope, stated so it is not over-read

- **Engines.** V2 read the production bank path on node and chromium in ~3% agreement,
  which is what licenses a node-only lane to gate a browser product: for this workload
  the two engines are one instrument. **Safari is not covered and is not claimed.** Real
  JSC is unmeasurable in this estate by the owner's standing law (M19 — no screen
  seizure, no puppeting of the owner's desktop Safari), which is exactly why T8-R05's
  684 ms / 25 s Safari rows are restated as Safari rows rather than corrected. W8's
  owner-run device readings are the Safari truth.
- **What a deal costs is not what a page costs.** This gate times one `generate*` call.
  The worker seam's head-of-line blocking (V2's finding — one worker, synchronous verbs,
  so a long deal blocks every other game) is a separate exposure with a separate probe,
  and it is not this lane's.
- **The banks' bytes are not this lane's either.** §4.4's render-blocking question is
  answered by chunking, and thermo's bank ships behind an `import()` for that reason.
  Nothing here speaks to it.
- **A green gate is not a claim that generation is finished.** It is a claim that at these
  ten cells, these three seeds and this artifact, no deal exceeded its ceiling.

## 9 · Lane-count pins this job moved

Adding a seventeenth job moved two gates that count. Both were re-derived as the pinning
gate derives them, not edited to taste:

| pin | gate | was | now |
|---|---|---|---|
| `README.md:112` "runs sixteen lanes" | doc-truth `ci-lane-count` (counts `jobs:` keys) | sixteen | **seventeen** |
| `README.md:124` "the sixteen CI lanes" | prose, same fact | sixteen | **seventeen** |
| `web/frontend/README.md:53` "20 .mjs" | doc-truth `directory-count-claims` | 20 | **21** |

`ci-lane-count` reads GREEN at 17 jobs after the edit; `check-lane-membership.mjs` claims
the new script through `package.json scripts.test:gen-latency`. The
`directory-count-claims` row is still RED on a different figure — `csp-solver/tests`
24 → 25. **CORRECTION (MF battery, 2026-08-25):** that file is `generation_leash.rs`,
W4's own born-RED suite — the row is W4's to cure, not another lane's (cured at the
wave fold). "The doc-truth RED set is byte-identical to the pre-lane baseline" holds
only scoped to THIS lane's ci.yml edit; W4 as a whole moved four doc-truth rows RED,
all four cured at the fold.
