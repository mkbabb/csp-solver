<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  defineAsyncComponent,
  h,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type Component,
  type FunctionalComponent,
} from "vue";
import { usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { MOTION } from "@pencil/config/pencilConfig";
import {
  flipTransform,
  useFlipGlide,
  type FlipMover,
} from "@games/shared/useFlipGlide";
import GameShell from "@games/shared/GameShell.vue";
// The eager default game rides the MAIN CHUNK — a static spec import, the byte-for-byte twin
// of the static `SudokuGame` import this replaces (ratified asymmetry, P4 #4). It is a spec
// now, not a scene: there is one scene, and it is `GameShell`.
import { sudokuSpec } from "@games/sudoku/spec";
import DarkModeToggle from "@pencil/celestial/DarkModeToggle.vue";
import SvgFilters from "@pencil/chrome/SvgFilters.vue";
import ScribbleLoader from "@pencil/chrome/ScribbleLoader.vue";
import HandwrittenLogo from "@pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue";
import AttributionCard from "@pencil/chrome/AttributionCard/AttributionCard.vue";
import GameGallery from "@pencil/chrome/GameGallery/GameGallery.vue";
import { registerDrawerMasthead } from "@games/shared/useControlsDrawer";
import { useKeyboardViewport } from "@games/shared/useKeyboardViewport";
import { useGameGallery } from "@games/shared/useGameGallery";
import { useBoardDirty } from "@games/shared/useDirtyBoard";
import { setLiveFaceTarget } from "@games/shared/useLiveFace";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import {
  backfillLedger,
  dealStaged,
  publishMountedGame,
  stageHandoff,
  useStagedLedger,
} from "@games/shared/useStagingBridge";
import { GAMES } from "@games/cards";
import type { AnyGameSpec } from "@games/shared/defineGame";
import { useShortcutPolicy } from "@/composables/useShortcutPolicy";

// T4-WM §1 keyboard-avoidance (lane C): one document-scoped install covers both games — it
// keys on the shared `.board-cells` contract and no-ops for every other focus target. The OS
// software keyboard (back with the pad abrogation) shrinks the visual viewport on iOS without
// resizing the layout viewport, so this scrolls a focused board cell clear of the keyboard via
// `visualViewport` (the one cross-engine path — WebKit ships no VirtualKeyboard/interactive-widget).
useKeyboardViewport();

// T5-W3 §3.4 — THE SINGLE-KEY SHORTCUT POLICY, installed once for the page. The five character
// shortcuts (k/g/h/p/d) are bound in four different files and only two of them guarded the
// modifiers; the peek's window handler guarded nothing, so Ctrl+K / Cmd+K flashed the answer
// key instead of reaching the browser (a11y r1 M4, WCAG 2.1.4). The policy runs in the CAPTURE
// phase, ahead of every one of those handlers, and hands a modified or typed-into chord back
// with `stopPropagation` — the per-feature guards below and elsewhere stay exactly as they are.
useShortcutPolicy();

// OD-8 / T4-W13 — THE MOUNT FOLD: the table-driven scene mount. A gallery select / `?game=`
// deep-link sets `scene` to a game id; `sceneFor` resolves it to the mountable component. The
// eager default (Sudoku) rides the main chunk (its static import above) — a byte-unchanged load
// (ratified asymmetry, P4 #4); every other game is a LAZY `defineAsyncComponent` over its row's
// `card.load()` spec loader — the SAME dynamic-import chunk today's Futoshiki cut, now
// generalized to all five so each game's composable starts only when it's selected.
// Memoized so each id keeps a STABLE component identity across re-renders/switches.
// F6-D3 cold fallback: the lazy chunks preload on gallery OPEN (preloadScenes), so a select is
// normally cached. A genuinely cold select (throttled — G10's `first-select-void-400ms.png`)
// shows blank paper ≤300ms then the thinking-scribble (delay:300 + loadingComponent) — never a
// spinner (design §5.1).
const sceneCache = new Map<string, Component>();
/** A migrated row's mount: `GameShell` bound to that game's spec, wearing the scene's
 *  `leaving`/`erased` seam so the page-turn orchestrator below is untouched. */
function shellFor(spec: AnyGameSpec): Component {
  const Scene: FunctionalComponent<{ leaving?: boolean }, { erased: () => void }> = (
    p,
    { emit },
  ) => h(GameShell, { spec, leaving: p.leaving, onErased: () => emit("erased") });
  Scene.props = { leaving: { type: Boolean, default: false } };
  Scene.emits = ["erased"];
  Scene.displayName = `${spec.id}-scene`;
  return Scene;
}
function sceneFor(id: string): Component {
  const cached = sceneCache.get(id);
  if (cached) return cached;
  const card = GAMES.find((c) => c.id === id) ?? GAMES[0];
  const comp: Component = card.eager
    ? shellFor(sudokuSpec)
    : defineAsyncComponent({
        // One arm, five games: a row hands the shell its spec and `GameShell` does the rest.
        loader: async () => shellFor(await card.load()),
        loadingComponent: {
          render: () =>
            h("div", { class: "scene-loading" }, [h(ScribbleLoader, { size: 56 })]),
        },
        delay: 300,
      });
  sceneCache.set(id, comp);
  return comp;
}

// Dev-only tuning tool — explicit env gate, not a commented-out import. import.meta.env.DEV
// is statically inlined at build time, so the dynamic import()'s chunk is dead-code-eliminated
// from production builds rather than merely being unreferenced source.
const FilterTuner = import.meta.env.DEV
  ? defineAsyncComponent(() => import("@pencil/dev/FilterTuner.vue"))
  : null;

// T4-W13 — the id union WIDENS to `string` keyed on the table (the W11 KEY precedent:
// tiers erased at the boundary). `?game=` is validated against GAMES; an unknown id (or none)
// lands on sudoku, the default.
type GameId = string;
function parseGame(): GameId {
  const id = new URLSearchParams(window.location.search).get("game") ?? "";
  return GAMES.some((c) => c.id === id) ? id : "sudoku";
}
// UI-8: the tab title names the CURRENT game — the static "sudoku — CSP Solver" in
// index.html lies on Futoshiki after both a deep-link (`?game=futoshiki`) and an in-app
// switch. Set from the selected id at parse time and on every switch, so the title tracks
// the wordmark/URL truthfully. Lowercase to match the wordmark; em dash, no spaces stripped.
function applyTitle(g: GameId) {
  document.title = `${g} — CSP Solver`;
}
// ── F6 page-turn orchestrator (T3-W10) ───────────────────────────────────
// The two games are exercises in the same graded workbook: a switch is the pencil erasing
// this exercise, then drawing the next — erase (beat 1, the existing animateErase routed at
// last) → seam (beat 2, the v-if flip on the erase's completion) → draw-in (beat 3, the mount
// behavior as shipped). Two refs split state from paint: `game` is the SELECTED game and
// updates at CLICK (ARIA/label/URL truthful immediately); `scene` is the MOUNTED scene and
// flips at the seam. Under prefers-reduced-motion the beat-1 hold is SKIPPED — the swap stays
// a same-frame cut (a PRM user waiting 250ms for an invisible animation is a regression).
//
// keyframes.js CLOSED-REJECT covenant (F6 §3, G3 source-verified): both animated halves of
// this transition — the erase and the draw-in — are one-shot `sequence` subscribers on the ONE
// pencil-boil rAF chain (usePathAnimation.ts); the fades are compositor-only CSS. Re-adopting
// @mkbabb/keyframes.js (standalone at 5.2.0 though it now is) would add a second animation
// brain + a runtime CSS parser to run 2 fades + 2 existing sequences, re-splitting the clock
// W8/W12 unified. Re-entry is a CAPABILITY GAP — numeric path morphing / spring physics
// (glyphPaths.ts's dormant affordance) — never a version number.
const game = ref<GameId>(parseGame()); // selected — truthful at click
applyTitle(game.value); // deep-link / reload lands on the right title before first paint
const scene = ref<GameId>(game.value); // mounted — flips at the seam
const leaving = ref(false); // beat 1 in flight: outgoing grid erases, chrome fades
let seamGuard: number | null = null;
const reducedMotion = usePrefersReducedMotion();

// `cut` (T4-W12 Wave B): a gallery select is a same-frame cut for EVERYONE (the board⇄card
// FLIP unfold + the hidden seam are Wave C); the wordmark dropdown keeps the animated
// page-turn. One `setGame`, two callers — the flag routes the cut, no logic fork.
function setGame(val: string | number, opts?: { cut?: boolean }) {
  const raw = String(val);
  const next: GameId = GAMES.some((c) => c.id === raw) ? raw : "sudoku";
  // THE SAME-ID NO-OP, ADJUDICATED AND KEPT (T4-P1 F4 pass 4). The pass-2 order asked for this
  // early return to be re-cut so a same-game pick could force a fresh mount. It is not re-cut,
  // and the reason is that a remount is the wrong instrument for both callers: the gallery's
  // same-game DEAL rides the staging bridge into the live board (`dealStaged` — no remount, no
  // second solver dispatch, marks and undo spine intact), and the gallery's same-game SELECT is
  // a visit to the board you are already on, which must preserve exactly that state. A forced
  // remount would throw away the board on the one path whose whole promise is keeping it.
  // What the `cut` line IS for: `scene` can lag `game` mid page-turn (`leaving` is in flight and
  // the seam has not fired), so a re-select of the OUTGOING game re-asserts the mounted scene
  // rather than deadlocking behind an `erased` that will never come for it.
  if (next === game.value) {
    if (opts?.cut) scene.value = next;
    return;
  }
  game.value = next;
  applyTitle(next); // UI-8: the title tracks the switch, same instant as the URL/wordmark
  const url = new URL(window.location.href);
  url.searchParams.set("game", next);
  // Accretion fix (W6): each game's URL params co-exist by design, but a `?board=` blob
  // (up to ~256 chars) riding into the other game's URL defeats the clean-URL rationale
  // that made the permalink share-on-demand. Strip BOTH games' board/size params on
  // switch — the incoming game re-adds only its own via its composable's syncToUrl.
  // `s` joins them (T6 mark 13): a session is BOARD-bound, so switching games leaves it —
  // the outgoing scene's unmount drops the wire, and the room id must not ride along.
  for (const key of ["board", "size", "difficulty", "board_size", "s"])
    url.searchParams.delete(key);
  history.replaceState(null, "", url.toString());
  // Switching games unmounts the outgoing scene (v-if), which stops its keyboard listener and
  // ends any in-flight peek with it — no cross-scene teardown needed here.
  if (reducedMotion.value || opts?.cut) {
    scene.value = next; // PRM or the gallery's Wave-B static cut: same-frame swap
    return;
  }
  leaving.value = true; // beat 1: the mounted scene erases; `erased` fires the seam
  // Seam guard: if the outgoing "scene" can't erase — e.g. it's still the async loading
  // placeholder (no board mounted, so no `erased` will ever come) — force the seam late
  // rather than never. A page-turn that degrades to a hard cut is a blemish; a switch
  // that deadlocks (`next === game.value` guards re-selects) is a bug.
  seamGuard = window.setTimeout(onSceneErased, 900);
}

// Beat 2 — the seam. The paper (bg + grain) never changes; only ink swaps. If the user
// re-selected the outgoing game mid-erase, `scene` stays put and the board redraws itself
// (its `leaving` watch sees false + 'hidden' → 'drawing') — a page-turn back to the same page.
function onSceneErased() {
  if (seamGuard !== null) {
    clearTimeout(seamGuard);
    seamGuard = null;
  }
  if (!leaving.value) return; // guard + real seam can't double-fire
  scene.value = game.value;
  leaving.value = false;
}

// F6-D3: warm every LAZY scene's chunk the moment the picker OPENS — by selection time it's
// cached, killing the first-select void structurally (G10 dramatized it: 150–3000ms of pure
// empty paper under CDP throttle). Sudoku rides the main chunk (eager); the other four warm
// through their OWN row's `load()` — generalizes the old Futoshiki-only warm to the five-game
// table. A cold select still resolves via `sceneFor`'s async loader (the warm is
// opportunistic), so warm-once suffices.
let scenesWarm = false;
function preloadScenes() {
  if (scenesWarm) return;
  scenesWarm = true;
  // Every non-eager row warms its spec chunk.
  for (const card of GAMES) {
    if (!card.eager)
      card.load().catch(() => {
        // The warm is OPPORTUNISTIC and this rejection is therefore not the user's news: a
        // cold select re-requests the same chunk through `sceneFor`'s own async loader, which
        // is where a real load failure is seen and surfaced. Reporting here would raise a
        // fault for a fetch nobody asked for, on a picker the user only hovered.
      });
  }
}

const desktopAttribution = ref<InstanceType<typeof AttributionCard> | null>(null);
const mobileAttribution = ref<InstanceType<typeof AttributionCard> | null>(null);
const logoMenu = ref<InstanceType<typeof HandwrittenLogo> | null>(null);

// ── The drawer's masthead half (T3-W12 §6) ────────────────────────────
// Closed, board + wordmark take the page's true axis and grow: the layout half is
// CSS (html.drawer-closed below — centering + --logo-scale 1.05); the glide half
// rides the masthead h1 (one translate+scale on the house glass curve, anchored
// on the wordmark's rect). The scene composable measures via this registration.
const mastheadEl = ref<HTMLElement | null>(null);
registerDrawerMasthead(() => ({
  block: mastheadEl.value,
  anchor: (logoMenu.value?.$el as HTMLElement | undefined) ?? null,
}));

function closeAll() {
  desktopAttribution.value?.close();
  mobileAttribution.value?.close();
}

// ── The game gallery (T4-W12 — the carousel; Wave C adds the board⇄card fold) ────────
// The select screen is a spread of paper worksheets. `useGameGallery` is the module-level
// view state machine (view/snappedIndex/enteredFrom + the `?view=gallery` URL truth); this
// app owns the `?game=` swap + the page-turn, so the gallery stays a VIEW over the one app,
// never a route. GameGallery is pencil-pure: it takes `GAMES` (structurally a `GalleryCard[]`)
// + the snapped index as props and emits @snap/@select/@cancel.
const { view, snappedIndex, openGallery, snapTo, select, cancel } = useGameGallery();

// THE HEADER THAT STAYS (T6 mark 7). The masthead survives the view flip, so it has to say
// something true in both: the MOUNTED game while playing, the SNAPPED card while the deck is
// open. HandwrittenLogo re-measures and re-bakes on a label change and declines to re-reveal
// (its I2 ruling), so a snap redraws the wordmark for free.
const headerName = computed(() =>
  view.value === "gallery"
    ? (GAMES[snappedIndex.value]?.name ?? game.value)
    : game.value,
);

// The mid-game guard's inputs (T4-W12 Wave D §4). `dirty` is the mounted board's ONE
// undo-depth signal, forwarded through the module bridge (no parallel bool); `coarse` is the
// primary-pointer class. Both flow into the pencil-pure gallery as PROPS — pencil imports
// nothing from games/**, so App (the app shell) reads them here and hands them across.
const dirty = useBoardDirty();
const coarse = useCoarsePointer();

// ── The board⇄card FOLD + THE LIVE CENTER FACE (T4-W12 Wave C/C2, §choreography) ──────────
// Grammar B (the drawer glide), generalized: App owns the board⇄card FLIP orchestration on the
// EXTRACTED `useFlipGlide` engine — the SAME proven primitive the drawer rides (no second
// animation brain). The covenant discipline it inherits verbatim: ONE glass curve, one clock,
// `composite:replace`/`fill:none`, and THE CRIT KILL — the board's LAYOUT size is never tweened;
// only a transform-scale rides the curve (the board keeps its playing-view raster, ≤1 raster).
//
// Wave C2 closes the deviation: the center card's face is the LIVE board (state + marks), not a
// poster + cut. The ONE board is REPARENTED into the center card via GameScene's Teleport
// (`setLiveFaceTarget`); the board itself is the FLIP mover, folding from its full pose into the
// face. Every view/URL/game transition still fires as Wave B, so a missing rect / PRM degrades
// to the same-frame cut and no state/visibility assertion sees mid-glide pixels.
const foldCtl = useFlipGlide({ durationMs: MOTION.boardFoldMs });

// Was the current gallery opened INTERACTIVELY (wordmark / `g` fold), not a ?view=gallery boot?
// Drives BEAT 2 "the deal" (flanks draw IN) — passed to the gallery as `:animate-entry`.
const entryAnimated = ref(false);
// The fold's board-pose anchor (FIRST rect), read before the chrome-leave; consumed by the
// live-face fold once the center card's face mounts. Null after use / on deep-link (no fold).
let pendingFoldFrom: DOMRect | null = null;
/** The masthead's playing-view pose (FIRST rect), read in the same breath as the board's — the
 *  wordmark is the SECOND mover in the same fold, so it travels instead of popping. */
let pendingHeadFrom: DOMRect | null = null;

/** The live board host's rect — the fold's full-pose anchor (read before the view flips). */
function boardHostRect(): DOMRect | null {
  return (
    document.querySelector<HTMLElement>(".board-peek-host")?.getBoundingClientRect() ??
    null
  );
}
/** The centered card's box — the exit unfold's card-pose anchor. */
function centerCardEl(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".game-card.is-center");
}

