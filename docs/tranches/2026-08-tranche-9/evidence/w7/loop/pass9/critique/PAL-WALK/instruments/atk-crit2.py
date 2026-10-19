# Critic's attack set: the pass-8 plants N3/N4/N5/N12 FIRST, then their class siblings.
# Each plant = a new src file on its own copy of web/frontend; the gate read BARE, exit to a file.
import subprocess, os, shutil
from concurrent.futures import ThreadPoolExecutor
S = "<lane-scratch>"
SRC = f"{S}/tree/web/frontend"
P = {
 "X8-concat-rule": 'export const x8 = (): void => {\n  const k = "--peer-" + "name-l";\n  document.styleSheets[0].insertRule(".dark { " + k + ": 0.5 }");\n};\n',
 "X9-template-rule": 'export const x9 = (v: number): void => {\n  const s = new CSSStyleSheet();\n  s.replaceSync(`.dark { --peer-name-l: ${v} }`);\n  document.adoptedStyleSheets = [s];\n};\n',
 "X10-const-name-setProperty": 'const TOK = "--peer-name-l";\nexport const x10 = (el: HTMLElement): void => {\n  el.style.setProperty(TOK, "0.5");\n};\n',
 "X11-fromCharCode": 'export const x11 = (el: HTMLElement): void => {\n  const k = String.fromCharCode(45, 45) + "peer-name-l";\n  el.style.setProperty(k, "0.5");\n};\n',
 "X12-array-join": 'export const x12 = (el: HTMLElement): void => {\n  el.style.setProperty(["--peer", "name", "l"].join("-"), "0.5");\n};\n',
}
def go(item):
    name, body = item
    d = f"{S}/atk/{name}"
    os.makedirs(d, exist_ok=True)
    if not os.path.exists(f"{d}/frontend"):
        subprocess.run(["cp", "-R", SRC, f"{d}/"])
    f = f"{d}/frontend/src/games/shared/critx_{name.replace('-', '_')}.ts"
    open(f, "w").write(body)
    od = subprocess.run(["od", "-c", f], capture_output=True, text=True).stdout
    open(f"{d}/plant.od", "w").write(od)
    load = subprocess.run(["sysctl", "-n", "vm.loadavg"], capture_output=True, text=True).stdout.strip()
    with open(f"{d}/bare.log", "w") as lg:
        r = subprocess.run(["node", "scripts/check-peer-arcs.mjs"], cwd=f"{d}/frontend", stdout=lg, stderr=subprocess.STDOUT)
    open(f"{d}/bare.exit", "w").write(f"{r.returncode}\n")
    return f"{name} exit={r.returncode} load={load}"
with ThreadPoolExecutor(3) as ex:
    for line in ex.map(go, P.items()):
        print(line, flush=True)
print("ALL-DONE", flush=True)
