# Reorder the README's sections and splice in the scratch drafts. Usage: python3 assemble.py <README> <scratch dir>
import re, sys, pathlib
readme, sd = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
text = readme.read_text()
head, *rest = re.split(r'(?m)^(?=## )', text)
secs = {s.split('\n', 1)[0]: s for s in rest}
def pick(prefix):
    k = [h for h in secs if h.startswith(prefix)]
    assert len(k) == 1, (prefix, k)
    return secs.pop(k[0]).rstrip() + '\n\n'
summary = (sd / 'readme-summary.md').read_text().rstrip() + '\n\n'
out = head.rstrip() + '\n\n' + summary
for p in ['## 0 ', '## 1 ', '## 2 ', '## 3 ', '## 4 ']:
    out += pick(p)
out += (sd / 'readme-bat.md').read_text().rstrip() + '\n\n'
out += pick('## 5b ')
out += pick('## 6 ')
out += pick('## 7 ')
for f in ['readme-incidents.md', 'readme-gaps.md']:
    out += (sd / f).read_text().rstrip() + '\n\n'
assert not secs, list(secs)
readme.write_text(out.rstrip() + '\n')
print(len(out))
