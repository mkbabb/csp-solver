# T9-W7 execution · G17 — the copy gate discovers its subjects

> **REPAIR r2 (§10) IS THE CURRENT RECORD.** Commit `8d334845`. A second non-author verify ruled
> REPAIR again on two MUSTs — the estate's UTTERANCES (`say`/`announce`) were outside the census,
> and a `COPY_KEY` whose value is a call was blind while its sibling key on the same object red —
> plus two NOTEs. All four are cured. Where §9 and §10 disagree, **§10 is the record**: 40 → 52
> self-test colours, 51 → 63 spoken subjects (29 holding a literal, across 21 files) plus 6 voices
> across 3 files, and §9.8's gaps list, which named neither MUST.
>
> **REPAIR r1 (§9) SUPERSEDES PARTS OF THE ORIGINAL RECORD.** A non-author verifier ruled REPAIR and
> planted five sentences this gate still missed; all five now RED. Where §4–§6 and §7.3 disagree
> with §9, **§9 is the record**: the reach numbers (33/16 → 51 matches, 30 → 51 distinct sources,
> 28 holding a literal, across 17 files), the self-test count (28 → 40 colours), and gap 3, which
> asserted that no un-read function site exists in `src/`. That assertion was FALSE and is struck
> — §9.1 names the sites and the clause that now reads them.

Commit `7686f904` on `w7/exec`, one file: `web/frontend/scripts/check-copy-register.mjs`
(+263/−13). Parents in this slice: `e4c45f53` (slice 1 HEAD) → `a649cf5e` → `e1f2304b` (3C-4b)
→ `06fee424` (B1b) → **`7686f904`** (this cure).

**No product string moves.** The only file touched is a build script, which enters no bundle:
`dist` rebuilt after the diff is byte-identical to `dist-before` rebuilt before it, whole-tree
sha256 `6f49d60c230d7b81f227b4bcf81071a3d3c7a07aa295ed4527c61e1609db4c0a` on both sides
(`gates/dist-identity.txt`, `index-CubiZsMVSwTc.js`). π is measured anyway, below, and reads
0.00 px.

## 1. The seam, and what was blind

FOLD-MANIFEST G17 books two blind spots, from `exec/B1/README.md` §7:

- **gap 2** — `useGameCell.ts:158`'s spoken core is `` core = `solver's answer ${n}` `` inside
  `const ariaLabel = computed(…)`. Every screen reader that lands on a filled cell says it. It
  is not a template text node (it lives in script), not a rendered attribute (it is bound), not
  a `COPY_KEY` (it is assigned, not keyed), not a narration call (`computed` is not
  `useLiveRegion`), not a copy table. B1 found it by hand; a regression would have to be found
  by hand again.
- **gap 6** — `PAPER_NOTE_COPY` in `games/shared/solver/classifyError.ts` is keyed by the fault
  domain (`budget`/`network`/…), and the gate's script-side arm reads keys NAMED for copy
  (`COPY_KEYS`, the list at `:243` in the manifest's cite).

**Finding, stated first because it changes what this cure is.** Gap 6 was already cured on this
branch by **B1b (`06fee424`)**, one commit before this lane opened: it added `COPY_TABLE_NAME`,
the rule that a declaration whose own name says COPY makes its object literal's strings copy.
The born-RED below measures that plainly — the two copy-table controls read `FAILED` against the
`e4c45f53` scanner and `RED as required` against the `06fee424` scanner. What was still live at
this lane's start is gap 2, and one shape of it the manifest does not name: **a template literal
was read as one undifferentiated string wherever it was read at all**, so `${…}` — code — went
to the lexicon together with the copy.

## 2. The diff

Three widenings and one de-duplication, all inside the gate's existing shape (lexicon of 25
entries untouched, `ADMITTED` still empty, `--self-test` kept and grown from 24 colours to 28):

1. **`SPOKEN_SOURCE_NAME`** — a `const`/`let`/`var` whose identifier begins `aria` or ends
   `Label`/`Text`/`Caption`/`Heading`/`Sublabel`/`Placeholder`/`Title`/`Note`/`Line`/`Word`/
   `Name`/`Message`/`Sentence`/`Announce`/`Announcement` declares copy; every literal in its
   initializer is read as copy. Same rule shape as `COPY_TABLE_NAME` one seam over — the NAME is
   the evidence, so the gate discovers subjects instead of carrying a list of sites.
2. **`SPOKEN_SOURCE_PROP`** — the same name rule on an object property, because the estate writes
   most of its accessible names as one (`techniqueVoice.ts:190`,
   `` ariaLabel: `level ${filled} of ${TALLY_TOTAL}` ``, and the five games' `spec.ts`). The
   colon is GLUED to the name in the pattern, and that is load-bearing: a Vue bind writes its
   colon in front of the NEXT attribute (`<SheetWashiLabel :text="…">`), so a rule that admitted
   whitespace read the component's name as a key and the markup after it as copy — **six phantom
   subjects in `src/` before the glue** (`SheetWashiLabel :` ×6, `MarginNote :` ×1; see §5).
3. **`copyLiterals` → `staticParts`** — one helper all four literal-reading arms now share (copy
   tables, spoken sources, narration calls, `COPY_KEYS`). `'…'` and `"…"` are read whole; a
   template literal is read by its STATIC segments only, brace-depth and quote aware. Reading an
   interpolation as copy reds on identifiers (`${engine.id}`, `${state.unit}`), which is how a
   lexicon rots into an allowlist; what the expression resolves to is authored somewhere this
   scan already reads. `COPY_KEYS` also stopped being double-quote-only in the same change.
4. **`jargon()` de-duplicates** by `line|text|word`: `aria:` is both a `COPY_KEY` and a spoken
   name, and one sentence is one offence however many shapes it answers to.

`initializer(s, at, stops)` is the new walk: from a declaration's `=` or a property's `:` to a
depth-0 stop (`;`, and `,` as well for a property, so a spoken name cannot swallow its siblings),
or the closer of the block it sits in. Its known edge is stated in the source: a declaration
written without its semicolon runs on to the next one — prettier puts one on every statement
here, and the failure is a loud false RED, not a silent miss.

**Nothing was loosened.** No admission was added (`ADMITTED` is still empty, as B1b left it), no
lexicon entry was narrowed, no file joined `ALLOW`. The widened scan reds on nothing at
`06fee424`: `lint:copy` exits 0 with `1 hit`→`0 hits`, 0 admitted, 0 unadmitted.

## 3. Born-RED — the line pair

Four planted controls, each RED before the widening and GREEN after. Verbatim, the same control
names on both sides.

**RED at `e4c45f53`** (the slice's base scanner, `git show e4c45f53:…` with this commit's
controls spliced in and nothing else changed; `born-red/selftest-RED-at-e4c45f53.txt`, exit 2):

```
  jargon · a spoken core built as a template literal in an accessible-name source  →  0 offence(s), FAILED
  jargon · a copy table keyed by its domain, its sentence a template literal  →  0 offence(s), FAILED
  jargon · a copy table keyed by its domain, its sentence a plain string  →  0 offence(s), FAILED
  jargon · a spoken name written as an object property, not a declaration  →  0 offence(s), FAILED
