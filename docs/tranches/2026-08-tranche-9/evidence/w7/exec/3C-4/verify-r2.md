# 3C-4 — non-author verification, round 2

Verifier ran against `2b6b8b7b` (repair r1) on `w7/exec`, with `ddfab36b` (the cure) read from
the diff. Nothing in the worktree was edited, stashed or committed; the two scratch files used
for the born-RED re-run were deleted before any gate, and worktree `git status` at return is
clean but for the permitted untracked `.vite-exec.config.ts`. The main tree was never built,
edited or served — its dist still serves `index-9rZPzI5DEcpe.js`, untouched. One server,
`vite preview` on 127.0.0.1:4259, killed at the end; 4259/4258/4257 all free at return.

**Verdict: ACCEPT** — zero BLOCKING, zero MUST, two NOTEs. Round 1's MUST is cured at the three
named sites and nowhere else was left saying the old thing. Every number in the author's return
reproduced in my hands, including the two it added this round.

## What I re-measured myself

| claim | author | mine | verdict |
|---|---|---|---|
| born-RED at the pre-cure tree | 3 failed \| 6 passed (9) | **3 failed \| 6 passed (9)**, the same three rows | CONFIRMED |
| full unit battery at `2b6b8b7b` | Test Files 68 (68), Tests 826 (826) | **68 passed (68) / 826 passed (826)**, exit 0 | CONFIRMED |
| `npx vue-tsc -b --force` | exit 0 | exit 0 | CONFIRMED |
| `npm run lint`, no prettier pass needed | exit 0 | exit 0, first try | CONFIRMED |
| `lint:copy` `lint:live-regions` `lint:motion` `lint:eslint` `lint:boundary` `lint:theme-selectors` `lint:lanes` `lint:ink` `test:font-coverage` | all exit 0 | **all exit 0**, run bare, `$?` read per gate | CONFIRMED |
| `npx vite build --config .vite-exec.config.ts` | exit 0, media rule greps 0 | exit 0; **0** hits of `not all and (hover:hover) and (pointer:fine)` in all seven built stylesheets | CONFIRMED |
| the deleted rule was load-bearing | pre-cure dist carries it | main's `index-BMuoFtzKf9_k.css` carries `@media not all and (hover:hover) and (pointer:fine){.attribution-tape{display:none}}`; the worktree build carries three `.attribution-tape` rules and no fourth | CONFIRMED |
| goldens 4/4, nothing re-baselined | 4 passed | **4 passed**, exit 0, `git status` clean after | CONFIRMED |
| `e2e/visual-regression.spec.ts` | 24 passed | **24 passed**, exit 0 | CONFIRMED |
| coarse census, both engines, 390×844 | 0.00px / 2,816 rects per engine | **0.00px**, 1049 + 1767 rects per engine, no key on one side only | CONFIRMED |
| fine census of the repaired build | 0.00px / 5,712 rects | **0.00px** on all four surfaces, read straight off the author's banked gz | CONFIRMED |
| the focus arm's five reads | A tape · B stands · C rises · D 0 · E 0 | **reproduced on chromium**, fresh session | CONFIRMED |
| "no fourth site makes the claim" | grep finds none | **grep finds none** in `src/` or `e2e/` | CONFIRMED |

### The born-RED, re-run without touching the tree

`git show ddfab36b^:…/GameBoard.vue` → `src/games/shared/GameBoardR2Precure.vue`, the row copied
beside it with its import repointed, `npx vitest run` on that file alone, both scratch files
deleted immediately after:

```
 FAIL … > raises the tape on a peer-authored cell the finger has focused
 AssertionError: a tap is the coarse pointer's only hover: expected false to be true
 FAIL … > drops the tape when focus leaves the board
 FAIL … > a synthesised coarse hover takes the focused cell's place while it lasts
 Test Files  1 failed (1)
      Tests  3 failed | 6 passed (9)
```

Red for the cure's reason and for no other; the six silences were green before the cure, which is
the shape a cure that only ADDS should have. Repair r1 adds no row, correctly: its whole content
is three comments.

### π, taken on my own build

`verify-r1/census2.mjs` unmodified, `hasTouch: true`, `reducedMotion: reduce`, 390×844, my own
`vite build` of `2b6b8b7b` served on 4259, diffed against **both** of the author's banked sides:

```
vs pre-*  (main's pre-cure dist)   chromium 1049 + 1767 rects  0.00px · webkit 1049 + 1767  0.00px
vs post-* (the author's own run)   chromium 1049 + 1767 rects  0.00px · webkit 1049 + 1767  0.00px
coarse=true and .attribution-tape=0 on every route and engine.
```

Banked at `verify-r2/census/` with `diff.txt`. The author's fine-census claim checks out from the
banked files alone: `census/after` (ddfab36b) against `repair-r1/fine-census/post` is 0.00px over
1089 / 1049 / 1807 / 1767 rects with no key on one side only.

