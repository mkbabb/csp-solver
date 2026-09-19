# MOT-VERB — pass 3 SYNTHESIS · the verbs, re-cut onto the one ladder and made unable to launder

T9-W7 §13 the transition grammar · M02 / M09 (design half). Base: `74a2b5d9`. Input:
`../research/MOT-VERB/README.md` (pass 3, 14 findings, 14 readings on a merged scratch tree),
the pass-2 spec/prototype/critique, `pass2/registry-v2.md` §2.1 §2.2, `../CHAIR-RULINGS.md`
§6.5 §7 §8, `pass2/charters/MOT-VERB.md` (twelve rows). Read-only on product files; nothing
closes (U-10). Method: the frontend-design two passes (plan, review against the tells, then
specify); §0 is the plan and the review, §1 onward is the spec. This is the sibling of
`MOT-LADDER.md`; the two are written to agree on every shared line, and the route stays separate
until the agglomerator folds it.

The centre is unchanged: **motion is a small set of VERBS, each a curve bound to a property set
and enforced at the declaration; a delay keeps its number and only travel takes a rung;
`spend(verb, rung)` is the one WAAPI door.** Pass 3 re-homes the family's lengths onto
MOT-LADDER's names (§2.1), takes the two decisions the re-cut cannot avoid (`sheet` 280, `dusk`),
and closes the four holes a critic proved the gate has.

---

## 0 · The plan, and the review against the tells

**Subject.** A pencil-and-paper puzzle. Motion is what a hand does on paper; a transition that is
not one of those acts is undefined, which is M09's word. Frame `marks/m03` is the risen sheet:
it SLIDES up the rail (a translate and a scale), and nothing turns over — the verb the dock
spends today is the wrong word.

**Tokens (the plan).**

| axis | the set | home |
| --- | --- | --- |
| rungs | **MOT-LADDER's**: whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520 (+ rise 600, U-10). `--rung-*` dies | `MOTION.rungs`, MOT-LADDER's publisher |
| verbs | LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT · DUSK — seven, **no verb owns a number any more** | `MOTION.verbs` → `--verb-<name>-ease` in `@theme` |
| fill | a value (`"none" \| "backwards"`) + `mechanism`, read by `spend()` | the verb tuple |
| PRM | MOT-LADDER's reduce arm; this family publishes no rung | — |
| colour · copy | none rendered. Gate messages in M16's register | — |

**Voice.** The one memorable thing is still the fence: **a delay keeps its number; only travel
takes a rung.** `transition: opacity var(--motion-leave) var(--verb-lift-ease) 240ms` — how far,
which hand, when. What pass 3 adds is quieter and harder: the gate now reads the SECOND argument
of `spend()`, the ledger names which rules a ruling covers, the toggle's beat table is read in both
directions, and the dock finally says SLIDE.

**Layout (the grammar after the re-cut).**

```
pencilConfig.ts   MOTION.rungs {whisper leave note dusk step throw [rise]}      ← the leader's
                  /* @verbs-begin */ MOTION.verbs { layDown lift turn slide writeIn rubOut dusk }  /* @verbs-end */
                  spend<V extends WaapiVerb>(verb: V, rung: (typeof MOTION.verbs)[V]["rungs"][number])
                        │  publish-verbs.mjs --write | --check   (curves only; the rung half dies)
                        ▼
index.css @theme  --verb-layDown-ease … --verb-dusk-ease          (R6 law 3's CSS layer, byte-checked)
call site         transition: opacity var(--motion-leave) var(--verb-lift-ease);
                              └ no fallback (chair §6.5)     └ a verb, never an --ease-* (rule 1′)
mover             useFlipGlide({ spend: spend("slide", "throw") })   ← the tuple whole; no `?? drawerGlide`
gate              check-pencil-verbs.mjs  rules 1′ 2 2′ 5 5b 6 7(.ts + .vue) 8(both ways) · ledger [kind, ruling, rules]
```

**Principles.** (1) Name what ships, retune nothing. (2) A delay is a wait, not a gesture. (3) A
verb is enforced by what its consumer moves, or it is a comment. (4) A character gesture is
admitted whole, never half-assigned. (5) A ruling excuses the offences it names and no others.
(6) Every changed pixel is declared with its number.

