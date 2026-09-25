#!/usr/bin/env python3
"""PLR-COUNT pass-7 break battery and arm estate: edit product files (one job at a time, HMR on the dev
server :4242), run the LANDED rows both engines, restore by copy, sha1-verify. The pass-6 critic's
plants run FIRST (X1b, X2w, TAIL12, TAILD35 as file edits, L1), then this pass's."""
import hashlib, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
R = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig"
UTS = FE + "/src/pencil/composables/useTallyStrokes.ts"
PL = FE + "/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
MASK = "\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n  mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n}\n</style>"
DARKW = "\n.dark .pl-state,\n.dark .pl-qual,\n.dark .pl-more {\n  color: rgb(70, 68, 66);\n}\n</style>"
TAIL = "\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n}\n</style>"
TAILD = "\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.dark .pl-state,\n.dark .pl-qual,\n.dark .pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 35%, #000 35%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 35%, #000 35%);\n}\n</style>"
FAINT = "\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-text-fill-color: color-mix(in srgb, currentColor 30%, transparent);\n}\n</style>"
G14 = "quiet lines paint 4.5:1 on it"
ARM_C = ('const SIX_ARM = "title"', 'const SIX_ARM = "remainder"')
ARM_B = ('const SIX_ARM = "title"', 'const SIX_ARM = "heading"')
P6NAME = ("? `${stateLine.value}, ${LOBBY_COPY.plus(TALLY_MAX, remainder.value)}`",
          "? `${LOBBY_COPY.count(TALLY_MAX)} ${LOBBY_COPY.more(remainder.value)}`")
B16 = (".pt-count {\n  font-size: var(--type-title);", ".pt-count {\n  font-size: var(--type-heading);")
L1 = ("      draws.get(k)?.stop();\n      draws.delete(k);\n      delete reveal[k];", "      draws.delete(k);\n      delete reveal[k];")
T, M = "player-tally.spec.ts", "player-mark.spec.ts"
JOBS = {
  # the pass-6 critic's plants, FIRST, against every G14 cell (the ungated cell included)
  "X1b":      ([(PL, "</style>", MASK)], T, G14),
  "X2w":      ([(PL, "</style>", DARKW)], T, G14 + " \\(dark"),
  "TAIL12":   ([(PL, "</style>", TAIL)], T, G14),
  "TAILD35":  ([(PL, "</style>", TAILD)], T, G14 + " \\(dark"),
  "L1":       ([(UTS, *L1)], T, "leaves mid-draw"),
  # this pass
  "FAINT30":  ([(PL, "</style>", FAINT)], T, G14),
  "B16":      ([(PM, *B16)], T, "written count's weight"),
  "P6NAME-G7":   ([(PM, *ARM_C), (PM, *P6NAME)], T, "carries every digit"),
  "P6NAME-291":  ([(PM, *ARM_C), (PM, *P6NAME)], M, "never scrolls"),
  # the estate under each arm
  "ARM-C-tally": ([(PM, *ARM_C)], T, "carries every digit|width table|written count's weight|inner leaver|re-draws no survivor"),
  "ARM-C-291":   ([(PM, *ARM_C)], M, "never scrolls"),
  "ARM-B-g16":   ([(PM, *ARM_B)], T, "written count's weight"),
}
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
for name in sys.argv[1:]:
    edits, spec, grep = JOBS[name]
    files = sorted({f for f, _, _ in edits})
    saved = {f: (open(f).read(), sha(f)) for f in files}
    log = f"{R}/logs/brk-{name}.log"
    try:
        for f, old, new in edits:
            src = open(f).read(); assert src.count(old) == 1, (name, old[:40], src.count(old))
            open(f, "w").write(src.replace(old, new, 1))
        time.sleep(3)
        print(f"### {name} :: " + ", ".join(f"{os.path.basename(f)} {saved[f][1][:12]}->{sha(f)[:12]}" for f in files), flush=True)
        r = subprocess.run(["npx", "playwright", "test", "-c", ".plr-count7/pw.config.ts", spec, "-g", grep],
                           cwd=FE, stdout=open(log, "w"), stderr=subprocess.STDOUT)
    finally:
        for f in files: open(f, "w").write(saved[f][0])
        time.sleep(3)
    ok = all(sha(f) == saved[f][1] for f in files)
    txt = open(log).read().splitlines()
    for line in txt:
        if any(s in line for s in ("✓", "✘", " passed", " failed", " skipped")): print("   ", line.strip()[:220])
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if ok else 'MISMATCH'} load={os.getloadavg()[0]:.1f}", flush=True)
print("BREAKS-DONE", flush=True)
