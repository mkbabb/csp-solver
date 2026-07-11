# T3-WGATE — Lane D — the final deploy + live probes

**Gate SHA** `b4d7aedf` (T3-W12 landed; 13 waves complete). **Deployed** 2026-07-11.
The tranche goes to production: the lean web-target wasm rebuilt byte-identical at
the gate SHA, the final `dist/` shipped to Cloudflare Pages on the **master** (production)
branch, and the live edge probed head-to-tail — headers, the W2 `_headers` fix, bundle
parity, and a headless drive of the real site in both themes.

---

## 1. Build — the lean web-target wasm + the final dist

**wasm** (`wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features`):

```
[INFO]: ✨   Done in 1.44s
[INFO]: 📦   Your wasm pkg is ready to publish at csp-solver/wasm/pkg.
```

- `csp_solver_wasm_bg.wasm` = **86,746 B** — matches the lane's expected lean web-target size.
- **Byte-identical across rebuild** — SHA-256 `d0be085754f59af99e44c2f55475ce32ab64bd3c67adabdd9e036d73ebaf4e36`
  before and after the rebuild (deterministic; the on-disk artifact WAS already the gate-SHA build).
- Web-target confirmed: the emitted `csp_solver_wasm.js` carries `async function __wbg_init`,
  `instantiateStreaming`, `new URL`, `export default` — the `--target web` glue, not bundler.

**dist** (`npm run build` → `vue-tsc -b && vite build`): clean, 168 modules, `✓ built in 371ms`.

```
dist/assets/csp_solver_wasm_bg-DMt0Bldp.wasm    86.74 kB │ gzip: 38.64 kB
dist/assets/index-CA95x9Ze.js                  131.43 kB │ gzip: 43.54 kB
dist/assets/index-DsM5Gq24.css                  60.82 kB │ gzip: 12.80 kB
dist/assets/vue-vendor-BVqlx1b0.js              75.77 kB │ gzip: 30.45 kB
PWA v1.3.0 · generateSW · precache 22 entries (439.82 KiB) → dist/sw.js
```

The `_headers` W2 fix is present in `dist/`: the `/assets/*.wasm` stanza restates **only**
`Content-Type: application/wasm` (no Cache-Control), while `/assets/*` carries the single
`Cache-Control: public, max-age=31536000, immutable` — the G8-H2 doubled-directive fix.

## 2. Deploy — Cloudflare Pages, master (production) branch

`CLOUDFLARE_API_TOKEN` exported from `~/Programming/value.js/.env`, then:
`npx wrangler pages deploy dist --project-name=sudoku --branch=master`

```
✨ Success! Uploaded 12 files (11 already uploaded) (1.48 sec)
✨ Uploading _headers
✨ Uploading _redirects
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://0e8d69e9.sudoku-hoq.pages.dev
```

- **Deployment ID**: `0e8d69e9` — `https://0e8d69e9.sudoku-hoq.pages.dev`
- **Branch**: `master` (the T2 lesson — master IS the production branch; `main` would land a preview).
  Confirmed production by the live bundle parity below (custom domain serves this deploy's hashes).

## 3. Live probes — https://sudoku.babb.dev

### 3.1 Root — 200 + the CSP/HSTS header set

```
HTTP/2 200
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
cf-cache-status: DYNAMIC
```

### 3.2 The wasm asset — application/wasm + a SINGLE Cache-Control (the W2 `_headers` fix bites at the edge)

`curl -sSI https://sudoku.babb.dev/assets/csp_solver_wasm_bg-DMt0Bldp.wasm`:

```
HTTP/2 200
content-type: application/wasm
cache-control: public, max-age=31536000, immutable
x-content-type-options: nosniff
```

`grep -ic 'cache-control'` over the response = **1**. This closes the pending-Pages gate:
the G8-H2 doubled `.wasm` Cache-Control (`…immutable, public, max-age=31536000, immutable`)
is **gone at the live edge** — the `/assets/*.wasm` stanza now pins only Content-Type, the
`/assets/*` rule supplies the lone immutable Cache-Control.

### 3.3 Bundle parity — live index.html references the new hashed bundles (== local dist)

Live `https://sudoku.babb.dev/` and local `dist/index.html` reference the identical hash set:

```
assets/animation-vendor-B2WtUyZh.js
assets/csp_solver_wasm_bg-DMt0Bldp.wasm
assets/index-CA95x9Ze.js
assets/index-DsM5Gq24.css
assets/vue-vendor-BVqlx1b0.js
```

### 3.4 PWA furniture — sw.js + manifest both 200

```
sw.js                 -> HTTP/2 200  content-type: application/javascript
manifest.webmanifest  -> HTTP/2 200  content-type: application/manifest+json
```

### 3.5 Headless drive of the LIVE site (chromium 1440×900, `wgate-live-drive.mjs`)

| Interaction | Probe result |
|---|---|
| **Solve a board** (randomize → solve) | `.board-wrapper.solve-success`; **81/81** `.sudoku-cell` filled |
| **Margin vignette / page quiet** | grade renders in the margin ("solved it! · 0 backtracks — 1ms"); `below_board_scan.tallestBelow = 0` — **nothing substantial renders below the board** (the W12 quiet page) |
| **Toggle theme (the whirl)** | `html.dark` set true; `svg.toggle-moon.is-active` present |
| **Drawer open/close at 1440** | `#controls-drawer` visible → hidden → visible on two `.drawer-tab` clicks (toggles cleanly) |
| **Switch games (the page-turn)** | `button.logo-trigger` → option `futoshiki` → `.futoshiki-cell` mounts (**25** cells, carets paint) |

**Screenshots** (banked, load-bearing — the lane mandate; two PNGs only, per the G2 prune policy):
`evidence/T3-WGATE-shots/live-solved-light.png` + `live-solved-dark.png` — the live solved
9×9, both themes, star-sticker grade in the left margin, quiet below the board.

### 3.6 Console — one benign CSP block (not a functional error)

The only console error across the full drive:

```
Loading the script 'https://static.cloudflareinsights.com/beacon.min.js/…' violates
the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval'".
… The action has been blocked.
```

This is Cloudflare's own Web-Analytics beacon, edge-injected, denied by our
`script-src 'self' 'wasm-unsafe-eval'`. It is **not a bundle error** — it confirms the CSP
enforces at the edge. Site function is unaffected (solve/theme/drawer/game-switch all green).

## 4. Disposition

- **Deploy**: `0e8d69e9` live on `master` → sudoku.babb.dev serving the gate-SHA bundle set.
- **Pending-Pages gate CLOSED**: the W2 `_headers` doubled-`.wasm`-Cache-Control fix (G8-H2)
  is live-proven — `application/wasm` + one Cache-Control at the edge.
- **The tranche is in production.** No blockers. (The owner-side `v0.7.0` tag / worktree purge /
  HSTS-preload-list submission remain owner actions carried in the WGATE record — none gate this ship.)