```

**GREEN at `7686f904`** (`gates/selftest-green.txt`, exit 0):

```
  jargon · a spoken core built as a template literal in an accessible-name source  →  1 offence(s), RED as required
  jargon · a copy table keyed by its domain, its sentence a template literal  →  1 offence(s), RED as required
  jargon · a copy table keyed by its domain, its sentence a plain string  →  1 offence(s), RED as required
  jargon · a spoken name written as an object property, not a declaration  →  1 offence(s), RED as required
```

**The intermediate reading, which is the §1 finding** (`born-red/selftest-RED-at-06fee424-B1b.txt`,
exit 2 — the same controls against B1b's scanner):

```
  jargon · a spoken core built as a template literal in an accessible-name source  →  0 offence(s), FAILED
  jargon · a copy table keyed by its domain, its sentence a template literal  →  1 offence(s), RED as required
  jargon · a copy table keyed by its domain, its sentence a plain string  →  1 offence(s), RED as required
  jargon · a spoken name written as an object property, not a declaration  →  0 offence(s), FAILED
```

Conformant twins and the fence, all GREEN on every scanner (so they prove the widening, not the
run): `twin — the same spoken core in the player's words` (`revealed answer ${n}`) 0,
`twin — the same copy table in the player's words` 0, `positive control — an INTERPOLATION is
code, not copy` (`` const cellText = `${engine.unit} left` ``) 0, `positive control — a template
literal in a declaration that says nothing about copy` (`` const id = `naked-single-${n}` `` plus
a thrown `` `the worker died` ``) 0. The property control carries its own fence inside it: the
sibling `` id: `worker-${n}` `` after the comma must NOT be read, and the control's `want` is 1.

### 3b. Ablations — the arm reaches the REAL tree, not only its fixtures

A self-test proves the scanner; these prove it over `src/`. Each is a one-word edit to a live
spoken source, gate run bare, edit reverted, `git status src/` clean after (banked under
`born-red/`):

| ablation | planted | gate | line it named |
|---|---|---|---|
| `useGameCell.ts:158` — the B1 seam itself | `` core = `the solver's answer ${…}` `` | exit **1** | `src/games/shared/useGameCell.ts:158  [spoken source]  "solver"` |
| `GameBoard.vue:702` — a spoken deal line | `` `new board from the solver. ${…}` `` | exit **1** | `src/games/shared/GameBoard.vue:702  [spoken source]  "solver"` |
| `techniqueVoice.ts:190` — a property, not a declaration | `` ariaLabel: `solver level ${…}` `` | exit **1** | `src/games/shared/techniqueVoice.ts:190  [spoken source]  "solver"` |

## 4. The numbers

