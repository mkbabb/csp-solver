# CTRL-FACE · pass 10 · PROTOTYPE (§10, batch 3)

Author's record. The number is the critic's. Work tree `.claude/worktrees/wf_f72f3b5a-83a-33` (HEAD `74a2b5d9`),
advanced in place. Durable scratch `.claude/t9-scratch/work/pass10/CTRL-FACE/`. Ports :4234 (lane) and :4251
(control), both started and stopped by me by recorded PID.

## 0 · Open state (the resumption notice)

- The tree's product diff through a temporary index read tree `190d2538`, sha1 `5b26a2cb`, 883,664 B, 41 files:
  the pass-9 bank byte for byte. Continuation 2 left no edit in this tree, and no partial evidence under
  `pass10/prototype/CTRL-FACE/` (the dir did not exist).
- Homes v3 applied by sha (`homes.on-WAVE.diff` `0723d508`, the v2 → v3 step): `--3way` refused (untracked home
  files are not in the index), plain apply exit 0, 10 paths. The tree's 13 home paths then read byte-equal to
  `74a2b5d9 + homes.diff` (`07257854`) in a git-inited archive: 0 of 13 differ. No residual home edit.
- **The pass-9 on-WAVE delta does NOT apply on the WAVE `954bbbab`** (`git apply --check` exit 1, 9 of 9 files;
  the reverse check also exits 1 on 3 files). The WAVE already carries FACE's pass-9 bytes through s10's three
  seams (DrawerTab's merged comment, the gate's `bytes(p)`, X15's struck `.drawer-tab` entry). So the pass-10
  union is `954bbbab + homes v3 + this pass's step`, ported file by file with `git merge-file` (base = the
  pass-9 tree), never the pass-9 delta.

## 1 · Numbers first

### 1.2 · Row 2: CHECK 7 at class (`scripts/check-font-coverage.mjs`, consuming homes v3's `css-wide-kw` and `string-rule`)

- **Born RED, on this tree, before the consumer line moved** (homes v3 applied, pass-9 consumer, `readings/c7-open-homes3.log`): the critic's eleven re-authored from his descriptions (his scratch is gone; `instruments/p10plants.py`) plus S12 `revert` and S13 `var(--undeclared, initial)`. S1–S7 and S13 exit **1**. **S8 `revert-layer`, S9 `initial`, S10 `font: initial`, S11 `--k: revert; var(--k)` and S12 `revert` exit 0**: the keyword hole is FACE's consumer line (`KEYWORD.test(first) → lawful`). The string-RULE arm (S2–S4) already reds through the library, and S7 reds by a reading (`index.css:1331 … "Comic Neue"`), not a crash.
- **The cure (KW):** `lawful()` reads `SC.cssWide(first, customs).resets` before it admits a keyword: `inherit` and `unset` cascade the voice and stay lawful; `initial`, `revert`, `revert-layer` and a `var()` carrying a keyword red. `customs` maps every custom property to its declared value (a keyword in any declaration wins).
- **Tree, after (`readings/c7-tree-final.log`, exits read bare):** clean **0** · p7 16/16 **1** · p8 25/25 **1** · p9 7/7 **1** · p10 13/13 **1** (S1–S13) · negatives N1 `inherit` **0**, N2 `unset` **0** · restored **0**.
- **In-file battery (`node scripts/check-font-coverage.mjs`, `readings/fc-tree-clean.log`):** exit **0**, with S2/S3/S4/S7/S8/S9/S10/S11/S12 among its plants and `font-family: inherit`, `unset` and a voice-carrying `var()` among its lawful forms.
- **Clause sabotage (`--sabotage`, `readings/fc-tree-sabotage.log`): 8/8 clauses red when deleted** (V1 V2 C1 K1 B1u B1h B1n **KW**). KW's deletion greens exactly S8, S9, S10, S11, S12; no other plant.
- **The union** keys on CHECK 7's own lines (`c7=` in `readings/c7-union-final.log`), because the union's `test:font-coverage` reds at CLEAN on a row that is not CHECK 7: `BoardHost.vue <component :is="spec.furniture.cell"> binds cursor-name, cell-frames past its pin's bind set`. The pristine WAVE + homes v3 reds the same at clean (`readings/fc-waveh3-clean.log`, 0 CHECK 7 lines on both): it is the WAVE's own row (the record names MRK-LIVE's `font-coverage cell-frames`), not this delta's.

