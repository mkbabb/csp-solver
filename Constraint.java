import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
                    currentValues.add(assignment.get(variableValue))
                }
            }
            final var S = new HashSet<D>(currentValues);
            return currentValues.size() == S.size();
        }
    }

    public static class FunctionConstraint<V, D> extends Constraint<V, D> {
        BiFunction<D, D, Boolean> f;
        public FunctionConstraint(BiFunction<D, D, Boolean> f, List<V> variableValues) {
            super(variableValues);
            this.f = f;
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
