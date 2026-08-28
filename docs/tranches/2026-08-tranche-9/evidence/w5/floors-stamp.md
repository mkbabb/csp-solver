# T9-W5 §5.2 — FLOORS THAT RESTAMP (family F1)

Measured on darwin at `4dd9ec9c`, 2026-08-25; **re-cut whole on 2026-08-28** after a
session wall killed the first attempt mid-flight. The re-cut is not a re-reading of the
old logs — every census was re-measured, every canary re-planted in the real tree, and
both restamp arms were run through the WRITE path. It landed on the same numbers, so the
figures below stand as measured rather than as inherited. The working tree carried three
concurrent waves' edits when the census was taken; §4 says exactly which, and why the band
absorbs them.

Logs, all with bare exit codes:

- `floors-born-red.txt` — both gates RED at HEAD, before the cure
- `restamp-divergence.txt` — the restamp arm's true defect, reproduced and cured
- `floors-canaries.txt` — eight planted defects, the green control, the round-trip proof
- `floors-postwall-reverify.txt` — **the record of record**: the whole lane re-executed
  post-wall in one pass (census, both self-tests, 11 real-tree canaries, the row-by-row
  round-trip with its own negative control, the non-dry write path, the byte-for-byte
  restoration)

## 1 · One stamp

`web/frontend/scripts/census.stamp.json` is the only home for a count floor in the
frontend estate. `check-unit-count.mjs` and `check-pw-projects.mjs` read it; neither
carries a number of its own. The audit found the unit floor written three ways at once
(script 434 / gates.json 300 / ci.yml prose "300 … live is 477 today") — three documents,
three numbers, and no way to look up which one the lane enforced. The stamp carries, per
row, the census it was cut from, the floor derived from it, and the sha/date/wave that cut
it.

The split cannot re-open: check 8 REDs if a `floor` key reappears in `CONFIGS`, if a
declared project has no stamp row, or if the stamp carries a row no config declares
(canary 8 in the post-wall log, and four sabotages in `--self-test`).

