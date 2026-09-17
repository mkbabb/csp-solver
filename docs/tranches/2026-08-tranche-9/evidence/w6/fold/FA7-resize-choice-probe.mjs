/**
 * T9 chair fold, lane FA7 — THE DECK KEEPS ITS CHOICE.
 *
 * Descends from `evidence/w6/r15-frames/r15-resize-probe.mjs` (handoff 6d-r15-1's rig) and
 * measures the thing that rig only measured by its symptom: WHICH CARD the deck holds across a
 * resize. Five channels per pose, because aria alone cannot separate "the choice held" from
 * "the label held while the deck walked":
 *
 *   · activeDescendant — the deck's published CHOICE
 *   · restingCard      — the card whose centre is nearest the frame's, i.e. what the reader SEES.
 *                        HONEST ONLY AT THE PHONE. At the desk's three-slot rung cards 0 and 1
 *                        share a rest position (`targetScrollLeft` clamps both to 0), so
 *                        nearest-centre reads 1 for a deck resting on 0 — the exact reading
 *                        `restingIndex`'s prose refuses. At the one-slot phone frame the mapping
 *                        is a bijection again and the number means what it says.
 *   · scrollLeft       — the position itself
 *   · guard            — whether the armed deal ribbon is still standing
 *   · ariaTrail        — every `aria-activedescendant` write, timestamped against the resize, so
 *                        a suppressed REPORT is distinguishable from a held POSITION
 *
 * A cure holds only when activeDescendant AND (at the phone) restingCard both stay 0.
 *
 * ONE BROWSER PER ARM, matching the rig this descends from: arms sharing a browser warm caches
 * and measurably soften the walk (2/3 held on a shared browser against 0/4 banked).
 *
 * Run FROM web/frontend (the playwright resolve is CWD-relative):
 *   node ../../docs/.../FA7-resize-choice-probe.mjs <label> <outdir>
 *   env: ENGINE=chromium|webkit  REPS=n  PHONE_W=390 PHONE_H=844
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

// The script lives in the evidence tree and `playwright` lives in web/frontend's node_modules,
// so ESM's specifier resolution (relative to THIS file) cannot see it. Resolve from the CWD
// instead — run this FROM web/frontend.
const { chromium, webkit } = createRequire(`${process.cwd()}/`)("playwright");

const BASE = "http://127.0.0.1:4237";
const LABEL = process.argv[2] ?? "probe";
const OUT = process.argv[3] ?? ".";

const DESK = { width: 1440, height: 900 };
const PHONE = {
  width: Number(process.env.PHONE_W ?? 390),
  height: Number(process.env.PHONE_H ?? 844),
};

async function measure(page) {
  return page.evaluate(() => {
    const vp = document.querySelector(".gallery-viewport");
    const slots = [...document.querySelectorAll(".gallery-card-slot")];
    const note = document.querySelector(".gallery-guard");
    if (!vp) return { deckOpen: false };
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
      activeDescendant: vp.getAttribute("aria-activedescendant"),
      restingCard: resting,
      scrollLeft: Math.round(vp.scrollLeft),
      guard: !!note,
      guardX: note?.style.getPropertyValue("--guard-x") ?? null,
      innerWidth: window.innerWidth,
    };
  });
}

/** Record every aria write from page birth — zero round trips at resize time. */
async function armTrail(page) {
  await page.addInitScript(() => {
    const trail = [];
    const w = window;
    w.__ariaTrail = trail;
    w.__mark = (s) => trail.push(`${Math.round(performance.now())}ms MARK ${s}`);
    const watch = () =>
      new MutationObserver((records) => {
        for (const r of records) {
          const el = r.target;
          if (!el.classList?.contains("gallery-viewport")) continue;
          trail.push(
            `${Math.round(performance.now())}ms ${el.getAttribute("aria-activedescendant")}`,
          );
        }
      }).observe(document.documentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-activedescendant"],
      });
    if (document.documentElement) watch();
    else document.addEventListener("DOMContentLoaded", watch, { once: true });
  });
}

