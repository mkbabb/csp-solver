// RUN: node build-rekey-probe.mjs --phase seed|after --profile <dir> --port 4253 --out r.json
//      (cwd: web/frontend of the w8-bake worktree)
//
// C11's "a build change provably re-bakes" clause, taken on ONE browser profile across a
// rebuild. `seed` loads twice and reports the second load's encodes (the store answering).
// The caller then rebuilds and restarts the preview server on the SAME PORT — same origin,
// same profile, new entry hash — and `after` loads twice more: the first load must bake the
// full round again (every stored key carries the old entry name and cannot match), the second
// must be back to the restored count under the new key.
//
// The census hooks are `attribution/A1/bake-census.mjs`'s, trimmed to the toBlob counter.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium } = req("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const PHASE = arg("phase", "seed");
const PROFILE = arg("profile", "/tmp/c11-profile");
const PORT = arg("port", "4253");
const OUT = arg("out", "rekey.json");
const BASE = `http://127.0.0.1:${PORT}/`;

const INIT = () => {
  window.__n = { encodes: [], entry: null };
  const realToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    window.__n.encodes.push([this.width, this.height]);
    return realToBlob.call(this, cb, type, q);
  };
  addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector('script[type="module"][src]');
    window.__n.entry = el ? el.src.slice(el.src.lastIndexOf("/") + 1) : null;
  });
};

const ctx = await chromium.launchPersistentContext(PROFILE, {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: true,
});
const page = await ctx.newPage();
await page.addInitScript(INIT);
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

const load = async () => {
  await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(12000);
  return page.evaluate(() => ({ encodes: window.__n.encodes.length, entry: window.__n.entry }));
};
const first = await load();
const second = await load();
writeFileSync(OUT, JSON.stringify({ phase: PHASE, first, second }, null, 1) + "\n");
console.log(JSON.stringify({ phase: PHASE, first, second }));
await ctx.close();
