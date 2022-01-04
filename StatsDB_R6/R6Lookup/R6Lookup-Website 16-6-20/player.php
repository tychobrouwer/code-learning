<?php
session_start();

include 'phptemplates/mysqlConn.php';
include 'phptemplates/getRegion.php';
include 'phpconfig.php';
include 'phptemplates/timeConverter.php';

$operatorCount = 0;

if (strlen(htmlspecialchars($_GET['id'])) > 30) {
    $searchModeId = true;
} else {
    $searchModeId = false;
}

if (!empty($_GET['id'])) {
    include 'getStats/getVarPlayer.php';

    if (!array_key_exists('profile_id', $getUser)) {
        header("Location: /?username=" . htmlspecialchars($_GET["id"]) . "&platform=" . htmlspecialchars($_GET["platform"]));
        exit();
    }

    // include 'phptemplates/hackervote.php';
    $playerId = $getUser["profile_id"];

    $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

    $sqlcust = "SELECT background, message, nameColor, urlName, url FROM customize WHERE userId='$playerId'";
    $resultcust = $conn->query($sqlcust);
    $rowcust = $resultcust->fetch_array(MYSQLI_NUM);

    $sql = "SELECT userTag FROM user WHERE playerId='$playerId'";
    // $userTag = $conn->query($sql);

    $result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_NUM);
    $userTag = $row[0];

    $conn -> close();

    // If statement if hacker.php is allowed to load.
    if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser) && ($generalPvpHeadshotRatio >= 0.56 || $generalPvpPenetrationRatio >= 0.11) && $getUser["level"] <= 182) {
        // Calculate Hacker Probability
        include 'phptemplates/hacker.php';
        if ($sumHacker > 50) {
            $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

            $sqlCheck = $conn->query("SELECT userId FROM hackers WHERE userId ='$playerId'");
            if (mysqli_num_rows($sqlCheck) == 0) {
                $sqlHacker = "INSERT INTO hackers (userId) VALUES ('$playerId')";
                $result = mysqli_query($conn, $sqlHacker);
                $conn -> close();
            }
        }
    } else {
        $sumHacker = 0;
    }

    include 'phptemplates/banned.php';
    if ($banned == true && $sumHacker >= 10) {
        $sumHacker = 100;
    }

    if ($sumHacker >= 1) {
        include 'phptemplates/hackervote.php';
    }
}
?>

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
    <title>R6Lookup | <?php echo $getUser["nameOnPlatform"] ?></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="DS-Cloav,DS-Jocular">
    <meta name="theme-color" content="#101010">
    <meta name="google" content="notranslate">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="R6Lookup | A work in progress fanmade Rainbow Six Siege player statistics website. Check your stats for PC, Playstation and xbox."/>
    <meta name="keywords" content="rainbow six siege,siege,rainbow six,r6lookup,r6 lookup,r6s,r6,r6 stats,r6stats,lookup,stats,stat,rainbow,six siege,r6look,player,players,operator,operators,season,seasons,weapon,Weapons">
    <link rel="canonical" href="https://www.r6lookup.com/player/<?php echo $getUser["profile_id"] ?>/<?php echo $getUser["platformType"] ?>" async>
    <!-- Open Graph tags -->
    <meta property="og:site_name" content="R6Lookup" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="R6Lookup | Player <?php echo $getUser["nameOnPlatform"] ?>" />
    <meta property="og:description" content="The player statistics of <?php echo $getUser["nameOnPlatform"] ?>. R6Lookup | Check your stats for PC, Playstation and xbox." />
    <meta property="og:image" content="https://ubisoft-avatars.akamaized.net/<?php echo $getUser["profile_id"] ?>/default_146_146.png" />
    <meta property="og:url" content="https://www.r6lookup.com/player/<?php echo $getUser["profile_id"] ?>/<?php echo $getUser["platformType"] ?>" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="R6Lookup | Player <?php echo $getUser["nameOnPlatform"] ?>" />
    <meta name="twitter:site" content="@r6lookup" />
    <meta name="twitter:description" content="The player statistics of <?php echo $getUser["nameOnPlatform"] ?>. R6Lookup | Check your stats for PC, Playstation and xbox." />
    <meta name="twitter:image" content="https://ubisoft-avatars.akamaized.net/<?php echo $getUser["profile_id"] ?>/default_146_146.png" />
    <!-- favicon -->
    <link rel="icon" href="dist/img/icon.svg" sizes="any" type="image/svg+xml" async>
    <!-- dns-prefetch -->
    <link rel="preconnect" href="//ubisoft-avatars.akamaized.net" crossorigin>
    <link rel="dns-prefetch" href="//ubisoft-avatars.akamaized.net">
    <!-- Preload Fonts -->
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff2" crossorigin="anonymous">
    <link rel=preload as="font" href="/dist/fonts/montserrat-v14-latin-regular.woff" crossorigin="anonymous">
    <!-- CSS links -->
    <link rel="stylesheet" rel=preload type="text/css" as="style" href="/dist/css/player.css" async>
