<script lang="ts">
/**
 * ControlSection — the per-game slot the control-shell renders. A game supplies 1..n of
 * these (size, difficulty, …); the shell owns the New-game staging, the hold-to-peek
 * divider, the live action + play-tool rows, and every `<style>`. The mobile tab-toggle
 * renders ONLY at n ≥ 2 (KISS: n-section-generic — a single-section game shows a plain
 * heading, never a dead tab). Divergence is DATA, never a config flag: the difficulty
 * heading's crayon tone is derived from the selected option's `colorClass` (present on
 * difficultyOptions, absent on the size options), so no boolean toggle names it.
 */
export interface ControlSection {
  /** tab identity, `expandedPanel` value, and OptionSelector `:key` stability */
  key: string;
  /**
   * The eyebrow's ONE string — drawn ink and accessible name at once.
   *
   * T5-W4 pass 7 (X6-G2, ruled from the chair after five passes): the estate's one-string law
   * (see the ZONE GRAMMAR header below, the `SheetWashiLabel` clause) EXTENDS to the drawer's
   * surviving eyebrows. There was an `ariaLabel?: string` here and three
   * `:aria-label="section.ariaLabel"` bindings under it — a second literal, optional, silent
   * when it drifted. It is DELETED rather than documented, because an optional second name is
   * a drift vector whether or not anyone has yet driven it: measured at the ruling, **no game
   * supplied one** (all ten sections across five specs pass `heading` alone), so the attribute
   * never rendered and the deletion moves no announced name at head.
   *
   * Casing is CSS and only CSS — `.section-heading { text-transform: lowercase }`
   * (`assets/typography.css`), so the eyebrow DRAWS "size" and both the DOM text and the
   * accessible name stay the authored "Size". A casing difference is never a second string.
   */
  heading: string;
  /** the OptionSelector options (value/label + the optional crayon colorClass) */
  options: { value: string | number; label: string; colorClass?: string }[];
  /** the currently-selected value */
  selected: string | number;
  /** write-back on select — the shell adds the underline boil on top (so a same-value
   *  re-tap still boils, exactly as the twins did) */
  onChange: (value: string | number) => void;
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, onBeforeUnmount, useId } from "vue";
import { useResizeObserver } from "@vueuse/core";
import SolveIcon from "@pencil/chrome/icons/SolveIcon.vue";
import FillForcedIcon from "@pencil/chrome/icons/FillForcedIcon.vue";
import DiceIcon from "@pencil/chrome/icons/DiceIcon.vue";
import EraserIcon from "@pencil/chrome/icons/EraserIcon.vue";
import ShareIcon from "@pencil/chrome/icons/ShareIcon.vue";
// T7-W7 — invite and share drew the same glyph in the same card. Share keeps the link graph;
// invite gets the table.
import InviteIcon from "@pencil/chrome/icons/InviteIcon.vue";
import UndoIcon from "@pencil/chrome/icons/UndoIcon.vue";
import RedoIcon from "@pencil/chrome/icons/RedoIcon.vue";
import HintIcon from "@pencil/chrome/icons/HintIcon.vue";
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import KeyboardLegend from "@pencil/chrome/KeyboardLegend.vue";
import BoilDivider from "@pencil/chrome/BoilDivider.vue";
import SheetWashiLabel from "@pencil/sheet/SheetWashiLabel.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import ScribbleLoader from "@pencil/chrome/ScribbleLoader.vue";
import DifficultyTally from "@games/shared/DifficultyTally.vue";
import type { TallyDescriptor } from "@games/shared/techniqueVoice";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import { useButtonAnimation } from "@games/shared/useButtonAnimation";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { portraitDock, useControlsDrawer } from "@games/shared/useControlsDrawer";
import { leaveSession, session } from "@games/shared/useSession";

// Underline boil: brief burst on selection change, then settle
const boilFrame = ref(0);
let boilTimer: ReturnType<typeof setTimeout> | null = null;

function triggerBoil() {
  if (boilTimer) clearTimeout(boilTimer);
  let frame = 1;
  boilFrame.value = frame;
  const tick = () => {
    frame++;
    if (frame >= 5) {
      boilFrame.value = 0;
      boilTimer = null;
      return;
    }
    boilFrame.value = frame;
    boilTimer = setTimeout(tick, 120);
  };
  boilTimer = setTimeout(tick, 120);
}

// T4-W10 idiom (§defineModel) — pencilMode/candidatesPinned are PLAIN relays (their child
// v-model collapses in the template). The per-game size/difficulty models stay in the thin
// game panels that supply the sections; `errorCheckMode` STAYS a manual prop+emit (§1a): its
// same-value re-emit re-arms the on-demand snapshot, which defineModel's hasChanged guard would
// swallow.
const pencilMode = defineModel<PencilMode>("pencilMode", { required: true });
const candidatesPinned = defineModel<boolean>("candidatesPinned", {
  required: true,
});

const props = defineProps<{
  // The 1..n game sections (size, difficulty, …). The shell renders the New-game zone,
  // the mobile tab-toggle (n ≥ 2 only), and the OptionSelectors from these.
  sections: ControlSection[];
  loading: boolean;
  // T4-WU/U3 — the board's dirty state (the composable's `isDirty` = undo-depth non-empty).
  // Gates the coarse two-tap: a DIRTY Deal / Clear arms first, a pristine board acts instantly.
  isDirty: boolean;
  mobile?: boolean;
  // T4-W8 ROW 2 — the error-check mode (off/on-demand/live). LEFT a manual prop+emit (§1a):
  // the on-demand re-arm rides its same-value re-emit.
  errorCheckMode: ErrorCheckMode;
  // T8-W1 M3 — `proactiveCheck` and `solved` left with `CheckStatus`. They existed for ONE
  // consumer, a status line under the teacher's chips whose five branches each restated the
  // chip already selected beside them ("not checking" under Off, "checking as you go" under
  // Live) or narrated a mechanism the control performs on a second tap. The owner named the
  // stale branch by name; the other four are the same sentence in other states, so the line
  // and the two bits that fed it go together. `useAssists` still owns the state; nothing about
  // WHEN the teacher marks changed — only the panel's habit of saying so twice.
  // T4-W3 share-truth: the parent's share act, handed as a callback rather than an emit so
  // the OUTCOME travels back — it resolves iff the clipboard copy actually landed.
  share: () => Promise<void>;
  // T6 mark 13 — the same act with a room on it: mint `?s=`, join, then copy the whole link.
  // Same callback shape for the same reason: the well confirms only on a real clipboard write.
  shareSession: () => Promise<void>;
  // T4-P1 mark 6 — the dealt board's measured tier. It used to hang under the board, where on
  // a phone it was 30px of permanent in-flow height between the work and the controls; it is
  // the DEAL'S RECEIPT, so it files with the deal. Optional: an ungraded game (the engine
  // never ran) hands nothing and the row renders the verb alone.
  gradeTally?: TallyDescriptor;
}>();

// T6 mark 5 — the crib folds behind the action bar's `i`. Session-transient by design: a
// reader opens it once, reads five rows, and closes it; nothing about the board changes.
// Opening at the card's old scroll-end grows content above the sticky bar and leaves the
// crib's head under it — the fold rides into the scrollport as it opens.
const keysOpen = ref(false);
function toggleKeys() {
  keysOpen.value = !keysOpen.value;
  if (keysOpen.value)
    void nextTick(() => {
      document
        .getElementById("keys-fold")
        ?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    });
}

const emit = defineEmits<{
  // T4-WU/U2 — the re-homed dice, the "Deal" commit: it lifts out of the live action row into
  // the staged New-game zone and commits the staged sections. Same button grammar (DiceIcon
  // `.icon-btn`), no new control; the WM input shape stays frozen.
  (e: "deal"): void;
  (e: "clear"): void;
  (e: "solve"): void;
  // T4-W8 — the fill-forced partial solve (W7's fillAllForced).
  (e: "fill-forced"): void;
  (e: "peek-start"): void;
  (e: "peek-end"): void;
  // T4-WM §2 — the touch surface for the play tools the desktop reaches by key (H, ⌘Z, ⇧⌘Z).
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint"): void;
  // T4-W8 ROW 2 — the error-check mode changed (LEFT a manual v-model seam, §1a).
  (e: "update:errorCheckMode", value: ErrorCheckMode): void;
}>();

// The mobile tab-toggle exists ONLY because a game has ≥2 sections (the size/difficulty tabs).
// A single-section game shows a plain heading + its selector — never a dead tab (the named risk).
const showTabs = computed(() => props.sections.length >= 2);

// Per-section derivations, DATA-driven (never a config flag):
//  • the difficulty heading writes in the selected option's crayon (colorClass present on
//    difficultyOptions, absent on the size options) → the tone is read, not toggled;
//  • the closed-tab value (UI-12) is the selected option's label.
function activeColorClass(section: ControlSection): string | undefined {
  return section.options.find((o) => o.value === section.selected)?.colorClass;
}
function headingClass(section: ControlSection): (string | Record<string, boolean>)[] {
  const cc = activeColorClass(section);
  return cc ? ["transition-colors", "duration-250", cc] : ["text-muted-foreground"];
}
// UI-12: the mobile tabs show only the active panel's options, so the inactive tab's current
// value is invisible while the other is open. Surface it small + graphite beneath the heading.
function valueLabel(section: ControlSection): string {
  return section.options.find((o) => o.value === section.selected)?.label ?? "";
}
function onSectionChange(section: ControlSection, val: string | number) {
  section.onChange(val);
  triggerBoil();
}

const expandedPanel = ref(props.sections[0]?.key ?? "");

// ── Hold-to-peek gesture on the BoilDivider (the hold surface, fe-composition
// §7b — the union diff held Solve, stale post-extraction). Press-and-hold ≥350ms
// → the answer-key laminate; a shorter press does nothing (the divider has no
// click action, so no click-suppression bookkeeping is needed). App.vue owns the
// peek state; this only reports the gesture. Keyboard peek rides App.vue's K/Esc.
//
// SLOP (F3 pass-1 blocker 3, cured here): a hold is a press that STAYS. This recognizer
// was `pointerdown` + a bare timer, and `pointerleave` was its only escape — which touch
// never fires, because the first `pointermove` gives the divider implicit pointer capture,
// so a finger that presses the band and travels 200px away still owns the event stream and
// still trips the timer at 350ms. A deliberate drag over this band therefore flashed the
// answer key. The cure is the recognizer's missing half, not an arbiter above it: a
// `pointermove` past PEEK_SLOP_PX cancels the pending hold and ends a live peek, so the
// band yields to any other gesture that begins on it — the arbitration F3's D7 asserted
// already existed and did not.
const PEEK_HOLD_MS = 350;
const PEEK_SLOP_PX = 10;
let peekTimer: ReturnType<typeof setTimeout> | null = null;
let peekOrigin: { x: number; y: number } | null = null;
const isPeeking = ref(false);

