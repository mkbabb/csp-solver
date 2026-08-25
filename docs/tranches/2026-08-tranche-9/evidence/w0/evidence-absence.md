# The evidence-absence census (T9-W0, 2026-08-25)

Every verdict the estate asserts about a rendered surface, and what's on disk behind it. This
is the artifact the retro blocks in T7's and T8's close records cite, and the subject the
claims law in `docs/tranches/EVIDENCE-POLICY.md` was written for (T9 formation, family **F15**
— `../formation/registry.md`).

Every figure below was re-derived at this commit; commands are in §5. Cites into the two close
records carry their **section number and anchor text, deliberately without a line number**: both
files take correction blocks this wave, and every block above a claim moves it. T7's anchor was
measured three times in one session: `:145` at HEAD `c917f9a7`, `:190` once the first correction
block landed, `:198` after the second — it moved twice while this file was being written, which
is the argument. Line numbers are given only for files this wave doesn't move.

## 1 · The prose-only verdicts

| # | the verdict | where it's asserted | rows asserted | artifacts on disk | what the record says about the absence |
|---|---|---|---|---|---|
| 1 | **T7's live-edge visual pass** — the owner-ordered deployment acceptance, the whole validation regime under O-12 | `2026-08-tranche-7/evidence/wgate/close-record.md` §9, *"The visual validation, on the live edge (the owner-ordered acceptance)"* | "twelve frames banked", chromium + WebKit, seven surfaces named in prose | **zero.** `evidence/wgate/` holds 8 files: 6 `.md`, 2 `.txt`. No image, no probe script | "sibling shots withheld from the repo per the evidence byte caps; the probe script is reproducible from this section" — **measurably false**, see §2 |
| 2 | **T8's live pass** — six lanes × two engines against `index-jt51RN8od5PV.js` | `2026-08-tranche-8/evidence/wgate/close-record.md` §6.1, *"The pass results (2026-08-04, six lanes × two engines)"* | **48 PASS / 7 FAIL / 23 NOTE = 78 rows** (re-summed from the six lane tallies) | **zero.** `2026-08-tranche-8/evidence/wgate/` holds exactly one file: `close-record.md` | nothing — the absence isn't named |
| 3 | **T8's cure re-verify** — three lanes × two engines, live edge | same file, §6.3, *"The cure re-verify (2026-08-07, three lanes × two engines, live edge)"* | **45 PASS / 0 FAIL / 9 NOTE** declared; the prose enumerates the 45 as 17+22+6 and enumerates **7** NOTEs | **zero** | nothing. The declared NOTE count and the enumerable one differ by two, and with no rows on disk neither is checkable |
| 4 | **T8.1 §9.2's live proof** — R15 and R13 on the live edge and the live relay | same file, §9.2's *"The live re-verify, two lanes × two engines"* | R15 **8 PASS / 3 NOTE** over 20 arms + a 352.00px negative control; R13 **9 PASS / 3 NOTE** | **zero.** §9.2 asserts *"A pixel census over the still's PNG"* shows both hue families physically present — that PNG is nowhere in the tree | nothing |
| 5 | **The T8-W5 bench** — every table behind T8-R05 and T8-R10 | `2026-08-tranche-8/evidence/w5-bench/README.md:175` and `:585`, citing `perf-rig/runs/` | 58 solve rows, 15 iOS boil cells, 15 chromium cells, the r13 generation | **zero, by construction.** `perf-rig/.gitignore:3` is `runs/`; the dir holds **530 `*.jsonl` + 47 `*.peer.log`, 2,452 KB**, and no clone reaches any of it. `*.jsonl` under `2026-08-tranche-8/`: **zero**, then and now | the rig's own README asserted the opposite — that readings *are* banked under `docs/tranches/**/evidence/`. **CURED at T9-W0** under rule (c), not by copying raws: the summary extract with its declared local-only provenance lands at `2026-08-tranche-8/evidence/w5-bench/raw-summary.md`, cited by a correction block in that dir's README, and the rig README is trued. **Residue**: the same false sentence has a twin at `web/frontend/perf-rig/.gitignore:1-2`, verbatim, two lines above the `runs/` rule it contradicts — outside this lane's files, booked for T9-W5 with the rig's script arm |

**Total asserted-and-unbacked: 155 verdict rows** (78 + 54 + 23) across T8's three live passes,
plus T7's twelve claimed-and-absent frames, plus the whole bench dataset. Every one is a product
of the post-O-12 regime, where deployment validation *is* the visual pass.

