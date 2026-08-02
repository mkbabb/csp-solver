# T5-W3 — THE ACCESSIBLE BOARD · VERIFY RECORD (draft for the lead)

**Verifier** W3 VERIFY (adversarial), owning the `gates.json` W3 `axBaseline` row.
**Tip** `78448760` — "T5-W2 THE SEAL". Working tree carries the four cure lanes' + the residue
lane's uncommitted diff (26 modified, 8 new files). No git state was changed by this lane.
**Servers** mine, all in the sanctioned 4230-4260 band: dev `:4231` (W3 source), preview `:4233`
(W3 built dist), preview `:4234` + dev `:4235` (HEAD controls), ablation dev `:4232`. The
throttle gate ran on its own `:4188`. **`:3000` was never used** — see DEV-1.

**VERDICT: the six rows are real, the cures are non-vacuous, π holds, and every axBaseline delta
maps. THREE BLOCKING ROWS remain, all of them stale assertions the lanes measured and left —
`doc-truth` is RED and the default e2e suite is RED 10.** Detail in §6 / §7.

---

## 1 · Rows 3.1-3.6 — verdicts

`e2e/a11y.spec.ts` run WHOLE, default config, both engines, against the W3 dev server:
**30/30 GREEN** (`01-probe-whole-green.txt`). Every family green in chromium and webkit.

| row | gate | verdict | evidence |
|---|---|---|---|
| 3.1 | grid → row → gridcell, N rows × N cells, indices exposed | **GREEN** — 5 games × 2 engines, N read off `aria-rowcount`, never a literal | `01-…` |
| 3.2 | armed guard announced + `aria-modal` + focus contained | **GREEN** — 3 tests × 2 engines | `01-…`, ablation `04-…` |
| 3.3 | picker publishes 5 named AX-visible options | **GREEN** — browser's own AX tree (chromium) + structural strip check (both) | `01-…`, ablation `03-…` |
| 3.4 | Ctrl/Cmd+K never peeks; help names k/g/h/p/d | **GREEN** — with the bare-`k` control intact, so no amputation cure | `01-…` |
| 3.5 | zero unnamed image nodes; no digit double-announce | **GREEN** — census zero, in-grid echoes zero | `01-…` |
| 3.6 | 15/15 residue dispositioned; figures structural not magic | **GREEN, and the corpus count independently re-derived** — `r1/a11y.md` carries exactly H1-H3 · M4-M9 · L10-L15 = **15**. The residue lane's correction to the charter (3 residue mediums, not 6) is **right**; the charter's arithmetic was wrong. | `residue/dispositions.md`, re-derived here |

## 2 · Gate table vs `gates.json` W3

| gates.json W3 | required | measured | verdict |
|---|---|---|---|
| `axAssertions.rowsPerGrid` | `"N"` | N rows × N cells, 5 games × 2 engines, N off the grid | ✅ |
| `axAssertions.optionsInPicker` | `5` | 5 (chromium AX tree) · 0 stripped (both engines) | ✅ |
| `axAssertions.guardAnnounced` | `true` | announced + `aria-modal` + focus inside | ✅ |
| `axAssertions.ctrlKDoesNotPeek` | `true` | `{laminate:0, announced:false}` for both chords; bare `k` still peeks | ✅ |
| `axAssertions.unnamedImages` | `0` | 0, both engines, 4×4 and 9×9 | ✅ |
| `axBaseline.owningLane` | named-at-wave-open | **this lane** | ✅ |
| `allBornRed` | `true` | lanes banked born-RED; verify **independently re-established red by ablation** on the 2 vacuity-prone families | ✅ |
| `piIdentity` | `true` | 4/4 within floors, goldens byte-identical | ✅ |

## 3 · Vacuity ablations — the two families most likely to green falsely

Both run in a **scratch copy** (`scratchpad/ablate`, structured so `../../csp-solver/wasm/pkg`
still resolves). The live tree was never ablated. Control first, restore verified byte-identical
after (`05-vacuity-restore-control.txt`, 8/8 green).

**Why these two.** 3.3 because the spec's own header concedes Playwright's role engine does NOT
honour `inert` — a role count alone greens over the live defect, and WebKit has no CDP twin, so
half the gate rides one engine-blind structural predicate. 3.2 because `guardAnnounced()` returns
true on a cheap `role="alert"`/`aria-live` check, and the third test is an **implication**
(`announced || after === before`) that greens whenever the guard merely holds.

