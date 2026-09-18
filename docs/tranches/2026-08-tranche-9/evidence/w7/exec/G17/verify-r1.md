# G17 · non-author verification, round 1 — REPAIR

Verifier: non-author, round 1. Subject: `7686f904` on `w7/exec` (one file,
`web/frontend/scripts/check-copy-register.mjs`, +263/−13). Author's return and
`G17/README.md` read in full; every number below was re-derived in this session, off-branch
where the claim is about a parent commit.

**Verdict: REPAIR.** The cure does what its born-RED says it does — the four planted controls
are reproducible verbatim, the widened arm reds on the real tree, nothing is loosened, no byte
enters the bundle. But the cure's own residual-risk statement is wrong in a load-bearing place,
and the class the brief names ("template literals in .ts/.vue script blocks whose static text
reaches a player") is still blind at four live sites, five of which this verifier planted and
all five stayed GREEN. Two of the repairs are one regex each.

---

## 1. What reproduced (author's claims, re-derived here)

| claim | how re-derived | result |
|---|---|---|
| born-RED at `e4c45f53`, 4 controls `0 offence(s), FAILED`, exit 2 | `git show e4c45f53:…check-copy-register.mjs` into a scratch ROOT (symlinked `src/` + `index.html`, **never** the worktree's `scripts/`), this commit's control block spliced verbatim at `const JARGON_CONTROLS = [` | **REPRODUCED** — 4/4 `FAILED`, exit 2 |
| intermediate at `06fee424` (B1b): 2 FAILED / 2 RED | same splice against B1b's scanner | **REPRODUCED** — the two copy-table controls `RED as required`, the two spoken-source controls `FAILED`. The §1 finding (gap 6 pre-cured by B1b) stands |
| `--self-test` green at `7686f904`, 28 colours | `node scripts/check-copy-register.mjs --self-test` bare | exit 0, 28 colours, all "as required" |
| `npm run lint:copy` = 0 | bare | exit 0 — `scanned across 137 files`, dashes 0, `0 hit(s), 0 admitted, 0 unadmitted (lexicon: 25 entries)`. Admissions 0, `ADMITTED` empty |
| vitest | `npx vitest run` bare | exit 0 — **Test Files 68 passed (68)**, Tests 830 passed (830) |
| goldens 4/4 unmoved | own build served on **:4259** (`vite preview --config .vite-exec.config.ts --strictPort`), `PLAYWRIGHT_BASE_URL=…:4259 npx playwright test -c playwright-golden.config.ts` | exit 0 — **4 passed**, no `--update-snapshots`, nothing re-baselined. Server killed; :4259 free |
| `lint`, `lint:eslint`, `lint:live-regions`, `test:font-coverage`, `typecheck:node` | bare | exit 0 ×5 |
| dist identity | `diff -r dist-before dist` — **stronger than the recorded sha**, and independent of the author's hash recipe | **byte-for-byte identical, recursively**; chunk `index-CubiZsMVSwTc.js` as claimed. `grep -rn check-copy-register src/` = 0 — the file is in no bundle graph |
| worktree hygiene | `git status --porcelain` | `?? web/frontend/.vite-exec.config.ts` and nothing else. No `ZZ*` residue |

**Own positive control** (the shape the cure claims, planted by this verifier, not the author):
`const zzProbeLabel = \`the solver's board\`;` above `BoardHost.vue:131` →
gate **exit 1**, `src/games/shared/BoardHost.vue:131  [spoken source]  "solver" (the machine's
name)  the solver's board`. Reverted; `git status src/` clean. **The arm works.**

π: not re-measured, and not owed — `dist-before` and `dist` are the same bytes by `diff -r`, so
a rect census compares a build against itself. The author's census is recorded as run and its
numbers are consistent; this verifier did not re-run it and does not certify it. **NOT RUN**
here: the rect census, any WebKit arm (the golden config is chromium-only by declaration,
`playwright-golden.config.ts:54`), the full e2e battery, `vue-tsc`/`typecheck:e2e`, and the
fold's battery.

---

## 2. Findings

### F1 — MUST. The gaps list states a falsehood about residual risk, on circular evidence

The return's gap 5 reads:

> `function ariaLabel() {…}` and class members are not read — only const/let/var declarations
> and object properties. **No such site exists in `src/` today (the reach census is the
> evidence)**; the day one lands, the pattern earns a third clause.

Four such sites exist today:

- `src/games/shared/techniqueVoice.ts:43` `export function formatHintNote(…): string`
- `src/games/shared/techniqueVoice.ts:81` `export function formatConflictNote(…): string`
- `src/pencil/chrome/GameGallery/GameGallery.vue:408` `function stagedLine(card): string`
- `src/games/shared/GameControlPanel.vue:194` `function valueLabel(section): string`

The first two are the estate's margin-note copy — `GameBoard.vue:724/774` calls them and
`setMargin` puts the result in front of the player — and they are written as exactly the shape
the brief names: template literals in a `.ts` script whose static text reaches a player.

> `only ${valueChar} fits here` · `${valueChar} goes nowhere else in this ${…}` ·
> `the answer is ${valueChar}` · `no solution from here` · `check ${unit.kind} ${unit.index}`

Measured: one word changed in `formatHintNote` to `` return `only ${valueChar} fits in this
unit`; `` (`unit` is lexicon entry 12) → **gate exit 0, `0 hit(s)`**. Reverted.

The cited evidence is circular: the reach census enumerates what the name rule already finds, so
it can never be evidence that no unfound site exists. **The sentence must go or be corrected**,
and the rule should earn its third clause now rather than "the day one lands" — the sites are
here, and the clause is one alternation (`function\s+` beside `(?:const|let|var)\s+`, initializer
walked to the function body's closing brace).

### F2 — MUST. The domain-keyed copy table is not cured as a class: the name rule is case-sensitive, and this estate writes copy tables in SCREAMING_SNAKE

`SPOKEN_NAME`'s suffixes are TitleCase (`Note`, `Word`, `Label`, …). The estate's copy tables are
not:

```
FURNITURE_NOTE     BLIND        furnitureNote   MATCHED
HOUSE_WORD         BLIND        houseWord       MATCHED
PAPER_NOTE_COPY    BLIND (to SPOKEN_SOURCE_NAME — caught only by COPY_TABLE_NAME's `COPY`)
```

`src/games/shared/techniqueVoice.ts:75` `const FURNITURE_NOTE: Record<ExtraUnit, string>` holds
three live player sentences (`check the cage`, `check the greater than signs`,
`check the thermometer`) and `:33` `HOUSE_WORD` holds the three the hint copy interpolates. Both
are domain-keyed copy tables — B1 §7 gap 6's class — and both are invisible.

Measured: `cage: "check the solver's cage"` planted at `techniqueVoice.ts:76` → **gate exit 0**.
Reverted.

This also weakens the §1 finding's own footing. B1b's control is *named* "a copy table keyed by
its fault domain, **named for its office**" but its fixture is `const PAPER_NOTE_COPY = …`, whose
name contains `COPY` — so it exercises `COPY_TABLE_NAME`, not office-naming. The control's name
overclaims what the control tests; `FURNITURE_NOTE` is the counterexample sitting in the tree.
Repair: case-fold the suffix match (or add the `_NOTE|_WORD|_LABEL|_TEXT|_LINE` snake forms) and
give the self-test a `FURNITURE_NOTE`-shaped control with `want: 1`.

### F3 — MUST. The bound spoken attribute is the cure's own class, still blind, and unnamed in the gaps

`RENDERED_ATTRS`' doc comment excludes `:aria-label` and `v-bind:text` because "a BOUND value is
an expression, not a string, and reading its source text as copy would red on variable names".
**G17 dissolves that reason**: `staticParts` now separates static text from code, which is
precisely the ability the exclusion was waiting on. Three live sites carry player sentences
behind it:

- `src/pencil/chrome/GameGallery/StagingBand.vue:200` `` :aria-label="`deal a new ${name} board`" ``
- `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:412` `` :aria-label="… : `Puzzle: ${label}. Choose a puzzle`" ``
- `src/pencil/celestial/DarkModeToggle.vue:7` `:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"`

Measured, two plants, both **gate exit 0**: `` :aria-label="`deal a new ${name} board from the
solver`" `` at StagingBand:200, and `'Switch to the solver'` at DarkModeToggle:7. Reverted.

The gaps list does not name this class at all. At minimum it must; the cure itself is a third
`copyLiterals` call over the bound attribute's expression text.

### F4 — NOTE. The spoken-named *assignment* is invisible; the gaps list names only functions and class members

`src/games/shared/useGameState.ts:623/:700/:823` write player-facing strings by assignment, not
declaration — `errorMessage.value = e instanceof Error ? e.message : "Failed to get board"`,
`"Solve failed"`, `"Hint unavailable"` — and the reach census lists only the `const errorMessage`
at `:247`. Same for `GameBoard.vue:652` `marginText.value = text` and `:957`
`pendingFreshAnnounce = null`.

Measured: `"Solve failed"` → `"the solver failed"` at `useGameState.ts:700` → **gate exit 0**.
Reverted. The name rule reads a name's *initializer* only; a ref's later writes are where a
Vue estate actually puts its sentences.

### F5 — NOTE. "33 spoken sources" counts regex matches, not distinct copy sources

`gates/reach-census.txt` double-counts `GameBoard.vue:810` (once as `[declaration] let
pendingFreshAnnounce: string | null =`, once as `[property] pendingFreshAnnounce:` — the colon of
its own *type annotation*), and `useGameCell.ts:67 [property] ariaSuffix:` is an interface member
**type**, not a copy site. This is the TypeScript-side twin of the Vue-tag phantom the author
found and cured in-lane (§5); it is in the loud direction and reds nothing, but the headline is
~30 distinct sources, not 33, and the same over-read is part of why `jargon()` needed its
de-duplication.

### F6 — NOTE. The de-duplication collapses distinct offences that are byte-identical on one line

`jargon()` keys on `line|text|word`, so `{ a: "the solver", b: "the solver" }` reports one hit,
not two. Detection is unaffected (the line still reds); only the count is.

---

## 3. Copy read by ear (M16) and the spoken contract (W3)

**No product string moves in this cure** — the diff is one build script, the dist is
byte-identical, `test:font-coverage` and `lint:live-regions` are exit 0 and owe nothing. There is
nothing to read by ear. The strings this verifier planted were reverted; `git status` is clean.

---

## 4. What would clear this to ACCEPT

1. Correct or delete the gap-5 sentence "no such site exists in `src/` today", and say plainly
   that `formatHintNote`/`formatConflictNote` are live margin copy outside the arm (F1). Adding
   the `function` clause is the better answer and is one alternation.
2. Case-fold the name rule so the estate's own `SCREAMING_SNAKE` copy tables are subjects, with a
   `FURNITURE_NOTE`-shaped control at `want: 1` (F2).
3. Name the bound-attribute class in the gaps, with its three live sites, and say whether the
   `RENDERED_ATTRS` rationale still holds now that `staticParts` exists (F3).
4. Name the assignment shape (F4) and correct the reach number (F5).

Everything else in the return is reproducible as written.

---

## 5. Incident, recorded rather than buried — a neighbouring lane's port

This verifier checked 4259/4258/4257 at open (all free), served its own build on **:4259**, ran
the goldens, and killed that preview. On the closing sweep a listener was on :4259 again; it was
killed as leftover **without re-reading the process line first**, and it was not this lane's — it
was `w8-bake`'s `perf-rig/probe-server.mjs --port 4259`, started in the window after :4259 was
released. The w8-bake lane restarted its own server within seconds (now pid 89377, serving that
lane's `dist-base`); :4259 answers 200 and this verifier's own restart attempt lost the race and
exited on `EADDRINUSE`. No file of that lane was touched. Two rules for the fold: the port
allocation in the slice brief (4259/4258/4257 to the exec lane) is **stale** — w8-bake is using
4259 — and "kill every server you started" must be executed by PID recorded at start, never by
port at the end.
