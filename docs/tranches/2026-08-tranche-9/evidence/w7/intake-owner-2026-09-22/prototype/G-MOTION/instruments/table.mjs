// node table.mjs runs/summary-*.jsonl → compact gate rows
import { readFileSync } from "node:fs";
const rows = process.argv.slice(2).flatMap((f) => readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)));
const arm = (r) => (r.port === "4253" ? "PROTO" : "HEAD ");
const j = (o) => JSON.stringify(o);
for (const r of rows) {
  const h = `${arm(r)} ${r.engine.padEnd(8)} ${r.vp} ${r.scheme}${r.prm ? " PRM" : ""}${r.touch ? " coarse" : " fine"} ${r.file}`;
  if (r.scenario === "move" || r.scenario === "ga7neg") {
    const e = r.enter, x = r.exit;
    console.log(`${h}\n  ENTER movers ${e.movers} animAt ${e.animAt} GA1 ${j(e.GA1_frame1)} GA2raf ${e.GA2_visMinRaf} GA2paint ${j(e.GA2_paintedVis)} GA3 ${j(e.GA3_painted)} restInFace ${e.GA3_restInFaceBeforeFold} GA4raf ${j(e.rafIntervals)} foldFrames ${e.foldFramesRaf} GA4paint ${j(e.GA4_painted)} enc ${e.encodesInFold} draw ${j(e.drawImageInFold)} filters ${j(e.filtersDuringFold)} travel ${j(e.perFrameTravel)} top ${j(e.largestSteps?.[0])}`);
    console.log(`  EXIT movers ${x.movers} GA5 ${j(x.GA5_anchor)} f1 ${j(x.GA5_frame1Raf)} paint ${j(x.GA5_painted)} GA6 card ${j(x.GA6_cardHeight)} centre>20 ${x.GA6_boardCentreSteps20} width>20 ${x.GA6_boardWidthSteps20} word>20 ${x.GA6_wordSteps20} wordMax ${x.wordMaxStep} galGone ${x.galleryRemovedAt} GA7 ${x.GA7_outlineWholeFrac}/${x.GA7_frames} raf ${j(x.rafIntervals)} paint ${j(x.paintedIntervals)} top ${j(x.largestSteps?.[0])}`);
    console.log(`  rest: gallery ${j(r.galleryRest)} play ${j(r.playRest)}`);
  } else if (r.scenario === "poster" || r.scenario === "ga8") {
    const x = r.exit;
    console.log(`${h}\n  ${r.scenario} movers ${x.movers} GA5 ${j(x.GA5_anchor)} f1 ${j(x.GA5_frame1Raf)} card ${j(x.GA6_cardHeight)} centre>20 ${x.GA6_boardCentreSteps20} word>20 ${x.GA6_wordSteps20} scroll ${j(x.scrollTop)} pre ${j(r.scroll)} deckTop ${j(x.deckTopRange)} galGone ${x.galleryRemovedAt} top ${j(x.largestSteps?.[0])}`);
  } else if (r.scenario?.startsWith("toggle")) {
    console.log(h);
    for (const t of r.runs) console.log(`  ${t.label} ${t.dir} born ${j(t.born)} max ${t.frameMs.max} >34(0-900) ${t.over34_0_900} max0-900 ${t.max_0_900} >50 ${t.over50} dScale ${t.maxLiveDeltaScale} jump ${j(t.largestJump)} enc ${t.encodes0_1100} href ${t.hrefSwaps}`);
  } else console.log(`${h}\n  ${j(r.idle ?? { a: r.a, b: r.b })}`);
}
