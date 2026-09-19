#!/usr/bin/env node
// Dist identity + bundle delta, both trees. Entry chunk + entry css + index.html: raw,
// gzip -9, md5. Numbers only.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { join } from "node:path";

const TREES = {
  after:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-60/web/frontend/dist-after",
  control:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/control/web/frontend/dist-control",
};
const out = {};
for (const [name, dir] of Object.entries(TREES)) {
  const assets = readdirSync(join(dir, "assets"));
  const pick = (re) => assets.find((f) => re.test(f));
  const rows = {};
  for (const [label, file] of [
    ["entryJs", join(dir, "assets", pick(/^index-.*\.js$/))],
    ["entryCss", join(dir, "assets", pick(/^index-.*\.css$/))],
    ["indexHtml", join(dir, "index.html")],
  ]) {
    const buf = readFileSync(file);
    rows[label] = {
      name: file.split("/").pop(),
      raw: buf.length,
      gz: gzipSync(buf, { level: 9 }).length,
      md5: createHash("md5").update(buf).digest("hex"),
    };
  }
  rows.totalAssetBytes = readdirSync(join(dir, "assets")).reduce(
    (n, f) => n + statSync(join(dir, "assets", f)).size,
    0,
  );
  out[name] = rows;
}
const d = (k, f) => out.after[k][f] - out.control[k][f];
out.delta = {
  entryJsRaw: d("entryJs", "raw"),
  entryJsGz: d("entryJs", "gz"),
  entryCssRaw: d("entryCss", "raw"),
  entryCssGz: d("entryCss", "gz"),
  indexHtmlRaw: d("indexHtml", "raw"),
  totalAssetBytes: out.after.totalAssetBytes - out.control.totalAssetBytes,
  combinedRaw: d("entryJs", "raw") + d("entryCss", "raw") + d("indexHtml", "raw"),
  combinedGz: d("entryJs", "gz") + d("entryCss", "gz"),
};
console.log(JSON.stringify(out, null, 1));
