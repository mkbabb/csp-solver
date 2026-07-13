# r5-quiet-pass-3 — the CLOSING quiet-pass (round 5)

Read: audit-context, full registry (through round-4), and skimmed the r1/r2/r3/r4/x corpus so I
knew what every prior lane had already named. Then one genuinely fresh hunt: eight angles NO report
has touched, each probed against app HEAD `65425697` (master) and pencil-boil `0.8.1`. NO source
edits; :3001 untouched; no bare `npm run lint`.

The prior sweep (r4-quiet-pass-2) came back QUIET with two P3 residue notes. The bar for closing is
two consecutive effectively-quiet passes. This pass is **NOT quiet**: one fresh, anchored P3 defect
that no prior round named — a confirmation that asserts success it never verified.

---

## The eight fresh angles

### 1. Share "copied!" confirmation is decoupled from clipboard success — **NEW FINDING (P3)**
The share act is split across two components and the confirmation is **optimistic**:

- Parent does the actual copy and swallows failure silently:
  `SudokuGame.vue:64` — `navigator.clipboard?.writeText(url).catch(() => {})`
  (twin: `FutoshikiGame.vue:63`, identical).
- Child flips the confirmation label **unconditionally**, immediately after `emit("share")`, with
  no await, no gating on clipboard availability or resolution:
  `sudoku/ControlPanel/ControlPanel.vue:120-128` — `onShare()` sets `shareConfirm.value = true`
  right after `emit("share")` (twin: `futoshiki/ControlPanel/ControlPanel.vue:109-110`).
- The label is rendered as visible text **and announced to assistive tech**:
  `ControlPanel.vue:319/449` — `:aria-label="shareConfirm ? 'Link copied' : 'Share board link'"`;
  `:323/453` — the washi label flips to `"copied!"`.

**Mechanism (confirm-without-verify / optimistic-confirmation):** the `?.` short-circuit means that
when `navigator.clipboard` is **undefined** the write is a silent no-op; the `.catch(() => {})`
means that when `writeText` **rejects** (insecure context, a `permissions-policy: clipboard-write`
denial, an unfocused document, or Firefox configs that gate async clipboard) nothing was copied — yet
in every one of these branches the UI still says "copied!" and the button's accessible name still
announces **"Link copied"**. It's the write-side mirror of FAM-13's decode-side
"corrupt share-link degrades silently."

