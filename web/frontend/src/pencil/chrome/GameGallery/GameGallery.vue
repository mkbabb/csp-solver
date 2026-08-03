<script setup lang="ts">
/**
 * GameGallery — the carousel shell (T4-W12 §6). Wave B: the static deck + listbox a11y +
 * scroll-snap + glass-curve glide + page pips. Wave D: the mid-game guard ribbon + the
 * click-to-select affordance (the snap chime lives per-card in GameCard).
 *
 * A spread of paper worksheets dealt onto a desk. Pencil-pure: it takes `GalleryCard[]` +
 * the snapped index (and Wave D's `dirty`/`currentId`/`coarse` guard inputs) as PROPS and
 * emits `@snap` / `@select` / `@cancel` — it imports nothing from `games/**` (the eslint
 * boundary). App.vue owns the `useGameGallery` state machine, the dirty bridge, and the
 * `?game=` swap; this component owns the carousel DOM, the listbox a11y, the glass-curve
 * glide (`useCarouselGlide`), the page pips, and the guard-ribbon gate.
 *
 * A11y — listbox-over-carousel (W3C APG). DOM focus lives on the track container; the
 * highlighted card is tracked with `aria-activedescendant`. ←/→ step · Home/End first/last ·
 * Enter/Space select · Esc cancel. A polite live region announces each snap. The full key map,
 * with its one owner per key, is stated at `onWindowEscape` below — Esc is the one key bound on
 * the WINDOW rather than the listbox, because it is the way out (T8 M7a).
 *
 * POINTER (T8 M10). A click on the CENTERED card selects it; a click on a FLANK warps the deck
 * to that card, through `go()` — the same glass curve, the same `@snap` seam, the same live
 * region a keyboard step drives. A drag that merely ends over a card is not a click: the
 * capture-phase swallow in `useCarouselGlide` eats that release before any card sees it.
 *
 * THE SOUL GATE. This component holds the ONE shared-beat enrolment (`useBeatFrame`) on behalf
 * of the centered card, and feeds the live pose to that card ALONE; every flank gets pose 0
 * (frozen) + `inert`. Exactly one card boils; flanks paint nothing.
 *
 * THE MID-GAME GUARD (Wave D §4). A select of a DIFFERENT game while the board is `dirty`
 * (App's dirty bridge → the `dirty` prop) does NOT switch immediately: it arms a pencil-note
 * ribbon on the chosen card (keep / leave). Pristine boards and same-game selects switch
 * freely. Never `confirm()` — the ribbon is drawn, dismissible, and its own thing.
 *
 * THE GUARD SPEAKS (T5-W3 §3.2). It is drawn light and it BEHAVES modal: while armed, the
 * listbox's Enter/Space/Escape resolve the ribbon rather than the deck, the staging band's
 * verbs go busy, and both destructive verbs early-return. So it carries the modal semantics it
 * already had the behaviour of — `alertdialog` + `aria-modal` + focus moved in, contained by
 * Tab, and handed back to the listbox on retire. `alertdialog` alone is MUTE, though (it
 * carries no implicit live semantics), and a live region born already-populated under `v-if`
 * is unreliably spoken — so the arming utterance goes through a PERSISTENT assertive region
 * that sits empty until there is work at risk. Before this, the second Enter took a dirty
 * board 1 → 0 with nothing ever said (`evidence/audit/r2/verify-gate-criticals.md` §H2).
 */
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  createSequenceSubscription,
  easeOutCubic,
  usePrefersReducedMotion,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";
import {
  BOIL_CONFIG,
  DRAW_IN_PRESETS,
  MOTION,
  beatsFor,
} from "@pencil/config/pencilConfig";
import { heldFrameCount } from "@mkbabb/pencil-boil";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import GameCard from "./GameCard.vue";
import StagingBand from "./StagingBand.vue";
import { useCarouselGlide } from "./useCarouselGlide";
import type { GalleryCard, GallerySaved } from "./types";

const props = defineProps<{
  cards: readonly GalleryCard[];
  /** The centered card (from `useGameGallery`); reconciled into `activeIndex` on open. */
  snappedIndex: number;
  /** The currently-playing board is dirty (App's dirty bridge → WU's undo-depth signal).
   *  Gates the mid-game guard: a dirty + DIFFERENT select arms the ribbon. */
  dirty?: boolean;
  /** The id of the game being played (the fold-from). "Different" = chosen id ≠ this. */
  currentId?: string;
  /** Coarse primary pointer (App reads `useCoarsePointer` — pencil can't cross the boundary).
   *  Suppresses the fine-pointer hover cue on the centered card (§10 no-hover on coarse). */
  coarse?: boolean;
  /** Entry was interactive (the wordmark / `g` fold), not a `?view=gallery` deep-link boot —
   *  so BEAT 2 "the deal" (flanks draw IN) plays. Deep-link + PRM land the cards settled. */
  animateEntry?: boolean;
  /** THE CROSS-GAME TRUTH (T4-P1 F4) — id-keyed: the settings each game was last left at,
   *  whether a board is saved there, and whether there is work on it. App assembles it from the
   *  staging bridge's ledger (live row for the mounted game, cold-start backfill for the rest);
   *  a card with no entry is a game never played, and the band reads `start` instead of dressing
   *  a registry default as the board you left. */
  saved?: Record<string, GallerySaved>;
  /** A deal is in flight — the band's verbs go inert (double-deal guard). App PASSES this;
   *  the pass-1 prototype declared the same prop and never bound it. */
  busy?: boolean;
}>();

