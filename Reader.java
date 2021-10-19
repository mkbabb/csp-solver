import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class Reader {
    public static CSP<Integer, Futoshiki.FTuple> readFutoshikiInput(String fileName)
        throws FileNotFoundException {
        

        Scanner scan;

        scan = new Scanner(new FileInputStream(fileName));
        String read = scan.nextLine();
        int n = Integer.parseInt(read);
        Futoshiki.FTuple[] FTList = new Futoshiki.FTuple[(int) Math.pow(n, 2)];

        for (int x = 0; x < n; x++) {
            for (int y = 0; y < n; y++) {
                FTList[(x + 1) * (y + 1) - 1] = new Futoshiki.FTuple(x, y);
            }
        }
        ArrayList<Integer> LList = new ArrayList<Integer>();
        ArrayList<Integer> VList = new ArrayList<Integer>();
        for (String s : scan.nextLine().split(" ")) {
            LList.add(Integer.parseInt(s));
        }
        for (String s : scan.nextLine().split(" ")) {
            VList.add(Integer.parseInt(s));
        }
        for (int i = 0; i < LList.size(); i++) {
        }

        final var domain = new ArrayList<Integer>();
        for (int i = 1; i < n + 1; i++) {
            domain.add(i);
        }

        CSP<Futoshiki.FTuple, Integer> fileCSP = new CSP();

        for (final var ftuple : FTList) {
            fileCSP.addVariable(ftuple, domain);
        }
        

        return fileCSP;
    }
}