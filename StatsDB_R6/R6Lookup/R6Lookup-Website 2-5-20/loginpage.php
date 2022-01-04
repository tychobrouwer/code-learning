<?php
include 'phptemplates/mysqlConn.php';

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['username'], $_POST['password'])) {
    if ($stmt = $conn->prepare("SELECT id, hash, userId FROM user WHERE username = ?")) {
        $stmt->bind_param('s', $_POST['username']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $hash, $userId);
            $stmt->fetch();

            // $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);

            if (password_verify($_POST['password'], $hash)) {
                session_start();
                $_SESSION['loggedin'] = true;
                $_SESSION['name'] = $_POST['username'];
                $_SESSION['id'] = $id;
                $_SESSION['userId'] = $userId;
                $name = $_POST['username'];
                header("Location: https://www.r6lookup.com/customize/$name");
                exit();
            } else {
                $wrongPassword = true;
            }
        } else {
            $wrongUsername = true;
        }
        $stmt->close();
    }
}

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats">
    <link rel="canonical" href="https://www.r6lookup.com/" />
    <!-- favicon -->
    <link rel="icon" href="https://www.r6lookup.com/dist/img/icon.svg" sizes="any" type="image/svg+xml">
    <!-- CSS link -->
    <link rel="stylesheet" href="https://www.r6lookup.com/dist/css/style.css">
</head>
<body>
    <?php include('phptemplates/header.html'); ?>
    <div class="main-login-page">
        <div class="login-content">
            <h2>Login</h2>
            <div class="login-form">
                <form action="" method="post">
                    <input type="text" name="username" class="username-login" placeholder="Username" autocomplete="off" required>
                    <?php if ($wrongUsername == true) { ?>
                        <div class="message">
                            <p>Incorrect username!</p>
                        </div>
                    <?php } ?>
                    <input type="password" name="password" class="password-login" placeholder="Password" required>
                    <?php if ($wrongPassword == true) { ?>
                        <div class="message">
                            <p>Incorrect password!</p>
                        </div>
                    <?php } ?>
                    <input type="submit" value="LOGIN" class="submit-login">
                </form>
            </div>
        </div>
    </div>
    <?php include('phptemplates/footer.html'); ?>
    <?php include('phptemplates/cookieAlert.html'); ?>

    <!-- JS Scripts -->
    <script src="https://www.r6lookup.com/dist/js/searchBar.js"></script>
    <script src="https://www.r6lookup.com/dist/js/cookiealert.js"></script>
</body>
</html>
