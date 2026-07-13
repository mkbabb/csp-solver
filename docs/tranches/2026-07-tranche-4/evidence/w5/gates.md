# T4-W5 — gates evidence (verify lane)

Banked under `docs/tranches/EVIDENCE-POLICY.md` (B1): text-first, no images. This
dir carries **zero `*.png`** — the π goldens live under the golden machinery
(`web/frontend/e2e/goldens/`, their own budget line), not here.

**Host:** darwin 25.4.0 (Apple silicon), 2026-07-13.
**Toolchain:** node v26.0.0, npm 11.12.1; rustc 1.97.0 (2d8144b78 2026-07-07),
cargo 1.97.0; wasm-pack 0.15.0; cargo-audit 0.22.2.
**Binding spec:** `../waves/T4-W5-deps-toolchain.md` (the Gates table) + README §7
`→ W5` rows. Lanes verified: D1 (pencil-boil 0.9.1 + frontend range bump), D2
(frontend engines + TS-7 held), D3 (wasm recipe truth + cargo-audit lane).

`cargo test` is debug/unoptimized. All wasm byte counts are the LEAN cdylib
(`--no-default-features --profile wasm-release`) unless marked full-module.

---

## Headline

pencil-boil `npm audit` = **0 vulnerabilities**; both packages typecheck clean on
their pinned TS (pencil-boil LANDED TS 7.0.2, `tsc --noEmit` clean; frontend HELD
TS 6.0.3 with a named re-trigger, `vue-tsc --noEmit` clean); `make wasm` emits the
**86,734 B** lean artifact `cmp`-byte-identical to the ship recipe; engines +
packageManager declared in both manifests; the cargo-audit lane is present in
`ci.yml` and locally green. **All W5 gates close.** Two conditions surfaced that
are PRE-EXISTING and NOT W5-attributable (prettier `templates.ts`; a host-local
toggle-crest feTurbulence golden divergence) — detailed at the foot, neither a
W5 lane failure.

---

## Component gates — born-RED (spec's today-values) → close

### postcss-cve — CLOSED
Born: `cd pencil-boil && npm audit` = 1 moderate (`postcss <8.5.10` via vue 3.5.29).

```
$ cd /Users/mkbabb/Programming/pencil-boil && npm audit
found 0 vulnerabilities          # exit 0
$ npm ls postcss
@mkbabb/pencil-boil@0.9.1
└─┬ vue@3.5.39
  └─┬ @vue/compiler-sfc@3.5.39
    └── postcss@8.5.18            # >= 8.5.10, advisory GHSA-qx2v-qp2m-jg93 cleared
```
The frontend takes it as a one-range lockfile step: `@mkbabb/pencil-boil` `^0.9.0
→ ^0.9.1`, installed 0.9.1.

### ts7-frontend — HELD with named re-trigger (spec-sanctioned)
Born: `typescript ~6.0.3` (tilde pins the major out), latest 7.0.2.
**Outcome: HELD at `~6.0.3`.** The bump is gated (spec residual-risk) on a clean
typecheck under the TS-7 peer; the peer LAGS:

