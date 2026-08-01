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
  /** the visible heading text */
  heading: string;
  /** optional aria-label (else the visible text is the accessible name) */
  ariaLabel?: string;
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
import { computed, ref, onBeforeUnmount, useId } from "vue";
import SolveIcon from "@pencil/chrome/icons/SolveIcon.vue";
import FillForcedIcon from "@pencil/chrome/icons/FillForcedIcon.vue";
import DiceIcon from "@pencil/chrome/icons/DiceIcon.vue";
import EraserIcon from "@pencil/chrome/icons/EraserIcon.vue";
import ShareIcon from "@pencil/chrome/icons/ShareIcon.vue";
import UndoIcon from "@pencil/chrome/icons/UndoIcon.vue";
import RedoIcon from "@pencil/chrome/icons/RedoIcon.vue";
import HintIcon from "@pencil/chrome/icons/HintIcon.vue";
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import KeyboardLegend from "@pencil/chrome/KeyboardLegend.vue";
import BoilDivider from "@pencil/chrome/BoilDivider.vue";
import SheetWashiLabel from "@pencil/sheet/SheetWashiLabel.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import ScribbleLoader from "@pencil/chrome/ScribbleLoader.vue";
import CheckStatus from "@games/shared/CheckStatus.vue";
import DifficultyTally from "@games/shared/DifficultyTally.vue";
import type { TallyDescriptor } from "@games/shared/techniqueVoice";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import { useButtonAnimation } from "@games/shared/useButtonAnimation";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";

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
  // T4-P1 — `useAssists`' derived display gate (live, OR on-demand with the snapshot still
  // armed). The mode alone cannot say whether the teacher is marking RIGHT NOW: `checkArmed`
  // decays on the next board edit, and that decay is the state the panel has never shown.
  proactiveCheck: boolean;
  // T4-W3 share-truth: the parent's share act, handed as a callback rather than an emit so
  // the OUTCOME travels back — it resolves iff the clipboard copy actually landed.
  share: () => Promise<void>;
  // T4-P1 mark 6 — the dealt board's measured tier. It used to hang under the board, where on
  // a phone it was 30px of permanent in-flow height between the work and the controls; it is
  // the DEAL'S RECEIPT, so it files with the deal. Optional: an ungraded game (the engine
  // never ran) hands nothing and the row renders the verb alone.
  gradeTally?: TallyDescriptor;
}>();

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
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer);
  if (clearArmTimer) clearTimeout(clearArmTimer);
  if (dealArmTimer) clearTimeout(dealArmTimer);
});

// ── Share-on-demand permalink (W6; T4-W3 share-truth) ──────────────────
// `props.share()` resolves iff the clipboard copy actually landed. Confirm ("copied!") ONLY
// on resolve; on reject (insecure context, permission-policy denial, absent Clipboard API)
// the `?board=` link is still live in the address bar — so say exactly that. The washi,
// sublabel, and aria-label all track the REAL outcome, never the optimistic flip the old
// unconditional `shareConfirm = true` asserted over a possibly-empty clipboard.
const { animating: shareAnimating, trigger: triggerShare } = useButtonAnimation(500);
const shareState = ref<"idle" | "copied" | "failed">("idle");
let shareConfirmTimer: ReturnType<typeof setTimeout> | null = null;
async function onShare() {
  triggerShare();
  let copied = true;
  try {
    await props.share();
  } catch {
    copied = false;
  }
  shareState.value = copied ? "copied" : "failed";
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer);
  // The failure line runs longer — it points the reader to the address bar, more to read.
  shareConfirmTimer = setTimeout(
    () => {
      shareState.value = "idle";
    },
    copied ? 1600 : 3600,
  );
}
const shareAria = computed(() =>
  shareState.value === "copied"
    ? "Link copied"
    : shareState.value === "failed"
      ? "couldn't copy — link is in the address bar"
      : "Share board link",
);
const shareSublabel = computed(() =>
  shareState.value === "copied"
    ? "copied!"
    : shareState.value === "failed"
      ? "in address bar"
      : "Share",
);
const shareWashi = computed(() =>
  shareState.value === "copied"
    ? "copied!"
    : shareState.value === "failed"
      ? "couldn't copy — link is in the address bar"
      : "share link",
);

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
// `pencils`; checking is what the teacher does. That leaves `teacher's` holding exactly one
// idea — which is what lets it carry a status line about one thing, and why its row needs no
// caption of its own.
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
const teachersId = useId();
// `pencils` holds two controls, so each row is its own `role="group"` named by that row's OWN
// visible caption — otherwise assistive tech hears two unlabelled Off/On pairs inside one name
// and cannot tell which is which. `teacher's` holds one, so the tape names it directly.
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
</script>

