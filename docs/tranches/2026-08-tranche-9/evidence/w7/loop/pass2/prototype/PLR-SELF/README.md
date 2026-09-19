# PLR-SELF · pass 2 (PROTOTYPE) — your mark, in your ink

T9-W7 §11 · §12 · M14. The synthesis's §7 plan, built as product code in an isolated worktree
and run on the real surface, both engines. Nothing committed; nothing on the main tree but this
evidence. U-10 — this proposes.

| | |
|---|---|
| worktree | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52`, branch `worktree-wf_8630d340-e56-52` off `a8fee1f5` |
| dev server | `127.0.0.1:4241`, `--strictPort`, private vite `cacheDir` (`probe/vite.plr-self.config.mts`) — **killed before return** |
| probe | `probe/p2-*.spec.ts` + `probe/harness.ts` + `probe/plr-self.config.ts`; r0's copies under `probe/r0/`; every reading in `probe/readings.txt` |
| frames | `frames/`, **4 crops, 105,665 B total** (cap: four, ≤150 KB each) |
| replay | pass 1's `patch-tracked.diff` applied `--3way` CLEAN (6 files), `new-files/` copied (4), vue-tsc exit 0 before a line of pass 2 was written |

**Verdict: every born-RED gate is GREEN on both engines, and three of the spec's own numbers are
refuted by measurement — the height law, the live-region ORDER, and the AA method the sheet is
read with.** Two substrate rows stay RED by design (r0 I4, I5).

---

## 1 · The gates

| id | asserts | reading | verdict |
|---|---|---|---|
| r0 **I2** | your own swatch is the colour the room sees | `self=oklch(0.5 0.11 0)` · `room=oklch(0.5 0.11 0)` | **GREEN** both engines (RED at HEAD) |
| r0 **I3** (MOVED) | a `/player/` button in the head opens the lobby | candidates **1**; pair **2**, visible **1**; the press opens the painted sheet | **GREEN** both engines, through `instruments/I3-visible.diff` |
| r0 **I4** | an agreed index survives a rival `st` | 137.5° → 327.5° | **RED**, unchanged (substrate; made visible, not cured) |
| r0 **I5** | a live claim is never re-issued | `collided: true` | **RED**, unchanged (substrate) |
| **G1** solo-identity | 24-cell palette, no room vs the mark mounted vs a room of one | `["rgb(10,10,10)\|#2563eb\|", "rgb(10,10,10)\|#2563eb\|rgb(10,10,10)"]` — identical | **GREEN** both engines |
| **G2** filter-census | exactly 9, sheet OPEN, both regimes | shut **9** → open **9** → PRM **9** | **GREEN** both engines |
| **G3** tap-floor | 44×44 coarse, with a 40px negative control | mark **45.1 × 44**; the control fails **both** arms | **GREEN** both engines |
| **G4a** sun + desk | right edge < sun left; the height law; no scroll | right **256** < sun **1072**; h 162.7 vs law 162.72 (**Δ −0.02**); board lap **89.9**, wordmark lap **19.9%** | **GREEN** both engines |
| **G4b** tall phone | 5 rows clear the board's top | bottom **209.3** < grid top **221.7** — **12.4px** clear (webkit 12.1) | **GREEN** both engines |
| **G4c** short phone | the lap is the law, and every lapped cell dismisses | 2-row budget → 1 row + `and 4 more`, h 97.8 vs law 97.92 (**Δ −0.12**); lap **10.1px**, **7** lapped cells, **7/7** dismiss from the covered part AND from the uncovered centre, **0** reach a control | **GREEN** chromium; see §3.4 |
| **G5** sheet-AA | glyph cores on the OPAQUE ground with the wordmark under it, sudoku + futoshiki, both themes | ground `rgb(252,251,251)` / `rgb(18,16,15)`, wordmark under the sheet in all four arms; quiet rung **5.16** light / **6.02** dark; row names **5.59–6.19** light / **9.64–10.55** dark | **GREEN** ×4, both engines (RED on the 80% ground) |
| **G6** live-regions | six playing nodes IN ORDER; the deck adds exactly two, removes none | `margin-note · board-voice · players-status · players-roster · players-alone · copy-status`; deck adds `gallery-live` + `gallery-guard-live`, removes 0; **0 marks in the deck** | **GREEN** both engines — order refuted, §3.1 |
| **G7** M19-whole | a third page joins | activeElement identical (`Row 1, column 1, empty`), `[data-lobby]` hidden, label `1 other player` → `2 other players` | **GREEN** both engines |
| **G8** keys-1 | off `el.focus()`: Space / Space / Enter / Escape | `false → true → false → true → false`, focus on the mark at every step | **GREEN** both engines (RED at HEAD: Enter netted zero) |
| **G9** keys-2 | real Tab arms `:focus-visible`, the ring, pose [1] | **12 hops**; `focusVisible true`, `dashed 2px`, offset `3px`, ring colour == `color` == `oklch(0.5 0.11 0)`, pose moved | **GREEN** chromium; **webkit `test.skip`** carrying its reason |
| **G10** inversion | hovered LIVE mark keeps the walk ink | rest `oklch(0.5 0.11 0)` → hovered **`oklch(0.5 0.11 0)`**; `d` 397 → 394 chars, different string; **zero** hover/focus selectors on `.player-mark` declare a colour | **GREEN** both engines (RED: `rgb(38,38,38)`) |
| **G11** seam | a mouse press sends no `cur`; the cell keeps focus | `cur: 0`, activeElement `input.cell-native-input`, `aria-expanded true` | **GREEN** both engines |
| **G12** mid-flight | 200ms after a join the ink is between the endpoints | quiet `srgb 0.15 / 0.68` → walk `oklch(0.5 0.11 0)`; **48** intermediate frames chromium / **24** webkit; at 150–300ms `oklab(0.385 0.055 … / 0.810)` | **GREEN** both engines |
| **G13** font-cut / copy | the cut holds the five lines; `COPY_SOURCES` reads them | Patrick Hand **46 codepoints, 4,312 B**, 23 declared strings over **4** groups, each derived; copy register **0 dashes · 0 unadmitted**, `copy sources: 1/1`; 22 self-test controls, each RED-or-GREEN as required (4 new) | **GREEN** |
| **G14** deck-swatch | `.game-card-swatch` in a room == the walk ink | head `oklch(0.5 0.11 0)`; deck `[oklch(0.5 0.11 0), oklch(0.5 0.11 137.5), oklch(0.5 0.11 275)]` | **GREEN** both engines — DECLARED, `frames/4` |
| **G15** well-height | the players well ≤ 284.2 × 48, live | **284.2 × 45** (webkit 284.3), 5 rows, `sr-only`, `tabindex` null, `role=log`, `aria-live=polite`, swatch present | **GREEN** both engines (RED at HEAD: 109) |

**The 40-index walk at 100%**, painted through a canvas rather than a re-resolved string:
light **bg 5.23 / card 5.36**, dark **bg 9.71 / card 9.50** — against the spec's declared 5.26 /
9.56 and a 3:1 floor.

**Censuses re-run, all unchanged.** R6 **hue census** byte-identical to
`r0/r6-idiom-history/hue-census-HEAD.txt` (0 diff lines, 29 token rows); R6 **law probe**
byte-identical; the **family law** identical — 37 collisions in the first 16 indices, exit 1,
PAL-\*'s row and not this family's. Copies with their paths re-pointed at this worktree are in
`probe/r0/`.

**Batteries.** vue-tsc **exit 0**. Unit **66/66 files, 809/809 tests** (pass 1 stood at 808/810
with the two rows §7.8 retires; both are re-cut here). The estate's roster-touching e2e specs —
`join-language`, `join-language-prm`, `presence`, `session-substrate`, plus the new
`player-mark` — run on this server, **32/32 passed both engines** (`probe/estate.txt`,
`probe/estate.config.ts`), which closes pass 1's §3.4 gap for four of its five specs. ESLint clean on every touched file;
prettier clean.

## 2 · The diff

14 tracked files (**+506 / −362**), 5 new. `git -C <worktree> diff --stat` is the authority.

- `useSession.ts` — self takes `inkFor(index)` in `mint` and `adoptInk` (F1); `PRESENCE_QUIET_MS
  = 20_000`; `lastHeard` at the one arming site; `quietMsOf` exported. *(from pass 1)*
- `pencilConfig.ts` — `MOTION.presenceInkMs: 400`. *(from pass 1)*
- `icons/PlayerStub.vue` — **two poses**, `generateRectBoilFrames(…, 0.4, 2)`, prop `pose`.
  Frame 0 is the base path and is independent of `boilAmount`, so the rest pose is byte-identical
  to pass 1's.
- `PlayerMark/PlayerMark.vue` — `@pointerdown.prevent`; `@keydown.enter` **deleted** (CH-70);
  `--mark-ink` bound once and never touched by `:hover` / `:focus-visible`; the lift is a POSE;
  window-bound Escape on open, removed on close, honouring `defaultPrevented`; `@focusout`
  closes; `ROWS = { tall: 5, short: 2 }` on one `(min-height: 800px)` MQL in a module-scope
  `<script>` block, so the head's two instances share one listener.
- `PlayerMark/PlayerLobby.vue` — the ground is **OPAQUE** and the `prefers-reduced-transparency`
  arm is deleted as a no-op; `@click.stop` **deleted** (a tap dismisses); `LOBBY_COPY`.
- `PlayerMark/copy.ts` — **new**. Five lines, one constant, read by the font derive and the copy
  register both.
- `AttributionCard.vue` + `useHoverCard.ts` — the disclosure isolation div and the `#mark` slot
  *(from pass 1)*; `@keydown.enter.stop` deleted; the false comment rewritten in place.