// T5-W4 pass 6 — THE PEEK COMES OUT OF THE SHEET, and this is why. On the portrait dock the
// divider rides INSIDE the raised case, so a held peek would lay the answer key over a board
// the sheet has just covered: the affordance survives as a gesture and dies as a function.
// So the peek joins the play verbs in the fold, carrying THIS recognizer — the same 350ms and
// the same 10px slop, read off the same two constants, both consumers in this one file, no new
// composable and no second set of numbers to drift. On the dock the divider's hold surface
// stands down (`pointer-events: none`, washi hidden, CSS below) and its label drops the hold
// promise, because an affordance that cannot work must not be announced as one.
function onDividerHoldStart(e?: PointerEvent) {
  if (peekTimer) clearTimeout(peekTimer);
  peekOrigin = e ? { x: e.clientX, y: e.clientY } : null;
  peekTimer = setTimeout(() => {
    peekTimer = null;
    isPeeking.value = true;
    emit("peek-start");
  }, PEEK_HOLD_MS);
}

function onDividerHoldMove(e: PointerEvent) {
  if (!peekOrigin) return;
  if (Math.hypot(e.clientX - peekOrigin.x, e.clientY - peekOrigin.y) <= PEEK_SLOP_PX)
    return;
  onDividerHoldEnd();
}

function onDividerHoldEnd() {
  peekOrigin = null;
  if (peekTimer) {
    clearTimeout(peekTimer);
    peekTimer = null;
  }
  if (isPeeking.value) {
    isPeeking.value = false;
    emit("peek-end");
  }
}

onBeforeUnmount(() => {
  if (peekTimer) clearTimeout(peekTimer);
  if (isPeeking.value) emit("peek-end");
  shareAct.stop();
  inviteAct.stop();
  if (clearArmTimer) clearTimeout(clearArmTimer);
  if (dealArmTimer) clearTimeout(dealArmTimer);
});

// ── The copy acts (W6; T4-W3 share-truth) ──────────────────────────────
// A copy either landed or it did not, and the button says which: confirm ("copied!") ONLY on
// resolve; on reject (insecure context, permission-policy denial, absent Clipboard API) the
// link is still live in the address bar — so say exactly that. The washi, the sublabel and
// the aria-label all track the REAL outcome, never the optimistic flip the old unconditional
// `shareConfirm = true` asserted over a possibly-empty clipboard.
//
// T6 mark 13 — written ONCE and called TWICE. The players well copies the same link with a
// room on it, and a second hand-rolled copy of this state machine is how the failure sentence
// — the one that matters most, and the one nobody exercises by accident — drifts out of true.
function copyAct(
  act: () => Promise<void>,
  idle: { sublabel: string; washi: string; aria: string },
) {
  const { animating, trigger } = useButtonAnimation(500);
  const state = ref<"idle" | "copied" | "failed">("idle");
  let timer: ReturnType<typeof setTimeout> | null = null;
  async function press() {
    trigger();
    let copied = true;
    try {
      await act();
    } catch {
      copied = false;
    }
    state.value = copied ? "copied" : "failed";
    if (timer) clearTimeout(timer);
    // The failure line runs longer — it points the reader to the address bar, more to read.
    timer = setTimeout(
      () => {
        state.value = "idle";
      },
      copied ? 1600 : 3600,
    );
  }
  const says = (copied: string, failed: string, quiet: string) =>
    computed(() =>
      state.value === "copied" ? copied : state.value === "failed" ? failed : quiet,
    );
  return {
    animating,
    press,
    stop: () => {
      if (timer) clearTimeout(timer);
    },
    aria: says(
      "Link copied",
      "couldn't copy. the link is in the address bar",
      idle.aria,
    ),
    sublabel: says("copied!", "in address bar", idle.sublabel),
    washi: says("copied!", "couldn't copy. the link is in the address bar", idle.washi),
  };
}

const shareAct = copyAct(() => props.share(), {
  sublabel: "Share",
  washi: "copy a link to this board",
  aria: "Share board link",
});
const inviteAct = copyAct(() => props.shareSession(), {
  sublabel: "Play",
  washi: "invite someone to write on this board with you",
  aria: "Play together on this board",
});

// ── T4-P1 · THE ZONE GRAMMAR ────────────────────────────────────────────────────────
// The card was seven near-identical stanzas under six `.section-heading` display eyebrows —
// New game / Size / Difficulty / Marks / Check / Candidates — every one of them at the same
// rank, three of them naming standing PREFERENCES as loudly as the verb that deals a board.
// That flat rank is the owner's "contrived."
//
// SIX EYEBROWS BECOME TWO, and nothing is merely deleted: Size and Difficulty keep the eyebrow
// register (they caption the staged inputs and they earn it), and the rest are named the way a
// pencil case names its compartments — a strip of tape across a drawn frame, in the hand, lower
// case, one rank down. The taxonomy is re-cut on the way, which is the design claim rather than
// the move: candidates ARE pencil marks (the engine's, beside yours), so they file under
// `pencils`; grading your work is `checking`. That leaves `checking` holding exactly one idea,
// which is why its row needs no caption of its own.
//
// T8-W6 M16 — THE THIRD TAPE WAS `teacher's`, AND A TEACHER IS A METAPHOR. It named a
// compartment holding one control, whose three chips choose WHEN mistakes get marked, by
// invoking a person who is not in the room; the possessive made it a place belonging to her.
// `checking` is the same compartment said plainly, and it is what the reader is actually
// choosing. The RED PENCIL stays what it is — a drawing style, not a sentence — so nothing
// about how a mistake looks is touched here.
//
// Each well is a `HandDrawnOutline :pose="0"` — 1.5px inside a card drawn at 3px, subordinate
// by weight so three wells never read as three cards, frozen at setup so it enrols no beat (a
// pencil case doesn't breathe; the sheet does) and, since the pose prune, mints one node and
// promotes nothing. Its name is a `SheetWashiLabel anchor="tag"` that IS the well's accessible
// name via `aria-labelledby`: the visible tape and the announced name are one string, so
// nothing is duplicated and nothing can drift.
//
// Ids are per-instance (`useId`): a game mounts the mobile card OR the desktop rail (P1-W4's
// twin `v-if`), but the ids must be unambiguous either way.
const newGameId = useId();
const pencilsId = useId();
const checkingId = useId();
const playersId = useId();
// T7-W2 Q-4 — the well's DESCRIPTION, not a second name. The zone hint already says the one
// thing the tag "players" cannot ("share this board and everyone writes on the same grid"), and
// it said it to sighted eyes only. `aria-describedby` at a directly-referenced node reads it
// whatever its hidden state (accname §4.1 step 2A), so the tape stays exactly the tape it is.
const playersHintId = useId();
// `pencils` holds two controls, so each row is its own `role="group"` named by that row's OWN
// visible caption — otherwise assistive tech hears two unlabelled Off/On pairs inside one name
// and cannot tell which is which. `checking` holds one, so the tape names it directly.
const marksId = useId();
const candidatesId = useId();

// Absorbed from the two deleted shells (`PencilModeToggle.vue`, `AssistSettings.vue`): three
// segmented rows whose whole content was an option list, a heading and a relay. The heading is
// tape now and the relay is one line, so the shells had nothing left to be.
const MODE_OPTIONS: { value: PencilMode; label: string }[] = [
  { value: "off", label: "Normal" },
  { value: "corner", label: "Corner" },
  { value: "center", label: "Center" },
];
const CHECK_OPTIONS: { value: ErrorCheckMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "on-demand", label: "Ask" },
  { value: "live", label: "Live" },
];
const CANDIDATE_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
];

const { animating: solveAnimating, trigger: triggerSolve } = useButtonAnimation(500);
const { animating: fillAnimating, trigger: triggerFill } = useButtonAnimation(500);
const { animating: dealAnimating, trigger: triggerDeal } = useButtonAnimation(500);
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400);

// T4-WU/U3 — the conditional confirm, generalized from the shipped Clear two-tap to Deal and
// dirty-gated. On a coarse pointer a DIRTY board (undo-depth non-empty) arms first — the sublabel
// asks "sure?" in the teacher's rose, the aria-label swaps, a 2.5s lapse re-arms — and a second tap
// within the window deals; a PRISTINE board deals instantly (no nag by construction). Fine pointers
// keep the one-click Deal + the board's Cmd/Ctrl+Z backstop (coarse-only, per the Clear precedent —
// a ratify-me default, no fine-pointer variant). Same grammar/timer/aria swap as onClear below; the
// two verbs share `isCoarse` + `props.isDirty`. Deal moved OUT of the live action row (U2), so the
// confirm is prevention and the undo spine is recovery — the owner's "conditional," belt + suspenders.
const isCoarse = useCoarsePointer();
const dealArmed = ref(false);
let dealArmTimer: ReturnType<typeof setTimeout> | null = null;
function onDeal() {
  if (isCoarse.value && props.isDirty && !dealArmed.value) {
    dealArmed.value = true;
    dealArmTimer = setTimeout(() => {
      dealArmed.value = false;
    }, 2500);
    return;
  }
  if (dealArmTimer) {
    clearTimeout(dealArmTimer);
    dealArmTimer = null;
  }
  dealArmed.value = false;
  triggerDeal();
  emit("deal");
}

// T4-W8 — fill-forced (W7's fillAllForced): the icon marks draw themselves in on the press
// (the fill/draw-in echo), and the game inks the forced cells through the board's reveal wave.
function onFillForced() {
  triggerFill();
  emit("fill-forced");
}

