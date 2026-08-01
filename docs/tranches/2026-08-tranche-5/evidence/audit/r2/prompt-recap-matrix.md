# R2 — the unified PROMPT-RECAP MATRIX

Every ask the owner ever made to this codebase, merged from five corpora, one row per **ask-identity**,
each carrying its provenance and one terminal disposition.

**Tree of record:** `git log -1` → `71456713` (2026-08-01 04:23:26 -0400). Every SHA below was resolved
with `git log -1 --format='%ci %s' <sha>`; every file:line was read at that HEAD.

## 0. Method

| Item | Value |
|---|---|
| Corpus A | `r1/cc-prompt-ledger.md` — 95 tabled rows (85 live + 8 SUMMARY-SOURCED; 52 cron replays collapsed into 14 run-rows by that ledger) |
| Corpus B | `r1/codex-prompt-ledger.md` — 29 owner prompts, both csc411 Codex sessions, 2026-03-04 |
| Corpus C | `2026-07-grand-uplift/appendices/B-prompt-recap.md` — R/M/D/G/C commit-sourced mandates + the 2026-07-04 ratifications + the 2026-07-05 edict |
| Corpus D | the recap successors: `2026-07-tranche-2/appendices/B-prompt-recap.md`, `2026-07-tranche-3/appendices/B-prompt-recap.md`, `2026-07-tranche-4/README.md` §4c + `evidence/r1/r1-prompt-recap.md` + `evidence/corpus/owner-prompts.md` |
| Corpus E | `memory/design-refinement-marks-2026-07-31.md` — marks 1–6 |
| Dedupe rule | **ask-identity**, not utterance. A verbatim re-issue, a cron replay, and a paraphrase of the same want collapse into one row with a re-issue count. Two asks in one turn split into two rows (this is what rescued G1/G2/G3). |
| Disposition vocabulary | **ADDRESSED**(SHA / file:line) · **LEDGERED**(CH-xx) · **IN-FLIGHT**(design-loop lane) · **UNADDRESSED**(→ T5 candidate) · **SUPERSEDED**(by what, quoted) |
| UNKNOWN policy | stated as UNKNOWN, never guessed. Three rows below carry it. |

**Row count: 137 ask-identities** — 24 Codex-era · 23 historical mandates · 27 grand-uplift/T2 era ·
21 T3 era · 24 T4 era · 14 P1/design-loop era · 4 active T5 order.

**Provenance key:** `A#` = cc-prompt-ledger row · `B S1:n/S2:n` = codex rollout line · `C` = grand-uplift
appendix B · `D2/D3/D4` = the T2/T3/T4 recap successors · `E#` = design mark.

---

## 1. ERA 0 — the Codex sessions (2026-03-04)

Two sessions, 29 prompts, 24 identities. **Two of the campaign's governing edicts were born here** and
nowhere else (Corpus B TASK B). Zero Codex sessions exist for this repo after 2026-03-04.

