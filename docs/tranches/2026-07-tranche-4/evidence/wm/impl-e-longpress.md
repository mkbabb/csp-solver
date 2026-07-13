# impl-E — long-press peek + honest haptics (T4-WM §3)

**Lane E of T4-WM.** Charge (spec §3, on the crit-verified refusals in r3 §§3–4): a long-press on
a board cell opens that cell's candidate glimpse via Pointer Events only (`pointerdown` + ~450ms
timer, cancelled on `pointerup`/`pointercancel`/move-past-slop — never `contextmenu`, which doesn't
fire on iOS); a feature-detected `navigator.vibrate?.(10)` on recognition (Android buzzes, iOS
silently no-ops — the honest ship, no switch-tick hack); the peek shows the engine-domains pencil
marks and dismisses on release; and a born-RED unit layer over the gesture state machine. Text-first.
Lane A's native entry + lane C's `.board-cells` callout/user-select/touch-action discipline are the
substrate (the loupe-suppression is this gesture's prerequisite; the peek-hold rides the clean
surface lane C left). Concurrent W6 edits (SudokuBoard difficulty-copy, FutoshikiGame difficulty
selector) merged cleanly with these — demarcated, not this lane's.

## The design (what peeking shows, how it dismisses — KISS)

The candidate glimpse **is** the engine-domains pencil marks (the solver's root AC-3 + GAC
propagated domains — W6 beat 9), the same marks the answer-key peek already rides. The long-press
summons them **marks-only** — NO answer laminate — so the surviving candidates show in place on the
board, distinct from the divider/K answer-key peek (which lays the teacher's key over the board and
hides the marks under it). This is the honest reading of "that cell's candidate glimpse": candidates,
not answers. It reuses the whole shipped marks machinery (`usePencilMarks` — idle-chunk ripple, PRM,
stale-shape + seq guards) with zero parallel candidate system, and the marks render globally where
propagation bit — mirroring the shipped hold-to-peek grammar. Release/cancel/drift-off clears them.

Decisions banked:
- **Trigger gated to EMPTY cells** (`props.value !== 0` short-circuits the gesture): only a blank
  cell has a candidate glimpse to show, so a hold on a given/filled cell is inert (nothing to peek).
- **Marks-only, guarded against the answer-key peek** (game handler): `onCandidatePeekStart` mirrors
  `startPeek`'s guards — it stands down when `peekActive` (the one marks surface is owned) or when the
  solve worker owns the board mid-solve (the marks ride a worker propagate). `onCandidatePeekEnd`
  keeps the `peekActive` guard so a release never strips marks out from under a held answer-key peek.
- **Capture-free; `pointerleave` routed to cancel.** No `setPointerCapture` — capturing the pointer
  on the cell risks fighting the native tap-to-focus the pad abrogation restored (lane A). A finger
  that drifts off the cell ends the hold via `pointerleave → onPointerCancel`; the slop-cancel and
  `pointercancel` (scroll takeover) cover the rest. One Pointer-Events path, iOS + Android.
- **The recognized hold swallows its own ending tap** (`suppressClick`): so peeking never
  focuses/raises the keyboard; a plain tap (no hold) still focuses through the native-entry path.
  On iOS focus defers to tap-completion, so the hold shows keyboard-free and the swallowed click
  keeps it down; on desktop the mouse's mousedown-focus is harmless. Owner-smoke verifies on device.
- **W8 seam holds**: long-press stays peek (read-only) — it never touches `values`; W8's mode-toggle
  reopens only through its own gate.

## What changed

- **`src/games/shared/honestHaptics.ts`** (NEW) — `vibrateOnce(ms=10)`: the whole of the honest
  haptic. `navigator.vibrate` was never in WebKit and still isn't (2026, r3 §3), so on every iOS
  browser this is a silent no-op; Android/Chromium buzz. Feature-detected via a local optional-shape
  cast so it never throws where the API is absent and the DOM lib's (aspirational non-optional) type
  doesn't mask the iOS reality. The iOS `<input switch>` tick hack is REFUSED (Apple closed the
  scripted path at 26.5) — no fallback, no trick; re-trigger named (a real WebKit haptics API).
- **`src/games/shared/useLongPress.ts`** (NEW) — the gesture state machine. Framework-light
  (timer + slop geometry over four handlers, no DOM read beyond clientX/clientY), so it's unit-
  provable with fake timers. `onPointerDown` starts the timer; the hold surviving `delayMs` (450)
  fires the haptic + `onLongPress`; a PENDING press is slop-sensitive (move past `slopPx` (10)
  cancels — a scroll, not a hold), a recognized hold ignores movement (only release exits);
  `onPointerUp`/`onPointerCancel` end it; `onRelease` fires ONLY after a recognition (a short tap
  never emits a spurious dismiss). Self-disposes via `onScopeDispose` so a peek can't outlive its
  cell. The haptic is injectable (default `vibrateOnce`) so the unit layer proves the buzz wiring
  without a real Vibration API.
