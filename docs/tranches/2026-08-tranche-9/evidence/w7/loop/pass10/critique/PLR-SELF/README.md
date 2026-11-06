# PLR-SELF · pass 10 · critique (§11, the self mark)

Critic: not the charter's author, not the prototype's. Subject: the lane tree `.claude/worktrees/w7-p4-PLR-SELF`
(at `74a2b5d9`, advanced in place, nothing committed) and its bank under `pass10/prototype/PLR-SELF/`. Critic
scratch: the lane-unique durable dir `crit-PLR-SELF` under the repo's t9 work dir (every archive with its own
`git init`). Ports: tree `:4241`, control `:4259`, each started only inside a guarded playwright run's own
webServer. No commit, stash, push, deploy or install; no git on main or in the control tree.

## 0 · Numbers first (re-derived by the critic, exits read bare from files)

| row | critic's reading | agrees with the lane? |
|---|---|---|
| open state | lane tree through a temporary index (critic's own index file): 39 paths vs `74a2b5d9`, +14,472/−403, write-tree **`e855ff06`** | yes (BANKED "with homes v3: e855ff06") |
| bank = tree | the tree's diff over the bank's 26 paths, `--binary`: sha1 **`c6e830c6`**, `cmp` IDENTICAL to `pass10.diff` | yes |
| homes v3 by sha | the 13 non-bank paths are exactly `homes.diff`'s 13 (`e2e/lib/*` ×10, `knip.json`, `scripts/shape-census.{mjs,d.mts}`); a fresh `74a2b5d9` archive + `homes.diff` `07257854` + `pass10.diff` reproduces the lane tree **blob for blob on all 39 paths (0 mismatches)** | yes: no residual home edit rides the bank |
| apply, bare `74a2b5d9` | `pass10.diff` exit **0**, 26 paths (git dir = the archive's own `.git`) | yes |
| apply, `74a2b5d9` + homes | `homes.diff` 0 (13) → `pass10.diff --check` **0** (26) → applied | yes |
| apply, bare WAVE `954bbbab` | `pass10.delta.on-WAVE.diff` **0** (8); `pass10.diff` **1** (`join-language-prm.spec.ts:79` first) | yes (the delta is the WAVE route) |
| apply, WAVE + homes v3 | `homes.on-WAVE.diff` `0723d508` 0 (10) → archive tree **`72b7ad67`** → delta `--check` **0** (8) → applied → **`a9e00185`** | yes, both trees by sha |
| delta blobs | the 8 WAVE+delta blobs (`e7d92ffd` `849d0a3d` `4c6dcc26` `0554ac9a` `49d7b2a9` `ef87690c` `031f9471` `3842338a`) hashed in the critic's archive | yes, 8/8 = BANKED.txt |
| pass-10 advance | pass9 bank replayed on a fresh `74a2b5d9` archive vs the pass-10 replay: 4 of 26 paths changed (`player-mark.spec.ts` 132 lines, `rowBudget.ts` +7 comment, `pencilConfig.ts` +1 comment, `node.d.ts` +6 shim) | yes (product bytes = two comments) |
| bank grep | `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch`, `/Users/mkbabb`: 0 in both diffs, BANKED.txt and README; dot-dir on a `+++` line 0 | yes |
| lint gates, WAVE + delta (bare) | bands **1** (✗ B11 ×1, ✗ B13 ×2; ✓ B2, ✓ B5 PRM, ✓ B6), `publish-verbs --check` 0, verbs **1** (34 admissions, stale 0, laundering 0; only `PlayerLobby.vue:142/:143`), theme-tokens **2**, sleep **1**, copy **0** | yes, every exit |
| thickTol refusal (the pass-9 plant, first) | critic's browserless harness on a copy of homes v3's `edge-bands.mjs`: `{drawn:'head-sheet', thickTol:0.5}` THREW "a typed thickTol (0.5) … lane-chosen parameter"; `{thick:1}` THREW; plain `{drawn}` accepted. PLANT (the one refusal line struck, `od -c` verified): thickTol 0.5 **ACCEPTED**; restored, `shasum -c` OK | the refusal bites (browserless half only) |
| authoredStroke | `head-sheet` → width 1.5, widths [1.5], why [] on the lane tree; `DRAWN_PLANTS` keys `THIN_1PX,P055_0.825px` | yes |
| unit, lane | `rowBudget.test.ts` **8/8** (light, single file) | yes |
| typecheck, WAVE + delta | `tsc -p tsconfig.e2e.json --noEmit` exit **0** (light) | yes |
| WAVE `:595`'s death (cited, not re-read) | WAVE9-read's own JSON (`json-dev-P13-cr-player-mark.json`): chromium FAILED at 29,137 ms inside `settled()` (`player-mark.spec.ts:83`, poll "Expected 0, Received 32"), called from `cellPage` at the cell on `:643`, "Test timeout of 30000ms exceeded" | supports the lane's "a budget death, not a verdict" (the control dev: `timedOut` 30,022 ms) |

## 1 · The pass-10 advance, read as code (what the diff actually does)

The advance over pass 9 is four files on the lane tree (`player-mark.spec.ts` the only behavioural one) and eight on
the WAVE. Read line by line:

1. **The roster SKIP is gone, and absence is a load-time red.** `import { DRAWN_FRAMES, DRAWN_PLANTS, … }` is a
   named import; `const ROSTER = 'DRAWN_FRAMES' in edgeBands` and its `test.skip` are deleted. The row pins
   `DRAWN_FRAMES['head-sheet']` to the literal `{ width: 1.5, sites: 1 }` and passes `drawn: 'head-sheet'` with no
   typed `thick`/`thickTol`. The P055 plant is derived (`0.55 × roster.width`), but the width it derives from is
   pinned to 1.5 by a literal assertion in the same row, so LAWS P9 §F's "a ±ε plant is a literal pin" holds by the
   pin, not the derivation. **Met in code.** Real-surface reading: §2.
2. **The area clause is kept and witnessed, not cured.** `drawSheet` gains `below` (the board's lowest cell bottom
   minus the sheet's bottom) and `areaMoot` asserts `below > 0` wherever `rows === 1`. The clause stays in
   `rowBudget.ts`, deciding nothing on any real cell (the lane says so: "LAPONLY GREEN by construction"). The
   witness is a precondition, not a gate on the clause; its bound is 0 and the least `below` is unread. Charter row 2
   offered "state the unreachability WITH THE NUMBER": the statement landed, **the number did not**.
3. **`:546`'s budget**: `test.setTimeout(PHONE_CELLS × 30 s)` with `cells === PHONE_CELLS` asserted and the
   1-minute load annotated head and tail. **Met in code**; the WAVE's own death (above) was exactly this class.
4. **The far edge**: `farClick` fires `el.click()` in the page on the first rAF with `now − pointerup.t ≥ 300`,
   and `forgiveRow` asserts `300 ≤ gap < 350`. `TAP_CLICK_MS = 350` (`PlayerMark.vue:141`). Pins the window only
   to "≥ ~300 + one frame": a window cut to 320 ms likely stays GREEN on the cut arm (unread either way).
5. **The CUT arm, dev-only**: `forgiveRow` opens with `test.skip(!(await devServed(browser)))`, keyed on the presence of
   `script[src*="/@vite/client"]`. **This skips the CLEAN arms too**, so the forgiveness rows now read nothing on the
   shipped dist, where pass 9 read the clean arms (and the cut arm red by hits 0). It is a presence-keyed skip with
   no plant of its own, the species pass 9 struck from the roster row. LAWS P9 §B licenses a dev-only label for a row
   that CANNOT run on a dist; the clean arm can. See gap 3.
6. **WAVE seams**: `presenceInkMs` EXEMPT `{ ms: 400, why }` in `check-motion-bands.mjs` (the chair's B-INK-RUNG
   (b)); both self-admissions struck from `check-pencil-verbs.mjs`; the mark's turn re-spelled
   `color var(--presence-ink-dur) var(--verb-layDown-ease)`; PRM moves from `transition-duration: 0s` on
   `.player-mark, .pt-stroke` to `--presence-ink-dur: 0s !important` on `.player-mark`. `.pt-stroke` sits inside
   the button (`PlayerMark.vue:584`→`:615`), and the token is unregistered (no `@property --presence-ink-dur`), so
   it inherits, and the `!important` sheet rule outranks the inline `:style` binding. **Equivalent by construction;
   no browser row read it** (the row that would is `join-language-prm.spec.ts:92` `markTransition`, on WAVE + delta).
7. **The curve change is a motion move.** `--ease-standard (0.4,0,0.2,1)` → `--verb-layDown-ease (0.32,0.72,0,1)`
   over the 400 ms join turn. The rest pose is unchanged, so π at rest is unmoved, but the turn's mid-frames move.
   The lane declares it in §7 by construction. No frame, no reading. It was chosen to clear a gate (charter row 4
   allowed "a named verb"). That leaves the verb's fit to a colour turn as an unpriced design choice, not a cure.
8. **F1** (`useSession.test.ts:446`): the first half now asserts `toEqual({})` under BOTH arms (a room of one binds
   nothing), and the adoption half still keys on `SELF_TAKES_A_HAND`. That is consistent with CHAIR §9 and SELF's
   own e2e row 1 ("rests graphite alone"). The re-authored half no longer separates the arms; the ballot pair is
   held by the adoption half alone.
9. **The state-line row** (WAVE + delta): `ARM` is regexed off `App.vue`'s `PLACE_CHART` and `PlayerMark.vue`'s
   `CHART_YIELDS`. The row follows whatever arm ships, as CHAIR §9 requires. Its only arm-free content is
   "line + chart = 1 in a room" and "alone: the line". Unread in either engine.

## 2 · The critic's own plants (browserless; WAVE + homes v3 + delta = `a9e00185`; each one variable, restored by sha1)

The bare exit of `lint:bands` and `lint:verbs` is already 1 on this tree (B11, B13 ×2; PlayerLobby ×2, not §11-mine).
An exit therefore proves nothing here. A plant bites only when the gate NAMES it. Raw outputs are kept in the
critic's scratch logs (`sab-<name>.raw`).

| plant | class | gate | named? | reading |
|---|---|---|---|---|
| `presenceInkMs: 399` (the member, −1 from the EXEMPT `ms`) | threshold (the lane ran +1) | bands B2 | **yes** | "ships 399ms; its EXEMPT row says ms: 400 — an exemption licenses ONE value" + the NN REGRESSED |
| a sibling `presenceInkEchoMs: 400` beside the member | disjunct (does the exemption launder the value or the key?) | bands B2 | **yes** | "MOTION.presenceInkEchoMs = 400 is a duration outside the ladder and outside the exemptions": the exemption is key-bound |
| the EXEMPT row's `why` emptied (`"" \|\| "x…"`) | clause (the "with its cite" half of B-INK-RUNG (b)) | bands B2 | **NO** | B2 ✓; only the pre-existing B11/B13 red. `b2Closed` validates `ms`, never `why`: **the cite the chair's default requires is not gated** (gap 5) |
| `var(--verb-nosuch-ease)` for layDown | clause (a named verb that does not exist) | verbs | **yes** | `PlayerMark.vue:685 there is no verb called nosuch` |
| the PRM block struck whole | clause | bands B5 (+ verbs) | **yes** | "[B5 PRM] ONE PRM-FALLBACK row consumes TWO reduce-block sites — the ledger still holds 2 rows, the tree tweens 3" |
| `!important` dropped from the PRM token (the inline `:style` then wins: a real PRM hole) | disjunct (cascade) | bands B5 | **yes** | the same B5 line: B5 counts the tween sites, and the reduce rule no longer zeroes the length |
| F1: the pass-9 assertion restored (`length > 0 ↔ SELF_TAKES_A_HAND`) | born-RED of the re-author | vitest `useSession.test.ts` | **yes** | F1 ✗ (with U3/U5), 3 failed / 16 passed / 31 skipped under `-t "k. adoption"`; clean file **48/50**, F1 GREEN, U3 `:691` and U5 the PAL-TIN rows |
| `thickTol` refusal line struck in a lib copy | the pass-9 plant (charter row 1) | `fourBands` | **yes** | clean THREW / planted ACCEPTED (§0) |

## 3 · Constraints (π, AA, filterBudget, M16, @property, the ballot pair)

- **π vs `74a2b5d9`, lane tree**: the critic hashed every `web/frontend/src` file of the pass-9 replay against the
  pass-10 replay: **2 files differ** (`rowBudget.ts`, `pencilConfig.ts`), both comment-only (§0). The lane's product is
  pass 9's, so its π is pass 9's line, plus the `ul.players-roster.sr-only` flex→block row it now declares. No
  build ran (neither lane nor critic): **by construction, not read.**
- **π on the WAVE**: the delta's CSS is the 400 ms turn's curve and the PRM token. The rest pose is unchanged, and the
  turn's mid-frames move (§1.7). **No frame, no reading.**
- **AA (painted)**: no new ink or colour in either diff (grep of the delta's `+` lines: 0 colour literals, 0
  `oklch`, 0 hex). No painted-AA row ran. T9-R8 carried.
- **filterBudget 9**: 0 `filter` declarations in either diff (the two `.filter(` hits are JS array calls).
- **M16**: `check-copy-register` 0 on the lane tree (critic's run) and on WAVE + delta (critic's run).
- **`lint:sleep`** read on the bank: lane 0 (critic's run); WAVE + delta 1, which is the bare WAVE's three
  (SIX's/LEDGER's), none in `player-mark.spec.ts`.
- **The @property law**: `--presence-ink-dur` is unregistered on the WAVE (no `@property`), so the PRM zero inherits to
  `.pt-stroke`. Registering it later with `inherits: false` would silently un-zero the tally's strokes under
  reduce. B5 reads the reduce block's site count, not the inheritance (the `!important` plant shows B5 bites on the
  cascade; an `inherits:false` plant was not run).
- **The ballot pair on one payload**: B-INK-RUNG, F1 `SELF_TAKES_A_HAND`, B-CHART, B-NAMES. **No frame exists for any
  of them** (`frames: []`). CHAIR §9 requires F1 "framed on one payload". **Not met.**

## 4 · The browser column: the critic's reads (lane tree `e855ff06`, dev `:4241` inside the run's own webServer)

Run `lane-cr`: chromium, `--workers=1`, one guarded call (browser pool), the four rows this pass wrote or re-cut.
Queued 16:13:16 and admitted the same minute. zone inuse 14,595 at head (< 8M), 1-min load 8.77 at head, 5.4 to 17.2
over the run. A first attempt at 16:05:22 (admitted 16:12) died before any test on the critic's own rig (the
webServer's cwd doubled the config path). No reading came from it (incident 1).

| row (lane tree) | chromium | reading |
|---|---|---|
| `:571` "a portrait phone compresses exactly where four rows would lap the board" (pass 9's `:546`, now keyed 240 s) | **RED** | **Test timeout of 240000ms exceeded** at the **360×800** cell (`:606`). `invite()` (`:89`): the verb `.controls-card button[aria-label="Play together on this board"]` is "not visible" on 443 retries after `invite` clicked `.drawer-tab`. The frame at failure (360×800) shows the dock SHUT, its "controls" tab drawn. The 390×800 cell before it completed (frame: 7 players, one row, "and 6 more", nothing lapped). **The keyed budget did not cure the row.** Its death is `invite`'s drawer race, the same infrastructure failure the pass-9 critic logged on its `GE` plant ("invite's drawer never hid"). At load 5–17 it waited the whole 240 s instead of 30 s. That is the class (an infrastructure hang in the row's own helper), not the budget, and it is uncured. |
| `:658` "the row budget adds rows only where they grow nothing over the board, on both axes" (KEY_CELLS + `areaMoot`) | **GREEN** | passed. The least `below` annotation was not captured (line reporter only on this run; the WebKit run carries the JSON reporter). |
| `:1138` "a press-less click at the far edge of the debt's window toggles once" (NEW) | **RED** | **`S1 own clean gap 0 ms · pointerup:touch@0 click:touch@0: at or past 300 ms` — Expected ≥ 300, Received 0**, on the CLEAN arm. Root cause, read in source: `farClick` fires `document.querySelector('[data-player-mark]').click()`, the FIRST mark in the DOM. App mounts TWO `PlayerMark`s (`App.vue:830` desktop, `:851` mobile), and the debt rows run on a coarse phone. `debtPage` logs events only for the VISIBLE mark (`mark(page)` filters `visible: true`; the listener keys `el.contains(e.target)`). The far click lands on the hidden desktop twin, never enters `__ev`, and `gap` reads the tap's own click (0 ms). **The row is red by construction**, banked unrun, and COUNT/PLACE take its blob (`725f06d1` lane, `849d0a3d` WAVE) by sha. |
| `:1184` the four-band row (folded roster, THIN_1PX + P055) | pending at this write | §4a |

### 4a · The four-band row, chromium, and the run's exit

- `:1184` "both head disclosures paint a drawn edge on all four sides and no CSS border, in both themes": **GREEN in
  chromium** on the lane tree. This is the first real-surface reading of the folded roster. The row asserts
  `DRAWN_FRAMES['head-sheet']` = {1.5, 1}, CLEAN not red, and every in-run plant RED, including THIN_1PX and
  `P055_0.825px` on every regime and both themes. It passed, so in chromium every plant red and the clean edge read
  GREEN (per-plant annotations were not captured on this line-reporter run).
- Run `lane-cr` **exit 1** (read bare from its `.exit` file): 2 failed (`:571`, `:1138`), 2 passed (`:658`, `:1184`),
  6.2 min. Tail: zone inuse 14,637, 1-min load 6.89. The webServer died with the run. `:4241` was not listening after.
- **The chromium tally of what this pass wrote: 2 of 4 rows red.** One is new and born broken (`:1138`). One is
  re-cut and still red, on its helper (`:571`).

## 5 · The chair's picks and the §8.1 row, judged

- **PICK 9 (no default moves; the union's test follows the shipped arm; F1 an owner's ballot framed on one payload).**
  No default moved: `SELF_TAKES_A_HAND` true, `PLACE_CHART` true and `CHART_YIELDS` false, all read off the WAVE.
  The F1 re-author follows the shipped arm and its born-RED holds (§2). **The frame is missing**: F1 is not framed
  on one payload, and no frame was shot at all. **Partly met.**
- **PICK 10 (B-ROSTER folds per pass-9 ruling 7, thickTol refused, tray-well consumer; struck if not folded both
  engines on a non-author run by batch 0).** FOLDED by the chair on CHECK.md §6c (non-author, both engines;
  `struck-10.diff` `4f5effd2` into homes v3). The refusal bites (critic's browserless plant, §0). The four-band row
  consumes `head-sheet` and reads GREEN in chromium with THIN_1PX/P055 in-run (§4a); WebKit is in §4b. The
  tray-well consumer is the library's `--roster tray-well` (exit 1 on control and tree, both engines, CHECK.md
  rows 114/128). That is a §6 red on site 1 (B2 bottom, occluded by `div.action-bar`) and site 2 (B3 top
  0.83–0.84), so the roster entry is consumed by a reading that is permanently red on both sides. **Met as
  folded. The roster row stands** (not struck).
- **PICK 11 (B-INK-RUNG, default (b) EXEMPT with its cite; B-SEAM keeps its own variable).** EXEMPT `{ms: 400}` is
  bound to its value (±1 both sides red) and to its key (a sibling 400 reds). The **cite is not gated**: an empty
  `why` stays GREEN (§2). B-SEAM is untouched. **Met in letter; the cite is decorative.**
- **The §8.1 row**: the roster folded (**yes**); B-INK-RUNG (**yes**, cite ungated); the area clause's
  unreachability or its plant (**stated, witnessed by `areaMoot`, GREEN in chromium; the number unread**); `:546`'s
  budget (**keyed, and still RED in chromium at load 5–17, on `invite`'s drawer at 360×800**).
- **The batch gate**: SELF's bank exists by sha and reproduces blob for blob (§0). But the blob COUNT and PLACE take
  by sha carries **one red-by-construction row** (`:1138`) and one red re-cut (`:571`). Taking it by sha imports both
  reds. FIVE's cure and ERASE's fence are not this lane's.

## 6 · Incidents (the critic's, self-declared)

1. **The rig's first battery died on the rig.** The webServer `cwd` defaulted to the config's own dir
   (`.critself10/`), so `--config .critself10/vite.mts` resolved twice ("Cannot resolve entry module"). Admitted
   16:12:54, died before any test, exit 1, no reading taken. The rig was fixed (explicit `cwd`) and re-queued.
2. **A browserless check took a browser ticket.** My first thickTol harness was named `probe-tol.mjs`, and `guarded`
   upgrades any command naming "probe" to the browser pool (`light->browser`). It sat in `queue-browser`. I
   stopped it by task id before it was admitted, renamed it `tolcheck.mjs`, and re-ran it light. No browser opened.
3. **The first sabotage pass logged too narrowly.** Its hit filter missed the gate's `•` bullet and kept no raw
   output, so two plants read "hits 0" falsely or ambiguously. Both were re-run with raw output kept
   (`sab-<name>.raw`). The sibling-key plant then read NAMED; the empty-`why` plant read GREEN in the raw text.
   §2 cites only the re-runs.
4. **A WebKit ticket was queued and withdrawn.** It was queued 16:21:00 behind ≥ 5 `--exclusive webkit` jobs
   (timeouts 15–88 min) and 10 browser tickets. I withdrew it by task id at once (no `.exit` written; its log is
   kept as `lane-wk.withdrawn1.log`) to run the pending chromium rows first (LAWS P9 §B), then queued WebKit last.
5. **Scratch archives**: three `git archive` copies (`74a2b5d9`, `954bbbab`, `74a2b5d9`+pass9), each `git init`-ed.
   Their own `.git` is printed on every apply line. The WAVE copy carries a READ-ONLY alternates line onto main's
   object store (for `lint:bands` B6) and a `node_modules` symlink to the lane tree's. `git archive` drops one path
   of `954bbbab` (5,124 → 5,123 indexed), so the archive's tree is `044284b5`, not `954bbbab`. Every comparison here
   is blob-level or on the lane's own archive trees (`72b7ad67`, `a9e00185`), which match.
6. **Temporary index**: the critic's index over the lane worktree (`git add -A` excluding `.critself10/`) wrote blobs
   into main's shared object store, as in LAWS P9 §J's declared class. No ref moved. The lane worktree's own index
   was never touched.
7. **Rig dirs**: `.critself10/` sits in the lane worktree and in the WAVE archive. It is never banked, and it is
   moved to the critic's trash at return.

## 7 · Open gaps (exact, the critic's, ranked)

1. **`player-mark.spec.ts:1138` (the far-edge row, NEW) is RED by construction in chromium.** `farClick` clicks
   `document.querySelector('[data-player-mark]')`, the hidden desktop twin (`App.vue:830`), and not the visible
   mobile mark the row observes (`App.vue:851`, 390×844 coarse). The far click never enters `__ev`, and `gap` reads 0
   (Expected ≥ 300, Received 0, CLEAN arm `own`). The row was banked unrun, so charter row 6 is NOT closed, and the
   blob COUNT/PLACE take by sha (`725f06d1` / `849d0a3d`) carries the red. Cure in the spec: target the visible mark
   (`mark(page)`), then read the row both engines with the CUT arm and a threshold plant on `TAP_CLICK_MS`.
2. **`:571` (pass 9's `:546`) is still RED in chromium at load 5–17**, on its keyed 240 s budget: `invite()`'s
   drawer at 360×800 (the verb "not visible" ×443 after the `.drawer-tab` click; the frame shows the dock shut).
   Charter row 3 cured the budget symptom. The class is the row's own helper hanging, which the pass-9 critic
   already logged on a plant run, and it is uncured. A longer budget only made the hang longer.
3. **The forgiveness rows SKIP whole on a served dist** (`devServed` → `test.skip` at the top of `forgiveRow`). The
   CLEAN arms, which can run on the dist, are skipped with the CUT arm. That is a presence-keyed skip (`/@vite/client`)
   with no plant of its own, the species the roster row just shed. LAWS P9 §B labels a row dev-only when it CANNOT
   run on a dist. Split the CUT arm out, or plant the predicate.
4. **WebKit is UNREAD for every row of this pass** (lane and critic). The machine-wide `--exclusive webkit` queue held
   all six browser slots. See §4b for what the critic got.
5. **B-INK-RUNG's cite is not gated.** `b2Closed` checks the EXEMPT `ms` (±1 and the sibling key both red), never its
   `why`, so an empty cite stays GREEN. CHAIR §11's "(b) EXEMPT **with its cite**" holds in the bytes only. The gate
   is §13's (bands), and the hole is priced against the row SELF relies on.
6. **No ballot frame exists** (`frames: []`): F1 `SELF_TAKES_A_HAND` is required by CHAIR §9 to be "framed on one
   payload". B-INK-RUNG, B-CHART and B-NAMES are unframed too.
7. **The WAVE + delta browser rows are unread, both engines**: the landed state-line row (its `ARM` is regexed off the
   subject's source, so only "line + chart = 1" is arm-free), the union's `:595` on its new budget (and `:571`'s
   helper hang, gap 2, likely rides there too), and the PRM re-spell's only behavioural witness
   (`join-language-prm.spec.ts:92` `markTransition` `0s`).
8. **The area clause still decides no real cell.** The unreachability is stated and witnessed (`areaMoot`, `:658`
   GREEN in chromium), but the least `below` is unread (see §4b), and the clause stays in product deciding
   nothing. Charter row 2: "with the number". **The number is still owed.**
9. **The far-edge bound pins the window only to ≥ ~300 ms + one frame**, not 350 (`TAP_CLICK_MS = 350`): a
   320 ms window would likely read GREEN once gap 1 is cured. A literal ±ε pair at the window is owed (LAWS P9 §F).
10. **The layDown curve** moves the 400 ms turn's mid-frames. It is a gate-driven pick with no frame and no reading.
    The PRM re-spell leans on `--presence-ink-dur` staying unregistered: registering it `inherits: false` would
    un-zero `.pt-stroke` under reduce, and no plant covers that.
11. **Carried, cited, not re-derived**: the tray-well consumer's §6 reds (site 1 B2 `div.action-bar`, site 2 B3
    0.83–0.84, control = tree, CHECK.md); the off-roster 1.5 px frames (GCP `bar-frame`, GCP `:1752` unclassed, and a
    third the lane did not name: **`ConfirmRibbon.vue:78` 1.5 px**); `player-tally:1479/:1312×2` and
    `peer-tin:928/:965` priced, not measured; COUNT's provisional stroke admission; `--tap-floor`
    `PlayerMark.vue:676/:707` (T9-R10); check 8 FLOOR BAND; T9-R8; real iOS (M19); π and AA by construction only
    (no build ran).

## 8 · The number

**Convergence: 91 (−2 from v9's 93). Verdict: ADVANCE.** §11 is held by this family's number until a sibling
overtakes it.

What earned movement, re-derived by the critic:
- The drawn-frame gate can now fail, and it reads GREEN on the real surface in chromium with both drawn plants
  in-run (`:1184`). The roster is a named import, so absence is a load-time red. The thickTol refusal bites
  (critic's plant). This was pass 9's first gap.
- The WAVE gates are honest without self-admission. B2 is bound to value and key (critic's −1 and sibling plants).
  The verbs ledger is down to 34 with no PlayerMark finding, and the layDown-name, PRM-strike and cascade plants
  each red by name. This was pass 9's fifth and sixth gaps.
- F1 is re-authored with a working born-RED. The bank reproduces blob for blob on every route it names.

What takes it below 93:
- The bank ships a NEW row that is RED BY CONSTRUCTION (`:1138`, the hidden twin). It was written, typechecked,
  linted and banked without one run, and it is the substrate COUNT and PLACE take by sha. That is worse than the
  pass-9 SKIP it was meant to retire beside. A skip cannot fail. This row cannot pass.
- The re-cut `:571` is still RED in chromium at a low load. The budget cure treated a symptom whose class (the
  helper's drawer race) the pass-9 record had already named.
- The forgiveness rows lost the shipped dist entirely (a presence-keyed skip over the clean arms).
- WebKit: zero rows read by anyone this pass. No frame for any ballot, though CHAIR §9 requires F1's.

It does not fall further, because the two pass-9 headline defects (the SKIP and the self-admission) are closed and
survive the critic's plants. Every gap above is a spec-side or rig-side fix on rows the lane owns, not a product
redesign.

## 9 · Replay route (the critic's)

1. Identity: a temporary index over the lane worktree (`read-tree 74a2b5d9`, `add -A` excluding the rig dir) gives
   `write-tree` = `e855ff06`. `git diff --cached --binary 74a2b5d9 -- <bank's 26 paths>` gives sha1 `c6e830c6`, `cmp`
   identical to the bank.
2. Lane route: `git archive 74a2b5d9` → `git init` → `apply homes.diff 07257854` (13) → `apply pass10.diff c6e830c6`
   (26). The 39 product paths equal the lane tree blob for blob.
3. WAVE route: `git archive 954bbbab` → `git init` → `apply --check pass10.delta.on-WAVE.diff` 0 (8) and `pass10.diff`
   1 → `apply homes.on-WAVE.diff 0723d508` → `72b7ad67` → delta → `a9e00185`. The 8 blobs equal BANKED.txt.
   On `acde977b` (own archive, `git init`), the delta exits **1** (`e2e/node.d.ts:61` first): not a route, as declared.
4. pass-10 advance: `git archive 74a2b5d9` → `git init` → `apply pass9.diff 5ee85d8b`, then file-compare against
   route 2.
5. Gates: `node scripts/<gate>.mjs --self-test`, each through `guarded --light`, exits to files. Sabotage: the
   critic's `sab.py` on the WAVE archive, one plant at a time, restored by sha1. thickTol: `tolcheck.mjs` on a copy of
   homes v3's `e2e/lib`.
6. Browser: one `guarded` playwright call per project with the rig config `.critself10/pw.mts`. Its webServer starts
   the lane dev on `:4241` with `cwd` = the lane frontend. WebKit carries `--exclusive webkit`.

## 4b · WebKit, the rerun, the control: UNREAD (the queue, not the zone)

- **WebKit (`lane-wk`)**: queued 16:21:00 with `--exclusive webkit` as the last of 11 browser tickets. All six browser
  slots were held by `--exclusive webkit` jobs from other repos and this one, aged 5 min to 1 h 52 min, with
  timeouts of 15–90 min, and only the one lock-holder running. Withdrawn by task id at once to run chromium first
  (LAWS P9 §B). **Every row of this pass is UNREAD in WebKit**, by lane and critic both: `:571`, `:658`, `:1129`,
  `:1138`, `:1184`. zone inuse 14,637–14,743 throughout (≪ 8M). **No reboot is owed.**
- **Chromium rerun (`lane-cr2`: `:571` reproducibility, `:658` with the JSON reporter for the least `below`, `:1129` +
  `:1138`)**: queued 16:21:29 as the 5th of 9–10 tickets behind four chromium jobs, the oldest 47 min queued, all
  starved by the same six WebKit holders. Withdrawn by task id at 16:27:48. No `.exit` was written (a marker file I
  placed to release my own waiters is in trash, never read as an exit). **`:571`'s red is ONE read**: its
  reproducibility is UNREAD, and so is the least `below`.
- **Control (`:4259`, `index-CubiZsMVSwTc.js`)**: not run. WAVE9-read's half B already records that the control reds
  every `player-mark` row by absence (the spec is born after `74a2b5d9`). On a dist, `:1129`/`:1138` would SKIP by
  `devServed`, unread.
- **WAVE + delta (`a9e00185`) browser rows**: not run (the rig is prepared in the archive). UNREAD both engines:
  the state-line row, the union's `:595`, and `join-language-prm.spec.ts:92`.
- Servers at return: none of mine listening on `:4241`/`:4259` (lsof empty). Every server lived inside its run's
  webServer.

## 10 · At return

- I re-read the lane tree through a fresh temporary index after the rig dir moved to trash. write-tree is
  `e855ff06`, 39 files, +14,472/−403, the same as at open. The critic changed nothing in the lane tree.
- The browser runs read: `lane-cr` chromium, exit 1, 2 failed / 2 passed. Box: zone inuse 14,595 → 14,637, 1-min load
  8.77 → 6.89. Control exit: not run (§4b).
- Withdrawn or unread: `lane-wk` WebKit, `lane-cr2` chromium, the control and WAVE + delta browser rows (§4b).
- Nothing committed, stashed, pushed, deployed or installed. No git ran on main's work tree or in the control
  tree.
