# THE LIVING LEDGER

The single open-rows file. Every close diffs against it: `node scripts/ledger-diff.mjs --require-ledger`
must exit 0, or the close is lying about its own completeness (U-11's finding, D1's cure).

**How it is read.** The instrument treats this file as disposition corpus and scans it for literal row
ids. Every id is written out on its own line — never as a range, because `CH-01…CH-61` reads as scope,
not as citation, and one rhetorical sweep would green the whole ledger.

**The law.** A row leaves only by a terminal state written here — BUILD(→wave) · FOLD(→wave) ·
RETIRE(+re-entry) · BALLOT(+default) · KEEP-PARK(+trigger) · HELD(+trigger) · WATCH · DECLARED ·
CLOSED(+cite). Re-booking is forbidden. A new row enters with an owner and a trigger, or it does not
enter. A campaign close carries this file forward; it never restarts it.

**Seeded** at T5-W6.6 from the ratified dispositions: `2026-08-tranche-5/waves/T5-W5-decide.md`,
`evidence/audit/r1/chronic-ledger.md`, `evidence/w0/record-closures.md`,
`evidence/w0/wave-record-draft.md`, `waves/T5-W4-design.md`, `evidence/audit/r2/prompt-recap-matrix.md`
§8/§9. 61 chronic rows, 7 recap orphans homed, 11 unaddressed, 11 superseded.

---

## 1. Open — what the next close must carry

