# PASS-1 CRITIQUE · PLR-SELF · the crayon stub, in your ink

Adversarial read of `../synthesize/PLR-SELF.md` and `../prototype/PLR-SELF/`. I did not write
either. Every number below that is mine was taken on **my own** dev server against the
prototype worktree (`127.0.0.1:4241`, `--strictPort`), **both engines**, with the lane's probes
banked at `critique/PLR-SELF/critic*.spec.ts` + `critic.config.ts`. U-10: the owner disposes.

**CONVERGENCE: 72% · VERDICT: ADVANCE.**

The design stands and the build proves it: I re-measured the family's whole claim in one scene
and it holds. What it does not yet have is a working keyboard, a declared pixel budget, and one
true number in its own source.

---

## 1 · What I re-measured myself

| reading | chromium | webkit |
|---|---|---|
| mark ink **==** self row ink, sheet open, pointer parked off the mark, 4 at the table | `oklch(0.5 0.11 0)` == `oklch(0.5 0.11 0)`, stub fill the same, `is-live` true, inline `--color-user-ink: oklch(var(--peer-ink-l) 0.11 0.0deg)` | identical |
| sheet AA, **light**, painted bytes, over popover-80%-over-background / -card | rows 6.19 / 5.59 / 5.97 / 6.02; quiet rung **5.16** | — |
| sheet AA, **dark**, all 16 walk indices synthesised at `--peer-ink-l` 0.8 | worst **9.66**, best 10.62, over background AND card; quiet **6.03** | — |
| filter census, sheet OPEN, 16 at the table | **9** | — |
| type | state 14.048px, row 16px, both `"Patrick Hand", cursive` | same |
| geometry, desk 1280 | mark 45.1 × 39.8 at (75.5, 12); sheet (0, 51.8) w 256, `scrollHeight == clientHeight` (159/159) | — |
| compression at 16 | 4 rows + `and 12 more` = six lines | — |
| roster | `players-roster sr-only`, `role="log"`, `tabindex` **null** | same |
| live regions | **6** (`margin-note · board-voice · players-status · players-roster · players-alone · copy-status`) | — |

G1's guard re-read in source and it is sound: `authorInk` (useSession.ts:406) skips the author
by **id**, not by the emptiness of their ink, so the board's own digits cannot move whatever
`mint` binds. That is the load-bearing reason the F1 change is safe, and the prototype states it.

## 2 · What broke under my hands

**2.1 · Enter does not operate the mark. Either direction. Both engines.**
Focus the mark, press Enter: `aria-expanded` stays `false`, the lobby stays `visibility: hidden`.
Press Enter again: still shut. Press **Space**: it opens. Press Enter while open: it stays open.

```
CRITIC3|{"case":"after-enter-1","expanded":"false","vis":"hidden","focused":true}
CRITIC3|{"case":"after-enter-2","expanded":"false","vis":"hidden","focused":true}
CRITIC3|{"case":"after-space","expanded":"true","vis":"visible","focused":true}
CRITIC3|{"case":"enter-while-open","expanded":"true","vis":"visible","focused":true}
```

The mechanism is `PlayerMark.vue:106`, `@keydown.enter.stop="toggle"`, sitting on a `<button>`
that already turns Enter into a `click` — so one Enter fires `toggle` twice and nets zero. The
line is copied verbatim from `.attribution-trigger`, where a `focusin` on the disclosure has
already opened the card before Enter ever lands, so the incumbent never showed the defect
(measured: focusing `@mbabb` sets `aria-expanded="true"` before any key). The mark has no
focus-open, so it inherits the bug bare. **A legacy alias, and a masked fallback that stopped
masking.** Cure: delete the handler; `@click` is the whole contract a button needs.

