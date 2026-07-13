# r2-mike-style-spec — the per-doc rewrite contract

DESIGN-PROSE LENS (Fable). Subject HEAD 65425697. Every anchor `file:line`. This is the
contract the docs wave executes; a writer who has read only this file plus
`/Users/mkbabb/Programming/sci-report/reports/style/MIKE-STYLE.md` (and its sibling
`GENERAL-STYLE.md`) can execute it end to end.

Round 1's `r1-doc-drift.md` catalogued the version-table drift, the `CONTRIBUTING.md` dangle,
and the full meta-leak census (its Probe blocks are the enforcement grep). This lane does NOT
re-tread that inventory line-by-line; it VERIFIES it holds at HEAD (it does — probes below),
and adds the register layer r1 only gestured at: the copula/correctio/editorializing moves,
the em-dash budget per doc, and the root-README section-by-section refinement the owner asked
for ("quite good, but can be refined").

---

## 0. Corpus-wide register law (applies to every doc; MIKE-STYLE + GENERAL-STYLE)

These are the moves every rewrite makes, stated as a target not a prohibition. Register band
for this corpus: **unpretentious-academic** (READMEs, plan docs) per GENERAL-STYLE
"Calibration spectrum" — domain verbiage welcome, lilt only where the material invites it,
5% ceiling. CHANGELOGs and hard-gate/CI text sit one band lower: **pure technical**, no lilt,
no borrowed foreign phrase.

1. **Copula plain.** Let "is" be "is." Purge "acts as / serves as / stands as." One live
   instance: `docs/bbnf-integration.md:16` "The solver acts as a dataflow fixpoint engine" →
   "The solver is a dataflow fixpoint engine." (grep below returns exactly this + benign
   substring hits.)

2. **Correctio (epanorthosis) banned.** Drop every "not X, but Y" / "not merely Y" scaffold;
   assert Y directly. Live instances to purge (verified at HEAD):
   - `docs/benchmarks.md:34` "verified sound, not merely fast" → "verified sound." (the
     soundness evidence that follows carries the point; the speed contrast is puffery).
   - `docs/animation.md:52` "A finite 3-beat timeline, not an infinite wiggle swarm" → "A
     finite 3-beat timeline." (the beat description that follows IS the substance).
   - `docs/animation.md:127` "and was deleted, not left undocumented" → "and was deleted."
     (defending against an imagined critic — cut the defense).
   - `README.md:119` "first-party … not an inherited scratch harness" — this one is a factual
     provenance contrast, not empty correctio; keep the fact, restate without the scaffold:
     "first-party, from the committed `gac_timing_probe` example (`ede25188`)." Drop "not an
     inherited scratch harness" (the provenance already reads first-party).
   - `docs/benchmarks.md:30` "an accepted tradeoff for the aggregate win, not a regression to
     fix" → "an accepted tradeoff for the aggregate win." KEEP if the writer judges the "not a
     regression" disambiguation load-bearing for a reader who'd otherwise file a bug; prefer
     the cut.
   - Left alone (genuine factual disambiguations, not correctio): `docs/benchmarks.md:16`
     "a soundness gate, not the source of the timing rows"; `docs/algorithms.md:22` "not the
     entire constraint set"; `docs/optimizations.md:9` "not the revision work itself";
     `docs/sudoku.md:59` "(not AC-3 — see below)". These contrast two real referents; they
     stay.

3. **No editorializing / superlative-without-a-number.** Replace the claim with the evidence.
   - `docs/bbnf-integration.md:65` "the single biggest codegen win" → name the mechanism, drop
     the ranking, or cite the figure. Suggest: "the dispatch table is the codegen win for
     grammars with wide alternations."
   - `docs/bbnf-integration.md:54` "This is the critical optimization for lexical-level rules"
     → "Lexical-level rules (identifiers, numbers, string literals) take this path."
   - `docs/benchmarks.md:24` "(deeper than the retired figure implied)" — comparison
     sentiment; the numbers already show the depth. Cut the parenthetical, keep the numbers.

