# T3-W9 — Design: the gold move

**Gold joins the palette as the fifth crayon, the solve moment brings it down to the page, and the felt heart is promoted from the attribution corner to the reward — landed as ONE coherent statement, not six patches.** F8's verdict: every audited completion defect is a *coherence* defect, and the one token that lies (`--color-gold-star → --color-crayon-green`, `index.css:151`) is the seam. True the token, hoist the completion block, demote the star to punctuation, refine CrayonHeart toward Yoshi's Story craft — and green returns to being merely the EASY crayon. The design story is one sentence: **gold is earned light — it lives in the sky, and only a finished page can pull it down.**

**Dependencies**: ← W7 (the board + scene files the gold paints on land structurally first), ← W2 (the currency/doc-truth batch). Feeds W10 (the sky half consumes the same gold tokens). **Effort**: L.

---

## Scope

### Step 1 — gold as the fifth crayon (F8 §2, F8-amended by F7)

Gold ships as a **real crayon with a two-tier form**, same doctrine as the other four (one light hex, one brighter dark hex, "the paper darkens and the wax glows," `index.css:140-142,205-208`) — **not** a semantic alias onto an existing crayon (that's the current bug's shape). Gold already has a physics no other tone has: **gold is light** — it lives in the sky (sun rays, moon body, stars) and the fiction says it comes to the page only when the work is done.

```css
/* :root — the fifth crayon. Wax tier: strokes, washes, fills, the sticker. */
--color-crayon-gold: #C99A2E;          /* warm ochre — wax on light paper */
--color-gold-ink:    #8C691D;          /* ink tier: gold TEXT (verdict line) — 4.84:1 AA light */
/* .dark — the wax glows */
--color-crayon-gold: #E5C74D;          /* the moon's own outline gold — 11.48:1 on dark paper */
--color-gold-ink:    var(--color-crayon-gold);  /* dark ink collapses into wax; both AA */
/* the alias stops lying */
--color-gold-star: var(--color-crayon-gold);
```

- **Two tiers because every crayon fails AA as light-mode text today** (measured, F8 §6): green `#2DC653` "solved it!" ink is **2.16:1**, the F2 wax gold `#C99A2E` is 2.47:1 — but the board wash and sticker are non-text and live happily at wax contrast; the verdict *line* is `--type-body` (16→22px, `MarginNote.vue:33-36`) and earns a passing ink. `#8C691D` measures **4.84:1** light, dark `#E5C74D` **11.48:1** — both AA.
- **The `.solve-success` stroke + shadow stack needs zero edits** (`index.css:301-309`) — it already `color-mix`es off `--color-gold-star`; truing the alias re-inks the whole success system gold in one token.
- **Red ink tier, same sweep** (`--color-red-ink`, darkened rose ≥4.5:1): teacher-red as verdict text is a near-miss at 4.01:1 (`#E8315B`) — one pattern, applied twice, so the verdict register is AA in **both** tones.
- **PRM gate the success transition** (F2-C, F3 §3.6): `index.css:302` (`stroke 500ms`) + `:310` (`box-shadow 500ms`) lack a `prefers-reduced-motion` guard — close it in this sweep (gate to instant under PRM).

### Step 2 — the completion block, hoisted (F3 §3, kills the collision + the twins)

The star, the verdict, and the tally are **one below-board annotation block**, not three absolutely-positioned strangers. The collision (`solved-star.png` — star through the letters of "solved it!") is structural: two anchor systems (`CelebrationStar.vue:126-134` overlay vs `.board-margin` `SudokuBoard.vue:451-470`) claiming the same corner.

