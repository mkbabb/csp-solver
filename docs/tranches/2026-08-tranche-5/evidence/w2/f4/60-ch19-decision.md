# CH-19 — re-opened by its own trigger, proof re-run, DECIDED

**Trigger.** The hold's re-entry condition is "the tranche touches `index.css`". T5-W2 2.3's
token kills touch it — 17 `@theme` tokens die, 34 lines leave the file. So the row re-opens, and
the wave's law says the decision must land **on the hold's own criterion**, not on a fresh
proposal.

**The criterion, verbatim from where it was set** (`docs/tranches/2026-07-tranche-3/appendices/
C-deferred-disposition.md` §4, the T3 ballot Q4 disposition): the extraction was dropped on
"net-zero runtime benefit against one new silent-404 footgun class, under the 'long dirs'
threshold", and "the hold re-opens on the same trigger only — no new work either way".

---

## 1 · A finding, first: the banked proof was not on disk

C-deferred-disposition §4 states "the proof is banked, not discarded — the byte-identity bundle
(all four shas confirmed, including the distinct pre-fix `42c6c83f…`) and the built font-URL
smoke guard … live in the evidence dir. If the trigger re-fires, the work is done, not
re-derived."

It is not. `docs/tranches/2026-07-tranche-3/evidence/pass2/` carries `P2-L8.md` — the *record* of
the proof — and no `p6-accepted/` directory: no partials, no `assert-font-urls.mjs`, no shas as
artifacts. What survived is the method's description, which is enough to re-derive from and not
enough to re-run. **Lessons rule 8 (the record can't verify the record), demonstrated on the row
that promised otherwise.** This lane therefore re-derived the whole proof on this tree, and banks
the RECIPE (§4) rather than the partials, so the next trigger inherits something executable.

## 2 · The proof, re-run on this tree

Five builds, one tree state each, `shasum -a256` of the emitted `dist/assets/index-*.css`:

| arm | what it is | sha256 | bytes |
|---|---|---|---|
| **A** | monolith, F4 entry (pre-kill) | `bbfd1940959010eae1c3a52f068fda5640db79f46ad666895a69200095046738` | 75,960 |
| **B** | monolith, post-kill — the wave's actual tree | `7454d05740d0e534714ebc8028ce663e4488303721ef9227050182616535a2bd` | 75,199 |
| **C** | **SPLIT** — `index.css` a 5-line manifest + `css/{theme,utilities,print}.css` | `7454d05740d0e534714ebc8028ce663e4488303721ef9227050182616535a2bd` | 75,199 |
| **D** | split with the font `url()` **un-rebased** (the negative control) | `0012b920d988a14c8f00dc6037a4d5f4b2c0509468500d751756666d8d237e0b` | 75,174 |
| **E** | monolith, restored after the experiment | `7454d05740d0e534714ebc8028ce663e4488303721ef9227050182616535a2bd` | 75,199 |

**B === C === E, byte for byte, same Vite content hash `index-B5NvBXTLNcvj.css`.** The
`@layer`-partial extraction emits an identical stylesheet. The T3 finding reproduces exactly:
there is nothing to gain at runtime and nothing to lose.

**A → B is the token kill, and it is exactly the token kill.** Custom properties emitted in the
bundle: 162 → 148. Gone: `--color-{card,popover}-foreground · primary · primary-foreground ·
secondary · secondary-foreground · muted · accent-foreground · destructive ·
destructive-foreground · input · easy`, `--ink-press-firm`, `--radius`. **Appeared: none.**
−761 bytes. (`--color-medium`, `--color-hard` and `--font-serif` never reached the bundle at all
— Tailwind had already shaken them, which is its own evidence they were dead.)

**The footgun class is live, and D is the proof.** Split without rebasing `url("./fonts/…")` to
`url("../fonts/…")` and the build stays **GREEN** while emitting `url(./css/fonts/*.woff2)`
literals and **zero `.woff2` assets into `dist/`**. Three faces, silently 404, no error anywhere.
That is one new failure mode the monolith structurally cannot have, bought for a stylesheet that
is byte-identical either way.

## 3 · The decision — DROP, again, and this time on a shrinking file

| criterion arm | reading on this tree |
|---|---|
| runtime benefit | **net zero**, re-proven — B === C byte for byte |
| new failure class | **live**, re-proven — D builds green and ships three silent 404s |
| the size threshold ("should the file later grow past it") | **the file SHRANK**: 842 → **808 lines**. 2.3 took 34 out of it. The trigger for re-entry-on-size moved further away, not closer |

Two of three arms read exactly as they did at T3; the third moved in the direction that argues
for the hold. **DROP. `index.css` stays monolithic.** No partials directory, no `@import`
manifest, no font-URL guard wired into `build` — because the guard is net-new machinery whose
only purpose is to police a footgun this decision declines to introduce.

This is a decision, not a fifth hold: the row is answered on its own criterion with the evidence
re-derived, and it re-opens on the same trigger only.

## 4 · The recipe, banked — so the next trigger runs it instead of re-deriving it

Deterministic on the exit tree (`src/assets/index.css`, 808 lines). Structural boundaries are
`@import` head / everything through the second `@layer base` close / utilities + the two motion
and pointer media blocks / `@media print`:

```
head   = lines   1..2     @import "tailwindcss"; @import "./typography.css";
theme  = lines   3..456   @custom-variant · @font-face ×3 · @layer base · @theme · .dark · @layer base
utils  = lines 457..767   @layer utilities · prefers-reduced-motion · pointer: coarse
print  = lines 768..808   @media print
```

Write `theme`/`utils`/`print` to `src/assets/css/*.css`, rewrite `url("./fonts/` →
`url("../fonts/` **in `theme.css` only**, and leave `index.css` as the two original `@import`s
plus three more. Then `npm run build` and `shasum -a256 dist/assets/index-*.css`: it must equal
the monolith's. Skip the rebase to reproduce arm D.

`@layer` ordering is preserved because the manifest's `@import` order is the file's original
order; no partial may be reordered without re-running the whole proof.

## 5 · What this row owes the lead

The T3 disposition's promise that the proof was banked is **false on disk**, and the LEDGER's
CH-19 row cites it as the method of record. Either the citation restamps to this file (which now
carries a runnable recipe), or the T3 appendix's §4 claim is corrected. The lane recommends the
first: this file is the durable home now.
