<?php

include 'phptemplates/mysqlConn.php';
include 'https://www.r6lookup.com/phptemplates/getRegion.php';


$seasonsprev = [1, 2, 3, 4];
$seasonsprevName = ['VOID EDGE', 'SHIFTING TIDES', 'EMBER RISE', 'PHANTOM SIGHT', 'BURNT HORIZON'];
$seasons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
$seasonsName = ['VOID EDGE', 'SHIFTING TIDES', 'EMBER RISE', 'PHANTOM SIGHT', 'BURNT HORIZON', 'WIND BASTION', 'GRIM SKY', 'PARA BELLUM', 'CHIMERA', 'WHITE NOISE', 'BLOOD ORCHID', 'HEALTH'];

if (isset($_GET['submit']) && !empty($_GET['id'])) {
    include 'https://www.r6lookup.com/getStats/getVarPlayer.php';

    $playerId = $getUser["profile_id"];

    // $conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
    //
    // $sqlcust = "SELECT background, message, nameColor, urlName, url FROM customize WHERE userId='$playerId'";
    //
    // $resultcust = $conn->query($sqlcust);
    // $rowcust = $resultcust->fetch_array(MYSQLI_NUM);
    //
    // $sql = "SELECT userTag FROM user WHERE userId='$playerId'";
    //     // $userTag = $conn->query($sql);
    //
    // $result = $conn->query($sql);
    // $row = $result->fetch_array(MYSQLI_NUM);
    // $userTag = $row[0];
    //
    // $conn -> close();

    // print function that actually works
    function console_log($data)
    {
        echo '<script>';
        echo 'console.log('.json_encode($data).')';
        echo '</script>';
    }
    // If statement if hacker.php is allowed to load.
    if (!empty($getUser) && !array_key_exists('error', $getUser) && array_key_exists('profile_id', $getUser) && ($generalPvpHeadshotRatio >= 0.55 || $generalPvpPenetrationRatio >= 0.11) && $getUser["level"] <= 182) {
        // Calculate Hacker Probability
        include 'hacker.php';

        console_log($print);
    } else {
        $sumHacker = 0;
    }

    console_log($getUser);

    $arrayWins = array(0,1,2);

    foreach ($seasons as $season) {
        if ($getUser[$season]['kills'] > 0 && $getUser[$season]['rank'] == 0 && $getUser[$season]['wins'] == 0 && $getUser[$seasons]['losses'] == 0 ||
        ($getUser[$season]['kills'] > 100 && in_array($getUser[$season]['wins'], $arrayWins, true) && $getUser[$season]['rank'] == 0 && $getUser[$season]['losses'] == 0)) {
            $banned = true;
            break 1;
        } else {
            $banned = false;
        }
    }

    if ($getUser[0]['mmr'] == 2500 && $getUser[1]['mmr'] == 2500 && $getUser[2]['mmr'] == 2500 && $getUser[3]['mmr'] == 2500 && $getUser[4]['mmr'] == 2500 &&
    $getUser[5]['mmr'] == 2500 && $getUser[6]['mmr'] == 2500 && $getUser[7]['mmr'] == 2500 && $getUser[8]['mmr'] == 2500 && $getUser[9]['mmr'] == 2500 && $getUser[10]['mmr'] == 2500
    && $getUser[11]['mmr'] == 2500 && $getUser["rankedpvp_kills"] != 0) {
        $banned2 = true;
    } else {
        $banned2 = false;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- R6Lookup -->
    <title>R6Lookup | Player</title>
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
    <div class="main-player-page">
        <div class="player-showcase">
            <div class="left-content">
                <div class="profile-pic-div">
                    <img class="profile-pic" src="https://ubisoft-avatars.akamaized.net/<?php echo $getUser["profile_id"] ?>/default_146_146.png" alt="profile picture">
                </div>
                <div class="profile">
                    <h3>
                        <?php echo $displayPlatform ?>
                        <?php if ($banned === true || $banned2 === true) { ?>
                            <span class="ban-status">BANNED</span>
                        <?php } ?></h3>
                    <div class="username">
                        <h1 id="username-set-color"><?php echo $getUser["nameOnPlatform"] ?>
                            <?php if ($userTag == "Developer") { ?>
                                <span class="usertag-developer"> <?php echo $userTag ?></span>
                            <?php } elseif ($userTag == "Supporter") { ?>
                                <span class="usertag-supporter"> <?php echo $userTag ?></span>
                            <?php } ?>
                        </h1>
                    </div>
                    <div class="playerid">
                        <p id="cutId-js"><?php echo $getUser["profile_id"] ?></p>
                        <button id="copyBtn-js">
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="copy-btn svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="right-content">
                <div class="playerbar-div">
                    <div class="hackerprob-div">
                        <p class="hackerbar-p">Hacker: <?php echo $sumHacker ?>%</p>
                        <div id="hackerprob">

                        </div>
                    </div>
                    <div class="lootboxprob-div">
                        <p class="lootboxprob-p">Alfa pack: <?php echo round($getUser["lootbox_probability"] / 100) ?>%</p>
                        <div id="lootboxprob-player">

                        </div>
                    </div>
                    <div class="most-played-op">

                    </div>
                </div>
                <div class="basic-stats">
                    <div class="level-div">
                        <h4 class="level">Level: </h4>
                        <h4><?php echo $getUser["level"] ?></h4>
                    </div>
                    <div class="time-played-div">
                        <h4 class="time-played">Time played: </h4>
                        <h4><?php echo $overallTimePlayedHMS["h"] . "h " . $overallTimePlayedHMS["m"] . "m" ?></h4>
                    </div>
                    <div class="current-mmr-div">
                        <h4 class="current-mmr">Current mmr: </h4>
                        <h4><?php echo $getUser[0]['mmr'] ?></h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="nav-stats">
            <div class="main-nav-stats">
                <div class="main-nav-tab active" id="player-stats">
                    <button onclick="loadPlayerStats()">Player Stats</button>
                </div>
                <div class="main-nav-tab">
                    <button onclick="loadSeasons()">Seasons</button>
                </div>
                <div class="main-nav-tab">
                    <button onclick="loadOperators()">Operators</button>
                </div>
                <div class="main-nav-tab">
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
                    <div class="overview-stats-content">
                        <div class="content-left">
                            <div class="ranks-overview">
                                <div class="current-season">
                                    <div class="season-name">
                                        <p><?php echo $seasonsprevName[0] ?></p>
                                    </div>
                                    <div class="rank">
                                        <div class="current-rank-img">
                                            <img src="<?php echo $getUser[0][0]['image'] ?>" alt="rank image">
                                        </div>
                                        <div class="current-rank-info">
                                            <p class="current-season-mmrChange">
                                                <?php echo $getUser[0]['last_match_mmr_change']; ?>
                                                <span class="changeMmr">
                                                    <?php if ($getUser[0]['last_match_mmr_change'] != 0) { ?>
                                                        <?php if ($getUser[0]['last_match_mmr_change'] > 0) { ?>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-up" class="arrowUp svg-inline--fa fa-sort-up fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                                <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                                                            </svg>
                                                            <span>MMR</span>
                                                        <?php } elseif ($getUser[0]['last_match_mmr_change'] < 0) { ?>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-down" class="arrowDown svg-inline--fa fa-sort-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                                <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                                                            </svg>
                                                            <span>MMR</span>
                                                        <?php } ?>
                                                    <?php } else { ?>
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" class="arrowEven svg-inline--fa fa-sort fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                                                        </svg>
                                                        <span>No change</span>
                                                    <?php } ?>
                                                </span>
                                            </p>
                                            <p class="current-season-mmr">
                                                <?php echo $getUser[0]['mmr'] ?>
                                                <span><?php echo $getUser[0][0]['name'] ?></span>
                                            </p>
                                            <p class="current-season-kd">
                                                <?php echo round($getUser[0]['kills']/$getUser[0]['deaths'], 2) ?>
                                                <span> K/D</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <?php foreach ($seasonsprev as $seasonprev) { ?>
                                    <div class="season">
                                        <div class="season-name">
                                            <p><?php echo $seasonsprevName[$seasonprev] ?></p>
                                        </div>
                                        <div class="rank">
                                            <div class="rank-img">
                                                <img draggable="false" src="<?php echo $getUser[$seasonprev][0]['image'] ?>" alt="rank image">
                                            </div>
                                            <div class="rank-info">
                                                <p class="season-mmr">
                                                    <?php echo $getUser[$seasonprev]['mmr'] ?>
                                                    <span><?php echo $getUser[$seasonprev][0]['name'] ?></span>
                                                </p>
                                                <p class="season-kd">
                                                    <?php echo round($getUser[$seasonprev]['kills']/$getUser[$seasonprev]['deaths'], 2) ?>
                                                    <span> K/D</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="overview-stats">
                                <div class="def-stats-4col">
                                    <div class="def-header">
                                        <p>General Statistics</p>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>General K/D</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpKd, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_kills"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_kills"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Deaths</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_death"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_death"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Assists</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_killassists"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_killassists"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Win %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpWinnloss, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Wins</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_matchwon"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_matchwon"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Losses</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_matchlost"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_matchlost"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Time Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo $overallTimePlayedHMS["h"] . "h " . $overallTimePlayedHMS["m"] . "m" ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Headshot %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpHeadshotRatio * 100, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Headshots</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_headshot"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_headshot"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Penetration %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpPenetrationRatio * 100, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Penetration Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_penetrationkills"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_penetrationkills"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="gamemode-stats">
                                <div class="ranked-stats">
                                    <div class="def-stats-2col">
                                        <div class="def-header">
                                            <p>Ranked Statistics</p>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Time Played</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo $generalRankedTimePlayedHMS["h"] . "h " . $generalRankedTimePlayedHMS["m"] . "m" ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Matches Played</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["rankedpvp_matchplayed"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["rankedpvp_matchplayed"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Ranked K/D</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo number_format($generalRankedKd, 2, '.', '') ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Win %</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo number_format($generalRankedWinnloss, 2, '.', '') ?>%
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Kills</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["rankedpvp_kills"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["rankedpvp_kills"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Deaths</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["rankedpvp_death"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["rankedpvp_death"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="casual-stats">
                                    <div class="def-stats-2col">
                                        <div class="def-header">
                                            <p>Casual Statistics</p>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Time Played</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo $generalCasualTimePlayedHMS["h"] . "h " . $generalCasualTimePlayedHMS["m"] . "m" ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Matches Played</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["casualpvp_matchplayed"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["casualpvp_matchplayed"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Casual K/D</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo number_format($generalCasualKd, 2, '.', '') ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Win %</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php echo number_format($generalCasualWinnloss, 2, '.', '') ?>%
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Kills</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["casualpvp_kills"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["casualpvp_kills"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="def-stat-2col">
                                            <div class="def-stat-name">
                                                <p>Deaths</p>
                                            </div>
                                            <div class="def-stat-value">
                                                <p>
                                                    <?php if (empty($getUser["casualpvp_death"])) { ?>
                                                        0
                                                    <?php } else {
                                                        echo $getUser["casualpvp_death"];
                                                    } ?>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pvp-stats">
                    <div class="content">
                        <div class="left-content">
                            <div class="top-content-box">
                                <div class="def-stats-2col ranked-stats">
                                    <div class="def-header ranked-head">
                                        <p>Ranked Statistics</p>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Time Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo $generalRankedTimePlayedHMS["h"] . "h" . $generalRankedTimePlayedHMS['m'] . "m" ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['rankedpvp_matchplayed'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['rankedpvp_matchplayed'];
                                                } ?></p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Ranked K/D</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo  number_format($generalRankedKd, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Win %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalRankedWinnloss, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['rankedpvp_kills'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['rankedpvp_kills'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Deaths</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['rankedpvp_death'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['rankedpvp_death'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches Won</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['rankedpvp_matchwon'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['rankedpvp_matchwon'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches lost</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['rankedpvp_matchlost'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['rankedpvp_matchlost'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="def-stats-2col casual-stats">
                                    <div class="def-header casual-head">
                                        <p>Casual Statistics</p>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Time Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo $generalCasualTimePlayedHMS["h"] . "h" . $generalCasualTimePlayedHMS['m'] . "m" ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['casualpvp_matchplayed'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['casualpvp_matchplayed'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Ranked K/D</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalCasualKd, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Win %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalCasualWinnloss, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['casualpvp_kills'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['casualpvp_kills'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Deaths</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['casualpvp_death'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['casualpvp_death'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches Won</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['casualpvp_matchwon'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['casualpvp_matchwon'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-2col">
                                        <div class="def-stat-name">
                                            <p>Matches lost</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser['casualpvp_matchlost'])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser['casualpvp_matchlost'];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="overview-stats">
                                <div class="def-stats-4col">
                                    <div class="def-header">
                                        <p>General Statistics</p>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>General K/D</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpKd, 2, '.', '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_kills"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_kills"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Deaths</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_death"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_death"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Assists</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_killassists"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_killassists"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Win %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpWinnloss, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Wins</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_matchwon"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_matchwon"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Losses</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_matchlost"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_matchlost"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Time Played</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo $overallTimePlayedHMS["h"] . "h " . $overallTimePlayedHMS["m"] . "m" ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Headshot %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpHeadshotRatio * 100, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Headshots</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_headshot"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_headshot"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Penetration %</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php echo number_format($generalPvpPenetrationRatio * 100, 2, '.', '') ?>%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="def-stat-4col">
                                        <div class="def-stat-name">
                                            <p>Penetration Kills</p>
                                        </div>
                                        <div class="def-stat-value">
                                            <p>
                                                <?php if (empty($getUser["generalpvp_penetrationkills"])) { ?>
                                                    0
                                                <?php } else {
                                                    echo $getUser["generalpvp_penetrationkills"];
                                                } ?>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right-content">
                            <div class="def-stats-1col">
                                <div class="def-header">
                                    <p>Player Statistics</p>
                                </div>
                                <div class="def-stat-1col">
                                    <div class="def-stat-name">
                                        <p>Distance travelled</p>
                                    </div>
                                    <div class="def-stat-value">
                                        <p>
                                            <?php if (empty($getUser['generalpvp_distancetravelled'])) {?>
                                                0
                                            <?php } else {
                                                echo number_format($getUser['generalpvp_distancetravelled'], 0, '.', ' ');
                                            } ?>m
                                        </p>
                                    </div>
                                </div>
                                <div class="def-stat-1col">
                                    <div class="def-stat-name">
                                        <p>Rappel breaches</p>
                                    </div>
                                    <div class="def-stat-value">
                                        <p>
                                            <?php if (empty($getUser['generalpvp_rappelbreach'])) {?>
                                                0
                                            <?php } else {
                                                echo $getUser['generalpvp_rappelbreach'];
                                            } ?>
                                        </p>
                                    </div>
                                </div>
                                <div class="def-stat-1col">
                                    <div class="def-stat-name">
                                        <p>Barricades deployed</p>
                                    </div>
                                    <div class="def-stat-value">
                                        <p>
                                            <?php if (empty($getUser['generalpvp_barricadedeployed'])) {?>
                                                0
                                            <?php } else {
                                                echo $getUser['generalpvp_barricadedeployed'];
                                            } ?>
                                        </p>
                                    </div>
                                </div>
                                <div class="def-stat-1col">
                                    <div class="def-stat-name">
                                        <p>Reinforcements deployed</p>
                                    </div>
                                    <div class="def-stat-value">
                                        <p>
                                            <?php if (empty($getUser['generalpvp_reinforcementdeploy'])) {?>
                                                0
                                            <?php } else {
                                                echo $getUser['generalpvp_reinforcementdeploy'];
                                            } ?>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pve-stats">

                </div>
            </div>
            <div class="season-stats" id="season-stats">
                <?php foreach ($seasons as $season) {?>
                    <div class="current-season-detailed">
                        <div class="current-rank-img">
                            <img src="<?php echo $getUser[$season]['rankInfo']['image'] ?>" alt="rank image">
                        </div>
                        <div class="current-rank-info">
                            <p class="current-season-mmr">
                                <?php echo $getUser[$season]['mmr'] ?>
                                <span><?php echo $getUser[$season]['rankInfo']['name'] ?></span>
                            </p>
                            <p class="current-season-kd">
                                <?php echo round($getUser[$season]['kills']/$getUser[$season]['deaths'], 2) ?>
                                <span> K/D</span>
                            </p>
                        </div>
                    </div>
                <?php } ?>
            </div>
            <div class="operator-stats" id="operator-stats">

            </div>
            <div class="weapon-stats" id="weapon-stats">

            </div>
        </div>
    </div>
    <?php include('phptemplates/footer.html'); ?>
    <?php include('phptemplates/cookieAlert.html'); ?>

    <!-- PHP Variable to JS -->
    <script type="text/javascript">
        var valHacker = '<?php echo $sumHacker ?>';
        var valLootbox = '<?php echo round($getUser["lootbox_probability"] / 100) ?>';
        var valCustBack = '<?php echo $rowcust[0] ?>';
        var valCustMes = '<?php echo $rowcust[1] ?>';
        var valCustCol = '<?php echo $rowcust[2] ?>';
        var valCustNameURL = '<?php echo $rowcust[3] ?>';
        var valCustURL = '<?php echo $rowcust[4] ?>';
    </script>
    <!-- JS Scripts -->
    <script src="https://www.r6lookup.com/dist/js/searchBar.js"></script>
    <script src="https://www.r6lookup.com/dist/js/cookiealert.js"></script>
    <script src="https://www.r6lookup.com/dist/js/hackerBar.js"></script>
    <script src="https://www.r6lookup.com/dist/js/lootboxBarPlayer.js"></script>
    <script src="https://www.r6lookup.com/dist/js/copyId.js"></script>
    <script src="https://www.r6lookup.com/dist/js/customize.js"></script>
    <script src="https://www.r6lookup.com/dist/js/stat-nav-selected.js"></script>
</body>
</html>
