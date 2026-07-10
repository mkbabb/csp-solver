# Q4 — W5/W6 interaction: cache-header beats vs PWA precache

**Pass-3 critique · repo HEAD `8913023e` (read-only) · fresh evidence: repo greps
+ a from-scratch install of `vite-plugin-pwa@1.3.0` / `workbox-build@7.4.1` in
`scratchpad/pwa-probe` to read the ACTUAL config defaults (never trusted a prior
lane's recollection of them).**

## The question, sharpened

Synthesis Residual #6: *"generateSW's precache-first semantics against
`max-age=0`-today/immutable-tomorrow assets needs one deliberate config decision
in W6."* W5 flips the hashed wasm from `max-age=0` → immutable; W6 drops in
`vite-plugin-pwa` generateSW precache. **Do they contradict? Specify the exact SW
strategy for the hashed wasm.**

## Verdict

**They do NOT contradict — they compose on two orthogonal layers, and the W5
immutable header actively OPTIMIZES the W6 precache install.** The "contradiction"
hypothesis is refuted. What the residual correctly flags is one real, narrow
config gap — but it is **not** the wasm (wasm is safe by default); it is the P5
`woff2` fonts, which the default precache glob silently drops.

## The current state, re-measured (not inherited)

**The hashed wasm asset.** `web/frontend/dist/assets/csp_solver_wasm_bg-C7Lakph_.wasm`,
**87,853 B** on disk, content-hashed (`-C7Lakph_`). Emitted by Vite's asset
pipeline via `?url` import; both games' workers (`sudoku`, `futoshiki`
`solver.worker.ts:34`) import the **same** binary and `init({module_or_path:
wasmUrl})`. It lives under `/assets/`.

**Current live cache headers are Cloudflare-Pages DEFAULTS, not repo config.**
`web/frontend/public/_headers` carries **no `Cache-Control` / `/assets/*` rule at
all** (only CSP + HSTS + the four security headers — grepped: the sole `max-age`
in the file is HSTS's `63072000`). So the live values verify-17 curled —
`js/css = public, max-age=14400, must-revalidate`, **`wasm = public, max-age=0,
must-revalidate`** (`curl -D- .../csp_solver_wasm_bg-C7Lakph_.wasm`) — are CF
Pages' own defaults filling the vacuum. The nginx layers (`web/nginx/sudoku.conf`,
the frontend `Dockerfile` internal nginx) DO set `immutable` for
`js|css|...|woff2` — but pointedly **not `.wasm`** (regex
`\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$`), and all of nginx/docker
is excised in W2 anyway. Post-W2 the **only** surviving transport surface is CF
Pages `public/_headers`.

So W5's WIN-1 is an **add**, not an edit: one `/assets/*` rule in `_headers`
setting `public, max-age=31536000, immutable`. Because every `dist/assets/*` file
(js, css, wasm, and the P5 woff2) is content-hashed, that single rule covers the
hashed wasm.

## The generateSW mechanics, read from source (not memory)

Installed `vite-plugin-pwa@1.3.0` + `workbox-build@7.4.1` fresh and read the
resolved defaults:

| Knob | Default that actually applies | Source |
|---|---|---|
| `workbox.globPatterns` | **`["**/*.{js,wasm,css,html}"]`** | `workbox-build/build/schema/GenerateSWOptions.json` (vite-plugin-pwa's `defaultWorkbox` does NOT set it → falls to this schema default) |
| `dontCacheBustURLsMatching` | **`/^assets\//`** | `vite-plugin-pwa/dist/index.js:830` |
| `cleanupOutdatedCaches` | **`true`** | `vite-plugin-pwa/dist/index.js:835` (overrides workbox-build's own `false`) |
| `maximumFileSizeToCacheInBytes` | **2,097,152 B (2 MiB)** | `GenerateSWOptions.json` |
| `navigateFallback` | `"index.html"` | `vite-plugin-pwa/dist/index.js:838` |

Two of these are the whole answer:

1. **`.wasm` is already in the default glob.** The hashed wasm is precached by
   default. No amendment needed to catch it. (Contrast the naive fear that a
   minimal PWA drops the wasm — it doesn't.)

2. **`dontCacheBustURLsMatching: /^assets/` → the wasm entry gets
   `revision: null`.** Confirmed the transform chain:
   `transform-manifest.js:34-35` pushes `noRevisionForURLsMatchingTransform`,
   which sets `entry.revision = null`
   (`no-revision-for-urls-matching-transform.js:22`). A `revision:null` entry is
   precached at its **exact URL with no `__WB_REVISION__` query param appended**.

That second fact is the pivot the whole "contradiction" question turns on: **the
SW precache-install request URL is byte-identical to the immutable-cached URL**
(`/assets/csp_solver_wasm_bg-C7Lakph_.wasm`, no query suffix). The HTTP cache and
the SW precache are therefore keyed on the same URL — they cannot disagree.

## Why they compose instead of contradict

Two layers, disjoint jurisdictions:

- **W5 HTTP `immutable`** governs (a) the very first visit, before any SW is
  installed or controlling — the main-thread-spawned Worker fetches the wasm
  straight off the network then; (b) the SW's own install-time precache fetch;
  (c) any client where the SW is unsupported / unregistered / errored.
- **W6 SW precache (cache-first)** governs repeat visits once the SW controls the
  page: the Worker's `?url` wasm fetch is intercepted and served from Cache
  Storage, zero network, works offline.

The immutable header doesn't merely fail to contradict the precache — **it makes
the install cheaper.** On first load the Worker downloads the wasm; moments later
the SW installs and precaches the *same revisionless URL*. With `immutable`, that
install fetch is satisfied from the warm HTTP cache → **zero extra bytes**. Under
today's `max-age=0, must-revalidate`, the same install fetch forces a conditional
revalidation RTT for a binary the page just downloaded. So `max-age=0` + precache
is the wasteful combination; immutable + precache is the canonical one (it is
exactly the content-hash + immutable + precache triad Workbox's own docs
prescribe).

**Staleness path? None.** Content-hashed filename ⟹ byte-content ⇄ URL is 1:1. New
wasm → new hash → new filename → new URL → new precache entry → the precache
manifest embedded in `sw.js` changes → new SW → `cleanupOutdatedCaches:true` evicts
the old-hash blob from Cache Storage on activate. The old immutable-cached URL is
simply never requested again. Immutable can never serve stale wasm because the
stale bytes never share a URL with fresh bytes.

## The ONE real gap the residual is pointing at (and it isn't the wasm)

The default glob is `{js,wasm,css,html}`. **`.woff2` is not in it.** The P5
self-host lands three hashed `dist/assets/*.woff2` faces (17,228 B total) and W6's
own justification is *"honest now that fonts are self-hosted... hard offline
fail."* With the default glob, the SW precaches the wasm but **not the fonts** —
so an offline reload renders in system-font fallback, silently defeating the
reason W5→W6 sequenced the font self-host before the PWA in the first place. This
is the single deliberate `globPatterns` decision the wave must make explicit.

(Secondary, non-wasm: `favicon.svg` sits at dist root, not `/assets/`, and `svg`
isn't in the default glob either — a minimal manifest's icon wants precaching or
at least an available fetch. Flagged, not load-bearing for the wasm answer.)

## THE ONE DELIBERATE CONFIG — written out

**W5 — `web/frontend/public/_headers`.** Add, scoped to `/assets/*` ONLY (never
`/index.html`, never `/sw.js` — both live at root and must keep revalidating so
the SW-update + first-paint-shell paths work):

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable
```

The second stanza pins `application/wasm` (L27 streaming insurance): it keeps
`instantiateStreaming` on the happy path AND — because the SW stores the *Response
with its headers* — guarantees the offline, cache-served wasm still carries the
right MIME for `init()`. In CF `_headers`, the more-specific `/assets/*.wasm` path
merges over `/assets/*`.

**W6 — `vite.config.ts`, `VitePWA({...})`:**

```ts
VitePWA({
  registerType: 'autoUpdate',          // skipWaiting + clientsClaim (vite-plugin-pwa sets both)
  strategies: 'generateSW',            // default; Workbox globs dist/ at build
  workbox: {
    // Default is {js,wasm,css,html}: wasm already covered, but the P5 woff2
    // faces (and favicon.svg) are NOT — widen or offline has no fonts/icon.
    globPatterns: ['**/*.{js,css,html,wasm,woff2,svg}'],
    // vite-plugin-pwa already sets these two; pinned here for the record:
    dontCacheBustURLsMatching: /^assets\//,  // hashed → revision:null, no __WB_REVISION__
    cleanupOutdatedCaches: true,             // evict superseded wasm/font hashes on activate
    navigateFallback: 'index.html',
    // wasm 87,853 B (lean) ≪ 2,097,152 B default ceiling — no bump needed.
    // NO runtimeCaching route for /assets/* — precache IS the strategy; a
    // second CacheFirst route would double-store the wasm and fight precache.
  },
  manifest: { /* minimal: name, short_name, start_url:'/', display:'standalone', icons */ },
})
```

**SW strategy for the hashed wasm, stated in one line:** *precache-first as a
`revision:null` entry — the content hash in the filename is the version, so no
`__WB_REVISION__` cache-bust, served immutable over HTTP for the install/first-load
fetch and cache-first from Cache Storage at runtime; no runtime route, no size
bump.* generateSW precache-first and `immutable` are the **same** decision
expressed at two layers, not two competing ones.

## Wave-spec amendment implied

**Not "no amendment" — a tightening on both beats (no reversal; the beats hold as
sequenced).**

- **T2-W5 (transport beat).** Amend "immutable cache headers for hashed assets +
  fix the wasm `max-age=0`" to specify: **a single `/assets/*` rule** (covers
  hashed js/css/**wasm**/woff2 in one stroke — it is an *add* to `_headers`, which
  today has no `Cache-Control` rule; the live `max-age=0` is a CF Pages default),
  explicitly **scoped away from `/index.html` and `/sw.js`**, plus the
  `/assets/*.wasm → Content-Type: application/wasm` stanza (promote L27's
  "optionally pin" to MANDATORY — it is also the offline-MIME guarantee for the
  SW-cached Response, not just streaming insurance).

- **T2-W6 (PWA beat).** Amend "generateSW precache only" to name the one config
  decision: **`workbox.globPatterns` MUST be widened to include `woff2`** (and
  `svg`) — the default `{js,wasm,css,html}` precaches the wasm but drops the P5
  self-hosted fonts, silently negating the very "fonts self-hosted before PWA
  precache" dependency the wave already records. Keep vite-plugin-pwa's defaults
  `dontCacheBustURLsMatching:/^assets/` and `cleanupOutdatedCaches:true`.
  **Forbid any `runtimeCaching` route on `/assets/*`** (precache is the sole
  strategy for hashed assets). No `maximumFileSizeToCacheInBytes` bump (wasm
  87,853 B ≪ 2 MiB default).

- **Residual #6 resolution.** Replace "needs one deliberate config decision" with
  its answer: *no contradiction; the hashed wasm is precache-first `revision:null`
  + HTTP-immutable (mutually reinforcing). The only genuine decision is widening
  `globPatterns` to catch the P5 `woff2`.* The W6 gate "offline reload works"
  should assert **fonts + wasm both served from Cache Storage** on the offline
  reload, not just that the shell loads.