**Reach** (`gates/reach-census.txt`, the gate's own mask and walk): **33 spoken sources across 16
files — 15 declarations and 18 object properties — where the arm saw 0.** Among them the three
ablation seams, the five games' `spec.ts` `ariaLabel`s, `BoardHost.vue`'s `gridLabel` and
`difficultyWord`, `GameBoard.vue`'s `marginText`/`dealLine`/`errorNote`, `GameCard.vue`'s
`rangeLine`/`ariaLabel`, `GameGallery.vue`'s `guardTitle`, `StagingBand.vue`'s `safeLabel`.

**Runtime over the full tree** (137 files, 3 runs each, `gates/runtime-before.txt` /
`runtime-after.txt`): `real 0.10 / 0.10 / 0.09` before, `real 0.09 / 0.09 / 0.09` after. The
widening costs no measurable wall time.

**Corpus**: `copy register scanned across 137 files`, unchanged; `em/en dashes in product copy: 0`;
`jargon over RENDERED strings: 0 hit(s), 0 admitted, 0 unadmitted (lexicon: 25 entries)`.
Admission count **0, unchanged from B1b** (the brief's "unchanged or lower" — it cannot go lower).

**π — 0.00 px, measured, not only argued.** `probe/rect-census.mjs` (pinned `?board=` permalink,
`reducedMotion: reduce`, 2.5 s settle, chromium) against the pre-diff build served read-only on
:4258 and the post-diff build on :4259 (`census/diff.txt`):

| surface | rects before / after | max \|Δ\| |
|---|---|---|
| board 1280×800 | 1089 / 1089 | 0.00 px |
| board 390×844 | 1049 / 1049 | 0.00 px |
| gallery 1280×800 | 1807 / 1807 | 0.00 px |
| gallery 390×844 | 1767 / 1767 | 0.00 px |
| **total** | **5,712 / 5,712** | **0.00 px** |

Identical key sets, no ONLY-A / ONLY-B. Surfaces moved: **none**. This is expected by
construction — the two dists are the same bytes — and the census is the belt to that braces.

**DELTA frames: none, because nothing visual is claimed.** No product string, template, style or
bundled module is in the diff. `frames/` is empty by intent, not by omission.

## 5. What the widening found on the real tree

Nothing that reds. The brief's contingency ("if the widened scan reds on a real string at
e4c45f53+B1b, that is a finding for the fold") did not fire: `lint:copy` exits 0 at
`06fee424` + this diff, with 0 hits.

It did find one thing worth the fold's attention, which is a GATE defect rather than a copy one:
the first cut of `SPOKEN_SOURCE_PROP` allowed whitespace before the colon and so matched seven
Vue component tags (`SheetWashiLabel :` at `GameBoard.vue:1095`, `GameControlPanel.vue:1013`,
`:1049`, `:1053`, `:769`, `:953`, `StagingBand.vue:130`; `MarginNote :` at `GameBoard.vue:1161`),
each of which handed the lexicon a stretch of template markup and bound expression names. It
reddened nothing then either — which is exactly why it is worth recording: a gate can be wrong in
the false-positive direction and still look green. The glued colon is the cure and §2's note in
the source is its reason.

## 6. Gates — every one run bare in the worktree, exit code read per gate

| gate | exit | reading |
|---|---|---|
| `--self-test` RED at `e4c45f53` (spliced controls) | **2** (designed) | 4 planted controls `0 offence(s), FAILED` |
| `--self-test` RED at `06fee424` (spliced controls) | **2** (designed) | 2 of 4 still `FAILED` (the §1 finding) |
| `node scripts/check-copy-register.mjs --self-test` | 0 | **28 colours, all "as required"**; 5 dash + 22 jargon + the synthetic stale admission |
| ablation ×3 on `src/` (see §3b) | **1** ×3 (designed) | the gate names line 158 / 702 / 190 |
| `npm run lint:copy` | 0 | 137 files, 0 dashes, 0 hits, 0 admitted, 0 unadmitted |
| `npm run lint` (prettier) | 0 | `src/ scripts/ ../../scripts/ ../relay/`; `e2e/` never prettier'd |
| `npm run lint:eslint` | 0 | clean |
| `npx vue-tsc --noEmit` | 0 | clean |
| `npm run typecheck:e2e` | 0 | clean |
| `npm run typecheck:node` | 0 | clean |
| `npx vitest run` | 0 | **Test Files 68 passed (68)**, Tests 830 passed (830) |
| `npm run lint:live-regions` | 0 | 0 regions born speaking |
| `npm run lint:motion` | 0 | every spec declares its motion state |
| `npm run test:font-coverage` | 0 | no new glyph — no rendered string moved |
| `npm run lint:boundary` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | 0 ×4 | clean |
| `npx vite build --config .vite-exec.config.ts` | 0 | `index-CubiZsMVSwTc.js`; tree sha256 identical to `dist-before` |
| goldens vs cured dist :4259 | 0 | **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| π rect census + diff | 0 | 0.00 px over 5,712 rects |

**NOT RUN, named as such:**

- `npm run test:e2e` (full battery), `e2e/visual-regression.spec.ts`, and **every browser arm in
  either engine beyond the goldens**. The brief names no browser arm for this cure and none is
  owed by its claim: the diff is a build script, no bundled byte moves, and the dist is proved
  identical. WebKit was not launched at all. This is a fence, not an omission — but it is stated
  rather than implied.
- `npm run lint:knip` · `lint:relay` · `lint:catch` · `lint:theme-tokens` · `lint:tdz` ·
  `lint:sleep` · `test:support-floor` · `test:coverage:floor` · `npm audit` — not run by this
  lane; they belong to the fold's battery (FOLD-MANIFEST §4.4).
- No real device, no Safari, no simulator (M19).

## 7. Gaps

1. **The name rule is a heuristic, and says so.** A copy source named for neither its office nor
   its shape (`blurb`, `banner`, `greeting`) is still invisible. The rule catches the class that
   has now shipped twice; it will not catch a fresh naming. Same standing as the lexicon's own
   "curated, not clever" clause.
2. **`Record<…, string>` whose declared TYPE says copy** — B1b's own control pins this blind spot
   (`a copy table whose type says copy and whose NAME does not — the arm is blind`, want 0). It
   needs a type reader and stays booked to W5's gate estate. Unchanged by this cure.
3. ~~**`function ariaLabel() {…}` and class members are not read** — only `const`/`let`/`var`
   declarations and object properties. `src/` has no such site today (the reach census is the
   evidence); the day one lands, the pattern earns a third clause.~~ **STRUCK at repair r1, and
   its second sentence was false twice over.** Four such sites exist and two of them are the
   estate's live margin copy (`techniqueVoice.ts:43` `formatHintNote`, `:81`
   `formatConflictNote`); and the census could not have been the evidence in any case, since it
   enumerates what the name rule already finds and so can never show that an unfound site does
   not exist. Only a plant can. See §9.1 and §9.2.
4. **`initializer()` trusts the semicolon.** A declaration written without one runs to the next
   depth-0 `;`. Prettier puts one on every statement in this estate (`npm run lint` is the
   enforcement) and the failure mode is a false RED, not a miss — but it is a coupling between
   two gates.
5. **`copyLiterals`' literal regex cannot survive a backtick nested inside an interpolation**
   (`` `a ${x ? `b` : ""} c` ``). No such literal exists in `src/`; the shape would end the
   literal early and read the tail as source, again in the loud direction.
6. **The spoken arm is a REGEX over masked source, not a parser.** Everything above is a
   consequence of that choice, which is the gate's design as it stands (cf. the header's
   "what it does not see" clause). A parser-backed arm is a W5 gate-estate question.
7. **No unit row pins this scanner.** `--self-test` is the gate's own colour ledger and no
   `.test.ts` covers `check-copy-register.mjs`; that matches every sibling script in `scripts/`.
8. **This cure closes G17's live half only.** Gap 6 was closed by B1b `06fee424`; the manifest's
   G17 row should be re-read as "gap 2 + the template-literal grammar", with gap 6 already
   struck. The chair owns that edit — no LEDGER/DISPOSITIONS/wave file was touched here.
9. **G15/G16 are not re-opened.** `classifyError.ts` and the pencils caption were recut at B1b;
   this cure only makes a regression in either of them RED at the gate rather than at a reader.

