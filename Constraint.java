import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;

public class Constraint<V, D> {
    public List<V> variableValues;

    public Constraint(List<V> variableValues) {
        this.variableValues = new ArrayList<V>();
        this.variableValues.addAll(variableValues);
    }

    public boolean isValid(Map<V, D> assignment) {
        return false;
    }

    public static class AllDifferent<V, D> extends Constraint<V, D> {
        public AllDifferent(List<V> variableValues) {
            super(variableValues);
        }

        @Override
        public boolean isValid(Map<V, D> assignment) {
            final var currentValues = new ArrayList<D>();
            for (final var variableValue : this.variableValues) {
                if (assignment.containsKey(variableValue)) {
                    currentValues.add(assignment.get(variableValue));
                }
            }
            final var S = new HashSet<D>(currentValues);
            return currentValues.size() == S.size();
        }
    }

    public static class EqualsConstraint<V, D> extends Constraint<V, D> {
        public V node;
        public D value;

        public EqualsConstraint(V node, D value) {
            super(new ArrayList<V>() {
                { add(node); }
            });
            this.node = node;
            this.value = value;
        }

        @Override
        public boolean isValid(Map<V, D> assignment) {
            if (!assignment.containsKey(this.node)) {
                return false;
            } else {
                final var t = assignment.get(this.node);
                return Objects.equals(t, value);
            }
        }
    }

    public static class FunctionConstraint<V, D> extends Constraint<V, D> {
        public BiFunction<D, D, Boolean> f;
        public V v1;
        public V v2;

        public FunctionConstraint(BiFunction<D, D, Boolean> f, V v1, V v2) {
            super(new ArrayList<V>() {
                {
                    add(v1);
                    add(v2);
                }
            });

            this.f = f;
            this.v1 = v1;
            this.v2 = v2;
        }

        @Override
        public boolean isValid(Map<V, D> assignment) {
            final var currentValues = new ArrayList<D>();
            for (final var variableValue : this.variableValues) {
                if (assignment.containsKey(variableValue)) {
                    currentValues.add(assignment.get(variableValue));
                }
            }
            if (currentValues.size() == 2) {
                return this.f.apply(currentValues.get(0), currentValues.get(1));
            }
            return true;
        }
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
}
