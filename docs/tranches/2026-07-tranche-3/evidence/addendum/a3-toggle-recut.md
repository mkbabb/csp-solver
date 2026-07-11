# Lane a3-toggle-recut — the toggle re-cut + spiral revert (findings 3+4)

Owner audit 2026-07-11, mid-wave tree (W10 uncommitted). Owner verdicts overrule wave content.
Spec only — nothing here ships from this lane.

Evidence base: code trace of both states (browser extension was not connected, so no live
mid-flight capture; the owner's own shots stand in for the live tree) plus the owner's
screenshots at `/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/owner-audit-2/`.
The committed BEFORE toggle is extracted verbatim to
`/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/before-DarkModeToggle.vue`
(= `git show 08f3ddd9:web/frontend/src/pencil/celestial/DarkModeToggle.vue`, 300 lines).
Working-tree file: `web/frontend/src/pencil/celestial/DarkModeToggle.vue` (586 lines).

---

## (a) BEFORE — the committed pre-W10 toggle (08f3ddd9), traced both directions

One gesture, not a play. Both icons are absolutely stacked (before:184–191) and transition
**simultaneously** the instant the theme flips:

- **Theme flips at click.** `handleToggle()` is one line — `toggleDark()` (before:150–152).
  The page snaps; the icons whirl. Zero deferral, zero phase machine.
- **Outgoing body** (loses `.is-active`): transform 800ms spring
  `cubic-bezier(0.34, 1.56, 0.64, 1)` to `translateX(-50%) rotate(-270deg) scale(0.1)`;
  opacity 800ms with a 100ms delay — it stays substantially visible most of the way out
  (before:194–199, 209–214).
- **Incoming body** (gains `.is-active`): the mirror — it whirls IN from that same parked
  pose, un-spinning -270°→0° while growing 0.1→1 on the same 800ms spring, opacity in over
  300ms (before:201–206, 216–221).
- **Both directions symmetric** — sun→moon and moon→dark are the same choreography with the
  roles swapped; the CSS is identical per icon.
- **The double-exposure IS the charm**: for ~300–700ms both bodies are on stage at once,
  pinwheeling past each other. The -270° whirl + spring overshoot is the storybook
  page-turn — the toy-like energy the owner calls Yoshi's Story.
- Spiral: inline `#F0B030`, stroke-width 10, outer coil kissing the disc edge
  (before:32–35). Filter binding conditional on the active body (before:14, 59).
- Crest: **~800ms**, one clock (CSS transitions), no rAF sequence involvement.

## (b) W10 working tree — what specifically reads ruined

W10 rebuilt the toggle as "Set-and-Rise": five serialized beats on four
`createSequenceSubscription` clocks, crest ≈1.25s (tree:144–165, BEATS at 158–165).
Squash 120ms → SET 420ms (outgoing sinks below a porthole rim, easeInCubic,
`translateY(58%) rotate(-28deg)`, tree:435–442) → DUSK (deferred `toggleDark()` at the
360ms crossover, tree:301–312) → RISE 580ms (incoming springs up from below, tree:456–461)
→ IGNITE 310ms (stars pop staggered, tree:463–497).

Ranked, what killed the storybook feel:

1. **The stage goes empty.** SET fades the outgoing over its last 126ms (tree:439–441)
   while the incoming is parked at `opacity: 0` "staged" (tree:448–451). Around
   ~300–420ms the button is effectively BLANK — a dead beat at the exact center of the
   gesture. The before-cut never left the stage empty; the double-exposure crossfade W10
   deliberately eliminated (the staged-transparent fix, comment tree:444–447) was the charm,
   not the bug.
2. **The deferred theme flip reads as lag.** Click → 360ms of nothing happening to the
   page (tree:301–312, `pendingFlip` tree:175). Dramaturgy at the scale of a 5rem button
   registers as input latency, not drama.
3. **The whirl is gone.** A vertical set/rise under an `overflow: hidden` porthole
   (tree:382–384) replaces the -270° spin. Sunset astronomy instead of a toy page-turn —
   solemn where it should bounce.
4. **1.25s is past toy-time.** 800ms → 1250ms, +56%; and a re-click mid-flight hard-snaps
   via `settleNow()` (tree:325–327), so an impatient second click lands with a jolt.
5. **Machinery.** ~130 lines of phase state (phase/outgoing/visualDark/ariaDark/
   pendingFlip/handles, tree:167–341) for what CSS transitions did alone. More surface,
   less life.

What W10 got RIGHT (salvage list): the 120ms anticipation squash (tree:386–395); the
staggered star/sparkle pop idea (tree:467–497); the 350ms world-dim color ease
(`html.theme-turning`, index.css:379–390); the PRM contract — immediate flip, 200ms
opacity crossfade (tree:325–337, 533–561); rest-state `visibility: hidden` on the parked
icon + the unconditional wobble binding it enables (tree:17–22, 411–424).

### Finding 4 — the spiral (sun-spiral.png)

`sun-spiral.png` shows the live tree: the spiral reads as murky same-value ochre on the
orange disc. The S2 rationale claimed the before-gold "was 1.17:1 on the disc, nearly
tonal" (pencilConfig.ts:41–42) — but measured, **S2 made the stated metric worse**:

| pair | WCAG contrast vs disc core #F09855 |
|---|---|
| #F0B030 (before) | **1.175** |
| #DF9A1E (W10 S2) | **1.063** |

The deepening traded the bright yellow-on-orange HUE pop (which carried the before-spiral)
for a lower-luminance ochre that sits at the disc's own value. The owner's "awful" is
quantitatively right. Overruled; revert.

---

## (c) THE RE-CUT SPEC — "the old animation, but the moon lands like a plush toy"

Base = the BEFORE shape verbatim (its 800ms simultaneous whirl-crossfade, its
flip-at-click, its spring curve). Yoshi's-Story energy added ONLY where it adds life:
the anticipation squash, the plush landing, the star stagger, the world-dim ease.
No phase machine, no porthole, no deferred flip, no sequence clocks.

### Beat table (both directions symmetric; total crest ~950ms)

| t (ms) | beat | motion | source |
|---|---|---|---|
| 0 | **CLICK** | `toggleDark()` fires — theme, aria, paint all truthful at click. `html.theme-turning` goes on for ~400ms: body + sheets ease colors 350ms instead of snapping (keep index.css:384–389, re-anchored to click). | BEFORE + W10 dusk ease |
| 0–120 | **SQUASH** | button-level anticipation squash (scale 1→0.94→1, spring curve) — OVERLAPS the whirl, never precedes it. | W10 keep (tree:386–395) |
| 0–800 | **WHIRL OUT** | outgoing: transform 800ms `cubic-bezier(0.34, 1.56, 0.64, 1)` → `translateX(-50%) rotate(-270deg) scale(0.1)`; opacity 800ms delay 100ms. | BEFORE verbatim (before:194–199) |
| 0–800 | **WHIRL IN** | incoming: the mirror — parked pose → identity on the same spring; opacity in 300ms. Both bodies on stage together; the stage is never empty. | BEFORE verbatim (before:201–206) |
| ~500/580/660 | **STAR POP** | stars/sparkles suppressed for the whirl's first ~500ms, then pop staggered +0/+80/+160ms (scale 0.2→1, 150ms pop curve `cubic-bezier(0.68,-0.55,0.265,1.55)`) — they land during the body's overshoot. Pure CSS `transition-delay` off `.is-active`; no IGNITE beat, no clock. | W10 ignite, folded in (tree:467–487) |
| ~800–950 | **PLUSH LAND** | incoming settles with one squash-bounce tail: scaleX 1.05 / scaleY 0.95 → 1 over ~150ms as the spring resolves. The moon lands like a plush toy. Implement as a whirl-in keyframe animation (rotation+scale+the tail in one track) replacing the incoming transform transition. | new, the one addition |

### Implementation contract

- **JS returns to near-BEFORE size**: `handleToggle()` = flip + squash class + a single
  ~800ms cleanup (an `is-leaving` class on the outgoing so `visibility` stays live while
  it whirls out; cleared on `transitionend`/`animationend`). No
  `createSequenceSubscription`, no `pendingFlip`, no `visualDark`/`ariaDark` split, no
  `settleNow()`. Re-click mid-flight just re-triggers — CSS transitions retarget smoothly,
  which the before-cut got for free.
- **No `overflow: hidden`** on the button in any state (drop tree:382–384).
- **Cut `createStrokeDrawIn` on the crescent detail** (tree:89–95, 270–299): at scale
  0.1→1 mid-whirl a 350ms stroke draw is illegible; the stroke is simply present.
- **Keep**: rest-state `visibility: hidden` on the parked icon + the unconditional
  `filter="url(#wobble-celestial)"` binding (tree:17–22) — the whirling outgoing body
  keeps its wobble; at rest the hidden icon's filter region costs nothing.
- **PRM**: keep W10's variant exactly — immediate flip at click, 200ms opacity crossfade,
  no transforms, stars appear with the moon (tree:533–561). It already matches the
  before-cut's PRM contract.
- **Band**: back to Band C/D boundary — one ~950ms user-triggered one-shot;
  docs/animation.md's Band-D row reverts from "theme set-and-rise ≈1.25 s" toward
  "theme page-turn ~950ms" (W10 changed it at docs/animation.md:26).

---

## F4 slight-pass per-edit disposition

| edit | what W10 did | where | disposition | reason |
|---|---|---|---|---|
| **S2** spiral color | #F0B030 → #DF9A1E | pencilConfig.ts:47 | **REVERT verbatim** to `#F0B030` | Owner-overruled by name; measured, it LOWERED contrast vs the disc (1.175→1.063) — the hue pop was the charm. |
| **S1** spiral geometry | path recut (terminal curls, coil ends short of the edge), sw 10→9 | tree:43–46 vs before:32–35 | **REVERT** to the before path + sw 10 | "As it was before" names the spiral as a gestalt; sw 10 and the edge-kissing coil are part of what read as before. A kept-geometry/reverted-color hybrid is a third state that is neither. |
| **S3** sparkle stroke | 1.5→3, stroke #F0B030→#D99A10 | tree:53–63, pencilConfig.ts:48 | **KEEP** | 1.5 units was 0.6px at the 5rem raster (sub-pixel); the diamonds read cleanly in the owner's own sun-spiral.png and drew no complaint. |
| **W1** outline +1 | sun disc 5→6, moon body 6→7 | tree:40, tree:86 | **KEEP** | Raster legibility at 80px; invisible as a change in the owner's shot. The "outline was changed" verdict (boil-hairline.png) is the controls card's HandDrawnOutline — a different surface, a different lane. |
| **M1** horn taper | lower horn tapers to a point | tree:84–87 vs before:63–66 | **KEEP** | Pure draftsmanship on the crescent; no complaint, no shot implicates it; sharper horn = more plush-toy, not less. |
| **M2** cusp + detail stroke | closing control eased 65,40→66,42; inner stroke moved down, 4→3.5 | tree:85, 93–94 | **KEEP the geometry, CUT its draw-in** | The repositioned stroke no longer crowds the tip — good; its IGNITE-beat draw-on dies with the choreography (see re-cut). |
| **M3** dot-star temp | #FFFFFF → #FFF4AA | pencilConfig.ts:50, tree:115–117 | **KEEP** | One temperature with the crescent and star polygons (15.6:1 on dark vs white's 17.4:1 — still far past legible); no complaint. |
| **F4-F1/D4** filter binding | wobble bound unconditionally on both icons | tree:17–22, 78 | **KEEP** | Required so the outgoing body keeps its wobble mid-whirl; rest cost nulled by `visibility: hidden`. |
| **S5** ray inset | upstream pencil-boil note only, no repo change | tree:25–27 comment | **N/A** | Nothing in-tree to keep or revert. |
| dusk ease | `html.theme-turning` 350ms color ease | index.css:379–390 | **KEEP, re-anchored** | The world easing instead of snapping is real life-adding restraint — but the class goes on AT click (flip included), never as a deferral. |
| squash beat | 120ms anticipation squash | tree:386–395 | **KEEP, overlapped** | The best Yoshi's-Story beat W10 added — as a concurrent accent, not beat 0 of a serial play. |
| choreography core | phase machine, 4 sequence clocks, porthole clip, staged opacity-0, deferred flip, IGNITE beat | tree:144–341, 366–504 | **CUT wholesale** | The five findings in (b); the re-cut replaces it. |

## Cross-lane notes

- The spiral revert touches `pencilConfig.ts:47` (`spiral` key returns to `#F0B030` — keep
  the key; it's now consumed by tree:45). CelebrationStar draws from the same family
  (pencilConfig.ts:37–40 comment); reverting `spiral` doesn't touch `rays`/`sparkle`, so
  no celebration-side effect.
- W10 may commit mid-addendum: this spec is stated against the working tree as read
  2026-07-11; every tree:N cite is from the uncommitted 586-line DarkModeToggle.vue.
- boil-hairline.png (finding 2) shows the controls card outline, not the toggle — noted
  here only to keep W1 from being over-swept into that verdict.
