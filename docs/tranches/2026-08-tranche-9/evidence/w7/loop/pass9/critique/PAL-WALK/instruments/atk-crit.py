# Critic's attack set: the pass-8 plants N3/N4/N5/N12 FIRST, then their class siblings.
# Each plant = a new src file on its own copy of web/frontend; the gate read BARE, exit to a file.
import subprocess, os, shutil
from concurrent.futures import ThreadPoolExecutor
S = "<lane-scratch>"
SRC = f"{S}/tree/web/frontend"
P = {
 "N3-typedom": 'export const n3 = (el: HTMLElement): void => {\n  el.attributeStyleMap.set("--color-peer-name-ink", "red");\n};\n',
 "N4-insertRule": 'export const n4 = (): void => {\n  document.styleSheets[0].insertRule(".dark { --peer-name-l: 0.5 }");\n};\n',
 "N5-styleEl": 'export const n5 = (): void => {\n  const s = document.createElement("style");\n  s.textContent = ".dark .washi-label { --color-peer-name-ink: #777 }";\n  document.head.append(s);\n};\n',
 "N12-constructed": 'export const n12 = (): void => {\n  const s = new CSSStyleSheet();\n  s.replaceSync(".dark { --peer-name-l: 0.5 }");\n  document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];\n};\n',
 "X1-typedom-band": 'export const x1 = (el: HTMLElement): void => {\n  el.attributeStyleMap.set("--peer-name-l", CSS.number(0.5));\n};\n',
 "X2-insertRule-bound": 'export const x2 = (): void => {\n  const sh = document.styleSheets[0];\n  const ins = sh.insertRule.bind(sh);\n  ins(".dark { --peer-name-l: 0.5 }");\n};\n',
 "X3-style-append": 'export const x3 = (): void => {\n  const s = document.createElement("style");\n  s.append(".dark { --peer-name-l: 0.5 }");\n  document.head.append(s);\n};\n',
 "X4-replace-async": 'export const x4 = async (): Promise<void> => {\n  const s = new CSSStyleSheet();\n  await s.replace(".dark { --peer-name-l: 0.5 }");\n  document.adoptedStyleSheets = [s];\n};\n',
 "X5-cssText": 'export const x5 = (el: HTMLElement): void => {\n  el.style.cssText = "--peer-name-l: 0.5";\n};\n',
 "X6-innerHTML-style": 'export const x6 = (): void => {\n  document.head.insertAdjacentHTML("beforeend", "<style>.dark { --peer-name-l: 0.5 }</style>");\n};\n',
 "X7-setAttribute-style": 'export const x7 = (el: HTMLElement): void => {\n  el.setAttribute("style", "--peer-name-l: 0.5");\n};\n',
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
