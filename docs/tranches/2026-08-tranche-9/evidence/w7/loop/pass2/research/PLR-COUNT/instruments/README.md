# PLR-COUNT pass 2 — instruments PROPOSED, and one handed on

`loop/r0/` is frozen. Nothing here edits it. Each row below names an r0 instrument whose
SUBJECT this family's design moved, states the re-point, and reports the r0 row **MOVED** with
the verdict the re-point reads at the same question.

| r0 row | subject at r0 | subject under PLR-COUNT | status |
|---|---|---|---|
| I2 | `.controls-card .players-roster .player-row .player-swatch` · `backgroundColor` | `[data-lobby] .pl-row .pl-row-mark path` · `stroke` | **MOVED** — re-point reads **RED by ruling** |
| I3 | a head button named `/player\|lobby\|who.s (here\|on this board)/i` opening `[data-lobby]` | unchanged | stands; GREEN under the diff, but see the strict-mode note |
| I4 | the same swatch, across a rival `st` | the same row mark | **MOVED** — re-point reads **RED**, r0's verdict reproduced |
| I5 | `playerIdentity` only, no DOM | unchanged | stands, RED, untouched by this family |

## I2' / I4' — the re-point, measured

`i2-i4-repointed.spec.ts` beside this file is the proposal. Two substantive differences from
r0's, both of them costs this family owes:

1. **The instrument gains a gesture.** The roster was always mounted; the register is a
   disclosure. Both re-pointed rows must PRESS the mark and settle ~700 ms before reading.
2. **The colour is a `stroke`, not a `backgroundColor`.** The swatch was a filled dot; the row
   mark is an upright drawn in the person's ink at `stroke-opacity 0.95`.

Read on the pass-1 worktree served at 127.0.0.1:4242, both engines (`readings/m-i2-i4-repoint-*.json`):

```
I2'  self's row mark   on my page  rgb(37, 99, 235)        <- --color-user-ink
                       on theirs   oklch(0.5 0.11 0)       <- the room's walk index 0
     RED, and RED BY RULING: F1 is decided the other way (the board keeps your blue).
I4'  a peer's row mark before      oklch(0.5 0.11 137.5)
                       after       oklch(0.5 0.11 327.5)   <- a rival `st`, every id +5
     RED. r0's verdict, at the surface that now carries the colour.
```

Both engines identical. The re-point READS where r0's instrument would throw
(`getComputedStyle(null)` on a deleted `.player-swatch`).

## I3 — the strict-mode note (not re-pointed, reported)

I3's last line is `page.getByRole("dialog").or(page.locator("[data-lobby]"))`. The head mounts
BOTH the desk and the mobile `AttributionCard`, so `[data-lobby]` resolves to two nodes and the
assertion is a strict-mode violation rather than a red. The honest fix is `:visible` on the
locator, not one lobby: two instances is the estate's own head idiom (T9-W3 §3.7) and the
family did not invent it. This lane proposes the `:visible` narrowing and nothing else.

## G4 — re-aimed, and now able to fail (`../probe/r2c.spec.ts`)

Pass 1's G4 asserted "0 `--color-user-ink` bindings in a room" while driving peers with `hi`
frames only, so it was a tautology as run; and `authorInk` (`useSession.ts:402-411`) binds on
every PEER-authored cell, so as written it REDs on shipped multiplayer. Re-aimed at SELF's
cells, with BOTH halves counted so an empty room cannot pass it. Measured, both engines:

```
in a room, nobody has written     authorInk 0 entries      DOM bindings 0
SELF writes one digit             authorInk 0 entries      DOM bindings 0   cellAuthors 1 (self)
a PEER writes one digit           authorInk 1 entry        DOM bindings 1   cellAuthors 2
                                  and the bound value IS that peer's ink
```

RIG TRAP banked: drive the write with `locator.fill()`, the estate's own e2e idiom
(`e2e/multiplayer.spec.ts:110`) — a synthetic `keyboard.press` does not take in webkit, which is
what left pass 1's attempt inconclusive. And do NOT `bringToFront()` between the write and the
read: re-focusing the reader's page clears the peer cursor and takes the merged
`--color-peer-cursor-ink` binding with it, which reads as a failure of a row that passed.

## `pixels.mjs` — handed to PAL-TIN

`pixels.mjs` here is pass 1's painted-byte reader, copied unchanged: separated ink runs per
strip (the machine's own count of objects), the minimum ground-coloured gap in device px, the
painted core in OKLCH per mark, and the minimum PAINTED pairwise hue separation. It is the
wave's instrument for "do N inks read as N", and the number it hands over is
**12.7° (webkit) / 13.3° (chromium) minimum painted pairwise hue separation in light from N=3
onward** — because F1 puts self at `#2563eb` (h 263) next to walk index 2 (h 275–276), and index
2 arrives with the third person. Dark: 19.7–20.4°. The demand stated exactly: the first six walk
indices pairwise ≥30°, clearing the 29 board inks AND the head's 12 warm tokens
(h 2.8–100.8), at a 2.18–2.62 px stroke, with index 0 out of the logo's rose (2.8° today).
