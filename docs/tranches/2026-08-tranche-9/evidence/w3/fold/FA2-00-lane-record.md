# FA2 — ONE UTTERANCE (the guard's double-speak). T9-W3 §3.7, handoff 3C-2. 2026-09-17

Chair's ruling landed: the **TRIM**, not the drop. `.gallery-guard-live` keeps the half the
`alertdialog` cannot say; the dialog's name + description are the survivor.

## What landed

- `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue` — the `guardIndex` watcher's arm
  branch (the seam 3C-2 cites at `:759-761`; it had drifted to `:807`).
  `sayGuard(\`${guardTitle} ${guardSub}. Choose keep, or ${guardVerb}.\`)`
  → `sayGuard(\`Choose keep, or ${guardVerb.value}.\`)`, with the §3.7 note above it.
- `web/frontend/e2e/a11y.spec.ts` — `guardAnnounced` (the seam cites `:184-197`; it sat at
  `:186-197`). The predicate reads the destructive VERB off `.guard-leave` instead of the
  guard's `aria-label`. Neither caller's wording had to follow, so `:327`/`:367` are untouched.

Spoken result, measured in both engines: `"choose keep, or deal."` — down from
`"deal over this puzzle? your marks aren't saved. choose keep, or deal."`

## BORN-RED (scratch probe, deleted with the lane)

`e2e/fa2-guard-doublespeak.spec.ts` armed the guard and asserted that no live region repeats the
alertdialog's own NAME (`aria-label`) or its own DESCRIPTION (`aria-describedby` target), while
some live region still carries the verb.

| run | file | verdict |
| --- | --- | --- |
| at HEAD, pre-cure | `FA2-01-born-red.txt` | **2 failed** (chromium + webkit). `titleEchoedBy: ["gallery-guard-live"]`, `stakeEchoedBy: ["gallery-guard-live"]` |
| post-cure | `FA2-03-cured-green.txt` | **2 passed**. `titleEchoedBy: []`, `stakeEchoedBy: []`, `verbCarriedBy: ["gallery-guard-live"]` |

The probe also measured the facts the gate re-cut rests on: `.guard-leave` textContent is exactly
the verb (`"deal"`), and `.gallery-guard` is `role="alertdialog"` — so `guardAnnounced`'s first
branch (`role="alert"`/`aria-live` on the ribbon) still does not fire, which is why an outright
DROP of the region would not have passed the gate. The chair's ruling is the one the gate admits.

## PLANT-PROOF for the moved gate (`guardAnnounced`)

Planted in `GameGallery.vue`, run as `-g "3.2 guardAnnounced"`, both engines (6 rows: 2 use the
helper, 1 does not, ×2 engines):

| plant | file | verdict |
| --- | --- | --- |
| P1 `sayGuard(\`\`)` — the arm goes silent | `FA2-06-plant-P1-silent.txt` | **4 failed / 2 passed** (both helper rows red in both engines) |
| P2 `sayGuard(\`${guardTitle} ${guardSub}.\`)` — the echo minus the verb | `FA2-07-plant-P2-echo-no-verb.txt` | **6 passed — GREEN, and that is the honest limit** |
| P3 `sayGuard(\`Work is at risk.\`)` — speaks, never names the choice | `FA2-08-plant-P3-no-verb.txt` | **4 failed / 2 passed** |
| restore | `FA2-09-restore-green.txt` | **6 passed** |

**P2 is the finding worth carrying.** The verb is a SUBSTRING of the title in all three intents
— "deal" ⊂ "deal over this puzzle?", "leave" ⊂ "leave this puzzle?", "switch" ⊂ "switch this
shared board to …?" — so a substring predicate over this copy polices SILENCE, not the
double-speak. P1 and P3 show it is not merely a non-empty check: it does demand the verb.
Nothing committed now reds if the double-speak returns; the probe that would is named in
`handoffs/fold-FA2-1.md` §"The gap this leaves open".

## π — W3 speaks, it does not repaint