**Review against the tells.** The generic version is a Material scale plus a spell-checker. Four
things in my first plan were that default and were revised:

1. I had `sheet` 280 folded to `note` 250 "to keep the ladder pure". That shortens a ratified
   pose (`AnswerKeyLaminate.vue:238-239`, "280ms preserved", T4-W10) and the W8 quality law
   forbids buying anything with a shorter clock. **Revised: the 280 is ADMITTED as `signature`,
   visible at its site, R6 §1.2's row MOVED narrowly for the token name only.** A seventh rung is
   the leader's option, named in §8, not this lane's to mint.
2. I had the dock branching on `portraitDock` so the desk could keep TURN. That is a runtime fork
   in a seam the file calls "a single tuple", and the desk does not turn either: `useFlipGlide`
   moves four boxes by translate and scale. **Revised: the drawer SLIDES at `throw` on every pose;
   TURN is fenced to the fold, the one place a page goes over.** R6 rulings 1 and 2 are untouched
   (same 520, same glass curve, the drawer's scope).
3. I had gate 8's other direction as the critic worded it ("every transition inside a
   `.is-turning` rule") — it enumerates zero rules. **Revised: the predicate is every
   `!important` transition/delay in `DarkModeToggle.vue`'s `<style>` outside the reduce block
   (8 ↔ 8 today), per declaration.** Per-term completeness would be born RED at 2 on the surface
   the owner audited most, a U-10 conversation nobody opened; the two unnamed terms ride their
   declaration's beat and the spec says so.
4. I had the ledger keeping `[kind, ruling]` and the `isShape` carve-out "for the T6 incumbents".
   Both are the same disease measured twice: one ruling excusing every offence a row will ever
   raise. **Revised: `isShape` dies (cost: one row, `DigitCell.vue:442`), and every admission
   carries the RULES it covers.**

Kept, and it looks like a default: four names for the glass curve. It is grammar because rule 5
makes them mean different things, and the declared-duplicate row names the pairs so a fifth
cannot appear unannounced.

---

## 1 · The tokens

### 1.1 The rename, mechanical for five rungs

| was `--rung-*` | ms | now `--motion-*` | sites |
| --- | --- | --- | --- |
| touch | 150 | whisper | 15 |
| breath | 200 | leave | 14 |
| mark | 250 | note | 9 |
| sheet | 280 | — (§1.2) | 2 |
| step | 440 | step | 2 |
| page | 520 | throw | 3 |

45 declarations (`grep -rn 'var(--rung-<name>)' src/`); 43 move a name and no number, so π is
preserved by construction on those; every site ships BARE (chair §6.5; this family's sites already
were). The verbs' `rungs` arrays re-spell in the same hunk.

### 1.2 `sheet` 280: admitted, visible, never rounded

`AnswerKeyLaminate.vue:238-239` `.answer-key-laminate.is-shown { transition: opacity 280ms
var(--verb-layDown-ease), transform 280ms var(--verb-layDown-ease) }` — a literal at a travel
declaration, rule 2 reds it, and MOT-LADDER's ladder has no 280 (its own prototype left the line
alone). **Disposition: ADMIT** with one ledger row: `AnswerKeyLaminate.vue :: .answer-key-laminate.is-shown
:: 280ms` · kind `signature` · ruling "the laminate's lay-down, owner-preserved at T4-W10; R6
§1.2's erase asymmetry (280 down, 200 up)" · rules `[rung]`. The 200 lift-away reads `leave`.
R6 §1.2's laminate row is MOVED narrowly (token name `--ease-glassGlide` → `--verb-layDown-ease`;
both numbers hold; the asymmetry survives) as `instruments/R6-laminate-row.diff`, re-cut from the
pass-2 proposal for the new name. Option 2 (a seventh rung, `sheet` 280) is the leader's and is
named in §8; option 3 (250 or 350) is refused: shortening buys nothing under the quality law, and
lengthening a ratified pose is U-10 with no audition.

### 1.3 `dusk`: a collision that resolves into a subtraction