async function arm(page) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );
  // Dirty the board so the deal ribbon has something to guard.
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++)
      if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await page.locator(".sudoku-cell").nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(400);

  for (let i = 0; i < 20; i++) {
    const hit = await page.evaluate(() => {
      const b = document.querySelector("button.logo-trigger");
      if (!b) return false;
      b.click();
      return true;
    });
    if (
      await page
        .locator(".gallery-viewport")
        .isVisible()
        .catch(() => false)
    )
      break;
    await page.waitForTimeout(hit ? 400 : 800);
  }
  await page.waitForSelector(".gallery-viewport", { timeout: 15000 });
  await page.waitForTimeout(900);
  // The deal press is COMMITTED: a press that lands while the deal/fold still settles is
  // refused once and silently (the gallery's own ambiguity rule), so press on its beat.
  for (let i = 0; i < 6; i++) {
    await page.locator(".gallery-viewport").press("d");
    const up = await page
      .locator(".gallery-guard")
      .waitFor({ timeout: 2500 })
      .then(() => true)
      .catch(() => false);
    if (up) break;
  }
  await page.waitForSelector(".gallery-guard", { timeout: 5000 });
  await page.waitForTimeout(800); // the ribbon SLIDES — let it settle
}

async function once(engineName, launcher, r) {
  const browser = await launcher.launch();
  try {
    const page = await browser.newPage({ viewport: DESK });
    await armTrail(page);
    await arm(page);
    const desk = await measure(page);
    // The arm itself can fall over (the deal press is refused mid-settle and the retry lands on
    // a ribbon that is already up, which closes the deck). That is not a walk — it is an arm
    // that never happened, and scoring it as a walk would flatter or damn a candidate at random.
    if (!desk.deckOpen || desk.activeDescendant !== "gallery-card-0")
      throw new Error(`arm did not settle on card 0 (deckOpen=${desk.deckOpen})`);
    await page.evaluate(() => window.__mark("resize"));
    await page.setViewportSize(PHONE);
    await page.waitForTimeout(900);
    const phone = await measure(page);
    const ariaTrail = await page.evaluate(() => window.__ariaTrail ?? []);
    const held =
      desk.activeDescendant === "gallery-card-0" &&
      phone.activeDescendant === "gallery-card-0" &&
      phone.restingCard === 0;
    const row = {
      label: LABEL,
      engine: engineName,
      arm: r,
      phoneViewport: PHONE,
      desk,
      phone,
      ariaTrail,
      held,
    };
    console.log(
      `${LABEL} ${engineName} r${r}: desk ad=${desk.activeDescendant} rest=${desk.restingCard} sl=${desk.scrollLeft} | phone ad=${phone.activeDescendant} rest=${phone.restingCard} sl=${phone.scrollLeft} guard=${phone.guard} | HELD=${held}`,
    );
    return row;
  } finally {
    await browser.close();
  }
}

async function run(engineName, launcher, reps) {
  const rows = [];
  for (let r = 1; r <= reps; r++) {
    try {
      rows.push(await once(engineName, launcher, r));
    } catch (err) {
      console.log(`${LABEL} ${engineName} r${r}: ARM FAILED — ${err.message.split("\n")[0]}`);
      rows.push({ label: LABEL, engine: engineName, arm: r, armFailed: String(err.message).split("\n")[0] });
    }
  }
  const scored = rows.filter((x) => !x.armFailed);
  writeFileSync(
    `${OUT}/${LABEL}-${engineName}-${PHONE.width}.json`,
    JSON.stringify(
      {
        label: LABEL,
        engine: engineName,
        phone: PHONE,
        arms: scored.length,
        heldCount: scored.filter((x) => x.held).length,
        rows,
      },
      null,
      2,
    ),
  );
  console.log(
    `${LABEL} ${engineName} @${PHONE.width}: HELD ${scored.filter((x) => x.held).length}/${scored.length}`,
  );
}

const only = process.env.ENGINE;
const reps = Number(process.env.REPS ?? 4);
if (!only || only === "chromium") await run("chromium", chromium, reps);
if (!only || only === "webkit") await run("webkit", webkit, reps);
