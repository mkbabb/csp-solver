# T5-W1 · Row 1.6 — the wordmark hoist, the 5/5 widening, and the retries policy

Source: B1 NARROWED (`r2/verify-gate-criticals.md` §3). Gate contract:
`gates.json W1.wordmarkHoist` — `canary: forced-blank-both-arms`,
`clipAssertionPlatforms: [darwin, linux]`.

Evidence: `wordmark-canary-RED.txt`, `wordmark-inked-GREEN.txt`, `themebake-widening-RED.txt`,
`wordmark-retries-fragment-merge-check.txt`, `wordmark-canary/` (10 pose bitmaps + the harness).

---

## 1 · What was actually wrong

r2 narrowed A-file's headline: the linux `test.skip` is conditional on an empty bake, so a
recurrence of the *original* opsz overrun — an inked bake whose ink reaches the final column —
still reds on linux. That is true and it is why the verdict was NARROWED.

What survived the narrowing is the whole of this row. `test.skip()` **aborts**. It sat at
`:151`, above `:156` and `:157-165`, inside `if (r.top < 0)`. So on the one platform CI runs,
an empty bake stopped the row before either assertion executed — including the edge-clip
verdict the row exists for. The author's own ablation recorded the consequence in the commit
message: *"linux 5 skipped, 1 passed, exit 0."*

Re-run here on a reconstructed forced blank, the shipped spec reproduced that string exactly
(`wordmark-canary-RED.txt`, arm A0): **5 skipped, 1 passed, exit 0**, 18.4 s.

Two further holes, both from r2 §3(c) and §"retries":

- the residual vacuity guard in `theme-bake-freshness` covered **1 of 5 labels** — its
  `loadBaked` navigated `./?size=3&difficulty=EASY`, no `game=`, i.e. the default board — while
  the runs that motivated the yield blanked `killer`, `futoshiki`, `thermo` and `kenken`;
- `wordmark-webkit` carried `retries: 1` with no `failOnFlakyTests` anywhere in the estate, and
  run 30690204551 had already cashed it: `sudoku` red on attempt 1, green on attempt 2, lane
  exit 0.

## 2 · The hoist, and why the yield could not merely move

The two terms are now one verdict, `inkBoxViolations(r)`, asserted once, ahead of every branch:

```
r.top < 0  →  ["no-ink"]
otherwise  →  the four edges that touch, [] when none do
```

Fusing them is what makes the hoist real. "Ink sits inside its bitmap" says nothing unless
there is ink — a blank clears all four edges *vacuously*, which is why `:113`'s own note put a
vacuity guard in front in the first place. As one verdict there is a single thing to evaluate,
it is evaluated before anything can abort the row, and it is the same thing on every platform.

**The linux yield is therefore gone, not relocated.** `test.skip()` aborts, so a yield that
still shielded a blank would re-trap the very assertion the hoist frees; the two are mutually
exclusive, and the gate contract names both platforms. Three things make the removal cheap
rather than brave:

1. **It bought no green.** The yield's stated cover was theme-bake-freshness holding "the logo
   bake has ink at all" on linux in both engines at `retries: 0`. Widened to 5/5 (§3), a blank
   on linux now reds theme-bake whatever this spec does. Skipping here never saved a lane; it
   only discarded the clip verdict.
2. **The evidence half is kept.** `attachBakeEvidence` still fires on `r.top < 0`, before the
   assertion, unconditionally. A blank still ships its own pose bitmap, its href, its intrinsic
   and the font state — it just ships them with a red instead of with a silence.
3. **The cure that holds is the settle→poll**, which 71456713 landed in the same commit and
   which is untouched. What does not follow from an unreproducible engine artefact is a silent
   lane.

**This revokes a T4-era disposition and wants the team lead's ratification.** The risk is
stated plainly: if the runner's blank recurs, `wordmark-webkit` reds instead of skipping. Two
things bound it — the blank has not recurred since the settle→poll (CI true green at
`71456713`, run 30691714480), and r2 flagged the attribution the yield rested on as UNKNOWN
(theme-bake should have red in those same runs at `retries: 0`; no record in this tree says it
did). If the owner wants the yield back it must return as an explicit quarantine against a
named run id, never as a silent skip.

