# T4-W10 · Lane V — adversarial verification (consolidated gate table)

**Merged HEAD 766aa068** (T4-WU sealed). Every gate re-measured by V against the **built dist**
served on `:4491` (`npm run build` → `vite preview --port 4491 --strictPort`, killed on
completion; owner :3000/:3001 untouched). Nothing trusted from the I-lanes; every figure below is
V's own probe. Scratch config `playwright.verify-v.config.ts` (webServer-less, :4491) written +
removed. C1's parity baselines backed up, re-run over, then restored byte-identical.

---

## 0. Born-RED re-confirmation (from the committed base blobs — `git show 766aa068:<path>`)

| condition | probe | result |
|---|---|---|
| CSS-var void | `index.css` grep `--…: cubic-bezier` | exit 1 (empty) — **RED confirmed** |
| laminate overshoot literal | `AnswerKeyLaminate.vue:235-236` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (cp₂=1.56>1) — **RED** |
| 2 inline `:ref` closures | both boards | `:ref="(el) => setCellApi(pos - 1, el)"` — **RED** |
| forwarded flourish props | both cells | `flourish?: boolean` (:53/:55) + `:flourish="flourish"` (:452/:439) — **RED** |
| defineModel absent | `git grep defineModel 766aa068` | exit 1 — **RED** |
| storageKey absent | `useTheme.ts` | exit 1 (default `vueuse-color-scheme`) — **RED** |
| a11y contrast (re-derived) | WCAG over base crayon hexes on card #fdfdfc | green **2.22** / orange **2.05** / rose **4.11** — all <4.5, **RED** |
| a11y reflow (baseline capture) | C3 `reflow-320-futoshiki.png` + i3 re-probe | futoshiki **+6px** at 320 — **RED** |

All eight born-RED conditions reproduced independently.

---

## 1. Full gate table (V's measurement)