function onGallerySnap(index: number) {
  snapTo(index);
}

// THE LIVE CENTER FACE (Wave C2). The gallery hands up the current-game centered card's live
// mount (or null when it stops being live). App relocates the ONE board's subtree into it
// (`setLiveFaceTarget` → GameScene's Teleport — one instance, marks/Worker/state survive),
// fits it to the face box, and — on an interactive entry — runs BEAT 1, the fold.
function onLiveFace(el: HTMLElement | null) {
  setLiveFaceTarget(el); // teleport the board into the face, or park it home (null)
  if (!el) return;
  void nextTick(() => {
    const board = document.querySelector<HTMLElement>(".board-peek-host");
    if (!board) return;
    // Fit: shrink the full board into the face box. The board's LAYOUT never changes (the crit
    // kill) — `.live-face-fit` carries a COMPOSITOR scale, so the board keeps its playing-view
    // raster and only travels. Measured at scale 1, applied, then re-read — all pre-paint.
    const slot = el.parentElement; // .live-face-slot
    const faceW = slot?.getBoundingClientRect().width ?? 0;
    const boardW = board.getBoundingClientRect().width;
    if (faceW > 0 && boardW > 0)
      el.style.setProperty("--live-fit", String(faceW / boardW));
    // BEAT 1 — the fold: the live board scales DOWN from its full pose into the face slot on
    // the glass curve. `flipTransform` makes the (now face-sized) board LOOK full at its old
    // position, then it glides to identity, settling into the face — only the transform channel
    // tweens. Deep-link / navigation land the face with no fold (pendingFoldFrom null).
    if (pendingFoldFrom && !reducedMotion.value) {
      const from = pendingFoldFrom;
      const headFrom = pendingHeadFrom;
      pendingFoldFrom = null;
      pendingHeadFrom = null;
      const last = board.getBoundingClientRect(); // face-slot pose (post-fit)
      // The masthead rides the SAME fold as its second element — one `run`, one clock, one
      // curve. `--logo-scale` is a LAYOUT size and has already landed at onset (classic FLIP);
      // the transform covers the move on the baked poses, so it is compositor-only with one
      // re-bake at settle — the drawer's own masthead precedent, verbatim.
      foldCtl.run([
        {
          el: board,
          from: flipTransform(from, last),
          to: "translate(0px, 0px) scale(1)",
          transformOrigin: "50% 50%",
        },
        ...mastheadMover(headFrom),
      ]);
    }
  });
}

