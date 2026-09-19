# T9-W7 · pass 2 · SYNTHESIZE · CTRL-COST — the consequence ladder

Section §10 with §15 at its centre · marks M01 M03 M04 M05 M12 M13 · pass-1 70, ADVANCE.
Synthesizer: Fable 5.1. Read-only on the product. Inputs: `CHAIR-RULINGS.md`, the pass-1 spec, the
pass-1 critique (the berth refuted; the ask pointer-only; theme-selectors RED; the gallery re-rank
does not exist), the pass-2 research record (`../research/CTRL-COST/README.md`,
`readings/lane2-5.json`, `fraunces-cmap.txt`), registry-v1, r0 R6/R7, the owner's frames. Nothing
closes here (U-10).

The pass-1 spec stands where not amended. Four bands, one voice, the box that means "this changes
the board", the ask that moves nothing. The pass-2 amendments: the ask gets a keyboard and a
real second answer, the pinned head obeys the pin-band law, the note berths IN the head, the 8%
ground dies, and the desk asks too.

---

## 0 · The plan re-read, then the tell review

**Subject.** A ladder of consequence: four bands named for what they cost the board (`looking ·
writing · starting over · players`), each act drawn by its cost. The memorable thing is the face
that asks without moving.

**Tokens.** No new hex; ONE token retired (the 8% tier-3 ground); `--ring-ink` consumed.

| role | token | light | dark |
|---|---|---|---|
| paper | `--color-card` | ≈ #FDFDFC | ≈ #131211 |
| ink | `--color-foreground` | #0A0A0A | ≈ #EDEAE4 |
| band names, captions, tally | `--color-muted-foreground` | #737373 (4.66) | ≈ #A8A59E (7.68) |
| the asked word | `--color-red-ink` | #D02A52 (4.99 on BARE card) | #FF5C7C (6.30) |
| tier-3 ground | **RETIRED** | (was 8% fg: 4.20 light, a 1.19:1 cue no mix can lift over 3:1) | |
| hover ground (boxed faces, `hover:hover`) | `--color-accent` | hsl(48 8% 96.1%) | hsl(24 5% 15%) |
| focus | `--ring-ink` (consumed) | fg 50% | fg 50% |
| tap floor | `--tap-floor: 2.75rem` | | |

**Type.** Fraunces 800 lowercase at φ for the four band names at every width (25.888; `--type-
group-title`'s md gate deleted—measured 25.888 at dock and desk); Patrick Hand for captions
(`--type-tag`), act words (`--type-verb`), tier-3's word at `--type-act` (16 at 390 coarse: the
rung lever, TABS's finding); Fira Code chips at 20px.

**Layout, one sentence.** Four bands in a scrolling card whose top padding is a reserved band the
pinned head lives inside; each band's head is a flex row (name left, the note's berth right); acts
drawn by tier; the foot is the reader's own undo.

```
 ┌ case ═══════════════════════════════════════════════════════════════╗
 │▒▒▒▒▒▒▒▒▒▒▒▒▒▒ --pin-band = 0.6rem + head h (≈47px) ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← the pinned head lives HERE
 │ looking                     ┆ show every digit that still fits      │   and nowhere else
 │ ─ name (Fraunces φ) ─────── ┆ ─ the berth: the note at --type-tag ─ │
 │   marks     [Normal] [Corner] [Center]                              │
 │   what fits [Off] [On]        checking [Off] [Ask] [Live]           │
 │   size      [4×4] [9×9] [16×16]   level [Easy] [Medium] [Hard]      │
 │ writing                                                             │
 │   undo  redo  ╔hint╗ ╔fill╗ ╔solve╗          bare · bare · boxed 2  │
 │ starting over                                                       │
 │   ╔════════╗  ╔═════════╗                                           │
 │   ║  ⚄     ║  ║  ✕      ║   dealt ⊪         boxed 2.5, word @ act, │
 │   ║  deal  ║  ║  clear  ║                    glyph @ --icon-act 36, │
 │   ║ [ no ] ║  ║ [ no ]  ║   ← reserved 44px foot, hidden at rest    │
 │   ╚════════╝  ╚═════════╝                                           │
 │ players                                                             │
 │   play together   share   · the roster ·   leave                    │
 └═════════════════════════════════════════════════════════════════════╝
```

