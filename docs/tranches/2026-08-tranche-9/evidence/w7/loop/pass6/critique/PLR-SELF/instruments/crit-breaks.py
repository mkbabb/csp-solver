"""PLR-SELF pass-6 CRITIC plants on the LANDED rows (dev :4244, HMR), each restored and sha1-verified."""
import hashlib, subprocess, sys, time, pathlib
F = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend")
S = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit6"
PM = "src/pencil/chrome/PlayerMark/PlayerMark.vue"
HS = "src/pencil/chrome/AttributionCard/HeadSheet.vue"
EDGE = ".head-sheet-edge {\n  position: absolute;"
BREAKS = [
  ("P5X1 prior-pass plant: the edge at opacity 0", HS, EDGE, ".head-sheet-edge {\n  opacity: 0;\n  position: absolute;", "both head disclosures paint"),
  ("P5X2 prior-pass plant: the edge inkless", HS, EDGE, ".head-sheet-edge {\n  color: transparent;\n  position: absolute;", "both head disclosures paint"),
  ("P5R1 prior-pass plant: the pass-5 query as the key", PM, "cramped.value = board.left <= rowsStart && board.top < bottom;",
   'cramped.value = matchMedia("(orientation: portrait) and (max-height: 799px)").matches;', "a portrait phone compresses"),
  ("X3 only the top 12px of the edge survive (sides and bottom erased)", HS, EDGE, ".head-sheet-edge {\n  clip-path: inset(0 0 calc(100% - 12px) 0);\n  position: absolute;", "both head disclosures paint"),
  ("X6 the bottom 16px of the edge erased (top and sides intact)", HS, EDGE, ".head-sheet-edge {\n  clip-path: inset(-4px -4px 16px -4px);\n  position: absolute;", "both head disclosures paint"),
  ("X7 the edge faded to opacity 0.5", HS, EDGE, ".head-sheet-edge {\n  opacity: 0.5;\n  position: absolute;", "both head disclosures paint"),
  ("X5 the edge faded to opacity 0.4", HS, EDGE, ".head-sheet-edge {\n  opacity: 0.4;\n  position: absolute;", "both head disclosures paint"),
]
sha = lambda p: hashlib.sha1((F/p).read_bytes()).hexdigest()
only = sys.argv[1:]
for name, path, old, new, grep in BREAKS:
    if only and name.split()[0] not in only: continue
    before = sha(path); text = (F/path).read_text()
    assert text.count(old) == 1, (name, text.count(old))
    (F/path).write_text(text.replace(old, new, 1))
    time.sleep(2)
    r = subprocess.run(["npx","playwright","test","--config",f"{S}/pw.estate.mts","player-mark.spec.ts","-g",grep,"--reporter=list","--retries=0"], cwd=S, capture_output=True, text=True)
    (F/path).write_text(text)
    after = sha(path)
    print(f"{name}: exit {r.returncode} · restored sha1 {'OK' if after==before else 'MISMATCH'} {after[:10]}", flush=True)
    for l in (r.stdout + r.stderr).splitlines():
        s = l.strip()
        if s.startswith(("1 failed","2 failed","1 passed","2 passed","✓","✘")) or "Expected" in s or "Received" in s or s.startswith("Error:"):
            print("    " + s[:200], flush=True)
