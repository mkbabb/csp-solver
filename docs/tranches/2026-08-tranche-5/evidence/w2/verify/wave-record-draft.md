# T5-W2 — THE WAVE RECORD (VERIFY's draft)

**Lane** Opus VERIFY, under the Fable team lead · **run** 2026-08-02 · **base** `e63af853`
(working tree carrying F1 · F2×4 · F3 · F4 · F5, uncommitted — the lead commits) ·
**charter of record** `../wave-open.md`.

VERIFY fixed nothing. Every number below was re-derived on this tree; none was inherited from a
lane record. Where a lane's figure and mine disagree, mine is the one stated and the disagreement
is named. Banks: `10-pi-final.txt` · `20-build.txt` · `30-vitest.txt` · `40-coverage-floor.txt` ·
`50-static-gates.txt` · `60-root-instruments.txt` · `70-e2e-throttle.txt` · `80-census-delta.txt` ·
`85-fences.txt` · `95-git-status.txt`.

---

## 1 · THE 2.1–2.8 ROW TABLE

| # | Move | State | Bank |
|---|---|---|---|
| **2.1** | 5 scenes → `GameShell`, 5 boards → `BoardHost`, cells → `DigitCell`, cages → `CageOverlay`; `gameRegistry`/`GameDefinition` die; TDZ severed | **LANDED.** registry.ts + its test gone; 0 per-game scenes/boards/`game.ts`; 1 cell, 1 cage, 1 shell pair; 0 import edges into the dead table. **Per-game files 65→32, target 22 MISSED by 10.** Slot reads 4→**31** (floor 25 cleared; charter's predicted 40 not reached) | `80-census-delta.txt` · `f1/` |
| **2.2** | one solver client + ONE worker + one protocol over one wasm binary; `?url` 5→1 | **LANDED, whole.** workers **1** · protocols **1** · clients **1** · `?url` sites **1** · dist wasm chunks **1** · per-game `solver/` dirs **0** · `*Wire.ts` **0** | `80-census-delta.txt` · `f3/` |
| **2.3** | the kill list; dead tokens/props/keys; test-only seams out of production; `filterBudget.ts` adjudicated | **LANDED.** Every kill row **0 hits**. `@theme` unreferenced **0 of 51** (both instrument arms), enumerated figure **17** killed — the charter predicted exactly that (§2.3a). `YOSHI_COLORS`→`MASCOT_COLORS`, CH-31 lands. `filterBudget.ts` = **DEFER-and-record**, verdict banked | `f4/50-kill-census.txt` · `f4/70-filterbudget-decision.md` |
| **2.4** | FAIL-EXPLICIT `TIER_SOURCE`; `catch{ignore}` → 0; the v0 ratchet dies; pencil-boil 0.11 | **LANDED, one clause unclaimed.** `catch{ignore}` **11→0** with `lint:catch` + its own negative control in CI. TIER_SOURCE throws in **three** directions (lost bank · stale declaration · unnamed bank). v0 ratchet dead, fails closed. `^0.11.0` adopted, quarantine deleted. **UNCLAIMED: the wider 2.4d clause** — thermo/killer/kenken `*UrlState.ts` remain empty-body no-ops, `boardLink` hard-coded `"absent"`; the permalink is NOT universal | `f5/` |
| **2.5** | boundary 20/20 by construction | **LANDED.** `lint:boundary` **23→0**, rule unchanged, not narrowed. The law became a generator imported by both configs; the vacuity canary survives in CI and throws on a one-family tree | `50-static-gates.txt` · `f4/` |
| **2.6** | CH-19 re-opened by its own trigger; the `@layer` extraction decided on the banked byte-identity method | **LANDED — decision is DROP.** Extraction emits a byte-identical stylesheet (`7454d057…`, same Vite content hash); index.css **shrank** 842→808 rather than crossing the threshold. Decided on the hold's own criterion | `f4/60-ch19-decision.md` |
| **2.7** | Rust edges | **LANDED.** `godModulesOver500Unwaived` **0** (only `search.rs` 534, waiver comment re-derived AT T5-W2 naming 534; `assignment.rs` 607→split, `cage.rs` 558→resolved). **futoshiki conforms** 5/5. `from_difficulty` **5/5**. `board_total` **1**, in its declared `errors.rs` home | `80-census-delta.txt` · `rust/` |
| **2.8** | lib shadows die | **PARTIAL — 1 of 3, and the other two refused on measurement.** `createGlyphDrawIn` **0** (swapped to `createStrokeDrawIn`, verbatim twin). `generateRectBoilFrames` **5** and `arcBoilPoints` **2** are **NOT twins** — swapping moves pixels on a load-bearing surface, which §3 forbids. The charter's `0·0·0` is not reachable under its own π law | `f5/` |

---

## 2 · THE GATE BATTERY

| Gate | Result |
|---|---|
| **π FINAL — the four goldens** | **4/4, three consecutive runs** on the built dist, one tree state, no rebuild between arms. `cell-light` · `grid-corner-light` · `logo-light` · `toggle-crest-dark`. **NO GOLDEN RE-BASELINED** — `git status e2e/goldens/` is empty, all 8 files intact |
| `npm run build` | **EXIT 0** |
| `vue-tsc -b` | **0 errors**, whole tree |
| `npx vitest run --silent` | **30 files · 349 executed · 0 failed** — floor 300 cleared, **no re-derivation triggered** |
| **coverage floor (W1.14)** | **RED — 8 breaches.** See §3. The only red in the battery |
| `lint:knip` | 0 |
| `lint` (prettier `src/`) | clean |
| `lint:eslint` (main config, boundary folded) | clean |
| **`lint:boundary`** | **0 errors** — `gates.W1.boundary.greensAt = "W2.5"` satisfied |
| `lint:ink` · `lint:catch` | pass · **0**, with negative control |
| `test:golden:bytes` · `test:prod-shake` · `test:font-coverage` | pass · pass · pass |
| `test:support-floor` · `test:e2e:projects` · `test:e2e:retries` | pass · pass · pass |
| `npm run test:e2e:throttle` | **39/39**, chromium **and** webkit, on its own built `dist-throttle` |
| `scripts/check-doc-truth.mjs` | **0 RED / 13 GREEN** — counts already restamped by the lanes; VERIFY re-ran, nothing to restamp |
| `scripts/check-evidence-policy.mjs` | **PASS** — 300 png / 29,952,740 B across 27 wave buckets, every image and wave within policy |
| `scripts/ledger-diff.mjs --require-ledger` | **GREEN** — 220 audited rows present-or-cited, **ORPHAN 0** |

**Not run by VERIFY, and why.** The **default e2e suite** was not in this lane's charge (the charge
named `test:e2e:throttle`). F5 ran it at **227 tests / 15 files**, green; VERIFY re-derived the
census (`--list` → 227 in 15 files) but not the run. Two hazards attach and are the lead's to know:
`:3000` on this host answers an unrelated `palette-api`, and the default config's `webServer` block
reuses an existing server there; and `gallery-deal.spec.ts:432` is dev-server-bound by its own
fixture, so the suite cannot simply be re-pointed at a dist.

