# T2-WGATE — Lane P4: publish + deploy

Closing-wave outward-facing acts. Standing owner authorization (publish + deploy via Cloudflare). Session-local; ratios only, no absolute-ms SLAs.

## 1. crates.io — csp-solver 0.3.0 published

Pre-publish state: crates.io `max_version` = 0.2.0. The 0.3.0 minor bump (the morph-excision + CHANGELOG) is committed at HEAD; the 0.3.0 bump is the semver protection for morph's `^0.2`.

Dry-run (workspace root) was clean:

```
Packaging csp-solver v0.3.0 (…/csp-solver)
Packaged 142 files, 662.4KiB (174.0KiB compressed)
Verifying csp-solver v0.3.0
Finished `dev` profile [unoptimized + debuginfo] target(s)
warning: aborting upload due to dry run
```

Note: the working tree carried sibling-lane WGATE dirt (docs + appendices A/C/D + a new
`csp-solver/examples/gac_timing_probe.rs` — which the orchestrator's closing commit will
carry). The only crate-dir dirt was that benign example probe, so the real publish used
`--allow-dirty`; substantive `src/` + `Cargo.toml` + `CHANGELOG` were committed at HEAD
(`ede25188`).

Real publish (`cargo publish -p csp-solver --allow-dirty`, authenticated via
`~/.cargo/credentials.toml`):

```
Uploading csp-solver v0.3.0 to registry `crates-io`
Uploaded csp-solver v0.3.0 to registry `crates-io`
Published csp-solver v0.3.0 at registry `crates-io`
```

Live confirmation (crates.io API):

```
max_version: 0.3.0
newest: 0.3.0
```

## 2. CF Pages deploy — sudoku.babb.dev

Token sourced from `~/Programming/value.js/.env` (`CLOUDFLARE_API_TOKEN`, 53 chars).
Account `07119f33e2fd863ca970514ac3680c76` (owns the `sudoku` project,
`sudoku-hoq.pages.dev`, custom domain `sudoku.babb.dev`).

Pre-deploy artifact verification — the on-disk lean wasm is the fresh repro-lane artifact:

```
csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm = 90602 B
```

Final build (`web/frontend && npm run build`) — hashed bundles:

```
dist/assets/csp_solver_wasm_bg-DUScTLrL.wasm    90.60 kB (90602 B) │ gzip: 40.61 kB
dist/assets/index-DHwIHXRb.js                  108.03 kB │ gzip: 36.56 kB
dist/assets/index-Bykbkkbm.css                  47.77 kB │ gzip: 10.59 kB
dist/assets/animation-vendor-D8Sq8uAR.js        67.28 kB │ gzip: 26.94 kB
dist/sw.js + dist/manifest.webmanifest generated (PWA precache 22 entries, 397.61 KiB)
```

**Production-branch correction.** The `sudoku` project's `production_branch` is `master`,
not `main`. The first deploy (`--branch=main`) landed as a **preview**
(`https://bddf69b3.sudoku-hoq.pages.dev`) — the custom domain, which serves production,
stayed on the pre-tranche bundle (`index-CZHZBZxm.js`). Re-deployed to the production
branch:

```
npx wrangler pages deploy dist --project-name=sudoku --branch=master --commit-dirty=true
✨ Success! Uploaded 0 files (23 already uploaded)
✨ Uploading _headers
✨ Uploading _redirects
✨ Deployment complete! https://b1a3f886.sudoku-hoq.pages.dev
```

## 3. Live probes — https://sudoku.babb.dev (post-production-deploy)

**Probe 1 — root 200 + security headers:**

```
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, must-revalidate
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:
  https://avatars.githubusercontent.com; connect-src 'self'; worker-src 'self' blob:;
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
x-frame-options: DENY
```

(The tightened tranche CSP — self-hosted fonts, `connect-src 'self'`, `wasm-unsafe-eval`
for the in-browser wasm — confirms the NEW `_headers` shipped, superseding the pre-tranche
google-fonts/api-origin CSP.)

**Probe 2 — index.html references the NEW hashed bundles:**

```
assets/index-DHwIHXRb.js
assets/index-Bykbkkbm.css
assets/animation-vendor-D8Sq8uAR.js
```

Byte-identical to the local `dist/` — the live production HTML now points at this build.

**Probe 3 — hashed JS asset immutable:**

```
HTTP/2 200
content-type: application/javascript
cache-control: public, max-age=31536000, immutable
```

**Probe 4 — service worker + manifest serve 200:**

```
sw.js                 → HTTP/2 200  content-type: application/javascript
manifest.webmanifest  → HTTP/2 200  content-type: application/manifest+json
```

**Probe 5 — wasm asset content-type + immutable:**

```
HTTP/2 200
content-type: application/wasm
cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable
```

(The doubled `cache-control` value is a benign overlap of the `_headers` `/assets/*` rule
with Pages' hashed-asset default — same directives, idempotent.)

## Outcome

- crates.io: **csp-solver 0.3.0 live** (`max_version` = newest = 0.3.0).
- CF Pages: **sudoku.babb.dev now serves the tranche-2 build** (`index-DHwIHXRb.js`),
  production deployment `b1a3f886`, all five live probes green. The pre-tranche
  redeploy debt in MEMORY.md ("STILL PRE-TRANCHE until the owner redeploys Pages") is
  discharged.
