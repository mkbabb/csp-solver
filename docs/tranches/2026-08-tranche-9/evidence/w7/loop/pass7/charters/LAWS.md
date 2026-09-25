# PASS-8 LAWS · every T9-W7 lane (read before your charter)

These bind every pass-8 lane beside `pass7/CHAIR-RULINGS.md` (§1–§4), `pass6/CHAIR-RULINGS.md` (+ A.1–A.7),
`pass5/CHAIR-RULINGS.md` (+ A/B), `pass4/CHAIR-RULINGS.md` (+ the `?board=` addendum), `pass3/CHAIR-RULINGS.md`,
`pass7/registry-v7.md` §2 (the fold's twenty rulings) and `intake-owner-2026-09-23/INTAKE.md` §0.7. Pass 6's
LAWS stand where not amended here (the **P4**/**P5**/**P6** marks are kept); the amendments are marked
**P7** (what pass 7 taught). A lane that disagrees carries the objection in its return, never in its diff.

## A · Base, control, worktree
- Base and π control commit: `74a2b5d9`, named in every π row. NO rebase inside the loop (main is at
  `c31a92b9` + the pass-7 record; the wave's fold reconciles once). The HEAD control is the shared read-only
  tree `.claude/worktrees/w7-control` (pre-built dist `index-CubiZsMVSwTc.js`); verify the port by that
  hash, never by a 200; never edit, build or git-touch it — **P5** a read-only `git status` in the control
  is a git-touch; **P7 · a read-only `git status` in a SIBLING's worktree is the same touch** (SIX in FIVE's
  tree): read a sibling's sha from its bank's BANKED.txt, never from its tree.
- **P6 · The INTEGRATED trees are a third arm, read-only** — **P7 · now the PASS-7 ones**: `74a2b5d9 +
  pass7/integrate/s10.diff` (§10, write-tree `ad6dc52c`) and `74a2b5d9 + pass7/integrate/s13-s7-s3.diff`
  (§13, §7, §3, `a4308896`), served by the chair from `git archive` scratch trees outside any worktree.
  Every pass-8 delta in a merged section must `git apply --check` 0 on the integrated tree as well as on
  `74a2b5d9`, or the return names the hunk that cannot. **P7 · A merged-section lane that must land on
  the union (ERASE's fence gate, LEDGER's reserve class, SIX's ink const, FIVE's primitive cures) cuts
  its delta AS a `pass8.delta.on-<union>.diff` too**, rebased by the lane, not left to the integrator's
  judgment (FIVE's three conflicts were resolved by the lane, not the integrator; GRAPHITE's A.7 never
  applied as a patch).
- **P6 · TAB-PEN's base is main `1d0dc4fd` by the chair's waiver** — stands; the waiver dies the moment its
  diff touches `src/`. **P7 · Its worktree carries two FOREIGN untracked entries the chair moves before it
  opens** (`.gfav-scratch/`, a docs copy).
- **P4** · Main-HEAD is the second control for the owner's mark rows only, served read-only from a `git
  archive` scratch tree OUTSIDE any worktree with its own cacheDir.
- Lanes continue IN PLACE in their pass-7 worktree (named in the charter) AFTER the chair verifies its
  bank (`pass7/prototype/<id>/pass7.diff` + `BANKED.txt`, cut by the lane this pass) and writes
  `pass7/prototype/BANKED.txt`. Bank the first lane's diff before a second lane touches a shared tree
  (§13's `-59`: LADDER first, VERB second; §7's union: ERASE first, LEDGER second). **P6 · A bank file is
  never rewritten in place.**
- `git` aimed at another worktree is refused: replay by `git archive` + `git apply --3way` (it STAGES;
  `git restore --staged` afterwards) or `git merge-file` per file, and run the LINE-COUNT check after any
  merge. **P5** rebuild the dist you cite AFTER the last edit. **P7 · Every cut through a temporary index
  sets `GIT_INDEX_FILE`** (LEDGER's `git add -N` marked a lane's REAL index).
- Never commit/push/stash/deploy/publish on the main tree; never `npm install` anywhere.

## B · Servers and the box
- Dev server: 127.0.0.1, the charter port in 4230–4249, `--strictPort`, a two-line scratch vite config
  with a private `cacheDir` naming THIS worktree; the control on the next free port in the band; build and
  serve never share a cacheDir. 4250–4260 are W8's. Re-scan the band immediately before binding. **P6 · The
  cacheDir lives OUTSIDE the project root.** **P7 · Before ANY dist identity is cited, the lane diffs its
  SERVED CSS against a clean out-of-tree build** (VERB cited a Tailwind-contaminated identity — 58 vs 49
  served `@property` from a spec under `web/frontend/.verb7/` — in every row but its ablation; SIX and
  TAB-PEN in pass 6): a `@property` or utility the product does not declare is a contaminated dist, and
  a scratch spec under the project root is the usual source (T9-R6's trap by name).
- KILL BY RECORDED PID. Never `pkill -f` on a shared path prefix nor on a pattern not keyed on YOUR
  worktree. **P7 · A kill on a HELD port requires wrapper ancestry AND the lane's own dist identity on the
  listener** (ERASE killed MRK-LIVE's server by listener PID on a port it wanted): a held port is re-bound
  elsewhere, never freed. STALL LAW: ≤2 workflows on the box; long commands to the background with a log,
  polled every ~60 s; batteries are shell scripts; chunk vitest by directory and playwright by project.
  **P6 · A timing row DECLARES the box load** beside its number — stands (the pass ran 13–751).
- **P5 · NO `rm` OF ANY FORM INSIDE A LANE** (`rm -rf`, `rm -f`, `find -delete`) — **P6 · and no `git
  clean`, `git checkout -- <path>` on a path you did not write, nor `git restore` of a sibling's file**.
  **P7 · A COPIED script is read whole for delete-bearing lines before it runs** (SIX ran a pass-6 critic
  script whose last line was an `rm` of another lane's backups). Scratch lives under UNIQUE, lane-named
  directories in the session scratchpad; a scratch config that must go is `mv`ed to
  `<scratchpad>/trash-<lane>-<n>`. The chair cleans. No `/tmp` (two lanes wrote there).
- **P5 · A hung lane is stopped, never resumed.**
- Serve BOTH arms in one rendering mode. No osascript, no `open -a Safari` (M19). Scratch PW configs live
  in `<worktree>/web/frontend/.<lane>/` and are moved out before return; the worktree's `git status` at
  return = product files, nothing else. **P6 · `vue-tsc -b` on a `git archive` only.** **P7 · A battery runs
  on a tree that is NOT EDITED until it ends** (the s13 integrator voided three rows); a plant script is
  syntax-checked (`ast.parse` / `node --check`) with its stderr captured beside the verdict before a
  battery uses it (PLACE's unquoted heredoc ran three steps unplanted; TAB-PEN's backticked heredoc ran
  `tail`).
- **P5 · zsh does not word-split `"$s"`**: use `${=…}` or bash in battery loops (three lanes hit it again).

## C · The record
- Frozen: `loop/r0/`, `pass1/`…`pass6/`, and now `pass7/`. Pass-8 evidence lands ONLY under
  `evidence/w7/loop/pass8/<stage>/<familyId>/`. An instrument you run is COPIED with its OUT re-pointed; an
  instrument whose subject your design moved is a PROPOSED diff under `pass8/<stage>/<id>/instruments/` and
  the row reported MOVED. Never re-word a gate to pass.
- **P7 · THE INSTRUMENTS HAVE PRODUCT HOMES (registry-v7 §2.4).** After batch 0, the ONE copies live at
  `web/frontend/scripts/shape-census.mjs` and `web/frontend/e2e/lib/{paint-lib,glyph-pop,edge-bands,postpaint,
  rest-probes}.mjs`, banked as `pass8/instruments/homes.diff`; every lane applies it by sha at open and
  imports by RELATIVE path. A product spec or script that imports from `docs/` is a fold blocker and the
  critic reds it; a hand-rolled port or a fork of any instrument is a row against §I; an extension goes
  to the ONE copy as a PROPOSED diff WITH its plant, never into the lane's own reader.
- Numbers and text first. At most FOUR cited crops ≤150 KB per family; every frame names engine · theme ·
  viewport · POINTER CLASS · DPR and the payload; a pass-8 crop is a REPLACEMENT naming the pass-7 or
  pass-6 crop it retires. **P7 · THE WAVE'S HEADROOM IS PRICED IN THE REGISTRY (§2.18: 151,826 B after
  the chair's sweep) and every crop a lane banks is charged against it BY NAME in the return; a lane that
  banks a crop that crosses the cap has banked nothing (FIVE's two frames alone crossed it), a lane checks
  `check-evidence-policy` bare before it banks, and a ballot id is NEVER re-used for a different variable
  (SIX's `T9-B-ACC6-2`).** **P6 · A ballot arm is FRAMED where it differs from BOTH other arms; a caption's
  DPR is the frame's** — stand. **P7 · A pair's caption names EVERY variable the arms carry** (RULE's
  'the only variable is the page' hid FACE's chip voice, the pencils grouping and the centred deal).
- `?board=` is a codec payload, not a name (P4); every π row and ballot frame STATES its payload (P5).
  **P6 · Every painted-text row in §11/§11c pins B's peer id (`p-0000000b0b0b`)** — **P7 · and the pin
  reaches every STROKE the id seeds** (COUNT's solo stroke is `seedFor(r.id)` over 97 poses; parking the
  pose does not park the stroke): a row that reads ink pins every id on the page.
- An owner's mark is a U-10 row in the owning charter whatever the number; both portfolio designs are ARMS
  to build and frame; INTAKE-22 §7 AND INTAKE-23 §4 are quoted by row number, each closed/open, in every
  mark lane's return (P6) — **P7 · and 'CLOSED' means every ARM of the row's own gate was run** (TAPE's
  row 20 claimed CLOSED with three arms unread).
- **P6 · A born-RED that lands from PROPOSED is re-run on the FINAL file's sha1; a BANKED.txt sits beside
  every bank** — stand (every lane shipped one this pass; the chair verifies).
- **P7 · A record claim about a frame is checked against the frame** (COUNT's 'all three arms paint
  identical pixels at six' is false of its own crop 1).

## D · Paint, post-paint, and what a reading is
- **P6 · A first-frame, drift, interval or rate row reads POST-PAINT** (a MessageChannel task queued from
  the rAF, or the chair's recorder) — stands. **P7 · Beside the frame-1 skip plant it ships the FRAME-2
  plant** (a mover that holds frame 1 at rest and jumps 150 ms on frame 2 passed VERB's GA1 6/6 in WebKit
  while WebKit's own CI column read exactly 150.0), and the clock identity is GATED in WebKit at the same
  ±2 ms wherever its CI reads clean. **P7 · A post-paint read of a swap or push counts the leaving NODE's
  lifetime and the frames on which the sentence is painted twice**, never only the entering node.
- **P6 · A publisher parked on a transition un-parks when `getAnimations()` is empty one rAF later; a
  regime measured at OPEN re-fits on resize at rest** — stand (both CURED this pass on FACE and SELF/PLACE).
- **P6 · A touch-click guard keys on the event SEQUENCE** — stands, **P7 · and the DEBT HAS AN END**: a flag
  set in the release handler is forgiven by the next click OR a task/timestamp bound (WebKit sends NO
  click after a prevented tap, so an unbounded debt swallows the next press-less activation — the shape of
  an assistive-technology click). A row taps, waits, sends a press-less `el.click()` and expects ONE toggle
  in both engines.
- **P7 · A predicate with a `left <= x` or `top < y` disjunct is SWEPT across each clause's threshold**, not
  read at the named cells only (SELF's cliff sits between 700 and 712 wide: 1/4 → 4/8). A regime keyed on
  a box reads the WIDEST board it can hold (§E).

## E · Constraints on every design
- M16 plain copy; the filterBudget never grows (both themes, at rest AND at boot — the crayon-heart
  deletion is RATIFIED and rides `s13-s7-s3`; every lane cites the census as tree vs `74a2b5d9`'s dist);
  π identity on every unclaimed surface against the named control, WHOLE-DOM with an in-run floor;
  W2's mechanics LANDED; U-10; the decided-history laws; the dock sheet SLIDES.
- **P6 · Existence is not visibility, in text as in rings** — stands whole (four bands, the whole glyph
  population, the absolute floor, FAINT + TAIL plants). **P7 amendments, each a pass-7 instance:** (i) a
  paint row that emulates a media regime to settle its photograph (PRM, a theme, a pointer) ALSO reads the
  verdict under `no-preference`, `pointer: coarse` and `prefers-contrast: more`, in BOTH themes, and plants
  in the arm it does not emulate (LIVE's G-LIVE-23/16 read the ring only under `reduce` at fine with no
  contrast preference; SELF's four-band row ran light only); (ii) every ring gate gains a per-band
  THICKNESS clause (≥ 2·DPR painted px) with the 1 px plant (FACE's ring read 4.289 GREEN at
  `outline-width: 1px`); (iii) a forced-colours row COUNTS PAINTED PIXELS (a `clip-path: inset(0)` keeps
  every computed outline property green while painting 0 px); (iv) a relative reference clause plants the
  previous ink through `stroke-opacity`, the path's own `opacity` and `filter: opacity()` — a reference
  photographed by re-stroking inherits all three (RULE's M18 held the R55 token and passed the R55 ink);
  (v) the glyph-population probe ships a HEAD plant beside TAIL (a leading digit is the costliest glyph to
  lose; p95 per window is blind to a fade over < ~95 % of a window — COUNT's HEAD12F GREEN 6/8), keys its
  Range to the TEXT NODES (skipping svg/hidden descendants; an inline svg made TAIL12 a no-op on FIVE's
  guard and TIN's label), compares BOTH the ON and OFF pairs for transient pixels, scales its column count
  to the ink span (16 columns blind G4 under ~8 px of ink), and bounds G3 PER PAYLOAD or per read (a
  pooled fraction masked a WebKit FADE65); (vi) a dashed ring's station width decides WebKit's verdict
  (TAPE: 1.23–2.07 at station 1 vs ≥ 3.338 at station 8 on one photograph) — the chair rules the station
  ONCE for the estate with a dash-thinning plant, and no lane re-parameterises the probe to pass.
- **P5 · AA on TEXT is the GLYPH-TEXT statistic; P6 · the hand's tag rung is T9-R8 (both themes)** — stand;
  **P7 · T9-R8 has a SIBLING**, the icon-sublabel rung (`#737373` Patrick Hand 14.048 px: 4.28–4.46 light on
  the control, `keys` 4.400/4.338), cited by that phrase until the chair mints its id; no lane re-cures
  either ink locally. **P7 · A painted-text gate on a 0 px-tall box clips to the text Range** (SIX's count
  line reads G1 EMPTY on the box).
