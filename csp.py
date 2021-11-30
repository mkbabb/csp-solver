import pprint
from collections import defaultdict, deque
from enum import Enum, auto
from typing import *

V = TypeVar("V")
D = TypeVar("D")


Solution = Dict[V, D]


class PruningType(Enum):
    FORWARD_CHECKING = auto()
    AC3 = auto()
    NO_PRUNING = auto()


Constraint = Callable[[Solution], bool]


class CSP:
    def __init__(
        self,
        pruning_type: PruningType = PruningType.FORWARD_CHECKING,
        find_all_solutions: bool = False,
    ):
        self.pruning_type = pruning_type
        self.find_all_solutions = find_all_solutions

        if pruning_type == PruningType.FORWARD_CHECKING:
            self.pruning_function = self.forward_check
        elif pruning_type == PruningType.AC3:
            self.pruning_function = self.AC3
        elif pruning_type == PruningType.NO_PRUNING:
            self.pruning_function = lambda x, y: False

        self.variables: List[V] = []
        self.constraints: Dict[V, List[Constraint]] = defaultdict(list)
        self.current_domains: Dict[V, List[D]] = {}
        self.domains: Dict[V, List[D]] = {}

        self.variable_stack: Deque[V] = deque()

        self.neighbors: Dict[V, Set[V]] = defaultdict(set)
        self.pruned_map: Dict[V, Dict[V, Set[D]]] = defaultdict(
            lambda: defaultdict(set)
        )

        self.solutions: List[Solution] = []

    def add_variables(self, domain: List[D], *variables: V):
        for v in variables:
            self.variables.append(v)
            self.domains[v] = list(domain)

    def add_constraint(self, constraint_pair: Tuple[Constraint, List[V]]):
        constraint, variables = constraint_pair
        for v in variables:
            self.constraints[v].append(constraint)
            self.neighbors[v].update(variables)
            self.neighbors[v].remove(v)

    def get_neighbors(self, variable: V) -> Dict[V, Set[D]]:
        return self.neighbors.get(variable, {})

    def test_solution(self, solution: Solution, test_vals: Solution):
        solution = solution.copy()
        solution.update(test_vals)
        return solution

    def is_valid(self, variable: V, solution: Solution):
        return all((constraint(solution) for constraint in self.constraints[variable]))

    def restore_pruned_domains(self, variable: V):
        for neighbor, d_list in self.pruned_map.get(variable, {}).items():
            self.current_domains[neighbor].extend(d_list)
            d_list.clear()

    def forward_check(self, variable: V, solution: Solution):
        agenda = [i for i in self.get_neighbors(variable) if i not in solution]

        for Xi in agenda:
            for x in list(self.current_domains[Xi]):
                if not self.is_valid(Xi, self.test_solution(solution, {Xi: x})):
                    self.current_domains[Xi].remove(x)
                    self.pruned_map[variable][Xi].add(x)

    def AC3(self, variable: V, solution: Solution):
        def remove_inconsistent_values(Xi: V, Xj: V) -> bool:
            removed = False

            for x in list(self.current_domains[Xi]):
                for y in self.current_domains[Xj]:
                    if self.is_valid(Xj, self.test_solution(solution, {Xi: x, Xj: y})):
                        break
                else:
                    self.current_domains[Xi].remove(x)
                    self.pruned_map[variable][Xi].add(x)
                    removed = True

            return removed

        agenda = deque(
            (
                (Xj, variable)
                for Xj in self.get_neighbors(variable)
                if Xj not in solution
            )
        )

        while len(agenda) > 0:
            Xi, Xj = agenda.pop()
            if remove_inconsistent_values(Xi, Xj):
                for Xk in self.get_neighbors(Xi):
                    p = (Xk, Xi)
                    if Xk != Xj and p not in agenda and Xk not in solution:
                        agenda.append(p)

    def backtrack(self, solution: Solution):
        if len(solution) == len(self.variables):
            self.solutions.append(solution.copy())

            return self.find_all_solutions

        v = self.variable_stack.pop()

        for d in self.current_domains[v]:
            solution[v] = d

            if self.is_valid(v, solution):
                self.pruning_function(v, solution)

                if self.backtrack(solution):
                    return True

            self.restore_pruned_domains(v)
            del solution[v]

        self.variable_stack.append(v)

        return False

    def solve(self):
        self.variable_stack.clear()
        self.current_domains.clear()

        for v in self.variables:
            self.variable_stack.append(v)
            self.current_domains[v] = list(self.domains[v])
            self.pruned_map[v].clear()

        self.solutions = []

        solution = {}

        return self.backtrack(solution=solution)


def get_current_solution_values(
    variables: List[V], current_solution: Solution
) -> Optional[List[D]]:
    current_values = []
    for v in variables:
        if v in current_solution:
            current_values.append(current_solution[v])

    return current_values


def map_coloring_constraint(p1: str, p2: str):
    def check(current_solution: Solution):
        if p1 not in current_solution or p2 not in current_solution:
            return True
        else:
            return current_solution[p1] != current_solution[p2]

    return check, [p1, p2]


def n_queens_constraint(columns: List[int]):
    def check(current_solution: Solution):
        for (
            q1c,
            q1r,
        ) in current_solution.items():
            for q2c in range(q1c + 1, len(columns) + 1):
                if q2c in current_solution:
                    q2r = current_solution[q2c]
                    if q1r == q2r:
                        return False
                    if abs(q1r - q2r) == abs(q1c - q2c):
                        return False
        return True

    return check, list(columns)


def lambda_constraint(func: Callable[[Any], bool], *variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)

        if len(variables) == len(current_values):
            return func(*current_values)
        else:
            return True

    return check, list(variables)


def less_than_constraint(a, b):
    return lambda_constraint(lambda x, y: x < y, a, b)


def greater_than_constraint(a, b):
    return lambda_constraint(lambda x, y: x > y, a, b)


def equals_constraint(node, value: int):
    return lambda_constraint(lambda x: x == value, node)


def all_different_constraint(*variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)
        return len(current_values) == len(set(current_values))

    return check, list(variables)


def n_queens(n: int = 8):
    domain = list(range(1, n + 1))
    variables = list(domain)

    csp = CSP()
    csp.add_variables(domain, *variables)
    csp.add_constraint(n_queens_constraint(variables))

    return csp


def map_coloring():
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

    csp = CSP()

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
    csp.add_constraint(map_coloring_constraint("Tasmania", "Victoria"))

    return csp


def test_solutions(csp: CSP):
    solutions = list(map(str, csp.solutions))
    unique_solutions = set(solutions)

    pprint.pprint(csp.solutions)

    print(len(solutions), len(unique_solutions))


if __name__ == "__main__":
    csps = [map_coloring(), n_queens()]

    for csp in csps:
        csp.solve()
        test_solutions(csp)
