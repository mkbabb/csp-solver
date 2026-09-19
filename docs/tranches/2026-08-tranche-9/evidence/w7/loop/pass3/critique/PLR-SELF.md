# PLR-SELF · pass 3 — ADVERSARIAL CRITIQUE

The stub is you. §11's leader, and the seat of the section's substrate (CHAIR §6.9/§6.12).
Prototype: worktree `wf_f72f3b5a-83a-51` off `74a2b5d9`, uncommitted, 17 modified files + 3 new
paths. I did not write the spec or the prototype.

**Verdict: ADVANCE. Convergence 82%.** The design holds, it runs on both engines, and every gate
it names has a reading. What it is not is finished: **twelve open gaps**, three of them found by
this critique's own runs — one in the `@property` primitive this leader is seating for the whole
wave, one in the π it declared but never priced, and one at 1280×799.

| my instruments | |
|---|---|
| servers | prototype `127.0.0.1:4238` (worktree, private `cacheDir`), HEAD control `127.0.0.1:4239` (main tree, src frozen at `74a2b5d9`) — both **killed by pid**, band 4230–4249 reads empty |
| probes | `instruments/c3-critic.spec.ts` (C1–C5), `c3-well.spec.ts` (C6), `c3-cliff.spec.ts` (C7), `critic.config.ts`, harness copied from the prototype's bank; run from a scratch dir in the worktree, **removed after** (the prototype's worktree is left exactly as it was returned) |
| logs | `logs/critic-chromium.log`, `critic-webkit.log`, `critic-c6.log`, `critic-c7.log`, `gates.log`, `server-*.log`, `pids.txt` |
| crops | none minted — every claim below is a number (the family's four are cited in §5) |

---

## 1 · What I re-measured, and what it says

**C1 — G4c's red does not reproduce, on either engine.** Short phone 390×664, coarse, five at the
table, sheet open, lap probed at the **intersection centre** with the sheet re-opened before each
read and no other clicking in between:

| cell | lap w × h | top element at the lap point | tap → sheet | cells selected | focus moved into a cell |
|---|---|---|---|---|---|
| 0–5 | 40.2 × 15.6 | `div.player-lobby` (stack: lobby → board-wrapper → …) | shut | 0 | no |
| 6 | **0.7** × 15.6 | `div.board-wrapper` | shut | 0 | no |

Identical chromium and webkit. Cell 6's lap is a 0.7 px sliver at the sheet's own right edge
(sheet x 0–256, cell 6 x 255.4–295.6) — geometry, not a mystery. The prototype's chromium row
read `input.cell-native-input` at cells 2–6; the one difference in method is that its loop clicks
each cell's **own centre** between lap probes and then re-uses geometry measured before those
clicks. **And the question the lane did not ask is answered: the lapped tap reaches nothing** —
0 cells selected, `activeElement` never inside a cell, on every one of the seven.

**C2 — π, against the HEAD control at `74a2b5d9`.** Solo and in a room of three, desk 1280×800
and phone 390×844, both engines. The **only** box that differs anywhere:

`.corner-left` **75.5 → 120.7 wide** (+45.2 = the mark's own box), same x, same y, same height.
`.controls-card` 825.9/140.5/324.2×608, `.board-wrapper` 129.9/122.5/640×640, `.drawer-tab`
761.9/398.5/48×92 and cell 0 70.7×70.7 are identical on both trees, solo **and** in a room, at
both viewports, on both engines. The mark costs the estate nothing it did not declare.

**C3 — AA, recomputed from computed colours** (composite over the sheet's own ground, not a
glyph-core sample), desk, three at the table:

| | ground | state line / qualifier | row names |
|---|---|---|---|
| light | `rgb(252,251,251)` opaque | **5.19** | 5.59 · 5.97 · 6.02 · 6.19 |
| dark | `rgb(18,16,15)` opaque | **6.03** chromium / **6.10** webkit | 9.64 · 9.89 · 9.93 · 10.55 |

Every rung clears 4.5:1 in both themes. The family's own numbers (5.16 / 6.10) are confirmed by a
second method. The opaque ground is what makes these numbers rather than luck — the strongest
single decision in the family.

**C4 — the `@property` landing does NOT do what CHAIR §6.5 asked.** Before: `--head-rule` reads
`12px` at the root, at `.page-root` and at the corner; registration present; `.corner-left`
`top: 12px`. Then I struck **the publisher alone** (`.page-root { --head-rule: initial }`,
registration intact — which is exactly "the publisher never shipped"):

`atPageRoot 12px · corner top 12px · corner y 12 · corner-right top 12px` — **both engines.**

An unpublished token and a published one paint the same pixel. That is the sentence the diff's own
comment condemns (`index.css:110`: "a fallback on a MEASURED token is a lie that cannot be
caught"), re-created one layer down as `initial-value: 12px`. The publisher is
`calc(0.75rem + env(safe-area-inset-top, 0px))`, so on notched hardware its absence would silently
drop the inset. `e2e/player-mark.spec.ts:256`'s comment says "strike the publisher AND the
registration … computes `auto`"; the row does not strike anything, and its two assertions pass
identically with or without a publisher.

**C5 — filters 9 · 9 · 9** (settled / lobby open / incumbent card open by hover), both engines, on
the **dev server**. Mark box 45.125 × 39.75 fine.

**C6 — the 64 px is 105, and nothing was priced.** Desk, five at the table, both trees:

| | prototype | HEAD | Δ |
|---|---|---|---|
| the well (`.tray-well` holding `.players-roster`) | 284.2 × **45** | 284.2 × **150.1** | **−105.1** |
| `.controls-card` `scrollHeight` | **1120** | **1226** | **−106** |
| `.controls-card` box | 324.2 × 608 | 324.2 × 608 | 0 |
| `.control-panel-wrap`, `.peek-hold-surface`, `.copy-status`, the first tray well | — | — | **+22 dy each** |

Identical on both engines. The card's outer box does not move (π on its frame holds), but its
whole content sits **22 px lower** and its scrollport is **106 px shorter**. The lane's G15 names
"RED at HEAD: 109" and the diff's CSS comment says "284.2 × 109 → 284.2 × 45, and the 64px is the
controls card's". My read says 150.1 → 45. The pixels are the control estate's — §10's surface —
and no row in the bank names what travelled.

**C7 — the row budget has a cliff at the desk.** Seven at the table, 1280 wide, chromium:

| viewport | `(min-height: 800px)` | rows drawn | compression line | sheet h | sheet bottom | board top |
|---|---|---|---|---|---|---|
| 1280×800 | true | **4** | `and 3 more` | 170.7 | 222.4 | 122.5 |
| 1280×799 | false | **1** | `and 6 more` | 103.5 | 155.2 | 122.5 |
| 1280×780 | false | **1** | `and 6 more` | 103.5 | 155.2 | 122.5 |

One pixel of viewport turns four names into one. The stated reason for `ROWS.short` is the phone's
board top ("a short one (664) has nothing to clear it with") — but on the desk the sheet laps the
board at **both** heights (122.5 against 222.4 and against 155.2, and the desk lap is CH-71's
accepted pose), so the compression buys nothing at 799. A 900 px screen with browser chrome is
this viewport.

**Estate gates, re-run by me in the worktree:** `lint:copy` 0 · `lint:live-regions` 0 ·
`lint:motion` OK (35 specs) · `lint:knip` 0 · `test:font-coverage` OK (Patrick Hand 46 cp /
4,312 B, 27 declared strings over 5 groups). All exit 0. M16 holds and the copy table is read by
the fold's own `COPY_TABLE_NAME` arm.

## 2 · Strengths, said once

- **The seam is real and it is the family's best idea.** `@pointerdown.prevent` + "the mark has
  focus when it is activated IS a key did it" gives two honest opens from one control: a keyboard
  open moves focus into a named `role="group"` (so the rows are readable), a mouse open moves focus
  nowhere (so the cell you were writing in keeps it and the room is told nothing). The Escape
  return is guarded by the APG's own premise rather than by a condition bolted onto it.
- **The furniture is a substrate, not a look.** `line-height: 1.35` declared on the sheet,
  `gap: 0` said out loud, `min-height: 1.4rem` on the row → **22.391 px in both pointer regimes**,
  and `H = 36 + S + 5.6 + 22.4r + (1.6+S)m` exact to 0.05 px at three points in both engines. That
  is what PLR-COUNT and PLR-PLACE graft onto.
- **The opaque ground is argued from a measurement** (the wordmark's bleed at 204 under 80%
  compositing to 4.23:1) and it converts every AA reading on the sheet into a number.
- **Four of its own spec's numbers are refuted in public** — the pose floor, the deck's live-region
  delta (+2, not +1), the dark worst index, and the shape of the `--head-rule` born-RED — with the
  measurement that refuted each.
- **The return declares its own sins**, including killing sibling lanes' servers with a wide
  `pkill`. That is the behaviour the loop wants.
- **Eleven orphan gates landed in the estate** (`e2e/player-mark.spec.ts`, 14 rows, 12/12 green on
  chromium; `filter-census.spec.ts` G3.6), each with a declared negative control, and the webkit
  Tab holdout is written per row with its platform reason.

## 3 · Open gaps (each a sentence that could be closed)

1. Re-cut G4c's probe so the lap geometry is re-read per cell rather than re-used across the
   cell-centre clicks the loop interleaves, then mark G4c green or name the cause — this critique
   reads `div.player-lobby` at all six fully lapped cells and `div.board-wrapper` only at cell 6's
   0.7 px sliver, on both engines, with 0 cells selected and focus never entering one.
2. Register `--head-rule` with an `initial-value` that FAILS VISIBLY (`0px` is computationally
   independent too) and assert the publisher's absence lands `.corner-left` at the viewport edge —
   at `12px` the registration re-creates the struck `, 0.75rem` fallback and both engines compute
   `top: 12px` with the publisher gone (C4), including the `env(safe-area-inset-top)` term.
3. Bank the control-estate π row the "64 px" stands in for: the well 150.1 → 45, the card's
   `scrollHeight` 1226 → 1120, and `.control-panel-wrap` / `.peek-hold-surface` / `.copy-status`
   each +22 dy against `74a2b5d9`, priced with §10's leader (C6).
4. Gate `ROWS` on the constraint it serves — the coarse regime, or the board's own top — rather
   than on `(min-height: 800px)` alone, and bank the 1280×799 reading (1 row, `and 6 more`, sheet
   bottom 155.2 against a board top of 122.5) as the row that forced it (C7).
5. Make Escape's single owner true in code: `PlayerMark.vue`'s `onWindowEscape` calls only
   `preventDefault`, while `useAnswerKeyPeek.ts:56` answers Escape unconditionally on a window
   listener registered earlier — add `stopImmediatePropagation` (or teach the peek
   `defaultPrevented`) and assert it with the answer-key peek up and the sheet open.
6. Run the dist gates: there is no `dist/` in the worktree, so the extended `filter-census.spec.ts`
   G3.6 scene has never executed, the 9 → 9 → 9 census is the dev server's, and the 4,312 B woff2
   is the source-side gate's figure, not the shipped artifact's.
7. Read F1's `false` arm on the three surfaces it changes (mark, row, deck swatch) and frame one of
   them — `SELF_TAKES_ROOM_INK = false` is asserted buildable and has no reading anywhere.
8. Draft the T7-W2 A4 disposition row CHAIR §6.7 asks §11's leader for — the reason retired, the
   surface that replaces the tab stop, the gate that holds it — the argument currently lives only
   in a template comment and two re-cut `liveRegions.test.ts` rows.
9. Refer the pose floor to the owner's eye (U-10) or derive it from something other than this
   prototype's own reading: the gate now pins 1.14 CSS px at the widest vertex of a 20 px stub,
   the raster half was re-worded by the lane after the spec's threshold proved unreachable, and
   frame 3 reads as one rectangle printed twice at crop size.
10. Re-run the estate battery alone (it stood at 64 green / 3 red with webkit inside
    `multiplayer.spec.ts`, and `join-language.spec.ts:69`'s webkit timeout was read under
    contention with a second playwright run).
11. Fix G14's webkit race by waiting on the room before reading the deck (chromium reads the head
    ink live and three swatches; webkit read graphite and one).
12. Inherited and unmoved: the accent-family law (PAL-WALK), r0 I4/I5, real iOS (M19), and any
    relay arm beyond `?wire=local`.

## 4 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | clear — every gate has a named negative control (the 40 px tap floor, `boilAmount 0`, the HEAD server, the planted dash) |
| spec-cites-itself circularity | **HIT** — the pose floor is pinned to the measurement it certifies (gap 9); declared by the lane, referred to the agglomerator |
| gates that cannot fail | **HIT** — G18 asserts the registration, not the publisher; its own comment describes a deletion the row does not perform (C4, gap 2) |
| the elegant-reduction trap | clear — no "and then the hard part": the compression line, the two opens and the lap are each built and measured |
| legacy aliases | clear — `COPY_SOURCES`, the prop default, `@focusout`, the pressure lift and the roster's pixels are struck, not renamed |
| masked fallbacks | **HIT** ×3 — `initial-value: 12px`; `var(--ring-ink, currentColor)` in new CSS with **no publisher anywhere in the tree**; `var(--tap-floor, 2.75rem)` copied into the new component while the same diff strikes a fallback elsewhere as a matter of law |
| unverified gestalt | partial — desk light and phone dark are framed on the real surface; F1's `false` arm and the 1280×799 compression are unframed (gaps 4, 7) |
| consumer-less substrate | clear — `claimHeadDisclosure` / `closeHeadDisclosures` / `PRESENCE_QUIET_MS` / `quietMsOf` / `--presence-ink-dur` / `types.ts` all have readers; `lint:knip` 0 re-run by me |
| the generic default | clear — the sheet is the incumbent card's own pose, the stub is the estate's own boil at the well's seed 67, no eyebrow, no arrow, no numbered marker |
| the pixel it moves that it did not declare | **HIT** — the controls card's +22 dy and −106 scrollport (gap 3); otherwise π is clean against HEAD (C2) |
| the constraint it forgot | **HIT** — Escape's one-owner law (gap 5) and the dist half of `filterBudget` (gap 6); AA, M16, W2's tap floor / dock / sticky tag and the decided history hold |

## 5 · The frames, looked at

`1-desk-mark-and-sheet.png` (14,772 B) — the CH-71 frame: sheet open over the wordmark and the
board's first cells, four names each in its own ink, `you` at the first row's end. The ground reads
opaque and the type reads as one hand. `2-phone-dark-compressed.png` (51,646 B) — `6 other
players` + 4 rows + `and 3 more`; in dark the sheet's ground (18,16,15) sits within 2 of the page
(17,15,14), so the 30 % border is the only edge, and it holds.
`3-pose-rest-vs-hovered.png` (731 B) — the two poses are all but indistinguishable at crop size;
this is the evidence for gap 9. `4-deck-swatch-in-a-room.png` (37,905 B) — F1's declared delta on
the deck, three dots in the room's inks.

## 6 · Verdict

**ADVANCE at 82 %.** Not 100: twelve gaps stand, and gap 2 is in the primitive every §10 lane will
copy — a leader that seats the wave's first `@property` has to seat one whose born-RED can fire.
Not BANK: nothing here is parked; the centre (one mark, one sheet, two honest opens, one furniture
law) is the section's and the siblings are already grafted onto its selectors. Not BLOCK: no
missing primitive — every gap above is a re-run, a number, a row or one word of CSS. Not RETIRE:
the one re-worded gate is declared in the return and handed up, and no constraint is breached.
