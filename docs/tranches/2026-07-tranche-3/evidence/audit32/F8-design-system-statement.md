# F8 — THE DESIGN SYSTEM STATEMENT

Lane: DESIGN (Fable, frontend-design skill invoked). Read-only; deliverable = the coherence spec the tranche-III authoring executes as ONE move. Inputs consumed: all six sibling lanes (`design-f1-dropdown-border.md`, `F2-completion-formulation.md`, `f3-completion-metadata.md`, `f4-darkmode-toggle-svgs.md`, `F5-dark-toggle-storybook.md`, `F6-game-switch-transition.md` — no F7 file exists in `audit32/`), all three owner shots, and the palette sources. Contrast numbers computed this session (WCAG 2.x relative luminance, python3, papers `#FBFAF7`/`#110F0E` from `index.css:105,180`).

All paths relative to `web/frontend/` unless noted.

---

## 1. The system as found — four moves, one missing color

The six lanes independently converged on the same shape: every audited defect is a *coherence* defect, not a component defect.

| Lane | Finding, reduced | The system-level cause |
|---|---|---|
| F1 | dropdown frame floats off its card | two coordinate systems + two edge owners (`HandDrawnOutline.vue:86-90` vs `gridPaths.ts:143-149`) |
| F2/F3 | star occludes "solved it!"; success paints green under a token named gold | `--color-gold-star: var(--color-crayon-green)` (`index.css:151`) — the one token that lies; two anchor systems in one margin |
| F4 | celestial icons a register too light; gold hexes scattered in a template | the gold family exists (`pencilConfig.ts:90-91`) but has no token-level identity |
| F5 | sun/moon swap has no story; world flips before the sun sets | the day/night gold is choreographed as a crossfade, not an event |
| F6 | game switch is a cut; draw-in has no erase | the workbook fiction lacks its page-turn |

The owner shots stage the contradiction directly: in `solved-star.png` the *only* gold object on screen is the star (`#FDE68A`/`#F0B030`, `CelebrationStar.vue:109-111`) — marooned in a field of success-green frame, green "solved it!", while the copy says gold star. In `heart.png` the reward mascot reads maroon (dark-mode `opacity: 0.75; saturate(0.85)`, `CrayonHeart.vue:74-77`). The reward register is the one place the palette goes incoherent.

### The tone inventory today (`index.css:143-156`)

Four crayons — green `#2DC653`, orange `#F4A236`, rose `#E8315B`, blue `#4A90D9` (dark variants brighter per the "paper darkens and the wax glows" doctrine, `index.css:140-142`, `205-208`) — plus graphite (`--color-pencil-graphite`, `:156`) and two semantic aliases: `--color-teacher-red → crayon-rose` (`:150`), `--color-gold-star → crayon-green` (`:151`). Meanwhile a complete gold *family* already ships in JS: sun rays `#F0B030`, sparkle `#FDE68A`, moon body `#FFF4AA`, moon outline `#E5C74D` (`pencilConfig.ts:90-91`) — plus the star's own fill/stroke pair duplicating two of those hexes in a second file (`CelebrationStar.vue:109-111`). Gold is *in the product*; it just isn't *in the system*.

---

## 2. The verdict: gold joins the palette as the fifth crayon

**Yes — first-class, with a two-tier form.** Not a new semantic alias onto an existing crayon (that's the current bug's shape) but a real crayon with the same doctrine as the other four: one light hex, one brighter dark hex, aliased into semantics.

The pencil world already has a physics for gold that no other tone has: **gold is light**. It lives in the sky — the sun's rays, the moon's body, the stars — and the game's fiction (graded worksheet, foil sticker) says it comes down to the page only when the work is done. Green never had that story; green is a crayon like any other, and its success role was always a stand-in (the token's own name confesses it).

### 2.1 Token spec — CSS (`index.css`)

