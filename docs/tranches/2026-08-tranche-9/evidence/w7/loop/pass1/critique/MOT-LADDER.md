# MOT-LADDER — pass 1 CRITIQUE (adversarial, non-author)

T9-W7 §13 · the duration ladder. Read: the synthesis spec, the prototype's README and return,
the worktree diff whole (`wf_e58b4764-0fc-51`, 30 tracked files +195/−97 plus the 715-line
untracked gate), both banked frames, `r0/r6-idiom-history/R6-census.md`.

Re-ran, myself, read-only on product files:

| what I ran | where | result |
| --- | --- | --- |
| `check-motion-bands.mjs` on the branch tree | worktree | reproduces GREEN 6/6, census 76/72/84, 55 on a rung |
| the same gate on the **clean main tree at HEAD** (`ROOT=` main `web/frontend`) | main tree, read-only | B1 59 · B2 4 · B3 1 · B4 1 · B5 4 · **B6 ✓ GREEN** |
| the same, `--empty-ledger` | main tree | B1 **80** (the prototype's correction reproduces) |
| B3 sabotage + control | scratch copy of branch `src` | single-quoted second home → **GREEN**; double-quoted → RED |
| reduce/no-preference computed-transition roster, built branch dist, chromium + webkit, 390×844 dsf3 | `:4244` (4246/4248 were held) | ladder published {150,200,250,350,440,520} both engines; **24 rules still tween under reduce** |
| dock open → settle 700ms, both engines, light + dark | same | 0 running animations, rect 390×595.5 @ (0,248.7), `transform: none`, identical across engines and themes |
| `npm run lint:copy` | worktree | GREEN (M16 clear) |
| colour grep over the whole diff | worktree | 0 lines touching a hex / rgba / oklch / `--color-*` |

Dist identity verified before every probe: `index-BEc8x9evhSKc.js` (the branch build).

---

## 1 · What is genuinely converged

**The mechanism lands, and I confirmed the central claim independently.** Off the built dist,
both engines, `document.documentElement` carries `--motion-whisper 150ms … --motion-throw 520ms`.
One publisher, called before mount, no second home in `@theme`, every fallback byte-equal and
gated. This is the substrate the family promised and it has 55 consumers, so it is not a
consumer-less token.

**The PRM cure is real and user-visible, not asserted.** Under reduce, on the branch dist in
both engines, `.sparkle-icon`, `.drawer-tab-text`, `.washi-label`, `.game-card`, `.gallery-pip`
and the logo's clip-path are all absent from the live-transition roster — they collapse to a
same-frame swap. Under no-preference they are present. That is the one measured product win in
this family and it survives an adversarial re-run.

**The band keys die rather than alias.** `cardStepMs` / `boardFoldMs` / `chromeLeaveMs` are gone,
their rulings moved into the rung rows, and the `--card-step-ms` component publisher with them.
The synthesis explicitly rejected its own first plan (aliases) on the measured ground that i3-B
and I6 go half-blind — the legacy-alias tell, caught by the author before me.

**The ledger is closed both ways and the author proved it rots.** Two CHARACTER cites drifted by
the prototype's own edits above them and the gate redded. An allowlist that cannot outlive its
reason is the right shape; the line-cite is the wrong anchor, and the author says so.

**At rest nothing moves.** Both frames (dock open, 390×844, settled 700ms, PRM-frozen, light/
chromium and dark/webkit) show the W2 mechanics intact: sticky tags, the dock sheet, the bottom
action bar, the tap-floor targets. My own settle reading agrees: quiet at 700ms, identical rect
across engines and themes. No colour token moved anywhere in the diff, so both themes' measured
AA ratios are untouched by construction. `lint:copy` GREEN — no rendered string, so no font
re-cut.

**Cost on the artifact is trivial**: +110 B raw / +30 B gzip.

---

## 2 · What is NOT converged

### 2.1 B6 NO-SHORTEN cannot fail in CI (measured)

`b6NoShorten` compares the working tree against `git show HEAD:<file>`. CI checks out the commit,
so HEAD **is** the tree: every file resolves to itself and the check greens on any content. I ran
the gate against the clean main tree at HEAD, which carries 59 unnamed literals and 4 unruled band
keys, and B6 read **GREEN**. It is green there for the same reason it will be green in CI forever.

Worse, it was never born RED: the prototype's "B6 RED 1 at HEAD" is the `SKIPPED — no git tree`
sentinel printed in a non-git scratch copy, not a shortening. And B6's self-test case does not
call `b6NoShorten` at all — it re-implements the comparison inline over two `collectText` models,
so the sabotage proves the model, not the shipped function. This is the W8 QUALITY LAW's only
enforcement arm and it is a gate that cannot fail.

### 2.2 B3's "no second home" arm is blind to the exact idiom it kills (measured)

`published()` scans for `"(--(?:motion|card)-[a-z-]+)"` — **double** quotes. A Vue SFC publishes
through `:style="{ '--card-step-ms': … }"` — **single** quotes inside the attribute. So the one
component publisher this family deletes could never have been caught, and nor can its successor.
I put a live second home back into a scratch copy of the branch source:

```
:style="{ '--motion-step': `${MOTION.rungs.step + 200}ms` }"   →  B3 ✓ GREEN  (640ms shadowing a rung)
:style="{ "--motion-step": `${MOTION.rungs.step + 200}ms` }"   →  B3 ✗ RED 1
```

Pure quote sensitivity. One character (`["']`) cures it, but until then the family's headline
guarantee — one home, never typed twice — is unenforced.

### 2.3 B5 PRM-ARMED is file-level, and 24 rules still tween under reduce (measured)

`b5PrmArmed` greens a file if the string `prefers-reduced-motion` appears anywhere in it. It does
not ask whether the arm covers the rule that spends the rung. Measured on the branch dist under
reduce, both engines, 24 rules still declare a live transition, including one this diff itself
re-pointed:

- `.icon-btn { transition: background-color var(--motion-whisper,150ms), color var(--motion-whisper,150ms) }`
  (`GameControlPanel.vue:1956-1958`) → `background-color 0.15s, color 0.15s` under reduce. The
  file's three PRM blocks arm `.legend-fold` and `.sparkle-icon`; `.icon-btn` is not among them.
  Eight of these buttons sit in the dock. **B5 GREEN.**
- `.board-wrapper` `box-shadow 0.5s`, `.attribution-trigger` `color 0.2s`, the toggle's
  `warp 0.8s` / `toggle-rest 0.2s` / `twinkle 0.15s`/`0.12s` — all live under reduce, all in
  files B5 greens.

The family's PRM LAW says *every rung consumer* collapses. On the engine, at least one does not.
CrayonHeart is the same defect seen from the other side: its arm guards a rule no shipped variant
renders (the author found this), and the gate counted it anyway.

### 2.4 The census's scope is narrower than the claim (measured)

"Every shipped duration" means, to the instrument, every time position inside a CSS
`transition:`/`animation:` declaration. Three live vocabularies sit outside it and the gate greens:

- **Tailwind duration utilities** — `duration-150/200/250/500`, 6 occurrences in 6 files, invisible
  to B1 because they are class attributes. I read them live under reduce:
  `.section-heading … duration-250` → `color 0.25s`; `.ctrl-btn … duration-150` → `color 0.15s`.
  Those are `note` and `whisper` spelled in a third language, on the surfaces §10/§13 are about.
- **WAAPI durations in TS** — `usePathAnimation.ts:163 duration: 150` is a real 150ms erase with no
  rung, no admission, no exemption.
- **pencilConfig's own second tier** — `DRAW_IN_PRESETS` (`pencilConfig.ts:519/526/533/540`) holds
  `duration: 350 / 280 / 200 / 350`. B2's stray-check only walks MOTION's two-space keys, so four
  motion lengths live 380 lines below the ladder, three of them numerically rungs, unruled. R6's
  covenant row #4 names "the CELEBRATION budget" in the same breath as the band keys, so this tier
  is not out of scope by anyone's reading but the gate's.

### 2.5 The decided history is moved without being rewritten

`r0/r6-idiom-history/R6-census.md` is the banked decided history the charter binds this wave to.
Two rows disagree with the branch:

- the guard ribbon is recorded at **240ms** on `--ease-glassGlide` (R6 §48); the branch spends
  `note` 250ms. The JND argument is fair, but a recorded idiom moved and the record still says 240.
- covenant row #4, "No timing constant outside `pencilConfig` (`cardStepMs 440`, `boardFoldMs 520`,
  `chromeLeaveMs 200`, the CELEBRATION budget)", names three keys this family retires.

