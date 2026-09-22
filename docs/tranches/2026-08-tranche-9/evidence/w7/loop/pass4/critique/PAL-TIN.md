# PAL-TIN · pass-4 CRITIQUE — the lanes it named are green, two it never ran are red, and the ballot turns on which pixel you pick

Adversarial critic, non-author. Read LAWS, both chair rulings (pass 3, pass 4 plus the 2026-09-19
`?board=` addendum), registry-v3 §2 and the §11c rows, the charter, the pass-3 critique, the
prototype README and return. Built the pass-3 tree (`git archive 74a2b5d9` + `pass3.diff`, applied
clean) and diffed it against the work tree for the pass-4 ADVANCE: seven files moved
(`peer-tin.spec.ts`, `check-peer-tin.mjs`, `useSession.ts` (`selfTakesAStick()` plus prettier),
`GameControlPanel.vue` / `SheetWashiLabel.vue` (import re-point), `useSession.test.ts`
(prettier only), `e2e/node.d.ts`); `PlayerTick.vue` is byte-identical to its pass-3 self, moved
folder.

Servers (private cacheDirs, `--strictPort`, killed BY PID 4047/4049/4498 and their npx parents
3993/3994/4465; 4247–4249 read empty at return): prototype dev `:4247`; prototype BUILT dist
`:4248` (built this pass, identity `index-BmfsuLrclYiB.js`, 37 assets, 912 KB, `data-vite-dev-id`
0); HEAD control `:4249` = `w7-control` preview, verified by `index-CubiZsMVSwTc.js`. π control
commit **74a2b5d9** on every row. Instruments in `critique/PAL-TIN/instruments/`, logs in
`critique/PAL-TIN/logs/`.

**VERDICT: ADVANCE at 75%.** The critic's rows mostly have teeth now, and I closed the lane's own
two largest gaps (π and the goldens) on this tree. But the tree has TWO CI lanes RED that nobody
ran, the leader's GATE 4 fails to catch five of the six second publishers I planted, and the ring
ballot is decided on the single most flattering pixel of one arm per theme.

---

## 0 · NUMBERS FIRST — what I re-ran myself, both engines

