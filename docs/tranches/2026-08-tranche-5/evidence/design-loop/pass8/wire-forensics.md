# T5-W4 pass 8 — the wire-format forensics (the "race" that wasn't)

**Scope.** The pass-7 seal's pinned CI run on `eabc72e6` (30746739106) closed 17
success + e2e fail: `affordances.spec.ts:155`/`:271` red on BOTH engines
(`Expected: 72, Received: 35 · 25 · 24 · 35`), plus one `futoshiki.spec.ts:45`
webkit timeout. The four affordances reds were chased as a `?board=`-vs-auto-deal
race — the class W2's forensics measured at 127–260ms — and are nothing of the
kind. This file is the disproof, the actual defect, the cure, and two corrections
to the standing record.

## 1. The disproof — a replaceState ledger, caught red

Scratch probe (document-start `history.replaceState` wrap; script banked in the
session scratchpad as `board-race-probe.mjs`), against the `eabc72e6` dist on an
own-band port. First red, verbatim:

```
run 1 [chromium] RED — glyphs 35 · notice true
  LEDGER:
    {"t":0,"act":"parse-start","board":"My4wMDAwMDAw…111","search":"?board=My4wMDAwMDAwMDA2NzIxOTUzNDgxOTgzNDI1Njc4NTk3NjE0MjM0M"}
    {"t":39,"act":"replaceState","before":"My4wMDAwMDAw…111","after":"ABSENT","url":"http://localhost:4241/"}
    {"t":42,"act":"replaceState","before":"ABSENT","after":"ABSENT","url":"?size=3&difficulty=MEDIUM"}
```

Read: the param is INTACT at the strip (t=39, `before` carries the full 111-char
value) and the strip is followed 3ms later by the same machine's setup
`syncToUrl` with a ROLLED difficulty — the `source: "fresh"` path. That is
`resolveInitialState()` refusing the decode and stripping at the decode — the
T5-W2 seal-fix (`w2/verify/permalink-reject-strips.txt`) doing precisely what it
was sealed to do, window 0ms. No race exists; the strip and the resolve are the
same synchronous act. The corrupt-link notice in every failure screenshot
("this shared link couldn't be read — a fresh 9×9 …") said so from the start.

## 2. The defect — the harden re-rolled the dead v0 wire

`CODEC_VERSION = 1` (persistence.ts:134); the wire is
`b64url(\x01 + "<size>.<cells>")` and a payload not opening with the byte fails
closed (:222) — the W2 ratchet, born when the absent-tag-means-v0 arm died. The
pass-8 harden's `CONFLICT_BOARD` was built as `b64url('3.' + cells)` — untagged,
byte-for-byte the REFUSAL form `permalink.spec.ts` keeps as `encodeUntagged` to
assert the fail-closed arm. Every load was therefore refused, stripped, and dealt
over, deterministically, on every host. The four CI counts (35/25/24/35) are
rolled-tier deal luck plus draw-in timing, nothing more.

DOM-shape probe (same dist, 6s settle), the whole story in two lines:

```
untagged-v0 { sudokuCells: 81, glyphTotal: 25, owners: [["grid board-cells", 25]], notice: true,  search: "?size=3&difficulty=HARD" }
tagged-v1   { sudokuCells: 81, glyphTotal: 72, owners: [["grid board-cells", 72]], notice: false, search: "?board=ATMuMDAwMDAwMDAw…" }
```

One board surface; the tagged twin restores 72/72 with the param standing.

## 3. The class — four hand-rolled copies, two forked wrong

The wire grammar existed in FOUR per-spec copies: `permalink.spec.ts` (tagged,
correct), `visual-golden.spec.ts` (tagged, correct — after ITS untagged era,
documented in its own header at W2), `share-truth.spec.ts` (UNTAGGED — its
"shared board" fixtures were silently refused and every share shared a fresh
deal; green only because its assertions read the share act's own write-back),
and the pass-8 harden (UNTAGGED, this failure). The class was documented at W2
in two spec headers and still spawned twice more. Cure: **`e2e/wire.ts`** — one
encoder module, all four specs import it; `encodeUntagged` survives as the
refusal fixture only. Net −60 lines.

## 4. Verification (darwin, dist `index-ZYnCGMYLIhQw.js` of `eabc72e6` + this cure)

- `affordances + permalink + share-truth`, both engines: **45/45**.
- The two cured rows, `--repeat-each=4` both engines UNDER three concurrent
  webkit suite runs — the exact contention that reproduced the defect 5/12
  pre-cure: **16/16**.
- Goldens **4/4** (PINNED_BOARD bytes unchanged — same tagged grammar, same
  givens); units **448/448**. No src change; the dist is byte-identical.

## 5. Corrections to the standing record

1. **RETRACTION.** The `eabc72e6` seal commit body claims the harden passed
   "36/36 both engines" locally. With the committed fixture the refuse is
   deterministic and the 72-given poll cannot pass; whatever produced that
   figure, it was not the committed spec, and no transcript was banked. The
   claim is retracted as unverifiable testimony — the exact failure mode the
   BC-testimony ruling (pass-7 §2) names, committed by the chair that enforced
   it, in the same commit.
2. **CH-63 accounting.** The four affordances reds on 30746739106 are
   deterministic fixture defects, NOT contention-class members: they do not
   join the roster, do not count as "two reds in one run" (trigger 2), and do
   not enter the rate. `futoshiki.spec.ts:45` webkit on the same run IS a
   candidate instance (new row, one per run — signature-consistent); it rides
   the census reruns for classification. Ledger row amended in place.
3. The W2 permalink race record needs no amendment — it described a REFUSED
   link's strip racing the mount deal, cured at the decode. This episode is
   that cure observed working.