## 8. Files

- Code: `.claude/worktrees/w7-exec/web/frontend/scripts/check-copy-register.mjs` (commit
  `7686f904`, +263/−13, path-scoped, not pushed).
- Evidence (this directory, **212 KB whole**): `README.md`, `born-red/` (4 files), `gates/` (21
  files), `census/diff.txt` + `census/rects.tar.gz` (the 8 raw rect JSONs, 81,008 B packed from
  1.1 MB — R0 has `evidence/w7` over the wave cap and a tautological census should not cost the
  sweep a megabyte). No `frames/`: nothing visual is claimed.
- Servers: `vite preview` on 127.0.0.1:4258 (dist-before) and :4259 (dist), both
  `--strictPort`, both killed; 4257/4258/4259 verified free at return. Private vite cache via
  `.vite-exec.config.ts` (untracked, never committed). The main tree's `src/`/`dist/` were never
  read-modified, built or served.

## 9. Repair r1 — five plants, five misses, and the census that could never have proved otherwise

Commit `4235e382` on `w7/exec`, one file again:
`web/frontend/scripts/check-copy-register.mjs` (+305/−43, 876 → 1,138 lines — r1 wrote 1,139
here and `wc -l` reads 1,138, which is what +305/−43 gives; corrected in place, verify-r2 NOTE 4).
Evidence:
`repair-r1/`.

The verifier's method is the finding. It did not argue with the rule — it wrote `solver` into
five live sources in five shapes and ran the gate bare. All five shipped past r0 green. Every one
of them is copy a player reads or a screen reader says, and two of them are the margin note this
product has been printing since T4. The rule was right; its GRAMMAR was short in four places, and
the r0 record papered over one of them with a sentence that could not have been true.

### 9.1 MUST 1 — the false sentence, struck; the third clause, earned

r0's gap 3 said `function ariaLabel() {…}` is not read and "no such site exists in `src/` today
(the reach census is the evidence)". Both halves are wrong. The sites:

| site | what it is |
| --- | --- |
| `techniqueVoice.ts:43` `formatHintNote(…): string` | the margin note, called at `GameBoard.vue:724` → `setMargin` |
| `techniqueVoice.ts:81` `formatConflictNote(…): string` | the failed-solve verdict, called at `GameBoard.vue:774` |
| `GameGallery.vue:408` `stagedLine(card): string` | the deck's live-region announcement |
| `GameControlPanel.vue:194` `valueLabel(section): string` | the mobile tab's visible value |

