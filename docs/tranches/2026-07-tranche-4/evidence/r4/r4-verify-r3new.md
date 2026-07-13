# r4-verify-r3new — factual verification of the four FAM-15 rows

Round 4, refute-by-default. HEAD `65425697`, master. NO source edits; clones done `--no-local` to scratch and removed. Verdict per row below.

## Row 1 — repo-estate-bloat (97MB/48MB) — VERDICT: CONFIRMED

Measured on a real fresh `--no-local` clone (`file://` protocol, forces object transfer, not hardlink):
- **Full clone `.git` = 97 MB** — EXACT match to r3's figure. `git clone --no-local` real 4.13s.
- **`--depth 1` shallow `.git` = 48 MB** — EXACT match. real 2.62s.
- Full clone total on disk (working tree + .git) = 175 MB; shallow total = 127 MB (the checked-out 76 MB of PNGs dominates the working tree in both).
- Code the clone exists to deliver: `csp-solver/` 1.1 MB + `web/` 1.5 MB working-tree ≈ 2.6 MB. So ~97 MB pulled to obtain ~2.6 MB of code.

Attribution by directory (tracked tree, `git ls-files … | du`):
- `docs/tranches/**` = **76 MB** of the tracked tree.
- `docs/` total = 76 MB (i.e. tranches is effectively all of docs' weight).
- All tracked `*.png` = **70 MB across 420 files**; `docs/tranches/**/*.png` = 69 MB. So PNGs are ~91% of the docs weight and docs is ~95%+ of the tracked payload — r3's 95%/95% framing holds.
- `git count-objects -vH`: 22,269 in-pack objects, size-pack 49.19 MiB (packed history ≈ what the shallow-ish transfer reflects); `.git/objects` on the source = 110 MB.
- **No LFS**: `.gitattributes` absent, `git lfs ls-files` empty. Confirmed.

Red-herring guard holds: source `.git` = 986 MB but `.git/lost-found` = 875 MB (local `git fsck` residue, never pushed). r3 correctly excluded it — clone cost is the 97 MB, not 986 MB. Verified independently.

Probe (rerunnable): `git clone --no-local --depth 1 file://$(pwd) /tmp/x && du -sh /tmp/x/.git` → 48M; drop `--depth 1` → 97M. `git ls-files '*.png' | wc -l` → 420.

## Row 2 — browser-matrix-untested-claim — VERDICT: CONFIRMED

- **CI is chromium-only**: `.github/workflows/ci.yml:482` `npx playwright install --with-deps chromium` — the sole browser install; no firefox/webkit anywhere in the workflow.
- **Playwright config has NO `projects` array** (`web/frontend/playwright.config.ts`, full file read): single default project = chromium. No firefox/webkit/browserName tokens present.
- **No support matrix exists anywhere**: `grep` for "support matrix / browser support / supported browser / tested on / cross-browser / WebKit / Safari" across `README.md`, `web/frontend/README.md`, `docs/precepts` → **zero hits**.
- **Unqualified claims present**: `README.md:3` "the Vue 3 frontend … solves entirely in the browser"; `README.md:59` "PWA offline"; `README.md:107` "The PWA installs and plays offline after first load." None names an engine or caveats Safari.
- Reality per campaign record: Chrome works, Safari known-broken (FAM-3, `../safari/`), Firefox passes (r3 C4). Single-engine CI + unqualified "the browser" copy silently excludes the one degraded engine. Offline half is mooted by FAM-6 PWA abrogation; the browser-matrix half stands.

## Row 3 — en-only / undeclared-design-decision — VERDICT: CONFIRMED

- **No i18n machinery**: `grep -rin i18n` over `web/frontend/src`, `web/frontend/package.json`, `csp-solver` → 0 hits. No `vue-i18n` / `intl` / `locale` dependency in `package.json`. (The only "localiz*" hits repo-wide are inside `node_modules/zod` locale files — not product code.)
- **English hardcoded**: `web/frontend/index.html:2` `<html lang="en">`; all UI copy inline English.
- **No declaration**: en-only is nowhere stated as a decision (parallels the FAM-14 "no-telemetry-by-design undeclared" row). P3 decision-ledger gap. Confirmed.

## Row 4 — ci-no-dag — VERDICT: CONFIRMED (one framing refinement)

Read `ci.yml` whole (601 lines). Structure:
- **9 jobs, ZERO `needs:` edges** — `lint`(62) `rust`(88, carries lanes 2+3) `py-compile`(141) `py-runtime`(184) `wasm`(259) `twiggy`(294) `frontend`(371) `e2e`(432) `iai`(512). `grep -n 'needs:'` → none. Fully flat fan-out; the header comment's "10 lanes" collapses to 9 jobs (rust carries bench+corpus).
- **Independent wasm builds counted**:
  - `wasm` job: `wasm-pack test --node` (line 284) — compiles the wasm crate.
  - `twiggy` job: `wasm-pack build` FULL (334) **and** LEAN `--no-default-features` (353).
  - `frontend` job: LEAN build (393).
  - `e2e` job: LEAN build (454).
  - So the **LEAN artifact is rebuilt 3× independently (twiggy 353, frontend 393, e2e 454)** + 1 full build + 1 wasm test compile. r3's "≥3 lanes (frontend, e2e, twiggy)" is exact.
- **Lanes that could gate/reuse**: a single `build-lean-wasm` predecessor job could upload the `csp-solver/wasm/pkg` lean artifact once; `frontend`, `e2e`, and `twiggy`(lean half) would `needs:` it + `download-artifact`. Rust toolchain is likewise installed in ~9 jobs (cache-mitigated).
- **Artifact reuse today = none**: two `upload-artifact` calls exist (488 playwright-report `if: failure()`; 594 iai-evidence `if: always()`) but both are **diagnostic uploads**; `download-artifact` count = **0**. No cross-job reuse. (Minor precision fix to r3's "no upload-artifact": uploads exist, but purely diagnostic, never consumed.)

**Framing refinement (binding for authoring)**: r3-quiet-pass's N-row headline and the registry both lean on "estimate wall-time saved by a DAG." A DAG saves **near-zero wall-time — possibly negative**. Current wall-time is `max(lane)` because the 3 lean builds run in parallel across independent jobs. Inserting a `needs:` predecessor *serializes* the build onto each dependent's critical path (build → then frontend/e2e/twiggy), which can *increase* latency unless the build dominates. The genuine, defensible saving is **compute cost** (2 redundant lean builds + ~8 redundant rust toolchain installs → CI minutes), not wall-time. r3's own C-ci-shape stated this correctly ("Wall-time = max(lane) not sum — GOOD for latency; Cost … P3"); the FAM-15 row label should be re-cut to **compute-cost / redundant-build**, not wall-time. Severity P3 stands.

## Summary of verdicts
| Row | Family | Verdict |
|---|---|---|
| 1 repo bloat 97/48 MB | repo-estate-bloat | CONFIRMED (figures exact) |
| 2 browser matrix | browser-matrix-untested-claim | CONFIRMED |
| 3 en-only | undeclared-design-decision | CONFIRMED |
| 4 ci-no-dag | ci-no-dag → re-cut to compute-cost/redundant-build | CONFIRMED (wall-time claim CORRECTED to compute-cost) |

All four FAM-15 rows survive adversarial verification. The only correction is a framing one on row 4: the cost is redundant compute, not wall-time — a DAG would not measurably shorten CI latency and could lengthen it.
