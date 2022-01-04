<div class="top-op-div">
    <div class="most-op-name">
        <h2>Most Played Operators</h2>
    </div>
    <div class="top-op">
        <div class="top-op top-def">
            <div class="top-op-img top-def-img">
                <picture>
                    <source srcset="<?php echo $getUser['operators'][$mostUsedDef]['info']['images']['figure']['small'] ?>.webp" type="image/webp">
                    <img src="<?php echo $getUser['operators'][$mostUsedDef]['info']['images']['figure']['small'] ?>.png" type="image/png" alt="Most used defender">
                </picture>
            </div>
            <div class="top-op-info top-def-info">
                <p class="top-op-name"><?php echo $getUser['operators'][$mostUsedDef]['name'] ?></p>
                <p class="top-op-kills"><?php echo $getUser['operators'][$mostUsedDef]['operatorpvp_kills'] ?><span class="stat-name"> Kills</span></p>
                <p class="top-op-death"><?php echo $getUser['operators'][$mostUsedDef]['operatorpvp_death'] ?><span class="stat-name"> Deaths</span></p>
                <p class="top-op-wins">
                    <?php if (empty($getUser['operators'][$mostUsedDef]['operatorpvp_death'])) {
                        echo "INF";
                    } else {
                        echo number_format($getUser['operators'][$mostUsedDef]['operatorpvp_kills'] / $getUser['operators'][$mostUsedDef]['operatorpvp_death'], 2, '.', '');
                    } ?>
                    <span class="stat-name"> K/D</span>
                </p>
                <p class="top-op-losses"><?php echo $getUser['operators'][$mostUsedDef]['operatorpvp_roundplayed'] ?><span class="stat-name"> Rounds Played</span></p>
                <p class="top-op-losses">
                    <?php if (empty($getUser['operators'][$mostUsedDef]['operatorpvp_roundplayed'])) {
                        echo "0.00";
                    } else {
                        echo number_format($getUser['operators'][$mostUsedDef]['operatorpvp_roundwon'] / $getUser['operators'][$mostUsedDef]['operatorpvp_roundplayed'] * 100, 2, '.', '');
                    } ?>
                    <span class="stat-name"> Win %</span>
                </p>
                <p class="top-op-losses">
                    <?php if (empty($getUser['operators'][$mostUsedDef]['operatorpvp_headshot'])) {
                        echo "0.00";
                    } else {
                        echo
                        number_format($getUser['operators'][$mostUsedDef]['operatorpvp_headshot'] / $getUser['operators'][$mostUsedDef]['operatorpvp_kills'] * 100, 2, '.', '');
                    } ?>
                    <span class="stat-name"> Headshot %</span>
                </p>
                <p class="top-op-losses">
                    <?php if (empty($getUser['operators'][$mostUsedDef]['operatorpvp_timeplayed'])) {
                        echo "0h0m";
                    } else {
                        $operatorTimePlayed = timeConverterHMS($getUser['operators'][$mostUsedDef]['operatorpvp_timeplayed']);
                        echo $operatorTimePlayed["h"] . "h " . str_pad($operatorTimePlayed["m"], 2, "0", STR_PAD_LEFT) . "m";
                    } ?>
                    <span class="stat-name"> Timeplayed</span>
                </p>
            </div>
        </div>
        <div class="top-op top-atk">
            <div class="top-op-info top-atk-info">
                <p class="top-op-name"><?php echo $getUser['operators'][$mostUsedAtk]['name'] ?></p>
                <p class="top-op-kills"><span class="stat-name">Kills </span><?php echo $getUser['operators'][$mostUsedAtk]['operatorpvp_kills'] ?></p>
                <p class="top-op-death"><span class="stat-name">Deaths </span><?php echo $getUser['operators'][$mostUsedAtk]['operatorpvp_death'] ?></p>
                <p class="top-op-wins">
                    <span class="stat-name">K/D </span>
                    <?php if (empty($getUser['operators'][$mostUsedAtk]['operatorpvp_death'])) {
                        echo "INF";
                    } else {
                        echo number_format($getUser['operators'][$mostUsedAtk]['operatorpvp_kills'] / $getUser['operators'][$mostUsedAtk]['operatorpvp_death'], 2, '.', '');
                    } ?>
                </p>
                <p class="top-op-losses"><span class="stat-name">Rounds Played </span><?php echo $getUser['operators'][$mostUsedAtk]['operatorpvp_roundplayed'] ?></p>
                <p class="top-op-winrate">
                    <span class="stat-name">Win % </span>
                    <?php if (empty($getUser['operators'][$mostUsedAtk]['operatorpvp_roundplayed'])) {
                        echo "0.00";
                    } else {
                        echo number_format($getUser['operators'][$mostUsedAtk]['operatorpvp_roundwon'] / $getUser['operators'][$mostUsedAtk]['operatorpvp_roundplayed'] * 100, 2, '.', '');
                    } ?>
                </p>
                <p class="top-op-winrate">
                    <span class="stat-name">Headshot % </span>
                    <?php if (empty($getUser['operators'][$mostUsedAtk]['operatorpvp_headshot'])) {
                        echo "0.00";
                    } else {
                        echo
                        number_format($getUser['operators'][$mostUsedAtk]['operatorpvp_headshot'] / $getUser['operators'][$mostUsedAtk]['operatorpvp_kills'] * 100, 2, '.', '');
                    } ?>
                </p>
                <p class="top-op-winrate">
                    <span class="stat-name">Timeplayed </span>
                    <?php if (empty($getUser['operators'][$mostUsedAtk]['operatorpvp_timeplayed'])) {
                        echo "0h0m";
                    } else {
                        $operatorTimePlayed = timeConverterHMS($getUser['operators'][$mostUsedAtk]['operatorpvp_timeplayed']);
                        echo $operatorTimePlayed["h"] . "h " . str_pad($operatorTimePlayed["m"], 2, "0", STR_PAD_LEFT) . "m";
                    } ?>
                </p>
            </div>
            <div class="top-op-img top-atk-img">
                <picture>
                    <source srcset="<?php echo $getUser['operators'][$mostUsedAtk]['info']['images']['figure']['small'] ?>.webp" type="image/webp">
                    <img src="<?php echo $getUser['operators'][$mostUsedAtk]['info']['images']['figure']['small'] ?>.png" type="image/png" alt="Most used attacker">
                </picture>
            </div>
        </div>
    </div>
