# How these were run (pass-2 research, MRK-ABS)

Node/vite/playwright resolve a scratch config's own imports from the config file's nearest
`node_modules`, and this evidence directory has none. So the three `*.probe.ts` files were
COPIED into a throwaway `web/frontend/.pass2-mrkabs/` (removed afterwards; the main tree is
clean) and run from `web/frontend`:

    npx vite --config <this dir>/vite.head.config.mjs --host 127.0.0.1 --port 4238 --strictPort
    PROBE_OUT=<…>/logs npx playwright test --config .pass2-mrkabs/pw.config.ts \
        --project chromium -g "<test name>"
    INJECT_TOKEN=1 PROBE_OUT=<…>/logs npx playwright test --config .pass2-mrkabs/pw.config.ts -g arrival

The `.mjs` probes import the library by absolute path for the same reason and run anywhere:

    node k-window.mjs · node clearance.mjs · node dbytes.mjs · node darkarm.mjs

`zero.probe.ts`, `scrollport.probe.ts` and `infobtn.probe.ts` are the three short follow-ups
banked beside the others; their logs are `zero-stops-*.json`, `scrollport-*.json`,
`infobtn-*.json`.