/** The masthead as a mover, or nothing when there is no FIRST rect to fold from. */
function mastheadMover(first: DOMRect | null): FlipMover[] {
  const el = mastheadEl.value;
  if (!first || !el) return [];
  return [
    {
      el,
      from: flipTransform(first, el.getBoundingClientRect()),
      to: "translate(0px, 0px) scale(1)",
      transformOrigin: "50% 50%",
    },
  ];
}

/** Run the unfold movers once the view has flipped: in `nextTick` (pre-paint) read each
 *  mover's LAST rect and hand `useFlipGlide` a `first → last` delta, so the board-pose keyframe
 *  is on-screen from frame ONE (no rest-pose flash). A null mover drops out; all of them
 *  dropping out leaves the cut standing. */
function runFold(pairs: { first: DOMRect | null; el: () => HTMLElement | null }[]) {
  void nextTick(() => {
    const movers: FlipMover[] = [];
    for (const pair of pairs) {
      const el = pair.el();
      if (!el || !pair.first) continue;
      movers.push({
        el,
        from: flipTransform(pair.first, el.getBoundingClientRect()),
        to: "translate(0px, 0px) scale(1)",
        transformOrigin: "50% 50%",
      });
    }
    if (movers.length) foldCtl.run(movers);
  });
}

// ENTRY — §BEAT 0 then §BEAT 1/2. `g` / the wordmark folds the live board into the center card.
// Beat 0: the scene chrome fades out (`html.gallery-leaving`, MOTION.chromeLeaveMs) while the
// board HOLDS — it never erases. Then openGallery mounts the deck; the center card's face mounts
// live and `onLiveFace` runs the fold (beat 1); the deal fires on the deck's mount (beat 2). PRM
// cuts every beat.
function enterGallery() {
  preloadScenes(); // F6-D3: warm the lazy scene chunks on OPEN, so a select is cached
  if (reducedMotion.value) {
    entryAnimated.value = false;
    openGallery(game.value); // PRM: same-frame cut — no chrome-leave, no fold, no deal
    return;
  }
  const first = boardHostRect(); // the board's full pose, read BEFORE beat 0
  const head = mastheadEl.value?.getBoundingClientRect() ?? null; // …and the wordmark's
  entryAnimated.value = true;
  if (!first) {
    openGallery(game.value); // no board to fold → cut (the deal still deals)
    return;
  }
  pendingFoldFrom = first;
  pendingHeadFrom = head;
  document.documentElement.classList.add("gallery-leaving"); // BEAT 0 — chrome leaves (200ms)
  window.setTimeout(() => {
    document.documentElement.classList.remove("gallery-leaving");
    openGallery(game.value); // BEAT 1 (fold via onLiveFace) + BEAT 2 (deal via deck mount)
  }, MOTION.chromeLeaveMs);
}

