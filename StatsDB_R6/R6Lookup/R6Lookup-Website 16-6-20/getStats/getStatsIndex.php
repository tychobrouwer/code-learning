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
$stats = $config["index-stats"];
$uid = htmlspecialchars($_GET["name"]);
$region = htmlspecialchars($_GET['region']);
$season = 1;
$notFound = [];
if (strlen($uid) > 30) {
    $mode = 2;
} else {
    $mode = 1;
}

//////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsIndex($mode, $uid, $platform, $season, $region, $stats);

$rankInfo = $ranks[$su[$su["profileId"]]["rank"]];
array_push($su[$su["profileId"]], $rankInfo);

print json_encode($su);
