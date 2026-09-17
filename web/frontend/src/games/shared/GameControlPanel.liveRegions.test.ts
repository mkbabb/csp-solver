import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import type { Ref } from "vue";
import GameControlPanel from "./GameControlPanel.vue";

/**
 * T9-W3 §3.4 — THE PLAYERS WELL SPEAKS, at the unit layer.
 *
 * A live region announces MUTATIONS TO ITSELF. A region that enters the document with its
 * sentence already inside it has nothing to announce, and one that leaves the document at the
 * moment its subject starts changing cannot announce anything either. All three regions in this
 * well were one or the other at head:
 *
 *   · `players-status`  born under `v-if="!session.live"` with "connecting…" already in it
 *   · `players-alone`   born under `v-if="aloneInRoom"` with its sentence already in it
 *   · `players-roster`  `role="log"`, born under `v-else` WITH ROWS — the 0→1 case
 *                       (T7-W2 cured 1→2 only: a log that arrives already holding entries
 *                       announces none of them)
 *
 * So every row here asserts the same two things about one region: it was ALREADY IN THE
 * DOCUMENT before the state it narrates changed, and the content arrived INTO THAT SAME NODE.
 * Node identity is the assertion that matters — `toBe`, not `toHaveText` — because a region
 * that is torn down and rebuilt with new text passes every text assertion and still says
 * nothing out loud.
 */

// The session is a module singleton whose `players` is a computed over private state, so the
// well's three states are only reachable from here through the module. The stub is the whole
// import surface `GameControlPanel` takes (`session`, `leaveSession`) — nothing else in the
// mounted subtree imports it.
const hold = vi.hoisted(
  () =>
    ({}) as {
      roomId: Ref<string | null>;
      live: Ref<boolean>;
      players: Ref<{ id: string; slug: string; ink: object; self: boolean }[]>;
    },
);

vi.mock("@games/shared/useSession", async () => {
  const { ref } = await import("vue");
  hold.roomId = ref<string | null>(null);
  hold.live = ref(false);
  hold.players = ref<{ id: string; slug: string; ink: object; self: boolean }[]>([]);
  return {
    session: { roomId: hold.roomId, live: hold.live, players: hold.players },
    leaveSession: vi.fn(),
  };
});

const SECTIONS = [
  {
    key: "size",
    heading: "Size",
    options: [{ value: 3, label: "9×9" }],
    selected: 3,
    onChange: () => {},
  },
];

/** The portrait dock teleports the play verbs out of the card, so the berth must exist or the
 *  render crashes downstream (GameControlPanel.test.ts's six-red-rows lesson). */
function mountPanel() {
  document.getElementById("fold-tools")?.remove();
  const berth = document.createElement("div");
  berth.id = "fold-tools";
  document.body.appendChild(berth);
  return mount(GameControlPanel, {
    attachTo: document.body,
    props: {
      sections: SECTIONS,
      loading: false,
      isDirty: false,
      mobile: true,
      pencilMode: "off" as const,
      errorCheckMode: "on-demand" as const,
      candidatesPinned: false,
      share: () => Promise.resolve(),
      shareSession: () => Promise.resolve(),
    },
  });
}

const at = (sel: string) => document.querySelector<HTMLElement>(sel);
const text = (sel: string) => at(sel)?.textContent?.trim() ?? null;

/** Everyone at the table, you first — the roster's own order. */
const table = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: i === 0 ? "you" : `peer-${i}`,
    slug: i === 0 ? "naked-narwhal" : `peer-${i}`,
    ink: {},
    self: i === 0,
  }));

beforeEach(() => {
  hold.roomId.value = null;
  hold.live.value = false;
  hold.players.value = [];
});

afterEach(() => {
  document.getElementById("fold-tools")?.remove();
  document.body.innerHTML = "";
});

