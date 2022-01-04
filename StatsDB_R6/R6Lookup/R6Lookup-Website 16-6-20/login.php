<?php
session_start();

include 'phptemplates/mysqlConn.php';
include 'phpconfig.php';
include 'phptemplates/getRegion.php';

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['username'], $_POST['password'])) {
    if ($stmt = $conn->prepare("SELECT id, password, playerId FROM user WHERE username = ?")) {
        $stmt->bind_param('s', $_POST['username']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $password, $userId);
            $stmt->fetch();
            // $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $inputPassword = $_POST['password'];
            if (password_verify($_POST['password'], $password)) {
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
    <!-- Google Analytics Script -->
    <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', 'UA-166988316-1', 'auto');
        ga('send', 'pageview');
    </script>
    <script async src='https://www.google-analytics.com/analytics.js'></script>
    <!-- R6Lookup -->
    <title>R6Lookup | Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/login" />
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | Login" />
    <meta property="og:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <meta property="og:url" content="https://www.r6lookup.com/login" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | Login" />
    <meta name="twitter:site" content="@r6lookup" />
    <meta name="twitter:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta name="twitter:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/login.css" async>
</head>
<body>
    <?php include 'phptemplates/header.php'; ?>
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
    <?php include 'phptemplates/footer.html'; ?>
    <?php include 'phptemplates/cookieAlert.html'; ?>
    <!-- JS Scripts -->
    <script src="/dist/js/searchBar.js" async></script>
    <script src="/dist/js/preventResubmit.js" async></script>
    <?php if (!isset($_COOKIE['acceptCookies'])) { ?>
        <script src="/dist/js/cookiealert.js" async></script>
    <?php } ?>
</body>
</html>