- **`.completion-note`** replaces the loose MarginNote + stat-line pair: `grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: start` — a `[sticker slot]` (3.25rem, `aria-hidden`, `gold-star` tone only, `display:none` when absent so graphite/red states are visually identical to today) beside a `[text column]` of voice (MarginNote, `role=status`) over meta (the tally, outside the live region).
- **`CelebrationStar` becomes `position: static`** in the slot — draw-on + gleam internals verbatim (`CelebrationStar.vue:52-90` sound); only the scoped positioning block `:126-134` changes. Collision impossible by construction in both layout regimes.
- **MarginNote grows a `meta?: string` prop** rendered as the second line **outside** `role=status` (the pencil layer stays derivation-free — meta arrives preformatted, same contract as `text`). Both games **delete their byte-identical `statLine` twins** (`SudokuBoard.vue:296-310` / `FutoshikiBoard.vue:350-363`) — the tone/type/PRM rules live in one file.
- **The tally is always graphite** (F3 principle 2, ratified as system law): gold and red belong to the verdict alone; metadata never inherits tone. Caption rung `--type-caption` (12→16px, dropped two nominal rungs from body — a legible subordination, not a minted off-scale size). Ink-level `color-mix(in srgb, var(--color-pencil-graphite) 62%, transparent)` **replacing** `opacity: 0.7` (`SudokuBoard.vue:482`) — reduced pressure is a property of the ink, not the layer. **Drop `user-select: none`** on the tally (`:483`) — a tally someone leans in to read is one they may copy (MarginNote's own `user-select:none` at `:40` stays; verdicts aren't data).
- Meta present on `solved` **and** `failed` (the search effort of a refutation is honest metadata, never turns red), absent on `solving`/`error`/`idle` — sourced solely from `SolveStats.{backtracks,elapsedMs}`, no new wire fields (F3 §3.4 state matrix).

### Step 3 — F2-C: the board goes GOLDEN, the felt heart crests (F2 Formulation C, F7-amended)

**No modal. The board goes golden, not green. Stars-and-gold. Metadata deft. Heart present, in Yoshi's Story language rendered in OUR pencil grammar.** Every clause of the owner brief, on A's substrate:

