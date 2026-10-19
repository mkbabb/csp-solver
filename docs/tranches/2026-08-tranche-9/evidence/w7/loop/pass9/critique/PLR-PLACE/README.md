# PASS-9 CRITIQUE · PLR-PLACE · the player place (§11)

Adversarial, non-author read of the prototype's attempt-4 bank (`pass9/prototype/PLR-PLACE/`), 2026-10-18. I wrote neither
the charter nor the prototype. Every number marked *critic* below was re-read by me on the bank's bytes; the rest is the
lane's and says so. Base and π control `74a2b5d9`. Nothing committed; no `git status` anywhere; git ran only in the lane's
worktree through temporary indexes under my durable scratch; no `rm`; every browser run through `~/.claude/guard/guarded`,
`--workers=1`, one heavy run at a time. Servers: `:4243` (vite dev on the lane tree, my scratch config, PID recorded in §5).
Frames: none banked by the lane, none by me; 0 B of the 120,378 B headroom spent.

## 0 · Gaps first (exact, open at this critique)

1. **Row 15's re-fit leg has no working negative on this tree** (LAWS P8 §D, the resize leg; the class SIX's `noro`
   taught). The negative its comment names — the resize listener struck — is GREEN at both cells in Chromium (§3d):
   SELF's second path, `transitionend` → `onSettle` → `refit`, re-fits the open sheet anyway. With BOTH paths cut (§3e) the 3-at-the-table cell does red (3 rows held at rest vs a
   fresh 1 row), so the row CAN fail, but it ships no in-run negative and names a green one. Under the shipped
   chart arm the 2-at-the-table cell cannot fail by any plant (it opens and rests in the same decided pose). PLACE's
   row; lane-closable: a negative that cuts what the row claims to guard, run in the row.
2. **No font-landing leg** on any yield / re-fit / wrap-keyed row (LAWS P8 §D): `CHART_YIELDS` and the row budget are
   decided on measured heights, the specs never read a late face, and `PlayerMark.vue` refits on resize and on
   transitionend only — a face landing under an open sheet re-measures nothing. Lane-closable.
3. **B-CHART is the owner's (U-10).** Kill numbers as the lane reads them (9×9 390×664 chart 94.64 / 94.95 over 21 vs
   list 17.53 / 17.84 over 7; 16×16 169.30 / 169.61 over 88 vs 11); the row-2 chart column is a characterisation pin of
   them (§5), never a cure.
4. **Real iOS aim unwitnessed** (RUNSHEET M19, the lane's drafted line with the landscape top edge). Emulated WebKit gates
   nothing on aim (CHAIR §11).
5. **The names' AA is RED in light** (T9-R8: 2.972 / 3.009, the lane's read); the control's same-payload read did not run
   (lane I3); not re-derived by me. §11c's ink.
6. **Check 8 FLOOR BAND** reds on the tree (285 / 283 vs floors 214 / 212, owes 243 / 241; re-derived) — the fold's.
7. **My WebKit column is UNREAD** (§8): every WebKit number is the lane's this pass.
8. **π, the filter census, AA and the served-utility count are the lane's**, not re-derived by me; filterBudget,
   @property and M16 re-read in source / by the browserless gates (§4).
9. **The 16×16 edge rows gate reach only** (no band in Chromium at 16×16; re-derived): a fact of the browser, honestly
   stated, not a cure.
10. **Two row-2 cells moved under the chart arm** (lane-chosen, declared in the spec only): the desk 1100 → 1200 and the
    re-fit row 390×844→800 → 390×1100→960 (§5).
11. **SELF's B3 drawn-frame row skips** (1 per engine) until the chair folds SELF's roster; SELF's row.
12. `pass9.diff` refuses on s10 / s13-s7-s3 / the WAVE (informational: §11 is in no pass-8 integration); the landing cut
    is the on-WAVE delta, 0 on `acb9c08e` and on `acde977b`.
