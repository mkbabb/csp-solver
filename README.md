# csp-solver

A generalized CSP (constraint-satisfaction-problem) solver, written in Python 3.9.
Includes an application of the aforesaid: a fullstack webapp implementation of
hyper-generalized sudoku, using Flask, Apache2, WSGI, and JavaScript.

## Quickstart

This project requires several dependencies, namely numpy for the backend computation,
and Flask for the webserver. These can be installed via several vectors.

### via [`poetry`](https://python-poetry.org/docs/)

Install poetry, then run

> poetry install

And you're done.

### via `pip`

This project requires Python ^3.9, thus one must use some variant of `pip3`. Install the
requirements via

> pip3 install -r requirements.txt

## CSP API

The main CSP class contains three input options: `pruning_type`, `variable_ordering`,
and `max_solutions`.

### `pruning_type`

Defines the pruning strategy used within the backtracking or backjumping scheme. The
possible values are:

-   `FORWARD_CHECKING`
    -   Forward checking implementation.
-   `AC3`
    -   MAC - maintaining arc consistency implementation, variant 3.
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
    -   Implementation of the DVO "fail-first" scheme.

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

## More Examples

More examples can be found within [`csp.py`](csp/csp.py): a demo of n-queens and
map-coloring is executed if run directly.

Additionally, Futoshiki and Sudoku are implemented in pure Python.

[`futoshiki.py`](csp/futoshiki.py) is a command line Python application, using a input
data file. More information can be found here.

[`sudoku.py`](csp/sudoku.py), for a coded N, generates the first 10000 solutions to an
input blank board.

## Sudoku Webserver

As an application of the aforesaid CSP api, we created a generalized sudoku solver. To
better visualize the problem and solution space, we created a fullstack web application:
the backend is written in Python using Flask, and utilizes our CSP API; the frontend is
written in vanilla JavaScript. It's server via Apache2 + WSGI on a development Amazon
EC2 server.

The sudoku application has but two routes, one for generating a random board, and one
for solving an input board.

Due to the generality of our utilized CSP solver, the sudoku board can easily scale to
be of arbitrary size. For the sake of browser performance and computationally
complexity, the UI is bound to boards of subgrid size: 2, 3, and 4.

Boards of size 3 are the most common, thus we optimize for enjoyment with these boards:
a selection of 100 hand curated starting "seed" boards are used to generate all boards
of size 3 shown.

### Running

As mentioned hereinbefore, the Flask server is proxyed to Apache via WSGI - this
development server is hosted within Amazon and served on the open internet.

If one wants to serve there own variant of the application, the `app.wsgi` file must be
modified to point to your appropriate Python 3 distribution. Additionally, a template
Apache2 `.conf` file can be found [here](app/config/default.conf).

Locally, the webserver can be run at the root directory via:

    flask run

or

    python3 -m app
