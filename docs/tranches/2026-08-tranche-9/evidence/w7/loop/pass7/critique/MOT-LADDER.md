# MOT-LADDER — pass 7 CRITIQUE (adversarial, non-author)

T9-W7 §13, the transition grammar. Subject: LADDER's pass-7 bank, tree **`cb17b5f3`**, in the one §13
worktree `.claude/worktrees/wf_f72f3b5a-83a-59`. I computed the write-tree through a temporary index at
my open and again at my close, and got `cb17b5f3` both times, so VERB had not moved it. I never
edited, served, built or ran git in that tree beyond the temp-index write-tree. Every reading below is
on a `git archive cb17b5f3` snapshot in my scratchpad, turned into a one-commit repo that **fetched
`74a2b5d9` by SHA at depth 1** (`git fetch --no-tags --depth=1 <origin> 74a2b5d9…`). That is ci.yml's
new step, run against a file:// origin. Base and π control: **`74a2b5d9`**. It was served read-only
from `w7-control` by its own preview command and verified by `index-CubiZsMVSwTc.js`. The pre-return
control was a `git archive 74a2b5d9 web/frontend`. No git ran in the control tree. Payload: the specs'
own `encodeSudoku(3, <71 givens>, 81)`, read back as 71 `given clue` aria-labels in every paint row.

**CONVERGENCE: 82 %. VERDICT: ADVANCE.**

The lane closed every door the pass-6 critic built, and I re-ran its whole battery: **45/45 as
expected**. That also closes its own un-collected run5. The ratchet's title claim still fails through
CI, though, a sixth time. Every gate in CI exits 0 while the cell reveal ships at **150 ms instead of
300**, painted in both engines. The route is the plant LAWS P6 §F names first, a compound override on
the banked subject. The SHAPE law was applied to B8's curves and not to B6's durations. Three more
open routes are new: a `<style>` in `index.html`, a rung swapped at a TS consumer, and a
`Math.min`/bracket/shift on a rung. B8 can't see a curve token published from script, and `liveFitLaw`
can't see a `--live-fit` default declared in a rule.

---

## 0 · Numbers first (re-measured by me)

