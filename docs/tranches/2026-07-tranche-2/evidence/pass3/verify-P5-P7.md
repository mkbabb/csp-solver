# Pass-3 Critique — lane `verify-P5-P7` (infra prototypes)

**Repo `mkbabb/csp-solver`, base HEAD `8913023e` (read-only) · verification date 2026-07-10.**
Scope: re-derive, don't trust — rebuilt fonts from source, re-curled the live CDN, re-applied
`P5.diff` to a fresh worktree and built it, hit GitHub's API directly for the `spike/iai-callgrind`
branch and pulled raw job logs for all 3 runs, and re-ran `npm run build` + the full Playwright
suite inside the retained `wt-P7` worktree.

---

## P5 — Font subset/self-host bytes

### Verdict: **CONFIRMED**

**1. Subset woff2 byte measurements reproduce.**
Rebuilt all three subsets from scratch from the vendored source TTFs in
`pass2/wt-P5-work/src-fonts/` (`FiraCode-VF.ttf`, `Fraunces-VF.ttf`, `PatrickHand-Regular.ttf`),
independently, using the exact `pyftsubset` invocation documented in `P5.md`:

| Face | P5's claim | My rebuild | Delta |
|---|---:|---:|---|
| Fira Code | 3,624 B | 3,624 B | **byte-identical** |
| Patrick Hand | 3,840 B | 3,840 B | **byte-identical** |
| Fraunces (after `varLib.instancer SOFT=0 WONK=1`) | 9,764 B | 9,688 B | 76 B / 0.78% (non-material — brotli-compressed `head`-table timestamp noise, confirmed: the intermediate `Fraunces-2axis.ttf` is byte-size-identical, 212,452 B, and differs from the stored copy only at the `head` table's modified-timestamp offset) |

2 of 3 exact, 1 of 3 within 0.8% for a fully-understood, non-methodological reason. This is a strong
reproduction.

**2. CDN byte claims are real captures, not guesses — with one caveat.**
`pass2/wt-P5-work/cdn-woff2/` holds the 16 actual downloaded files; I independently re-curled the
exact CSS2 URL used in `index.html` (`grep`-confirmed byte-identical query string) with a Chrome UA.
Fresh totals: naive 16-file sum reproduces exactly (**487,300 B**, matches). But Google rotates its
`fonts.gstatic.com` URLs and file contents over time — re-fetching the *old* stored URLs today still
returns the exact bytes P5 recorded (23,944 B / 67,304 B etc., confirmed live), but the *fresh* URLs
in today's CSS response for the same unicode-range chunks return different (smaller — e.g. Patrick
Hand latin dropped from 23,944 B to 14,224 B) sizes, because Google re-encoded the font server-side
between the prototype's run and mine. **This is not a P5 methodology flaw** — the measurement was
accurate and reproducible against its own URLs at the time it ran; it's an inherent property of
citing a live third-party CDN as a comparison baseline, which the corrections ledger itself already
flags as environment-bound. The self-hosted numbers (P5's actual deliverable, built from vendored
sources) are stable and don't share this problem.

**3. The CSP-tightened build renders correctly.** Applied `P5.diff` to a *fresh* worktree off
`8913023e` (`git apply --check` clean, confirmed independently), ran a real `vite build`:
- All three woff2s emitted as separate content-hashed files at the exact claimed sizes (3,624 /
  9,764 / 3,840 B) — `assetsInlineLimit` guard confirmed working.
- Served `dist/` under the *exact* tightened CSP header (`font-src 'self'; style-src 'self'
  'unsafe-inline'`, no `fonts.googleapis`/`fonts.gstatic`) via a local server, loaded it in a real
  Chromium (Playwright), and instrumented `securitypolicyviolation`: **zero violations, zero console
  errors, zero failed requests.**
- `document.fonts` reports all three faces **`loaded`** (Fraunces, Fira Code, Patrick Hand).
- Screenshot confirms visually correct rendering: Fraunces wordmark/headings, Fira Code option
  labels, Patrick Hand solver-note copy — see rendered page, board + controls render pixel-correct.
