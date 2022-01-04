<?php
session_start();
include '../phptemplates/mysqlConn.php';
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST["verifyUbi"])) {
    $id = $_SESSION['id'];
    include $_SERVER['DOCUMENT_ROOT'] . "/getStats/loginUbi.php";

    if (empty($getUser["error"])) {
        // succesful login
        $returnArray = json_decode($getUser["ubioutput"], true);
        $playerId = $returnArray["profileId"];
        echo $playerId;
        if ($conn->connect_errno == false && !empty($playerId) && !empty($id) && strlen($playerId) == 36) {
            $query = "UPDATE users SET playerId = '$playerId', verified_ubi = '1' WHERE id = '$id'";
            $queryR = mysqli_query($conn, $query);
            if ($conn->connect_errno) {
                $mysqlError = true;
                echo "Mysql error";
            } elseif ($queryR == false) {
                $mysqlUpdateError = true;
                echo "Update error";
            } elseif (empty($playerId)) {
                $emptyPlayerId = true;
                echo "Player id error";
            } elseif (empty($id)) {
                $emptyId = true;
                echo "id error";
            }
        } else {
            $errorInfo = true;
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
        <form class="form-verifyubi" method="post">
            <input type="email" name="mail" placeholder="Mail for ubisoft">
            <input type="password" name="password" placeholder="Password for ubisoft">
            <input type="submit" name="verifyUbi" value="Check">
        </form>
    </body>
</html>
