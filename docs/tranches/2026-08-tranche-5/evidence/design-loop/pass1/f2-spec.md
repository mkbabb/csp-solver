# F2 SPEC — THE PENCIL-CASE TRAY · pass-1 synthesis

Lane: SYNTHESIS. Sources: `charter-f2.md`, `f2-research.md` (both verified at HEAD `32198688`;
file paths re-confirmed live). All targets under
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.

**Center, resolved**: the drawer content becomes three drawn compartment wells + the existing desk
row; rendered size and ink weight equal rank; Check becomes a four-pose teacher's pen whose
lie-down-on-edit makes the load-bearing same-value re-emit *visible*; everything renders at
perf tiers 0–2 — zero new pose bakes, zero new beat enrolments.

---

## DECISIONS

**D1 — Three wells, not four; the desk row stays bare.**
NEW-GAME well wraps the existing `.new-game-zone` contents (`.control-panel-filtered` +
`.deal-row`); PENCILS well takes Marks; TEACHER'S well takes Check + Candidates. The action row
(Clear·Fill·Solve·Share), `.play-controls`, `KeyboardLegend`, and the peek/divider surface stay
below the tray untouched — the charter's no-relocation refusal, honored (resolves open Q6).
Well = `HandDrawnOutline :stroke-width="2" :outset="6" :radius="4" :pose="0"` (tier 2, frozen,
zero enrolment; soul gate already passed at 0.996) + `SheetWashiLabel persistent anchor="center"`
as the self-label. New washi seeds **13 / 29 / 59** (outside the used set {11,23,37,43,53,71});
ids instance-scoped via the existing `useId()` pattern (two panel mounts per game).
No new wrapper component — three inline uses don't pay for one (parsimony).

