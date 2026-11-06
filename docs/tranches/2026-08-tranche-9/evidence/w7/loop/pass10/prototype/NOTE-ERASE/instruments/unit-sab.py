import subprocess, sys, shutil, pathlib, re
W = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend")
S = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE")
f = W / "src/pencil/chrome/MarginNote.vue"
bak = S / "MarginNote.vue.unitsab.bak"
shutil.copy(f, bak)
src = bak.read_text()
key = '''          "animationName" in a &&
          a.playState === "running" &&
          a.timeline === document.timeline,'''
assert key in src
plants = {
  "clean": src,
  "S0-presence(pass9)": src.replace(key, '          "animationName" in a,'),
  "S1-no-playState": src.replace(key, '          "animationName" in a &&\n          a.timeline === document.timeline,'),
  "S2-no-timeline": src.replace(key, '          "animationName" in a &&\n          a.playState === "running",'),
  "S3-no-animationName": src.replace(key, '          a.playState === "running" &&\n          a.timeline === document.timeline,'),
  "S4-playState!==idle": src.replace('a.playState === "running"', 'a.playState !== "idle"'),
  "S5-??true": src.replace(") ?? false;", ") ?? true;"),
}
out = open(S / "logs/unit-sab.txt", "w")
try:
  for name, text in plants.items():
    assert name == "clean" or text != src, name
    f.write_text(text)
    r = subprocess.run([str(pathlib.Path.home()/".claude/guard/guarded"), "--light", "--timeout", "5", "--", "npx", "vitest", "run", "--maxWorkers=2", "src/pencil/chrome/marginNote.motion.test.ts"], cwd=W, capture_output=True, text=True)
    fails = sorted(set(re.findall(r"FAIL .*?> (.*?)(?:\s\d+ms)?$", r.stdout + r.stderr, re.M)))
    tests = re.findall(r"Tests\s+(.*)", r.stdout)
    out.write(f"{name}\texit={r.returncode}\t{tests[-1] if tests else '?'}\n")
    for x in fails: out.write(f"    RED: {x}\n")
    out.flush()
finally:
  shutil.copy(bak, f)
  out.write("restored " + str(f.read_text() == src) + "\n"); out.close()