13. **WebKit's edge rows assert nothing at all**, not only the aim: `edgeRow` returns before the CLEAN expectation in
    WebKit, though the lane's own WebKit clean reads equal Chromium's at every row (in 1–3 `none`, outside `cell`). The
    chair ruled the emulated AIM (the cut's negative) non-gating; the clean reach is deterministic in WebKit and could
    gate it at no cost. Minor; lane-closable.

## 1 · The bank, re-cut by me (critic)

| what | lane | critic |
|---|---|---|
| work tree through a temporary index (`add -A web/frontend`) | write-tree `4a97c02c` | **`4a97c02c`**, 44 files +14,606/−407; no path outside `web/frontend` |
| `pass9.diff` sha1 / bytes | `070cda60` / 727,390 | **`070cda60281a…`** (shasum) |
| `pass9.diff` `apply --check` on `74a2b5d9` | 0 → `4a97c02c` | **0**, applied → **`4a97c02c`** |
| WAVE union rebuilt (`74a2b5d9` + `pass8/integrate/WAVE.diff`) | `acb9c08e` | **`acb9c08e`** |
| `pass9.diff` on the WAVE | 1 | **1** (`edge-bands.d.mts` … already exists: homes v2 is on the union) — informational |
| `pass9.delta.on-WAVE.diff` sha1 | `d22153e4` | **`d22153e4fe6a…`** |
| delta `--check` on the bare WAVE `acb9c08e` | 0 | **0** |
| WAVE + `homes.on-WAVE.diff` (`a0f8e6f3`) | `acde977b` | **`acde977b`** |
| delta on `acde977b` | 0 → `757e333f` | **0** → **`757e333f`** |
| homes v2 by sha (13 paths of `homes.diff` `1f70cfda`, blob of `4a97c02c` vs blob of `d17813ba`) | 13/13 EQ | **13/13 EQ** |
| residual home edits in the on-WAVE delta (its 33 paths ∩ the 13 home paths) | 0 | **0** (`grep -F -x -f`, exit 1 = no match) |
| greps of both banks: `scratchpad`, `/private/tmp`, `/tmp/`, `t9-scratch`, `.place9`, `/Users/`, a `docs/` import, a dot-dir on `---`/`+++` | 0 | **0 on every pattern, both files** |
| s10 / s13-s7-s3 | 1 / 1 | not re-run: §11 is in neither pass-8 integration (LAWS P8 §A names no §11 integrated tree); the batch gate is `74a2b5d9` + the WAVE, met by `pass9.diff` (0) and the on-WAVE delta (0) |

The pass-9 advance over the pass-8 bank (`git diff 6535a918 4a97c02c`): 20 files +3,937/−383, of which 13 are homes v2 and
the rest `player-mark.spec.ts` (+454), `player-place.spec.ts` (+201), `PlayerMark.vue` (+83), `PlayerLobby.vue` (+14),
`rowBudget.ts`/`.test.ts` (SELF's key, by sha), `multiplayer.spec.ts`, `useSession.ts`. The on-WAVE delta also carries
SELF's pass-9 files (`check-motion-bands.mjs`, `check-pencil-verbs.mjs`, `check-theme-tokens.mjs`, `useJoinWash*`,
`join-language-prm.spec.ts`), each SELF's by sha through `f333e6de`, none a home path.

## 2 · Row 1 re-derived (critic, Chromium, the lane tree on `:4243`, vite dev, my scratch config)

- **`player-place.spec.ts` whole, chromium: exit 0, 25 passed** (2.8 m; 16:44:19 → 16:47:28; load 26.6 → 29.8). Every
  edge read equals the lane's to the cell: rows 14/16/17 at 9×9 clean `in 1–3 none` · out/below/above `cell`; the cut in
  the run reads `none` at 1/2/3 px and `cell` at 4/6/10 (bottom) and 6 (right, top); at 16×16 every cut reads identical
  to clean; `hit` = `sheet` ×3 inside, `cell` outside, every row.
- **The pass-8 plant FIRST** (NO_RIGHT, the pass-8 critic's live band), then the other four; `PLACE_SABOTAGE=<clause>`,
  `-g "(12|14|16|17) · "`, 7 tests per run, exits read bare from the file each run wrote:

  | clause (chromium) | lane | critic exit · what reds | clock · load (1-min) |
  |---|---|---|---|
  | NO_RIGHT (pass-8 plant) | 1 · row 16 9×9 alone | **1 · row 16 9×9 alone**, 6 pass | 16:47:42–16:49:42 · 28.3 → 27.5 (75 s of it a slot wait) |
  | NO_TOP | 1 · row 17 9×9 alone | **1 · row 17 9×9 alone**, 6 pass | 16:49:42–16:50:26 · 27.5 → 23.5 |
  | NO_BOTTOM | 1 · row 14 9×9 alone | **1 · row 14 9×9 alone**, 6 pass | 16:50:26–16:51:10 · 23.5 → 25.6 |
  | NO_LEFT | 0 (reason) | **0 · 7 pass** | 16:51:10–16:51:56 · 25.6 → 24.9 |
  | NO_TOUCHKEY | 0 (reason) | **0 · 7 pass** | 16:51:56–16:52:39 · 24.9 → 26.8 |

  Three of five disjuncts now red a landed row, each ONLY its own row: pass 8's 1-of-5 is 3-of-5, and the side edge
  (pass-8 critic gap 1) is closed in Chromium. The two zeros carry reasons in the spec's `DISJUNCT` block. I judge them
  in source: NO_TOUCHKEY's holds (no child of the sheet paints or takes events outside its box: `.head-sheet-edge` is
  `inset: 1px; pointer-events: none`); NO_LEFT's holds structurally, not only on the lane's 15 reads: `HeadSheet.vue:69`
  is `position: absolute; left: 0` inside the corner, which is `position: fixed; left: 0` (`AttributionCard.vue:165–175`),
  and the corner's `padding-left: env(safe-area-inset-left)` does not move an absolute box's `left: 0` (it resolves at
  the padding edge), so the sheet's left is the viewport's on notched landscape hardware too.
- **The control's exit beside the battery:** the edge rows cannot run on `74a2b5d9` as cut (the in-run negative routes
  `/src/…/PlayerMark.vue`, which a dist does not serve, so the landing assertion reds by construction); my clean-only
  control read is §3's.