| ablation | cure removed | result |
|---|---|---|
| **A · 3.3** | `:inert` moved back onto the `role="option"` root (`GameCard.vue`) | **RED 2/2 engines.** Chromium: `the browser AX tree publishes 1 options: ["sudoku, 1 of 5"]` — the exact one-item listbox r1/r2 banked. WebKit: `[null,"inert","inert","inert","inert"]` via the structural predicate. **The engine-blind hole is closed: WebKit reds on its own.** |
| **B · 3.2** | `GameGallery.vue` reverted whole to HEAD | **RED 6/6.** All three tests, both engines — including the implication row, which reproduces the canary verbatim: `the guard armed silently (announced=false) and the second Enter took the board from 1 user entries to 0`. |

Neither probe is vacuous. `03-vacuity-ablation-A-3.3.txt`, `04-vacuity-ablation-B-3.2.txt`.

## 4 · π — 4/4, and the residue lane's flag RETIRED

The residue lane flagged an intermittent `toggle-crest-dark` breach (0.03 vs the 0.017 soul
floor) "for verify to re-run π". Re-run, and then some.

- **π gate, W3 built dist `:4233`: 6/6 runs at 4/4** (`12-…`). A 7th-9th run earlier (`07-…`)
  breached **once**, on `logo-light`, not the crest.
- **Goldens byte-identical before and after** (`06-…` vs `13-…`, md5 all 8) and clean in git.
  **Nothing re-baselined; `e2e/goldens/` untouched.**
- **Magnitude probe** (`GOLDEN_MAGNITUDE=1`, the pre-registered instrument, asserts at ratio 0):
  `logo-light` **0.0000 byte-for-byte identical in all 6 runs**; `toggle-crest-dark` wanders
  0.0000 → 0.0133 → 0.0212 on an unchanged dist, its worst run measuring **1028 px** — the exact
  figure `scripts/golden-magnitude.mjs`'s own header pre-registers as the campaign's observed
  drift.
- **THE CONTROL THAT SETTLES IT.** I built HEAD `78448760` with **zero W3 changes** into a
  scratch tree and ran the same probe: the crest breaches the floor **5 of 6 runs at HEAD**
  versus **1 of 6 on the W3 tree**, and the π gate itself reds 1 of 6 at HEAD (`11-…`, `12-…`).

**The intermittency is a pre-existing property of HEAD's two non-convergent surfaces, not a W3
pixel move.** π is NOT wave-stopping. Rows 3.1/3.3/3.5 touched DOM around rendered SVG and moved
no golden pixel.

**But it is an open row, and it is the lead's** — see OPEN-3: `toggle-crest-dark` is a flaky gate
on darwin at HEAD. On linux the 0.05 clause floor covers 0.0212, so CI stays green and the flake
is invisible there.

## 5 · axBaseline — PRE → POST, every delta mapped

PRE `evidence/w2/finisher/capture/ax-post.json` · instrument `axprobe.mjs` + `axprobe2.mjs` +
`axdiff.mjs`, run per their capture-log (built dist, static server, chromium CDP
`getFullAXTree`, 1440×900). Captures in `verify/capture/`.

**Instrument integrity, established before any reading was believed:**

- **Stability** — W3 POST captured twice, diffed: **0 invariant deltas** (`ax-stability-w3.txt`).
- **Baseline staleness, found and measured.** `gates.json` calls the PRE "POST of W2 = PRE of
  W3", but it was captured at `ff5a7cea` and HEAD is the later seal `78448760`, which moved **44
  frontend files**. I captured HEAD itself and diffed against the declared PRE: **0 invariant
  deltas** (`ax-diff-PRE-staleness.txt`). The pointer is stale (DEV-4) but **empirically
  harmless**, so all 70 deltas below are the wave's and nothing else's. The definitive diff is
  run against the true PRE anyway (`ax-diff-w3-vs-true-pre.txt`) and yields the same 70.

**70 invariant deltas = 14 keys × 5 games, uniform across every game. Mapping:**

