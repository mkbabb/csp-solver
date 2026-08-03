# T7 — THE AUDIT TRANCHE · WGATE CLOSE RECORD

Closed 2026-08-03. The close commit is the commit carrying this file; every count below is
re-derived at its tree (ruling 3), and `ledger-diff --require-ledger --assert-state
--verify-cites` exits 0 against it. §9 (production) lands as a dated appendix after the
deploy it records, per the T4 idiom.

## 1 · The thesis, answered

The formation's thesis held and then some: **the record's defects outnumbered the
runtime's** — and the tranche's own execution went on to find three runtime defects the
audit never named (CH-66 the dropped press, CH-67 the lost flick, the closed-drawer
overflow), each dissolved by instrument rather than narrative. Two CRITICALs (theme
mismatch W1, access W2) cured born-RED. The uncapped relay fanout cured at W4
(MAX_FRAME 65,536, born-RED at 5MB-fanned-whole).

## 2 · The seal chain

| wave | commit | one line |
|---|---|---|
| W0 | `cbf2ab49` | the record heals — LEDGER §1 31→10, ledger-diff armed, 20 ballots dispatched |
| W1 | `af508288` | theme ink keys off the class the app writes; census + 28-row identity born-RED |
| W2 | `53a6b56d` | focus clears the sticky bar, covered verbs go inert, the roster speaks |
| W3 | `6d612ec5` | sleep lint + motion contract born-RED; sharding B; burst forensics; ch62 probe built NOT dispatched |
| W6 | `4b4c7aeb` | the contrivance sweep — every lane wired or dead, every gate made to bite |
| residue | `1358d74c` | the blind band closes, GATE D restamps, the dropped press gets its law |
| W4 | `5f93f04c` | two phones at one table; the relay learns bye; wire=local dies in the dist |
| W7 | `d3fa41df` | nine polish rows on the real surface; the eyebrow verdict; every crop chair-looked |
| nits | `fd6a141a` | knip consts private; webkit install fails under its own name |
| W5 | `141fdbad` | docs/multiplayer.md, 14 sections, gated by ten doc-truth rows so it cannot rot |
| WGATE | this commit | CH-66 product cure · CH-67 · GATE D close ruling · floors · ballots · this record |

## 3 · Counts at the close tree

