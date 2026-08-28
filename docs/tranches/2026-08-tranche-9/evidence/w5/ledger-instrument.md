# T9-W5 §5.6 — THE LEDGER INSTRUMENT

Five rows, all wired, each with its decision named and its canary banked. Measured
2026-08-28 against `4dd9ec9c` plus the working tree — two other waves were landing in
`web/frontend/src/**` while this ran, and the one row that reads that tree says so.

Fence: `scripts/ledger-diff.mjs`, `docs/tranches/LEDGER.md` (arm annotations only — the
diff is 22 insertions and zero deletions, so no row's content moved), and this directory.
No deploy act of any kind; no network traffic at all.

| # | Row | Decision | Where |
|---|-----|----------|-------|
| 1 | PROBE arm populated | **TWO REGISTRATIONS, scope widened to every row** | `PROBES`, `armProbes` |
| 2 | Currency arms widened | **10 rows → 171, and the figure is printed, not claimed** | `armFoldTargets`, `armDuplicateHomes`, report |
| 3 | CH-64 one-home arm | **LANDED** — PRECEPTS §2's "no arm yet" discharged | `CLASS_HOMES`, `armOneHome` |
| 4 | Live-region police | **LANDED, with a two-row dated ADMISSION that self-clears** | `LIVE_REGION_ADMITTED`, `armLiveRegions` |
| 5 | Sealed-tranche freeze law | **INSTRUMENTED** — every sealed tranche re-diffed on every run | `trancheDiff`, `armFreeze` |

Canaries: `ledger-canaries.txt` — thirteen plants (A, A2, B–K, M), every exit read bare,
`LEDGER.md` and `ledger-diff.mjs` both verified byte-identical to their pre-canary copies
after the battery and again after M. Green run whole: `ledger-diff-green.txt`. The one
measurement that decided a row AGAINST widening: `cites-scope-ablation.txt`.

---

## 1 · The PROBE arm — it stands, and now it reads something

V5-C9 adjusted the finding to "stands, populates on registration", and the population was
the whole problem. At entry `PROBES` held exactly one key, `CH-16`, and CH-16 had CLOSED
at T7-W0 — so the arm iterated §1's four open rows, matched none of them, and returned
clean without ever opening a file. Structurally sound; vacuous by population. It is the
exact shape this script was rebuilt to stop printing.

**Two registrations, and a scope change that makes a registration outlive its row.**

- **CH-69** — new, and it is the row's own trigger mechanised. CH-69 asserts an exposure
  that the tree can answer: `dealt_killer_boards_are_unique_by_construction` sweeps
  Easy/Medium only, leaving Hard — the tier that digs to 17 givens, where the bogus UNSAT
  bites — untested. The row's stated trigger is "T9-W6 takes the root-cause, or any
  Hard-tier uniqueness test lands first"; the probe evaluates the second arm by reading
  that test's own chunk of `csp-solver/tests/killer.rs` for `Difficulty::Hard`. Pass or
  fail, Hard entering that sweep means the row has to move, and the banked repro
  (`evidence/w4/killer-soundness-repro.rs`) is what it moves on.
- **CH-16** — RE-POLARISED rather than left as dead weight. Its row now reads
  CLOSED-landed on the claim that both halves landed, so the probe guards the CLOSURE:
  every game spec carries the shared codec, or "wired in all five game specs" has stopped
  being true. A closed row whose cure was reverted is the same
  record-cannot-verify-record disease pointing the other way, and this estate has had two
  of them (T8-R13, T8-R15).
- **Scope: `ledger.open` → `ledger.rows`.** A probe keyed to a row that later closes would
  otherwise fall silent at the exact moment it becomes a regression detector.
- **A registration whose row is gone now REDs.** Otherwise the registry is a second way to
  be vacuous: the arm reads clean because it read nothing.

**The vacancy that remains, named in the arm's own comment rather than papered.** §1's
other three rows carry no probe because no tree read answers them — CH-65 is a claim about
what a Playwright option does to a live page; T8-R05 is a timing claim wanting a device
this estate does not have (M19/M06, and W8's owner pass is its evaluator); T8-R08 is about
a session's runtime credit ledger. A probe registered for any of them would be a grep
pretending to be a measurement.

Canaries F, G, H.

## 2 · The currency arms — 10 rows to 171, and the eighteen become visible

**The ~6% derived, not inherited.** Before this wave the verdict-bearing arms reached §1's
4 rows (TERMINALITY, and PROBE if it had matched anything) plus the terminal rows still
under WATCH that CITES scopes to — 6 of them. Union 10 of 171 = **5.8%**, which is the
figure the wave text calls "~6%". Everything else in the ledger was outside every arm.

**What that bought.** Eighteen rows wear a bare `FOLDED → <wave>` promise with no
discharge verb — U-11, Q-4, D-1…D-5, B-1, O-1, O-7, O-10, T7-R01, T7-R04, T7-R06, T7-R07,
T7-R09, T7-R14, T7-R15. Fifteen name a wave of a tranche that has since sealed; the other
three name a bare `W0` that silently re-points at whatever tranche is current, which is a
rot of its own. Every one of them lives in a terminal section where nothing looked. The
estate has already caught two folds
by hand that sealed with nothing landed — P-5e's SSIM probe, ordered and never run;
CH-53's stack sampler, closed on a lane deleted the same tranche. Both were found by a
person re-reading the file.

**The widening, arm by arm:**

- **FOLD-TARGET (new, 75 rows, 43.9%)** — every wave any row names must resolve to a wave
  record in the tranche it names. Scope is the whole row line, not the state cell,
  because the ledger's 2-column tables (§4, §5) carry their disposition in the only cell
  they have and a state-scoped arm cannot see U-11's fold at all — which is the
  difference between counting 17 of the eighteen and counting all 18.
- **DUPLICATE (4 → 171, 100%)** — was open-versus-terminal; now every row against every
  other. A row re-tabled into a second terminal section is the same defect in a quieter
  costume: two states, two cites, and no way to say which one a close reads.
- **PROBE (0 → 2 rows that actually match)** — §1 above.
- **ONE-HOME (new, 171 rows, 100%)** — §3 below.
- **TERMINALITY held at §1 by design.** Its subject is the accretion disease, which is an
  OPEN-row disease: a terminal row's home IS its discharge, and firing on the eighteen
  would be reading the ledger's own structure as a defect.
- **CITES held at 10, and the decision is a measurement.** Widened to all 171 the arm
  produces four findings and three are artifacts of the terminal register — banked whole
  in `cites-scope-ablation.txt`, re-derivable by replacing one line. CH-12 *quotes* the
  dead cite `error.rs:63-64` as the very defect its own restamp names, and reds for
  writing its correction down; its `CspError::aborted` cite points at the constructor
  while the literal token lives on the doc line above it; CH-53's
  `desktop.undoBurst.ciMinPctOfCeiling` is a JSON path, not a token that appears anywhere
  as written. An arm that punishes the freeze law's dated-block idiom teaches people to
  stop writing the correction down.

**Union: 171 of 171, 100%**, printed by the gate itself in a CURRENCY COVERAGE block with
the per-arm reach beside it, so the claim is re-derived at every run rather than asserted
once here.

One latent defect fell out of the widening and is cured in the same act: a bare `W<m>`
resolved against `--tranche`'s argument rather than against the estate's newest tranche,
so `ledger-diff --tranche <a sealed tranche>` read today's bare `W8` as a wave of a
campaign that closed months ago and RED on it. `--tranche` chooses the corpus a
completeness diff runs against; it does not move the living ledger into another era.

Canaries C, D, E.

## 3 · The one-home arm — PRECEPTS §2's own "no arm yet"

PRECEPTS §2 records the law and then records the hole in its enforcement column: "The
sibling-mint half — a NEW id whose subject is an existing row's — has no arm yet; it is
T9-W5's, and until it lands the law is convention plus the retired row's own detector
clause." That clause is now an arm.

`CLASS_HOMES` registers a class by its home id, its subject, and an exact-match list of
rows permitted to carry the subject without naming the home. A row that carries the
subject, is not the home, is not a registered pointer, and does not name the home is a
sibling mint — whatever id it wears. Naming the home is what makes a row a pointer, which
is §6's own rule stated back at it: "a pointer at CH-16, CH-53 or CH-59 is a pointer, not
a second row."

**CH-64 is the only registration, and the pointer list is EMPTY as a measurement**: the
word `burst` occurs on exactly one line of `LEDGER.md`, CH-64's own. A class home that the
ledger no longer tables REDs too, so the registry cannot rot into a no-op.

Canaries B, I. Canary I is worth reading twice: re-keying the home to `CH-964` reds
TWICE — once because no row is tabled for `CH-964`, and once because CH-64's own line then
reads as a row carrying an unowned class's subject. That is the law working from both
ends.

## 4 · The live-region police — wired, ADMITTED, self-clearing

The rule, exactly: an element whose OWN tag carries `aria-live` (or role status/alert/log)
AND a birth condition (`v-if`/`v-else-if`/`v-else`/`v-show`) AND non-empty initial
content — literal text, after interpolations and conditional children are stripped, since
neither is present at birth. A live region announces MUTATIONS to itself; born complete,
there is nothing to announce and the region's whole office goes unperformed while the
markup reads correct.

The census over `web/frontend/src` at this tree: **eight live regions, two violate** — the
violating pair is the arm's own output with the admissions emptied (canary M), the other
six read by hand at the cited lines.

| site | verdict |
|---|---|
| `GameControlPanel.vue:1017` `players-status`, `v-if` + "connecting…" | **VIOLATES** |
| `GameControlPanel.vue:1100` `players-alone`, `v-if` + "you're the only one on this board." | **VIOLATES** |
| `GameControlPanel.vue:1042` `players-roster`, `role="log"` | green — no birth condition on the element; content is a `v-for` |
| `MarginNote.vue:57` `role="status"` + `aria-live` | green — the correct idiom: unconditional region, `v-if` on the CONTENT |
| `GameGallery.vue:937` `gallery-live` | green — unconditional, interpolated content |
| `GameGallery.vue:943` `gallery-guard-live`, `role="alert"` | green — unconditional and deliberately empty until the guard arms |
| `SolverErrorNote.vue:43` `role="alert"` | green — unconditional on its own tag; the component is what mounts |
| `AnswerKeyLaminate.vue:204` `role="status"` | green — unconditional, interpolated content |

The estate's own comment at `players-status`'s site already named the defect at T7-W2:
"the one polite region that would have spoken is `v-if`'d OUT the moment the room comes
up — the live region left the DOM exactly when people started arriving."

**DECISION: ADMITTED, with an expiry and a ratchet — not born-RED, and not a carve-out.**
`web/frontend/src` is outside this lane's fence and T9-W3 owns the cure (its gate row
reads "live regions speak (players-status/-empty/-roster 0→1)"). Shipping the arm red
would make `deploy-gated.sh` refuse a deploy under the words "the living ledger is not
current", which would be a lie about which subject failed, and a gate that sits red for a
whole tranche teaches people to stop reading its exit code. So the two sites are admitted
by name and date, and the admission is built to die:

- every run prints the admissions IN FULL, so no run can show a clean-looking green over
  them;
- an unadmitted violating site REDs on contact — the police function is live today;
- an admission whose site stops violating REDs as **SPENT**, so W3's cure and the deletion
  of its admission land in the same commit. That is this estate's own same-commit law
  (a ruling lands with its enforcing config), pointed at itself.

Canaries J, K — and both are real-tree plants that touch no file under `web/frontend/src`:
removing an admission reds on the live site at its true line, and re-pointing one at a
clean site reds as spent.

## 5 · The freeze law, instrumented

PRECEPTS §2, half (2): "A gate run against a sealed tranche reads THAT tranche's corpus,
at the shape it sealed with." The mechanism existed — `--tranche <dir>` — and nobody ever
ran it, which is the whole of BAL-03's history: T8 lawfully restamped CH-45's line, the
only `BAL-03` token in the living ledger went with it, T7's own gate turned RED at a
commit nobody would ever run it at, and it stayed red, unseen, for two closes.

The completeness diff is now a function of one tranche, and the **FREEZE** arm runs it
over every sealed tranche on every invocation, each against its own tranche-time corpus.
Tranches with no audited row set are SKIPPED BY NAME, not turned into a FATAL: the pre-T5
estate closed inside its own READMEs and never wrote one.

At this tree, printed in every run:

```
docs/tranches/2026-07-tranche-2    SKIPPED — no audited row set (closed inside its own records)
docs/tranches/2026-07-tranche-3    SKIPPED — no audited row set (closed inside its own records)
docs/tranches/2026-07-tranche-4    SKIPPED — no audited row set (closed inside its own records)
docs/tranches/2026-08-tranche-5    220 audited rows · 10 corpus files · 0 orphan
docs/tranches/2026-08-tranche-6     36 audited rows · 5 corpus files · 0 orphan
docs/tranches/2026-08-tranche-7    145 audited rows · 11 corpus files · 0 orphan
docs/tranches/2026-08-tranche-8     17 audited rows · 3 corpus files · 0 orphan
```

Canary A2 re-enacts BAL-03 exactly: rename the two `BAL-03` tokens in `LEDGER.md` and the
gate reds with **one** finding, on T7, at
`docs/tranches/2026-08-tranche-7/DISPOSITIONS.md:200`, with every other sealed tranche
still at zero. The class cannot recur unseen.

Four extra tranche diffs per invocation cost nothing worth measuring: the whole gate,
sweep and self-test included, runs in **0.09 s**.

## Wiring — no seam needed

Both existing invokers already pass `--assert-state`, so every new arm is live without
editing a file outside this fence:

- `.github/workflows/ci.yml:1422` — `--require-ledger --assert-state --verify-cites --self-test`
- `scripts/deploy-gated.sh` — the record-currency arm, same three flags (the refusal
  message quotes the command at `:441`)

FREEZE runs unconditionally (it is a completeness arm, like ORPHAN); it is skipped only
when `--tranche` names a sealed tranche, since that run IS the sealed-corpus read.

## Gates at return

| gate | exit |
|---|---|
| `node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test` | **0** — 19 self-test arms, each RED on its violation and GREEN on its control |
| `node scripts/ledger-diff.mjs --tranche docs/tranches/2026-08-tranche-7 --require-ledger --assert-state --verify-cites` | **0** |
| `npx vitest run` | **0** — Test Files 57 passed (57), Tests 735 passed (735) |
| `npm run lint` (prettier, repo-pinned, covers `../../scripts/`) | **0** |
| `npm run lint:lanes` | **0** |
| `node scripts/check-doc-truth.mjs --self-test` | **0** |
| `node scripts/check-doc-truth.mjs` | **1** — 3 RED, none of them this lane's: see the handoff |

## Handoffs

- **T9-W3 owns the two live-region cures**, and its commit must also delete their rows
  from `LIVE_REGION_ADMITTED` in `scripts/ledger-diff.mjs` — the gate REDs as SPENT
  otherwise. Exact sites: `web/frontend/src/games/shared/GameControlPanel.vue:1017`
  (`players-status`) and `:1100` (`players-alone`). The shape of the cure the rule wants:
  the region lives unconditionally and its CONTENT is the conditional half, which is what
  `MarginNote.vue` already does.
- **`check-doc-truth` is 3 RED at this tree and none of it is §5.6's.**
  `root-readme-e2e-counts` and `e2e-total-arithmetic` moved because the concurrent
  viewport wave's `e2e/viewport-law.spec.ts` is in the tree (437/24 derived against
  README's 409/23, and 508 against 480); `ci-lane-count` moved because §5.3's dist lane
  took ci.yml to 18 jobs against README:112's "seventeen". Both belong to the lanes that
  moved the numbers.
- **CH-69's row can gain a second evaluable trigger free**: the banked repro compiled as
  an `#[ignore]`d test under `csp-solver/tests/` would let the probe read a compiled
  subject rather than a difficulty list. Out of this lane's fence (`csp-solver/`).
