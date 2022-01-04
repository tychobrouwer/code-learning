<?php
session_start();

$playerIdVote = "`" . str_replace("-", "_", $getUser["profileId"]) . "`";
$playerIdVoteCheck = str_replace("-", "_", $getUser["profileId"]);
$mail = $_SESSION["mail"];
$conn2 = new mysqli($db2servername, $db2username, $db2password, $db2name);

if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true) {
    $delete = false;

    if ($result = $conn2->query("SHOW TABLES LIKE '$playerIdVoteCheck'")) {
        if ($result->num_rows >= 1) {
            $table = true;
        } else {
            $table = false;
        }
    }

    if (isset($_POST['hacker-vote'])) {
        if ($checkTable = $conn2->query("SELECT mail FROM $playerIdVote WHERE mail = '$mail'")) {
            if ($checkTable->num_rows == 1) {
                $delete = true;
            }
        }

        if ($table == false && $delete == false) {
            $createTable = "CREATE TABLE $playerIdVote (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, mail VARCHAR(30) NOT NULL, votes VARCHAR(30) NOT NULL)";

            if (mysqli_query($conn2, $createTable)) {
                $writeTable = "INSERT INTO $playerIdVote (mail, votes) VALUES ('vote', '1')";
                if (mysqli_query($conn2, $writeTable)) {
                }

                $insertTable = "INSERT INTO $playerIdVote (mail) VALUES ('$mail')";
                if (mysqli_query($conn2, $insertTable)) {
                }
            }

        } elseif ($table == true && $delete == false) {
            $updateTable = "UPDATE $playerIdVote SET votes = votes+1 WHERE mail='vote'";
            if (mysqli_query($conn2, $updateTable)) {
            }
            $insertTable2 = "INSERT INTO $playerIdVote (mail) VALUES ('$mail')";
            if (mysqli_query($conn2, $insertTable2)) {
            }
        } elseif ($delete == true) {
            $updateTable = $conn2->query("UPDATE $playerIdVote SET votes = votes-1 WHERE mail='vote'");
            $sql = $conn2->query("DELETE FROM $playerIdVote WHERE mail = '$mail'");
        }

        // Daniel test save hacker
        $userMail = $_SESSION['mail'];
        $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

        if ($stmt = $conn->prepare("SELECT saved_h FROM users WHERE mail = ?")) {
            $stmt->bind_param('s', $userMail);
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
            } else {
                $result = [];
            }

            // Insert function for playerpage

            // Current player name
            $username_saved = $getUser['nameOnPlatform'];
            // Current platform
            $platform_saved = $getUser['platformType'];
            if (!empty($username_saved) && !empty($playerId) && !empty($platform_saved)) {
                if (in_array($username_saved . "," . $playerId . "," . $platform_saved, $result)) {
                    $lol = array_search($username_saved . "," . $playerId . "," . $platform_saved, $result);
                    unset($result[$lol]);
                    $saved_delete = implode(':', $result);
                    if ($stmt = $conn->prepare("UPDATE users SET saved_h = ? WHERE mail = ?")) {
                        $stmt->bind_param('ss', $saved_delete, $userMail);
                        $stmt->execute();
                    }
                } else {
                    if (empty($saved_user)) {
                        $saved_update = $username_saved . "," . $playerId . "," . $platform_saved;
                        if ($stmt = $conn->prepare("UPDATE users SET saved_h = ? WHERE mail = ?")) {
                            $stmt->bind_param('ss', $saved_update, $userMail);
                            $stmt->execute();
                        }
                    } elseif (!empty($saved_user)) {
                        if (count($result) == 15) {
                            array_shift($result);
                            array_push($result, $username_saved . "," . $playerId . "," . $platform_saved);
                            $insert = implode(":", $result);
                        } else {
                            array_push($result, $username_saved . "," . $playerId . "," . $platform_saved);
                            $insert = implode(":", $result);
                        }
                        if ($stmt = $conn->prepare("UPDATE users SET saved_h = ? WHERE mail = ?")) {
                            $stmt->bind_param('ss', $insert, $userMail);
                            $stmt->execute();
                        }
                    }
                }
            }
        }
    }

    $sql1 = ("SELECT * FROM $playerIdVote WHERE mail = '$mail'");
    $data = mysqli_query($conn2, $sql1);

    if ($data->num_rows >0) {
        $voted = true;
    } else {
        $voted = false;
    }
}

if ($table == true) {
    $getVote = $conn2->prepare("SELECT votes FROM $playerIdVote WHERE mail ='vote'");
    $getVote->execute();
    $getVote->store_result();

    if ($getVote->num_rows > 0) {
        $getVote->bind_result($votes);
        $getVote->fetch();
    }
}