### 1.1 · Row 1: the stamp over the EMITTED dist (`scripts/check-face-engine-identity.mjs`, `e2e/face-law.spec.ts`)

- **The class cure.** Nothing names a source any more. The census records every file under `dist/` as it served it (`dist.files`, sha1 each, and `dist.digest` over the sorted `<rel>\n<sha1>\n`); the gate re-reads `dist/` NOW and REBUILDS the tree into `.face-engine/rebuild/` (`npx vite build --outDir …`, ~5 s), and holds the three equal file by file: (a) census = dist, (b) dist = rebuild. The `face-stamp` plugin, its sidecar and both config shims' crypto/mkdir declarations are struck (`vite.config.ts` and `config-node.d.ts` return to `74a2b5d9`'s bytes). A dev-served census is RED (src compiled on request emits no bytes to hold). A reader that throws reds WITH its exception (`ReferenceError: utf8 is not defined` is named in the row), never 'missing'; the spec records a throwing dist read as `dist.error`, which the gate prints.
- **Determinism, read:** the tree's dist and its rebuild are 43 files, digest `41f5c943cd81b40728eb0235858e9e8dc51f4c42`, equal.
- **Bare, final tree** (`index-DPjuxzWnk1D7.js` + `index-DcEK6GSST_db.css` 97,041 B; censuses chromium + WebKit at DPR 3, both naming that digest): `--self-test` exit **0**, five checks GREEN, **19/19 plants bite** (`readings/stamp-tree-selftest.log`).
- **Born RED on disk, the critic's class first** (`instruments/stamp-run.sh`, a copy of the tree with its own `git init`, the tree's dist and censuses; `readings/stamp-battery-tree.log`): CLEAN **0** · **W** one statement in `solver.worker.ts` **1** (33 emitted files move) · **R** utility names in `sudoku/README.md` **1** (33) · S `scene.css` letter-spacing **1** (33) · F Patrick Hand offset 127 flipped **1** (35) · P `public/404.html` one byte **1** (1) · D a dist chunk appended after the build, no source edit **1** · N a comment-only source edit **0** (no emitted byte moves: correctly no edit to the card) · RESTORED **0**.
- **Clause sabotage** (`FACE_SABOTAGE=<clause> --self-test`, `readings/stamp-tree-clause-sabotage.log`): **6/6** clauses blind exactly their own plant and exit 1: tree → plant W's class; served → the stale index-*.js; dist → another dist's bytes; twin → files not the digest's (a plant added this pass: the first twin plant was also caught by `dist`, so `twin` had no plant of its own, exit 0, cured); word → 0.6 px; paint → 4 device px.
- **What the cure does not buy:** a census taken on a dev server is now refused, so the row is read on a served dist only. `lint:face-engine` says "a census is missing" on any tree where face-law has not run on both projects; that is the gate's correct state, and on the union it is read below with both censuses written.

### 1.3 · Row 3: the ring ledger per engine (pick 14: the drawer-tab entry struck, the row re-read per engine)

- **The key.** Every ledger site is `cell|engine|control|band` (`1280 fine|webkit|button.drawer-tab "controls"|left`). The control's name carries its label, so the six `ctrl-btn` chips are six keys, not one. The read goes through homes v3's `admittedSites(sites, entries, {key})`, which returns `unadmitted` (thin, not listed) and `stale` (listed, not thin); the row reds on both. `RING_HOLES` is **empty**: the drawer-tab entry is struck, and no other entry was minted, so nothing is masked.
- **The negatives, re-cut.** The pass-9 critic's HIDE and BITE clipped at `-4px` and spared any ring drawn closer than 3 px: on the union at 1280, chromium, BITE left **six controls whole** (4×4, 9×9, 16×16, Easy, Hard, Deal read d2 on all four bands under the plant; `readings/facelaw-union-c.log`). Both now clip one whole band at the box edge (`inset(-8px -8px 0 -8px)`, `inset(-8px -8px -8px 0)`). Re-run (`readings/facelaw-union-c-ledger.log` chromium, `readings/facelaw-union-w.log` WebKit): **escaped = [] for HIDE and BITE at 390 and 1280 on both engines** (each row reaches its final assertion only past both negatives).
- **The reading, union (`954bbbab + homes v3 + this delta`), empty ledger:** the paint row is **RED** on both engines at both cells. Off the ledger: chromium 390 **21** sites, 1280 **7**; WebKit 390 **8**, 1280 **10**.
  - Every one of the four reads includes the drawer tab on all four bands.
  - 1280 on both engines: `Off` bottom, `Ask` right and the invite button's bottom; WebKit adds `Live` right, and Fill and Solve bottoms.
  - At 390 the chromium list is the LIVE arm's species: thin bottoms at depth 1.33–1.67 on the chips, Deal, invite and the action bar.
