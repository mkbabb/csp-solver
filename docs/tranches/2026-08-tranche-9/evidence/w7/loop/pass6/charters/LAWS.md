# PASS-7 LAWS · every T9-W7 lane (read before your charter)

These bind every pass-7 lane beside `pass6/CHAIR-RULINGS.md` (+ addenda A.1–A.7, in force),
`pass5/CHAIR-RULINGS.md` (+ addenda A/B), `pass4/CHAIR-RULINGS.md` (+ its `?board=` addendum),
`pass3/CHAIR-RULINGS.md`, `pass6/registry-v6.md` §2 (the fold's eighteen rulings) and
`intake-owner-2026-09-23/INTAKE.md` §0.7 (the chair's (a)–(h)). Pass 5's LAWS stand where not
amended here (its **P4**/**P5** marks are kept); the amendments are marked **P6** (what pass 6
taught). A lane that disagrees carries the objection in its return, never in its diff.

## A · Base, control, worktree
- Base and π control commit: `74a2b5d9`, named in every π row. NO rebase inside the loop (main is
  at `a45cacb5` + the pass-6 record; the wave's fold reconciles once). The HEAD control is the
  shared read-only tree `.claude/worktrees/w7-control` (pre-built dist `index-CubiZsMVSwTc.js`);
  verify the port by that hash, never by a 200; never edit, build or git-touch it — **P5** a
  read-only `git status` in the control is a git-touch; read its status from the chair's record.
- **P6 · The INTEGRATED tree is a third arm, read-only.** `74a2b5d9 + pass6/integrate/s10.diff`
  (§10) and `74a2b5d9 + pass6/integrate/s13-s7-s3.diff` (§13, §7, §3) are served by the chair from
  `git archive` scratch trees outside any worktree (their own cacheDirs). A lane in a merged section
  re-shoots its ballot pair on the integrated tree (§7's T9-B-LEDGER; §10's seal), and **every
  pass-7 delta in a merged section must `git apply --check` 0 on the integrated tree as well as on
  `74a2b5d9`**, or the return names the hunk that cannot. Never edit, build or git-touch the
  integrated trees either.
- **P6 · TAB-PEN's base is main `a45cacb5` by the chair's waiver** (registry-v6 §2.16b): it touches
  no family's `src/` file. The waiver dies the moment its diff touches `src/`; it then re-bases to
  `74a2b5d9` like every lane.
- **P4** · Main-HEAD is the second control for the owner's mark rows only, served read-only from a
  `git archive` scratch tree OUTSIDE any worktree with its own cacheDir.
- Lanes continue IN PLACE in their pass-6 worktree (named in the charter) AFTER the chair has
  banked it as `pass6/prototype/<id>/pass6.diff` + `BANKED.txt` (registry-v6 §7.1). Bank the first
  lane's diff before a second lane touches a shared tree (§13's `-59`: LADDER first, VERB second,
  sequential). **P6 · A bank file is never rewritten in place**: a cumulative re-cut is a NEW file
  with a pointer note beside the old (`pass6-ladder.diff` was rewritten at 12:07 and its README's
  figure went false).
- `git` aimed at another worktree is refused: replay by `git archive` + `git apply --3way` (it
  STAGES; `git restore --staged` afterwards) or `git merge-file` per file, and run the LINE-COUNT
  check after any merge. **P5** rebuild the dist you cite AFTER the last edit, comment-only edits
  included.
- Never commit/push/stash/deploy/publish on the main tree; never `npm install` anywhere.

## B · Servers and the box
- Dev server: 127.0.0.1, the charter port in 4230–4249, `--strictPort`, a two-line scratch vite
  config with a private `cacheDir` naming THIS worktree; the control on the next free port in the
  band; build and serve never share a cacheDir. 4250–4260 are W8's. Re-scan the band immediately
  before binding. **P6 · The cacheDir lives OUTSIDE the project root** (Tailwind's content scan
  reads a cacheDir under the root and SHIPS its candidates — TAB-PEN and PAL-WALK both hit it).
- KILL BY RECORDED PID. Never `pkill -f` on a shared path prefix nor on a pattern not keyed on
  YOUR worktree. STALL LAW: ≤2 workflows on the box; long commands to the background with a log,
  polled every ~60 s; batteries are shell scripts; chunk vitest by directory and playwright by
  project. **P6 · A timing row (rate, first-frame, interval, PRM cut) DECLARES the box load** (the
  1-min load average and the count of sibling node/vitest/playwright processes at the read) beside
  its number; a timing number with no load beside it is a reading, not a verdict.
- **P5 · NO `rm` OF ANY FORM INSIDE A LANE** (`rm -rf`, `rm -f`, `find -delete`) — **P6 · and no
  `git clean`, `git checkout -- <path>` on a path you did not write, nor `git restore` of a
  sibling's file**: each is delete-bearing and holds the lane forever. Scratch lives under UNIQUE,
  lane-named directories in the session scratchpad; overwrite by redirection; a scratch config
  that must go before return is `mv`ed to `<scratchpad>/trash-<lane>-<n>`. The chair cleans.
- **P5 · A hung lane is stopped, never resumed**: a transcript silent > 30 min with no process
  behind its last tool call is hung; the run is stopped and continued from a PRIOR-baked script.
- Serve BOTH arms in one rendering mode; build with scratch OUTSIDE the tree or diff the CSS
  against a clean build. No osascript, no `open -a Safari` (M19). Scratch PW configs live in
  `<worktree>/web/frontend/.<lane>/` and are moved out before return; the worktree's `git status`
  at return = product files, nothing else. **P6 · `vue-tsc -b` writes `tsbuildinfo`: every tsc
  gate runs on a `git archive` of the tree, never on the control or a sibling.**
- **P5 · zsh does not word-split `"$s"`**: use `${=…}` or bash in battery loops.

## C · The record
- Frozen: `loop/r0/`, `pass1/`…`pass5/`, and now `pass6/`. Pass-7 evidence lands ONLY under
  `evidence/w7/loop/pass7/<stage>/<familyId>/`. An instrument you run is COPIED with its OUT
  re-pointed; an instrument whose subject your design moved is a PROPOSED diff under
  `pass7/<stage>/<id>/instruments/` and the row reported MOVED. Never re-word a gate to pass.
- Numbers and text first. At most FOUR cited crops ≤150 KB per family; every frame names engine ·
  theme · viewport · POINTER CLASS · DPR and the payload; a pass-7 crop is a REPLACEMENT naming
  the pass-6 crop it retires. **P6 · The wave is at the cap after the chair's sweep (registry-v6
  §2.18)**: a pass-7 crop is banked ONLY as a replacement of a kept frame, quantized (pngquant
  60–90) before bank, and a lane that banks a frame with no retiree named has banked nothing.
  **P6 · A ballot arm is FRAMED where it differs from BOTH other arms** (PLACE's yield, GRAPHITE's
  OUTSIDE at phone, TAB-PEN's H were 'built' with no frame where the choice lives).
  **P6 · A caption's DPR is the frame's** (RULE's f3 quoted DPR 1 numbers on a DPR 2 frame).
- `?board=` is a codec payload, not a name (P4); every π row and ballot frame STATES its payload
  and reads the given-set back through the aria-label corpus (P5). **P6 · Every painted-text row
  in §11/§11c pins B's peer id (`p-0000000b0b0b`) through `session-identity-v1`** — a random
  slug is a variable (TIN's, COUNT's and WALK's frames each carried one).
- An owner's mark is a U-10 row in the owning charter whatever the number; both portfolio designs
  are ARMS to build and frame; a mark row's number is re-measured on the lane's tree AND main-HEAD
  where W8 touched the surface, and the INTAKE row it answers is quoted by number (P5) — **P6 · for
  pass 7 that means INTAKE-22 §7 AND INTAKE-23 §4, by row number, each closed/open in the return.**
- **P6 · A born-RED that lands from PROPOSED is re-run on the FINAL file's sha1** (PLACE's break
  battery was read on a pre-edit sha1); the return prints the sha1 the battery ran on beside the
  sha1 at bank, and they are equal.
- **P6 · A BANKED.txt** (sha1, byte count, file count, the `--shortstat` line, `git apply --check`
  exit on a fresh `74a2b5d9`) sits beside every bank; pass 6 shipped none.

## D · Paint, post-paint, and what a reading is
- **P6 · A first-frame, drift, interval or rate row reads POST-PAINT.** A sampler registered
  before the product's rAF reads pre-callback state (VERB's GA1 passed 8/8 with frame 1 painted
  142.9 px off; keys-crib G3 read 5.9–30.8 px in-rAF against 0.016 px painted). The row's reading
  is taken from a rAF queued AFTER the product's (`requestAnimationFrame(() =>
  requestAnimationFrame(read))`) or from the chair's painted-frame recorder (`pass7/instruments/`,
  both engines), and it asserts on the painted timeline: ct(frame k) = timeline(k) − timeline
  (frame 1) ± 2 ms. The plant that skips one product frame is its negative. In WebKit the in-rAF
  rect is not the painted rect even on the control (117.87 vs 133.68) — no WebKit motion row reads
  in-rAF.
- **P6 · A publisher parked on a transition un-parks when `getAnimations()` is empty one rAF
  later** (FACE's `--action-bar-h` parked at 121 for the page's life on two presses in one task).
  **A regime measured at OPEN re-fits on resize at rest** (`transitionend` + rest); every sheet or
  chart keyed on a box read at open owes an OPEN-THEN-RESIZE row (SELF 390×844 → 390×800 open;
  PLACE's yield 94.64 px restored by a height change).
- **P6 · A touch-click guard keys on the event SEQUENCE** (a flag set in the release handler,
  cleared by the next click or task), never on `click.pointerType` (WebKit labels a touch's click
  'mouse'; real iOS may double-toggle). **A tap on a row inside an open overlay keeps the cell's
  focus**; a row tap that sends focus to BODY is a defect in both engines.

## E · Constraints on every design
- M16 plain copy (`check-copy-register` bare, 0 unadmitted); the filterBudget never grows (9 on the
  built dist, both engines, BOTH themes — **P6 · the crayon-heart dark-saturate deletion is the
  integrator's pick under SIX's born-RED; the chair ratifies or reverts it pre-batch and every lane
  cites the filter census as tree vs `74a2b5d9`'s dist, both themes, at rest AND at boot** — the
  09-23 intake's 11-at-boot vs 9-at-rest is the boot's own row, VERB's); π identity on every
  unclaimed surface against the named control, WHOLE-DOM with an in-run floor keyed by semantic
  ancestry (P5), DRIVING the surface it censuses; W2's mechanics LANDED; U-10; the decided-history
  laws; the dock sheet SLIDES (~700 ms).
- **P6 · Existence is not visibility, in text as in rings (A.5.3, eleven instances this pass).**
  Every drawn-edge paint gate reads ALL FOUR BANDS (top, bottom, left, right) against edge-OFF with
  a per-band core-median floor (a top-band-only row passed a `clip-path` that erased the bottom
  edge ×2). Every painted-text gate reads the WHOLE glyph-coverage population with an ABSOLUTE
  floor (≥ 4.5 wherever the control clears it), treats an EMPTY or thin population (< 40 px) as
  RED (never `min(4.5, 0)`), states the fraction under 4.5 per cell and bounds it (the control's
  + slack where the estate stamps it; the shipped reading + 0.05 until then), and ships BOTH text
  plants as in-run negatives: the FAINT plant (`-webkit-text-fill-color: color-mix(in srgb,
  currentColor 30 %, transparent)`, which keeps `color` green) and the TAIL plant (the last 12 %
  and the last 35 % of the run at 25 % α, which a median cannot see). An in-run control photographed
  on the subject's own element inherits the plant — a relative clause is never the only clause.
  A rate row prints the per-burst MINIMUM gap, not the mean.
- **P5 · AA on TEXT is the GLYPH-TEXT statistic** (registry-v5 §2.11) — kept whole; **P6 · the
  hand's tag rung is LEDGER row T9-R8 (both themes)**: a family red on that rung (SELF's state
  line, ERASE/LEDGER's settled rung, COUNT's `.pl-qual`, FACE's selected chip, WALK's dpr-1 cell 8
  if the chair moves it there) cites T9-R8 by name and does not re-cure the ink locally unless its
  charter says so; the estate cures it once at the fold. **The tape name's rung is `--type-small`
  600 (SheetWashiLabel.vue:98–100), not the tag rung** — WALK's row until the chair rules.
- **P6 · A monotone or 'never falls' clause samples the WHOLE range the design names** (COUNT's
  (c) was tested at six-vs-five and is false at six of the ten later steps).
- **P6 · A reused copy line keeps ONE referent**: an accessible name built from a copy string that
  a visible line also uses reads the same population as that line (`LOBBY_COPY.more` said '11 more'
  over a sheet reading 'and 12 more'); a name with a second referent is a M16 row RED.
- Coarse rows run with `hasTouch: true` in a witnessed regime; 844×390 and 812×375 are W2 §2.2's
  cell; a regime keyed on a height reads 390×800 and 360×800 too; read the widest board's copy
  (16×16) at 812×375 (P5). **P6 · A board-under-rows or board-beside-sheet predicate reads BOTH
  axes** (SELF's `board.left <= rowsStart && board.top < bottom` keeps 4 rows at 768×1024 coarse
  where one row laps 0).
- **P5** `env(safe-area-inset-bottom)` is measurable in chromium (CDP); a foot-on-the-inset row runs
  the CDP arm at 34 px. A berth, a mount and a reveal keyed on three media predicates put a floating
  layer outside its case — key all three on one regime.

## F · Gates
- Every gate runs BARE, exit code unpiped. A born-RED row is demonstrated on THIS tree with its
  negative control in the same run; every re-cut gate SHIPS WITH the negative control that reds
  it; the critic runs the previous pass's plant FIRST (P5). **P6 · An interleave or ordering row
  ASSERTS on its GREEN run** (PLACE's row 13 never asserted the interleave on the run it passed);
  a row that reds only under its plant and asserts nothing otherwise is a plant with no row.
- **P6 · THE SHAPE LAW (a gate cured for its plants is not cured for the class; eleven trees on
  their second or third pass).** A source-shape gate: reads EVERY `<style>` block (scoped or not,
  a second block too) and every linked stylesheet including `public/**` and `index.html`; keys on
  the SUBJECT COMPOUND (never the exact prelude — a descendant or `:is()` scope, a compound override,
  a renamed selector with a dead decoy all reach the subject); reads every declaration in SOURCE
  ORDER with the last winning and honours `!important` and the VALUE the rule inherits (resolved
  AT THE CONSUMER, not on `<html>`); treats a var-led shorthand (`font: var(--x)`) as a literal
  match; resolves every CSS `<color>` syntax through ONE parser (hex 3/4/6/8, rgb/rgba incl. `%`,
  hsl incl. `turn`, hwb, lab, lch, oklab, oklch, `color(srgb …)`, named colours, `color-mix` arms)
  and scores a literal by ΔE, never by spelling; resolves computed keywords (case-folded, `var()`
  fallbacks evaluated, `linear()` recognised, longhands read beside shorthands); reads quoted-key
  and unquoted `:style` OBJECTS, TS style objects, script `style.setProperty`/`style[x]` writes
  incl. concatenated and computed keys, `.json` tables and `.tsx`; reads `var(--stem-${x})`
  templates as every stem; matches `:not(.tail)` as a compound, never a substring; keeps a
  STRING-AWARE comment stripper (`accept="image/*"` defeated one); binds `url(#${id})` and `:href`
  by resolved name; resolves `<component :is>`, `defineAsyncComponent`, `import { default as }`
  and `h()` in a component census; and SHIPS the E1/E2/E2b/E3/E4-shaped plants (a shadowing
  declaration after `inherit`, a second `<style scoped>`, a compound override, a 1px reserve,
  `!important` in a media block) at EVERY consumer site. The chair's `pass7/instruments/` shape-
  census library (seeded from LEDGER's `reserve-law.PROPOSED.mjs`) is the ONE copy; a lane that
  hand-rolls a second is a row against §I.
- **P6 · A ratchet's TS arithmetic is ratcheted too**: `MOTION.rungs.whisper / 3` and
  `dealStaggerMs / 9` pass every band gate today; a rung consumed through arithmetic is read at
  its consumer's computed value. **At CI's real depth (no fetch-depth) a floor file's BASE_REF
  fallback never runs** — the floor is stamped or re-derived, and the self-test's control must not
  collide with the row it controls (LADDER's A2 went vacuous).
- **P6 · A DELETED row in an ADMITTED table is a value with no `ms`** — the closure loop handles it
  by shape (B1 threw `TypeError` on the first live DELETED row; the integrator's exemption is
  ratified by VERB/LADDER or replaced).
- **P6 · A rate gate proves its cure on ≥ 5 runs per engine with the minimum gap printed; one
  engine red on any run is a DEFECT, not noise** (FIVE's 4/7 WebKit, SIX's 1/6, GRAPHITE's
  53.6–59.8/s are one defect, A.6's forced end-write at `frontGate`; the unit that cannot tell a
  15 ms swallow from a 16 ms commit is not a unit).
- The pre-return battery is the WHOLE spec file a row lives in plus `lint:lanes`,
  `lint:theme-tokens`, `lint:sleep`, `lint:bands`, `lint:verbs`, `test:e2e:projects`,
  `check-pw-projects`, `check-property-block` (source AND served), `eslint .`, `npm run lint`
  (name the form), each bare, each with the control's exit code beside it; a red you inherit is
  DECLARED with the control's reading. **P6 · `lint:sleep`'s `getAttribute` verb is the chair's
  pre-batch pick; until it lands, tag every `sleep → getAttribute` read.**
- THE @PROPERTY LAW (four clauses + `inherits`, ONE block per home, never nested, P4/P5) — **P6 ·
  the registration row reads EVERY stylesheet, not `index.css` alone** (a second `@property
  --motion-whisper{inherits:false}` in `typography.css` passes CI on ERASE's tree; only
  `check-property-block` reds it). A clock set by an inline `!important` longhand beside a
  `transition` is read on BOTH axes (`transition-duration` AND `animation-duration`): ERASE's clock
  was beaten on the animation axis at 904 ms with every gate at 0.
- **P5 · A source-text census** scans every stylesheet AND every SFC `<style>`, resolves component
  tags, strips comments, reds dynamic ids, runs as a DIFF (tree minus control) — kept; the SHAPE
  law above extends it.
- **P5 · A rate or budget gate proves its ablation reds under a 60 Hz rAF shim** — kept.
- A browserless gate reading a browser artifact STAMPS the SERVED artifact; a RECT IS NOT PAINT; a
  close is a pose; a census with a `?? <container>` fallback reds a missing subject; a 100 %
  ceiling on a fraction is not a ceiling; a derived geometry token reads the live transform
  (`:radius="15"` is a derived literal — SELF); a ResizeObserver publisher on a transitioning box
  publishes on `transitionend` and at rest; plant every source-shape law row at EVERY consumer
  site (P5, kept whole).
- `contain: inline-size` needs `scrollWidth === clientWidth`; clip every occlusion census to the
  scrollport and sample its scroll POSES; name the OCCLUDER (P5).

## G · Ballots and the owner
- A ballot's firing default must not lose to the control on the same painted statistic (P5);
  **P6 · a ballot names the LOSS of its default where the default loses on any measured axis**
  (T9-B28's fringe rate; T9-B30's QUIET 22–26 %; B-TAPE's dark median −0.21…−0.36; B-YIELD's
  strobe) — a ballot that hides a cost is re-framed by the chair.
- **P6 · An arm 'built on the chair's or owner's word' is NOT built by a lane's own charter**
  (VERB's arm B): INTAKE §8 governs; the lane frames what it built and states what it did not.
- T9-B29 (LIVE's ring geometry) and T9-B30 (SELF's head-sheet edge) are minted in registry-v6 §9;
  every other loop ballot keeps its loop name until DISPOSITIONS §2.

## H · Retirement and the record's shape
- A retired family's tree is a RECORD, never deleted (`-29` COST, `-39` ABS); its grafts are rows
  in the absorbing family's charter, each with the retiree's number beside it.
- **P6 · The §7 pair watch is MET; retirement is DEFERRED to T9-B-LEDGER** — neither NOTE lane
  removes the other's mechanism from the merged note; both re-shoot on the integrated tree.

## I · Instruments
- **P6 · The chair's `pass7/instruments/` lands before batch 1**: the painted-frame recorder (both
  engines), the post-paint sampler, the four-band edge probe, the glyph-population probe with the
  absolute floor and both text plants, the shape-census library, the resize-at-rest/un-park probe
  — each with its born-RED on the control and its plants. Every charter reads
  `pass7/instruments/README.md` FIRST; a family row that re-implements one of these is a row
  against this law and the critic reds it.

## J · Incidents (each a law by name)
- Box load declared on timing rows (§B). The break battery re-runs on the FINAL sha1 (§C). A bank
  is never rewritten in place (§A). `vue-tsc -b` on a `git archive` only (§B). The cacheDir outside
  the root (§B). `git clean` is delete-bearing (§B). The interleave row asserts on green (§F).
  A caption's DPR is the frame's (§C). The peer id pinned (§C).

## K · Return
- DATA (the schema): numbers, gaps first, every incident self-declared, the replay route named, the
  fork or ballot rows for the owner with both frames on one payload, every r0 row MOVED named, the
  pre-return battery's table with the control's exit codes, the INTAKE-22 §7 and INTAKE-23 §4 rows
  (for a mark lane) quoted by number as closed/open, the box load, the sha1 pair (battery/bank),
  `git apply --check` on `74a2b5d9` AND (merged sections) on the integrated tree. Reject your own
  optimism. The pass-7 number is the CRITIC's, never yours.
