# CRITIQUE D — non-author adversarial audit of pass-3 stage D · 2026-07-31

**Artifact audited.** The named `pass3/stageD-report.md` does not exist. The stage's dossier is
`pass3/laneD-report.md`, whose own H1 reads *"LANE D — STAGE D · pass 3 dossier"*. That file is
what follows. Bar: closure of every numbered item in `pass2-registry.md` §5 (ships 1–5 and the
commit hold that closes the section). Verified against the real tree at
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` (`git log/show`, source reads,
one re-run of `npm run lint:ink --self-test`) and against `pass3/measure/RESULTS.md` and its raw
logs. Read-only; the repo was not modified (`git status` empty before and after).

**Tree facts confirmed.** MAIN = `5873a920`, clean, **15 commits ahead of `origin/master`,
nothing pushed**. Lane D's four commits are real and are the FIRST four after the P1 seal
`6800af04` — `b4e2c447` (ship 4), `b075e95b` (ship 1), `d4e8e41e` (ship 3), `2335282c` (ship 2) —
with Lane C (×4), Lane B (×2), Lane A (×3) and F3 (×2) stacked on top of them.

**Convergence: 75%.** Raw closed fraction of the stage's own order is 19 of 24 numbered items
(79%), docked for one item closed on a warrant that does not hold and one factual claim of record
refuted by the pass's own measure lane — a disposition a reader cannot take on its word.

---

## 1 · ITEM-BY-ITEM CLOSURE (pass-2 registry §5)

| # | order item | verdict | witness |
|---|---|---|---|
| 1.1 | ship 1: reconcile with C's competing fix, ONE mechanism | **CLOSED** | `.icon-btn.deal-btn` (0,2,0) at `GameControlPanel.vue:1054`; `git log -S` over `2335282c..5873a920` shows no competing `.deal-btn` hunk — F3's later `.deal-row > .deal-btn { grid-area }` declares disjoint properties |
| 1.2 | ship 1: book the growth + card price in blast-radius; comment gains its second bound | **CLOSED, and improved** | measured not asserted (`rig/deal-box.json`); wrapper growth **zero**, card box **zero**, **+10px scroll** — booked blast §2.3; the second bound closed *structurally* (the coarse block restates `.icon-btn.deal-btn { padding: 0.3rem 0.5rem }` at `:1198`, verified line-for-line against the base `.icon-btn` coarse block, so the touch pose is byte-identical) |
| 2.1 | ship 2: state the BOARD SIZE exclusion or include it | **CLOSED** | `index.css:14-20` now carries all three denominators (sudoku 6/41 · futoshiki 8/46 · every distinct string 9/50); `font-decision-row.md` restated, price corrected 12,048 → **13,788 B measured**; the B2 ruling itself is real (`387cceea`, "the B2 subset") |
| 3.1 | ship 3: equality gate for the hand copy | **CLOSED** | `sudoku/game.test.ts` — mounts through a `GameScene` stub that renders the *named* `controls` slot (the report's claim that a default stub would assert nothing is correct), gates shape AND what each `onChange` moves |
| 3.2 | ship 3: honest test accounting | **CLOSED, verified by count** | 9 + 9 out, 10 + 2 in, net −6 (I counted the deleted and added `it(` bodies at `d4e8e41e`); wiring re-priced +38, not pass-2's +47 |
| 3.3 | ship 3: R3b — TDZ on real Safari | **OPEN, on a false blocker** | see §2.2 |
| 4.1 | `--self-test` ownership case falsifiable | **CLOSED** | real temp fixture tree walked by the real collector; I re-ran `lint:ink --self-test` → exit 0, ladder digits match RESULTS §5.2 exactly; RESULTS reproduced the sabotage probe (exit 1, two counts) |
| 4.2 | `color-mix(… var(--grid-line-color) …)` alias evasion closed | **CLOSED** | `GRAPHITE = (?:--color-pencil-graphite|--grid-line-color)` in both the ownership regex and the stop parser |
| 4.3 | `sources()` covers `.ts` | **CLOSED** | `/\.(vue|css|ts)$/` |
| 4.4 | closure 3 (armed sublabel) actually gated | **CLOSED** | `gateArmed` — names `--color-red-ink`, bans the raw wax, resolves the token out of index.css through `var()` aliases and clears 4.5 in both scopes |
| 4.5 | phantom citation `inkPressure.test.ts` deleted | **CLOSED in effect** | zero hits estate-wide; but see §3 minor (b) — the citation was never in MAIN |
| 4.6 | estate-register inversion at least ledgered | **CLOSED** | printed on every run (`light rule < muted-foreground < quiet < firm` / `dark rule < quiet < firm < muted-foreground`), booked at `index.css §INK PRESSURE` |
| 4.7 | `.legend-sep`'s opacity-carried 2.877 named | **CLOSED** | `opacity: 0.7` deleted rather than tuned; the model gap written at the site |
| 4.8 | `lint:ink` into CI | **OPEN — team-lead row, correctly attributed** | `.github/workflows/ci.yml` runs `test:font-coverage`, `test:golden:bytes`, `test:prod-shake`; **no `lint:ink`** |
| 5.1 | blast map refreshed before any pass-3 lane moves | **CLOSED** | rewritten against `6800af04` at 17:35; D's own commits 17:40; every other lane later |
| 5.2 | map carries A's surfaces | **CLOSED** | `useStagingBridge.ts` and `StagingBand.vue` both rowed (§4 Lane A, C3, C9) |
| 5.3 | map carries B's ticket, C's wells | **CLOSED** | C4, C11, C12, §5 landing order |
| 5.4 | map carries the G2/G4 device failures | **CLOSED** | C4 carries the 1.6px separation; the `--vv-height` / keypad row carries G4 |
| 5.5 | map carries the 280ms stall | **CLOSED, and advanced** | §2.5 — see §4 strength 4 |
| 5.6a | map carries the inbound `--sheet-washi-neutral` dark row | **CLOSED** | §2.7, both consumers named |
| 5.6b | the token itself | **OPEN** | not shipped; disclosed by D |
| — | **§5 commit hold: "Nothing from Lane D commits until ships 3–5's blockers clear"** | **VIOLATED** | see §2.1 |

**19 of 24 closed.**

---

## 2 · BLOCKING

### 2.1 The stage committed against its own explicit hold — and four lanes are stacked on it

`pass2-registry` §5 closes with one unambiguous sentence: *"Nothing from Lane D commits until
ships 3–5's blockers clear; ships 1–2 may commit ahead on their stated conditions."*

Ship 3's blocker did not clear. D's own report names it: *"Still owed, named: **R3b — the TDZ cycle
on real Safari.** … Blocked on the locked rig session."* And **ship 3 was committed anyway**
(`d4e8e41e`), together with ship 4, on MAIN, at 17:40. Eleven further commits from Lanes C, B, A
and F3 now sit on top of that commit; `git log` puts `d4e8e41e` eleven commits below HEAD.

This is not a bookkeeping quibble. `d4e8e41e` deletes 419 lines on the strength of a
cyclic-ESM evaluation-order finding whose failure mode is *the app does not boot*
(`ReferenceError: Cannot access 'sudokuGame' before initialization`). The order held the commit
precisely until that hazard was exercised on the shipped engine. It was committed first and
exercised never, and the entire pass-3 stack was then built on it. Mark 6: the collateral surface
of a wrong call here is every downstream lane's tree.

### 2.2 R3b is open on a blocker that was false, and the evidence to close it was taken and not attributed

D's stated reason for not running R3b is *"the rig session is still locked."* That is pass 2's
condition, carried forward verbatim. It did not hold this pass:

- **RESULTS §0** records the iPhone 16 sim **BOOTED** for the sim block and shut down at its
  close; **§6.2** measures the *head dist* on real MobileSafari (`stall/runs/m3-covis-head.jsonl`
  — document height, in-flow band, board-bottom→Deal, a 7.19px chip gap); **§7** runs a
  five-scenario battery against a live 81-cell sudoku board on that device. Every one of those
  numbers requires the app to have **booted on JavaScriptCore**. RESULTS §0's own honest limit
  names exactly one unreachable row this session, and it is the keypad — not the boot.
- Separately, the built-dist e2e lane is **14/14 including `wordmark-webkit` 6 and `theme-bake`
  ×2 engines** (RESULTS §1) — headless WebKit boots the same bundle. D's report claims *"only
  chromium is proven"* while its own gate line, in the same document, records WebKit rows.

So R3b's answer already exists in two independent places in the pass's evidence set. Neither D nor
MEASURE connected it. The row is left open under a reason its own session refutes — a **masked
fallback**, and a **stale spec** of exactly the kind pass 2 named.

---

## 3 · MAJOR

**(a) `toggle-crest-dark` — the disposition is refuted by the pass's own base-dist runs.**
D's §"Two reds I did NOT touch" states that `playwright-golden.config.ts` reds *both*
`logo-light` (3948 px) **and `toggle-crest-dark` (1028 / 1194 px)**, that it rebuilt `6800af04`
in a throwaway worktree, and that both fail there *"with byte-identical pixel counts,
deterministically over three isolated runs each."*

`measure/gates-golden-BASE-r{1,2,3}.log` — three isolated runs of the same config against the same
base dist — show **`toggle crest (dark, moon)` ✓ in all three**, alongside `logo-light` ✘ at 3948
px in all three. RESULTS §1 tabulates it the same way. Half of a two-subject determinism claim,
asserted with a pixel count, is simply not what the tree does. The pair D names — logo-light +
toggle-crest-dark — is verbatim the pair the standing sun-crest clause names, which is what the
claim reads like it was written from: **spec-cites-itself**. The row was then routed to the team
lead on that basis.

**(b) Ship 1's headline gate row is a tautology, sold three times as the general form.**
`visual-regression.spec.ts` "the Deal die is not crushed" asserts three things. Two are real
(die squareness ≤0.5px, die ≥27px) and the GATE-1 negative control reds on them. The third —
`expect(geom.btn.h).toBeGreaterThanOrEqual(geom.die.h + geom.labelH)` — **cannot fail on the
defect it is written for, or on any defect of that class.** `.icon-btn.deal-btn` is a
column flex box with `padding: 0.3rem` (9.6px) and `gap: 0.15rem` (2.4px), so
`btn.h = die.h + labelH + 12` whenever the content drives the height, and when the height is
*pinned* (the actual defect) the items shrink until they fit: at the broken pose
`44 ≥ 17.62 + 14.38 = 32.0` passes with 12px to spare. The sum is structurally capped at
`btn.h − 12`. It is asserted as *"the general form — it fails for any cause, not just this tie"*
in the report, again in the commit message, and a third time in the source comment at
`GameControlPanel.vue:1052`. The gate as a whole can fail; the row carrying its durability
argument cannot.

**(c) Registry §4's ordered census is declared satisfied by one of its three halves.**
D §0: *"the rendered filter census registry §4 ordered as the grep gate's successor **already
exists and is green**"* — and three pass-2 mark-4 charges are mooted on it. Registry §4 ordered:
*count live filtered surfaces **AND** their union raster area; threshold zero new surfaces and
area growth ≤ 0 against base; **negative control = an injected filtered node must fire**.* The
shipped `e2e/filter-census.spec.ts` delivers the count (exact in both directions — genuinely
strong) and has **no area measurement and no injected-node control** (grep for `area`,
`getBoundingClientRect`, `inject` returns one comment hit). Those two halves exist only in Lane
A's throwaway rig (`measure/out/A-census.json`: `unionArea`, `controlFires`), which gates nothing
and is not in the repo. Related and unreconciled: the shipped gate navigates one scene at one
regime and asserts `FILTER_BUDGET_TOTAL = 9`; `filterBudget.ts`'s header asserts *"Below 1024
the population is the same size"*; RESULTS §7's device census of the **same board URL** on the
iPhone 16 reports **17 live filters**. Either the header claim is false or the two instruments
scope differently — neither document says which, and the mobile regime this whole campaign is
about is uncensused by any shipped gate.

**(d) Four chrome surfaces changed rendered contrast with zero rendered witness.**
Ship 4 moves KeyboardLegend's text 55% → 68% graphite, its kbd borders 40% → 55%,
CompletionVignette 62% → 68%, MarginNote 62% → 68%, the armed Clear sublabel rose → red-ink, and
**deletes `.legend-sep`'s `opacity: 0.7`** (a visible darkening of a shipped glyph). D's own blast
map states these four components carry **0 goldens, 0 direct e2e**. I confirmed the golden suite
covers `logo-light`, `toggle-crest-dark`, `cell-light`, `grid-corner-light` and nothing else, and
that no shot in `pass3/shots`, `pass3/measure/shots` or `shots-sim` frames a legend, a vignette, a
margin note or a tally. The sole witness for every one of these pixels is a node script.
**Unverified gestalt**, on the lane whose subject is how the estate reads.

**(e) The ladder gates read a hardcoded copy of the theme constants — while the report claims
drift-immunity by resolver.** `gateFloors`/`gateMonotone` — the ship's centre — compute against a
literal `THEMES = { light: { card: hsl(48,12,99), graphite: hsl(0,0,15) }, dark: { … } }`.
`gateArmed` alone uses `colorOf()`, and it is for `gateArmed` that the report says *"read out of
index.css by a resolver that follows var() aliases, **so the assertion cannot drift from the theme
values**."* The values happen to match today (I checked all four against `index.css:136/312/364/410`).
Nothing gates that they keep matching: re-pitch `--color-card` and the ladder keeps printing the
old contrasts, green. The one gate D built the resolver for is the one gate that did not need it
most.

---

## 4 · MINOR

- **(a)** `prefers-contrast: more` (`index.css:829-832`) sets `--grid-line-color: hsl(0 0% 0%)`
  for **`:root, .dark` both**. The ladder evaluates two scopes and says "both themes"; there is a
  third, and in it `--ink-press-quiet` computes to roughly **1.09:1** on the dark card. Out of the
  order's letter, inside the ship's own claim.
- **(b)** *"The phantom citation deleted"* — `6800af04:index.css` contains no `inkPressure.test`
  string. The citation lived in the dropped pass-2 stash, never in MAIN. Nothing was deleted; the
  new text simply cites a real file. Closed, but not as narrated.
- **(c)** *"P1-W3 group A … That single commit moots three pass-2 mark-4 charges"* — `6b8c1ffd`
  (group A) does not touch `OptionSelector.vue`. The `.ctrl-btn:hover { filter: url(#wobble-heart) }`
  deletion that moots Lane A's composition breach is elsewhere in the W3 wave (the surviving
  comment cites *P1-W3, r3 §3.2*). The fact holds — I diffed `32198688` → `6800af04` and the rule
  is gone — the single-commit attribution does not.
- **(d)** D's coarse row reads *"44×52.16, unchanged; die 28×28, unchanged"*; RESULTS §5.1's
  coarse row reads *"die 28×**19.84** → 28×28"*. Both are right against different counterfactuals
  (D's BEFORE is the historical bare-`.deal-btn` cascade where the coarse block still won;
  MEASURE's BEFORE pins the fixed square unconditionally). Neither document says so, and a reader
  cross-checking the two sees a contradiction in the ship's central measurement.
- **(e)** The LOC ledger calls `check-ink-pressure.mjs`, `GameControlPanel.test.ts` and
  `sudoku/game.test.ts` *"untracked"*. They are tracked adds inside the four commits. The
  arithmetic is exact regardless (185 + 390 + 152 + 101 = 828).
- **(f)** `--sheet-washi-neutral` dark remains unshipped (5.6b), disclosed. RESULTS §6.2 has since
  taken the dark device shot its gate was waiting on.

---

## 5 · CHECKLIST, ANSWERED

| failure mode | verdict |
|---|---|
| vacuous convergence | **present, narrow** — the `toggle-crest-dark` disposition (§3a) and "the phantom citation deleted" (§4b) close on nothing |
| spec-cites-itself | **present** — the golden claim names the sun-crest clause's own pair with pixel counts the runs do not produce |
| gates that cannot fail | **present** — `btn.h ≥ die.h + labelH` (§3b), tautological under the flex model, asserted as the general form in three places |
| elegant-reduction | **absent — and it is the stage's best discipline.** I re-derived the ledger: `git diff --numstat 6800af04 2335282c` = **17 files, +828 / −483, net +345**, matching the report to the byte, with *"no elegant-reduction claim"* stated at the site. Pass 2's inverted-sign headline is gone |
| legacy aliases | **absent — inverted.** The alias evasion is the thing D closed: both `--color-pencil-graphite` and `--grid-line-color` spellings now match in the ownership gate and the stop parser |
| masked fallbacks | **present** — R3b held open by "the rig session is still locked" on a session that booted the device and ran a five-scenario battery (§2.2) |
| unverified gestalt | **present** — six rendered-contrast changes across four components with no golden, no e2e, no screenshot (§3d) |
| consumer-less substrate | **partial** — `lint:ink` has no CI consumer (attributed to the team lead, fairly); the census's area and injected-control halves have no shipped consumer at all (§3c) |

**Named pass-2 offenses — recurrence check.**
*Loosened assertions:* **not recurred.** D's only test-file edit is additive (+1 test, −1 comment
line); nothing was relaxed in a diff that needed it.
*Non-interleaved numbers:* **not recurred in kind** — the in-page BEFORE pin is a stronger control
than an interleave; but see §4d, the two BEFORE definitions are unreconciled across documents.
*Grep-as-sole-filter-witness:* **not recurred at the assertion level** — `filter-census.spec.ts` is
a rendered census against the built dist. The overclaim is about its completeness (§3c).
*Stale specs:* **recurred twice** — R3b's blocker, and the golden disposition.

---

## 6 · STRENGTHS (verified, not taken on the report's word)

1. **The LOC ledger is exact.** 17 files, +828/−483, net +345, re-derived from the range. The
   lane buys gates with lines and says so.
2. **The `--self-test` is genuinely falsifiable now.** It walks a real temp fixture through the
   real collector — `nested/bad.vue` (alias spelling), `nested/bad.ts` (the extension hole),
   `assets/index.css` which must be skipped — and requires **both** bad files named, which is the
   check that survives a half-blind collector. I ran `npm run lint:ink` at HEAD: exit 0, and the
   printed ladder (3.53/4.36 · 5.23/6.06 · 5.95/6.66 · red-ink 4.98/6.32 · register 4.65/7.69)
   matches RESULTS §5.2 digit for digit.
3. **Ship 1's root cause is exact and predictive.** The commit's arithmetic —
   `28 + 2.4 + 14.384 + 9.6 = 54.384` against 44 available, overflow 10.384 absorbed by the only
   shrinkable item — predicts **17.616**; the rig measured **17.63 / 17.64**. The cure is
   specificity, not source order, and the coarse pose is held byte-identical by an explicit
   restatement I checked property-for-property against the coarse `.icon-btn` block.
4. **§2.5 is the best finding in the stage and it is not even in its own lane.** `GameScene.vue:104`
   mounts `#controls-drawer` under `v-if="rowRegime"` — verified in source, and corroborated on
   glass by RESULTS §6.2 (`#controls-drawer` absent on the device). There is no drawer below 1024,
   which re-points the campaign's own ~280ms "drawer-open" stall and voids its leading hypothesis
   (a three-pass stroke filter P1 had already deleted).
5. **The cross-lane graft landed by enforcement, not by exhortation.** `--ink-press-quiet` is
   consumed by Lane C's new `CheckStatus.vue:72`; `lint:ink`'s ownership gate is green at the
   final tree, so no downstream lane hand-rolled a graphite stop — the pass-2 register's
   `D → B, C` row actually took.
6. **The equality gate is the right shape.** It gates behaviour (`onChange` routing), not only
   shape, and it mounts through a stub that renders the named slot — the report's remark that a
   default stub would leave the test asserting nothing is correct, and it is written into the file.
7. **The blast map is real work.** Refreshed against `6800af04`, carries every row the order
   named, and was written before D's own commits and before all four downstream lanes.

---

## 7 · WHAT PASS 4 MUST CARRY FROM THIS STAGE

1. Run R3b — it is a page load on the already-booted sim and a console read; then close it, or
   close it from the §6.2/§7 evidence already on disk, attributed.
2. Correct the `toggle-crest-dark` row in the dossier against `gates-golden-BASE-r{1,2,3}.log`,
   and re-route the goldens row on the corrected fact.
3. Replace `btn.h ≥ die.h + labelH` with an assertion that can fail — the honest general form is
   `btn.h ≥ die.h + labelH + padding + gap`, or a scrollHeight/clientHeight overflow row on the
   button itself.
4. Finish registry §4's census in the repo: union raster area and an injected-node control, and a
   coarse-regime run — or stop calling the order satisfied.
5. Put one dpr-2 shot of the keyboard legend, the vignette and the margin note, light and dark,
   in the evidence set before ship 4 is called closed.
6. Resolve `THEMES` from `index.css` the way `gateArmed` already does, and decide the
   `prefers-contrast: more` scope explicitly.
7. The commit hold is the process finding: if a stage may commit ahead of its blockers, the hold
   is not a gate. Either the hold binds next pass or the order should stop writing one.