const emit = defineEmits<{
  (e: "snap", index: number): void;
  (e: "select", id: string): void;
  (e: "cancel"): void;
  /** THE SECOND VERB (T4-P1 F4): deal THIS game a fresh board at THESE staged settings — the
   *  fused transaction. `select` stays exactly what it was (visit: restore what was there). */
  (
    e: "deal",
    payload: { id: string; size: number | string; difficulty: number | string },
  ): void;
  /** THE LIVE CENTER FACE (Wave C2): the current-game centered card's live-face mount element
   *  (or null when it stops being live). Relayed straight from the card; App teleports the ONE
   *  board's subtree into it. A DOM element crosses up — pencil imports nothing from games. */
  (e: "live-face", el: HTMLElement | null): void;
}>();

const reducedMotion = usePrefersReducedMotion();

const count = computed(() => props.cards.length);
const clamp = (i: number) => Math.max(0, Math.min(count.value - 1, i));

// The internal notion of "centered". Initialized from the prop; user navigation drives it
// and emits `@snap` back to the state machine (the prop then echoes the same value — a no-op
// through the reconciling watch below, so there is no feedback loop).
const activeIndex = ref(clamp(props.snappedIndex));

// The mid-game guard: the index of the card whose leave/keep ribbon is armed (null = none).
const guardIndex = ref<number | null>(null);
// WHICH VERB the ribbon is confirming (T4-P1 F4). ONE ribbon, two intents: `select` is Wave D's
// switch verbatim, `deal` routes the picker's destructive verb through the SAME confirmation
// instead of minting a second idiom. A deal on a board with work used to announce only the new
// board and abandon the old marks silently; now the ribbon speaks first, always.
const guardIntent = ref<"select" | "deal">("select");
const guardEl = ref<HTMLElement | null>(null);
function dismissGuard() {
  guardIndex.value = null;
}
/** THE ONE NAME (T5-W3 §3.2, the loop's guard-names row). This string is the ribbon's drawn
 *  heading, its `aria-label`, and the stem of its spoken utterance — one literal, so the ink
 *  and the announcement cannot drift. They had: the note drew "deal over this puzzle?" while
 *  AT was told "Deal a new board?", two names for one act. */
const guardTitle = computed(() =>
  guardIntent.value === "deal" ? "deal over this puzzle?" : "leave this puzzle?",
);
/** The destructive verb's own word — drawn on the button, spoken in the utterance. */
const guardVerb = computed(() => (guardIntent.value === "deal" ? "deal" : "leave"));
/** The armed card, for the ribbon copy (rendered as an overlay centered on the deck — the
 *  chosen card IS the centered one, so it reads as "from the chosen card"). */
const guardCard = computed(() =>
  guardIndex.value != null ? props.cards[guardIndex.value] : null,
);
/** WHOSE marks the ribbon is about. `select` always risks the board on screen. A `deal` can
 *  risk TWO different boards — the target's saved work (what it writes over) and the mounted
 *  board's live work (what it walks away from) — and pass 3 shipped one sub-line, inherited
 *  from the select intent, for all of them. It says which now, because on the deal intent
 *  "your marks" is frequently not the board being dealt. */
const guardSub = computed(() => {
  const card = guardCard.value;
  if (!card) return "your marks aren't saved";
  const theirs =
    guardIntent.value === "deal" &&
    card.id !== props.currentId &&
    props.saved?.[card.id]?.userMoves === true;
  const yours = props.dirty === true && props.currentId != null;
  if (theirs && yours) return "neither board's marks are saved";
  return theirs ? `${card.name}'s marks aren't saved` : "your marks aren't saved";
});

// THE ONE beat enrolment — driven into the centered card only (see the soul-gate note).
// heldFrameCount (P1-W3): the answer-key laminate's boil hold was NEVER TOTAL — only
// HandDrawnGrid and BoilDivider wrapped their counts, so every other beat surface kept
// breathing under a hold that was supposed to still the page. `heldFrameCount` collapses the
// count to 1 during a hold and `useBeatFrame`'s `total <= 1` path freezes IN PLACE (no snap to
// pose 0); release returns the real count and the boil resumes mid-cadence. Contract repair,
// not perf.
const centerPose = useBeatFrame(
  heldFrameCount(() => BOIL_CONFIG.frameCount),
  () => beatsFor(BOIL_CONFIG.intervalMs),
);
function poseFor(i: number): number {
  return i === activeIndex.value ? centerPose.value : 0;
}

// ── THE LIVE CENTER FACE index (Wave C2) ──
// The current game's card is `live` (its face IS the board) only when it is ALSO the centered
// card — so on open the marks show at center, and navigating to a different game reverts it to
// its poster (only ONE live board; a flank is always a poster). `currentId` absent → no live.
//
// PRM: no projection. Reduced motion collapses the whole entry to a same-frame cut (no fold, no
// deal); the live board never travels into the deck, so the deck stays a static poster grid —
// Wave B's PRM behaviour exactly (and no in-board animation is ever parented under the gallery).
const liveIndex = computed(() =>
  props.currentId != null ? props.cards.findIndex((c) => c.id === props.currentId) : -1,
);
function isLive(i: number): boolean {
  return !reducedMotion.value && i === liveIndex.value && i === activeIndex.value;
}

