# PASS-7 REGISTRY — THE NON-AUTHOR AUDIT · 2026-08-02

Tree at close: MAIN **`4b28f034`** ("T5-W4 PASS 6 SEALED") plus **31 modified/untracked paths**
and an untracked `pass7/` evidence tree. Production remains CF deployment `f1adfca5`; nothing was
built into `web/frontend/dist`, deployed or pushed by this audit, and no git state was changed in
the main tree.

**This registry is written by the pass's non-author audit, which authored nothing this pass.**
Every lane's order-item was verified at its own site and every number re-derived here, on
instruments this audit wrote, in scratch copies, never in the live tree. Logs and rigs:
`pass7/audit/`.

**ONE ARTIFACT, and a second builder agrees with it to the byte.**

```
assets/index-ZYnCGMYLIhQw.js    md5 d42a792ee8a8f5a4a003aca7a43bcb75
assets/index-Cv2up1oVlSd3.css   md5 5cf4831614e22cf7295bb4ffa492e824
39 files · 820 KB · manifest md5 (over sorted per-file md5s) 246b88c395900ce706144f18a1f3a79b
animation-vendor 11,641 B — the 0.12.0 shape (0.11.0 reads 11,054)
```

Lane F3's final-sweep AUDIT prepend names `dist-p7b` entry md5 **`d42a792ee8a8f5a4a003aca7a43bcb75`**,
built 11:21:11Z; this audit rebuilt at 11:28:48Z from a scratch outDir and got the same md5. Two
builders, one artifact — the cross-check pass 6 could only make against its own tarball.

Standing laws, re-checked here rather than inherited: **π** — `goldens` **4/4** run by this audit on
its own artifact, and the four `-darwin.png` md5s are byte-identical **before and after** that run,
to lane BC's bank, and to pass 6; `git status --porcelain e2e/goldens/` **empty**. Not one sanctioned
golden byte moved. **But see P7X-B4: eight unsanctioned baselines were minted this pass in a
directory that attestation does not cover.** **W3 floors** — `a11y.spec.ts` green inside the 279/279
default sweep. **U-10** — nothing below closes mark 3, 5 or 6. **Born-RED** — every gate this audit
rests on was ablated in a scratch copy and reds.

---

## 1 · ROUTES + GAPS PER FAMILY

### Lane F3 / LAND — THE FIVE ORDERS + THE CHAIR'S EYEBROW RULING · **ADVANCE** · 2 blocking / 1 new (mine)

All six items landed and I verified each at its site. **Order 1 returned a negative result and that
is the pass's best single piece of work**: the comment-only restamp did *not* preserve the artifact
hash, and the mechanism is named rather than guessed — `@vitejs/plugin-vue` hashes an SFC's
`data-v-` scoped id over source text *including comments*, so `GameBoard.vue`'s `<style scoped>`
moved `data-v-4aa1e43d` → `data-v-c560b2b2`, one id of 32, and 17 of 39 assets renamed off the
cascade. Both bundles are byte-identical in length (JS 223,349 = 223,349); only the content hash
betrays it. Two controls ran *before* the conclusion, and both reproduce the pass-6 audit's own
numbers. The registry that ordered this said the hash "should survive"; it did not, and the lane
said so.

**Order 2** re-cut the `docGrowth` floor from measurement — `> 30`, half the measured minimum, at
the row's own `COARSE` context — and neither pass-6 figure reproduced (61 chromium / 60 webkit, not
41 "both engines"; `ctrlPush` 123.53, not 109). The mechanism was also wrong and is replaced with a
measured one (fold-column headroom 62.84, not doc slack — the doc rests at exactly one viewport).
Born-RED measured, not asserted: the new floor reds at `docGrowth` 17 where `> 0` still passes.
Verified at `board-covisibility.spec.ts:307` with its derivation and superseded figures at the site.
**Order 4** banked the dt-name shots the pass-6 report cited into thin air. **Order 5** restamped the
apotheosis's §6/§9 expectations and *withdrew* the pass-6 audit's `55` rather than explaining it —
the honest disposal. **The chair's eyebrow ruling (X6-G2, five passes open) is IMPLEMENTED**, and it
closed on more than measurement: the eyebrows were already one-string in fact, but `ControlSection`
carried an optional `ariaLabel` and three `:aria-label="section.ariaLabel"` bindings, and all four
were deleted rather than commented. Verified: no `section.ariaLabel` binding survives; three
`announced === drawn` unit rows landed, deliberately case-SENSITIVE; both ablations red, including
the casing-only one that any case-insensitive assertion would have passed.

- **P7X-B3 · BLOCKING — `check-evidence-policy` exit 1.** Three breaches: per-wave `design-loop`
  **2,346,952 B > 2,097,152 B** (over by 249,800) and two shots over the 153,600 B per-image cap
  (`case-390x664-AFTER-webkit.png` **219,662 B**, `-chromium.png` **157,775 B**). Booked by lane D
  as D7-G7; the bind is worth naming rather than scoring: **F3 banked those shots because pass 6
  ordered it** (L6-G3), and the estate's own policy forbids the bytes. `evidence-policy` is one of
  CI's 18 jobs. Cure is the policy's own sentence — recrop to the pixels under audit; the
  `-dtname-crop-*` pair F3 also banked is the right artifact, the full-viewport pair is the breach.
- **P7X-B4 · BLOCKING — `test:golden:bytes` exit 1.** §2 below; the fossils are F3's disclosed
  scratch-config incident, under-scoped.
