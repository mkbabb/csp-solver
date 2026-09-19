# PASS-2 PROTOTYPE · PLR-COUNT · The tally

RUNNING. Worktree `/.claude/worktrees/wf_8630d340-e56-53`, branch `worktree-wf_8630d340-e56-53`,
served at `127.0.0.1:4242` (scratch vite config, private `cacheDir`, `--strictPort`; killed before
this return). Both engines through a scratch Playwright config (no `webServer`, no `globalSetup`).
Every number below was read off that surface today; nothing is inherited from pass 1 unless the
row says so.

## 0 · What the replay carried

`wf_e58b4764-0fc-47`'s diff could not be applied with `git -C` (this lane is worktree-isolated and
the harness refuses git against another checkout), so the replay was done file by file against a
`diff -rq` of the two trees — HEAD moved by docs only, so the source files at HEAD are identical
and a file copy IS the diff. Ten files carried, and `git diff --stat` in the fresh worktree
reproduces pass 1's shape exactly before any pass-2 edit:

```
App.vue +19 · DifficultyTally.vue −123/+15 · GameControlPanel.liveRegions.test.ts ±13
GameControlPanel.vue −213 · useSession.ts +16 · AttributionCard.vue +37 · pencilConfig.ts +11
NEW: PlayerTally.vue · PlayerLobby.vue · useTallyStrokes.ts
```

`vue-tsc -b --noEmit` on the replayed tree: **EXIT 0**.

## 1 · The gates, as bytes

