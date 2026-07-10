# Pass-3 · Q7 — Affordance interlocks

**Adversarial re-derivation at HEAD `8913023e` · repo read-only · 2026-07-09.**
Question (synthesis §6, dispatch list item 7): does `?board=` collide with `useUrlState` precedence, the futoshiki param-accretion quirk, or the PWA `start_url`? Does undo's `preventDefault` regress any verified keyboard behavior (K-peek exemption, roving tabindex)?

Method: none of the four sub-questions concern code that exists yet in the shipped form W6 will add (`?board=`, undo, PWA manifest are all unbuilt — confirmed by `find`/`grep` below). So this is not a "verify a prior lane's claim" exercise — it's a fresh interlock analysis against the actual current composables, tracing every code path the new features must thread through. I re-read `useUrlState.ts` (both games), `App.vue`, `FutoshikiGame.vue`, `SudokuBoard.vue`/`FutoshikiBoard.vue`, `SudokuCell.vue`/`FutoshikiCell.vue`, `useSudoku.ts`, `ControlPanel.vue`, `vite.config.ts`, `index.html`, and the e2e spec files directly — nothing here is inherited from lane 14 / verify-14 without independent re-confirmation (both cited below only where they match my own reads byte-for-byte).

## Answer

**Four separate findings, none fatal, all requiring the wave text to say more than it currently does:**

1. **`?board=` vs `useUrlState` precedence — real gap, not "already-scaffolded."** The resolver's URL-vs-storage precedence is a clean 2-way branch keyed only on `size`/`difficulty` match; there is no slot today to carry board content independent of localStorage, and `hasUrl` doesn't OR in board presence. A `?board=`-only link (no `size`/`difficulty`) is silently dropped by the current gate. In the normal flow this is masked (ambient `syncToUrl` always populates `size`/`difficulty` before any share act can fire), but the resolver itself needs new branching, and needs to fail closed on a malformed/mismatched board rather than trust it blindly.
2. **Futoshiki param-accretion quirk — confirmed, and it generalizes to `?board=`, upgrading its own severity.** Both games' `syncToUrl` only ever `.set()` their own keys on `new URL(location.href)`; nothing ever `.delete()`s a foreign key, and `App.vue`'s `setGame` only sets `?game=`. A shared sudoku `?board=<base64>` (up to ~256 chars at 16×16) rides inert into a futoshiki URL on game-switch — no functional break (futoshiki's parser ignores unknown keys), but it directly undercuts the wave's own "clean URL" rationale for making the permalink share-on-demand in the first place.
3. **PWA `start_url` — no structural collision found.** `start_url` only governs home-screen-icon launches (no query string is ever attached to that navigation); it never intercepts or rewrites a regular link click, and `generateSW`'s navigation-fallback precache serves the cached document for the *request* without touching `location.href`/`location.search` in the tab — `resolveInitialState()`'s client-side read is unaffected either way. The one real (generic, not board-specific) PWA limitation: installing while viewing a `?board=` deep link means all *future* icon launches jump to `start_url` and never replay that link — expected PWA behavior, out of the wave's own precache-only scope, not a bug to fix.
4. **Undo's `preventDefault` cannot structurally regress K-peek or roving tabindex — verified by tracing the actual three-layer bubble chain, not by inference.** The wave's own sketch places the new Ctrl+Z case in `onBoardKeydown` (`SudokuBoard.vue`/`FutoshikiBoard.vue`), which is architecturally disjoint from both the K-peek handler (`App.vue`/`FutoshikiGame.vue`, window-level, keyed on `'k'`/`'Escape'` only) and the Backspace/Delete handler (`SudokuCell.vue`/`FutoshikiCell.vue`, keyed on those two keys only, deliberately non-stopPropagating). Adding a `'z'`/`'Z'` case to `onBoardKeydown`'s flat switch touches none of the existing Arrow/Home/End cases, and `preventDefault()` never implies `stopPropagation()` — the event still reaches `App.vue`'s window listener afterward, which is a no-op for `'z'` both before and after the K-peek fix (that fix only touches the `'k'`/`'Escape'` branch). **But the wave text's literal phrasing has a real gap:** "Ctrl+Z/Ctrl+Shift+Z" omits `e.metaKey` (Cmd on Mac) — the original phantom repro this fix targets (lane 14's `undo_across_refocus`) was triggered via "Ctrl/Cmd+Z," i.e. Cmd+Z on a Mac harness. A `ctrlKey`-only guard leaves the exact bug this fix exists to close **unfixed on macOS**, the platform where it was originally caught.