</head>
<body>
    <?php if (($displayData == true) || (htmlspecialchars($_GET["displaydata"]) == "true")) {
        console_log($print);
        console_log($getUser);
        console_log($rowcust);
        console_log($voted);
        console_log($votes);
    } ?>
    <?php include 'phptemplates/header.php'; ?>
    <div class="main-player-page">
        <div class="player-showcase">
            <?php include 'phptemplates/playerpage/showcase.php'; ?>
        </div>
        <div class="nav-stats">
            <div class="main-nav-stats main-nav-player">
                <div class="main-nav-tab active" id="player-stats">
                    <button onclick="loadPlayerStats()">Player Stats</button>
                </div>
                <div class="main-nav-tab main-nav-season">
                    <button onclick="loadSeasons()">Seasons</button>
                </div>
                <div class="main-nav-tab main-nav-operator">
                    <button onclick="loadOperators()">Operators</button>
                </div>
                <div class="main-nav-tab main-nav-weapons">
                    <button onclick="loadWeapons()">Weapons</button>
                </div>
            </div>
        </div>
        <div class="main-stats">
            <div class="player-stats" id="overview-stats">
                <div class="sec-nav-stats">
                    <div class="sec-nav-tab active">
                        <button onclick="loadOverview()">Overview</button>
                    </div>
                    <div class="sec-nav-tab">
                        <button onclick="loadPvp()">PVP</button>
                    </div>
                    <div class="sec-nav-tab">
                        <button onclick="loadPve()">PVE</button>
                    </div>
                </div>
                <div id="overview-stats-tab">
                    <?php include 'phptemplates/playerpage/playeroverview.php'; ?>
                </div>
                <div id="pvp-stats">
                    <?php include 'phptemplates/playerpage/playerpvp.php'; ?>
                </div>
                <div id="pve-stats">
                    <?php include 'phptemplates/playerpage/playerpve.php'; ?>
                </div>
            </div>
            <div class="season-stats" id="season-stats">
                <?php foreach ($seasons as $season) {?>
                    <?php include 'phptemplates/playerpage/seasons.php'; ?>
                <?php } ?>
            </div>
            <div class="operator-stats" id="operator-stats">
                <?php include 'phptemplates/playerpage/operators.php'; ?>
            </div>
            <div class="weapon-stats" id="weapon-stats">
                <?php include 'phptemplates/playerpage/weapons.php'; ?>
            </div>
        </div>
    </div>
    <?php include 'phptemplates/footer.html'; ?>
    <?php include 'phptemplates/cookieAlert.html'; ?>

    <!-- PHP Variable to JS -->
    <script>
    var playerId = '<?php echo $getUser["profile_id"] ?>';
    var platform = '<?php echo $getUser["platformType"] ?>';
    var valHacker = '<?php echo $sumHacker ?>';
    var valLootbox = '<?php echo round($getUser["lootbox_probability"] / 100) ?>';
    var valCustBack = '<?php echo $rowcust[0] ?>';
    var valCustMes = '<?php echo $rowcust[1] ?>';
    var valCustCol = '<?php echo $rowcust[2] ?>';
    var valCustNameURL = '<?php echo $rowcust[3] ?>';
    var valCustURL = '<?php echo $rowcust[4] ?>';
    </script>
    <!-- JS Scripts -->
    <script src="/dist/js/main-player.min.js" async></script>
</body>
</html>
