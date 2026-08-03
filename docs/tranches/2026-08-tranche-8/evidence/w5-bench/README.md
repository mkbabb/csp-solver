# T8-W5 — the bench: boil × multiplayer, and solving, on real Safari and the iOS simulator

The owner's order: *"what of our performance of both the design (boiling) of the multiplayer
(all lanes) and the solving (all lanes) — we should bench this properly, and in an actual
ios/safari env."*

Two families, two real engines, one footnote engine.

---

## 1 · The rig — what was already here, what was reused, what was built

**T4-P1 left a whole instrument**, and it is the reason this wave measured rather than built.
`web/frontend/perf-rig/` already held the frame sampler (`probe.js`), a zero-dep host that
injects it at serve time (`probe-server.mjs`), an AppleScript driver for **real desktop Safari**
(`run-safari.sh`) and a `simctl` driver for **real MobileSafari on the iOS simulator**
(`run-sim.sh`), the app-free `/__ceiling` control, and the build-identity assertion
(`scripts/dist-identity.mjs`) that refuses to produce numbers with no tree attached.

None of that was rewritten. What this wave added is the two things P1 had no reason to have —
a peer, and a solver harness — plus one honesty patch to the drivers.

| path | status | what it is |
| --- | --- | --- |
| `perf-rig/probe.js` | **extended** | +`liveWindow` (settable window, main-thread occupancy, roster census), +`solveMatrix` (the app's own worker, game × size × tier), +`startBusySentinel`, +`sessionCensus` |
| `perf-rig/peer.mjs` | **new** | the second player, headless — speaks `relayWire.ts`'s wire at the real relay |
| `perf-rig/w5-bench.sh` | **new** | the orchestrator: quiet gate, load stamping, peer lifecycle, shard loop |
| `perf-rig/w5-summarize.mjs` | **new** | the two families' JSONL → tables, every row carrying its load |
| `perf-rig/run-pw.mjs` | **new** | the chromium footnote lane, and a ten-second smoke loop for probe changes |
| `perf-rig/run-safari.sh` · `run-sim.sh` | **patched, 2 lines each** | `$DIST` names a snapshot for the identity assertion (see §1.2) |
| `perf-rig/probe-server.mjs` · `/__ceiling` · `scripts/dist-identity.mjs` | **reused as-is** | |

### 1.1 · The peer is not a second browser

A multiplayer frame window needs somebody at the table. The obvious way — a second browser
context — puts a whole second WebKit (compositor, rasteriser, its own boil) on the machine whose
frame curve *is* the measurement, and every number then carries it.

`peer.mjs` is ~200 lines of node speaking the shipped wire directly: NIP-01 `EVENT`, kind
`20411`, `x` tag `sudoku-babb-dev/<room>`, the same four words (`hi` / `op` / `st` / `bye`).
It costs one idle socket. It is a real member of the room by every test the app applies — the
page's roster counts it, it adopts the page's epoch off `st`, and its digits ink in its own
colour.

It plays like a player: digits into empty non-given cells, chosen legal for their row and
column, and it **stops two cells short of completion** so a celebration never fires inside a
steady-state window. Past the first lap it revises cells it already wrote, because an EASY 9×9
has ~20 holes and a plan played once runs dry before the window opens.

**Proof of work travels with every window.** `sessionCensus()` reports distinct player slugs (not
roster rows — both control-panel twins are mounted, so a row count reads double), whether the
well still says "connecting…", inked-cell count, and the ink/fill delta across the window
itself. A row claiming a multiplayer state with `players: 1` is a mislabelled solo row and is
thrown out, not quoted.

### 1.2 · Two honesty patches, both earned

**`$DIST`.** `../dist` is gitignored, unowned, and holds whatever the last `npm run build` on
this checkout produced — the banked D6-G3 class, which reproduced itself *while the row closing
it was being written*. Three sibling lanes were building and running suites on this box for the
duration of this wave. So the tree was snapshotted once, both the server and the identity
assertion were pointed at the snapshot, and every run opens with the same line:

```
AUDIT: build-identity — dist entry index-C9b17OTx4t72.js · index.html md5 791e9fb1… · 41 files / 744.7 KB
AUDIT: build-identity — http://localhost:4244/ serves the same entry (index-C9b17OTx4t72.js)
```

**Main-thread busy, on an engine with no `longtask`.** GATE D's standing caveat is that WebKit
ships no `longtask` entry type, so every busy number this estate has printed came from chromium
and stopped short of the platform the owner plays on. `startBusySentinel` uses the one clock
every engine agrees about: a nested `setTimeout` is clamped to 4 ms by spec, so a tick landing
later than 4 ms was late because the thread was elsewhere, and busy is the integral of that
lateness. It counts script, style, layout and paint dispatch alike — a boil that paints for 8 ms
of every 10 ms frame *is* a busy main thread. It is an **estimate and a floor**: work finishing
inside the clamp is invisible to it, so a small number means "nothing long ran", never "nothing
ran". Its own cost is measured rather than asserted — every cell takes `idle3s` (no sentinel) and
`liveWindow` (sentinel) back to back on the same load, and the delta between them is the
instrument's price, printed rather than argued.

---

## 2 · Discipline — the machine stayed the owner's

- Everything outside a measurement burst ran `nice -n 15`. Bursts themselves did **not**: a
  nice'd measurement measures niceness.
- **The quiet gate.** Every burst waits for the 1-minute load average to fall under **8.0**
  before it opens, and stamps the load it opened *and closed* under into its own run file. A
  burst whose load rose past the gate mid-run is marked `!` and is not quotable. This is the
  rig's own banked law — a WebKit RED at load 13.83 that went GREEN at 2.99 on the same dist.
- Serial by construction: one browser, one window, one cell. Never two engines at once.
- Ports 4244 only. No sudo, no system settings touched. The simulator boot is per-user.

---

## 3 · The two ceilings, and why the desktop table is a ratio table

`/__ceiling` is re-measured every session because no app number means anything without its
denominator.

| surface | this wave | T4-P1 | note |
| --- | --- | --- | --- |
| desktop Safari 26.4 | **60.55 fps** (p50 17 ms, ~59 Hz) | 98.4 fps (~100 Hz) | **the panel changed** |
| iOS 26 sim | see §5 | 59.76 fps | the sim renders at 60 regardless of host panel |

P1's own baseline says it outright: it ran on *"the external 4K panel at a ~100 Hz ceiling, not
the built-in 120 Hz XDR — a run on the built-in would shift every absolute number; the
%-of-ceiling column is the portable one."* Safari on this host is now on a **60 Hz** surface.

**Consequence, stated before any table is read.** `gates.json`'s desktop absolutes
(`idle3s.minFps 97`, `deal 96`, `themeToggle 85`, `galleryGlide 83`) are anchored to a 98.4 fps
ceiling and are **unreachable on a 60 Hz panel by arithmetic, not by regression**. The desktop
rows below are therefore adjudicated on **% of ceiling**, which is the column the rig itself
calls portable, and on **`long33`**, which is unit-free — a frame over 33.4 ms is a dropped frame
at any refresh rate, and it is the P1 defect's own signature (23 per 3 s window at base, 0 after
the cure).

The **iOS sim rows are directly gate-comparable**: the simulator's 60 Hz is its own, not the
host panel's, and `gates.sim` was written against exactly that.
