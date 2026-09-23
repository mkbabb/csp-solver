# Pass 6 — the chair's frame sweep (registry-v6 §2.18)

Deleted from the record (moved to the chair's scratch, sha1 kept), by §2.18's list:

- `pass6/prototype/MRK-ABS/frames/p6-1-ballot-three-arms-labelled-cell0-16x16-light-dark-chromium-dpr2-fine-prm.png` (27305 B, sha1 aaca5c60bca5)
- `pass6/prototype/MRK-ABS/frames/p6-3-inset-086-vs-090-cell17-16x16-light-dark-chromium-dpr2-fine-prm.png` (21294 B, sha1 1ad74dd53c3a)
- `pass6/prototype/NOTE-ERASE/f1-s7-four-arms-P1-P2-P4-dark-chromium-light-390x844-coarse.png` (125894 B, sha1 cd766d927c46)
- `pass6/prototype/NOTE-ERASE/f2-s7-four-arms-P1-P2-P4-dark-chromium-light-1280x800-fine.png` (66933 B, sha1 056871110605)
- `pass6/prototype/PAL-WALK/frames/3-gestalt-room-eight-vs-four-1280-light-chromium-fine-dpr2.png` (72253 B, sha1 9c3f5d1f40f4)
- `pass6/prototype/ACC-SIX/c2-T9-B-ACC6-2-arc-deep-vs-best-any-byte-desk-dark-chromium-fine.png` (24693 B, sha1 e6a3f2db04f2)
- `pass5/prototype/ACC-FIVE/p5-2-section-fork-gold-violet-graphite-light-chromium-fine.png` (40094 B, sha1 29f275f76940)
- `pass5/prototype/ACC-FIVE/p5-3-section-fork-gold-violet-graphite-light-webkit-fine.png` (40524 B, sha1 b002b207aba2)
- `pass5/prototype/PAL-WALK/frames/2-tape-translucent-vs-card-1280-dark-chromium-fine.png` (11409 B, sha1 ef0087f12d39)
- `pass5/prototype/PLR-PLACE/1-kill-664-chart-vs-list-coarse-light.png` (46005 B, sha1 a19de3b58c92)
- `pass5/prototype/CTRL-TAPE/c1-m18-edge-chromium-dark-390x844-coarse-proto-vs-head.png` (25968 B, sha1 ada5ab0e16e6)

Kept: every other pass-6 frame, re-quantized in place (pngquant 60–90): 1048300 B → 933392 B.

Over the cap after quantization (2,429,031 B), so §2.18's ordered deletions, each recorded:

- `pass6/prototype/CTRL-FACE/frames/f3-b16-b17-b18-b19-chromium-light-1280x800-fine-retires-c1-m17-head-armA-armB.png` (40818 B, sha1 c1bb234da13d)
- `pass6/prototype/CTRL-TAPE/p6-c3-quickset-chromium-light-844x390-coarse-shut-built-vs-strike.png` (74908 B, sha1 34e76910beff)
- `pass6/prototype/PAL-WALK/frames/4-fork-tin-room-vs-walk-room-1280-light-chromium-fine-dpr2.png` (52944 B, sha1 4ead0892274f)
- `pass6/prototype/ACC-FIVE/p6-1-section-fork-gold-violet-graphite-light-webkit-1280x800-fine.png` (60036 B, sha1 5387e153ca13)

Still over after the list (2,200,325 B). The chair re-quantized every kept pass-6 frame over 20 KB at pngquant 40–70 instead of deleting a lawful pair: 704686 B → 704686 B.

## The frozen pass-1 frames

The kept set above still read 2,188,323 B against the 2,097,152 B cap after §2.18's list, its ordered fallbacks and two re-quantizations (48 colours bought 12 KB, and three frames grew and were restored). Every remaining pass-6 frame is a lawful pair §2.18 keeps. The chair removed pass 1's 21 frames (248648 B) from the working tree instead: pass 1 is superseded five passes over, pass 4 was swept to zero on the same precedent, and each frame stays whole in git history at `31c6cbe0` (`git show 31c6cbe0:<path>`). pass1's text record is untouched.
