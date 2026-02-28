"""Core CSP (Constraint Satisfaction Problem) solver engine.

Optimizations applied vs original:
- revise() iterates over a copy to avoid mutation-during-iteration bug
- AC3 detects domain wipe-out (DWO) and returns early
- AC3 uses a companion set for O(1) agenda membership checks
- test_solution uses temporary assign/restore instead of dict.copy()
- current_domains uses sets/BitsetDomain for O(1) removal and copy
- get_next_variable improved with direct min() over stack
- Backtrack counter for difficulty measurement
- AC-2001 residual supports (O(ed²) optimal arc consistency)
- DWO early termination in forward_check/AC3/AC_FC
- Initial AC3 propagation for given cells
- Conflict-directed backjumping (CBJ)
- dom/wdeg variable ordering
- GAC all-different (Régin 1994) propagation
- Nogood recording with LRU eviction
"""

import random
from collections import defaultdict, deque
from collections.abc import Callable
from enum import Enum, auto
from typing import Any

from csp_solver.solver.bitset_domain import BitsetDomain

type Solution = dict[Any, Any]
type Constraint = Callable[[Solution], bool]


class PruningType(Enum):
    FORWARD_CHECKING = auto()
    AC3 = auto()
    AC_FC = auto()
    NO_PRUNING = auto()


class VariableOrdering(Enum):
    FAIL_FIRST = auto()
    NO_ORDERING = auto()
    DOM_WDEG = auto()


def _make_domain(values: Any) -> BitsetDomain | set:
    """Create a domain container: BitsetDomain for non-negative int domains, else set."""
    vals = list(values)
    if vals and all(isinstance(v, int) and v >= 0 for v in vals):
        return BitsetDomain(vals)
    return set(vals)


