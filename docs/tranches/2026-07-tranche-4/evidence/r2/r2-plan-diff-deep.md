# LANE r2-plan-diff-deep — plan-vs-landed, round 2 (narrow + deep)

HEAD `65425697` on master. r1 (`r1-plan-diff.md`) returned only 2×P3 and called the
record "very high fidelity." r2 re-audits the four probes the brief names. Verdict:
**r1 was right about the tree — the SOURCE landed the §3a register almost verbatim — but
r1 never opened `docs/animation.md`, and that is where the one real miss lives.** One
compound P2 (the W13 band-ledger re-derive never landed AND its owning gate passed the row
by measuring the wrong file), plus confirmations that close the lens.

---

## (a) §3a W10 disposition register — all rows executed? (README lines 77–93)

15 table rows. Byte/grep-checked each against the tree at HEAD. **14 landed exactly; row 15
(band ledger) did NOT — see finding F1.**

| # | register row | disposition | tree truth | verdict |
|---|---|---|---|---|
| 1 | F6 page-turn | KEEP | present | ✓ |
| 2 | celestial palette rewire | KEEP | `pencilConfig.ts:46-57` one family | ✓ |
| 3 | F1 px-native registration | KEEP goal+mechanism | `HandDrawnOutline.vue` px regime kept | ✓ |
| 4 | F4 W1 outline +1 (disc 5→6, moon 6→7) | KEEP | `DarkModeToggle.vue:53` sw=6 (disc), `:135`/`:273` sw=7 (moon) | ✓ |
| 5 | F4 S1 spiral geometry + **sw 10→9** | KEEP | `DarkModeToggle.vue:62`,`:237` `stroke-width="9"` | ✓ |
| 6 | F4 S3 (`#D99A10`) + M1/M2/M3 (`#FFF4AA`) | KEEP | `pencilConfig.ts:54` sparkleStroke `#D99A10`; `:56` moon.star `#FFF4AA` | ✓ |
| 7 | filter bound both icons + rest `visibility:hidden` | KEEP | rest stacks parked hidden, live pair hidden (g1:106) | ✓ |
| 8 | PRM toggle variant | KEEP | rg1/g2 PRM rows green | ✓ |
| 9 | **F4 S2 spiral `#DF9A1E` → `#F0B030` REVERT verbatim** | REVERT | `pencilConfig.ts:52` `spiral: "#F0B030"` — byte-exact, key kept | ✓ (r1-F2 line-anchor drift stands) |
| 10 | F5 Set-and-Rise cut wholesale | RE-CUT | grep-zero: no `set-and-rise`/`IGNITE`/`porthole`/`setAndRise`/`phaseMachine`/`deferredFlip` in `web/frontend/src` | ✓ |
| 11 | F1 stroke semantics RE-CUT (grain-outline 0.13/0.75, outset 4, `outlineBoilPx` 0.45) | RE-CUT | `pencilConfig.ts:227` `{baseFrequency:0.13,…,scale:0.75}`, `:173` `outlineBoilPx:0.45`; `HandDrawnOutline.vue:18` outset 4 | ✓ |
| 12 | M2 crescent-detail `createStrokeDrawIn` cut | RE-CUT (cut) | no crescent draw-in survives; geometry kept | ✓ |
| 13 | dusk ease re-anchored AT click, ~350ms | RE-CUT | `assets/index.css:377-390` "dusk ease (disposition keep, re-anchored AT click)" | ✓ |
| 14 | anticipation squash 120ms overlapped | RE-CUT | `DarkModeToggle.vue:589-592` "SQUASH (0-120ms) … kept verbatim" `toggle-squash 120ms both` | ✓ |
| 15 | **band ledger row (`docs/animation.md`): revert toward "theme page-turn ~950 ms"** | RE-CUT | `docs/animation.md:26` reads "theme page-turn ~950 ms" — W12 revert landed, but W13's re-derive did NOT (F1) | ✗ |

**REVERT-verbatim byte-check (row 9):** the named value `#F0B030` is byte-exact at its
`spiral:` anchor (`pencilConfig.ts:52`), key preserved. r1-F2's anchor drift (README cites
`:47`, real key at `:52`) confirmed and stands — cosmetic.

## (b) W13 wave gate table vs what the gate lanes measured — the narrow probe

Read `evidence/w13-impl/{g1-perf,g2-motion,rg1-perf-motion}.md`. The five soul/perf rows
trace honestly (idle 0 paint, sun/moon SSIM 1.0000, drawer ≤7.6px, e2e 44/44 — all
re-confirmed in (c)). **One sub-criterion of the "toggle storybook" gate row rests on a
probe narrower than the row states:**

- Wave gate row (`waves/T3-W13-motion-perf-recut.md:134`, "toggle storybook") requires,
  among its checks: *"band ledger row re-derives ~950ms → ~1010ms."*
