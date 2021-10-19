import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Objects;
import java.util.Scanner;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

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

    public static CSP<Futoshiki.FTuple, Integer> readFutoshikiInput(String fileName, String algo)
        throws FileNotFoundException {
        BiFunction<Integer, Integer, Boolean> greaterThan = (x, y) -> x > y;

        Scanner scan;

        scan = new Scanner(new FileInputStream(fileName));
        String read = scan.nextLine();
        int n = Integer.parseInt(read);
        Futoshiki.FTuple[] FTList = new Futoshiki.FTuple[(int) Math.pow(n, 2)];

        int ix = 0;
        for (int x = 0; x < n; x++) {
            for (int y = 0; y < n; y++) {
                FTList[ix] = new Futoshiki.FTuple(x, y);
                ix++;
            }
        }

        ArrayList<Integer> LList = new ArrayList<Integer>();
        ArrayList<Integer> VList = new ArrayList<Integer>();
        ArrayList<Integer> AList = new ArrayList<Integer>();
        ArrayList<Integer> BList = new ArrayList<Integer>();

        for (String s : scan.nextLine().split(" ")) {
            LList.add(Integer.parseInt(s));
        }
        for (String s : scan.nextLine().split(" ")) {
            VList.add(Integer.parseInt(s));
        }
        for (String s : scan.nextLine().split(" ")) {
            AList.add(Integer.parseInt(s));
        }
        for (String s : scan.nextLine().split(" ")) {
            BList.add(Integer.parseInt(s));
        }

        final var domain = new ArrayList<Integer>();
        for (int i = 1; i < n + 1; i++) {
            domain.add(i);
        }

        CSP<Futoshiki.FTuple, Integer> fileCSP = new CSP<Futoshiki.FTuple, Integer>();

        for (final var ftuple : FTList) {
            fileCSP.addVariable(ftuple, domain);
        }

        for (int i = 0; i < LList.size(); i++) {
            final var a = LList.get(i);
            final var b = VList.get(i);
            final var c = new Constraint.EqualsConstraint<Futoshiki.FTuple, Integer>(FTList[a], b);
            fileCSP.addConstraint(c);
        }

        for (int i = 0; i < AList.size(); i++) {
            final var a = AList.get(i);
            final var b = BList.get(i);

            final var c = new Constraint.FunctionConstraint<Futoshiki.FTuple, Integer>(
                greaterThan, FTList[a], FTList[b]);

            fileCSP.addConstraint(c);
        }

        for (int i = 0; i < n; i++) {
            final var row = new ArrayList<Futoshiki.FTuple>();
            for (int j = 0; j < n; j++) {
                row.add(FTList[i * n + j]);
            }
            final var c = new Constraint.AllDifferent<Futoshiki.FTuple, Integer>(row);
            fileCSP.addConstraint(c);
        }

        for (int i = 0; i < n; i++) {
            final var row = new ArrayList<Futoshiki.FTuple>();
            for (int j = 0; j < n; j++) {
                row.add(FTList[i + j * n]);
            }
            final var c = new Constraint.AllDifferent<Futoshiki.FTuple, Integer>(row);
            fileCSP.addConstraint(c);
        }

        fileCSP.solve(algo);

        for (final var s : fileCSP.assignments) {
            for (int i = 0; i < n; i++) {
                final var tmp = new ArrayList<String>();
                for (int j = 0; j < n; j++) {
                    tmp.add(String.valueOf(s.get(FTList[i * n + j])));
                }
                final var ss = tmp.stream().collect(Collectors.joining(" "));
                System.out.println(ss);
            }
            System.out.println("###############");
        }

        return fileCSP;
    }

    public static void main(String[] args) throws FileNotFoundException {
        final var algo = args[0];
        final var filename = args[1];

        final var csp = readFutoshikiInput(filename, algo);
    }
}