Scratch rect census at 1280×800 over the armed pose, 13 selectors incl. `.gallery-guard`,
`.guard-note-title`, `.guard-note-sub`, `.guard-keep`, `.guard-leave`, `.gallery-viewport`,
`[role="grid"]` and the sr-only regions themselves.

- before: `FA2-02-pi-before.txt` · after: `FA2-04-pi-after.txt`
- **chromium identical, webkit identical — ZERO PIXELS MOVED.** No golden re-baselined, none
  touched. `.gallery-guard-live` is the clipped 1×1 (`639.5,445.297,1,1` chromium /
  `639.5,445,1,1` webkit) before and after, so the trimmed string cannot reach a pixel.

## Gates

| gate | verdict |
| --- | --- |
| `e2e/a11y.spec.ts`, chromium + webkit, all rows | **30 passed** (`FA2-05`, re-confirmed twice) |
| `e2e/gallery-guard.spec.ts`, both engines | **14 passed** |
| `e2e/gallery-deal.spec.ts`, both engines | **36 passed** (see flake note) |
| `GameGallery.liveRegions.test.ts` + `GameGallery.deck.test.ts` | **2 files / 27 tests passed** |
| `npx vue-tsc --noEmit` | **EXIT 0** |
| `npm run typecheck:e2e` | **EXIT 0** (`FA2-12`) |
| `npx eslint` both fenced files | **EXIT 0** |
| `npx prettier --check --config .prettierrc.json` on the .vue (e2e never prettied) | **clean** |
| `node scripts/check-copy-register.mjs` | **EXIT 0** — 0 em/en dashes, 0 unadmitted jargon. The surviving sentence "Choose keep, or deal." is plain copy |
| `node scripts/check-live-regions.mjs` | **EXIT 0** — 10 regions, 0 born speaking |
| full unit battery | **RED, and not wholly this lane's** — see below |

### The unit battery, told straight

`npx vitest run --silent` → `Test Files 2 failed | 63 passed (65)`, `Tests 5 failed | 800 passed
(805)`.

- `GameGallery.a11y.test.ts` — **3 rows, this lane's, and OUT OF FENCE.** It carries a hand-copy
  of the e2e predicate that still keys off `aria-label`, plus a one-string row that asserts the
  region contains the drawn heading. Attribution banked: with the utterance temporarily reverted
  the same file reads 17/17 (`FA2-11-unit-attribution-pristine-utterance.txt`). Two of the three
  are real; the third (`returns focus to the listbox when the ribbon retires`) is COLLATERAL —
  the first row throws before its `w.unmount()` and leaks a gallery into the shared jsdom
  document. Proven by running it alone at the cured tree: 1 passed / 16 skipped. Exact
  replacement text for both real seams: **`handoffs/fold-FA2-1.md` (BLOCKING).**
- `useSession.test.ts` — **2 rows, NOT this lane's.** `src/games/shared/useSession.ts` and its
  test are both dirty in the worktree, last written 11:52 by a concurrent lane. FA2 touched no
  session code.

### Flake note (instrument, not contract)

The lane's dev server is one vite on `127.0.0.1:4252` serving a tree that other live lanes are
editing under HMR. Run all three guard specs together (77 rows, 9 workers) and 3-4 rows red —
a DIFFERENT set each run, every one failing in its own arming/seed precondition rather than at
an assertion this lane moved, and every file green when run alone. `gallery-deal.spec.ts` went
36/36, then 35/1 on `safe verb: a wandered pair…` (chromium), then 35/1 on `guard: when BOTH
boards hold work…` (webkit) — the latter asserts `.guard-note-sub`, which this lane did not
touch. Each flaked row passes in isolation.

## Files

Fenced and edited: `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue`,
`web/frontend/e2e/a11y.spec.ts`. Scratch (`e2e/fa2-guard-doublespeak.spec.ts`,
`e2e/fa2-pi-census.spec.ts`, `playwright.fa2.config.ts`, `test-results/`) all removed.
