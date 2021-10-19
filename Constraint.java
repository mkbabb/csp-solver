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
            return false;
        }
    }
}
