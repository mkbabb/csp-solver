# PAL-WALK — THE WALK OVER OPEN ARCS (T9-W7 pass 1, PROTOTYPE)

It RUNS. The change is on the product, on a worktree, and every number below is read off the
engine's own bytes with the patch live — no `addStyleTag`, no table of hues handed to a probe.
The page imports the same `playerIdentity` module the board does and is asked for its inks.

    worktree  /Users/mkbabb/.../.claude/worktrees/wf_e58b4764-0fc-49   (branch wf_e58b4764-0fc-49)
    server    npx vite --host 127.0.0.1 --port 4245 --strictPort   (4244 was held; next free in band)
    diff      proto/palwalk.diff — 7 files, +215 −51
    verdict   TAKE THE LAW, RE-STATE THE CAPACITY. Two of the spec's own numbers are wrong and
              the prototype corrects both; one of its claims (richer colour) does not survive.

---

## 1 · What the spec said, and what the bytes said

| the spec's number | measured, on the patched product | reading |
|---|---|---|
| guard 12° + 0.25° margin | **not enough** — index 0 asks 26.41° and the engine paints 26.13°, 11.97° from crayon-rose | RE-CUT at **13°** (law + 1.0°) |
| mean chroma 0.13–0.14 | **0.1139 requested · 0.1138 painted** | the spec averaged the two bands' means; the mean of the pointwise MIN is below both. The fallback's own trigger (<0.125) FIRES |
| painted hue = requested ±0.5° | **0.96° light · 0.75° dark** (max over 144, both engines) | the gate's 0.5° is under the 8-bit floor. Not gamut mapping: the byte round-trip alone is 0.72° |
| light contrast improves | **5.45 / 5.59** (bg / card) vs incumbent 5.22 / 5.35 | HOLDS |
| dark 9.3–9.5 | **9.51 / 9.31** | HOLDS |
| ring 0.80 ≥ 3.0 | **3.67 / 3.71** light · 6.36 / 6.24 dark, 0/144 under | HOLDS (born-RED 2.29 / 2.32, 144/144 under) |
| "eight pencils apart" | **8 requested (12.38°) · 7 painted (11.69°)** | RE-STATE |
| capacity is a hue question | **ΔE(OKLab) at 8 = 0.0237**, against the house's own closest two crayons at 0.0764 | the real answer is §4 |

## 2 · The gates

| gate | born-RED | after |
|---|---|---|
| `scripts/check-peer-arcs.mjs` (NEW, self-tested, wired `lint:arcs` + ci.yml) | RED at HEAD: 78 failures (0 arcs declared, 77 law collisions over 40) | **GREEN**, exit 0 |
| family law on PAINTED bytes, first 16 / 24 / 40, both themes, both engines | RED 1 at guard 12.25 (i=0, 11.97°) · RED 37 at HEAD | **GREEN — 0 collisions**, all four cells |
| painted hue = requested | 15.33° at flat 0.166 · 4.41° at HEAD | **0.96°** — gate's own 0.5° is unreachable (§3) |
| peer ring ≥ 3:1 at its DRAWN opacity | RED 2.29, 144/144 under | **GREEN 3.67**, 0/144 under |
| r5 I2, both directions, both engines | RED at HEAD | **GREEN** (`readings/p3-*.txt`) |
| r5 I4 — an agreed index survives a rival `st` | RED at HEAD | **GREEN**, both engines |
| solo fingerprint byte-identical | — | **IDENTICAL** to the r0 HEAD fingerprint, both engines, untouched board and after a solo write (0 bound elements) |
| AA over 144 × 4 grounds | — | **0/144 under 4.5:1** everywhere; four worst light 5.453@1 5.459@90 5.465@35 5.468@14 |
| filterBudget · goldens · π | — | **9** at 4×4/9×9/16×16 both engines · **4/4** unmoved · **0 census deltas** (§5) |
| r5 I3 / I5 | RED | **still RED** — not claimed. I5 collided on BOTH engines this run (the research saw chromium GREEN once; the row is non-deterministic and the record should say so) |
| copy register | — | GREEN, **zero strings minted** |
| vue-tsc · unit battery · eslint · prettier | — | 0 errors · **810/810 in 66 files** · clean · clean |

