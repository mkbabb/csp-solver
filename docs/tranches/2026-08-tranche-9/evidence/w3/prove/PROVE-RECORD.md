# T9-W3 — THE NON-AUTHOR PROVE LANE

Adversarial re-measurement of the spoken product after the chair fold. Nothing here was
written by a W3 author lane; every figure below was taken on THIS tree (`4686436f` + the
uncommitted W3 working set) with the lane's own instruments where the wave's own rows would
have been the only witness.

**THE TREE MOVED UNDER THIS LANE.** Other hands were editing while these runs were taken:
`web/relay/relay.ts` 12:56:15, `e2e/a11y.spec.ts` 12:56:16, `e2e/viewport-law.spec.ts`
12:58:08, `src/pencil/chrome/GameGallery/GameGallery.vue` 13:06:31, `dist-throttle/` rebuilt
13:06:55 — all on 2026-09-17, all inside this lane's window (first run 12:54:19). So every
verdict that could have straddled an edit was taken again at 13:10–13:13 and banked as
`prove3-*`: units and `vue-tsc` (`prove3-reverify-units.txt`, still **RED on the same three
rows**, vue-tsc 0), the eight wave specs (`prove3-reverify-wave-eight.txt`, 148 passed ·
4 skipped · exit 0), this lane's own probes (`prove3-reverify-probes.txt`, 15 passed ·
1 skipped · exit 0) and both static gates (exit 0). Nothing below changed its verdict, but a
chair reading these figures should know the tree was not still while they were taken, and
should re-read anything it intends to seal on.

Fence: `docs/tranches/2026-08-tranche-9/evidence/w3/prove/` only. One outgoing seam is
filed at `../handoffs/fold-prove-1.md`. No repo source was edited; the two plant-proofs
ran against a MIRROR of `web/frontend/{src,scripts,index.html}` in the session scratchpad,
restored and diffed back to head byte-for-byte between arms.

A prior prove session banked `prove-*.txt` on 2026-08-28 mid-fold; those files are kept
(wall-resume: finish, never redo) and every claim they carry was re-measured here as
`prove2-*`. Where the two disagree, the `prove2-*` figure is the one at head — the older
`prove-e2e-blast-radius.txt` was taken while FA1 was still editing `mobile-affordances.spec.ts`
(its line numbers moved under the run), so its eight reds are STALE and are not findings.

## The gate spine, re-run bare

| gate | verdict | file |
|---|---|---|
| units (`npx vitest run --silent`) | **RED — Test Files 1 failed \| 65 passed (66) · Tests 3 failed \| 807 passed (810)** | `prove2-unit-battery.txt` |
| `npx vue-tsc --noEmit` | 0 | `prove2-typecheck.txt` |
| `npm run typecheck:e2e` | 0 | `prove2-typecheck.txt` |
| `npx eslint` — all 65 touched src/e2e/scripts files | 0 | `prove2-eslint.txt` |
| the eight wave specs, both engines | 148 passed · 4 skipped · exit 0 | `prove2-e2e-wave-eight.txt` |
| the whole e2e estate, bare, both engines · run 1 | 468 passed · **4 failed (webkit)** · 4 skipped · exit 1 | `prove2-e2e-blast-radius.txt` |
| the whole e2e estate, bare, both engines · run 2 | 471 passed · **1 failed (webkit, a DIFFERENT row)** · 4 skipped · exit 1 | `prove2-e2e-blast-radius-repeat.txt` |
| every one of those five rows, isolated, webkit | 22 passed · exit 0, then 23 passed · exit 0 | `prove2-webkit-reds-isolated.txt` |
| `check-unit-count.mjs` against a fresh report | **RED, twice over** — not a passing run, and floor 661 owes 689 on 810 live | `prove2-counts.txt` |
| `node scripts/check-live-regions.mjs` | 10 regions, 0 born speaking · exit 0 | `prove2-gates-head.txt` |
| live-region police, planted | GREEN → **RED** → GREEN | `prove2-live-regions-plant.txt` |
| `node scripts/check-copy-register.mjs` | 0 dashes · 0 unadmitted (2 admitted) · exit 0 | `prove2-gates-head.txt` |
| copy register, jargon planted at the `useLiveRegion` arm | GREEN → **RED (3 offences)** → GREEN | `prove2-copy-register-plant.txt` |
| `node scripts/check-pw-projects.mjs` | 8/8 arms · 34 specs · 547 tests · exit 0 | `prove2-pw-projects.txt` |
| `node scripts/ledger-diff.mjs --assert-state` (repo root) | GREEN · exit 0 · `LIVE_REGION_ADMITTED = []` (`scripts/ledger-diff.mjs:581`) | `prove2-ledger-assert-state.txt` |
| π · `npm run test:golden` | 4 passed · exit 0 | `prove2-goldens.txt` |
| π · `visual-regression.spec.ts`, both engines | 24 passed · exit 0 | `prove2-visual-regression.txt` |
| the lane's own probes, both engines | 15 passed · 1 skipped · exit 0 | `prove2-independent-probes.txt` |