### The seam, read for unclaimed consumers

`hoveredPos` has exactly two readers in `GameBoard.vue` — `hoveredAuthor` (:517) and `tapeAnchor`
(:529) — and the template mounts on `hoveredAuthor && tapeAnchor`, so the coarse arm can reach
nothing but the tape. The cell's own `is-hovered` state stays `DigitCell`'s and is still written
by `mouseenter` alone, which is why the coarse census is byte-equal at rest. The `mouseleave`
listener the focus arm's read B dispatches against sits on the cell ROOT (`DigitCell.vue:228`, the
same element whose class list the probe prints), so read B is a real withdrawal of the hover and
not a no-op. The probe's own reads reproduce on my build: tape "chronic-gorilla" 108.28 × 33.35,
standing after `mouseleave`, rising on `ArrowRight` with no pointer event, gone on `ArrowLeft`
onto an unauthored cell and gone when a control off the grid takes focus
(`verify-r2/focus-arm-390-chromium-r2.txt`).

### MUST-1 of round 1, re-checked at the source

All three comments now say what ships, and none of them overstates it (each names the focused
cell as the condition). `git diff aab67b92..HEAD` over the three files is comment-only: filtering
the hunks down to non-comment lines leaves nothing, so no assertion was widened and no regex was
loosened — `DigitCell.attribution.test.ts` keeps every intent it had. I re-grepped `src/` and
`e2e/` for `coarse`, `a thumb`, `touch user`, `no hover to spend` and `attribution-tape`: the
survivors are the control panel's persistent sublabels, the hover card's tap gate, the keyboard
legend, the gallery's no-hover cards and the 44px tap floors — each still true — and no e2e spec
asserts the board tape's absence on a coarse surface, so nothing in the estate now contradicts the
shipped behaviour.

### Spoken contract and copy

`SheetWashiLabel` sets `aria-hidden="true"` for every anchor but `tag`/`persistent`, and the tape
passes neither, so the new paint adds nothing to the accessibility tree — the name is still spoken
through `DigitCell`'s `authorName`, on every pointer alike, exactly as the repaired comments now
say. `lint:live-regions` exit 0 in my hands. No product string was added or changed by either
commit; `lint:copy` exit 0. By ear, a player reads only another player's own name ("chronic-gorilla"
in my run) — plain English, no jargon, no dash, nothing naming the machine.

### Frames

Four, all crops and none a viewport, 21,071 / 25,961 / 35,745 / 45,376 B. Read one by one: the
BEFORE frame shows the focused peer digit with an empty berth, which is the 0 × 0 row; the three
AFTER frames carry the slug in the peer's ink, with the top-row `is-below` flip visible on the
webkit crop and its x=0 clamp disclosed in the README. Each is cited with the number it proves.

---

## Findings

### NOTE-1 — the DELTA names the tape's own box but not what the standing tape covers

The cure declares a 109.59 × 33.58 px box. It does not say what that box sits on, and on coarse
the box now stands for as long as the selection does rather than as long as a mouse rests.
Measured on the repaired build, chromium, 390×844, `hasTouch` + `isMobile`, live session
(`verify-r2/occlusion.mjs`, output at `verify-r2/occlusion-390-chromium.txt`): with the peer's
cell 10 selected, the tape covers three cells of the row above at **68.6 / 81.2 / 68.6 percent**
of each cell's box, over a background of **83% alpha**, and one of those cells holds a digit. It
was still there, unchanged, 8 seconds later.

This is not a π breach — the tape is `position: absolute; width: 0; height: 0`, my census is
0.00px, and nothing moves. The same overlap has hung over the same neighbours on a fine pointer
since T8-W3, so the shape is the estate's, not this cure's. What changed is the DURATION on the
smallest surface: a phone player who selects a peer's digit and starts typing has three cells of
the row above obscured for the whole time. FIX (documentary, inside this cure): one measured row
in the README's DELTA naming the coverage and the persistence, so the chair rules on it with the
number in front of them. Any hardening beyond that — a dwell-out, or dropping the tape once the
keypad opens — is a design question this lane did not open.

### NOTE-2 — the webkit half of the focus arm is the author's word plus round 1's, not mine

I re-ran `focus-arm.mjs` on chromium only. Reads A–E on webkit stand on the author's
`repair-r1/focus-arm-390-webkit.txt` and round 1's own webkit run; both agree, and my chromium run
agrees with both, so I have no reason to doubt it — but it is not a number I took. Likewise
820×1180 remains chromium-only, as the README discloses.

## What I did not run

- No real device, no Safari, no simulator, no `osascript` (M19 honoured end to end — playwright
  chromium and webkit only). The iOS instrument is W8 §8.3's, owner-run.
- No webkit run of the focus arm or of 820×1180 (NOTE-2).
- No new frames: repair r1 moves no pixel, and my census says so twice.
