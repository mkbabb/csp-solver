import { computed, nextTick, ref, watch } from "vue";

import { mediaRef, useRowRegime } from "./useCoarsePointer";
import { flipTransform, useFlipGlide, type FlipMover } from "./useFlipGlide";

/**
 * The controls drawer (T3-W12 §6) — the pencil case tucked under the worksheet.
 *
 * The page is a desk; the board is the worksheet; the controls card is the pencil
 * case at its right flank. Open (the default reading posture) is today's row layout;
 * closed, the case slides UNDER the board sheet and board + wordmark take the page's
 * true axis and grow. One module-level state (both scenes + App's masthead share it),
 * persisted in localStorage — default OPEN: primary controls are never hidden by
 * default; tucking away is the owner's gesture, remembered.
 *
 * Regime rule — THREE POSES OF ONE DRAWER (T5-W4 pass 6). T3-W12 wrote "≥1024 ONLY" and
 * named a touch bottom-sheet an explicit non-goal *that wave*; the pass-6 charter spends the
 * loop's one blocking row by moving the mobile controls out of flow into this same surface.
 * There is still exactly ONE drawer, one state, one persistence key, one glide engine:
 *   · **≥1024** — the shipped parked rail, byte-untouched (the audit-4 fiction).
 *   · **<1024, EITHER ORIENTATION** — the case is a `position: fixed` bottom sheet anchored on
 *     `top: var(--vv-height)` with its rest pose on `translate:` (`useKeyboardViewport`'s
 *     standing trigger, honoured verbatim). The tongue hangs off the board's SLACK EDGE while
 *     the sheet is shut — the bottom-right corner in portrait, the right flank in landscape,
 *     which is the desk's own tuck read on the axis the viewport gives — and rides up as the
 *     case's handle while the sheet is open, which is the pose a risen full-width sheet leaves
 *     room for.
 *
 * T9-W2 §2.2/§2.7 — WHAT CHANGED, AND IT IS TWO DECLARED DELTAS. T5-W4 pass 6 wrote a THIRD
 * pose here — "<1024 landscape keeps the shipped in-flow card, and the toggle is a defined
 * no-op" — on the lead's charter (c), which held that rung RATIFIED. T9's charter rules that
 * pose a P0: measured at HEAD, a landscape phone matches the arm that HIDES the ribbon and the
 * handle and matches no arm that turns them back on, so every game control sits below a fold
 * the first screen gives no hint of (844×390: `docScrollH` 1157, deal +192px, three openers at
 * 0×0). The third pose is therefore folded into the second. T6.2 mark A's other half goes with
 * it: the shut tongue was a PEER VERB in the fold's ribbon, and the owner's later word (M10,
 * 2026-08-25 — "a tab on the bottom of the board, like on desktop, just not on the side")
 * moves it to the board's own edge. Both deltas surface at the owner's re-look (U-10).
 *
 * G3, and it is a ruling rather than a preference: **the mobile dock always lands closed.** An
 * open sheet restored across a mobile load would resurrect the covered-board pose the covis row
 * exists to kill. The desk's persisted key is untouched and desk-scoped; opens made on the dock
 * do not write it, and a persisted-open desk choice crossing into the dock is parked
 * non-persistently, so returning restores the desk's own pose from the desk's own key.
 *
 * Choreography (Band D, user-triggered one-shot, ~520ms): classic FLIP on WAAPI
 * (T3-W13 §3). The layout class lands ONCE at gesture onset — one forced layout per
 * gesture, the board rasters at its FINAL size from frame one (≤2% soft attack on
 * open, never a soft landing). Every mover — board+tab sheet, case, masthead, tab
 * counter-scale — rides one `element.animate()` with explicit [from, to] keyframes
 * (`composite: replace`, `fill: none`): explicit keyframes have no "previous
 * committed style", so the phantom-teleport class of bug (an intermediate recalc
 * captured as a transition base) is structurally unreachable. ONE glass curve
 * (MOTION.curves.drawerGlide — §3-S3′, the audit-4 owner ruling: swift attack,
 * long fluid settle, zero overshoot), one clock, zero stagger — sheet and case
 * read as one solid. The geometry is the audit-2 fiction (§3-S5): the case rests
 * TUCKED BEHIND the board's right edge, z-under the sheet (scene.css parks it
 * `right: 3rem` of an app-layout that shrink-wraps the sheet when closed, so the
 * tuck is structural), and the glide vector is HORIZONTAL out from under the
 * board — the case emerges as the board shifts left, reciprocal motions on the
 * one clock; relative to the sheet the case's travel carries no vertical
 * component (its ~3px absolute drift IS the sheet's own center drift). Mid-glide
 * re-clicks retarget by reversal (`anim.reverse()` — velocity-plausible, same
 * curve). The settle frame clears finished animations ONLY: no layout, no
 * re-raster, no snap. The filtered board's SIZE is never tweened (the W12 crit
 * kill, kept): exactly one layout + one re-raster per gesture, now at onset.
 * Layers stay promoted for the gesture's duration (`will-change` via
 * `html.drawer-gesturing`, which arms NO transitions — scene.css keeps only
 * promotion + the case's visibility).
 *
 * PRM: no slide, no scale — a same-frame swap of the two layout states.
 *
 * A11y contract: aria-expanded rides `drawerOpen` (truthful at click); on open, focus
 * moves to the drawer's first control at settle; on close, focus returns to the tab
 * the moment the case starts hiding; closed-idle the rail is `inert` (drawerInert) +
 * `visibility: hidden` (scene.css) — no invisible tab stops (W11 UI-6, applied at
 * birth). Esc closes from within (scenes wire `closeDrawer` on the rail's keydown).
 */

