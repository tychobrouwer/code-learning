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

$su = $uapi->getPanelStats($_GET["resultSavedUsers"], $_GET["resultVotedHackers"], $_GET["resultLatestHackers"], $config["panel-stats"]);

foreach ($su["savedUsers"] as $savedUserName => $savedUser) {
    $rankInfo = $ranks[$savedUser["ranked"]["rank"]];
    $su["savedUsers"][$savedUserName]["ranked"]["rankInfo"] = $rankInfo;

    if ($savedUser["ranked"]["rank"] == 0) {
        $nextRank = $savedUser["ranked"]["rank"];
    } elseif ($savedUser["ranked"]["rank"] == 23) {
        $nextRank = $savedUser["ranked"]["rank"];
    } else {
        $nextRank = $savedUser["ranked"]["rank"] + 1;
    }

    $nextRankInfo = $ranks[$nextRank];
    $su["savedUsers"][$savedUserName]["ranked"]["nextRankInfo"] = $nextRankInfo;
    $su["savedUsers"][$savedUserName]["ranked"]["maxRankInfo"] = $ranks[$savedUser["ranked"]["max_rank"]];

    // KD savedUsers
    if ($savedUser['rankedpvp_kills'] + $savedUser['rankedpvp_death'] != 0) {
        $su["savedUsers"][$savedUserName]["rankedpvp_kd"] = number_format(round($savedUser['rankedpvp_kills'] / $savedUser['rankedpvp_death'], 2), 2, '.', '');
    } else {
        $su["savedUsers"][$savedUserName]["rankedpvp_kd"] = "0.00";
    }
    // W/L savedUsers
    if ($savedUser['rankedpvp_matchwon'] != 0) {
        $su["savedUsers"][$savedUserName]["rankedpvp_wl"] = number_format(round($savedUser['rankedpvp_matchwon'] / ($savedUser['rankedpvp_matchwon'] + $savedUser['rankedpvp_matchlost']) * 100, 2), 2, '.', '');
    } else {
        $su["savedUsers"][$savedUserName]["rankedpvp_wl"] = "0.00";
    }
    // KD savedUsers Ranked
    if ($savedUser['ranked']['kills'] + $savedUser['ranked']['deaths'] != 0) {
        $su["savedUsers"][$savedUserName]["seasonal_rankedpvp_kd"] = number_format(round($savedUser['ranked']['kills'] / $savedUser['ranked']['deaths'], 2), 2, '.', '');
    } else {
        $su["savedUsers"][$savedUserName]["seasonal_rankedpvp_kd"] = "0.00";
    }
    // W/L savedUsers Ranked
    if ($savedUser['ranked']['wins'] != 0) {
        $su["savedUsers"][$savedUserName]["seasonal_rankedpvp_wl"] = number_format(round($savedUser['ranked']['wins'] / ($savedUser['ranked']['wins'] + $savedUser['ranked']['losses']) * 100, 2), 2, '.', '');
    } else {
        $su["savedUsers"][$savedUserName]["seasonal_rankedpvp_wl"] = "0.00";
    }
}

foreach ($su["votedHackers"] as $votedHackerName => $votedHacker) {
    $rankInfo = $ranks[$votedHacker["ranked"]["rank"]];
    $su["votedHackers"][$votedHackerName]["ranked"]["rankInfo"] = $rankInfo;

    if ($votedHacker["ranked"]["rank"] == 0) {
        $nextRank = $votedHacker["ranked"]["rank"];
    } elseif ($votedHacker["ranked"]["rank"] == 23) {
        $nextRank = $votedHacker["ranked"]["rank"];
    } else {
        $nextRank = $votedHacker["ranked"]["rank"] + 1;
    }

    $nextRankInfo = $ranks[$nextRank];
    $su["votedHackers"][$votedHackerName]["ranked"]["nextRankInfo"] = $nextRankInfo;
    $su["votedHackers"][$votedHackerName]["ranked"]["maxRankInfo"] = $ranks[$votedHacker["ranked"]["max_rank"]];

    // KD votedHackers
    if ($votedHacker['rankedpvp_kills'] + $votedHacker['rankedpvp_death'] != 0) {
        $su["votedHackers"][$votedHackerName]["rankedpvp_kd"] = number_format(round($votedHacker['rankedpvp_kills'] / $votedHacker['rankedpvp_death'], 2), 2, '.', '');
    } else {
        $su["votedHackers"][$votedHackerName]["rankedpvp_kd"] = "0.00";
    }
    // W/L votedHackers
    if ($votedHacker['rankedpvp_matchwon'] != 0) {
        $su["votedHackers"][$votedHackerName]["rankedpvp_wl"] = number_format(round($votedHacker['rankedpvp_matchwon'] / ($votedHacker['rankedpvp_matchwon'] + $votedHacker['rankedpvp_matchlost']) * 100, 2), 2, '.', '');
    } else {
        $su["votedHackers"][$votedHackerName]["rankedpvp_wl"] = "0.00";
    }
    // KD votedHackers Ranked
    if ($votedHacker['ranked']['kills'] + $votedHacker['ranked']['deaths'] != 0) {
        $su["votedHackers"][$votedHackerName]["seasonal_rankedpvp_kd"] = number_format(round($votedHacker['ranked']['kills'] / $votedHacker['ranked']['deaths'], 2), 2, '.', '');
    } else {
        $su["votedHackers"][$votedHackerName]["seasonal_rankedpvp_kd"] = "0.00";
    }
    // W/L votedHackers Ranked
    if ($votedHacker['ranked']['wins'] != 0) {
        $su["votedHackers"][$votedHackerName]["seasonal_rankedpvp_wl"] = number_format(round($votedHacker['ranked']['wins'] / ($votedHacker['ranked']['wins'] + $votedHacker['ranked']['losses']) * 100, 2), 2, '.', '');
    } else {
        $su["votedHackers"][$votedHackerName]["seasonal_rankedpvp_wl"] = "0.00";
    }
}

print json_encode($su);
