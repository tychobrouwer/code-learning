<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . '/getStats/config.php';
include $_SERVER['DOCUMENT_ROOT'] . '/getStats/utils.php';

if (empty(htmlspecialchars($_GET['appcode']))) {
    print 'ERROR: Wrong appcode';
    die();
}

if (htmlspecialchars($_GET['appcode']) != $config['appcode']) {
    print 'ERROR: Wrong appcode';
    die();
}

include $_SERVER['DOCUMENT_ROOT'] . '/getStats/UbiAPI.php';

$uapi = new UbiAPI($config['ubi-email'], $config['ubi-password']);

$platform = htmlspecialchars($_GET['platform']);
$stats = $config['player-stats'];
$uid = htmlspecialchars($_GET['id']);
$region = htmlspecialchars($_GET['region']);
$season = 1;
if (strlen($uid) > 30) {
    $mode = 2;
} else {
    $mode = 1;
}

//////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsPlayer($mode, $uid, $platform, $region, $stats);

foreach ($playerStats as $playerStat) {
    if (!array_key_exists($playerStat, $su)) {
        $su[$playerStat] = 0;
    }
}

foreach ($su['seasons'] as $season_num => $season) {
    $season = $season['regions_player_skill_records'][0]['boards_player_skill_records'][0]['players_skill_records'][0];

    if ($season['season'] <= 14) {
        $rankInfo = $oldranks[$season['rank']];
        $season['rankInfo'] = $rankInfo;

        if ($season['rank'] == 0) {
            $nextRank = $season['rank'];
        } elseif ($season['rank'] == 20) {
            $nextRank = $season['rank'];
        } else {
            $nextRank = $season['rank'] + 1;
        }

        $nextRankInfo = $oldranks[$nextRank];
        $season['nextRankInfo'] = $nextRankInfo;
        $season['maxRankInfo'] = $oldranks[$season['max_rank']];
    } else {
        $rankInfo = $ranks[$season['rank']];
        $season['rankInfo'] = $rankInfo;

        if ($season['rank'] == 0) {
            $nextRank = $season['rank'];
        } elseif ($season['rank'] == 23) {
            $nextRank = $season['rank'];
        } else {
            $nextRank = $season['rank'] + 1;
        }

        $nextRankInfo = $ranks[$nextRank];
        $season['nextRankInfo'] = $nextRankInfo;
        $season['maxRankInfo'] = $ranks[$season['max_rank']];
    }

    $season['seasonName'] = $seasonsName[$season['season']];

    $su['seasons'][$season_num] = $season;
}

//////////////////////////////////////////////////////////////////////////
foreach ($su['operators'] as $operatorType => $value) {
    foreach ($value as $operatorId => $operator) {
        $operator['info']['images']['badge'] = '/dist/img/operators/badge/' . $operator['statsDetail'];
        $operator["info"]["images"]["figure"] = "/dist/img/operators/figure/" . $operator["statsDetail"];
        $operator["organisation"] = $operatorStats[$operator["statsDetail"]]["organisation"];

        $su['operators'][$operatorType][$operatorId] = $operator;
    }
}

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
$weaponFinal = array();
foreach ($su['weapons'] as $weaponSlotName => $weaponSlot) {
    foreach ($weaponSlot['weaponTypes'] as $weaponTypeId => $weaponType) {
        foreach ($weaponType['weapons'] as $weaponId => $weapon) {
            $weaponFinal[$weapon['weaponName']] = $weapon;
            $weaponFinal[$weapon['weaponName']]['weapontype'] = $weaponType['weaponType'];
            $weaponFinal[$weapon['weaponName']]['weaponSlot'] = $weaponSlotName;
        }
    }
}
$su['weapons'] = $weaponFinal;

//////////////////////////////////////////////////////////////////////////

// print("<pre>".print_r($su, true)."</pre>");

header('Content-type: Application/JSON');
header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

print json_encode($su, JSON_PRETTY_PRINT);
