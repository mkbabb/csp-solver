# PAL-TIN · pass-8 CRITIQUE: the pass-7 reds are cured and reproduce to the decimal, but gate 4 still enumerates, its behavioural leg can't fail on a shipped second publisher, and the same-index control is painted on the wrong label

Critic of §11c's second family. I didn't write the charter or the prototype. Every number below is mine unless it's attributed. Taken 2026-09-26 on the unedited lane tree `wf_308fa864-c94-2`.

- **Box load:** 11.9 at open, 13–43 during the runs. Each log's head line prints it.
- **Base and π control:** `74a2b5d9`, served from the shared `w7-control` on :4251 (`index-CubiZsMVSwTc.js`, verified by hash).
- **The tree:** served on :4245 from my own out-of-tree build. It's the same bytes as the lane's `index-OjJxZB3ljh7A.js` / `index-aaNZWoto1P9b.css`, and `diff -rq` with a clean `git archive 74a2b5d9 + pass8.diff` build returns 0. The served CSS is `cmp`-equal to it, with no `.antialiased`.
- **Both servers** were stopped by PID after I checked their cwd. Both ports are free at return.

**VERDICT: ADVANCE at 87** (from 86).

The +1 is earned by the rows that closed and that I reproduced:

- **Row 2:** `--dist` now reads 99.99 % of the shipped JS.
- **Row 4:** §2b is clean on a built dist in both engines, with the mechanism named.
- **Row 5:** a bare `lint:tin` exits 0 from the product homes.
- **Row 6:** the light ring pair is gated.
- **Row 3's named plants:** the pass-7 set reds 20/20.

Every number the lane printed that I re-derived matched to the third or fourth decimal (§0).

The number doesn't move further because of four things this critique found:

1. **Gate 4 is still enumerated.** 15 of 25 fresh publishers exit 0, and the lane's own D49 plant is vacuous (§1.1).
2. **The new BEHAVIOURAL row §2c can't fail on the condition it names.** A second publisher shipped in the product passes the source gate, `--dist`, §2c and §2b, in both engines (§1.2).
3. **Row 1's same-index control is HEAD's ink painted on the tree's ticked label.** Painted on HEAD's own label, dark pink loses 2 of 3 chromium DPR 1 cells and green loses 2.5× deeper than printed (§1.3).
4. **The separation law's floors are unpinned.** MIN_DE, RING_FLOOR and EXEMPT_FLOOR can each be loosened with the self-test still at 0 (§1.4).

---

## 0 · NUMBERS FIRST (re-derived by me)

### 0.1 The bank

| check | reading |
|---|---|
| tree diff through a temporary index (`GIT_INDEX_FILE` in scratch) vs `74a2b5d9`, `--binary` | sha1 **9f0ea6b9**, 509,486 B, 27 files +10,644/−83, write-tree **15df98f1**. **`cmp`-equal to `pass8.diff`** |
| `git apply --check pass8.diff` on a fresh `git archive 74a2b5d9` | **0** |
| the delta vs pass-7 + homes (`pass8-delta-homes.diff`) | 5 files: ci.yml, the spec, the gate, the library, and one `useSession.ts` JSDoc line. **The product is pass 7's.** |
| homes by sha | homes.diff `a1d8adeb` applied gives the library `5b8739d5`. The five `e2e/lib` homes are **byte-equal** to the tree's (glyph-pop `07bca94b`, paint-lib `1321f0a6`, edge-bands `00abd56d`, postpaint `5372a652`, rest-probes `2f0e6b02`). homes + the PROPOSED `973dc19f` equals the tree's library `bf5e8aa6` **byte-exact**. No fork. |
| imports | spec: `./lib/glyph-pop.mjs`, `./lib/paint-lib.mjs`, `../scripts/shape-census.mjs`. gate: `./shape-census.mjs`, static. **No `docs/` path** anywhere in the spec or gate. |
| WALK hand-over | WALK's banked `check-peer-arcs.mjs`, extracted from WALK's `pass8.diff`, hashes to **bb15c9e1**. `separation-law.into-walk-gate2.diff` (**c8c129f7**) passes `apply --check` **0** on it. |

