# A9 — WAVE RE-AUDIT W5 (FE perf + hardening) at HEAD (3b75eca2)

W5 = commit `49506bf8` "T2-W5: FE perf + hardening — fonts self-host, grain hoist, Q8 slate, mobile, pencil-boil 0.7". Re-audited at HEAD (`3b75eca2`). Verdict: **4 HOLD, 1 HOLD-with-minor-drift**. No W5 substance regressed post-landing; W6 folded the Patrick Hand rebuild into the font total exactly as the re-audit note predicted.

---

## 1. Fonts — 17,708 B incl. W6 Patrick Hand rebuild — **HOLD (exact)**

`web/frontend/src/assets/fonts/` (measured `stat -f %z`, sum via awk):

| file | bytes | mtime |
|---|---|---|
| firacode-subset.woff2 | 3,624 | Jul 10 01:52 |
| fraunces-subset.woff2 | 9,772 | Jul 10 01:52 |
| patrickhand-subset.woff2 | 4,312 | Jul 10 08:06 |
| **Σ** | **17,708** | |

- Total is byte-exact to the re-audit target: **17,708**.
- Reconciles the two-commit story: W5 landed self-host at **17,236 B** (commit body: "fonts self-hosted + subset at 17,236 B (2/3 byte-exact vs P5)"). W6 (`b36b7b9f`) rebuilt only Patrick Hand: body reads "the P5 Patrick Hand subset lacked b/x-glyph and its unicode-range wrongly excluded i/r — rebuilt from upstream (3,840->4,312 B), range trued." Delta +472 → 17,236 + 472 = **17,708**. Confirmed.
- `git log -- .../fonts/` shows exactly two touching commits: `b36b7b9f` (W6) and `49506bf8` (W5). No drift since.
- Only patrickhand carries the later mtime (08:06 vs 01:52), consistent with a W6-only rebuild.

## 2. `_headers` stanzas live on the DEPLOYED site — **HOLD (security block) + minor DRIFT (wasm Cache-Control merge)**

`curl -sS -D - https://sudoku.babb.dev/` (2026-07-10 19:28 GMT, HTTP/2 200, `server: cloudflare`) returns the full security block byte-for-byte identical to `web/frontend/public/_headers`:

- `content-security-policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` — **matches** `public/_headers` `/*` stanza exactly, incl. the W5 tightening to `font-src 'self'` (Google-Fonts CDN severed).
- `strict-transport-security: max-age=63072000; includeSubDomains; preload` — match.
- `x-frame-options: DENY` — match.
- `x-content-type-options: nosniff` — match.
- `referrer-policy: strict-origin-when-cross-origin` — match.
- index.html itself: `cache-control: public, max-age=0, must-revalidate` — correct; the `_headers` comment deliberately scopes immutable to `/assets/*` only so the shell revalidates.

Deployed `/assets/*` transport (W5 ADD) is live:
- `/assets/index-DHwIHXRb.js` → `cache-control: public, max-age=31536000, immutable`; `content-type: application/javascript`. HOLD.
- `/assets/csp_solver_wasm_bg-DUScTLrL.wasm` → `content-type: application/wasm` (the mandatory Q4 stanza) HOLD.

**DRIFT (minor, cosmetic):** the deployed wasm response carries a **doubled** Cache-Control value:
`cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable`.
CF Pages does not override the `/assets/*` Cache-Control with the more-specific `/assets/*.wasm` block — it **appends both**, concatenating the directive twice. The `public/_headers` comment above the `.wasm` stanza asserts "The more-specific /assets/*.wasm merges over /assets/* above." That merge-semantics claim is **inaccurate to observed CF Pages behavior**. Functionally harmless (identical directives; RFC 7234 parses the first `max-age`) but the doc claim is false and should be corrected in tranche-III (either drop the redundant Cache-Control from the `.wasm` block, or fix the comment to state CF Pages concatenates matching rules). Content-Type pinning is unaffected and correct.

## 3. Grain hoist — **HOLD (both halves intact)**

W5 body: "both halves of the p3 grain hoist landed verbatim (transition <g> + glyph reveal)." Both present at HEAD:

- **Grid half** — `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`: the decoupling comment block at :54–66 ("grain-static decoupled from ticking geometry… only toggles which sibling is opacity:1 — a compositor-stage change that does not invalidate any group's own SourceGraphic, so grain-static's raster is [reused]"); the transition extension layer (:134, NEVER carries grain-static, animation-only) and the steady-state boil layer with `filter="url(#grain-static)"` applied once (:190) under opacity-swap (`opacity:0`→`opacity:1`, `will-change: opacity`, :240–249).
- **Glyph half** — `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue`: `grainOn` ref (:37), suppressed during the reveal tween (:167 `grainOn.value = false`), restored `onComplete` (:171), bound `:filter="grainOn ? 'url(#grain-static)' : undefined"` (:276), with the L28 F1 rationale at :33–37 and :162–166 ("one filtered raster per glyph total").

## 4. H-slate (Q8) rows — **HOLD**

`web/frontend/src/assets/index.css`:
- H1 full-declaration tier override + 30% grid tint over line color (:314–327), driven by `--color-teacher-red` (token at :150), incl. `stroke: color-mix(... teacher-red 30% ...) !important` (:327) and the tiered conflict box-shadow (:321–323).
- conflict shake keyframes (:332–334).
The Q8 slate items enumerated in the W5 body (H1/H3/H4/H5b'/H9/H2/H8/H6/I2) are referenced across `games/{sudoku,futoshiki}` and index.css; the slate is in order, no regression observed.

## 5. Raster class — **NOT RE-MEASURED (box active) — cite regate**

Re-audit instruction: re-measure raster class ONLY if the box is quiet. The box is **not quiet** — the dev server runs at :3000 and the frontend working tree carries extensive `M` churn (see `git status`). Per instruction, citing the record rather than re-measuring:
- Regate `3b75eca2` (T2-WGATE, ledger closed 98.2%) certified the FE surface.
- Pass-1 `R5-fe-structure-audit.md:121` confirms the grain-static filter subsystem intact: "`SvgFilters.vue` … defines the filter IDs (`grain-static`, `wobble-*`)". The grain-static def is live at `SvgFilters.vue:75–89` (static `fractalNoise` displacement, params never re-bound). Steady-state opacity-swap (item 3) is the mechanism that keeps the raster count at one-per-layer; structurally intact.

---

## Holds / Drifts summary

- **HOLD** — fonts 17,708 B, byte-exact, W6 delta reconciled.
- **HOLD** — deployed security-header block (CSP/HSTS/XFO/nosniff/Referrer) byte-identical to `public/_headers`; `/assets/*` immutable + wasm `application/wasm` live.
- **DRIFT (minor)** — deployed `/assets/*.wasm` Cache-Control is doubled; the `_headers` comment's "merges over" claim is false to CF Pages' concatenating behavior. Cosmetic; fix the comment or drop the redundant directive.
- **HOLD** — grain hoist, both halves (grid transition <g> + steady-state opacity-swap; glyph reveal suppression).
- **HOLD** — Q8 H-slate rows in index.css (teacher-red tier + shake).
- **DEFERRED** — raster-class re-measure (box active); cited regate 3b75eca2 + pass-1 R5:121.