## 3 · The 1/5 → 5/5 widening

`theme-bake-freshness.spec.ts` is parameterised over the same five labels
`wordmark-integrity` asserts. 4 rows → 20 (5 labels × 2 directions × 2 engines), `retries: 0`
in both engines, unchanged otherwise.

Born RED (`themebake-widening-RED.txt`): under the forced blank, **20 failed, exit 1**, and all
five labels are named in the failure messages. Before the widening the same ablation could red
at most 4 rows and could name only `sudoku`.

Cost, measured not assumed: the throttle config goes **23 tests → 39**, 27.0 s wall, 9 workers,
darwin, against a built dist. No CI change buys it — it rides the existing built-dist step.

## 4 · The retries policy

**The law: a retried pass never greens a lane.** `failOnFlakyTests: true` lands in
`playwright-throttle.config.ts` — the only config in the estate that grants a retry
(`playwright.config.ts:33` and `playwright-golden.config.ts:77` are both 0, so the switch has
nothing to act on there). The row's first branch, taken as written.

| class | subject | ruling | why |
|---|---|---|---|
| **1** | `wordmark-webkit` | **retries 1 → 0** | The grant was written for the empty pose blob, and 71456713 measured that a retry cannot clear it — the blob is terminal once the box settles, and 3 of 4 rows failed attempt 2. What the retry *could* reach was the deterministic half, where it converts a genuine one-shot edge-clip red into the flaky-green run 30690204551 recorded. A retried bake read is a bake read that lies — the argument the two `filter-census` projects beside it already carry. It also closes the one interaction r2 could not determine without executing (attempt 1 failing on the clip, attempt 2 hitting a blank and skipping): with the yield gone and retries at 0, no such sequence exists. |
| **2** | `throttled-void` | **retries 1 kept, no longer green-buying** | The probe races a deliberate 30 KB/s + 500 ms budget on a shared runner; one host stall is not a product defect, and the second attempt is a real instrument. Under `failOnFlakyTests` it buys a second *observation* rather than a pass. |
| **3** | the **run-attempt** flake | **named, not gated here** | Run 30711689550 attempt 1 red `[webkit] visual-regression.spec.ts:235` on `grid.layerCount 0` vs `>= 2`, on a **docs-only** commit; the same-SHA rerun was green. That spec lives under `playwright.config.ts` at `retries: 0`, so no Playwright retry was involved and `failOnFlakyTests` would not have fired — the green came from a human re-running the workflow, one level above the test runner. |

Class 3 is the sharper one and the policy would be dishonest without it. A policy that speaks
only about in-runner retries silently implies this class is covered; it is not, and a
re-run-until-green habit launders exactly the reds these gates exist to raise. Its disposition
is a wave row, not a config key: `grid.layerCount` reading 0 on a docs-only tree is an
unattributed WebKit raster race, it belongs in the chronic ledger with its run id, and it wants
attribution rather than a rerun. Nothing in this row claims to gate it.

**Enforced, not written down.** `web/frontend/scripts/check-pw-retries.mjs` (npm
`test:e2e:retries`, CI fragment `fragments/wordmark-retries.yml`) reads the three configs
*through their own `defineConfig` export* — not by regex, so a comment cannot satisfy it and a
reformat cannot break it — and gates four things: the law; a closed census where every non-zero
retry is a named grant carrying its class and reason (ungranted reds, drifted reds, fossil
reds); the revoked `wordmark-webkit` pin; and `failOnFlakyTests: false` never being declared by
hand. `--self-test` rides every invocation: each check is re-run against a census built to
violate it and against a healthy one, so a dead check and an always-red check both surface.

## 5 · Platform note — what ran where

This host is **darwin**. **No linux run is claimed**; CI at the seal is the linux proof. The
linux code path was reached three ways, two kept and one rejected in the open:

- **kept** — arm A0 is the spec at HEAD with one token changed, `process.platform` → `"linux"`
  at `:152`, verified byte-identical to HEAD before the sed. The full diff is in
  `wordmark-canary-RED.txt`.
