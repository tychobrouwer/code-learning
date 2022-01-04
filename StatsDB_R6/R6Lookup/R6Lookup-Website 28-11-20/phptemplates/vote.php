<?php
session_start();

$playerIdVote = str_replace("-", "_", $getUser["profileId"]);
$mail = $_SESSION["mail"];
if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true) {
    $conn = new mysqli($db2servername, $db2username, $db2password, $db2name);
    $delete = false;

    if (isset($_POST['hacker'])) {
        if ($checkTable = $conn->query("SELECT mail FROM $playerIdVote WHERE mail = '$mail'")) {
            if ($checkTable->num_rows == 1) {
                $delete = true;
            }
        }
        if ($result = $conn->query("SHOW TABLES LIKE '$playerIdVote'")) {
            if($result->num_rows >= 1) {
                $table = true;
            } else {
                $table = false;
            }
        }
        if ($table == false && $delete == false) {
            $createTable = "CREATE TABLE $playerIdVote(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, mail VARCHAR(30) NOT NULL, votes VARCHAR(30) NOT NULL)";
            if(mysqli_query($conn, $createTable)){
                $writeTable = "INSERT INTO $playerIdVote (mail, votes) VALUES ('vote', '1')";
                if (mysqli_query($conn, $writeTable)) {
                } else {
                }
                $insertTable = "INSERT INTO $playerIdVote (mail) VALUES ('$mail')";
                if (mysqli_query($conn, $insertTable)) {
                }
            }
        } elseif ($table == true && $delete == false) {
            $updateTable = "UPDATE $playerIdVote SET votes = votes+1 WHERE mail='vote'";
            if (mysqli_query($conn, $updateTable)) {
            }
            $insertTable2 = "INSERT INTO $playerIdVote (mail) VALUES ('$mail')";
            if(mysqli_query($conn, $insertTable2)){
            }
        } elseif ($delete == true) {
            $updateTable = $conn->query("UPDATE $playerIdVote SET votes = votes-1 WHERE mail='vote'");
            $sql = $conn->query("DELETE FROM $playerIdVote WHERE mail = '$mail'");
        }
    }
    $sql = ("SELECT mail FROM $playerIdVote WHERE mail = '$mail'");
    $data = mysqli_query($conn, $sql);
    if (mysqli_num_rows($data) > 0) {
        $voted = true;
    } else {
        $voted = false;
    }
}

echo $voted;

if ($checkTable1 = $conn->query("SHOW TABLES LIKE '".$playerIdVote."'")) {
    if ($checkTable1->num_rows == 1) {
        $getVote = $conn->prepare("SELECT votes FROM $playerIdVote WHERE mail ='vote'");
        $getVote->execute();
        $getVote->store_result();
        if ($getVote->num_rows > 0) {
            $getVote->bind_result($votes);
            $getVote->fetch();
            echo $votes;
        }
    }
}
