# T9-W7 exec · B1b — the residue of B1: two error notes and the pencils caption

Commit **`06fee424`** on `w7/exec`, on top of 3C-4b's repair `e1f2304b` (slice HEAD at open:
`e4c45f53` + `a649cf5e` + `e1f2304b`). Closes gaps **G15** and **G16** of `FOLD-MANIFEST.md` §5
— the three rendered strings ballot B1 enumerated and did not own (`B1/README.md` §7 gaps 1 and
5), cured here as their own slice with their own census, per the chair's ruling of 2026-09-18.

## 1. The seam

Three product strings, one gate that could not see two of them.

| Site | before | after |
|---|---|---|
| `src/games/shared/solver/classifyError.ts:51` — `PAPER_NOTE_COPY.budget` | `the solver ran out of steps on this board.` | `this board took too many steps to finish.` |
| `src/games/shared/solver/classifyError.ts:52` — `PAPER_NOTE_COPY.network` | `couldn't reach the solver.` | `the board's helper stopped working. reload the page.` |
| `src/games/shared/GameControlPanel.vue:980` — the pencils compartment's second row caption | `candidates` | `what fits` |

**The two notes.** Both render through `GameBoard.vue:45` (imports `PAPER_NOTE_COPY`) →
`:904` `errorNote` → `:1167` `<SolverErrorNote :text>` → `SolverErrorNote.vue:46`
`<p class="error-note-text">{{ text }}</p>`, inside `<div class="error-note" role="alert">`.
W3's contract holds: each sentence still says WHAT broke.

- `budget` is a step budget spent on the board in front of the player. The card draws its own
  `try again` button beside the sentence, so the sentence does not say it twice. **Measured, not
  assumed**: `GameBoard.vue:904` renders through `classifyCode(props.errorCode)` whose
  `retryable` parameter *defaults to true*, so every paper note carries that button — the arm
  reads `retryButton=1` on all four runs (`arm/note-*.txt`). `RETRYABLE_CODES` (the model's own
  answer to "can a second press clear this") holds `BUDGET_EXCEEDED`, so here the button is the
  right next act and the words stay with the diagnosis.
- `network` is the in-browser helper failing — a dead worker, or a fault with no envelope
  (`classifyError.ts:86`, the `TypeError` branch). It is the one fault of the two that
  `RETRYABLE_CODES` does NOT hold, so its sentence carries the act that does help.
- Untouched, and neither names the machine: `deal-timeout` (`this deal is taking too long. try
  again or pick a smaller board.`) and `unknown` (`something went wrong.`).