type DrawerPhase = "idle" | "closing" | "opening";

const STORAGE_KEY = "csp-drawer-open";
/** Band-D one-shot — the movers' shared WAAPI clock (scene.css arms no transitions).
 *  520ms: the glass settle wants a touch more breath than the dead spring's 480
 *  (auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D). */
const GLIDE_MS = 520;

const hasDom = typeof window !== "undefined" && typeof document !== "undefined";

function readStored(): boolean {
  if (!hasDom) return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true; // storage denied → default open, unpersisted
  }
}

function persist(open: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  } catch {
    /* storage denied — state lives for the session */
  }
}

/** Intent — flips at click (aria/persistence truthful immediately). */
const drawerOpen = ref(readStored());
const drawerPhase = ref<DrawerPhase>("idle");

// Module-level MediaQueryList refs — one shared listener per query. `mediaRef` and the
// row-regime ref itself live in useCoarsePointer.ts: GameScene mounts ONE control-panel twin
// off that same ref (P1-W4), so the regime this file's §6 rule gates on and the regime the
// DOM carries are the one ref, not two readings of the same width.
const rowRegime = useRowRegime();
/** Orientation no longer decides WHETHER the drawer exists (T9-W2 §2.2, above) — it decides
 *  the shut tongue's edge and whether the fold's ribbon is under the board. */
const portrait = mediaRef("(orientation: portrait)", true);
const wideMargin = mediaRef("(min-width: 1360px)", true);
const marginVignette = mediaRef("(min-width: 1280px)", true);
const reducedMotion = mediaRef("(prefers-reduced-motion: reduce)", false);

/** THE DOCK IS EVERY MOBILE POSE NOW (T9-W2 §2.2 + §2.7 — a DECLARED DELTA on the owner's
 *  M10, "a tab on the bottom of the board … in every mobile pose", and on §2.2's P0).
 *  Measured at HEAD, both engines: at 844×390 and 812×375 the tab, the ribbon and the handle
 *  are all `display: none` boxes of 0×0, the deal verb sits 192px below a fold the first
 *  screen gives no hint of, and the document is 1157px of a 390px viewport. The landscape
 *  card was RATIFIED in flow (T5-W4 charter (c), `pageVh 2.882`) and this wave supersedes
 *  that rung deliberately — not by taste, but because the charter rules the pose a P0: every
 *  game control unreachable, with no cue that anything is below.
 *  So the drawer is live wherever the RAIL is not, and orientation stops deciding whether the
 *  controls have a door. It still decides the DOOR'S POSE: `portraitDock` survives beside
 *  this ref because the fold's ribbon and its play verbs stay portrait-only — a 390-tall
 *  landscape has no band under the board to put them in. */