</div>
<div class="sec-nav-op-stats">
    <div class="sec-nav-op-tab op-add active">
        <button onclick="loadOp('allOperators')">Defenders/Attackers</button>
    </div>
    <div class="sec-nav-op-tab op-remove">
        <button onclick="loadOp('defenders')">Defenders</button>
    </div>
    <div class="sec-nav-op-tab op-remove">
        <button onclick="loadOp('attackers')">Attackers</button>
    </div>
</div>
<input type="text" class="operator-info-search" id="operator-info-search-id" onkeyup="searchO()" placeholder="Search operator">
<table class="operator-table" id="operator-table-id" data-sortable>
    <thead>
        <tr>
            <th class="operator-info-th">
                <p>Operators</p>
            </th>
            <th class="operator-kills-th">
                <p>Kills</p>
            </th>
            <th class="operator-death-th">
                <p>Deaths</p>
            </th>
            <th class="operator-kd-th">
                <p>K/D</p>
            </th>
            <th class="operator-roundplayed-th">
                <p>Rounds Played</p>
            </th>
            <th class="operator-winrate-th"  data-sortable-type="numeric">
                <p>Win %</p>
            </th>
            <th class="operator-headshot-ratio-th">
                <p>Headshot %</p>
            </th>
            <th class="operator-timeplayed-th" data-sortable-type="numeric">
                <p>Timed Played</p>
            </th>
            <th data-sortable="false" class="operator-stat-th">
                <p>Special Stats</p>
            </th>
        </tr>
    </thead>
    <tbody>
    <?php foreach ($operators as $operator) { ?>
        <?php $totalroundplayed = $getUser['operators'][$operator]['operatorpvp_roundwon'] + $getUser['operators'][$operator]['operatorpvp_roundlost']; ?>
        <tr class="item operator-tr
        <?php
        if ($getUser["operators"][$operator]["info"]["category"] == "def") {
            echo "def-tr";
        } else {
            echo "atk-tr";
        }
        ?>">
            <td class="operator-info">
                <picture>
                    <source srcset="<?php echo $getUser["operators"][$operator]["info"]["images"]["badge"] ?>.webp" type="image/webp">
                    <img src="<?php echo $getUser["operators"][$operator]["info"]["images"]["badge"] ?>.jpg" type="image/jpeg" alt="Op">
                </picture>
                <p>
                    <?php echo $getUser["operators"][$operator]["name"] ?>
                </p>
            </td>
            <td class="operator-kills">
                <?php echo $getUser['operators'][$operator]['operatorpvp_kills']; ?>
            </td>
            <td class="operator-death">
                <?php echo $getUser['operators'][$operator]['operatorpvp_death']; ?>
            </td>
            <td class="operator-kd">
                <?php if (empty($getUser['operators'][$operator]['operatorpvp_death'])) {
                    echo "INF";
                } else {
                    echo number_format($getUser['operators'][$operator]['operatorpvp_kills'] / $getUser['operators'][$operator]['operatorpvp_death'], 2, '.', '');
                } ?>
            </td>
            <td class="operator-roundwon">
                <?php echo $getUser['operators'][$operator]['operatorpvp_roundplayed']; ?>
            </td>
            <td class="operator-winrate">
                <?php if (empty($totalroundplayed)) {
                    echo "0.00";
                } else {
                    echo number_format($getUser['operators'][$operator]['operatorpvp_roundwon'] / $totalroundplayed * 100, 2, '.', '');
                } ?>%
            </td>
            <td class="operator-headshot-ratio">
                <?php if (empty($getUser['operators'][$operator]['operatorpvp_headshot'])) {
                    echo "0.00";
                } else {
                    echo
                    number_format($getUser['operators'][$operator]['operatorpvp_headshot'] / $getUser['operators'][$operator]['operatorpvp_kills'] * 100, 2, '.', '');
                } ?>%
            </td>
            <td class="operator-timeplayed">
                <?php if (empty($getUser['operators'][$operator]['operatorpvp_timeplayed'])) {
                    echo "0h0m";
                } else {
                    $operatorTimePlayed = timeConverterHMS($getUser['operators'][$operator]['operatorpvp_timeplayed']);
                    echo $operatorTimePlayed["h"] . "h " . str_pad($operatorTimePlayed["m"], 2, "0", STR_PAD_LEFT) . "m";
                } ?>
            </td>
            <td class="operator-stat-btn">
                <button onclick="operatorPopupDiv(<?php echo $operatorCount ?>)" class="<?php echo $operator ?>-popupbtn operator-popupbtn">Special stats</button>
            </td>
            <td class="operator-stat-td" data-operator="<?php echo $operator ?>" class="<?php echo $operator ?>-popup operator-popup">
                <?php foreach ($getUser['operators'][$operator]["operator_stat"]["pvp"] as $key => $operatorStat) { ?>
                    <div class="operator-stat-div">
                        <p>
                            <span class="special-stat-name">
                                <?php echo $getUser['operators'][$operator]["operator_stat"]["keys"][$key] ?>
                            </span>
                            <?php echo $operatorStat; ?>
                        </p>
                    </div>
                <?php } ?>
            </td>
        </tr>
        <?php $operatorCount++ ?>
    <?php } ?>
    </tbody>
</table>
