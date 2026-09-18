# G17 · verify round 3 (non-author) — repair r2 at `8d334845`

**VERDICT: ACCEPT.** Zero BLOCKING, zero MUST, four NOTEs. Both MUSTs from round 2 are cured and
I reproduced the cure independently: on the REAL tree, four planted `solver`/`engine` sentences
that ship past the parent scanner (`4235e382`) green now RED at `8d334845`, each naming its own
file:line and kind — and two of the four are sites the author never planted
(`GameGallery.vue:405`, `:815`). Every number in the author's return reproduces on my runs.

Everything below was run by me in the worktree `/…/.claude/worktrees/w7-exec` at `8d334845`,
bare (no pipes on the gates that own an exit code). Evidence I banked: `verify-r3/`.

## 1. What I reproduced

| claim | author | mine | file |
| --- | --- | --- | --- |
| `--self-test` | exit 0, 52 colours | exit 0, **52** "as required" | — |
| `npm run lint:copy` | exit 0, 137 files, 0 hits, 0 admitted, lexicon 25 | **identical, exit 0** | — |
| `--reach` spoken subjects | 63 match / 63 distinct / 29 with a literal / 21 files | **identical** | — |
| `--reach` utterance census | 6 voices, 3 files (`sayBoard, announce` · `sayCopy, say` · `sayDeck, sayGuard`) | **identical** | — |
| `npx vitest run` | Test Files 68 (68), Tests 830 (830) | **68 / 830, exit 0** | `verify-r3/vitest-vr3.txt` |
| goldens (my own port 4259, served `dist`) | 4 passed | **4 passed, exit 0**, nothing re-baselined | `verify-r3/goldens-vr3.txt` |
| `npx eslint scripts/check-copy-register.mjs` | exit 0 | **exit 0** | — |
| `npx prettier --check` on the edited script | exit 0 | **"All matched files use Prettier code style"** | — |
| `npm run lint:live-regions` | exit 0 | **exit 0** (W3's contract intact) | — |
| gate wall time | r1 0.11/0.10/0.10 · r2 0.10/0.10/0.11 | **r1 0.12/0.11/0.10 · r2 0.13/0.11/0.11** | `verify-r3/runtime-r1-vs-r2-vr3.txt` |
| scanner size | 1,138 → 1,422 lines, +292/−8 | **`wc -l` 1,138 / 1,422; `--stat` 292 insertions, 8 deletions, one file** | — |
| dist identity | `diff -r dist-before dist` exit 0 | **exit 0**, no "Only in", `index-CubiZsMVSwTc.js` | — |

**π / bundle.** `git show --stat 8d334845` is ONE file, `web/frontend/scripts/check-copy-register.mjs`.
`vite.config.ts` does not reference `scripts/`, and no `src/` file imports the scanner (grep: no
hits outside the script itself), so the cure cannot enter the bundle graph. I did not rebuild:
`diff -r dist-before dist` exits 0 on the author's pair, and byte identity is a stronger claim
than a pixel census over the same bytes. **No census re-taken and none owed** — a rect census of
two identical dists measures its own noise. WebKit never launched (M19 held: no `osascript`, no
`open -a`, no simulator).

## 2. Born-RED, reproduced off the author's script

`verify-r3/plants-r1-BLIND-r2-RED-vr3.txt` (`verify-r3/vr3-plants.sh` wrote it). The parent
scanner was checked out beside the real one (`git show 4235e382:… > scripts/.vr3-r1.mjs`, since
deleted) so `ROOT` resolves; each plant is applied to `src/`, both scanners run bare, then
`git checkout --` and `git status --porcelain` clean.

| plant | shape | r1 `4235e382` | r2 `8d334845` |
| --- | --- | --- | --- |
| baseline, no plant | — | EXIT=0 | EXIT=0, 0 hit(s) |
| `GameBoard.vue:883` | `announce()` — a voice reached through a wrapper | **EXIT=0** | **EXIT=1** `[announce()] "solver"` |
| `GameGallery.vue:405` | `sayDeck()` — a voice in a file the author never planted | **EXIT=0** | **EXIT=1** `[sayDeck()] "solver"` |
| `GameGallery.vue:815` | `sayGuard()` — a second gallery voice, `engine` not `solver` | **EXIT=0** | **EXIT=1** `[sayGuard()] "engine"` |
| `GameControlPanel.vue:364` | `washi:` whose value is a call | **EXIT=0** | **EXIT=1** `[washi:] "solver"` |

The last of those is MUST 2's own live site and the first is MUST 1's; the two gallery plants are
mine, and they show the utterance clause is not fitted to the two files the round-2 verifier
happened to plant.

## 3. My own controls — the shapes the author did not think of

Fourteen controls spliced into BOTH scanners by `verify-r3/vr3-controls-injector.mjs`; transcript
`verify-r3/vr3-controls-r1-vs-r2.txt`. `want: 1` means a player-facing jargon sentence sits in
that shape, so `FAILED` at `want: 1` is a MISS and `FAILED` at `want: 0` is a false RED.

**Closed (r1 blind → r2 red), i.e. the cure is wider than its own controls prove:**

- **VR3-A** a wrapper OVER A WRAPPER (`deal → announce → sayBoard`) — RED at r2, blind at r1. The
  header claims a fixed point and has no colour for it; it works.
- **VR3-E** a `COPY_KEY` whose value is a call holding a **template** literal — RED at r2.
- **VR3-G** a voice spoken from the **template** half of an SFC (`@click="say('…')"`) — RED at r2.
- **VR3-N** an utterance whose literal sits in a nested ternary two calls deep — RED at r2.
- **VR3-J** a bare `NOTES` table with no prefix — RED at r2 (this is the mechanism that forced
  B1b's control rename, and the author discloses the rename).
- **VR3-K** the regression control: a `COPY_KEY` with a plain quoted value still reds at both. The
  widened grammar subtracts nothing.

**Still blind (both scanners), each one a gap and none of them live in `src/` today:** see NOTE 1.

**New false RED:** see NOTE 2.

**Not introduced here:** a `COPY_KEY` in a TYPE position (`type Row = { label: "solver mode" | "off" }`)
reds at r1 AND r2 — the old quote lookahead matched it too. Not this cure's, not a regression.

## 4. Is any live utterance still blind?

I enumerated every call site of the six discovered voices (`grep -rnE "(sayBoard|announce|sayCopy|sayDeck|sayGuard)\(|[^.[:alnum:]_]say\("`,
tests excluded): `GameBoard.vue:689/691/694/695/862/883`, `GameControlPanel.vue:320`,
`GameGallery.vue:399/405/425/500/522/815/836/919`. Every literal among them is either handed
straight to a voice (read) or is an identifier (correctly not read). `GameGallery.vue:399`'s
`announce(i: number)` is NOT a voice and should not be — it takes an index and speaks through
`sayDeck`, whose literal my plant P2 reds. Every `aria-live` region in `src/` is one of the five
`useLiveRegion` sites, so there is no second speaking idiom outside this rule. No live utterance
is blind at `8d334845`.

## 5. Nothing loosened

No `+`/`-` line in the diff touches `JARGON`, `ADMITTED`, `ALLOW`, `COPY_KEYS`, `RENDERED_ATTRS`
or `NARRATION_CALLS` (grep over the diff, empty). Live run confirms: lexicon **25** entries,
**0 admitted**, ALLOW **2** files. The one control whose text changed (`NOTES` → `ROWS`) keeps its
`want: 0` — it still asserts the gate is blind to a type-only copy table, so it is a fixture
rename, not a relaxation. No product string is in the diff, so M16-by-ear has nothing to read and
`test:font-coverage` has no new glyph to want; the only new strings are self-test fixtures inside
`scripts/`, which `scan()` never walks (`walk(ROOT/src)` + `index.html` only).

## 6. NOTEs (none blocking; all are one line of §10.6 each)

1. **Three blind utterance shapes the gaps list does not name**, proven by my controls, none live
   in `src/`: a wrapper that TRANSFORMS its parameter before speaking (`sayBoard(line.trim())` —
   `FORWARD` compares the argument to a parameter NAME, so the wrapper is not a voice and literals
   handed to it are unread); an optional call (`sayBoard?.("…")`); and a destructure with a default
   (`const { say: sayBoard = noop } = useLiveRegion()` — the alias parses as `sayBoard = noop` and
   binds nothing). A fourth is adjacent to a disclosed gap but stated only for `FORWARD`: the
   `PASS` receiver declared as an arrow (`const copyAct = (act, say) => …`) binds nothing either,
   because `fns` collects `function` declarations only.
2. **A new false-RED class from the plural.** `const LINES = ["worker-ready", "ack"]` is GREEN at
   r1 and RED at r2 — a plural name that is not copy now reads as a copy table. Loud direction and
   consistent with this gate's stated choice, but it belongs beside the `NOTES` → `ROWS` rename in
   §10.3 rather than being left for the next lane to trip over.
3. **The fixed point has no colour.** The header promises "a wrapper over a wrapper is still a
   voice" and the self-test has no control for it. It works (VR3-A) — one control would close the
   distance between what the header claims and what the ledger proves, which is exactly the class
   the author books for the fold.
4. **`--reach`'s utterance census cannot distinguish a seeded voice from a derived one** (it prints
   `sayBoard, announce` flat). Cosmetic, but the census is the only readout of a discovered rule.

## 7. Hygiene

`git status --porcelain` in the worktree = `?? web/frontend/.vite-exec.config.ts` and nothing else,
before and after. Every scratch file I wrote into the worktree (`scripts/.vr3-r1.mjs`,
`scripts/.vr3-r1-probe.mjs`, `scripts/.vr3-r2-probe.mjs`) is deleted; no `ZZ*` residue from any
round is present. The preview server I started on 127.0.0.1:4259 (`--strictPort`, port checked
free first) is killed and 4259 is clear. No commit, no push, no LEDGER/DISPOSITIONS/wave edit, no
main-tree `src`/`dist` touched.

**NOT RUN, named so:** full `npm run test:e2e`, `e2e/visual-regression.spec.ts`, any WebKit arm, a
fresh `vite build`, a rect census, `lint:knip`/`lint:relay`/`lint:catch`/`lint:theme-tokens`/
`lint:tdz`/`lint:sleep`/`test:support-floor`/`test:coverage:floor`/`npm audit`, `vue-tsc`,
`typecheck:e2e`, `typecheck:node`, `lint:motion`, `test:font-coverage`, `lint:boundary`/`ink`/
`theme-selectors`/`lanes`. The typecheck and lint quartet are the author's runs, unreproduced by
me; the diff touches one `.mjs` build script that `tsconfig`'s app project does not compile and
that eslint and prettier both pass under my own runs.
