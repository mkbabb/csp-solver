# R1 — the chronic / deferred ledger, with ride-counts

**Lens.** Every row ever phrased as *banked · deferred · owner action · books to · re-trigger · follow-up · still open · held · watch-only* across (1) the memory ledgers, (2) `docs/tranches/**/WGATE-record.md` + wave/appendix records, (3) `2026-07-grand-uplift/appendices/{B-prompt-recap,D-deferred-foldin}.md`, (4) the tranche READMEs' banked sections. Each row carries first-booked date, owner (owner-the-human vs the-agent), the closes it rode, verified current state, and a ride-count.

**Tree of record.** `git log -1` → `71456713` (2026-08-01 04:23:26 -0400, "CI-RED 30690204551: the empty bake is the runner's…"). All greps/finds below ran at that HEAD unless a SHA is named.

**Ride-count convention.** The number of *closes* (§0) the row was open across **without a terminal DECIDED disposition landing at that close**. A row decided at close *n* stops counting. `≥2` ⇒ DISEASE (§2).

**Prior art consumed, not duplicated.** `docs/tranches/2026-07-tranche-3/evidence/audit32/A14-chronically-deferred.md` (the C1–C14 cross-tranche chronic set) and `docs/tranches/2026-07-tranche-4/evidence/r1/chronic-ledger.md` (D1–D7 at `65425697`). This ledger re-verifies both against `71456713` and extends them through the P1 patch and the 2026-08-01 design-loop cut.

---

## 0. The close list — verified, and extended

The task seeded five closes. The records show **seven** gates a row can ride. Every SHA below was resolved with `git log -1 --format='%ci %s' <sha>`; the two IDs that resolve to nothing are Cloudflare deployment IDs, not commits, and are labelled as such.

| # | Close | Date | SHA / id | Verification |
|---|---|---|---|---|
| **K1** | grand-uplift (tranche 1) | 2026-07-06 | `dc5bd4c4` (W13 doc-truth) → `d43fae28` ("deploy: OD-4 executed + full Pages cutover — the tranche is live") | `git log --oneline --since=2026-07-05 --until=2026-07-07`; memory `grand-tranche-2026-07-04.md:20` "EXECUTION COMPLETE 2026-07-06" |
| **K2** | tranche 2 | 2026-07-10 | `3b75eca2` | `T2-WGATE: re-certification — first-party GAC probe, ledger close` |
| **K3a** | tranche 3 — WGATE | **2026-07-11** | `d0893614` | `T3-WGATE: record + recert — the tranche closes, the ledger holds`. **Extension:** the seeded list dates T3 to 07-12; the tranche closed *twice* |
| **K3b** | tranche 3 — W13 re-close | 2026-07-12 | `bbeb2b87` | `T3-W13: motion-perf recut…`; memory `t2-execution-progress.md:12` "the record re-closed at `bbeb2b87`" |
| **K4a** | tranche 4 — WGATE | 2026-07-15 | `aa77860e` (gate tree `d70073f3`) | `WGATE-record.md:5`; `T4-WGATE: the record — the ledger closes at 100%` |
| **K4b** | tranche 4 — post-close addendum §9 | 2026-07-15 | `32198688` | `WGATE record §9: the post-close deploy/ratify/validate addendum`. **Extension:** §9 re-opened and re-closed the record after K4a; rows rode it |
| **K5** | P1 Safari/iOS patch seal (WGATE §9.1) | 2026-07-31 | `6800af04` | `P1-W4 seal: production re-pass green on f1adfca5 — the patch clo…` |
| **K6** | design-loop pass-4 cut + production | 2026-08-01 | deployments `a8174110` → `781fc09c`; trees `52ef014a` → `95b2efd8` → `71456713` | `git log -1 a8174110` → no such object (**deployment id, not a commit**); memory `t4-formulation…:107,109`. **Extension:** not a tranche close, but a shipped gate rows rode past |

Design-loop **passes 1–4** (2026-07-31 → 2026-08-01, registries at `scratchpad/design-loop/pass{1,2,3,4}-registry.md`) are *internal* gates. Rows born there carry a **pass-ride-count** stated in the row, not a K-count.

---

## 1. The ledger

