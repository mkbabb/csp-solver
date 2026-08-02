# PASS-6 · DESIGN LANE FABLE — THE DOCK: the drawer comes down to portrait

Tree: worktree `wf_3d5e62ba-5c4-1`, base **`abe533c4`** (T5-W4 PASS 5 SEALED), prototype
commit **`2d20ed87`** (this lane's own; the main tree never sees it — the LAND lane re-lands
from this dossier). Angle per charter: **first-principles recomposition** — the phone surface
designed as if the desktop drawer never existed, then reconciled with the estate's grammar.

Artifacts of record, md5-proven:

```
HEAD  dist/assets/index-CNR7uIHYXcjD.js    225,709 B  gzip 85.58 kB  md5 fcd47860cd79640d1134b2ea678d11ad
BASE  dist-p6base/assets/index-BNMQu01IbxTY.js  222,497 B  gzip 84.88 kB  md5 eee2d245c9d813a42507c456d4473484
```

Base = `abe533c4` clean (its 222.49 kB matches the pass-5 seal artifact's size, which is the
expected identity — same tree). Head = base + this lane's five-file diff alone. Delta
**+3,212 B raw / +0.70 kB gzip**. Both dists banked whole per the pass-5 evidence ruling:
`dist-p6head.tar.gz` md5 `349e03e1a1410be3e79befe715ec3912` ·
`dist-p6base.tar.gz` md5 `57e581c87faae63ea3212fb170f8c66a`.

---

## 1 · THE COMPOSITION, FROM FIRST PRINCIPLES

What does a phone player need in hand DURING play? The worksheet (board), the status line
(mark 6's one reserved line — event, not region), the digit entry (the OS keyboard, risen by
cell focus), the during-play verbs (undo · redo · hint · peek), and ONE summons for
everything else. What does the player need BETWEEN plays? The staging (size · difficulty ·
deal), the standing preferences (pencils · teacher's), the occasional acts (clear · fill ·
solve · share). The shipped card ignored that split: it stacked all of it in flow, 51.4% of a
1,132px page — and put the during-play verbs at the very BOTTOM of the stack (play tools at
~1,060px, the hold-to-peek divider at ~760px on a 664px viewport: undo was a scroll away from
the move it undoes).

**THE DOCK.** Portrait <1024, the estate's own fiction translated to the phone's axis: on the
desk (≥1024) the pencil case tucks behind the worksheet's right edge; in the hand (portrait)
it tucks below the desk's near edge — the viewport's bottom. The fold keeps the whole
worksheet and the case's drawn LIP: one strip carrying the during-play verbs and the tongue.
Pull the tongue and the case rises FROM BEHIND its own lip over the lower page; the board
never moves, the page never scrolls.

```
CLOSED — the fold (390×664, measured rects)          OPEN — the case raised
┌──────────────────────────┐  y=0                    ┌──────────────────────────┐
│ @mbabb            ☀ (54) │                         │ @mbabb            ☀      │
│      s u d o k u  ⌄      │  masthead 54–132.22     │  ~~~~ board top edge ~~~ │ ← board peeks
├──────────────────────────┤                         ╔══════════════════════════╗ y=81.84
│ ┌──────────────────────┐ │                         ║ ┌─ new game ──────────┐ ║
│ │                      │ │                         ║ │  size    difficulty  │ ║
│ │    THE BOARD         │ │  board-cells            ║ │  4×4  9×9  16×16     │ ║
│ │    362 × 362         │ │  132.22–494.22          ║ │   [Deal]   dealt ⦀⦀⦀ │ ║
│ │                      │ │                         ║ └──────────────────────┘ ║
│ │                      │ │                         ║ ───────── divider ────── ║
│ └──────────────────────┘ │                         ║ ┌─ pencils ───────────┐ ║
│ a fresh 9×9 — singles    │  reserved line          ║ │ marks  Normal Corner…│ ║
│                          │  504.61–525.41 (20.8)   ║ │ candidates  Off On   │ ║
│      (clear paper,       │                         ║ └──────────────────────┘ ║
│       83.07px)           │                         ║ ┌─ teacher's ─────────┐ ║
╞══════════════════════════╡  y=608.48               ║ │  Off  Ask  Live      │ ║
│ ↶Undo ↷Redo ⚲Hint [peek] │  the case's lip         ║ └──────────────────────┘ ║
│               ﹇controls﹈│  608.48–664 (55.52)     ║  Clear  Fill  Solve  Share║
└──────────────────────────┘  doc=664 · scroll 0     ╠══════════════════════════╣ y=608.48
                                                     │ ↶Undo ↷Redo ⚲Hint [peek] │ lip stays
                                                     │               ﹇controls﹈│ (tongue = close)
                                                     └──────────────────────────┘
```

