# T3-W11 — UI completeness + security

**The A23 completeness rows land, the peek/marks gesture and keyboard shortcuts finally get honest affordances, and the one LOW security finding — a reflected render-DoS through the unbounded futoshiki inequality list — is closed along with the doc-truth drift it exposed.** A23 played the live app as a fresh user and found the app's best moment (hold-to-peek) invisible to touch, keyboard focus falling into an invisible card, and a static title with no `h1`. G8 fuzzed both permalink decoders (33 cases, all fail-closed) and found exactly one real gap. This wave clears the completeness backlog and makes `types.ts:29-30` true by making the code true.

**Dependencies**: ← W9/W10 (the completion + toggle surfaces the UI rows touch land first). **Effort**: M.

---

## Scope

### The A23 UI rows (A23 §B, ranked)

- **UI-4 — the peek/marks gesture is undiscoverable on touch** (the app's best moment, invisible to a whole input class): the mobile hold surface has **no washi label** (`title=` only, and title tooltips don't exist on touch — `ControlPanel.vue:187-191`); desktop's "hold to peek" washi is `opacity:0` at rest, revealed on hover only, so iPad (touch, no hover) never sees it; the hold surface is **14px tall** (211×14 desktop / 335×14 mobile — under any tap floor, visually a hairline divider indistinguishable from the inert SIZE divider). Give the peek an honest affordance: a **persistent washi** (or a peek icon in the icon row) on coarse pointers + a taller hit area.
- **UI-5 — all four icon actions unlabeled on touch**: Randomize/Clear/Solve/Share washi labels are hover-only (`ControlPanel.vue:205,213,223,232`); `aria-label`s exist (SRs fine) — it's sighted touch users who get no text. Labels persistent on coarse pointers, or a confirm beat on the destructive Clear.
- **UI-6 — keyboard focus falls into the invisible attribution card** (WCAG 2.4.7): the closed `.hover-card` is `opacity:0; pointer-events:none` but **not** `visibility:hidden`/`inert`, and `useHoverCard` has no focus trigger (`useHoverCard.ts:1-30`) — Tab stops 3–4 land on the invisible "@mbabb" / "View project" links, focus visibly disappears for two stops. Open on `focus-within`, or `visibility:hidden` + transition, or `inert` while closed.
- **UI-7 — K-peek dead from the grid's resting state + no shortcut legend**: `App.vue:124` guards `K` away when focus is inside `.board-cells` — but a cell input *is* the roving-tabindex resting state, so a keyboard player in the grid presses K and gets nothing. And neither K nor Cmd/Ctrl+Z / Shift+Z (`SudokuBoard.vue:192-200`) is written anywhere — undo/redo has **zero affordance** for mouse/touch. (a) let K work from cell focus (it can't collide with digit entry), (b) a small hand-written keyboard legend or margin note. *(Note: the `App.vue:124` guard consumes the `.board-cells` constant W7 hoists to `games/shared/constants.ts` — this row edits the guard the constant feeds.)*
- **UI-8 — static `<title>`, no `h1`**: `document.title` is "Sudoku - CSP Solver" on Futoshiki too (after URL load and in-app switch, and live); the wordmark is a `<button>` with no heading semantics (`landmarks.h1: []`). Per-game title (`futoshiki — CSP Solver`) + wrap the masthead in an `h1`.
- **UI-9 — "hold to peek" washi collides with the "Hard" option** when it does appear (desktop hover renders the chip overlapping the Hard row's text, `desk-peek-hover.png`): the one moment the affordance shows itself it's broken typography. Anchor the chip to the divider's own box.
- **UI-11 — futoshiki's margin voice is empty on desktop, present on mobile**: desktop `?game=futoshiki` has an empty live region and no status line under the board (`futoshiliki row-regime overlay is the broken leg — MarginNote is "in flow when stacked, overlay in the row regime", `SudokuBoard.vue:411-414`); Sudoku says "a fresh 9×9, medium" everywhere. Reproduce + fix the row-regime overlay; the voice should speak even though Futoshiki v1 has no difficulty (the sparser BOARD SIZE-only panel is correct, but "a fresh 5×5" should render on desktop). *(Coordinates with W9's MarginNote `meta` work — same component.)*
- **UI-12 — mobile SIZE/DIFFICULTY tabs read as headings + the inactive tab hides its value** (low): a subtle affordance on the inactive heading (its current value in small graphite beneath it); 44px targets already honored.

### UI-13 — keep grade-after-Solve + say-it hint, DEFAULT with veto window (R-2i)

Conflict feedback only arrives after a failed Solve (`SudokuBoard.vue:79-84` gates `findConflicts` on `solveState==='failed'` — "the teacher grades actual work"). A23's own text calls this "defensible and on-soul." **Default = KEEP + say-it**: the margin voice hints the model exists the first time a duplicate is present ("mark it and I'll grade"). **The failed-state maroon beat is protected** (A23:96 — a strong coherent beat, must survive any conflict-timing change). **Owner veto window at this wave's gate** — the alternative is immediate conflict marking (mark duplicates at entry time); the default authors the hint, the veto swaps to eager marking.

### Mobile digit pad — build-or-formally-scope (A§2.6)

An on-screen digit pad for touch entry: **build it or formally scope it out** in-wave (the row is ADOPT with a build-or-scope disposition — a decision recorded either way, not left dangling).

### G8-P2 — futoshiki decoder hardening + `types.ts` doc-truth (R-8, the one LOW finding)

