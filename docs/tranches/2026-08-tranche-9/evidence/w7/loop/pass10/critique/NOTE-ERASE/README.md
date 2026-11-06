# NOTE-ERASE · pass-10 CRITIQUE (§7, batch 1)

I'm the critic. I wrote neither the charter nor the prototype. Base and π control: `74a2b5d9`. Scratch: the lane
`crit-NOTE-ERASE` under the durable scratch root; every copy is a `git archive 74a2b5d9` extraction, `git init`-ed
before any apply, and every apply line below prints its resolved git dir. No commit, stash, push or ref update
anywhere; no git on main or in the control tree. The number is mine.

## Verdict

**89 (91 → 89), ADVANCE — not BANK.** The bank is byte-exact, the three named plants are cured, and every gate the
lane re-cut has teeth under my own clause, threshold and disjunct batteries. But row 1's class is still open, for
the fourth pass running. The fence reads the leave's state at ONE instant (`@leave`), and Vue puts `*-leave-to` on
the node one frame later. The pass-9 critic's own declarations, moved from `-leave-active` to `-leave-to`, write
the rung and hold the sentence at FULL ink for the whole rung. A running animation that animates nothing (a
keyframes body whose declarations are all invalid) also writes the rung and holds the slot for 18–20 frames. Both
engines, both themes, with the lane's own teeth (`zeroLengthLeave`) as the assertion and the shipped verb as the
in-run positive. Row 2's runtime arm is still unbuilt, and three new spellings register at row 0.

## Numbers first (each re-derived by me unless marked cited)

- **The bank is byte-exact.** The work tree, read through a temporary index (HEAD `74a2b5d9`), gives tree
  `9e4e8ec5`: 32 paths, all `cmp`-equal to my copy `t10` = `74a2b5d9 + homes.diff (07257854) + pass10.diff
  (a32d9c2a)` → archive tree `f3eddf71`.
  - Homes v3 is applied by sha. `homes.diff`'s 13 paths and `pass10.diff`'s 19 paths overlap 0, so no home edit
    rides the delta.
  - The non-home interdiff over `pass9.diff` (`fd3173ab`, copy `t9` → `b4636bcb`) is **4 files, +200/−22**:
    `MarginNote.vue` (script hunk `@@ -151`, the `<style>` begins at :238), `marginNote.motion.test.ts`,
    `affordances.spec.ts` and `check-theme-tokens.mjs`. This equals the lane's claim.
- **Every `git apply --check`** (`logs/applycheck.txt`):
  - `pass10.diff` (145,035 B, 19 files +2,360/−93): **0** on bare `74a2b5d9` (19 paths) and **1** (36 errors) on
    WAVE+homes `72b7ad67`, on s13+homes `30af7d01` and on the pass-9 tree. The 1 is expected, because this diff is
    cut on the base.
  - `pass10.delta.on-WAVE.diff` (`d2a2752c`, 30,247 B, 4 files +302/−35): **0** on WAVE+homes v3 `72b7ad67`, 0 on
    s13-s7-s3+homes v3 `30af7d01`, and 0 on the bare WAVE `044284b5` and the bare s13 `e33d791d` (temporary
    indexes, `-R homes.on-WAVE`).
  - The union copy `u10` (WAVE + homes v3 + delta) → **`a0be129a`**, the lane's tree. `stopTheClock` is
    byte-identical on `t10` and `u10`.
  - Grep: 0 hits for `scratchpad`, `/private/tmp`, `/tmp/` or `.claude/t9-scratch`, and 0 dot-dir `+++` paths, in
    both diffs.
- **AA / T9-R6:** my builds (`guarded`, private cacheDir, `.git` marker = the copy):
  - `t10` → `index-DIxeSugF3EeN.js`, CSS `index-aAH1h02EAL59.css` **95,096 B**.
  - `t9` → `index-Dp3ksBr4gzAn.js`, CSS **95,096 B**.
  - CSS sha with the `data-v` hash normalised: **`8cff60e154c1` = `8cff60e154c1`**. Δ moves no CSS byte, so
    filterBudget and the painted AA are untouched. π is not re-probed (it stands on CSS identity; see gap 5).
