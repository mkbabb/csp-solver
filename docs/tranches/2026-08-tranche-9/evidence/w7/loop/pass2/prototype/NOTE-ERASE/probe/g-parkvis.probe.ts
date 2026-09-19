/**
 * NOTE-ERASE pass 2 · G — IS THE PARKED NOTE ACTUALLY PAINTED?
 *
 * The crops came back blank where the measurements say a line stands, so the question the
 * research answered by rect ("the park does not hide the note, it paints it at 8.63px") is
 * re-asked by PIXELS and by hit-testing: the clipping ancestors, the point test at the line's
 * own centre, and a byte read of the box.
 */
import { test, expect } from "@playwright/test";
import { armHint, bank, boardReady, readNote, say } from "./lib";
import sharp from "sharp";

test("G the parked note, hit-tested and read in bytes", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const armed = await armHint(page);
  const live = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      box: { x: r.x, y: r.y, w: r.width, h: r.height },
      hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") || "").split(/\s+/)[0]}` : null,
      hitIsTheNote: !!hit && (hit === ink || ink.contains(hit)),
    };
  });

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(120);
  await page.keyboard.press("g");
  await page.waitForTimeout(1500);

  const parked = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    const clippers: string[] = [];
    for (let n: HTMLElement | null = ink; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflow !== "visible" || cs.clipPath !== "none") {
        const nr = n.getBoundingClientRect();
        clippers.push(
          `${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").split(/\s+/)[0]}` +
            ` overflow=${cs.overflow} clip=${cs.clipPath}` +
            ` box=${Math.round(nr.x)},${Math.round(nr.y)},${Math.round(nr.width)},${Math.round(nr.height)}` +
            ` containsNote=${nr.top <= r.top && nr.bottom >= r.bottom}`,
        );
      }
    }
    return {
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      box: { x: r.x, y: r.y, w: r.width, h: r.height },
      centre: { cx, cy },
      inViewport: cy >= 0 && cy <= innerHeight && cx >= 0 && cx <= innerWidth,
      hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") || "").split(/\s+/)[0]}` : null,
      hitIsTheNote: !!hit && (hit === ink || ink.contains(hit)),
      fontPx: getComputedStyle(ink).fontSize,
      visibility: getComputedStyle(ink).visibility,
      opacity: getComputedStyle(ink).opacity,
      clippers,
    };
  });

  // The bytes: is anything but paper inside the parked line's own box?
  let ink = null;
  if (parked) {
    const clip = {
      x: Math.max(0, Math.floor(parked.box.x) - 3),
      y: Math.max(0, Math.floor(parked.box.y) - 3),
      width: Math.ceil(parked.box.w) + 6,
      height: Math.ceil(parked.box.h) + 6,
    };
    if (clip.width > 6 && clip.height > 6) {
      const buf = await page.screenshot({ clip, animations: "disabled" });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      const lum = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      let min = 255;
      let max = 0;
      for (let i = 0; i < data.length; i += info.channels) {
        const L = lum(i);
        if (L < min) min = L;
        if (L > max) max = L;
      }
      ink = { clip, minL: Math.round(min), maxL: Math.round(max), spread: Math.round(max - min) };
    }
  }

  const row = { engine: browserName, armed: armed?.text, live, parked, parkedBytes: ink };
  bank(`g-parkvis-${browserName}.json`, row);
  say("G", row);
  expect(parked).not.toBeNull();
});
