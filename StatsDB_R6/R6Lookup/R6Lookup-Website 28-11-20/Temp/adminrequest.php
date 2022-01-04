<?php
session_start();
include '../phptemplates/mysqlConn.php';
if ($_SESSION['loggedin'] == true && $_SESSION['verified_ml'] == true && $_SESSION['verified_a'] == true) {
    if (isset($_POST['sortSend']) && isset($_POST['sort'])) {
        $query = "SELECT * FROM request WHERE verified = '0' ORDER BY id";
        $sorted = "checked";
    } else {
        $query = "SELECT * FROM request ORDER BY id";
    }
    $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
    $queryR = mysqli_query($conn, $query);
    $row = mysqli_num_rows($queryR);

    if (isset($_POST['pending'])) {
        $array = explode(":", $_POST['pending']);
        $where = $array[1];
        $query = "UPDATE request SET status = '1' WHERE id = '$where'";
        $queryR = mysqli_query($conn, $query);
    }
    if (isset($_POST['onGoing'])) {
        $array = explode(":", $_POST['onGoing']);
        $where = $array[1];
        $query = "UPDATE request SET status = '2' WHERE id = '$where'";
        $queryR = mysqli_query($conn, $query);
    }
    if (isset($_POST['done'])) {
        $array = explode(":", $_POST['done']);
        $where = $array[1];
        $query = "UPDATE request SET status = '3' WHERE id = '$where'";
        $queryR = mysqli_query($conn, $query);
    }
    if (isset($_POST['delete'])) {
        $data = $_POST['deleteTime'];
        // $array = explode(':', $data);
        // $array0 = $array[0] - 6;
        // $time = $array0 . ":" . $array[1] . ":" . $array[2];
        // $dateInsert = $_POST['deleteDate'] . " " . $time;
        // var_dump($dateInsert);
        $queryTest = "DELETE FROM request WHERE created < '$data'";
        $queryRTest = mysqli_query($conn, $queryTest);
    }
}


?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
        <style>
            .btn {
              background-color: #4CAF50;
              color: white;
              padding: 16px;
              font-size: 16px;
              border: none;
            }

            .dropdown {
              position: relative;
              display: inline-block;
            }

            .menu-dropdown {
              display: none;
              position: absolute;
              background-color: #f1f1f1;
              min-width: 160px;
              box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
              z-index: 1;
            }

            .menu-dropdown input {
              color: black;
              padding: 12px 16px;
              text-decoration: none;
              display: block;
            }

            .menu-dropdown input:hover {background-color: #ddd;}

            .dropdown:hover .menu-dropdown {display: block;}

            .dropdown:hover .btn {background-color: #3e8e41;}
        </style>
    </head>
    <body>
        <?php for ($x=1; $x <= $row; $x++) {
            $queryF = mysqli_fetch_assoc($queryR); ?>
            <?php $link = "https://test.r6lookup.com/accounts/admin/requestinfo.php?id=" . urlencode($queryF['id']); ?>
            <span onclick="window.location.href='<?php echo $link ?>'"><?php echo "Ticket number=#" . $queryF['id'] . "Name=" . $queryF['name'] . "Created=" . $queryF['created'] ?>
                <input type="checkbox" <?php if ($queryF['verified'] == 1) { ?>checked<?php } ?>>
                <div class="dropdown">
                    <button class="btn"><?php echo $queryF['status']; ?></button>
                    <div class="menu-dropdown">
                        <form method="post">
                            <input data-id="<?php echo $queryF['id'] ?>" type="submit" name="pending" value="Pending<?php echo ":" . $queryF["id"] ?>" >
                            <input data-id="<?php echo $queryF['id'] ?>" type="submit" name="onGoing" value="On going<?php echo ":" . $queryF["id"] ?>">
                            <input data-id="<?php echo $queryF['id'] ?>" type="submit" name="done" value="finished<?php echo ":" . $queryF["id"] ?>">
                        </form>
                    </div>
                </div>
            </span><br>
        <?php } ?>
        <span>
            <form method="post">
                <form method="post">
                    <input type="text" name="deleteTime" value="2020-01-01 21:00:00">
                    <input type="submit" name="delete" value="Delete"> <br>
                    <input type="checkbox" name="sort" <?php echo $sorted ?>>
                    <input type="submit" name="sortSend" value="Sort by">
                </form>
            </form>
        </span>
    </body>
</html>
