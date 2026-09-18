# T9-W7 · G17 repair r1 — non-author verification, round 2

Commit under test: **`4235e382`** on `w7/exec` (parent `7686f904` = G17 r0, grandparent `06fee424`
= B1b). One file in the diff: `web/frontend/scripts/check-copy-register.mjs`, +305/−43.

**VERDICT: REPAIR.** Every claim the author made reproduces — the five plants, the born-RED pair,
the self-test count, the reach numbers, the byte-identity, the goldens, the suite. Nothing was
loosened. What sends it back is not a broken claim but an incomplete one: **a literal that reaches
a reader as a CALL ARGUMENT is still outside this gate's census**, and four live product sentences
sit in that shape today. Two of them are spoken to a screen reader. A planted `solver` in each
ships past the cured gate green (`verify-r2/plants-at-4235e382.txt`, V1–V4), while the sentence
directly above them in the same object literal reds (V5). §9.8's gaps list does not name the shape.

---

## 1. What reproduced (author's claims, re-run by a non-author)

Run bare in the worktree, exit codes read unpiped.

| Claim | Author | Verifier | Verdict |
|---|---|---|---|
| `npm run lint:copy` | exit 0, 137 files, 0 dashes, 0 hits, 0 admitted, lexicon 25 | identical, exit 0 | reproduced |
| `--self-test` colours | 40, was 28 | 40 at `4235e382`, 28 at `7686f904` (counted `as required` lines) | reproduced |
| `--reach` | 51 matches / 51 distinct / 28 holding a literal / 17 files | identical, byte-for-byte against `gates/selftest-green-and-reach.txt` | reproduced |
| Five plants RED at repair | exit 1 ×5, each naming its line | P1 replicated (V8) and the bound-attr arm in its second spelling (V9): exit 1, correct file:line | reproduced |
| Plants BLIND at `7686f904` | exit 0 ×5 | replicated off-branch (r0 scanner checked out beside the real one, no stash): V8's shape exit 0, 0 hit(s) | reproduced |
| `npx vitest run` | Test Files 68 (68), Tests 830 (830) | Test Files **68 passed (68)**, Tests **830 passed (830)**, exit 0 | reproduced |
| dist byte-identity | `diff -r dist-before dist` exit 0 | **independent rebuild**: `npx vite build --config .vite-exec.config.ts --outDir dist-verify` (237 modules, exit 0) → `diff -r dist-before dist-verify` **exit 0**, `diff -r dist dist-verify` **exit 0**, chunk `index-CubiZsMVSwTc.js` | reproduced, and strengthened (a third independent build agrees) |
| goldens 4/4 | exit 0, nothing re-baselined | re-run against **my own build** on my own port (127.0.0.1:4258): **4 passed (1.7s)**, exit 0, no snapshot residue in `git status` | reproduced |
| `lint:live-regions` / `lint:motion` / `test:font-coverage` / `lint:eslint` | exit 0 | exit 0 ×4 | reproduced |
| gate wall time unchanged | r0 0.14/0.15/0.14 s · r1 0.17/0.14/0.16 s | r0 0.09/0.09/0.09 s · r1 0.10/0.11/0.10 s (quieter box, same verdict: no measurable cost) | reproduced in direction |
| nothing loosened | lexicon 25, `ADMITTED` empty, no file joined `ALLOW` | the diff contains no `JARGON` / `ADMITTED` / `ALLOW` hunk; runtime output agrees | reproduced |
| no product string moves | one build script | `git show --stat 4235e382` = 1 file, `scripts/check-copy-register.mjs` | reproduced |

**π.** Not in question and now proved three ways: the diff enters no bundle graph, a fresh build at
`4235e382` is byte-identical to `dist-before` (built at the parent) *and* to the author's `dist`,
and the goldens pass on my own build. A two-engine census over byte-identical bundles is a null
test; I did not re-run the chromium probe for a second null, and I claim no WebKit measurement.

**M16 / W3 by ear.** No word changed, so there is nothing to read by ear and nothing for the spoken
contract to catch up with. `lint:live-regions` green, `test:font-coverage` green, no new glyph.

