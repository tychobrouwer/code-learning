<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

include $_SERVER['DOCUMENT_ROOT'] . "/getStats/UbiAPItest.php";

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);

$uid = htmlspecialchars($_GET["id"]);

if (htmlspecialchars($_GET['platform'])) {
    $platform = htmlspecialchars($_GET['platform']);
} else {
    $platform = $config["default-platform"];
}

if (strlen($uid) > 30) {
    $mode = 2;
} else {
    $mode = 1;
}

////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsIndex($mode, $uid, $platform, $config["index-stats"]);

// $rankInfo = $ranks[$su[$su["profileId"]]["rank"]];
// array_push($su[$su["profileId"]], $rankInfo);

header('Content-type: Application/JSON');
header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

print json_encode($su, JSON_PRETTY_PRINT);
