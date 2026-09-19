import re, glob, json, os
S = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad'
W = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-6/web/frontend'

after = sorted(glob.glob(W + '/dist/assets/*.css'))
ctrl = sorted(glob.glob(S + '/control/web/frontend/dist/assets/*.css'))
print('after css:', [os.path.basename(f) for f in after])
print('control css:', [os.path.basename(f) for f in ctrl])


def decls(files):
    """Every `selector{body}` pair, data-v hashes normalised, timing declarations dropped."""
    out = set()
    for f in files:
        css = open(f).read()
        css = re.sub(r'data-v-[0-9a-f]{8}', 'data-v-X', css)
        for m in re.finditer(r'([^{}@]+)\{([^{}]*)\}', css):
            sel = re.sub(r'\s+', ' ', m.group(1)).strip()
            body = m.group(2)
            keep = []
            for d in body.split(';'):
                d = d.strip()
                if not d:
                    continue
                prop = d.split(':')[0].strip()
                # timing lines are this family's SUBJECT; the pi claim is about everything else
                if prop.startswith(('transition', 'animation', '--motion-', '--rung-', '--verb-')):
                    continue
                keep.append(re.sub(r'\s+', ' ', d))
            if keep:
                out.add(sel + '{' + ';'.join(sorted(keep)) + '}')
    return out


a, b = decls(after), decls(ctrl)
added = sorted(a - b)
removed = sorted(b - a)
print('substantive rules after: %d  control: %d' % (len(a), len(b)))
print('ADDED  (after has, control does not): %d' % len(added))
for x in added[:20]:
    print('   +', x[:150])
print('REMOVED (control has, after does not): %d' % len(removed))
for x in removed[:20]:
    print('   -', x[:150])
json.dump({'afterRules': len(a), 'controlRules': len(b), 'added': added, 'removed': removed},
          open(S + '/readings/g-css-setdiff.json', 'w'), indent=2)
