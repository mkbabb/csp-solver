# Pass 10 · ACC-GRAPHITE · the adversarial critic (§3)

Critic lane `crit-ACC-GRAPHITE`, 2026-11-02 20:52–. Not the author. Ports 4235 (the critic's own WAVE rig) / 4254 (the HEAD control, pre-built `index-CubiZsMVSwTc.js`). Durable scratch only (the lane's pass-10 directory under the repo's t9-scratch; never /tmp). No git on MAIN or the control tree; every git call below ran in a scratch archive with its own `git init`, or read-only (`cat-file`, `ls-tree`, `diff`, a private `GIT_INDEX_FILE`) in the lane's work tree.

## 1 · The bank, re-derived (replay route and apply-checks)

Shas of the banked files (shasum, on disk): `pass10.diff` aded94f9 ✓, `pass10.delta.on-WAVE.diff` 5b12eec0 ✓, `homes.diff` 07257854 ✓, `homes.on-WAVE.diff` 0723d508 ✓, `pass9/integrate/WAVE.diff` b3725e4f ✓, `pass9.diff` 457a7984 ✓.

The work tree `wf_f72f3b5a-83a-40` (HEAD 74a2b5d9), cut through a private temporary index (`read-tree HEAD; add -A; write-tree`): **7674feb8** = the bank's lane tree. ✓

Three fresh archives, each `git init`-ed, every apply line printing its resolved gitdir (all three under the critic's scratch, never MAIN's) and its path count:

| archive | step | gitdir | paths | rc |
|---|---|---|---|---|
| chk74 (74a2b5d9) | `--check pass10.diff` on bare 74a2b5d9 | chk74/.git | 24 | **0** |
| | apply homes.diff → (= ac862f1e by blob list) | chk74/.git | 13 | 0 |
| | `--check pass10.diff` on ac862f1e (declared base) | chk74/.git | 24 | **0** |
| | apply → blob list = **7674feb8** exactly (bar the `docs/precepts` gitlink, which `git archive` drops) | | | 0 |
| chkW (954bbbab) | blob list = **954bbbab** exactly (bar the gitlink) | | | |
| | `--check pass10.diff` on 954bbbab | chkW/.git | 24 | **1** (gridPaths.ts:12; the 74a2b5d9 arm collides, as declared) |
| | `--check pass10.delta.on-WAVE.diff` on bare 954bbbab | chkW/.git | 6 | **0** |
| wave (74a2b5d9) | apply `pass9/integrate/WAVE.diff` → blob list = **954bbbab** (independent reproduction of the union) | wave/.git | 187 | 0 |
| | apply homes.on-WAVE.diff → blob list = **8c46d9de** | wave/.git | 10 | 0 |
| | `--check` delta on 8c46d9de (declared base) | wave/.git | 6 | **0** |
| | apply delta → differs from 8c46d9de in exactly the 6 declared lane paths | wave/.git | 6 | 0 |

The tree ids my archives write differ from the bank's (243fbf57 vs 74a2b5d9^{tree} 5fd59288) only by the `docs/precepts` gitlink `git archive` omits; content was compared by blob list (`ls-tree -r` vs `ls-files -s`), path by path. `2e5a1b73` is not in MAIN's store (it lives in the author's chkW repo), so it is matched by the 6-path difference, not by id. **No residual home edit rides either delta**: the on-WAVE delta's six paths are lane paths; `pass10.diff`'s 24 paths carry no `e2e/lib/*` and no `scripts/shape-census*` (homes v3 is the 13-path step, applied by sha). Contaminant grep and dot-path grep: not re-run by the critic (the author's 0/0 stands as theirs).

The pass-10 advance over pass 9 (`git diff df9999af 7674feb8 -- web/frontend/src`): five product files — gameCell.css (small tier 12 → 13; the stale 'half strokes' comment), boardRaster.ts (comment only), GameBoard.vue (`useDevicePixelRatio`, `BOARD_VIEWBOX_SIZE`/`BOARD_GHOST_SEED`), useGameCell.ts (the two constants), gridPaths.ts (the two exports). The product change that moves pixels is ONE literal.

## 2 · What the critic found by reading (browserless, before any number)

- **H1 · the hygiene row is NOT cured on the union (the author's "both trees" is false for the WAVE).** On `954bbbab` + homes v3 + `pass10.delta.on-WAVE.diff` (the critic's own apply), `gameCell.css` still carries (a) `:312–314` "the passes (12 and 15 units, 8 apart) … the top and bottom are half strokes cut by the grid's bakes" — the exact stale sentence charter row 8 names, cured only on the 74a2b5d9 tree; and (b) `:359–365`, an orphaned comment block (its rule moved below the arm at pass 9) that still says "**12 holds it at 1.371–1.392x … So the small raster takes 12**", now contradicting the shipped `stroke-width: 13` 130 lines below it. The delta's gameCell.css hunks touch only `:477` (the arm's own comment) and `:493` (12 → 13). The union is where the section integrates; its comments now carry two contradictory statements of the same literal. Row 8 → PARTIAL (cured on 74a2b5d9, open on the WAVE).
- **H2 · the cure is a fitted literal with no product guard.** `13` is read only by the docs-resident `bandc.crit.ts` (f256121a). No product spec, no unit row and no lint pins it: `boardRaster.test.ts` pins the predicate (`SMALL_RASTER_DPX` 375, literal ±0.01 both DPRs) and nothing pins the unit count. A revert 13 → 12 passes every product gate on the union (charter R2 still OPEN — the author says so). The literal is also unnamed: it lives as a bare `stroke-width: 13` in CSS, while its sibling knob `SMALL_RASTER_DPX` is a named TS constant with a ballot caption. Pick 17's caption carries both (author's README §Ballot), which meets the pick's letter.
- **H3 · the threshold battery is not a battery by the law.** The author's "threshold battery" is computed on the chromium reads (re-bounding the window to [1.378, 1.45] etc.) — no plant, no literal pin, chromium only. LAWS P9 §F: "a ±ε plant is a literal pin, never derived". The window [1.35, 1.45] is G2_WINDOW in `band-stat.mjs`, unchanged since pass 6; no new gate was born this pass, so no new clause/threshold/disjunct battery is owed for G2 itself — but the author's row-1 claim leans on ε-margins it did not plant. The critic plants instead (§3).
- **H4 · `useDevicePixelRatio` is unwitnessed.** The reactive DPR is asserted in a comment; no unit row re-keys `data-raster` on a DPR change (a 1x → 2x move). A lane-chosen dependency (`@vueuse/core`) with no consumer test; low severity, OPEN.
- **H5 · the 74a2b5d9 arm shrinks the filter census (9 → 8) and the union area downward** (sparkle drop-shadow retired) — never grows: filterBudget law holds on the arm's source. Not read in paint this pass by anyone (R4 OPEN).
- **H6 · crit.partial30** (`src/pencil/grid/gridPaths.partial30.test.ts`) is a faithful copy of FIVE's critic's row: five partial-start rows + a second-front row + the whole-frame negative (`done === 10`, `stepMs === 17`). It meets pick 6's letter (shipped as GRAPHITE's own unit row) on the on-WAVE delta only; on the 74a2b5d9 tree there is no `frontTween` to read, so no row — declared. It is RED by design (FIVE's row 1) and makes the union's unit suite red; that is pick 6's intent, not GRAPHITE's red.

## 3 · Browserless rows, re-derived on the critic's own trees (bare exits, `guarded --light`)

Trees: **bare954** = the chkW archive (blob-equal to `954bbbab`); **W+homes** = the same + `homes.on-WAVE.diff` (blob-equal to `8c46d9de`); **tree** = the critic's wave archive (74a2b5d9 + WAVE.diff + homes v3 + the on-WAVE delta) + the one-line `RING_ARM = "graphite"` flip (`od -c` verified: `= "graphite";`).

| row | bare954 | W+homes | tree | reading |
|---|---|---|---|---|
| `lint:bands` | 1 (B2, B6, B11; **B13 ✓**) | 1 (B2, B6, B11, **B13 ✗ 2**: `MarginNote.vue:314`, `gridPaths.ts:737`) | 1 (the same four; B13 2 at `:314`, `:742`) | **REPRODUCED: B13 is homes-v3-born, not the lane's**; the delta adds no bands finding (gridPaths `:737 → :742` is the 5-line constant insert). B6 reds on every archive because 74a2b5d9 is not in a fresh `git init` (the clone law, P8 §F) — so `lint:bands`' sabotage in a CLONE (charter R7) remains unrun by the critic too |
| `lint:copy` (M16) | 0 | 0 | 0 | M16 holds |
| `lint:sleep` | 1 | 1 | 1 | union-born (SIX/LEDGER, CHAIR §21), equal on all three |
| vitest `boardRaster.test.ts` | — | — | 4/4 | the predicate only (H2) |
| vitest `gridPaths.partial30.test.ts` | — | — | **6 failed / 1 passed** (exit 1) | REPRODUCED: the five partial-start rows and the second-front row red, the whole-frame negative GREEN — FIVE's row 1, pick 6's letter met |
| dist identity of the row-1 tree | — | — | critic's own build (`guarded vite build`, `VITE_BASE_URL=/`, private cacheDir, the archive's own `.git` marker): **`index-B-HJEDCezeHq.js`, served CSS 115,719 B** | REPRODUCED: the author's "the banked source rebuilds as `index-B-HJEDCezeHq.js`" (their read build `index-BkzF3wJejISl.js` differs only by the pre-prettier scope id, their incident 6). The critic's row 1 therefore reads the BANKED bytes, not the author's pre-format build |

