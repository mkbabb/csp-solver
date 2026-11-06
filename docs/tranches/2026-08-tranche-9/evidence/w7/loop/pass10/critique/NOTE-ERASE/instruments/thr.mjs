const variants = {
  clean: (s) => s,
  "ZLF=3": (s) => s.replace("ZERO_LEAVE_FRAMES = 2", "ZERO_LEAVE_FRAMES = 3"),
  "ZLF=1": (s) => s.replace("ZERO_LEAVE_FRAMES = 2", "ZERO_LEAVE_FRAMES = 1"),
  "cut 0s clause": (s) => s.replace("leave.animationDuration === '0s' &&", ""),
  "cut frame clause": (s) => s.replace("&& leave.painted <= ZERO_LEAVE_FRAMES", ""),
  "disjunct: 0s || frames": (s) => s.replace("=== '0s' &&", "=== '0s' ||"),
};
const SRC = "const ZERO_LEAVE_FRAMES = 2;\nconst zeroLengthLeave = (leave) =>\n  leave.animationDuration === '0s' && leave.painted <= ZERO_LEAVE_FRAMES;";
const LIT = "  expect(zeroLengthLeave({ animationDuration: '0s', painted: 1 })).toBe(true);\n  expect(zeroLengthLeave({ animationDuration: '0s', painted: 2 })).toBe(true);\n  expect(zeroLengthLeave({ animationDuration: '0s', painted: 3 })).toBe(false);\n  expect(zeroLengthLeave({ animationDuration: '0.001s', painted: 1 })).toBe(false);";
for (const [k, f] of Object.entries(variants)) {
  const code = f(SRC) + "\nconst expect = (v) => ({ toBe: (w) => { if (v !== w) throw new Error('RED ' + v + ' != ' + w); } });\n" + LIT;
  try { new Function(code)(); console.log(k + ": GREEN"); } catch (e) { console.log(k + ": " + e.message); }
}
