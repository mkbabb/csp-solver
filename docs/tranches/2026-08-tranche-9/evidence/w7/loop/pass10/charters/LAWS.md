# PASS-11 LAWS · every T9-W7 lane (read before your charter)

These bind every pass-11 lane beside `pass11/CHAIR-RULINGS.md` (the twenty picks registry-v10 §8.0 owes),
`pass9/charters/LAWS.md` (P9 — stands whole; this file AMENDS it, it does not replace it; P8 stands whole under
P9, P7 under P8), `pass10/CHAIR-RULINGS.md` (twenty-three rulings, never re-argued), the earlier CHAIR-RULINGS
files, `pass10/registry-v10.md` §2 (the assembler's rulings) and §8.2. The marks **P10** are what pass 10 taught,
each an incident or a critic's proven hole by name (registry-v10 §7.2 and the four folds' notes). A lane that
disagrees carries the objection in its return, never in its diff.

## A · Base, control, worktree (P9 §A and P8 §A stand)
- Base and π control: `74a2b5d9`. Main is at `471aaa4c` + the pass-10 record (product = `1d0dc4fd`'s). The HEAD
  control is `.claude/worktrees/w7-control` (dist `index-CubiZsMVSwTc.js`, CSS 93,634 B), never git-touched. No
  `git commit`, `commit-tree`, `update-ref`, `stash` or `push` ANYWHERE — a scratch archive's own `.git`
  included; no `git status` on MAIN or in the control tree.
- **P10 · THE INTEGRATED TREES for pass 11 are the PASS-10 ones**: `74a2b5d9 + pass10/integrate/s10.diff`
  (e18599b7), `+ s13-s7-s3.diff` (74435547) and THE WAVE UNION `+ WAVE.diff` (561a337a, 189 files; its
  companions check 0 on 8c46d9de, 954bbbab, d77fcfc4 and afd594a1). Every lane's delta `git apply --check`s 0 on
  `74a2b5d9`, on its section's integrated tree AND on `561a337a`, and cuts its `pass11.delta.on-WAVE.diff`
  against the WAVE + homes v4's on-WAVE copy, declaring its base in BANKED.txt (P9 §A).
- **P10 · A COMMIT IN A SCRATCH ARCHIVE'S OWN `.git` IS THE SAME BREACH** (LEDGER's critic committed once in
  its first archive, trashed and re-inited; TAB-PEN's critic in two; ERASE's `mk-copy.sh` carried a `git commit`
  until it was stripped before first run): P8 §A's "anywhere" includes every `git init`-ed scratch. A write-tree
  is the only snapshot; a bank's replay prints `write-tree`, never a commit id.
- **P10 · NO SCRATCH SYMLINK IN A DECLARED TREE** (TIN's BANKED.txt base 9528a8ec = 72b7ad67 + a scratch
  `node_modules` symlink: the declared base did not exist on any lawful route): a declared base is a write-tree
  of product paths only; a `node_modules` link is created outside the tree or excluded by a temporary index, and
  BANKED.txt's base is re-derivable by a non-author from the banks alone.