| # | delta (per game) | maps to |
|---|---|---|
| 1 | `ax role row` 0 → N | **3.1** |
| 2 | `gridChildRoles` `["gridcell"]` → `["row"]` | **3.1** |
| 3 | `gridChildCount` N² → N | **3.1** |
| 4 | `domRowRoles` 0 → N | **3.1** |
| 5 | `gallery option(AX)` 1 → 5 | **3.3** |
| 6 | `gallery inert options` 4 → 0 | **3.3** |
| 7 | `gallery option names` 1 → 5 named | **3.3** |
| 8 | `ax role tooltip` 5 → 0 | **3.6 / L11** (SheetWashiLabel) |
| 9 | `ax role term` 5 → 7 | **3.6 / L10** — legend renders `SINGLE_KEY_SHORTCUTS` (5 keys) + 2 chords = 7. Exact. |
| 10 | `ax role definition` 5 → 7 | **3.6 / L10**, same |
| 11 | `ax role region` 0 → 1 | **3.6 / M7** (GameScene drawer) |
| 12 | `tabStops(selector)` −1 (107→106, 52→51, 42→41) | **3.6 / L12** (DifficultyTally `tabindex` dropped) |
| 13 | `bareSvgByClass` → `{toggle-icon:2}` | **3.5 / M6** |
| 14 | `ax role generic` −(N²+1) | **3.5 / M6** (N² ghost rings hidden) **+ 3.6 / M7** (1 generic reclassified `region`). Arithmetic exact in all five: sudoku/thermo/killer −82=81+1, futoshiki −26=25+1, kenken −17=16+1. |

**Deal-variant rows** (classified by the instrument's own stability method, annotated never
gated): `ax role image` 155→1 (**3.5 / M5+M6**), `StaticText` and `InlineTextBox` +2 uniformly
(**3.6 / L10**, the two new keycap rows), `labelledSvgNoRoleByClass` `{glyph-svg:N}`→`{}`
(**3.5 / M5**).

### UNMAPPED DELTAS: **ZERO**.

**`rederiveFirst`, the three the gate names — re-derived:**

- *tab stops (r1 25 vs 20 here)* — the keyboard walk reads **20 at PRE → 19 at POST**. r1's 25 is
  not reproduced by this instrument, at either tree. The −1 is L12 and nothing else.
- *focusable outside main (2 vs 4)* — **4 at both PRE and POST**, unchanged: attribution, @mbabb,
  GitHub, dark-mode toggle. r1's 2 is not reproduced. L13's retirement rationale cites 4, so it
  reasons from the instrument's figure, not r1's.
- *glyph-svg deal-variant* — confirmed deal-variant, and `{}` at POST on all five games.

Roving tabindex identical PRE/POST: `{"0":1,"-1":80}`.

## 6 · Batteries

| battery | result |
|---|---|
| unit, full | **444/444, 41 files** (floor 300; charter expectation ≥392 cleared) |
| unit count gate | 444 ≥ 300, 0 skipped/todo, report age 0.0 min — GREEN |
| `e2e/a11y.spec.ts` whole, both engines | **30/30 GREEN** |
| default e2e, both engines | **253 passed / 10 FAILED** — see §7. Not the banked set. |
| built-dist gates (throttle) | **39/39 GREEN**, quarantine pinning untouched |
| π goldens | **4/4** within floors, 6/6 runs; nothing re-baselined |
| doc-truth | **RED, exit 1** — `root-readme-e2e-counts`. See §7. |
| ledger-diff `--require-ledger` | **GREEN exit 0** — 220 rows, ORPHAN 0 |
| knip · lint(prettier) · eslint · boundary · ink · catch · tdz · vue-tsc | **all GREEN** (catch and tdz negative controls fire RED as required) |
| golden-bytes · pw-projects · pw-retries · support-floor · coverage-floor self-test · evidence-policy | **all GREEN** |

## 7 · THE BLOCKING ROWS

### BLOCK-1 · `doc-truth` is RED, and W3 reddened it

`README.md:96` and `:99` still say **233 tests / 15 spec files / 20 on disk / 276 total**. The
tree is **263 / 16 / 21 / 306**. W3 added exactly one spec (`a11y.spec.ts`, 30 tests) and did not
restamp the README.