The choices, each carrying its reason:

- **Overlay, never a push.** The sheet is `position: fixed`; open/close is one composited
  `translateY` on the house glass curve (`--ease-glassGlide`, 520ms — the drawer's own Band-D
  clock). The board's layout size never changes, so the drawer-open re-bake (CH-61's whole
  mechanism: board re-fit → 8 PNG encodes) is **structurally unreachable** — measured at §4,
  zero bakes, zero blocked ms.
- **The lip is the case's own edge, not a new region.** One drawn strip (HandDrawnOutline,
  pose-frozen — no beat enrolment, filter census unchanged 39/39) holding the four
  during-play verbs + the tongue. It is CONTROLS furniture; mark 6's event-not-region law
  governs status, and no status content lands here — the reserved line below the board keeps
  that office, untouched (20.8px, in flow, both gates green).
- **The verbs come UP from the stack's bottom to zero depth.** Undo/redo/hint (coarse-only —
  the panel's own `.play-controls` rule restated) plus the peek hold (the divider's exact
  recognizer, 350ms/10px). Today's peek is a strict casualty of the sheet otherwise: the
  divider rides INSIDE the raised case, where a held peek would lay the answer key over a
  covered board — so on portrait the divider's hold stands down and the lip's chip carries
  it, with the whole board visible above. K-peek (keyboard) untouched (floor 3.4 green).
- **The sheet's interior is the shipped card, unchanged.** Mark 5's cure (two wells + washi
  tape + the zone grammar) carries down whole; nothing the owner marked is re-imported, and
  nothing is re-composed inside the sheet — one tree, T′'s collapse intact (`mobile` gains
  exactly one more deletion to drive, nothing forks). Interior at the case cell: 527px, and
  it does NOT scroll (527 ≡ 527 client) — the sheet holds everything whole at 390×664.
- **Landscape is byte-untouched.** The dock wrapper is `display: contents` outside portrait;
  the sheet flows exactly as shipped. Measured: 844×390 pageVh **2.882 → 2.882, both
  engines** — the HOLD-ratified rung honored, the masthead charter unprejudiced.
- **Transient by design.** The dock opens closed every load (no persistence): the fold IS
  the design, and a persisted-open sheet would resurrect the 1.7-viewport load pose the row
  exists to kill. The desktop drawer's persisted state is untouched (separate machinery).
- **A11y mirrors the rail's contract**, not a new one: `role="region"` named `controls`
  (one string with the tongue's tape), `aria-expanded`/`aria-controls` on the tongue,
  `inert` + `visibility:hidden` at closed-idle (visibility follows the transition
  discretely), Esc closes from within, focus into the panel on open / back to the tongue on
  close (keyboard paths; chromium round-trip banked in `reclosedProbe`). PRM: transition
  none — a same-frame swap.

## 2 · COMPONENT-LEVEL PLAN (existing components, mapped)

| component | role in the dock | change |
|---|---|---|
| `GameScene.vue` | owns the dock: wrapper + sheet (the SAME HandDrawnOutline card subtree, re-homed) + lip + tongue; component-local `dockOpen`/`dockInert`/`toggleDock` (transient, no module state) | +83/−9 |
| `scene.css` | the two poses: base `display:contents` (landscape = shipped flow), portrait fixed dock; the glide transition; keyboard-inset ride; safe-area pad; F6 fade list gains `.dock-edge` | +135/−3 |
| `DockTray.vue` **NEW** | the lip's verbs: undo/redo/hint (coarse-gated) + peek hold (the divider's recognizer, restated) | +190 |
| `GameShell.vue` | fills the scene's new `#tray` slot with DockTray, wired to the same model relays the panel uses | +14 |
| `GameControlPanel.vue` | portrait-only CSS: `.play-controls` stands down (the lip owns the verbs), the divider's hold surface goes `pointer-events:none` + its washi hides (the divider stays as the zone separator) | +22 |
| **untouched** | `useControlsDrawer.ts` · `useFlipGlide.ts` · `DrawerTab.vue` · `App.vue` · boards · `OptionSelector` — the desktop glide engine is not entered by this design | 0 |

