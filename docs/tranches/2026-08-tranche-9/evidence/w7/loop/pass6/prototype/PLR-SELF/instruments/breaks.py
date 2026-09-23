"""PLR-SELF pass-6 break battery: each edit to THIS tree, run against its landed row in BOTH
engines, restored and sha1-verified. Dev server :4241 (HMR). Usage: python3 breaks.py [ids...]"""
import hashlib, subprocess, sys, time, pathlib
F = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend")
PM = "src/pencil/chrome/PlayerMark/PlayerMark.vue"
HS = "src/pencil/chrome/AttributionCard/HeadSheet.vue"
US = "src/games/shared/useSession.ts"
E2E = ("e2e", "player-mark.spec.ts")
BREAKS = [
  ("R1 the pass-5 media-query key back", PM,
   "cramped.value = board.left <= rowsStart && board.top < bottom;",
   'cramped.value = matchMedia("(orientation: portrait) and (max-height: 799px)").matches;',
   E2E, "a portrait phone compresses"),
  ("R1b the board-under-the-rows clause struck", PM,
   "cramped.value = board.left <= rowsStart && board.top < bottom;",
   "cramped.value = board.top < bottom;",
   E2E, "the desk draws the same rows|a portrait phone compresses"),
  ("R1c a row-count height in place of the measured sheet", PM,
   "const bottom = at.top + sheet.offsetTop + sheet.offsetHeight;",
   "const bottom = at.top + sheet.offsetTop + 170.66;",
   E2E, "a portrait phone compresses"),
  ("X1 the edge at opacity 0 (file)", HS,
   ".head-sheet-edge {\n  position: absolute;", ".head-sheet-edge {\n  opacity: 0;\n  position: absolute;",
   E2E, "both head disclosures paint"),
  ("X2 the edge inkless (file)", HS,
   ".head-sheet-edge {\n  position: absolute;", ".head-sheet-edge {\n  color: transparent;\n  position: absolute;",
   E2E, "both head disclosures paint"),
  ("B5 a CSS border back on the head sheet", HS,
   ".head-sheet {\n  position: absolute;", ".head-sheet {\n  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);\n  position: absolute;",
   E2E, "both head disclosures paint"),
  ("S1 the seam's arm (a)", PM,
   "const TAP_IS_A_LOOK = true;", "const TAP_IS_A_LOOK = false;",
   E2E, "a tap opens the mark"),
  ("S2 the release does not toggle", PM,
   '  if (TAP_IS_A_LOOK && e.pointerType === "touch") toggle();\n', "  void e;\n",
   E2E, "a tap opens the mark"),
  ("S3 Chromium's touch click toggles too", PM,
   '  if (TAP_IS_A_LOOK && (e as PointerEvent).pointerType === "touch") return;\n', "",
   E2E, "a tap opens the mark"),
  ("B1 Escape returns focus to the mark", PM,
   "the mark, and after a mouse open it is in the cell, where it stays.\n  close();\n}",
   "the mark, and after a mouse open it is in the cell, where it stays.\n  close();\n  el.value?.focus();\n}",
   E2E, "after a mouse open, Escape keeps"),
  ("B2 the document focusin unbound", PM,
   '  document.addEventListener("focusin", onDocFocusin);\n', "",
   E2E, "after a mouse open, Escape keeps"),
  ("B6 F1 false arm", US,
   "export const SELF_TAKES_A_HAND: boolean = true;", "export const SELF_TAKES_A_HAND: boolean = false;",
   E2E, "the deck paints your swatch"),
  ("B7 the solo row carries no ink", PM,
   'ink: { "--color-user-ink": "var(--ink-press-quiet)" },', "ink: {},",
   E2E, "the mark rests graphite alone"),
  ("U1 F1's true arm binds nothing for you (unit)", US,
   "ink: SELF_TAKES_A_HAND || id !== selfId.value ? ident!.inkFor(index) : {},",
   "ink: false || id !== selfId.value ? ident!.inkFor(index) : {},",
   ("unit", "src/games/shared/useSession.test.ts"), "F1"),
  ("U2 F1's true arm adopts nothing for you (unit)", US,
   "const ink = SELF_TAKES_A_HAND || id !== selfId.value ? ident!.inkFor(index) : {};",
   "const ink = false || id !== selfId.value ? ident!.inkFor(index) : {};",
   ("unit", "src/games/shared/useSession.test.ts"), "F1"),
]
sha = lambda p: hashlib.sha1((F/p).read_bytes()).hexdigest()
only = sys.argv[1:]
for name, path, old, new, (kind, target), grep in BREAKS:
    if only and name.split()[0] not in only: continue
    before = sha(path); text = (F/path).read_text()
    assert text.count(old) == 1, (name, text.count(old))
    (F/path).write_text(text.replace(old, new, 1))
    time.sleep(2)
    if kind == "e2e":
        cmd = ["npx","playwright","test","--config",".plr-self/pw.estate.mts",target,"-g",grep,"--reporter=line","--retries=0"]
    else:
        cmd = ["npx","vitest","run",target,"-t",grep]
    r = subprocess.run(cmd, cwd=F, capture_output=True, text=True)
    (F/path).write_text(text)
    after = sha(path)
    print(f"{name}: exit {r.returncode} · restored sha1 {'OK' if after==before else 'MISMATCH'} {after[:10]}")
    for l in (r.stdout + r.stderr).splitlines():
        s = l.strip()
        if s.startswith(("1 failed","2 failed","3 failed","4 failed","1 passed","2 passed","3 passed","4 passed","1 flaky","Tests ")) or s.startswith("[chromium]") or s.startswith("[webkit]") or "Expected" in s or "Received" in s or "Error:" in s:
            print("   ", s[:170])
    sys.stdout.flush()
    time.sleep(2)
print("BREAKS-DONE")
