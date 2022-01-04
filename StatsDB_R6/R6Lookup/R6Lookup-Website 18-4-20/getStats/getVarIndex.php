<?php
	// Get Get Request Username an Platfrom
	$nameInput = htmlspecialchars($_POST['username']);
    $platform = htmlspecialchars($_POST['platform']);

	// Get Userdata From Ubisoft
    $getUser = json_decode(file_get_contents("https://www.r6lookup.com/getStats/getStatsIndex.php?name=$nameInput&platform=$platform&region=$region&appcode=809965"), true);

	if (!empty($getUser) && !array_key_exists("error", $getUser)){
		// PLAYER DATA
		// Get Player ID
		$playerId = $getUser["profile_id"];
        // Get Player Username
        $userName = htmlspecialchars($getUser["nickname"]);
        // Get Player level
        $level = htmlspecialchars($getUser["level"]);

		// GENERAL PVP STATS
		// Get General Pvp Kills
		$generalPvpKills = htmlspecialchars($getUser["generalpvp_kills"]);
		// Get General PVP Penetration kills
		$generalPvpPenetrationKills = htmlspecialchars($getUser["generalpvp_penetrationkills"]);
		// Get General Pvp PenetrationRatio
		if ($generalPvpKills != 0) {
		  $generalPvpPenetrationRatio = round($generalPvpPenetrationKills/$generalPvpKills, 2);
		}
        // Get General Pvp Headshots
        $generalPvpHeadshots = htmlspecialchars($getUser["generalpvp_headshot"]);
        // Get General Pvp Headshotratio
        if($generalPvpKills != 0){
			$generalPvpHeadshotRatio = round($generalPvpHeadshots/$generalPvpKills, 2);
        } else {
            $generalPvpHeadshotRatio = 0;
        }

		// GENERAL RANKED STATS
        // Get Rank Image Link
        $rankImage = htmlspecialchars($getUser['rankInfo']['image']);
		// Get Current mmr
		$currentMmr = htmlspecialchars($getUser['mmr']);
		// Get General Ranked Kills
		$generalRankedKills = htmlspecialchars($getUser['rankedpvp_kills']);
		// Get General Ranked Deaths
		$generalRankedDeaths = htmlspecialchars($getUser['rankedpvp_death']);
		// Get General Ranked KD
		if($generalRankedDeaths != 0){
            $generalRankedKd = round($generalRankedKills/$generalRankedDeaths, 2);
        } else {
            $generalRankedKd = 0;
        }
		// Get General Ranked Winns
		$generalRankedWinns = htmlspecialchars($getUser['rankedpvp_matchwon']);
		// Get General Ranked Losses
		$generalRankedLosses = htmlspecialchars($getUser['rankedpvp_matchlost']);
		// Get General Ranked Matches Played
		$generalPvpMatchPlayed = htmlspecialchars($getUser['generalpvp_matchplayed']);
		// Get General Ranked Winnrate
		if($generalPvpMatchPlayed != 0){
            $generalRankedWinnloss = round($generalRankedWinns/$generalPvpMatchPlayed*100, 2);
        } else {
            $generalRankedWinnloss = 0;
        }
    }
?>
