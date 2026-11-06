# PLR-COUNT · pass 10 · CRITIQUE (§11 player mark, batch 4)

Critic: non-author. Ports: lane `127.0.0.1:4242` (Vite dev on the critic's OWN copy of the bank, see §0), control
`127.0.0.1:4260` (`w7-control`'s pre-built dist, read back `index-CubiZsMVSwTc.js` / `index-CMaYSiPKVidg.css` before
every job). Opened 2026-11-04 04:02, zone inuse 4,625,294, load 15.60/14.75/14.89, `~/.claude/guard/ZONE-ARMED`
present (the reaper's leak detector; every browser row below opened under the 8M law with its inuse printed). No git
on main or the control tree, nothing committed; every scratch tree `git init`-ed under the critic's durable scratch.
The prototyper's work tree was read through a temporary index and never served or edited.

## 0 · The bank, re-derived (browserless)

- **Shas (bare `shasum`):** `pass10.diff` 5c5b42d7 (308,884 B, 28 files, `+5081/−513`), `pass10.delta.on-WAVE.diff`
  b5496790 (29,338 B, 1 file, `e2e/player-tally.spec.ts`), homes.diff 07257854, homes.on-WAVE.diff 0723d508, WAVE.diff
  b3725e4f, SELF on-WAVE 540b93da, PLACE on-WAVE 7d888a8a. All equal BANKED.txt.
- **The work tree through a temporary index:** HEAD 74a2b5d9, `add -A web/frontend` → tree `d3ad9037`, frontend
  `7d408f60` (BANKED.txt's), 41 paths against HEAD = the bank's 28 + the 13 home paths. The critic's copy
  (`git archive 74a2b5d9` + `homes.diff` + `pass10.diff`, own `.git`) writes frontend **`7d408f60`**: the served tree
  below IS the bank, byte for byte.
- **The pass-10 advance** (`git diff` of 74a2b5d9+pass9.diff `23e655a8` → 74a2b5d9+homes.diff+pass10.diff `44b7d7b4`,
  the 13 home paths excluded): 5 files `+442/−105` — `e2e/player-tally.spec.ts` (+319/−80, the lane's own; its body is
  line-identical to the on-WAVE delta), and SELF's four by sha (`e2e/node.d.ts`, `e2e/player-mark.spec.ts`,
  `rowBudget.ts`, `pencilConfig.ts`). **The two product hunks are comments only** (rowBudget.ts +7 doc lines;
  pencilConfig.ts the B-INK-RUNG cite in a doc comment): the pass-10 advance moves no product byte that reaches a dist.
- **Homes v3 by sha, no residue:** 0 of the 13 home paths in `pass10.diff`, 0 in the delta. The p9 → p10 move on the
  home paths is homes v3's (11 of 13 blobs moved, `paint-lib.*` and `knip.json` unchanged); none rides the bank.
- **The return's own path list is wrong in one place:** `filesTouched` lists `e2e/lib/`, `knip.json` and
  `scripts/shape-census.{mjs,d.mts}` among "carried pass-9 product paths (pass10.diff = 28 files)". They are home paths
  and pass10.diff carries none of them (its 28 paths, read: no `e2e/lib/`, no knip.json, no shape-census). BANKED.txt
  is right; the return's prose is not. A record error, not a bank error.
- **Grep:** 'scratchpad' / '/private/tmp' / '/tmp/' / '.claude/t9-scratch' = 0 in both diffs; dot-dirs on `+++` = 0.

### apply --check (critic's archives, each its own `.git`; `--cached` on temporary indexes; exits bare)

| check | base | patch | exit | paths | git dir |
|---|---|---|---|---|---|
| base | 74a2b5d9 archive (tree `243fbf57`; the archive drops the docs/precepts gitlink) | pass10.diff | **0** | 28 | `crit-PLR-COUNT/ac/base/.git` |
| basehomes | + homes.diff → frontend `eef6bcea` | pass10.diff | **0** → frontend `7d408f60` | 28 | same |
| wave | 74a2b5d9 + WAVE.diff (archive tree `044284b5`, frontend `8b8b7f8e` = 954bbbab's content) | delta | **0** | 1 | `crit-PLR-COUNT/ac/wave/.git` |
| wave-full | same | pass10.diff | **1**, 46 errors (not a route; as BANKED.txt says) | 28 | same |
| wavehomes | + homes.on-WAVE → frontend `dd2e30bb` | delta | **0** | 1 | same |
| STACKED (declared base) | + SELF 540b93da → frontend `11d04ba3` | delta | **0** → frontend **`0c123eba`** | 1 | same |
| S→C→P | + PLACE 7d888a8a | PLACE | **0** → frontend **`e999e521`** | 4 | same |
| S→P→C | wavehomes + SELF + PLACE (frontend `49a207f8`) | delta | **0** → frontend **`e999e521`** | 1 | same |

Every frontend id the lane printed reproduces (`11d04ba3`, `0c123eba`, `e999e521` in both orders). The section's
integrated tree is the WAVE (§11 is in neither s10 nor s13-s7-s3). **S1 is cured: the declared base is true and
checked stacked, by sha.** PICK 9's stacking half is MET.

## 1 · Re-derived on the real surface — chromium (the bank served from the critic's copy, frontend `7d408f60`)

Dev `:4242` (`vite` on `crit-PLR-COUNT/ac/base/web/frontend`, private cacheDir, guarded `--timeout 90`, pid recorded)
beside the control `:4260` (`w7-control` dist, `index-CubiZsMVSwTc.js` + `index-CMaYSiPKVidg.css`, read back before every
job). Each job its own `guarded` call, `--workers=1`, default headless shell; exits read bare from `logs/<job>.exit`.
The pass-9 plants ran FIRST (SELF-anchoring = TOKENF-SELF's mechanism, SLK045/SLK055, PLUSSPLIT).

| job | plant | window · load (1-min) open→close · zone inuse | exit (bare) | reading |
|---|---|---|---|---|
| C-CLEAN | none | 04:06:48–04:08:15 · 15.33 → 16.59 · 4,666,766 | **0, 4 passed** | 12/12 lines = control to the 3rd decimal: light-1 .817/.774/.790, light-2 .486/.515/.496, dark-1 .530/.537/.514, dark-2 .366/.359/.334 (each = its control read; **the lane's row reproduces exactly**). Control asserted `index-CubiZsMVSwTc.js` per cell. Pin: light-1 (0.050, 0.183], 18 near rungs; light-2 (0.026, 0.485], **0 near**; dark-1 **(0.048, 0.052]**, 12 near; dark-2 (0.033, —], **0 near, no rung past at all**; 0 wrong rungs |
| C-SELF (pass-9 TOKENF-SELF's anchor) | `G14_CONTROL=:4242` | 04:08:15–04:08:25 · 16.59 → 17.18 | **1, 2/2 red** | `the control is the π control's dist (light-1 / dark-1)`, received `""` — **A1 born-RED reproduces** |
| C-SLK055 (bound + ε) | `G14_SLACK=0.055` | 04:08:25–04:08:50 · 17.18 → 14.23 | **1** | dark-1: the iff row, 3 `.pl-qual` rungs (96.5/96/95.5) at +0.052 `past` and unseen — reproduces |
| C-SLK045 (bound − ε) | `G14_SLACK=0.045` | 04:08:50–04:09:16 · 14.23 → 13.34 · 4,686,608 | **1** | light-1: `.pl-qual` rungs at +0.048 now seen by G3 while inside — reproduces |
| C-PLUSCLEAN | none | 04:09:16–04:09:22 · 13.34 | **0** | 5/5 in-run plants SEEN; `shown: null` at 6 and 16 |
| C-PLUSSPLIT (pass-9's) | FILE, `PlayerMark.vue` (sha 3adf42dd → c12a8509, restored OK) | 04:09:32–04:09:38 · 12.57 | **1** | `no shown text holds a plus line at 6`, received `65 plus 16` — **row 3 born-RED reproduces** |
| **C-PLUSCTR (critic's, new)** | FILE: `<i class="crit-ctr" :style="{counterReset: `ca ${TALLY_MAX} cb ${count-TALLY_MAX}`}">` in the written count + `.crit-ctr::after{content: counter(ca) " plus " counter(cb)}` (3adf42dd → 44a43e2d, restored OK) | 04:09:49–04:09:54 · 12.54 | **0, GREEN** | `shown: null` at 6 and 16 — see §2 for whether it paints |
| **C-PLUSNOSP (critic's, new)** | FILE: the line in three `<i class="crit-gap">` with `margin-inline: 0.2em` and the copy's word trimmed (3adf42dd → bbe9160a, restored OK) | 04:10:04–04:10:10 · 11.51 | **0, GREEN** | `shown: null` at 6 and 16 — see §2 |

Re-derived (two measurements, chromium half): **row 1** (anchor asserted, born-RED by self-anchoring) and **row 2** (the
clean fractions 12/12 and the pin's intervals, SLK045/SLK055 red where the lane said). Both reproduce to the digit.

## 2 · Row 3, the plus twin at its class: OPEN again (two critic plants paint the line and read GREEN)

The pass-10 cure joins the page's text nodes with nothing between them, adds `body.innerText`, and resolves `attr()` in a
pseudo's computed `content`; then it asks `PLUS_LINE` = `\d+ plus \d+` (the copy's ` plus ` with its spaces). That cures
PLUSSPLIT (it reds, above). It does not cure the class, which is **a `plus` line painted where the font-coverage exemption
says it never is**. Two shapes of that line escape, each proven PAINTED by a scratch probe (`e2e/crit-plus-probe.spec.ts`
in the critic's copy, never banked: the planted element's box against a hidden reference span in the same computed font):

| plant (bytes: `od -c` in `crit-PLR-COUNT/plants/<name>.<i>.plant`) | twin (chromium) | what paints at 6 / 16 (probe, chromium) |
|---|---|---|
| **PLUSCTR**: `::after { content: counter(ca) " plus " counter(cb) }`, the counters reset from `TALLY_MAX` and `count − TALLY_MAX` | **exit 0, GREEN**, `shown: null` at 6 and 16 | the pseudo's box **89.73 px** at 6 against the reference `5 plus 1` **89.72 px**; **101.69** at 16 against `5 plus 11` **101.67**. `getComputedStyle(…, '::after').content` serialises **`counter(ca) " plus " counter(cb)`**: no digit, so `PLUS_LINE` misses it and `innerText` never holds pseudo content |
| **PLUSNOSP**: the line in three inline `<i>` with `margin-inline: 0.2em` and the copy's word trimmed | **exit 0, GREEN**, `shown: null` at 6 and 16 | painted `6 · 5 · plus · 1` with 6.59 px margins (boxes at x 105.1 / 132.2 / 194.1); the DOM's rendered text is **`65plus1`** (`innerText`), and the joined nodes likewise: no space, no match |

The pass-9 critic named the cure "a twin that reads the RENDERED line ... or the bare ` plus ` word with no digit clause".
The lane took the first half for text nodes only: the regex still demands digits and literal spaces, and a pseudo's
`counter()` is read unresolved. **Row 3 is cured for its plants (node, split, svg, attr, title, PLUSSPLIT, PLUSATTR) and
not its class (registry-v8 §2.12): OPEN.** The cure the class needs is the word, not the shape: any painted `plus` (the
copy's word, case-folded, with no digit or space clause) outside an accessible name, read across nodes, `innerText`, and
pseudo `content` with `counter()`/`counters()` resolved (or the pseudo's own text through a Range/`::after` box test), with
PLUSCTR and PLUSNOSP in the in-run plant set beside the five.

## 3 · The anchor's class (critic's test of row 1): the JS identity binds the paint's CSS — no hole

The anchor asserts the control's JS bundle name, while the gate's subject (the quiet lines' ink) is set in CSS. The
control's JS does not name its CSS (`grep index-CMaYSiPKVidg` in `index-CubiZsMVSwTc.js` = 0), so the critic rebuilt
74a2b5d9 in a `git init`-ed archive (`crit-PLR-COUNT/ac/ctl`, private cacheDir, `guarded`, vite 8.1.4) twice: A clean,
B with TOKENF (`--ink-press-quiet` 68 % → 58 % in `src/assets/index.css`, restored by sha a870de96):

- A: `index-BOytrTnLSO5X.js` + `index-CMaYSiPKVidg.css` (93,634 B — the control's served CSS name and bytes, 93,634 B).
- B: `index-CdFhZE0dlwhx.js` + `index-CuMbb-siGyQr.css` (93,634 B).

A CSS-only change moves the JS name (the bundler folds the entry CSS name into the chunk hash), so a control re-built with
a token regression cannot pass `G14_BUNDLE`. **Row 1 holds at its class.** One honest cost, declared: the scratch rebuild
of the π SOURCE does not reproduce `index-CubiZsMVSwTc.js` (A's JS differs while its CSS is byte-equal), so the anchor
pins one built artefact, not 74a2b5d9: any rebuild of `w7-control`'s dist reds every G14 cell until the literal moves.
That is the stamp law working (LAWS P9 §F), and the literal is the next pass's maintenance.

## 4 · Constraints (the critic's reads; tree = the critic's copy, frontend `7d408f60`)

- **π against 74a2b5d9:** the pass-10 ADVANCE moves no product byte that reaches a dist (the two product hunks are
  comments, §0). The bank's carried pass-9 product bytes are pass 9's π, unchanged. **The charter's return item "π (the
  roster row named)" (pass-9 gap 9, the `ul.players-roster.sr-only` flex → block row outside the head) is not answered
  anywhere in the pass-10 README or return: OPEN on the record.**
- **AA from painted bytes:** the G14 rows ARE painted-byte contrast reads of the three quiet lines (12/12 equal to the
  control, both engines, §1/§5); no other surface moved this pass. The return carries no AA line of its own (LAWS §K).
- **filterBudget 9:** no `<filter>`, `filter: url(` or `fe*` added in either diff (grep 0); `SvgFilters.test.ts` exit 0.
- **M16:** `lint:copy` exit 0 on the tree.
- **@property law:** the delta adds none; the bank's two `@property` lines are SELF's carried `--head-rule` and SELF's
  spec probe (pass-9 bytes, the WAVE's), not this lane's.
- **Gates on the tree (bare, guarded --light):** `lint:copy` 0, `lint:sleep` 0, `lint:theme-tokens` 0,
  `test:font-coverage` 0, `typecheck:e2e` 0, `SvgFilters.test` 0 (filterBudget), eslint on the spec 0.
- **The ballot pair on one payload:** no frame this pass (none booked); the two ballots are numbers only.
- **Unit on the tree (critic's copy, vitest `--maxWorkers=2`, four guarded chunks, exits bare from files):** `src/pencil` 9/81, `src/games/shared` 34/429, the five games + `src/composables` 24/309, `cards`+`posters` 2/19 = **69 files / 838 tests, 0 failed** — the lane's count, re-derived.

## 6 · The picks and the batch gate, judged

- **PICK 9 (ONE route with PLACE, stacked on SELF's): the stacking is MET, the cure is not.** The route replays from the
  RECORD's bytes now (PLACE's critic, 02:27, could check it only on COUNT's pre-bank scratch copy and read `60c91718`; the
  banked delta gives `e999e521` in both orders, re-derived here, §0). On it, 10 of the 11 union-born reds read GREEN
  (the lane's TRI/WTRI; the WAVE's unread column read them RED in WebKit, `WAVE9-read.md` rows 49/81 — that is the
  baseline the route is measured against). **The tall phone stays RED (2.74 px chromium / 3.05 px WebKit lap, the lane's
  number, not re-read by the critic) and is handed to "PLACE's chart predicate", but neither PLACE's pass-10 README nor
  PLACE's critique carries it** (both close before COUNT's 03:49 TRI run; PLACE's README names no tall-phone row). A red
  on the one route that the route's two owners each attribute to the other or to nobody is an ORPHANED red: the chair
  must name its owner. Under the chart arm the row's row-count clause also becomes `rows > 0` with the foot keyed on the
  rows drawn (`:651–655`): a bound that scales with its subject (LAWS P9 §F); the board clause is what still bites.
- **PICK 17 (G14_SLACK a fitted constant; the WebKit ladder's four straddling lines asserted): MET on the rule, PARTIAL on
  the witness.** The iff (G3 ⇔ fraction > control + 0.05, a typed literal) holds on every G2win rung of every line, and
  SLK045/SLK055 red where they should (re-derived, both engines). But the straddle WITNESS is asserted per CELL
  (`STRADDLE_CELLS`: WebKit light-1/dark-1, chromium dark-1: "some rung within 0.01 on each side"), not per LINE: pass 9
  named four WebKit lines (light-1 `.pl-state`, `.pl-qual`, `.pl-more`; dark-1 `.pl-more`), and three of them could stop
  straddling with the row GREEN. Light-2 and dark-2 have no rung within 0.01 of the bound in chromium (0 near; dark-2 no
  rung past at all), so there the pin is vacuous, as the lane declares. The caption is the lane's ballot text; it lands
  in registry §9 at the fold, not in this bank.
- **The batch gate:** COUNT + PLACE's ONE route applies stacked on SELF's — **MET** (bytes, §0). LADDER's K7r through CI
  is LADDER's, not read here.
- **At the pick, by default:** at the default slack the iff is consistent by construction (both sides compute
  `fracUnder > control + 0.05`); it can fail only when the knob and the literal part or the library's comparator changes.
  That is what a pin is, and it is honest about it; it does not price whether 0.05 is the right width (A3, OPA95F
  dark-2 GREEN on the clean verdict, the owner's caption).

**One vacuity inside row 1, declared:** the "identity's negative control, same run" (`the tree's own page is not the
control`, `:1014–1017`) reads the tree page's `/assets/index-*.js`. On the dev server every row is served from, that is
always `""` (Vite dev ships no hashed bundle), so the negative cannot red there; it bites only on a preview of the tree's
own dist. The born-RED that matters (self-anchoring reds on the control's identity) is real and reproduced; the
"negative" is decorative on the surface the gate runs on.

## 5 · Re-derived — WebKit (each job its own `guarded --exclusive webkit` call; queued behind foreign WebKit runs, declared)

| job | plant | window · load open→close · zone inuse | exit (bare) | reading |
|---|---|---|---|---|
| W-CLEAN | none | 04:14:26–04:17:04 · 11.89 → 15.08 · 4,736,524 | **0, 4 passed** | 12/12 lines = control: light-1 .814/.816/.814, light-2 .488/.524/.497, dark-1 .617/.615/.622, dark-2 .416/.395/.402 (**= the lane's WG14 to the third decimal**); control `index-CubiZsMVSwTc.js` per cell. Pin: light-1 **(0.048, 0.051]** 8 near; light-2 **(0.050, 0.057]** 8 near; dark-1 **(0.042, 0.053]** 6 near; dark-2 (0.035, —] **0 near, no rung past**; 0 wrong rungs |
| W-SELF | `G14_CONTROL=:4242` | 04:17:04–04:22:24 (queued ~5 min behind a foreign WebKit run, gregg `p7-wk-probe2`) · 15.08 → 13.72 · 4,768,046 | **1, 2/2 red** | `the control is the π control's dist (light-1 / dark-1)`, received `""` — **A1 born-RED, WebKit** |
| W-SLK055 | `G14_SLACK=0.055` | 04:22:24–04:23:37 · 13.72 → 14.46 · 4,814,979 | **1, 2/2 red** | light-1 `.pl-state` rungs at +0.051/+0.054 past and unseen; dark-1 `.pl-more` at +0.053 — reproduces WSLK055b |
| W-SLK045 | `G14_SLACK=0.045` | 04:23:37–04:24:15 · 14.46 → 14.85 · 4,823,252 | **1** | light-1 `.pl-qual` rung at +0.048 inside and seen — reproduces WSLK045b |
| W-PLUSSPLIT | FILE PLUSSPLIT (restored OK) | 04:24:25–04:26:06 · 14.81 → 15.00 · 4,831,242 | **1** | `no shown text holds a plus line at 6`, received `65 plus 16` — **row 3's pass-9 plant red, WebKit** |
| **W-PLUSCTR (critic's)** | FILE PLUSCTR (restored OK) | 04:26:16–04:32:09 (queued behind a foreign glass-ui visual run) · 14.05 → 10.35 · 4,850,944 | **0, GREEN** | `shown: null` at 6 and 16; W-PROBE-CTR (04:38:05–04:38:31, inuse 4,951,872, exit 0): the pseudo's box **89.73 / 101.68 px** = reference `5 plus 1` / `5 plus 11` **89.73 / 101.69 px**; content serialised `counter(ca) " plus " counter(cb)` — **painted, unseen, WebKit** |
| **W-PLUSNOSP (critic's)** | FILE PLUSNOSP (restored OK) | 04:32:20–04:37:55 (queued, foreign glass-ui run) · 10.65 → 10.23 · 4,903,374 | **0, GREEN** | `shown: null` at 6 and 16; W-PROBE-NOSP (04:38:41–04:38:50, inuse 4,961,986, exit 0): painted `6 · 5 · plus · 1` with 6.59 px margins, `innerText` **`65plus1`** — **painted, unseen, WebKit** |

Re-derived, WebKit half: rows 1 and 2 reproduce to the third decimal and to the lane's intervals; row 3's two new
escapes hold in WebKit as in chromium. Every browser row opened under zone inuse 8,000,000 (4,666,766 → 4,961,986);
1-minute load 10.07–19.74 (no row above 120). The control's exit is not a separate battery here: the control is
served, asserted by bundle and CSS name before every job (`srv.sh status`), and its reads are the gate's in-run halves.

## 7 · Open gaps (exact, the critic's, ranked)

1. **Row 3, the plus twin, OPEN at its class (third pass running).** PLUSCTR (`::after { content: counter(ca) " plus "
   counter(cb) }`) and PLUSNOSP (the line in three margin-spaced `<i>`) PAINT the plus line at 6 and 16 (probe: the
   pseudo's box 89.73/101.69 px = the reference `5 plus 1`/`5 plus 11` 89.72/101.67 px) and the twin reads GREEN, in
   BOTH engines (§2, §5). `PLUS_LINE` still needs digits and literal spaces; pseudo `counter()` reads unresolved. The
   font-coverage exemption the twin backs is unproven for the class.
2. **The one route's tall-phone red is ORPHANED.** 2.74 px (chromium) / 3.05 px (WebKit) lap on `e999e521` (the lane's
   number), handed to "PLACE's chart predicate"; PLACE's README, ROUTE.md and critique do not carry it. The chair names
   its owner. Under the chart arm the row's count clause is `rows > 0` with the foot keyed on the rows drawn: a bound
   that scales with its subject (LAWS P9 §F).
3. **PICK 17's witness is per cell, not per line.** The four WebKit lines pass 9 named are not each asserted to straddle;
   light-2/dark-2 carry no rung within 0.01 of the bound (chromium and WebKit: 0 near; dark-2 no rung past), so the pin
   is vacuous there. The rule itself (iff on every rung) holds and its ±ε plants red both engines.
4. **A3, the knob's price (the owner's caption):** 0.05 admits OPA95F on dark-2's clean verdict (+0.026/+0.032/+0.032,
   the lane's chromium read); a slack that caught it sits under 0.026. Carried, not re-read by the critic.
5. **π's roster row (pass-9 gap 9) and the AA/π return lines are absent** from the pass-10 README and return (LAWS §K).
   The advance itself moves no product byte (comment-only hunks), so π of the ADVANCE is 0 by bytes.
6. **The identity's negative is decorative on dev** (`own` is always `""`); the born-RED is real.
7. **The return's `filesTouched` misstates the bank:** it lists `e2e/lib/`, `knip.json`, `scripts/shape-census.*` as
   pass10.diff paths; the bank carries none (BANKED.txt is right).
8. **Imported by sha, unread here:** SELF's `player-mark.spec.ts` blob carries SELF's critic's `:1138` (red by
   construction) and `:571` (chromium red); COUNT's bank carries that file and ran none of it.
9. **Carried:** TIN × SELF `:1504` ×2 and `:1716` RED on the route (GREEN on COUNT's tree); `peer-tin:822` (0 of 2
   ticks, TIN's); two tally-stroke clocks (CHAIR §6 blocks); C5 dark-only (`G5_BITES`); check 8 FLOOR BAND, T9-R8,
   `--tap-floor` ×2 (T9-R10), the union's base-born lint:theme-tokens 2 / font-coverage 1 / lint:sleep 1; SELF's B3
   skip; T9-R6's `:visible` utilities; the lane's two unexplained navigation flakes.

## 8 · The number and the verdict

**91 (from 90). ADVANCE: alive, not converged; no default moves.** Earned: A1 closed and closed at its class (the CSS
rebuild shows the JS identity binds the paint's CSS); the slack pinned by an iff on every rung with ±ε reds in both
engines; the replay route true from the record's bytes in both orders; B-FORK explained in numbers; all of it
re-derived to the digit on a byte-identical copy of the bank, both engines. Withheld: row 3 is cured for its plant a
third time and still open at its class (two new painted escapes); the route's last red has no owner in the record and
its row-count clause scales with its subject; the straddle witness is cell-keyed; π's roster row and the AA/π lines are
missing from the return. Earliest 100: not before pass 12 (row 3 at its class with a plant per shape, the tall phone
owned and cured or priced by its owner, the witness per line, π named).

## 9 · Not re-derived by the critic (cited, never re-read as the critic's)

The one route's run (TRI/WTRI on `e999e521`: chromium 25/4, WebKit 24/1/4; the tall phone 224.47 vs 221.73 / 221.42),
the union reads (UCLEAN/UTALL/WUCLEAN), TOKENF/OPA95F/DROPG3 and B-FORK's N = 7 inks: the lane's numbers. The critic
re-checked the route on bytes only. `filter-census` (the e2e filterBudget census) was not run; filterBudget rests on
grep 0 + `SvgFilters.test` 4/4. `player-mark.spec.ts` (SELF's blob, carried) was not run.

## 10 · Incidents (the critic's, self-declared) and closing state

1. `ZONE-ARMED` present from open to close; every browser row under 8M with inuse printed (4.67M → 4.96M).
2. WebKit queued behind three foreign `--exclusive webkit` runs (gregg 04:17–04:22; glass-ui 04:26–04:32 and
   04:32–04:37); waited in the background, chromium rows run first. No row lost.
3. A first apply-check log line printed `git apply --check` exits through a script, bare to the log; the unit chunks'
   counts were displayed through grep, their exits read bare from `logs/unit-*.exit`. The spec's eslint ran without
   `guarded` (one quick lint).
4. One shell call was mis-pathed (relative log path, exited 1 before running anything) and re-run with absolute paths.
5. One `lsof -p … -d cwd` on a foreign PID printed the whole machine's cwd table (the PID had no match): read-only noise.
6. `srv.sh stop` killed by the PIDs this critic recorded at launch (its cwd check was by the recorded dir, not `lsof`).
7. The scratch rig (`.crit-pw.config.ts`, `e2e/crit-plus-probe.spec.ts`) lives only in the critic's archive copy; the
   prototyper's work tree was never served, planted or written.

Closing: both critic servers stopped (04:40:08); no listener on :4242 or :4260; no critic process remains; the copy's
`PlayerMark.vue` blob `a1319851` = its index (every plant restored by sha); the copy's spec blob `02caa240` = the bank's.
Scratch: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-PLR-COUNT/`
(`ac/{base,wave,ctl}` each `git init`-ed; `logs/`, `plants/`, `run.sh`, `srv.sh`, `plants.py`, `sum.py`, `build.sh`).