Product diff: **+444 / −12, five files, one new.** Land-lane parsimony note, priced: the
recognizer + icon-btn grammar restated in DockTray (~55 LOC) could extract to a shared
`usePressHold` + utility class (−~30 LOC, +1 file); not done here to keep the prototype's
blast radius readable.

## 3 · THE NUMBER — trigger (b), both engines, base→head on this tree

Instrument `rig/covis6.mjs` (pass-5 `f3/rig/covis.mjs` schema, superset). **The base arm
reproduces pass 5's banked table exactly, every cell, both engines** — instrument identity
proven before the head arm is read (`rig/out-covis6-base-{chromium,webkit}.json`).

| cell | base chr | base wk | **head chr** | **head wk** |
|---|---:|---:|---:|---:|
| **390×664 THE CASE** | 1.705 | 1.703 | **1.000** | **1.000** |
| 390×844 | 1.341 | 1.340 | **1.000** | **1.000** |
| 375×812 | 1.401 | 1.400 | **1.000** | **1.000** |
| 430×932 | 1.258 | 1.258 | **1.000** | **1.000** |
| 820×1180 iPad P | 1.212 | 1.211 | **1.000** | **1.000** |
| 844×390 land (HOLD) | 2.882 | 2.882 | 2.882 | 2.882 |
| 1280×800 rail | 1.013 | 1.011 | 1.013 | 1.011 |
| 1440×900 rail | 1.000 | 1.000 | 1.000 | 1.000 |
| 390×844 fine NEG-CTRL | 1.177 | 1.175 | 1.000 | 1.000 |

**pageVh 1.000 / 1.000 at the case cell — the exact 0.705 the price sheet named, because the
gap IS the card.** Every portrait cell lands at 1.000 (`maxScroll` 0 — the page stops
scrolling entirely); both rails and the landscape rung are byte-identical to base. The
NEG-CTRL cell moves by design (the dock's regime is width+orientation, not pointer): a fine
portrait window gets the dock with a tongue-only lip — disclosed at §7 R5, not smoothed.

**Fold census, 390×664 closed** (`out-covis6-head-chromium.json`, foldCensus + dock):
masthead 54→132.22 · board-cells 132.22→494.22 (362px whole) · reserved line 504.61→525.41
(20.8, in flow — mark 6's gates green) · clear paper 83.07 · the lip 608.48→664 (55.52) with
five targets, **all ≥44px floors**: Undo 44×46.75 · Redo 44×46.75 · Hint 44×46.75 · peek
56.69×46.75 · controls 79.47×46.75. Theme toggle overlays top-right as shipped. doc 664 = vh.

**Open state, measured**: sheet 81.84→608.48 (526.64), interior 527 ≡ 527 (no scroll),
board rect **unmoved** (132.22/362 — the no-relayout claim as a rect identity), focus lands
on the panel's first control, pageVh stays 1.000. Reclosed: hidden + inert, focus back on
the tongue (chromium; webkit pointer path lands body — §7 R4).

## 4 · DRAWER-OPEN COST — the CH-61 constraint, measured on the BC rig method

Instrument `rig/dockstall.mjs` — `pass5/BC/rig/stall5.mjs`'s schema (same counters, same
statistics, same closed-first/opened-after guards), re-authored for two arms. Runs banked in
`runs/*.jsonl`.

| arm | engine | reps | blocked600 | worstGap | bakes | toBlob | board box |
|---|---|---:|---:|---:|---:|---:|---|
| **dock open 390×664 DPR2** | webkit | 4 | **0 · 0 · 0 · 0** | 13–25ms | **0** | 0ms (0) | 362→362 |
| **dock open 390×664 DPR2** | chromium | 3 | **0 · 0 · 0** | 9.6–10.2ms | **0** | 0ms (0) | 362→362 |
| desktop rail 1280×810 DPR2 (control) | webkit | 3 | 272 · 273 · 285 | 272–285ms | 8 | 1,585–1,640ms (8) | 662→646 |

The dock's open cost is the **negative-control profile** (pass 5's pin arm read 0ms blocked,
13–14ms worst): no board re-fit → the capture path is never entered → zero encodes, zero
bakes — a structural property, not a tuning. The desktop control arm reproduces pass 5's
286–298ms bill (272–285 here, same session-noise band, same 8-encode shape) on THIS tree —
**CH-61 is untouched in both directions**: not worsened, and not silently claimed cured (the
≥1024 stall remains the chartered upstream row). Harness limit restated from BC5-G1: this is
Playwright-WebKit, not real Safari — but the dock claim survives it, because "0 calls" is
counted, not priced.

