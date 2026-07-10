# G8 — SECURITY PROBE (pass-3, closing)

**Lane:** G8-security-probe · **Charter:** the A24-flagged surface — deployed headers, permalink
codec input hardening, wasm worker message validation. Verify at `:3000` AND `sudoku.babb.dev`.
**Method:** live header capture (curl vs `sudoku.babb.dev`), a 33-case adversarial fuzz of both
permalink decoders (`fuzz.mjs`, replicates the exact HEAD decoder logic), source trace of the
decoded-array → render path, worker-instantiation + XSS-sink sweep.
**Verdict:** **PASS with one LOW actionable finding (G8-P2, homed in W11).** No XSS, no prototype
pollution, no code-exec, no data-exfil path exists. The decoders fail closed. The CSP is complete
and correctly scoped for the wasm-only topology. The single real hardening gap is a reflected
client-side render-DoS via the unbounded, adjacency-unvalidated Futoshiki inequality list.

**`:3000` vs live.** The security-header surface is Cloudflare-Pages `_headers` (edge-applied) — it
is NOT emitted by the Vite dev server (`curl localhost:3000/` → `426 Upgrade Required`, not the SPA;
headers are a production-edge concern by design). All header findings below are verified **live at
`sudoku.babb.dev` on 2026-07-10**. The codec + worker logic is identical source in dev and prod, so
those findings hold at both.

---

## Rows for the tranche (W11 security pass)

| ID | Area | Severity | Verdict | Disposition |
|---|---|---|---|---|
| G8-H1 | CSP / security headers completeness | — | **PASS** | no change; record the clean bill |
| G8-H2 | `.wasm` doubled Cache-Control + absent CSP + false "merges over" comment | LOW | drift | **= A9 / A17-P7 (ADOPT-trivial)** — drop redundant directive, true the comment |
| G8-H3 | blanket `access-control-allow-origin: *` (CF edge default) | INFO | benign | note only — public static content, no secrets/credentialed endpoints |
| G8-H4 | no `Permissions-Policy`; no COOP/COEP | INFO | optional | defense-in-depth only; COOP/COEP not required (single-thread wasm, no SAB) |
| G8-P1 | permalink decoder injection/pollution/DoS resistance | — | **PASS** | no change; fails closed on all 33 fuzz cases |
| **G8-P2** | **Futoshiki inequality list: unbounded + adjacency-unvalidated + un-deduped → reflected render-DoS** | **LOW** | **FINDING** | **W11: enforce adjacency + cap count + dedup in `decodeBoardParam`; fixes types.ts:29-30 doc-vs-code drift** |
| G8-P3 | decoder parser leniency (`02`, `" 2"` → size 2; non-canonical) | INFO | robustness | note only; no security impact |
| G8-W1 | wasm worker message validation | — | **PASS (N/A)** | dedicated Worker — no cross-context injection surface; A24 concern is a non-issue by construction |

---

## 1. Deployed headers / CSP (live, `sudoku.babb.dev`)

**Live CSP (identical on `/`, `/assets/*.js`, `/sw.js`):**
```
default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';
font-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self';
worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```
Plus `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Frame-Options:
DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
`public/_headers` and `dist/_headers` are **byte-identical** (diff clean).

**G8-H1 — CSP is complete and correctly scoped. PASS.** The material properties:
- `script-src` carries **no** `'unsafe-inline'` and **no** `'unsafe-eval'` — only `'wasm-unsafe-eval'`
  (the minimal keyword to instantiate same-origin WebAssembly on Firefox/Safari). Script-injection
  is denied by policy.
- `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'` — the four
  commonly-omitted hardening directives are all present.
- `connect-src 'self'` is correct for the wasm-only topology (zero cross-origin fetch in the bundle;
  the wasm binary is a same-origin `/assets/*.wasm` fetch). `worker-src 'self' blob:` covers the
  dedicated solver Worker. `img-src` names exactly one third party (`avatars.githubusercontent.com`,
  the AttributionCard avatar) — element-hardened (`?s=64`, `loading=lazy`, `referrer-policy`).
- Directives with no explicit clause (`frame-src`, `manifest-src`, `media-src`) correctly fall back
  to `default-src 'self'`.
- The one documented weakness — `style-src 'unsafe-inline'` — is **justified and low-impact**: Vue
  `:style` bindings + the pencil-boil animation system set inline style attributes at runtime with no
  nonce plumbing. Given the total absence of any script-injection sink (§4), the residual risk (CSS
  exfil via injected style) has no delivery vector on this surface.

