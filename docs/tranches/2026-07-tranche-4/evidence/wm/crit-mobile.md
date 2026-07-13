# crit-mobile — HARDEN lane, E8 mobile-recut RESEARCH (adversarial)

**Charge**: refute-by-default across R1 (mobile-perf), R2 (mobile-census), R3 (api-truth).
Per-claim verdicts, the gap list, and the load-bearing rows for the wave spec. Research only —
no source edits, no commits.

**Method / provenance.** Both reports anchor to the sealed HEAD `7393e7df` ("T4-W3…"). The tree
has since MOVED: `git HEAD` is now **`c1dc6f20`** — W4 (the excision) has *landed* (`54b1bcb5`)
plus a prettier normalization (`c1dc6f20`). So R2's removal inventory now describes code two
commits back; I verified every R2 anchor against `7393e7df` directly via `git show`/`git grep`
(no worktree needed — reads only). R1's pencil-boil mechanisms verified against the file-linked
`@mkbabb/pencil-boil` **0.9.0** source in `node_modules` and the app consumers at `7393e7df`.
R3 iOS rows verified against a second source each (caniuse / MDN bcd issues / WebKit bugzilla /
chromestatus / the primary project READMEs). Ports 3000/3001 untouched; bbnf-lang untouched.

**What I could NOT re-run here (marked UNVERIFIABLE-HERE below):** R1's live fps/CPU A/B and the
SSIM capture — both need a fresh `vite build` + Playwright-WebKit run, which is not the "cheapest
decisive probe." I re-ran the cheap decisive ones instead: the memory arithmetic (by hand), the
source mechanisms (retention, no-DPR-cap, LRU-no-close, null-window fallback), and the entire R2
grep census. Where I accepted an R1 fps number, the mechanism under it is source-confirmed and the
loadavg is stamped.

---

## Verdict table — R1 (mobile-perf)