- **P7X-G5 new (mine) — the LOC ledger drops the binaries.** "TOTAL — every changed file, once |
  **171**" is the **text**-file count. `git diff --numstat abe533c4 4b28f034` returns **187 files:
  171 text + 16 binary** (14 shots + 2 `.tar.gz` under `pass6/land/`). `--numstat` prints `-` for a
  binary, so a summed count silently omits them — **the swallowed-stream class lane A ruled on in
  this same pass**, arriving inside the ledger whose whole order (L6-G2) was to stop an undercount.
  The `+18,619 / −350` totals are exact and I reproduce them; only the count is wrong, and only by
  the files that carry no lines. One honest line fixes it.
- Lane's own, all disclosed and all confirmed by me: **P7F3-G1** (an SFC comment edit is an artifact
  change — belongs in `PRECEPTS.md`), **P7F3-G2** (a sibling lane re-pointed `pencil-boil` under a
  shared `node_modules` mid-lane, so two builds of the same SHA disagree), **P7F3-G3** (the 55
  withdrawn), **P7F3-G4** (the pass-6 audit's docs+scripts figure is **permanently** unauditable —
  X6-G1's cost, arriving one pass later exactly as predicted), **P7F3-G5** (an ad-hoc PW config is a
  born-wrong instrument).

### Lane D — INK / RECORD TRUTH · **ADVANCE** · 1 blocking / 9 new (lane's own)

**Order 1 decided D6-G1 the hard way and found something better than the decision.** Both `scripts/`
are in format scope, ten files formatted, gate widened in the same commit — and the row's own figure
turned out to have been measured **through a shadow**: prettier resolves config per file, so a bare
reach at `../../scripts/` walks past a repo root with no config and lands on `$HOME/.prettierrc.json`
(tabWidth 4). That is PRECEPTS §3's `prettier global-shadow` trap, still live, one directory outside
where it was declared closed. The gate line now pins `--config`, so the ten are ten under the
estate's own config on any host. Behaviour identity proven rather than assumed: all ten instruments
run PRE and POST format, streams diffed, byte-identical. `lint` exits **0** at head — verified here.
**Order 3** restamped the "23" in place with correction grammar, and I re-derived the census
independently by filesystem walk: **29 banks / 25 hollow / 4 full**, exactly. **X-order 2** booked
CH-63 verbatim with no retry granted; `ledger-diff --require-ledger` GREEN, **220 rows**, exit 0 —
re-run here.

**Order 2's deliverable is a good instrument and it is the pass's first blocking row.**

- **P7X-B1 · BLOCKING — `lint:eslint` exit 1, 4 errors, all in `web/frontend/scripts/dist-identity.mjs`**
  (`161:9` preserve-caught-error — no `cause` on the throw; `274:14`, `276:3`, `279:3` no-undef
  `process`). The script itself is sound: I ran `--self-test`, **6/6**, and its mismatch arm reds
  against a real socket rather than a fixture. But it is **UNTRACKED**, while `PRECEPTS.md:71` names
  it as the enforcement of a §2 law that landed this pass, and `perf-rig/run-sim.sh:30` +
  `run-safari.sh:39` — both tracked, both modified — call it and **exit 4** without it. **The seal
  has no clean fork: commit it and CI reds; omit it and a landed law plus two tracked rigs point at
  nothing.** `lint:eslint` is a CI job. This is the estate's own family-2 rule biting the lane that
  spent this pass enforcing it. Cure is small — a node `globals`/env entry for `scripts/*.mjs` and a
  `cause` on the one throw — then it commits with the law.
- Lane's own D7-G1…D7-G9, all disclosed. Three matter beyond their lane: **D7-G1** (CH-62's
  `>=0.12.0` trigger is satisfied and its cure is in the tree while the row still reads KEEP-PARK —
  record gap, chair's restamp), **D7-G3/G4** (CH-63's own corrections, §2), **D7-G8** (the 4230–4260
  band has no registrar; four concurrent servers this session, collisions avoided by timing luck).

### Lane A — THE ESTATE RULING + THE TWO PASS-4 CITATIONS · **ADVANCE** · 0 blocking / 4 new (lane's own)

