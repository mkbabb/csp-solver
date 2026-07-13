# T4-W10 — Vue idiom + glass tokens

**The easing ledger stops lying, the laminate joins the one glass curve, and the four a11y near-misses close as hard gates — one idiom sweep, no new surface.** FAM-11's "single-hub" ledger is fiction today: `MOTION.curves` holds one tenant while 40 recurring-curve occurrences sit as raw literals in component `<style>`, the laminate still rides a retired overshoot spring, both boards churn inline `:ref` closures per cell, `flourish` prop-drills board→cell→glyph, and the theme key is un-namespaced. r2-arch corrected the fix shape (easing → **CSS vars**, not TS `MOTION.curves`); this wave lands the two-layer token rule and the four contrast/reflow/focus/target gates the a11y lens found. Fable, structural-visual — zero motion redesign, all captures AE=0 against HEAD.

**Dependencies**: ← W4 (the barrel/one-import grammar + `.gitignore`/config residue land first; the theme-key note rides here per the r4 fold), ← W2 (the golden + a11y-probe runner this wave's gates cite). Independent of the W6→W7 game chain (runs on the `{W8,W9} ∥ {W10}` arm of the DAG). Feeds W11 (the idiom is settled before the shells extract). **Effort**: M.

---

## Scope

### The easing family → CSS-var layer (r2-T5, FAM-11 P2 — the ledger invariant made real)

`pencilConfig.ts:128-142` `MOTION.curves` is a **TS** object with one row (`drawerGlide`), reachable only by `v-bind`. Meanwhile `grep -rho 'cubic-bezier([^)]*)'` returns **9 distinct house curves across 40 occurrences**, every one an inline literal inside a component `<style> transition:` declaration — CSS, which cannot import the TS token. The tree already carries a 138-var CSS token layer (`assets/index.css`, `typography.css`, `App.vue`) with **zero** `cubic-bezier` custom properties (grep-confirmed empty). The easing family lives in neither hub.

- **Mint `--ease-*` in the existing `:root` block** (`assets/index.css`, where the 138 vars live) — one custom property per house curve (`--ease-noteWrite`, `--ease-glassGlide`, `--ease-eraserScrub`, … named from the curve's role, not its control points). Consumers become `transition: … var(--ease-noteWrite)`.
- **`drawerGlide` stays TS-only** — it is genuinely `v-bind`-consumed (`useControlsDrawer.ts` mover engine reads `MOTION.curves.drawerGlide`); v-binding all 40 CSS sites would add reactive plumbing for static values (r2-T5's decisive point). Document the **two-layer rule**: TS `MOTION.curves` for JS/`v-bind` consumers, `--ease-*` CSS vars for `<style>` consumers — the "single hub" is a coherent two-layer partition with a stated which-lives-where rule.
- The 40 inline literals convert to `var(--ease-*)` mechanically; the CSS-var layer is zero-runtime (no reactivity), one source, retune-in-place.

### The laminate joins the glass curve (FAM-11 P3 — the audit-4 ruling propagated)

`AnswerKeyLaminate.vue:231-232` still animates on `cubic-bezier(0.34, 1.56, 0.64, 1)` — an **overshoot spring** (control point > 1), the exact motion the T3 audit-4 glass ruling retired everywhere else (`pencilConfig.ts` `MOTION.curves.drawerGlide` = `cubic-bezier(0.32, 0.72, 0, 1)`, the monotone glass curve, zero overshoot). The laminate is the one surface the ruling never reached.

- Re-point `:231-232` onto the glass token — `var(--ease-glassGlide)` (the CSS-var minted above from the drawerGlide control points), 280ms preserved. The `:222-223` `cubic-bezier(0.55, 0.055, 0.675, 0.19)` leave-curve is a legitimate easeInCubic exit and is **not** an overshoot — tokenize it (`--ease-laminateLeave`) but do not re-time it.
- π: the laminate open/close is a visible motion — capture proves the curve swap changes the *velocity profile* (overshoot → monotone) with no change to start/end pose or duration.

### `:ref` discipline (FAM-11 P3 — inline closure churn in both boards)

Both boards bind a fresh arrow every render: `SudokuBoard.vue:583` and `FutoshikiBoard.vue:520` both `:ref="(el) => setCellApi(pos - 1, el)"` inside the cell `v-for`. Every re-render allocates N new closures and re-invokes every cell ref. Hoist to a **stable bound handler** — a single `setCellApi(pos, el)` referenced without the inline wrapper (index captured via the loop key, per the Vue function-ref idiom), so the ref identity is stable across renders. Behavior byte-identical (the `cellApi` registry fills the same slots); this is churn removal, not a wiring change.

### `flourish` → provide/inject (FAM-11 P3 — the prop-drill)

`celebrating` prop-drills the full depth: `SudokuBoard.vue:600` `:flourish="celebrating"` → `SudokuCell.vue:35` prop → `:251` `:flourish="flourish"` → the glyph; the futoshiki twin at `FutoshikiBoard.vue:537`/`FutoshikiCell.vue:39/249`. The intermediate cell declares the prop only to forward it. Replace the drill with a board-level `provide('flourish', celebrating)` + a glyph-level `inject` — the cell stops declaring a prop it merely passes through. Scoped to the celebration flag only (the cell's own props stay props); the glyph reads the injected ref.

### `defineModel` adoptions (FAM-11 P3 — manual v-model pairs)

`defineModel` is unused today (grep-confirmed absent). The manual `prop + emit('update:X')` pairs are the adoption targets — `ControlPanel.vue:50/68/179` (`difficulty` prop + `update:difficulty` emit; the size pair beside it). **Census in-wave** (K10 discipline — the exact set re-measured at merged HEAD, not frozen here): every `defineProps`/`defineEmits('update:*')` pair that is a plain two-way binding collapses to one `defineModel`; pairs with transform-on-write logic (the `emit('update:difficulty', val as Difficulty)` cast at `:179` is a candidate — keep the cast in a `defineModel` setter) are adopted only where the setter form preserves the coercion. `OptionSelector.vue` uses a one-way `@change` emit (`:14`), NOT v-model — it is **not** a defineModel site; leave it.

### Theme-key namespacing (FAM-7 r4 note — the un-namespaced storage key)

`useTheme.ts:4-10` calls `useDark({ selector: 'html', attribute: 'class', … })` with **no `storageKey`** — so vueuse writes the default key `vueuse-color-scheme` to `localStorage`. Any other vueuse app on the same origin collides on that key. Namespace it: `storageKey: 'sudoku-color-scheme'` (or the app's chosen prefix). Single-line, behavior-preserving for the app's own reads (fresh key = one-time default-to-system on first load after the rename; acceptable, the default IS system).

---

## Gates

Every gate born RED against HEAD 65425697 wherever the defect is live today. π = golden capture + comparison recipe (W2's golden system); DELTA = before/after pair banked in evidence.

| Gate | Value (born RED today) |
|---|---|
| easing ledger | `grep -rho 'cubic-bezier([^)]*)' web/frontend/src \| sort -u` currently returns **9 curves as raw literals**; after the wave every `<style>`-layer occurrence reads `var(--ease-*)` and `grep -rnE '\--[a-zA-Z-]+:\s*cubic-bezier' assets/index.css` returns the 9 `--ease-*` definitions (**empty today** — the RED probe). `drawerGlide` remains the sole TS-`v-bind` curve; the two-layer rule is documented in `pencilConfig.ts` |
| laminate glass | `AnswerKeyLaminate.vue:231-232` reads `cubic-bezier(0.34, 1.56, 0.64, 1)` today (overshoot, RED); after, it reads `var(--ease-glassGlide)` (monotone). **π**: `laminate-open-filmstrip.png` (0/140/280ms) light+dark; **DELTA**: `laminate-velocity-trace.json` — overshoot frame present pre-wave, absent post-wave; start/end pose + 280ms duration unchanged |
| `:ref` churn | `grep -n ':ref="(el)' web/frontend/src/games/*/*/*.vue` returns **2 inline closures today** (RED); after, zero — both boards use the stable bound handler. **DELTA**: `board-render-refs.json` — closure allocations per re-render N→0; `cellApi` slot map identical before/after |
| flourish inject | `SudokuCell.vue:35` + `FutoshikiCell.vue:39` each declare a `flourish?: boolean` prop today (RED); after, the cell declares none and the glyph injects. e2e celebration path (`visual-regression` completion golden) unchanged; **π**: completion-vignette golden byte-for-π both games |
| defineModel | `grep -rl defineModel web/frontend/src` is **empty today** (RED); after, the census'd two-way pairs read `defineModel`, `update:*` emits for those pairs gone. `vue-tsc -b` exit 0; the difficulty/size two-way bindings drive identically (e2e `sudoku-interaction`, `digit-pad`) |
| theme key | `grep -n storageKey web/frontend/src/composables/useTheme.ts` is **empty today** (RED → default `vueuse-color-scheme`); after, `storageKey: 'sudoku-color-scheme'`. Toggle + reload persists the choice under the namespaced key (e2e affordances dark-toggle) |
| **a11y — difficulty contrast** | the difficulty heading/label renders at **2.05–2.22:1** today (FAM-10, measured — RED, below AA 4.5:1); recompute the ledger at merged HEAD and lift the label ink to ≥ 4.5:1 (the ink-tier doctrine of T3-W9 §1 applies — a passing ink hex, not a wax tone). **π**: `difficulty-contrast-ledger.json` (WCAG 2.x over the literal hexes, both themes) — every difficulty label row ≥ 4.5:1 |
| **a11y — focus regression** | tailwind-v4's `outline-none` compiles to a transparent 2px outline (`SudokuCell.vue:394` comment acknowledges it); the app ships **no `forced-colors` fallback** (`grep -rn forced-colors` returns only that one comment — RED). Land a visible `:focus-visible` ring that survives forced-colors/high-contrast (the ring owns crayon-blue per T3-W9 §3.2 failure grammar — do not tint it gold). **π**: `focus-ring-forcedcolors.png` (Windows high-contrast emulation) — ring visible on every interactive target |
| **a11y — 320px reflow** | at 320px the futoshiki board overflows by **+6px** (FAM-10, measured — RED, horizontal scroll on the narrowest supported viewport, WCAG 1.4.10). Close the reflow (the board fits, no horizontal scroll). **π**: `reflow-320.png` both games — body never scrolls horizontally |
| **a11y — target size** | narrow-viewport cells fall **under the 44px floor** (FAM-10 — RED, WCAG 2.5.5 AAA / 2.5.8 AA 24px min). Bring the interactive cell hit-target to ≥ 44px at the narrow regime (padding/hit-area, not glyph size). **π**: `target-size-375.png` — measured tap-targets ≥ 44px |
| Types | `vue-tsc -b` → exit 0 |
| Boundaries | `eslint .` → exit 0 (the barrel/depth grammar from W4 holds; no new violation) |
| Parity | **reduced-motion AE=0** on all four game×theme pairs (K38: `reducedMotion:'reduce'` freezes boil → deterministic; the idiom sweep is motion-neutral, so before-vs-after AE=0 is the definitive bound) |

---

## Seeds

- `r2/r2-arch-transposition.md` §T5 — the easing family is homeless (1 TS row / 40 CSS literals / 0 CSS-var), the CSS-var fix over the TS-`MOTION.curves` extension, the two-layer rule, the laminate `:227`→(live `:231`) overshoot resolution. §T7 — the TS/CSS token seam is itself the transposition.
- `registry/families.md` FAM-11 — easing ledger aspirational; laminate rides the retired overshoot spring; inline `:ref` closures; flourish prop-drill → provide/inject; manual v-model → defineModel. FAM-10 — the four a11y near-misses (contrast 2.05–2.22:1, tailwind-v4 outline-none + no forced-colors, 320px +6px reflow, sub-44px targets). FAM-7 (r4 fold) — the vueuse-owned un-namespaced theme key.
- `r1/` vue-glass lens — the P3 idiom census that opened FAM-11 (the arch lane corrected the easing fix shape in r2).
- Live anchors verified at HEAD 65425697: `useTheme.ts:4-10` (no storageKey), `AnswerKeyLaminate.vue:231-232` (overshoot), `SudokuBoard.vue:583`/`FutoshikiBoard.vue:520` (inline `:ref`), `SudokuCell.vue:35`/`FutoshikiCell.vue:39` (forwarded flourish prop), `ControlPanel.vue:50/68/179` (manual v-model pair), `SudokuCell.vue:394` (the sole forced-colors mention).

## Residual risks

- **The defineModel set is a census, not a frozen list** — re-measure at merged HEAD (K10); adopt only plain two-way pairs, keep the `as Difficulty` coercion in a setter form. Over-adopting a pair with write-side logic silently drops the transform.
- **The a11y contrast lift re-derives against live paper tokens** — the 2.05–2.22:1 figures are the a11y-lens computation over the current hexes; if a paper/`--color-card` token moved since, the label ink re-derives to clear 4.5:1 against the live value in both themes (the T3-W9 §1 ink-tier discipline).
- **The theme-key rename is a one-time reset** — first load after the rename defaults to system (the fresh key has no stored value); this is correct behavior, not a regression, but note it in the wave record so the "why did my theme reset once" question has an answer.
- **The easing tokenization is mechanical but wide** — 40 sites; the load-bearing fact is AE=0 parity (the swap is value-preserving), not the literal count. Any curve whose named `--ease-*` role is ambiguous stays a literal rather than mis-named — the ledger's honesty is the point, not zero literals.
- **`drawerGlide` must NOT be forced into a CSS var** — it is the one genuinely `v-bind`-consumed curve; moving it would add the reactive plumbing r2-T5 explicitly rejected. The two-layer rule is the deliverable, not a single file.
