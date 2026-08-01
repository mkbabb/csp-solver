# W0 · row 0.2 — root `README.md` truth pass

Surgical. The archaic-academic register stands; only numbers and false sentences moved. Every
figure below re-derived at `e961bdb7`, Apple M5 Max, darwin/arm64, 2026-08-01. Nothing copied from
prose, from the audit, or from the wave prompt.

Gate: `node scripts/check-doc-truth.mjs`. At entry all four root-README rows were RED
(`doc-truth-RED-at-HEAD.txt`); at exit all four are GREEN (`f2-doc-truth-after.txt`).

Sites are cited at their post-edit line. `ci.yml` moved under a concurrent W0 lane mid-pass, so
everything there is cited by step name as well as by line.

| Row | Site | Was | Is | Derivation |
|---|---|---|---|---|
| e2e counts | `README.md:96-102` | 82 tests / 13 spec files / 77 default / 1 throttle | 206 in 15 (default), 4 in 1 (golden), 23 in 4 (throttle), 20 on disk, 233 in all | `npx playwright test --list` ×3 configs + `ls e2e/*.spec.ts \| wc -l` |
| chromium-alone | `README.md:121` | "Chromium alone; Firefox passes by audit; Safari known-broken" | Chromium + WebKit, each with its own lane; Gecko unasserted | `playwright.config.ts:52-60` projects; `ci.yml` step "Install Playwright chromium + webkit (+ deps)" |
| pencil-boil | `README.md:132` | `^0.9.2` | `^0.10.1` | `web/frontend/package.json:36` |
| fonts | `README.md:62` | 17,708 B | 21,724 B | `wc -c web/frontend/src/assets/fonts/*.woff2` |
| offline | `README.md:124` (new) | absent | "No offline mode" declaration | grep-zero on service worker / manifest / PWA plugin |
| stamp | `README.md:87` | `826f16e3`, 2026-07-15 | `e961bdb7`, 2026-08-01 | every count under the heading re-run today, below |

## The derivations

### e2e — three configs, one disk count

```
$ cd web/frontend
$ npx playwright test --list                                   → Total: 206 tests in 15 files
$ npx playwright test --list --project=chromium                → Total: 115 tests in 15 files
$ npx playwright test --list --project=webkit                  → Total:  91 tests in 12 files
$ npx playwright test --list --config=playwright-golden.config.ts    → Total:   4 tests in 1 file
$ npx playwright test --list --config=playwright-throttle.config.ts  → Total:  23 tests in 4 files
$ ls e2e/*.spec.ts | wc -l                                     → 20
```

The arithmetic closes exactly, which is the check that the triple isn't three unrelated numbers:
206 + 4 + 23 = **233 tests**; 15 + 1 + 4 = **20 files** = the disk count. 115 + 91 = 206, so the
default suite's two projects account for the whole of it.

The old line's "4 visual-golden + 1 throttle are testIgnore'd" was wrong in kind, not only in
degree: `playwright.config.ts:19-25` holds out **five** specs (`visual-golden`, `throttled-void`,
`filter-census`, `wordmark-integrity`, `theme-bake-freshness`), of which one rides the golden
config and four ride the throttle config. 20 − 5 = 15, which is the `--list` file count.

The gate reads the integer adjacent to the phrase "N Playwright tests" and demands it equal the
`--list` default figure (`check-doc-truth.mjs:264-267`), and accepts 15 or 20 against "N spec
files" (`:269-272`). The prose leads with 206/15 for that reason and carries 233/20 after, rather
than the instrument being loosened to fit a total it doesn't derive.

One invocation line joined the block, self-contained from the repo root like every other recipe
there. The comment claims counts a reader couldn't reach with the single command that was present;
the golden and throttle configs are how the other 27 run.

### Browser posture

```
$ grep -n "playwright install" .github/workflows/ci.yml
614:  run: npx playwright install --with-deps chromium webkit
```

`playwright.config.ts:52-60` declares two projects, `chromium` and `webkit`. Every clause of the
replacement sentence traces:

| Clause | Site |
|---|---|
| two projects declared | `playwright.config.ts:52-60` |
| CI installs both bundles | `ci.yml` step "Install Playwright chromium + webkit (+ deps)" (`:612-614` at this writing) |
| `mobile-*.spec.ts` pins Chromium at file scope | `mobile-affordances.spec.ts:18-22`, `mobile-platform.spec.ts:21` (`test.use`, file scope, `browserName: "chromium"`) |
| `share-truth.spec.ts` wants a clipboard permission WebKit won't grant | `share-truth.spec.ts:65` `grantPermissions(['clipboard-read','clipboard-write'])`; held out at `playwright.config.ts:57` |
| bundle targets ES2020 | `vite.config.ts:256-257` `build.target` |