**Proven W3-caused, not inherited**: doc-truth on a clean HEAD archive scores this row **GREEN**
(`23-doc-truth-HEAD-control.txt`) — 233 in 15, matching the README exactly. `pw-projects`
independently confirms the new figures: *21 specs, 306 resolved tests*.

The row is one of `gates.json` W0's `redRowsAtHead` — W0 cured it, W3 re-broke it. Fix is
mechanical: 233→**263**, 15→**16**, 20→**21**, 276→**306**. `22-doc-truth-RED.txt`.

### BLOCK-2 · `gallery.spec.ts` — 3 rows × 2 engines RED, patch written and never applied

Lines 39/67/156 assert `inert` **on the option root** — the exact placement 3.3 exists to kill.
Lane B3 measured this, wrote the mechanical retarget (`#gallery-card-N` →
`#gallery-card-N .game-card-deal`) into `b3-picker/05-collision-gallery-spec.md`, correctly
declined to touch an out-of-fence file — **and nobody landed it.** The suite is red.

### BLOCK-3 · `gallery-deal.spec.ts` — 2 rows × 2 engines RED, and NOT what they were called

`:197` and `:318` assert `aria-label === "Deal a new board?"`. Lane B2's one-name cure renamed
the guard to its drawn heading, `"deal over this puzzle?"`. Stale assertion, needs the same
mechanical retarget.

**This corrects the record I was handed.** These two rows were described to me as *"the 2 known
gallery-deal dev-server rows, banked-at-HEAD, cite not cure"*, and the residue lane booked all 10
failures as "the sibling lanes' banked out-of-fence collisions". **They are not banked at HEAD.**
I stood up a HEAD dev server and ran both spec files, both engines, matched conditions:
**50 passed / 0 failed at HEAD** (`24-e2e-gallery-HEAD-control.txt`) against **40 passed / 10
failed on W3** (`25-…`). All ten reds are W3's, and B3's blast-radius measurement predicted only
six of them — the guard-rename four were outside every lane's fence and outside every lane's
estimate.

**None of the ten is a product regression** — all ten are assertions describing the pre-cure
tree, and the cures they contradict are the ones the charter ordered. But the wave cannot seal
with the default suite red.

## 8 · THE DEVIATIONS TABLE

*Things the lanes did that the charter didn't say, and things the charter said the lanes didn't
do. Numbered, honest.*

| # | deviation | reading |
|---|---|---|
| **DEV-1** | **Environment hazard, not a lane's fault, but it must be written down.** Both PW configs declare `webServer {port:3000, reuseExistingServer:true}` and `vite.config.ts` pins `server.port:3000`. On this machine `:3000` is a **foreign palette-api** (`{"status":"ok","service":"palette-api"}`) — the standing forbidden port. Any lane that ran `npx playwright test` with no `PLAYWRIGHT_BASE_URL` while that service was up latched onto it; `global-setup.ts` fails loudly there, so it can't have produced a false green, but it can have produced confusing reds. Every run in this record used an explicit base URL in 4230-4260. | infrastructure trap |
| **DEV-2** | README e2e counts not restamped → doc-truth RED. Charter didn't name it; it's a standing gate. | **BLOCK-1** |
| **DEV-3** | `gallery.spec.ts` retarget written but not applied; `gallery-deal.spec.ts` collision not written at all and mis-booked as pre-existing. | **BLOCK-2/3** |
| **DEV-4** | `gates.json` W3 `axBaseline.pre` says "POST of W2 = PRE of W3"; the artifact was captured at `ff5a7cea`, one commit before HEAD, which moved 44 frontend files. Measured harmless (§5) but the wording is inaccurate and should be restamped. | bookkeeping |
| **DEV-5** | Charter's row 3.6 arithmetic is wrong — "6 medium beyond M4-M6" when `a11y.md` carries 6 mediums *in total*. The residue lane corrected it in the open rather than papering it. **Independently verified correct here.** Charter error, lane handled it right. | charter defect |
| **DEV-6** | Two spec files edited outside any cure fence, both declared by the residue lane: `zone-grammar.spec.ts` (one L11 clause) and `font-census.spec.ts` (two L10 ledger rows). **Both audited here and both honest** — the zone-grammar clause replaces one assertion with two strictly more specific ones (`role === null` **and** `aria-hidden === "true"`), not a weakening; the font-census rows join an existing adjudicated keycap class under exact-match, no ceiling raised. | declared, clean |
| **DEV-7** | Charter §π/DELTA asks for "DELTA crops for the picker's visual state if any pixel moves". No DELTA crops were banked. I did not find a pixel move to justify one — `inert` carries no paint, and B3's "zero `:hover` rules in the gallery components" claim I re-grepped and **verified** — so the omission looks harmless, but the charter row was not formally answered. | charter row unanswered |
| **DEV-8** | Charter's 3.4 asks for the modifier guard "mirroring App.vue:438's correct pattern". The lane went further and minted `useShortcutPolicy.ts` as a single source of truth, which L10 then renders. More than asked, and it's why row 12's legend delta is exactly +2. | over-delivery |
| **DEV-9** | L10's cure closed a gate lane B4 measured but couldn't reach from its fence (the help-affordance row). Cross-lane hand-off worked, and it's recorded on both sides. | clean |
| **DEV-10** | Row 3.6 routes L14 whole → W4c and L12's parsimony half → W4b, and retires L13/L15 with measurement. Charter said "lands or is retired-with-rationale"; **routing** is a third disposition the charter didn't enumerate. Defensible — both routes cite adjudicated r2 §6 rows — but the lead should bless it explicitly. | disposition class not in charter |