## 3 · My own batteries (critic; scratch spec `crit-edge.spec.ts` under my durable scratch, never banked)

The spec is mine: its own table/open/read helpers (the leader's shapes, re-typed), `@playwright/test` only, no lane file
and no instrument imported. Every plant is cut IN THE RUN from the dev server's own `PlayerMark.vue` module by `ctx.route`,
asserted to land once per page (`landed 2` on every planted read).

### 3a · THRESHOLD sabotage of `outside()`'s three live bounds (LAWS P8 §F; the lane ran none)

The lane's battery deletes clauses; it never moves a bound. I planted `bound ± ε` on each live disjunct at its own row's
cell, 9×9, chromium (`thresh` mode, **exit 0, 15 passed**, 16:53:59–16:55:18, load 25.2 → 21.9; the gate's verdict is
"the row's clean expectation (in 1–3 `none`, out/above/below 1–3 `cell`) reds"):

| bound · cell | clean | +0.5 | −0.5 | +1.5 | −1.5 |
|---|---|---|---|---|---|
| `e.clientX > r.right` · 390×664 (r 256) | green | green | green | **RED** `out 1` | **RED** `in 1` |
| `e.clientY < r.top` · 844×390 (t 56) | green | green | green | **RED** `in 1` | **RED** `above 1` |
| `e.clientY > r.bottom` · 390×844 (b 226.38) | green | green | green | **RED** `below 1` | **RED** `in 1` |

Each bound is pinned on BOTH sides inside (0.5, 1.5] px: the 1 px pair the lane calls its ε pair is a real boundary
control, and it holds on a fractional edge (226.38) as well as an integer one. Margin printed: 1 px each way. The
sub-pixel band (a bound moved by ≤ 0.5 px) is unpinned by design; I do not count it a gap.

### 3b · The control (`74a2b5d9`, served `index-CubiZsMVSwTc.js` on `:4257`, PID 92137, cwd `w7-control/web/frontend`)

The mark is born in §11: `74a2b5d9` has no `src/pencil/chrome/PlayerMark/`, no `[data-player-mark]` and no `[data-lobby]`
(`git grep` on the tree object). Every edge row is born RED on the control BY ABSENCE: there is no sheet to tap
beside. My clean-only control read was started (16:55:19) and stopped by me at 16:56:10 (exit 143, my own guarded PID,
command line checked) before any test ran, once the grep showed it could only time out on the missing selector. That
is the control's exit for the edge battery: unrunnable, no surface, not a red the cure moved.

### 3c · The rounded corner (the lane's I1, put to the critic)

`corner` mode, chromium, **exit 0, 4 passed** (16:56:10–16:56:53, load 17.5 → 26.4). A touch at `(right − k, bottom − k)`
(BR) or `(right − k, top + k)` (TR), k = 1, 2, 3, 4, 5, 6, 8, 10, every point INSIDE the sheet's box; the sheet's radius
reads `16px`. Read (`c` cell took focus / `n` none) against the page's own hit-test (`c` cell / `s` sheet):

| corner · cell | k = 1 · 2 · 3 · 4 | k = 5 · 6 · 8 · 10 |
|---|---|---|
| BR · 9×9 390×664 (sheet `[0, 44, 256, 226.38]`, board top 131.73) | c/c · c/c · c/c · c/c | n/s · n/s · n/s · n/s |
| TR · 9×9 844×390 (sheet `[0, 56, 256, 238.38]`, board left 241) | c/c · c/c · c/c · c/c | n/s · n/s · n/s · n/s |
| BR · 9×9 844×390 | c/c · c/c · c/c · c/c | n/s · n/s · n/s · n/s |
| BR · 16×16 390×664 | c/c · c/c · c/c · c/c | n/s · n/s · n/s · n/s |

The flip sits between k = 4 and k = 5 at every cell, where a 16 px arc leaves the diagonal (16 − 16/√2 = 4.69 px):
the tap goes to what is PAINTED under the finger, to the pixel, and no touch inside the box but off the painted corner is
swallowed (`swallowedOnPaintedBoard` = [] ×4). **No corner row is owed** in Chromium; `outside()` keys the box, but in the
corner wedge the browser never hands the sheet the touch. WebKit's column of the same read is §6 (print-only).

### 3d · Row 15's resize leg and its stated negative (LAWS P8 §D; the lane did not run it this pass)

Row 15's comment (`player-place.spec.ts:1067–1068`) names its negative: "a file plant (the resize listener struck): the
open sheet then keeps the pose it opened on". Neither README cites a run of it in pass 9. My `resize` mode, chromium,
the shipped chart arm, row 15's two cells, the plant `window.addEventListener("resize", refit);` struck in the run
(landed 2 and 3 times), **exit 0, 4 passed** (16:56:53–16:57:24, load 26.4 → 28.7):

| cell | arm | opened | at rest after → 390×664 | fresh open at 390×664 | at rest = fresh |
|---|---|---|---|---|---|
| 2 at the table, 390×860 | clean | 2 rows · chart · lapped 0 | 2 rows · chart · 94.6 px · 21 | the same | yes |
| 2 at the table, 390×860 | **resize listener struck** | 2 · chart · 0 | 2 · chart · 94.6 · 21 | the same | **yes (the negative is GREEN)** |
| 3 at the table, 390×1000 | clean | 3 rows · chart · 0 | 1 row · chart · 92.7 · 21 | the same | yes |
| 3 at the table, 390×1000 | **resize listener struck** | 3 · chart · 0 | **1 row** · chart · 92.7 · 21 | the same | **yes (the negative is GREEN)** |

**The stated negative does not red.** With the resize listener cut, the open sheet still re-fits 3 rows → 1 row: the
second path, `document`'s `transitionend` → `onSettle` → `refit` (`PlayerMark.vue:242/356–358`), catches the resize
because the board's own layout transition comes to rest after it. The redundancy is the product working; the GATE is
what fails the law: row 15 has no demonstrated negative on this tree, and its comment names a plant that is green. And
under the shipped chart arm the 2-at-the-table cell cannot fail at all (it opens and rests in the same decided pose, 2
rows + chart; only the passive lap moves). The both-paths plant is below. There is no FONT-LANDING leg on any re-fit row
(LAWS P8 §D: the yield and the re-fit are keyed on a measured height that a late face changes).

## 4 · The constraints, read by me (browserless, `guarded --light`, load 25–29)

- **Check 8** (`scripts/check-pw-projects.mjs` on the tree): **exit 1**, `8 FLOOR BAND` only — chromium live 285 vs floor
  214 (owes 243), webkit live 283 vs 212 (owes 241); the lane's exact figures. The fold's restamp, carried.
- **M16** (`scripts/check-copy-register.mjs` on the tree, and `--self-test`): **exit 0 / 0**; 0 em/en dashes, 0
  unadmitted jargon in rendered copy.
- **filterBudget 9**: `src/pencil/config/filterBudget.ts` is not in `git diff 74a2b5d9 4a97c02c`; no added `src/` line
  writes a `filter:` declaration or a `url(#…)` reference (the five added lines naming "filter" are comments stating the
  head sheet's frozen pose 0 enrols no beat). I did NOT re-run the filter census in a browser; the lane's 6/6 + 6/6 on
  both dists stands as the lane's.
- **@property**: ONE added registration, `@property --head-rule` in `src/assets/index.css`, whose blob (`4af79b54`) is
  SELF's tree's byte for byte; consumers `App.vue:1018/1069/1082` write `var(--head-rule)` bare. No `registerProperty`.
  SELF's row, by sha; nothing of PLACE's.
- **shape-census `--tree`** on the lane tree: exit 2, 14 FAIL, every one the §13 reserve's `anchor absent` — the same 14
  the instruments README reads on the bare `74a2b5d9`. Not PLACE's.
- **π, AA, the served-utility count**: NOT re-derived by me (budget spent on §2–§3). The lane's π (62 deltas, all §11's,
  noise 0 in 8/8 per engine) and AA (2.972 / 3.009 light RED, T9-R8) stand as the lane's numbers, marked so.
- **Instruments**: the product specs import `./lib/edge-bands.mjs`, `./lib/rest-probes.mjs` and `./committed-press` by
  relative product path; homes v2 13/13 by sha; no `docs/` import (grep 0); no PROPOSED extension filed by the lane.

## 5 · Row 2, the estate under the shipped arm, judged

`player-mark.spec.ts` now reads the arm off the AUTHORED consts (`PLACE_CHART` in `App.vue:768`, `CHART_YIELDS` in
`PlayerMark.vue:301`, a regex over the source; a moved const throws) and asserts `priced(list, chart)`. My read of the
mechanism, against the checklist:

- **Not vacuous, but a characterisation.** Every chart-column number (`KEY_CELLS`' seventh field 12/12/9/6/6/8/4/2/25/
  20/2/10/4/20; `lapped: priced(0, 7)`, `priced(7, 21)`, `priced(4, 6)`, `priced(3, 6)`, `priced(2, 4)`) is the lane's
  own read of the chart arm on these bytes, pinned as an equality. An equality reds any change, so the rows CAN fail;
  but under the chart they gate "the chart laps what it lapped when the lane read it", not a law the chart obeys. The
  law the rows still carry under the chart is the rows' rule (`rows: 1` everywhere but the 1280×1200 desk). The
  charter allowed exactly this ("a chart-aware expectation with the lap table"), and the price is the owner's
  (B-CHART), so I do not count it against the number; I name it so the fold does not read the chart column as a cure.
- **Two cells moved under the chart arm** (lane-chosen parameters, declared in the spec, not in the README's
  incidents): the never-scrolls desk 1280×1100 → **1200**, and the resize row 390×844 → 800 becomes **390×1100 → 960**.
  The second is no phone: under the shipped arm this row's open-sheet re-fit is read only from a 1100 px viewport (the
  spec's own comment: the chart arm's four rows lap nothing at 1100/1000, one row laps nothing at 960/900). The move is
  honest and itself part of the B-CHART price, but this row no longer reads the shipped arm at a phone height
  (player-place row 15, §3d, does: 390×1000 → 664).