| Row | State | The row · trigger, re-entry, or default |
|---|---|---|
| CH-20 | HELD (healthy) | TypeScript 7.x, frontend pinned `~6.0.3`; trigger = `typescript-eslint` peer `<6.1.0` lifts |
| CH-62 | KEEP-PARK | linux-WebKit blank-bake race, second pinning: pencil-boil 0.11.0's `rasterizePoseToBlob` REFUTED as cure (green 30727947148, red-4 30728779986 — one green was a sample, not a proof); class quarantined ubuntu+webkit bake-decode both specs, chromium/darwin full-strength spread detectors live; owner = T5-W4b root-cause on the runner with the real rig; triggers = W4b's rig verdict OR `@mkbabb/pencil-boil >=0.12.0` (the quarantine module THROWS itself out); cite `2026-08-tranche-5/evidence/w2/verify/bake-race-recurrence-30728779986.txt` |
| CH-21 | HELD (healthy) | W8 mount idle-chunking (D7); retire-with-measurement floor 89 ms@1× / 355 ms@4×; trigger = a mid-device above-band trace |
| CH-22 | HELD (healthy) | banked game set (Skyscrapers · Arrow · Kakuro · Sandwich · Hidato/Numbrix), per-row triggers at `2026-07-tranche-4/README.md:169-183` |
| CH-26 | KEEP-PARK | Futoshiki N=7/N=8 solve cliff; trigger = a propagation-strength change |
| CH-29 | BUILD → T5-W2 | `generate_templates.rs` N=5 arg-range refusal; lands the fold T3 recorded and never made |
| CH-30 | KEEP-PARK | wasm wire-dedup; trigger = a sixth game, or any solver wire >12k |
| CH-31 | FOLD → T5-W2 | `YOSHI_COLORS` rename inside the token/config prune; dead entries die, survivors rename atomically |
| CH-35 | BALLOT (owner) | E8 device smoke on a real iPhone; T5 ships the bounded-claim protocol + a 10-minute smoke script. Default at close = the iOS claim RETIRES to sim-scope |
| CH-36 | BALLOT (owner) | Cloudflare zone RUM disable + zone purge scope. Default = accepted-limitation (hash-rotation stands) |
| CH-37 | BUILD → T5-W1.8 | 2 dependabot highs on the default branch (#68 sharp, #69 postcss, `web/frontend/package-lock.json`) |
| CH-38 | BALLOT at the W4 gate | ≥4 cold/blind readers for M4/M2. Default = the adjudicator re-scopes per the pass-5 order's own alternative |
| CH-39 | FOLD → T5-W4 | landscape eye-on-glass / sim rotation; one act = election ratification + owner eye |
| CH-41 | BUILD → T5-W1.9 | `lint:ink` wired at `ci.yml:553`; the open half is one banked runner run-id |
| CH-42 | BUILD → T5-W1.10 · WATCH | `toggle-crest-dark` harness; NO re-baseline — the sun-crest clause governs |
| CH-44 | WATCH | linux wordmark blank (runner-only terminal bake), annotated-if-it-recurs; narrowed by W1.6 |
| CH-45 | BALLOT (owner) → T5-W6.3 | Safari/WebKit MCP provisioning so GUI sessions steal no focus. Default = the headless-only law stands, written in the precepts |
| CH-46 | WATCH | the API reference box (`ssh -p 1022 mbabb@34.197.214.67`), owner self-deploys; standing declaration, no tranche action |
| CH-50 | DECLARED | NEVER push bbnf-lang origin; the vendor syncs via `scripts/sync-csp-solver-vendor.sh` (bbnf-side) |
| CH-51 | KEEP-PARK | gallery fold's structural ~150–176 ms frame; trigger = an owner mark on the fold |
| CH-53 | BUILD-instrument → T5-W4 | `undoBurst`'s ~55 fps floor; per-frame stack sampling lands in the rig |
| CH-55 | DECLARED | instrument law — theme/gallery cells adjudicate interleaved-or-quiesced; every rig comparison pins game/size/difficulty |
| CH-56 | BUILD → T5-W1.10 | Playwright single-engine residue: `mobile-*` pinned chromium, `share-truth` unclipboarded in PW-WebKit |
| CH-57 | DECLARED · BUILD → T5-W6.2 | gated chains set `set -o pipefail` or read `gh run view --json conclusion`; mechanized as the deploy script's conclusion artifact |
| CH-58 | FOLD → T5-W4 | F3-G1 trigger (b), the ALL-mobile mark; cash the T-prime collapse or the adjudicator re-scopes quoting the owner |
| CH-59 | FOLD → T5-W4 | adjudicator rows: the guard's two names · eyebrow two-register · idle uniform-sign watch (n=5) |
| CH-61 | FOLD → T5-W4 | owner design marks 3, 5, 6; marks close only on an owner-side re-look (U-10) |
| CH-16 | SPLIT — half open | persistence CLOSED-landed `f8950257`; the `?board=` permalink for thermo/killer/kenken is UNWIRED and stays banked on its own trigger (`evidence/w0/record-closures.md` §1) |

## 2. Terminal — decided, closed, retired, excluded

| Row | State | Cite |
|---|---|---|
| CH-19 | CLOSED | `@layer` extraction re-opened on its own trigger at T5-W2, decision **DROP**: extraction emits a byte-identical stylesheet (same Vite content hash) and the distill shrank `index.css` 842→808 below the threshold — `evidence/w2/f4/60-ch19-decision.md`. The T3 appendix's "proof lives in the evidence dir" claim was false; F4 re-derived the runnable recipe, banked at the same cite |
| CH-01 | CLOSED | dependabot phantoms vs `web/api/uv.lock`, dismissed T4-W0; the successor row is CH-37, not this one |
| CH-02 | CLOSED | prettier global-shadow — `.prettierrc.json` + `lint: prettier --check src/`, built T4-W4 |
| CH-03 | CLOSED | `mod.rs` flip; zero `mod.rs` on disk, `mod_module_files = "deny"` |
| CH-04 | CLOSED | version-vs-registry; crate, wasm and `pyproject.toml` all 0.6.0, crates.io `max_version` 0.6.0 |
| CH-05 | CLOSED | GPU single-tile RasterTask residue, superseded by the T4-W1 N-layer bake at 0.08/s |
| CH-06 | CLOSED-retire | `propagate_stratified` wire-in retired T4-W13; zero hits in `csp-solver/src` |
| CH-07 | CLOSED-retire | `keyframes.js` excised T2-W5/R8, CLOSED-REJECT covenant T3, retire T4-W11 |
| CH-08 | CLOSED-landed | `gac_alldiff` differential oracle at `csp-solver/tests/oracle_and_invariance.rs` |
| CH-09 | CLOSED-hoisted | `apiError`/`solverError` twins live once, in `games/shared/solver/` |
| CH-10 | CLOSED, twice-decided | digit pad BUILT T3-W11, ABROGATED T4-WM — the OS keyboard is the keyboard (see S-01) |
| CH-11 | CLOSED-excise-note | the S-series crate extensions decided T3-W3; zero hits at HEAD |
| CH-12 | CLOSED-RESERVE | wall-clock budget; `error.rs:63-64` reserves `Timeout` with no constructor until a cancel-driver |
| CH-13 | CLOSED-RATIFIED | B5 owner-taste sheaf, ratified 2026-07-15; the divider's 0.9752 subject later pinned pose-0 on Apple vendors at `fb15253d` |
| CH-14 | CLOSED, defer-closed | mimalloc · PGO · wasm `opt-level=s`, with re-entry criteria banked |
| CH-15 | CLOSED-EXECUTED | crates.io 0.6.0 published 2026-07-15 at `cb3c7f5f`, pyproject parity with it |
| CH-17 | WATCH · owner-ruled | the `java` branch STAYS; `java` and `remotes/origin/java` both present (see S-04) |
| CH-18 | CLOSED-withdrawn | the headless-WebKit carousel-snap trap — there was no trap, the headless engine was right |
| CH-23 | RETIRE | `useCelestialSun` lift; two months on a failed ≥2-consumer gate. Re-entry = that gate's own criterion |
| CH-24 | RETIRE | event-lite full priority model; the solver sits at the perceptual ceiling. Re-entry = a measured propagation bottleneck on a real workload |
| CH-25 | RETIRE | SE/HoDoKu-class difficulty rater; no consumer, no trigger, six closes. Re-entry = an owner ask for SE-style ratings |
| CH-27 | RETIRE | bitset-parallel GAC; imperceptible at ceiling, on its own T3 finding |
| CH-28 | RETIRE | N=3-hard bank excision; the gating run unmade across four closes, 3,591 B is 2.9% of the lean band. Re-entry = band pressure above 127,500 B |
| CH-32 | BUILD → W0.3, LANDED | `ci.yml` band comment re-derived at `:461`; doc-truth row `ci-band-comment-406` GREEN (`evidence/w0/wave-record-draft.md`) |
| CH-33 | BUILD → W0.4, LANDED | `docs/sudoku.md` deep sections at `:104` Thermo, `:116` Killer, `:128` KenKen |
| CH-34 | CLOSED | murmur paint damage; the T4-W1 QUALIFIED-GREEN lifted in-tree verbatim, cell-layer promotion stays REJECTED at 81 layers vs 0.19 ms/s (`record-closures.md` §2) |
| CH-40 | DECIDE-accept | keypad rig; CHARACTERIZED is terminal, `installFakeVisualViewport` is the instrument of record. Re-entry = an OS-keyboard defect report |
| CH-43 | CLOSED-ratified | `logo-light-darwin` re-baseline ratified 6/6 across two trees; residue rides CH-52, the authority breach rides CH-60 |
| CH-47 | EXCLUDE, recorded once | bbnf lattice behavioral confluence — out-of-repo, never-push-bound |
| CH-48 | EXCLUDE, recorded once | the morph set; owner actions restated in the T5 owner list, out-of-repo at `mkbabb/morph` |
| CH-49 | EXCLUDE, recorded once | vendored-test prune completeness; bbnf-side, fires on the next re-vendor |
| CH-52 | ACCEPT-DOCUMENT | theme swap's two repaints; the lever is spent, `filterBudget.ts:150` carries the prose |
| CH-54 | ACCEPT-DOCUMENT | sim idle at the ≥59 floor inside the ±2.5 noise band; the gate states the band |
| CH-60 | CLOSED-record | D-M3 re-baseline authority overstep — ratified, breach booked, no precedent (`record-closures.md` §3) |

## 3. Recap orphans, homed

| Row | State | Home |
|---|---|---|
| PR-034 | HELD, trigger stated | R10 shared skin belongs to pencil-boil, never glass-ui. Held with zero glass-ui imports in the union adopt; trigger = a second consumer of the skin, or any glass-ui import tripping the ESLint boundary blocks |
| PR-038 | CLOSED via CH-07 | the keyframes/value/pencil-boil spec-and-lock chain terminates in CH-07's retire, cited in §2 — the citation chain closes here |
| PR-046 | CLOSED via CH-11 | C1's deferred extensions are the S-series, terminal at CH-11's excise-note, cited in §2 — the citation chain closes here |
| PR-132 | DISCHARGED by the T5 formation | the 100-tranche/100-session archeology IS the tranche's own corpus: the 32-agent audit, registry v4, the 61-row chronic ledger and the 137-row recap matrix are its artifacts, and every residue it raised is a row in this file |
| PR-135 | DISCHARGED by the T5 formation | the frontend-structure audit landed as `r1/component-census.md`, `r1/dead-code-census.md` and the R2 dup-matrix; the acts it ordered are T5-W2's rows |
| PR-136 | DISCHARGED by the T5 formation | the distillation-to-apotheosis order is T5-W2's charter (gameRegistry dies, GameSpec→GameShell lives); the ancestor row PR-111 landed at T4-W11 |
| PR-137 | DISCHARGED by the T5 formation | the three-hour-window / lose-no-progress order is executed as the wall protocol every lane runs under, and as W6.4's cron hygiene |

## 4. The unaddressed eleven

| Row | Home |
|---|---|
| U-01 | shadcn abrogation — T5-W2's concrete kills; scope on the owner ballot at `2026-08-tranche-5/README.md:26`, default = the 2026-08-01 order's own scope |
| U-02 | background-only browser sessions — T5-W6.3 with CH-45; default = the headless-only law in the precepts |
| U-03 | mark 1, the game picker — `waves/T5-W4-design.md:19` |
| U-04 | mark 2, the controls-drawer animation — `waves/T5-W4-design.md:19` |
| U-05 | mark 3, ALL mobile interfaces — `waves/T5-W4-design.md:19`, riding CH-58 |
| U-06 | marks 5 and 6 residue — `waves/T5-W4-design.md:19` |
| U-07 | CLOSED — "kill all crons" enumeration-closed at T4-W0 `429e7983`, homed at `2026-07-tranche-3/appendices/B-prompt-recap.md:121` (`record-closures.md` §5) |
| U-08 | CLOSED — the deploy-workflows clause discharged by the pinned `npm run deploy` pipeline `65425697` and its precept (`record-closures.md` §6) |
| U-09 | no-god-modules regression — T5-W2.7 splits `builder/assignment.rs` (607 L) and extracts `constraint/cage.rs`'s tests |
| U-10 | CLOSED — the durable-cure rule is the ninth family in `memory/lessons-from-t2-t4.md` and binds W4 (`gates.W4.marksCloseOn` = owner-re-look-only) |
| U-11 | CURED by instrument — the nine dropped rows are decided in §1 and §2 above, and `scripts/ledger-diff.mjs` now gates every close against this file |

## 5. The superseded eleven

| Row | Superseded by |
|---|---|
| S-01 | mobile digit pad → T4-WM's abrogation, "the OS keyboard is the keyboard" (CH-10) |
| S-02 | R4 inline-tests HELD → the owner's tests-never-inline order, T2-W3 `ed07ba6b` |
| S-03 | D2 root CLAUDE.md → removal and fold at T2-W7 `ede25188`; the repo has no CLAUDE.md by design |
| S-04 | R5 delete the java branch → the owner's reversal, 2026-07-11 (CH-17) |
| S-05 | M3 Controls-LEFT → the under-board glass drawer, `cubic-bezier(0.32,0.72,0,1)@520ms`, T3-W13 |
| S-06 | the FastAPI server, Docker, the concomitant deploy → T2-W2's abrogation `98fe2562` |
| S-07 | `deploy.sh` to the ssh remote → CF Pages and `npm run deploy`, wrangler pinned `65425697` |
| S-08 | the logo-as-dropdown selector → T4-W12's gallery; the dropdown RETIRED, the height ladder survived at `8913023e` |
| S-09 | "STOP after the report" → the owner's order nine minutes later; T2 went straight to execution |
| S-10 | the 19/19 Playwright-WebKit discharge → the owner's 2026-07-31 word, real Safari; proxy is not surface |
| S-11 | the first formalization prompt → its expansion three minutes later, which adds the archeological mandate |
