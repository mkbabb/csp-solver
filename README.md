# csp-solver

A generalized CSP (constraint-satisfaction-problem) solver, written in Python 3.13.
Includes an application of the aforesaid: a fullstack webapp implementation of
hyper-generalized sudoku — the backend powered by FastAPI, the frontend by Vue 3 +
TypeScript, the whole thing containerized via Docker Compose and proxied through Nginx.

## Quickstart

### Docker (recommended)

```bash
docker compose up
```

Backend on `:8000`, frontend on `:3000`.

### Manual

This project requires several dependencies. The backend uses
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

Defines the pruning strategy used within the backtracking scheme. The possible values
are:

-   `FORWARD_CHECKING`
    -   Forward checking implementation.
-   `AC3`
    -   MAC — maintaining arc consistency implementation, variant 3.
-   `AC_FC`
    -   Arc consistency + forward checking implementation, low order variant of AC-1.
-   `NO_PRUNING`
    -   No pruning methodology employed.

#### Brief: Backtracking vs Hill-climbing

The above pruning methodologies are only applicable given a backtracking solver: if
one's using the min-conflicts hill-climbing solver, no pruning at any stage is done.

### `variable_ordering`

Defines the variable ordering scheme when retrieving the next variable within the
variable stack to attempt at solving for. The possible values are:

-   `NO_ORDERING`
    -   Chronological ordering used.
-   `FAIL_FIRST`
    -   Implementation of the DVO "fail-first" scheme (MRV heuristic).

`max_solutions` simply defines the maximal number of solutions found before returning.
Defaults to 1.

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

Adding variables and the domains thereof is rather straightforward, but adding
constraints can be a little daunting. A constraint is defined as a high order function
that returns a tuple of: a checker function, used to verify if a solution is consistent,
and a list of variables associated with this constraint.

A good demonstration of this can be seen by way of the generalized lambda constraint:

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

The inner function, `check`, simply consumes the current solution state, which, by its
function signature, must return a boolean. If the current solution state isn't
applicable to being called, it defaults to true.

The outer function then returns check, and the list of variables constrained by this
function. This allows for terse constraint syntax like:

```python
csp.add_constraint(map_coloring_constraint("Victoria", "New South Wales"))
```

To be employed.

## Additional Implementations

Additionally, Futoshiki and Sudoku are implemented atop the CSP engine:

-   [`futoshiki.py`](backend/src/csp_solver/solver/futoshiki.py) — command-line solver,
    reads puzzle from input file (grid values + inequality constraints).
-   [`sudoku.py`](backend/src/csp_solver/solver/sudoku.py) — board generation with
    difficulty calibration, uniqueness enforcement, and pre-computed solution banks.

## Sudoku Webserver

As an application of the aforesaid CSP API, we created a generalized sudoku solver. To
better visualize the problem and solution space, we created a fullstack web application:
the backend is written in Python using FastAPI; the frontend is written in Vue 3 +
TypeScript with a hand-drawn crayon aesthetic—path-based line boil on the grid (4
pre-computed path variants cycled at ~6.7fps for organic perturbation), Rough.js logo
and decoratives, custom SVG glyphs, animated stroke-dasharray draw-ins (~800ms with
seeded jitter), pane-less board, sun/moon toggle with wobble filters and sparkle
decorations, and a FilterTuner for live parameter tuning of the hereinbefore visual
effects. Given cells are rendered with a `sparkle-rainbow` gradient stroke and
auto-wiggle animation; overriding a given cell reverts it to `user-ink` in a single
keystroke. Noise-staggered reveal animations—Fisher-Yates shuffle with seeded PRNG,
40ms per cell—accompany both randomize and solve. The solver fills only blank cells;
consecutive solves are idempotent. Action buttons bear custom icons with click
animations: a tumbling dice pair (randomize), a scrubbing eraser (clear), and a
check-with-sparkle draw-in (solve). It's served via Docker Compose + Nginx.

The sudoku application has but two routes, one for generating a random board, and one
for solving an input board:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board |
| POST | `/api/v1/board/solve` | Solve input board |
| GET | `/api/v1/health` | Health check |

Due to the generality of our utilized CSP solver, the sudoku board can easily scale to
be of arbitrary size. For the sake of browser performance and computational complexity,
the UI is bound to boards of subgrid size: 2, 3, and 4 (yielding 4×4, 9×9, and 16×16
grids respectively).

Boards of size 3 are the most common, thus we optimize for enjoyment with these boards:
a selection of 100 hand-curated starting "seed" boards are used to generate all boards
of size 3 shown. Pre-computed solution banks exist for sizes 2 through 5.

Difficulty is calibrated by the solver's backtrack count:
- **Easy**: 0 backtracks (solvable by constraint propagation alone)
- **Medium**: < 50 backtracks
- **Hard**: > 100 backtracks

## Project Structure

```
.
├── backend/                    # FastAPI + CSP solver (Python 3.13, uv)
│   ├── src/csp_solver/
│   │   ├── solver/             # csp.py, constraints.py, sudoku.py, futoshiki.py
│   │   ├── api/                # FastAPI app, routes, Pydantic models
│   │   └── data/               # Pre-computed solution boards (JSON)
│   └── tests/                  # pytest + pytest-asyncio
├── frontend/                   # Vue 3 + TypeScript + Tailwind v4
│   └── src/
│       ├── components/         # custom/ (game) + decorative/ (visual)
│       ├── composables/        # State, API, animation, theme
│       └── lib/                # SVG generation, glyphs, scribble fill
├── nginx/                      # Reverse proxy config
├── docker-compose.yml          # Dev environment
└── docker-compose.prod.yml     # Production environment
```
