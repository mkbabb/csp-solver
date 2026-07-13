# R3 — Design research: destructive-confirm UX + the "bake a game" partition (E9)

Lane R3 of the E9 triumvirate. Baseline of record = last sealed commit **`7e03c5dc`** (T4-W7
addendum); the W8 marks + W9 border surfaces are **in-flight/uncommitted** (working tree) and
marked as such. This lane writes ONLY here — zero source edits.

Owner's E9 verbatim (`corpus/owner-prompts.md §E9`): conditional confirm for board-destructive
acts *after data is input* (randomize, change board, …); undo robust to ALL user actions; the
three named sub-questions — **does difficulty need undo · should difficulty read as next-game ·
should board-size + difficulty re-design into a "bake a game" staging surface differentiated from
live controls.** R1 (census) + R2 (algorithmics) settle the mechanism; R3 settles the *surface*.

Idiom anchors read this session (committed unless noted): `sudoku/ControlPanel/ControlPanel.vue`
(the Clear two-tap `onClear` :202-217, the `.play-controls` coarse row :392-420/553-581, the
`.icon-btn` 2.75rem grammar :634-666, the coarse `@media (pointer:coarse)` block :704-722, the
transient sublabel `.is-armed` :693-697); `T4-W12-carousel.md` (game-axis carousel + its own
mid-game guard ribbon §7); `T4-WM-mobile-recut.md` (frozen native input + mode-toggle §3, drawer
desktop-only §2, 44px affordance floor); `w6/l3-surface.md` (futoshiki difficulty runtime-only).

---

## 0. The one structural realization the surface turns on

**Once board-size is made arm-not-live (R2 §6), the destructive-confirm inventory collapses from
"every deal/resize/difficulty tap" to a SINGLE act: the Deal commit.** Size and difficulty
selectors become non-destructive *staging* (they mutate nothing but a pending selection), so they
need **zero confirm**. Clear stays its own destructive act. Solve is intentional + undoable. So the
entire confirm surface is **two buttons — Deal and Clear — each a coarse two-tap gated on
`isDirty`.** That is the KISS spine the three owner sub-questions all resolve into, and it is why
the "bake a game" partition is not cosmetic: it is what makes the confirm design small.

---

## 1. CONFIRMATION UX — candidate evaluation against the app's idiom

### The three candidates

- **(a) Extend the shipped Clear two-tap** (`onClear` :202-217): coarse-only arm→confirm, transient
  "sure?" sublabel in crayon-rose, 2.5s lapse re-arms, no dialog. Pinned by
  `mobile-affordances.spec.ts`. **In-house, KISS, zero new machinery** — the user already learns this
  grammar from Clear.
- **(b) Confirm-dialog per action**: a modal keep/leave. **Rejected on precedent** — the owner banned
  modals (T3-8b, corpus §T3-8b: completion "NO modal"); NN/G warns dialogs on routine acts breed
  fatigue ("cry wolf too many times, people stop paying attention"). A dialog also adds a second
  input grammar (a focus-trapped overlay) the WM freeze forbids.
