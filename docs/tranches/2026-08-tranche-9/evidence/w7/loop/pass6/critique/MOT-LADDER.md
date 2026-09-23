# MOT-LADDER — pass 6 CRITIQUE (adversarial, non-author)

T9-W7 §13, the transition grammar. Subject: the pass-6 prototype in the one §13 tree
`.claude/worktrees/wf_f72f3b5a-83a-59`. At my open and again at my close, its write-tree through a
temporary index was **`53a73123`**, which equals the lane's claim (VERB had not started). I never
served, built or attacked the live tree. Every reading below is on a `git archive 53a73123` snapshot
in my scratchpad. That snapshot is not a git repo, so `BASE_REF` is unreachable there, **which is
exactly CI's checkout-depth-1 regime** (ci.yml has no `fetch-depth` anywhere). Base and π control in
every row: **`74a2b5d9`** (`w7-control`, served read-only by its own preview command, verified by
`index-CubiZsMVSwTc.js`). No git ran in the control. Payload: the specs' own `encodeSudoku(3, <71
givens>, 81)`, read back as 71 `given clue` aria-labels.

**CONVERGENCE: 80 %. VERDICT: ADVANCE.**

Every door the pass-5 critic opened is now shut, and I reproduced all of them myself at CI's depth.
The ratchet still lets a real shortening through CI, though. Two routes are ones the lane declared,
and I built both. Two more are new: B8's "by value" cure still reads spelling (five spellings of a
UA keyword exit 0 on every gate), and a lawful DELETED row crashes the gate. That last one is a
TypeError, not a red, on the very door the gate's own message tells an author to use.

---

## 0 · Numbers first (re-measured by me)

| reading | control `74a2b5d9` | tree `53a73123` |
| --- | --- | --- |
| clean build (config, outDir and cacheDir in the scratchpad) | `index-CubiZsMVSwTc.js` | **`index-DWMUHdQr1EaZ.js` / `index-CWzrjV_2Zj9L.css`**. This is the lane's identity **and** registry-v5's cited identity for `9a5475da`, so pass 6 moves **0 served bytes**. The tree has 38 files in `assets/` and 44 in total; the lane's "38 files" counts assets only, while the control's 43 is a total. |
| `ladder-prm.spec.ts`, four poses, both engines (hasTouch witnessed) | **8/8 RED** at the rung row | **8/8 green** |
| `live-fit-ablation.spec.ts` (GC1), both engines | **2/2 RED, board 672×672** | **2/2 green, 0×0** |
| GC1 on MY plant dist (`scale(max(var(--live-fit), 0.99))`, `index-BRjaaRxSFp7q.js`) | — | **2/2 RED, 665×665**, both engines. The estate row catches what CI misses (§2.4). |
| CSSOM ladder registrations (`CSSPropertyRule`) | 0 | **8, all depth 0, all `inherits: true`, initial `0s` / `0`**, both engines |
| clause 4 in-page (the lane's probe, copied) | — | `true` gives 0.52s and `false` gives **0s**, both engines (reproduced) |
| `npm run lint:bands` / `--self-test` | absent | **0**, 64 RED, HELD rows HELD |
| the lane's break-tests, **re-run at depth 1** | — | **13/13 as expected** (A1, A1b, A2, A2b, A3, C4, C5, C6, C13, P5-3, P5-5 and P5-7 exit 1; rows 0 and FINAL exit 0; restores sha1-verified). A2b's 1 at depth 1 is ACCIDENTAL (§2.2). |
| pass-5 plants run FIRST (A1, A2, A3, `inherits: false`, 0.99, 90→10, P5) | — | **all exit 1** (pass 5: all 0) |
| check-property-block (chair's copy) | 0 | **0** |
| undefined-token census (chair's copy) | 1 (the declared STALE `--refuse-dur`) | **0** |
| check-copy-register bare (M16) | 0 | **0**, with 0 unadmitted |
| filter census (estate spec, T6 dist, **light**) | — | **12/12**, both engines. The dark `crayon-heart` red is the chair's inherited fold pick, not read here. |
| pre-return battery, bare, on the snapshot | lane: 0 (bands and verbs absent: 1) | lint:lanes · theme-tokens · sleep · test:e2e:projects · motion · copy · verbs · bands · `npm run lint` (the scoped prettier) · check-pw-projects · `eslint .` · `vue-tsc -b`: **all 0** |

### My attacks, through CI's exact invocations (`npm run lint:bands`, `npm run lint:verbs`, `check-motion-contract`)

| # | the commit | bands | verbs | motion | what ships |
| --- | --- | --- | --- | --- | --- |
| X2ctl | `--ease-standard: ease-in` (negative control) | **1** | 0 | 0 | — |
| X2a | `--ease-standard: EASE-IN` | **0** | 0 | 0 | `ease-in` (computed, both engines) |
| X2b | `--ease-standard: linear(0, 1)` | **0** | 0 | 0 | `linear(0 0%, 1 100%)` = `linear` |
| X2c | `--ease-standard: var(--ease-nope, ease-in)` | **0** | 0 | 0 | `ease-in`; theme-tokens and the chair's census are **0** too |
| X2d | `--ease-standard: CUBIC-BEZIER(0.42, 0, 1, 1)` | **0** | 0 | 0 | `cubic-bezier(0.42, 0, 1, 1)` = `ease-in` |
| X2e | `transition-timing-function: ease-in !important` after the dusk shorthand | **0** | 0 | 0 | `ease-in` (the longhand wins) |
| X3ctl | `scale(var(--live-fit, 0.99))` | **1** | 0 | 0 | — |
| X3 | `scale(max(var(--live-fit), 0.99))` | **0** | 0 | 0 | a 665 px board where no fit was measured |
| X4 | `usePathAnimation.ts`: `duration: MOTION.rungs.whisper / 3` | **0** | 0 | 0 | a 50 ms WAAPI clock |
| X5 | `GameGallery.vue`: `MOTION.dealStaggerMs / 9` | **0** | 0 | 0 | a 10 ms deal stagger, with the EXEMPT row still reading 90 |
| X6 | a second `@property --motion-throw { inherits: false }` in an SFC `<style>` | **1** | 0 | 0 | — (holds) |
| X7 | the lane's gap 1, built: a dead decoy `.cell-reveal-animated-hold` keeps `cell-reveal 0.3s` and the MOVED row points there; the real reveal is renamed whole to `.cell-pop` / `@keyframes cell-pop` at `var(--motion-whisper)` | **0** | **0** | 0 | **the cell reveal at 150 ms, not 300** ("nothing shortened") |
| A2c | the lane's gap 2 at depth 1 on another site: bank `CaretOverlay … opacity` 200→150, CSS leave→whisper, `BANK_SHA256` re-stamped (3 lines) | **0** | **0** | — | **the caret leave at 150 ms, not 200** |
| X8 | a LAWFUL deletion by the gate's own advice: CaretOverlay's one site deleted, `{ key, ms: 200, cls: "DELETED" }` added | **1, BY CRASH** | 0 | 0 | `TypeError: row.ms.join is not a function` at B1's closure |
| X1 | the total rename plus a DELETED row (`ms: 300`) | **1, BY CRASH** | 1 (VERB's stale literal) | 0 | the same TypeError |

The in-page probe (`instruments/ease-probe.mjs`) shows each spelling computes to the keyword's curve
in chromium and webkit.

---

## 1 · Strengths (re-measured, not accepted)

1. **Every pass-5 door is shut and stays shut at CI's depth.** A1 is shut three ways (a character
   newKey must be consumed, a banked newKey is refused, and the decoy's same-term clause holds). A2
   is shut by the stamp. A3 is shut because the whole-file skip is deleted. `inherits` is read as a
   parsed descriptor, `--live-fit`'s initial is anchored, and EXEMPT rows are valued with STALE
   closure. VERB's P5 reds too. I ran the lane's break-tests on a depth-1 snapshot: 13/13 as
   expected, restores sha1-verified.
2. **Both specs are real rows.** `ladder-prm` holds four poses in their own contexts, with hasTouch
   witnessed. `live-fit-ablation` is born-RED on the control at 672×672 in both engines, and it
   caught a plant I built that `lint:bands` did not (665×665). The estate half of the visible-failure
   clause works.
3. **The pass is pixel-silent to the byte.** My clean rebuild gives the lane's identity, which is
   also v5's cited identity for the pass-5 bank. π, AA and filterBudget cannot move when zero served
   bytes move. The aria read-back replaces pass 5's vacuous `innerText` in both specs.
4. **The gaps are honest.** Gaps 1 and 2 were declared in the lane's own words, and both reproduce
   exactly as described (X7, A2c). The lane named its own crash-as-red incident and fixed it in
   `admits()`. The GC2 re-statement is correct: I checked all eight exceptions against `74a2b5d9`,
   and every one is a pre-existing length on a line whose curve changed.

---

## 2 · What is NOT converged — demonstrated

### 2.1 B8 "by value" is still by spelling (charter row 13 claims CLOSED for keywords)

`UA_KEYWORD` and `pointsOf` are case-sensitive exact regexes. `resolveCurve` follows only a bare
`var(--x)` and passes a `var(--x, <fallback>)` through as an opaque string. The CSS `linear()`
function isn't recognised, and B8 reads only the `transition` shorthand, never
`transition-timing-function`. So X2a through X2e each ship a UA keyword and leave bands, verbs,
motion, theme-tokens and the chair's census all at 0, while lowercase `ease-in` reds (X2ctl). This is
the P5 "gate a name's VALUE" law failing a second time on the same gate: the cure widened the
spelling set without reading the value. **The fix:** resolve the COMPUTED curve (lowercase the value,
evaluate a `var()` fallback when the referent is undeclared, normalise `linear(0, 1)` / `linear(0 0%,
1 100%)` to `linear`), and read every `transition-timing-function` longhand, with X2a–X2e as
self-test plants.

### 2.2 The ratchet still passes a real shortening through CI (the title claim, a fifth time)

- **X7 (gap 1, built):** a dead-selector decoy that shares the term keeps the MOVED row lawful. The
  real reveal ships at 150 ms and all three gates print green. The bound the lane names (B1) doesn't
  apply, because the new site reads a rung. **The fix:** a MOVED `newKey`'s selector must be
  CONSUMED (its class token appears in a template or TS outside the stylesheets; the decoy has 0
  consumers). Alternatively, make the bank TOTAL: any live site the bank doesn't hold reds until
  re-banked, which routes every rename through the stamp.
- **A2c (gap 2, at depth 1):** a 3-line commit exits 0 and prints "nothing shortened". `b6Floor`
  swallows the unreachable `BASE_REF` without a word. The lane's A2b row reds at depth 1 **only
  because the self-test's own A2 control models the same `cell-reveal` 300→150**, so the re-stamp
  makes that control VACUOUS. On any other site it exits 0. **The fix:** one line in ci.yml
  (`fetch-depth: 0`, or a fetch of `74a2b5d9`) on the lint:bands job, plus B6 reds when `CI` is set
  and `BASE_REF` is unreachable, rather than skipping the re-derived floor.
- **X4 / X5 (new):** arithmetic on a rung or an exempt member in TS (`MOTION.rungs.whisper / 3`,
  `MOTION.dealStaggerMs / 9`) passes every gate. The code roster counts 22 clocks but ratchets none of
  them, and the EXEMPT value law binds the declaration, not the clock the page spends. **The fix:**
  the roster reds arithmetic on a `MOTION.*` read unless an `ADMITTED_TS` row names the expression
  and its value (GameGallery's `throw * 0.42` = 218 ms is the one lawful row today), with X4 as its
  plant.

### 2.3 The lawful DELETED door crashes the gate (charter row 3's lawful half)

B1's closure loop (`check-motion-bands.mjs` ~l.779) skips only MOVED and RETUNE, then calls
`row.ms.join` on any other LEDGER row. A DELETED row carries a numeric `ms`, so **every DELETED row
in `ADMITTED` throws**. That includes the lawful deletion the gate's own B6 message prescribes (X8:
`TypeError: row.ms.join is not a function`, exit 1). The self-test's HELD "real deletion" calls
`b6NoShorten` directly and never reaches B1, so it cannot see this. It's the same crash-as-red class
the lane declared and fixed in `admits()`, left in a sibling loop. **The fix:** add
`row.cls !== "DELETED"` to B1's closure, and add a self-test that runs the whole `CHECKS` list with a
DELETED row in the ledger.

### 2.4 `liveFitLaw` gates the fallback's spelling

`scale(max(var(--live-fit), 0.99))` (X3) exits 0 on bands, while `var(--live-fit, 0.99)` reds. The
built plant paints a 665×665 board where no fit was measured, and GC1 reds it in both engines. That
spec is an estate row, though, not CI (O-12), so CI's half of the visible-failure clause is blind to
a `max()`, `clamp()` or `calc()` wrapper. **The fix:** every consumer reads `--live-fit` as the
WHOLE argument of `scale()` (anchor the consumer shape), with X3 as the plant.

### 2.5 Smaller rows

- **Four of the five KEYWORD_TWINS are self-admitted aliases.** The chair admitted only
  `--ease-prmFade` (pass-6 rulings §1.4). `--ease-starTuck`, `--ease-starFade`, `--ease-prmLinear`
  and `--verb-dusk-ease` are the UA keyword kept under a house name and admitted by the lane's own
  table. Declared (gap 3), but it's a chair's row, not a lane's.
- **The record:** the on-disk `pass6/prototype/MOT-LADDER/pass6-ladder.diff` was rewritten at 12:07,
  after the README (12:05). It's now **389,856 B across 54 files: the cumulative `74a2b5d9 →
  53a73123` cut**, which applies on `74a2b5d9` to `53a73123` (I verified this) and does NOT apply on
  `9a5475da`. The README's "50,935 B, 4 files, applies on `9a5475da`" is false of the file on disk.
  This is pass 5's record defect again, and a pointer note is owed. It's the chair's overwrite, not
  the lane's.
- **Row 12** (bundle +6,644 / +1,979 merged, 0 / 0 this pass) is the chair's re-cut. **Row 15** was
  closed by the charter's fallback, and the flip delta is still unexplained beyond "pass 4's".
- The π key is structural (declared). GC1 runs one pose (1440, fine, motion on).

---

## 3 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | **HIT (small)**: at depth 1, A2b reds only through the self-test's own A2 control going VACUOUS (§2.2) |
| spec-cites-itself | clear |
| gates that cannot fail | **HIT**: B8 on five spellings (§2.1); `liveFitLaw` on `max()` (§2.4); the code roster on rung arithmetic (§2.2); `b6Floor` never runs in CI |
| elegant-reduction trap | **partial**: "no gate over a content-anchored key can follow a site whose every name changed" is stated as a limit, but a consumed-selector clause or a total bank closes it |
| legacy aliases | **HIT (declared)**: four KEYWORD_TWINS admit a UA keyword under a house name without a chair's row |
| masked fallbacks | **HIT**: `var(--ease-nope, ease-in)` passes B8 and the census; `max(var(--live-fit), 0.99)`; `b6Floor`'s silent skip |
| unverified gestalt | clear: both specs and the CSSOM were re-run both engines; the B11 strip was looked at (600 trails 520 at every instant) |
| consumer-less substrate | clear: the twin STALE clause closes it |
| generic default | clear: no pixel moves |
| π | clear: 0 served bytes vs the pass-5 bank |
| constraint forgot | clear: M16 0, filter census 12/12 (light), AA unmovable, @property clause 4 in CSSOM, census 0. **One crash-as-red** (§2.3) |

## 4 · Convergence, earned

**80 %** (from 76). Earned: the seven pass-5 plants all red through CI at depth 1 (+4); GC1 as a
born-RED spec that catches a plant CI misses (+1); four poses (+1); dist identity and aria read-back
honest (+1); honest gap declarations reproduced exactly (+1). Withheld: B8's value cure still reads
spelling on five forms (−2); the lawful DELETED door crashes (−1); the title claim still fails
through CI via X7, A2c and X4 (−1, since two were declared); `liveFitLaw` blind to `max()` (−0.5);
the record's diff pointer (−0.5).

**ADVANCE.** No primitive is missing. Every cure is a clause of gate code (or one CI line) with its
plant, and the family's idea (absence equals reduce, the ladder is registered once) holds in the
CSSOM of both engines. It isn't at 100 because the ratchet can still be walked down through CI, and
B8 is still a spelling gate.

## 5 · Cross-pollination

1. **A value gate resolves the COMPUTED value**: case-fold keywords, evaluate `var()` fallbacks, know
   `linear()`, and read longhands. This applies to MOT-VERB's `check-pencil-verbs`, the chair's census
   (it passed `var(--ease-nope, ease-in)`), and any `--ease-*`/`--ring-*` gate.
2. **A floor that needs `BASE_REF` is dead at depth 1**: set `fetch-depth` on the job, or red when CI
   can't reach it. This applies to every ratchet in the estate.
3. **A new ledger class needs every loop that walks the ledger exercised**: run the whole CHECKS list
   with one row of each class in the self-test (the crash in §2.3).
4. **A visible-failure clause anchors the consumer's SHAPE, not the absence of a fallback**
   (`max()` defeats it).
5. **Clocks spent in TS are part of the ladder**: arithmetic on a rung is a new length.

## 6 · Incidents, self-declared

1. The live worktree was only read (a temp-index write-tree twice, `53a73123` both times); every
   build and attack ran on a `git archive` snapshot at `<scratchpad>/motladder6crit-*`.
2. My first second-batch attack run failed to source its helpers (`source <(…)` on bash 3.2); nothing
   was edited (`$A` was empty), I verified the attack copy byte-equal and re-ran it.
3. Servers, all killed by recorded PID with the ports read free afterwards: T6 :4238 (36366, npx
   36154), control :4239 (36411, npx 36156), plant X3 :4240 (52322, npx from the pid file).
4. No `rm`, no git in the control (read-only `node scripts/check-copy-register.mjs` there, and its
   preview command). My scratch PW configs lived in the snapshot, not in any worktree, and were moved
   to `<scratchpad>/trash-motladder6crit/` before the battery. The X3 plant was built in the attack
   copy and restored by `cmp`.
5. The box was loaded (other lanes' servers on 4230–4243), and no timing row is cited.
