<?php
session_start();
include '../phptemplates/mysqlConn.php';

// This hole page must be merged with player.php, index.php and panel.php

if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true) {
    $userId = $_SESSION['userId'];
    $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

    // $query = ("SELECT saved FROM users WHERE playerId = ?");

    if ($stmt = $conn->prepare("SELECT saved FROM users WHERE playerId = ?")) {
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $stmt->store_result();
        $row = $stmt->num_rows;

        if ($row > 0) {
            $stmt->bind_result($saved_user);
            $stmt->fetch();
        }

        // Print function for use in html
        if (!empty($saved_user)) {
            $result = explode(':', $saved_user);
        }

        // Insert function for playerpage
        if (isset($_POST['save'])) {
            // Current player name
            $username = $_POST['username'];
            // Current user id
            $playerId = $_POST['playerId'];
            // Current platform
            $platform = $_POST['platform'];
            if (!empty($username) && !empty($playerId) && !empty($platform)) {
                if (in_array($username . "," . $playerId . "," . $platform, $result)) {
                    echo "Already exist";
                } else {
                    if (empty($saved_user)) {
                        $saved_update = $username . "," . $playerId . "," . $platform;
                        if ($stmt = $conn->prepare("UPDATE users SET saved = ? WHERE playerId = ?")) {
                            $stmt->bind_param('ss', $saved_update, $userId);
                            $stmt->execute();
                        }
                    } elseif (!empty($saved_user)) {
                        if (count($result) == 8) {
                            array_shift($result);
                            array_push($result, $username . "," . $playerId . "," . $platform);
                            $insert = implode(":", $result);
                        } else {
                            array_push($result, $username . "," . $playerId . "," . $platform);
                            $insert = implode(":", $result);
                        }
                        if ($stmt = $conn->prepare("UPDATE users SET saved = ? WHERE playerId = ?")) {
                            $stmt->bind_param('ss', $insert, $userId);
                            $stmt->execute();
                        }
                    }
                }
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
        <?php foreach ($result as $test) {
                $exploding = explode(',', $test); ?>
                <span>
                    <a href="<?php echo "https://" . $_SERVER['HTTP_HOST'] . "/player/$exploding[1]/$exploding[2]"; ?>"><?php echo $exploding[0]; ?></a>
                    <?php echo $exploding[0]; ?>
                    <?php echo $exploding[1]; ?>
                    <?php echo $exploding[2]; ?> <br>
                </span>
        <?php } ?>
        <form method="post">
            <input type="text" name="username" value="">
            <input type="text" name="playerId" value="">
            <input type="text" name="platform" value="">
            <input type="submit" name="save" value="Save">
        </form>
    </body>
</html>