**G8-H2 — `.wasm` doubled `Cache-Control`, absent CSP, false "merges over" comment. LOW / drift.**
Empirically confirmed live:
```
$ curl -sSI https://sudoku.babb.dev/assets/csp_solver_wasm_bg-DUScTLrL.wasm
content-type: application/wasm
cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable   <-- DOUBLED
```
This **proves** the `_headers` comment "The more-specific `/assets/*.wasm` merges over `/assets/*`"
is false — Cloudflare Pages **appends** matching-rule headers, it does not replace, so both stanzas'
`Cache-Control` land and concatenate. Two further observations: the CSP header is **absent** on the
`.wasm` response (only the `/assets/*` + `/assets/*.wasm` rules materialized; the `/*` rule did not
apply to it — inconsistent with the `.js` response, which *does* carry CSP). Neither is exploitable —
a `Cache-Control` list with duplicate identical directives parses to the same policy, and a CSP
header on a subresource byte-response is inert (the fetching worker's inherited CSP governs, not the
response's own header). This is the already-dispositioned **A9 / A17-P7** row; the fix (drop the
redundant `Cache-Control` from the `.wasm` stanza, keep only `Content-Type`, true the comment) closes
it. Homed there, not a new W11 item.

**G8-H3 — blanket `access-control-allow-origin: *`. INFO / benign.** Every live response (HTML, JS,
wasm) carries `access-control-allow-origin: *` (a Cloudflare-Pages default). For a credential-less
public static site with no secrets and no same-origin-protected endpoint, this permits cross-origin
`fetch()` reads of assets that are already world-readable — no confidentiality boundary is crossed.
Worth an explicit line in the record (it is a blanket allow), not a fix.

**G8-H4 — no `Permissions-Policy`, no COOP/COEP. INFO / optional.** The response carries no
`Permissions-Policy`, so unused powerful features (geolocation, camera, microphone, USB, etc.) sit at
UA default rather than being explicitly denied. Pure defense-in-depth — the app requests none of
them. COOP/COEP are **not** required: the wasm is single-threaded, there is no `SharedArrayBuffer` /
`crossOriginIsolated` dependency. Optional to add `Permissions-Policy: geolocation=(), camera=(),
microphone=(), interest-cohort=()`; not a defect.

---

## 2. Permalink codec input hardening (fuzzed)

Fuzz harness: `pass3/fuzz.mjs` — replicates the exact HEAD `decodeBoardParam` logic for both games,
33 adversarial `?board=` payloads. `atob`/`btoa` are node globals so the codec runs verbatim.

**G8-P1 — decoders fail closed; injection/pollution/XSS-resistant. PASS.** Every malformed, oversized,
out-of-range, wrong-length, wrong-part-count, and non-base36 payload returned `null` (fail-closed) with
**zero throws** and **zero prototype pollution** across both decoders. The structural reasons this is
robust, not incidental:
- **No prototype pollution:** the value object's keys are **loop-generated indices** (`String(i)`,
  `i∈[0,totalCells)`), never attacker-supplied strings. A `__proto__` in the size field parses to
  `NaN` → rejected; a `__proto__` inequality member parses to `NaN` → rejected. There is no code path
  where URL content becomes an object key.
- **No XSS:** decoded cell values are `parseInt(…,36)` → numbers, range-checked, and rendered only
  through Vue's escaped text interpolation. There is no HTML/attribute sink (§4 confirms zero
  `v-html`/`innerHTML`).
- **Bounded compute:** `totalCells = size**4` with `VALID_SIZES ≤ 4` caps the sudoku cell loop at 256;
  futoshiki `boardSize**2` with `≤ 7` caps it at 49. A 200 KB blob fails the exact-length check
  instantly.
- **Fails closed to a safe path:** any `null` degrades to the size/difficulty-only path — never a
  corrupt board.

**G8-P2 — Futoshiki inequality list is unbounded, adjacency-unvalidated, un-deduped → reflected
render-DoS. LOW / FINDING (the W11 row).** The one payload class the decoder does *not* bound:
```
fuzz: '100k inequalities (DoS?)'  ->  OBJECT size=4 givens=16 ineqs=100000  [17ms]
fuzz: 'non-adjacent ineq 0-15'    ->  OBJECT size=4 givens=16 ineqs=1
fuzz: 'dup inequalities'          ->  OBJECT size=4 givens=16 ineqs=3
```
`decodeBoardParam` (futoshiki `useUrlState.ts:126-145`) validates each inequality pair only for
**index range** (`0 ≤ a,b < totalCells`) — never for **adjacency**, **count**, or **duplication**.
The decoded array flows unfiltered:
- `useFutoshiki.ts:361` — `inequalities.value = persisted.inequalities.map(([a,b]) => …)` (no cap).
- `FutoshikiBoard.vue:104` `caretDescriptors` — iterates the **entire** array, emitting one SVG caret
  descriptor per pair (100k pairs → 100k `<FutoshikiCaret>` nodes → main-thread freeze / tab hang).

