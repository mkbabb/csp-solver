import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CheckStatus from "./CheckStatus.vue";
import type { ErrorCheckMode } from "./useAssists";

// The teacher's-well status line — a six-branch machine (four visible sentences over three
// modes, three spoken ones) that shipped in pass 2 with zero unit coverage. Every branch is
// reachable from `useAssists`: `marking` is its `proactiveCheck` (live, OR on-demand with the
// snapshot still armed), and the ask/stale pair is the whole reason this component exists —
// `checkArmed` decays on the next board edit and nothing in the card ever said so.
//
// The pressure rung is asserted as the `is-marking` CLASS, not as a colour: the two rungs are
// tokens (--ink-press-quiet / --color-foreground) whose VALUES are gated by
// `scripts/check-ink-pressure.mjs`, and jsdom applies no stylesheet. Splitting it that way
// keeps each gate on the layer that can actually see its subject.

function mountStatus(marking: boolean, mode: ErrorCheckMode) {
  return mount(CheckStatus, { props: { marking, mode } });
}

const visible = (w: ReturnType<typeof mountStatus>) =>
  w.get('[aria-hidden="true"]').text();
const spoken = (w: ReturnType<typeof mountStatus>) => w.get(".sr-only").text();

describe("CheckStatus — the visible sentence, one branch per state", () => {
  it("off: the teacher is not marking and the mode says why", () => {
    expect(visible(mountStatus(false, "off"))).toBe("not marking");
  });

  it("live: marking continuously", () => {
    expect(visible(mountStatus(true, "live"))).toBe("marking as you go");
  });

  it("on-demand + armed: the check landed and is showing", () => {
    expect(visible(mountStatus(true, "on-demand"))).toBe("marked · showing mistakes");
  });

  it("on-demand + STALE: names the decay AND the recovery — the state the card never showed", () => {
    expect(visible(mountStatus(false, "on-demand"))).toBe("board changed · Ask again");
  });
});

describe("CheckStatus — what assistive tech is told", () => {
  it("marking speaks a whole sentence, not the fragment on the page", () => {
    expect(spoken(mountStatus(true, "on-demand"))).toBe(
      "Checking this board for mistakes",
    );
    expect(spoken(mountStatus(true, "live"))).toBe("Checking this board for mistakes");
  });

  it("the stale branch is the only one that names a recovery", () => {
    expect(spoken(mountStatus(false, "on-demand"))).toContain("Choose Ask again");
    expect(spoken(mountStatus(false, "off"))).toBe("Not checking this board");
  });

  it("the visible line is hidden from AT and the spoken line from sight — never both read", () => {
    const w = mountStatus(false, "on-demand");
    expect(w.get('[aria-hidden="true"]').text()).not.toBe(w.get(".sr-only").text());
    expect(w.findAll(".sr-only")).toHaveLength(1);
  });
});

describe("CheckStatus — pressure is the state", () => {
  it("the firm rung is worn only while marking", () => {
    expect(mountStatus(true, "live").get("p").classes()).toContain("is-marking");
    expect(mountStatus(false, "on-demand").get("p").classes()).not.toContain(
      "is-marking",
    );
  });

  it("it is a live region, so the decay announces without a focus move", () => {
    expect(mountStatus(false, "off").get("p").attributes("role")).toBe("status");
  });
});
