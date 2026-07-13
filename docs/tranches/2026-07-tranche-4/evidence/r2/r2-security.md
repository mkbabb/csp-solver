# r2-security — defensive audit of our own product

Lens: (a) live headers, (b) share-URL codec hardening at runtime, (c) worker protocol
threat model, (d) repo hygiene / secrets, (e) lockfile integrity. No source edits; all
probes banked and rerunnable. Verdict up front: the security posture is **genuinely
strong** — the substantive findings are all P3 defense-in-depth. The one record correction
is that the memory ledger's "live site STILL PRE-TRANCHE" is stale for the header set: the
live edge already carries the full hardened stack (curl-verified below).

---

## (a) Headers — LIVE and tight (CONFIRMED-good + one record correction)

Probe (banked): `curl -sS -D - -o /dev/null https://sudoku.babb.dev/`
Live response headers (2026-07-12, `cf-ray: a1a3accd9ac6d643`):

```
content-security-policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline'; font-src 'self';
  img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self';
  worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';
  frame-ancestors 'none'
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
cache-control: public, max-age=0, must-revalidate   (on / — revalidates, correct)
```

The live CSP/HSTS/XFO/nosniff/referrer set is **byte-identical** to the tree's
`web/frontend/public/_headers:74-78` (and `dist/_headers` is identical to `public/` —
`diff -q` clean). Every clause is the minimum necessary and justified in the file's header
comment (`_headers:14-71`): `'wasm-unsafe-eval'` for the wasm solver, `style-src
'unsafe-inline'` for Vue/pencil-boil inline styles (no nonce plumbing), the single
`avatars.githubusercontent.com` img allowance for the attribution avatar. No `'unsafe-eval'`,
no script `'unsafe-inline'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`
belt-and-suspenders with `X-Frame-Options: DENY`. This is a stronger header set than a static
puzzle app strictly needs.

