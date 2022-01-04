<?php
    function GetPlayerData($nameInput, $platform){
        $playerIdRequest = file_get_contents("https://r6.apitab.com/search/$platform/$nameInput");
        $playerIdResult = json_decode($playerIdRequest, true);
        $playerId = key($playerIdResult['players']);

        $playerDataRequest = file_get_contents("https://r6.apitab.com/update/$playerId");
        $playerData = json_decode($playerDataRequest, true);

        return $playerData;
    }

    function GetPlayersName($nameInput, $platform){
        $playerIdRequest = file_get_contents("https://r6.apitab.com/search/$platform/$nameInput");
        $playerResult = json_decode($playerIdRequest, true);

        if (count($playerResult['players']) == 0) {
            $searchResults = 'No players were found';
        } elseif (count($playerResult['players']) == 1) {
            foreach($playerResult['players'] as $player[]){
                $searchResults[] = $player[0]['profile']['p_name'];
            }
        } elseif (count($playerResult['players']) > 1) {
            foreach($playerResult['players'] as $player){
                $searchResults[] = $player['profile']['p_name'];
            }

        }
        return $searchResults;
    }

    function GetPlayersStats($searchResults, $platform){
        foreach($searchResults as $player){
            $playerIdRequest = file_get_contents("https://r6.apitab.com/search/$platform/$player");
            $playerData = json_decode($playerIdRequest, true);
            $playerKey = array_key_first($playerData['players']);

            $playerMmr = $playerData['players'][$playerKey]['ranked']['mmr'];
            $playerRank = GetPlayerRank($playerMmr);

            $playerStats[] = ['p_name' => $playerData['players'][$playerKey]['profile']['p_name'], 'level' => $playerData['players'][$playerKey]['stats']['level'], 'kd' => $playerData['players'][$playerKey]['ranked']['kd'], 'rank' => $playerRank];
        }
        return $playerStats;
    }

    function GetPlayerRank($playerMmr){

        if ($playerMmr == 0) {
            $rank = 'Unranked';
        } elseif ($playerMmr >= 1 && $playerMmr <= 1199) {
            $rank = 'Copper 5';
        } elseif ($playerMmr >= 1200 && $playerMmr <= 1299) {
            $rank = 'Copper 4';
        } elseif ($playerMmr >= 1300 && $playerMmr <= 1399) {
            $rank = 'Copper 3';
        } elseif ($playerMmr >= 1400 && $playerMmr <= 1499) {
            $rank = 'Copper 2';
        } elseif ($playerMmr >= 1500 && $playerMmr <= 1599) {
            $rank = 'Copper 1';
        } elseif ($playerMmr >= 1600 && $playerMmr <= 1699) {
            $rank = 'Bronze 5';
        } elseif ($playerMmr >= 1700 && $playerMmr <= 1799) {
            $rank = 'Bronze 4';
        } elseif ($playerMmr >= 1800 && $playerMmr <= 1899) {
            $rank = 'Bronze 3';
        } elseif ($playerMmr >= 1900 && $playerMmr <= 1999) {
            $rank = 'Bronze 2';
        } elseif ($playerMmr >= 2000 && $playerMmr <= 2099) {
            $rank = 'Bronze 1';
        } elseif ($playerMmr >= 2100 && $playerMmr <= 2199) {
            $rank = 'Silver 5';
        } elseif ($playerMmr >= 2200 && $playerMmr <= 2299) {
            $rank = 'Silver 4';
        } elseif ($playerMmr >= 2300 && $playerMmr <= 2399) {
            $rank = 'Silver 3';
        } elseif ($playerMmr >= 2400 && $playerMmr <= 2499) {
            $rank = 'Silver 2';
        } elseif ($playerMmr >= 2500 && $playerMmr <= 2599) {
            $rank = 'Silver 1';
        } elseif ($playerMmr >= 2600 && $playerMmr <= 2799) {
            $rank = 'Gold 3';
        } elseif ($playerMmr >= 2800 && $playerMmr <= 2999) {
            $rank = 'Gold 2';
        } elseif ($playerMmr >= 3000 && $playerMmr <= 3199) {
            $rank = 'Gold 1';
        } elseif ($playerMmr >= 3200 && $playerMmr <= 3599) {
            $rank = 'Platinum 3';
        } elseif ($playerMmr >= 3600 && $playerMmr <= 3999) {
            $rank = 'Platinum 2';
        } elseif ($playerMmr >= 4000 && $playerMmr <= 4399) {
            $rank = 'Platinum 1';
        } elseif ($playerMmr >= 4400 && $playerMmr <= 4999) {
            $rank = 'Diamond';
        } elseif ($playerMmr >= 5000) {
            $rank = 'Champion';
        }

        return $rank;
    }
?>