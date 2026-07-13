# r1-vue-glass — Vue idiom + glass-ui facility

Lens: Vue idiom census (composition/reactivity/template/props) + glass-ui facility
(where the chrome wants the drawer's glass grammar, and the efficient one-token facility).
Read whole: `web/frontend/src`. Frontend-design skill invoked first.

Hard-rule compliance: no source edits, :3001 untouched, no bare `npm run lint`. All probes
are read-only grep/version checks, rerunnable verbatim.

Bottom line: the Vue is disciplined and largely idiomatic (module-level MQL singletons,
`update:` v-model emits on ControlPanel, seq-guarded async in usePencilMarks, imperative-ref
discipline in HandwrittenGlyph, celebration as a pure state-derivation). The real debt is in
the **easing facility**: the "house easing ledger" (`MOTION.curves`) tokenizes exactly ONE
curve while nine recurring house curves live as 39 raw literals across ~14 files. Plus three
crisp idiom nicks, one of which the codebase condemns in its own comments yet commits twice.

---

## P2 — untokenized-easing: the "house easing ledger" is aspirational (1 row / 9 curves / 39 literals)

`pencil/config/pencilConfig.ts:128-142` — `MOTION.curves` is documented as "House easing
ledger — curves recorded as named decisions, one row per ruling." It holds exactly ONE row:
`drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)"`.

But the design system runs on at least NINE distinct recurring curves, every one of them a
raw literal duplicated across component CSS — and each is *named in prose comments* ("the
erase family", "the note write-in", "the physical-flourish curve", "the leave curve") but
never tokenized:

Probe (rerunnable):
```
cd web/frontend/src && grep -rho "cubic-bezier([^)]*)" . | sort | uniq -c | sort -rn
```
yields:
```
   9 cubic-bezier(0.22, 1, 0.36, 1)      # "note write-in" / easeOutQuint
   8 cubic-bezier(0.4, 0, 0.2, 1)        # Material standard
   8 cubic-bezier(0.34, 1.56, 0.64, 1)   # the overshoot "physical-flourish" spring
   4 cubic-bezier(0.55, 0.055, 0.675, 0.19)  # easeInCubic
   3 cubic-bezier(0.32, 0, 0.67, 0)      # "the erase family / leave the page"
   2 cubic-bezier(0.68, -0.55, 0.265, 1.55)
   2 cubic-bezier(0.33, 1, 0.68, 1)
   2 cubic-bezier(0.215, 0.61, 0.355, 1)
   1 cubic-bezier(0.645, 0.045, 0.355, 1)
   1 cubic-bezier(0.32, 0.72, 0, 1)      # <- the ONLY tokenized one (drawerGlide)
```
The `0.22,1,0.36,1` curve alone is hand-copied into MarginNote(×2), CompletionVignette,
SolverErrorNote (both games, ×2), and HandwrittenLogo (×3). The `0.34,1.56,0.64,1` spring
into DiceIcon(×2), SolveIcon, AnswerKeyLaminate(×2), DarkModeToggle(×2), FilterTuner.

Named cost: the "one row per ruling" invariant is a fiction — 38 of 39 recurring-curve
occurrences are outside the ledger. Retuning any house curve (e.g. the "erase family" leave)
means editing 3+ files by hand with no single source of truth; the canon lives in prose, not
a token. The lens' efficient facility ("one token family in pencilConfig, no per-component
bespoke curves") is explicitly unmet. This is the tranche-shaped item: extend `MOTION.curves`
to a real family (erase/noteWrite/flourishSpring/leave/standard) and `v-bind`/CSS-var them.
family_hint: `untokenized-easing`

---

## P3 — glass-grammar-gap: the flagship sheet still rides the retired overshoot spring

`pencil/sheet/AnswerKeyLaminate.vue:227-233` — the lay-down transition is
`cubic-bezier(0.34, 1.56, 0.64, 1)` @280ms. That is the exact overshoot spring the drawer's
owner ruling KILLED as un-glass: `pencilConfig.ts:133-140` records "the spring (0.34, 1.56,
0.64, 1) dies for the drawer — replaced by the glass family (swift attack, long fluid settle,
ZERO overshoot; the iOS-sheet class)."

The lens asks "where else does the chrome want the glass grammar (sheets, selectors, dialogs,
the pad)?" The answer is the laminate itself — it is literally the flagship translucent
**sheet** (its own header: "the flagship translucent object"), the drawer's closest cousin (a
board-shaped plate that lays over the worksheet). Yet it lays down on the very curve the glass
ruling retired for that same sheet-class motion. The other overlay/sheet surfaces
(HandwrittenLogo listbox popover, AttributionCard) likewise use bespoke non-glass curves.

Not a bug — the ledger scope-fences the drawer ruling ("no other surface re-eases under it",
`pencilConfig.ts:138-139`). But it is the direct glass-ui finding: the glass grammar earned at
the drawer was never carried to the one surface that most wants it, and the retired spring
persists on it. Judge against the hand-made pencil soul: a swift-attack/zero-overshoot glass
settle would read as the laminate *pressing down* rather than *bouncing on*, which is more
faithful to a physical laminated key than the springy overshoot. Fold into the P2 facility as
its first consumer.
Probe: `grep -n "cubic-bezier" web/frontend/src/pencil/sheet/AnswerKeyLaminate.vue`
family_hint: `untokenized-easing` (same mechanism — no glass token to reach for)

---

## P3 — inline-ref-churn: the board commits the exact anti-pattern its own glyph condemns

