<?php
include "config.php";
include "utils.php";

if (empty(htmlspecialchars($_GET["appcode"]))) {
    print "ERROR: Wrong appcode";
    die();
}

if (htmlspecialchars($_GET["appcode"]) != $config["appcode"]) {
    print "ERROR: Wrong appcode";
    die();
}

include "UbiAPI.php";

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);

$platform = htmlspecialchars($_GET['platform']);
$stats = $config["player-stats"];
$uid = htmlspecialchars($_GET["id"]);
$region = htmlspecialchars($_GET['region']);
$season = 1;
$notFound = [];
if (strlen($uid) > 30) {
    $mode = 2;
} else {
    $mode = 1;
}

//////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsPlayer($mode, $uid, $platform, $season, $region, $stats);

foreach ($playerStats as $playerStat) {
    if (!array_key_exists($playerStat, $su)) {
        $su[$playerStat] = 0;
    }
}

foreach ($seasonsNum as $season_num) {
    if ($su[$season_num]["season"] <= 14) {
        $rankInfo = $oldranks[$su[$season_num]["rank"]];
        $su[$season_num]["rankInfo"] = $rankInfo;

        if ($su[$season_num]["rank"] == 0) {
            $nextRank = $su[$season_num]["rank"];
        } elseif ($su[$season_num]["rank"] == 20) {
            $nextRank = $su[$season_num]["rank"];
        } else {
            $nextRank = $su[$season_num]["rank"] + 1;
        }

        $nextRankInfo = $oldranks[$nextRank];
        $su[$season_num]["nextRankInfo"] = $nextRankInfo;
        $su[$season_num]["maxRankInfo"] = $oldranks[$su[$season_num]["max_rank"]];
    } else {
        $rankInfo = $ranks[$su[$season_num]["rank"]];
        $su[$season_num]["rankInfo"] = $rankInfo;

        if ($su[$season_num]["rank"] == 0) {
            $nextRank = $su[$season_num]["rank"];
        } elseif ($su[$season_num]["rank"] == 23) {
            $nextRank = $su[$season_num]["rank"];
        } else {
            $nextRank = $su[$season_num]["rank"] + 1;
        }

        $nextRankInfo = $ranks[$nextRank];
        $su[$season_num]["nextRankInfo"] = $nextRankInfo;
        $su[$season_num]["maxRankInfo"] = $ranks[$su[$season_num]["max_rank"]];
    }

    $season = $su[$season_num]["season"];
    $su[$season_num]["seasonName"] = $seasonsName[$season];
}

//////////////////////////////////////////////////////////////////////////
$operators = getOperatorList();
$operatorStatsRaw = $su["operators"]["stats_raw"];
$operatorsFinal = array();
foreach ($operators as $operator) {
    $operatorsFinal[$operator["id"]]["info"] = $operator;
    $operatorsFinal[$operator["id"]]["info"]["images"]["badge"] = "/dist/img/operators/" . $operator["id"];
    $operatorsFinal[$operator["id"]]["name"] = $operatorStats[$operator["id"]]["name"];
    $operatorsFinal[$operator["id"]]["organisation"] = $operatorStats[$operator["id"]]["organisation"];

    foreach ($normalStats as $normalStat) {
        $operatorsFinal[$operator["id"]][$normalStat] = 0;
    }

    foreach ($operatorStats[$operator["id"]] as $key => $value) {
        if (!isset($operatorsFinal[$operator["id"]][$key])) {
            $operatorsFinal[$operator["id"]]["operator_stat"]["pvp"][$key] = 0;
            $operatorsFinal[$operator["id"]]["operator_stat"]["keys"][$key] = $value;
        }
    }
}
foreach ($operatorStatsRaw as $key => $value) {
    $id = explode(":", $key);
    $statName = $id[0];
    $index = $id[1] . ":" . $id[2];
    $operatorInfo = $operators[$index];
    $operatorName = $operatorInfo["id"];

    if (!empty($operatorName)) {
        if (!in_array($statName, $normalStats)) {
            $operatorsFinal[$operatorName]["operator_stat"]["pvp"][$statName] = $value;
        } else {
            $operatorsFinal[$operatorName][$statName] = $value;
        }
    }
}
$su['operators'] = $operatorsFinal;

//////////////////////////////////////////////////////////////////////////
$weaponTypeStatsRaw = $su["weapontype"]["stats_raw"];
$weaponTypeFinal = array();
foreach ($weaponTypeStatsRaw as $weaponTypeStatRaw => $value) {
    $id = explode(":", $weaponTypeStatRaw);
    $index = $id[1];

    $weaponType = $weaponTypes[$index][0];
    $weaponTypeName = $weaponTypes[$index][1];

    $weaponTypeFinal[$weaponType]["weapon_type_name"] = $weaponTypeName;
    $weaponTypeFinal[$weaponType]["weapon_type"] = $weaponType;
    $weaponTypeFinal[$weaponType][$id[0]] = $value;
}
foreach ($weaponTypes as $weaponType) {
    foreach ($normalWeaponTypeStats as $normalWeaponTypeStat) {
        if (!isset($weaponTypeFinal[$weaponType[0]][$normalWeaponTypeStat])) {
            $weaponTypeFinal[$weaponType[0]][$normalWeaponTypeStat] = 0;
        }
    }

    if (!isset($weaponTypeFinal[$weaponType[0]]["weapon_type_name"])) {
        $weaponTypeFinal[$weaponType[0]]["weapon_type_name"] = $weaponType[1];
        $weaponTypeFinal[$weaponType[0]]["weapon_type"] = $weaponType[0];
    }
}
$su['weapontype'] = $weaponTypeFinal;

//////////////////////////////////////////////////////////////////////////
$weaponStatsRaw = $su["weapon"]["stats_raw"];
$weaponFinal = array();
foreach ($weaponStatsRaw as $weaponStatRaw => $value) {
    $id = explode(":", $weaponStatRaw);
    $index = $id[1];

    $weapon = $weapons[$index][0];
    $weaponName = $weapons[$index][1];
    $weaponType = $weapons[$index][2];

    $weaponFinal[$weapon]["weapon_name"] = $weaponName;
    $weaponFinal[$weapon]["weapon_type"] = $weaponType;
    $weaponFinal[$weapon]["weapon_code"] = $index;
    $weaponFinal[$weapon][$id[0]] = $value;
}
foreach ($weapons as $key => $weapon) {
    foreach ($normalWeaponStats as $normalWeaponStat) {
        if (!isset($weaponFinal[$weapon[0]][$normalWeaponStat])) {
            $weaponFinal[$weapon[0]][$normalWeaponStat] = 0;
        }
    }

    if (!isset($weaponFinal[$weapon[0]]["weapon_name"])) {
        $weaponFinal[$weapon[0]]["weapon_name"] = $weapon[1];
        $weaponFinal[$weapon[0]]["weapon_type"] = $weapon[2];
        $weaponFinal[$weapon[0]]["weapon_code"] = $key;
    }
}
$su["weapon"] = $weaponFinal;

//////////////////////////////////////////////////////////////////////////
print json_encode($su);
