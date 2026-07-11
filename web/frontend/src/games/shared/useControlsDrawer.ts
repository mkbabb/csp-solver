import { computed, ref, type Ref } from "vue";

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
 * Choreography (Band D, user-triggered one-shot, ~480ms): inverted FLIP. Both layouts
 * are measured up front (two forced layouts, ZERO paints — the intermediate state is
 * reverted synchronously before any frame renders); the glide itself is transform-only
 * — board + masthead ride one `translate(…) scale(…)` on the spring curve, the case on
 * easeOutCubic — on layers promoted for the gesture's duration (`will-change` via
 * `html.drawer-gesturing`); the TRUE layout step (width-cap swap + real centering +
 * the case leaving/entering flow) lands in ONE frame at transitionend. The filtered
 * board's SIZE is never tweened (the crit kill): one re-raster at settle, zero
 * per-frame filter re-raster.
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
/** Band-D one-shot — matches the 480ms transitions in scene.css / App.vue. */
const GLIDE_MS = 480;
/** Seam-guard discipline (App.vue's F6 pattern): a glide that can't emit
 *  transitionend (display:none mid-flight, regime resize) settles late, never never. */
const SETTLE_GUARD_MS = GLIDE_MS + 220;

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

// Module-level MediaQueryList refs — the useStackedLayout/useCoarsePointer pattern.
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

// ── The glide engine (inverted FLIP) ─────────────────────────────────

interface Mover {
    el: HTMLElement;
    /** The glide target pose (transform toward the OTHER layout). */
    target: string;
    /** The resting pose in the ORIGIN layout (identity, or the rail's parked -50%Y). */
    rest: string;
    origin: string;
}

let movers: Mover[] = [];
let settleTimer: number | null = null;
let endListener: ((e: TransitionEvent) => void) | null = null;
let glideHost: HTMLElement | null = null;
let targetOpen = drawerOpen.value;
let originOpen = drawerOpen.value;

const cx = (r: DOMRect) => r.left + r.width / 2;
const cy = (r: DOMRect) => r.top + r.height / 2;

function setMover(el: HTMLElement, target: string, rest: string, transformOrigin: string) {
    if (transformOrigin) el.style.transformOrigin = transformOrigin;
    el.style.transform = target;
    movers.push({ el, target, rest, origin: transformOrigin });
}

function glide(toOpen: boolean, scene: DrawerSceneEls) {
    const host = scene.host!;
    const rail = scene.rail!;
    const mast = getMasthead?.() ?? null;
    const block = mast?.block ?? null;
    const anchor = mast?.anchor ?? null;

    targetOpen = toOpen;
    originOpen = !toOpen;
    drawerPhase.value = toOpen ? "opening" : "closing";
    glideHost = host;

    // Inverted FLIP: measure both layouts NOW (forced layout, nothing paints — the
    // class flip is reverted synchronously), glide transform-only in the ORIGIN
    // layout, land the one real layout step at settle.
    const firstH = host.getBoundingClientRect();
    const firstR = rail.getBoundingClientRect();
    const firstB = block?.getBoundingClientRect() ?? null;
    const firstA = anchor?.getBoundingClientRect() ?? null;
    applyLayout(toOpen); // target layout on…
    const lastH = host.getBoundingClientRect();
    const lastR = rail.getBoundingClientRect();
    const lastA = anchor?.getBoundingClientRect() ?? null;
    applyLayout(!toOpen); // …and off — measured, never painted

    const hostScale = lastH.width / firstH.width;
    // The tab counter-scales off this var so its 44px tongue never pops at settle.
    host.style.setProperty("--drawer-glide-scale", String(hostScale));
    document.documentElement.classList.add("drawer-gesturing");
    void host.offsetWidth; // commit start styles — arm the class's transitions

    movers = [];
    // The worksheet: board + vignette + margin + tab ride ONE translate+scale (spring).
    setMover(
        host,
        `translate(${cx(lastH) - cx(firstH)}px, ${cy(lastH) - cy(firstH)}px) scale(${hostScale})`,
        "",
        "50% 50%",
    );
    // The case: translate-only, easeOutCubic. In the closed layout its resting pose
    // carries the parked translateY(-50%) — compose it so rect math stays exact.
    const railRest = toOpen ? "translateY(-50%)" : "";
    setMover(
        rail,
        `${railRest ? railRest + " " : ""}translate(${lastR.left - firstR.left}px, ${lastR.top - firstR.top}px)`,
        railRest,
        "",
    );
    // The masthead: transform the h1, anchored on the wordmark's center-bottom so the
    // measured wordmark rect maps exactly (the h1 spans the full group width — its own
    // center is not the wordmark's).
    if (block && firstB && firstA && lastA) {
        const mastScale = lastA.width / firstA.width;
        setMover(
            block,
            `translate(${cx(lastA) - cx(firstA)}px, ${lastA.bottom - firstA.bottom}px) scale(${mastScale})`,
            "",
            `${cx(firstA) - firstB.left}px ${firstA.bottom - firstB.top}px`,
        );
    }

    endListener = (e: TransitionEvent) => {
        if (e.target === host && e.propertyName === "transform") settleNow();
    };
    host.addEventListener("transitionend", endListener);
    settleTimer = window.setTimeout(settleNow, SETTLE_GUARD_MS);
}

/** The settle — ONE frame: inline transforms cleared, the gesture layer demoted,
 *  and the true layout class landed together (a single re-layout + re-raster). */
function settleNow() {
    if (drawerPhase.value === "idle") return;
    if (settleTimer !== null) {
        clearTimeout(settleTimer);
        settleTimer = null;
    }
    if (glideHost && endListener) glideHost.removeEventListener("transitionend", endListener);
    endListener = null;
    for (const m of movers) {
        m.el.style.transform = "";
        m.el.style.transformOrigin = "";
    }
    glideHost?.style.removeProperty("--drawer-glide-scale");
    movers = [];
    glideHost = null;
    document.documentElement.classList.remove("drawer-gesturing");
    applyLayout(targetOpen);
    drawerPhase.value = "idle";
    if (targetOpen) focusPanel();
}

/** Re-click mid-glide: retarget the CSS transitions home (or back out again) — no
 *  clocks to unwind; the settle applies whichever layout the last click asked for. */
function retarget() {
    targetOpen = !targetOpen;
    drawerOpen.value = targetOpen;
    persist(targetOpen);
    drawerPhase.value = targetOpen ? "opening" : "closing";
    const home = targetOpen === originOpen;
    for (const m of movers) m.el.style.transform = home ? m.rest || "none" : m.target;
    if (!targetOpen) reclaimFocus();
    if (settleTimer !== null) clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settleNow, SETTLE_GUARD_MS);
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
const drawerInert = computed(
    () => !drawerOpen.value && drawerPhase.value === "idle",
);

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
    return { drawerOpen, drawerPhase, drawerInert, vignetteDocked, toggleDrawer, closeDrawer };
}