**D2 — The BIG die stays `.icon-btn`, first in DOM among icons.**
`DiceIcon :size` 28→**56** (ratio vs the 25.9px difficulty heading: 1.08:1 → **2.16:1**). The
button keeps `class="icon-btn"` and its DOM position → `share-truth.spec.ts:57` nth(4) order
"Deal · Clear · Fill · Solve · Share" holds unedited (resolves C5a). Within the well the die sits
visually right via CSS `order`; the Size selectors stay first in DOM → `focusPanel()` still lands
on a selector, never the board-wipe verb; `useControlsDrawer.ts` untouched (resolves the focus
hazard inside the charter's fence, open Q4).

**D3 — Height pays for the die; deletion is the currency (resolves C5b + open Q1).**
Donors: the "New game" eyebrow heading (washi replaces it), the Marks stanza (heading + row →
object row), the Check + Candidates stanzas (2 headings + 2 rows → one well). 6 `.section-heading`
nodes → 2 (Size, Difficulty — which keep today's register; C2's arithmetic restated: 5 stanzas,
not 7). **Hard rule: measured `.controls-card` scrollHeight at 1280×800 on the built dist must
land < the banked 1026px — net ≤ 0. Estimated is not accepted; the prototype measures.**

**D4 — Check = `TeacherPen`, FOUR poses, seam preserved (resolves C6 + open Q3).**
Poses map the real state machine: `off` → pen away (a drawn **empty pen-slot outline** — deliberate
absence, not a missing object); `on-demand && !proactiveCheck` → capped on the desk (snapshot
decayed); `on-demand && proactiveCheck` → in hand, ink wet; `live` → uncapped, clipped to the
sheet. Interaction stays a 3-target radiogroup (slot / desk / clip, 44px floors) drawn as one pen
scene — **`errorCheckMode` remains a manual prop+emit**; re-tapping the desk when the pen lies
capped is "pick it back up," the same-value re-emit now narrated by the object that visibly lay
down when the edit disarmed it. No `cycleErrorCheckMode`. Candidates rides in the same well as a
small drawn toggle chip (2-state, lowest rank = smallest object).
Plumbing: `:proactive-check` prop — 5 one-line scene bindings (value already in scope at all five)
+ 1 prop on `GameControlPanel` + the well binding.

**D5 — Marks = three `PencilObject`s, the active one lifted.**
New icon-grammar component (24-unit box, `stroke="currentColor"`, stroke-width 1.1–1.8, one
0.5-opacity retrace pass — the `EraserIcon` wear grammar). Three 44px object buttons, radiogroup;
active pencil: static lifted pose (translateY −3px, rotate −8°), a state swap on intent, never a
beat. Absorbs `PencilModeToggle.vue` whole.

**D6 — Perf tiers 0–2 ONLY; the correctly-stated rule (resolves C1 + C8 + open Q5).**
The shipped rule is *no per-beat filter parameter writes and no animated transform on a descendant
of a filtered element* — not "no filters." Wells: tier 2 (filterless geometric bake, pose 0).
Pen + pencils (≥20px): tier 1 static `url(#grain-static)` — the class the whole icon row already
is; below 20px, tier 0 bare (the `CrayonHeart` ladder). Pose swaps are `v-show` opacity flips on
STATE. **Zero new `useRasterStack` consumers** (mark 4 is diagnosed, not cured, at 0.9.2 — baking
is the one thing the tray must not do). Nothing boils → `bakeGrainPoints` stays private; no
pencil-boil change.

**D7 — Settle choreography: sequence subscribers, inside 520ms (resolves C3 + C7).**
Mechanism: `createSequenceSubscription({ delayMs })` (pencil-boil export, confirmed) — never
`useFlipGlide` (one clock, zero stagger by construction). Numbers: onset **40ms**, step **40ms**,
4 movers (3 wells + action row), duration **200ms**, easeOutCubic → last settle 40+120+200 =
**360ms < 520ms** (the gallery's 350ms draw would overshoot to 688; the shorter draw is the cure).
Channel: `opacity` + `translateY(6px→0)` on compartment WRAPPERS only — an ancestor transform of
the layerized `.control-panel-filtered` is a compositor offset; a descendant transform is
forbidden. Keyed to `drawerPhase === "opening"` (GameScene destructures `drawerPhase` — exported
today, unconsumed — and binds it to the RAIL instance only, so the mobile card never double-fires;
resolves open Q7 and the mount-fade collision C3). PRM: snap to settled values, no tween (the
`playChime` pattern). `drawer.spec.ts` mover-count 4 is safe: its collector self-matches only
rail/tab/masthead/peek-host, and the tray never animates the rail element itself.

**D8 — Mobile: objects are the fit, arithmetically (resolves C4).**
The tab-toggle machinery dies — all 83 LOC including the dead `showTabs` n=1 branch (n=2 across
all five shipped games). Below 1024 the tray flows as a 2-col grid: PENCILS + TEACHER'S wells pair
(object targets are 44px squares; two fit a 167px column), NEW-GAME well spans full width (a
monospace 3-option row is deterministically ≈253px — unpairable; it does not pretend otherwise).
**Hard rule: measured mobile scrollHeight at 390×844 ≤ the banked ~476px** — the 2-col recovery
must beat the toggle's height saving or the family's mobile promise is false.

**D9 — Rose discipline (resolves open Q2).**
The pen is the only *filled* `--color-red-ink` object in the card; the Hard heading and the
`is-armed` sublabel stay text-voices unchanged. If CRITIQUE finds three-meanings confusion, the
fallback is retoning the armed sublabel to ink — never the pen.

---

## CHANGE INVENTORY (file → change)

| file | change | LOC ± |
|---|---|---:|
| `src/games/shared/GameControlPanel.vue` (1025) | delete tab-toggle machinery (≈125–150, 338–374, CSS 936–973 = 83); delete eyebrow stanza; re-parent into 3 inline wells (HandDrawnOutline + washi); DiceIcon 28→56 (stays `.icon-btn`, CSS `order`); mount `TeacherPen`+chip and 3×`PencilObject` in place of the two absorbed components; props `proactiveCheck`, `drawerPhase`; settle subscription (~25); 2-col mobile grid CSS | −113 / +120 |
| `src/games/shared/AssistSettings.vue` | **DELETE** | −91 |
| `src/games/shared/PencilModeToggle.vue` | **DELETE** | −47 |
| `src/pencil/chrome/icons/TeacherPen.vue` | **NEW** — 4 static sibling `<g>` poses + slot outline, tier 1, `data-pose` attr for tests | +90 |
| `src/pencil/chrome/icons/PencilObject.vue` | **NEW** — icon-grammar pencil, lifted-pose prop, tier 0/1 | +60 |
| `src/games/shared/GameScene.vue` | destructure `drawerPhase`; bind to rail instance | +2 |
| `src/games/{sudoku/SudokuGame,futoshiki/FutoshikiGame,thermo/ThermoGame,killer/KillerGame,kenken/KenKenGame}.vue` | `:proactive-check` binding ×5 | +5 |
| `e2e/` | the single `.ctrl-btn` reference — retarget only if it addressed Marks (verify in prototype); share-truth untouched by design | 0/±2 |

**Net-LOC sign: ≈ neutral — best estimate +26, band ±50.** Stated honestly: F2 wins on
rank legibility and state visibility, not on subtraction.

---

## PROTOTYPE SLICE (ordered — smallest artifact that can FALSIFY the center)

**Static tray geometry + the live pen. No choreography.** On a branch build: the 3-well layout
with real `HandDrawnOutline` wells + washi, the 56px die in place, draft-fidelity `PencilObject`s,
and the REAL 4-pose `TeacherPen` wired to live `useAssists` state (edit-disarm included). Measure
on the built dist: (a) `.controls-card` clientHeight/scrollHeight at 1280×800 and 390×844 vs
banked 1026/476; (b) idle paint count with the drawer open on the real-Safari rig; (c) pen
disarm→desk legibility by eye. This slice falsifies the three load-bearing claims — the height
budget (D3: unpayable = family dead), the mobile 2-col fit (D8), the Check naturalization (D4).
The settle stagger is excluded: C7 is resolved on paper and cannot falsify the center.

## FAMILY SUCCESS TEST

1. **Height**: 1280×800 scrollHeight < 1026px; 390×844 ≤ 476px; no horizontal overflow at 390px.
2. **Rank**: die glyph ≥ 2:1 vs the difficulty heading; exactly 2 `.section-heading` nodes remain.
3. **Check**: a board edit while armed flips `data-pose` in-hand→desk within one frame; re-tapping
   desk re-arms via the same-value emit (seam intact) — asserted on `data-pose`, not pixels.
4. **Perf**: `grep -rln useRasterStack src/` = 3 files; no per-beat filter writes; Safari rig
   idle paints 0 with the drawer open.
5. **Blast radius**: 8/8 goldens untouched; `share-truth` nth(4) green unedited; `drawer.spec`
   mover count 4 and every mid-glide easing `cubic-bezier(0.32, 0.72, 0, 1)`.
6. **Motion**: last compartment settle ≤ 520ms from glide start; PRM path snaps with no tween.