- **P6 · A monotone clause samples the WHOLE range; a reused copy line keeps ONE referent** — stand (COUNT
  cured both). **P7 · An aria-only copy line is exempted from the PAINTED corpus by name** (`LOBBY_COPY.plus`).
- Coarse rows run with `hasTouch: true` in a witnessed regime; 844×390 and 812×375 are W2 §2.2's cell;
  read the widest board's copy (16×16) at 812×375 (P5). **P7 · ANYTHING sized by `useBoardShape` (the
  chart, the tally, a per-board sheet) reads the widest board at every cell it names, and a cost written
  'at every cell' names its board size** (PLACE's '+77.11 px' is 9×9-only; 16×16 is +151.76 and laps 88
  cells). **P7 · A regime keyed on `pointer` is a proxy for the box** (GRAPHITE's rig key reds every large
  1× touch board): key paint on the box's device-pixel span. **P7 · Any lane citing CH-71's desk lap
  re-reads it at rest** (SELF's sheet laps 4 cells at 1280×800, not 2–3).
- **P5** `env(safe-area-inset-bottom)` is measurable in chromium (CDP); the WebKit arm is the flat phone
  at inset 0 and SAYS so.

## F · Gates
- Every gate runs BARE; a born-RED row is demonstrated on THIS tree with its negative in the same run;
  every re-cut gate SHIPS WITH the negative that reds it; the critic runs the previous pass's plant FIRST
  (P5); an interleave row ASSERTS on its green run (P6).
- **P6 · THE SHAPE LAW** — stands whole, **P7 with three clauses added (registry-v7 §2.5), the class on its
  FOURTH pass in six trees:** (i) a source-shape gate IMPORTS THE ONE LIBRARY at its product home and never
  carries a second reader (the critic reds a fork on sight); (ii) a re-cut gate ships a CLAUSE-SABOTAGE
  battery — delete each clause in turn and the self-test must red (LEDGER's R2, R3's seat context and R3's
  `!important` had no plant); (iii) every source law pairs with a BEHAVIOURAL row on the real surface (a
  RECT or a paint read) that ships the plants no source reader can see (`display: contents`,
  `:first-child`, `[role]`, a tag, a Tailwind arbitrary property that SHIPS). The library's READ set after
  batch 0 (each with its plant): case-insensitive `var(`, `${}` stems as EVERY stem, concatenation folded,
  `:is()`/`:where()` arms as alternatives, computed `setProperty` names as `?` sites, const-carried values
  resolved or red, `@import` chains followed, `public/**` + `index.html` + `.pcss`/`.postcss` walked,
  HTML-comment decoys stripped, entities (`&#35;`) and CSS escapes (`\62`, `\-`) decoded before any id
  regex, `url(${base}#${id})` bound, an unresolvable tag = UNRESOLVED (never a non-painter), spread/
  computed keys in `h()` and `createVNode` as `v-bind=obj`, a barrel alias followed, a pin with its bind
  set, Tailwind arbitrary properties `[--tok:v]` and `@property` preludes (`initial-value`, `inherits`) as
  declaration SITES, a media query EVALUATED over the regime set (never matched as text — `not all and`,
  an unsatisfiable conjunction, a single-orientation block are the plants), an em/lh value RESOLVED against
  the consumer's own font-size/line-height, a `<style>` inside `<script>` never read as a stylesheet, the
  subject compound RESOLVED TO TEMPLATE ELEMENTS with VALUES read on whitelisted props (an extra class on
  the element, a structural selector, a `top`/`inset` that erases the edge — TAPE), a regex-literal-aware
  JS stripper (26.2 % of shipped JS was blind), relative colour syntax (`oklch(from …)`) resolved, a
  MUST_CLOSE-style pin over EVERY extractor feeding the surface with a split-group plant.
- **P6 · A ratchet's TS arithmetic is ratcheted** — stands; **P7 · a ratchet keys on the SUBJECT COMPOUND,
  never the exact prelude** (LADDER's B6 skipped a compound override as 'a new position with nothing to
  shorten' while the reveal shipped 300 → 150 ms with every gate at 0); `collect()` walks `index.html` and
  `public/**`; longhands and semicolon-less last declarations are declarations; a clock read inside
  `Math.min`/`max`, a bracket access or a bitwise operator is arithmetic; a script `setProperty` of a
  curve token is a publisher; a measured token (`--live-fit`, FACE's lengths) has ONE writer and any other
  declaration reds; TS consumers of `MOTION.*` are banked and ratcheted like CSS sites.
- **P6 · A rate gate proves its cure on ≥ 5 runs per engine with the minimum gap printed** — stands;
  **P7 · a rate cap or budget is a RATE PER SECOND keyed on the OBSERVED frame interval, never a per-frame
  constant, and every rate row reads 60 Hz AND 30 Hz in both engines beside the driven clock** (VERB's hand
  reads 30 Hz as a stall every frame: 4.7 s to the digits; FIVE's whole-ms +1 floor drops a true 60 Hz
  WebKit panel to 40.2/s); **an upper bound alone is not a rate gate** — ship a FLOOR clause (≥ 0.9 ×
  min(panel Hz, 62.5)) with the slow plant; **A.6 binds the FRAME clock, the DOM gap is PRINTED beside it,
  and a DOM red in ≥ 2 of 10 runs per engine is a defect to NAME** (registry-v7 §2.7d); a consumer that
  moved its first write out of the inking flush reads post-paint for a whole-then-empty frame.
- **P7 · A `<Transition>` `@before-leave` that writes `animation-duration` inline reads the leave's
  COMPUTED `animation-name` first**: a name-switched leave with `animation: none` is a zero-length leave,
  and Vue's `getTransitionInfo` reads the duration and never the name (ERASE's hook held every HOLD push
  ~160 ms with the sentence on both lines). The fence is keyed on the computed name, never the transition's
  name string, and the drop-clock row reads BOTH leaves (the note leave and the swap leave).
- **P7 · A browserless stamp keys on the build's MODULE GRAPH, never a hand list** (FACE's STAMP_FILES
  missed `scene.css`, the file the pass edited); a stamp's `sha` names the BASE, never a scratch HEAD.
- **P7 · Every painted cure whose paint gate is local (O-12) owes a browserless CI PIN at its least passing
  value**, with a coordinated sheet-plus-module move as the negative (WALK's cure passes CI at
  `NAME_BANDS[1] = 0.80`).
- **P7 · An e2e row DRIVES THE PRODUCT** and never writes into a Vue-owned node (SIX's injected span
  survived the product's patch and the row read its own artifact: 2 spans, 41.59 px, a false gap).
- The pre-return battery is the WHOLE spec file a row lives in plus `lint:lanes`, `lint:theme-tokens`,
  `lint:sleep`, `lint:bands`, `lint:verbs`, `test:e2e:projects`, `check-pw-projects`, `check-property-block`
  (source AND served), `eslint .` (0 warnings too — LIVE shipped 4), `npm run lint`, `lint:knip` (VERB
  inherited a red with no knip row), each bare, each with the control's exit code beside it; a red you
  inherit is DECLARED with the control's reading.
- THE @PROPERTY LAW (P4/P5/P6) — stands; **P7 · the registration row walks EVERY Vite CSS language
  (`.pcss`, `.postcss`) and keys its script clause on any `registerProperty(` in code** (a `.pcss` sheet
  shipped `inherits:false` past ERASE's row; only `check-property-block --dist` saw it).
- **P5 · A source-text census as a DIFF; P5 · a rate gate under a 60 Hz shim; the RECT-is-not-paint set** —
  kept whole.

## G · Ballots and the owner
- A ballot's firing default must not lose to the control on the same painted statistic (P5); a ballot
  names the LOSS of its default where it loses on any measured axis (P6) — **P7 · and the CONTROL is HEAD's
  SAME-INDEX ink, never HEAD's best hue** (TIN's 10/72 loss was read against `oklch(0.8 0.11 137.5)`); a
  ballot's default is the SHIPPED const and the record says so (SELF's B-SEAM read (a) in the registry and
  (b) on the tree); a ballot id is never re-used (§C); a ballot with a timed arm frames the default at its
  LOSING instant (VERB's +100 ms was the hinge's best); an arm 'built on the chair's or owner's word' is
  NOT built by a lane's own charter (P6).
- T9-B29, T9-B30 (v6) and T9-B24–B28 (INTAKE-23's numbering, registry-v7 §2.16) are the minted names;
  every other loop ballot keeps its loop name until DISPOSITIONS §2.

## H · Retirement and the record's shape
- A retired family's tree is a RECORD, never deleted; its grafts are rows in the absorbing family's charter.
- **P6 · The §7 pair watch is MET; retirement is DEFERRED to T9-B-LEDGER** — stands; **P7 · the retiree is
  the family whose number is LOWER at the pass the owner answers, and the union is the design either way**
  (registry-v7 §2.3a).
- **P7 · A BLOCKED family's tree is a record while blocked; its proven strengths travel as grafts NOW**
  (GRAPHITE's wash and OUTSIDE tally → ACC-SIX); it re-opens only on the unblock condition the registry
  names (§2.2), never on its own word.
- **P7 · A non-leader product change landed by an INTEGRATOR (the SWAP fence, S2) is provisional: the
  owning lane gates it by the next batch it runs in or the fold reverts it — never silent.**

## I · Instruments
- **P6 · The chair's instruments are the ONE copy** — stands; **P7 · they have PRODUCT HOMES after pass 8's
  batch 0 (§C)**, every lane re-points at open, and the chair's lane FOLDS every family's PROPOSED
  extension with its plant into the one self-test (registry-v7 §2.4 lists them by family). A family row
  that re-implements, ports or forks one after batch 0 is a row against this law and the critic reds it;
  a lane that needs a shape the library does not read extends the ONE copy in a PROPOSED diff with the
  plant that reds it.

## J · Incidents (each a law by name)
- The kill on a held port (§B). The copied script read whole (§B). The sibling's `git status` (§A). The
  temporary index by `GIT_INDEX_FILE` (§A). The served CSS diffed before a dist is cited (§B). The plant
  script syntax-checked (§B). The battery on an unedited tree (§B). The e2e row that injects (§F). The wave
  headroom charged by name (§C). The record claim checked against its frame (§C). Box load declared (P6
  §B). The bank never rewritten (P6 §A).

## K · Return
- DATA (the schema): numbers, gaps first, every incident self-declared, the replay route named, the fork
  or ballot rows for the owner with both frames on one payload and every variable the pair carries, every
  r0 row MOVED named, the pre-return battery's table with the control's exit codes (knip and eslint
  warnings included), the INTAKE-22 §7 and INTAKE-23 §4 rows (for a mark lane) quoted by number as
  closed/open with every arm of each gate run, the box load, the sha1 pair (battery/bank), `git apply
  --check` on `74a2b5d9` AND (merged sections) on the integrated tree AND the lane's own rebased
  `on-<union>` delta, the wave headroom the lane's crops spend, every instrument's import path (relative,
  product). Reject your own optimism. The pass-8 number is the CRITIC's, never yours.