Owner column: **H** = owner-the-human (Mike Babb; only he can fire it), **A** = the-agent/engineering, **X** = out-of-repo (another repo's maintainer).

### 1a. Rows that reached a terminal DECIDED disposition (closed — no action)

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-01 | 2026-07-10 (T2-W1) | Dependabot 9 alerts vs `web/api/uv.lock` — "justified-hold" | A | K2, K3a, K3b | **CLOSED.** `gh api repos/mkbabb/csp-solver/dependabot/alerts --jq 'select(.state=="open")'` → only #68/#69, both `web/frontend/package-lock.json`. Zero against `uv.lock`. Dismissed #50–58 at T4-W0 (`WGATE-record.md:92`) | 2 (was DISEASE) | CLOSED ✓ |
| CH-02 | 2026-07-10 (T2 standing) | prettier global-shadow: no in-repo config, bare `--write` | A | K2, K3a, K3b | **CLOSED.** `web/frontend/.prettierrc.json` present (106 B, mtime Jul 13); `package.json:18` `"lint": "prettier --check src/"`. Decided-build at T4-W4 (`WGATE-record.md:74`) | 2 (was DISEASE) | CLOSED ✓ |
| CH-03 | 2026-07-10 (T3 pass-2) | `mod.rs` → self-named-file flip + clippy lock | A | K3a, K3b | **CLOSED.** `find csp-solver/src -name mod.rs \| wc -l` → **0**; root `Cargo.toml:61` `mod_module_files = "deny"` (with the inverted-lint-id correction at :54-60) | 2 (was DISEASE) | CLOSED ✓ |
| CH-04 | 2026-07-11 (T3) | core version outruns crates.io ("0.4.0 unpublished"), no owner/trigger — orphan | A | K3a, K3b | **CLOSED.** `csp-solver/Cargo.toml` + `wasm/Cargo.toml` + `pyproject.toml:7` all `0.6.0`; crates.io API `max_version`/`newest_version` = **0.6.0**. Published 0.4.0@W0 → 0.5.0@WM → 0.6.0 post-close (`WGATE-record.md:172`) | 1 | CLOSED ✓ |
| CH-05 | 2026-07-12 (T3-W13) | GPU single-tile RasterTask residue ~8/s, two fixes falsified | A | K3b | **CLOSED.** Superseded by the T4-W1 N-layer bitmap bake, measured 0.08/s (`WGATE-record.md:83`) | 1 | CLOSED ✓ |
| CH-06 | 2026-07-11 (T3 WGATE §7) | `propagate_stratified` wire-in — scoped backlog, owner+trigger+spec | H | K3a, K3b | **CLOSED-retire.** `grep -rn propagate_stratified csp-solver/src` → **0**; decided-retire at T4-W13 ROW 8 (`WGATE-record.md:84`) | 1 | CLOSED ✓ |
| CH-07 | pre-K1 (T1 M1, chronic ×2) | `keyframes.js` spec+lock / later re-adoption | A | K1, K2, K3a/b | **CLOSED-retire.** Excised wholesale T2-W5/R8; CLOSED-REJECT covenant T3; decided-retire T4-W11 (`WGATE-record.md:85`) | 2 (decided K2) | CLOSED ✓ |
| CH-08 | 2026-07-06 (T1→T2 L25-20) | `gac_alldiff` differential-oracle hypothesis, tripwire-bound | A | K1, K2, K3a/b | **CLOSED-landed.** `csp-solver/tests/oracle_and_invariance.rs:1-20` — the AllDifferent brute-force oracle + GAC on/off differential, "merged from `gac_alldiff_oracle`… at T4-W2" | 2 (landed T3-W6) | CLOSED ✓ |
| CH-09 | 2026-07-10 (T2 §G, D16) | `apiError`/`solverError` twins unification | A | K2, K3a/b | **CLOSED-hoisted.** `web/frontend/src/games/shared/solver/{classifyError,describeError,protocol,transport}.ts` — the shared classifier lives once, per T3's three-home rule | 1 | CLOSED ✓ |
| CH-10 | 2026-07-10 (T2 §G, L15) | mobile digit pad — trigger = mobile usage evidence | A | K2, K3a/b | **CLOSED, twice-decided.** BUILT at T3-W11 (`t2-execution-progress.md:29` "digit pad = BUILD"), then **ABROGATED** at T4-WM ("the OS keyboard is the keyboard", `WGATE-record.md:24`) | 1 | CLOSED ✓ |
| CH-11 | 2026-07-06 (T1 D:S1/S2/S4) | S-series crate extensions: TieredCostEval · `solve_with_warm_start` · tracing spans | A | K1, K2, K3a/b | **CLOSED-excise-note.** `grep -rn 'TieredCostEval\|solve_with_warm_start' csp-solver/src` → 0; `grep -rn tracing csp-solver/Cargo.toml csp-solver/src` → 0. T3 §1 FOLD-EXCISE-note → W3 | 2 (decided K3a) | CLOSED ✓ |
| CH-12 | 2026-07-06 (T1 N11) | wall-clock budget in `SolveConfig` + dead `Timeout` | A | K1, K2, K3a/b | **CLOSED-RESERVE.** `csp-solver/src/error.rs:63-64` — `// reserved: no constructor until cancel-driver` above `Timeout,`; Display arm at :78. Ballot Q2/R-3, "no third defer" | 2 (decided K3a) | CLOSED ✓ |
| CH-13 | 2026-07-12 (T3-W13) | B5 owner-taste sheaf: sun ray-comb 125 ms re-jitter · wring twist −15° · Bloom crest 1.092 · divider grain-hoist SSIM 0.9752 exception · celebration rainbow ink | H | K3b | **CLOSED-RATIFIED 2026-07-15** (`WGATE-record.md:139`, ballot B5 — "the owner's word ('Ratify')"). *Note:* the divider's 0.9752 subject was later pinned pose-0 on Apple vendors at `fb15253d` | 1 | CLOSED ✓ |
| CH-14 | 2026-07-10 (T2 W0/T3 §3) | mimalloc A/B (chronic ×2) · PGO · wasm `opt-level=s` | A | K1, K2, K3a/b | **CLOSED defer-closed with re-entry criteria** (`C-deferred-disposition.md:80-88`). At HEAD `grep -n mimalloc csp-solver/Cargo.toml` → **0 hits** (even the reserved-slot comment is gone). Branch `worktree-wf_34cf008e-c2c-17` retained for the unlanded attack work (`git branch --list 'worktree-*'`) | 2 (decided K3a) | CLOSED ✓ |
| CH-15 | 2026-07-15 (T4 §5) | crates.io 0.6.0 bump + publish incl. pyproject parity (F-2) | H | K4a | **CLOSED-EXECUTED 2026-07-15** on the owner's approval, `cb3c7f5f` (`WGATE-record.md:172`). Verified with CH-04 | 0 | CLOSED ✓ |
| CH-16 | 2026-07-15 (T4 §5) | `?board=` permalinks for thermo/killer/kenken | A | K4a, K4b, K5, K6 | **LANDED, never recorded closed.** `web/frontend/src/games/{thermo/composables/thermoUrlState.ts, killer/composables/killerUrlState.ts, kenken/composables/kenkenUrlState.ts}` all exist. No record closes it ⇒ **record gap** (§4) | 0 (landed) | CLOSED-unrecorded |
| CH-17 | 2026-07-15 (T4 §3.3) | the `java` branch — delete-order overruled, "STAYS" | H | K4a→ | **CLOSED-declared.** `git branch -a --list '*java*'` → `java`, `remotes/origin/java` both present | — | WATCH-ONLY |
| CH-18 | 2026-08-01 (pass-2/M5) | traps row "headless-WebKit carousel snap indices" | A | — | **WITHDRAWN 2026-08-01** — "there was no trap, the headless engine was right"; one defect, two acts (`t4-formulation…:107`) | 0 | CLOSED-withdrawn ✓ |

### 1b. HELD by explicit decision (a hold is a disposition; re-entry on the same trigger)

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-19 | 2026-07-10 (T2-W8, `c14995eb`) | `index.css` C1/C2 `@layer` partial extraction | A | K2, K3a/b, K4a/b, K5, K6 | **HELD-again, proof banked.** `web/frontend/src/assets/index.css` = **842 lines**, monolithic, `@import "tailwindcss"` at :1 and inline `@layer base/utilities` at :96/:455/:492/:815. No partials dir. T3 ballot Q4 ruled DROP/HELD-again with byte-identity banked (`C-deferred-disposition.md:90-98`) | 4 held-by-decision | HELD (healthy) |
| CH-20 | 2026-07-13 (T4-W5) | TypeScript 7.x — frontend HELD at 6.0.3 | A | K4a/b, K5, K6 | **HELD.** `web/frontend/package.json:55` `"typescript": "~6.0.3"`. Named re-trigger: `typescript-eslint` peer `<6.1.0` unblocks. pencil-boil already at `^7.0.2` | 3 held-by-trigger | HELD (healthy) |
| CH-21 | 2026-07-15 (T4 §5) | W8 mount idle-chunking residual (D7) | A | K4a/b, K5, K6 | **DECIDED-retire-with-measurement**, then re-banked with the do-not-reopen floor 89 ms@1× / 355 ms@4× (`WGATE-record.md:75,176`). Trigger = a mid-device above-band trace; unfired | 2 pre-decision (was DISEASE), 3 post | HELD (healthy) |
| CH-22 | 2026-07-15 (T4 §4f) | banked game set: Skyscrapers · Arrow · Kakuro · Sandwich · Hidato/Numbrix | A | K4a/b, K5, K6 | **BANKED with per-row triggers** (`2026-07-tranche-4/README.md:169-183`); retire rationales recorded for Binairo/Hitori/Nonograms/Word-search/crosswords | 3 held-by-trigger | HELD (healthy) |
| CH-23 | 2026-06-02 (grand-audit:80) | M4 `useCelestialSun` sun-glyph lift to pencil-boil | A | K1, K2, K3a/b, K4a/b, K5, K6 | **PARKED on a documented FAILED gate** (≥2-consumer rule; no second consumer wants the glyph). `grep -rn useCelestialSun web/frontend/src` → **0**. **Absent from the T4 ledger entirely** — the park is asserted nowhere after T3 (`C-deferred-disposition.md:74`) | **6** | §2 DISEASE-BY-LETTER |

### 1c. Trigger-bound, un-decided — still open

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-24 | 2026-07-06 (T1 →T2 L25-12) | event-lite propagation's full priority model — "still last" | A | K1, K2, K3a/b, K4a/b, K5, K6 | No `EventLite`/priority queue in `csp-solver/src/solver/`. T3 marked it "trigger-bound (unfolded)"; **T4 names it nowhere** | **6** | §2 DISEASE |
| CH-25 | 2026-07-06 (T1 →T2 L25-22) | SE/HoDoKu-class difficulty rater | A | K1, K2, K3a/b, K4a/b, K5, K6 | `grep -rn 'HoDoKu\|rate_difficulty' csp-solver/src \| wc -l` → **0**. Its own T2 text: "large, unbooked, **no trigger**" — an orphan by the campaign's own invariant. Absent from T4 | **6** | §2 DISEASE (orphan) |
| CH-26 | 2026-07-06 (T1 →T2 L25-36) | Futoshiki N=7/N=8 solve cliff re-measure | A | K1, K2, K3a/b, K4a/b, K5, K6 | Node-frozen; fires only on a propagation-strength change. Trigger named and unfired. Absent from T4 | **6** | §2 DISEASE-BY-LETTER (trigger healthy) |
| CH-27 | 2026-07-10 (T2 §G, D23) | §8b bitset-parallel GAC | A | K2, K3a/b, K4a/b, K5, K6 | T3 EXCLUDE — user-imperceptible (~0.3 ms on ~1 ms) + prototype-gated (`C-deferred-disposition.md:107`). Absent from T4 | **4** | §2 DISEASE-BY-LETTER |
| CH-28 | 2026-07-10 (T2 §G) | N=3-hard bank aggressive excision (3,591 B sparse) | A | K2, K3a/b, K4a/b, K5, K6 | Device-gated; **the run was never made** (`C-deferred-foldin.md:125`), conservative KEEP shipped; T3 §1 confirms "never run". Absent from T4 | **4** | §2 DISEASE |
| CH-29 | 2026-07-10 (T2 §G, Q2 §E) | `generate_templates.rs` N=5 arg-range refusal | A | K2, K3a/b, K4a/b, K5, K6 | **T3 claimed a fold that did not land.** T3 §1 shape = "FOLD-DO / W3-adjacent (soft)"; the file's last commit is `22514bae` **2026-07-10** (T2-W4) — untouched since, so the "next touch" trigger never fired. `:17` still advertises `5 -> 25x25`; `:85` still `expect("N must be an integer (2, 3, 4, or 5)")` | **4** | §2 DISEASE (declared capture missing) |
| CH-30 | 2026-07-15 (T4 §5) | wasm wire-dedup — trigger: a sixth game, or any solver wire >12k | A | K4a/b, K5, K6 | Five per-game workers at HEAD: `find web/frontend/src -name '*worker*'` → `{sudoku,futoshiki,thermo,killer,kenken}/solver/solver.worker.ts`. Trigger unfired (deck is five) | 3 | OPEN (trigger-bound) |
| CH-31 | 2026-07-15 (T4 §5) | `YOSHI_COLORS` source-symbol rename (atomic: const + 4 imports + 3 comments) | A | K4a/b, K5, K6 | `grep -rn YOSHI_COLORS web/frontend/src \| wc -l` → **11**. Not renamed. No trigger beyond "do it atomically" — an orphan-shaped bank | **3** | §2 DISEASE (orphan) |
| CH-32 | 2026-07-15 (T4 §5) | full-module wasm re-measure — refresh the stale `ci.yml` band comment | A | K4a/b, K5, K6 | **Still stale.** `.github/workflows/ci.yml:406` reads "222,436 B full / 90,602 B lean… the T2-WGATE re-measure"; the gate SHA measured **227,385 B** runner (`WGATE-record.md:51,174`). The trigger ("next size-touching wave") is arguable — P1 changed the CI file at :542-553 without refreshing it | **3** | §2 DISEASE |
| CH-33 | 2026-07-15 (T4 §5) | `docs/sudoku.md` deep sections for thermo/killer/kenken | A | K4a/b, K5, K6 | **Not written.** `docs/sudoku.md` headings stop at `## Futoshiki and the wider family` (:90); the three new games get **one paragraph** at the tail, no deep sections. Trigger ("the games ship") **FIRED at K4a** and the row did not move | **3** | §2 DISEASE (fired trigger, no action) |
| CH-34 | 2026-07-12 (T3-W13 g1-perf:59-60) | murmur full-viewport paint-damage class (solved state) | A | K3b, K4a/b, K5, K6 | Live: `web/frontend/src/pencil/composables/celebration.ts:2,14,25-29` (murmur beat-3 grammar, murmur cells + heart seat). T4-W1 adjudicated **QUALIFIED-GREEN** with a disclosed ~2.7/s root-bookkeeping residual and cell-layer promotion REJECTED — but **that adjudication exists only in the memory ledger** (`t4-formulation…:25`), never in `WGATE-record.md` | 1 pre-decision, 3 unrecorded | OPEN (record gap, §4) |

### 1d. Owner-the-human rows

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-35 | 2026-07-13 (T4-WM) | **E8 — device smoke on a real iPhone**; blocks any iOS claim | H | K4a, K4b, K5, K6 | Open. `WGATE-record.md:206` (T4 §7), :235 (§9 "Remaining owner rows"), :253 (§9.1 "still open and still the only thing that closes an iOS claim"); memory `t4-formulation…:109` lists it again at 2026-08-01 | **4** | §2 DISEASE |
| CH-36 | 2026-07-15 (T4 §9) | Cloudflare **zone RUM disable + zone purge scope** (deploy token lacks both) | H | K4b, K5, K6 | Open. `WGATE-record.md:233` (RUM refused by our CSP, "zone-level disable stays an owner action"), :235, :253 ("Zone RUM/purge scopes unchanged") | **3** | §2 DISEASE |
| CH-37 | 2026-07-31 (P1 §9.1) | **2 dependabot highs** on the default branch, "booked for review" | H | K5, K6 | Open, verified live: `#69 high postcss` and `#68 high sharp`, both `web/frontend/package-lock.json`. Cited again 2026-08-01 (`t4-formulation…:109`) | 2 | §2 DISEASE |
| CH-38 | 2026-07-31 (design pass-2) | **≥4 cold/blind readers** for the M4/M2 blind reads | H | K5, K6 (+ passes 2,3,4) | Open; "the campaign's spine now" / "the owner's single highest-leverage action, 4th pass carrying" (`t4-formulation…:107`, `pass4-registry.md:88`) | 2 K + **3 passes** | §2 DISEASE |
| CH-39 | 2026-07-31 (design pass-3) | landscape eye-on-glass / sim rotation device | H | K6 (+ passes 3,4) | Open; "no on-device landscape cells exist anywhere in the pass — owner row 2's cell, third pass" (`pass4-registry.md:103`); landscape PRICED at pass 4, election → team-lead ratification | 1 K + **2 passes** | §2 DISEASE |
| CH-40 | 2026-07-31 (design pass-2) | keypad rig row — **CHARACTERIZED, not closed** | H | K6 (+ passes 2,3,4) | Open; `pass4-registry.md:106-109` "still carries the keypad rig OWNER row; no OS keyboard ever raised; installFakeVisualViewport only… **The owner row stays**" | 1 K + **3 passes** | §2 DISEASE |
| CH-41 | 2026-08-01 | `lint:ink` → CI needs one runner run-id banked | H/A | K6 | **Wiring landed, evidence row open.** `.github/workflows/ci.yml:542` (ink-pressure gate comment) + `:553` `run: npm run lint:ink`; `package.json:21` `"lint:ink"`. The open half is the banked runner run-id (`t4-formulation…:109`) | 1 | OPEN (evidence) |
| CH-42 | 2026-08-01 | `toggle-crest-dark` golden flake — **watch-only, NO re-baseline** | H | K6 | Open watch. Proven on the pristine tree too; sun-crest clause governs (`t4-formulation…:107,109`). *Corrected at the pass-5 seal (D5-G1): the original "12/25 vs 19/25" reconciles to no banked arm or union of arms — r3's goldens-estate audit independently marked it UNKNOWN; the figure of record is the replacement tally at `design-loop/pass5/D/logs/crest-rate-tally.log`, plus W3-verify's HEAD control (5/6 breach on an unchanged tree, worst 1,028 px). Correction noted in place, nothing erased.* | 1 | WATCH-ONLY |
| CH-43 | 2026-07-31 (P1 §9.1) | `logo-light-darwin` AA fringe (identical 3948 px at 0.10.0/0.10.1) | H/A | K5, K6 | **Partly closed.** The darwin re-baseline election was **RATIFIED by the team lead** (6/6 across two trees, 11/11 after) at K6; the D-M3 authority-overstep breach "stays booked, no precedent" (`t4-formulation…:107`) | 1 | CLOSED-ratified + CH-52 residue |
| CH-44 | 2026-08-01 | annotated-if-it-recurs linux wordmark blank (runner-only terminal bake) | H/A | K6 | Booked at `71456713`: both bake-decoding specs poll the href for ink; only the vacuity guard yields, linux-only, LOUD, carrying its bitmap in the annotation (`t4-formulation…:109`) | 0 | OPEN (watch) |
| CH-45 | 2026-08-01 (T5 order) | Safari-MCP provisioning — "= a booked row" | H | — | Booked at the T5 order; no Safari MCP configured this session, headless-only probes (`t5-formulation-2026-08-01.md:25`) | 0 | OPEN |
| CH-46 | 2026-07-06 (T1) | the API reference box (EC2 `ssh -p 1022 mbabb@34.197.214.67`), owner self-deploys | H | K1…K6 | Standing declaration, "No tranche action" (`WGATE-record.md:209`) | — | WATCH-ONLY |

### 1e. Out-of-repo / never-push (EXCLUDE-justified, but still un-decided rows)

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-47 | 2026-07-06 (T1 L25-39) | bbnf-lang lattice behavioral confluence | X | K1, K2, K3a/b, K4a/b, K5 | `--verify`'s test stage is the practical check; never-push-bound; not csc411 authoring reach (`C-deferred-disposition.md:106`) | **5** | EXCLUDE (justified) |
| CH-48 | 2026-07-06 (T1) | morph rows: Float64Array wire (L25-08) · morph-core 0.2.0 publish (L25-42) · morph CI secrets (L25-43) · bbnf-buddy remote + `^0.2.0` bump/MRV call-site check (L25-41/44) · tier1_resample alloc (L25-46) | X/H | K1, K2, K3a/b, K4a/b, K5 | All OUT-OF-REPO post-excision to `mkbabb/morph`; owner actions at T1 close (`grand-tranche-2026-07-04.md:20`), re-booked T2 §D, EXCLUDEd T3 §5, **absent from T4** | **5** | EXCLUDE (justified; dropped from the record) |
| CH-49 | 2026-07-10 (T2 Q6 §3.5) | vendored-test prune completeness (bbnf `--update --delete` semantics) | X | K2, K3a/b, K4a/b, K5 | Trigger = the next re-vendor after T2-W3's. Absent from T4 | **4** | EXCLUDE (justified) |
| CH-50 | standing | NEVER push bbnf-lang origin; vendor syncs via `scripts/sync-csp-solver-vendor.sh --check/--update/--verify` | A | all | Standing order, re-declared at every close (`WGATE-record.md:86,191`) | — | DECLARED |

### 1f. P1-patch residuals + design-loop rows born 2026-07-31 → 2026-08-01

| ID | First booked | Row | Own | Rode | Current state — evidence | Rides | Status |
|---|---|---|---|---|---|---|---|
| CH-51 | 2026-07-31 (P1 §9.1:251) | gallery fold's structural ~150–176 ms frame — trigger: an owner mark on the fold | A | K5, K6 | Booked with trigger; attribution clean (7/7 ablation bundles, no P-W3 item). Design pass 3 later named a *different* mechanism for the drawer stall (grid raster-stack re-bake, 79–195 ms `createImageBitmap` ×4) — adjacent, not the same row | 1 | OPEN (trigger-bound) |
| CH-52 | 2026-07-31 (P1 §9.1:251) | theme swap's two full repaints — "lever spent" (panel twin shipped, budget 14→9) | A | K5, K6 | Booked; `web/frontend/src/pencil/config/filterBudget.ts:150` documents "The counted total (9 after the P1-W4 twin `v-if`; 14 before it)" | 1 | OPEN (accepted) |
| CH-53 | 2026-07-31 (P1 §9.1:251) | `undoBurst`'s ~55 fps floor — "wants a different instrument" | A | K5, K6 | Booked, no instrument named | 1 | OPEN (orphan-shaped) |
| CH-54 | 2026-07-31 (P1 §9.1:251) | sim idle AT the ≥59 floor inside ±2.5 noise | A | K5, K6 | Booked; flip-flops inside noise (dark 59.62 PASS / light 58.20 MISS in the last round) | 1 | OPEN (watch) |
| CH-55 | 2026-07-31 (P1 §9.1:251) | **Instrument law** — theme/gallery cells adjudicate interleaved-or-quiesced only; all rig comparisons pin `game/size/difficulty` | A | K5, K6 | Committed rule (`646c82ad`); box decays ~4 fps over ~23 min | 0 | DECLARED |
| CH-56 | 2026-08-01 | Playwright single-engine residue after the two-project fix: `mobile-*` pinned chromium; `share-truth` has no clipboard-write in PW-WebKit — "the estate's last single-engine surface, recorded" | A | K6 | `web/frontend/playwright.config.ts:34` (the comment naming the campaign-long chromium-only blindness), `:52-55` `projects: [chromium, webkit]`. The held-out surfaces are the open residue | 1 | OPEN |
| CH-57 | 2026-08-01 | **Process fault owned**: gated chains must `set -o pipefail` or read `gh run view --json conclusion` — never gate on an echo after a pipe | A | K6 | Standing rule banked after a deploy ran on a RED CI (`t4-formulation…:107`) | 0 | DECLARED |
| CH-58 | 2026-08-01 (pass-4) | **F3-G1 BLOCKING** — trigger (b), the owner's ALL-mobile mark (mark 3), pageVh 1.705, routed to Lane C's uncashed T-prime collapse | A | K6 (+ passes 2,3,4) | The last blocking row of pass 4; "trigger (b) NOT bought — this cut ships pass-4 cures, not the ALL-mobile claim" (`pass4-registry.md:96`, `t4-formulation…:107`) | **3 passes** | §2 DISEASE (design-loop) |
| CH-59 | 2026-08-01 (pass-4) | adjudicator rows: the guard's two names · eyebrow two-register · idle uniform-sign watch-row (n=5) | H | K6 | Booked at the pass-4 production pass (`t4-formulation…:107`) | 0 | OPEN |
| CH-60 | 2026-08-01 (pass-4) | D-M3 re-baseline **authority overstep** — "breach stays booked, no precedent" | A | K6 | Booked alongside the ratified re-baseline (CH-43) | 0 | OPEN (record row) |
| CH-61 | 2026-07-31 (marks file) | The owner's four/six design marks: game picker · controls-drawer animation · ALL mobile interfaces · logo/toggle low-res · drawer content composition · the mobile solve-status band (mark 6) | H→A | K5, K6 (+ passes 1–4) | Mark 4 (low-res) **cured** at P1-W3 (wordmark sharp+complete in production). Marks **3/5/6 open** — MEMORY.md names them as the next front; earliest earned-100% = **pass 6** (`design-refinement-marks-2026-07-31.md:13-18`; `t4-formulation…:107`) | 2 K + 4 passes | §2 DISEASE (marks 3/5/6) |

### 1g. Standing traps (declared, not deferrals — carried for completeness)

`npx-packument-OOM` (deploy ONLY via `npm run deploy`) · `K46` hmr.port 3000 desync · `cp314` host-Python PyO3 incompatibility · `fmt-in-gates` · `golden-vs-dist-only` · `linux-golden mint-from-runner-artifact` · the `sun-crest clause` (linux coarse 0.05 / darwin soul 0.017) · `cwd-drift` · `npm-10-lockfile` · `prettier-scope-src-only` · the post-deploy **~2-minute quiet window** before touching `/assets/*` · `:3000` = foreign palette-api squatter · orphaned vite preview `:4188`. Sources: `WGATE-record.md:185-199,232`; `t4-formulation…:107`.

---

## 2. DISEASE — rows with ride-count ≥ 2 and no terminal decision

Ordered by severity. Four grades are used because the campaign's own rule ("ride 2+ un-decided") catches both genuine rot and healthily-parked rows; conflating them would be its own lie.

### 2a. HARD DISEASE — open, actionable, no decision, trigger fired or absent

| ID | Row | Rides | Why it is rot, not a park |
|---|---|---|---|
| **CH-35** | **E8 device smoke on a real iPhone** | **4** (K4a, K4b, K5, K6) | The single row that gates the campaign's *entire* iOS performance claim. Booked at T4-WM, restated at three subsequent closes verbatim. The P1 patch's platform claim is explicitly scoped to "desktop Safari 26.4 + the iOS 26 simulator" because of it (`WGATE-record.md:253`). Owner-the-human; no agent action can close it; nothing has ever been proposed to *bound* it (e.g. a scoped claim that doesn't need it). |
| **CH-33** | `docs/sudoku.md` deep sections for thermo/killer/kenken | **3** | The trigger — "the games ship" — **fired at K4a** (2026-07-15) and the row did not move across three subsequent gates. `docs/sudoku.md` still stops at `## Futoshiki and the wider family` (:90). A banked row whose trigger has fired is no longer banked; it is undone work. |
| **CH-29** | `generate_templates.rs` N=5 arg-range refusal | **4** | T3 §1 recorded a **FOLD-DO** ("W3-adjacent (soft)") that never landed. The file's last commit is `22514bae`, 2026-07-10 — *before* the T3 close claimed the fold. `:17` and `:85` still advertise and accept N=5. This is the declared-capture-missing-on-disk class the T5 charter names. |
| **CH-32** | stale `ci.yml` full-module wasm band comment | **3** | `.github/workflows/ci.yml:406` still cites 222,436 B / 90,602 B as the "T2-WGATE re-measure"; the T4 gate measured 227,385 B and flagged the comment stale at K4a. The P1 patch edited the same file (:542-553) without refreshing it. The bounds hold, so this is doc-rot, not a gate defect — but it is exactly the number-that-does-not-trace class W14 claimed to have eliminated. |
| **CH-31** | `YOSHI_COLORS` source-symbol rename | **3** | 11 live references. The "trigger" is a method-of-work ("one atomic change"), not a condition — so nothing can ever fire it. Orphan by the campaign's own owner+trigger invariant. |
| **CH-25** | SE/HoDoKu-class difficulty rater | **6** | Its own booking text says **"large, unbooked, no trigger."** Six closes with an admitted orphan on the books. Either a product row with an owner or a retire-with-rationale; it has been neither since 2026-07-06. |
| **CH-28** | N=3-hard bank aggressive excision (3,591 B) | **4** | Device-gated on a run that, per two separate records, **was never made** (`C-deferred-foldin.md:125`; `C-deferred-disposition.md:57`). A gate nobody intends to run is a retire in disguise. |
| **CH-24** | event-lite full priority model | **6** | "Still last" for six closes, then dropped from the T4 record entirely. Either close it or give it a real trigger. |
| **CH-37** | 2 dependabot highs (#68 sharp, #69 postcss) | **2** | Verified open right now against `web/frontend/package-lock.json`. This is the **successor** to CH-01's phantom nine — the dashboard is dirty again, this time with *real* frontend manifests, and the row has ridden the P1 seal and the 2026-08-01 cut untouched. |
| **CH-36** | zone RUM disable + zone purge scope | **3** | The CSP refuses the beacon so the no-telemetry declaration holds *de facto*, but the estate has no zone purge scope — which is precisely why the edge-cache poisoning at K4b had to be remediated by URL-hash rotation instead of a purge. A missing capability, not a preference. |
| **CH-38** | ≥4 cold/blind readers | 2 K + **3 passes** | Named "the campaign's single highest-leverage owner action" at pass 3 and again at pass 4, carried both times. Blocks M4/M2 adjudication and therefore the design loop's 100% clock. |
| **CH-39** | landscape eye-on-glass / sim rotation | 1 K + **2 passes** | "No on-device landscape cells exist anywhere in the pass" (`pass4-registry.md:103`) after landscape was PRICED at 40.22 px with ~90 px fold overflow. A priced change nobody has looked at. |
| **CH-40** | keypad rig row | 1 K + **3 passes** | Explicitly **"CHARACTERIZED-not-closed"**, adjudicated at pass 4 with the verdict "The owner row stays". No OS keyboard has ever been raised in the rig — `installFakeVisualViewport` only. |
| **CH-58** | F3-G1 / trigger (b), the ALL-mobile mark | **3 passes** | The last blocking row of pass 4 and the third pass carrying it; the pass-4 cut shipped explicitly *without* buying the ALL-mobile claim. |
| **CH-61** | owner design marks 3 / 5 / 6 (mobile wholesale · drawer content composition · the solve-status band) | 2 K + **4 passes** | Mark 4 cured at P1-W3; marks 3/5/6 have ridden every pass since 2026-07-31 and are named in MEMORY.md as the next front, with earliest earned-100% at **pass 6**. |

### 2b. DISEASE-BY-LETTER — ride-count trips the rule, but the park is documented and honest

Recorded so the census is not accused of only reporting rot, and so a future tranche does not "fix" a correctly-parked row.

| ID | Row | Rides | The park |
|---|---|---|---|
| CH-23 | M4 `useCelestialSun` | **6** — the oldest row in the campaign (2026-06-02) | Parked on a **failed gate** (≥2 real consumers), not on neglect. Verified absent from the frontend tree. *But*: T4 never restates the park, so the row is currently parked in no living record. |
| CH-26 | Futoshiki N=7/N=8 cliff | 6 | Node-frozen; the trigger (a propagation-strength change) is real, named, and unfired. |
| CH-27 | §8b bitset-parallel GAC | 4 | User-imperceptible at ceiling (~0.3 ms on ~1 ms); the perf mandate is about *felt* performance. |
| CH-47/48/49 | bbnf confluence · the morph set · vendored-test prune | 5 / 5 / 4 | Out-of-repo and never-push-bound; csc411 cannot land them. CH-48 additionally contains T1-era **owner** actions (morph-core publish, morph CI secrets, bbnf-buddy remote) that have not been restated since T3 §5. |

### 2c. Retired-DISEASE — rows that *were* DISEASE and were terminally decided (no action)

CH-01 dependabot phantoms (2 → dismissed at T4-W0) · CH-02 prettier shadow (2 → built at T4-W4) · CH-03 mod.rs flip (2 → built at T4-W4) · CH-21 W8 mount idle-chunking (2 → retire-with-measurement at T4-W1) · CH-11 S1/S2/S4 (2 → excise-note at T3-W3) · CH-12 N11 (2 → RESERVE at T3-W4) · CH-14 mimalloc/PGO/opt-s (2 → defer-closed at T3) · CH-07 keyframes.js (2 → retire). **The T4 close was the campaign's only real chronic-clearing event**; every one of these was decided there or at T3.

### 2d. The structural finding

**Nine rows the T3 and T4 closes each claimed to have zero of are alive at HEAD.** T3's appendix C ends "**Zero deferrals minted.** Every row lands, closes, excludes, or files-as-scoped-backlog… nothing re-books to a fourth tranche" (`C-deferred-disposition.md:122`). T4's WGATE opens "**the disposition ledger closes at 100%**… every chronic, deferred, partial, and prompt-recap row carries a terminal disposition" (`WGATE-record.md:3`). Against that: **CH-24, CH-25, CH-26, CH-27, CH-28, CH-29, CH-47, CH-48, CH-49 appear nowhere in the T4 record at all** — they were not decided, they were *dropped*. This is the same mechanism the T4 audit itself caught at CH-01 ("a carried reminder silently dropped"), recurring one tranche later at a larger scale. **Per the working directives' class-invariant rule (second occurrence ⇒ class), this is now a class defect in the close ceremony, not an incident.**

---

## 3. Appendix — duplicates merged, with the aliasing noted

Rows booked under different wordings across records, merged above. Each merge is listed with the wordings that were folded and why they are one row.

| Merged ID | Aliases (wording · where) | Why one row |
|---|---|---|
| **CH-04** | "core 0.4.0 UNPUBLISHED to crates.io" (`t2-execution-progress.md:18`) · "D5 version-ahead-of-registry" (T4 r1-chronic-ledger D5) · "**F-2** — Python wheel/pyproject 0.4.0 lags the crate 0.5.0" (`WGATE-record.md:62`) · "crates.io 0.6.0 bump + publish (incl. the pyproject parity, F-2)" (`WGATE-record.md:172`) · ballot **B2** | One family: *declared version vs published registry*. Four wordings, three version pairs (0.4/0.3, 0.4/0.5, 0.6/0.6), one mechanism. Closed once, at 0.6.0. |
| **CH-21** | "Memoized/idle-chunked transition path regen (the @4× CPU half: `generateGridBoilFrames` + 256 `wobbleRect` + mounts)" (T2 §G, `C-deferred-foldin.md:105`) · "memoized/idle-chunked transition regen" (T3 §1) · "**D7** W8 mount idle-chunking re-entry" (T4 r1) · "W8 mount idle-chunking (D7 residual)" (`WGATE-record.md:176`) | Same @4×-CPU mount burst, four names across four records. The **marks** half landed at T3-W8; only the **mount** half ever deferred — the T2 wording bundles both, which is why it reads as two rows. |
| **CH-14** | "mimalloc A/B (chronic)" L25-13 · "the D20 set" (CSR adjacency · Vec-indexed warm cache · mimalloc · GAC on/off policy, T2 §G) · "C7/C8 mimalloc · PGO" (A14) · "the defer-closed set — mimalloc/PGO/opt-level-s" (T3 §3) | The D20 *set* is four rows; three of them (CSR, Vec cache, GAC policy) were **ADOPTED or REJECTED at T3-W6** and are closed. Only mimalloc survived, and it merged with PGO and opt-level=s into one defer-closed KISS-ledger row. Treating "the D20 set" as one open row (as several records do) over-counts by three. |
| **CH-11** | S1/S2/S4 as `D:S1`,`D:S2`,`D:S4` (T1 appendix D) · `L25-02`,`L25-03`,`L25-05` (T2) · `C1`,`C2`,`C4` (A14) · "FOLD-EXCISE-note" ×3 (T3 §1) | Three symbols, one disposition shape and one landing wave (T3-W3). A14's own §3 recommends treating them as a single "chronic library-surface disposition pass"; merged here on that authority. |
| **CH-23** | "M4 Orange-sun lift (`useCelestialSun`)" (T1) · "2026-06-02:BOOK orange-sun mascot → pencil-boil" (grand-audit:80) · `L25-07` (T2) · "C11 M4 useCelestialSun (×3 oldest)" (A14/T4 r1) | One row across four names and three ID schemes. **Age correction:** A14 and the T4 r1 ledger both call it "×3"; counting the closes it actually rode (K1, K2, K3a, K3b, K4a/b, K5, K6) gives **6**. The ×3 figure counted *passes*, not closes. |
| **CH-43 / CH-42** | "the pre-existing logo-light-darwin AA fringe" (P1 §9.1) · "logo-light darwin re-baseline election" (2026-08-01) · "toggle-crest-dark flake watch" (2026-08-01) · "the sun-crest clause" (T4 traps) | **Deliberately NOT merged** — a near-miss. Both are sun-crest-class golden flakes on the same clause, but they are **two different goldens with opposite dispositions**: logo-light-darwin was **re-baselined and ratified** (6/6, two trees); toggle-crest-dark is **watch-only with NO re-baseline** (12/25 vs 19/25 on the pristine tree). Merging them would smuggle a re-baseline authorization onto a row that explicitly forbids one. |
| **CH-51 / drawer stall** | "the gallery fold's structural ~150–176 ms frame" (P1 §9.1) · "~280 ms WebKit drawer-open stall" (pass-2 campaign row) · "the grid raster-stack RE-BAKE on drawer-driven board re-fit" (pass-3 attribution) | **NOT merged** — also a near-miss. The pass-3 attribution resolves the *drawer* stall (4× `createImageBitmap` 79–195 ms + 4× `convertToBlob` 87–112 ms ≈ 98% of the bill; filter hypothesis refuted at 0–4 ms). The *gallery fold* frame was separately attributed at P1-W4 to **no W3 item** across 7/7 ablation bundles and remains structural. Same neighbourhood, different mechanisms, different triggers. |
| **CH-01 / CH-37** | "dependabot 9 alerts" (T2-W1 → T2-WGATE reminder → T4-W0 dismissal) · "2 dependabot highs… booked for review" (P1 §9.1) | **NOT merged** — successor, not alias. Different alert numbers (#50–58 vs #68/#69), different manifests (`web/api/uv.lock`, deleted at `98fe2562`, vs `web/frontend/package-lock.json`, live), different exposure (phantom vs real). The *family* — "the dependabot dashboard is dirty and the row rides closes" — recurs; the rows do not. |
| **CH-19** | "C1/C2 `index.css` `@layer` extractions — **HELD at W8**" (T2 §G) · "index.css DROP/HELD-again" (T3 ballot Q4) · "the index.css HELD-again record" (T3 §4) | One row, three holds, each an explicit decision with the proof banked (byte-identity bundle + font-URL smoke guard). Counted as HELD-healthy, not DISEASE, because a *decided* hold with a same-trigger reopen is a disposition. |
| **CH-10** | "Mobile digit pad — trigger = mobile usage evidence" (T2 §G) · "digit pad = **BUILD**" (T3 ratified defaults) · "the digit pad abrogated, the OS keyboard is the keyboard" (T4-WM) | One row with **two opposite terminal dispositions** eight days apart: built at T3-W11, deleted at T4-WM. Recorded here because a build-then-abrogate pair is the most expensive shape a deferral can take, and neither record cross-references the other. |
| **CH-48** | `L25-08` morph Float64Array wire · `L25-41` bbnf-buddy bump + MRV check · `L25-42/43/44` morph-core publish / CI secrets / buddy remote · `L25-46` tier1_resample · "OUTSTANDING OWNER ACTIONS" (T1 close) | Six IDs, one destination (`mkbabb/morph` + bbnf-buddy), one justification (out-of-repo). Merged; note that three of them were **owner-the-human** actions at K1 and have not been restated in any record since T3 §5. |

---

## 4. Record gaps found while auditing (not rows — defects in the ledger itself)

1. **CH-16** (`?board=` permalinks for the three new games) — banked at `WGATE-record.md:175`, **verifiably landed** (`{thermo,killer,kenken}*UrlState.ts` all present), and closed by no record. A banked row that quietly landed is the mirror image of a banked row that quietly didn't.
2. **CH-34** (murmur paint-damage) — the only disposition ("QUALIFIED-GREEN, residual ~2.7/s disclosed, cell-layer promotion REJECTED at 81 compositor layers vs 0.19 ms/s") lives in the **memory ledger** `t4-formulation-2026-07-12.md:25`, not in any in-tree record. If the memory file is lost, the row reads as an open defect and the rejection is re-litigable.
3. **The nine dropped rows** (§2d) — CH-24, CH-25, CH-26, CH-27, CH-28, CH-29, CH-47, CH-48, CH-49 have zero occurrences in `docs/tranches/2026-07-tranche-4/WGATE-record.md` despite its 100%-closure claim.
4. **`a8174110` / `781fc09c`** are cited in the memory ledger in commit position but resolve to no git object — they are Cloudflare **deployment** IDs. Any future audit that greps them as SHAs will read a false gap.

---

**Row count: 61 ledger rows (CH-01 … CH-61), of which 14 HARD DISEASE, 6 DISEASE-BY-LETTER, 8 retired-DISEASE, 11 merges/near-misses documented, 4 record gaps.**

ROW-COMPLETE