The T2–T4 rule is that a ruling lands with its enforcing record in the same commit. Neither row is
touched by the diff.

### 2.6 A rung has no retune policy

`throw 520` is R6 standing ruling #1 — the drawer's audited settle, owner audit 4. The branch now
spends it on the win flood's `stroke` and `box-shadow` (500→520). R6 ruling #2 fences the *curve*
("no other surface re-eases under it") and the branch respects that, but the *number* is now
shared. Nothing says what happens the next time the owner re-auditions the drawer at 480 or 560:
does the gold flood follow? The ladder's premise ("lengths, not meanings") makes that coupling
invisible at the call site, which is precisely where a future retune will surprise someone.

### 2.7 Two instruments cannot green, and two π rows were never run

i3-B and I6 are absolutes with no exceptions clause, so they red on the branch forever (the author
says this and recommends retiring i3-B into B1 — I agree, and I6 needs the ledger or the same
fate). Separately, the brief's π roster asked for the r1 heading census and the r3 wobble-ring σ;
neither appears in the README or the return. The rows that are claimed — goldens 4/4, filter-census
+ theme-quadrants 40/40, `check-font-coverage` — have **no banked output** in `readings/`, which
holds only the PRM, frames, theme-flip and dock-settle JSON. My own filter proxy (distinct filter
ids referenced by computed style) read 11 on both engines and both themes; that is not the
census's instrument and I do not claim a breach, but nothing in the bank lets the next reader
check the 9.

### 2.8 Already declared by the author, and I confirm they stand open

theme-flip >100ms uncertified on a contended bench (re-run quiet); cost over ceiling on files
(31 vs 20) and deletions (−97 vs −80); the hue census incomparable and its probe clobbering banked
r0 files; the exit-fold mechanism row uncured, so the revived fold's curve is an audition;
CrayonHeart's wink dead code; and the honest closing admission — whether the sentence *reads* is
the owner's call at the re-look (U-10), which no instrument here answers.

---

## 3 · Verdict

**ADVANCE.** The family has a running prototype proven on built dists in both engines, one
measured user-visible cure, a published token with 55 consumers, zero rest pixels, zero colour,
zero strings and a +110 B footprint. It is not a rewording and it violates no constraint outright.

But it is not converged, and the reason is exactly the thing it sells: its gate. Three of six
checks are weaker than their names — one cannot fail in CI, one is blind to the idiom it was
written for, one greens over a defect I measured on the engine — and the census's scope stops
short of three live vocabularies of duration. Convergence **72**. The repairs are small, named and
mechanical; none of them is a missing primitive, which is why this is not a BLOCK.
