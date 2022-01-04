<?php
session_start();

// include 'phptemplates/mysqlConn.php';
include 'phpconfig.php';
include 'phptemplates/getRegion.php';

if (empty(htmlspecialchars($_COOKIE['ign']))) {
    setcookie('ign', $developers, time()+2629743);
    $cookiestring = $developers;
} else {
    $cookietrue = true;
}

if (!empty(htmlspecialchars($_GET['username']))) {
    include 'getStats/getVarIndex.php';

    // If statement if hacker.php is allowed to load.
    if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser) && ($generalPvpHeadshotRatio >= 0.56 || $generalPvpPenetrationRatio >= 0.11) && $getUser["level"] <= 182) {
        // Calculate Hacker Probability
        include 'phptemplates/hacker.php';
    } else {
        $sumHacker = 0;
    }

    if ($cookietrue === true) {
        if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser)) {
            $igns = explode(";", htmlspecialchars($_COOKIE['ign']));
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
                } else {
                    array_push($igns, $userNamePlatform);
                    $cookiestring = implode(";", $igns);
                    setcookie('ign', $cookiestring, time()+2629743);
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
    <!-- Google Analytics Script -->
    <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', 'UA-166988316-1', 'auto');
        ga('send', 'pageview');
    </script>
    <script async src='https://www.google-analytics.com/analytics.js'></script>
    <!-- R6Lookup -->
    <title>R6Lookup | Rainbow Six Player Stats</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/" />
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | Rainbow Six Player Stats" />
    <meta property="og:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <meta property="og:url" content="https://www.r6lookup.com/" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | Rainbow Six Player Stats" />
    <meta name="twitter:site" content="@r6lookup" />
    <meta name="twitter:description" content="A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox." />
    <meta name="twitter:image" content="https://www.r6lookup.com/dist/img/r6_lookup_logo_square.webp" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/index.css" async>
</head>
<body>
    <?php if ((htmlspecialchars($displayData) == true) && !empty($getUser)) {
        console_log($print);
        console_log($getUser);
    } ?>
    <?php include 'phptemplates/header.php'; ?>
    <div class="main-index-page">
        <div class="rainbowsix-logo">

        </div>
        <div class="content">
            <div class="container-left">
                <div class="header-container-left">
                    <h2>Recently Searched</h2>
                </div>
                <div class="content-container-left">
                    <?php if (!empty(htmlspecialchars($_COOKIE['ign']))) { ?>
                        <?php foreach (explode(";", htmlspecialchars($_COOKIE['ign'])) as $recSearched) { ?>
                            <?php $player = explode("*", $recSearched) ?>
                            <a draggable="false" href="/player/<?php echo $player[2] ?>/<?php echo $player[1] ?>" class="ign-link">
                                <div class="ign-container">
                                    <h4><?php echo $player[0] ?></h4>
                                </div>
                            </a>
                        <?php } ?>
                    <?php } else { ?>
                        <a draggable="false" href="/player/99cd6586-2abe-4e5b-8671-184cb628b004/uplay" class="ign-link">
                            <div class="ign-container">
                                <h4>DS-Jocular</h4>
                            </div>
                        </a>
                        <a draggable="false" href="/player/92a50c74-e277-48b2-bbba-709a00e2d054/uplay" class="ign-link">
                            <div class="ign-container">
                                <h4>DS-Cloav</h4>
                            </div>
                        </a>
                    <?php } ?>
                </div>
            </div>
            <div class="container-center">
                <div class="searchbox">
                    <form method="GET">
                        <table>
                            <tbody>
                                <tr>
                                    <td class="search-player-td">
                                        <div class="search-player-div">
                                            <input id="cursor-end" autofocus class="search-player-input" name="username" autocomplete="off" placeholder="Search player or player ID..."
                                            <?php if (!empty(htmlspecialchars($_GET['username']))) { ?>
                                                value="<?php echo htmlspecialchars($_GET['username']) ?>"
                                            <?php }?>
                                            >
                                        </div>
                                    </td>
                                    <td class="platformbox platformbox-uplay">
                                        <label class="radio">
                                            <input type="radio" name="platform" checked="checked" value="uplay">
                                            <div class="uplay-div" title="Desktop">
                                                <svg aria-hidden="true" focusable="false" class="uplay" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td class="platformbox platformbox-psn">
                                        <label class="radio">
                                            <input type="radio" name="platform"
                                            <?php if (!empty(htmlspecialchars($platform)) && htmlspecialchars($platform) == "psn") {?>
                                                checked="checked"
                                            <?php } ?>
                                            value="psn">
                                            <div class="psn-div" title="Playstation">
                                                <svg aria-hidden="true" focusable="false" class="psn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path fill="currentColor" d="M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td class="platformbox platformbox-xbl">
                                        <label class="radio">
                                            <input type="radio" name="platform"
                                            <?php if (!empty(htmlspecialchars($platform)) && htmlspecialchars($platform) == "xbl") {?>
                                                checked="checked"
                                            <?php }?>
                                            value="xbl">
                                            <div class="xbl-div" title="Xbox">
                                                <svg aria-hidden="true" focusable="false" class="xbl" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor" d="M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z"></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td>
                                        <input type="submit" class="hide">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <?php if (!empty(htmlspecialchars($_GET['username']))) { ?>
                    <div class="results">
                        <div class="h2-results">
                            <h2>Results</h2>
                        </div>
                        <div class="players">
                            <?php if (array_key_exists('profile_id', $getUser)) { ?>
                                <a draggable="false" href="/player/<?php echo $getUser["profileId"] ?>/<?php echo $getUser["platformType"] ?>">
                                    <div class="playerstats">
                                        <div class="rank-logo">
                                            <img draggable="false" src="<?php echo $getUser[$getUser["profileId"]][0]["image"] ?>" alt="rank image">
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
                                                    <?php if ($getUser['rankedpvp_death'] != 0) {
                                                        echo number_format(round($getUser['rankedpvp_kills']/$getUser['rankedpvp_death'], 2), 2, '.', '');
                                                    } else {
                                                        $generalRankedKd = "0.00";
                                                    } ?>
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
                    <p>
                        This is a fanmade project and is a work in progress. We calculate a hackerprobability, for this we use various stats that identify a hacker. While calculating this probability we try to eliminate smurfs as much as possible, but we understand that we can not make it flawless all the time. Therefore we are open for any suggestions.
                        <br>
                        <a href="/partners">Partners</a>
                    </p>
                    <div class="social">
                        <div class="twitter">
                            <a href="https://twitter.com/R6Lookup" target="_blank">
                                <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                                </svg>
                            </a>
                        </div>
                        <div class="discord">
                            <a href="https://discord.gg/AhdsnNH" target="_blank">
                                <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include 'phptemplates/footer.html'; ?>
    <?php include 'phptemplates/cookieAlert.html'; ?>
    <!-- PHP Variable to JS -->
    <script>
        var valHacker = '<?php echo $sumHacker ?>';
    </script>
    <!-- JS Scripts -->
    <script src="/dist/js/main-index.min.js" async></script>
</body>
</html>
