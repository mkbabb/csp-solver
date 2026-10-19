# PAL-TIN · pass-9 CRITIQUE: rows 1–3 close and reproduce to the decimal, but gate 4 still enumerates, the behavioural twin reads one arm of ten, and watch 2's hand-over doesn't apply to WALK's live gate

Critic of §11c's leader. I didn't write the charter or the prototype. Every number below is mine unless attributed.
Taken 2026-10-08 21:03–21:30 on the unedited lane tree `wf_308fa864-c94-2` (base `74a2b5d9`, nothing committed).

- **Box load:** 29.2 at open, 13–34 through every timing and paint row (each log's head prints it). No row was read above 120.
- **Control:** `74a2b5d9`, the shared `w7-control` on **:4239** (`index-CubiZsMVSwTc.js`, served identity checked by curl).
- **Tree:** **:4245**, my own out-of-tree build of the lane tree: `index-BEvB64Xx8VeY.js` / `index-aaNZWoto1P9b.css`, the
  same bytes the lane served. The lane tree's in-tree `dist/` is stale (`index-BmfsuLrclYiB.js`); nobody served it.
- **Servers:** started by me, killed by recorded PID after a cwd check (:4245 rotated through three builds; see §3). Both
  ports free at return.

**VERDICT: ADVANCE at 88** (from 87).

The +1 is the three pass-8 holes this lane closed, each reproduced by me to the printed decimal in both engines:

- **Row 1 (on its plant):** §2c reads the AUTHORED arm. The peer-1 `.pcss` plant reds §2c in chromium (0.0475 / 0.0575) and
  WebKit (0.0575 / 0.0575); the clean build is GREEN with every value the lane printed (§0.2).
- **Row 2:** the HEAD-on-HEAD same-index control. All 60 key rows reproduce; the four chromium-DPR-1-dark losses read
  −0.265 / −0.221 (green) and −0.042 / −0.045 (pink) exactly (§0.3).
- **Row 3:** MIN_DE, RING_FLOOR and EXEMPT_FLOOR are pinned on literal values; my own edge moves bite where the pins say (§0.4).

It doesn't move further. This critique found:

1. **Gate 4 is still ENUMERATED (registry-v8 §2.12: OPEN).** 12 of 24 fresh publishers exit 0 on the source gate. Four
   classes exit 0 on the source gate AND on `--dist` (CI's second arm): Typed OM `attributeStyleMap.set`, `Reflect.apply` of
   `setProperty`, a `%23`-encoded data-URI copy, and `@property` registering an arm with `inherits: false` (§1.1).
2. **The behavioural twin reads one arm of ten.** A shipped `.pcss` that re-declares **peer-3**'s dark name is GREEN on §2c in
   both engines. The same plant on peer-1 reds. The row was cured for the charter's plant, not its class (§1.2).
3. **A g4-decl disjunct is unpinned.** With the quoted-key disjunct (`"--color-peer-N-…":`) deleted, `--self-test` exits 0.
   The disjunct is live: on that copy, `{ "--color-peer-5-name": "#000" }` exits 0, and on the shipped gate it exits 1 (§1.3).
4. **Watch 2 isn't closed.** TIN's hand-over (`7bc3bc57`) was cut on WALK's PASS-8 blob `bb15c9e1`. On WALK's live pass-9
   gate (blob `1ee13421`), `patch --dry-run` fails **4 of 5 hunks** (exit 1). WALK's critic reads the same. The batch gate
   "watch 2 closed in WALK's gate 2" is unmet (§1.4).
5. **§2b is RED at chromium DPR 1** (homes v2's G5). This is the lane's own gap 1. It stays a red until the chair rules
   on `proposed/G5-rung.PROPOSED.md`. At dark cell 12, pink, the tree reds where HEAD clears (2.941 vs 2.986).

---

## 0 · NUMBERS FIRST (re-derived by me)

### 0.1 The bank and the delta

| check | reading |
|---|---|
| `pass9.diff` sha1 / bytes | **ea6428ba** / 671,050 B, 33 paths (= BANKED.txt) |
| `git apply --check` on a fresh `git archive 74a2b5d9` (own `git init` root, no commit) | **0**; negative control `--reverse --check` **1** |
| applied for real, 33 paths vs the lane tree | **0 differ** |
| `pass9.delta.on-WAVE.diff` sha1 / bytes | **14989862** / 233,521 B, 20 paths |
| `--check` on a fresh archive of the WAVE union `acb9c08e` | **0** |
| `--check` on `acde977b` (WAVE + homes.on-WAVE `a0f8e6f3`) | **0**; applied for real **0** |
| §11c's own integrated tree | none exists before the pass-9 WAVE (true; the WAVE is the only integrated base) |
| homes v2 by sha | `homes.diff` **1f70cfda** on a fresh 74a2b5d9: all 13 home paths (`e2e/lib/*.{mjs,d.mts}` ×10, `scripts/shape-census.{mjs,d.mts}`, `knip.json`) are **byte-equal** to `pass9.diff`'s. No residual home edit. |
| home paths in the on-WAVE delta | **0** (its 20 paths are product + gate + spec; the homes are stripped by construction) |
| bank grep: `scratchpad`, `/private/tmp`, `/tmp/`, the t9 scratch root | **0 / 0** in both diffs; the only `/.` path is `.github/workflows/ci.yml`, a product path |
| the pass-9 advance (fresh `74a2b5d9`+pass8.diff vs +pass9.diff, `diff -rq`) | the homes (4 changed, 6 new `.d.mts`), `knip.json`, `shape-census.mjs`, the gate, the spec, `useStagingBridge.test.ts`. **No other product byte moved.** |

One cite is off by one. The README says gate 4 walks "262 source files on the lane tree". The shipped gate on the lane tree
prints **261**, and so does my replica.

### 0.2 §2c on the clean tree and the born-RED (`readings/s2c-and-born-red.txt`)

The values match the lane's §1 Row 1 table to the fourth decimal, in both engines at DPR 1:

| read | chromium | WebKit |
|---|---|---|
| light clean name / tally | 0.0000 / 0.0000 | 0.0000 / 0.0000 |
| light P1 / P3 | 0.1262 / 0.0493 | 0.1262 / 0.0493 |
| dark clean name / tally | 0.0102 / 0.0000 | 0.0000 / 0.0000 |
| dark P1 / P3 | 0.2225 / 0.0563 | 0.2234 / 0.0501 |
| **peer-1 `.pcss` plant** (`html.dark{--color-peer-1-name:#ffd9b8}` at `GameBoard.vue:16`, `od -c`-checked), dark name / tally | **0.0475 / 0.0575, EXIT 1** | **0.0575 / 0.0575, EXIT 1** |
| **peer-3 `.pcss` plant** (`html.dark{--color-peer-3-name:#ff00ff}`, same site) | **0.0102 / 0.0000, EXIT 0** | **0.0000 / 0.0000, EXIT 0** |

The plants were built in a second rsync replica (`index-BIutP1_Eo_Te.css` and `index-Co-SH0Y5sQwz.css`, each carrying its
one rule, grepped), never in the lane tree. The replica's Tailwind scan isn't faithful, but that changes utility classes
only. The tape's ink comes from the rule under test. The source gate and `--dist` red both plants (exit 1 / 1, the peer-3
declaration named). Only the behavioural row misses peer-3.

### 0.3 B-TAPE on the HEAD-on-HEAD control (`readings/btape-head-on-head.txt`)

The lane's probe is `headreal.paltin9.spec.ts`, run unedited from my scratch. The control is HEAD's ink on HEAD's own
label (:4239); the tree is the tin's arm on the tree's ticked label (:4245). One run per arm per engine, DPR 1, load 17–34.

| | chromium tree | chromium HEAD | WebKit tree | WebKit HEAD |
|---|---|---|---|---|
| light, 15 rows | 2.066–2.422 | 1.640–2.055 | 8.296–10.312 | 3.834–4.654 |
| dark, 15 rows | 2.614–3.455 | 2.328–3.371 | 5.613–6.713 | 4.931–5.552 |
| dark cell 11: green (peer-2 vs i=1) / pink (peer-5 vs i=4) | 3.106 / 2.899 | 3.371 / 2.941 | 6.543 / 5.690 | 5.398 / 5.429 |
| dark cell 12: green / pink | 3.127 / 2.941 | 3.348 / 2.986 | 6.427 / 5.613 | 5.552 / 5.539 |

The four losses are **−0.265 / −0.221 (green) and −0.042 / −0.045 (pink)**, chromium DPR 1 dark only. They're the lane's to
the third decimal, and every other key wins.

**The declared second variable is NOT one-signed.** The lane says the simulation (HEAD's ink on the tree's ticked label)
"reads low by 0.08–0.20 (chromium) and 0.21–0.48 (WebKit)". Per key, sim − HEAD over the 15 rows of each cell (`bias.mjs`):

| | min | max | rows where the sim reads ABOVE HEAD |
|---|---|---|---|
| chromium light | −0.121 | +0.006 | 3 / 15 |
| chromium dark | −0.209 | +0.053 | 1 / 15 |
| WebKit light | −0.545 | +0.097 | 6 / 15 |
| WebKit dark | −0.417 | −0.097 | 0 / 15 |

That's 10 of 60 keys where the simulation reads high, and a WebKit-light low of −0.545, outside the lane's printed band. The
ballot's four losses come from HEAD-on-HEAD and don't depend on this. The README's sentence about the tally's sign and
size does, and it's wrong as printed.

### 0.4 The floors at their edges

The pinned rows (MIN_DE, RING_FLOOR, EXEMPT_FLOOR, COPY_DE) bite at their pins. Five other bounds don't. Both are in one table at §1.5.

### 0.5 π, AA, filterBudget, @property, M16

| row | chromium | WebKit | control's exit beside it |
|---|---|---|---|
| π solo, tree :4245 vs control :4239, light / dark (`CRITIC pi solo`) | **0 / 0 px**; floors 0/0/0; 1 px outline plant **3032 / 3036 px** | **0 / 0 px**; floors 0/0/0; plant **2554 / 2554 px** | the control is the spec's own second page (control vs control2 0 px) |
| AA: `§2 every stick clears 4.5 … every name arm on the tape's paper`, DPR 1 | 1 passed, EXIT 0 | 1 passed, EXIT 0 | — (no in-run plant in §2; I didn't plant one) |
| `@property` in the served CSS | 42 tree / 42 control | same bytes | — |
| `filter:` declarations added by the delta outside `e2e/lib` | **0** | — | — |
| utility classes in the tree's CSS that the control's lacks | **0** (no comment minted a utility; T9-R6 quiet) | — | — |

π covers the SOLO surface only. The tin's real pixel move is in the room, on the peers' inks. That move is the design, and
the B-TAPE ballot prices it (§0.3). The solo π doesn't. Loads: 26–32 across these rows. M16: `check-copy-register` exits 0 on my replica of the final tree. The delta adds no UI copy (`diff -rq`
of pass 8's and pass 9's applied trees shows no `.vue` change).

---

## 1 · What isn't converged

### 1.1 Gate 4 is enumerated, not keyed on its class (`readings/gate4-fresh-attacks-{source,dist}.txt`)

The lane's 45 named attacks red 45/45 (its table). I didn't re-run them. I ran 24 FRESH shapes, none of them in the D23–D40 /
C1–C23 sets, on an rsync replica of the final tree (gate `d05491a3`, library `2b465df8`, load 17–25). The replica was
restored and checked byte-equal after the run, and the clean controls before and after read exit 0.

| shape | source gate | `--dist` (one planted build) |
|---|---|---|
| N1 `el.attributeStyleMap.set("--color-peer-5-name", "#000")` (Typed OM; LAWS P8 §F names it) | **exit 0** | **missed** |
| N2 `el.style["setProperty"]("--color-peer-5-name", …)` (bracket call; P8 §F names it) | **exit 0** | caught (minifier writes `.setProperty(`) |
| N3a Vue `:style="{ ['--color-peer-5-name']: 'black' }"` (computed key) | **exit 0** | caught (`{"--color-peer-3-ring":"black"}` in the chunk) |
| N3b TS `{ ["--color-peer-5-name"]: "#000" }` | **exit 0** | caught |
| N4 `const N = "--color-peer-5-name"; el.style.setProperty(N, …)` (bound alias; P8 §F names it) | **exit 0** | caught (inlined) |
| N5 `el.style.setProperty ("--color-peer-5-name", …)` (one space before the paren) | **exit 0** | caught (minified) |
| N6 `Reflect.apply(el.style.setProperty, el.style, ["--color-peer-5-name", "#000"])` | **exit 0** | **missed** |
| N21 CSS `url("data:image/svg+xml,…fill='%23ffb2f3'…")` (an exact copy of the dark pink name, percent-encoded) | **exit 0** | **missed** (the copy rule neutralised; 0 findings name `ffb2f3`) |
| N22 the same data URI as a TS string | **exit 0** | **missed** |
| N27 `import t from "./tin.txt?raw"` injected as a `<style>` (`:root.dark{--color-peer-2-ring:#ff00ff}`) | **exit 0** | caught |
| N29 SFC `<style src="../../../theme/tin2.css">`, a sheet outside `src/` that re-declares an arm | **exit 0** | caught (`g4-dist-decl`) |
| N34 `@property --color-peer-1-ring { syntax: "<color>"; inherits: false; initial-value: #000; }` | **exit 0** | **missed** (in the built CSS verbatim) |
| N7 CSS-escaped property name `--color-peer-5-nam\65` | exit 1 | — |
| N8 a non-copy colour bound to `--color-peer-cursor-ink` | exit 1 | — |
| N9 `hwb()`, N10 `rgb(%)`, N11 `color(srgb-linear …)`, N12 `color(srgb …)`, N14 decimal packed int, N41 legacy commas, N42 8-digit hex | exit 1 each | — |
| N26a/b `.postcss` (Vite's other CSS extension), unimported and imported | exit 1 / 1 | — |
| N30 TS `import` of a sheet outside `src/` | exit 1 | — |
| N26c `.sss` | exit 0 | **struck**: `sugarss` isn't installed, so Vite can't build it and it isn't a shippable publisher |

**Source gate: 12 of 24 escape (N26c struck; pass 8 was 15 of 25).** CI runs `lint:tin` (source) and
`--self-test --dist dist` (ci.yml:961, :1899). Eight of the twelve are caught by the dist arm. That's the bundler's
normalisation, not the gate's class. **Four classes escape both arms:**

- **Typed OM** (N1). LAWS P8 §F lists it by name as a fifth-pass shape.
- **`Reflect.apply`** (N6). Any call of `setProperty` that isn't spelled `setProperty(` is invisible.
- **The percent-encoded copy** (N21/N22). `%23` is how every SVG data URI spells `#`, and the gate decodes `\x23`, `#`,
  `&#x23;` and `\23` but not URL encoding.
- **`@property` on an arm** (N34). This is a second publisher of the arm's INITIAL value. With `inherits: false` it cuts the
  arm off from every descendant: every `var(--color-peer-1-ring)` below `:root` resolves to `#000`. The source gate, `--dist`'s
  declaration multiset and §2c (which reads peer-1's NAME, §1.2) all stay GREEN.

The source-gate misses are all one class: a peer token in a NON-colon, non-`setProperty(` position (an argument, a computed
key, a bound const, an `@property` prelude) isn't read as a publisher. The cure is to read any string literal or CSS ident
that IS a peer token, wherever it sits outside `index.css`, with the consumer forms (`var(--color-peer-…)`) admitted. The
lane keyed its regexes on syntactic positions it had already been shown. This is registry-v8 §2.12's open class by name.

### 1.2 The behavioural twin reads one arm of ten (row 1's class)

§2c reads the arm the tape BINDS, and the pinned room binds **peer-1** in both themes ("the tape binds peer-1"). A shipped
second publisher of any other arm is invisible to it. §0.2 shows the run order: the clean tree GREEN, then the peer-3 plant
GREEN in both engines, then the peer-1 plant RED in both engines. The negative control is in the same run sequence.

So §2c is the pass-8 critic's §1.2 cured for its plant, not its class. The source gate and `--dist` do catch every `.pcss`
re-declaration I tried, so the hole is in the twin, not in gate 4. LAWS P8 §F says "a source-law row owes its BEHAVIOURAL
twin on the built page". That twin covers 2 of 10 arm × theme cells (peer-1 light and dark). Rings aren't read at all. The
cure is cheap: bind each of the five name arms in turn (the lane's own `headreal` probe already forces `--color-user-ink` per arm),
and read a ring cell for each ring arm.

### 1.3 A disjunct of `g4-decl` is unpinned (LAWS P8 §F, the per-disjunct battery)

`g4-decl` is three regexes (gate `:1099–1101`): `TOKEN\s*:`, the quoted key `"TOKEN"\s*:`, and `setProperty(\s*"TOKEN"`. I
commented each out in a copy and ran `--self-test` (`readings/batteries.txt`):

| disjunct deleted | `--self-test` | the self-test row that catches it |
|---|---|---|
| `:1099` `TOKEN\s*:` | exit 3 | `B1 · a band rule in gameCell.css` |
| `:1100` `"TOKEN"\s*:` | **exit 0** | **none** |
| `:1101` `setProperty("TOKEN"` | exit 3 | `a runtime setProperty of a ring arm in a spec` |

The `:1100` disjunct is LIVE. On the shipped gate, `export const s = { "--color-peer-5-name": "#000" };` exits 1 (`declares
--color-peer-5-name`). On the copy without `:1100`, it exits 0. So does a Vue `:style="{ "--color-peer-5-name": c }"`. No
self-test plant reds only this disjunct. The 46/46 clause battery deletes whole CLAUSES and never sees it.

### 1.4 Watch 2: the hand-over doesn't apply to the gate it's for

`instruments/separation-law.into-walk-gate2.pass9.diff` (sha1 `7bc3bc57`) applies with `patch` exit 0 to WALK's PASS-8 blob
`bb15c9e1` (the lane's reading). WALK re-cut gate 2 this pass. Its live gate in `wf_308fa864-c94-1` is blob `1ee13421`, and
there `patch --dry-run -p3` reports **"4 out of 5 hunks failed"**, exit 1 (`readings/walk-handover-dryrun.txt`). WALK's critic
reads the same thing independently ("4 of 5 hunks FAIL"; it holds watch 2 NOT closed and WALK at 80).

The lane printed its half as "HALF MET". The real state is that TIN's pinned floors aren't in WALK's gate 2 in any form. The
chair's batch gate ("watch 2 closed in WALK's gate 2") is unmet on both sides. The cut on a sibling's pass-8 blob, inside
the batch where that sibling was re-cutting the same file, is the instrument's error. The hand-over needs a re-cut on
WALK's banked pass-9 blob, plus a CHURN_COST plant per cell.

### 1.5 Bounds the threshold battery doesn't move (LAWS P8 §F, threshold sabotage)

The lane's `--threshold-battery` moves five bounds (MIN_DE, RING_FLOOR, EXEMPT_FLOOR, COPY_DE, DIST_BLANK), and the charter
named three. The gate has more numeric bounds. I moved each one in a copy or through `TIN_THRESH`, and ran `--self-test`
and the bare gate. The clean `--self-test` control is exit 0 in the same battery. Loads were 15–40, with every exit read
from the run's own file (`readings/batteries.txt`):

| bound (shipped) | the shipped tin's own margin | moved → `--self-test` exit | pinned? |
|---|---|---|---|
| MIN_DE 0.10 | worst dark name pair **0.101** (margin 0.001) | 0.0949 → 3 · 0.0951 → **0** · 0.1038 → 1 · 0.1040 → 1 | yes, below. Above 0.101 the SHIPPED tin reds, so the +ε plant (0.1039) is moot |
| RING_FLOOR 0.075 | worst light ring pair **0.0769** | 0.0700 → **0** · 0.0805 → 1 | yes, to its ±0.005 pin (0.0695) |
| EXEMPT_FLOOR 0.075 | (the alias) | 0.0700 → **0** | the same pin |
| COPY_DE 0.03 | — | 0.0253 → 3 · 0.03 (control) → 0 | yes |
| **SCALAR_EPS 0.005** (4b, the arm's lightness cap) | 8-bit round trip 0.0015 | 0.002 → 1 · 0.010 → **0** · 0.019 → **0** · 0.021 → 3 | **NO: loosens 3.8× GREEN.** The 4b plants sit at L +0.02 and +0.07, with no boundary control |
| **MIN_SEP 12°** (1a) | nearest anchor **13.57°** | 11 → **0** · 13 → **0** (bare gate 0 / 0) | **NO** |
| **ABS_FLOOR 0.075** (1b) | worst ΔE to a cell ink **0.082** | 0.07 → **0** · 0.08 → **0** (gate 0 / 0) | **NO** |
| **RATIO_FLOOR 0.75** (1b) | score **0.80** | 0.70 → **0** · 0.80 → 1 (the shipped tin reds) | **NO, below** |
| **RING_DH 1°** (3b) | worst \|Δh\| **0.879°** | 0.9 → **0** · 1.5 → **0** (gate 0 / 0) | **NO** |

Five bounds of the re-cut gate can be moved with every self-test GREEN. That's the class the pass-8 critic proved on
MIN_DE / RING_FLOOR / EXEMPT_FLOOR, and the lane cured only the three it was shown (plus COPY_DE and DIST_BLANK). The
"20/20" battery is green on the bounds it lists. It is silent on the rest.

---

## 2 · The lane's claims I checked, and the ones I didn't

| claim | my reading |
|---|---|
| bank shas, apply-checks on 74a2b5d9 / acb9c08e / acde977b, homes by sha | **reproduced** (§0.1) |
| §2c clean and P1/P3, both engines, DPR 1 | **reproduced to the 4th decimal** (§0.2) |
| born-RED: peer-1 `.pcss` reds §2c in both engines | **reproduced** (0.0475/0.0575; 0.0575/0.0575). The source gate and `--dist` red it too (exit 1/1, on my replica's build) |
| B-TAPE HEAD-on-HEAD: 4 losses, every other key wins | **reproduced to the 3rd decimal**, both engines, DPR 1 (one run each, not ×2) |
| "the simulation reads low by 0.08–0.20 / 0.21–0.48" | **wrong as printed**: two-signed, 10/60 keys read high, WebKit light down to −0.545 (§0.3) |
| floors pinned: MIN_DE, RING_FLOOR, EXEMPT_FLOOR, COPY_DE | **reproduced at the edges** (§1.5's first rows). SCALAR_EPS, MIN_SEP, ABS_FLOOR, RATIO_FLOOR are NOT (§1.5) |
| 46/46 clause sabotage | not re-run whole (1,905 s). The per-DISJUNCT battery I did run finds one live, unpinned disjunct (§1.3) |
| 20/20 threshold battery (`--dist`, 864 s) | not re-run whole; my edge moves replace it (§1.5) |
| 45/45 named attacks | not re-run; 24 fresh shapes instead (§1.1) |
| π 0 px, both engines and themes; plant 3032–3036 / 2554 | **reproduced exactly** (§0.5) |
| AA §2, @property 42/42, filterBudget 0 | **reproduced** (§0.5) |
| M16 | `check-copy-register` exit 0 on my replica of the final tree ("0 em/en dashes and 0 unadmitted jargon") |
| §2b RED at chromium DPR 1 (G5), GREEN elsewhere | **not re-run** (25-min row). I take the lane's red as given; it's a gap either way |
| WebKit FADE80 printed only, 3/4 | not re-run. CHAIR §11 holds it printed until two consecutive WebKit reads agree. The pass-8 lane, the pass-8 critic and this lane all read 3/4 at DPR 1, and that settles nothing until it's a ruling |
| WAVE typecheck:e2e exit 2 (zone-grammar) | not re-run. That's RULE's file, not this delta's |
| units 838 / 9 directories | not re-run (product `src/` is pass 8's apart from one test-fixture line) |
| "262 source files" | **261** on the lane tree and on my replica |
| WALK hand-over "patch exit 0 on bb15c9e1" | true of the stale blob; **exit 1, 4/5 hunks fail** on WALK's live gate (§1.4) |

## 3 · Incidents (self-declared)

1. **A plant raced my own battery.** I first planted the peer-3 `.pcss` in replica 1 while `batt.sh` was running its
   self-tests there (21:13:0x–21:13:31). I reverted at once, and the rows that overlapped the window
   (`th-MIN_DE-0.0951`, `0.0949`) were re-run on the restored replica (`diff -rq src` vs the lane tree = 0): 3 / 0, the same
   as before. Every later plant went into a second replica.
2. **The first browser launch failed at config load.** My scratch config couldn't resolve `@playwright/test`
   (ERR_MODULE_NOT_FOUND), and the probe spec loaded as CJS. The cure was a `node_modules` symlink and `{"type":"module"}` in
   the scratch dirs. No reading came from the failed launch.
3. **The first planted build failed.** The replica lacked `csp-solver/data` (the template-bank check). I linked it and
   rebuilt.
4. **The replica's Tailwind scan isn't faithful.** It's git-less, so it mints palette utilities the product doesn't have.
   The planted `--dist` read prints those as copies. I read only the planted tokens from it and say so in the reading file.
   The clean tree I SERVED is a build of the lane tree itself, the same bytes as the lane's (`index-BEvB64Xx8VeY.js`).
5. My rsync's `--exclude 'dist*'` dropped `scripts/dist-identity.mjs` from replica 1. I copied it back before the batteries,
   and `diff -rq scripts` against the lane tree was 0.

No git write anywhere (`git init` only in my own scratch archive roots; no commit), no `rm` (discards are `mv` to trash),
nothing written to the lane tree, main or the control tree. Servers: :4245 PIDs 40116 → 53197 → 54182 → 55433 and :4239 PID
40143, each killed by its recorded PID after a cwd check.

## 4 · The number, the open gaps, the replay

**88, ADVANCE.** Three of the pass-8 critic's four holes closed and reproduced (the same-index control, the authored reference
on its plant, the named floors). The fourth, the class, did not. The new holes are the same class one level down: a
behavioural twin that reads one arm, five bounds with no edge plant, a disjunct with no plant, and four publisher shapes
that pass both CI arms. None of them is a product regression. Every one is an instrument that can't fail on a case it
names. Watch 2 is unmet (the hand-over doesn't apply), and §2b is RED in one engine × DPR cell pending a ruling. That rules
out more than +1. §11c stays TIN's on the number (PAL-WALK's pass-9 critic: 80).

**Open gaps, exact** (the pass-10 work orders):

1. Gate 4's source law reads a peer token only in colon or `setProperty(` position. Key it on ANY peer-token literal or
   ident outside `index.css`, consumers admitted. Plants: N1, N2, N3a/b, N4, N5, N6, N27, N29, N34 on the source gate.
2. Four shapes pass BOTH CI arms: N1 Typed OM, N6 `Reflect.apply`, N21/N22 `%23` data-URI copy, N34 `@property` on an arm.
   Each needs a plant in `--self-test` (and N21 a URL-decode in the library's decode, PROPOSED with its plant).
3. §2c reads peer-1 only. Bind and read all five name arms, and a ring cell per ring arm. The peer-3 `.pcss` plant must red.
4. The `g4-decl` quoted-key disjunct (`:1100`) needs a self-test plant that reds only it.
5. Pin SCALAR_EPS, MIN_SEP, ABS_FLOOR, RATIO_FLOOR and RING_DH with ±ε plants, and put them in `--threshold-battery`.
6. Watch 2: re-cut the hand-over on WALK's banked pass-9 gate blob. WALK lands it in gate 2.
7. §2b chromium DPR 1 (G5): the chair rules on `proposed/G5-rung.PROPOSED.md`. Dark cell 12 pink (tree 2.941 vs HEAD 2.986)
   is a tree-only red that the rung can't excuse on HEAD-on-HEAD's own condition.
8. Correct the README's tally-bias sentence (two-signed, §0.3) and the 262 → 261 cite.
9. Carried and unread this pass: WebKit FADE80 (needs two agreeing WebKit reads), L6 in WALK's form, roster n−1,
   B-TAPE ×2 runs (I ran ×1), §2b and DPR 2 (I didn't re-read them).

**Replay** (`instruments/`; paths written as `$REPO`, `$SCRATCH`, `$WORKTREES`):
`apply.sh` (archives from the lane worktree's object store, each in its own `git init` root; apply-checks; the pass8/pass9
interdiff) → `attack.sh` (24 fresh shapes on an rsync replica) → `build-plant.sh` + `--dist` on its output (the one
planted build) → `batt.sh` (disjunct copies `dj1099/1100/1101`; `TIN_THRESH` edges; constant copies `sep/abs/rat/dh`) →
`build-lane.sh` (the clean tree, `index-BEvB64Xx8VeY.js`) → `browser.sh` (§2c and the HEAD-on-HEAD probe, both engines) →
`build-pcss3b.sh` and its peer-1 twin → `swap.sh` (:4245 rotated through peer-3, peer-1 and clean, by recorded PID) →
`browser2.sh` (π, AA) → `bias.mjs`. Frames: none. No crop was needed and none of the 120,378 B headroom is spent.
