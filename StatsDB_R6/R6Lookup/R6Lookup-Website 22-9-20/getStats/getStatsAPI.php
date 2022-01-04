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
$su = $uapi->getAPIStats($uid, $platform, $stats);

// Get General Pvp PenetrationRatio
if ($su["generalpvp_kills"] != 0) {
    $generalPvpPenetrationRatio = round($su["generalpvp_penetrationkills"] / $su["generalpvp_kills"], 4);
}
// Get General Pvp Headshotratio
if ($su["generalpvp_kills"] != 0) {
    $generalPvpHeadshotRatio = round($su["generalpvp_headshot"] / $su["generalpvp_kills"], 4);
} else {
    $generalPvpHeadshotRatio = 0;
}

// GENERAL RANKED STATS
// Get General Ranked KD
if ($su["rankedpvp_death"] != 0) {
    $generalRankedKd = round($su['rankedpvp_kills'] / $su['rankedpvp_death'], 2);
} else {
    $generalRankedKd = 0;
}
// Get General Ranked Winnrate
if (($su['rankedpvp_matchwon'] + $su['rankedpvp_matchlost']) != 0) {
    $generalRankedWinloss = round($su['rankedpvp_matchwon'] / ($su['rankedpvp_matchwon'] + $su['rankedpvp_matchlost']) * 100, 2);
} else {
    $generalRankedWinloss = 0;
}

// GENERAL CASUAL STATS
// Get General Casual KD
if ($su["casualpvp_death"] != 0) {
    $generalCasualKd = round($su['casualpvp_kills'] / $su['casualpvp_death'], 2);
} else {
    $generalCasualKd = 0;
}
// Get General Casual Winnrate
if (($su['casualpvp_matchwon'] + $su['casualpvp_matchlost']) != 0) {
    $generalCasualWinloss = round($su['casualpvp_matchwon'] / ($su['casualpvp_matchwon'] + $su['casualpvp_matchlost']) * 100, 2);
} else {
    $generalCasualWinloss = 0;
}

// GENERAL SEASONAL STATS
// Get General Seasonal KD
if ($su["deaths"] != 0) {
    $generalSeasonalKd = round($su['kills'] / $su['deaths'], 2);
} else {
    $generalSeasonalKd = 0;
}
// Get General Seasonal Winnrate
if (($su['wins'] + $su['losses']) != 0) {
    $generalSeasonalWinloss = round($su['wins'] / ($su['wins'] + $su['losses']) * 100, 2);
} else {
    $generalSeasonalWinloss = 0;
}

if (($generalPvpHeadshotRatio >= 0.56 || $generalPvpPenetrationRatio >= 0.11) && $su["level"] <= 182) {
    include $_SERVER['DOCUMENT_ROOT'] . '/phptemplates/hacker.php';
} else {
    $sumHacker = 0;
}

$rankInfo = $ranks[$su["rank"]];
$su["rankInfo"] = $rankInfo;

if ($su["rank"] == 0) {
    $nextRank = $su["rank"];
} elseif ($su["rank"] == 23) {
    $nextRank = $su["rank"];
} else {
    $nextRank = $su["rank"] + 1;
}

$nextRankInfo = $ranks[$nextRank];
$su["nextRankInfo"] = $nextRankInfo;

$su["maxRankInfo"] = $ranks[$su["max_rank"]];

$season = $su["season"];
$su["seasonName"] = $seasonsName[$season];

$su['generalpvp_penetrationratio'] = $generalPvpPenetrationRatio;
$su['generalpvp_headshotratio'] = $generalPvpHeadshotRatio;
$su['rankedpvp_winloss'] = $generalRankedWinloss;
$su['rankedpvp_kd'] = $generalRankedKd;
$su['casualpvp_winloss'] = $generalCasualWinloss;
$su['casualpvp_kd'] = $generalCasualKd;
$su['seasonalpvp_winloss'] = $generalSeasonalWinloss;
$su['seasonalpvp_kd'] = $generalSeasonalKd;
$su['hacker_percentage'] = $sumHacker;

$su = json_encode($su, JSON_PRETTY_PRINT);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

echo $su;