- **Row 1, chromium** (`logs/spec-t10-cr.log`, `-g "drop clock" --repeat-each 2`, dist `index-DIxeSugF3EeN.js`
  95,096 B served as the run's own webServer on 4240; 18:47:47 → 18:49:27, load 8.32 → 11.04, zone inuse 16,194 →
  16,220):
  - The lane's rows: **48/48 GREEN**. The not-running plants read 5.6–15.2 ms over 1–2 connected frames; the
    presence-key negatives 159.2–165.1 ms over 19–20; the still leaves 8.5–12.5 ms over 1; the blinded and
    name-key negatives 159.0–162.3 ms over 20; the four rung adversaries 8/8 GREEN.
  - **My siblings: 12/12 RED** (table in §1).
- **Row 1, unit source sabotage** (`logs/unit-sab.txt`; copy `sab` = `f3eddf71`, `marginNote.motion.test.ts`; clean
  run 16/16, exit 0). Each plant replaces the fence's predicate, and the file is restored afterwards (`restored True`).
  Every plant reds a BEHAVIOURAL row, not only the static regex:
  - **S0**, the pass-9 presence key, run first: exit 1, 2 red ("PRESENT but not RUNNING" + static).
  - **S1**, playState clause cut: exit 1, 2 red.
  - **S2**, timeline clause cut: exit 1, 2 red.
  - **S3**, `animationName` clause cut: exit 1, 2 red ("only a CSS animation keys the clock" + static).
  - **S4**, `!== "paused"` (one species only): exit 1, 2 red.
  - **S5**, disjunct `=== document.timeline || != null` with the regex text kept: exit 1, **1 red, the behavioural
    row alone**.
  - **S6**, disjunct `=== "running" || !== "idle"` with the regex text kept: exit 1, 2 red.
- **Row 2** (`logs/plants-crit-t10.txt`; `check-theme-tokens.mjs` on a fresh copy of `t10` per plant; clean 0
  breaches, exit 0):
  - The pass-9 six (`.call`, `?.()`, `Reflect.apply`, `(0, f)()`, const-keyed `CSS[k]()`, `let`-assigned `.bind`):
    **1 breach each, exit 1**.
  - `globalThis.CSS.registerProperty`, `window["CSS"]["registerProperty"]`, and a plain call in a JS module outside
    `src/` imported from `main.ts`: 1 each.
  - The `typeof` probe: 0. `--self-test` exit 0.
  - **Three new spellings: 0 breaches, exit 0 — GREEN on a live registration:**
    - CRIT-A: `Reflect.get(CSS, ["register","Property"].join("")).call(CSS, def)`.
    - CRIT-B: `const { ["register" + "Property"]: rp } = CSS; rp.call(CSS, def)`.
    - CRIT-F: `Object.getOwnPropertyDescriptor(CSS, "register" + "Property").value.call(CSS, def)`.

    These are the lane's own declared residue (gap 1: no identifier, no literal). They show that the source arm is
    not the class, and that the runtime spy the charter offers as the other arm is the only route to closing it.
    Their liveness rests on plain ECMAScript semantics. I did not browser-read it, and I don't count it.
  - The six's live `inherits:false` proof stays the pass-9 critic's, cited.
- **Gates bare on the pristine bank copy `sab`** (`guarded --light`): `lint:sleep` 0, `lint:copy` (M16) 0,
  `lint:theme-tokens` 0, `lint:theme-tokens --self-test` 0, `lint:motion` 0, `lint:ink` 0, `lint:live-regions` 0.
  `typecheck:e2e` (`tsc -p tsconfig.e2e.json`) is 0 with my critic rows appended. That copy is scratch and is never
  banked.

