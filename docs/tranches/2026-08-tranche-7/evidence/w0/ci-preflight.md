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

---

## CORRECTION — 2026-08-03, T7-W3 (appended, never silently edited)

The table and the verdict above miscount the reds. Re-read from the field with
`gh run view --log`, banked whole in `evidence/w3/burst-forensics.md` §1:

- **`30781866393` (`afc72ba1`) carried exactly ONE test red, not four or five.** Step 12 reports
  `1 failed · 2 skipped · 322 passed (13.3m)`. Row 10's "golden job 3→4 `toHaveScreenshot` reds"
  are not reds of the estate at all — they are the **self-delta canary arms** (`ci.yml`'s
  `for arm in black invert` loop), which inject a regression and **fail by design in every run**.
  The fully green `30780989714` carries the same `3 failed` / `4 failed` pair, and the log says
  so in words: `ok — the black arm red the compare, as it must`. On a default-suite red the
  runner *skips* steps 13/17/18, so the canary is the only golden output left in the log and a
  top-down read meets it first. That is how the miscount happened, and it is now a named trap.
- **Row 8 (`30780222492`) is wrong twice over.** Its suite PASSED (`323 passed`); the job died at
  step 15, the golden estate gate, on a deterministic source defect —
  `orphan: cell-light is asserted by no spec` — cured by source commit `1cc8f4e4`. No golden
  pixel red, no a11y red, and no flake.
- **Consequence for the trigger.** Against CH-64's own bar (≥2 genuine test reds in one
  settled-head run) `afc72ba1` does NOT qualify: burst 1 `30765365438` has 3, burst 2
  `30770223565` has 1, and the qualifying third burst is **`30786643192` (2 reds)**. The
  third-burst trigger therefore FIRED ON A MISCOUNTED READ.
- **The class it pointed at is real, and the trigger's firing stands.** The forensics executed on
  its order reads seven runs and carries the class on evidence the preflight never had: 10/10
  reds `[webkit]` against 1,131 executed chromium rows (null-model P = 8.3 × 10⁻⁴), 7 of 10
  deadline-shaped, `futoshiki.spec.ts:131` the head row at 3 of 7 runs — **the wandering webkit
  deadline family**, engine-localized, contention-amplified, discipline-seeded. `a11y:490` is one
  of the three read-discipline defects in that ten, cured in W3 by a polled census.

This block corrects the arithmetic and nothing else: W0's acts — no golden re-mint, the resume
block's mechanism struck — stand on the un-miscounted half of the evidence, which the forensics
confirms. `LEDGER.md`'s CH-64 row is restated on the same reading, in the same wave.
