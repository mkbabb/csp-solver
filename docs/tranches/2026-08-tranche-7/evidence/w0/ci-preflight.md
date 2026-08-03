# W0 preflight — the standing CI red, re-read from the field (2026-08-03)

The formation banked a "deterministic linux golden re-mint" mechanism for the e2e reds at
`afc72ba1`/`ce7a06f9`. The field refutes it. Three runs, three rosters:

| run | head | delta | e2e verdict | failed rows |
|---|---|---|---|---|
| 30780222492 | `ce7a06f9` | source (T6.2 CH-65) | RED | golden reds + a11y-webkit |
| 30780989714 | `1cc8f4e4` | source | **GREEN** | — |
| 30781866393 | `afc72ba1` | docs-only (T6.2 seals) | RED | `a11y.spec.ts:490` [webkit] ×1; golden job 3→4 `toHaveScreenshot` reds |
| 30786643192 | `6a180b35` | docs-only (T7 formation) | RED | `futoshiki.spec.ts:131` [webkit] solve timeout; `multiplayer.spec.ts:498` [webkit] 4-page. **321 passed** — goldens green, a11y green |

## The verdict

- The `afc72ba1` reds (a11y:490 + the golden set) greened at `6a180b35` under a **docs-only
  delta** — no change to any asserted surface. A red that self-clears with no surface change
  is not a baseline mismatch; **no golden re-mint happens** (the goldens are green at head,
  and re-baselining on that evidence is the exact act the golden discipline forbids).
- Every red across the three failing runs sits inside the named flake classes: the golden
  reds are CH-62-adjacent bake surfaces; `a11y.spec.ts:490` and `futoshiki.spec.ts:131` are
  the two rows DISPOSITIONS names as sitting inside both CH-63 and CH-64;
  `multiplayer.spec.ts:498` is one of the three ≥3-page webkit rows W4 orders fenced before
  any addition.
- **CH-64's banked trigger has FIRED**: a third burst — ≥2 reds in one settled-head run
  (`afc72ba1`: 1 a11y + 3–4 golden), each green on the next runner pass (`6a180b35`) with no
  change to its surface. Per the bank: → runner-rig forensics, homed in W3's execution.

## Consequence for the tranche

W0 proceeds with no golden act. W3 inherits: (a) the third-burst forensics trigger, fired,
with this file as the evidence; (b) the two contention rows red at head are its own §"two
open CH-63 discipline rows" one surface over — `a11y:490`/`futoshiki:131` are already in its
scope; (c) W4's ≥3-page fencing order is corroborated by `multiplayer.spec.ts:498` flaking at
head. The resume block's re-mint mechanism is struck; this record supersedes it.