// ── THE DEAL (Wave C2 §BEAT 2) ──
// On an interactive entry the flanks draw IN onto the desk — one-shot sequence subscribers
// (DRAW_IN_PRESETS.gridFrame), staggered OUTWARD from center, backwards fill: `dealReveal[i]`
// 0→1 (GameCard maps it to opacity + a small lift). The center card folds in (the board FLIP),
// so it never deals (stays 1). Finite + self-removing — zero steady-state cost (the soul gate).
const dealReveal = reactive<number[]>([]);
// Seed in setup so the FIRST paint already has the flanks hidden when dealing (no flash): a
// flank starts at 0, everything else (center, deep-link, PRM) at 1 (settled).
{
  const center0 = clamp(props.snappedIndex);
  const dealing = !!props.animateEntry && !reducedMotion.value;
  for (let i = 0; i < props.cards.length; i++)
    dealReveal[i] = dealing && i !== center0 ? 0 : 1;
}
let dealHandles: SequenceHandle[] = [];
function stopDeal() {
  for (const h of dealHandles) {
    h.stop();
  }
  dealHandles = [];
}
function startDeal() {
  stopDeal();
  const center = activeIndex.value;
  for (let i = 0; i < props.cards.length; i++) dealReveal[i] = i === center ? 1 : 0;
  if (reducedMotion.value) {
    for (let i = 0; i < props.cards.length; i++) dealReveal[i] = 1; // PRM: settled, no motion
    return;
  }
  const base = Math.round(MOTION.boardFoldMs * 0.42); // after the fold has begun
  const stagger = 90; // outward-from-center step
  props.cards.forEach((_, i) => {
    if (i === center) return;
    const dist = Math.abs(i - center);
    const h = createSequenceSubscription({
      durationMs: DRAW_IN_PRESETS.gridFrame.duration,
      delayMs: base + (dist - 1) * stagger,
      easing: easeOutCubic,
      onProgress: (eased) => {
        dealReveal[i] = eased;
      },
      onComplete: () => {
        dealReveal[i] = 1;
      },
    });
    h.start();
    dealHandles.push(h);
  });
}
onUnmounted(stopDeal);

// ── The polite live region ──
const liveText = ref("");
function announce(i: number) {
  const card = props.cards[i];
  if (!card) return;
  // The band's whole content swaps with the snap, so the announcement carries it: the card's
  // position, the staged pair, and what is waiting there. One live region for the deck AND its
  // order slip — a second would talk over this one.
  liveText.value = `${card.name}, ${i + 1} of ${count.value}. ${stagedLine(card)}`;
}
/** The staged pair + board state for a card, in words. */
function stagedLine(card: GalleryCard): string {
  const pair = picks[card.id];
  const saved = props.saved?.[card.id];
  const size = pair?.size ?? saved?.size ?? card.staging.size.default;
  const diff = pair?.difficulty ?? saved?.difficulty ?? card.staging.difficulty.default;
  const state = !saved?.board
    ? "new game"
    : saved.userMoves
      ? "in progress"
      : "board dealt";
  return `${labelOf(card.staging.size.options, size)} ${labelOf(
    card.staging.difficulty.options,
    diff,
  ).toLowerCase()}, ${state}`;
}
function announceStaged() {
  const card = activeCard.value;
  if (card) liveText.value = stagedLine(card);
}

// ── The guard's assertive region (T5-W3 §3.2) ──
// The SECOND region, and the only warrant for one: `liveText` is polite by design (the deck's
// snap chatter must never interrupt), and a prompt about losing work queued behind that chatter
// is the old silence one beat later. This one is `role="alert"` — assertive, atomic — and it is
// PERSISTENT: it stays mounted and empty so that arming is a text CHANGE inside a region the AT
// is already watching, which is the only announcement browsers reliably make. Retiring the
// ribbon empties it, so nothing stale can be re-read off the page.
const guardAlert = ref("");

// ── The glide (glass-curve FLIP for keyboard/button; native snap for touch) ──
const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const glide = useCarouselGlide(viewport, track, {
  reducedMotion: () => reducedMotion.value,
  onSnap: (i) => syncFromScroll(i),
});

/** Programmatic move (keyboard / button): update state, glide the track, announce. Any move
 *  dismisses an armed guard ribbon (the user changed their mind about the switch). */
function go(i: number) {
  const next = clamp(i);
  if (next === activeIndex.value) return;
  dismissGuard();
  activeIndex.value = next;
  glide.glideTo(next);
  emit("snap", next);
  announce(next);
}
function step(delta: number) {
  go(activeIndex.value + delta);
}

/** A native (touch/trackpad) snap already moved the track — sync state, do not re-glide. */
function syncFromScroll(i: number) {
  const next = clamp(i);
  if (next === activeIndex.value) return;
  dismissGuard();
  activeIndex.value = next;
  emit("snap", next);
  announce(next);
}

// ── Select + the mid-game guard gate (Wave D §4) ──
/** Attempt to select the CENTERED card. A dirty + DIFFERENT switch arms the ribbon instead of
 *  emitting; a pristine or same-game switch emits straight through. */
function attemptSelect() {
  const card = props.cards[activeIndex.value];
  if (!card) return;
  if (props.dirty && props.currentId != null && card.id !== props.currentId) {
    guardIntent.value = "select";
    guardIndex.value = activeIndex.value; // arm the ribbon on the chosen card
    return;
  }
  emit("select", card.id);
}

// ── THE STAGING BAND's state (T4-P1 F4) ──
// The picked pair per card, held HERE (the band is a renderer). Unpicked cards fall back to the
// cross-game ledger — what that game was actually left at — and only then to the registry
// default, so the chips are never a fiction. Seeding is READ-ONLY (a computed that mutates
// nothing), so no render-time write, no feedback loop.
const picks = reactive<
  Record<string, { size: number | string; difficulty: number | string }>
