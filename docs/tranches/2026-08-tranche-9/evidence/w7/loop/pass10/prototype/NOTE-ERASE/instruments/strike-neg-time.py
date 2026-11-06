# strike-neg-time.py <spec>: every in-run negative's `ms >= whisper` becomes the held-frames clause (LAWS P9 §F); no duplicate line
import sys, pathlib, re
p = pathlib.Path(sys.argv[1]); L = p.read_text().split("\n"); out = []; n = 0
NEW = "expect(leave.painted).toBeGreaterThan(ZERO_LEAVE_FRAMES);"
for i, line in enumerate(L):
    if line.strip() == "expect(leave.ms).toBeGreaterThanOrEqual(MOTION.rungs.whisper);":
        ind = line[: len(line) - len(line.lstrip())]; n += 1
        nxt = L[i + 1].strip() if i + 1 < len(L) else ""
        if nxt.startswith("expect(leave.painted).toBeGreaterThan("):
            continue
        out.append(ind + NEW); continue
    out.append(line)
p.write_text("\n".join(out)); print(p.name, "struck", n)