export const mobileDock = computed(() => !rowRegime.value);

/** The portrait dock — the sheet pose with a ribbon under the board. Exported because the
 *  panel teleports its play verbs on exactly this ref (never a second reading of it). */
export const portraitDock = computed(() => mobileDock.value && portrait.value);

/** The ONE layout step — `html.drawer-closed` drives every closed-regime rule
 *  (scene.css rail park + the portrait sheet's rest pose, App.vue masthead centering, the
 *  boards' loosened caps). */
function applyLayout(open: boolean) {
  document.documentElement.classList.toggle("drawer-closed", !open);
}

/** G3 — opens made on MOBILE are transient. The desk's key is the DESK's, and a sheet that
 *  remembered itself open would land a covered board on the next mobile visit.
 *  T9-W2 §2.2 — the clause widens from `portraitDock` to `mobileDock` with the pose it guards:
 *  an open sheet on a 390-tall landscape is exactly the covered board the covis row exists to
 *  kill, and it was only ever out of scope because landscape had no sheet. */
function persistIfDesk(open: boolean) {
  if (mobileDock.value) return;
  persist(open);
}

// Pre-first-paint restore: a persisted-closed drawer must never flash open — and a mobile
// mount lands closed whatever the desk remembered (G3), before the first paint, not after it.
if (hasDom && mobileDock.value) drawerOpen.value = false;
if (hasDom && !drawerOpen.value) applyLayout(false);

// ── Registration — the scene owns the board/rail/tab, App owns the masthead ──

interface DrawerSceneEls {
  /** `.board-peek-host` — the transformed worksheet (board + vignette + margin + tab). */
  host: HTMLElement | null;
  /** `.scene-controls` — the case that slides. */
  rail: HTMLElement | null;
  /** `.controls-card` — focus lands on its first control at open-settle. */
  panel: HTMLElement | null;
  /** The pull-tab button — focus home on close. */
  tab: HTMLElement | null;
}

interface DrawerMastheadEls {
  /** The `.masthead` h1 — the element the glide transform rides. */
  block: HTMLElement | null;
  /** The wordmark (`.logo-menu`) — the rect the glide maps first→last. */
  anchor: HTMLElement | null;
}

let getScene: (() => DrawerSceneEls) | null = null;
let getMasthead: (() => DrawerMastheadEls) | null = null;

/**
 * Called by each game scene on mount; the returned disposer settles any in-flight glide
 * instantly (the F6 page-turn unmounts scenes mid-life).
 *
 * T6.2 mark A — `--fold-bottom` AND ITS OBSERVER ARE GONE. Mark 9 published `.app-layout`'s
 * padded bottom so the closed sheet could lift its tongue flush under the verbs; the tongue is
 * a verb in the ribbon now, so the closed sheet has nothing left to align to and simply rests
 * below the visual viewport's edge (scene.css). The publisher's own measurement was also blind
 * in the one direction that mattered: a ResizeObserver watches the CONTENT box, so the
 * keyboard-inset reflow it was installed to catch — `padding-bottom` on `.board-group` — never
 * fired it, and the var went stale by the full excursion (`attach` 0 → 30 through a 60px band
 * ramp, measured at 390×844). Nothing reads it; nothing publishes it.
 */
export function registerDrawerScene(get: () => DrawerSceneEls): () => void {
  getScene = get;
  return () => {
    if (getScene === get) {
      settleNow();
      getScene = null;
    }
  };
}

export function registerDrawerMasthead(get: () => DrawerMastheadEls) {
  getMasthead = get;
}