## 4 · Row 1 (CHAIR pick 1), re-derived by the critic: six rigs, on the pass-9 WAVE `954bbbab`

Tree: the critic's own archive (74a2b5d9 + `pass9/integrate/WAVE.diff` → blob-equal `954bbbab`; + `homes.on-WAVE.diff` → `8c46d9de`; + `pass10.delta.on-WAVE.diff`; + the `RING_ARM = "graphite"` reader flip, never banked), built `index-B-HJEDCezeHq.js` CSS 115,719 B, served by `guarded vite preview` on **4235**. Control: `.claude/worktrees/w7-control` pre-built `index-CubiZsMVSwTc.js` on **4254** (identity asserted per arm in every JSON). Instrument: `bandc.crit.ts` **f256121a** + `band-stat.mjs` **d2e2d620** + `band-lib.ts` (48fe6062 with its one import re-pointed, = 424b3e98), copied from the docs-resident pass-6/7 instruments into the critic's scratch rig, `GATE=1 STAT=tb`, DPR 1, light, PRM reduce, `--workers=1`. Exits read bare from the file `band.sh` writes. The tree's server queued 20:54 → 21:06:24 for a heavy slot (first in the machine queue; not a stall).

### Chromium — `guarded` run 21:06:28 → 21:07:45, load 21.79 → 14.06, zone inuse 440,969 → 461,549 (< 8M), **exit 0**, 6 passed

