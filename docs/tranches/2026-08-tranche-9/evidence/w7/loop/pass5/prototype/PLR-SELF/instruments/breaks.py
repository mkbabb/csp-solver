import hashlib, subprocess, sys, time, pathlib
F = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend")
PM = "src/pencil/chrome/PlayerMark/PlayerMark.vue"
BREAKS = [
  ("B1 Escape returns focus to the mark", PM,
   "the mark, and after a mouse open it is in the cell, where it stays.\n  close();\n}",
   "the mark, and after a mouse open it is in the cell, where it stays.\n  close();\n  el.value?.focus();\n}",
   "after a mouse open, Escape keeps"),
  ("B2 the document focusin unbound", PM,
   '  document.addEventListener("focusin", onDocFocusin);\n', "",
   "after a mouse open, Escape keeps"),
  ("B3 pointerdown prevented for every pointer", PM,
   '    @pointerdown="onPress"\n', "    @pointerdown.prevent\n",
   "a tap opens the mark"),
  ("B4 the pass-4 regime key", PM,
   'probe("(orientation: portrait) and (max-height: 799px)")', 'probe("(pointer: coarse) and (max-height: 799px)")',
   "a short portrait phone compresses"),
  ("B5 a CSS border back on the head sheet", "src/pencil/chrome/AttributionCard/HeadSheet.vue",
   ".head-sheet {\n  position: absolute;", ".head-sheet {\n  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);\n  position: absolute;",
   "both head disclosures are framed"),
  ("B7 the solo row carries no ink", PM,
   'ink: { "--color-user-ink": "var(--ink-press-quiet)" }, self: true },', 'ink: {}, self: true },',
   "the mark rests graphite alone"),
  ("B6 F1 false arm", "src/games/shared/useSession.ts",
   "const SELF_TAKES_ROOM_INK = true;", "const SELF_TAKES_ROOM_INK = false;",
   "the deck paints your swatch"),
]
sha = lambda p: hashlib.sha1((F/p).read_bytes()).hexdigest()
only = sys.argv[1:]  # optional subset
for name, path, old, new, grep in BREAKS:
    if only and name.split()[0] not in only: continue
    before = sha(path); text = (F/path).read_text()
    assert text.count(old) == 1, (name, text.count(old))
    (F/path).write_text(text.replace(old, new))
    time.sleep(2)
    r = subprocess.run(["npx","playwright","test","--config",".plr-self/pw.estate.config.ts","player-mark.spec.ts","-g",grep,"--reporter=line","--retries=0"], cwd=F, capture_output=True, text=True)
    (F/path).write_text(text)
    after = sha(path)
    tail = [l for l in r.stdout.splitlines() if ("passed" in l or "failed" in l or "›" in l and ("✘" in l or "[" in l))][-6:]
    print(f"{name}: exit {r.returncode} · restored sha1 {'OK' if after==before else 'MISMATCH'} {after[:10]}")
    for l in r.stdout.splitlines():
        if l.strip().startswith(("1 failed","2 failed","1 passed","2 passed","1 flaky")) or ("✘" in l) or l.strip().startswith("[") and "›" in l and "Error" not in l:
            print("   ", l.strip()[:160])
    for l in r.stdout.splitlines():
        if "Error:" in l or "Expected" in l or "Received" in l:
            print("      ", l.strip()[:160])
    sys.stdout.flush()
    time.sleep(2)