// EXIT unfold: the chosen card unfolds back to a full board. Park the live board home FIRST
// (never orphan it as the deck unmounts — GameScene's Teleport is App-tree, ordered BEFORE the
// gallery in <main>, so the board reparents before the deck is removed), read the small card
// pose, apply the state synchronously (select + setGame — the game swap is THE SEAM, hidden
// under the still-small card — or cancel), then FLIP the board UP from that pose to full.
// `sameGame` = a pure unfold, no seam.
function unfoldToBoard(applyState: () => void) {
  const card = centerCardEl();
  const first = card?.getBoundingClientRect() ?? null;
  // BOTH firsts before `applyState()` — the state flip is what moves the masthead back to its
  // playing pose, so its gallery rect has to be in hand before that happens.
  const headFirst = mastheadEl.value?.getBoundingClientRect() ?? null;
  setLiveFaceTarget(null); // un-teleport the board home before the deck unmounts
  applyState(); // synchronous view→playing + game swap (the seam) or cancel (Wave B path)
  if (reducedMotion.value || !first) return; // PRM / no card → same-frame cut
  runFold([
    { first, el: () => document.querySelector<HTMLElement>(".board-peek-host") },
    { first: headFirst, el: () => mastheadEl.value },
  ]);
}

function onGallerySelect(id: string) {
  unfoldToBoard(() => {
    select(); // view → playing, `?view` cleared
    setGame(id, { cut: true }); // same-frame cut to the chosen game (`?game` if changed) — the seam
  });
}
function onGalleryCancel() {
  unfoldToBoard(() => cancel()); // unfold back to the entered-from game (no swap, no seam)
}