| claim | verdict | basis |
|---|---|---|
| **Mem arithmetic** — grid 19.08 MB (4×1092²), DPR2 8.09 MB (728²), ratio 2.25×; logo 2.48 MB, toggle 1.18 MB (8×192²); total 22.74 MB; 430 grid 23.5 MB (4×1212²) | **CONFIRMED** | Hand-recomputed every cell: 1092²·4·4=19,079,424; 728²·4·4=8,479,744; 1092²/728²=2.25; 729·213·4·4=2,484,432; 192²·4·8=1,179,648; 1212²·4·4=23,503,104. All match to the byte. |
| **#2 redundant double-residency** — the ImageBitmap set is retained AND a `toDataURL` data-URL `<image>` decode co-resides → ≈46.8 MB; LRU never `.close()`s | **CONFIRMED (mechanism); CORRECTED (provenance)** | Retention is real: `useRasterStack.bitmaps` holds `ImageBitmap[]` (`vue.ts:499`), the consumer watches it and calls `bitmapsToUrls` → `canvas.toDataURL("image/png")` (`pencil/composables/rasterPose.ts:49-60`), storing the data-URL PNGs in `bitmapUrls` (`HandDrawnGrid.vue:148-153`). **Neither the ImageBitmap nor the LRU entry is ever closed** (`frames.ts:50-52` deletes the key, no `.close()`; no `.close()` anywhere in the app). So both residencies are live. **CORRECTION:** R1's method prose attributes the `bitmapsToUrls`/`toDataURL` round-trip to *pencil-boil `vue.ts`*; it is actually the **app** composable `pencil/composables/rasterPose.ts` — pencil-boil 0.9.0 has zero `toDataURL`/`bitmapsToUrls`/`data:image` (grep-clean). Mechanism and magnitude unaffected. |
| **No DPR cap on the bake** (`raster.ts currentDpr()`; device px scales dpr²) | **CONFIRMED** | `raster.ts:96-98` returns `window.devicePixelRatio` with no `Math.min`; `deviceW = round(cssSize.width·dpr)` (`:134`). `vue.ts:481-482` `bake()` uses `o.dpr ?? window.devicePixelRatio`. No cap. |
| **#1 cold-load fallback = the live grain-static filter runs until bitmaps resolve** | **CONFIRMED (mechanism)** / fps **UNVERIFIABLE-HERE** | `bake()` sets `bitmaps.value = null` before capture (`vue.ts:479`); consumer `showBaked` is false until `bitmapUrls.length === frameCount` (`HandDrawnGrid.vue:154`) → the live feTurbulence fallback `<g>` renders during the null window. The window's 6.1 fps / 849 ms bake was not re-run. |
| **#3 theme/size re-bake stall** (cacheKey folds isDark/boardSize → mid-gesture null window) | **CONFIRMED (mechanism)** / max-gap fps **UNVERIFIABLE-HERE** | `bake()` re-nulls `bitmaps` on every re-bake (`vue.ts:479`); the watch key folds `cacheKey` (`:527`), and the app's grid cacheKey encodes theme+size. 456 ms max-gap not re-run. |
| **#4 main-thread `toDataURL` burst** (12 synchronous PNG encodes on cold load) | **CONFIRMED (mechanism)** / long-task ms **UNVERIFIABLE-HERE** | `bitmapsToUrls` runs `canvas.toDataURL` synchronously per pose (`rasterPose.ts:59`), across grid 4 + logo 4 + toggle 8 = 12 encodes on the main thread. The 251 ms worst-task not re-run. Fix `convertToBlob`/worker is apt. |
| **ps-pcpu ("631%") is an artifact-row of the T4 lie class** | **REFUTED (the concern, not the number)** | R1 discloses the method ("`ps pcpu` summed over each engine's helper processes minus baseline") and uses 631%↔22.7% as an **A/B ratio**, not a single-core absolute — "load-robust even when absolutes are not." The fps figures (no summing) are the primary evidence. This is *not* the ps-pcpu lie; the disclosure + ratio framing clears it. |
| **loadavg discipline** — every fps/CPU number la-stamped | **CONFIRMED** | Each row carries its la (15.25, 26.4→22.6, 11.15, 7.9, 13, 7.3). Discipline followed. |
| **Idle / murmur / celebration / scroll CURED at DPR3** | **UNVERIFIABLE-HERE** (mechanism plausible) | Not re-run (needs Playwright-WebKit). The A/B design (`baked` vs CSS-injected `forcelive`) is a sound isolation and the bitmaps-null→live-filter mechanism is source-confirmed; absolutes (93.5/97.6/98.2 fps) accepted on the disclosed method, not independently reproduced. |
| **Glass / backdrop-filter is NULL at HEAD** | **CONFIRMED** | Only hit for `backdrop-filter`/`blur(` on a real surface is a **removed-blur comment** — `AttributionCard.vue:117` "the prior blur(12px) on open… removed." No live blurred surface. W10 glass tokens are a future risk, correctly flagged. |
| **cap-at-2 SSIM 0.984 (visually lossless)** | **UNVERIFIABLE-HERE** (methodology sound) | Not re-run. The isolation (both arms captured at a DPR3 screen; only the grid bake resolution differs; reduced-motion frozen pose; Wang 8×8/stride-4) is correct, and the earlier 0.889 (different puzzles + mismatched geometry) is properly discarded. **Caveat stands and is load-bearing: grid only was SSIM'd; logo (Fraunces text) and toggle were NOT — cap the grid only, or SSIM the logo before capping it.** |

## Verdict table — R2 (mobile-census)