## 1 · Row 1: present is not running, read once, on the wrong frame

**What the lane's fence is.** `stopTheClock` runs on `@leave`. That's after `*-leave-active` is on the node and
before Vue's next frame. It reads `getAnimations()` ONCE, and if any CSS animation is `running` on
`document.timeline`, it writes the rung (`150ms !important`) plus `delay 0s` and `transition none`. Otherwise it
writes `0s`. On the next frame Vue adds `*-leave-to`. The hook never re-reads, and it pins neither
`animation-play-state` nor `animation-timeline` inline. Any declaration that stops the verb AFTER the instant
therefore inherits the rung through Vue's fallback timer (`duration + 1`).

**The siblings** (my rows, appended to the lane's `affordances.spec.ts` in the scratch copy `t10` only, after its
build, so they're no Tailwind source; assembled at run time). Each row asserts **the lane's own teeth**,
`zeroLengthLeave(leave)` (exact `0s` and ≤ `ZERO_LEAVE_FRAMES` connected). The in-run positive is the shipped verb,
unplanted:

- **LEAVE-TO paused:** `.margin-note-ink.note-leave-to { animation-play-state: paused !important }`. This is the
  pass-9 critic's declaration, moved one Vue class later.
- **LEAVE-TO timeline none:** `.margin-note-ink.note-leave-to { animation-timeline: none !important }`. Detaching a
  running animation keeps its hold time, so it freezes.
- **RUNNING verb that animates nothing:** `@keyframes <typo> { from { clip-pth: … } to { opacit: 0 } }` named on
  `-leave-active`. It's the pass-8 ghost name with a body: a keyframes rule exists, every declaration is invalid,
  and the animation runs and erases nothing.

**Chromium**: two runs.
- `spec-t10-cr`: 18:47:47–18:49:27, load 8.32 → 11.04, zone 16,194 → 16,220.
- `spec-t10-cr-op`: with a per-frame opacity trace; 18:50:23–18:51:26, load 11.24 → 16.33, zone 16,267 → 16,261.

| arm (n = 4 per theme over both runs) | written | held ms | connected | visible | frames at opacity ≥ 0.99 |
|---|---|---|---|---|---|
| LEAVE-TO paused, light / dark | 0.15s | 156.5–168.0 / 160.7–163.7 | 17–20 / 18–20 | 17–20 / 18–20 | **every frame** (17/17, 19/19 · 18/18, 20/20) |
| LEAVE-TO timeline none, light / dark | 0.15s | 161.2–187.4 / 159.3–185.3 | 18–22 / 20 | 18–22 / 20 | **every frame** (22/22, 18/18 · 20/20, 20/20) |
| running verb animating nothing, light / dark | 0.15s | 142.1–163.5 / 153.9–163.4 | 15–20 / 12–19 | 1–2 / 1–2 | 1–2 (the slot held; `-leave-to` paints opacity 0) |
| POSITIVE, the shipped verb, light / dark | 0.15s | 159.3–205.9 / 161.8–197.9 | 10–20 / 11–20 | 10–19 / 11–19 | 3–4 / 4–6, fading to 0–0.39 / 0.14–0.6 |
| the lane's three plants on `-leave-active` (the fence) | 0s | 5.6–15.2 | 1–2 | 1–2 | — |
| the lane's presence-key negatives | 0.15s | 159.2–165.1 | 19–20 | 1–20 | — |

- **12/12 RED in each chromium run** (24/24 over both), and the positive GREEN 4/4.
- The two LEAVE-TO species are the pass-9 class itself: the rung written over a verb that does not move, and the
  sentence at **full ink** (≥ 0.99 on every frame) for 156–187 ms over 17–22 frames. That's the same signature the
  pass-9 critic read on `-leave-active` (157–278 ms, 14–22 frames at 1.00).
- The third holds the slot exactly as the lane's own blinded, ghost and scroll(root) negatives do (out-in: the
  next line waits for the rung). The lane treats that signature as RED in its own negatives.
