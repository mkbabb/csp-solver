# PASS 6 · LANE D — ROWS FOR THE REGISTRY

Tree `abe533c4`. Full argument and transcripts: `pass6/D/D-report.md` and `pass6/D/logs/`.

## Verdict

**ADVANCE · 0 blocking · 0 major · 4 new gaps (2 of them corrections to the record I was sent
to complete).**

Five orders in, five closed. Two closed by contradicting their own source: the `§static` row's
"clean" was half wrong, and ship 1's "0.00 px" was wrong in the direction that strengthens its
own argument.

## Orders

| # | Order | Verdict | Evidence |
|---|---|---|---|
| 1 | Bank the four `§static` gates with the AUDIT prepend (D5-G4) | **CLOSED — and one of the four re-derives RED** | `logs/gate-vue-tsc.log`, `logs/gate-prettier.log`, `logs/gate-projects-supportfloor.log` |
| 2 | Bank the `lint:ink` runner verification as a transcript (D5-G5) | **CLOSED.** API pulled for both runs, local arm run, step-13 bodies diffed | `logs/lint-ink-runner-verification.log` |
| 3 | Land ship 1's margin sentence at `visual-regression.spec.ts:491` | **LANDED at :493-503, with corrected numbers** | `logs/ship1-margin-rederived.log`, `rig/ship1-margin.mjs` |
| 4 | Pre-settle 21: second reading, or print n=1 | **BOTH.** n=6 on a second instrument; the device arm stays n=1 and says so | `logs/presettle-21-second-reading.log`, `rig/presettle-census.mjs` |
| + | Evidence-policy grows the banked-dist rule (adjudication §2) | **LANDED**, born-RED, 22/22 self-test, exit-honest | `logs/gate-rule4-BORN-RED.log`, `scripts/check-evidence-policy.mjs` |

## Rows the registry should carry

**D5-G3 — CLOSES, corroborated-not-gated.** The pre-settle 21 re-derives element for element on
an independent instrument (Playwright chromium @ 393×699 dpr3, cold context, 3/3 runs, peak
21/21), including the 9 + 8 + 4 arithmetic. WebKit peaks at 20 and the missing one has a name —
`svg.sparkle-icon`, outside a shorter boot window, present in WebKit's own settled 9. **Nothing
above 21**, so the gating trigger does not fire. The real-device arm is still **n = 1** and the
record prints it as n = 1.

**D5-G4 — CLOSES, and vindicates itself.** The four gates are banked. `vue-tsc -b` is banked in
both arms because `-b` is incremental and a cached `.tsbuildinfo` would green a no-op; both exit
0. `test:e2e:projects` and `test:support-floor` are green with 7 + 7 known-bad inputs bitten.
`prettier --check src/` is clean. **`prettier --check scripts/` is RED on 7 files** — see D6-G1.

**D5-G5 — CLOSES.** Run `30734036107` / job `91460503817` / step 13 re-derives field for field
from the API; nothing was copied wrong, the pull was simply never banked. The silent self-test is
`check-ink-pressure.mjs:644`'s design, not an omission. Pass 5's forward claim settles green: the
seal run `30736604333` (`abe533c4`, job `91467698015`) carries the **ship-4 census** at step 13
and the W3 run does not.

**BC5-G2 / adjudication §2 — the policy is now a gate.** Rule 4 in
`scripts/check-evidence-policy.mjs`: a dist directory reds unless it carries a `TESTIMONY.md`
containing *testimony, artifact not banked*; a mute marker buys nothing; a `dist*.tar.gz` needs a
non-empty sibling md5. Grandfather pins are **file-count ceilings**, so re-filling a hollow bank
loosely reds.

## New gaps

| id | gap | rank | who |
|---|---|---|---|
| **D6-G1** | `prettier --check scripts/` RED on 7 pre-existing files while the pass-5 record published it clean. CI checks `src/` only, so nothing shipped broken and none are Lane D's. Estate owes a decision: format the seven, or declare `scripts/` out of format scope. | minor, record + policy | estate lint owner |
| **D6-G2** | Ship 1's healthy-pose headroom is **−0.02px**, not 0.00; `demanded` at the suite's own 1280 width is **54.05**, not 54.38 (54.38 is a 1440 reading — `labelH` tracks the viewport, the headroom does not). Corrected in the landed comment; the older `:489` comment keeps its figure with the mismatch named. | minor, corrected in place | closed here |
| **D6-G3** | `web/frontend/dist` was left holding pass 5's **ablate** build (`md5 8cfd2f49…` = `dist-p5ablate`). Any lane measuring via `npm run preview` without rebuilding measured an ablation and called it HEAD. Class, not incident — the shared build dir has no owner and no stamp. | **major, cross-lane** | agglomerator / all rig-running lanes |
| **D6-G4** | Adjudication §2 says "all 23 banked `dist-*` directories"; the filesystem holds **29 banks, 25 hollow + 4 full**. Corrected inside `GRANDFATHERED_DISTS` with both blocks labelled; the ruling's text wants a restamp beside its number. | minor, another author's file | adjudicator |

## Discipline

- **Born-RED** honoured: rule 4 red against a real hollow bank before the grandfather list quiets
  it, then green, then probed adversarially for exit honesty (self-test green + estate red → exit
  1).
- **π/golden**: no golden minted, re-minted, re-baselined or touched. No screenshot banked at all
  — every figure is a number.
- **W3 floors** re-run after the estate change: a11y **30/30** both engines, options 5/5, k-peek
  and `guardTitle` inside it; `visual-regression.spec.ts` **24/24** both engines.
- **Source diff**: `e2e/visual-regression.spec.ts` comment lines only (non-comment diff **empty**,
  verified) and `scripts/check-evidence-policy.mjs`. Nothing else in the tree was touched — the
  three other modified files at fold time are another lane's.
- **Ports**: this lane served its own build on **4245** and killed it at close. It never wrote to
  `web/frontend/dist`.
- **U-10**: no design mark is closed here. Gate and record rows only.