G8's single actionable finding: the futoshiki inequality list is **unbounded, adjacency-unvalidated, and un-deduped** → a reflected client-side render-DoS. `decodeBoardParam` (`useUrlState.ts:126-145`) validates each pair only for index range (`0 ≤ a,b < totalCells`), never adjacency/count/duplication; the decoded array flows unfiltered to `useFutoshiki.ts:361` (no cap) → `FutoshikiBoard.vue:104` `caretDescriptors` (one SVG caret per pair — 100k pairs → 100k `<FutoshikiCaret>` nodes → tab hang). A crafted `?game=futoshiki&board=<blob>` with ~100k pairs (decode 17ms; ceiling ~500k at the ~2MB URL limit) freezes a victim's tab on open; non-adjacent pairs render mis-positioned floating carets; duplicates emit duplicate Vue keys.

This **contradicts the documented invariant** at `futoshiki/types.ts:29-30` ("Always orthogonally adjacent — the wire boundary rejects non-adjacent pairs"). The wire boundary does **no such rejection** at HEAD (K47) — so the fix closes a doc-vs-code drift as well as a hardening gap.

- **Fix in `decodeBoardParam`**, before pushing each pair, fail-closed: enforce orthogonal adjacency (`(|a−b|===1 && ⌊a/n⌋===⌊b/n⌋) || |a−b|===boardSize`); cap the total at the maximum adjacent-pair count `2·n·(n−1)` and return `null` past it; dedup.
- **Optional symmetric defense** (both games): cap `raw.length` (reject `board` params beyond a few KB) before `atob`; a strict `/^\d+$/` size guard (G8-P3, closes the `02`/`" 2"` non-canonical leniency).
- **Make `types.ts:29-30` true** — the comment now describes the code.
- **Severity ceiling LOW**: no injection, no pollution, no XSS, no code-exec, no exfil (G8-P1/§4 confirmed the decoders fail-closed on all 33 cases, keys are loop-generated indices never attacker strings, decoded values are escaped numeric text) — the worst case is a reflected tab-freeze requiring the victim to open a hostile link, bounded by the URL limit. Real, cheap, on-mandate.

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W11):

| Gate | Value |
|---|---|
| Headline | probe suite green; `fuzz.mjs` re-run — 100k-pairs / non-adjacent / dup cases now **fail closed** |

Component checks:

| Gate | Value |
|---|---|
| A23 rows | `a23-harness/probe{1,2,3,5}` re-run — UI-4 peek labeled on coarse pointers + taller hit area; UI-6 no focus into a closed card (opacity chain no longer `1,1,1,0`); UI-8 per-game title + one `h1`; UI-11 futoshiki desktop voice renders |
| UI-13 veto | **default = KEEP grade-after-Solve + the "mark it and I'll grade" hint**; the failed-state maroon beat unchanged. Owner may veto to **immediate conflict marking** at this gate — the swap is the `findConflicts` gate condition (`SudokuBoard.vue:79-84`), local, no re-gate of the grading beat |
| security | `fuzz.mjs` re-run: the three new bounded cases (100k-pairs / non-adjacent 0-15 / dup) return `null`; the existing 33 stay fail-closed; `types.ts:29-30` matches the code |
| a11y | no new WCAG regression — focus order clean, tap targets ≥44px (the 14px peek divider raised), reduced-motion honored |
| digit pad | built (touch entry works) OR the scope-out recorded with its rationale |

## Seeds

- [`audit32/A23-ui-completeness.md`](../evidence/audit32/A23-ui-completeness.md) — UI-1…UI-13 with probe evidence + file:line anchors, the a11y spot-audit (§C), the owner-shot ledger (§D), the wave-author notes (§E — probe reproductions for UI-1/2/4).
- [`pass3/G8-security-probe.md`](../evidence/pass3/G8-security-probe.md) — the PASS-with-one-LOW verdict, the G8-P2 finding (decode-path trace, the `types.ts:29-30` contradiction, the fix), the clean bill on decoders/CSP/worker, the `fuzz.mjs` harness.
- [`audit32/f3-completion-metadata.md`](../evidence/audit32/f3-completion-metadata.md) §1.2 — the MarginNote voice topology UI-11 touches (the futoshiki row-regime overlay leg).
- `pass3/fuzz.mjs` — the 33-case decoder fuzz (re-runnable `node fuzz.mjs`), banked in the evidence dir at W0.

## Residual risks

- **UI-13's default executes in-wave** (R-2i) — the veto window is at the gate; the hint is authored on the default, and the swap to eager marking is a one-condition change if vetoed. The maroon failed-state beat is protected either way.
- **`fuzz.mjs` re-run is the wave gate, not a pre-condition** — the harness replicates the HEAD decoder logic; after the hardening it re-runs against the same 33 + the 3 new bounded cases, and green is the fail-closed proof.
- **UI-4/UI-5's "coarse pointer" branch** must not regress the desktop hover affordance (the washi is deliberately hover-revealed on fine pointers) — the fix adds a persistent variant on coarse pointers, it doesn't delete the hover one; verify both input classes.
- **The G8-P2 adjacency check runs per-pair in the decode hot path** — it's O(pairs) with the cap short-circuiting past `2·n·(n−1)`, so a 100k-pair blob rejects near-instantly (fail-closed before the render path); the cap is the DoS bound, adjacency + dedup are the correctness/doc-truth closes.
- **UI-11's fix shares MarginNote with W9's `meta` work** — land the completion-block hoist (W9) first so the futoshiki voice fix targets the merged component, not the twin.
