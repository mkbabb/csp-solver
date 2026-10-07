# PAL-WALK · pass 8 prototype (§11c, the hue walk)

Work tree `.claude/worktrees/wf_308fa864-c94-1`, base `74a2b5d9`, advanced in place (no replay, no reset, no clean). This attempt resumed the dead one (`wf_1c6d766f-5b5`). Its hunks were read and dispositioned before any file moved (§Resumption). Every number below was re-measured by this attempt on the final bytes unless it says otherwise. The number is the critic's.

## Bank

| item | value |
|---|---|
| tree (temp index, product paths only) | `be10b47db1f4732d32478f50b20103c93a395af6`, the same before the battery, after it, and at return |
| `pass8.diff` vs `74a2b5d9` | 503,076 B · sha1 `678ce3149d4c874f1c1a292b0a3534ce88ae5912` · `25 files changed, 10505 insertions(+), 90 deletions(-)` |
| `git apply --check`, fresh `git archive 74a2b5d9` | **0**. Applied, all 25 paths are `cmp`-equal to the tree |
| `pass8-delta.diff` | 151,636 B · sha1 `595a2c3e…` · 4 files, +1,466/−1,369, vs `74a2b5d9 + pass7.diff + homes.diff` (tree `22b09667`) · `apply --check` **0** on that base |
| integrated trees | §11c is in neither `s10` nor `s13-s7-s3`, so no `on-<union>` delta is owed |
| dist | `index-D6SsYDEtLYEn.js` / `index-DuyUzrAizsPb.css`, built out of tree after the last edit. 37 assets, the same as the control's 37 |
| instrument imports | `e2e/peer-walk.spec.ts` → `./lib/glyph-pop.mjs`; `scripts/check-peer-arcs.mjs` → `./shape-census.mjs`. `homes.diff` sha `a1d8adeb` is applied unmodified; the tree's `shape-census.mjs` is sha1 `5b8739d5`. No `docs/` import appears anywhere in `e2e/` or `scripts/` (grep exit 1) |

## Gaps first

1. **Row 10 is OPEN, so watch 2 stays HALF MET.** Gate 2 (check-peer-arcs check 2, file sha1 `55f2b88b`) lands PAL-TIN's law at the 0.10 floor for a room of **2** only. That is the walk's whole capacity under the law: the names sit 0.1253 apart by day and 0.1255 at night.
   - At a third player the walk breaks the law: 0.0528 by day, 0.0513 at night.
   - At TIN's own room of 5 the walk reads **0.0182 / 0.0194**, against TIN's sticks at 0.1162. The gate prints this every run as `OPEN (not gated)` and never as a pass.
   - HEAD's one string holds the law up to N=3 (0.1477 / 0.1438).
   - TIN's light exemption (0.075) is not used, because its premise is false for the walk: the day name is its own string, with chroma under the ring's for 53 of 144 hands.
   - TIN's sticks remain an incompatible route. The walk holds TIN's floor for two players; the idea does not die on this number, but it cannot claim TIN's law.
2. **Clean REDs at chromium DPR 1 by day: 6 of 24 rows, spec exit 1. The gate is not bent.** Cells 11, 12 and 14 (a given above) for both B payloads red on G4 and/or G5, always at the `i` glyph.
   - Name `…0b0b`: the ½3 column reads 3.95 against the 4.76 limit.
   - Name `…002e`: column 16 reads 4.39–4.41, and the `i` glyph 3.95–4.41.
   - HEAD's same-index ink reds the same column harder: 2.92 against 3.00.
   - G2 there sits on the rung (LEDGER T9-R8) and is printed. G4 and G5 are tail clauses, not the rung's, so they stay gating.
   - The chair rules whether the `i` stem crossing the given's grid line at 13 px / DPR 1 is the rung's physics too.
3. **Row 5 (row 3 light): I ask that the chair book the cell stamped.** On the ONE probe no ink clears the whole-population floor at chromium DPR 1 by day. The pass-7 "core 4.124" was a statistic of the deleted fork.
   - Cell 8, `…0b0b`, whole-population median:

     | ink | median |
     |---|---|
     | shipped L 0.295 | **2.086** |
     | L 0.25 | 2.148 |
     | L 0.22 | 2.209 |
     | L 0.18 | 2.293 |
     | HEAD same-index | 1.796 |

   - Source: `readings/t9-b-pw7-1-sweep.txt`, one payload, the only variable the name's L.
   - The L 0.22 arm buys +0.123 and clears nothing. Its price, re-derived on a copy: name ΔE N=2 0.1253 → **0.1126** by day (0.1255 → 0.1129 at night), N=3 0.0528 → **0.0373** (0.0513 → 0.0373).
   - It also reds check 5 (`the name's light arm is 0.22, not the ring's 0.295`) and the unit's `NAME_BANDS[0] == RING_BANDS[0]`.
   - T9-B-PW7-1 therefore goes to the owner UNFRAMED, as a priced row. Framing it would spend headroom on a pair whose arms both fail.