---

## 3 · THE ONE RED — THE COVERAGE FLOOR

`node scripts/check-coverage-floor.mjs` → **EXIT 1, 8 breaches**:

```
src/games/sudoku.functions   25.00% < 35.24%   (-10.24)
src/games/shared.statements  50.09% < 53.14%   (-3.04)
src/games/shared.branches    44.87% < 45.57%   (-0.69)
src/games/shared.functions   43.47% < 47.74%   (-4.27)
src/games/shared.lines       49.79% < 53.32%   (-3.52)
src/pencil.statements        13.13% < 14.61%   (-1.47)
src/pencil.functions          9.49% < 10.02%   (-0.53)
src/pencil.lines             13.87% < 15.51%   (-1.63)
```

**No scope vanished** — `src/games` kept exactly 1 file, `registry.ts` dying and `cards.ts` taking
its place at the same prefix. So there is no scope to re-map, and the W1.14 minima method needs no
old→new mapping table. That is worth stating plainly, because the charge anticipated one.

**The breach is composition, not a loss of testing** — measured, not asserted:

| scope | covered | total | reading |
|---|---|---|---|
| `src/games/shared` | 1,174 → **1,277** (+103) | 2,209 → **2,549** (+340) | the collapse landed here — GameShell, BoardHost, the one client/worker/protocol, DigitCell, CageOverlay. Absolute coverage **rose**; the denominator rose faster |
| `src/games/sudoku` | 44 → 9 functions (−35) | 122 → 36 (−86) | the scope shed 9 of 14 files; what died (technique, protocol, useSolver, the cell) was well covered, the residue is not |
| `src/pencil` | 292 → 244 (−48) | 1,964 → 1,857 (−107) | 2.8 + the 0.11 adoption deleted `createGlyphDrawIn` (a copy that carried its own unit) and rasterPose's encode half. 44.9% of the deleted statements were covered against a scope mean of 14.87% |