- **Form clause** (one ring, a second form reds): **GREEN** at both cells on both engines, its planted second form caught in the same run.

### 1.4 · Union face-law, whole (`e2e/face-law.spec.ts`, the union served on :4234)

| engine | passed / failed | the reds | zone inuse queued → end |
|---|---|---|---|
| chromium | 51 / 8 | `:2205` four-band ×6 at 390 (bottom d1.33 < 1.80, LIVE's species) + both §1.3 paint rows | 523,462 → 593,470 |
| WebKit (`--exclusive webkit`) | 51 / 8 | the same eight (`:2205` bottom d1.67 at 390) | 683,815 → 843,388 |

The `:2205` reds are the WAVE's: π below reads the union equal to `954bbbab + homes v3` at rest, and the delta's only product edit is one comment in GameControlPanel's style block (it moves the SFC's scope id, `data-v-594a57bd` → `data-v-1b2c03e5`, 824 bytes of CSS, the file size unchanged at 112,462 B). The WAVE's own face-law was not run on `waveh3` this pass.

### 1.5 · π at rest (`instruments/pi10.mjs`, PRM, one pinned payload; one browser per run, a context per read)

| A vs B | engine | 1280×800@1 | 390×844@3 coarse, drawer | null A-vs-A |
|---|---|---|---|---|
| union `BjWgHjsOJZJw` vs WAVE + homes v3 `B3AhQX0wXIN4` | chromium | **0** / 1,024,000 | **0** / 2,962,440 | 0 · 0 |
| same | WebKit | **0** / 1,024,000 | **0** / 2,962,440 | 0 · 0 |
| tree `DPjuxzWnk1D7` vs control `CubiZsMVSwTc` (`74a2b5d9`) | chromium | 30,654 | 291,373 | 0 · 0 |
| same | WebKit | 31,371 | 299,237 | 0 · 0 |

The tree-vs-control figure is the family's whole product footprint on `74a2b5d9` (the pass-9 bank plus this pass), not this pass's step. On the WAVE, this pass's step is zero pixels on both engines.

### 1.6 · The union stamp, both censuses (`readings/stamp-union-selftest.log`)

`--self-test` exit **0** on the union. Dist and rebuild both read 44 files, digest `da022691e3c6…`. The chromium and WebKit censuses name that digest (14 chips each; painted mark 32.667 vs 32 at DPR 3). Five checks GREEN, **19/19 plants bite**. The tree re-read after the comment edit (`readings/stamp-tree-selftest-final.log`): exit 0, rebuild digest `41f5c943…` unchanged.

### 1.7 · The frame (sweep: p9-f1 re-shot faithful)

