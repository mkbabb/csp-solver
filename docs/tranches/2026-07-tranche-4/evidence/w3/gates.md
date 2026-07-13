# T4-W3 — gate evidence (verify lane)

**Wave**: PWA abrogation + share truth. **Base**: `429e7983` (T4-W0). **Stamp**: MacBook-Pro, 2026-07-13, node v26.0.0 / npm 11.12.1. **Lanes closed here**: P1 (PWA excision, version byte, headers, OG tags) · P2 (share truth, og-card.png) — verify re-ran every probe from the wave's Gates table; all born-RED rows close.

Fresh `npm run build` exit 0; targeted e2e 11/11 on a private preview (`:4173`, never 3000/3001); real-codec vitest 34/34; version-byte node probe 8/8.

## Component gates — every row born RED at HEAD → GREEN

| Gate | Probe (verbatim) | HEAD (RED) | Now (GREEN) |
|---|---|---|---|
| pwa-gone | `grep -rn 'vite-plugin-pwa\|VitePWA\|workbox\|registerSW\|test:pwa' web/frontend/{vite.config.ts,package.json,src,dist}` after a fresh build | import `vite.config.ts:7`, config `:188-240`, dep `package.json:41`, script `:16`; `dist/sw.js`+`dist/workbox-*.js`+`dist/manifest.webmanifest` emitted | **0 matches** (source + dist). Fresh `dist/` carries no `sw.js` / `workbox-*.js` / `*.webmanifest` / `pwa-*.png`; build log shows zero PWA-plugin activity. `favicon.svg` KEPT (`index.html:7`, emitted to `dist/`); `og-card.png` emitted |
| offline-claims | `grep -rniE 'pwa\|offline\|installs and plays\|service worker\|a2hs\|installab' README.md web/frontend/README.md` | 3 live claims (`README.md:59,107`, `web/frontend/README.md:25`) | **0** — purged in-tree (not deferred to W14): the "PWA offline" affordance clause, "The PWA installs and plays offline after first load", the `test:pwa` line + the vite.config `PWA (generateSW)` note all struck |
| og-meta | `grep -c 'og:\|twitter:card' web/frontend/index.html`; `og-card.png` ≤150 KB | **0** OG/social meta | **7** (grep -c); full unfurl: `og:type/title/description/url/image` + `twitter:card`(summary_large_image)`/title/description/image`, game-agnostic copy. `public/og-card.png` = **129,217 B (126.2 KB)** ≤ 153,600 (B1 policy) |
| share-confirm | playwright: deny `clipboard-write` → click Share → the fail notice (not "copied!"); AT name tracks the real outcome | label flips to "copied!" + aria "Link copied" over an empty clipboard (`SudokuGame.vue:64` `.catch(()=>{})` + unconditional `ControlPanel.vue:120-128`) | confirmation keys off the `writeText` **promise** (`useSudoku.ts:331-336` returns it; `ControlPanel.vue:127-161` sets state on resolve/reject). **e2e green** — reject → washi + aria "couldn't copy — link is in the address bar", `?board=` still live in the bar; success → clipboard actually holds `page.url()` (readText truth) |
| corrupt-link | playwright: malformed `?board=` → the margin-voice notice, then a fresh deal | silent degrade to a fresh deal, no word | **e2e green** — `.margin-note` surfaces "this shared link couldn't be read — …" (both games). Decode is now discriminated `absent/ok/invalid` (`useUrlState.ts` `BoardDecode`); `boardLink==='invalid'` drives `linkError` (`useSudoku.ts:50`, `useFutoshiki.ts:47`). Still fails closed |
| version-byte | node probe: round-trip, unknown-version reject, byteless legacy decode | no version byte — a same-shape breaking revision would decode silently | **8/8 probe pass** + **34/34 real-codec vitest**. `CODEC_VERSION=1` prepended pre-base64url (both games); `readCodecVersion` (`useUrlState.ts:99-105`): lead `≥0x30` or NaN → v0 (graceful ratchet, legacy links decode), lead `===1` → v1 body, any other control byte → **null (fail-closed → corrupt-link)** |
| permissions-policy | present in `public/_headers`; edge check pending owner deploy | absent everywhere | **present** — `_headers:86` lock-everything-off stanza (`accelerometer=()…xr-spatial-tracking=()`; `clipboard` deliberately NOT denied — the Share write needs it). **Edge assertion: pending-Pages** (bites on the owner's next `npm run deploy`; recorded honestly per the wave's residual-risk clause, as T3-W2 handled the doubled-Cache-Control) |
| headers-narration | `grep -c 'Pass-1 M5b\|M5b' web/frontend/public/_headers` | **1** (`:5`) | **0** — struck; `_headers:4` now reads "The CF Pages-side security-header set for the static SPA deploy". The `.wasm` stanza justification (`:98-107`) is de-PWA'd — streaming-MIME only, no SW-cached-Response offline rationale |