## 2 · Why T7's byte-cap justification doesn't hold

The record withholds twelve frames "per the evidence byte caps". The policy's caps are ≤150 KB
per image and ≤2 MB per wave. Re-derived at this commit:

| figure | value |
|---|---|
| T7's whole tracked image bank | 81 PNGs, **1,410,207 B** — all of them in `evidence/w7/` |
| `evidence/wgate/` image bytes | **0** — the wave's entire 2 MB allowance unspent |
| T7's own crop sizes (`w7/`, n=81) | min **3,185 B** · median **16,042 B** · mean **17,409 B** · max **40,954 B** |
| twelve frames at T7's *largest* observed crop | **491,448 B** — 24% of one wave's cap, every file 3.7× under the per-image cap |

T7 was already cropping to policy and clearing it with room. Twelve more of the same would not
have breached anything. And the second clause fails on its own terms: the driver isn't banked
either — `evidence/wgate/` carries no script, so "reproducible from this section" means
re-writing the instrument from prose.

## 3 · The other half of the disease: a bank nothing cites

The policy caps bytes and says nothing about whether an image proves a claim, so T8's bank
passes every rule while tying almost no image to a verdict:

| figure | value |
|---|---|
| T8's tracked images | **33 files, 2,507,456 B** (24 under `evidence/`, 9 under `marks/`) |
| how many are a live-pass frame | **0** — the five holding dirs are `w2-c`, `w3-deck`, `w3-lane-c`, `w7-g2/shots`, `marks` |
| named by path in any `.md`/`.txt`/`.mjs` under `docs/` or `web/` | **4 of 33** |
| named nowhere | **29 of 33** |
| holding dirs referenced at directory level | **5 of 5** (four by `close-record.md`, `marks/` by `design-marks-2026-08-03.md:6` with an m1–m9 range) |

So the aggregate is reachable and no single image is answerable for anything. That's the gap
rule (a) of the claims law closes.

## 4 · The control — what compliance looked like, once

`2026-07-tranche-3/evidence/T3-WGATE-shots/` — **2 frames + `wgate-live-drive.mjs` (5,744 B)**,
the Playwright driver that took them, banked beside them. `T3-WGATE-ship.md:117` names both PNGs
by path with the claim they carry ("the live solved 9×9, both themes"). The two frames are full
viewports at 255,195 B and 259,291 B — over the per-image cap, grandfathered at T5-W1
(`2026-08-tranche-5/evidence/w1/evidence-adjudication.md:79-80`). What the precedent supplies is
the shape: a frame, its driver, and a report that cites both. The practice existed and stopped.

## 5 · Re-derivation

```sh
# rows 1–4: the asserted verdicts. Anchored on text, and the tally re-summed between two
# anchors rather than over a line window — a correction block above the table moves the
# window, not the anchors. (The 'twelve frames banked' grep now matches twice: the sealed
# claim in §9, and the correction block quoting it back.)
grep -n 'The visual validation, on the live edge' docs/tranches/2026-08-tranche-7/evidence/wgate/close-record.md
grep -n '### §6.1\|### §6.3\|### §9.2\|A pixel census' docs/tranches/2026-08-tranche-8/evidence/wgate/close-record.md
awk '/^### §6\.1/,/^\*\*The passes/' docs/tranches/2026-08-tranche-8/evidence/wgate/close-record.md \
  | awk -F'|' 'NF==6 && $3+0==$3 && $3!="" {p+=$3; f+=$4; n+=$5} END {print "PASS="p" FAIL="f" NOTE="n" total="p+f+n}'
# → PASS=48 FAIL=7 NOTE=23 total=78

# artifacts on disk, per wgate dir
ls docs/tranches/2026-08-tranche-7/evidence/wgate/ docs/tranches/2026-08-tranche-8/evidence/wgate/

# §2's crop statistics
find docs/tranches/2026-08-tranche-7/evidence -name '*.png' -exec stat -f%z {} \; \
  | sort -n | awk '{a[NR]=$1; s+=$1} END {print "n="NR, "min="a[1], "median="a[int((NR+1)/2)], "mean="int(s/NR), "max="a[NR], "total="s}'

# §3's citation audit
for f in $(find docs/tranches/2026-08-tranche-8 -name '*.png'); do
  grep -rql -F "$(basename $f)" docs/ web/ || echo "UNCITED $f"
done

# row 5's bank
ls web/frontend/perf-rig/runs/*.jsonl | wc -l
find docs/tranches/2026-08-tranche-8 -name '*.jsonl' | wc -l
```
