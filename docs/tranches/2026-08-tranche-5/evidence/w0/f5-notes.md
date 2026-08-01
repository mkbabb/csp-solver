# T5-W0 · F5 — row 0.5 + `ofl-licenses-figures`

Lane: Opus. Head at execution `e961bdb7`. Docs, records, and the one gate script — no source moved.

Charter: the `csp-solver` install pin, the precepts-link leak on that same README, and the OFL/license
figure. Every figure below re-derives from the artifact; the command that derives it sits beside it.

## Derivations

| Figure | Command | Result |
|---|---|---|
| Published crate version | `cargo search csp-solver --limit 1` | `csp-solver = "0.6.0"` — 0.6.0 is live on crates.io |
| Source crate version | `grep '^version' csp-solver/Cargo.toml` | `0.6.0` (`:3`) |
| Changelog corroboration | `csp-solver/CHANGELOG.md:18` | `## 0.6.0 — 2026-07-15`, "the first published version where source and registry agree" |
| woff2 subsets on disk | `ls web/frontend/src/assets/fonts/*.woff2` | 3 files: `firacode-subset`, `fraunces-subset`, `patrickhand-subset` |
| Subset bytes | `wc -c web/frontend/src/assets/fonts/*.woff2` | 3,624 + 13,788 + 4,312 = **21,724 B** |
| OFL texts on disk | `ls web/frontend/src/assets/fonts/OFL-*.txt` | 3 files, one per family — pairing is total, no orphan either way |
| OFL text shape | `wc -l OFL-*.txt` · `shasum -a 256` | 93 lines each; FiraCode `1d41e100…`, Fraunces `bdf4c228…`, PatrickHand `377f4f9c…` |
| Reserved Font Name | `grep -n "Reserved Font Name" OFL-*.txt` | one hit per file, all at `:33` — the OFL §Definitions boilerplate. No copyright line carries a `with Reserved Font Name` clause, so the manifest's "None of the three declares a Reserved Font Name" holds |
| Leak target | `git ls-files -s docs/precepts` · `.gitmodules` | mode `160000`, submodule of `git@github.com:mkbabb/precepts.git` at `8781ebb0` |

The 17,708 B figure is arithmetically the pre-`387cceea` tree: 3,624 + 9,772 + 4,312. Fraunces went
9,772 → 13,788 at that subset re-cut and neither site followed.

## Cures

| # | Site | Was | Is |
|---|---|---|---|
| a | `csp-solver/README.md:35` | `csp-solver = "0.5"` | `csp-solver = "0.6"` |
| b | `csp-solver/README.md:264-266` | a sentence linking "canonical README shape" at `../docs/precepts/canonical-readme-shape.md` | the sentence is cut; the `../docs/` pointer above it stays |
| c | `README.md:62` | `17,708 B total` | `21,724 B total` |
| c | `web/frontend/src/assets/fonts/LICENSES.md:3` | `17,708 B total` | `21,724 B total` |
| c | `web/frontend/src/assets/fonts/LICENSES.md:11` | Fraunces `9,772` | Fraunces `13,788` |

(a) The pin contradicted its own file eleven lines up — `:23-24` already sold 0.6.0 as the five-family
release while the snippet handed the consumer a `^0.5` range resolving beneath it.

(b) Cut, not sanitized. The target is a submodule of a different repo's process canon
(`canonical-readme-shape.md:3,75` carries "G.W5 sub-wave D close" and paths into `muster/docs/tranches/`),
and relative links out of a crate README resolve against the repository at both renders — a crates.io
reader following it lands in campaign substrate. The shape contract buys a consumer nothing, so the
cheapest cure is the right one. Nothing else on any consumer surface points into `docs/precepts/`.

(c) `LICENSES.md` is the third site of the same stale figure and the one that matters most: its byte
column sits inside a license-compliance statement ("a Modified Version under the OFL … redistributed
under the same license per clause 5"). R1's lens declared a 12-file consumer corpus and couldn't see it;
R3 GAP-5 found it. Markdown-table alignment re-flowed for the wider column — `prettier --check` on the
file passes (the frontend `lint` script covers `src/`, and this file lives under it).

## Gate

Both rows ride `scripts/check-doc-truth.mjs` and both were extended before any prose moved, so each
went born-RED on its own new clause:

- `ofl-licenses-figures` now asserts every site that states the font figures — the README paragraph
  **and** `LICENSES.md`, including the per-family byte column, each against `wc -c` of the file it names.
- `install-pin-0.5` gains the leak clause: no file in the doc corpus (root README, `docs/*.md`, the four
  package READMEs) may carry a markdown link into `docs/precepts/`. Pin and leak are one wave row, so
  they stay one gate row — the script's ten-row inventory and `gates.json`'s `redRowsAtHead` are
  untouched. The header's derivation notes record both clauses, since neither row id names them.

| Run | File | Outcome |
|---|---|---|
| RED at HEAD | `f5-rows-RED-at-HEAD.txt` | `ofl-licenses-figures` RED at 3 sites (`README.md:62`, `LICENSES.md:3`, `LICENSES.md:11`); `install-pin-0.5` RED at 2 (`csp-solver/README.md:35`, `:266`) |
| GREEN after | `f5-rows-GREEN-after.txt` | both GREEN; script exits 1 on the other eight rows, which belong to the other W0 lanes |

`node --check scripts/check-doc-truth.mjs` clean.

## Handed up

- **W6 row 6.1 targets a read-only submodule.** `T5-W6-process.md:9` places `working-precepts.md` at
  `docs/precepts/`, which is a submodule of `mkbabb/precepts` (`160000`, `8781ebb0`). A T5 file written
  there either fails or lands in another repo. The precepts file wants a tracked home — `docs/` proper.
- **The stale-figure class has a third-site tail.** Both R1 sweeps missed `LICENSES.md` because the lens
  declared its corpus and the file wasn't in it. A figure fixed at one site and left at another is the
  same defect twice; the extended row now binds every site that states it.
- `csp-solver/CHANGELOG.md:16` cites `csp-solver = "0.2"` in the morph-excision note. Historical record
  of what morph consumed at excision, not an install snippet — left alone.
- Untouched by this lane: the eight other doc-truth rows, every sealed tranche record, all source.
