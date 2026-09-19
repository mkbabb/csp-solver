# NOTE-ERASE · pass-2 PROTOTYPE — what runs, and what it measures

T9-W7 §7. The spec is `../../synthesize/NOTE-ERASE.md`; this is the build that stands behind it.
It RUNS: worktree `.claude/worktrees/wf_8630d340-e56-48`, branch `worktree-wf_8630d340-e56-48`,
uncommitted diff `note-erase-p2.diff` (12 files, +519/−71, plus two new test files). Server:
`npx vite --config probe/vite.scratch.config.mjs --host 127.0.0.1 --port 4248 --strictPort`
(private cacheDir), killed before this lane returned. No `npm run build` (W8 §8.1's dist freeze).

The replay carried the whole pass-1 build: `git apply --3way` of
`pass1/prototype/NOTE-ERASE/proto/note-erase.diff` landed all five files cleanly and `diff -rq`
against the pass-1 worktree's `src/` came back empty but for its untracked
`useGameState.authorship.test.ts`, which was copied across. HEAD had moved by docs only.

## What the build does that pass 1 did not

| step | pass 1 | pass 2 |
|---|---|---|
| the verbs | `--note-write-ms` / `--note-rub-ms` / `--note-settle-ms`, beats × `beatMs`, published as an inline style | `var(--motion-note, 250ms)` / `var(--motion-whisper, 150ms)` / `var(--motion-dusk, 350ms)` — §13's rungs, landed in MOT-LADDER's shape (`MOTION.rungs`, six shipped) with `publishMotionRungs()` emitting ONE `<style data-motion-rungs>` node and its reduce arm |
| the clocks | five keys in `MOTION.note`, three of them verbs | two: `settleAfterBeats: 8`, `refusalHoldBeats: 24` |
| the key | `:key="text"` | `:key="seq"`, a monotonic write sequence |
| the repeat | `nextTick` re-write — silent (`mode="out-in"` never lets the region reach `""`) | the hole is opened on purpose: `""` now, re-write on a cancellable seq-guarded timer at `whisper + 17ms` |
| the age | gated on `tone === "graphite"` | gated on `kind` (`record`/`state` settle; `grade`/`reply` never) |
| the kinds | two booleans (`hintNoteLive`, `refusalNoteLive`) | one `marginKind` ref; both booleans deleted |
| the park | nothing | `parked?: boolean` on the Scene seam, forwarded App → GameShell → BoardHost → GameBoard (three forwards, not two — BoardHost is on the path) |
| the seam | `origin: WriteOrigin = "self"` | `origin` REQUIRED; `sessionSource` annotated (`SessionSource` exported for it) |
| the gate | none | `gateNote` + `gateNoteDiscovery` in `check-ink-pressure.mjs`, both self-tested |

## The numbers (both engines, the real surface)

### the verb — G1, G14, G7
| | chromium 390 | chromium 1280 | webkit 390 | webkit 1280 |
|---|---|---|---|---|
| leave animation | `ink-rub-out, ink-rub-out-fade` | same | same | same |
| computed duration | 0.15s, 0.15s | 0.15s | 0.15s | 0.15s |
| easing | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | same | same | same |
| median rAF in-run | 8.3 ms | 8.3 | 17.0 | 16.0 |
| frame bar ⌊150/rAF⌋ | 18 | 18 | 8 | 9 |
| distinct clip states | **18** | **19** | **10** | **10** |
| span absent at | 196.7 ms | 207.1 | 214 | 219 |
| filter / transform / dirty ancestors | none / none / [] | · | · | · |

PRM, both engines both widths: `animation: none`, `animationDuration "0s"`, the published rungs
read `0ms`, one clip state, the span gone 2 rAF samples after the retracting keystroke.

### the age — G2, G3
| | settled at | fresh painted | settled painted | core vs computed |
|---|---|---|---|---|
| chromium light | 1007 ms | 14.52:1 | **5.17:1** | Δ 0.7 / 0 / 0.3 |
| chromium dark | 1011 ms | 12.25:1 | **6.07:1** | Δ 0.6 / 0.6 / 0.3 |
| webkit light | 1013 ms | 14.52:1 | **5.17:1** | Δ 0.7 / 0 / 0.3 |
| webkit dark | 1018 ms | 12.25:1 | **6.13:1** | Δ 0.6 / 0.4 / 0.3 |

8 beats = 1000 ms, landed within 1–2 frames on every arm. The settle's transition reads
`0.35s` (the dusk rung). Verdicts at 8 beats + 1 and again 600 ms later: `data-note-age` null,
teacher-red **4.87** light / **6.44** dark, `is-quiet === false` asserted first, painted core
equal to the computed colour on every channel.

The painted reader now composites the computed colour itself (`rgb(…)` and `color(srgb … / a)`)
and reports the per-channel delta: pass 1's gold 12.46 was the inline star, and this is the
cross-check that would have caught it. An `oklab(…)` mid-transition value is reported as
"not cross-checked" rather than converted.

### the trajectory — G6
`[X, "", X]` at mutation time, both engines, `ink-rub-out` starting exactly once:
chromium `105 → 1186 "" → 1199 X` (a 13 ms hole), webkit `188 → 1298 "" → 1306 X` (8 ms).

### the clock — G5
One refusal, chromium: present at 23 beats (2881 ms), present and LEAVING at 24 beats + 20 ms
(3022), absent at hold + whisper + 40 (3191). Two refusals (the second at beat 12): present at
30 and 35 beats, gone at 36 beats + whisper + 60 — the clock restarts, both engines.
WebKit's single-refusal arm is still mid-leave at hold + whisper + 40 (the leave begins on the
next 17 ms frame): gone by hold + whisper + 2 frames. The gate's wording needs the engine's
frame, which is what G14 already says.

