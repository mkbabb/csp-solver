# FONT STRATEGY — **EXECUTED**. Ruling B2, shipped P1-W3 `387cceea`.

Lane D · pass 2 row, reconciled to the shipped tree at pass 3 (2026-07-31, Lane D ship 2).
Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` (MAIN).
Renders: `…/pass2/laneD-shots/` — chromium + webkit, light + dark, state-pinned (`?size=3&difficulty=EASY`).

**This is no longer a decision row.** It went to the owner as A / B / B2 / C; **B2 was ruled and
landed in P1-W3 group C** (`387cceea`), along with the build-rule fix §4 asked for. What follows
is the row restated against what actually shipped, with the two numbers pass-2's critique charged
(the table sum, and B2's price) corrected from measurement rather than estimate.

---

## 0 · Disposition

| | row said | shipped | where |
|---|---|---|---|
| ruling | recommend **B2** | **B2** | `387cceea` |
| heading transform | `lowercase` | `text-transform: lowercase`, tracking `--type-tracking-caps` 0.1em → `--type-tracking-wide` 0.025em (0.1em is tuned for caps) | `typography.css:266-267` |
| subset | 12,048 B (estimate) | **13,788 B** measured, +4,016 B on the shipped 9,772 | `assets/fonts/fraunces-subset.woff2` |
| repertoire | 21 rendered lowercase + space | that **plus the six authored initials `B C D M N S`** | `index.css:65-70` cmap comment + `unicode-range` |
| three faces | ~19,604 B | **21,724 B** | `index.css:56` |
| build note (§4) | "cut from RENDERED text; both cases through a `text-transform`" | adopted verbatim as the DERIVATION RULE at the top of `index.css` **and gated** | `index.css:12-20`, `scripts/check-font-coverage.mjs` |
| the m+n gap | closed only by B2/C | closed — `thermo`'s `m`, `kenken`'s `nn` no longer paint Georgia | G3.4, 6/6 WebKit |

**Why the price moved.** The 12,048 B estimate covered the rendered lowercase only. §4's own rule —
*both cases of any string that passes a `text-transform`* — additionally needs the six AUTHORED
initials, and those cost **1,852 B**. That is what makes the cut survive a later change of
transform instead of re-breaking exactly as it did in P5. The estimate was not wrong about
lowercase; it was priced before its own build note was applied to it.

**The tooling was validated against this row, not merely trusted:** re-cutting the row's B2
repertoire from the P1-W3 source yields **11,936 B** against this row's measured **12,048 B** —
0.9%, this row's own comparability tolerance, the same figure §2 used to certify its deltas.

---

## 1 · The finding, stated once — and the denominator stated with it

`.section-heading` **was** `text-transform: uppercase` (`typography.css`), and the P5 Fraunces
subset was cut from the **authored** strings, never the **rendered** ones — so it carried
`B D S` and no other capital. Every heading in the drawer painted mostly Georgia at
`font-weight: 800`: synthetic bold on a fallback serif, a real component of the owner's mark-4
"low-res / font loss" mark.

Verified two ways, agreeing exactly:

- **cmap of the then-shipped file** — `fraunces-subset.woff2` (9,772 B) contained 20 glyphs:
  `B D S a c d e f h i k l o r s t u y z` + space. The `unicode-range` descriptor was honest;
  the bytes really weren't there.
- **live per-glyph probe in the running app** (sentinel-fallback method, `rig/font-row.mjs`):

| rendered string | Fraunces glyphs | painted in Georgia | on screen |
|---|---|---|---|
| `NEW GAME` | 0/7 | `NEWGAME` | both |
| `CHECK` | 0/5 | `CHECK` | both |
| `SIZE` | 1/4 | `IZE` | sudoku |
| `DIFFICULTY` | 1/10 | `IFFICULTY` | both |
| `MARKS` | 1/5 | `MARK` | both |
| `CANDIDATES` | 3/10 | `CANIATE` | both |
| `BOARD SIZE` | 3/9 | `OARIZE` | futoshiki (its alternate for `SIZE`) |

**The denominator, named — the pass-2 critique's §8, closed.** These seven rows sum to
**9/50 = 18.0%**. The headline `6/41 = 14.6%` is the **sudoku screen**: the six rows co-visible
there, i.e. the table minus `BOARD SIZE`, which is futoshiki's alternate and never renders beside
`SIZE`. Stated per screen: **sudoku 6/41 = 14.6% · futoshiki 8/46 = 17.4% · every distinct
heading string 9/50 = 18.0%.** The excluded row was the best-covered one, so 14.6% was the
conservative reading of the defect, not a flattering one — but the row shipped without saying
which denominator it was, and that is the defect being closed here. All three figures now ride
`index.css:12-20` so a reader of the source gets the same three numbers.

The gallery wordmarks were lowercase and mostly fine — except the **m+n gap**: `thermo` painted
its `m` in Georgia (5/6) and `kenken` painted both `n`s (4/6), mid-word at 96px beside four
correct wordmarks. See `laneD-shots/mngap-A-today.png` vs `mngap-C-resubset.png`. **Closed by the
shipped B2 cut**, and now gated: `e2e/wordmark-integrity.spec.ts` G3.4 runs 6/6 in WebKit.

---

## 2 · The four options, as priced then

Bytes measured by re-subsetting a full Fraunces variable font present on this machine
(`value-css-totality-audit/demo/color-picker/public/fonts/fraunces-latin-normal.woff2`, opsz
9–144 + wght 100–900 — the same axes the shipped face declares). **Nothing was added to
`package.json` and nothing was copied into `src/`.** Comparability check: re-subsetting that
source to the *then-shipped* repertoire yielded **9,680 B** against the shipped **9,772 B**
(0.9%), so the deltas below are apples-to-apples.

| | strategy | code change | Fraunces coverage | woff2 | Δ vs then | 3-face total |
|---|---|---|---|---|---|---|
| **A** | ship as-is | none | headings **14.6%** (sudoku) · `thermo`/`kenken` broken | 9,772 B | — | 17,236 B |
| **B** | `text-transform: lowercase` on `.section-heading` | 1 line | headings **85.4%** · `thermo`/`kenken` still broken | 9,772 B | **0 B** | 17,236 B |
| **B2** ✔ | B + re-subset the missing lowercase | 1 line + font | **100%** everywhere | *est.* 12,048 B → **shipped 13,788 B** | **+4,016 B** | **21,724 B** |
| **C** | keep uppercase, re-subset full `A–Z a–z` | font only | **100%** everywhere | 25,240 B | +15,560 B | ~32,796 B |

(A minimal C — exactly the caps the app rendered then, no headroom — was 20,864 B, +11,184 B.
Not tabled as a recommendation: it re-breaks the moment a heading gains a letter, which is
precisely how the bug was born.)

**Renders**
- Letterform strip, four options stacked, same word, same size:
  `laneD-shots/strip-light-letterforms.png` · `strip-dark-letterforms.png`
- Whole control card, per option/theme/engine: `laneD-shots/{chromium,webkit}-{light,dark}-{A-today,B-lowercase,B2-lowercase-plus,C-resubset}-headings.png`
- Gallery card: same naming, `-gallery.png`
- The m+n gap isolated at 96px: `laneD-shots/mngap-{A-today,C-resubset}.png`

**What the strip shows.** Row 1 (A) is plainly not the display face — lighter, narrower, thin
serifs. Row 2 (B) is the chimera made visible: `e` and `a` sit heavy beside a light `n w g m` in
the same word. Rows 3 (B2) and 4 (C) are uniform.

---

## 3 · What the ruling cost elsewhere, now that it has

- **The register moved, as warned.** Lowercase headings read quieter and more notebook-like. The
  interaction with `--type-tracking-caps` the row flagged was handled rather than inherited: the
  tracking dropped to `--type-tracking-wide` in the same commit, because 0.1em is a caps figure.
- **The gallery gap closed** — B alone would have left it; B2 did not.
- Loading model unchanged: `font-display: swap`, same-origin, existing immutable-cache headers,
  same SW precache glob. +4,016 B on a 229.7 kB main chunk.

---

## 4 · The rule that shipped with it — the actual fix

The P5 subset was cut from authored strings, so the bug recurs the next time a heading is added
or a `text-transform` changes. **That rule is now the first thing in `index.css`** (`:12-20`) and
it is enforced, not merely written: `scripts/check-font-coverage.mjs` (`npm run test:font-coverage`,
in the CI lint lane) walks the woff2 cmap with zero dependencies, checks it against the rendered
corpus in both directions — `unicode-range` == cmap — and is **proven able to RED**: against this
row's own 25-glyph B2 file it names `C M N` exactly, the three initials the lowercase-only
estimate had missed. The woff2 is just the rule's output.

---

## 5 · Reproduce

```
cd web/frontend && npx vite --port 5288 --strictPort          # any free port
SHOTS=<shots-dir> RIG=<rig-dir> node <rig-dir>/font-row.mjs   # renders + provenance
SHOTS=<shots-dir> RIG=<rig-dir> node <rig-dir>/mn-gap.mjs     # the m+n crop
cd web/frontend && npm run test:font-coverage                 # the standing guard
```
`rig/` holds `font-row.mjs`, `mn-gap.mjs`, the four measured woff2s under `rig/fonts/`, and
`font-provenance.json`. The provenance probe carries an inline control (`B` must resolve true,
`Ω` false) because the first version of it — measuring against Georgia — reported 100% coverage
for every option including the broken one, and would have sent this row to the owner wrong.
