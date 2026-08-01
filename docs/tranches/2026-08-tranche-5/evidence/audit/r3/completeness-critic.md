# R3 — COMPLETENESS CRITIC: what the T5 audit did not look at

**Charge.** Not "is the audit right" — that was R2's job. **What is MISSING**: which lens never ran,
which claim rests unverified, which corpus went unread, which subsystem has zero rows anywhere.

**Read in full:** `audit/registry.md` (v3, 106 L) + all 12 `r1/*.md` (3,839 L) + all 6 `r2/*.md`
(2,089 L). **Tree probed read-only** at `71456713d9f7361af80f09e1a456fc9787507e78`
(`git log -1` → `2026-08-01 04:23:26 -0400`). Every gap below carries a command run **this pass**
or a `file:line` from the corpus. UNKNOWN where I could not settle it.

**Verdict: NOT complete. Twelve gaps, three of them formation-critical.** The audit is deep on
*record integrity*, *gates*, *dead code*, *consumers*, *duplication* and *prompts*. It is blind on
*the running product*, *its own durability*, and *four whole subsystems*.

---

## 0 · Coverage enumerated first (so the gaps read as specific, not as a blanket)

| Lens | Rows | Subject |
|---|---:|---|
| `r1/plan-vs-landed` | 214 | 4 tranches + P1, every seal SHA + 12 CI runs re-resolved, 6 LIES |
| `r1/gate-soundness` | 39 gates / V1–V20 | can each gate fail, and for its own defect |
| `r1/perf-disposition` | 29 + 16 DNB + 10 missing-evidence groups | the perf audit's dispositions, the gate map |
| `r1/a11y` | 15 findings + clean ledger | AX-tree probe, contrast recomputed |
| `r1/component-census` | 213 | 189-module graph, dup, dead props/tokens/CSS, boundary |
| `r1/dead-code-census` | scorecard + S1–S9 | all four stacks, dual paths, masking fallbacks |
| `r1/consumer-truth` | 159 | declared surface ⇄ real consumer, both directions, 6 sweeps |
| `r1/cross-repo` | 6 | pencil-boil, bbnf vendor, morph residue, registries, glass-ui, `file:`-link |
| `r1/doc-canon-drift` | 59 claims | 12 consumer docs + `ci.yml`, every number re-derived |
| `r1/chronic-ledger` | 61 | CH-01…CH-61, ride-counts, 4 record gaps |
| `r1/cc-prompt-ledger` | 93 | 2026-07-04 → 08-01 CC corpus |
| `r1/codex-prompt-ledger` | 29 | 5,466 rollouts scanned, 2 csc411 sessions |
| `r2` ×6 | — | gate criticals · arch fiction · masked+drift · dup matrix · recap matrix · loop condensation |

≈900 rows. What follows is what none of them touched.

---

## RANK 1 — T5 IS MALFORMED WITHOUT THESE

### GAP-1 · The T5 evidence corpus is UNTRACKED. D5's "CURED" is false.

```
$ git ls-files docs/tranches/2026-08-tranche-5 | wc -l      → 0
$ git status --porcelain                                    → ?? docs/tranches/2026-08-tranche-5/
$ find docs/tranches/2026-08-tranche-5 -type f | wc -l       → 772
$ du -sh docs/tranches/2026-08-tranche-5                     → 7.1M
```

`registry.md:38` — **"D5 | Design-loop record was scratchpad-volatile — CURED 13:25: full text record
lifted in-tree (evidence/design-loop/, 6.4MB, binaries pruned per policy) | CURED"**. *In-tree* is not
*tracked*. The whole design-loop record **and this entire audit** are one `git clean -fd` from zero,
and `git stash`, a worktree switch, or a fresh clone all lose them.

