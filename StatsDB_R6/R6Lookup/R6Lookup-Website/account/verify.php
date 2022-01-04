<?php
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';
// Get token
if (!isset($_GET['token'])) {
    header("Location: /login");
    exit();
}

$token = $_GET['token'];
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
$sql = "SELECT mail FROM password_reset WHERE token=? LIMIT 1";
$stmt = $conn->prepare($sql);
if ($stmt) {
    echo "stmt";
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($mail);
    $stmt->fetch();
    echo $mail;
    // $results = mysqli_query($conn, $sql);
    // $mail = mysqli_fetch_assoc($results)['mail'];
}
if ($stmt->num_rows > 0) {
    $query = "UPDATE users SET verified_ml=true WHERE mail=?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param('s', $mail);
        $stmt->execute();
        $stmt->close();
        $verified = true;
    } else {
        $verified = false;
    }
    if ($verified == true) {
        $query1 = "DELETE FROM password_reset WHERE token=?";
        $stmt = $conn->prepare($query1);
        if ($stmt) {
            $stmt->bind_param('s', $token);
            $stmt->execute();
            $stmt->close();
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
        <?php if ($verified == true) { ?>
            <p>Mail is verified</p>
        <?php } else { ?>
            <p>Problems accured! Please contact a moderator</p>
        <?php } ?>
    </body>
</html>