- `App.vue` — `<template v-if="view === 'playing'" #mark>` on **both** instances; the state line
  goes through `LOBBY_COPY`.
- `GameControlPanel.vue` — the roster is `sr-only` unconditionally, keeps `role="log"` /
  `polite` / its label, loses `tabindex`, the scrollport, the fold and the three one-shots;
  `.player-swatch` **STAYS** (CHAIR §6.8). *(from pass 1)*
- `useJoinWash.ts` — the roster half **DIES**: `arriving`, `departing`, `rowArmMs`, `rowHoldMs`,
  `armRow`, `later()` and the timer set, −79 lines. The module now owns one ring and no clock.
- `BoardHost.vue` — the self-cursor guard restated **by id**.
- `GameControlPanel.liveRegions.test.ts` — `:209` / `:221` re-cut to the new law, each as its own
  named row. `useJoinWash.test.ts` — six assertions re-cut; "the roster's two holds" replaced by
  a stronger row (a leave adds no timer of its own, born-RED against the 740ms hold).
- `e2e/join-language-prm.spec.ts:97` — re-aimed off the vacuous `not.toContain('is-arriving')`
  onto the mark's own PRM arm (`transition-duration 0s`, `animationName none`, 0 running).
- `e2e/player-mark.spec.ts` — **new**, LOCAL (O-12), `PRM:` declared in the first 20 lines.
- `scripts/check-font-coverage.mjs` — the `lobbyStrings` derive.
  `scripts/check-copy-register.mjs` — the `COPY_SOURCES` arm with a balanced-initializer reader,
  a STALE half that reds, and four new self-test controls.
