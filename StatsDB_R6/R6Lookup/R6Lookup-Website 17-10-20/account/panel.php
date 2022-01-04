<?php
session_start();

include $_SERVER['DOCUMENT_ROOT'] . '/phpconfig.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/getRegion.php';
include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/mysqlConn.php';

//check if user if logged in
$loggedIn = $_SESSION['loggedin'];
$id = $_SESSION['id'];
$userName = $_SESSION['username'];
$passwordHash = $_SESSION['password'];
$userMail = $_SESSION['mail'];
$platform = $_SESSION['platform'];
$userId = $_SESSION['userId'];
$nameOnPlatform = $_SESSION['nameOnPlatform'];
$userTag = $_SESSION['userTag'];
$verifiedMail = $_SESSION['verified_ml'];
$verifiedUbi = $_SESSION['verified_ubi'];
$verifiedCc = $_SESSION['verified_cc'];
$verifiedP = $_SESSION['verified_p'];
$verifiedS = $_SESSION['verified_S'];
$verifiedA = $_SESSION['verified_a'];
$accountCreated = $_SESSION['created'];

// if not loggedin
if ($loggedIn != true) {
    session_destroy();
    header("Location: /login");
    exit;
}

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// logout
if (isset($_POST['logout'])) {
    session_destroy();
    header("Location: /");
    exit;
}

if ($stmt = $conn->prepare("SELECT saved, verified_ml, verified_ubi, verified_p FROM users WHERE mail = ?")) {
    $stmt->bind_param('s', $userMail);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($saved_user, $verifiedMail, $verifiedUbi, $verifiedP);
        $stmt->fetch();
    }
}

if (isset($_POST['remove'])) {
    // Print function for use in html
    if (!empty($saved_user)) {
        $result = explode(':', $saved_user);
    } else {
        $result = [];
    }
    if (in_array($_POST['remove'], $result)) {
        $userSaved = false;
        $lol = array_search($_POST['remove'], $result);
        unset($result[$lol]);
        $saved_delete = implode(':', $result);

        if ($stmt = $conn->prepare("UPDATE users SET saved = ? WHERE mail = ?")) {
            $stmt->bind_param('ss', $saved_delete, $userMail);
            $stmt->execute();
        }
    }
}

// change psw, verify ubi, request cc page
if ($verifiedMail == true) {
    // change psw, verify ubi page
    if (isset($_POST["submit-change-psw"])) {
        $currentPassword = htmlspecialchars($_POST['current_pass']);
        $newPassword = htmlspecialchars($_POST['new_pass']);
        $newPassword_c = htmlspecialchars($_POST['new_pass_c']);

        if (!password_verify($_POST['current_pass'], $passwordHash)) {
            $wrongPassword = true;
        } else {
            $wrongPassword = false;
        }

        if ($newPassword !== $newPassword_c) {
            $passwordMatch = false;
        } else {
            $passwordMatch = true;
        }

        if (!empty($newPassword) && $passwordMatch == true && $wrongPassword == false) {
            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $sqlmail = "UPDATE users SET password=? WHERE mail=?";
            $stmt = $conn->prepare($sqlmail);

            if ($stmt) {
                $stmt->bind_param('ss', $newPasswordHash, $userMail);
                $stmt->execute();
                $stmt->close();
            }
        }
    }

    if (isset($_POST["submit-verify-ubi"])) {
        include $_SERVER['DOCUMENT_ROOT'] . "/getStats/loginUbi.php";

        if (empty($getUser["error"])) {
            // succesful login
            $returnArray = json_decode($getUser["ubioutput"], true);
            $playerId = $returnArray["profileId"];
            $nameOnPlatform = $returnArray["nameOnPlatform"];

            if ($conn->connect_errno == false && !empty($playerId) && !empty($id) && !empty($nameOnPlatform) && strlen($playerId) == 36) {
                $query = "UPDATE users SET playerId = '$playerId', nameOnPlatform = '$nameOnPlatform', verified_ubi = '1' WHERE id = '$id'";
                $queryR = mysqli_query($conn, $query);
            } else {
                $errorInfo = true;
            }
        }
    }

    if ($verifiedUbi == true) {
        // request cc page
        if (isset($_POST['submit-requestcc'])) {
            if (!empty($_POST['name'])) {
                $name = htmlspecialchars($_POST['name']);
                $nameOk = true;
            }

            if (!empty($_POST['contact'])) {
                $contact = htmlspecialchars($_POST['contact']);
                $contactOk = true;
            }

            $youtube = htmlspecialchars($_POST['youtube']);
            $twitch = htmlspecialchars($_POST['twitch']);
            $twitter = htmlspecialchars($_POST['twitter']);

            if (!empty($_POST['message'])) {
                $message = htmlspecialchars($_POST['message']);
                $messageOk = true;
            }

            if ($nameOk == true && $contactOk == true && $messageOk == true) {
                $query = "INSERT INTO request (contact, name, youtube, twitch, twitter, message, userId) VALUES (?,?,?,?,?,?,?)";
                $stmt = $conn->prepare($query);

                if ($stmt) {
                    $stmt->bind_param('sssssss', $contact, $name, $youtube, $twitch, $twitter, $message, $userId);
                    $stmt->execute();
                    $stmt->close();
                }
            }
        }
    }

    if ($stmt = $conn->prepare("SELECT saved, saved_h FROM users WHERE playerId = ?")) {
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $stmt->store_result();
        $row = $stmt->num_rows;

        if ($row > 0) {
            $stmt->bind_result($saved_user, $saved_user_hacker);
            $stmt->fetch();
        }

        // Print function for use in html
        $resultSavedUsers = explode(':', $saved_user);

        // Print function for use in html
        $resultVotedHackers = explode(':', $saved_user_hacker);
    }
}

