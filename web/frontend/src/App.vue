<script setup lang="ts">
import {
  ref,
  watch,
  defineAsyncComponent,
  h,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type Component,
} from "vue";
import { usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { MOTION } from "@pencil/config/pencilConfig";
import { flipTransform, useFlipGlide } from "@games/shared/useFlipGlide";
import SudokuGame from "@games/sudoku/SudokuGame.vue";
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
import { GAMES } from "@games/registry";

// T4-WM §1 keyboard-avoidance (lane C): one document-scoped install covers both games — it
// keys on the shared `.board-cells` contract and no-ops for every other focus target. The OS
// software keyboard (back with the pad abrogation) shrinks the visual viewport on iOS without
// resizing the layout viewport, so this scrolls a focused board cell clear of the keyboard via
// `visualViewport` (the one cross-engine path — WebKit ships no VirtualKeyboard/interactive-widget).
useKeyboardViewport();

// OD-8 / T4-W13 — THE MOUNT FOLD: the registry-driven scene mount. A gallery select / `?game=`
// deep-link sets `scene` to a game id; `sceneFor` resolves it to the mountable component. The
// eager default (Sudoku) rides the main chunk (its static import above) — a byte-unchanged load
// (ratified asymmetry, P4 #4); every other game is a LAZY `defineAsyncComponent` over the
// registry's own `card.scene()` loader — the SAME dynamic-import chunk today's Futoshiki cut,
// now generalized to all five so each game's composable + Worker start only when it's selected.
// Memoized so each id keeps a STABLE component identity across re-renders/switches.
// F6-D3 cold fallback: the lazy chunks preload on gallery OPEN (preloadScenes), so a select is
// normally cached. A genuinely cold select (throttled — G10's `first-select-void-400ms.png`)
// shows blank paper ≤300ms then the thinking-scribble (delay:300 + loadingComponent) — never a
// spinner (design §5.1).
const sceneCache = new Map<string, Component>();
function sceneFor(id: string): Component {
  const cached = sceneCache.get(id);
  if (cached) return cached;
  const card = GAMES.find((c) => c.id === id) ?? GAMES[0];
  const comp: Component = card.eager
    ? SudokuGame
    : defineAsyncComponent({
        loader: card.scene,
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

// T4-W13 — the id union WIDENS to `string` keyed on the registry (the W11 KEY precedent:
// tiers erased at the boundary). `?game=` is validated against GAMES; an unknown id (or none)
// lands on sudoku, the default.
type GameId = string;
function parseGame(): GameId {
  const id = new URLSearchParams(window.location.search).get("game") ?? "";
  return GAMES.some((c) => c.id === id) ? id : "sudoku";
}
// UI-8: the tab title names the CURRENT game — the static "Sudoku - CSP Solver" in
// index.html lied on Futoshiki after both a deep-link (`?game=futoshiki`) and an in-app
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
  if (next === game.value) {
    if (opts?.cut) scene.value = next; // re-select the same game from the gallery: no-op cut
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
  for (const key of ["board", "size", "difficulty", "board_size"])
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
// through their OWN registry `scene()` loaders — generalizes the old Futoshiki-only warm to the
// five-game registry. A cold select still resolves via `sceneFor`'s async loader (the warm is
// opportunistic), so warm-once suffices.
let scenesWarm = false;
function preloadScenes() {
  if (scenesWarm) return;
  scenesWarm = true;
  for (const card of GAMES) {
    if (!card.eager) card.scene().catch(() => {});
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
      pendingFoldFrom = null;
      const last = board.getBoundingClientRect(); // face-slot pose (post-fit)
      foldCtl.run([
        {
          el: board,
          from: flipTransform(from, last),
          to: "translate(0px, 0px) scale(1)",
          transformOrigin: "50% 50%",
        },
      ]);
    }
  });
}

/** Run ONE unfold mover once the view has flipped: in `nextTick` (pre-paint) read the mover's
 *  LAST rect and hand `useFlipGlide` a `first → last` delta, so the board-pose keyframe is
 *  on-screen from frame ONE (no rest-pose flash). A null mover → the cut stands. */
function runFold(first: DOMRect, getMover: () => HTMLElement | null) {
  void nextTick(() => {
    const el = getMover();
    if (!el) return;
    const last = el.getBoundingClientRect();
    foldCtl.run([
      {
        el,
        from: flipTransform(first, last),
        to: "translate(0px, 0px) scale(1)",
        transformOrigin: "50% 50%",
      },
    ]);
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
  entryAnimated.value = true;
  if (!first) {
    openGallery(game.value); // no board to fold → cut (the deal still deals)
    return;
  }
  pendingFoldFrom = first;
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
  setLiveFaceTarget(null); // un-teleport the board home before the deck unmounts
  applyState(); // synchronous view→playing + game swap (the seam) or cancel (Wave B path)
  if (reducedMotion.value || !first) return; // PRM / no card → same-frame cut
  runFold(first, () => document.querySelector<HTMLElement>(".board-peek-host"));
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
// for, and four of five cards showed a registry default dressed as saved settings. At boot and
// not on gallery open because `?view=gallery` is a real entry — a deep link would otherwise
// render the deck before the truth existed. Five `getItem` + `JSON.parse` of the boards already
// on disk; missing rows only, so the mounted game's live publish always wins.
backfillLedger(GAMES);

// The cross-game ledger, id-keyed: what each game is set to, whether a board waits there, and
// whether there is work on it. The mounted game writes its own row as it goes; the other four
// come from the cold-start backfill below, so the picker reads ONE truth for all five cards
// instead of dressing registry defaults as saved settings.
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
    // The handoff path deals inside the incoming mount; only the same-game path has a live
    // state to drive from here. A `false` return means NO game was mounted to deal into — the
    // arm would otherwise be dropped on the floor as a silent success, so it is re-staged and
    // the incoming mount consumes it exactly as a cross-game deal would.
    if (sameGame && !(await dealStaged(pair))) stageHandoff(payload.id, pair);
  } finally {
    dealBusy.value = false;
  }
}

// ENTRY (§ENTRY): keyboard `g` opens the gallery from the playing view (folding the board
// into the center card). Pointing the wordmark at `enterGallery` + retiring the dropdown is
// Wave D; this entry seam is additive and dropdown-agnostic, guarded so a `g` typed into a
// board cell/field never fires it.
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
    class="bg-background text-foreground flex h-screen flex-col py-1 md:py-3"
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
           fold in Wave C reads the board's own rect. -->
      <div class="board-group" v-show="view === 'playing'">
        <!-- Mobile: @mbabb in-flow, left-aligned with logo -->
        <AttributionCard ref="mobileAttribution" mobile />
        <!-- Masthead: the pencil wordmark renders the CURRENT game's name and OPENS THE
             GALLERY (T4-W12 Wave D — the dropdown listbox is retired; one game-select
             surface, the carousel). A real <button>; its click folds the board into the
             center card. Pencil never imports games: the id is a prop, the open comes back
             via @open (App owns enterGallery + the fold). -->
        <!-- UI-8: an <h1> gives the page its one heading (landmarks.h1 was []). The
             wordmark button is the accessible name of that heading — the current game —
             so the h1 stays visually identical (reset to inherit; the button carries all
             the paint). -->
        <h1 ref="mastheadEl" class="masthead">
          <HandwrittenLogo ref="logoMenu" :game="game" @open="enterGallery" />
        </h1>

        <!-- THE MOUNT FOLD (T4-W13): one scene mounts at a time, resolved from `scene` — the
             MOUNTED id, which flips at the page-turn's seam (`game` is the selected id, driving
             the wordmark/URL at click). `sceneFor` returns the eager Sudoku directly (main
             chunk) or a lazy async component per game (its composable + Worker only start when
             that game is selected). The registry-driven fold replaces the hardcoded two-game
             v-if union — game #3+ mount with zero edits here. -->
        <component :is="sceneFor(scene)" :leaving="leaving" @erased="onSceneErased" />
      </div>

      <!-- The gallery mounts in the board's place when view==='gallery' (Wave B static cut;
           the board⇄card fold is Wave C). Pencil-pure: GAMES flows in as GalleryCard[] props,
           the choice returns via @select — no games/** import crosses into pencil. -->
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
    </main>
  </div>
</template>

<style scoped>
.corner-right {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 60;
  --toggle-size: 5rem;
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

/* The 8rem md rung died with the md row regime (R3): at 768–1023 the layout now
   stacks, and a 128px fixed sun grazed the board's top-right frame. Stacked keeps
   the 5rem mobile sun; the row regime (≥lg) keeps its 13rem corner celestial. */
@media (min-width: 1024px) {
  .corner-right {
    --toggle-size: 13rem;
  }
}

@media (max-width: 767px) {
  .corner-right {
    top: -0.25rem;
    right: 0.25rem;
  }
}

/* R3 — the 42×32px logo-button↔toggle contention at 375: the centered wordmark's
   caret end ran under the fixed 5rem toggle. One rung down on the toggle + a small
   masthead clearance separates the two hit targets completely. */
@media (max-width: 480px) {
  .corner-right {
    --toggle-size: 4rem;
  }

  .masthead {
    margin-top: 0.75rem;
  }
}

.board-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
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
       clear of the keyboard. 0 at rest and on every non-stacked/desktop layout. */
    padding-bottom: var(--keyboard-inset, 0px);
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