**Record correction (family_hint: `record-stale-posture`)**: MEMORY.md and r1 carry
"Live sudoku.babb.dev is CF Pages static and STILL PRE-TRANCHE until the owner redeploys
Pages". For the security-header surface that is stale — the live edge already serves the
`_headers` set landed at T3-W2 (`f6f28420`). Headers are live and correct today. (The
visual/content pre-tranche claim is a separate axis this lane doesn't touch.)

### P3 SEC-1 — no `Permissions-Policy` header (defense-in-depth gap)
family_hint: `header-hardening-gap`
`grep -rni 'permissions-policy|cross-origin-opener|cross-origin-embedder' public dist
index.html` → nothing. A static puzzle app uses **zero** powerful features
(geolocation, camera, microphone, USB, payment, etc.). The `_headers` `/*` stanza should
ship a lock-everything-off `Permissions-Policy` (e.g. `geolocation=(), camera=(),
microphone=(), payment=(), usb=(), …`). Purely additive hardening — no behavior it would
break, since the app requests none of these. (COOP/COEP correctly absent — no
SharedArrayBuffer.)

### P3 SEC-2 — HSTS `preload` token is aspirational, not submitted
family_hint: `header-hardening-gap`
`_headers:75` carries `preload`, and the file's own comment (`_headers:63-65`) admits the
token "only marks eligibility… that's a separate, manual, owner action." Confirm the domain
is actually submitted to hstspreload.org, or drop the token — a `preload` directive on a
non-submitted domain is inert and misleads a reader into thinking preload is active.
Ops/doc-truth, not a live defect.

### P3 SEC-3 — `_headers` comment carries stale "Confirmed absent per Pass-1 M5b" narration
family_hint: `doc-meta-leak` (folds into FAM-8)
`_headers:5` — "Confirmed absent per Pass-1 M5b; this is the CF Pages-side security-header
set". The headers are no longer absent — they're live. Tranche/pass narration baked into a
live config file, same meta-leak class the census flags elsewhere.

---

## (b) Share-URL codecs — W11 hardening REJECTS at runtime (CONFIRMED, 18/18)

Probe (banked): `r2/probe-codec-harden.mjs` — bundles the **shipped**
`games/{sudoku,futoshiki}/composables/useUrlState.ts` via esbuild (real code, not a
transcription; `@`-alias resolved to `src/`), stubs `window.location.search`/`localStorage`,
and drives adversarial `?board=` blobs through the real `resolveInitialState()`. Result:
`18 pass / 0 fail`.

Sudoku (`useUrlState.ts:95-142`) verified rejecting → falls to `fresh`/size-only, never
`url-board`:
- oversize raw >4096 (`:102`), non-canonical size `" 3"`/`"-3"`/`"0x3"`/`"03x"`/`"3.5"`
  (`:114` `/^\d+$/`), cell value >maxVal (`:128`), short cell count (`:122`), invalid size 5
  (`:116`), non-base64 garbage (`fromBase64Url` throw caught `:106`).

Futoshiki (`useUrlState.ts:99-178`) verified:
- non-adjacent ineq pair (`:156-160`), out-of-range index (`:149-153`), duplicate pair
  (`:161-163` `seen`), **exactly** maxPairs=40 accepted, over-maxPairs distinct-adjacent
  (reversed `b-a` keys) rejected by the count guard (`:164`), oversize raw (`:103`).

The W11 fail-closed contract holds against every crafted input. No new URL surface has been
added since: `git log -- .../useUrlState.ts` → last touch `7c967416` **T3-W11**; W13
(`bbeb2b87`/`d0893614`) touched neither file. The brief's "W13 touched none — verify" is
**CONFIRMED**.

### P3 SEC-4 — Futoshiki ineq indices use lenient `parseInt`, asymmetric with size guard
family_hint: `parse-leniency`
`useUrlState.ts:144-145` — `parseInt(ab[0], 10)` / `parseInt(ab[1], 10)` with **no**
`/^\d+$/` canonical guard, while the size field one block up (`:115`) is deliberately strict
and its comment advertises the strictness ("`" 4"`, `"-4"`, `"0x4"` all fail closed"). So
`?board=…5.<25 zeros>.0-1abc` parses to pair `[0,1]` (trailing garbage silently dropped).
**No exploit** — the pair still faces the adjacency + range + dedup + count gates downstream,
so a non-canonical encoding can only produce a semantically-identical accepted pair or a
rejection. It's a doc-truth/consistency wart, not a hole. Sudoku's cell loop has the same
lenient-`parseInt` shape but base-36 single chars leave no room for garbage.

---

## (c) Worker protocol — threat model CLOSED (CONFIRMED-good, one P3 note)

Both workers (`games/{sudoku,futoshiki}/solver/solver.worker.ts`) are **dedicated** module
workers instantiated same-origin: `new Worker(new URL('./solver.worker.ts', import.meta.url),
{ type: 'module' })` (`useSolver.ts:65`/`:47`). A dedicated worker's `message` port is
reachable **only** from its creating context — there is no cross-origin or cross-window path
to post to it. "A hostile message to the solver worker" therefore presupposes already-running
same-origin script (i.e. an XSS that the CSP is built to prevent), at which point the worker
is not the interesting target.

Malformed-message behavior is graceful: the handler reads `req.kind` and passes fields
straight to `solveSudoku(req.board, req.n, …)` (`solver.worker.ts:84`). A garbage `req.board`
hits wasm-bindgen's type check → `TypeError` → caught (`:130`) → `describeError` →
`WORKER_FAILURE` response (`:58-66`). No crash, no hang, no eval surface, no prototype
pollution vector.

DoS bound is closed too: `nodeBudget` and `maxSolutions` are **app-fixed**, never
user/URL-controllable — `maxSolutions: 1` is hardcoded (`useSolver.ts:190`), `nodeBudget`
comes from `NODE_BUDGET_BY_SIZE` (`useSudoku.ts:32-38` fallback 1M; `useFutoshiki.ts:28-35`
fallback 4M). And any board reaching `solve` was already range-/size-clamped by
`decodeBoardParam` (valid sizes cap at 4/7). So even a URL-injected board solves within a
bounded node budget → `BUDGET_EXCEEDED`, never an unbounded spin.

### P3 SEC-4b — worker request has no shape validation (defense-in-depth)
family_hint: `worker-input-unvalidated`
The `message` handler does not validate that `event.data` is an object or that per-kind
fields have the expected type; it relies on wasm-bindgen to throw. Given the dedicated-worker
same-origin model above this is a non-issue in practice, but a `switch (req.kind)` with an
early typed-guard would make the contract explicit rather than incidental to wasm-bindgen's
argument coercion.

---

## (d) Repo hygiene — CLEAN (CONFIRMED-good)

- `.env` is **not tracked** (`git ls-files | grep .env` → only `.env.example`), and is
  ignored (`.gitignore:22-23`). The real `.env` holds only `PYTHONPATH=.` — no secret.
- Secret-pattern `git grep` (api_key/secret/password/token/bearer/private-key/AKIA/ghp_/sk-/
  BEGIN-KEY/CLOUDFLARE/CF_API, lockfiles excluded) → **zero** true positives; every hit is
  `CancelToken` (Rust solver cancellation) or design "token" (palette). No Cloudflare API
  token, account id, or deploy credential anywhere in tree — deploy is `wrangler` under the
  owner's local auth (`package.json`), nothing in-repo.
- `.env.example` drift is already booked at r1 (config-census P3) — not re-raised.

## (e) Lockfile integrity — CLEAN (CONFIRMED-good)

npm (`web/frontend/package-lock.json`, lockfileVersion 3):
- 669/669 remote deps resolve to `registry.npmjs.org` **with** `integrity` sha512. The only
  `resolved`-without-integrity entry is the `file:../../csp-solver/wasm/pkg` link
  (`@mkbabb/csp-solver-wasm`) — expected for a local file dep. No git/http/tarball-URL deps.
- 6 `hasInstallScript` packages, all mainstream and expected: `esbuild`, `sharp`,
  `workerd`, `wrangler`, `fsevents` (×3). No unknown postinstall.
- `pencil-boil` pinned `^0.8.1`, lockfile resolves 0.8.1 from the registry with integrity
  (`package-lock.json:3016-3020`).

Cargo (`Cargo.lock`): all 119 sources are `registry+https://github.com/rust-lang/crates.io-index`.
Zero `source = "git…"` deps. (The absence of a cargo-audit/deny CI lane is already booked at
r1 FAM-4 [P3] — not re-raised.)

---

## Probe bank (rerunnable, non-destructive)
```
# (a) live headers
curl -sS -D - -o /dev/null https://sudoku.babb.dev/ | grep -iE 'content-security|strict-transport|x-frame|x-content-type|referrer'
# (b) codec hardening at runtime — bundles shipped decoders, 18 adversarial vectors
cd web/frontend && node /…/tranche4/r2/probe-codec-harden.mjs        # → 18 pass / 0 fail
# W13 no-new-surface
git log --oneline -- web/frontend/src/games/*/composables/useUrlState.ts   # top = 7c967416 T3-W11
# (d) secrets
git ls-files | grep -E '(^|/)\.env$'    # empty (untracked)
git grep -nEi '(api[_-]?key|secret|password|bearer|AKIA|ghp_|sk-)' -- . ':(exclude)*lock*'
# (e) lockfile integrity
python3 -c "import json;d=json.load(open('web/frontend/package-lock.json'));print('no-integrity:',[k for k,v in d['packages'].items() if v.get('resolved') and not v.get('integrity')])"
grep -oE 'source = \"[^\"]+\"' Cargo.lock | sort | uniq -c
```

## Family hints introduced
- `header-hardening-gap` (SEC-1 Permissions-Policy, SEC-2 HSTS-preload-aspirational)
- `parse-leniency` (SEC-3 futoshiki ineq parseInt)
- `worker-input-unvalidated` (SEC-4b — defense-in-depth)
- `record-stale-posture` (headers-live correction to MEMORY "pre-tranche")
- `doc-meta-leak` (SEC-3 `_headers` Pass-1 narration — folds FAM-8)