**The caption.** The row's tape already says the plain sentence — `show every digit that still
fits in a cell` — so the caption now says it in two words. Width was the constraint, not taste:
`.zone-row-label` is `flex: 0 0 3.75rem` beside the chips on the phone (the CSS comment at
`GameControlPanel.vue:1556` measures `candidates` at 48.8px against 60), so the replacement had
to be no wider and had to fit on one line. `what fits` does both, and the census below shows it
moved nothing at all.

**The gate.** `check-copy-register`'s jargon arm reads copy by the SHAPE it is written in, and
`PAPER_NOTE_COPY` is keyed by the fault domain (`budget`/`network`/`deal-timeout`/`unknown`), so
`COPY_KEYS` could never see the four sentences it holds — `lint:copy` called the tree clean while
two of them said `solver` (B1 §7 gap 6). This slice adds the half of that cure a NAME can carry:
a declaration whose own name says COPY is a copy table, and every string literal in its object
literal is read as copy (`COPY_TABLE_NAME`, `objectBody`). The other half — a `Record<…, string>`
whose declared TYPE says copy — needs a type reader and stays booked to W5's gate estate; it has
its own self-test colour saying so. **The gate was tightened, never loosened**: no lexicon entry
was narrowed, no allowlist entry added, and the `candidates` admission was STRUCK, leaving
`ADMITTED` empty.

## 2. The diff

Seven files, one commit (`06fee424`), +152/−37:

- `src/games/shared/solver/classifyError.ts` — the two sentences, plus the header clause that
  records why each says what it says (+18/−4).
- `src/games/shared/GameControlPanel.vue` — the caption, the comment that measures the column it
  has to fit, and the pencils header's parenthetical naming the two live captions (+11/−2).
- `scripts/check-copy-register.mjs` — the `candidates` admission struck; `COPY_TABLE_NAME` +
  `objectBody`/`balanced` (one walk, two delimiters); two new self-test colours; the stale-
  admission colour re-minted from a SYNTHETIC entry so an empty ledger cannot make it vacuous
  (it read `0/0, RED as required` otherwise — a check passing by having nothing to check).
- `scripts/check-font-coverage.mjs` — `zoneRowLabels` declares `what fits`; a new `paperNoteCopy`
  extractor and group put the note's four sentences under the ransom-note check for the first
  time (they paint in `--font-hand` and were never in the corpus).
- `src/games/shared/GameBoard.notes.test.ts` — the two pinned sentences, each with a second
  assertion `not.toContain("solver")` so the row reds on a revert, not only on a re-word.
- `src/games/shared/GameControlPanel.test.ts` · `e2e/zone-grammar.spec.ts` — the caption census
  rows (`["marks", "what fits"]`).

No `LEDGER`/`DISPOSITIONS`/waves edit. The throwaway Playwright config used for the e2e arm was
deleted; `.vite-exec.config.ts` stays untracked and uncommitted.

## 3. Born RED

**The gate row.** With both admissions struck and the copy not yet recut — `npm run lint:copy`,
**exit 1** (`gates/lint-copy-RED.log`):

```
check-copy-register: 3 failure(s):
  • src/games/shared/GameControlPanel.vue:980 renders "candidates" (solver vocabulary for what a player calls a pencil mark) in `candidates`. M16: …
  • src/games/shared/solver/classifyError.ts:51 renders "solver" (the machine's name) in `the solver ran out of steps on this board.`. M16: …
  • src/games/shared/solver/classifyError.ts:52 renders "solver" (the machine's name) in `couldn't reach the solver.`. M16: …
```

GREEN after the recut, with the admissions still struck and nothing added to `ADMITTED` —
**exit 0** (`gates/lint-copy-GREEN.log`):

```
jargon over RENDERED strings: 0 hit(s), 0 admitted, 0 unadmitted (lexicon: 25 entries)
check-copy-register: 0 em/en dashes and 0 unadmitted jargon in product copy (0 admitted, each with its cure's seam)
```

The two classifyError lines are the arm this slice added: at `e1f2304b` the same gate over the
same two strings exits **0** — that is the blind spot, measured (B1's own run, `B1/README.md`
§8, and the arm's first self-test colour reproduces it on a fixture).

**The unit rows.** The words reverted, the rows cured: `npx vitest run
src/games/shared/GameBoard.notes.test.ts src/games/shared/GameControlPanel.test.ts` →
**exit 1**, `Test Files 2 failed (2)`, `Tests 3 failed | 45 passed (48)` — the two note rows and
the caption census row (`gates/rows-RED.log`). Cured: the full suite, `Test Files 68 passed
(68)`, `Tests 830 passed (830)`.

## 4. π — the rest pose

Instrument `../3B-1/probe/rect-census.mjs` + `rect-diff.mjs` unmodified: pinned `?board=`
permalink, `reducedMotion: reduce`, 2.5 s settle, chromium. HEAD control = this worktree built
at `e1f2304b` into `dist-before/` (`index-DAj5SdL4MZJz.js`) and served read-only on :4258;
cured = `dist/` (`index-CubiZsMVSwTc.js`) on :4259. The MAIN tree was never built or served.

```
board-1280x800.json:   rects 1089/1089  max|d| 0.00px
board-390x844.json:    rects 1049/1049  max|d| 0.00px
gallery-1280x800.json: rects 1807/1807  max|d| 0.00px
gallery-390x844.json:  rects 1767/1767  max|d| 0.00px
WORST max|d| across all surfaces: 0.00px
```

**0.00 px over 5,712 rects, identical key sets** (`census/diff.txt`). Rects that moved: none.

The caption's DELTA is therefore INK INSIDE AN UNCHANGED BOX, and that is a property of the
layout, not luck: `.zone-row-stacked` is `flex-direction: column; align-items: stretch`, so the
caption's box is the column's width whatever the word is, and the phone branch pins it at
`flex: 0 0 3.75rem`. Read directly, both engines (`arm/caption-1280-*.txt`):

| engine | caption | label box | row box |
|---|---|---|---|
| chromium before | `candidates` | 853.89,855.80,268.22,15.44 | 853.89,855.80,268.22,53.44 |
| chromium after | `what fits` | 853.89,855.80,268.22,15.44 | 853.89,855.80,268.22,53.44 |
| webkit before | `candidates` | 853.84,855.47,268.31,15.44 | 853.84,855.47,268.31,53.44 |
| webkit after | `what fits` | 853.84,855.47,268.31,15.44 | 853.84,855.47,268.31,53.44 |

## 5. π + DELTA — the driven surface (the alert)

The paper note cannot be reached by playing, so the fault is INJECTED AT THE NETWORK LAYER and
never in the source: `probe/note-arm.mjs` fulfils the request for the built worker chunk
(`/solver\.worker.*\.js/`) with a stub module that answers `ping` truthfully and fails every real
request with the code the run names. The page, the bundle and the classifier are the shipped
ones. The arm then presses `Solve` on the pinned board and reads the alert. Both dists, both
codes, 1280×800.

| arm | engine | text | text box width |
|---|---|---|---|
| `BUDGET_EXCEEDED` before | chromium | `the solver ran out of steps on this board.` | 283.13 |
| `BUDGET_EXCEEDED` after | chromium | `this board took too many steps to finish.` | **280.05** (−3.08) |
| `BUDGET_EXCEEDED` before | webkit | `the solver ran out of steps on this board.` | 283.20 |
| `BUDGET_EXCEEDED` after | webkit | `this board took too many steps to finish.` | **280.14** (−3.06) |
| `WORKER_FAILURE` before | chromium | `couldn't reach the solver.` | 174.67 |
| `WORKER_FAILURE` after | chromium | `the board's helper stopped working. reload the page.` | **357.75** (+183.08) |
| `WORKER_FAILURE` before | webkit | `couldn't reach the solver.` | 174.73 |
| `WORKER_FAILURE` after | webkit | `the board's helper stopped working. reload the page.` | **357.86** (+183.13) |

`role="alert"` on every run, `retryButton=1` on every run, `names the machine: true → false`.

Whole-tree census WITH THE ALERT UP, chromium, before vs after (`census/diff-note.txt`):

```
note-BUDGET_EXCEEDED.json: rects 1103/1103  max|d| 3.08px  @ …/div:4/div:2/div:1/div:1/p:1[w] 283.13 -> 280.05
note-WORKER_FAILURE.json:  rects 1103/1103  max|d| 183.08px @ …/div:4/div:2/div:1/div:1/p:1[w] 174.67 -> 357.75
```

**ONE rect of 1,103 moves in each arm, and it is the note's own `<p>`.** The card
(`133.89,751.03,632.00,48.78`) and the `try again` button (`676.52,759.03,75.78,32.78`) are
identical before and after in every run: the card is a fixed-width flex row, so a longer sentence
inside it displaces nothing. The raw census JSONs are NOT banked (§8 gap 5); the probe and this
recipe reproduce them.

## 6. Frames — 4 crops, 40,555 B

| file | B | what it proves |
|---|---|---|
| `frames/before-1280-chromium-caption.png` | 8,634 | the pencils rows at HEAD: `marks` … `candidates` |
| `frames/after-1280-chromium-caption.png` | 8,467 | the same two rows cured: `marks` … `what fits`, same column, one line |
| `frames/after-1280-chromium-note-budget.png` | 10,051 | the alert cured, budget: `this board took too many steps to finish.` beside `try again` |
| `frames/after-1280-webkit-note-network.png` | 13,403 | the alert cured, dead helper, second engine: `the board's helper stopped working. reload the page.` |

The caption crop scrolls the compartment into view first (it measures at y≈856 against an 800px
window); the reported boxes in §4 are the unscrolled ones. The before side of the alert ships as
numbers (§5), not as two more crops.

## 7. Gates — every one run bare in the worktree, exit codes mine

| gate | exit | reading |
|---|---|---|
| `npx vue-tsc --noEmit` | 0 | clean |
| `npm run typecheck:e2e` | 0 | clean |
| `npx vitest run` | 0 | **Test Files 68 passed (68)**, Tests 830 passed (830) |
| `npm run lint` (prettier) | 0 | all matched files; `e2e/` never prettier'd (the spec edit is double-quoted by hand, matching the file) |
| `npx eslint .` | 0 | clean |
| `npm run lint:copy` | 0 | 0 hits / 0 admitted / 0 unadmitted; 20 self-test colours, including the two new ones |
| `npm run lint:live-regions` | 0 | 0 regions born speaking |
| `npm run lint:motion` | 0 | 34 specs, each declaring its motion state |
| `npm run test:font-coverage` | 0 | Patrick Hand 46 codepoints / 4312 B, **21 declared strings over 4 groups** — no new glyph, no re-cut |
| `npm run lint:boundary` · `lint:ink` · `lint:theme-selectors` | 0 ×3 | clean |
| `npx vite build --config .vite-exec.config.ts` | 0 | `index-CubiZsMVSwTc.js` (twice: the second build after a comment-only edit reproduced the same hash) |
| goldens vs cured dist :4259 | 0 | **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| `e2e/zone-grammar.spec.ts`, both engines, vs :4259 | 0 | **22 passed** (11 rows × chromium + webkit) — the caption census row among them |
| rest-pose π census (chromium, 2 routes × 2 viewports) | 0 | 0.00 px / 5,712 rects |
| driven π census (chromium, 2 codes) | 0 | 1 rect of 1,103 each, the note's `<p>` |
| note arm, both engines, both codes | 0 ×4 | §5 |
| `npm run test:e2e` (full battery) | **NOT RUN** | out of this lane's fence (its config binds :3000) |
| `e2e/a11y.spec.ts`, `e2e/visual-regression.spec.ts` | **NOT RUN** | neither reads a string this slice moved (grepped) |
| whole-tree π in webkit | **NOT RUN** by the estate's instrument (chromium-only, G18); webkit is read at the two DELTA surfaces directly (§4, §5) |
| real device / Safari / simulator | **NOT RUN** | M19 |

Logs: `gates/` (RED and GREEN copy runs, the reverted-words unit run, the battery sweep, goldens,
the e2e run, font coverage, the build).

## 8. The enumeration the brief asked for, and the gaps

Every `classifyError.ts` message and every `SolverErrorNote.vue` string was read, then the whole
of `src/` was grepped for machine-naming string literals (`solver|engine|worker|wasm`, both
apostrophes, comments excluded).

**Reaches a player and named the machine:** the three strings cured here. Nothing else.

**Names the machine and does NOT reach a player**, each checked to its surface:

1. `solver.worker.ts:202,265` — `unknown solver game: …` / `unknown solver request kind: …`,
   thrown INSIDE the worker; `describeError` keeps only the `code` for the wire and the note
   renders `PAPER_NOTE_COPY[variant]`, never `e.message`.
2. `transport.ts:132,144,192,216,266` — `solver worker crashed`, `solver worker unavailable
   after repeated failures`, `unknown worker failure`, the leash sentence. Same path: they become
   a `SolverError.message`, and the only sink is `useGameState`'s `errorMessage` ref
   (`:623`/`:700`/`:823`), which is exported at `:1171` and **read by no component** — grepped
   across `src/**`: no template, no computed, no spec reads it. It is a dangling ref, not copy.
   Booked as gap 2 below.
3. `client.ts:43` `tag: "solver"` — a `console.debug` tag. `SvgFilters.vue:179-184` /
   `HandwrittenGlyph.vue:83` `url(#solver-ink)` — an SVG filter id. `AttributionCard.vue:97`
   `https://github.com/mkbabb/csp-solver` — a repository URL whose link text reads `View the
   project on GitHub`.
4. Comments and this recut's own narration — prose about the law, not copy.

Gaps, each owned:

| # | gap | owner |
|---|---|---|
| 1 | **Copy by ear.** `what fits` (a two-word noun clause beside `marks`) and the note sentences are author- and gate-read, not owner-read. The `network` note now says `reload the page.` while the card's own button says `try again` — the button is drawn for every paper note (`classifyCode`'s default), and a second press cannot clear a dead helper, which is why the sentence carries the other act; a reader may still find the pair competing. | owner U-10 re-look (the class of B1's G21) |
| 2 | **`errorMessage` is a dangling ref.** `useGameState` exports raw `Error.message` values — `solver worker crashed`, `Failed to get board`, `Solve failed`, `Hint unavailable` — that no component reads today. The day one renders it, the machine's name and a capitalised non-register sentence reach a player, and no gate sees it (it is neither a copy table nor a narration call). | W5 gate estate / W7 §6 — chair books |
| 3 | **The copy gate's remaining blind spots**, now two instead of three: the cell core's template literal (B1 §7 gap 2) and a `Record<…, string>` whose TYPE says copy while its name does not (this slice's own new self-test colour, `want: 0`). The name-rule closes the third. | W5 gate estate |
| 4 | **The note is `role="alert"` and its text is the only thing a screen reader gets.** `lint:live-regions` passes (0 regions born speaking) and the sentences still say what broke, but no spec asserts the alert's spoken text in a browser; the unit rows hold it. | W7 §6 — book a spec row if the chair wants the alert gated |
| 5 | **The raw census JSONs are not banked** (the diffs are). `docs/tranches/2026-08-tranche-9/evidence/w7` already exceeds `check-evidence-policy`'s 2 MiB per-wave cap **at HEAD, from the TRACKED loop evidence alone** (2,189,664 B > 2,097,152 B — measured with this whole `exec/` tree untracked and therefore uncounted). The fold cannot pass that gate until W7's tracked evidence is recropped; this slice banks 168 KB. | chair — a fold blocker that predates this slice |
| 6 | **The alert was driven by fault injection, not by a real budget exhaustion or a real dead worker.** The stub is a network-layer fulfilment of the worker chunk; the shipped classifier and the shipped bundle do the rest. A genuine `BUDGET_EXCEEDED` needs a 16×16 HARD board (W4's own subject). | recorded; no row owed |
| 7 | **390×844 and 1280×800 are engine viewport emulation, not devices**, and the caption's phone branch (`flex: 0 0 3.75rem`) was read through the census, not photographed. | owner U-10 + W8 §8.3 (the class of G22) |
