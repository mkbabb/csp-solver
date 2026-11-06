# plants.py <apply|restore> <name> <frontend-dir> : the FILE plants, one exact edit each (count must be 1)
import sys, hashlib, os, shutil, time
act, name, fe = sys.argv[1:4]
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = {
 "TOKENF": ("src/assets/index.css",
   "var(--color-pencil-graphite, var(--grid-line-color)) 68%,\n    transparent\n  );\n  /* Progress-ink",
   "var(--color-pencil-graphite, var(--grid-line-color)) 58%,\n    transparent\n  );\n  /* Progress-ink"),
 "PLUSSPLIT": ("src/pencil/chrome/PlayerMark/PlayerMark.vue",
   "      >{{ count }}</span\n    >",
   "      >{{ count }}<i>{{ TALLY_MAX }}</i>{{ LOBBY_COPY.plus(0, 0).slice(1, -1) }}<i>{{ count - TALLY_MAX }}</i></span\n    >"),
 "PLUSATTR": ("src/pencil/chrome/PlayerMark/PlayerMark.vue",
   "      class=\"pt-count\"\n",
   "      class=\"pt-count\"\n      :data-p=\"LOBBY_COPY.plus(TALLY_MAX, count - TALLY_MAX)\"\n"),
 "OPA95F": ("src/pencil/chrome/PlayerMark/PlayerLobby.vue", ".pl-qual {", ".pl-state, .pl-qual, .pl-more { opacity: 0.95; }\n.pl-qual {"),
}
rel, a, b = P[name]
f = os.path.join(fe, rel); bk = os.path.join(S, "plants", name + ".bak")
os.makedirs(os.path.dirname(bk), exist_ok=True)
sha = lambda p: hashlib.sha1(open(p, "rb").read()).hexdigest()
if act == "apply":
    s = open(f).read()
    assert s.count(a) == 1, f"{name}: anchor count {s.count(a)}"
    shutil.copyfile(f, bk)
    s = s.replace(a, b)
    if name == "PLUSATTR":
        s = s.replace(".pt-count {", ".pt-count::after { content: attr(data-p); }\n.pt-count {", 1)
    open(f, "w").write(s)
    print(f"planted {name} {rel} {sha(bk)[:8]} -> {sha(f)[:8]}")
else:
    open(f, "wb").write(open(bk, "rb").read()); os.utime(f, None)
    ok = sha(f) == sha(bk)
    print(f"restored {name} {rel} {sha(f)[:8]} {'OK' if ok else 'MISMATCH'}")
