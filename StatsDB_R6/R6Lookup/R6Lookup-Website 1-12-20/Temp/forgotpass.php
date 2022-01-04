<?php
include '../phptemplates/mysqlConn.php';
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['submit'])) {
    $mail = $_POST['mail'];

    // ensure that the user exists on our system
    $query = $conn->query("SELECT mail FROM users WHERE mail='$mail'");

    $mail_req = false;
    $mail_notfound = false;
    echo $mail_notfound;
    if (empty($mail)) {
        $mail_req = true;
        echo "Mail empy";
    } elseif (mysqli_num_rows($query) <= 0) {
        $mail_notfound = true;
        echo "Mail not found";
    }

    // generate a unique random token of length 100
    $token = bin2hex(random_bytes(50));

    if (!empty($mail) && $mail_notfound == false) {
        // store token in the password-reset database table against the user's email
        $sql = "INSERT INTO password_reset(mail, token) VALUES ('$mail', '$token')";
        $results = mysqli_query($conn, $sql);

        // Send email to user with the token in a link they can click on
        $to = $mail;
        $subject = "Reset your password";
        $msg = "Click on this https://test.r6lookup.com/accounts/newpass.php?token=" . $token . " to reset your password on our site";
        $msg = wordwrap($msg, 70);
        $headers = "From: support@r6lookup.com";
        mail($to, $subject, $msg, $headers);
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
            <input type="mail" name="mail" placeholder="Mail">
            <button type="submit" name="submit">send</button>
        </form>

    </body>
</html>
