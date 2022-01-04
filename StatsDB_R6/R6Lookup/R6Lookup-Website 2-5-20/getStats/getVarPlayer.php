<?php

include 'phptemplates/timeConverter.php';

// Get Get Request Username an Platfrom
$idInput = htmlspecialchars($_GET['id']);
$platform = htmlspecialchars($_GET['platform']);

// Get Userdata From Ubisoft
$getUser = json_decode(file_get_contents("https://www.r6lookup.com/getStats/getStatsPlayer.php?id=$idInput&platform=$platform&region=$region&appcode=809965"), true);

if (!empty($getUser) && !array_key_exists("error", $getUser)) {
    // PLAYER DATA
    // Get display platform
    if ($platform == "uplay") {
        $displayPlatform = "PC";
    } elseif ($platform == "xbl") {
        $displayPlatform = "Xbox";
    } elseif ($platform == "psn") {
        $displayPlatform = "PSN";
    }

    // HMS TIME PLAYED
    // Get general pvp time played HMS
    $generalPvpTimePlayedHMS = timeConverterHMS($getUser["generalpvp_timeplayed"]);
    // Get general pve time played
    $generalPveTimePlayedHMS = timeConverterHMS($getUser["generalpve_timeplayed"]);
    // Get overall time Played in seconds
    $overallTimePlayed = $getUser["generalpvp_timeplayed"] + $getUser["generalpve_timeplayed"];
    // Get overall time Played in HMS
    $overallTimePlayedHMS = timeConverterHMS($overallTimePlayed);

    // DHMS TIME PLAYED
    $generalPvpTimePlayedDHMS = timeConverterDHMS($getUser["generalpvp_timeplayed"]);
    // Get general pve time played
    $generalPveTimePlayedDHMS = timeConverterDHMS($getUser["generalpve_timeplayed"]);
    // Get overall time Played in DHMS
    $overallTimePlayedDHMS = timeConverterDHMS($overallTimePlayed);

    // HMS GENERAL RANKED TIME PLAYED
    $generalRankedTimePlayedHMS = timeConverterHMS($getUser["rankedpvp_timeplayed"]);
    $generalRankedTimePlayedDHMS = timeConverterDHMS($getUser["rankedpvp_timeplayed"]);

    // HMS GENERAL CASUAL TIME PLAYED
    $generalCasualTimePlayedHMS = timeConverterHMS($getUser["casualpvp_timeplayed"]);
    $generalCasualTimePlayedDHMS = timeConverterDHMS($getUser["casualpvp_timeplayed"]);

    // GENERAL PVP STATS
    // Get General K/D
    if ($getUser["generalpvp_death"] + $getUser["generalpvp_kills"] != 0) {
        $generalPvpKd = round($getUser["generalpvp_kills"] / $getUser["generalpvp_death"], 2);
    } else {
        $generalPvpKd = 0;
    }
    // Get General Winnrate
    if (($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) != 0) {
        $generalPvpWinnloss = round($getUser['generalpvp_matchwon'] / ($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) * 100, 2);
    } else {
        $generalPvpWinnloss = 0;
    }
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
        $generalRankedWinnloss = round($getUser['rankedpvp_matchwon'] / ($getUser['rankedpvp_matchwon'] + $getUser['rankedpvp_matchlost']) * 100, 2);
    } else {
        $generalRankedWinnloss = 0;
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
        $generalCasualWinnloss = round($getUser['casualpvp_matchwon'] / ($getUser['casualpvp_matchwon'] + $getUser['casualpvp_matchlost']) * 100, 2);
    } else {
        $generalCasualWinnloss = 0;
    }
}