A crafted reflected link `sudoku.babb.dev/?game=futoshiki&board=<blob>` with ~100k pairs (decode
17 ms; the practical ceiling is the ~2 MB Chrome URL limit → ~500k pairs) hangs a victim's tab on
open. Non-adjacent pairs (e.g. `0-15` on a 4×4) render **mis-positioned floating carets** at edges
that don't exist; duplicates emit duplicate Vue `key`s (`${gt}-${lt}`).

This **directly contradicts the documented invariant** at `futoshiki/types.ts:29-30`:
> *"Always orthogonally adjacent (the wire boundary rejects non-adjacent pairs — a caret has no
> shared edge to render otherwise)."*

The wire boundary does **no such rejection** at HEAD. So this finding closes a doc-vs-code drift as
well as a hardening gap.

**Severity ceiling: LOW.** No injection, no pollution, no XSS, no code-exec, no exfil — the worst case
is a reflected client-side tab-freeze that requires the victim to open a hostile link, is bounded by
the URL-length limit, and affects only the attacker-targeted tab. But it is real, cheap to fix, and
on-mandate (a shipped product permalink feature on a static origin).

**Fix (W11):** in futoshiki `decodeBoardParam`, before pushing each pair, enforce orthogonal
adjacency (`(Math.abs(a-b)===1 && ⌊a/n⌋===⌊b/n⌋) || Math.abs(a-b)===boardSize`); cap the total at the
maximum adjacent-pair count `2·n·(n-1)` and return `null` past it; dedup. As symmetric
defense-in-depth for both games, optionally cap `raw.length` (reject `board` params beyond, say, a few
KB) before `atob`. All fail-closed, consistent with the decoder's existing grammar.

**G8-P3 — parser leniency. INFO / robustness.** `parseInt('02',10)` and `parseInt('  2',10)` both
yield `2`, so `02.…` and a leading-whitespace size decode as a valid size-2 board — the encoding is
**non-canonical** (multiple blobs map to one board). No security impact (still range- and
length-checked); a note only, optionally tightened with a strict `/^\d+$/` size guard alongside the
G8-P2 fix.

---

## 3. wasm worker message validation

**G8-W1 — non-issue by construction. PASS (N/A).** Both games instantiate a **dedicated** worker:
```
useSolver.ts:65 (sudoku) / :47 (futoshiki):
  worker = new Worker(new URL('./solver.worker.ts', import.meta.url), { type: 'module' })
```
A dedicated `Worker`'s `self.addEventListener('message')` (`solver.worker.ts:68` /
futoshiki `:47`) receives messages **only from the page that created it** — same-origin, same
browsing context. There is no `SharedWorker`, no `BroadcastChannel`, and no main-thread
`window.addEventListener('message')` receiver anywhere in `src/` (grep-confirmed). Consequently there
is **no cross-origin / cross-context message-injection surface**, and `event.origin` / schema
validation is inapplicable to a dedicated worker. The worker forwards only numeric board data to the
wasm engine, which carries its own release-guarded domain invariants. A24's "wasm worker message
validation" concern is dispositioned as a non-issue; no W11 work is required. (The worker's
`try/catch` + `req.kind` branch already fails safe — an unknown/absent kind falls through the
generate branch and any throw posts a typed `WORKER_FAILURE`.)

---

## 4. XSS / injection sink sweep

`grep -rniIE 'v-html|innerHTML|dangerouslySet|eval\(|new Function'` over `src/**/*.{ts,vue}` →
**zero hits** (extends A24's session grep). No main-thread `postMessage`/`message` receiver. Decoded
permalink content reaches the DOM only as Vue-escaped numeric text and as SVG caret geometry computed
from range-checked integer indices. No HTML/attribute/script sink exists for URL-borne content.

---

## Artifacts
- `pass3/fuzz.mjs` — 33-case adversarial decoder fuzz (re-runnable: `node fuzz.mjs`).
- Live header captures cited inline (curl vs `sudoku.babb.dev`, 2026-07-10).

*Report by the G8-security-probe lane. Overall PASS; one LOW actionable finding (G8-P2) homed in
W11 alongside the types.ts:29-30 doc-truth correction; G8-H2 folds into the existing A9/A17-P7 row;
all other rows PASS or INFO. Every claim cites file:line or a live/fuzz result.*
