<?php
include $_SERVER['DOCUMENT_ROOT'] . "/getStats/config.php";
include $_SERVER['DOCUMENT_ROOT'] . "/getStats/utils.php";

if (empty(htmlspecialchars($_GET["appcode"]))) {
    print "ERROR: Wrong appcode";
    die();
}

if (htmlspecialchars($_GET["appcode"]) != $config["appcode"]) {
    print "ERROR: Wrong appcode";
    die();
}

include $_SERVER['DOCUMENT_ROOT'] . "/getStats/UbiAPI.php";

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);

$uid = htmlspecialchars($_GET["username"]);
$platform = htmlspecialchars($_GET['platform']);
$stats = $config["API-stats"];

//////////////////////////////////////////////////////////////////////////
$getUser = $uapi->getAPIStats($uid, $platform, $stats);

// Get General Pvp PenetrationRatio
if ($getUser["generalpvp_kills"] != 0) {
    $generalPvpPenetrationRatio = round($getUser["generalpvp_penetrationkills"] / $getUser["generalpvp_kills"], 4);
}
// Get General Pvp Headshotratio
if ($getUser["generalpvp_kills"] != 0) {
    $generalPvpHeadshotRatio = round($getUser["generalpvp_headshot"] / $getUser["generalpvp_kills"], 4);
} else {
    $generalPvpHeadshotRatio = 0;
}

// GENERAL RANKED STATS
// Get General Ranked KD
if ($getUser["rankedpvp_death"] != 0) {
    $generalRankedKd = round($getUser['rankedpvp_kills'] / $getUser['rankedpvp_death'], 2);
} else {
    $generalRankedKd = 0;
}
// Get General Ranked Winnrate
if (($getUser['rankedpvp_matchwon'] + $getUser['rankedpvp_matchlost']) != 0) {
    $generalRankedWinloss = round($getUser['rankedpvp_matchwon'] / ($getUser['rankedpvp_matchwon'] + $getUser['rankedpvp_matchlost']) * 100, 2);
} else {
    $generalRankedWinloss = 0;
}

// GENERAL CASUAL STATS
// Get General Casual KD
if ($getUser["casualpvp_death"] != 0) {
    $generalCasualKd = round($getUser['casualpvp_kills'] / $getUser['casualpvp_death'], 2);
} else {
    $generalCasualKd = 0;
}
// Get General Casual Winnrate
if (($getUser['casualpvp_matchwon'] + $getUser['casualpvp_matchlost']) != 0) {
    $generalCasualWinloss = round($getUser['casualpvp_matchwon'] / ($getUser['casualpvp_matchwon'] + $getUser['casualpvp_matchlost']) * 100, 2);
} else {
    $generalCasualWinloss = 0;
}

// GENERAL SEASONAL STATS
// Get General Seasonal KD
if ($getUser["deaths"] != 0) {
    $generalSeasonalKd = round($getUser['kills'] / $getUser['deaths'], 2);
} else {
    $generalSeasonalKd = 0;
}
// Get General Seasonal Winnrate
if (($getUser['wins'] + $getUser['losses']) != 0) {
    $generalSeasonalWinloss = round($getUser['wins'] / ($getUser['wins'] + $getUser['losses']) * 100, 2);
} else {
    $generalSeasonalWinloss = 0;
}

// GENERAL STATS
// Get General KD
if ($getUser["generalpvp_death"] != 0) {
    $generalKd = round($getUser['generalpvp_kills'] / $getUser['generalpvp_death'], 2);
} else {
    $generalKd = 0;
}
// Get General Winnrate
if (($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) != 0) {
    $generalWinloss = round($getUser['generalpvp_matchwon'] / ($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) * 100, 2);
} else {
    $generalWinloss = 0;
}


if ((($generalPvpHeadshotRatio >= 0.56 && $generalPvpPenetrationRatio >= 0.075) || $generalPvpPenetrationRatio >= 0.11) && $su["level"] <= 182) {
    include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/hacker.php';
} else {
    $getUsermHacker = 0;
}

$rankInfo = $ranks[$getUser["rank"]];
$getUser["rankInfo"] = $rankInfo;

if ($getUser["rank"] == 0) {
    $nextRank = $getUser["rank"];
} elseif ($getUser["rank"] == 23) {
    $nextRank = $getUser["rank"];
} else {
    $nextRank = $getUser["rank"] + 1;
}

$nextRankInfo = $ranks[$nextRank];
$getUser["nextRankInfo"] = $nextRankInfo;

$getUser["maxRankInfo"] = $ranks[$getUser["max_rank"]];

$season = $getUser["season"];
$getUser["seasonName"] = $seasonsName[$season];

$getUser['generalpvp_penetrationratio'] = $generalPvpPenetrationRatio;
$getUser['generalpvp_headshotratio'] = $generalPvpHeadshotRatio;
$getUser['rankedpvp_winloss'] = $generalRankedWinloss;
$getUser['rankedpvp_kd'] = $generalRankedKd;
$getUser['casualpvp_winloss'] = $generalCasualWinloss;
$getUser['casualpvp_kd'] = $generalCasualKd;
$getUser['seasonalpvp_winloss'] = $generalSeasonalWinloss;
$getUser['seasonalpvp_kd'] = $generalSeasonalKd;
$getUser['generalpvp_winloss'] = $generalWinloss;
$getUser['generalpvp_kd'] = $generalKd;

if ($sumHacker === null) {
    $getUser['hacker_percentage'] = 0;
} else {
    $getUser['hacker_percentage'] = $sumHacker;
}

$getUser = json_encode($getUser, JSON_PRETTY_PRINT);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

echo $getUser;
