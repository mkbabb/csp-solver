// rr-once.mjs <lib> <fe> : the exported reserveReading over a real tree, timed
import { readFileSync, existsSync } from "node:fs";
const [lib, fe] = process.argv.slice(2);
const L = await import(lib);
const t0 = Date.now();
const files = L.sources(fe);
const fx = { fe, files, read: (f) => readFileSync(f, "utf8"), exists: existsSync };
const fails = L.reserveReading(L, fx, "src/pencil/chrome/MarginNote.vue");
console.log(JSON.stringify({ fails, files: files.length, ms: Date.now() - t0 }));