- **P10 · AN INDEX-ONLY APPLY IS VERIFIED BY `ls`/`cmp`, NEVER BY ITS EXIT** (WALK/TIN's critic: `git apply
  --3way` in an index-only git-init scratch exits 0 writing nothing to the work tree): every apply line prints
  the path count AND one `cmp` of a touched file against the expected blob.
- **P10 · A BATTERY NEVER MOVES THE TREE'S GATE IN PLACE** (WALK's tree left PLANTED mid-battery: check-peer-arcs.mjs
  at blob 20f59248, line 213 'worst: [0.0144, 0.0123]'; the lawful gate was only the critic's 5593927d): a plant
  is a copy under the lane's scratch; the tree's own bytes are never the plant, and a lane's tree at return equals
  its bank by `write-tree`.
- **P10 · A BANKED.txt CARRIES THE LITERAL `GIT_CEILING_DIRECTORIES` LINE OR THE `git init` LINE** (FACE's lacked
  it; the §10 fold re-derived the apply in its own archives): P9 §A's print is a line a grep can find.

## B · Servers and the box (P9 §B and P8 §B stand)
- **P10 · THE ZONE IS READ BEFORE EVERY BROWSER ROW AND PRINTED BESIDE IT** (the leak ARMED again mid-pass:
  LIVE, TIN, WALK, TAB-PEN and s13 sat at 8.0–8.9M and read no browser row; LADDER's WebKit rows ran under
  ZONE-ARMED at 3.0–3.8M): `tail -1 ~/.claude/guard/log/zone.log` before the row; at ≥ 8M no row opens, the
  rest is declared UNREAD by name and engine with the inuse seen, and the return says "the owner must reboot".
- **P10 · THE WEBKIT LOCK IS A PLAIN FLOCK, NOT A QUEUE** (the WAVE's holds waited 20–75 min each; one 75-min
  wait was stopped to run two short chromium follow-ups and re-queued with no place lost): a WebKit hold is one
  guarded call per PROJECT (the law's other grain), inside the 90-min clamp, launched in the background and
  polled every ~60 s; a lane never holds two of its own; the wait is declared with its clock.
- **P10 · A SERVER HELPER REDIRECTS ITS WHOLE SUBSHELL** (the WAVE's `srv()`: a backgrounded `cd && npx &`
  list kept the `$(…)` pipe open and the control server never started; a 21-min hold hung before any row):
  every server launch is `exec`'d or wholly redirected, and a hold prints its first row within 5 min or stops
  itself by PID.
- **P10 · THE SERVED IDENTITY IS ASSERTED IN-RUN, OR THE READ IS VOID** (the WAVE's first band read served the
  TREE dist on :4257 — npx's vite child outlived its kill and the arm server lost strictPort; the read was
  voided, never a verdict): every probe asserts the dist identity and served CSS bytes from the served HTML, in
  the same run, before its first number.
- **P10 · A HELPER'S HANG IS NOT A BUDGET'S CLASS** (SELF's `:571` dead on its keyed 240 s budget: invite()'s
  drawer race at 360×800, not the cell count): P9 §B's load-sized budget cures a load stall; a row that dies
  on a helper race is a red of the helper, declared as such, never re-budgeted.
- **P10 · A LIGHT RUN IS ONE AT A TIME, INSIDE THE GUARD** (TAB-PEN's duplicate overlapping light run, two
  light runs at once and one foreground run past 115 s; ERASE's nohup-detached launches and light commands
  outside the guard; the WAVE's two prettier reads outside it; LEDGER's unit chunks under `--light`): a vitest
  chunk is heavy; a `--light` call is a typecheck, a lint or a single unit file; nothing is detached.
- **P10 · A DEV-ONLY ROW CARRIES ITS SKIP IN THE SPEC** (s13's front-rate :424/:479/:550 read RED on the dist
  both engines a second pass with no serving-keyed SKIP): P9 §B's label is a `test.skip` keyed on the serving,
  shipped by the row's owner (FIVE), and the preview column reads SKIP.

## C · The record (P9 §C and P8 §C stand)
- Frozen: `loop/r0/`, `pass1/`…`pass10/`. Pass-11 evidence lands ONLY under `evidence/w7/loop/pass11/<stage>/<familyId>/`.
- **P10 · THE HEADROOM, RE-DERIVED**: on disk at the v10 fold the wave is 1,997,779 B (103 png): headroom
  **99,373 B**. The sweep did not fire (p9-f1 struck, not re-shot faithful; the pass-6 retiree stays); if the chair
  deletes the struck p9-f1 by name the wave reads 1,989,132 B. Re-derived from `find`/`stat` at every fold.
- **P10 · A CAPTION WITHOUT THE SERVED CSS BYTES FIRES NO SWEEP** (FACE's p10-f1 3,325 B: chromium-only,
  light-only, no CSS bytes, the 'SIZE' heading cut mid-glyph; named as retiring p9-f1 but not a lawful pair): a
  crop that retires another names its dist identity, served CSS bytes, engine and theme in its caption AND its
  filename, or it retires nothing and is itself struck at the next fold.
- **P10 · A STRIKE OF A PASS-N CURE IS DECLARED WITH ITS A/B** (FACE's undeclared strike of pass 9's `+ 5px`
  in scene.css re-opened Off/Ask/Live d1.75 < 1.80 at 390×844@3 both engines, plus5 5/20 vs null 8/20; the
  integrated trees carry TAPE's calc, OURS): a lane that reverts a prior pass's cure names the cure, its pass,
  and the A/B reading in both engines in its return and its BANKED.txt.
- **P10 · 'CURED ON BOTH TREES' IS READ ON BOTH** (GRAPHITE's H1 hygiene claimed cured on both, cured on one:
  gameCell.css 'small raster takes 12' vs shipped 13 on the union): a claim over two trees carries two readings.
- **P10 · A README NAMES THE BANK ON DISK** (LEDGER's README §4 cited a superseded bank 52e3e45b / fc93e446
  against disk 86ad0272 / 39ccf2ba; ERASE banked two different finals; COUNT's return misstated filesTouched):
  the README's bank line is copied from BANKED.txt after the last cut, and a return's file list equals it.
- **P10 · A RECORD PATH IN A FOLD'S NOTES IS DECLARED** (the §11 fold's notes name its own git-init scratch,
  the one `.claude/t9-scratch` hit in registry-v10.core.json): a bank greps 0; a record that must name a scratch
  path names it once with the word "scratch" and the fold's incident row carries it.

## D · Paint, post-paint, and what a reading is (P9 §D and P8 §D stand)
- **P10 · A FENCE HOLDS OVER THE WHOLE CLOCK; `-leave-to` IS THE CLASS'S OTHER HALF** (ERASE's row 1 a fourth
  pass: stopTheClock reads playState/timeline ONCE at @leave; `.note-leave-to { animation-play-state: paused
  !important }` holds the sentence 156–168 ms chromium / 195–206 ms WebKit, `animation-timeline: none` and a
  running verb animating nothing the same, 12/12 RED per engine): P9 §D's present-not-running fence is amended
  — the fence pins `animation-play-state: running` and `animation-timeline: auto` inline `!important` or re-reads
  every frame of the leave, and the three siblings are in the drop-clock row's in-run set on both leaves.
- **P10 · A TIME SLACK EQUAL TO THE ENGINE'S STAMP QUANTUM IS A COIN FLIP** (FIVE's dt−1 under WebKit's driven
  30 Hz clock: D10-partial30 RED 4/4, 34 ms frames travel 33.0, shortfall 1.000): P9 §F's decorative-time law is
  amended per engine — a healthy-travel slack is wider than the engine's stamp quantum or keyed on the engine's
  grain, printed per engine.
- **P10 · A PER-TWEEN FLAG OVER A PAGE-GLOBAL WINDOW IS A PER-PLANT CURE** (FIVE's remainder guard: crit.remainder
  SOLO and TWO TWEENS RED on f67c70ee and b4596539, travel 17.0 ×13, end frame 16 vs 11; the negative GREEN
  in-run): a window statistic's exclusion is keyed on the window it reads; the by-sha ride of such a primitive
  carries the critic's class row to every consumer (registry-v10 §2.4, watch 6).
- **P10 · THE WINDOW STATE IS PINNED AND PRINTED** (D10-partial30's warm 8–9 frames vs cold 17 ×4 after the
  1,500 ms warm-up): any row importing a tick window after a fixed warm-up prints `ticks.length` and the minimum
  at arm start, through the ONE library's probe.
- **P10 · A DROPPED REST RESULT IS A SILENT BOUNDED SETTLE** (SIX's atRest `{ms, residual}` dropped at :325 — a
  ≤ 6 s settle lint:sleep cannot see): a rest probe's result is asserted or the row names it decorative; the
  library ships the asserting variant.
- **P10 · A FITTED DEVICE-PIXEL CUT IS READ ACROSS ITS SPAN AT 1 DPX, NEVER ONLY AT ITS RULED RIGS** (GRAPHITE's
  band 8/8 at the ruled rigs on the WAVE while product reds at 372/375/377 dpx both engines; the cut
  SMALL_RASTER_DPX = 375 itself RED; pick 17's caption claim FALSE): a cut's ±ε cells are device-pixel cells on
  both sides of the cut in both engines, and a width-only coarse-rig sweep is the form of its row.
- **P10 · A RESERVE READ KEYS THE PAINTED LINE BOX; A REST WINDOW HAS A FIXED FLOOR; AN ARRIVAL KEY IS THE
  DEAL'S BOUNDED IDENTITY** (LEDGER's G4: 7/13 siblings lint:ink 0 while five paint +8 to +23 px; G5: REST=SPOKEN
  closes on the strip's own rest while the tail moves 6–12 px; G3: the givens' CELL SET with unbounded lifetime,
  g10x RED on the bank and the union, GREEN on pass 9): P9 §D's whole-window law is amended — the window's floor
  is a literal, the reserve reads the painted line box, the arrival key is bounded to the deal.
- **P10 · A WEBKIT FONT LANDING KEYS `fonts.ready`, NEVER `loadingdone`** (PLACE's 15f a shipped PRODUCT red in
  WebKit: 0 loadingdone events for CSS-driven face loads, refont 0 runs though FontFace.status 'loaded', n=2):
  a document-event re-fit keys `FontFace.loaded` / `document.fonts.ready` and is read in WebKit.
- **P10 · A REWRITTEN COUNT IS RE-READ WITH THE CENSUS'S PLANTS** (TIN's wash reach 6 → 3 moved useSession's
  key into check-theme-tokens' Q2 blind shape: Q1 3 / Q2 0 / Q3 10): a census number that falls by a rewrite is
  re-read with the census's own disjunct plants, or the fall is a dodge.

## E · Constraints on every design (P9 §E and P8 §E stand)
- **P10 · A BOUND MULTIPLIED BY THE SUBJECT'S OWN BOX IS SELF-CITATION MOVED ONE READ OUTWARD** (RULE's M18:
  `q.thick >= RULE_FLOOR * d.scale`, scale = svg box height / viewBox height; SQ87 (5 px → 4.35 px) passes 4/4
  M18 cells both engines, SQ55 2.75 px passes on a 1.80 css rule): P9 §E's pinned-reference law is amended — a
  weight floor is ABSOLUTE css, never scaled by the subject's geometry; squash plants sit beside width plants.
- **P10 · THE `all` SHORTHAND BELONGS IN EVERY CSS-WIDE-KEYWORD CONSUMER** (FACE's CHECK 7: `all: initial`,
  `all: revert`, `@layer base { all: revert-layer }` each exit 0; the KW arm reads font/font-family only): a
  font-voice gate that reads css-wide keywords reads `all` too, through the ONE library's consumer.
- **P10 · A DISJUNCT KEYED ON THE READING IT GATES IS A MASKED FALLBACK** (SIX's LIFE picks its union branch
  from the observed record; norec reads 2/2 GREEN through the THREE branch): a disjunct keys on a pinned payload
  property, never on the measurement.
- **P10 · AN EXEMPT ROW CITES, AND THE CITE IS GATED; EVERY GATE READING THE SITE CARRIES THE EXEMPT**
  (SELF's B-INK-RUNG: b2Closed validates the 400 ms, never its why; LADDER's lint:bands B6 reds the same site on
  the union, the ONE union-born row): an EXEMPT clause names its ballot and its cite in the roster the §13 gate
  reads, and a gate that reads the site without the roster is over-red by design.
- **P10 · A FITTED CONSTANT'S THRESHOLD BATTERY COVERS EVERY CONSTANT** (TIN's SPREAD 40: self-test exit 0 at
  30/40/50; FIVE's 11, 33.333−1e-6, 17, 18, 0.92/0.95, 0.92/0.97, dt−1 absent from registry §9; LIVE's INK_TOL 48
  and G17_COVER_CAP 12 with no ±ε): P9 §E's ballot law is amended — the battery lists each constant with its
  ±ε pair, and a constant absent from the list is a refused return.
- **P10 · THE RE-FIT CLASS IS ENUMERATED FROM THE PRODUCT, NOT FROM THE CODE THE LANE WROTE** (PLACE's C1:
  useControlsDrawer.ts's WAAPI board mover, visualViewport-only and scroll unplanted; C3: FACE_CELL 390×1050
  fitted from one chromium sweep): P9 §F's every-path law is amended — the path list is grepped from the product
  (every writer of the subject's box) and each member planted, in both engines.
- **P10 · A SHAPE-ONLY ADMISSION OWES A BEAT-BOUNDED COUNT AND A CAUSE PLANT** (PLACE's row 4: every class
  record on g.pt-pose admitted by shape; __boil 92 never bounded — a masking-ledger shape): a union
  mutation-quiet row bounds the admitted count per beat and plants the cause.

## F · Gates (P9 §F and P8 §F stand)
- **P10 · AN ADMITTED LIST KEYED BY CONTENT WITH NO STALE ARM CANNOT RED A DELETION** (TAPE's clause 12: a
  roster entry missing from the tree never reds; D4–D9 GREEN 6/9; the WAVE's admitted `.action-bar{grid-template-
  columns:1fr}` re-planted on the tree GREEN): P9 §F's admitted-list inversion is amended — the roster is
  file+line keyed AND carries a stale arm that reds an entry the tree no longer holds.
- **P10 · AN 11b-CLASS GATE READS THE BOUND REF'S WRITERS** (TAPE's row 3: `footBerth.value = … && false`
  reads check-tape-foot 0 on lane, s10 and WAVE while the verbs paint at 1,367–1,424 px under a 900 px
  viewport): P9 §F's evaluate law is amended — a template-constant gate evaluates every writer of the bound ref,
  not the template spelling alone.
- **P10 · THE SUBJECT VERDICT IS REPORTED APART FROM SABOTAGE COLLATERAL** (RULE's zone-grammar spec reds only
  by its own sabotage self-check while the subject assertion passes SQ87 4/4): a spec that carries its battery
  prints the subject row's verdict on its own line; a red born of collateral is not the subject's red.
- **P10 · A HEAD-KEYED ADMISSION IS A WRITE-ESCAPE CLASS** (TIN's gate 4 CONSUMER_HEAD keyed on preceding
  text: V1/V2/V4/V5/V6 writes exit 0; the `.getAll(`/`.has(` disjuncts with no plant and no consumer admit V6):
  an admission keys on the token's USE, and a disjunct with no consumer is struck.
- **P10 · CSS `<time>` IS PARSED BY GRAMMAR; SCRIPT TIMES ARE EVALUATED; SCRIPT-BORNE CLASSES ARE IN THE
  UNIVERSE; THE EFFECTIVE CLOCK IS WHOLE** (LADDER's 29 fresh plants, 14 pass every CI gate, five painted
  shorter both engines: `150MS`, `-.2s`, `.15s` read as 15,000 ms, `1.5e2ms` as 2 ms; "50MS", "5e1ms", a NUMBER
  into a rostered `${…}ms` hole; `.sudoku-cell` via a computed familyClass; `animation-iteration-count: 0.5`
  active 150 ms with every gate 0; a NEW keyframes name on a banked element): P9 §F's component-tree universe is
  amended by these four clauses, each with its plant.
- **P10 · A PAINTED TWIN READS PSEUDO CONTENT RESOLVED AND MATCHES THE COPY WORD** (COUNT's plus twin, third
  pass: PLUSCTR counter() content and PLUSNOSP margin-spaced `<i>` painted GREEN both engines): a twin for a
  glyph reads `getComputedStyle(::before).content` resolved and the painted word, not the source spelling.
- **P10 · A STRADDLE WITNESS IS PER LINE** (COUNT's pick 17: per CELL, light-2/dark-2 vacuous near the bound): a
  bound that a ladder straddles is asserted on every straddling line.
- **P10 · A RASTER TIE PLANTS A BAND-ONLY, PROJECTION-PRESERVING DEFECT; A LITERAL INSIDE A CLAUSE IS A
  NUMERIC BOUND** (TAB-PEN's row 1 re-opened by species: max dE read off the dilated support and the eroded
  core, the 2,421-px near\core band read by a chroma-blind coverage under a 0.5 cut — C5 red outline dE 43.5,
  C3 grey halo dE 37.1, C1/C1b/C2 all GREEN; `< 255`, the channel combination and the clamp unpinned): the tie
  reads the band, and every literal inside it is pinned ±ε.
- **P10 · A TWIN ASSERTS THE PRESS TOOK EFFECT** (TAB-PEN's toggled instant swallows a failed click:
  `.click().catch(() => undefined)` — a masked fallback): the twin reads the toggled state before it samples.
- **P10 · A BANKED BROWSER ROW IS A READ ROW** (SELF's `:1138` banked unrun — RED by construction, farClick on
  the hidden desktop twin, App.vue:830, carried by sha into COUNT and PLACE): every browser row in a bank was
  read on that bank in chromium at least; a row banked unread is declared in BANKED.txt by line.
- **P10 · A LOCATOR AIMS AT THE VISIBLE TWIN** (the same `:1138`): a locator over a duplicated control filters
  `:visible` through the ONE library.
- **P10 · A PRESENCE-KEYED SKIP DROPS THE CLEAN ARMS** (SELF's forgiveness rows `test.skip` whole on a served
  dist by a devServed presence key): a skip keys on the serving, per arm, never on a helper's presence.
- **P10 · A HANDOFF RED NAMES ITS OWNER IN BOTH RECORDS** (the tall-phone lap 2.74/3.05 px on COUNT × PLACE's
  ONE route: ruled PLACE's chart predicate's with COUNT carrying the number; `multiplayer:323` section-born s10
  with no §10 return naming its owner): a red on a shared route carries one owner and one number-carrier in
  both lanes' returns, or the fold names them.
- **P10 · A NEW KEYFRAMES NAME ON A BANKED ELEMENT IS IN THE ROSTER** (LADDER's X8 cell-pop: gates 0, painted
  both engines): the ladder's roster keys the element, not the animation name.

## G · Ballots and the owner (P9 §G and P8 §G stand)
- **P10 · A TIE HOLDS THE INCUMBENT** (§11: SELF 91 ties COUNT 91; SELF leads): a leader changes on the number
  only when the challenger's number is higher; on a tie the incumbent holds and the tie is written.
- **P10 · A CAPTION'S CLAIM OVER UNREAD CELLS IS FALSE UNTIL READ** (GRAPHITE's pick-17 caption '±1 around 375
  flips no read cell' against the critic's 374 1.351 / 375 1.504 chromium, 375 1.483 / 377 1.454 WebKit): a
  fitted constant's caption names only cells read in both engines; the unread span is named as unread.
- **P10 · A RETIRED FAMILY'S WALK IS A RECORD ARM, NOT A LIVE BALLOT** (WALK retired into TIN; B-TAPE keeps the
  walk's numbers as the arm's record; default unmoved): its rows re-open only by the owner's word (P9 §C).
- **P10 · THE CHAIR'S PICKS RUN FIRST IN A LANE'S BATCH** (LIVE spent its chromium budget on R1/R2 ahead of
  picks 3, 5 and 21 — all three UNBUILT, the union RED both engines at T9-M15 tier 2 and G-LIVE-21): a lane whose
  charter carries a chair pick builds the pick before any row of its own, and the critic reads the pick first.

## H · Retirement and the record's shape (P9 §H and P8 §H stand)
- **P10 · A BANK CONDITION IS READ AT THE BATCH'S CLOSE ON THE TREE THE RULING NAMES, AND A LATER READING
  DOES NOT WITHDRAW IT** (GRAPHITE: CHAIR §1 read MET at its batch's close on 954bbbab + homes v3 + delta at six
  rigs both engines by a non-author; the pass-10 WAVE 8/8): P9 §H is amended with the clock — the reading at the
  close binds; the cliff found after is a new row, not a withdrawal.
- **P10 · A FAMILY WITH NO BANK AT ITS RULED PASS RETIRES AS RULED** (WALK: README.md only, citing a BANKED.txt
  and a delta not on disk; CHAIR §12 fired): a README is not a bank; the fold reads the disk.
- **P10 · A BANK REFUSED FOR AN UNREAD COLUMN IS THE CHAIR'S PICK, NOT THE CRITIC'S VERDICT** (TIN's critic
  wrote BANK with no browser row read at that sitting, zone ≥ 8M, §11c's last alive family): a verdict that
  rests on rows the box refused is "UNREAD", and the fold carries the family ALIVE at the critic's number with
  the chair's pick first in line.

## I · Instruments (P9 §I and P8 §I stand)
- **P10 · A LIBRARY HOLE IS A PROPOSED, NEVER A RE-ROLL; THE RE-ROLL IS STRIPPED AT THE FOLD** (LIVE's FC ink
  key at focus-ring.spec.ts:509–550 re-rolls homes-v3 edge-bands.inkkey, which drops alpha — chromium's
  Highlight rgba(5,0,73,0.8) loses 85–95 % of the outline; LADDER's `<style scoped src>` owner map re-rolled in
  its gate; TAPE's gate-local `bounds` beside the library's — not stripped this pass because it predates the fold,
  stripped at pass 11 if unwired): P9 §I's ownership law is amended with its clock — a re-roll born after the
  library's row ships is stripped at the fold that finds it; one born before is wired or stripped by the next.
- **P10 · A PROPOSED IS GIT-FORMAT WITH ITS CLAUSE ROW, ITS PLANT AND ITS BORN-RED** (LADDER's quoted-key
  PROPOSED not git-format, absent from the clause table; RULE's roster-scope check text only): batch 0 refuses a
  PROPOSED that cannot `git apply --check` on homes' current sha or that names no clause row.
- **P10 · A PROPOSED'S COST IS BOUNDED BEFORE IT FOLDS** (LEDGER's renderless 1d44c587 reproduced — C4 → 1,
  157/157, sabotage 156/157 — but reserveReading ~1,301 s on the bank, 25–28 min on the union, CI lint:ink exit
  1): P9 §I's 120 s is read on the union by a non-author before the fold; a reader over 120 s folds as a
  per-file cache or not at all.
- **P10 · A HOLD'S `exempt` IS NOT `skip`** (LIVE's .game-card exemption: a will-change:opacity layer inside an
  exempt container is neither held nor refused): rest-probes.holdPoses ships `exempt` beside `skip` with a
  container-interior pose plant from every exempting consumer.
- **P10 · THE LIBRARY'S INK KEY COMPOSITES ALPHA** (edge-bands.inkkey slices to RGB and flattens isInk): the
  key reads a·ink + (1−a)·off with inkTol ±ε and an alpha-system-ink self-test row; every 'Highlight' consumer in
  chromium inherits the false RED until it folds.

## J · Incidents (each a law by name)
- The commit in a scratch `.git` (§A: LEDGER's and TAB-PEN's critics, ERASE's mk-copy.sh). The scratch symlink
  in a declared base (§A: TIN's 9528a8ec). The index-only apply that writes nothing (§A: WALK/TIN's critic). The
  tree planted mid-battery (§A: WALK's 20f59248). The missing GIT_CEILING line (§A: FACE). The zone re-armed
  mid-pass (§B: LIVE, TIN, WALK, TAB-PEN, s13 at 8.0–8.9M; LADDER under ZONE-ARMED). The plain-flock WebKit lock
  (§B: the WAVE's 20–75 min holds). The srv() pipe hang (§B: the WAVE's 21-min hold). The tree dist served as the
  arm (§B: the WAVE's voided band read). The helper's hang re-budgeted (§B: SELF's :571). The duplicate and
  detached light runs (§B: TAB-PEN, ERASE, the WAVE's prettier reads, LEDGER's unit chunks). The dev-only row RED
  a second pass (§B: s13's front-rate, FIVE). The caption without CSS bytes (§C: FACE's p10-f1). The undeclared
  strike (§C: FACE's + 5px). The one-tree 'both trees' (§C: GRAPHITE's H1). The README's stale bank (§C: LEDGER,
  ERASE, COUNT). The record path in a fold's notes (§C: the §11 fold). The one-instant fence (§D: ERASE). The
  stamp-quantum slack (§D: FIVE's dt−1). The per-tween flag (§D: FIVE's remainder). The unpinned window (§D:
  D10-partial30). The dropped rest result (§D: SIX's atRest). The cut read only at its rigs (§D: GRAPHITE's
  372/375/377). The reserve denylist, the scaling window, the unbounded arrival key (§D: LEDGER's G4/G5/G3). The
  loadingdone that never fires (§D: PLACE's 15f). The census dodge (§D: TIN's wash reach). The scaled floor (§E:
  RULE's d.scale). The `all` hole (§E: FACE's CHECK 7). The self-keyed disjunct (§E: SIX's LIFE). The ungated
  cite and the over-red gate (§E: SELF's B-INK-RUNG × LADDER's B6). The unlisted constants (§E: TIN's SPREAD,
  FIVE's seven, LIVE's two). The re-fit class from the code (§E: PLACE's C1/C3). The shape-only admission (§E:
  PLACE's row 4). The content-keyed roster with no stale arm (§F: TAPE's clause 12). The spelling-read bound (§F:
  TAPE's `&& false`). The collateral red (§F: RULE's battery). The head-keyed admission (§F: TIN's CONSUMER_HEAD).
  The 29 plants (§F: LADDER). The source-spelled twin (§F: COUNT's plus). The per-cell straddle (§F: COUNT's pick
  17). The chroma-blind band and the unpinned literals (§F: TAB-PEN). The swallowed click (§F: TAB-PEN's twin).
  The banked unread row and the hidden twin (§F: SELF's :1138). The presence-keyed skip (§F: SELF). The
  ownerless handoff red (§F: the tall-phone lap; multiplayer:323). The new keyframes name (§F: LADDER's X8). The
  tie (§G: §11). The false caption (§G: GRAPHITE's pick 17). The picks run last (§G: LIVE). The bank condition
  and its clock (§H: GRAPHITE). The README bank (§H: WALK). The verdict over unread rows (§H: TIN's critic). The
  re-roll (§I: LIVE's inkkey, LADDER's map, TAPE's bounds). The non-git PROPOSED (§I: LADDER, RULE). The 1,301 s
  reader (§I: LEDGER). The exempt-not-skip hold (§I: LIVE). The no-rm law typed (RULE's critic `rm -f /dev/null`;
  the WAVE's `/tmp/x`). The folds' own: temp-index blobs in the shared store (§3/§4, §13 — declared), the zsh
  `=====` glob miss (three folds), the `:web` modifier miss (§13), shared fold scratch (§13 with §3/§4), batched
  independent tool calls on the harness's instruction (§11, this assembler once for an append beside a read).

## K · Return (P9 §K and P8 §K stand)
- DATA (the schema), numbers first, gaps first; the sha at bank, `--shortstat`, bytes, `git apply --check` on
  `74a2b5d9`, on the section's integrated tree AND on the WAVE union (`561a337a`), each apply line with its
  resolved git dir, path count and one `cmp`; the DECLARED base of the on-WAVE delta (a write-tree of product
  paths, no symlink) and its stacked check; the served CSS bytes and dist identity asserted in-run beside every
  probe; the born-RED transcript; the clause-, threshold- and disjunct-sabotage batteries with every constant's
  ±ε pair listed; the subject verdict apart from sabotage collateral; π and AA from painted bytes; the box load
  AND the zone inuse beside every browser row; every crop by path with its retiree, engine, theme, build identity,
  served CSS bytes and DPR; every instrument by relative product path; the control's exit and bundle identity
  beside every battery row; `lint:sleep` read on the bank; every browser row in the bank read at least in
  chromium or declared unread by line; the chair's picks reported first. The number is the critic's.
