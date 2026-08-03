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

## 9 · Production (appended 2026-08-03, after the deploy it records)

**The owner's ruling reshaped the gate before it fired (O-12, DISPOSITIONS §4).** The close
head's only red was `gallery.spec.ts:300`'s webkit-shard budget-exhaust — its second field
occurrence on a quiet `workers=1` runner, which killed the load-only adjudication and opened
an unbounded forensics tail. The owner cut it: *"Why do we have ANY chrome-based
playwright-based scripts running when deployed? If we're constantly running into walls,
remove them. Validate the deployment visually on the deployed site thereupon."* Executed at
`d1daefb3`: `e2e`, `e2e-webkit` and `perf-subset` deleted from ci.yml (nineteen lanes →
sixteen, −548 lines), the Playwright e2e/golden/perf estate retained in-repo as local
instruments, four orphaned guards under dated `NOT-A-LANE` declarations (`lint:lanes`
green), CH-64's habitat and CH-65's detector restated in the ledger, README trued.

**The deploy, gated as law requires.** CI run 30824772723 at `d1daefb3` — sixteen lanes,
all green. Conclusion banked per the CH-57 gated chain (which first REFUSED an ungated
attempt, as built), then:

- frontend: CF Pages deployment `30ac068e`, entry `index-C9b17OTx4t72.js`, 41 files /
  744.7 KB — `dist-identity --served` confirms https://sudoku.babb.dev serves the same
  entry byte-for-byte
- relay: `sudoku-relay` Worker version `25afe684` (wrangler 4.116.0; carries W4's
  MAX_FRAME 65,536 cap + bye handling, which the prior live version predated)

**The visual validation, on the live edge (the owner-ordered acceptance).** Chromium +
WebKit driven against production, twelve frames banked (`evidence/wgate/` sibling shots
withheld from the repo per the evidence byte caps; the probe script is
reproducible from this section): home boots with the board fully inked and the wordmark
sharp; the dark-toggle press COMMITS on WebKit (CH-66's cured surface — moon pose inked,
theme flipped); `?view=gallery` renders the deck with the centered live card, flank, pips
and staging band, theme persisting across the deep link (W1's cure); **the centered-card
click-to-select commits in BOTH engines** — the exact interaction the dead CI row guarded,
green on the real surface; `?game=kenken` renders whole in both engines (cages, operators,
drawer); 390×844 centres the board under the wordmark with the controls affordance.

**One edge fact found and booked, not cured:** the `_redirects` SPA-fallback rule
(`/* /index.html 200`) is dead in production — a bare path like `/kenken` serves
`404.html` with HTTP 404 because Cloudflare Pages disables SPA mode when a `404.html`
ships, a state standing since the edge-cache-poisoning guard landed it. Zero user-facing
surface (every in-app and shared URL is query-shaped off `/`), but the file's own comment
claims a guard the edge does not honor. T8 formation: true the comment or re-home the
asset guard. A second nit rides with it: `scripts/ci-conclusion.sh` prints a cosmetic
`line 96` syntax warning while producing a correct artifact.

**The tranche's last red never got its mechanism named** — the forensics lane measured
H2 dead (tap-proven), H1 unevidenced (no DOM churn in any press window), reproduced the
row only under CPU-class starvation (`taskpolicy -b` + burners; load alone at 33 stayed
14/14 green), and was re-scoped by O-12 to the product question alone; its evidence lands
as `evidence/wgate/gallery-press-refusal.md` when the lane concludes. The row itself now
lives where the owner put it: a local instrument, not a wall.

### 9.1 · The mechanism landed after all (appended 2026-08-03, post-seal)

The paragraph above aged in hours: the lane concluded WITH the mechanism — CH-67's third
species, and a real hand's defect, not a driver's. `pointermove` is coalesced to one per
rendering frame; `pointerup` is not coalesced at all — so a release lands 0–16.7ms after
the last reported move with the hand still travelling, its leg reads ZERO TRAVEL, and the
release fold multiplied a correctly measured flick by 0.3 (a declared 0.45 px/ms threshold
behaving like 1.5, decided by where the release fell inside a frame). Cured at `8fdacd87`
by replacing the arm list with its invariant — **the release may only ADD to what the
gesture measured, never subtract from it** — born-RED in BOTH engines against `4d74afe8`,
drag block 14/14 both engines cured; the full booking is the CH-67 amendment in
`docs/tranches/LEDGER.md` and `evidence/wgate/gallery-press-refusal.md`.

Production reconciliation, stated because the record must not imply otherwise: the 14:58
deploy (`30ac068e`) was built `--commit-dirty=true` from a tree that already carried the
agent's uncommitted cure, so the live entry `index-C9b17OTx4t72.js` has been the CURED
composable from the first §9 deploy on — the §9 visual pass exercised exactly these
bytes. `8fdacd87` committed them verbatim (CI 16/16 green, run 30826356755) and the
re-deploy (`aaa4d3b6`) uploaded zero files against the same entry: byte-identity confirmed
twice by `dist-identity --served`. Residue owned by the O-12 regime: the born-RED flick
row has no automated home (no browser lane) and a lost flick is invisible to a screenshot —
it rides the local `drag:` block, which belongs in every deploy-time pass. A `.prettierignore`
now guards `e2e/` from manual reformats (second bite of the format-gate trap: a chair-run
`prettier --write` flipped the file's quote convention and severed a sleep-lint exemption
anchor; reconstructed exactly, then configured away per the trap→config law).
