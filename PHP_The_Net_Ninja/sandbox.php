<?php

    $score = 50;

    /* TERNARY OPERATORS
    if($score > 50){
        echo 'high score';
    } else {
        echo 'low score'
    }

    SAME AS ABOVE
    echo $score > 40 ? 'high score' : 'low score';
    */

    /* SUPER GLOBALS
    echo $_SERVER['SERVER_NAME'] . '<br />';
    echo $_SERVER['REQUEST_METHOD']. '<br />';
    echo $_SERVER['SCRIPT_FILENAME']. '<br />';
    echo $_SERVER['PHP_SELF']. '<br />';
    */

    /* $_SESSIONS */
    if(isset($_POST['submit'])){
        session_start();

        $_SESSION['name'] = $_POST['name'];

        header('Location: index.php');

        setcookie('gender', $_POST['gender'], time() + 86400);
    }

    /*
    $quotes = readfile('readme.txt');
    echo $quotes;
    */
    $file = 'quotes.txt';

    // if(file_exists($file)){
    // // read file
    // echo readfile($file) . '<br />';

    // // copy file
    // copy($file, 'quotes.txt');

    // // absolute path
    // echo realpath($file) . '<br />';

    // //file size
    // echo filesize($file);

    // // rename file
    // rename($file, 'text.txt');


    // } else {
    //     echo 'file does not exist';
    // }

    // //make file directory
    // mkdir('quotes');

    // opening a file for reading from begin
    // $handle = fopen($file, 'r');

    // read the file
    // echo fread($handle, filesize($file));
    // echo fread($handle, 112)

    // read a single line
    // echo fgets($handle);
    // echo fgets($handle);

    // real a single character
    // echo fgetc($handle);

    // opening a file for reading and writing from begin
    // $handle = fopen($file, 'r+');

    // opening a file for reading and writing from end
    // $handle = fopen($file, 'a+');
    // https://www.w3schools.com/php/func_filesystem_fopen.asp for r+/a+/ext.

    // write to a file overwriting the begining
    // fwrite($handle, "\nEverything is bad")

    // close file
    // fclose($handle)

    // unlink file
    // unlink($file);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
        <input type="text" name="name">
        <select name="gender">
            <option value="male">male</option>
            <option value="female">female</option>
        </select>
        <input type="submit" name="submit" value="submit">
    </form>

</body>
</html>