<?php

$sesId = $_SESSION['id'];
$userId = $getUser['profile_id'];

$db1servername = "localhost:3306";
$db1username = "r6look5_website";
$db1password = "ehu#hvCEIJ32";
$db1name = "r6look5_data";


$conndata = new mysqli($db1servername, $db1username, $db1password, $db1name);

/* check if user ID already exist */
 // $check = mysqli_query("SELECT 1 FROM $userId");

$result = $conndata->query("SHOW TABLES LIKE '{$userId}'");

if ($result->num_rows == 1 && $_POST['hacker'] == "true") {
    $sql1 = "UPDATE '$userId' SET votes = votes +1";
} elseif ($result->num_rows == 0 && $_POST['hacker'] == "true") {
    $sql = "CREATE TABLE '$userId' (
    votes INT,
    id INT NOT NULL,
    PRIMARY KEY(id)
    )";

    $error = mysqli_query($conndata, $sql);
}






//
// echo $check;
// echo $_SESSION['id'];
// echo $userId;
// if ($check !== FALSE && isset($_POST['hacker'])) {
//     $sql = "CREATE TABLE '$userId'(votes int(2147483647), id int(2147483647))";
//     $sql = "INSERT INTO '$userId' (id) VALUES ('$sesId')";
//     $sql = "UPDATE '$userId' SET votes = 1";
//     echo "YES";
// } else {
//     $sql = "UPDATE '$userId' SET votes = votes + 1";
//     $sql = "INSERT INTO '$userId' (id) VALUES ('$sesId')";
//     echo "NO";
// }
