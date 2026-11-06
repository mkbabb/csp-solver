# Homes v3: the chair's fold at batch 0's close

The non-author check (`CHECK.md`, sha1 `728a3957`) returned `reproduced: false` for one reason only: WebKit rows the machine-wide lock never reached. Nothing that ran failed. Both conditional folds reproduced in both engines on a non-author tree (CHECK.md §6c), so they meet their rulings' condition by batch 0's close and fold:

- **Pick 10 · B-ROSTER** (`struck-10.diff` `4f5effd2`): edge-bands self-test exit 0 in chromium and WebKit, sabotage 11/11 in each (drawn off exits 3), thickTol and a typed thick refused in both themes, DPRs and engines; tray-well exits 1 on control and tree in both engines with equal verdicts. FOLDED (CHAIR-RULINGS 10).
- **Pick 18 · stale-rebase + seek plant** (`struck-18.diff` `184553a1`): postpaint self-test exit 0 in both engines, U6 (a seek between frame 1's read and its post read) as planted, sabotage 7/7 in each; served GA1 exits 1 on control and tree in both engines. FOLDED (CHAIR-RULINGS 18). GA1 itself stays open on VERB's banked record.

## The bank, re-cut

| file | sha1 | bytes | takes |
|---|---|---|---|
| `homes.diff` | `07257854047e9345962d11473df3fab75a42a9c2` | 531,611 | `74a2b5d9` → homes v3 with both folds (13 paths) |
| `homes.on-WAVE.diff` | `0723d5085bb55d245158723f8d6a854a2526044f` | 139,131 | homes v2 → v3 with both folds, on the WAVE, s10 and s13-s7-s3 (10 paths) |
| `homes.pre-fold.diff` | `be9a5af6ffa383f67c2bb5f2b9005cd20f17c8f0` | 513,021 | the lane's bank, before the fold (README §1) |
| `homes.on-WAVE.pre-fold.diff` | `88b48d946e4975131b5d01684e8c473addaa8840` | 110,429 | the lane's on-WAVE step, before the fold |

Route: fresh `git archive` scratches, each `git init`-ed. `homes.diff` = `74a2b5d9` + pre-fold + struck-10 + struck-18, cut through a temporary index (tree `243fbf57` → `7e0d4236`). `homes.on-WAVE.diff` = `74a2b5d9` + pass-9 `WAVE.diff` (`044284b5`) + on-WAVE pre-fold + both struck diffs (`72b7ad67`). The 13 home paths are blob-equal on both results. `apply --check` exits 0 for `homes.diff` on `74a2b5d9` and `1d0dc4fd`, and for `homes.on-WAVE.diff` on `74a2b5d9` + s10 and + s13-s7-s3 (pass 9's integrate diffs).

## The rows still owed

The fold touches only `edge-bands` and `postpaint`. `glyph-pop`, `rest-probes` and `paint-lib` are byte-equal between the pre-fold and folded trees, so their WebKit reads on the pre-fold bank carry. Every library self-test and sabotage battery is read in both engines on the folded bytes. Still UNREAD in WebKit, queued by the chair behind the machine-wide lock (`.claude/t9-scratch/work/pass10/chair-fold/bat/replay-folded.sh`, `STEPS=banked:webkit`, exits under `bat/webkit-folded/`): postpaint `--sampler-only --reps 16`, and the served glyph, edge and rest rows on control and tree. The chair rules they do not gate batch 1: every row they would exercise is already green in chromium on the same bytes, and the WAVE integrator reads the WebKit column whole. A red among them is a homes row owed at the WAVE.

**Read 2026-11-02, chain done 17:02:19** (WebKit, folded bytes; control `:4256` `index-CubiZsMVSwTc.js`, tree `:4233` `index-BOytrTnLSO5X.js`, both 200 before each served row): postpaint `--sampler-only --reps 16` exit 0. Served, control / tree: glyph 0 / 0 (plants HEAD12, MID20, COMB, EMPTY each RED as planted), edge `.drawer-case` 1 / 1 (the same band reading on both, which matches chromium's 1 / 1), rest touch 0 / 0 (GREEN, one toggle). The verdicts are equal between control and tree in every row. Nothing is owed. The chair's two preview servers were stopped by recorded PID at the chain's end.
