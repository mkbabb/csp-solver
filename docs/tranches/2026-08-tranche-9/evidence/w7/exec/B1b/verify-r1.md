# T9-W7 exec · B1b — non-author verification, round 1

Verdict: **ACCEPT** (0 BLOCKING, 0 MUST, 6 NOTE).

Subject: commit `06fee424` on `w7/exec`, parent `e1f2304b`. Nothing in the worktree was edited by
this round; every reproduction ran off-branch in a scratch tree or against served dists. The MAIN
tree's `src`/`dist` were never edited, built or served. Worktree at close:
`git status --porcelain` = `?? web/frontend/.vite-exec.config.ts`, nothing else.

## 1. What I reproduced, and with what

| claim | how I checked it | result |
|---|---|---|
| born RED, gate | scratch tree at `/private/tmp/…/scratchpad/b1b-red/` = HEAD `src/` + `index.html` + HEAD's `check-copy-register.mjs`, with `classifyError.ts` and `GameControlPanel.vue` taken from `git show e1f2304b:` — the gate's `ROOT` is `scripts/..`, so it reads the scratch tree | **exit 1, the same three lines verbatim**, `[COPY table]` on :51/:52 and `[template]` on :980 |
| the blind spot it closes | parent gate (`git show e1f2304b:…check-copy-register.mjs`) over the same parent sources | **exit 0** — 1 hit, 1 admitted (`candidates`), the two `solver` sentences unseen. The gap is real and measured |
| GREEN after the recut | `npm run lint:copy` bare in the worktree | **exit 0** — 0 hits / 0 admitted / 0 unadmitted, 25-entry lexicon, **20** self-test colours all "as required" |
| unit rows | `npx vitest run` bare in the worktree | **exit 0 — Test Files 68 passed (68), Tests 830 passed (830)** |
| the reverted-word rows | read `gates/rows-RED.log` (not re-run: the two `toBe` and one `toEqual` assert the cured strings literally, so a revert fails them by construction) | log shows `Test Files 2 failed (2)`, `Tests 3 failed \| 45 passed (48)`, the three named rows |
| π rest pose | my own census (`scratchpad/b1b-verify/census2.mjs`, same key grammar and settle as `3B-1/probe/rect-census.mjs`) + a diff that enumerates **every** moved rect, `dist-before` on :4258 vs `dist` on :4257 | **chromium 1280×800 1089/1089 · chromium 390×844 1049/1049 · webkit 1280×800 1089/1089 · webkit 390×844 1049/1049 — moved 0, onlyA 0, onlyB 0, WORST 0.00px in all four.** Both engines, which the author's chromium-only run did not cover |
| π driven (alert up) | `probe/note-arm.mjs` re-run by me against both dists, both codes, plus my full-enumeration diff | **exactly 1 rect of 1,103 moved per arm, and it is the note's `<p>`** — `w 283.13 → 280.05` (3.08px) and `w 174.67 → 357.75` (183.08px). Card `133.89,751.03,632.00,48.78` and `try again` `676.52,759.03,75.78,32.78` byte-identical before/after |
| the alert, webkit | `note-arm.mjs` webkit, both codes, cured dist | `role=alert`, `retryButton=1`, widths **280.14** and **357.86**, `names the machine: false` — the README's numbers to the hundredth |
| the caption box | `probe/caption-box.mjs`, **both engines × both viewports** | 1280: chromium `853.89,855.8,268.22,15.44`, webkit `853.84,855.47,268.31,15.44` — identical before/after, matching §4 exactly. **390 (the phone branch, which §8 gap 7 left unphotographed): label `16,1191.55,60,13.38` both engines, before and after** — the fixed 3.75rem column, height 13.38 = ONE line, so `what fits` does not wrap despite its space |
| dist identity | `npx vite build --config .vite-exec.config.ts` myself | exit 0, 237 modules, **`index-CubiZsMVSwTc.js` reproduced**; `dist-before` serves `index-DAj5SdL4MZJz.js`. Bundle greps: cured holds the three new strings and neither old one; parent holds both old ones and neither new one |
| goldens | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test -c playwright-golden.config.ts` | **4 passed**, no `--update-snapshots`, nothing re-baselined |
| the other gates | bare, mine | `vue-tsc --noEmit` 0 · `typecheck:e2e` 0 · `eslint .` 0 · `lint` (prettier) 0 · `lint:motion` 0 (34 specs) · `lint:live-regions` 0 · `test:font-coverage` 0 (Patrick Hand 46 codepoints / 4312 B, 21 declared strings over 4 groups, no re-cut; the woff2 files are untouched by the diff) |
| the enumeration | my own sweep of `src/**` for `solver\|engine\|worker\|wasm\|candidate` inside string literals | the author's list is complete: what is left is event names (`candidatePeekStart`), a model key (`candidatesPinned`), a `console.debug` tag, `url(#solver-ink)` filter ids, the repo URL, `SolverError.name`, and comments. **No other machine-naming string reaches a player** |
| `errorMessage` (gap 2) | grepped every reference | assignments at :623/:700/:823 and the export at :1171; **no reader anywhere in `src/` or `e2e/`**. The gap is stated correctly |
| evidence policy (gap 5) | `node scripts/check-evidence-policy.mjs` at the repo root | **exit 1**, `docs/tranches/2026-08-tranche-9/evidence/w7` 2,189,664 B > 2,097,152 B — pre-existing, from the tracked loop evidence, with `exec/` untracked. A fold blocker the chair owns, correctly disclosed |

Not re-run by me, with the reason: `e2e/zone-grammar.spec.ts` (the author's 22/22 is banked in
`gates/e2e-zone.log`; my two-engine `caption-box` read of `.zone-row-label` is the same assertion
on the same dist, so a throwaway Playwright config was not worth creating and deleting again);
`npm run test:e2e` (binds :3000, outside the fence); anything on Safari or a device (M19).

## 2. The gate, attacked

I planted six shapes the author did not write, against HEAD's gate in the scratch tree
(each planted alone, the baseline being exit 0):

| planted shape | red? | reading |
|---|---|---|
| `const Z_COPY = { budget: 'the solver…' }` (single quotes) | **RED** | the arm is quote-agnostic |
| the same table inside a `.vue` `<script setup>` | **RED** | not a `.ts`-only arm |
| `export const NOTE_COPY = Object.freeze({ budget: "the solver…" })` | green | blind |
| `export default { budget: "the solver…" }` | green | blind |
| `class N { static COPY = { budget: "the solver…" } }` | green | blind |
| `const X_COPY = { "worker": "all set." }` (jargon in a quoted KEY) | **RED** | over-read, safe direction |
| `const Y_COPY = { budget: { text: "ok", filter: "url(#solver-ink)" } }` | **RED** | over-read, safe direction |

The rule is exactly `const|let|var <name containing COPY|Copy> = {` — everything else is outside
it, including a lowercase `const copy = {…}`. See NOTE 1 and NOTE 2.

Loosening check: `JARGON` is unchanged at 25 entries, `ALLOW` unchanged at 2 entries, `ADMITTED`
is empty, and no self-test colour was deleted (18 → 20). `check-font-coverage` gained a group,
which only adds demands on the cut. **The gate was tightened; nothing was loosened.**

## 3. The words, by ear

- `what fits` — plain, two words, sits under the tape that spells it out (`show every digit that
  still fits in a cell`) and above an Off/On pair. It is also the group's accessible name
  (`aria-labelledby="candidatesId"`), where it reads as a label, not an event, which is what W3's
  contract asks of a name. No jargon, no dash, no machine. Fits the 60px phone column on one line
  (measured, both engines).
- `this board took too many steps to finish.` — plain English, says what broke, register matches
  its two untouched siblings (lowercase, one sentence). It drops the brief's `Try a new deal.`
  half and leaves the act to the card's `try again` button; `RETRYABLE_CODES` holds
  `BUDGET_EXCEEDED`, so the button is the sanctioned act and the choice is defensible.
- `the board's helper stopped working. reload the page.` — the brief's own default candidate. It
  is the one phrase of the three a player could stall on (`the board's helper` names an entity the
  product never otherwise introduces), and its `reload the page.` sits beside a `try again` button
  that is drawn on **every** paper note (measured `retryButton=1` on all four arms, both engines).
  The author books both as gap 1 for the owner's U-10 re-look, which is the right disposition.

W3: both sentences still name WHAT broke; `lint:live-regions` is 0; the unit rows that read the
alert moved in the same commit and kept their intent, gaining a `not.toContain("solver")` guard.

## 4. Findings

**NOTE 1 — §8 gap 3 under-enumerates the arm's blind spots.** It says "now two instead of three".
Measured, the name rule leaves at least five: the cell core's template literal, a `Record<…>`
whose TYPE says copy (both stated), plus `Object.freeze({…})`, `export default {…}`, a class
`static COPY = {…}`, and a lowercase `const copy = {…}`. The honest statement is the shape family:
anything that is not `const|let|var <…COPY…> = {` is outside the arm. Fix: one line in gap 3 and in
the script header; W5 keeps the estate row.

**NOTE 2 — the arm reads every literal in the table, including keys and non-copy values.** Planted
proof above. Today's tree is clean (`"deal-timeout"` carries no lexicon word), but a future copy
table keyed `"worker-failure"`, or one holding an icon id or a filter url, reds on a string no
reader sees — and the only escape hatch is an `ADMITTED` entry, which this slice just emptied on
purpose. Fix: say so in the header, or read values only (`:\s*` before the literal), keeping the
quoted-key case as a stated limit.

**NOTE 3 — "ONE rect of 1,103" is true but not checkable from the banked evidence.**
`rect-diff.mjs` prints only the worst rect per file, and the raw JSONs are deliberately not banked
(gap 5), so `census/diff-note.txt` cannot support the count. I reproduced it with a
full-enumeration diff (moved = 1 in both arms, onlyA/onlyB 0), so the claim stands. Fix: bank the
one-line summary of a full diff, or state that the count came from an instrument the evidence
does not carry.

**NOTE 4 — the phone branch is now measured, and should be cited as such.** §8 gap 7 says the
`flex: 0 0 3.75rem` column "was read through the census, never photographed"; the census cannot see
it (the caption sits at y≈1191 in a 844px window, so it is off-screen, not absent). My
`caption-box` read at 390×844 in both engines gives the real number — label `60×13.38`, one line,
identical before and after. Worth folding into the README so the phone claim rests on a
measurement rather than on the rest-pose zero.

**NOTE 5 — the network note and the `try again` button advertise two different acts.** Disclosed
as gap 1 and correctly routed to the owner; recorded here because a screen-reader user hears
"the board's helper stopped working. reload the page." and then a button that cannot help
(`RETRYABLE_CODES` excludes `WORKER_FAILURE`, though `classifyCode`'s default draws the button
anyway). The button's presence on a non-retryable fault predates this slice; the competing
sentence does not.

**NOTE 6 — the banked size is misstated.** Gap 5 says "this slice banks 168 KB"; the tree is
**97,043 B over 31 files** (`du` reports 188 KB of allocated blocks). Conservative in the safe
direction, but the number should be the bytes.

## 5. Housekeeping

Servers: 4257 and 4258 were mine (`vite preview --config .vite-exec.config.ts --outDir …
--host 127.0.0.1 --strictPort`); both killed, 4257/4258/4259 verified free. No file was written
into the worktree by this round — the scratch tree, the census scripts and every JSON live under
the session scratchpad. `dist/` was rebuilt in place (gitignored) and reproduces the committed
hash. Worktree clean but for the untracked `.vite-exec.config.ts`.