// ── THE STAGING BRIDGE (T4-P1 F4) ──────────────────────────────────────────────────────
// App names the MOUNTED game, because App already owns `?game=` and the page-turn seam — the
// bridge transports, it never parses a second truth. `scene` IS the mounted id (it flips at the
// seam, and synchronously for the gallery's cut), and `immediate` covers BOOT, deep links, and
// the `?view=gallery` boot path — every entry the pass-1 `enterGallery`-only publish missed.
watch(scene, (id) => publishMountedGame(id), { immediate: true });

// COLD-START TRUTH (T4-P1 F4): seed the ledger from the five games' own saved boards, ONCE, at
// boot. Without it the whole installed base opened the picker to `start` on games it had boards
// for, and four of five cards showed a table default dressed as saved settings. At boot and
// not on gallery open because `?view=gallery` is a real entry — a deep link would otherwise
// render the deck before the truth existed. Five `getItem` + `JSON.parse` of the boards already
// on disk; missing rows only, so the mounted game's live publish always wins.
backfillLedger(GAMES);

// The cross-game ledger, id-keyed: what each game is set to, whether a board waits there, and
// whether there is work on it. The mounted game writes its own row as it goes; the other four
// come from the cold-start backfill below, so the picker reads ONE truth for all five cards
// instead of dressing table defaults as saved settings.
const gallerySaved = useStagedLedger();

// A deal is in flight — the band's verbs go inert until it lands (the double-deal guard the
// pass-1 prototype documented on two components and never bound).
const dealBusy = ref(false);

/** THE FUSED TRANSACTION: pick a game AND its settings, deal once. Same game → the mounted
 *  state's own `deal()` through the bridge (no remount, no second solver dispatch). Different
 *  game → an id-keyed one-shot the incoming `useGameState` consumes BEFORE its init, so the
 *  staged pair seeds that mount's single deal. Both paths unfold the picker exactly as a select
 *  does — one choreography, no new durations. */
