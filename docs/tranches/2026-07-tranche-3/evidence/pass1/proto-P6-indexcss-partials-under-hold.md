# Prototype P6 — `index.css` partial split under the C1/C2 `@layer` hold

**Lane key:** `proto-P6-indexcss-partials-under-hold`
**Worktree:** `/Users/mkbabb/…/.claude/worktrees/wf_8f3bd831-d64-15` (isolated; nothing ships)
**Verdict:** **GO** (order-preserving shape) — the split is provably cascade-identical. One
shape correction vs the charter sketch and one confounded gate arm, both detailed below.

---

## The question

Can `assets/index.css` (454 ln, six concerns) be split into `@import` partials while producing
the **cascade-layer proof** the live C1/C2 hold demands (`C-deferred-foldin.md:108`)? The hold's
rules at `index.css:271-291` (`.sheet-laminate` + its `prefers-reduced-transparency` /
`prefers-contrast` arms) and `:352` (`.sudoku-cell:focus-within`) must stay in `@layer utilities`
with **identical resolved order**. The gate: zero computed-style diffs on the C1/C2 selectors,
zero e2e regressions, zero pixel diffs. Any diff ⇒ HELD-AGAIN (a valid gate result).

The hold's stated lifting condition (`C-deferred-foldin.md:108`): *"a cascade-layer proof or a
visual-diff pass lifts the hold."* Note the hold was placed against an **SFC `<style>` extraction**
(which *changes* a rule's cascade layer); an `@import` partial split is a different, weaker move —
it keeps every rule in the same global sheet and the same `@layer`. P6 tests whether that weaker
move is provably identity-preserving.

---

## What I built / probed

**Toolchain reality.** The worktree had no `node_modules` and the `file:` wasm dep
(`csp-solver/wasm/pkg`) was unbuilt. I copied the prebuilt wasm pkg from the main tree into the
worktree (a build artifact, not a repo-source edit) → `npm install` (479 pkgs) → the **real Vite 8
+ `@tailwindcss/vite` 4 + esbuild-minify production pipeline** runs. All proofs use the actual
production compiler, not a standalone CLI.

**The split shape I built (order-preserving — "Design B"):**
```
src/assets/index.css   (5-line manifest)
  @import 'tailwindcss';
  @import './typography.css';
  @import './css/theme.css';       # @custom-variant + @font-face×3 + @layer base{body} + @theme + .dark + @layer base{*,body}
  @import './css/utilities.css';   # @layer utilities { … } verbatim (incl. both C1/C2 rules + animations)
  @import './css/print.css';       # @media (pointer:coarse) + @media print
```
Partials carry the exact source byte-ranges (`sed -n` of the original `4,219` / `221,380` /
`382,455`). Because Tailwind v4 **merges same-named `@layer` blocks and orders rules by source
appearance**, placing the `@import`s in source order makes the inlined stream reproduce the
original byte-for-byte ⇒ the compiler's output is identical by construction.

**The one non-obvious repair (a real finding).** My first split moved `@font-face` into
`css/theme.css` unchanged. The build then emitted the font `url()`s as **unresolved literals**
`./css/fonts/…woff2` instead of the baseline's hashed assets `/assets/fraunces-subset-Cx5I8plf.woff2`
— a font-404 regression. Root cause, proven from the diff: **Tailwind rebases `url()` relative to
the importing file** (`./fonts/` in `theme.css` at `assets/css/` → `./css/fonts/` relative to the
entry → nonexistent → Vite passes it through as a literal). Fix: write `url('../fonts/…')` in the
partial so Tailwind rebases it back to `./fonts/` relative to the entry → Vite re-resolves to the
identical hashed asset. `data:` URI textures need no change (not rebased). This is a load-bearing
gotcha the W-F implementation must carry: **any partial that moves `url()` references must rewrite
the relative path to stay entry-relative after Tailwind's rebase.**

---

## Gate result (quoted commands)

### 1. Compiled-CSS byte identity — the cascade-layer proof (STRONGEST)

```
$ npx vite build            # baseline (HEAD index.css) → snapshot 'before'
$ # …perform split, fix font urls → 'afterB2'…
$ shasum -a256 before/index.css afterB2/index.css
ce4c092b50a271e8472e1dfa82d6467e4f01a745a58a05f3d08eef21986d0fa7  before/index.css
ce4c092b50a271e8472e1dfa82d6467e4f01a745a58a05f3d08eef21986d0fa7  afterB2/index.css
$ for g in index FutoshikiGame AnswerKeyLaminate; do cmp -s before/$g.css afterB2/$g.css && echo "$g IDENTICAL"; done
index.css: IDENTICAL ✓   FutoshikiGame.css: IDENTICAL ✓   AnswerKeyLaminate.css: IDENTICAL ✓
```
The Vite content-hash itself is identical (`index-Bykbkkbm.css` both builds) — Vite's own
confirmation of byte-equality. **Identical compiled bytes ⇒ identical `document.styleSheets`,
identical `@layer` order, identical rule order, identical every `getComputedStyle` — by
construction.** There is no rendering input left that could differ. The C1/C2 rules land where the
baseline puts them: inside the single merged `@layer utilities` block (compiled offset 31119),
`.sheet-laminate`@38501, `.sudoku-cell:focus-within`@40585; the PRT/contrast arms verbatim.

### 2. Runtime `getComputedStyle` + `document.styleSheets` probe (deterministic, dev mode)

A Playwright probe (`e2e/p6-cascade-probe.mjs`) injects `.sheet-laminate` and a focused
`.sudoku-cell` and dumps `getComputedStyle` across three media arms, plus a styleSheets layer/rule
walk. Captured against baseline dev server and split dev server:
```
=== DIFF: baseline vs split (laminate+focus × base/reducedMotion/contrastMore) ===
TOTAL getComputedStyle DIFFS: 0
$ cmp -s probe_baseline.json probe_split.json && echo IDENTICAL
probe_baseline.json == probe_split.json : IDENTICAL ✓
```
`prefers-reduced-transparency` has **no native Playwright emulation** flag, so that arm is proven
only via the compiled byte-identity (§1) — the compiled `.sheet-laminate` PRT rule
(`background:var(--color-card);box-shadow:var(--sheet-laminate-cast)`) is byte-identical in both
bundles (grep-confirmed).

### 3. e2e suite — zero regressions

```
$ npx playwright test --reporter=line
Running 33 tests using 9 workers
  33 passed (12.7s)
```
Includes the round9 light-mode and dark-mode paths (both themes exercised).

### 4. Full build + lint

```
$ npm run build         # vue-tsc -b && vite build → PWA precache 22 entries, no errors
$ npx eslint src/assets/ # .css not linted (no CSS lint configured) → exit 0, no regression
```

### 5. Pixel diffs — CONFOUNDED (documented, not a pass/fail on the split)

The round9 "visual snapshot" tests use `page.screenshot({path})` (capture-only; **not**
`toHaveScreenshot`), and the PNGs are gitignored (`git ls-files e2e/screenshots/` empty). I tested
determinism directly:
```
=== split run1 vs split run2 (identical code, two runs) ===
round11-light:  NON-DETERMINISTIC (run1!=run2)
round11-dark:   NON-DETERMINISTIC (run1!=run2)
round11-9x9:    NON-DETERMINISTIC (run1!=run2)
```
The app has **intrinsic per-render visual randomness** — hand-drawn `pencil-boil` grid geometry +
randomized puzzle generation — so raw screenshot byte-equality is unsatisfiable *regardless of any
CSS change*; it can't even distinguish baseline from itself. The compiled-CSS byte-identity (§1) is
**strictly stronger** and subsumes the pixel arm: the only rendering input the split touches — the
stylesheet — is provably unchanged, so a split-induced pixel difference is impossible in principle.

---

## Verdict: **GO**, with a shape correction

The `@import` partial split **satisfies the hold's lifting condition** via a cascade-layer proof:
byte-identical compiled CSS + zero-diff runtime `getComputedStyle` on all C1/C2 selectors and their
media arms. Every rule stays in `@layer utilities` at identical resolved order — trivially, because
the compiled bytes are identical. This is a genuinely stronger artifact than the "visual-diff pass"
the hold names as the alternative (which this app cannot produce cleanly, per §5).

**SHAPE-CORRECTED vs the charter sketch** (two deltas the critique/impl pass must adopt):

1. **`@font-face` moves into a partial, not "stays in index.css."** The charter said *"index.css
   becomes @font-face + manifest."* But CSS requires `@import` to precede all other rules; you
   cannot have `@font-face` then `@import partial`. So index.css becomes a **pure `@import`
   manifest**, and `@font-face` rides in `theme.css` — **with its `url()` rewritten `./fonts/` →
   `../fonts/`** (the rebase repair). If the owner insists `@font-face` literally stay in
   index.css, then the partials must inline *before* it, which reorders `@font-face` after the
   theme vars — behavior-neutral but no longer byte-identical, so it forfeits the clean proof.

2. **Do NOT extract a separate contiguous `animations.css`** (the charter named it). The animation
   rules (`@keyframes shake`/`cell-reveal`, `.cell-reveal-animated`, the reduced-motion `*` block)
   are **interleaved** inside `@layer utilities` between non-animation rules
   (`.sheet-laminate` → `.solve-*` → *animations* → `.sudoku-cell:focus-within` → `.fira-code` →
   *reduced-motion*). Pulling them into one contiguous partial reorders rules within the merged
   utilities layer, breaking byte-identity. Keep the utilities layer as **one `utilities.css`
   partial** (my Design B). The provable split is **theme / utilities / print**, not
   **theme / animations / print**.

The "six concerns" therefore split cleanly along **layer/at-rule boundaries** (theme-vars,
utilities, print), not along **semantic concern** (animations vs focus vs laminate) — the latter
cuts across the merged `@layer utilities` and cannot preserve order.

---

## What the critique pass should attack

- **Dev-mode PRT arm gap.** `prefers-reduced-transparency` is proven only by compiled byte-identity,
  not a live runtime probe (Playwright can't emulate it). If the owner wants a *runtime* PRT
  sample, it needs a manual/forced-media harness. Is compiled byte-identity sufficient for that arm?
  (Feeds **Q9**.)
- **Q9 sign-off.** Does the hold's owner (FE maintainer, `C-deferred-foldin.md:108`) accept a
  **compiled-CSS byte-identity proof** as satisfying *"a cascade-layer proof"*? It is strictly
  stronger than the "visual-diff pass" alternative — and the visual-diff pass is *unsatisfiable*
  here (§5, boil non-determinism). If the owner specifically wanted a pixel-diff, that expectation
  cannot be met by any split (or non-split) on this app and should be retired in favor of the CSS
  artifact.
- **The `url()` rebase gotcha** (`./fonts/`→`../fonts/`) is a silent-404 trap: it builds clean and
  only 404s at runtime font-fetch. W-F must land it *with a build-output font-URL assertion* or a
  smoke check, not on faith. Consider whether any *other* `url()` (the two `data:` textures — safe;
  none other) moves partitions.
- **Is the split even worth it?** It's provably zero-risk, but it's also pure file hygiene — the
  compiled output is identical, so there is no runtime, size, or cascade benefit, only source
  navigability (454 ln → 5-line manifest + 3 partials). The KISS bar (synthesis §1.7) may judge a
  454-line stylesheet under budget and the split not worth the `url()`-rebase footgun. This row is
  ranked **last** in the FE priority list (§1.5.8) for exactly this reason.
- **HMR / dev-serve parity.** Byte-identity is proven for the **prod** bundle; the runtime probe
  covers dev-serve `getComputedStyle` (zero diff). No `@import`-ordering warning appeared in either
  build, but confirm Tailwind emits none on a watch rebuild.

---

## Artifacts (scratchpad `…/pass1/p6/`)

- `before/` — baseline compiled CSS (sha `ce4c09…`)
- `afterB2/` — split compiled CSS (sha `ce4c09…`, identical)
- `probe_baseline.json`, `probe_split.json` — runtime dumps (byte-identical)
- `split_index.css.bak` — the 5-line manifest; partials live in worktree `src/assets/css/`
- `shots_split_run1/`, `shots_split_run2/` — the non-determinism demonstration
- probe source: worktree `web/frontend/e2e/p6-cascade-probe.mjs`
