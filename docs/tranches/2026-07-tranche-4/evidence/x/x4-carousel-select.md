# Lane x4-carousel-select — the game-select carousel (a sketchbook, not a store)

DESIGN LANE · Fable + frontend-design skill invoked · EXPANSION (research/design/spec; NO source edits).
Answers owner asks **M9** (a game-selection screen that transforms the extant board into a carousel of games, a la the Wii Shop, within our idioms, game-agnostic) and provisions the frontend half of **M8** (a third game — crosswords — drops in). KISS is the razor; the pencil idiom is the law; game-agnostic is the bar.

Verdict: **BUILD, four waves.** The choreography is not new grammar — it is the **fusion of the two house grammars already shipped**: the drawer's classic-FLIP-on-WAAPI glass glide (the board *scales into a card*) and the page-turn's `sequence`/draw-in beats (the sibling cards *deal onto the desk*, the game *seam* hides under the folded card). The only genuinely new architecture is a **game registry** — and that is a bar the app must clear anyway for M8. Everything downstream reads the registry, so a third game is a data row, not a code fork.

---

## 1. The house ledger I am bound by (studied at anchor)

Two grammars are load-bearing; the carousel reuses both rather than inventing a third.

**Grammar A — the page-turn (`web/frontend/src/App.vue:52-126`, `games/shared/scene.css:115-143`).** A game switch is *erase → seam → draw-in*, all on the ONE pencil-boil rAF chain as one-shot `sequence` subscribers; fades are compositor-only CSS. Two refs split intent from paint: `game` (selected, truthful at click) vs `scene` (mounted, flips at the seam, `App.vue:68-71`). The **seam** is the moment the outgoing scene finishes erasing and the `v-if` flips to the incoming one — *the paper never changes, only the ink swaps* (`App.vue:106-114`). PRM branch: same-frame cut, no beat-1 hold (`App.vue:91-94`). Async futoshiki is warmed on picker-open (`App.vue:119-126`). **The covenant** (`App.vue:60-67`): no second animation brain — re-adopting keyframes.js is a rejected capability-gap fix; both animated halves ride the one clock.

**Grammar B — the drawer glide (`games/shared/useControlsDrawer.ts:156-298`, `scene.css:29-87`).** Classic **FLIP on WAAPI**: read FIRST rects on a clean tree, land the layout class ONCE at onset (one forced layout), read LAST rects, then every mover rides one `element.animate([{transform:from},{transform:to}])` with `composite:replace, fill:none` on **ONE glass curve** `cubic-bezier(0.32, 0.72, 0, 1)` @520ms (`pencilConfig.ts:129-141`, `MOTION.curves.drawerGlide`), **one clock** (all movers pinned to the same `startTime`, `useControlsDrawer.ts:267-268`), **zero stagger**. Explicit keyframes have no "previous committed style," so the phantom-teleport bug class is structurally unreachable (`:173-187`). Mid-glide re-click retargets by `anim.reverse()` (`:300-313`). Settle clears finished anims only — **no layout, no re-raster, no snap** (`:278-298`). **The crit kill, kept:** the filtered board's *layout size* is never tweened — it transform-`scale()`s (`hostScale = firstH.width / lastH.width`, `:222-228`); exactly one raster per gesture. PRM: same-frame swap (`:347-351`).

**The idle-paint soul gate (`pencil/composables/boilBeat.ts`, `pencilConfig.ts:105-150`).** The whole T3 campaign fought idle paints to zero. Every perpetual boil derives its frame from ONE shared beat counter via `useBeatFrame(count, beatsPer)`, ref-counted, PRM-frozen, tab-parked. **Any card that boils MUST enrol through this beat, and off-center cards MUST enrol nothing** (frozen on pose 0) — else the gallery re-introduces exactly the N-sparse-writers disease a1 eliminated. This is the hardest constraint on the design and the sharpest acceptance gate.

**The architecture boundary (`App.vue:11-16`, `HandwrittenLogo.vue:18-33`).** Pencil never imports games — the id + option list arrive as props, the choice comes back via `@select`. The carousel must preserve this: `GameGallery.vue` takes `GameCard[]` as a prop and emits `@select`; it imports nothing from `games/**`. ESLint boundaries enforce this (per MEMORY).

**No router.** URL truth is `?game=` via `history.replaceState` (`App.vue:80-88`); `grep` confirms zero `vue-router`. The gallery is a **view over the same app**, not a route — keep it that way (KISS; the no-router choice is deliberate).