4. **WebKit FADE80 is still printed.** FADE80 and FADE80v read GREEN in 16 of 16 reads at DPR 2 and 8 of 16 at DPR 1.
   - FADE65 is REQUIRED at DPR 2 (the charter) and at DPR 1 (promoted this pass: RED 16 of 16 there).
   - DPR 3 was not run this pass and prints it.
   - FADE65's DPR 2 margin is thin: 0.272 against 0.260 (B dark), 0.268 against 0.252 (B light), 0.295 against 0.275 (A dark).
5. **The library has two holes, both PROPOSED with their plants.**
   - S3b `(el.style as T)[k] =` prints as a KNOWN HOLE in check 4's self-test, never as a pass.
   - The library's `colorLiterals` throws on `oklab(rgb)`. check 4 blanks and counts those calls (5 on the tree) until `shape-census.literal-nothrow.PROPOSED.diff` lands.
   - Both diffs are born-RED on the home copy: 92/93 and exit 1 each. Patched, each reads 93/93 with exit 0, and sabotaged each reds (`readings/library-proposed.txt`).
6. **The census row is APPLIED in the evidence copy, not in a product file.** The census is the chair's pass-6 instrument, with no product home.
   - With the row: tree 0 bare. Without it: 1 bare (`GameBoard.vue:1245`).
   - Both sides exit 1 on the pre-existing STALE `--refuse-dur` row. On the control the new row reads STALE, as it must, because the token does not exist there.
   - `--color-peer-name-ink` rides INERT on every authored cell. Only `.washi-label` under the tape consumes it. Named, not cured.
7. **Not run this pass.**
   - DPR 3 in either engine.
   - The runtime filter census. Served bytes read `filter:` 9 = 9 and `@property` 42 = 42 against the control.
   - The r2 probe's 4 reds are inherited: tree and control fail the same 4 rows in both engines.

## Numbers

### Leader duties (§11c)

- **The palette's number.** 87 at v7; the pass-8 number is the critic's.
- **The one painted statistic.** The name beats HEAD's SAME-INDEX ink on the whole-population median in **80 of 80** clean rows (4 configs × 20 subject-cells). The minimum margin per config:

  | config | min margin |
  |---|---|
  | chromium DPR 2 | +0.989 |
  | WebKit DPR 2 | +1.201 |
  | WebKit DPR 1 | +1.191 |
  | chromium DPR 1 | +0.243 |

- **The 144-hand ΔE table.** The deltas vs pass 7 are **0.0000 on every row** (digit, ring, name and HEAD at N = 2/3/4/5/6/8/16, both bands). `inkFor` did not move this pass (`readings/delta-e-separation.txt`).
- **Watch 2.** **HALF MET**, by gate-2 row sha1 `55f2b88b` (gap 1).
- **B-TAPE, with its cost written (§2.13c).** The default is WALK's name at L 0.86 by night and L 0.295 by day.
  - It wins every cell read, as above.
  - Its DAY cost: the name's chroma is below the ring's for **53/144** hands, worst **×0.625 at i = 55**. Hand 0 (the host, the name every joiner reads) falls **0.1207 → 0.0756** (×0.626), with no day contrast gain.
  - The name's minimum ΔE at N=4 falls **0.0514 → 0.0274** by day and 0.0510 → 0.0271 at night, against HEAD's 0.0991 / 0.0988.
  - Among the first 16 hands, the lowered ones are 0, 5, 8, 10 and 13.
  - FRAMED on hand 0 (below).

### The rows

