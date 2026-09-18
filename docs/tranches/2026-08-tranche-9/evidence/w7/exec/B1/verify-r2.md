# T9-W7 exec · B1 — non-author verify, round 2

Verifier: non-author (round 2, not the author of `c391665c` and not the round-1 verifier).
Subject: **`e4c45f53`** on `w7/exec` (repair r1 over `c391665c`, wave base `aab67b92`).
Everything below was re-measured in this session; nothing is carried from the author's return
or from `verify-r1.md`. Where a number agrees with theirs, it agrees because I got it too.

**VERDICT: ACCEPT** — zero BLOCKING, zero MUST, three NOTE. Both round-1 MUSTs are answered at
the seam they named, all four NOTEs are answered, every gate the author claims reproduces at my
own hand, and the π-by-identity argument is not merely an argument: I re-censused the served
page at `e4c45f53` and it is **0.00px over 1,089 rects** against the census banked at
`c391665c`. The three NOTEs are record prose, all inside this cure's README.

---

## 1. Gates re-run by me, bare, in the worktree at `e4c45f53`

| Gate | My exit | My reading |
|---|---|---|
| `npx vitest run` | **0** | **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npm run lint:copy` | **0** | 137 files · 0 dashes · **1 hit / 1 admitted / 0 unadmitted** (lexicon 25 entries) · **18/18 self-test colours**, including `admissions · a ghost admission is detected stale → 1/1, RED as required` |
| `npm run lint:live-regions` | **0** | 0 regions born speaking |
| `npm run lint:motion` | **0** | 34 specs, every one declaring its motion state |
| `npm run lint` (prettier `src/ scripts/ ../../scripts/ ../relay/`) | **0** | all matched files; `e2e/` never prettier'd |
| `npx eslint .` | **0** | clean |
| `npx vue-tsc --noEmit` | **0** | clean |
| `npm run typecheck:e2e` | **0** | clean |
| `npm run typecheck:node` | **0** | clean |
| `npm run test:font-coverage` | **0** | no new glyph; departures are the declared superset |
| `npx vite build --config .vite-exec.config.ts` | **0** | `dist/assets/index-Cc6TqSXYnbfW.js` — **the author's hash, third independent reproduction** |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | **0** | **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| `e2e/a11y.spec.ts` + `e2e/sudoku-interaction.spec.ts`, chromium + webkit | **0** | **44 passed in 11.2s** (a11y 30 + interaction 14) |

Preview: my own `vite preview` on **127.0.0.1:4259** (`--strictPort`, the worktree's private vite
cache, the worktree's own `dist/`). Killed; 4257/4258/4259/3000 all verified FREE afterward. The
two specs ran through a throwaway config written into the frontend dir and `rm`'d in the same
command; the worktree is clean but for the sanctioned, uncommitted `.vite-exec.config.ts`. The
MAIN tree's `src/`/`dist/` was never edited, built or served. Chromium + WebKit only — no
osascript, no Safari, no simulator (M19).

**NOT RUN by me:** `npm run test:e2e` (the full battery). The author declares it NOT RUN and I
do not contradict that.

## 2. The born-RED row, re-run by me, all three cases

Reproduced without touching the worktree: `src/`, `scripts/` and `index.html` copied to a scratch
root, individual files swapped to their `aab67b92` or `e4c45f53` blobs, the gate run against that
root (its `ROOT` is `import.meta.dirname/..`).

| Case | copy | gate | my exit | my line |
|---|---|---|---|---|
| A | `aab67b92` | `aab67b92` | **0** | `2 hit(s), 2 admitted, 0 unadmitted` — both `:1297` and `:980` admitted |
| B | `aab67b92` | `e4c45f53` (struck) | **1** | `✗ src/games/shared/GameControlPanel.vue:1297  [@text]  "solver" (the machine's name)  the solver finishes the board` |
| C | `e4c45f53` | `aab67b92` (kept) | **1** | `ADMITTED carries … "the solver finishes the board" and that string no longer trips the lexicon there. The admission outlived the copy it excused — strike the entry.` |

Case B is verbatim the README's pasted RED, to the character. **The regression guard is real and
is mine now, not inherited.** Case C confirms r1's corrected framing in README §3: the strike was
compelled by the gate's third check, not elected. The gate was not loosened — the lexicon is 25
entries, the self-test is 18 colours, the `candidates` admission stands.

Lexicon audition of both recut candidates, run rather than read:
`finishes the board for you` → clean · `revealed answer 4` → clean ·
`Row 2, column 3, revealed answer 4` → clean.

## 3. π — re-measured at `e4c45f53`, both engines

**r1's π claim is not just an identity argument; it measures out.** My own chromium census of
`board@1280×800` on my own port, my own instrument, against the census the author banked at
`c391665c` (`census/after/board-1280x800.json.gz`):

```
A=1089  B=1089  onlyA=0  onlyB=0  moved=0  max=0.00px
```

Zero across 1,089 rects. r1 moved no pixel, and that is measured, not inferred.

**Containment, re-derived independently in both engines** (census the cured page, swap the tape's
text node back to the old string in the DOM, re-census, diff — my own probe, not the author's):

```
chromium: 1089 rects · moved=1 · max=16.42px · onlyA=0 onlyB=0
   …/button:3/span:3   903.96,693.78,168.09,29.32  ->  895.74,693.76,184.51,29.38
webkit:   1089 rects · moved=1 · max=17.75px · onlyA=0 onlyB=0
   …/button:3/span:3   898.45,693.47,179.20,29.36  ->  889.45,693.44,196.95,29.42
```

Exactly one rect answers to that sentence's length, on both engines, and it is the span the cure
claims. This reproduces `verify-r1.md` §3 to the hundredth of a pixel and confirms r1 disturbed
nothing.

**Bundle identity, independently checked.** `dist/` at `e4c45f53` carries no test-file leakage,
carries `finishes the board for you` and `revealed answer` in `index-Cc6TqSXYnbfW.js`, and
carries **no occurrence of `solver finishes the board` or `solver's answer` anywhere**. The three
files r1 edits (`e2e/a11y.spec.ts`, `scripts/check-copy-register.mjs`,
`src/games/shared/BoardHost.authors.test.ts`) are outside the build graph by inspection and by
the reproduced hash.

## 4. The two MUSTs, checked at their seams

**MUST-1 (disclosure) — ANSWERED, and the disclosure is COMPLETE.** README §7 gap 5 books
`classifyError.ts:51-52` with its render path, and I verified every hop:
`classifyError.ts:50` `PAPER_NOTE_COPY` → `:51` `budget: "the solver ran out of steps on this
board."` / `:52` `network: "couldn't reach the solver."` → `GameBoard.vue:45` imports it →
`:893-896` `errorNote` computed hands `f.message` (which IS `PAPER_NOTE_COPY[variant]`, via
`classifyCode` at `classifyError.ts:75`) → `SolverErrorNote.vue:46`
`<p class="error-note-text">{{ text }}</p>` inside `role="alert"`. Rendered copy, confirmed.

I then tried to **beat** the disclosure by scanning every string literal in `src/` (comments
masked) against the machine-name half of the lexicon. Only two more candidates surfaced,
`transport.ts:132/144/192/266` (`solver worker crashed`, …) and `SvgFilters.vue:180-184`
(`stop-color: var(--color-solver-ink-N)`) — and **neither reaches a player**: `GameBoard.vue:895`
renders the Fiction's `message`, never a thrown `Error`'s, and the SVG strings are CSS custom
property names. `classifyError.ts:51-52` really are the only two, so §7 gap 5's enumeration is
exhaustive and not merely a sample.

Leaving them uncured is right in kind: DISPOSITIONS row T9-B1 enumerates exactly
`"the solver finishes the board"` + `solver's answer N`, which I read at the source
(`DISPOSITIONS.md:27`), and these are neither.

**MUST-2 (the dangling reason) — ANSWERED.** `check-copy-register.mjs:137-145`: the `why` no
longer ends "with its sibling above" and now names the live owner (B1's execution left the
caption standing; the chair's ruling strikes the entry). Every factual claim inside it checks
out: the ballot does enumerate two strings, `candidates` is neither, and the referenced §7 gap 1
exists. Zero gate movement — `lint:copy` still reports 1 admitted, 0 unadmitted.

## 5. The four NOTEs, checked

- **NOTE-3 (cite drift) — the three code/README cites are now TRUE, verified at the target.**
  `useGameCell.ts:148` is the `cellKind` switch · `:158` is `core = \`revealed answer …\`` ·
  `:145-168` is the `ariaLabel` computed, opening brace to closing. A grep for
  `useGameCell.ts:<n>` over `src/ e2e/ scripts/` returns exactly two hits, both true, as claimed.
  `sudoku-interaction.spec.ts:87` is the regex, `a11y.spec.ts:587` is the enumerating regex,
  `check-copy-register.mjs:426` is the self-test fixture, `check-copy-register.mjs:243` is
  `COPY_KEYS`, `index.css:198` and `SvgFilters.vue:174` are the `#solver-ink` comments. All hold.
- **NOTE-4 (header falsehood) — ANSWERED.** `check-copy-register.mjs:35-38` is past-tensed and
  the B1 close appended. The re-introduced old string sits in a block comment and is masked;
  the gate's green run proves it.
- **NOTE-5 (chromium-only census) — ANSWERED.** README §5's ENGINE SCOPE paragraph says so
  plainly and cites `verify-r1.md` §3 rather than absorbing it. I independently confirmed
  `probe/rect-census.mjs:71` launches `chromium` and nothing else, and my own §3 above supplies
  a second WebKit whole-tree reading.
- **NOTE-6 (the RED was compelled) — ANSWERED.** README §3 states it, quotes the forcing line,
  cites Case C, and keeps the Case B demonstration. My Case C reproduces it.

## 6. The copy, by ear (my own reading, not the round-1 verifier's)

- **`finishes the board for you`** — under an icon sublabel reading `solve`, inside
  `button[aria-label="Solve puzzle"]`. A player with no knowledge of the app understands it
  first time. No jargon, no metaphor, no dash, no machine naming itself. All four banked crops
  opened: the string renders complete and legible in both engines, no tofu, no clipped
  descender. 43,260 B total, largest 12,241 B, well inside the 150 KB ceiling.
- **`revealed answer N`** — spoken `Row 2, column 3, revealed answer 4`. Distinct in the ear from
  `given clue 4` and `your entry 4` / `brave-otter's entry 4`; short; `revealed` is the player's
  own act.
- **The spoken contract is INTENT-kept, not regex-widened.** `DigitCell.attribution.test.ts:119-120`
  pins the whole sentence AND `not.toContain("solver")`, so the row reds on a revert.
  `a11y.spec.ts:592` asserts `filled.length > 0` and `sudoku-interaction.spec.ts:91` asserts
  `solvedIdx >= 0`, so both regexes must match a live cell for their rows to pass — neither is
  a vacuous rename. All three rows are green at my own hand.

---

## 7. Findings

### NOTE-1 — the repair's own cite of the reason it repaired is off at both ends

README §8, MUST-2 row, cites `check-copy-register.mjs:141-148` for the re-pointed `why`. The
`why` value spans **:137-145**; the text r1 actually changed is **:143-145**; `:146` is `since:`,
`:147` closes the entry and `:148` is the array's `];`. The cited range opens mid-string and runs
three lines past the object. This is the same class as the NOTE-3 drift this very repair
answered, in the row that answers it. **Fix:** `:137-145`, or `:143-145` for the changed lines.

### NOTE-2 — "the commit's own claim narrowed" narrows only r1's commit, not the one that overclaimed

README §8's MUST-1 row reads "the commit's own claim narrowed to the ballot's two strings".
`e4c45f53`'s message is indeed narrow. But the message round 1 flagged as false is
`c391665c`'s — *"the machine stops naming itself to a player"* — and it stands verbatim; nothing
is pushed, so a rewrite was available and was declined. §8's preamble does say "nothing is
rewritten, `c391665c` stands", so the fact is disclosed two paragraphs above the row, but the
row's own wording reads as if the offending claim were fixed. A reader of `git log` alone still
meets the overclaim with no correction beside it. **Fix:** one clause in that row — name which
commit narrowed, and say the parent's message stands with the record correcting it.

### NOTE-3 — §7 gap 4's "deliberate prose residue" does not close its own count

Gap 4 names three surviving occurrences of the old strings (`index.css:198`,
`SvgFilters.vue:174`, the `check-copy-register.mjs:426` fixture). A grep over `src/ e2e/ scripts/`
returns **seven**: those three plus `useGameCell.ts:140`, `DigitCell.attribution.test.ts:114`,
`check-copy-register.mjs:129` (the strike comment) and `check-copy-register.mjs:35` (the header
prose r1 itself re-wrote). All four unnamed ones are the recut's own narration and are plainly
deliberate — this is a completeness quibble on a gap paragraph, not a defect in the cure. **Fix:**
add "plus the four comments the recut wrote to narrate itself" to gap 4, or state the count.

## 8. What I could NOT refute

- Both round-1 MUSTs are answered at the seam each named, and the MUST-1 disclosure is
  exhaustive, not a sample — I looked for a third rendered offender with a broader instrument
  than the brief's grep and there is none.
- Every gate row in the author's return reproduces at my own hand with the same exit code and
  the same figures, including `Test Files 68 passed (68)` and the 18 self-test colours.
- The born-RED matrix reproduces in all three cases; Case B is verbatim the pasted RED.
- The build hash `index-Cc6TqSXYnbfW.js` reproduces for the third time independently, and the
  dist holds neither old string.
- π at r1 is **0.00px over 1,089 rects** against the banked `c391665c` census — measured, not
  argued — and the containment to one span holds in both engines at 16.42 / 17.75px.
- The goldens are 4/4 with nothing re-baselined; the font cut needs no re-cut; both edited e2e
  specs pass end to end in both engines with their assertions still load-bearing.
- The three cites r1 re-derived are true at their targets, and the `useGameCell.ts:<n>` grep
  returns exactly the two claimed hits.

## 9. Instruments

My scratch (not banked in the repo):
`/private/tmp/claude-504/…/scratchpad/{r2red/, r2-census.mjs, r2census/, banked-after.json, lintcopy.txt, build.txt}`.
Servers started: one `vite preview` on 127.0.0.1:4259 — killed, port free. One throwaway
Playwright config written into `web/frontend/` and deleted in the same command; not committed.
No file in the MAIN tree's `src/` or `dist/` was edited, built or served; the worktree's source
was never edited, stashed or re-checked-out.