>({});
const activeCard = computed(() => props.cards[activeIndex.value] ?? null);
const activeSaved = computed(() =>
  activeCard.value ? (props.saved?.[activeCard.value.id] ?? null) : null,
);
const activePick = computed(() => {
  const card = activeCard.value;
  if (!card) return null;
  const picked = picks[card.id];
  const saved = activeSaved.value;
  return {
    size: picked?.size ?? saved?.size ?? card.staging.size.default,
    difficulty:
      picked?.difficulty ?? saved?.difficulty ?? card.staging.difficulty.default,
  };
});

/** THE SAFE VERB reports the state it acts on: a board is `resume`d, a game with none is
 *  `start`ed. `start` is the branch that HONOURS the staged pair — with nothing to restore,
 *  the only truthful "safe" act is dealing the board the chips describe. */
const safeVerb = computed<"resume" | "start">(() =>
  activeSaved.value?.board ? "resume" : "start",
);

/** The staged pair diverges from the saved board's. `resume` cannot restore a 4×4 easy board
 *  the chips are asking for, so the divergence is PRINTED on the verb before the click and the
 *  chips snap to the saved pair on it — the pass-2 defect was that neither happened and the
 *  pair was silently dropped. */
const savedPairLabels = computed(() => {
  const card = activeCard.value;
  const saved = activeSaved.value;
  const pair = activePick.value;
  if (!card || !saved?.board || !pair) return null;
  if (saved.size === pair.size && saved.difficulty === pair.difficulty) return null;
  return `${labelOf(card.staging.size.options, saved.size)} ${labelOf(
    card.staging.difficulty.options,
    saved.difficulty,
  ).toLowerCase()}`;
});

function labelOf(
  options: readonly { value: number | string; label: string }[],
  value: number | string,
): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

/** A card whose ledger row holds a board reports it on its own sub-line — the flanks carry the
 *  truth too, so the deck answers "where did I leave off?" without a select. `in progress` is
 *  reserved for a board with USER MOVES on it; a dealt, untouched board says so. */
function sublineFor(card: GalleryCard): string | undefined {
  const s = props.saved?.[card.id];
  if (!s?.board) return undefined;
  const state = s.userMoves ? "in progress" : "dealt";
  return `${labelOf(card.staging.size.options, s.size)} ${labelOf(
    card.staging.difficulty.options,
    s.difficulty,
  ).toLowerCase()} · ${state}`;
}

function onPick(axis: "size" | "difficulty", value: number | string) {
  const card = activeCard.value;
  const pair = activePick.value;
  if (!card || !pair) return;
  picks[card.id] = { ...pair, [axis]: value };
  announceStaged();
}

/** THE SAFE VERB's act. `start` deals the staged pair (there is no board to lose). `resume`
 *  restores the saved board — and SNAPS the chips onto it, so the pair the user is left
 *  looking at is the pair they are actually getting. */
function onSafeVerb() {
  const card = activeCard.value;
  if (!card || props.busy || guardIndex.value !== null) return;
  if (safeVerb.value === "start") {
    attemptDeal();
    return;
  }
  const saved = activeSaved.value;
  if (saved) picks[card.id] = { size: saved.size, difficulty: saved.difficulty };
  attemptSelect();
}

/** THE DEAL VERB. Destructive where there is work to destroy — and a deal can destroy work in
 *  TWO places, which is the pass-3 hole this closes. Pass 2 read `props.dirty` alone (the
 *  MOUNTED board), so dealing a DIFFERENT game consulted the wrong ledger entirely and could
 *  wipe a saved board it never asked about, one `d` keystroke deep. Pass 3 fixed that arm and
 *  dropped the other one: a cross-game deal from a dirty board ABANDONED the marks on screen
 *  with no ribbon at all — the identical loss `attemptSelect` has guarded since Wave D, on the
 *  verb one keystroke away. Both arms, always:
 *    · the TARGET's saved work — what the deal writes over;
 *    · the MOUNTED board's live work — what the deal walks away from, same game or not.
 *  The second arm subsumes the pass-3 same-id fallback (`dirty && card.id === currentId`): a
 *  dirty mounted board is at risk from every deal the picker can issue, so the id comparison
 *  the fallback made was the whole defect. */
function attemptDeal() {
  const card = activeCard.value;
  const pair = activePick.value;
  if (!card || !pair || props.busy || guardIndex.value !== null) return;
  const target = props.saved?.[card.id];
  const destroysWork =
    (target?.board === true && target.userMoves) ||
    (props.dirty === true && props.currentId != null);
  if (destroysWork) {
    guardIntent.value = "deal";
    guardIndex.value = activeIndex.value;
    return;
  }
  emit("deal", { id: card.id, ...pair });
}

/** The ribbon's confirm — it resolves whichever verb armed it. */
function guardLeave() {
  const i = guardIndex.value;
  const intent = guardIntent.value;
  guardIndex.value = null;
  const card = i != null ? props.cards[i] : null;
  if (!card) return;
  if (intent === "deal") {
    const pair = activePick.value;
    if (pair) emit("deal", { id: card.id, ...pair });
    return;
  }
  emit("select", card.id);
}