- **(c) No confirm — instant action + an undo affordance** ("board replaced — undo"), the market's
  modern default (Material's destructive-snackbar pattern; NN/G: *"an even better design would
  provide the user the opportunity to undo… preventing errors is better than helping recover"*). The
  robust undo spine (R2) is what makes (c) *possible*. **But the app has no toast system** — a
  snackbar is new grammar against KISS, and the app's transient-feedback idiom is sublabels/washi,
  not toasts.

### RECOMMENDED — (a) + the undo spine, composed as "conditional" belt-and-suspenders

Extend the **Clear two-tap** to **Deal** (and keep it on Clear), **both gated on a new `isDirty`
signal** (R2 §6 — the signal doesn't exist yet; `userEdited` bool flipped by `setCell`/
`toggleUserMark`, reset on deal). Robust undo (R2 §3, now covering randomize/resize/solve) is the
**universal backstop**. This is *literally* the owner's word "conditional": confirm is
**prevention** (first-line, on the dirty board only), undo is **recovery** (anything that slips
through is reversible). Reject (b) outright (modal ban). Reject (c)-as-sole-defense but **adopt its
lesson without its machinery**: the recovery path is already visible — the `.play-controls` Undo
button on coarse, Cmd/Ctrl+Z on desktop — so no toast is needed; a deal never hides its own undo.

### Does randomize still need a confirm if undo covers it? — argued both ways, on the record

**FOR keeping the confirm (the recommendation):**
- The owner asked for confirmation *explicitly*; undo is the *other* half of the same sentence, not
  a substitute.
- **Prevention beats recovery for the exact hazard named** ("partway into a game and accidentally
  hit these buttons… disastrous"). A replaced board destroys the user's *mental* context; recovery
  presumes they notice, know undo exists, and reach it before another tap buries it. NN/G:
  *"preventing errors is better than helping users recover from them."*
- **Undo-of-a-deal is the one fragile path** (R2 §3 sharpest edge): a board node must restore the
  *prior marks* while the `boardGeneration` watch is trying to void them. Making that path the
  *sole* defense is exactly where a KISS bug would bite. The confirm is the belt so we lean on that
  suspender less often.
- Cost is near-zero: dirty-gated, so a **pristine board deals instantly, no nag** (fixes Clear's
  current unconditional arm on a blank board).

**AGAINST (undo-only, the harden lane may still prefer):**
- NN/G: don't confirm *routine* acts. A player who re-deals often reads the arm as friction.
- The two-tap's first tap is *silent* except a small sublabel — a "did it register?" ambiguity that
  can provoke a harder re-tap.
- Once undo is truly robust, a bespoke confirm is extra surface to maintain.

**Adjudication:** the two AGAINST points are dulled by the dirty-gate (routine = pristine =
no-arm) and by the bake-a-game partition (the confirm anchors on ONE deliberate button, not on a
routine flurry). The FOR points are the owner's own words plus the fragile-undo reality. **Keep the
conditional confirm.** If the harden lane still kills it, the fallback is undo-only — never a modal.

### Mobile placement + accidental-tap prophylaxis (the owner's exact fear)

The prophylaxis is **spatial, not just a confirm** — NN/G's *"Dangerous UX: Consequential Options
Close to Benign Options"* is the precise citation. Today the coarse action row packs Randomize /
Clear / Solve / Share shoulder-to-shoulder at `justify-evenly` (`ControlPanel.vue:336-385`), and
`.play-controls` (Undo/Redo/Hint) sits just below — the *destructive* dice is one 44px target from
routine acts. The partition (§2) is the fix: **move Deal UP into the staged "new game" zone, away
from the live-play row**, so a mid-game fat-finger lands on Undo/Hint (benign, or itself the
recovery), never on a board-wipe. Layers, in order: (1) physical separation of the staged zone from
the live zone; (2) the 44px floor already held (WM); (3) the dirty-gated two-tap on Deal/Clear; (4)
undo as the net. Four layers, three of them free.

---

## 2. THE BAKE-A-GAME QUESTION — the owner's three sub-questions, each RECOMMENDED

R2 verified the mechanism (line-anchored): **only `watch(size)` re-deals; `watch([size,difficulty])`
writes the URL only** — difficulty is already armed-not-live; size is the live hazard.

### Q1 — does difficulty need an undo? **RECOMMENDED: NO.**
A difficulty change mutates the board **nothing** — it writes `?difficulty=` and arms the *next*
Deal (R2 §3, mechanism-verified). There is literally nothing to undo. The honest remedy is not an
undo entry — it's making the **arming legible** (Q2). (Were difficulty ever made live-re-deal it
would fold into a `board/resize` undo entry; it isn't, and shouldn't be.)

### Q2 — should difficulty read as next-game, not live? **RECOMMENDED: YES — and it already IS; only the label lies.**
Mechanically it's next-game today; the UI frames it as a live control, which is the actual defect.
Reframe: size + difficulty sit under a **"New game"** group heading whose selectors read
**provisional** — a worksheet you fill — and **Deal** is the verb that commits them. The moment the
control visibly *stages* rather than *acts*, "next-game" is self-evident with no copy needed.
Precedent corroborates: **NYT** difficulty is a top-menu *puzzle picker* separate from the board
(you choose Easy/Medium/Hard, a puzzle *loads*); **sudoku.coach** splits "generate a difficulty"
from "enter your own" as an up-front mode choice — both treat difficulty as a *start-of-game*
selection, never a live in-board toggle.

### Q3 — board-size + difficulty into a "bake a game" staging surface? **RECOMMENDED: YES.**
Make **board-size arm-not-live** (retire the `watch(size)` live re-deal, R2 §6), so **size +
difficulty become one staged input pair committed by ONE guarded Deal**. This single move resolves
all three sub-questions at once: difficulty needs no undo (nothing live), difficulty reads as
next-game (it visibly stages), and **size stops being a live board-wipe** (census: size is BARE +
live re-deal today — a fat-finger size tap wipes the board with no confirm; the loudest un-guarded
hazard after Randomize). The Deal button is then the *sole* guarded, undoable destructive commit.

### The control-panel partition, in the pencil idiom (staged vs live)

```
┌─ NEW GAME  (staged zone — "bake a game") ────────────────┐
│   Size        [ 9 ][ 16 ]        ← OptionSelector (stage) │
│   Difficulty  [Easy][Med][Hard]  ← OptionSelector (stage) │
│   ┌──────────┐                                            │
│   │  Deal ⚁  │  ← the ONE guarded commit (dice re-homed)  │
│   └──────────┘     dirty→ two-tap "sure?"; pristine→instant│
└──────────────────────────────────────────────────────────┘
        ⟨ BoilDivider / hold-to-peek ⟩   ← existing separator grammar
┌─ LIVE  (acts on the current board) ──────────────────────┐
│   Pencil-mode  [Normal][Corner][Center]   (W8 toggle)     │
│   Undo  Redo  Hint        Solve  Clear  Share             │
└──────────────────────────────────────────────────────────┘
```

- **Reuse, don't invent.** The mobile panel *already* groups Size/Difficulty at the top (the
  two-tab `expandedPanel` switcher) and the play-tools at the bottom — the partition mostly
  *formalizes* what's spatially true, then (i) re-homes the dice from the action row up into the
  staged group as **Deal**, and (ii) makes size arm-not-live. The **BoilDivider** (peek surface) or
  the existing `<hr>` is the zone separator — no new divider grammar.
