// Worst-case `st` frame, measured as the wire carries it (relayWire's EVENT envelope).
const N = 9;
const cells = N * N;
const values = {}, solved = {}, corner = {}, center = {};
for (let i = 0; i < cells; i++) {
  values[String(i)] = (i % 9) + 1;
  solved[String(i)] = (i % 9) + 1;
  corner[String(i)] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  center[String(i)] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
const all = Array.from({ length: cells }, (_, i) => i);
// killer/kenken furniture: worst case is 2-cell cages everywhere (max cage count)
const cages = [];
for (let i = 0; i < cells; i += 2) cages.push({ op: "+", sum: 17, target: 17, cells: [i, i + 1] });
const blob = {
  b: { values, given: all, origGiven: all, overridden: all, solved, cages,
       thermometers: [all.slice(0, 9), all.slice(9, 18)] },
  m: { corner, center },
};
const st = { b: blob, c: 999999, e: 12, ea: "r-abcdef012345" };
const content = JSON.stringify({ kind: "st", data: st, from: "r-abcdef012345", to: "r-fedcba543210" });
const frame = JSON.stringify([
  "EVENT",
  { id: "f".repeat(64), pubkey: "r-abcdef012345", created_at: 1754000000, kind: 20411,
    tags: [["x", "sudoku-babb-dev/room-alpha"]], content, sig: "" },
]);
const enc = new TextEncoder();
console.log("st content bytes   :", enc.encode(content).byteLength);
console.log("st WIRE FRAME bytes:", enc.encode(frame).byteLength);

// the ordinary frames
const op = JSON.stringify({ kind: "op", data: { p: 80, v: 9, s: 0, l: 12345, a: "r-abcdef012345", e: 3, ea: "r-abcdef012345" }, from: "r-abcdef012345" });
const opFrame = JSON.stringify(["EVENT", { id: "f".repeat(64), pubkey: "r-abcdef012345", created_at: 1754000000, kind: 20411, tags: [["x", "sudoku-babb-dev/room-alpha"]], content: op, sig: "" }]);
console.log("op WIRE FRAME bytes:", enc.encode(opFrame).byteLength);
const req = JSON.stringify(["REQ", "abcdef01", { kinds: [20411], "#x": ["sudoku-babb-dev/room-alpha"] }]);
console.log("REQ bytes          :", enc.encode(req).byteLength);
// a realistic (non-worst-case) st: no marks, sudoku, ~30 givens
const values2 = {}; for (let i = 0; i < 40; i++) values2[String(i)] = (i % 9) + 1;
const st2 = { b: { b: { values: values2, given: all.slice(0, 30), origGiven: all.slice(0, 30), overridden: [], solved: {} }, m: { corner: {}, center: {} } }, c: 12, e: 1, ea: "r-abcdef012345" };
const c2 = JSON.stringify({ kind: "st", data: st2, from: "r-abcdef012345" });
console.log("typical st content :", enc.encode(c2).byteLength);