## What the lane measured itself

`prove2-independent-probes.txt` — an instrument that shares nothing with the wave's rows
(its own config, its own dev server on 127.0.0.1:4240, both engines).

- **§3.1, 390×844 and 768×1024** — shut: the key writes (`5`), backspace clears. Risen: a
  40-step Tab walk stops on 0 board cells (chromium stops: heading/ctrl/icon buttons, body,
  attribution, toggle, logo, drawer tab; webkit: `body` only, the documented macOS Tab policy),
  a covered cell refuses focus (`focused:false`) and a typed `5` leaves it `""`. Shut again:
  the same cell takes `6`. The grid's `inert` host is present with the sheet up and gone with
  it shut.
- **Residue 3C (owner's-pass item, NOT a defect claim)** — a cell that HOLDS focus loses it
  when the sheet rises: `before {"focusedCell":true,"active":"input.cell-native-input"}` →
  `during {"active":"button.mobile-heading-btn","inGrid":false,"gridInert":true}`, both
  engines. The focus is not restored to the cell when the sheet shuts; the board is live
  again and a fresh focus lands (`after-shut {"focused":true,"gridInert":false}`).
- **§3.3 live, two pages on one board** — chromium `onB="Row 1, column 3, psychological-carp's
  entry 7"` / `onA="Row 1, column 3, your entry 7"`; webkit `onB="Row 1, column 1,
  low-shrew's entry 7"` / `onA="… your entry 7"`. The peer slug in the name is the slug the
  roster draws. Neither page says `written by`. A printed clue reads `given clue N` on both
  pages and carries neither `entry` nor an author.
- **§3.5 the EMPTIES clause, watched with a MutationObserver on the region itself** — two
  deals of the same board give the trail `["", "new board. 9 by 9 sudoku board, easy", "",
  "new board. 9 by 9 sudoku board, easy"]`, both engines: two mutations for one repeated
  sentence, which is the clause doing its work.
- **§3.6 at a fine pointer** — after the press the page carries exactly one matching
  accessible name, `["Share board link"]`; no button is named "Link copied"; the sublabel
  under the same glyph still reads `share`; `.copy-status` carries the outcome.
- **§3.6 the failure sentence** — with `navigator.clipboard.writeText` rejecting, the region
  carries `"couldn't copy. the link is in the address bar"` in full, on BOTH engines, no
  dash, and the name still reads `Share board link`.
- **§3.7 one utterance** — title `"deal over this puzzle?"`, region `"Choose keep, or deal."`,
  and no live region on the page contains the title (`live=["new board. 9 by 9 sudoku board,
  easy","futoshiki, 2 of 5. 5×5 easy, new game","Choose keep, or deal."]`), both engines.
- **§3.7 phone head order** — the wave's own row (`spoken-gallery.spec.ts:308`) asserts DOM
  order against painted order at 1280×800 AND 390×844 and is green both engines in
  `prove2-e2e-wave-eight.txt`. Re-derived rather than re-run: the probe is
  `compareDocumentPosition` against the painted rect, which is the claim the mandate asks for.

- **§3.4 the class converged** — all ten regions the police finds are bound to a
  `useLiveRegion` ref, and the five the wave names ride it by construction: `copyLine` (:370),
  `connectingLine` (:454), `aloneLine` (:457) in the panel, `liveText` (:398) and `guardAlert`
  (:435) in the deck. `LIVE_REGION_ADMITTED` is `[]`, so the gate carries no standing
  exception, and the police REDs on a real plant.

The probe spec and its config are banked verbatim beside this record
(`prove2-probe-spec.ts.txt`, `prove2-probe-config.ts.txt`) so the run can be repeated.

## Findings

1. **THE UNIT BATTERY IS RED AT HEAD (blocking).** `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`
   still pins the pre-cure guard: `arming … utters the guard's own name into an ASSERTIVE
   region` (regions said `["sudoku, 1 of 2. 3 easy, new game","Choose keep, or switch."]`),
   `returns focus to the listbox when the ribbon retires`, and `the utterance is built from
   that same name` (expected to contain `deal a new board?`, got `choose keep, or deal.`).
   The §3.7 cure is exactly what these rows forbid. The seam is already written at
   `../handoffs/fold-FA2-1.md`, marked NOT LANDED. Nothing in this lane can land it (fence).
2. **A WAVE HELPER READS A CLASS THAT DOES NOT EXIST.** `e2e/spoken-controls.spec.ts:100-105`
   (`firstEmptyCell`) filters `.game-cell` on `is-given`. Measured on the live page, both
   engines, both viewports: `withIsGivenClass: 0` of 81 — `is-given` is a PROP on the child
   (`DigitCell.vue:394`), never a class on `.game-cell`. The helper therefore answers `0`
   always, while the true first empty square was index 1 and index 4 in the same runs. The
   §3.1 keystroke row survives it (its assertion is FOCUS and it carries a sheet-shut
   control), but its stated contract — "the cell a stray keystroke would actually write to" —
   is false, and cell 0 is frequently a given, whose write W1's B7 refuses anyway. Seam filed:
   `../handoffs/fold-prove-1.md`.
3. **THE INERT CURE IS COARSER THAN THE SPEC'S SENTENCE.** The spec says "when the risen sheet
   covers the scene, the covered region is `inert`". What ships inerts the WHOLE grid. Measured
   (the prior prove session's over-reach ledger, `prove-overreach.txt` / `prove-census-geometry.txt`,
   re-read here and consistent with this lane's `gridHasInert`): at 390×844 the sheet covers
   81/81 so nothing is lost; at 768×1024, 18 of 81 cells are geometrically CLEAR of the sheet
   and 18 of them lose focusability (`focusableWithCure: 1` vs `focusableWithoutCure: 18`); at
   820×1180 the same figure is 27. Not adjudicated here — a modal sheet may be entitled to
   take the board with it — but the wave's text and the wave's mechanism do not say the same
   thing, and the difference is 18 and 27 visible squares.
4. **THREE DIFFERENT OCCLUSION FIGURE SETS LIVE IN THE ESTATE.** The wave spec says 81/81 ·
   63/81 · 46/81 (390×844 · 768×1024 · 820×1180); `spoken-controls.spec.ts`'s header says
   59 and 62 · 47 and 46 · 40 and 42; the geometric census taken on this tree says
   fullyUnderSheet 81 · 54 · 45 with centreUnderSheet 81 · 63 · 54. `../handoffs/fold-FA5-1.md`
   already names the spec half and is marked NOT LANDED (the spec is outside the Restamp
   fence). The spec-header half is unclaimed.
5. **THE BARE FULL SUITE IS NOT GREEN ON THIS MACHINE, AND ITS RED MOVES.** Run 1 exits 1 on
   four webkit rows (`multiplayer.spec.ts:649/:854/:882`, `session-substrate.spec.ts:197`);
   run 2, same tree, same machine, exits 1 on ONE different webkit row
   (`gallery.spec.ts:860`, the kenken drag) with all four of run 1's rows green. Isolated,
   webkit: 22 passed and 23 passed, both exit 0. So these are contention flakes — the class
   `multiplayer.spec.ts` documents at its own head — not wave defects. Under O-12 the
   Playwright estate is a local instrument and not a CI lane, so nothing here blocks a seal;
   it is a flake ledger row and a caution against reading any single bare full-suite run as a
   verdict on this wave.
6. **THE UNIT FLOOR IS OUT OF BAND, AND THE RED BLOCKS THE RESTAMP.** `check-unit-count.mjs`
   against a fresh report fails twice: the report is not a passing run (3 failed), and floor
   661 is 18.4% under 810 live (stamped census 735; the 85% band owes **689**). The restamp is
   the Restamp lane's to take and it cannot take it while finding 1 stands, which is what
   `fold-FA2-1.md` says. countMove, for the chair: unit floor 661 → 689 owed, 810 executed
   over 66 files.
7. **THE FOLD IS STILL WRITING.** See the header: four source files and a built
   `dist-throttle/` changed between 12:56 and 13:07 on the day of this lane, one of them the
   very file whose unit twin is finding 1. Re-verified at 13:10–13:13 with no verdict moved,
   but a prove lane cannot certify a tree that is being edited beneath it, and the banked
   `prove-*.txt` from the 2026-08-28 session are older than several of these edits.
8. **§3.6's SUCCESS ARM IS CHROMIUM-ONLY, BY A DECLARED HOLDOUT.** `spoken-controls.spec.ts:242`
   skips webkit for the missing clipboard-write permission, and `check-pw-projects.mjs` passes
   with "5 recorded holdouts", so the skip is declared rather than quiet. The FAILURE arm,
   which is the half the wave calls "the one that matters most", is proven on both engines by
   this lane's own probe.
