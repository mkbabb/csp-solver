/**
 * NOTE-ERASE pass-2 CRITIC's own re-measurement. Written from scratch (not the prototype's
 * lib): the trajectory, the exit, the settle's computed colour, the PRM arm, and a rect census
 * that can be pointed at either tree. Banks to ../logs/.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const BOARD = "./?size=3&difficulty=EASY";

async function ready(page: Page) {
  await page.goto(BOARD);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
}

/** Watch the live region and every animation that starts on its ink. */
async function installWatch(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as {
      __trail: { t: number; text: string }[];
      __anim: { t: number; name: string }[];
      __t0: number;
    };
    w.__t0 = performance.now();
    w.__trail = [];
    w.__anim = [];
    const region = document.querySelector(".margin-note")!;
    new MutationObserver(() => {
      w.__trail.push({
        t: Math.round(performance.now() - w.__t0),
        text: (region.textContent || "").replace(/\s+/g, " ").trim(),
      });
    }).observe(region, { childList: true, characterData: true, subtree: true });
    document.addEventListener("animationstart", (e) => {
      const t = e.target as HTMLElement;
      if (t.classList?.contains("margin-note-ink"))
        w.__anim.push({
          t: Math.round(performance.now() - w.__t0),
          name: (e as AnimationEvent).animationName,
        });
    });
  });
}

const dump = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as {
      __trail: { t: number; text: string }[];
      __anim: { t: number; name: string }[];
    };
    return { trail: w.__trail, anim: w.__anim };
  });

/** sRGB bytes of a computed colour composited over `over`; handles rgb() and color(srgb). */
function bytes(css: string, over: number[]): number[] | null {
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    const a = p.length > 3 ? p[3] : 1;
    return [0, 1, 2].map((i) => a * p[i] + (1 - a) * over[i]);
  }
  const s = css.match(
    /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/,
  );
  if (s) {
    const a = s[4] === undefined ? 1 : Number(s[4]);
    return [1, 2, 3].map((k, i) => a * Number(s[k]) * 255 + (1 - a) * over[i]);
  }
  return null;
}
function ratio(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}

const readInk = (page: Page) =>
  page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const region = document.querySelector<HTMLElement>(".margin-note");
    const cs = ink ? getComputedStyle(ink) : null;
    const paper = getComputedStyle(document.body).backgroundColor;
    const root = getComputedStyle(document.documentElement);
    return {
      present: !!ink,
      text: (region?.textContent || "").replace(/\s+/g, " ").trim(),
      age: ink?.getAttribute("data-note-age") ?? null,
      color: cs?.color ?? null,
      paper,
      animationName: cs?.animationName ?? null,
      animationDuration: cs?.animationDuration ?? null,
      transitionDuration: cs?.transitionDuration ?? null,
      filter: cs?.filter ?? null,
      transform: cs?.transform ?? null,
      rungs: {
        note: root.getPropertyValue("--motion-note").trim(),
        whisper: root.getPropertyValue("--motion-whisper").trim(),
        dusk: root.getPropertyValue("--motion-dusk").trim(),
        leave: root.getPropertyValue("--motion-leave").trim(),
        step: root.getPropertyValue("--motion-step").trim(),
        throw: root.getPropertyValue("--motion-throw").trim(),
      },
    };
  });

/** Type a digit into the first GIVEN cell — the refusal. */
async function refuse(page: Page) {
  await page.evaluate(() => {
    const given = document.querySelector<HTMLInputElement>(
      ".game-cell.is-given input, .game-cell input[readonly], .game-cell input[disabled]",
    );
    const any = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    ).find((i) => !!i.value);
    (given ?? any)?.focus();
  });
  await page.keyboard.press("1");
}

