import java.util.Comparator;
import java.util.Objects;

public class Futoshiki {
    public static class FTuple implements Comparable<FTuple> {
        private int x;
        private int y;

        public FTuple(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }

        @Override
        public boolean equals(Object o) {
            if (o == this)
                return true;
            if (!(o instanceof FTuple)) {
                return false;
            }
            FTuple fTuple = (FTuple) o;
            return x == fTuple.x && y == fTuple.y;
        }

        @Override
        public int compareTo(FTuple tup) {
            return Comparator.comparing(FTuple::getX).thenComparing(FTuple::getY).compare(this, tup);
        }
    }
}