**Retirement in scope.** `useGameMenu` (`HandwrittenLogo/useGameMenu.ts`) is consumed ONLY by `HandwrittenLogo.vue` (grep-confirmed; also re-exported by `pencil/chrome/index.ts`). Its listbox-dropdown is the *current* 2-item game picker. The gallery supersedes it — clean-break retirement (M2: no dual game-select paths). `OptionSelector.vue` is a **generic** selector (size/difficulty) and STAYS.

---

## 2. The market reference — Wii Shop, and modern carousel a11y (cited)

The owner's reference is **spatial browse + gentle chimes-class delight, NOT the store's chrome.** What to take and what to leave:

- **Wii Shop / Wii Menu grammar** was icon-driven, large intuitive tiles, a *select-a-tile → zoom-to-detail* motion, and a signature per-interaction sonic/motion delight (the Totaka loop; tile hover pops) — designed for family accessibility ([Wikipedia — Wii Shop Channel](https://en.wikipedia.org/wiki/Wii_Shop_Channel), [Wii Menu — HandWiki](https://handwiki.org/wiki/Wii_Menu)). **Take:** spatial tiles, one focused item that "wakes," a browse-then-commit two-step. **Leave:** the chrome, the storefront metadata slab, and **audio** — this app has no sound engine; adding one is scope creep and an a11y burden. Our chime is *visual*: the snapped card's boil blooms one wobble cycle + draws its scribble underline (§6).

- **Carousel accessibility (W3C APG + Chrome 2025).** Our surface is a **single-select chooser** laid out spatially, so it is closer to a **listbox** than the APG rotating **carousel**; we borrow from both. Container `aria-roledescription` / label; each card a `group`/`option` with `aria-label="sudoku, 1 of 2"`; every control a native `<button>`; visible focus ring; announce the snapped card `polite`; **make off-screen cards `inert` and flip only the snapped card interactive** — the modern CSS-scroll-snap + `interactivity: inert` + `scroll-state` container-query pattern maps 1:1 onto our "only the center card is live" rule ([W3C APG — Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/), [Chrome for Developers — Make accessible carousels](https://developer.chrome.com/blog/accessible-carousel)). This is a **happy coincidence: the a11y-correct "only the snapped slide is interactive" is the same rule as the perf-correct "only the snapped card boils."** One rule, two payoffs.

- **Keyboard/snap.** APG carousel keyboard set (prev/next arrows, select, Home/End) + `scroll-snap-type: x mandatory` for touch inertia; CSS `scroll-behavior` cannot take a custom cubic-bezier, so programmatic (keyboard/button) steps animate a transform on the track via WAAPI on the glass curve, with snap enforced at settle — the drawer engine, verbatim ([W3C APG — Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)).

---

## 3. Design thesis — leafing through a sketchbook

The failure mode to avoid: a glossy app-store shelf. The pencil soul demands the metaphor be **a desk with loose worksheets, or a sketchbook opened to a spread of thumbnail sketches.** Concretely, every decision below serves that read:

- Cards are **paper worksheets** (the same `HandDrawnOutline` frame + `cartoon-shadow-md` + `bg-card` as every card in the app), not chrome tiles. The center card's face IS a live boiling mini-board; flanking cards are the *poster* sketch of their game.
- Motion is **graphite, not glass-store**: the entry is a worksheet folding down onto the desk and its siblings being *dealt* beside it (drawn-in with the pencil, `DRAW_IN_PRESETS.gridFrame`), never a slick slide-up.
- The "chime" is a **pencil flourish** — the snapped card wakes (one wobble bloom) and underlines its own name (`scribbleUnderline`), the same tell the wordmark and OptionSelector already use.
- Off-center cards are **dimmed and slightly smaller, resting on pose 0** — depth *and* zero idle paint, the same gesture.

The test the design must pass (owner's words): *this must feel like leafing through a sketchbook, not a store.*

---

## 4. Game-agnostic card contract — the architecture bar

This is the spine. Today games are hardcoded: `App.vue:35-39` literals `gameOptions` and `type GameId = 'sudoku' | 'futoshiki'`; per-game `v-if`; futoshiki lazy, sudoku eager. To make "a third game drops in" true (M8/M9), introduce a **registry** — the single source pencil reads via props.

```ts
// web/frontend/src/games/registry.ts  (NEW — the ONE source of truth; pencil imports this, never a game)
import type { Component } from 'vue'

export interface GameCard {
  /** URL token + stable id ('sudoku'). Drives ?game=, aria, keys. */
  id: string
  /** Display label — lowercase wordmark register ('sudoku'). Rendered as live <text> by
   *  HandwrittenLogo, so no per-glyph art is required for a new game. */
  name: string
  /** Optional bespoke name glyph; absent → the wordmark's live <text> path (the zero-art default). */
  glyph?: Component
  /** The card sub-label: difficulty/size range shown under the name. Free-form, per game's own
   *  vocabulary (sudoku EASY..HARD; futoshiki N=4..7 — they genuinely diverge, per shared/types.ts). */
  range: { label: string; levels: string[] }
  /** The card FACE — a static, non-interactive, boil-alive poster of the game (the "sketch").
   *  Lazy so a game's art never rides the gallery's own chunk. */
  poster: () => Promise<Component>
  /** The playable scene loader — what App mounts on select (today's per-game v-if targets). */
  scene: () => Promise<Component>
  /** The default game rides the main chunk (sudoku today); others are lazy (App.vue:11-26 asymmetry, kept). */
  eager?: boolean
}

export const GAMES: readonly GameCard[] = [sudokuCard, futoshikiCard] // crosswordCard drops in HERE, nowhere else
```

**The drop-in contract (M8).** A third game is complete when it: (1) pushes one `GameCard` to `GAMES`; (2) ships a `poster` component (a static mini-board — reuse the board renderer read-only with a canned givens snapshot); (3) ships a `scene` loader. **No edit to `App.vue`, `GameGallery.vue`, or any pencil file.** That invariant is Wave A's born-RED gate: register a stub `crossword` card in a throwaway worktree → it appears, navigable and selectable, with zero other diffs.

**Poster vs live face.** On the desk, the **center** card's face is the *live current board* (the actual scene folded into it, state preserved); **flanking** cards show their static `poster`. On snap-to a flank, that game's poster is what you browse; on **select**, its `scene()` mounts for real. This keeps only one live board on the page at any instant — the perf floor holds.

---

## 5. The transform choreography — board ⇄ card among cards

The centerpiece. Built entirely from Grammar A + Grammar B; **no new animation brain** (the covenant, `App.vue:60-67`).

### 5.1 ENTRY — the live board folds INTO the center card (open gallery)

Trigger: the wordmark button (§9 disposition) or a keyboard `g`. Duration ≈ the glass band; the engine is the drawer's FLIP, generalized to a `useFlipGlide` primitive (§8).

1. **Beat 0 — chrome leaves.** The current scene's controls/drawer fade out on the *existing* `scene-leaving` beat (`scene.css:122-134`, 200ms easeInCubic). The board does **not** erase — we are folding it, not discarding it (the one departure from the page-turn: no erase beat on entry).
2. **Beat 1 — the fold (FLIP).** Read FIRST rect of `.board-peek-host`. Land the gallery layout class ONCE. Read LAST rect = the board's slot as the **center card face**. `useFlipGlide` transform-`scale()`s + translates the board from full pose → card-face pose on `MOTION.curves.drawerGlide` @520ms, `composite:replace, fill:none`, one clock. **The board's layout size is never tweened** (the crit kill, `useControlsDrawer.ts:222-228`) — one raster. As it shrinks, the center card's `HandDrawnOutline` paper frame is *already drawn around it* (the frame is the card, the board is its face).
3. **Beat 2 — the deal.** The flanking cards (other games' posters) **draw IN** with the pencil — `DRAW_IN_PRESETS.gridFrame` (`pencilConfig.ts:354-361`) as one-shot `sequence` subscribers, staggered outward from center (±1, then ±2…). They arrive in their carousel rest slots. Reads as dealing worksheets onto the desk. `backwards` fill (never `both`), exactly as `controls-fade-in` (`scene.css:118-126`), so a finished card can't pin itself lit.
4. **Beat 3 — settle.** Clear finished anims (no layout, no re-raster — drawer settle discipline). The center card snaps + takes focus + its boil wakes (one wobble bloom, §6). `useGameGallery` writes `?view=gallery` via `replaceState`. **Idle steady state: only the center card enrols the shared beat; flanks are frozen pose-0** (§1 soul gate).

PRM: no fold, no deal — a same-frame cut to the settled gallery grid (mirrors `App.vue:91-94`).

### 5.2 EXIT — the chosen card unfolds back to a full board (select)

Reciprocal, and this is where the **page-turn seam** re-enters:

1. **Beat 0 — the flanks leave.** Non-chosen cards draw OUT (the erase grammar) / fade, staggered inward.
2. **Beat 1 — the seam, hidden under the card.** If the chosen game **differs** from the one entered from, the game swap happens *here* — the center card's face redraws for the new game (the `scene` mounts, `game`/`scene` refs flip at the seam, `App.vue:106-114`) while it is still small and paper-framed. The swap is invisible: paper unchanged, only the sketch on it changes — the exact page-turn promise, now inside a card.
3. **Beat 2 — the unfold (FLIP, reversed).** `useFlipGlide` maps the card-face pose → full board pose on the glass curve; the card frame dissolves as the board grows to fill the page.
4. **Beat 3 — chrome returns.** Controls/drawer fade back in (`controls-fade-in`, 250ms +150ms, `scene.css:118-126`). `useGameGallery` clears `?view` and sets `?game=chosen`.

Selecting the **same** game you came from is a pure unfold — no seam, no swap (a page-turn back to the same page, `App.vue:106` comment).

**Mid-glide reversal** (open then immediately cancel) rides `anim.reverse()` (`useControlsDrawer.ts:300-313`) — velocity-plausible, same curve, free.

---

## 6. The carousel grammar — paper on a desk, boil-alive, glass glide, snap

- **Cards.** Each is a `HandDrawnOutline`-framed paper sheet (`cartoon-shadow-md edge-outlined bg-card` — the app's card idiom, `HandwrittenLogo.vue:203-207`). Face = `poster` (flank) or live board (center). Below the face: the name (wordmark `<text>` register) + the `range.label` sub-line (`Patrick Hand`, the menu-item register, `HandwrittenLogo.vue:359-368`).
- **Depth without paint.** Center card: full scale, full boil, undimmed. Flanks: `scale(~0.9)`, `opacity ~0.62`, **frozen pose 0** (zero beat enrolment). A subtle graphite drop as they recede. Depth is a static transform, not an animation.
- **The per-snap "chime" (visual).** On snap settle, the newly-centered card plays ONE `hoverWiggleDuration` (600ms) wobble bloom (`GLYPH_ANIM`, `pencilConfig.ts:387-390`) + draws its `scribbleUnderline` under the name (`OptionSelector/scribbleUnderline`). One-shot `sequence`, not perpetual — it wakes, then rests. This is the Wii chime, in graphite.
- **Navigation glide.** Programmatic steps (keyboard/button/dot) animate the **track** transform via `useCarouselGlide` (the `useFlipGlide` engine again) on `MOTION.curves.drawerGlide`, one clock, monotone, **zero overshoot** (the spring is dead here too — glass only, per the audit-4 ruling `pencilConfig.ts:129-141`). Duration is a card-step band (~440ms; auditioned by eye at a local preview, NOT :3001).
- **Snap points.** `scroll-snap-type: x mandatory` on the track for touch/trackpad inertia (native momentum). Keyboard/button steps set the transform via WAAPI then let snap pin the rest at settle (CSS `scroll-behavior` can't take our curve — same reason the drawer is WAAPI not CSS transition).
- **Progress tell.** A row of hand-drawn **page pips** (graphite dots, the snapped one inked solid) beneath the carousel — the sketchbook page-number, reusing the boil idiom. Doubles as the mobile position indicator.

---

## 7. Entry/exit state machine — URL truth, the mid-game guard

`useGameGallery.ts` — a module-level singleton, the `useControlsDrawer` pattern (persistent state, one home shared by App + scenes).

```
view: 'playing' | 'gallery'          (default 'playing')
snappedIndex: number                 (which card is centered in gallery)
enteredFrom: GameCard.id             (the game we folded from — the cancel target)

openGallery()      playing → gallery   (§5.1 fold; snappedIndex = index of current game)
snapTo(i)          gallery              (§6 glide; updates aria-activedescendant + live region)
select(id)         gallery → playing   (§5.2 unfold; ?game=id if changed, else pure unfold; GUARD below)
cancel()           gallery → playing   (§5.2 unfold back to enteredFrom, no swap; Esc)
```

**URL:** `?view=gallery` added on open, cleared on select/cancel; `?game=` written on a changed select (via `replaceState`, `App.vue:80-88`). A deep-link to `?view=gallery` lands directly in the carousel (parse at boot like `parseGame`, `App.vue:40-44`). No router.

**The mid-game guard (owner's explicit question: "abandoning a half-solved board asks?").** Today the app strips `?board=`/marks on any game switch with **zero** guard (`App.vue:86-87`) — silent loss. Idiomatic default:
- Selecting the **same** game → no guard (pure unfold, board intact).
- Selecting a **different** game while the current board is **dirty** (`overriddenCells` non-empty, or a solve in flight) → a **light pencil-note ribbon** slides from the chosen card: *"leave this puzzle? your marks aren't saved"* with **keep / leave**. NOT a blocking `confirm()`, NOT a modal (the owner banned modals, T3-8b). Dismiss = stay in gallery on that card.
- A **pristine** board (no user marks) → switches freely, no ask.
This is a **ratify-me default** — it adds friction the app doesn't have today; the owner asked for it to be *considered*, so it is specced but flagged for the ballot (§12). The KISS alternative (never ask; the board is recoverable via the share `?board=` permalink the user could have copied) is the fallback if the ribbon is judged over-built.

---

## 8. Component / state architecture

New (all additive except the two edits):

```
games/registry.ts                         GAMES: GameCard[] — the single source (§4)              NEW
games/shared/useGameGallery.ts            the state machine singleton (§7)                        NEW
games/shared/useFlipGlide.ts              the FLIP-on-WAAPI primitive, EXTRACTED from             NEW  ← M10 distillation
                                          useControlsDrawer's mover engine (:156-313); the
                                          drawer AND the gallery entry ride ONE proven engine.
pencil/chrome/GameGallery/GameGallery.vue the carousel shell — props: GameCard[]; emits @select   NEW
                                          (imports NOTHING from games/**)
pencil/chrome/GameGallery/GameCard.vue    one paper card: HandDrawnOutline + <slot> face +         NEW
                                          name + range sub-line + boil-alive (beat only when snapped)
pencil/chrome/GameGallery/useCarouselGlide.ts  track glide (uses useFlipGlide) + scroll-snap       NEW
games/{sudoku,futoshiki}/*Poster.vue      each game's static poster face (read-only mini board)    NEW ×2
App.vue                                   mount GameGallery when view==='gallery'; own the         EDIT
                                          board⇄card FLIP orchestration (reuses useFlipGlide);
                                          read GAMES[] instead of literal gameOptions/GameId
HandwrittenLogo/useGameMenu.ts + listbox  RETIRE (superseded by the gallery; §1, §9)               DELETE
```

**The M10 win:** extracting `useFlipGlide` collapses the drawer's bespoke mover engine and the gallery's entry transform into ONE primitive — fewer lines, one clock discipline, one place the crit "never tween filtered layout size" rule lives. That is the "architectural transposition for elegance" M2 invites, and it *reduces* net complexity while adding the feature (M10).

---

## 9. Disposition of the current game-select surface

The wordmark-as-dropdown (`HandwrittenLogo` + `useGameMenu` + the listbox pop) is today's picker. Two clean options — **recommend (a)**:

- **(a) Wordmark opens the gallery; retire the dropdown.** ONE game-select surface (M2: no dual paths). The wordmark stays the display + trigger; clicking it folds into the carousel instead of dropping a menu. `useGameMenu` + the `logo-menu-pop` listbox delete. **Counter:** a 2-item carousel + Enter is marginally slower than a 2-item dropdown — but the fold IS the delight the owner asked for, and the cost is one Enter.
- (b) Keep the dropdown for the binary; add a separate "browse all" entry into the gallery, earning its place at ≥3 games. Rejected as a dual path (M2), but the honest fallback if the owner wants the fast binary toggle preserved.

Ratify-me (§12). Default: **(a)**.

---

## 10. Keyboard · touch · PRM · mobile 375

**Keyboard** (listbox-over-carousel, APG-cited §2). DOM focus on the track container; `aria-activedescendant` points at the snapped card (the `useGameMenu` tactic that dodges the board grid's roving-tabindex collision — its own comment warns of exactly this). `←/→` step (glass glide) · `Enter`/`Space` select · `Home`/`End` first/last · `Esc` cancel (unfold to `enteredFrom`). Container `aria-roledescription`, cards `role="option" aria-selected aria-label="sudoku, 1 of 2"`, live region announces the snapped card `polite`.

**Touch.** Horizontal `scroll-snap-type: x mandatory`, native inertia. Tap a flank → snap to it. Tap the center card → select. Off-screen cards `inert` (a11y) — the same nodes that are frozen-pose-0 (perf). One rule.

**PRM** (mirror every existing branch). Entry/exit: same-frame cut (no fold, no deal). Navigation: `scroll-behavior: auto`, instant snap, no track glide. Snap "chime": no wobble bloom (the shared beat is PRM-frozen anyway, `boilBeat.ts`). Everything reachable, nothing moves.

**Mobile 375 regime.** The drawer is ≥1024-only, but the gallery is core everywhere. At 375: **one card per viewport + ~12% peek of each neighbor** (swipe discoverability), card `width: min(80vw, …)`, legible mini-board face, name + range beneath, the page-pips row as the position tell. Entry: the already-centered stacked board folds up into the single centered card (same FLIP, simpler geometry). Tap to select. No hover states (coarse pointer, `useCoarsePointer`).

---

## 11. π / DELTA obligations (what proves each visual claim)

Every row born RED where the defect/feature is live (M6). π = still capture; DELTA = motion/paint trace.

| Claim | π (screenshot) | DELTA (trace) |
|---|---|---|
| Entry fold is ONE board raster | `gallery-entry-filmstrip.png` (0/130/260/390/520ms) | `entry-paint-trace.json`: ≤1 board re-raster; idle paints → 0 at settle |
| Idle gallery is paint-bounded | `gallery-settled.png` | `gallery-idle-paints.json`: only the center card boils (shared-beat cadence); flanks 0 paints/s |
| Snap glide monotone, no overshoot | `snap-step-filmstrip.png` (keyboard →) | `snap-glide-trace.json`: transform monotone on the glass curve |
| Game-agnostic drop-in (M8) | `third-game-card.png` (stub crossword card, throwaway worktree) | diff-of-record: zero edits outside `GAMES[]` |
| Mid-game guard fires correctly | `guard-ribbon.png` | trace: ribbon on dirty+different only; absent on pristine/same |
| Mobile 375 | `gallery-375.png` (one card + neighbor peek + pips) | — |
| PRM cut | `gallery-prm.png` | `prm-entry-trace.json`: 0 tween frames |
| A11y | `gallery-focus-ring.png` | keyboard-only walkthrough + SR announcement log (`sudoku, 1 of 2`) |

Capture on a **self-served preview port**, never the owner's :3001 (hard rule).

---

## 12. Waves (born RED) + open ratify-me rows

**Wave A — the game registry + card contract.** `registry.ts` (`GameCard`, `GAMES`); refactor `App.vue` to read `GAMES[]` (kill literal `gameOptions`/`GameId`); port sudoku (eager) + futoshiki (lazy) as cards; poster components. **RED gate:** a stub third card appears selectable with zero edits outside `GAMES[]`; import-graph gate `pencil/** ↛ games/**` holds.

**Wave B — the carousel shell (static, no transform).** `GameGallery.vue` + `GameCard.vue` + `useGameGallery` + `useCarouselGlide` + `?view=gallery`; scroll-snap; full listbox a11y; the page-pips. **RED gate:** keyboard-only select works; aria/SR announcements correct; **off-center cards 0 idle paints** (DELTA); off-screen `inert`.

**Wave C — the board⇄card transform.** Extract `useFlipGlide` from the drawer engine (M10); wire entry fold + deal + settle and exit unfold + the hidden seam, reusing it. **RED gate:** entry filmstrip; **≤1 board re-raster** (DELTA); glass curve monotone; PRM same-frame cut; mid-glide reverse velocity-plausible.

**Wave D — navigation glide + snap chime + mobile 375 + mid-game guard + retire the dropdown.** The per-snap wobble bloom + scribble underline; the 375 regime; the guard ribbon; delete `useGameMenu`/`logo-menu-pop`, point the wordmark at `openGallery`. **RED gate:** snap-step filmstrip; `gallery-375.png`; guard fires only on dirty+different; the dropdown is gone with no dead imports (knip clean).

**Ratify-me (compile into the ballot):**
1. §9 — wordmark-opens-gallery (retire dropdown) **[default: yes]** vs keep dropdown for the binary.
2. §7 — the mid-game guard ribbon **[default: light-guard on dirty+different]** vs never-ask (permalink is the recovery).
3. §6 — the snap "chime" is visual-only (wobble bloom + underline); **confirm no audio** [default: yes, no audio].
4. §6 — card-step glide duration ~440ms [audition at preview; default within the glass band].

**Cross-lane dependency:** M8 (crosswords) needs the CSP solver to model crossword constraints — a BACKEND question outside this lane. Wave A makes the **frontend** game-agnostic regardless; a crossword becomes purely "register the card + ship poster/scene" once its solver exists. Flag for the solver/scope lane.
