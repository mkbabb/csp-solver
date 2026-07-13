# T4-WM — the mobile recut · consolidated gate table (VERIFY lane)

Adversarially re-run at merged HEAD (`8c6af343` + the pooled lane working tree), darwin, `2026-07-13`.
Born-RED values are the banked research probes (r1/r2/r3) and the lane evidence files; **close** columns
were re-run VERBATIM by the VERIFY lane, trusting no lane's claim. Battery + e2e ran against a fresh dev
server on `127.0.0.1:5199` (owner's `:3001` untouched).

| Gate | born-RED (at HEAD / research) | close (re-run by VERIFY) | evidence-pointer |
|---|---|---|---|
| **pad-gone** | `DigitPad\|padActive\|suppressVirtualKeyboard\|inputmode="none"` = 37 matches; residual wiring symbols live | grep = **0** (src+e2e); residual `enterValue/cellFocusChange/cellsEl/isStacked/useStackedLayout` = **0**; `useCoarsePointer` still consumed (drawer, both ControlPanels, useHoverCard). ⚠ `useStackedLayout` was **deleted** (had zero consumers at merge HEAD — census row stale), not "still consumed" as the gate text reads | grep re-run; `impl-a-entry.md` |
| **native-entry** | coarse cell forced `inputmode="none"`; no attribute set | e2e GREEN (iPhone-13, sudoku 9×9 + 16×16 + futoshiki): `inputmode=numeric`, `pattern=[0-9]*`, `autocorrect/autocapitalize=off`, `enterkeyhint=done`, `maxlength` present; computed font ≥16 px asserted; two-digit `toHaveValue("12")` at 16×16 | `mobile-affordances.spec.ts` 45–47,52; 6 GREEN |
| **keyboard-avoid** | zero `visualViewport` references | e2e GREEN: emulated visualViewport shrinks the band + fires resize; the focused below-fold cell scrolls clear | `mobile-platform.spec.ts:169`; `useKeyboardViewport.test.ts` (9 unit) |
| **ios-discipline** | webkit computes `user-select:text` on cells; toggle at −4 px; 0 env padding | e2e GREEN ×4: overscroll-behavior contain; `.board-cells` user-select none + touch-action manipulation + authored callout; preflight tap-highlight/text-size-adjust; `viewport-fit=cover` + `env()` toggle padding | `mobile-platform.spec.ts:52,63,105,125`; `impl-c-ios.md` |
| **touch-affordances** | `H`/Cmd+Z only; attribution nets closed on tap; sticky `:hover` | e2e GREEN: undo/redo/hint present + wired both games, **bbox ≥44 px asserted** (w/h), sublabels; attribution `aria-expanded→true` on single tap; hover gated `@media (hover:hover)` | `mobile-affordances.spec.ts:162,206`; `impl-b-affordances.md` |
| **long-press** | no pointer long-press; no vibrate | e2e GREEN both games: pointerdown+~450 ms hold opens `.pencil-marks` (0→>0), release clears (→0); `navigator.vibrate?.()` feature-detect proven in unit layer (honest no-op where absent) | `mobile-affordances.spec.ts:219,226`; `useLongPress.test.ts` (10), `honestHaptics.test.ts` (3) |
| **perf-cold** | 5.7 beats full re-raster, 6.1 fps ~849 ms @DPR3 | CODE-VERIFIED: fallback pinned to pose 0 — grid `(showBaked ? boilFrame : 0) === f`, logo `f===0`, toggle `i===0`; baked bindings still flip on the beat | `HandDrawnGrid.vue:337`, `HandwrittenLogo.vue:292`, `DarkModeToggle.vue:214,289` |
| **perf-rebake** | drop to live-filter fallback, 456 ms max gap on theme flip | CODE-VERIFIED: watch returns early on `null` bitmaps (holds live urls), monotonic `urlToken` guards superseded conversions, one atomic assignment; structural (board/subgrid) takes the frozen-pose path | `HandDrawnGrid.vue:160-194` |
| **perf-residency** | ~46.8 MB double (bitmaps + base64 decodes) @390 DPR3 | CODE-VERIFIED: DPR cap `Math.min(devicePixelRatio,2)` **grid-only**; `bm.close()` after conversion; `revokeUrls` on atomic swap + structural reset + unmount, all 3 consumers. ⚠ SSIM re-prove NOT independently reproduced — lane D reports webkit **0.9888 PASS** but chromium **0.9652 < 0.98** per-engine floor (grid-only, ratified on the WebKit/iOS number). DPR2 goldens unaffected: grid-corner-light golden PASSES | `HandDrawnGrid.vue:151`, `rasterPose.ts:64-83`; SSIM per `impl-d` (lane-reported) |
| **perf-encode** | 12 synchronous `toDataURL`, worst 251 ms @4× | GREP-VERIFIED: **0** synchronous `toDataURL` in src (only retired-path comments); async `OffscreenCanvas.convertToBlob` throughout | `rasterPose.ts:95` |
| **landscape-ipad** | no probe rows | e2e GREEN ×3: landscape phone (844×390) no h-overflow + entry; iPad portrait (<1024) no h-overflow + entry; large-iPad (≥1024) drawer tab `min(w,h)≥44 px` toggles the rail | `mobile-platform.spec.ts:268,284,298` |
| **parity** | — | unit **133/133** (15 files); e2e **60/60** (incl. all futoshiki + 20 new mobile probes); goldens **3/4** — `grid/logo/cell` PASS, **`toggle-crest-dark-darwin` RED (ratio 0.03, > 1.7% soul floor)**. ⚠ The toggle red is **PRE-EXISTING at HEAD**: reverting §4 (rasterPose+DarkModeToggle+HandDrawnGrid+HandwrittenLogo to HEAD) reproduces the identical 1214-px fail. W5 re-minted the *linux* crest-dark only; the darwin baseline is stale — NOT a WM regression | e2e/unit re-run; `test-results/…toggle-crest-dark-diff.png` |
| **deploy** | — | OUTSTANDING (owner/seal-gated): `npm run deploy` at seal; wrangler unauthenticated locally + npx-packument-OOM standing trap; real-device smoke (jetsam/LPM/ProMotion) is the E8 owner-side row | — |

## Frontend battery (all GREEN)

| Check | Result |
|---|---|
| `vue-tsc -b --force` | exit 0 (W6 worker break RESOLVED — no longer the blocker every lane ledgered) |
| `test:unit` | 133 passed (15 files) |
| `lint:eslint` | exit 0 |
| `lint:knip` | exit 0 — the excised keypad + deleted `useStackedLayout` leave ZERO dead exports |
| `prettier --check src/` | clean |
| `build` (`vue-tsc -b && vite build`) | 173 modules, 792 ms (incl. W6 wasm rebuild) |

## pencil-boil 0.9.2 (item 6, GREEN)

`npm view @mkbabb/pencil-boil version` = **0.9.2**; dist-tags latest = 0.9.2. Frontend pins `^0.9.2`,
lockfile resolves `^0.9.2`, `node_modules` installs 0.9.2 (ships source; `onEvict` present in
`src/frames.ts`). `useRasterStack` imported by HandDrawnGrid/DarkModeToggle; build + e2e consume it.

## Wave-blocking / outstanding for the team lead

1. **`toggle-crest-dark-darwin` golden RED** — pre-existing stale baseline (red at HEAD with §4 reverted;
   W5 re-minted linux only). Parity gate is literally unmet. Remediation: a **reviewed darwin re-mint**
   (`npm run test:golden:update`, darwin runner of record), mirroring the W5 linux re-mint — NOT a WM code fix.
2. **DPR2-cap SSIM below floor on chromium (0.9652 < 0.98)** — lane-D-reported, not independently reproduced
   here. Meets the floor only on WebKit (0.9888, the ratified mobile-target engine). Owner ratification of
   the chromium/Android softness (grid-only) is the open decision.
3. **`useStackedLayout` deleted** — the pad-gone gate says it "still consumed"; it had zero consumers at merge
   HEAD (useControlsDrawer refactored to a private mediaRef at W4). Deletion keeps knip green; census/gate row
   needs amending. `useCoarsePointer` (the load-bearing survivor) is intact.
4. **Deploy + real-device smoke** — owner/seal-gated (see deploy row).
5. **SSIM harness re-prove** — the r1 recipe was not re-run independently in this pass; the DPR cap's DPR2
   no-op is confirmed by the passing grid golden, but the DPR3 SSIM numbers rest on lane D's report.