| rig (board dpx) | tree ratio (band top/bottom · frame t/b) | control |
|---|---|---|
| desk 1280×800 (636) | **1.377** (10.224/10.437 · 7.427) | 0.545 RED |
| phone 393×699 coarse (365, small) | **1.427** (5.996/5.831 · 4.087) | 0.521 RED |
| tablet 768×1024 coarse (668) | **1.386** (10.770/10.975 · 7.771) | 0.528 RED |
| tabletL 1024×768 coarse (604) | **1.430** (14.753/9.970 · 6.971) | 0.580 RED |
| deskcoarse 1280×800 coarse (636) | **1.377** | 0.545 RED |
| phone812 812×375 coarse (347, small) | **1.402** (5.564/5.527 · 3.941) | 0.076 RED |

Every number equals the author's to the thousandth, on the BANKED bytes (their read build was the pre-format `BkzF3wJejISl`). tabletL's top side is fused (14.753 vs 9.970, SIDES≠) — the min statistic takes the bottom; declared, as at passes 8–9.

### The critic's plants on row 1 (chromium, same rig, same servers, `EXTRA_CSS` on the TREE arm only)

| plant | what it models | phone (365) | phone812 (347) | exit |
|---|---|---|---|---|
| **P12** `[data-raster="small"] … .cell-ghost-retrace{stroke-width:12 !important}` (21:07:46 → 21:08:11, load 14.06 → 15.13, inuse 461,549 → 474,106) | the revert of the pass-10 cure (floor side) | 1.392 inside | **1.349 RED** (5.317/5.471) | **1** |
| **P15** the same at 15 (21:08:11 → 21:08:38, load 15.13 → 14.92, inuse 474,106) | the small-tier predicate lost (disjunct: every board on the large tier) | **1.498 RED** | **1.470 RED** | **1** |