// ── The glide engine (classic FLIP on WAAPI, T3-W13 §3 S1–S4) ────────
//
// The mover MECHANICS — the WAAPI [from,to] movers, the one clock, `composite:replace`/
// `fill:none`, the generation token, the settle guard, `reverse()` — now live in the
// EXTRACTED `useFlipGlide` primitive (T4-W12 §8, the M10 distillation: the drawer AND the
// gallery's board⇄card fold ride ONE proven engine). This file keeps the drawer's DOMAIN:
// WHICH elements move, their FLIP deltas, and the settle side-effects (`onSettle`). The
// crit kill (the filtered board's SIZE is never tweened) rides `flipTransform` in there.

let targetOpen = drawerOpen.value;

// Only the masthead mover still builds a bespoke string by hand (its wordmark-anchored
// origin) — the host rides `flipTransform`, so `cx` is all that survives here.
const cx = (r: DOMRect) => r.left + r.width / 2;

/** The drawer's glide controller — 520ms on the ONE glass curve (the primitive's default
 *  easing = `MOTION.curves.drawerGlide`), one clock, the never-never guard at 520+220.
 *  `onSettle` is the drawer's own settle: demote the gesture layers, re-flip the layout to
 *  the (possibly reversal-flipped) target, land idle, and focus the panel on open. */
const glideCtl = useFlipGlide({
  durationMs: GLIDE_MS,
  onSettle: () => {
    document.documentElement.classList.remove("drawer-gesturing");
    applyLayout(targetOpen);
    drawerPhase.value = "idle";
    if (targetOpen) focusPanel();
  },
});

function glide(toOpen: boolean, scene: DrawerSceneEls) {
  const host = scene.host!;
  const rail = scene.rail!;
  const tab = scene.tab;
  const mast = getMasthead?.() ?? null;
  const block = mast?.block ?? null;
  const anchor = mast?.anchor ?? null;

  targetOpen = toOpen;
  drawerPhase.value = toOpen ? "opening" : "closing";

  // Classic FLIP: FIRST rects read pre-flip (clean tree — no forced layout), the
  // layout class lands ONCE at onset, LAST rects take the gesture's single forced
  // layout, and every mover animates FROM the inverted old-pose delta TO identity.
  // The settle then has nothing left to do but clear finished animations.
  const firstH = host.getBoundingClientRect();
  const firstR = rail.getBoundingClientRect();
  const firstA = anchor?.getBoundingClientRect() ?? null;
  // Gesture class BEFORE the flip: the parked case's visibility override and the
  // gesture-scoped promotions arm in the same recalc the layout lands in.
  document.documentElement.classList.add("drawer-gesturing");
  applyLayout(toOpen); // the ONE layout step — at onset, not settle
  const lastH = host.getBoundingClientRect();
  const lastR = rail.getBoundingClientRect();
  const lastB = block?.getBoundingClientRect() ?? null;
  const lastA = anchor?.getBoundingClientRect() ?? null;

  const specs: FlipMover[] = [];
  // DOES THE WORKSHEET ACTUALLY MOVE? On the desk it does — that reciprocity IS the fiction.
  // On the portrait dock it does NOT: the sheet is `position: fixed`, so the board's rect is
  // identical before and after (the no-relayout claim, written as a rect identity and gated
  // as one). Pushing a mover whose `from` equals its `to` promotes a filtered layer, animates
  // it to itself and demotes it — a per-gesture raster this estate pays for nothing. Every
  // host-derived mover below rides this same read, tongue counter-scale included: the tongue
  // has nothing to counter when the host holds still.
  const hostMoved =
    Math.abs(firstH.width - lastH.width) > 0.5 ||
    Math.abs(firstH.left - lastH.left) > 0.5 ||
    Math.abs(firstH.top - lastH.top) > 0.5;
  // The worksheet: board + vignette + margin + tab ride ONE translate+scale. It rasters
  // at its FINAL size from frame one (the crit kill — the filtered board's SIZE is never
  // tweened): `flipTransform` maps its old full-size pose onto the grown box via scale
  // only — byte-identical to the pre-extraction host string.
  if (hostMoved) {
    specs.push({
      el: host,
      from: flipTransform(firstH, lastH),
      to: "translate(0px, 0px) scale(1)",
      transformOrigin: "50% 50%",
    });
  }
  // The case: translate-only, same curve, same clock — sheet and case one solid; it
  // pulls out from under the sheet HORIZONTALLY (§3-S5 — the rect deltas are the tuck's
  // own geometry, and the glass curve is monotone, so no frame carries the case above
  // the board's top or past the tuck). Its parked rest pose rides the `translate:`
  // CHANNEL (scene.css), which no mover animates; the rect deltas already include it.
  specs.push({
    el: rail,
    from: `translate(${firstR.left - lastR.left}px, ${firstR.top - lastR.top}px)`,
    to: "translate(0px, 0px)",
  });
  // The tab: counter-scales the host's ride so its 48px tongue reads constant
  // (host × tab ≈ 1 across the curve — F5's kept behavior, a WAAPI mover).
  if (tab && hostMoved) {
    const hostScale = firstH.width / lastH.width;
    specs.push({
      el: tab,
      from: `translateY(-50%) scale(${1 / hostScale})`,
      to: "translateY(-50%) scale(1)",
    });
  }
  // The masthead: the h1 glides anchored on the wordmark's center-bottom in the TARGET
  // layout's box (the h1 spans the full group width — its own center is not the
  // wordmark's), so the measured wordmark rect maps first → last exactly.
  if (block && lastB && firstA && lastA && hostMoved) {
    specs.push({
      el: block,
      from: `translate(${cx(firstA) - cx(lastA)}px, ${firstA.bottom - lastA.bottom}px) scale(${firstA.width / lastA.width})`,
      to: "translate(0px, 0px) scale(1)",
      transformOrigin: `${cx(lastA) - lastB.left}px ${lastA.bottom - lastB.top}px`,
    });
  }

  // The primitive pins one clock, wires `finished → settle`, and arms the guard.
  glideCtl.run(specs);
}