## 3 · The three things the prototype learned that the spec could not

**a · A screen is 8 bits, and the law lives in the bytes.** The walk is built in floating point
and painted in a byte triple. At this chroma the round trip alone moves hue by up to 0.96°, so a
walk built 0.25° clear of a reserved arc paints INSIDE it: index 0 asked 26.41°, painted 26.13°,
11.97° from crayon-rose — the family's own law, red, by three hundredths of a degree. The margin
is now 1.0° (`guard-sweep.mjs` prices every candidate). It costs 7.5° of open wheel and nothing
else: still six arcs, still five open, 137.25° instead of 144.75°, step 52.42°, and the painted
law then clears with **1.3° to spare** in all four cells.
**The 0.5° hue-exactness gate cannot be met by any design** — it is under the substrate's own
floor. The honest gate is "the PAINTED hue clears every reserved arc", which is gate 2, and it
is GREEN.

**b · `min(ceil_light, ceil_dark)` is not the mean of the two ceilings.** Light-only means 0.1250,
dark-only 0.1409, and the pointwise minimum means **0.1139** — barely above the incumbent's flat
0.110. The single-string form buys hue exactness and gives back the richness the family was sold
on. Priced on the same engine bytes, the two-var fallback would deliver **0.1243 light / 0.1416
dark** at the SAME worst-case contrast (5.45 / 5.59 light — the worst index is chroma-limited
either way). So the fallback is not a contrast trade; it is three CSS rules for +0.011 light and
+0.028 dark of chroma. §1.2's trigger has fired and the agglomerator should decide it.

**c · The rider as written reds I2.** "Never rewrite an index this page already holds" refuses
the JOINER's adoption too — both pages then keep their own arrival order, each self at index 0,
and the room disagrees about every colour (measured: mirrored rosters, I2 RED both engines).
The invariant that greens both rows is one sentence: **an index is agreed once it has been on the
wire, and only the epoch's author speaks for the room.** `inkAgreed` (a Set, three touch points:
`sendState` marks it when `ledger.epoch[1] === selfId`, `adoptInk` marks what it takes, `teardown`
clears it) — I2 GREEN both directions, I4 GREEN, both engines. The cost is named in §6.

## 4 · The capacity question, answered in the currency that matters

The 12° floor is a law about not colliding with a TOKEN. It is not a threshold of telling two
peers apart, and at the chroma the gamut allows (0.085–0.166, mean 0.114) it is nowhere near one.
OKLab ΔE, off the painted bytes (`proto/dE.mjs`):

| room | PAL-WALK, painted | the shipped full-circle walk | reference |
|---|---|---|---|
| 2 | 0.1992 | 0.2055 | the two CLOSEST of the five light crayons: **0.0764** |
| 3 | 0.0877 | 0.1477 | |
| 4 | **0.0413** | 0.0991 | |
| 8 | **0.0237** | 0.0602 | |
| 16 | 0.0110 | 0.0234 | |

At the house's own crayon distance the arc walk keeps **three** hands apart; the incumbent keeps
five. `frames/pair-at-eight-dpr3-light.png` is the honest picture of "eight apart": indices 2 and
7, 12.38° and ΔE 0.0237, in adjacent cells — two teals a reader would not call two people.
`frames/pair-at-sixteen-dpr3-light.png` is the same cells at 4.99° and is one colour.
So the family's true offer is: **no hand is ever a crayon, a verdict, the machine or you — and
three to four hands read as different people.** If sixteen must read as sixteen, this family
yields; that is §5 of the synthesis, and the prototype's numbers make it sharper, not softer.

## 5 · π, and the surfaces this family does not claim

`e2e/visual-golden.spec.ts` 4/4 unmoved solo. `filterBudget` exactly 9 at 4×4, 9×9 and 16×16 in
both engines. The r1 controls census: **0 deltas** at 1280×800 against the banked r0 reading, and
**0 deltas** at 390×844 against a same-session HEAD control — the banked dock cells differ from
BOTH (case box y 216/h 628 vs 547.58/296.42, 8 headings vs 4), and the control proves that
difference is the banked run's own pose, not this diff. Print `rgb(0,0,0)` and forced-colours
`rgb(0,0,0)` survive in a room, both engines (`@layer base` outranks the binding, as predicted).
r2's exception-toll row, re-pointed at the module instead of its hardcoded formula: peer worst
**5.59** over 40 on `--color-card` against HEAD's 5.36 — GREEN and improved.

