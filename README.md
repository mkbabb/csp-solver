# csp-solver

See the demo at [https://go.ncsu.edu/sudoku](https://go.ncsu.edu/sudoku).

Generalized CSP (constraint satisfaction problem) solver in Python 3.13.
The repository also includes a full-stack Sudoku web app: FastAPI backend, Vue 3 +
TypeScript frontend, Docker Compose orchestration, and Nginx reverse proxy.

## Quickstart

### Docker (recommended)

```bash
docker compose up
```

Backend on `:8000`, frontend on `:3000`.

### Manual

The backend uses
[`uv`](https://docs.astral.sh/uv/) for package management; the frontend uses `npm`.

#### Backend

```bash
cd backend
uv sync
uv run uvicorn csp_solver.api.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Production

```bash
docker compose -f docker-compose.prod.yml up
```

Nginx reverse proxy on `:80`. Configure environment via `.env` (see `.env.example`).

## CSP API

The core CSP class (`backend/src/csp_solver/solver/csp.py`) accepts three configuration
options: `pruning_type`, `variable_ordering`, and `max_solutions`.

### `pruning_type`

Pruning strategy for backtracking search:

-   `FORWARD_CHECKING`
    -   Forward checking.
-   `AC3`
    -   Maintaining arc consistency (MAC), variant 3.
-   `AC_FC`
    -   AC + forward checking hybrid; low-order variant of AC-1.
-   `NO_PRUNING`
    -   No pruning.

#### Brief: Backtracking vs Hill-climbing

These pruning strategies are only applicable given a backtracking solver: if
one's using the min-conflicts hill-climbing solver, no pruning at any stage is done.

### `variable_ordering`

Variable selection heuristic during search:

-   `NO_ORDERING`
    -   Chronological ordering used.
-   `FAIL_FIRST`
    -   Implementation of the DVO "fail-first" scheme (MRV heuristic).

`max_solutions` caps the number of solutions returned. Defaults to 1.

### Using the API

Once the CSP object is created, a set of variables, domains, and constraints must be
added to it before solving.

Here's an example of implementing map coloring using our API (shortened for
readability).

```python
variables = [
    "Western Australia",
    "Northern Territory",
    "South Australia",
    "Queensland",
    "New South Wales",
    "Victoria",
    "Tasmania",
]
domain = ["red", "green", "blue"]

csp = CSP(pruning_type, variable_ordering, max_solutions)

csp.add_variables(domain, *variables)

csp.add_constraint(
    map_coloring_constraint("Western Australia", "Northern Territory")
)
csp.add_constraint(map_coloring_constraint("Western Australia", "South Australia"))
csp.add_constraint(map_coloring_constraint("South Australia", "Northern Territory"))
csp.add_constraint(map_coloring_constraint("Queensland", "Northern Territory"))
csp.add_constraint(map_coloring_constraint("Queensland", "South Australia"))
csp.add_constraint(map_coloring_constraint("Queensland", "New South Wales"))
csp.add_constraint(map_coloring_constraint("New South Wales", "South Australia"))
csp.add_constraint(map_coloring_constraint("Victoria", "South Australia"))
csp.add_constraint(map_coloring_constraint("Victoria", "New South Wales"))
```

Constraints use one extra convention: a
constraint factory returns a tuple of a checker function and the variables associated
with that checker.

Example:

```python
def lambda_constraint(func: Callable[[Any], bool], *variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)

        if len(variables) == len(current_values):
            return func(*current_values)
        else:
            return True

    return check, list(variables)
```

The inner function, `check`, consumes the current solution and returns a boolean. If the
constraint is not yet fully assigned, it returns `True` so search can continue.

The outer function returns `check` and the constrained variable list. This yields terse
call sites such as:

```python
csp.add_constraint(map_coloring_constraint("Victoria", "New South Wales"))
```

## Additional Implementations

Futoshiki and Sudoku are implemented atop the CSP engine:

-   [`futoshiki.py`](backend/src/csp_solver/solver/futoshiki.py): command-line solver,
    reads puzzle from input file (grid values + inequality constraints).
-   [`sudoku.py`](backend/src/csp_solver/solver/sudoku.py): board generation with
    difficulty calibration, uniqueness enforcement, and pre-computed solution banks.

## Sudoku Webserver

The backend is FastAPI; the frontend is Vue 3 + TypeScript with a hand-drawn SVG
rendering stack. UI features:

- Path-based line boil on the grid (4 pre-computed variants cycled at ~6.7fps)
- Custom SVG glyphs with draw-in and hover wiggle
- Rough.js decorative elements (vine border, doodle accents)
- Stroke-dashoffset draw-ins (~800ms with seeded jitter)
- Theme-aware celestial wobble effects
- Live filter/boil tuner

Core boil and path primitives come from
[`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil). Sudoku-specific grid
path generation remains local in `frontend/src/lib/gridPaths.ts`.
Library animation internals are documented in
[`pencil-boil/README.md`](https://github.com/mkbabb/pencil-boil#animation-model).

The Sudoku API exposes three routes:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board |
| POST | `/api/v1/board/solve` | Solve input board |
| GET | `/api/v1/health` | Health check |

The CSP solver supports arbitrary subgrid sizes. Due to rendering and compute constraints, the UI
currently exposes subgrid sizes 2, 3, and 4 (4×4, 9×9, and 16×16).

Size 3 is the default path. A set of 100 seed boards is used to generate size-3
boards. Pre-computed solution banks exist for sizes 2 through 5.

#### Board Generation

Board generation uses two strategies. The fast path, used when pre-computed templates
exist, selects a random template and applies a random Sudoku symmetry transform: digit
permutation, row/column permutation within bands and stacks, band/stack permutation,
and transposition. For N=3, this symmetry group yields ~1.22 billion distinct grids per
base template. Generation on this path is O(1)—no search required.

When templates are unavailable, the solver falls back to generate-and-reduce: generate a
complete solution, remove cells with uniqueness verification, and calibrate difficulty
by backtrack count. Templates reside in
`backend/src/csp_solver/data/sudoku_puzzles/{N}/{difficulty}/`. The offline generation
script is `backend/scripts/generate_templates.py`.

Difficulty is calibrated by the solver's backtrack count:
- **Easy**: 0 backtracks (solvable by constraint propagation alone)
- **Medium**: < 50 backtracks
- **Hard**: > 100 backtracks
