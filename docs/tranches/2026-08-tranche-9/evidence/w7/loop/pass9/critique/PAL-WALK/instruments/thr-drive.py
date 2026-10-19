import subprocess, sys
from concurrent.futures import ThreadPoolExecutor
S = "<lane-scratch>"
rows = [l.rstrip("\n").split("\t") for l in open(f"{S}/thr-plants.txt") if l.strip()]
only = sys.argv[1:]
rows = [r for r in rows if not only or r[0] in only]
def go(r):
    name, old, new = (r + ["", "", ""])[:3]
    subprocess.run(["bash", f"{S}/thr.sh", name, old, new])
    return name
with ThreadPoolExecutor(3) as ex:
    for n in ex.map(go, rows):
        print("finished", n, flush=True)
print("ALL-DONE", flush=True)