/* ── THE GALLERY'S KEY MAP (T8 M7a) — one key, one owner ──────────────────────────────────
 *
 *   ← → ↑ ↓   step the deck one card          listbox   dismisses an armed ribbon, then moves
 *   Home End  first / last card               listbox   same
 *   Enter ␣   choose the CENTERED card        listbox   armed ribbon → confirms its verb
 *   d         deal the centered card's slip   listbox   bare only; routed through the ribbon
 *   Tab       cycle the ribbon's two verbs    ribbon    armed only — `aria-modal`'s containment
 *   Esc       THE ONE WAY BACK                WINDOW    armed ribbon → dismiss it (keep) and
 *                                                       stop there; otherwise cancel the deck
 *                                                       and unfold to the board you came from
 *
 * ESC IS DOCUMENT-SCOPED, and that is the whole of the mark. Every other key above belongs to
 * the listbox and is bound on the viewport, which is right for them: they are the listbox's
 * navigation and they should only fire while the listbox has focus. Escape is not navigation —
 * it is the way OUT, and a way out that works only from one element is not a way out. Bound on
 * the viewport it was inert the moment focus went anywhere else, which on this screen is most
 * of the time: MEASURED at 1280×900, Esc was dead after a click on the staging band's chips,
 * after a click on its verbs, after a click on a pip, and after a click on bare page — four of
 * six ordinary states, silently, with the deck still up and the board still underneath it.
 *
 * So the deck owns Escape for as long as the deck is mounted, from the window, and NOTHING else
 * in this file answers that key: the listbox's switch below has no Escape case, and the ribbon's
 * handler delegates to it, so there is exactly one place the precedence (ribbon, then deck) is
 * written down. `defaultPrevented` is honoured, so a future control that genuinely claims Escape
 * inside the deck keeps it. */
function onWindowEscape(e: KeyboardEvent) {
  if (e.key !== "Escape" || e.defaultPrevented) return;
  e.preventDefault();
  // ONE PRESS, ONE LEVEL. The ribbon is `aria-modal` and it is the thing in front of you, so it
  // is what an Escape cancels — the deck stays, exactly as `keep` leaves it. A second press then
  // leaves the deck.
  if (guardIndex.value !== null) {
    dismissGuard();
    return;
  }
  emit("cancel"); // the wordmark fold's inverse: unfold the board back out of the centered card
}
onMounted(() => window.addEventListener("keydown", onWindowEscape));
onUnmounted(() => window.removeEventListener("keydown", onWindowEscape));

function onKeydown(e: KeyboardEvent) {
  // While the guard ribbon is up, the listbox keys resolve IT: Enter/Space confirms Leave.
  // Escape is the window handler's above — the one owner. Arrows fall through to `step`, which
  // dismisses + navigates.
  if (guardIndex.value !== null) {
    switch (e.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        e.preventDefault();
        guardLeave();
        return;
    }
  }
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      step(1);
      return;
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      step(-1);
      return;
    case "Home":
      e.preventDefault();
      go(0);
      return;
    case "End":
      e.preventDefault();
      go(count.value - 1);
      return;
    case "Enter":
    case " ":
    case "Spacebar":
      e.preventDefault();
      attemptSelect();
      return;
    case "d":
    case "D":
      // The deal verb from the keyboard, for a listbox user whose focus never leaves the
      // viewport. It routes through `attemptDeal`, so it is guarded by the SAME ribbon a tap
      // is — a bare `d` can never destroy a board without the confirmation. Advertised on the
      // listbox and on the band's own button as `aria-keyshortcuts`, never as rendered ink
      // (a printed "d" is a lie on touch). `g` (App) and `k` (the answer-key peek) are the
      // only other single-letter globals; `d` was free.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      attemptDeal();
      return;
  }
}

/** The armed ribbon's own keyboard. Focus lives INSIDE the dialog now, so the listbox's handler
 *  (bound on the viewport, a sibling) no longer sees these events — every key the armed state
 *  answered still has to be answered, from here. Two rules on top of delegation:
 *   · Tab is the containment. `aria-modal` promises the deck behind is out of reach; a Tab that
 *     walked out into it would make that a lie, so Tab cycles the ribbon's own verbs.
 *   · A focused BUTTON keeps its native activation. Delegating Enter/Space from a verb would
 *     fire the ribbon's confirm ALONGSIDE the button's click — "keep" resolving as "leave", the
 *     exact loss this ribbon exists to prevent. */
function onGuardKeydown(e: KeyboardEvent) {
  const stops = [...(guardEl.value?.querySelectorAll<HTMLElement>(".guard-btn") ?? [])];
  if (e.key === "Tab" && stops.length) {
    e.preventDefault();
    const at = stops.indexOf(document.activeElement as HTMLElement);
    const last = stops.length - 1;
    const next = e.shiftKey ? (at <= 0 ? last : at - 1) : at >= last ? 0 : at + 1;
    stops[next].focus();
    return;
  }
  const onVerb = (e.target as Element | null)?.closest?.(".guard-btn");
  if (onVerb && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) return;
  onKeydown(e);
}

// Arm → speak, and take focus. Retire → fall silent, and hand focus back to the listbox (only
// when the ribbon was holding it: a `keep` CLICK, or a touch snap through `syncFromScroll`, has
// already placed focus elsewhere and stealing it back would be its own defect). The watcher runs
// pre-patch, so the arming branch waits a tick for the ribbon to exist while the retiring branch
// can still read the focus it is about to destroy.
watch(guardIndex, (i, prev) => {
  if (i !== null) {
    guardAlert.value = `${guardTitle.value} ${guardSub.value}. Choose keep, or ${guardVerb.value}.`;
    nextTick(() => guardEl.value?.focus({ preventScroll: true }));
    return;
  }
  guardAlert.value = "";
  if (prev === null || !guardEl.value?.contains(document.activeElement)) return;
  nextTick(() => viewport.value?.focus({ preventScroll: true }));
});