async function onGalleryDeal(payload: {
  id: string;
  size: number | string;
  difficulty: number | string;
}) {
  const pair = { size: Number(payload.size), difficulty: String(payload.difficulty) };
  const sameGame = payload.id === game.value;
  if (!sameGame) stageHandoff(payload.id, pair);
  dealBusy.value = true;
  unfoldToBoard(() => {
    select();
    setGame(payload.id, { cut: true });
  });
  try {
    // The handoff path deals inside the incoming mount; only the same-game path has a live state
    // to drive from here.
    //
    // `false` means the bridge had NO registered source — and `useGameState` registers at setup,
    // so on the same-game path that says one thing exactly: the scene has not mounted yet. The
    // reachable case is a `?view=gallery&game=<lazy>` deep link dealt before its chunk resolves
    // (four of five games are lazy, and the picker only warms them). NOTHING remounts here to
    // fix it — `setGame` to the id already selected is a no-op cut, by the ruling at that site —
    // so the consumer is that scene's OWN first mount, which is the same id-keyed one-shot the
    // cross-game path uses, `consumeHandoff` before init. Not a fallback for a mounted game: for
    // a mounted game the source exists and this branch cannot be entered. Gated end to end
    // (`gallery-deal.spec.ts`, "a same-game deal issued before the scene mounts").
    if (sameGame && !(await dealStaged(pair))) stageHandoff(payload.id, pair);
  } finally {
    dealBusy.value = false;
  }
}

// ENTRY (§ENTRY): keyboard `g` opens the gallery from the playing view (folding the board
// into the center card). Pointing the wordmark at `enterGallery` + retiring the dropdown is
// Wave D; this entry seam is additive and dropdown-agnostic, guarded so a `g` typed into a
// board cell/field never fires it.
//
// Its own guard STAYS (T5-W3 §3.4): the policy above is the floor every character shortcut
// shares, and `g` sits deliberately below it — the policy exempts the board's digit cells so
// K still peeks from the grid (UI-7(a)), while a `g` typed in a cell must not throw the player
// out to the picker. The narrower rule is this handler's to hold, and it holds it here.
function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key !== "g" && e.key !== "G") return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (view.value !== "playing") return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName)))
    return;
  e.preventDefault();
  enterGallery();
}
onMounted(() => window.addEventListener("keydown", onGlobalKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onGlobalKeydown));
</script>

<template>
  <div
    class="page-root bg-background text-foreground flex h-screen flex-col py-1 md:py-3"
    @click="closeAll"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool, env-gated (import.meta.env.DEV), absent from prod builds -->
    <component :is="FilterTuner" v-if="FilterTuner" />

    <!-- Desktop: fixed corner overlay -->
    <AttributionCard ref="desktopAttribution" />

    <div class="corner-right" @click.stop>
      <DarkModeToggle />
    </div>

    <main
      class="main-content flex min-h-0 flex-1 flex-col items-center justify-center px-1 md:px-4"
    >
      <!-- The playing board stays MOUNTED under the gallery (v-show, not v-if): state is
           preserved across an open/cancel (the one live board on the page), and the FLIP
           fold in Wave C reads the board's own rect.
           T6 mark 7: the v-show sits one level DOWN — the group itself renders in both views
           so the MASTHEAD travels into the gallery and stays, naming the card the deck has
           snapped. The scene and the mobile attribution are what the gallery replaces. The
           `<h1>` never moves in the DOM, so every rule hanging off `.board-group` parentage
           (the landscape dock, the drawer-closed centering) is untouched; the teleported
           `.board-peek-host` has already been relocated OUT of the scene root by the time the
           face is live, so it keeps painting inside the card. -->
      <div class="board-group" :class="{ 'is-gallery': view === 'gallery' }">
        <!-- Mobile: @mbabb on the head line beside the sun (T6.2 mark C — it is fixed chrome
             now, not the assembly's first row; it stays mounted HERE so the gallery's v-show
             and `closeAll` keep their one owner). -->
        <AttributionCard ref="mobileAttribution" mobile v-show="view === 'playing'" />
        <!-- Masthead: the pencil wordmark renders the CURRENT game's name and OPENS THE
             GALLERY (T4-W12 Wave D — the dropdown listbox is retired; one game-select
             surface, the carousel). A real <button>; its click folds the board into the
             center card. Pencil never imports games: the id is a prop, the open comes back
             via @open (App owns enterGallery + the fold). -->
        <!-- UI-8: an <h1> gives the page its one heading (landmarks.h1 was []). The
             wordmark button is the accessible name of that heading — the current game —
             so the h1 stays visually identical (reset to inherit; the button carries all
             the paint). -->
        <!-- T6 mark 7: `headerName`, not `game` — in the gallery the wordmark names the card
             the deck has snapped, and the heading goes INERT there (the deck is the one
             game-select surface, so a wordmark that names the snapped card while acting as
             cancel-to-the-entered-game would be a mislabelled control). -->
        <h1 ref="mastheadEl" class="masthead">
          <HandwrittenLogo
            ref="logoMenu"
            :game="headerName"
            :inert-heading="view === 'gallery'"
            @open="enterGallery"
          />
        </h1>

        <!-- THE MOUNT FOLD (T4-W13): one scene mounts at a time, resolved from `scene` — the
             MOUNTED id, which flips at the page-turn's seam (`game` is the selected id, driving
             the wordmark/URL at click). `sceneFor` returns the eager Sudoku directly (main
             chunk) or a lazy async component per game (its composable + Worker only start when
             that game is selected). The table-driven fold replaces the hardcoded two-game
             v-if union — game #3+ mount with zero edits here. -->
        <component
          :is="sceneFor(scene)"
          v-show="view === 'playing'"
          :leaving="leaving"
          @erased="onSceneErased"
        />
      </div>

      <!-- The gallery mounts in the board's place when view==='gallery' (Wave B static cut;
           the board⇄card fold is Wave C). Pencil-pure: GAMES flows in as GalleryCard[] props,
           the choice returns via @select — no games/** import crosses into pencil.
           T6 mark 7: LEAVE-ONLY fade. The exit's protagonist is the board unfolding out of the
           card, and the deck used to vanish under it on a hard cut; dissolving it closes that
           hole for two rules and no added latency (`unfoldToBoard` parks the live board home
           BEFORE the view flips, so the fading deck never contains the board). Entry needs
           nothing — BEAT 2, the deal, already animates it. -->
      <Transition name="gallery-fade">
        <GameGallery
          v-if="view === 'gallery'"
          :cards="GAMES"
          :snapped-index="snappedIndex"
          :dirty="dirty"
          :current-id="game"
          :coarse="coarse"
          :animate-entry="entryAnimated"
          :saved="gallerySaved"
          :busy="dealBusy"
          @snap="onGallerySnap"
          @select="onGallerySelect"
          @cancel="onGalleryCancel"
          @deal="onGalleryDeal"
          @live-face="onLiveFace"
        />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
/* THE HEAD'S ONE METRIC (T6.2 mark C). `--toggle-size` was declared on `.corner-right`, which
   is the only place that could read it — and the head has TWO corners. The attribution's line
   is the toggle's own middle, so the number moves up to the page root where both corners
   inherit it (the `--board-col` precedent: declared once on the common ancestor, spelled out
   nowhere else). `DarkModeToggle` keeps its `5rem` fallback, so the component is still whole
   on its own. */