**Why P3, not higher:** on the live HTTPS deploy (`sudoku.babb.dev`) with a real click gesture,
`writeText` resolves, so there is **no live trigger in the prod happy path**. And the address bar
carries the `?board=` link regardless (`shareBoard()` does `replaceState` before the copy — the
in-code comment at `SudokuGame.vue:59-61` states this explicitly), so no shareable data is actually
lost. The defect is a **latent lie in the failure branch**: the visual + AT confirmation asserts a
clipboard success it never checked. Real debt with a named cost (a screen-reader user in a failing
context is told the link was copied when it wasn't), no prod-path trigger. Folds into **FAM-13
robustness/share-truth** as a new distinct member — no new family.

**Repro recipe (no source edit needed):** in a context where `navigator.clipboard.writeText`
rejects or is absent (e.g. serve the built `dist/` over plain `http://` on a LAN IP, or deny
clipboard-write via a Permissions-Policy header, or run in a sandboxed iframe), click Share: the
address bar updates, the clipboard stays empty, and the button still flips to "copied!" / announces
"Link copied". The two `catch(() => {})` sites and the unconditional `shareConfirm.value = true` are
the proof by inspection.

### 2. Undo/redo bounds + pointer correctness — CLEAN
`shared/useUndoHistory.ts` — `UNDO_CAP = 128`, `shift()` on overflow, `splice()` drops the redo
tail on a fresh fork, pointer always reset to end after `recordEdit`. `undo` decrements-then-reads,
`redo` reads-then-increments — standard, no off-by-one. Given-cell immunity is structural (a pristine
given is never a recorded target). Bounded memory, no leak. First bounds/correctness cert of this
composable.

### 3. Conflict derivation (both games) across every board size — CLEAN
`sudoku/SudokuBoard/conflicts.ts` — box index `floor(row/sub)*sub + floor(col/sub)` yields 0..N-1
for 4×4 (sub 2), 9×9 (sub 3), 16×16 (sub 4); `boxes` array length matches `boardSize`; duplicate
buckets marked correctly. `futoshiki/FutoshikiBoard/conflicts.ts` — Latin square (rows+cols, no
boxes, correct divergence) PLUS inequality violation `a <= b` on `[gt, lt]` pairs with both endpoints
filled — the strictly-greater semantics are right. `firstRow` 1-based. No off-by-one at any size.

### 4. Dynamic document.title — CLEAN (one cosmetic nit, not logged)
`App.vue:50` — `document.title = \`${g} — CSP Solver\`` updates per active game, so the tab is NOT
stuck at the static `index.html:6` "Sudoku - CSP Solver". Minor cosmetic-only: the static title uses
a spaced hyphen while the runtime title uses an em-dash, and there's a one-frame FOUC before mount —
preference-level, below the finding bar, not logged.

### 5. Worker error handling — 'error' covered; 'messageerror' unhandled (NOT elevated)
`sudoku/solver/useSolver.ts:73` (twin futoshiki `:55`) wires `addEventListener('error', …)` which
rejects every in-flight `pending` on a worker-level failure — sound, and separate from FAM-13's
already-named worker-no-respawn (the singleton isn't nulled). What is NOT wired is `messageerror`
(a structured-clone **deserialization** failure fires `messageerror`, not `error`), which would leave
the matching `pending` promise unresolved forever. But the worker only ever posts plain
number/string/array payloads (`SolverResponse`), so a deserialization failure is not reachable in
practice — pure defense-in-depth, a re-book of FAM-13's "worker request shape unvalidated" flavor.
**Not elevated to a finding.**

### 6. Drawer focus management (open/close) — CLEAN
`shared/useControlsDrawer.ts` — `reclaimFocus()` (`:317-324`) moves focus to the tab only when the
rail actually contains `document.activeElement` on close (no focus theft otherwise); `focusPanel()`
(`:326-332`) focuses the first tabbable on open; `drawerInert` (`:366-368`) makes the closed-idle
rail `inert` so there are no invisible tab stops; `retarget()` reclaims focus on mid-glide reversal
to close (`:310`). Coherent focus contract. First focus-management cert (FAM-10 named only contrast /
outline-none / reflow / target-size).

### 7. CI gate masking (continue-on-error / `|| true` / `exit 0`) — CLEAN
Grepped all of `.github/workflows/`. The ONLY failure-swallow is `twiggy top -n 25 "$WASM" || true`
(`ci.yml:340`) — a diagnostic print, not the gate; the actual raw-size budget below it (`:343-348`,
fail >240 KB) uses `set -euo pipefail` and a real `exit 1`. No lane carries `continue-on-error`,
`if: false`, or a bare `exit 0`. The known vacuous greens (iai run1==run2, visual-regression
no-compare) are already booked in FAM-1; I found no NEW masked lane.

### 8. Git-tracked build artifacts / bloat vector — CLEAN
`git ls-files` shows no `dist/`, no `tsconfig.tsbuildinfo`, no `test-results/`, no `*.wasm` tracked
under `web/frontend`. On-disk `dist/` and `test-results/` are untracked. The PNG-bloat vector
(FAM-15) is a separate, already-named tree; no additional tracked-artifact leak here.

### Free-hunt tail
- **Console noise in prod:** only four `console.debug` calls, all in the two `prewarm()` paths
  (`useSolver.ts` sudoku `:107/:112`, futoshiki `:88/:93`) — debug-level, cold-start diagnostic,
  acceptable. No stray `console.log`.
- **DigitPad 16×16 entry:** the `DigitPad.vue` tray renders `boardSize` keys (up to 16) so hex A–G
  values are enterable by tap; the typed-input override friction on 16×16 (`SudokuCell.vue:114`, a
  two-digit value can't be overwritten in place without Backspace first) is UX preference, below
  the bar — not logged.

---

## Verdict

**NEW-FINDINGS.** One fresh, anchored P3: the share "copied!" confirmation (visual + `aria-label`
"Link copied") fires unconditionally, decoupled from the silently-caught `navigator.clipboard`
write — a confirm-without-verify latent lie in the clipboard-failure branch, folding into **FAM-13**
(share-truth), no new family, no live trigger in the deployed HTTPS+gesture happy path.

The other seven angles all HOLD, adding three CLEAN product certifications no prior round made
(undo/redo bounds, drawer focus contract, CI no-masked-lane) plus reconfirms of conflict-derivation
and dynamic-title truth. Honest call: this is not a clean-quiet pass — the share-confirmation gap is
a real defect with an anchor, not a preference, so I decline to certify QUIET.

### family_hint
- `optimistic-confirmation` (confirm-without-verify; folds to FAM-13 robustness/share-truth)