4. **Em-dash discipline.** GENERAL-STYLE: unspaced, and "a paragraph carrying more than one
   em-dash is almost always over-punctuated." The `--` ASCII double-hyphen used throughout
   `docs/algorithms.md`, `docs/optimizations.md`, `docs/bbnf-integration.md`, `docs/benchmarks.md`,
   and `csp-solver/README.md` renders as spaced-em typography and reads as the same over-punctuation;
   it must be thinned to real sentences or unspaced em-dashes, not a global `--`→`—` swap.
   Per-doc budgets in §2.

5. **No process narration in product prose (owner ban).** The tranche/wave/gate-code/campaign/
   muster references are the highest-cardinality defect (r1-doc-drift §"Meta-language leaks").
   Every stamp becomes plain `measured at <sha>, <host>, <date>`; every inlined `docs/tranches/**`
   path is deleted (the fact it cites stays, the campaign provenance goes). Enforcement grep in
   §Probes must return zero across the shipped product docs after the wave.

6. **Overpunctuated-fragment / staccato:** none found in the corpus (clean). Keep it clean.

7. **Lilt ceiling.** The corpus is nearly bare of lilt (correct for the band). The two live
   florid touches — `docs/animation.md:19` "the law every animated value is audited against"
   and the pencil-boil README's "motion reads as re-tracing with analog touch" (line 44) —
   are within budget and on-idiom ("touch" is exactly the basketball/jazz sense MIKE-STYLE
   endorses). Keep both. Do NOT add lilt to hit 5%; it's a ceiling, not a quota.

---

## 1. Verification of r1's census at HEAD (this lane's confirm pass)

All confirmed live at HEAD 65425697:

- **Version-table drift** (r1 P1 ×2): `csp-solver/Cargo.toml` and `csp-solver/wasm/Cargo.toml`
  both `version = "0.4.0"`; `wasm/pkg/package.json` `0.4.0`; `web/frontend/package.json`
  `"@mkbabb/pencil-boil": "^0.8.1"`. Root `README.md:113-115` still says crate `0.3.0`, wasm
  `0.2.0`, pencil-boil `^0.7.0` — three wrong rows. `csp-solver/README.md:24` "both at `0.3.0`
  — published"; `:32` install `= "0.3"`. CONFIRMED.
- **`CONTRIBUTING.md` dangle** (r1 P1): `README.md:139` links `./CONTRIBUTING.md`; `git status`
  shows `D CONTRIBUTING.md` (staged deletion, absent on disk). CONFIRMED.
- **e2e count** (r1 P3): `README.md:91` "43 Playwright tests"; actual 44. CONFIRMED.
- **`^0.7.0` pencil-boil pin drift is TWO surfaces, not one:** `README.md:115` AND
  `docs/animation.md:6`. r1 named the table row; the animation-doc dep line is the second and
  must move to `^0.8.1` in the same pass.

NEW truth-rows this lane adds (not in r1):