```css
/* :root — the fifth crayon. Wax tier: strokes, washes, fills, the sticker. */
--color-crayon-gold: #C99A2E;          /* warm ochre — wax on light paper */
--color-gold-ink:    #8C691D;          /* ink tier: gold TEXT (verdict line) — 4.84:1 AA on light paper */

/* .dark — the wax glows (doctrine, index.css:140-142) */
--color-crayon-gold: #E5C74D;          /* the moon's own outline gold — 11.48:1 on dark paper */
--color-gold-ink:    var(--color-crayon-gold);  /* dark ink tier collapses into wax; both pass AA */

/* the alias stops lying */
--color-gold-star: var(--color-crayon-gold);
```

Rationale for the two tiers: **every crayon fails AA as light-mode text today** — measured this session: green `#2DC653` on light paper 2.16:1 (the current "solved it!" ink), rose 4.01:1, the F2-proposed gold `#C99A2E` 2.47:1. The board wash and sticker are non-text and live happily at wax contrast; the verdict *line* is 16→22px body text (`MarginNote.vue:33-36`) and deserves a passing ink. `#8C691D` measures 4.84:1 (light); dark-mode `#E5C74D` measures 11.48:1 — both AA. MarginNote's `gold-star` tone rule (`MarginNote.vue:49-51`) takes `--color-gold-ink`; the `.solve-success` stroke + shadow stack (`index.css:301-309`) keeps the wax token and needs **zero edits** — it already `color-mix`es off `--color-gold-star`. The teacher-red tone should receive the same ink-tier treatment in the same sweep (`--color-red-ink`, darkened rose ≥4.5:1) so the verdict register is AA in both tones — one pattern, applied twice.

### 2.2 Token spec — JS (`pencilConfig.ts`)

The celestial family (`pencilConfig.ts:89-92`) stays the sky's local palette, but the star's duplicated hexes (`CelebrationStar.vue:109-111`) rewire to `YOSHI_COLORS.celestial.sun.sparkle`/`rays` — one family, one source. This rides the already-booked M4 `useCelestialSun()` consolidation (`pencilConfig.ts:83-88`) and F4's palette-source note; no new JS constants needed. The CSS crayon and the JS sparkle deliberately differ in value (wax vs foil) but must stay within the family — an authoring-time comment binding them (`/* family: celestial gold, pencilConfig.ts:90 */`) is the whole enforcement.

### 2.3 The tone table after the move

| Tone | Token(s) | Register | Where it may appear |
|---|---|---|---|
| graphite | `--color-pencil-graphite` | the pencil | grid, ghost ring, tally line, neutral marginalia, erase/draw transitions |
| teacher-red | `--color-teacher-red` (+ new red ink tier) | the grader's correction | failure wash, conflicts, `aria-invalid`, error paper-note |
| **gold** | `--color-crayon-gold` / `--color-gold-ink` | **earned light** | success wash + sticker shadow, star, verdict text, heart's crest moment, sun/moon family (JS side) |
| crayon green/orange/rose/blue | `--color-crayon-*` | the crayon box | difficulty chips (EASY/MEDIUM/HARD, `index.css:130-132`), decorative crayon uses |
| solver-ink | pastel-gradient cell fill (F3 §3.3) | the solver's pen | solved-cell digits ONLY — board content, never chrome |
| user-ink / focus | `--color-user-ink`, `--color-focus-sketch` | functional ink | user digits; keyboard focus ring |

---

## 3. Where gold belongs — and the failure grammar

### 3.1 Belongs (the complete list)

1. **The solve moment** — board wash, sticker shadow, star, verdict text, and the felt heart's crest (F2 formulation C): the entire completion block speaks gold at crest. This is the *primary* site; everything else is family resonance.
2. **The sky** — sun rays/sparkles, moon body/outline, already gold (`pencilConfig.ts:90-91`). Untouched in value; F4's legibility deepenings (`#F0B030→#DF9A1E` spiral, `#D99A10` sparkle stroke) all stay inside the family.
3. **Nothing else.** Deliberately. Gold's meaning is its scarcity.

