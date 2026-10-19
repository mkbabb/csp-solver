# Critic's independent re-derivation of WALK's gate-2 all-pairs table (no import from the gate).
# Replicates playerIdentity.ts hueAt/chromaAt/intoArc, paints each string to 8-bit sRGB (clamped,
# rounded), returns to OKLab, and reads every pair among hands 0..n-1.
import math, sys, itertools

ARCS_TREE = [(0, 27.1616), (51.1659, 108.7459), (133.985, 178.6121), (236.3332, 275.8809),
             (279.7172, 306.5712), (333.0184, 360)]
ARCS_WAVE = [(0, 27.1616), (51.1659, 108.7459), (133.985, 178.6121), (236.3332, 274.8741),
             (280.009, 306.5712), (333.0184, 360)]
CAP = 0.215
BANDS = {"digit": (0.44, 0.65), "ring": (0.295, 0.79), "name": (0.295, 0.86)}

def mk(arcs):
    opn, cut = [], 0
    for a, b in arcs:
        if a > cut: opn.append((cut, a))
        cut = max(cut, b)
    if cut < 360: opn.append((cut, 360))
    span = sum(b - a for a, b in opn)
    step = span * ((3 - math.sqrt(5)) / 2)
    def into(h, a, b):
        return min(max(round(h * 100) / 100, math.ceil(a * 100) / 100), math.floor(b * 100) / 100)
    def hue(i):
        p = ((i * step) % span + span) % span
        for a, b in opn:
            if p < b - a: return into(a + p, a, b)
            p -= b - a
        a, b = opn[-1]; return into(b, a, b)
    return hue, span

def lin(l, c, h):
    a = c * math.cos(math.radians(h)); b = c * math.sin(math.radians(h))
    x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
    y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
    z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
    return [4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
            -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
            -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z]

def ingamut(l, c, h): return all(-1e-4 <= v <= 1.0001 for v in lin(l, c, h))

def chroma(h, bands):
    if all(ingamut(l, CAP, h) for l in bands): return CAP
    lo, hi = 0.0, CAP
    for _ in range(20):
        m = (lo + hi) / 2
        if all(ingamut(l, m, h) for l in bands): lo = m
        else: hi = m
    return lo

def enc(v):
    v = min(max(v, 0.0), 1.0)
    return 12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055
def dec(u): return u / 12.92 if u <= 0.04045 else ((u + 0.055) / 1.055) ** 2.4

def paint(l, c, h):
    rgb8 = [round(enc(v) * 255) for v in lin(l, c, h)]
    r, g, b = [dec(u / 255) for u in rgb8]
    L = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    M = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    S = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    return (0.2104542553 * L + 0.7936177850 * M - 0.0040720468 * S,
            1.9779984951 * L - 2.4285922050 * M + 0.4505937099 * S,
            0.0259040371 * L + 0.7827717662 * M - 0.8086757660 * S)

def de(p, q): return math.dist(p, q)

def table(inks, n, floor=0.10):
    ds = [(de(inks[i], inks[j]), i, j) for i, j in itertools.combinations(range(n), 2)]
    under = sum(1 for d, _, _ in ds if d < floor)
    w = min(ds)
    return under, len(ds), w

def run(label, arcs):
    hue, span = mk(arcs)
    print(f"== {label}: open {span:.4f} deg")
    for s, bands in BANDS.items():
        for k, arm in enumerate(("light", "dark")):
            L = bands[k]
            inks = []
            for i in range(144):
                h = hue(i); c = round(chroma(h, bands), 4)
                inks.append(paint(L, c, round(h, 2)))
            for n in (2, 3, 5, 8, 16):
                fl = 0.075 if (s == "ring" and arm == "light") else 0.10
                u, p, w = table(inks, n, fl)
                print(f"  {s:5s} {arm:5s} n={n:2d} under {u}/{p} worst {w[0]:.4f} ({w[1]}-{w[2]}) floor {fl}")

def head():
    print("== HEAD oklch(L 0.11 i*137.5) L 0.5/0.8")
    for arm, L in (("light", 0.5), ("dark", 0.8)):
        inks = [paint(L, 0.11, (i * 137.5) % 360) for i in range(144)]
        for n in (5, 8, 16):
            u, p, w = table(inks, n)
            print(f"  head  {arm:5s} n={n:2d} under {u}/{p} worst {w[0]:.4f} ({w[1]}-{w[2]})")

run("tree 74a2b5d9+pass9", ARCS_TREE)
run("union acde977b+delta", ARCS_WAVE)
head()
