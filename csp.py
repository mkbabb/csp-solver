from collections import defaultdict, deque
from typing import *
import pprint
import json

V = TypeVar("V")
D = TypeVar("D")


Solution = Dict[V, D]

DomainMap = Dict[V, List[D]]

Constraint = Callable[[Solution], bool]
ConstraintPair = Tuple[Constraint, List[V]]


class CSP:
    def __init__(self):
        self.variables: List[V] = []
        self.constraints: Dict[V, List[Constraint]] = defaultdict(list)
        self.domain_map: DomainMap = {}

        self.solutions: List[Solution] = []
        self.variable_stack: Deque[V] = deque()
        self.neighbors: Dict[V, Set[V]] = defaultdict(set)
        self.pruned: Dict[V, List[Tuple[V, D]]] = defaultdict(list)

    def add_variables(self, domain: List[D], *variables: V):
        for v in variables:
            self.variables.append(v)
            self.variable_stack.append(v)
            self.domain_map[v] = list(domain)

    def add_constraint(self, constraint_pair: ConstraintPair):
        constraint, variables = constraint_pair
        for v in variables:
            self.constraints[v].append(constraint)
            self.neighbors[v].update(variables)


    def is_valid(self, variable: V, solution: Solution):
        constraint_list = self.constraints[variable]
        return all((constraint(solution) for constraint in constraint_list))


    def forward_check(self, variable: V, solution: Solution):
        neighbors = self.neighbors[variable]
        pruned_list = self.pruned[variable]

        for v, d in pruned_list:
            self.domain_map[v].append(d)

        pruned_list.clear()

        for n in filter(lambda x: x not in solution, neighbors):
            domain = self.domain_map[n]
            
            for d in domain:
                tmp = solution[n]
                solution[n] = d

                if not self.is_valid(n, solution):
                    domain.remove(d)
                    pruned_list.append((n, d))

                solution[n] = tmp


    def backtrack(self, solution: Solution, forward_check: bool = False):
        if len(solution) == len(self.variables):
            self.solutions.append(solution.copy())
            return True

        v = self.variable_stack.pop()

        for d in self.domain_map[v]:
            t_solution = solution.copy()
            t_solution[v] = d

            if self.is_valid(v, t_solution):
                if forward_check:
                    self.forward_check(v, t_solution)
                self.backtrack(t_solution, forward_check)

        self.variable_stack.append(v)
        return False

    def solve(self, forward_check: bool = False):
        self.solutions = []

        return self.backtrack({}, forward_check)


def map_coloring_constraint(p1: str, p2: str):
    def check(current_solution: Solution):
        if p1 not in current_solution or p2 not in current_solution:
            return True
        else:
            return current_solution[p1] != current_solution[p2]

    return check, [p1, p2]


def lambda_constraint(func: Callable[[Any], bool], *variables):
    def check(current_solution: Solution):
        current_values = [current_solution[v] for v in variables]
        return func(*current_values)

    return check, list(variables)


def all_different_constraint(*variables):
    def check(current_solution: Solution):
        current_values = [current_solution[v] for v in variables]
        return len(current_values) == len(set(current_values))

    return check, list(variables)


if __name__ == "__main__":
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

    csp.solve()
    solutions1 = list(map(json.dumps, csp.solutions))
    print(len(csp.solutions))
    csp.solve(True)
    solutions2 = list(map(json.dumps, csp.solutions))
    print(len(csp.solutions))

    tmp = set(solutions1).difference(set(solutions2))
    tmp = list(map(json.loads, tmp))
    # pprint.pprint(tmp)
    # pprint.pprint(csp.solutions)