- **`csp-solver/wasm/README.md:4` asserts "`0.4.0` on npm."** The published npm tarball r1
  reasoned about is `0.2.0` (the `0.4.0` bump is source-only, unverified on the registry — same
  open question r1 raised for the crate's crates.io state). A writer must NOT stamp "0.4.0 on
  npm" without confirming the registry; until confirmed, the honest line is "`0.4.0` source;
  the frontend file-links the lean build rather than the registry package." Family: version-table-drift.
- **pencil-boil README "Stage 3: frame scheduling" prose (lines 74–83) is a version behind its
  own CHANGELOG.** It describes the continuous-rAF model ("runs on `requestAnimationFrame`",
  "advances by elapsed `intervalMs`") with no mention of the 0.8.0 park (setTimeout-aimed beat
  boundary → one rAF → sleep) that the CHANGELOG (`pencil-boil/CHANGELOG.md:14-37`) headlines.
  The `vue.ts` module-map row (line 31) already says "beat-parked scheduler," so the doc
  contradicts itself. Truth-row: fold the park model into Stage 3. Family: doc-truth-lag.

---

## 2. Per-doc rewrite contract

Legend: **KEEP** (on-canon, leave), **TIGHTEN** (register edit, content stands),
**RESTAMP** (truth-row: fix the number/link), **SCRUB** (meta-leak purge), **CUT/MERGE**.

### 2a. `README.md` (root) — the owner's "quite good, but can be refined"

30 em-dashes / 143 lines (~1 per 5 lines) — the single most over-punctuated shipped doc after
`csp-solver/README.md`. The voice is already on-canon (contractions, precise verbiage, unspaced
em-dashes); the distance is **density + process residue**, exactly as r1-doc-drift's `register-density`
row found. Refinements, section by section:

- **Opening blurb (1–5):** KEEP. On-canon, tight, copula plain. "two hand-drawn games that ride
  it" is good idiom.
- **Directory structure (7–34):** KEEP. Reference scaffold, no prose to thin.
- **Architecture (36–46):** TIGHTEN. The "engine in brief" run-on (44) packs eight clauses and
  two em-dashes into one sentence; split into two. Line 46 "Depth lives elsewhere,
  single-homed" — keep, it's a good perimeter gesture.
- **The two games (48–55):** KEEP. Table + two tight paragraphs; the "45 boards, 32,533 B"
  figure coheres with the other surfaces (r1 verified).
- **Frontend (57–59):** KEEP; RESTAMP nothing here (fonts figure 17,708 B stands).
- **Testing (80–99):** SCRUB + RESTAMP. `:82` "tranche-III gate SHA `b4d7aedf` (T3-W12, the
  tranche close)" → "measured at `b4d7aedf`, Apple M5 Max, 2026-07-11." `:88` "the two
  Timeout-gated skips deleted at W4" → "27 passed, 0 skipped." `:91` RESTAMP 43 → 44.
