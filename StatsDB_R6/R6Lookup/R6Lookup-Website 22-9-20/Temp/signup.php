<?php
include '../phptemplates/mysqlConn.php';

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if (isset($_POST['submit']) && !empty($_POST['newusername']) && !empty($_POST['newpassword']) && !empty($_POST['newmail'])) {
    if (!empty($_POST['newusername'])) {
        $sqlusername = htmlspecialchars($_POST['newusername']);
        $sqlmail = htmlspecialchars($_POST['newmail']);
    }

    if (preg_match('/^[0-9a-zA-Z-.]+$/', $_POST['newusername'])) {
        $sql = "SELECT username FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param('s', $sqlusername);
            $stmt->execute();
            $stmt->store_result();
        }

        if ($stmt->num_rows > 0) {
            $usernameTaken = true;
            $stmt->close();
        } else {
            $usernameTaken = false;
            $stmt->close();
        }

        $sql2 = "SELECT mail FROM users WHERE mail = ?";
        $stmt2 = $conn->prepare($sql2);

        if ($stmt2) {
            $stmt2->bind_param('s', $sqlmail);
            $stmt2->execute();
            $stmt2->store_result();
        }

        if ($stmt2->num_rows > 0) {
            $mailTaken = true;
            $stmt2->close();
        } else {
            if (htmlspecialchars($_POST['newmail']) == htmlspecialchars($_POST['newmail2'])) {
                if (filter_var($_POST['newmail'], FILTER_VALIDATE_EMAIL)) {
                    $notMail = false;
                } else {
                    $notMail = true;
                }

                $mailmatch = false;
            } else {
                $mailmatch = true;
            }
            $mailTaken = false;
            $stmt2->close();
        }

        if (htmlspecialchars($_POST['newpassword']) == htmlspecialchars($_POST['newpassword2'])) {
            $passwordmatch = false;
            $hash = password_hash($_POST['newpassword'], PASSWORD_DEFAULT);
        } else {
            $passwordmatch = true;
        }

        if (mysqli_num_rows($sql2) > 0) {
            $wrongid = false;
        } else {
            $wrongid = true;
        }

        if ($mailmatch == false && $passwordmatch == false && $usernameTaken == false && $mailTaken == false && $notMail == false) {
            $id = htmlspecialchars($_POST['id']);
            $platform = htmlspecialchars($_POST['platform']);
            $username = htmlspecialchars($_POST['newusername']);
            $mail = htmlspecialchars($_POST['newmail']);
            $query = "INSERT INTO users (username, mail, platform, password) VALUES (?,?,?,?)";
            $stmt = $conn->prepare($query);

            if ($stmt) {
                $stmt->bind_param('ssss', $username, $mail, $platform, $hash);
                $stmt->execute();
                $stmt->close();
                $errorsql = false;
                echo $stmt->affected_rows;
            } else {
                $errorsql = true;
                $stmt->close();
            }
            // generate a unique random token of length 100
            $token = bin2hex(random_bytes(50));

            if (!empty($mail)) {
                // store token in the password-reset database table against the user's email
                $sql = "INSERT INTO password_reset(mail, token) VALUES ('$mail', '$token')";
                $results = mysqli_query($conn, $sql);

                // Send email to user with the token in a link they can click on
                $to = $mail;
                $subject = "Verify your mail";
                $msg = "Go to the following link https://test.r6lookup.com/accounts/verify.php?token= . $token to verify your mail";
                $msg = wordwrap($msg, 70);
                $headers = "From: support@r6lookup.com";
                mail($to, $subject, $msg, $headers);

                $to = $mail;
                $subject = 'Verify Email R6Lookup';
                $from = 'support@r6lookup.com';

                // To send HTML mail, the Content-type header must be set
                $headers  = 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

                // Create email headers
                $headers .= 'From: '.$from."\r\n".
                'Reply-To: '.$from."\r\n" .
                'X-Mailer: PHP/' . phpversion();

                // Compose a simple HTML email message
                $message = '<html><body>';
                $message .= '<h1 style="color:#191919;">Verify Email R6Lookup</h1>';
                $message .= '<h2 style="color:#191919;">Hello ' . $_POST['newusername'] . ',</h2>';
                $message .= '
                    <p style="color:#181818;font-size:18px;">
                        Please click on this <a href="https://test.r6lookup.com/accounts/verify.php?token=' . $token . '">link</a> to varify your email.
                        <br><br>
                        Problems?
                        <br>
                        Feel free to mail us at support@r6lookup.com.
                    </p>';
                $message .= '</body></html>';

                mail($to, $subject, $message, $headers);
            }
        }
    } else {
        $CharacterMatch = true;
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
    <title>R6Lookup | Signup</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/signup" />
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | Login" />
    <meta property="og:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <meta property="og:url" content="https://www.r6lookup.com/signup" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | Signup" />
    <meta name="twitter:site" content="@r6lookup" />
    <meta name="twitter:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta name="twitter:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/signup.css" async>
</head>
<body>
    <?php include "../phptemplates/header.php" ?>
    <form method="post">
        <input placeholder="Username" type="username" name="newusername" autocomplete="off" required>
        <?php if ($usernameTaken == true) { ?>
            <div class="message">
                <p>Username already taken</p>
            </div>
        <?php } ?>
        <br>
        <input placeholder="Password" type="password" name="newpassword" autocomplete="off" required>
        <input placeholder="Retype password" type="password" name="newpassword2" autocomplete="off" required>
        <?php if ($passwordmatch == true) { ?>
            <div class="message">
                <p>Password not matching</p>
            </div>
        <?php } ?>
        <br>
        <input placeholder="Mail" type="email" name="newmail" required>
        <input placeholder="Retype mail" type="email" name="newmail2" required>
        <?php if ($mailmatch == true) { ?>
            <div class="message">
                <p>Mail not matching</p>
            </div>
        <?php } elseif ($mailTaken == true) { ?>
            <p>Mail already in use</p>
        <?php } ?>
        <br>
        <input type="radio" name="platform" value="uplay">
        <input type="radio" name="platform" value="xbl">
        <input type="radio" name="platform" value="psn">
        <input type="submit" name="submit" value="Signup">
    </form>
    <?php include "../phptemplates/footer.html" ?>
    <?php include "../phptemplates/cookieAlert.html" ?>
</body>
</html>