**TOTAL is not breached and rose: 35.12% → 37.92% statements.**

The gate's own words are the constraint: *"W2's collapse must clear it, not re-cut it."* VERIFY
fixes nothing structural, so this is reported and not cured. **LEAD'S ROW**, two honest routes:
**(a)** cover the collapsed shared spine until the four `src/games/shared` rows and
`sudoku.functions` clear; or **(b)** re-derive the floor against the distilled estate by W1.14's
own **pre-registered** method — MINIMUM over an n=10 sample, never a mean, never one run — and bank
the new sample beside the old. Route (b) is defensible only because the estate's shape genuinely
changed, and either way the choice must be recorded with its cause.

---

## 4 · THE CENSUS DELTA — gates.json W2, row by row

| gates.json row | Target | Measured | State |
|---|---|---|---|
| `piIdentity.goldens` | 4 | 4/4 ×3 runs, no re-baseline | **GREEN** |
| `censusDelta.killRowsZeroHits` | true | every kill row **0** | **GREEN** |
| `censusDelta.locRemovedTarget` | 4,150 | **−4,806** absorbed-class · **−2,945** whole-tree net | **SPLIT — see below** |
| `censusDelta.perGameFilesTarget` | 22 | **32** (65→32, −50.8%) | **MISS by 10** |
| `registryFiction.gameRegistryDeleted` | true | file gone, code rows 0 | **GREEN** |
| `registryFiction.gameSpecSoleConsumer` | `GameShell` | one shell, five rows | **GREEN** |
| `registryFiction.productionSlotReads` | 25 (floor) | **31** | **GREEN a fortiori** (charter's predicted 40 not reached) |
| `registryFiction.tdzEdgeSevered` | true | 0 import edges; the workaround died with its cause | **GREEN, instrument absent** |
| `solverSpine.workers` | 1 | **1** | **GREEN** |
| `solverSpine.protocols` | 1 | **1** | **GREEN** |
| `solverSpine.urlContractSites` | 1 | **1** source, **1** dist chunk | **GREEN** |
| `failExplicit.tierSourceBuildFail` | true | throws in 3 directions | **GREEN** |
| `failExplicit.catchIgnoreCount` | 0 | **0**, both commands agreeing | **GREEN** |
| `failExplicit.negativeControl` | true | `lint:catch` self-tested; stop-contract proof 26 assertions | **GREEN** |
| `rustEdges.godModulesOver500Unwaived` | 0 | **0** | **GREEN** |
| `rustEdges.futoshikiConforms` | true | both signatures conform | **GREEN** |
| `rustEdges.wasmVerbBoundaryTests` | 15 | not re-derived by VERIFY — `rust/` bank | **CITED, not re-measured** |
| `rustEdges.testCountRestamped` | true | doc-truth 0 RED / 13 GREEN | **GREEN** |
| *carried in:* coverage floor ≥ baseline | — | 8 breaches | **RED** |
| *carried in:* unit ≥ 300 executed | 300 | **349** | **GREEN** |
| *carried in:* knip 0 · doc-truth · boundary · `vue-tsc -b` | — | 0 · green · 0 · 0 | **GREEN** |

### The LOC row, with its denominator named (the charter forbids an unnamed one)

Method: raw `wc -l`, non-test, `README.md` excluded. BEFORE = `git show e63af853:<path>`;
AFTER = worktree. **The BEFORE column reproduces the charter's §5 figures exactly (16,661 whole ·
7,744 five dirs)** — which is the check that the method is the charter's and not a new one.

