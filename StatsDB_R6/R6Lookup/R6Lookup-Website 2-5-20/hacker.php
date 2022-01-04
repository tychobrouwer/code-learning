<?php
$sumHacker = 0;
$sumHackerKd = 0;
$sumHackerPR = 0;
$sumHackerWL = 0;
$sumHackerHKR = 0;
$sumHackerLevel = 0;

// High K/D might indicate hacker
if ($getUser["level"] <= 150 && $getUser["rankedpvp_kills"] > 55) {
    if ($generalRankedKd >= 4.0) {
        $sumHackerKd += 20;
    } elseif ($generalRankedKd >= 3.0) {
        $sumHackerKd += 15;
    } elseif ($generalRankedKd >= 2.0) {
        $sumHackerKd += 10;
    } elseif ($generalRankedKd >= 1.6) {
        $sumHackerKd += 5;
    }
}

// Hight Penetration ratio might indicate hackers
if ($getUser["level"] <= 150 && $generalRankedKd > 1.3 && $getUser["generalpvp_kills"] > 100) {
    if ($generalPvpPenetrationRatio >= 0.25) {
        $sumHackerPR += 25;
    } elseif ($generalPvpPenetrationRatio >= 0.2) {
        $sumHackerPR += 20;
    } elseif ($generalPvpPenetrationRatio >= 0.18) {
        $sumHackerPR += 17;
    } elseif ($generalPvpPenetrationRatio > 0.15) {
        $sumHackerPR += 13;
    } elseif ($generalPvpPenetrationRatio > 0.13) {
        $sumHackerPR += 8;
    }
}
// Headshoot to kill ratio, most hackers use aimbot.
if ($getUser["generalpvp_kills"] > 50) {
    if ($generalPvpHeadshotRatio >= 0.8) {
        $sumHackerHKR += 25;
    } elseif ($generalPvpHeadshotRatio >= 0.70) {
        $sumHackerHKR += 20;
    } elseif ($generalPvpHeadshotRatio >= 0.55) {
        $sumHackerHKR += 15;
    }
}

// Win/Loss ratio since most hackers have a high win/loss
if ($getUser["level"] <= 150 && $getUser["rankedpvp_matchwon"] > 20) {
    if ($generalRankedWinnloss >= 83) {
        $sumHackerWL += 23;
    } elseif ($generalRankedWinnloss >= 75) {
        $sumHackerWL += 17;
    } elseif ($generalRankedWinnloss >= 60) {
          $sumHackerWL += 7;
    }
}

// Level for hackers. Most hackers have low lvl accounts
if ($getUser[0]["mmr"] > 3000 || $generalPvpPenetrationRatio > 0.15) {
    if ($getUser["level"] <= 40) {
        $sumHackerLevel += 5;
    } elseif ($getUser["level"] <= 60) {
        $sumHackerLevel += 4;
    } elseif ($getUser["level"] <= 100) {
        $sumHackerLevel += 3;
    }
}

$sumHacker = $sumHackerWL + $sumHackerKd + $sumHackerPR + $sumHackerHKR + $sumHackerLevel;
$print = [
    "stats" => [
        "Level" => $getUser["level"],
        "MMR" => $getUser[0]["mmr"],
        "Kills" => $getUser["generalpvp_kills"],
        "Ranked K/D" => $generalRankedKd,
        "Penetration" => $generalPvpPenetrationRatio,
        "HS/Kill ratio" => $generalPvpHeadshotRatio,
        "W/L ratio" => $generalRankedWinnloss,
        "Ranked wins" => $getUser["rankedpvp_matchwon"],
    ],
    "points" => [
        "KD" => $sumHackerKd,
        "Penetration Ratio" => $sumHackerPR,
        "Headshot Ratio" => $sumHackerHKR,
        "Win Loss ratio" => $sumHackerWL,
        "Level" => $sumHackerLevel,
    ]
];