Three lanes saw the working-tree fact and none adjudicated it: `perf-disposition.md:20-23`
("the whole path `??`" — offered as a *live-tree caveat*), `verify-arch-fiction.md:3` and
`verify-masked-and-drift.md:3-4` (both "clean except the untracked `docs/tranches/2026-08-tranche-5/`",
offered as *provenance hygiene*). The registry then closed D5 on the strength of the lift.

This is the estate's own named class defect — **the record cannot verify the record**
(`memory/lessons-from-t2-t4.md`) — recurring inside the audit that was convened to find it.

**One-agent probe.** `git ls-files` + `git status` + `git check-ignore -v` over the tranche dir; confirm
no ignore rule refuses it; enumerate what a commit would add (772 files, 7.1 MB, **0 images** — verified:
`find … -name '*.png' -o -name '*.jpg' …` → 0, so `EVIDENCE-POLICY`'s ≤150 KB/≤2 MB image caps are not
engaged); check the 245 `.log` / 194 `.json` / 108 `.jsonl` raw-rig files against the policy's spirit;
reopen D5 as OPEN with a commit-or-amend row.
**Formation risk: MAXIMUM.** A tranche plan whose entire evidentiary basis is untracked is unformed.

### GAP-2 · Zero production-surface rows. Nothing in either round touched the live site.

```
$ grep -rn "babb\.dev" audit/r1 audit/r2 audit/registry.md   → 2 hits, both prose
```
— `cc-prompt-ledger.md:43` (a 2026-07-06 owner quote) and `gate-soundness.md:63` row 37, which *names
the absence*: **"production/deploy parity | absent | the bytes at sudoku.babb.dev matching the gated
tree | nothing | No deploy job, no post-deploy probe."**

Everything measured is local: the working tree, the local gitignored `dist/`
(`git check-ignore -v web/frontend/dist/index.html` → `.gitignore:12`), a local `:4177` preview. The
one lens that reaches the network (`cross-repo`) went to crates.io, npm and PyPI — and never to the
product.

Meanwhile the campaign's headline is a *production* claim (MEMORY: "PRODUCTION `f1adfca5`: idle 97.6+
long33 0, census 9, wordmark sharp+complete"), and `f1adfca5` **is not a commit** —
`prompt-recap-matrix.md:348-350` records `git cat-file -t f1adfca5` → *"fatal: Not a valid object
name"*, a Cloudflare deployment id in SHA position (registry D11). The lessons file's own forward rule
is *deploy-per-seal + a production pass in every close gate*. No pass ran.

**One-agent probe (read-only, no deploy).** `curl -sI https://sudoku.babb.dev/`; fetch `/`, extract the
`assets/index-*.js` name, compare against the tree's emitted name; verify the live response headers
match `web/frontend/public/_headers` (CSP string, HSTS, `nosniff`, `/assets/*` `immutable`,
`/assets/*.wasm` `Content-Type: application/wasm`); `curl -o /dev/null -w '%{http_code}'
https://sudoku.babb.dev/assets/does-not-exist.js` → must be **404**, never the shell (see GAP-4).
**Formation risk: MAXIMUM.** T5 would be scoped against a tree nobody has confirmed users are served.

### GAP-3 · The design-loop record was CONDENSED, never adversarially verified.

`r2/design-loop-open-rows.md:3` — **"Condensation, not design. Every row below is lifted from the
pass-1..4 registries, the pass-4 lane dossiers/critiques, MEASURE's `RESULTS.md`…"**. Every other R1
finding drew a hostile R2 re-probe (A1, A3, A5, B1, I1–I3, J1–J3, K H1–H3, the doc headliners). The
loop's own numbers drew none.

Unverified, and load-bearing on the T5 wave plan: **pageVh 1.705 both arms** (the number the only
blocking row hangs on, `:95`), the corrected flake rate **6/11 · 5/11** (`:35`), the **21** pre-settle
census (`:36`), **310** e2e insertions (`:54`), the **90.58 / 89.98** landscape overflow (`:62`), the
`dist-head ≡ dist-F3head` md5 identity (`:14`), and every born-RED claim. The loop's own law says so:
`:72-73` — *"What the pass-5 non-author audit must re-verify"* lists exactly those four numbers — and
`:255` makes **"a fresh non-author audit"** a precondition of earned 100%. That audit has not run, and
R2 was the natural place for it.

