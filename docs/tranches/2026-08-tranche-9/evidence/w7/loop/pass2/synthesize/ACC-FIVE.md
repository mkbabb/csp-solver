# ACC-FIVE — five crayons, no sixth · pass-2 SYNTHESIS (the spec)

§3 accent family · §4 fill meter · §12 multiplayer chrome · §15 the confirm's face · M07.
Synthesizer: Fable 5.1. Inputs: `../research/ACC-FIVE/README.md` (pass 2, 13 sections),
`../../pass1/synthesize/ACC-FIVE.md`, `../../pass1/critique/ACC-FIVE.md`,
`../../pass1/prototype/ACC-FIVE/proto/acc-five-proto.diff` (7 files, +209/−69), the r0 censuses
(R2 §2–§6, R6), the owner's frames (`marks/m01`, `m09`), the sibling pass-2 records (ACC-GRAPHITE
E readings, ACC-SIX §2/§5/§6, PAL-TIN §7), and the chair's rulings, read first. The
frontend-design skill was invoked; §0 is its two-pass method. Read-only on the product. U-10.

Chair compliance: FRAME_PAD ships at HEAD's `12 / 0` (§6.2 — pass 1's `FRAME_Y_PAD 12` is struck
and every band number is re-read at pad 0); the focus-ring token is read, never written (§6.1 —
the dark arm this family minted in pass 1 is now §6's proposal, cited in §9); `.cell-because`
untouched (§6.11); `filterBudget` stays EXACTLY 9 (§7); three instruments reported MOVED with
diffs already banked at `../research/ACC-FIVE/instruments/README.md`.

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku whose wax is five hand-cut crayons and whose inks are
stock Tailwind (R2 §2: eleven of twenty-two inks verbatim). The family's sentence: every
interactive accent is one of the five crayons at a different pressure; the sixth colour dies.

**Tokens.** Two new hexes per theme, four hexes and two literals die.

| role | token | light | dark | OKLCH h (painted) |
|---|---|---|---|---|
| your hand | `--color-user-ink` | `#026fc4` | `#47a7ff` | 251.2 / 249.4 — crayon-blue's ink tier (Δ 0.17° / 0.07°) |
| the work in progress | `--color-progress-ink` | `#a47903` | `#7d6902` | 83.4 / 95.8 — crayon-gold's ink tier |
| the work done (unchanged) | `--color-gold-star` → `--color-crayon-gold` | `#c99a2e` | `#e5c74d` | 83.7 / 95.2 |
| the solver's glow | `--sparkle-glow-soft` / `-strong` = `color-mix(in srgb, var(--color-crayon-gold) 30% / 60%, transparent)` | | | |
| the teacher's red (unchanged) | `--color-red-ink` | `#d02a52` | `#ff5c7c` | 13.6 / 12.2 |
| the focus ring | `--color-focus-sketch` | **§6's** | **§6's** | 253.3, inside the blue arc |
| RETIRED | `#2563eb`, `#60a5fa`, `#8b5cf6`, the dark alias to `#7c3aed`, `rgba(196,181,253,…)` ×2, the glyph's `#2563eb` fallback, `.solve-success .progress-trace { opacity: 0 }` | | | |

**Type.** Nothing new is drawn in the hand face. Zero rendered-string changes.

**Layout.** Nothing moves. Pass 1 moved the frame 7.63 px; chair §6.2 struck it.

**Principles.** (1) Contrast is bought by lightness at a locked hue, never by a new hue.
(2) Gold has two moments: the work in progress is gold INK, the work done is gold WAX — same
hue, same rect, same seed, one pressure apart. (3) A colour that appears on your hand is yours
everywhere it appears. (4) The confirm's one colour is the one the house already uses for
"stop": the verb and its drawn box, in red, on bare card.

**The review.** The generic cure (brand accent, percent bar, glow, red-tinted button) is refused
on the same numbers as pass 1 (`%` not in the cut, a glow is a filter, a red ground is under
AA). Three pass-1 defaults changed by pass-2 numbers:

- *The 5% red ground under the verb* clears AA by four hundredths (4.549 / 4.540) and the
  hover rule erases the red anyway (`.guard-btn:hover .guard-face` (0,3,0) beats
  `.guard-leave .guard-face` (0,2,0)). The ground goes; the verb and its box carry the red on
  bare card at 4.99 / 6.30 and on the hover ground at 4.69 / 5.08. Remove one accessory (§4).
- *`--color-blue-ink` as a named tier with one alias consumer* is a third name for a colour that
  already has two (`index.css:147-148`). Collapsed (§2).
- *"Gold is earned light … only when the work is done"* stood contradicted by a gold trace at
  the first digit. The law is amended, not dodged (§2).

Nothing here is warm-cream-plus-accent: gold touches two surfaces (the trace, the sparkle) and
both are the one semantic the house already gave it. One memorable thing per surface: BOARD,
the gold ink lifting into gold wax at the win; HAND, crayon-blue's ink; CONFIRM, the verb and
its box in the teacher's red. Everything else is quiet.

---

## 1 · The section finding: the dash law is bounded, and this family takes the cure

The gauge this family recolours does not work in Safari. ACC-FIVE §0 measured the SHIPPED
mechanism (`HandDrawnGrid.vue:476-478`): at p = 0.25 chromium paints 1 run at share 0.228,
webkit 4 runs at 0.921; saturated from p = 0.50. ACC-GRAPHITE's E readings, on the same ring
with the same `1000 1000` @ 750 but the dash declared in CSS, read 0.249 vs 0.251 — identical.
ACC-SIX's bare page with the dash as a presentation attribute read 0.240 vs 0.893. So the law is
BOUNDED: *under `pathLength`, WebKit mis-scales a dash declared as a presentation attribute
(factor `totalLength/pathLength` = 3.966); a CSS-declared dash is engine-identical.* The
population at HEAD: the fill gauge (`:476-478`), the join ring (`:509-511`), and
`DifficultyTally.vue:230-232` on the controls card (§10's, handed).

**Ruling for this family.** "The fill meter explained" cannot be claimed on a gauge that reads
92% at a quarter. The win is safe in both engines (p = 1.00: 1 run, 0.955 / 0.956) but the
family's §4 claim is the whole gauge, so the cure ships in this family's diff rather than being
routed around — and it is ACC-SIX's deletion, taken as a graft: drop `pathLength` from the fill
and join paths and dash in real user units from a pure `poseLengths(frames)` beside
`generateFrameTraceFrames` (`gridPaths.ts:352`):

```
// HandDrawnGrid.vue, fill gauge (join ring identical with joinProgress)
:stroke-dasharray="`${L[f]} ${L[f]}`"
:style="{ strokeDashoffset: L[f] * (1 - progress) }"
```

Engine-independent by construction (no `pathLength` to mis-scale), better normalised (the poses
differ by 2.52 units in 3,965 = 0.064%, so the front moves ≤ 1.6 px on a 2,513-px perimeter —
the ONE declared π on this family's own surface), and the join ring is un-broken in the same
diff. The CSS-declared-dash form is the born-RED instrument's control arm, not the shipped
cure: a fix that depends on where a property is spelled is a trap for the next hand.

The 240 ms dashoffset tween keeps its home (`MOTION.traceFillMs`); the `transition` property
does not care which units the offset is in.

---

## 2 · Tokens (`index.css`), with the comments that must move with them

```css
:root {
  /* your hand: crayon-blue's INK tier. L .536 C .156 h 251.2 (Δ 0.17° off #4a90d9). 5.065 on
     --color-card, 4.945 on --color-background. The 24 var() consumers stand; the peer seam
     (playerIdentity.ts:69) rebinds THIS name per cell. No alias tier above it: T5-W2 2.3 — an
     alias with no consumer is a third name (index.css:147-148) — and every consumer wants the
     BINDING, not the constant (research §4). If §11's mark ever wants the constant, it mints
     the tier THEN, with its consumer. */
  --color-user-ink: #026fc4;
  /* the work in progress: crayon-gold's INK tier. L .603 C .123 h 83.4 (Δ 0.12°). 3.59 over
     --grid-line-color, 3.59 over --color-card at stroke-opacity .95. */
  --color-progress-ink: #a47903;
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-crayon-gold) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-crayon-gold) 60%, transparent);
}
.dark {
  --color-user-ink: #47a7ff;        /* h 249.4 (Δ 0.07°); 7.341 on card. The ONE ink that may not
                                       collapse into its wax: the wax is the ring's (§6) and the wash's. */
  --color-progress-ink: #7d6902;    /* h 95.8 (Δ 0.59° off #e5c74d); 3.22 grid-line / 3.25 card @.95 */
}
@media print                   { .progress-trace { stroke: #000 !important; } }   /* @layer base, beside .grid-line (index.css:910) */
@media (forced-colors: active) { .progress-trace { stroke: CanvasText; } }        /* beside the glyph arm (:947) */
```

**The gold law, amended at `index.css:174-176`** (comment-only, same diff): *"Gold is earned
light. It has two moments on the page: the work in progress is gold INK (`--color-progress-ink`,
one pressure down), and the work done is gold WAX (`--color-gold-star`). One hue, two
pressures; the win is the lift between them."* The violet ledger at `:267-278` and `:403-407`
dies with its token and is replaced by the four ratios above.

**Four more doc sites, comment-only, in three files outside `index.css`** (the blast radius is
stated: `HandDrawnGrid.vue:27-31` the `solveSuccess` prop now pins the stack for a STROKE SWAP,
not a fade; `HandDrawnGrid.vue:598-609` the `.join-pose` rationale — index 2 at 275° is 168° from
gold, its true nearest reserved accent is the blue arc at 22–25°, keep the 0.984 and the 17.7°
figure, move the subject; `index.css:147` and `:186-193` the difficulty-heading tier's subject —
LEFT AS HEAD because the heading-tint retirement is a §1/§10 move this family no longer carries,
§9).

Gold now has THREE tokens (wax · `--color-gold-ink` for verdict text · `--color-progress-ink` for
the trace), three lightness tiers with three measured floors. Said out loud.

---

## 3 · Components and states

**Your digit** (`HandwrittenGlyph.vue:85`): `return "var(--color-user-ink)"` — the fallback dies
(the token is declared in both themes). 5.065 light / 7.341 dark; kin 0.17° / 0.07°. Print and
forced-colours unchanged (`@layer base` beats the presentation attribute).

**The focus ring** (`gameCell.css:246/:248`): §6's. The palette survives every candidate in
MRK-LIVE's pass-2 table — A `#3a7bc4` one value (3.34 worst), B/C `#6aabeb` dark (5.85 worst) —
because each is inside the blue arc 244.4–258.3° this family reserves. It does NOT survive a
ring outside that arc (a sixth accent on the board) or one pointed at `--color-user-ink` (a
peer's colour on a peer's square, `gameCell.css:246` sits inside the cell `playerIdentity.ts:69`
rebinds). Stated as a condition.

**The unit wash**: unchanged, crayon-blue 7% (`gameCell.css:123-125`). Pen, ring and wash are one
hue at three pressures.

**The fill trace** (`HandDrawnGrid.vue:461-480`): gold ink, the §1 cure, FRAME_PAD at HEAD. At 0%
nothing renders; the graphite frame is the empty gauge. The win: `.solve-success .progress-trace
{ opacity: 0 }` (`index.css:598-607`, cured tree) DIES and becomes
`.solve-success .progress-trace { stroke: var(--color-gold-star) !important }` in
`@layer utilities`, with `transition: stroke var(--trace-win-ms) var(--ease-noteWrite)` in the
component (unlayered, so no layer wins over it). The trace STAYS and lifts one pressure into the
wax — measured light ΔL +0.104 (0.588 → 0.692), dark +0.292 (0.540 → 0.832); hue 83.6–83.7 the
whole way. This is the cure for the blocker: the solved frame's own gold lands on `.grid-line`
nodes that are `display: none` under the bake and never paints (`bakedHidden 4 / bitmaps 4`);
the trace is a live pose stack that does. `.solve-success .grid-line { stroke: gold-star
!important }` stays for print. In dark the wax over the warm-grey frame line is 1.07:1 on the
line and 11.48 over the card beside it — the frame line turning gold is the sentence; whether it
reads WELL is the owner's (U-10, crop 2).

**The sparkle** (`GameControlPanel.vue:2081/:2087`): `drop-shadow(0 0 2px var(--sparkle-glow-soft))`,
hover `5px var(--sparkle-glow-strong)`; `transition: filter 200ms var(--ease-standard)` (the `all`
tween fed R2's census a tween frame). Still one filter, 900 px², census 9 / 45,572 unmoved
(ACC-SIX measured it on the dist).

**The confirm's face** (`GameGallery.vue:1455-1461` + the W1 §1.5 ribbon wherever it mounts):

```css
.guard-leave .guard-face { color: var(--color-red-ink); }              /* the ground is DELETED */
@media (hover: hover) {
  .guard-btn.guard-leave:hover .guard-face { color: var(--color-red-ink); }   /* (0,4,0) beats the hover rule's (0,3,0); inside the media block or a coarse pointer gets a stuck red */
}
```

`HandDrawnOutline` strokes `currentColor`, so the drawn box reddens with the word: word and box
in the teacher's red on bare card (4.99 light / 6.30 dark), on the hover ground `--color-accent`
(4.69 / 5.08), box stroke ≥ 3:1 everywhere (4.99 / 6.30). The 8% graphite ground at `:1460` and
its comment clause "plus the 8% ground, exactly as `deal` wears it" die together. `keep`
unchanged (19.45). The mark of arming is the colour and the stroke weight (`strokeWidth 2.5`),
never a ground — coupling 4's candidate wave law, confirmed a fifth time. Reached in both
engines by polling `g → staging-deal → ribbon`; the fine-pointer arm is the deck guard (always
armed on a dirty deck); the board's `Clear` confirm arms only at a coarse pointer
(`GameControlPanel.vue:552-553`) and its gate runs at 393 dpr3 `hasTouch`.

**Multiplayer chrome (§12).** You write and are marked in `--color-user-ink`; peers keep the
walk; the join ring at its shipped 0.984 strokes the arriving ink inward. The reserved arcs
this family states for PAL-TIN (both themes, ±5°, painted): red 7.2–19.2 · orange 59.2–76.8 ·
gold 77.4–100.8 · green 142.0–153.3 · blue 244.4–258.3; 78.3° reserved, 281.7° free. The
40-index painted sweep is PAL-TIN's gate with these arcs cited (11 of 40 light / 12 of 40 dark
within 17.7°; worst i = 28 at 1.19° / 0.44° from your own pen, i = 21 at 4.47° from the red);
this family cannot green it by moving its five tokens and does not ship it as its own. F1: the
board keeps your blue (with PLR-COUNT / PLR-PLACE / both PAL-\*).

**The post-win trace at 2.53:1 on the light card** — booked for the owner, priced: *at the win
the gauge turns to gold wax at 2.53:1 and stays; it is celebration and it is still a
progressbar. Exempt it, or hold the post-win stroke at the ink tier's 3.57 under
`prefers-contrast: more` and let only the box-shadow celebrate?* The hedge is one rule and costs
nothing for anyone who has not asked.

---

## 4 · Copy (M16)

No new string. `aria-valuetext="board N% filled"` stands (W3's). The confirm's words stand.
Comment prose only, in the plain register.

## 5 · Motion (home: `pencilConfig.ts` MOTION)

| constant | value | curve | consumer | PRM |
|---|---|---|---|---|
| `MOTION.traceFillMs` | 240 (names the existing 240) | `--ease-drawOn` | the fill front's `stroke-dashoffset` (real units after §1) | no tween; the offset snaps (beat frozen) |
| `MOTION.traceWinMs` | 500 (names the existing 500) | `--ease-noteWrite` | the trace's `stroke` lift at the win | stroke swaps same-frame |

v-bound as `--trace-fill-ms` / `--trace-win-ms` in `HandDrawnGrid.vue`'s scoped style. No new
constant; the covenant is satisfied by naming. The sparkle's `filter` tween keeps 200 ms
`--ease-standard`.

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; trace 5.09 px stroke; nothing moves.
- Phone 393×699 dpr3: board 365 px; trace 2.92 px; nothing moves; the confirm face ≥ 44 px tall
  (`:1463-1466`, unchanged).
- Light: trace `#a47903` 3.59 / 3.59 (HEAD violet 3.36 / 3.85; worst-of-four 3.35 → 3.57); digit
  5.065; verb 4.99 bare / 4.69 hovered; box 4.99.
- Dark: trace `#7d6902` 3.22 / 3.25 (HEAD 3.46 / 3.07; worst-of-four 3.05 → 3.18); digit 7.341;
  verb 6.30 / 5.08; box 6.30.

---

## 7 · Plan — files in order, what dies

1. `web/frontend/src/pencil/config/pencilConfig.ts` — `traceFillMs 240`, `traceWinMs 500`.
2. `web/frontend/src/pencil/grid/gridPaths.ts` — `export function poseLengths(frames: string[]):
   number[]` beside `generateFrameTraceFrames` (`:352`), pure, polyline arc length per pose.
   `FRAME_Y_PAD` stays 0 (`:339`).
3. `web/frontend/src/assets/index.css` — §2 in `:root` (`:151`, `:278`) and `.dark` (`:372`,
   `:407`); the gold law amended (`:174-176`); the violet ledger dies (`:267-278`, `:403-407`);
   `.solve-success .progress-trace` opacity → stroke (`:598-607`); the two `.progress-trace`
   print / forced-colours arms (`:894-952`); `--sparkle-glow-*` minted.
4. `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — `pathLength` dropped from
   `:476` and `:509`; per-pose dasharray/offset from `poseLengths`; the timings v-bound; the
   win transition on `stroke`; comments at `:27-31` and `:598-609` re-cut.
5. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:85` — the fallback dies.
6. `web/frontend/src/games/shared/GameControlPanel.vue:2081/:2087` — the tokens; `transition:
   filter`. (The `headingClass` retirement at `:186-192` is NOT in this diff: §1/§10's row.)
7. `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:1455-1461` (+ the W1.1 ribbon) —
   red word and box, ground deleted, compound hover selector inside `@media (hover: hover)`,
   the comment clause deleted.
8. Instruments, as diffs (already at `../research/ACC-FIVE/instruments/README.md`; r0 rows
   MOVED): `hue-census.mjs` (roster + alias resolution + the dark slice bounded before
   `@media print` at `index.css:894` — a pre-existing defect that fires at HEAD),
   `consumers.mjs` (roster + `OUT` never defaulting to a frozen path), `handoff-ablate.mjs`
   (the LAYERED ablation arm, kept beside the unlayered one so the no-op stays visible).
9. Hand-offs, not this patch: the five arcs + the 40-index sweep to PAL-TIN; the mark's live
   colour to PLR-SELF (`--color-user-ink` read at the ROOT, never inside a rebound cell);
   `DifficultyTally.vue:230-232` to §10; the heading tint to §10; the focus-ring dark arm to §6.

Dies: `#2563eb` / `#60a5fa` / `#8b5cf6` / the dark `#7c3aed` alias; two `rgba()` literals; the
glyph's fallback; `.solve-success .progress-trace { opacity: 0 }`; `transition: all` on the
sparkle; the violet's ledger comment; `pathLength="1000"` ×2; the guard's 8% ground and its
clause; pass 1's `FRAME_Y_PAD 12`; pass 1's `--color-blue-ink` and its dark focus arm (§6's now).
Born: `#026fc4`, `#47a7ff`, `#a47903`, `#7d6902`. Files: 7 product + 3 instrument diffs.

---

## 8 · Prototype brief (pass 2 builds this)

**Build.** Fresh `git worktree` under the scratchpad; replay `acc-five-proto.diff` MINUS its
`gridPaths.ts` pad hunk, its `--color-blue-ink` hunks and its `headingClass` hunk; then steps 1–7
above. Server: two-line scratch vite config with a private `cacheDir`, `npx vite --config <file>
--host 127.0.0.1 --port 4236 --strictPort` (next free in 4230–4249 if taken); scratch Playwright
config, no `webServer`, `baseURL` :4236; chromium + webkit headless; 1280×800 and 393×699 dpr3;
light and dark. For the filter census and the goldens build the dist INSIDE the worktree (check
W8's flight; never `npm run build` in the main tree). No osascript, no Safari (M19). Kill the
server, verify the port, remove the worktree.

**Every colour read on the board is pixels through a canvas byte read-back**
(`getComputedStyle().color` returns `oklch(...)` verbatim in both engines); every computed-style
read waits out the 150/200/250 ms tweens; the ablation of any `@layer` rule is itself LAYERED
into an earlier layer.

**Numbers that mean success.** G0 four arms (§9) RED at HEAD's arm and ≤ 2 points after step 4
in both engines at p = 0.05 / 0.25 / 0.50 / 1.00, dpr1 and dpr3; the four 1.4.11 ratios on
painted bytes ≥ 3.59/3.59 light, 3.22/3.25 dark, worst-of-four ≥ 3.57 / ≥ 3.18, re-read at pad 0
(the 22 × 246 band; expect the left inset 2.78 px, inside the band); the win: band median L rises
≥ 0.09 AND the post-win computed stroke resolves to `--color-gold-star` through the cascade, at
900 / 1800 / 2700 / 3600 / 5000 ms, both themes, both engines, with the layered-ablation arm
reading ΔL 0.000; digit 5.065 / 7.341 within 0.02, hue within 5° of crayon-blue; verb painted
≥ 4.5 at rest AND hovered, both engines, both themes, box ≥ 3:1; the glow byte-matches
crayon-gold at α .3 in 5/5 chromium runs; `filterBudget` 9 exact, union 45,572 ± 2% desk /
6,673 ± 2% coarse, on the built dist; the paired census under the DECLARED TERM (§9 G9) with the
240–270° bin reported beside; R6 heading census unmoved (this family claims no heading now); R3
wobble probe unmoved; goldens: `cell-light` moves (the pen's ink, ~2,292 px) with its DELTA
declared, `grid-corner-light` 0 px now the pad is HEAD's, every non-board golden 0 px;
`check-copy-register` 0 unadmitted; `check-ink-pressure` green; `check-font-coverage` unchanged.

**Crops** (≤ 4, ≤ 150 KB, cited): (1) the board's top-left 330×210 at fills 5 / 50 / 99 / won as
one strip, light chromium — the centre; (2) the same strip dark — the owner's iso-hue question;
(3) the armed confirm HOVERED, light, both engines side by side — word and box red on the accent
ground; (4) one write of twenty, webkit, after step 4 — one arc where HEAD paints four.

---

## 9 · Gates it lands with (born-RED at HEAD unless marked)

| id | asserts | HEAD |
|---|---|---|
| **G0 dash bound** (section) | bare page, pose-0 `d`, `pathLength="1000"`, `1000 1000` @ 750, four declaration arms × two engines × dpr1/dpr3: painted share within 2 points across engines; and on the LIVE gauge chromium ≈ webkit within 2 points at p = 0.05 / 0.25 / 0.50 | **RED**: attr arm 0.921 vs 0.228; live 0.921 vs 0.228 |
| G1 kinship | R2 rows 1/2 with the five anchors, KIN_DEG 5, painted | RED (`user-ink` 11.5°, `progress-ink` 41.3°) |
| **G2 the win** | band median chromatic OKLCH L rises ≥ 0.09 across the win AND post-win stroke of `.progress-pose.is-active .progress-trace` resolves to `--color-gold-star`; the probe carries live / unlayered / LAYERED arms and the layered arm must read ΔL 0.000 | RED (0 post-win chromatic px at HEAD; pass 1's hue gate greened in all eight arms) |
| G3 print / forced | `.progress-trace` paints `#000` under print and `CanvasText` under forced-colours, both engines | RED (`rgb(139,92,246)`) |
| G4 the verb | armed ribbon: chroma > 0 AND painted ≥ 4.5 on the ground it wears at rest AND hovered, both engines, both themes; box stroke ≥ 3:1; subject-count guard ≥ 1 ribbon per engine | RED (achromatic; and at pass 1 the hover pose lost the red) |
| G5 the digit | painted hue within 5° of crayon-blue AND ≥ 4.5 on card and background, both themes | RED (11.5°) |
| G6 the glow | painted sparkle glow byte-matches a resolved token at its alpha, 5/5 runs | RED (inline `rgba`) |
| G7 no stock hex | `#2563eb` / `#60a5fa` / `#8b5cf6` / `rgba(196,181,253` absent from `index.css` and `HandwrittenGlyph.vue`; `#7c3aed` appears once (`--color-solver-ink-2`, the rainbow's declared exception) | RED |
| G8 alias law | no `--color-*` token whose only consumer is another token (`check-theme-tokens` prints ALIAS-ONLY = ∅), except the two semantic aliases the estate declares (`teacher-red`, `gold-star`) | GREEN at HEAD; RED at pass 1 (`--color-blue-ink`) — a regression guard against the third name |
| G9 paired census | DECLARED TERM: off-family = chromatic px outside OKLCH 40–115° EXCLUDING the 240–270° bin (the pen and the ring, owned by the kinship rows), with the blue bin reported beside as its own number; chromium/webkit light mid ≤ 12%, dark mid ≤ 12%, one named deal | RED at HEAD (the 290–300° violet bin alone exceeds it; exact HEAD figures are the prototype's first reading) |
| G10 guards, GREEN by construction | the four ratios ≥ 3:1 painted and worst-of-four non-decreasing; print/forced arms for the digit; the rainbow's tolls; the peer worst over 40; `filterBudget` 9 + area; `check-font-coverage` unchanged; `check-live-regions` unchanged; `lint:motion` clean | must stay |

The meter-symmetry gate (pass 1 G9, ≤ 0.5 px) is STRUCK from this family: at pad 0 the reading
is pass 1's own control (|T−L| 6.00 px), the row is FRAME_PAD's (chair §6.2), and ACC-SIX found
the residual 1.3 px is the hand (per-pose asymmetry 1.98–2.83 units). The dark-ring ≥ 6.4 gate is
§6's.

---

## 10 · What the owner disposes (U-10), and what the agglomerator must seat

Owner: the dark pen — `#47a7ff` (7.34, pen/ring separation 1.14) vs `#0189e8` (5.12, 1.25) vs
`#0180d8` (4.53, 1.42); whether a gold stripe at the first digit is gold spent early (crop 1
shows the lift); the post-win 2.53:1 (exempt, or the `prefers-contrast: more` hedge).

Agglomerator: the §1 cure is the same primitive ACC-SIX specifies (`poseLengths`) and
ACC-GRAPHITE's tally wants (arc-length machinery) — seat it once in `gridPaths.ts`;
`DifficultyTally.vue` is its third consumer, on §10's card. The heading-tint retirement is §10's.
The guard's ground deletion is coupling 4's law, reached by five families; write it once. The
gold-law amendment and the `.join-pose` rationale re-cut are comment-only and π-neutral.
Nothing closes here.
