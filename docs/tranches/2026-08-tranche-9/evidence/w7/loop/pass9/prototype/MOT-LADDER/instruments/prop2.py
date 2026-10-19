import sys
p=sys.argv[1]; s=open(p).read()
def rep(old,new):
    global s
    assert s.count(old)==1, old[:60]; s=s.replace(old,new)
helper = r'''// LADDER (pass 9, PROPOSED · clock-context): the VALUE a read feeds. A read that keeps its count and
// lets the expression return another value (`leave && whisper`, `[leave, whisper][1]`, `c ? whisper :
// leave`, `(leave, whisper)`, `Math.min.call(null, leave, 40)`) is the consumer's value, not its read
// (pass-8 critique §3.4, K11 K16 K17 K12 K14). Returns the context's name, or null for a bare read.
const OPEN = { "(": ")", "[": "]", "{": "}" };
const CLOSE = { ")": "(", "]": "[", "}": "{" };
function matchClose(s, i) {
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (OPEN[s[j]]) d++;
    else if (CLOSE[s[j]] && --d === 0) return j;
  }
  return s.length;
}
function depth0(span, re) {
  let d = 0;
  for (let i = 0; i < span.length; i++) {
    const c = span[i];
    if (OPEN[c]) d++;
    else if (CLOSE[c]) d--;
    else if (d === 0 && re.test(span.slice(i))) return true;
  }
  return false;
}
function valueContext(s, a, b) {
  let d = 0;
  let left = -1;
  let opener = -1;
  for (let i = a - 1; i >= 0; i--) {
    const c = s[i];
    if (CLOSE[c]) d++;
    else if (OPEN[c]) {
      if (d === 0) {
        opener = i;
        if (left < 0) left = i + 1;
        break;
      }
      d--;
    } else if (d === 0 && left < 0) {
      if (c === "," || c === ";") left = i + 1;
      else if (c === "=" && !/[=!<>]/.test(s[i - 1] ?? "") && s[i + 1] !== "=" && s[i + 1] !== ">") left = i + 1;
      else if (c === "\n" && !/(&&|\|\||\?\?|[?:]|[-+*/%&|^~!<>])\s*$/.test(s.slice(Math.max(0, i - 4), i))) left = i + 1;
    }
  }
  if (left < 0) left = 0;
  let right = s.length;
  d = 0;
  for (let j = b; j < s.length; j++) {
    const c = s[j];
    if (OPEN[c]) d++;
    else if (CLOSE[c]) {
      if (d === 0) {
        right = j;
        break;
      }
      d--;
    } else if (d === 0 && (c === "," || c === ";")) {
      right = j;
      break;
    } else if (d === 0 && c === "\n" && !/^\s*(&&|\|\||\?\?|[?:.])/.test(s.slice(j + 1, j + 12))) {
      right = j;
      break;
    }
  }
  const span = s.slice(left, right);
  if (depth0(span, /^(&&|\|\||\?\?)/)) return "logical";
  if (depth0(span, /^\?(?![.?])/)) return "ternary";
  // a read in a ternary's arm: `c ? x : READ` — a `:` at depth 0 to the left with its `?` before it
  if (depth0(span, /^:/) && /\?(?![.?])/.test(span)) return "ternary";
  if (opener >= 0) {
    const pre = s.slice(Math.max(0, opener - 40), opener);
    if (s[opener] === "(") {
      if (/\.\s*(?:call|apply)\s*$|\bReflect\s*\.\s*apply\s*$/.test(pre)) return "call-apply";
      if (!/[\w$)\]]\s*$/.test(pre)) {
        const inner = s.slice(opener + 1, matchClose(s, opener));
        if (depth0(inner, /^,/)) return "comma";
      }
    } else if (s[opener] === "[" && !/[\w$)\]]\s*$/.test(pre)) {
      const end = matchClose(s, opener);
      if (/^\s*(?:\[|\.|\?\.)/.test(s.slice(end + 1, end + 8))) return "indexed-literal";
    }
  }
  return null;
}

// ---------------------------------------------------------------------------- clock reads (LADDER)'''
rep('''// ---------------------------------------------------------------------------- clock reads (LADDER)''', helper)
rep('''      how: inMath ? "math" : bracket ? "bracket" : op ? "operator" : "read",
      op: (opB ?? opA)?.[1] ?? null,
    });''','''      how: inMath ? "math" : bracket ? "bracket" : op ? "operator" : "read",
      op: (opB ?? opA)?.[1] ?? null,
      ...(on("clock-context")
        ? { ctx: valueContext(s, m.index, m.index + m[0].length) }
        : {}),
    });''')
open(p,'w').write(s); print("ok")
