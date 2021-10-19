import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collectors;

public class CSPSolver<V, D> {
    public Map<V, Variable> variables;
    public List<Map<V, D>> assignments;
    public Stack<V> currentVariables;
    public Map<V, Map<V, Set<D>>> domainSet;
    public String algorithm;

    public CSPSolver() {
        this.variables = new HashMap<V, Variable>();
        this.assignments = new ArrayList<Map<V, D>>();
        this.currentVariables = new Stack<V>();
        this.domainSet = new HashMap<V, Map<V, Set<D>>>();
    }

    public class Variable {
        public V value;
        public List<Constraint<V, D>> constraints;
        public List<D> domain;

        public Set<V> neighbors;

        public Map<V, Set<D>> domainSet;

        public Variable(V value, List<D> domain) {
            this.value = value;
            this.domain = new ArrayList<D>();
            this.domain.addAll(domain);

            this.constraints = new ArrayList<Constraint<V, D>>();
            this.neighbors = new HashSet<V>();
        }

        @Override
        public String toString() {
            return this.value.toString();
        }

        public boolean isValid(Map<V, D> assignment) {
            return constraints.stream().allMatch((c) -> c.isValid(assignment));
        }
    }

    public void restorePrunedDomain(V variableValue) {
        this.domainSet.get(variableValue).forEach((Xi, S) -> {
            this.variables.get(Xi).domain.addAll(S);
            S.clear();
        });
    }

    public void addVariable(V variableValue, List<D> domain) {
        final var variable = new Variable(variableValue, domain);
        this.variables.put(variableValue, variable);
        this.currentVariables.push(variableValue);
    }

    public void addConstraint(Constraint<V, D> constraint) {
        final var variables =
            constraint.variableValues.stream().map(this.variables::get).collect(Collectors.toList());

        for (final var v : variables) {
            v.constraints.add(constraint);
            v.neighbors.addAll(constraint.variableValues);
            v.neighbors.remove(v.value);
        }
    }

    public Set<V> getNeighbors(V variableValue) {
        final var variable = this.variables.get(variableValue);
        return variable.neighbors;
    }

    public Variable getNextVariable() {
        return this.variables.get(this.currentVariables.pop());
    }

    public void forwardCheck(V variableValue, Map<V, D> assignment) {
        this.getNeighbors(variableValue).stream().filter(x -> !assignment.containsKey(x)).forEach((Xi) -> {
            final var variableXi = this.variables.get(Xi);
            final var domain = new ArrayList<D>(variableXi.domain);

            for (final var x : domain) {
                assignment.put(Xi, x);

                if (!variableXi.isValid(assignment)) {
                    variableXi.domain.remove(x);
                    this.domainSet.get(variableValue).get(Xi).add(x);
                }

                assignment.remove(Xi);
            }
        });
    }

    public boolean removeInconsistentVariables(V Xi, V Xj, Map<V, D> assignment) {
        var removed = false;
        final var tx = assignment.get(Xi);

        final var variableXi = this.variables.get(Xi);
        final var variableXj = this.variables.get(Xj);

        final var domain = new ArrayList<D>(variableXi.domain);

        for (final var x : domain) {
            var allInconsistent = true;
            for (final var y : variableXj.domain) {
                assignment.put(Xi, x);
                assignment.put(Xj, y);
                if (variableXj.isValid(assignment)) {
                    allInconsistent = false;
                    break;
                }
                assignment.remove(Xj);
            }

            if (allInconsistent) {
                variableXi.domain.remove(x);
                this.domainSet.get(Xi).get(Xi).add(x);
                removed = true;
            }
        }

        if (tx != null) {
            assignment.put(Xi, tx);
        }

        return removed;
    }

    public void AC3(V variableValue, Map<V, D> assignment) {
        final var agenda = new Stack<Pair<V, V>>();
        this.getNeighbors(variableValue)
            .stream()
            .filter(x -> !assignment.containsKey(x))
            .forEach(x -> new Pair<V, V>(x, variableValue));

        while (agenda.size() > 0) {
            final var p = agenda.pop();

            final var Xi = p.x;
            final var Xj = p.y;

            if (this.removeInconsistentVariables(Xi, Xj, assignment)) {
                for (final var Xk : this.getNeighbors(Xi)) {
                    final var tp = new Pair<V, V>(Xk, Xi);
                    if (!Xk.equals(Xi) && !agenda.contains(tp) && !assignment.containsKey(Xk)) {
                        agenda.push(tp);
                    }
                }
            }
        }
    }

    public boolean backtrack(Map<V, D> assignment) {
        if (assignment.size() == this.variables.size()) {
            this.assignments.add(new HashMap<>(assignment));
            return true;
        }

        final var variableValue = this.currentVariables.pop();
        final var variable = this.variables.get(variableValue);
        final var domain = new ArrayList<D>(variable.domain);

        for (final var x : domain) {
            assignment.put(variableValue, x);

            if (variable.isValid(assignment)) {
                if (this.algorithm.equals("FC")) {
                    this.forwardCheck(variableValue, assignment);
                } else if (this.algorithm.equals("MAC")) {
                    this.AC3(variableValue, assignment);
                }
                this.backtrack(assignment);
            }

            this.restorePrunedDomain(variableValue);
            assignment.remove(variableValue);
        }

        this.currentVariables.push(variableValue);

        return false;
    }

    public void solve(String algorithm) {
        this.algorithm = algorithm;
        final var assignment = new HashMap<V, D>();
        final var variableValues = this.variables.keySet();

        for (final var variableValue : variableValues) {
            final var m = new HashMap<V, Set<D>>();
            for (final var v : variableValues) {
                m.put(v, new HashSet<D>());
            }
            this.domainSet.put(variableValue, m);
        }

        this.backtrack(assignment);
    }
}
