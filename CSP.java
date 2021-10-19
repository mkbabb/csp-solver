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

    public CSP() {
        this.variables = new HashMap<V, Variable>();
        this.solutions = new ArrayList<Map<V, D>>();
        this.variableStack = new Stack<V>();
    }

    public class Variable {
        public List<Constraint<V, D>> constraints;
        public List<D> domain;

        public Set<Variable> neighbors;

        public Map<V, Set<D>> prunedDomain;

        public Variable(List<D> domain) {
            this.domain = new ArrayList<D>();
            this.domain.addAll(domain);

            this.constraints = new ArrayList<Constraint<V, D>>();
            this.neighbors = new HashSet<Variable>();

            this.prunedDomain = new HashMap<V, Set<D>>();
        }

        public void restorePrunedDomain(V variableValue) {
            final var values = this.prunedDomain.get(variableValue);
            this.domain.addAll(values);
            values.clear();
        }

        public boolean isValid(Map<V, D> assignment) {
            return constraints.stream().allMatch((c) -> c.isValid(assignment));
        }
    }

    public void addVariable(V variableValue, List<D> domain) {
        final var variable = new Variable(domain);
        this.variables.put(variableValue, variable);
        this.variableStack.push(variableValue);
    }

    public void addConstraint(Constraint<V, D> constraint) {
        final var variables =
            constraint.variableValues.stream().map(this.variables::get).collect(Collectors.toList());

        for (final var v : variables) {
            v.constraints.add(constraint);
            v.neighbors.addAll(variables);
            v.neighbors.remove(v);
        }
    }

    public Set<Variable> getNeighbors(V variableValue) {
        final var variable = this.variables.get(variableValue);
        return variable.neighbors;
    }

    public Variable getNextVariable() {
        return this.variables.get(this.variableStack.pop());
    }

    public boolean forwardCheck(V variableValue, Map<V, D> assignment) {
        this.getNeighbors(variableValue).stream().filter(assignment::containsKey).forEach((Xi) -> {
            
            for (final var x : Xi.domain) {
                // assignment.put(, value)
            
            }
        });
    }

    public boolean backtrack(Map<V, D> assignment) {
        if (assignment.size() == this.variables.size()) {
            this.solutions.add(new HashMap<>(assignment));
            return true;
        }

        final var variableValue = this.variableStack.pop();
        final var variable = this.variables.get(variableValue);

        for (final var x : variable.domain) {
            assignment.put(variableValue, x);

            if (variable.isValid(assignment)) {
                this.backtrack(assignment);
            }

            assignment.remove(variableValue);
        }

        this.variableStack.push(variableValue);

        return false;
    }

    public void solve() {
        final var assignment = new HashMap<V, D>();
        final var variableValues = this.variables.keySet();

        this.variables.values().forEach((v) -> {
            for (final var variableValue : variableValues) {
                v.prunedDomain.put(variableValue, new HashSet<D>());
            }
        });

        this.backtrack(assignment);
    }

    public static class MapColoringConstraint extends Constraint<String, String> {
        public String p1;
        public String p2;

        public MapColoringConstraint(String p1, String p2) {
            super(new ArrayList<String>() {
                {
                    add(p1);
                    add(p2);
                }
            });
            this.p1 = p1;
            this.p2 = p2;
        }

        @Override
        public boolean isValid(Map<String, String> assignment) {
            if (!(assignment.containsKey(p1) || assignment.containsKey(p2))) {
                return true;
            } else {
                return assignment.get(p1) != assignment.get(p2);
            }
        }
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

        csp.addConstraint(new CSP.MapColoringConstraint("Western Australia", "Northern Territory"));
        csp.addConstraint(new CSP.MapColoringConstraint("Western Australia", "South Australia"));
        csp.addConstraint(new CSP.MapColoringConstraint("South Australia", "Northern Territory"));
        csp.addConstraint(new CSP.MapColoringConstraint("Queensland", "Northern Territory"));
        csp.addConstraint(new CSP.MapColoringConstraint("Queensland", "South Australia"));
        csp.addConstraint(new CSP.MapColoringConstraint("Queensland", "New South Wales"));
        csp.addConstraint(new CSP.MapColoringConstraint("New South Wales", "South Australia"));
        csp.addConstraint(new CSP.MapColoringConstraint("Victoria", "South Australia"));
        csp.addConstraint(new CSP.MapColoringConstraint("Victoria", "New South Wales"));
        // csp.addConstraint(new CSP.MapColoringConstraint("Tasmania", "Victoria"));

        csp.solve();

        System.out.println("Done");
    }
}
