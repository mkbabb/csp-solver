# MOT-LADDER — pass-2 adversarial critique

Critic: not the author of the spec or the prototype. Every number below that is labelled
CRITIC was measured in this lane, on a dist I built myself from the prototype worktree
(`.claude/worktrees/wf_8630d340-e56-60`, HEAD `446037a8` = `a8fee1f5` + W8 C06, the
MOT-LADDER diff uncommitted on top), served at `127.0.0.1:4244`, against the MAIN TREE's
frozen dist (`web/frontend/dist`, `index-9rZPzI5DEcpe.js`) served at `127.0.0.1:4245` as the
pi control. chromium + webkit, headless, both regimes, four poses. Both servers killed; the
band reads zero listeners. The prototype worktree is byte-identical to how I found it
(`36 files, +309/−126`, two untracked scripts) after four sabotages, each restored.

**Verdict: ADVANCE at 78%.** The family is real, the prototype runs, the PRM cure is the
best-evidenced thing in this pass. It is not converged: I broke the gate's central promise
twice with two-line sabotages, and two of its own gates go back RED with no cure.

---

## 1 · What I re-measured, and what held

| claim | prototype | CRITIC (chromium / webkit) | verdict |
|---|---|---|---|
| ONE `<style data-motion-rungs>` | count 1 | 1 / 1 | HOLDS |
| seven rungs at `:root` | 150/200/250/350/440/520/600 | identical / identical | HOLDS |
| every rung 0ms under `reduce` | 7×0ms | 7×0ms / 7×0ms | HOLDS |
| no inline `--motion-*` on `<html>` | asserted | false / false (nothing inline) | HOLDS |
| Tailwind's default tier joins the ladder | `--default-transition-duration` reads whisper | 150ms → 0ms under reduce / same | HOLDS |
| a real rung consumer collapses | `.icon-btn`, `.transition-colors` | `.icon-btn` 0.15s→**0s**, `.transition-colors` 0.2s→**0s** | HOLDS |
| **the same elements on MAIN's dist** | (control) | `.icon-btn` 0.15s→**0.15s**, `.transition-colors` 0.2s→**0.2s** under reduce | the cure is REAL |
| dock clock 600, desk clock 520 | `glideMsFor` | WAAPI asked 600 @390×844 & 768×1024, 520×4 @1440×900, both engines | HOLDS |
| dock worst 60Hz frame @600 | 72.5 / 78.5 | 72.5 / 71.2 @390×844, 78.6 / 77.3 @768×1024 | HOLDS |
| desk travel unmoved | 209 / 213px | 209 / 213px, clocks 520 | HOLDS |
| settle: 0 running anims, rest rect | banked | 0 running; rects `{0,216,390,628}`, `{0,342.98,768,681.02}`, `{710,176.98,330,640}` — **equal to MAIN's dist to the pixel** | HOLDS (pi) |
| G-TONGUE RED at HEAD's value | 157–163px | 163.0px @t=9.9ms / 154.0px @t=15ms | HOLDS (still RED) |
| colour untouched | hue-census byte-identical | every `--color-*` declaration in `index.css` diffs EMPTY against main; zero paint values in the diff | HOLDS (AA by construction) |
| M16 | lint:copy GREEN | `check-copy-register` 0 em/en dashes, 0 unadmitted jargon (2 admitted) | HOLDS |
| filterBudget 9 | census 12/12 | `filterBudget.ts` absent from the diff; no filter/paint value moved | HOLDS |
| vue-tsc 0 / lint:motion | 0 / GREEN | `vue-tsc --noEmit` exit 0; `lint:motion` GREEN, 34 specs | HOLDS |
| eleven gates GREEN, self-test | 16/16 models RED | gate exit 0; `--self-test` 16 models each RED | HOLDS |
| bundle | +2,130 B raw / +373 B gz | my rebuild's entry CSS = **95,517 B**, exactly the banked after-figure | HOLDS (ceiling still missed) |

The prototype's returns are honest. Nothing it reported was inflated, and three things it
called gaps really are gaps.

---

## 2 · What I broke (the gate does not enforce its own promise)

### 2.1 · B6 cannot see a rung shortening. The `throw` ruling is unguarded.

The family's stated covenant is that a PINNED rung "re-auditions the ruling by name" and
that "the gate's banked inventory is the ratchet that makes a silent shortening visible."

CRITIC, on the real tree: `throw: 520 → 500` in `pencilConfig.ts`, plus `sed` over `src/`
rewriting every `var(--motion-throw, 520ms)` fallback to `500ms` (16 files, exactly what a
retune script does). Gate run bare:

```
ladder 7 rungs (… throw 500, rise 600)
✓ B1 ✓ B2 ✓ B3 ✓ B4 ✓ B5 ✓ B6 NO-SHORTEN ✓ B7 ✓ B8 ✓ B9 ✓ G-DOCK-BAND ✓ G-GUARD
GATE_EXIT=0
```

