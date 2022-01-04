<div class="overview-stats-content">
    <div class="content-left">
        <div class="ranks-overview">
            <div class="current-season">
                <div class="season-name">
                    <p><?php echo $getUser[0]["seasonName"] ?></p>
                </div>
                <div class="rank">
                    <div class="current-rank-img">
                        <img src="<?php echo $getUser[0]["rankInfo"]['image'] ?>" alt="rank image">
                    </div>
                    <div class="current-rank-info">
                        <p class="current-season-mmrChange">
                            <?php echo $getUser[0]['last_match_mmr_change']; ?>
                            <span class="changeMmr">
                                <?php if ($getUser[0]['last_match_mmr_change'] != 0) { ?>
                                    <?php if ($getUser[0]['last_match_mmr_change'] > 0) { ?>
                                        <svg aria-hidden="true" focusable="false" class="arrowUp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
                                        </svg>
                                        <span>MMR</span>
                                    <?php } elseif ($getUser[0]['last_match_mmr_change'] < 0) { ?>
                                        <svg aria-hidden="true" focusable="false" class="arrowDown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
                                        </svg>
                                        <span>MMR</span>
                                    <?php } ?>
                                <?php } else { ?>
                                    <svg aria-hidden="true" focusable="false" class="arrowEven" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
                                    </svg>
                                    <span>No change</span>
                                <?php } ?>
                            </span>
                        </p>
                        <p class="current-season-mmr">
                            <?php echo $getUser[0]['mmr'] ?>
                            <span><?php echo $getUser[0]["rankInfo"]['name'] ?></span>
                        </p>
                        <p class="season-max-mmr">
                            <?php if ((int)$getUser[0]['max_mmr'] != 0) {
                                echo (int)$getUser[0]['max_mmr'];
                            } else {
                                echo $getUser[0]['mmr'];
                            } ?>
                            <span> Max MMR</span>
                        </p>
                        <p class="current-season-kd">
                            <?php if ($getUser[0]['deaths'] != 0) {
                                echo number_format(round($getUser[0]['kills']/$getUser[0]['deaths'], 2), 2, '.', '');
                            } else {
                                echo "0.00";
                            } ?>
                            <span> K/D</span>
                        </p>
                    </div>
                </div>
            </div>
            <?php for ($seasonprev = 1; $seasonprev <= 4; $seasonprev++) { ?>
                <div class="season">
                    <div class="season-name">
                        <p><?php echo $getUser[$seasonprev]["seasonName"] ?></p>
                    </div>
                    <div class="rank">
                        <div class="rank-img">
                            <img draggable="false" src="<?php echo $getUser[$seasonprev]["rankInfo"]['image'] ?>" alt="rank image">
                        </div>
                        <div class="rank-info">
                            <p class="season-mmr">
                                <?php echo $getUser[$seasonprev]['mmr'] ?>
                                <span><?php echo $getUser[$seasonprev]["rankInfo"]['name'] ?></span>
                            </p>
                            <p class="season-max-mmr">
                                <?php if ((int)$getUser[$seasonprev]['max_mmr'] != 0) {
                                    echo (int)$getUser[$seasonprev]['max_mmr'];
                                } else {
                                    echo $getUser[$seasonprev]['mmr'];
                                } ?>
                                <span> Max MMR</span>
                            </p>
                            <p class="season-kd">
                                <?php if ($getUser[$seasonprev]['deaths'] != 0) {
                                    echo number_format(round($getUser[$seasonprev]['kills']/$getUser[$seasonprev]['deaths'], 2), 2, '.', '');;
                                } else {
                                    echo "0.00";
                                } ?>
                                <span> K/D</span>
                            </p>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>
    <div class="content-right">
        <div class="overview-stats">
            <div class="def-stats-4col">
                <div class="def-header">
                    <p>General Statistics</p>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>General K/D</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php if ($getUser["generalpvp_death"] + $getUser["generalpvp_kills"] != 0) {
                                echo number_format(round($getUser["generalpvp_kills"] / $getUser["generalpvp_death"], 2), 2, '.', '');
                            } else {
                                echo "0.00";
                            } ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Kills</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_kills"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Deaths</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_death"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Assists</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_killassists"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php if (($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) != 0) {
                                echo number_format(round($getUser['generalpvp_matchwon'] / ($getUser['generalpvp_matchwon'] + $getUser['generalpvp_matchlost']) * 100, 2), 2, '.', '');
                            } else {
                                echo "0.00";
                            } ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_matchwon"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_matchlost"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Headshot %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format($generalPvpHeadshotRatio * 100, 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Headshots</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_headshot"]; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Penetration %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format($generalPvpPenetrationRatio * 100, 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-4col">
                    <div class="def-stat-name">
                        <p>Penetration Kills</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser["generalpvp_penetrationkills"]; ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="gamemode-stats">
            <div class="ranked-stats">
                <div class="def-stats-2col">
                    <div class="def-header">
                        <p>Ranked Statistics</p>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Time Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $generalRankedTimePlayedHMS["h"] . "h " . $generalRankedTimePlayedHMS["m"] . "m" ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["rankedpvp_matchplayed"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Ranked K/D</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo number_format($generalRankedKd, 2, '.', '') ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Win %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo number_format($generalRankedWinloss, 2, '.', '') ?>%
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["rankedpvp_kills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Deaths</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["rankedpvp_death"]; ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="casual-stats">
                <div class="def-stats-2col">
                    <div class="def-header">
                        <p>Casual Statistics</p>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Time Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $generalCasualTimePlayedHMS["h"] . "h " . $generalCasualTimePlayedHMS["m"] . "m" ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["casualpvp_matchplayed"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Casual K/D</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php if ($getUser["casualpvp_death"] != 0) {
                                    echo number_format(round($getUser['casualpvp_kills'] / $getUser['casualpvp_death'], 2), 2, '.', '');
                                } else {
                                    echo "0.00";
                                } ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Win %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php if (($getUser['casualpvp_matchwon'] + $getUser['casualpvp_matchlost']) != 0) {
                                    echo number_format(round($getUser['casualpvp_matchwon'] / ($getUser['casualpvp_matchwon'] + $getUser['casualpvp_matchlost']) * 100, 2), 2, '.', '');
                                } else {
                                    echo "0.00";
                                } ?>
                                %
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["casualpvp_kills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Deaths</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["casualpvp_death"]; ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
