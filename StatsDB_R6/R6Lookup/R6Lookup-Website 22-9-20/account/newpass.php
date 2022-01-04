<?php
session_start();

include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if ($_SESSION['loggedin'] == true) {
    $userToken = bin2hex(random_bytes(50));
    $userMail = $_SESSION['mail'];
    $_SESSION['token'] = $userToken;
    $sqluser = "INSERT INTO password_reset (mail,token) VALUES ('$userMail', '$userToken')";
    $stmt2 = $conn->prepare($sqluser);
    if ($stmt2) {
        $stmt2->execute();
        $stmt2->close();
    }
} else {
    $_SESSION['token'] = $_GET['token'];
}
if (isset($_POST['submit'])) {
    $new_pass = $_POST['new_pass'];
    $new_pass_c = $_POST['new_pass_c'];
    $passmatch = false;

    // Grab to token that came from the email link
    $token = $_SESSION['token'];
    if (empty($new_pass) || empty($new_pass_c)) {
        echo "Password is required";
    }

    if ($new_pass !== $new_pass_c) {
        echo "Password do not match";
        $passmatch = true;
    }

    if (!empty($new_pass) && $passmatch == false) {
        // select email address of user from the password_reset table
        $sql = "SELECT mail FROM password_reset WHERE token='$token' LIMIT 1";
        $results = mysqli_query($conn, $sql);
        $mail = mysqli_fetch_assoc($results)['mail'];

        if ($mail) {
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
            <input type="password" name="new_pass" value="">
            <input type="password" name="new_pass_c" value="">
            <button type="submit" name="submit">send</button>
        </form>
    </body>
</html>
