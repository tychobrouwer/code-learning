<?php
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';

if ($_SESSION['verified_a'] != true) {
    //if not loggedin
    header("Location: /profile/requests");
    exit;
}

if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true && $_SESSION['verified_a'] == true) {
    $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

    $id = urldecode($_GET['id']);

    if ($stmt = $conn->prepare("SELECT * FROM request WHERE id=?")) {
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $contact, $name, $youtube, $twitch, $twitter, $message, $userId, $verified, $status, $created);
            $stmt->fetch();
            $stmt->close();
        }
    }

    if (isset($_POST['verified'])) {
        if ($_POST['verified'] == "approve") {
            $sendVerified = "1";
        } elseif ($_POST['verified'] == "decline") {
            $sendVerified = "0";
        }
        $query1 = "UPDATE request SET verified = '$sendVerified' WHERE id = '$id'";
        $queryR1 = mysqli_query($conn, $query1);
        $query2 = "UPDATE users SET verified_cc = '$sendVerified' WHERE PlayerId = '$userId'";
        $queryR2 = mysqli_query($conn, $query2);
    }
    if ($_POST['verified'] == "approve" && isset($_POST['verified'])) {
        $verified = 1;
    } else {
        $verified = 0;
    }

    if (empty($youtube)) {
        $youtube = "NaN";
    }
    if (empty($twitch)) {
        $twitch = "NaN";
    }
    if (empty($twitter)) {
        $twitter = "NaN";
    }
    if ($status == 1) {
        $status = "Pending";
    } elseif ($status == 2) {
        $status = "On going";
    } elseif ($status == 3) {
        $status = "Done";
    }
    if (isset($_POST['status'])) {
        if ($_POST['status'] == "Pending") {
            $sendStatus = "1";
        } elseif ($_POST['status'] == "On going") {
            $sendStatus = "2";
        } elseif ($_POST['status'] == "Done") {
            $sendStatus = "3";
        }
        $query = "UPDATE request SET status = '$sendStatus' WHERE id = '$id'";
        $queryR = mysqli_query($conn, $query);
    }
    if (isset($_POST['delete'])) {
        $query3 = "DELETE FROM request WHERE id = '$id'";
        $queryR3 = mysqli_query($conn, $query3);
        header("Location: /profile/requests");
        exit;
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
        <span>
            <div class="data">
                <div class="value ticket">
                    <p>Ticket number = <?php echo "#" . $id; ?></p>
                </div>
                <div class="value name">
                    <p>Name = <?php echo $name; ?></p>
                </div>
                <div class="value contact">
                    <p>Contact = <?php echo $contact; ?></p>
                </div>
                <div class="value message">
                    <p>Message = <?php echo $message; ?></p>
                </div>
                <div class="value youtube">
                    <p>Youtube = </p> <a href="<?php echo $youtube; ?>"><?php echo $youtube; ?></a>
                </div>
                <div class="value twitch">
                    <p>Twitch = <?php echo $twitch; ?></p> <a href="<?php echo $twitch; ?>"><?php echo $twitch; ?></a>
                </div>
                <div class="value twitter">
                    <p>Twitter = <?php echo $twitter; ?></p> <a href="<?php echo $twitter; ?>"><?php echo $twitter; ?></a>
                </div>
                <div class="value verified">
                    <p>Verified = </p><input type="checkbox" <?php if ($verified == 1) { ?>checked<?php } ?>>
                </div>
                <div class="value status">
                    <p>Status = <?php if (isset($_POST['status'])) { echo $_POST['status']; } else {echo $status; }?></p>
                </div>
                <div class="value userid">
                    <p>Userid = <?php echo $userId; ?></p>
                </div>
                <div class="value created">
                    <p>Created = <?php echo $created; ?></p>
                </div>
            </div>
            <div class="buttons">
                <form method="post">
                    <div class="button verify">
                        <input type="submit" name="verified" value="decline">
                        <input type="submit" name="verified" value="approve"><br>
                    </div>
                    <div class="button status">
                        <input type="submit" name="status" value="Pending">
                        <input type="submit" name="status" value="On going">
                        <input type="submit" name="status" value="Done"> <br>
                    </div>
                    <div class="button delete">
                        <input type="submit" name="delete" value="Delete">
                    </div>
                </form>
            </div>
        </span>
    </body>
</html>
