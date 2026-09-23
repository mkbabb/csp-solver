import sys, json
# usage: resolve.py file choices.json  -> choices: list of "mine" | "theirs" | "both" | {"text": "..."}
path, cj = sys.argv[1], sys.argv[2]
choices = json.load(open(cj))
out, i, lines = [], 0, open(path).read().split('\n')
k = 0
while i < len(lines):
    l = lines[i]
    if l.startswith('<<<<<<< '):
        mine, theirs = [], []
        i += 1
        while not lines[i].startswith('======='): mine.append(lines[i]); i += 1
        i += 1
        while not lines[i].startswith('>>>>>>> '): theirs.append(lines[i]); i += 1
        c = choices[k]; k += 1
        if c == 'mine': out += mine
        elif c == 'theirs': out += theirs
        elif c == 'both': out += mine + theirs
        elif c == 'theirs+mine': out += theirs + mine
        else: out += c['text'].split('\n')
    else:
        out.append(l)
    i += 1
assert k == len(choices), (k, len(choices))
open(path, 'w').write('\n'.join(out))
print(path.split('/')[-1], 'resolved', k)
