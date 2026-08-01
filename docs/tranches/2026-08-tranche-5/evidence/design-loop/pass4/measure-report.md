# MEASURE — stage report, pass 4

Record of record: **`measure/RESULTS.md`** (this file is its verdict sheet). Raw under
`measure/rig/out-*.json`, `logs/measure/*.log|jsonl`, `perf-rig/runs/m4-bat-*`. Shots:
`measure/shots/` (117) + `measure/shots-sim/` (5).

**Single tree.** MAIN **`52ef014a`**, one build (`index-6v9S84SRo2al.js`, md5
`dc6424524ce09d0cc9e4865c561beeac`, **byte-identical to F3's `dist-F3head`**), served read-only,
after the last edit of the pass. Deltas against the seal are against **`6800af04`** re-served and
re-measured in this session; deltas against a cure's predecessor are against the **pass-3 close
`3969f512`**. Nothing committed, pushed or deployed; tree clean at exit (`git status` empty).
`perf-rig-iphone16` booted for the device block and **shut down at its close** (0 booted at exit).
`:4894`/`:4895` alive and never addressed; `:3000` (foreign palette-api), `:3001`, `:4288` never
addressed; `:4188` verified free, used for the built-dist lane, killed; the dev server ran on
`:5322` with `PLAYWRIGHT_BASE_URL` explicit and was killed. **Every gate log is on disk under
`pass4/logs/measure/`.**

## THE DEPLOY GATE — pass3-registry §5, verbatim

| §5 row | verdict |
|---|---|
| iPad coarse card ≤ 1098.25 | **PASS — 1067.86 / 1067.83 (−30.39 / −30.33)** |
| A1 ribbon closed with its failing e2e cell | **PASS** — fires on glass, does not over-fire; born-RED re-run by MEASURE (1 failed / 16 passed at the pass-3 shape, 17/17 restored) |
| `d4e8e41e`'s boot path attributed on JavaScriptCore | **PASS** — this build on iOS 19: booted, dealt, `errors: []` |
| tally line restored or ruled | **PASS — 1 paint at seven widths**; 0 at six of them on the tree it shipped broken |
| landscape rung priced or reverted | **PASS (priced)** — 40.22px cell, portrait parity; 44.44 at 926×428 |
| deploy ONLY via `npm run deploy`, owner-authorized | **HELD** — nothing deployed; production untouched at `f1adfca5` |
| *(mandate)* the sealed P1 state must not regress | **PASS, one disclosure** — geometry at or under the seal everywhere; three sim gates hold; all five scenarios read 0.43–1.18 fps low against the seal's own build in-session |

## The order's cells

| cell | verdict |
|---|---|
| 1 · iPad card vs 1098.25 | **1067.86 chromium / 1067.83 webkit**, `regimeOk` 5/5 both engines |
| 2 · A1 ribbon + same-game deal, on device | **GREEN** — control silent, row fires with `your marks aren't saved`, confirm deals through; same-game rides the bridge (16→25 at the staged 5×5, scene stamp survives) |
| 3 · boot attribution, targeted, this build | **GREEN** — 81 cells, 14 chips, `["Size","Difficulty"]`, one deal, `errors: []`, 2009 ms |
| 4 · tally ruling below 1280 | **GREEN** — 1 paint × 7 widths × 2 engines; pass-3 close 0 × 6, its probe shown able to see one |
| 5 · landscape rung as shipped | **PRICED** — 40.22 (was 25.11); fold overflow re-reads **90.58 / 89.98** against F3's banked 88.58 |
| 6 · coarse table + co-visibility, republished | **GREEN** — 1280c −30.39 · 375 −11.23 · 390 −32.55 · 1440f −12.83 vs seal; stack still **1.705 vh**, not claimable |
| 7 · sim battery, n=5, interleaved | **PASS ×3 gates** — idle **59.04 ≥59 (+0.04)** · gallery 49.59 ≥49 · theme 51.56 ≥45; census `filter` 17=17, `will-change` 39=39 |
| 8 · rendered census (hover-aware) + theme-bake | **GREEN** — built-dist lane 17/17, G3.5 both regimes, bake ×2 engines ×2 directions |
| 9 · shots | **117 headless + 5 device**; two gaps disclosed, not filled |
| estate | **GREEN** — vue-tsc 0 · vitest **332/31** · e2e **115/115** · built-dist **17/17** · lint:ink 0 · golden-bytes PASS · goldens **4/4 on 8 runs** |

## Red, or worth a second look, in the order's own words

- `idle3s head median 59.04 against a ≥59 gate` — **+0.04 fps of margin at n=5**, on an arm whose
  own windows span 3.31 fps. A pass with nothing behind it.
- `Δ base: −0.62 · −0.57 · −0.54 · −0.43 · −1.18` — five scenarios, five negatives, one session.
  Every magnitude is inside the ±2.5 law; the SIGN is uniform and no average shows it.
- `844×390 fold overflow 90.58 chromium / 89.98 webkit` (F3 banked **88.58**).
- `vitest 332 passed / 31 files` (F3's dossier says **32 files**).
- `gallery-deal.spec.ts:432 — 115/115 on the dev server, 3/3` — F3's inherited red does **not**
  reproduce off a preview. The row was routed to Lane A as a defect; it is a preview-timing artifact.
- `device filter census 11/15 on a reused origin, 9/13 on a fresh one` — the +2 is two resident
  attribution hearts, rig state, not the tree.
- `toggle-crest-dark: 0 red / 8 runs` here, against Lane D's 4/11 and F3's 5/14 the same day.
- the guard ribbon carries **two names** — `role="alertdialog" aria-label="Deal a new board?"` over
  a drawn `deal over this puzzle?` — one rank above the gate BC spent this pass writing for exactly
  that property.

**Routed:** the idle margin and the uniform in-session sign to the adjudicator with the n=5 windows
printed; the 88.58/90.58 and 31/32 corrections to their lanes; the preview-only e2e red to the
registry as a re-attribution; the census-on-a-reused-origin trap to whoever takes the next device
census; `toggle-crest-dark` to the standing team-lead row with a third rate beside the other two and
**no re-baseline**; the two crayon registers at one rank to the adjudicator for the third pass,
now with a device frame as the exhibit.
