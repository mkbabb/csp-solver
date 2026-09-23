#!/usr/bin/env python3
"""PLR-COUNT pass 5 — drive the three owner forks by flipping ONE const at a time on the work
tree, running the strip instrument against dev :4242, restoring the file and checking its sha1."""
import hashlib, os, subprocess, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
US = FE + "/src/games/shared/useSession.ts"
SP = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig"
env = dict(os.environ, NODE_PATH=FE + "/node_modules", PLRC_DIR=SP + "/inst", PLRC_PWOUT=SP + "/pw-out-strip",
           PLRC_WORKERS="2", PROTO_DEV="http://127.0.0.1:4242", CONTROL_DEV="http://127.0.0.1:4244", CROPS=SP + "/crops")
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
ARMS = [
  ("shipped", None, None, None, "strip|rows|solo desk"),
  ("remainder", PM, 'const SIX_ARM = "title" as', 'const SIX_ARM = "remainder" as', "strip"),
  ("gate", PM, 'const SOLO_ARM: "keep" | "gate-on-a-room" = "keep";', 'const SOLO_ARM: "keep" | "gate-on-a-room" = "gate-on-a-room";', "solo desk"),
  ("f1false", US, "const SELF_TAKES_ROOM_INK = true;", "const SELF_TAKES_ROOM_INK = false;", "strip light"),
]
for arm, f, old, new, grep in ARMS:
    before = sha(f) if f else None
    if f:
        src = open(f).read(); assert src.count(old) == 1, arm
        open(f, "w").write(src.replace(old, new)); time.sleep(3)
    for proj in ("chromium", "webkit"):
        r = subprocess.run(["npx", "playwright", "test", "--config", ".plr-count/pw.config.ts", f"--project={proj}",
                            "p5-strip.spec.ts", "-g", grep], cwd=FE, env=dict(env, ARM=arm), capture_output=True, text=True)
        print(f"### {arm} {proj} -g '{grep}'")
        for line in r.stdout.splitlines():
            if any(s in line for s in ("✓", "✘", "passed", "failed", "Error:")): print("   ", line[:220])
        print(f"EXIT[{arm}/{proj}]={r.returncode}", flush=True)
    if f:
        open(f, "w").write(src); time.sleep(2)
        print(f"RESTORED[{arm}]={'OK' if sha(f) == before else 'MISMATCH'} {os.path.basename(f)} {before[:12]}", flush=True)
print("### DONE")
