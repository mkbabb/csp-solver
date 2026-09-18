# T9-W7 exec · B1 — the ballot's two strings stop naming the machine

Ballot **T9-B1** fires by its default (DISPOSITIONS §2, row T9-B1; firing log line dated
2026-09-17 "FIRING at W7's execution lanes"). Commit **`c391665c`** on `w7/exec`, on top of
3C-4 (`2b6b8b7b`). **Repair r1 = `e4c45f53`** (§8), a new commit on top: nothing is rewritten,
`c391665c` stands, the chain reads forward.

## 1. The seam

SCOPE, stated first: this cure recuts **the two strings ballot B1 enumerates**, not every
rendered string in the tree that says "solver". Two more survive it, booked at §7 gap 1 and
§7 gap 5 and neither in this lane's fence.

Two rendered surfaces spoke the machine's own name, and M16's law is categorical: no jargon,
no meta-language, no machine naming itself.

| Site | before | after |
|---|---|---|
| `src/games/shared/GameControlPanel.vue:1297` — the washi tape on the **Solve** button | `the solver finishes the board` | `finishes the board for you` |
| `src/games/shared/useGameCell.ts:158` — the cell's spoken core, third of three authorships | `solver's answer N` | `revealed answer N` |

The cell core is the clause that says whose digit a cell holds (W3 §3.3, ONE HAND NAMED ONCE).
The three cores stay distinguishable in the ear: **`given clue N`** (nobody wrote it) ·
**`your entry N`** / **`<slug>'s entry N`** (a hand wrote it) · **`revealed answer N`** (it was
filled in because the player asked). `revealed` is the player's own act, not the machine's name;
the long form would be "filled in for you", which is longer in every announcement for no gain.

Both candidates were run through `check-copy-register`'s lexicon (25 entries) and neither trips
it — no entry matches `finish`, `board`, `you`, `reveal` or `answer`. No em dash, no metaphor.

## 2. The diff

Eight files, one commit:

- `src/games/shared/GameControlPanel.vue` — the tape's `text`.
- `src/games/shared/useGameCell.ts` — the `solved` core, plus the two comments that named the
  old string (the §3.3 doc block records what the core used to read and why it moved).
- `src/games/shared/DigitCell.attribution.test.ts` — the pinned name, and a second assertion
  (`not.toContain("solver")`) so the row reds on a revert, not only on a re-word.
- `src/games/shared/BoardHost.authors.test.ts` — the header's cite of the pinned name.
- `e2e/a11y.spec.ts:587`, `e2e/sudoku-interaction.spec.ts:87` — the two regexes that read the
  cell's name. Intent unchanged: one enumerates the three cores, one finds a filled cell.
- `scripts/check-copy-register.mjs` — the ADMITTED entry for `the solver finishes the board` is
  **struck**. The gate is not loosened: its lexicon, its self-test and the `candidates`
  admission are untouched, so the gate now reds on a regression of this exact string.
- `scripts/check-font-coverage.mjs:220` — the declared Patrick Hand corpus follows the tape.

## 3. The born-RED row

The gate was GREEN at `aab67b92` only because of the carve-out, so the born-RED row is the
carve-out's removal. Struck first, gate run, then the copy cured.

The strike was **compelled, not elective**: the gate's third check reds an admission whose
string is no longer on the tree ("the record cannot outlive the copy it excuses"), so curing
the copy and keeping the entry exits 1 with *"The admission outlived the copy it excused —
strike the entry"* (verify-r1.md §2, Case C). What the strike buys is nonetheless real and
separately reproduced: with the admission gone, the OLD copy reds (Case B).

RED (`npm run lint:copy`, exit **1**, admission struck, copy not yet cured):

```
jargon over RENDERED strings: 2 hit(s), 1 admitted, 1 unadmitted (lexicon: 25 entries)
  ✗ src/games/shared/GameControlPanel.vue:1297  [@text]  "solver" (the machine's name)  the solver finishes the board
check-copy-register: 1 failure(s):
  • src/games/shared/GameControlPanel.vue:1297 renders "solver" (the machine's name) in `the solver finishes the board`. M16: jargon, metaphor, meta-language and contrivance are deleted wholesale and what survives is plain English. Rewrite it in the player's words, or admit it in ADMITTED with the seam that owns the cure.
```

GREEN (same command, exit **0**, after the recut):

```
jargon over RENDERED strings: 1 hit(s), 1 admitted, 0 unadmitted (lexicon: 25 entries)
  ~ src/games/shared/GameControlPanel.vue:980  [template]  "candidates" (solver vocabulary for what a player calls a pencil mark) — ADMITTED 2026-08-28
check-copy-register: 0 em/en dashes and 0 unadmitted jargon in product copy (1 admitted, each with its cure's seam)
```