| Gate | V's probe + figure | Verdict |
|---|---|---|
| **easing ledger** | `grep -rho 'cubic-bezier' src --include=*.vue` → **0 survivors**; only `pencilConfig.ts:158 drawerGlide` TS-literal remains; `index.css:283-292` mints **10** `--ease-*`; dist ships them (minifier strips leading zeros, numerically identical) | **PASS** |
| **laminate glass** | `AnswerKeyLaminate.vue` arrive `:238-239` `var(--ease-glassGlide)` (280ms preserved), leave `:226-227` `var(--ease-accelIn)` (200ms). glassGlide `0.32,0.72,0,1` = monotone (cp₂=1, no overshoot); overshoot literal gone. Dist `AnswerKeyLaminate.css`: 2×glassGlide + 2×accelIn, zero raw bezier. I1 velocity trace: minScale 0.998→1.0, overshoot frames 35→0, pose/duration unchanged | **PASS** |
| **`:ref` churn** | 0 inline closures; `:ref="setCellApi"` both boards; stable handler keys off `defineExpose({focus,position})`; `watch(totalCells)` prunes keys≥N. e2e roving-tabindex (Ctrl+Home/End) + size-switch pass vs dist | **PASS** |
| **flourish inject** | 0 `flourish?: boolean` props, 0 `:flourish=` forwards; `provide("flourish", celebrating)` ×2 boards + `inject("flourish", ref(false))` glyph; `isSolved` gate intact (caret safe). Completion golden passed; celebration e2e passed | **PASS** |
| **defineModel** | 4 files, **10** `defineModel<…>` (adopted #1,3,4,5,6,8,9,10,11,13); `errorCheckMode` LEFT manual at all 3 hops (`update:errorCheckMode` emits preserved ×4 panels + AssistSettings); casts (`as Difficulty/number/PencilMode`) + `triggerBoil()` + `v==='on'` map preserved in setters. vue-tsc exit 0; size/difficulty drive e2e pass | **PASS** |
| **theme key** | `useTheme.ts:9 storageKey:"sudoku-color-scheme"`. Dark parity boots under renamed key (pixels AE=0). `visual-golden.spec.ts:83` boot-key updated in-place (hand-matched, not a re-baseline). e2e affordances dark-toggle passed | **PASS** |
| **a11y contrast** | V's WCAG recompute on card #fdfdfc: green-ink **#1d7f35 4.98**, orange-ink **#a26009 4.90**, red-ink **#d02a52 4.99** — all ≥4.5. Dark aliases wax (already ≥AA). dt-label 62→68% + heading-value 60→68% raises confirmed rendered (parity band maxΔ=13) | **PASS** |
| **a11y focus (forced-colors)** | `forcedColors:'active'`, cell focused: sudoku light `2px solid rgba(5,0,73,0.8)` VISIBLE, dark `2px solid rgba(0,230,255,0.8)` VISIBLE, futoshiki light VISIBLE; `input.matches(':focus-visible')=true` (`:has()` fires). Ring rides the cell (opacity-1), input `outline-style:none` untouched (WM-frozen) | **PASS** |
| **a11y 320px reflow** | V @320 both games: sudoku scrollW=clientW=320 **0px**; futoshiki **0px** (was +6px). Closed by ≤360px `--logo-height` rung. No body horizontal scroll | **PASS** |
| **a11y target size** | V @390/@320: futoshiki 5×5 **72.39/58.39** (PASS 44); sudoku 9×9 **40.22/32.44** (PASS AA24, 44 geom-capped 9×44=396>320); sudoku 16×16 **22.63/18.25** (FAIL AA24 both). Pre-existing D12 exemption (`index.css:671-684`, untouched by wave). | **QUALIFIED — documented geometric cap** (see §3 outstanding) |
| **Types** | `vue-tsc -b --force` exit 0 | **PASS** |
| **Boundaries** | `eslint .` exit 0; `knip` exit 0 | **PASS** |
| **Parity (reduced-motion AE=0)** | see §2 | **PASS** (board AE=0 ×4; full diff = named inks only) |

---

## 2. Parity bound (C1 recipe re-run, `KEY=sudoku-color-scheme`, vs C1 committed baselines)

Board self-AE0=true + full self-AE0=true on all 4 pairs (machine-deterministic).

| pair | board sha vs C1 | full-page diff vs C1 (V's sharp re-diff) | every-nonzero-explained |
|---|---|---|---|
| sudoku-light | `5f527a21…` **== baseline (AE=0)** | 9001px/0.22%, maxΔ91 — bands y[380-420]x[882-1080]=DIFFICULTY heading ink + y[780-800]x[158-208]=dt-label | yes — both are named a11y lifts |
| sudoku-dark | `a1c8e60d…` **== (AE=0)** | 621px/0.015%, maxΔ12 — y[780-800] dt-label only (heading dark-aliases wax) | yes |
| futoshiki-light | `ae77b9ef…` **== (AE=0)** | 8911px/0.22%, maxΔ91 — y[420-460] heading ink + y[780-800] dt-label | yes |
| futoshiki-dark | `7991707b…` **== (AE=0)** | 621px/0.015%, maxΔ12 — dt-label only | yes |

**Zero changed pixels in the y[420-780] option region** (V's 20px-band histogram): the "9×9/Easy/
Medium/Hard/Normal" OptionSelector rows, board, logo, toggle, crest are byte-unchanged. Board crop
AE=0 ⟹ no board pixel moved. Every full-page nonzero traces to the two deliberately-lifted a11y
ink surfaces (difficulty heading `--color-*-ink`, `.dt-label` graphite raise) — exactly the
exclusion the parity gate permits. **PASS.** C1 baselines restored byte-identical after the run;
V's pass-2 captures banked as `parity-*-2.png` (board-2 shas == baselines).

---

## 3. Team-lead outstanding

1. **a11y target-size gate is a QUALIFIED close, not a clean ≥44px pass.** V confirms C3/I3's
   arithmetic: futoshiki 5×5 meets AAA 44; **sudoku 9×9 meets only AA 24** (44 impossible —
   9×44=396>320); **sudoku 16×16 breaches even AA 24 at both 390 and 320** (22.63/18.25px;
   16×24=384 board unreachable under ~408px without a scrolling board, which would re-break the
   320 reflow gate; glyph-shrink is banned; desktop geometry moves goldens). Governed by the
   **pre-existing D12 exemption** (`index.css:671-684`, untouched by this wave — verified against
   the base blob). The wave does **not regress** target size; no golden-safe / gate-3-safe /
   glyph-safe change moves these figures. Decision for the lead: accept the documented geometric
   cap (AA-24 floor for 9×9, sub-AA irreducible for 16×16 governed by D12) as the gate close, or
   gate 16×16 out of the ≤~408px regime. This is the sole non-clean-green gate.
2. **Theme-key one-time reset** (informational): first load after the `vueuse-color-scheme →
   sudoku-color-scheme` rename defaults to system (fresh key). Correct, non-recurring; noted so
   "why did my theme reset once" has an answer.
3. **`visual-golden.spec.ts` dark-boot key** moved with the app (I2 §4a): `:83` now sets
   `sudoku-color-scheme`. Not run on darwin (per-OS, linux runner) — the **runner seal** must
   confirm the dark golden still boots dark under the renamed key. Verified here only by eslint
   (covers e2e) + reasoning; flagged for the golden lane.

---

## 4. Battery + suites (V, vs dist :4491)

| gate | result |
|---|---|
| vue-tsc -b --force | exit 0 |
| test:unit | 271 passed / 21 files |
| lint:eslint | exit 0 |
| lint:knip | exit 0 |
| prettier --check src/ | clean |
| build | exit 0 (index 193.87 kB / gzip 69.82 kB; dist ships 10 `--ease-*`) |
| default e2e vs dist | **63 passed** (visual-golden + throttled-void ignored per config) |
| darwin goldens vs dist | **4 passed — NO golden moved** (no re-baseline) |
| parity reduced-motion | board AE=0 ×4; full = named inks only |

## 5. Cross-seam (still green vs dist)

- **WU** undo spine + staged Deal zone + dirty two-tap — `affordances` + `mobile-affordances`
  "Deal is dirty-gated" pass.
- **W9** progress border/tally — `visual-regression` pass; tally byte-unchanged in parity except
  the deliberate `.dt-label` lift.
- **W8** marks/assists/check-that-waits — `mobile-affordances` marks/assist pass; `errorCheckMode`
  same-value re-arm preserved (defineModel correctly NOT adopted at 3 hops).
- **drawer contract** — `mobile-platform` iPad drawer-tab ≥44px toggle pass.
- **WM** affordances (frozen input shape) — `mobile-affordances` play-tools ≥44px, long-press
  peek, single-tap attribution pass; input `outline-style:none` untouched.

## VERDICT: **PASS** — 11 of 12 spec gates clean-green under V's own measurement; the a11y
target-size gate closes as a documented geometric cap (pre-existing D12 exemption, no wave
regression, sole outstanding for the lead). Battery green, 63 e2e + 4 goldens pass, parity board
AE=0 with full-page diff wholly traced to the named a11y ink lifts.
