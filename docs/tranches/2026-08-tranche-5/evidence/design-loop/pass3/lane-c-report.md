# LANE C — STAGE C · F2's ZONE GRAMMAR, LANDED ON MAIN · pass-3 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`2335282c` (Lane D's stage-D close). Ported from wt-3 and **re-derived against HEAD**, not
replayed: P1-W3/W4 and Lane D moved `GameControlPanel.vue`, `index.css`, `OptionSelector.vue`
and `GameScene.vue` under the pass-2 diff, and four of its files no longer exist. `frontend-design`
invoked before the visual work; its calibration for this lane was **restraint** — the pencil-notebook
system already owns the aesthetic, and the deliverable is a RANKING inside it, not a new look.

Shots `…/pass3/shots/C-*.png` · rig `…/pass3/rig3/` · dists `…/pass3/dist-{base,head}`.

**Four commits, all on MAIN, nothing pushed:**

| commit | what |
|---|---|
| `043b94c0` | the pose prune — a frozen `HandDrawnOutline` mints one node and promotes nothing |
| `127fde0d` | the option chips announce their selection |
| `e982a403` | the zone grammar — six co-equal eyebrows become two, and the rest change rank |
| `573317aa` | the gates — a name census that reads RANKS, and the check machine's first tests |

---

## 0 · What shipped, and the two things that shipped by NOT being built