| reading | control `74a2b5d9` | tree `cb17b5f3` |
| --- | --- | --- |
| temp-index write-tree of the worktree (open / close) | — | `cb17b5f3` / `cb17b5f3`, which matches BANKED.txt |
| clean build (config, outDir and cacheDir in the scratchpad) | `index-CubiZsMVSwTc.js` | **`index-ICe9_X4WHUBR.js`**, 44 files. That's VERB's pass-6 identity, so pass 7 moves 0 served bytes (the lane's claim, confirmed) |
| bundle, js+css raw | 524,594 | **531,790 (+7,196)**. The lane's re-derived row 12 matches to the byte |
| bundle, js+css gzip -9 (mine) | 172,105 | 174,217 (**+2,112**). The lane's +2,142 uses another compressor setting; the raw figure is the one that re-derives exactly |
| `npm run lint:bands` bare, at D0 (depth 1 plus the one-commit fetch) | 1 (absent) | **0**, 91 RED, 18 HELD, 0 vacuous |
| **the lane's `break7.py`, re-run by me on the snapshot** (its run5 was never collected) | — | **45 rows, 45 as expected, 0 unexpected**. That's 42 D0 plants plus 3 D1 rows (ROW0, A2c, FINAL). The README's "46 plants" miscounts by one |
| pass-6 plants FIRST (X2a–X2e, X3, X3ctl, X4, X5, X6, X7, X7p, A2c D0 and D1, X1) | — | **all exit 1**, and X8, the lawful DELETED row, **exits 0** (pass 6: TypeError) |
| INTAKE-23 row 18 (T4, T4ok, T4n; also in the gate's own self-test at l.3921–3932) | — | 1 / **0** / 1: an undocumented shortening reds, the two cited ones pass |
| `ladder-prm.spec.ts` ×4 poses + `live-fit-ablation.spec.ts` (GC1), both engines | **10/10 RED** | **10/10 green** (7.2 s) |
| check-property-block, source + dist + **served** | 0 (8 registrations) | **0 (49 registrations)** |
| rung re-stamp (my K-plants: each rung −10 ms, the bank re-written, `BANK_SHA256` re-stamped) | — | whisper, leave, note, dusk, step and throw **all exit 1** (B2 "carries no ruling" plus the site floors and B13). The stamp door is shut for rungs too |

### Pre-return battery, bare (tree snapshot / control archive)

lint:bands 0/1 · lint:verbs 0/1 · lint:motion 0/0 · lint:copy (M16) 0/0 · lint:lanes 0/2* ·
lint:theme-tokens 0/0 · lint:sleep 0/0 · test:e2e:projects 0/0 · check-pw-projects 0/0 · lint:knip 0/0 ·
undefined-token census 0/1 (the control's declared STALE `--refuse-dur`) · check-property-block (source)
0/0 · `npm run lint` 0/2* · `eslint .` 0/0.

\* A harness artifact: my control archive is `web/frontend` only, and those two read `../../.github`.
They aren't cited as control readings. The lane's 0/0 stands unre-measured.

### My attacks, through CI's exact invocations (fresh copy per plant, D0)

Every column is a bare exit. "eslint" is the snapshot's own config over the planted file (stdin), and
"prettier" is `--check` on it.

| # | the commit | bands | verbs | motion | tokens | census | propblock | eslint | what ships |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **L7a** | index.css: `html .cell-reveal-animated { animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop); }` (a compound override on the banked SUBJECT; the banked rule untouched) | **0** | **0** | **0** | 0 | 0 | 0 | css (prettier 0) | **reveal at 0.15s, not 0.3s**: computed, both engines, plant dist `index-D-7awKd6c2i1.js` (tree and control read 0.3s) |
| **L7b** | the same in scene.css as `.cell.cell-reveal-animated` | **0** | **0** | **0** | 0 | 0 | 0 | css | the reveal at whisper (0.15s) by the same cascade; not built |
| **L4** | `index.html`: `<style>.cell-reveal-animated{animation-duration:50ms;}</style>` | **0** | **0** | **0** | 0 | 0 | 0 | html | a 50 ms reveal (`collect()` walks `src/` only) |
| **L5** | AnswerKeyLaminate `LIFT_MS = MOTION.rungs.leave` → `.whisper` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | the lift at 150, not 200 |
| **L6** | App.vue beat-0 `}, MOTION.rungs.leave);` → `.whisper` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | the fold's beat 0 at 150, not 200 |
| **M1** | usePathAnimation `duration: Math.min(MOTION.rungs.whisper, 40)` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | a 40 ms WAAPI clock |
| **M2** | `duration: MOTION.rungs["whisper"] / 3` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | 50 ms |
| **M3** | `duration: MOTION.rungs.whisper >> 2` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | 37 ms |
| M4 | `let w = MOTION.rungs.whisper;` then `w / 3` | 0 | 0 | 0 | 0 | 0 | 0 | **1** (`prefer-const`) | — CI catches it, incidentally |
| **E1** | main.ts `document.documentElement.style.setProperty("--ease-anticipatePop", "ease-in")` | **0** | **0** | **0** | 0 | 0 | 0 | **0** | **`ease-in`** on the reveal, both engines (the token reads `ease-in` at `:root`), and on the toggle's `scale 150ms var(--ease-anticipatePop) 560ms` **transition** (DarkModeToggle.vue:902) |
| **F1** | GameCard.vue `.live-face-fit { --live-fit: 0.99; … }` (a default declared in the consumer rule) | **0** | **0** | **0** | 0 | 0 | 0 | **0** | **GC1 RED 665×665, both engines**. The estate row catches it and CI doesn't: the pass-6 X3 class through a third route |
| L1 / L2 / L3 | a longhand `animation-duration: var(--motion-whisper)` in the banked rule / in scene.css / a semicolon-less `animation-duration: 50ms }` | **0** | 1 | 0 | 0 | 0 | 0 | — | bands is blind. verbs reds only incidentally ("no verb names its curve") |
| F2 | App.vue publisher `String(Math.min(…) \|\| 0.99)` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | dead code behind the `> 0` guard. Not cited as a hole |
| E2 | `--ease-anticipatePop: cubic-bezier(0.42, 0, 1, 0.9999)` | 0 | 0 | — | 0 | — | — | — | ease-in to 1e-4. A sensitivity row, since exact points are the charter's own definition. Not charged |
| E3 | the reveal's `animation:` curve → `ease-in` | 0 | **1** | — | — | — | — | — | out of B8's scope by design; lint:verbs holds it |

Paint rows (`instruments/crit-paint.spec.ts`: the class added to the first `.game-cell`, read one rAF
plus one task later), 1440×900, fine pointer, light theme, both engines:

| arm | asset | `animation-duration` | `animation-timing-function` | `--ease-anticipatePop` @ :root |
| --- | --- | --- | --- | --- |
| control :4235 | `index-CubiZsMVSwTc.js` | 0.3s | cubic-bezier(0.68, -0.55, 0.265, 1.55) | cubic-bezier(.68, -.55, .265, 1.55) |
| tree :4234 | `index-ICe9_X4WHUBR.js` | 0.3s | same | same |
| plant :4236 (L7a + F1 + E1) | `index-D-7awKd6c2i1.js` | **0.15s** | **ease-in** | **ease-in** |

The three plants are independent reads on one dist. Each is also run as a single variable through the
gates above.

---

## 1 · Strengths (re-measured, not accepted)

1. **Every pass-6 row is closed, and the lane's whole battery reproduces.** I ran its 45 rows
   myself on a snapshot that models CI's new fetch, and all 45 came out as expected. B8 now reads by
   value: case-fold, `var()` fallback, identity `linear()`, the longhand, `!important`, CSS and script
   longhand writes, `public/`. The lawful DELETED row is green. The dead decoy (X7, X7p) reds. A2c
   reds at D0 and at D1. X4, X5, T11 and T12 red through B13. `max()` reds. INTAKE-23 row 18 is in
   the gate's own self-test in both directions.
2. **The stamp door is shut for rungs as well as sites.** I lowered each rung by 10 ms, re-banked it
   and re-stamped the digest, and all six plants that landed red, through B2's ruling clause, the site
   floors, the `boardFoldMs` MOVED row and B13's valued `throw` row. The sixth plant, `rise`, didn't
   land: my anchor missed its multi-line declaration, so it isn't cited.
3. **The depth law works.** `git fetch --depth=1 <origin> 74a2b5d9…` on a one-commit clone made
   `74a2b5d9^{commit}` resolvable, and the gate re-derived its floor off it (0). Without the fetch
   (D1), it reds by design. The GitHub half stays unproven (§2.8), but the mechanism is sound.
4. **The pass is pixel-silent to the byte.** My clean rebuild is VERB's pass-6 identity, and raw
   bundle row 12 re-derives exactly (+7,196). π, AA and filterBudget cannot move when 0 served bytes
   move, and M16 is 0 bare. Served check-property-block reads 49 registrations, green.
5. **The gaps are honest.** Rows 7–10, the split-line B13, X7″, the unproven CI fetch, the knip
   entry and the B27 collision are all declared in the lane's words, and none is dressed as closed.

---

## 2 · What is NOT converged — demonstrated

### 2.1 B6 keys on the exact prelude, not on the SUBJECT compound: the ratchet walks down through CI (the title claim, a sixth time)

L7a leaves the banked rule untouched and adds `html .cell-reveal-animated { animation: cell-reveal
var(--motion-whisper) var(--ease-anticipatePop); }`. B6 sees a **new key**
(`index.css :: html .cell-reveal-animated :: cell-reveal`), and a new key has "nothing to shorten"
(l.1210 `if (was === undefined) continue;`). B1 is satisfied because the site reads a rung. verbs,
motion, tokens, the census, check-property-block and prettier all read 0. The higher-specificity rule
wins the cascade and the reveal ships at **0.15s in both engines**. LAWS P6 §F names this exact plant
("keys on the SUBJECT COMPOUND … a descendant or `:is()` scope, a compound override … all reach the
subject"). The gate imports the chair's library and uses it for B8 curves, but B6's `collectText`
still keys by `selectorOf` text. L1–L3 are the same blindness on longhands and on a semicolon-less
last declaration (`DECL` requires `;`). Only lint:verbs catches those three, and for an unrelated
reason. **The fix:** B6 reads every duration through `shape-census.mjs`, keyed on the subject
compound's positive classes, so any new site whose subject a banked key's subject reaches, at a
lower ms, reds unless a RETUNE names it. Plants L7a, L7b, L1, L2 and L3 land in the self-test.

### 2.2 The duration census reads `src/` only (L4)

`collect()` walks `SRC`. A `<style>` in `index.html` shortens the reveal to 50 ms, and every gate in
CI reads 0. The lane's T3 covers `index.html` for `@property` registrations and T7 covers `public/`
for curves, but durations are covered in neither. It's the same SHAPE-law clause ("every linked
stylesheet including `public/**` and `index.html`"). **The fix:** `collect()` reads `sources(ROOT)`
through `cssBlocks`, with L4 plus a `public/*.css` duration plant.

### 2.3 A TS consumer can swap its rung (L5, L6)

The bank ratchets the 22 TS clock **declarations**. A **consumer** that reads `MOTION.rungs.leave`
can read `.whisper` instead (200 → 150), and every gate plus eslint reads 0. Charter row 5 said "the
consumer's computed value is the gate's subject". B13 honours that for arithmetic only. **The fix:**
bank the TS consumer roster (`file :: enclosing binding :: MOTION path` → ms at base) and ratchet it
as B6 ratchets CSS sites, with L5 and L6 as plants.

### 2.4 B13's operator set and reader are narrow (M1, M2, M3)

B13 fires only on `* / % -` after a dotted read. `Math.min(MOTION.rungs.whisper, 40)` has no
operator. `MOTION.rungs["whisper"] / 3` matches the bare root, which is skipped (l.2310). `>> 2`
isn't in the operator class. Each ships a 37–50 ms WAAPI clock, and every gate plus eslint reads 0.
`Math.min` here is exactly the TS twin of the `max()` the lane closed in `liveFitLaw`. **The fix:**
any call or operator with a clock read as an argument (`Math.min/max/floor/…`, `>>`, `<<`, `|`,
bracket access) is a B13 subject, valued at the consumer. Plants M1–M3 land.

### 2.5 B8 doesn't read a curve token published from script (E1)

`curveTokens()` reads stylesheets only. `setProperty("--ease-anticipatePop", "ease-in")` at boot
makes the reveal, and the toggle's `scale … var(--ease-anticipatePop)` **transition**, compute
`ease-in` in both engines, with every gate at 0. The lane reads script writes of the **longhand**
(T6) but not script writes of the **tokens** its resolver follows. LAWS P6 §F names `style.setProperty`
writes. And VERB publishes `--verb-*-ease` from TS, so the publisher is a curve source B8 must read.
**The fix:** `curveTokens` takes `scriptWrites(code, /^--(ease-|verb-.*-ease)/)` from every source,
with E1 as the plant.

### 2.6 `liveFitLaw` doesn't read a declared default (F1)

`.live-face-fit { --live-fit: 0.99; … }` leaves the consumer shape bare (`scale(var(--live-fit))`),
so the new shape clause passes, and CI reads 0. Ablate the host's inline fit, though, and GC1 reds
at **665×665 in both engines**. This is the pass-6 X3 class through a third door: the fallback moved
from the consumer to a declaration. **The fix:** any `--live-fit:` declaration in any stylesheet,
or any `:style` key, other than the one publisher (`mount.style.setProperty` in App.vue) reds, with
F1 as the plant.

### 2.7 Charter rows still open (declared, re-read)

- **Row 7:** four KEYWORD_TWINS (`--ease-starTuck`, `--ease-starFade`, `--ease-prmLinear`,
  `--verb-dusk-ease`) are still lane-admitted (`chair: null`). The verdict line now counts them
  aloud, which is honest, but it's still the chair's row to rule or strike.
- **Row 8 (INTAKE-23 rows 17 and 19):** the gate halves exist (T5, T9, T10 red), but the product
  still has more than one home and more than one publisher. OPEN.
- **Row 9:** row 15's fallback closure is still not a ledger row. The π key is not re-cut on ≥ 2 poses
  (GC1 still runs at 1440, fine, one pose).
- **Row 10 (T9-B27):** numbers-only, with the reason. The number collides with INTAKE-23 §5, which
  gives B27 to M22/TAB-PEN. The chair must renumber.

### 2.8 Smaller rows

- The ci.yml SHA fetch is proven on file:// (mine) and not on GitHub. Fetching a reachable SHA is
  GitHub's documented behaviour and `74a2b5d9` is on `origin/master`, but the first CI run is the
  proof.
- `BASE_REF` honours `process.env.BASE_REF`, so one `env:` line in ci.yml would re-point the floor
  at the tree itself. It's in review like the stamp, but it's a second knob on the one floor. Pin it,
  or red when it isn't `74a2b5d9…` in CI.
- `knip.json` makes `scripts/shape-census.mjs` an entry so that its unused exports don't red. That's
  consumer-less substrate by declaration, and the entry says it "dies when each export has a scripts
  consumer". The chair's row.
- The README's battery line is stale ("see run5 below", with no result filled in). My re-run above
  supplies the result: 45/45.

---

## 3 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | clear: 91 RED, 0 vacuous, and the pass-6 A2 collision is re-cut on a synthetic bank (A2c red at D0 and D1) |
| spec-cites-itself | clear |
| gates that cannot fail | **HIT**: B6 cannot fail on a compound override, `index.html`, a longhand or a semicolon-less declaration (§2.1, §2.2). The TS roster cannot fail on a consumer swap (§2.3). B13 cannot fail on `Math.min`, bracket access or a shift (§2.4) |
| elegant-reduction trap | **partial**: "what a source gate cannot see: a class string kept alive as dead code" is declared (X7″), while §2.1 is a class the library already handles |
| legacy aliases | **HIT (declared)**: four self-admitted KEYWORD_TWINS |
| masked fallbacks | **HIT**: `--live-fit: 0.99` declared (F1); a script-published curve (E1) |
| unverified gestalt | clear: the specs were re-run in both engines, and the plant paint was read in both engines on three served arms |
| consumer-less substrate | **HIT (declared, small)**: the knip entry keeping the library's unused exports alive |
| generic default | clear: no pixel moves |
| π | clear: 0 served bytes (identity = VERB's pass-6 dist) |
| constraint forgot | **HIT**: the SHAPE law (LAWS P6 §F) applied to one of the gate's readers (B8) and not to the ratchet (B6), the gate's title claim. M16 0, the @property law green (49 served), census 0, filterBudget unmoved by identity |

## 4 · Convergence, earned

**82 %** (from 80). Earned: all six pass-6 demonstrated rows closed and reproduced on a CI-regime
snapshot (+3: B8 five spellings, DELETED, decoy, depth, TS arithmetic, `max()`); INTAKE-23 row 18 in the
self-test both ways (+0.5); rung re-stamp shut (+0.5); the lane's battery whole at 45/45 (+0.5); honest
declarations (+0.5). Withheld: the ratchet walked down through every CI gate on the SHAPE law's own
plant, plus `index.html`, a TS consumer swap and a B13 clamp (−2.5); B8 blind to a script-published
token (−0.5); `liveFitLaw` blind to a declared default (−0.5); charter rows 7, 8 and 9 still open (−0.5,
declared).

**ADVANCE.** No primitive is missing. The one library that closes §2.1 and §2.2 is already imported by
this gate, and §2.3–§2.6 are each a reader clause with its plant. It isn't at 100 because a real
300 → 150 shortening still exits 0 on every gate in CI, and the owner-facing rows (homes and one
publisher) aren't landed in product.

## 5 · Cross-pollination

1. **A ratchet keys on the SUBJECT, never the prelude.** Every banked key (`file :: selector :: term`)
   should resolve through `shape-census` subject compounds. This applies to LEDGER's reserve law,
   FACE's lengths, and any estate floor keyed by selector text.
2. **A clock read inside a call is arithmetic** (`Math.min`, `Math.max`, bracket access, shifts). This
   applies to VERB's rule 7 ("a mover types its own duration") and any TS-clock gate.
3. **A token gate reads script publishers.** VERB's `--verb-*-ease` publisher, the undefined-token
   census and any `--ease-*` / `--ring-*` value gate should count `setProperty` writes as declarations
   *and* as values.
4. **A measured token has one writer.** Any declaration of `--live-fit` (or FACE's measured lengths)
   outside its publisher is a fallback.
5. **The consumer roster is a ratchet too.** TS reads of `MOTION.*` are sites, keyed and banked like
   CSS.

## 6 · Replay route

`git archive cb17b5f3` (from the shared object store, the temp-index write-tree of the worktree),
then a one-commit repo with `git fetch --depth=1 file://<repo> 74a2b5d9…` (CI's regime). Then
`instruments/crit7.py <fe> <scratch> <gitdir> [rows…]` for the plant table; the lane's
`break7.py` with the same three arguments for the 45 rows; and `instruments/crit-paint.spec.ts` against
three previews (control `w7-control` dist; the snapshot's build; a plant copy with L7a, F1 and E1,
with `csp-solver` symlinked for the template plugin). Then `instruments/prereturn-crit.sh` for the battery.

## 7 · Incidents, self-declared

1. The live worktree was only read, through a temp-index write-tree (twice, `cb17b5f3`). All builds
   and attacks ran on scratch copies. I ran no git in the control tree. `git init` and `git commit`
   ran only in the scratch snapshot repo, never on main or in a worktree.
2. `vite build` writes its bundled config under `<root>/node_modules/.vite-temp`, and that
   `node_modules` is main's, through the symlink. Vite removed its temp file itself (the directory
   read empty after both builds). No file of main's was left changed.
3. A first eslint probe went to the background under zsh (no word-splitting in `set -- $x`). It
   failed on a `cd` and left an orphaned `npm exec eslint`. Both were killed by PID (71988, 99485).
   The re-run (stdin against the snapshot's config) is the one cited. The first plant-copy eslint
   exits of 2 were config-load failures of the copy and aren't cited.
4. The first plant build failed: the copy had no `csp-solver/data` for the template plugin. I
   symlinked the snapshot's `csp-solver` and rebuilt.
5. The first plant battery reported `motion=1` on every row, because the copies lacked `e2e/`. It
   was re-run with `e2e/` and the configs copied, and only the second run's side columns are cited.
6. Servers were killed by recorded PID, and the ports read free afterwards: tree :4234 (26899, npx
   26675), control :4235 (26890, npx 26677), plant :4236 (88205). My scratch PW and vite configs
   lived in scratch copies, never in a worktree, and were moved to `<scratchpad>/trash-ladder7crit/`.
   There was no `rm`.
7. Box load (1-min) was 21–51 during the run. No timing row is cited; every paint row is a computed
   read.