// External index change (e.g. a fresh open sets snappedIndex to the current game) → jump.
watch(
  () => props.snappedIndex,
  (i) => {
    const next = clamp(i);
    if (next === activeIndex.value) return;
    dismissGuard();
    activeIndex.value = next;
    glide.jumpTo(next);
    announce(next);
  },
);

// A board becoming pristine under an armed ribbon (undo back to clean) retires the guard.
watch(
  () => props.dirty,
  (d) => {
    if (!d) dismissGuard();
  },
);

onMounted(async () => {
  activeIndex.value = clamp(props.snappedIndex);
  await nextTick();
  glide.jumpTo(activeIndex.value);
  // DOM focus on the track container (aria-activedescendant model — §10 keyboard contract).
  viewport.value?.focus({ preventScroll: true });
  announce(activeIndex.value);
  // BEAT 2 — the deal: flanks draw IN (interactive entry only; deep-link/PRM stay settled).
  if (props.animateEntry) startDeal();
});
</script>

<template>
  <div
    class="game-gallery"
    :class="{ 'is-coarse': coarse }"
    :style="{ '--card-step-ms': `${MOTION.cardStepMs}ms` }"
  >
    <div
      ref="viewport"
      class="gallery-viewport"
      role="listbox"
      aria-label="Choose a puzzle"
      aria-roledescription="carousel"
      tabindex="0"
      aria-keyshortcuts="d"
      :aria-activedescendant="`gallery-card-${activeIndex}`"
      @keydown="onKeydown"
    >
      <div ref="track" class="gallery-track">
        <div v-for="(card, i) in cards" :key="card.id" class="gallery-card-slot">
          <GameCard
            :card="card"
            :index="i"
            :count="count"
            :is-active="i === activeIndex"
            :pose="poseFor(i)"
            :guard="guardIndex === i"
            :live="isLive(i)"
            :deal-reveal="dealReveal[i]"
            :subline="sublineFor(card)"
            @select="attemptSelect"
            @warp="go(i)"
            @guard-keep="dismissGuard"
            @guard-leave="guardLeave"
            @face-mount="(el: HTMLElement | null) => emit('live-face', el)"
          />
        </div>
      </div>
    </div>

    <!-- Page pips: the sketchbook page-number, snapped one inked (decorative — the listbox
         already announces "N of M"; these are the visual/mobile position tell). -->
    <div class="gallery-pips" aria-hidden="true">
      <span
        v-for="(card, i) in cards"
        :key="`pip-${card.id}`"
        class="gallery-pip"
        :class="{ 'is-inked': i === activeIndex }"
      />
    </div>

    <!-- THE STAGING BAND (T4-P1 F4) — the order slip for the ACTIVE card. A SIBLING of the
         listbox, never a descendant of `role="option"`: the deck keeps its
         aria-activedescendant contract and one band serves five cards, so no flank ever mounts
         a control it will not paint. Bound to the active card; the box is reserved in CSS. -->
    <StagingBand
      v-if="activeCard && activePick"
      :name="activeCard.name"
      :staging="activeCard.staging"
      :size="activePick.size"
      :difficulty="activePick.difficulty"
      :safe-verb="safeVerb"
      :saved-pair="savedPairLabels"
      :busy="busy || guardIndex !== null"
      @pick="onPick"
      @safe="onSafeVerb"
      @deal="attemptDeal"
    />

    <!-- The mid-game guard ribbon (Wave D §4) — a pencil-note that SLIDES from the chosen
         (centered) card on a dirty+different switch. An overlay outside the scroll viewport
         (whose overflow would clip it), centered on the deck. NOT a modal, NOT confirm(): a
         light, dismissible note. Keep stays in the gallery; Leave abandons the marks + switches.
         T4-P1 F4: the SAME ribbon now also confirms the picker's deal verb — one idiom, its
         copy keyed to the intent, `.guard-keep`/`.guard-leave` unchanged as the act hooks. -->
    <Transition name="guard-ribbon">
      <div
        v-if="guardCard"
        ref="guardEl"
        class="gallery-guard"
        role="alertdialog"
        aria-modal="true"
        tabindex="-1"
        :aria-label="guardTitle"
        aria-describedby="gallery-guard-stake"
        @keydown="onGuardKeydown"
      >
        <HandDrawnOutline class="guard-note-frame" :stroke-width="3" :outset="4">
          <div class="guard-note cartoon-shadow-md edge-outlined bg-popover">
            <p class="guard-note-text">
              <span class="guard-note-title">{{ guardTitle }}</span
              ><br /><span id="gallery-guard-stake" class="guard-note-sub">{{
                guardSub
              }}</span>
            </p>
            <!-- THE VERBS TAKE THE DRAWN BOX (T8-W1 M4, agent A's wiring request). They wore a
                 2px CSS border on a 0.45rem radius — geometric chrome inside a note whose own
                 frame is drawn by `HandDrawnOutline`, which is this estate's one box grammar.
                 So they wear it too, at `:pose="0"`: one static path per frame, no beat
                 enrolled, no layer promoted, no filter minted (the poses carry the geometric
                 grain bake, so `filter-census` is untouched). The outline is
                 `pointer-events: none`, so the `<button>` is still the whole target — and the
                 `.guard-keep`/`.guard-leave` hooks the specs address are unmoved. -->
            <div class="guard-note-actions">
              <button
                type="button"
                class="guard-btn guard-keep"
                @click.stop="dismissGuard"
              >
                <HandDrawnOutline
                  :pose="0"
                  :stroke-width="2"
                  :outset="2"
                  class="guard-face"
                >
                  keep
                </HandDrawnOutline>
              </button>
              <button
                type="button"
                class="guard-btn guard-leave"
                @click.stop="guardLeave"
              >
                <HandDrawnOutline
                  :pose="0"
                  :stroke-width="2.5"
                  :outset="2"
                  class="guard-face"
                >
                  {{ guardVerb }}
                </HandDrawnOutline>
              </button>
            </div>
          </div>
        </HandDrawnOutline>
      </div>
    </Transition>

    <!-- Polite live region — announces the snapped card on every step/swipe. -->
    <div class="gallery-live" aria-live="polite" role="status">{{ liveText }}</div>

    <!-- The guard's assertive region — persistent and empty until work is at risk, so the
         arming is a change the AT is already watching for (see the note on `guardAlert`).
         Its OWN hook, never a second `.gallery-live`: three specs address the polite region by
         that class alone and a shared one turns each of them into a strict-mode violation. -->
    <div class="gallery-guard-live" role="alert">{{ guardAlert }}</div>
  </div>
</template>

<style scoped>
.game-gallery {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  /* --card-w: the slot width = the carousel geometry. Mobile 375 → ~78vw, leaving ~11%
     each side so a neighbor peeks (swipe discoverability); desktop clamps to a comfortable
     worksheet. The card fills this (GameCard `width:100%`). */
  --card-w: min(78vw, 22rem);
}

.gallery-viewport {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  /* Touch/trackpad inertia snaps to card centers (§6). Keyboard/button steps set scrollLeft
     under a WAAPI transform — CSS scroll-behavior can't take the glass curve, so it stays
     auto (instant), and the transform carries the curve. */
  scroll-snap-type: x mandatory;
  scroll-behavior: auto;
  /* The frame + shadow overflow the slot; give them air, not a clipped edge. */
  padding-block: 1.5rem;
  /* Hide the scrollbar — the pips are the position tell. */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gallery-viewport::-webkit-scrollbar {
  display: none;
}

/* The deck is a spread of paper you push (`useCarouselGlide`'s pointer drag). Fenced to a fine
   hovering pointer: touch already drags natively and has no cursor to say so. */
@media (hover: hover) and (pointer: fine) {
  .gallery-viewport {
    cursor: grab;
  }

  .gallery-viewport.is-dragging {
    cursor: grabbing;
    -webkit-user-select: none;
    user-select: none;
  }
}

.gallery-viewport:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent);
  outline-offset: -4px;
  border-radius: 0.5rem;
}

