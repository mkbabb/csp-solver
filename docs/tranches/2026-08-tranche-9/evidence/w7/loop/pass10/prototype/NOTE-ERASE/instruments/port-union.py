# port-union.py <frontend dir>: NOTE-ERASE pass-10 union-only spec edits (SWAP + line two), on top of interdiff10
import sys, pathlib
p = pathlib.Path(sys.argv[1]) / "e2e/affordances.spec.ts"
s = p.read_text()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:80])
    s = s.replace(old, new)
# 1. the SWAP arms: the time clause struck, the redundant visible bound folded into the teeth
rep("""    expect(leave.animationDuration).toBe('0s');
    expect(leave.ms).toBeLessThan(MOTION.rungs.whisper);
    // Every frame the old node is VISIBLE, line two already paints its sentence: these ARE the
    // both-line frames (no `-leave-to` on the swap, so connected and visible agree).
    expect(leave.visible).toBeLessThanOrEqual(2);
    expect(leave.painted).toBeLessThanOrEqual(2);""",
"""    expect(leave.animationDuration).toBe('0s');
    // Every frame the old node is VISIBLE, line two already paints its sentence: these ARE the
    // both-line frames (no `-leave-to` on the swap, so connected and visible agree). The teeth are
    // the connected count (a visible frame is a connected one); the time clause is struck (pass 10).
    expect(leave.painted).toBeLessThanOrEqual(ZERO_LEAVE_FRAMES);
    expect(zeroLengthLeave(leave)).toBe(true);""")
# 2. line two's still arms
rep("""      expect(leave.animationDuration).toBe('0s');
      expect(leave.ms).toBeLessThan(MOTION.rungs.whisper);
      expect(leave.painted).toBeLessThanOrEqual(2);""",
"""      expect(leave.animationDuration).toBe('0s');
      expect(leave.painted).toBeLessThanOrEqual(ZERO_LEAVE_FRAMES);""")
rep("""  expect(leave.animationDuration).toBe('0s');
  expect(leave.ms).toBeLessThan(MOTION.rungs.whisper);
  expect(leave.painted).toBeLessThanOrEqual(2);""",
"""  expect(leave.animationDuration).toBe('0s');
  expect(leave.painted).toBeLessThanOrEqual(ZERO_LEAVE_FRAMES);""")
p.write_text(s)
print("ok", p)
blk = (pathlib.Path(__file__).parent / "union-block.ts").read_text()
anchor = "for (const adv of LINE_TWO_ADVERSARIES.filter((a) => /layer|shorthand|:root/.test(a.name)))"
s = p.read_text(); assert s.count(anchor) == 1
p.write_text(s.replace(anchor, blk + anchor)); print("block ok")
# 3. the union's push row: its stub answers a RUNNING animation on an installed document timeline (pass 10)
q = pathlib.Path(sys.argv[1]) / "src/pencil/chrome/marginNote.motion.test.ts"
t = q.read_text()
o1 = """        .filter((n) => n === "ink-rub-out" || n === "ink-rub-out-fade")
        .map((animationName) => ({ animationName }));
    };
    try {"""
n1 = """        .filter((n) => n === "ink-rub-out" || n === "ink-rub-out-fade")
        .map((animationName) => ({
          animationName,
          playState: "running",
          timeline: document.timeline,
        }));
    };
    // Pass 10: the key reads `playState` and the document's timeline; jsdom has none, so one is
    // installed for the row (an answer with no `timeline` never matches it by `undefined`).
    Object.defineProperty(document, "timeline", {
      value: DOC_TIMELINE,
      configurable: true,
    });
    try {"""
o2 = """      Element.prototype.animate = realAnimate;
      delete gproto.getAnimations;
    }"""
n2 = """      Element.prototype.animate = realAnimate;
      delete gproto.getAnimations;
      delete (document as { timeline?: unknown }).timeline;
    }"""
assert t.count(o1) == 1 and t.count(o2) == 1, (t.count(o1), t.count(o2))
q.write_text(t.replace(o1, n1).replace(o2, n2)); print("push row ok")
