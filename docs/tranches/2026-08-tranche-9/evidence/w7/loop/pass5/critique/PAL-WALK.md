# PAL-WALK · pass-5 adversarial critique (§11c, the hue walk; the palette's leader)

The pass-5 critic wrote neither the charter nor the prototype. Every number below that isn't attributed to the lane
was taken by the critic on its own servers on 2026-09-22, in chromium and webkit.

**The rig.** The critic worked on a replica of the work tree `wf_308fa864-c94-1`, never on the tree itself:

- **How the replica was made.** `git archive 74a2b5d9`, plus the tree's `git diff --binary` (84,392 B), plus its two untracked files, all outside the tree.
- **Checked equal.** `diff -rq` of `src/`, `e2e/` and `scripts/` against the tree: IDENTICAL.
- **Left untouched.** The tree's `git diff --binary` was `cmp`-equal at the end, and w7-control's status sha was unchanged (`11c108dd…`).

The servers ran on 127.0.0.1. All four were killed by recorded PID.

| port | what | identity |
|---|---|---|
| 4232 | replica, dev (hmr off, watch off) | verified by source: `SELF_TAKES_A_HAND` 2 hits, `--peer-ring-l: 0.295` |
| 4233 | `w7-control`, dev | read-only, private cacheDir |
| 4234 | the critic's own build of the replica | built outside the tree, `index-iqdYCvIZwvfI.js`, 43 files |
| 4235 | the control's dist | `index-CubiZsMVSwTc.js` |

Payload for every browser row: `ATMuMzkx…YxMDYx`. Both arms asserted the decode `39167842.24..3.6.8678…`.

Instruments and condensed readings are in `critique/PAL-WALK/`. **No frame is banked.** Each finding is a number, and
the family's four-crop cap is spent on the lane's replacements.

**Verdict: ADVANCE. Convergence: 84%** (up from 76).

- **What closed.** Every charter row the lane claims closed reproduced on the critic's servers: G1, G2's cure, G4, G5, G6, the ring pair and the gestalt.
- **What holds the number down.** Two findings came from instruments that can fail:
  - the landed §C row **reds the shipped tree in WebKit** at the top-row flip;
  - check 4 is keyed on a literal's syntax, not on the rule's shape.

---

## 1 · Re-measured (critic's servers, both engines)

