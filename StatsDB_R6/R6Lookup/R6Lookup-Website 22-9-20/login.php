<?php
session_start();

include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phpconfig.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/getRegion.php';

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if ($_SESSION['loggedin'] == true) {
    header("Location: /profile/player/overview");
}

if (isset($_POST["submit-login"])) {
    if (isset($_POST['username'], $_POST['password'])) {
        //check if you login with username or mail
        $username = htmlspecialchars($_POST['username']);
        if (preg_match('/@/', $username)) {
            $mail = $_POST['username'];
            $userName = '';
        } elseif (!preg_match('/@/', $username)) {
            $userName = $_POST['username'];
            $mail = '';
        }

        if ($stmt = $conn->prepare("SELECT * FROM users WHERE (username=? OR mail=?)")) {
            $stmt->bind_param('ss', $userName, $mail);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->bind_result($id, $username, $userMail, $password, $platform, $userId, $nameOnPlatform, $userTag, $saved, $saved_h, $verifiedMl, $verified_ubi, $verifiedCc, $verifiedP, $verifiedS, $verifiedA, $created);
                $stmt->fetch();
                // $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
                $inputPassword = $_POST['password'];

                if (password_verify($_POST['password'], $password)) {
                    $_SESSION['loggedin'] = true;
                    $_SESSION['id'] = $id;
                    $_SESSION['username'] = $username;
                    $_SESSION['mail'] = $userMail;
                    $_SESSION['password'] = $password;
                    $_SESSION['platform'] = $platform;
                    $_SESSION['userId'] = $userId;
                    $_SESSION['nameOnPlatform'] = $nameOnPlatform;
                    $_SESSION['userTag'] = $userTag;
                    $_SESSION['verified_ml'] = $verifiedMl;
                    $_SESSION['verified_ubi'] = $verified_ubi;
                    $_SESSION['verified_cc'] = $verifiedCc;
                    $_SESSION['verified_p'] = $verifiedP;
                    $_SESSION['verified_S'] = $verifiedS;
                    $_SESSION['verified_a'] = $verifiedA;
                    $_SESSION['created'] = $created;

                    header("Location: /profile/player/overview");
                    exit();
                } else {
                    $wrongPassword = true;
                }
            } else {
                $wrongUsername = true;
            }
        }
        $stmt->close();
    }
} elseif (isset($_POST["submit-signup"]) && !empty($_POST['newusername']) && !empty($_POST['newpassword']) && !empty($_POST['newmail'])) {
    $signupPage = true;

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
                if ($stmt->affected_rows > 0) {
                    $errorsql = false;
                }
                $stmt->close();
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

                $to = $mail;
                $subject = 'Verify Email R6Lookup';

                // To send HTML mail, the Content-type header must be set
                $headers  = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                // Create email headers
                $headers .= 'From: <support@r6lookup.com>' . "\r\n";

                // Compose a simple HTML email message
                $message = '
                <html>
                <head>
                    <title>R6Lookup email verify</title>
                </head>
                <body>
                    <h2 style="color:#191919;">Hello ' . $_POST['newusername'] . ',</h2>
                    <p style="color:#181818;font-size:18px;">
                        Please click on this <a href="https://www.r6lookup.com/account/verify.php?token=' . $token . '">link</a> to verify your email.
                        <br><br>
                        Problems?
                        <br>
                        Feel free to mail us at support@r6lookup.com.
                    </p>
                </body>
                </html>
                ';

                mail($to, $subject, $message, $headers);
            }
        }
    } else {
        $CharacterMatch = true;
    }
} elseif ($_POST["submit-passreset"]) {
    $mail = $_POST['mail'];

    // ensure that the user exists on our system
    $query = $conn->query("SELECT mail FROM users WHERE mail='$mail'");

    $mail_req = false;
    $mail_notfound = false;
    echo $mail_notfound;
    if (empty($mail)) {
        $mail_req = true;
        echo "Mail empty";
    } elseif (mysqli_num_rows($query) <= 0) {
        $mail_notfound = true;
        echo "Mail not found";
    }

    // generate a unique random token of length 100
    $token = bin2hex(random_bytes(50));

    if (!empty($mail) && $mail_notfound == false) {
        // store token in the password-reset database table against the user's email
        $sql = "INSERT INTO password_reset(mail, token) VALUES ('$mail', '$token')";
        $results = mysqli_query($conn, $sql);

        // Send email to user with the token in a link they can click on
        $to = $mail;
        $subject = "Reset your password";
        $msg = "Click on this https://test.r6lookup.com/account/newpass.php?token=" . $token . " to reset your password on our site";
        $msg = wordwrap($msg, 70);
        $headers = "From: support@r6lookup.com";
        mail($to, $subject, $msg, $headers);
        exit();
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
    <link rel="icon" href="/dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/login.css" async>
</head>
<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/header.php'; ?>
    <div class="page-wrapper">
        <div class="main-page" id="main-login-page"
        <?php if ($errorsql === false) { ?>
            style="display:flex;"
        <?php } elseif ($signupPage == true) { ?>
            style="display:none;"
        <?php } ?>>
            <div class="content">
                <div class="wrapper">
                    <h2>Login</h2>
                    <div class="form">
                        <form method="post">
                            <p>Email or Username</p>
                            <input type="text" name="username" class="username-login" placeholder="Type your Email or Password" autocomplete="off" required>
                            <?php if ($wrongUsername == true) { ?>
                                <div class="message">
                                    <p>Incorrect username!</p>
                                </div>
                            <?php } ?>
                            <p>Password</p>
                            <input type="password" name="password" class="password-login" placeholder="Type your Password" required>
                            <?php if ($wrongPassword == true) { ?>
                                <div class="message">
                                    <p>Incorrect password!</p>
                                </div>
                            <?php } ?>
                            <div class="forgotpass">
                                <div id="to-passforgot-btn">Forgot password?</div>
                            </div>
                            <input type="submit" name="submit-login" value="Login" class="submit">
                        </form>
                        <div class="signup">
                            <span>Not registered? </span>
                            <button id="to-signup-btn">Create an account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-page" id="main-signup-page"
        <?php if ($errorsql === false) { ?>
            style="display:none;"
        <?php } elseif ($signupPage == true) { ?>
            style="display:flex;"
        <?php } ?>>
            <div class="content">
                <div class="wrapper">
                    <h2>Signup</h2>
                    <div class="form">
                        <form method="post">
                            <p>Username</p>
                            <input class="username" placeholder="Type your username" type="username" name="newusername" autocomplete="off" required>
                            <?php if ($usernameTaken == true) { ?>
                                <div class="message">
                                    <p>Username already taken</p>
                                </div>
                            <?php } ?>
                            <p>Email</p>
                            <input class="mail mail1" placeholder="Type your email" type="email" name="newmail" required>
                            <input class="mail mail2" placeholder="Retype your email" type="email" name="newmail2" required>
                            <?php if ($mailmatch == true) { ?>
                                <div class="message">
                                    <p>Email not matching</p>
                                </div>
                            <?php } elseif ($mailTaken == true) { ?>
                                <div class="message">
                                    <p>Email already in use</p>
                                </div>
                            <?php } ?>
                            <p>Password</p>
                            <input class="password password1" placeholder="Type your password" type="password" name="newpassword" autocomplete="off" min="3" max="300" required>
                            <input class="password password2" placeholder="Retype your password" type="password" name="newpassword2" autocomplete="off" min="3" max="300" required>
                            <?php if ($passwordmatch == true) { ?>
                                <div class="message">
                                    <p>Passwords not matching</p>
                                </div>
                            <?php } ?>
                            <p>Platform</p>
                            <div class="platform-div">
                                <label class="radio">
                                    <input class="platform" type="radio" name="platform" value="uplay" checked>
                                    <div class="uplay-div" title="Desktop">
                                        <svg aria-hidden="true" focusable="false" class="uplay" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path>
                                        </svg>
                                    </div>
                                </label>
                                <label class="radio">
                                    <input class="platform" type="radio" name="platform" value="psn">
                                    <div class="psn-div" title="Playstation">
                                        <svg aria-hidden="true" focusable="false" class="psn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"></path>
                                        </svg>
                                    </div>
                                </label>
                                <label class="radio">
                                    <input class="platform" type="radio" name="platform" value="xbl">
                                    <div class="xbl-div" title="Xbox">
                                        <svg aria-hidden="true" focusable="false" class="xbl" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z"></path>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <input class="submit" type="submit" name="submit-signup" value="Signup">
                        </form>
                        <div class="login">
                            <span>Already have an account? </span>
                            <button id="to-login-btn">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-page" id="main-newpass-page">
            <div class="content">
                <div class="wrapper">
                    <h2>Reset password</h2>
                    <div class="form">
                        <form method="post">
                            <p>Email</p>
                            <input type="mail" name="mail" placeholder="Type your email" autocomplete="off" required>
                            <input class="submit" type="submit" name="submit-passreset" value="Send email">
                        </form>
                        <div class="login">
                            <span>Already have an account? </span>
                            <button id="back-login-btn">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php if (isset($errorsql)) { ?>
            <div class="conformation-div" id="conformation-div">
                <?php if ($errorsql === false) { ?>
                    <p>
                        Your account was successfully created. Check your email to verify it for full access.
                    </p>
                <?php } elseif ($errorsql === true) { ?>
                    <p>
                        Problems creating your account! Try again later.
                    </p>
                <?php } else { ?>
                    <p>
                        Something is terrible wrong contact an developer.
                    </p>
                <?php } ?>
                <div class="conformation">
                    <button type="submit" onclick="closeConformation()">Close</button>
                </div>
            </div>
        <?php } ?>
    </div>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/footer.html'; ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/cookieAlert.html'; ?>
    <!-- JS Scripts -->
    <script src="/dist/js/main-login.min.js" async></script>
</body>
</html>