| row | lane | mine | verdict |
|---|---|---|---|
| `peer-tin.spec.ts` | 8 × 2 = 16 passed | **chromium 8/8 (30.9 s) · webkit 8/8 (1.2 m)** on `:4247` | CONFIRMED |
| ring SAMPLED, TIN light / dark | 3.336 / 3.564 ch · 3.306 / 3.614 wk | **3.336 / 3.564 ch · 3.306 / 3.614 wk**, ring-off control 1.000 ×4 | CONFIRMED, see §2.3 for what it measures |
| ring SAMPLED at WALK's scalar | 3.187 / 3.750 ch · 3.189 / 3.759 wk | **identical** | CONFIRMED |
| RESOLVED-TOKEN ring worst | 3.134 / 3.146; digit 2.436 / 2.281 | **identical** | CONFIRMED |
| AA bg/card/popover | 7.151 / 5.178 | **7.151 / 5.178**, both engines | CONFIRMED (token-level) |
| `you` pill five→seven at 1280 | Δ 0 | **1104.890625 → same (ch) · 1104.921875 → same (wk)** | CONFIRMED |
| `check-peer-tin.mjs` bare / `lint:tin` | 0 / 0 | **0 / 0** | CONFIRMED — but see §2.2 |
| `lint`, `lint:eslint`, `lint:motion`, `lint:boundary`, `lint:copy`, `check-copy-register` bare, `typecheck:e2e`, `vue-tsc`, `knip`, `lint:lanes`, `lint:catch`, `lint:live-regions`, `lint:ink`, `lint:theme-selectors`, `lint:tdz`, `lint:sleep`, `test:e2e:retries` | the first nine claimed | **all 0** | CONFIRMED |
| **`lint:theme-tokens`** (ci.yml:1001) | not run | **EXIT 1 — `DEAD TOKENS: --peer-ring-l`**; control `74a2b5d9` EXIT 0 | **RED, the family's** |
| **`test:e2e:projects`** (ci.yml:1216) | not run | **EXIT 1 — `peer-tin.spec.ts: on disk, NOT in SPEC_MANIFEST`**; control EXIT 0 (34 specs) | **RED, the family's** |
| vitest `src/games` chunk | 68 / 836 (whole) | **57 files / 747 tests, exit 0** | CONFIRMED for the touched chunk |
| **π vs 74a2b5d9, BUILT vs BUILT, one encoded board** (the lane's gap 1) | not run | **0 diff rows** over every `body *` node × 22 paint props + tag + rect: desk 1280×800 FINE 1093 nodes, phone 390×844 COARSE (hasTouch, `coarse:true hover:false` witnessed on both arms) 1053 nodes; roster at five 22 nodes, 0 diffs (colour excluded — the palette is the claim). Both engines. Negative control (1 px letter-spacing planted): **81 diff rows**, both engines | **CLOSED BY ME** |
| **goldens off the pass-4 built dist** (the lane's gap 2) | not run | **4/4, exit 0** | **CLOSED BY ME** |
| **filterBudget on the pass-4 built dist** (gap 3) | carried | **12/12, both engines, both regimes** | **CLOSED BY ME** |
| **filter census at SEVEN players, built dist, the estate's counting rule** | 9 at nine (dev, by hand) | **9 live, prototype AND control, both engines, 2 `.roster-tick` mounted** on the prototype | CONFIRMED on the artifact that deploys |
| forced-colours row can fail? | asserted | **YES**: deleting `.roster-tick path` from the widened rules (3 rules) turns the forced tick `rgb(133, 57, 0)` ≠ CanvasText, both engines | CREDIT, the row is real |

---

## 1 · GAPS FIRST

### 1.1 Two CI lanes are RED on this tree, and it's the same miss as pass 3

The pass-3 headline was "three CI lanes RED and nobody ran them". The lane cured those three and
ran nine more, but never ran `lint:theme-tokens` or `test:e2e:projects`. Both are in `ci.yml` and
both go RED here, GREEN at `74a2b5d9` on a clean archive. Both have been RED since pass 3 (index.css
and the spec are unchanged since then), and the pass-3 critic missed them too.

- **`lint:theme-tokens` EXIT 1: `--peer-ring-l` is a DEAD TOKEN.** It's declared on both arms
  (`index.css:200`, `:433`) and consumed by nothing in `src/`. It exists for one reader, GATE 4b's
  regex in `check-peer-tin.mjs`. That's the **consumer-less substrate** item: a CSS custom property
  shipped to every user so a lint script has a sentence to grep. **The trap inside the cure:**
  delete the token and `lint:theme-tokens` goes green (measured: EXIT 0) while GATE 4b goes RED
  (`4b: the light arm declares no --peer-ring-l — the table has no scalar`, measured). The
  leader's gate and the estate's gate can't both pass on any tree this lane can write without
  re-cutting 4b, for example as a gate-side constant, or a comment the gate parses, or a real
  consumer.
- **`test:e2e:projects` EXIT 1**: `peer-tin.spec.ts` is not in `SPEC_MANIFEST`. It's a one-line
  cure. The lane's own return says "CI LANES, bare … all 0", and that sentence is false for the
  tree it hands over.

This is the class's SECOND bite ("the local seal battery is a SUBSET of CI" is a standing trap in
the memory). Per lessons-from-t2-t4 (trap → config on the 2nd bite), the cure isn't more care.
It's running `tincrit4-lanes.sh`'s shape: every `ci.yml` lint/test script, bare, exit per line.

### 1.2 GATE 4 (the leader's ONE PUBLISHER) catches second publishers that AGREE and misses ones that DISAGREE

I copied the gate and `src/` to scratch and planted six second publishers. Each run was bare, and
the six lines are banked in `logs/gate4-attacks.log`:

| plant | GATE 4 |
|---|---|
| baseline | GREEN |
| A1 `gameCell.css` (the ring's own consumer file) redeclares `--color-peer-2-ring: #2a3900` | **GREEN** — `.css` files other than index.css are never read |
| A2 `export const ringLightness = { light: 0.32, dark: 0.79 }` in a `.ts` mentioning peer | **GREEN** — the name doesn't end in `BANDS`/`_L` |
| A4 `export const RING = { light: ["#552200", …WALK's five] }` | **GREEN** — 4a flags only hexes EQUAL to the published table |
| A5 `export const RING_BANDS = { light: 0.32, dark: 0.79 }` | RED (the shape of its own negative control) |
| A6 `export const RING_BANDS = { light: 0.5, dark: 0.6 }` | **GREEN** — a literal is flagged only when it sits within 0.08 of the scalar |

The failure GATE 4 exists for is two hands on one number that disagree, and a drifted copy is
the one it lets through. It reds only on copies that agree exactly (4a) or are within 0.08
(4a-literal). Also: the GREEN line prints `0 tin hexes spelled in code` as a string literal, even
on a RED run; e2e/ is out of scope although the header says "a band pinned in a test fixture is
still a second copy" (`peer-tin.spec.ts` carries `WALK_RING`, a second ring table); and 4b is an
ablation on TEXT, not the runtime ablation registry §2.4 names (the lane says so). Per registry
§2.10 a gate that can't fail on its own subject is **struck until re-cut**, and GATE 4 doesn't
count toward the leader duty yet.

### 1.3 The ring ballot is decided on the most flattering pixel of ONE arm per theme

§1b takes the single pixel the ring moved MOST (the most-covered stroke pixel) and ratios it
against the cell centre. That's a ceiling. LAWS §Gates: "a painted-contrast gate carries the
threshold-sensitivity row". It isn't there. And the arm on screen is peer-2 in BOTH themes: the
worst light arm, but the SECOND-BEST dark arm.

My instrument (`instruments/ring.tincrit4.spec.ts`) uses the same live cursor, dpr 2, and ring-off
shot. It paints each of the five arms, at both scalars, onto the one bound token and reads the
distribution of the stroke core (pixels ≥ 50 % of the max move):

```
                     max-pixel (the lane's statistic)     core MEDIAN            core px < 3.0
light TIN  worst     peer-2 3.336 ch / 3.306 wk           3.163 / 3.133          23.4 %
light WALK worst     peer-2 3.187 ch / 3.189 wk           3.024 / 3.024          23.8–24.8 %
dark  TIN  worst     peer-5 3.238 ch / 3.258 wk           3.127 / 3.125          23.5–23.9 %
dark  WALK worst     peer-5 3.395 ch / 3.414 wk           3.279 / 3.277          21.7–21.8 %
(lane's dark §1b reading: peer-2 3.564 / 3.614, the arm with the most headroom but one)
```

Registry §2.4 displaces WALK "if PAL-TIN PAINTS a reading under 3.10 at those values". The core
median of WALK's light green arm is **3.024 in both engines**, under 3.10 and 0.024 above the 3.0
floor. The lane's maximum reads 3.187. So the MOVED row ("paint refuses the tin's pin; ship
WALK's 0.32/0.79") holds only under the one statistic the laws don't accept alone. Under the median,
the §2.4 condition is met and the tin's light arm has the headroom (3.163 vs 3.024), while WALK
has it in dark (3.279 vs 3.127). One scalar wins light and the other wins dark. The ballot can't
fire on this row. It needs the sensitivity row, all five arms, both themes and a named statistic
first. (About 18–25 % of every arm's core pixels read under 3.0 at both scalars. The ring
"clears 3.0" at its best pixel only, and so does every other palette's.)

### 1.4 AA on the family's own second home is RED in dark, and the row is REPORT-only

The tape's slug is TEXT in the author's stick (`GameBoard.vue:1256`), and the tick rides it.
`peer-tin.spec.ts` §2 prints `REPORTED tape worst 2.977` (dark) and asserts only bg/card/popover.
My painted row (`TAPE …` in `logs/ring2-*.log`) ablates the ink (`color: transparent`) and ratios
each ink pixel against the SAME pixel with the ink off:

```
dark tape, painted core, both engines identical to 3 dp:
peer-1 3.115 · peer-2 3.475 · peer-3 3.500 · peer-4 3.167 · peer-5 2.982   — 100 % of ink px < 4.5
light tape: 6.537–7.626 (clear)
```

Every dark stick fails 4.5:1 for text on the tape. Peer-5 fails the 3.0 non-text floor too, which
the tick needs. HEAD's self blue on the same paper reads 4.231, so the surface is an estate RED
as well. But the tin AUTHORED these ten hexes, priced AA on three grounds, and declared the tape its
second home. **"The constraint it forgot" (AA)**, masked by a REPORT row.

### 1.5 The F1 ballot pair is contaminated, two different deals

`f1-yes-…png` row 1 reads `9 3 [1] 6 7 [2] [3] 8 _` and `f1-no-…png` reads
`[1] 4 1 [2] [3] 6 3 2 _`. The banked frame script (`probe/tin4-frames.scratch.ts:7-8`) boots
`./?size=3&difficulty=EASY` with no `?board=`. The chair's 2026-09-19 addendum was in force for
batch 4, PAL-TIN's batch: "a ballot pair (both frames, one board) is contaminated until both arms
load one encoded board." The ink readings (`rgb(133,57,0)` vs `rgb(37,99,235)`) stand, but the
owner's pair must be re-shot on one encoded payload. Also, `?selfink=0` has **no test**. Its only
proof was a scratch spec that's been deleted.

### 1.6 Smaller, each a sentence someone has to write

- **Legacy residue.** `pencilConfig.ts`'s new `DRAW_IN_PRESETS.tally` says it was "hoisted out of
  `DifficultyTally` when a second consumer arrived (T9-W7 PAL-TIN's board tick)". Pass 3 deleted
  that board tick, and `grep` finds ONE reader (`DifficultyTally.vue:147-148`). The file's own
  consumer list (`pencilConfig.ts:470-476`, "DifficultyTally's tally stagger (glyph)") is now stale.
  Revert the hoist or reword it; the pass-3 critique's "two readers" is wrong on this tree.
- **`ci.yml`'s new block still says "Five laws … Six negative controls"**, but the gate has six
  gates and eight controls. The CI comment disagrees with the gate it names.
- **`.glyph-tick 0` stays STRUCK** (registry §2.10). It was relabelled, not re-cut, and the lane says so.
- **The tally at lap 1 reads as a pipe.** Frame i shows `passive-scallop |`, a single 1.5 px
  upright. For players 6–10 (the only laps a real room reaches) the "deal counter's mark" is one
  stroke, which reads as a text separator. The gestalt is asserted, not read by anyone. That's for
  the owner's eye.
- **dpr 3 unrun** (the charter said "dpr 2/3").
- **The sixteen-player census** stays unrun. The roster converges n−1 from nine pages, an estate
  row the lane rightly handed up. I measured seven on the built dist, not sixteen.
- **W2 §2.5**: the tape crosses 2–3 interactive cells in both arms (frame ii shows it covering the
  row above). It's the fold's surface, the tin widens it 41.6 px, and I didn't re-measure it.
- The PNG decoder has no test of its own (the lane's gap 12). My probe reuses the same unfilter
  (only the IDAT join differs), so the fact that my readings agree with its readings doesn't
  independently check the decoder. The ring-off control still means a decode error can't pass as
  a colour.
- The relay and a real device are W8 §8.3's, correctly deferred.

---

## 2 · The advance, credited

- The three pass-3 REDs are cured the right way. `PlayerTick` was filed into `src/pencil/glyph/`
  (not an eslint exception), and the PRM *route* was landed rather than the word bent, because the
  critic's suggested wording alone would have red'd rule 3.
- §1b's ring-OFF shot as the control is the right idea. The pixels that moved are the ring, and
  the grid, paper and wash cancel. It reproduces to the byte on my servers. Its flaw is the
  statistic (§1.3), not the method.
- `rowsFive` is ASSERTED (`toEqual`), the tape carries its assertion (tick 1 shared / 0 unshared,
  both engines), and the forced-colours row **can fail**. I ablated the widened selector and the
  tick went amber in both engines.
- The killing number was re-read on live cells (2.55/2.60 px desk, −4.54/−6.01 px 16×16 phone).
- The lane refused to land its own scalar defeat silently and named the 3.000 arithmetic floor.
  That's the right instinct, even though the pixel statistic undoes the conclusion.
- π, the goldens and the built-dist census are now CLOSED on this tree by a second hand
  (§0): 0 paint/rect deltas against 74a2b5d9 at desk and phone, both engines, one encoded board,
  with a negative control that fires.

---

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT** — GATE 4 green on 5/6 planted second publishers; `.glyph-tick 0` still `0 === 0` |
| spec-cites-itself | **HIT (soft)** — `--peer-ring-l` exists only so GATE 4b can read it; the scalar certifies the table that it was written from |
| gates that cannot fail | **HIT** — GATE 4a (drifted copies), the tape AA row (REPORT), 4b's printed `0 tin hexes` literal |
| elegant-reduction trap | clear |
| legacy aliases | **HIT (minor)** — `DRAW_IN_PRESETS.tally`'s "second consumer" is the deleted in-cell tick |
| masked fallbacks | carried — `gameCell.css:230/232` proposed to MRK-LIVE (correct routing); a REPORT row masks the dark-tape AA |
| unverified gestalt | **HIT** — F1 pair on two deals; the lap-1 tally reads as `\|`; the ballot's "painted" reading is one pixel of one arm |
| consumer-less substrate | **HIT** — `--peer-ring-l`, and `lint:theme-tokens` says so |
| the generic default | clear |
| the pixel it moves that it did not declare (π) | **CLEAR, measured by me** — 0 deltas vs 74a2b5d9, desk + phone coarse + roster, both engines, negative control 81 |
| the constraint it forgot | **HIT** — two CI lanes; AA on the tape (dark 2.98–3.50 painted); chair's `?board=` addendum |
| AA both themes, PAINTED | bg/card/popover clear (token); **tape dark RED painted** |
| filterBudget 9 | **CLEAR, built dist**, 12/12 both engines + 9 at seven players both arms |
| M16 | clear — `check-copy-register` bare 0 |
| decided history (R6) | L6 MOVED under WALK's row per chair §1.3 (proposed diff, correct); L3 retired |
| W2's landed mechanics | respected; §2.5 estate RED widened 41.6 px |
| @property law | n/a — the family registers nothing |
| undefined-token census | clear — every added `var()` resolves (`--color-peer-{1..5}`, `-ring`, `--color-user-ink`) |

---

## 4 · What closing costs

Three lines each: `SPEC_MANIFEST` +1; re-cut 4b so `--peer-ring-l` isn't a dead token, or delete
the token and move the scalar into the gate; `ci.yml` comment; the `tally` preset. A day at most:
GATE 4a reading every `.css` and comparing ANY peer-shaped table or scalar against the sheet (red
on disagreement, not only on agreement), with A1/A2/A4/A6 as its negative controls; the §1b
sensitivity row (all five arms, both themes, max / p30 / median / fraction < 3.0, both scalars)
before T9-B-TIN-RING fires; the dark sticks re-cut against the tape paper, or the tape row asserted
with the estate RED booked; the F1 pair re-shot on one encoded board plus a unit for `selfink`.
None of it's a missing primitive, so this is ADVANCE, not BLOCK. But two CI reds, on the second
bite of the same class, cap it at 75.