- **`SudokuCell.vue` / `FutoshikiCell.vue`** (twin) — wire `useLongPress` under the cell: empty-gate
  the pointerdown, emit `candidatePeekStart`/`candidatePeekEnd` on recognition/release, and swap
  `@click="focusInput"` → `@click="onCellClick"` (the `suppressClick` swallow). The write path,
  ghost focus, marks render, and every other cell behavior are untouched.
- **`SudokuBoard.vue` / `FutoshikiBoard.vue`** (twin) — forward the cell's `candidatePeek*` up as
  the board's own emits (the cell → board → game thread, the established `cellFocus` shape).
- **`SudokuGame.vue` / `FutoshikiGame.vue`** (twin) — `onCandidatePeekStart/End` drive
  `setMarksActive`, guarded (peekActive / solving) as above.
- **`useLongPress.test.ts`** (NEW, 10) + **`honestHaptics.test.ts`** (NEW, 3) — born-RED at HEAD
  (both modules new): the timer edge (449 vs 450), buzz-on-recognition, tap-before-delay (no peek/
  buzz/dismiss), slop-cancel + within-slop-peeks, move-after-recognition-never-dismisses, once-only
  release, pointercancel (live + pending), dispose, and a fresh-down superseding a stale hold; the
  haptic fires with ms where present, defaults to 10, and is a throw-free no-op where absent.
- **`SudokuCell.test.ts` / `FutoshikiCell.test.ts`** (+6 each) — the CELL wiring: hold-opens/release-
  closes, filled-cell-never-arms, short-tap/slop-move-never-peeks, the ending click swallowed (no
  focus), and a plain tap still focuses (native-entry preserved). MouseEvents dispatched directly
  (PointerEvent's base carries clientX/clientY at construction; `trigger` can't set them after).
- **`e2e/mobile-affordances.spec.ts`** (+2) — real-browser (Chromium, coarse via hasTouch/isMobile):
  a stationary pointerdown-hold on a blank cell opens `.board-cells .pencil-marks` (>0, never
  ambient) then pointerup clears them to 0, both games.

## Gate rows: born-RED → close

| Gate | State | Close |
|---|---|---|
| long-press: pointer-events ~450ms, move-cancel, opens the cell peek both games | RED (no gesture existed) | `useLongPress` (450/slop/cancel) proven in 10 unit contracts; the peek opens `.pencil-marks` and clears on release in the sudoku + futoshiki e2e |
| long-press: `navigator.vibrate?.()` fires on trigger where the API exists — feature-detect proven in the unit layer | RED | `honestHaptics.test.ts` proves the buzz-with-ms + the throw-free absent no-op; `useLongPress.test.ts` proves the buzz rides recognition |
| long-press: no OS callout/loupe intrusion | device-owner | prerequisite met by lane C's `.board-cells` user-select/touch-callout; verified on the deployed build at the E8 owner smoke |
| parity: full unit + e2e green; desktop keyboard flow byte-identical | GREEN | 133 unit / 15 files; affordances (K-peek, hint, undo) + sudoku-interaction + mobile-affordances 24/24 — tap-to-focus, marks, and hint unregressed |

## Verification (commands + outputs)

- `npx vue-tsc -b --force` → exit 0 (clean).
- `npm run test:unit` → **15 files, 133 tests passed** (was 108; +25 this lane: 13 machine/haptic,
  12 cell-wiring).
- `npm run lint:eslint` → clean. `npm run lint:knip` → clean (no unused exports: `useLongPress` +
  `vibrateOnce` both have production consumers). `npx prettier --check src/` → all formatted.
- `npm run build` → built in ~0.85s; index chunk 162.53 kB / gzip 60.13 kB (the gesture machine +
  honest haptic are a few hundred bytes).
- `npx playwright test mobile-affordances.spec.ts -g "long-press peek"` → **2 passed**.
- `npx playwright test mobile-affordances.spec.ts affordances.spec.ts sudoku-interaction.spec.ts` →
  **24 passed** (the cell click-handler swap regresses nothing: native-entry tap, marks-gesture,
  hint, and play-tools all green).

## Residual (owner-side, named)

- **iOS focus timing** — the peek showing keyboard-free depends on iOS deferring input focus to
  tap-completion (the swallowed click keeps the keyboard down). Emulation can't see it; the E8
  owner smoke on the deployed build is the honest verification, alongside the loupe row.
- **Two-hand contention** — a divider answer-key hold released while a cell long-press is still held
  clears the shared marks surface. Extraordinarily contrived (two simultaneous holds), self-heals on
  the next press; left KISS by license, not silently.
