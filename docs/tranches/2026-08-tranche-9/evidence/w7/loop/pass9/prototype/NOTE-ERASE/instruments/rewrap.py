# rewrap.py <file> <first line of paragraph>... — rewrap each named `//` paragraph at 100 columns (words kept)
import sys, textwrap
p = sys.argv[1]; L = open(p).read().split("\n")
for head in sys.argv[2:]:
    i = next(k for k, l in enumerate(L) if l.startswith(head))
    j = i
    while j < len(L) and L[j].startswith("// "): j += 1
    words = " ".join(l[3:] for l in L[i:j])
    new = ["// " + x for x in textwrap.wrap(words, width=97, break_long_words=False, break_on_hyphens=False)]
    assert " ".join(x[3:] for x in new).split() == words.split()
    L[i:j] = new
    print(p[-40:], head[:40], j - i, "->", len(new), "max", max(map(len, new)))
open(p, "w").write("\n".join(L))
