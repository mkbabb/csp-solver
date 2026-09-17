# A3 REFUTER — index

Port 4258 (assigned 4257 held). dist UNMOVED: identity-before.txt == identity-after.txt.
Load 3.48 start → 3.33 finish (lane took its matrix at 8.06). Chromium only; no Safari, no iOS.

- retake-cacheprobe.jsonl + retake-trace.txt — lane's A3-cache-probe.mjs, 4x/Fast-3G/desk, 3 windows, re-run verbatim; fold table at the tail of the trace.
- retake-wasm.jsonl / retake-wasm-cpu1.jsonl — lane's A3-wasm-probe.mjs at 4x and at 1x (CPU isolated, link held).
- r3-truecold.jsonl — lane's A3-truecold-probe.mjs, 2 windows.
- R3-truecold-wasm.mjs → r3-truecold-wasm.jsonl — MY control: is the duplicate wasm fetch a CDP LOAD_BYPASS_CACHE artifact? No. Both pay the wire on a true first visit.
- R3-wasm-single-flight.mjs → r3-single-flight.jsonl — MY counterfactual: one fetch 744.6 ms vs two concurrent 1338.0 ms over the same link. Removable = 593 ms, not 716.
- r3-edge-get.jsonl — live edge, GET not HEAD, 5 passes.
