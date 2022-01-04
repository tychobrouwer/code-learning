<?php

if ($sumHacker > 50) {
    $connH = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
    $sql = $connH->query("SELECT userId FROM hackers WHERE userId ='$playerId'");

    if (mysqli_num_rows($sql) == 0) {
        $sql = "INSERT INTO hackers (name, userId) VALUES (Test123, '$playerId')";
    }
}