- Confirmed the `--font-text` boundary-case fix precisely as described: `AttributionCard`'s italic
  caption computes to `font-family: Georgia, Cambria, "Times New Roman", serif` (Fraunces correctly
  dropped from that fallback chain, no tofu/mixed-glyph risk) — exact match to the report's claim.

**Minor overclaim, non-blocking**: P5.md states "zero `fonts.googleapis`/`fonts.gstatic` strings
anywhere under `dist/`" — false in the literal sense (both domain names appear in *explanatory HTML/
`_headers` comments*, e.g. `dist/index.html:10` and `dist/_headers:32-33`), but true in every
functional sense that matters (no live `<link>`, no `src=`, no CSP allowance references those
domains — confirmed by the live CSP-violation instrumentation above, which is the test that actually
matters). Cosmetic overclaim in the prose, not a build defect.

### Amendment
None to the wave text. Note for W5 authoring: cite the self-hosted byte table (stable, rebuilt
byte-for-byte here) as the load-bearing number; treat the CDN-baseline comparison figures as
"accurate as of the P5/pass-3 capture dates" rather than a number that will still curl-verify
unchanged at execution time — Google's CDN is a moving target, not a repo artifact. This doesn't
change the 86.5–91.8% reduction claim's validity (it was true when measured, twice, independently),
just its shelf life if someone re-curls it in W5.

---

## P6 — iai-callgrind CI spike

### Verdict: **CONFIRMED**

Went straight to GitHub, no trust in the report's transcription:

- `spike/iai-callgrind` branch exists on `mkbabb/csp-solver`, head **`ff5d9de3`** — exact SHA match.
- `gh run list --branch spike/iai-callgrind`: **3/3 runs `success`** — IDs `29064711305` (push, 1m55s),
  `29064724463` (workflow_dispatch, 1m58s), `29064839517` (push, 40s) — all three IDs match the
  report exactly.
- Pulled raw `--log` output (not the report's summary) for all three runs:
  - **Run 1 & 2** (pre-fix): `run1 instructions: '90'` / `run2 instructions: '90'` — the ANSI-escape
    parser bug is real, reproduced verbatim from the actual archived CI logs, not just asserted by
    the report. Env dump confirms `CARGO_TERM_COLOR: always` on both (the pre-fix state).
  - **Run 3** (post-fix, `ff5d9de3`): `run1 instructions: '1585722'` / `run2 instructions: '1585722'`
    / `delta: 0.000000%` / `GATE PASS — deterministic instruction counts (0.000000% delta)` —
    byte-exact match to the report's quoted transcript, straight from GitHub's own log API.
  - **Underlying iai-callgrind output** (`Instructions: 1585722|1585722 (No change)`) is present and
    identical in **all three separate runs** on separate ephemeral runners — this is the strongest
    possible confirmation of the prototype's central claim (deterministic instruction counts across
    CI invocations).
- Workflow file confirmed genuinely branch-scoped: `on.push.branches: [spike/iai-callgrind]` — never
  master/PRs, matches the report.
- `git diff 8913023e origin/spike/iai-callgrind` on the three non-lockfile files
  (`.github/workflows/iai-spike.yml`, `csp-solver/Cargo.toml`, `csp-solver/benches/iai_queens.rs`)
  is **byte-identical** to `P6.diff`'s corresponding hunks.

**One correction to the report's own numbers**: the wall-clock column says run 3 took "~2m"; the
actual GitHub-recorded duration is **37–40s** (`gh run view` confirms `iai in 37s`), because run 3
reused the `Cache cargo registry + target` step's warm cache from runs 1–2 on the same branch. Minor
transcription looseness, does not touch the gate (green + deterministic), which is the thing that
matters — flagging per FAIL-EXPLICIT discipline.