- `docs/tranches/LEDGER.md` — **CH-70** (the Enter double-toggle) and **CH-71** (the head's
  disclosures steal the board's top-left cells — the incumbent's row, priced not cured).

## 3 · Gaps and refutations, stated plainly

**3.1 · The spec's live-region ORDER is wrong, and pass 1 measured the same thing.** The spec
§3.5 lists `board-voice · copy-status · margin-note · players-alone · players-roster ·
players-status`. The DOM order is `margin-note · board-voice · players-status · players-roster ·
players-alone · copy-status`, both engines, and pass 1's README §1 G6 banked that exact string.
The spec re-alphabetised a measurement. G6 pins the measured order with the prior reading as its
witness; the count (6, deck +2, none removed) is the spec's and is green.

**3.2 · The spec's height law over-predicts by up to 11.7px.** `H = 58.95 + 23.6r + 20.55m`
(PLR-COUNT's, of a different sheet) reads −11.20 at (4,1) desk, −11.65 at (5,0) tall phone and
−5.30 at (1,1) short phone. The sheet's own box gives the law exactly: padding 32 + border 4 +
state line 18.96 + the rows list's 2.4 = **base 57.36**, plus **21.6** a row and **18.96** for
`and N more`. Δ −0.02 / −0.06 / −0.12 on three points, two viewports, both engines. Desk-fine and
coarse-phone agree because `--type-small` is 16 and `--type-tag` 14.048 on both. **The spec's
coefficients want correcting before any other family cites them.**

**3.3 · The AA method the family relied on is channel-blind, and the first cut of this probe
inherited it.** A darkest-RED-BYTE sampler reads a green ink at oklch 0.5 as 9.8:1 and an amber
at the same L as 2.96:1. Neither is the contrast. The probe now finds the darkest-by-LUMINANCE
pixel and carries its three bytes into the ratio; on that method every row clears its floor
(§1 G5). Any lane quoting a per-channel figure for a chromatic ink should re-derive it. In DARK
the same sampler reports the sheet's ground as the "core" and a glyph body as the "paper" — the
ratio is symmetric so the number is right, but the two labels are swapped.

**3.4 · G4c's "no control reached" is weaker than it sounds, and one cell exposes it.** Of the 7
lapped cells on a 390×664 phone, 6 have their intersection centre land on `div.player-lobby` and
one lands on `div.board-wrapper` — the rightmost, whose intersection centre (x≈255, y≈136) sits
inside the sheet's **1rem bottom-right radius**. It dismisses anyway, because the root's
`closeAll` is the owner. The law holds; "the sheet swallows every pixel of its bounding box" does
not, and a rounded box never did. G4c was re-run on chromium after the fix; G3 / G4a / G4b are
green on both engines and **G4c's webkit arm is unrun**.

**3.5 · The `hi`-into-the-void flake, found and cured in the harness, not the product.** The
invite stamps the URL before the wire's `BroadcastChannel` is listening, and a synthetic `hi`
posted into that gap reaches nobody — it silently cost three gate runs and read as "the mark is
not live". The harness now polls self's own roster row as proof the session has minted, and
delays the channel `close()` past the posting task. Stated because it is a REAL property of the
session that any lane driving a synthetic room will meet.

**3.6 · What this lane did not measure.** Real iOS (M19 forbids it here). Landscape. The relay
arm — the whole battery drives `?wire=local`. A 16-page room built from 16 real pages. The
estate's `multiplayer.spec.ts` (`:193`, `:580` read `.player-swatch`, which this diff keeps, so
they should be green — it is the one roster-touching spec of the five still unrun, a slow
two-page battery). The frontend `dist/` is
untouched, so nothing here is a claim about a built bundle. And the hard part that remains: the
diff has never been read by a non-author.