### 0.2 Node gates on the tree (bare)

| row | tree | control |
|---|---|---|
| `node scripts/check-peer-tin.mjs` | **0** (256 files; nearest innocent literal ΔE 0.0315, `#D16A32`) | — |
| `npm run lint:tin` | **0** | **1** (script absent) |
| `--dist <my build>` | **0** (291 files) | — |
| `--self-test --dist` | **0** | — |
| `--sabotage-battery --dist` | **30/30 bite** (channel-arity by a throw, exit 1) | — |
| library `--self-test` | **97/97**, 45/45 planted | — |
| library `--sabotage-battery` | **45/45** | — |
| born-RED `--self-test --lib <homes 5b8739d5>` | **92/97**, exit 1: the 5 new clauses fail on the seed | — |
| `check-copy-register` (M16) | **0** (0 dashes, 0 jargon) | — |
| `@property` in the served CSS | **1** | **1** (no new registration) |
| filterBudget | 0 `filter` lines in the product delta (grep); `PlayerTick.vue` is frozen with no live filter. **Census not re-run** (§3). | — |

### 0.3 The pass-7 plant FIRST: the pass-7 critic's D23–D40 on an rsync replica with the final gate

**20/20 exit 1** (`readings/gate4-critic-attacks.txt`): packed int, `.join`, template, p3, rad/grad, `\x23`, CSS `\62`, Tailwind indigo-200 and teal-800, slash-alpha, color-mix through the cursor token, minted split/concat/join, `oklch(from #000 …)`, lab, oklch-alpha, const-ident concat, mixed case. Baseline 0 before and after, and the replica restored byte-equal.

The pass-7 dist plant reds too. In a copy of the shipped entry chunk, a plain `"#ffb2f3"` at byte 151,038 reds **alone** (exit 1). This is also the negative control for §1.1c.

### 0.4 Re-derived on the real surface: two of the lane's rows, both engines, built dist, DPR 1, 1280×800, B pinned

- **§2b B-TAPE, dark green (peer-2) vs the lane's same-index control (`HEAD_INK(1)` on the tree's label).**
  - Chromium: cell 11 **3.106 vs 3.209, Δ −0.103**; cell 12 3.127 vs 3.191, Δ −0.064; cell 8 +0.022. That's the lane's worst row (−0.103) exactly.
  - WebKit: +1.29 to +1.35, no loss.
  - Clean run exit 0 in each engine.
  - Plants, chromium: FAINT30, FADE65, FADE80, TAIL12, TAIL35, HEAD12, MID20 and EMPTY each RED 4/4.
  - Plants, WebKit: the same except FADE80 (printed), which reads RED 3/4 and GREEN 1/4. That matches the lane's deterministic split.
  - In-run negative: 3.921 chromium / 3.926 WebKit, both < 4.5.
- **§2c** reproduces to the fourth decimal in both engines:
  - Clean name ΔE: 0.0000 light; 0.0102 dark in chromium, 0.0000 dark in WebKit.
  - P1: 0.1262 / 0.2225 (chromium dark) / 0.2234 (WebKit dark).
  - P3: 0.0493 / 0.0563 / 0.0501.
  - Readings: `readings/rederived-s2b-s2c-tree-built.txt`.
- **The rung condition on the REAL HEAD.** Chromium DPR 1 product rows read "RED G2" 10/10 per run and pass by the T9-R8 rung, which holds only while HEAD's same-index ink also reads under 4.5. I read HEAD's real tape on the control: **8/8 rows 1.791–3.568 < 4.5**. The rung's condition holds on HEAD itself, not only on the lane's simulation.

### 0.5 π on the unclaimed solo surface: tree :4245 vs control :4251

