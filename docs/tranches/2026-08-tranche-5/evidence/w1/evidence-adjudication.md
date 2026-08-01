# T5-W1 row 1.3 — the EVIDENCE-POLICY adjudication

**Once only.** Every breach in the estate at `f38c5130`, disposed of crop-or-grandfather, in one table. The gate that found them is `scripts/check-evidence-policy.mjs`; the RED that opened this row is `evidence-policy-RED.txt`; the GREEN that closes it is `evidence-policy-GREEN.txt`. Nothing here is a re-run of the audit—it's the disposition.

## 1 · What the gate enforces, and why it didn't exist

`docs/tranches/EVIDENCE-POLICY.md:13` promised an enforcer in so many words: *"The gate greps the wave's evidence dir for `*.png`, sums bytes, and fails on breach."* Nothing did. `check-golden-bytes.mjs` implements the *number*—`PER_IMAGE_CEILING = 150 * 1024`, cited to the policy at its own `:22`—against `web/frontend/e2e/goldens`, which is the one directory `EVIDENCE-POLICY.md:12` explicitly carves **out** of the wave budget. That near-miss is why the hole read as covered for a whole tranche (r2 §2 hunted it as the refutation and it didn't hold).

Three rules, each straight off the policy text, with the byte figures pinned by `gates.json` → `W1.evidencePolicy`:

| rule | limit | policy line |
|---|---|---|
| per-image | ≤ 153,600 B | `:10` "Per-image cap: ≤150 KB" |
| per-wave | ≤ 2,097,152 B | `:11` "Per-wave cap: ≤2 MB of images" |
| name ban | `/-full\.png$/` | `:9` "Crops, never full viewports" |

Two definitions the policy leaves implicit and the gate has to make explicit:

- **A wave** is the bucket the per-wave cap sums over: the directory one level under the nearest `evidence/` segment. `.../evidence/w12` therefore owns its `captures/` subtree, and `.../evidence/w10` is its own bucket. Evidence predating the `evidence/` convention (the grand uplift's `artifacts/`) buckets at `<tranche>/<top-subdir>`. This yields 26 buckets over 290 images.
- **Enumeration is a filesystem walk**, not `git ls-files`. The policy's own wording is "greps the wave's evidence dir"; a CI checkout materialises exactly the tracked set, so the two agree there (verified: 290 on disk, 290 tracked); and locally the walk additionally catches a stray uncommitted capture *before* it can be committed. Goldens need no carve-out—they live at `web/frontend/e2e/goldens`, outside the scope entirely.

## 2 · The RED at HEAD

`node scripts/check-evidence-policy.mjs --self-test` at `f38c5130`, both grandfather lists empty: **73 breaches**—64 over-cap images, 5 over-cap waves, 4 banned `-full.png` names. Per tranche:

| tranche | sealed | png | total B | >150 KiB | `-full.png` | waves >2 MiB |
|---|---|---|---|---|---|---|
| 2026-07-grand-uplift | 2026-07-06 | 10 | 1,766,419 | 6 | 0 | 0 |
| 2026-07-tranche-2 | 2026-07-10 (`3b75eca2`) | 17 | 4,475,741 | 13 | 0 | 1 |
| 2026-07-tranche-3 | 2026-07-12 (`bbeb2b87`) | 88 | 7,574,195 | 14 | 0 | 1 |
| 2026-07-tranche-4 | 2026-07-15 (`aa77860e`), P1 2026-07-31 (`6800af04`) | 175 | 16,085,672 | 31 | 4 | 3 |
| **2026-08-tranche-5** | **live** | **0** | **0** | **0** | **0** | **0** |
| ESTATE | — | 290 | 29,902,027 | 64 | 4 | 5 |

A3 was raised at tranche-4's scope and said 31 images / 3 waves. Re-derived at citation: **31 and 3, to the file.** At the gate's ordered scope—`docs/tranches/**`, per row 1.3—the estate carries 64 and 5; the extra 33 images and 2 waves are the three pre-tranche-4 tranches, which predate the policy's ratification (T4-W0, ballot B1) rather than violating it.

## 3 · The adjudication rule, and what it produced

The rule the wave spec fixed before any file was inspected: **sealed-tranche (2026-06 / 2026-07) evidence defaults to GRANDFATHER—sealed records keep their artifacts; T5-era breaches get cropped for real.**

Applied: **73 GRANDFATHER, 0 CROP.** Not because grandfathering is generous—because every breaching file is in a tranche that was authored, gated and sealed before an enforcer existed, and `2026-08-tranche-5` carries zero images at this HEAD. You don't re-cut a closed tranche's evidence to satisfy a gate written after it closed; the recapture is impossible (the app has changed under it) and a re-encode would be a new artifact wearing a sealed record's filename.

The crop arm is therefore **untested by this table and live from here on**. The first images it will meet are row 1.6's forced-blank canary bitmaps, which the wave spec already binds to ≤150 KB crops under this gate—the wave eats its own cooking. Arms A and B of the live-estate canary in `evidence-policy-GREEN.txt` prove the arm fires: a 200,000 B capture and a 2,048 B `*-full.png` planted in `2026-08-tranche-5/evidence/w1/` each red the gate with the full grandfather list loaded.

## 4 · The 64 images

Ranked by bytes. Every disposition is `GRANDFATHER @ <exact bytes at f38c5130>`—a **ceiling**, not a blanket (§6).

| # | path (under `docs/tranches/`) | rule | bytes | ×cap | disposition |
|---|---|---|---|---|---|
| 1 | `2026-07-tranche-3/evidence/addendum/d1-shots/solved-1440-prm.png` | per-image | 574,907 | 3.74x | GRANDFATHER @ 574,907 |
| 2 | `2026-07-tranche-3/evidence/T3-W12-gate/shots/gate-completion-solved-1440x806.png` | per-image | 544,847 | 3.55x | GRANDFATHER @ 544,847 |
| 3 | `2026-07-tranche-3/evidence/addendum/d1-shots/corner-1100-v2.png` | per-image | 532,971 | 3.47x | GRANDFATHER @ 532,971 |
| 4 | `2026-07-tranche-3/evidence/addendum/a1-completion-live.png` | per-image | 531,066 | 3.46x | GRANDFATHER @ 531,066 |
| 5 | `2026-07-tranche-3/evidence/w13/b1-idle.png` | per-image | 495,086 | 3.22x | GRANDFATHER @ 495,086 |
| 6 | `2026-07-tranche-3/evidence/addendum/a1-solved-1440.png` | per-image | 493,775 | 3.21x | GRANDFATHER @ 493,775 |
| 7 | `2026-07-tranche-2/evidence/pass2/p4-shots/07-board-16x16.png` | per-image | 455,779 | 2.97x | GRANDFATHER @ 455,779 |
| 8 | `2026-07-tranche-3/evidence/w13/b4-close-midglide.png` | per-image | 445,286 | 2.90x | GRANDFATHER @ 445,286 |
| 9 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/05-sudoku-9x9-peek-dark.png` | per-image | 438,431 | 2.85x | GRANDFATHER @ 438,431 |
| 10 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/01-sudoku-9x9-peek-light.png` | per-image | 417,722 | 2.72x | GRANDFATHER @ 417,722 |
| 11 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/03-after-entry.png` | per-image | 410,199 | 2.67x | GRANDFATHER @ 410,199 |
| 12 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/04-unsat-conflict.png` | per-image | 384,708 | 2.50x | GRANDFATHER @ 384,708 |
| 13 | `2026-07-tranche-4/evidence/w13/killer-furniture-face.png` | per-image | 375,931 | 2.45x | GRANDFATHER @ 375,931 |
| 14 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/08-futoshiki-6x6-peek-dark.png` | per-image | 321,080 | 2.09x | GRANDFATHER @ 321,080 |
| 15 | `2026-07-tranche-4/evidence/w10/parity-sudoku-dark-full-2.png` | per-image | 310,453 | 2.02x | GRANDFATHER @ 310,453 |
| 16 | `2026-07-tranche-4/evidence/w10/parity-sudoku-dark-full.png` | per-image + name-ban | 310,415 | 2.02x | GRANDFATHER @ 310,415 |
| 17 | `2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/07-futoshiki-6x6-peek-light.png` | per-image | 296,948 | 1.93x | GRANDFATHER @ 296,948 |
| 18 | `2026-07-grand-uplift/artifacts/union-screenshots/composite-peek-light.png` | per-image | 295,245 | 1.92x | GRANDFATHER @ 295,245 |
| 19 | `2026-07-tranche-4/evidence/w10/parity-sudoku-light-full-2.png` | per-image | 293,016 | 1.91x | GRANDFATHER @ 293,016 |
| 20 | `2026-07-tranche-4/evidence/w10/parity-sudoku-light-full.png` | per-image + name-ban | 292,795 | 1.91x | GRANDFATHER @ 292,795 |
| 21 | `2026-07-tranche-2/evidence/pass2/p3-shots/mid-before-t1400.png` | per-image | 291,443 | 1.90x | GRANDFATHER @ 291,443 |
| 22 | `2026-07-tranche-2/evidence/pass2/p3-shots/mid-after-t1400.png` | per-image | 283,564 | 1.85x | GRANDFATHER @ 283,564 |
| 23 | `2026-07-tranche-4/evidence/w10/parity-futoshiki-dark-full-2.png` | per-image | 271,175 | 1.77x | GRANDFATHER @ 271,175 |
| 24 | `2026-07-tranche-4/evidence/w10/parity-futoshiki-dark-full.png` | per-image + name-ban | 271,130 | 1.77x | GRANDFATHER @ 271,130 |
| 25 | `2026-07-grand-uplift/artifacts/union-screenshots/motion-strip-laminate.png` | per-image | 270,342 | 1.76x | GRANDFATHER @ 270,342 |
| 26 | `2026-07-tranche-4/evidence/w10/parity-futoshiki-light-full-2.png` | per-image | 263,044 | 1.71x | GRANDFATHER @ 263,044 |
| 27 | `2026-07-grand-uplift/artifacts/union-screenshots/composite-peek-dark.png` | per-image | 263,006 | 1.71x | GRANDFATHER @ 263,006 |
| 28 | `2026-07-tranche-4/evidence/w10/parity-futoshiki-light-full.png` | per-image + name-ban | 262,711 | 1.71x | GRANDFATHER @ 262,711 |
| 29 | `2026-07-tranche-3/evidence/T3-WGATE-shots/live-solved-light.png` | per-image | 259,291 | 1.69x | GRANDFATHER @ 259,291 |
| 30 | `2026-07-tranche-3/evidence/T3-WGATE-shots/live-solved-dark.png` | per-image | 255,195 | 1.66x | GRANDFATHER @ 255,195 |
| 31 | `2026-07-tranche-4/evidence/w13/kenken-furniture-face.png` | per-image | 247,626 | 1.61x | GRANDFATHER @ 247,626 |
| 32 | `2026-07-tranche-4/evidence/w9/p2-ungraded-16x16-sudoku-board.png` | per-image | 244,611 | 1.59x | GRANDFATHER @ 244,611 |
| 33 | `2026-07-tranche-2/evidence/pass2/p4-shots/05-board-9x9-dark.png` | per-image | 243,726 | 1.59x | GRANDFATHER @ 243,726 |
| 34 | `2026-07-grand-uplift/artifacts/union-screenshots/composite-idle-light.png` | per-image | 234,376 | 1.53x | GRANDFATHER @ 234,376 |
| 35 | `2026-07-tranche-2/evidence/pass2/p4-shots/03-after-entry.png` | per-image | 225,364 | 1.47x | GRANDFATHER @ 225,364 |
| 36 | `2026-07-tranche-2/evidence/pass2/p4-shots/01-board-9x9-light.png` | per-image | 222,461 | 1.45x | GRANDFATHER @ 222,461 |
| 37 | `2026-07-tranche-3/evidence/T3-W11-gate/gate-failed-maroon-beat.png` | per-image | 217,004 | 1.41x | GRANDFATHER @ 217,004 |
| 38 | `2026-07-grand-uplift/artifacts/union-screenshots/composite-idle-dark.png` | per-image | 215,429 | 1.40x | GRANDFATHER @ 215,429 |
| 39 | `2026-07-tranche-4/evidence/w9/p2-tier1-sudoku-board.png` | per-image | 215,071 | 1.40x | GRANDFATHER @ 215,071 |
| 40 | `2026-07-tranche-4/evidence/w12/captures/gallery-settled-dark.png` | per-image | 211,976 | 1.38x | GRANDFATHER @ 211,976 |
| 41 | `2026-07-tranche-3/evidence/T3-W9-gate/probe5-solved-row-light.png` | per-image | 211,805 | 1.38x | GRANDFATHER @ 211,805 |
| 42 | `2026-07-tranche-4/evidence/w12/captures/gallery-settled.png` | per-image | 205,105 | 1.34x | GRANDFATHER @ 205,105 |
| 43 | `2026-07-tranche-3/evidence/T3-W9-gate/prm-solved-instant.png` | per-image | 204,339 | 1.33x | GRANDFATHER @ 204,339 |
| 44 | `2026-07-tranche-4/evidence/w12/captures/gallery-prm.png` | per-image | 203,254 | 1.32x | GRANDFATHER @ 203,254 |
| 45 | `2026-07-tranche-4/evidence/w12/captures/gallery-focus-ring.png` | per-image | 202,373 | 1.32x | GRANDFATHER @ 202,373 |
| 46 | `2026-07-tranche-3/evidence/T3-W9-gate/heart-crest-dark.png` | per-image | 202,344 | 1.32x | GRANDFATHER @ 202,344 |
| 47 | `2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/webkit-dark/board-1x.png` | per-image | 201,420 | 1.31x | GRANDFATHER @ 201,420 |
| 48 | `2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/webkit-light/board-1x.png` | per-image | 193,494 | 1.26x | GRANDFATHER @ 193,494 |
| 49 | `2026-07-tranche-4/evidence/w10/reflow-320-sudoku-dark.png` | per-image | 190,250 | 1.24x | GRANDFATHER @ 190,250 |
| 50 | `2026-07-tranche-4/evidence/w13/thermo-furniture-face.png` | per-image | 188,870 | 1.23x | GRANDFATHER @ 188,870 |
| 51 | `2026-07-tranche-3/evidence/T3-W9-gate/failure-red-graphite-zero-gold.png` | per-image | 188,597 | 1.23x | GRANDFATHER @ 188,597 |
| 52 | `2026-07-tranche-4/evidence/w13/j1-killer-inapp-dark.png` | per-image | 186,763 | 1.22x | GRANDFATHER @ 186,763 |
| 53 | `2026-07-tranche-4/evidence/w9/p2-tier2-sudoku-board.png` | per-image | 185,710 | 1.21x | GRANDFATHER @ 185,710 |
| 54 | `2026-07-tranche-2/evidence/pass2/p4-shots/04-unsat-conflict.png` | per-image | 184,801 | 1.20x | GRANDFATHER @ 184,801 |
| 55 | `2026-07-tranche-4/evidence/w9/p2-beyond-sudoku-board.png` | per-image | 176,214 | 1.15x | GRANDFATHER @ 176,214 |
| 56 | `2026-07-tranche-4/evidence/w8/crops/pi-collision-peek.png` | per-image | 175,123 | 1.14x | GRANDFATHER @ 175,123 |
| 57 | `2026-07-tranche-4/evidence/w13/jv-killer-inapp-dark.png` | per-image | 169,687 | 1.10x | GRANDFATHER @ 169,687 |
| 58 | `2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/chromium-dark/board-1x.png` | per-image | 167,881 | 1.09x | GRANDFATHER @ 167,881 |
| 59 | `2026-07-tranche-4/evidence/w13/j1-killer-inapp-light.png` | per-image | 166,974 | 1.09x | GRANDFATHER @ 166,974 |
| 60 | `2026-07-tranche-4/evidence/w13/j1-gallery-5cards-thermo-fold.png` | per-image | 166,283 | 1.08x | GRANDFATHER @ 166,283 |
| 61 | `2026-07-tranche-4/evidence/w13/jv-gallery-5cards-thermo-fold.png` | per-image | 165,448 | 1.08x | GRANDFATHER @ 165,448 |
| 62 | `2026-07-grand-uplift/artifacts/union-screenshots/union-dark-held-board.png` | per-image | 164,059 | 1.07x | GRANDFATHER @ 164,059 |
| 63 | `2026-07-tranche-4/evidence/w10/reflow-320-futoshiki-dark.png` | per-image | 161,256 | 1.05x | GRANDFATHER @ 161,256 |
| 64 | `2026-07-tranche-4/evidence/w10/forcedcolors-fullpage-light.png` | per-image | 153,762 | 1.00x | GRANDFATHER @ 153,762 |

Four of those rows carry `per-image + name-ban`: the w10 parity quartet, whose filenames literally end `-full.png`—the violation `EVIDENCE-POLICY.md:9` names by hand. Their `-full-2.png` siblings (rows 15, 19, 23, 26) are the same capture re-shot and escape the name regex on the `-2` suffix; the per-image cap catches all four anyway, which is why the ordered pattern is left exactly as `/-full\.png$/` and not widened. Noted rather than fixed: widening a name rule to catch files the byte rule already catches buys nothing and invents a second spelling of the same law.

Row 64 (`forcedcolors-fullpage-light.png`, 153,762 B) clears the cap by 162 bytes. It is grandfathered like the rest—but it is also the cheapest illustration of why the cap is a *cap*: a genuine crop of the pixels under audit isn't within a rounding error of 150 KB, it's a fifth of it.

## 5 · The 5 waves

| # | wave bucket (under `docs/tranches/`) | rule | bytes | ×cap | disposition |
|---|---|---|---|---|---|
| W1 | `2026-07-tranche-4/evidence/w12` | per-wave | 4,324,819 | 2.06x | GRANDFATHER @ 4,324,819 |
| W2 | `2026-07-tranche-4/evidence/w10` | per-wave | 4,236,208 | 2.02x | GRANDFATHER @ 4,236,208 |
| W3 | `2026-07-tranche-4/evidence/w13` | per-wave | 2,583,004 | 1.23x | GRANDFATHER @ 2,583,004 |
| W4 | `2026-07-tranche-3/evidence/addendum` | per-wave | 2,564,266 | 1.22x | GRANDFATHER @ 2,564,266 |
| W5 | `2026-07-tranche-2/evidence/execution` | per-wave | 2,467,705 | 1.18x | GRANDFATHER @ 2,467,705 |

`2026-07-tranche-4/evidence/w9` sits at 1,696,948 B—under the cap, ungrandfathered, and now gated like any live wave. Twenty of the 26 buckets are under half the cap.

## 6 · What the grandfather is NOT

A blanket exemption would have converted a 73-breach RED into a permanently blind gate. The encoding refuses that in three ways, all of them mechanical:

1. **Every entry is a byte ceiling.** `['path', 574907]` exempts that path *while it stays at or under 574,907 B*. A grandfathered file that grows reds as `grandfather-image`. The sealed estate may only shrink.
2. **Wave pins are ceilings too.** A new image dropped into `w13` pushes the bucket past its 2,583,004 B pin and reds as `grandfather-wave`—proved live, not asserted: canary arm C in `evidence-policy-GREEN.txt` plants 1,024 B in `w13` and the gate reports `2,584,028 B > 2,583,004 B`.
3. **Additions are forbidden in the script itself.** The comment above `GRANDFATHERED_IMAGES` says so in those words, with the reasoning: if your new evidence breaches a cap the cure is a crop, not a line. Removing an entry because the file was pruned is fine, and the gate prints a `NOTICE stale pin` naming any entry that no longer matches anything on disk, so the list can't quietly rot.

Falsifiability is wired into the normal invocation rather than left to a one-time canary. `--self-test` runs nine cases against a synthetic estate before the real audit and exits 1 if any of them fails to behave: each of the three rules fires on a known-bad input; a policy-conformant estate reds nowhere (the anti-vacuity control—an instrument that reds on everything is not a gate); a pin exempts the file it names; a pin exceeded reds; a wave pin exceeded reds; a pin naming nothing is reported stale; and an absent scope dir *throws* rather than reading as a clean estate, so a moved script or a renamed docs tree can't green forever on zero files. CI passes the flag, so a green from this gate is never a green from a broken instrument.

That last case closes the failure mode `check-golden-bytes.mjs:44-52` still carries by design—zero images prints "nothing to police" and exits 0 (r1 #30, "announced vacuity"). Here the distinction is drawn where it belongs: zero images under an *existing* scope dir is a genuine pass (maximally text-first evidence is the policy's own ideal); a *missing* scope dir is a broken instrument and reds.

## 7 · Standing, not closed

- **A deliberate prune is a separate act.** T4-W0 already ran one (302 orphans, 55.45 MB, survivors chosen by "referenced by a tracked text file"). This row was ordered crop-or-grandfather, not prune-again, and 28.5 MB of sealed PNG remains tracked. If the estate is ever re-pruned, these 64 pins go stale in one run and the gate will name every one of them.
- **The gate polices bytes and names, not judgement.** "An image standing in for text" (`EVIDENCE-POLICY.md:13`) is a reviewer's call; no regex sees it. The caps make the lazy version expensive, which is the whole mechanism the policy was reaching for.
- **`-full-N.png` is left to the byte rule** (§4). Booked here so the next reader doesn't mistake the narrow regex for an oversight.
