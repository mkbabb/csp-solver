# T8-W5 · the quiet driver — the frontmost apparatus, abrogated

The owner's order: *"Abrogate ALL of that edict and script items—remove that 'foremost' command …
This should run in the background, though in a HEADFUL instance with PROPER automated safari
instance automation."*

This file is the record of the surgery, the mechanism that replaced it, and the one platform
truth the replacement uncovered.

---

## 1 · What was deleted

`perf-rig/run-safari.sh` drove real Safari by taking the owner's desktop. Every piece of that is
gone from the file — deleted, not flagged, not made conditional:

| deleted | what it did |
| --- | --- |
| `PREV_APP="$(osascript … frontmost is true)"` | captured whose window was on top, to restore later |
| `osascript … tell application "Safari" … activate` | opened the URL as the front window's current tab, Safari frontmost |
| `open -a Safari "${URL}"` fallback | same thing again when the AppleScript was refused |
| `FRONT_NOW != Safari` warning + `sleep 2` | asserted the seizure had worked |
| the re-assert loop | **every 2 s for the life of the run**, if anything else took the front, `tell application "Safari" to activate` |
| `REASSERTS` counter | counted the thefts and printed them as a caveat on the numbers |
| the osascript tab-cleanup sweep | walked windows closing rig tabs |
| closing `tell application "${PREV_APP}" to activate` | handed the desktop back |

`run-sim.sh` carried the same apparatus for the Simulator (`open -a`, `activate`, a 2 s re-assert
loop, a restore). Also deleted; it now launches with `open -g -a Simulator` — backgrounded — and
drives the device through `simctl` alone.

Residue check, run against both files:

```
$ grep -n "osascript|activate|open -a|frontmost|PREV_APP|REASSERT" run-safari.sh run-sim.sh
  → only comment lines, all of them in the block documenting this deletion
```

`KEEP_SAFARI_FRONT` / `KEEP_SIM_FRONT` — the escape hatches `w5-bench.sh` used to hold the front
across a matrix — are gone too, from the drivers and from their caller.

---

## 2 · What replaced it — `perf-rig/safari-wd.mjs`

`safaridriver` hosts an **isolated automation Safari**: its own window, private-like state, and a
glass pane over the content that makes the session immune to stray input. The owner keeps typing
in their own apps; nothing they do perturbs the run, and the run never reaches for the front.

A lean W3C client — `fetch` against `http://127.0.0.1:<port>/session`, no Selenium, ~300 lines:

- `POST /session` · `POST /session/<id>/url` · `POST /session/<id>/execute/async` ·
  `GET /session/<id>/screenshot` · `DELETE /session/<id>`
- **Set Window Rect** to a small corner window (`--rect x,y,w,h`, default `1400,700,560,440`),
  never minimised.
- **The paint gate**, run from inside the page immediately before and after every burst:
  `document.visibilityState === 'visible'` **and** an rAF cadence probe (30 frames, p50 ≤ 120 ms —
  deliberately generous, because it detects occlusion, not slowness). A failing gate returns
  **`OCCLUDED-INVALID`** and the row is refused. It is never cured by taking focus.
- **One activation for the whole bench.** Creating a session launches the automation Safari and
  raises its window once — the single activation the order allows. `--session-file` banks the
  session id and every subsequent burst reuses it (`REUSING session … no new window, no
  activation`), so a 15-cell matrix costs one, not fifteen.

`probe.js` needed the matching change, because its own gate was the same mistake one layer down:
`measure()` waited up to 30 s for `document.hasFocus()` and marked any window that ran without it
`tainted`. Under WebDriver (`navigator.webdriver`, or `__focusGate=off`) it now gates on
**visibility + cadence** instead, and focus stops being evidence of anything. Scenarios declare
whether they paint; `solveMatrix` sets `needsPaint: false` and is gated on nothing at all.

---

## 3 · The platform truth the gate uncovered

**The frontmost-forcing was misdiagnosed as a focus problem. It is an occlusion problem, and
occlusion is not curable from inside a background process.**

Measured on this box, in the automation window, with no focus forcing:

| condition | rAF | JS/CPU |
| --- | --- | --- |
| window visible (right after session launch) | **p50 17 ms**, 30 frames, 60 Hz | — |
| window hidden (`visibilityState: hidden`) | **0 callbacks in 20 s** — suspended outright, not throttled | **84 / 84 / 91 ms** on fixed integer work — full speed |

So:

- **Frames cannot be measured in a hidden window.** Not slowly — not at all. The old driver's
  `activate` was buying visibility, and it was the only thing buying it.
- **Compute can.** A hidden, unfocused, backgrounded Safari runs JS and workers at full speed,
  which is why the entire solver matrix below is real-Safari data taken while the owner worked.

The window went `hidden` within seconds of launch and stayed hidden at every rect tried —
`0,0 900×700`, `1100,50 900×700`, `0,600 1000×540`, `1400,700 560×440`. Placement is not the
variable. A macOS full-screen app occupies its own Space, and a window on another Space is
occluded by definition; nothing a WebDriver client can send changes that.

**The one thing that unblocks the desktop frame lanes** — and it is an owner action, once:

> Leave the automation Safari window visible on the **active** Space while a frame bench runs —
> i.e. not behind a full-screen app. A corner of desktop is enough; the window never takes focus
> and never accepts input, so it costs attention, not interaction.

With that, `./w5-bench.sh boil safari <tag>` runs the whole 15-cell matrix in the background at
one activation. Without it, every frame row is correctly refused as `OCCLUDED-INVALID` — which is
what happened to r3, all 15 of 15.
