# Security posture — R3 audit

Audited 2026-08-01 at `71456713` (master, clean). READ-ONLY: no installs, no commits, no deploys.
Live edge probed by `curl -I` against `https://sudoku.babb.dev` (read-only GET/HEAD, no privileged ports).

**Headline.** The header surface is the strongest artifact in the repo—CSP is deny-by-default with
zero third-party sources, and the 2026-07-15 poisoning cure is *confirmed working on the live edge*
(`cache-control: no-store` on the `/assets/*` 404-guard, not the year-long immutable). The exposure
sits elsewhere: **two open highs (#68 sharp, #69 postcss) both fixable in-range with no manifest
breaking change**, a **third high (brace-expansion 5.0.7) that npm audit flags and Dependabot does
not**, and a **CI supply-chain asymmetry**—cargo-audit gates Rust, nothing gates npm.

---

## Row 1 — `web/frontend/public/_headers`: CSP/HSTS/XFO/Permissions-Policy

Source: `web/frontend/public/_headers:85-91` (`/*` stanza), `:100-101` (`/assets/*`), `:110-111`
(`/assets/*.wasm`). Companion: `web/frontend/public/_redirects:15,17`.

### 1a. Shipped policy = live policy (verified, not asserted)

`curl -sSI https://sudoku.babb.dev/` returns byte-identical values to `_headers:86-91`. No drift.

| Header | Live value | Verdict |
|---|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` | matches file |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | matches file |
| X-Frame-Options | `DENY` | matches file |
| X-Content-Type-Options | `nosniff` | matches file |
| Referrer-Policy | `strict-origin-when-cross-origin` | matches file |
| Permissions-Policy | 25 features, all empty-allowlist | matches file |

CSP contains **no non-`'self'`, non-`data:`, non-`blob:` source**. The Google Fonts and
`avatars.githubusercontent.com` allowances are gone (fonts self-hosted, avatar bundled)—the app has
literally no third-party network dependency to whitelist.

### 1b. Poisoning history (`981353c0`) — cure CONFIRMED on the live edge

`981353c0` (2026-07-15) fixed: a mid-propagation fetch of a not-yet-flipped hashed asset got the SPA
`text/html` fallback, and the zone cached it under `/assets/*` `max-age=31536000, immutable`; nosniff
then refused the stylesheet and the app ran unstyled at 5 fps.

The structural worry this audit went hunting for: **CF Pages matches `_headers` on the *request*
path**, so `/assets/<unknown>.css` rewritten to `/404.html` could plausibly still collect the
`/assets/*` one-year immutable and re-poison. It does not:

```
$ curl -sSI https://sudoku.babb.dev/assets/zz-nonexistent-9f8e7d6c5b4a.css
HTTP/2 404
cache-control: no-store          <- NOT the /assets/* immutable rule
cf-cache-status: BYPASS
content-security-policy: <full policy>
x-content-type-options: nosniff
```

CF Pages emits `no-store` on the redirect-404 and it wins over the `_headers` stanza. The guard is
strictly better than the commit message claimed ("caches minutes"): it caches not at all.

Real assets are correct too—`/assets/index-Dm02QDxyy-Zi.js` → `cache-control: public,
max-age=31536000, immutable` (**single**, not the doubled value the `_headers:103-109` comment
records), `/assets/csp_solver_wasm_bg-B_bsll75.wasm` → `content-type: application/wasm` +
single immutable. Hashes are 12 chars per `vite.config.ts:279-281`, matching the rotation.

`39d4a506`'s `img-src blob:` is present and is the minimum grant: `blob:` in `img-src` admits only
URLs minted by this page's own origin context (`rasterPose.ts` `createObjectURL` pose bake). No
widening beyond need.

### 1c. Gaps vs. the app's actual needs

| # | Gap | Severity | Assessment |
|---|---|---|---|
| G1 | `style-src 'unsafe-inline'` | **medium** | The one real CSP hole. Load-bearing: Vue `:style` bindings + pencil-boil write inline style attributes at runtime. A style-injection sink becomes exploitable for CSS exfil/UI-redress. `'unsafe-hashes'` will not help (dynamic values). Cure is a nonce, which CF Pages static `_headers` cannot mint (no per-request value)—it needs a Pages Function or `strict-dynamic`-style refactor. **Accept with documented rationale; do not pretend it's closed.** |
| G2 | No `Cross-Origin-Opener-Policy` | low | `same-origin` is free defense-in-depth against XS-Leaks/window-handle attacks. No COEP needed (no SharedArrayBuffer—`_headers:76` confirms). Additive, zero break risk. |
| G3 | No `Cross-Origin-Resource-Policy` | low | `same-site` would stop third-party embedding of the wasm/JS. Cosmetic here—assets are public—but it is the natural pair to G2. |
| G4 | `access-control-allow-origin: *` on every response | informational | CF Pages default, not set by `_headers`. No confidentiality impact: all assets are public static, no cookies, no credentials, no auth surface. Cannot be removed from a static `_headers` file. **Note, don't chase.** |
| G5 | No `require-trusted-types-for 'script'` | low | Would harden the DOM-XSS sink class. Vue's runtime compiles templates; enabling this without a policy shim is a real break risk. Not recommended without a prototype. |
| G6 | HSTS `preload` token unsubmitted | owner-side | `_headers:67-72` already books this honestly: the token is inert until `hstspreload.org` submission, which is a manual owner action. Status still **UNKNOWN**—not verifiable from the repo. |
| G7 | `/index.html` has no explicit `Cache-Control` | none | Live returns `public, max-age=0, must-revalidate` (CF default). Correct behavior; the vacuum happens to be filled well. Pinning it explicitly would remove reliance on a vendor default. |

No gap where the policy is *too narrow* for the app: zero `securitypolicyviolation` sources remain
per `_headers:6-15`, and the live root load resolves `/assets/solver.worker-DgkmWgoW.js` via
`modulepreload` under `script-src 'self'`.

---

## Row 2 — Dependabot #68 (sharp) and #69 (postcss)

Command: `gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate`. Both alerts are the **only**
two open; 20 prior alerts are `fixed`. There is **no `.github/dependabot.yml`**, so alerts are
raised but no automated PRs are opened—hence `gh pr list` returns `[]`.

### #69 — postcss, HIGH, CVSS 7.5, GHSA-r28c-9q8g-f849

- **Advisory**: PostCSS path traversal in previous-source-map auto-loading (`sourceMappingURL`) →
  arbitrary `.map` file disclosure. Vulnerable `<= 8.5.17`; patched `8.5.18`.
- **Installed**: `postcss@8.5.16` (`web/frontend/package-lock.json`, `node_modules/postcss`,
  `dev: false`).
- **Manifest entry**: **none.** postcss is transitive only, reached by two parents:
  `node_modules/vue → @vue/compiler-sfc` requires `^8.5.15`, and `node_modules/vite` requires
  `^8.5.16`. Root `package.json` has no postcss line.
- **Dependabot `scope: runtime`** because `vue` is a prod dependency (`package.json:39`). This is a
  **manifest artifact, not a real production exposure**: postcss reaches the machine only through
  `@vue/compiler-sfc`, which the runtime-only browser build never loads. Verified —
  `grep -ro 'postcss' web/frontend/dist/assets/` → **0 hits**. postcss is **build-time only**.
- **Exploitability here**: nil. The sink requires postcss to process *attacker-controlled* CSS
  carrying a `sourceMappingURL`. All CSS in the build is repo-authored (Tailwind v4 + `src/`). No
  untrusted CSS enters the pipeline.
- **Upgrade path (no manifest edit, no breaking change)**:
  `npm update postcss --prefix web/frontend` → resolves within the existing `^8.5.15`/`^8.5.16`
  carets. Latest 8.x on the registry is `8.5.25`; `8.5.18` is the floor. Semver-patch inside an
  already-satisfied caret; **breaking-change risk: none**. Lockfile-only diff.

### #68 — sharp, HIGH (CVSS score field 0—unscored), GHSA-f88m-g3jw-g9cj

- **Advisory**: sharp inherits libvips CVE-2026-33327 / -33328 / -35590 / -35591. Vulnerable
  `< 0.35.0`; patched `0.35.0`.
- **Installed**: `sharp@0.34.5` + 24 `@img/sharp-*` / `@img/sharp-libvips-*` platform binaries
  (all `dev: true`, mostly `optional: true`).
- **Manifest entry**: **`"wrangler": "^4.110.0"`, `web/frontend/package.json:61`, devDependencies.**
  Chain is exactly `(root) → wrangler@4.110.0 → miniflare@4.20260708.1 → sharp@0.34.5`. Nothing else
  in the tree depends on sharp.
- **Scope**: Dependabot says `development` and that is **correct and complete**. sharp is a
  transitive of miniflare's *local Workers simulation* (Images binding). This project has **no
  `wrangler.toml`/`wrangler.jsonc` anywhere** (`find -name "wrangler.*"` → empty) and uses wrangler
  for exactly one command: `wrangler pages deploy dist --project-name=sudoku` (`package.json:32`).
  `miniflare` never executes; sharp never decodes an image; **no untrusted image ever reaches
  libvips on any path in this repo.** Exposure is a dormant binary on the developer's disk.
- **Upgrade path (no manifest edit, no breaking change)**:
  Registry mapping (`npm view wrangler@'>=4.110.0' dependencies.miniflare`):

  | wrangler | miniflare | sharp | vulnerable |
  |---|---|---|---|
  | 4.110.0 (installed) | 4.20260708.1 | 0.34.5 | **yes** |
  | 4.113.0 | 4.20260721.0 | 0.34.5 | yes |
  | **4.114.0** | **4.20260722.0** | **0.35.2** | **no — first clean** |
  | 4.116.0 | 4.20260730.0 | 0.35.2 | no |
  | 4.117.0 / 4.118.0 (latest) | 5.20260730.0-**alpha** | 0.35.2 | no |

  **Recommended: `npm update wrangler --prefix web/frontend` → 4.116.0.** In-range under the existing
  `^4.110.0` caret (no `package.json` edit), and it is the newest wrangler still on a **stable**
  miniflare 4.x line. `npm audit`'s `fixAvailable: true` for the direct `wrangler` node confirms an
  in-range fix.
  **Do NOT take 4.117.0/4.118.0** for this remediation: both pull `miniflare@5.x-alpha`. That is the
  breaking-change risk in this row, and it is entirely avoidable—stopping at 4.116.0 sidesteps it.
- **Zero-risk alternative if the deploy path must not move at all**: pin `sharp@^0.35.2` via an
  `overrides` block. Adds a manifest line, but bumps nothing wrangler-adjacent.

### #Extra — brace-expansion, HIGH, flagged by npm audit, NOT alerted by Dependabot

`npm audit --package-lock-only` returns `high: 5, total: 5` across three roots—sharp (+miniflare,
+wrangler), postcss, and **brace-expansion**. Installed `brace-expansion@5.0.7` (`dev: true`), plus
two nested `2.1.2` copies under `editorconfig` and `glob`. npm's vulnerable range is
`2.0.0 - 2.1.2 || 4.0.0 - 5.0.7` — **all three installed copies are in range.** Advisory: DoS via
unbounded expansion length → OOM crash.

Dependabot alert **#28 for brace-expansion is `fixed`** and no new alert has been raised. The npm
advisory range now extends past what alert #28 covered. Cause of the divergence is **UNKNOWN**
(GitHub advisory range lag vs. the npm mirror is the likely candidate, unverified).
Remediation: `brace-expansion@5.0.8`/`5.0.9` exist on the registry; `npm audit fix` clears it
lockfile-only. Dev-only, build-tooling exposure; no production path.

### Formulation-grade remediation rows

| ID | Action | Files touched | Risk | Verify |
|---|---|---|---|---|
| SEC-1 | `npm update postcss --prefix web/frontend` (≥8.5.18) | `package-lock.json` only | none (in-caret patch) | alert #69 auto-closes; `npm run build`; `npm run test:golden` (postcss sits in the CSS pipeline—goldens are the real proof) |
| SEC-2 | `npm update wrangler --prefix web/frontend` → **4.116.0, not 4.117+** | `package-lock.json` only | low; hard stop before miniflare 5.x-alpha | alert #68 auto-closes; `npx wrangler --version`; deploy is owner-authorized and out of scope here |
| SEC-3 | `npm audit fix` for brace-expansion (all three copies) | `package-lock.json` only | none (dev-only) | `npm audit` → 0 high |
| SEC-4 | Add `npm audit --audit-level=high` job to `.github/workflows/ci.yml` | `ci.yml` | none | see Row 4 |
| SEC-5 | Add `.github/dependabot.yml` (npm `web/frontend`, cargo root, pip `web/api`) | new file | none | Dependabot opens PRs instead of silent alerts |

SEC-1..3 are all **lockfile-only, zero manifest edits, zero breaking changes.** A single
`npm audit fix` (no `--force`) plausibly clears all three; run it, then diff the lock.

---

## Row 3 — Secrets hygiene

**Pattern scan** (`grep -rIlE`, excluding `node_modules`, `.git`, `target`, `dist`, `.venv`).
Classes only—**no values were read, printed, or written anywhere in this audit.**

| Pattern class | Files matched |
|---|---|
| GitHub classic PAT `ghp_…` | 0 |
| GitHub fine-grained `github_pat_…` | 0 |
| OpenAI-style `sk-…` | 0 |
| AWS access key `AKIA…` | 0 |
| Google API `AIza…` | 0 |
| Slack `xox[baprs]-…` | 0 |
| PEM private key block | 0 |
| npm token `npm_…` | 0 |
| `CLOUDFLARE_API_TOKEN=<value>` | 0 |
| JWT `eyJ….eyJ` | 0 |

**Clean.** No hardcoded credential of any recognized class in the tree.

- `.env` exists at repo root, is **untracked** (`git ls-files --error-unmatch .env` → pathspec error)
  and gitignored (`.gitignore:25-26`). Its only key is `PYTHONPATH`—a path, not a credential.
  `.env.example` carries the same single key. Three `.claude/worktrees/*/​.env.example` copies, same
  content.
- No `*.pem`, `*.key`, `id_rsa*` anywhere outside `node_modules`.
- `web/frontend/dist/` is gitignored (`.gitignore:12`); `csp-solver/wasm/pkg/` is gitignored
  (`.gitignore:74`). No build output carries secrets into history.
- `.github/workflows/ci.yml` references **zero** `secrets.*`. Grep for `CLOUDFLARE|API_TOKEN|
  NPM_TOKEN|id-token` → no hits. CI cannot leak what it never receives.

**Wrangler / deploy posture**

- **No `wrangler.toml` / `wrangler.jsonc` in the repo.** All deploy parameters live inline in
  `package.json:32`: `wrangler pages deploy dist --project-name=sudoku --branch=master
  --commit-dirty=true`. No account ID, no zone ID, no token in-repo.
- Auth therefore resolves from the operator's ambient credential—`CLOUDFLARE_API_TOKEN` env or the
  OAuth grant wrangler caches outside the repo. **Correct posture**: the credential never enters
  version control.
- The deploy token is known to lack zone-purge scope (`981353c0` commit body: "the deploy token has
  no zone purge scope"). That is **least-privilege working as intended**; it is why the poisoning cure
  had to be hash rotation rather than a purge. Do not widen the token to "fix" this.
- `--commit-dirty=true` suppresses wrangler's dirty-tree guard. Not a secrets issue; it is a
  provenance issue—a deploy can ship uncommitted bytes with nothing recording it. Flagged, not
  escalated (deploys are owner-authorized per-deploy).
- Deploy is **manual only**—`ci.yml` triggers on `push`/`pull_request` to `main`/`master` and
  contains no deploy step. No CI-held Cloudflare credential exists to steal.

**Repo-level security settings** (`gh api repos/mkbabb/csp-solver`) — the weak spot in this row:

| Setting | Status |
|---|---|
| `secret_scanning` | **disabled** |
| `secret_scanning_push_protection` | **disabled** |
| `dependabot_security_updates` | **disabled** |

The repo is **public**. GitHub Advanced Security secret scanning is free on public repos; all three
are one-click owner-side toggles. Push protection in particular is the control that would prevent a
future accidental commit—the current clean state is discipline, not enforcement.

| ID | Action | Owner |
|---|---|---|
| SEC-6 | Enable secret scanning + push protection (free, public repo) | OWNER, one click |
| SEC-7 | Enable Dependabot security updates (auto-PRs for #68/#69-class alerts) | OWNER, one click |

---

## Row 4 — Supply chain

### Lockfile pinning

- `web/frontend/package-lock.json`: `lockfileVersion: 3`, **456 package entries, 454 carry
  `integrity` (sha512)**. Coverage is 99.6%.
- The **two** entries without integrity are both the same thing—the `file:` link:
  `node_modules/@mkbabb/csp-solver-wasm` (`link: true`, resolved `../../csp-solver/wasm/pkg`) and its
  target `../../csp-solver/wasm/pkg` (version `0.6.0`). A `file:` link has no tarball to hash; this
  is structural, not an omission.
- Every registry dep resolves to `https://registry.npmjs.org/…` — **no alternate registry, no git
  URL, no http:, no tarball-from-URL anywhere in the lock.**
- CI enforces lockfile integrity: `ci.yml:499-504` runs `npm ci --dry-run` as an explicit
  "lockfile integrity gate" *before* `npm ci`. `npm install -g npm@^11` (`ci.yml:498,584`) matches
  the `engines.npm: >=11` / `packageManager: npm@11.x` pin—npm 10 mis-resolves this lockfile.
- Rust: `cargo-audit` runs as an independent no-`needs:` job over the committed `Cargo.lock`
  (`ci.yml:767-776`).

**The asymmetry**: `grep -nE 'npm audit' .github/workflows/ci.yml` → **no hits**. Rust has an
advisory tripwire; npm has none. That is precisely why #68/#69 sat open and why the
brace-extension divergence went unnoticed. **SEC-4 is the highest-leverage row in this document**:
it is the control that would have caught all three findings in Row 2 automatically.

### The `file:` link

`"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"` (`web/frontend/package.json:35`).

- Target `csp-solver/wasm/pkg/package.json` → `@mkbabb/csp-solver-wasm@0.6.0`, `files:
  ["csp_solver_wasm_bg.wasm", "csp_solver_wasm.js", "csp_solver_wasm.d.ts"]`.
- Directory is gitignored (`.gitignore:74`) and produced by `npm run wasm` → `make -C
  ../../csp-solver/wasm wasm` (`package.json:23-24`, wired as `prebuild`).
- **Posture assessment: this is a strength, not a gap.** Trading registry integrity for
  build-from-source-in-repo is the stronger trust position—the bytes come from `csp-solver/` in this
  same tree under the same review, never from a registry that could be compromised. CI rebuilds it
  (`ci.yml:42`: "download lean pkg; npm ci --dry-run; npm ci"), and the wasm byte-size band
  (fail >127,500 B) acts as an unintended but real tamper tripwire: a backdoored wasm that moves the
  size fails CI.
- Residual: `npm ci --dry-run` cannot verify a `file:` link's *contents*. The guard is the size band
  plus the deterministic `make` recipe. **Accept.**

### npm provenance of `@mkbabb` deps

`npm view @mkbabb/pencil-boil@0.10.1`:

| Field | Value |
|---|---|
| `dist.integrity` | `sha512-UYfvIdVhm4P69EmNbjua05PSSMRjbufW9U4NA6VAjywhxi/vb1Q1fCPKrHH2bzoVL/nLfiwHVEumfa77nEjt8Q==` (matches lock exactly) |
| `dist.attestations` | **null — NO npm provenance attestation** |
| `dist.signatures` | `SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U` (npm registry signing key) |
| `_npmUser.name` / `maintainers` | `mkbabb <mike7400@gmail.com>` |

So `@mkbabb/pencil-boil` is **registry-signed but not provenance-attested**—published from a local
machine, not from a CI workflow with `id-token: write`. There is no cryptographic link from the
tarball back to a source commit. Given the owner is the sole maintainer of both the consuming app and
the package, the practical risk is the owner's own npm-account compromise. Provenance would be the
correct hardening: publish `@mkbabb/pencil-boil` from a GitHub Actions workflow with
`permissions: id-token: write` and `npm publish --provenance`. **That work lives in the
`mkbabb/pencil-boil` repo, not this one**—recorded here as a cross-repo owner row.

`@mkbabb/csp-solver-wasm` is the `file:` link; provenance is N/A (see above).

### CI token permissions

`.github/workflows/ci.yml` has **no `permissions:` block** (`grep -cE '^\s*permissions:'` → `0`), and
the repo default is:

```
$ gh api repos/mkbabb/csp-solver/actions/permissions/workflow
{"default_workflow_permissions":"write","can_approve_pull_request_reviews":true}
```

Every job in an 11-job workflow therefore runs with a **read-write `GITHUB_TOKEN`** it does not need
—the workflow only builds and tests. On a public repo with `pull_request` triggers this is the
classic over-grant. Mitigating: `pull_request` (not `pull_request_target`) means forked-PR runs get a
read-only token regardless, so the practical blast radius is confined to `push` on `main`/`master`.
Still: a compromised dependency executing during `npm ci` on a push build inherits write.

| ID | Action | Risk |
|---|---|---|
| SEC-8 | Add top-level `permissions: contents: read` to `ci.yml` | none—no job writes; per-job escalation available if ever needed |

---

## Disposition

| Row | Verdict |
|---|---|
| 1 — headers | **STRONG.** Live matches file byte-for-byte; poisoning cure confirmed (`no-store` on the 404-guard, better than documented). One accepted hole: `style-src 'unsafe-inline'` (G1). G2/G3 are cheap additive wins. |
| 2 — #68/#69 | **BOTH REMEDIABLE LOCKFILE-ONLY, ZERO BREAKING CHANGE.** #69 postcss `npm update` → ≥8.5.18; #68 sharp via `wrangler` → **4.116.0, hard stop before 4.117** (miniflare 5.x-alpha). Neither has a production exploitation path: postcss is build-only (0 hits in `dist/`), sharp is dev-only dormant (miniflare never runs; no `wrangler.toml`). Plus one unalerted high: brace-expansion 5.0.7. |
| 3 — secrets | **CLEAN in-tree** (10 pattern classes, 0 hits; `.env` untracked, `PYTHONPATH` only; no wrangler config; no CI secrets). **Enforcement absent**: secret scanning, push protection, and Dependabot security updates all **disabled** on a public repo. |
| 4 — supply chain | **GOOD pinning** (454/456 integrity; sole registry; `npm ci --dry-run` gate; npm 11 pinned). Three gaps: **no `npm audit` in CI** (cargo has one)—the root cause of Row 2's drift; `GITHUB_TOKEN` defaults to write with no `permissions:` block; `@mkbabb/pencil-boil` signed but **not provenance-attested**. |

**Top three, ranked:** SEC-4 (`npm audit` in CI—closes the class, not the instance) ·
SEC-1/2/3 (three lockfile-only bumps, one `npm audit fix` may cover all) · SEC-6/7 (owner one-click
toggles on a public repo).

**UNKNOWN / not verified here:** HSTS preload submission status at `hstspreload.org` (owner-side,
G6); why Dependabot has no open brace-expansion alert while npm audit flags 5.0.7 (advisory-range
lag suspected, unconfirmed); whether `npm audit fix` alone resolves all three without touching
manifests—**not run, this audit is read-only**.

ROW-COMPLETE