Six display-caps eyebrows at one rank became **two eyebrows + three taped compartment names +
two quiet row captions** — seven names at three ranks where six shouted at one. `pencils` takes
marks AND candidates (candidates *are* pencil marks — the engine's, beside yours); `teacher's`
keeps only checking, which is what lets its status line be about one thing and why its row
carries no caption at all. That is the taxonomy paying for itself, and it is the whole reason
the census lands at seven rather than eight.

**The pen executed its default: DELETED.** `CHECK_RENDERING` is gone with the branch it
switched — one rendering, no switch, no loser beside the winner (−42 code lines against pass 2).

**The interior settle is WITHDRAWN, not deferred** — the zero-LOC ruling of this lane. Three
reasons, none of them "we ran out of time": the pass-3 stall lane attributed the drawer gesture
to a raster re-bake that blocks WebKit's main thread **188–233 ms on desktop Safari**, so posting
a 120 ms interior choreography inside that glide is the wrong move until the stall is cured;
below 1024 there is no drawer at all (blast §2.5), so the settle could only ever have served the
rail; and the registry's own narrowing named wells, washi, the heading collapse and the donor
deletions — not motion. A blocking gap closed by subtraction, and the `useControlsDrawer`
coupling the panel would have grown never happens.

---

## 1 · THE NUMBERS — built dists, both engines, regime asserted before any figure is banked

`rig3/measure.mjs`. Every cell carries `regimeOk` from three independent observables
(`mqCoarse` · `mqHover` · the coarse-only written sublabel, scoped `:not(.deal-btn)` because
Deal's is `display:block` at every pointer by design). **All ten cells green in both engines.**

| cell | base → head (chromium) | (webkit) | Δ |
|---|---|---|---|
| **390×844 coarse** | 590.94 → **558.39** | 590.88 → **558.39** | **−32.55 / −32.49** |
| **375×812 coarse** | 590.84 → **558.27** | 590.78 → **558.27** | −32.57 / −32.51 |
| **1280×800 coarse** (iPad row regime) | 1098.25 → **1070.36** | 1098.16 → **1070.33** | −27.89 / −27.83 |
| 1280×800 fine (rail) | 996.34 → 968.45 | 999.25 → 971.42 | −27.89 / −27.83 |
| 390×844 **fine — NEG CTRL** | 456.42 → 423.88 | 456.34 → 423.86 | the pass-1 harness, on demand |

The negative-control row is the point of the pattern: same build, same viewport, `hasTouch` off,
and the panel reports **423.88** where the real regime reports 558.39. A number without its
regime is not a number.

| gate | base | head |
|---|---|---|
| names on the card | 6, **all one rank** | 7 at **three** ranks: 3 tape / 2 eyebrow / 2 caption |
| `.section-heading` (the eyebrow rank) | 6 | **2** — `Size`, `Difficulty` |
| smallest chip, coarse 390 | 43.2 (chromium) / 43.7 (webkit) | **44.0 / 44.0** |
| chips with no announced selection | 14 rail / 11 phone | **0 / 0** |
| live-filtered surfaces (`filter-census`, built dist) | 9 | **9** — zero new, gate green |

## 2 · THE POSE PRUNE — one primitive, three lanes

`frameCount` sibling poses carrying `will-change: opacity` exist for the SWAP. An outline that
never swaps bought nothing and paid four permanently promoted layers per mount. Posed instances
come in two kinds and the difference is only visible over time (a flank is frozen forever; the
one live gallery card is beat-driven), so every posed instance **starts pruned and expands on its
first pose CHANGE** — a one-way latch, no new prop, no new contract.

Gallery deep-link, built dist, chromium (`rig3/gallery-poses.mjs`):

| | painted pose nodes | promoted layers | live card |
|---|---|---|---|
| base | 24 | 24 | 4 poses |
| head | **12** | **8** | **4 poses — the latch fires** |

In the panel the three new wells cost **3 painted nodes and 0 promoted layers** where they would
have cost 12 and 12. Unposed consumers — grid, drawer tab, error note, scene cards — are
untouched, and **B inherits this against its idle long-frame regression** (registry §4's
`B+F1§2 → C` graft, paid back the other way).

## 3 · INSTRUMENT DECONTAMINATION — and it caught its own operator

Two contaminations were real, and the fixed instrument proves it:

1. **Density over the LAYOUT box is not a property of a mark.** `.section-heading` is
   `text-align:left` at container width, so wrapping it in a well narrowed its box by 16px and
   its density rose ~4.7% with nothing drawn differently. The denominator is now the **tight
   bounding box of the inked pixels**.
2. **An element screenshot captures whatever paints in that rectangle** — and the zone tape
   straddles the well's top edge, so the first heading's clip caught the tape and read **+40%
   tighter-area** in head against base. Non-tape targets are now captured with the tapes
   suppressed, and the suppression is **proven** non-reflowing: the target's own rect is asserted
   identical with and without it (`rectStable: true`, every target, both builds).

References are pinned **by rendered text** (`difficulty`, `size` — present in both panes), never
by position or class-absence. Pass 2's probe was `.section-heading:not([class*=crayon])`, which
selects "New game" in base and "Size" in head: the denominator moved with the treatment.

Decontaminated, base and head report **byte-identical** numbers for every shared reference —
`heading_difficulty` 682.65 mass / 3405.25 tight / 0.20047 density in both, `heading_size`
242.61 / 1010 / 0.24021 in both, every `deal_*` identical. That equality is the proof, not the
assertion.

## 4 · ITEM 3, ANSWERED IN THE METRIC THE ORDER NAMES — and no move made

| mark (chromium · webkit) | mass | density (tight) |
|---|---|---|
| Deal die | 138.13 · 138.53 | **0.22101 · 0.22165** |
| `difficulty` eyebrow | 682.65 · 677.74 | 0.20047 · 0.19980 |
| `size` eyebrow | 242.61 · 240.52 | 0.24021 · 0.23580 |

**By density the die already out-inks the heading it commits, in both engines, with zero change
from this lane** — Lane D's cascade cure did it by restoring the die to its declared 28px.
**By mass it is 4.94× lighter and always will be:** a ten-glyph word at the heading rung carries
more ink than any 28px glyph, and the box cannot grow (`.icon-btn` is `height:auto` at coarse, so
every px of glyph is a px of card). The order's metric cannot be met by any icon against a word
without a bigger icon, which the coarse regime forbids — so it is argued openly rather than
substituted quietly, and **pass 2's stroke-weight bump is NOT ported.** Deal's rendered ink is
byte-identical to base across the whole diff.

Conceded, unchanged from pass 2: the well gives Deal a home and a name; it does not un-orphan it
from the air it sits in. That is a composition row, still open.

## 5 · THE DARK TAPE — the inbound row, closed on the evidence it was waiting for

`blast-radius.md` §2.7 held `--sheet-washi-neutral`'s dark arm open for a **dark rendered shot**.
This lane triples the token's consumers, so it took the shot: `shots/C-*-dark-*`, both engines.
Every taped word had the drawn frame running **straight through it** — the highlighter strike
RESULTS §3 M5 recorded, with the 8.96:1 that "does not capture it".

The mechanism, named: the light arm is a near-opaque film (**α 0.83**) sitting a shade under the
paper — a physical object. The dark arm was a **14% veil**. Same recipe, α matched at 0.92, over a
value that sits just above `--color-card`. Composited (`rig3/contrast.mjs`): ink-on-tape
**8.96 → 9.07**, tape-vs-card 1.77 → 1.75. **The ratio was never the defect; the opacity was** —
which is exactly why the row could not be discharged by a number and had to wait for a render.
Light arm byte-identical (α 0.83, 17.36:1).

## 6 · GATES — one run, on the committed tree, after the last edit

vue-tsc **0** · vitest **313 / 30 files** (was 301/29: +9 `CheckStatus.test.ts`, +3 panel rows) ·
eslint · knip · prettier(`src/`) · `test:font-coverage` 28 codepoints / 13,788 B · `lint:ink`
4 rungs green · **default e2e 84 / 84** (was 78 — six `zone-grammar` rows) · **built-dist lane
13 / 13** (filter-census 3, theme-bake ×2, wordmark-webkit 6) · `test:golden:bytes` PASS ·
`npm run build` green.

**Goldens, with a control.** `playwright-golden.config.ts` on darwin reds `logo-light` — and it
reds **identically against the BASE dist built at `2335282c`**, served the same way, 3 passed /
1 failed in both, twice. Pre-existing, unmoved, **nothing re-baselined**; `toggle-crest-dark`,
`cell-light` and `grid-corner-light` pass on both. No golden clips a control panel (blast §0).

The census gate carries its own negative control: an injected `.section-heading` inside a well
moves the count, so the counter is shown able to see what it claims to count.

## 7 · LOC — code-only, same stripper both sides

| | code-only |
|---|---|
| `GameControlPanel.vue` | 842 → 1020 (**+178**) |
| `CheckStatus.vue` (new, ONE rendering) | **+43** |
| `SheetWashiLabel.vue` · `HandDrawnOutline.vue` · `index.css` · `OptionSelector.vue` | +20 · +17 · +17 · +1 |
| 5 scene relays · font corpus | +5 · −8 |
| `AssistSettings.vue` + `PencilModeToggle.vue` **deleted** | **−99** |
| **product total** | **+174** |
| gates: `zone-grammar.spec.ts` +186 · `CheckStatus.test.ts` +52 · panel rows +38 | **+276** |
| **total** | **+450** |

The named closure is unchanged and still uncashed: **~half of `GameControlPanel`'s +178 is the
well markup written twice, once per template branch.** Pass 1's banked T′ collapse takes most of
it back; it widens the diff across every panel surface, so it stays the first thing to cash if
the family advances — not a design pass's work.

## 8 · WHAT IS OPEN, PLAINLY

1. **Mark 1 (picker hierarchy) is not addressed and not claimed** — Lane A's.
2. **Deal is homed and named, not un-orphaned** (§4) — a composition row.
3. **The rail's `new game` well is tall and airy** on desktop: it holds both staged stanzas plus
   Deal, and the frame makes the air visible where the flat stack hid it. Unmeasured as a defect;
   named because the shot shows it.
4. **No on-device cell in this lane.** The rig session was unlocked and the stall lane used it;
   this lane's claims are geometry, DOM and composited colour, which two headless engines agree
   on to within 0.1px — and M5 stands as the standing reminder that agreeing headless engines are
   not evidence about Safari.
5. **`--sheet-washi-neutral` dark is shipped on a rendered shot, not a device shot.** If the
   owner's Safari read differs, the arm is one line.
6. **Names on the card are 7, not 6.** The claim is a RANKING, gated as one; anyone who wants the
   COUNT down has to delete a control's name, and both remaining captions name a control that
   shares its compartment.
