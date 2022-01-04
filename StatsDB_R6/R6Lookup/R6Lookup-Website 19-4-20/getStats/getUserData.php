<?php
	// Get Get Request Username an Platfrom
	$nameInput = htmlspecialchars($_GET['username']);
    $platform = htmlspecialchars($_GET['platform']);

	// Get Userdata From Ubisoft
    $getUser = json_decode(file_get_contents("http://localhost/getStats/getUser.php?name=$nameInput&platform=$platform&appcode=809965"), true);

	// Get General Stats From Ubisoft
    $getUserStats = json_decode(file_get_contents("http://localhost/getStats/getStats.php?name=$nameInput&platform=$platform&appcode=809965"), true);

	// Check If Player Was Found
    if(!empty($getUserStats['players'])){
		// Get PLayer ID
        $playerId = key($getUser['players']);

		// Merge getUser and getUserStats arrays (Duplicate Stats Get Overritten)
        $userData = array_merge($getUser["players"][$playerId], $getUserStats["players"][$playerId]);

		if (!array_key_exists('error', $userData)){
			// PLAYER DATA
	        // Get Player Username
	        $userName = htmlspecialchars($userData['nickname']);
	        // Get Player level
	        $level = htmlspecialchars($userData['level']);

			// GENERAL PVP STATS
	        // Get General Pvp Kills
	        $generalPvpKills = htmlspecialchars($userData['generalpvp_kills']);
	        // Get General Pvp Deaths
	        $generalPvpDeaths = htmlspecialchars($userData['generalpvp_death']);
	        // Get General Pvp KD
	        if($generalPvpDeaths != 0){
	            $generalPvpKd = round($generalPvpKills/$generalPvpDeaths, 2);
	        } else {
	            $generalPvpKd = 0;
	        }
			// Get General Pvp Killassists
			$generalPvpKillassists = htmlspecialchars($userData['generalpvp_killassists']);
			// Get General Pvp meleekills
			$generalPvpMeleekills = htmlspecialchars($userData['generalpvp_meleekills']);
	        // Get General PVP Winns
	        $generalPvpWinns = htmlspecialchars($userData['generalpvp_matchwon']);
	        // Get General PVP Losses
	        $generalPvpLosses = htmlspecialchars($userData['generalpvp_matchlost']);
			// Get General PVP Matches Played
			$generalPvpMatchPlayed = htmlspecialchars($userData['generalpvp_matchplayed']);
	        // Get General PVP Winrate
	        if($generalPvpMatchPlayed != 0){
	            $generalPvpWinloss = round($generalPvpWinns/$generalPvpMatchPlayed*100, 2);
	        } else {
	            $generalPvpWinloss = 0;
	        }
			// Get General PVP Penetration kills
			$generalPvpPenetrationKills = htmlspecialchars($userData['generalpvp_penetrationkills']);
			// Get General Pvp PenetrationRatio
			if ($generalPvpKills != 0) {
			  $generalPvpPenetrationRatio = round($generalPvpPenetrationKills/$generalPvpKills, 2);
			}
	        // Get General Pvp Headshots
	        $generalPvpHeadshots = htmlspecialchars($userData['generalpvp_headshot']);
	        // Get General Pvp Headshotratio
	        if($generalPvpKills != 0){
				$generalPvpHeadshotRatio = round($generalPvpHeadshots/$generalPvpKills, 2);
	        } else {
	            $generalPvpHeadshotRatio = 0;
	        }
			// Get General Pvp Timeplayed
			$generalPvpTimeplayed = htmlspecialchars($userData['generalpvp_timeplayed']);

			// GENERAL RANKED STATS
	        // Get Rank Image Link
	        $rankImage = htmlspecialchars($userData['rankInfo']['image']);
			// Get Current mmr
			$currentMmr = htmlspecialchars($userData['mmr']);
			// Get Max mmr
			$maxMmr = htmlspecialchars($userData['max_mmr']);
			// Get General Ranked Kills
			$generalRankedKills = htmlspecialchars($userData['rankedpvp_kills']);
			// Get General Ranked Deaths
			$generalRankedDeaths = htmlspecialchars($userData['rankedpvp_death']);
			// Get General Ranked KD
			if($generalRankedDeaths != 0){
	            $generalRankedKd = round($generalRankedKills/$generalRankedDeaths, 2);
	        } else {
	            $generalRankedKd = 0;
	        }
			// Get General Ranked Winns
			$generalRankedWinns = htmlspecialchars($userData['rankedpvp_matchwon']);
			// Get General Ranked Losses
			$generalRankedLosses = htmlspecialchars($userData['rankedpvp_matchlost']);
			// Get General Ranked Matches Played
			$generalPvpMatchPlayed = htmlspecialchars($userData['generalpvp_matchplayed']);
			// Get General Ranked Winnrate
			if($generalPvpMatchPlayed != 0){
	            $generalRankedWinnloss = round($generalRankedWinns/$generalPvpMatchPlayed*100, 2);
	        } else {
	            $generalRankedWinnloss = 0;
	        }
		}
    }
?>
