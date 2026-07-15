# T4-W14 — Docs re-formulation

**Every product doc rewritten under MIKE-STYLE, every number re-stamped to the truth, every process-narration leak scrubbed to zero, and the estate's undeclared facts — en-only, no-telemetry, the browser matrix, the font licenses — put in the record.** The version tables lie (three stale rows in the root README against source at 0.4.0 / pencil-boil at ^0.8.1), the README links a staged-deleted `CONTRIBUTING.md`, tranche/wave/gate narration bleeds through every product surface incl. `_headers`/`.pyi`/CHANGELOGs, the pencil-boil README's Stage 3 describes a scheduler model a version behind its own CHANGELOG, and the OFL font texts ship nowhere. This wave executes the per-doc rewrite contract the design-prose lens already wrote — a writer who has read the spec plus the two binding style files can run it end to end. Fable, register work; no source behavior touched.

**Dependencies**: ← all product waves (docs re-stamp the versions/counts/wasm figures those waves land; W3's PWA abrogation + `_headers` purge, W4's config truth, W5's version bumps, W0's declared matrix/en-only/no-telemetry all resolve here). ← W0 (the browser-support matrix + en-only + no-telemetry are **declared** at W0; W14 writes them into the docs). **Effort**: M.

**Binding style files** (path-bound, the spec's own contract): `/Users/mkbabb/Programming/sci-report/reports/style/MIKE-STYLE.md` and its sibling `/Users/mkbabb/Programming/sci-report/reports/style/GENERAL-STYLE.md`. The register band for this corpus is **unpretentious-academic** (READMEs, plan docs — domain verbiage welcome, lilt only where the material invites it, 5% ceiling); CHANGELOGs and hard-gate/CI text sit one band lower, **pure technical** (no lilt, no borrowed foreign phrase).

---

## Corpus-wide register law (mike-style-spec §0 — every doc makes these moves)

1. **Copula plain.** "is" is "is" — purge "acts as / serves as / stands as." Live: `docs/bbnf-integration.md:16` "acts as a dataflow fixpoint engine" → "is a dataflow fixpoint engine."
2. **Correctio banned.** Drop "not X, but Y" / "not merely Y"; assert Y. Live purges: `docs/benchmarks.md:34` "not merely fast" → "verified sound."; `docs/animation.md:52` "not an infinite wiggle swarm" → cut; `docs/animation.md:127` "not left undocumented" → cut; `README.md:119` "not an inherited scratch harness" → cut (keep the first-party provenance fact). **Left alone** (genuine two-referent disambiguations, not correctio): `benchmarks.md:16`, `algorithms.md:22`, `optimizations.md:9`, `sudoku.md:59`.
3. **No editorializing / superlative-without-a-number.** `bbnf-integration.md:65` "the single biggest codegen win" → name the mechanism; `:54` "the critical optimization" → state the path; `benchmarks.md:24` "(deeper than the retired figure implied)" → cut, the numbers show it.
4. **Em-dash discipline** (GENERAL-STYLE: a paragraph with >1 em-dash is almost always over-punctuated). The ASCII `--` in `algorithms.md`/`optimizations.md`/`bbnf-integration.md`/`benchmarks.md`/`csp-solver/README.md` renders spaced-em and reads the same — thin to real sentences or unspaced em-dashes, **not** a global `--`→`—` swap. Per-doc budgets in §Per-doc.
5. **No process narration in product prose (owner ban) — the highest-cardinality defect.** Every tranche/wave/gate-code/campaign/muster reference goes; every stamp becomes plain `measured at <sha>, <host>, <date>`; every inlined `docs/tranches/**` path is deleted (the fact it cites stays). The enforcement grep must return **zero** across shipped product docs.
6. **Overpunctuated staccato:** none in the corpus — keep it clean.
7. **Lilt ceiling.** The corpus is nearly bare of lilt (correct for the band). The two live florid touches (`animation.md:19` "the law every animated value is audited against"; pencil-boil README `:44` "motion reads as re-tracing with analog touch") are on-idiom, within budget — keep both. Do **not** add lilt to hit 5%; it is a ceiling, not a quota.

---

## Truth re-stamps (mike-style-spec §1 + §3 P1 — the lies in the record)

Confirmed live at HEAD 65425697, verified this authoring pass:

- **Version tables** (P1 ×2): `csp-solver/Cargo.toml` + `csp-solver/wasm/Cargo.toml` both `0.4.0`; `wasm/pkg/package.json` `0.4.0`; `web/frontend/package.json` pencil-boil `^0.8.1`. Root `README.md:113-115` still says crate `0.3.0` / wasm `0.2.0` / pencil-boil `^0.7.0` — **three wrong rows**. `csp-solver/README.md:24` "both at `0.3.0` — published"; `:32` install `= "0.3"`. RESTAMP all.
  - **Do NOT stamp a registry version you haven't confirmed.** `csp-solver/wasm/README.md:4` asserts "`0.4.0` on npm" but the published tarball is `0.2.0` (the `0.4.0` bump is source-only). Until the registry is confirmed, the honest line is "`0.4.0` source; the frontend file-links the lean build rather than the registry package." Same for the crate: if crates.io isn't confirmed at `0.4.0`, say "source at 0.4.0; crates.io at 0.3.0." (W0's B2 publish decision resolves which; the doc follows the fact.)
- **`CONTRIBUTING.md` dangle** (P1): `README.md:139` links `./CONTRIBUTING.md`; `git status` shows `D CONTRIBUTING.md` (staged deletion, absent on disk). **Resolve**: restore the file OR inline the two-line flow ("Branch off master, add the change plus tests, open the PR; CI runs the same gates.") and route build/test recipes to `csp-solver/README.md`. Do **not** ship a link to a staged-deleted file.
- **e2e count** (P3): `README.md:91` "43 Playwright tests in 8 files" → **44** (verified `grep -rEho 'test\(' e2e/*.spec.ts | wc -l` = 44 at HEAD).
- **pencil-boil pin drift is TWO surfaces**: `README.md:115` AND `docs/animation.md:6` — both `^0.7.0` → `^0.8.1` in one pass.
- **wasm size figure** stale in three places → **188,095 B** true (FAM-8 r2); the lean band budget ≤ 93 KB.
- **pencil-boil README Stage 3** (P2 truth-lag): lines 74–83 describe the continuous-rAF model with no mention of the 0.8.0 park (setTimeout-aimed beat boundary → one rAF → sleep) the CHANGELOG headlines; the `vue.ts` module-map row (line 31) already says "beat-parked scheduler" — the doc contradicts itself. Fold the park model into Stage 3.
- **`csp-solver/README.md` lists nonexistent py files** incl. a never-shipped futoshiki binding (FAM-8 r2) — remove.
- **wasm README claims `pkg/` committed** — it is gitignored in truth (FAM-8 r2); correct the claim.
- **CHANGELOG 0.4.0 self-contradiction**: `csp-solver/CHANGELOG.md:31` asserts a "core crate's `0.4.0` surface" the changelog never documents shipping — either add the crate `0.4.0` release row or correct the wasm entry to stop claiming alignment to an unshipped core version.

---

## Meta-leak scrub (mike-style-spec §2, §3 P2 — owner-banned, high cardinality)

The enforcement grep (§Probes) must go to **zero** across the shipped product docs + `.pyi` + both CHANGELOGs. Every `tranche|WGATE|T[0-9]-W|\bW[0-9]+\b|campaign|muster|grand-uplift` reference is process vocabulary, not a release fact. Notable sites: `docs/animation.md:46` (inlined `docs/tranches/…/W8-…` path) + `:70`; `docs/algorithms.md:14,47`; `docs/benchmarks.md:5,10,14,37,44,45,51`; `docs/sudoku.md:92`; `csp-solver/wasm/README.md:46` (inlined wave path → "the lean band budget is ≤ 93 KB, enforced by the twiggy CI lane"); `csp_solver.pyi:3` "post-prune (tranche-III) surface" → "current pruned surface"; both CHANGELOGs' parenthetical wave codes on the `## X.Y.Z` headings (keep the version + date + semver rationale, scrub the codes). The **W3 `_headers` narration purge** lands in this scrub too (tranche narration in a live config).

---

## Per-doc rewrite contract (mike-style-spec §2 — KEEP / TIGHTEN / RESTAMP / SCRUB / CUT)

- **`README.md` (root)** — the owner's "quite good, but can be refined." 30 em-dashes / 143 lines. Opening (1–5), directory (7–34), two-games (48–55), frontend (57–59), conventions/sources (121–135): **KEEP**. Architecture (36–46): TIGHTEN the 8-clause run-on at `:44`. Testing (80–99): SCRUB the wave stamps + RESTAMP `:82` to `measured at <sha>, Apple M5 Max, <date>`, `:88` "27 passed, 0 skipped," `:91` 43→44. CI (101–103): SCRUB + **RELOCATE** the byte-budget archaeology + per-lane recitation to `docs/benchmarks.md`, leave the README a perimeter ("Nine CI lanes cover fmt+clippy, the Rust/wasm/py builds and tests, size budgets, the frontend typecheck+knip gate, e2e, and a callgrind instruction-count baseline. Budgets and measured sizes: `docs/benchmarks.md`."). Deployment (105–107): TIGHTEN the `:107` "not mitigated" correctio → "Solving and generation never leave the browser, so there's no server-side solve path to secure." Published artifacts (109–115): RESTAMP all three rows (per §1 registry-honesty). Performance (117–119): SCRUB + TIGHTEN to two sentences, keep the 12.6–12.7× headline + disclosed minority cost. Contributing (137–139): RESTAMP the dangling link. **Em-dash target: ≤ 12** (from 30).
- **`docs/algorithms.md`** — 0 em-dashes, heavy `--`. KEEP structurally (the strongest doc). SCRUB `:14`/`:47`; TIGHTEN `--` to sentences.
- **`docs/animation.md`** — 15 em-dashes. SCRUB `:46`/`:70`; RESTAMP `:6` pin; correctio cuts `:52`/`:127`; TIGHTEN prose to **≤ 8**. KEEP the pencilConfig section (accurate reference).
- **`docs/benchmarks.md`** — 10 em-dashes. Correctio cuts `:34`/`:24`/`:30`; SCRUB the campaign-artifact framing (`:5,10,14,37,44,45,51`), keep evidence pointers as plain relative paths. **Destination for the README's relocated CI byte-budget prose.** KEEP every number + reproduction command.
- **`docs/bbnf-integration.md`** — 0 em-dashes. Copula fix `:16`; superlative fixes `:54`/`:65`. KEEP the six-pass walkthrough (the best domain-verbiage doc).
- **`docs/optimizations.md`** — KEEP nearly whole. `:60` "cryptographically robust" is the precise technical sense + a lone instance — GENERAL-STYLE exempts it; leave or swap to "strong."
- **`docs/sudoku.md`** — SCRUB `:92` "which the tranche landed" → "which the kernel's AC-3 trail-push fix enables." KEEP the rest.
- **`csp-solver/README.md`** — **51 em-dashes / 250 lines, the most over-punctuated doc.** TIGHTEN to **≤ 20** (the API-list definition-separators may stay as a list idiom; the prose paragraphs de-dash). RESTAMP `:24`/`:32` (registry-honest). SCRUB `:210` "deleted at W4" → "27 passed, 0 skipped." Remove the nonexistent py files. KEEP the API reference + GAC posture + difficulty-casing sections.
- **`csp-solver/wasm/README.md`** — RESTAMP `:4` (no unconfirmed registry version). SCRUB `:46` (inlined wave path). Correct the `pkg/`-committed claim. KEEP surface/build/consume.
- **`csp-solver/CHANGELOG.md` + `csp-solver/wasm/CHANGELOG.md`** — pure-technical band. Keep version headers + semver rationale (`csp-solver/CHANGELOG.md:38-40` stays); SCRUB the parenthetical wave codes (`:17,33,62,99-100`; wasm `:3,19`). Reconcile the 0.4.0 self-contradiction (§1).
- **`csp-solver/csp_solver.pyi`** — SCRUB `:3` tranche parenthetical → "current pruned surface." KEEP the stubtest-contract docstring.
- **`/Users/mkbabb/Programming/pencil-boil/README.md`** — cleanest doc (1 em-dash). Fold the 0.8.0 park model into "Stage 3: frame scheduling" (74–83). KEEP the rest; the `:44` lilt is on-idiom. Its CONTRIBUTING link (175) resolves — leave it.
- **`/Users/mkbabb/Programming/pencil-boil/CHANGELOG.md`** — 33 em-dashes, pure-technical band. SCRUB the campaign codes (`:14,20,39,134,144-147`); keep the dates + the 0.8.1/0.8.0 park engineering narrative ("one clock for the beat" is on-canon). Reduce em-dash density in the longest paragraphs (0.8.0 entry, 14–37) to ≤ 2/paragraph.

---

## Estate declarations put in the record (FAM-14 + FAM-15, from W0)

- **Font OFL license texts shipped** — the OFL text for each bundled font (the `Patrick Hand` / wordmark families) placed in-tree beside the font assets (FAM-14: OFL text missing today). A bundled OFL font without its license text is a license violation; W14 closes it.
- **The Nintendo-mark rephrase** — "Yoshi's Story" is named across public source/docs without disclaimer (FAM-14). Rephrase the design-language reference to **unbranded** terms (the heart's craft language — "plush felt silhouette, stitch-dash inner stroke, reciprocal-axis squash" — carries the design intent without the trademark). Every public-doc + source-comment occurrence goes to unbranded language.
- **en-only** declared (FAM-15: undeclared today) — the app ships English only, stated in the README (no i18n layer, by design).
- **no-telemetry-by-design** declared (FAM-14: undeclared today) — the app collects nothing, phones nowhere; the AttributionCard's third-party network hit is the sole external request and is localized (W3/W8). State it.
- **Browser-support matrix** declared (FAM-15: chromium-only CI vs unqualified README claims) — the honest matrix (what CI proves, what Safari's known state is) replaces the unqualified compatibility claims. (W0 declares it in-tree; W14 writes it into the README.)

---

## Gates

Born RED — every probe below fails at HEAD 65425697 today; the wave takes each to its target. π/DELTA: docs carry no visual claims, so this wave's gates are grep/count probes, not captures.

| Gate | Value (born RED today) |
|---|---|
| version truth | `grep -n '0\.7\.0' docs/animation.md README.md` returns **two hits today** (RED); after, empty. The README table's three rows match `Cargo.toml`/`pkg/package.json`/`package.json` (registry-honest per §1). `csp-solver/README.md:24,32` re-stamped |
| dangling link | `git status --short CONTRIBUTING.md` shows **`D` today** with `README.md:139` linking it (RED); after, the file is restored OR the link is inlined — no link to a staged-deleted file |
| e2e count | `README.md:91` says **"43"** today (RED); after, "44" (matches `grep -rEho 'test\(' e2e/*.spec.ts \| wc -l`) |
| wasm figure | the stale size figure appears in **three places today** (RED); after, **188,095 B** true / ≤ 93 KB lean band, everywhere |
| meta-leak zero | the §Probes enforcement grep returns **nonzero across every product doc + `.pyi` + both CHANGELOGs today** (RED); after, **zero** |
| pencil-boil Stage 3 | Stage 3 describes the **continuous-rAF model today** (RED, contradicts the doc's own line 31 + CHANGELOG); after, the 0.8.0 park model |
| CHANGELOG 0.4.0 | `csp-solver/CHANGELOG.md:31` asserts an **undocumented `0.4.0` core surface today** (RED); after, reconciled (release row added or the claim corrected) |
| register budgets | em-dash counts today: README **30**, `csp-solver/README.md` **51**, `animation.md` **15** (RED); after, ≤ 12 / ≤ 20 / ≤ 8. `grep -rniE 'not (merely\|just\|only)'` returns the correctio sites today; after, the purged set is gone. Copula grep (`acts as\|serves as\|stands as`) returns `bbnf:16` today; after, empty |
| OFL | the bundled OFL font ships **without its license text today** (RED); after, the OFL text is in-tree beside the font |
| Nintendo mark | `grep -rniE 'yoshi\|nintendo' README.md docs/ web/frontend/src` returns **branded references today** (RED); after, unbranded design language only |
| declarations | en-only + no-telemetry + browser matrix are **undeclared today** (RED); after, each is stated in the README (from W0's in-tree declaration) |

---

## Probes (mike-style-spec §Probes — rerunnable from repo root)

```bash
# P1 version truth
grep -m1 '^version' csp-solver/Cargo.toml csp-solver/wasm/Cargo.toml
grep '"version"' csp-solver/wasm/pkg/package.json
grep 'pencil-boil' web/frontend/package.json
grep -n '0\.7\.0' docs/animation.md README.md          # → empty after RESTAMP
git status --short CONTRIBUTING.md                      # D = staged-deleted; link at README.md:139

# P2 meta-leak — must return ZERO across shipped product docs after the wave
for f in README.md docs/*.md csp-solver/README.md csp-solver/CHANGELOG.md \
  csp-solver/wasm/README.md csp-solver/wasm/CHANGELOG.md csp-solver/csp_solver.pyi; do
  grep -niE 'tranche|WGATE|T[0-9]-W|\bW[0-9]+\b|campaign|muster|grand-uplift' "$f" | sed "s|^|$f:|"
done
grep -niE 'tranche|T3-W|muster' /Users/mkbabb/Programming/pencil-boil/CHANGELOG.md

# P3 register
grep -rniE 'not (merely|just|only) ' README.md docs/*.md csp-solver/README.md   # → correctio sites pre-wave
grep -rniE 'acts as|serves as|stands as|boasts' docs/*.md csp-solver/README.md  # → bbnf:16 pre-wave
for f in README.md csp-solver/README.md docs/animation.md; do
  echo "$f: $(grep -o '—' "$f" | wc -l | tr -d ' ') em-dashes"; done  # targets 30→≤12, 51→≤20, 15→≤8
grep -rEho "^\s*test\(" web/frontend/e2e/*.spec.ts | wc -l          # → 44 (README.md:91 says 43)
```

## Seeds

- `r2/mike-style-spec.md` — the per-doc rewrite contract end to end: §0 the corpus-wide register law, §1 the census verification at HEAD + the two NEW truth-rows (wasm `0.4.0`-on-npm unconfirmed; pencil-boil Stage 3 lag), §2a–2m the per-doc KEEP/TIGHTEN/RESTAMP/SCRUB contracts with line anchors + em-dash budgets, §3 the priority ledger, §Probes the enforcement greps.
- The binding style files: `/Users/mkbabb/Programming/sci-report/reports/style/MIKE-STYLE.md` + `GENERAL-STYLE.md` (path-bound; the register band, the em-dash rule, the banned-word list, the lilt ceiling).
- `registry/families.md` FAM-8 (version-table drift, meta-leak census, register-density, the r2 truth-gains: pencil-boil README Stage 3, wasm `pkg/`-committed + `0.4.0`-on-npm, nonexistent py files, `_headers` tranche narration, wasm size 188,095 B in three places), FAM-14 (OFL missing, Nintendo mark undisclaimed, no-telemetry undeclared), FAM-15 (browser-matrix-untested-claim, en-only undeclared).
- W0 (this tranche) — the browser-support matrix + en-only + no-telemetry DECLARED in-tree; W14 writes them into the docs.
- Live verification at HEAD 65425697: Cargo/pkg/pencil-boil versions (0.4.0/0.4.0/^0.8.1) vs README `:113-115` (0.3.0/0.2.0/^0.7.0); `CONTRIBUTING.md` staged-deleted; e2e `test(` = 44 vs README `:91` "43."

## Residual risks

- **Registry-honesty over stamp-confidence** — do NOT write "0.4.0 on npm/crates.io" without confirming the registry. W0's B2 decides whether the crate publishes; until the tarball exists, the honest line is the source/registry split. A confident-but-wrong version stamp is exactly the lie this wave exists to kill.
- **The meta-leak grep is the gate, not a guideline** — it must return literal zero across the shipped set. A rewrite that leaves one "T3-W…" reference in a CHANGELOG heading has not passed; the enforcement grep is run at the gate SHA, not trusted.
- **Em-dash budgets are targets, not global swaps** — thinning is by rewriting to sentences, never a blanket `--`→`—` substitution (which preserves the over-punctuation the rule names). The budget is the register signal; the load-bearing move is the sentence split.
- **The Nintendo-mark rephrase must not lose the design intent** — the unbranded craft language ("plush felt silhouette, stitch-dash, reciprocal-axis squash") carries the same specification; the risk is a rephrase that drops the design precision to dodge the trademark. Keep the fact, drop the mark.
- **CONTRIBUTING resolution is a fork** — restore the file or inline the flow, but not both and not neither; the one wrong outcome is shipping the dangling link unchanged.
- **The two on-idiom lilt touches stay** — `animation.md:19` and pencil-boil README `:44` are within budget and correct for the band; the risk is an over-zealous scrub that flattens them. The 5% is a ceiling, not a target to cut toward zero.

## Execution record (2026-07-15)

Workflow `wf_d2248008-cb5` (C → {D1 ∥ D2 ∥ D3, batch-of-three Fable-lane fanout} → V; 5 agents, no walls). **V verdict: RED on two trivial in-remit defects, all other gates green — both cured team-lead at seal, re-proven own-run.**

| Gate | Born-RED | Close |
|---|---|---|
| truth trace — every number restamped | README claimed 43/8 e2e, 171/0/6 rust, nine CI lanes, 86,746 B lean, two games | census at HEAD `826f16e3` (nine waves past the spec's base) → e2e **82/13** (77 default + 4 golden + 1 throttle), rust **208/0/0** (RUN by D1 and re-run by V — the six ignored stress tests are deleted, the triple has no ignore arm), unit 307/29, tests-py 27 (parametrize-counted; wheel build not re-run, corroborated), CI **11 jobs**, lean **121,855 B darwin / 124,091 B runner** inside the 124,500 analytic / 127,500 CI band, five-game product table |
| **V RED-1: bank stamp** | README.md:58 said 32,533 B (the T2 figure) vs csp-solver/README.md:192's 32,095 B | own-measure `find … -exec cat + \| wc -c` = **32,095 B / 45 files** → README restamped; the exact confident-but-wrong stamp the wave exists to kill, caught by V's trust-no-lane re-measure |
| **V RED-2: format gate** | new `fonts/LICENSES.md` failed `prettier --check src/` (CI frontend lane's last step) | `prettier --write` + `npm run lint` green — content unchanged |
| meta-leak zero | 31 leak lines across 12 gated docs + 12 in pencil-boil CHANGELOG | grep returns **literal zero** across README, docs/*.md, both csp-solver READMEs + CHANGELOGs, `.pyi`, `_headers`, pencil-boil README + CHANGELOG (V re-ran verbatim); facts kept, codes gone |
| register (MIKE-STYLE) | em-dash 30/51/15/10, correctio benchmarks:34, copula bbnf:16 | budgets by sentence rewrite, never blanket swap: README 30→**0**, csp-solver 51→**11**, animation 15→**1**, benchmarks 10→**2** (verbatim stdout in a fence), wasm 10→**0**, pencil-boil CHANGELOG ≤2/para; correctio/copula/banned-word greps empty; the two protected lilt lines survive |
| registry honesty | versions stamped from source, registries unconfirmed | live-queried thrice (census + lanes + V independent): crates.io **0.5.0 published**, npm wasm **0.2.0 vs source 0.5.0 — the split stated in prose**, pencil-boil **0.9.2** aligned (frontend pins ^0.9.2); no unconfirmed stamp anywhere |
| FAM-14/15 declarations | OFL texts absent, Nintendo mark in comments, matrix/en-only/no-telemetry undeclared | three verbatim OFL 1.1 texts beside the woff2 subsets + `LICENSES.md` manifest; six branded-prose comments rewritten unbranded craft (diff comment-only, 7+/7−, vue-tsc 0); browser matrix + en-only + no-telemetry written into the README from `declared-decisions.md` |
| CONTRIBUTING fork | dangling link + staged deletion | INLINE ruling executed: two-line flow in the root README, link dead, the deletion commits at this seal |
| behavior drift | — | git diff = docs/CHANGELOGs/.pyi/licenses + 4 comment-only source files; `_headers` policy lines byte-identical; V confirmed NONE |

Reconciliations, banked with re-triggers: **crates.io 0.5.0 predates the five-family surface** (PuzzleClass landed W11, cages W13, both after the W6 version bump) — clean fix is a 0.6.0 bump + publish, a release action outside this docs wave, owner-facing; **YOSHI_COLORS symbol rename** deferred to a source lane (branded prose is zero; the exported const + 4 imports + 3 comments naming it go together); **full-module wasm figure OPEN** (222,436 B is T2-stale, re-measure command written into benchmarks.md, CI bounds hold at fail >240 KB); docs/sudoku.md stays the sudoku+futoshiki deep doc with a five-game pointer. pencil-boil sealed in the sibling repo at this seal (pushes allowed there). Evidence: `evidence/w14/{c-census,d1-record,d2-record,d3-record,gates}.md`.
