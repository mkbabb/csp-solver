# CTRL-COST · THE CONSEQUENCE LADDER — pass-1 synthesis (Fable)

Section §10 with §15 at its centre (§1 §2 §8 §14 inside) · marks M01 M03 M04 M05 M12 M13.
Input: the pass-1 research record at `../../research/CTRL-COST/README.md` (DEVELOP, two
amendments, one bill), r0's censuses (R1 headings, R6 laws, R7 the owner's eye), the owner's
frames A/B. Read-only on the product. Nothing here closes a mark (U-10).

The method was the frontend-design two-pass: a token/type/layout plan, then a review against
the generic-default tell list, then this spec. §0 records what the review changed.

---

## 0 · What the review changed from the research prototype

The prototype was measured, not designed; five of its choices were defaults and the review
replaced them. Each is a decision the prototyper builds, not a note.

| prototype choice | why it was a default | the spec's choice |
|---|---|---|
| a two-step `box-shadow` focus ring | a fourth ring form; R6 law 39 lists three and the estate's drawn face already has one | the guard face's own ring: `2px solid color-mix(fg 45%)` at `outline-offset: 4px`, on the face node — same declaration, same node class |
| every act in a box, "same face" for `players` | a card kit: identical boxes regardless of meaning | **the box means "this changes the board."** `undo` `redo` `play together` `share` `leave` cost the board nothing and go bare; `hint` `fill` `solve` box at stroke 2; `deal` `clear` box at stroke 2.5 with the 8% ground. The weight ladder becomes readable without a legend |
| a fade under the sticky band name | an accessory; a fade with nothing under it is the lie the estate deleted twice | the name sits on opaque card paper and nothing else. Paper over paper is invisible when nothing is under it, so it never lies |
| rail caption BESIDE the chips | it is what cost the desk its +84px: the caption column made `Normal Corner Center` wrap one per line (`frames/rail-1280-ladder.png`) | the rail keeps HEAD's `zone-row-stacked` (caption over chips, chips on one line); the phone keeps caption beside. Both already ship |
| hover tapes and the `i` parked with no berth | the bar's foot died with the bar | **the band head is the berth.** The sticky head is the one strip in a band that content can never enter — the property the bar's foot had. Tapes berth in the head of the band that owns the hovered verb; the `i` sits at the `looking` head's right end |

One thing the review kept that a tell list would flag: cream paper, a display serif, one red
accent. That is the house, brief-pinned since T3, and the red is a measured token
(`--color-red-ink` 4.99:1 light / 6.30:1 dark from painted bytes), not a choice made here.

---

## 1 · The taxonomy, ruled

Three costs and one residue, four names, one voice. Placement is the research's §3 with two
rulings the research left open:

| band | what it means | contents, in order | drawn as |
|---|---|---|---|
| `looking` | changes only what you see | marks · what fits · checking · size · level · (peek, on the phone's ribbon) | bare words; the chosen option on its seeded scribble |
| `writing` | changes the board; every act here is one undo away | undo · redo · hint · fill · solve | undo/redo bare; hint/fill/solve boxed at stroke 2 |
| `starting over` | throws the board away; every act here asks | deal · clear · the `dealt` tally | boxed at stroke 2.5 + the 8% ground; the asked word in the teacher's red |
| `players` | not a board act | play together · share · who is here · leave | bare |

**Ruling 1 — tier 3 is "the acts that ask", not "the acts that cannot be undone."** The
research's crack (a same-size deal is one undo entry, a size-changing deal is off-log,
`useGameState.ts:612` vs `:635-640`) is real and it is invisible to a reader. The band name
is the reader's promise, and "starting over" is true of both deals. The off-log size-changing
deal is a W1 §1.4 spine question (widen the spine to record it) and is banked as a finding for
the chair, not smoothed here.

**Ruling 2 — inside `writing`, weight is cost too.** `undo` and `redo` are the reversal itself
and cost nothing; they go bare. The band therefore reads left to right as its own ladder:
two bare words, then three boxed. On the phone's shut pose the ribbon draws the same three
(undo · redo · hint) in the same grammar, so `hint` is boxed there and `undo`/`redo` are bare
beside it. That is the ladder's one touch on the playing pose; it is a DECLARED DELTA on the
ribbon's golden and the prototype crops it for the re-look. If the owner's eye rejects it, the
fallback is the ribbon byte-unchanged and the band grammar holds inside the card only.