## Evidence

### 1. `?board=` vs `useUrlState` precedence

`web/frontend/src/games/sudoku/composables/useUrlState.ts` (read in full):
- `parseUrlParams()` (:27-39) reads only `size`/`difficulty`; `hasUrl` in `resolveInitialState()` (:68) is `url.size !== null || url.difficulty !== null` — no board dimension.
- `resolveInitialState()` (:65-105) is a flat 2-way branch: `hasUrl && persisted` → merge-or-URL-wins-on-mismatch (:70-79); `hasUrl` alone → URL-only (:81-88); `persisted` alone → storage-only (:90-97); neither → fresh (:99-104). There is no third input (a URL-derived board) anywhere in this function's shape — `PersistedBoard` (the only board-shaped type) is only ever constructed from `JSON.parse(localStorage...)` in `loadPersistedBoard()` (:41-59). No code path builds a `PersistedBoard` from URL content.
- `syncToUrl()` (:107-112) writes only `size`+`difficulty` — confirms lane 14/verify-14's C6 exactly (cited range 107-124 in the corpus covers `syncToUrl`+`persistBoard`+`clearPersistedBoard`; verified byte-identical at HEAD).
- In `useSudoku.ts`, `syncToUrl(size.value, difficulty.value)` fires unconditionally at module-init (:239) and via `watch([size, difficulty], …)` (:258-260) — so by the time any user-facing "share" affordance could exist, `?size=`/`?difficulty=` are *already* in the URL, which is why a `?board=`-only cold URL is a secondary, not primary, risk — but it's still a real gap if a future link-shortener/proxy trims to a bare `?board=`, or if the writer is ever tempted to omit the sibling params for a "cleaner" link.
- Confirmed the wave-cited "precedence scaffolding already exists" claim (lane 14 line 65, verify-14 C6) is true only at the *meta* level (URL-wins-over-storage as a *principle*) — the actual code has no board-carrying slot. This is new logic, not a hookup.
- No validation exists (nor is any specified) that a decoded `?board=`'s implied size agrees with the `?size=` in the same URL. A hand-edited or bit-rotted link should fail closed (drop the bad `board`, fall through to the size/difficulty-only path), not attempt to render a length-mismatched board.

### 2. Futoshiki param-accretion quirk, and why `?board=` makes it worse

`web/frontend/src/games/futoshiki/composables/useUrlState.ts` header (:1-10, read in full) states the design explicitly: `?board_size=` is Futoshiki's own key so both games can coexist in one URL under `?game=`. `syncToUrl()` (:87-91) is the same pattern as sudoku's: `new URL(location.href)` + `.searchParams.set('board_size', …)` — never touches any other key.

`web/frontend/src/App.vue`:
```
31: const game = ref<GameId>(parseGame())
32: function setGame(val: string | number) {
...
36:   const url = new URL(window.location.href)
37:   url.searchParams.set('game', next)
38:   history.replaceState(null, '', url.toString())
```
`setGame` only ever sets `game` — confirmed fresh, no `.delete()` anywhere in this function or in either game's `syncToUrl`. This is the exact mechanism lane 14 (line 79) and verify-14 (C6, "Futoshiki param co-existence by design") already named for `size`/`difficulty`/`board_size`. It generalizes mechanically to `?board=` with zero new code needed to reproduce the drag-along — which is precisely the problem: nothing *prevents* it either. A sudoku share link opened, then game-switched to futoshiki via the picker, leaves `?board=<up to ~256 chars>` sitting inert in the address bar (futoshiki's `parseUrlParams` only reads `board_size`, so nothing breaks functionally) — but this is no longer "cosmetic": verify-14's own design amendment #4 argued *for* share-on-demand specifically because "a permanently long URL defeats the clean `?size&difficulty` surface" the report praised. A large opaque base64 blob dragged across a game switch is exactly that defeat, just triggered by navigation instead of ambient sync.

