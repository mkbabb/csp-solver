# PLR-COUNT pass-6 critic break battery: edit one product file, run the LANDED row (both engines, dev :4242), restore, sha1-check.
import hashlib, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
UTS = FE + "/src/pencil/composables/useTallyStrokes.ts"
PL = FE + "/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
MASK = "\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n  mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n}\n</style>"
DARKW = "\n.dark .pl-state,\n.dark .pl-qual,\n.dark .pl-more {\n  color: rgb(70, 68, 66);\n}\n</style>"
TAIL = "\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n}\n</style>"
TAILD = "\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.dark .pl-state,\n.dark .pl-qual,\n.dark .pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 35%, #000 35%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 35%, #000 35%);\n}\n</style>"
G14 = "quiet lines paint 4.5:1 on it \\((light, dpr 2|dark, dpr 1|dark, dpr 2)"
BREAKS = {
  "X1b": ([(PL, "</style>", MASK)], G14),
  "X2w": ([(PL, "</style>", DARKW)], "quiet lines paint 4.5:1 on it \\(dark"),
  "TAIL12": ([(PL, "</style>", TAIL)], G14),
  "TAILD35": ([(PL, "</style>", TAILD)], "quiet lines paint 4.5:1 on it \\(dark, dpr 2"),
  "L1": ([(UTS, "      draws.get(k)?.stop();\n      draws.delete(k);\n      delete reveal[k];", "      draws.delete(k);\n      delete reveal[k];")], "leaves mid-draw"),
}
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
for name in sys.argv[1:]:
    edits, grep = BREAKS[name]
    files = sorted({f for f, _, _ in edits})
    saved = {f: (open(f).read(), sha(f)) for f in files}
    try:
        for f, old, new in edits:
            src = open(f).read(); assert src.count(old) == 1, (name, src.count(old))
            open(f, "w").write(src.replace(old, new, 1))
        time.sleep(3)
        print(f"### {name} :: " + ", ".join(f"{os.path.basename(f)} {saved[f][1][:12]}->{sha(f)[:12]}" for f in files), flush=True)
        r = subprocess.run(["npx", "playwright", "test", "--config", ".plrc6crit/pw.config.ts", "player-tally.spec.ts", "-g", grep],
                           cwd=FE, capture_output=True, text=True, env=dict(os.environ, CRIT_PWOUT=f"/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6crit/pw-out-{name}"))
        for line in r.stdout.splitlines():
            if any(s in line for s in ("✓", "✘", " passed", " failed", "LEAVE WHILE", "G14 ", "Error:")): print("   ", line[:400])
    finally:
        for f in files: open(f, "w").write(saved[f][0])
        time.sleep(2)
    ok = all(sha(f) == saved[f][1] for f in files)
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if ok else 'MISMATCH'}", flush=True)