P12 reproduces the WAVE9-read 1.349 / 1.392 to the thousandth, so the pass-10 move 1.349 → 1.402 is the literal and nothing else. P15 reproduces pass 9's 1.47–1.50 at 365. The pair brackets the cure on ONE payload and one variable: at 347 dpx, 12 → 1.349 (floor −0.001), 13 → 1.402, 15 → 1.470 (ceiling +0.020). **The born-RED for row 1 is demonstrated on THIS tree, with the HEAD control RED in the same runs.** What the plants also show: the window at 347 dpx admits roughly one integer (13; 14 is unread), so the cure has 0.052 floor-side and 0.048 ceiling-side margin in chromium and is a fitted point, not a band — pick 17's "fitted" caption is honest.

## 5 · The failure-mode checklist (judged; critic's verdict per item)

| item | verdict | why |
|---|---|---|
| vacuous convergence | **CLEAN for row 1** | P12/P15 red the gate on this tree; the control reds in every run |
| spec cites itself | **OPEN (H2)** | the 13 has no product row; the only reader is a docs-resident copy, so nothing in the product can fail on it |
| gates that cannot fail (clause / threshold / disjunct) | **PARTIAL** | the critic's P12 (floor), P15 (ceiling + the predicate disjunct) red G2 on the small rigs; the author's "threshold battery" is arithmetic on reads, not planted literals (H3); no new gate was born, so no new battery is owed for G2, but R2's product row (when it lands) owes all three |
| the class cure (registry-v8 §2.12) | **OPEN** | G2's class (X6 sides-blind) is red on a scratch four-band read in chromium only; the half-clip 0.8 % is blind at both small rigs (1.411/1.449, inside) — i.e. the class is NOT cured at exactly the rigs this pass's cure moved; the 0.4 % re-clip is "below resolution" in chromium, WebKit unread (pass 9: WebKit desk 1.426 → 1.442 under it) |
| the elegant-reduction trap | **PRESENT** | "one literal" cures the six rigs; 16×16 reds at 4 of 5 rigs on both trees (1.45–1.79), chromium 450 dpx 1.457 (pass 9) is unread this pass, 366–379 dpx unread — the hard part is named and deferred |
| legacy aliases | CLEAN | `VIEWBOX_SIZE = BOARD_VIEWBOX_SIZE` in GameBoard.vue is a local alias of the new constant (harmless; one name would do) |
| masked fallbacks | CLEAN on row 1 | `band = min(top, bottom)` hides a fused side by design (tabletL top 14.753); declared since pass 6 |
| masking ledger over a shipped defect | n/a | no ledger in this delta |
| unverified gestalt | **OPEN** | 0 frames; no photograph of the 13-unit band on any surface either engine; the union ships the BLUE arm, so GRAPHITE's band is never seen on the shipped union without the flip |
| consumer-less substrate | **MINOR** | `BOARD_VIEWBOX_SIZE`/`BOARD_GHOST_SEED` have two consumers each — fine; `useDevicePixelRatio` has no test (H4) |
| the generic default | CLEAN | |
| π (the pixel it moves that it did not declare) | **UNREAD (painted)** | source-level: the union delta's only CSS change is one declaration under `[data-ring-arm="graphite"] [data-raster="small"]`, so on the shipped blue arm it matches no element — π = 0 by construction on the shipped union; the 74a2b5d9 arm's painted π (tally, sparkle retirement, palette) vs 74a2b5d9 is unread a third pass |
| constraints (AA painted, filterBudget, M16, @property) | **M16 0 (re-derived); filterBudget source 9 → 8 on the 74a2b5d9 arm (never grows); AA painted and @property UNREAD** | R4 whole OPEN |
| instrument from docs/ or forked | **WATCH** | no product import from docs/ (no product row exists). The rig's `band-lib.ts`/`bandc.crit.ts` are docs-resident copies used only in scratch — lawful as a reading, but it is why R2 stays open |
| residual home edits | CLEAN | re-derived (§1) |
| a lane-chosen parameter called a cure | **PRESENT, declared** | 13 is fitted (12 reds, 12.5 = 12, 15 reds); called a cure for the six rigs only, with the caption — acceptable under P9 §E because it names its ballot |
| an admitted floor over a product red | CLEAN | |
| on-WAVE delta missing / base undeclared / unchecked | CLEAN | re-derived (§1) |
| a scratch apply that touched nothing | CLEAN | every apply printed its gitdir and path count; blob lists compared |
| a number the critic did not re-derive | see §4/§6 | row 1 chromium re-derived exactly; WebKit below |

