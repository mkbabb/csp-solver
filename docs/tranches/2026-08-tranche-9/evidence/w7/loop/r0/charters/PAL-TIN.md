# PASS-1 CHARTER · PAL-TIN · The tin

Section: §11c the per-player colour system · §3's peer exception · §12
Lane port: 127.0.0.1:4245
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-TIN/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The palette is a FINITE DESIGNED OBJECT — a tin of coloured pencils with a fixed number
of sticks — and running out is a DESIGNED state, not a failure. Twelve named pencils
(`--color-peer-1..12`, two theme arms each, every one hue-locked to an AA-cleared tier),
cut into the wheel's gaps and never inside a reserved arc, never an anchor itself (law:
no player is ever assigned wax or a rainbow stop — the twelve are pens BESIDE the
anchors), allocated to arriving peers IN TIN ORDER by an allocator — never a golden
angle. By construction the 37 collisions R5 measured inside a room of 16 are dead. When
the tin is empty two people share a pencil and are told apart by a SECOND AXIS rather
than a 2.5°-apart hue. YOU take a pencil too (`k[self]` on your own page when a room
exists; nothing bound solo). The peer cursor ring and the join trace draw from the same
pencil at the reduced pressures they already use. The lobby can NAME a colour out loud
in plain words.

The family's research forks: (a) how many FREE sticks — twelve free (seven new
hue-locked tiers cut and priced), or fewer free with some reserved; (b) the SHARING AXIS
past exhaustion — a lightness step on the second lap (the 13th player is the 1st a shade
off: is it distinguishable?), or a drawn under-mark on the sharer's digits (one tick, two
ticks — the tally idiom the deal counter already draws), which the lobby names ('green
pencil, two ticks'); (c) derivation — the twelve cut between the anchors, or as six
anchors × two lightness bands. Each arm is measured, not argued.

## Substrate on this tree (verify first, cite file:line)

- `playerIdentity.ts:64-70` `inkFor` (replace the formula with a table lookup + allocator); `:98` IDENTITY_CAP and `:142` (the allocator inherits the cap's teeth); `useSession.ts:553 adoptInk` (an agreed index is reassignable — the allocator must say what a rival `st` does to it).
- `index.css` `@theme` + `.dark`: the token shape (`--color-red-ink` etc. as the tier precedent; two arms; the crayon dark law for the dark arms); `scripts/check-ink-pressure.mjs` (three scopes) if any tier joins the ramp; the decided-history law against a third name for a colour that already has two.
- `r0/r5-player-mark/ink-census.txt` (the 29 reserved hexes); `instruments-family-law.mjs`.
- `gameCell.css:229-241` the cursor ring; `HandDrawnGrid.vue:493-512` the join trace; the tally glyph the deal counter draws (for the tick arm).
- `GameControlPanel.vue:1086-1188` the roster; the slug and the lobby's copy in the hand (no `j`, no `x`; 'pencil' is drawable).

## What the family must answer

1. THE TWELVE — hexes in both themes with hue, L, C; Δh to all 29 reserved inks ≥ 12° for every stick; none an anchor; the dark arms under the crayon law; a wheel diagram as a table, not a frame.
2. AA — canvas read-back for all 12 (×2 laps if the L-step arm) on four grounds; the worst case named; 3:1 for the cursor ring at 0.55 and the join trace.
3. THE FAMILY LAW — `instruments-family-law.mjs` GREEN by construction over 16; re-run it anyway.
4. EXHAUSTION — arm (b): a 16-person roster rendered with sharers (four sharers under twelve free; eleven under five free): does the sharing read as a system or a bug? The tick at dpr3 on a digit; the L-step lap's discriminability (two players a shade apart side by side).
5. THE ALLOCATOR — tin order vs the wire: what index a late joiner gets, what a rival `st` (F6) does, what an evicted binding (F5) does; a spoken plain sentence for each.
6. YOU JOIN — byte-identical solo; your pencil in a room; `--color-user-ink` as the solo ink; print/forced-colors.
7. THE COST — seven new tiers priced (tokens, `check-ink-pressure` scopes, the consumer map); against the owner's "16+ within reason", the honest tin size.
8. THE ANCHOR COUPLING — the reserved set assumed (five crayons or six); if the accent law grows the wheel, which stick moves.

## First runnable prototype

Twelve tokens in an `addStyleTag` overlay + `page.evaluate` patching `inkFor` to a table/allocator on your dev server; two pages on `?wire=local` and a scripted 16-id roster; both engines, both themes; canvas read-back; the family-law instrument; one roster crop with sharers (the arm chosen) and one dpr3 board crop of a shared pencil's tick.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r5-player-mark/instruments.spec.ts` I2 (a player's own swatch is the colour the room paints for them), I3 (a player mark lives in the head's left corner — role + accessible name, x<200, y<120 — and its press opens a lobby), I4 (an agreed ink index survives a rival `st`), I5 (a live claim is never re-issued) — all RED at HEAD both engines. I3 must green under your overlay; I2 is ruled by your F1 answer (green, or a stated reason it stays red); I4/I5 are substrate rows the family must SPEAK to (what the lobby says when identity is lost), not cure.
- `r0/r5-player-mark/instruments-family-law.mjs` — no peer ink in the first 16 within 12° of a reserved ink, both sides read from the real sources (RED at HEAD: 37 collisions). Re-run against whatever palette your family assumes and say which anchor set you cleared.
- `r0/r5-player-mark/probe.spec.ts` + `probe.config.ts` — the read-only census rig (`?wire=local`, two pages, the head's geometry, the engine's painted bytes for all 144 indices); reuse it for every live measurement.
- Canvas read-back AA on four grounds for every colour the mark or lobby paints; 3:1 non-text at the DRAWN opacity for any stroke, dot or stub.
- `web/frontend/scripts/check-font-coverage.mjs` over every rendered string the mark and lobby mint (the hand has no `j`, no `x`; the slug filter `/^[a-ik-wyz]+$/` guarantees only the slug).
- The 44×44 floor on the trigger, per dimension, in the phone's 250.5px free band beside the 75.5px @mbabb trigger; M19 (a peer arriving moves no focus and opens nothing); W3's live-region idiom (no second region saying what the roster already says).

## Kill conditions and risk

- Exhaustion arrives early against "16+ within reason" unless twelve are free; twelve free means seven new hue-locked tiers, real work priced before the palette is drawn.
- The 13th player as the 1st a shade off is honest only if distinguishable; the tick is a second thing to learn and a mark on a DIGIT (the wobble law and a11y name both apply).
- Under a five-crayon accent law the twelve must be pens beside the anchors; under a six-crayon law one more arc is reserved.

## Census ground (read before designing)

- `r0/r5-player-mark/README.md` (+ `ink-census.txt`, `engine-vs-maths.txt`, `instruments-family-law.txt`, `instruments-webkit.txt`, `frames/players-well-3up-light.png`, `frames/head-left-card-open.png`): F1 a player's colour is a PAGE's colour (self gets `ink: {}`; you are blue on your page and `oklch(0.5 0.11 0)` on your neighbour's); F2 the walk's cycle is 144, min separation 12.5° at 16; F3 AA holds over all 144 (light 5.22/5.35, dark 9.71/9.50 on background/card); F4 37 collisions with the 29 reserved inks inside the first 16 (index 11 at 0.2° from solver-ink-5, index 15 at 0.4° from your blue, index 8 at 5.8° from teacher-red); F5 `IDENTITY_CAP = 8` bites (a ninth room evicts your binding; a tenth page is handed a LIVE id); F6 `adoptInk` re-inks the room before the board is believed; F7 presence: `hi` every 15 s, expiry 45 s, a played `st` is 1,033 B; F8 the roster is 111px below a phone's fold with the dock open; F9 the roster reads six rows (`max-height 7.5rem`); F10 the `you` qualifier sits ~145px from the name it qualifies; F11 the tag overhangs the well by 14px; F12 three live regions already speak (`players-status` polite, `players-roster` `role="log"` 'who's on this board', `players-alone` sr-only); F13 395,025 names, no `j`, no `x`; F14 the @mbabb card: trigger 75.5×39.8 at (0,12) desk / (0,0) phone, card 256×151 at (0,51.8), popover 80%, 2px border 30%, radius 16, padding 16, hung off `--head-rule` at `left: 0`; the head's free band on a phone is 250.5px.
- `r0/r2-accent-family/README.md` (the peer walk at C 0.110 vs mean crayon C 0.166; you keep Tailwind blue-600 while every peer is a generated oklch) and `r0/r6-idiom-history/R6-census.md` (the walk puts player 0 at h 0.0, rose/teacher-red territory; no player is ever assigned wax or a rainbow stop; the peer cursor ring is deliberately lighter than yours on every axis and is a RING; there are no mouse pointers in a pencil world).
- `web/frontend/src/games/shared/playerIdentity.ts:12, :27, :64-70, :78, :98, :142`; `src/games/shared/useSession.ts:73-76, :537, :553, :570-649, :763, :782`; `src/games/shared/GameControlPanel.vue:1042, :1086-1188, :1646, :1768`; `src/pencil/chrome/AttributionCard/AttributionCard.vue:129-189`; `src/games/shared/gameCell.css:229-241`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:493-512` (the join trace, nothing mounted at rest); `web/relay/relay.ts:172` (MAX_FRAME); `useJoinWash` (boot suppression 1200 ms, coalesce 400 ms, per-id gap 4000 ms, nothing under PRM).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-TIN/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-TIN/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4245 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