**The cleanest lane of the pass, and the only one with no blocking row of its own.** No component
edit, no spec edit, no script edit, no server started, no git state changed — its whole executable is
two read-only rigs. **Order 1** landed the swallowed-stderr law at `PRECEPTS.md` §2 (verified at
`:77`), in its siblings' register, with both bites re-derived at citation and the rig carrying its
own falsifier (BITE ≡ 0, CURE ≡ 1, ghost ≡ 0 across five refs, EXIT=0). The placement argument is
right: §3 retires when the shell changes, §2 does not. **The row indicts itself** — it ships as
`convention` because no gate greps a rig for a discarded stream, and the census that prices the
mechanization is banked (34 lines / 10 tracked executables, 9 already guarded, exactly one line with
the bite's shape, **zero live confident-zero instances**). Booking your own ruling as a gap against
itself is the behaviour this loop has been asking for since pass 3. **Order 2** recorded the chair's
KEEP with §3 byte-untouched, and read the ordinal both ways so the record cannot be misread later.
**Orders 3 and 4** stamped both pass-4 citation sites without erasing a word, and priced the
surviving substance exactly: **3 of 36 ribbon cells** have since been reproduced on a real built
dist; the other 33 have not, and the restamp forbids a claim that says otherwise.

The lane's four new rows are disclosures about other passes' artifacts and other lanes' processes,
not defects in its own work: **A7-G1** (three pass-4 rigs absent, moving no number), **A7-G2** (the
`doc-truth` RED — P7X-B2, and A named it first), **A7-G3** (its own ruling ships unmechanized),
**A7-G4** (BC6-G5 discharged, and the class recurring one lane over). By the literal clean bar A
does not post a clean pass; it is by some distance the closest, and for the second consecutive pass.

### Lane BC — THE RELEASE ROW · **ADVANCE** · 1 blocking / 1 new (mine) · §3 is the full verdict

The six ordered steps landed and the registry-checkable half verifies completely — see **§3**, which
walks it row by row because my orders make it this pass's spine. Two things are booked here.

- **P7X-B2 · BLOCKING — `check-doc-truth` exit 1** (1 RED / 12 GREEN, row `pencil-boil-0.9.2`):
  `web/frontend/package.json` reads `^0.12.0` while `README.md:131` and `web/frontend/README.md:11`
  still read `^0.11.0`. `doc-truth` is one of CI's 18 jobs. Booked by A (A7-G2) and D (D7-G2), owned
  by neither; the READMEs are absent from BC's own §FILES. **Family 2, exactly** — a ruling that did
  not land with its record — and the estate's instrument caught it within the hour. Cure: restamp
  both READMEs **in the same commit as the bump**.
- **P7X-G6 new (mine) — the lane banked no logs.** `pass7/bc/` holds five files: the record, two
  rigs, `artifact-md5.txt`, `goldens-md5.txt`. **Zero `.log`.** Every battery figure in the record —
  `npm test` 13 entrypoints / 248 assertions, `proof:browser` 6/6 at SSIM 1.0000 with 0 of 921,600
  bytes differing, born-RED 11 of 24 against `ac878c3`, `latch-proof` 20/20 both arms, and
  `measure-logo`'s eight rendered-px rows — is **testimony**. I re-derived every registry-, git-,
  lockfile- and battery-checkable claim I could reach and **all of them held** (§3); the upstream
  proof half I cannot reach at all. This lands in the same pass whose Lane A wrote the estate law
  that names the class. Secondary: `artifact-md5.txt` names the **shared `dist/`** — the unowned
  directory D6-G3 is about — rather than an isolated build. It still matched when I read it
  (`index-C8teqv87Fwqo.js` / `0a677fd4…`, mtime 07:13:47), so nothing is wrong; it is simply the
  exact hazard PRECEPTS §2 was written for this same pass.

### Cross-cutting — the audit's own rows

- **P7X-G7 · the foreign `:3000` is not idle — it answers `{"status":"ok","service":"palette-api"}`.**
  The default `playwright.config.ts` carries `webServer: { command: "npm run dev", port: 3000,
  reuseExistingServer: true }`, so a bare `npx playwright test` on this host hands the entire default
  suite a palette API. The estate's assert-the-SPA guard is the only thing between that and 279
  green-looking rows against the wrong service. **Lane A's KEEP on that `PRECEPTS.md` §3 row was
  right, and it now has a measured squatter instead of a hypothetical one.** Every run in this audit
  was driven through `PLAYWRIGHT_BASE_URL` against its own port.
- **P7X-G8 · THE PASS IS UNSEALED, THIRD CONSECUTIVE PASS.** 31 modified/untracked paths at close.
  Pass 5 row 11 → pass 6 X6-G1 → here. F3's P7F3-G4 already priced the first recurrence: the pass-6
  audit's docs+scripts figure **can never be re-derived by anyone**, because it was taken on a
  working tree that no longer exists. A third occurrence has stopped being a discipline row; it is
  the loop's binding constraint on its own clock.

---

## 2 · THE BLOCKING ROWS, THE FOSSILS, AND THE CLEAN-PASS RULING

### P7X-B4 — the eight fossils, and why this is the pass's most important finding

`test:golden:bytes` exits **1** at head on two defects: estate total **143,036 B > 112,640 B** band,
and **8 unsanctioned PNGs outside `e2e/goldens/`**. They live in
`e2e/visual-golden.spec.ts-snapshots/` under **default-config project names**
(`*-chromium-darwin.png`, `*-webkit-darwin.png` — the golden config uses a single implicit engine and
needs no `{projectName}`), are **untracked**, were **never committed on any branch**, and carry
mtimes **11:14:52Z (chromium ×4)** and **11:15:49–11:15:52Z (webkit ×4)** — minted *during pass 7*,
in two batches one minute apart, the signature of a chromium-then-webkit project run. Mechanism and
disclosure agree: F3 §7 note 2 discloses a scratch Playwright config that omitted `testIgnore`,
over-collected four `visual-golden` rows and ran them under both engines. Auto-write did the rest.

**The bytes are the smaller half. `.gitignore:48`'s `*.png` hides them from `git status` entirely** —
so every lane's π attestation this pass, `git status --porcelain e2e/goldens/` empty, is **true and
insufficient**. Eight baselines were minted and four lanes each certified that none were.

**No sanctioned golden moved, and that is verified rather than assumed**: I re-ran the golden suite
on my own artifact (**4/4**) and the four `-darwin.png` md5s are byte-identical *before* the run,
*after* the run, to lane BC's bank, and to pass 6. **The π law on the sanctioned estate HOLDS.** What
failed is the attestation's scope.

Born-RED / GREEN, in a scratch copy of `e2e/`, the live tree never touched: with the fossil directory
present the checker reds on both defects; with it removed the estate reads **101,341 B** against the
112,640 B band and **both defects clear**. The fossils are the sole cause.

Untracked means a sealed SHA's CI checkout would be green, and I say so plainly — this does **not**
red CI at the seal. It blocks anyway, for two reasons: the gate is RED on the tree every lane
measures against, and **the π attestation must widen from `e2e/goldens/` to "no PNG minted anywhere
under `e2e/`" before another pass certifies it.**

### THE CLEAN-PASS TABLE

Convergence law: earned 100% = zero gaps + a fresh non-author audit + two consecutive clean passes,
≥3 passes total. The bar is unchanged and applied literally: **zero blocking AND zero new.**

**NO FAMILY POSTS A CLEAN PASS IN PASS 7.**

| family | blocking | new | clean? |
|---|---:|---|:--:|
| **F3/LAND** | **2** (B3 evidence-policy · B4 golden:bytes) | 1 mine (G5, the LOC binaries) + 5 lane's own | **NO** |
| **D** | **1** (B1 `lint:eslint` on its own deliverable) | 9 lane's own | **NO** |
| **BC** | **1** (B2 `doc-truth`, its bump's record) | 1 mine (G6, no banked logs) | **NO** |
| **A** | **0** | 4 lane's own | **NO** — the closest, second pass running |

Plus two cross-cutting rows (P7X-G7 the palette-api squatter, P7X-G8 the third unsealed pass).

**Four gates are RED at this head — `lint:eslint`, `check-doc-truth`, `check-evidence-policy`,
`test:golden:bytes` — and all four are CI jobs or steps.** Three of them travel with a seal.

**The 100% clock does not start.** Earliest possible 100% moves from pass 8 to **pass 9** — pass 8
clean, pass 9 clean-confirm. Clock history, kept because each slip names its cause: pass 2 said pass
4; pass 3 said 5; pass 4 said 6; pass 5 said 7; pass 6 said 8; **pass 7 says 9**.

Two things must be said in the same breath, because the count alone misreads this pass.

**First, the ordered work landed, and I verified it at the sites rather than in the reports.** Six
F3 items including a five-pass-old adjudicator row closed by deletion with a case-sensitive
born-RED; D's format decision plus the shadow it uncovered plus a census I reproduced exactly; A's
law landed in the right section with a falsifier and an honest self-indictment; BC's release
verified against the registry, the object store, the lockfile and two batteries I re-ran myself.
**Every figure this audit could re-derive, re-derived**: the 9c arm to the hundredth, the dist census
29/25/4, the LOC totals `+18,619/−350`, the artifact byte-for-byte against another builder, and
39/39 · 4/4 · 279/279 · 448/448 on an artifact I built.

**Second, three of the four blocking rows are *consequences* of the ordered work rather than
failures of it** — a new instrument that lints red, a version bump whose record lags by two lines,
shots banked because a registry ordered them into a directory whose policy forbids the bytes. The
fourth is a rig accident the lane disclosed and under-scoped. None is a wrong measurement. That is a
better failure mode than passes 3–5 had, and it is still four red gates on the tree a seal would
take.

### THE CONTENTION FLAKE CLASS — CH-63, verified against the banked sweeps

The row is landed in `LEDGER.md` §1 with the audit's bound verbatim, the 5-instance roster, the
disposition and the triggers; `ledger-diff --require-ledger` GREEN, 220 rows, exit 0. Re-derived
here from the logs rather than the record:

- The five pass-6 full-suite tallies reproduce exactly — audit sweeps **279 / 278+1 / 279**, LAND
  sweep 4 **279**, LAND final **278+1**. **2 of 5 on the pass-6 artifact = 40%**, as published.
- **My own sweep on the pass-7 artifact: 279/279, zero red.** F3's independent sweep on a
  byte-identical build: **279/279**. Two more clean runs on the class's denominator.
- **D's correction 1 is CONFIRMED in the raw logs, and it is the one that matters.**
  `affordances.spec.ts:155` webkit is red at `pass5/f3/logs/e2e-default-head.log:158` **and** at
  `pass6/land/logs/e2e-HEAD-final.log:12`. Two runs, two trees, **one row**. CH-63's signature clause
  *"never the same row twice"* does not survive its own roster, and **trigger 1 is therefore
  satisfied on the day the row was booked.** D booked it to the chair rather than re-adjudicating,
  which was correct; the chair now owes the ruling.
- D's corrections 2 and 3 stand as written: *"never two in one run"* is stated unconditionally but
  evidenced only for the settled head artifact, and the **3/7** numerator reconciles only with
  pass-5's head sweep outside the denominator, while the audit's own prose reads it inside (4/8, or
  4/9 ≈ 44% with the P6 instance). **The bound survives every reading** — all inside 16–75% — and
  the arithmetic still wants one sentence naming its denominator.

**Disposition unchanged and re-affirmed: NO RETRY GRANT.** Nothing in this pass's two additional
clean sweeps argues for one.

---

## 3 · THE RELEASE ROW — VERIFIED, WITH ONE MATERIAL RESERVATION

My orders make this the pass's spine. Walked row by row, re-derived here.

**0.12.0 on the registry — VERIFIED.** `npm view` reads version `0.12.0`, `dist-tags.latest`
**`0.12.0`**, shasum **`b161ed6e6388fc75ab76871a434282013992853c`** (equal to the lane's claimed
local pack), integrity `sha512-gU4fYELJ8IPVEt7mmj68iQegAz9nkSM4tBAtkj18O0+QxKn/LbpWhHq4QoKnmorgf9/NqhKqGwnX/pp/DxOrkg==`,
21 files, unpacked 105,800 B, published **11:01:39.807Z**. The successor the disposition turns on,
**0.11.2, was published 08:46:04.342Z — before the lane opened**, as the record says; **0.11.1 was
never published at all**, which is what makes the parked draft a superseded draft rather than
in-flight work.

**The upstream disposition — VERIFIED, and the park is byte-whole.**
`park/pass7-bc-package-boundary-draft` = **`a97642e`**, parent **`3f41141`**, local ≡ origin. Its
diff against that parent is **19 files: 17 M + 1 D (`mkbabb-pencil-boil-0.9.2.tgz`) + 1 A
(`proofs/package-boundary.proof.mjs`, the untracked draft proof)** — the claimed scope exactly, all
19 files of the migration, nothing dropped. `master` = `origin/master` = **`6c5394e`**; `git log
--merges` is **empty**, so history is linear as claimed; tag **`v0.12.0` → `6c5394e`** on both local
and origin; and **`3f41141` remains reachable** as the park branch's parent, so pass 6's recorded SHA
still resolves. **The migration rides 0.12.0 by its published successor, proven**: `ac878c3` and
`68b6ed6` are both in `master`'s history, ahead of the rebased `448a896` and the release commit. A
cut from an un-rebased master would indeed have shipped the 0.11.1 src-publish shape over 0.11.2's
compiled boundary; the ordering was load-bearing, not cosmetic.

**The adoption diff — VERIFIED, and it is in the artifact.** `web/frontend/package.json` declares
`^0.12.0`; the lockfile resolves `0.12.0` with `integrity` **equal to the published sha512**, digit
for digit; `node_modules` carries 0.12.0 with the narrowed `exports` map (`.` and `./package.json`).
The adoption is not merely declared — my own build's `animation-vendor` chunk reads **11,641 B**
against 0.11.0's 11,054 B, so the new library is in the bundle I measured everything else on.

**The quarantine deletion — COMPLETE, verified by grep.**
`e2e/linux-webkit-bake-quarantine.ts` is absent from disk. Repo-wide there is **no dangling import**:
the only two surviving source strings are prose citations at `theme-bake-freshness.spec.ts:67` and
`wordmark-integrity.spec.ts:68`, and both point at
`docs/tranches/2026-08-tranche-5/evidence/w1/linux-webkit-bake-quarantine.md`, **which exists**. No
straggler imports the deleted module.

**Goldens 4/4, π — VERIFIED on my own artifact.** Run here, 4/4; the four `-darwin.png` md5s
byte-identical before the run, after the run, and against the bank. `e2e/goldens/` porcelain empty.
*(The eight fossils of P7X-B4 sit outside this directory and outside this attestation — that is the
row, and it is why the attestation's scope must widen.)*

**The two bake specs' darwin evidence — RE-RUN BY ME, not read.** Built-dist throttle lane against
my own artifact on my own port: **39/39, exit 0**, and the breakdown is the lane's claim exactly —
`theme-bake-freshness` **20** (theme-bake-chromium 10 + theme-bake-webkit 10, all five games, both
directions), `wordmark-integrity` **6** (wordmark-webkit), `filter-census` **12** (6+6),
`throttled-void` **1**. Both bake specs ran **unquarantined, at full strength, on both engines**.
The `filter-census` 12/12 inside it is also 9c's mechanism half: **zero new live filters**.

**THE UBUNTU-WEBKIT JUDGMENT IS OPEN, AND THAT IS THE PROTOCOL, NOT A GAP.** 0.12.0 is a pose-stack
cache and is **not** hypothesized to fix the linux-WebKit blank-bake race; the lane says so and it is
right to. What the quarantine's removal buys is a live census at `retries: 0`. The judgment belongs
to the lead's multi-run CI protocol and to nothing on this host — every figure above is darwin.
`LEDGER` row **CH-62 still carries the class**, and separately still reads KEEP-PARK while its own
`>=0.12.0` trigger is satisfied and its cure sits in the tree (D7-G1): a record restamp the chair
owes, not a work gap.

**THE RESERVATION — P7X-G6, and it is why this row reads "verified with a reservation" rather than
"verified".** Everything above I could reach, I reached, and all of it held. What I cannot reach is
the upstream battery: **the lane banked no logs.** `npm test`'s 13 entrypoints / 248 assertions,
`proof:browser` 6/6 at SSIM 1.0000 with 0 of 921,600 bytes differing, the born-RED 11-of-24 against
`ac878c3`, `latch-proof`'s 20/20 in both arms, and `measure-logo`'s eight rendered-px rows all stand
as testimony from a lane whose rigs are banked and whose streams are not. The shipped cure is real
and I verified it at its site — `latchWholePx` at `HandwrittenLogo.vue:182`, feeding `captureW` and
`captureH`, with the rejected quantization argued at the site rather than hidden — but the 20 rows
that prove it holds and re-keys are unbanked. **In the pass whose Lane A landed the estate law on
exactly this class.**

---

## 4 · ADJUDICATION RESIDUE — CURRENT STATE

### 9c — THE IDLE UNIFORM-SIGN WATCH ROW, RE-READ IN FULL

Pass 6 read this row only in part and said so; the arm is owed and here it is. Re-derived by this
audit from pass 4's banked `m4-bat-{base,head}-r{1..5}.jsonl` — **n=5 per arm per scenario, 50
scenario-windows, printed**:

| scenario | head r1..r5 | med | base r1..r5 | med | **Δ** | sign |
|---|---|---:|---|---:|---:|:--:|
| `idle3s` | 56.55/59.04/58.02/59.63/59.86 | 59.04 | 59.92/59.66/59.37/59.33/59.84 | 59.66 | **−0.62** | NEG |
| `deal` | 54.51/59.69/59.69/59.66/59.63 | 59.66 | 60.26/60.19/59.63/60.26/60.23 | 60.23 | **−0.57** | NEG |
| `solveCelebration` | 58.60/58.34/58.08/58.63/58.12 | 58.34 | 59.62/58.85/59.09/58.88/58.82 | 58.88 | **−0.54** | NEG |
| `galleryGlide` | 49.17/49.59/49.59/49.98/49.98 | 49.59 | 49.61/50.02/49.61/50.12/50.41 | 50.02 | **−0.43** | NEG |
| `themeToggle` | 51.58/51.44/51.59/51.56/49.74 | 51.56 | 52.74/54.43/52.55/52.76/51.71 | 52.74 | **−1.18** | NEG |

**THE SIGN IS UNIFORMLY NEGATIVE — five of five.** **THE MAGNITUDE IS −0.43 to −1.18 fps; worst
|Δ| = 1.18.** **Against the ±2.5 run-to-run law that is INSIDE, by a factor of 2.1 at the worst
cell.** All five of pass 4's published deltas reproduce to the hundredth from the raw jsonl, so the
row's arithmetic is sound. The idle gate holds: head median **59.04 ≥ 59, PASS by 0.04** — against a
head idle arm whose own spread is **3.31 fps**, so the margin is roughly a *hundredth* of the
instrument's own noise, exactly as pass 4 disclosed.

**What this audit adds, and pass 4 never published: the paired per-round decomposition.**

```
idle3s            -3.37  -0.62  -1.35  +0.30  +0.02    neg 3/5
deal              -5.75  -0.50  +0.06  -0.60  -0.60    neg 4/5
solveCelebration  -1.02  -0.51  -1.01  -0.25  -0.70    neg 5/5
galleryGlide      -0.44  -0.43  -0.02  -0.14  -0.43    neg 5/5
themeToggle       -1.16  -2.99  -0.96  -1.20  -1.97    neg 5/5
```

The median-level uniformity is real and it is what the row watches. **Round by round it is weaker
than "five of five in one direction" reads**: the watch row's own scenario, `idle3s`, is **3/5**
negative with two positive rounds, and `deal` is 4/5. Only three of the five scenarios are
unanimous. One single-round excursion sits outside the law — `themeToggle` r2 at **−2.99** — which no
median shows and which the ±2.5 law is precisely about. Long frames re-derived: `long50` idle head
**1,0,0,0,0** vs base all zero, so pass 4's "idle 0 both arms after r1" holds; `long33`, which pass 4
did not publish for idle, reads head **6,4,4,1,1** against base **2,2,3,3,2** — head-heavier in r1–r3
and *below* base by r4–r5, the shape of session warm-up rather than a regression.

**THE HONEST LIMIT, stated rather than papered over: this arm's tree is pass-4-era** (head
`52ef014a`-era, base `6800af04`). **No fps arm has been run at `4b28f034` or against this pass's
artifact**, and re-reading a bank cannot manufacture one. The current-tree proxy is the mechanism,
and it is green: `filter-census` **12/12** inside my own 39/39 built-dist lane — **zero new live
filters** on the artifact this registry names.

**DISPOSITION: CARRIED, watch not blocker.** Sign uniform at the median, magnitude comfortably
inside the law, gate held. **The row's next debt is a fresh arm at a T5 head — not another re-read of
a pass-4 bank**, which is now exhausted as a source.

### The other residue

**Row 9b — the eyebrow two-register question: CLOSED.** Five passes open, and pass 7 both routed and
ruled it. F3 measured before editing (ten eyebrows across five specs; the second literal optional and
never once supplied), then implemented the ruling as a deletion of the field, its three bindings and
the unit row that had been *blessing* the seam, with three `announced === drawn` rows and a
case-only born-RED that any case-insensitive assertion would have missed. Verified at the sites.
**The register question is settled by the estate's own one-string principle having landed as code.**

**The ≥1024 drawer-vs-strip everyday-deal home** stays **OPEN on its last leg**; nothing this pass
touches it. The **blind-read arm is STILL OWNER-BLOCKED, seventh pass**.

**Ballot 4 / CH-38 — the clock runs and no reader has materialized.** Unchanged; the re-scope drafting
act belongs to the lead at the gate.

---

## 5 · OWNER + TEAM-LEAD ROWS, CURRENT

| # | row | owner | state after pass 7 |
|---:|---|---|---|
| **1** | **M4 + M2 blind reads** — ≥4 cold readers | OWNER | **SEVENTH pass.** Still the residue's sole human leg and the highest-leverage owner action in the campaign. |
| **2** | **Landscape eye on glass / sim rotation** | OWNER | **SIXTH pass.** Work done and unratified on glass; still ZERO on-device landscape cells. |
| **3** | **Keypad rig row** | OWNER | Unchanged — no OS keyboard has ever risen against any tree. |
| **4** | **E8 device smoke** | OWNER | Standing since the T4 close; also the closure leg for the portrait dock's 0-bake claim. |
| **5** | **2 dependabot highs** | OWNER | Booked at the P1 seal; untouched by passes 3–7. |
| **6** | **`logo-light` darwin re-baseline** | TEAM LEAD | **CLOSED — RATIFIED.** Not precedent for lane-executed re-baselines. |
| **7** | **`lint:ink` in CI** | TEAM LEAD | **CLOSED.** `lint:ink` exits 0 here. |
| **8** | **`toggle-crest-dark` flake** | TEAM LEAD | **STANDING.** No rate authorises a re-baseline; disposition unchanged. |
| **9a** | **The guard's two names** | ADJUDICATOR | **CLOSED** at W3.2. |
| **9b** | **The eyebrow two-register question** | ADJUDICATOR | **CLOSED IN PASS 7** — routed, measured, ruled, implemented as a deletion, born-RED case-sensitively, verified at the sites by this audit. Five passes ended. |
| **9c** | **Idle uniform-sign watch-row** | ADJUDICATOR | **CARRIED — and now re-read IN FULL** (§4): n=5 printed, sign uniformly NEGATIVE 5/5 at the median, magnitude −0.43…−1.18, worst 1.18 **inside the ±2.5 law by 2.1×**, idle gate PASS by 0.04. New this pass: the paired decomposition is weaker than the medians (idle 3/5, deal 4/5; one round at −2.99). **The pass-4 bank is now exhausted; the row's next debt is a fresh arm at a T5 head.** |
| **10** | **Evidence policy — the hollow-dist estate** | TEAM LEAD | **CLOSED as policy; the "23" restamped to 29/25/4** and re-derived independently here. But the gate it created now **reds at head** (P7X-B3). |
| **11** | **The unsealed pass** | TEAM LEAD | **RECURS — THIRD CONSECUTIVE PASS (P7X-G8).** Its first cost has already been paid and is permanent (P7F3-G4). Sole non-gate disqualifier for a cut. |
| **12** | **`chronic-ledger.md:96` (CH-42) rate** | TEAM LEAD / AUDIT | Unchanged; the note beside the line is still owed. |
| **13** | **KenKen `+` and `÷` fallback face** | OWNER | Unchanged; folded into the standing woff2 re-cut row. |
| **14** | **T′ double-assignment** | TEAM LEAD | **CLOSED** at the pass-5 seal adjudication. |
| **15** | **The pass-4 registry's fold-overflow figure** | TEAM LEAD / ADJUDICATOR | **CLOSED as a fact**; the registry stays wrong with its erratum. |
| **16** | **pencil-boil 0.12.0 release election** | TEAM LEAD | **EXECUTED AND VERIFIED (§3).** 0.12.0 on the registry as `latest`, park byte-whole, migration ridden in by its published successor, adoption in the artifact, quarantine deleted clean, goldens π-whole, both bake specs re-run darwin by this audit. **CH-61 is CURED in the shipped app** the moment a seal takes this tree. Reservation: the upstream battery is unbanked (P7X-G6). **Ubuntu-webkit judgment OPEN by protocol, not by gap.** |
| **17** | **BC6-G1 — the wordmark's key jitter** | TEAM LEAD | **CLOSED.** Latch landed at `HandwrittenLogo.vue:182`; quantization auditioned and rejected with the measurement that rejects it written at the site; no golden moved. |
| **18** | **L6-G1 — the stale landscape ledger** | TEAM LEAD | **CLOSED**, and it taught the estate something: the restamp **moved the artifact hash**, and the mechanism is now named (P7F3-G1). |
| **19** | **D6-G1 — two unformatted script directories** | TEAM LEAD | **CLOSED.** Ten formatted, gate widened same-commit with `--config` pinned against the global shadow. |
| **20** | **BC6-G5 — two lane ports still listening** | TEAM LEAD | **DISCHARGED.** 4243/4245 dead; the 4230–4260 band is **empty at this close**, verified by `lsof`. |
| **21** | **P7X-B1 — `lint:eslint` reds on `dist-identity.mjs`** | TEAM LEAD | **NEW · BLOCKING.** 4 errors; the file is untracked while `PRECEPTS.md:71` and two tracked rigs already cite it. Commit-and-red or omit-and-dangle: the fork must be resolved before a seal. |
| **22** | **P7X-B2 — the bump without its READMEs** | TEAM LEAD | **NEW · BLOCKING.** `doc-truth` 1 RED/12 GREEN. Two lines, same commit as the bump. |
| **23** | **P7X-B3 — evidence-policy reds on ordered shots** | TEAM LEAD | **NEW · BLOCKING.** Per-wave and two per-image breaches; recrop, do not raise a cap. |
| **24** | **P7X-B4 — eight fossil baselines, and the π attestation's scope** | TEAM LEAD | **NEW · BLOCKING (working tree).** Delete the eight; widen the attestation from `e2e/goldens/` to all of `e2e/`. Untracked, so a sealed checkout is green — the scope defect is the durable half. |
| **25** | **CH-63 trigger 1 is satisfied at booking** | CHAIR | **NEW.** `affordances.spec.ts:155` webkit red in two runs on two trees, confirmed here in the raw logs. The chair owes the ruling D declined to pre-empt. |
| **26** | **CH-62 reads KEEP-PARK while its trigger is satisfied** | CHAIR | **NEW (D7-G1).** Record restamp, not work. |

---

## 6 · THE DEPLOY QUESTION AT THIS HEAD

**NO CUT IS NAMED AT THIS HEAD. DEPLOY CANDIDATE: NONE.**

Two disqualifiers, and neither is the artifact's fault:

1. **THERE IS NO SHA TO CUT** — third consecutive unsealed pass, 31 modified/untracked paths
   (P7X-G8). A cut is taken from a seal, never from a working tree.
2. **FOUR CI GATES ARE RED AT THIS HEAD** — `lint:eslint`, `check-doc-truth`,
   `check-evidence-policy`, `test:golden:bytes`. Three of the four travel with a seal; only the
   fossils are untracked and would leave on their own.

**What the artifact itself did, on instruments this audit pointed at it:** default e2e **279/279,
zero red** · built-dist all six projects **39/39** · goldens **4/4** with the four darwin md5s
byte-unchanged and `e2e/goldens/` porcelain empty · `vitest` **448/448, 41 files** · exit **0** from
`vue-tsc -b --force`, `vite build`, `lint` (prettier, the widened scope), `lint:boundary`,
`lint:knip`, `lint:ink`, `lint:catch`, `lint:tdz`, `test:support-floor`, `test:e2e:projects`,
`test:e2e:retries`, and `ledger-diff --require-ledger` (220 rows). **The artifact is not what is
blocking.** Four record-and-instrument gates are.

**The conditional recommendation, for the lead alone.** Land the four cures (§7), seal, rebuild once,
and **re-derive the artifact hash rather than assuming it survives** — this pass proved by ablation
that a comment-only SFC edit renames 17 of 39 assets (P7F3-G1), so "comments are neutral" is now a
falsified belief in this estate, not a working assumption. If the entry bundle still reads
**`index-ZYnCGMYLIhQw.js`, md5 `d42a792ee8a8f5a4a003aca7a43bcb75`**, the gate table above transfers
to the seal unchanged. If it moves, a non-author re-walks it. `npm run deploy` only,
owner-authorized, per the standing trap ledger (npx-packument-OOM).

**Three disclosures ride any such cut, none smoothed.** Marks 3, 5 and 6 remain **U-10 open** —
nothing in this registry closes a mark. **CH-39 is unseen on glass** — zero on-device landscape
cells. **The ubuntu-webkit bake judgment is OPEN by protocol**: the quarantine is gone and every
figure supporting that removal is darwin; the linux verdict belongs to the lead's multi-run CI
protocol and to no lane and no audit.

---

## 7 · PASS-8 ORDERS — CURES, NOT THE CONFIRM

Pass 8 is **not** the clean-confirm. It is the cure pass, and it should be a short one: every row
below has a named site and a known fix, and no new measurement is ordered anywhere.

**THE SEAL FIRST, AND IT IS THE LEAD'S.** Third consecutive unsealed pass; F3 has already priced what
the first recurrence cost permanently. Pass 8 opens on a SHA or the loop keeps paying it.

**The four blocking cures — all four land in the seal commit, none is a lane's to defer:**

1. **P7X-B1** — give `web/frontend/scripts/dist-identity.mjs` a node `globals`/env entry in
   `eslint.config.js` and a `cause` on the throw at `:161`, then **commit the file with the law it
   enforces**. `lint:eslint` must exit 0 with the file tracked. The instrument is good — `--self-test`
   6/6, verified here; only its lint surface and its tracking are wrong.
2. **P7X-B2** — restamp `README.md:131` and `web/frontend/README.md:11` to `^0.12.0`, **in the same
   commit as the bump**. `check-doc-truth` must read 13 GREEN.
3. **P7X-B3** — recrop `pass7/F3/shots/case-390x664-AFTER-{chromium,webkit}.png` to the pixels under
   audit (the `-dtname-crop-*` pair is the model). **The arithmetic is exact and the one act clears
   both breaches**: the per-wave cap sums images only, `design-loop` holds **2,346,952 B** of them,
   and the two shots are **377,437 B** — removing or recropping them lands the wave at
   **1,969,515 B against the 2,097,152 B cap** while both images drop under 153,600 B. Verified here.
   **Do not raise a cap and do not add a grandfather line** — the policy's own words.
4. **P7X-B4** — delete the eight PNGs under `e2e/visual-golden.spec.ts-snapshots/`, then **widen the
   π attestation**: every lane's ports-and-goldens line changes from `git status --porcelain
   e2e/goldens/` to a check that no PNG was minted anywhere under `e2e/` — `.gitignore:48` makes the
   porcelain check structurally blind, so the attestation must not depend on it. Cheapest form: the
   fossil arm of `check-golden-bytes.mjs` already exists; require it in the lane close, not just CI.

**Two rulings the chair owes, and they are one-liners:**

5. **CH-63 trigger 1** — `affordances.spec.ts:155` is red in two runs on two trees (confirmed here in
   the raw logs), so the row's own first trigger is satisfied at booking. Rule it: either the
   signature clause is amended with its evidence, or the trigger is declared fired and its
   consequence named. **Do not re-open the no-retry disposition** — two more clean 279/279 sweeps
   landed this pass.
6. **CH-62** — restamp the row off KEEP-PARK; its `>=0.12.0` trigger is satisfied and its cure is in
   the tree (D7-G1). Record, not work.

**Three record rows, cheap and owed:**

7. **P7X-G5** — one line in F3's LOC ledger naming the 16 binary files `--numstat` cannot count, so
   "every changed file, once" becomes true (187 = 171 text + 16 binary).
8. **P7X-G6** — **lane BC banks its battery streams**, or the release record is amended to mark those
   figures testimony in the grammar `pass5-adjudications-at-seal.md` §2 already defines. Either is
   acceptable; silence is not, in the pass that landed the law.
9. **P7F3-G1** — the SFC-comment rule goes into `PRECEPTS.md` beside the golden discipline: *an SFC
   comment edit is an artifact change; re-derive the hash, never assert neutrality.* It is ablated,
   mechanised and blast-radius-measured already; it only needs its site.

**Standing, carried forward:** the one-artifact discipline and scratch-copy ablation method held for
a second pass and stay the standing pattern; concurrent lanes on one checkout should build from `git
archive <sha>` with an isolated `node_modules` (P7F3-G2) — this audit's build and F3's agreed to the
byte precisely because the tree was quiet between them, which is luck, not method.

**IF PASS 8 CLOSES ALL NINE AND SEALS, PASS 9 IS THE CLEAN-CONFIRM**: a fresh non-author audit, the
standing checklist, zero new work, and — on a clean pass 8 and a clean pass 9 — the loop reaches
earned 100%.

**U-10 stands over all of it.** What pass 7 lands is a released library and an app that adopts it, a
five-pass adjudicator row closed by deletion, an estate law about swallowed streams, ten instruments
formatted under a config that no longer shadows, a floor re-cut from measurement, and a negative
result about artifact identity that the estate believed the opposite of. **Every one of those
sentences is awaiting the owner's eye, and none of them closes a mark.**