## 6 · Gaps, in full

1. **Mean chroma 0.1139 < the spec's own 0.125 floor.** The fallback is priced (§3b) and not
   built. Building it is three rules and two extra custom properties per bound element.
2. **The painted room is 7, not 8** (11.69° at the eighth). Buying the eighth degree back costs
   the law's margin — at guard 12.25 the painted room is 8 and the painted law is RED. Chosen:
   the law.
3. **`inkAgreed` trades a convergence property for an identity one.** Two pages that both publish
   a `k` as epoch author (a genuine race, not the I4 forgery) can now hold different indices for
   a third peer where HEAD's newest-epoch rule converged them. Ink diverges; the BOARD still
   converges. Unmeasured: no probe drives a two-author race.
4. **The 0.5° hue gate is unmeetable** (§3a) and should be replaced by the painted-law gate.
5. **I5 is RED on both engines here**, where the research recorded chromium GREEN once. Not this
   family's row, but the record should carry the non-determinism.
6. **The frames for the 8- and 16-player pairs are STAGED poses.** A two-page room deals indices
   0 and 1, so the two cells were handed `inkFor(2)`/`inkFor(7)` on the same
   `--color-user-ink` property `authorInk` binds. The bytes are the module's; the arrangement is
   the photographer's. The roster frame is not staged.
7. **The dark theme was read by toggling `.dark` on the canvas probe**, not by the product's own
   theme verb. The ink string is theme-independent by construction (one string, `--peer-ink-l`
   does the work), so this reads the same bytes — but the toggle's own settle was not exercised.
8. **No P3 display arm.** The canvas read-back is sRGB. On a wide-gamut screen CSS may paint
   wider and the chroma ceilings would move (the ceilings are the sRGB ones by construction, so
   the ink would simply be less saturated than the display could hold).
9. **`IDENTITY_CAP = 8` now coincides with the walk's own capacity** by accident, not design.
   Nobody has checked whether that is a happy accident or two unrelated eights.
10. **The relay arm is untested here.** Everything ran on `?wire=local` (BroadcastChannel), which
    is what the estate's own battery drives.

## 7 · Files

| file | what |
|---|---|
| `proto/palwalk.diff` | the whole change: 7 files, +215 −51 |
| `proto/derive.mjs` · `bands.mjs` · `guard-sweep.mjs` · `arcs13.mjs` | the arithmetic — arcs, per-band ceilings, the guard sweep that chose 13°, the re-cut table |
| `proto/dE.mjs` | perceptual separation, prototype vs the shipped walk vs the crayons |
| `probe/palwalk-proto.spec.ts` | P1/P2 the engine's bytes off the real module · P3 the solo fingerprint, the room, I2 |
| `probe/painted-law.mjs` | the family law, the separation and the room size on the PAINTED bytes |
| `probe/crops.spec.ts` · `probe/pw.config.ts` | the three frames · the lane's scratch config (:4245, no webServer) |
| `readings/bytes-*.json` · `p1-*.txt` · `p3-*.txt` | the raw engine readings, both engines, both themes |
| `frames/*.png` | 37 KB, three crops, each cited above |

## 8 · How to replay

    # the worktree's own server
    cd <worktree>/web/frontend && npx vite --host 127.0.0.1 --port 4245 --strictPort

    # the gate (run bare — a pipe eats the exit code)
    node scripts/check-peer-arcs.mjs --self-test

    # the engine, both engines, both themes
    npx playwright test --config <this dir>/probe/pw.config.ts palwalk-proto
    npx playwright test --config <this dir>/probe/pw.config.ts instruments   # r0 r5, copied
    node <this dir>/probe/painted-law.mjs

    # the estate
    npx vitest run && npx vue-tsc --noEmit -p tsconfig.json
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 npx playwright test --config playwright-golden.config.ts