.page-root {
  --toggle-size: 5rem;
}

/* The 8rem md rung died with the md row regime (R3): at 768–1023 the layout now
   stacks, and a 128px fixed sun grazed the board's top-right frame. Stacked keeps
   the 5rem mobile sun; the row regime (≥lg) keeps its 13rem corner celestial. */
@media (min-width: 1024px) {
  .page-root {
    --toggle-size: 13rem;
  }
}

/* R3 — the 42×32px logo-button↔toggle contention at 375: the centered wordmark's
   caret end ran under the fixed 5rem toggle. One rung down on the toggle + a small
   masthead clearance separates the two hit targets completely. */
@media (max-width: 480px) {
  .page-root {
    --toggle-size: 4rem;
  }

  .masthead {
    margin-top: 0.75rem;
  }
}

.corner-right {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 60;
  /* THE PADDING THE OWNER SAW (T6.2 mark C). The toggle is a `<button>` — an inline-level box —
     so this wrapper was a line box around it and carried the font's descender leading under
     the celestial: 215px of chrome around a 208px control, measured, at every width. `flex`
     makes the block's height the toggle's own. The `top: -0.25rem / right: 0.25rem` nudge that
     rode ≤767 leaves with it: it existed to claw that slack back at the one rung where it
     showed, and there is no slack left to claw. */
  display: flex;
  /* P2 (T3-W12 §2) — the toggle's celestial on its own promoted layer: the sun/moon
       polygon boil contributed ~25 paints/s of scrolling-layer damage in the a1
       baseline. Promotion (not contain: paint): the theme whirl translates the icons
       50% outside this box — paint containment would crop the gesture mid-flight;
       a promoted layer's ink overflow clips nothing. */
  will-change: transform;
  /* Safe-area inset (T4-WM lane C): the fixed toggle sits at the very top-right corner,
     so under a notch/Dynamic Island (viewport-fit=cover, index.html) it must pad clear
     of the inset. `env()` resolves to 0 on non-notched hardware and desktop, so this is
     a no-op there and a real clearance only where the OS reserves the corner. */
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

.board-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
}

/* THE GALLERY POSE (T6 mark 7). The group is now the masthead's carrier in both views, and in
   the deck's view the wordmark is a caption over the spread: centred, small, out of every
   regime's dock. At (0,3,0) these beat `html.drawer-closed .masthead` (0,2,1) and the landscape
   dock's `.masthead` (0,1,0), which is what they have to do — both would otherwise re-park a
   masthead that no longer has a board under it. `translate: none` is the dock's own
   `translate: 0 -50%` neutralised. */
.board-group.is-gallery {
  align-items: center;
}

.board-group.is-gallery .masthead {
  position: static;
  align-items: center;
  margin: 0 0 0.25rem;
  translate: none;
  --logo-scale: 0.72;
}

/* The deck's leave-only dissolve — the twin of BEAT 0's chrome-leave, on the same clock. */
.gallery-fade-leave-active {
  transition: opacity 200ms var(--ease-glassGlide);
}

.gallery-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-fade-leave-active {
    transition: none;
  }
}

/* F6-D3 cold fallback host — the thinking-scribble centered on otherwise-blank paper,
   sized so the page doesn't collapse to zero height while the chunk fetches. */
.scene-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  color: var(--color-muted-foreground);
}

/* Masthead: the wordmark-as-game-picker (renders the current game, opens the picker menu).
   Now an <h1> (UI-8) — reset the UA heading defaults so wrapping the wordmark in a heading
   is a semantics-only change, zero visual delta (the button owns every pixel of the paint). */