// UI-5 confirm beat on Clear (recorded design call): Clear wipes the board — a `board` entry now,
// so undo restores it (U1), but still a jarring wipe. On coarse pointers, where stray taps are
// routine, the act takes two taps: the first arms (the sublabel asks "sure?" in the hand, rose),
// the second within 2.5s clears; the window lapsing disarms quietly. T4-WU/U3 — DIRTY-GATED: the
// arm now requires `props.isDirty` (born-RED at base: Clear armed unconditionally, even on a blank
// board — the same undo-depth gate that arms Deal fixes it), so a pristine board clears instantly.
// Fine pointers keep the one-click Clear — the confirm rides the same transient-label grammar as
// the share "copied!" flip, no dialog machinery.
const clearArmed = ref(false);
let clearArmTimer: ReturnType<typeof setTimeout> | null = null;
function onClear() {
  if (isCoarse.value && props.isDirty && !clearArmed.value) {
    clearArmed.value = true;
    clearArmTimer = setTimeout(() => {
      clearArmed.value = false;
    }, 2500);
    return;
  }
  if (clearArmTimer) {
    clearTimeout(clearArmTimer);
    clearArmTimer = null;
  }
  clearArmed.value = false;
  triggerClear();
  emit("clear");
}

function onSolve() {
  triggerSolve();
  emit("solve");
}

// T4-WM §2 — the play tools. Plain relays: the :active press-scale gives the tap its
// feedback (no bespoke animation needed), and the game owns the actual undo/redo/hint act.
function onUndo() {
  emit("undo");
}
function onRedo() {
  emit("redo");
}
function onHint() {
  emit("hint");
}

// ── T7-W2 A1 — THE SCROLLPORT CLEARS ITS OWN STICKY BAR ──────────────────────────────────
// Tabbing into the card reached controls the sticky `.action-bar` painted over end to end (the
// marks-mode "Normal", 25/25 sample points at 1440×900). Nothing scrolled and the browser was
// not wrong: the button's box (751–789) is ALREADY inside the scrollport's client box
// (189–829) — the bar (744–809) simply paints on top of it where it sits. `scroll-padding-bottom`
// is the one property that models that: it shrinks the region focus-scroll aims at, so a control
// under the bar gets lifted clear of it.
//
// THE NUMBER IS THE BAR'S OWN BOX, never a constant. Two terms, both measured:
//   · the bar's BORDER-box height — `getBoundingClientRect`, not `contentRect`, because the bar
//     carries `padding-block` and a content-box read is precisely the blindness that went stale
//     on T6.2's deleted `--fold-bottom`;
//   · the card's own `padding-bottom` — `bottom: 0` pins the stuck bar to the scrollport's
//     PADDING edge, so that gap is part of the band the bar owns (ceil(65.16) + 20 = 86px at head).
// Republished whenever the bar's box changes; the card is where it lands, since the card is the
// scrollport (`scene.css` reads `--action-bar-h` there).
//
// ── T7-W7 — THE SECOND TERM IS NOW SPENT TWICE, AND THE SUM IS UNCHANGED ─────────────────
// W2 derived that pad because the band the bar OWNS runs to the padding edge even though the
// bar's own box stops short of it. W7 makes that band opaque (the bar's skirt — see
// `.action-bar::after` in the style block), so the same padding is now also what the skirt is
// tall. One measurement, two readers: `--action-bar-h` (W2's, arithmetic and formula untouched)
// and `--card-pad-b` (W7's, the skirt's height).
//
// MEASURED, NOT SPELLED, for the same reason W2's is: the card's padding is a utility class on
// someone else's template (`GameScene.vue` — `p-5` on the rail, `px-2 py-1.5` on the dock), so a
// number written here would go stale the first time that class is re-cut, silently, and in the
// one direction that reopens this row.
const actionBarEl = ref<HTMLElement | null>(null);

useResizeObserver(actionBarEl, () => {
  const bar = actionBarEl.value;
  const card = bar?.closest<HTMLElement>(".controls-card");
  if (!bar || !card) return;
  const pad = parseFloat(getComputedStyle(card).paddingBottom) || 0;
  card.style.setProperty("--card-pad-b", `${pad}px`);
  card.style.setProperty(
    "--action-bar-h",
    `${Math.ceil(bar.getBoundingClientRect().height + pad)}px`,
  );
});

// ── T7-W2 A2 — THE COVERED RIBBON GOES INERT ─────────────────────────────────────────────
// On the portrait dock the sheet rises OVER the fold's ribbon, and its own option row painted
// all four play verbs out end to end (25/25 each, both engines) while every one of them stayed
// in the tab order and in the AX tree. The estate already owns this mechanism — `GameCard.vue`'s
// `:inert="!isActive || undefined"` freezes the gallery's flanks — so the ribbon borrows it
// verbatim, `undefined` and all, and the attribute is ABSENT at rest rather than present-and-
// false (measured on both engines: closed `inert` attr false, open true).
//
// The gate is `drawerInert`, the drawer's own parked flag, rather than `drawerOpen`: the sheet
// covers the ribbon through the OPENING and CLOSING glides too, and a half-covered control is
// the same defect measured mid-flight. Dock-only — in the row regime these verbs sit inside the
// card the drawer carries, where an inert row would be a coarse iPad's undo button, deleted.
// The drawer's tongue is a SIBLING in the ribbon, never a child of this row, so closing the
// sheet still lands focus on a live control.
const { drawerInert } = useControlsDrawer();
const ribbonCovered = computed(() => portraitDock.value && !drawerInert.value);
</script>

