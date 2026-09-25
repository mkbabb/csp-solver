#!/usr/bin/env python3
"""PLR-COUNT pass 7: flip SIX_ARM (and the pass-6 name plant) in PlayerMark.vue, run named rows
both engines against the dev server, restore by copy, sha1-verify. One arm at a time (HMR)."""
import hashlib, shutil, subprocess, sys, time, os
W = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
S = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig"
PM = W + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
sha = lambda p: hashlib.sha1(open(p, "rb").read()).hexdigest()[:12]
HOLD = S + "/hold.PlayerMark.vue"
ARMS = {
  "title": [],
  "heading": [('const SIX_ARM = "title"', 'const SIX_ARM = "heading"')],
  "remainder": [('const SIX_ARM = "title"', 'const SIX_ARM = "remainder"')],
  # the pass-6 name: the count of five and the sheet's `more`, a second referent
  "remainder+P6NAME": [('const SIX_ARM = "title"', 'const SIX_ARM = "remainder"'),
    ("? `${stateLine.value}, ${LOBBY_COPY.plus(TALLY_MAX, remainder.value)}`",
     "? `${LOBBY_COPY.count(TALLY_MAX)} ${LOBBY_COPY.more(remainder.value)}`")],
}
def run(arm, spec, grep, tag):
  base = sha(PM); shutil.copy(PM, HOLD)
  src = open(PM).read()
  for a, b in ARMS[arm]:
    assert a in src, (arm, a); src = src.replace(a, b)
  open(PM, "w").write(src); time.sleep(3)
  log = f"{S}/logs/arm-{tag}.log"
  r = subprocess.run(["npx", "playwright", "test", "-c", ".plr-count7/pw.config.ts", spec, "-g", grep],
                     cwd=W, stdout=open(log, "w"), stderr=subprocess.STDOUT)
  shutil.copy(HOLD, PM)
  ok = sha(PM) == base
  print(f"ARM {arm} spec {spec} grep '{grep}' EXIT {r.returncode} RESTORED={'OK' if ok else 'FAIL'} sha {sha(PM)} log {log}", flush=True)
  time.sleep(3)
if __name__ == "__main__":
  for job in sys.argv[1:]:
    arm, spec, grep, tag = job.split("|")
    run(arm, spec, grep, tag)
  print("ARMS-DONE", os.getloadavg(), flush=True)
