# NOTE-ERASE · pass-8 CRITIQUE

I'm the critic. I didn't write the charter, the spec or the prototype. Base and π control: `74a2b5d9`.

**Convergence: 91 (+1). Verdict: ADVANCE.**

The fold blocker is closed. I re-derived it with my own probe, not the lane's spec. On the union + homes + delta, the pushed record's old line-one node lives 7.1–11.9 ms in chromium and 10–16 ms in webkit, over 6 runs per engine in both themes. It's visible post-paint on 0–2 frames. My in-page negative (the pass-7 write) holds it 162–168 ms over 16–23 frames. The line-two clock, the consumer row and the unit born-RED all reproduce.

What holds the number:

1. **The registration row is still cured for its plants, not the class, for the second pass running.** Six spellings ship `inherits: false` on a ladder rung into the running page in both engines with the row at **0**, on the tree and on the union. Two of them are CSS that `check-property-block --dist` sees (exit 1), so row 3's "cpb --dist agrees" clause fails.
2. **The fence is keyed on a proxy.** A computed `animation-name` that names no `@keyframes` (`critghost`) makes the hook write the rung. On the swap leave the sentence then sits on both lines for 156–167 ms over 16–23 frames in both engines, which is the pass-7 defect by another spelling.
3. **Declared rows, still open:**
   - π at 1280 fine: +2.83 px on `.board-margin`. I reproduced it (23.63 vs 20.80, both engines). No row claims it.
   - F-ERASE-2 is unframed.
   - T9-R8 is cited, not re-read.
   - User-origin and UA-origin `!important` are unplanted.
   - The 2lh seat is LEDGER's row.

## 0 · Setup (mine; the lane's work tree was read only, through temporary indexes)

- **The bank.** I re-cut the work tree through `GIT_INDEX_FILE`: tree `f7b15b46`, 420,110 B, sha1 `a7f9c935…`, 27 files +8692/−94. It equals BANKED.txt exactly.
- **Pass-8 interdiff.** Against `74a2b5d9 + pass7.diff + homes.diff` (tree `5dd0387b`) it's 9 files +577/−241. I read it whole: `MarginNote.vue` 20 lines, the motion unit 124 lines, the spec +136, `check-theme-tokens.mjs` 497 lines churned, `App.vue`/`pencilConfig.ts` (the alias deleted), `postpaint.d.mts` +27, and two comments.
- **Copies.** Both are `git archive 74a2b5d9` extractions:
  - tree = the archive + `pass8.diff`
  - u8 = the archive + `s13-s7-s3.diff` + `homes.on-s13-s7-s3.diff` + `pass8.delta.on-s13-s7-s3.diff`
  - Every apply exited 0. `MarginNote.vue` sha1 `63cb3e82` on the tree equals the work tree's.
- **Builds.** The configs are `.mts` with cacheDirs outside every root. Identities: tree `index-Cr7o9fvpjGA6.js` and u8 `index-C_SlSGoMXD5k.js`, both the lane's, reproduced. Plant `rp` is `index-CIKaX837sARd.js`.
- **Servers.** Lane port :4248 and my control :4250 (`w7-control`, `index-CubiZsMVSwTc.js`, served by its own `.vite-control.config.ts`). Each was up/down through `instruments/serve.sh`, which checks listener ancestry and served identity before any kill. Both ports read free at return. No sibling port was touched.
- **Box load (1-min).** 64–185 across the critique. Every timing below is a loaded-box reading, and each log line carries its load.

## 1 · Re-derived (both engines, my probe `instruments/crit.probe.ts`, post-paint: a MessageChannel task queued from each rAF)

### A · The SWAP leg on the union (`logs/swap.txt`), HOLD push, 1280×800 fine