```
$ node -e '…@typescript-eslint/typescript-estree peerDependencies'
typescript-eslint 8.63.0  peer typescript ">=4.8.4 <6.1.0"     # caps TS 7 OUT
$ node -e '…vue-tsc peerDependencies'
vue-tsc 3.3.7             peer typescript ">=5.0.0"             # would admit 7
```
`vue-tsc` would accept TS 7, but `typescript-eslint@8.63.0` (the `lint:eslint`
gate's engine) caps `typescript <6.1.0` — forcing `^7` would red the eslint lane.
Per the spec residual-risk ("hold at the last co-valid major with a named
re-trigger, not a forced landing that reds the typecheck lane"), the frontend
holds at 6.0.x. **Re-trigger: the `typescript-eslint` release whose peer admits
TS 7.** `vue-tsc --noEmit` clean under the held 6.0.3:

```
$ npx vue-tsc --noEmit          # exit 0
```

### ts7-pencilboil — LANDED
Born: installed 5.9.3 (two majors behind). Now `typescript ^7.0.2`, installed
**7.0.2**. pencil-boil carries NO `typescript-eslint` dep — its check runs on
`tsc --noEmit`, whose peer admits TS 7 — so it lands where the frontend can't.

```
$ cd /Users/mkbabb/Programming/pencil-boil && npm test    # check + 7 proofs
> tsc --noEmit                                              # clean
boil-guard.proof: 37  frames: 7  cache: 7  prebake: 20
celestial: 25  raster-serialize: 10  hold: 20               # 126 assertions ok
PB_TEST_EXIT:0
```

### engines — CLOSED
Born: `p.engines, p.packageManager` = `undefined undefined` in each.

```
frontend:    {"node":">=24","npm":">=11"}  packageManager npm@11.x
pencil-boil: {"node":">=24","npm":">=11"}  packageManager npm@11.12.1
```

### cargo-audit — CLOSED
Born: `grep -c 'audit|rustsec|deny' ci.yml` = 0.

```
$ grep -c 'audit\|rustsec\|deny' .github/workflows/ci.yml
11
```
Lane 11 `cargo-audit` added (ubuntu-latest, no `needs:`, taiki-e prebuilt binary,
reads the committed Cargo.lock). Locally green:

```
$ cargo audit
Scanning Cargo.lock for vulnerabilities (121 crate dependencies)
# 0 vulnerabilities; 2 informational `unmaintained` warnings —
#   bincode 1.3.3 (RUSTSEC-2025-0141), proc-macro-error2 2.0.1 (RUSTSEC-2026-0173)
# default `cargo audit` does NOT fail on `unmaintained`
CARGO_AUDIT_EXIT:0
```
Matches the ci.yml lane comment verbatim (0 vulnerabilities; the two unmaintained
warnings named as non-failing).

### make-wasm — CLOSED (π identity)
Born: old Makefile recipe `wasm-pack build --target web --release` (fat,
default-features) = 243,329 B (spec). Reproduced on this toolchain into a temp
out-dir = **268,196 B** (same class, ~3.1× lean, over the 240 KB full budget;
absolute figure toolchain-drifts). The corrected Makefile runs the EXACT ship
recipe:

```
$ make wasm            # wasm-pack build --scope mkbabb --target web \
                       #   --profile wasm-release --no-default-features
$ wc -c pkg/csp_solver_wasm_bg.wasm
   86734
$ shasum -a256 pkg/csp_solver_wasm_bg.wasm
42e6e32ccc40d13a625e078e55bf9c146936cc90b36a62b4be59870a99ee81b4

# cmp make-wasm output vs the literal CI ship recipe (repo-root, path arg):
$ wasm-pack build csp-solver/wasm --scope mkbabb --target web \
      --profile wasm-release --no-default-features
$ cmp <make-wasm> <ship-recipe>      # IDENTICAL (same sha)
```
`make wasm` is deterministic and byte-identical to CI's `build-lean-wasm`.

### fresh-clone — CLOSED
Born: no `predev`/`prebuild` hook, no root build step; the `file:` link resolves
against a `pkg/` a fresh clone lacks (gitignored, uncommitted). Now
`package.json` wires `"wasm": "make -C ../../csp-solver/wasm wasm"` +
`"prebuild": "npm run wasm"`, and `web/frontend/README.md` documents the
once-per-clone `npm run wasm`. Fresh-clone simulation (pkg/ moved aside):

```
$ mv pkg <tmp>; [ ! -d pkg ] && echo absent      # absent (fresh-clone state)
$ (cd web/frontend && npm run wasm)              # make -C ../../csp-solver/wasm wasm
$ wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
   86734                                          # rebuilt, sha 42e6e32c — cmp IDENTICAL
```
`npm run build` fires the same via `prebuild` (verified in the build battery:
"Compiling to Wasm… Optimizing wasm binaries" ran before `vite build`).

### orphan-pkg — CLOSED
Born: `pkg/csp_solver_wasm_bg.js` present (stale `--target bundler` leftover).

```
$ ls pkg/csp_solver_wasm_bg.js
No such file or directory        # absent; corrected --target web recipe emits none
```

### dead-profile — CLOSED, but the spec's fix is INVERTED (reconciliation)
Born (spec probe): `wasm-pack build --profile custom …` = `error: profile 'custom'
is not defined`. **Confirmed** on this toolchain:

```
$ wasm-pack build … --profile custom …
error: profile `custom` is not defined       # cargo build error (the CLI invocation)
```
BUT the spec's conclusion — "excise `[profile.custom]`" — is empirically WRONG.
wasm-pack (≥0.14) resolves a *custom* profile name's wasm-opt metadata from the
literal `.profile.custom` key, so the ship recipe's `--profile wasm-release`
reads `[package.metadata.wasm-pack.profile.custom]`, NOT `.profile.release`.
Proof — remove `.profile.custom`, rebuild with `--profile wasm-release`:

```
# .profile.custom removed:
$ wasm-pack build … --profile wasm-release --no-default-features
   87496 B          # +762 B — the -Oz wasm-opt pass no longer applies => custom is LIVE
```
D3 therefore KEPT `.profile.custom` (the live table) and removed the DEAD
`.profile.release` twin — the gate's INTENT (kill the duplicate, preserve
byte-identity) is met; only the literal probe text ("[profile.custom] gone") is
inverted. Current tree: one table remains —

```
$ grep -nE '^\[package.metadata.wasm-pack.profile' csp-solver/wasm/Cargo.toml
62:[package.metadata.wasm-pack.profile.custom]
```
`--enable-bulk-memory` retired from that array (rustc 1.97 default target
feature) — see the bulk-memory reconciliation below.

### figures — recorded for W14's re-stamp
Measured on this toolchain (rustc 1.97.0 / wasm-pack 0.15.0):

| figure | spec cited | measured T4-W5 | CI budget | headroom |
|---|---|---|---|---|
| lean | 86,746 B | **86,734 B** | fail >93 KB | 6,266 B under |
| full-module | 188,095 B | **188,087 B** | fail >240 KB | ~51,913 B under |

Both drift a few bytes from the spec (−12 / −8 B) under the current toolchain;
both hold with headroom, no gate breaks. Doc-truth re-stamp homed in W14.

---

## D-lane reconciliations

### TS 7 — held-or-landed
- **pencil-boil LANDED `^7.0.2`.** No `typescript-eslint` dep; `tsc --noEmit`
  (peer `>=5.0.0` via vue-tsc-adjacent tooling) admits TS 7 → check + 7 proofs
  clean.
- **frontend HELD `~6.0.3`.** `typescript-eslint@8.63.0` peer `typescript
  >=4.8.4 <6.1.0` caps TS 7 out of the `lint:eslint` gate; the co-validation
  the spec requires fails on the peer, so the bump holds at the last co-valid
  major with the **named re-trigger = a `typescript-eslint` release admitting
  TS 7**. `vue-tsc --noEmit` clean at 6.0.3. This is the spec's sanctioned
  residual-risk path, not a forced red.

### bulk-memory byte outcome — BYTE-NEUTRAL (π invariant holds)
Retiring `--enable-bulk-memory` from the live `.profile.custom` wasm-opt array is
byte-neutral. Rebuilt the PRE-W5 Cargo.toml (`git show HEAD:…/Cargo.toml` —
`--enable-bulk-memory` present in BOTH twin tables) against the ship recipe, then
the POST-W5 tree (flag retired, single table), and `cmp`'d:

```
PRE-W5  (bulk-memory present, both twins):  86734 B  sha 42e6e32c…
POST-W5 (bulk-memory retired, custom only): 86734 B  sha 42e6e32c…
cmp PRE POST => IDENTICAL
```
rustc 1.97's default wasm32 target features already enable bulk-memory, so the
wasm-opt flag was redundant; dropping it changes nothing in the emitted cdylib.

---

## π / DELTA

No rendered-pixel surface in the recipe/toolchain changes themselves. The
invariant: the shipped lean wasm is byte-identical before and after the W5
Makefile+Cargo edits.

- **Byte-identity (pre/post):** `cmp` PRE-W5 == POST-W5 == `make wasm` == CI ship
  recipe — all sha `42e6e32ccc40d13a…`, 86,734 B. Held.
- **Goldens (private preview on a non-3000/3001 port, `PLAYWRIGHT_BASE_URL`,
  `retries: 0`):** **3/4 green** — `logo-light`, `cell-light`, `grid-corner-light`
  pass first-run. `toggle-crest-dark` diverges 1028 px (ratio 0.03) STABLY across
  4 re-runs. Per the wave's own distinguishing test (re-run separates transient
  feTurbulence noise from a red) the stability rules out run-to-run flicker — but
  the diff crop shows every divergent pixel sits in the **celestial sparkle stars
  + the wobble-filtered disc rim** (the exact high-frequency feTurbulence field
  the golden config comments name as host-relocating); the disc/body core is
  clean — no theme inversion, no grain→black, no pose drift. **Not W5-caused:**
  pencil-boil 0.9.0→0.9.1 is `git diff --stat` = CHANGELOG + package.json +
  lockfile only, **zero `src/` delta**, so the rendered output is identical
  pre/post W5; the divergence is a pre-existing host-local feTurbulence
  realization differing from the W2 mint host (baseline committed at `0ea30223`).
  **No re-baseline taken** (re-baselining on this box would corrupt the committed
  darwin baseline for the mint host / CI-darwin, where it passes).