**Ruling 3 — the two confirm dialects become one grammar.** Weight marks the destructive verb
everywhere (stroke 2.5 + the 8% ground: the gallery's leave verb, the card's deal and clear).
The teacher's red marks a question asked in ONE WORD. The gallery's ribbon asks in a sentence
(graphite, `guard-note-title`) and its verbs stay colourless; the card has no room for a
sentence, so the word itself asks and takes the red. One rule, two surfaces, and the red is the
only signal that changes when the face arms, since the weight is already on at rest. U-10.

---

## 2 · Tokens (nothing minted; every value is a right-hand side that already exists)

| role | token | light | dark |
|---|---|---|---|
| paper | `--color-card` | hsl(48 12% 99%) ≈ #fdfdfc | hsl(24 6% 7%) ≈ #131211 |
| ink (drawn strokes, act words) | `--color-foreground` | hsl(0 0% 3.9%) #0a0a0a | hsl(48 10% 92%) ≈ #edeae4 |
| band names, row captions, tally | `--color-muted-foreground` | hsl(0 0% 45.1%) #737373 (4.55:1 worst, measured) | hsl(48 5% 64%) ≈ #a8a59e |
| the asked word | `--color-red-ink` | #d02a52 (4.99:1 painted) | `var(--color-crayon-rose)` #ff5c7c (6.30:1 painted) |
| tier-3 ground | `color-mix(in srgb, var(--color-foreground) 8%, transparent)` | graphite wash | light wash |
| hover ground (boxed faces only) | `--color-accent` | hsl(48 8% 96.1%) | hsl(24 5% 15%) |
| the chosen `level` chip | the difficulty crayon's ink tier, unchanged | | |
| tap floor | `--tap-floor: 2.75rem` under `(pointer: coarse)` | | |
| radius | `0.3rem` on the face's ground; `HandDrawnOutline` corners at its default | | |

Type, one right-hand side per role (R6 law 27):

| role | token | rung |
|---|---|---|
| band name | `--type-group-title` → `var(--type-heading)` at EVERY width (drop the `min-width: 768px` gate, `typography.css:131-135`) | Fraunces 800 lowercase, φ: 25.89px at 1280; dock ratio 1.0176 → 1.2944 |
| row caption (marks · what fits · checking · size · level) | `--type-tag` | Patrick Hand 400, 14px floor coarse |
| act word under a glyph (undo … clear) | `--type-verb` / `--type-tool` as they resolve | Patrick Hand, 14px floor coarse |
| the asked word `sure?` | the act word's own rung, weight 600 | |
| the answer `no` | `--type-tag`, underlined, offset 3px | |
| option chips | `--type-option` | Fira Code 20px desk and coarse phone |

Glyph ranks unchanged: `--icon-act 36` (deal) · `--icon-verb 30` (clear · fill · solve · share) ·
`--icon-tool 26` (undo · redo · hint).