<template>
  <!--
    ONE TREE, BOTH REGIMES (T5-W4c · the T′ collapse, pass-1 `f2-proto/MANIFEST.md` §5
    deviation T′, cashed).
    This file shipped a FULL mobile tree and a FULL desktop tree — the same six blocks written
    twice, drifting apart every time a hand touched one of them (the divider's `my-2` lived in
    exactly one copy until stage BC found it). The branches are gone. `mobile` now drives the
    four things that actually differ, and nothing else:
      1. the wrap's own layout class,
      2. `OptionSelector :mobile`,
      3. the hover grammar — `group relative` + the `SheetWashiLabel` children (a hover washi
         is meaningless on a coarse pointer, and the sublabels already speak there: UI-5),
      4. `zone-row-stacked` (the rail is a narrow column, so its captions sit OVER the
         selectors) and the fine-pointer `KeyboardLegend`.
    The ONE seam it cannot close is the staged block: the mobile tab-toggle is a different
    control with a different reveal (`v-show` on the active panel) from the rail's stacked
    stanzas, so collapsing it would move a box. It stays a declared branch, priced at 20 lines,
    below.
    RENDER IDENTITY IS THE SAFETY PROPERTY, AND IT IS MEASURED, NOT CLAIMED: the normalized
    element tree + every rect, both arms, both engines —
    `evidence/design-loop/pass5/f3/rig/domsnap.mjs`, banked in `logs/tprime-identity.log`.
    It does NOT move the page: the collapse is a source quantity, the stack is a layout
    quantity, and pass 5 measured the difference (§ the F3 dossier, trigger (b)).
  -->
  <div
    class="control-panel-wrap"
    :class="
      mobile
        ? 'mobile-control-panel mt-3'
        : 'flex flex-col items-center md:items-stretch'
    "
  >
    <!-- STAGED "New game" zone (T4-WU/U2) — the game sections are the provisional inputs to the
         NEXT board; the re-homed Deal is the verb that commits them. role="group" labelled by the
         New-game heading makes the staging legible to assistive tech (one new semantic, no live
         region). Selectors read provisional BY PLACEMENT and wipe nothing (arm-not-live). -->
    <HandDrawnOutline
      class="tray-well new-game-zone"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="newGameId"
    >
      <SheetWashiLabel :id="newGameId" text="new game" :seed="13" anchor="tag" />
      <!-- T8-W6 M16 — THIS ZONE'S HINT IS DELETED. It read "these settings wait here — the
           board only changes when you deal": the banned character, a personified contrivance
           ("settings wait"), and a sentence whose whole content is a narration of what the
           Deal button beside it does. The compartment is named, the verb is named, and the
           chips are provisional by placement — which is the arrangement that says it. -->
      <div class="control-panel-filtered">
        <!-- The mobile tab-toggle — renders ONLY at n ≥ 2 sections (each tab is a section head;
             a single-section game shows a plain heading below instead of a dead tab). It STAYS:
             it is the card's largest single height saving on a phone, and spending it is what
             put pass 1's coarse gate 7px underwater. Deleting a component is not the same as
             deleting its work. The rail has no tabs — it has the room. -->
        <div v-if="mobile && showTabs" class="mobile-heading-row">
          <!-- a11y r1 M9: this was `<button><h2>`. `<button>`'s content model is phrasing
               content, so the heading was invalid nesting whose parse is engine-dependent, and
               a reader walking by H-key landed INSIDE an interactive control. The APG
               disclosure shape is the inverse — heading WRAPS button — and the wrapper is
               `display: contents` (`.mobile-heading-head`), so the button stays the flex item
               `.mobile-heading-row` lays out and not one pixel moves. Heading navigation keeps
               its stop; it now lands on the heading, whose next keystroke is unambiguous. -->
          <h2
            v-for="section in sections"
            :key="section.key"
            class="mobile-heading-head"
          >
            <button
              class="mobile-heading-btn"
              :aria-expanded="expandedPanel === section.key"
              @click="expandedPanel = section.key"
            >
              <span
                class="section-heading"
                :class="[
                  headingClass(section),
                  { 'is-active': expandedPanel === section.key },
                ]"
              >
                {{ section.heading }}
              </span>
              <!-- UI-12: the current value, shown only while this tab is closed. -->
              <span v-if="expandedPanel !== section.key" class="heading-value">{{
                valueLabel(section)
              }}</span>
            </button>
          </h2>
        </div>

        <!-- THE ONE DECLARED SEAM (see the header). The phone reveals ONE section at a time
             behind the tabs above; the rail stacks every section, each in its own `.staged-section`
             (whose `+` margin is the air the deleted `<hr>` used to buy). Two different reveals
             over the same data — a `v-show` and a wrapper box — so one tree here would have to
             invent a box on the phone that has never been there. -->
        <template v-for="section in sections" :key="section.key">
          <div
            v-if="!mobile"
            class="staged-section flex flex-col items-center gap-1 md:items-stretch"
          >
            <h2 class="section-heading" :class="headingClass(section)">
              {{ section.heading }}
            </h2>
            <OptionSelector
              :options="section.options"
              :selected="section.selected"
              :boil-frame="boilFrame"
              @change="onSectionChange(section, $event)"
            />
          </div>
          <template v-else>
            <!-- Single-section (n = 1): a plain heading above its selector, never a tab. -->
            <h2 v-if="!showTabs" class="section-heading" :class="headingClass(section)">
              {{ section.heading }}
            </h2>
            <OptionSelector
              v-show="!showTabs || expandedPanel === section.key"
              :options="section.options"
              :selected="section.selected"
              :boil-frame="boilFrame"
              mobile
              @change="onSectionChange(section, $event)"
            />
          </template>
        </template>
      </div>

      <!-- The Deal commit — the DiceIcon re-homed from the action row (no new control, the WM
           input shape stays frozen). Its name shows always (the primary verb of the staged zone
           earns its label), so "next game" reads with zero copy.
           T6 mark 12: the washi is no longer that same word said twice. Every verb's hover tape
           now EXPLICATES — the sublabel names the act, the tape says what the act does — which
           is the whole of what "the controls are not explicated" asked for. -->
      <div class="deal-row">
        <button
          @click="onDeal()"
          :disabled="loading"
          class="icon-btn deal-btn"
          :class="{ 'group relative': !mobile }"
          :aria-label="
            dealArmed ? 'Press again to deal a new board' : 'Deal a new board'
          "
        >
          <DiceIcon :size="36" :playing="dealAnimating" />
          <span
            class="icon-sublabel"
            :class="{ 'is-armed': dealArmed }"
            aria-hidden="true"
            >{{ dealArmed ? "sure?" : "Deal" }}</span
          >
          <!-- T8-W1 M3 — the hover tape is PRUNED. "deal a new board with the settings above"
               is the button's own sublabel plus the contents of the compartment it stands in,
               and the well's tape already says the settings wait for this press. The verb keeps
               its name; the compartment keeps its one explication. -->
        </button>
        <!-- The receipt (mark 6): what the LAST deal actually produced, beside the verb that
             will replace it. The chips above are the ask; this is the answer. One home at
             every width — the sheet's own rule. -->
        <DifficultyTally v-if="gradeTally" :descriptor="gradeTally" label="dealt" />
      </div>
    </HandDrawnOutline>

    <!-- Zone separator = the hold-to-peek BoilDivider (existing grammar): staged zone above,
         live zone below. Spatial prophylaxis — Deal is a full divider away from the play tools,
         so a mid-game fat-finger never lands a board wipe. UI-4: the washi is PERSISTENT on
         coarse pointers and pinned to the divider's own box; the surface pads to a ≥44px target
         (CSS). Narrow fine-pointer windows keep the hover/focus reveal. UI-9: anchored to the
         divider's OWN box, so the chip sits ON the ruled line.
         NO `my-2` (T4-P1, stage BC): the wells on both sides already carry `margin-block: 0.5rem`,
         priced at the frame-daylight floor, and the divider is not a drawn frame — its own margin
         only doubled theirs (8+8 above and below, for a 14px rule). The phone never carried it and
         read correctly; the branches agreed at BC, and there is now only one of them to agree. -->
    <div
      class="peek-hold-surface group relative"
      :class="{ 'is-stood-down': portraitDock }"
      role="separator"
      :aria-label="
        portraitDock
          ? 'New game settings above, play tools below'
          : 'New game settings above, play tools below. Press and hold, or press K, to see the answer key'
      "
      @pointerdown="onDividerHoldStart($event)"
      @pointermove="onDividerHoldMove($event)"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <!-- The washi is the hold's own promise, so it leaves with the hold. The RULE stays: the
           divider is still the zone separator, and that is the office `role="separator"` and
           the one-string label above describe on the dock. -->
      <SheetWashiLabel
        v-if="!portraitDock"
        text="hold to peek"
        :seed="53"
        anchor="center"
        persistent
      />
    </div>

    <!-- LIVE zone — two named compartments where three identical stanzas used to stack. The
         rail is a narrow column, so THERE each row's caption sits over its selector
         (`zone-row-stacked`); the phone has the width to put it beside. -->
    <HandDrawnOutline
      class="tray-well"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="pencilsId"
    >
      <!-- T8-W1 M3 — the compartment's own hint is PRUNED. It read "how your marks are written
           — and whether the solver shows its candidates", which is the two row captions
           directly under it (`marks`, `candidates`) said again in a longer sentence. The rows
           keep their own hints, which explain what the chips mean; only the enumeration went. -->
      <SheetWashiLabel :id="pencilsId" text="pencils" :seed="29" anchor="tag" />
      <div
        class="zone-row"
        :class="{ 'zone-row-stacked': !mobile }"
        role="group"
        :aria-labelledby="marksId"
      >
        <span :id="marksId" class="zone-row-label">marks</span>
        <SheetWashiLabel
          class="zone-hint"
          text="normal writes a digit. corner and center write small pencil marks"
          :seed="31"
          wide
        />
        <OptionSelector
          :options="MODE_OPTIONS"
          :selected="pencilMode"
          :boil-frame="0"
          :mobile="mobile"
          @change="pencilMode = $event as PencilMode"
        />
      </div>
      <div
        class="zone-row"
        :class="{ 'zone-row-stacked': !mobile }"
        role="group"
        :aria-labelledby="candidatesId"
      >
        <span :id="candidatesId" class="zone-row-label">candidates</span>
        <SheetWashiLabel
          class="zone-hint"
          text="show every digit that still fits in a cell"
          :seed="41"
          wide
        />
        <OptionSelector
          :options="CANDIDATE_OPTIONS"
          :selected="candidatesPinned ? 'on' : 'off'"
          :boil-frame="0"
          :mobile="mobile"
          @change="candidatesPinned = $event === 'on'"
        />
      </div>
    </HandDrawnOutline>

    <HandDrawnOutline
      class="tray-well"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="checkingId"
    >
      <SheetWashiLabel :id="checkingId" text="checking" :seed="59" anchor="tag" />
      <SheetWashiLabel
        class="zone-hint"
        text="when your mistakes get checked"
        :seed="47"
        wide
      />
      <!-- One idea in the compartment, so the tape is the whole of its name — no row caption
           to duplicate it. (The status line that used to sit under these chips died at W1-M3;
           every branch of it restated the chip beside it.) -->
      <OptionSelector
        :options="CHECK_OPTIONS"
        :selected="errorCheckMode"
        :boil-frame="0"
        :mobile="mobile"
        @change="emit('update:errorCheckMode', $event as ErrorCheckMode)"
      />
    </HandDrawnOutline>

    <!-- T6 mark 13 — THE PLAYERS COMPARTMENT. A fourth well on the zone grammar exactly as
         written (`:pose="0"` outline + a tag washi that IS its accessible name), so it appears
         in the desktop rail AND inside the portrait drawer with no second implementation. It
         holds one idea, so like `checking` it needs no row caption.
         Alone: one verb. In a session: who is here, in the colour their digits are written in.
         The trust model is stated rather than implied — the link IS the whole capability, so
         the well says so where the link is made. -->
    <HandDrawnOutline
      class="tray-well"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="playersId"
      :aria-describedby="playersHintId"
    >
      <SheetWashiLabel :id="playersId" text="players" :seed="67" anchor="tag" />
      <!-- T7-W2 Q-4 (deferred from T6) — the hint is the well's DESCRIPTION now. One string,
           still the same tape: the tag names the compartment, this says what sharing it does,
           and a reader gets both instead of the name alone. -->
      <SheetWashiLabel
        :id="playersHintId"
        class="zone-hint"
        text="share this board and everyone writes on the same grid"
        :seed="61"
        wide
      />
      <button
        v-if="!session.roomId.value"
        @click="inviteAct.press()"
        :disabled="loading"
        class="icon-btn"
        :class="{ 'group relative': !mobile }"
        :aria-label="inviteAct.aria.value"
      >
        <InviteIcon :size="26" :class="{ 'share-pop': inviteAct.animating.value }" />
        <span class="icon-sublabel" aria-hidden="true">{{
          inviteAct.sublabel.value
        }}</span>
        <SheetWashiLabel v-if="!mobile" :text="inviteAct.washi.value" :seed="73" wide />
      </button>
      <template v-else>
        <!-- T6.1 — THE TABLE SAYS SO WHEN IT ISN'T UP YET. Between pressing the verb and
             being on the wire there was nothing to see, and on the abrogated public relays
             that nothing lasted 47–66 seconds. One line holds that gap, and it is a
             `polite` live region so the resolution is spoken once rather than drawn only. -->
        <p v-if="!session.live.value" class="players-status" aria-live="polite">
          connecting…
        </p>
        <template v-else>
          <!-- The roster scrolls rather than stretches: sixteen rows must not make the card
               sixteen rows taller, and the card is already the page's one scrollport.

               T7-W2 A3 — IT SPEAKS. A joiner took the roster 1→2 and a leaver 2→1 with nothing
               announced anywhere: no `aria-live`, no `role`, no live-region ancestor, and the
               one polite region that would have spoken (`players-status`) is `v-if`'d OUT the
               moment the room comes up — the live region left the DOM exactly when people
               started arriving. So the announcing region is the ROSTER itself, which is the
               node that actually mutates and the node that lives as long as the room does.
               `role="log"` because a log is precisely "entries added over time" and reads its
               additions rather than re-reciting the list; `polite` because arriving is news, not
               an interruption. Its `aria-label` is its own, not the well's — the well is named
               "players" and a reader hearing that twice learns nothing the second time.

               T7-W2 A4 — AND IT IS REACHABLE. `max-height` + `overflow-y: auto` past ~5 rows
               made the remainder mouse-and-touch-scroll only (WCAG 2.1.1) against an owner's
               order of 16+ players. `tabindex="0"` makes the scrollport a stop the arrow keys
               can scroll, which is the pairing `role="log"` wants anyway: a log you can hear
               added to but never read back is half a cure. -->
          <ul
            class="players-roster"
            role="log"
            aria-live="polite"
            aria-label="who's on this board"
            tabindex="0"
          >
            <li v-for="p in session.players.value" :key="p.id" class="player-row">
              <span class="player-swatch" :style="p.ink" aria-hidden="true"></span>
              <span class="player-name">{{ p.slug }}</span>
              <span v-if="p.self" class="player-self">you</span>
            </li>
          </ul>
          <!-- T8-W1 M3 — the note under the roster is PRUNED. "anyone with this link can write
               on this board" is the well's own description ("share this board and everyone
               writes on the same grid") said a second time, in the one state where the reader
               has already acted on it. The description stays; it is the well's `aria-describedby`
               and it is there before the share, which is when the statement does its work. -->
        </template>
        <!-- Leave stays through BOTH states: a room that never answers must still be one you
             can walk away from. -->
        <button type="button" class="players-leave" @click="leaveSession()">
          leave
        </button>
      </template>
    </HandDrawnOutline>

    <!-- T6 mark 5 — THE CRIB FOLDS, AND IT NEVER LEAVES THE FLOW. `grid-template-rows: 0fr→1fr`
         collapses the fold to nothing while the `<dl>` inside keeps its own box: it stays in the
         AX tree (a11y 3.4 reads `.keyboard-legend` for k/g/h/p/d and reds on display:none), its
         text stays readable to both engines' text walkers (the `clip-path` note in the style
         block — WebKit's `innerText` honours clipping and `overflow: hidden` blanked it), and —
         the load-bearing half — its 2-column max-content still sizes the rail. The card is
         shrink-to-fit at ≥1024; a `v-show`, a `<details>` or an absolute popover here drops that
         contribution, narrows the card ~48px, and walks the centered board ~24px into the
         `cell-light` golden. Measured at head: card 330 / boardLeft 191, and both must hold. -->
    <div
      v-if="!mobile"
      id="keys-fold"
      class="legend-fold"
      :class="{ 'is-open': keysOpen }"
    >
      <div><KeyboardLegend /></div>
    </div>

    <!-- Action buttons — hover washi for fine pointers, persistent sublabels on coarse
         (UI-5: the washi is a hover grammar, so sighted touch users got no text; an iPad in the
         row regime reaches this layout with no hover either). Deal re-homed OUT of this row
         into the staged zone above (spatial prophylaxis).
         T6 mark 5: the row is a BAR now — it sticks to the bottom of the card's scrollport, so
         clear / fill / solve / share are reachable from anywhere in a 1039px-tall card, and the
         `i` at its trailing edge is the only thing between the reader and the shortcuts. -->
    <!-- T7-W2 A1 — the bar publishes its own height to the scrollport it sticks to (see the
         `--action-bar-h` publisher above); `scene.css` spends it as `scroll-padding-bottom`. -->
    <div ref="actionBarEl" class="action-bar">
      <div class="action-verbs">
        <button
          @click="onClear()"
          :disabled="loading"
          class="icon-btn"
          :class="{ 'group relative': !mobile }"
          :aria-label="
            clearArmed ? 'Press again to clear the board' : 'Clear the board'
          "
        >
          <span :class="{ 'eraser-scrub': clearAnimating }">
            <EraserIcon :size="28" />
          </span>
          <span
            class="icon-sublabel"
            :class="{ 'is-armed': clearArmed }"
            aria-hidden="true"
            >{{ clearArmed ? "sure?" : "Clear" }}</span
          >
          <SheetWashiLabel
            v-if="!mobile"
            text="wipe every digit you've written"
            :seed="23"
            wide
          />
        </button>
        <button
          @click="onFillForced()"
          :disabled="loading"
          class="icon-btn"
          :class="{ 'group relative': !mobile }"
          aria-label="Fill in every cell that has only one possible number"
        >
          <FillForcedIcon :size="26" :playing="fillAnimating" />
          <span class="icon-sublabel" aria-hidden="true">Fill</span>
          <SheetWashiLabel
            v-if="!mobile"
            text="fill the cells that have only one digit left"
            :seed="43"
            wide
          />
        </button>
        <button
          @click="onSolve()"
          :disabled="loading"
          class="icon-btn"
          :class="{ 'group relative': !mobile }"
          aria-label="Solve puzzle"
        >
          <ScribbleLoader
            v-if="loading && !solveAnimating"
            :size="22"
            class="text-muted-foreground"
          />
          <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
          <span class="icon-sublabel" aria-hidden="true">Solve</span>
          <SheetWashiLabel
            v-if="!mobile"
            text="the solver finishes the board"
            :seed="37"
            wide
          />
        </button>
        <button
          @click="shareAct.press()"
          :disabled="loading"
          class="icon-btn"
          :class="{ 'group relative': !mobile }"
          :aria-label="shareAct.aria.value"
        >
          <ShareIcon :size="26" :class="{ 'share-pop': shareAct.animating.value }" />
          <span class="icon-sublabel" aria-hidden="true">{{
            shareAct.sublabel.value
          }}</span>
          <SheetWashiLabel
            v-if="!mobile"
            :text="shareAct.washi.value"
            :seed="71"
            wide
          />
        </button>
      </div>
      <!-- The keys live behind ONE glyph, and its name is never "keyboard shortcuts": the
           `<dl>` above already carries that name, and a11y 3.4 requires exactly one node to
           answer to it. Fine-pointer only (CSS) — the legend it opens is itself fine-only, so
           a coarse iPad rail would otherwise get a toggle for a crib it can never see. -->
      <button
        v-if="!mobile"
        type="button"
        class="info-btn"
        aria-label="what the keys do"
        :aria-expanded="keysOpen"
        aria-controls="keys-fold"
        @click="toggleKeys"
      >
        <span class="info-glyph" aria-hidden="true">i</span>
      </button>
    </div>

    <!-- Play tools (T4-WM §2) — the coarse touch surface for undo / redo / hint, the acts a fine
         pointer reaches by ⌘Z / ⇧⌘Z / H. Coarse-only (CSS gate), so a fine desktop shows the
         legend below (a keyboard is implied) and a coarse iPad in the row regime gets the
         tappable row instead. The two are mutually exclusive by pointer media, not by branch. -->
    <!-- T5-W4 pass 6 — ON THE PORTRAIT DOCK THESE VERBS LEAVE THE CARD AND STAY ON SCREEN.
         The sheet holds every BETWEEN-MOVES act (deal, size, difficulty, marks, candidates,
         teacher's, clear/fill/solve/share); these four are the acts of PLAYING, so playing must
         never need the sheet. They teleport into the scene's `#fold-tools` berth, in flow,
         under the board's reserved line.

         `defer` IS LOAD-BEARING and it was found by a red, not by reading: the berth is minted
         later in `GameScene`'s own template, so without `defer` the target resolves null before
         scene insertion and the play tools leave the tree entirely (`present: false`, measured;
         six unit rows red). `:disabled` outside the dock keeps the shipped seating byte-exact
         on the desk and on landscape — a disabled Teleport renders in place, which is a no-op.
    -->
    <!-- T7-W2 A2 — `inert` while the risen sheet covers this row (`ribbonCovered` above): a
         control painted out end to end must not stay in the tab order or in the AX tree. -->
    <Teleport defer to="#fold-tools" :disabled="!portraitDock">
      <div class="play-controls" :inert="ribbonCovered || undefined">
        <button
          @click="onUndo()"
          :disabled="loading"
          class="icon-btn"
          aria-label="Undo last move"
        >
          <UndoIcon :size="26" />
          <span class="icon-sublabel" aria-hidden="true">Undo</span>
        </button>
        <button
          @click="onRedo()"
          :disabled="loading"
          class="icon-btn"
          aria-label="Redo move"
        >
          <RedoIcon :size="26" />
          <span class="icon-sublabel" aria-hidden="true">Redo</span>
        </button>
        <button
          @click="onHint()"
          :disabled="loading"
          class="icon-btn"
          aria-label="Reveal a hint in the selected cell"
        >
          <HintIcon :size="26" />
          <span class="icon-sublabel" aria-hidden="true">Hint</span>
        </button>
        <!-- THE PEEK CHIP (pass 6, graft G2) — the divider's affordance, rehomed where it can
             still do its work. Coarse-only like its three siblings (a finger has no K key; K
             itself is untouched, App.vue owns it and W3.4 gates it). Its visible word IS its
             accessible name — one string, not a label and a name that can drift apart — and
             the glyphs stay lowercase latin inside the Patrick Hand cut (the BC5-G3 lesson).
             It enrolls in no beat and adds no live filter. -->
        <button
          v-if="portraitDock"
          class="icon-btn peek-chip"
          type="button"
          :disabled="loading"
          @pointerdown="onDividerHoldStart($event)"
          @pointermove="onDividerHoldMove($event)"
          @pointerup="onDividerHoldEnd()"
          @pointerleave="onDividerHoldEnd()"
          @pointercancel="onDividerHoldEnd()"
        >
          <span class="peek-chip-word">peek</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.control-panel-wrap {
  font-family: var(--font-display);
  font-optical-sizing: auto;
}

/* THE PANEL FILTER IS RETIRED (P1-W3, G2.4 ruled **C**). `url(#stroke-light)` / `-dark` was a
   3× feTurbulence @ numOctaves 4 + 3× feDisplacementMap + 2× feBlend chain over a ~320×700 CSS
   panel, on an HTML box — WebKit's SOFTWARE filter path (r2 cause 3: +12.3 fps on deal when it
   goes). It re-executed on any repaint of the subtree, which `.section-heading:hover` caused by
   changing its own filter INPUT, twice per hover round-trip. The panel's frame roughening never
   came from here anyway — HandDrawnOutline bakes that grain into geometry at SSIM 0.996/0.993 —
   so what left is a roughened edge on headings and control borders. The owner's ruling: gone.
   `will-change: transform` left with it: it existed to give THIS filter its own layer (the W5
   repair), and a promoted layer with nothing to promote is residency for free.
   Reversal is one CSS block, and the ballot page persists for re-audition.
   The class itself STAYS as the structural grouping hook the templates and
   e2e/visual-regression.spec.ts address; it simply carries no paint of its own now. */
.control-panel-filtered {
  display: block;
}

/* ── T4-P1 · the compartment well ────────────────────────────────────────────────
   A drawn box at 1.5px inside a card drawn at 3px: subordinate by weight, so three wells never
   read as three cards. `:pose="0"` freezes the frame at setup — it enrols no beat and, since
   the pose prune, promotes no layer — so the compartments are still while the sheet around
   them boils.
   The chrome is PRICED, not chosen: at 0.75rem of margin and 0.55rem of padding the three
   wells cost 122px and the coarse card went UP 9px — a compartment grammar that charges more
   than the six eyebrows it deletes is not a saving, it is a redecoration. The figures below
   are the measured floor at which the box still reads as a box. */
.tray-well {
  /* padding-top clears the tape, which STRADDLES the frame: the tag's box starts at the
     container's top edge and lifts 52% of its own height, so ~8.2px hangs inside. At 0.4rem
     the rail's first row caption sat under the tape. */
  padding: 0.55rem 0.5rem 0.35rem;
  /* margin ≥ outset + that 8.2px overhang, or consecutive wells' drawn frames cross — they
     did, at outset 7 / margin 0.35rem, and the teacher's tape landed on the pencils well's
     bottom stroke. 8px against a 4px outset leaves 3.8px of daylight. */
  margin-block: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.tray-well:first-child {
  margin-top: 0.35rem;
}

/* The tape rides ABOVE the drawn stroke it straddles (the outline svg is z-index 1). */
.tray-well :deep(.washi-tag) {
  z-index: 2;
}

.new-game-zone {
  gap: 0;
}

/* T6 mark 3 — the air the deleted `<hr>` was buying is now air AND a rule. Size and difficulty
   read as one undifferentiated stack of six chips; a hairline between them is what says they
   are two questions. `--ink-press-rule` already draws the crib's keycap borders in this same
   card, so the stroke is the card's own, not a new one. Rail-only by construction: the phone
   shows one section at a time behind its tabs, so the adjacent-sibling never matches there.
   A BoilDivider here is refused — it mounts four live `url(#grain-static)` poses and takes the
   filter census 9 → 13 in both regimes. */
.staged-section + .staged-section {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1.5px solid var(--ink-press-rule);
}

/* A row inside a compartment: the control's own quiet name beside it (over it, on the narrow
   rail). Not a heading — a caption in the hand, one pressure step under the tape, which is how
   a second control in one compartment gets named without the compartment growing a second
   eyebrow.
   The caption is a fixed COLUMN, not a centred inline: with the whole row centred, two rows of
   different content width put their captions at two different x and the compartment reads
   accidental. Right-aligned in its own column, both captions end on one edge and both control
   groups centre on one axis — measured 3.75rem clears `candidates` at every width this branch
   mounts at (48.8px at 390, 54px at 1023, against 60). */
.zone-row {
  position: relative; /* the containing block for this row's own hint tape */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ── T6 mark 4 · the hint tapes ────────────────────────────────────────────────
   A compartment's tape names it; a second tape, one hover away, says what it does. The
   component is untouched: a DEFAULT-anchor `SheetWashiLabel` is already an `aria-hidden`
   decorative tape with a hover reveal, so five sibling tapes buy the explication with zero
   new markup grammar — invisible to zone-grammar's NAME_SELECTOR and to the permanent-tape
   census, which is what keeps three tapes three.
   The tape it hangs off has to be hoverable first: `.washi-label` ships `pointer-events: none`
   (it is a tooltip that must not eat its own button's clicks) and a name you cannot point at
   cannot reveal anything. */
.tray-well .washi-tag,
.zone-row-label {
  pointer-events: auto;
  cursor: help;
}

/* Hangs UNDER its tape, not over it: the card is a scrollport, and the default `bottom: 100%`
   puts the first well's note above the card's own top edge, where it is clipped away. */
.tray-well .zone-hint {
  top: 1.1rem;
  left: 0.85rem;
  bottom: auto;
  margin-bottom: 0;
  transform: rotate(var(--washi-tilt));
  transform-origin: left top;
}

/* `> .zone-hint` on the well, not a descendant: tabbing into the pencils compartment reveals
   the COMPARTMENT's note, never all three of its tapes at once.

   `:has(:focus-visible)` rather than `:focus-within`, and it is a measured distinction, not a
   pedantic one: `useControlsDrawer` moves focus to the card's first control at open-settle, so
   under `:focus-within` every TAP that opened the phone's sheet laid the new-game note across
   the size and difficulty eyebrows with no gesture available to dismiss it. Probed both
   engines: the drawer's programmatic focus is `:focus-within` true / `:focus-visible` FALSE,
   and a real Tab walk is true in both. The keyboard reveal survives on every pointer; the
   phantom one on touch does not. */
.washi-tag:hover + .zone-hint,
.zone-row-label:hover + .zone-hint,
.tray-well:has(:focus-visible) > .zone-hint {
  opacity: 1;
}

.zone-row-label {
  flex: 0 0 3.75rem;
  text-align: right;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1.1;
  letter-spacing: var(--type-tracking-wide);
  /* The quiet rung (Lane D ship 4's ledgered token): 68% graphite, 5.23:1 light / 6.06:1
     dark on --color-card. Below it (60% = 4.10:1) the caption fails AA. */
  color: var(--ink-press-quiet);
}

.zone-row :deep(.options-row) {
  flex: 1 1 auto;
}

/* The rail is one narrow column: the caption sits over its control instead of beside it. */
.zone-row-stacked {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.zone-row-stacked .zone-row-label {
  flex: 0 0 auto;
  text-align: left;
}

/* ── T6 mark 13 · the players compartment ──────────────────────────────────────
   The roster SCROLLS. The owner's order is 16+ players within reason, and sixteen rows at
   ~20px would add ~320px to a card that already overflows its frame at 1039px — the well
   would push the action bar's whole scrollport out of reach. `max-height` + `overflow-y` is
   the card's own idiom one level down: five rows read at a glance, the rest are a short
   scroll, and the card's height stops depending on how many people turned up. */
.players-roster {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  max-height: 7.5rem;
  overflow-y: auto;
  margin: 0.15rem 0 0;
  padding: 0;
  list-style: none;
}

.player-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1.35;
  color: var(--color-foreground);
}

/* The swatch is the digit's own ink, not a legend for it: `--color-user-ink` is what the
   handwritten glyph strokes with, so a row inherits the peer's inline rebinding and YOUR row
   — which rebinds nothing — draws the incumbent blue. One value, two places, no mapping. */
.player-swatch {
  flex: 0 0 auto;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--color-user-ink);
}

.player-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-self,
/* T6.1 — the connecting line sits at the roster's own quiet rank: the well says one thing
   under the list while the wire is coming up, and nothing once it has. */
.players-status {
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1.25;
  /* The quiet rung (the ledgered token the row captions write at): 5.23:1 light / 6.06:1 dark
     on --color-card, which is the floor below which a caption stops clearing AA. */
  color: var(--ink-press-quiet);
}

.players-status {
  margin: 0.35rem 0 0;
}

.players-leave {
  align-self: flex-start;
  margin-top: 0.3rem;
  padding: 0.15rem 0.1rem;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  letter-spacing: var(--type-tracking-wide);
  color: var(--ink-press-quiet);
  text-decoration: underline;
  text-underline-offset: 3px;
  background: none;
  border: none;
  cursor: pointer;
  /* T8-W1 (agent C's M5 census, R2) — the lift TWEENS, like every sibling ink lift in this
     card. `.icon-btn` has carried `color 150ms` since P1-W3 narrowed it off `all`; this one
     snapped, so the two quiet words in the players well answered the pointer in two different
     languages. One property, the same 150ms, on the estate's standard curve — and NOT `all`,
     which is the exact width P1-W3 measured the cost of. */
  transition: color 150ms var(--ease-standard);
}

.players-leave:hover {
  color: var(--color-foreground);
}

/* A thumb gets the estate's floor here as everywhere else — a written word is still a control.
   T7-W4 M1: the floor held on ONE dimension. `min-height` alone measured 40.09×44 on
   devices["iPhone 13"], both engines — the word "leave" plus its 0.5rem padding is simply
   narrower than a thumb, and `align-self: flex-start` keeps the box shrink-to-fit so nothing
   else was going to widen it. `min-width` is the other half of the same floor. */
@media (pointer: coarse) {
  .players-leave {
    min-height: 44px;
    min-width: 44px;
    padding-inline: 0.5rem;
  }
}

/* The Deal commit sits centered under the staged selectors, a comfortable target from the peek
   divider that partitions it off from the live play tools (the spatial prophylaxis).

   TWO ROWS, ONE AXIS (mark 6, re-cut at T6 mark 8). Neither obvious layout survived measurement
   when the receipt first joined this row. A centered flex row is not a centered verb —
   `justify-content: center` over two items slides Deal ~43px off the well's own spine, the axis
   its staged chips are centered on. `grid-template-columns: 1fr auto 1fr` holds the spine but is
   worse: under the rail's shrink-to-fit MAX-CONTENT sizing the two `1fr` tracks resolve equal,
   so the EMPTY left track mirrors the receipt's width and the row's max-content becomes verb +
   2× receipt. It widened the rail 276.25 → 283.14 and the centered `.app-layout` walked the
   board 3.45px left — a sub-pixel phase change under `cell-light`, a committed golden.

   Mark 6's answer was ONE shared cell — verb centred, receipt end-aligned — and it worked on a
   clearance of 7.53px that mark 8's bigger die spends outright. So the receipt takes its own
   row: die and name on row 1, `dealt |卅` centred beneath on row 2, both on the well's spine.
   The single implicit column still resolves to `max(verb, receipt)`, exactly as the shared cell
   did, so the rail's max-content is unchanged and the board does not move — measured, not
   assumed. What the move retires is the hazard CLASS: no growth of either box can occlude the
   other, because they no longer overlap. `visual-regression.spec.ts` reads the clearance
   vertically now, with the shared cell as its negative control. */
/* T8-W1 M2 — THE RULE ABOVE THE COMMIT. The well stacks two questions and then an ACT, and
   nothing said where the asking stopped: `Hard` and the die sat in one undifferentiated
   column. The divider is the estate's own, not a new one — the same 1.5px `--ink-press-rule`
   hairline at the same 0.85rem of air that already separates `size` from `difficulty` two
   rules up, so the well reads as three parts ruled the same way rather than two grammars.
   `BoilDivider` is refused here for the reason the staged-section rule states: it mounts four
   live `url(#grain-static)` poses and takes the filter census 9 → 13.
   Both regimes: the phone shows one section at a time behind its tabs, so the staged-section
   rule never matches there and this is the only rule the sheet gets — which is the surface the
   owner marked. */
.deal-row {
  display: grid;
  align-items: center;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1.5px solid var(--ink-press-rule);
}

.deal-row > .deal-btn {
  grid-area: 1 / 1;
  justify-self: center;
}

.deal-row > .difficulty-tally {
  grid-area: 2 / 1;
  justify-self: center;
  margin-top: 0.15rem;
  min-width: 0;
}

/* T4-P1 pass 4 — the `:deep(.dt-name){display:none}` that used to live here is GONE with the
   markup it hid. `.deal-row` is the tally's only mount, so a rule scoped to it was never
   "inside the ticket only": it retired the reveal estate-wide, desktop included, and said so
   nowhere. The retirement stands and is now written where the component is (DifficultyTally),
   with the reading that decides it — expanded, the name crosses Deal by 103.53px at the 1440
   rail — and the row that keeps it from coming back is in `visual-regression.spec.ts`. */

/* Deal's own box. The column layout it used to restate here now lives on the base `.icon-btn`
   (T6 mark 12 hoisted it out of the coarse block — every verb writes its name at every
   pointer), so what is left is the two values that make this verb the PRIMARY one: a roomier
   gutter and the air its 36px die needs.

   THE SELECTOR CARRIES .icon-btn ON PURPOSE — (0,2,0), so the cascade no longer depends on
   where this block sits. Authored as a bare `.deal-btn` it tied `.icon-btn` at (0,1,0) and
   lost to it on source order: the base block's fixed 2.75rem height pinned the button at 44px
   while the column content wanted 28 (die) + 2.4 (gap) + 14.38 (label) + 9.6 (padding) =
   54.38. A text item can't shrink below min-content, so the die absorbed the whole 10.38px
   overflow and painted 28 × 17.62 on every fine pointer for the life of the T4 panel.
   Geometry is gated: e2e/visual-regression.spec.ts "the Deal die is not crushed". */
.icon-btn.deal-btn {
  gap: 0.3rem;
  padding: 0.5rem 1.1rem;
}

/* T6 mark 8 — Deal is the card's one primary verb and it wore the same caption its four
   secondary siblings wear. The die goes 28 → 36 and the name up one rung; the strip's verbs
   stay at `--type-caption`, and THAT difference is the hierarchy. */
.deal-btn .icon-sublabel {
  font-size: var(--type-small);
}

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared by both games (D4).
   Only the component-local hover flourish stays scoped here. */

/* The four `.crayon-*` utilities are HOISTED to assets/index.css (T6 mark 7), unlayered,
   beside the ink tiers they read. Scoped here they never reached a child component's
   internals, so the selected difficulty CHIP carried `crayon-orange` and painted nothing
   from it; global, the chip inks like the heading over it and the picker's band inks the
   same way off the same class. */

/* The `.section-heading:hover` wobble is DELETED (P1-W3, r3 §4.5). It was a decorative
   flourish on a non-interactive <h2> that lived INSIDE `.control-panel-filtered`, so swapping
   its own filter changed that panel filter's INPUT — three 4-octave turbulence passes, three
   displacement maps and two blends re-executing over the whole panel, twice per hover
   round-trip. The panel filter is gone now, and so is the flourish that abused it. */

/* T6 mark 12 — the column pose is the ONLY pose now. It was authored twice: a 44px square here
   and, under `@media (pointer: coarse)`, a column that stacked the icon over its written name.
   The sublabels go on at every pointer (mark 12: a fine-pointer reader had a row of unlabelled
   glyphs and a hover tape that only re-said the glyph's own name), so the coarse block's
   geometry is the shipped geometry and it is hoisted here verbatim — one pose, one place. */
.icon-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  width: auto;
  height: auto;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  /* NARROWED from `all 150ms` (P1-W3, r3 §3.2). `all` included `filter`, and the hover swap
     was a `url()`→`url()` pair — not interpolable, so it flipped discretely at 50% while
     `background`/`color` tweened, and each of their ~9 frames repainted a REFERENCE-FILTERED
     HTML box on WebKit's CPU path: nine turbulence passes per hover edge, per button, across a
     row of 8. The filter itself is gone too (G2.4 ruled **C** for icons — every icon is
     viewBox 24 against grain-static's 25-unit wavelength, so the chain was a uniform
     ±1.25-unit nudge, not a tooth, and CrayonHeart already rules grain sub-perceptual below
     20 px). Only what actually moved on hover is still allowed to tween. */
  transition:
    background-color 150ms,
    color 150ms;
}

/* T4-WM §2: the icon-btn hover paint stuck after a tap on touch (r2 §4) — fenced to
   hover-capable pointers. Coarse gets its sublabel + :active scale. P1-W3: the celestial
   wobble is deleted with the base filter it swapped against; the bg + ink shift is the hover. */
@media (hover: hover) {
  .icon-btn:hover {
    color: var(--color-foreground);
    background: var(--color-accent);
  }
}

.icon-btn:active {
  transform: scale(0.93);
}

.icon-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* Hold surface for the answer-key peek — hosts the BoilDivider, giving the
   press-and-hold a comfortable target and disabling text-select / touch-scroll
   so the browser doesn't swallow the gesture. The button tooltips are now washi
   labels (SheetWashiLabel), which carry their own hover + :focus-visible reveal. */
.peek-hold-surface {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.peek-hold-surface:active {
  cursor: grabbing;
}

/* THE DIVIDER STANDS DOWN ON THE PORTRAIT DOCK (pass 6, graft G2). It keeps its office — it is
   the ruled line between the staged zone and the live one, and `role="separator"` still says
   so — and loses only the hold it can no longer honour from inside a raised sheet. The peek
   chip in the fold carries that gesture now. `pointer-events: none` rather than a removed
   listener: the recognizer is one function with two consumers and deleting a listener per
   regime is how two recognizers are born. */
.peek-hold-surface.is-stood-down {
  pointer-events: none;
  cursor: default;
  touch-action: auto;
}

/* The peek chip — a play verb, so it wears the play verbs' grammar (`.icon-btn` gives it the
   coarse 44px floor and the column layout). Its word is a WORD rather than an icon because
   this act has no drawn glyph in the estate and inventing one is a new standing surface; the
   hand at caption scale is the same voice the sublabels beside it speak in. */
.peek-chip-word {
  font-family: var(--font-hand);
  font-size: var(--type-small);
  line-height: 1.6;
  letter-spacing: var(--type-tracking-wide);
  color: var(--color-foreground);
  background: var(--sheet-washi-neutral);
  padding: 0.25rem 0.5rem;
  clip-path: polygon(3% 4%, 97% 0%, 100% 52%, 98% 96%, 4% 100%, 0% 48%);
}

.peek-chip:active .peek-chip-word {
  background: var(--sheet-washi-neutral);
  opacity: 0.7;
}

/* UI-5: persistent icon sublabels — the pencil hand at caption scale, muted. T6 mark 12: they
   are written at EVERY pointer now. The fine-pointer arm used to hide them on the ground that
   "the hover washi carries the name there", and the washi carried the name and nothing else —
   so a desktop reader had five unlabelled glyphs and a tape that spelled the glyph back.
   The names are inked; the tapes explicate.
   `lowercase` is the chimera cure and it retires four font-census LEDGER rows in the same
   commit: Patrick Hand's cut declares {C,R,S} as its only capitals, so Deal / Fill / Undo /
   Hint have always painted their initial in the system face mid-word. */
.icon-sublabel {
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1;
  letter-spacing: var(--type-tracking-wide);
  text-transform: lowercase;
  color: var(--color-muted-foreground);
}

/* The armed Clear asks in the teacher's rose — the one moment a sublabel raises its voice.
   Raw --color-crayon-rose is sub-AA on --color-card in light, and this is the ONE sublabel
   that must be read. --color-red-ink is that same hue locked at 346° and darkened to AA for
   exactly this case; index.css's ink-tier block holds the measured ratios and is the record
   for them — no second copy here. Dark mode aliases it straight back to the wax, so the
   night pose is byte-identical: the same swap `.crayon-rose` makes in index.css. */
.icon-sublabel.is-armed {
  color: var(--color-red-ink);
  font-weight: 600;
}

/* ── Coarse pointers (T3-W11 U-A): the honest touch affordances ─────────
   UI-4: the 14px peek hairline was under every tap floor — pad the hold surface to a
   ≥44px target (the divider stays a hairline visually; the persistent washi labels it).
   The icon column + the written names are no longer fenced here: T6 mark 12 hoisted both
   onto the base `.icon-btn` / `.icon-sublabel`, so what stays is only what a finger needs
   and a mouse does not. */
@media (pointer: coarse) {
  .peek-hold-surface {
    padding-block: 1rem;
  }

  /* Restated at (0,2,0) because `.icon-btn.deal-btn` above now outranks this block. Deal's
     die grows with mark 8 at every pointer, but its GUTTER stays the touch gutter — every
     icon button wears the same 0.5rem on a phone, where the fine rail's 1.1rem would push a
     four-verb strip toward the card's edges. */
  .icon-btn.deal-btn {
    padding: 0.3rem 0.5rem;
  }
}

/* Sparkle icon - pastel rainbow filled */
.sparkle-icon :deep(*) {
  stroke: url(#sparkle-rainbow) !important;
  fill: url(#sparkle-rainbow) !important;
}

.sparkle-icon {
  filter: drop-shadow(0 0 2px rgba(196, 181, 253, 0.3));
  transition: all 200ms;
}

@media (hover: hover) {
  .icon-btn:hover .sparkle-icon {
    filter: drop-shadow(0 0 5px rgba(196, 181, 253, 0.6));
  }
}

/* ── T6 mark 5 · the sticky action bar ─────────────────────────────────────────
   The card is 1039px of content in a 640px scrollport at the 1440 rail, and the four verbs
   sat at the bottom of the 1039 — so reading the difficulty chips and clearing the board were
   never on screen together. The bar stays. `1fr auto` puts the verbs on the card's spine and
   the `i` on its trailing edge; the ::before is a short fade so scrolled content dissolves
   into the bar instead of being guillotined by it. */
.action-bar {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background: var(--color-card);
  padding-block: 0.4rem 0.15rem;
}

.action-bar::before {
  content: "";
  position: absolute;
  inset: auto 0 100% 0;
  height: 0.9rem;
  background: linear-gradient(to top, var(--color-card), transparent);
  pointer-events: none;
}

.action-verbs {
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
  flex: 1;
}

/* Sticky ONLY where the card is a scrollport. In `scene.css` it's `.controls-card` that takes
   `overflow-y: auto`, and it does so twice: under `@media (min-width: 1024px)` (the rail) and
   under `@media (max-width: 1023.98px) and (orientation: portrait)` (the dock). The <1024
   LANDSCAPE card is IN FLOW — the stacked `@media (max-width: 1023px)` block gives
   `.scene-controls` a `--board-col` width and nothing else — so `bottom: 0` there would pin the
   bar to the viewport and move a ratified rung. This condition is that pair of regime keys
   restated in a second file — re-cut one and re-cut both. */
@media (min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait) {
  .action-bar {
    position: sticky;
    bottom: 0;
    /* ── T7-W7 · THE BAR OCCLUDES THE TAPE ───────────────────────────────────────────────
       Was 3 — above the well's drawn outline (z 1) and its `.washi-tag` (z 2), and BELOW every
       hover/hint tape in the card: `SheetWashiLabel` ships `z-index: 50`, and the card is one
       stacking context (`.controls-card`, z 45 in `scene.css`), so a tape hanging off a control
       under the bar painted straight THROUGH it — "invite someone to write on this board with
       you" over the clear/fill/solve/share sublabels, 20.26px of overlap at 1440×900, 10.43px
       at 1280×720. A bar that content scrolls under is opaque by definition; it is the last
       thing painted in this card. 60 keeps all three older relations intact and clears 50 by a
       rung. Its OWN tapes are children of this stacking context and still ride above it.
       Re-cut `SheetWashiLabel`'s 50 and re-cut this — the pair is noted at both ends. */
    z-index: 60;
  }

  /* ── T7-W7 · THE FLUSH — THE BAR'S SKIRT ────────────────────────────────────────────────
     `bottom: 0` was never the bottom the eye reads, and the 20px it left over is not a tuning
     anybody chose. A sticky box is constrained to its CONTAINING BLOCK — the card's CONTENT box
     — while the scrollport it sticks to is the card's PADDING box; the card carries `p-5`, so
     the bar halted exactly one `padding-bottom` above the edge and the card scrolled LIVE
     CONTENT through the leftover band. Measured on the dev server before the cure: 20.00px at
     1440×900 and 20.00px at 1280×720 — the padding to the hundredth, at both — reading as a
     severed line under the verbs ("how your marks are writt", "Corner", "Live") and, at
     1280×720, 34% of the Deal button with its sublabel swallowed.

     THE BAND IS THE BAR'S, SO THE BAR PAINTS IT. Three geometric cures were tried against the
     real surface first, and all three are worse:
       · `margin-bottom: -20px` + an equal `padding-bottom` — MEASURED INERT. Chrome constrains
         the sticky BORDER box, not the margin box, so the bar grew UPWARD (top 598.64 → 578.64)
         and its bottom never left 663.45. The sliver survived the change untouched.
       · `bottom: -20px` — a negative inset extends the sticky rectangle below the scrollport,
         but the containing block still binds first: a no-op that reads like a fix.
       · zeroing the card's `padding-bottom` and re-housing that air — the only true geometry,
         and it costs a spelled constant here, against a Tailwind class in a second file
         (`GameScene.vue`'s `p-5` / `px-2 py-1.5`), which is exactly the drift W2 refused.
     The skirt is one absolutely-positioned strip, `--card-pad-b` tall — published by the bar's
     own observer off the card's computed padding, measured, never spelled — hanging from the
     bar's bottom edge in the card's own colour. It rides the bar's stacking context, so it
     occludes what the bar occludes; it stops exactly at the padding edge, so the card's overflow
     clip and its `rounded-xl` corner take it; and it is deliberately NOT `pointer-events: none`
     — everything the old sliver showed was also clickable through it, and a control you cannot
     see must not be a control you can press.
     Layout-neutral by construction: no box moves, `scrollHeight`/`maxScroll` hold (1113/585 at
     1440×900 across the cure), and W2's `--action-bar-h` keeps both its terms and its value.
     INSIDE the sticky block on purpose — the <1024 landscape card is in flow and its bar has
     siblings below it, where a skirt would paint over the play tools instead of over nothing. */
  .action-bar::after {
    content: "";
    position: absolute;
    inset: 100% 0 auto 0;
    height: var(--card-pad-b, 0px);
    background: var(--color-card);
  }
}

/* T6 mark 8 — the strip's verbs grow with Deal, one rung behind it. Scoped to the bar so the
   fold's undo / redo / hint keep the 26px they were seated at on the dock. */
.action-verbs .icon-btn svg {
  width: 30px;
  height: 30px;
}

/* The fold. `0fr → 1fr` and not `display`/`v-show`: see the template comment — the crib's
   max-content is what sizes the rail, and its text is what a11y 3.4 reads.

   THE CLIP IS `clip-path`, NOT `overflow: hidden`, AND THE REASON IS ENGINE-MEASURED. WebKit's
   `innerText` walks with clipping honoured: text inside an `overflow: hidden` box of height 0
   returns the EMPTY STRING, so a11y 3.4's `help.innerText()` read nothing and the row went red
   in webkit while chromium passed it (both engines probed, six collapse variants). `clip-path`
   clips the same pixels and neither engine's text walker sees it. Same box, same paint, one
   engine-honest reading. */
.legend-fold {
  display: grid;
  grid-template-rows: 0fr;
  clip-path: inset(0);
  transition: grid-template-rows 200ms var(--ease-drawOn);
}

.legend-fold.is-open {
  grid-template-rows: 1fr;
}

.legend-fold > div {
  min-height: 0;
}

@media (prefers-reduced-motion: reduce) {
  .legend-fold {
    transition: none;
  }
}

/* The legend the `i` opens is itself `(hover: hover) and (pointer: fine)` — so its toggle
   restates that gate rather than a `v-if`, and an iPad rail gets neither. */
.info-btn {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .info-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
}

.info-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1.5px solid var(--ink-press-rule);
  border-radius: 50%;
  font-family: var(--font-hand);
  font-size: var(--type-small);
  line-height: 1;
  color: var(--ink-press-quiet);
}

.info-btn[aria-expanded="true"] .info-glyph {
  color: var(--color-foreground);
  border-color: currentColor;
}

/* T8-W1 (agent C's M5 census, R2) — THE `i` ANSWERS THE POINTER. Every other interactive text
   surface in this card lifts its ink under a hover (`.icon-btn`, `.players-leave`, the chips'
   ghost underline); this one had a pressed state and nothing before it, so the only control in
   the action bar that opens something gave no sign it was a control. The lift is the SAME two
   properties the pressed rule above already writes — no new vocabulary, and hovering an open
   `i` is therefore a no-op rather than a third appearance. Fenced to hover-capable pointers
   like every ink lift in the estate; the button itself is fine-pointer-only anyway. */
@media (hover: hover) {
  .info-btn:hover .info-glyph {
    color: var(--color-foreground);
    border-color: currentColor;
  }
}

/* Play tools row (T4-WM §2) — undo / redo / hint. A COARSE affordance: hidden on a fine
   pointer (the desktop keeps its keyboard shortcuts + legend, presentation unchanged),
   shown as a tappable row on coarse — whether that lands in the mobile card (<lg) or the
   iPad row-regime card (≥lg). The buttons are plain .icon-btn, so the existing coarse
   block below gives them the 44px floor + written sublabels; this only governs the row. */
.play-controls {
  display: none;
}

@media (pointer: coarse) {
  .play-controls {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.35rem;
  }
}

/* Mobile layout */
.mobile-control-panel {
  font-family: var(--font-display);
  font-optical-sizing: auto;
}

.mobile-heading-row {
  display: flex;
  justify-content: space-evenly;
}

/* The heading that wraps each tab (a11y r1 M9). Box-less by construction: the button remains
   the flex item of `.mobile-heading-row`, so the row's layout is the row's layout. */
.mobile-heading-head {
  display: contents;
}

.mobile-heading-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* UI-12: the inactive tab's current value — the pencil hand at caption scale, reduced-
   pressure graphite. Deliberately quiet: it names what's closed without competing with
   the active tab's underline. */
.heading-value {
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1;
  letter-spacing: var(--type-tracking-wide);
  /* T4-W10 gate 1: 60% graphite was 4.10:1 on --color-card (< AA 4.5). The 68% that
     cleared it IS --ink-press-quiet; the literal is now the token. Pixel-identical. */
  color: var(--ink-press-quiet);
}

.mobile-heading-btn .section-heading.is-active {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

/* T8-W1 (agent C's M5 census, R2) — THE TABS ANSWER THE POINTER. The staged tab heads are the
   card's largest interactive text and they had exactly one state to read: the underline on the
   ACTIVE one. Pointing at a tab did nothing, which on a row of two or three reads as "this one
   is not a control". The lift is the estate's own — muted ink to foreground, the `.icon-btn` /
   `.ctrl-btn` grammar — and it lands on the heading rather than the button so it is the WORD
   that answers, which is what the reader is pointing at.

   MEASURED, both engines, at 820×1000 (the mobile arm on a pointer that can hover):
     · `Size` [active]   rgb(168,166,159) → rgb(237,236,233)
     · `Difficulty`      rgb(61,217,104)  → rgb(237,236,233)
   Two facts that reading alone would have got wrong, so they are written down rather than
   assumed. FIRST: the active head lifts too — it wears `text-muted-foreground` like its
   sibling and is distinguished by its UNDERLINE, not by its ink, so there is no
   already-at-foreground state and no double-report either way. SECOND: the difficulty head
   carries the selected tier's crayon, and the lift overrides it for the duration of the hover
   — flagged to the M5 census rather than special-cased here, because the chips one rung down
   answer the same problem differently (their underline redraws precisely BECAUSE their ink
   cannot lift) and which of the two grammars the crayon-tinted heading takes is that census's
   ruling to make, not this file's.

   The fence is load-bearing and it was witnessed: under `isMobile`/`hasTouch` emulation
   `(hover: hover)` resolves FALSE and neither head moves, which is the rule doing its job on a
   thumb rather than the rule failing. */
@media (hover: hover) {
  .mobile-heading-btn:hover .section-heading {
    color: var(--color-foreground);
  }
}

/* Share pop — a small tape-press flourish on the share act (Band C one-shot). */
.share-pop {
  display: inline-flex;
  animation: sharePop 500ms ease;
}

@keyframes sharePop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  30% {
    transform: scale(1.18) rotate(-6deg);
  }
  55% {
    transform: scale(0.96) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Eraser scrub animation */
.eraser-scrub {
  display: inline-flex;
  animation: eraserScrub 400ms ease;
}

@keyframes eraserScrub {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  15% {
    transform: translateX(-4px) rotate(-8deg);
  }
  30% {
    transform: translateX(4px) rotate(6deg);
  }
  45% {
    transform: translateX(-3px) rotate(-5deg);
  }
  60% {
    transform: translateX(3px) rotate(4deg);
  }
  80% {
    transform: translateX(-1px) rotate(-1deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
</style>
