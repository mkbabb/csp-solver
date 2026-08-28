# T9-W5 §5.4 — GATES WIRED OR DELETED, row by row

Every row's decision named, every surviving row's canary banked in
`gates-wired-canaries.txt` (24 arms, 0 mismatches, exit codes read bare). Measured
2026-08-28 against `4dd9ec9c` plus the working tree — two other waves were landing in
`web/frontend/src/**` while this ran, and where that matters it is said so in the row.

## The decisions

| # | Row | Decision | Where |
|---|-----|----------|-------|
| 1 | coverage floor | **WIRED — and BORN-RED** | `package.json:test:coverage:floor`, ci.yml fe-unit |
| 2 | check-theme-selectors | **STAYS, canaried** | `check-theme-selectors.mjs` check 0 |
| 3 | check-lane-membership | **CORPUS WIDENED** (18 → 26, both trees) | `check-lane-membership.mjs` |
| 4 | golden-magnitude.mjs | **KEPT as a declared local instrument**; the false knip entry deleted | `knip.json`, `golden-magnitude.mjs` |
| 5 | lint:sleep / lint:motion | **EXECUTED** (the row's default, on its merits) | ci.yml frontend lane |
| 6 | ink-pressure | **INVERTED — the crossing is graded** | `check-ink-pressure.mjs` closure 5 |
| 7 | font-coverage | **CORPUS DERIVED**, both containments | `check-font-coverage.mjs` checks 3 + 4 |
| 8 | playerIdentity WRITEABLE | **COMPARATOR LANDED**, both directions | `check-font-coverage.mjs` check 5 |
| 9 | M16 jargon arm | **LANDED**, plus a mask cure it exposed | `check-copy-register.mjs` |
| 10 | M8's standing invariant | **RECORDED HONESTLY** — measured once, cure handed off | this file, §M8 |
| 11 | quarantine teardown | **NOTE ONLY** — W6 executes it | this file, §notes |
| 12 | perf-rig thresholds | **LOCAL INSTRUMENT, every-WGATE** — already trued at W0 | `perf-rig/README.md:39-42` |

---

## 1 · Coverage floor — WIRED, and it is red

`test:coverage:floor` was `node scripts/check-coverage-floor.mjs --self-test`, and that
script's `--self-test` is self-test **only**: it runs the fixture mutants and exits 0 before
the real gate, deliberately, with the reason at `check-coverage-floor.mjs:397` citing run
30720212628. So the fe-unit step named "coverage floor (per-scope, >= the W1.14 baseline)"
re-ran the fixtures the step two above it had already run, printed a green, and never opened
`coverage/coverage-summary.json`. The lane carried two self-tests and no floor. V5-C1 called
it; the script was never the problem, the manifest was.

The manifest now runs the real gate; the self-test keeps its own earlier step (it must run
before the green it grades) and gains `test:coverage:floor:selftest` for a bench run.

**BORN-RED, and this is the row's most important sentence.** The moment it was wired, over a
fresh `vitest run --coverage` (57 files, 735 tests, all passing):

```
[coverage-floor] FLOOR BREACH (3):
  - src/games/futoshiki.branches: 90.24% < floor 93.47% (-3.23 pts)
  - src/games/killer.branches:    95.45% < floor 100.00% (-4.55 pts)
  - src/games/kenken.branches:    96.00% < floor 100.00% (-4.00 pts)
```

Twelve uncovered branches, all of it `*Poster.vue` surface that arrived at T8-W3 (`1802da4e`)
and T8.1 (`3f0f608c`) and was never covered:

| file | uncovered branches |
|---|---|
| `src/games/futoshiki/FutoshikiPoster.vue` | 48, 51, 53, 58, 68 |
| `src/games/futoshiki/clue.ts` | 97, 178 |
| `src/games/futoshiki/composables/useFutoshiki.ts` | 34 |
| `src/games/kenken/KenKenPoster.vue` | 55, 72 |
| `src/games/killer/KillerPoster.vue` | 46, 62 |

A whole campaign of drift under a floor nothing read. That is the case for wiring the gate,
not an argument against it — and the floor is **not** moved to meet it. `--restamp` refuses a
lowering without a spoken `--allow-lower`, the bank's own rule is a pre-registered n=10
minimum with no compare-time tolerance, and nudging a floor down to meet a red is the one
thing this estate forbids outright. The cure is twelve branches of test, it lives in
`src/**`, and `src/**` is radioactive to this lane. **See HANDOFF 1.**

Canary: bare = RED (the three breaches); a summary where every scope clears = GREEN; the same
summary with `killer.branches` driven to 0 = RED; and the **old** wiring over that same dirty
summary = GREEN, which is the false green measured rather than argued.

## 2 · check-theme-selectors — stays, with a population canary

V5-C2 adjusted the finding: vacuous by POPULATION, not by construction. T7-W1's cure deleted
every subject, so the live census read `0 sites over 0 attributes` and greened on nothing.
The fixture self-test proves the check FUNCTIONS bite; it feeds them hand-built models and
never touches `collect()`, so a walker that had stopped reaching `src/` would leave all eleven
fixtures green while the console printed its confident zero.

`populationCanary()` runs on every invocation (the tdz-probe pattern), in two arms:

- **REACH** — the collected corpus must contain `src/assets/index.css`. A named load-bearing
  file, not a count that would need restamping.
- **BITE** — one synthetic `[data-canary-theme]` rule appended to the REAL corpus must red
  check 1. Nothing is written to disk.

The REACH arm exists because the first version did not have it and **the ablation passed**: a
`walk()` with its extension filter dead collected zero files, and the plant-only canary still
found its own plant and reported green. Measured, then cured, then re-measured — the
canary log carries both readings.

**The gate is RED on the working tree, and not for anything in this lane.** A concurrent
`src/**` wave landed three unwritten attributes while this ran:

```
[1 UNWRITTEN ATTRIBUTES] src/games/shared/GameControlPanel.vue  [data-fold-below] .action-bar::before
[1 UNWRITTEN ATTRIBUTES] src/games/shared/scene.css             [data-fold-above]::before
[1 UNWRITTEN ATTRIBUTES] src/pencil/sheet/SheetWashiLabel.vue   [data-under-bar]
```

None of the three is in `HEAD`. This is V5's adjustment confirmed on the same day it was
written — "would fire on the next subject" turned out to be a prediction with a deadline.
**See HANDOFF 2.**

## 3 · check-lane-membership — the corpus stops being name-shaped

The corpus was two regexes over filenames (`check-*.mjs`, `*-probe.mjs`). A law whose subject
is a naming convention has a doorway, and V5 walked three files through it —
`golden-magnitude.mjs`, `golden-selfdelta.mjs`, `dist-identity.mjs` — none visible to the
census that reported every gate wired. Renaming a guard was a way to leave the law.

Now: every `.mjs` in **both** script trees, minus an EXPLICIT exempt list that a new check 4
holds to the declaration's own standard (a live subject, a reason at or above the 40-char
floor carrying a cite, and no lane contradicting it). The list is **EMPTY** — all three
escapees were closed by wiring or declaring, and an exemption not needed is an exemption not
taken. The repo-root tree enters at the same time: `check-doc-truth`, `ledger-diff`,
`check-evidence-policy`, `check-inline-tests` and `edge-probe` are gates by every test this
file applies, and not one was under it. **18 files → 26, all resolved.**

