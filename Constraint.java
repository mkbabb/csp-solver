import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
            // final var domainValues = 
            return false;
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