### WebKit — `guarded --exclusive webkit` run 21:08:39 (queued for the machine-wide lock to ~21:31:45, held by another session's 23-min hold; not a stall) → 21:32:53, load 14.92 → 6.05, zone inuse 474,106 → 740,608 (< 8M), **exit 0**, 6 passed

| rig (board dpx) | tree ratio (band top/bottom · frame) | control |
|---|---|---|
| desk (636) | **1.426** (15.545/10.507 · 7.367; top fused, SIDES≠) | 0.543 RED |
| phone (365, small) | **1.391** (5.853/5.690 · 4.090) | 0.229 RED |
| tablet (668) | **1.381** (10.732/11.040 · 7.774) | 0.531 RED |
| tabletL (604) | **1.434** (14.710/9.978 · 6.959; top fused) | 0.568 RED |
| deskcoarse (636) | **1.426** | 0.543 RED |
| phone812 (347, small) | **1.427** (5.569/5.570 · 3.902) | 0.083 RED |

Every number equals the author's to the thousandth. **CHAIR pick 1's row 1 is MET, re-derived by a non-author: six of six rigs inside [1.35, 1.45] in BOTH engines on the pass-9 WAVE `954bbbab` (+ homes v3 + the on-WAVE delta + the reader flip), the HEAD control RED in every cell of both runs.** Six-rig span chromium 1.377–1.430, WebKit 1.381–1.434; tightest margins: WebKit tabletL 0.016 under the ceiling, chromium desk/deskcoarse 0.027 over the floor. Per-engine keys (P9): the engines disagree by up to 0.049 at desk (1.377 vs 1.426) and 0.036 at both small rigs, in OPPOSITE directions (phone: chromium higher; phone812: WebKit higher) — so neither engine's reading predicts the other's and the cliff's unread span cannot be inferred from one engine.

The WebKit P12/P15 plants were NOT run (a second WebKit job would have queued behind the lock again); the WebKit born-RED for the 13 literal rests on WAVE9-read's WebKit pre-cure reading (phone812 1.390, phone 1.371 at 12 — both INSIDE). **Note what that means: in WebKit, the pre-cure 12 was already green at both small rigs.** The cure is a chromium-only necessity (phone812 1.349), and in WebKit it moves phone812 1.390 → 1.427, toward the ceiling (0.023 left).

## 6 · The cliff's unread span, READ by the critic (pick 17's 366–379 dpx) — chromium: TWO REDS

A scratch copy of `bandc.crit.ts` (f256121a + six width-only rigs `c394…c407`, 394–407 × 699, coarse, DPR 1; sha 442b79dd; never banked — a reading, not a gate) on the same tree and control. `guarded` run 21:32:59 → 21:34:02, load 6.52 → 7.39, zone inuse 740,608 → 751,077, **exit 1**.

