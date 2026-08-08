# T8 — the marks tranche · WGATE close record

DRAFT — seals at the end of this file; every § below states its own evidence.

## §1 · What this tranche was

Twenty owner marks (M1–M14, M16–M20; **M15 was never issued** — the numbering is the
owner's, kept verbatim), executed as seven waves plus chair work:

- **W1 chrome cures** (M2/M3/M4/M8) — `dee8d97d`
- **W2 interaction cures** (M5/M7/M9/M10) — `dee8d97d`+`9ef3fd23`
- **W6 the copy purge** (M16) — `d152a6a9`, the `lint:copy` gate standing in CI
- **W4 the logo class** (M6) — `d5655d9b`, the capture band [0.99, 1.5] gated
- **W3 the deep design pair** (M1/M11/M12/M13/M14) — design `beb251ba`, lanes
  `bfab089b` (A · substrate) / `f83536b0` (C · language) / `1802da4e` (B · deck)
- **W5 the bench** (the owner's bench ask + M19) — `f1aafba0`, residue generation r13
- **W7 alignment** (M17/M18) — `bde64fb7`
- **Chair** — M20 (`eb0ff0d9`), the wordmark-clip adjudication (same commit), the
  red-lanes cure + M19 remnant (`4c6ea788`), cursor-send wiring (in `f83536b0`)

The two owner ballots raised mid-design were resolved by the owner's word: **Option A**
(the table follows a switch) and **the table follows + slug/session preserved** (rejoin as
the same author on return). Both are implemented in Lane A's substrate and gated
(`session-substrate.spec.ts`, born-RED ×4 at `e296915a`) — dispositioned as T8-R01.

## §2 · The commit chain (this wave of work)

`e296915a` → `f1aafba0` (W5 bench) → `bfab089b` (W3-A) → `f83536b0` (W3-C + chair wiring)
→ `bde64fb7` (W7-G2 + A's App bindings) → `1802da4e` (W3-B) → `eb0ff0d9` (M20 + clip
adjudication) → `8d9139c2` (M20 control poll + whole-tree battery) → `4c6ea788` (red lanes
cured). Earlier waves: `1bac685a` (formation) → `dee8d97d` → `9ef3fd23` → `d152a6a9` →
`d5655d9b` → `beb251ba`.

## §3 · The gates at close

Whole-tree battery at `8d9139c2`/`4c6ea788`, quiet box:

| gate | result |
|---|---|
| vue-tsc · eslint | clean |
| unit | 547/547, 51 files |
| lint:sleep / motion / copy / lanes / boundary / ink / catch | all OK (29 specs declared) |
| e2e default, both engines | 401 passed / 0 failed / 2 skipped |
| goldens vs built dist | 4/4 unmoved |
| doc-truth | 0 RED / 32 GREEN (self-test 49/49 both colours) |
| evidence-policy | PASS |
| npm audit | 0 vulnerabilities (undici ^7.29.0 override; wrangler stays 4.116.0) — **all 5 dependabot alerts (1 high, 4 moderate) CLOSED, confirmed via `gh api …/dependabot/alerts` = []** |
| ledger gate | GREEN exit 0 — 14 audited rows satisfied, 8 open rows current, all five arms |
| CI at `bdd155d3` | **SUCCESS — run 30957293328, sixteen lanes** (the `4c6ea788` run red its ledger step for the then-missing row set; cured same day) |
| CI at `84b14789` (the cure slice) | **SUCCESS — run 31196882228, sixteen lanes, first attempt** |

## §4 · The ladder (U-10 — RATIFIED whole on the owner's word, 2026-08-07: §9.1; every
row below reads as the position AT the seal)

| mark | position | where the cure lives |
|---|---|---|
| M1 hover attribution + ghost cursors | cured-pending-re-look | C: tape + aria suffix, ghost tier 4; A: `cur` wire; chair: cursor-send at GameBoard's focus seams |
| M2 divider above deal | cured-pending-re-look | W1 `--ink-press-rule` |
| M3 superfluous text pruned | cured-pending-re-look | W1 census + cures; M16 re-graded every survivor |
| M4 staging-band language | cured-pending-re-look | W1 band rebuild (the 0.67px WebKit wrap died) |
| M5 consistent hover boil | cured-pending-re-look | W2-C census + invariant |
| M6 logo low-res | cured-pending-re-look | W4: the vueuse SVG lens class killed; band [0.99, 1.5] counted, 0 outside |
| M7 Esc + transition jitter | cured-pending-re-look | W2: Esc window-owned; 3 measured mechanisms dissolved |
| M8 controls reflow | cured-pending-re-look | W1 fixed 544×112 footprint ×5 games |
| M9 dark-toggle storybook | cured-pending-re-look | W2-C git archaeology, the old definition re-used |
| M10 flank click-to-warp | cured-pending-re-look | W2-B |
| M11 more than two games | cured-pending-re-look | B: 3 slots, 5 at ≥113rem, edge 0, graded depth |
| M12 live true-state previews | cured-pending-re-look | B previews + A `previewFor`/`flushSave`; persistence across switches |
| M13 multiplayer × gallery edges | cured-pending-re-look | the apotheosis 26-row matrix; A's session-is-the-table + FOLLOW (both owner rulings in) |
| M14 join/leave animation | cured-pending-re-look | C: join ring (seed 91, filterless), roster fold, J/L/R beats, PRM forms |
| M16 the copy law | ENFORCED, STANDING | W6 purge + `lint:copy` in CI; permanent law |
| M17 masthead line | cured-pending-re-look | G2 `--head-rule`; badge/toggle 12.00/12.00 every desk rung |
| M18 title↔board rhythm | cured-pending-re-look | G2: kenken 96–112px dead paper → 0.00; left line 0.00 |
| M19 Safari puppeting | LAW EXECUTED, STANDING | frontmost machinery deleted; quiet driver (W3C-direct safaridriver, never focused); last remnants stripped at `4c6ea788` |
| M20 wordmark floats on board | cured-pending-re-look | chair: dock height- AND aspect-scoped (≤500px, ≥2/1) + page-edge anchor + centre arithmetic + fallback band clearance (§6.2); gated §M20 7-pose battery both engines |

Adjudicated, not a defect: **the wordmark first-frames "clip"** (G2's hand-off) — four
scenarios × two engines × per-frame counting, zero frames of ink past the box; what the eye
catches is the authored 1.2s reveal wipe on cold mount
(`evidence/chair-wordmark-clip/report.md`). Whether the wipe stays is the owner's call.

## §5 · The bench (W5 + the r13 residue)

The r-series (D3, pinned snapshot `index-C9b17OTx4t72.js`): iOS sim boil × multiplayer
**15/15 PASS** at 101.49–102.84% of ceiling, long33 = 0 in all fifteen — multiplayer moves
fps by <0.6 across solo → present → traffic. Desktop Safari rows PASS via the quiet driver.
Solve family tabled ungraded; one unpriced cost flagged: sudoku 16×16 MEDIUM **generation**
684ms median (solve 55ms).

The r13 generation (T8-R10; this close, against the deploy candidate
`index-jt51RN8od5PV.js`) — EXECUTED, `evidence/w5-bench/README.md` §9.2: the suspect sim
cell re-measured PASS (102.33%, long33 0); the cold arm priced (worker init 12–21ms,
a cold 16×16 cell whole in 281ms); the chromium footnote run (relative shape agrees);
**the wire re-run cleared the drift note — Lane A's rewritten wire prices the same,
101.46–102.77% of ceiling, long33 0 in all twelve cells, multiplayer still free**; and
the top-size HARD cells measured to their timeout: **thermo and killer 16×16 HARD
generation exceed the 25s probe leash on real desktop Safari**, widening T8-R05 to a
three-game class (sudoku's r-series timeout was the first sighting).

## §6 · Deploy + the live visual pass

**DEPLOYED 2026-08-04** behind the full CH-57 chain: `ci-conclusion.sh` minted the
artifact off run 30957293328 (`bdd155d3` → success, runs_for_sha 1, attempt 1), and
`npm run deploy -- --conclusion-file` shipped it. **Production: CF Pages deployment
`672ecc10` — sudoku.babb.dev serves `index-jt51RN8od5PV.js`, byte-matched to the local
dist the whole battery and the r13 bench measured.** The relay Worker is untouched by T8
(`web/relay/` byte-identical; the r13w cells exercised it live).

The visual pass: six lanes against the live edge, both engines — head/rhythm
(M17/M18/M2/M4/M8), the deck (M11/M12/M10/M7), M20 + landscape regimes, a two-context
multiplayer session on the live relay (M1/M13/M14), logo + toggle (M6/M9), and the copy
census (M16/M3). Results below.

**REDEPLOYED 2026-08-07 with the cure slice** behind the same chain: `ci-conclusion.sh`
off run 31196882228 (`84b14789` → success, runs_for_sha 1, attempt 1), `npm run deploy
-- --conclusion-file`. **Production: CF Pages deployment `1dc79dd5` — sudoku.babb.dev
serves `index-aoGylP0lRSww.js`, dist-identity-verified; the served entry carries zero
"CSP Solver" and zero rendered "debug ·" (the one "debug" hit is the `sudoku-debug`
console-instrumentation flag); the served `fraunces-subset` is byte-identical to the
re-cut at 14,636 B; both unfurl descriptions carry the mandated sentence.** The
targeted live re-verify of the cured rows is §6.3.

### §6.1 · The pass results (2026-08-04, six lanes × two engines)

Every lane opened with the entry-identity gate and every load of all six lanes read
`index-jt51RN8od5PV.js` off the live wire. Tallies, then the two verdict classes that
matter:

| lane | PASS | FAIL | NOTE |
|---|---|---|---|
| head-rhythm (M17/M18/M2/M4/M8) | 6 | 0 | 2 |
| logo + toggle (M6/M9) | 10 | 0 | 4 |
| the deck (M11/M12/M10/M7) | 8 | 0 | 4 |
| multiplayer, live relay (M1/M13/M14) | 9 | 0 | 3 |
| M20 + landscape regimes | 10 | 2 | 4 |
| copy census (M16/M3) | 5 | 5 | 6 |

**The passes that close hardest**: M17/M18 measured 0.00 spread live (badge and toggle
top 12.00 both engines, board-rule seam 0.00 in all five games including kenken's
overhanging card); M6 wordmark crops pixel-identical across a gallery round trip
(gradient-energy delta 0.00% chromium, −0.67% webkit — pose-slot grain), pose ratio
1.000/1.001 inside the [0.99, 1.5] band throughout; M9's toggle is the authored
24-animation storybook beat on both engines with true mid-wash frames rastered; the deck
seats 3 of 5 slots at 1280 and all five at 1900, flank click warps without selecting, Esc
is a true cancel, and M12's card faces carried three live-typed digits at their exact
cells; the multiplayer nine — join ring in the joiner's own ink (1182ms measured against
the 1180ms spec), roster write-in, ghost cursor at 55ms, attribution tape, follow-switch,
leave retreat, rejoin-as-same-author — all PASS on the production relay, two contexts,
both engines.

**The FAIL set (seven rows, the cure slice of §6.2)**:

1. **M20 · the dock float is a CLASS, not two poses** — every landscape phone taller than
   390 puts wordmark ink on the grid (932×430: 11.67px past grid-left; 926×428: 10.67;
   896×414: 3.67; 844×430: 11.67 — the docked box is a fixed ~155.7px while the gutter
   shrinks as the board grows with height), and 900×500 (one px under the height gate,
   aspect 1.80) reproduced the owner's original float verbatim, 46.67px inside the grid.
   Only 844×390 cleared. Two adjunct NOTEs from the same lane: the dock centre sat 14px
   low (`50dvh` resolves against `.board-group`, whose top is y16), and the passing pose's
   box already exceeded its gutter by 0.66px — the same surplus that walks onto cells as
   width grows.
2. **M16 · tab title** — "sudoku · CSP Solver" ×5 routes, in `document.title` and
   statically in `index.html`: the solver's own acronym, the first copy served.
3. **M16 · "debug · off"** in the attribution card — developer vocabulary inked at
   opacity 1.00, reachable by hover and (webkit) by keyboard focus.
4. **M3 · "copied!" twice** — washi label and icon sublabel, same instant, 75px apart on
   one control; the aria says a third wording ("Link copied").
5. **M3 · the denied fragment** — sublabel "in address bar" is a subjectless substring of
   the washi sentence stacked directly above it.
6. **M3 · the alone-line** — "you're the only one on this board." restates the one-row
   roster 27px above it; also the product's only inked terminal period.
7. *(counted in row 1's lane)* — the second M20 FAIL row is the 900×500 pose, split from
   the phone class by the lane because its mechanism differs (height gate, not gutter).

**The NOTE inventory carried forward**: the guard ribbon's "your marks aren't saved" is
false live (leave-and-return restored the board byte-identical, both engines — the deck
itself says "in progress"/"resume" over the same state); "difficulty" (controls drawer)
vs "level" (staging band) name one axis two ways; the deck's true-still preview draws a
peer's digit in the LOCAL ink while the board renders it correctly (booked T8-R13); the
aria register splits from the ink register (Title Case declaratives over lowercase terse
— sharpest: the fill button ships two wordings of its own helper); og/twitter
descriptions carry "constraint puzzles" and "permalink"; "the solver finishes the board"
keeps the machine's name in-app (logged for adjudication); the CSP-blocked
cloudflareinsights beacon is the sole console error on the live edge (the edge injects
it, script-src refuses it — ours by CSP design, not a defect); the join beat is silent by
design inside the 1200ms boot window and the 4000ms per-id min-gap (T8-R07's family,
recorded so an auditor doesn't read either as a broken beat); at 844×390 the grid clears
the fold by 12px but `.board-shell`'s reserved status line hangs 19.19px below it; boot
deals are nondeterministic across loads (EASY/MEDIUM/HARD) with the URL and card subline
always agreeing — honest, just unfixed; two coverage gaps stated rather than guessed
(the filter tuner's copy never surfaced live; second-player copy audited only through
the multiplayer lane's own strings).

### §6.2 · The cure slice (2026-08-05: every FAIL row cured, both carried NOTEs cured, two rows booked)

**M20, the class cure (FAIL rows 1 + 7 and both adjunct NOTEs).** Three moves where the
first cure had one: the dock's media key gains an aspect gate (`min-aspect-ratio: 2/1` —
900×500 at 1.80 falls to flow, where the owner's float lived); `.board-group` takes
`width: 100%` inside the dock block, anchoring `left: 0` to the PAGE gutter instead of a
content-box gutter that shrinks as phones get taller — the mechanism behind the whole
932×430…844×430 class; and `top: calc(50dvh - 1rem)` retires the 14px-low centring
arithmetic (the containing block's own y16). Scale stays the ratified 0.38 (a 0.34
experiment still box-overlapped 8px at 932×430 — the gutter, not the scale, was the
disease). GameBoard's flow-band cap gains its second arm (short landscape under 2/1), in
`GameBoard.vue`'s own scoped style per §8's scene.css trap. Gated: `§M20` in
`masthead-alignment.spec.ts` is now a 7-pose battery (four flow poses with the
superseded-dock control polled in-run; three dock poses asserting centre <24px and
gutter clearance), 12/12 both engines; an empirical dock sweep at 9 poses × 2 engines
reads all-clear, the anchored box clearing the grid by ≥69px at every docked pose.

**The tab title (FAIL 2).** `document.title` is the bare game name; `index.html`'s
static title matches ("sudoku"), og/twitter titles follow, and the unfurl descriptions
take one plain sentence — "constraint puzzles" and "permalink" are gone from the head.

**The debug row (FAIL 3).** Out of the shipped bundle, not merely unrendered: the
prescribed `v-if="import.meta.env.DEV"` seam did NOT fold (the SFC compiler emits
`unref(DEV)` for a setup const, and the string stayed in dist — caught by grep, the
lane's own dist-probe). The row moved to `src/pencil/dev/DebugToggle.vue` behind an
`import.meta.env.DEV ? defineAsyncComponent(…) : null` ternary — the seam App.vue's
FilterTuner already proves — so the chunk is never emitted: a production build carries
zero `debug ·`, the dev server still renders, toggles, and persists `sudoku-debug`.
`mobile-affordances.spec.ts` branches by surface (it runs the dev server, where the row
exists by design).

**The copy voice (FAILs 4 + 5).** `saysCoarse` in `GameControlPanel.vue`: the share
row's sublabel flips only where the washi tape can't speak — the phone card (mounts no
tape) and a coarse pointer in the ROW regime (mounts one it can never hover; the chair
widened the lane's `mobile`-only gate to `mobile || coarse` on the lane's own sighting —
the narrow gate would have left an iPad at desktop width with no drawn outcome at all).
Fine pointers keep the idle verb through every state; the tape alone says "copied!". The
coarse denied string is "couldn't copy" — the fragment died. Aria and washi stay
ungated. Three unit rows pin both arms, proven born-RED against the old line.

**The alone-line (FAIL 6).** Screen-reader-only via the estate's existing Tailwind
`sr-only` utility; element, text, and `aria-live="polite"` stay (the e2e text assertions
read textContent; the M13 a11y office holds), the roster's one row is the only visible
statement of the fact.

**The guard's false sentence (carried NOTE).** The solo-select arm of `attemptSelect`
is dead — a select arms the ribbon only on a shared table, because M12 persistence makes
the solo switch lossless (the live pass measured the round trip byte-identical). The
deal intent keeps its solo guard (a deal genuinely writes over marks).
`gallery-guard.spec.ts` row 3 now asserts both halves — no ribbon out, the typed digit
back on return — and row 4 arms via the deal key; the deck and a11y unit batteries
re-cut (the a11y fixtures moved to a shared table, where the select ribbon still arms).

**difficulty → level (carried NOTE).** The whole axis speaks one name now: the tally's
default label, `describeTally`'s aria strings ("level not graded yet", "level N of 5"),
AND the drawer eyebrow itself — the five game specs' staging heading "Difficulty" →
"Level" (the chair widened the lane here too; the eyebrow was the drawer surface the
NOTE actually named). `zone-grammar.spec.ts`'s rendered-name census follows.

**What the battery's own reds then taught (2026-08-05).** The first full e2e run over
the cured tree found two cure-adjacent families and one real defect the eyebrow cure had
just minted. (1) `a11y.spec.ts` 3.2's shared `armGuard` armed via the dead solo-select
path — re-cut to the deal intent (`d`), which keeps its solo guard; the ribbon's a11y
grammar is intent-independent, so all three rows kept their whole subject. (2) THE FONT
CENSUS CAUGHT A RANSOM NOTE: "Level" lowercases to "level", and neither L nor v had ever
been asked of the Fraunces subset ("Difficulty"/"Size" needed neither letter) — the v
painted in the Georgia fallback mid-word, four census rows red, both engines. The cure
is the estate's own recipe (upstream variable TTF, instancer SOFT=0 WONK=1, pyftsubset
both cases): `fraunces-subset.woff2` re-cut 28 → 30 codepoints (+L +v, nothing dropped,
axes intact), 13,788 → 14,636 B, the `unicode-range`, the coverage gate's corpus, and
the derived LICENSES/README figures (22,572 B total) all trued in the same breath —
`check-font-coverage.mjs` green, the census green, and the goldens 4/4 unmoved by the
new bytes. The gate's corpus was the stale half: it still listed "Difficulty", so the
checker passed while the app moved under it; the e2e census reads the RENDERED DOM,
which is why it alone caught the truth. (3) One webkit ring row red under 4-worker load,
green 3/3 serial — T8-R09's documented contention class, not a defect.

**Booked, not cured**: T8-R13 (the deck previews' peer-ink attribution) and T8-R14 (the
aria/ink register split, ballot, default ship-as-is). The og-description NOTE is cured
above; the boot-suppression and min-gap silences stand as T8-R07's family; the
cloudflareinsights beacon stays a NOTE (our CSP refusing the edge's injection is the
design working).

**The battery over the cured tree**: vue-tsc, eslint, prettier, all twelve lint gates
green (the one red was the dock cure's own hand-wrapped `@media`, reflowed); units
551/551; doc-truth 0 RED / 32 GREEN; evidence-policy PASS; ledger gate GREEN — 16
audited rows, 10 open; e2e counts re-derived from all three configs (403 + 4 + 67 = 474
in 29 files) and already true at the doc rows. Full e2e, the run of record (2026-08-05,
dev-serve wrapper on 127.0.0.1, both engines): **default 401 passed / 2 skipped / 0
failed** (the skips are the standing deleted-RTCPeerConnection relay row, one per
engine); built-dist config 67/67 against the fresh dist; goldens 4/4 unmoved;
`git status e2e/goldens/` empty. An earlier same-day run had five webkit reds under
4-worker load (join-language ×2, gallery drag, masthead M17 dark + one) — all green in
this run and 3/3 serial where re-run singly: T8-R09's class, recorded, not papered.

### §6.3 · The cure re-verify (2026-08-07, three lanes × two engines, live edge)

**45 PASS / 0 FAIL / 9 NOTE.** Entry gate green on all 16+ browser loads
(`index-aoGylP0lRSww.js` read back in-page every time; dpr 1, so shot px = CSS px).

**M20 (17 PASS)**: all eight poses, both engines, with ink-level proof — boxes first,
then a blanked-page pixel diff isolating the masthead's own ink. Flow poses (900×676,
1000×800, 900×500, 844×430): regime correct (the 2/1 floor holds 900×500 and 844×430 in
flow — the pre-cure 46.67px float pose now shows ink-to-grid clearance 21.58/21.98px,
overlap 0.00), seam 0.00, board within the fold with ~47px headroom. Dock poses
(844×390, 932×430, 926×428, 896×414): `position: absolute`, scale .38, the page-edge
anchor measured (`.board-group` = viewport−32 at every pose), centre delta ≤2px, gutter
clearance 69.3–78px, ink overlap 0.00 everywhere — the whole live-pass float class is
dead, including its 932×430 worst case. NOTEs: the flow cap's carrier is
`.board-shell` (as authored — the anchor is dock-only), `--logo-scale` resolves empty in
flow by construction, and "within the fold" means the board, not the page.

**Copy + font (22 PASS)**: tab titles bare on all five routes and in the static HTML;
the eyebrows read Size/Level and the "level" heading renders EVERY glyph in Fraunces —
the v included, per-glyph face probe both engines — with the staging band's own "level"
whole in Patrick Hand; the share button is one voice on a fine pointer (washi speaks,
sublabel holds "Share" through granted and denied paths); the alone-line is in the DOM,
polite, zero visible footprint, the roster's one row the only ink; the attribution card
carries no debug row in any state; the tally speaks "level not graded yet"/"level N of
5". NOTEs: the retired words survive only inside HTML comments (the sweep note that
names them; zero in any meta, title, visible text, or the 15 served chunks), and the
CSP-blocked beacon noise is confirmed permanent.

**The guard (6 PASS)**: a dirty solo select arms nothing on the live edge and the
switch commits; the marks return byte-level (the typed cell's value read back) through
the deck round trip; the solo deal ribbon arms with its exact strings ("deal over this
puzzle?" / "your marks aren't saved" / "deal") and keep retires it with the board
untouched; the pristine control stays free. NOTEs: the pristine control can no longer
discriminate (select is unguarded for dirty too — the deal arm is the discriminating
row now), and one NEW finding, booked T8-R15: **the armed ribbon is viewport-anchored,
not card-anchored** — at deck indices 0 and 4 (the track can't scroll edge cards to
centre) it lands 352px off the active card, covering a flank; index 0 is sudoku, the
default case. Pre-existing W3-B geometry, not minted by the cure slice.

## §7 · Residue + the owner's ballots (row ids → `DISPOSITIONS.md`)

- **T8-R02 · the mid-dusk ink dip** (~120ms, T3-W10-shipped) — default: ship as-is;
  ballot open.
- **T8-R03 · the cold-mount reveal wipe** (1.2s, reads as "sudok" mid-beat) — design
  ballot from the clip adjudication; shipped behavior is T3-era and unchanged.
- **T8-R04 · B's far tier at 0.58 dark** recedes hard against dark ground — owner's-eye
  item.
- **T8-R06 · B narrowed the FOLLOW ribbon** to peers ≥ 1 ("0 other players will follow"
  is a false sentence) — named deviation, adopted.
- **T8-R07 · C's boot suppression** silences the roster row's write-in as well as the
  ring — C's reading of "no trace"; rows still land. Adopted.
- **T8-R05 · sudoku 16×16 MEDIUM generation 684ms** — unpriced; banked with a trigger
  (pre-generation is the obvious lever).
- **T8-R08 · A's bounded leaks, named**: a follower whose game chunk never resolves leaks
  one `adopted` credit; a crashed tab's claim prunes at the 8-room bound. Banked.
- **T8-R11 · below 768 the badge has no gallery mount** (G2) — M17's gallery clause
  satisfied ≥768 only; a design call past the mark. Ballot.
- **T8-R09 · the e2e contention class** stands documented: rows red under multi-worker
  load, green serial — the M20 control now polls for exactly this reason. Closed.
- **T8-R12 · the M19 law's tranche execution** — closed at `4c6ea788`; the law itself is
  permanent.
- **T8-R13 · the deck previews draw peer digits in the local ink** (live pass 2026-08-04)
  — banked with the deck's preview reader; triggers on the next preview or ink-spine
  touch.
- **T8-R14 · the aria register splits from the ink register** — ballot; default: ship
  as-is (the fill button's doubled claim is the piece the owner may cure regardless).
- **T8-R15 · the armed ribbon is viewport-anchored** (re-verify 2026-08-07) — at deck
  edge indices it covers a flank card; banked with the deck; pre-existing W3-B geometry.

## §8 · Traps banked this close

- **scene.css is GameScene-SCOPED** — a selector for another component's element builds
  inert. The M20 cap landed there first and died silently; the born-RED gate caught it.
  Shell-geometry rules live in `GameBoard.vue`'s own scoped style.
- **`useElementSize` on an SVG reads the transform-inclusive rect** (W4's class) — the
  lens is `useLayoutBoxSize`; three surfaces migrated.
- **A one-shot read after `addStyleTag` can race the sheet under load** (webkit, 4
  workers) — poll, don't sample.
- **`npm audit fix --force` offered a wrangler DOWNGRADE** (4.116 → 4.35) as its "fix" —
  the override pin (`undici ^7.29.0`) cures without touching the deploy tool.

## §9 · The seal

**T8 CLOSES HERE (2026-08-07).** The chain, whole:

- **The tranche**: twenty marks executed across seven waves + chair work (§1), commit
  chain §2, whole-tree battery §3 — CI SUCCESS at `bdd155d3` (run 30957293328) and at
  the cure slice `84b14789` (run 31196882228, first attempt), sixteen lanes both times.
- **The live visual pass** (§6.1): six lanes × two engines against deployment
  `672ecc10` — 48 PASS / 7 FAIL / 23 NOTE.
- **The cure slice** (§6.2, commit `84b14789`): all seven FAIL rows and both carried
  NOTEs cured; the battery's own reds taught the armGuard re-cut and the Fraunces
  ransom-note re-cut; battery of record 551/551 units · 401/2/0 default e2e both
  engines · 67/67 built-dist · 4/4 goldens unmoved · doc-truth 0 RED / 32 GREEN ·
  evidence-policy PASS · ledger gate GREEN.
- **The redeploy** (§6): CH-57 chain intact — deployment `1dc79dd5`, sudoku.babb.dev
  serving `index-aoGylP0lRSww.js`, dist-identity- and served-bytes-verified.
- **The cure re-verify** (§6.3): three lanes × two engines on the live edge — 45 PASS /
  0 FAIL / 9 NOTE, ink-level proof at every M20 pose; one new row banked (T8-R15).
- **The row estate**: DISPOSITIONS 17 rows (CH-62 retired, CH-67 watch, T8-R01…R15),
  LEDGER §1 carries the eight open T8 survivors (R02/R03/R04/R11 ballots with firing
  defaults; R05/R08/R13/R15 banked with owners and triggers; R14 ballot), ledger gate
  GREEN across all five arms.
- **U-10 stands**: nothing in §4 closes past "cured-pending-re-look" until the owner's
  eyes pass over the ladder; the ballots dispatch with it. M16 and M19 are permanent
  law regardless.

The seal is this record's own commit (the first commit touching this §9); its sixteen-
lane CI conclusion follows on push and belongs to the seal commit's own run.
(Landed: seal `f1505c9c`, CI run 31198835757, sixteen lanes, SUCCESS.)

### §9.1 · Ratification (2026-08-07, the owner's word)

**RATIFIED.** The owner's word — "Ratify the above." — landed on the seal report
whole. What that word closes, stated exactly:

- **The §4 ladder**: all twenty marks move cured-pending-re-look → **RATIFIED-CLOSED**.
  This was a ratification of the presented report, not a per-mark visual walk; the
  record says so, and any mark re-opens on the owner's eye at any time (the owner's
  standing prerogative, not a row).
- **The five ballots fire their defaults**: T8-R02 (dusk dip ships), T8-R03 (the reveal
  wipe stays), T8-R04 (the far tier ships), T8-R11 (the badge stays desk-only), T8-R14
  (the aria register ships as-is). All five → TERMINAL-CLOSED on the fired default.
- **The banked rows stay banked**, exactly as presented: T8-R05 (top-size generation),
  T8-R08 (A's bounded leaks), T8-R13 (peer-ink previews), T8-R15 (the viewport-anchored
  ribbon). The owner's paired order — "Then continue." — is the owner ask that opens
  the R13 + R15 cure front immediately (T8.1); R05/R08 keep their named triggers.
- M16 and M19 remain permanent law; CH-67 remains a watch.
