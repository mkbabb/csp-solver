// RUN: node summarize.mjs raw/spike-c4x-mob-idbblob.jsonl [...]
//
// C11 spike reducer. Per window it prints the restore path's stages and the SAME window's bake
// bill, so the two ways of putting sixteen poses on a warm screen stand side by side. The
// blocking column is an UPPER BOUND on the restore's own blocking: the app is booting and
// baking inside that window too, and every longtask (chromium) or rAF gap over 33.4 ms
// (WebKit) that overlaps the restore is charged to the restore.
import { readFileSync } from "node:fs";

const med = (a) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const f = (n) => (Number.isFinite(n) ? n.toFixed(1) : "—");
const range = (a) => `${f(Math.min(...a))}–${f(Math.max(...a))}`;

for (const path of process.argv.slice(2)) {
  const lines = readFileSync(path, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const meta = lines.find((l) => l.k === "meta");
  const end = lines.find((l) => l.k === "end");
  const wins = lines.filter((l) => l.k === "window");
  const col = {
    wall: [],
    open: [],
    read: [],
    mint: [],
    decode: [],
    block: [],
    bakeBill: [],
    bakeWall: [],
    bakeN: [],
    bootBill: [],
    boardReady: [],
    bytes: [],
    taint: [],
  };
  console.log(`\n### ${path}`);
  console.log(
    `${meta.engine} · CPU ${meta.cpuThrottle} · ${meta.net} · ${meta.cache} · ${meta.vp} ${meta.vp === "mobile" ? "390x844" : "1280x800"} dpr ${meta.dpr} · store ${meta.store} · profile ${meta.profile || "ephemeral"}`,
  );
  console.log(`load ${meta.loadavgStart} → ${end ? end.loadavgEnd : "?"}`);
  console.log(
    "win | restore wall | open | read | mint | decode | blocking≤ | bake N | bake bill | bake wall | boardReady | taint",
  );
  for (const w of wins) {
    const R = w.warm.restore || {};
    const ev = w.warm.ev || [];
    const starts = ev.filter((e) => e.k === "toBlob:start");
    const ends = ev.filter((e) => e.k === "toBlob:end");
    const bill = ends.reduce((a, e) => a + e.ms, 0);
    const bakeWall = ends.length ? ends[ends.length - 1].t - starts[0].t : NaN;
    // the boot round = the first sixteen poses (four surfaces × four), before C02's idle warm
    const bootBill = ends.slice(0, 16).reduce((a, e) => a + e.ms, 0);
    const wall = R.tDecode - R.t0;
    const inWin = (t, d) => t < R.tDecode && t + d > R.t0;
    const block = w.warm.supportsLongtask
      ? (w.warm.longtasks || [])
          .filter(([t, d]) => inWin(t, d))
          .reduce((a, [t, d]) => a + Math.min(t + d, R.tDecode) - Math.max(t, R.t0), 0)
      : (w.warm.raf || [])
          .filter(([t, d]) => inWin(t - d, d))
          .reduce((a, [t, d]) => a + Math.min(t, R.tDecode) - Math.max(t - d, R.t0), 0);
    col.wall.push(wall);
    col.open.push(R.tOpen - R.t0);
    col.read.push(R.tRead - R.tOpen);
    col.mint.push(R.tMint - R.tRead);
    col.decode.push(R.tDecode - R.tMint);
    col.block.push(block);
    col.bakeBill.push(bill);
    col.bakeWall.push(bakeWall);
    col.bakeN.push(ends.length);
    col.bootBill.push(bootBill);
    col.boardReady.push(w.warm.boardReady);
    col.bytes.push(R.bytes);
    col.taint.push(w.warm.taint);
    console.log(
      `${w.window} | ${f(wall)} | ${f(R.tOpen - R.t0)} | ${f(R.tRead - R.tOpen)} | ${f(R.tMint - R.tRead)} | ${f(R.tDecode - R.tMint)} | ${f(block)} | ${ends.length} | ${f(bill)} | ${f(bakeWall)} | ${f(w.warm.boardReady)} | ${w.warm.taint}`,
    );
  }
  console.log(
    `MEDIAN | wall ${f(med(col.wall))} (${range(col.wall)}) | open ${f(med(col.open))} | read ${f(med(col.read))} | mint ${f(med(col.mint))} | decode ${f(med(col.decode))} | blocking≤ ${f(med(col.block))} | bake N ${med(col.bakeN)} | bill ${f(med(col.bakeBill))} (${range(col.bakeBill)}) | boot-16 bill ${f(med(col.bootBill))} | bake wall ${f(med(col.bakeWall))} | boardReady ${f(med(col.boardReady))}`,
  );
  console.log(
    `RATIO | bake bill / restore blocking = ${f(med(col.bakeBill) / med(col.block))}× | boot-16 bill / restore blocking = ${f(med(col.bootBill) / med(col.block))}× | bake wall / restore wall = ${f(med(col.bakeWall) / med(col.wall))}×`,
  );
  const s = wins[0];
  console.log(
    `STORED | ${s.seedLight.stored} + ${s.seedDark.stored} rows · ${s.seedLight.bytes} + ${s.seedDark.bytes} B = ${med(col.bytes)} B read back · write ${f(s.seedLight.writeMs)}/${f(s.seedDark.writeMs)} ms · fetch-back ${f(s.seedLight.fetchMs)}/${f(s.seedDark.fetchMs)} ms · quota ${s.seedLight.estimate ? s.seedLight.estimate.quota : "n/a"} · persisted ${s.seedLight.persisted}`,
  );
  const px = (w) =>
    (w.warm.ev || [])
      .filter((e) => e.k === "toBlob:end")
      .slice(0, 16)
      .map((e) => `${e.surface} ${e.w}x${e.h} ${e.bytes}B`)
      .join(" · ");
  console.log(`POSES | ${px(wins[0])}`);
}