| rig | board dpx | tier (units) | tree ratio (band t/b · frame) | control |
|---|---|---|---|---|
| c394 | 366 | small (13) | 1.417 (8.433/5.797 · 4.090) | 0.532 RED |
| c400 | 372 | small (13) | **1.346 RED** (8.871/5.659 · 4.206) | 0.093 RED |
| c402 | 374 | small (13) | 1.351 inside by **0.001** (6.040/5.764 · 4.267) | 0.090 RED |
| c403 | 375 | large (15) | **1.504 RED** (9.028/6.420 · 4.269) | 0.509 RED |
| c405 | 377 | large (15) | 1.438 (6.347/6.124 · 4.260) | 0.500 RED |
| c407 | 379 | large (15) | 1.420 (8.707/6.131 · 4.318) | 0.075 RED |

**The fitted constant reds the product inside the span its caption admits unread.** At 372 dpx the 13-unit pass reads 1.346 (0.004 under the floor), at 374 it holds by 0.001, and at 375 — the first span on the large tier — the 15-unit pass reads 1.504 (0.054 over the ceiling). The frame itself steps 4.09 → 4.27 across these spans, and the band does not move monotonically with it (13 units: 1.417 at 366, 1.346 at 372). So neither the cut (375) nor either literal (13, 15) is a band: the reading at the device-pixel scale is quantised enough that two fitted constants cannot hold every span, and pass 10's cure moved the red from 347 dpx into 372 and 375 dpx without a reading there. These boards are real: a DPR-1 window 400–403 CSS px wide renders them (a narrowed desktop browser; no DPR ≥ 2 phone does, since those span ≥ 730 dpx).

Consequences: (1) pick 17's caption ("±1 around 375 flips no read cell") is now falsified — the read cells at 374/375 straddle a RED; (2) charter R3 ("366–379 read both sides of the cliff; the reds cured or captioned") is RED, not merely unread, in chromium; (3) the class (the band's ratio under raster quantisation across spans) is OPEN: the six-rig row 1 is met as ruled, but it is met at six chosen spans and the same mechanism reds at spans between them. The WebKit column of this table is queued (below).

**WebKit, the same six cliff rigs** — `guarded --exclusive webkit` run 21:34:15 → 21:35:23 (the lock free), load 6.68 → 10.62, zone inuse 751,077 → 761,672, **exit 1**:

| rig | board dpx | tier | WebKit ratio (band t/b · frame) | control | chromium (above) |
|---|---|---|---|---|---|
| c394 | 366 | 13 | 1.394 | 0.374 RED | 1.417 |
| c400 | 372 | 13 | 1.378 | 0.616 RED | **1.346 RED** |
| c402 | 374 | 13 | 1.377 | 0.119 RED | 1.351 (0.001) |
| c403 | 375 | 15 | **1.483 RED** | 0.266 RED | **1.504 RED** |
| c405 | 377 | 15 | **1.454 RED** | 0.164 RED | 1.438 |
| c407 | 379 | 15 | 1.421 | 0.073 RED | 1.420 |

**375 dpx — the cut itself — is RED in BOTH engines (1.504 / 1.483)**; 372 reds chromium, 377 reds WebKit. Per-engine keys (P9): three distinct red cells over two engines inside 14 device pixels of span. The large tier's 15 units holds "from 380 up" (pass 9) and fails at 375–377; the small tier's 13 holds 347/365/366/374 and fails at 372 in chromium. A cut at ≥ 378 would move 375/377 to 13 units (unread there at 13) — the knob cannot be priced without that read, and no single cut is shown to hold the span.