| claim | verdict | basis |
|---|---|---|
| **§1 removal inventory (10 rows), D16 twin-symmetric** | **CONFIRMED + COMPLETE** | Every anchor traces at `7393e7df`: `DigitPad` imports/templates, `padActive` (`SudokuGame:78`/`FutoshikiGame:72`), `enterValue` (`SudokuBoard:301`/`FutoshikiBoard:279`, `defineExpose`), `suppressVirtualKeyboard` (cells `:32`/`:36`, `:inputmode :183`), `cellFocusChange` (boards). **Completeness grep across `src`+`e2e` found no missed site.** |
| **`enterValue` is called by nothing but the pad** | **CONFIRMED** | The only callers are `@digit`/`@erase` on `<DigitPad>` (`SudokuGame:176-177`, `FutoshikiGame:160-161`) + the two `defineExpose`. Nothing else. Excision loses no other caller. |
| **`padActive` is the one shared thread — mounts the pad AND sets `inputmode="none"`** | **CONFIRMED** | `padActive` gates `v-if` on the pad AND is passed as `:pad-active` → board binds `:suppress-virtual-keyboard="padActive"` (`SudokuBoard:612`/`FutoshikiBoard:549`) → cell `:inputmode="suppressVirtualKeyboard ? 'none' : 'numeric'"`. |
| **`useCoarsePointer`/`useStackedLayout` SURVIVE (co-consumed by drawer + ControlPanels)** | **CONFIRMED (stronger)** | Both are consumed by the two Games, the two ControlPanels, and `useControlsDrawer` — not pad-private. Only the `padActive` *use* goes. |
| **Native `<input>` underneath; entry is pure `@input`/`@keydown`; `inputmode` flips numeric↔none** | **CONFIRMED** | `type="text"` `opacity-0 absolute inset-0` input (`SudokuCell:182,193`); `:inputmode` ternary at `:183` both cells. |
| **16px input font defeats iOS zoom at every board size** | **CONFIRMED-consistent** / live-measure **not re-driven** | Source shows no font-size utility on the input class list → it inherits (root 16px); R2 measured 16px live at 9×9/16×16/futoshiki and R3 independently gives the ≥16px rule. Two-lane agreement; I did not re-run the live `getComputedStyle`. **The single biggest de-risk — worth a 30-second on-device re-confirm in the wave.** |
| **Hint = keyboard-only (H), no touch button** | **CONFIRMED** | `SudokuBoard` keydown `case 'h'/'H': if (ctrl||meta) fall through else emit('hint')` (`:344-346`). No hint button in either ControlPanel (grep-clean). |
| **Undo/Redo = keyboard-only (Ctrl/Cmd+Z, Shift), no button** | **CONFIRMED** | `emit('undo')`/`emit('redo')` off keydown `case 'z'` gated on ctrl/meta, shift→redo (`SudokuBoard:71-72, 334`). No undo/redo button anywhere in games (grep for button+undo/redo empty). |
| **Keyboard legend `display:none` on coarse → hint/undo/redo undiscoverable on touch** | **CONFIRMED** | `KeyboardLegend.vue` documents "hint"; hidden under `@media (hover:hover) and (pointer:fine)`. Touch users get zero discovery. |
| **safe-area/`env()`/`viewport-fit` used nowhere → chrome ignores the notch** | **CONFIRMED** | Grep of `src`+`index.html` = **zero** hits. Viewport meta is `width=device-width, initial-scale=1.0` — no `viewport-fit=cover`. |
| **`-webkit-tap-highlight-color` set only on HandwrittenLogo** | **CONFIRMED** | Single hit: `HandwrittenLogo.vue:343`. |
| **`touch-action:none` set only on `.peek-hold-surface`** | **CONFIRMED** | Two hits, both `.peek-hold-surface` (sudoku CP `:581`, futoshiki CP `:470`); CSS comment confirms it owns the press-hold. No global `manipulation`. |
| **`visualViewport` / `overscroll-behavior` / `-webkit-touch-callout` used nowhere** | **CONFIRMED** | Grep = zero each. |
| **No user notes/candidate/pencil-mode entry (peek-domains are read-only solver marks)** | **CONFIRMED** | `candidate` appears only as "Engine-domains pencil marks (W6 beat 9): surviving candidates… while the peek [is held]", `aria-hidden`. No user note toggle. |
| **Viewport meta = `width=device-width, initial-scale=1.0`; no `maximum-scale`/`user-scalable`** | **CONFIRMED** | `index.html:5` verbatim. Pinch-zoom preserved (a11y-correct). |
| **Attribution card won't open on touch tap (focusin+toggle net-closed)** | **UNVERIFIABLE-HERE** (plausible) | `useHoverCard.ts` exists; the focusin-opens-then-click-toggles-closed mechanism is plausible but needs a real-device tap (headless tap-event ordering may differ). R2 self-rates Med-High. |
| **Digit pad below the fold in every case (bottom 881 vs 664 vp)** | **R2-measured, not re-driven** (plausible) | Live geometry; consistent with board+card stack. Not re-run. |
| **Sticky `:hover` leak on touch after tapping icon-btns** | **R2-measured, not re-driven** (plausible) | Source carries `:hover` rules keyed to fine pointers; the stick-until-next-tap behavior is the known touch `:hover` pathology. |
| **Landscape untested** | **CONFIRMED (as a gap)** | R2 self-flags; no `orientation` CSS (grep zero). See gap list. |