- **The list and yield columns** stay SELF's bytes; the lane's arm plants read them 6/6 each, both engines (not re-run
  by me).

## 6 · The charter's eight rows as I read them

| # | row | critic |
|---|---|---|
| 1 | side-edge row + five-disjunct battery | **closed in Chromium** (re-derived: 25/25; NO_RIGHT, NO_TOP, NO_BOTTOM each red only their own row; LEFT and TOUCHKEY reasons hold in source). The lane went past the charter: row 17 found NO_TOP live on a coarse landscape phone. My threshold battery pins all three live bounds to 1 px both ways |
| 2 | estate GREEN under the shipped arm | **closed as the charter defined it** (the chart priced in the rows, §5); the chart column is a characterisation pin, named |
| 3 | 16×16 band | **read, no band**: at 16×16 the cut reads identical to clean at every edge (re-derived). Gating reach only, honestly stated |
| 4 | WebKit print-only for aim | **closed** per CHAIR §11; `edgeRow` returns before any expect in WebKit; RUNSHEET line drafted (real iOS stays open) |
| 5 | `PlayerLobby.vue:57–68` both arms | **closed** (read whole: arm (b) prevents the `touchend`, arm (a) prevents nothing, the outside touch is the board's in either arm) |
| 6 | names' AA | **cited** T9-R8 (2.972 / 3.009 light RED); the control's same-payload read did not run (lane I3); not re-derived by me |
| 7 | check 8, π, filter census, @property | check 8 **re-derived** (exit 1, floor band only); @property and filterBudget **re-read in source**; π and the census are the lane's |
| 8 | B-CHART to the owner | numbers whole in the lane README; not re-derived by me this pass (the pass-8 critic reproduced the four kill cells to the hundredth and the lane's 162 reads equal them) |

## 7 · Row 2 re-derived (critic, Chromium)

`player-mark.spec.ts` whole on the lane tree, the shipped chart arm: **exit 0, 22 passed, 1 skipped** (3.2 m;
16:57:26 → 17:00:47; load 28.7 → 14.1). The skip is SELF's B3 drawn-frame row (`:1149`, homes v2 has no roster yet),
as the lane states. The 14-cell key table with its chart column, the 1024–1056 sweep at `priced(3, 6)`, the desk at
`priced(2, 4)` with top 124.45 ± 0.5, and the resize row at 1100 → 960 all pass on my run: the lane's chart column
reproduces as an equality on this tree.

## 8 · WebKit, the box, and the state at return

- **WebKit: UNREAD by me.** My `player-place.spec.ts` WebKit run and the WebKit corner print were queued
  `--exclusive webkit` at 17:00:47 behind four foreign holders (the oldest waiting 74 min); at 17:04 I dequeued them
  (K5) rather than starve my own Chromium column. Every WebKit number in this family this pass is the LANE's (player-place
  25/25, player-mark 22+1, the five cuts identical to clean, born-RED 6/6 reds). That is a gap row of mine, not a
  green: by CHAIR §11 WebKit's aim column gates nothing, but rows 1–13 and 15 of `player-place.spec.ts` do gate in
  WebKit and I did not re-read them.
- **The box:** every row I read opened and closed at a 1-minute load between 14.1 and 29.8 (first and last load of
  each run in §2–§7), under the law's 120 for any timing or paint row and its 200 for geometry; no guard refusal; the
  zone gate never fired.
- **At return:** the lane's tree re-cut through a fresh temporary index is still **`4a97c02c`** (my runs moved no byte
  of it; my specs, configs, logs and cache live only under my durable scratch). `:4257` was stopped by me (exit 143);
  `:4243` is stopped by me after the last read (§10).