Canaries: the wave's tree GREEN; `golden-magnitude.mjs` stripped of its declaration RED; the
**old** gate over that same plant GREEN (the escape, measured); `edge-probe.mjs` stripped RED
(the root arm); `ledger-diff.mjs` deleted out from under its step RED (check 3's dual). Six
new fixtures cover check 4 both colours and the two root-tree reachability forms.

## 4 · golden-magnitude.mjs — KEPT, declared; the false entry deleted

The disease V5 named was the badge, not the file: `knip.json` listed it under `entry` cited to
"ci.yml, the golden lane", and that lane was deleted with e2e/e2e-webkit/perf-subset at
T7-WGATE (`d1daefb3`). Nothing had run it for a campaign and nothing could have.

Wiring it to CI is not available — it spawns `playwright test` and CI is browserless by
standing ruling O-12. Deleting it was weighed and declined on one ground: the blind band it
reads (darwin soul floor 0.017, linux clause floor 0.05) is still live in
`visual-golden.spec.ts`, which still carries the `GOLDEN_MAGNITUDE=1` hook this file drives,
and its sibling `golden-selfdelta.mjs` is kept on exactly the same footing. Deleting one and
keeping the other would have been a coin toss dressed as a ruling.

So: the false `entry` line is gone, `scripts.test:golden:magnitude` is the referent knip
resolves for itself (knip green), and the file carries a `NOT-A-LANE:` header that check 3's
widened corpus now polices. `golden-selfdelta.mjs` gains the same declaration for the same
reason. Both cite this file.

## 5 · lint:sleep / lint:motion — EXECUTED

The audit's phrasing ("gates policing specs no lane executes") is about the SUBJECT, not the
gate: both are wired in the frontend lane today, at `ci.yml` steps that predate this wave, and
they read `e2e/`, which O-12 made a local instrument. An instrument is used at every WGATE
production pass, and a rotted spec is a rotted instrument — these two are the only standing
guard the estate has over its own instruments between passes. They are static greps over a
directory the checkout already carries, they install nothing, and both self-test. The
alternative on offer was deletion, which buys back nothing and disarms that guard. **Decision:
executed, unchanged, with the reasoning now written at the steps themselves.** Both verified
green this wave (`exit=0` bare) and both self-test on every run.

## 6 · ink-pressure — the crossing is graded

The script computed the ramp's cross-theme rank against `--color-muted-foreground` on every
run, printed *"the ramp and the register cross between themes. Booked in index.css §INK
PRESSURE, not gated"*, and exited 0. A gate that measures a defect and passes is narrating,
and narration erodes exactly the way the memo it replaces does.

Closure 5 grades it. `rankOf(css, theme)` produces a rank string per theme; `gateRank` reds
unless both match the ONE admitted ruling:

```
light  rule < muted-foreground < quiet
dark   rule < quiet < muted-foreground
```

**Why admitted rather than simply red.** The inversion is booked with its reasoning at
`src/assets/index.css` §INK PRESSURE: tokenising `muted-foreground` onto the ramp re-pitches
every muted surface in the estate, which is a design ruling and not an AA repair. A gate does
not get to overturn a design ruling, and the cure lives in `src/**` besides. So the ruling is
admitted the way this estate admits things — **closed both ways**. A second crossing reds. A
re-pitch that moves either rank reds. And if the crossing ever ends, the ruling is stale and
reds too, so the booking cannot outlive the condition it describes. The old sentence survived
all three.

Canaries: control GREEN; the quiet rung re-pitched 68% → 60% RED (the light rank moves); a
ruling describing a crossing this tree does not have RED. Three self-test modes
(`rank-moved`, `rank-stale`, `rank-second`) run in CI on every `--self-test`.

## 7 + 8 · font-coverage — the corpus derives, and WRITEABLE is compared

The gate compared a hand-written corpus to the cmap: one containment out of the two the claim
needs. It answered *does the cut hold the strings we wrote down*; the shipped defect answers
no to *are the strings we wrote down the strings the app renders*. That second question is the
T8 ransom-note trap, and the gate that exists for it was blind to it.

Now every corpus group carries a `derive` naming the extractor that reads where its strings
are AUTHORED — `heading: "…"` in the five `spec.ts`, `name:`/`label:` in `games/cards.ts`, the
static `text="…"` on `<SheetWashiLabel>`, a `.zone-row-label` span's text — and **check 3
requires DERIVED ⊆ DECLARED**. Containment is one-way on purpose: a declared string the tree
no longer renders is a DEPARTURE (the subset stays a superset so a string's return is not a
font bug) and departures are printed, never red. Two today: Fraunces `"Board Size"`, Patrick
Hand `"teacher's"`.

The derivation grew the Patrick Hand corpus from **4 declared strings to 13**. Eight tooltips
had been painting in a 46-codepoint subset with nothing comparing them to it. All thirteen
clear the cut — measured, not assumed; the hand's repertoire is lowercase and the tooltips are
written in it.

**Check 4** keeps the derivation from going blind: three `:text="expr"` bindings cannot be read
statically, so they are PINNED with the register each renders in. A new one reds until someone
says what it paints; a pin naming no binding reds too.

**Check 5** is the WRITEABLE comparator. `playerIdentity.ts` has claimed since T6 that the
hand subset "ships a–i, k–w, y and z — no `j`, no `x`" and nothing had ever compared the claim
to the file. Compared now, both directions, off the same parsed cmap: the subset's lowercase
repertoire is exactly `a b c d e f g h i k l m n o p q r s t u v w y z`, and the regex class
`[a-ik-wyz]` expands to exactly that. The claim holds. A re-cut that adds `x` reds (the
generator would refuse a name the page can now draw); a re-cut that drops a letter reds (a
half-drawn slug on a roster row).

Canaries: control GREEN; a new rendered tape the corpus does not hold RED; a spec eyebrow
renamed RED; WRITEABLE widened to `[a-z]` RED; a stale bound pin RED.

## 9 · The M16 jargon arm — landed, and it found a hole in the dash arm

**The arm.** A curated lexicon of 25 entries, each with the register it comes from (solver
technique names, solver vocabulary, the machine's name, meta-language), over RENDERED strings
only: template text, the attributes that reach a reader or a screen reader, this estate's own
copy props, the script-side copy constants, and `index.html`'s head. **Not** every string
literal, and that is the design: `TechniqueId` is the literal string `"naked-single"` by
explicit ruling (`techniqueVoice.ts`), and a wide net would red on the identifiers T8-W6 kept
on purpose. The dash arm can afford a wide net because a dash in an identifier is always
wrong; a lexicon cannot. Twelve self-test controls, both colours, including four positive
controls that pin the boundary (engine identifier, bound attribute, the player's verb
`Solve`, jargon inside a comment).

**Two live hits on its first run over the tree**, both ADMITTED with the seam that owns the
cure and both closed both ways — an admission whose string leaves the tree reds until the
entry goes with it:

- `GameControlPanel.vue` `text="the solver finishes the board"` — the machine's name. T8's live
  pass flagged this exact string, logged it "for adjudication" (close-record §6.1:184-185) and
  closed without adjudicating it; T9 re-derived it at F4 and booked the cure to T9-W7 §9
  (ballot B1).
- `GameControlPanel.vue` `.zone-row-label` `candidates` — the solver's word for the thing the
  tape beside it calls "every digit that still fits in a cell". T8-W6 deleted the technique
  register and this survived because that census was about technique NAMES.

Admitting rather than narrowing the lexicon is deliberate: the difference between a wave that
cannot cure a defect and a wave that cannot see it. **See HANDOFF 3.**

**The mask cure, which the arm exposed.** The style mask was `/<style[\s\S]*?<\/style>/` and it
ran FIRST. `GameControlPanel.vue`'s header prose MENTIONS the string `<style>`, so the pattern
opened there and closed 103,706 characters later at the file's real `</style>` — blanking the
entire single-file component. The gate then found `<template>` at index −1, skipped its
template arm, ran its literal arm over 103KB of spaces, and reported the file scanned and
clean. **The estate's densest product-copy surface, roughly 1,300 lines, has been outside this
census since the gate shipped**, and the console line said `scanned across N files` the whole
time. Comments are blanked before the style block now and the style pattern is line-anchored;
a control fixture pins the shape. Measured estate-wide: exactly one file was affected, and the
corrected mask surfaces **zero** new dashes — the hole was real and, this time, empty.

Canaries: control GREEN; a technique name plus the machine on a rendered tape RED; the
admitted string cured, so the admission goes stale, RED; and the pair that proves the mask —
the **old** gate over an em dash planted in `GameControlPanel.vue`'s template GREEN, the cured
gate over the same plant RED.

## 10 · M8's standing invariant — recorded honestly

The recap booked M8 (`the bottom controls must not reflow the page game-to-game`) as PARTIAL:
"the closure rests on a wave-time measurement, not a standing invariant … no spec asserts the
band's box across the five games — `.staging-slip` appears in `e2e/` exactly once, at
`e2e/gallery-deal.spec.ts:141`, and never as a geometry assertion."

That is still true, and this lane cannot change it. The invariant is GEOMETRIC — the band's
rendered box, identical across five games — so the only instrument that can assert it is a
Playwright geometry assertion, which is (a) browserless-forbidden in CI under O-12 and (b) in
`e2e/`, which is not this lane's fence. The mechanism the invariant rides is visible
statically (`.staging-slip { min-height: var(--staging-reserve, 10.5rem) }`, re-declared at the
42rem breakpoint), and a gate over that CSS reserve was considered and **rejected**: it would
assert the mechanism and claim the surface, which is the proxy-is-not-the-surface mistake the
estate's own lessons file names first.

**So the row records the truth: M8 is closed on a wave-time measurement taken once at T8, with
no standing invariant, and any future content change can re-mint the reflow silently.** The
instrument that would close it is one spec, named in HANDOFF 4.

## Notes

**11 · quarantine teardown** — W6's, noted only. The CH-62 quarantine park stands whole though
CH-62 is RETIRED, still subtracting 15 rows from the e2e census; when W6 tears it down those
rows return to the floors' census and `census.stamp.json` restamps at the WGATE. Nothing in
§5.4 touches it.

**12 · perf-rig thresholds** — DECIDED and already trued at W0. `perf-rig/README.md:39-42`
reads: *"Four assertions, every one read out of gates.json at run time. They read like CI
tripwires and they aren't: no lane executes them, CI is browserless under O-12, and the four
are LOCAL/device instruments — cadence DECIDED at T9-W5 (every WGATE production pass), GATE D's
executor chartered at T9-W8."* No edit needed; verified unmodified against `HEAD`. The rig's
six modules stay outside knip's project scope for the reason `knip.json` states (they run as
child processes, never as imports) and outside the lane-membership corpus because they are
under `perf-rig/`, not either `scripts/` tree.

## Handoffs

1. **The coverage floor is RED and the cure is in `src/**`.** Twelve uncovered branches, listed
   above with file and line. Whoever owns `src/**` at the seal adds the tests; the floor stays
   where it is. If the chair would rather not seal on a red, the only honest alternative is to
   revert `package.json:test:coverage:floor` to `--self-test` — and that is the defect, back.
2. **Three unwritten theme selectors from a concurrent wave** (`data-fold-above`,
   `data-fold-below`, `data-under-bar`). Their wave lands the writers or the allowlist entries;
   `lint:theme-selectors` reds until then. Not in `HEAD`.
3. **Two admitted M16 strings** in `check-copy-register.mjs:ADMITTED`, both
   `GameControlPanel.vue`, both booked to T9-W7 §9 / ballot B1. Cure the copy and strike the
   entry in the SAME commit — the gate reds on a stale admission, by design.
4. **M8's geometry spec** belongs to the wave that owns `e2e/`: assert the staging band's
   bounding box is byte-identical across the five game cards at one viewport, beside
   `e2e/gallery-deal.spec.ts:141` where `.staging-slip` is already located. One spec closes the
   recap row that this lane could only record.
5. **`README.md:112` is now false about this lane.** Its CI paragraph reads *"A per-scope
   coverage floor is banked in the tree but is not enforced among them: the frontend lane's
   coverage step runs that gate in its `--self-test` mode alone, which proves the gate able to
   fail and then returns, comparing no scope against its baseline."* That sentence describes
   the defect this row cured. `check-doc-truth` already reds on the same line for the lane
   COUNT (18 jobs vs "seventeen", the dist lane's doing), so both corrections land together.
   `README.md` is outside this lane's fence.
6. **`scripts/check-doc-truth.mjs` is prettier-dirty at `HEAD`** (`4dd9ec9c`), at line 1770 —
   the `grep(rel, /(\d[\d,]*)\s+passed…/)` call wants a four-line break. `npm run lint` reds on
   it and it is the only file left doing so. It belongs to §5.5's lane, not this one.

## What ran, at the end

`npx vitest run` → **Test Files 57 passed (57)**, Tests 735 passed (735).
`lint:eslint`, `lint:knip`, `lint:ink`, `lint:catch`, `lint:theme-tokens`, `lint:lanes`,
`lint:sleep`, `lint:motion`, `lint:copy`, `lint:tdz`, `test:font-coverage`,
`test:support-floor` → all `exit=0`, bare.
`lint:theme-selectors` → `exit=1` on the three concurrent-wave selectors (HANDOFF 2).
`npm run lint` (prettier) → `exit=1` on `scripts/check-doc-truth.mjs` alone (HANDOFF 6).
`test:coverage:floor` → `exit=1`, three scopes, born-red as recorded (HANDOFF 1).
Canary battery → 24 arms, 0 mismatches (`gates-wired-canaries.txt`).