| scope | before | after | delta |
|---|---|---|---|
| `games/**` non-test, WHOLE | 16,661 | 13,716 | **−2,945** |
| the FIVE game dirs | 7,744 | 2,938 | **−4,806** |
| `games/shared` | 8,617 | 10,580 | **+1,963** |
| `games/` top level | 300 | 198 | −102 |

- **On the absorbed class** (the five per-game dirs — what ALPHA's ≈4,150 was priced against):
  **−4,806. TARGET HIT, by 656.**
- **On the whole games tree, net** (`games/**` non-test): **−2,945. TARGET MISSED, by 1,205.**

The two differ by the **+1,963** the shared floor gained. The code did not vanish; it stopped being
written five times. The honest headline is the pair, never one of them alone.

---

## 5 · DEVIATIONS, EVERY ONE ANY LANE LOGGED — plus VERIFY's own

**Probe defects VERIFY found (new, not lane-logged).**

1. **The 2.1a probe cannot ever return 0.** Its filter `grep -vc "^\s*\*\|//"` is applied to
   `grep -rn` output, which prefixes every line with `path:lineno:`. The `^\s*\*` alternative
   therefore anchors against the PATH and matches nothing, ever; only the unanchored `//` fires, so
   block-comment `*` lines always survive. Portable form —
   `grep -vcE "^[^:]+:[0-9]+:[[:space:]]*(\*|//|/\*)"` — returns **0**. The single raw hit is
   `cards.ts:4`, past-tense prose naming the table it replaced.
2. **2.1c's `grep -rln` form has no comment filter at all**, so it reads 1 on a prose line
   (`thermo/spec.ts:18`). Actual import edges: `grep -rn 'from "@games/registry"'` → **0**.
3. **2.1d's glob `src/games/*/` includes `src/games/shared/`**, so it counts the two shared-floor
   boards. Per-game scenes/boards, the actual green condition: **0**.

**Instruments the charter names that do not exist.** `scripts/tdz-probe.mjs` was never written, and
`madge` is still not installed — the charter flagged both at §6.5 as *"a gap, not a green."* They
are still a gap. `tdzEdgeSevered` is carried on a module-graph grep plus the structural fact that
`SudokuGame.vue`'s hand-inlined cycle-dodge is deleted with its cause. That is good evidence and it
is not the declared instrument.

**Lane-logged deviations, carried forward verbatim in substance.**

| # | Lane | Deviation |
|---|---|---|
| 1 | F1 | `spec.solver` amended to `{ nodeBudget, prewarm }` with a named cause, its death scheduled at 2.2 — **collected by F3.** Interim state, cleared |
| 2 | F1 | `GameCard` carried a two-arm `load\|scene` union as a declared interim — **cleared by F4** to one arm |
| 3 | F2-thermo | The barrier (`App.vue`'s `loader: card.scene!` resolving `undefined` for four lazy rows; `GameShell` binding no `:clue`) — **discharged by F3**, including its `ClueSeam.from` amendment |
| 4 | F3 | `futoshiki/game.ts` + the last `gameRegistry` row died early — F3's consequence, not a raid on F4 |
| 5 | F3 | **Bundle row missed by 0.37 kB (+0.17%)**: worker chunks 5→1 as charged, but the main chunk grew because it now carries the client serving five games. Total dist JS **−76.35 kB**. Lane declined to hold the row by keeping the eager game off the shared client |
| 6 | F3 | **2.2d NOT landed** — the wire guard. `killer/clue.ts` and `kenken/clue.ts` `break` on a truncated group; `thermo/clue.ts` guards nothing. **0/3 throw.** Born-RED state re-derived, cure unclaimed |
| 7 | F3 | `spec.solver.nodeBudget` has **zero** production reads off the spec |
| 8 | F4 | `perGameFilesTarget` 22 vs **32** enumerated; the residue named (five `*UrlState.ts`, four clue-typed `types.ts`), both homed in 2.4. Lane declined to raid 2.4 |
| 9 | F4 | Token census landed at **17**, not the audit's 15 — the charter predicted exactly this. Stamp 17 as the enumerated figure |
| 10 | F4 | `--ink-press-firm`'s death re-priced `check-ink-pressure`'s hard-coded ladder, same act |
| 11 | F4 | **CH-19's banked proof was not on disk** — the T3 appendix's claim that it "lives in the evidence dir" is false. Method survived as prose; F4 re-derived and banked a runnable recipe. Either the LEDGER's CH-19 row restamps, or the T3 §4 claim is corrected |
| 12 | F4 | The boundary CI lane **survives rather than retiring** (it carries the vacuity canary, which `eslint .` has nowhere to put). One `ci.yml` edit, as licensed |
| 13 | F4 | Ten prose mentions of `gameRegistry`/`GameDefinition` survive, listed by file:line, every one past tense. **Two inside `GameGallery.vue` (`:67`, `:297`) left untouched — fenced. W4's rows** |
| 14 | F4 | `persistKey` still spelled twice for the four lazy rows, guarded by `cards.test.ts` asserting they agree — the measured chunking trade |
| 15 | F5 | **2.8's twin claim: 1 swapped, 2 refused on measurement.** Restamp or re-lane |
| 16 | F5 | `no-empty-catch` scope **decided strictly** — all of `src` including `dev/**`. Narrowing costs one row |
| 17 | F5 | The fence: `GameGallery.vue` moved 6 lines — the 2.4b unwrap the charter's own roster names |
| 18 | F5 | **Linux CI is the de-quarantine's judge.** 39 rows green on darwin in both engines proves nothing broke *here*; the parked class was ubuntu+WebKit-only and nondeterministic |
| 19 | F5 | `gallery-deal.spec.ts:432` is dev-server-bound by its own fixture |
| 20 | F5 | **The permalink universalisation is NOT in this lane** — three `*UrlState.ts` remain empty-body no-ops, `boardLink` hard-coded `"absent"`. The owner-ratification row (§1.4.1) is **unclaimed** |

**Charter obligations VERIFY finds unclaimed.**

- **The AX baseline (§3).** The charter requires W2 to capture the **AX-tree PRE-state at open as
  its own regression baseline** and assert it unchanged at exit. **No lane banked one**, and none
  asserted it at exit. The obligation is open; it cannot be reconstructed after the fact from this
  tree, because the PRE-state is gone.
- **2.1b's spec-consumption unit ×5.** Only three exist — `thermo/spec.test.ts`,
  `killer/spec.test.ts`, `kenken/spec.test.ts`. **sudoku and futoshiki have none.**
- **2.2d** (wire guard 3/3 throw) — 0/3, per F3.
- **2.4d's wider clause** (a current-version body round-tripping for all five) — per F5.

---

## 6 · THE UNION'S CLOSURE CLAIM DOES NOT HOLD WHOLE

The charter's §1.3 law: *"A slot the shell doesn't read is deleted from the type."* Measured against
it, two of the eight slots fail:

- **`solver` — 0 production reads off the spec.** Every spec declares
  `solver: { nodeBudget: nodeBudgetForSize }`; every model imports `nodeBudgetForSize` from its own
  composable. `GameShell.vue:80` says so in its own prose: *"imported here rather than asked of
  `spec.solver`."* F3 removed the slot's one live reader (`prewarm`) by its own schedule and stated
  the consequence rather than inventing a reader.
- **`urlCodec` — 1 of 5.** Only sudoku's card row sources `persistKey` from the spec
  (`cards.ts:103`); the other four spell the literal, guarded by `cards.test.ts`.

The gate **passes on its floor** (31 ≥ 25) and the union's *closure* claim does not hold whole.
Both facts belong in the record. **LEAD'S ROW.**

---

## 7 · THE FENCES

`GameControlPanel.vue` **0 lines** · `GameScene.vue` **0 lines** — held, not even an import.

`GameGallery.vue` **6 lines** (1 insertion, 5 deletions), one hunk: the 2.4b
`try { h.stop() } catch { /* ignore */ }` unwrap at the exact site the charter's §2 2.4b roster
enumerates (*"GameGallery.vue:181"*), commanded by `failExplicit.catchIgnoreCount = 0`.

**The charter contradicts itself here, and the contradiction is the record.** §4's enforcement
clause says 0 changed lines except imports; §2's 2.4b row names a line inside a fenced file and
gates its deletion at 0. Both cannot hold. What can be said without interpretation: the fence's
stated prohibition — *"does not restyle, recompose, or re-animate"* — is intact; **no pixel moved**
(π 4/4 ×3 on this tree); and leaving the site reds a gates.json row. **LEAD'S ROW:** ratify the 6
lines as charter-commanded, or amend §4 to except the 2.4b roster by name.

---

## 8 · THE LEAD'S OPEN ROWS, COLLECTED

Carried from the charter §6, plus what the lanes and VERIFY added. Listed once.

1. **The coverage floor is RED** (§3) — cover the spine, or re-derive by W1.14's n=10 minima
   method. The wave cannot seal on a red exit condition without a recorded decision.
2. **The AX baseline was never captured** (§5) — an unclaimed charter obligation that cannot be
   reconstructed from this tree.
3. **`productionSlotReads`** — restamp to the measured **31**, or hold 25 as the floor and record
   31. The charter's predicted 40 is not reachable while `solver` and `urlCodec` go unread (§6).
4. **The permalink break — owner ratification.** Still the single disclosed behaviour change, and
   still **unclaimed**: the v0 ratchet died (F5) but the universalisation did not.
5. **`no-empty-catch` scope** — F5 decided strictly (all of `src`, `dev/**` included). Ratify or
   narrow; narrowing costs one row.
6. **`filterBudget.ts`** — DEFER-and-record, verdict banked at `f4/70-filterbudget-decision.md`.
7. **`madge` / `tdz-probe.mjs` are still absent.** A missing instrument is not a passing gate.
8. **2.8's twin claim** — restamp to 1-of-3, or re-lane the two non-twins to a pixel-licensed lane.
9. **`perGameFilesTarget` 22 vs 32** — restamp or schedule the two folds (both 2.4's).
10. **`locRemovedTarget`** — stamp which denominator the −4,150 claim rides (§4).
11. **2.2d** (wire guard 0/3) and **2.1b's** two missing spec-consumption units.
12. **CH-19's LEDGER row** — restamp to `f4/60-ch19-decision.md`, or correct the T3 §4 claim.
13. **Linux CI is the de-quarantine's judge** — the push is the lead's, and so is any re-pin.
14. **Two `gameRegistry` prose mentions inside `GameGallery.vue`** (`:67`, `:297`) — W4's rows.

---

## 9 · GIT STATUS AT THE FOOT

Base `e63af853` — *"T5-W2 runner-figure restamp: 122,861 B at f2ae188d from run 30722381389's own
measurement."* **Tree UNCOMMITTED; the lead commits (LAW: no `git commit`/`push` in a lane).**

```
166 paths:  62 modified · 58 deleted · 43 added/untracked · 3 renamed
```

Full listing: `95-git-status.txt`.

Dev servers: the owner's `:3000` (an unrelated `palette-api`), `:3001` and `:4288` were never
touched. VERIFY's own `:4188` preview was started for π and **killed at close**.

ROW-COMPLETE

---

## 10 · THE SEAL (2026-08-02, the lead's own hand)

Everything after ROW-COMPLETE is the lead's: two oracle-cure commits, a finisher fleet, and the
fourteen adjudications — each answered once at `../seal-adjudications.md`, none left `MEASURE-AT-SEAL`.

**The cures** (`ff5a7cea`): difficulty-parity's scan list follows the estate (SIBLING_DEFINITIONS
6→5, ablation-proven both guards); the reject-strip contract made real in `resolveInitialState`,
born-RED first. The pinned run 30728779986 confirmed both — rust green, permalink green.

**The same run refuted a declaration.** Its four reds were all the ubuntu-WebKit bake class: the
0.11 `rasterizePoseToBlob` cure, declared on the judging run's single green, did not hold.
Second pinning executed per the ruling's own else-branch: class quarantine restored (spread
detectors live), re-entry re-aimed at ≥0.12.0 or W4b's rig verdict, **CH-62** born in the LEDGER,
row 13 of the adjudications corrected without euphemism. The law the incident bought: never
declare a nondeterministic class cured on a single green. Evidence:
`bake-race-recurrence-30728779986.txt`.

**The finisher** (workflow `wf_4f920366-c09`, two Opus lanes, evidence at `../finisher/`):

- **Codec universalisation LANDED** (charter §1.1/§5.3's own verdict; ballot 7 dispatched with
  default landed-per-the-design): one shared codec driven by `spec.clues`' pair, five
  `*UrlState.ts` dead (−1,696 raw LOC), thermo/killer/kenken permalinks REAL, reject-strip
  holding for all five — permalink e2e 20/20, both engines, born-RED first.
- **2.2d wire guards 0/3 → 3/3** (`demandGroup`, one shared refusal) plus a fourth arm the lane
  found: kenken's `?? "+"` operator fallback silently rewrote division cages into addition — now
  throws.
- **2.1b spec tests** land for sudoku + futoshiki: 5/5 games carry them, assertion classes
  mirrored verbatim.
- **`nodeBudget` WIRED** onto the one solver client (three distinct value tables measured — the
  kill arm was never available); the worker honours the frame's cap; stated plainly by the lane
  and confirmed at seal: this is naming, not a spec-member production read (§6's closure caveat
  stands recorded).
- **Row-6 sentinel** asserts given-ness, not digit identity (the old form flaked 1 board in 9).
- **`tdz-probe.mjs`** born with both arms, ablation-proven RED in a scratch copy, wired to
  `npm run lint:tdz`; madge folds into it (adjudication 7).
- **The AX obligation DISCHARGED by the charter's own instrument executed late** — lane B rebuilt
  the true PRE from `git archive f087a90d`: zero invariant deltas across 215 comparisons,
  injection ablation 3/3, stability-pass-licensed. The miss itself stands as charged and its
  cure is structural: gates.json W3 now carries `axBaseline` with a named-lane law.

**The seal's own measurements** (numbers re-derived at citation): perGameFiles **27** (counted
4+7+6+5+5 by the lead, then the lane's figure agreed); productionSlotReads **31** (no new
spec-member reads — persistence wires composable-side, as 2.1 demands); units **392**; coverage
floor re-derived route (b) by the instrument's pre-registered min-over-n=10 (sample banked at
`../coverage-samples-post-distill/`, 8 figures lowered with cause in `loweredAt`, the rest
ratcheted UP) — gate GREEN, self-test 6/6.

**Local battery at the seal tree**: π 4/4 against built dist · built-dist gates 39/39 (darwin
full strength through the re-pinned quarantine) · lint/prettier clean · knip silent ·
empty-catch 0 · tdz-probe green with its negative control · doc-truth 13/13 · ledger-diff
220/220 exit 0 (CH-19 terminal, CH-62 open).

Two traps recorded, first bite each, record-only: `sampleMinima` silently no-ops on wrong-format
sample files; the golden config's `:3000` fallback walks into the foreign palette-api when no
`PLAYWRIGHT_BASE_URL` is set (the assert-the-SPA guard caught it — that guard is why the trap
cost nothing).

The seal commit carries: both quarantine re-pin specs + module, the finisher's whole surface,
`gates.json` (four stamps), `coverage-floor.json`, LEDGER (CH-19 terminal, CH-62 born), ballot 7,
the adjudications, and this section. Expected CI: **18/18** with the bake class parked. The wave
closes when the pinned run says so in its own tool result — not before.