### 3e · Row 15 with BOTH re-fit paths cut

`resize` mode, `CRIT_STRUCK=both`: the resize listener AND the `transitionend` → `onSettle` listener struck in the run
(landed 4 and 6 times = 2 per page), chromium, **exit 0, 2 passed** (admitted 17:16:11 after a 14.5 min slot wait,
17:01:37 → 17:16:31; load 19.2 → 25.9):

| cell | opened | at rest after → 390×664 | fresh open at 390×664 | at rest = fresh |
|---|---|---|---|---|
| 2 at the table, 390×860 | 2 rows · chart · 0 | 2 · chart · 94.6 · 21 | 2 · chart · 94.6 · 21 | **yes: cannot fail under the chart arm** |
| 3 at the table, 390×1000 | 3 rows · chart · 0 | **3 rows** · chart · 117.0 · 21 · h 204.8 | 1 row · chart · 92.7 · 21 · h 180.5 | **NO: the row reds** |

So the 3-at-the-table cell is a real gate whose working negative is the both-paths cut; the row ships neither that nor
any in-run negative, and its comment names the one-path cut that is green. Gap 1.

## 9 · The number: 90 (from 88) · ADVANCE

Earned: the pass-8 critic's gap 1 is closed and over-closed — the side edge has a landed row whose cut reds only it, the
lane FOUND a third live band (the top edge on a coarse landscape phone) and landed it, the five-disjunct battery reds
3/5 with the other two reasons holding in source, and my threshold battery pins every live bound to 1 px both ways (it
could have shown a loose bound; it did not). Gap 2 is closed as the charter defined it (the estate green under the
shipped arm, re-derived 22+1). Gaps 4, 5, 6 of pass 8 are closed. The corner the lane put to me (I1) owes no row. Every
bank number I touched reproduces to the sha.