The spoken half has its own row: `DigitCell.attribution.test.ts` pins the sentence a screen
reader hears, and it reds on the old string by the added `not.toContain("solver")`.

## 4. Gates (all run in the worktree, bare, at `c391665c`)

| Gate | Exit | Reading |
|---|---|---|
| `npx vue-tsc --noEmit` | 0 | clean |
| `npm run typecheck:e2e` | 0 | the two edited specs typecheck |
| `npm run typecheck:node` | 0 | clean |
| `npx vitest run` | 0 | **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npm run lint` | 0 | prettier over `src/ scripts/ ../../scripts/ ../relay/` |
| `npm run lint:copy` | 0 | see §3 |
| `npm run lint:live-regions` | 0 | 0 regions born speaking |
| `npm run lint:motion` | 0 | 34 specs, each declaring its motion state |
| `npm run test:font-coverage` | 0 | **no new glyph** — Patrick Hand 46 codepoints, 17 declared strings over 3 groups, each derived; `finishes the board for you` clears the cut as authored and as transformed |
| `npx vite build --config .vite-exec.config.ts` | 0 | the worktree's own dist |
| `PLAYWRIGHT_BASE_URL=… npx playwright test -c playwright-golden.config.ts` | 0 | **4 passed**, none re-baselined, no `--update-snapshots` |

NOT RUN at `c391665c`: the full Playwright battery (`npm run test:e2e`). **Closed at repair r1** —
the two edited specs now have their own run, both engines, against the worktree's preview:
`a11y.spec.ts` + `sudoku-interaction.spec.ts` = **44 passed** (30 + 14), exit 0. See §8.

## 5. π — the rect census

`probe/rect-census.mjs` (the estate's idiom, carried from 3C-4): every element's
`getBoundingClientRect` on `board` and `gallery`, at 1280×800 and 390×844, PRM emulated, board
pinned by permalink. Taken on the un-edited worktree served from its own dist, then again after
the diff. `census/diff-before-after.txt` is the whole reading.

ENGINE SCOPE, plainly: **the whole-tree census below is chromium** — `probe/rect-census.mjs`
launches chromium and nothing else. The both-engines reading is the tape box
(`probe/tape-box.mjs`, `census/tape-box-*.json`) and the four frames. The non-author verifier
ran the full tree in WebKit as well and got the same answer — 1089 rects, **1 moved, max
17.75px**, the same `button:3/span:3` span — which is `verify-r1.md` §3, not this bank.

```
board-1280x800.json:   1089 rects, 1 moved, max |Δ| 16.52px
board-390x844.json:    1049 rects, 0 moved, max |Δ| 0.00px
gallery-1280x800.json: 1807 rects, 0 moved, max |Δ| 0.00px
gallery-390x844.json:  1767 rects, 0 moved, max |Δ| 0.00px
TOTAL 5712 rects; grand max |Δ| 16.52px
```

The one moved rect is the tape's own box and nothing else:

```
html/body:2/div:1/div:1/main:5/div:1/div:2/div:3/div:2/div:1/div:1/div:7/div:1/button:3/span:3
  895.69,693.42,184.61,30.05  ->  903.96,693.78,168.09,29.32