## Verdict table — R3 (api-truth), iOS rows re-sourced

| claim | verdict | second source |
|---|---|---|
| **3a `navigator.vibrate` unsupported on iOS/WebKit, 2026** | **CONFIRMED** (nuance) | caniuse `mdn-api_navigator_vibrate`, mdn/bcd #29166, TestMu — Safari/iOS never shipped it; all iOS browsers are WebKit. **Nuance:** a community polyfill ecosystem exists (`samdenty/ios-vibrator-pro-max`, `vibrator.dev`) via audio/switch hacks — R3's "permanent/full-stop" is true for the *native* API; the KISS "don't depend on iOS haptics" verdict is unaffected. |
| **3b `<input switch>` haptic (iOS 18) — script-tick patched in iOS 26.5, only direct tap fires** | **CONFIRMED** | `project-fathom` README ("works after the iOS 26.5 patch… only a direct tap fires the haptic — it can't be triggered from script anymore"); `ios-haptics`, `use-haptic` corroborate. **The 26.5-patch fact rests on developer/community sources (no Apple/WebKit primary — inherent for a closed undocumented hole); multi-source corroboration is adequate.** |
| **2c VirtualKeyboard API — Chromium 94+, not WebKit** | **CONFIRMED** | caniuse `mdn-api_virtualkeyboard`, chromestatus 5680057076940800, WebKit bug 230225 (unshipped). |
| **2b `interactive-widget` viewport key — not WebKit** | **CONFIRMED** | Corroborated in the VirtualKeyboard search set (htmhell, WebKit standards-positions #65); WebKit bug 259770 open. |
| **4a `contextmenu` does not fire on iOS 13+** | **CONFIRMED** | WebKit bug 213953, mdn/bcd #6376, Apple Developer Forums 699147 — long-press must be `pointerdown`+timer. |
| **1a/1b `type=text`+`inputmode=numeric`; `maxlength` ignored on `type=number`** | **CONFIRMED (spec/well-established)** | HTML spec limits `maxlength` to email/password/search/tel/text/url; iOS `type=number` gives QWERTY+number-row not the pad. Accepted on R3's cited sources; not independently re-fetched (low refutation risk). |
| **2a 16px defeats focus-zoom; disabling zoom is a11y-hostile (WCAG 1.4.4)** | **CONFIRMED (well-established)** | Canonical iOS behavior; matches R2's 16px measurement. |
| **5a `:focus-visible` Safari 15.4 / 5d `overscroll-behavior` Safari 16.0 / 1d `enterkeyhint` 13.4** | **ACCEPTED (well-established)** | R3's WebKit-blog/Igalia citations are primary; low risk, not each re-fetched. |
| **4b `-webkit-touch-callout:none` unreliable on iOS 26.1** | **FLAG — single-source** | Rests on one Apple Developer Forums thread (808606). Non-load-bearing: R3 correctly names `user-select:none` as the reliable half. Keep the device-verify caveat. |

---

## The gap list — what the three lanes did NOT cover that the owner's ruling requires

1. **W7 hint-UX touch seam — named, not designed.** R2 confirms hint is H-key-only with zero touch
   surface; R3 supplies the long-press API (`pointerdown`+timer). But *no lane maps the seam*: on
   touch, is hint a long-press on a **cell**? which cells? does it collide with the existing
   peek-hold (currently on the control-card boil divider, not the cells)? The ruling's
   "touch-to-hold" points straight at this and it's unspecified.
2. **W8 pencil-marks mobile-entry seam — a live contract conflict, unreconciled.** There is **no
   user candidate/notes mode today** (only read-only solver peek-domains). If W8 introduces
   user pencil-marks on mobile, that entry is **multi-candidate per cell** and *conflicts with the
   native-entry contract the recut lands on* (`type=text inputmode=numeric maxlength="1"`,
   single-tap-commit). No lane reconciled multi-digit-per-cell entry with the single-digit native
   input. This must be decided before the input contract is frozen.
3. **Landscape — untested by BOTH perf and census.** R1's profiles are all portrait (390×844 /
   430×932); R2 self-flags landscape as not-probed. A landscape phone (~844×390) crosses no
   breakpoint (still stacked) → board + inline card + entry in ~390 px of height pushes the
   pad/keyboard even further off-fold. Zero measurement of fold geometry or perf in landscape.
