# MOT-VERB — pass 3 CRITIQUE (adversarial, non-author)

Subject: the pass-3 prototype in `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-6`
(29 tracked files +463/−129, 3 untracked new files), cut from `74a2b5d9`, plus its README and
readings under `pass3/prototype/MOT-VERB/`. Chair's rulings read first. Everything numbered below
that says **(critic)** was measured by me on my own server, port **4241** (band empty before and
after), chromium AND webkit headless, against the prototype's own `dist`
(`index-B9a19ksbyZ8B.js`, entry hash verified over HTTP, the same build the README names).

**CONVERGENCE: 71** (pass 2: 72). The four holes pass 2 named are genuinely closed and each control
fires. They were closed on a tree whose flagship surface — the dusk — does not paint at all, and
every gate in the estate, including this family's own, is green over it.

---

## 1 · THE FINDING THAT DECIDES THE NUMBER — the dusk is dead on its own surface

`src/assets/index.css:716-717` ships:

```css
@media (prefers-reduced-motion: no-preference) {
  html.theme-turning body, html.theme-turning .bg-background, html.theme-turning .bg-card,
  html.theme-turning .action-bar, html.theme-turning .drawer-tab-tongue {
    transition:
      background-color var(--verb-dusk-ms) var(--verb-dusk-ease),
      color var(--verb-dusk-ms) var(--verb-dusk-ease) !important;
  }
}
```

`--verb-dusk-ms` is **referenced 2×, defined 0×** — in `src/`, in the config, in the published
block, and in the shipped dist (`grep -c -- "--verb-dusk-ms:" dist/assets/*.css` → 0 in all seven
stylesheets). The family's own §1.3 headline is that this token *dies*: "`ms` LEAVES the verb tuple
entirely — `--verb-dusk-ms` dies into the ladder's `--motion-dusk`". Half of that landed: the key
left `pencilConfig.ts` and the publisher renders curves only. The consumer was never re-pointed.

**(critic) measured, both engines, on the served dist.** Under `html.theme-turning`, computed style
on `body` / `.bg-background` / `.bg-card` / `.action-bar` / `.drawer-tab-tongue`:

| arm | transition-property | duration | timing |
| --- | --- | --- | --- |
| prototype, light | `all` | `0s` | `ease` |
| prototype, dark | `all` | `0s` | `ease` |

Identical in chromium and webkit. Dispositive proof it is invalid-at-computed-value-time and not a
selector miss — inject `:root{--verb-dusk-ms:350ms}` at runtime and re-read the same element:

```
IACVT[chromium] before=all | 0s | ease   after=background-color, color | 0.35s, 0.35s | cubic-bezier(0.25, 0.1, 0.25, 1)
IACVT[webkit]   before=all | 0s | ease   after=background-color, color | 0.35s, 0.35s | cubic-bezier(0.25, 0.1, 0.25, 1)
```

Control (`git show 74a2b5d9:…/index.css`): `background-color 350ms ease, color 350ms ease`.

Consequences, in order of seriousness:

1. **The theme turn does not cross-fade.** The estate's whole re-derived ground set (six surfaces,
   the T8-W2 M9 list the comment 14 lines above spends a paragraph defending) snaps. This is the
   exact failure that comment says "reads worse than no rule at all".
2. **`transition-property` reverts to `all`** on those five selectors — the class P1-W3 killed 46
   selectors to get rid of. Harmless at `0s`, but it is `all` back in the tree, unnamed.
3. **The family's dusk proof does not touch its subject.** Reading (g) — "`--verb-dusk-ease` vs bare
   `ease`, 11 samples, max |Δ| 0.0000 both engines" — was taken on a synthetic scrub element. The
   claim "the memorable thing about the dusk is that it does not move at all" is true of the probe
   and false of the product. Unverified gestalt, in the one place the family chose to be measured.
4. **Every gate passes it, and one of them is this family's.** `npm run lint:verbs` re-run by me:
   **exit 0**, "declarations that name neither a verb nor a rung: 0". `check-theme-tokens`: **exit
   0**, "0 unreferenced". The mechanism is in `check-pencil-verbs.mjs:174` — `TIME` matches a
   literal `\d+ms` or `var(--motion-*|draw-dur|refuse-dur|…)` and **nothing else**, so a duration
   slot holding an unknown token yields `times.length === 0` and rule 2 (`times.length && …`, :356)
   never runs. An undefined custom property in a duration position is invisible to the gate whose
   entire purpose is that no declaration names a number that isn't a rung.

