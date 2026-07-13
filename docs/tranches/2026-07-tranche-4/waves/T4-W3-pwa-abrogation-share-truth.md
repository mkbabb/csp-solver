# T4-W3 — PWA abrogation + share truth

**The clean break: the PWA comes out whole, and the share path stops lying.** Owner edict — *"Why do we have any notion of PWA — this is to be abrogated."* The offline/install machinery is a single-commit provenance (`b36b7b9f`, T2-W6) with no CI lane, no hand-written registration, and a precache the census over-states; it exits clean. In its place the share surface gets the truth it lacks: a social unfurl on a share-centric app that ships none, a "copied!" confirmation that keys off the clipboard promise instead of asserting a success it never checked, a codec version byte so a future breaking revision can't silently decode old links, and the header hardening the static app can afford for free.

**Dependencies**: ← W0 (base SHA + record). **Effort**: S.

---

## Scope

### PWA abrogation — the full excision inventory (FAM-6, owner edict)

Provenance is one commit (`b36b7b9f` "T2-W6 … PWA-minimal"); registration is 100% build-injected (`grep -rn 'serviceWorker\|registerSW\|virtual:pwa' src/` = 0). Remove every source surface; the generated `dist/` artifacts vanish on the next build.

| Artifact | Anchor | Removal touches |
|---|---|---|
| plugin import | `web/frontend/vite.config.ts:7` | `import { VitePWA } from 'vite-plugin-pwa'` |
| plugin config | `web/frontend/vite.config.ts:188-240` | the `VitePWA({...})` entry — kills generateSW + all dist emission |
| devDependency | `web/frontend/package.json:41` | `"vite-plugin-pwa": "^1.3.0"` + its workbox transitive tree |
| npm script | `web/frontend/package.json:16` | `"test:pwa"` — the only invoker of the offline gate |
| offline gate | `web/frontend/e2e/pwa-offline-smoke.mjs` (148 lines) | whole file — invisible to both default lanes (`.mjs` not `.spec`, ESLint ignores `e2e/**`) |
| install icons | `public/pwa-192x192.png` (23,902 B) + `pwa-512x512.png` (97,974 B) + `pwa-maskable-512x512.png` (69,921 B) = **192 KB** | manifest icon srcs |