/** Force an in-flight glide to settle instantly — a thin, hoisted delegator so the
 *  disposer (`registerDrawerScene`, an earlier closure) and the PRM paths keep their
 *  call site. The primitive's `onSettle` (above) runs the drawer's real settle: the
 *  layout re-flip to `targetOpen` (reversal-flipped or not) stays the one truth. */
function settleNow() {
  glideCtl.settle();
}

/** Re-click mid-glide (§3-S4): retarget by REVERSAL via the primitive — velocity-
 *  plausible, zero new keyframes. The primitive resets the guard; the reversed settle
 *  re-flips `applyLayout(targetOpen)` through `onSettle`. */
function retarget() {
  targetOpen = !targetOpen;
  drawerOpen.value = targetOpen;
  persistIfDesk(targetOpen);
  drawerPhase.value = targetOpen ? "opening" : "closing";
  glideCtl.reverse();
  if (!targetOpen) reclaimFocus();
}

// ── Focus management ─────────────────────────────────────────────────

function reclaimFocus() {
  const scene = getScene?.();
  if (!scene?.rail) return;
  const active = document.activeElement;
  if (active instanceof HTMLElement && scene.rail.contains(active)) {
    const home = () => getScene?.()?.tab?.focus({ preventScroll: true });
    home();
    // T6.2 mark A — RE-ASSERTED AFTER THE RE-BERTH, and it was found by a read rather than by
    // reasoning: the dock moves the tongue out of the case and into the ribbon on this same
    // state flip, and re-inserting a focused node drops focus to `<body>` (measured, both
    // engines). One extra call on the tick the move lands; on the desk nothing moves and
    // re-focusing the already-focused tab is a no-op.
    void nextTick(home);
  }
}

function focusPanel() {
  const scene = getScene?.();
  // T9-W2 §2.3 — THE SHEET RISES SHOWING ITS OWN TOP EDGE WHOLE. The card is a scrollport that
  // KEEPS its offset between opens, so a reader who scrolled to the checking chips and shut the
  // sheet met it again mid-card: the deal tab sheared at the case edge, and the card's first
  // question was off screen at the one moment the drawer exists to ask it. Both calls to this
  // function are open-settle (the glide's `onSettle` and the no-scene shortcut), so the reset
  // lands exactly where the pose is taken. `scroll-padding-top` (scene.css) guards the rest:
  // the focus below can no longer bury the top edge either.
  // It is a deliberate behaviour change — the offset is not restored — and the sheet's whole
  // top edge is what it buys.
  if (scene?.panel) scene.panel.scrollTop = 0;
  const first = scene?.panel?.querySelector<HTMLElement>(
    'button, select, input, textarea, a[href], [tabindex]:not([tabindex="-1"])',
  );
  first?.focus({ preventScroll: true });
}