Closable in one line (`var(--motion-dusk)`), plus one gate row (every `var(--*)` in a timing slot
must resolve against the published/registered set). Both belong in the same change.

---

## 2 · The pixel it moves that it did not declare

The README's §2 heads one section "**THE ONE DECLARED PAINT CHANGE**" (the two icons, Δ0.5217), and
§5.6 concedes the deck-leave, the 17 grounds and the laminate as unmeasured. Neither states the
size of the set. **(critic)** I classified every timing declaration in the delta by resolved curve
and resolved length (control points from `74a2b5d9`'s `--ease-*` block and the CSS keywords; rungs
from `MOTION.rungs`):

- **~32 declarations change their painted curve** — `--ease-standard` → layDown ×9
  (AttributionCard ×4, GameGallery ×3, GameCard, GameControlPanel), bare `ease`/`ease-out` → layDown
  ×8, `--ease-noteWrite` → layDown ×2 (SolverErrorNote's `note-in`, HandwrittenLogo's straighten),
  `--ease-drawOn` → writeIn ×1 (scene.css beat 3, every scene mount), `--ease-glassGlide` → lift ×1
  (App.vue's deck leave), `--ease-accelIn` → lift ×2 (the laminate), `--ease-standard` → layDown ×2
  (the icons). **One of the ~32 was measured this pass.**
- **six declarations change their LENGTH**: `500ms → 520` (`index.css` `.solve-success .grid-line`
  stroke, the completion box-shadow, `HandDrawnGrid` opacity) and `240ms → 250` (`CrayonHeart`
  opacity, `GameGallery` transform + opacity). These are rounded onto rungs. T4-W9's completion
  hand-off and T4-W12's gallery glass are ratified poses; nothing auditions the round.

Attribution, in fairness: the banked pass-2 patch already carried these (`mot-verb-p2.diff:170,180,
560-561` show `var(--rung-page)` on the 500s and `var(--rung-mark)` on the 240), so pass 3 inherited
rather than introduced them — and pass 2's critique did not name them either. They are standing,
shipping, and unpriced. The π apparatus cannot see them by construction: a rect census reads
geometry at rest (0.000 px, honestly reported, over 142 of 1,214 keys) and the CSS set-diff
**excludes timing lines**. The two instruments that could have caught it are the two that were
scoped not to.

---

## 3 · The verb's fill arm is a field, not a law

The tuple declares `fill` and the spec says a verb "owns its curve, its property set, its fill arm".
At the type it is real: `spend()` returns `MOTION.verbs[verb].fill`, and V5 holds by data. In CSS it
is nothing. `FillForcedIcon.vue:72` and `SolveIcon.vue:55` now read `var(--verb-layDown-ease)` with
`forwards`, while `layDown.fill === "none"`. **(critic)** `grep -n "fill\|forwards\|backwards"
scripts/check-pencil-verbs.mjs` returns only ledger-key text and self-test fixtures: **no rule
compares a declaration's fill keyword to its verb's**. Half the primitive has a consumer-less field.
(`FILL_ALLOWLIST` still holds these two — the real filter census confirms it, §5 — so nothing is
broken; the *law* is.)

## 4 · Legacy aliases, in prose, on this family's own subject

This family's deliverable **is** the naming. Three sites still carry pass-2 or pre-ladder words:

- `useControlsDrawer.ts:239` — "*The drawer's glide controller — **TURN at the page rung***" — 200
  lines under the const whose new docstring shouts "**THE DRAWER SLIDES**", and `page` is the dead
  pass-2 name for `throw`. The spec explicitly promised "the comment at :89-95 and the SURFACES line
  agree"; the *other* comment was left.
- `index.css:634,653` — "LAY DOWN at the **page** rung" ×2.
- `scene.css:602` — "LIFT at the **breath** rung" (`breath` = pass 2's name for `leave`).

The gate reads declarations, never comments, so nothing can catch this but a reader.

## 5 · What I re-ran and what held

| probe | result (critic) |
| --- | --- |
| the ladder, live at `:root` | whisper `0.15s` · leave `0.2s` · note `0.25s` · dusk `0.35s` · step `0.44s` · throw `0.52s`; exactly **1** `<style data-motion-rungs>` node; identical chromium/webkit — **matches the README** |
| `e2e/filter-census.spec.ts` on the served dist under `playwright-throttle.config.ts` | **12 passed** (6 per engine): G3.1 census equals `filterBudget.ts` area-and-all, G3.2 no retained fill supplies a transform, G3.2 source `forwards\|both` = `FILL_ALLOWLIST`, G3.3 coarse below 1024, G3.5 no hover mints a filter, both regimes. **filterBudget intact, 9 unmoved** |
| `npm run lint:verbs` | **exit 0**, 0 unadmitted, 36 admissions, 0 laundering, 8↔8 beats, publisher byte-equal — reproduced, and see §1.4 for what that green is worth |
| `npm run lint:copy` (M16) | **exit 0** — 0 em/en dashes, 0 unadmitted jargon; this family renders no copy. Clean |
| `npm run lint:theme-tokens` | **exit 0**, 0 unreferenced of the corpus — and one-directional, see §1.4 |
| AA, both themes, computed by me off the served dist | light: body/h1 **18.99**, `.action-bar` **19.45**, button **4.55**; dark: body/h1 **16.18**, `.action-bar` **15.84**, button **7.85**. `git diff -U0 src/ \| grep -E '--color-\|#[0-9a-f]{6}\|oklch\|rgb\('` returns **zero rows** — this delta moves no colour. AA is unaffected and the ratios above are HEAD's |
| W2's landed mechanics | untouched by construction — no diff hunk reaches the sticky tag, the dock, the bottom tab or the tap-floor token; the drawer change is the mover's tuple, not its mechanics, and the README's settle rects (desk 1440 `176.98/710/330×640`, dock `216/0/390×628`, 0 running at 700 ms both engines) reconcile with MOT-LADDER's control reading |
| r0 / R6 | `instruments/R6-laminate-row.diff` is PROPOSED, not applied; it moves token names only, keeps 280/200 and the erase asymmetry, and the r0 row is reported MOVED. Correct under chair §7. Nothing was written under `r0/`, `pass1/` or `pass2/` |

The centre runs and is enforced where it claims to be: `vue-tsc` 0, the planted `spend("turn",
"whisper")` → `src/App.vue(382,28): error TS2345`, the gate's 12 negative controls all fire and the
census prints after them in one invocation (CI had never seen both — a real CI cure), `isShape`
deleted at a cost of exactly one admitted row, the ledger's third field derived from the tree by
`--why` (19 of 36 laundering, corrected down from the spec's 21 and reproducible), gate 8 satisfiable
in both directions, `--card-step-ms` and the three aliases dead, `knip` 0, `check-lane-membership` 0.
That is substantial and it is honestly reported — including the corrections against the lane's own
spec and the two admitted probe errors.

## 6 · Smaller, still open

- **The fold order was not run.** MOT-LADDER's pass-3 delta is not the base; its *core* was grafted
  (`MOTION.rungs`, `motionRungsCss`, `publishMotionRungs`, the `main.ts` call, the six `@property`
  rows) and the leader's kind tags, 59 struck fallbacks, `characters.refuse` and `rise` 600 are
  absent. Declared, with reasons — but every §13 number here is measured on a tree nobody will fold.
  "And then the hard part" is the checklist's elegant-reduction trap by name.
- **Nothing holds the registered `@property` set equal to `MOTION.rungs`** in this lane (gap 2, the
  family's own). With the dusk defect beside it, that is two instances of the same species: a
  reference with no one checking it resolves.
- **`ink-rub-out` ships with no consumer** (gap 4, conceded) — the same species as the
  `.is-rubbing-out` rule the lane deleted, kept on §7's promise.
- **The beat table's live half is an after-equals-control equality on three sampled rules**, not a
  per-beat read (gap 7). The static half is genuinely bidirectional.
- **`web/frontend/.probe/`** is left untracked in the fold tree and is not in `filesTouched`.
- **Cost 29 files vs ≤26** (2 are C06's, 1 the CI lane) — conceded, and fair.
- The main-tree slip (`tsconfig.tsbuildinfo`, gitignored) is real and correctly self-reported; I
  confirm no tracked file in the main tree moved.

## 7 · Verdict

**ADVANCE.** The centre — a closed set of verbs, each a curve bound to a property set, enforced at
the declaration, with one WAAPI door narrowed at the type — is right, is running, and now catches
what pass 2's gate could not. Nothing here is a rewording and no constraint is violated (AA, M16,
filterBudget, W2, the frozen record all hold). But 100 is a long way off while the family's own
flagship surface does not paint, while its gate cannot see why, and while ~32 re-curved and 6
re-lengthened declarations carry one measurement between them.