Same `?board=` payload (the spec's BOARD), PRM, 1280×800 FINE, DPR 1, both themes (`readings/pi-solo-tree-vs-control.txt`).

| engine | tree vs control | floors (control on/off · control vs 2nd control · tree on/off) | plant (1 px outline on cell 1) | nodes |
|---|---|---|---|---|
| chromium light / dark | **0 / 0 px** | 0 · 0 · 0 | 3,032 / 3,036 px | 1155 / 1155 |
| WebKit light / dark | **0 / 0 px** | 0 · 0 · 0 | 2,554 / 2,554 px | 1155 / 1155 |

The lane's return carried no π reading this pass. This closes that row for the critic.

---

## 1 · GAPS FIRST (each closable; numbers attached)

### 1.1 Gate 4's class is still enumerated: 15 of 25 fresh publishers exit 0

Critic plants C1–C23, on an rsync replica, the final gate `07e85589` / library `bf5e8aa6`, one at a time, baseline 0 before and after. Log: `readings/gate4-critic-attacks.txt`.

**Red (10):**

- a hex HTML entity `&#x23;ffb2f3`
- a 6-digit CSS escape `#ff\0000622f3`
- an `@property` `initial-value`
- `(0xb2f3).toString(16)`
- the named colours `darkmagenta` (ΔE 0.0165 from the light pink stick) and `lightsalmon` in TS
- `#fbf` (ΔE 0.0231)
- a Tailwind arbitrary property that re-declares an arm
- `light-dark()`
- a `public/*.svg` fill

**Escape (exit 0), by class:**

a. **The regex/division heuristic** (`regexStart` decides on the previous significant character):
   - **C1** `[function () {} / 2, "x/", "http://a.b", "#ffb2f3"]`: the division after `}` is read as a regex that ends at `x/`, and the URL's `//` then blanks to the end of the line.
   - **C2** `if (e) /\/\//.test(t); return "#ffb2f3";`: the regex after `)` is read as a division, and its `//` blanks the rest of the line.
   - **In the SHIPPED entry chunk** (`readings/dist-c2-blanked-fraction.txt`, `gate4-dist-and-e2e-escapes.txt`): C2's 23 bytes at offset 50,011 blank **163,997 B = 75.40 %** of the chunk (0.00 % clean). The plain copy at byte 151,038, which reds alone, then draws **0 findings**, exit 0.
   - Charter row 2 asked that "your plant reds wherever it is appended". It doesn't after a `)`-regex.
b. **A JS unicode escape.** `"#ffb2f3"` folds to `"⏿b2f3"`. The library's `unescapeJs` regex `\\u\{?([0-9a-fA-F]{4,6})\}?` eats six digits, `0023ff`, as U+23FF. That's a bug: `\uXXXX` is exactly four digits. `"\u{23}ffb2f3"` (C4) doesn't match at all.
   - **The lane's D49 "unicode-escape-hash" is VACUOUS.** Its body in `g4attack8.sh` is the literal `"#ffb2f3"`: the escape was decoded before the script was written, and the log line proves it. It's counted in the lane's 45/45. My first C3 fell into the same trap and was re-planted with verified bytes (`od -c`).
c. **The parser's colour spaces.** `color(xyz …)`, `color(xyz-d65 …)`, `a98-rgb`, `rec2020` and `prophoto-rgb` parse to **null**. C16a is `color(xyz-d65 0.7333 0.5957 0.9243)`, the pink name to 4 dp, in a sheet; C16b is `color(xyz …)` in TS. The header's "every CSS `<color>` syntax" is false.
d. **Data-shaped colours:**
   - C9 `String.fromCharCode(35) + "ffb2f3"`
   - C12 an RGBA byte quad `[255, 178, 243, 255]`
   - C13 a float triple `[1, 0.698, 0.953]`
   - C14 a bare-hex table read by index, `"#" + T[i]` over `["ffb2f3", …]`
e. **A second binder of the ink channel, drifted.**
   - C18a: `{ "--color-user-ink": ["#9a3d00", "#3f6a00", "#006e73"][i] }`
   - C18b: `setProperty("--color-user-ink", "#9a3d00")`
   - `--color-user-ink` is the token `inkFor` binds and every cell strokes. A second, disagreeing publisher of a player's ink under that name is exactly "agree or disagree, whatever the name" (the gate's header), and nothing reads it. g4-decl keys on `--color-peer-*` only, and g4-table keys on a table's NAME.