Withheld: the re-fit leg's stated negative is green on this tree and its 2-at-the-table cell cannot fail under the
shipped arm (gap 1), and no re-fit row has a font-landing leg (gap 2) — both are a named LAWS P8 §D class, re-taught
from SIX, lane-closable, and the reason this is not 91–92. My WebKit column is unread (gap 7), and π/AA/census are not
mine (gap 8), so nothing above rests on a WebKit or paint read of my own. The chart column is a characterisation, not a
law (gap 3/10), which costs nothing here only because B-CHART is the owner's.

Not converged: the owner's B-CHART, real iOS and the estate's AA/check-8 rows stand outside the lane; inside it, gaps 1,
2 and 13 are next pass's work. ADVANCE.

## 10 · Incidents (critic, self-declared)

1. **K1 · a stray empty file outside the repo.** One append command began with a mistyped `cat >> …/Programming/
   docs-placeholder-never` with no input, which created an empty file at `/Users/mkbabb/Programming/docs-placeholder-never`
   and blocked on stdin (the harness moved it to the background at 120 s). I stopped my own `cat` (PID 86267, child of my
   shell 86266, checked), the queued append then ran, and the empty file was MOVED to my trash dir (no `rm`). Nothing
   else was written outside my scratch dir and this evidence dir.
