# PLR-COUNT pass-6 critic: flip SIX_ARM in PlayerMark.vue, run a grep of a spec file, restore byte-for-byte (sha1 checked).
import hashlib, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
arm, spec, grep, out, testdir = sys.argv[1:6]
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
src = open(PM).read(); before = sha(PM)
old = 'const SIX_ARM = "title" as'; assert src.count(old) == 1
open(PM, "w").write(src.replace(old, f'const SIX_ARM = "{arm}" as')); time.sleep(3)
print("flipped", before[:12], "->", sha(PM)[:12], flush=True)
try:
    r = subprocess.run(["npx", "playwright", "test", "--config", ".plrc6crit/pw.config.ts", spec, "-g", grep], cwd=FE, capture_output=True, text=True,
                       env=dict(os.environ, CRIT_OUT=out, CRIT_DIR=testdir))
    for l in r.stdout.splitlines():
        if any(k in l for k in ("✓", "✘", " passed", " failed", "Error:", "Expected", "Received", "›")): print(l[:300])
finally:
    open(PM, "w").write(src); time.sleep(2)
print(f"EXIT={r.returncode} RESTORED={'OK' if sha(PM) == before else 'MISMATCH'} {before[:12]}", flush=True)
