# `scripts/check-peer-tin.mjs` — the pass-2 re-cut, specified

Not an r0 instrument (PAL-TIN minted it in pass 1), so this is a plain re-cut rather than a
MOVED proposal. Born-RED at HEAD exactly as before (`INSTRUMENT BROKEN: 0 light sticks`).
Every defect below is measured in `../README.md` §2 with the reproduction in `../probe/tin2.mjs`.

## What is wrong today

1. **One flat regex over the whole file.** 29 hex literals, 17 distinct names, both themes
   mixed. Its headline "nearest anchor 13.3°" is peer-4 DARK against `--color-user-ink`
   LIGHT — two inks that are never on a screen together.
2. **Aliases are invisible.** `--color-teacher-red` and `--color-gold-star` are `var()`
   (`index.css:212`, `:215`) and are in NO arm of the gate's set, though R5's constraint 3
   names both. In dark, four more alias to crayons and three inherit light: the dark arm is
   judged against 12 literals, the light against 17.
3. **One metric for two questions.** Degrees answer "is this stick a named ink of the house";
   they do not answer "can a reader tell a player's hand from the machine's". The file's own
   header says so and then keeps degrees as the whole of gate 1.
4. **Gates 1 and 3 cannot be shown failing.** Only gate 2 has a negative control.

## What it must assert

```
resolve(block, name)        # follow var(--color-x) and hsl() to a hex, per ARM
RESERVED[arm]               # 19 named tokens, resolved, within the arm
CELL[arm]                   # the 9 that paint beside a player's digit (cited below)
```

`CELL` = `user-ink`, `solver-ink-1…5`, `teacher-red`, `focus-sketch`, `crayon-blue`.
Citations: `HandwrittenGlyph.vue:85` (the digit), `HandwrittenGlyph.vue:83` +
`SvgFilters.vue:180-184` (a solved digit is the five-stop solver gradient),
`gameCell.css:144,150,167,170,274,289` (teacher-red), `gameCell.css:246-248` (focus).
`progress-ink` is the frame trace (`HandDrawnGrid.vue:471`) — same eye, not the same cell:
carry it in a third, reported-not-failing row.

| gate | question | metric | set | floor |
|---|---|---|---|---|
| **1a** | is a stick a named ink wearing another name | hue degrees, WITHIN the arm | RESERVED (19) | 12° — measured 13.75 light / 13.87 dark |
| **1b** | can a reader tell a hand from the machine | OKLab ΔE | CELL (9) | see below |
| **2** | can a reader tell two players apart | OKLab ΔE, within the arm | the sticks | 0.10 — measured 0.145 / 0.139 |
| **3** | is a stick literally a reserved ink | hex identity | RESERVED | zero |

## The floor for 1b is the PAPER's, and the gate derives it

A bare number is gameable by lowering it, and ΔE 0.10 against the reserved set is
unreachable: at the light band, 678/720 hues cannot reach it at the sRGB gamut's own
maximum chroma, and the best FIVE berths ≥40° apart with AA ≥ 4.5 in both arms hold
**0.058**. So the gate re-derives the ceiling from `index.css` in the same run and asserts
the RATIO:

```
ceiling = max over hue-sets of five, ≥SPREAD apart, AA ≥ 4.5 both arms,
          of min ΔE(stick, CELL[arm])          # binary search on the floor, as probe/pack.mjs
score   = min ΔE(tin, CELL) / ceiling
PASS    = score ≥ 0.75  AND  min ΔE(tin, CELL) ≥ ABSOLUTE_FLOOR
```

Both numbers print. The ratio alone would let a drifting reserved set hide a drifting tin;
the absolute floor alone would be a number somebody chose. Today's tin scores
0.046 / 0.058 = **0.79**. At the bands README §2.4 proposes (light L 0.44, dark L 0.65) the
same five hues score 0.090 / 0.100 against a ceiling that also moves — re-derive both in the
one run and quote the pair.

## Negative controls, one per gate, all under `--self-test`

| gate | injection | expected |
|---|---|---|
| 1a | a sixth stick at `--color-user-ink`'s hue + 6° | RED, naming the collision and the degrees |
| 1b | a stick at ΔE 0.02 from `--color-solver-ink-2` in the arm being tested | RED, naming the ink |
| 2 | pass 1's own: a sixth stick 0.002 off amber | RED, 2 pairs (keep verbatim) |
| 3 | one stick's value replaced by a reserved ink's literal hex | RED, "a stick IS an anchor" |

## Two rows it should also print (report, never fail)

- **The gamut ceiling per stick.** Six of the ten arms sit exactly ON `chromaAt(L, h)` —
  the light teal's 0.093 is the gamut's narrowest point on the light circle, not a choice.
  A stick that asks for chroma above the ceiling clips and rotates hue silently (PAL-WALK's
  finding); the check belongs at authoring time, in this file.
- **The 8-bit round trip.** 0.000° on every stick, because a table is authored in bytes.
  Print it and say why it is zero, so nobody later mistakes the absent tax for an absent check.

## Run it BARE

A pipe eats the exit code. `node scripts/check-peer-tin.mjs` and
`node scripts/check-peer-tin.mjs --self-test`, each on its own line, each read from `$?`.
