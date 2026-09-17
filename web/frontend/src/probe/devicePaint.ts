/**
 * T9-W8 §8.3 — THE OWNER-RUN DEVICE INSTRUMENT (the DOM half).
 *
 * Charter: docs/tranches/2026-08-tranche-9/evidence/w8/cures/charters/8.3-device-instrument.md.
 * The wave's readings come from a REAL iOS instance (M06/M19): no session drives a browser,
 * the OWNER loads the deployed edge with `?__probe=1`, taps the app's own controls, and taps
 * COPY. This file is what listens while that happens.
 *
 * WHY A QUERY FLAG AND NOT A BOOKMARKLET. `public/_headers` serves
 * `script-src 'self' 'wasm-unsafe-eval'` with no `'unsafe-inline'`, and under CSP Level 3 a
 * `javascript:` URL is a script source governed by `script-src`. A bookmarklet typed into
 * Safari's address bar on the edge is refused by the estate's own policy. So the probe ships
 * IN the bundle, as a content-hashed same-origin chunk, reached by ONE dynamic `import()` in
 * `main.ts` behind `?__probe`. No header changes, nothing added to the entry chunk, and no
 * request at all on a load that does not carry the flag.
 *
 * WHAT IT DOES NOT DO. It never clicks the app for the owner. The whole point of a device
 * reading is the gesture the owner's thumb actually makes, so the probe WATCHES the app's own
 * controls (capture-phase listeners, `MutationObserver`s) and never drives them. Its only
 * buttons are the two that declare the load and the one that exports.
 *
 * WHAT IT COSTS THE MEASUREMENT. Nothing is appended to the document until the boot window
 * closes at 8 s, so the window it reports is a window with no probe DOM in it. Before that it
 * holds observers and one rAF ticker. `HTMLCanvasElement.prototype.toBlob` is wrapped by a
 * counter (the bake's own encode path, A1's census) and the wrapper calls straight through.
 *
 * M09: it reads. No bake is dropped, no boil thinned, no filter removed, no transition
 * shortened, and no rendered pixel of the app changes, so pi identity is untouched.
 */
import {
  BOOT_WINDOW_MS,
  LONG_FRAME_MS,
  type MarkValue,
  type RafGap,
  deviceCell,
  distinctWidths,
  gapProxyMs,
  isOcclusionGap,
  rafCensus,
  round1,
  settleAtMs,
  toReadingRow,
} from "./deviceMarks";

/** The flag. One spelling, read in one place. */
const PROBE_FLAG = "__probe";

/** The whirl the first theme flip has to survive (the Bloom is about 1,010 ms). */
const WHIRL_MS = 1100;

/** A fold's frame census window: the wordmark glides 520 ms and the controls settle after. */
const FOLD_WINDOW_MS = 900;

/** Taps closer together than this share a settle, so the second one is marked. */
const TAP_SPACING_MS = 2000;

interface TapRow {
  index: number;
  atMs: number;
  settleMs: number | null;
  bakes: number;
  blockingProxyMs: number | null;
  whirlLong33: number;
  whirlWorstMs: number;
  note: string;
}

interface GestureRow {
  index: number;
  direction: string;
  flipMs: number | null;
  long33: number;
  long50: number;
  worstMs: number;
  widths: number;
}

export function isProbeArmed(search: string): boolean {
  try {
    return new URLSearchParams(search).has(PROBE_FLAG);
  } catch {
    return false;
  }
}

