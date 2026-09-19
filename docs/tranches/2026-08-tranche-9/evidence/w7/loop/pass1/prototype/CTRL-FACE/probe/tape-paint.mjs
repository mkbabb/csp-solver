/**
 * CTRL-FACE pass-1 — DOES THE TAPE PAINT ON THE CAPTION? The box reading says the `checking`
 * tape's rect cuts 3.06px into the `candidates` caption's line box at every mobile cell. A line
 * box is not ink, so this settles it in PAINT: screenshot the caption's own clip twice — once as
 * it renders, once with every tape hidden — and count the pixels that differ. A zero count means
 * the tape's paper never reaches the caption's ink.
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: eng === "chromium",
    deviceScaleFactor: 3,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForTimeout(1400);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").click({ force: true });
    await p.waitForTimeout(950);
  }
  const clip = await p.evaluate(() => {
    const cap = Array.from(document.querySelectorAll(".zone-row-label")).find(
      (c) => c.innerText.trim().toLowerCase() === "candidates",
    );
    if (!cap) return null;
    const r = cap.getBoundingClientRect();
    return { x: Math.floor(r.left), y: Math.floor(r.top), width: Math.ceil(r.width), height: Math.ceil(r.height) };
  });
  if (!clip) {
    console.log(eng, "no candidates caption on screen");
    await b.close();
    continue;
  }
  const a = await p.screenshot({ clip });
  await p.addStyleTag({ content: ".washi-tag { visibility: hidden !important; }" });
  await p.waitForTimeout(250);
  const c = await p.screenshot({ clip });
  const [A, B] = await Promise.all([
    sharp(a).raw().toBuffer({ resolveWithObject: true }),
    sharp(c).raw().toBuffer({ resolveWithObject: true }),
  ]);
  let diff = 0;
  let firstRow = null;
  const ch = A.info.channels;
  for (let i = 0; i < A.data.length; i += ch) {
    let d = 0;
    for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(A.data[i + k] - B.data[i + k]));
    if (d > 6) {
      diff++;
      if (firstRow === null) firstRow = Math.floor(i / ch / A.info.width);
    }
  }
  // …and, in the TAPE-HIDDEN frame, whether the caption itself paints any ink in the rows the
  // tape reached. Background = the modal pixel of the clip; anything far from it is ink.
  const W = B.info.width;
  const H = B.info.height;
  const counts = new Map();
  for (let i = 0; i < B.data.length; i += ch) {
    const k = `${B.data[i]},${B.data[i + 1]},${B.data[i + 2]}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const bg = [...counts.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
  const inkRows = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * ch;
      let d = 0;
      for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(B.data[i + k] - bg[k]));
      if (d > 24) n++;
    }
    if (n > 0) inkRows.push(y);
  }
  const lastInk = inkRows.length ? inkRows[inkRows.length - 1] : -1;
  console.log(
    `${eng} caption ink (tape hidden) occupies rows ${inkRows[0]}..${lastInk} of ${H}; ` +
      `the tape's paper starts at row ${firstRow} — ${firstRow > lastInk ? "NO GLYPH COVERED" : "GLYPH COVERED"}` +
      ` (clearance ${(((firstRow - lastInk) / H) * clip.height).toFixed(2)} CSS px)`,
  );
  console.log(
    `${eng} candidates clip ${clip.width}x${clip.height} @${A.info.width}x${A.info.height} dpr — ` +
      `pixels changed by hiding every tape: ${diff} (${((100 * diff) / (A.info.width * A.info.height)).toFixed(3)}%)` +
      (firstRow !== null ? `, first affected row ${firstRow}/${A.info.height}` : ""),
  );
  await b.close();
}