```

Identified live: `class="washi-label washi-wide"`, text `finishes the board for you`, inside
`button[aria-label="Solve puzzle"]`. It is `position: absolute` with `width: max-content`, so a
shorter sentence narrows it (184.61 → 168.09px, −16.52) and re-centres it (+8.27px of x) while
**no sibling and no ancestor moves** — the Solve button is `978.81,634.03,46,56.03` in both
censuses, both engines. At 390×844 the tape is not rendered at all (`v-if="!mobile"`), which is
why that viewport is 0.00px on 1,049 rects.

DECLARED, not a surprise: `SheetWashiLabel`'s seeded geometry keys off `text.charCodeAt(0)`, so
changing `t` → `f` re-rolls the torn ends and the tilt (−0.390° → −0.180°). That is the 0.73px
of height in the row above — the tape's rotated bounding box, inside its own claimed box. No
other tape's seed is touched.

## 6. DELTA frames

Four crops, 228×112 at the Solve control, 43 KB total (largest 12,241 B, limit 150 KB each).
The tape is `opacity: 0` until hover or `:focus-visible`, so "at rest" would frame blank paper;
each frame is taken on hover, the only pose in which this string is legible. Probe:
`probe/tape-frame.mjs`.

- `frames/before-1280-chromium-solve-tape.png` — `the solver finishes the board`, tape 184.61px
- `frames/after-1280-chromium-solve-tape.png` — `finishes the board for you`, tape 168.09px
- `frames/before-1280-webkit-solve-tape.png` — the same string, tape 197.05px (WebKit's hand
  metrics run wider)
- `frames/after-1280-webkit-solve-tape.png` — tape 179.20px

Per-engine tape boxes are banked whole in `census/tape-box-before.json` and
`census/tape-box-after.json` (rect, computed opacity, transform, clip-path, both engines).

## 7. Gaps

1. **`candidates` is still admitted.** `check-copy-register`'s second ADMITTED entry (the row
   caption at `GameControlPanel.vue:980`) cites ballot B1 as its owner, but the ballot's own
   text and W7 §9 both enumerate exactly two strings and that caption is neither. It is left
   admitted and untouched here. The chair decides whether B1 closes with it outstanding or the
   caption gets its own recut — it is a second copy ruling with a π cost of its own (the
   caption is in flow, so a re-word moves its neighbours, unlike the tape). At repair r1 that
   entry's own `why` was re-pointed: it used to close "with its sibling above", and the sibling
   was struck by this same commit, so the reason outlived its referent. It now names the live
   owner (B1's execution left it standing; the chair's ruling is what strikes it).
2. **The copy gate cannot see the cell's core.** `useGameCell.ts`'s `core = \`…\`` is neither a
   template text node, nor a rendered attribute, nor a `COPY_KEY`, nor a `NARRATION_CALLS`
   argument, so the jargon arm was blind to `solver's answer N` for its whole life and would be
   blind to a regression. Only the unit row guards it. Widening the arm to the accessible-name
   computeds is a gate change with its own false-positive surface and was out of this lane's
   fence; booked here for W5's gate estate.
3. ~~**The full e2e battery was not run**~~ — **CLOSED at repair r1.** Both edited specs ran end
   to end, both engines, 44 passed (§8). The rest of the battery is still not this lane's run.
4. **Prose residue is deliberate.** `src/assets/index.css:198` and
   `src/pencil/chrome/SvgFilters.vue:174` still say "the solver's answers" — both are comments
   about the `#solver-ink` filter id, which is code, not copy. `check-copy-register.mjs:426`'s
   self-test fixture keeps the old string on purpose: it is the injected RED that proves the
   jargon arm still fires on a washi tape. (The fold's G20: a bare `the solver` grep over
   `src/` at `e4c45f53` finds seven non-test hits, not three — the other four are this recut's
   own narration in comments (`useGameCell.ts:140`, `GameBoard.vue:1244`, `BoardHost.vue:184`,
   `DigitCell.vue:58`) and the pre-existing code commentary in `cards.ts`, `clue.ts` and the
   three `use*.ts` composables; none is copy a player reads.)