Every gate green, including the ratchet. Cause, read off the bank: `motion-inventory.base.json`
holds **zero rows at 520ms** (histogram: 150×18, 200×14, 250×8, 500×6, 350×4, 240×4 …, 440×2,
600×1). The `throw` rung's CSS consumers were 500ms at the wave base, so lowering the rung to
500 shortens nothing the ratchet banked, and its two *real* consumers (`useControlsDrawer`,
`App.vue`'s fold) are TS and outside the inventory entirely. The PINNED policy is a comment;
no gate reads it. R6 standing ruling 1's number can leave the tree silently.

(Half-sabotage, for the record: lowering only the rung, leaving fallbacks at 520, reds B3
alone — 5 drifted fallbacks. So the mirror is the only thing standing between the estate and
a silent retune, and it falls the moment the retune is done properly.)

### 2.2 · B1's scope is CSS declarations. A TS gesture clock is not on the ladder.

CRITIC, on the real tree: planted in `useCarouselGlide.ts`

```ts
const SABOTAGE_MS = 777;
export function sabotageGlide(el: HTMLElement) {
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 777, easing: "ease" });
  window.setTimeout(() => el.classList.remove("x"), SABOTAGE_MS);
}
```

Gate: **all eleven GREEN, exit 0.** `DECL` is `/(transition|animation)([a-z-]*):/`, so a WAAPI
`duration`, a choreography `setTimeout`, and a component-local timing const are all invisible.
B2 catches a stray only if it lands inside `MOTION` or a `pencilConfig` TS set. That is the
one place the estate's real clocks live: the drawer's, the carousel's, the fold's, the
chrome-leave window, the deal's delay, App's 900ms seam guard. Today they read `MOTION` by
convention; tomorrow's `const GLIDE_MS = 600` reads nothing and the gate applauds.

This is the difference between "every CSS length is a named decision" (proven) and the §13
claim "one home for every length" (not proven).

### 2.3 · R6 standing ruling 1 is moved and not proposed.

`r0/r6-idiom-history/R6-census.md` ruling 1: *"The drawer's curve is `cubic-bezier(0.32,0.72,0,1)`
**at 520ms** — the glass family, zero overshoot."* No pose scope; ruling 2 fences the curve to
the drawer, not the number to the desk. `rise` 600 is the drawer at `<1024`, so the ruling's
number moves for that pose. `instruments/R6-moved-rows.diff` proposes two rows (the guard
ribbon, law 4) and names law 43 without cutting it. Ruling 1 is not in the diff at all.

### 2.4 · The law-4 row as drafted cites the constants it kills.

The proposed hunk reads:

> **No timing constant outside `pencilConfig`: `MOTION.rungs` (seven: …), `beatMs`,
> `settleGuardMs`, and the CELEBRATION budget** (`cardStepMs 440`, `boardFoldMs 520`,
> `chromeLeaveMs 200`, the CELEBRATION budget).

The old parenthetical survives inside the new row, so the record would name three dead keys
and the celebration twice. A record row that cannot be read is worse than the one it replaces.

### 2.5 · The dock's quality claim is worst-frame only, and the frame COUNT rises.

CRITIC, paired dists, 60Hz resample: @390×844, MAIN 82.2px worst / **6** frames >40px →
prototype 71.2–72.5px worst / **7–8** frames >40px. @768×1024, MAIN 89.2 / 7 → prototype
77.3–78.6 / 7. The worst frame falls 12–13% at every pose (real, and reproduced in both
engines). The number of frames the eye sees above 40px does not fall; at the portrait phone
it rises by one, because the gesture is longer. The spec's sentence "the band's only >40px
frame to zero" describes 844×390 only, and the prototype's own delta already concedes that
pose was under 40px at 520. So `rise`'s case rests on a worst-frame improvement with no
stated perceptual threshold — which is fine as an owner proposition (U-10), and not fine as
"the QUALITY LAW forbids the alternative".

---

## 3 · Checklist

- **gates that cannot fail** — HIT ×2: B6 over the `throw` rung (§2.1), B1/B2 over every TS
  clock (§2.2). B9 is additionally vacuous in this diff: zero rungs appear in a delay
  position at HEAD or after, and its only RED lives on a sibling family's branch.
- **the constraint it forgot** — HIT (soft): R6 ruling 1 (§2.3). AA, filterBudget, M16, W2's
  landed mechanics: CLEAR, measured.
- **unverified gestalt** — HIT: 15 of the 16 B8 curve swaps change the painted mid-flight
  progress (bare `ease`/`ease-out` → `--ease-standard`/`--ease-drawOn`, the spec's own bound
  max dProgress 0.375) and are defended by arithmetic with zero frames banked. The *one*
  place the family demanded byte-identity, it earned it honestly (`--ease-dusk` =
  `cubic-bezier(0.25,0.1,0.25,1)` = the CSS spec's own `ease`, resolved live on
  `html.theme-turning`). The other fifteen did not get that standard, or a single look.
- **the pixel it moves that it did not declare** — CLEAR. Rest rects equal main's dist at
  four poses; colour tokens diff empty; the moves that do paint (guard ribbon 240→250, five
  500→520 followers, the deck's leave curve, the dock 520→600) are each declared, and the
  ribbon's is proposed as an R6 MOVED row.
- **legacy aliases** — CLEAR. `cardStepMs`/`boardFoldMs`/`chromeLeaveMs`/`GLIDE_MS`/
  `--card-step-ms` and its single-quoted publisher are gone, not renamed.
- **masked fallbacks** — CLEAR, and deliberately so: `var(--motion-x, Nms)` fallbacks are
  byte-equal to their rung and B3 holds them there, so a missed publish is a no-op. The cost
  is named in §4 (it is the bundle ceiling).
- **consumer-less substrate** — SOFT HIT: `rise` has exactly one consumer and is a proposal;
  the `RETUNE` class is empty by design (defensible: it is the lawful door B6 reads).
- **vacuous convergence / spec-cites-itself / elegant reduction / generic default** — CLEAR.
  The gate is born-RED at 129 control failures, 13 sabotages were run against real files, and
  the tongue ruling was refuted by its own author's measurement and reverted with the numbers
  written into the product comment. That is the opposite of vacuous.
- **fold collision (new)** — `gameCell.css` IS touched (two `marks-fade-in` rows now read
  `var(--motion-note, 250ms)`) although both the plan and the spec say "Nothing in
  gameCell.css"; the file is MRK-LIVE's under chair §6.11. Two lanes, one file, one fold.

---

## 4 · Strengths worth banking

1. **PRM as a value of the ladder, proven against the true control.** On MAIN's dist under
   `reduce`, `.icon-btn` still tweens 0.15s and `.transition-colors` 0.2s; on the prototype
   both read 0s, in both engines, with no per-component `transition: none` arm. Deleting
   pass-1's four hand-written PRM arms is the right direction, not a shortcut.
2. **The publisher's posture is argued from a measurement** (inline outranks the reduce arm),
   not from taste, and the `<style>` node is one node with the text generated from the rungs,
   so B3's mirror is byte-equal by construction.
3. **The tongue refutation.** §1.7's ruling was built, measured (the `#drawer-handle` berth
   sits 92px above the risen sheet at every frame; deferring the swap bought 371.7px at
   t=595ms), reverted, and the refuting numbers left in the source comment. My own trace
   reproduces HEAD's onset jump (163.0 chromium / 154.0 webkit) on the reverted tree.
4. **The content-anchored ADMITTED ledger, closed both ways** (`file :: literal :: nearby
   stable string`), after line cites rotted four times in one pass.
5. **13 negative controls applied to real files**, plus a 16-model self-test — the honest
   shape. The two holes in §2 are holes in the gate's *scope*, not in its discipline.

---

## 5 · The open gaps (each closable)

See the returned `openGaps`. In one line each: bank a 520ms row (or key the ratchet on the
rung itself) so `throw` cannot fall silently; widen the collector past `transition:`/
`animation:` to WAAPI `duration` and gesture `setTimeout`s, or state in §13 that the ladder
governs CSS only; propose R6 ruling 1 as MOVED; re-cut the law-4 hunk without its stale
parenthetical; state the dock's acceptance criterion in frames-over-threshold as well as
worst frame; take the bundle ceiling to the owner as `var()`-fallbacks vs +1,597 B of CSS;
look at the fifteen curve swaps once, on the real surface; hand `gameCell.css`'s two rows to
MRK-LIVE or take them out of this diff; and the three the prototype already owns (the exit
mirror at 390×844, the tongue with no cure, the theme-flip paint identity).

## 6 · Cross-pollination

The ratchet-bank-plus-RETUNE-door pattern, the content-anchored ledger, "the reduce arm is a
value of the token, not a second mechanism", the real-file negative-control shell script, and
the build-the-ruling-then-refute-it-with-its-own-trace discipline all belong to other families
this pass. Named in the returned `crossPollinate`.

---

### Provenance

- CRITIC readings: `critique/MOT-LADDER/readings/critic-chromium.json`,
  `critic-webkit.json`, `critic-MAINDIST-chromium.json`; probe:
  `critique/MOT-LADDER/probe/critic-probe.mjs` (mine, not a copy of the lane's), scratch vite
  config `probe/vite.critic.mjs` with a private `cacheDir`.
- Dists: prototype built by me to the scratchpad (entry JS 215,878 B, entry CSS 95,517 B —
  equal to the lane's banked figures); control = main's frozen `dist`, served read-only.
- Frozen record untouched: `git status` over `loop/r0` is clean; no file under `loop/pass1`
  modified. Zero crops banked.