### the park — G9
G9a a `record`: survives `g` and cancel, same sentence, same box (chromium 107.2×23.6 restored;
webkit likewise). Parked it keeps a rect — 50.4×11.21 effective, `checkVisibility()` true, one
client rect, `offsetParent` non-null — which is the research's point: no DOM predicate can tell.
G9b a `reply`: the park lands 214 ms (chromium) / 235 ms (webkit) after `g` — the fold takes
that long — and the strip is `""` **165 ms / 188 ms later**, one rub-out plus a frame. Cancel
brings back nothing. `g` then Deal leaves `""`.

### the peer rows — G4, on `?wire=local`, delivery proven on every row
| row | armed | peer wrote | note |
|---|---|---|---|
| elsewhere | hidden single, 9 because cells | a cell outside the set | **stands** (chromium and webkit) |
| the named cell | hidden single | the cell the sentence names | erased |
| a DISTINCT because member | hidden single, set [0…8] | member 1, named cell 3 (chromium) · member 2, named 0 (webkit) | erased |
| a peer REVEAL at the named cell | hidden single | two H presses on that square | erased |
| your refusal | — | a peer's digit elsewhere | **untouched** (chromium) |

The distinct-member row is forced here, which pass 1 could not do: the hint is a two-press
transaction whose arm SURVIVES a focus move, so walking cell to cell inks the previous cell's
answer. Each miss is consumed and undone (`f-because.probe.ts`). The refusal row on webkit is
inconclusive for a clock reason, not a design one: the probe's own sequence (refuse, then a peer
write with its 1.6 s settle) runs past the 24-beat hold, so the reply had legitimately left.
The unit row covers it.

### π on what the family does not claim
Board, controls card and `scrollHeight` deltas **0** across empty → fresh → settled → mid
rub-out → parked-and-back, at 390 and 1280, both engines. One non-zero: `.margin-note-block`
grows 20.8 → 23.61 px at 1280 when a line lands — HEAD's own reserved line is `1.3em` of the
BLOCK's font while the note renders at 18.18 px. Byte-identical in pass 1's readings and not
something this family moved; it is a row for whoever owns the strip.

filterBudget **9 exact** at 4×4 / 9×9 / 16×16, both engines. No `forwards|both` fill mode is
added anywhere in the diff, so `FILL_ALLOWLIST` is unchanged by construction; the built-dist
half of `e2e/filter-census.spec.ts` is OWED at WGATE's rebuild (the estate's e2e config starts
its own server on :3000, which this lane may not do).

### the censuses
- `wobble.probe.ts` (r0 copy, OUT relative so the copy re-points itself): grid σ **1.443**,
  ring σ **0.092**, wash σ **0** — byte-identical to r0 on both engines. Its own `expect` still
  reds, because R3-a's finding is that the ring is out of the grid's band: born-RED at HEAD,
  unmoved here.
- `budget.probe.ts`: 9 live filters at every size, both engines; the rows are the same four
  (heart, celestial, four grain poses, sparkle drop-shadow).
- `heading-voice.spec.ts` (r0 control, re-pointed by env): the three voices read
  `Fraunces 25.89/800`, `Patrick Hand 14.05/500`, `Patrick Hand 14.05/400` at 1280 and
  `20.35 / 14.00 / 14.00` at 390, dock rank **1.0175** — every figure byte-identical to r0's
  born-RED head. Unmoved.