- **The cure is the lane's, not mine to bank.** It's in reach of the "both axes" law the hook already keeps: when
  it writes the rung, it pins `animation-play-state: running !important` and `animation-timeline: auto !important`
  inline too, the way it pins duration and delay. Nothing can then stop the verb after the instant. The
  animates-nothing species needs the key to read the effect (`getKeyframes()` naming a property the rest pose
  sets), or the explicit `done` (row 4).
- These siblings move no shipped pixel: the shipped verb is GREEN. They are the class the fence's comment claims
  ("the rung is written only for a CSS animation whose `playState` is `running`") and does not hold past one
  frame.

## 2 · Row 3: the teeth (threshold, clause and disjunct batteries, re-derived)

`logs/threshold-literal.txt`. I extracted `ZERO_LEAVE_FRAMES`, `zeroLengthLeave` and the literal row ("the
zero-length bound, ±1 frame and ±1 ms, as literals") from the bank copy's spec bytes by `sed`, then evaluated each
variant against the literal row's own four expects:

- clean: GREEN
- `ZERO_LEAVE_FRAMES = 3` (the bound + ε): **RED** (`true != false`)
- `ZERO_LEAVE_FRAMES = 1` (the bound − ε): **RED** (`false != true`)
- the `0s` clause cut: **RED**
- the frame clause cut: **RED**
- the disjunct `0s || frames`: **RED**

The pin is a literal the constant can't move (LAWS P9 §F), and each clause has a plant that reds only it. The
lane's in-browser battery (`sab-*.log`: 17/33/50/100/140/149 ms writes each RED, ZLF 1/3 and both clause cuts exit
1, both engines) is cited, not re-run: I spent my browser time on the siblings.

**The strikes are right.** The time clause `< rung` and the `>= rung` clause on the negatives are the
decorative-clock class LAWS P9 §F names. My own chromium POSITIVE read **159.3–205.9 ms** (light) at load 16,
because a contended frame clock puts any time bound inside the negative's jitter. `visible <= painted` was vacuous
by construction (a visible frame is a connected frame).

**What the teeth do NOT cover** is §1's siblings. Each passes every one of the lane's clauses, because no row
plants on `-leave-to` or names a running verb that animates nothing. The gate is cured for its plants, not its
class (registry-v8 §2.12). That's the open row.

## 3 · The checklist, row by row

- **Vacuous convergence / a gate that can't fail:** no. Every re-cut gate reds under its plant: the unit fence
  6/6 (S0–S6, S5 behavioural-only), the literal row 5/5, the registration row 6/6 on the six.
- **The class cure:** **OPEN** on row 1 (§1: the instant read, and the running verb that animates nothing) and on
  row 2 (three spellings at 0, the runtime spy unbuilt).
- **Masked fallback:** Vue's `duration + 1` timer is the fallback clock that hands every §1 sibling the rung. The
  hook leaves it un-fenced past the instant.
- **Residual home edits, docs/ imports, forked instruments:** none (overlap 0; grep 0; the two instrument imports are
  relative, `./lib/postpaint.mjs` and `./shape-census.mjs`).
- **The on-WAVE delta:** present, base declared (WAVE + homes v3 = `72b7ad67`), apply-checked 0 on it, on s13+homes,
  and on the bare WAVE and the bare s13. Every one of my scratch applies ran inside a `git init`-ed copy, with the
  git dir printed.
- **AA / filterBudget / M16 / the @property law:** CSS byte-identical (normalised) t9 ↔ t10. `lint:copy` 0,
  `lint:theme-tokens` 0. Δ registers nothing and moves no rung.
- **π:** not re-probed in a browser by the lane or by me. It stands on CSS identity, and the leave's timing is not
  a rest pixel (gap 5).
