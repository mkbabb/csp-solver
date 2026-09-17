/**
 * T9 chair fold, lane FA7 — THE PLANT for `deckSettled`'s per-call marker.
 *
 * The property under test is "every call spends two consecutive identical readings before it
 * answers". The old helper keyed its marker on one shared `window.__deck`, so only the FIRST
 * call in a page could satisfy that; the second and later ones inherited the previous call's
 * last reading and could answer on reading ONE.
 *
 * The plant makes the difference observable rather than argued: run BOTH predicate bodies —
 * byte-for-byte the old one and the new one — against the same live deck, with the deck's move
 * INTERLEAVED BY HAND between reading 1 and reading 2. No rAF, no scheduling race: the move
 * lands exactly where the two helpers must disagree. A helper that answers on reading 1 has
 * declared "at rest" about a deck that moves immediately afterwards; a helper that needs two
 * consecutive readings sees the move and keeps waiting, which is the whole of its job.
 *
 * Run FROM web/frontend:  node ../../docs/.../FA7-decksettled-plant.mjs
 *   env: ENGINE=chromium|webkit
 */
import { createRequire } from "node:module";
const { chromium, webkit } = createRequire(`${process.cwd()}/`)("playwright");

const BASE = "http://127.0.0.1:4237";

async function run(name, launcher) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/?view=gallery&size=3&difficulty=EASY`);
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await page.waitForTimeout(900);

  const out = await page.evaluate(async () => {
    const read = () => {
      const t = document.querySelector(".gallery-track");
      const vp = document.querySelector(".gallery-viewport");
      if (!t || !vp || document.fonts.status !== "loaded") return null;
      if (Math.abs(new DOMMatrixReadOnly(getComputedStyle(t).transform).m41) > 0.5)
        return null;
      return `${t.scrollWidth}|${Math.round(vp.scrollLeft)}`;
    };
    // The two predicate bodies, verbatim in their marker discipline.
    const OLD = () => {
      const now = read();
      if (now == null) return false;
      const prev = window.__deck;
      window.__deck = now;
      return prev === now;
    };
    const NEW = (k) => {
      const now = read();
      if (now == null) return false;
      const prev = window[k];
      window[k] = now;
      return prev === now;
    };
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    const poll = async (fn, limit = 240) => {
      let readings = 0;
      while (readings < limit) {
        readings++;
        if (fn()) return readings;
        await frame();
      }
      return -1;
    };

    // CALL 1 — both helpers settle honestly here; the shared marker has no history yet, so both
    // spend two consecutive readings. This is the ONE call the old helper got right.
    const oldCall1 = await poll(OLD);
    const newCall1 = await poll(() => NEW("__deckA"));

    // …and the deck is left exactly where call 1 found it, which is the ordinary case: a row
    // calls `deckSettled` again before its next gesture.
    const vp = document.querySelector(".gallery-viewport");
    const parked = Math.round(vp.scrollLeft);

    // THE PLANT — CALL 2, with the move interleaved between reading 1 and reading 2.
    const oldR1 = OLD();
    vp.scrollLeft = parked + 352; // the deck moves, immediately after that reading
    const oldR2 = OLD();
    vp.scrollLeft = parked;
    await frame();

    const newR1 = NEW("__deckB");
    vp.scrollLeft = parked + 352; // the identical move, at the identical point
    const newR2 = NEW("__deckB");
    vp.scrollLeft = parked;
    await frame();

    // And the new helper still SETTLES once the deck really is at rest — a helper that never
    // answers is not a cure.
    const newSettles = await poll(() => NEW("__deckC"));

    return {
      parked,
      oldCall1,
      newCall1,
      old: { reading1: oldR1, reading2: oldR2 },
      new: { reading1: newR1, reading2: newR2 },
      newSettles,
    };
  });

  console.log(`--- ${name} ---`);
  console.log(JSON.stringify(out, null, 2));
  const planted = out.old.reading1 === true && out.new.reading1 === false && out.new.reading2 === false;
  console.log(
    planted
      ? `PLANT CONFIRMED (${name}): on its SECOND call the shared-marker helper answered "at rest" ` +
          `on reading 1 — and the deck moved 352px immediately after that reading. The per-call ` +
          `helper refused both readings across the same move, and settled normally afterwards ` +
          `(reading ${out.newSettles}).`
      : `PLANT DID NOT REPRODUCE (${name}): ${JSON.stringify(out)}`,
  );
  await browser.close();
}

const only = process.env.ENGINE;
if (!only || only === "chromium") await run("chromium", chromium);
if (!only || only === "webkit") await run("webkit", webkit);
