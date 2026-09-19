// Isolate the FRAME from the deal: compare only the top strip of the corner crop, where the
// frame's top line lives and no digit reaches. 360x44 device px of the committed golden vs the
// same strip off the built prototype.
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-41/web/frontend";
const BASE = process.env.BASE || "http://127.0.0.1:4242";
const H = 44;

const rowsOfDark = async (buf, w, h) => {
  const { data, info } = await sharp(buf).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (let y = 0; y < info.height; y++) {
    let dark = 0;
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] < 120 && data[i + 1] < 120 && data[i + 2] < 120) dark++;
    }
    rows.push(dark);
  }
  return rows;
};

const golden = await sharp(ROOT + "/e2e/goldens/grid-corner-light-darwin.png")
  .extract({ left: 0, top: 0, width: 360, height: H })
  .png()
  .toBuffer();

const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
await page.goto(BASE + "/");
await page.waitForSelector("image.boil-frame-bitmap.is-active");
await page.waitForTimeout(1500);
const bb = await page.locator(".board-wrapper").boundingBox();
const now = await page.screenshot({ clip: { x: bb.x, y: bb.y, width: 180, height: H / 2 } });
await b.close();

const gr = await rowsOfDark(golden);
const nr = await rowsOfDark(now);
const firstDark = (rows) => rows.findIndex((n) => n > 100);
console.log("golden dark-row profile:", JSON.stringify(gr));
console.log("proto  dark-row profile:", JSON.stringify(nr));
console.log("first heavy dark row — golden:", firstDark(gr), " proto:", firstDark(nr));