**3.7 · Made visible, not cured.** r0 I4 (`adoptInk` unguarded against a rival `st`) and I5
(`IDENTITY_CAP` re-issue) are substrate and stay RED; the family law's 37 collisions are PAL-\*'s,
and index 0 — which the host always wears, and now wears on the mark, the self row and the deck's
swatch — still sits 1.0° from `--color-solver-ink-1`.

**3.8 · The chair's §6.1, honoured.** The mark reads a focus-ring token and mints none: the form
is `2px dashed currentColor` offset 3 (DrawerTab's, R6 law 39). Measured on a live mark the ring
is `oklch(0.5 0.11 0)` — the player's own walk ink — so whichever value §6 ships must hold against
40 hues at L 0.5 / 0.8, not against one colour.

**3.9 · One departure from the spec's letter.** The spec asks for `(hover: hover)` on the lift.
The prototype gates it on the EVENT's own `pointerType` instead: `(hover: hover)` answers for the
primary pointer, and the question the lift asks is which pointer is on the mark right now. A
touch never lifts it either way, so the law is unchanged and the mechanism is one comparison
rather than a third module-level MQL.

## 4 · Frames (4, cited)

1. `1-desk-mark-and-sheet.png` (14,321 B) — desk 1280 light, four at the table, pointer parked at
   (900,740): the head's stub and the `deafening-reindeer you` row are ONE rose on an opaque
   ground, and the wordmark's `sud` is visibly BEHIND the sheet rather than through it. §1 G5.
2. `2-phone-dark-compressed.png` (51,948 B) — 390×844 coarse dark, seven at the table:
   `6 other players`, four rows, `and 3 more`. The three populations in one picture. §1 G4b.
3. `3-pose-rest-vs-hovered.png` (593 B) — the live mark at rest [0] beside the hovered [1], same
   ink, different path. §1 G10 carries the numbers.
4. `4-deck-swatch-in-a-room.png` (38,803 B) — the deck's centred card: `sudoku · 9×9 easy ·
   dealt ·` then the three dots, the first of which is the rose the head's mark wears. The
   DECLARED F1 delta. §1 G14.
