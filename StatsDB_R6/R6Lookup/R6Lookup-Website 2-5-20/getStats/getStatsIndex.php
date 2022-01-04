<?php
include("config.php");

if (!isset($_GET["appcode"])) {
    print "ERROR: Wrong appcode";
    die();
}

if ($_GET["appcode"] != $config["appcode"]) {
    print "ERROR: Wrong appcode";
    die();
}

include("UbiAPI.php");

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);

$platform = $_GET['platform'];
$season = 1;
$stats = $config["index-stats"];
$region = $_GET['region'];
$uid = $_GET["name"];
// $mode = 1;
if (strlen($uid) > 30) {
    $mode = 2;
} else {
    $mode = 1;
}

//////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsIndex($mode, $uid, $platform, $season, $region, $stats);

$ranks = json_decode('{
  "0": {
    "image": "https://www.r6lookup.com/dist/img/ranks/unranked.svg",
    "name": "Unranked"
  },
  "1": {
    "image": "https://www.r6lookup.com/dist/img/ranks/copper5.svg",
    "name": "Copper V"
  },
  "2": {
    "image": "https://www.r6lookup.com/dist/img/ranks/copper4.svg",
    "name": "Copper IV"
  },
  "3": {
    "image": "https://www.r6lookup.com/dist/img/ranks/copper3.svg",
    "name": "Copper III"
  },
  "4": {
    "image": "https://www.r6lookup.com/dist/img/ranks/copper2.svg",
    "name": "Copper II"
  },
  "5": {
    "image": "https://www.r6lookup.com/dist/img/ranks/copper1.svg",
    "name": "Copper I"
  },
  "6": {
    "image": "https://www.r6lookup.com/dist/img/ranks/bronze5.svg",
    "name": "Bronze V"
  },
  "7": {
    "image": "https://www.r6lookup.com/dist/img/ranks/bronze4.svg",
    "name": "Bronze IV"
  },
  "8": {
    "image": "https://www.r6lookup.com/dist/img/ranks/bronze3.svg",
    "name": "Bronze III"
  },
  "9": {
    "image": "https://www.r6lookup.com/dist/img/ranks/bronze2.svg",
    "name": "Bronze II"
  },
  "10": {
    "image": "https://www.r6lookup.com/dist/img/ranks/bronze1.svg",
    "name": "Bronze I"
  },
  "11": {
    "image": "https://www.r6lookup.com/dist/img/ranks/silver5.svg",
    "name": "Silver V"
  },
  "12": {
    "image": "https://www.r6lookup.com/dist/img/ranks/silver4.svg",
    "name": "Silver IV"
  },
  "13": {
    "image": "https://www.r6lookup.com/dist/img/ranks/silver3.svg",
    "name": "Silver III"
  },
  "14": {
    "image": "https://www.r6lookup.com/dist/img/ranks/silver2.svg",
    "name": "Silver II"
  },
  "15": {
    "image": "https://www.r6lookup.com/dist/img/ranks/silver1.svg",
    "name": "Silver I"
  },
  "16": {
    "image": "https://www.r6lookup.com/dist/img/ranks/gold3.svg",
    "name": "Gold III"
  },
  "17": {
    "image": "https://www.r6lookup.com/dist/img/ranks/gold2.svg",
    "name": "Gold II"
  },
  "18": {
    "image": "https://www.r6lookup.com/dist/img/ranks/gold1.svg",
    "name": "Gold I"
  },
  "19": {
    "image": "https://www.r6lookup.com/dist/img/ranks/platinum3.svg",
    "name": "Platinum III"
  },
  "20": {
    "image": "https://www.r6lookup.com/dist/img/ranks/platinum2.svg",
    "name": "Platinum II"
  },
  "21": {
    "image": "https://www.r6lookup.com/dist/img/ranks/platinum1.svg",
    "name": "Platinum I"
  },
  "22": {
    "image": "https://www.r6lookup.com/dist/img/ranks/diamond.svg",
    "name": "Diamond"
  },
  "23": {
    "image": "https://www.r6lookup.com/dist/img/ranks/champion.svg",
    "name": "Champion"
  }
}', true);

$rankInfo = $ranks[$su[$su["profileId"]]["rank"]];
array_push($su[$su["profileId"]], $rankInfo);

print json_encode(array($mode, $uid, $platform, $season, $region, $stats));