| # | row | state | the number |
|---|---|---|---|
| 1 | check 4's A2–A5 through the ONE library; the fork deleted; clause sabotage | **CLOSED** | check-peer-arcs imports `./shape-census.mjs` and carries no reader of its own. A2 / A3 / A4 / A5 planted on fresh copies: pass-8 exit **1/1/1/1**, the pass-7 fork **0/0/0/0** (born-RED). Self-test rows WA2–WA5 are ✓. Sabotage battery **24/24 clauses bite** (17 of the gate's own, 7 of the library's it rests on) |
| 2 | L6's pair half on all three band vars + the three ink tokens over `index.css` and every `@import`, LANDED | **CLOSED** | Check 5 in the product gate (CI `lint:arcs`) reads `index.css + typography.css` through the library's `followImports`. A7 / A8 / A9 / A9b exit 1 (checks 3+5, 3+5, 4+5, 4+5), A5 reds 4+5. r0's L6 delegates its pair half to check 5 (`law-probe.L6-landed.PROPOSED.mjs`): tree GREEN exit 0; A7, A9b, A5 and the control each BROKEN, exit 1 |
| 3 | the CI pin `NAME_BANDS[1] ≥ 0.84` (unit) + the sheet's `.dark --peer-name-l` (check 3), A10 the negative | **CLOSED** | A10 (module and sheet at 0.80): unit exit **1** (`expected 0.8 to be greater than or equal to 0.84`, 1 failed / 55 passed); check 3 exit **1**; the pass-7 fork exit **0**. At the floor itself (0.84, coordinated) check 3 is GREEN (self-test row) |
| 4 | §C's G3 per payload/read; FADE65 required in WebKit DPR 2; §C through the ONE glyph-pop with HEAD12 | **CLOSED** | §C calls `glyphGate` (G3 = this read's clean + 0.05; `payload` required). The fork is deleted. FADE65 / FADE65v RED 16/16 at WebKit DPR 2 and 16/16 at DPR 1. HEAD12 and MID20 are in the required set. Required plants RED: chromium DPR 2 **88/88**, DPR 1 **88/88** (verdict excludes the rung's G2, so each plant reds on G1/G3/G4/G5); WebKit DPR 2 **72/72**, DPR 1 **72/72**. Holes: 0 |
| 5 | row 3 light: T9-B-PW7-1 or the chair books | **the chair books (asked)** | gap 3 |
| 6 | B-TAPE's cost written and framed on hand 0 | **CLOSED** | above; the frame below |
| 7 | hand 0's name from B's page as a second §C subject | **CLOSED** | A pinned `p-0000000a0a0a` ("substantial-earthworm", asserted equal to `slugFor(A)`) read on B's page at cells 16/22, both themes, both engines, DPR 1 and 2, plants in-run. Dark DPR 2 median: chromium 5.990 against HEAD 4.813; WebKit 6.866 against 5.475 |
| 8 | the census's INHERITED row applied; the inert ride named | **CLOSED as evidence** | gap 6 |
| 9 | r2 kinship re-run against the landed L6 | **CLOSED** | Tree = control on kinship light/dark and inline literals, both engines, byte-identical. focus-ring differs only in the dealt cell's label. Exception toll: peer worst 7.27 (control 5.36), on the tape 11.84 (control 4.79/4.78), name key shipped. 4 failed / 1 passed on both sides (`readings/kinship-r2.txt`) |
| 10 | TIN's separation law into gate 2 | **OPEN** | gap 1 |
| 11 | T9-R8: every painted-text number cited on the rung; whole-population AA per cell | **CLOSED with gap 2** | Per-cell table in `readings/section-c-gate.txt` (80 rows). Chromium DPR 1 G2 is printed as "G2 PRINTED (rung T9-R8)" in all 24 rows, and nothing else is bent |

### §C, whole-population AA (a sample; the full table is in `readings/section-c-gate.txt`)

Spec sha1 `630a6769` · tree `be10b47d` · dev server :4244 · 1280×800 · fine pointer · PRM. B = `p-0000000b0b0b` "quickest-rodent" or `p-00000000002e` "quintessential-guineafowl", both index 1. A = `p-0000000a0a0a`, index 0. Each cell reads name median / fraction under 4.5 / HEAD same-index median.

| config | B `…0b0b` light, c8 | B `…0b0b` dark, c8 | A0 light, c16 | A0 dark, c16 | B `…002e` light, c11 |
|---|---|---|---|---|---|
| chromium DPR 2 | 6.154 / 0.443 / 3.853 | 6.610 / 0.374 / 5.542 | 6.472 / 0.454 / 4.248 | 5.990 / 0.425 / 4.813 | 5.106 / 0.478 / 3.471 |
| WebKit DPR 2 | 11.891 / 0.202 / 5.067 | 7.192 / 0.210 / 5.991 | 12.473 / 0.216 / 5.609 | 6.866 / 0.225 / 5.475 | 11.891 / 0.242 / 5.067 |
| WebKit DPR 1 | 10.464 / 0.313 / 4.740 | 6.947 / 0.274 / 5.756 | 11.017 / 0.324 / 5.154 | 6.533 / 0.340 / 5.222 | 9.956 / 0.314 / 4.617 |
| chromium DPR 1 (rung) | 2.086 / 0.848 / 1.796 | 3.077 / 0.692 / 2.735 | 2.264 / 0.700 / 2.021 | 3.126 / 0.649 / 2.666 | 2.068 / 0.719 / 1.818 (G4/G5 RED) |

Exits: chromium DPR 2 **0**, WebKit DPR 2 **0**, WebKit DPR 1 **0**, chromium DPR 1 **1** (gap 2). The same four configs on the previous spec bytes (sha1 `b890b33b`, differing only in two re-spelled comments) produced an identical AA table.

### π and the dist

- The served entry CSS against `w7-control`'s dist (`readings/pi-served-css.txt`) moves only the claimed surface:
  - the tape label's `color` (`--color-user-ink` → `--color-peer-name-ink`) and its card-laid paper `background`;
  - the three band tokens in both arms (`--peer-ink-l` .5/.8 → .44/.65; `--peer-ring-l` .295/.79 and `--peer-name-l` .295/.86 new);
  - the rest is GameBoard's scope-hash rename.
- `filter:` declarations 9 = 9. `@property` 42 = 42.
- The first build was contaminated (incident 4). It was cured and rebuilt before any identity was cited.

### Pre-return battery (bare, tree | control = `git archive 74a2b5d9`)

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 · 0 · 0 |
| lint:bands · lint:verbs | 1 · 1 (npm "Missing script") | 1 · 1 (same) |
| test:e2e:projects (check-pw-projects self-test) | 0 | 0 |
| lint:arcs (check-peer-arcs `--self-test`) | 0 | 1 (no such script) |
| lint:copy · check-copy-register | 0 · 0 | 0 · 0 |
| lint:ink · lint:motion · lint:catch · lint:theme-selectors · lint:live-regions · lint:tdz · lint:boundary | 0 each | 0 each |
| `npm run lint` (prettier) | 0 | 0 (first read 2: the archive lacked `web/relay`; re-run with it) |
| lint:knip | 0 | 0 |
| typecheck:e2e · typecheck:node | 0 · 0 | 0 · 0 |
| `eslint . --max-warnings 0` | 0, and 0 again after the scratch left the tree | 0 |
| check-property-block (pass-6 copy; source + `--dist`) | 0 | 0 |
| vue-tsc `-b` · `-p tsconfig.e2e.json` on a `git archive` of `be10b47d` | 0 · 0 | — |
| vitest `src/games` · `src/pencil` · `src/composables` | 0 (57 files / 760) · 0 (8 / 73) · 0 (3 / 16) | — |
| check-peer-arcs bare · `--self-test` · `--sabotage-battery` | 0 · 0 (76 ✓, 1 KNOWN HOLE printed) · 0 (24/24) | — |
| check-evidence-policy (repo root) | PASS, exit 0 | — |

Box load (1-minute): 47–165 during the browser rows, and 50–140 during the node battery. No row here is a timing row.

## The lawful pair (headroom charged by name)

`frames/6-btape-hand0-day-chroma-shipped-vs-ring-1280-light-chromium+webkit-fine-dpr2-A-p0000000a0a0a-B-p0000000b0b0b.png`, 13,427 B (pngquant 60–90).

- **Rows, top to bottom:** chromium shipped · chromium ring-chroma · WebKit shipped · WebKit ring-chroma.
- **Setup:** the tape on B's page over A's cell 16, light, 1280×800, fine, PRM, DPR 2.
- **Payload:** ONE (A and B pinned, the encoded board).
- **Variable:** ONE, the host's day-name chroma: shipped `oklch(0.295 0.0756 27.17)` against the ring's `oklch(0.295 0.1207 27.17)`, which was pass 6's name. The ring arm is painted by overriding the label's `color` to `var(--color-peer-cursor-ink)`.
- **Pixels:** inside the label, chromium 3,715 px and WebKit 3,192 px differ; OUTSIDE the label, 0 px. Shipped against shipped-again is 0/0.
- **Headroom:** spends **13,427 B** of ruling 18's "B-TAPE hand-0 pair (≤ 20 KB)". It retires no crop; ruling 18 names this spend. The w7 wave reads 1,998,833 B after it, leaving 98,319 B of headroom.
- **Replaced:** the dead attempt's crop of the same name (13,435 B, unverified).

## Resumption (the dead attempt's hunks)

The tree's diff was cut through a temporary index. Against `74a2b5d9 + pass7.diff (45543f8b) + homes.diff (a1d8adeb)`, which is tree `22b09667`, the pass-7 bank and the homes were intact. The dead attempt had changed three files beyond them:

- **`src/games/shared/useSession.test.ts`: KEPT.** It adds the CI pin (row 3).
- **`scripts/check-peer-arcs.mjs`: KEPT and FINISHED.** It had been rewritten onto the ONE library, with checks 2/3/5, the plants and the sabotage battery. This attempt added the TIN-room OPEN line and prettier.
- **`e2e/peer-walk.spec.ts`: KEPT and FINISHED.** It had been rewritten onto glyph-pop, with hand 0 and HEAD's same-index ink. This attempt made four fixes:
  - (a) a plant at the rung could red on G2 alone, a gate that cannot fail. One verdict function now serves the clean read and every plant.
  - (b) the name probe appended a span into a Vue-owned node (LAWS P7 §F). It now resolves on a probe in `<body>`.
  - (c) FADE65 is required at WebKit DPR 1.
  - (d) incident 4.
- **`.github/workflows/ci.yml`:** the `lint:arcs` comment was re-cut to what the gate now holds.
- **The dead attempt's evidence:** every reading was moved to the scratchpad trash and re-measured. Its two library PROPOSED diffs and its L6 law-probe PROPOSED were re-verified (above) and kept. Its frame was replaced.

## Replay route

Either route reproduces tree `be10b47d`:

- `git archive 74a2b5d9` + `git apply pass8.diff`; or
- `74a2b5d9` + `pass7/prototype/PAL-WALK/pass7.diff` + `pass8/instruments/homes.diff` + `pass8-delta.diff`.

Browser rows use `instruments/pw.palwalk8.mts` (`WALK_DPR`, `WALK_OUT`, `WALK_DIR`/`WALK_MATCH`) against a dev server on the tree, because `?wire=local` is DEV-only. The attacks are in `instruments/check4-attacks.sh`, run on fresh copies. The frame is `instruments/frames8.spec.ts` and the sweep is `instruments/sweep8.spec.ts`.

## Incidents (self-declared)

1. **Edits during a running battery.** My first check-peer-arcs `--self-test` and `--sabotage-battery` ran while I edited the spec, which check 4 reads. Both were voided and killed by PID (cwd = this tree). Every cited run is on `be10b47d`.
2. **Batteries relaunched.** The node and pre-return batteries were killed mid-run (my own process trees only), because incident 4 needed a spec edit. Both were re-run from the start on the final tree.
3. **The control server on :4252 died mid-run.** Cause unknown, and its log has no exit line. The first kinship control rows read `ERR_CONNECTION_REFUSED`. I restarted it at 16:57 and re-ran both control rows; only the re-run is cited.
4. **Tailwind contamination (T9-R6's trap), inherited from `pass7.diff`.** The word "antialiased" in two spec comments minted `@layer utilities .antialiased` (2 declarations) into the shipped CSS. I re-spelled it "anti-aliased" and rebuilt; the diff is now clean against the control. The pass-7 bank carries the contaminant.
5. **The unit negative on the A10 copy first read 46 failed / exit 1, on the clean copy too.** The copies lacked `vitest.config.ts` (no jsdom). With the config copied: clean 56/56, exit 0; A10 1 failed, exit 1. Only the second reads are cited.
6. **Pipe trap.** The style-cast library self-test was first read through `| tail`, so its exit was tail's. I re-ran it bare: exit 0.
7. **Vite's temp config bundle** for both servers was written to `node_modules/.vite-temp`. `node_modules` is the main tree's, symlinked. That is the estate's standing layout, and it is declared here.
8. **Servers.** Tree :4244 was listener 57601 (wrapper 57515, cwd = this tree). Control :4252 was listener 69584 (wrapper 69507, cwd = the scratch archive). Both were killed by recorded PID at 17:35, and both ports read free. No git ran in `w7-control`. The scratch dir `.palwalk8/` was moved to the scratchpad trash, and `git status` shows product files only.
9. **No `rm`.** Every discard was `mv`'d to `<scratchpad>/palwalk9/trash-palwalk9/`.

## r0 rows MOVED

- **L6.** Its pair half is LANDED as check 5 of `scripts/check-peer-arcs.mjs` (CI `lint:arcs`). r0's law-probe delegates to it: `instruments/law-probe.L6-landed.PROPOSED.mjs`, plus `law-probe.L6.pair-landed.PROPOSED.diff` against pass 7's PROPOSED.

## Ballots

- **B-TAPE.** The default is WALK's name (L 0.86 night / 0.295 day). Its cost is written above and framed on hand 0. It wins 80/80 cells against HEAD's same-index ink.
- **T9-B-PW7-1.** I ask that the chair book chromium DPR 1 cell 8 light on T9-R8. The L 0.22 price goes to the owner UNFRAMED, because both arms read under 4.5 on the whole population (gap 3).
- **T9-B-PW7-2 / -3.** Struck at v7 (resolved by §2.4 and §2.13h).