And the citation was circular besides: a reach census enumerates what the name rule already
finds, so it cannot show that an unfound site does not exist. **Only a plant can**, which is why
repair r1's evidence is five plants and the census is now reported as reach and nothing more
(the header and `spokenSubjects`' doc comment both say so in the source).

The clause is earned rather than deleted: `SPOKEN_SOURCE_FN` reads a `function` whose NAME says
copy **and** whose declared return type contains `string`, its body walked brace-balanced. The
return type is the second half of the rule and it is load-bearing — `onMessage(…): void`
(`useSession.ts:736`, a 70-line relay handler) and `applyTitle(g: GameId)` (`App.vue:145`) carry
the same names and hold no copy at all. Both colours are planted: the `: string` function reds
(want 1), the `: void` handler with `the worker died` in it does not (want 0).

### 9.2 MUST 2 — SCREAMING_SNAKE, and B1b's mislabelled control

The suffix list was TitleCase-only and this estate writes its copy tables in caps, so
`techniqueVoice.ts:75` `FURNITURE_NOTE` (`check the cage` / `check the greater than signs` /
`check the thermometer`) and `:33` `HOUSE_WORD` (the words `formatHintNote` interpolates) were
blind. `SPOKEN_NAME` gains the snake spelling of every suffix plus `ARIA_…`.

**Not case-folded**, deliberately: a capital is this rule's word boundary. Fold the case and
`baseline` becomes a `Line`, `context` a `Text`, `pathname` a `Name` — the lexicon would be
sweeping over style objects and DOM plumbing. The snake branch requires whole SCREAMING segments
(`(?:[A-Z0-9$]+_)*(?:NOTE|WORD|LABEL|…)`), which is the same word boundary written the other way.

B1b's control named "a copy table keyed by its fault domain, **named for its office**" tested no
such thing — its fixture is `PAPER_NOTE_COPY`, whose name contains COPY, so it exercised
`COPY_TABLE_NAME`. Renamed to **"a copy table whose name carries the word COPY"**, and the
office-suffix rule gets its own control beside it (`FURNITURE_NOTE`, want 1) with its
player's-words twin (want 0). §7.2's cite should be read against the new name.

### 9.3 MUST 3 — the bound spoken attribute

Three live sites, each of which took a planted `solver` past r0 green:
`StagingBand.vue:200` (`` :aria-label="`deal a new ${name} board`" ``), `HandwrittenLogo.vue:412`
(a ternary over a template literal), `DarkModeToggle.vue:7` (a ternary over two quoted strings).

G17 itself dissolved the rationale that excluded them — "a BOUND value is an expression, not a
string" stopped being a reason the moment `staticParts` separated static text from code. The cure
is the bound twin of the rendered-attribute arm: `:attr="…"` / `v-bind:attr="…"` read through
`copyLiterals`, so its literals are copy and its identifiers are not. `:aria-label="solverLabel"`
still reads nothing, and its want-0 control still stands — the variable's NAME was never copy.

### 9.4 NOTEs — assignment, counting, de-duplication

- **The write, not only the declaration.** `useGameState.ts` writes its sentences at `:623`,
  `:700` and `:823` (`errorMessage.value = … : "Solve failed"`), long after `const errorMessage`
  at `:247`. `SPOKEN_SOURCE_NAME` now makes `const|let|var` optional and allows `.value`, with
  `(?![=>])` keeping `==`/`===`/`=>` out (its own want-0 control is a comparison).
- **Three numbers, not one.** `--reach` (new flag) prints matches, distinct sources and
  copy-bearing sources: **51 / 51 / 28 across 17 files**. r0's headline "33 spoken sources across
  16 files" counted matches, and two of those 33 were artefacts — `GameBoard.vue:810` appeared
  twice (its declaration and the colon of its own type annotation) and `useGameCell.ts:67`
  `ariaSuffix:` is an interface member's type position. The first is cured at the source (a
  property preceded by `const|let|var` is skipped as the declaration's own annotation); the
  second is stated in the source and shows as `0 literal(s)` in the census.
- **The de-duplication key is the byte offset.** `line|text|word` collapsed two genuinely
  distinct offences that were byte-identical on one line; `{ ariaLabel: "the solver", ariaText:
  "the solver" }` reported 1 where there are 2. Every arm now records its literal's own offset
  (the `COPY_KEYS` arm too, which used to record the key's), so one string reached by two routes
  keys the same and two strings key differently. Its own control, want 2.

### 9.5 Two false-SUBJECT classes found while curing, each fenced

Both were found by reading the census rather than the reds — a gate can be wrong in the
false-positive direction and still look green, which is r0's own in-lane finding, twice more.

1. **The Vue tag, again.** With the keyword optional, `${SPOKEN_NAME}\s*(?::[^=;]*)?=` read
   `<SheetWashiLabel :id="…"` as a `SheetWashiLabel` annotated `:id`, and walked its
   "initializer" through the markup to the next `;` — `StagingBand.vue:130`–`200` swallowed
   whole, which is how the P3 plant was reported twice. The colon is GLUED to the name now,
   exactly as `SPOKEN_SOURCE_PROP` already glues it. Control: a component tag with a bind above a
   script-block `const tid = "naked-single"`, want 0.
2. **The type alias.** `type ThermoLine = number[]` matches the write shape exactly, and a
   string-literal union inside a type is an identifier set — the very thing T8-W6 kept. Skipped
   when preceded by `type|interface|enum`. Control: `type CellLabel = "naked-single" | …`, want 0.

### 9.6 Born-RED — the line pair

The five plants, run bare against the r0 scanner (`git show 7686f904:…` copied beside the real
one so `ROOT` resolves), then against the cured one. `src/` restored after every plant.

```
BLIND at 7686f904 (repair-r1/born-red/plants-BLIND-at-7686f904.txt), exit 0 x5:
  P1 FURNITURE_NOTE value              0 hit(s)   EXIT=0
  P2 formatHintNote's return           0 hit(s)   EXIT=0
  P3 StagingBand :aria-label literal   0 hit(s)   EXIT=0
  P4 errorMessage.value assignment     0 hit(s)   EXIT=0
  P5 DarkModeToggle :aria-label        0 hit(s)   EXIT=0

RED at repair r1 (repair-r1/gates/plants-RED-at-repair.txt), exit 1 x5:
  P1  techniqueVoice.ts:76   [spoken source]  "solver"  check the solver's cage
  P2  techniqueVoice.ts:50   [spoken source]  "unit"    fits in this unit
  P3  StagingBand.vue:200    [:aria-label]    "solver"  board from the solver
  P4  useGameState.ts:700    [spoken source]  "solver"  the solver failed
  P5  DarkModeToggle.vue:7   [:aria-label]    "solver"  Switch to the solver
```

And the self-test's own pair — repair r1's controls spliced verbatim into the r0 scanner
(`repair-r1/born-red/selftest-RED-at-7686f904.txt`, exit 2):

```
  a copy table named in SCREAMING_SNAKE for its office            →  0 offence(s), FAILED
  a function that RETURNS the sentence, name and type both copy   →  0 offence(s), FAILED
  a spoken ref written by ASSIGNMENT                              →  0 offence(s), FAILED
  a BOUND accessible name built as a template literal             →  0 offence(s), FAILED
  a BOUND accessible name built as a ternary over two strings     →  0 offence(s), FAILED
  two byte-identical sentences on one line are TWO offences       →  1 offence(s), FAILED
```

All six read `RED as required` at repair r1, and the four fences beside them (the two
false-subject controls, the bound-variable control, the two player's-words twins) read
`GREEN as required` on BOTH scanners — a fence proves nothing if it only works after the cure.
Self-test: **28 → 40 colours**, exit 0 (`repair-r1/gates/selftest-green-and-reach.txt`).

### 9.7 Gates — every one run bare in the worktree

| gate | result |
| --- | --- |
| plants ×5 at `7686f904` | **exit 0 ×5 — DESIGNED BLIND**, 0 hit(s) each; `src/` clean after |
| plants ×5 at repair r1 | **exit 1 ×5 — DESIGNED RED**, each naming its own line; `src/` clean |
| `--self-test` with r0's scanner + r1's controls | **exit 2 — DESIGNED RED**, 6 colours FAILED |
| `node scripts/check-copy-register.mjs --self-test` | exit 0 — 40 colours all "as required" |
| `--reach` | 51 match(es), 51 distinct source(s), 28 holding a literal, 17 files |
| `npm run lint:copy` | exit 0 — 137 files, 0 dashes, 0 hit(s), 0 admitted, 0 unadmitted, 25 lexicon entries |
| `npm run lint` (prettier) | exit 0 — one `--write` on the edited script; `e2e/` never prettier'd |
| `npm run lint:eslint` | exit 0 |
| `npx vue-tsc --noEmit` | exit 0 |
| `npm run typecheck:e2e` · `typecheck:node` | exit 0 ×2 |
| `npx vitest run` | exit 0 — **Test Files 68 passed (68)**, Tests 830 passed (830) |
| `npm run lint:live-regions` | exit 0 |
| `npm run lint:motion` | exit 0 |
| `npm run test:font-coverage` | exit 0 — no rendered string moved, so no new glyph |
| `lint:boundary` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | exit 0 ×4 |
| `npx vite build --config .vite-exec.config.ts` | exit 0 — `index-CubiZsMVSwTc.js`, unchanged |
| dist identity | `diff -r dist-before dist` **exit 0, byte-for-byte**; tree sha256 `2169e6a7…` both sides |
| goldens, own port 4259 | exit 0 — **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| π rect census (chromium, :4258 `dist-before` vs :4259 cured dist) | **0.00 px over 5,712 rects**, key sets identical |
| gate wall time, 3 runs each over 137 files | r0 0.14/0.15/0.14 s · r1 0.17/0.14/0.16 s — no measurable cost |
| `npm run test:e2e` (full battery), `visual-regression.spec.ts`, any WebKit arm | **NOT RUN** — no browser arm is owed; the dist is byte-identical. WebKit was never launched |
| `lint:knip` · `lint:relay` · `lint:catch` · `lint:theme-tokens` · `lint:tdz` · `lint:sleep` · `test:support-floor` · `test:coverage:floor` · `npm audit` | **NOT RUN** — the fold's battery (FOLD-MANIFEST §4.4) |
| real device · Safari · simulator | **NOT RUN** — M19 |

`dist-before/` is the control r0 left in the worktree and this repair did NOT rebuild it, which
makes the chain the stronger claim: `dist-before` == r0's `dist` == repair r1's `dist`, byte for
byte, so nothing either commit did reaches the bundle. The dist tree sha256 reads `2169e6a7…`
where §0 recorded `6f49d60c…`: different hashing recipe, same bytes. `diff -r` is the stronger claim and it is the one made here — the two trees are
identical file for file, recursively, and the chunk name is the same on both sides.

π: **0.00 px**, and byte-identity underneath it. board-1280×800 1089/1089 · board-390×844
1049/1049 · gallery-1280×800 1807/1807 · gallery-390×844 1767/1767, no ONLY-A / ONLY-B keys, worst
0.00 px (`repair-r1/gates/census-diff.txt`). Surfaces moved: NONE. **Δ: none, and none claimed** —
no `frames/` in `repair-r1/`, empty by intent. WebKit π was not measured (the probe launches
chromium only, the estate's standing G18) and is not owed: the two dists are the same bytes.

### 9.8 Gaps that survive repair r1

1. **The name rule is still a heuristic** (r0 gap 1, unchanged): `blurb`, `banner`, `greeting`
   name neither an office nor a shape and stay invisible. Curated, not clever.
2. **An un-annotated copy function is blind.** `SPOKEN_SOURCE_FN` requires a declared return type
   containing `string`. Every copy function in `src/` declares one today; the day one does not,
   the miss is silent. The alternative — reading every `function` whose name matches — puts a
   relay message handler's protocol literals in a copy census, which is the false-subject class
   §9.5 spent two cures on. Priced and chosen, not overlooked.
3. **A CLASS MEMBER (`get ariaLabel(): string`) is still not read**, and this time with no claim
   about `src/` attached: `grep -n "get [a-z]*\(Label\|Note\|Text\)" src/` is empty at this
   commit, and that is a grep, not a proof.
4. **An assignment through an alias or a member is blind** — `this.ariaLabel = …`,
   `state.ariaLabel = …`. The lookbehind refuses a `.`-prefixed name on purpose (it is what keeps
   `document.title = g` out); the shapes above are the price.
5. **A single-quoted bound attribute** (`:aria-label='…'`) is outside the bound arm's grammar.
   Vue and prettier write double quotes and `src/` has none; stated rather than implied.
6. **r0 gaps 2, 4, 5, 6, 7 stand unchanged**: the `Record<…, string>` type reader (booked to W5),
   `initializer()`'s trust in the semicolon, the nested-backtick literal, "regex over masked
   source, not a parser", and the absence of a unit row over this scanner (`--self-test` is its
   whole ledger, as for every sibling script in `scripts/`).
7. **The census is reach, not proof** — now said in the source as well as here. What proves a
   shape is a plant in a live file with the gate run bare.
8. **The chair's edit still stands open** (r0 gap 8): G17's manifest row should be re-read as
   "gap 2 + the literal grammar", gap 6 having been struck by B1b `06fee424`. No
   LEDGER/DISPOSITIONS/wave file was touched by this lane either.

### 9.9 Files and hygiene

- Code: `.claude/worktrees/w7-exec/web/frontend/scripts/check-copy-register.mjs`, +305/−43,
  path-scoped, one new commit on `w7/exec` (history not rewritten), not pushed.
- Evidence: `repair-r1/` (116 KB) — `born-red/` 2 files, `gates/` 21 files, one per gate, each
  ending in its exit line.
- Servers: `vite preview` on 127.0.0.1:4259 (cured dist) and `http-server` on 127.0.0.1:4258
  (`dist-before`), both killed; 4257/4258/4259 verified free at
  return (`lsof` count 0 each). `.vite-exec.config.ts` untracked and never committed. The main
  tree's `src/`/`dist/` were never edited, built or served. `git status --porcelain` in the
  worktree: the edited script and `.vite-exec.config.ts`, nothing else — no `ZZ*` residue, and
  the temporary r0 scanner copy was deleted after each use.

## 10. Repair r2 — the half of the idiom this gate had never read

Commit `8d334845` on `w7/exec`, one file again:
`web/frontend/scripts/check-copy-register.mjs` (+292/−8, 1,138 → 1,422 lines). Evidence:
`repair-r2/`. Parents: `7686f904` (r0) → `4235e382` (r1) → **`8d334845`**.

The same verifier, the same method, and the finding is again a GRAMMAR that was short where the
RULE was already right. Two MUSTs, both of them live product copy, both of them blind at r0 AND
at r1 — an unclosed class, not a regression.

### 10.1 MUST 1 — the utterance half of the live-region idiom

`useLiveRegion` documents two entry points one line apart (`useLiveRegion.ts:31–32`) and this arm
read one of them. `NARRATION_CALLS` reads the ARGUMENT (`useLiveRegion(() => …)`); the estate
does almost all of its speaking through the other one, the `say` the composable hands BACK:

| site | the sentence |
| --- | --- |
| `GameControlPanel.vue:320` | `say(copied ? "Link copied" : "couldn't copy. the link is in the address bar")` |
| `GameBoard.vue:883` | `` announce(`${fill.count} ${…} filled`) `` |
| `GameGallery.vue:815` | `` sayGuard(`Choose keep, or ${guardVerb.value}.`) `` |

The gate's own header has claimed this class in the first person since T9-W3's fold — "every
string literal in its ARGUMENTS", "spoken copy is copy, an ear is a reader" — and read half of it.

**The voice is DISCOVERED, never listed** (`UTTERANCE_RETURNS` + `utterers()`), because a list of
local names is the enumeration this gate exists to refuse. Three clauses, run to a fixed point:

- **SEED** — the destructuring at the call binds it: `const { text: boardVoice, say: sayBoard } =
  useLiveRegion()` says this file's voice is `sayBoard`. The shorthand `const { say } = …` binds
  `say`.
- **FORWARD** — a `function` that hands one of its OWN PARAMETERS to a voice is a voice.
  `announce` (`GameBoard.vue:689`) is the board's whole spoken channel and nothing in its name
  says copy, so this is the clause the verifier priced and it is earned rather than enumerated.
- **PASS** — a parameter that RECEIVES a voice at a call site is a voice inside its function.
  `copyAct(() => props.share(), {…}, sayCopy)` is the only route to `GameControlPanel.vue:320`.
  Positional, so it requires the argument and parameter lists to agree in length: a disagreement
  means the split was wrong, and a wrong split would bind the wrong name.

`--reach` now prints the census the rule reaches: **6 voices across 3 files** — `sayBoard,
announce` · `sayCopy, say` · `sayDeck, sayGuard`. Reach, not proof; the plants are the proof.

### 10.2 MUST 2 — a copy key whose value is a call

`COPY_KEYS` required a quote immediately after the colon, so one object literal
(`GameControlPanel.vue:355–364`) was read on one of its three sentences and blind on the two
beside it: `aria: saysCoarse("Link copied", …)` red (by the spoken-name arm, not by this one),
while `sublabel: saysCoarse(…)` and `washi: says(…)` reddened nothing. Both keys were already
declared subjects — they sit in `COPY_KEYS` **and** in `RENDERED_ATTRS` — so only the grammar was
short. The quote lookahead is gone and the arm reads the property's INITIALIZER the way
`SPOKEN_SOURCE_PROP` already did: `initializer(s, at, ",;")` + `copyLiterals`, quote- and
depth-aware, so a call is walked to its depth-0 comma, its literals are copy and its identifiers
are not. Three colours: the call value reds, its twin in the player's words does not, and a key
whose value is a bare identifier (`sublabel: idle.sublabel`) reads 0.

### 10.3 NOTEs

- **The plural.** `-s`/`-S` joins the suffix alternation, so `FURNITURE_NOTES` and `errorNotes`
  are copy tables for the same reason `FURNITURE_NOTE` is. The optional `s` is the suffix's last
  character, so the capital that fences this rule (`Baseline` is not a `Line`) is untouched.
  **The rename is the finding**: B1b's type-gap control was written `const NOTES: Record<string,
  Copy>` and the plural rule now reads that NAME, so the control was measuring the name rule's
  reach rather than the type gap it is named for. Its fixture is `ROWS` now — a name that says
  nothing at all — and the gap it states is unchanged.
- **The line count.** r1 said 876 → 1,139; `wc -l` reads 1,138, which is what +305/−43 gives.
  Corrected at §9's head, in place, with the reason.

### 10.4 Born-RED — the line pair

**SIX PLANTS ON THE REAL TREE** (`repair-r2/born-red/plants-r1-BLIND-r2-RED.txt`, written by
`born-red/plants.sh`): the verifier's own V1–V4/V6/V7, replanted, each run BARE against the r1
scanner (`git show 4235e382:…` copied beside the real one so `ROOT` resolves) and against the
cured one in the same breath, each reverted with `git status src/` clean after it.

| plant | shape | r1 `4235e382` | r2 `8d334845` |
| --- | --- | --- | --- |
| V1 `GameBoard.vue:883` | `announce()` utterance through the wrapper | EXIT=0, 0 hit(s) | EXIT=1 — `[announce()] "solver"` |
| V2 `GameControlPanel.vue:320` | `say()` through the voice passed to `copyAct` | EXIT=0, 0 hit(s) | EXIT=1 — `[say()] "solver"` |
| V3 `GameControlPanel.vue:363` | `sublabel:` whose value is a call | EXIT=0, 0 hit(s) | EXIT=1 — `[sublabel:] "solver"` |
| V4 `GameControlPanel.vue:364` | `washi:` whose value is a call | EXIT=0, 0 hit(s) | EXIT=1 — `[washi:] "solver"` |
| V6 `techniqueVoice.ts:76` | plural SCREAMING_SNAKE copy table | EXIT=0, 0 hit(s) | EXIT=1 — `[spoken source] "solver"` |
| V7 `techniqueVoice.ts:75` | plural TitleCase copy table | EXIT=0, 0 hit(s) | EXIT=1 — `[spoken source] "solver"` |

**THE LIVE POSITIVE CONTROL rides in the same transcript**: with no plant, both scanners read 0
while `GameBoard.vue:862` hands the voice an IDENTIFIER (`announce(dealLine.value)`) — a voice
reads literals, never names.

**THE SELF-TEST'S OWN PAIR** — repair r2's twelve controls spliced verbatim into the r1 scanner
(`repair-r2/born-red/selftest-RED-at-4235e382.txt`, exit 2): six read `0 offence(s), FAILED` (the
utterance, its wrapper, the passed voice, the called copy key, and both plurals), and the six
twins and fences beside them read GREEN on BOTH scanners — which is what makes them fences and
not artefacts of the run. Self-test **40 → 52 colours**, all "as required" at `8d334845`.

### 10.5 Gates — every one run bare in the worktree

| gate | result |
| --- | --- |
| six plants on `src/` at `4235e382` (r1 scanner) | exit 0 ×6 — DESIGNED BLIND, 0 hit(s) each, `src/` clean after every one |
| six plants on `src/` at `8d334845` | exit 1 ×6 — DESIGNED RED, each naming its own file:line and kind |
| `--self-test` at `4235e382` with r2's controls spliced | exit 2 — DESIGNED RED, 6 colours `0 offence(s), FAILED` |
| `node scripts/check-copy-register.mjs --self-test` | exit 0 — **52 colours** all "as required" (was 40) |
| `--reach` | exit 0 — **63 match(es), 63 distinct source(s), 29 holding a literal, 21 files**; **6 voice(s) across 3 files** |
| `npm run lint:copy` | exit 0 — 137 files, 0 dashes, **0 hit(s), 0 admitted, 0 unadmitted**, lexicon **25** |
| `npm run lint` (prettier) | exit 0 — one `--write` on the edited script; `e2e/` never prettier'd |
| `npm run lint:eslint` | exit 0 (two errors found and fixed mid-lane: a sparse array, an unused capture) |
| `npx vue-tsc --noEmit` · `typecheck:e2e` · `typecheck:node` | exit 0 ×3 |
| `npx vitest run` | exit 0 — **Test Files 68 passed (68), Tests 830 passed (830)** |
| `lint:live-regions` · `lint:motion` · `lint:boundary` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | exit 0 ×6 |
| `npm run test:font-coverage` | exit 0 — no rendered string moved, so no new glyph |
| `npx vite build --config .vite-exec.config.ts` | exit 0 — `index-CubiZsMVSwTc.js`, the same chunk r0 and r1 recorded |
| dist identity: `diff -r dist-before dist` | exit 0 — byte-for-byte, recursively; path-relative tree sha256 `1c3475a3…` on both sides |
| goldens (`playwright-golden.config.ts`, base `http://127.0.0.1:4259`) | exit 0 — **4 passed**, nothing re-baselined, `--update-snapshots` never passed |
| π rect census (chromium, :4258 `dist-before` vs :4259 cured dist) | exit 0 — **0.00 px** over 5,712 rects, identical key sets, no ONLY-A/ONLY-B |
| gate wall time, 3 runs each over 137 files | r1 0.11/0.10/0.10 s · r2 0.10/0.10/0.11 s — no measurable cost |
| `npm run test:e2e` (full battery) / `visual-regression.spec.ts` / any WebKit arm | **NOT RUN** — build script only, dist proved byte-identical; WebKit never launched |
| `lint:knip` / `lint:relay` / `lint:catch` / `lint:theme-tokens` / `lint:tdz` / `lint:sleep` / `test:support-floor` / `test:coverage:floor` / `npm audit` | **NOT RUN** — the fold's battery (FOLD-MANIFEST §4.4), not this lane's |
| real device / Safari / simulator | **NOT RUN** — M19; no `osascript`, no `open -a`, no `run-safari.sh` |

**Nothing loosened**: no `JARGON`/`ADMITTED`/`ALLOW` hunk in the diff, lexicon 25 → 25, `ADMITTED`
empty, `ALLOW` 2 files. **No product string moved**: `git show --stat 8d334845` is one file.

### 10.6 Gaps that survive repair r2

1. **FORWARD reads a `function` declaration only.** A wrapper written `const announce = (line) =>
   sayBoard(line)` is blind. None exists in `src/` — and that is a grep, not a proof; the plant is
   the proof and this shape has none.
2. **The voice's scope is the FILE.** A local name that shadows a voice is read as one. The
   failure is a false RED a reviewer sees, never a silent miss — the direction this gate has
   chosen at every seam.
3. **PASS is positional and refuses a length disagreement.** A call with an optional argument
   omitted, or a parameter list whose generic carries a depth-0 comma (`Record<a, b>`), binds
   nothing. Stated because it is silent: the fence keeps a WRONG binding out, at the price of a
   missed one.
4. **A voice handed across a MODULE boundary is blind** — `export const say = …` imported
   elsewhere. Every live region in this estate is declared and spoken in one file.
5. **The COPY_KEY arm now trusts `initializer()`'s stops**, which inherits r0 gap 4 (a declaration
   without its semicolon runs on). Prettier writes one on every statement here.
6. **§9.8's gaps 1–8 stand unchanged** — the name heuristic, the un-annotated copy function, the
   class member, the aliased assignment, the single-quoted bound attribute, the `Record<…, string>`
   type reader (booked to W5), the nested-backtick literal, regex-not-parser, and the absence of a
   unit row over this scanner. Gap 3's grep was re-run at this commit and is still empty.
7. **The chair's edit still stands open** (r0 gap 8): G17's FOLD-MANIFEST row should be re-read as
   "gap 2 + the literal grammar", gap 6 having been struck by B1b `06fee424`. No
   LEDGER/DISPOSITIONS/wave file was touched by this lane.
8. **FOR THE FOLD, AS A CLASS.** Three verify rounds have each found a live copy shape this gate
   could not read, and each was found by a PLANT, never by a census. Two of r2's four were shapes
   the gate's own header already claimed in prose. The fold should ask every name-rule gate for
   the same two things: its subject listing (`--reach`), and a plant per shape the header claims.

### 10.7 Files and hygiene

- Code: `.claude/worktrees/w7-exec/web/frontend/scripts/check-copy-register.mjs`, +292/−8,
  path-scoped, one NEW commit on `w7/exec` (`8d334845`, history not rewritten), not pushed.
- Evidence: `repair-r2/` (112 KB) — `born-red/` 3 files (the two transcripts and `plants.sh`, the
  battery itself, kept so the chair can re-run it), `gates/` 20 files, one per gate, each ending
  in its exit line.
- Servers: `vite preview` on 127.0.0.1:4259 (cured dist) and 127.0.0.1:4258 (`dist-before`,
  read-only), both **killed**; 4257/4258/4259 verified free at return (`lsof` listener count 0
  each). `.vite-exec.config.ts` untracked and never committed; the temporary r1 scanner copy was
  deleted after each use. The MAIN tree's `src/`/`dist/` were never edited, built or served.
- Worktree `git status --porcelain` at return: `?? web/frontend/.vite-exec.config.ts`, nothing
  else.