`games/sudoku/SudokuBoard/SudokuBoard.vue:583` and its twin
`games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:520`:
```
:ref="(el) => setCellApi(pos - 1, el)"
```
An inline arrow inside `v-for` — a NEW function identity every render. Vue therefore unbinds
the old ref (`setCellApi(pos, null)` → `cellApi.delete(pos)`) and binds the new
(`cellApi.set(pos, el)`) for ALL N cells on every board re-render. And the board re-renders
more than one might think: `marksFor(pos)` (SudokuBoard.vue:598, a function call in the
template) reads the reactive `revealedMarkRows`, which the K-peek reveal ripples row-by-row
via requestIdleCallback (SudokuBoard.vue:130-148) → one full-board render+churn PER row (up to
16 on a 16×16 peek), plus every value/solveState/generation change.

The kicker: `pencil/glyph/HandwrittenGlyph.vue:30-35` explicitly forbids this exact pattern
in a load-bearing comment — "Stable TEMPLATE ref (never an inline `:ref="(el) => ..."`
closure)... a re-bound inline function ref would fire unbind→rebind on each poll/tick." The
board violates the house rule the glyph documents. Idiomatic cut: a stable named function ref
`(el) => setCellApi(...)` hoisted per-position, or a single `setCellApi`-style ref that reads
`pos` off the element's data — either stops the delete/set Map churn.
Probe: `grep -rn ':ref="(el)' web/frontend/src`
family_hint: `inline-ref-churn`

---

## P3 — prop-drill-passthrough: `flourish` threads board→cell→glyph but the cell never reads it

`flourish` (= the board's `celebrating` derivation) is threaded three levels but consumed only
at the leaf. It is declared on the cell (`SudokuCell.vue:35`, `FutoshikiCell.vue:39`) and
forwarded verbatim (`SudokuCell.vue:251`, `FutoshikiCell.vue:249`) — never read anywhere in
either cell's `<script>` (probe below shows every `props.` access in SudokuCell; `flourish`
appears only at the declaration and the forward). It is a pure pass-through on BOTH cell twins.

The board (`SudokuBoard.vue:600`) owns `celebrating`; only `HandwrittenGlyph`
(`HandwrittenGlyph.vue:188`) consumes it. A single board-scoped boolean consumed only by the
leaf glyph is the textbook `provide`/`inject` candidate — board `provide('celebrating', ...)`,
glyph `inject` — which deletes the dead prop from both cell components and both boards'
templates. The audit sheet flags this thread explicitly ("judge it"): judged — it is
legitimate drilling debt, mild (one boolean, two levels), but doubled across the twins and
carrying zero value at the middle layer.
Probe: `grep -n "flourish\|props\." web/frontend/src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue`
family_hint: `prop-drill-passthrough`

---

## P3 — defineModel candidacy: OptionSelector is a `selected`+`change` pair (pre-3.4 idiom)

`pencil/chrome/OptionSelector/OptionSelector.vue:8-16` — `defineProps<{ selected }>` +
`defineEmits<{ (e:'change', value) }>`, consumed by ControlPanel as `:selected` + `@change`
(`sudoku/ControlPanel/ControlPanel.vue:229-245, 337-366`). ControlPanel already emits proper
`update:size`/`update:difficulty` for its OWN v-model surface (ControlPanel.vue:67-68), so the
selector is the one control still on the manual prop+event idiom. A `defineModel<string|number>()`
(Vue 3.4+, and this is v4-era tooling) would collapse `selected`+`change` into `v-model` at the
call sites. Minor — `change` semantics are clear and the emit is explicit — but it is the lone
two-way control not on the modern facility.
family_hint: `manual-vmodel-pair`

---

## Idiom notes (sub-P3, no separate finding)

- `useButtonAnimation.ts:6-9` — `trigger()` schedules a `setTimeout` with no clear on
  re-trigger or unmount. Overlapping triggers let an earlier timer clear `animating` while a
  later animation is still meant to run (visual only); an unmount mid-window writes a GC'd ref
  (harmless). Every other timer holder in the tree (ControlPanel, usePencilMarks, celebration,
  AnswerKeyLaminate) clears on the edge and on unmount — this one composable is the exception.
- `pencilConfig.ts:177,296` — `BOIL_CONFIG`/`FILTER_PRESETS` are deep `reactive()`. Correct:
  FilterTuner's `v-model.number` mutates nested fields live (dev). In prod FilterTuner is
  DCE'd so the proxies never mutate — a `shallowReactive` would serve there — but the dev
  affordance needs deep tracking, so this is a defensible trade, not misuse. Noted, not filed.
- No `v-memo`/`v-once` anywhere. The heavy SVG trees (81–256 `SudokuCell`/`HandwrittenGlyph`,
  each an SVG) are candidates, but cell re-renders are cheap patches and animation is
  imperative (WAAPI/setAttribute, not reactive), so v-memo would buy little against the
  inline-ref-churn already filed — fix the churn first.

## Non-findings verified (close-class checks)
- `duration-250` (sudoku/ControlPanel.vue:211,350) is NOT a dead class: Tailwind v4.3
  (`@tailwindcss/vite ^4.3.2`, no config file → CSS-first) supports bare-numeric
  `duration-<n>` → `transition-duration: 250ms`. Checked before filing; it resolves. Probe:
  `grep -i tailwind web/frontend/package.json`.
- Module-level singletons (useStackedLayout, useCoarsePointer, useControlsDrawer, boilBeat)
  never remove their MQL/watch listeners — correct, they're app-lifetime by design and the
  comments say so; not a leak.