## 9 · THE LEAD'S OPEN ROWS

| # | row | owner |
|---|---|---|
| **OPEN-1** | Restamp `README.md:96/99` → 263 tests / 16 spec files / 21 on disk / 306 total. Re-run `node scripts/check-doc-truth.mjs` to exit 0. | lead, blocking |
| **OPEN-2** | Land the `gallery.spec.ts` retarget (B3's table, 3 rows) **and** the `gallery-deal.spec.ts` guard-name retarget (2 rows, patch not yet written). Re-run the default suite both engines to 263/263. | lead, blocking |
| **OPEN-3** | `toggle-crest-dark` is a **flaky gate at HEAD on darwin** — 5/6 magnitude runs over the 0.017 floor, worst 1028 px, on a tree with zero W3 changes. Invisible on linux CI under the 0.05 clause floor. This is the flaky-gate class T5-W2 prunes; it wants a decision (tighten the settle, widen darwin to the clause floor with an argument, or retire the surface), **not** a re-baseline. Not W3's to fix. | lead / W4 |
| **OPEN-4** | Restamp `gates.json` W3 `axBaseline.pre` to name the capture commit `ff5a7cea` and note the measured-zero staleness delta, so the next wave doesn't inherit the ambiguity. | lead |
| **OPEN-5** | Bless (or reject) DEV-10's routing dispositions for L14 → W4c and L12-parsimony → W4b, so row 3.6 reads 15/15 with no implicit third category. | lead |
| **OPEN-6** | DEV-1: the `:3000` collision between the app's pinned port and a foreign service is a standing trap for every lane on this machine. Worth a config note or a band move. | lead / W6 precepts |

## 10 · Evidence index (`evidence/w3/verify/`)

`01-probe-whole-green.txt` · `03-vacuity-ablation-A-3.3.txt` · `04-vacuity-ablation-B-3.2.txt` ·
`05-vacuity-restore-control.txt` · `06`/`13-golden-checksums-{before,after}.txt` ·
`07-pi-goldens-3runs.txt` · `08-pi-magnitude-w3.txt` · `10-build.txt` · `09-headctl-build.txt` ·
`11-pi-magnitude-HEAD-control.txt` · `12-pi-passrate-w3-vs-head.txt` · `20-e2e-default-full.txt` ·
`21-static-gates-root.txt` · `22-doc-truth-RED.txt` · `23-doc-truth-HEAD-control.txt` ·
`24-e2e-gallery-HEAD-control.txt` · `25-e2e-gallery-W3-matched.txt` ·
`26-e2e-gallery-deal-isolated.txt` · `27-static-gates-frontend.txt` · `28-built-dist-gates.txt` ·
`29-gate-scripts.txt` · `30-evidence-policy.txt` ·
`capture/{ax-post-w3,ax-post-w3-run2,ax-post-w3-taborder,ax-head-78448760}.json` ·
`capture/{ax-stability-w3,ax-diff-w3,ax-diff-PRE-staleness,ax-diff-w3-vs-true-pre}.txt`

---

## THE SEAL (2026-08-02, the lead's own hand)

Verify's two blocking rows, cured by the lead and re-proven:

- **OPEN-1**: README e2e counts restamped 263/16/21/306 — and the per-engine split MEASURED
  (chromium 134 + webkit 129; the lead's first stamp guessed 131/132 and the re-derive law
  caught it before commit). doc-truth 13/13 GREEN.
- **OPEN-2**: B3's banked gallery.spec.ts retarget applied (3 rows, `#gallery-card-N` →
  `#gallery-card-N .game-card-deal`); gallery-deal.spec.ts's two split-string rows swapped to
  the one name (`'deal over this puzzle?'`). Retargeted pair 50/50 serially; **full default
  suite 263/263, both engines**, at the lead's own :4235 dev server (the :3000 squat bit its
  third lane — precept written, see below).