---

## Full local battery — exit codes verbatim

| Command | Exit | Notes |
|---|---|---|
| `cargo test --workspace` | 0 | 169 passed / 0 failed / 0 ignored (21 test binaries) |
| `cargo fmt --all --check` | 0 | clean, no diff |
| `cargo clippy --workspace --all-targets` | 0 | no warnings beyond the toolchain's proc-macro-error2 future-reject note |
| `cargo audit` | 0 | 0 vulnerabilities / 121 deps; 2 non-failing unmaintained |
| `vue-tsc --noEmit` (frontend, TS 6.0.3) | 0 | held-major typecheck clean |
| `npm run test:unit` (vitest run) | 0 | 8 files / 77 tests passed |
| `npm run lint:eslint` | 0 | boundary + correctness clean |
| `npm run lint:knip` | 0 | clean (knip.json gains `ignoreBinaries:["make"]` for the wasm script) |
| `npm run lint` (prettier --check src/) | **1** | PRE-EXISTING — see below |
| `npm run build` (prebuild wasm + vue-tsc -b + vite build) | 0 | dist wasm 86.73 kB gzip 38.63 kB |
| pencil-boil `npm test` (tsc --noEmit TS7 + 7 proofs) | 0 | 126 assertions ok |

---

## Two PRE-EXISTING conditions (flagged; neither a W5 lane failure)

