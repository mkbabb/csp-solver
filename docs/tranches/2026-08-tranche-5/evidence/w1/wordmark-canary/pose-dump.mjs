/** Dump the LIVE pose bitmap each arm's page actually serves, plus its ink box — the exact
 *  bytes wordmark-integrity decodes. <arm> <baseUrl> <outDir> */
import { webkit } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
const [arm, base, out] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const b = await webkit.launch();
for (const game of ["sudoku", "futoshiki", "thermo", "killer", "kenken"]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(`${base}/?game=${game}&size=3&difficulty=EASY`);
  await p.waitForSelector("svg.handwritten-logo image.logo-pose-bmp", { timeout: 30000 });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2500);
  const r = await p.evaluate(async () => {
    const img = document.querySelector("svg.handwritten-logo image.logo-pose-bmp");
    const href = img.getAttribute("href");
    const bmp = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = href; });
    const c = document.createElement("canvas");
    c.width = bmp.naturalWidth; c.height = bmp.naturalHeight;
    const g = c.getContext("2d"); g.drawImage(bmp, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const ink = (x, y) => d[(y * c.width + x) * 4 + 3] > 24;
    let top = -1, bot = -1, left = -1, right = -1;
    for (let y = 0; y < c.height && top < 0; y++) for (let x = 0; x < c.width; x++) if (ink(x, y)) top = y;
    for (let y = c.height - 1; y >= 0 && bot < 0; y--) for (let x = 0; x < c.width; x++) if (ink(x, y)) bot = y;
    for (let x = 0; x < c.width && left < 0; x++) for (let y = 0; y < c.height; y++) if (ink(x, y)) left = x;
    for (let x = c.width - 1; x >= 0 && right < 0; x--) for (let y = 0; y < c.height; y++) if (ink(x, y)) right = x;
    const bytes = await fetch(href).then((r) => r.arrayBuffer());
    return { W: c.width, H: c.height, top, bot, left, right,
             b64: btoa(String.fromCharCode(...new Uint8Array(bytes))) };
  });
  const { b64, ...box } = r;
  const buf = Buffer.from(b64, "base64");
  const file = join(out, `${arm}-${game}-pose.png`);
  await writeFile(file, buf);
  const verdict = box.top < 0 ? "no-ink" :
    [box.top === 0 && "top", box.bot === box.H - 1 && "bottom",
     box.left === 0 && "left", box.right === box.W - 1 && "right"].filter(Boolean).join(",") || "(none)";
  console.log(`${arm} ${game.padEnd(9)} ${String(buf.length).padStart(7)} B  ${box.W}x${box.H}  ` +
    `inkbox top=${box.top} bot=${box.bot} left=${box.left} right=${box.right}  violations=${verdict}`);
  await p.close();
}
await b.close();