## 5 · FLOORS + GATES AT `2d20ed87` — every number from a banked transcript

| gate | result | log |
|---|---|---|
| **a11y.spec.ts (W3 floors)** | **30/30** both engines — 3.2 guardTitle · 3.3 options 5/5 · 3.4 k-peek inside | `logs/floors-a11y-30.log` |
| built-dist lane (6 projects incl. **filter-census ×2**) | **39/39** — the dock adds ZERO live filters | `logs/built-dist-lane-all6.log` |
| goldens (π — nothing re-baselined) | **4/4** · `golden:bytes` PASS, 8 goldens 99.0/110.0 KB | `logs/goldens.log` |
| vue-tsc · prettier · eslint · lint:boundary · vitest | all 0 · **444/41 files** | `logs/gates-static.log` |
| default e2e, full suite | run 1: **250 passed / 23 failed** · run 2: **251 / 22** | `logs/e2e-default-head.log`, `logs/e2e-default-head-TAIL.log` |

The two full runs bound the deterministic red set at **exactly 11 rows × 2 engines**; the
23rd red (run 1 only) is `affordances.spec.ts:155` webkit — pass 5's own flake-class row,
recurring under contention exactly as flake-classed there.

## 6 · THE RE-CUT LEDGER — 11 rows, one class, each with its cure named

Every red is a gate reaching an in-sheet control at a portrait cell without the dock
gesture, or asserting the in-flow world the charter re-scoped. None is a floor.

| # | row | cure at land |
|---|---|---|
| 1 | `drawer.spec.ts:281` "<1024: no tab, stacked panel in flow exactly as today" | **definitional** — the pre-dock world's own gate. Splits: portrait = dock (tongue visible, sheet out-of-flow+inert, board unmoved on open); landscape = in-flow unchanged (the row's own text survives there) |
| 2 | `board-covisibility.spec.ts:143` tally prints once | open the dock before the solve tap; both mounts' population unchanged |
| 3 | `board-covisibility.spec.ts:216` celebration never moves the page | referent swap: `.mobile-board-width` top → `.board-peek-host` top (the card is fixed now; the board is the page-motion witness) |
| 4 | `mobile-affordances.spec.ts:162` play tools ≥44px wired | target the lip (`.dock-edge` buttons) — floors already measured green in covis6 |
| 5 | `mobile-affordances.spec.ts:206` hint two-press | lip's Hint |
| 6 | `mobile-affordances.spec.ts:268` peek washi/44px + Clear beat | peek target = `.tray-peek`; Clear beat behind dock-open |
| 7 | `mobile-affordances.spec.ts:341` Deal dirty-gate | behind dock-open |
| 8 | `mobile-platform.spec.ts:307` keypad seating | controls no longer seat by scrolling: assert the dock's `bottom` ≡ `--keyboard-inset` and the lip's targets clear the band |
| 9 | `zone-grammar.spec.ts:559` teacher's check state | behind dock-open |
| 10 | `font-census.spec.ts:207` ledger both directions | the census's phone arm opens the dock; ledger gains the lip's two new strings (`peek`, `hold` — lowercase latin, inside the Patrick Hand cut) |
| 11 | `visual-regression.spec.ts:630` chip separation ≥6px | behind dock-open |