| gate | reading | verdict |
|---|---|---|
| G1 runs | painted runs == N for N 1…5, **both engines, both themes, dpr 3**; exactly **1** run at N=6 (the written number). Gaps 18–24 device px, no chunk | **GREEN** |
| G2 stroke-contrast | worst painted core vs page ground **4.537** light (self blue), **6.901** dark, both engines; solo graphite 12.479 / 11.068; the written count 4.958 / 7.519 | **GREEN** (≥3:1; the spec's "worst 4.771" is index 4 — the true worst is self's own blue) |
| G3 width | 44 · 44 · **51.66** · **62.28** · **72.92** · 44 · 44 (N=16), desk and phone alike, both engines | **GREEN**, to 0.01 |
| G4 binding | chromium: 0 bound empty / 0 after a SELF write / **1** after a PEER write. webkit: 0/0/**0** — the peer's write never reaches A (both pages read 62 digits, each its own), reproduced by the research lane's own `l-g4-reaim` | **GREEN chromium · UNREADABLE webkit** (rig) |
| G5 filter-census | **9** live filters closed and **9** open, tally boiling, sheet open, desk and phone, both engines (15 `<filter>` defs) | **GREEN** |
| G6 live-regions | **6** on the playing view, both engines. Order as measured: `margin-note, board-voice, players-status, players-roster, players-alone, copy-status`. The deck adds **1** (`gallery-live`), not 2 | **GREEN on the count · ADJUSTED on the order and the deck's +2** |
| G7 one-base | name == `1 player` / `${N} players` at N = 1,2,3,4,5,6,16; strokes == N (≤5); the written count is a substring of the name at every N ≥ 6; rows == N (≤5) or 4 + `and (N−4) more` tall, 1 + `and (N−1) more` short | **GREEN** |
| G8 three-bounds | sheet right edge **256** < sun 1072 (desk) / 326 (phone). Tall phone: sheet bottom **217.75** < grid top **221.73**. Desk: laps **4 of 81**. Short phone: laps **7**, sheet bottom 146.97 vs grid top 131.73. Heights: 173.88 desk / 173.75 tall (4 rows + foot, H(4,1)=173.9) · 102.97 short (1 row + foot, H(1,1)=103.1). **11 of 11 lapped-cell taps dismiss, both engines** | **GREEN on the bounds · ADJUSTED on "hits no control"** (below) |
| G9 crossing | 6→5: dashoffset `0` on all five strokes at every 80ms sample through 480ms — **nothing re-draws**. A MIDDLE bye 5→4: **4 of 5 `d` attributes byte-identical**, only the slot transforms change (`translate(0 0) … translate(52 0)` → `… translate(39 0)`). Both engines | **GREEN** |
| G10 seam | a mouse press on the mark: focus `INPUT` → `INPUT`, `aria-expanded` true, the peer's ghost of A stays **1**, both engines | **GREEN** |
| G11 keys | off `el.focus()`: Space opens, Escape closes, Enter opens, Escape closes — both engines. **Escape after a MOUSE press closes on WebKit** (the pass-1 defect). Tab route: chromium reaches the mark at press 4 (@mbabb → 2 card links → DEV debug toggle → **mark** → sun); webkit never reaches it (Tab goes to the board) and the row skips with that reason | **GREEN off focus · ADJUSTED on the Tab route** |
| G12 pre-game | `?view=gallery`: **0** `[data-player-mark]`, **0** `[data-lobby]`, desk and phone, both engines | **GREEN** |
| G13 tally-shared | not re-measured this pass: no geometry moved (`useTallyStrokes` untouched, `DifficultyTally` untouched). Pass 1's identical-`d` guard stands | **GREEN by construction, INHERITED** |
| G14 sheet-AA | painted bytes at N=16 over the wordmark, dpr 3, both engines: ground **rgb(252,251,251)** light / **rgb(18,16,15)** dark with **0.00% spread** (no bleed); `.pl-state` `.pl-qualifier` `.pl-more` **5.159** light / **6.021–6.099** dark; `.pl-name` 14.651 / 12.163 | **GREEN** (pass 1's 4.166 is cured) |
| G15 M19-whole | a third join: label `2 players` → `3 players`, `document.activeElement` unchanged (`INPUT`), sheets open **0** → **0**, both engines | **GREEN** |
| G16 tap-floor | 44×44 coarse, both engines; the negative control (a 40px floor forced on the same node) reads **40×40**, so the instrument reads the surface | **GREEN** |

### r0 rows, MOVED

| r0 row | re-point | reading here |
|---|---|---|
| I2' | `[data-lobby] .pl-row .pl-row-mark path` · `stroke`, after a press + 700ms settle | self on my page `rgb(37,99,235)`, on theirs `oklch(0.5 0.11 0)` — **RED by ruling** (F1 keeps the board's blue), both engines |
| I4' | the same mark across a rival `st` | `oklch(0.5 0.11 137.5)` → `oklch(0.5 0.11 327.5)` — **RED**, r0's verdict reproduced, both engines |
| I3 | unchanged subject | a head button named `/player/` opens `[data-lobby]`: **GREEN under this diff** (`1 player` … `16 players`); the strict-mode note stands — two marks in the DOM, one hit-testable |
| I5 · family law | untouched | **RED**. Minimum PAINTED pairwise hue separation **12.7° webkit / 13.3° chromium** in light from N=3, 19.7–20.4° dark. Handed to PAL-TIN with `pixels.mjs` |
| R6 hue census | copied and re-pointed at this worktree's `index.css` | **byte-identical to r0's output** (`diff` clean), 29 token rows unchanged |
| heading census | r0's instrument, re-pointed to :4242 | **8 names, 3 voices, 2 of 8 document headings** — r0's reading byte for byte, untouched by this family |

### The estate's own gates, in this worktree

`vue-tsc -b` 0 · vitest **66 files / 807 tests, all passing** · prettier clean · eslint clean ·
boundary lint clean · `check-motion-contract` 35 specs, every one declaring its motion ·
`check-live-regions` 0 born speaking · `check-theme-tokens` 0 unreferenced ·
`check-copy-register` **0 dashes, 0 unadmitted jargon** with the new `COPY_SOURCES` arm reading
`LOBBY_COPY` (self-test green) · `check-font-coverage` **OK — Patrick Hand 46 codepoints,
4,312 B**, five lobby strings + the digits derived from `LOBBY_COPY` and all inside the cut.

## 2 · What changed since pass 1, and what it cost

1. **One counting base.** `stateLine` is `LOBBY_COPY.count(N)` — `1 player` / `N players` — and the
   glyph, the strokes, the rows and the foot all count the same people. Pass 1's `12` over
   "11 other players" is gone; 2.5.3 holds by construction at every N.
2. **One threshold, `TALLY_MAX = 5`.** The chunk gap and the sixth stroke died. `TALLY_MAX` is one
   exported constant in `PlayerLobby.vue`; the mark imports it.
3. **The crossing.** `watch(drawn, …)` settles on `!was || now < was` and draws in only the new
   tail. 6→5 re-draws nothing (measured, six samples, both engines).
4. **The pose is the person's.** Seed = `11 + 12·(fnv1a(id) % 97)`, `:key` is the id, the `d` is
   generated at ONE local origin and the slot is a `transform`. A middle departure now changes
   four transforms and no geometry.
5. **The graft, and the pass-1 defect's cure.** The four hover handlers moved onto
   `.attribution-disclosure` (trigger + card); the `#mark` slot is its sibling. Measured: hovering
   the mark leaves the card at `opacity 0` / `aria-expanded false`, and with the register open the
   card is still `opacity 0` while `elementFromPoint` at a register row returns `SPAN.pl-name` —
   pass 1 returned the @mbabb avatar. `claimHeadDisclosure` gives the head one open disclosure.
6. **CH-70.** `.attribution-trigger`'s `@keydown.enter.stop` deleted; `useHoverCard.ts:47`'s
   comment, which described the deleted handler, rewritten.
7. **The opaque ground** (`var(--color-popover)`), the lobby's `@click.stop` deleted, `ROWS` on
   `(min-height: 800px)`, `@pointerdown.prevent`, window-bound Escape, `@focusout` close.
8. **The well.** `useJoinWash`'s roster half deleted whole: `arriving`, `departing`, both
   `rowArmMs`, `rowHoldMs`, `armRow`, and the now-callerless `later`/`timers` timer pool. Six unit
   rows re-cut. `.player-swatch` RESTORED (pass 1 deleted it) — chair §7: it stays until the three
   e2e reads and I2/I4 are re-pointed in one diff.
9. **The instruments.** `e2e/player-tally.spec.ts` written (five rows, `PRM:` declared in the first
   20 lines, LOCAL per O-12); `pixels.mjs` promoted; `check-font-coverage`'s `lobbyStrings` derive
   and `check-copy-register`'s `COPY_SOURCES` arm landed, both self-tested.

## 3 · Every gap, named

1. **The Tab route is not the route the spec claims.** PLR-SELF §3.1 says "@mbabb → mark → sun".
   Measured in chromium: `@mbabb → card link → card link → debug toggle (DEV) → MARK → sun`,
   because focusing @mbabb opens the card (UI-6's own disclosure) and its links come first. In
   production the debug toggle is gone, so it is three presses, not one. In WebKit Tab never
   reaches the mark at all (it goes to the board); the row skips loudly and the contract is
   asserted off `el.focus()` in both engines instead.
2. **G8's "hits no control" is true only of centres the sheet covers.** Desk: 4 lapped cells, 2 of
   them with their centre under the sheet (tap hits `LI.pl-row`), 2 partially lapped whose centre
   is clear (tap hits `INPUT.cell-native-input`). Short phone: 7 lapped, **0** centres covered. All
   11 taps dismiss the sheet. The gate as written would fail on a cell whose centre is not covered
   even though nothing is stolen from the reader; it wants the centre qualifier. Reported, not
   re-worded.
3. **G4's peer half is unreadable in PW-WebKit.** Two pages, one room, `locator.fill()`, no
   `bringToFront` between write and read: chromium reads 0/0/1, webkit reads 0/0/0 with both pages
   seeing only their own digit. The research lane's own instrument reads the same. The law is
   proven in one engine and the rig is named in the other.
4. **The deck adds ONE live region, not two.** `gallery-live` is there; `gallery-guard-live` is
   not mounted at `?view=gallery` in this build. The six playing regions are intact; the order they
   appear in the DOM is not the order §3.5 lists.
5. **The solo row has no name.** With no room, `session.players` is empty, so the register shows
   one row with the mark and the qualifier `you` and no slug — a page that has not joined has no
   name for you yet. Rows == N holds; the row reads `| you`. Undecided by the spec, decided here,
   and flagged for U-10.
6. **The family law is unmoved and cannot move here.** 12.7° / 13.3° minimum painted hue separation
   from N=3 (self blue at h263 beside walk index 2 at h275–276). 100% is unreachable inside this
   family; PAL-TIN owns it, with `pixels.mjs` and the index.
7. **G13 is inherited, not re-measured.** No geometry moved this pass, but "byte-identical `d`"
   was not re-run against HEAD on this tree — the main tree is frozen and cannot be served for the
   side-by-side.
8. **`--tap-floor` reads empty off `documentElement`.** The token resolves under a media query, so
   the probe's direct read is blank; the floor is proven by the measured 44×44 and its 40px
   negative control instead.
9. **The register's rows are never narrated.** The sheet has no live region by design (the
   `role="log"` roster in the well still announces), so a screen-reader user hears the label change
   and must open the sheet to hear who. Declared, not cured.
10. **And then the hard part:** the deck's own count. `N other players` is right where the sentence
    is about the others (the deck), and this family retired that phrasing on the board only. The
    deck has no mark at all now, so nothing says how many people are at the table you are about to
    leave. Nobody has decided whether it should.

## 4 · The four cited crops

1. `frames/1-head-strip-390-light-n1-n3-n5-n6.png` — the head at N=1/3/5/6, 390 coarse light,
   chromium above webkit. One stroke graphite, three and five coloured, `6` written in your blue.
2. `frames/2-desk-register-card-not-painting.png` — the desk register open over the board with the
   @mbabb card NOT painting (chromium | webkit): the pass-1 defect's negative.
3. `frames/3-phone664-n16.png` — the short phone at N=16: head `16`, `16 players`, one row,
   `and 15 more` on the opaque ground (the brief said `and 12 more`; that is the TALL budget —
   the short regime is `ROWS.short = 2`, so it is 1 + 15).
4. `frames/4-dark-n3-1280.png` — N=3 dark at 1280, sheet open.

## 5 · How to re-run

```
# from the worktree's web/frontend
npx vite --config <probe>/vite.lane.config.ts --host 127.0.0.1 --port 4242 --strictPort
LANE_PORT=4242 npx playwright test --config <probe>/pw.config.ts --project=chromium gates.spec.ts
node <instruments>/pixels.mjs <strips>/*.png          # G1 · G2 · the family law
node <instruments>/aa.mjs <strips> <readings>/sheet16-geom-chromium.json   # G14
node <instruments>/hue-census-repointed.mjs           # R6, re-pointed, never r0 in place
```
