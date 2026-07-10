# T2-W5 — FE perf + hardening + pencil-boil

**Transport, runtime, mobile, and the Q8-final hardening slate—every prototype input CLEARED (P3, P5) and the slate made internally consistent by the design authority.** The hardening order below is execution-ready; the one owner line it rides on is registered in the README §4 (default: the amended slate executes).

**Dependencies**: ← W1 (Vite/TS landed). W3 is sequencing hygiene only—no file overlap. **Effort**: L.

---

## Scope

### Transport (Q4-amended, exact)

- **`web/frontend/public/_headers` — an ADD, not an edit** (the file carries no `Cache-Control` today; the live `wasm max-age=0` is a Cloudflare-Pages default filling the vacuum). Scoped to `/assets/*` ONLY—never `/index.html`, never `/sw.js` (both must keep revalidating for the SW-update + shell paths):

  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable

  /assets/*.wasm
    Content-Type: application/wasm
    Cache-Control: public, max-age=31536000, immutable
  ```

  The `.wasm` stanza is **MANDATORY** (promoted from L27's "optionally pin")—it keeps `instantiateStreaming` on the happy path AND guarantees the SW-cached Response carries the right MIME offline (Q4).
- Avatar `?s=64` (104 KB → 6 KB); CSP-vs-beacon resolution.
- **Font self-host + subset (P5 — CONFIRMED)**: three subset woff2 faces at **3,624 B (Fira Code) / 9,764 B (Fraunces, 2-axis instanced) / 3,840 B (Patrick Hand) = 17,228 B total**, rebuilt independently 2/3 byte-exact + 1 within 0.8% (timestamp noise). CSP tightens to `font-src 'self'`—zero violations under live instrumentation; the `--font-text` fallback-chain fix rides the diff. **Cite the self-hosted table as the load-bearing number**; the CDN-baseline comparison (487,300 B naive / 86.5–91.8% reduction) was accurate at both capture dates but Google's CDN is a moving target—shelf-life note, not a repo artifact (verify-P5-P7).
- Feeds W6: fonts must be self-hosted BEFORE the PWA precache (and the SW respects the header add above—they compose, Q4).

### Dep excision

`@mkbabb/keyframes.js` out of package.json (R8—zero imports at both HEADs; flushes the transitive glass-ui + reka-ui 2.8.2 installs). Vendor glass-ui **pure math only**, zero components/composables (D13).

### Runtime — grain-hoist per P3 (CONFIRMED, re-verified end-to-end)

Land **both halves of [`../evidence/pass2/p3.diff`](../evidence/pass2/p3.diff)**: the `HandDrawnGrid` transition `<g>` AND the `HandwrittenGlyph` reveal draw-in (the @4× cut lives in the glyph half). Measured (3 interleaved before/after pairs, verify-28 harness verbatim): size-switch raster **−62% desktop / −56% @4×** (P3 claimed −60/−50; effect slightly larger on re-verification), soul intact—cross-build SSIM max 1.0, the sub-1.0 spread byte-identical in character to the before/before self-band. Residual after-side raster is legitimate one-shot paint, NOT the idle band. The **~100–150 ms-class @4× worst frame is the CPU half** (`generateGridBoilFrames` + 256 `wobbleRect` ghost regen + mounts), untouched by design → new deferred-ledger row (memoized/idle-chunked transition path regen, appendix C). Escape hatch `pencilConfig.ts:170-189` stays booked, unused. Everything steady-state stays—idle is clean at HEAD (4.0–5.3% busy, 0 dropped frames, verify-28).

### Mobile (R3)

`md:` → `lg:` (iPad-portrait clipping, ~11 px worse at HEAD); 44 px tap-target floors incl. the 36.2 px logo-menu items; resolve the 42×32 px logo-button↔toggle contention at 375.

### Hardening — the Q8-final slate, in order (execution-ready)

1. **H1** — grid tint (`index.css:251` → `color-mix(in srgb, var(--color-teacher-red) 30%, var(--grid-line-color)) !important`) + tier-3 ring bump (9 / opacity 1 / fill teacher-red 0.10) + the **full-declaration tier-2×3 override**—all five paint properties re-asserted in teacher-red at one notch over tier-3 (`stroke-width: 10; fill-opacity: 0.16; stroke-opacity: 1`), `ghost-draw-on` deliberately NOT suppressed (it re-sketches in red as the focus cue—the ghost is the cell's only focus affordance; the PRM block still governs). A partial override leaks blue through the higher-specificity focus rule—(0,3,1) beats (0,3,0) on every undeclared property; the amendment's own fill channel would resurface the very collision H1 kills. Fix the wrong comment `SudokuCell.vue:251-252` (source order never resolves unequal specificity). **×2 games**—`FutoshikiCell.vue:226/:246` carries the identical tier collision.
2. **H3** — kill the `vbWidth=220` special-case (real gap 41.9 vs 14.4 px, not ~130) + caret optical-center.
3. **H4** — ladder-bind wordmark + menu (`HandwrittenLogo.vue:223,225,268-269,319`)—token hygiene; heights already golden off-token. Closes deferred item L25-49 (the `--type-*` scale IS vendored; 3 literals remain).
4. **H5(b′)** — error-note `scrollIntoView({block:'nearest', behavior:'smooth'})` on show (`await nextTick()` first), `behavior:'auto'` under PRM. **Toast clause STRUCK** (design authority): the card is a persistent `role=alert` with an interactive `try again` inside (`SolverErrorNote.vue:26,30`)—transient or re-anchored variants break the alert contract (WCAG 2.2.1 / the alertdialog anti-pattern). Markup, mount, persistence untouched. ×2 games.
5. **H9** — mobile marginalia clearance, **in-flow-on-mobile variant** (the fixed ~2 rem margin under-provisions whenever the error note shows—a ~100 px card would overlay live controls at `z-index: 50`; in-flow pushes the panel down and carries H5's mobile case for free).
6. **H2-elevation-only** — popover bg + `cartoon-shadow-md` + dark hairline; the placement half stays dead (it fights H5's fold budget). Menu is ~99 px, not ~180 (corrected).
7. **H8-centering-only** — `align-items: center` at ≥md (within-spec selection among H8's own alternatives).
8. **H6-shrunk** — star enlarged in place, 2.5 → ~3.25 rem; no reposition, no burst (the burst breaks the graded-paper idiom).
9. **I2** — suppress the 1.2 s wordmark-reveal replay on every game swap (`HandwrittenLogo.vue:92-99`—the `watch` on `props.game` calls `playReveal()`; re-measure, don't re-reveal).

H7 + H10 → deferred ledger (appendix C).

### pencil-boil 0.7.0 (sibling repo, owner constraint 7)

`useBoilCache<T>`, `boilLine/RectFrames` prebake, `createStrokeDrawIn`, app-local easings excise, README/CONTRIBUTING/CHANGELOG fixes—every number byte-exact (verify-18 chain, D15).

## Gates

| Gate | Value |
|---|---|
| Idle | re-trace ≤ ~5% busy / 0 dropped frames (verify-28 harness is the template) |
| Size-switch | raster −60%-class desktop / −50%-class @4× vs a **same-box HEAD baseline** measured in the same session (regimes/ratios, never absolute-ms SLAs) |
| Transfer | re-measured post self-host; woff2 total ≈17,228 B; CSP `font-src 'self'` zero violations |
| Soul | SSIM gate on the H1/H4 restyles + the grain-hoist (settled-board pairs; the boil-cycle self-band is the noise floor) |
| Focus | a keyboard-focused conflicting cell computes `stroke-width: 10` + red fill—flip `shoot-verify33c.mjs`'s expectation (Q8) |
| e2e | green |

## Seeds

- [`../evidence/pass2/p3.md`](../evidence/pass2/p3.md) + `p3.diff` + `p3-shots/` · [`../evidence/pass3/verify-P3-P4.md`](../evidence/pass3/verify-P3-P4.md) — the hoist + its re-verification (fresh traces `pass3/v-*.json`, session-scoped).
- [`../evidence/pass2/P5.md`](../evidence/pass2/P5.md) + `P5.diff` · [`../evidence/pass3/verify-P5-P7.md`](../evidence/pass3/verify-P5-P7.md) — fonts.
- [`../evidence/pass3/Q8-hardening-slate-coherence.md`](../evidence/pass3/Q8-hardening-slate-coherence.md) — the slate authority (incl. the exact H1 CSS).
- [`../evidence/pass3/Q4-w5-w6-pwa-cache.md`](../evidence/pass3/Q4-w5-w6-pwa-cache.md) — the `_headers` stanzas.
- [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D12/D13/D14/D15/D22/D27.

## Residual risks

- Q8's 10/0.16/1 emphasis values are authored judgment inside H1's value idiom, never rendered—the SSIM/soul gate adjudicates them like every other H1 value.
- The futoshiki tier rules were verified by structure + key lines, not declaration-by-declaration (Q8's FAIL-EXPLICIT); the D16 twins convention covers the remainder—diff both copies at review.
- If the owner reverts any of the four amended-slate clauses (README §4), only items 6/8/9 move; 1–5 + 7 are inside the ratified ten.
