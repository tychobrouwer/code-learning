import javax.swing.*;

public class TempConvGUI {
    public static void main(String[] args) {
        String fahrString;
        double fahr, cel;
        
        fahrString = JOptionPane.showInputDialog("Enter the temperature in F");
        fahr = Double.parseDouble(fahrString);
        cel = (fahr - 32) * 5.0/9.0;

        JOptionPane.showMessageDialog(null,"The temperature in C is, " + cel);
    }
}
