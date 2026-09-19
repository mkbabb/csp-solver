/**
 * MOT-VERB pass 3 — the probes that read the VERBS off the real surface.
 *
 * Both arms are SERVED BUILDS: AFTER is this prototype's dist, CONTROL is `74a2b5d9` bare.
 * Nothing here reads a dev server, and each port was verified by its own build's asset hash.
 */
import { expect, test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const AFTER = process.env.MOT_VERB_AFTER ?? "http://127.0.0.1:4247";
const CONTROL = process.env.MOT_VERB_CONTROL ?? "http://127.0.0.1:4248";
const OUT = process.env.MOT_VERB_OUT ?? "/tmp/mot-verb";

function bank(name: string, data: unknown) {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 2));
}

const POSES = [
  { name: "desk-1440", w: 1440, h: 900, touch: false },
  { name: "desk-1280", w: 1280, h: 800, touch: false },
  { name: "dock-390", w: 390, h: 844, touch: true },
];

async function load(page: Page, url: string) {
  await page.goto(`${url}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 20000 });
  await page.waitForTimeout(700);
}

test.describe("the verbs, on the surface", () => {
  test("A the ladder: one node, PRM zero at the root", async ({ browser }, info) => {
    const out: Record<string, unknown> = { engine: info.project.name };
    for (const motion of ["no-preference", "reduce"] as const) {
      const ctx = await browser.newContext({ reducedMotion: motion, viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await load(page, AFTER);
      out[motion] = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const rungs = ["whisper", "leave", "note", "dusk", "step", "throw"];
        const root: Record<string, string> = {};
        for (const r of rungs) root[r] = cs.getPropertyValue(`--motion-${r}`).trim();
        const dur = (sel: string) => {
          const el = document.querySelector(sel);
          return el ? getComputedStyle(el).transitionDuration : "(absent)";
        };
        return {
          nodes: document.querySelectorAll("style[data-motion-rungs]").length,
          root,
          iconBtn: dur(".icon-btn"),
          drawerTab: dur(".drawer-tab"),
          washi: dur(".washi-label"),
        };
      });
      await ctx.close();
    }
    bank(`a-ladder-prm-${info.project.name}`, out);
    expect(out).toBeTruthy();
  });

  test("B the toggle's beats, live on both builds", async ({ browser }, info) => {
    const read = async (url: string) => {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await load(page, url);
      const rows = await page.evaluate(() => {
        const out: Record<string, { duration: string; delay: string; property: string }> = {};
        const want: [string, string][] = [
          ["wring", ".toggle-icon .warp"],
          ["out", ".toggle-icon"],
          ["tuck", ".toggle-icon .twinkle-star"],
        ];
        for (const [beat, sel] of want) {
          const el = document.querySelector(sel);
          out[beat] = el
            ? {
                duration: getComputedStyle(el).transitionDuration,
                delay: getComputedStyle(el).transitionDelay,
                property: getComputedStyle(el).transitionProperty,
              }
            : { duration: "(absent)", delay: "(absent)", property: "(absent)" };
        }
        return out;
      });
      await ctx.close();
      return rows;
    };
    const out = { after: await read(AFTER), control: await read(CONTROL) };
    bank(`b-toggle-beats-${info.project.name}`, out);
    expect(out).toBeTruthy();
  });

  test("C the drawer SLIDES: the WAAPI tuple, three poses", async ({ browser }, info) => {
    const out: Record<string, unknown> = {};
    for (const pose of POSES) {
      const ctx = await browser.newContext({
        viewport: { width: pose.w, height: pose.h },
        deviceScaleFactor: pose.touch ? 3 : 1,
        hasTouch: pose.touch,
        isMobile: pose.touch,
      });
      const page = await ctx.newPage();
      await load(page, AFTER);
      const tab = page.locator(".drawer-tab");
      let tuple: unknown = "(no tab)";
      if (await tab.count()) {
        await tab.click({ force: true });
        await page.waitForTimeout(110); // mid-glide
        tuple = await page.evaluate(() =>
          document
            .getAnimations()
            .filter((a) => a.playState === "running")
            .map((a) => {
              const t = a.effect?.getTiming() ?? {};
              return {
                id: (a as Animation & { id?: string }).id ?? "",
                easing: t.easing,
                duration: t.duration,
                fill: t.fill,
                composite: (a.effect as KeyframeEffect | undefined)?.composite,
              };
            }),
        );
        await page.waitForTimeout(700); // the sheet SLIDES — settle before measuring it open
      }
      const settled = await page.evaluate(() => {
        const el = document.querySelector("#controls-drawer");
        const r = el?.getBoundingClientRect();
        return {
          running: document.getAnimations().filter((a) => a.playState === "running").length,
          rect: r ? [+r.top.toFixed(2), +r.left.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)] : null,
        };
      });
      out[pose.name] = { tuple, settled };
      await ctx.close();
    }
    bank(`c-drawer-slide-${info.project.name}`, out);
    expect(out).toBeTruthy();
  });

  test("D pi: the rect census, after vs 74a2b5d9", async ({ browser }, info) => {
    const census = async (url: string, pose: (typeof POSES)[number]) => {
      const ctx = await browser.newContext({
        viewport: { width: pose.w, height: pose.h },
        deviceScaleFactor: pose.touch ? 3 : 1,
        hasTouch: pose.touch,
        isMobile: pose.touch,
      });
      const page = await ctx.newPage();
      await load(page, url);
      await page.waitForTimeout(900);
      const rects = await page.evaluate(() => {
        const out: Record<string, number[]> = {};
        const dupes = new Set<string>();
        for (const el of Array.from(document.querySelectorAll("*"))) {
          const k = `${el.tagName}.${el.className || ""}#${el.id || ""}`;
          if (k in out) {
            dupes.add(k);
            continue;
          }
          const r = el.getBoundingClientRect();
          out[k] = [+r.top.toFixed(2), +r.left.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
        }
        return { out, dupes: dupes.size, total: document.querySelectorAll("*").length };
      });
      await ctx.close();
      return rects;
    };
    const out: Record<string, unknown> = {};
    for (const pose of POSES) {
      const a = await census(AFTER, pose);
      const b = await census(CONTROL, pose);
      const shared = Object.keys(a.out).filter((k) => k in b.out);
      let max = 0;
      const worst: string[] = [];
      for (const k of shared) {
        const d = Math.max(...a.out[k].map((v, i) => Math.abs(v - b.out[k][i])));
        if (d > 0.001) worst.push(`${k} Δ${d.toFixed(2)}`);
        max = Math.max(max, d);
      }
      out[pose.name] = {
        comparedKeys: shared.length,
        rectsOnPage: a.total,
        collidingKeys: a.dupes,
        maxDelta: +max.toFixed(3),
        movedRects: worst.length,
        worst: worst.slice(0, 10),
      };
    }
    bank(`d-pi-rects-${info.project.name}`, out);
    expect(out).toBeTruthy();
  });

  test("E the two icons: what the curve change is worth, fixed t", async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await load(page, AFTER);
    const read = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const sample = (ease: string) => {
        const el = document.createElement("div");
        el.style.cssText = "position:fixed;left:-9999px;opacity:0";
        document.body.append(el);
        const anim = el.animate([{ opacity: "0" }, { opacity: "1" }], {
          duration: 350,
          easing: ease,
          fill: "both",
        });
        anim.pause();
        const out: number[] = [];
        for (let i = 0; i <= 10; i++) {
          anim.currentTime = (350 * i) / 10;
          out.push(Number(getComputedStyle(el).opacity));
        }
        anim.cancel();
        el.remove();
        return out;
      };
      const layDown = cs.getPropertyValue("--verb-layDown-ease").trim();
      const standard = cs.getPropertyValue("--ease-standard").trim();
      const dusk = cs.getPropertyValue("--verb-dusk-ease").trim();
      const a = sample(layDown);
      const b = sample(standard);
      const d = sample(dusk);
      const e = sample("ease");
      return {
        layDown,
        standard,
        dusk,
        iconMaxDelta: +Math.max(...a.map((v, i) => Math.abs(v - b[i]))).toFixed(4),
        duskMaxDelta: +Math.max(...d.map((v, i) => Math.abs(v - e[i]))).toFixed(4),
        duskSamplesEqual: d.every((v, i) => Math.abs(v - e[i]) < 1e-9),
        layDownSamples: a,
        standardSamples: b,
      };
    });
    await ctx.close();
    bank(`e-curves-${info.project.name}`, read);
    expect(read.layDown).not.toBe("");
  });

  test("F the fold TURNS: a live transform on the peek host", async ({ browser }, info) => {
    const out: Record<string, unknown> = {};
    for (const pose of [POSES[0], POSES[2]]) {
      const ctx = await browser.newContext({
        viewport: { width: pose.w, height: pose.h },
        deviceScaleFactor: pose.touch ? 3 : 1,
        hasTouch: pose.touch,
        isMobile: pose.touch,
      });
      const page = await ctx.newPage();
      await load(page, AFTER);
      // the gallery exit: the one page in the product that goes over
      const trigger = page.locator("[data-gallery-open], .masthead-title, .logo-button").first();
      let frames: string[] = [];
      let tuple: unknown = "(not triggered)";
      if (await trigger.count()) {
        await trigger.click({ force: true }).catch(() => {});
        await page.waitForTimeout(60);
        tuple = await page.evaluate(() =>
          document
            .getAnimations()
            .filter((a) => a.playState === "running")
            .map((a) => {
              const t = a.effect?.getTiming() ?? {};
              return { id: (a as Animation & { id?: string }).id ?? "", easing: t.easing, duration: t.duration, fill: t.fill };
            }),
        );
        frames = await page.evaluate(
          () =>
            new Promise<string[]>((resolve) => {
              const seen: string[] = [];
              let n = 0;
              const tick = () => {
                const el = document.querySelector(".board-peek-host") as HTMLElement | null;
                seen.push(el ? getComputedStyle(el).transform : "(absent)");
                if (++n < 8) requestAnimationFrame(tick);
                else resolve(seen);
              };
              requestAnimationFrame(tick);
            }),
        );
      }
      out[pose.name] = { tuple, frames, liveFrames: frames.filter((f) => f !== "none" && f !== "(absent)").length };
      await ctx.close();
    }
    bank(`f-fold-turn-${info.project.name}`, out);
    expect(out).toBeTruthy();
  });
});
