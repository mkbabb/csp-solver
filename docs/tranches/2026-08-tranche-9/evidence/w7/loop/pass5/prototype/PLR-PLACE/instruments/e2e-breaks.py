#!/usr/bin/env python3
"""PLR-PLACE pass 5 — the e2e break battery (LAWS: BREAK-TEST is what born-RED means). Each break
edits THIS tree, waits for the dev server's HMR, runs the LANDED row(s) on both engines, restores
the file(s) and verifies sha1. Usage: e2e-breaks.py <frontend dir> <out> [names...]"""
import hashlib, subprocess, sys, time, json, os
FE, OUT = sys.argv[1], sys.argv[2]
ONLY = set(sys.argv[3:])
MARK = f"{FE}/src/pencil/chrome/PlayerMark/PlayerMark.vue"
LOBBY = f"{FE}/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
APP = f"{FE}/src/App.vue"
BREAKS = {
  "E1 guard ablated": ([(MARK, "    if (id in timers && pending[id] === pos) continue;\n", "")], "the hostage"),
  "E2 open && chart": ([(LOBBY, '      v-if="chart"', '      v-if="open && chart"')], "a close is a pose"),
  "E3 ring from lastCell": ([(APP, "  registerGameFollower,\n  sentCell,", "  registerGameFollower,\n  lastCell,\n  sentCell,"), (APP, "  self: sentCell.value ?? null,", "  self: lastCell.value,")], "your ring and the room agree"),
  "E4 no sheet click": ([(MARK, '    :chart="chart"\n    @click="close"\n', '    :chart="chart"\n')], "bottom edge of the sheet"),
}
sha = lambda p: hashlib.sha1(open(p, "rb").read()).hexdigest()
res = []
for name, (edits, grep) in BREAKS.items():
    if ONLY and name.split()[0] not in ONLY: continue
    files = {p for p, _, _ in edits}
    keep = {p: open(p).read() for p in files}; before = {p: sha(p) for p in files}
    for p, a, b in edits:
        s = open(p).read(); assert s.count(a) == 1, (name, a); open(p, "w").write(s.replace(a, b))
    time.sleep(4)
    env = dict(os.environ, PLC_PORT="4243")
    r = subprocess.run(["npx", "playwright", "test", "-c", ".plr-place/pw.config.ts", "e2e/player-place.spec.ts", "-g", grep, "--reporter=json"], cwd=FE, capture_output=True, text=True, env=env)
    for p in files: open(p, "w").write(keep[p])
    ok = all(sha(p) == before[p] for p in files)
    time.sleep(4)
    rows = []
    try:
        d = json.loads(r.stdout)
        def walk(s):
            for sp in s.get("specs", []):
                for t in sp["tests"]:
                    for x in t["results"]:
                        rows.append(f"  {t['projectName']:8} {x['status']:8} {sp['title']} :: {((x.get('error') or {}).get('message') or '').splitlines()[0][:150] if x.get('error') else ''}")
            for c in s.get("suites", []): walk(c)
        for s in d["suites"]: walk(s)
    except Exception as e:
        rows.append(f"  unparsed: {e} {r.stderr[-300:]}")
    res.append(f"## {name}  exit={r.returncode}  restored-sha1={'OK' if ok else 'MISMATCH'}")
    res += rows
    open(OUT, "w").write("\n".join(res) + "\n")
print("\n".join(res))