**One-agent probe.** Re-derive the four corrected numbers from `design-loop/pass4/logs/**` and
`pass4/measure/RESULTS.md` at the stated artifact md5 `dc6424524ce09d0cc9e4865c561beeac`; read the
three born-RED specs (`gallery-deal.spec.ts:432`, the pair-branch floor, the same-game-dirty row) and
state whether each can red; report agreements and disagreements as rows.
**Formation risk: MAXIMUM.** The sequential integration order D→C→B→A→F3 and the blocking F3-G1 row
are both scoped off self-reported figures.

---

## RANK 2 — T5 IS MIS-SCOPED WITHOUT THESE

### GAP-4 · Security / edge posture: zero rows in any lens.

`web/frontend/public/_headers` is a ~90-line artifact carrying a clause-by-clause CSP
(`default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'none'`),
HSTS `max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `nosniff`, a 28-directive
`Permissions-Policy`, and the `/assets/*` immutable + `/assets/*.wasm` MIME stanzas. It makes an
**empirical claim in prose** — *"instrumented for `securitypolicyviolation` events — zero violations"*.

`web/frontend/public/_redirects` carries the estate's only in-tree account of the **2026-07-15 edge-cache
poisoning**: *"a mid-deploy fetch through the zone once cached the text/html fallback as a stylesheet
for a year … the app ran unstyled at 5 fps"*, cured by `/assets/* → /404.html 404` plus 12-char hashes
(confirmed live: `vite.config.ts:279,281` `[hash:12]`; `public/404.html` exists, 78 B).

Corpus coverage of all of that:
```
$ grep -rn "_headers" audit/r1 audit/r2 audit/registry.md
  → 5 hits: plan-vs-landed :54,:126,:164,:261,:515 (PRESENCE only) + perf-disposition:76 (one negative
    grep for COOP/COEP)
$ grep -rn "_redirects\|404\.html\|poisoning" audit/r1 audit/r2 audit/registry.md
  → 2 hits: plan-vs-landed:54 (presence) + chronic-ledger:150 (one clause inside CH-36)
```
No lens read either file. `gate-soundness`'s 39-row table has **no header/CSP/redirect row** — nothing
in CI asserts any of it. The poisoning has **no chronic row of its own**; it survives only as a
subordinate clause explaining why CH-36 (zone purge scope) matters.

**One-agent probe.** Re-derive the CSP against the built dist (load under the exact policy, count
`securitypolicyviolation`); check every directive against what the bundle actually requests
(`blob:` on `img-src`/`worker-src` — added at `39a4b0be`, unrecorded anywhere); assert the three
poisoning cures (`_redirects` rule, `[hash:12]`, `404.html`) and ask whether **any** gate would red if
one were deleted; give the incident its own CH row.
**Formation risk: HIGH.** The estate has been bitten here once, in production, and every instrument is
still blind to it.

### GAP-5 · Licensing / OFL: zero rows — and the license document states a wrong number.

```
$ grep -rn "LICENSES.md\|OFL" audit/r1 audit/r2 audit/registry.md   → 0
```

`web/frontend/src/assets/fonts/LICENSES.md` (tracked; `git ls-files` confirms) states:
*"Three self-hosted woff2 subsets ship here, **17,708 B total**"*, and per-family *Fraunces …
**9,772**"*. On disk this pass:

```
$ wc -c web/frontend/src/assets/fonts/*.woff2
  3624 firacode-subset.woff2 · 13788 fraunces-subset.woff2 · 4312 patrickhand-subset.woff2  = 21,724 B
```

That is the **identical stale figure** `doc-canon-drift.md` S7 booked against `README.md:62`, in a
**third site** the lens could not see: its declared corpus is *"12 consumer-facing files + the
workflow"* (`doc-canon-drift.md:6`), and `LICENSES.md` is not one of them. It is also the one place
where a wrong byte count sits inside a **license-compliance statement** — the file asserts each subset
is *"a Modified Version under the OFL … redistributed under the same license per clause 5"*.

Also unverified anywhere: the claim *"None of the three declares a Reserved Font Name"*; whether the
three `OFL-*.txt` are byte-faithful upstream texts; the license status of
`src/assets/typography.css`, which declares itself **"VENDORED from @mkbabb/glass-ui@4.2.0"**
(`cross-repo.md:288-292` cleared the *dependency* guardrail and explicitly did **not** examine the
license of the copied text); and the three `LICENSE` files (root, `csp-solver/`, `csp-solver/wasm/`)
against the published crate/npm metadata.

**One-agent probe.** Re-derive the three byte counts and the total; diff each `OFL-*.txt` against
upstream; check each family's RFN clause; check `typography.css`'s vendoring against glass-ui's license;
check `LICENSE` ⇄ `Cargo.toml`/`package.json` `license` fields ⇄ the crates.io/npm records.
**Formation risk: HIGH.** Cheap, legal, and it proves the doc-truth wave's *corpus definition* is
itself the defect — the exact recurrence-class the drift lens booked at S6.

### GAP-6 · Test ADEQUACY has zero rows. Only test EXECUTION was audited.

`gate-soundness` asked *can each gate fail*; A1 established **332 FE unit blocks execute nowhere**
(`verify-gate-criticals.md:19-70`, every hatch closed). Nobody asked **what the tests cover**.

```
$ grep -rniE "test coverage|code coverage|tarpaulin|llvm-cov|mutation test" audit/r1 audit/r2
  → 1 hit, incidental (component-census:466, "Test coverage at useUrlState.test.ts:82")
$ grep -rn "tarpaulin\|llvm-cov\|coverage" web/frontend/package.json Cargo.toml .github/workflows/ci.yml
  → only `test:font-coverage` — a name collision, not a coverage instrument
```

So: rust 208/0/0, py 27/0, FE 332 blocks / 31 files, e2e 206 — and **no figure anywhere** for what
fraction of the solver kernel, the undo spine (cap 200), the technique engine, the wire codecs or the
five URL codecs is exercised. There is no coverage tool in the repo at all.

**Why it is formation-critical.** The two largest T5 waves the corpus already names are
**DISTILL** — `dup-matrix.md:257` prices **2,966 normalized LOC (≈4,150 raw)** of duplicate collapse
across the five games — and **SPLIT** (U-09: `builder/assignment.rs` 607 L, `constraint/cage.rs`
558 L, unwaived). Collapsing 56% of a five-game estate and splitting two god modules, on a test estate
whose coverage nobody has measured *and whose frontend half does not run in CI*, is the exact shape
that ships a silent regression.

**One-agent probe.** `cargo llvm-cov --workspace --summary-only` and `vitest run --coverage`
(both add a dev dependency — scope the probe to *measure and report*, never commit); or, strictly
read-only, count assertions per exported symbol per module and name every public function with zero
test reference. Either way the deliverable is: the uncovered set, ranked by the DISTILL/SPLIT blast
radius `dup-matrix` §3 already computes.
**Formation risk: HIGH.**

---

## RANK 3 — T5 IS INCOMPLETE, NOT MALFORMED

### GAP-7 · The npm advisory surface was never independently derived.
The two live highs are cited, never re-derived: `chronic-ledger.md:91` (CH-37, from `gh api …
dependabot/alerts`), re-cited at `verify-gate-criticals.md:259` as the "partial out-of-band oracle".
**`npm audit` was never run.** Both packages are transitive-only — `package-lock.json:5600`
(`node_modules/postcss`), `:5843` (`node_modules/sharp`); neither is among the 25 declared deps
(`consumer-truth` §5) — so the fix is a transitive bump nobody has priced. And `.github/` holds
**exactly one file** (`find .github -type f` → `ci.yml`): no `dependabot.yml`, so whether GitHub's graph
ingests `Cargo.lock` at all is UNKNOWN (`verify-gate-criticals.md:261` says so).
**Probe:** `npm audit --json`; resolve each advisory to its dependency path and price the bump; check
the security tab for any Cargo-manifest alert. **Risk: MEDIUM.**

### GAP-8 · Product copy / voice / i18n: zero rows.
MIKE-STYLE was enforced over **docs** at T4-W14 (meta-leak grep literal zero, re-confirmed
`doc-canon-drift.md:294`). No lens ever read the **product's** authored language: `techniqueVoice.ts`
(179 L), `describeError.ts` / `classifyError.ts`'s paper-note taxonomy, `MarginNote`, `GameBoard.vue`'s
drawer voice, ~25 `aria-label`s, the 6 `og:` + 3 `twitter:` tags in `index.html`, and a 78-byte
`404.html`. The design loop reaches copy only where a11y forces it (the guard's two names, adjudicator
rank 9a). `<html lang="en">` with no i18n scaffolding is a defensible posture that no document states.
Corpus check: `grep -rniE "i18n|microcopy|copy deck"` over r1+r2 → 0.
**Probe:** enumerate every user-visible string, check register against MIKE-STYLE and against the
one-string principle (`GameControlPanel.vue:281`), flag the ones that contradict the UI they name.
**Risk: MEDIUM** — marks 5/6 are composition marks and copy is composition; a drawer re-cut without a
copy row re-litigates strings twice.

### GAP-9 · The wasm build pipeline's reproducibility is un-owned.
Named in three fragments, owned by nobody: `verify-arch-fiction.md:282-292` (N2 — `pkg/` is gitignored
and regenerated by an **unpinned** `wasm-pack`, CI declares only a `>=0.14` floor at `ci.yml:318,348,395`,
local is 0.15.0); `verify-masked-and-drift.md:254` (the +530 B is **toolchain drift with zero `.rs`
changes** — an unpinned dated stamp); `gate-soundness.md:133` (V12 — "a stale local `pkg/` on the
deploying machine ships unexamined"). Standing unexplained: runner 124,091 B vs this host 122,385 B,
**1,706 B** with no attribution on the record, while the band is 127,500.
**Probe:** pin `wasm-pack` exactly, build twice on one host and diff bytes; diff a runner artifact
against a local one and attribute the 1,706 B; state whether `npm run deploy`'s `prebuild` can ship a
binary CI never saw. **Risk: MEDIUM.**

### GAP-10 · Offline posture is a claim with no test.
The crosswords retire rests on *"an offline-wasm violation"* (`prompt-recap-matrix.md:280,287`) and the
product is sold as solving entirely in-browser — while the PWA was abrogated **whole** (verified
grep-zero, `plan-vs-landed.md:345,604`: no `serviceWorker`/`workbox`/`vite-plugin-pwa`, no manifest).
With no service worker the app **does not work offline at all** after first load. Nothing in the corpus
reconciles the two. **Probe:** load the built dist, kill the network, reload, record; then decide
whether "offline-wasm" is a claim to fix or prose to re-cut. **Risk: LOW-MEDIUM** (a truth row, not a
defect).

### GAP-11 · The 42-commit post-seal window: absence named, claims unverified.
```
$ git rev-list 6800af04..HEAD --count      → 42
$ git diff --name-only 6800af04..HEAD -- docs/   → (empty)
```
`plan-vs-landed.md:636-640` names the *absence* of any wave record. Nobody verified what those 42
subjects **claim**. Spot-checked this pass: `981353c0` "404-guard unknown assets, rotate hashed URLs to
12 chars" → **TRUE** (`_redirects` rule + `vite.config.ts:279,281`); "CSP: img-src gains blob:" →
**TRUE** (`_headers` `img-src 'self' data: blob:`); `fb15253d` "Safari curve: pin the divider's live
grain poses on Apple WebKit" → **not verified**. **Probe:** walk all 42 subjects, each to a `file:line`
or a REFUTED. **Risk: MEDIUM** — it is the only window of shipped work with no plan document.

### GAP-12 · The Codex corpus has 24 unclassified rollouts, and that is exactly what leaves U-01 open.
`codex-prompt-ledger.md:11` — cwd extracted from `head -c 400` of 5,466 rollouts; **24 files have no
parseable cwd and were not classified**; the file's own gap section: *"Whether any is a csc411 session:
UNKNOWN."* That UNKNOWN is load-bearing: `prompt-recap-matrix.md:335` books **U-01 full shadcn
abrogation** as UNADDRESSED with origin UNKNOWN precisely because the recalled edict appears in no
classified session. The owner's active order (PR-132) asked for the dig **across both Claude Code and
Codex**; 24 files of it were skipped for a 400-byte read.
**Probe:** parse the 24 rollouts in full for a cwd anywhere in the file; grep them for `shadcn`,
`csc411`, `sudoku`, `pencil-boil`; close or confirm U-01's origin. **Risk: MEDIUM** — U-01 is a T5
wave candidate whose scope currently cannot be stated.

---

## Adjacent, named so they are not re-discovered (LOW)

- **`docs/precepts` submodule** pinned at `8781ebb06c03547f57e33182ec1a970fd96d7069`
  (`git submodule status`); currency never checked, and `doc-canon-drift.md:296-311`'s outbound-meta-leak
  advisory (a crates.io reader following `csp-solver/README.md:266` lands on another repo's tranche
  vocabulary) carries no disposition in the registry.
- **`.github/` is one file.** No `SECURITY.md`, no `CODEOWNERS`, no `dependabot.yml`, no issue/PR
  templates, no release workflow (`find .github -type f` → `ci.yml`; `ls SECURITY.md CODEOWNERS` → none).
- **Solver algorithmic correctness** beyond the gates — the `max_solutions=1` trajectory-dependence
  documented "at every surface", the generator's uniqueness-per-hole invariant, the `u128` domain
  ceiling — is asserted by the docs and gated by `gac_ab_corpus`, and was re-derived by **no lens this
  round** (`doc-canon-drift` ran the binary; nobody audited the property).

---

## The shape of the blindness

Three of the twelve gaps are one gap wearing three coats: **the audit inspected the artefact and never
the deployment of it.** GAP-1 (its own record is untracked), GAP-2 (the live site was never fetched),
GAP-4 (the edge config was never read) all fail the same way — the estate's instruments stop at
`git`'s edge, and every one of the campaign's most expensive incidents (the T4-P1 overrule, the
2026-07-15 poisoning, the deployment-ids-in-SHA-position trap) happened past it.

Two more are one gap: **the corpus definition is the defect.** GAP-5 (a license doc outside the
doc-truth corpus carries the identical stale number the corpus caught) and GAP-12 (24 rollouts outside
the cwd filter hold the answer the recap could not find) are both "the lens found everything inside a
boundary nobody audited."

**Recommended R3/R4 roster, ranked:** (1) production-truth + edge/security probe [GAP-2+4],
(2) commit-or-amend the T5 corpus, reopen D5 [GAP-1], (3) non-author verify of the design loop's four
numbers + three born-RED claims [GAP-3], (4) licensing/OFL sweep [GAP-5], (5) coverage measurement
scoped to the DISTILL/SPLIT blast radius [GAP-6]. Gaps 7–12 fold into existing waves
(`T5-W-RECAP-HYGIENE`, `T5-W0-RIG`) as rows, not lanes.

ROW-COMPLETE