test("the trajectory, the exit, the settle", async ({ page }, info) => {
  await ready(page);
  await installWatch(page);

  // ── the refusal, then the SAME refusal again: the repeat's hole
  await refuse(page);
  await page.waitForTimeout(500);
  const first = await readInk(page);
  await refuse(page);
  await page.waitForTimeout(900);
  const second = await readInk(page);
  const { trail, anim } = await dump(page);
  const texts = trail.map((r) => r.text);
  const compact = texts.filter((t, i) => i === 0 || t !== texts[i - 1]);
  const emptyAt = trail.findIndex((r, i) => i > 0 && r.text === "");
  const backAt = trail.findIndex((r, i) => emptyAt >= 0 && i > emptyAt && r.text !== "");
  const hole = emptyAt >= 0 && backAt >= 0 ? trail[backAt].t - trail[emptyAt].t : null;

  // ── the settle: a hint record, eight beats in
  await page.evaluate(() => {
    const empty = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    ).find((i) => !i.value);
    empty?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(300);
  const fresh = await readInk(page);
  const settleT = await page.evaluate(async () => {
    const t0 = performance.now();
    for (let i = 0; i < 400; i++) {
      const ink = document.querySelector(".margin-note-ink");
      if (ink?.getAttribute("data-note-age") === "settled")
        return Math.round(performance.now() - t0);
      await new Promise((r) => setTimeout(r, 8));
    }
    return -1;
  });
  await page.waitForTimeout(500);
  const settled = await readInk(page);

  const paperBytes = bytes(settled.paper, [255, 255, 255])!;
  const freshRatio = ratio(bytes(fresh.color!, paperBytes)!, paperBytes);
  const settledRatio = ratio(bytes(settled.color!, paperBytes)!, paperBytes);
  const redRatio = ratio(bytes(first.color!, paperBytes)!, paperBytes);

  // ── the exit: the second press consumes the hint, the record leaves
  const exit = await page.evaluate(async () => {
    const t0 = performance.now();
    const seen: { t: number; name: string; dur: string }[] = [];
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const before = ink ? getComputedStyle(ink).animationName : null;
    return { t0, seen, before };
  });
  await page.keyboard.press("h");
  const leave = await page.evaluate(async () => {
    const t0 = performance.now();
    let reading: { name: string; dur: string; ease: string; trans: string } | null = null;
    let gone = -1;
    for (let i = 0; i < 300; i++) {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink");
      if (ink) {
        const cs = getComputedStyle(ink);
        if (cs.animationName.includes("rub-out") && !reading)
          reading = {
            name: cs.animationName,
            dur: cs.animationDuration,
            ease: cs.animationTimingFunction,
            trans: cs.transitionDuration,
          };
      } else if (reading) {
        gone = Math.round(performance.now() - t0);
        break;
      }
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    return { reading, gone };
  });

  const out = {
    engine: info.project.name,
    repeat: {
      compactTrail: compact,
      hole,
      rubOutStarts: anim.filter((a) => a.name === "ink-rub-out").length,
      writeIns: anim.filter((a) => a.name === "ink-write-in").length,
      anim,
    },
    contrast: {
      paper: settled.paper,
      redRefusal: redRatio,
      freshRecord: freshRatio,
      settledRecord: settledRatio,
      freshColor: fresh.color,
      settledColor: settled.color,
    },
    settle: { armedToSettledMs: settleT, age: settled.age, trans: settled.transitionDuration },
    exit: leave,
    rungsPublished: first.rungs,
    hygiene: { filter: fresh.filter, transform: fresh.transform, exitBefore: exit.before },
  };
  bank(`verify-${info.project.name}.json`, out);
  console.log("CRIT|" + JSON.stringify(out));
  expect(compact.length).toBeGreaterThan(0);
});

test("PRM: the note is removed same frame and nothing animates", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await refuse(page);
  await page.waitForTimeout(400);
  const on = await readInk(page);
  await page.evaluate(() => {
    const empty = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    ).find((i) => !i.value);
    empty?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(400);
  const armed = await readInk(page);
  const gone = await page.evaluate(async () => {
    const t0 = performance.now();
    let frames = 0;
    for (let i = 0; i < 120; i++) {
      if (!document.querySelector(".margin-note-ink"))
        return { ms: Math.round(performance.now() - t0), frames };
      frames++;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    return { ms: -1, frames };
  });
  const out = {
    engine: info.project.name,
    prmRefusal: { animationDuration: on.animationDuration, rungs: on.rungs },
    prmArmed: { animationDuration: armed.animationDuration, name: armed.animationName },
    removal: gone,
  };
  bank(`prm-${info.project.name}.json`, out);
  console.log("CRIT|" + JSON.stringify(out));
});

test("rects: the unclaimed surfaces, against whichever tree is served", async ({
  page,
}, info) => {
  await ready(page);
  const rects = await page.evaluate(() => {
    const r1 = (x: number) => Math.round(x * 100) / 100;
    const of = (sel: string) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { w: r1(b.width), h: r1(b.height), x: r1(b.left), y: r1(b.top) };
    };
    return {
      grid: of('[role="grid"]'),
      controls: of(".game-controls, .control-panel, .controls-card"),
      marginBlock: of(".margin-note-block"),
      marginRegion: of(".margin-note"),
      scrollHeight: document.documentElement.scrollHeight,
      filterCount: document.querySelectorAll("filter").length,
    };
  });
  bank(`rects-${process.env.TREE || "build"}-${info.project.name}.json`, {
    tree: process.env.TREE || "build",
    engine: info.project.name,
    base: process.env.PLAYWRIGHT_BASE_URL,
    rects,
  });
  console.log("CRIT|rects|" + JSON.stringify(rects));
});