4. **iPad / tablet — entirely uncovered.** All R2/R1 profiles are phones (375–430). Two uncovered
   device classes: **(a) portrait iPad (<1024)** is `coarse && stacked` → `padActive` true (pad
   shows, `inputmode=none`) with a very different keyboard-eclipse profile (board fits; floating/
   split keyboard); **(b) large iPad landscape (≥1024)** is coarse but **not** stacked → it hits
   the **desktop drawer layout on a touch device** — R2 scoped the bottom-sheet out as a non-goal,
   but the desktop-drawer-on-touch case is a real, unprofiled surface. R3's only iPad-specific fact
   is `-webkit-text-size-adjust` default `none` on iPad (row 5c).
5. **Keyboard-eclipse magnitude — named, not measured.** Because `inputmode=none` suppresses the
   keyboard today, neither lane could observe *which cells the OS number pad covers at which board
   size* once entry reverts to `numeric`. The recut needs that measurement to size the
   `visualViewport`/`scrollIntoView` fix — right now it's a known-unknown.
6. **iOS-congruent focus styling — API given, current state not inventoried.** The owner asks for
   iOS-congruent focus styling; R3 supplies `:focus-visible`/`caret-color`. But R2 did not
   inventory the *current* focused-cell visual (the `isFocused` SVG-glyph highlight) as the touch
   focus indicator, nor whether the `opacity-0` input's caret leaks on focus. Minor but named in
   the ruling.
7. **Real-device perf ceiling — flagged by R1, carried forward.** iOS jetsam/tab-kill at ≈46.8 MB
   residency, Low-Power-Mode 30 Hz cap, ProMotion 120 Hz budget, thermal decay, iOS data-URL
   decode double-accounting — all UNMEASURABLE-HERE and correctly listed by R1 as implement-wave
   device probes. Not a lane failure; ledgered so the wave carries them.

---

## Load-bearing rows for the wave spec (ranked)