2. **K2 · I stopped three processes of my own, each checked by command line first:** the clean-only control read
   (guarded PID 94742, `crit-PLR-PLACE/pw.crit.config.ts`, exit 143 before any test ran — §3b), the stray `cat` (K1),
   and my seq3 waiter loop (PID 1039, args `CRIT_STRUCK=both … seq3.meta`) so the both-paths read ran ahead of the
   WebKit lock queue rather than behind it. No foreign process was touched.
3. **K3 · slot waits.** NO_RIGHT's run waited ~75 s for a browser slot, the control server queued ~5 min for a heavy
   slot, and my WebKit runs queued behind foreign `--exclusive webkit` holders (§8). Waiting is declared, not a stall.
4. **K4 · git in the lane tree only**, through temporary indexes under my scratch (`read-tree`, `add -A web/frontend`,
   `write-tree`, `apply --cached [--check]`, `diff`, `ls-tree`, `grep`, `rev-parse`, `cat-file`); it wrote tree and blob
   objects to the shared object store, as every lane's temporary-index cut does. No commit, no `status`, no ref moved;
   no git on main or in the control tree. The lane's work tree is untouched (write-tree after my runs: see §8).
5. **Servers:** `:4243` vite dev, guarded, PID 69602, cwd the lane's `web/frontend`, my scratch config
   (`cacheDir` in my scratch, `e2e/` unwatched); `:4257` vite preview of the control, guarded, PID 92137, cwd
   `w7-control/web/frontend`, served `index-CubiZsMVSwTc.js`. Both stopped at return (§8).
