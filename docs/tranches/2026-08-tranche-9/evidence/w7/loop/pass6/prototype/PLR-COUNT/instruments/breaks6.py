#!/usr/bin/env python3
"""PLR-COUNT pass 6 — the break battery. Each break edits ONE product file (or two, in order),
runs the LANDED row it must red (both engines, dev :4242), restores every file byte-for-byte and
checks its sha1. Usage: breaks6.py <prefix>... Output: one EXIT line per break."""
import hashlib, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
UTS = FE + "/src/pencil/composables/useTallyStrokes.ts"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
PL = FE + "/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
SP = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6-rig"
MASK = "\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n  mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n}\n</style>"
DARKW = "\n.dark .pl-state,\n.dark .pl-qual,\n.dark .pl-more {\n  color: rgb(70, 68, 66);\n}\n</style>"
DARK = "\n:global(.dark) .pl-state,\n:global(.dark) .pl-qual,\n:global(.dark) .pl-more {\n  color: rgb(70, 68, 66);\n}\n</style>"
BREAKS = {
  # the pass-5 critic's plants FIRST (LAWS P5), as file breaks against the landed row
  "X1b quiet lines masked after 1.2em to 25% (the pass-5 plant)": ([(PL, "</style>", MASK)], "quiet lines paint 4.5:1 on it \\((light, dpr 2|dark, dpr 1|dark, dpr 2)"),
  "X2 quiet lines rgb(70,68,66) in dark (the pass-5 plant)": ([(PL, "</style>", DARK)], "quiet lines paint 4.5:1 on it \\(dark"),
  "X2w the same ink, written so the scoped compiler keeps the descendant": ([(PL, "</style>", DARKW)], "quiet lines paint 4.5:1 on it \\(dark"),
  "X3 arm (c) with the pass-5 name (the state line)": ([(PM, 'const SIX_ARM = "title" as', 'const SIX_ARM = "remainder" as'), (PM, "  remainder.value\n    ? `${LOBBY_COPY.count(TALLY_MAX)} ${LOBBY_COPY.more(remainder.value)}`\n    : stateLine.value,", "  stateLine.value,")], "carries every digit it paints"),
  "L1 forget leaves the tween running": ([(UTS, "      draws.get(k)?.stop();\n      draws.delete(k);\n      delete reveal[k];", "      draws.delete(k);\n      delete reveal[k];")], "leaves mid-draw"),
  "B-16 the written count at the heading rung": ([(PM, ".pt-count {\n  font-size: var(--type-title);", ".pt-count {\n  font-size: var(--type-heading);")], "the plant that breaks the promise"),
  "B-14 the shipped ground translucent": ([(PL, "  background: var(--color-popover);", "  background: color-mix(in srgb, var(--color-popover) 80%, transparent);")], "quiet lines paint 4.5:1 on it \\(light, dpr 2"),
}
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
names = sys.argv[1:] or list(BREAKS)
for name in names:
    key = next(k for k in BREAKS if k.startswith(name))
    edits, grep = BREAKS[key]
    files = sorted({f for f, _, _ in edits})
    saved = {f: (open(f).read(), sha(f)) for f in files}
    for f, old, new in edits:
        src = open(f).read()
        assert src.count(old) == 1, f"{key}: anchor count {src.count(old)} in {os.path.basename(f)}"
        open(f, "w").write(src.replace(old, new, 1))
    time.sleep(3)
    print(f"### {key} :: " + ", ".join(f"{os.path.basename(f)} {saved[f][1][:12]}->{sha(f)[:12]}" for f in files) + f" :: -g '{grep}'", flush=True)
    r = subprocess.run(["npx", "playwright", "test", "--config", ".plr-count6/pw.config.ts", "player-tally.spec.ts", "-g", grep],
                       cwd=FE, capture_output=True, text=True, env=dict(os.environ, PLRC_PWOUT=SP + "/pw-out-breaks", PLRC_WORKERS="2"))
    for line in r.stdout.splitlines():
        if any(s in line for s in ("✓", "✘", " passed", " failed", "Error:", "LEAVE WHILE", "G14 ", "G16 ", "G7 WIDTHS")):
            print("   ", line[:300])
    for f in files:
        open(f, "w").write(saved[f][0])
    time.sleep(2)
    ok = all(sha(f) == saved[f][1] for f in files)
    print(f"EXIT[{key}]={r.returncode} restored={'OK' if ok else 'MISMATCH'}", flush=True)