- `check-copy-register --self-test`: green, 0 dashes, 0 unadmitted (no string is minted, moved
  or re-rendered). `check-font-coverage`: unmoved.
- `npm run lint:ink` (with the new rows): green, and its `--self-test` now covers them.

## The gates, as they stand on this build

| # | gate | reading |
|---|---|---|
| 1 | the exit exists | GREEN — `ink-rub-out` on `--motion-whisper`, gone at ended + 1 frame, both engines |
| 2 | the settle | GREEN — 5.17 / 6.07–6.13, cross-checked ≤ 12 per channel |
| 3 | verdicts never settle | GREEN — 4.87 / 6.44 at 8 beats + 1 and after, `is-quiet === false` |
| 4 | the peer rows | GREEN — five rows, four on both engines, the fifth chromium-live + unit |
| 5 | the reply leaves | GREEN with the engine's frame: absent at hold + whisper + 1 frame chromium, + 2 frames webkit |
| 6 | the repeat speaks | GREEN — `[X, "", X]`, one rub-out |
| 7 | PRM immortality | GREEN, and WEAKER than it reads (see gaps) |
| 8 | no fill, no filter | GREEN — budget 9 exact, no fill mode added |
| 9 | the park per kind | GREEN — G9a stands, G9b `""` within one rub-out of the PARK |
| 10 | G-hold | GREEN — 3000 ≥ 2582, and the 90 wpm arm quantizes to 40 beats |
| 11 | the seam is required | GREEN, born-RED proven: strip one `origin` and vue-tsc says `TS2554: Expected 3 arguments, but got 2` at the site |
| 12 | the quiet rung's note row | GREEN — 5.19 light / 6.12 dark on `--color-background`, 17 rung reads ≥ 16, MarginNote pinned |
| 13 | R6 law 4 in the file | RESTATED (see gaps): 0 bare literals, 2 admitted `var(--motion-note, 250ms)` fallbacks |
| 14 | the frame bar is the engine's | GREEN — 18 ≥ 18 and 19 ≥ 18 chromium, 10 ≥ 8 and 10 ≥ 9 webkit |

## Crops (2 of the 4 allowed)

`frames/park-record-1280-chromium.png` · `frames/park-reply-1280-chromium.png` — the parked
card's strip, per kind. They are also the frame that CORRECTS a research claim: see gaps.
The repeat's hole is not photographed — it is 13 ms wide at mutation time, under any
screenshot's latency, and an empty strip is a picture of nothing; B1's trajectory is its
evidence. The settled pose is unchanged from pass 1's `settled-390-dark.png` (the dusk rung
moves the transition's length, not the end colour), so no crop is taken for it, and the verb's
live frames are the research's `midErase-{chromium,webkit}.png`.

## The battery, in this worktree

- `vue-tsc -b --force` — clean (and RED, by design, the moment one `origin` is stripped:
  `TS2554: Expected 3 arguments, but got 2` at `useGameState.ts:535`).
- `vitest run` — **68 files, 821 tests, all passing**, including the six authorship rows and the
  five new motion rows (G-hold 3000 ≥ 2582, the 90 wpm arm quantizing to 40 beats, the
  fallbacks byte-equal to their rungs, no unadmitted literal, `MOTION.note` holding clocks only).
- `node scripts/check-ink-pressure.mjs --self-test` — green, printing
  `settled note 5.19 light / 6.12 dark ≥4.5 (--ink-press-quiet on --color-background; 17 rung
  reads in src/)`, with both new self-test cases failing on known-bad input as required.
- `node scripts/check-copy-register.mjs --self-test` and `check-font-coverage.mjs` — green,
  unmoved.
- `prettier --check src/ scripts/` and `eslint` over every touched file — clean.

## The corrections and the gaps — every one of them

