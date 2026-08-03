# W0 §0.5 — the cite-symbols ruling, executed

Ruling 2 says comments cite symbols, because a symbol moves with the code and a line number
doesn't. This is the census that ruling was written against, re-derived at the working tree, plus
the edits landed in the four files this executor owns.

## What the spec named, and what's actually there

The spec names four sites. Three are real and were cured here. The fourth — `App.vue:57` — has no
cite to cure: `App.vue` carries no `file:NNN` comment cite at the working tree, at `afc72ba1`
(the formation commit), or at any commit in the file's history. Probe:

```
$ git rev-parse HEAD
6a180b3525af1158931048ab38d9d5f49550f3c2
$ grep -nE '[A-Za-z][A-Za-z0-9_.-]*\.(ts|vue|css|mjs|js):[0-9]+' web/frontend/src/App.vue
(no output)
$ for c in $(git log --format=%H -- web/frontend/src/App.vue); do \
    git show $c:web/frontend/src/App.vue | grep -cE '…\.(ts|vue|css|mjs|js):[0-9]+'; done | sort -u
0
# 25 commits have touched App.vue; none of their versions carries a file:NNN cite.
```

What App.vue's line 57 does hold is the `useShortcutPolicy()` install block. The composable it
installs, `isTypingContext`, carries a cite — and that one's TRUE at the tree. The nearest live
false cite naming App.vue is `useGameGallery`'s `writeViewParam`, which cites a range in App.vue
where `shellFor` now sits; the `replaceState` idiom it means lives in App.vue's `setGame`. That
file isn't this executor's, so it leaves as a handoff, not an edit.

## Landed — the four owned files

| File | cite as found | true referent, by symbol |
|---|---|---|
| `GameControlPanel.vue` (`.action-bar` sticky rule) | `scene.css:60`, `scene.css:230`, `scene.css:191` | `.controls-card`'s `overflow-y: auto` under `@media (min-width: 1024px)` and under `@media (max-width: 1023.98px) and (orientation: portrait)`; the in-flow landscape card is the stacked `@media (max-width: 1023px)` block, which only sets `.scene-controls`' `--board-col` width |
| `GameControlPanel.vue` (`.icon-sublabel.is-armed`) | `index.css:163` | the ink-tier block in `index.css`, where `--color-red-ink` is declared — the cited line is prose inside the crayon-palette note, 18 lines short of the token |
| `GameControlPanel.vue` (the `ONE TREE, BOTH REGIMES` template comment) | `f2-proto/MANIFEST.md:141` | §5 deviation T′ of that MANIFEST — the line happens to be right today, restated as the heading + deviation id so it stays right |
| `BoardHost.vue` (`cellRows`) | `useGameState.ts:188` | the `totalCells` computed in `useGameState` |
| `useFlipGlide.ts` (module docblock) | `(:156-318)` in `useControlsDrawer` | `useControlsDrawer`'s glide engine; post-extraction what's left there is the domain half, `glideCtl` and `glide()` — the cited range no longer exists as a range |

Each cited line, printed at the tree — not one of them is the thing its comment claims:

```
$ awk 'NR==60||NR==191||NR==230 {printf "scene.css:%d| %s\n", NR, $0}' src/games/shared/scene.css
scene.css:60|    derived from its own chrome. */
scene.css:191|    the tongue is a verb IN the ribbon now, so there is nothing left to align the shut sheet to
scene.css:230|      keep carrying the tongue or the drawer is unopenable. (`inert` is bound in the template
$ awk 'NR==163 {print}' src/assets/index.css
     saturation RISE as needed to hold perceived chroma on the dark ground. Crayons don't
$ awk 'NR==188 {print}' src/games/shared/useGameState.ts
  const linkError = ref(initial.boardLink === "invalid");
```

All five are comment-only. `git diff` touches no executable line; `prettier --check` is green on
the three edited files, and `vue-tsc -b` exits 0.

```
$ node node_modules/.bin/prettier --check src/games/shared/GameControlPanel.vue \
    src/games/shared/BoardHost.vue src/games/shared/useFlipGlide.ts
All matched files use Prettier code style!
```

