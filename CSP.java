import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class CSP<V, D> {
    public Map<V, Variable> variables;
    public List<Map<V, D>> solutions;
    public Stack<V> variableStack;
    public Map<V, Map<V, Set<D>>> prunedDomain;

    public CSP() {
        this.variables = new HashMap<V, Variable>();
        this.solutions = new ArrayList<Map<V, D>>();
        this.variableStack = new Stack<V>();
        this.prunedDomain = new HashMap<V, Map<V, Set<D>>>();
    }

    public class Variable {
        public V value;
        public List<Constraint<V, D>> constraints;
        public List<D> domain;

        public Set<V> neighbors;

        public Map<V, Set<D>> prunedDomain;

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
        this.prunedDomain.get(variableValue).forEach((Xi, S) -> {
            this.variables.get(Xi).domain.addAll(S);
            S.clear();
        });
    }

    public void addVariable(V variableValue, List<D> domain) {
        final var variable = new Variable(variableValue, domain);
        this.variables.put(variableValue, variable);
        this.variableStack.push(variableValue);
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
        return this.variables.get(this.variableStack.pop());
    }

    public void forwardCheck(V variableValue, Map<V, D> assignment) {
        this.getNeighbors(variableValue).stream().filter(x -> !assignment.containsKey(x)).forEach((Xi) -> {
            final var variableXi = this.variables.get(Xi);
            final var domain = new ArrayList<D>(variableXi.domain);

            for (final var x : domain) {
                assignment.put(Xi, x);

                if (!variableXi.isValid(assignment)) {
                    variableXi.domain.remove(x);
                    this.prunedDomain.get(variableValue).get(Xi).add(x);
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
                this.prunedDomain.get(Xi).get(Xi).add(x);
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
            this.solutions.add(new HashMap<>(assignment));
            return true;
        }

        final var variableValue = this.variableStack.pop();
        final var variable = this.variables.get(variableValue);
        final var domain = new ArrayList<D>(variable.domain);

        for (final var x : domain) {
            assignment.put(variableValue, x);

            if (variable.isValid(assignment)) {
                this.AC3(variableValue, assignment);
                this.backtrack(assignment);
            }

            this.restorePrunedDomain(variableValue);
            assignment.remove(variableValue);
        }

        this.variableStack.push(variableValue);

        return false;
    }

    public void solve() {
        final var assignment = new HashMap<V, D>();
        final var variableValues = this.variables.keySet();

        for (final var variableValue : variableValues) {
            final var m = new HashMap<V, Set<D>>();
            for (final var v : variableValues) {
                m.put(v, new HashSet<D>());
            }
            this.prunedDomain.put(variableValue, m);
        }

        this.backtrack(assignment);
    }

    public static void main(String[] args) {
        final var csp = new CSP<String, String>();

        final var values = new ArrayList<String>() {
            {
                add("Western Australia");
                add("Northern Territory");
                add("South Australia");
                add("Queensland");
                add("New South Wales");
                add("Victoria");
                add("Tasmania");
            }
        };

        final var domain = new ArrayList<String>() {
            {
                add("red");
                add("green");
                add("blue");
            }
        };

        for (final var value : values) {
            csp.addVariable(value, domain);
        }

        csp.addConstraint(new Constraint.MapColoringConstraint("Western Australia", "Northern Territory"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Western Australia", "South Australia"));
        csp.addConstraint(new Constraint.MapColoringConstraint("South Australia", "Northern Territory"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Queensland", "Northern Territory"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Queensland", "South Australia"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Queensland", "New South Wales"));
        csp.addConstraint(new Constraint.MapColoringConstraint("New South Wales", "South Australia"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Victoria", "South Australia"));
        csp.addConstraint(new Constraint.MapColoringConstraint("Victoria", "New South Wales"));
        // csp.addConstraint(new Constraint.MapColoringConstraint("Tasmania", "Victoria"));

        csp.solve();

        System.out.println(csp.solutions.size());
        System.out.println("Done");
    }
}