MOT-VERB's verb `dusk` owned the set's one number (`ms: 350`, `--verb-dusk-ms`); MOT-LADDER's
rung `dusk` is 350; they are the same two lines of paint (`index.css:720-721` vs `:683-684`).
**`ms` leaves the verb tuple entirely.** Two rows change meaning and are restated in the same
diff as the rename, or the lane greens alone and reds at the fold:

- `publish-verbs.mjs:191` "exactly one verb may own a number" → **"no verb owns a number; every
  length is a rung"** (reds on any `ms` key in a verb).
- `check-pencil-verbs.mjs:390-395` (the `var(--verb-*-ms)` loop with its `!== "dusk"` exception)
  deletes whole; its job is rule 2's.

The CURVE runs the other way: rule 1′ reds an `--ease-*` on a transition, so `--verb-dusk-ease`
lives and **`--ease-dusk` never mints** (MOT-LADDER's spec agrees, §0 of that file). Its points
are `ease`'s own, `cubic-bezier(0.25, 0.1, 0.25, 1)`; the scrub sampler (MOT-LADDER's research
§6, handed here) proves the paint byte-identical: 11/11 samples both engines.

`FillForcedIcon.vue:72` and `SolveIcon.vue:55` (350 ms icon rows, admitted `shape` today) spend
`var(--motion-dusk)` and name their verb by what they move (rule 5 decides: a colour/stroke swap
is LAY DOWN); two `shape` rows leave the ledger.

### 1.4 The verbs, with no number and with fill as a value

| verb | ease | props | fill | mechanism | rungs |
| --- | --- | --- | --- | --- | --- |
| layDown | `(0.32, 0.72, 0, 1)` | opacity, transform, background-color, color, box-shadow, stroke, filter | none | transition, keyframe | throw · note · leave · whisper · **dusk** (the two icons) |
| lift | `(0.32, 0, 0.67, 0)` | opacity, transform, scale | none | transition, keyframe | leave · note · whisper |
| turn | `(0.32, 0.72, 0, 1)` | transform | none | waapi | throw |
| slide | `(0.32, 0.72, 0, 1)` | transform, opacity | none | waapi, transition | throw · **rise** (U-10; present only if the leader's rung ships) · step · whisper |
| writeIn | `(0.22, 1, 0.36, 1)` | clip-path, stroke-dashoffset, opacity | backwards | keyframe | note · leave · whisper |
| rubOut | `(0.32, 0, 0.67, 0)` | clip-path, opacity | backwards | keyframe | **whisper** (registry §2.2; breath-vs-touch is MOOT) |
| dusk | `(0.25, 0.1, 0.25, 1)` | background-color, color | none | transition | dusk |

`spend` narrows to the verb's own rungs (proven: `vue-tsc -b --force` exit 0; the critic's
`spend("turn","touch")` → `TS2345 '"touch"' is not assignable to '"page"'`):

```ts
export const spend = <V extends WaapiVerb>(verb: V, rung: (typeof MOTION.verbs)[V]["rungs"][number]) => ({
  duration: MOTION.rungs[rung], easing: MOTION.verbs[verb].ease,
  fill: MOTION.verbs[verb].fill, composite: "replace" as const,
});
```

V5 is restated as the data it can be: `MOTION.verbs.rubOut.fill === "backwards"` and
`spend("writeIn", …)` a type error (`WaapiVerb` derived from `mechanism`). `FILL_ALLOWLIST`
untouched: no verb fills `forwards`.

### 1.5 The published block: curves only, byte-checked

