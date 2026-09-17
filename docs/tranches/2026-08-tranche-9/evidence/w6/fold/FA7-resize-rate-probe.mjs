/**
 * T9 chair fold, lane FA7 — THE RATE INSTRUMENT.
 *
 * `FA7-resize-choice-probe.mjs` reproduces handoff 6d-r15-1's exact gesture (arm the ribbon,
 * rotate once) and is the rig the verdict is READ on. It is a poor rig to CHOOSE a cure with:
 * at this tree the walk is intermittent (1 of 6 arms), so six green arms of a candidate are a
 * coin landing the same way six times as often as they are a cure.
 *
 * So this one trades the ribbon for trials. The subject is the deck's CHOICE — the ribbon is
 * only its loudest symptom — so the deck is opened bare and the rotation is repeated:
 *
 *   per trial: park at the desk → force the choice back to card 0 → rotate to the phone →
 *              wait out the settle → read `aria-activedescendant`
 *
 * One page, K trials, ~2s each. A walk is any trial that does not read `gallery-card-0`, and the
 * trail records what the deck published between the rotation and the read, so a cure that only
 * silences the REPORT is visible as a held label over a moved `scrollLeft`.
 *
 * Run FROM web/frontend:  node ../../docs/.../FA7-resize-rate-probe.mjs <label> <outdir>
 *   env: ENGINE=chromium|webkit  TRIALS=n  PHONE_W=390 PHONE_H=844
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = createRequire(`${process.cwd()}/`)("playwright");

const BASE = "http://127.0.0.1:4237";
const LABEL = process.argv[2] ?? "rate";
const OUT = process.argv[3] ?? ".";
const DESK = { width: 1440, height: 900 };
const PHONE = {
  width: Number(process.env.PHONE_W ?? 390),
  height: Number(process.env.PHONE_H ?? 844),
};

const read = (page) =>
  page.evaluate(() => {
    const vp = document.querySelector(".gallery-viewport");
    if (!vp)
      return {
        deckOpen: false,
        galleryRoot: !!document.querySelector(".game-gallery"),
        url: location.search,
      };
    const slots = [...document.querySelectorAll(".gallery-card-slot")];
    const v = vp.getBoundingClientRect();
    const mid = v.left + v.width / 2;
    let resting = -1;
    let best = Infinity;
    slots.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < best) {
        best = d;
        resting = i;
      }
    });
    return {
      deckOpen: true,
      ad: vp.getAttribute("aria-activedescendant"),
      restingCard: resting,
      scrollLeft: Math.round(vp.scrollLeft),
    };
  });

async function openDeck(page) {
  await page.goto(`${BASE}/?view=gallery&size=3&difficulty=EASY`);
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await page.waitForTimeout(700);
}

async function run(engineName, launcher, trials) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: DESK });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message).split("\n")[0]));
  await openDeck(page);
  const rows = [];
  for (let t = 1; t <= trials; t++) {
    await page.setViewportSize(DESK);
    await page.waitForTimeout(450);
    // Park the choice on card 0 through the keyboard seam (a real gesture, so `currentIndex`
    // and `activeIndex` agree) — Home is the deck's own first-card step.
    await page.locator(".gallery-viewport").press("Home");
    await page.waitForTimeout(700);
    const before = await read(page);
    await page.setViewportSize(PHONE);
    await page.waitForTimeout(800);
    const after = await read(page);
    const walked = after.ad !== "gallery-card-0";
    rows.push({ trial: t, before, after, walked });
    if (walked)
      console.log(
        `  ${LABEL} ${engineName} t${t}: WALK ad=${after.ad} rest=${after.restingCard} sl=${after.scrollLeft} deckOpen=${after.deckOpen} root=${after.galleryRoot} url=${after.url ?? ""}`,
      );
    else if (after.restingCard !== 0)
      console.log(
        `  ${LABEL} ${engineName} t${t}: LABEL HELD, POSITION WALKED rest=${after.restingCard} sl=${after.scrollLeft}`,
      );
  }
  const walks = rows.filter((r) => r.walked).length;
  const posWalks = rows.filter((r) => r.after.restingCard !== 0).length;
  writeFileSync(
    `${OUT}/${LABEL}-rate-${engineName}-${PHONE.width}.json`,
    JSON.stringify(
      { label: LABEL, engine: engineName, phone: PHONE, trials: rows.length, walks, positionWalks: posWalks, pageErrors: errors, rows },
      null,
      2,
    ),
  );
  console.log(
    `${LABEL} ${engineName} @${PHONE.width}: label walks ${walks}/${rows.length} · position walks ${posWalks}/${rows.length}`,
  );
  await browser.close();
}

const only = process.env.ENGINE;
const trials = Number(process.env.TRIALS ?? 20);
if (!only || only === "chromium") await run("chromium", chromium, trials);
if (!only || only === "webkit") await run("webkit", webkit, trials);
