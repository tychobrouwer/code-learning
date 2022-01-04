<?php
include ("config.php");

if (!isset($_GET["appcode"])) {
	print "ERROR: Wrong appcode";
	die();
}

if ($_GET["appcode"] != $config["appcode"]) {
	print "ERROR: Wrong appcode";
	die();
}

$loadProgression = $config["default-progression"];

include ("UbiAPI.php");

$uapi = new UbiAPI($config["ubi-email"], $config["ubi-password"]);
$data = array();
$season = -1;

$platform = $_GET['platform'];

$region = $config["default-region"];
if (isset($_GET['region'])) {
	$region = $_GET['region'];
}

$notFound = [];

function printID($name)
{
	global $uapi, $data, $id, $platform, $notFound;
	$su = $uapi->searchUser("bynick", $name, $platform);
	if ($su["error"] != true) {
		$data[$su['uid']] = array(
			"profile_id" => $su['uid'],
			"nickname" => $su['nick']
		);
	} else {
		$notFound[$name] = [
			"nickname" => $name,
			"error" => [
				"message" => "User not found!"
			]
		];
	}
}

if (isset($_GET["name"])) {
	$str = $_GET["name"];
	$tocheck = array(
		$str
	);
}

foreach($tocheck as $value) {
	printID($value);
}

if (empty($data)) {
	$error = $uapi->getErrorMessage();
	if ($error === false) {
		die(json_encode(array(
			"players" => $notFound
		)));
	}
	else {
		die(json_encode(array(
			"players" => array() ,
			"error" => $error
		)));
	}
}

function getValue($user, $progression)
{
	foreach($progression as $usera) {
		if ($usera["profile_id"] == $user) {
			return $usera;
		}
	}

	return array();
}

$ids = "";

foreach($data as $value) {
	$ids = $ids . "," . $value["profile_id"];
}

$ids = substr($ids, 1);
$idresponse = json_decode($uapi->getRanking($ids, $season, $region, $platform) , true);

if ($loadProgression == "true") {
	$progressionJson = json_decode($uapi->getProgression($ids, $platform) , true);
	if (!array_key_exists("player_profiles", $progressionJson)){
		die(json_encode(array(
			"players" => $notFound
		)));
	}
	$progression = $progressionJson["player_profiles"];
}

$ranks = json_decode('{
  "0": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank0.svg",
    "name": "Unranked"
  },
  "1": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/s15/hd-rank5.svg",
    "name": "Copper V"
  },
  "2": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank1.svg",
    "name": "Copper IV"
  },
  "3": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank2.svg",
    "name": "Copper III"
  },
  "4": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank3.svg",
    "name": "Copper II"
  },
  "5": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank4.svg",
    "name": "Copper I"
  },
  "6": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/s15/hd-rank10.svg",
    "name": "Bronze V"
  },
  "7": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank5.svg",
    "name": "Bronze IV"
  },
  "8": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank6.svg",
    "name": "Bronze III"
  },
  "9": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank7.svg",
    "name": "Bronze II"
  },
  "10": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank8.svg",
    "name": "Bronze I"
  },
  "11": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/s15/hd-rank15.svg",
    "name": "Silver V"
  },
  "12": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank9.svg",
    "name": "Silver IV"
  },
  "13": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank10.svg",
    "name": "Silver III"
  },
  "14": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank11.svg",
    "name": "Silver II"
  },
  "15": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank12.svg",
    "name": "Silver I"
  },
  "16": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank14.svg",
    "name": "Gold III"
  },
  "17": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank15.svg",
    "name": "Gold II"
  },
  "18": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank16.svg",
    "name": "Gold I"
  },
  "19": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank17.svg",
    "name": "Platinum III"
  },
  "20": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank18.svg",
    "name": "Platinum II"
  },
  "21": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank19.svg",
    "name": "Platinum I"
  },
  "22": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/hd-rank20.svg",
    "name": "Diamond"
  },
  "23": {
    "image": "https://trackercdn.com/cdn/r6.tracker.network/ranks/svg/s15/hd-rank23.svg",
    "name": "Champion"
  }
}', true);
$finalGetUser = array();

if (!isset($idresponse)) {
	die(json_encode(array(
		"players" => $notFound
	)));
}

if (!array_key_exists("players", $idresponse)){
	die(json_encode(array(
		"players" => $notFound
	)));
}

foreach($idresponse["players"] as $value) {
	$id = $value["profile_id"];
	$finalGetUser[$id] = array_merge(getValue($id, $progression), $value, array(
		"nickname" => $data[$id]["nickname"],
		"platform" => $platform,
		"rankInfo" => $ranks[$value["rank"]]
	));
}

$stats = $config["default-stats"];

$idresponse = json_decode($uapi->getStats($ids, $stats, $platform), true);
$finalGetStats = array();
foreach($idresponse["results"] as $value) {
	$id = array_search ($value, $idresponse["results"]);
	$finalGetStats[$id] = array_merge(
		$value,
		array("nickname"=>$data[$id]["nickname"],
		"profile_id" => $id,
		"platform" => $platform
	)
);
}

if (empty($value)){
	die(json_encode(array(
		"players" => $notFound
	)));
}

$final = array_replace_recursive($finalGetUser, $finalGetStats);

print json_encode(array("players" => array_merge($final,$notFound)));
?>