export function mountDeviceProbe(): void {
  if (!isProbeArmed(window.location.search)) return;

  // ── the observers, all armed before anything is rendered into the page ──────────────
  const gaps: RafGap[] = [];
  const work: number[] = []; // bake landings and long frames: the settle rule's input
  const taint: string[] = [];
  const notes: string[] = [];
  const marks: Record<string, MarkValue> = {};
  let bakeEncodes = 0;

  const now = () => performance.now();

  // WHEN OBSERVATION BEGAN. The probe is a lazily fetched chunk, so it arms a little after
  // navigation start; paint, LCP and long task entries are read buffered and so predate it,
  // but a frame gap or a DOM mutation before this moment was never seen. The number is banked
  // on every row so a reader can hold each mark against it instead of assuming.
  marks.probeArmedMs = now();

  const observePaint = () => {
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.name === "first-paint" && marks.firstPaintMs == null)
            marks.firstPaintMs = e.startTime;
          if (e.name === "first-contentful-paint" && marks.fcpMs == null)
            marks.fcpMs = e.startTime;
        }
      }).observe({ type: "paint", buffered: true });
    } catch {
      notes.push("no paint entries on this engine");
    }
    try {
      new PerformanceObserver((list) => {
        const es = list.getEntries();
        marks.lcpMs = es[es.length - 1].startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      notes.push("no largest contentful paint on this engine");
    }
  };

  // longtask is chromium's. Safari has none, so every blocking figure below it is a PROXY
  // and the readout says so in those words.
  const types: string[] =
    (PerformanceObserver as unknown as { supportedEntryTypes?: string[] })
      .supportedEntryTypes ?? [];
  const ltSupported = types.indexOf("longtask") >= 0;
  const longTasks: { at: number; ms: number }[] = [];
  if (ltSupported) {
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          longTasks.push({ at: e.startTime, ms: e.duration });
      }).observe({ type: "longtask", buffered: true });
    } catch {
      notes.push("long task entries refused");
    }
  } else {
    notes.push(
      "this engine has no long task census, so every blocking figure here is a frame gap proxy",
    );
  }

  observePaint();

  // TAINT. A reading taken while the page was hidden, blurred or suspended is not quoted.
  //
  // THE TARGET CHECK IS LOAD-BEARING, and it cost a capture to learn: `blur` does not bubble,
  // but a CAPTURE listener on `window` sees every element's blur on the way down, so an
  // ordinary tap that moves focus from one button to another taints the reading. Measured: a
  // capture run banked `taint: ["blur at 22203 ms", "blur at 25272 ms"]` with the page in the
  // foreground throughout (probe-row-wk-precure.jsonl). Only the WINDOW losing focus is the
  // fact this rule is about.
  for (const ev of ["blur", "pagehide"])
    window.addEventListener(
      ev,
      (e) => {
        if (e.target !== window) return;
        taint.push(`${ev} at ${Math.round(now())} ms`);
        render();
      },
      true,
    );
  document.addEventListener("visibilitychange", () => {
    taint.push(`the screen went away at ${Math.round(now())} ms`);
    render();
  });

  // THE TICKER. One rAF chain for the whole session: it feeds the gap census, the settle
  // rule, the occlusion tell, and the per-fold width census.
  let last = now();
  let widthSampler: ((t: number) => void) | null = null;
  const tick = () => {
    const t = now();
    const gap = t - last;
    last = t;
    if (gap > LONG_FRAME_MS) {
      gaps.push({ at: t, ms: gap });
      work.push(t);
    }
    if (isOcclusionGap(gap))
      taint.push(`frame gap ${Math.round(gap)} ms at ${Math.round(t)} ms`);
    widthSampler?.(t);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // THE BAKE. `toBlob` is the encode the pose stacks pay (A1's census); the wrapper counts
  // and calls through, so a bake lands in the settle rule's work list at the moment it
  // finishes rather than at the moment it was asked for.
  const canvasProto = HTMLCanvasElement.prototype as unknown as {
    toBlob: (cb: unknown, ...rest: unknown[]) => void;
  };
  const nativeToBlob = canvasProto.toBlob;
  canvasProto.toBlob = function (cb: unknown, ...rest: unknown[]) {
    bakeEncodes += 1;
    const wrapped =
      typeof cb === "function"
        ? (...args: unknown[]) => {
            work.push(now());
            return (cb as (...a: unknown[]) => unknown)(...args);
          }
        : cb;
    return nativeToBlob.call(this, wrapped, ...rest);
  };

  // BOARD READY — the one W8 definition: a VISIBLE `.board-group` whose first
  // `.board-cells .game-cell` has a non zero rect, read one frame later. A bare `.cell`
  // matches nothing on this tree, which is why the selector is spelled out.
  const visible = (el: Element | null): boolean => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const liveCell = (): Element | null => {
    for (const bg of Array.from(document.querySelectorAll(".board-group"))) {
      if (!visible(bg)) continue;
      const cell = bg.querySelector(".board-cells .game-cell");
      if (cell) {
        const r = cell.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return cell;
      }
    }
    return null;
  };
  const pollReady = () => {
    if (marks.boardReadyMs == null) {
      const cell = liveCell();
      if (cell) {
        marks.cellsMs = now();
        requestAnimationFrame(() => {
          marks.boardReadyMs = now();
          armBoil();
        });
        return;
      }
    }
    requestAnimationFrame(pollReady);
  };
  requestAnimationFrame(pollReady);

  // GIVENS — the first cell carrying text. Reported with its distance from the cells mark,
  // because the blank board between the two is what a player sees (B5).
  // A GIVEN IS AN INPUT'S VALUE ON THIS TREE, not a text node: every `.game-cell` holds an
  // `<input>` and the digit is its `value` (81 cells, 0 of them carrying text, measured
  // against this dist). A3's banked probe reads exactly this pair, `textContent` first and
  // then the input, so the mark stays the same quantity as ATTRIBUTION row 5's.
  const cellText = (cell: Element): string => {
    const text = (cell.textContent ?? "").trim();
    if (text.length > 0) return text;
    const input = cell.querySelector("input");
    return input ? (input as HTMLInputElement).value.trim() : "";
  };
  const pollGivens = () => {
    if (marks.givensMs == null) {
      for (const cell of Array.from(
        document.querySelectorAll(".board-cells .game-cell"),
      )) {
        if (cellText(cell).length > 0) {
          marks.givensMs = now();
          if (typeof marks.cellsMs === "number")
            marks.givensMinusCellsMs = (marks.givensMs as number) - marks.cellsMs;
          break;
        }
      }
    }
    if (marks.givensMs == null) requestAnimationFrame(pollGivens);
  };
  requestAnimationFrame(pollGivens);

  // FIRST BAKE — the first `.boil-frame-bitmap` ever in the document.
  new MutationObserver(() => {
    if (marks.firstBakeMs == null && document.querySelector(".boil-frame-bitmap")) {
      marks.firstBakeMs = now();
      marks.bakeLayers = document.querySelectorAll(".boil-frame-bitmap").length;
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // BOARD DRAWN, the budget mark (B1): the first `is-active` MOVE between boil siblings
  // after board ready. The siblings are `.boil-frame-bitmap` and `.boil-frame-layer`
  // (HandDrawnGrid.vue:385 and :407). NOT `.boil-frame`, which matches nothing here.
  const BOIL_SELECTOR = ".boil-frame-bitmap, .boil-frame-layer";
  function armBoil() {
    const seed = new Map<Element, boolean>();
    for (const el of Array.from(document.querySelectorAll(BOIL_SELECTOR)))
      seed.set(el, el.classList.contains("is-active"));
    const obs = new MutationObserver((recs) => {
      for (const rec of recs) {
        const el = rec.target as Element;
        if (!el.matches?.(BOIL_SELECTOR)) continue;
        const active = el.classList.contains("is-active");
        if (seed.has(el) && seed.get(el) !== active) {
          marks.firstBoilTickMs = now();
          marks.boardDrawnMs = marks.firstBoilTickMs;
          obs.disconnect();
          render();
          return;
        }
        seed.set(el, active);
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });
  }

  // ── the gestures: watched, never driven ────────────────────────────────────────────
  const taps: TapRow[] = [];
  const gestures: GestureRow[] = [];
  let folds = 0;

  const settleOne = (row: TapRow, tapAt: number, bakesBefore: number) => {
    const poll = () => {
      const t = now();
      const settle = settleAtMs(tapAt, work);
      if (t >= settle) {
        row.settleMs = round1(settle - tapAt);
        row.bakes = bakeEncodes - bakesBefore;
        row.blockingProxyMs = gapProxyMs(gaps, tapAt, settle);
        const whirl = rafCensus(gaps, tapAt, tapAt + WHIRL_MS);
        row.whirlLong33 = whirl.long33;
        row.whirlWorstMs = whirl.worstMs;
        render();
        return;
      }
      requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
  };

  document.addEventListener(
    "click",
    (ev) => {
      const target = ev.target as Element | null;
      // THE READOUT GETS OUT OF THE WAY, and it does not wait to be asked. Measured at
      // 390x844: an expanded card sits over the drawer tongue and Playwright's click on
      // `.drawer-tab` timed out 5 of 5 times (evidence ab-mob4x-armed.jsonl, the pre-cure
      // set). An instrument that blocks the gesture it exists to time is not an instrument,
      // so the first tap that reaches the app collapses it to its handle.
      if (target && !target.closest?.("[data-device-probe],[data-device-probe-handle]"))
        collapse();
      const el = target?.closest?.(".sun-moon-toggle, .drawer-tab");
      if (!el) return;
      const at = now();
      if (el.classList.contains("sun-moon-toggle")) {
        const prev = taps[taps.length - 1];
        const tooSoon = prev ? at - prev.atMs < TAP_SPACING_MS : false;
        const row: TapRow = {
          index: taps.length + 1,
          atMs: round1(at),
          settleMs: null,
          bakes: 0,
          blockingProxyMs: null,
          whirlLong33: 0,
          whirlWorstMs: 0,
          note: tooSoon ? "taken less than two seconds after the tap before it" : "",
        };
        taps.push(row);
        settleOne(row, at, bakeEncodes);
        render();
        return;
      }
      // THE DRAWER. Flip latency is the tap to `aria-expanded` to two frames later (M02's
      // own mark), and the frame census runs over the whole movement after it.
      const tab = el as HTMLElement;
      const index = gestures.filter((g) => g.direction !== "gallery").length + 1;
      const wasOpen = tab.getAttribute("aria-expanded") === "true";
      const row: GestureRow = {
        index,
        direction: wasOpen ? "drawer close" : "drawer open",
        flipMs: null,
        long33: 0,
        long50: 0,
        worstMs: 0,
        widths: 0,
      };
      gestures.push(row);
      const obs = new MutationObserver(() => {
        obs.disconnect();
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            row.flipMs = round1(now() - at);
            render();
          }),
        );
      });
      obs.observe(tab, { attributes: true, attributeFilter: ["aria-expanded"] });
      window.setTimeout(() => {
        obs.disconnect();
        const c = rafCensus(gaps, at, now());
        row.long33 = c.long33;
        row.long50 = c.long50;
        row.worstMs = c.worstMs;
        render();
      }, FOLD_WINDOW_MS);
    },
    true,
  );

  // THE GALLERY FOLD. `.board-group.is-gallery` is the view's own tell (App.vue:832): it is
  // added on the way OUT to the gallery and removed on the way back IN to the board. The
  // board's rendered width is sampled every frame across the movement, because a count of
  // distinct widths is the difference between a glide and an instant swap (G3: the exit
  // travels 0 px on every engine).
  const boardWidth = (): number | null => {
    for (const cells of Array.from(document.querySelectorAll(".board-cells"))) {
      const r = cells.getBoundingClientRect();
      if (r.width > 0) return r.width;
    }
    return null;
  };
  const boardGroupObserver = new MutationObserver((recs) => {
    for (const rec of recs) {
      const el = rec.target as Element;
      if (!el.classList?.contains("board-group")) continue;
      const nowGallery = el.classList.contains("is-gallery");
      const wasGallery = (rec.oldValue ?? "").includes("is-gallery");
      if (nowGallery === wasGallery) continue;
      folds += 1;
      const at = now();
      const widths: number[] = [];
      const row: GestureRow = {
        index: folds,
        direction: nowGallery ? "to the picker" : "to the board",
        flipMs: null,
        long33: 0,
        long50: 0,
        worstMs: 0,
        widths: 0,
      };
      gestures.push(row);
      widthSampler = () => {
        const w = boardWidth();
        if (w !== null) widths.push(w);
      };
      window.setTimeout(() => {
        widthSampler = null;
        const c = rafCensus(gaps, at, now());
        row.long33 = c.long33;
        row.long50 = c.long50;
        row.worstMs = c.worstMs;
        row.widths = distinctWidths(widths);
        render();
      }, FOLD_WINDOW_MS);
    }
  });
  for (const bg of Array.from(document.querySelectorAll(".board-group")))
    boardGroupObserver.observe(bg, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
  new MutationObserver(() => {
    for (const bg of Array.from(document.querySelectorAll(".board-group")))
      boardGroupObserver.observe(bg, {
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true,
      });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // ── the row ────────────────────────────────────────────────────────────────────────
  let cache = "undeclared";
  let lowPowerOff: boolean | null = null;
  let exports = 0;

  const fonts = () => {
    const byName = new Map<string, { count: number; bytes: number }>();
    for (const r of performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[]) {
      if (!/\.woff2($|\?)/.test(r.name)) continue;
      const key = r.name.split("/").pop() ?? r.name;
      const cur = byName.get(key) ?? { count: 0, bytes: 0 };
      cur.count += 1;
      cur.bytes += r.transferSize ?? 0;
      byName.set(key, cur);
    }
    return Array.from(byName.entries()).map(([name, v]) => ({ name, ...v }));
  };

  const median = (xs: number[]): number | null => {
    const s = xs.filter((n) => typeof n === "number").sort((a, b) => a - b);
    return s.length ? s[(s.length - 1) >> 1] : null;
  };

  const buildRow = (): Record<string, unknown> => {
    const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const nav = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    const later = taps
      .slice(1)
      .map((t) => t.settleMs)
      .filter((n): n is number => n !== null);
    const laterMedian = median(later);
    const first = taps[0];
    const drawers = gestures.filter((g) => g.direction.startsWith("drawer"));
    const toBoard = gestures.find((g) => g.direction === "to the board");
    const toPicker = gestures.find((g) => g.direction === "to the picker");
    const fontRows = fonts();

    const row: Record<string, MarkValue> = {
      cell: deviceCell(cache),
      engine: "device",
      ua: navigator.userAgent,
      dpr: window.devicePixelRatio,
      vp: `${window.innerWidth}x${window.innerHeight}`,
      cpu: "device, not throttled by any rig",
      net: "device, whatever the phone had",
      cache,
      lowPowerModeOffDeclared: lowPowerOff,
      window: exports,
      wallMs: Math.round(now()),
      bootWindowMs: BOOT_WINDOW_MS,
      probeArmedMs: num(marks.probeArmedMs),

      firstPaintMs: num(marks.firstPaintMs),
      fcpMs: num(marks.fcpMs),
      lcpMs: num(marks.lcpMs),
      boardReadyMs: num(marks.boardReadyMs),
      cellsMs: num(marks.cellsMs),
      givensMs: num(marks.givensMs),
      givensMinusCellsMs: num(marks.givensMinusCellsMs),
      firstBakeMs: num(marks.firstBakeMs),
      bakeLayers: num(marks.bakeLayers),
      firstBoilTickMs: num(marks.firstBoilTickMs),
      boardDrawnMs: num(marks.boardDrawnMs),
      domContentLoadedMs: nav ? nav.domContentLoadedEventEnd : null,
      loadEventMs: nav ? nav.loadEventEnd : null,

      ltSupported,
      tbt3000Ms: ltSupported
        ? Math.round(
            longTasks
              .filter((t) => t.at < 3000)
              .reduce((s, t) => s + Math.max(0, t.ms - 50), 0),
          )
        : null,
      longtasks3000: ltSupported ? longTasks.filter((t) => t.at < 3000).length : null,
      longestTaskMs: ltSupported
        ? longTasks.length
          ? Math.max(...longTasks.map((t) => t.ms))
          : 0
        : null,
      busyToBoardReadyMs:
        ltSupported && typeof marks.boardReadyMs === "number"
          ? Math.round(
              longTasks
                .filter((t) => t.at < (marks.boardReadyMs as number))
                .reduce((s, t) => s + t.ms, 0),
            )
          : null,

      rafGapProxyTbtMs: gapProxyMs(gaps, 0, 3000),
      rafGapsOver33: gaps.length,
      worstRafGapMs: gaps.length ? round1(Math.max(...gaps.map((g) => g.ms))) : 0,

      transferBytes: res.reduce((s, r) => s + (r.transferSize ?? 0), 0),
      resourceCount: res.length,
      woff2Requests: fontRows.reduce((s, f) => s + f.count, 0),
      woff2: fontRows.length ? JSON.stringify(fontRows) : null,

      firstToggleSettleMs: first ? first.settleMs : null,
      firstToggleBakes: first ? first.bakes : null,
      firstToggleBlockingProxyMs: first ? first.blockingProxyMs : null,
      firstToggleWhirlLong33: first ? first.whirlLong33 : null,
      firstToggleWhirlWorstMs: first ? first.whirlWorstMs : null,
      laterToggleSettleMedianMs: laterMedian,
      firstMinusLaterToggleMs:
        first && first.settleMs !== null && laterMedian !== null
          ? round1(first.settleMs - laterMedian)
          : null,
      toggleTaps: taps.length ? JSON.stringify(taps) : null,

      controlsInteractiveMs: drawers.length ? drawers[0].flipMs : null,
      controlsHow: ".drawer-tab tap, then aria-expanded, then two frames",
      drawerFirstGestureWorstMs: drawers.length ? drawers[0].worstMs : null,
      drawerFirstGestureLong33: drawers.length ? drawers[0].long33 : null,
      drawerThirdGestureWorstMs: drawers.length > 2 ? drawers[2].worstMs : null,
      drawerThirdGestureLong33: drawers.length > 2 ? drawers[2].long33 : null,
      drawerGestures: drawers.length ? JSON.stringify(drawers) : null,

      // THE TWO DIRECTIONS, NAMED SO THEY CANNOT BE SWAPPED. A7 calls the fold into the
      // board "entry" and the fold out to the picker "exit"; "in" and "out" read either way
      // round, so the keys say where the app is going. The width census reads `.board-cells`
      // and says so: A7's entry travel is read off the projected card, which is not this
      // node, so the two width figures are NOT the same quantity.
      galleryToBoardLong33: toBoard ? toBoard.long33 : null,
      galleryToBoardWorstMs: toBoard ? toBoard.worstMs : null,
      galleryToBoardCellsWidths: toBoard ? toBoard.widths : null,
      galleryToPickerLong33: toPicker ? toPicker.long33 : null,
      galleryToPickerWorstMs: toPicker ? toPicker.worstMs : null,
      galleryToPickerCellsWidths: toPicker ? toPicker.widths : null,
      galleryWidthsNode: ".board-cells",

      taint,
      tainted: taint.length > 0,
      notes: notes.length ? notes.join(" | ") : null,
      at: new Date().toISOString(),
    };
    return toReadingRow(row);
  };

  // ── the readout ────────────────────────────────────────────────────────────────────
  // Plain English, legible at 390 wide, and no product class or token is borrowed: the card
  // is styled inline, so nothing it does can reach a golden. It is appended only after the
  // boot window closes, so the window it reports has no probe DOM in it.
  let card: HTMLElement | null = null;
  let handle: HTMLElement | null = null;
  let pre: HTMLElement | null = null;
  let status: HTMLElement | null = null;

  // COLLAPSE AND EXPAND. The readout is a panel across the bottom of a 390 wide screen, which
  // is where the drawer tongue lives, so it hides itself the moment the owner touches the app
  // and leaves a 48 px handle in the corner to bring it back. Both are function declarations
  // because the gesture listener above is installed before the card exists.
  function collapse() {
    if (!card || !handle) return;
    card.style.display = "none";
    handle.style.display = "block";
  }
  function expand() {
    if (!card || !handle) return;
    card.style.display = "block";
    handle.style.display = "none";
    render();
  }

  const button = (label: string): HTMLButtonElement => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute(
      "style",
      "min-height:44px;padding:10px 14px;margin:4px 6px 4px 0;font:600 15px/1.2 " +
        "system-ui,sans-serif;background:#f4f4f4;color:#111;border:0;border-radius:8px",
    );
    return b;
  };

  const statusText = (): string => {
    const lines = [
      `Load: ${cache}.`,
      `Dark toggle taps: ${taps.length} of 4.`,
      `Drawer taps: ${gestures.filter((g) => g.direction.startsWith("drawer")).length} of 3.`,
      `Picker moves: ${gestures.filter((g) => g.direction.startsWith("to the")).length} of 2.`,
    ];
    if (taint.length) lines.push(`This reading is spoiled: ${taint.join(", ")}.`);
    return lines.join(" ");
  };

  function render() {
    if (!card) return;
    if (status) status.textContent = statusText();
    // The box under the buttons always holds the CURRENT row, so a reader who cannot use the
    // clipboard is never handed a stale one.
    if (pre) pre.textContent = JSON.stringify(buildRow());
    if (card)
      card.style.borderTop = taint.length ? "4px solid #e5484d" : "4px solid #444";
  }

  const mountCard = () => {
    card = document.createElement("div");
    card.setAttribute("data-device-probe", "1");
    card.setAttribute(
      "style",
      "position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));" +
        "z-index:2147483647;max-height:44vh;overflow:auto;background:#111;color:#f4f4f4;" +
        "padding:12px;border-radius:12px;border-top:4px solid #444;" +
        "font:15px/1.4 system-ui,-apple-system,sans-serif",
    );

    const head = document.createElement("div");
    head.setAttribute(
      "style",
      "display:flex;align-items:center;justify-content:space-between;font-weight:700;" +
        "margin-bottom:6px",
    );
    const title = document.createElement("span");
    title.textContent = "Speed check";
    head.appendChild(title);
    const hide = button("Hide");
    hide.addEventListener("click", collapse);
    head.appendChild(hide);
    card.appendChild(head);

    const ask = document.createElement("div");
    ask.textContent = "Is this the first load on this phone today, or a reload?";
    card.appendChild(ask);

    const row1 = document.createElement("div");
    const cold = button("First load");
    const warm = button("Reload");
    // Declaring the load is the last thing the big panel is needed for, so it steps aside
    // straight afterwards and the owner's hands are free for the app's own controls.
    cold.addEventListener("click", () => {
      cache = "cold";
      render();
      collapse();
    });
    warm.addEventListener("click", () => {
      cache = "warm";
      render();
      collapse();
    });
    row1.appendChild(cold);
    row1.appendChild(warm);
    card.appendChild(row1);

    const lowPower = document.createElement("label");
    lowPower.setAttribute("style", "display:block;margin:6px 0");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.setAttribute(
      "style",
      "width:20px;height:20px;vertical-align:middle;margin-right:8px",
    );
    box.addEventListener("change", () => {
      lowPowerOff = box.checked;
      render();
    });
    lowPower.appendChild(box);
    lowPower.appendChild(
      document.createTextNode(
        "Low Power Mode is off (you have to tell us, we cannot see it)",
      ),
    );
    card.appendChild(lowPower);

    const steps = document.createElement("div");
    steps.setAttribute("style", "margin:6px 0");
    steps.textContent =
      "Then this box gets out of the way. Tap the sun and moon button four times, waiting " +
      "about three seconds between taps. Then open and close the controls drawer three " +
      "times. Then go to the game picker and come back. Then tap the round button in the " +
      "bottom left corner and tap Copy.";
    card.appendChild(steps);

    status = document.createElement("div");
    status.setAttribute("style", "margin:6px 0;font-weight:600");
    card.appendChild(status);

    const copy = button("Copy");
    const FALLBACK = "Copy did not work, select the text below";
    copy.addEventListener("click", () => {
      exports += 1;
      const json = JSON.stringify(buildRow());
      if (pre) pre.textContent = json;
      // The write has to happen IN the tap. An await before it loses the gesture and the
      // call fails silently, which is why the same text sits in the box below as well.
      try {
        void navigator.clipboard.writeText(json).then(
          () => {
            copy.textContent = "Copied";
          },
          () => {
            copy.textContent = FALLBACK;
          },
        );
      } catch {
        copy.textContent = FALLBACK;
      }
    });
    card.appendChild(copy);

    pre = document.createElement("pre");
    pre.setAttribute(
      "style",
      "user-select:text;-webkit-user-select:text;white-space:pre-wrap;word-break:break-all;" +
        "margin:6px 0 0;font:12px/1.35 ui-monospace,monospace;background:#000;padding:8px;" +
        "border-radius:8px",
    );
    pre.textContent = JSON.stringify(buildRow());
    card.appendChild(pre);

    // THE HANDLE. 48 px tall, bottom LEFT, clear of the drawer tongue's centred path, and the only
    // thing on screen while the owner is tapping the app.
    handle = document.createElement("button");
    handle.setAttribute("data-device-probe-handle", "1");
    handle.setAttribute(
      "style",
      "position:fixed;left:8px;bottom:calc(8px + env(safe-area-inset-bottom));display:none;" +
        "z-index:2147483647;min-width:72px;height:48px;border:0;border-radius:24px;" +
        "background:#111;color:#f4f4f4;font:700 15px/1 system-ui,sans-serif",
    );
    handle.textContent = "Show";
    handle.addEventListener("click", expand);

    document.body.appendChild(card);
    document.body.appendChild(handle);
    render();
  };

  const untilWindowCloses = Math.max(0, BOOT_WINDOW_MS - now());
  window.setTimeout(mountCard, untilWindowCloses);
}

function num(v: MarkValue): number | null {
  return typeof v === "number" ? v : null;
}
