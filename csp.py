from collections import defaultdict
from typing import *

V = TypeVar("V")
D = TypeVar("D")


Solution = Dict[V, D]

Constraint = Callable[[Solution], bool]
ConstraintPair = Tuple[Constraint, List[V]]


class CSP:
    def __init__(self):
        self.variables: List[V] = []
        self.constraints: Dict[V, List[Constraint]] = defaultdict(list)
        self.variable_map: Dict[V, List[D]] = {}

        self.current_solution: Solution = {}
        self.solutions: List[Solution] = []

        pass

    def add_variable(self, domain: List[D], *variables: V):
        for v in variables:
            self.variables.append(v)
            self.variable_map[v] = domain

    def add_constraint(self, constraint_pair: ConstraintPair):
        constraint, variables = constraint_pair
        for v in variables:
            self.constraints[v].append(constraint)

    def is_valid(self, variable: V):
        constraint_list = self.constraints[variable]
        return all(
            (constraint(self.current_solution) for constraint in constraint_list)
        )

    def backtrack(self, pos=0):
        if pos == len(self.variables) - 1:
            self.solutions.append(self.current_solution.copy())
            return True

        while pos < len(self.variables):
            v = self.variables[pos]

            if self.current_solution.get(v) is not None:
                continue

            for d in self.variable_map[v]:
                prev_d = self.current_solution.get(v)
                self.current_solution[v] = d

                if self.is_valid(v):
                    valid = self.backtrack(pos + 1)
                    
                    # if (valid):
                    #     return True
                
                self.current_solution[v] = prev_d

        return False


def map_coloring_constraint(p1: str, p2: str):
    def check(current_solution: Solution):
        if p1 not in current_solution or p2 not in current_solution:
            return True
        else:
            return current_solution[p1] != current_solution[p2]

    return check, [p1, p2]


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

    csp.add_variable(domain, *variables)

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
    csp.add_constraint(map_coloring_constraint("Victoria", "Tasmania"))

    csp.backtrack()

    for i in csp.solutions:
        print(i)
