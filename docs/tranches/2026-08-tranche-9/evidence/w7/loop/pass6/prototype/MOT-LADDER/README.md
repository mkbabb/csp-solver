# MOT-LADDER · pass 6 PROTOTYPE

T9-W7 §13, the transition grammar. Worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`
(the one §13 tree; LADDER first, VERB after this bank). Base and π control in every row:
**`74a2b5d9`** (`w7-control`, dist `index-CubiZsMVSwTc.js`, served read-only on :4235, verified by hash).
Payload in every browser row: `?game=sudoku&board=ATMuMDM0NjA4OTEy…MTcw` (`encodeSudoku(3, <71 givens>, 81)`),
read back through the aria-label corpus: **71 `given clue` labels, sha1 `9c301f2981a8`, on every page of
every pose, both engines** (the instruments assert count > 0 and three-page equality, or they throw).

At open the tree matched the chair's bank: temp-index write-tree **`9a5475da`** = `74a2b5d9` + `pass5/prototype/MOT-VERB/pass5.diff`
(48 modified + 7 untracked, as the charter says). This pass touches **4 files, +800/−92**, no `src/`.

---

## 0 · Numbers first

| reading | control `74a2b5d9` | tree (T6) | engines |
| --- | --- | --- | --- |
| `lint:bands` BARE (CI's exact step) | 1 (script absent) | **0** | — |
| `--self-test` | — | **64 RED · 8 HELD · 0 vacuous** (pass 5: 45 / 4) | — |
| break-tests on the tree, `npm run lint:bands` | — | **12 rows exit 1, each for its own named reason; row 0 and FINAL exit 0; every restore sha1-verified** | — |
| the critic's A1 / A2 / A3 | — | **exit 1 / 1 / 1** (pass 5: 0 / 0 / 0) | — |
| clause 4 (`inherits: false` on `--motion-throw`) · `--live-fit` 0.99 · `dealStaggerMs` 90→10 · plant P5 `--ease-starTuck: ease-in` | — | **exit 1 · 1 · 1 · 1** (pass 5: 0 · 0 · 0 · 0) | — |
| `inherits` in-page (a registered `<time>` on `:root`, a child's `transition-duration`) | — | `true` → **0.52s**, `false` → **0s** | both |
| `ladder-prm.spec.ts`, FOUR poses (play 1440 fine, play 390×844 coarse, gallery 1440 fine, gallery 390×844 coarse) | **8/8 RED** (the rung row) | **8/8 green** | both |
| the same spec on a PLANT dist (`.drawer-tab-text` whisper → `150ms`, `index-V786IBvsnUYW.js`) | — | **8/8 RED at the roster clause** ("tweening under reduce outside .sun-moon-toggle") | both |
| `live-fit-ablation.spec.ts` (GC1, NEW) | **2/2 RED: board 672×672** | **2/2 green: board 0×0, `matrix(0, 0, 0, 0, …)`** | both |
| dist, clean build (config/outDir/cacheDir in the scratchpad) | — | **`index-DWMUHdQr1EaZ.js` / `index-CWzrjV_2Zj9L.css`, 38 files, `diff -rq`-IDENTICAL to a clean build of `9a5475da`** | — |
| LADDER's pass-5 tree `56d78d71`, rebuilt | — | `index-Dn-LDSadV1ia.js` / `index-CzMcUNChD8Q5.css` — the critic's identity, reproduced | — |
| π at rest, T5L (`56d78d71`) − CTL, 5 poses × 2 engines, noise arm | — | **0 one-sided · 0 moved · 0 painted px** in 10/10; timing-only (`transitionDuration` on 41–54 elements, the rung under reduce); noise 0 | both |
| π at rest, T6 − T5L (= VERB's pass-5 delta, since T6's dist ≡ `9a5475da`'s) | — | play poses: **8,588–42,496 px**, 4 moved (maxΔ 668), `backgroundColor` 4, `opacity` 3; gallery: 0 px. The 1113 one-sided keys are my key cascading off VERB's declared tag change (`svg.hand-drawn-grid` → `div.grid-ink`, 1176 vs 1175 nodes) | both |
| `check-property-block` (chair's copy) | 0 | **0** (8 source registrations; 49 served incl. Tailwind's) · self-test 0 | — |
| undefined-token census (chair's copy) | 1 (the STALE `--refuse-dur` row: A.1 ruling 4, declared) | **0** (3 ledgered, 0 stale) · self-test 0 | — |
| GC2 instrument (`instruments/gc2.mjs`, diff vs `74a2b5d9`) | — | **0**: 9 added literal sites, 8 declared exceptions with values · plant **1** | — |
| bundle css+js, gzip -9 per file | 524,594 / 172,954 (32 files) | 531,238 / 174,933 (33): **+6,644 / +1,979, merged tree incl. VERB pass 5; pass 6 alone 0 / 0** | — |
| `vue-tsc -b` | — | **0** | — |
| vitest (chunked: pencil · games · rest) | — | **69 files / 837 tests, 0 failed** (9/80 · 57/741 · 3/16) | — |
| six flips at 4× CPU, 390×844 dsf3, chromium | cold max 266.7 ms, warm max 65.9–99.8, over100 4 (cold) | cold 133.0, warm 43.1–66.0, over100 2 (cold) | chromium only (CDP throttle) |
| r1 `heading-voice.spec.ts` (copy) | 4 RED (3 voices, 2/8 headings, 20.35 vs 20) | **4 RED, identical readout (256 lines, `diff` 0)** | both |
| r3 `wobble.probe.ts` (copy) | ring σ 0.092 outside [0.722, 2.886]; length law 2/2 | **identical JSON** (timestamp aside) | both |

---

## 1 · Gaps, the hard parts first

1. **A1's decoy is narrowed, not closed.** A MOVED `newKey` must be unbanked, claimed once, and share
   the old key's selector or term. A new site carrying the moved term below the banked value reds.
   What still passes: a real destination that renames BOTH its selector and its keyframes while the
   row points at a decoy. That's a brand-new key, bounded only by B1 (a literal needs an ADMITTED row
   with its value). On a rung it passes B1. No gate over a content-anchored key can follow a site
   whose every name changed.
2. **A2's stamp moves the floor into review, not out of reach.** An author who re-banks AND
   re-stamps `BANK_SHA256` in the same commit is caught only where `BASE_REF` is reachable (break row
   A2b). At CI's depth 1 it is a visible edit to the gate file, and nothing more.
3. **B8's keyword twins are ADMITTED, not cured.** B8 now reads values, and reds on a keyword (P5), a
   new twin, an undeclared token, or a twin whose points drift. Five tokens that carry a UA keyword's
   exact points stay admitted by value in `KEYWORD_TWINS`: `--ease-starTuck` (ease-in),
   `--ease-starFade` (ease-out), `--ease-prmFade` (ease, the chair's §1.4 carve-out),
   `--ease-prmLinear` (linear) and `--verb-dusk-ease` (ease). Re-curving them is VERB's seam and
   M15's surface.
4. **The play-pose paint delta against the control is real and not this lane's.** T6 − CTL reads
   8.6k–42.5k px at the play poses. T5L − CTL reads 0, so the whole delta sits in `56d78d71 → 9a5475da`,
   which is VERB's pass 5 (the grid-ink pipeline). It's handed to VERB's critic by number.
5. **My π key is structural (`tag:nth` path), not semantic ancestry** (LAWS P5). One declared tag
   change cascades into 1113 one-sided keys. The px diff and the node count carry the reading, and the
   instrument needs a semantic key before any other lane cites it. The dark poses set `colorScheme`
   and click the toggle when `.dark` is absent, but they don't assert `.dark` afterwards.
6. **Row 15 (the toggle-opacity Δ at the flip) is OPEN**, per the charter's fallback. The delta is
   pass 4's: the pass-5 critic's third arm read T5 vs T4 at 0.005–0.077 against noise of 0.015–0.218.
   No per-element trace was run.
7. **The bundle ceiling (+400 / +150) is unmet** (row 12): +6,644 / +1,979 on the merged tree, 0 / 0
   from this pass. It's the chair's to re-cut to the registration law. The eight registrations cost
   571 B raw by themselves (pass-5 figure).
8. **`ladder-prm` and `live-fit-ablation` are estate rows, not CI** (O-12). Their CI half is B3/B5.
9. **The six-flip row ran on a loaded box** (other lanes' servers were up), with chromium only.
   The r3 length-law rows (4×4, 16×16) deal their own boards, so they're unpinned. Their JSON is
   byte-identical across arms anyway.
10. **GC1 exists only with motion on.** Under `reduce` the gallery deals a still poster and never
    mounts `.live-face-fit`, which is why the spec is `PRM: live`.

## 2 · The charter's fifteen rows

1. **B6 door A1: CLOSED (with gap 1).** A `newKey` must be live, absent from the bank, claimed by
   exactly one MOVED row, and share the old key's selector or term. A `MOTION.characters.<n>` newKey is
   allowed only when the old site reads `var(--<n>-dur)` bound from that character in src. The decoy
   clause is described in gap 1. Self-test: A1 verbatim, a banked newKey, an unrelated newKey, the
   decoy, two claims and a valueless MOVED row all RED; the lawful rename is HELD. Break rows A1 and
   A1b both exit 1.
2. **B6 door A2: CLOSED (with gap 2).** The script holds `BANK_SHA256`, the digest of the canonical
   `{base, rungs, sites}`. Where `BASE_REF` is reachable, B6 re-derives the floor and reds on any bank
   site that is below the base or missing. `--bank` prints the re-stamp line. Break row A2 exits 1 on
   both clauses. Row A2b (re-stamped) exits 1 on the re-derived floor.
3. **B6 door A3: CLOSED.** The whole-file skip is deleted. An orphan reds unless a MOVED or DELETED
   row names it with `ms` equal to the banked value. A DELETED row reds when its `selector :: term` is
   live in another file, because that's a move. The two live MOVED rows now carry `ms: 600` and
   `ms: 200`. Break row A3 exits 1, and the lawful deletion is HELD in the self-test.
4. **B3 reads `inherits`: CLOSED.** The descriptors are parsed whole. Every `--motion-*` and
   `--live-fit` registration must read `true`. Break row C4 exits 1. In-page, both engines read 0s
   under the plant. The fold's `check-property-block` is also green on the tree.
5. **`liveFitLaw` anchored: CLOSED.** The value must match `^0(\.0+)?$`, and 0.99 exits 1 (row C5).
6. **`EXEMPT_KEYS` carry `ms`: CLOSED** for all three rows (`beatMs 125`, `settleGuardMs 220`,
   `dealStaggerMs 90`). B2 reds on a mismatch, a missing `ms`, or a STALE member. Row C6 exits 1.
7. **The cited dist reproduced: CLOSED.** It was rebuilt after the last product edit with scratch
   outside the tree. `index-DWMUHdQr1EaZ.js` is byte-identical to `9a5475da`'s build, and
   `56d78d71` rebuilds to the critic's `index-Dn-LDSadV1ia.js`.
8. **Aria read-back: CLOSED.** It's in `pi6.mjs` (throws on count 0 or on any three-page mismatch),
   in `ladder-prm.spec.ts` (asserts 71) and in `live-fit-ablation.spec.ts` (asserts 71).
9. **GC2's 280: CLOSED as the declared exception with its value.** `gc2.mjs` lists all nine added
   literal sites: the laminate's 280 ×2 (GRADED against `leave` 200), 150 (PRM fallback), the
   toggle's 150/100/120 and the 560 delay, 200 (PRM), and the `scene.css` 150 delay. Each carries
   file, literal and count, and a plant reds it. It isn't homed on MOTION: that would add bytes and
   re-name a ratified pose for no pixel.
10. **`ladder-prm.spec.ts` walks four poses: CLOSED.** Numbers are in §0. `hasTouch` is witnessed by
    `(any-pointer: coarse)` in both engines.
11. **GC1 as a landed spec: CLOSED.** `e2e/live-fit-ablation.spec.ts` is in SPEC_MANIFEST. It's
    born-RED on the control at 672×672 in both engines.
12. **Bundle ceiling: OPEN**, the chair's re-cut (gap 7).
13. **B8 by value: CLOSED for keywords.** Twins are admitted by value (gap 3), and P5 exits 1
    (row C13). Landed before VERB re-runs it.
14. **§7(l) and r1/r3: RUN**, numbers in §0. None was struck.
15. **The toggle opacity Δ: OPEN** (gap 6).

## 3 · INTAKE rows (INTAKE.md §7)

- **Row 42: CLOSED on the tree.** `--live-fit` is registered once, `inherits: true`, initial exactly
  0, and read bare. GC1 is now a spec, born-RED on the control. `lint:motion` passes bare. The census
  over the tree reads 0 and the control reads 1 (declared). `--deck-top` is not registered, per the
  row. Main-HEAD was not re-served this pass: nothing on this surface moved, and pass 5 read main
  `1e6cfbbf` equal to the control at 672×672.
- **Row 43: CLOSED.** `dealStaggerMs 90` is homed and now VALUED. The three chrome lengths read rungs
  (pass 3/4). GC2 is an instrument with its declared exceptions (charter row 9). B6/`lint:bands` see
  the toggle's lengths. `lint:bands` passes BARE.

## 4 · Ballots

- **T9-B11 (`rise` 520 vs 600): STANDS LAWFUL.** No new crop. The kept strip
  `pass5/prototype/MOT-LADDER/t9-b11-dock-520-vs-600-webkit-light-768x1024-coarse-strip.png` is one
  dist, one variable, one payload. Recommendation: 520.
- The exit ballot stays WITHDRAWN (pass 5). GM-2 (`characters.bloom`) remains the chair's fork, and
  nothing was built for it.
- **T9-B12–B23: none is this lane's.** B21–B23 are M19/M15 (VERB's) and the rest are §10's. No pair
  is owed here.

## 5 · r0 / R6 rows

`instruments/R6-moved-rows.diff`: PROPOSED, carried forward with one change. Law 4's `+` line now
names the CSS lengths that a content-anchored ADMITTED row holds with its value (GC2's 280). Ruling 1
is unchanged. G-EXIT-MIRROR stays struck (pass 5). The pass-2 exit rest was re-read in pass 5
(145.49 / 145.77 at 390; 319.10 / 320.06 at 1440) and isn't moved here.

## 6 · Pre-return battery (bare; `instruments/battery.sh`, `logs/battery-table.txt`)

| row | tree | control |
| --- | --- | --- |
| lint:bands | 0 | 1 (absent) |
| lint:verbs | 0 | 1 (absent) |
| lint:motion · lint:copy · lint:lanes · lint:theme-tokens · lint:sleep | 0 ×5 | 0 ×5 |
| test:e2e:projects · check-pw-projects (bare) | 0 · 0 | 0 · 0 |
| eslint . · npm run lint (the scoped prettier form) · lint:knip | 0 · 0 · 0 | 0 · 0 · 0 |
| the spec files the rows live in (`ladder-prm`, `live-fit-ablation`) | 10/10 green | 10/10 RED |
| vue-tsc -b · vitest | 0 · 837/837 | — |

`lint:copy`: 0 unadmitted. No product string was added. filterBudget and AA are unchanged by
construction, because the dist is byte-identical to `9a5475da`'s.

## 7 · Replay route and the bank

In place, no replay. `pass6-ladder.diff` (50,935 B, 4 files, +800/−92) = T6 − `9a5475da`, cut through
a temporary index (`instruments/bank-delta.sh`). Applied `--cached --binary` on `9a5475da`, it writes
**`53a73123`**, which is the tree's own write-tree. The chain `74a2b5d9` + MOT-VERB/pass5.diff + this
diff also writes `53a73123`. Nothing is committed.

## 8 · Incidents

- **The first break-test run crashed instead of redding.** The A1/A1b rows exited 1 on a TypeError:
  `admits()` called `.includes` on a MOVED row's new numeric `ms`. A crash is not a red, so it was
  fixed (`Array.isArray(row.ms)`), re-run, and each row now reds for its named reason.
- Two early scratch writes went outside the scratchpad: `/tmp/_x` and `$TMPDIR/x` (a self-test log,
  a few KB). They're left in place.
- The first rows run timed out on `.live-face-fit` under reduce (the poster, gap 10). The run was
  killed by PID and the spec re-cut.
- `pi6.mjs` first failed to import sharp (a wrong path).
- Servers: tree :4246 (40435, npm 40323), control :4235 (40419, npm 40325), plant :4236 (78229, npm
  78193), T5L :4237 (91070, npm 91013). All were killed by PID. :4236 was re-bound at 11:58 by another
  lane's server (`-33`, pid 87551), which isn't mine and wasn't touched.
- No git in the control tree. No rm. `node_modules/.vite-temp` is empty. The worktree's `git status`
  shows product files only. Scratch is under `<scratchpad>/motladder6-*`, for the chair to clear.
