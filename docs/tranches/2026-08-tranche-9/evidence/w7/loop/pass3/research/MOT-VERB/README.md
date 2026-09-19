# MOT-VERB — pass 3, RESEARCH · the re-cut, priced on the new base

§13 the transition grammar (M02, M09's design half). Family centre unchanged: motion is a small
set of VERBS, each a curve bound to a property set and enforced at the declaration; a delay keeps
its number and only travel takes a rung; `spend(verb, rung)` is the one WAAPI door and returns the
verb's fill; the toggle's gesture is admitted whole with its beat table beside it. Re-homed onto
MOT-LADDER's ladder (registry-v2 §2.1).

Read-only on product files. Nothing under `loop/r0/`, `loop/pass1/` or `loop/pass2/` was written.
Every number below was taken HERE, on a scratch tree, never in a worktree and never on main.
Zero servers started, so the 4230-4249 band is untouched by this lane. Zero crops.

---

## 0 · The replay, and the base that moved

The chair's §8 ruling: pass 3 cuts from `74a2b5d9`, and MOT-VERB's pass-2 delta is
`git diff a8fee1f5` out of `.claude/worktrees/wf_8630d340-e56-64` (the whole delta, W8 C06
included, since C06 is committed there as `ec47a373`). Route taken, and the result:

```
git archive 74a2b5d9 | tar -x -C <scratch>/head74
git -C <pass-2 worktree> diff a8fee1f5 > mot-verb-p2-full.diff      # 1,043 lines, 26 files
cd <scratch>/head74 && git apply --check mot-verb-p2-full.diff      # EXIT=0
```

**The pass-2 diff applies to `74a2b5d9` clean, with no conflict and no hunk re-cut.** The W7
execution fold touched `GameBoard.vue` (5 hunks, lines 53/469/486/1051/1221) and
`GameControlPanel.vue` (3 hunks, 947/977/1294); MOT-VERB's hunks in those files are at 1264 and in
the `<style>` block from 1817 down, so the two diffs never meet. The three untracked files
(`scripts/check-pencil-verbs.mjs`, `scripts/publish-verbs.mjs`,
`src/pencil/config/pencilVerbs.test.ts`) copy in beside it.

C06 is **not** in main at `74a2b5d9` (`grep -rn FLIP_GLIDE_ANIM_ID web/frontend/src/` exits 1), so
it stays this lane's declared control definition and W8's pick, never a §13 fold.

On that merged tree, bare:

| gate | reading |
| --- | --- |
| `node scripts/check-pencil-verbs.mjs` | **GREEN**, exit 0 — 0 unadmitted, 36 admissions / 0 stale, 4 ordinal collisions, movers 2/2, beat table 8/8, publisher 13/13 byte-for-byte |
| the same with `--self-test` | **GREEN**, exit 0 — all 8 controls RED as they must be |
| `check-motion-contract.mjs --self-test` | OK, 34 specs |
| `check-copy-register.mjs --self-test` (the FOLD's new 937-line grammar) | OK, 0 dashes, 0 unadmitted jargon |
| `check-theme-tokens.mjs --self-test` | OK, 0 unreferenced |
| `npx knip` | **RED**, exit 1 |
| `check-lane-membership.mjs --self-test` | **RED**, exit 1 |

Readings: `readings/*.txt`. The fold's rewritten copy gate does not red on this diff, which is the
one collision the base move could have caused and does not.

---

## 1 · TWO standing CI lanes are red, not one

The critic found `lint:knip`. There is a second, and it is the same species.

### 1.1 `lint:knip` — six dead exports (the critic's row 1, reproduced and cured)

```
Unused exports (6)
TS_BEGIN TS_END BEGIN END      scripts/publish-verbs.mjs:31,32,33,35
rows  function                 scripts/publish-verbs.mjs:114
block function                 scripts/publish-verbs.mjs:123
```

`knip.json` sets `"exports": "error"` and its `project` covers `scripts/**/*.mjs` (widened at
T7-W6 for exactly this). All six are used inside their own module; only the `export` keyword is
surplus. Dropping it leaves `strip` and `readSource` exported, which
`check-pencil-verbs.mjs:54` imports.

**Cure proven here**: un-export the six → `npx knip` exit **0**, `lint:verbs` still GREEN.
`readings/knip-RED-on-74a2b5d9.txt`, `readings/knip-GREEN-after-unexport.txt`.

Do not reach for knip's `entry` list instead. The config's own header says knip does not grade
unused exports on an entry file, and that a file listed there without a named non-JS caller is a
hole. `publish-verbs.mjs` has a JS caller; it belongs in the graph, not in the entry list.

### 1.2 `lint:lanes` — the publisher is an UNCLAIMED SCRIPT (nobody named this)

```
• [1 UNCLAIMED SCRIPT] web/frontend/scripts/publish-verbs.mjs — NO CI LANE names it and it
  declares nothing. It runs nowhere, so its green means nothing and its red would never be seen.
```

GREEN on bare `74a2b5d9`, RED with this diff applied: `readings/lint-lanes-GREEN-on-bare-74a2b5d9.txt`
vs `readings/lint-lanes-RED-on-74a2b5d9.txt`. The gate's reachability is over CI step TEXT and the
npm scripts those steps reach (`check-lane-membership.mjs:214-249`); it is **not** transitive
through a script's source, so `check-pencil-verbs.mjs:592`'s `execFileSync("node", [join(HERE,
"publish-verbs.mjs"), "--check"])` buys nothing.

**Cure proven here**, one string in `package.json`:

```
"lint:verbs": "node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test"
```

→ `check-lane-membership.mjs --self-test` exit **0** (`readings/lint-lanes-GREEN-after-npm-script.txt`).

### 1.3 The third hole the same string closes: the controls never run in CI

`lint:verbs` is the ONLY `lint:*` script in `package.json` without `--self-test`. Its ten siblings
(`ink`, `catch`, `theme-selectors`, `theme-tokens`, `lanes`, `sleep`, `motion`, `copy`,
`live-regions`, `tdz`) all carry it. And `check-pencil-verbs.mjs:561-567` **exits** after the
controls, so the gate is either census-only or controls-only, never both. The estate idiom is the
other one: `check-motion-contract.mjs` prints its controls and then its census in one invocation,
and prints the census alone without the flag (measured both ways,
`readings/lint-motion-on-74a2b5d9.txt`).

So the family's eight negative controls — the whole proof that the gate can fail — have never run
in CI. Fix is two lines: let `--self-test` fall through to the census instead of `process.exit`,
and put the flag in the npm script (which §1.2 already needs).

---

## 2 · The re-cut onto MOT-LADDER's ladder, priced row by row

### 2.1 The rename is mechanical for five of six rungs

| MOT-VERB `--rung-*` | ms | MOT-LADDER `--motion-*` | ms | call sites to re-spell |
| --- | --- | --- | --- | --- |
| `touch` | 150 | `whisper` | 150 | **15** |
| `breath` | 200 | `leave` | 200 | **14** |
| `mark` | 250 | `note` | 250 | **9** |
| `sheet` | **280** | — | — | **2** — no counterpart, see §2.2 |
| `step` | 440 | `step` | 440 | **2** |
| `page` | 520 | `throw` | 520 | **3** |
| — | — | `dusk` | **350** | see §2.3 |
| — | — | `rise` | 600 (proposed) | U-10, MOT-LADDER's |

45 declarations total, enumerated by `grep -rn 'var(--rung-<name>)' src/`. Nothing in the rename
moves a number, so π is preserved by construction on 43 of 45 and the rest is §2.2.

### 2.2 `sheet` 280 is the one real hole in the one ladder

`AnswerKeyLaminate.vue:238-239` — the laminate's lay-down, 280ms on the glass curve, HEAD's own
number, ratified in the file's comment as "280ms preserved, start/end pose unchanged". MOT-LADDER's
ladder has no 280 and **MOT-LADDER's own prototype left that declaration alone** (its diff touches
only the 200 lift-away and the PRM comment: `git -C wf_8630d340-e56-60 diff -- …AnswerKeyLaminate.vue`).
So on the one ladder, a bare `280ms` sits at a travel declaration and MOT-VERB's rule 2 reds it.

Three dispositions, and the synthesizer must pick one and say so:

1. **Admit it** with a ledger row (`signature`, "the laminate's lay-down, owner-preserved at
   T4-W10"). Cheapest, honest, costs one ledger row and leaves the number visible at the site.
2. **Ask MOT-LADDER for a 280 rung.** The ladder is the leader's; a seventh name is theirs to mint
   and `rise` 600 is already queued behind the owner. Not this lane's to take.
3. **Move the laminate to `note` 250 or `dusk` 350.** Refused by construction: shortening buys
   nothing under the W8 quality law, and lengthening a ratified pose is a U-10 change with no
   audition behind it.

Recommend 1, with 2 named as the section's option in the return. Whichever lands, R6's §1.2
laminate row is MOVED NARROWLY exactly as pass 2 proposed it (`pass2/synthesize/MOT-VERB/instruments/R6-laminate-row.diff`),
re-cut for the new token name and re-banked under `pass3/<stage>/MOT-VERB/instruments/`.

### 2.3 `dusk` is a collision that resolves into a subtraction

MOT-VERB ships a VERB named `dusk` with the set's one own number (`ms: 350`), published as
`--verb-dusk-ms`. MOT-LADDER ships a RUNG named `dusk` at **350**. They are the same two lines of
paint:

```
MOT-VERB   index.css:720-721   background-color var(--verb-dusk-ms) var(--verb-dusk-ease),
                               color            var(--verb-dusk-ms) var(--verb-dusk-ease) !important
MOT-LADDER index.css:683-684   background-color var(--motion-dusk, 350ms) var(--ease-dusk),
                               color            var(--motion-dusk, 350ms) var(--ease-dusk) !important
```

So `--verb-dusk-ms` dies into the ladder's `dusk` rung, `dusk.rungs` becomes `["dusk"]`, and
**`ms` leaves the verb tuple entirely**. Two rows change meaning and must be restated, not
quietly dropped:

- `publish-verbs.mjs:191` — "exactly one verb may own a number" becomes **no verb owns a number;
  every length is a rung**. As written the check reds the moment the fold lands (`ownMs.length !== 1`).
- `check-pencil-verbs.mjs:390-395` — the `var(--verb-*-ms)` loop with its `!== "dusk"` exception
  deletes whole. Its job passes to rule 2.

The curve does **not** fold the same way. MOT-LADDER spells it `--ease-dusk`; under MOT-VERB's
rule 1′ an `--ease-*` on a transition is a RED ("a shape curve; a transition names a verb"), and
§2.1 kept rule 1′ with this family. So `--verb-dusk-ease` lives and `--ease-dusk` never mints.
That is the one place where the re-cut runs the other way, and the return should say so plainly.

MOT-LADDER also spends `--motion-dusk` on two icon animations (`FillForcedIcon.vue:72`,
`SolveIcon.vue:55`) that this ledger currently admits as `shape` at 350ms. On the one ladder those
two rows can leave the ledger (36 → 34) by spending the rung — if they can name a verb, which
§2.4 makes them do.

### 2.4 Deleting the `isShape` escape costs exactly ONE row

The measurement the critic's row 3 needs. Patch `const isShape = …` to `false` and run the census
bare (`readings/lint-verbs-isShape-deleted.txt`):

```
declarations that name neither a verb nor a rung: 1   (budget 0)
  by rule — curve 1 · rung 0 · fence 0 · set 0 · props 0 · direction 0
  · src/games/shared/DigitCell.vue:442    no verb names its curve
        animation: refuse-shake var(--refuse-dur) linear
```

**One row**, not twelve: the ledger's twelve `shape` admissions already carry the T6 incumbents,
and admission suppresses the red whatever rule raised it. The refusal shake wants a ledger row of
its own (`shape`, "a refusal shake is a figure; `linear` is its own per-step timing and
`--refuse-dur` is the component's number") or a verb. Either way the carve-out dies for the price
of one line, and the critic's planted `.probe-escape { animation: note-in var(--rung-mark) linear
backwards }` reds on rule 1′ the moment it does.

### 2.5 The ledger launders, and nobody has said so

A by-product of §2.4's instrumentation, and a real second bite of the same disease the `isShape`
row names. An admission is keyed on the declaration text alone
(`ADMITTED: Map<"${file} :: ${body} #${n}", [kind, ruling]>`), and `check-pencil-verbs.mjs:398`
skips the row entirely, so **one ruling excuses every offence that row will ever raise**.
`readings/admitted-why.txt` prints all 36 with the rules each actually trips today:

```
GameControlPanel.vue:2300 | [layout]    | --ease-drawOn is a shape curve, a transition names a verb; a number is typed here instead of a rung (200ms)
index.css:731             | [shape]     | no verb names its curve; a number is typed here instead of a rung (0.6s)
DarkModeToggle.vue:901    | [signature] | --ease-anticipatePop is a shape curve …; 150ms; 120ms
```

Twenty-one of the 36 rows carry two or more offences under one ruling. The cure is one field:
`[kind, ruling, rules]` where `rules` is the tag set the ruling covers, and an offence tagged
outside it still reds. The tags are already computed at that line, and the 36 rows' true sets are
in the reading — so the migration is a table edit, not a design.

### 2.6 The three aliases die cleanly (charter row 12)

| alias | consumers, measured | its death |
| --- | --- | --- |
| `cardStepMs` | `GameGallery.vue:930` only, and that is the ORPHAN binding of charter row 6 | delete the binding and the alias together |
| `boardFoldMs` | `GameGallery.vue:371` (`Math.round(MOTION.boardFoldMs * 0.42)`) | → `MOTION.rungs.throw` |
| `chromeLeaveMs` | `App.vue:643` (a `setTimeout`) | → `MOTION.rungs.leave` |

`--card-step-ms` really is a writer with no reader: `GameGallery.vue:930` binds it, and the only
thing left in the tree that names it is the gate's own `NAMED_DUR`/`TIME` allowlists
(`check-pencil-verbs.mjs:159,162`). Delete the binding, the alias AND the two regex entries in one
hunk, or the gate keeps a door open for a token that no longer exists.

**R6 law 4** ("no timing constant outside `pencilConfig` — `cardStepMs 440`, `boardFoldMs 520`,
`chromeLeaveMs 200`, the CELEBRATION budget") names all three by their dying spellings. Report it
MOVED, not broken: the law's subject is where a number LIVES, and all three still live in
`pencilConfig` — as rungs. Say that in one sentence and propose the re-wording as a diff under
`instruments/`; do not re-cut `r0/`. MOT-LADDER's critic already found their law-4 hunk misdrafted,
so the two lanes must not file two different re-wordings of the same row.

---

## 3 · The gate's four open rules, each with its measured shape

### 3.1 Rule 3 at the call site — PROVEN, both halves

Narrow the door:

```ts
export const spend = <V extends WaapiVerb>(verb: V, rung: (typeof MOTION.verbs)[V]["rungs"][number]) =>
```

`npx vue-tsc -b --force` exit **0** on the merged tree (`readings/vue-tsc-narrowed-spend.txt`).
Plant the critic's exact sabotage and it reds with a sentence a reader can act on
(`readings/vue-tsc-planted-turn-touch.txt`):

```
src/pencil/chrome/GameGallery/useCarouselGlide.ts(29,29): error TS2345:
  Argument of type '"touch"' is not assignable to parameter of type '"page"'.
```

The gate half still has to be taught, because `vue-tsc` is a different lane and rule 7 is what the
§13 gate says it enforces. Three `spend(` sites exist and **one of them is in a `.vue` file**:

```
src/App.vue:380                                  const FOLD  = spend("turn", "page");
src/games/shared/useControlsDrawer.ts:96         const GLIDE = spend("turn", "page");
src/pencil/chrome/GameGallery/useCarouselGlide.ts:29  const GLIDE = spend("slide", "step");
```

Rule 7 walks `.ts` only (`walk(src, /\.ts$/)` at `:410`), so a widened rule that reads
`spend("verb","rung")` arguments must widen the walk to `.vue` script blocks too or `App.vue:380`
stays invisible. That is the born-RED the row is owed: plant the illegal spend in `App.vue` and
watch the gate name it.

### 3.2 Gate 8's other direction — the critic's wording is vacuous; here is one that is not

"Every transition declaration inside a `.is-turning` rule" enumerates **zero** rules. The gesture's
declarations do not live under `.is-turning`; they live on `.toggle-icon`, `.toggle-icon.is-active`,
`.toggle-icon .warp` and the star selectors, and `.is-turning` only arms the stage. Measured, the
file's `<style>` carries 11 `transition`/`transition-delay` declarations:

```
717  transition: transform var(--rung-breath) var(--verb-layDown-ease);      the toggle's HOVER — not a beat
793  opacity 100ms  var(--ease-standard) 240ms      !important   → beat out
799  opacity 300ms  var(--ease-standard)  60ms      !important   → beat rise
814  transform 340ms var(--ease-accelIn)            !important   → beat wring
829  transform 800ms var(--ease-springPop) 60ms     !important   → beat bloom
892  scale 150ms ease-in, opacity 100ms ease-in     !important   → beat tuck
901  scale 150ms var(--ease-anticipatePop) 560ms, opacity 120ms ease-out 560ms !important → beat star1
907  transition-delay: 640ms                        !important   → beat star2
910  transition-delay: 720ms                        !important   → beat star3
984  transition: none                               !important   inside @media (reduce)
995  transition: opacity 200ms ease                              inside @media (reduce) — the admitted fallback
```

So the predicate that is both satisfiable today and RED on a deletion is:

> every `transition` or `transition-delay` declaration in `DarkModeToggle.vue`'s `<style>` that
> carries `!important` and is outside the reduced-motion block must be named by a beat in
> `@toggle-beats`.

**8 declarations, 8 beats, a bijection today.** Delete `star3` from the table and `:910` is
unnamed, which is the critic's sabotage caught by the fixture it belongs to rather than by the
ledger's stale count. One nuance the synthesizer must decide out loud: the 8 declarations carry
**10** property terms, and the table names 8. `tuck`'s `opacity 100ms ease-in` and `star1`'s
`opacity 120ms ease-out 560ms` are unnamed. Per-declaration completeness is green now;
per-term completeness is born RED at 2 and needs two more beats. Per-declaration is the honest
match for a table whose keys are named gestures, and the return should say the two terms ride
their declaration's beat.

### 3.3 RUB OUT's writer (charter row 5)

`.is-rubbing-out` still occurs exactly twice: the rule at `MarginNote.vue:160-163` and the
§MOTION comment at `index.css:1023`. Nothing writes the class. Registry §2.2 settles the rung
(`whisper` 150, breath-vs-touch moot — say so and retire U-10 exhibit 6 as moot), but not the
writer. §7's leader owns note lifetime and `NOTE-ERASE`'s `ink-rub-out` is the consumer today,
so the two live options are: hand the verb to §7 in the same diff as its CSS, or name the act
here. If it stays here, take NOTE-ERASE's critic finding with it — a Vue `<Transition>` leave
class is specificity (0,1,0) and `[data-note-age="settled"]` at (0,2,0) outranks it, which is how
their settled note's exit snaps back for 24/13 frames. Any leave this family's verbs touch gets
the same audit on the same node.

### 3.4 The dock: SLIDE is the true sentence, TURN is the true fold

`useControlsDrawer.ts:96` spends `spend("turn","page")` for **all three poses** through one
`glideCtl`; there is no per-pose branch, and `useFlipGlide` moves rail, case, masthead and tab by
`flipTransform` — a translate and a scale, nothing turns over. The genuine TURN in the product is
`App.vue:380`'s board⇄card FOLD. So:

- make the drawer **SLIDE** at the page/`throw` rung (`slide.rungs` already contains it), and
- keep TURN fenced to the fold, where a page really does go over.

The comment at `:89-95` then reads true as written for the dock half and needs one word changed
for the desk half, the SURFACES line agrees, and R6 rulings 1 and 2 are untouched (same 520, same
glass curve, the drawer's own scope). The alternative — branching the spend on `portraitDock` —
adds a runtime fork to a seam the file calls "a single tuple" and buys a distinction no gate can
see. Cheaper and truer to change the verb.

One thing to take with it: `useFlipGlide.ts:124` carries `options.easing ?? MOTION.curves.drawerGlide`
and `:176-177` retypes `composite: "replace"` and `fill: "none"` — the two arms `spend()` already
owns. A caller can omit the verb and still glide. The clean form takes the whole tuple
(`useFlipGlide({ spend: spend("slide","throw") })`), which kills a masked fallback and makes
`spend()` the one door the centre claims it is.

---

## 4 · The constraints this family collides with

### 4.1 Chair §6.5 strikes the ladder's fallbacks, and MOT-VERB is already compliant

§6.5 names the motion rungs explicitly: registered with `@property` carrying an `initial-value`,
published synchronously before first paint, consumers writing `var(--x)` with **no fallback**.

- MOT-VERB's 45 call sites are already bare `var(--rung-*)`. Compliant.
- MOT-LADDER's pass-2 grammar is `var(--motion-<rung>, <ms>)`, and its own charter calls the
  byte-equal fallbacks a graft to take. Struck by §6.5.
- **There is no `@property` anywhere in `src/`** today (`grep -rn "@property" src/` → nothing).
  §10's leader lands the registration once; this lane consumes and cites.

The mechanism matters here more than the letter. The rungs are **constants read out of a TS
object**, not measured tokens: nothing has to be laid out before their value is known. That has a
consequence for §2.1's "one publisher" that this lane should carry as an objection, not a diff:

- MOT-VERB publishes the ladder into `index.css`'s `@theme` at build time
  (`publish-verbs.mjs --write`), byte-diffed in CI by `--check`. Static CSS is in the first
  stylesheet, so there is no frame where a bare `var(--motion-note)` is invalid.
- MOT-LADDER publishes at runtime, one `<style data-motion-rungs>` node injected from `main.ts`.
  With fallbacks struck, the window between first paint and that node landing is a window in which
  every rung-spending declaration is invalid. `@property` with a real `initial-value` closes it,
  which means the initial-value is carrying the ladder and the runtime node is re-stating it.

So: take the ladder's NAMES (§2.1 is the chair's and this lane obeys it), ship the call sites bare,
and say in the return that the ladder's constants want a build-time publisher plus `@property`
rather than a runtime node, with the first-paint window as the reason. That is an objection in a
return, exactly as the chair's preamble directs.

Second-order, and worth one line to the leader: moving the rungs out of `@theme` takes them out of
`check-theme-tokens`'s corpus (GREEN today with all 13 published rows referenced,
`readings/lint-theme-tokens-on-74a2b5d9.txt`). A token nobody can see unreferenced is a token that
can rot.

### 4.2 The rest, measured or cited

- **M16** — `lint:copy` 0 dashes, 0 unadmitted jargon on this merged tree, under the FOLD's new
  937-line discovery grammar. Keep; do not add rendered copy.
- **filterBudget 9** — `filterBudget.ts` is absent from this diff. The estate's enforcing census is
  `e2e/filter-census.spec.ts`, and the config that bundles a preview for it is
  `playwright-throttle.config.ts` (projects `filter-census-chromium` / `filter-census-webkit`,
  `retries: 0`). It honours `PLAYWRIGHT_BASE_URL` (`externalBase`, `:78-81`), so the lane serves
  its own built dist on its own port and sets that variable — no `:3000`, no estate default, no
  scratch config needed for this one. Three probes have given 3, 9 and 11 by three definitions;
  only this spec's count answers R6 law 9.
- **The goldens** — `playwright-golden.config.ts`, `visual-golden.spec.ts`, **4 tests**, 1280×800,
  and it honours `PLAYWRIGHT_BASE_URL` the same way (its webServer default is `npm run dev` on
  3000, so the variable is mandatory). Goldens run against a BUILT dist, darwin soul 0.017 —
  never re-baseline, and no re-mint inside the loop (chair §6.4).
- **r1 / r3** — the instruments are `r0/r1-controls/probe/heading-voice.spec.ts` and
  `r0/r3-marks/probe/wobble.probe.ts`, each with its own `probe/pw.config.ts`. Copy them into
  `instruments/`, re-point their OUT paths into this lane's dir BEFORE running, and report the r0
  row MOVED only if this design moved the subject.
- **AA, π** — the diff is durations, curve names and comments. π by CSS set-diff plus a rect census
  against a HEAD control **named as `74a2b5d9`**; a row that names `a8fee1f5` is a pass-2 reading
  and says so.
- **The dist identity** (charter row 8) — do not hand-bank md5s again. `scripts/dist-identity.mjs`
  is the estate's own tool and already a CI lane (`--self-test` and `--dist dist`). Build twice in
  the worktree, run it, bank its output. That is a number a reader can re-derive.
- **`gameCell.css`** byte-clean (chair §6.11); its four `elsewhere` admissions stay §6's.

---

## 5 · Sketches

**A · the layers after the re-cut.** One name per length, one name per curve, and the only
generated text is the block the publisher writes.

```
pencilConfig.ts   /* @verbs-begin */ RUNGS {whisper leave note dusk step throw}  ← MOT-LADDER's names
                  verbs {layDown lift turn slide writeIn rubOut dusk}   ← MOT-VERB's, no `ms` left
                  spend<V>(verb: V, rung: verbs[V].rungs[number])       ← the ONE door, fenced
                        │
       publish-verbs.mjs --write │ --check (byte diff, marker pair, brace matched)
                        ▼
index.css @theme  --motion-whisper…--motion-throw        (the ladder, from the leader)
                  --verb-layDown-ease …--verb-dusk-ease  (the curves, this family's)
                  @media (reduce) → every rung 0ms       (PRM as a VALUE of the ladder)
                        │
   call site     transition: opacity var(--motion-leave) var(--verb-lift-ease);
                             └ no fallback (chair §6.5) └ a verb, never an --ease-* (rule 1′)
   mover         useFlipGlide({ spend: spend("slide","throw") })   ← the tuple whole, no ?? default
```

**B · gate 8, closed both ways.** Today only the left arrow exists.

```
   @toggle-beats {                            DarkModeToggle.vue <style>
     "out":   {…} ──── reads back ──────────▶ .toggle-icon        opacity 100ms … 240ms !important
     "rise":  {…} ──────────────────────────▶ .toggle-icon.is-active
     "wring": {…} ──────────────────────────▶ .toggle-icon .warp
     "bloom": {…} ──────────────────────────▶ .toggle-icon.is-active .warp
     "tuck":  {…} ──────────────────────────▶ .toggle-icon .twinkle-star
     "star1": {…} ──────────────────────────▶ .toggle-icon.is-active .twinkle-star
     "star2": {…} ──────────────────────────▶ …-2   transition-delay 640ms
     "star3": {…} ──────────────────────────▶ …-3   transition-delay 720ms
   }            ◀──── NEW: every !important transition outside @media(reduce) is named here
                      8 declarations · 8 beats · delete one row and :910 reds
```

**C · the two lanes that were red, and the one string that closes two of the three holes.**

```
  npm run lint:verbs                     ci.yml lint job
        │                                      │
        ├─ node publish-verbs.mjs --check ◀────┴─ lane NAMES the file   (cures lint:lanes)
        └─ node check-pencil-verbs.mjs --self-test
                 │
                 ├─ 8 negative controls   ← today these never run in CI
                 └─ the census            ← today --self-test exits before it
  scripts/publish-verbs.mjs: 6 exports → 0   (cures lint:knip)
```

---

## 6 · Risks

1. **The 280 is the only place the re-cut can break paint.** Any disposition but "admit the
   literal" moves a ratified pose. Rank it first in the spec and never let it become a silent
   rounding to `note` or `dusk`.
2. **`--verb-dusk-ms`'s death reds the publisher's own check** (`ownMs.length !== 1`) the moment
   the fold lands. The restatement has to ship in the SAME diff as the rename, or the lane looks
   green in isolation and reds at the fold.
3. **Two publishers, one ladder.** If MOT-LADDER's runtime node and this family's `@theme` block
   both land, two nodes publish `--motion-*` and the leader's "exactly one `<style
   data-motion-rungs>`" row reds on a tree with both diffs applied. The objection in §4.1 has to be
   stated in the return and the lane has to build for whichever the chair rules — do not ship both.
4. **`@property` does not exist in the estate yet**, and §6.5 hands the registration to §10's
   leader. If that lands late, a bare `var(--motion-*)` at 45 sites has no publisher and no
   fallback. Keep the build-time block as the interim publisher so the sites are never invalid, and
   cite §6.5 rather than re-implementing it here.
5. **The ledger's laundering (§2.5) is a second bite of the `isShape` disease.** Cure it in the
   same pass or a critic will land the identical row again with a different plant, and the working
   directives' class-invariant rule bites at the second occurrence, which this is.
6. **Rule 7's `.ts`-only walk.** Narrowing the type fences three call sites; teaching the gate
   without widening to `.vue` leaves `App.vue:380` outside the law the gate claims to enforce.
7. **Per-term vs per-declaration beat completeness.** Choose in the spec, not in the diff. A
   per-term rule is born RED at 2 on a surface the owner audited most, which is a U-10 conversation
   nobody has asked for.
8. **The instruments are the pass's long pole, not the re-cut.** Goldens 4/4, the estate's filter
   census in two engines off a built dist, r1, r3, two clean builds for the dist identity. All of
   it is background-and-poll work under the stall law, and none of it is started by writing CSS.

---

## 7 · What is banked here

```
readings/lint-verbs-on-74a2b5d9.txt            the census GREEN on the merged tree
readings/lint-verbs-isShape-deleted.txt        the carve-out's true cost: 1 row
readings/admitted-why.txt                      all 36 admissions with the rules each trips
readings/knip-RED-on-74a2b5d9.txt              the CI red, reproduced
readings/knip-GREEN-after-unexport.txt         the cure, proven
readings/lint-lanes-RED-on-74a2b5d9.txt        the SECOND CI red, found here
readings/lint-lanes-GREEN-on-bare-74a2b5d9.txt the control: green without this diff
readings/lint-lanes-GREEN-after-npm-script.txt the cure, proven
readings/vue-tsc-narrowed-spend.txt            the narrowed door compiles
readings/vue-tsc-planted-turn-touch.txt        TS2345 on the critic's exact sabotage
readings/lint-copy-on-74a2b5d9.txt             M16 under the fold's new grammar
readings/lint-motion-on-74a2b5d9.txt           34 specs, and the --self-test idiom
readings/lint-theme-tokens-on-74a2b5d9.txt     0 unreferenced @theme tokens
```

No crops. No servers started. Nothing written outside this directory.
