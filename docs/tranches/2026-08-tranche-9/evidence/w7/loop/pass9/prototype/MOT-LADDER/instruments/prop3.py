import sys
p=sys.argv[1]; s=open(p).read()
anchor='''        L.clockReads("const Wx = 1; const d = aW + 1;", "W", { bare: true }).length ===
          0
      );
    },
  ],'''
assert s.count(anchor)==1
rows='''
  [
    "clock-context",
    "LADDER",
    "K11 `&&`, K16 an indexed literal, K17 a ternary, K12 a comma, K14 `Math.min.call` carry `ctx`; a bare read, a call argument, an object value and a sum carry none (pass 9, PROPOSED)",
    (L) => {
      const c = (t) => L.clockReads(t).map((r) => r.ctx ?? null);
      const all = (t, v) => c(t).length > 0 && c(t).every((x) => x === v);
      return (
        all("  }, MOTION.rungs.leave && MOTION.rungs.whisper);", "logical") &&
        all("  }, [MOTION.rungs.leave, MOTION.rungs.whisper][1]);", "indexed-literal") &&
        all("  }, MOTION.rungs.leave ? MOTION.rungs.whisper : MOTION.rungs.leave);", "ternary") &&
        all("  }, (MOTION.rungs.leave, MOTION.rungs.whisper));", "comma") &&
        all("  }, Math.min.call(null, MOTION.rungs.leave, 40));", "call-apply") &&
        all("const d = a ?? MOTION.rungs.leave;", "logical") &&
        all("  }, MOTION.rungs.leave);", null) &&
        all("animate(el, { duration: MOTION.rungs.leave, easing: e });", null) &&
        all("const t = MOTION.rungs.leave + MOTION.rungs.whisper;", null) &&
        all("const o = a?.b + MOTION.rungs.leave;", null) &&
        all("foo(MOTION.rungs.leave, 3);", null)
      );
    },
  ],
  [
    "obj-bracket",
    "LADDER",
    "K1: a literal-keyed bracket write on a script style object is a write; `.style[…]` stays one site, a computed key none (pass 9, PROPOSED)",
    (L) => {
      const w = (t) => L.scriptWrites(t, "animation-duration").map((x) => x.kind);
      const k1 = w('const vars = {};\\nif (armed) vars["animation-duration"] = "50ms";\\n');
      const st = w('el.style["animation-duration"] = "50ms";\\n');
      return (
        k1.length === 1 &&
        k1[0] === "script-object-bracket" &&
        st.length === 1 &&
        st[0] === "script-write" &&
        w('vars["animation-delay"] = "50ms";\\n').length === 0 &&
        w('vars[k] = "50ms";\\n').length === 0
      );
    },
  ],'''
s=s.replace(anchor, anchor+rows); open(p,'w').write(s); print("ok")
