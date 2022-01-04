<?php

include 'phptemplates/mysqlConn.php';

// print function that actually works
function console_log($data)
{
    echo '<script>';
    echo 'console.log('.json_encode($data).')';
    echo '</script>';
}

$userFound = false;
if (isset($_POST['submit']) && !empty($_POST['username'])) {
    $userFound = true;
}

$developers = "DS-Jocular*uplay*99cd6586-2abe-4e5b-8671-184cb628b004;DS-Cloav*uplay*92a50c74-e277-48b2-bbba-709a00e2d054";

if (empty($_COOKIE['ign'])) {
    setcookie('ign', $developers, time()+2629743);
    $cookiestring = $developers;
} else {
    $cookietrue = true;
}

if (isset($_POST['submit']) && !empty($_POST['username'])) {
    include 'phptemplates/getRegion.php';

    include 'getStats/getVarIndex.php';
    console_log($getUser);

    // If statement if hacker.php is allowed to load.
    if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser) && ($generalPvpHeadshotRatio >= 0.55 || $generalPvpPenetrationRatio >= 0.11) && $getUser["level"] <= 182) {
        // Calculate Hacker Probability
        include 'hacker.php';

        console_log($print);
    } else {
        $sumHacker = 0;
    }

    if ($cookietrue === true) {
        if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser)) {
            $igns = explode(";", $_COOKIE['ign']);
            if (empty($igns[0])) {
                array_shift($igns);
            }

            $userNamePlatform = $getUser["nameOnPlatform"] . "*" . $getUser["platformType"] . "*" . $getUser["profile_id"];

            if (!in_array($userNamePlatform, $igns)) {
                if (count($igns) == 7) {
                    array_shift($igns);
                    array_push($igns, $userNamePlatform);
                    $cookiestring = implode(";", $igns);
                    setcookie('ign', $cookiestring, time()+2629743);
                    // print_r($cookiestring);
                } else {
                    array_push($igns, $userNamePlatform);
                    $cookiestring = implode(";", $igns);
                    setcookie('ign', $cookiestring, time()+2629743);
                    // print_r($cookiestring);
                }
            }
        }
    }
}

?>
 <!-- HTML ofc -->
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | Rainbow Six Player Stats</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats">
    <link rel="canonical" href="https://www.r6lookup.com/" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml">
    <!-- CSS link -->
    <link rel="stylesheet" href="https://www.r6lookup.com/dist/css/style.css">