Copy, M16, authored lowercase (zero-byte re-cut; both subsets already hold `aegiklnorstvw`
plus the letters the captions and tapes already render): `looking` · `writing` ·
`starting over` · `players` · `marks` · `what fits` · `checking` · `size` · `level` ·
`undo` · `redo` · `hint` · `fill` · `solve` · `deal` · `clear` · `sure?` · `no` ·
`play together` · `share` · `leave` · `dealt`. The solve tape takes B1's recut `fills in the
whole board` and its ADMITTED row is struck in the same commit. The divider's label becomes
`settings above, acts below` (deal has moved below it).

---

## 3 · Components and states

### 3.1 The band (`<section role="group" aria-labelledby>`)

- Head: `<h2 class="section-heading">` in the band voice, `position: sticky; top: 0`, on
  opaque `--color-card`, `z-index` at W2's pinned-tag rung (35), `padding-block: 0.25rem`,
  `margin-bottom: 0.35rem`. Rides W2 §2.6's landed sticky mechanism (in flow, the same
  `data-under-bar` law now moot because there is no bar).
- The head is a flex row: the name at left; a right slack that holds the band's berth (hover
  tapes on fine pointers, the `i` on `looking`). Nothing else ever enters the head.
- Bands are separated by air alone: `margin-top: 0.9rem` between bands. No frame, no rule (a
  rule is CTRL-RULE's centre and is not borrowed here). The `BoilDivider` keeps its ONE home
  between `looking` and `writing` — it is still "staged above, live below", and the peek hold
  stays on it; filterBudget stays 9 by exact match.
- The card's foot: `scene.css` `padding-bottom: 3.5rem` (the old note berth) drops to `1rem`;
  `--action-bar-h` and `scroll-padding-bottom` die; `scroll-padding-top: 2.4rem` stays and
  now clears the sticky head (27px + margin). The bottom fold fade re-homes from
  `.action-bar::before` to the card's own bottom edge as the mirror of the top sentinel, same
  2rem, same `data-fold-below`, same 150ms window under `no-preference`.

### 3.2 Tier 1 · the option row

Unchanged `OptionSelector`. Caption in `--type-tag` muted; on the rail (≥1024) caption over
chips (`zone-row-stacked`), on the phone caption beside. States as they ship: chosen = bold
on the seeded scribble; hover (fine) = ink lift + ghost underline; focus = the face ring below.
The mobile tab heads die: `size` and `level` are two rows, always laid out, each 44px tall
under coarse. `level`'s chosen chip keeps its crayon; its caption is muted like the other four.

### 3.3 Tier 2 · the writing face (`hint` `fill` `solve`)

`<button class="icon-btn">` wrapping `<HandDrawnOutline :pose="0" :stroke-width="2"
:outset="2" class="act-face">` around glyph + word. Rest: stroke in `currentColor`
(foreground), no ground. Hover (`(hover: hover)` only): ground `--color-accent`, ink to
foreground, 150ms `--ease-standard` (the guard face's declaration, same node). Active:
`scale(.93)` as `.icon-btn` ships. Focus-visible: ring on the face. Disabled (`loading`):
opacity as `.icon-btn` ships. Coarse: `min-height`/`min-width: var(--tap-floor)`.
`undo` `redo` beside them are the bare `.icon-btn` (glyph over word, no box).

### 3.4 Tier 3 · the asking face (`deal` `clear`) — the card's one memorable thing

The same outline at `:stroke-width="2.5"` plus the 8% ground. Inside: the glyph, then a
**word cell that is a 1×1 grid holding both words** (`deal` and `sure?` share `grid-area: 1/1`,
the cell sizes to the wider), then a second line `no` (`--type-tag`, underlined) that is
`visibility: hidden` at rest and keeps its box. Measured: the reservation costs 23.19px once
(both faces share a row), and arming moves nothing — Δ [0,0,0,0] on the band and both faces,
card scrollHeight Δ 0, both engines, three cells, and again on the static page.

States:

| state | word | `no` line | colour | aria-label |
|---|---|---|---|---|
| rest | `deal` / `clear` | hidden | foreground | `Deal a new board` / `Clear the board` (as they ship) |
| armed | `sure?` weight 600 | visible | `--color-red-ink` | `Press again to deal a new board` / `Press again to clear the board` (as they ship) |
| disarm | back to rest | hidden | | |

Arming: one press on a dirty board (`isDirty` = undo depth > 0, `useGameState.ts:332`).
Disarm: a press on `no`, any other press in the card, or the window lapsing. The second press
acts. W1 §1.5 owns the arming mechanism (pointer scope is its call; the face works under coarse-
only as it ships and under pointer-agnostic alike). The pristine board never asks.

The `dealt ||||` tally stays beside the two faces in the same row, muted, as it ships.

### 3.5 Players

Bare `.icon-btn` for `play together` and `share` (glyph over word), the roster line, `leave` as
the text link it ships as. The invite verb's `.berth-note` berths in the `players` head.

### 3.6 The phone's two poses

- SHUT (390×844): unchanged reachable set — undo · redo · hint · peek in the ribbon plus the
  tongue (measured identical at HEAD and under the ladder). The only change is Ruling 2's
  boxed `hint`.
- RISEN: four bands, sticky names, no bar. `.play-controls` is ONE set of buttons: today it
  teleports to `#fold-tools` on `portraitDock`. Under the ladder the teleport is disabled while
  the sheet is open, so the three ride back into the `writing` band the moment the sheet rises
  and back out to the ribbon when it shuts. Zero new controls, one name per act, and amendment
  A is met without a duplicate tabbable. The ribbon's inert row is then empty while covered.
