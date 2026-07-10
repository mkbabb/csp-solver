# A24 — THE COMPLETENESS CRITIC (lane 32 of 32)

Read-only meta-audit. Read all 31 sibling reports in `audit32/` + the pass-1 corpus
(`pass1/pass1-agglomeration.md`, R1–R8, protos, critiques) and ran my own verification probes
against HEAD `3b75eca2`. The question this lane answers is not "what did the tree get wrong" but
"what did the *audit* not look at." Every gap below carries: the modality missed, who should have
caught it, and what the tranche-III synthesis must add.

Bottom line: the 31 lanes are **deep but narrow-in-a-few-axes and heavily redundant**. Five whole
modalities were never probed (CI health, record git-bloat, the two live sibling repos'
consumption, a real test-suite run, live runtime-perf), one unifying design lane raced past its own
sibling, and the design lanes' live-probe substrate was unreliable. Coverage of the *code tree* is
excellent; coverage of the *system around the tree* (CI, the record itself, the two external
consumers, the deploy, live behavior) is where the holes are.

---

## Part 1 — MODALITIES NOT PROBED (the real gaps)

### G1 — CI health / cost / lane-growth: nobody audited `ci.yml` as a subject
`.github/workflows/ci.yml` is **545 lines, 9 `runs-on:` lanes** (I counted this session:
`grep -c runs-on ci.yml` → 9). CLAUDE.md and the tranche record both still say **"8 lanes"** — the
e2e lane landed at W0 (A1 §R6) making it 9, and no lane reconciled the count or asked whether the CI
is growing unboundedly. A18 §ROW-3 came *closest* — it found real CI perf blind-spots (no GAC A/B
bench, zero futoshiki bench, node-count invariants unguarded) — but framed them as *missing*
coverage to add, never as CI *cost/duplication* to trim. No lane measured wall-clock CI duration,
looked for redundant build steps across the 9 lanes (`rust`, `py-compile`, `py-runtime`, `wasm`,
`twiggy`, `lint`, `frontend`, `e2e`, iai each re-compile overlapping crate graphs), or asked whether
the `abi3`/`--generate-stubs` adoptions (A20, pass1 R4/R5) will *add* lanes the CI can't afford.
- **Who should have caught it:** A18 (owned CI benches) or A20 (owned the dep-graph that drives CI
  compile cost) — neither treated the CI itself as an auditable artifact; and there was no dedicated
  CI-structure lane in the 32-lane fan-out at all.
