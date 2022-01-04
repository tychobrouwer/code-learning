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
$stats = $config["player-stats"];
$uid = $_GET["id"];
$region = $_GET['region'];
$season = 1;
$notFound = [];

//////////////////////////////////////////////////////////////////////////
$su = $uapi->getStatsPlayer($uid, $platform, $season, $region, $stats);

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

$seasons_num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

foreach ($seasons_num as $season_num) {
    if ($su[$season_num]["season"] <= 14) {
        $rankInfo = $oldranks[$su[$season_num]["rank"]];
        array_push($su[$season_num], $rankInfo);
    } else {
        $rankInfo = $ranks[$su[$season_num]["rank"]];
        array_push($su[$season_num], $rankInfo);
    }
}

print json_encode($su);
