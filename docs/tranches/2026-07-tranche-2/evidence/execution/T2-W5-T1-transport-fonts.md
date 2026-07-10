# T2-W5 · Lane T1 — transport + fonts (execution evidence)

Rebuilt the P5 font subsets from upstream `google/fonts` variable sources
(fonttools 4.63.0 + brotli, `uv tool run`), added the Q4-amended `/assets/*`
cache stanzas to `public/_headers`, tightened CSP `font-src`/`style-src`, and
hardened the GitHub avatar beacon. Cargo bench was running on the box; all work
here is count/byte-based (load-insensitive) — no timing measurements taken.

## Measured font bytes (rebuilt, not inherited)

`pyftsubset <src> --flavor=woff2 --text-file=<derived> --layout-features=''
--no-hinting --desubroutinize --drop-tables+=DSIG`; Fraunces first instanced
`SOFT=0 WONK=1` via `varLib.instancer` (opsz + wght kept variable).

| Face | Rebuilt bytes | P5 bytes | Drift | Glyphs (cmap) |
|---|---:|---:|---:|---:|
| Fira Code (`firacode-subset.woff2`) | **3,624** | 3,624 | byte-exact | 22 |
| Patrick Hand (`patrickhand-subset.woff2`) | **3,840** | 3,840 | byte-exact | 44 |
| Fraunces (`fraunces-subset.woff2`, 2-axis) | **9,772** | 9,764 | +8 B (+0.08%) | 20 |
| **Total** | **17,236** | 17,228 | +8 B (+0.05%) | |

Coverage verified programmatically (`TTFont.getBestCmap()` vs every derived
char) — zero missing glyphs, all three faces. 2/3 byte-exact + Fraunces within
0.08% (timestamp noise, well inside the wave's ~1% / 0.8% tolerance).

Source layout (per P5.diff): `web/frontend/src/assets/fonts/*.woff2`. Vite
emits them as content-hashed `dist/assets/*.woff2` at exact bytes
(`assetsInlineLimit` guard forces the two <4 KB faces to stay separate files).

## Build

`npm run build` (vue-tsc 3.3.7 + vite 8.1.4) — clean. Emitted:
`dist/assets/firacode-subset-CbuNTc2a.woff2` (3,624), `…patrickhand-…` (3,840),
`…fraunces-…` (9,772). `dist/index.html` has no live Google-Fonts stylesheet
href; built CSS carries 3 `@font-face` rules.

## Residual `fonts.googleapis` / `fonts.gstatic` grep

Zero **live/functional** allowances under `web/frontend/**` (only prose comments
in `index.html`, `index.css`, `_headers`, `Dockerfile` explaining the removal —
the P5.diff mentions the strings in comments identically). The one remaining
live CSP allowance is `web/nginx/sudoku.conf:32`, **outside this lane's
`web/frontend/**` scope** (P5.diff assigns the nginx surface separately) — see
Blockers. The in-scope `web/frontend/Dockerfile:48` internal-nginx CSP mirror
was tightened here for lockstep with `_headers`.

## Avatar — CSP-vs-beacon resolution

`AttributionCard.vue`: `?s=64` (104 KB → ~6 KB for the 40 px render) +
`width/height="40"` + `loading="lazy"` + `decoding="async"` +
`referrerpolicy="no-referrer"`. The single decorative `<img>` stays a remote
fetch, so the `img-src https://avatars.githubusercontent.com` allowance is
**retained** (that one allowance is what lifts it out of `default-src` deny);
the beacon is hardened at the element (no eager first-paint hit, no referrer
leak) rather than inlined as a 6 KB base64 blob (which would still need `data:`
in `img-src` and cost more than a cache-hit fetch).

## Final CSP (both in-scope surfaces, `public/_headers` + `Dockerfile`)

```
default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self' https://api.sudoku.babb.dev; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

## Final `public/_headers` transport stanzas (the Q4 ADD)

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable
```
