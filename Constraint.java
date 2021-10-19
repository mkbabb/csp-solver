import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Constraint<V> {
    public List<V> values;

    public Constraint(List<V> values) {
        this.values = new ArrayList<V>();
        this.values.addAll(values);
    }

    public <D> boolean isValid(Map<V, D> assignment) {
        return false;
    }

    public class AllDifferent extends Constraint<V> {
        public AllDifferent(List<V> variables) {
            super(variables);
        }

        @Override
        public <D> boolean isValid(Map<V, D> assignment) {
            return false;
        }
    }
}
