> **SPENT 2026-09-17, by the chair seal (lane S4).** The recrop landed: the 22 `gallery-pi` deck frames cropped to the deck rect (1104x520+72+0, identical on every arm so every pair still compares) and every frame in both banks re-encoded at fixed geometry — w3 4,135,716 → 1,327,580 B, w6 3,855,113 → 1,578,280 B, `check-evidence-policy.mjs` exit 0 with zero breaches and zero stale NOTICE lines, `--self-test` 22/22. Nothing deleted, nothing re-shot, no cap raised, no grandfather line added, no claim edited; all six banked byte-identity relations survive the transform. Manifest: `../seal/S4-recrop-manifest.txt`.

> **NOT LANDED 2026-09-17** — the cure is a RECROP of banked pi frames under `evidence/w3/gallery-pi/`, `evidence/w6/r15-frames/` and `evidence/w6/r13-frames/`, which are those lanes' banked evidence and not the Restamp lane's fence. Re-measured at the fold close and UNMOVED: `check-evidence-policy.mjs` EXIT 1 on 20 breaches — per-wave w3 4,135,716 B and w6 3,855,113 B against the 2,097,152 B cap, plus 18 over-cap images. Zero stale NOTICE lines, as 6a-2 left it. The gate's own footer still forbids the cheap exit.

# FA5-1 → `check-evidence-policy.mjs` is GREEN in its own arm and RED on the estate beside it

Handoff 6A-2 is LANDED: `GRANDFATHERED_DISTS` is empty, the gate prints **zero** stale NOTICE
lines (was 29), and `--self-test` holds at **22/22**
(`../fold/FA5-evidence-policy-after.txt`, `../fold/FA5-evidence-policy-selftest.txt`).

The gate nonetheless exits **1**, and not for anything 6A-2 or this fold touched. Between 6A's
bank (`kills-bundles/evidence-policy-after.txt`, exit 0, 523 png / 37,562,738 B) and this fold,
the estate gained W3 and W6 capture banks: **582 png / 45,012,307 B**, and with them **20
breaches — 18 per-image, 2 per-wave.**

None of the breaching files is in FA5's fence, and the gate's own footer forbids the cheap exit
in so many words: *"Do NOT raise a cap and do NOT add a grandfather line."* So the seam is handed
over rather than papered.

## The breaches

**Per-wave, 2 — both T9's own live waves, both roughly double the 2,097,152 B cap:**

| bucket | bytes | over |
| --- | --- | --- |
| `docs/tranches/2026-08-tranche-9/evidence/w3` | 4,135,716 | 1.97× |
| `docs/tranches/2026-08-tranche-9/evidence/w6` | 3,855,113 | 1.84× |

**Per-image, 18 — 16 in one directory.** `evidence/w3/gallery-pi/{before,after,after-rerun}/`
holds the pi-law before/after frames, webkit ones at 193–226 KB against the 153,600 B cap; the
other two are `evidence/w6/r15-frames/desk-1440-armed-chromium.png` (193,778 B) and
`evidence/w6/r13-frames/before-webkit-2.png` (175,792 B). Full list with byte figures:
`../fold/FA5-evidence-policy-after.txt`.

## The cure, in the policy's own words

A crop, not a pin. `EVIDENCE-POLICY.md` is explicit that a wave which cannot clear 150 KB per
image is capturing too much frame, and the pi frames are the clearest case: they are whole
viewports banked to prove a ribbon and a ring did or did not move, where the claim is a number.
Recropping the 16 `gallery-pi` frames to the pixels under audit very likely clears the w3
per-wave cap in the same act.

**The pi law is the constraint on the cure, and it cuts both ways.** These frames are the banked
before/after of a declared DELTA — they may be RECROPPED, and they may not be re-shot, since a
re-shot frame is a re-baseline wearing an old file's name. Whoever crops them crops the banked
bytes.

Owner: the W3 pi lane for `gallery-pi/`, the 6D lanes for `r13-frames`/`r15-frames`.
