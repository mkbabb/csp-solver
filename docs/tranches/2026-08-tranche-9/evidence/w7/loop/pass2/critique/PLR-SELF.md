# PASS-2 CRITIQUE · PLR-SELF · Your mark, in your ink

Adversarial, non-author. I did not write the spec or the prototype. Read the diff in
`.claude/worktrees/wf_8630d340-e56-52`, looked at all four frames, and re-measured on my own
servers — the prototype worktree on `127.0.0.1:4245` and the **main tree at `a8fee1f5` on
`127.0.0.1:4246` as the HEAD control** — chromium and webkit, both killed before this was
written (`lsof -ti tcp:4245` / `:4246` = 0). Readings under `critique/PLR-SELF/probe/`; no crops
of my own, and nothing written under `loop/r0/` or `loop/pass1/`.

**Convergence: 82 %. Verdict: ADVANCE.** The diff runs, fifteen born-RED gates and two r0 rows
are green on the real surface, and three of the family's own spec numbers are refuted by its own
measurements rather than papered over. Against that: **one product defect I measured on both
engines** (Escape after a mouse open breaks the very seam this family built), eleven of the
seventeen gates never land as estate instruments, and the estate's own filter census is not
extended to the scene the family added.

---

## 1 · What I re-measured, and what it says

Every row here is mine, taken on my own servers, both engines unless stated.

| reading | chromium | webkit | verdict |
|---|---|---|---|
| r0 **I2** — self swatch · self lobby row · the mark | `oklch(0.5 0.11 0)` × 3 | same | **CONFIRMED** |
| **G10** inversion — live mark at rest vs hovered, settled | rest `oklch(0.5 0.11 0)` → hovered `oklch(0.5 0.11 0)`; `d` 397 → 394 | same | **CONFIRMED** |
| **G2** filter census — solo, then sheet OPEN | 9 → 9 | 9 → 9 | CONFIRMED (dev server; see gap 2) |
| mark box, desk 1280 | 45.125 × 39.75 at (75.53, 12) | same | CONFIRMED |
| mark box, 390 × 844 coarse | 45.125 × **44** at (75.53, 0) | same | CONFIRMED |
| sheet, desk, 3 at the table | (0, 51.75) 256 × **122.125**; right edge 256 < sun left 1072 | same | CONFIRMED |
| sheet, tall phone, 5 at the table | (0, 44) 256 × **165.25**, bottom 209.25 | same | CONFIRMED |
| **π in the GALLERY** (`?view=gallery`), 1280 and 390 | 0 marks · 0 lobbies; `.corner-left` `[0,12,75.53,39.75]`, trigger, sun, logo **identical to HEAD** | same | **CONFIRMED** |
| copy register (`--self-test`) | exit 0, 0 dashes, 0 unadmitted, `copy sources: 1/1` | — | CONFIRMED |
| font coverage | exit 0, Patrick Hand 46 cp / 4,312 B, 23 strings over 4 groups | — | CONFIRMED |

**The height law.** Mine, twice, two viewports, both engines: desk 3 rows + 0 more = **122.125**
against the prototype's corrected `H = 57.36 + 21.6r + 18.96m` → 122.16 (Δ −0.035); tall phone 5
rows → **165.25** against 165.36 (Δ −0.11). The spec's inherited `H = 58.95 + 23.6r + 20.55m`
predicts 129.75 and 176.95 — wrong by 7.6 and 11.7 px. **The prototype's refutation stands, and
I make it a third independent reading.** PLR-COUNT's coefficients want correcting at the source.

**AA, computed by me from the tokens the page resolves, not from the family's numbers.** Canvas
paint of all 40 walk inks, WCAG 2.x luminance, against the three grounds:

| | light bg | light card | **light popover (the sheet's own ground)** | dark bg | dark card | **dark popover** |
|---|---|---|---|---|---|---|
| worst of 40 | 5.23 (idx 38) | 5.36 | **5.28** | 9.71 (idx 13) | 9.50 | **9.64** |
| quiet rung, composited | — | — | **5.24** (`rgb(106,106,106)` on `rgb(252,251,251)`) | — | — | **6.10** (`rgb(148,146,140)` on `rgb(18,16,15)`) |

The lane measured the walk against `bg` and `card` only — never against `--color-popover`, the
one ground the sheet actually paints. **I closed that myself: it passes, 5.28 / 9.64.** AA holds
on both themes, on the real ground, across all forty hues. No gap here; the hole is filled.

**The cut.** `index.css:94-96` gives Patrick Hand `U+0020-0021, U+0027, U+002D-002E,
U+0030-0039, U+003F, U+0043, U+0052, U+0053, U+0061-0069, U+006B-0077, U+0079-007A, U+00D7,
U+2014, U+2026` — **every digit**, and no `j`, no `x`, which is exactly what M16's copy law and
the slug dictionary assume. `and 7 more` and `34 seconds ago` render; the `lobbyStrings` derive
declaring only `0` and `1` for the holes is a narrower declaration than the cut, not a ransom
note. Checked because the derive's `${…}` → `0` substitution would have hidden the opposite.

---

## 2 · THE DEFECT — Escape after a mouse open undoes the seam, both engines

`probe/c-escape.spec.ts`, `probe/run-esc-*.log`. The family's whole substrate row is
`@pointerdown.prevent`: a mouse press on the mark must not move focus, so the cell keeps it,
`onGridFocusout` never fires, and the room is not told you looked away while you read your own
roster. G11 proves that much and I reproduce it. Then:

```
before      activeElement = input.cell-native-input          frames []
mark.click  aria-expanded true · activeElement still in cell  frames []      ← G11, green
Escape      aria-expanded false · activeElement = BUTTON.player-mark
            inCell FALSE                                      frames ["cur"] ← the seam, broken
```

Identical on chromium and webkit. `PlayerMark.vue:112-117`'s `onWindowEscape` ends
`el.value?.focus()` unconditionally, so a sheet opened by a pointer — the case the seam exists
for — hands focus to the mark on dismissal, pulls it out of the cell, and emits a `cur` frame:
precisely the "you looked away" the design spent an attribute to prevent.

No gate can see it. **G11 stops at the click; G8 starts from `el.focus()`.** The composition is
unguarded. The cure is one condition — return focus only if the mark (or its sheet) had it:
`if (el.value?.contains(document.activeElement)) el.value.focus()` — plus the row that would
have caught it: open by mouse, Escape, assert `inCell` true and zero `cur` frames, both engines.

This is a line, not a wall. It does not change the verdict; it is the first thing pass 3 closes.

---

## 3 · Open gaps (each closable in one sentence)

1. **Eleven of seventeen gates never land.** `e2e/player-mark.spec.ts` carries four rows (the F1
   ink, the seam, the key contract, the compression). G2, G3, G4, G5, G6, G7, G9, G10, G12, G14
   and G15 live only in `docs/.../pass2/prototype/PLR-SELF/probe/p2-*.spec.ts`, which the diff
   does not carry into the estate — a ruling landing without its enforcing config, which is the
   one rule this campaign wrote down after T2–T4.
2. **The estate's own filter census was not extended.** `e2e/filter-census.spec.ts` runs against
   the **built dist** over the board and picker regimes and a `:hover` arm, and never opens the
   sheet; G2's "9 with the sheet open" is a dev-server reading on a tree whose `dist/` the lane
   says it did not touch. R6 law 9 / L1 stays blind to the scene this family added.
3. **Two roster-reading estate specs are neither run nor named, and one holds the single
   assertion that could flip.** The return names five; `e2e/access.spec.ts:370` and
   `e2e/follow-still-authorship.spec.ts:71` also read `.players-roster .player-row`, and
   `e2e/multiplayer.spec.ts:379` asserts `.players-roster` **`toBeVisible()`** against a list
   this diff makes unconditionally `sr-only` — in the one roster spec the lane left unrun.
4. **T7-W2 A4 is reversed with no ruling and no disposition row.** The roster's `tabindex="0"`
   ("a log you can hear added to but never read back is half a cure") is deleted and its remedy
   moved to a head disclosure; the reversal is argued only inside a re-cut unit test's comment,
   appears in neither the DELTAS, the LEDGER rows nor the U-10 list, and the sole evidence that
   the new readable surface is keyboard-reachable is G9 — **chromium only, webkit skipped.**
5. **The well loses 64 px inside the dock's content and nothing measures the dock.**
   `.players-well` goes 284.2 × 109 → × 45 (G15); on a coarse phone the controls card IS the
   portrait dock's content, which is W2's landed mechanic, and no reading of the dock's settled
   pose, its tab, or `ribbonCovered` is banked either side of the change.
6. **The hover affordance is proven as a string and never as a percept.** G10 asserts the `d`
   moved (397 → 394 chars); measured off `frames/3-pose-rest-vs-hovered.png` the two halves
   differ by a mean 5.65/255 per channel (max 181) — roughly one pixel of edge wobble, and at 1×
   the strip reads as one rectangle printed twice. The family deleted the visible affordance
   (the pressure lift) for a real AA reason and replaced it with one that has **no stated
   floor**: a future re-bake at `boilAmount` near 0 keeps every gate green and leaves the mark
   with no affordance at all.
7. **G4c is chromium-only** — the lane says so — and it is the one viewport where the sheet
   covers live cells, so the short-phone lap and its 7/7 dismissals have a single-engine record.
8. **The evidence bank carries two contradictory `walk40` rows per engine, distinguished only by
   file order.** `probe/readings.txt` lines 30/31/36/37 read `light worst bg 4.93 / card 5.05`
   and `dark worst bg 1 / card 1`; lines 38–41 read `5.23 / 5.36` and `9.71 / 9.50`. The README
   quotes the second pair only. A dark worst of **1** is a broken instrument announcing itself,
   and nothing in the bank marks the first pair retired.
9. **`.player-swatch` "STAYS" as markup, not as a thing.** Its `flex`, `width`, `height` and
   `border-radius` are deleted; only `background` survives. Every reader left in the estate reads
   `getComputedStyle(...).backgroundColor`, which still resolves, so CHAIR §6.8 is satisfied in
   fact — but the return says the swatch stays and does not say it now stays as a colour hook of
   zero box inside an `sr-only` list.
10. **Two comments are stale the moment F1 lands.** `PlayerMark/types.ts` still says `ink` is
    "`inkFor`'s shape … or `{}` for the incumbent", which F1 retired; `e2e/multiplayer.spec.ts:190`
    still reads "you are the incumbent blue and everyone else walks the golden angle" beside the
    assertion whose meaning F1 changes (the set of two survives — self is index 0, not blue).
11. **The quiet qualifier has never been read.** `N seconds ago` fires past `PRESENCE_QUIET_MS`
    20 000; no banked row waits 20 s, so the one string in `LOBBY_COPY` with a live clock behind
    it is proven by the font gate and by nothing on a surface.
12. **`quietAfterMs` defaults to a literal 20000 in the component while the session exports
    `presenceQuietMs`** — two copies of one constant, and the prop default is exactly the masked
    fallback that would hide a drift for any future caller that forgets to pass it.
13. **The relay arm is unmeasured** (the whole battery drives `?wire=local`), real iOS is out of
    scope by M19, and `e2e/multiplayer.spec.ts` — the slow two-page battery — is unrun.

---

## 4 · Failure-mode checklist, item by item

| item | verdict |
|---|---|
| vacuous convergence | **clear** — every gate has a stated RED and most were measured red at HEAD |
| spec-cites-itself circularity | **found and cured by the prototype** — the spec's §3.5 region ORDER was a re-alphabetised measurement, and the spec's height law was a cite of PLR-COUNT's sheet; both refuted with numbers |
| gates that cannot fail | **one killed, one left** — `join-language-prm:97`'s `not.toContain('is-arriving')` went vacuous with the class and is re-aimed at the mark's PRM arm (good); the pose swap still has no floor (gap 6) |
| the elegant-reduction trap | **HIT, and named by the lane itself** — "the diff has never been read by a non-author". Half discharged by this read; the other half is gap 1, the gates that never land |
| legacy aliases | **HIT, minor** — `.player-swatch` kept as a name with its geometry gone (gap 9); `types.ts` and `multiplayer.spec.ts` comments still describe the incumbent blue (gap 10) |
| masked fallbacks | **HIT, minor** — `quietAfterMs: 20000` duplicated against `presenceQuietMs` (gap 12) |
| unverified gestalt | **partial** — four cited crops, every pose screenshotted on the real surface both engines; but the affordance is a string diff (gap 6) and the short-phone lap is single-engine (gap 7) |
| consumer-less substrate | **clear** — `LOBBY_COPY` has three readers, `presenceInkMs` one, `PlayerStub`'s second pose one, `headDisclosures` two |
| the generic default | **clear** — a crayon stub rather than a lettered name, the estate's own card pose rather than a new rounded card, plain lowercase copy, no eyebrow, no arrow, no numbered markers |
| the pixel it moves that it did not declare (π) | **CLEAR, and I measured it** — in the gallery, both engines, both viewports: 0 marks, 0 lobbies, `.corner-left` / trigger / sun / logo byte-identical to HEAD. The wrapper's new `display:flex` costs nothing where the slot is empty, and nothing in the playing view but the mark's own 45.13 px |
| the constraint it forgot | **HIT** — W2's dock is the well's container and the well loses 64 px inside it, unmeasured (gap 5). AA holds (mine, both themes, all 40 hues, on the real ground). filterBudget 9 → 9 holds on the surface and is unguarded in the estate (gap 2). M16 holds (gate exit 0). The decided history holds: hue census, law probe and family law byte-identical to r0's bank, r0 instruments copied and re-pointed, I3 proposed as a diff and reported MOVED |

---

## 5 · Strengths worth keeping

- **F1 is landed as a single idea and its consequences are declared, not scoped away.** One line
  in `mint`, one in `adoptInk`, and the head mark, the self row and the deck's caption swatch all
  say the room's colour. `mint` is reachable only from `joinSession` and `onPeer`, so a solo
  board still binds nothing — I checked the call sites rather than taking the comment's word.
- **The inversion is cured by removing a state, not by adding one.** No `.is-live` in any hover
  or focus selector, asserted by a CSSOM sweep rather than by reading the file, so the ordering
  trap cannot come back through a new rule.
- **−362 lines, and the deletions are the design**: the roster's scrollport, fold, three
  one-shots and the 740 ms hold; `useJoinWash`'s whole timer set; the reduced-transparency arm as
  a proven no-op; `@keydown.enter` on both marks.
- **CH-70 is a real find with a one-line re-entry probe** (`grep -rn 'keydown.enter'` must read
  0), and it was found by disbelieving a comment — the comment was refuted by its own code.
- **CH-71 prices a defect it does not own** rather than smuggling a cure: the head's disclosures
  have lapped the board since T6.2, and what §11 adds is the dismissal that makes the lap
  answerable.
- **The AA method correction is the most portable thing in the bank.** A darkest-RED-BYTE sampler
  reads a green ink at oklch L 0.5 as 9.8:1 and an amber at the same L as 2.96:1; neither is the
  contrast. Every family reading glyph cores off a coloured ink should take the luminance form.
- **The `hi`-into-the-void flake is stated as a property of the session**, not hidden as a retry.

---

## 6 · Verdict

**ADVANCE at 82 %.** Not BLOCK: nothing missing here is as hard as the problem — the focus-ring
token is read and not minted per CHAIR §6.1, and every primitive the design needs exists. Not
RETIRE: no constraint is violated (AA measured on both themes and the real ground, filterBudget
9, M16 green, π clean in the gallery, W2's mechanics untouched in kind) and nothing is a
rewording. The one opaque-ground DELTA is declared for U-10 and is what turns the sheet's AA from
luck into a number.

To reach 100: close the Escape seam with its gate; land the eleven orphan gates as estate
instruments; extend `e2e/filter-census.spec.ts` to the open sheet; run `multiplayer.spec.ts`,
`access.spec.ts` and `follow-still-authorship.spec.ts`; give the pose swap a floor; take the
T7-W2 A4 reversal to the chair; measure the dock either side of the well's 64 px; run G4c on
webkit.