class CSP:
    def __init__(
        self,
        pruning_type: PruningType = PruningType.FORWARD_CHECKING,
        variable_ordering: VariableOrdering = VariableOrdering.NO_ORDERING,
        max_solutions: int = 1,
        use_gac_alldiff: bool = False,
        use_nogoods: bool = False,
    ):
        self.pruning_type = pruning_type
        self.max_solutions = max_solutions

        if pruning_type == PruningType.FORWARD_CHECKING:
            self.pruning_function = self.forward_check
        elif pruning_type == PruningType.AC3:
            self.pruning_function = self.AC3
        elif pruning_type == PruningType.AC_FC:
            self.pruning_function = self.AC_FC
        elif pruning_type == PruningType.NO_PRUNING:
            self.pruning_function = lambda x, y: False

        self.variable_ordering = variable_ordering

        self.variables: list[Any] = []
        self.constraints: dict[Any, list[Constraint]] = defaultdict(list)
        self.current_domains: dict[Any, Any] = {}
        self.domains: dict[Any, list[Any]] = {}

        self.variable_stack: deque[Any] = deque()

        self.neighbors: dict[Any, set[Any]] = defaultdict(set)
        self.pruned_map: dict[Any, dict[Any, set | BitsetDomain]] = defaultdict(
            lambda: defaultdict(set)
        )

        self.solutions: list[Solution] = []
        self.backtrack_count: int = 0

        # AC-2001 residual supports: (Xi, x, Xj) → last known support y
        self.last_support: dict[tuple, Any] = {}

        # Conflict-directed backjumping
        self.conflict_set: dict[Any, set[Any]] = defaultdict(set)
        self._child_conflicts: set[Any] = set()

        # dom/wdeg: constraint weights for failure counting
        self._constraint_id: int = 0
        self._constraint_weights: dict[int, float] = {}
        self._var_constraint_ids: dict[Any, list[int]] = defaultdict(list)

        # GAC all-different (Régin 1994)
        self.use_gac_alldiff = use_gac_alldiff
        self.alldiff_groups: list[list[Any]] = []

        # Nogood recording
        self.nogood_store: Any = None
        if use_nogoods:
            from csp_solver.solver.nogoods import NogoodStore

            self.nogood_store = NogoodStore()

    def add_variables(self, domain: list[Any], *variables: Any):
        domain_copy = list(domain)
        for v in variables:
            self.variables.append(v)
            self.domains[v] = domain_copy

    def add_constraint(self, constraint_pair: tuple[Constraint, list[Any]]):
        constraint, variables = constraint_pair

        # Assign a unique ID to this constraint for dom/wdeg tracking
        cid = self._constraint_id
        self._constraint_id += 1
        self._constraint_weights[cid] = 1.0

        for v in variables:
            self.constraints[v].append(constraint)
            self.neighbors[v].update(variables)
            self.neighbors[v].discard(v)
            self._var_constraint_ids[v].append(cid)

        # Detect all-different constraints for GAC
        if getattr(constraint, "_is_alldiff", False):
            self.alldiff_groups.append(list(variables))

    def get_neighbors(self, variable: Any) -> set[Any]:
        return self.neighbors.get(variable, set())

    def is_valid(self, variable: Any, solution: Solution) -> bool:
        return all(constraint(solution) for constraint in self.constraints[variable])

    def restore_pruned_domains(self, variable: Any):
        for neighbor, d_set in self.pruned_map.get(variable, {}).items():
            self.current_domains[neighbor].update(d_set)
            d_set.clear()

    def revise(self, variable: Any, Xi: Any, Xj: Any, solution: Solution) -> bool:
        """Arc revision with AC-2001 residual support caching."""
        removed = False

        for x in list(self.current_domains[Xi]):
            old_xi = solution.get(Xi)
            old_xj = solution.get(Xj)
            solution[Xi] = x

            found_support = False

            # AC-2001: check cached support first
            cache_key = (Xi, x, Xj)
            cached_y = self.last_support.get(cache_key)
            if cached_y is not None and cached_y in self.current_domains[Xj]:
                solution[Xj] = cached_y
                if self.is_valid(Xj, solution):
                    found_support = True

            # Full search if cache miss
            if not found_support:
                for y in self.current_domains[Xj]:
                    solution[Xj] = y
                    if self.is_valid(Xj, solution):
                        self.last_support[cache_key] = y
                        found_support = True
                        break

            # Restore
            if old_xj is not None:
                solution[Xj] = old_xj
            elif Xj in solution:
                del solution[Xj]
            if old_xi is not None:
                solution[Xi] = old_xi
            elif Xi in solution:
                del solution[Xi]

            if not found_support:
                self.current_domains[Xi].discard(x)
                self.pruned_map[variable][Xi].add(x)
                removed = True

        return removed

    def forward_check(self, variable: Any, solution: Solution) -> bool:
        """Returns True if a domain wipe-out (DWO) was detected."""
        agenda = [i for i in self.get_neighbors(variable) if i not in solution]

        for Xi in agenda:
            for x in list(self.current_domains[Xi]):
                old_val = solution.get(Xi)
                solution[Xi] = x
                valid = self.is_valid(Xi, solution)
                if old_val is not None:
                    solution[Xi] = old_val
                else:
                    del solution[Xi]

                if not valid:
                    self.current_domains[Xi].discard(x)
                    self.pruned_map[variable][Xi].add(x)

            if not self.current_domains[Xi]:
                # DWO: record conflict for CBJ
                self.conflict_set[Xi].add(variable)
                return True
        return False

    def AC_FC(self, variable: Any, solution: Solution) -> bool:
        """Returns True if a domain wipe-out (DWO) was detected."""
        agenda = deque(
            (Xj, variable)
            for Xj in self.get_neighbors(variable)
            if Xj not in solution
        )
        while len(agenda) > 0 and self.is_valid(variable, solution):
            Xi, Xj = agenda.pop()
            if self.revise(variable, Xi, Xj, solution):
                if not self.current_domains[Xi]:
                    self.conflict_set[Xi].add(variable)
                    return True
        return False

    def AC3(self, variable: Any, solution: Solution) -> bool:
        """AC3 with DWO detection. Returns True if DWO detected."""
        agenda = deque(
            (Xj, variable)
            for Xj in self.get_neighbors(variable)
            if Xj not in solution
        )
        agenda_set = set(agenda)

        while len(agenda) > 0:
            arc = agenda.pop()
            agenda_set.discard(arc)
            Xi, Xj = arc

            if self.revise(variable, Xi, Xj, solution):
                if not self.current_domains[Xi]:
                    self.conflict_set[Xi].add(variable)
                    return True

                for Xk in self.get_neighbors(Xi):
                    p = (Xk, Xi)
                    if Xk != Xj and p not in agenda_set and Xk not in solution:
                        agenda.append(p)
                        agenda_set.add(p)
        return False

    def _wdeg(self, v: Any) -> float:
        """Weighted degree: sum of weights of constraints involving v and unassigned peers."""
        w = 0.0
        for cid in self._var_constraint_ids[v]:
            w += self._constraint_weights[cid]
        return w

    def _increment_weights_on_dwo(self, variable: Any) -> None:
        """On DWO caused by `variable`, increment weights of its constraints."""
        for cid in self._var_constraint_ids[variable]:
            self._constraint_weights[cid] += 1.0

    def get_next_variable(self) -> Any:
        if self.variable_ordering == VariableOrdering.FAIL_FIRST:
            best = min(self.variable_stack, key=lambda v: len(self.current_domains[v]))
            self.variable_stack.remove(best)
            return best
        elif self.variable_ordering == VariableOrdering.DOM_WDEG:
            best = min(
                self.variable_stack,
                key=lambda v: len(self.current_domains[v]) / max(self._wdeg(v), 1e-9),
            )
            self.variable_stack.remove(best)
            return best
        elif self.variable_ordering == VariableOrdering.NO_ORDERING:
            return self.variable_stack.pop()

    def _propagate_gac_alldiff(self, variable: Any, solution: Solution) -> bool:
        """Run GAC all-different propagation. Returns True if DWO detected."""
        if not self.use_gac_alldiff or not self.alldiff_groups:
            return False
        from csp_solver.solver.gac_alldiff import gac_alldiff_propagate

        for group in self.alldiff_groups:
            # Only propagate groups containing the assigned variable
            if variable not in group:
                continue
            unassigned = [v for v in group if v not in solution]
            if not unassigned:
                continue
            removals = gac_alldiff_propagate(
                unassigned, self.current_domains, solution, group
            )
            for var, val in removals:
                self.current_domains[var].discard(val)
                self.pruned_map[variable][var].add(val)
                if not self.current_domains[var]:
                    return True
        return False

    def backtrack(self, solution: Solution) -> bool:
        if len(solution) == len(self.variables):
            self.solutions.append(solution.copy())
            return len(self.solutions) >= self.max_solutions

        v = self.get_next_variable()
        self.conflict_set[v] = set()
        use_cbj = self.max_solutions == 1

        for d in list(self.current_domains[v]):
            # Nogood check
            if self.nogood_store and self.nogood_store.is_nogood(v, d, solution):
                continue

            solution[v] = d

            if self.is_valid(v, solution):
                dwo = self.pruning_function(v, solution)

                # GAC all-different propagation
                if not dwo:
                    dwo = self._propagate_gac_alldiff(v, solution)

                if dwo:
                    # dom/wdeg: increment weights on DWO
                    if self.variable_ordering == VariableOrdering.DOM_WDEG:
                        self._increment_weights_on_dwo(v)
                else:
                    if self.backtrack(solution):
                        return True

                    # CBJ: backjump if child's conflict set is non-empty
                    # and doesn't contain v (meaning v is irrelevant to the failure)
                    if use_cbj and self._child_conflicts and v not in self._child_conflicts:
                        self.backtrack_count += 1
                        self.restore_pruned_domains(v)
                        del solution[v]
                        self.conflict_set[v].update(self._child_conflicts)
                        break

            # Record assigned neighbors in conflict set for CBJ
            for peer in self.get_neighbors(v):
                if peer in solution:
                    self.conflict_set[v].add(peer)

            self.backtrack_count += 1
            self.restore_pruned_domains(v)
            del solution[v]

        # Dead end: record nogood from conflict set
        if self.nogood_store and self.conflict_set[v]:
            conflict_assignments = {
                cv: solution[cv] for cv in self.conflict_set[v] if cv in solution
            }
            if conflict_assignments:
                self.nogood_store.record(conflict_assignments)

        self._child_conflicts = self.conflict_set[v]
        self.variable_stack.append(v)
        return False

    def num_conflicts(self, v: Any, d: Any, solution: Solution) -> int:
        count = 0
        old_val = solution.get(v)
        solution[v] = d
        for constraint in self.constraints[v]:
            if not constraint(solution):
                count += 1
        if old_val is not None:
            solution[v] = old_val
        elif v in solution:
            del solution[v]
        return count

    def conflicting_variables(self, solution: Solution) -> list[Any]:
        return [
            v
            for v in self.variables
            if v in solution and self.num_conflicts(v, solution[v], solution) > 0
        ]

    def min_conflicting_value(self, v: Any, solution: Solution) -> Any:
        """Find domain value with minimum conflicts using pure Python min()."""
        domains = self.domains[v]
        return min(domains, key=lambda d: self.num_conflicts(v, d, solution))

    def min_conflicts(self, iteration_count: int = 10000) -> bool:
        solution: Solution = {}
        random.shuffle(self.variables)

        for v in self.variables:
            solution[v] = self.min_conflicting_value(v, solution)

        for _ in range(iteration_count):
            conflicted = self.conflicting_variables(solution)

            if len(conflicted) == 0:
                self.solutions.append(solution.copy())
                return True

            v = random.choice(conflicted)
            d = self.min_conflicting_value(v, solution)
            solution[v] = d

        return False

    def _reset(self) -> None:
        """Reset solver state for a new solve."""
        self.variable_stack.clear()
        self.current_domains.clear()
        self.backtrack_count = 0
        self.last_support.clear()
        self.conflict_set.clear()
        self._child_conflicts = set()
        self.solutions = []
        if self.nogood_store:
            self.nogood_store.clear()

    def solve(self) -> bool:
        self._reset()

        for v in self.variables:
            self.variable_stack.append(v)
            self.current_domains[v] = _make_domain(self.domains[v])
            self.pruned_map[v].clear()

        solution: Solution = {}
        return self.backtrack(solution=solution)

    def solve_with_initial_propagation(self, given_values: dict[Any, Any]) -> bool:
        """Solve with initial constraint propagation for given clue cells.

        One-hop propagation removes given values from peer domains.
        Then runs a full AC3-style pass to catch cascading reductions
        (singleton propagation chains).
        """
        self._reset()

        for v in self.variables:
            self.current_domains[v] = _make_domain(self.domains[v])
            self.pruned_map[v].clear()

        # One-hop propagation: for each given value, restrict peer domains
        for var, val in given_values.items():
            self.current_domains[var] = _make_domain([val])
            for neighbor in self.get_neighbors(var):
                if neighbor not in given_values and val in self.current_domains[neighbor]:
                    self.current_domains[neighbor].discard(val)

        # Full AC3-style initial propagation for cascading reductions
        # Uses a worklist of arcs adjacent to singleton (given) cells
        agenda: deque[tuple] = deque()
        agenda_set: set[tuple] = set()
        for var in given_values:
            for neighbor in self.get_neighbors(var):
                if neighbor not in given_values:
                    arc = (neighbor, var)
                    if arc not in agenda_set:
                        agenda.append(arc)
                        agenda_set.add(arc)

        # Propagate without pruned_map (permanent reductions, no undo)
        dummy_solution: Solution = dict(given_values)
        while agenda:
            arc = agenda.pop()
            agenda_set.discard(arc)
            Xi, Xj = arc

            # Inline revise without pruned_map tracking
            removed = False
            for x in list(self.current_domains[Xi]):
                old_xi = dummy_solution.get(Xi)
                old_xj = dummy_solution.get(Xj)
                dummy_solution[Xi] = x
                found_support = False
                for y in self.current_domains[Xj]:
                    dummy_solution[Xj] = y
                    if self.is_valid(Xj, dummy_solution):
                        found_support = True
                        break
                if old_xj is not None:
                    dummy_solution[Xj] = old_xj
                elif Xj in dummy_solution:
                    del dummy_solution[Xj]
                if old_xi is not None:
                    dummy_solution[Xi] = old_xi
                elif Xi in dummy_solution:
                    del dummy_solution[Xi]

                if not found_support:
                    self.current_domains[Xi].discard(x)
                    removed = True

            if removed:
                if not self.current_domains[Xi]:
                    # Unsolvable after initial propagation
                    return False
                # If Xi became a singleton, propagate further
                for Xk in self.get_neighbors(Xi):
                    p = (Xk, Xi)
                    if Xk != Xj and p not in agenda_set and Xk not in given_values:
                        agenda.append(p)
                        agenda_set.add(p)

        # Only add unassigned variables to the stack
        for v in self.variables:
            if v not in given_values:
                self.variable_stack.append(v)

        solution = dict(given_values)
        return self.backtrack(solution=solution)
