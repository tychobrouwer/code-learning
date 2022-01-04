<?php
    // Get Get Request Username an Platfrom
    $nameInput = htmlspecialchars($_POST['username']);
    $platform = htmlspecialchars($_POST['platform']);

    // Get Userdata From Ubisoft
    $getUser = json_decode(file_get_contents("https://www.r6lookup.com/getStats/getStatsIndex.php?name=$nameInput&platform=$platform&region=$region&appcode=809965"), true);

if (!empty($getUser) && !array_key_exists("error", $getUser)) {
    // GENERAL PVP STATS
    // Get General Pvp PenetrationRatio
    if ($getUser["generalpvp_kills"] != 0) {
        $generalPvpPenetrationRatio = round($getUser["generalpvp_penetrationkills"]/$getUser["generalpvp_kills"], 2);
    }
    // Get General Pvp Headshotratio
    if ($getUser["generalpvp_kills"] != 0) {
        $generalPvpHeadshotRatio = round($getUser["generalpvp_headshot"]/$getUser["generalpvp_kills"], 2);
    } else {
        $generalPvpHeadshotRatio = 0;
    }

    // GENERAL RANKED STATS
    // Get General Ranked KD
    if ($getUser['rankedpvp_death'] != 0) {
        $generalRankedKd = round($getUser['rankedpvp_kills']/$getUser['rankedpvp_death'], 2);
    } else {
        $generalRankedKd = 0;
    }
    // Get General Ranked Winnrate
    if (($getUser['rankedpvp_matchwon'] + $getUser['rankedpvp_matchlost']) != 0) {
        $generalRankedWinnloss = round($getUser['rankedpvp_matchwon'] / ($getUser['rankedpvp_matchwon'] + $getUser['rankedpvp_matchlost']) * 100, 2);
    } else {
        $generalRankedWinnloss = 0;
    }
}