- **rejected** — a runtime pin. Preloading a module that redefines `process.platform` does
  reach Playwright's workers (measured: `WORKER_PLATFORM=linux` against a darwin control), but
  Playwright resolves its browser binaries off the same value, so every row then dies at
  `browserType.launch: Executable doesn't exist at …/ms-playwright/webkit-2311/pw_run.sh`. A
  pin that breaks the engine cannot test the engine.
- **kept** — arm B0's "linux variant" of the *cured* spec is the cured spec: the same sed has
  nothing to bite on (`diff` = 0 bytes) because the predicate is gone. `grep -nE
  'process\.platform|test\.skip\(|test\.fixme|test\.fail'` over the file returns one hit, and
  it is the header docstring's prose account of the removal.

## 6 · The ledger

| arm | spec | ablation | platform | result |
|---|---|---|---|---|
| A1 | HEAD, real config | blank | darwin | 5 failed 1 passed, exit 1, 37.1 s — dies at the *vacuity* expect, clip never reached |
| **A0** | HEAD, linux forced | blank | linux branch | **5 skipped 1 passed, exit 0**, 18.4 s — the defect |
| B1 | cured, real config | blank | darwin | 5 failed 1 passed, exit 1, 19.8 s — dies at the *hoisted clip verdict* |
| B0 | cured, linux variant (byte-identical) | blank | linux branch | 5 failed 1 passed, exit 1, 19.3 s |
| B2 | cured, real config | inked | darwin | **6 passed, exit 0**, 3.8 s |
| C1 | theme-bake widened | blank | both engines | 20 failed, exit 1, all five labels named |
| C2 | full throttle config | inked | darwin | **39 passed, exit 0**, 27.0 s |

Ink boxes the green arm measured, margins re-derived at citation
(`top`, `(H-1)-bot`, `left`, `(W-1)-right`):

| label | intrinsic | ink box | margins t/b/l/r |
|---|---|---|---|
| sudoku | 381×112 | 16 / 92 / 10 / 370 | 16 / 19 / 10 / 10 |
| futoshiki | 472×112 | 16 / 93 / 10 / 461 | 16 / 18 / 10 / 10 |
| thermo | 384×112 | 16 / 92 / 7 / 371 | 16 / 19 / 7 / 12 |
| killer | 287×112 | 16 / 91 / 9 / 277 | 16 / 20 / 9 / 9 |
| kenken | 381×112 | 16 / 92 / 9 / 372 | 16 / 19 / 9 / 8 |

The blank arm's blobs measure 734–1096 B at those same intrinsics against 71456713's recorded
272–313 B — the four intrinsics that commit named match to the pixel; the byte counts differ
because WebKit's canvas encoder writes these rather than the app's bake path.

Row 1.3's own gate was run over the result: `check-evidence-policy.mjs` → **PASS**, 300 png /
29,952,740 B across 27 wave buckets, this row's 10 bitmaps totalling 50,713 B with the largest
at 11,375 B. The wave ate its own cooking (the π/DELTA note).

## 7 · Files

| file | change |
|---|---|
| `web/frontend/e2e/wordmark-integrity.spec.ts` | verdict fused + hoisted; `test.skip` removed; evidence attach unconditional on a blank; header records the disposition |
| `web/frontend/e2e/theme-bake-freshness.spec.ts` | parameterised over all five labels; `loadBaked(page, game)` |
| `web/frontend/playwright-throttle.config.ts` | `failOnFlakyTests: true`; `wordmark-webkit` retries 1 → 0; the three flake classes documented at the head |
| `web/frontend/scripts/check-pw-retries.mjs` | new — the policy's enforcement, four checks + a canary each |
| `web/frontend/package.json` | `test:e2e:retries` |
| `docs/…/evidence/w1/fragments/wordmark-retries.yml` | CI fragment for the integrator lane |

## 8 · Open for the team lead

1. **Ratify the yield's revocation** (§2). It is a T4-era disposition; the lane's argument is
   above and the risk is bounded, but the call is not a lane agent's.
2. **Book class 3** (§4) into the chronic ledger with run id 30711689550 — it needs
   attribution, and no config key reaches it.
3. `check-pw-retries.mjs` and row 1.10's `check-pw-projects.mjs` both parse the same three
   configs. They were kept separate to avoid two lanes editing one file mid-wave; folding them
   is a W-GATE candidate, not a wave-time one.