---

## 2. MUST 1 — the utterance half of the live-region idiom is not read, and it holds live copy

`NARRATION_CALLS = ["useLiveRegion"]` reads the arguments of the **narration** spelling
(`useLiveRegion(() => "…")`). The composable's **utterance** spelling — its returned `say`, which
`useLiveRegion.ts:31` documents on the line above the narration one — is not read anywhere, and
neither are the local wrappers the estate builds over it.

Live sites holding static copy today:

| Site | The sentence a screen reader says |
|---|---|
| `src/games/shared/GameControlPanel.vue:320` | `say(copied ? "Link copied" : "couldn't copy. the link is in the address bar")` |
| `src/games/shared/GameBoard.vue:883` | ``announce(`${fill.count} … ${…"square":"squares"} filled`)`` (via `announce` → `sayBoard`) |
| `src/pencil/chrome/GameGallery/GameGallery.vue:815` | ``sayGuard(`Choose keep, or ${guardVerb.value}.`)`` |

Measured, not argued (`verify-r2/plants-at-4235e382.txt`):

- **V1** — `announce(\`… filled by the solver\`)` at `GameBoard.vue:883` → **EXIT=0**, `0 hit(s)`.
- **V2** — `say(copied ? "the solver copied the link" : …)` at `GameControlPanel.vue:320` → **EXIT=0**, `0 hit(s)`.

The gate's own header states this class in the first person: *"a composable whose whole office is
putting words in front of a reader renders copy, so every string literal in its ARGUMENTS is read as
copy… Spoken copy is copy — an ear is a reader."* The implementation reads one of the composable's
two spellings. This is the hand-written subject list W8's intake §2 warns about, one rung up: the
list has a born-RED control, but the control was written for the spelling the list holds.

**Fix (inside this cure):** read the arguments of the utterance spelling as copy — the destructured
alias at the `useLiveRegion()` call is discoverable (`const { text: boardVoice, say: sayBoard } =
useLiveRegion()`), which keeps the rule discovered rather than enumerated; a local one-line wrapper
whose only body is `sayX(line)` needs no separate clause if the wrapper's own call sites are read
by the same rule, or it needs one, and either way it needs its colour. Ship V1 and V2 as the
born-RED, each with a player's-words twin, and a positive control that a non-speech call named
`say*` (there is none today) or an identifier argument (`announce(dealLine.value)`,
`GameBoard.vue:862`) reads 0.

**Mitigation, stated so the chair can price it:** these three sentences are pinned by unit rows
(`GameControlPanel.test.ts:601/606/621/625`, `GameBoard.receipt.test.ts:214/230/241`), so today's
words cannot change silently. The gate is what covers the sentence written tomorrow.

---

## 3. MUST 2 — a `COPY_KEY` whose value is a CALL is blind, and one object literal proves it

`COPY_KEYS`' arm is `` `(?<![\w.$-])${key}:\s*(?=["'`])` `` — the value must *start* with a quote.
Where the estate wraps its copy in a small helper, the key is read and its sentences are not.
`GameControlPanel.vue:355–364` is the whole demonstration, three keys on one returned object:

| Line | Key | Value | Gate |
|---|---|---|---|
| 355 | `aria:` | `saysCoarse("Link copied", "couldn't copy. …", idle.aria)` | **read** — but only by accident, via `SPOKEN_NAME`'s `aria` prefix, not by `COPY_KEYS` |
| 363 | `sublabel:` | `saysCoarse("copied!", "couldn't copy", idle.sublabel)` | **blind** |
| 364 | `washi:` | `says("copied!", "couldn't copy. …", idle.washi)` | **blind** |

- **V3** — `sublabel: saysCoarse("solver copied!", …)` → **EXIT=0**, `0 hit(s)`.
- **V4** — `washi: says("the solver copied!", …)` → **EXIT=0**, `0 hit(s)`.
- **V5** (control) — the same word in the `aria:` value one screenful up → **EXIT=1**,
  `GameControlPanel.vue:356  [spoken source]  "solver"`.