$sql = "SELECT userId, created FROM hackers ORDER BY id DESC LIMIT 20";
$hackerFetch = $conn->query($sql);
while ($row = $hackerFetch->fetch_assoc()) {
    $resultLatestHackers[] = $row;
}

// user requests page
if ($verifiedA == true) {
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

    // user requests page
    if (isset($_POST['submit-sort-by']) && isset($_POST['sort'])) {
        $query = "SELECT * FROM request WHERE verified = '0' ORDER BY id";
        $sorted = "checked";
    } else {
        $query = "SELECT * FROM request ORDER BY id";
    }

    $queryT = mysqli_query($conn, $query);
    $rowSaved = mysqli_num_rows($queryT);
}

// customize page
if ($verifiedP == true || $verifiedS == true && !empty($userId)) {
    if ($stmt = $conn->prepare("SELECT background, message, nameColor, urlName, url FROM customize WHERE userId = ?")) {
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($background, $message, $nameColor, $urlName, $url);
            $stmt->fetch();
        } else {
            $sql = $conn->query("INSERT INTO customize (userId) VALUES ('$userId')");
        }
        $stmt->close();
    }

    if (isset($_POST["submit-customize"])) {
        if (isset($_POST["clearbackground"])) {
            $sql = $conn->query("UPDATE customize SET background = '' WHERE userId = '$userId'");
        } elseif (isset($_POST["background"]) && !empty($_POST["background"])) {
            $background = $_POST["background"];
            $sql = $conn->query("UPDATE customize SET background = '$background' WHERE userId = '$userId'");
        }

        if (isset($_POST["clearMessage"])) {
            $sql = $conn->query("UPDATE customize SET message = '' WHERE userId = '$userId'");
        } elseif (isset($_POST["message"])) {
            $message = $_POST["message"];
            $sql = $conn->query("UPDATE customize SET message = '$message' WHERE userId = '$userId'");
        }

        if (isset($_POST["clearNameColor"])) {
            $sql = $conn->query("UPDATE customize SET nameColor = '' WHERE userId = '$userId'");
        } elseif (isset($_POST["nameColor"])) {
            $nameColor = $_POST["nameColor"];
            $sql = $conn->query("UPDATE customize SET nameColor = '$nameColor' WHERE userId = '$userId'");
        }

        if (isset($_POST["clearUrlName"])) {
            $sql = $conn->query("UPDATE customize SET urlName = '' WHERE userId = '$userId'");
        } elseif (isset($_POST["urlName"])) {
            $urlName = $_POST["urlName"];
            $sql = $conn->query("UPDATE customize SET urlName = '$urlName' WHERE userId = '$userId'");
        }

        if (isset($_POST["clearUrl"])) {
            $sql = $conn->query("UPDATE customize SET url = '' WHERE userId = '$userId'");
        } elseif (isset($_POST["url"])) {
            $url = $_POST["url"];
            $sql = $conn->query("UPDATE customize SET url = '$url' WHERE userId = '$userId'");
        }
    }
}