1. **Cap the grid bake at DPR2 on small screens** — the single lever on cold-load window (#1),
   memory (#2), and encode burst (#4). SSIM 0.984 is **grid-only**; **cap the grid alone**, leave
   logo (Fraunces text) + toggle at native DPR unless separately SSIM'd. On-device SSIM re-confirm
   before shipping any logo cap. [R1 #1/#2/#4 — arithmetic CONFIRMED, SSIM methodology sound]
2. **Release the redundant residency** — `.close()` the ImageBitmap after `bitmapsToUrls`
   (or drop the round-trip via `createObjectURL(blob)` — one raster, not two) AND `.close()` on
   LRU eviction (`frames.ts:51`). Frees ~22.7 MB of the ≈46.8 MB and stops the cap-24 accretion.
   [R1 #2 — retention CONFIRMED in `rasterPose.ts`+`HandDrawnGrid.vue`+`frames.ts`, no close anywhere]
3. **Abrogation is a REVERT, not a rebuild** — delete `DigitPad.vue` + e2e + the twin plumbing
   (`enterValue`/`cellFocusChange`/`suppressVirtualKeyboard`); flip `inputmode` to a static
   `'numeric'`. Contract: `type="text" inputmode="numeric" maxlength="1"` (`type=text` is
   non-negotiable — `maxlength` is spec-ignored on `type=number`). 16px input font already defeats
   iOS zoom. Keep `useCoarsePointer`/`useStackedLayout` (co-consumed). [R2 §1/§2 + R3 1a/1b/2a — CONFIRMED]
4. **Keyboard-avoidance is the recut's real work** — `visualViewport` `resize`/`scroll` +
   `scrollIntoView({block:'center'})` on cell focus. iOS has **no** `interactive-widget` and **no**
   `VirtualKeyboard` API (hard refusals) — hand-roll it. Handled *nowhere* today; masked only
   because `inputmode=none`. Measure the eclipse per board size first (gap #5). [R2 §5 + R3 2b/2c/2d]
5. **Add the missing touch affordances the ruling names** — hint / undo / redo have **zero** touch
   surface (keyboard-only); the keyboard legend that documents them is `display:none` on coarse;
   the attribution card won't open on tap. The recut must supply touch triggers (hint via the
   long-press seam, gap #1). [R2 §3 — CONFIRMED]
6. **Haptics: feature-detect `navigator.vibrate?.(10)`** — a real tick on Android, a silent no-op
   on iOS. There is **no clean iOS web haptic in 2026** (`vibrate` never shipped; iOS 26.5 closed
   the `<input switch>` script-tick). Do not architect any interaction that depends on an iOS buzz;
   the only post-26.5 iOS tick is the fathom direct-tap overlay on a *commit* control (brittle,
   switch-semantic — owner's call). [R3 3a/3b — CONFIRMED]
7. **Touch-hold via `pointerdown`+`setTimeout(~450ms)`**, cleared on `pointerup`/`pointercancel`/
   `pointermove` — **never `contextmenu`** (doesn't fire on iOS). On the hold target set
   `user-select:none` (the reliable half) + `touch-action:none` + `-webkit-touch-callout:none`;
   device-verify the callout (flaky on 26.1). One Pointer-Events path covers iOS+Android. [R3 4a/4b]
8. **Touch-hygiene sweep** — `-webkit-tap-highlight-color:transparent` globally (only on the logo
   today); `viewport-fit=cover` + `env(safe-area-inset-*)` (zero today → the fixed dark toggle sits
   under the notch/Dynamic Island at top −4px); contain sticky `:hover` behind `@media (hover:hover)
   and (pointer:fine)`; `-webkit-touch-callout:none` on cells (long-press loupe risk).
   `overscroll-behavior:contain` on the board scroll container. [R2 §4 — grep-CONFIRMED absent]
9. **Glass is not a cost today, but pre-profile W10** — `backdrop-filter` blur was removed
   (`AttributionCard.vue:117`); no live blurred surface at HEAD. W10's incoming glass tokens are the
   next WebKit-GPU risk — profile before shipping them. [R1 nulls — CONFIRMED]