1. **THE PARK DOES NOT PAINT THE NOTE. IT CLIPS IT AWAY.** The research's row says the park
   "paints it at 8.63px inside the deck card"; measured by hit test and by bytes
   (`g-parkvis.probe.ts`, `readings/g-parkvis-chromium.json`), the parked line's box is
   `137.9, 543.6, 50.4×11.2` and the clipping ancestor `div.live-face-slot { overflow: hidden }`
   is `136, 237, 304×304` — the line sits **2.6 px below the slot's bottom edge**,
   `containsNote = false`, and `document.elementFromPoint` at the line's own centre returns
   `div.game-card-paper`. `checkVisibility()` still says true (it does not account for an
   ancestor's clip), which is why a rect-based reading read as "painted". So a parked note is
   invisible either way, and the two crops photograph that rather than a per-kind split.
   This CHANGES AN ARGUMENT, not the design. G9b's case is no longer "8.63 px is not a message"
   but "a reply outlives the act it answered, and the reader comes back to find it still there".
   It also means a prop-less park predicate DOES exist after all — the note's rect against its
   clipping ancestor's — so §2.3's "no DOM predicate can tell you" is too strong. The prop is
   still the honest seam (a geometric intersection test is a coincidence of today's layout), but
   the spec should say that rather than claim impossibility. The owner sees this at the re-look.
2. **Gate 13 as worded cannot pass.** `grep -c "250ms" MarginNote.vue = 0` contradicts §1's own
   fallback law (`var(--motion-note, 250ms)`, byte-equal, so a missed publish is a no-op). The
   file has **0 bare duration literals** and **2 admitted fallbacks**; the gate is restated in
   the unit rows as "no literal outside a `var(--motion-*)` fallback, and every fallback equals
   its rung". Reported, not re-worded in silence.
3. **Gate 7 is weaker than it reads on this build.** `publishMotionRungs()` emits the ladder's
   reduce arm, so under PRM `--motion-*` is `0ms` and the leave computes to zero even if
   index.css's PRM block stopped naming `.margin-note-ink`. The live half can no longer
   distinguish the two worlds. The gate needs its static half — the PRM block still names the
   element — or MOT-LADDER's `:root` re-home has to own the claim outright.
4. **`parked` needs THREE forwards, not two.** The scene seam is App → GameShell → **BoardHost**
   → GameBoard; §2.3 names two files. The diff carries all three.
5. **The gold verdict has no painted witness.** The solve button did not complete a solve in
   either engine's run, and when it does the strip goes `is-quiet` (the vignette takes the
   voice), so a painted gold reading needs the vignette's own node. 4.85 light / 11.48 dark
   stand on token arithmetic, as §1 says. Not measured here.
6. **The refusal-vs-peer row is chromium-only live.** On webkit the probe's own sequence outran
   the 24-beat hold, so the reply had legitimately left before the row read it — a probe clock
   defect, and the unit row covers the claim. Re-cut the row to assert inside the hold.
7. **`MOTION.rungs` + `publishMotionRungs()` are §13's, landed here because §13 has not.** Six
   shipped rungs, no `rise` (that is MOT-LADDER's proposal and the dock is not this family's).
   If §13 lands its own publisher the agglomerator must take ONE, not both.
8. **The instrument whose subject moved**: R3-d. Ten rows re-run, every verdict equal to r0's
   (stands / retracted), with two rows now MECHANISM-changed and blind to it — the 30 s row
   stands AND settles, the digit row retracts over a rub-out. The proposed reader diff is
   `instruments/r3d-age.diff`; r0 is untouched. R3-g was not re-run (time), which is a gap.
9. **`e2e/filter-census.spec.ts` was not run** — the estate's e2e config starts a server on
   :3000, which this lane may not do. The source half is argued from the diff (no `forwards|both`
   is added anywhere); the dist half and the goldens are OWED at WGATE's rebuild.
10. **`hue-census`** (re-pointed copy, chromium): 24 site rows per pose, names identical to r0,
    `kin-arithmetic.json` byte-identical (sha256 `7313566644ca`), zero new chromatic tokens. Two
    rows differ and neither is a token: the violet fill-meter trace was caught mid-sweep at the
    `mid` and `hover` poses (`rgb(139, 92, 246)`, present in mine, absent in r0's sample), which
    also accounts for the 0.0016 pp chromatic-share drift. WebKit was not run — a gap.
11. **The repeat's deferral is a second timer**, owned honestly: bounded at `whisper + 17 ms`,
    cancellable, seq-guarded, cleared by every writer and on unmount. The refusal hold is the one
    CLOCK. The count is two timers in GameBoard and one in MarginNote (the settle).
12. **125 remains the family's number for the rub-out** and `whisper` 150 is CONSUMED because a
    literal is not a rung. The measured frame bars at 150 are 18/18 chromium and 8/9 webkit, and
    the build clears all four. The declared replacement latency is +150 ms, restated.
13. **A trap this lane walked into and cured**: the first cut of the unit rows read the component
    with `node:fs`, which vitest runs happily and `vue-tsc -b` rejects (`src/**` is typechecked by
    the browser tsconfig, no node types — the trap `check-ink-pressure.mjs`'s own head names).
    The rows read `./MarginNote.vue?raw` now; `vue-tsc -b --force` is clean.
14. **And then the hard part**: nothing here proves an AT reads the hole. `[X, "", X]` at
    mutation time is what a headless run can say; whether NVDA or VoiceOver announces the second
    identical utterance across a real empty is the device row (M19), and SC 2.2.1's defence
    leans on it.