- **Synthesis must add:** a CI-topology row — reconcile the 8→9 lane-count doc drift; a compile-graph
  dedup pass (shared build cache across `rust`/`py-compile`/`wasm`); and a *cost budget* for the
  pass-2 adoptions (abi3 collapses the py-matrix to one wheel — a CI *win* A20 noted but never
  scored against the record's "8 lanes" claim).

### G2 — the tranche-record's own maintainability: 47 MB, 287 files, 115 PNGs, unflagged
`du -sh docs/tranches` → **47M**; `find … | wc -l` → **287 files**; tranche-2 alone is **44M**, of
which **115 are PNG** screenshots committed into git history (`find … | sed 's/.*\.//' | sort |
uniq -c`: 115 png, 54 md, 39 json, 8 diff, 8 mjs, 5 cjs, 2 py). The audit mined the record's
*content* exhaustively — A1/A2/A3 recap every prompt, A13/A14 delineate every deferred row, R7
mines it — but **no lane flagged that the record is a 47 MB git-weight liability** carrying 115
binary evidence PNGs into permanent history. A4 audited *doc-truth* (stale numbers, C12–C14) and
*README shape* but not record *bloat*. This is exactly the "tranche-record's own maintainability"
modality named in this lane's brief, and it went untouched.
- **Who should have caught it:** A14 (chronic/record mining) or A4 (precepts/doc-hygiene).
- **Synthesis must add:** a record-hygiene decision row — move the 115 evidence PNGs (and the 44M
  tranche-2 evidence tree) behind `.gitignore` / into an artifact store, or `git-lfs`, or prune to
  the load-bearing few; author tranche-III's *own* evidence dir under that policy from the start so
  it doesn't add another 40M.

### G3 — pencil-boil sibling repo health: audited as a dependency, never as a repo
`@mkbabb/pencil-boil@^0.7.0` is the app's animation brain and the **live subject of F6's
keyframes-vs-pencil-boil decision**. A19 audited the *installed* 0.7.0 surface (21/33 exports used,
zero runtime deps) — good — but the sibling **source repo exists locally**
(`/Users/mkbabb/Programming/pencil-boil`, confirmed this session) and **no lane opened it**: is the
local repo ahead of the published 0.7.0? does it carry the `useCelestialSun`/sun-glyph export the
chronic C11/M4 fold (A14) is gated on? is the `resolveEasing`/`sequence` API F6 leans on stable
across a coming 0.7→0.8 bump? A19 §3 and F6 §3 both *decide against* re-adopting keyframes.js partly
on pencil-boil's sufficiency, but neither verified that claim against pencil-boil's actual source —
only against its npm `package.json`.
- **Who should have caught it:** A19 (FE library lane) — it had the dep in scope and stopped at the
  installed artifact.
- **Synthesis must add:** a pencil-boil sibling-health note — pin the exact rev the app builds
  against, confirm the M4 sun-glyph export gate (does the ≥2-consumer trigger's *supply* side
  exist?), and record whether the F6 decision survives a pencil-boil version bump.

### G4 — the real bbnf sync-gate was never RUN against the proposed restructure
The single largest correctness risk in the pass-1 restructure (P2 py-prune + P5 13-symbol
demotion + S1 isomorphic excise) is that it silently breaks bbnf-lang's vendored consumption.
bbnf **is present locally** (`/Users/mkbabb/Programming/bbnf-lang/scripts/sync-csp-solver-vendor.sh`
exists, confirmed) and A21 re-verified `ImplicationConstraint` is bbnf-live — but **no audit32 lane
ran `sync-csp-solver-vendor.sh --check/--verify`** against the combined diff. Pass-1 explicitly
punts this to pass-2 (`pass1-agglomeration.md` R3, charter lane P2-L2: "run the *real* script … with
the combined diff"). So at the close of *this* 32-lane audit the restructure's bbnf-safety is
**still unverified** — it rests on per-symbol grep censuses, not on the gate that actually guards it.
- **Who should have caught it:** A21 (module-structure BE) — it verified the *symbols* but not the
  *gate*; it had bbnf in scope and grepped it, one step short of running `--verify`.
- **Synthesis must add:** either run the gate now (worktree'd bbnf clone, never push origin) and bank
  the transcript, or mark the entire restructure GO **conditional on** the P2-L2 gate — do not let
  the agglomeration's 64% convergence read as "bbnf-clear."

### G5 — morph, the *other* external consumer, is a census blind spot nobody flagged
A20 (headline finding: kill `hungarian`, hand-roll Kuhn-Munkres) and A15 both name **morph /
bbnf-buddy** as the live consumer of the `AssignmentBuilder`/LAP surface and the wasm `assignment`
COP (A20 §Reachability: "its only real consumer is the external morph/bbnf-buddy crate"). morph was
excised to `github.com/mkbabb/morph` and **is NOT on this machine** (`ls /Users/mkbabb/Programming/
morph` → absent, confirmed). So: the P5 13-symbol pub-demotion census verified *bbnf* clean but
**cannot locally verify morph**; the `hungarian`→hand-rolled swap assumes morph's LAP call site is
unaffected; the isomorphic excise (S1) assumes morph doesn't use the wasm `Csp` mirror. Every one of
these rests on "morph consumes via crates.io 0.2.0/0.3.0 and the census is complete" — the same
unproven not-on-PyPI-style premise crit-spec flagged for py (C3), but for morph, and **no lane named
it**. Pass-1's R1 residual covers the *npm tarball* blind spot; the *morph-crate* blind spot has no
residual row.
- **Who should have caught it:** A20 / A15 (they *named* morph as the consumer) or P5 (ran the
  census and scoped it to bbnf + repo).
- **Synthesis must add:** a morph-consumer residual — fetch `github.com/mkbabb/morph`, grep its
  csp-solver call sites against the demotion + hungarian-kill + isomorphic-excise diffs, before any
  of the three lands. Treat it as R1's twin.

### G6 — no lane actually RAN the test suite at HEAD; the green baseline is taken on faith
Every structural lane trusts the doc-stamped counts (151/0/6 rust · 27/2 tests-py · e2e green).
**Not one lane ran `cargo test --workspace`, `pytest`, or `playwright test` at `3b75eca2`.** The two
reports that mention `cargo test --workspace` (A15, A5) cite it as a *mechanism* ("cargo test
compiles the examples"), not as a run they performed. A18 ran only `cargo run --example
gac_timing_probe`. So the entire audit's premise — "tranche-2 landed green, we're refining a
working tree" — is asserted, never re-observed. Given the pass-1 restructure will touch py + pub
surface + wasm, a *baseline* green run at HEAD is the floor the whole tranche builds on and it's
missing.
- **Who should have caught it:** A15/A21 (structural verification lanes) or a dedicated verify lane —
  the 32-lane fan-out had no "run the gates green at HEAD" lane.
- **Synthesis must add:** a one-line baseline row — run the three suites at HEAD, stamp the actual
  counts, and reconcile against the doc claims (A4 C12 already found the counts are stamped "this
  tree" not a SHA — a real run closes both gaps at once).

### G7 — felt-perf, the mandate's headline axis, has zero live measurement
The owner mandate leads with **performance**; A17 (FE perf) and F4/F6 (design) *all* disclose the
browser/DevTools was unavailable — "could **not** capture the live network waterfall timeline or
DevTools frame traces … all live facts are curl-derived" (A17 tail). So every felt-latency claim —
P1 cold-start, P2 size-switch 100–150ms hitch, P3 double-wobble — is **code-and-wire-derived, never
measured in a running browser**. There is no Lighthouse score, no TTI, no real frame trace, no
LCP/CLS. A23 drove Playwright headless (good for a11y/layout) but captured no performance timeline.
The perf audit is a *static* read of a *dynamic* property.
- **Who should have caught it:** A17 (FE perf) — it correctly *flagged* the gap but couldn't close
  it; the fan-out gave it no browser substrate.
- **Synthesis must add:** the felt-perf claims must be marked PLAUSIBLE-not-measured, and pass-2
  must land a real trace (the `chrome-devtools-mcp` skill exists in this harness — a driven-browser
  waterfall on cold cache would verify P1 and settle the P4 chunk-split's real cost).

### G8 — no security review under the new wasm-only topology
The tranche-2 abrogation *restructured the threat model* (server GIL/DoS class retired, everything
now in-browser) — a natural moment for a security pass, and there was **no security lane**. I
verified the FE is grep-clean of `v-html`/`innerHTML`/`eval` (zero hits this session), and A16
flagged `_headers`/CSP as "post-abrogation clean" — but nobody adversarially probed: the permalink
**base64 board-state decode** (`useUrlState.ts`, `toBase64Url`/`fromBase64Url` — untrusted input
into board reconstruction), the PWA precache poisoning surface, the CSP's completeness now that
`connect-src 'self'` and the wasm Worker are the whole attack surface, or the wasm error paths.
Grep-clean is reassuring; it is not an audit.
- **Who should have caught it:** unassigned — a `/security-review`-class lane was simply not in the
  32-lane matrix.
- **Synthesis must add:** a security row — at minimum an adversarial pass over the permalink decoder
  (malformed/oversized base64 → board injection / DoS) and a CSP completeness check, since the
  permalink + PWA are shipped product features on a static-only origin.

---

## Part 2 — OWNER ASK / SYNTHESIS DEFECTS

### G9 — F8 (the "one coherent move" design statement) was authored WITHOUT its own heart lane
F8 is the capstone: "the coherence spec the tranche-III authoring executes as ONE move," explicitly
consuming "all six sibling lanes." Its header states: **"no F7 file exists in `audit32/`."** But
`F7-heart-yoshi.md` **exists (14,602 B, same 15:15 timestamp)** — the two raced and F8 lost.
Consequence: the owner's design finding #3 (the heart, "in Yoshi's-Story language") is folded into
F8's design-system only via F2's *secondhand* one-line mention ("felt-refined heart … crest"), while
F7's dedicated treatment (the Yoshi-language stitch/plush/blush spec, the dark-mode `opacity .75 /
saturate .85` muddiness fix) never enters the unifying statement. The single artifact meant to make
the design coherent is itself incoherent with one of the four owner findings.
- **Who should have caught it:** F8 (it asserted a file's non-existence without listing the dir) —
  and the orchestration that dispatched F7 and F8 in the same wave without a dependency edge.
- **Synthesis must add:** re-fold F7 into F8's §2 tone table and §3 "belongs" list before treating
  F8 as authoritative; the gold-family verdict (§2) and the heart-crest moment (§3.1) are exactly
  where F7's heart spec belongs, and F8 built both without it.

### G10 — the design lanes' live-probe substrate was unreliable, and findings sit on mixed footing
The brief promised "a dev server runs at http://localhost:3000." A23 found `:3000` **connection-
refused** and the only live Vite on `:5173` belonging to a *different* project (`sci-report`); it
launched its own `:3210`. F6 and F4 both disclose "live browser probe unavailable this session."
Yet F1 and A23 *did* measure live pixels (F1's 5.53/5.77/5.11/5.79px float; A23's Playwright shots).
So the design findings rest on **mixed footing** — some pixel-measured, some pure code-citation —
and the audit never labeled which is which. (I re-probed `:3000` this session: it returns **HTTP
426 Upgrade Required** — a Vite HMR *websocket* endpoint answering a plain GET, i.e. the server the
brief meant may have been alive-as-a-socket but un-GET-able, which is *why* A23 read it as dead.)
- **Who should have caught it:** every design lane (F1–F7) should have stated its evidence basis;
  A23 flagged the dead-port situation but only for itself, not as a cross-lane validity caveat.
- **Synthesis must add:** before authoring, re-verify the code-only design claims (F4 SVG geometry,
  F6 transition timing) against a *known-live* instance; tag each design row live-verified vs
  code-inferred so the authoring wave doesn't ship a pixel fix that was never seen.

### G11 — deployed-vs-local truth asserted two ways, never reconciled
A17 (byte-identical `dist/` hashes local==live) and A23 ("sudoku.babb.dev is the post-tranche
build") assert the live site **is** the tranche-2 build. `MEMORY.md` (older) says "Live
sudoku.babb.dev is CF Pages static and STILL PRE-TRANCHE until the owner redeploys." A1 §3 records
WGATE "DEPLOYED to production." The hash-match evidence is strong and almost certainly right — but
**no lane reconciled the stale MEMORY note against it**, so a reader carrying the memory file
forward will believe the opposite of the audit. A one-line reconciliation would close it.
- **Who should have caught it:** A1/A2/A3 (prompt-recap lanes that read MEMORY) or A17.
- **Synthesis must add:** an explicit "live == HEAD build, MEMORY note superseded" line, or, if the
  hashes were coincidental, the actual redeploy status.

---

## Part 3 — CLAIMS TAKEN ON FAITH (verify before authoring)

### G12 — the wasm size-win figures were never rebuilt
A18 measured the *committed* lean pkg (90,602 B) — solid — but the **full-module 222,436 B** and
every **excision delta** (S1 isomorphic removal shrinks the full band; P5 removals) are
**expected-green, not measured**. Pass-1 itself kills the old 222,436/198,652/−10.7% figures as
"re-measure in the authoring wave" (`pass1-agglomeration.md` K10). No audit lane rebuilt `pkg/` to
confirm any size claim. Owner: A18 (measured what existed, didn't rebuild). Synthesis: mark all
excision size-wins as projected; rebuild is a pass-2/authoring gate.

### G13 — futoshiki engine correctness is unprobed
A18 §ROW-3b: "zero futoshiki bench … a shipped game (N=4–7) has no criterion perf guard at any
size." Beyond perf, **no lane audited futoshiki generation/uniqueness/validation correctness** —
CLAUDE.md's claim "Futoshiki's uniqueness check is sound after the kernel's AC-3 trail-push fix" is
carried, not tested. A23 exercised futoshiki as a *user* (a11y names, failed-solve) but the
engine-level correctness (does N=7 generate uniquely? does the inequality-constraint propagation
hold?) is untested in this audit. Owner: A18 (perf) named the bench gap; nobody owned the
correctness gap. Synthesis: a futoshiki correctness+bench row (pairs with A18's node-invariant CI
smoke-lane proposal).

---

## Part 4 — META-OBSERVATION: redundancy traded for breadth

The 32-lane fan-out has **heavy convergent redundancy**, which is good for confidence but signals
the breadth was under-diversified. The single `CelebrationStar.vue:123-134` star/text collision is
independently re-derived by **four** lanes (F2, f3, A23, F8); the isomorphic excise by **three**
(pass1 P1, A15, A21); the apiError twins by **three** (A13, A16, A22). Meanwhile the five modalities
in Part 1 got **zero** lanes each. Several A-lanes (A21, A22, A15) spend their first third
*re-verifying pass-1* rather than opening new ground — valuable for trust, but it means the audit's
marginal 10th–20th lane bought confirmation, not coverage. The tranche-III authoring should read the
convergence (64% pass-1, high agreement here) as *earned on the code tree* and *unearned on the
system around it* (CI, record, siblings, deploy, live behavior, security).

---

## Gap ledger (ranked by materiality)

| # | Gap (modality missed) | Who should've caught it | Synthesis must add |
|---|---|---|---|
| G4 | Real bbnf sync-gate never run vs the restructure diff | A21 | Run `--verify` now, or mark restructure GO conditional |
| G5 | morph external-consumer census blind spot (not on machine) | A20 / A15 / P5 | Fetch mkbabb/morph, grep call sites vs demotion+hungarian+isomorphic diffs |
| G6 | No test-suite run at HEAD; green baseline on faith | A15 / A21 / (verify lane) | Run rust+py+e2e at 3b75eca2, stamp real counts |
| G9 | F8 design-system authored without its own F7 heart lane | F8 / orchestration | Re-fold F7 into F8 §2/§3 before F8 is authoritative |
| G1 | CI health/cost/lane-growth (8→9 drift, no dedup) unaudited | A18 / A20 | CI-topology row: reconcile count, dedup compile graph, budget pass-2 lanes |
| G7 | Felt-perf, the headline axis, has zero live measurement | A17 | Mark PLAUSIBLE; land a driven-browser cold-cache trace |
| G8 | No security review under the new wasm-only topology | (missing lane) | Adversarial permalink-decode + CSP-completeness pass |
| G2 | Record git-bloat: 47M/287 files/115 PNGs unflagged | A14 / A4 | Record-hygiene policy: LFS/gitignore evidence, prune, apply to T-III |
| G3 | pencil-boil sibling repo health (source, not npm) | A19 | Pin rev, confirm M4 sun-glyph export gate, F6-decision durability |
| G12 | wasm excision size-wins never rebuilt | A18 | Mark projected; rebuild is an authoring gate |
| G13 | Futoshiki engine correctness/bench unprobed | A18 | Correctness + criterion-bench row |
| G10 | Design live-probe substrate unreliable; mixed footing | F1–F7 / A23 | Tag each design row live-verified vs code-inferred; re-probe on live |
| G11 | Deployed-vs-local truth asserted 2 ways, unreconciled | A1 / A17 | One-line "live==HEAD, MEMORY superseded" |

*Report by A24, the completeness critic. Every gap is a modality the other 31 lanes did not open,
verified against HEAD `3b75eca2` this session (CI 9 lanes/545 L; docs/tranches 47M/287 files/115
PNG; pencil-boil + bbnf local, morph not; F7 present despite F8's denial; :3000 → HTTP 426).*