**2.2 · Escape does not dismiss the sheet.** Both engines: open, press Escape, still
`expanded: "true"`, still `visible`. App.vue's `onGlobalKeydown` (`:773`) handles exactly one
key, `g`, and nothing in `PlayerMark`/`PlayerLobby`/`useHoverCard` listens for Escape. A mouse
user dismisses by clicking out; a keyboard user's only dismissal is Space on the mark it does
not know is still focused. No gate in §9 looks at a key.

**2.3 · The hover lift erases the one memorable thing.** `.player-mark:hover` (0,2,0, declared
after `.is-live`) wins, so a live mark under a fine pointer paints
`--color-pencil-graphite` — the colour that means *somebody else is here* is gone at exactly
the moment a mouse user reaches for it. Measured: `after-mouse-open → color rgb(38,38,38),
hover: true`; `pointer-parked-away → oklch(0.5 0.11 0)`. The prototype names this in its
README (§2, "READING THE FRAMES") and treats it as an artefact of the probe's pointer. It is
not an artefact; it is the design's own affordance eating the design's own sentence. Either the
lift is not `color` on a live mark, or the family accepts that its signal is off whenever it is
being used.

**2.4 · No frame shows the claim.** The three open-sheet crops show the mark **graphite** beside
coloured rows; the shut-head crops show the mark coloured with no rows to compare it to. Across
ten frames there is no single image where a reader can see that the mark and the self row are
the same colour. The claim is true — I proved it numerically above — and it has never been
**seen**. Unverified gestalt, on the family's only sentence.

**2.5 · pi: the gallery deck's self swatch moves, undeclared.** `mint`'s F1 change repaints
every surface that reads `player.ink` for self, and one of them is not the roster:
`GameCard.vue:363` `.game-card-swatch`, the deck's roster echo, bound from
`session?.players`. Measured on the gallery with a room:
`style="--color-user-ink: oklch(var(--peer-ink-l) 0.11 0.0deg)"`, `bg: oklch(0.5 0.11 0)`. At
HEAD self's ink is `{}`, so that dot inherits `#2563eb`. G1 hashed 24 board cells on a **solo**
board and could not see it; no frame was taken of the deck; neither the spec's §7.1 nor the
gate list names the deck. One dot, but it is exactly "the pixel it moves that it did not
declare", and the deck is a surface this wave does not claim.

**2.6 · A false number ships in the patch.** `GameControlPanel.vue`, new comment: *"Live
regions: three, as before."* The spec says the same (§3.4, "three today, three after"). HEAD
measures **six** and the prototype measures six — the lane's own G6 reading says so, and mine
agrees. The prose was never reconciled with the measurement, and it would land in product
source as doc-truth.

**2.7 · The patch leaves substrate with no consumers.** Deleting the roster's choreography
removed the last product reader of `useJoinWash`'s `arriving` and `departing`: after the patch
the only references outside the composable are `useJoinWash.test.ts` and
`e2e/join-language-prm.spec.ts` (which asserts their *absence* and now passes vacuously — the
prototype flags the spec, not the exports). The 740ms departure hold and the join/rejoin
classification still run on every arrival and every leave, for nobody.

**2.8 · A guard quietly stopped guarding.** `BoardHost.vue:75`, `if (!ink) continue`, whose
comment says *"Your own cursor is not a ghost … skipping is the belt to that brace."* Self's ink
is now always defined, so that arm is dead; nothing goes wrong today only because `peerCursors`
is keyed by the wire's `from` and never holds this page. The belt is off and the comment still
claims it.

**2.9 · The copy gate never read this family's copy.** All five strings are script-side —
`playersLine`'s template literal in App.vue, `"you"` and `` `${n} seconds ago` `` in a ternary,
`` `and ${n} more` `` — and the accessible name is a **bound** `:aria-label`. The jargon arm of
`check-copy-register.mjs` reads template text nodes, `RENDERED_ATTRS` and object-literal copy
keys, so it saw none of them (the dash arm, which reads every script literal, did). The
prototype names this for one string; it is true of all five. The gate ran, exit 0, 2 admitted,
0 unadmitted — and it is not evidence about this family.

