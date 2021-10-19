import java.util.ArrayList;
import java.util.HashMap;
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
        public List<Constraint<V>> constraints;
        public List<D> domain;

        public Set<Variable> neighbors;

        public Variable(List<D> domain) {
            this.domain = new ArrayList<D>();
            this.domain.addAll(domain);
        }

        public boolean isValid(Map<V, D> assignment) {
            return constraints.stream().allMatch((c) -> c.isValid(assignment));
        }
    }

    public void addVariable(V value, List<D> domain) {
        final var variable = new Variable(domain);
        this.variables.put(value, variable);
        this.variableStack.push(value);
    }

    public void addConstraint(Constraint<V> constraint) {
        final var variables =
            constraint.values.stream().map(this.variables::get).collect(Collectors.toList());

        for (final var v : variables) {
            v.constraints.add(constraint);
            v.neighbors.addAll(variables);
            v.neighbors.remove(v);
        }
    }

    public Set<Variable> getNeighbors(V value) {
        final var variable = this.variables.get(value);
        return variable.neighbors;
    }

    public Variable getNextVariable() {
        return this.variables.get(this.variableStack.pop());
    }

    public boolean backtrack(Map<V, D> assignment) {
        if (assignment.size() == this.variables.size()) {
            this.solutions.add(new HashMap<>(assignment));
            return true;
        }

        final var value = this.variableStack.pop();
        final var variable = this.variables.get(value);

        for (final var x : variable.domain) {
            assignment.put(value, x);

            if (variable.isValid(assignment)) {
                this.backtrack(assignment);
            }

            assignment.remove(value);
        }

        return false;
    }

    public void solve() {
        final var assignment = new HashMap<V, D>();
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
        csp.add_constraint(map_coloring_constraint("Tasmania", "Victoria"))
    }
}