// ── Public surface (via useControlsDrawer() — the scenes' one door) ──

// Crossing the regime LIVE (a rotation, a resize across 1024). Into the dock: park an open
// desk choice WITHOUT writing it away, so rotating back restores the desk's own pose from the
// desk's own key. Out of it: that key is still intact, so read it. Declared here, below the
// glide engine, because it settles an in-flight gesture before it re-poses the layout.
//
// T9-W2 §2.2 — ORIENTATION IS STILL WATCHED, and it has to be even though `mobileDock` no
// longer reads it: the sheet is live in both orientations now, so a phone rotated with the
// sheet UP would carry a covered board across the turn. Rotating on the DESK fires this too
// and settles to `readStored()`, which is the value already live — the early return below.
if (hasDom) {
  watch([mobileDock, portrait], () => {
    settleNow();
    const next = mobileDock.value ? false : readStored();
    if (next === drawerOpen.value && targetOpen === next) return;
    drawerOpen.value = next;
    targetOpen = next;
    drawerPhase.value = "idle";
    applyLayout(next);
  });
}

function toggleDrawer() {
  // T9-W2 §2.2 — THE REGIME GATE IS GONE, because there is no longer a regime without a
  // drawer: the desk rail, the portrait dock and the landscape dock are all live surfaces, so
  // `drawerLive` had collapsed to `true` and a constant guard is a guard that lies about what
  // it guards. The one condition left is the only one that was ever real — a DOM to pose.
  if (!hasDom) return;
  if (drawerPhase.value !== "idle") {
    retarget();
    return;
  }
  const next = !drawerOpen.value;
  drawerOpen.value = next;
  persistIfDesk(next);
  const scene = getScene?.();
  if (!next) reclaimFocus();
  if (reducedMotion.value || !scene?.host || !scene.rail) {
    applyLayout(next); // PRM: same-frame swap of the two layout states
    if (next) focusPanel();
    return;
  }
  glide(next, scene);
}

/** Esc from within the drawer (scenes wire this on the rail's keydown). */
function closeDrawer() {
  if (drawerPhase.value === "opening") {
    retarget();
    return;
  }
  if (drawerPhase.value === "idle" && drawerOpen.value) toggleDrawer();
}

/** Closed-idle the rail is inert — no invisible tab stops (W11 UI-6). During either
 *  glide it stays interactive (focus was already reclaimed on close-start). */
const drawerInert = computed(() => !drawerOpen.value && drawerPhase.value === "idle");

/** §1/§6 interplay: where drawer-open compresses the left margin below the full
 *  vignette's width (<1360), the completion vignette takes the corner-press rung. */
export const vignetteDocked = computed(() => drawerOpen.value && !wideMargin.value);

/** WHERE THE SOLVE TALLY PAINTS — one ref, so it can only paint once (T4-P1 pass 4).
 *  The teacher's-margin vignette (≥1280, undocked) has room for star + verdict + tally and
 *  takes all three. Every other rung is the 7–8rem corner sticker, which is star + verdict
 *  only — a tally there would lie across live digits — so the tally stays on the strip's
 *  reserved line below the board, which is its home on every board that has not been solved.
 *  Mark 6 emptied that strip of its PERMANENT tenant (the difficulty glyph, now the deal's
 *  receipt); it did not delete the line, and this ref is what stops the vignette's CSS and
 *  the strip's `quiet` from both standing down at the same widths. */
export const vignetteHasTally = computed(
  () => marginVignette.value && !vignetteDocked.value,
);

export function useControlsDrawer() {
  return {
    drawerOpen,
    drawerPhase,
    drawerInert,
    vignetteDocked,
    toggleDrawer,
    closeDrawer,
  };
}
