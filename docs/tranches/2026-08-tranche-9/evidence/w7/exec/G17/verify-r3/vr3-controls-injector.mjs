// Verifier r3: splice MY OWN controls into a scanner copy, run its self-test, report each row.
import fs from "node:fs";

const CONTROLS = [
  {
    name: "VR3-A · a wrapper OVER A WRAPPER (the header claims a fixed point)",
    rel: "c.ts",
    src:
      "const { say: sayBoard } = useLiveRegion();\n" +
      "function announce(line: string) {\n  sayBoard(line);\n}\n" +
      "function deal(msg: string) {\n  announce(msg);\n}\n" +
      'deal("dealt by the solver");',
    want: 1,
  },
  {
    name: "VR3-B · a wrapper that TRANSFORMS its parameter before speaking",
    rel: "c.ts",
    src:
      "const { say: sayBoard } = useLiveRegion();\n" +
      "function announce(line: string) {\n  sayBoard(line.trim());\n}\n" +
      'announce("filled by the solver");',
    want: 1,
  },
  {
    name: "VR3-C · a voice called with OPTIONAL CALL syntax",
    rel: "c.ts",
    src:
      "const { say: sayBoard } = useLiveRegion();\n" +
      'sayBoard?.("filled by the solver");',
    want: 1,
  },
  {
    name: "VR3-D · a voice destructured WITH A DEFAULT",
    rel: "c.ts",
    src:
      "const { say: sayBoard = noop } = useLiveRegion();\n" +
      'sayBoard("filled by the solver");',
    want: 1,
  },
  {
    name: "VR3-E · a COPY_KEY whose value is a call holding a TEMPLATE literal",
    rel: "c.ts",
    src: "const row = { washi: says(`the solver filled ${n}`, idle.washi) };",
    want: 1,
  },
  {
    name: "VR3-F · a COPY_KEY in a TYPE position (union of string literal TYPES)",
    rel: "c.ts",
    src: 'type Row = { label: "solver mode" | "off" };',
    want: 0,
  },
  {
    name: "VR3-G · a voice spoken from the TEMPLATE half of an SFC",
    rel: "c.vue",
    src:
      "<template>\n  <button @click=\"say('copied by the solver')\">go</button>\n</template>\n" +
      "<script setup lang=\"ts\">\nconst { say } = useLiveRegion();\n</script>",
    want: 1,
  },
  {
    name: "VR3-H · the PASS receiver declared as an ARROW, not a function",
    rel: "c.ts",
    src:
      "const { say: sayCopy } = useLiveRegion();\n" +
      "const copyAct = (act: () => void, say: (l: string) => void) => {\n" +
      '  say("the solver could not copy");\n};\n' +
      "copyAct(() => share(), sayCopy);",
    want: 1,
  },
  {
    name: "VR3-I · PASS where the call OMITS an optional argument (length disagreement)",
    rel: "c.ts",
    src:
      "const { say: sayCopy } = useLiveRegion();\n" +
      "function copyAct(act: () => void, say: (l: string) => void, tone?: string) {\n" +
      '  say("the solver could not copy");\n}\n' +
      "copyAct(() => share(), sayCopy);",
    want: 1,
  },
  {
    name: "VR3-J · a bare SCREAMING plural table with no prefix (NOTES)",
    rel: "c.ts",
    src: 'const NOTES = { budget: "the solver gave up." };',
    want: 1,
  },
  {
    name: "VR3-K · regression — a COPY_KEY whose value is a plain quoted string",
    rel: "c.ts",
    src: 'const row = { sublabel: "the solver finishes the board" };',
    want: 1,
  },
  {
    name: "VR3-L · file-scope over-reach — a PASS-bound param name spoken elsewhere",
    rel: "c.ts",
    src:
      "const { say: sayCopy } = useLiveRegion();\n" +
      "function copyAct(act: () => void, say: (l: string) => void) {\n  say(ok);\n}\n" +
      "copyAct(() => share(), sayCopy);\n" +
      "function unrelated(say: (l: string) => void) {\n" +
      '  say("the solver is a fine word in a log");\n}',
    want: 0,
  },
  {
    name: "VR3-M · a plural UPPER name that is not copy at all (LINES of protocol)",
    rel: "c.ts",
    src: 'const LINES = ["worker-ready", "ack"];',
    want: 0,
  },
  {
    name: "VR3-N · an utterance whose literal sits in a nested ternary two calls deep",
    rel: "c.ts",
    src:
      "const { say } = useLiveRegion();\n" +
      'say(ok ? fmt("done") : "the solver stopped");',
    want: 1,
  },
];

const [srcPath, outPath] = process.argv.slice(2);
let s = fs.readFileSync(srcPath, "utf8");
const marker = "\n];\n\nfunction selfTest()";
if (!s.includes(marker)) throw new Error("marker not found in " + srcPath);
const block = CONTROLS.map(
  (c) =>
    `  { name: ${JSON.stringify("VR3 " + c.name)}, rel: ${JSON.stringify(c.rel)}, src: ${JSON.stringify(c.src)}, want: ${c.want} },`,
).join("\n");
s = s.replace(marker, "\n" + block + marker);
fs.writeFileSync(outPath, s);
console.log("wrote", outPath, "with", CONTROLS.length, "verifier controls");
