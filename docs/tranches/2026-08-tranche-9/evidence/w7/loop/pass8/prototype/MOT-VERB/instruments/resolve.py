import re, sys
S = sys.argv[1]
pat = re.compile(r'^<<<<<<< [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n', re.S | re.M)
def res(name, fn):
    s = open(f'{S}/{name}.merged').read()
    n = [0]
    def sub(m):
        n[0] += 1
        return fn(m.group(1), m.group(2))
    out = pat.sub(sub, s)
    assert '<<<<<<<' not in out and '>>>>>>>' not in out
    open(f'{S}/{name}.resolved', 'w').write(out)
    print(name, 'hunks resolved', n[0])
# the manifest: both sides, sorted (the list is alphabetical)
res('check-pw-projects.mjs', lambda u, v: ''.join(sorted(set((u + v).splitlines(True)))))
# the union's comment already carries the knip cure's reason: take it whole
res('pencilConfig.ts', lambda u, v: u)
# VERB's comment (the frame lands), in the union's palette word (the trace is gold on the union)
res('gridPaths.ts', lambda u, v: v.replace('the violet trace', 'the gold trace'))