</head>
<body>
    <?php echo "WORKS" ?>
    <?php include('phptemplates/header.html'); ?>
    <div class="main-index-page">
        <div class="rainbowsix-logo"></div>
        <div class="content">
            <div class="container-left">
                <div class="header-container-left">
                    <h2>Recently Searched</h2>
                </div>
                <div class="content-container-left">
                    <?php if (isset($_COOKIE['ign'])) { ?>
                        <?php foreach (explode(";", $_COOKIE['ign']) as $recSearched) { ?>
                            <?php $player = explode("*", $recSearched) ?>
                            <a draggable="false" href="https://www.r6lookup.com/player/<?php echo $player[2] ?>/<?php echo $player[1] ?>" class="ign-link">
                                <div class="ign-container">
                                    <h4><?php echo $player[0] ?></h4>
                                </div>
                            </a>
                        <?php } ?>
                    <?php } else { ?>
                        <a draggable="false" href="https://www.r6lookup.com/player/99cd6586-2abe-4e5b-8671-184cb628b004/uplay" class="ign-link">
                            <div class="ign-container">
                                <h4>DS-Jocular</h4>
                            </div>
                        </a>
                        <a draggable="false" href="https://www.r6lookup.com/player/92a50c74-e277-48b2-bbba-709a00e2d054/uplay" class="ign-link">
                            <div class="ign-container">
                                <h4>DS-Cloav</h4>
                            </div>
                        </a>
                    <?php } ?>
                </div>
            </div>
            <div class="container-center">
                <div class="searchbox">
                    <form action="/" method="POST">
                        <table>
                            <tbody>
                                <tr>
                                    <td class="search-player-td">
                                        <div class="search-player-div">
                                            <input id="cursor-end" autofocus class="search-player-input" name="username" autocomplete="off" placeholder="Search player..."
                                            <?php if ($userFound === true) { ?>
                                                value="<?php echo $userName ?>"
                                            <?php }?>
                                            >
                                        </div>
                                    </td>
                                    <td class="platformbox platformbox-uplay">
                                        <label class="radio">
                                            <input type="radio" name="platform" checked="checked" value="uplay">
                                            <div class="uplay-div">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="windows" class="uplay svg-inline--fa fa-windows fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td class="platformbox platformbox-psn">
                                        <label class="radio">
                                            <input type="radio" name="platform"
                                            <?php if (isset($platform) && $platform=="psn") {?>
                                                checked="checked"
                                            <?php } ?>
                                            value="psn">
                                            <div class="psn-div">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="playstation" class="psn svg-inline--fa fa-playstation fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path fill="currentColor" d="M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td class="platformbox platformbox-xbl">
                                        <label class="radio">
                                            <input type="radio" name="platform"
                                            <?php if (isset($platform) && $platform=="xbl") {?>
                                                checked="checked"
                                            <?php }?>
                                            value="xbl">
                                            <div class="xbl-div">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="xbox" class="xbl svg-inline--fa fa-xbox fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor" d="M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td>
                                        <input type="submit" name="submit" value="submit" class="hide">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <?php if ($userFound === true) { ?>
                    <div class="results">
                        <div class="h2-results">
                            <h2>Results</h2>
                        </div>
                        <div class="players">
                            <?php if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser)) { ?>
                                <a draggable="false" href="https://www.r6lookup.com/player/<?php echo $getUser["profileId"] ?>/<?php echo $getUser["platformType"] ?>">
                                    <div class="playerstats">
                                        <div class="rank-logo">
                                            <img draggable="false" src="<?php echo $getUser[$getUser["profileId"]][0]["image"] ?>" alt="rank image"></img>
                                        </div>
                                        <div class="stats">
                                            <h4><?php echo $getUser["nameOnPlatform"] ?></h4>
                                            <div class="prev-stats">
                                                <p class="level">
                                                    <span class="aternate-text">level: </span>
                                                    <?php echo $getUser["level"] ?>
                                                </p>
                                                <p class="kd">
                                                    <span class="aternate-text">KD: </span>
                                                    <?php echo number_format($generalRankedKd, 2, '.', '') ?>
                                                </p>
                                                <p class="rank">
                                                    <span class="aternate-text">MMR: </span>
                                                    <?php echo $getUser[$getUser["profileId"]]["mmr"] ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="hackerprob-div">
                                            <div id="hackerprob"></div>
                                        </div>
                                    </div>
                                </a>
                            <?php } else { ?>
                                <div class="error-message">
                                    <h4>User not found!</h4>
                                    <p>Please check your spelling and make sure you are searching by the correct platform.</p>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                <?php } ?>
            </div>
            <div class="container-right">
                <div class="header-container-right">
                    <h2><a href="/about">About</a></h2>
                </div>
                <div class="content-container-right">
                    <p>This is a fanmade project and is a work in progress. We calculate a hackerprobability, for this we use the winrate, KD-ratio, headshotratio, penetrationkills and level. While calculating this probability we try to eliminate smurfs as much as possible, but we understand that we can not make it flawless all the time. Therefore we are open for any suggestions.</p>
                </div>
            </div>
        </div>
    </div>
    <?php include('phptemplates/footer.html'); ?>
    <?php include('phptemplates/cookieAlert.html'); ?>
    <!-- PHP Variable to JS -->
    <script type="text/javascript">
        var valHacker = '<?php echo $sumHacker ?>';
    </script>
    <!-- JS Scripts -->
    <script src="https://www.r6lookup.com/dist/js/setCaretPos.js"></script>
    <script src="https://www.r6lookup.com/dist/js/searchBar.js" ></script>
    <script src="https://www.r6lookup.com/dist/js/cookiealert.js"></script>
    <!-- include only when player found -->
    <?php if ($userFound === true) { ?>
        <script src="https://www.r6lookup.com/dist/js/hackerBar.js"></script>
    <?php } ?>
</body>
</html>
