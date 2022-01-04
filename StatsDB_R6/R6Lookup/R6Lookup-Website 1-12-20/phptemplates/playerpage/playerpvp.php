<div class="content">
    <div class="flex-content">
        <div class="left-content">
            <div class="top-content-box">
                <div class="def-stats-2col ranked-stats">
                    <div class="def-header ranked-head">
                        <p>Ranked Statistics</p>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Time Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $generalRankedTimePlayedHMS["h"] . "h " . $generalRankedTimePlayedHMS['m'] . "m" ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['rankedpvp_matchplayed']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Ranked K/D</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $generalRankedKd ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Win %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo number_format($generalRankedWinloss, 2, '.', '') ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['rankedpvp_kills']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Deaths</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['rankedpvp_death']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Won</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['rankedpvp_matchwon']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches lost</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['rankedpvp_matchlost']; ?>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="def-stats-2col casual-stats">
                    <div class="def-header casual-head">
                        <p>Casual Statistics</p>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Time Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $generalCasualTimePlayedHMS["h"] . "h " . $generalCasualTimePlayedHMS['m'] . "m" ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['casualpvp_matchplayed']; ?>
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
                                <?php echo $getUser['casualpvp_kills']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Deaths</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['casualpvp_death']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches Won</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['casualpvp_matchwon']; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-2col">
                        <div class="def-stat-name">
                            <p>Matches lost</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['casualpvp_matchlost']; ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Melee Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpvp_meleekills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Blind Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpvp_blindkills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Bullets Hit</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpvp_bullethit"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p></p>
                        </div>
                        <div class="def-stat-value">
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-content">
            <div class="def-stats-1col">
                <div class="def-header">
                    <p>Player Statistics</p>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Distance travelled</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(abs($getUser['generalpvp_distancetravelled']), 0, '.', ' '); ?>
                            m
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Rappel breaches</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_rappelbreach']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Barricades deployed</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_barricadedeployed']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Reinforcements deployed</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_reinforcementdeploy']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Suicides</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_suicide']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Revives</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_revive']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>DBNO</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_dbno']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>DBNO Assists</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_dbnoassists']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Gadgets Destroyed</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpvp_gadgetdestroy']; ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom">
        <div class="content-bottom">
            <div class="def-stats-2col bomb-stats">
                <div class="def-header bomb-head">
                    <p>Bomb</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpvp_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpvp_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpvp_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['plantbombpvp_matchwon'] / $getUser['plantbombpvp_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $generalBombTimePlayedHMS["h"] . "h " . $generalBombTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpvp_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="def-stats-2col secure-stats">
                <div class="def-header secure-head">
                    <p>Secure Area</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['secureareapvp_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['secureareapvp_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['secureareapvp_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['secureareapvp_matchwon'] / $getUser['secureareapvp_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $generalSecureTimePlayedHMS["h"] . "h " . $generalSecureTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['secureareapvp_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="def-stats-2col hostage-stats">
                <div class="def-header hostage-head">
                    <p>Hostage Rescue</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepvp_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepvp_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepvp_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['rescuehostagepvp_matchwon'] / $getUser['rescuehostagepvp_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $generalHostageTimePlayedHMS["h"] . "h " . $generalHostageTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepvp_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
