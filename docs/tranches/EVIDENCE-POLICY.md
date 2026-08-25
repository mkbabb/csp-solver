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

## The claims law (added T9-W0, 2026-08-25)

The rules above police *bytes*. Not one of them asks whether a capture proves anything, or whether a claim has a capture at all. Under O-12 the entire deployment-validation regime is a visual pass on the live edge, so that gap swallowed it whole: T7's owner-ordered pass, T8's live pass, T8's cure re-verify and T8.1's live proof are all prose, with nothing on disk to re-read (T9 formation, family **F15**—`2026-08-tranche-9/evidence/formation/registry.md`). Three rules close it.

- **A banked capture is cited, or it goes.** A capture no report in its own tranche names by path is a gallery image. It's deleted at the next close, and the close names what it deleted. The cite is what makes an image evidence—bytes under the cap aren't a licence to keep it.
- **A live-pass VERDICT row cites a frame, or states its absence in-row.** A row reading PASS/FAIL/NOTE against a rendered surface carries the path of the banked frame or probe row it rests on. Where nothing was banked, the row itself says so—in the row, not in a preamble that covers a table of eighty. A tally with neither is a recollection, not a verdict.
- **A summarized claim names its raws.** Where a claim quotes a median, a spread, or a tally, the instrument rows behind it are banked beside the summary—or the summary declares, in its own file, that the raws stayed local, on what machine, on what date. A gitignored working dir isn't a bank: no clone reaches a reading in it.

**The precedent is our own, and it stopped.** T3-WGATE banked `2026-07-tranche-3/evidence/T3-WGATE-shots/`—two live-edge frames plus `wgate-live-drive.mjs`, the 5,744-byte driver that took them—and `T3-WGATE-ship.md:117` cites both PNGs by path with the claim they carry. (Those two are full viewports at 255,195 B and 259,291 B, over the per-image cap and grandfathered at those exact byte pins in `scripts/check-evidence-policy.mjs`; what the precedent supplies is the cite and the driver riding along, not the bytes.) Every tranche since has asserted more and banked less.

**Enforcement.** Text-only at T9-W0—the wave that writes the law. The script arm is T9-W5's: the gate resolves every capture in a wave's evidence dir against the paths its reports cite, and fails on an uncited capture, or on a verdict table carrying neither a frame column nor an in-row absence.
