# PROPOSED — `check-copy-register.mjs`, the third rendered-copy surface

Not applied. This lane is READ-ONLY on product files; this is the arm a synthesizer would land
with the §11 cure, written here so the number that motivates it does not have to be re-measured.

## The hole, measured

`rendered()` (`web/frontend/scripts/check-copy-register.mjs:287-333`) reads four corpora:
template text nodes, `RENDERED_ATTRS`, `COPY_KEYS`, and `NARRATION_CALLS` (`useLiveRegion`).

1. **A computed copy string in `<script setup>` is in none of them.** All five of §11's strings
   are script-side: `stateLine`'s template literal, the `"you"` / `` `${n} seconds ago` ``
   ternary, `` `and ${n} more` ``.
2. **A BOUND rendered attribute is excluded by construction.** The attribute regex is
   ``new RegExp(`(?<![:\\w-])${attr}="([^"]*)"`, "g")`` (`:308-310`) — the lookbehind rejects a
   leading `:`, so `:aria-label="stateLine"` is invisible. Measured across `web/frontend/src`
   on 2026-09-18:

   | attribute | bound (`:attr=`) | literal (`attr=`) |
   |---|---|---|
   | `aria-label` | **18** | 22 |
   | `title` | 0 | 20 |
   | `alt` | 0 | 3 |

   The jargon arm reads **22 of the estate's 40 accessible names — 55%**.

This is the same class the header already names at `:233-240` for `useLiveRegion`: *"a narration
source is neither a template text node nor an object-literal copy key, so the strings a screen
reader is about to SPEAK fell outside the census the moment they became spoken-only."* Bound
accessible names are the next member of it.

## The arm

`COPY_SOURCES` — the exact-match sibling of `NARRATION_CALLS`. A declared list of identifiers
whose initializer is copy; every string literal inside that initializer is read as rendered copy.

```js
/** Identifiers whose VALUE is copy — the computed half of the rendered surface. Declared, not
 *  inferred: a lexicon swept over every script literal reds on the technique ids that T8-W6
 *  kept on purpose (header, `THE LEXICON IS CURATED`). One entry per copy source; a name that
 *  leaves the tree REDS, the way admissions already close both ways. */
const COPY_SOURCES = ["stateLine", "qualifier", "overflow"];
```

Read them the way `NARRATION_CALLS` are read — all three quote grammars, from the initializer's
span — and add the STALE arm the admissions already have: a declared source with no definition on
the tree is a finding, not a silent no-op.

## The second row, estate-wide and not §11's to land

A bound `:aria-label` (or `:title`, `:alt`) whose expression is not a declared copy source should
RED. Today it is simply unseen, which is how an accessible name can ship past a gate that exists
to read accessible names. Eighteen sites, so it lands with an admissions block, not a sweep.

## What §11's own copy reads today, by hand

`no other players` · `1 other player` · `N other players` · `you` · `N seconds ago` ·
`and N more` — no em or en dash; no hit against the 25-entry lexicon (`:90-119`). M16-clean on
both clauses, checked by hand because the gate cannot check it.