1. **prettier `--check src/` = exit 1.** One file: `src/games/sudoku/data/
   templates.ts`. `git diff --quiet HEAD` on it → clean (identical to HEAD, last
   touched at `22514bae` T2-W4); no W5 lane touched any `src/` file. The W5 lint
   gates are `lint:eslint` + `lint:knip` (both exit 0, per the STANDING note);
   the bare `npm run lint` prettier pass is safe-to-run since W4 but was already
   red on this data file at HEAD. Out of W5 scope — a doc/format trap for a later
   sweep, not this wave.

2. **toggle-crest-dark golden 3% divergence on this host.** Detailed under π/DELTA:
   confined to the feTurbulence celestial sparkle field, W5-invariant (pencil-boil
   0.9.1 = zero `src/` delta), a host-local realization vs the W2 mint baseline.
   3/4 goldens green; the structural invariant (theme/pose/grain) holds. No
   re-baseline.

---

## Working-tree integrity

Only the 8 intended files carry W5 changes (all experiment builds went to temp
out-dirs; PRE-W5 Cargo.toml swap restored; lean `pkg/` left canonical at sha
`42e6e32c`):

```
 M .github/workflows/ci.yml        (cargo-audit lane 11 + DAG note)
 M csp-solver/wasm/Cargo.toml       (dead .profile.release excised; bulk-memory retired)
 M csp-solver/wasm/Makefile         (ship recipe)
 M web/frontend/README.md           (wasm prerequisite)
 M web/frontend/knip.json           (ignoreBinaries make)
 M web/frontend/package-lock.json   (pencil-boil 0.9.1 + eslint 10.7.0)
 M web/frontend/package.json        (engines/packageManager/scripts; pencil-boil ^0.9.1; eslint ^10.7.0)
```
(`D CONTRIBUTING.md` pre-dates this wave — not W5.) Main-repo commits are
team-lead-only; this lane leaves the tree staged-for-review, unmodified beyond
the D-lane landings.
