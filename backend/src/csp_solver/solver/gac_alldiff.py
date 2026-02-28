"""GAC All-Different propagator (Régin 1994).

Achieves generalized arc consistency on all-different constraints by:
1. Building a bipartite value graph (variables → domain values)
2. Finding a maximum matching via Hopcroft-Karp
3. Building a directed residual graph
4. Finding SCCs via Tarjan's algorithm
5. Pruning values not in any maximum matching and not in the same SCC

Values that cannot participate in any maximum matching are inconsistent
and can be safely removed from domains.
"""

from __future__ import annotations

from collections import deque
from typing import Any

INF = float("inf")


def _hopcroft_karp(
    u_nodes: list[Any],
    v_nodes: set[Any],
    adj: dict[Any, list[Any]],
) -> tuple[dict[Any, Any], dict[Any, Any]]:
    """Hopcroft-Karp maximum bipartite matching.

    Returns (match_u, match_v) where match_u[u] = v and match_v[v] = u
    for matched pairs. Unmatched nodes map to None.
    """
    match_u: dict[Any, Any] = {u: None for u in u_nodes}
    match_v: dict[Any, Any] = {v: None for v in v_nodes}
    dist: dict[Any, float] = {}

    def bfs() -> bool:
        queue: deque[Any] = deque()
        for u in u_nodes:
            if match_u[u] is None:
                dist[u] = 0
                queue.append(u)
            else:
                dist[u] = INF
        found = False
        while queue:
            u = queue.popleft()
            for v in adj.get(u, []):
                mu = match_v[v]
                if mu is None:
                    found = True
                elif dist.get(mu, INF) == INF:
                    dist[mu] = dist[u] + 1
                    queue.append(mu)
        return found

    def dfs(u: Any) -> bool:
        for v in adj.get(u, []):
            mu = match_v[v]
            if mu is None or (dist.get(mu, INF) == dist[u] + 1 and dfs(mu)):
                match_u[u] = v
                match_v[v] = u
                return True
        dist[u] = INF
        return False

    while bfs():
        for u in u_nodes:
            if match_u[u] is None:
                dfs(u)

    return match_u, match_v


def _tarjan_scc(
    nodes: set[Any],
    adj: dict[Any, list[Any]],
) -> list[set[Any]]:
    """Tarjan's algorithm for strongly connected components."""
    index_counter = [0]
    stack: list[Any] = []
    on_stack: set[Any] = set()
    index: dict[Any, int] = {}
    lowlink: dict[Any, int] = {}
    sccs: list[set[Any]] = []

    def strongconnect(v: Any) -> None:
        index[v] = lowlink[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack.add(v)

        for w in adj.get(v, []):
            if w not in index:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif w in on_stack:
                lowlink[v] = min(lowlink[v], index[w])

        if lowlink[v] == index[v]:
            scc: set[Any] = set()
            while True:
                w = stack.pop()
                on_stack.discard(w)
                scc.add(w)
                if w == v:
                    break
            sccs.append(scc)

    for v in nodes:
        if v not in index:
            strongconnect(v)

    return sccs


def gac_alldiff_propagate(
    unassigned: list[Any],
    current_domains: dict[Any, Any],
    solution: dict[Any, Any],
    group: list[Any],
) -> list[tuple[Any, Any]]:
    """Run GAC All-Different on a group of variables.

    Args:
        unassigned: Unassigned variables in this all-different group.
        current_domains: Current domain mapping (var → set-like).
        solution: Current partial assignment.
        group: All variables in the all-different constraint.

    Returns:
        List of (variable, value) pairs to remove from domains.
    """
    if len(unassigned) <= 1:
        return []

    # Collect assigned values to exclude from consideration
    assigned_vals = {solution[v] for v in group if v in solution}

    # Build bipartite graph: variables → available values
    adj: dict[Any, list[Any]] = {}
    all_values: set[Any] = set()
    for var in unassigned:
        available = [v for v in current_domains[var] if v not in assigned_vals]
        adj[var] = available
        all_values.update(available)

    if not all_values:
        return []

    # Find maximum matching
    match_u, match_v = _hopcroft_karp(unassigned, all_values, adj)

    # Check if matching is complete (covers all unassigned vars)
    if any(match_u[u] is None for u in unassigned):
        # No complete matching exists — problem is infeasible,
        # but let the constraint checker handle it
        return []

    # Build directed residual graph for SCC computation
    # Edge directions: matched edge val→var, unmatched edge var→val
    # Use tagged nodes to distinguish var-nodes from val-nodes
    var_tag = ("var",)
    val_tag = ("val",)
    tagged_var = {v: (var_tag, v) for v in unassigned}
    tagged_val = {v: (val_tag, v) for v in all_values}

    res_adj: dict[Any, list[Any]] = {}
    all_tagged: set[Any] = set()

    for var in unassigned:
        tv = tagged_var[var]
        all_tagged.add(tv)
        for val in adj[var]:
            tval = tagged_val[val]
            all_tagged.add(tval)
            if match_u[var] == val:
                # Matched edge: val → var
                res_adj.setdefault(tval, []).append(tv)
            else:
                # Unmatched edge: var → val
                res_adj.setdefault(tv, []).append(tval)

    # Find SCCs in residual graph
    sccs = _tarjan_scc(all_tagged, res_adj)
    node_to_scc: dict[Any, int] = {}
    for i, scc in enumerate(sccs):
        for node in scc:
            node_to_scc[node] = i

    # Pruning: remove (var, val) where val is NOT matched to var
    # AND var and val are NOT in the same SCC
    removals: list[tuple[Any, Any]] = []
    for var in unassigned:
        tv = tagged_var[var]
        for val in adj[var]:
            if match_u[var] == val:
                continue  # Keep matched edges
            tval = tagged_val[val]
            if node_to_scc.get(tv) != node_to_scc.get(tval):
                removals.append((var, val))

    return removals
