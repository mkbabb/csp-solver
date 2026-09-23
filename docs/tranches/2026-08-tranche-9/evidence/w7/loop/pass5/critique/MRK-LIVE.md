# Pass 5 · MRK-LIVE · adversarial critique — SITTING 1 (the returned one)

Reconstructed by the chair on 2026-09-23 from the critic's RETURN in the run journal (`wf_99b16d5b-486`, 2026-09-22 ~19:50).
The critic's own `MRK-LIVE.md` from this sitting was OVERWRITTEN on 2026-09-23 03:14 by a second sitting of the same role
that the chair's resume launched by mistake (the resume re-keyed every critic whose prompt embeds a replayed prototype);
that second sitting was killed at the stop before it returned and its file is banked beside this one as
`MRK-LIVE.sitting2-unreturned.md` (it reads 85 and believes sitting 1 died — it did not). **The family's pass-5 number is
this sitting's: 87 (ADVANCE)**; sitting 2's gaps are ADDITIVE reading for the agglomerator, never a second number.
Its instruments and logs from this sitting are the un-prefixed files under `critique/MRK-LIVE/`.

**Convergence 87 · Verdict ADVANCE**

## Open gaps (exact)

- G-LIVE-16 can't see paint. Break X1 deletes the --ring-ink declaration: the ring path computes stroke none, and ring-ON minus .focus-ring{visibility:hidden} changes 0 px in both engines (3,549 chromium / 4,764 webkit as-is), yet the whole focus-ring.spec.ts stays 16/16 green. Break X2 sets .cell-ghost.is-active opacity 0: focus vs blur paints 0 px in both engines (3,462 / 2,874 as-is), yet G-LIVE-16 stays green. Re-cut: a drawn stop counts only if the ring path's computed stroke isn't none AND the ring-ON minus ring-hidden difference exceeds N px. A board stop counts only if its ancestor opacity chain is non-zero or focus vs blur paints. Ship X1 and X2 as the negative controls in the same batch.
- G-LIVE-19's masked-default clause only scans the stylesheets one route has loaded. Break X3 plants var(--motion-note, 280ms) in the lazily loaded AnswerKeyLaminate.vue, and the row stays green in both engines. Re-cut: run the file's existing comment-stripped source walk for var(--<registered>, over every .css file and every .vue <style>, and ship X3 as its negative control. Today 0 such sites sit behind the 3 estate registrations, so no pixel moves.
- Ballot row (a) of the ring-token ballot is stated at the station minimum ('the alias fails the frame at any opacity'), not at the chair's named core median plus fraction under 3.0. On the 16x16 FRAME cell, median · worst · fraction under 3: alias@0.95 is 3.972/3.965 · 2.812/2.850 · 10% light and 3.989/3.997 · 2.436/2.404 · 10% dark. #4589d2@1.0 is 3.581 · 2.918/2.891 · 5%/6.7%. #2f68aa@1.0 is 3.28 · 3.28 · 0%. At the median every arm clears and the alias has the most headroom. At the minimum no arm clears the light frame. Restate the row with both statistics, and strike 'ABS's 3.569 is a left-side reading': 3.569 is the lane's own chromium p30 for that row, and 3.581 is its median.
- The two webkit rows isTheRing refused (#4589d2@1.0 FRAME, Δ221.5, n=30; alias@1.0 dark paper, Δ105.3) were run noise. On the critic's re-run both read TRUE (Δ0, n=60; worst 2.891 / median 3.581, and 4.286), and a reduced-motion arm reads the same numbers. Bank the re-read and replace the README's 'isTheRing refused the webkit row'.
- G-LIVE-4's reversal clause is still the silent skip `if (afterReversal.ring)`, for the third pass. Assert it strictly and add a reversal-only negative control.
- G-LIVE-17 is GREEN on the dev-mode control 74a2b5d9 in both engines, so it's a non-regression guard, not a born-RED. Its air>=0 clause has no negative control, and line 755's fixed waitForTimeout(900) for the dock slide contradicts the file header ('no clock anywhere below') and the LAWS. Poll the sheet's settled pose and add a planted-overlap control for air. Tape arm B stays the owner's, declared.
- Under forced colours .guard-btn was never read (P5-forced.log walks 7 stops without it, and ABS named deck/staging/guard). Add the armed guard to G-LIVE-21's walk.
- Crops 1/2 carry an undeclared second variable, the sun's rotation phase: the orange ink bbox is 191x196 vs 173x174 px at equal ink (17,872 vs 17,614 px). Declare it in the caption or park the rotation.
- The 'over its own fill' row (3.619 / 3.691) is the vsIn median, and the lane flags that column's sampler as unreliable (every vsIn worst reads 1.0). Re-run the row with the inward-sample guard the lane added after its run.

## Checklist hits

- gates that cannot fail: G-LIVE-16's drawn clause (a rect contains the centre) and its boardInk clause (a declared style) both stay green with 0 px painted (X1, X2, both engines)
- gates that cannot fail: G-LIVE-19's masked-default scan is route-bound CSSOM and misses a lazy SFC (X3)
- gates that cannot fail: G-LIVE-4's reversal is still behind an if (inherited, and the lane declares it)
- the constraint it forgot: the named AA statistic. The ballot's decisive sentence is a station minimum, while registry-v4 §2.4 / LAWS P4 name the core median plus fraction under 3
- unverified gestalt (minor): the crop pair has an undeclared uncontrolled variable (the sun's rotation phase)
- spec text contradicted by the file: the header says 'no clock anywhere below', but line 755 waits a fixed 900 ms for the dock settle

## Strengths

- Reproducibility is exact: all 20 chromium 16x16 paint rows and every webkit alias row re-read to the digit; my build of the lane reproduces the build-2 identity index-ts0njdC-qv3v.js / index-Bb9MlCSFpOdg.css
- π is clean at full depth: 728 nodes x 16 paint properties, lane dist vs control dist, 0 deltas / 0 px in both engines, control-vs-control 0/0. The instrument isn't blind (dev vs dist reads 1 serialisation delta)
- Both gates the pass-4 critic proved dead were re-cut with real negatives: G-LIVE-16 has a flush per stop, reads outlineStyle and walks the stranded control in-run (on HEAD the control is caught); G-LIVE-19 has a source census per name plus depth and paints 0.25s. The lane's B-breaks red
- The departure cure's estate row is real: I reproduced B4 as RED in webkit ('t+120: focus is on body, so no ring') and green in chromium, and the cure's bound is stated
- The toggle-bleed sentinel is a correct @property landing: initial 9999px is outside the publisher's < 0 domain, the geometry guard kills WebKit's 300x150 stray, and B1 reds
- The peer-cursor fallback strike is proven by the predicate: class and inline style read one map on one key
- The forced-colours deck regression was found and cured with an unlayered rule; painted 3,044 px vs control 3,053
- Every gate in the pre-return battery reads 0 on my bare re-run: prettier, lint:copy, theme-tokens, lanes, sleep, motion, test:e2e:projects, check-pw-projects, eslint ., knip, vue-tsc -b; the three unit files 53/53; filter census light = 9 in both engines; the dark census red is identical to the control's

## Re-measured by the critic

- focus-ring.spec.ts whole file on lane dev :4238: 16/16 EXIT 0 in both engines (26.5 s), reproducing the lane
- The same 16-row file on the dev-mode control 74a2b5d9 (:4236): 12 failed / 4 passed, EXIT 1. G-LIVE-17 and G-LIVE-21 are GREEN on control in both engines, so G-LIVE-17 is a guard, not a born-RED
- P5-PAINT 16x16 (payload mintSudoku(4), 102 givens), 20 rows per engine: every chromium row and every webkit alias row reproduces to the digit (alias@0.95 FRAME worst 2.812/2.850 light, 2.436/2.404 dark; median 3.972/3.965, 3.989/3.997). Webkit #4589d2@1.0 FRAME now reads isTheRing TRUE with worst 2.891 / median 3.581 (the lane's run refused it at Δ221.5). A reduced-motion (boil-parked) arm is identical on all 10 alias and #4589d2@1.0 rows per engine
- π, lane dist (my build, index-ts0njdC-qv3v.js) vs control dist index-CubiZsMVSwTc.js, every element (the lane capped at 3 per selector): 728 nodes, 0 deltas / 0 px in both engines, control-vs-control 0/0, 32 givens identical. Sensitivity: lane dev vs control dist gives 1 delta in both engines
- filter-census LIGHT on the lane dist: all green in both engines (budget 9). DARK: lane 4 failed / 8 passed = control 4 / 8, the same unclaimed svg.crayon-heart.idle saturate(0.85)
- B4 (departure cure deleted) re-run: G-LIVE-20 RED in webkit, green in chromium, reproducing the lane; restored by sha1 6611674d
- Critic's break X1 (--ring-ink deleted): ring stroke none, 0 px painted in both engines, whole spec 16/16 GREEN (the gate can't fail)
- Critic's break X2 (.cell-ghost.is-active opacity 0): focus paints 0 px in both engines, G-LIVE-16 GREEN in both
- Critic's break X3 (var(--motion-note, 280ms) in the lazy AnswerKeyLaminate.vue): G-LIVE-19 GREEN in both engines
- Pre-return battery bare on the lane: every gate 0 (lint, lint:copy, lint:theme-tokens, lint:lanes, lint:sleep, lint:motion, test:e2e:projects 35 specs/563 tests, check-pw-projects, eslint ., knip, vue-tsc -b); the three touched unit files 3/53 green

## Cross-pollination

- CTRL-FACE / CTRL-RULE / PLR-SELF (every --ring-ink consumer): an existence gate for a drawn ring must read paint. Ring-ON minus visibility:hidden is 3,549/4,764 px as-is and 0 px with the ink gone, and a rect row can't tell them apart
- MRK-ABS + the chair: the three-arm ballot is one distribution quoted at different order statistics. ABS's 3.569/3.581/3.303 are the p30/median/max of the lane's own rows; show the owner one named statistic, or both
- MOT-LADDER / MOT-VERB / PAL-WALK: a masked-default or undefined-token census must scan source (every <style>), not the CSSOM of one route. The lazy chunks (the laminate, the five posters) are invisible to a live read
- The chair's law-39 row: emulateMedia reducedMotion 'reduce' left the 16x16 paint rows unchanged, so it's a usable way to park the boil before reading the tab
- CTRL-TAPE (T9-R5): G-LIVE-17 is green on 74a2b5d9 in dev. 'Takes no tap' was never the debt; the covering is

## Notes

The critique is at /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/critique/MRK-LIVE.md. Evidence (summarised logs, the instrument copies with OUT re-pointed, the scratch configs) is under pass5/critique/MRK-LIVE/{logs,instruments}/. No crops were banked; the 80 paint rows are summarised to text and the JSON was deleted.

Setup:
- Servers: lane dev :4238, my build of the lane dist :4237 (identity reproduced), shared control dist :4239 (hash-verified index-CubiZsMVSwTc.js), dev-mode control of 74a2b5d9 :4236 with a private cacheDir (the control's git status is unchanged).
- All four were killed by recorded PID (1288, 1303, 4836, 14149); the band 4236-4239 is empty.
- The scratch dir web/frontend/.mrklive-crit/ was deleted, and every cache lived in the scratchpad.
- Every break (X1 index.css, X2 gameCell.css, X3 AnswerKeyLaminate.vue, B4 FocusRing.vue) was restored and sha1-verified. After them the work tree equals pass5.diff line for line.
- The work tree's pre-existing ignored .vite-cache (2026-09-18) isn't mine.

Number: 87, up from 84. The lane closed 13 of 15 charter rows with numbers that reproduce, re-cut both dead gates with real negatives, cured a forced-colours regression it found, and holds π, filterBudget 9, M16 and the battery. Not higher, because the design's most dangerous act (suppressing the UA outline) is still guarded by a row that can't see paint: X1 and X2 both paint 0 px and stay green. The masked-default scan is route-bound, and the owner's ballot sentence is framed at an unnamed statistic that misreads ABS's figure.

No r0 row was moved by the lane (R1 booked, law 39 cited). Nothing was committed, pushed, stashed, installed or deployed.