f. **The gate's own walker** (§1.2 has the end-to-end case):
   - C7a: `.pcss` re-declares `--color-peer-5-name`.
   - C7b: `.pcss` holds a copy.
   - C23: `index.css` `@import`s a sheet outside `src/` holding a copy **and** a re-declaration.
   - The same re-declaration in a `.css` (C7c) reds, which is the control.

**Why it's structural, not a list to append to.** LAWS P7 §F(i) says a source-shape gate imports the one library and never carries a second reader. `check-peer-tin.mjs` hand-rolls `sourceFiles()`:

- an extension regex without `.pcss`/`.postcss`;
- `src|e2e|public` only;
- no `@import` chain.

The library already exports that walker: `sources()` with its `isCss` (the `pcss` clause, ERASE's) and `followImports` (the `import-chain` clause, WALK's). Its `--dist` reader also deletes every `--color-peer-N…:` declaration in the bundle before reading (`bundleFiles`). So a re-declaration outside `index.css` is invisible to `--dist` **by construction**, not by omission.

### 1.2 §2c, the behavioural leg, can't fail on a shipped second publisher

§2c compares the painted core against `want = getComputedStyle(label).color`, which is whatever the cascade resolves. It never compares against the table's authored bytes. So it can only red a plant injected after `want` is read, which is what P1–P3 are. A second publisher in the PRODUCT moves `want` with the paint.

§2b's own binding assertion (`names` ⊇ `own.spec`) has the same shape: `names` is read from `var(--color-peer-k-name)` through the cascade.

**Demonstrated end-to-end** (`readings/planted-pcss-override-e2e.txt`, `gate4-dist-and-e2e-escapes.txt`). This is the tree plus `src/games/shared/tin.pcss` holding `html.dark { --color-peer-1-name: #ffd9b8; }` (a drifted amber name, ΔE 0.0575 from the nearest arm, L 0.909), imported by `GameBoard.vue`. The build is `index-DUbEFlut2m4Y.js` / `index-okxAn0NK9PjX.css`, and it ships `html.dark{--color-peer-1-name:#ffd9b8}`.

| arm of gate 4 | reading on the planted build |
|---|---|
| source gate `check-peer-tin.mjs` | **exit 0** GREEN |
| `--dist` on the planted dist | **exit 0** GREEN (291 files, 0 findings) |
| §2c chromium / WebKit | **exit 0 / 0**: "the arm rgb(255, 217, 184)", name core ΔE 0.0120 / 0.0000. The published arm is `#ffc1a1` = rgb(255, 193, 161). |
| §2b chromium / WebKit (whole population, plants in-run) | **exit 0 / 0**: the product row reads `rgb(255, 217, 184)` as B's name |

B's tape paints a colour `index.css` doesn't publish, and every row the lane offers as "one publisher" is green in both engines.

A magenta variant (`#f0f`) also passed source, `--dist` and §2c in both engines. §2b red it only on contrast (flat 2.635), which is an AA verdict, not a publisher verdict.

**The cure is one line of reference.** §2c's `want` must be the authored hex the gate reads out of `index.css` (the gate already parses it), never the cascade.

### 1.3 Row 1: the same-index control is painted on the tree's ticked label, and on HEAD's own label B-TAPE loses in pink too

The lane's control paints `oklch(L 0.11 i×137.5)` onto the **tree's** label. For B (index 5, second lap), that label carries the tally. I served the control and read HEAD's same-index ink on **HEAD's own label**: same pinned room, same board, same join order, same slug and cells. The control resolves c1 → `oklch(0.8 0.11 137.5)` and B → `327.5`, so the index mapping holds (`readings/head-real-vs-lane-sim.txt`, `btape-each-arm-own-geometry.txt`, two chromium runs identical to the third decimal).