**The split is closed two-thirds, not whole, and the remainder is a handoff.**
`.github/workflows/ci.yml` still carries the third home in COMMENT prose — line ~55
(">=300 executed count floor") and lines ~919-922 ("300 was ~10% under 332 at the T5-W1
wave base; live is 477 today, so the floor carries 59% of slack"). The floor is 661 and
live is 735, so both figures are dead. ci.yml sits outside this lane's fence, so the rows
are named here and in the stamp's own `_ci_prose` key rather than silently left to look
cured. Nothing executable reads them: the step runs `npm run test:unit:count`, which reads
the stamp. The residue is a lying comment, not a second enforcement path — but a lying
comment is exactly what the audit found three of, so it is booked, not waved through.

## 2 · The band

    floor >= ceil(0.85 * max(stampedCensus, live))

Held against whichever is higher — the stamp or what the tree resolves right now — so it
REDs in both directions:

| the defect | how it reds |
| --- | --- |
| a floor hand-lowered under the band | `floor < ceil(0.85 × census)` |
| a census stamped above the tree | `max()` takes the inflated stamp, floor falls short |
| the estate grows past its floor, unrestamped | `max()` takes live, floor falls short |

0.85 buys ~17.6% of growth room before a restamp is compulsory, which is what makes the
W6 floor-timing law executable rather than advisory: the mechanism lands in the wave, the
WGATE restamps, and the band is what forces the WGATE's hand if the estate has moved.

Before this arm, a floor could only see the estate SHRINK. 434 against 735 executed, and
115 against 221 resolved, were unanimous greens.

## 3 · The restamp arm's true defect

V4's finding, reproduced bare at HEAD: `--restamp --dry` derived **12** on both
theme-quadrants projects where the gate resolved **14**, read its own derivation as a
LOWERING, and exited 1. No test had left. The arm could not run at any WGATE without an
`--allow-lower` claiming tests went somewhere they never went — which is why it never ran
in two closes.

T7's diagnosis (a data-loop miscount) is **REFUTED**: the loop counts 14 correctly. The
divergence is that the banked floors and the derivation rule were authored under different
laws — theme-quadrants was hand-set at its exact arity, and `floorFor` read 14 as a
10%-churn project.

Two cures, both in `law`:

- **the ratchet** — `max(banked, derived)`, so closing slack never hands any back and an
  unmoved tree moves nothing. Only a floor that would land ABOVE live is a real lowering,
  and that still refuses without `--allow-lower` (canary 8).
- **the band floor in the derivation** — `max(floor(live × 0.9), ceil(live × 0.85))`.
  `floor(11 × 0.9) = 9` sits under `ceil(11 × 0.85) = 10`, so the plain churn rule could
  derive a floor its own band rejects.

`check-coverage-floor.mjs` took the ratchet cure for the identical problem at T7-W6
(`2026-08-tranche-7/evidence/w6/floor-restamp-mechanism.txt` §2). This is the second and
third instance of the class; the rule now lives in the stamp, once, for all three.

**The proof** (`floors-canaries.txt`, tail): a comparator parses the gate's own
per-project resolution and `--restamp --dry`'s proposal and holds them against each other
on listed / live / derived / floor. **11 projects, 0 divergences.**

## 4 · The wave-time census

Marked wave-time in the stamp itself (`wave: "T9-W5 §5.2 (wave-time; the WGATE
restamps)"`). The WGATE re-runs both arms.

**Unit** — 735 executed / 57 files / 237 suites → floor **661** (was 434). V5 measured 560
live at `c55d66d3`; the estate has since grown by 175 rows.

**Playwright** — 493 live of 508 listed → floors total **448** (was 273). Slack 45 rows
(9.1%), was 220 (44.6%). The audit's figure was 205 of 478.

| project | listed | live | floor was | floor now |
| --- | --- | --- | --- | --- |
| chromium | 221 | 221 | 115 | 198 |
| webkit | 216 | 216 | 110 | 194 |
| (default) | 4 | 4 | 4 | 4 |
| throttled-void | 1 | 1 | 1 | 1 |
| filter-census-chromium | 6 | 6 | 6 | 6 |
| filter-census-webkit | 6 | 6 | 6 | 6 |
| wordmark-webkit | 6 | 1 | 1 | 1 |
| theme-bake-chromium | 10 | 10 | 2 | 10 |
| theme-bake-webkit | 10 | 0 | 0 | 0 |
| theme-quadrants-chromium | 14 | 14 | 14 | 14 |
| theme-quadrants-webkit | 14 | 14 | 14 | 14 |

`live` is the WORST CASE across platforms — listed minus any quarantine at the platform
that DECLARES it, never the running one. A census taken on darwin, where neither
quarantine applies, would bank floors of 6 and 10 for the two parked projects and red the
ubuntu lane on its next run.

**What moved under us.** 14 of chromium's and 14 of webkit's rows come from
`e2e/viewport-law.spec.ts`, in flight under the concurrent viewport wave and untracked at
measurement. Stamp what you measure: tracked-only lives are 207 and 202, both above the
198/194 floors, and the band's reference is `max(census, live)` — so the row stays green
whether that spec lands or leaves. `viewport-law.spec.ts` was added to `SPEC_MANIFEST` in
the same commit; nothing else in this lane can see it, and check 6 was RED until it did.

## 5 · Canaries

Every plant made in the real tree — the real `census.stamp.json`, the real
`check-pw-projects.mjs` — every gate run bare, the tree restored byte-for-byte and the
restoration verified with `cmp`. Re-executed whole on 2026-08-28; the full log is
`floors-postwall-reverify.txt`.

| # | plant | verdict |
| --- | --- | --- |
| 1 | unit census stamped 20% above live (882 claimed, 735 run) | RED, exit 1 |
| 2 | unit floor hand-lowered to 624 (band owes 625) | RED, exit 1 |
| 3 | the restored tree, unit gate | GREEN, exit 0 |
| 4 | unit `--restamp --dry` on an unmoved tree | round-trips, exit 0 |
| 5 | unit floor banked at 900, above live 735 (a real lowering) | REFUSED, exit 1 |
| 6 | chromium census stamped 20% above live (265 claimed, 221 run) | RED, exit 1 |
| 7 | chromium floor hand-lowered to 187 (band owes 188) | RED, exit 1 |
| 8 | a floor smuggled back into `CONFIGS` | RED, exit 1 |
| 9 | the restored tree, pw gate | GREEN, exit 0 |
| 10 | pw `--restamp --dry` on an unmoved tree | 0 of 11 move, exit 0 |
| 11 | chromium floor banked at 300, above live 221 | REFUSED, exit 1 |

Plus the in-model sabotages: `check-pw-projects --self-test` runs 15, all RED;
`check-unit-count --self-test` runs 12 known-bad inputs, all RED, and 2 positive controls,
both GREEN.

**The write path, not just `--dry`.** A round-trip proven only through `--dry` leaves the
write untested, and the write is what a WGATE actually performs. Both arms were run
NON-DRY on the unmoved tree: 0 floors moved in either, and a diff of the stamp across the
writes shows the date field alone. The WGATE's restamp therefore cannot silently move a
floor, and it does not eat the file's prose keys (`_`, `_hand`, `_ci_prose`, `law` all
survive — asserted in the log's §6).

**The comparator's own negative control.** A proof instrument that cannot fail proves
nothing, so the round-trip comparator was itself shown able to RED: one digit bent in the
gate capture (chromium floor 198 → 197) turns 0 divergences into 1, exit 1.