| # | The ask (trimmed) | Prov. | Disposition |
|---|---|---|---|
| PR-001 | Extract pencil-boil + handdrawn animation into a micro library w/ CLI + docs in `~/Programming`; this repo consumes it | B S1:7 | **ADDRESSED** — `b8340a5e` "Extract pencil-boil imports and stabilize e2e", `36cce821`; **survives 5 months on**: `web/frontend/package.json:36` `"@mkbabb/pencil-boil": "^0.10.1"` |
| PR-002 | `generateGridPaths` &c are sudoku-specific — do NOT abstract them out | B S1:214 | **ADDRESSED** (18 acts) |
| PR-003 | No strange backwards-compat exports (prng); run tests; validate with Playwright + Chrome | B S1:332 | **ADDRESSED** (47 acts). Local ancestor of the NO-legacy edict — cc §2 records it re-uttered **6×** through 2026-08-01 |
| PR-004 | Redress docs; hyperlink the new repo; transpose ANIMATION.md into it | B S1:622 | **ADDRESSED** (23 acts) |
| PR-005 | **"abrogate any unsubstantiated claims, editorializing, comparison sentiments like 'it's not just x, but y'… limit usage of em dashes"** | B S1:792 — **EDICT BORN HERE** (`codex-prompt-ledger.md:69`, rollout `…019cb77b-…cd2.jsonl:792`) | **ADDRESSED + STANDING.** Re-issued 3× in that one session (S1:1045 "This sort of bullshit should be abrogated"; S1:1065; S1:1144) — within 15 minutes of first issue. Canonical form today = MIKE-STYLE; T4-W14's meta-leak grep is literal zero |
| PR-006 | Remove superfluity (the Repo:/Primary-consumer: link block) | B S1:853 | **ADDRESSED** (4 acts) |
| PR-007 | Pithy commits in both repos; give me the npm publish commands — **I execute npm login** | B S1:876 | **ADDRESSED** (15 acts). The owner-holds-the-credential split survives verbatim as today's "deploy ONLY via `npm run deploy`, owner-authorized per deploy" |
| PR-008 | pencil-boil README prose-like, restructured from first principles, to the style guide | B S1:932 | **ADDRESSED** (25 acts) |
| PR-009 | The boil README must carry ANIMATION.md's prose (boil, wobble, compositing), repo-specific | B S1:1277 | **ADDRESSED** — `cefcc76a` "docs: tighten frontend and project documentation" |
| PR-010 | Board not centred; overflows top and bottom — redress using Playwright | B S2:7 | **ADDRESSED** (52 acts). Surface has since been rebuilt ≥3× (T2-W5, T3-W12, T4-WM) |
| PR-011 | **"idiomatic tailwind and usage thereof. no workarounds or hacks"** | B S2:271 | **ADDRESSED + STANDING** — the NO-workaround edict; cc §2 counts **8** re-utterances 2026-07-04 → 2026-08-01 |
| PR-012 | Margin top+bottom of the main view, consistent with the mbabb left margin; valid for easy/medium/hard (re-issued S2:543) | B S2:384, :543 | **ADDRESSED** — `37fc1403` "Refine board layout spacing and stacking" |
| PR-013 | The sun's z-index (rays included) above the controls bar | B S2:483 | **ADDRESSED** (13 acts) |
| PR-014 | **"The margin's not there on safari for some reason"** | B S2:598 | **ADDRESSED** in-session (10 acts). **The corpus's first Safari-specific defect** — direct ancestor of E7 → T4-W1 → the P1 seal `6800af04` |
| PR-015 | "continue" | B S2:656 | **ADDRESSED** (12 acts) |
| PR-016 | **Author a pithy prompt to audit non-idiomatic tailwind, monolithic stylesheets (lack of colocation or encapsulation), deprecated styling, fragile rules** | B S2:718 — **COLOCATION EDICT BORN HERE** (`codex-prompt-ledger.md:70`) | **SPLIT.** Colocation half **ADDRESSED** — T2-W8 `c14995eb` "grand recursive colocation", T3's three-home rule; re-uttered 4× (cc §2). Monolithic-stylesheet half **LEDGERED CH-19** — `web/frontend/src/assets/index.css` is **842 lines** at HEAD, `@import "tailwindcss"` at :1 with inline `@layer` at :96/:455/:492/:815, HELD-again ×4 |
| PR-017 | `dev.sh` doesn't connect to the backend — ECONNRESET (re-issued S2:946, "the prior fix did not hold") | B S2:729, :946 | **ADDRESSED** `95894d8b` "Fix dev proxy backend port wiring", then **SUPERSEDED** — see §5 row S-06 |
| PR-018 | Commit + deploy to the ssh remote with `deploy.sh` | B S2:836, :1289 | **ADDRESSED** `95894d8b`/`37fc1403`/`bf1bd8fc`/`cefcc76a`; **SUPERSEDED** — see §5 row S-07 |
| PR-019 | Board numbers shifted down and right — align the underlying grid robustly; must generalize and scale | B S2:1001 | **ADDRESSED** (19 acts) |
| PR-020 | Board a bit smaller on mobile; sudoku header ~1rem from the mbabb logo + toggle bar — **test in a mobile-safari Playwright env** | B S2:1098 | **ADDRESSED** `bf1bd8fc` "Improve mobile board alignment and dev startup resilience". The mobile-Safari **verification demand** is the ancestor of E8/**CH-35** (real-device smoke, ride-4, still open) |
| PR-021 | At the bottom of the scroll that margin is fine on mobile — remove the added padding | B S2:1172 | **ADDRESSED** (4 acts) |
| PR-022 | A bit of padding; **match the padding-top of the mbabb darkmode ribbon**; on mobile the ribbon's L/R padding matches the sudoku header so the header is left-aligned with the mbabb icon; validate with Playwright | B S2:1195 | **ADDRESSED** (8 acts). **The mbabb-ribbon padding lineage that G1 re-raises four months later** — see §3.1 |
| PR-023 | Just a bit more, so the moon/sun doesn't occlude the board at all | B S2:1238 | **ADDRESSED** (10 acts). Recurs and is re-cured at T2-W5 (the 42×32 logo↔toggle contention, `T2-W5-S3-notes-layout-mobile.md:19`) |
| PR-024 | "commit and deploy" | B S2:1289 | **ADDRESSED** — `bf1bd8fc` + `cefcc76a` (32 acts) |

---

## 2. ERA 1 — the historical commit-sourced mandates (grand-uplift appendix B)

Disposition = **HEAD truth at `71456713`**, not what any recap asserts. T3 appendix B §1 and
`r1/plan-vs-landed.md` are cited where they already ruled.

| # | Mandate | Prov. | Disposition |
|---|---|---|---|
| PR-025 | R1 — port the solver Python→Rust, isomorphic API | C:9 | **ADDRESSED, narrowed** — `csp-solver/src/py/` + `tests-py/`; the *isomorphic-with-an-API* half is moot after the server abrogation (§5 S-06) |
| PR-026 | R2 — devirtualize constraint dispatch | C:10 | **ADDRESSED** — `CageSum`/`CageProduct` devirtualized enum variants on the fn-pointer value seam (T4-W13) |
| PR-027 | R3 — **no god modules (>500 lines)** | C:11, D3 §1, D4 `plan-vs-landed.md:111` | **PARTIAL — REGRESSED AGAIN AT HEAD.** `find csp-solver/src csp-solver/wasm/src -name '*.rs' -exec wc -l {} + \| sort -rn` → `builder/assignment.rs` **607**, `constraint/cage.rs` **558**, `solver/search.rs` **528**. Only `search.rs` carries a recorded waiver (T3 appendix A §2); **`assignment.rs` and `cage.rs` are named in no record** → **T5 candidate U-09** |
| PR-028 | R4 — no test files in src/ | C:12 | **ADDRESSED** after reversal — see §5 S-02 |
| PR-029 | R5 — delete the legacy Python solver | C:13 | **ADDRESSED** (code + docs, T2-W2/T4-W14) |
| PR-030 | R6 — web/ restructure | C:14 | **ADDRESSED** (W0 gitignore/scripts/CI paths) |
| PR-031 | R7 — fail explicitly, no silent handling | C:15 | **ADDRESSED** — the typed `CspError` family is the standing posture |
| PR-032 | R8 — decouple pencil UI from the CSP domain | C:16, D3 §1 | **ADDRESSED, reinforced** — `@pencil/*`/`@games/*` aliases + **7** restricted-import/boundary blocks in `web/frontend/eslint.config.*` |
| PR-033 | R9 — PRM across all animation loops | C:17 | **ADDRESSED** — centralized scheduler gate; carried upstream in pencil-boil |
| PR-034 | R10 — shared skin → pencil-boil, never glass-ui | C:18 | **HELD + SHARPENED** (zero glass-ui imports in the union adopt) |
| PR-035 | R11 — COP support | C:19 | **ADDRESSED** (B&B verified sound; n=12) |
| PR-036 | R12 — wasm bindings, solver + morph | C:20 | **ADDRESSED**; morph excised to `mkbabb/morph` (tag `pre-morph-excision`) |
| PR-037 | R13 — publish to the @mbabb suite | C:21 | **ADDRESSED** — **CH-04 CLOSED**: crate + wasm + `pyproject.toml:7` all `0.6.0`, crates.io `max_version` 0.6.0 (`cb3c7f5f`) |
| PR-038 | M1/M1b/M1c — keyframes/value/pencil-boil spec + lock (chronic ×2) | C:22 | **LEDGERED CH-07 — CLOSED-retire.** Excised T2-W5/R8; CLOSED-REJECT covenant T3; decided-retire T4-W11 |
| PR-039 | M2 — pencil-boil reactive-PRM teardown (chronic ×3) | C:23 | **ADDRESSED** — its own 0.5.0 changeset (W12) |
| PR-040 | M3 — Controls-LEFT | C:24 | **SUPERSEDED** — see §5 S-05 |
| PR-041 | M4/M4b — sun mascot lift (`useCelestialSun`) / roadmap | C:25 | **LEDGERED CH-23 — ride-6, the campaign's oldest row (2026-06-02).** Parked on a documented FAILED ≥2-consumer gate; `grep -rn useCelestialSun web/frontend/src` → **0**. Parked in **no living record** — T4 never restates the park |
| PR-042 | M5/M5b — DNS tuple / headers | C:26 | **ADDRESSED** — W5 + OD-4 |
| PR-043 | D1 — docs isomorphic with code, every number traces | C:27 | **ADDRESSED** at T4-W14 (`evidence/wgate/g2-counts.md` at `d70073f3`); **one live exception LEDGERED CH-32** — `.github/workflows/ci.yml:406` still cites the stale 222,436 B / 90,602 B band |
| PR-044 | D2 — root CLAUDE.md reflects the web/ layout | C:28 | **SUPERSEDED** — see §5 S-03 |
| PR-045 | G1 — no build artifacts tracked (11,406) | C:29 | **ADDRESSED** — W0 |
| PR-046 | C1 — deferred extensions documented | C:30 | **HELD**; the S-series is **CH-11 CLOSED-excise-note** |
| PR-047 | C2 — CHANGELOG coverage | C:31 | **ADDRESSED** — per-crate CHANGELOGs (W11) + W13 item 15 |

---

## 3. ERA 2 — the grand tranche + Tranche II (2026-07-04 → 2026-07-10)

| # | The ask (trimmed) | Prov. | Disposition |
|---|---|---|---|
| PR-048 | Develop a tranche to uplift the CSP backend + the sudoku demo + pencil-boil; 32-agent deep audit; 5-step pass loop to 100%; no quick solutions; no legacy; recap ALL prompts; fold every chronic; no god modules; DRY/KISS; colocation; decouple pencil from CSP; 10+ hours | A1 | **ADDRESSED** — `docs/tranches/2026-07-grand-uplift/` (14 waves), convergence 72→90→91→95; executed in full 2026-07-06 |
| PR-049 | "Continue. Re-deploy all workflows… batches of three agents in parallel to avoid rate limit walls. The limit has been fully reset. Pick up where they left off." | A2, A12/14/16/27/37/40/50/52/54/58/61/65/79 (**52 firings**) | **ADDRESSED** — the resume-by-`resumeFromRunId` playbook; the string became the cron the owner ordered at A46. **One ask-identity, 52 utterances** |
| PR-050 | Take design inspiration from handdrawn games (Yoshi's Story &c); a glass-ui ∪ pencil union is preferable; **prototype the union, don't decree it** | A3, A4 | **ADDRESSED** — "stationery, not glassmorphism"; the union adopt-partial ships zero glass-ui imports |
| PR-051 | Rename `wasm-morph`→morph and question whether it belongs here; **recursive colocation, a grand edict for ALL directories, FE + BE**; long dirs broken into modules; untrack node_modules; pencil decoupled from the games plural | A5, C §"2026-07-05 edict" | **ADDRESSED** — morph excised (`pre-morph-excision`); colocation executed T2-W8 `c14995eb`; `memory/colocation-edict-2026-07-05.md`. **Re-uttered 4×** |
| PR-052 | "I'd rather not call it skin… there is but one UI" | A6 | **ADDRESSED** — the layer is `src/pencil` |
| PR-053 | Pull precepts in as a proper submodule under docs | A8 | **ADDRESSED** — `docs/precepts` pinned `1f44742` |
| PR-054 | Deploy A **and** C concomitantly; the API box was `mbabb@… -p 1022`; keep FastAPI as reference; futoshiki = product surface; one coordinated release window | A9, C §"2026-07-04 ratifications" | **ADDRESSED at the time**; the A/C + FastAPI-reference rows later **SUPERSEDED** — §5 S-06 |
| PR-055 | Begin + continue the tranche indefatigably; do not relinquish control until complete IN TOTALITY; maximal parallelism; **authorized to publish/push/deploy**; core model orchestrates, Opus/Sonnet fan out | A10, A45, A73, A91 (**5×**) | **ADDRESSED + STANDING** — grand-uplift, T2, T3, T4 and P1 all executed under it; the 2026-07-31 restatement (A91) is recorded as self-authorizing |
| PR-056 | Find the Cloudflare credentials in the constellation (likely value.js); full deploy; spawn the dev server for me to audit | A21 | **ADDRESSED** — token at `~/Programming/value.js/.env`; CF Pages project `sudoku`; the dev-server half became the standing :3001 rule (**4×**) |
| PR-057 | What of the full frontend with NO dockerized backend — what was made, what remains, what are the plans? | A22 | **ADDRESSED** — answered; became the T2 abrogation IFF question |
| PR-058 | **Make the logo itself a dropdown selector for the gametype; make it bigger** | A23a | **SUPERSEDED** — see §5 S-08 |
| PR-059 | **"The mbabb logo is not the right font, and is not padded correctly, no?"** | A23c — flagged UNADDRESSED by A§3 and by registry FAM-G **G1** | **ADDRESSED** — resolved in §3.1 below. `8913023e` (2026-07-06 21:23:03 -0400, **68 min after the ask**); live at `AttributionCard.vue:115-120` |
| PR-060 | Adopt glass-ui golden typography and other glass-ui utilities everywhere, in a grand audit | A23b | **ADDRESSED** — `8913023e` (17 `--type-*` rungs, 39 sites re-railed); `web/frontend/src/assets/typography.css` |
| PR-061 | Next tranche: demo STAYS here; more backend optimization; abrogate the python server IFF parity (keep the py bindings); tests never inline; interrogate examples/benches/data; remove all CLAUDE.md + CONTRIBUTING; remove docker if the server goes; glass-ui gaps; mobile; no overengineering; 32-agent audit | A24, D2 §3 T2-1…T2-9 | **ADDRESSED** — Tranche II closed 98.2% (`3b75eca2`); CLAUDE.mds folded `ede25188`; CONTRIBUTING inlined + deleted at T4-W14 |
| PR-062 | Drive T2 development: monitor passes, run Fable synthesis, compute convergence, surface owner decisions via AskUserQuestion, don't stop until authored | A25, A26, A34, A36, A41, A42 (**6×**) | **ADDRESSED** — authored `3cadd1e4` + `ccb4a00b` |
| PR-063 | Were the other workflows genuinely re-deployed? Did they finish? Did they all die? | A28, A29 | **ADDRESSED** — became the liveness-probe playbook |
| PR-064 | "Re-dploy. There's nothing running." | A30 | **ADDRESSED** |
| PR-065 | Check pass liveness — real token counts, not 252ms/0-token deaths; >20min idle = hung, stop and isolate | A31, A35, A39 | **ADDRESSED** — the 252ms/0-token heuristic + the >20min-idle rule are the standing playbook |
| PR-066 | **"you must use a fable agent for any and all frontend design plugin work"** + use it for hardening and critique | A32, A33 | **ADDRESSED + STANDING** — carried in every standing-constraint block; **re-uttered 6×** |
| PR-067 | "Harden, refine, and criquite this with the same discipline: 32 agents in workflows. **I am not confident in the partial completions and many interruptions**" | A38 | **ADDRESSED** — 32-agent adversarial forensics: zero corrupted reports, zero HEAD-drift contamination |
| PR-068 | **"No deferrals. Ratify the above."** + glass-ui usage? + dir/module restructuring FE+BE? + **SOTA full dep currency, "no 2021 cargos"** | A43, D2 §3 T2-5 | **ADDRESSED** — README owner-line resolved; `waves/T2-W8-colocation.md`; the exhaustive-currency gate at T2-W1 (`ccb4a00b`); stable pin, PyO3 0.29, Vite 8, TS 6, Node 24. **One residue LEDGERED CH-20** (TS 7.x HELD at `package.json:55` `~6.0.3`, named re-trigger) |
| PR-069 | "Finish Tranche II… **STOP after the report** — authoring was the mandate" | A44 | **SUPERSEDED** — see §5 S-09 |
| PR-070 | "Ensure robustness: create a cron in light of session limits" — and later, ensure it doesn't conflict, doesn't bloat context, and is cleaned up | A46, A47 | **ADDRESSED** — cron created (job `efaae137`), the three guardrails codified at D3 §4, crons cleaned at the 2026-07-14 pause |
| PR-071 | "The current workflow died." / "Continue from where you left off." | A48, A49, A76, A82 | **ADDRESSED** — `resumeFromRunId` each time |
| PR-072 | T2 ballot R1–R9: full abrogation · fold + MIT · ratify wholesale · substrate excise · purge + e2e-CI · stable pin + keyframes excise · retire the never-push-csp-solver order | A85, D2 §4 | **ADDRESSED** — all nine discharged (D2 §4 map); R5's java half **REVERSED**, §5 S-04 |
| PR-073 | T3 ballot: No PyPI + maximal prune · ratify 0.4.0 · three-home rule + relocate · index.css Drop | A57, D3 §2 | **ADDRESSED** ×3; the index.css row is **LEDGERED CH-19** |
| PR-074 | Continue T2 execution: W1 gates → W1b → W1c; W8b grain → W8c; then W2/W3/W4/W6 per the DAG; then W6/W11-ph1, W9, W10, W12, W13; **credentials verified live**; **bbnf re-vendor LOCAL, NEVER PUSHED** | A11, A13, A15, A17, A18 | **ADDRESSED** — CI 7/7 green; releases live; **CH-50 DECLARED** (never-push bbnf, re-declared at every close) |

---

## 4. ERA 3 — Tranche III + the execution-era owner audits (2026-07-10 → 12)

| # | The ask (trimmed) | Prov. | Disposition |
|---|---|---|---|
| PR-075 | Full closure requires spawning the project locally | A51a, D4 T3-1 | **ADDRESSED** — the :3001 dev server, standing |
| PR-076 | Better encapsulation + modularization FE and BE api; **deploy workflows to specify**; update the tranche set | A51b, D4 T3-2 | **PARTIAL** — encapsulation FOLDED (D3 §3 Mandate I); the **"deploy workflows to specify"** clause has no recap row (`grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/` → 0; D4 F4). Subsumed *de facto* by the `npm run deploy` pipeline (`65425697`), the connection never drawn → **T5 candidate U-08** |
| PR-077 | `sudoku_api.rs` — split into a module, or removed if deprecated? | A51c, D4 T3-3 | **ADDRESSED** — KEEP-prune-rename → `csp-solver/src/py/sudoku.rs`; not deprecated |
| PR-078 | `wasm/src/isomorphic.rs` — still needed? | A51d, D4 T3-4 | **ADDRESSED — EXCISED** (460 L, 7 exports); file absent at HEAD |
| PR-079 | The python bindings — optimal? comprehensive? structured well? SOTA as of July 2026 | A51e, D4 T3-5 | **ADDRESSED** — W3 maximal prune + W5 abi3/hand stub/stubtest |
| PR-080 | The 5-step convergence pass loop, iterated to 100%, then author the exact tranche | A1, A51f, A88 (**3×**) | **ADDRESSED + STANDING** — formalized 2026-07-31 as `memory/convergent-design-loop.md` (≥3 passes, earned 100%) |
| PR-081 | The dropdown's border is not aligned properly | A53a, D4 T3-8a | **ADDRESSED** — T3-W10 F1 px-native `HandDrawnOutline` + radius-aware wobble |
| PR-082 | The "solved it" star is pointless; the metadata must be deftly integrated; **NO modal**; stars and gold; perhaps a golden board | A53b, A60a, D4 T3-8b/E2 | **ADDRESSED** — T3-W12 `b4d7aedf` (gold crest ~3.0s, no modal) |
| PR-083 | Re-take the darkmode toggle SVGs with greenfield critique agents; it should act as Yoshi's Story and be closer to how it was BEFORE; warp like a storybook-popup | A53c, A60c, A63e, D4 T3-8c/E2/E3 | **ADDRESSED** — THE BLOOM toggle, T3-W12 + T3-W13 `bbeb2b87` |
| PR-084 | The futoshiki↔sudoku transition needs defined keyframed choreography (`keyframes.js`?) | A53d, D4 T3-8d | **ADDRESSED** — F6 page-turn ≈1.05s; keyframes.js re-adoption ruled CLOSED-REJECT (**CH-07**) |
| PR-085 | The heart must be incorporated into the solved item, in Yoshi's-Story language | A53e, D4 T3-8e | **ADDRESSED** — T3-W9 felt heart + `YOSHI_COLORS`; the Nintendo-mark rephrased at T4-W14. **Residue LEDGERED CH-31** — the `YOSHI_COLORS` symbol rename, 11 live refs, ride-3 orphan |
| PR-086 | The boiling is too hairline; the outline changed; the sun's spiral contrast is awful — restore both | A60b, A60d, D4 E2 | **ADDRESSED** — T3-W12 `b4d7aedf` |
| PR-087 | A strange artifact in the top-left corner of the board | A60e, D4 E2 | **ADDRESSED** — T3-W12 |
| PR-088 | **The controls should function as a drawer sliding out from *under* the board**, board + logo centring and growing to accommodate, fully animated; not from the top right; **smoother, glass-congruent easing** | A60f, A64, D4 E2/E4 | **ADDRESSED** — T3-W13 S5 + S3′, `cubic-bezier(0.32,0.72,0,1)@520ms`. **Successor ask open** — mark 2 (the drawer *animation*) → **IN-FLIGHT** at PR-124 |
| PR-089 | Explicate the begotten waves and any questions of me | A55 | **ADDRESSED** — waves explicated, ballots raised |
| PR-090 | Ratify the questions with your idiomatic, design-congruent defaults | A56 | **ADDRESSED** — all at Recommended |
| PR-091 | "Spawn the dev server for me to audit. **The java branche stays.**" | A62, D4 E1 | **ADDRESSED + STANDING** — **CH-17 CLOSED-declared**: `git branch -a --list '*java*'` → `java`, `remotes/origin/java` both present. The delete-order it overturned: §5 S-04 |
| PR-092 | Idle-page performance is awful; the drawer animation is not right AT ALL; peek/hint need pencil draw-ins; why are the boil animations so non-performant — from first principles | A63a-d, D4 E3 | **ADDRESSED** — T3-W13 `bbeb2b87` (idle 0 recurring paints, prod 7.99 fps, pencil draw-ins) |
| PR-093 | **"The darkmode toggle animation renders in a low-res variant on animation — this is totally wrong"** | A63e, D4 E3; recurs as **E4 mark 4** | **ADDRESSED — but only at the third attempt.** T3-W13 did not durably cure it; recurred verbatim 2026-07-31. Cured at P1-W3 `387cceea` (opsz pin + intrinsic=capture-px + subset re-derive) → production. **A durable-cure failure worth its own T5 row** — see U-10 |
| PR-094 | Fix the OOM; what other issues are extant; **kill all crons** | A66, D4 E6 | **PARTIAL** — OOM root-caused + closed (`65425697`, wrangler pinned, `npm run deploy`); **"kill all crons" is homed by no tranche doc** (`grep -rin "kill all cron" docs/tranches/` → 0; D4 F3). Enumeration-closed at T4-W0 (`CronList` empty) but never recapped → **T5 candidate U-07** |
| PR-095 | Why does `npx wrangler --version` take so long? | A67 | **ADDRESSED** — the owner's own run died with the identical OOM stack |
| PR-096 | "ALL workflows." (re-deploy scope) | A68, D4 E5 | **ADDRESSED** — all three W13 workflows inventoried |
| PR-097 | **"The performance in safari is god awful and nearly entirely unusable. What pencil boil facilities might we change — without a compromise in quality and design. Profile."** | A69, D4 E7 | **ADDRESSED — at the second campaign.** T4-W1 proved the mechanism (WebKit re-executes feTurbulence+feDisplacementMap per opacity flip); the complaint **recurred verbatim-in-spirit 2026-07-31** (PR-118) and only then reached a durable cure at seal `6800af04` |

---

## 5. ERA 4 — Tranche IV: formulation, mid-tranche insertions, close (2026-07-12 → 07-15)

| # | The ask (trimmed) | Prov. | Disposition |
|---|---|---|---|
| PR-098 | M0/M1 — plan the Safari wave + a further refinement; 32-agent deep audit; recap ALL prompts; every ask homed or ledgered; **NOT an implementation phase** | A70, D4 M0/M1 | **ADDRESSED** — T4 authored `b8772f5c`, ratified `731ebf49`, executed `aa77860e` |
| PR-099 | M2 — no quick solutions; **NO legacy: clean breaks, no aliases, no shims, no dual paths, no masking fallbacks**; a chronic riding 2+ closes un-decided is a DISEASE row; silent drops forbidden | A70, D4 M2 | **ADDRESSED as policy, VIOLATED in fact.** `r1/chronic-ledger.md` §2d: **nine rows (CH-24/25/26/27/28/29/47/48/49) appear nowhere in the T4 record** despite its 100%-closure claim — "they were not decided, they were *dropped*" → **T5 candidate U-11** |
| PR-100 | M3 — 32 agents as steerable budget; diverse lenses; **withhold the favored success narrative**; adversarial vs the close-class lies; concrete deliverables, file:line, failing probes | A70, D4 M3 | **ADDRESSED + STANDING** — re-uttered 3–4× incl. the active T5 order |
| PR-101 | M4 — Fable owns cognition; ALL design through Fable + the frontend-design plugin; Opus/Sonnet fan out; every spawn declares its model; 3-wide batches | A70, D4 M4 | **ADDRESSED + STANDING** — **8×** (cc §2) |
| PR-102 | M5 — partial progress registry-tracked; terminal disposition per item; counting a partial as done is forbidden | A70, D4 M5 | **ADDRESSED as policy; see U-11** |
| PR-103 | M6 — return contract: plan folder, wave specs **born RED**, π/DELTA for every visual claim | A70, D4 M6 | **ADDRESSED** — the born-RED gate table is the T4 wave-file grammar |
| PR-104 | M7 — excise legacy · total test re-formulation · **abrogate PWA** · modern rust/wasm · no stale deps · idiomatic Vue + glass-ui · knip-class superfluity hunt · **all docs no-meta under MIKE-STYLE** · refine the readme | A70, D4 M7 | **ADDRESSED** — split W4/W2/W3/W5/W10/W4/W14. PWA verified gone: `grep -rn "vite-plugin-pwa\|test:pwa" web/frontend/package.json web/frontend/vite.config.ts` → **0 hits** |
| PR-105 | M8 — expand the game scope, KISS, with this engine; **Crosswords?** | A71a, D4 M8 | **ADDRESSED** — 5 games shipped; **crosswords DECIDED-retire on the record**, quoted at §3.2. Deep bench **LEDGERED CH-22** (5 BANK rows with named re-triggers) |
| PR-106 | M9a — better hints; what are our hint heuristics? | A71b, D4 M9 | **ADDRESSED** — the technique engine (T4-W7) |
| PR-107 | M9b — better partial solving | A71c, D4 M9 | **ADDRESSED** — T4-W8 (assists/marks, partial solve) |
| PR-108 | M9c — **"perhaps an overall progress bar deftly integrated into the border of the board"** | A71d — flagged UNKNOWN by A§3, registry FAM-G **G2** | **ADDRESSED** — resolved in §3.2. T4-W9 `8875d261`, CI run `29276164982`; live at `HandDrawnGrid.vue:26,71-85,449-458` |
| PR-109 | M9d — better game quality with displayed heuristics | A71e, D4 M9 | **ADDRESSED** — `games/shared/DifficultyTally.vue` + `solveTally.ts` (T4-W9 part b) |
| PR-110 | M9e — a game-selection screen that transforms the board into a **Wii-Shop-style carousel**, in our idioms, game-agnostic | A71f, D4 M9 | **ADDRESSED** — the sketchbook carousel (T4-W12), `useFlipGlide`, one live board via Teleport. **Successor ask open** — mark 1 (picker refinement) → **IN-FLIGHT** at PR-123 |
| PR-111 | M10 — better performance; distil code into atomic precepts; **REDUCE lines and complexity** | A71g, D4 M10 | **ADDRESSED** — `defineGame` contract, ~1,600–1,900 net LOC removed (T4-W11) |
| PR-112 | Pre-compaction: performance audit of the frontend (in Safari, under load), the backend, and the wasm facilities | A72 | **ADDRESSED** — `wf_0efce0e9-861`: 29 rows / 26 CONFIRMED / 3 CORRECTED / 0 REFUTED, stamped `ed35b347` |
| PR-113 | **E8 — the mobile recut**: abrogate the custom keypad for bounded native entry (iOS-congruent focus &c); KISS mobile variants of hints &c; tap-hold/vibration via a modern web API if possible; Safari + mobile perf still awful | A74, D4 E8 | **PARTIAL** — WM landed the API truth (`navigator.vibrate` never in WebKit; `inputmode="numeric"`; pointerdown + ~450ms long-press); the keypad abrogated (**CH-10**, build-then-abrogate). **The device claim is blocked**: **CH-35 — E8 real-iPhone smoke, ride-4, HARD DISEASE**; the keypad rig is **CH-40**, "CHARACTERIZED, not closed", 3 passes |
| PR-114 | Robust rate-limit-wall handling and resume | A75, A87 | **ADDRESSED** — `memory/limit-wall-protocol.md`; hardened scripts (AUDIT prepend, null guards, `{walled}` returns) |
| PR-115 | **E9 — destructive-action confirmation + a robust undo spine**: conditional confirm on board-destructive actions; undo/redo race-free, KISS, 100–200 actions; indirect storage (pointers, dedup, "perhaps a trie/tree") | A78a, D4 E9 | **ADDRESSED** — T4-WU `766aa068`; cap 200; delta log + content-hash board pool (the trie adjudicated against on arithmetic: 200 deltas ≈ 6 KB vs 200 raw 16×16 ≈ 500 KB) |
| PR-116 | **E9's three named design questions**: does difficulty need an undo · should the difficulty control read as next-game · **"should we slightly change the design to the board size + difficulty to 'bake' a game? — differentiate it from the live controls?"** | A78b — flagged UNKNOWN by A§3, registry FAM-G **G3** | **ADDRESSED** — resolved in §3.3. All three answered on the record at `2026-07-tranche-4/README.md:148`; landed T4-WU `766aa068`; live at `GameControlPanel.vue:84-86,110-113`. **Successor ask open** — mark 5 (Deal weight, drawer composition) → **IN-FLIGHT** at PR-127 |
| PR-117 | Pause, clean up the crons, halt; then make the progress durable for handoff; then "Continue" | A80, A81, A82 | **ADDRESSED** — crons cleaned; `HANDOFF-2026-07-13.md`; halt lifted 2026-07-15 |
| PR-118 | "Approved for deployment. Ratify" / "All are approved. Validate with the browser — ensure safari and mobile performance curves are perfected" | A83, A84 | **ADDRESSED-then-OVERRULED** — see §5 S-10 |

---

## 6. ERA 5 — the P1 patch + the design loop (2026-07-31 → 2026-08-01)

| # | The ask (trimmed) | Prov. | Disposition |
|---|---|---|---|
| PR-119 | **"The extant website is a performance mess on both desktop and particularly safari IOS."** Use a real Safari, mobile thereof, with dev tools; expect root-library (pencil-boil) tweaks; drive to full implementation and deployment; patch the tranche with wave addenda; ultrathink, ultracode | A86 | **ADDRESSED** — T4-P1 sealed `6800af04` (WGATE §9.1); root cause 63–81 glyph grain filters re-executed by WebKit per 125ms beat; filterBudget 99–123→9 census-enforced; idle 97.6+, long33 0. **iOS half blocked on CH-35** |
| PR-120 | **The thrice design protocol** — Fable ∥ Opus competing orthogonal designs, a Fable adjudicator agglomerates the apotheosis; Opus 5 the workhorse, Fable 5 the orchestrator; **extreme parsimony, KISS-forward, fewer LOC, library-level thinking**; little time on contrived gates, most on direct implementation + visual verification | A87 | **ADDRESSED + STANDING** — `memory/fable-for-design-work.md`, `memory/model-roles-and-parsimony.md`; **re-uttered 2×** (again in the active T5 order) |
| PR-121 | "How can we learn from our last several months of mistakes using the burning lucidity of Fable?" | A87 | **ADDRESSED** — retrospective `wf_bf4ad962-16e` → `memory/lessons-from-t2-t4.md`, 8 mistake families each with a forward RULE |
| PR-122 | **The convergent multiagent design loop** — round-zero portfolio of orthogonal families; passes of RESEARCH(≤8, batch 5–6)/SYNTHESIZE/PROTOTYPE/CRITIQUE(failure-mode checklist)/AGGLOMERATE; **convergence is earned**: zero enumerated gaps + non-author adversarial audit + two consecutive clean passes, ≥3 passes; a best-effort summary is unacceptable | A88, E-protocol | **ADDRESSED + STANDING** — `memory/convergent-design-loop.md`; four passes executed (`design-loop/pass{1,2,3,4}-registry.md`), round-zero portfolio = five families |
| PR-123 | **Mark 1 — "our game picker interface could be refined"** | A88, E1 | **IN-FLIGHT** — design-loop **Lane A / family F4 "THE DEALER'S RITUAL"** (`pass2-registry.md:19`, ADVANCE 52% → pass-4 adjudicator rows). **LEDGERED CH-61** (marks 3/5/6 ride-2K+4-passes). Not shipped |
| PR-124 | **Mark 2 — "as could our drawer animation for controls"** | A88, E2 | **IN-FLIGHT** — carried by **Lane B/C** as freight-reduction rather than curve retuning (`round0-portfolio.md:37`: "the drawer shrinks… so the existing 520ms glide reads cleaner without retuning"). Mechanism attribution landed at pass 3 (grid raster-stack re-bake, 4× `createImageBitmap` 79–195 ms ≈ 98% of the bill) — **LEDGERED CH-51** (the adjacent gallery-fold frame, explicitly NOT merged) |
| PR-125 | **Mark 3 — "as could ALL of our mobile interfaces"** | A88, A92, E3 | **IN-FLIGHT + LEDGERED CH-58 (BLOCKING) and CH-61.** `pass4-registry.md:96`: pageVh **1.705 both arms** at 390×664, "still not claimable"; "this cut ships pass-4 cures, not the ALL-mobile claim". Third pass carrying it. Related owner rows: **CH-39** landscape device, **CH-40** keypad rig |
| PR-126 | **Mark 4 — "the resolution of the sudoku logo / dark mode toggle — why are these so low res?"** | A88, E4 | **ADDRESSED** — P1-W3 `387cceea` (M1 intrinsic = cssSize×dpr; M2 opsz pinned identically on measure + bake; the fraunces subset re-derived over all five labels — it was missing `m` and `n`, so "ther**m**o"/"kenke**n**" fell to Georgia mid-word). Production: wordmark sharp + complete, toggle-ink cured. **Residues LEDGERED CH-43** (logo-light-darwin re-baseline, ratified) / **CH-42** (toggle-crest-dark flake, watch-only, NO re-baseline) |
| PR-127 | **Mark 5 — "this ui is not good — the deal icon is oddly small; the entire check area is contrived and not naturally integrated"** | A90, E5 | **PARTIAL + IN-FLIGHT.** The zone grammar landed at P1: six eyebrows became two, `GameControlPanel.vue:263-283` ("That flat rank is the owner's 'contrived'"), CHECK re-cut into `teacher's`, candidates into `pencils`. **The Deal-weight half is NOT cured** — it is problem-brief item 1 across all five charters (`charter-f1.md` §1: "the sole commit verb of the staged zone is a 28px `DiceIcon` + caption sublabel, visually subordinate to the option lists it commits"). **LEDGERED CH-61** |
| PR-128 | **Mark 6 — "mobile interface still sucks and this area takes up far too much space — think of this from first principles"** | A92, E6 | **PARTIAL + IN-FLIGHT.** The first-principles ruling was banked and half-executed: the tally re-homed onto the deal's receipt (`GameControlPanel.vue:102-104` "it files with the deal"); F3's sub-1280 tally restore is called "the cleanest deliverable of the pass" (`pass4-registry.md`). The band's dissolution is not complete — **CH-61** names mark 6 open, earliest earned-100% **pass 6** |
| PR-129 | "Continue indefatigably through deployment and implementation." | A91 | **ADDRESSED + STANDING** — recorded as self-authorizing: G2.4 ballot at C/C/C, the B2 font ruling, pencil-boil releases + npm publishes, all deploys via `npm run deploy`, no further per-step approval |
| PR-130 | "What was done, and what remains?" | A93 | **ADDRESSED** — answered 2026-08-01 (P1 sealed, tasks #70–74 complete) |
| PR-131 | Formalize it: the post-tranche audit + next-tranche formulation prompt (32 agents, dispositions, born-RED gates, π/DELTA) | A94 | **SUPERSEDED** — see §5 S-11 |
| PR-132 | **The active T5 order** — audit the last 100+ tranches and sessions with lurid, exacting detail: what's been communicated again and again, what's properly implemented, what's half-baked; unearth the session logs **across both Claude Code and Codex**; a three-hour window; **your own archeological dig**; scribe edicts of robustness and session-durability, lose no progress to session walls | A95 | **IN PROGRESS** — this matrix is one of its artifacts; the corpora it merges are the others |
| PR-133 | **"full shadcn abrogation (in components and style)"** + consolidation/pruning of unused, overfit, or contrived components | A95, cc §2 | **UNADDRESSED** → **T5 candidate U-01.** Cited by the owner as a *recall* of a prior edict; **that prior utterance is in neither corpus.** Corpus B TASK B places the earliest `shadcn` occurrence at 2026-03-10 in `bbnf-lang` (`sessions/2026/03/10/rollout-…928.jsonl:7`), 55 occurrences corpus-wide, **zero in a csc411-cwd session**. **UNKNOWN** whether the csc411 edict was ever uttered or was carried over from value.js |
| PR-134 | **Use a proper Safari MCP** — all browser and simulation sessions run in the background, never stealing the user's focus | A95 | **UNADDRESSED / LEDGERED CH-45** — "no Safari MCP configured this session, headless-only probes" |
| PR-135 | Audit the frontend components and their proposed structure in particular | A95 | **IN PROGRESS** — `r1/component-census.md`, `r1/dead-code-census.md`, the R2 dup-matrix lane |
| PR-136 | Distillation and reduction of the library into an apotheosis | A95 | **IN PROGRESS** — the T5 DISTILL wave input; the ancestor row PR-111 landed at T4-W11 |
| PR-137 | Operate constrained to the next three-hour window; be indefatigable; lose no progress to session walls | A95 | **IN PROGRESS** — the wall-audit-first discipline every R1/R2 lane runs under |

---

## 7. DEEP-RESOLVE — the three rows that carried no disposition anywhere

### 7.1 · G1 — "the mbabb logo font/padding" → **ADDRESSED**

**The ask, verbatim** (A23, 2026-07-07T00:15:06.439Z, attached to `Screenshot 2026-07-06 at 20.14.35.png`):
> "The mbabb logo is not the right font, and is not padded correctly, no?"

**(a) Did the P1 wordmark work (capture-intrinsic bake) address the ask as phrased? NO.** Two independent proofs:

1. **Different element.** The mbabb logo is the `@mbabb` attribution byline —
   `web/frontend/src/pencil/chrome/AttributionCard/AttributionCard.vue`. The P1 wordmark work is the
   *game* wordmark, `pencil/chrome/HandwrittenLogo/`, plus `pencil/…/raster.ts`. Command:
   `git log --oneline --since=2026-07-30 -- web/frontend/src/pencil/chrome/AttributionCard/` → **zero commits.**
   The same window over `HandwrittenLogo/` returns `387cceea` "P1-W3 group C: the fill-mode cures, the
   progress gate, the opsz pin, the B2 subset, five holds."
2. **Different defect class.** P1's marks are *resolution* (M1 WebKit intrinsic-size pinning, M2 opsz
   divergence, the subset missing `m`/`n`) — `design-refinement-marks-2026-07-31.md:21-24`. The 2026-07-07
   ask is *font identity* and *box padding*. Neither is a rasterization defect.

**(b) What actually addressed it: `8913023e`,** 2026-07-06 21:23:03 -0400 = 2026-07-07T01:23Z — **68 minutes
after the ask**, in direct response. Its body answers both halves by name:

> "@mbabb fixed at the root: the Vue-scoped 'font-family: inherit' (specificity 0,2,0 via [data-v])
> defeated the template's font-mono utility (0,1,0) — trigger now computes 'Fira Code', monospace,
> **padded on the √φ rhythm** with a ≥44px hit target."

**Live at HEAD, both halves:**
- font — `AttributionCard.vue:120` `font-family: var(--font-mono, "Fira Code", monospace);` with the
  specificity trap documented in place at `:105-110`.
- padding — `AttributionCard.vue:118` `padding: 0.618rem 0.786rem;` (the √φ rhythm), and the wrapper
  flush-to-corner change at `:85` ("the inset from the edge now comes from `.attribution-trigger`'s own
  padding, not a gap on this wrapper").

**Why every corpus missed it.** The owner's turn A23 carried **three** asks (logo-as-picker · glass-ui
golden typography everywhere · the mbabb font/padding). The T2 recap homes it as one line — `2026-07-tranche-2/appendices/B-prompt-recap.md:25` **"| @mbabb attribution fix | ADDRESSED | `8913023e` |"** — under a
wording that does not contain the owner's words *font* or *padding*, so no later grep for the ask's phrasing
ever found the row. **A homing-vocabulary failure, not an execution gap.** Verdict: **ADDRESSED — no T5 row.**

### 7.2 · G2 — "board-border progress bar" → **ADDRESSED**; and the crosswords retire does **NOT** cover it

**The ask, verbatim** (A71, 2026-07-12T23:13:53.214Z — one turn, seven sub-asks):
> "…perhaps an overall progress bar deftly integrated into the border of the board…"

**Searched: all corpora + `evidence/design-loop/**`.** The trail is complete and it closes:

| Stage | Artifact | Evidence |
|---|---|---|
| Corpus row | the owner ask is homed as **M9** | `2026-07-tranche-4/evidence/corpus/owner-prompts.md:48` |
| Market anchor | A4 "board progress indicator on the border" — P1, "owner explicitly requested" | `evidence/x/x1-market-assay.md:72` |
| Design lane | the full spec + FOLD disposition, `family_hint: market-gap-progress-border` | `evidence/x/x5-progress-quality.md:15,43,75-82` |
| Adversarial correction | x1's `HandDrawnOutline` host is **wrong**; the closed `frame` path lives in `HandDrawnGrid` | `evidence/r3/r3-expansion-crit.md:24,137` |
| Wave | **T4-W9 — the progress border + displayed quality**, born RED ("no progress signal on the frame") | `2026-07-tranche-4/README.md:60`; `waves/T4-W9-progress-border.md:1-3` |
| Gates | A-1c twin: futoshiki 5×5 half-filled → `strokeDashoffset` **500** at `pathLength=1000`, stroke `rgb(139,92,246)`, `filter: none`, 4 poses, aria "board 50% filled" | `evidence/w9/gates.md:28`; `evidence/w9/p1-border.md:15-20` |
| **Landed** | `8875d261` "T4-W9: the progress border — the frame fills violet, the tally tells the truth", CI run `29276164982` | `WGATE-record.md:26` |
| **Live at HEAD** | `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — `:26` `progress?: number`; `:78-85` the clamp + `traceDashOffset = 1000 * (1 - progress)`; `:290-296` `role="progressbar"` with `aria-valuetext="board N% filled"`; `:449-458` the `.progress-pose` trace layer on `var(--color-progress-ink)` | read at `71456713` |
| Survival | untouched by later waves; W11's `defineGame` distillation kept it (`evidence/w11/r4-record.md:58`), WU's gates confirm no tally/progress file touched (`evidence/wu/gates.md:76`) | — |

The cc ledger's caveat ("W9 added a `:progress` prop… no closing evidence in-log") is a **log-scope
artifact**: the closing evidence is in-tree and in the WGATE record, not in the session log the ledger was
allowed to read.

**The crosswords half of the same turn — does its retire rationale cover the progress-bar half? NO.**
The retire is scoped strictly to the *game*, on two engine walls. Quoted in full, `2026-07-tranche-4/README.md:188`:

> "**Full clued crosswords** | **RETIRE (ROW 5)** — two verified walls: a real per-length word bank
> overflows the u128 domain ceiling (`bitset.rs:38`), and clue authoring is non-CSP/NLP (an offline-wasm
> violation); the only re-trigger is a curated ≤128-word grid-fill-only variant, which strays from the
> digit idiom"

and at `WGATE-record.md:138`:

> "crosswords DECIDED-retire on the two verified walls (construction is CSP-solvable but clue authoring is
> not a CSP — a bundled corpus or an online LLM breaks the offline-wasm/KISS model)"

Both walls are **solver-domain** facts (`csp-solver/src/domain/bitset.rs:39` `assert!(v < 128, …)` is real —
confirmed by `r1/plan-vs-landed.md:367`). Neither says anything about a board-frame fill gauge. The two
sub-asks were correctly split at authoring: crosswords → **M8** → W13 ROW 5; the progress bar → **M9** →
W9. **Two asks, two dispositions, both terminal.** Verdict: **ADDRESSED — no T5 row.**

### 7.3 · G3 — "bake a game control differentiation" → **ADDRESSED**, with a live successor

**The ask, verbatim** (A78, 2026-07-13T16:50:32.365Z, inside the E9 turn):
> "…should be slightly change the design to the board size + difficulty to 'bake' a game? — differentiate
> it from the live controls?"

**Searched: the loop's deal/picker work + the T4 E9 triumvirate.** Answered on the record and landed:

| Stage | Artifact | Evidence |
|---|---|---|
| Corpus row | named as one of E9's three open design questions the write **must** answer | `evidence/corpus/owner-prompts.md:71` |
| Research | size + difficulty are both *inputs to the next deal*, not live controls | `evidence/e9/r1-census.md:117` |
| Algorithmics | "**'Bake a game' surface** = make board-size **arm-not-live** (retire the `watch(size)` live re-deal)" | `evidence/e9/r2-algorithmics.md:201,215` |
| Design | **"Q3 — board-size + difficulty into a 'bake a game' staging surface? RECOMMENDED: YES"**, with the staged-zone layout drawn | `evidence/e9/r3-design.md:10,30,126,137` |
| Ruling of record | "The three owner questions answered from the mechanism: difficulty needs NO undo (it arms the next deal, mutating nothing); it should read as next-game (it already is — the label lies); **size+difficulty stage behind one guarded Deal (size goes arm-not-live)**" | `2026-07-tranche-4/README.md:148` |
| Verb election | the owner's word "bake" adjudicated against the shipped verb — a ratify-me row, decided **"Deal"** | `WGATE-record.md:147`; `HANDOFF-2026-07-13.md:97` |
| **Landed** | `766aa068` "T4-WU: the undo spine — every action undoes, **the game bakes before it deals**", CI run `29284479290` | `WGATE-record.md:28` |
| **Live at HEAD** | `web/frontend/src/games/shared/GameControlPanel.vue` — `:84-86` "The shell renders the New-game zone" over n-generic `ControlSection[]`; `:110-113` "the re-homed dice, the 'Deal' commit: **it lifts out of the live action row into the staged New-game zone and commits the staged sections**"; `:89` "Gates the coarse two-tap: a DIRTY Deal / Clear arms first, a pristine board acts instantly" | read at `71456713` |
| P1 refinement | the zone grammar re-cut: "SIX EYEBROWS BECOME TWO… Size and Difficulty keep the eyebrow register (they caption the **staged** inputs and they earn it)" — Marks/Check/Candidates demoted a rank | `GameControlPanel.vue:263-283` |

**Design-loop coverage — the successor, not the same row.** The differentiation *exists*; what the loop is
still working is the **weight** of its commit verb, which is the owner's later mark 5. Problem-brief item 1,
shared verbatim by all five charters (`charter-f1.md` … `charter-f5.md`):

> "**Deal affordance weight ≪ its rank**: the sole commit verb of the staged zone is a 28px `DiceIcon` +
> caption sublabel, visually subordinate to the option lists it commits (`GameControlPanel.vue`
> `.deal-row`/`.deal-btn`)."

Family **F4 "THE DEALER'S RITUAL" (Lane A)** owns it — `pass2-registry.md:19` ADVANCE 52%; `f1-critique.md:360`
grades the pass-1 attempt "Zero artifact… ≈ 10%". So: **G3 ADDRESSED at T4-WU**; its successor is **PR-127
(mark 5), IN-FLIGHT, CH-61**. Verdict: **ADDRESSED — no new T5 row; the successor is already booked.**

---

## 8. UNADDRESSED — with a proposed owning wave

Eleven rows. Each names the wave that should own it in T5. Rows already ledgered as CH-xx are **not**
repeated here — they belong to the DECIDE wave the chronic ledger prescribes.

| ID | The unaddressed ask | Provenance | Why it is open | **Proposed owning wave** |
|---|---|---|---|---|
| **U-01** | **Full shadcn abrogation** — components *and* style; consolidate or prune unused / overfit / contrived components | PR-133 · A95 | Uttered as a *recall*; the recalled utterance is in **neither** corpus. `shadcn` earliest = 2026-03-10 bbnf-lang, 55 occurrences, **zero csc411-cwd**. Whether an original csc411 edict exists: **UNKNOWN** | **T5-W-ABROGATE** (the shadcn + component-contrivance excision) — must open by asking the owner to confirm the edict's scope |
| **U-02** | A proper **Safari MCP**, background-only browser/sim sessions, never stealing focus | PR-134 · A95 · **CH-45** | No Safari MCP configured; every 2026-08-01 probe was headless | **T5-W0-RIG** (the real-surface rig) — it also unblocks CH-35/39/40 |
| **U-03** | **Mark 1 — the game picker** | PR-123 · E1 · CH-61 | Lane A ADVANCE at 52%; no shipped artifact | **T5-W-PICKER** (design-loop Lane A landing wave) |
| **U-04** | **Mark 2 — the controls-drawer animation** | PR-124 · E2 · CH-51 | Attribution landed (raster-stack re-bake ≈98% of the stall); cure not shipped | **T5-W-DRAWER** (Lane B/C landing wave) |
| **U-05** | **Mark 3 — ALL mobile interfaces** | PR-125 · E3 · **CH-58 BLOCKING**, CH-61 | pageVh 1.705 both arms; "this cut ships pass-4 cures, not the ALL-mobile claim"; third pass carrying | **T5-W-MOBILE** (F3 carrier + Lane C's uncashed T-prime collapse) |
| **U-06** | **Marks 5 + 6 residue** — Deal weight; the solve-status band's full dissolution | PR-127/128 · E5/E6 · CH-61 | Zone grammar landed; Deal weight and the band's dissolution did not | folds into **T5-W-PICKER** / **T5-W-MOBILE** |
| **U-07** | **"Kill all crons, too."** | PR-094 · A66 · D4 F3 | `grep -rin "kill all cron" docs/tranches/` → **0**. Enumeration-closed at T4-W0 (`CronList` empty) but homed by no recap row | **T5-W-RECAP-HYGIENE** (close-ceremony cure) |
| **U-08** | **"deploy workflows to specify"** (the T3-2 middle clause) | PR-076 · A51 · D4 F4 | `grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/` → **0**. Subsumed *de facto* by `65425697`; the connection is nowhere drawn | **T5-W-RECAP-HYGIENE** |
| **U-09** | **R3 no-god-modules regressed again** — `builder/assignment.rs` **607 L**, `constraint/cage.rs` **558 L** | PR-027 · C:11 | Only `search.rs` (528) carries a recorded waiver. The two larger files are named in no record — including `r1/plan-vs-landed.md:111`, which discusses only `gac/mod.rs` and `search.rs` | **T5-W-SPLIT** (the solver-module split; same shape as T3-W4) |
| **U-10** | **Durable-cure failure as a class** — the toggle low-res mark took **three** attempts (T3-W13 → recurrence → P1-W3); the Safari perf mark took **two** (T4-W1 → recurrence → P1) | PR-093, PR-097 | Each individual cure landed; the *class* — a mark declared cured that the owner re-marks — has no forward rule. `memory/lessons-from-t2-t4.md` covers 8 families; the owner-re-mark family is not among them by name | **T5-W-RECAP-HYGIENE** — add the rule: a design mark closes only on an owner-side re-look, never on an internal gate |
| **U-11** | **Nine chronic rows dropped, not decided, at the T4 close** (CH-24/25/26/27/28/29/47/48/49) | PR-099/102 · `chronic-ledger.md` §2d | T3 claimed "Zero deferrals minted"; T4 claimed "the disposition ledger closes at 100%". Both false against these nine. Second occurrence ⇒ **class defect in the close ceremony** | **T5-W-DECIDE** (terminal disposition per chronic row) + the **ledger-diff gate**: a close must machine-diff its ledger against the prior close's open set |

**Two record-integrity notes** (not asks, but they corrupt any future recap):
- `f1adfca5` is cited in commit position throughout the P1 record (production tree). `git cat-file -t f1adfca5`
  → *"fatal: Not a valid object name"*. It is a **Cloudflare deployment id**, the same trap
  `chronic-ledger.md:203` flags for `a8174110` / `781fc09c`.
- **CH-16** (`?board=` permalinks for thermo/killer/kenken) landed — all three `*UrlState.ts` exist — and is
  closed by no record. A banked row that quietly landed is the mirror of one that quietly didn't.

---

## 9. SUPERSEDED — with the superseding words quoted

| ID | The original ask | Superseded by | The quote |
|---|---|---|---|
| **S-01** | **Mobile digit pad** — built on the T3 ratified default "digit pad = BUILD" (T3-W11) | **T4-WM**, eight days later | `WGATE-record.md:24` / **CH-10**: *"the digit pad abrogated, **the OS keyboard is the keyboard**"*. Owner order A74: *"We must abrogate the custom keypad and instead allow for proper bounded input with the standard mobile text entry."* **A build-then-abrogate pair — the most expensive shape a deferral can take; neither record cross-references the other** (`chronic-ledger.md:193`) |
| **S-02** | **R4 — inline tests HELD** with two blessed exceptions (grand-uplift W13) | T2-W3 `ed07ba6b` | Owner (A24): *"all test files MUST be placed in a tests/ dir--NEVER inline within the file."* T2 appendix B:13: *"R4 inline-tests \| HELD (2 inline exceptions blessed by W13) \| **REVOKED** — tests never inline → T2-W3 migrates both modules"* |
| **S-03** | **D2 — the root CLAUDE.md reflects the web/ layout** | T2-W7 `ede25188` | T2 appendix B:14: *"D2 CLAUDE.md \| ADDRESSED (rewritten pithy) \| **SUPERSEDED** — removal + fold → T2-W7."* Standing today: *"Repo has NO CLAUDE.md by design"* |
| **S-04** | **R5 — delete the `java` branch** (+ `origin/java`), carried as an open owner action to WGATE | Owner ruling, 2026-07-11 | Owner (A62): ***"The java branche stays."*** T3 appendix B:107: *"**REVERSED** — the branch STAYS; owner ruling verbatim: *'The java branch STAYS'*."* The reversal went unregistered for a full tranche — `r1-prompt-recap.md` F1 calls it *"a lie in the record: an executor following the WGATE owner-reminders would delete a branch the owner explicitly ordered kept"* |
| **S-05** | **M3 — Controls-LEFT** (settled, exemption re-recorded at grand-uplift) | E2/E4, T3-W13 | Owner (A64): *"the controls should slide from out and under the board, not from the top right. The bouncy-and easing curves should be adjusted to be smoother and more congruent with glass-ui."* Landed as the under-board glass drawer, `cubic-bezier(0.32,0.72,0,1)@520ms` |
| **S-06** | **The FastAPI server + Docker + the Option-A/C concomitant deploy + `dev.sh`'s backend proxy** (PR-054, PR-017) | T2-W2 `98fe2562` | T2 appendix B:36: *"T2-2 \| Server abrogation IFF parity + perf; py/ KEPT \| **CONDITION MET, R1 ratified** → W2."* Commit: *"T2-W2: abrogation — the server, docker, and nginx go."* T3 appendix B:20 records the five downstream obsoletions: *"all downstream of T2-W2's server abrogation — the surface each presupposes was removed with a recorded rationale"* |
| **S-07** | **`deploy.sh` to the ssh remote** (PR-018) | CF Pages + `npm run deploy` | T2-W2 deleted `deploy.sh` with the compose trio and nginx. The pipeline of record: *"deploy ONLY via `npm run deploy`"* — the npx-packument OOM trap, `WGATE-record.md:185-199` |
| **S-08** | **"Make the logo itself a dropdown selector for the gametype"** (PR-058) | T4-W12, ballot row 14 | `waves/T4-W12-carousel.md:113`: *"HandwrittenLogo/useGameMenu.ts + listbox   **RETIRE (superseded by the gallery)**   DELETE."* Ballot: `WGATE-record.md:158` *"wordmark opens the gallery + dropdown retirement \| W12 \| **default yes**."* Rationale, `T4-W12-carousel.md:160`: *"One game-select surface (no dual paths); the fold IS the delight the owner asked for, cost is one Enter."* The *bigger* half of the ask survives — the height ladder went one golden rung up at `8913023e` |
| **S-09** | **"STOP after the report — authoring was the mandate; execution awaits the owner"** (PR-069, A44, 2026-07-10T04:50) | A45, **9 minutes later** | *"Ensure: Begin and continue the current tranche… indefatigably… NO quick solutions, NO workarounds… authorized to publish, push, and pull… deploy anything and everything via Cloudflare."* T2 went straight to execution and closed at 98.2% |
| **S-10** | **"All are approved. Validate hereupon with the browser — ensure safari and mobile performance curves are perfected"** (PR-118, A84) — discharged by a **19/19 Playwright-WebKit** battery | A86, 2026-07-31 | *"The extant website is a performance mess on both desktop and particularly safari IOS. **Leverage and use an actual safari browser**, mobile thereof, and with dev tools target what's killing the rendered performance."* The owner's word overruled the green battery. `memory/lessons-from-t2-t4.md` names the family: **proxy ≠ surface** — *"proxy verification passed while reality failed"* |
| **S-11** | The first formalization prompt (PR-131, A94, 2026-08-01T16:54:43) | A95, **3 minutes later**, same text expanded | A95 adds the archeological mandate the first lacked: *"the last 100+ tranches, and the last 100+ sessions MUST be audited with lurid, fastifiouds, an exacting detail… an agent swarm that especially and actually unearths our session logs (across both Claude Code and Codex)."* |

---

## 10. Standing edicts — the friction ledger

Re-utterance count is the friction signal. Every count below is cc-prompt-ledger §2's, re-read at
`71456713`; the two Codex-born rows carry their birth line.

| Edict | Born | Re-uttered | Enforced by |
|---|---|---|---|
| NO quick solutions / NO workarounds — idiomatic, gestalt | **2026-03-04, HERE** (B S2:271) | **8×** | posture only — **no repo-durable encoding** |
| NO legacy code; clean breaks, no shims/aliases/dual paths | 2026-03-04 (B S1:332) / 2026-07-04 | **6×** | `knip`, the dead-code census |
| Recap ALL prompts; silent drops forbidden | 2026-07-04 | **6×** | this matrix |
| Fold every deferred + chronic item; re-booking forbidden | 2026-07-04 | **6×** | `chronic-ledger.md` — **violated at T4, U-11** |
| Batches of 3 agents (widened to 5–6 in the 2026-07-31 loop) | 2026-07-04 | 52 cron replays + 3 | the workflow scripts |
| **abrogate unsubstantiated claims / editorializing / comparison sentiments** | **2026-03-04, HERE** (B S1:792) | 3× in one session, then MIKE-STYLE | T4-W14 meta-leak grep = literal zero |
| **Recursive colocation, ALL dirs, both stacks** | **2026-03-04, HERE** (B S2:718) | **4×** | `c14995eb`, the three-home rule, ESLint boundaries (7 blocks) |
| ALL design on Fable + the frontend-design plugin, actually invoked | 2026-07-04 | **6×** | the design-loop charters |
| Core model orchestrates; Opus/Sonnet fan out; every spawn declares its model | 2026-07-04 | **8×** | `memory/model-roles-and-parsimony.md` |
| No god modules >500 L | 2026-07-04 | 3× | **REGRESSED — U-09** |
| Tranche development only; no source edits from a formulation prompt | 2026-07-04 | 5× | the plan-folder-only write surface |
| Concrete deliverables: file:line, failing probe; reject status reports | 2026-07-12 | 4× | born-RED gate tables |
| Withhold the favored success narrative from most auditors | 2026-07-12 | 3× | the R1/R2 lane briefs |
| Born-RED gates; π/DELTA for every visual claim | 2026-07-12 | 4× | the wave-file grammar |
| NEVER push bbnf-lang origin | 2026-07-06 | every close | **CH-50 DECLARED**; `sync-csp-solver-vendor.sh` |
| The java branch STAYS | 2026-07-11 | 6 blocks | **CH-17** |
| Dev server :3001 stays alive | 2026-07-06 | **4×** | standing blocks |
| SOTA dep currency, "no 2021 cargos" | 2026-07-07 | 3× | the T2-W1 exhaustive-currency gate; **CH-20** residue |
| Session-durability; lose no progress to walls | 2026-07-10 | 3× | `memory/limit-wall-protocol.md` |
| Continue indefatigably; don't relinquish control | 2026-07-05 | **5×** | — |
| The thrice design protocol (Fable ∥ Opus → Fable adjudicates) | 2026-07-31 | 2× | `memory/fable-for-design-work.md` |
| Extreme parsimony; process-lite, code-heavy | 2026-07-31 | 2× | `memory/model-roles-and-parsimony.md` |
| Convergence is earned (≥3 passes, non-author audit, 2 clean) | 2026-07-31 | 1× | `pass{1..4}-registry.md` |
| **Full shadcn abrogation** | 2026-08-01 (as a recall) | 1× | **none — U-01, origin UNKNOWN** |
| Background-only browser sessions / a proper Safari MCP | 2026-08-01 | 1× | **none — U-02 / CH-45** |

**The friction reading.** The three most re-uttered edicts (no-workarounds 8×, model-routing 8×, no-legacy 6×)
are the three with the **weakest repo-durable encoding** — they live in prose and memory, not in a gate. The
two edicts *born in this repo* — abrogation and colocation — are the two that did get mechanical enforcement
(the meta-leak grep; the ESLint boundary blocks) and neither has been re-uttered since T3. That correlation
is the T5 friction wave's whole argument: **an edict re-uttered is an edict unencoded.**

---

## 11. Counts

| Class | Rows |
|---|---|
| **ADDRESSED** (SHA / file:line / gate) | 96 |
| **ADDRESSED + STANDING** (a rule still in force) | 24 of the above |
| **LEDGERED** (CH-xx carries the terminal decision) | 14 |
| **IN-FLIGHT** (design-loop lane) | 6 |
| **SUPERSEDED** (§9) | 11 |
| **UNADDRESSED** → T5 candidate (§8) | 11 |
| **UNKNOWN** (stated, not guessed) | 3 — the shadcn edict's origin (U-01); whether any of the 24 cwd-less Codex rollouts is a csc411 session; whether other crons existed at E6-time (U-07) |
| **Total ask-identities** | **137** |

**FAM-G resolution (the registry's R2 charge):** **G1 ADDRESSED** (`8913023e`, `AttributionCard.vue:118,120`) ·
**G2 ADDRESSED** (`8875d261`, `HandDrawnGrid.vue:26,78-85,449-458`; the crosswords retire covers only the
crosswords half, quoted) · **G3 ADDRESSED** (`766aa068`, `GameControlPanel.vue:84-86,110-113`; the live
successor is mark 5, CH-61) · **G4 ABSORBED** (marks 3/5/6 → CH-61 + U-03…U-06) · **G5 CONFIRMED**
(abrogation and colocation were both born in this repo on 2026-03-04, Codex-side).
**Three of the five FAM-G rows were never unaddressed — they were unfindable.**

ROW-COMPLETE