5. **TWO RENDERED STRINGS STILL NAME THE MACHINE, and this cure does not touch them** (found by
   the non-author verifier, MUST-1; booked at repair r1). `src/games/shared/solver/
   classifyError.ts:51-52` — `budget: "the solver ran out of steps on this board."` and
   `network: "couldn't reach the solver."`. They are rendered, not commentary: `GameBoard.vue:45`
   imports `PAPER_NOTE_COPY`, `:896` hands it to `SolverErrorNote`, `SolverErrorNote.vue:46`
   prints it as `<p class="error-note-text">{{ text }}</p>` inside a `role="alert"` note card.
   They are outside B1's fence — the ballot enumerates two strings and these are neither — and a
   re-word is a copy ruling with its own π cost (the note card is in flow, and both sentences
   carry the same "what broke" contract as `deal-timeout`'s). **The chair rules whether B1 takes
   a third recut here.** Until then the cure's claim is the narrow one §1 now states.
6. **THIRD GATE BLIND SPOT, same class as gap 2.** `lint:copy` exits 0 over a tree holding both
   strings in gap 5, and it is not a lexicon miss — the jargon arm's script half reads
   `COPY_KEYS` (`check-copy-register.mjs:243`: `sublabel`/`washi`/`aria`/`heading`/`label`/
   `caption`/`note`/`text`/`title`/`placeholder`), and `PAPER_NOTE_COPY`'s keys are the DOMAIN's
   (`budget`/`network`/`deal-timeout`/`unknown`). A copy table keyed by what the copy is ABOUT is
   invisible to a detector keyed by what the copy IS. Gap 2 is the same shape one seam over (a
   template literal in a computed). Booked together for W5's gate estate: the arm needs the
   object-shape case — a `Record<…, string>` whose declared type or name says copy — not another
   key added to the list.

## 8. Repair r1 — `e4c45f53`

Non-author verify (`verify-r1.md`) ruled REPAIR on two MUSTs and four NOTEs. Every one is
answered below. **No product string moved in this repair** — the two MUSTs are a disclosure and
a reason, and the four NOTEs are cites and prose, so the shipped bundle is byte-identical to
`c391665c`'s and π is zero by construction rather than by census (see "π" below).

| Finding | What it got |
|---|---|
| MUST-1 — two rendered strings still name the machine, undisclosed | §7 gap 5 books `classifyError.ts:51-52` with its whole render path; §1 opens with the narrow scope; the commit's own claim narrowed to the ballot's two strings in the repair commit `e4c45f53` (the cure commit `c391665c`'s message still overclaims and stands unrewritten — the fold's G19). Not recut here: the chair ruled 2026-09-18 that the residues are cured as their own slice (exec slice 2, cure B1b) with their own census, not by an admission. |
| MUST-2 — the surviving admission's reason cites a struck sibling | `check-copy-register.mjs:137-145` (the `why` block at `e4c45f53`; the fold's G20 re-anchored the earlier `:141-148`) — the `why` drops "with its sibling above" and names the live owner (B1's execution left the caption standing; the chair's ruling strikes the entry). |
| NOTE-3 — line-cite drift the commit introduced | Three cites re-derived at their citation sites: §1 `useGameCell.ts:153 → :158`, `BoardHost.authors.test.ts:19` `:140 → :148` (named as the `cellKind` switch), `e2e/a11y.spec.ts:123` `:114-135 → :145-168`. §2's `sudoku-interaction.spec.ts:86 → :87` and §7's `check-copy-register.mjs:422 → :426` went with them. A grep for `useGameCell.ts:<n>` over `src/ e2e/ scripts/` now returns exactly those two, both true. |
| NOTE-4 — the gate's header prose states a falsehood | `check-copy-register.mjs:35-38` — "the string is still shipping" is past-tensed and the B1 close appended: it ships no longer, and this arm is now what reds if it comes back. |
| NOTE-5 — the banked full-tree census is chromium-only | §5 says so plainly, names the tape box as the both-engines instrument, and cites `verify-r1.md` §3 for the verifier's own WebKit full-tree reading (1089 rects, 1 moved, 17.75px, same span) rather than claiming it as banked here. |
| NOTE-6 — the RED was compelled, not elective | §3 says the gate's third check forces the strike, quotes the forcing line, and cites Case C — while keeping the Case B demonstration, which is what the strike actually buys. |

Files touched at r1: `scripts/check-copy-register.mjs` (two comment/reason edits),
`src/games/shared/BoardHost.authors.test.ts` (one cite), `e2e/a11y.spec.ts` (one cite), this
README.

**π — zero, by identity.** The three code edits are a comment in a test file, a comment in an
e2e spec, and two comments/one string-reason in a build script; none of the three files enters
the bundle. `npx vite build --config .vite-exec.config.ts` after the repair emits
`dist/assets/index-Cc6TqSXYnbfW.js` — the same content-hashed name the author built at
`c391665c` and the verifier reproduced independently. Same bytes, same pixels; no re-census was
run and none is claimed.

Gates re-run bare in the worktree after the repair (my own exit codes, not the verifier's):

| Gate | Exit | Reading |
|---|---|---|
| `npx vite build --config .vite-exec.config.ts` | 0 | `index-Cc6TqSXYnbfW.js`, hash unchanged |
| `npx vitest run` | 0 | **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npm run lint:copy` | 0 | 1 hit / 1 admitted / 0 unadmitted; all 18 self-test colours as required — including `admissions · a ghost admission is detected stale → 1/1, RED as required`, the check that compelled the strike |
| `npm run lint:live-regions` | 0 | 0 regions born speaking |
| `npm run lint:motion` | 0 | 34 specs, each declaring its motion state |
| `npm run lint` (prettier) | 0 | all matched files; `e2e/` never prettier'd |
| `npx eslint .` | 0 | clean |
| `npx vue-tsc --noEmit` | 0 | clean |
| `npm run typecheck:e2e` | 0 | clean |
| `npm run typecheck:node` | 0 | clean |
| `npm run test:font-coverage` | 0 | no new glyph |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | 0 | **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| `npx playwright test -c <throwaway> e2e/a11y.spec.ts e2e/sudoku-interaction.spec.ts` | 0 | **44 passed** — chromium + webkit × (30 a11y + 14 interaction). Closes §7 gap 3. |

The e2e run used a throwaway config (`webServer: undefined`, `baseURL: http://127.0.0.1:4259`)
against the worktree's own preview, deleted immediately after; it is not committed. The preview
was killed and 4257/4258/4259/3000 verified free. Chromium and WebKit only — no osascript, no
Safari, no simulator (M19). The main tree's `src/`/`dist/` were never read-modified or served.