.gallery-track {
  display: flex;
  align-items: center;
  /* Size to content (spacers + slots), so the deck genuinely overflows the viewport and
     scrolls — a width:auto flex container clips its overflowing items instead of extending
     the scroll region. */
  min-width: max-content;
  /* The FLIP glide rides this element's transform; promote for the gesture. */
  will-change: transform;
}

/* Leading/trailing air so the first and last card can scroll to TRUE center. Spacer flex
   ITEMS (not track/viewport padding: percentage padding doesn't extend a scroll container's
   scrollWidth) with a FIXED px basis (`--edge`, computed in useCarouselGlide from the live
   viewport/slot widths — a % basis collapses to 0 under max-content sizing).
   `align-self: stretch` is LOAD-BEARING, not cosmetic (T4-P1 KENKEN-REACHABILITY). WebKit
   omits a ZERO-AREA box from a scroll container's scrollable overflow region, so a spacer
   with no cross size contributes nothing to `scrollWidth`: measured 2208 against Chromium's
   2656 at 1280 — exactly the trailing `--edge` of 448 px — which capped `maxScroll` 448 px
   short of centering the LAST card, and `targetScrollLeft`'s clamp (useCarouselGlide.ts) then
   stranded kenken out of reach by arrows, End, click and deep-link alike. A cross size makes
   the box non-degenerate and WebKit counts it; the trailing one is the one that matters, but
   both carry it so the rule reads once. Proven per-property against both engines — a real
   spacer ELEMENT does not fix this, and a zero-height one still fails. */
.gallery-track::before,
.gallery-track::after {
  content: "";
  flex: 0 0 var(--edge, 0px);
  align-self: stretch;
}

.gallery-card-slot {
  flex: 0 0 var(--card-w);
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
  /* Card breathing room inside the slot (not a track gap — a gap would eat the neighbor
     peek on mobile; slot padding keeps the slot-to-slot distance as the peek geometry). */
  padding-inline: 0.6rem;
}

/* ── THE FRAME ON THE CARD SET (T7-W7) ──────────────────────────────────────────────────
   The viewport IS the sketchbook frame — its ring is the rectangle the deck is read inside —
   and on the desk it spanned the whole page while holding ONE centred card. So the frame
   carried a void where its left third should have been cards (measured to the centred card's
   own ink: 778px at 1920, 538 at 1440, 458 at 1280 — 38–41% of the frame) and its right edge
   fell wherever the page ended, which was through the third card's face at every width.
   Both halves are the same missing declaration: the frame was never sized to what it frames.
   It is sized to a WHOLE NUMBER of slots here, so its edges can only land ON a slot boundary
   and no card can be bisected by one; and the number is THREE, the odd count, because the
   deck centres its active card — an even frame would cut the pair beside it in half. Three
   slots is also exactly what the deck's own leading air already reserves ((frame − slot) / 2
   = one slot), so the end poses read as the deck's beginning rather than as a gap, and the
   interior poses fill the frame end to end.
   The card only shrinks where three at 22rem will not fit — 1024, where the slot lands at
   325px — and the 3rem allowance is the page's own gutter plus room for a scrollbar, so the
   third slot can never be the one the cap clips. Below the desk this is untouched: the phone
   keeps its 78vw peek deck, which is a one-card frame by design. */
