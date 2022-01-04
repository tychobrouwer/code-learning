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

$data = array();


$platform = $_GET['platform'];
$season = -1;
$stats = $config["player-stats"];
$region = $_GET['region'];
$notFound = [];
//////////////////////////////////////////////////////////////////////////

function printName($uid)
{
    global $uapi, $data, $id, $platform, $notFound;
    $su = $uapi->searchUser("byid", $uid, $platform);
    if ($su["error"] != true) {
        $data[$su['uid']] = array(
            "profile_id" => $su['uid'],
            "nickname" => $su['nick']
        );
    } else {
        $notFound[$uid] = [
            "profile_id" => $uid,
            "error" => [
                "message" => "User not found!"
            ]
        ];
    }
}

if (isset($_GET["id"])) {
    $str = $_GET["id"];
    if (strpos($str, ',') !== false) {
        $tocheck = explode(',', $str);
    } else {
        $tocheck = array(
            $str
        );
    }

    foreach ($tocheck as $value) {
        printName($value);
    }
}

if (empty($data)) {
    $error = $uapi->getErrorMessage();
    if ($error === false) {
        die(json_encode($notFound));
    } else {
        die(json_encode(array("error" => $error)));
    }
}

$resultIdName = array_merge($data, $notFound);

//////////////////////////////////////////////////////////////////
$ids = "";
foreach ($data as $value) {
    $ids = $ids . "," . $value["profile_id"];
}
$ids = substr($ids, 1);

$idresponse = json_decode($uapi->getStats($ids, $stats, $platform), true);
$final = array();
foreach ($idresponse["results"] as $value) {
    $id = array_search($value, $idresponse["results"]);
    $final[$id] = array_merge(
        $value,
        array(
            "nickname"=>$data[$id]["nickname"],
            "profile_id" => $id,
            "platform" => $platform)
    );
}
$resultStats = str_replace(
    ":infinite",
    "",
    array("players" => array_merge($final, $notFound))
);

////////////////////////////////////////////////////////////////
$progressionJson = json_decode($uapi->getProgression($ids, $platform), true);
if (!array_key_exists("player_profiles", $progressionJson)) {
    die(json_encode(array(
        "players" => $notFound
    )));
}
$progression = $progressionJson["player_profiles"];

////////////////////////////////////////////////////////////////
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

$oldranks = json_decode('{
    "0": {
      "image": "https://www.r6lookup.com/dist/img/ranks/unranked.svg",
      "name": "Unranked"
    },
    "1": {
      "image": "https://www.r6lookup.com/dist/img/ranks/copper4.svg",
      "name": "Copper IV"
    },
    "2": {
      "image": "https://www.r6lookup.com/dist/img/ranks/copper3.svg",
      "name": "Copper III"
    },
    "3": {
      "image": "https://www.r6lookup.com/dist/img/ranks/copper2.svg",
      "name": "Copper II"
    },
    "4": {
      "image": "https://www.r6lookup.com/dist/img/ranks/copper1.svg",
      "name": "Copper I"
    },
    "5": {
      "image": "https://www.r6lookup.com/dist/img/ranks/bronze4.svg",
      "name": "Bronze IV"
    },
    "6": {
      "image": "https://www.r6lookup.com/dist/img/ranks/bronze3.svg",
      "name": "Bronze III"
    },
    "7": {
      "image": "https://www.r6lookup.com/dist/img/ranks/bronze2.svg",
      "name": "Bronze II"
    },
    "8": {
      "image": "https://www.r6lookup.com/dist/img/ranks/bronze1.svg",
      "name": "Bronze I"
    },
    "9": {
      "image": "https://www.r6lookup.com/dist/img/ranks/silver4.svg",
      "name": "Silver IV"
    },
    "10": {
      "image": "https://www.r6lookup.com/dist/img/ranks/silver3.svg",
      "name": "Silver III"
    },
    "11": {
      "image": "https://www.r6lookup.com/dist/img/ranks/silver2.svg",
      "name": "Silver II"
    },
    "12": {
      "image": "https://www.r6lookup.com/dist/img/ranks/silver1.svg",
      "name": "Silver I"
    },
    "13": {
      "image": "https://www.r6lookup.com/dist/img/ranks/gold4.svg",
      "name": "Gold IV"
    },
    "14": {
      "image": "https://www.r6lookup.com/dist/img/ranks/gold3.svg",
      "name": "Gold III"
    },
    "15": {
      "image": "https://www.r6lookup.com/dist/img/ranks/gold2.svg",
      "name": "Gold II"
    },
    "16": {
      "image": "https://www.r6lookup.com/dist/img/ranks/gold1.svg",
      "name": "Gold I"
    },
    "17": {
      "image": "https://www.r6lookup.com/dist/img/ranks/platinum3.svg",
      "name": "Platinum III"
    },
    "18": {
      "image": "https://www.r6lookup.com/dist/img/ranks/platinum2.svg",
      "name": "Platinum II"
    },
    "19": {
      "image": "https://www.r6lookup.com/dist/img/ranks/platinum1.svg",
      "name": "Platinum I"
    },
    "20": {
      "image": "https://www.r6lookup.com/dist/img/ranks/diamond.svg",
      "name": "Diamond"
    }
}', true);

$seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

foreach ($seasons as $prevseason) {
    $idresponse = json_decode($uapi->getRanking($ids, "-" . $prevseason, $region, $platform), true);

    $season_ = $idresponse["players"][$id]["season"];

    if ($season_ <= 14) {
        $rankInfo = $oldranks[$idresponse["players"][$id]["rank"]];
    } else {
        $rankInfo = $ranks[$idresponse["players"][$id]["rank"]];
    }

    $rankedSeasons[] = [
        "rankInfo" => $rankInfo,
        "topRankPos" => $idresponse["players"][$id]["top_rank_position"],
        "lastMmrChange" => $idresponse["players"][$id]["last_match_mmr_change"],
        "mmr" => $idresponse["players"][$id]["mmr"],
        "nextRankMmr" => $idresponse["players"][$id]["next_rank_mmr"],
        "previousRankMmr" => $idresponse["players"][$id]["previous_rank_mmr"],
        "season" => $idresponse["players"][$id]["season"],
        "winns" => $idresponse["players"][$id]["wins"],
        "losses" => $idresponse["players"][$id]["losses"],
        "abandoms" => $idresponse["players"][$id]["abandons"],
        "maxMmr" => $idresponse["players"][$id]["max_mmr"],
        "maxRank" => $idresponse["players"][$id]["max_rank"],
        "skill" => $idresponse["players"][$id]["skill_stdev"],
        "kills" => $idresponse["players"][$id]["kills"],
        "deaths" => $idresponse["players"][$id]["deaths"],
        "rank" => $idresponse["players"][$id]["rank"]
    ];
}

////////////////////////////////////////////////////////////////////////
$result = array_merge(
    $resultIdName[$id],
    $resultStats['players'][$id],
    $progression[0],
    $idresponse['players'][$id],
    $rankedSeasons
);

unset($result['abandons']);
unset($result['deaths']);
unset($result['kills']);
unset($result['last_match_mmr_change']);
unset($result['losses']);
unset($result['max_mmr']);
unset($result['max_rank']);
unset($result['mmr']);
unset($result['next_rank_mmr']);
unset($result['previous_rank_mmr']);
unset($result['rank']);
unset($result['season']);
unset($result['skill_stdev']);
unset($result['wins']);
unset($result['top_rank_position']);


print json_encode($result);