6. **K5 · my own WebKit job held a browser slot while it waited.** `guarded` takes the browser-pool slot BEFORE the
   `ex-webkit` lock, so my queued `place-webkit` (PID 8227) sat on one of the six browser slots behind four foreign
   `--exclusive webkit` waiters (one queued 74 min) and starved my own Chromium run. At 17:04 I dequeued it and its
   chain shell (94713), both mine and checked by args, as the lane did (its I4); and at 17:03:48 I stopped my control
   server (wrapper 82361, `--port 4257`) once §3b had shown the control has no surface to read, freeing a heavy slot.
7. **At return:** `:4243` stopped by me at 17:16:4x (wrapper 69551, args `crit-PLR-PLACE/vite.dev.mts --port 4243`,
   checked; dev exit logged), `:4257` stopped at 17:03:48; neither port holds a listener of mine. No `rm`; my one
   discard (K1's empty file) is in my trash dir.

## 11 · Replay

- Bank: `GIT_INDEX_FILE=<scratch>/idx; git read-tree 74a2b5d9; git apply --cached pass9/prototype/PLR-PLACE/pass9.diff;
  git write-tree` → `4a97c02c`. Union: `read-tree 74a2b5d9` + `pass8/integrate/WAVE.diff` → `acb9c08e`, +
  `pass9/instruments/homes.on-WAVE.diff` → `acde977b`, + `pass9.delta.on-WAVE.diff` → `757e333f`.
- Batteries: vite dev on the lane's `web/frontend` with a scratch config (private `cacheDir`, `e2e/` unwatched) on
  `:4243`; the product rows `npx playwright test -c <scratch>/pw.prod.config.ts e2e/player-place.spec.ts
  --project=chromium --workers=1` (and `PLACE_SABOTAGE=<clause> … -g "(12|14|16|17) · "`), `e2e/player-mark.spec.ts`
  likewise; my rows `CRIT_MODE=thresh|corner|resize [CRIT_STRUCK=both] npx playwright test -c <scratch>/pw.crit.config.ts
  --project=chromium`, every one under `~/.claude/guard/guarded`. The scratch spec and configs live in
  `.claude/t9-scratch/work/pass9/crit-PLR-PLACE/` (never banked); its logs and JSON reports beside them.