.masthead {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

@media (max-width: 1023px) {
  .masthead {
    align-items: center;
  }
}

/* ── THE MASTHEAD MOVE (T5-W4 pass 6, the lead's landscape ratification) ─────────────────
   The row this pays off has been a comment for two passes. At 844×390 the board's drawn frame
   hangs **88.58px** below the fold (chromium; 87.98 webkit — the `.board-wrapper` referent,
   re-derived here rather than quoted, and NOT the pass-4 registry's unreproducible 90.58/89.98:
   pass 5's F3-G2 is the party in the right). The named cure has always been the masthead,
   which spends **98.58 of the 114.58** standing above the board at that cell. It is the only
   move that is not a trade: every rung of the cap ladder buys fold with CELL, and the lead's
   charter (c) holds the shipped rung — 40.22px of cell, portrait parity — RATIFIED.

   So the masthead MOVES rather than shrinks its way down the page. A landscape phone is wide
   and short: the board takes 366 of 844 and leaves ~239px of gutter on each side doing nothing.
   The wordmark docks into the left gutter, vertically centred against the board — which is not
   a new grammar, it is the DESK's grammar (the rail sits beside the board, centred, for exactly
   this reason), read in the one orientation that has the width to spare and not the height.

   `--logo-scale` is the estate's own knob for this, already consumed by `HandwrittenLogo`'s
   height calc and already used at 1.05 by the closed-desk pose. The value is DERIVED and the
   derivation was corrected once by a shot: the gutter is not half the viewport, it is the page
   gutter to the board's own left edge — `.board-group` starts at x 86 and `.board-wrapper` at
   x 239, so the room is **153px**, not 239. The first cut took the wider number, scaled to
   0.68, and the wordmark lay across four columns of the grid (`shots/land-*-AFTER-*`, the shot
   that caught it — the campaign's proxy≠surface family once more, and once more caught by an
   eye rather than by a number). Measured at 0.68 the masthead box draws 249.52 wide, so the
   scale that fits 153 − 12 of gap is 0.68 × 141 / 249.52 = **0.384**; 0.38 lands it at ~139
   wide by ~39 tall, which is a tenth of this cell's short edge and reads whole.

   ORIENTATION-SCOPED, like everything else this pass touches: portrait is the dock's regime and
   its masthead stays whole above the board, which is the pose the covis row is built on. */
@media (max-width: 1023.98px) and (orientation: landscape) {
  .board-group {
    position: relative;
  }

  .masthead {
    position: absolute;
    left: 0;
    /* `50dvh`, NOT `50%`: the containing block is the whole board GROUP, which at this cell is
       ~1124px tall (the page still scrolls to reach the controls card, as the shipped rung
       does), so a percentage would centre the wordmark against the document and park it 484px
       down, out of sight of the board it names. The board now occupies the first viewport
       whole — that is what this move buys — so half the short edge IS the board's own middle.
       Measured: board 16 → 380, centre 198; `50dvh` = 195. */
    top: 50dvh;
    translate: 0 -50%;
    align-items: flex-start;
    --logo-scale: 0.38;
    z-index: 5;
    margin: 0;
  }

  /* The gallery has no board to dock beside, so its masthead comes back to the top of the
     page — where a landscape PHONE has 390px of height for a deck, a slip and a wordmark. The
     dock's own rung is what fits: measured at 0.72 the block spends ~150 of those 390 and the
     deck is left a 90px strip. */
  .board-group.is-gallery .masthead {
    --logo-scale: 0.4;
  }
}

/* ── The drawer's masthead half (T3-W12 §6, ≥1024 only) ───────────────
   Closed: the wordmark centers on the page axis (align-self beats the ladder's
   flex-start) and grows one soft step (--logo-scale, consumed by HandwrittenLogo's
   height calc — a LAYOUT size, so the settle's one layout step carries it; the
   glide covers the move with a real transform). */
@media (min-width: 1024px) {
  html.drawer-closed .masthead {
    align-items: center;
    --logo-scale: 1.05;
  }

  html.drawer-closed .masthead .logo-menu {
    align-self: center;
  }

  /* The glide: the masthead rides the board's glass curve as a WAAPI mover
     (keyframes + transform-origin driven by useControlsDrawer; the ONE ledgered
     curve, MOTION.curves.drawerGlide — W13 §3-S3′; origin cleared at settle). The
     class arms NO transition — it only promotes for the gesture's duration. */
  html.drawer-gesturing .masthead {
    will-change: transform;
  }
}

@media (max-width: 1023px) {
  .board-group {
    align-items: center;
    /* Keyboard-avoidance scroll-room (T4-WM lane C): useKeyboardViewport publishes the OS
       keyboard's occlusion height as `--keyboard-inset` on <html>; the stacked scene claims
       that much bottom room so a below-fold focused cell has somewhere to scroll up TO,
       clear of the keyboard. 0 at rest and on every non-stacked/desktop layout.
       THIS IS THE ONE LAYOUT CONSUMER of that var, which is why the publisher is gated on a
       focused input (T6.2 mark B): ungated, every momentum-scroll wobble arrived here and the
       centring below halved it into a board bounce. */
    padding-bottom: var(--keyboard-inset, 0px);
  }
}

/* THE WORKSHEET CENTRES (T6 mark 9). Portrait spent its slack at the bottom: the block ended
   at the verbs band and the rest of the screen was empty paper. Auto margins take that free
   space and split it, so masthead, board, reserved line and verbs read as one assembly with
   air above and below. Portrait-scoped — landscape really scrolls and keeps flex-start below.
   Under overflow auto margins collapse to 0, which is flex-start again, so this can never clip
   and never mints a scroll. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .board-group {
    margin-block: auto;
  }
}

@media (max-width: 1023px) {
  .main-content {
    justify-content: flex-start;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
  }
}
</style>