- **Frames / the ballot pair:** none filed. F-ERASE-2 is declared numbers-only, and there are 0 image files in the
  lane's evidence, so 0 B of headroom spent. That's lawful, but the gestalt of the erase is still unphotographed.
- **Numbers I did not re-derive (cited):** the union columns (u10 340/340 ×2 engines; my `u10` copy is apply-checked
  and the fence is byte-identical, but I did not browser-read it), row 4's extension attempts, T9-R8 2.563 / 2.866,
  the 70-file / 854-test vitest sweep, and the lane's in-browser teeth battery.

## 4 · Open gaps (exact)

1. **ROW 1 OPEN AT ITS CLASS, a fourth time.**
   - The fence reads `playState`/`timeline` once, on `@leave`, and pins neither inline. One frame later Vue's
     `-leave-to` can stop the verb. `animation-play-state: paused` and `animation-timeline: none` on
     `.note-leave-to` each write the rung and hold the sentence at opacity ≥ 0.99 on EVERY frame, 156–187 ms over
     17–22 frames (chromium, both themes, 8/8 RED). WebKit is in §5.
   - A running verb whose keyframes animate nothing writes the rung and holds the slot 142–163 ms over 12–20
     connected frames.
   - The comment "the rung is written only for a CSS animation whose `playState` is `running`" holds for one frame.
   - Cure route (the lane's to build): pin `animation-play-state: running` and `animation-timeline: auto` inline
     `!important` with the rung, and put the `-leave-to` plants plus an animates-nothing plant into the drop-clock
     row's in-run set on every leave, both engines.
2. **ROW 2 OPEN AT ITS CLASS.**
   - Three spellings read 0 breaches with homes v3 + the consumer cure: `Reflect.get(CSS, joinedKey)`, a
     destructured computed key, and `Object.getOwnPropertyDescriptor(CSS, k).value`.
   - The runtime spy on the built page (the charter's other arm) is unbuilt.
   - The six's liveness is still the pass-9 critic's citation.
3. **Row 4: unplantable, demonstrated, cited.** The lane's own transcript says attempt 2's argv read came back
   empty, so one clause is UNREAD. The explicit `done` is priced, not built (the owner's ballot).
4. **s13-s7-s3 `2f11714f`: the drop-clock rows are UNREAD in both engines** (the lane's declaration, and mine:
   apply-checked only).
5. **π is not re-probed in a browser** (lane and critic). CSS identity is the only witness.
6. **T9-R8 is OPEN** (2.563 / 2.866 < 4.5, cited). **F-ERASE-2 is unframed**: the erase's gestalt has never been
   photographed on the real surface in either engine.
7. **Carried union reds, not ERASE's:** `lint:sleep` 3, wash-reach CONTROL 6, `tab-pen.spec.ts`, and the four
   `src/games/shared` units (cited from the lane's identical-on-waveh reading).

## 5 · WebKit

**WebKit** (`logs/spec-t10-wk.log`, the same 60 rows, `guarded --exclusive webkit`, dist `index-DIxeSugF3EeN.js`
95,096 B as the run's own webServer on 4240). It queued 18:51:26 → ~18:55 behind two other projects' WebKit runs,
then ran to 18:57:36. Load 16.33 → 20.21, zone inuse 16,261 → 16,348. **48 passed / 12 failed, exit 1. The 12 are
exactly my siblings.**

- **The lane's rows, re-derived: 48/48 GREEN.**
  - The not-running plants read 1–2 connected frames (25–102 ms; the ms is printed and never gated).
  - The presence-key negatives read 7–12 connected (205–263 ms; paused and none visible 7–12, scroll visible 1).
  - The still leaves read 1–2; the blinded and name-key negatives 11–12; the four rung adversaries 8/8.
  - This is the lane's §1 reproduced. Pass-10 row 1's named plants are cured in WebKit too.
- **My siblings: 12/12 RED.**

| arm, WebKit (n = 2 per theme) | written | held ms | connected | visible | frames at opacity ≥ 0.99 |
|---|---|---|---|---|---|
| LEAVE-TO paused, light / dark | 0.15s | 196–206 / 195–206 | 12 / 11–12 | 12 / 11–12 | **every frame** (12/12, 12/12 · 11/11, 12/12; last 0.99) |
| LEAVE-TO timeline none, light / dark | 0.15s | 196–197 / 167–189 | 11–12 / 11 | 1 / 1 | 1 (WebKit drops the effect: the slot is held, the ink is not) |
| running verb animating nothing, light / dark | 0.15s | 183–185 / 185–196 | 10 / 10 | 1 / 1 | 1 |
| POSITIVE, the shipped verb, light / dark | 0.15s | 157–165 / 162–185 | 10 / 9–10 | 9–10 / 9–10 | 0–2, fading to 0.02–0.15 |

- **Per-engine key (LAWS P9):**
  - LEAVE-TO paused freezes the sentence at full ink in BOTH engines.
  - LEAVE-TO timeline none freezes it in chromium (hold time kept), while WebKit drops the effect and holds only the
    slot.
  - The animates-nothing verb holds the slot in both.
  - Every species writes the rung and fails the lane's own `zeroLengthLeave` in both engines and both themes.

## 6 · The control beside every battery row

The control is the same spec bytes (copy `t10`, my rows included) served against the control's pre-built dist
`index-CubiZsMVSwTc.js` (CSS 93,634 B), from the control tree with its own `.vite-control.config.ts` on 4248, as
the run's own webServer. The identity is printed in each exit line. There was no git in the control tree.

- **Chromium** (`logs/spec-ctl-cr.log`, `-g "drop clock"`, n = 1): 18:57:48 → 19:01:02, load 19.88 → 9.46, zone
  16,348 → 16,310. **29 failed / 1 passed, exit 1.** The one green is the browserless literal row. That's the
  lane's 21/1 plus my 8 rows: the control has no hook, so every leave row (shipped, plant and positive) fails
  there. The rows can fail, and they fail on the surface without the cure.

## 7 · The number: 89 (91 → 89), ADVANCE

**What earns:**
- the bank is byte-exact, and so is every apply route the lane declared;
- the three named plants are cured in both engines (re-derived, 48/48 per engine);
- the unit fence has 6/6 behavioural teeth, including two text-preserving disjunct plants;
- the literal pin reds at ±1 frame and on each clause;
- the six read 1 each;
- CSS is byte-identical and the gates are bare 0;
- the strikes of the decorative clocks are correct.

**What holds it under pass 9's 91.** Pass 9's 91 priced the class as curable by the critic's one clause, and that
clause landed. My rows show the clause is a one-frame read:
- the pass-9 critic's own two declarations, moved to `-leave-to`, freeze the sentence at full ink for the rung in
  both engines (the identical signature, 17–22 frames chromium, 11–12 WebKit);
- a running verb that erases nothing holds the slot in both engines;
- the fence's comment overclaims for the third pass;
- row 2's source arm misses three more spellings, and the runtime arm the charter offered is unbuilt;
- π, s13 and the gestalt frame are unread.

A family that cures for its plants and not its class for a fourth pass doesn't hold its number on the strength of
landing last pass's proposal.

**Verdict: ADVANCE.** The work is real and bankable as a step: the fence by sha is a strict improvement for LEDGER
on the union. But §7 does not BANK on it, and pass 11 owes:
- the inline play-state/timeline pin (or a re-read on the next frame), with the `-leave-to` and animates-nothing
  plants in-run on every leave, both engines;
- the runtime registration spy, born RED on CRIT-A/B/F;
- π re-probed;
- the s13 column read.

## 8 · Replay (all under `instruments/`, scratch root = the lane `crit-NOTE-ERASE`)

1. `git -C <the lane's worktree> archive 74a2b5d9 > base74.tar`. This read the object store from the worktree, not
   main.
2. `mk-copy.sh <label> <diffs…>` (git init, then `--3way` per diff; prints the git dir, paths and tree):
   - `t10` = homes.diff + pass10.diff → `f3eddf71`;
   - `t9` = pass9.diff → `b4636bcb`;
   - `waveh` = WAVE.diff + homes.on-WAVE → `72b7ad67`;
   - `s13h` = s13-s7-s3.diff + homes.on-WAVE → `30af7d01`;
   - `u10` = waveh + the delta → `a0be129a`;
   - `sab` = `t10`, kept pristine;
   - `b74` = bare.
3. The apply-check matrix is in `logs/applycheck.txt`. The bare WAVE and bare s13 come through temporary indexes
   with `-R homes.on-WAVE`.
4. `build.sh t10|t9 <fe>` (guarded, private cacheDir) → `logs/build-*.exit`.
5. Append `crit10-rows.spec.diff` to `t10`'s spec AFTER the build. Then run
   `run-spec.sh <t10 fe> 4240 <dist-t10> .crit10-build.mts <label> chromium|webkit -g "drop clock" --repeat-each 2`
   and `parse.py`.
6. Control: `SERVE_CWD=<control fe> run-spec.sh <t10 fe> 4248 <control dist> .vite-control.config.ts ctl-cr|ctl-wk
   <engine> -g "drop clock"`.
7. `python3 -I unit-sab.py`; `node plants-crit.mjs <t10 fe> t10`; `node thr.mjs`.

## 9 · Incidents (self-declared)

- **Temporary-index `git add -A` in the lane's worktree** (to read its diff) wrote loose blobs into the shared
  object store. No ref or real index was touched.
- **One `git status --porcelain` ran in the lane's worktree**, not main and not the control. It may have refreshed
  that worktree's index stat cache.
- **Two scratch builds ran back to back in one background call**, sequentially, never concurrently.
- **While my WebKit spec waited for the lock (holding a pool slot), I ran browserless light commands:** vue-tsc,
  eslint, the lint gates and the unit sabotage.
- **The opacity re-run** (`t10-cr-op`) ran at load 11–16. Its first positive cell painted only 10 frames over
  205.9 ms (a contended clock). It's printed and not gated, so no verdict rests on its ms.
- **My first parse missed the LEAVE-TO lines** (a regex on names with commas). I fixed and re-parsed; the
  `parsed-*.txt` files are the fixed ones.
- **No `rm`; discards went to the lane trash.** No servers of mine are left (each preview was its run's own
  webServer inside the guarded call).

**The control, WebKit: UNREAD by me.** `logs/spec-ctl-wk.exit`, exit 143: it queued 19:01:02 → 19:15:57 behind
another project's 88-minute `--exclusive webkit` run, zone inuse 16,310 → 16,443, load 9.46 → 8.07. I stopped my
own queued job by its recorded PID (cwd checked = my copy) before admission, so no browser ever launched.

The control's WebKit drop-clock column is cited, not re-read:
- the lane's `spec-t10`-vs-control WebKit 21 failed / 1 passed, exit 1;
- WAVE9-read `CQ1-wk` affordances 12/29/0.

My 8 critic rows have NO WebKit control reading. Their chromium control reading is 8/8 RED.

## 10 · Box

| row | load (start → end) | zone inuse |
|---|---|---|
| chromium `t10-cr` | 8.32 → 11.04 | 16,194 → 16,220 |
| chromium `t10-cr-op` | 11.24 → 16.33 | 16,267 → 16,261 |
| WebKit `t10-wk` | 16.33 → 20.21 | 16,261 → 16,348 |
| chromium control | 19.88 → 9.46 | 16,348 → 16,310 |
| WebKit control | unread, stopped in queue | 16,443 |

Every row was far under load 120 and zone 8M. There were no refusals.