### 3.2 Must NOT turn gold — the failure grammar

- **The laminate** (`.sheet-laminate`, `index.css:266-276`; `AnswerKeyLaminate.vue`). It's the teacher's answer key held over the page — *looking up the answer*. Gilding it would celebrate the act the reward economy defines itself against. It stays milk-and-pencil-edge (`--sheet-laminate-milk`, `--sheet-ink-edge-laminate`). Hard no.
- **The washi label** (`SheetWashiLabel.vue`; `--sheet-washi-neutral`, `index.css:164`). Tape is stationery, not reward. A gold washi is exactly the "festive chrome" drift that would bleach the solve moment. Stays neutral tinted paper.
- **The tally line.** F3's principle 2 is ratified here as system law: metadata is graphite regardless of grade (`f3-completion-metadata.md` §2.2). The pencil counts; only the teacher awards.
- **Difficulty chips.** MEDIUM is crayon-orange `#F4A236`/`#F5B35C` (`index.css:131,144,206`; `ControlPanel.vue:160,366`) — measured **1.24:1 (light) / 1.10:1 (dark) against the gold candidates**: chromatically near-identical. The grammar that keeps them legible as different words is *spatial + material*, and it must be enforced: gold appears only in the post-solve register (margin block + board wash + sky), orange only in the control panel; gold is always accompanied by its material (foil sticker, wash, verdict) — never as a bare chip, badge, or label. No gold difficulty tier, ever (a "gold = hard" reading would collide head-on with "gold = solved").
- **Board content ink.** User digits stay `--color-user-ink` blue; solver digits stay the pastel solver-ink gradient (`SudokuCell.vue:71-85`). The board turning gold means the *frame and margin* turn gold — the ink the player and solver wrote never recolors. Success is stamped on the page, not rewritten into it.
- **Focus ring** (`--color-focus-sketch`, `index.css:152-155`). A11y signal; its blue is load-bearing contrast engineering. Never decorative.
- **The masthead/wordmark.** If the brand chrome gilds, gold stops meaning *earned*. The wordmark stays graphite ink (`HandwrittenLogo.vue:232-246`); the only gold near the masthead is the sun itself.
- **The failure and error registers** — trivially, but stated: teacher-red surfaces, `SolverErrorNote`, conflicts. Gold and red never co-occur on the same surface; the grade is one tone.

One sentence of grammar: **gold is awarded, never ambient on the page — it may only appear after a solve completes, or in the sky.**

---

## 4. The ONE coherent move — how F1–F6 compose

The tranche should land these as a single statement, not six patches. The composition:

**The workbook stays graphite until something happens.** F6's page-turn (erase → seam → draw-in, ≈1.05s, all existing pencil-boil `sequence` assets) is a *graphite-only* event — no color beat, because switching exercises earns nothing. F1's registration fix (px-native `HandDrawnOutline`, radius-aware wobble rect, one-edge ownership) is the same statement at rest: one coordinate system, one drawn edge — the pencil is precise even when it wobbles.

**Gold lives in the sky.** F5's set-and-rise makes the day/night gold an *event with causality* (sun sets → world dims → moon rises → stars ignite), and F4's slight pass makes the celestial bodies read at size (outline weights +1, spiral/sparkle deepening — all in-family). The toggle becomes the product's smallest complete story about where light goes.

**Solving brings the gold down to the page.** F2-C on F3's structure: the token trues (`--color-gold-star` → real gold), the margin becomes one composed block (sticker slot + verdict at `--type-body` in gold ink + graphite tally at `--type-caption`), the star stops squatting on the text (in-flow by construction), and the felt heart crests at the diagonal corner — the mascot from the attribution card promoted to the reward. Green returns to being merely the EASY crayon (`index.css:130`).

Same paper, same pencil, same scheduler (one rAF chain, chains=1 covenant), same four ledgered easings (`pencilConfig.ts:51-57`), every beat finite and PRM-substituted (each lane's PRM variant is already specified; F3 flags the one missing gate — `index.css:302,310` transitions lack a PRM guard — close it in the same sweep). Zero new dependencies (F6's keyframes.js rejection is ratified: the boil scheduler + CSS carries all of it).