- LANDSCAPE (844×390): the ribbon does not exist. The quick set is §14's: **undo · redo · hint,
  tier-2 acts only, by law** — never a tier-3 act one tap from a tool. Their idiom is this
  band's (bare · bare · boxed at stroke 2, glyph `--icon-tool` over the word). Their berth is
  W2's tab mechanism; this spec names the set and the face, and the landscape rescue is scored
  ONLY on a measured 1-tap undo at 844×390. Unbuilt today; undo is 2 taps there.

### 3.7 The desk (1280×800 rail)

The same four bands in the same order; the writing band draws all five (the coarse gate on
`.play-controls` at `GameControlPanel.vue:2359-2371` drops, so undo/redo/hint are drawn on
the rail beside their keys; the keyboard legend behind the `i` is unchanged). At scrollTop 0
every one of the five settings' chosen chips is on screen (2/5 → 5/5, measured).

---

## 4 · Motion (answered motion only; zero entrances)

| moment | what moves | curve | duration | home |
|---|---|---|---|---|
| arm / disarm | opacity crossfade of the two stacked words and the `no` line (`visibility` flips at the ends so the hidden word never takes a press) | `--ease-standard` cubic-bezier(0.4, 0, 0.2, 1) | 150ms, the washi's own window | CSS layer |
| the disarm window | the JS timer | none | **`MOTION.confirmWindowMs: 4000`** (the accepted grammar per the charter; the tree's two `2500` literals at `GameControlPanel.vue:520,555` read this instead — the chair may hold 2500, it is one number) | `pencilConfig.ts MOTION` (law 4: no timing constant outside it) |
| press | `.icon-btn:active scale(.93)` | as it ships | as it ships | as it ships |
| sticky names | nothing; they stick | | | |
| hover ground | background-color/color | `--ease-standard` | 150ms | the guard face's rule |

PRM: the crossfade collapses to the `visibility` swap (same frame). Nothing here rides the
beat; no live filter; no text boils.

---

## 5 · The bill, and how it is paid

The research measured +84 desk / +103 dock (+127 with φ) / +149 landscape, and a 41px seam
regression at 430×932. The spec pays as follows; every line is a number the prototype reads.

| arm | desk | dock | note |
|---|---|---|---|
| caption over chips on the rail (HEAD's own arrangement) | recovers most of the +84 (the chips stop wrapping one per line) | — | measure |
| the card's foot `3.5rem → 1rem` | −40 | −40 | the berth moved into the heads |
| five faces on one row in `writing` at 390 (5×44 + 4×9.6 = 258 < 358) | — | 0 extra rows | measure |
| band gaps at 0.9rem, names at φ, the 23px reserve | kept | kept | the point of the family; no cheaper rung (floor 24.6px, next rung 20.35px) |

Ceilings the prototype must land under, or the family ships at 390/375 only: desk scrollHeight
≤ 1182 (HEAD 1142 + 40), dock ≤ 760 (HEAD 699 + 61: the φ names' net after the tapes/wells
die, plus the reserve), landscape 900×500 ≤ 820.

**The seam is W2's number, and it is stated as a finding.** `.controls-card`'s dock cap is
`100dvh − var(--sheet-chrome) − 1.5rem` with `--sheet-chrome: 12rem` (`scene.css:468,512`),
a fixed guess that clears the wordmark at 390 (+1.27) and 375 (+9.77) and would not clear it
at 430 under ANY card taller than 699 because the cap (716) sits above the wordmark's foot
there. The family's growth exposes it; the family does not own it. Born-RED gate G7 holds the
seam at ≥ 0 on three viewports; if the height arms above do not clear it at 430, the cure is the
cap derived from the masthead's foot rather than 12rem, which is one number in a landed
mechanism and is flagged to the chair.

---

## 6 · What dies

- `.action-bar` (node, CSS `GameControlPanel.vue:2096-2180`, the sticky key, the `::after`
  skirt, z-index 60, the `--action-bar-h` publisher) and `scene.css`'s `scroll-padding-bottom`.
- The four `.tray-well` `HandDrawnOutline`s at stroke 1.5 and their four `anchor="tag"` tapes.
- `.mobile-heading-row` / `.mobile-heading-btn` (`:781-800`, CSS `:2379-2450`) and `showTabs`.
- `.zone-row-label`'s 68% alpha (captions are one voice at full muted ink).
- The `(pointer: coarse)` gate on `.play-controls`.
- The `.berth-note` / `.action-bar .washi-label` berth CSS (re-homed to the heads).
- Two `2500` literals (re-pointed to `MOTION.confirmWindowMs`).
- The `solver finishes the board` string and its ADMITTED row.

What does not die: `OptionSelector`, `HandDrawnOutline`, `SheetWashiLabel` (hover/`wide`
tapes), `BoilDivider` (one instance, same home), `DrawerTab`, `DifficultyTally`, the keyboard
legend, the guard ribbon (untouched; its `.guard-face` declarations are the precedent — the
preferred build hoists them to one `act-face` class in `assets/index.css` consumed by both
files, a move not a copy).

---

## 7 · The plan (files, order)

1. `src/assets/typography.css:131-135` — delete the `min-width: 768px` arm; `--type-group-title`
   resolves to `--type-heading` everywhere. ROW 3 greens; +24px dock, priced.
2. `src/pencil/config/pencilConfig.ts` — `MOTION.confirmWindowMs: 4000` with its ruling
   comment; `GameControlPanel.vue:520,555` read it.
3. `src/assets/index.css` (`@layer components`) — `.act-face` (rest/hover/focus/coarse floor/
   the `.is-asking` weight arm/the word stack) hoisted from `GameGallery.vue:1410-1462`;
   `GameGallery.vue` re-points its two faces to it.
4. `src/games/shared/GameControlPanel.vue` — the template re-cut into four bands per §3; the
   deletions per §6; the teleport condition per §3.6; the divider label recut.
5. `src/games/shared/scene.css` — the foot to 1rem; the bottom fold fade re-homed; the
   `scroll-padding-bottom` line deleted.
6. `scripts/check-font-coverage.mjs` — the corpus edit (eight names → four bands + five
   captions + `sure?` `no`); `scripts/check-copy-register.mjs` — strike the solve tape's
   ADMITTED row.
7. `e2e/` — DELTA goldens for the controls card (and the ribbon, if Ruling 2 survives the
   re-look); `zone-grammar.spec.ts`'s tab rows retire; the born-RED gates of §9 promoted from
   the research's `probe/` into the estate's local instruments.
8. W2's tab (`DrawerTab.vue` / `scene.css`) — the landscape quick set, ONLY if the chair assigns
   the berth; scored on measurement.

---

## 8 · Prototype brief (the smallest runnable build that proves it on the real surface)

Build steps 1–6 as a `.diff` applied in a throwaway `git worktree` under the scratchpad
(never committed; removed with `git worktree remove`), served at `127.0.0.1:4233 --strictPort`
on a scratch playwright config (both engines, no webServer). Then read:

**Poses and crops (≤150 KB each, few, each cited):**
- 1280×800 light, rail at scrollTop 0 — one crop: the five settings' chosen chips and the
  `writing` band's five faces in one frame.
- 390×844 light, sheet settled ≥700ms, `starting over` at rest and armed (deal) — two crops,
  the same box; and the same pair in dark (the red is `#ff5c7c` there).
- 390×844 shut pose, the ribbon with `hint` boxed — one crop for the re-look (Ruling 2).
- 430×932 sheet settled — the case top against the wordmark, one crop only if the number is
  negative.

**Censuses re-run unchanged:**
- r0 `heading-voice.spec.ts` (md5 `9f3f07e2…`): 4 cells → 4 passed; names 4, voice 1
  (`Fraunces · 25.89 · 800 · lowercase`), `<h2>` 4/4, dock ratio ≥ 1.23 (expect 1.2944).
- The semantic hardening row (the `aria-labelledby` targets of every `[role=group]` in the
  card): 4 names / 1 voice / 4 document headings.
- R6 `hue-census.mjs`: 29 rows, byte-identical (no new hex); R6 `law-probe.mjs`: L1 filter
  population exactly 9, L5 one box grammar.
- R3's wobble probe: untouched surface, π (the board is not claimed).
- The r7 instruments as amended: I2′ strips 0 / coverage 0; I3′ pinned name = the band owning
  most of the scrollport at 5 scroll states, desk AND dock, 0 violations (the research's
  residue — the desk's bottom state with no pin, the dock's bottom state pinning `looking` —
  must be cured by the head's `top: 0` on the LAST band too, and is a number, not a hope);
  I4 + the undo proof: deal/clear one press writes 0 and arms; fill writes N and one undo
  restores the board string exactly; **solve: wait for the reveal wave to finish (poll the
  board string until stable for 1s, cap 20s), then one undo restores exactly** — measured, or
  the record says solve's tier is source-true only.
- Zero reflow: `getBoundingClientRect` on the band and both faces before/after arming, Δ
  [0,0,0,0], card scrollHeight Δ 0, 1280×800 / 390×844 / 900×500, both engines.
- Contrast from painted bytes (screenshot clip → sharp raw → 2nd/98th-percentile pair): the
  asked word, the band name, the caption, the `no` line, on `--color-card`, light AND dark,
  both engines, all ≥ 4.5:1.
- Tap floor at 390 coarse with the per-dimension negative control (43×60 → wOK false, 60×43 →
  hOK false, 44×44 → both true): every face and chip ≥ 44 × 44.
- Height: `.controls-card` scrollHeight at the three cells against §5's ceilings.
- Seam: `.drawer-case` top − wordmark bottom at 390 / 375 / 430, both engines, sheet settled:
  ≥ 0 everywhere.
- `node scripts/check-font-coverage.mjs` green with the corpus edit and NO woff2 regenerated
  (both subsets' byte sizes unchanged: 14,636 / 4,312).
- `node scripts/check-copy-register.mjs`: 0 em dashes, 0 unadmitted, the solve-tape row gone.
- Tap counts from the playing pose at 390×844 and 844×390 for every act (the landscape
  undo stays 2 unless step 8 is built; say so).

**Success means:** every census row above at its stated number; the three crops showing one
box that does not move when it asks; the height under the ceilings or the family declared
390/375-only in the record.

---

## 9 · Born-RED gates this family lands with

| id | row | at HEAD | under the family |
|---|---|---|---|
| G1 | r0 `heading-voice.spec.ts` ROW 1/2/3 unchanged | RED 4/4 | GREEN 4/4 |
| G2 | semantic hardening: every `[role=group]` in the card is named by an `<h2>`, all in one voice tuple | RED (6 names / 2 voices / 0 headings) | GREEN (4 / 1 / 4) |
| G3 | I2′: no strip lies over an option group, and any strip that exists is drawn | RED (1 strip, 88.9% of `players`, undrawn) | GREEN (0 strips) |
| G4 | I3′: at every scroll state the pinned name is the band that owns the most of the scrollport, desk and dock | RED (1 wrong pin at the desk) | GREEN, 0 violations, no vacuous state |
| G5 | the ladder's acts: on a dirty board a tier-3 press writes 0 and arms with two visible answers; a tier-2 press writes and ONE undo reachable in the same pose restores the board exactly (fill and solve, solve after its wave) | RED (fill's undo is inert under the risen sheet; solve unmeasured) | GREEN |
| G6 | the confirm moves nothing: band + faces Δ [0,0,0,0] and card scrollHeight Δ 0 across the arm, both engines, 3 cells, with the second answer visible | RED (no second answer exists) | GREEN |
| G7 | seam guard: `.drawer-case` top clears the wordmark's foot by ≥ 0 at 390 / 375 / 430, sheet settled | GREEN at HEAD (a π guard the family's growth threatens) | must stay GREEN |
| G8 | height ceilings: desk ≤ 1182, dock ≤ 760, land ≤ 820 | GREEN at HEAD | must stay GREEN or the record declares 390/375-only |
| G9 | painted-bytes contrast ≥ 4.5:1 on the asked word, band name, caption, `no`, both themes | guard | GREEN by token |
| G10 | 44×44 with per-dimension negative controls on every face and chip at 390 coarse | guard | GREEN |
| G11 | filterBudget exactly 9; union area within band; hue census 29 rows unchanged | π guard | unchanged |
| G12 | `check-font-coverage.mjs` with the four names + five captions in the corpus, subsets byte-unchanged | RED once the corpus lists them against HEAD's tree | GREEN |
| G13 | `check-copy-register.mjs` 0 unadmitted with the solve tape's ADMITTED row struck | coupled: REDs if the string outlives its row | GREEN |

---

## 10 · Findings for the chair (not this family's to move)

- The size-changing deal is off-log (`useGameState.ts:635-640`) — W1 §1.4's spine, one entry.
- `--sheet-chrome: 12rem` is a guess that fails at 430 for any card over 699px — W2's cap.
- Ruling 2 (the boxed `hint` in the ribbon) and Ruling 3 (red marks a one-word question) are
  U-10 auditions; both have a stated fallback.
- The landscape quick set's berth is W2's; the set (undo · redo · hint) is this family's law.
