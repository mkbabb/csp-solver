# MOT-LADDER · pass 7 prototype

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`, base `74a2b5d9`. Pass 7 is gate-only: 5 files changed, 0 served bytes moved. The dist is `index-ICe9_X4WHUBR.js` / `index-DZBxfh4CjCIq.css` (44 files), identical to the pass-6 identity. No lawful pair was made, no crop was banked, and nothing was retired.

## Numbers

- Bank: tree `cb17b5f3` is handed to VERB. Cumulative diff 511,872 B, sha1 `1ee1d51d`, 59 files +9367/−287. Delta from `3d25f02a`: 111,638 B, sha1 `2727622e`, 5 files +2194/−93. Details are in BANKED.txt.
- `git apply --check`: cumulative on `74a2b5d9` = 0; delta on `74a2b5d9 + s13-s7-s3.diff` = 0. Both routes write `cb17b5f3`.
- `lint:bands` on the tree, D0 (base reachable): 0. Self-test: 0, with 91 RED as they must be, 18 HELD, 0 vacuous, 0 crashed.
- `lint:bands` on the integrated tree (s13-s7-s3 + delta): exits 1 with B13 at 4. Those 4 are the fold's own sites: DifficultyTally ×2, GameBoard `refusalHoldBeats*beatMs` = 3000, MarginNote `settleAfterBeats*beatMs` = 1000. With `instruments/fold-b13-rows.PROPOSED.diff` it exits 0, and the self-test there also exits 0 (91 RED, 0 vacuous).
- Break battery: `instruments/break7.py`, 46 plants, through CI's exact `npm run lint:bands` → see `run5` below.
- Pre-return, tree / control (`74a2b5d9`): lint:bands 0/1 · lint:verbs 0/1 · lint:motion 0/0 · lint:copy 0/0 · lint:lanes 0/0 · lint:theme-tokens 0/0 · lint:sleep 0/0 · test:e2e:projects 0/0 · check-pw-projects 0/0 · check-property-block (source+dist) 0/0 · its self-test 0/0 · undefined-token census self-test 0/1 · eslint . 0/0 · npm run lint 0/0 · lint:knip 0/0. Re-run on the final sha for eslint, knip, lanes and lint: all 0.
- vue-tsc -b ran on a git archive at `af841a92`: exit 0. Only `.mjs` changed after that.
- vitest: 69 files, 837 tests, 0 failed.
- Specs on the served tree (:4246 preview of the build): ladder-prm ×4 + live-fit-ablation GC1, chromium + webkit, 10/10 green. The same specs against the control (:4239, `index-CubiZsMVSwTc.js`): 10/10 RED. That is the born-RED control.
- check-property-block on the served tree :4246: GREEN, 49 registrations. Control served: GREEN.
- Bundle, control → merged §13 tree: raw 524,594 → 531,790 (+7,196); gzip 172,954 → 175,096 (+2,142). This is row 12 re-derived; pass 6 claimed +6,644/+1,979. Pass 7 itself: +0/+0.
- Box load during the specs was 65–192. The control spec run was at 145→100 with 224 node processes on the box.

## Gaps (first)

- Row 1: the five spellings red on bands only. Beside them, verbs = 0, contract = 1, tokens = 0. The census exit is not wired. verbs/tokens are other gates' rows.
- Row 8: INTAKE-23 rows 17 and 19 have their gate halves landed (T1/T2/T3/T5/T9/T10 red). The homes and the single publisher are NOT unified in product code, so both stay OPEN.
- Row 9: row 15's fallback made a row is OPEN. The π key on ≥2 poses is not re-cut (GC1 covers one pose).
- Row 7: four KEYWORD_TWINS are awaiting the chair's row or their strike: starTuck, starFade, prmLinear, verb-dusk-ease. Only prmFade carries a row (pass6/CHAIR-RULINGS §1.4).
- Row 10: T9-B27 is numbers-only. The reason: pass 7 moves 0 served bytes, so there is no pair to frame. The number also collides: INTAKE-23 gives T9-B27 to M22 (TAB-PEN); this charter and registry-v6 give it to the ratchet.
- B13 misses arithmetic split across a line (`/ 4` on its own line after a wrapped call).
- A dead class STRING that keeps the old class "carried" still defeats the subject binding (X7″, untested).
- The CI step that fetches by SHA (`git fetch --depth=1 origin 74a2b5d9…`) is unverified in CI. A git-less archive (D1) is RED by design, so critics must run with GIT_DIR.
- `knip.json` names `scripts/shape-census.mjs` as an entry. That is the chair's row to ratify.

## Rows closed

1. B8 reads by value. Keywords are case-folded, var() fallbacks and referents are evaluated, identity `linear()` maps to `linear`, and longhands are read beside shorthands, both CSS and script writes, @theme included. X2a–X2e and T6/T7 are red. The house `linear()` NEG-NEG holds.
2. B1 checks shape. An escape row with a list, or an admission with a scalar, is red (T8). A DELETED row no longer crashes. The whole check list runs under every class with 0 crashes.
3. MOVED and DELETED rows bind to their subject's consumers: template, script, and Transition `:name` including a computed one, on the tree and at base. X7, X7′ and X1 are red. Real deletion and Transition-sibling NEG-NEGs hold.
4. There is no BASE_REF fallback. The floor is re-derived off `74a2b5d9`, and a missing base is RED. ci.yml fetches the one commit. A2 is re-cut on a synthetic bank (A2c red, D0 and D1).
5. TS clocks are banked (`ts`, 22 clocks). B6 section 4 is the ratchet (T4 red, T4ok lawful, T4n red). B13 values arithmetic at the consumer (X4, X5, T11, T12 red). This also covers INTAKE-23 row 18.
6. `liveFitLaw` reds `max()` and a fallback (X3, X3ctl) across css/vue/ts/html.
11. Both applies exit 0. The bank is written before VERB, and the handed sha is `cb17b5f3`.

## Replay route

In place: the pass-6 diff was already on the tree, so nothing was replayed. `git diff --stat` + untracked = 57 files +7265, which equals BANKED `3d25f02a` (reproduced via a temp index).

## Incidents

- An early write went outside scratch: `/tmp/x_bank_files`.
- The first served check-property-block run read the worktree's stale `dist/` (`index-DWMUHdQr1EaZ.js`) and went RED STAMP. It was re-run with `--dist`.
- Battery runs 1 and 3 were killed by PID (26737, 5468). Run 4 ran on a sha where the tree itself was red (B13 on usePathAnimation), so its reds are not evidence. Run 5 is the record.
- The chair's library had two eslint errors, fixed value-preservingly. equiv.mjs compared 1390 values with 0 differences; the copy adds @theme (33 rules, 61 tokens).

## Proposed (never applied)

- `instruments/fold-b13-rows.PROPOSED.diff`: four ADMITTED_ARITH rows for the integrated tree.
- `instruments/R6-moved-rows.PROPOSED.diff`: R6 law 4, whose line gains TS clocks and B13.