- The owning gate g2 discharged it (`g2-motion.md:71-72`): *"Band ledger re-derivation:
  ~950→~1010ms lives in DarkModeToggle.vue (plush-land 1010ms, backstop 1100ms) — no
  pencilConfig ledger row exists to edit (l6 deviation 1 grep-confirmed)."*
- g2 checked `pencilConfig.ts` and `DarkModeToggle.vue`, found no ledger constant, and
  declared the row satisfied. **It never opened `docs/animation.md` — the actual band
  ledger**, named verbatim by the register it descends from (README §3a row 15 cites
  "`docs/animation.md`: 'theme set-and-rise ≈1.25 s'"). See F1.

Other rows checked for scope-narrowing, cleared:
- Row 1 idle perf: PASS rests on the **dist-preview** trace (`rg1-prod-unsolved.summary.json`
  = 0 Paint / 7.99 BMTF), not the dev trace (119.92 dev-only `recordLoop`) — the wave's own
  dev-floor hedge, correctly discharged on the preview. Not narrowed.
- Row 5 PRT "0 dropped frames": PASS rests on **consensus** across 5 runs; run-2 shows 3
  in-window drops under a load burst (loadavg 9.03), disclosed as ambient. §3b restates it
  as "0 attributable" honestly. Load-sensitive, disclosed — not a hidden narrowing.
- Row "stage empty: never": the strict boolean trips at the 100ms fade ending t=340;
  adjudicated in-report as the spec'd fade edge (g2:58, 156-157). Disclosed.

## (c) Evidence-citation spot-audit — 12 rows, artifacts on disk + content match

Every cited artifact exists and shows the claimed number **except** the band ledger (row 12).

| # | claim (source) | cited artifact | on disk / content | verdict |
|---|---|---|---|---|
| 1 | §3b sun SSIM 1.0000 | `rg1/mascot-light-*` + rg1 row 2 | present; 1.0000 ×5 poses | ✓ |
| 2 | §3b moon SSIM 1.0000 | rg1 row 2 / g1:100 | 1.0000 | ✓ |
| 3 | §3b logo ≥0.9998 | g1:99 (l5 ssim.py rerun) | min 0.9998 mean 0.9999 | ✓ |
| 4 | §3b outlines 0.9961/0.9980 | g1:97-98 (l4 pair rerun) | 0.9961 / 0.9980 | ✓ |
| 5 | §3b divider 0.9752 exception | g1:101 | 0.9752 full, disclosed fallback | ✓ |
| 6 | §3b heartbeat 7.99 (was 119.95) | `rg1-prod-unsolved.summary.json` + `before-0.7.0.summary.json` | 0 Paint/7.99 BMTF; 119.95 BMTF | ✓ |
| 7 | §3b drawer frame-1 ≤7.6px | `rg1/c2-gate-results.json` + rg1 row 1 | 6.87/6.79px along-path | ✓ |
| 8 | §3b drawerGlide `cubic-bezier(0.32,0.72,0,1)`@520ms | `pencilConfig.ts:140` + `useControlsDrawer.ts:61` | curve exact; GLIDE_MS=520 | ✓ |
| 9 | §3b e2e 44/44 | g2:150, c1/c2/c3 | 44/44 (1 known throttled-void flake) | ✓ |
| 10 | §3b toggle crest 1.0919 @t≈528 | rg1 row 3 / g2:56 | 1.0919 @525-531 / @527.9 | ✓ |
| 11 | §3b PRT 256-path 0 dropped | rg1 row 5 | 0 on consensus, run-2 outlier disclosed | ✓ (caveated) |
| 12 | W13 gate "band ledger re-derives ~950→~1010ms" | `docs/animation.md:26` | still "~950 ms"; no `1010`/`1030` anywhere in file | **✗** |

The heartbeat family JSONs cross-check clean: `before-0.7.0`=119.95, `after-0.8.0`=15.97,
`after-0.8.1`=8.09, rg1 final=7.99 BMTF / 0 Paint — the ×15 collapse is real and on disk.
Note g1's FIRST trace (`g1-prod-unsolved.summary.json`) shows the FAIL state (15.98 Paint,
80 full-viewport clips, 8.29 BMTF); the correction pass c1 fixed it; rg1 re-measured 0/7.99.
The record's final numbers cite rg1, correctly.

## (d) T2 residual — W5/W8 hunk-pairing in `vite.config.ts`

