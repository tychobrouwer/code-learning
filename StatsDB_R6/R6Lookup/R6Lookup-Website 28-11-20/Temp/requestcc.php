<?php
session_start();
include '../../phptemplates/mysqlConn.php';
if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true) {
    $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
    if (isset($_POST['submit'])) {
        if (!empty($_POST['name'])) {
            $name = htmlspecialchars($_POST['name']);
            $nameOk = true;
        }
        if (!empty($_POST['contact'])) {
            $contact = htmlspecialchars($_POST['contact']);
            $contactOk = true;
        }
        if ($_POST['youtube']) {
            $youtube = htmlspecialchars($_POST['youtube']);
            $youtubeOk = true;
        }
        if ($_POST['twitch']) {
            $twitch = htmlspecialchars($_POST['twitch']);
            $twitchOk = true;
        }
        if ($_POST['twitter']) {
            $twitter = htmlspecialchars($_POST['twitter']);
            $twitterOk = true;
        }
        if (!empty($_POST['message'])) {
            $message = htmlspecialchars($_POST['message']);
            $messageOk = true;
        }
        if ($nameOk == true && $contactOk == true && $messageOk == true) {
            $userId = $_SESSION['userId'];
            $query = "INSERT INTO request (contact, name, youtube, twitch, twitter, message, userId) VALUES (?,?,?,?,?,?,?)";
            $stmt = $conn->prepare($query);
            if ($stmt) {
                $stmt->bind_param('sssssss', $contact, $name, $youtube, $twitch, $twitter, $message, $userId);
                $stmt->execute();
                $stmt->close();
            }
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
        <form method="post">
            <input type="text" name="name" placeholder="Full name" required>
            <input type="text" name="contact" placeholder="Contact information" required>
            <input type="url" name="youtube" placeholder="Youtube">
            <input type="url" name="twitch" placeholder="Twitch">
            <input type="url" name="twitter" placeholder="Twitter">
            <input type="text" name="message" placeholder="Message" multiple required>
            <input type="submit" name="submit" value="Send">
        </form>
    </body>
</html>
