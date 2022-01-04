<div class="content">
    <div class="flex-content">
        <div class="left-content">
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
                                <?php if ($getUser["generalpve_death"] != 0) {
                                    echo number_format(round($getUser['generalpve_kills'] / $getUser['generalpve_death'], 2), 2, '.', '');
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
                                <?php echo $getUser["generalpve_kills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Deaths</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_death"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Assists</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_killassists"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Win %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php if (($getUser['generalpve_matchwon'] + $getUser['generalpve_matchlost']) != 0) {
                                    echo number_format(round($getUser['generalpve_matchwon'] / ($getUser['generalpve_matchwon'] + $getUser['generalpve_matchlost']) * 100, 2), 2, '.', '');
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
                                <?php echo $getUser["generalpve_matchwon"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Losses</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_matchlost"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Matches Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser['generalpve_matchplayed'] ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Headshot %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php if ($getUser["generalpve_kills"] != 0) {
                                    echo number_format(round($getUser["generalpve_headshot"] / $getUser["generalpve_kills"], 4) * 100, 2, '.', '');
                                } else {
                                    echo "0.00";
                                } ?>%
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Headshots</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_headshot"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Penetration %</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php if ($getUser["generalpve_kills"] != 0) {
                                    echo number_format(round($getUser["generalpve_penetrationkills"] / $getUser["generalpve_kills"], 4), 2, '.', '');
                                } else {
                                    echo "0.00";
                                } ?>%
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Penetration Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_penetrationkills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Melee Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_meleekills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Blind Kills</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_blindkills"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Bullets Hit</p>
                        </div>
                        <div class="def-stat-value">
                            <p>
                                <?php echo $getUser["generalpve_bullethit"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p>Timed Played</p>
                        </div>
                        <div class="def-stat-value">
                            <p><?php echo $generalPveTimePlayedHMS["h"] . "h " . $generalPveTimePlayedHMS["m"] . "m" ?></p>
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
                    <div class="def-stat-4col">
                        <div class="def-stat-name">
                            <p></p>
                        </div>
                        <div class="def-stat-value">
                            <p></p>
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
                            <?php echo number_format(abs($getUser['generalpve_distancetravelled']), 0, '.', ' '); ?>
                            m
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Barricades deployed</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpve_barricadedeployed']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Reinforcements deployed</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpve_reinforcementdeploy']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Suicides</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpve_suicide']; ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-1col">
                    <div class="def-stat-name">
                        <p>Revives</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['generalpve_revive']; ?>
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
                            <?php echo $getUser['plantbombpve_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpve_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpve_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['plantbombpve_matchwon'] / $getUser['plantbombpve_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $plantbombPveTimePlayedHMS["h"] . "h " . $plantbombPveTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['plantbombpve_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="def-stats-2col classic-stats">
                <div class="def-header classic-head">
                    <p>Classic</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['terrohuntclassicpve_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['terrohuntclassicpve_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['terrohuntclassicpve_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['terrohuntclassicpve_matchwon'] / $getUser['terrohuntclassicpve_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $classicPveTimePlayedHMS["h"] . "h " . $classicPveTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['terrohuntclassicpve_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="def-stats-2col hostage-rescue-stats">
                <div class="def-header hostage-rescue-head">
                    <p>Hostage Rescue</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepve_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepve_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepve_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['rescuehostagepve_matchwon'] / $getUser['rescuehostagepve_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $rescuehPveTimePlayedHMS["h"] . "h " . $rescuehPveTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['rescuehostagepve_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="def-stats-2col hostage-defense-stats">
                <div class="def-header hostage-defense-head">
                    <p>Hostage Defense</p>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Wins</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['protecthostagepve_matchwon'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Losses</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['protecthostagepve_matchlost'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Matches Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['protecthostagepve_matchplayed'] ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Win %</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo number_format(($getUser['protecthostagepve_matchwon'] / $getUser['protecthostagepve_matchplayed'] * 100), 2, '.', '') ?>%
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Timed Played</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $protecthPveTimePlayedHMS["h"] . "h " . $protecthPveTimePlayedHMS["m"] . "m" ?>
                        </p>
                    </div>
                </div>
                <div class="def-stat-2col">
                    <div class="def-stat-name">
                        <p>Best Score</p>
                    </div>
                    <div class="def-stat-value">
                        <p>
                            <?php echo $getUser['protecthostagepve_bestscore'] ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
