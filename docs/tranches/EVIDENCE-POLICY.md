# Evidence policy

**Ratified at T4-W0, ballot B1 ("prune + policy cap").** This binds every future evidence dir under `docs/tranches/**` and every W2 π golden. Evidence proves a claim—it isn't a gallery. The estate got to 70 MB of PNGs because nobody said no; this is the no.

## The rule

- **Text-first, always.** Probe output, diffs, tables, numbers—that's the default and it carries the vast majority of claims. If a claim can be shown in text, it must be. Paste the command and its output; don't screenshot a terminal.
- **An image only when the claim is pixel-truth.** Color, geometry, anti-aliasing, a rendered glyph, a hairline, a promoted-layer edge—things a number can't state. If prose or a table would say it, the image doesn't earn its bytes.
- **Crops, never full viewports.** Frame the pixels under audit and nothing else. A full 1440×806 board to prove a corner is a 500 KB lie about what you're looking at—crop to the corner.
- **Per-image cap: ≤150 KB.** A load-bearing crop clears this with room. If it doesn't, you're capturing too much frame or the wrong format—recrop, don't raise the cap.
- **Per-wave cap: ≤2 MB of images.** The whole evidence image budget for a wave. Text has no cap; images do.
- **Goldens are separate.** π/pixel goldens live under the W2 capture machinery with their own budget line—they're regression fixtures, not wave evidence, and they don't draw against the 2 MB.
- **Enforcement.** A violation—an uncropped viewport, an over-cap image, an image standing in for text—blocks the wave gate. The gate greps the wave's evidence dir for `*.png`, sums bytes, and fails on breach.

## The baseline this corrects (2026-07-12)

Measured on a fresh `--no-local` clone before the prune:

| Metric | Value |
|---|---|
| Full clone (`.git`) | 97 MB |
| Shallow clone (`--depth 1`) | 48 MB |
| Tracked `*.png` | 420 files, ~70 MB (~95% of the tracked payload) |
| `docs/tranches/**` | 76 MB of the tree |
| LFS | none (`.gitattributes` absent, `git lfs ls-files` empty) |

~97 MB pulled to obtain ~2.6 MB of code. The disease was full-viewport screenshots hoarded as evidence.

## Post-prune (T4-W0)

Tracked-tree prune at HEAD—`git rm`, no history rewrite; the blobs stay in history, they leave the working tree.

| Metric | Before | After |
|---|---|---|
| Docs PNGs (tracked) | 417 files, 68.62 MB | 115 files, 13.18 MB |
| Pruned | — | 302 orphans, 55.45 MB freed |
| Broken image links | — | 0 (symmetric before/after resolve, all tracked `.md`) |

A PNG survived iff a tracked text file (`.md`/`.html`/`.ts`/`.vue`/`.json`/harness) referenced it—by relative path, or by basename with collisions resolved on path. Everything else was orphan evidence, and it's gone. The three app assets under `web/frontend/public/**` were out of scope and untouched.

The tranche-IV evidence dir opens under this policy—small crops, capped, text-first. The bloat doesn't recur.
