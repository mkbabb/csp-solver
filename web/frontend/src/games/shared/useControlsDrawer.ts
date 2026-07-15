import { computed, ref, type Ref } from "vue";

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
 * Regime rule (crit-design hazard 1): the drawer exists at ≥1024 ONLY. Below 1024 the
 * layout stacks and the mobile panel card stays in flow exactly as today — a defined
 * no-op (`toggleDrawer` early-returns; the tab is display:none there), never a silent
 * break. A touch bottom-sheet is an explicit non-goal this wave.
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
const HINT_KEY = "csp-drawer-hint-spoken";
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

// Module-level MediaQueryList refs — the useCoarsePointer pattern (one shared listener).
function mediaRef(query: string, initial: boolean): Ref<boolean> {
  const r = ref(initial);
  if (hasDom && typeof window.matchMedia === "function") {
    const mq = window.matchMedia(query);
    r.value = mq.matches;
    mq.addEventListener?.("change", (e) => {
      r.value = e.matches;
    });
  }
  return r;
}
const rowRegime = mediaRef("(min-width: 1024px)", false);
const wideMargin = mediaRef("(min-width: 1360px)", true);
const reducedMotion = mediaRef("(prefers-reduced-motion: reduce)", false);

/** The ONE layout step — `html.drawer-closed` drives every closed-regime rule
 *  (scene.css rail park, App.vue masthead centering, the boards' loosened caps). */
function applyLayout(open: boolean) {
  document.documentElement.classList.toggle("drawer-closed", !open);
}

// Pre-first-paint restore: a persisted-closed drawer must never flash open.
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

/** Called by each game scene on mount; the returned disposer settles any in-flight
 *  glide instantly (the F6 page-turn unmounts scenes mid-life). */
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
  // The worksheet: board + vignette + margin + tab ride ONE translate+scale. It rasters
  // at its FINAL size from frame one (the crit kill — the filtered board's SIZE is never
  // tweened): `flipTransform` maps its old full-size pose onto the grown box via scale
  // only — byte-identical to the pre-extraction host string.
  specs.push({
    el: host,
    from: flipTransform(firstH, lastH),
    to: "translate(0px, 0px) scale(1)",
    transformOrigin: "50% 50%",
  });
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
  if (tab) {
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
  if (block && lastB && firstA && lastA) {
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
  persist(targetOpen);
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
    scene.tab?.focus({ preventScroll: true });
  }
}

function focusPanel() {
  const scene = getScene?.();
  const first = scene?.panel?.querySelector<HTMLElement>(
    'button, select, input, textarea, a[href], [tabindex]:not([tabindex="-1"])',
  );
  first?.focus({ preventScroll: true });
}

// ── Public surface (via useControlsDrawer() — the scenes' one door) ──

function toggleDrawer() {
  if (!hasDom || !rowRegime.value) return; // §6 regime rule: defined no-op <1024
  if (drawerPhase.value !== "idle") {
    retarget();
    return;
  }
  const next = !drawerOpen.value;
  drawerOpen.value = next;
  persist(next);
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

/** The margin voice hints once, ever, on the first real close ("your pencil case is
 *  under the board"). Boards call this on the open→closed edge; a false return means
 *  stay quiet (already spoken, or storage denied — never risk a repeating hint). */
export function consumeDrawerHint(): boolean {
  if (!hasDom) return false;
  try {
    if (window.localStorage.getItem(HINT_KEY)) return false;
    window.localStorage.setItem(HINT_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

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
