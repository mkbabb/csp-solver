from collections import defaultdict, deque
from typing import *

import pprint

V = TypeVar("V")
D = TypeVar("D")


Solution = Dict[V, D]


Constraint = Callable[[Solution], bool]


class CSP:
    def __init__(self):
        self.variables: List[V] = []
        self.constraints: Dict[V, List[Constraint]] = defaultdict(list)
        self.domain_map: Dict[V, List[D]] = {}

        self.variable_stack: Deque[V] = deque()
        self.neighbors: Dict[V, Set[V]] = defaultdict(set)
        self.pruned_map: Dict[V, Dict[V, List[D]]] = defaultdict(
            lambda: defaultdict(list)
        )

        self.solutions: List[Solution] = []

    def add_variables(self, domain: List[D], *variables: V):
        for v in variables:
            self.variables.append(v)
            self.variable_stack.append(v)
            self.domain_map[v] = list(domain)

    def add_constraint(self, constraint_pair: Tuple[Constraint, List[V]]):
        constraint, variables = constraint_pair
        for v in variables:
            self.constraints[v].append(constraint)
            self.neighbors[v].update(variables)

    def is_valid(self, variable: V, solution: Solution):
        constraint_list = self.constraints[variable]
        return all((constraint(solution) for constraint in constraint_list))

    def forward_check(self, variable: V, solution: Solution):
        neighbors = self.neighbors[variable]
        pruned_variable = self.pruned_map[variable]

        for v, d_list in pruned_variable.items():
            self.domain_map[v].extend(d_list)
            d_list.clear()

        #TODO: optimize
        for neighbor in filter(lambda x: x not in solution, neighbors):
            domain = self.domain_map[neighbor]

            for d in domain:
                t_solution = solution.copy()
                t_solution[neighbor] = d

                if not self.is_valid(neighbor, t_solution):
                    domain.remove(d)
                    pruned_variable[neighbor].append(d)
            
    def AC3(self, variable: V, solution: Solution):
        def remove_inconsistent(variable: V, neighbor: V):
            removed = False
           
            for x in self.domain_map[variable]:
                t_solution = solution.copy()
                t_solution[variable] = x

                all_conflicts = True
                domain = self.domain_map[neighbor]

                for y in self.domain_map[neighbor]:
                    tt_solution = t_solution.copy()
                    tt_solution[neighbor] = y

                    if self.is_valid(n, tt_solution):
                        break
                
                if all_conflicts:
                    domain.remove(x)
                    removed = True
            
            return removed

        agenda = deque(((v, n) for v in self.variables for n in self.neighbors[v]))
        
        while len(agenda) > 0:
            variable, neighbor = agenda.pop()
            if remove_inconsistent(variable, neighbor):
                for n in self.neighbors[variable]:
                    agenda.append((n, variable))

    def backtrack(self, solution: Solution):
        if len(solution) == len(self.variables):
            self.solutions.append(solution.copy())
            return True

        v = self.variable_stack.pop()

        for d in self.domain_map[v]:
            t_solution = solution.copy()
            t_solution[v] = d

            if self.is_valid(v, t_solution):
                self.pruning_function(v, t_solution)
                self.backtrack(t_solution)

        self.variable_stack.append(v)
        return False

    def solve(self, forward_check: bool = False):
        self.solutions = []
        self.pruning_function = self.AC3
        return self.backtrack({}, forward_check)


def get_current_solution_values(variables: List[V], current_solution: Solution) -> Optional[List[D]]:
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


def lambda_constraint(func: Callable[[Any], bool], *variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)
        if (len(variables) == len(current_values)):
            return func(*current_values)
        else:
            return True

    return check, list(variables)


def all_different_constraint(*variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)
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

    csp.solve(True)
    # solutions1 = list(map(json.dumps, csp.solutions))
    # print(len(csp.solutions))
    # csp.solve(True)
    # solutions2 = list(map(json.dumps, csp.solutions))
    # print(len(csp.solutions))

    # tmp = set(solutions1).difference(set(solutions2))
    # tmp = list(map(json.loads, tmp))
    # pprint.pprint(tmp)
    pprint.pprint(csp.solutions)
    print(len(csp.solutions))