### Amendment
None substantive. One-line correction for T2-W3's citation: run 3's wall time is ~40s (cache-warm),
not "~2m" — cite the cache-cold figure (~2m, runs 1–2) if budgeting CI minutes for a cold cache, the
cache-warm figure (~40s) if budgeting for steady-state PR gating.

---

## P7 — Vite 7→8 (Rolldown) compatibility

### Verdict: **CONFIRMED**

Reproduced end-to-end inside the retained `pass2/wt-P7` worktree (its own `node_modules` already had
Vite 8.1.4 / Rolldown 1.1.5 installed — verified from `node_modules/vite/package.json` and
`node_modules/rolldown/package.json` directly, not trusted from the report text).

- **Fresh build** (`rm -rf dist tsconfig.tsbuildinfo && npm run build`): succeeded, **473ms**
  (report claimed 0.51s — matches within noise). `templates.ts` shows **zero `git diff`** — codegen
  plugin fires and reproduces byte-identical, confirmed independently.
- Both worker chunks emitted: `solver.worker-*.js` at **10.10 kB / 10.18 kB**, `csp_solver_wasm_bg-
  *.wasm` at exactly **87,853 B** — matches the report's post-fix table to the byte.
- **Full Playwright suite re-run fresh** (14 specs, real Chromium via `npx playwright test`):
  **12 passed / 2 failed**, and critically the *same two specs, same assertion, same values*
  (`round9.spec.ts:162` "grid draw-in completes" and `round9.spec.ts:249` "size switching", both
  `expect(frameLines).toBe(1)` / received `4`) — exact reproduction of the report's claimed
  "identical set, identical failure mode."
- **Finding 1 independently proven, not just re-read**: temporarily renamed `node_modules/esbuild`
  out of the way and re-ran `vite build` — it failed exactly where the report says, inside
  `bundleWorkerEntry`/`workerFileToUrl` (Vite's worker-bundling code path), with
  `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'esbuild'`. Restored `esbuild`, rebuilt clean.
  This is a genuine negative-control test, not a re-assertion of the report's prose.
- **Finding 2 confirmed by inspection**: `vite.config.ts:167-170` uses the function form of
  `manualChunks` exactly as described, with the documented `vue-vendor`/`animation-vendor` residual
  (66.03 kB `animation-vendor` vs 8.08 kB `vue-vendor` in my fresh build — consistent with the
  reported chunk-shape drift, still zero import-graph/behavior impact per the e2e reproduction above).
- Branch/version provenance: `package.json`'s `vite: "^8.1.4"` and the installed
  `node_modules/vite@8.1.4` / `rolldown@1.1.5` match the report's stated bump exactly.

No discrepancies found in this lane — every quantitative claim in `P7.md` reproduced on a completely
independent build + test invocation.

### Amendment
None — holds as authored. P7's ADOPT-in-W1 recommendation is safe to carry forward unmodified.

---

## Summary

| Gate | Verdict | Basis |
|---|---|---|
| P5 (font subset bytes + CSP build) | **CONFIRMED** | Independent rebuild 2/3 byte-exact, 1/3 within 0.8%; fresh worktree build + live CSP-violation instrumentation, zero violations; one cosmetic "zero strings" overclaim noted, non-blocking |
| P6 (iai-callgrind CI lane) | **CONFIRMED** | Raw GitHub API + `--log` pull, all 3 runs, byte-exact instruction counts (1,585,722, 0.000000% delta) independently re-derived from archived job logs, not the report's transcription; one wall-time transcription correction (~40s not ~2m for the warm run) |
| P7 (Vite 8/Rolldown) | **CONFIRMED** | Fresh `npm run build` + full Playwright re-run inside the retained worktree, byte-identical worker/wasm sizes, identical 12/14 e2e split; Finding 1 reproduced via an independent negative-control test (pulled `esbuild`, watched it fail the same way) |

All three P5–P7 gates hold. No wave-spec amendment required beyond the two minor number
corrections above (CDN-baseline shelf-life note for W5; run-3 wall-time correction for W3's
citation), neither of which changes any gate verdict, wave dependency, or GO/NO-GO status.