- **CI (101–103):** SCRUB + **RELOCATE** (this is the owner's "refine"). The single 15-line
  paragraph recites all nine lanes, then packs gate SHAs, byte budgets (240/230/93 KB),
  222,436 B, 86,746 B, 90,602 B, and "T2-WGATE / T3-W6" wave codes into two sentences a product
  reader cannot act on. Move the byte-budget archaeology and the per-lane recitation to
  `docs/benchmarks.md` (budgets already live there, §Wasm artifact sizes) and leave the README a
  perimeter: "Nine CI lanes cover fmt+clippy, the Rust/wasm/py builds and tests, size budgets,
  the frontend typecheck+knip gate, e2e, and a callgrind instruction-count baseline. Budgets and
  measured sizes: `docs/benchmarks.md`." SCRUB "T2-WGATE re-measure," "T3-W6 engine-perf trim,"
  "beat-9," "T2-W3 stamp."
- **Deployment (105–107):** TIGHTEN. `:107` "the server-side solve hazard class is retired
  structurally, not mitigated" — the "not mitigated" is a mild correctio; assert directly:
  "Solving and generation never leave the browser, so there's no server-side solve path to
  secure." KEEP the PWA line (r1 verified PWA is current, not abrogated).
- **Published artifacts (109–115):** RESTAMP all three rows (crate 0.3.0→0.4.0 pending registry
  confirmation; wasm 0.2.0→ the honest source/registry split; pencil-boil ^0.7.0→^0.8.1). The
  `0.2.0—the SPA consumes the file:-linked lean build` cell (114) is a correctio-shaped em-dash
  cram; split the registry-vs-file-link fact into a footnote or a plain sentence under the table.
- **Performance (117–119):** SCRUB + TIGHTEN. `:119` one sentence, 3 em-dashes, "post-W4 A/B
  corpus," "pre-tranche figures … retired." Cut to two sentences, drop "post-W4," keep the
  12.6–12.7× headline and the disclosed minority cost (both stamped in benchmarks.md). Apply the
  §0.2 correctio fix to "not an inherited scratch harness."
- **Key conventions / Sources (121–135):** KEEP. Sources block is exemplary; leave verbatim.
- **Contributing (137–139):** RESTAMP the dangling link. Either restore `CONTRIBUTING.md` or
  inline the two-line flow ("Branch off master, add the change plus tests, open the PR; CI runs
  the same gates.") and route build/test recipes to `csp-solver/README.md` (which already carries
  them). Do NOT ship a link to a staged-deleted file.
- **Em-dash target for the README: ≤ 12** (from 30) — roughly halve, concentrated in Testing/CI/
  Performance where the build-log density lives.

### 2b. `docs/algorithms.md`

0 em-dashes but heavy `--` (ASCII) usage. KEEP structurally — this is the strongest doc in the
corpus, precise and copula-plain. SCRUB the two meta-leaks r1 named: `:14` "the false-UNSAT
regression the kernel wave closed -- `evidence/kernel-soundness-closure.md`" → "the false-UNSAT
regression closed by the trail-push fix (`evidence/kernel-soundness-closure.md` §0)"; `:47` "wrong
in the pre-tranche docs" → "wrong in the earlier docs"; `:49`,`:53` keep the evidence citations,
drop any wave framing. TIGHTEN the `--` dashes to sentences where they carry two clauses. The
"GAC on Sudoku — the corrected causal story" section (45–53) is good technical narrative; keep the
substance, scrub "pre-tranche."

### 2c. `docs/animation.md`

15 em-dashes / 143 lines. SCRUB `:46` (inlined `docs/tranches/2026-07-grand-uplift/waves/W8-…`
path) and `:70` "commit-stamped in the tranche evidence" — replace with a plain measured-at stamp
or drop. RESTAMP `:6` `^0.7.0` → `^0.8.1`. Apply §0.2 correctio cuts at `:52` and `:127`. TIGHTEN:
the cadence-band table (21–26) and layer table (87–99) are good; the prose between them carries
the em-dash load — thin to ≤ 8. KEEP the pencilConfig section (101–140), it's accurate reference.

### 2d. `docs/benchmarks.md`

10 em-dashes. The strongest evidence-discipline doc; the register issues are surgical. Apply §0.2:
`:34` "not merely fast" cut, `:24` "(deeper than the retired figure implied)" cut, `:30` "not a
regression to fix" prefer-cut. SCRUB the campaign-artifact framing: `:5` "pre-tranche number,"
`:10` "named campaign artifact under docs/tranches/2026-07-grand-uplift/evidence/" (keep the
evidence pointer as a plain relative path, drop "campaign"), `:14` "post-W4 corpus" + the
`T2-WGATE-gac-probe.md` inline path, `:37` "tranche-1's then-113-board corpus," `:44` "b4d7aedf
(T3-W12 gate)" → plain stamp, `:45` "the tranche-III adds," `:51` "T2-WGATE re-measure … W6 beat-9
… T2-W3 stamp." This is the destination for the root README's relocated CI byte-budget prose
(§2a). KEEP every number and every reproduction command verbatim — they're the load-bearing
content and they cohere.

### 2e. `docs/bbnf-integration.md`

0 em-dashes, clean structure. Apply §0.1 copula fix at `:16` ("acts as" → "is"). Apply §0.3
superlative fixes at `:54` and `:65`. SCRUB: none of the tranche/wave leaks land here (r1 didn't
flag it, confirmed). KEEP the six-pass walkthrough — it's the best domain-verbiage doc in the set,
"dataflow fixpoint engine," "sentential form," "powerset of ASCII ordered by subset inclusion"
are exactly the precise cross-domain usage MIKE-STYLE wants.

### 2f. `docs/optimizations.md`

0 em-dashes. KEEP nearly whole. One watch-item: `:60` "cryptographically robust" — "robust" is a
GENERAL-STYLE banned word, but this is its precise technical sense (SipHash IS cryptographically
robust) and a lone instance; GENERAL-STYLE explicitly exempts the lone precise use ("a lone
instance means nothing"). Leave it, or swap to "cryptographically strong" if the writer wants
zero banned-word surface. No meta-leaks. No correctio (`:9` "not the revision work itself" is a
real referent contrast, stays).

### 2g. `docs/sudoku.md`

1 em-dash. Nearly clean. SCRUB the single leak r1 named: `:92` "which the tranche landed" → "which
the kernel's AC-3 trail-push fix enables" (state the mechanism, drop the campaign). KEEP the rest;
the CSP-formulation and symmetry-group sections are strong.

### 2h. `csp-solver/README.md`

**51 em-dashes / 250 lines — the most over-punctuated doc in the corpus** (r1 didn't quantify
this; it's the heaviest single register defect). Most are the ` — ` clause-joiner used as a
default connective. TIGHTEN aggressively: target ≤ 20. Split the dash-joined clause pairs into
sentences; the structure-tree and API-list sections (56–174) legitimately use dashes as
definition separators (`add_variable(domain)` — description) and those may stay as a list idiom,
but the prose paragraphs (1–55, 176–246) must be de-dashed. RESTAMP `:24` "both at `0.3.0` —
published" and `:32` install `"0.3"` → 0.4.0 (pending registry confirm; if unconfirmed, say
"source at 0.4.0; crates.io at 0.3.0" honestly). SCRUB `:210` "the two Timeout-gated skips deleted
at W4" → "27 passed, 0 skipped." KEEP the API reference, GAC posture, and difficulty-casing
sections — accurate and useful.

### 2i. `csp-solver/wasm/README.md`

10 em-dashes. RESTAMP `:4` "`0.4.0` on npm" per §1 NEW truth-row (do not assert a registry version
you haven't confirmed). SCRUB `:46` the inlined `docs/tranches/2026-07-grand-uplift/waves/W6-deploy-c.md`
path → "the lean band budget is ≤ 93 KB, enforced by the twiggy CI lane" (drop the wave path; the
budget fact stays). TIGHTEN the two-em-dash sentences. KEEP the surface/build/consume sections.

### 2j. `csp-solver/CHANGELOG.md` and `csp-solver/wasm/CHANGELOG.md`

**Register band: pure-technical.** CHANGELOGs are the one place a reader WANTS the release
mechanics — but the campaign codes ("tranche-3 W3," "grand-uplift tranche W1–W12," "muster tranche
G release-engineering wave (G.W5 sub-wave A, CSC411-fold pass)") are internal process vocabulary,
not release facts, and the owner bans them from product surfaces. VERDICT: keep the version
headers and the semver rationale (the "pre-1.0 minor-bump class" reasoning at `csp-solver/CHANGELOG.md:38-40`
is genuinely useful and stays), but SCRUB the parenthetical wave codes from every `## X.Y.Z`
heading and prose line r1 enumerated (`:17,33,62,99-100` in the crate CHANGELOG; `:3,19` in the
wasm CHANGELOG). A version's date is a release fact; "(tranche-3, W3 — dead-surface excision)" is
process narration — reduce to "— dead-surface excision." **Reconcile the 0.4.0 self-contradiction
r1 found** (`csp-solver/CHANGELOG.md:31` asserts a "core crate's `0.4.0` surface" the changelog
never documents shipping): either add the crate `0.4.0` crates.io release row or correct the wasm
entry to stop claiming alignment to an unshipped core version. No lilt, no em-dash beyond the
version-header dash.

### 2k. `csp-solver/csp_solver.pyi` (header docstring)

SCRUB `:3` "Hand-written against the post-prune (tranche-III) surface" → "Hand-written against the
current pruned surface" (drop the tranche parenthetical). KEEP the rest of the docstring — the
stubtest-contract explanation (`:5-12`) is accurate and load-bearing for a maintainer. This is
pure-technical band; no other change.

### 2l. `/Users/mkbabb/Programming/pencil-boil/README.md`

1 em-dash — cleanest doc in the estate, register-wise. RESTAMP the §1 NEW truth-row: fold the
0.8.0 park model into "Stage 3: frame scheduling" (74–83) so the prose stops describing the
superseded continuous-rAF loop and matches the `vue.ts` "beat-parked scheduler" row (31) and the
CHANGELOG. KEEP everything else; "motion reads as re-tracing with analog touch" (44) is on-idiom
lilt within budget. Its CONTRIBUTING.md link (175) resolves (file present in that repo), unlike
the root README's — leave it.

### 2m. `/Users/mkbabb/Programming/pencil-boil/CHANGELOG.md`

33 em-dashes but pure-technical band and mostly the version-header dash + the release-narrative
prose the CHANGELOG format invites. SCRUB the campaign codes r1 named (`:14` "tranche-3 W13 §1-P1
release," `:20` "measured in the T3-W13 audit," `:39` "tranche-2 W5 release," `:134` "tranche-C
handmark cohort," `:144-147` "muster tranche G … G.W5 sub-wave D"). Keep the release dates and the
engineering narrative (the 0.8.1/0.8.0 park story is excellent, precise technical writing — the
"one clock for the beat" framing is on-canon). Reduce em-dash density in the longest paragraphs
(0.8.0 entry, 14–37) to ≤ 2 per paragraph.

---

## 3. Priority ledger for the docs wave

- **P1 (lie in the record):** root README three version rows (`:113-115`) + `csp-solver/README.md:24,32`
  + `wasm/README.md:4` + `docs/animation.md:6` pin — all version drift; the `CONTRIBUTING.md`
  dangle (`README.md:139`); the CHANGELOG 0.4.0 self-contradiction. Family: `version-table-drift`,
  `dangling-doc-link`.
- **P2 (owner-banned defect, high cardinality):** the meta-leak scrub across all product docs +
  pyi + both CHANGELOGs. Family: `doc-meta-leak`. Enforcement grep §Probes must go to zero.
- **P2 (truth-lag):** pencil-boil README Stage 3 park model. Family: `doc-truth-lag`.
- **P3 (register):** em-dash thinning (README ≤12, csp-solver/README ≤20, animation ≤8),
  correctio cuts (§0.2), copula fix (bbnf:16), superlative-without-number cuts (bbnf:54,65;
  benchmarks:24), e2e 43→44. Family: `register-density`.

---

## Probes (rerunnable from repo root `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`)

```bash
# P1 version truth — every one of these must match the README table after the wave
grep -m1 '^version' csp-solver/Cargo.toml csp-solver/wasm/Cargo.toml
grep '"version"' csp-solver/wasm/pkg/package.json
grep 'pencil-boil' web/frontend/package.json
grep -n '0\.7\.0' docs/animation.md README.md          # → must be empty after RESTAMP

# P1 dangling link
git status --short CONTRIBUTING.md                      # D = staged-deleted; link at README.md:139

# P2 meta-leak enforcement — must return ZERO across shipped product docs after the wave
for f in README.md docs/*.md csp-solver/README.md csp-solver/CHANGELOG.md \
  csp-solver/wasm/README.md csp-solver/wasm/CHANGELOG.md csp-solver/csp_solver.pyi; do
  grep -niE 'tranche|WGATE|T[0-9]-W|\bW[0-9]+\b|campaign|muster|grand-uplift' "$f" | sed "s|^|$f:|"
done
grep -niE 'tranche|T3-W|muster' /Users/mkbabb/Programming/pencil-boil/CHANGELOG.md

# P3 register — correctio + copula + em-dash budgets
grep -rniE 'not (merely|just|only) ' README.md docs/*.md csp-solver/README.md   # → benchmarks:34, animation:52,127 pre-wave
grep -rniE 'acts as|serves as|stands as|boasts' docs/*.md csp-solver/README.md  # → bbnf:16 pre-wave
for f in README.md csp-solver/README.md docs/animation.md; do
  echo "$f: $(grep -o '—' "$f" | wc -l | tr -d ' ') em-dashes"; done  # targets: 30→≤12, 51→≤20, 15→≤8

# P3 e2e count
grep -rEho "^\s*test\(" web/frontend/e2e/*.spec.ts | wc -l          # → 44 (README.md:91 says 43)
```

All probe outputs at HEAD confirm the r1 census and the two NEW truth-rows in §1.