- **KEEP `public/favicon.svg`** — it is the site `<link rel=icon>` (`index.html:7`), not PWA-only.
- **KEEP the `_headers` immutable cache** — the `/assets/*` `max-age=31536000, immutable` transport layer is INDEPENDENT of the SW (W5's jurisdiction, "two layers, disjoint"); it keeps full repeat-visit value with the SW gone. Only the offline-MIME-for-cached-Response half of the `.wasm` stanza's justification is PWA-coupled.
- **Docs/comments that go stale on removal** (purge here or hand to W14 per the anchor): `README.md:59` ("PWA offline"), `README.md:107` ("The PWA installs and plays offline after first load"), `web/frontend/README.md:25` (`test:pwa`), `vite.config.ts:188-215` (the SW-strategy comment block), `public/_headers:93-100` (SW-cached-wasm-MIME offline justification).
- **No CI row to remove** (`grep -rn 'pwa\|workbox\|sw.js' .github/` = 0) — itself the P2-1 defect: the sole automated verifier of "plays offline" was orphaned. Mooted by abrogation.
- **Honest loss row** (record it): offline reload and A2HS/installability go. The immutable HTTP cache does NOT — do not double-count it in the rationale.

### OG / social meta IN — game-agnostic unfurl (FAM-14)

A share-centric app (`?board=` permalinks are the point) ships **zero OG/social meta** — `grep -c 'og:\|twitter:' index.html` = 0. Add a game-agnostic unfurl to `index.html`: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` + `twitter:card` (summary_large_image). Copy names neither game specifically (the same head serves sudoku and futoshiki; the active game lives in the URL, `App.vue:40-44`). The `og:image` is a static committed asset (a small board crop under the B1 size policy), not a per-board render.

### Share-fail signal — the confirmation keys off the clipboard promise (FAM-13)

Three share-truth defects converge on the confirmation path:

- **The optimistic "copied!" (r5, P3).** The copy is split across components and the confirmation is unconditional. Parent copies and swallows failure: `SudokuGame.vue:64` `navigator.clipboard?.writeText(url).catch(() => {})` (twin `FutoshikiGame.vue:63`). Child flips the label with no await, no gating: `sudoku/ControlPanel/ControlPanel.vue:120-128` sets `shareConfirm.value = true` right after `emit("share")` (twin `futoshiki/ControlPanel/ControlPanel.vue:109-110`). The label renders as visible text AND announces to AT (`ControlPanel.vue:319/449` `:aria-label="shareConfirm ? 'Link copied' : …"`; `:323/453` washi flips to "copied!"). The `?.` short-circuit (no `navigator.clipboard`) and the `.catch(() => {})` (rejected write: insecure context, `permissions-policy: clipboard-write` denial, unfocused document) both leave the UI asserting a success it never verified — the write-side mirror of the decode-side silent-degrade.
- **Fix (clean break, no masking fallback):** `shareBoard()` returns the clipboard promise (already does `replaceState` first, so the address-bar `?board=` is never lost); the child sets `shareConfirm` only on resolve, and surfaces a distinct **"couldn't copy — link is in the address bar"** signal on reject/absent. The AT name tracks the real outcome.
- **Corrupt-link degrade — make it a signal (FAM-13).** The codecs fail closed (18/18, `r2-security.md` (b)) but degrade **silently** to size/difficulty-only. A `?board=` that fails to decode should surface a one-line "this shared link couldn't be read" notice, not vanish into a fresh deal with no word.

### Codec version byte (FAM-13, r4)

Both `?board=` codecs are self-describing (carry size; distinguished by part-count 2 vs 3) and fail closed, but **carry no version tag** — `useUrlState.ts:80-88` (sudoku `${size}.${cells}`), `:83-93` (futoshiki `${boardSize}.${cells}.${ineqs}`). A future breaking codec revision that kept the same structural shape would decode an old link to a *different* board with no error. Prepend a single version byte to the encoded blob; the decoder rejects (fail-closed → the corrupt-link signal above) on an unknown version. Ships now, cheap, closes the latent silent-mis-decode.

### Header hardening (r2-security SEC-1/SEC-3)

- **Permissions-Policy** (SEC-1): `grep -rni 'permissions-policy' public dist index.html` → nothing. The app uses zero powerful features. Add a lock-everything-off `Permissions-Policy` to the `_headers` `/*` stanza (`geolocation=(), camera=(), microphone=(), payment=(), usb=(), …`) — purely additive, breaks nothing (COOP/COEP correctly absent, no SharedArrayBuffer).
- **`_headers` narration purged** (SEC-3, folds FAM-8): `public/_headers:5` "Confirmed absent per Pass-1 M5b" — tranche/pass narration baked into a live config; the headers are no longer absent, they're live. Strike it (the doubled-Cache-Control was already fixed at T3-W2). HSTS `preload` token (SEC-2): confirm the domain is submitted to hstspreload.org or drop the inert token — owner-side note.

## Gates

| Gate | Value |
|---|---|
| Headline | after abrogation + rebuild: `grep -rn 'vite-plugin-pwa\|VitePWA\|workbox\|registerSW\|test:pwa' web/frontend src dist` = **0** (today: import at `vite.config.ts:7`, config `:188-240`, dep `package.json:41`, script `:16`, `dist/sw.js`+`dist/workbox-*.js` emitted); share confirmation keyed off the clipboard promise; OG unfurl present; codec version byte round-trips; full e2e green minus the retired PWA smoke |

Component checks (born RED at HEAD unless marked):

| Gate | Value (current failing probe → target) |
|---|---|
| pwa-gone | `vite-plugin-pwa` in `package.json` **today** → removed; `dist/sw.js` (2,189 B) + `dist/workbox-*.js` (15,026 B) + `dist/manifest.webmanifest` emitted **today** → absent after rebuild; `favicon.svg` KEPT (`index.html:7` intact) |
| offline-claims | `grep -rn 'offline\|installs and plays' README.md web/frontend/README.md` = **3 live claims today** (`README.md:59,107`, `web/frontend/README.md:25`) → 0 (or handed to W14 with the anchor) |
| og-meta | `grep -c 'og:\|twitter:card' index.html` = **0 today** → full unfurl set present; `og:image` is a committed static crop under B1 policy |
| share-confirm | repro: deny `clipboard-write` (or serve `dist/` over plain `http://` on a LAN IP), click Share → **today** the label flips to "copied!" and AT announces "Link copied" while the clipboard stays empty (`SudokuGame.vue:64` `.catch(()=>{})` + unconditional `ControlPanel.vue:120-128`) → the confirmation fires only on `writeText` resolve; reject surfaces "couldn't copy — link is in the address bar" |
| corrupt-link | a malformed `?board=` **today** degrades silently to a fresh deal → surfaces "this shared link couldn't be read"; codecs still fail closed (18/18, `probe-codec-harden.mjs`) |
| version-byte | encode→decode round-trips with the version byte; a blob carrying an **unknown** version byte rejects (fail-closed) — **today no version byte exists**, so a same-shape breaking revision would decode silently |
| permissions-policy | `curl -sS -D - -o /dev/null https://sudoku.babb.dev/ \| grep -i permissions-policy` = **empty today** → lock-everything-off stanza present in `_headers` (bites at the edge on the owner's next `npm run deploy`, or noted pending-Pages) |
| headers-narration | `grep -c 'Pass-1 M5b\|M5b' public/_headers` = **1 today** → 0 |

## π / DELTA

- **OG unfurl** — π: golden capture of the rendered social card (the `og:image` crop + title/description as a preview host renders it) banked in evidence; comparison is exact-match on the committed image + a meta-tag presence assert. DELTA: before = no card (bare-URL unfurl); after = the game-agnostic card. Small crop, not a full-viewport PNG (B1 discipline).
- **Share confirmation label** — DELTA: before/after pair of the control in the clipboard-fail branch (before: "copied!" over an empty clipboard; after: "couldn't copy — link is in the address bar"). No golden needed beyond the DELTA — the change is a text/AT-name flip, verified by the repro probe, not a pixel gate.
- PWA removal, codec byte, and headers are non-visual — parity is the invariant (the app renders identically; only the SW, head meta, and encoded-blob prefix change).

## Seeds

- `r1-pwa.md` — the full excision inventory (anchors above), the b36b7b9f provenance, the P2-1 orphaned-gate, the P3-1 precache 633 KiB (not "445KB"), the favicon double-store.
- `r5-quiet-pass-3.md` §1 — the optimistic "copied!" mechanism, the two `catch(()=>{})` sites + unconditional `shareConfirm`, the repro recipe.
- `r4-quiet-pass-2.md` §3 — the codec self-describing/fail-closed truth + the version-byte gap (same-shape breaking revision decodes silently).
- `r2-security.md` (a)/(b) — the live header set (CSP/HSTS/XFO/nosniff live), SEC-1 Permissions-Policy gap, SEC-3 `_headers` narration, SEC-4 futoshiki parseInt (→ W4), the 18/18 codec-harden probe.
- `families.md` FAM-6/13/14 — the abrogation edict, share-truth members, the zero-OG-meta row.

## Residual risks

- **The `_headers` Permissions-Policy bites only at the CF Pages edge** — the gate accepts "pending-Pages" as recorded (the fix lands in-tree; the owner's next `npm run deploy` picks it up), exactly as T3-W2 handled the doubled-Cache-Control.
- **The corrupt-link + clipboard-fail signals must not become a modal** — the owner killed the "solved it!" modal by name; these are inline margin-voice notices (the app's established idiom), not dialogs. The design register is W9's margin-voice, referenced not re-litigated here.
- **The version byte is a one-way ratchet** — once shipped, every future codec change must bump it; old links without the byte must still decode (the byte's absence IS version 0). Bake that into the decoder's branch so the abrogation of the byte-less format is graceful, not a break of every link shared before this wave.
- **OG `og:image` under B1** — the card image is a committed asset that counts against the repo-size policy ballot; keep it a single small crop, regenerated only on a deliberate brand change, never per-board.

---
## Execution record (2026-07-13)

Workflow `wf_79729a38-44f` (resumed once across a session-limit wall; the completion-audit found the killed design lane's work complete — verified, not redone). All 8 component gates close.

| Gate | Born-RED | Close |
|---|---|---|
| pwa-gone | plugin+config+dep+script+smoke+icons live; sw.js/workbox emitted | the whole inventory OUT (vite-plugin-pwa + 303 workbox transitives uninstalled); fresh build emits NO sw.js/workbox/webmanifest/pwa-png; favicon.svg + immutable-cache KEPT. **Honest loss row: offline reload + A2HS go; the HTTP immutable cache stays (not double-counted)** |
| offline-claims | 3 live claims | 0 — purged in-tree (not deferred to W14) |
| og-meta | zero unfurl | game-agnostic OG+twitter set; `og-card.png` 1010×1010, 126.2 KB (≤150 KB B1) |
| share-confirm | "copied!" + AT "Link copied" over an empty clipboard (`catch(()=>{})` + unconditional flip) | confirmation keyed off the clipboard promise; reject → washi **"couldn't copy — link is in the address bar"** (SheetWashiLabel `wide`, both games); aria tracks the real outcome; e2e proves success writes the real URL |
| corrupt-link | silent degrade to a fresh deal | discriminated `boardLink: absent\|ok\|invalid` through `resolveInitialState`; invalid → one-line MarginNote "this shared link couldn't be read — {fresh}" (margin voice, never a modal); 18/18 fail-closed behaviors intact |
| version-byte | none (same-shape revision would mis-decode silently) | v1 = 0x01 prepended; **absence = v0, every pre-wave link still decodes** (the graceful ratchet); unknown byte rejects → the corrupt-link signal; 15/15 probe + 34/34 units |
| permissions-policy | absent | lock-everything-off stanza (clipboard deliberately NOT denied — the share affordance needs it); bites at the edge on the next `npm run deploy` (pending-Pages, recorded) |
| headers-narration | 2 "Pass-1 M5b" lines | 0; HSTS `preload` token kept inert, owner-side hstspreload.org check recorded |

Evidence: `../evidence/w3/` (gates.md + the two failure-branch DELTA crops). Targeted e2e 11/11 (share-truth 5/5, permalink 6/6 — the byteless-v0 spec encoders now double as the live legacy-ratchet proof). Shared-file rider: `vite.config.ts` lands here carrying W1's headHints preload fix.