The adjudications:

- **OPEN-3 → CH-42.** The crest flake is the banked WATCH row's own class; verify's HEAD
  control (5/6 breach on an unchanged tree, worst 1,028 px) BANKS as evidence on CH-42, which
  already owns the disposition: branch-C crop-tighten POST-W4. No new decision was owed.
- **OPEN-4 executed**: gates.json axBaseline.pre now names ff5a7cea and records the
  measured-zero staleness; postW3 mapping figure (70/70, 0 unmapped) stamped beside it.
- **OPEN-5 BLESSED**: ROUTED is a legitimate third disposition for 3.6 rows — L14 → W4c and
  L12's parsimony half → W4b, both riding adjudicated r2 §6 rows. The charter's
  land-or-retire enumeration was incomplete, not violated; 3.6 reads 15/15 with routing
  explicit. DEV-5's corpus correction (15 = H1-H3 + M4-M9 + L10-L15) is ratified — the
  residue lane corrected the charter in the open and verify re-derived it independently.
- **OPEN-6 executed**: the :3000 squat precept lands in PRECEPTS.md (third bite; the
  assert-the-SPA guard is the enforcing config and held all three times).
- **DEV-6 ratified**: the residue lane's two out-of-fence spec edits (zone-grammar L11,
  font-census L10) were audited honest by verify — strictly-more-specific assertions, no
  weakening. Declared on both sides; the fence law's purpose (no silent corruption) was
  served by the declaration.
- **DEV-7 answered**: no DELTA crops because no pixel moved — π 4/4 across 6/6 runs with
  goldens byte-identical is the stronger fact; the charter's conditional never fired.
- **DEV-8/DEV-9 recorded with approval**: useShortcutPolicy.ts as the one source the legend
  renders is the estate's one-string principle applied to shortcuts; the B4→L10 hand-off
  closed a gate neither lane could close alone, recorded on both sides.

The PARTIALs resolved: B1's 3.5 page-wide census closed by the residue lane's M6/L-row cures
(155 unnamed → 0, the last 12 lived outside B1's fence); B4's help-affordance half closed by
L10 (the legend renders the policy's 5 keys + 2 chords — term/definition 5→7, the exact
mapped delta).

Wave figures at the seal tree: probes 30/30 born-RED then 30/30 GREEN both engines ·
units 444/444 · default e2e 263/263 both engines · built-dist 39/39 (quarantine second
pinning untouched) · π 4/4 ×6 runs, goldens byte-identical, nothing re-baselined ·
axBaseline 70/70 mapped, 0 unmapped · vacuity ablations 2/2 RED in scratch ·
doc-truth 13/13 · ledger-diff 220/220 exit 0 · knip/lint/eslint/boundary/ink/catch/tdz/
vue-tsc/golden-bytes/pw-projects/pw-retries/support-floor all GREEN.

The seal commit carries: the four cure estates + probes spec + residue cures, the two
retargeted specs, README restamp, gates.json axBaseline restamp, LEDGER CH-42 evidence fold,
the PRECEPTS row, and this section. Expected CI: 18/18 (the a11y spec joins the default lane
by glob — born-RED law discharged, it lands GREEN). The wave closes when the pinned run says
so in its own tool result.