@media (min-width: 64rem) {
  .game-gallery {
    --card-w: min(22rem, calc((100vw - 3rem) / 3));
  }

  .gallery-viewport {
    width: calc(var(--card-w) * 3);
    max-width: 100%;
    margin-inline: auto;
  }
}

.gallery-pips {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gallery-pip {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  background: transparent;
  transition: background-color 200ms var(--ease-standard);
}

.gallery-pip.is-inked {
  background: var(--color-foreground);
  border-color: var(--color-foreground);
}

/* ── The mid-game guard ribbon (Wave D §4) — an overlay centered on the deck ── */
.gallery-guard {
  position: absolute;
  left: 50%;
  /* Just below the deck center — reads as emerging from the centered (chosen) card. */
  top: calc(50% + 3.5rem);
  transform: translateX(-50%);
  z-index: 40;
  width: min(20rem, 82%);
  pointer-events: auto;
}

/* T4-P1 F4 — the ribbon vs. the staging slip. Below 40rem the slip stacks (two chip rows over
   two verbs) and the deck-centred ribbon landed HALFWAY down its first row: half a control
   showing under a note that had already disabled it. Anchored to the slip's own box instead, so
   while the ribbon is up it stands IN the slip's place — which is what it means. Above 40rem
   the slip is a single row and the deck anchor already clears it. */
@media (max-width: 39.99rem) {
  .gallery-guard {
    top: auto;
    bottom: 0.6rem;
  }
}

/* The dialog container takes focus on arm (`tabindex="-1"`, never in the tab order). It is not
   an operable control and the ribbon IS its own visual announcement, so the UA ring is dropped:
   the two verbs inside keep their `:focus-visible` outlines, which is where a keyboard user's
   focus actually lands and where the ring has something to say. Also holds the pixels still —
   the ribbon's paint is asserted unchanged by W3's golden run. */
.gallery-guard:focus {
  outline: none;
}

.guard-note-frame {
  display: block;
  width: 100%;
}

.guard-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem 0.9rem;
  border-radius: 0.75rem;
  text-align: center;
}

.guard-note-text {
  margin: 0;
  font-family: var(--font-hand);
  font-size: var(--type-body, 1rem);
  line-height: 1.25;
  color: var(--color-foreground);
}

.guard-note-sub {
  color: var(--color-muted-foreground);
  font-size: 0.9em;
}

.guard-note-actions {
  display: flex;
  gap: 0.65rem;
}

/* The button is now a bare hit target: zero padding, no border, no ground. Everything the eye
   reads is the FACE inside it, and the box around the face is drawn (`.staging-btn`'s idiom
   verbatim — one grammar, two files). */
.guard-btn {
  display: inline-flex;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-foreground);
  font-family: var(--font-hand);
  font-size: var(--type-body, 1rem);
  line-height: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* The FACE is the box the outline draws around: its padding is the frame's air, and it is the
   node the hover ground paints, so the drawn stroke sits ON the ground rather than beside it. */
.guard-face {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.32rem 0.9rem;
  border-radius: 0.3rem;
  transition:
    background-color 150ms var(--ease-standard),
    color 150ms var(--ease-standard);
}

/* THE GROUND FORM (T8 M5, agent C's boil census — R2 in this fence). These are the two most
   consequential buttons the deck has and they answered a pointer with nothing at all, while
   every other boxed control in the estate grounds on hover: `.staging-btn .staging-face` a
   sibling file away, `.icon-btn` in the rail. Same declaration, on the same node, so the ribbon
   is not a third idiom. `(hover: hover)` only — a coarse pointer gets the press, never a stuck
   ground. */
@media (hover: hover) {
  .guard-btn:hover .guard-face {
    background: var(--color-accent);
    color: var(--color-foreground);
  }
}

@media (prefers-reduced-motion: reduce) {
  .guard-face {
    transition: none;
  }
}

/* The focus ring rides the FACE, so it traces the drawn box rather than a zero-padding button
   that is now smaller than the frame around it (`.staging-btn`'s own ruling). */
.guard-btn:focus-visible {
  outline: none;
}

.guard-btn:focus-visible .guard-face {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  outline-offset: 4px;
}

/* The destructive verb takes the heavier ink — the outline's own `stroke-width` above, which is
   the hand's way of saying weight — plus the 8% ground, exactly as `deal` wears it in the band.
   A reader who can see neither stroke weight nor colour still sees one verb marked and one
   bare. */
.guard-leave .guard-face {
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

@media (pointer: coarse) {
  .guard-face {
    min-height: 44px;
  }
}

/* The ribbon SLIDES in (a note pulled from the card) — a CSS transition on the Vue
   Transition, the app's card idiom (Wave B's depth transition), not a new animation brain. */
.guard-ribbon-enter-active,
.guard-ribbon-leave-active {
  transition:
    transform 240ms var(--ease-glassGlide),
    opacity 240ms var(--ease-glassGlide);
}

.guard-ribbon-enter-from,
.guard-ribbon-leave-to {
  transform: translate(-50%, -0.75rem);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  /* Same-frame appear under PRM (reachable, no slide). */
  .guard-ribbon-enter-active,
  .guard-ribbon-leave-active {
    transition: none;
  }
  .guard-ribbon-enter-from,
  .guard-ribbon-leave-to {
    transform: translateX(-50%);
  }
}

/* Visually-hidden live regions (the standard clip pattern) — announced, never painted. */
.gallery-live,
.gallery-guard-live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-pip {
    transition: none;
  }
}
</style>