<template>
  <!-- Mobile layout -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
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
      <div class="control-panel-filtered">
        <!-- The mobile tab-toggle — renders ONLY at n ≥ 2 sections (each tab is a section head;
             a single-section game shows a plain heading below instead of a dead tab). It STAYS:
             it is the card's largest single height saving on a phone, and spending it is what
             put pass 1's coarse gate 7px underwater. Deleting a component is not the same as
             deleting its work. -->
        <div v-if="showTabs" class="mobile-heading-row">
          <button
            v-for="section in sections"
            :key="section.key"
            class="mobile-heading-btn"
            :aria-expanded="expandedPanel === section.key"
            @click="expandedPanel = section.key"
          >
            <h2
              class="section-heading"
              :class="[
                headingClass(section),
                { 'is-active': expandedPanel === section.key },
              ]"
              :aria-label="section.ariaLabel"
            >
              {{ section.heading }}
            </h2>
            <!-- UI-12: the current value, shown only while this tab is closed. -->
            <span v-if="expandedPanel !== section.key" class="heading-value">{{
              valueLabel(section)
            }}</span>
          </button>
        </div>

        <template v-for="section in sections" :key="section.key">
          <!-- Single-section (n = 1): a plain heading above its selector, never a tab. -->
          <h2
            v-if="!showTabs"
            class="section-heading"
            :class="headingClass(section)"
            :aria-label="section.ariaLabel"
          >
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
      </div>

      <!-- The Deal commit — the DiceIcon re-homed from the action row (no new control, the WM
           input shape stays frozen). Its name shows always (the primary verb of the staged zone
           earns its label), so "next game" reads with zero copy. -->
      <div class="deal-row">
        <button
          @click="onDeal()"
          :disabled="loading"
          class="icon-btn deal-btn"
          :aria-label="dealArmed ? 'Tap again to deal a new board' : 'Deal a new board'"
        >
          <DiceIcon :size="28" :playing="dealAnimating" />
          <span
            class="icon-sublabel"
            :class="{ 'is-armed': dealArmed }"
            aria-hidden="true"
            >{{ dealArmed ? "sure?" : "Deal" }}</span
          >
        </button>
        <!-- The receipt (mark 6): what the LAST deal actually produced, beside the verb that
             will replace it. The chips above are the ask; this is the answer. -->
        <DifficultyTally v-if="gradeTally" :descriptor="gradeTally" label="dealt" />
      </div>
    </HandDrawnOutline>

    <!-- Zone separator = the hold-to-peek BoilDivider (existing grammar): staged zone above,
         live zone below. Spatial prophylaxis — Deal is a full divider away from the play tools,
         so a mid-game fat-finger never lands a board wipe. UI-4: the washi is PERSISTENT on
         coarse pointers and pinned to the divider's own box; the surface pads to a ≥44px target
         (CSS). Narrow fine-pointer windows keep the hover/focus reveal. -->
    <div
      class="peek-hold-surface group relative"
      @pointerdown="onDividerHoldStart($event)"
      @pointermove="onDividerHoldMove($event)"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <SheetWashiLabel text="hold to peek" :seed="53" anchor="center" persistent />
    </div>

    <!-- LIVE zone — two named compartments where three identical stanzas used to stack. -->
    <HandDrawnOutline
      class="tray-well"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="pencilsId"
    >
      <SheetWashiLabel :id="pencilsId" text="pencils" :seed="29" anchor="tag" />
      <div class="zone-row" role="group" :aria-labelledby="marksId">
        <span :id="marksId" class="zone-row-label">marks</span>
        <OptionSelector
          :options="MODE_OPTIONS"
          :selected="pencilMode"
          :boil-frame="0"
          mobile
          @change="pencilMode = $event as PencilMode"
        />
      </div>
      <div class="zone-row" role="group" :aria-labelledby="candidatesId">
        <span :id="candidatesId" class="zone-row-label">candidates</span>
        <OptionSelector
          :options="CANDIDATE_OPTIONS"
          :selected="candidatesPinned ? 'on' : 'off'"
          :boil-frame="0"
          mobile
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
      :aria-labelledby="teachersId"
    >
      <SheetWashiLabel :id="teachersId" text="teacher's" :seed="59" anchor="tag" />
      <!-- One idea in the compartment, so the tape is the whole of its name — no row caption
           to duplicate it. The status line below says whether she is marking right now. -->
      <OptionSelector
        :options="CHECK_OPTIONS"
        :selected="errorCheckMode"
        :boil-frame="0"
        mobile
        @change="emit('update:errorCheckMode', $event as ErrorCheckMode)"
      />
      <CheckStatus :marking="proactiveCheck" :mode="errorCheckMode" />
    </HandDrawnOutline>

    <!-- Action buttons — UI-5: persistent sublabels in the pencil hand on coarse
         pointers (the washi is a hover grammar; sighted touch users got no text). Deal
         re-homed OUT of this row into the staged zone above (spatial prophylaxis). -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn"
        :aria-label="clearArmed ? 'Tap again to clear board' : 'Clear board'"
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
      </button>
      <button
        @click="onFillForced()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Fill in the forced cells"
      >
        <FillForcedIcon :size="26" :playing="fillAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Fill</span>
      </button>
      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Solve puzzle"
      >
        <ScribbleLoader
          v-if="loading && !solveAnimating"
          :size="22"
          class="text-muted-foreground"
        />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Solve</span>
      </button>
      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn"
        :aria-label="shareAria"
      >
        <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
        <span class="icon-sublabel" aria-hidden="true">{{ shareSublabel }}</span>
      </button>
    </div>

    <!-- Play tools (T4-WM §2) — the coarse touch surface for undo / redo / hint, the
         acts a fine pointer reaches by ⌘Z / ⇧⌘Z / H. Coarse-only (CSS gate): the desktop
         keeps its keys + legend, so this row is display:none on a fine pointer and never
         disturbs that presentation. Same .icon-btn grammar as the action row above (44px
         floor + written sublabel on coarse). -->
    <div class="play-controls">
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
    </div>
  </div>

  <!-- Desktop layout -->
  <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
    <!-- STAGED "New game" zone (T4-WU/U2) — the desktop twin of the mobile staged zone: the game
         sections stage the NEXT board, Deal commits. role="group" labelled by the New-game
         heading; the selectors read provisional by placement (arm-not-live — no live re-deal). -->
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
      <div class="control-panel-filtered">
        <!-- The `<hr>` between the staged stanzas is a donor: the compartment's own drawn frame
             is the separation now, and two rules inside one box was the panel arguing with
             itself. What the rule was really buying — air — is the stanza margin below. -->
        <template v-for="section in sections" :key="section.key">
          <div class="staged-section flex flex-col items-center gap-1 md:items-stretch">
            <h2
              class="section-heading"
              :class="headingClass(section)"
              :aria-label="section.ariaLabel"
            >
              {{ section.heading }}
            </h2>
            <OptionSelector
              :options="section.options"
              :selected="section.selected"
              :boil-frame="boilFrame"
              @change="onSectionChange(section, $event)"
            />
          </div>
        </template>
      </div>

      <!-- The Deal commit — the DiceIcon re-homed from the action row (no new control, the WM
           input shape stays frozen). Hover washi on fine pointers; its name shows always so
           "next game" reads with zero copy. -->
      <div class="deal-row">
        <button
          @click="onDeal()"
          :disabled="loading"
          class="icon-btn deal-btn group relative"
          :aria-label="dealArmed ? 'Tap again to deal a new board' : 'Deal a new board'"
        >
          <DiceIcon :size="28" :playing="dealAnimating" />
          <span
            class="icon-sublabel"
            :class="{ 'is-armed': dealArmed }"
            aria-hidden="true"
            >{{ dealArmed ? "sure?" : "Deal" }}</span
          >
          <SheetWashiLabel text="Deal" :seed="11" />
        </button>
        <!-- The receipt (mark 6) — the rail twin. One home at every width; the sheet's own rule. -->
        <DifficultyTally v-if="gradeTally" :descriptor="gradeTally" label="dealt" />
      </div>
    </HandDrawnOutline>

    <!-- Zone separator = the hold-to-peek BoilDivider (existing grammar): staged zone above,
         live zone below. Spatial prophylaxis — Deal sits a full divider from the play tools, so
         a mid-game fat-finger never lands a board wipe. L14: a washi labels the hidden affordance.
         UI-9: anchored to the divider's OWN box, so the chip sits ON the ruled line. UI-4: also
         persistent on coarse pointers (iPad row regime), with a padded ≥44px target. -->
    <div
      class="peek-hold-surface group relative my-2"
      @pointerdown="onDividerHoldStart($event)"
      @pointermove="onDividerHoldMove($event)"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <SheetWashiLabel text="hold to peek" :seed="53" anchor="center" persistent />
    </div>

    <!-- LIVE zone — the rail twins of the two compartments above. The rail is a narrow column,
         so each row's caption sits OVER its selector rather than beside it. -->
    <HandDrawnOutline
      class="tray-well"
      :stroke-width="1.5"
      :outset="4"
      :radius="3"
      :pose="0"
      role="group"
      :aria-labelledby="pencilsId"
    >
      <SheetWashiLabel :id="pencilsId" text="pencils" :seed="29" anchor="tag" />
      <div class="zone-row zone-row-stacked" role="group" :aria-labelledby="marksId">
        <span :id="marksId" class="zone-row-label">marks</span>
        <OptionSelector
          :options="MODE_OPTIONS"
          :selected="pencilMode"
          :boil-frame="0"
          @change="pencilMode = $event as PencilMode"
        />
      </div>
      <div
        class="zone-row zone-row-stacked"
        role="group"
        :aria-labelledby="candidatesId"
      >
        <span :id="candidatesId" class="zone-row-label">candidates</span>
        <OptionSelector
          :options="CANDIDATE_OPTIONS"
          :selected="candidatesPinned ? 'on' : 'off'"
          :boil-frame="0"
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
      :aria-labelledby="teachersId"
    >
      <SheetWashiLabel :id="teachersId" text="teacher's" :seed="59" anchor="tag" />
      <OptionSelector
        :options="CHECK_OPTIONS"
        :selected="errorCheckMode"
        :boil-frame="0"
        @change="emit('update:errorCheckMode', $event as ErrorCheckMode)"
      />
      <CheckStatus :marking="proactiveCheck" :mode="errorCheckMode" />
    </HandDrawnOutline>

    <!-- Action buttons — hover washi for fine pointers, persistent sublabels on coarse
         (UI-5: an iPad in the row regime reaches this layout with no hover). Deal re-homed OUT
         of this row into the staged zone above (spatial prophylaxis). -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn group relative"
        :aria-label="clearArmed ? 'Tap again to clear board' : 'Clear board'"
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
        <SheetWashiLabel text="Clear" :seed="23" />
      </button>

      <button
        @click="onFillForced()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Fill in the forced cells"
      >
        <FillForcedIcon :size="26" :playing="fillAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Fill</span>
        <SheetWashiLabel text="fill forced" :seed="43" />
      </button>

      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <ScribbleLoader
          v-if="loading && !solveAnimating"
          :size="22"
          class="text-muted-foreground"
        />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Solve</span>
        <SheetWashiLabel text="Solve" :seed="37" />
      </button>

      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn group relative"
        :aria-label="shareAria"
      >
        <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
        <span class="icon-sublabel" aria-hidden="true">{{ shareSublabel }}</span>
        <SheetWashiLabel
          :text="shareWashi"
          :seed="71"
          :wide="shareState === 'failed'"
        />
      </button>
    </div>

    <!-- Play tools (T4-WM §2) — coarse-only, so a fine desktop shows the legend below
         (a keyboard is implied) and a coarse iPad in this row-regime gets the tappable
         undo / redo / hint instead. The two are mutually exclusive by pointer media. -->
    <div class="play-controls">
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
    </div>

    <!-- UI-7b: the keyboard legend (fine-pointer only — a keyboard is implied there). -->
    <KeyboardLegend />
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