- **The file:** `frames/p10-f1-b-face-ring-solid-vs-dash-union-chromium-light-1280x800-dpr1-retires-p9-f1-b-face-ring.png`, 3,325 B, 158×66, retiring `p9-f1-b-face-ring`.
- **What it shows:** one control (`4×4`), one variable (the ring's style), on the union's served build (`BjWgHjsOJZJw` / `JeNFz-21wI9h`) at DPR 1.
- **The reading:** the solid arm is GREEN (core 4.29–4.33, depth 2, holes 0 on four bands). The dashed arm is RED on B4 holes (0.28–0.32) and B3 depth (left 1.26, bottom 1.68); `readings/frame-union-c.json`.
- **The budget:** headroom 102,698 B before this frame and 99,373 B after it, not counting p9-f1's retirement.

## 2 · Gaps first

1. **The drawer tab's ring is not whole, on any cell or engine.** It sits off the ledger on four bands in all four union reads, and the per-band instrument agrees on the tree (`readings/bands-tree-{c,w}{390,1280}.log`): top depth 0.63, right 1.06 at 390, bottom 1 with h1 under `div.mobile-heading-row` at 390, left 1 under `input.cell-native-input` at 1280. The named mechanisms:
   - at 390, right: the ≤400 dock leaves 4 px of air against the ring's 5 px reach;
   - bottom: the card (z 45) over the tab (z 1);
   - top and left: the HandDrawnOutline SVG (outset 3, stroke 2.5, z 1) over the ring;
   - at 1280, left: T9-W2 §2.7's tuck under the board.

   Three cure attempts on `DrawerTab.vue` did not move the instrument and were withdrawn (the file is at pass-9 bytes). The crop shows a 2 px ring where the probe reads α50 width 1, and that disagreement is itself open. Under pick 14 the row reads RED rather than admitting the tab.
2. **The other controls read thin.**
   - At 1280: `Off` bottom, `Ask` right and invite bottom on both engines; on WebKit also `Live` right and Fill and Solve bottoms.
   - At 390, chromium: 21 sites, LIVE's species (bottom depth 1.33–1.67 in the action bar and options rows).
   - `:2205` four-band ×6 at 390 on both engines. That row is the WAVE's, and this delta is zero pixels against it.
   - None is admitted. These are product reds for the owners of those seams.
3. **The pass-9 critic's negatives were blind to close rings.** Cured in the spec (§1.3); the critic's descriptions should be re-read against the re-cut plants.
4. **The union's `test:font-coverage` is RED at clean on the WAVE's BoardHost `cell-frames` row**, the same as pristine `waveh3`, so CHECK 7 is read on its own `c7=` lines there. **The union's `lint:sleep` is RED** on `note-reserve.spec.ts:357`, also the same as `waveh3`.
5. **The CSS-bytes figure.** WAVE9's read names 115,719 B for the WAVE's CSS. A faithful build of `954bbbab` (bare and with homes v3) emits 112,462 B under the same JS name `B3AhQX0wXIN4`. That is not reconciled here.
6. **The kernel zone leak was ARMED for this whole continuation** (`~/.claude/guard/ZONE-ARMED`, written 21:30:49; slope ~290/s). Every browser row ran at zone inuse between 523,462 and 934,723, under the 8,000,000 law, and each reading's `.load` file carries its inuse. The guard asks that the owner be told, and that the owner decide on the reboot.

## 3 · Replay route

- **The tree:** `74a2b5d9` + `homes.diff` (`07257854`) + `bank/pass10.diff`. In `web/frontend`, run `vite build`, then `vite preview --port 4234`. Run `face-law.spec.ts` per project (`--workers=1`, WebKit under `--exclusive webkit`), then `node scripts/check-face-engine-identity.mjs --self-test`, then `node scripts/check-font-coverage.mjs` and `--sabotage`.
- **The union:** `954bbbab` + `homes.on-WAVE.diff` (`0723d508`) + `bank/pass10.delta.on-WAVE.diff`. The same rows apply; π is `instruments/pi10.mjs`, with A and B served on :4234 and :4251.
- **On s10:** `1be6fe37` + `homes.on-WAVE.diff` + `bank/pass10.delta.on-s10.diff`.

## 4 · Bank line

The figures below are from `bank/BANKED.txt`. Every `--check` exits 0 on its declared base, both bare and with homes v3.

| file | sha1 | size | files | change |
|---|---|---|---|---|
| `pass10.diff` | `b83cd2ba` | 446,591 B | 26 | +5,832 / −367 |
| `pass10.delta.on-WAVE.diff` | `865ab9e6` | 56,350 B | 7 | +359 / −358 |
| `pass10.delta.on-s10.diff` | `f1c14487` | 56,207 B | 7 | +359 / −360 |

The on-WAVE delta does **not** apply on s10 (exit 1, `face-law.spec.ts:2228`), and that is why the on-s10 delta exists.

## 5 · Incidents

- Three Edits went out in one response, and one guarded launch was backgrounded with `&` inside a foreground call. Both break the one-call law.
- A first CHECK 7 battery was launched twice by a stray `&`. Both runs were killed and the log moved to the trash; it was re-run once.
- My own queued runs were killed: the pre-cure union probe and a stale union WebKit probe.
- One ledger re-run misfired on a missing `PLAYWRIGHT_BASE_URL` (global setup timed out on :3000). Its files are in the trash, and it was re-run.
- Every server I started was stopped by its recorded PID after checking its cwd: union 49502, control 19296 and 78194, WAVE 51818, tree 78195.