**Principles.** (1) The box means "this changes the board"; the heavier box means "this throws it
away". (2) The ask never reflows. (3) A sticky surface with a ground never paints over a control:
the pinned head lives in the pin band. (4) Every answer is reachable by a thumb, a key and a
reader. (5) One memorable thing: the face that asks in place.

**The tell review.** (a) Cream, serif display, one red: the house, brief-pinned. (b) "A label
above every block": four bands, not seven, and the name is the band's promise, not an eyebrow.
(c) The armed face's `no` as an underlined word inside a button was the generic "cancel link"; it
was also 3.3% of the face and invisible to AT. Revised: the answer is a real control with the
face's own foot as its target (§3.4). (d) The 8% ground was a card-kit tint doing no work
(1.19:1); cut. (e) Motion: nothing unbidden.

---

## 1 · The taxonomy (pass 1 §1 stands) with two rulings closed

- **Tier 3 asks on EVERY pointer.** The arm drops `isCoarse` (GCP:518/:553); M12 is pointer-
  agnostic ("any destructive action"), and a band that promises "asks" cannot be true on the phone
  and false on the desk. T4-WU/U3's coarse gate was fat-finger prevention; the undo spine is
  recovery; the ask is now the band's law. W1 §1.5 owns the mechanism.
- **The fourth band stays `players`.** Fraunces gets its `p` (`U+006B-006F` → `U+006B-0070`, the
  P5 re-cut, ≈ +488 B banked). `sharing` and the twelve others are refused: renaming a band to
  green a font gate is the circularity the chair struck.

---

## 2 · Tokens and rungs (pass 1 §2 stands; deltas)

`--type-group-title: var(--type-heading)` at every width (typography.css:135 deleted); `.section-
heading` in the card reads it; StagingBand's unlayered override means the gallery is Δ 0.00 (proved
at source: the re-rank claim is STRUCK). Tier-3 word at `--type-act`. The 45% ring literal
(index.css:896-903 in the worktree) re-points to `--ring-ink` on all 23 dock / desk controls.

---

## 3 · Components and states

### 3.1 The band and its head — inside the pin band

`.cost-band-head { position: sticky; top: calc(0.6rem - var(--card-pad-t)); z-index: 35;
background: var(--color-card) }`, the head 37.45px; the card's `padding-top: var(--pin-band)` where
`--pin-band: calc(0.6rem + var(--cost-head-h))` ≈ 47px, declared beside the head's rule and
published as `--card-pad-t` by the existing GCP:622 pass. This is the section's class cure (the
same reserve CTRL-TAPE pays): a pinned head lives INSIDE the padding band, where W2's fold sentinel
already paints solid card over scrolling content, so the head covers paper the sentinel already
covers and never a control. Measured disease at HEAD-of-pass-1: 71.5% of the size chips at dock
scrollTop 58, 63.3% of Easy/Medium/Hard at 116, `elementFromPoint` → `section-heading`. Under the
band: 0 below the exempt line. `scroll-padding-top` becomes `var(--pin-band)` so a focus landing
scrolls clear. The last band's head pins too (I3′'s desk residue).

Bands separated by air (`margin-top: 0.9rem`); no frame, no rule. `BoilDivider` ×1 between
`looking` and `writing`. The card's foot: `padding-bottom: 1rem` (the hover berth moved into the
heads—§3.5) and the bottom fold fade at the card's own edge.

### 3.2 Tier 1 · the option row — unchanged

### 3.3 Tier 2 · the writing face — unchanged (pose-0 stroke 2, no ground; `undo`/`redo` bare)

### 3.4 Tier 3 · the asking face — the memorable thing, now with three exits

The face is a `<div class="act-face">` (the `HandDrawnOutline :pose="0" :stroke-width="2.5"`)
holding TWO buttons, siblings, in a 1×1 grid per cell:

```
 rest                          armed
 ┌──────────────┐              ┌──────────────┐
 │   ⚄  (36)    │ .act-verb    │   ⚄          │  .act-verb  name "Press again to deal a new board"
 │   deal (16)  │              │   sure? 600  │  --color-red-ink on BARE card (4.99 / 6.30)
 │ ┄┄┄┄┄┄┄┄┄┄┄┄ │              │ ┏━━━━━━━━━━┓ │
 │  (reserved,  │ .act-answer  │ ┃    no    ┃ │  .act-answer  real <button>, 73.59 × 44,
 │   hidden)    │  visibility  │ ┗━━━━━━━━━━┛ │  FOCUSED on arm, --type-tag, foreground 16.38
 └──────────────┘              └──────────────┘
   face 73.59 × ~100: the foot is reserved at rest, so arming moves NOTHING (Δ [0,0,0,0])
```

| state | `.act-verb` word | `.act-answer` | ink | focus | AT |
|---|---|---|---|---|---|
| rest | `deal` / `clear` | `visibility: hidden`, box kept (44 tall) | foreground | — | name `Deal a new board` |
| armed | `sure?` w600 | visible, `no` | `--color-red-ink` word on bare card | **moves to `no`** | verb name `Press again to deal a new board`; both buttons `aria-describedby` the sentence |
| disarm | rest | hidden | — | returns to the verb | name restores |

Exits, all measured on the real surface:
- **pointer**: a second tap on the verb (the top ~56px) DEALS — the two-tap idiom the owner passed
  twice; a tap on `no` (the foot, 73.59×44, ≥ the tap floor) disarms.