**Both hunks present and coherent.** W8 cold-start `headHints()` plugin (preload of
solver.worker chunks + wasm + woff2 faces) at `vite.config.ts:106-171`, `apply:'build'`.
W8 Rolldown `advancedChunks.groups` (vue-vendor / animation-vendor strict grouping,
first-match-wins, `vue` before animation) at `:293-321`. W5's cache-header/immutable-font
lineage referenced coherently at `:286-292` (`assetsInlineLimit` woff2 non-inline "the W5
cache-header beat this self-host feeds"). No hunk conflict; the two coexist. **Non-finding.**

Corroborated-but-known: the stale W12-swap comment at `:263-264` ("Retire this entry when
W12 swaps the `file:` link for the published registry package") — the tree still `file:`-links
`@mkbabb/csp-solver-wasm`, so the promised swap never happened. This is the FAM-8
"vite.config W12 promise" item already booked in r1. CONFIRMED, not new.

---

## FINDING

### F1 (P2) — the W13 band-ledger re-derive never landed, and its gate passed by measuring the wrong file

**Compound: a plan-vs-landed miss + the gate blind spot that let it through.**

`docs/animation.md:26` (the "Motion cadence bands" §, Band D row) is the band ledger the
tranche-3 record repeatedly names (README §3a row 15 cites it by path). It ships at HEAD as:

> `| D — choreographed sequences | … | grid draw-in ~800ms, erase ~150ms+4ms·i, logo clip 1.2s, theme page-turn ~950 ms, controls-drawer glide ~480 ms, celebration ≤3.2s |`

Two figures in that row are stale against the shipped tree:

1. **"theme page-turn ~950 ms"** — W13 replaced the ~950ms whirl with the Bloom
   shrink-and-grow. The W13 gate row explicitly required *"band ledger row re-derives
   ~950ms → ~1010ms"* (`waves/T3-W13-motion-perf-recut.md:134`). The tree ships the gesture
   at **~1029ms** (`rg1-perf-motion.md:78` total cleared 1025.7–1030ms; g2:57 = 1029ms).
   The ledger was never updated: `grep` for `1010|1030` in `docs/animation.md` → zero hits.
   The row's own descriptor ("theme page-turn") is also stale — the mechanism is now the
   Bloom, not a page-turn.
2. **"controls-drawer glide ~480 ms"** — the drawer glide was retuned to **520ms** at the
   audit-4 S3′ ruling (README §3b line 107; `useControlsDrawer.ts:61` `GLIDE_MS=520`;
   `pencilConfig.ts:134-140` "at 520ms (Band D)"; rg1 row 4 reads the tree at @520ms). The
   ledger still says 480ms.

The gate that owned criterion (1) — g2 — recorded PASS on it with
(`g2-motion.md:71-72`): *"~950→~1010ms lives in DarkModeToggle.vue … no pencilConfig
ledger row exists to edit."* g2 looked in `pencilConfig.ts` and `DarkModeToggle.vue`,
found no ledger constant, and declared the row moot — **without opening
`docs/animation.md`, the file the register names as the band ledger.** The gate could not
fail on the actual artifact because it never read it. That is the close-class mechanism:
a gate row passing on a probe scoped narrower than the row states, leaving the named
artifact stale.

- **Severity P2.** `docs/animation.md` is a live product doc (the motion-cadence law,
  referenced by CLAUDE.md/README per the doc-truth ledger). Not user-facing runtime, but a
  gate row's recorded PASS rests on a check of the wrong file, and two shipped-motion
  figures in the canonical ledger are wrong (950 vs 1029; 480 vs 520). r1 missed it because
  r1 verified the tree/config values and never diffed the band ledger prose.
- **family_hint:** `gate-scope-narrowing` (a gate criterion discharged against a narrower
  surface than the row names, leaving the named artifact stale — kin to `gate-cannot-fail`).
- **Probe (rerunnable):**
  ```
  grep -n "theme page-turn\|controls-drawer glide" docs/animation.md    # → :26, "~950 ms", "~480 ms"
  grep -c "1010\|1030\|520" docs/animation.md                            # → 0 (re-derive never landed)
  grep -n "GLIDE_MS = 520" web/frontend/src/games/shared/useControlsDrawer.ts   # → :61 (tree = 520ms)
  grep -n "band ledger row re-derives" docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md  # → :134 (gate required ~1010ms)
  grep -n "no pencilConfig ledger row exists" docs/tranches/2026-07-tranche-3/evidence/w13-impl/g2-motion.md  # → :72 (gate looked in the wrong file)
  ```

---

## Non-findings (checked, cleared this round)
- (a) 14/15 register dispositions landed byte/grep-exact (table above). REVERT-verbatim
  `#F0B030` byte-confirmed.
- (b/c) 11/12 spot-audited citations exist on disk with matching content; the heartbeat,
  SSIM, drawer, and toggle-crest numbers all trace to first-party JSONs/reports.
- (d) vite.config W5/W8 hunks present and coherent; only the known FAM-8 W12-swap comment
  is stale (re-confirmed, not new).
- r1-F1 (stale skip-test docstring) and r1-F2 (F4-S2 line-anchor drift) both stand — not
  re-litigated.

— r2-plan-diff-deep, 2026-07-12.