| arm | chromium ms · visible post-paint frames on both lines | webkit |
|---|---|---|
| u8 clean, light ×3 | 7.1 / 10.3 / 10.4 · 1 / 0 / 0 | 10 / 15 / 11 · 1 / 1 / 1 |
| u8 clean, dark ×3 | 11.5 / 9.3 / 11.9 · 2 / 0 / 1 | 16 / 12 / 10 · 2 / 1 / 1 |
| **negative**: pass-7 write (the hook's `0s` rewritten to `150ms` in-page) ×2 | 168.0 / 164.2 · 23 / 22 | 162 / 164 · 16 / 16 |
| **NEW plant**: `.note-swap-leave-active{animation-name:critghost !important}` ×2 | **164.3 / 156.1 · 23 / 21** | **164 / 161 · 16 / 17** |

- The lane's numbers reproduce: 4.2–12.5 cr and 8–28 wk. After every push, line two held the displaced record (asserted).
- **The ghost plant.** The computed name is `critghost`, so the hook writes the rung. No CSS animation runs and no `animationend` fires, so Vue waits out `timeout + 1`. The old node is visible and the sentence sits on both lines.
- **What the gate misses.** The gate reads "has a name" where it means "an animation runs". `el.getAnimations()` read on `@leave` (after `*-leave-active` + reflow) would see it; the name can't. This is an author-error plant, not a shipped defect, but it's the exact defect class the fence exists for.

### B · The still leave on the tree (`logs/still.txt`), the pinned conflict board

| arm | chromium ms · connected / visible post-paint | webkit |
|---|---|---|
| PRM ×3 | 6.7 / 5.8 / 10.6 · 1/1 each | 5 / 14 / 10 · 1/1 each |
| `animation-name: none !important` ×3 | 10.2 / 12.6 / 5.7 · 1/1 | 8 / 31 / 11 · 1/1, 2/2, 1/1 |
| clean rub-out ×2 (rung held) | 163.2 / 162.1 · 22/21 | 158 / 161 · 13/13, 11/10 |
| **negative** PRM + pass-7 write ×2 | 160.9 / 158.1 · 22/**1**, 21/**1** | 161 / 164 · 16/**1** |

- The lane's figures reproduce: PRM 7.7–15.0 / 3.0–16.0; none-important 9.2–11.2 / 26–50; negative 158–167.
- **Record correction.** On the tree, the negative's "18–19 painted frames" (README row 1) counts frames on which the node is CONNECTED. At frame 2, `.note-leave-to` puts it at `opacity: 0`, so it's visible on ONE frame. The tree's harm under the pass-7 hook is the out-in write-in delayed ~160 ms, not a double paint. The gate still reds on lifetime (≥ whisper), so it can fail.
- On the union's swap leg, connected equals visible (no `-leave-to` on `note-swap`), so that leg's frame count is honest.

### C · Line two on the union (`logs/line2.txt`)

| arm | chromium | webkit |
|---|---|---|
| `@layer` duration 900 + delay 300 `!important` ×2 | 158.5 / 153.3 ms (duration 0.15s) | 154 / 147 |
| **negative**: pass 6's hook (the animation axis dropped) ×2 | 1204 / 1196.8 | 1205 / 1205 |
| ghost name ×2 | 163.1 / 163.1 | 165 / 167 (bounded by the rung; a real rub-out slot) |

This reproduces the lane's row 2 (155.9 / 146 against 1197.7 / 1203).

### D · Unit born-RED (`logs/units.txt`), `marginNote.motion.test.ts` on copies

| hook | verdict |
|---|---|
| tree | 13/13 |
| the pass-7 hook (`bf9b9e55`) | 2 failed / 11 |
| **mine**: the new hook moved back to `@before-leave` | 2 failed, including the BEHAVIOURAL rub-out row: the name read there is the resting ink's |
| **mine**: dead hook (`if (el) return;` after the read) | 2 failed, both CI-half rows |

The move to `@leave` is gated by behaviour, not only by the source text.

### E · π (`logs/pi.txt`)

- 1280×800 fine at rest, ×2 per arm per engine.
- `.board-margin` is 23.63 px on the tree and 20.80 on `74a2b5d9`, both engines. Top is equal (770.84 cr / 770.55 wk) and docH is 800 = 800.
- This is the lane's gap 2, reproduced. It's an unclaimed pixel move.

## 2 · The registration row: the pass-7 plants first, then mine

`instruments/plants.mjs` makes a fresh copy per plant and runs `check-theme-tokens.mjs` bare. The results are identical on the tree and the union (`logs/registration-plants-{tree,u8}.txt`).

| plant | row |
|---|---|
| clean | 0 |
| p7: `.pcss` `inherits:false` imported from `main.ts` | **RED** |
| p7: split name `{name: W}` | **RED** |
| p7: joined `["--mo","tion-whisper"].join("")` | **RED** |
| p7: escaped tail `--motion-whisp\65r` | **RED** |
| p7: uppercase `@PROPERTY` | 0 (pass 7 found the bundler drops it: inert) |
| `<style lang="postcss">` in a `.vue` | **RED** |
| `@property` inside `@layer` (depth) | **RED** |
| **escaped head `@property --\6d otion-note {inherits:false}`** | **0** |
| **a sheet OUTSIDE `src/` (`../extra/x.css`) imported from `main.ts`** | **0** |
| **`CSS.registerProperty(def)`, a non-literal argument** | **0** (the lane's gap 7) |
| **`CSS["registerProperty"]({…})`** | **0** |
| **`const reg = CSS.registerProperty.bind(CSS); reg({…})`** | **0** |
| **`"@prop" + "erty --motion-leave{…}"` appended as a `<style>`** | **0** |

**Do they ship?** I built all six into one plant, `rp`. The row reads 0 on it (`logs/rp-row.txt`).
- The served CSS carries `@property --motion-note{…inherits:false}` (the bundler DECODED the escape) and `--motion-dusk{…inherits:false}`.
- **In the browser** (`logs/inherits-{rp,tree}.txt`), I set `:root{--motion-X: 777ms}` and read it on `body`.

  | copy | chromium | webkit |
  |---|---|---|
  | tree (negative) | every rung 0.777s | same |
  | rp | whisper 0.777s; **leave, note, dusk, step, throw, rise all 0s** | same |

  All six spellings ship a broken ladder past the row.
- **`check-property-block --dist` on rp** exits 1 (`logs/cpb-rp.txt`): C5 served `--motion-note`/`--motion-dusk` `inherits:false`, C4 at `main.ts:22`, and C6 on the escaped sheet (unparsed). On the tree it exits 0. The charter's agreement clause fails: row 0, cpb 1.

**Why.**
- `propertyRegistrations` (the ONE library) matches `^@property\s+(--[\w-]+)` with no escape decoding, which is against LAWS P7 §F's read set.
- It walks a directory list, not the build's module graph (P7 §F: "keys on the build's MODULE GRAPH, never a hand list").
- Its script clause is `registerProperty\s*\(\s*\{`.
- The chair's `register-any` PROPOSED diff covers only the non-literal argument. It doesn't cover the bracket, alias, concatenated-text, escaped-head or outside-`src` spellings.
- The cure belongs in the ONE copy as a PROPOSED diff with these six plants. A browserless read of the BUILT CSS (cpb's C5) is the class closure for the CSS spellings.

**Clause-sabotage** (`logs/sabotage.txt`): all 11 row clauses, each switched off with `--self-test`, exit 2. The clean self-test exits 0 with 23 plants RED. The battery bites; it just can't see the spellings above.

**Consumer row (row 4).** Plant: App.vue's `MOTION.rungs.leave` replaced by `200` → exit 1 (`--motion-leave has no reader`). The same plant plus a read added only in a `*.test.ts` → still exit 1, so test reads don't count. Sound.

## 3 · Constraints and battery (bare; tree copy | control = `git archive 74a2b5d9`; `logs/battery.txt`)

| gate | tree | control |
|---|---|---|
| lint:theme-tokens · lint:motion · lint:ink · lint:sleep · lint:lanes | 0 each | 0 each |
| check-copy-register (M16) · lint:knip · typecheck:e2e · `eslint . --max-warnings 0` | 0 each | 0 each |
| `shape-census --self-test` | 0 | — (no library at `74a2b5d9`) |
| `shape-census --tree` (reserve law) | 2 (anchor ABSENT) | — |

- **The reserve law (row 6).** It exits 2 on the tree. The lane's "or" arm is lawful: the seat is spelled like the union's, and it reads 28/28 on union+Δ (lane log, not re-run).
- **The @property census.** `check-property-block --dist` on the tree is 0. Served CSS has 49 `@property` vs 42 on the control: the seven rungs, nothing else.
- **filterBudget.** Every served `filter:` declaration is identical, tree vs control (sorted-diff empty: 8 = 8 non-none in CSS, 3 = 3 `url(#`). The lane's JS+CSS census reads 9 = 9. It doesn't grow.
- **AA.** No ink moved (the CSS equals pass 7's modulo scope hash, per the lane). I didn't re-read T9-R8.
- **vitest.** The lane's "69 of 70 files" is a chunking artifact. `vitest run src/games` whole collects 58/58 files and 749 tests with 0 failed (`logs/units.txt`); 58 + pencil 9 + composables 3 = 70. That gap is closed.
- **Imports.** `e2e/affordances.spec.ts` → `./lib/postpaint.mjs`; `scripts/check-theme-tokens.mjs` → `./shape-census.mjs`. A grep for `docs/` in `e2e/`, `scripts/` and `src/` finds 0 on both the tree and u8. No fork: the hand-rolled reader is deleted.
- **Frames.** None, so the headroom spent is 0 B. There's nothing to LOOK at. The ballot row (F-ERASE-2) is unframed by the lane's declaration.

## 4 · Open gaps (exact)

1. **Registration row class hole (row 3 not closed).** Six shipped spellings read 0: the escaped head, a sheet outside `src/`, `registerProperty(def)`, `CSS["registerProperty"]`, a `.bind` alias, and concatenated `@prop`+`erty` text. Both engines inherit 0s on six rungs. cpb `--dist` 1 vs row 0 on the CSS pair.
2. **The fence keys on the name, not on a running animation.** `animation-name: critghost` on the swap leave → 156–167 ms, 16–23 both-line frames, both engines. No gate reds it.
3. **π unclaimed.** `.board-margin` +2.83 px at 1280 fine (23.63 vs 20.80), both engines.
4. **Record correction.** On the tree the negative's "painted frames" is connected frames; it's visible on 1.
5. **F-ERASE-2 unframed.** T9-R8 cited, not re-read. User/UA-origin `!important` unplanted.
6. **The 2lh seat** is LEDGER's, unmeasured; on the tree the reserve law is red (anchor absent).
7. **PROPOSED to the chair, not landed:** `register-any`, `postpaint.d.mts`.

## 5 · Incidents (mine)

- My first `serve.sh up` was piped through `grep`, and the backgrounded subshell held the pipe. The foreground ran to the 120 s limit and was moved to the background (a stall-law breach). I cured it with `> /dev/null < /dev/null` on the subshell. Nothing else was affected, and the server was later stopped by its recorded PID.
- The first π run failed 8/8 on a random test title (Playwright re-collects titles). I fixed the titles and re-ran it; no number came from the failed run.
- Temporary-index `write-tree` in the lane's work tree wrote loose tree objects into the shared object store. No index, ref or file of the lane's was touched.
- No `rm`. Replaced plant dirs were `mv`d to `<scratchpad>/crit-erase8/trash-critE8/`. No git ran in the control tree. Nothing was written in the lane's tree.

## 6 · Replay

Everything is under `<scratchpad>/crit-erase8/`:
1. Build: `build.sh tree u8 rp`.
2. Serve: `serve.sh up <name> 4248 …` and the control on 4250.
3. Probe: `CRIT_PORT=4248 CRIT_WANT=<id> CRIT_MODE=swap|still|line2|pi|inherits npx playwright test --config .critE8/pw.config.ts`, run from `u8/web/frontend`.
4. Registration plants: `node plants.mjs <fe> <tag>`.
5. Unit plants and the whole games dir: `units.sh`.
6. Battery: `battery.sh`.

Copies of every script are in `instruments/`.
