> **SPENT 2026-09-17, by the chair seal (lane S2).** The `detail` string at :136 names the main-chunk row now; `node scripts/tdz-probe.mjs --self-test` is exit 0 (0 cycle edges, negative control RED as required) and the pinned `prettier --check` passes.

> **NOT LANDED 2026-09-17** — `web/frontend/scripts/tdz-probe.mjs` is outside the Restamp lane's fence. The `detail` string at :136 still names the retired eager row; the literal replacement in this file stands.

# FA5-2 → `tdz-probe.mjs:136` — the same retired name, one line outside a comment fence

Handoff 6A-3 §3's COMMENT half is landed: the arm-(c) block at `:123-125` now reads "the
MAIN-CHUNK row's ride" instead of "the eager row's main-chunk ride", and
`node scripts/tdz-probe.mjs --self-test` is **exit 0** — 0 cycle edges, negative control RED as
required (`../fold/FA5-tdz-probe-selftest.txt`).

The second half of that handoff is **not** a comment, and FA5's fence on this file is
`comments only`, so it stays here rather than being reached into.

## The seam

`web/frontend/scripts/tdz-probe.mjs:136` — the violation's `detail` string still names the
retired slot. Replace, literally:

```js
        detail: `${statics.length} static spec imports; at most the eager row may hold one`,
```

with:

```js
        detail: `${statics.length} static spec imports; at most the main-chunk row may hold one`,
```

## Why it is safe, and why it still wants doing

Safe: `--self-test` asserts on `v.arm` (`caught.some((v) => v.arm === "game→table")`), never on
`v.detail`, so the string is a message and nothing reads it but a human. Nothing else in the
file or the gates greps it.

Wanted: `GameCard.eager` is gone — folded into `mount`, whose SHAPE (a spec, or a thunk that
fetches one) is the chunking claim. Verified at the tree: `src/games/cards.ts` declares `mount`
on all five rows, `eager` survives only in prose explaining its own retirement. A diagnostic
that fires once a year and names a slot that has not existed since T9-W6 is a message its reader
cannot act on, which is the doc-truth class at its smallest grain.