- **Where there's no tick, the lane's simulation IS HEAD.** For writer 1 (c1, no tally on the tree), the simulation equals HEAD's real painted tape in 8/8 rows in both engines (e.g. dark 3.568 = 3.568, WebKit 5.503 = 5.503). At cell 8 (the flipped tape), chromium agrees within 0.03.
- **On B's ticked tape above the cell (cells 11/12), the simulation reads LOW:**

  | engine | theme | HEAD real | lane's simulation |
  |---|---|---|---|
  | chromium | dark | 2.71–3.37 | 0.16–0.20 lower |
  | chromium | light | 1.92–2.06 | 0.08–0.12 lower |
  | WebKit | dark | 4.96–5.55 | ≈ 0.21 lower |

  The tally shifts the name's rasterization. That's a second variable carried by the pair, and no caption names it (LAWS P7 §C).
- **The ten keys against HEAD painted on HEAD (chromium DPR 1 dark, cells 11 / 12 / 8, deterministic ×2):**

  | key | tree name arm | HEAD same-index, own label | Δ | lane's Δ (vs the simulation) |
  |---|---|---|---|---|
  | peer-1 amber (i=0) | 3.402 / 3.398 / 2.954 | 2.713 / 2.718 / 2.328 | +0.689 / +0.680 / +0.626 | wins |
  | peer-2 green (i=1) | 3.106 / 3.127 / 2.773 | 3.371 / 3.348 / 2.698 | **−0.265 / −0.221** / +0.075 | −0.103 / −0.064 / +0.022 |
  | peer-3 teal (i=2) | 3.047 / 3.059 / 2.712 | 2.792 / 2.833 / 2.392 | +0.255 / +0.226 / +0.320 | wins |
  | peer-4 violet (i=3) | 3.453 / 3.455 / 3.004 | 2.767 / 2.769 / 2.365 | +0.686 / +0.686 / +0.639 | wins |
  | peer-5 pink (i=4) | 2.899 / 2.941 / 2.614 | 2.941 / 2.986 / 2.490 | **−0.042 / −0.045** / +0.124 | wins (+0.159 / +0.164 / +0.154) |

  - **Light:** every key wins in both engines (tree 2.07–2.42 vs HEAD 1.64–2.06 in chromium).
  - **WebKit dark:** every key wins (pink +0.261 / +0.074 / +0.393; green +1.145 or more).

**What this does to the ballot.** The lane's "pink 0/36 losses against same-index" doesn't survive the real control. B-TAPE's named loss is **green −0.265 worst and pink −0.045 worst**, chromium DPR 1 dark, not green −0.103 alone (LAWS P6/P7 §G: the default names its loss on every measured axis).

