// RUN: node trace-summary.mjs <trace.json>   (the CDP devtools.timeline capture bake-census.mjs --trace writes)
//
// Main-thread attribution for the cold load at 4×. Sums complete (`ph:"X"`) events on the
// renderer's main thread by name, self-time (duration minus the duration of nested children),
// and prints the top costs plus the `blink.user_timing` marks the in-page instrument stamped,
// so a task's name can be read against the bake it belongs to.
import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(process.argv[2], "utf8"));
const ev = Array.isArray(raw) ? raw : raw.traceEvents;

// CrRendererMain, named by the trace's own metadata — a "most RunTask" heuristic picks the
// browser process's own loop instead, which carries thousands of ~0 ms tasks and no page work.
const named = ev.filter(
  (e) => e.name === "thread_name" && e.args && e.args.name === "CrRendererMain",
);
let pid, tid;
if (named.length) {
  const busiest = named
    .map((m) => ({
      pid: m.pid,
      tid: m.tid,
      ms: ev
        .filter((e) => e.ph === "X" && e.pid === m.pid && e.tid === m.tid)
        .reduce((a, e) => a + e.dur, 0),
    }))
    .sort((a, b) => b.ms - a.ms)[0];
  pid = busiest.pid;
  tid = busiest.tid;
} else {
  const dur = {};
  for (const e of ev)
    if (e.ph === "X") dur[`${e.pid}/${e.tid}`] = (dur[`${e.pid}/${e.tid}`] || 0) + e.dur;
  [pid, tid] = Object.entries(dur)
    .sort((a, b) => b[1] - a[1])[0][0]
    .split("/")
    .map(Number);
}

const X = ev
  .filter((e) => e.ph === "X" && e.pid === pid && e.tid === tid && e.dur > 0)
  .sort((a, b) => a.ts - b.ts || b.dur - a.dur);

// self-time via a stack walk (trace X events on one thread nest perfectly)
const self = new Map();
const stack = [];
for (const e of X) {
  while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts)
    stack.pop();
  if (stack.length) {
    const p = stack[stack.length - 1];
    p.child = (p.child || 0) + e.dur;
  }
  stack.push(e);
}
for (const e of X) {
  const s = (e.dur - (e.child || 0)) / 1000;
  const k = self.get(e.name) || { self: 0, total: 0, n: 0 };
  k.self += s;
  k.total += e.dur / 1000;
  k.n++;
  self.set(e.name, k);
}

const t0 = Math.min(...X.map((e) => e.ts));
const tasks = X.filter((e) => e.name === "RunTask");
const wall = (Math.max(...X.map((e) => e.ts + e.dur)) - t0) / 1000;

console.log(`main thread pid/tid ${pid}/${tid} · ${tasks.length} RunTask · trace wall ${wall.toFixed(0)} ms`);
console.log(
  `RunTask total ${(tasks.reduce((a, e) => a + e.dur, 0) / 1000).toFixed(0)} ms · >50 ms: ${tasks.filter((e) => e.dur > 50000).length} · worst ${(Math.max(...tasks.map((e) => e.dur)) / 1000).toFixed(0)} ms · TBT ${(tasks.reduce((a, e) => a + Math.max(0, e.dur / 1000 - 50), 0)).toFixed(0)} ms`,
);
console.log(`\n| trace event | n | self ms | total ms |`);
console.log(`| --- | --- | --- | --- |`);
for (const [n, v] of [...self].sort((a, b) => b[1].self - a[1].self).slice(0, 18))
  console.log(`| ${n} | ${v.n} | ${v.self.toFixed(1)} | ${v.total.toFixed(1)} |`);

console.log(`\nA1 user-timing marks (blink.user_timing), ms from first trace event:`);
const marks = ev.filter(
  (e) => (e.ph === "R" || e.ph === "I" || e.ph === "n") && String(e.name).startsWith("A1:"),
);
const tally = {};
for (const m of marks) {
  const k = m.name;
  (tally[k] ??= []).push(+((m.ts - t0) / 1000).toFixed(0));
}
for (const [k, v] of Object.entries(tally))
  console.log(`  ${k} ×${v.length}  first ${v[0]} ms  last ${v[v.length - 1]} ms`);

// the biggest tasks, in order, with what they contained
console.log(`\ntop 12 RunTasks (ms from first trace event):`);
for (const t of [...tasks].sort((a, b) => b.dur - a.dur).slice(0, 12)) {
  const inner = X.filter(
    (e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > t.dur * 0.3,
  )
    .map((e) => e.name)
    .slice(0, 4);
  console.log(
    `  t=${((t.ts - t0) / 1000).toFixed(0)} dur=${(t.dur / 1000).toFixed(0)} ms  [${[...new Set(inner)].join(" > ")}]`,
  );
}
