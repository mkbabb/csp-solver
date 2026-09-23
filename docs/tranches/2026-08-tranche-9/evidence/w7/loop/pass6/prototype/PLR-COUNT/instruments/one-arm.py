import hashlib, os, subprocess, sys, time
FE = os.getcwd(); PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
arm, grep = sys.argv[1], sys.argv[2]
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
src = open(PM).read(); before = sha(PM)
old = 'const SIX_ARM = "title" as'; assert src.count(old) == 1
open(PM, "w").write(src.replace(old, f'const SIX_ARM = "{arm}" as')); time.sleep(3)
r = subprocess.run(["npx", "playwright", "test", "--config", ".plr-count6/pw.config.ts", "player-tally.spec.ts", "-g", grep], capture_output=True, text=True)
for l in r.stdout.splitlines():
    if any(k in l for k in ("✓", "✘", " passed", " failed", "G16 ", "Error:")): print(l[:260])
open(PM, "w").write(src); time.sleep(2)
print(f"EXIT={r.returncode} RESTORED={'OK' if sha(PM) == before else 'MISMATCH'} {before[:12]}")
