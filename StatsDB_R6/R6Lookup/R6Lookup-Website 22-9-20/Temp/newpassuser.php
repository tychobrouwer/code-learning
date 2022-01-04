<?php
session_start();

include '../phptemplates/mysqlConn.php';
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['submit'])) {
    $mail = $_SESSION['mail'];
    $password = $_SESSION['password'];
    $current_pass = htmlspecialchars($_POST['current_pass']);
    $new_pass = htmlspecialchars($_POST['new_pass']);
    $new_pass_c = htmlspecialchars($_POST['new_pass_c']);
    $passmatch = false;

    if (empty($current_pass)) {
        $emptyCurrent = true;
    } else {
        $emptyCurrent = false;
    }
    if (!password_verify($_POST['current_pass'], $password)) {
        $passMatch = true;
    } else {
        $passMatch = false;
    }

    if (empty($new_pass) || empty($new_pass_c)) {
        echo "Password is required";
    }

    if ($new_pass !== $new_pass_c) {
        echo "Password do not match";
        $passmatch = true;
    }
    if (!empty($new_pass) && $passmatch == false && $passMatch == false && $emptyCurrent == false) {
        $new_pass = password_hash($new_pass, PASSWORD_DEFAULT);
        $sqlmail = "UPDATE users SET password=? WHERE mail=?";
        $stmt = $conn->prepare($sqlmail);
        if ($stmt) {
            $stmt->bind_param('ss', $new_pass, $mail);
            $stmt->execute();
            $stmt->close();
        }
        echo "All ok";
        exit();
    }
}

?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <form action="" method="post">
            <input type="password" name="current_pass" value="">
            <input type="password" name="new_pass" value="">
            <input type="password" name="new_pass_c" value="">
            <button type="submit" name="submit">send</button>
        </form>
    </body>
</html>