Firefox: `grep -rn -i firefox` over `README.md`, `ci.yml`, and all three Playwright configs hit
**only** the sentence being replaced. No Gecko project, no Gecko install, no browserslist file and
no `browserslist` key in `package.json`. "Firefox passes by audit" had no audit behind it, so the
declaration now says Gecko carries no lane and Firefox is unasserted — neither claimed nor called
broken. "Safari is known-broken" is refuted by the WebKit lane itself: 91 tests run there, and
`wordmark-integrity` asserts in WebKit by construction (`ci.yml`, the built-dist gates step and its
preamble comment).

### Rust test count — 208 stands, and here's why

The row said "any 208 cite → the derived true count (~204)". Re-derived, the root README's cite is
**correct as written** and takes no edit:

```
$ grep -rE '^[[:space:]]*#\[test\]' --include='*.rs' csp-solver/src csp-solver/tests | wc -l   → 204
$ cargo test --workspace
    28 `test result:` lines · 208 passed · 0 failed · 0 ignored
    26 `Running` lines (test binaries) + 2 `Doc-tests` sections (csp_solver 4, csp_solver_wasm 0)
```

204 native `#[test]` + 4 doctests = 208, over 26 binaries. `README.md:90` already reads "208
passed, 0 failed, 0 ignored (26 test binaries + 4 doctests)" — the split is declared and the sum
reconciles. 204 is the attribute count, not the reported total; the two aren't in conflict.

The instrument agrees: `test-count-208-vs-204` flags `csp-solver/README.md:216` alone (it says "28
test binaries", conflating binaries with result lines), never `README.md:90`. That site belongs to
row 0.5. Fixing a true sentence to satisfy a misread of the row would have put a false number in
the canon.

### Fonts

```
$ wc -c web/frontend/src/assets/fonts/*.woff2
  3624 firacode-subset.woff2
 13788 fraunces-subset.woff2
  4312 patrickhand-subset.woff2
 21724 total
```

The stale 17,708 B = 3,624 + 4,312 + **9,772**, the pre-`387cceea` Fraunces subset. Arithmetically
self-consistent against the old tree, which is how it survived every review since.

### Offline — VERIFY-OR-STRIKE, resolved by writing it exact

There was no offline claim in the root README to strike. `grep -rn -i offline README.md docs/*.md
web/frontend/README.md` → zero hits. The nearest lines are "solves entirely in the browser" (`:3`)
and "Solving and generation never leave the visitor's browser" (`:117`), both **true** and both
about *where* the solve happens, not about surviving a dead network.

The posture itself:

```
$ grep -rniE "serviceworker|service-worker|workbox|vite-plugin-pwa|manifest\.webmanifest" \
    web/frontend --include='*.ts' --include='*.js' --include='*.vue' --include='*.json' \
    --include='*.html' -l | grep -v node_modules
web/frontend/playwright-report/index.html
web/frontend/playwright-report-throttle/index.html
$ ls web/frontend/public/
404.html  _headers  _redirects  favicon.svg  og-card.png
```

Two hits, both inside Playwright's own generated HTML reports — no app code, no config, no
manifest in `public/`. The PWA was abrogated whole and nothing replaced it, so the app does not
work offline: the shell and the wasm module come off the network at every cold load, and a game
not yet visited downloads its chunk on select (`README.md:58`, the lazy carousel mount). Once a
game is resident, its generation and solving run on-device with no further hits.

That's the exact claim, written as a fourth Declarations bullet beside "No telemetry" — the
completeness GAP (r3 GAP-10) closes as a truth row. GAP-10's suggested probe (load dist, kill the
network, reload) would only confirm what grep-zero already settles: with no service worker there is
no cache to serve the reload from.

### Stamp

`README.md:87` moved to `e961bdb7` / 2026-08-01 because every count beneath it was re-run today,
not merely the two that rotted:

| Count | Command | Result |
|---|---|---|
| Rust | `cargo test --workspace` | 208 passed, 0 failed, 0 ignored; 26 binaries + 4 doctests |
| Python | `uv run --no-sync pytest` in `csp-solver/tests-py` | 27 passed in 2.25s |
| e2e | `npx playwright test --list` ×3 | 206/15, 4/1, 23/4 |
| GAC A/B | `cargo run --release --example gac_ab_corpus` | 0/50 off, 0/50 on; spine 4153388 → 8222 HOLD; PASS |
| Queens | `cargo bench -p csp-solver --bench queens -- --test` | Success on every case (asserts 92 / 14,200 at `benches/queens.rs:87,104,143`) |

Host reads `Apple M5 Max` from `sysctl -n machdep.cpu.brand_string`, so that part of the stamp
holds unchanged.

## Register

The root README carried **zero** em dashes before this pass and carries zero after; two that crept
into first drafts were recast to a colon and a period. Colons and semicolons do the work here, as
the file has always had them do. No sentence was rewritten for tone, no section reordered, no
heading touched.

## Not this row

`docs/animation.md:6` also cites pencil-boil `^0.9.2` and `web/frontend/README.md:11` cites
`^0.7.0` (the S4 three-files-three-answers rot). Neither is the root README; both belong to rows
0.1 and the animation-doc lane. `csp-solver/README.md:216` (the "28 test binaries" cite) is row
0.5's.
