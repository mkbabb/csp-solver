# PAL-TIN · pass-6 CRITIQUE: the dark name is cured and beats the control, but §2b can't see a faint name

I'm an adversarial critic and didn't write this family. I read the following:

- LAWS (P5);
- the pass-6 chair and its addenda A.1–A.6;
- the pass-5, pass-4 and pass-3 chairs;
- registry-v5 §1, §2.4, §2.7, §2.8, §2.11 and the §11c rows;
- the charter, my predecessor's pass-5 critique, and the prototype's README and return;
- PAL-WALK's pass-6 critique, for the couplings.

Every number below is mine unless it's attributed to the lane. I took them on 2026-09-23.

**The pass-6 ADVANCE was read as a difference.** I applied `pass5/prototype/PAL-TIN/pass5.diff` to a `git archive 74a2b5d9`
in the scratchpad, and it applied with exit 0. Against the work tree, exactly eight files differ, as the lane claims:

- `index.css`, `playerIdentity.ts`, `GameBoard.vue`, `useSession.ts` and `useSession.test.ts`;
- `check-peer-tin.mjs`, `peer-tin.spec.ts` and `ci.yml`.

**Servers.** All ran on 127.0.0.1 with `--strictPort` and no HMR or watcher. Configs and cacheDirs live in the scratchpad, never in a tree.

| port | what | pid, killed by record, port read empty |
|---|---|---|
| 4241 | the work tree `wf_308fa864-c94-2`, dev | 43561 |
| 4242 | a `git archive 74a2b5d9` (+ `csp-solver/data`), dev: the control. Room rows need `?wire=local`, which is DEV-only, so both arms ran in one mode | 43562 |
| 4243 | my rsync replica of the tree (src `diff -rq`-identical) carrying ONE plant (§1.1), dev | 54667 |

**Integrity.**

- I never git-touched `w7-control`, and I never edited the work tree.
- The tree's `git status` at return is its 20 entries (17 M + 3 ??), and `git diff --stat` is unchanged (+659/−82).
- Payload `ATMuMzkx…YxMDYx` is on every row, with the decode asserted.
- Instruments are in `critique/PAL-TIN/instruments/` and condensed readings in `critique/PAL-TIN/readings/`.
- **No crop is banked.** The lane's one crop is a lawful pair (I looked at it), and my claims are numbers.

**VERDICT: ADVANCE at 84** (from 79). The row that held pass 5 is closed on paint, and I confirmed it independently:

- The dark tape name was a regression against HEAD. It now beats the control's own per-player ink at every cell, both themes, both engines, DPR 1 and 2, on the glyph-text statistic.
- The tick rides the name arm and clears the non-text floor with a FAINT plant that reds.

Four rows hold the family:

1. The re-cut §2b is GREEN, in both engines, with the name painted at 30 %. Its in-run control inherits the plant, so its relative clauses cancel.
2. F1's unit lost its in-run control. The NO arm can now be severed with the file still 37/37.
3. GATE 4 is keyed on the colour, but only on five syntaxes. Fourteen of seventeen fresh publishers pass.
4. The name arm is a per-player identity ink with no separation law. Three of its pairs sit under the family's own 0.10.

---

## 0 · NUMBERS FIRST: re-run by me, both engines

**The product's own binding, with no override on the label.** The rig is a room of 6:

- **B** is index 4: stick 5, pink, the worst arm, lap 0. B wrote cells 11, 12 and the top-row cell 8 (the lane's cells).
- **C** is index 5: stick 1, amber, lap 1, so its tape carries a tick. C wrote cell 14.

The control deals the same room, so each tree-vs-HEAD pair is the same player index on the same payload.

**The statistic** is the GLYPH-TEXT core median over pixels with ≥ 50 % sRGB-byte coverage, plus the fraction of those pixels under 4.5 (§2.11). "Flat" is the spec colour against the painted ground. Noise pixels are dropped from the second bare photograph.

**Slugs are random per run** (§1.5). So the tree and the control write different text, and I read a cell's range rather than a one-variable pair.

`readings/tape-product-binding-tree-vs-control.txt` holds the full rows.

### Dark

| player · engine · dpr | tree: flat worst (px < 4.5) · glyph median (% < 4.5) | control 74a2b5d9 (HEAD's ink for that index) | verdict |
|---|---|---|---|
| B pink · chromium 1 | 5.139 (0) · **5.19–5.31** (35.6–37.8 %) | `oklch(0.8 0.11 190)` 4.608 (0) · 4.80–4.89 (38.7–40.8 %) | tree WINS |
| B pink · chromium 2 | 5.139 (0) · **6.51–6.71** (17.2–17.4 %) | 4.608 (0) · 5.83–5.92 (17.3–19.9 %) | tree WINS |
| B pink · webkit 1 | 5.145 (0) · **6.44–6.62** (13.2–15.5 %) | 4.613 (0) · 5.74–5.92 (16.5–18.7 %) | tree WINS |
| B pink · webkit 2 | 5.145 (0) · **6.64–6.71** (6.7–8.9 %) | 4.613 (0) · 5.92–6.02 (10.7–11.8 %) | tree WINS |
| C amber lap 1 · ch 1 / ch 2 / wk 1 / wk 2 | 5.265–5.271 (0) · 5.45 / 6.65 / 6.79 / 6.87 | `oklch(0.8 0.11 327.5)` **4.209–4.213 (53–279 px under)** · 4.28 / 5.41 / 5.44 / 5.50 | tree WINS; **HEAD's own index-5 name is red flat** |

### Light

| player · engine · dpr | tree: flat worst (px < 4.5) · glyph median (% < 4.5) | control 74a2b5d9 (HEAD's ink for that index) | verdict |
|---|---|---|---|
| B pink · ch 1 / ch 2 / wk 1 / wk 2 | 8.605–8.695 (0) · 7.05–7.24 / 11.67–12.89 / 11.67–12.58 / 12.71–12.89 | `oklch(0.5 0.11 190)` **3.210–3.244 (65–685 px under)** · 3.12–3.19 / 3.96–4.81 / 4.24–4.67 / 4.73–4.81 | tree WINS; HEAD red on both statistics |

### The tick, the lane's §2b and the gates

| row | tree | control 74a2b5d9 | verdict |
|---|---|---|---|
| **tick on the tape, product binding (C, amber lap 1)**, core median (p10), % < 3 | dark 6.874 (6.874) ch1 · 6.874 (4.703) ch2 · **4.581 (3.952) wk1** · 6.874 (3.917) wk2, 0 % < 3; light 12.486 / 12.486 / 5.462 / 12.486 | no tick | CONFIRMED; the lane's row 3 reproduces on the product binding |
| **tick FAINT 0.15 plant, same run** | 1.29–1.41, **100 % < 3**, every engine and DPR | — | the negative reds, as it must |
| **the lane's own §2b, unchanged, name painted at 30 %** (the replica on :4243, `plant-faint-text.diff`) | **chromium 1 passed (25.1 s), webkit 1 passed (33.8 s), exit 0 both** | — | **HIT**: §2b can't see a faint name (§1.1) |
| its glyph population under that plant | chromium: **66/66 rows empty (0 px), median printed 0.000**, HEAD's included; webkit: pink 4.001 (84.5 % < 4.5) against the synthetic HEAD 3.641 (100 %) | — | a dropped population passes |
| GATE 4, fresh second publishers (`g4attack6.sh`, rsync copy) | **14 of 17 exit 0** (D1–D14); D15–D17 exit 1; baseline 0, restored byte-equal | — | **HIT** (§1.3) |
| name-arm separation plant D22 (pink name at C 0.063, ΔE 0.062 from violet) | **exit 0**, every gate GREEN | — | **HIT** (§1.4) |
| F1 plant: `withSelfInk` ignores `SELF_TAKES_A_HAND` (rsync copy) | `useSession.test.ts` **37/37, exit 0**; clean 37/37 | — | **HIT** (§1.2) |
| dark name arms, OKLab (my conversion) | L 0.859–0.860 · C amber **0.084** (stick 0.175), violet **0.069** (stick 0.188), pink 0.118, green 0.214, teal 0.146 · Y 0.604–0.673 → flat vs the grid line (Y 0.0772) 5.148–5.692 | — | the lane's arithmetic reproduces (pink 5.148 against 5.139 measured) |
| pairwise ΔE of the name arms | dark min **0.098** (violet–pink); light (the ring arms) **0.077** (green–teal), **0.095** (amber–green); sticks 0.116 light / 0.172 dark | — | under gate 2's 0.10; gate 2 reads sticks only |

### The battery, bare on the tree

| row | tree | control 74a2b5d9 |
|---|---|---|
| `lint:tin` · `--self-test` | 0 · 0 (the self-test's last control: "gate 4 … index.html is RED, as it must be") | absent; the lane's 1 |
| `check-copy-register` · `lint:theme-tokens` · `lint:lanes` · `lint:sleep` | 0 (0 dashes, 0 unadmitted, lexicon 25) · 0 · 0 · 0 | the lane's 0 |
| `test:e2e:projects` · `check-pw-projects` · `check-property-block` (pass6 copy) | 0 · 0 · 0 | the lane's 0 |
| undefined-token census (pass6 copy, `FE=`) | 1 = 0 findings + 1 STALE `--refuse-dur` (declared, A.1.4) | **1**, the same one STALE row (re-run by me on the archive) |

**Other readings.**

- **The roster at ten** reads 9 rows on every page, on the tree and the control alike. The tenth joiner's write never reached the host within a 20 s poll.
  - So the charter's named case (stick 5 on lap 1, the tenth player) **can't be dealt in a local room on either tree**.
  - I read the tick on stick 1 lap 1's product binding instead, beside the lane's five-arm override rows.
- **Delta hygiene.** The pass-6 product delta adds no `filter`, no `@property`, no transition and no animation (a grep of the `+` lines).

---

## 1 · GAPS FIRST (each closable, numbers attached)

### 1.1 §2b's painted clauses cancel under a plant on the label, so a faint name stays GREEN in both engines

§2b's absolute clause reads the SPEC ("spec vs painted ground": the computed `color` against the photographed ground). Every clause that reads PAINTED glyph pixels is relative to HEAD's reading in the same run:

- `glyphMed < Math.min(4.5, headMed)`;
- `glyphUnder > headCell + 0.05`.

**Why that fails.** HEAD is photographed on the same `.washi-label`, so any paint-level change to the label reaches the control too, and the relative clauses cancel.

**The plant.** In a replica, never the tree, I added one line to the tape rule: `-webkit-text-fill-color: color-mix(in srgb, currentColor 30%, transparent)`. `color` stays the name arm, and the name paints at 30 %. Then I ran the lane's own spec, unchanged:

- **chromium 1 passed, webkit 1 passed.**
- In chromium, every one of 66 rows has an **empty** glyph population. `glyph[len >> 1] ?? 0` prints 0.000, HEAD's row included, so `min(4.5, 0) = 0` and `0 < 0` is false.
- In WebKit the pink name's glyph median fell to 4.001, with 84.5 % under 4.5, and passed because the synthetic HEAD fell to 3.641.
- My own instrument on the same replica reads glyph n0 in dark, and 1.943 (100 % under) in light.

**The laws this breaks.** A.5 ruling 3 says existence is not visibility, and the lane shipped the FAINT plant for the TICK but not the name. LAWS P5 says a dropped station counts as under the floor.

**Closable:** §2b takes all three of these:

- an ABSOLUTE glyph median ≥ 4.5 wherever the control clears it (every cell at DPR 2, both engines, on my readings and the lane's);
- an empty or thin glyph population as RED (n ≥ half the text pixels, or print n/N and fail under it);
- the faint-text plant above as its in-run negative, which must red in both engines in the same batch.

### 1.2 F1's unit lost its in-run control, so the NO arm can be severed with the file green

**What changed.** Pass 5's unit ran BOTH arms in one test, each the other's control. Pass 6 re-cut it as `expect(inkOf(self)).toEqual(SELF_TAKES_A_HAND ? inkFor(0) : {})`, which under the shipped `true` only ever exercises YES.

**The plant.** I planted `withSelfInk` to ignore the const (`plant-f1-ignores-const.diff`), which makes the NO arm dead code. `useSession.test.ts` reads **37/37, exit 0** (`readings/f1-unit-plant.txt`).

The lane's "37/37 under both" was a manual flip of the const. That proves the arm builds, but no CI gate holds it.

**Closable:** `withSelfInk` takes the switch as an argument (default `SELF_TAKES_A_HAND`), or the unit `vi.mock`s it, and one test runs both arms; the plant above must red.

### 1.3 GATE 4 is keyed on colour, but only on five spellings: 14 of 17 fresh second publishers pass

The critic's pass-5 set (C1–C11) and the lane's 34 self-test controls all red, and I credit that. My fresh set (`g4attack6.sh` on an rsync copy; baseline 0; restored byte-equal) spells a published name arm (mostly `#ffb4f3`) or builds a peer token another way. **These exit 0:**

| ids | shape |
|---|---|
| D1–D5, D14 | `color(srgb 1 .706 .953)` · `oklab(0.86 0.1045 -0.055)` · `lch()` · `hwb(310 71% 0%)` · `rgb(100% 71% 95%)` · `hsl(0.86turn …)` |
| D6, D7 | `"#ff" + "b4f3"` · `[[255,193,161], …]` |
| D8, D9, D10 | a name-arm table in `src/…/palette.json` · `public/peers.css` · a `.tsx` |
| D11, D12 | `setProperty("--color-peer-" + i + "-name", …)` · `{ ["--color-peer-" + i + "-ring"]: … }` |
| D13 | `color-mix(in oklch, var(--color-peer-5-ring) 60%, white)`, a derived arm |

**These red:** D15 `oklch(86% … deg)`, D16 uppercase hex and D17 `nameL = 0.86`.

LAWS P5 says a gate that enumerates plants is cured for those plants, not for the class. The lane named D1 and the `.join` shape as open itself.

**Closable:** 4a keys the class, not the spellings:

- one CSS `<color>` parser for every colour function;
- the served BUILT bundle scanned beside src, which folds `.json`, `public/` and `.tsx` in and constant-folds literal concatenation;
- a minted-token rule on any string that starts `--color-peer-` followed by a non-literal (concatenation or template).

Or the exempted shapes are written into the gate's header as the chair's estate row.

### 1.4 The name arm is a per-player identity ink with no separation law, and three pairs sit under the family's own 0.10

Gate 2 ("no two players within ΔE 0.10") reads the sticks only (0.116). The name arms read:

- dark: violet–pink **0.098**;
- light (the ring arms by alias): green–teal **0.077** and amber–green **0.095**.

**The plant.** I moved the dark pink name to C 0.063, `#eac2e3`, which is ΔE **0.062** from the violet name. It stays GREEN on every gate (D22), with 3b's hue and 4b's lightness both held.

The lane's own cost row (min pairwise 0.098) states the dark number but not the rule it breaks.

**Closable:** either gate 2 extends to the name arms at a stated floor (moving the arms that miss it), or the exemption is written into the gate with its argument: one name at a time on the tape, and the slug carries the identity. Then the ballot carries the chroma cost (amber C 0.084 against the stick's 0.175, violet 0.069 against 0.188).

### 1.5 The slug is random per run, so the glyph statistic and the DPR-1 top-row clause read a moving payload

**The lane's shortfall.** It reads the top-row cell 8 at chromium DPR 1 as under 4.5 for every ink (names 4.233–4.560 against the synthetic HEAD 3.916), and softens §2b to `min(4.5, HEAD)` for it (the lane's gap 1).

**My reading.** On my slugs (`universal-tiger`, `medical-prawn`), the same cell at chromium DPR 1 reads the tree's pink name at **5.192** (37.8 % under) against the control's **4.846**.

The shortfall is slug-dependent: a glyph median is a property of the text as much as the ink. LAWS P5 says a painted percentage is quoted on ≥ 2 payloads.

**Closable:** pin B's id so that one slug is dealt every run (PAL-WALK's critic pinned `p-0000000b0b0b` → `quickest-rodent`), read the top-row cell on ≥ 2 pinned slugs, and delete the `min(4.5, HEAD)` softening if the pinned slugs clear. Otherwise it goes to the chair as a named estate row with both numbers.

### 1.6 A consumer-less third inline var on every inked cell

`inkFor` now returns three keys, and the record is spread as `style` on every inked cell: the live board (`authorInk`), `PosterBoard`'s `inkAt`, and the banked stills (`bankAuthorInk`).

- `--color-peer-name-ink` has **no CSS consumer**.
- Only `hoveredAuthor`'s JS reads it, as `ink["--color-peer-name-ink"]`.

It's substrate emitted into the DOM for one JS read.

**Closable:** derive the name arm in `hoveredAuthor` from the stick (or keep a separate name map) and leave the cell spread at two keys, with a unit that the cell style carries no `-name` key.

### 1.7 Carried with numbers, not the family's alone

- **The chair's row.** Keep the third arm, or raise the dark ring pair to 0.86. The lane's pricing is the dark ring median 3.99–4.26 against 3.28–3.62; I didn't re-run it.
- **F1's frame** was shot with the struck URL arm and was not re-shot with the const (argued: the same branch).
- **The roster at ten** is n−1 on both trees (9/9/…/9), and the tenth joiner's write never reaches the host. So the stick-5-lap-1 tick is undealable locally. That belongs to the chair or W8, beside "sixteen, 0/16".
- **Inherited:**
  - W2 §2.5 3/3/2, cured at the §10 fold by TAPE's clip;
  - the dark filter census 4/6 on both dists (`crayon-heart`, fold pick 1);
  - the relay and a device (W8 §8.3);
  - goldens not re-run (π 0 built-vs-built instead: the lane's reading, which I did not re-run; the delta is room-only by code-read).

---

## 2 · The advance, credited

- **The dark name is cured on paint against the TRUE control, not a synthetic one.**
  - Pass 5 read the dark name at 3.921 with 465 px under 4.5. Now every name arm reads flat 5.139–5.271 with 0 px under.
  - On the glyph statistic it beats HEAD's own ink for the same player index at every cell, both engines, DPR 1 and 2 (dark 5.19–6.87 against 4.28–6.02).
  - HEAD's own index-5 dark name is red flat (4.209, 53–279 px under), so the tree cures a HEAD red in dark too. In light it beats HEAD from 3.2 to 8.6 flat.
  - The lane's in-run "HEAD" (`oklch(0.8 0.11 137.5)`) is HEAD's best hue, so its comparison was the conservative one.
- **The feasible window was searched before minting.** The grid line's Y 0.0772 reproduces, and so does Y ≥ 0.522 for 4.5. My OKLab reads give pink at 5.148 against the measured 5.139.
- **The tick rides the name through one var.** No new consumer: `PlayerTick.vue` is untouched and the tape rule is back to HEAD's line. It paints 4.58–12.49 on the product binding, with FAINT, X1 and X2 all redding.
- **GATE 4 took the class step.** It moved from names to colour and reds the pass-5 attack set and the lane's 34 controls. The innocent-literal distance (ΔE 0.0315, the sun outline) is printed every run.
- **Housekeeping is done.**
  - TIN's L6 is struck by name, and WALK's L6 is run with its 0.32 plant.
  - `?selfink` and `selfTakesAStick` are gone (grep 0), and `SELF_TAKES_A_HAND` has one home.
  - The prettier form is named: `npm run lint` 0|0, and bare `npx prettier --check .` reds both trees (1|1).
- **The ballot frame is lawful.** One payload, one hover, one variable (the label's `--color-user-ink`), each pair within one engine. I looked at it: the dark name arm is a paler peach, the light name is near-black olive-brown, and the upright reads as `|` in every panel.

---

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT**: F1's unit is 37/37 with the NO arm severed (§1.2) |
| spec-cites-itself | **HIT (variant)**: §2b's in-run control shares the subject's label, so every painted clause is relative to a reading the plant also moves (§1.1) |
| gates that cannot fail | **HIT**: §2b is GREEN on a faint name in both engines (§1.1). GATE 4 is cured for plants, not the class (14/17, §1.3) |
| elegant-reduction trap | clear. The hard part (the dark ink) was done on paint, not deferred |
| legacy aliases | clear. The URL arm is gone. The light name is an alias of the ring arm BY DESIGN, argued in both comments |
| masked fallbacks | **HIT**: an empty glyph population prints 0.000 and passes (`?? 0` against `min(4.5, 0)`). The `ink && {…}` with a `{}` ink binds `undefined` and inherits the house ink silently (no peer path found; pass-5's note stands) |
| unverified gestalt | clear for the pair framed (amber). The chroma cost on violet (C 0.069) and pink is stated, not framed; that's the owner's |
| consumer-less substrate | **HIT (soft)**: `--color-peer-name-ink` is inline on every inked cell with no CSS consumer (§1.6) |
| the generic default | clear |
| π | clear on the lane's built-vs-built 0 over 1155/1115 nodes with planted 81 (not re-run). The delta is room-only: `hoveredAuthor` needs `roomId`, and the third key exists only in a room |
| the constraint it forgot | **HIT (soft)**: the family's own separation law (0.10) is not applied to the new arm (§1.4) |
| AA both themes, PAINTED | **CLEAR**, a cure. Both themes, both engines, DPR 1 and 2, flat and glyph; beats the control everywhere measured |
| filterBudget | clear by construction (no filter in the delta). Dark 4/6 is inherited from the control |
| M16 | clear: `check-copy-register` bare 0, 0 unadmitted |
| @property law | n/a: nothing registered; `check-property-block` 0 |
| undefined-token census | clear: 0 findings + 1 declared STALE on both trees |
| decided history | L6 MOVED (WALK's form reds by the section fork; TIN's is struck). L3 is spent. R1–R3 born-RED is the lane's reading, not re-run |
| W2's landed mechanics | respected |

---

## 4 · Ballots (both frames looked at)

- **F1** (`SELF_TAKES_A_HAND` YES | NO): pass-5 frame 1 stands. It's ready for the owner with §1.2's caveat that the NO arm has no CI gate.
- **B-TAPE, the ink half** (`frames/1-b-tape-ink-…-dpr2.png`, 22,989 B): lawful.
  - Dark: the ring arm (`rgb(255,159,107)`) | the name arm (`rgb(255,193,161)`).
  - Light: the stick (`rgb(133,57,0)`) | the name arm (`rgb(75,29,0)`).
  - The firing default must not lose to the control, and it doesn't (§0).
  - The ballot row should state the chroma cost per arm (amber 0.175 → 0.084, violet 0.188 → 0.069) and the name-arm ΔE (§1.4).
- **The lap-1 tally reads as a `|`** in every panel: the owner's eye.
- **The chair's row:** the third arm, or the dark ring pair at 0.86 (lane-priced).

## 5 · What closing costs

Half a day, and none of it is a missing primitive:

1. §2b's absolute floor, the empty-population red, the faint-text negative and a pinned slug;
2. F1's unit taking the switch as an argument;
3. GATE 4 on a colour parser plus the served bundle;
4. the separation rule applied or exempted in writing;
5. the cell spread back to two keys.

The design is sound on the surface it owns. The gates around it are what stay open.

## 6 · Incidents (self-declared)

1. **My first run asked for a room of ten** (to deal stick 5 on lap 1). The host's roster read 9 on every page on both trees, and B's digit never reached A. I re-cut to a room of six (B index 4, C index 5); the ten-room finding is carried in §1.7.
2. **My first glyph statistic keyed coverage on LUMINANCE.** That over-admits fringe pixels in light, because the blend is in sRGB bytes. I added the byte-space coverage and re-ran chromium DPR 1 on both arms. Every number cited above is the byte form (`BYTEcov`), and the luminance column stays in the readings as a sensitivity row.
3. **A zsh word-split slip** made one plant command exit 2 (`sed` with a multi-line variable). I re-ran it with explicit values; nothing was written to any tree.
4. **Plants lived only in scratchpad copies:**
   - `tincrit6-g4copy` (the GATE 4 plants and the F1 plant, each restored `cmp`-equal);
   - `tincrit6-plant` (the faint text, served on :4243).

   No `rm` was used. The scratch lives in lane-unique `<scratchpad>/tincrit6*` directories and `trash-tincrit6-1/`, and is the chair's to clean.