describe("GameControlPanel — the players well's live regions (T9-W3 §3.4)", () => {
  it("all three regions are in the document before there is a room, and all three are empty", () => {
    mountPanel();
    for (const sel of [".players-status", ".players-roster", ".players-alone"])
      expect(at(sel), `${sel} is not mounted`).not.toBeNull();
    expect(text(".players-status")).toBe("");
    expect(text(".players-alone")).toBe("");
    expect(document.querySelectorAll(".players-roster .player-row").length).toBe(0);
  });

  it("the connecting line arrives INTO the region that was already mounted", async () => {
    const w = mountPanel();
    const before = at(".players-status");
    hold.roomId.value = "room-1";
    await w.vm.$nextTick();
    expect(text(".players-status")).toBe("connecting…");
    expect(at(".players-status")).toBe(before);
  });

  it("and the line goes back to nothing in the SAME node when the wire comes up", async () => {
    const w = mountPanel();
    hold.roomId.value = "room-1";
    await w.vm.$nextTick();
    const before = at(".players-status");
    hold.live.value = true;
    await w.vm.$nextTick();
    expect(text(".players-status")).toBe("");
    expect(at(".players-status")).toBe(before);
  });

  it("the roster log is mounted and empty while the wire is still coming up (the 0→1 case)", async () => {
    const w = mountPanel();
    hold.roomId.value = "room-1";
    hold.players.value = table(1);
    await w.vm.$nextTick();
    expect(at(".players-roster"), ".players-roster is not mounted").not.toBeNull();
    expect(document.querySelectorAll(".players-roster .player-row").length).toBe(0);
  });

  it("the first roster row arrives INTO the mounted log", async () => {
    const w = mountPanel();
    hold.roomId.value = "room-1";
    hold.players.value = table(1);
    await w.vm.$nextTick();
    const log = at(".players-roster");
    hold.live.value = true;
    await w.vm.$nextTick();
    expect(at(".players-roster")).toBe(log);
    expect(document.querySelectorAll(".players-roster .player-row").length).toBe(1);
    expect(text(".players-roster")).toContain("naked-narwhal");
  });

  it("a joiner arrives into that same log (the 1→2 case T7-W2 cured, still cured)", async () => {
    const w = mountPanel();
    hold.roomId.value = "room-1";
    hold.live.value = true;
    hold.players.value = table(1);
    await w.vm.$nextTick();
    const log = at(".players-roster");
    hold.players.value = table(2);
    await w.vm.$nextTick();
    expect(at(".players-roster")).toBe(log);
    expect(document.querySelectorAll(".players-roster .player-row").length).toBe(2);
  });

  it("the room-of-one line arrives INTO the mounted region, and leaves it in place", async () => {
    const w = mountPanel();
    hold.roomId.value = "room-1";
    hold.players.value = table(1);
    await w.vm.$nextTick();
    const before = at(".players-alone");
    expect(text(".players-alone")).toBe("");

    hold.live.value = true;
    await w.vm.$nextTick();
    expect(text(".players-alone")).toBe("you're the only one on this board.");
    expect(at(".players-alone")).toBe(before);

    hold.players.value = table(2);
    await w.vm.$nextTick();
    expect(text(".players-alone")).toBe("");
    expect(at(".players-alone")).toBe(before);
  });

  it("a region with nothing to say costs no pixels: it wears the estate's sr-only clip", async () => {
    // The regions PERSIST, so the well would have grown by one flex row and its gap in every
    // state — `.tray-well` is `display:flex; gap:.1rem`. `sr-only` (the utility `.players-alone`
    // already wears) takes an empty region out of flow entirely: present for the AT, zero for
    // the layout. The class is bound to the region's own emptiness, so filling it puts the
    // region back in flow exactly where it shipped.
    const w = mountPanel();
    expect(at(".players-status")!.classList.contains("sr-only")).toBe(true);
    expect(at(".players-roster")!.classList.contains("sr-only")).toBe(true);

    hold.roomId.value = "room-1";
    await w.vm.$nextTick();
    expect(at(".players-status")!.classList.contains("sr-only")).toBe(false);

    hold.live.value = true;
    hold.players.value = table(1);
    await w.vm.$nextTick();
    expect(at(".players-status")!.classList.contains("sr-only")).toBe(true);
    expect(at(".players-roster")!.classList.contains("sr-only")).toBe(false);
  });

  it("the empty log is not a tab stop — a focusable region with nothing in it is a dead stop", async () => {
    const w = mountPanel();
    expect(at(".players-roster")!.hasAttribute("tabindex")).toBe(false);

    hold.roomId.value = "room-1";
    hold.live.value = true;
    hold.players.value = table(1);
    await w.vm.$nextTick();
    // T7-W2 A4 — a log you can hear added to but never read back is half a cure.
    expect(at(".players-roster")!.getAttribute("tabindex")).toBe("0");
  });
});