`publish-verbs.mjs --write` renders the seven `--verb-*-ease` rows into `index.css`'s `@theme`
between the marker pair; `--check` byte-diffs in CI. The rung half of the publisher DIES (§2.1:
rungs are the leader's node). R6 law 3's two-layer partition is exactly this: TS `MOTION.verbs`
for `spend()`, CSS `--verb-*-ease` for `<style>` consumers, byte-identical, and now a gate holds
them so. The declared-duplicate row stays: `--ease-glassGlide` ≡ `--verb-layDown-ease` ≡
`--verb-slide-ease` (+ `turn`, unpublished); `--verb-lift-ease` ≡ `--verb-rubOut-ease`;
`--ease-noteWrite` ≡ `--verb-writeIn-ease`; any fourth pair RED.

---

## 2 · The gate, its four holes closed

| hole (critic) | cure | proof |
| --- | --- | --- |
| `spend("turn","touch")` GREEN | the type above; rule 7 reads `spend(` arguments AND widens its walk from `/\.ts$/` to `.vue` `<script>` blocks — `App.vue:380` is one of the three sites | plant the illegal spend in `App.vue` → the gate names the line |
| `isShape` exempts every bound `animation:` from 1′/5/5b | `const isShape = …` deleted | census bare on the merged tree: exactly 1 new red, `DigitCell.vue:442` `refuse-shake var(--refuse-dur) linear` → one `shape` row ("a refusal shake is a figure; `linear` is its per-step timing; `--refuse-dur` is the character's binding, MOT-LADDER §1.5") |
| the ledger launders (21 of 36 rows trip ≥2 rules under one ruling) | `ADMITTED: Map<key, [kind, ruling, rules]>`; an offence tagged outside `rules` still reds; the 36 rows' true sets are in `readings/admitted-why.txt`, a table edit | plant a second offence on an admitted row (`GameControlPanel.vue:2300` `layout` + a typed 200 ms it does not cover) → RED |
| gate 8 one-directional | **every `transition`/`transition-delay` in `DarkModeToggle.vue`'s `<style>` carrying `!important` outside `@media (reduce)` must be named by a beat in `@toggle-beats`** — 8 declarations ↔ 8 beats, a bijection today | delete `star3` → `:910` unnamed → RED; move 720 → 900 → the fixture reds, not only the ledger |

Per-declaration completeness is chosen out loud: the 8 declarations carry 10 property terms;
`tuck`'s `opacity 100ms ease-in` and `star1`'s `opacity 120ms ease-out 560ms` ride their
declaration's beat. Per-term is banked as the question it is (U-10, §8), not shipped RED.

The self-test FALLS THROUGH to the census (`check-pencil-verbs.mjs:561-567` exits today, so the
eight controls have never run in CI — the estate idiom is `check-motion-contract.mjs`'s), and one
npm string closes two lanes and this: `"lint:verbs": "node scripts/publish-verbs.mjs --check &&
node scripts/check-pencil-verbs.mjs --self-test"` (`check-lane-membership --self-test` 1 → 0,
proven). `knip` 1 → 0 by un-exporting `TS_BEGIN`/`TS_END`/`BEGIN`/`END`/`rows`/`block` (proven;
`strip` and `readSource` stay exported, `check-pencil-verbs.mjs:54` imports exactly those).

---

## 3 · The surfaces, one memorable thing each, desktop and mobile, light and dark

Motion is theme-blind; no colour moves; every row is identical on `--color-card` and
`--color-background`, light and dark.

- **The drawer, desk and dock: SLIDE at `throw`.** `useControlsDrawer.ts:96` spends
  `spend("slide", "throw")` for all three poses through one `glideCtl`; `useFlipGlide` takes the
  tuple whole (`useFlipGlide({ spend })`), so `:124`'s `options.easing ?? MOTION.curves.drawerGlide`
  and `:176-177`'s retyped `composite`/`fill` die — a caller can no longer omit the verb and still
  glide. The comment at `:89-95` and the spec's SURFACES line finally agree. The dock's rung is
  the leader's ballot (`rise` 600 / `throw` 520); this family spends whichever ships, on one
  engine, never a re-eased curve (R6 #2).
- **The fold: TURN at `throw`.** `App.vue:380` is the product's one genuine TURN, a page going
  over. On C06's build it plays; the exit's phone-side cut is MOT-LADDER's G-EXIT-MIRROR (a real
  defect, App.vue's, U-10).
- **The gallery's twins.** Chrome and deck leave on one curve: LIFT at `leave`. The deck's leave
  glass → lift (Δ 0.852) is the one visible change on the gallery, U-10 exhibit 1.
- **The dusk.** Its own verb, the ladder's 350, `ease`'s own points under a name: paint
  byte-identical, proven by the fixed-t sampler, not arithmetic. The toggle's whirl beside it is a
  character, admitted whole, every beat HEAD's, read back both ways.
- **The margin note's exit: RUB OUT at `whisper`.** The verb tuple stays this family's
  definition; its CONSUMER is §7's (NOTE-ERASE's `ink-rub-out` reads
  `var(--motion-whisper) var(--verb-rubOut-ease) backwards`). The `.is-rubbing-out` rule at
  `MarginNote.vue:160-163` has no writer in any template, script or test, so it is DELETED from
  this diff: ink no player can reach is not a surface. If §7 names the act, the rule lands with
  its writer under §7, and it takes NOTE-ERASE's critic's audit with it: a Vue `<Transition>`
  leave class is (0,1,0) and loses to `[data-note-age="settled"]` (0,2,0) on the same node.
- **The hover rows.** R6 law 14's three forms are the verbs: ink lift = LIFT at whisper, a drawn
  mark = WRITE IN at whisper, a ground = LAY DOWN at whisper or leave. The 17 grounds on LAY DOWN
  instead of Material's `standard` (Δ 0.548) are U-10 exhibit 2.
- **The laminate.** Lay-down 280 (admitted, visible), lift-away `leave` 200 on LIFT (Δ 0.032).
- **The players well.** Untouched in paint; the graded literals stay; the rung audition is U-10
  exhibit 4.
- **The refuse shake.** `DigitCell.vue:442` and `index.css:679` both read `var(--refuse-dur)`
  (MOT-LADDER's one-home row); this family admits the figure as `shape`.

---

## 4 · Copy

None rendered. Gate messages in M16's register, e.g. `src/App.vue:380 spends turn at whisper.
turn may spend throw only.` and `DarkModeToggle.vue:910 has a transition delay of 720ms that no
beat in the table names. Add the beat or remove the delay, in the same change.`

---

## 5 · Plan: files, order, what dies

1. `scripts/publish-verbs.mjs` — un-export the six; the rung half dies; `:191` restated (no verb
   owns a number). `scripts/check-pencil-verbs.mjs` — `isShape` deleted; the ledger's third field;
   rule 7 reads `spend(` arguments and walks `.vue` script blocks; gate 8's other direction;
   `:390-395` deleted; `NAMED_DUR`/`TIME` drop `card-step-ms`; `--self-test` falls through.
   `package.json` `lint:verbs` string. Born-RED on the replayed pass-2 tree before step 2 (bank:
   rule 7 on `App.vue`, the `isShape` row, 21 laundering rows, gate 8's deletion).
2. `pencilConfig.ts` — verbs re-spelled onto the ladder's names; `ms` out of `dusk`; `spend`
   narrowed; `rubOut.rungs` = `["whisper"]`; `slide.rungs` carries `rise` only if the leader's rung
   ships; the three aliases die (`cardStepMs` with its `GameGallery.vue:930` binding, `boardFoldMs`
   → `rungs.throw` at `GameGallery.vue:371`, `chromeLeaveMs` → `rungs.leave` at `App.vue:643` —
   MOT-LADDER's commit 2 lands these first; this diff re-cuts the TS reads to `spend()`).
3. The 45 call sites (`--rung-*` → `--motion-*`, bare); `AnswerKeyLaminate.vue` (the 280 row
   admitted; 200 → `leave`); the two icons on `--motion-dusk` + LAY DOWN; `useControlsDrawer.ts`
   SLIDE + `useFlipGlide({ spend })`; `useFlipGlide.ts:124,176-177` deleted; `MarginNote.vue:160-163`
   deleted; the `index.css:1023` comment corrected; `DigitCell.vue:442`'s `shape` row.
4. `index.css @theme` re-written by `--write` (curves only); `--check` green.
5. `instruments/R6-laminate-row.diff` (MOVED narrowly, new token name). Law 4 is MOT-LADDER's
   one diff; this family cites it and files none.
6. `pencilVerbs.test.ts` — V5 restated; the narrowed door's type test (a `// @ts-expect-error` on
   `spend("turn","whisper")`).

Dies: `--rung-*` (six names) · `--verb-dusk-ms` and the `ms` key · `isShape` · the two-field
ledger · the `.ts`-only walk · gate 8's one direction · the `.is-rubbing-out` rule with no writer ·
`useFlipGlide`'s `?? drawerGlide` and its retyped `composite`/`fill` · TURN at the drawer ·
`--card-step-ms` and its allowlist doors · six dead exports · `--ease-dusk` (never born) · the
three aliases. Stays from pass 2, untouched: the delay fence, the twins, the marker-pair parse,
the seven kinds, `@toggle-beats`.

---

## 6 · Prototype brief

**Build.** A FRESH worktree from `74a2b5d9` under the scratchpad; replay
`git -C .claude/worktrees/wf_8630d340-e56-64 diff a8fee1f5` (C06 included; research: `git apply
--check` exit 0, no re-cut hunk) plus the three untracked files; then §5 on top as patches, never
committed on main. The MOT-LADDER pass-3 patch is applied FIRST if it exists when the lane opens
(the fold order; the return names which base it built on). `npx vite build` twice →
`scripts/dist-identity.mjs`, output banked. Control: `74a2b5d9` bare, named. Serve `dist-after`
on 127.0.0.1:4247 and the control on the next free port in 4230–4249, `--strictPort`,
`python3 -m http.server`; any dev server via the two-line scratch config with a private
`cacheDir`; a scratch Playwright config resolving `@playwright/test` via `createRequire`;
chromium + webkit headless; 390×844 dsf3 touch, 1280×800, 1440×900; both themes; PRM both
regimes. No osascript, no Safari.app. >90 s in the background, polled. Servers killed; band empty.

**Order.** Step 1 RED on the replayed tree (bank the four numbers) → steps 2–6 → GREEN → the
self-test's controls then the census in ONE invocation → `knip` 0 → `check-lane-membership` 0.

**What proves it (numbers first; crops zero).**

| probe | success |
| --- | --- |
| `lint:verbs` bare | 0 unadmitted; admissions stated exactly (36 − 2 icons + 1 refuse + 1 laminate = **36**, each with its `rules`); 0 stale; 0 ordinal collisions; movers 2/2; beat table 8 ↔ 8 both ways; publisher 7/7 curve rows byte-for-byte |
| the self-test, then the census | all controls RED (the App.vue spend, the `isShape` plant `.probe-escape { animation: note-in var(--motion-note) linear backwards }`, the laundering plant, the `star3` deletion, the fence sabotage, a comment inside the markers still publishes) and the census printed after them, exit 0 |
| `vue-tsc -b --force` | 0; with `spend("turn","whisper")` planted → TS2345 naming the line |
| gate 8 live | computed `transition-duration`/`-delay` on the 8 rules read HEAD's table exactly, both engines; rise 300 @ 60, wring 340, stars @ 560/640/720 |
| the dock's verb | WAAPI `getAnimations()` on the sheet mid-glide reads easing `(0.32, 0.72, 0, 1)`, duration = the section's rung, fill `none`, composite `replace`; three poses, both engines; the rest rect after 700 ms equals the control's to the pixel |
| the fold's TURN | `.board-peek-host` running ≥3 frames with a live transform on C06's build, both widths |
| the dusk, fixed-t | `background-color` at t = 0, 35 … 350 on `--verb-dusk-ease` equals bare `ease` 11/11, both engines (the scrub sampler, copied from MOT-LADDER's research instruments, OUT re-pointed) |
| the 17 grounds + the deck leave, fixed-t | per site max \|Δ\| of the animated property at fixed t on both arms — seventeen numbers for the ballot, no frames |
| PRM at the ladder | under `reduce`, every `--motion-*` 0s at `:root`; `DrawerTab:144`, `CrayonHeart:329`, `SheetWashiLabel:109` read 0s; the two admitted fallbacks read 200/150 |
| π | CSS set-diff of the shipped stylesheets (data-v hashes normalised, timing lines excluded): 0 substantive additions (the rub-out rule is gone, not added); rect census vs `74a2b5d9` Δ 0.00; goldens 4/4 via `PLAYWRIGHT_BASE_URL`; `e2e/filter-census.spec.ts` under `playwright-throttle.config.ts` both engines, EXACTLY 9; r6 `hue-census.mjs` copy re-pointed, 29 rows identical; r1 heading-voice + r3 wobble from copies, identical; `check-font-coverage` unchanged; `gameCell.css` diff-clean |
| estate lints | `lint:motion` 34 specs · `lint:copy` 0 · `check-theme-tokens` 0 unreferenced (the seven curve tokens all consumed) · `knip` 0 · `check-lane-membership` 0 |

**Frames.** Zero. If the critic asks: the exit at t=260 ms on C06's build, 390×844 dark, both
engines, one crop ≤150 KB.

**Cost.** ≤26 files; deletions stated.

---

## 7 · Gates this family lands with (born-RED on the replayed pass-2 tree; HEAD where it differs)

| id | asserts | RED |
| --- | --- | --- |
| V1 rule 1′ | a `transition:` curve outside `@keyframes` names a verb; `--ease-*` there is RED | at HEAD every row; on the branch 0 after §1.3 |
| V2 rule 5 + alias table | moved properties ⊆ the verb's props; keyframes read from the body | 0 (the two icons 2 until named) |
| V2b direction | a leaving keyframe takes lift/rubOut; an arriving one layDown/writeIn — **now for every bound animation** (`isShape` gone) | `DigitCell.vue:442` 1 |
| V3 the delay fence | second and later time values are literals | 0 (10 at pass 1) |
| **V4′ the door** | `spend`'s rung ∈ the verb's rungs, by type AND by rule 7 over `.ts` + `.vue` | `App.vue:380` invisible to the gate today; the plant → RED |
| V5 (restated) | `MOTION.verbs.rubOut.fill === "backwards"`; `spend("writeIn", …)` a type error | GREEN by data; the type test holds |
| **V6′ the honest ledger** | every admitted row's live offences ⊆ its `rules` | 21 rows |
| V7 marker-pair publisher | curves only; a comment inside the markers still publishes; `--check` byte-equal | rung rows present → RED until the half dies |
| V8 declared duplicates | exactly the three pairs | plant a fourth → RED |
| **V9′ the beat table, both ways** | every `!important` transition/delay outside the reduce block is named; every beat reads back | delete `star3` → RED |
| V10 the players well | arriving − returning = 40 ms (row) and 80 ms (name), computed | GREEN |
| **V11 no number in a verb** | `publish-verbs.mjs` reds any `ms` key | RED on the pass-2 tree (`dusk.ms`) |
| **V12 CI green** | `knip` 0; `check-lane-membership --self-test` 0; the self-test falls through | 1 / 1 / exits early |
| I1 (C06) | the exit fold paints | RED at HEAD, GREEN on C06, cited |

---

## 8 · What the owner disposes (U-10), and what this return carries

**Seven exhibits, banked, none closed.** (1) The deck's leave on LIFT (Δ 0.852). (2) The 17
hover grounds on LAY DOWN (Δ 0.548), with fixed-t numbers. (3) The tongue's straighten on LAY DOWN
(Δ 0.406; the berth itself is W2's). (4) The players well on rungs (arriving note/leave, returning
leave/whisper) shown beside HEAD, or the graded literals stay. (5) The dock's rung, the leader's
ballot. (6) RUB OUT at breath vs touch: **MOOT** under registry §2.2 (`whisper`), said rather than
dropped. (7) The toggle's reduced-motion 200 ms crossfade: keep (admitted) or cut. Plus one new
question from §2: per-term beat completeness (2 unnamed terms) — asked, not shipped RED.

**Objections, in the return and never in the diff.**

1. **The rung publisher's shape.** Rungs are constants read out of a TS object, not measured
   tokens; a build-time block in `@theme` has no first-paint window and stays inside
   `check-theme-tokens`' corpus, while a runtime node with fallbacks struck has whatever window the
   boot-frame sampler finds. Registry §2.1 rules the node and this lane obeys it (its own rung half
   dies); MOT-LADDER's brief measures the window and prices the JS. If the window reads >0, the
   build-time form is the cure and the mechanism is this family's `--write | --check`, already
   built.
2. **The seventh rung.** `sheet` 280 admitted is honest and cheap; a `sheet` rung would put the
   laminate on the ladder and cost one name. The leader's call; `rise` 600 is ahead of it in the
   owner's queue.
3. **`WASH`** is §12's furniture and its two ladder numbers (520, 440) are named in MOT-LADDER's
   law-4 row; this family does not touch it.

**Handed over.** `gameCell.css`'s four `elsewhere` rows to §6 (chair §6.11). RUB OUT's WRITER to
§7's leader, with the specificity audit. The curve names for the dusk and the two icons agreed
with MOT-LADDER's spec line for line.
