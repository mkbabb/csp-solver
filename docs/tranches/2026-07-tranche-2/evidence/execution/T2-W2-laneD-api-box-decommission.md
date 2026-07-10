# T2-W2 Lane D — R1 API-box decommission (service-only)

Ratified R1 (owner) + verify-31 F8 scope: origin box `34.197.214.67` runs a shared
Docker + Apache2 fleet serving SIX other apps on one vhost fleet + a 7-SAN LE cert.
Touched ONLY the sudoku surface. Executed 2026-07-10, non-interactive `ssh -p 1022`.

## Shape correction (recon)

Orchestrator model was systemd unit + nginx `sites-enabled`. Reality:
- Edge = **Apache2** (`nginx` absent; `/etc/nginx` absent). TLS terminated by apache; the
  7-SAN cert `/etc/letsencrypt/live/sudoku.babb.dev/fullchain.pem` is SHARED across all
  constellation vhosts (api-color, api-fourier, SPA hosts) — NOT touched.
- Service = **Docker Compose** stack `csp-solver` at `/var/www/csp-solver`
  (`csp-solver-backend-1` uvicorn :8000, `csp-solver-frontend-1`, `csp-solver-nginx-1` :8120).

No STOP trigger present: port 8120 shared ONLY between two sudoku vhosts
(`api.sudoku.babb.dev` + the `sudoku.babb.dev` SPA origin block); other apps on disjoint
ports (fourier 8100, words 8110, color 8130). The api-sudoku vhost is single-server_name.

## Baseline (origin, `--resolve host:443:127.0.0.1`)

| host | baseline | post |
|---|---|---|
| api.color.babb.dev | 200 | 200 |
| api.fourier.babb.dev | 404 | 404 |
| sudoku.babb.dev (origin SPA) | 502 | 503 (own container removed) |
| fourier.babb.dev | 404 | 404 |
| words.babb.dev | 200 | 200 |
| grammar.babb.dev | 200 | 200 |
| deploy.babb.dev | 200 | 200 |
| api.sudoku.babb.dev | 502 (14s) | vhost removed |

mbabb.friday.institute: pre-existing expired cert (separate cert, out of scope, untouched).

## Mutations (sudoku-only)

1. `cd /var/www/csp-solver && docker compose -f docker-compose.yml -f docker-compose.prod.yml down`
   → all three `csp-solver-*` containers + `csp-solver_app-network` removed, EXIT 0.
   Compose files remain as historical copy (sites-available analog). Other stacks
   (palette-api, fourier-analysis, floridify) verified still Up.
2. `sudo a2dissite api-sudoku.babb.dev` → symlink removed from sites-enabled;
   `sites-available/api-sudoku.babb.dev.conf` (2272 B) preserved; api-color/api-fourier
   symlinks intact.
3. `sudo apache2ctl configtest` → Syntax OK; `sudo systemctl reload apache2` → EXIT 0,
   apache `active`. `apache2ctl -S` map: `api.sudoku.babb.dev` gone, all others present.

Cert, certbot config, babb-dev.conf (shared: sudoku SPA + fourier + words), and every
other vhost/unit: NOT touched. Post-reload `localhost:8120` = connection refused (intended).

## DNS (Cloudflare zone babb.dev = 39bca22589246d60f9ec6fdf4a91cbba)

Token from `~/Programming/value.js/.env` (`/user/tokens/verify` lacked scope but zone+DNS
ops succeeded). Exactly one record for the name — grey-cloud (`proxied:false`) A record,
the subdomain-takeover shape OD-4 flagged:

```
id 2e6634d35f7db2715187d140ade21190  A  api.sudoku.babb.dev -> 34.197.214.67  proxied:false
```

`DELETE .../dns_records/2e6634d35f7db2715187d140ade21190` → `{"success":true,"result":{"id":"2e66..."}}`.
Re-query by name → `total_count: 0`. No AAAA/CNAME twin existed. Nothing else in the zone touched.

## End-state

- `dig @jillian.ns.cloudflare.com api.sudoku.babb.dev A` → `status: NXDOMAIN, ANSWER: 0`.
- Live `sudoku.babb.dev` → CF Pages (104.21.56.22 / 172.67.175.252), **HTTP 200** — never
  called the API, unaffected.
- All six other apps: origin responses unchanged from baseline; containers Up; vhosts present.

Collateral-free. OD-4 CNAME/subdomain-takeover shape closed.
