"""GAC All-Different propagator (Régin 1994).

Achieves generalized arc consistency on all-different constraints by:
1. Building a bipartite value graph (variables → domain values)
2. Finding a maximum matching via Hopcroft-Karp
3. Building a directed residual graph
4. Finding SCCs via Tarjan's algorithm
5. Pruning values not in any maximum matching and not in the same SCC

Optimized: integer-indexed nodes, list-based adjacency, iterative Tarjan.
"""

from __future__ import annotations

from typing import Any

_NONE = -1


def _hopcroft_karp(
    n_u: int,
    n_v: int,
    adj: list[list[int]],
) -> tuple[list[int], list[int]]:
    """Hopcroft-Karp maximum bipartite matching with integer nodes.

    u-nodes: 0..n_u-1, v-nodes: 0..n_v-1.
    Returns (match_u, match_v) where match_u[u] = v and match_v[v] = u.
    Unmatched nodes have value _NONE (-1).
    """
    match_u = [_NONE] * n_u
    match_v = [_NONE] * n_v
    dist = [0] * n_u

    INF = n_u + n_v + 1

    def bfs() -> bool:
        queue_buf: list[int] = []
        for u in range(n_u):
            if match_u[u] == _NONE:
                dist[u] = 0
                queue_buf.append(u)
            else:
                dist[u] = INF
        found = False
        head = 0
        while head < len(queue_buf):
            u = queue_buf[head]
            head += 1
            for v in adj[u]:
                mu = match_v[v]
                if mu == _NONE:
                    found = True
                elif dist[mu] == INF:
                    dist[mu] = dist[u] + 1
                    queue_buf.append(mu)
        return found

    def dfs(u: int) -> bool:
        for v in adj[u]:
            mu = match_v[v]
            if mu == _NONE or (dist[mu] == dist[u] + 1 and dfs(mu)):
                match_u[u] = v
                match_v[v] = u
                return True
        dist[u] = INF
        return False

    while bfs():
        for u in range(n_u):
            if match_u[u] == _NONE:
                dfs(u)

    return match_u, match_v


def _tarjan_scc_iterative(
    n_nodes: int,
    adj: list[list[int]],
) -> list[int]:
    """Iterative Tarjan's SCC. Returns scc_id for each node (0-indexed)."""
    index = [_NONE] * n_nodes
    lowlink = [0] * n_nodes
    on_stack = bytearray(n_nodes)
    scc_id = [_NONE] * n_nodes

    stack: list[int] = []
    call_stack: list[tuple[int, int]] = []  # (node, neighbor_index)
    counter = 0
    scc_counter = 0

    for start in range(n_nodes):
        if index[start] != _NONE:
            continue

        call_stack.append((start, 0))
        index[start] = lowlink[start] = counter
        counter += 1
        stack.append(start)
        on_stack[start] = 1

        while call_stack:
            v, ni = call_stack[-1]
            neighbors = adj[v]

            if ni < len(neighbors):
                call_stack[-1] = (v, ni + 1)
                w = neighbors[ni]
                if index[w] == _NONE:
                    index[w] = lowlink[w] = counter
                    counter += 1
                    stack.append(w)
                    on_stack[w] = 1
                    call_stack.append((w, 0))
                elif on_stack[w]:
                    if index[w] < lowlink[v]:
                        lowlink[v] = index[w]
            else:
                # Done with v's neighbors
                if lowlink[v] == index[v]:
                    # v is root of an SCC
                    while True:
                        w = stack.pop()
                        on_stack[w] = 0
                        scc_id[w] = scc_counter
                        if w == v:
                            break
                    scc_counter += 1

                call_stack.pop()
                if call_stack:
                    parent = call_stack[-1][0]
                    if lowlink[v] < lowlink[parent]:
                        lowlink[parent] = lowlink[v]

    return scc_id


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
    n_vars = len(unassigned)
    if n_vars <= 1:
        return []

    # Skip GAC for binary case — forward checking handles it
    if n_vars <= 2:
        return []

    # Collect assigned values to exclude
    assigned_vals = {solution[v] for v in group if v in solution}

    # Map variables to indices 0..n_vars-1
    # Map values to indices 0..n_vals-1
    all_values_set: set = set()

    # First pass: collect all available values
    var_avail_raw: list[list] = []
    for var in unassigned:
        available = [v for v in current_domains[var] if v not in assigned_vals]
        var_avail_raw.append(available)
        all_values_set.update(available)

    if not all_values_set:
        return []

    # Build value index mapping
    val_list = sorted(all_values_set)  # deterministic ordering
    val_to_idx: dict = {v: i for i, v in enumerate(val_list)}
    n_vals = len(val_list)

    # Build adjacency: u-node (var idx) → list of v-node (val idx)
    adj: list[list[int]] = []
    for avail in var_avail_raw:
        adj.append([val_to_idx[v] for v in avail])

    # Maximum matching
    match_u, match_v = _hopcroft_karp(n_vars, n_vals, adj)

    # Check completeness
    for u in range(n_vars):
        if match_u[u] == _NONE:
            return []

    # Build directed residual graph for SCC
    # Nodes: 0..n_vars-1 are var-nodes, n_vars..n_vars+n_vals-1 are val-nodes
    total_nodes = n_vars + n_vals
    res_adj: list[list[int]] = [[] for _ in range(total_nodes)]

    for u in range(n_vars):
        for vi in adj[u]:
            val_node = n_vars + vi
            if match_u[u] == vi:
                # Matched edge: val → var
                res_adj[val_node].append(u)
            else:
                # Unmatched edge: var → val
                res_adj[u].append(val_node)

    # SCC
    scc_id = _tarjan_scc_iterative(total_nodes, res_adj)

    # Pruning
    removals: list[tuple[Any, Any]] = []
    for u in range(n_vars):
        var = unassigned[u]
        matched_vi = match_u[u]
        for vi in adj[u]:
            if vi == matched_vi:
                continue  # Keep matched edges
            if scc_id[u] != scc_id[n_vars + vi]:
                removals.append((var, val_list[vi]))

    return removals