The one-variable reading on one label (the lane's) is lawful as an ink comparison. It still owes the tally as a declared variable, and the chair both readings.

### 1.4 The separation law's floors are unpinned (threshold plants on a replica copy of the gate)

`readings/threshold-and-walker-plants.txt`: each constant was loosened in turn, `--self-test` run, and the gate restored byte-equal.

| plant | self-test | meaning |
|---|---|---|
| `MIN_DE` 0.10 → 0.09 | **exit 0** | no control sits in (0.09, 0.10); D22 is at 0.062. The dark names ship at **0.1011**, 0.0011 over the floor. |
| `RING_FLOOR` 0.075 → 0.05 | **exit 0** | row 6's new floor is guarded by no boundary control |
| `EXEMPT_FLOOR` 0.075 → 0.05 | **exit 0** | the light exemption's floor, the same |
| `COPY_DE` 0.03 → 0.02 or 0.012 | exit 3 | pinned (a control sits in the band) |
| `SCALAR_EPS` 0.005 → 0.015 | exit 0 | within the 4b control's +0.02 (fine) |
| walker drops `e2e/` or `.svg` | **exit 0** | the header's "a test fixture is a publisher too" has no control |

The floors are what WALK inherits by sha. A law handed over with an unpinned number is the vacuous-convergence row. Cure: one control per floor at floor − 0.005.

### 1.5 Carried (the lane's own gaps, confirmed)

- **Row 7:** WebKit FADE80 RED 3/4 (mine) against the 4/4 the charter asked for. It stays printed.
- **Row 9:** L6 in WALK's form was not run on this tree.
- **Row 8:** roster n−1 at ten is cited (W8's), not re-run.
- **The library's PROPOSED `973dc19f` isn't folded into the one home.** It's byte-exact with the tree. It carries the §1.1b `unescapeJs` bug, and the chair should fold it with that cure.
- **Watch 2 HALF MET.** The separation law at room 5 reds WALK's walk (the lane's `logs/walk-gate-with-tin-law.txt`). The hand-over applies by sha (§0.1). WALK and the chair decide.
- **`channel-arity`'s sabotage bites by a throw (exit 1), not by a named control.**
- **Units** were not re-run on the final tree. The lane cites them from its arF archive.

---

## 2 · The advance, credited (each reproduced)

- **Row 2.** The regex-aware `stripJs` blanks **0 B** of my build's entry chunk (the lane reports 26 B / 0.01 % over the bundle). `--self-test --dist` reds the pink name at bytes 971, 108,885 and 217,448 of the real chunk, plus a folded `.join`.
- **Row 3.** The pass-7 set 20/20 red. The gate sabotage battery 30/30, the library 97/97 and 45/45, born-RED 92/97. §2c reds its three in-run plants in both engines at the lane's exact ΔE.
- **Row 4.** §2b exits 0 on the clean built dist in chromium (1.0 m) and WebKit (1.4–2.1 m). `transient 0/0`, `outside-run 0` on the product rows I read.
- **Row 5.** The instruments are imported from the homes by relative path, and a bare `lint:tin` exits 0 on the tree (the control exits 1).
- **Row 6.**
  - The ring arms are in gate 2: light 0.0769 ≥ 0.075, dark 0.1495 ≥ 0.10.
  - My re-derivation: light sticks 0.1162, light rings 0.0769 (green–teal), dark sticks 0.1724, dark rings 0.1495 (teal–violet), dark names 0.1011 (violet–pink).
  - The hand-over diff applies to WALK's gate blob by sha.
- **Product.** π 0 px on the solo surface in both engines and both themes; M16 0; `@property` unchanged (1 | 1); no filter line in the delta; the dist is reproducible out-of-tree.

---

## 3 · Failure-mode checklist

| mode | reading |
|---|---|
| vacuous convergence | **HIT**: the separation floors are unpinned (§1.4); D49 is a vacuous plant counted as a pass (§1.1b) |
| spec-cites-itself | **HIT**: §2c's reference is the subject's own computed colour (§1.2) |
| gates that cannot fail | **HIT**: §2c and §2b on a shipped re-declaration; `--dist` deletes re-declarations before reading (§1.1f, §1.2) |
| elegant-reduction trap | **HIT**: "one parser, read the way the bundler ships it", but 15/25 fresh shapes, the `)`-regex and xyz escape (§1.1) |
| legacy aliases | clear: the light name IS the ring by design, argued and floored |
| masked fallbacks | soft: the chromium DPR 1 G2 rung covers 10/10 product rows. It's lawful, and its condition was verified on the REAL HEAD (8/8 < 4.5, §0.4). |
| unverified gestalt | no frames banked by the lane or by me; numbers only. The pairs are owed with the tally declared (§1.3). |
| consumer-less substrate | clear: `nameInkOf` has one consumer (the lane's grep; not re-run) |
| the generic default | n/a |
| π | **0 px** in both engines and both themes on solo, with the plant red (§0.5) |
| AA painted / filterBudget / M16 / @property | AA: product painted in both engines (§0.4, rung-lawful). filterBudget: census not re-run, 0 filter lines in the delta. M16 0. `@property` 1 \| 1. |
| an instrument imported from docs/ or hand-rolled after batch 0 | **HIT (file walker)**: `sourceFiles()` hand-rolls what `shape-census.sources()` already reads, and misses its `pcss` and `import-chain` clauses (§1.1f). The colour, strip and fold readers are the library's. |
| a number the critic didn't re-derive | re-derived: bank sha, apply-check, homes by sha, B-TAPE dark green, §2c ×2 engines, the sabotage batteries, born-RED, the separation minima, the rung on HEAD. Not re-run: filterBudget census, units, L6, roster n−1, DPR 2 rows. |

---

## 4 · What pass 9 must close (rows, each with its plant)

1. **§2c and §2b read the AUTHORED arm.** The reference is the hex the gate parses out of `index.css`, never `getComputedStyle`. Plant: the `.pcss` re-declaration build above (`#ffd9b8`) must red in both engines.
2. **The gate imports `shape-census.sources()`** (pcss, the `@import` chain, `public/**`, `index.html`), and `--dist` stops deleting `--color-peer-*:` outside the sheet's own block. Plants: C7a, C7b, C23 and the planted dist.
3. **The stripper's `)`/`}` ambiguity.** Either a tokenizer-grade rule (keyword-before-paren for `if`/`while`/`for`) or the blanked fraction printed and bounded per file, with the C2-in-chunk plant (75.40 %) as the negative.
4. **`unescapeJs`:** `\uXXXX` is 4 digits and `\u{…}` is 1–6. Plants: C3 and C4 with bytes verified by `od -c` in the log. D49 re-cut or struck.
5. **The parser:** `color(xyz|xyz-d50|xyz-d65|a98-rgb|rec2020|prophoto-rgb …)`, with the C16 plants.
6. **The ink channel:** any `--color-user-ink` / `--color-peer-cursor-ink` binding outside `playerIdentity.inkFor` reds (C18a, C18b).
7. **Boundary controls:** one control per floor at floor − 0.005 (MIN_DE, RING_FLOOR, EXEMPT_FLOOR), plus e2e and svg walker controls.
8. **B-TAPE:** the ten keys against HEAD painted on HEAD's own label, beside the one-label reading. The tally is declared as the pair's second variable, and pink's loss is written into the ballot.
9. **Carried:** row 7 (WebKit FADE80), row 9 (L6), the PROPOSED library folded with item 4's cure, units on the final tree.

## 5 · Replay route (instruments/, all scratch, no `rm`)

- **Builds:** `instruments/vite.build.mts` (tree → out-of-tree dist), `vite.repp.mts` (the planted replica).
- **Serving:**
  - The preview server comes from `vite.preview.mts`.
  - The control is served from `w7-control` with its own `.vite-control.config.ts` on :4251.
- **Browser:**
  - `spec.sh` runs the lane's spec from a Playwright config outside the project root.
  - `crit.sh` covers head-real and π.
  - `crit2.sh` covers B-TAPE on each arm's own geometry.
  - `headreal.spec.ts` is the critic's probes. It imports the homes by absolute path and is a critic instrument, not product.
- **Node:**
  - `g4crit8.sh` runs the attacks on an rsync replica and restores byte-equal.
  - `thresh.sh` runs the threshold and walker plants on a replica copy of the gate.

## 6 · Incidents (self-declared)

1. **The harness decoded `#` in my tool input**, so the first C3 plant was the literal `#ffb2f3` (red, meaningless). I caught it by `od -c`, re-planted from `String.fromCharCode(92)`, and verified the bytes. The lane's D49 carries the same defect unflagged (§1.1b).
2. **My first critic-probe run was void.** The scratch spec directory had no `"type":"module"`, so the `.mjs` homes failed to load. It found no tests and read nothing. Its logs are moved to `logs/void1` in scratch, and it was re-run.
3. **I ran `git status`, and a temporary-index `git read-tree`/`git add -A` with `GIT_INDEX_FILE` in scratch, in the lane's own tree** (the DO instruction's route). Its real index wasn't touched. I never ran git in the control.
4. **The first planted replica build failed:** `csp-solver/data` was absent from the rsync replica. I linked it from my own archive copy and rebuilt. The build wrote nothing in the tree; the lane tree's `git status` at return is its 18 M + 5 ?? product paths.
5. **I wrote no frames**, so none of ruling 18's headroom is spent. There were no `/tmp` writes and no `rm`; discards went to `<scratchpad>/critic-tin8/trash-tincrit8-1`.