## 7 · RISKS — enumerated, none smoothed

- **R1 · OS keyboard × the lip.** The dock rides `--keyboard-inset`, so the verbs stay
  reachable mid-entry — but `useKeyboardViewport`'s seat-clear arithmetic doesn't know the
  lip's 55.52px, so a bottom-row focused cell could seat under it. UNMEASURED (no OS
  keyboard has risen against any tree — the standing CHARACTERIZED row). Cure priced: one
  clearance constant in the composable, or the tools stand down at inset>0.
- **R2 · The open sheet covers the board** (top 81.84). Live-reacting settings (teacher's
  Live, candidates On) can't be watched while open; close is one tap/Esc away. The
  two-detent alternative was rejected: a second standing pose, a second motion grammar.
- **R3 · The divider's aria-label is stale on portrait** — it still says "press and hold …
  to peek" inside the sheet where the hold stands down (K's claim stays true). One-string
  fix at land; booked, not shipped here.
- **R4 · WebKit pointer-close focus** lands on `body` (WebKit doesn't focus buttons on
  click, so the reclaim guard — focus-inside-sheet — doesn't fire). Keyboard paths (Enter,
  Esc-from-within) reclaim correctly; parity with the rail's own pointer behavior.
- **R5 · The fine-portrait NEG-CTRL cell moves** (1.177→1.000): the dock's regime is
  width+orientation. A fine narrow window gets a tongue-only lip (tools stay coarse-gated,
  the panel's own rule). Deliberate; the adjudicator should see the cell moved.
- **R6 · The lip is a new standing surface** (55.52px). It is controls furniture — mark 6's
  event-not-region law governs status, and the guard sentence for the land lane is: no
  status content ever mounts on the lip.
- **R7 · Real Safari** has not seen the dock (BC5-G1's limit 1, restated honestly). The
  0-bake claim is structural; the on-device eye rides the standing owner rows (E8/CH-39).
- **R8 · Instrument re-authorship**: dockstall is a re-authored instrument on the BC schema
  (the desktop arm's 272–285 vs pass 5's 286–298 is corroboration, not identity — same
  disclosure class as pass 5's A5-G1 handling).

## 8 · REBUILD-FROM-DOSSIER (for the LAND lane)

1. The whole diff is commit **`2d20ed87`** on branch `worktree-wf_3d5e62ba-5c4-1` (shared
   object store — cherry-pickable from the main tree; the worktree itself is disposable).
   Shape: §2's table (+444/−12, five files, `DockTray.vue` new).
2. Verify after land: `rig/covis6.mjs` both engines (expect §3's table byte-for-byte),
   `rig/dockstall.mjs dock webkit` (expect 0 blocked / 0 bakes), a11y 30/30, built-dist
   39/39, goldens 4/4.
3. Re-cut the 11 gate rows per §6 — born-RED discipline: each re-cut row must red on the
   base dist (`dist-p6base.tar.gz`, banked) before it greens on head.
4. The land ships with R1's clearance constant and R3's label fix if the lead charters
   them into the same change; both are one-line class.

**U-10, kept verbatim: nothing here closes mark 3, 5 or 6.** This dossier lands the work
and the evidence — the number the owner's mark named (pageVh 1.000, board whole, verbs in
hand), on the estate's own drawer grammar, with the stall not worsened and every floor
green. The marks close only on the owner's re-look.