$resultSavedUsersS = implode(":", $resultSavedUsers);
$resultVotedHackersS = implode(":", $resultVotedHackers);
foreach ($resultLatestHackers as $resultLatestHacker) {
    $resultLatestHackersId[] = $resultLatestHacker["userId"];
}
$resultLatestHackersS = implode(":", $resultLatestHackersId);

$getUser = json_decode(file_get_contents("https://". $_SERVER['HTTP_HOST'] . "/getStats/getPanelStats.php?resultSavedUsers=$resultSavedUsersS&resultVotedHackers=$resultVotedHackersS&resultLatestHackers=$resultLatestHackersS&appcode=809965"), true);
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
        <title>R6Lookup | Panel</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="author" content="DS-Cloav,DS-Jocular">
        <meta name="theme-color" content="#101010">
        <meta name="google" content="notranslate">
        <meta name="format-detection" content="telephone=no">
        <meta name="description" content="R6Lookup | Acount Panel"/>
        <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
        <link rel="canonical" href="https://www.r6lookup.com/" />
        <!-- favicon -->
        <link rel="icon" href="/dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
        <!-- Preload Fonts -->
        <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
        <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
        <!-- CSS Links -->
        <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/panel.css" async>
        <!-- JQuery Script -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    </head>
    <body>
        <?php if (($displayData == true) || (htmlspecialchars($_GET["displaydata"]) == "true")) {
            console_log($getUser);
        } ?>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/phptemplates/header.php" ?>
        <div class="main-panel-page">
            <!-- Main nav bar -->
            <div class="nav-bar">
                <div class="nav-tab nav-player
                <?php if ($_GET["window"] == "player") { ?>
                    active
                <?php } ?>">
                    <button class="nav-button">Player</button>
                </div>
                <div class="nav-tab nav-account
                <?php if ($_GET["window"] == "account") { ?>
                    active
                <?php } ?>">
                    <button class="nav-button">Account</button>
                </div>
                <?php if ($verifiedP == true || $verifiedS == true) { ?>
                    <div class="nav-tab nav-customize
                    <?php if ($_GET["window"] == "customize") { ?>
                        active
                    <?php } ?>">
                        <button class="nav-button">Customize</button>
                    </div>
                <?php } ?>
                <?php if ($verifiedA == true) { ?>
                    <div class="nav-tab nav-requests
                    <?php if ($_GET["window"] == "requests") { ?>
                        active
                    <?php } ?>">
                        <button class="nav-button">Requests</button>
                    </div>
                <?php } ?>
                <div class="nav-logout nav-logout">
                    <form class="logout-form" method="post">
                        <div class="button-logout">
                             <input type="submit" name="logout" value="Logout">
                        </div>
                    </form>
                </div>
            </div>
            <!-- Sub nav bar -->
            <?php if ($verifiedMail == true) { ?>
                <div class="sec-nav-bar">
                    <div class="row-sec-nav row-player player
                    <?php if ($_GET["window"] == "player") { ?>
                        active
                    <?php } ?>">
                        <div class="row-items row-player-items">
                            <div class="sec-nav-tab nav-player
                            <?php if ($_GET["secwindow"] == "overview") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Overview</button>
                            </div>
                            <div class="sec-nav-tab nav-change-psw
                            <?php if ($_GET["secwindow"] == "savedplayers") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Saved Players</button>
                            </div>
                            <div class="sec-nav-tab nav-verify-ubi
                            <?php if ($_GET["secwindow"] == "votedhackers") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Voted hackers</button>
                            </div>
                            <div class="sec-nav-tab nav-verify-ubi
                            <?php if ($_GET["secwindow"] == "latest20hackers") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Latest 20 hackers</button>
                            </div>
                        </div>
                    </div>
                    <div class="row-sec-nav row-account account
                    <?php if ($_GET["window"] == "account") { ?>
                        active
                    <?php } ?>">
                        <div class="row-items row-account-items">
                            <div class="sec-nav-tab nav-account
                            <?php if ($_GET["secwindow"] == "information") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Information</button>
                            </div>
                            <div class="sec-nav-tab nav-change-psw
                            <?php if ($_GET["secwindow"] == "changepassword") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Change password</button>
                            </div>
                            <div class="sec-nav-tab nav-verify-ubi
                            <?php if ($_GET["secwindow"] == "verifyubisoft") { ?>
                                active
                            <?php } ?>">
                                <button class="nav-button">Verify ubisoft</button>
                            </div>
                            <?php if ($verifiedUbi == true && $verifiedCc == false) { ?>
                                <div class="sec-nav-tab nav-requestcc
                                <?php if ($_GET["secwindow"] == "requestcc") { ?>
                                    active
                                <?php } ?>">
                                    <button class="nav-button">Requestcc</button>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                    <div class="row-sec-nav row-customize customize
                    <?php if ($_GET["window"] == "customize") { ?>
                        active
                    <?php } ?>">
                        <div class="row-items row-customize-items">
                            <div class="sec-nav-tab nav-customize
                            <?php if ($_GET["secwindow"] == "customize") { ?>
                                active
                            <?php } ?>">customize</div>
                        </div>
                    </div>
                    <div class="row-sec-nav row-requests requests
                    <?php if ($_GET["window"] == "requests") { ?>
                        active
                    <?php } ?>">
                        <div class="row-items row-requests-items">
                            <div class="sec-nav-tab nav-requests
                            <?php if ($_GET["secwindow"] == "requests") { ?>
                                active
                            <?php } ?>">requests</div>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php if ($verifiedMail == false) { ?>
                <div class="verify-mail-warn">
                    <p>Not verified! Please check your mail and follow the instuctions. If you have verified your mail please logout and login.<p>
                </div>
            <?php } ?>
            <!-- Content of sub nav bar -->
            <div class="panel-div">
                <div class="row-content div-player-info overview
                <?php if ($_GET["secwindow"] == "overview") { ?>
                    active
                <?php } ?>">
                    <div class="header">
                        <p>Overview</p>
                    </div>
                    <div class="panel-content">
                        <p class="overview-p">Overview Coming Soon</p>
                    </div>
                </div>
                <div class="row-content div-player-info savedplayers
                <?php if ($_GET["secwindow"] == "savedplayers") { ?>
                    active
                <?php } ?>">
                    <div class="header header-savedplayers">
                        <p>Saved players</p>
                        <button onclick="edit()">Edit</button>
                    </div>
                    <div class="panel-content">
                        <table class="saved-players-table">
                            <?php if (!empty($resultSavedUsers)) { ?>
                                <?php
                                $sumKd = 0;
                                $sumKills =0;
                                $sumDeaths = 0;
                                $sumWl = 0;
                                $sumWins = 0;
                                $sumLosses = 0;
                                $resultArray = count($resultSavedUsers);
                                ?>
                                <thead>
                                    <tr>
                                        <th class="username">
                                            <p>Username</p>
                                        </th>
                                        <th>
                                            <p>Matches played</p>
                                        </th>
                                        <th>
                                            <p>K/D</p>
                                        </th>
                                        <th>
                                            <p>Kills</p>
                                        </th>
                                        <th>
                                            <p>Deaths</p>
                                        </th>
                                        <th>
                                            <p>W/L</p>
                                        </th>
                                        <th>
                                            <p>Wins</p>
                                        </th>
                                        <th>
                                            <p>Losses</p>
                                        </th>
                                        <th class="more-stats-btn">
                                            <p>More stats</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php $count = 0 ?>
                                    <?php foreach ($getUser["savedUsers"] as $savedUserName => $savedUser) { ?>
                                        <tr class="tr-remove">
                                            <td class="remove" style="display:none;">
                                                <form method="post">
                                                    <label for="remove<?php echo $count ?>">
                                                        <p>Remove</p>
                                                    </label>
                                                    <input id="remove<?php echo $count ?>" type="submit" name="remove" value="<?php echo $savedUserName . "," . $savedUser['playerId'] . "," . $savedUser['platform']?>" style="display:none;"></input>
                                                </form>
                                            </td>
                                        </tr>
                                        <tr class="tr-stats">
                                            <td class="username username-player">
                                                <a href="<?php echo "https://" . $_SERVER['HTTP_HOST'] . "/player" . "/" . $savedUser['playerId'] . "/" . $savedUser['platform'] ?>"><?php echo $savedUserName ?></a>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_matchplayed'] ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_kd'] ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_kills'] ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_death'] ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_wl'] . "%" ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_matchwon'] ?>
                                            </td>
                                            <td>
                                                <?php echo $savedUser['rankedpvp_matchlost'] ?>
                                            </td>
                                            <td class="more-stats-btn">
                                                <button onclick="savedStats(<?php echo $count ?>)">This season</button>
                                            </td>
                                            <td class="more-stats" style="display:none;">
                                                <!-- More stats that will be displayed on button press -->
                                                <span class="mmr-span">
                                                    <span class="mmr">
                                                        <img src="<?php echo $savedUser['ranked']['rankInfo']['image'] ?>" alt="rank">
                                                        <?php echo $savedUser['ranked']['mmr'] ?>
                                                    </span>
                                                </span>
                                                <!--<span>MMR change: <?php //echo $savedUser['ranked']['last_match_mmr_change'] ?></span>-->
                                                <span class="stat"><?php echo $savedUser['ranked']['wins'] + $savedUser['ranked']['losses'] ?></span>
                                                <span class="stat"><?php echo $savedUser['seasonal_rankedpvp_kd'] ?></span>
                                                <span class="stat"><?php echo $savedUser['ranked']['kills'] ?></span>
                                                <span class="stat"><?php echo $savedUser['ranked']['deaths'] ?></span>
                                                <span class="stat"><?php echo $savedUser['seasonal_rankedpvp_wl'] ?>%</span>
                                                <span class="stat"><?php echo $savedUser['ranked']['wins'] ?></span>
                                                <span class="stat"><?php echo $savedUser['ranked']['losses'] ?></span>
                                            </td>
                                        </tr>
                                        <?php
                                        // For the general calculation
                                        $sumMatchPlayed += $savedUser['rankedpvp_matchplayed'];
                                        $sumMmr += $savedUser['ranked']['mmr'];
                                        $sumKd += $savedUser['rankedpvp_kd'];
                                        $sumKills += $savedUser['rankedpvp_kills'];
                                        $sumDeaths += $savedUser['rankedpvp_death'];
                                        $sumWl += $savedUser['rankedpvp_wl'];
                                        $sumWins += $savedUser['rankedpvp_matchwon'];
                                        $sumLosses += $savedUser['rankedpvp_matchlost'];
                                        // Counter for the js to display more-stats
                                        $count++;
                                        ?>
                                    <?php } ?>
                                </tbody>
                            <?php } else { ?>
                                <p>You have no saved players.</p>
                            <?php } ?>
                            <tfoot>
                                <tr>
                                    <td class="username">
                                        <p>Average stats:</p>
                                    </td>
                                    <td>
                                        <?php echo round($sumMatchPlayed / $resultArray, 0); ?>
                                    </td>
                                    <td>
                                        <?php echo number_format(round($sumKd / $resultArray, 2), 2, '.', ''); ?>
                                    </td>
                                    <td>
                                        <?php echo round($sumKills / $resultArray, 0); ?>
                                    </td>
                                    <td>
                                        <?php echo round($sumDeaths / $resultArray, 0); ?>
                                    </td>
                                    <td>
                                        <?php echo number_format(round($sumWl / $resultArray, 2), 2, '.', '')  . "%"; ?>
                                    </td>
                                    <td>
                                        <?php echo round($sumWins / $resultArray, 0); ?>
                                    </td>
                                    <td>
                                        <?php echo round($sumLosses / $resultArray, 0); ?>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="row-content div-player-info votedhackers
                <?php if ($_GET["secwindow"] == "votedhackers") { ?>
                    active
                <?php } ?>">
                    <div class="header">
                        <p>Voted on hackers</p>
                    </div>
                    <div class="panel-content">
                        <?php if (!empty($getUser["votedHackers"])) {
                            foreach ($getUser["votedHackers"] as $votedHackerName => $votedHacker) { ?>
                                <div class="hacker-div">
                                    <a class="link" href="/player/<?php echo $votedHacker["playerId"] ?>/uplay">
                                        <?php echo $votedHacker["playerId"] ?>
                                    </a>
                                    <p class="created">
                                        <?php echo $votedHackerName ?>
                                    </p>
                                </div>
                            <?php }
                        } else { ?>
                            <p>You have no votes on hackers.</p>
                        <?php } ?>
                    </div>
                </div>
                <div class="row-content div-player-info latest20hackers
                <?php if ($_GET["secwindow"] == "latest20hackers") { ?>
                    active
                <?php } ?>">
                    <div class="header">
                        <p>Latest 20 hackers found by the community</p>
                    </div>
                    <div class="panel-content">
                        <?php foreach ($resultLatestHackers as $resultLatestHacker) { ?>
                            <div class="hacker-div">
                                <a class="link" href="/player/<?php echo $resultLatestHacker["userId"] ?>/uplay">
                                    <?php echo $resultLatestHacker["userId"] ?>
                                </a>
                                <p class="created">
                                    <?php echo $resultLatestHacker["created"]?>
                                </p>
                            </div>
                        <?php } ?>
                    </div>
                </div>
                <div class="row-content div-account-info information
                <?php if ($_GET["secwindow"] == "information") { ?>
                    active
                <?php } ?>">
                    <div class="header">
                        <p>Username: <?php echo $userName ?></p>
                    </div>
                    <div class="account-info panel-content">
                        <p class="name">Account email</p>
                        <p class="info">
                            <?php echo $userMail ?>
                        </p>
                        <p class="name">Linked Ubisoft account</p>
                        <label class="info">
                            <input type="checkbox"
                            <?php if ($verifiedUbi == true) {
                                echo "checked";
                            } ?> disabled></input>
                            <span class="checkmark"></span>
                        </label>
                        <p class="name">Verified content creator</p>
                        <label class="info">
                            <input type="checkbox"
                            <?php if ($verifiedCc == true) {
                                echo "checked";
                            } ?> disabled></input>
                            <span class="checkmark"></span>
                        </label>
                        <p class="name">Linked Ubisoft account</p>
                        <div class="info">
                            <?php if ($verifiedUbi == true) { ?>
                                <p class="name">Username</p>
                                <p class="info"><?php echo $nameOnPlatform ?></p>
                                <p class="name">Ubisoft id</p>
                                <p class="info"><?php echo $userId ?></p>
                                <p class="name">Platform</p>
                                <p class="info"><?php echo $platform ?></p>
                                <p class="name">Region</p>
                                <p class="info"><?php echo strtoupper($sesRegion) ?></p>
                            <?php } else { ?>
                                <p>Link your Ubisoft account to our website</p>
                            <?php } ?>
                        </div>
                        <p class="name">Created at:</p>
                        <p class="info"><?php echo $accountCreated ?></p>
                    </div>
                </div>
                <?php if ($verifiedMail == true) { ?>
                    <div class="row-content div-change-psw changepassword
                    <?php if ($_GET["secwindow"] == "changepassword") { ?>
                        active
                    <?php } ?>">
                        <div class="header">
                            <p>Change account password</p>
                        </div>
                        <div class="panel-content">
                            <form class="form-changepass panel-form" method="post">
                                <p>Current password</p>
                                <input type="password" name="current_pass" placeholder="Type current password" required>
                                <?php if ($wrongPassword == true) { ?>
                                    <div class="message">
                                        <p>Incorrect password!</p>
                                    </div>
                                <?php } ?>
                                <p>New password</p>
                                <input type="password" name="new_pass" placeholder="Type new password" required>
                                <input type="password" name="new_pass_c" placeholder="Retype new password" required>
                                <?php if ($passmatch == true) { ?>
                                    <div class="message">
                                        <p>Passwords dont match!</p>
                                    </div>
                                <?php } ?>
                                <input class="submit" type="submit" name="submit-change-psw" value="Update">
                            </form>
                        </div>
                    </div>
                    <div class="row-content div-verify-ubi verifyubisoft
                    <?php if ($_GET["secwindow"] == "verifyubisoft") { ?>
                        active
                    <?php } ?>">
                        <div class="header">
                            <p>
                                <?php if ($verifiedUbi == false) { ?>
                                    Verify ubisoft account
                                <?php } else { ?>
                                    Update ubisoft account
                                <?php } ?>
                            </p>
                        </div>
                        <div class="panel-content">
                            <form class="form-verifyubi panel-form" method="post">
                                <p>Email</p>
                                <input type="email" name="mail" placeholder="Type your Ubisoft email" required>
                                <p>Password</p>
                                <input type="password" name="password" placeholder="Type your Ubisoft password" required>
                                <?php if ($errorInfo == true) { ?>
                                    <div class="message">
                                        <p>Incorrect password or username!</p>
                                    </div>
                                <?php } ?>
                                <input class="submit" type="submit" name="submit-verify-ubi" value="Verify">
                            </form>
                        </div>
                    </div>
                    <?php if ($verifiedUbi == true && $verifiedCc == false) { ?>
                        <div class="row-content div-cc-request requestcc
                        <?php if ($_GET["secwindow"] == "requestcc") { ?>
                            active
                        <?php } ?>">
                            <div class="header">
                                <p>Request content creator status</p>
                            </div>
                            <div class="panel-content">
                                <form class="form-requestcc panel-form" method="post">
                                    <p>Your full name/ username</p>
                                    <input type="text" name="name" placeholder="Full name" required>
                                    <p>Your email</p>
                                    <input type="text" name="contact" placeholder="Contact information" required>
                                    <p>Your Youtube URL</p>
                                    <input type="url" name="youtube" placeholder="Youtube">
                                    <p>Your Twitch URL</p>
                                    <input type="url" name="twitch" placeholder="Twitch">
                                    <p>Your Twitter URL</p>
                                    <input type="url" name="twitter" placeholder="Twitter">
                                    <p>Message</p>
                                    <input type="text" name="message" placeholder="Message (max 20 characters)" required>
                                    <input class="submit" type="submit" name="submit-requestcc" value="Send">
                                </form>
                            </div>
                        </div>
                    <?php } ?>
                <?php } ?>
                <?php if ($verifiedP == true || $verifiedS == true) { ?>
                    <div class="row-content div-customize customize
                    <?php if ($_GET["secwindow"] == "customize") { ?>
                        active
                    <?php } ?>">
                        <div class="header">
                            <p>Customize page</p>
                        </div>
                        <div class="panel-content">
                            <form class="form-customize panel-form" method="POST">
                                <?php if ($verifiedP == true) { ?>
                                    <div class="div-customize">
                                        <div class="div-text-input">
                                            <p>URL for your background image</p>
                                            <input placeholder="www.website.com/image.jpg" type="url" name="background" autocomplete="off"
                                            <?php if (isset($background)) { ?>
                                                value="<?php echo $background?>"
                                            <?php } ?>>
                                        </div>
                                        <div class="div-checkbox">
                                            <p>Clear background</p>
                                            <label class="checkbox">
                                                <input class="customize-checkbox" type="checkbox" name="clearbackground">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="div-customize">
                                        <div class="div-text-input">
                                            <p>Account message</p>
                                            <input placeholder="I'm awesome" type="text" maxlength="25" name="message" autocomplete="off"
                                            <?php if (isset($message)) { ?>
                                                value="<?php echo $message?>"
                                            <?php } ?>>
                                        </div>
                                        <div class="div-checkbox">
                                            <p>Clear message</p>
                                            <label class="checkbox">
                                                <input class="customize-checkbox" type="checkbox" name="clearMessage">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                <?php } ?>
                                <?php if ($verifiedS == true || $verifiedP == true) { ?>
                                    <div class="div-customize">
                                        <div class="div-text-input">
                                            <p>Name color</p>
                                            <input placeholder="#FF2D00" type="text" maxlength="7" name="nameColor" autocomplete="off"
                                            <?php if (isset($nameColor)) { ?>
                                                value="<?php echo $nameColor ?>"
                                            <?php } ?>>
                                        </div>
                                        <div class="div-checkbox">
                                            <p>Clear name color</p>
                                            <label class="checkbox">
                                                <input class="customize-checkbox" type="checkbox" name="clearNameColor">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="div-customize">
                                        <div class="div-text-input">
                                            <p>Youtube/Twitch channel name</p>
                                            <input placeholder="bikinibodhi" type="text" maxlength="28" name="urlName" autocomplete="off"
                                            <?php if (isset($urlName)) { ?>
                                                value="<?php echo $urlName ?>"
                                            <?php } ?>>
                                        </div>
                                        <div class="div-checkbox">
                                            <p>Clear channel name</p>
                                            <label class="checkbox">
                                                <input class="customize-checkbox" type="checkbox" name="clearUrlName">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="div-customize">
                                        <div class="div-text-input">
                                            <p>Youtube/Twitch channel URL</p>
                                            <input placeholder="www.twitch.tv/bikinibodhi" type="url" name="url" autocomplete="off"
                                            <?php if (isset($url)) { ?>
                                                value="<?php echo $url ?>"
                                            <?php } ?>>
                                        </div>
                                        <div class="div-checkbox">
                                            <p>Clear channel URL</p>
                                            <label class="checkbox">
                                                <input class="customize-checkbox" type="checkbox" name="clearUrl">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <input class="submit" name="submit-customize" type="submit" value="Update">
                                <?php } ?>
                            </form>
                        </div>
                    </div>
                <?php } ?>
                <?php if ($verifiedA == true) { ?>
                    <div class="row-content div-user-requests requests
                    <?php if ($_GET["secwindow"] == "requests") { ?>
                        active
                    <?php } ?>">
                        <div class="header">
                            <p>User requests</p>
                        </div>
                        <div class="panel-content">
                            <?php for ($x=1; $x <= $rowSaved; $x++) {
                                $queryF = mysqli_fetch_assoc($queryT); ?>
                                <?php $link = "/admin/requestinfo?id=" . urlencode($queryF['id']); ?>
                                <div class="request">
                                    <div class="div-request-info" onclick="window.location.href='<?php echo $link ?>'">
                                        <div class="request-info">
                                            <div class="email">
                                                <p>
                                                    <span class="title">Name: </span>
                                                    <?php echo $queryF['name'] ?>
                                                </p>
                                            </div>
                                            <div class="info">
                                                <p>
                                                    <span class="title">Ticket number: </span>#<?php echo $queryF['id'] ?>
                                                    <span class="created">
                                                        <span class="title">Created: </span><?php echo $queryF['created'] ?>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <input class="verified-checkbox" type="checkbox" disabled
                                        <?php if ($queryF['verified'] == 1) { ?>
                                            checked
                                        <?php } ?>>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn">Status: <?php echo $queryF['status']; ?></button>
                                        <div class="menu-dropdown">
                                            <form method="post" class="form-request-status panel-form">
                                                <input class="submit-request-status" data-id="<?php echo $queryF['id'] ?>" type="submit" name="pending" value="Pending:<?php echo $queryF['id'] ?>" >
                                                <input class="submit-request-status" data-id="<?php echo $queryF['id'] ?>" type="submit" name="onGoing" value="On going:<?php echo $queryF['id'] ?>">
                                                <input class="submit-request-status" data-id="<?php echo $queryF['id'] ?>" type="submit" name="done" value="Finished:<?php echo $queryF['id'] ?>">
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            <?php } ?>
                            <div class="div-actions">
                                <form class="form-request-actions panel-form" method="post">
                                    <input type="text" name="deleteTime" value="2020-01-01 21:00:00">
                                    <input class="submit-request-actions" type="submit" name="submit-delete" value="Delete"> <br>
                                    <input type="checkbox" name="sort" <?php echo $sorted ?>>
                                    <input class="submit-request-actions" type="submit" name="submit-sort-by" value="Sort by">
                                </form>
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/phptemplates/footer.html" ?>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/phptemplates/cookieAlert.html" ?>
        <!-- JS Scripts -->
        <script src="/dist/js/main-panel.min.js" async></script>
    </body>
</html>
