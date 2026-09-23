# PASS-6 LAWS · every T9-W7 lane (read before your charter)

These bind every pass-6 lane beside `pass5/CHAIR-RULINGS.md` (+ addenda A/B, still in force),
`pass4/CHAIR-RULINGS.md` (+ its `?board=` addendum), `pass3/CHAIR-RULINGS.md` and
`pass5/registry-v5.md` §2 (the fold's fourteen rulings). Pass 4's LAWS stand where not amended
here (its **P4** marks are kept); the amendments are marked **P5** (what pass 5 taught). A lane that
disagrees carries the objection in its return, never in its diff.

## Base, control, worktree
- Base and π control commit: `74a2b5d9`, named in every π row. NO rebase inside the loop (main is
  at `042698e2` + the pass-5 record; the wave's fold reconciles once). The HEAD control is the
  shared read-only tree `.claude/worktrees/w7-control` (pre-built dist `index-CubiZsMVSwTc.js`);
  verify the port by that hash, never by a 200; never edit, build or git-touch it — **P5 · a
  read-only `git status` in the control is a git-touch** (four lanes did it and declared it; it can
  refresh the index stat cache; read the control's status from the chair's record instead).
- **P4** · Main-HEAD is the second control for the owner's mark rows only (registry-v4 §2.14), served
  read-only from a `git archive` scratch tree OUTSIDE any worktree with its own cacheDir.
- Lanes continue IN PLACE in their pass-5 worktree (named in the charter) AFTER the chair has banked
  it as `pass5/prototype/<id>/pass5.diff` (registry-v5 §8 act 1). Bank the first lane's diff before
  a second lane touches a shared tree (§13's `-59`: LADDER first, VERB second, sequential).
- `git` aimed at another worktree is refused: replay by `git archive` + `git apply --3way` (it
  STAGES; `git restore --staged` afterwards) or `git merge-file` per file, and run the LINE-COUNT
  check after any merge. **P5 · Rebuild the dist you cite AFTER the last edit, comment-only edits
  included** — a comment moves the Vue scope id and the identity (three lanes cited a stale dist).
- Never commit/push/stash/deploy/publish on the main tree; never `npm install` anywhere.

## Servers and the box
- Dev server: 127.0.0.1, the charter port in 4230–4249, `--strictPort`, a two-line scratch vite
  config with a private `cacheDir` naming THIS worktree; the control on the next free port in the
  band; build and serve never share a cacheDir. 4250–4260 are W8's. Re-scan the band immediately
  before binding.
- KILL BY RECORDED PID. Never `pkill -f` on a shared path prefix — **P5 · nor on a pattern that
  is not keyed on YOUR worktree** (`vitest run src/pencil` reaches a sibling's vitest). STALL LAW:
  ≤2 workflows on the box; long commands to the background with a log, polled every ~60 s;
  batteries are shell scripts; chunk vitest by directory and playwright by project.
- **P5 · NO `rm` OF ANY FORM INSIDE A LANE** (`rm -rf`, `rm -f`, `find -delete`): the harness's
  permission layer HOLDS a delete-bearing call forever and the watchdog counts the held call as
  activity — one lane hung three times on it. Scratch lives under UNIQUE, lane-named directories in
  the session scratchpad (it is SHARED across lanes — `p4base` was clobbered twice); overwrite by
  redirection; a scratch config that must go before return is `mv`ed to `<scratchpad>/trash-<lane>-<n>`.
  The chair cleans.
- **P5 · A hung lane is stopped, never resumed**: a transcript silent > 30 min with no process
  behind its last tool call is hung; the run is stopped and continued from a PRIOR-baked script
  (a resume re-keys every critic's prompt and re-runs them).
- Serve BOTH arms in one rendering mode; build with scratch OUTSIDE the tree or diff the CSS
  against a clean build. No osascript, no `open -a Safari` (M19). Scratch PW configs live in
  `<worktree>/web/frontend/.<lane>/` and are moved out before return; the worktree's `git status`
  at return = product files, nothing else. Scratch never lives in a product dir on the MAIN tree.
- **P5 · zsh does not word-split `"$s"`**: a battery loop that hands `node` a file name with its
  flag attached reports a false exit 1 (three critics). Use `${=…}` or bash.

## The record
- Frozen: `loop/r0/`, `pass1/`…`pass4/`, and now `pass5/`. Pass-6 evidence lands ONLY under
  `evidence/w7/loop/pass6/<stage>/<familyId>/`. An instrument you run is COPIED with its OUT
  re-pointed; an instrument whose subject your design moved is a PROPOSED diff under
  `pass6/<stage>/<id>/instruments/` and the row reported MOVED. Never re-word a gate to pass.
- Numbers and text first. At most FOUR cited crops ≤150 KB per family; every frame names engine ·
  theme · viewport · POINTER CLASS and the payload; a pass-6 crop is a REPLACEMENT naming the
  pass-5 crop it retires. **P5 · The wave is 1.33 MB OVER its 2 MB cap at this fold** (128 PNGs /
  3,428,754 B); a crop is banked ONLY for a ballot pair a critic can call lawful (one payload, one
  variable, both arms looked at) — everything else is a number. Raw census JSON is summarised,
  never banked whole (one lane banked ~1.8 MB incl. a run it knew was blind); a differ banks its
  CLASSIFIED output.
- `?board=` is a codec payload, not a name (P4); every π row and ballot frame STATES its payload and
  **P5 · reads the given-set back through the aria-label corpus, never innerText** (`.board-cells`
  innerText is empty on an SVG-glyph board — a π instrument compared three empty strings in 16/16
  poses). **P5 · A painted PERCENTAGE is quoted on ≥2 payloads** or it is a payload artifact (8 %
  vs 60 % on one row). A ballot pair differs by ONE variable and the author LOOKS at both frames;
  **P5 · the sun's rotation phase is a variable in any masthead crop** — park it or declare it.
- An owner's mark is a U-10 row in the owning charter whatever the number; both portfolio designs
  are ARMS to build and frame; **P5 · a mark row's number is re-measured on the lane's tree AND
  main-HEAD where W8 touched the surface, and the INTAKE row it answers is quoted by number**.

## Constraints on every design
- M16 plain copy (`check-copy-register` bare, 0 unadmitted); the filterBudget never grows (9 on the
  built dist, both engines, BOTH themes — the chair lands the `crayon-heart` deletion pre-batch);
  π identity on every unclaimed surface against the named control, computed PAINT properties + tag
  names, with its own control-vs-control arm in the same run, DRIVING the surface it censuses;
  **P5 · a π census is WHOLE-DOM with an in-run floor, keyed by semantic ancestry** (a selector
  list missed W2's tab moving +0.60/+0.64 in one tree and +18.19 in another; a full-class-chain key
  reads a wrapper as 94 deltas); W2's mechanics LANDED; U-10; the decided-history laws; the dock
  sheet SLIDES (~700 ms).
- **P5 · AA on TEXT is the GLYPH-TEXT statistic** (registry-v5 §2.11): the core median over
  glyph-coverage-keyed pixels (PAL-WALK's painted-text instrument — photograph twice, text
  transparent, every changed pixel on the painted ground; the population keyed on glyph coverage,
  never on the crop's own maximum) ≥ 4.5, with the fraction of glyph pixels under 4.5 STATED and
  bounded by the control's own fraction + slack (an estate row). Rings and strokes keep the core
  median + fraction < 3.0 with the ring-OFF subtraction and the 50/70/90/100 % sensitivity row;
  **a station dropped for insufficient ink COUNTS as under the floor** (or n/N is printed);
  **a painted-text or painted-ring minimum takes a SECOND bare photograph** (a one-shot minimum
  reds on a transient ground pixel); a flat translucent ink has a structural best-pixel ceiling —
  read the ink-mass rows at DPR 1 AND 2. A ballot's firing default must not lose to the control on
  the same painted statistic. **Search the feasible window before minting or refusing a byte**
  (derive the Y band from the painted grounds; the dark card-edge trio is infeasible for any colour).
- Coarse rows run with `hasTouch: true` in a witnessed regime; 844×390 and 812×375 are W2 §2.2's
  cell; **P5 · a regime keyed on a height reads 390×800 and 360×800 too** (a one-pixel cliff at
  799/800), and **read the widest board's copy (16×16) at 812×375** before claiming landscape safe;
  `?wire=local` is DEV-only. **P5 · A cure that makes an overlay answer taps owes a row reading taps
  just OUTSIDE its edge in Chromium hasTouch** (touch adjustment snaps outward). **A row-count
  height law needs its longest-string row** (slugs run to 29 chars). **Every receiver-side per-key
  timer map needs a LEAVE-WHILE-PENDING row** beside its two-movers row.
- **P5 · `env(safe-area-inset-bottom)` IS measurable in chromium** (CDP
  `Emulation.setSafeAreaInsetsOverride`); a foot-on-the-inset row runs the CDP arm at 34 px.
- **P5 · A berth, a mount and a reveal keyed on three media predicates put a floating layer
  outside its case** — key all three on one regime. A drawn edge at a scrollport's clip line needs
  pad ≥ outset + half stroke + 4 css of daylight, read at every scroll pose, not the scroll end.

## Gates
- Every gate runs BARE, exit code unpiped. A born-RED row is demonstrated on THIS tree with its
  negative control in the same run; every re-cut gate SHIPS WITH the negative control that reds it,
  run in the same batch; **P5 · the critic runs the previous pass's plant FIRST** (twelve of
  seventeen trees still carry a landed gate that cannot fail; three families are on their THIRD pass
  with one). The BREAK-TEST discipline is what born-RED means.
- **P5 · An existence gate for a DRAWN thing reads PAINT**: ring-ON minus `visibility: hidden` (or
  edge-ON minus edge-OFF) > N px on the painted band, plus the ancestor opacity chain; a rect, a
  computed stroke, a declared style, or 'the box colour equals the token' is not paint (X1
  `opacity: 0` and X2 `color: transparent` stayed green on three trees; Plant K painted a board
  99.7 % dark under a 20/20 spec). A re-cut off a bake or blob that reads computed style ships a
  planted-PAINT negative control.
- **P5 · Gate a name's VALUE, never its spelling**: a cure-by-naming (`--ease-*` tokens, ledger
  aliases) is un-cured by writing the keyword back as the token's value with no gate turning red; a
  rung ledger checks the VALUE map (a key-set gate is blind to a swap that doubles a verb); an
  escape row's value is bound to its SUBJECT (a MOVED `newKey` that may name any live key is a value
  with no subject; a new EXEMPT row without `ms:` is the same disease, fourth occurrence); a
  ratchet's floor file is part of the gate (stamp it or re-derive it — at checkout depth 1 a
  BASE_REF fallback never runs); an orphaned bank key reds unconditionally unless a MOVED/DELETED
  row names it with its value.
- The pre-return battery is the WHOLE spec file a row lives in plus `lint:lanes`, `lint:theme-tokens`,
  `lint:sleep`, `test:e2e:projects`, `check-pw-projects`, `eslint .`, `npm run lint` (the scoped
  prettier — **P5 · name the form you ran; bare `npx prettier --check .` reds both trees on dist/**),
  each bare, each with the control's exit code beside it; a red you inherit is DECLARED with the
  control's reading. **P5 · `lint:sleep`'s verb list gains `getAttribute`** (the chair's act); a
  `sleep → getAttribute` one-shot read is a live read and is polled or tagged.
- THE @PROPERTY LAW (four clauses, pass 3; ONE block per home, never nested, P4) plus **P5 · clause
  4 reads `inherits`**: `inherits: false` on a registered `<time>` set on `:root` reads 0s in every
  descendant consumer in both engines; every ladder registration asserts `inherits: true` with that
  plant as its negative. A textual merge is SILENT on a duplicated registration (§13 onto §10 seated
  each rung three times with no conflict): the fold battery's `check-property-block.mjs` (names
  unique, one block per home, none nested, none script-emitted, `inherits` read) is the gate, and
  a lane that mints a copy of §13's rungs has re-minted (three trees this pass).
- **P5 · The derived+declared corpus law is CORRECTED**: a declared-and-derived group reds when its
  DECLARATION is deleted; a deleted CALL SITE prints a departure and exits 0 unless the gate is
  re-cut to red a departure inside such a group. A comment claiming otherwise is false (v4 §3.8).
- **P5 · A source-text census scans every stylesheet AND every SFC `<style>`, resolves component
  tags through the import map (kebab → Pascal), strips comments before counting, reds dynamic ids
  and non-literal binds, never treats a `<style scoped>` root selector as global (it compiles to
  `[data-v-x]:root`, dead), and classes a tailed root (`html.theme-turning`) as CONDITIONAL.** A
  masked-default or undefined-token census reads SOURCE, not the CSSOM of one route (the lazy
  chunks are invisible). The census runs as a DIFF (tree minus control). A gate that enumerates
  plants is cured for those plants, not for the class — key on the rule's SHAPE.
- **P5 · A rate or budget gate proves its ablation reds under a 60 Hz rAF shim** or drives its own
  clock ≥120 Hz (this box's 128/100 Hz headless clocks made a born-RED host-conditional); a row that
  exists to prove an interleave deals a state where it happens and asserts it (d/frame > 4). Budgets
  are RATES per second; every consumer in the SAME page through one gate.
- A browserless gate reading a browser artifact STAMPS the SERVED artifact (the index-* names read
  in-page against a fresh build), never src; a message assertion observes the product's throw; a
  unit stub is ISOMORPHIC with the component's bindings; `color-mix(…, transparent)` serialises as
  `color(srgb … / a)`. A painted-contrast row samples the ground the stroke ABUTS. An indicator gate
  reads `outlineStyle`, awaits a flush, and runs a STRANDED control. A RECT IS NOT PAINT. A close is
  a pose. **P5 · A census with a `?? <container>` fallback measures its container when the subject
  is missing — a missing subject goes RED.** **A 100 % ceiling on a fraction is not a ceiling; an
  allowlist ceiling is keyed to the control's fraction + slack, never the tree's own reading + 2.**
  **A derived geometry token reads the live transform, never a literal** (a hover scale baked as
  0.54 in one file and 0.04 in the gate). **A ResizeObserver publisher on a transitioning box
  writes every frame — publish on `transitionend` and at rest.** **Plant every source-shape law row
  at EVERY consumer site**, not only the site that was red.
- `contain: inline-size` needs `scrollWidth === clientWidth` on the scrollport; clip every
  occlusion census to the scrollport and **P5 · sample its scroll POSES** (a STUCK predicate,
  |top − stickyTop| < 0.5, over ≥101 poses — an in-transit tape is not pinned); name the OCCLUDER.
  Press a sticky target with a mouse click at its centre (locator.click scrolls the panel).

## Return
- DATA (the schema): numbers, gaps first, every incident self-declared, the replay route named, the
  fork or ballot rows for the owner with both frames on one payload, every r0 row MOVED named, the
  pre-return battery's table with the control's exit codes, the INTAKE rows (for a mark lane)
  quoted by number as closed/open. Reject your own optimism. The pass-6 number is the CRITIC's,
  never yours.
