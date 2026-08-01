# Tranche 5 — the distillation tranche

Formed 2026-08-01 from a 30-agent audit of everything: four tranches + one patch + the design loop, both session-log corpora (Claude Code and Codex, back to 2026-03-04), every chronic ledger, every gate, every component. The audit's record lives under `evidence/audit/` (registry.md v4 + 12 r1 lenses + 6 r2 + 6 batch-3); the design loop's full record is lifted at `evidence/design-loop/`; the thrice designs at `evidence/design/`. Formulation only — no source moved; this folder is the deliverable.

## What the audit ruled

Eleven finding families (registry.md). The headliners: the FE unit layer (332 tests) runs in no CI lane; the P1 perf thresholds have no executor; the evidence policy has no gate and is in live breach; the defineGame registry is architecture fiction (zero production consumers, TDZ-reproduced); 56% of the five-game estate's normalized LOC is destroyable duplicate; three a11y highs are live on every board; nine chronic rows were dropped, not decided, at the T4 close — the second occurrence, so the close ceremony itself is the defect; 22 doc claims are stale; 14 chronics ride the 7-close chain undecided. Against that: the sound-gates ledger (filter census, lean band, preload, knip, PRM, contrast, glass-ui zero, file:-link) verified earned-green, and all three "lost" owner asks (mbabb-logo, progress bar, bake-a-game) proved ADDRESSED — findable only by archaeology (`evidence/audit/r2/prompt-recap-matrix.md`, 137 rows).

## The waves

| Wave | Charter | Gate spine |
|---|---|---|
| [W0 TRUTH & RECORD](waves/T5-W0-truth-and-record.md) | 22 stale claims, the README rewrite, CH-33's fired trigger, record closures, memory true-up, U-07/08/10 | doc-truth script born-RED at HEAD |
| [W1 GATES](waves/T5-W1-gates.md) | unit lane, perf-rig executor, evidence-policy gate, boundary 20/20 (lands RED), wordmark hoist, support floor, exports map, security rows, goldens hardening, coverage instrument, npm-audit lane | born-RED per row; canaries where the defect is absence |
| [W2 DISTILL](waves/T5-W2-distill.md) | the apotheosis: GameSpec→GameShell, one solver spine, the union kill list, FAIL-EXPLICIT, rust edges, CH-19 by its own trigger | π pixel-identity every step; census-delta zero |
| [W3 A11Y](waves/T5-W3-a11y.md) | the row layer, the speaking guard, the five-option picker, shortcut guards, image naming | all born-RED (every defect live, AX-probed) |
| [W4 DESIGN](waves/T5-W4-design.md) | the loop to earned-100%: PICKER · DRAWER (+pencil-boil 0.11 rasterizePoseToBlob) · MOBILE (F3-G1 first); marks close only on owner re-look (U-10) | pass-5 orders verbatim; pass-6 non-author audit |
| [W5 DECIDE](waves/T5-W5-decide.md) | all 61 chronic rows terminal: BUILD/FOLD/RETIRE/BALLOT-with-default; no row rides again | the ledger-diff instrument, born RED by canary |
| [W6 PROCESS](waves/T5-W6-process.md) | the precepts file (the 8×-re-exhorted edicts become repo-durable), mechanized chain laws, the background rig, the living ledger | precepts grep + mechanized-deploy canary |
| [WGATE](waves/T5-WGATE.md) | the close that cannot lie: ledger-diff zero, run-ids only, production re-pass, ballots resolved-or-defaulted | arithmetic, not narrative |

DAG: W0 → W1 → W2 → W3 → W4 → WGATE, with W5 ratifying at open (its FOLDs execute in their owning waves) and W6 landing after W5. Recap-proposed wave names map: W-ABROGATE→W2 · W0-RIG→W6.3 · W-PICKER/W-DRAWER/W-MOBILE→W4a/b/c · W-RECAP-HYGIENE→W0.8+W6 · W-SPLIT→W2.7 · W-DECIDE→W5.

## Owner ballots (each carries a default that fires at close — no row rides)

1. **U-01 scope**: the shadcn-abrogation edict's original utterance exists in neither corpus (earliest `shadcn` = bbnf-lang 2026-03-10; zero csc411). W2 executes the concrete kills chartered by the 2026-08-01 order regardless; confirm whether a broader scope was intended. Default: the order's scope.
2. **CH-35 E8**: execute the 10-minute device script by close, or the iOS claim retires to sim-scope. Default: retire-to-sim-scope.
3. **CH-36 zone scopes**: grant RUM/purge scopes or record accepted-limitation. Default: accepted-limitation.
4. **CH-38 blind readers**: ≥4 cold readers by the W4 gate, or the adjudicator re-scope executes. Default: re-scope.
5. **W6.3 background rig**: provision a WebKit/automation MCP, or the headless-only law stands written. Default: headless-only.
6. **W1.15 CSP**: accept `style-src 'unsafe-inline'` as a documented limitation (CF Pages static cannot mint nonces). Default: accepted, documented.

## The completeness critic's twelve, dispositioned

GAP-1 untracked corpus → cured by this folder's formation commit. GAP-2 production rows → partially discharged in-batch (live curls: headers byte-match, poisoning guard better than documented); the full production re-pass is WGATE law. GAP-3 loop self-report → W4's pass-6 non-author audit is the loop's own law. GAP-4 security/edge → discharged (r3/security-posture.md). GAP-5 OFL figures → W0. GAP-6 coverage → W1.14. Rank-3 six: npm-audit lane → W1.15 · copy/i18n → out-of-scope recorded (single-locale product by design; revisit on an owner ask) · wasm-pack reproducibility delta → W1.12's regen gate notes it · offline claim → W0 verifies-or-strikes · the 42-commit window → W0.6's record closures · audit-durability → this commit.

## Laws in force

Born-RED wherever the defect is live. π/DELTA for every visual claim (π = golden identity; DELTA = before/after crops ≤150KB under W1.3's own gate). Evidence text-first per `../EVIDENCE-POLICY.md` — enforced by W1.3 for the first time. Re-booking forbidden; ballots default-terminal. Marks close on owner re-look only (U-10). Deploys standalone, runs SHA-pinned, conclusions read from the field (CH-57, mechanized at W6.2). The stability ruling and the exact remaining gap are recorded at the foot of `evidence/audit/registry.md`.
