import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;


public class Reader {
    public static CSP<Integer, Futoshiki.FTuple> readFutoshikiInput(String fileName) {        
        CSP<Integer, Futoshiki.FTuple> fileCSP = null;
        
        Scanner scan;
        try {
            scan = new Scanner(new FileInputStream(fileName));
            String read = scan.nextLine();
            int n = Integer.parseInt(read);
            Futoshiki.FTuple[] FTList = new Futoshiki.FTuple[n^2];
    
            for(int x = 0; x < n; x++) {
                for(int y = 0; y < n; y++) {
                    FTList[(x + 1) * (y + 1) - 1] = new FTuple(x, y);
                }
            }
            ArrayList<Integer> LList = new ArrayList<Integer>();
            ArrayList<Integer> VList = new ArrayList<Integer>();
            for(String s : scan.nextLine().split(" ")) {
                LList.add(Integer.parseInt(s));
            }
            for(String s : scan.nextLine().split(" ")) {
                VList.add(Integer.parseInt(s));
            }
            for(int i = 0; i < LList.size(); i++) {
                
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return fileCSP;
    }
}