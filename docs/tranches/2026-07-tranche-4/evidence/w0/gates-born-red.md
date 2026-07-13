# T4-W0 — gate probes, born-RED bank (pre-work)

Probed 2026-07-12 at HEAD `ed35b347` (the tranche's execution base), before any W0 work. Every probe verbatim from `waves/T4-W0-record-estate.md`; every row FAILS as authored.

| Gate | Probe | Output at HEAD |
|---|---|---|
| dependabot | `gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate --jq '[.[]\|select(.state=="open")]\|length'` | **9** |
| recap-java | delete-order grep across T3 README + appendix B | **4 live lines**: B-prompt-recap.md:34 (R5 "java branch delete OPEN"), :110 ("the one open action is R5 … java delete"), README.md:129 ("verified-dead java branch delete … ride WGATE"), :135 ("R5 worktree purge + java branch delete — carried to WGATE") |
| recap-ledger | `grep -cin -E "drawer\|OOM\|safari\|kill all cron" B-prompt-recap.md` | **0** — E-series absent entire |
| crons | `CronList` at wave start | **zero live jobs** (E6 satisfied by enumeration; prior kill = WGATE `CronDelete efaae137`) |
| branches | `git branch --merged \| grep -c worktree-` / total | **44** merged / 46 total (unmerged: `worktree-wf_34cf008e-c2c-17`, `worktree-wf_977ec162-15b-2`) |
| tags | `git tag --list` | `pre-morph-excision`, `v0.2.0` only — **v0.3.0 absent**; `pre-morph-excision` and `v0.2.0` both resolve to `4568dc7e` (the byte-dup) |
| publish | crates.io `max_version` | **0.3.0** (tree declares 0.4.0 in both Cargo.tomls; `~/.cargo/credentials.toml` present) |
| deploy-doc | `grep -rln "34.197.214.67\|/var/www" --include="*.md" . \| grep -v docs/tranches` | **docs/precepts/infra/deploy.md, docs/precepts/infra/domains.md** |
| declarations | browser-matrix / en-only / no-telemetry rows in-tree | **0** |
| bloat | tracked PNGs | **420 files, 70 MB** (clone cost 97 MB full / 48 MB shallow, from the r3/r4 measurement) |

Working-tree note: `CONTRIBUTING.md` carries a pre-existing staged deletion (predates the wave; resolution is W14's row — untouched by W0).
