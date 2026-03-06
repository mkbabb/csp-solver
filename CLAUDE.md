# CSP Solver — Project Guide

Fullstack CSP solver: Python 3.13 backend (FastAPI) + Vue 3 frontend (TypeScript, Tailwind v4). Primary application: generalized Sudoku (2×2 through 5×5 subgrids). Deployed via Docker Compose + Nginx.

## File Tree

```
.
├── backend/                    # FastAPI + CSP solver (Python 3.13, uv)
│   ├── CLAUDE.md
│   ├── Dockerfile              # Multi-stage: dev (reload) / prod (4 workers)
│   ├── pyproject.toml          # uv/hatchling config, ruff, mypy, pytest
│   ├── uv.lock
│   ├── src/csp_solver/
│   │   ├── solver/             # CSP engine (csp, bitset_domain, gac_alldiff, nogoods, local_search) + puzzles (sudoku, sudoku_transforms, futoshiki)
│   │   ├── api/                # FastAPI routes, Pydantic models
│   │   └── data/               # Pre-computed solution boards (JSON)
│   └── tests/                  # pytest + pytest-asyncio
├── frontend/                   # Vue 3 + TypeScript + Tailwind v4
│   ├── CLAUDE.md
│   ├── Dockerfile              # Multi-stage: dev (Vite HMR) / prod (nginx)
│   ├── package.json            # roughjs, keyframes.js, lucide, vueuse
│   ├── vite.config.ts          # Port 3000, API proxy → :8000
│   ├── tailwind.config.ts      # Custom theme, animations, cartoon shadows
│   ├── tsconfig.json           # ES2020, strict, @/* path alias
│   └── src/
│       ├── App.vue             # Root layout, responsive orchestration
│       ├── main.ts             # Entry point
│       ├── assets/index.css    # Tailwind v4, CSS vars, paper texture
│       ├── components/         # custom/ (game) + decorative/ (visual)
│       ├── composables/        # State, API, theme, line boil
│       └── lib/                # PRNG, path generation, grid paths, glyphs, scribble fill, vine/doodle/celestial shapes
├── nginx/
│   └── sudoku.conf             # Reverse proxy config (production)
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline
├── docker-compose.yml          # Dev: backend + frontend
├── docker-compose.prod.yml     # Prod: backend + frontend + nginx
├── .env.example                # Environment variable template
└── README.md                   # Project documentation
```

## Architecture

```
Browser ←→ Nginx (:80) ←→ Frontend (Vue 3, :3000)
                         ←→ Backend (FastAPI, :8000)
                              └── CSP Solver Engine
```

- **Backend**: Generalized CSP solver with backtracking, forward checking, AC3, AC-FC pruning. BitsetDomain for O(1) domain ops. AC-2001 residual supports. dom/wdeg variable ordering. GAC all-different (Régin 1994). Symmetry transforms for fast board generation via pre-computed templates. Applied to Sudoku and Futoshiki.
- **Frontend**: Hand-drawn aesthetic (Rough.js, jagged SVG grid lines, custom glyphs, stroke-dasharray animations). Grid lines use path-based boil (pre-computed path variants cycled at ~6.7fps) for visual perturbation. Pane-less board with ~800ms jittered draw-in. Centered header (@mbabb | logo | dark-mode toggle). Given cells render with `sparkle-rainbow` gradient stroke + auto-wiggle, reverting to `user-ink` on one-click override. Noise-staggered reveal animations (Fisher-Yates shuffle, 40ms/cell). Solve fills only blank cells; consecutive solves idempotent. Action buttons have custom icons with click animations: DiceIcon (tumble roll + pip pop), Eraser (horizontal scrub), SolveIcon (check draw-in + star sparkle). Sun-wobble filter + sparkle diamonds (light), moon + twinkling stars (dark). `FilterTuner` for live-tuning filter and boil parameters. No router, no state library—pure Vue 3 Composition API.
- **API**: `GET /api/v1/board/random/{size}/{difficulty}`, `POST /api/v1/board/solve`, `GET /api/v1/health`

## Dev Quickstart

```bash
# Backend
cd backend && uv sync && uv run uvicorn csp_solver.api.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev

# Full stack (Docker)
docker compose up
```

## Key Conventions

- **Python**: ruff (line-length 100, rules E/F/I/UP), mypy strict, pytest-asyncio (auto mode)
- **TypeScript**: strict mode, `@/*` path aliases, Prettier + tailwind plugin
- **Animations**: All respect `prefers-reduced-motion`. Use `@mkbabb/keyframes.js` for imperative animation, CSS transitions for declarative.
- **SVG Filters**: Named presets (`grain-static`, `wobble-logo`, `wobble-celestial`, `wobble-heart`, `stroke-light`, `stroke-dark`) defined in `SvgFilters.vue`.
- **Constraints as HOFs**: Constraints return `(checker_fn, variables_list)`. The checker receives the current solution dict and returns bool.
- **Sudoku boards**: Pre-computed solution banks in `data/sudoku_solutions/{N}/`. Pre-computed puzzle templates in `data/sudoku_puzzles/{N}/{difficulty}/`. Fast-path generation: random template + symmetry transform (~1.22B grids per template for N=3).
- **Difficulty**: Measured by solver backtrack count. EASY (0 backtracks), MEDIUM (<50), HARD (>100).