**2.10 · G8 is refuted with no successor written.** The prototype is right that the desk bound
is wrong (board top 124.5, and the incumbent @mbabb card already laps it at 202.4 today), and
right about the two bounds that are real. Neither has been written as a gate, so the desk has
no bound at all right now. My own reading: at 16 players the desk sheet bottoms at **214.4**.

**2.11 · r0's I3 still cannot pass.** Two `AttributionCard` instances → two `[data-lobby]`
nodes → `getByRole("dialog").or(locator("[data-lobby]"))` is a strict-mode violation, not a red
assertion. Measured: `lobbyCount: 2, markCount: 2`. Neither cure is chosen, and one of them
(instrument edit) is the one the r0 lane refused on principle.

## 3 · What is strong

- The F1 argument is right and the guard that makes it safe is real, not asserted.
- AA is earned on both themes, on both grounds, off the compositor — I reproduced it cold.
- The census discipline is exemplary: nine filters with the sheet open, byte-identical hue and
  heading censuses, identical drawn grid paths, and the two new paths named.
- Two design corrections were forced by measurement and both are correct: the qualifier's
  double spacing (`gap` + `margin-left` = 11.2px for one relationship), and the finding that an
  unlayered scoped `display: flex` beats Tailwind's layered `hidden` and would paint the desktop
  corner on a phone. The second is a standing trap worth a ledger row.
- The disclosure registry is a genuinely good primitive: one origin, one open, one dismissal,
  and `closeAll` keeps its single owner.
- The roster's office kept while its pixels go is the right shape, and `−206 / +45` of dead
  choreography is the wave's best line of the pass.
- The lane reports against itself — G8 refuted, I3 named, the unit deaths counted, the port
  substitution and the A/B method stated.

## 4 · Gates, judged

| gate | as written | judgement |
|---|---|---|
| I2 · G1 · G2 · G3 · G5 · G9 · G10 | can fail, did fail at HEAD, pass now | **earned** (I re-took G2, G5, and I2's substance) |
| G4 | can fail | earned as far as it reaches; it bounds the sheet against the sun and the phone board, never against the desk |
| G6 | "count = HEAD's count" | **re-derives its expectation from the tree under test.** A family that moved a region and its baseline together would pass. Pin the roll, not the count — and fix "three" to six. |
| G7 | can fail | earned |
| G8 | refuted | must be re-cut to the two measured bounds, or struck |
| I3 | cannot fail *or* pass | needs `:visible`, or one lobby |
| — | **missing** | no gate touches a key. Enter and Escape are the two things that broke. |

## 5 · Cross-pollination

1. **The head-disclosure registry** (`provide(headDisclosures)` + `register`/`claim`) — a
   one-origin-one-open primitive any other head surface can take, MRK-* and ACC-* included.
2. **"Loses its pixels, not its office"** — `sr-only` in place, `role="log"` kept where it can
   speak, drawing migrates — the reusable shape for every list W7 moves.
3. **The Tailwind layer trap** — an unlayered scoped `display` beats a layered `hidden`; any
   family turning an estate container into a row will meet it.
4. **The `@keydown.enter` + native-click double-toggle** — a standing estate trap, currently
   masked on `.attribution-trigger` by its focus-open. Worth a ledger row beyond this wave.
5. **Read the time qualifier at OPEN, never tick it** (`quietMsOf` snapshotted on the watch) —
   the right answer for any "N seconds ago" the wave adds.
6. **The qualifier berth**, 5.6px against the well's 153.3px: a sentence, not a column.

## 6 · Why 72 and not more

Zero open gaps is the price of 100. There are two reproducible keyboard defects in the new
component on both engines, one pixel moved on an unclaimed surface, one false number heading
for product source, one gate refuted with nothing in its place, one instrument that cannot
pass, dead substrate left running, and a copy gate that never read the copy. The prototype runs
on both engines and the family's central claim is proven, which is most of the way; the rest is
work, not doubt. **ADVANCE.**