**WebKit P12** (the revert to 12 on the small tier) — run 21:35:34 → 21:36:01, load 9.58 → 8.81, inuse 772,761, **exit 0**: phone 1.371, phone812 1.390, both INSIDE (= WAVE9-read's pre-cure WebKit to the thousandth). The control RED (0.229 / 0.083) in the same run. **The pass-10 cure has no WebKit born-RED**: the literal is needed in chromium only; per engine it is a chromium cure and a WebKit no-op-toward-the-ceiling.

## 7 · The number and the verdict

**Row 1 (CHAIR pick 1): MET, re-derived by a non-author in both engines on the pass-9 WAVE** (§4: chromium exit 0, WebKit exit 0, twelve cells to the thousandth of the author's, the control RED in all twelve). The BANK condition does not fire. **Verdict: ADVANCE.**

**The critic's number: 80** (pass 9: 79). What earns the one point: row 1 met on the ruled tree in both engines with a born-RED on this tree (chromium P12/P15); pick 6 met (crit.partial30 shipped, 6/1 reproduced); pick 17's caption written; hygiene cured on the 74a2b5d9 tree; a faithful, reproducible bank (replay route, apply-checks and dist identity all re-derived). What holds it at 80 and not higher:

1. **The class is OPEN and now has product reds by name** (§6): 372 dpx chromium 1.346, 375 dpx chromium 1.504 / WebKit 1.483, 377 dpx WebKit 1.454 — inside the span pick 17's caption calls unread, and they falsify its "±1 around 375 flips no read cell". Row 1 is met at six chosen spans; the mechanism (two fitted unit counts on a device-pixel cut) is shown not to hold the spans between them.
2. **H1**: the hygiene row is claimed cured "on both trees" and is not cured on the union (`gameCell.css:312–314` half strokes; `:359–365` "the small raster takes 12", now contradicting the shipped 13).
3. **R2 OPEN** (no product band row; the 13 is guarded by nothing in the product), **R3 RED** (16×16 at 4/5 rigs both trees per the author; 450 dpx unread; the cliff now read RED), **R4 OPEN whole** (painted π vs 74a2b5d9, AA, census, goldens, G1/G1b/G4/G10, print, forced colours, property-block, regime matrix), **R5 OPEN** (four games, clearance), **R6 OPEN** (B-TALLY-16 a third pass), **R7 PARTIAL** (bands in a clone unrun by either).
4. G2's class (X6 / half-clip / re-clip) read in chromium only on a scratch four-band rig; the half-clip is BLIND at both small rigs, i.e. exactly where this pass's cure lives.
5. 0 frames: the 13-unit band has never been photographed on any surface.

Earliest 100: not pass 11 by the arithmetic of the open rows (R2–R7 and the cliff class); pass 12 at best.

## 8 · The critic's own incidents and replay

- **I1** The first chromium row-1 launch (20:54:45) was withdrawn by my own PIDs (92111/92120) before it opened a browser: the tree's server had not got its heavy slot and the run would have read nothing. Re-run through a chain that asserts both identities first.
- **I2** The tree's preview queued 20:54 → 21:06:24 for a heavy slot (first in the machine queue); WebKit row 1 queued 21:08:39 → ~21:31:45 for the machine-wide lock, held by another session's 23-min hold. Neither is a stall; no sibling listener was touched.
- **I3** `git archive` drops the `docs/precepts` gitlink, so my archives' tree ids differ from the bank's; content was compared by blob list path by path (§1). No tree id is claimed equal by id.
- **I4** The kernel-zone leak is ARMED (guard banner; slope 30.2/s). Every browser row opened under 8M (440,969 → 772,761 across the session). Reported per the guard; the owner decides on the reboot.
- **I5** The reader flip `RING_ARM = "graphite"` remains in the critic's scratch archive (`od -c` verified); never banked, nothing banked by the critic at all. The scratch cliff spec `bandx.crit.ts` (442b79dd) is a reading rig, not a gate.
- **I6** Both servers stopped by recorded guarded PIDs (90744 control, cwd `w7-control/web/frontend`; 91244 tree, cwd the critic's wave archive); ports 4235/4254 confirmed free; no lane process remains.
- **Replay**: 74a2b5d9 (`git archive` via the lane worktree) → `git init` → apply `pass9/integrate/WAVE.diff` (b3725e4f) → `homes.on-WAVE.diff` (0723d508) → `pass10.delta.on-WAVE.diff` (5b12eec0) → flip `RING_ARM` → `VITE_BASE_URL=/ guarded vite build` (= `index-B-HJEDCezeHq.js`, CSS 115,719 B) → `guarded vite preview` :4235 beside the control :4254 → `bandc.crit.ts` f256121a `GATE=1 STAT=tb` (cliff: the six-rig copy 442b79dd).