A gate that reds on one of three sentences in one object literal, and is green on the two beside it,
is the false-**negative** twin of the false-subject class §9.5 names. `sublabel` and `washi` are
both already in `COPY_KEYS` *and* in `RENDERED_ATTRS`: the subject was declared, only the grammar
was short.

**Fix (inside this cure):** the machinery already exists — `initializer(s, at, ",;")` plus
`copyLiterals` is exactly what `SPOKEN_SOURCE_PROP` runs, and it is quote- and depth-aware, so a
call expression is walked to its depth-0 comma. Drop `COPY_KEYS`' quote lookahead and read the
property's initializer the way the spoken arm reads its own. Controls: V3 as born-RED, the same
line in the player's words as its twin, and a positive control that a key whose value is a bare
identifier (`idle.sublabel`) reads 0.

---

## 4. NOTEs

1. **A plural copy name is blind in both spellings.** `SPOKEN_NAME` ends at its suffix, so
   `FURNITURE_NOTES` and `errorNotes` match nothing (V6, V7 — both **EXIT=0**), while the singulars
   red (V8). No live instance carries copy today (`savedPairLabels`, `GameGallery.vue:582`, is the
   only live plural and its template literal has no static text), so this is reach, not a miss —
   but the name rule's own word boundary is what defeats it, which is worth one line in §9.8 and a
   `-?s?` in the suffix alternation if the chair wants it cheap.
2. **Author-stated gaps verified, not merely repeated.** `get …Label(): string` — my grep agrees
   there is none in `src/`. Single-quoted bound attributes (`:attr='…'`) — none in `src/`. The
   `v-bind:` spelling of a bound accessible name **does** red (V9), as §9.3 claims.
3. **Arithmetic.** The return says the file went `876 → 1,139` lines; it is **1138**
   (876 + 305 − 43). The diff stat itself is right; only the sentence is off by one.
4. **`--reach` is honest about what it is.** The three numbers, the type-annotation double count
   cured at the source, and the "a census is reach, not proof" clause in `spokenSubjects`' doc
   comment all reproduce, and r0's circular gap 3 is struck in place. That part of the repair is
   exactly what was asked for.

---

## 5. Hygiene

- Servers: one `vite preview` on **127.0.0.1:4258** (`--strictPort`, my own build in `dist-verify`),
  killed at return; `lsof` reads **0 listeners on 4257 and 4258**. Port 4259 was already held by the
  `w8-bake` lane's `probe-server.mjs` and was neither used nor touched.
- Scratch: the r0 scanner copy (`scripts/check-copy-register.r0.mjs`) and `dist-verify/` are
  deleted. `git -C .claude/worktrees/w7-exec status --porcelain` = `?? web/frontend/.vite-exec.config.ts`
  and nothing else. Every plant was reverted with `git checkout --` and `git status src/` read clean
  after each one, in the transcript itself.
- The main tree's `src/`/`dist/` were never edited, built or served. No `LEDGER`/`DISPOSITIONS`/wave
  file touched. No push. No Safari, no simulator, no `osascript` (M19).
- NOT RUN, named: the full Playwright battery, `e2e/visual-regression.spec.ts`, every WebKit arm,
  and the chromium rect census (a null test over byte-identical bundles); `lint:knip`, `lint:relay`,
  `lint:catch`, `lint:theme-tokens`, `lint:tdz`, `lint:sleep`, `test:support-floor`,
  `test:coverage:floor`, `npm audit`, `vue-tsc`, `typecheck:e2e`, `typecheck:node`, `lint:prettier`,
  `lint:boundary`, `lint:ink`, `lint:theme-selectors`, `lint:lanes` — the author's logs for these
  end in exit 0 and the diff touches one build script that no typecheck covers differently than
  eslint does; I re-ran `lint:eslint` and the four gates whose subject this cure moves.

## 6. Evidence

- `verify-r2/plants-at-4235e382.txt` — V1–V9 against the cured gate, run bare, each with its exit
  code, its `jargon over RENDERED strings` line, its hit (where it reds) and a clean
  `git status src/` after revert.