- rust `cargo test --workspace`: **212 passed / 0 failed** (29 test binaries + doctests)
- frontend units: **483 / 483** (47 files; floor restamped 300→**434**, stamp `141fdbad`+WGATE)
- relay units: **21 / 21** (`test:unit:relay`, its own fe-unit step since W4)
- e2e default config: **351 passed / 2 skipped / 0 failed**, both engines, one quiescent
  pass (the settling act — the wandering reds seen under load-50 during three concurrent
  agent lanes do not exist on a quiet box; CH-64's class, attributed not swept)
- e2e resolved total: **424 in 25 spec files** (default 353 + golden 4 + throttle 67)
- built-dist gates: **67/67**; darwin goldens **4/4** — two of them the CH-66-touched surfaces
- doc-truth: **0 RED / 32 GREEN** (+ self-test 49/49, now a CI step)
- ledger-diff, full arms: **GREEN, 144 audited ids**, 10 open rows current
- perf: GATE A/B/C PASS · GATE D **PASS at 1750** (5 runner medians 1263–1333) with the
  anchor admissibility ceiling (350) live
- python wheel-contract: 27/0 as last derived (`e961bdb7`; no python-touching change since —
  the suite needs a maturin wheel build and was not re-run at this tree)

## 4 · Ballots

Twenty-one fired defaults, dated — `evidence/wgate/ballots-fired.md`. The permanent and
T8-formation consequences are gathered in that file's tail. BAL-21 (O-11) was late-minted
at the W7 seal; its mint is annotated in the W7 wave file itself.

## 5 · The runbook, discharged (items 1–16)

1 rows moved same-commit — CH-66 CLOSED to §2, CH-67 born CLOSED, CH-64 credited, this
commit · 2 N-12 ballot-record cites — ballots-fired.md cites §8 · 3 T7 gates.json — no
separate mint; the tranche's thresholds live in their gates (perf gates.json restamped,
floors in their instruments) · 4 counts SHA-stamped — §3 · 5 owner block --owner-block
verbatim — §6 · 6–10 (close-form discipline) — this record · 11 count-reds-mid-tranche —
each seal trued its own counts; the intermediate reds are noted at their runs · 12 green
run under sharding WITH the guarded press — the settling act §3 + CI at the close head
(§9 appendix) · 13 GATE D debts — transposition REFUTED at n=3 (ratio spread 12.7% vs
TBT's 5.5%), ceiling 350 landed, contention exposure stays OPEN → §7 · 14 self-delta arm
law — runner proved the covered arm at `d3fa41df` (e2e job green); MIN_ARM_RATIO 0.10
live; DELTA_ANCHORS clause re-read, golden estate unchanged at 8 · 15 CH-66 product cure
landed INSIDE T7 (`evidence/wgate/ch66-product-cure.md`) — 0/120 on the disease's own
instrument · 16 O-11/BAL-21 fired — ballots-fired.md

## 6 · The owner block (ledger-diff --owner-block, verbatim)

| Row | State | Owner | Trigger | Cite |
|---|---|---|---|---|
| CH-35 | BALLOT → BAL-01, dispatched 2026-08-03, default fires at T7 WGATE | the owner | default: the iOS claim RETIRES to sim-scope, and stays sim-scoped permanently unless the owner runs the smoke before T8 formation. No later tranche may re-book it | `docs/tranches/LEDGER.md:39` |
| CH-36 | BALLOT → BAL-02, dispatched 2026-08-03, default fires at T7 WGATE | the owner | default: accepted-limitation, hash-rotation stands | `docs/tranches/LEDGER.md:40` |
| CH-39 | BALLOT → BAL-04, dispatched 2026-08-03, default fires at T7 WGATE | the owner | default: RATIFIED as shipped and CH-39 retires with it | `docs/tranches/LEDGER.md:41` |
| CH-45 | BALLOT → BAL-03, dispatched 2026-08-03, default fires at T7 WGATE | the owner | default: the headless-only law stands as written in docs/tranches/PRECEPTS.md §4 | `docs/tranches/LEDGER.md:42` |
| CH-64 | BANKED · third-burst trigger FIRED 2026-08-03, forensics EXECUTED 2026-08-03, trigger RE-ARMED | the CI keeper lane | (unstated) | `docs/tranches/LEDGER.md:46` |
| CH-65 | BANKED | the CI keeper lane | any logo-surface change, where the golden step is the detector, or any clause-floor tightening below 0.0322 — both self-evidencing, since a tightening into (0.0322, 0.05] yields no red, no runner artifact, no lawful mint, and silently consumes the trigger. The "T7 estate wave" trigger is DELETED as un-fireable: no referent estate-wide, and a docs wave produces no runner artifact. The opening config-use clause STANDS — visual-golden runs under web/frontend/playwright-golden.config.ts, which declares reduced motion | `docs/tranches/LEDGER.md:47` |
| CH-28 | BANKED · WATCH | wasm lane | the lean artifact crossing the 127,500 B band, evaluated at the band step every run | `docs/tranches/LEDGER.md:77` |
| CH-20 | BANKED · WATCH | executor lane | the typescript-eslint peer cap on typescript lifting past 7. Probed unfired 2026-08-03 — installed tseslint 8.63.0 peers typescript >=4.8.4 <6.1.0 | `docs/tranches/LEDGER.md:90` |
| CH-21 | BANKED · WATCH | perf lane | a perf-rig trace on a NAMED mid-tier profile at or above 89 ms@1× / 355 ms@4×, banked as evidence. "Mid-device" never named a device, which is why it held six closes | `docs/tranches/LEDGER.md:91` |
| CH-22 | BANKED · WATCH | the owner | an owner ask naming a game | `docs/tranches/LEDGER.md:92` |
| CH-26 | BANKED · WATCH | solver lane | any diff under csp-solver/src/solver/ touching propagation strength or the GAC default | `docs/tranches/LEDGER.md:93` |
| CH-30 | BANKED · WATCH | wasm lane | a sixth game, or any solver wire >12k — probed unfired at five games today. Evaluated at the lean raw-size band step of .github/workflows/ci.yml every run | `docs/tranches/LEDGER.md:95` |

(CH-62's row also stands open with its dated firing default — dispatch before T8 formation
or RETIRE as library-hypothesis-spent; the probe is built and never run.)

## 7 · Forward to T8 formation, in one place

- **GATE D's contention exposure (3.40×) is OPEN** — the anchor is a host-class guard, not
  a contention detector (measured: anchor +24% while TBT +153%). The control that would
  work must read the frame path inside the boot window. Design question, not a threshold.
- **Fleet homogeneity**: anchor 14.2% cross-VM vs 0% within-host — the runner fleet may be
  two hardware classes wearing one number.
- **`check-pw-projects --restamp` miscounts data-loop specs** (derives 12 where its own
  gate resolves 14 on theme-quadrants) — the refusal held the floors; the restamp arm
  wants a fix before it is trusted (record-can't-verify-record family).
- **CH-67 residue**: the click-swallow disarm ignores `pointerType === "touch"` and
  non-left buttons — unreachable on desktop rows, real on hybrid devices.
- **16×16 closed desk above the 896 gate** (1440×900 closed, shell-lg): ovf 6/5, unchanged
  from head, disclosed at the W7 closed-pose cure — a rung-aware threshold breaks the
  masthead pair, so it waits for a design that doesn't.
- **'solved it!' lands on the top-right digit** — the celebration heart's twin, named at W7.
- **CH-62**: the probe is built, armed, and dispatch-gated on the owner; the dated default
  fires at T8 formation.
- BAL-01's permanent clause; BAL-05/06/20 retirements land at T8 formation; BAL-21's
  reversal window closes there.

## 8 · What the tranche measured about itself

Fourteen agents across five workflows and six standalone lanes; three CI reds at the first
sharding-B run each dissolved into a named mechanism (blind band · cold-chunk refuted →
dropped press · provisional threshold at first field contact); two more at the second
(lost flick · install hang). Every cure landed born-RED or ablation-proven; the two
instruments that refused to restamp (coverage single-run, pw data-loop) were both RIGHT to
refuse. The record's gates now outnumber the record's defects.

## 9 · Production

Appended after the deploy this section records.