/* The air the deleted `<hr>` was really buying, between the staged stanzas only — the
   compartment's frame does the separating between compartments. */
.staged-section + .staged-section {
  margin-top: 0.6rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
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

/* The Deal commit sits centered under the staged selectors, a comfortable target from the peek
   divider that partitions it off from the live play tools (the spatial prophylaxis).

   ONE CELL, TWO ALIGNMENTS (mark 6). The receipt joined this row, and neither obvious layout
   survived measurement. A centered flex row is not a centered verb — `justify-content: center`
   over two items slides Deal ~43px off the well's own spine, the axis its staged chips are
   centered on. `grid-template-columns: 1fr auto 1fr` holds the spine but is worse: under the
   rail's shrink-to-fit MAX-CONTENT sizing the two `1fr` tracks resolve equal, so the EMPTY left
   track mirrors the receipt's width and the row's max-content becomes verb + 2× receipt. It
   widened the rail 276.25 → 283.14 and the centered `.app-layout` walked the board 3.45px left
   — a sub-pixel phase change under `cell-light`, which is a committed golden. Measured, not
   guessed: the golden went red and stayed red across runs while it reds nowhere on the base.

   Both marks share ONE cell instead. Deal centers on the row's axis, the receipt pins to its
   trailing edge, and the row's max-content is the wider of the two — so the receipt contributes
   nothing to the rail's width and the board does not move. */
.deal-row {
  display: grid;
  align-items: center;
  /* 0.35rem, not 0.6: the well's own bottom padding now carries the rest of the air the
     0.6rem was buying against a bare stack. */
  margin-top: 0.35rem;
}

.deal-row > .deal-btn {
  grid-area: 1 / 1;
  justify-self: center;
}

.deal-row > .difficulty-tally {
  grid-area: 1 / 1;
  justify-self: end;
  min-width: 0;
}

/* The receipt's progressive disclosure is retired INSIDE the ticket (mark 6). The well is a
   `HandDrawnOutline`, and a child that changes its own box on hover changes the well's — which
   is the pass-3 stall lane's own mechanism: a laid-out size change re-bakes that outline's
   raster stack. The hardest technique still travels in the tally's `aria-label`, which is where
   assistive tech reads it and where the honesty spine keeps it. In the board margin the reveal
   had an empty margin to open into; in a compartment it has a neighbour. */
.deal-row :deep(.dt-name) {
  display: none;
}

/* Deal is the re-homed dice, but it earns its NAME on every pointer (not only coarse): the
   primary verb of the staged zone reads with zero copy. The column layout + padded target
   mirrors the coarse icon-btn grammar, applied to Deal at all widths.

   THE SELECTOR CARRIES .icon-btn ON PURPOSE — (0,2,0), so the cascade no longer depends on
   where this block sits. Authored as a bare `.deal-btn` it tied `.icon-btn` at (0,1,0) and
   lost to it on source order: the base block's fixed 2.75rem height pinned the button at 44px
   while the column content wanted 28 (die) + 2.4 (gap) + 14.38 (label) + 9.6 (padding) =
   54.38. A text item can't shrink below min-content, so the die absorbed the whole 10.38px
   overflow and painted 28 × 17.62 on every fine pointer for the life of the T4 panel.
   Geometry is gated: e2e/visual-regression.spec.ts "the Deal die is not crushed". */
.icon-btn.deal-btn {
  flex-direction: column;
  gap: 0.15rem;
  width: auto;
  height: auto;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.3rem 0.85rem;
}

.deal-btn .icon-sublabel {
  display: block;
}

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared by both games (D4).
   Only the component-local hover flourish stays scoped here. */

/* Crayon color utilities. The difficulty heading writes in the difficulty crayon, but as
   light-mode heading text the raw wax fails AA (green 2.22 / orange 2.05 / rose 4.11 on
   --color-card) — so the three difficulty tints read the ink tier (hue-locked, darkened to
   AA in light; the ink aliases the wax in dark, where the crayon already glows AA). Gate 1,
   T4-W10; ink hexes + ledger in assets/index.css. crayon-blue is unaffected (no heading use). */
.crayon-green {
  color: var(--color-green-ink);
}
.crayon-orange {
  color: var(--color-orange-ink);
}
.crayon-rose {
  color: var(--color-red-ink);
}
.crayon-blue {
  color: var(--color-crayon-blue);
}

/* The `.section-heading:hover` wobble is DELETED (P1-W3, r3 §4.5). It was a decorative
   flourish on a non-interactive <h2> that lived INSIDE `.control-panel-filtered`, so swapping
   its own filter changed that panel filter's INPUT — three 4-octave turbulence passes, three
   displacement maps and two blends re-executing over the whole panel, twice per hover
   round-trip. The panel filter is gone now, and so is the flourish that abused it. */

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
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

/* UI-5: persistent icon sublabels — the pencil hand at caption scale, muted. Hidden on
   fine pointers (the hover washi carries the name there); written down on coarse. */
.icon-sublabel {
  display: none;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1;
  letter-spacing: var(--type-tracking-wide);
  color: var(--color-muted-foreground);
}

/* The armed Clear asks in the teacher's rose — the one moment a sublabel raises its voice.
   Raw --color-crayon-rose is 4.10:1 on --color-card, sub-AA in light, and this is the ONE
   sublabel that must be read. --color-red-ink is that same hue locked at 346° and darkened
   to 4.98:1 for exactly this case (index.css:163); dark mode aliases it straight back to the
   wax, so the night pose is byte-identical. Same swap .crayon-rose already makes above. */
.icon-sublabel.is-armed {
  color: var(--color-red-ink);
  font-weight: 600;
}

/* ── Coarse pointers (T3-W11 U-A): the honest touch affordances ─────────
   UI-4: the 14px peek hairline was under every tap floor — pad the hold surface to a
   ≥44px target (the divider stays a hairline visually; the persistent washi labels it).
   UI-5: the icon actions write their names beneath the icon. Fine pointers match none
   of this — the hover grammar is structurally untouched. */
@media (pointer: coarse) {
  .peek-hold-surface {
    padding-block: 1rem;
  }

  .icon-btn {
    flex-direction: column;
    gap: 0.15rem;
    width: auto;
    height: auto;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.3rem 0.5rem;
  }

  /* Restated at (0,2,0) because `.icon-btn.deal-btn` above now outranks this block. Coarse
     keeps the SHIPPED pose byte-identical — every icon button, Deal included, wears the same
     0.5rem gutter on touch. Widening Deal's mobile box to the fine 0.85rem is a design call,
     not a cascade repair, so it is not made here; it is booked in blast-radius.md §2.6. */
  .icon-btn.deal-btn {
    padding: 0.3rem 0.5rem;
  }

  .icon-sublabel {
    display: block;
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