| row | lane | critic chromium | critic webkit |
|---|---|---|---|
| Build identity (clean, outside the tree) | `index-iqdYCvIZwvfI.js`, 43 files | **`index-iqdYCvIZwvfI.js`, 43 files**: reproduces byte-for-byte | — |
| `e2e/peer-walk.spec.ts`, WHOLE file, dpr 3 | 3/3 | **3/3** | **3/3 ×3 runs** |
| same, dpr 1 | 3/3 | **3/3** | **3/3** |
| §B ring core MEDIAN, worst light / dark, dpr 3 | 3.133 i6 / 3.341 i86 (wk 3.344 i89) | **3.133 i6 / 3.341 i86** | **3.133 i6 / 3.344 i89** |
| §B at dpr 1: median · p30 · frac<3, light i=6 | 3.133 · 2.444 · 41.3 % | **3.133 · 2.444 · 41.3 %** | **3.133 · 2.543 · 39.1 %** |
| §B dark at dpr 1: i=86 / i=89 median · p30 | 3.341 · 2.633 / 3.344 · 2.749 | **3.341 · 2.633** | **3.344 · 2.749** |
| §C name, spec vs painted ground, light (b) | 11.891 | **11.793 (dpr 3) / 11.891 (dpr 1)**, 0 px < 4.5 | **11.891**, 0 px |
| §C name, dark (b) | "5.691, both engines" | **5.604 at dpr 3** (5.691 at dpr 1), 0 px | **5.691**, 0 px |
| B-TAPE (a): translucent paper, same session, one variable (inline `background`) | 4.364 | **4.359**, 66–473 px < 4.5 | **4.364**, 269–429 px < 4.5 |
| HEAD `74a2b5d9`, same cells, its i=1 ink | 4.589 / 4.594 (pass-4 critic) | **dark 4.589, 0 px · light 3.382, 649–936 px < 4.5** | **dark 4.594 · light 3.418, 498–797 px** |
| useSession + BoardHost.authors | 55/55 | **55/55** | — |
| G1 break (the same-epoch branch removed) | U9 + S1 red | **exit 1: U9 and S1 red, 2/55**, restored by sha1 | — |
| F1 NO arm (switch false) | green | **55/55 · `src/games` 57 files/759 · `vue-tsc -b` 0**; the YES arm reads 57/759 | — |
| Solo π, built vs control dist, dpr 1 | 854 · 0/0/0 | **854 nodes · 0 one-sided · 0 paint/tag · 0 rects**, light and dark. Negative 0; positive light-vs-dark 854 | **same** |
| §C born-RED: tree edited so the paper is translucent, run bare | red both | **exit 1** (dark 4.359, 66 px) | **exit 1** (dark 4.364, 511 px) |
| §C negative control, SAME batch, tree restored by sha1 | (the lane's own (c): **red both engines**, attributed to HMR and a dropped hover) | **exit 0** | **exit 1**: light cell 8 (the top-row flip) reads **1.763, 5/5576 px < 4.5**, noise 0 |

**The pre-return battery, run bare** (`readings/battery-tree-vs-control.txt`). The control's exit code is after the bar:

| gate | tree \| control |
|---|---|
| lint:lanes | 0 \| 0 |
| lint:theme-tokens | 0 \| 0 |
| lint:sleep | 0 \| 0 |
| test:e2e:projects | 0 \| 0 |
| check-pw-projects (check 8: chromium listed 241, floor band green) | 0 \| 0 |
| lint:arcs | 0 \| 1 (absent at base) |
| lint:copy, lint:motion, lint:theme-selectors, lint:ink, lint:catch, lint:live-regions | 0 \| 0 |
| `check-copy-register`, bare | 0 \| 0 |
| `npm run lint` (prettier) | 0 \| 0 |
| `eslint .` | 0 \| 0 |
| knip | 0 \| 0 |

**M16 can fail on this family's string.** An em dash plus "heuristic" planted in `useGameCell.ts:173`
(`{slug} is here`) reds `check-copy-register` with exit 1, and it restores to 0.

**The undefined-token census, by hand.** The diff adds five `var()` references: `--color-card`, `--sheet-washi-neutral`,
`--peer-ring-l`, `--peer-ink-l` and `--color-peer-cursor-ink`.

- The first four are declared in `index.css`, in both arms.
- `--color-peer-cursor-ink` is the inline publisher's (`BoardHost.vue:84`) and is consumed bare, which is the pass-4 ruling.

**Other constraints.**

- **@property:** nothing is registered.
- **Filters:** none is added. The critic's build is byte-identical to the lane's dist, so the lane's census, 12/12 in light, stands on it.

**The cure's occlusion price, which the lane didn't state and the critic measured.** The question is whether laying
the paper on the card hides more of the given under the tape. The critic counted glyph pixels of the covered given
that change by more than 20 % of the unobstructed maximum, inside the tape's rect (`readings/tape-ab-occlusion-head.txt`):

| arm | chromium | webkit |
|---|---|---|
| (b) shipped | 4.3–9.7 % | 11.1–15.3 % |
| (a) translucent | 5.7–10.7 % | 11.3–16.2 % |
| HEAD | 8.6–15.4 % | 9.0–15.1 % |

The residue in every arm is outside the paper's torn polygon. Paper at 0.82 or 0.92 alpha already hides the given
under it, below 18 % of its contrast. So **the cure adds no occlusion anyone could see**, and W2 §2.5's attribution-tape
debt is HEAD's, unchanged. Frame 2's "(a) shows the 6 through the tape" is true only at ≤ 18 % contrast. B-TAPE's
caption should say so.

---

## 2 · What did not converge

### C1 · The landed §C row reds the SHIPPED tree in WebKit at the top-row flip

This is the gate that reds the good tree. In the same batch, the critic ran the break (translucent paper → red in both
engines) and then the negative control on the restored tree, which was sha1-equal and served by a freshly restarted
server. **WebKit's negative control read RED**: light, cell 8 (the tape flips below the top row), spec vs painted
ground **1.763, with 5 of 5,576 px under 4.5**, noise 0. Every other cell and theme in that run was clean.

The same pixel class appeared in the critic's own instrument, which uses the lane's `paintedName` verbatim, on the
same cell: **2.414 (1 px) light and 3.175 (1 px) dark**, with the shipped paper, webkit only.

It is intermittent:

- **Whole-file and §C runs in webkit: 1 red out of 9.** Those are r1, r2 and r3 at dpr 3, one at dpr 1, the negative control, and four §C repeats.
- **The critic's 12-repetition diagnostic: 0 odd-ground pixels.** It covered cells 8 and 11, both themes and both engines.
- **The lane's own same-batch negative control was red in both engines** (`pass5/prototype/PAL-WALK/readings/bornred.txt` (c)). The lane attributed it to HMR and a dropped hover, and substituted runs from another batch.

The row asserts the MINIMUM over every text pixel, so one transient ground pixel reds it.

- **What the critic can say.** The noise control compares ink against ink-again, but there's only ONE bare photograph, so a pixel that changes only in the bare shot passes the noise filter.
- **What the critic can't say.** Whether the dark ground is a real painted defect at the flip in WebKit or an artifact of the instrument. The failing pixel's position and ground RGB weren't captured.

Until that's known, G2's gate is a flaky gate, and its born-RED hasn't been demonstrated with a clean negative
control in the same batch (LAWS §Gates).

### C2 · Check 4 (ONE PUBLISHER) is keyed on the literal's syntax, not on the rule's shape

The ink is published by ONE site: `inkFor` → `BoardHost.vue:84`'s inline `--color-peer-cursor-ink`. Clause (v) reds
a `--color-peer-*` declaration only when its value is a colour literal (hex, `rgb(`, `hsl(`, `oklch(` and so on). The
critic's attack battery (`readings/check4-attacks.txt`) ran each plant bare, restored each by sha1, and ran the clean
control (exit 0):

| plant | exit | what it means |
|---|---|---|
| X1 `.game-cell { --color-peer-cursor-ink: var(--color-foreground) }` in gameCell.css | **0** | The player's ink aliased to a house token. On a descendant selector it beats the cell's inline publisher. |
| X6 `--color-peer-cursor-ink: color-mix(in oklch, currentColor 60%, black)` | **0** | The ring darkened at runtime by the cascade. This is the same class as the pass-3 0.32 → 0.20 ablation. |
| X2 `<style>:root{--peer-ring-l:.2}</style>` in `index.html` | **0** | A cascade source outside `src/`+`e2e/` |
| X3 computed-name `setProperty("--peer-" + "ring-l", …)` | 0 | Contrived; the critic notes it and doesn't count it. |
| X7 the consumer's `stroke` rebound in gameCell.css | 0 | A consumer, not a publisher. Tier 3's job, and out of the gate's claim. |
| X4 an inline array at the ring call site · X5 a Tailwind `[--peer-ring-l:0.2]` class · X8 a `.dark .game-cell` band arm · X9 a one-number band constant | **1 · 1 · 1 · 1** | caught |

The lane's own planted set (B1, B3, B2, A1, A2, A4, A6) is all caught, which reproduces. The gate is blind to the
shape A1 names ("a player's colour written down rather than walked") whenever the colour is written through a
`var()` or `color-mix()` instead of a literal. X1 and X6 are the drifted-second-publisher class the charter asked the
gate to close, spelled one token over. CI stays green. Only tier 3's photograph, which is local-only under O-12, would see it.

### C3 · A number mis-stated in the README (small, and it matters for the ballot)

"Painted, dark, spec vs painted ground: 5.691 … both engines, dpr 3" is not what the critic's servers read.
**Chromium at dpr 3 reads 5.604**, and at dpr 1 it reads 5.691. **WebKit reads 5.691 at both densities.**
`readings/spec-final.txt`'s 5.691 chromium row is the dpr-1 run (618 px). Both values clear 4.5 with 0 px under, so the
cure stands, but B-TAPE's number should be stated per engine (5.604 / 5.691 at dpr 3).

### Carried, declared by the lane (the critic agrees with each)

- **Two F1 switch names at the fold.** `SELF_TAKES_ROOM_INK` (PLR-SELF's substrate, not exported) and `SELF_TAKES_A_HAND` (exported here). Three of the four rejected substrate hunks are that switch. This is the chair's or the fold's.
- **The ring's fringe at dpr 1.** p30 is 2.444 / 2.543, and 39–41 % of core px read under 3.0 (reproduced). Under the §2.4 ruling (core median) that's a printed column, not a gap.
- **Frames 3 and 4 are composed.** Inks are bound per cell by the instrument, not by a four- or eight-page room. The owner's gestalt and fork pictures are a composition the product can produce but did not produce here. F1 and B-TAPE are real rooms.
- **The filter census ran LIGHT only.** The DARK arm (crayon-heart) is ACC-SIX's born-RED and the chair's cure.
- **r2's accent-kinship MOVED probe** was not re-run.
- **The evidence cap is RED on main.** `check-evidence-policy` now reads **2,870,162 B** against 2,097,152 (up from the lane's 2,767,965; inherited). This critique banks 0 frames.

---

## 3 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: every row carries a number and a control, and the critic reproduced them |
| spec-cites-itself | clear: S1/S2 are the wire's own delivery order, and the branch removed reds them |
| gates that cannot fail | **HIT (partial).** Check 4's clause (v) can't fail on an aliased or `color-mix` player ink, or on `index.html` (X1/X6/X2 exit 0; C2) |
| a gate that fails on the good tree | **HIT.** §C reds the shipped tree in WebKit at the top-row flip, 1 of 9 runs, with 1–5 px (C1). The lane's own same-batch negative control was red too |
| the elegant-reduction trap | clear: G2 is cured on the painted ground, not on arithmetic, and the break reds |
| legacy aliases | clear |
| masked fallbacks | clear for this diff. `gameCell.css:230/232` are MRK-LIVE's cited rows |
| unverified gestalt | **mild.** Frames 3 and 4 are instrument-bound compositions (declared). F1 and B-TAPE are real rooms on one payload |
| consumer-less substrate | clear: `SELF_TAKES_A_HAND` is exported for the units, which read it; knip is 0 |
| the generic default | clear |
| π | clear: 854 nodes 0/0/0 on built vs control dist, both engines and themes, with both controls. The cure's surfaces (ring, tape) are claimed |
| the constraint it forgot | clear on AA (painted, both themes and engines; the occlusion price measured at nil), filterBudget, M16 (the plant reds), @property, the undefined-token census, and W2's mechanics (nothing moved). The decided history: L6 PROPOSED carries the pair as a VALUE, and L4 (washi neutral) stays green; the tape's translucency is carried to the owner as B-TAPE (U-10), not landed silently |

## 4 · Open gaps, each a sentence that closes it

1. **C1.** Make §C take a second bare photograph (a pixel that differs between the two bare shots is noise). Print the position and ground RGB of any text pixel under 4.5. Then show the WebKit top-row flip clean over ≥ 10 whole-file runs, with the born-RED and its negative control green in ONE batch. If the dark ground is real paint, cure it in the product.
2. **C2.** Re-key check 4's clause (v) on the rule's shape: ANY declaration of `--color-peer-cursor-ink` (or `--color-peer-*`) outside the inline publisher reds, whatever its value. Also read `index.html`. Ship X1, X6 and X2 as self-test rows beside the lane's nine, with the consumer+comment control.
3. **C3.** Re-state B-TAPE's dark number per engine at dpr 3 (chromium 5.604, webkit 5.691; pass-4 translucent 4.359/4.364; HEAD 4.589/4.594). In the frame-2 caption, add the occlusion reading ((a) shows the covered given only at ≤ 18 % contrast; the cure adds no measurable occlusion).
4. **The two F1 switches.** The chair or the fold picks one name and one home.

## 5 · Strengths (earned)

- **G1 is closed properly.** The branch is three lines at the one seam. S1 is the wire's real delivery order, and removing the branch reds U9 + S1 (2/55).
- **G2's cure is measured on paint.** 11.79–11.89 light and 5.60–5.69 dark, 0 px under 4.5, both engines. Pass 4's translucent paper reproduces at 4.359/4.364 in the same session. **HEAD's own light name reads 3.38–3.42**, which is a debt this family now pays.
- **The ring pair reproduces to three decimals** at dpr 1 and 3, both engines. The core-median statistic is density-free, as claimed. The fringe columns are printed rather than hidden.
- **F1's NO arm is green** (55/55, 57/759, tsc 0). That makes the ballot's price zero units, which is the honest state for U-10.
- **The build identity reproduces byte-for-byte** from a clean archive, so pass 4's Tailwind-mint incident is cured.
- **Check 4 caught this family's own `ALTERNATE_BAND`** on its first run, and 4 of the critic's 9 attacks are caught.
- **The G6 refusal is reasoned.** `LOBBY_COPY` feeds the hand face's glyph derivation, and `{slug} is here` is an accessible name that's never painted. The overlap is priced (4 of 7 hunks reject).

## 6 · Cross-pollination

- **The second bare photograph.** Every painted-text or painted-ring row that asserts a MINIMUM over pixels should take it. That covers TIN's sticks, CTRL-TAPE's washi tag, NOTE-LEDGER's strip and MRK-LIVE's ring. One-shot minima red on transients.
- **The rule-shaped publisher gate.** Any "one publisher" check (TIN's GATE 4, MRK-LIVE's `--ring-ink`, §13's rungs) should red a declaration of the published token by site, not by the value's syntax, and should read `index.html`.
- **The occlusion instrument** (glyph pixels of the covered element inside the tape's rect, arms vs no tape). It answers W2 §2.5's attribution-tape debt in numbers for CTRL-TAPE and the §10 fold.