### Authoring order (dependency-sorted)

1. Tokens: `--color-crayon-gold` + `--color-gold-ink` (+ red ink tier), true the alias (`index.css:151`), MarginNote gold tone → ink tier. *(unlocks F2/F3)*
2. F3's completion block hoist + MarginNote `meta` prop (kills the collision + the twin duplication).
3. F2-C: star demotes/repositions, felt heart, murmur hook.
4. F5 set-and-rise + F4 slight pass + star-hex rewire onto `celestial.*` (one celestial sitting).
5. F6 page-turn + its three defect fixes (D1 menu-leave, D2 `animatingCells`, D3 chunk preload).
6. F1 px-native outline + radius wobble + border-less elevation variant (independent; verify all hosts).

---

## 5. The one-sentence design story

**Gold is earned light: it lives in the sky, and only a finished page can pull it down — everything else on the paper is graphite and crayon.**

Every tranche decision tests against it: does this surface *earn* its gold? (Star, wash, verdict, heart: yes — the solve completed. Laminate, washi, chips, masthead, tally: no — nothing was earned.) Does this motion tell the light's story? (Sun sets *then* the world dims; the page erases *then* the next draws; the star draws on *at crest*, not before.)

---

## 6. Contrast ledger (computed this session)

```
candidate wax golds          on light #FBFAF7   on dark #110F0E
  C99A2E (light wax, adopt)      2.47             7.41
  E5C74D (dark wax, adopt)       1.60            11.48
  F0B030 (sun rays, JS-only)     1.84             9.98
ink tier
  8C691D (gold ink, adopt)       4.84  AA         —
  906C1E (alternate)             4.63  AA         —
discriminability risk
  C99A2E vs MEDIUM #F4A236       1.24  (near-identical — grammar-enforced, §3.2)
  E5C74D vs MEDIUM #F5B35C       1.10
today's incumbents (for honesty)
  green 2DC653 "solved it!" ink  2.16  (current AA failure gold-ink fixes)
  rose  E8315B teacher-red ink   4.01  (near-miss — same ink-tier fix)
```

Command: WCAG 2.x relative-luminance ratio over literal hexes, python3 (session transcript); papers from `index.css:105` (light bg `hsl(48 15% 98%)` ≈ `#FBFAF7`) and `:180` (dark bg `hsl(24 8% 6%)` ≈ `#110F0E`).

## 7. Evidence index

| Claim | Cite |
|---|---|
| gold-star token aliases green | `src/assets/index.css:151` |
| success wash routes through the one token | `index.css:297-309` |
| crayon doctrine (dark glows) | `index.css:140-142, 205-208` |
| gold family in JS, star duplicates it | `pencilConfig.ts:90-91`; `CelebrationStar.vue:109-111` |
| tone consumers (MarginNote, boards) | `MarginNote.vue:19,49-51`; `SudokuBoard.vue:218-233`; `FutoshikiBoard.vue:282-297` |
| laminate/washi material tokens | `index.css:158-169, 266-276`; `src/pencil/sheet/{AnswerKeyLaminate,SheetWashiLabel}.vue` |
| MEDIUM chip is crayon-orange | `index.css:131,144,206`; `ControlPanel.vue:160,366` |
| star gold vs green field (owner-visible) | `owner-shots/solved-star.png` |
| heart maroon in dark | `owner-shots/heart.png`; `CrayonHeart.vue:74-77` |
| missing PRM gate on success transition | `index.css:302,310` (via F2 §C motion spec) |
| sibling-lane findings | `audit32/design-f1-dropdown-border.md`, `F2-completion-formulation.md`, `f3-completion-metadata.md`, `f4-darkmode-toggle-svgs.md`, `F5-dark-toggle-storybook.md`, `F6-game-switch-transition.md` |
