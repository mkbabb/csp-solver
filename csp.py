from collections import defaultdict, deque
from typing import *
import copy

V = TypeVar("V")
D = TypeVar("D")


Solution = Dict[V, D]


Constraint = Callable[[Solution], bool]


class CSP:
    def __init__(self):
        self.variables: List[V] = []
        self.constraints: Dict[V, List[Constraint]] = defaultdict(list)
        self.domain_map: Dict[V, List[D]] = {}
        self.domain_map2: Dict[V, List[D]] = {}

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
            self.domain_map2[v] = list(domain)

    def add_constraint(self, constraint_pair: Tuple[Constraint, List[V]]):
        constraint, variables = constraint_pair
        for v in variables:
            self.constraints[v].append(constraint)
            self.neighbors[v].update(variables)
            self.neighbors[v].remove(v)

    def is_valid(self, variable: V, solution: Solution):
        constraint_list = self.constraints[variable]
        return all((constraint(solution) for constraint in constraint_list))

    def test_solution(self, solution: Solution, test_vals: Solution):
        solution = copy.deepcopy(solution)
        solution.update(test_vals)
        return solution

    def restore_pruned_variables(self, variable: V):
        for v, d_list in self.pruned_map[variable].items():
            self.domain_map[v].extend(d_list)
            d_list.clear()

    def forward_check(self, variable: V, solution: Solution):
        neighbors = self.neighbors[variable]
        self.restore_pruned_variables(variable)

        # TODO: optimize
        for neighbor in filter(lambda x: x not in solution, neighbors):
            domain = self.domain_map[neighbor]

            for d in domain:
                if not self.is_valid(
                    neighbor, self.test_solution(solution, {neighbor: d})
                ):
                    domain.remove(d)
                    self.pruned_map[variable][neighbor].append(d)

    def AC3(self, variable: V, solution: Solution):
        def remove_inconsistent_values(Xi: V, Xj: V):
            removed = False

            for x in self.domain_map[Xi][:]:
                all_inconsistent = True

                for y in self.domain_map[Xj]:
                    if self.is_valid(Xj, self.test_solution(solution, {Xi: x, Xj: y})):
                        all_inconsistent = False
                        
                if all_inconsistent:
                    self.domain_map[Xi].remove(x)
                    removed = True
            return removed

        agenda = deque(((variable, n) for n in self.neighbors[variable]))

        while len(agenda) > 0:
            Xi, Xj = agenda.pop()
            if remove_inconsistent_values(Xi, Xj):
                for Xk in self.neighbors[Xi]:
                    agenda.append((Xk, Xi))

    def backtrack(self, solution: Solution):
        if len(solution) == len(self.variables):
            self.solutions.append(solution.copy())
            return True

        v = self.variable_stack.pop()

        for d in self.domain_map[v]:
            t_solution = self.test_solution(solution, {v: d})

            if self.is_valid(v, t_solution):
                self.pruning_function(v, t_solution)
                valid = self.backtrack(t_solution)
            
            self.domain_map[v] = self.domain_map2[v][:]

        self.variable_stack.append(v)
        return False

    def solve(self):
        self.solutions = []
        self.pruning_function = self.AC3
        return self.backtrack({})


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


def lambda_constraint(func: Callable[[Any], bool], *variables):
    def check(current_solution: Solution):
        current_values = get_current_solution_values(variables, current_solution)
        if len(variables) == len(current_values):
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

    csp.solve()
    # solutions1 = list(map(json.dumps, csp.solutions))
    # print(len(csp.solutions))
    # csp.solve(True)
    # solutions2 = list(map(json.dumps, csp.solutions))
    # print(len(csp.solutions))

    # tmp = set(solutions1).difference(set(solutions2))
    # tmp = list(map(json.loads, tmp))
    # pprint.pprint(tmp)

    solutions = list(map(str, csp.solutions))

    print(len(solutions), len(set(solutions)))


    # pprint.pprint(csp.solutions)
    # print(len(csp.solutions))
