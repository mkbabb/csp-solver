# P-W4 — validate + deploy + record

The closing wave. Every curve on the rig at :4894, **DEFAULT state, real Safari 26.4 + the
iOS 26 sim**, median of ≥3 clean windows, the `a1` sham cell alongside as the noise floor.
Thresholds live in `patches/p1-safari-ios-performance/gates.json`, committed in the same
commit as the cure merge (lessons rule 2); base reds are banked at `981353c0` (r1/r2 run IDs)
and re-proven with one fresh base run before the cured run. Targets derive from r2's measured
cured ceilings: idle 100% · deal 99% · solve 99% · theme ≥89% · gallery ≥86% of ceiling.

## Gates

| gate | command + instrument | threshold | base (RED) |
|---|---|---|---|
| G4.1 desktop battery | `KEEP_SAFARI_FRONT=1 ./run-safari.sh <id>` all six scenarios, `node summarize.mjs` | idle ≥ 97 fps AND long33 == 0; deal ≥ 96; solveCelebration ≥ 95, long33 ≤ 2; themeToggle ≥ 85 with the panel filter retired, ≥ 74 (75% of ceiling) if the ballot kept it—the ruling's number encoded in `gates.json` in the ruling's commit; galleryGlide ≥ 83 | 79.0/24 · 72.4 · 63.6/34 · 32.0 · 69.9 |
| G4.2 sim battery | `./sim-matrix.sh`, all five scenarios, **plus the light-theme panel cell r2 never ran** (`a4` measured dark only; the panel filter differs by theme) | idle ≥ 59, galleryGlide ≥ 49, themeToggle ≥ 45; **no scenario regresses base**—the `a13` trap check | 54.9 · 46.8 · 38.2 |
| G4.3 GPU attribution | `./cpu-attrib.sh <cell>`, six idle windows | GPU-process ≤ 4.5 CPU-s per 30 s idle | 10.3 |
| G4.4 version parity | one command reading pencil-boil `package.json` + app dependency + CHANGELOG + README + built dist stamp together, run after the last surface-changing wave | all agree at 0.10.0; every number in the record re-derived at the citing commit | — |
| G4.5 deploy + production pass | `npm run deploy` (owner-authorized per deploy—the ONLY sanctioned path, per the npx packument-OOM trap); idle ~2 min polling **only** the HTML; then on sudoku.babb.dev in real Safari: console/CSP clean, assets 200, one real interaction, the filter census re-read **from production**, one idle curve, glyphs + sharp wordmark eyeballed | all pass before the seal counts (lessons rule 4) | — |
| G4.6 the record | addendum to `docs/tranches/2026-07-tranche-4/WGATE-record.md` §9 chain | 100% disposition ledger: the ballot rulings with SSIM indicators beside them, the budget as shipped, every refusal with its number, every residual + exception with a named re-entry trigger | — |

## The visual soul pass

The before/after glyph pairs at reading distance (the P-W3 contact sheet + board composite,
re-confirmed on the deployed page) ride G4.5; goldens compare **only vs the built dist**,
linux minted from the runner artifact, darwin soul 0.017, sun-crest coarse-floor clause
untouched.

## Residuals — booked with numbers, never priced into a score

- **The gallery fold, ~150 ms at ~870–910 ms** (211–260 ms sim)—`useFlipGlide`'s one forced
  layout across the board⇄card fold; survives every ablation. Re-attributed at the MISS-CURE
  retake: the frame is **159–176 ms in 100% of windows across seven separately built bundles**,
  and the three named P-W3 suspects each move the cell by ≤0.8 fps against an interleaved
  control (wraps −0.56, progress gate +0.75, B2 font +0.46), while r2's own aB2 ablation re-run
  on the shipped dist buys +0.42—there is no live-filter or transition headroom left in this
  cell. Trigger: any owner mark on the fold (it's adjacent to design mark 2 already). A P2
  patch, not a percentage.
- **The theme swap's two ~125 ms whole-page repaints**—now 1042 nodes restyled twice. The
  banked panel-twin `v-if` **fired and is spent** (`0642e098`: −120 nodes, −5 live filters,
  census 14 → 9, one card per regime instead of two); its paired effect on the cell is +0.17
  gallery / −0.47 theme, i.e. below the rig's resolution, so the repaint pair is the residual and
  the lever is not a second time. Mechanism re-named with a number: the surviving allowlist
  filters (the Apple-frozen divider, the hearts, the toggle bodies) re-execute on the repaint—
  killing every filter and transition in CSS buys **+3.56** on this cell and nothing on gallery.
  Trigger: a *paired* themeToggle measurement below the `gates.json` floor—block-vs-block does
  not qualify (see the instrument row).
- **The desktop rig's session drift—the instrument, booked as a residual because it outweighs
  both gates it touches.** The identical bundle on the identical port slid **galleryGlide
  85.16 → 81.33 and themeToggle 88.88 → 82.60 over 23 minutes** (18 runs, monotone) while
  `idle3s` held 98.39 → 97.84 and the app-free rAF ceiling held 98.4 → 98.1: the drift lands on
  the cells with 100–170 ms frames and spares the ones sitting on the display ceiling. Gate
  margins here are 1–3 fps and the within-block sham floor is ±1.0, so **any adjudication of
  these two cells must interleave the bundles inside one block or quiesce the box**; the
  ≥83/≥85 rows in `gates.json` are sound as ceilings-derived targets and were not moved.
- **`undoBurst`'s ~55 fps floor**—no spike to blame; wants a different instrument. Trigger:
  an owner mark on input feel.

## E8 — the owner row

**No sim number closes an iPhone claim** (lessons rule 1). The patch seals with its platform
claim scoped to "desktop Safari 26.4 + iOS 26 simulator"; E8 device smoke on a real iPhone is
named in the record as **blocking the iOS claim**, owner-homed, with the rig URL and the
one-line steps attached.