- **The board turns gold** — the token truthing (step 1) re-inks the `solve-success` grid lines through the existing 500ms stroke transition and the triple sticker-shadow follows automatically; MarginNote's "solved it!" turns gold with them. Green exits the success register entirely (keeps its EASY-difficulty role, `index.css:130`). *The board turning gold means the frame and margin turn gold — the ink the player and solver wrote never recolors (F8 §3.2). Success is stamped on the page, not rewritten into it.*
- **The star form — inline glyph DEFAULT** (F2-C primary text: "the star demotes to punctuation … the inline star is the subtler read"). A 1.1em inline star SVG *inside* the margin note's text line — `★ solved it! — 0 backtracks — 1ms` — drawn with the existing gold fill/stroke pair, wiping in with the note's 250ms clip-path write-in (`MarginNote.vue:53-65`). In flow, zero subscribers, collision impossible. **Owner veto window at this wave's gate** — the corner-foil-sticker (F2 Formulation A: `top:-1.1rem; right:-0.9rem; rotate:8deg` on the board's top-right, the stronger fiction) is the named alternative; both kill the collision, so no correctness fork rides on the choice (veto mechanics in the gate table below).
- **The felt HEART** (F7, Yoshi's Story in our pencil grammar) — CrayonHeart refined and promoted from the attribution card (`AttributionCard.vue:50`) to the reward. The translation rule: **material through stroke behavior, not texture bitmaps** — felt = plush silhouette + stitch-dash inner stroke + turbulence tooth; craft heft = heavier outline; life = blink/squash on transforms only. No photographic felt, no drop-shadow depth.
  - **CrayonHeart variant family** — one component, `variant?: 'idle'|'celebration'|'blush'|'tiny'` (default `idle`), geometry constants colocated in **`heartPaths.ts`** beside it (the Smile Meter precedent: one mascot, many faces — not four files). **`YOSHI_COLORS` wired** (`pencilConfig.ts:76`, supersedes the A16-K2b kill — F7 consumes it): CrayonHeart's hard-coded hexes import from `YOSHI_COLORS.heart` (+ new `stitch`/`stem` entries; stem/leaf greens from `YOSHI_COLORS.leaf/vine`).
  - **Plush body** (the one geometry change — felt toys have no needle points): `M46 85 C 14 59, 7 35, 17 18 C 27 3, 47 13, 50 26 C 53 13, 73 3, 83 18 C 93 35, 86 59, 54 85 Q 50 89, 46 85 Z` (rounds the near-point at `50 88`). **Stitch line** — the plush path re-used, `fill:none`, inset `translate(7 7) scale(0.86)`, `stroke-width 1.5`, `stroke-dasharray 6 5`, baked `~#8f3a50` (SVG attrs can't `color-mix`). **Outline 3.5→4** = `PENCIL.fruitOutline.strokeWidth` (`pencilConfig.ts:64` — the heart *is* a fruit; the config already agrees).
  - **`celebration` variant = the Heart Fruit** (F7 §3.2): board **bottom-right corner** at crest (~2.75rem, shared Sudoku/Futoshiki like CelebrationStar — the diagonal opposite of the margin text, so the collision class dies by geometry). Additive over `idle`: **stem + leaf** (the earned Heart-Fruit tell — stem `M 50 12 C 49 7, 51 4, 53 2` stroke `#16a34a` 4 round-cap; leaf fill `#22c55e`; viewBox bumped `0 -4 100 104` for this variant only); blush rx 5→7.
  - **Motion — one `sequence` subscriber, ~550ms, delayed to crest** (`delayMs: CELEBRATION.starCrestMs`), transform-only on the **host wrapper** (never the filtered `<g>` — keeps the `#wobble-heart` ±10% region honest, `pencilConfig.ts:204`): scale 0 → 1.12 with the reciprocal-axis squash `scale(1.15,0.92)` → `scale(0.97,1.02)` → 1. *The reciprocal-axis squash is the entire Yoshi bounce.* **Blink** — one `setTimeout` ~1.8s post-settle, eyes grouped, `scaleY(0.1)` for 140ms `transform-origin: 50px 40px`, once. **Murmur participation** — 1-in-8 seeded windows wiggle the heart instead of a cell (`celebration.ts:78-87` hook, F2 §C). New `CELEBRATION` config: `heartCrestMs`/`heartBounceMs`/`heartBlinkDelayMs` beside the star's trio (`pencilConfig.ts:292-295`).
  - **Dark-mode exception** (the F7 re-fold that fixes F8's maroon read): the reward heart does **NOT** inherit the attribution dimming (`CrayonHeart.vue:74-77` `opacity:0.75; saturate(0.85)`) — it stays `#FF4D6D` rosy at crest; only the blush deepens. *The owner's maroon `heart.png` is an idle-register artifact, correct in the ambient attribution corner, wrong for the reward.* The `idle` variant keeps the dimming.
  - **PRM**: celebration mounts static at scale 1, no bounce, no blink; murmur already scheduler-gated (`SvgFilters.vue:16-19` pattern, CelebrationStar precedent `:61-65`).
- **Subscriber budget**: celebration adds 1 transient `sequence` (bounce) + 1 `setTimeout` (blink); inside the chains=1/subscribers=10 envelope. The ≤3.2s crest cap holds (heart settles ~3.2s, blink is post-crest ambient).

### UI-10 — solved-rainbow deepening (A23 UI-10, design-resolve)

Solver-filled digits render as pastel rainbow strokes dropping to ~1.3–1.5:1 on the cream light paper (`desk-light-solved-board.png`; crisp on dark) — the payoff of "watch it solve" washed out in the default theme. Deepen the light-theme solver-ink register (`SudokuCell.vue:71-85`) so the solved digits read at contrast; **solver-ink stays board-content-only** (F8 §3.2 — never chrome, never a metadata tone). Values stay readable via inputs/aria today, so this is legibility-of-the-moment, not data loss.

### The failure grammar — what must NOT turn gold (F8 §3.2, system law)

Enforced across every touched surface: **the laminate** (`.sheet-laminate`, `index.css:266-276` — it's *looking up the answer*, the act the reward economy defines itself against; hard no, stays milk-and-pencil-edge) · **the washi label** (`SheetWashiLabel.vue` — tape is stationery, stays neutral) · **the tally line** (graphite regardless of grade) · **difficulty chips** (MEDIUM is crayon-orange `#F4A236`, measured **1.24:1 against the gold candidates** — chromatically near-identical; the grammar that keeps them legible is spatial + material: gold only post-solve, always accompanied by its material — foil sticker/wash/verdict — never a bare chip; **no gold difficulty tier, ever** — "gold = hard" would collide head-on with "gold = solved") · **board content ink** (user digits stay blue, solver digits stay solver-ink) · **the focus ring** (`--color-focus-sketch`, a11y contrast engineering) · **the masthead/wordmark** (if brand chrome gilds, gold stops meaning *earned*; the only gold near the masthead is the sun) · **the failure/error registers** (teacher-red surfaces, `SolverErrorNote`, conflicts — gold and red never co-occur; the grade is one tone).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W9):

| Gate | Value |
|---|---|
| Headline | `a23-harness` probes 1/2/5 green (encode the collision + solve reproductions); contrast ledger re-computed at merged HEAD; the **F8 grammar checklist** run over every touched surface (does each *earn* its gold?) |

Component checks:

| Gate | Value |
|---|---|
| token truthing | `--color-gold-star` resolves to real gold per theme; the success wash/shadow/note re-ink gold with zero `.solve-success` edits; green appears in EASY only |
| contrast | gold-ink 4.84:1 (light) / 11.48:1 (dark), red-ink ≥4.5:1, UI-10 solved digits pass at their size — all recomputed, not assumed |
| collision | `a23-harness/probe5` — star box no longer overlaps the status text; the completion block is one composition (stacked + row regimes) |
| twins | `statLine` computed + `.stat-line` CSS gone from both boards; MarginNote `meta` is the sole home |
| heart | celebration variant crests bottom-right, dark-mode rosy (not maroon), murmur ≤1-in-8, subscriber budget inside chains=1/subscribers=10 |
| PRM | `index.css:302,310` gate to instant under `prefers-reduced-motion`; heart/star/note all static-under-PRM |
| **star-form veto** | **default = inline star glyph** (F2-C primary). At this gate the owner may veto to the **corner foil sticker** (F2-A: top-right, `rotate:8deg`, the stronger fiction). Both kill the collision by construction, so the swap is CSS-local (inline `<svg>` in the note vs `CelebrationStar` repositioned to `position:absolute` on the board's top-right) — no correctness fork, no re-gate of the surrounding block |

## Seeds

- [`audit32/F8-design-system-statement.md`](../evidence/audit32/F8-design-system-statement.md) — the fifth-crayon verdict, the two-tier token spec, the tone table, the failure grammar (§3.2), the contrast ledger (§6), the one coherent move (§4), authoring order (§4).
- [`audit32/F2-completion-formulation.md`](../evidence/audit32/F2-completion-formulation.md) — Formulations A/B/C, the recommendation (C on A's substrate), the star-form authoring decision (§2 step 2), the blast-radius estimate (§3).
- [`audit32/F7-heart-yoshi.md`](../evidence/audit32/F7-heart-yoshi.md) — the six-layer heart inventory, the researched Yoshi's Story language, the four-variant family, the plush path + stitch geometry, the celebration bounce/blink/murmur spec, the dark-mode exception, the authoring risks (§4).
- [`audit32/f3-completion-metadata.md`](../evidence/audit32/f3-completion-metadata.md) — the completion-block hoist, the caption rung, the ink-level color-mix, the state matrix (§3.4), the F2 interface contract (§6).
- [`audit32/A23-ui-completeness.md`](../evidence/audit32/A23-ui-completeness.md) — UI-2 (star collision root cause), UI-3 (heart theme-static), UI-10 (solved-rainbow contrast); the owner-shot ledger (§D).
- `pass3/G10-design-reprobe.md` §5 — the evidence-basis ledger (F2/F3/F7 code-inferred; F7's `#storybook-texture` line refuted, R-4 — must not cite the dead filter as felt-nap precedent).
- `owner-shots/{solved-star,heart}.png` — the two staged contradictions.

## Residual risks

- **The star-form default executes in-wave** (R-2h); the veto window is at the gate, not a blocker — the corpus proved both forms kill the collision, so authoring proceeds on the inline default and the swap is trivial if vetoed.
- **All contrast integers are recomputed at merged HEAD** — the ledger is F8's session computation (WCAG 2.x over literal hexes); if a paper token moved since, the ink tiers re-derive against the live `--color-card`/paper values (F3 §3.3 flags the AA re-check against `--color-card` in both themes).
- **The heart geometry is code-inferred, not live-probed** (G10 §5) — the heart renders on solve and wasn't driven this session; A23's `heart-zoom-*.png` cover its at-size read, and the plush-path/stitch changes are frame-0 geometry (a static replica is faithful for those, as F4 proved). Verify the celebration bounce live in-wave.
- **`#wobble-heart` is shared state** (F7 §1.4/§4) — three hover easter eggs ride the preset (`ControlPanel.vue:371`/`:265`, `OptionSelector.vue:55`); the celebration heart must **never retune the preset** — new energy = a new filter id. All bounce/squash/blink transforms go on the host wrapper, never the filtered `<g>`.
- **F8's F7 omission (G9) is closed by this wave's amendment** — the heart variant family IS F8 step-3's felt heart, and the dark-mode exception fixes the maroon read F8 flagged but couldn't resolve without F7. The two documents are now one statement.