- **keyboard**: arming moves focus to `no`, so the SECOND ENTER LANDS ON `no` and disarms (the
  chair's "a second Enter never deals", satisfied literally and by the safer-option rule). Shift-Tab
  reaches the armed verb; Enter there deals (the reader has moved deliberately). **Escape disarms**
  via a bubble handler on the wrap that calls `stopPropagation` ONLY while something is armed, so
  a second Escape still reaches `GameScene.vue:176` and closes the sheet. Focus leaving BOTH
  buttons (focusout to outside the face) disarms.
- **time**: `MOTION.confirmWindowMs` (2500, the section's one number; pass 1's 4000 retires).
- **elsewhere**: `disarmElsewhere` (`pointerdown.capture`) unchanged, plus its keyboard twin above.

No live region is born: the focus move announces `no, button`, its description carries `sure?`,
the verb's name carries the ask. `check-live-regions` stays 10 declared / 0 born speaking. No
`role=dialog` anywhere.

### 3.5 The berth — the note lives IN the sticky head

One note node per band, INSIDE `.cost-band-head` (the flex row's right slack), driven by
hover/focus of the band's verbs; `aria-describedby` targets re-pointed to the head's node
(`playersHintId` etc.); `aria-hidden` on the visible node as the `wide` tapes are today; not a live
region. Rank `--type-tag` (39.39 tall worst, budget 41.45 = head + 4px air; clearance 2.06).
Width cap: `max-inline-size: calc(100% - var(--band-name-w) - 0.5rem)`; the note never covers the
name (slack 271.13 / 272.73 / 197.50 / 272.63). Rule: a note is ≤ 2 lines at tag rank; the `share`
note (`share this board and everyone writes on the same grid`, 41.02 tall) is a COPY ROW: re-cut
to ≤ 40 characters per line or two lines that fit `players`' slack. Measured at `scrollTop =
scrollHeight` with live pointer coordinates: the note never leaves the port and never covers a
control (pass-1 critic's 16.5% / 163px readings → 0).

### 3.6 Players · 3.7 the phone's two poses · 3.8 the desk — unchanged from pass 1, except:
the desk now ASKS (3.4) and draws the ask's face with its `no` foot; the roster is capped
(`max-height 7.5rem`), so I3′ is stressed at the SHORT PORT (900×500, 284 against a 361 `looking`
band; and 844×390), not with a roster.

---

## 4 · Motion

| moment | what | curve | duration | home |
|---|---|---|---|---|
| arm / disarm | opacity crossfade of the stacked words; `visibility` flips at the ends | `--ease-standard` | 150ms | CSS |
| the disarm window | JS timer | — | 2500ms | `MOTION.confirmWindowMs: 2500` |
| focus move on arm | none (same frame) | — | 0 | — |
| hover ground (boxed faces) | background/color | `--ease-standard` | 150ms | `MOTION.inkLiftMs: 150` |
| sticky heads | nothing; they stick | | | |

PRM: the crossfade collapses to the `visibility` swap.

---

## 5 · The bill (re-priced)

| arm | dock 390×844 | note |
|---|---|---|
| pass-1 build | 744 / 628 (HEAD 699) | measured |
| the pin band: padding-top 6 → 47 | +41 | the section's reserve, paid once |
| the `no` foot 18.19 → 44 (both faces share a row) | +~26 | reserved at rest |
| the 8% ground dies; the head's note berth | 0 | |
| `padding-bottom` 3.5rem → 1rem | −40 (already in pass 1) | |
| **ceiling** | **≤ 815** (was 760) | declared as the pin band's + the answer's price, or the family ships 390/375-only |

Desk ≤ 1182 + 27 (the band) = 1209; landscape 900×500 ≤ 820 + 27. The 430 seam is
`--sheet-chrome`'s by construction (case top 216 at all three widths); the family CONSUMES W2
§2.5's derivation (CTRL-TAPE pass-2 §1.5: wordmark foot + case offset, no fallback) and reports the
seam at 390/375/430 and 844×390.

---

## 6 · What dies (pass 1 §6 stands) plus

The 8% ground (card AND `GameGallery.vue:1459`, one commit); `isCoarse` on the arm; the
`aria-hidden` `no` span; `.washi-tag[data-under-bar]` selector AND writer (the ALLOWLIST is `[]`;
`check-theme-selectors` exit 0); `html.theme-turning .action-bar` (index.css:665) and the
`.mobile-heading-btn` tap-floor block (:831/:848) — the dead die census-zero; the two `2500`
literals; the `--fold-tools-h, 3.5rem` fallback (the publisher reads the row's CONTENT height —
`fold.firstElementChild.getBoundingClientRect().height` — never the box carrying the min-height,
so it cannot ratchet; no fallback: an absent publisher is loud); `--type-group-title`'s md arm.

---

## 7 · Plan (files, order)

Replay `wf_e58b4764-0fc-40`'s diff into a fresh worktree; prettier first (it was RED); then:

1. `typography.css:135` — delete the md arm. `index.css` — the Fraunces range + re-cut woff2;
   `.act-face` hoisted block loses `.is-heavy`; the ring reads `--ring-ink`; :665 and :831/:848
   swept.
2. `pencilConfig.ts` — `MOTION.confirmWindowMs: 2500`, `inkLiftMs: 150`.
3. `GameControlPanel.vue` — `.act-face` as a div with two sibling buttons; focus-to-`no` on arm;
   Escape (bubble, conditional stop) + focusout disarm; `isCoarse` dropped; the head's `top` and
   `--pin-band`; the note node per head; `--fold-tools-h` publisher re-aimed, no fallback; the
   `data-under-bar` writer deleted; `scroll-padding-top: var(--pin-band)`.
4. `SheetWashiLabel.vue:190` — the rule deleted.
5. `GameGallery.vue` — the ribbon's destructive face loses the ground (one face, two files).
6. `scene.css` — `padding-top: var(--pin-band)` (the utilities' top component removed at
   GameScene.vue:196); `--sheet-chrome` consumed from W2 §2.5's row.
7. `GameControlPanel.test.ts` — 15 rows: 2 copy-rank, 8 zone-grammar re-cut, 5 SPOKEN rows re-aimed
   at the `players` band's share button (`.cost-band[data-band=players] .icon-btn.share`). The 22
   e2e hits across six specs (incl. `share-truth.spec.ts:54`) re-aimed.
8. `check-font-coverage.mjs` corpus (bands, captions, `sure?`, `no`); `check-copy-register` (the
   solve tape's ADMITTED row struck).
9. Instruments (proposed diffs under `pass2/prototype/CTRL-COST/instruments/`): the occlusion
   predicate on a pinned head with `belowExemptBand` (from CTRL-TAPE's `r2-tape.mjs`), the
   oklab-capable composite reader, r0 `law-probe` L3/R3 copies (MOVED).

---

## 8 · Prototype brief

Server `127.0.0.1:4233 --strictPort` (next free if held; verify identity in-probe: four
`.cost-band` names, 0 `.action-bar`, 5 `.act-face`), private `cacheDir`, scratch Playwright config
with `PLAYWRIGHT_BASE_URL` explicit; both engines; settle ≥700ms; goldens + filter-census off
`npx vite build` in the worktree on a lane preview port.

**Crops (≤4):** (1) 390×844 light, `starting over` at rest and ARMED on `deal`, the same box, the
`no` foot visible — one crop holding both poses side by side; (2) the same pair in dark (`#ff5c7c`
on bare card); (3) 390×844 at scrollTop 116, the pinned `looking` head inside the band with
Easy/Medium/Hard fully clear below it; (4) 1280×800 light, `fill` hovered, its note in the
`writing` head beside the name, nothing covered.

**Censuses:** r0 `heading-voice.spec.ts` (4/4; names 4, voice 1, `<h2>` 4/4, ratio 1.2944); the
semantic hardening row; R6 hue-census COPY (29 rows), `law-probe` COPY (L1 = 9, L3/R3 re-aimed,
L5); R7 I2′/I3′ (5 states, desk, dock AND 900×500 / 844×390 — the handover cell), I4 + the undo
proof (solve after its wave); the OCCLUSION PREDICATE on the pinned head at dock 0/58/116 and desk
0–350 with `belowExemptBand` (0 below the line); ZERO REFLOW on arm and disarm (Δ [0,0,0,0], three
cells, both engines, with the `no` foot visible); the KEYBOARD WALK with elapsed ms per read
(pointer: tap→armed, tap→dealt; keyboard: Enter→armed AND focus on `no`, Enter→disarmed AND
board unchanged, Shift-Tab+Enter→dealt; Escape→disarmed AND sheet still open; Escape again→sheet
closed); painted-bytes contrast (asked word ≥ 4.5 both themes on bare card; `no` ≥ 4.5; band
name; caption); tap floor at 390 coarse with the per-dimension control incl. `no` 73.59×44;
`--fold-tools-h` across a shrink-and-restore sequence (published value falls back when content
does); the note at `scrollTop = scrollHeight` (in port, covers nothing); the gallery pi at 390/1280
(Δ 0.00, five readings); `check-theme-selectors`, `check-live-regions` (10 / 0), `check-font-
coverage` (exit 0, byte delta banked), `check-copy-register`, prettier, `lint:motion`, the unit
battery — BARE.

**Success:** every row at its number; dock ≤ 815 / desk ≤ 1209 / land ≤ 847 or the record says
390/375-only; the crops show one box that does not move when it asks and a `no` a thumb can hit.

---

## 9 · Born-RED gates

| id | row | at HEAD | under the family |
|---|---|---|---|
| G1–G4 | as pass 1 (heading voice; semantic hardening; I2′ strips; I3′ pin ownership at 5 states incl. the short-port handover) | RED | GREEN |
| G5′ | a tier-3 press on a dirty board writes 0 and arms on BOTH pointer classes | RED (desk deals at once) | GREEN |
| G6′ | zero reflow with the `no` foot visible, Δ [0,0,0,0], 3 cells, 2 engines | RED (no foot exists) | GREEN |
| G14 | KEYBOARD: Enter arms + focus on `no`; second Enter disarms, board unchanged; Escape disarms and the sheet stays; second Escape closes; focusout disarms | RED (second Enter DEALS; Escape closes the sheet armed) | GREEN |
| G15 | `no` is in the a11y tree, ≥ 44×44 per dimension with a firing control | RED (aria-hidden span 12.67×18.19) | GREEN |
| G16 | the pinned head covers 0 of its band's controls below the exempt line at dock 58/116 and desk 0–350 | RED (71.5% / 63.3%) | GREEN |
| G17 | the note stays in the port and covers nothing at `scrollTop = scrollHeight` | RED (163px off-port; 16.5% of redo) | GREEN |
| G9′ | asked word ≥ 4.5 light on bare card, both engines | RED as pass 1 (4.20 on the 8% ground) | GREEN (4.99) |
| G18 | `--fold-tools-h` does not ratchet; no fallback literal | RED (66 stays 66 after content shrinks) | GREEN |
| G19 | `check-theme-selectors` exit 0 with `[data-under-bar]` gone both sides | RED on the pass-1 tree | GREEN |
| G12′ | `check-font-coverage` exit 0 with `players` in Fraunces (the `p` re-cut) | RED | GREEN |
| Guards | seam ≥ 8 (consumed derivation) at 390/375/430/844×390; height ceilings; filter 9; hue 29; gallery Δ 0.00; live regions 10/0; goldens 4/4 | must hold | |