## Honest-loss row

Abrogation surrenders **offline reload** and **A2HS / installability** — no service worker, no manifest, no install icons (192 KB of `pwa-*.png` gone). The **immutable HTTP cache STAYS** and is NOT double-counted in the rationale: `_headers:95-96` `/assets/* → Cache-Control: public, max-age=31536000, immutable` is the transport layer, disjoint from the SW (W5's jurisdiction). Repeat-visit value on content-hashed assets is retained in full; only the offline-when-disconnected and home-screen-install affordances are surrendered.

## DELTA / π crops (lane P2)

- `share-fail-notice.png` — **32,730 B** — the control in the clipboard-reject branch: "couldn't copy — link is in the address bar" (before = "copied!" over an empty clipboard). Text/AT-name flip, verified by the repro probe, no pixel gate.
- `corrupt-link-notice.png` — **19,345 B** — the margin-voice "this shared link couldn't be read" on a malformed `?board=` (before = silent fresh deal).
- `og-card.png` — **129,217 B (126.2 KB)** — the committed game-agnostic social card (`public/og-card.png`), single small crop under B1, regenerated only on a deliberate brand change.

## Verification log

- `npm run build` (fresh, `rm -rf dist` first) → exit 0; `dist/` scrub `grep -rnil 'serviceworker\|registersw\|workbox\|webmanifest\|virtual:pwa' dist` → 0; no `*.webmanifest`, no `pwa-*.png`, no `sw.js`; `favicon.svg` (1,961 B) + `og-card.png` present.
- version-byte node probe (`scratchpad/version-byte-probe.mjs`) → **8 pass / 0 fail** (round-trip carries the v1 byte + givens survive; 0x02/0x07 unknown bytes reject; byteless v0 body + empty payload → version 0).
- `npx vitest run` on both `useUrlState.test.ts` (W2's real-codec suite) → **2 files / 34 tests passed** (authoritative: exercises the real `decodeBoardParam`/`readCodecVersion`).
- targeted e2e on a private `vite preview` (`:4173`, ephemeral config, `reuseExistingServer:false`, torn down): `share-truth.spec.ts` + `permalink.spec.ts` → **11 passed** (share-truth 5/5: success readText-truth, sudoku+futoshiki reject signal, both corrupt-link margin notes; permalink 6/6). Note: both specs encode `?board=` **byteless (v0)**, so their green also exercises the legacy-ratchet decode end-to-end.

## Seam — W1/W2 concurrent files intersecting these greps (attribution honest)

The pwa-gone probe reads three files that W1/W2 also wrote this tree; the PWA removals are P1's, cleanly separable:

- **`web/frontend/package.json`** — three lanes interleaved. **P1 (this wave)**: removed `"test:pwa"` + `"vite-plugin-pwa": "^1.3.0"`. **W2**: added `test:unit`/`test:unit:watch`/`test:e2e:throttle`/`test:golden{,:update,:bytes}` scripts + `@vue/test-utils`, `jsdom`, `vitest` devDeps. **W1**: bumped `@mkbabb/pencil-boil` `^0.8.1`→`^0.9.0`. None collide with pwa-gone.
- **`web/frontend/vite.config.ts`** — 50 ins / 77 del vs HEAD. **P1**: excised the `VitePWA` import + config block (grep now 0). **W1**: the remaining raster/preload + manualChunks rework. The two are co-mingled in one working-tree diff; pwa-gone reads clean regardless.
- **`web/frontend/package-lock.json`** — shared (P1 dropped the workbox transitive tree → **0** `vite-plugin-pwa`/`workbox` refs; W1/W2 added pencil-boil-0.9.0 / vitest / jsdom). pwa-gone holds.
- **`web/frontend/e2e/permalink.spec.ts`** — **W2** re-founded (selector discipline); it passed on the preview. `pwa-offline-smoke.mjs` **deleted (P1)**. `share-truth.spec.ts` is **P2**'s new spec (untracked).