- **Deal is the re-labeled Randomize** (`DiceIcon`, existing `.icon-btn`), not a new control — no
  new input grammar (WM freeze honored). Its washi/sublabel reads "Deal" ("sure?" when armed).
- **Solve / Clear / Share stay LIVE** — they act on the current board (Solve fills it, undoable;
  Clear wipes it, its own two-tap; Share encodes it). Only *board-genesis* (size+difficulty→Deal)
  moves to the staged zone.
- **Desktop** = the same partition inside the drawer card (drawer is desktop-only, WM §2); the
  staged group tops the card, the live controls sit below the divider. **Mobile** = the inline card,
  same order.

### Non-collision with the three live surfaces

- **W12 carousel (game axis).** The carousel selects the *game* (sudoku / futoshiki / game #3);
  bake-a-game selects a game's *parameters*. Orthogonal axes. Bake-a-game lives **inside** the
  per-game control panel — the very surface the carousel folds into a card and back (W12 §5 entry
  fold) — so it rides the fold, never competes with it. **Guard against one confusion:** Deal must
  *not* masquerade as game-select; the wordmark opens the carousel (change game), Deal re-bakes
  within a game (change parameters). Two verbs, two surfaces.
- **W12's own mid-game ribbon (§7).** The carousel already specs a *light pencil-note ribbon*
  (keep/leave, **not a modal**) for abandoning a dirty board on a **game switch**. That event is
  genuinely *less* recoverable than a Deal — a game switch strips `?board=` and history is
  session/board-scoped (R2 §4), so it can't be undone, which *earns* the heavier ribbon. Keep the
  grammars tiered and deliberate: **in-place destructive acts (Deal, Clear) → the two-tap;
  cross-game abandonment (W12) → the ribbon.** Do NOT proliferate a third confirm shape.
- **W6 futoshiki selector (just landed).** Futoshiki difficulty is **runtime-only** — absent from
  its `PersistedBoard`, resets to EASY each mount (`w6/l3-surface.md`; census). A staged difficulty
  that silently resets on reload makes the bake-a-game surface *lie* for one game. **The
  bake-a-game wave must fold futoshiki difficulty into its `PersistedBoard`** (`?difficulty=` +
  localStorage, as sudoku already does) — a W6-residue reconciliation, called out here.

---

## 3. PRECEDENT SCAN (verified this session vs unverified)

| Product | Finding | Status |
|---|---|---|
| **NYT Sudoku** | Undo exists; **no "undo-all."** Difficulty is a **top-menu puzzle picker** (Easy/Medium/Hard), separate from the board — three fixed daily puzzles, not arbitrary generate. Pencil ("candidate") mode is a first-class toggle. | **verified** (search summary) |
| NYT Sudoku | Per-puzzle progress is saved so switching difficulty doesn't destroy work (hence no in-board confirm) | *unverified* — plausible from the picker model, not confirmed this session |
| **sudoku.coach** | Splits **"generate a difficulty"** vs **"enter your own"** as an up-front mode choice; undo/redo present | **verified** (site copy) |
| sudoku.coach | Exact undo depth / any restart-confirm | *unverified* |
| **SudokuPad (Sven)** | Toolbar carries **distinct** Restart · Undo · Redo · Check, plus **corner + center marks** as first-class modes (corroborates our W8 mode toggle) | **verified** (search summary) |
| SudokuPad | Whether Restart confirms | *unverified* |
| **f-puzzles / Penpa+** | Setter tools expose Undo (Ctrl+Z) / Redo (Ctrl+Y) + a "clear/delete all"; setters trust user + undo over dialogs | **partially verified** (Penpa+ shortcuts) |
| **NN/G (design law)** | Confirm for **irreversible / high-consequence**; **prefer undo** for reversible/routine; **don't** confirm routine (dialog fatigue); **"consequential options close to benign options"** is a named danger; *"preventing errors is better than helping users recover."* | **verified** (article fetched) |
| **Material undo-snackbar** | Instant destructive act + transient "Undo" — the market default the owner named as the alternative | pattern **known**; spec not fetched this session — *cite as general* |

**Net read:** the market converges on **(1)** difficulty/new-game as an **up-front, next-game
selection separate from the live board** (NYT picker, sudoku.coach mode split) — direct precedent
for Q2/Q3; **(2)** destructive genesis (Restart / new grid) kept as a **distinct** control apart
from Undo (SudokuPad) — direct precedent for the staged-vs-live partition; **(3)** undo as the
routine safety net with confirms reserved for the high-consequence, irreversible case (NN/G) —
direct precedent for the *conditional* (dirty-gated) confirm rather than a blanket dialog.

---

## 4. A11Y + KISS

- **Confirm is keyboard/SR-clean via the shipped pattern.** The Clear two-tap already swaps
  `aria-label` "Clear board" → "Tap again to clear board" on arm (:350/504) and voices "sure?" as a
  visible sublabel; generalize verbatim to Deal ("Deal a new board" → "Tap again to deal a new
  board"). The two-tap is **coarse-only** (matches Clear) — desktop keyboard users get instant Deal
  + Cmd/Ctrl+Z one keystroke away, which is the correct affordance-cost for a pointer that rarely
  mis-clicks. *(Ratify-me: whether desktop should also arm-on-dirty; default NO, to preserve the
  Clear precedent's coarse-only rule.)*
- **Staged group needs one grouping semantic**, not a new grammar: wrap Size+Difficulty+Deal in
  `role="group" aria-labelledby="new-game-heading"` so SR users grasp that the selectors stage and
  Deal commits. The OptionSelectors keep their existing ARIA; Deal is a plain `.icon-btn`. No live
  region required (KISS) — the group label carries the intent.
- **No second input grammar** (WM freeze): staging reuses OptionSelector chips (existing) + an
  `.icon-btn` (existing) + the two-tap (existing). Nothing new to learn, nothing new to test beyond
  the born-RED gates.
- **Race hygiene rides R2, not R3**: gate keyboard Cmd/Ctrl+Z on `loading` (the one open seam,
  census/R2 §2) and push history entries only after async resolve — a UX concern only in that a
  *clean* undo never no-ops confusingly mid-deal.

---

## 5. Born-RED gate seeds for the tranche-write (design surface only)

1. **Deal confirm.** On a **dirty** coarse board, one tap arms ("sure?" sublabel + `aria-label`
   swap), a second within 2.5s deals, lapse re-arms; on a **pristine** board Deal is instant (no
   arm). *(RED today: Randomize `onRandomize` :188-191 is bare — no arm, no dirty check.)*
2. **Clear confirm dirty-gated.** Clear no longer arms on a blank board. *(RED today: `onClear`
   :203 arms unconditionally.)*
3. **Size arm-not-live.** A size-chip tap stages; it does **not** re-deal until Deal. *(RED today:
   `watch(size)` re-deals immediately, unguarded.)*
4. **Partition.** Deal lives in the staged "New game" group above the divider; Undo/Redo/Hint/
   Solve/Clear/Share below it; Deal is ≥1 target-width from the nearest live control (the spacing
   prophylaxis). *(RED today: the dice sits in the live action row, `justify-evenly` beside Clear.)*
5. **`isDirty` exists + is threaded** as the arm precondition. *(RED today: no `isDirty`/`pristine`
   anywhere in `src/games` — census.)*
6. **Futoshiki difficulty persists.** Staged futoshiki difficulty survives reload. *(RED today:
   runtime-only, absent from its `PersistedBoard` — `w6/l3-surface.md`.)*
7. **A11y.** Staged group `role="group"`+`aria-labelledby`; Deal arm announced; keyboard-only
   Deal/undo walkthrough clean; no modal introduced.

---

## Sources

- NN/G — *Confirmation Dialogs Can Prevent User Errors (If Not Overused)*: https://www.nngroup.com/articles/confirmation-dialog/
- NN/G — *Dangerous UX: Consequential Options Close to Benign Options*: https://www.nngroup.com/articles/proximity-consequential-options/
- NN/G — *Preventing User Errors: Avoiding Conscious Mistakes*: https://www.nngroup.com/articles/user-mistakes/
- NYT Sudoku (undo, difficulty picker, candidate mode): https://sudokunyt.net/ · https://gamlio.com/sudoku-nyt-complete-guide/
- sudoku.coach (generate-difficulty vs enter-your-own; undo/redo): https://sudoku.coach/en/play
- Sven's SudokuPad (Restart/Undo/Redo/Check + corner/center marks): https://sudokupad.app/
- Penpa+ (Undo/Redo shortcuts, delete-all): https://swaroopg92.github.io/penpa-edit/
- In-repo: `T4-W12-carousel.md` §5/§7 · `T4-WM-mobile-recut.md` §2/§3 · `w6/l3-surface.md` · `sudoku/ControlPanel/ControlPanel.vue` · R1 `r1-census.md` · R2 `r2-algorithmics.md`