## The sweep — every other cite under `web/frontend/src`

Two patterns: `name.ext:NNN` and a bare `(:NNN)`. Fifteen pattern-A lines across thirteen files
survive in the tree after the edits above, plus two bare cites in `CheckStatus`. One apparent
bare cite is a false positive: `pencilConfig`'s `cardStepMs` says "the Wave-D preview (:4788)",
which is a port, not a line.

Verdicts, each re-derived by reading the cited file at the tree:

| Site | cite | verdict | true referent |
|---|---|---|---|
| `useShortcutPolicy` `isTypingContext` | `DigitCell.vue:140` | TRUE | `role="gridcell"` on the cell |
| `CheckStatus` docblock | `useAssists.ts:40`, `:44`, `:63` | TRUE ×3 | `checkArmed` ref, its arm in `setErrorCheckMode`, its clear in the `watch(values)` |
| `playerIdentity` | `HandwrittenGlyph.vue:85` | TRUE | the `var(--color-user-ink, #2563eb)` fallback in `HandwrittenGlyph`'s `strokeColor` computed |
| `GameGallery.a11y.test` | `a11y.spec.ts:162` | TRUE | the `guardAnnounced` helper |
| `useSession.stress.test` | `useUndoHistory.ts:25-30` | TRUE | the delta-log-not-HAMT rationale docblock |
| `futoshiki/technique.test` | `csp-solver/wasm/src/futoshiki.rs:318-320` | TRUE | the "pin the givens" singleton restriction inside `propagate_futoshiki` |
| `useGameGallery` `writeViewParam` | `App.vue:80-88` | **FALSE** | `shellFor` sits there; the `replaceState` grammar is in App.vue's `setGame` |
| `pencilConfig` `DRAW_IN_PRESETS` | `usePathAnimation.ts:90-92`, `HandwrittenGlyph.vue:155-156` | **FALSE ×2** | the three-group `preset:` table in `usePathAnimation`'s `animateDrawIn`, and the `DRAW_IN_PRESETS.glyph` read in `HandwrittenGlyph`; the second file's cited lines are its celebration branch and never touch `DRAW_IN_PRESETS`. The sentence's "only … have consumers" also misses `DifficultyTally` and `GameGallery`, which read the same presets |
| `KeyboardLegend` docblock + `KeyboardLegend.test` | `GameBoard.vue:458-466` ×2 | **FALSE ×2** | the `case "z":` arm of `onBoardKeydown`; the cited lines are `hintFocusedCell` |
| `techniqueEngine` docblock + `sudoku/technique.test` ×2 | `csp-solver/wasm/src/sudoku.rs:186-188` ×3 | **FALSE ×3** | `propagate_sudoku` and its doc comment; the cited lines are result-struct fields |
| `sudoku/spec.test` | `SudokuGame.vue:57-73` | **FALSE** | the file's gone — `find . -name SudokuGame.vue` is empty. The comment is past-tense history, so its cure is either the surviving symbol (`GameShell`) or a struck cite |

Nine false cites remain, in seven files, none of them this executor's. They're listed as handoffs
with a proposed replacement each.

## Appendix — outside `src`, noted not touched

`e2e/` is fenced for this executor, but the same disease is there and both instances are false:
`a11y.spec`'s 3.1 preamble cites a line in App.vue for the universal `?game=` where `parseGame`
is the referent, and its 3.4 preamble cites two lines for "the correct pattern already exists
twice" where the referents are the `metaKey || ctrlKey || altKey` guards inside App.vue's
`onGlobalKeydown` and `GameGallery`'s `onKeydown` — the second cited line is a `case "Home":`
arm. Both are one-line symbol swaps whenever the e2e fence lifts.

## Gate

None, per the spec: the convention is the cure. If the owner wants enforcement, the shape a
`check-comment-lines` gate takes is one grep over `web/frontend/src` for the two patterns above,
with `(:NNNN)`-as-port excluded, asserting an empty match set — born RED at this commit against
the nine rows in the table.