### 3. PWA `start_url`

Confirmed nothing is built yet:
```
$ find web/frontend -iname "manifest*" -not -path "*/node_modules/*" -not -path "*/dist/*"   → (none)
$ find web/frontend -iname "*.webmanifest" -not -path "*/node_modules/*"                      → (none)
$ grep -rn "vite-plugin-pwa|VitePWA" web/frontend/package.json web/frontend/vite.config.ts    → (none)
```
`vite.config.ts:94` — `base: process.env.VITE_BASE_URL || '/'` — deployed at domain root (matches lane 14's live probe of `sudoku.babb.dev`), so no sub-path complicates `start_url`/`scope` resolution.

Platform mechanics (not repo-specific, but load-bearing for the answer): `start_url` is consulted only when the OS launches the installed app from its home-screen/app-drawer icon with no target URL of its own — it is never substituted for, nor does it rewrite, the URL a user actually clicks (whether that link is captured by the installed PWA or opened in a normal tab, the browser navigates to the *clicked* URL, query string intact). `vite-plugin-pwa`'s `generateSW` mode intercepts the *document fetch* for offline/precache purposes (`NavigationRoute`) — it can serve the cached shell instead of hitting network, but it does not touch `location.href`/`location.search` in the tab. `resolveInitialState()` reads `window.location.search` at runtime client-side (:28 in both `useUrlState.ts` files), so it sees whatever the address bar actually holds regardless of whether the HTML body came from cache or network. **No structural collision.** The one real interlock is generic to all PWAs, not introduced by this feature: install-while-viewing-a-deep-link means later icon launches go to `start_url`, not back to that link — acceptable and already out of scope per the wave's own "REJECT anything past precache" line. Recommend the wave pin `start_url: '/'` explicitly as a deliberate line (not left to plugin defaults), so an icon launch always resolves through the clean fresh/storage precedence and never risks replaying a stale captured `board=`.

### 4. Undo's `preventDefault` vs K-peek / roving tabindex — traced bubble chain fresh

Three layers, all read directly, all still bubble-phase `@keydown` (no capture, no `stopPropagation()` anywhere in this chain):

**Layer 1 — per-cell, innermost.** `SudokuCell.vue:112-121`:
```
112: function handleKeydown(event: KeyboardEvent) {
113:   const target = event.target as HTMLInputElement
114:   if (event.key === 'Backspace' || event.key === 'Delete') {
115:     emit('update', props.position, 0)
116:     target.value = ''
117:     event.preventDefault()
118:   }
119:   // Arrow / Home / End navigation deliberately falls through to the board's roving-tabindex
120:   // controller (bubbles to `.board-cells`); handling it there keeps one keyboard model.
121: }
```
Only Backspace/Delete are intercepted; everything else — including a future Ctrl+Z — falls through untouched, by explicit design comment. `FutoshikiCell.vue:112-119` is architecturally identical (verified: same `Backspace`/`Delete`-only guard, same `preventDefault()`, same fallthrough).

**Layer 2 — board container, middle.** `SudokuBoard.vue:153-182` (`onBoardKeydown`, bound at `:322` to `.board-cells`, template class at `:313`):
```
159: switch (e.key) {
160:   case 'ArrowUp': ...
163:   case 'ArrowDown': ...
166:   case 'ArrowLeft': ...
169:   case 'ArrowRight': ...
172:   case 'Home':
173:     focusCell(e.ctrlKey ? 0 : row * n)
175:   case 'End':
176:     focusCell(e.ctrlKey ? n * n - 1 : row * n + (n - 1))
178:   default:
179:     handled = false
181: if (handled) e.preventDefault()
```
This is where the wave's own sketch places the new binding ("Ctrl+Z/Ctrl+Shift+Z **on the board keydown handler**"). A `'z'`/`'Z'` case added here is a flat-switch sibling to the existing cases — `e.key` values never collide (`'z'`/`'Z'` vs `'ArrowUp'`/`'Home'`/etc. are disjoint strings) — so no existing case can be shadowed or altered. `FutoshikiBoard.vue:219-247` mirrors this exactly (`onBoardKeydown`, same switch shape, same `board-cells` class at `:366`, bound at `:375`).

**Layer 3 — window, outermost.** `App.vue:92-105` (`onKeydown`, registered `window.addEventListener('keydown', …)` in `onMounted` at :107):
```
94:  if (e.key === 'Escape') { endPeek(); return }
98:  if (e.key === 'k' || e.key === 'K') {
99:    const t = e.target as HTMLElement | null
100:   if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
101:   e.preventDefault()
```
`FutoshikiGame.vue:50-65` is the same shape (`'Escape'` / `'k'`/`'K'` guard at :55-57, same `window.addEventListener` pattern at :64-65).

**Why no regression is structurally possible:** (a) `'z'`/`'Z'` never matches the `'Escape'`/`'k'`/`'K'` branch this layer tests — the K-peek exemption fix (`t.closest('.board-cells')` replacing the tag-based block, per the wave's item 2) only ever executes *inside* the `'k'`/`'K'` conditional; it shares no code path with undo. (b) `preventDefault()` called in layer 2 does not call `stopPropagation()` — nothing in this codebase's keydown chain ever does — so the event still reaches layer 3 afterward; layer 3 is a no-op for `'z'` today and stays a no-op after the K-peek fix, since that fix doesn't touch the `'z'`/`'Z'` codepath at all. (c) `displayValue` in `SudokuCell.vue:58` is a `computed` bound to `:value="displayValue"` (`:154`) — Vue's own reactive patch updates the DOM input's `.value` whenever the composable's `values` record changes, so an app-level undo calling `setCell(pos, prev)` correctly reflows to the visible cell without needing any special DOM-write plumbing; it isn't fighting the "uncontrolled input" pattern the way the *native* browser undo does.

**The real gap found:** the wave text (`synthesis-pass1.md` W6 item 5, and lane 14 verdict 2 / L14's own play-log) frames the undo shortcut as "Ctrl+Z/Ctrl+Shift+Z," but the bug it exists to close was reproduced via **Cmd+Z**: lane 14's measurement table says "Ctrl/Cmd+Z → cell reverts" and verify-14 C4 independently re-confirms the mechanism ("nothing preventDefaults Ctrl+Z, so native `historyUndo` fires" — also written Ctrl-only, same gap present in the critique, not just the original). On macOS, browser-native undo is bound to **Cmd+Z**, not Ctrl+Z (Ctrl+Z has no default browser action on Mac in the general case). A new `onBoardKeydown` case gated on `e.ctrlKey` alone will `preventDefault()` a Windows/Linux Ctrl+Z fine, but will **not** intercept Cmd+Z on Mac — leaving the exact native-undo phantom this feature exists to silence still live on the one platform it was caught on. The gate must be `e.ctrlKey || e.metaKey` (checked live: zero existing code in this repo reads `metaKey` anywhere — `grep -rn "metaKey" web/frontend/src` → 0 hits — so this isn't a "already handled elsewhere" case, it's a clean omission).

A second, smaller implementation note: the new case must gate the `handled = true`/`preventDefault()` path on `e.ctrlKey || e.metaKey` being true, not on the bare key value — a plain `'z'`/`'Z'` keystroke (already harmless today; `handleInput`'s `/\D/g` strip discards it) must not start being swallowed by an over-eager switch case.

### Regression-net context (fresh check, relevant to how much this matters operationally)

```
$ grep -n "keyboard\.\|\.press(\|Tab\|focus(" web/frontend/e2e/*.spec.ts   → 0 hits
```
Zero keyboard-interaction assertions exist in the checked-in e2e suite today (`round9.spec.ts`, `sudoku-interaction.spec.ts`). The only extant verification of K-peek/roving-tabindex/undo-phantom behavior is lane 14's throwaway Playwright play-log scripts, not anything CI runs. W6's own gate line ("one e2e spec per affordance") will be the *first* codification of these behaviors as tests — there is no automated net today that would catch a subtle interlock regression, which raises (not lowers) the importance of getting the placement right the first time, and argues for one shared keyboard-interaction e2e spec that exercises K-peek + roving tabindex + undo *together* in sequence (catches cross-handler regressions a per-affordance spec would each pass individually while still missing an interaction bug), rather than three independent specs authored in isolation.

## Exact wave-spec amendment

Two edits to **T2-W6** in `synthesis-pass1.md`:

**Amend item 5 (Bounded undo):**
> Bounded undo — capped `{pos,prev,next}[]` per game composable, **Ctrl+Z/Cmd+Z/Ctrl+Shift+Z/Cmd+Shift+Z** with `preventDefault` (gate on `e.ctrlKey || e.metaKey`, not `e.ctrlKey` alone — the original phantom repro was Cmd+Z on Mac; a ctrlKey-only guard ships the fix unfixed on the platform it was caught on). Land the new case in `onBoardKeydown` (`SudokuBoard.vue`/`FutoshikiBoard.vue`'s `.board-cells` handler) as a sibling switch case, never in the per-cell `handleKeydown` (Backspace/Delete only, deliberately non-propagation-stopping) or the window-level K-peek handler (`'k'`/`'Escape'` only) — the three layers are keyed on disjoint `e.key` sets and `preventDefault()` doesn't stop bubbling, so this placement is structurally incapable of regressing K-peek or roving tabindex (verified by direct trace of all three handlers at HEAD, not inference). The W6 undo e2e spec should assert Ctrl+Home/End navigation and K-peek both still function with the new case present, in the same spec / same page session as the undo assertions — no automated keyboard e2e exists yet (0 hits in the current suite) so this is the first codification, not a check against a pre-existing net.

**Amend item 6 (Share-on-demand permalink):**
> Share-on-demand permalink — `?board=` base64url written on an explicit act wearing the `SheetWashiLabel` grammar. Requires new branching in `resolveInitialState()`/`parseUrlParams()` (both `useUrlState.ts` files), not a reuse of the existing size/difficulty precedence: (a) `hasUrl` must OR in board-param presence so a board-only URL isn't silently dropped; (b) a `PersistedBoard`-shaped object must be synthesizable from the decoded `?board=` alone (no such constructor exists today — the type is only ever built from `localStorage`); (c) a length/size mismatch between `?board=` and `?size=` must fail closed to the size/difficulty-only path, not render a corrupt board. URL wins over storage on load, per the existing principle; Randomize/Clear drop the param (needs a new `.delete()`-based helper — the existing `syncToUrl` never deletes keys, by design, for the accretion behavior below). **New:** the futoshiki param-accretion quirk (by-design co-existence of `?size=`/`?board_size=`/`?game=` in one URL) generalizes mechanically to `?board=` with zero new code required to reproduce it — confirmed via fresh read of both `syncToUrl`s and `App.vue`'s `setGame` (neither ever `.delete()`s a foreign key). This stops being cosmetic once the accreting value is a board blob rather than a short size token: either have `setGame` strip the outgoing game's `size`/`difficulty`/`board`/`board_size` params on switch, or explicitly own the drag-along in the wave text (currently silent — lane 14's "cosmetic, note only" verdict was written before `?board=` existed as a candidate accretor and should not be inherited unexamined). PWA `start_url` (item 7): no collision with regular link opens — confirmed via inspection of what `start_url`/`generateSW` navigation fallback actually intercept (the document fetch, not `location.search`); pin `start_url: '/'` explicitly in the manifest config as a deliberate line so home-screen-icon launches always take the clean fresh/storage path.

## Deviations from prior corpus

- Lane 14 (line 65) and verify-14 (C6) both describe the resolver's precedence as "already ha[ving] the scaffolding" for `?board=`. That phrasing is not wrong at the level they wrote it (the *URL-wins* principle genuinely pre-exists, verified at `:77-79`) but Pass-3 goes further: the actual code has no path to construct a `PersistedBoard` from URL content and no board dimension in the `hasUrl` gate. Treat "scaffolding exists" as "the principle transfers, the code doesn't" — W4/W6 estimators should budget this as real new branching, not a hookup.
- Lane 14 (line 79) calls the futoshiki accretion quirk "cosmetic, note only." Pass-3 does not overrule that for the *existing* accretors (`size`/`difficulty`/`board_size` — genuinely small, genuinely harmless) but finds it does not extend automatically to `board=` — that's new, not inherited from the corpus.
- No prior lane addressed PWA `start_url` interlocks or the Mac `metaKey` gap at all — both are fresh findings, not corrections of an existing claim.
